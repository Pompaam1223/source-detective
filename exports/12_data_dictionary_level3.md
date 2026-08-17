# SOURCE DETECTIVE — RESEARCH DATA DICTIONARY LEVEL-3
## Version: RFA-v1.0 | 16 August 2026

### 1. Overview
This Data Dictionary documents all research variables, schema mappings, and derivation formulas for the **SOURCE DETECTIVE Level-3 Forensic Audit Dataset**.

### 2. Variable Definitions
#### `student_id` (Student Identifier)
- **Type:** String
- **Measurement Level:** Nominal
- **Range / Allowed Values:** SD-XXXXX
- **Missing Code:** NOT_AVAILABLE
- **Source:** `students.studentId`
- **Formula / Derivation:** Unique Pseudonymized Key

#### `alias` (Student Persona Alias)
- **Type:** String
- **Measurement Level:** Nominal
- **Range / Allowed Values:** Text
- **Missing Code:** NOT_AVAILABLE
- **Source:** `students.nickname`
- **Formula / Derivation:** Self-Selected Avatar Callout

#### `pre_total` (Pre-Test Total Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.baseline.score`
- **Formula / Derivation:** Direct Assessment Sum

#### `post_total` (Post-Test Total Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.post_test.score`
- **Formula / Derivation:** Direct Assessment Sum

#### `raw_gain` (Absolute Raw Score Gain)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** -40.00 - +40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `Derived (Post - Pre)`
- **Formula / Derivation:** post_total - pre_total

#### `normalized_gain` (Normalized Learning Gain (g))
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.0000 - 1.0000
- **Missing Code:** NOT_AVAILABLE
- **Source:** `Derived (Hake 1998)`
- **Formula / Derivation:** (post_total - pre_total) / (40 - pre_total)

#### `M1_total` (Mission 1 Total Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `mission_results.m1.score`
- **Formula / Derivation:** Formative Module Sum

#### `M2_total` (Mission 2 Total Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `mission_results.m2.score`
- **Formula / Derivation:** Formative Module Sum

#### `M3_total` (Mission 3 Total Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `mission_results.m3.score`
- **Formula / Derivation:** Formative Module Sum

#### `M4_total` (Mission 4 Total Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 40.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `mission_results.m4.score`
- **Formula / Derivation:** Formative Module Sum

#### `total_missions` (Total Formative Missions Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 160.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `Derived (M1+M2+M3+M4)`
- **Formula / Derivation:** M1_total + M2_total + M3_total + M4_total

#### `total_system` (Total System Score)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 240.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `progress.totalPoints`
- **Formula / Derivation:** pre_total + total_missions + post_total

#### `T1_T4` (Domain THINK Mastery)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 1.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.domainScores.THINK`
- **Formula / Derivation:** Ratio of Correct Analytical Items

#### `C1_C4` (Domain CHECK Mastery)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 1.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.domainScores.CHECK`
- **Formula / Derivation:** Ratio of Correct Verification Items

#### `S1_S4` (Domain SOLVE Mastery)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 1.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.domainScores.SOLVE`
- **Formula / Derivation:** Ratio of Correct Problem-Solving Items

#### `E1_E4` (Domain EXPLAIN Mastery)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 1.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.domainScores.EXPLAIN`
- **Formula / Derivation:** Ratio of Correct Reasoned Items

#### `G1_G4` (Domain GROW Mastery)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0.00 - 1.00
- **Missing Code:** NOT_AVAILABLE
- **Source:** `assessments.domainScores.GROW`
- **Formula / Derivation:** Ratio of Correct Reflection Items

#### `AI_usage_total` (Total AI Socratic Queries)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0 - 100
- **Missing Code:** NOT_AVAILABLE
- **Source:** `ai_logs.aiQueryCount`
- **Formula / Derivation:** Sum of Socratic Prompts

#### `evidence_total` (Total Evidence Pieces in Locker)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0 - 100
- **Missing Code:** NOT_AVAILABLE
- **Source:** `evidences collection`
- **Formula / Derivation:** Count of User Submitted Evidences

#### `attempt_total` (Total Item Attempt Logs)
- **Type:** Numeric
- **Measurement Level:** Scale
- **Range / Allowed Values:** 0 - 100
- **Missing Code:** NOT_AVAILABLE
- **Source:** `attempts collection`
- **Formula / Derivation:** Count of Discrete Attempts


### 3. Missing Data Conventions
- `NOT_AVAILABLE`: Variable is applicable in theory but telemetry was not recorded in production schema.
- `NO_RECORD`: Database collection exists but contains 0 documents for this specific interaction.
- `NO_AI_RECORD`: Student completed the task without triggering AI Socratic help.
- `NO_EVIDENCE_RECORD`: Student completed the question without saving an auxiliary evidence card.
