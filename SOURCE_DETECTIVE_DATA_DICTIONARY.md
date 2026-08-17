# SOURCE DETECTIVE — DATA DICTIONARY
## Version: RDFE-v1.0 | 16 August 2026

เอกสารพจนานุกรมข้อมูล (Data Dictionary) สำหรับชุดข้อมูลงานวิจัยและรายงานนวัตกรรมระบบ **SOURCE DETECTIVE (นักสืบข่าวสาร)**
อธิบายความหมาย ชนิดข้อมูล แหล่งที่มา (Source Collection/Component) ช่วงค่าที่ยอมรับได้ (Allowed Values) และความหมายของค่าว่าง (Missing Value Handling)

---

## 1. FILE 01: `students_summary.csv`

| Field Name | Data Type | Meaning (ความหมาย) | Source Collection / Code | Allowed Values | Missing Value Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `studentId` | String | รหัสประจำตัวนักเรียนแบบไม่ระบุตัวตน (Anonymized Student ID) | `students`, `student_accounts` | รูปแบบ `SD-XXXXX` | - (Primary Key) |
| `alias` | String | ฉายา/ชื่อเล่นที่นักเรียนใช้ในระบบ | `students.nickname` | ตัวอักษรความยาว 1–30 ตัว | `UNKNOWN` (หากไม่ได้ระบุ) |
| `username` | String | ชื่อบัญชีผู้ใช้สำหรับเข้าสู่ระบบ | `student_accounts.username` | ตัวอักษรตัวพิมพ์เล็กและตัวเลข | `UNKNOWN` (ไม่มีบัญชี) |
| `role` | String | สิทธิ์การเข้าถึงของผู้ใช้ | `student_accounts.role` | `STUDENT`, `TEACHER`, `ADMIN` | `STUDENT` (ค่าเริ่มต้น) |
| `registeredAt` | ISO String | วันและเวลาที่ลงทะเบียนเข้าสู่ระบบ | `students.registeredAt` | วันที่ในรูปแบบ ISO 8601 | `NOT_AVAILABLE` |
| `totalPointsRecorded` | Number | คะแนนรวมที่ระบบบันทึกในเอกสาร Progress | `progress.totalPoints` | 0.0 – 240.0 | `NULL` |
| `baselineStatus` | String | สถานะการทำแบบทดสอบ Baseline (Pre-test) | `progress.baselineStatus` | `PENDING`, `IN_PROGRESS`, `COMPLETED` | `PENDING` |
| `postTestStatus` | String | สถานะการทำแบบทดสอบ Post-Test | `progress.postTestStatus` | `PENDING`, `IN_PROGRESS`, `COMPLETED` | `PENDING` |
| `completedMissionsCount`| Integer | จำนวนภารกิจที่ทำเสร็จสมบูรณ์ | `progress.completedMissionIds.length`| 0 – 4 | 0 |
| `completedMissionsList` | String | รายชื่อรหัสภารกิจที่ทำเสร็จ | `progress.completedMissionIds` | รหัสคั่นด้วยเครื่องหมาย `;` (m1;m2;m3;m4) | `NONE` |

---

## 2. FILE 02: `assessment_answers.csv`

| Field Name | Data Type | Meaning (ความหมาย) | Source Collection / Code | Allowed Values | Missing Value Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `studentAlias` | String | ฉายาของนักเรียน | `students.nickname` | ตัวอักษร | `UNKNOWN` |
| `studentId` | String | รหัสนักเรียน | `assessments.studentId` | รูปแบบ `SD-XXXXX` | ห้ามว่าง |
| `assessmentType` | String | ประเภทของแบบวัดสมรรถนะ | `assessments.type` | `BASELINE`, `POST_TEST` | ห้ามว่าง |
| `assessmentId` | String | รหัสอ้างอิงเอกสารการประเมิน | `assessments.assessmentId` | รหัสสตริง | `NULL` |
| `score` | Number | คะแนนที่นักเรียนทำได้จริง (RAW) | `assessments.score` | 0 – 40 | `NULL` |
| `maxScore` | Number | คะแนนเต็มของแบบทดสอบ | `assessments.maxScore` | 40 | 40 |
| `domainScores_THINK` | Number | สัดส่วนความถูกต้องในโดเมน THINK | `assessments.domainScores.THINK` | 0.0 – 1.0 (Normalized) | `NULL` |
| `domainScores_CHECK` | Number | สัดส่วนความถูกต้องในโดเมน CHECK | `assessments.domainScores.CHECK` | 0.0 – 1.0 (Normalized) | `NULL` |
| `domainScores_SOLVE` | Number | สัดส่วนความถูกต้องในโดเมน SOLVE | `assessments.domainScores.SOLVE` | 0.0 – 1.0 (Normalized) | `NULL` |
| `domainScores_EXPLAIN`| Number | สัดส่วนความถูกต้องในโดเมน EXPLAIN | `assessments.domainScores.EXPLAIN` | 0.0 – 1.0 (Normalized) | `NULL` |
| `domainScores_GROW` | Number | สัดส่วนความถูกต้องในโดเมน GROW | `assessments.domainScores.GROW` | 0.0 – 1.0 (Normalized) | `NULL` |
| `completedAt` | ISO String | วันและเวลาที่ทำแบบวัดเสร็จสิ้น | `assessments.completedAt` | ISO 8601 Timestamp | `NOT_AVAILABLE` |
| `answersCount` | Integer | จำนวนคำตอบรายข้อที่บันทึกไว้ | `assessments.answers.length` | 0 – 10 | 0 |
| `answersData` | JSON String | โครงสร้างคำตอบรายข้อแบบละเอียด | `assessments.answers` | JSON Array | `NULL` |

---

## 3. FILE 03: `mission_results.csv`

| Field Name | Data Type | Meaning (ความหมาย) | Source Collection / Code | Allowed Values | Missing Value Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `studentAlias` | String | ฉายาของนักเรียน | `students.nickname` | ตัวอักษร | `UNKNOWN` |
| `studentId` | String | รหัสนักเรียน | `mission_results.studentId` | รูปแบบ `SD-XXXXX` | ห้ามว่าง |
| `missionId` | String | รหัสภารกิจ | `mission_results.missionId` | `m1`, `m2`, `m3`, `m4` | ห้ามว่าง |
| `score` | Number | คะแนนที่ได้ในภารกิจนั้น (RAW) | `mission_results.score` | 0.0 – 40.0 | `NULL` |
| `maxScore` | Number | คะแนนเต็มประจำภารกิจ | `mission_results.maxScore` | 40 | 40 |
| `completed` | Boolean | สถานะความเสร็จสมบูรณ์ | `mission_results.completed` | `TRUE`, `FALSE` | `FALSE` |
| `attemptsCount` | Integer | จำนวนครั้ง/จำนวนข้อที่บันทึกการตอบ | `mission_results.attemptsCount` | จำนวนเต็ม $\ge 0$ | `NULL` |
| `timeSpentSeconds`| Number | เวลาที่ใช้ในภารกิจ (วินาที) | `mission_results.timeSpentSeconds`| ตัวเลข $\ge 0$ | `NOT_AVAILABLE` |
| `completedAt` | ISO String | วันและเวลาที่จบภารกิจ | `mission_results.completedAt` | ISO 8601 Timestamp | `NOT_AVAILABLE` |

---

## 4. FILE 04: `evidence_ledger.csv`

| Field Name | Data Type | Meaning (ความหมาย) | Source Collection / Code | Allowed Values | Missing Value Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `studentAlias` | String | ฉายาของนักเรียน | `students.nickname` | ตัวอักษร | `UNKNOWN` |
| `studentId` | String | รหัสนักเรียน | `evidences.studentId` | รูปแบบ `SD-XXXXX` | ห้ามว่าง |
| `missionId` | String | รหัสภารกิจที่เก็บหลักฐาน | `evidences.missionId` | `m1`, `m2`, `m3`, `m4` | `NULL` |
| `questionId` | String | รหัสคำถามที่เชื่อมโยง | `evidences.questionId` | รหัสสตริง | `NULL` |
| `indicatorId` | String | รหัสตัวชี้วัดสมรรถนะ | `evidences.indicatorId` | `T1`–`T4`, `C1`–`C4`, `S1`–`S4`, `E1`–`E4`, `G1`–`G4` | `NULL` |
| `evidenceId` | String | รหัสอ้างอิงของหลักฐาน | `evidences.id` | รหัสสตริง | ห้ามว่าง |
| `evidenceType` | String | ชนิดของหลักฐาน | `evidences.type` | `SOURCE`, `AUTHOR`, `DATE`, `CLAIM`, `COMPARISON`, `REASON`, `DECISION`, `REVISION`, `PROCESS`, `STUDENT_VOICE` | `NULL` |
| `title` | String | หัวข้อหลักฐาน | `evidences.title` | ข้อความ | `NULL` |
| `content` | String | เนื้อหารายละเอียดของหลักฐาน | `evidences.content` | ข้อความ | `NULL` |
| `sourceTag` | String | ป้ายกำกับแหล่งที่มา | `evidences.sourceTag` | รหัส Source Card | `NULL` |
| `isVerified` | Boolean | ผ่านการตรวจสอบความถูกต้องหรือไม่ | `evidences.isVerified` | `TRUE`, `FALSE` | `FALSE` |
| `timestamp` | ISO String | เวลาที่บันทึกหลักฐาน | `evidences.timestamp` | ISO 8601 Timestamp | `NOT_AVAILABLE` |

---

## 5. FILE 05: `ai_usage_logs.csv`

| Field Name | Data Type | Meaning (ความหมาย) | Source Collection / Code | Allowed Values | Missing Value Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `studentAlias` | String | ฉายาของนักเรียน | `students.nickname` | ตัวอักษร | `UNKNOWN` |
| `studentId` | String | รหัสนักเรียน | `ai_logs.studentId` | รูปแบบ `SD-XXXXX` | ห้ามว่าง |
| `logDocId` | String | รหัสเอกสารประวัติใน Firestore | `ai_logs._docId` | รหัสสตริง | ห้ามว่าง |
| `missionId` | String | รหัสภารกิจที่เรียกใช้ AI | `ai_logs.missionId` | `m1`, `m2`, `m3`, `m4` | `NULL` |
| `questionId` | String | รหัสข้อคำถามที่เปิด AI | `ai_logs.questionId` | รหัสคำถาม | `NULL` |
| `sourceCardId` | String | รหัสแผ่นเบาะแสที่กำลังศึกษา | `ai_logs.sourceCardId` | รหัส Source Card | `NULL` |
| `aiUsed` | Boolean | มีการเปิดใช้งาน AI Helper หรือไม่ | `ai_logs.aiUsed` | `TRUE`, `FALSE` | `FALSE` |
| `aiSessionCount` | Integer | จำนวนรอบการสนทนา | `ai_logs.aiSessionCount` | ตัวเลข $\ge 0$ | 0 |
| `aiOpenCount` | Integer | จำนวนครั้งที่กดเปิดหน้าต่าง AI | `ai_logs.aiOpenCount` | ตัวเลข $\ge 0$ | 0 |
| `aiQueryCount` | Integer | จำนวนคำถามที่ส่งไปยัง AI | `ai_logs.aiQueryCount` | ตัวเลข $\ge 0$ | 0 |
| `timestamp` | ISO String | วันเวลาที่บันทึก | `ai_logs.timestamp` | ISO 8601 Timestamp | `NOT_AVAILABLE` |
| `queriesJSON` | JSON String | โครงสร้างคำถามและคำแนะนำที่ AI ตอบ | `ai_logs.aiQueries` | JSON Array | `[]` |

---

## 6. FILE 06: `research_master_dataset.csv`

| Field Name | Data Type | Meaning (ความหมาย) | Data Nature | Formula / Source | Range |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `studentAlias` | String | ฉายานักเรียน | RAW | `students.nickname` | - |
| `studentId` | String | รหัสนักเรียน (Anonymized) | RAW | `students.studentId` | `SD-XXXXX` |
| `baselineScore` | Number | คะแนน Pre-test | RAW | `assessments(BASELINE).score` | 0 – 40 |
| `mission1Score` | Number | คะแนน Mission 1 | RAW | `mission_results(m1).score` | 0 – 40 |
| `mission2Score` | Number | คะแนน Mission 2 | RAW | `mission_results(m2).score` | 0 – 40 |
| `mission3Score` | Number | คะแนน Mission 3 | RAW | `mission_results(m3).score` | 0 – 40 |
| `mission4Score` | Number | คะแนน Mission 4 | RAW | `mission_results(m4).score` | 0 – 40 |
| `postTestScore` | Number | คะแนน Post-test | RAW | `assessments(POST_TEST).score`| 0 – 40 |
| `totalMissionScore`| Number | คะแนนรวม 4 ภารกิจ | DERIVED | $\text{M1} + \text{M2} + \text{M3} + \text{M4}$ | 0 – 160 |
| `totalSystemScore` | Number | คะแนนรวมจริงทั้งระบบ | DERIVED | $\text{Base} + \text{Missions} + \text{Post}$ | 0 – 240 |
| `recordedTotalPoints`| Number| คะแนนที่ระบบบันทึกใน Progress | RAW | `progress.totalPoints` | 0 – 240 |
| `rawGain` | Number | ผลต่างคะแนนพัฒนาการ ($\Delta$) | DERIVED | $\text{Post} - \text{Baseline}$ | -40 ถึง +40 |
| `normalizedGain` | Number | ค่า Normalized Gain ($\langle g \rangle$)| DERIVED | $(\text{Post} - \text{Base}) / (40 - \text{Base})$ | 0.0000 – 1.0000 |
| `domain_*_Pre` | Number | สัดส่วนความถูกต้องแต่ละโดเมนก่อนเรียน | RAW | `assessments(BASELINE).domainScores` | 0.0 – 1.0 |
| `domain_*_Post` | Number | สัดส่วนความถูกต้องแต่ละโดเมนหลังเรียน | RAW | `assessments(POST_TEST).domainScores` | 0.0 – 1.0 |
| `evidenceCount` | Integer| จำนวนหลักฐานที่บันทึก | DERIVED | `evidences.length` | $\ge 0$ |
| `verifiedEvidenceCount`| Integer| จำนวนหลักฐานที่ยืนยันแล้ว | DERIVED | `evidences.isVerified === true` | $\ge 0$ |
| `aiOpenCount` | Integer| จำนวนครั้งที่เปิดใช้งาน AI Helper | RAW | `ai_logs.aiOpenCount` | $\ge 0$ |
| `aiQueryCount` | Integer| จำนวนคำถามที่ส่งหา AI | RAW | `ai_logs.aiQueryCount` | $\ge 0$ |
| `totalMissionTime`| String | เวลารวมในการทำภารกิจ | RAW | `mission_results.timeSpentSeconds` | `NOT_AVAILABLE` |
| `completionStatus`| String | สถานะการเรียนรู้ครบทุกองค์ประกอบ | DERIVED | เงื่อนไขความสมบูรณ์ 6 ส่วน | `FULLY_COMPLETED` |
