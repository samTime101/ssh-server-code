from datetime import timedelta
from collections import defaultdict
from typing import Dict, List, Optional, Any, Tuple
from datetime import date
from django.utils import timezone
from mongo.models import Submissions, Question, Category, SubCategory
from core.constants.status import APPROVED_STATUS


class UserStatisticsService:
    """
    Service for calculating user statistics based on their submission attempts.
    All business logic for statistics is encapsulated here.
    """

    def __init__(self, user_guid: str):
        self.user_guid = user_guid
        self.submissions = None
        self.all_attempts = []
        self.questions_map = {}
        self.question_category_names: Dict[str, set] = {}
        self.question_durations = {}  # question_id -> duration in seconds
        self.first_attempt_dates = {}  # question_id -> first attempt date

    @staticmethod
    def _get_current_calendar_week_bounds(
        today: Optional[date] = None,
    ) -> Tuple[date, date]:
        """
        Return (start, end) for the current calendar week (Sun–Sat).
        Used by questions_solved_this_week and weekly_activity so both match.
        """
        if today is None:
            today = timezone.now().date()
        days_since_sunday = (today.weekday() + 1) % 7  # Sun=0, Mon=1, …, Sat=6
        week_start = today - timedelta(days=days_since_sunday)
        week_end = week_start + timedelta(days=6)
        return week_start, week_end

    def get_statistics(self) -> Dict[str, Any]:
        """
        Main method to generate comprehensive user statistics.
        Returns a dictionary with all statistics data.
        """
        self._load_data()
        
        basic_metrics = self._calculate_basic_metrics()
        category_performance = self._calculate_category_performance()
        accuracy_trend = self._calculate_accuracy_trend()
        weekly_activity = self._calculate_weekly_activity()
        streaks = self._calculate_streaks()
        
        # Get favorite, strongest, weakest categories
        favorite_category = self._get_favorite_category(category_performance)
        strongest_category = self._get_strongest_category(category_performance)
        weakest_category = self._get_weakest_category(category_performance)
        
        # Calculate total approved questions
        total_approved_questions = Question.objects(status=APPROVED_STATUS).count()
        
        # Update total_categories_practiced based on actual categories
        basic_metrics['total_categories_practiced'] = len(category_performance)
        
        return {
            **basic_metrics,
            **streaks,
            'favorite_category': favorite_category,
            'strongest_category': strongest_category,
            'weakest_category': weakest_category,
            'accuracy_trend': accuracy_trend,
            'weekly_activity': weekly_activity,
            'correct_vs_incorrect': {
                'correct': basic_metrics['total_correct_answers'],
                'incorrect': basic_metrics['total_incorrect_answers'],
                'unattempted': max(0, total_approved_questions - basic_metrics['total_questions_attempted'])
            },
            'category_performance': category_performance
        }

    def _load_data(self):
        """
        Load all submissions and attempts for the user.
        Optimizes by pre-fetching referenced questions to avoid N+1 queries.
        Also calculates question durations and tracks first attempt dates.
        """
        self.submissions = list(Submissions.objects(user_guid=self.user_guid))
        
        # Collect all attempts
        self.all_attempts = []
        question_ids = set()
        
        for submission in self.submissions:
            if submission.attempts:
                self.all_attempts.extend(submission.attempts)
                for attempt in submission.attempts:
                    if hasattr(attempt, 'question') and attempt.question:
                        question_ids.add(attempt.question.id)
        
        # Batch fetch all questions and prefetch category names to avoid N+1 queries
        if question_ids:
            questions = list(Question.objects(id__in=list(question_ids)))
            self.questions_map = {str(q.id): q for q in questions}
            self._prefetch_question_categories(questions)
        else:
            self.questions_map = {}
            self.question_category_names = {}
        
        # Calculate question durations and track first attempt dates
        self._calculate_question_durations()
        self._track_first_attempt_dates()

    def _prefetch_question_categories(self, questions: List[Question]) -> None:
        """
        Batch-load subcategory and category references without dereferencing per attempt.
        MongoEngine has no select_related(); raw document refs are resolved in bulk instead.
        """
        self.question_category_names = {}
        if not questions:
            return

        subcategory_ids = set()
        question_to_subcat_ids: Dict[str, list] = {}

        for question in questions:
            qid = str(question.id)
            refs = question._data.get('sub_categories') or []
            ids = []
            for ref in refs:
                ref_id = ref.id if hasattr(ref, 'id') else ref
                ids.append(ref_id)
                subcategory_ids.add(ref_id)
            question_to_subcat_ids[qid] = ids

        if not subcategory_ids:
            return

        subcat_to_cat_id: Dict[Any, Any] = {}
        category_ids = set()
        for subcategory in SubCategory.objects(id__in=list(subcategory_ids)):
            cat_ref = subcategory._data.get('category')
            if not cat_ref:
                continue
            cat_id = cat_ref.id if hasattr(cat_ref, 'id') else cat_ref
            subcat_to_cat_id[subcategory.id] = cat_id
            category_ids.add(cat_id)

        cat_id_to_name = {
            category.id: category.name
            for category in Category.objects(id__in=list(category_ids))
        }

        for qid, subcat_ids in question_to_subcat_ids.items():
            self.question_category_names[qid] = {
                cat_id_to_name[subcat_to_cat_id[sid]]
                for sid in subcat_ids
                if sid in subcat_to_cat_id and subcat_to_cat_id[sid] in cat_id_to_name
            }

    def _calculate_basic_metrics(self) -> Dict[str, Any]:
        """
        Calculate basic user metrics: attempts, accuracy, study time.
        """
        total_attempts = len(self.all_attempts)
        total_correct = sum(1 for attempt in self.all_attempts if attempt.is_correct)
        total_incorrect = total_attempts - total_correct
        
        overall_accuracy = round((total_correct / total_attempts) * 100, 2) if total_attempts > 0 else 0.0
        
        # Get time-based counts using attempted_at from individual attempts
        today = timezone.now().date()
        current_week_start, current_week_end = self._get_current_calendar_week_bounds(today)
        
        questions_today = 0
        questions_this_week = 0
        
        for attempt in self.all_attempts:
            if not hasattr(attempt, 'attempted_at') or not attempt.attempted_at:
                continue
            attempt_date = attempt.attempted_at.date() if hasattr(attempt.attempted_at, 'date') else attempt.attempted_at
            if attempt_date == today:
                questions_today += 1
            if current_week_start <= attempt_date <= current_week_end:
                questions_this_week += 1
        
        # Calculate average time per question using calculated durations
        average_time_per_question = None
        if self.question_durations:
            total_duration = sum(self.question_durations.values())
            average_time_per_question = round(total_duration / len(self.question_durations), 2)
        
        # Calculate total study time from completed submissions                  
        total_study_time = self._calculate_total_study_time()
        
        # Calculate average daily study time
        average_daily_study_time = self._calculate_average_daily_study_time()
        
        # Get unique attempted question count
        attempted_question_ids = {
            str(attempt.question.id) 
            for attempt in self.all_attempts 
            if hasattr(attempt, 'question') and attempt.question
        }
        unique_questions_attempted = len(attempted_question_ids)
        
        return {
            'overall_accuracy': overall_accuracy,
            'total_questions_attempted': unique_questions_attempted,
            'total_correct_answers': total_correct,
            'total_incorrect_answers': total_incorrect,
            'average_time_per_question': average_time_per_question,
            'total_study_time': total_study_time,
            'questions_solved_today': questions_today,
            'questions_solved_this_week': questions_this_week,
            'average_daily_study_time': average_daily_study_time,
            'total_categories_practiced': 0,  # Will be updated by category performance
        }

    def _calculate_category_performance(self) -> List[Dict[str, Any]]:
        """
        Calculate performance metrics for each category.
        
        Returns list of category performance with:
        - category_name: name of the category
        - accuracy: percentage accuracy in this category
        - questions_attempted: number of questions attempted in this category
        - total_questions: total approved questions in this category (from DB)
        - average_time: average time spent on questions in this category
        """
        category_stats = defaultdict(lambda: {'correct': 0, 'total': 0, 'durations': []})
        
        # Calculate per-category statistics from attempts
        for attempt in self.all_attempts:
            if hasattr(attempt, 'question') and attempt.question:
                question_id = str(attempt.question.id)
                categories = self.question_category_names.get(question_id, set())
                
                for category_name in categories:
                    category_stats[category_name]['total'] += 1
                    if attempt.is_correct:
                        category_stats[category_name]['correct'] += 1
                    
                    # Add duration if available
                    if question_id in self.question_durations:
                        category_stats[category_name]['durations'].append(
                            self.question_durations[question_id]
                        )
        
        # Get total approved questions per category
        categories = Category.objects(status=APPROVED_STATUS)
        category_question_counts = {}
        
        for category in categories:
            # Count approved questions that have subcategories belonging to this category
            count = Question.objects(
                status=APPROVED_STATUS,
                sub_categories__category=category
            ).count()
            category_question_counts[category.name] = count
        
        # Build category performance list
        category_performance = []
        for category_name, stats in category_stats.items():
            category_accuracy = (stats['correct'] / stats['total']) * 100 if stats['total'] > 0 else 0
            total_questions = category_question_counts.get(category_name, 0)
            
            # Calculate average time for this category
            average_time = None
            if stats['durations']:
                average_time = round(sum(stats['durations']) / len(stats['durations']), 2)
            
            category_performance.append({
                'category_name': category_name,
                'accuracy': round(category_accuracy, 2),
                'questions_attempted': stats['total'],
                'total_questions': total_questions,
                'average_time': average_time
            })
        
        # Sort by accuracy descending
        category_performance.sort(key=lambda x: x['accuracy'], reverse=True)
        
        return category_performance

    def _calculate_accuracy_trend(self) -> List[Dict[str, Any]]:
        """
        Calculate daily accuracy trend for the last 7 calendar days.
        Every day in the range is included; days with no activity have zero values.
        Uses attempted_at from individual attempts.
        """
        today = timezone.now().date()
        range_start = today - timedelta(days=6)
        daily_stats = defaultdict(lambda: {'correct': 0, 'total': 0})
        
        for attempt in self.all_attempts:
            if not hasattr(attempt, 'attempted_at') or not attempt.attempted_at:
                continue
            attempt_date = attempt.attempted_at.date() if hasattr(attempt.attempted_at, 'date') else attempt.attempted_at
            if attempt_date >= range_start:
                daily_stats[attempt_date]['total'] += 1
                if attempt.is_correct:
                    daily_stats[attempt_date]['correct'] += 1
        
        # Return exactly 7 calendar days (oldest first), including zero-activity days
        accuracy_trend = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            stats = daily_stats.get(date, {'correct': 0, 'total': 0})
            day_accuracy = (stats['correct'] / stats['total']) * 100 if stats['total'] > 0 else 0
            accuracy_trend.append({
                'date': date,
                'accuracy': round(day_accuracy, 2),
                'questions_attempted': stats['total']
            })
        
        return accuracy_trend

    def _calculate_weekly_activity(self) -> List[Dict[str, int]]:
        """
        Calculate activity for each day of the current week (Sun–Sat).
        Only includes this week's data; all 7 days are present even with no activity.
        Uses attempted_at from individual attempts.
        """
        current_week_start, current_week_end = self._get_current_calendar_week_bounds()
        
        # Map date -> {'questions': int, 'attempt_times': list}
        daily_stats = {}
        
        for attempt in self.all_attempts:
            if not hasattr(attempt, 'attempted_at') or not attempt.attempted_at:
                continue
            attempt_date = attempt.attempted_at.date() if hasattr(attempt.attempted_at, 'date') else attempt.attempted_at
            
            if current_week_start <= attempt_date <= current_week_end:
                if attempt_date not in daily_stats:
                    daily_stats[attempt_date] = {'questions': 0, 'attempt_times': []}
                daily_stats[attempt_date]['questions'] += 1
                daily_stats[attempt_date]['attempt_times'].append(attempt.attempted_at)
        
        # Build all 7 days of the current week (Sun–Sat order)
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        weekly_activity = []
        
        for i, day_name in enumerate(days):
            date = current_week_start + timedelta(days=i)
            stats = daily_stats.get(date, {'questions': 0, 'attempt_times': []})
            
            study_time_minutes = None
            if stats['attempt_times']:
                min_time = min(stats['attempt_times'])
                max_time = max(stats['attempt_times'])
                duration_seconds = (max_time - min_time).total_seconds()
                if duration_seconds > 0:
                    study_time_minutes = int(duration_seconds / 60)
            
            weekly_activity.append({
                'day': day_name,
                'questions': stats['questions'],
                'study_time': study_time_minutes
            })
        
        return weekly_activity

    def _calculate_streaks(self) -> Dict[str, int]:
        """
        Calculate current and longest streak of consecutive days with new unique questions.
        A day counts only if the user attempted at least one new unique question.
        """
        if not self.first_attempt_dates:
            return {
                'current_streak': 0,
                'longest_streak': 0
            }
        
        # Get unique dates when new questions were attempted (first attempt only)
        activity_dates = set(self.first_attempt_dates.values())
        
        if not activity_dates:
            return {
                'current_streak': 0,
                'longest_streak': 0
            }
        
        sorted_dates = sorted(activity_dates)
        today = timezone.now().date()
        
        # Calculate current streak
        current_streak = 0
        if today in activity_dates or (today - timedelta(days=1)) in activity_dates:
            # Start from today or yesterday
            check_date = today if today in activity_dates else today - timedelta(days=1)
            
            while check_date in activity_dates:
                current_streak += 1
                check_date -= timedelta(days=1)
        
        # Calculate longest streak
        longest_streak = 0
        temp_streak = 1
        
        for i in range(1, len(sorted_dates)):
            if sorted_dates[i] - sorted_dates[i-1] == timedelta(days=1):
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1
        
        longest_streak = max(longest_streak, temp_streak) if sorted_dates else 0
        
        return {
            'current_streak': current_streak,
            'longest_streak': longest_streak
        }

    def _get_favorite_category(self, category_performance: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Get the favorite category (most attempted).
        """
        if not category_performance:
            return None
        
        # Sort by questions_attempted descending
        sorted_by_attempts = sorted(
            category_performance, 
            key=lambda x: x['questions_attempted'], 
            reverse=True
        )
        
        return sorted_by_attempts[0] if sorted_by_attempts else None

    def _get_strongest_category(self, category_performance: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Get the strongest category (highest accuracy).
        """
        if not category_performance:
            return None
        
        # Already sorted by accuracy descending
        return category_performance[0] if category_performance else None

    def _get_weakest_category(self, category_performance: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Get the weakest category (lowest accuracy).
        """
        if not category_performance:
            return None
        
        # Get the last one (lowest accuracy)
        return category_performance[-1] if category_performance else None

    def _get_submission_date(self, submission) -> Optional[Any]:
        """
        Get the submission date, preferring submitted_at over started_at.
        """
        if submission.submitted_at:
            # Convert to date
            if hasattr(submission.submitted_at, 'date'):
                return submission.submitted_at.date()
            return submission.submitted_at
        elif submission.started_at:
            if hasattr(submission.started_at, 'date'):
                return submission.started_at.date()
            return submission.started_at
        return None

    def _calculate_question_durations(self):
        """
        Calculate the duration spent on each question.
        
        For each submission:
        - First question: duration = first_attempt.attempted_at - submission.started_at
        - Subsequent questions: duration = current_attempt.attempted_at - previous_attempt.attempted_at
        
        Stores the first recorded duration for each unique question.
        """
        for submission in self.submissions:
            if not submission.started_at or not submission.attempts:
                continue
            
            # Sort attempts by attempted_at
            sorted_attempts = sorted(
                submission.attempts,
                key=lambda a: a.attempted_at if hasattr(a, 'attempted_at') and a.attempted_at else timezone.now()
            )
            
            for i, attempt in enumerate(sorted_attempts):
                if not hasattr(attempt, 'question') or not attempt.question:
                    continue
                
                question_id = str(attempt.question.id)
                
                # Only store duration for the first time this question was attempted
                if question_id in self.question_durations:
                    continue
                
                # Calculate duration
                if i == 0:
                    # First question: use submission start time
                    duration = attempt.attempted_at - submission.started_at
                else:
                    # Subsequent questions: use previous attempt time
                    prev_attempt = sorted_attempts[i - 1]
                    duration = attempt.attempted_at - prev_attempt.attempted_at
                
                # Store duration in seconds
                duration_seconds = duration.total_seconds()
                
                # Sanity check: ignore unrealistic durations (< 1 second or > 1 hour)
                if 1 <= duration_seconds <= 3600:
                    self.question_durations[question_id] = duration_seconds

    def _track_first_attempt_dates(self):
        """
        Track the first attempt date for each unique question.
        Used for streak calculation.
        """
        for submission in self.submissions:
            if not submission.attempts:
                continue
            
            for attempt in submission.attempts:
                if not hasattr(attempt, 'question') or not attempt.question:
                    continue
                
                question_id = str(attempt.question.id)
                
                # Only record the first attempt date
                if question_id not in self.first_attempt_dates:
                    if hasattr(attempt, 'attempted_at') and attempt.attempted_at:
                        attempt_date = attempt.attempted_at.date() if hasattr(attempt.attempted_at, 'date') else attempt.attempted_at
                        self.first_attempt_dates[question_id] = attempt_date

    def _calculate_total_study_time(self) -> Optional[int]:
        """
        Calculate total study time by summing submission durations.
        Only counts completed submissions with both started_at and submitted_at.
        Returns time in minutes, or None if no completed submissions.
        """
        total_seconds = 0
        completed_count = 0
        
        for submission in self.submissions:
            if submission.submitted_at and submission.started_at:
                duration = submission.submitted_at - submission.started_at
                total_seconds += duration.total_seconds()
                completed_count += 1
        
        # Convert seconds to minutes
        return int(total_seconds / 60) if completed_count > 0 else None

    def _calculate_average_daily_study_time(self) -> Optional[float]:
        """
        Calculate average daily study time using actual study durations grouped by calendar day.
        Returns average time in minutes per day, or None if no data.
        """
        daily_study_time = defaultdict(float)
        
        for submission in self.submissions:
            if submission.submitted_at and submission.started_at:
                submission_date = self._get_submission_date(submission)
                if submission_date:
                    duration = submission.submitted_at - submission.started_at
                    daily_study_time[submission_date] += duration.total_seconds()
        
        if not daily_study_time:
            return None
        
        # Calculate average across days with activity (in minutes)
        total_time = sum(daily_study_time.values())
        num_days = len(daily_study_time)
        
        return round((total_time / 60) / num_days, 2) if num_days > 0 else None
