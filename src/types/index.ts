/**
 * SOURCE DETECTIVE - Master Type Definitions
 * Supporting 20 Indicators, 5 Core Competencies, 8 Question Types, Evidence Engine, LocalStorage Engine, and AI Usage Logging.
 */

// 0. Source Card Model
export interface SourceCard {
  sourceCardId: string;
  title: string;
  sourceType: string;
  publisher: string;
  publicationDate?: string;
  claim?: string;
  content: string;
  sourceUrl?: string;
  isVerified: boolean;
  isSimulated: boolean;
  riskFlags?: string[];
  learningPurpose?: string;
}

// 1. Competency Domains
export type CompetencyDomain = 'THINK' | 'CHECK' | 'SOLVE' | 'EXPLAIN' | 'GROW';

// 2. 20 Indicator Codes
export type IndicatorId =
  // THINK (T1 - T4)
  | 'T1' | 'T2' | 'T3' | 'T4'
  // CHECK (C1 - C4)
  | 'C1' | 'C2' | 'C3' | 'C4'
  // SOLVE (S1 - S4)
  | 'S1' | 'S2' | 'S3' | 'S4'
  // EXPLAIN (E1 - E4)
  | 'E1' | 'E2' | 'E3' | 'E4'
  // GROW (G1 - G4)
  | 'G1' | 'G2' | 'G3' | 'G4';

export interface IndicatorDefinition {
  id: IndicatorId;
  code: string;
  domain: CompetencyDomain;
  nameTh: string;
  descriptionTh: string;
  maxScore: number; // Standard = 2
}

// 3. Question Types (Allowed Interactive Types)
export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTI_SELECT'
  | 'MATCHING'
  | 'ORDERING'
  | 'EVIDENCE_SELECT'
  | 'DECISION'
  | 'REASON_SELECT'
  | 'REVISION_SELECT'
  | 'SHORT_RESPONSE'
  | 'SELF_CHECK';

// 4. Evidence Types (specified in requirement 11)
export type QuestionNavStatus = 'UNANSWERED' | 'ANSWERED' | 'REVISED' | 'READY_TO_SUBMIT' | 'SUBMITTED';

export type EvidenceType =
  | 'SOURCE'
  | 'AUTHOR'
  | 'DATE'
  | 'CLAIM'
  | 'COMPARISON'
  | 'REASON'
  | 'DECISION'
  | 'REVISION'
  | 'PROCESS'
  | 'STUDENT_VOICE';

export interface Evidence {
  id: string;
  studentId: string;
  missionId: string;
  questionId: string;
  indicatorId: IndicatorId;
  sourceCardId?: string;
  type: EvidenceType;
  title: string;
  content: string;
  sourceTag?: string;
  answer?: any;
  score?: number;
  maxScore?: number;
  attemptNumber?: number;
  hintUsed?: boolean;
  aiUsed?: boolean;
  aiMenuSelected?: string;
  isVerified?: boolean;
  timestamp: string;
}

// 5. Question & Options Model
export interface ChoiceOption {
  id: string;
  label: string;
  isCorrect?: boolean;
  feedback?: string;
  evidenceType?: EvidenceType;
}

export interface MatchingPair {
  id: string;
  item: string;
  targetMatch: string;
}

export interface OrderingItem {
  id: string;
  text: string;
  correctOrder: number;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  sourceName: string;
  content: string;
  reliabilityLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SUSPICIOUS';
  isCorrectEvidence: boolean;
  explanation: string;
}

export type ScoringType = 'EXACT' | 'PARTIAL' | 'RUBRIC';

export interface ScoringRuleConfig {
  scoringType: ScoringType;
  maxScore: number;
  scoringRule?: {
    full: number;
    partial?: number;
    low?: number;
    incorrect: number;
  };
}

export interface Question {
  questionId: string;
  missionId: string;
  indicatorId: IndicatorId;
  indicatorIds?: IndicatorId[];
  type: QuestionType;
  questionType?: QuestionType; // Alias for standardized schema
  stageId?: string;
  stageNumber?: number; // 1, 2, 3, 4
  stageName?: string;
  title: string;
  stem: string; // คำถามหรือสถานการณ์
  questionText?: string; // Alias for stem
  contextScenario?: string; // ข้อความบริบทเพิ่มเติม
  sourceCardId?: string; // Single primary source card ID
  sourceCardIds?: string[]; // Multiple source card IDs used
  maxScore: number; // Standard = 2, 3, 4
  scoringType?: ScoringType;
  scoringRule?: ScoringRuleConfig['scoringRule'];
  options?: ChoiceOption[];
  matchingPairs?: MatchingPair[];
  orderingItems?: OrderingItem[];
  evidenceItems?: EvidenceItem[];
  correctAnswer?: any;
  acceptedAnswers?: any[];
  hint?: string;
  feedback?: string;
  evidenceType?: EvidenceType;
  promptPlaceholder?: string;
  rubricHint?: string;
  multiStepQuestions?: { stepKey: string; title: string; prompt: string; options: ChoiceOption[] }[];
}

export interface StageConfig {
  stageId: string;
  stageNumber: number;
  title: string;
  description: string;
  questionIds: string[];
  indicatorIds: IndicatorId[];
}

export interface MissionAIHelperConfig {
  welcomeMessage?: string;
  contextHints?: Record<string, string>;
  definitions?: Record<string, string>;
  verificationMethods?: string[];
  riskWarnings?: Record<string, string>;
}

export interface MissionEvidenceConfig {
  requiredEvidenceTypes?: EvidenceType[];
  autoVerifyThreshold?: number; // e.g. 0.75
}

export interface MissionResultConfig {
  passThreshold?: number;
  title?: string;
}

export interface MissionConfig {
  missionId: string;
  caseCode: string;
  missionTitle: string;
  missionSubtitle?: string;
  missionDescription: string;
  coverIcon?: string;
  estimatedMinutes?: number;
  totalScore: number;
  stages: StageConfig[];
  sourceCards: SourceCard[];
  questions: Question[];
  indicators: IndicatorId[];
  scoringRules?: Record<string, ScoringRuleConfig>;
  aiHelperConfig?: MissionAIHelperConfig;
  evidenceConfig?: MissionEvidenceConfig;
  resultConfig?: MissionResultConfig;
}

// 6. Student & Registration Model (Privacy by Design)
export interface StudentAccount {
  studentId: string; // e.g. "SD-7K4P2"
  nickname: string;  // ฉายานักสืบ / ชื่อเล่น
  username: string;  // English alphanumeric, max 10 chars
  passwordHash: string; // SHA-256 hashed password
  createdAt: string;
  lastLoginAt: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED';
}

export interface TeacherStudentMapping {
  studentId: string;
  realFirstName?: string;
  realLastName?: string;
  studentNumber?: string;
  classroom?: string;
  updatedAt: string;
}

export interface Student {
  studentId: string;
  nickname?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  studentNumber?: string;
  gradeLevel?: string; // e.g. "ม.1/1"
  registeredAt: string;
  lastActiveAt?: string;
}

// 7. Answer & Submission Model
export interface StudentAnswerValue {
  selectedOptionId?: string;
  selectedOptionIds?: string[];
  matchedPairs?: { itemId: string; matchedTarget: string }[];
  orderedItemIds?: string[];
  selectedEvidenceIds?: string[];
  decisionChoice?: 'BELIEVE' | 'REJECT' | 'NEED_MORE_EVIDENCE';
  shortResponseText?: string;
  selfCheckRating?: number; // 1 - 4
  reasoningText?: string;
  sourceCardId?: string;
  multiStepAnswers?: Record<string, string>;
  // Decision Revision tracking fields:
  initialDecision?: string;
  newEvidence?: string;
  finalDecision?: string;
  decisionChanged?: boolean;
  revisionReason?: string;
}

export interface QuestionAttempt {
  attemptId: string;
  studentId: string;
  missionId: string;
  questionId: string;
  indicatorId: IndicatorId;
  sourceCardId?: string;
  answer: StudentAnswerValue;
  score: number;
  maxScore: number; // Default 4
  attemptNumber?: number;
  hintUsed?: boolean;
  aiUsed?: boolean;
  aiMenuSelected?: string;
  evidenceType?: EvidenceType;
  timestamp: string;
  feedbackNote?: string;
}

// 8. Mission Model
export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface Mission {
  missionId: string;
  number: number;
  caseCode: string; // e.g. "CASE-001"
  title: string;
  subtitle: string;
  description: string;
  coverIcon: string;
  indicatorIds: IndicatorId[];
  estimatedMinutes: number;
  status: MissionStatus;
  unlocked: boolean;
  totalQuestionsCount: number;
}

// 9. Results & Scoring Models
export interface MissionResult {
  missionId: string;
  studentId: string;
  score: number;
  maxScore: number;
  completed: boolean;
  completedAt: string;
  attemptsCount: number;
  indicatorScores: Record<IndicatorId, number>;
}

export interface AssessmentResult {
  assessmentId: string;
  type: 'BASELINE' | 'POST_TEST';
  studentId: string;
  score: number;
  maxScore: number; // Default 40
  completedAt: string;
  domainScores: Record<CompetencyDomain, number>;
  indicatorScores: Record<IndicatorId, number>;
}

export interface StudentProgress {
  studentId: string;
  totalPoints: number;
  maxPossiblePoints: number;
  completedMissionIds: string[];
  baselineStatus: 'NOT_STARTED' | 'COMPLETED';
  postTestStatus: 'NOT_STARTED' | 'COMPLETED';
  baselineScore?: number;
  postTestScore?: number;
  lastUpdated: string;
}

// 10. Screen Navigation Types
export type AppScreen =
  | 'HOME'
  | 'STUDENT_MODE'
  | 'MISSION_MAP'
  | 'MISSION_DETAIL'
  | 'ASSESSMENT'
  | 'RESULT'
  | 'TEACHER_MODE'
  | 'EVIDENCE_PREVIEW'
  | 'SCORE_REPORT';

export interface AssessmentContext {
  type: 'BASELINE' | 'POST_TEST' | 'MISSION';
  missionId?: string;
}

// 11. AI Helper Usage Log Model
export interface AIQueryLog {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  contextScreen?: string;
  questionId?: string;
  sourceCardId?: string;
  aiMenuSelected?: string;
}

export interface AIUsageLog {
  logId: string;
  studentId: string;
  missionId?: string;
  questionId?: string;
  sourceCardId?: string;
  aiMenuSelected?: string;
  aiUsed: boolean;
  aiOpenCount: number;
  aiSessionCount: number;
  aiQueryCount: number;
  aiQueries: AIQueryLog[];
  aiOpenTimestamp?: string;
  aiCloseTimestamp?: string;
  timestamp: string;
}

// 12. Security & Role-Based Access Control
export type UserRole = 'STUDENT' | 'TEACHER';

export interface TeacherSession {
  token: string;
  role: 'TEACHER';
  authenticatedAt: string;
  expiresAt: number;
}

export interface TeacherAccessResult {
  success: boolean;
  token?: string;
  role?: 'TEACHER';
  expiresAt?: number;
  error?: string;
  locked?: boolean;
  remainingSeconds?: number;
}
