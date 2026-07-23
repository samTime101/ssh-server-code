const STORAGE_KEY = "sisani.session_timer.v1";

export interface TimedSessionRef {
  submissionId: string;
  endsAtMs: number;
}

interface SessionTimerStorage {
  exam: TimedSessionRef | null;
  mock: TimedSessionRef | null;
  nonContinuableIds: string[];
}

const EMPTY: SessionTimerStorage = {
  exam: null,
  mock: null,
  nonContinuableIds: [],
};

function readStorage(): SessionTimerStorage {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<SessionTimerStorage>;
    return {
      exam: parsed.exam ?? null,
      mock: parsed.mock ?? null,
      nonContinuableIds: Array.isArray(parsed.nonContinuableIds) ? parsed.nonContinuableIds : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

function writeStorage(state: SessionTimerStorage): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

export function setExamTimer(submissionId: string, endsAtMs: number): void {
  writeStorage({ ...readStorage(), exam: { submissionId, endsAtMs } });
}

export function clearExamTimer(): void {
  writeStorage({ ...readStorage(), exam: null });
}

export function setMockTimer(submissionId: string, endsAtMs: number): void {
  writeStorage({ ...readStorage(), mock: { submissionId, endsAtMs } });
}

export function clearMockTimer(): void {
  writeStorage({ ...readStorage(), mock: null });
}

export function markSubmissionNonContinuable(submissionId: string): void {
  if (!submissionId) return;
  const state = readStorage();
  if (state.nonContinuableIds.includes(submissionId)) return;
  writeStorage({
    ...state,
    nonContinuableIds: [...state.nonContinuableIds, submissionId],
  });
}

export function isSubmissionNonContinuable(submissionId: string): boolean {
  return readStorage().nonContinuableIds.includes(submissionId);
}

export function getActiveExamTimer(): TimedSessionRef | null {
  const exam = readStorage().exam;
  if (!exam) return null;
  if (exam.endsAtMs <= Date.now()) {
    clearExamTimer();
    return null;
  }
  return exam;
}

export function getActiveMockTimer(): TimedSessionRef | null {
  const mock = readStorage().mock;
  if (!mock) return null;
  if (mock.endsAtMs <= Date.now()) {
    clearMockTimer();
    return null;
  }
  return mock;
}
