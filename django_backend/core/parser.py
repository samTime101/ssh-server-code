import csv
import io
import json
from rest_framework.parsers import MultiPartParser, DataAndFiles
from rest_framework.exceptions import ParseError
from mongo.models import Question, SubCategory, Option
from core.constants.status import APPROVED_STATUS, QUESTION_STATUSES
from bson import ObjectId
from core.constants.csv import CSV_REQUIRED_FIELDS, CSV_VALID_OPTION_TYPES, CSV_VALID_DIFFICULTIES

# data vanne field ma question ko JSON data aauxa, this will just extract that
#  and return as dict along with files
class QuestionMultipartJsonParser(MultiPartParser):
    question_data_field = 'data'
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(stream, media_type=media_type, parser_context=parser_context)
        data = result.data
        files = result.files
        question_json = data.get(self.question_data_field)
        if not question_json:
            raise ParseError(f"Missing '{self.question_data_field}' field")
        try:
            question_dict = json.loads(question_json.strip())
        except json.JSONDecodeError as e:
            raise ParseError(f"Invalid JSON in '{self.question_data_field}': {str(e)}")
        
        return DataAndFiles(question_dict, files)

## March 9 2026
## Ishan Upadhyay
class QuestionCSVParser:
    """Parser for converting CSV rows to Question objects"""
    
    def __init__(self):
        self.errors = []
        self.created_questions = []
    
    def parse_csv(self, csv_file):
        try:
            # Decode CSV file
            csv_text = csv_file.read().decode('utf-8-sig')
            csv_reader = csv.DictReader(io.StringIO(csv_text))
            
            if not csv_reader.fieldnames:
                self.errors.append("CSV file is empty or invalid format")
                return self._return_result()
            
            for row_num, row in enumerate(csv_reader, start=2):  # start=2 because header is row 1
                try:
                    question = self._parse_row(row, row_num)
                    if question:
                        self.created_questions.append(question)
                except Exception as e:
                    self.errors.append(f"Row {row_num}: {str(e)}")
                    continue
            
            return self._return_result()
        
        except Exception as e:
            self.errors.append(f"Failed to parse CSV: {str(e)}")
            return self._return_result()

    def _return_result(self):
        return {
            'created': len(self.created_questions),
            'errors': self.errors,
            'questions': self.created_questions
        }
    
    def _parse_row(self, row, row_num):
        """Parse a single CSV row into a Question object"""
        row = {k: v.strip() if v else '' for k, v in row.items() if k}
        
        # Validate required fields
        for field in CSV_REQUIRED_FIELDS:
            if field not in row or not row[field]:
                raise ValueError(f"Missing required field: {field}")
        
        question_text = row['question_text']
        contributor = row['contributor']
        contributor_specialization = row.get('contributor_specialization', '')
        
        option_type = row['option_type'].lower()
        if option_type not in CSV_VALID_OPTION_TYPES:
            raise ValueError(f"option_type must be one of {CSV_VALID_OPTION_TYPES}, got: {option_type}")
        
        difficulty = row.get('difficulty', 'easy').lower()
        if difficulty and difficulty not in CSV_VALID_DIFFICULTIES:
            raise ValueError(f"difficulty must be one of {CSV_VALID_DIFFICULTIES}")
        
        sub_categories = self._parse_sub_categories(row['sub_categories'])
        if not sub_categories:
            raise ValueError("sub_categories must resolve to at least one valid SubCategory")
        
        options = self._parse_options(row, option_type)
        if not options:
            raise ValueError("options must contain at least one option")
        
        description = row.get('description', '')
        
        status = row.get('status', APPROVED_STATUS) or APPROVED_STATUS
        if status not in QUESTION_STATUSES:
            raise ValueError(f"status must be one of {QUESTION_STATUSES}, got: {status}")
        
        question = Question(
            question_text=question_text,
            contributor=contributor,
            contributor_specialization=contributor_specialization,
            option_type=option_type,
            difficulty=difficulty,
            sub_categories=sub_categories,
            options=[Option(**opt) for opt in options],
            description=description,
            status=status
        )
        question.save()
        
        return question
    
    def _parse_sub_categories(self, sub_categories_str):
        if not sub_categories_str:
            return []
        
        items = [item.strip() for item in sub_categories_str.split(',')]
        sub_categories = []
        
        for item in items:
            try:
                # Try as ObjectId first
                if ObjectId.is_valid(item):
                    sc = SubCategory.objects(id=ObjectId(item)).first()
                    if sc:
                        sub_categories.append(sc)
                    else:
                        raise ValueError(f"SubCategory with ID {item} not found")
                else:
                    # Try as name
                    sc = SubCategory.objects(name__iexact=item).first()
                    if sc:
                        sub_categories.append(sc)
                    else:
                        raise ValueError(f"SubCategory with name '{item}' not found")
            except Exception as e:
                raise ValueError(f"Invalid sub_category reference '{item}': {str(e)}")
        
        return sub_categories
    
    def _parse_options(self, row, option_type):
        # Allow checking either a JSON 'options' field or flat columns like option_A_text, option_A_is_true
        if row.get('options'):
            try:
                options = json.loads(row['options'])
                validated_options = []
                for opt in options:
                    validated_options.append({
                        'label': str(opt['label']).strip(),
                        'text': str(opt['text']).strip(),
                        'is_true': str(opt.get('is_true', '')).lower() in ['true', '1', 'yes', 'y']
                    })
            except Exception as e:
                raise ValueError(f"Failed to parse 'options' JSON: {str(e)}")
        else:
            validated_options = []
            labels = ['A', 'B', 'C', 'D', 'E', 'F']
            for label in labels:
                text_key = f'option_{label}_text'
                true_key = f'option_{label}_is_true'
                if row.get(text_key):
                    validated_options.append({
                        'label': label,
                        'text': row[text_key].strip(),
                        'is_true': str(row.get(true_key, '')).lower() in ['true', '1', 'yes', 'y']
                    })
        
        if option_type == 'single':
            true_count = sum(1 for opt in validated_options if opt['is_true'])
            if true_count != 1:
                raise ValueError("Single choice questions must have exactly 1 correct answer")
        elif option_type == 'multiple':
            true_count = sum(1 for opt in validated_options if opt['is_true'])
            if true_count < 1:
                raise ValueError("Multiple choice questions must have at least 1 correct answer")
        
        return validated_options
        return DataAndFiles(question_dict, files=files)
