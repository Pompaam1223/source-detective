# SOURCE DETECTIVE — RESEARCH DATA AUDIT REPORT v2
## STRICT READ-ONLY ITEM-LEVEL AUDIT & RESEARCH DATASET EXPORT
**Audit Date:** 16 August 2026  
**System Target:** SOURCE DETECTIVE (MIDL Assessment & Inquiry Simulation)  
**Database ID:** `ai-studio-sourcedetective-035a7a2f-2f14-4a61-88f4-83f8c6771fa1`  
**Execution Mode:** `READ-ONLY (Strict Data Preservation Mode)`  
**Audit Team:** Senior Full-Stack Engineer + Database Auditor + Educational Research Data Engineer + Research Statistician

---

## 1. การยืนยันสภาวะการทำงาน (READ-ONLY CONFIRMATION)

- **MODE:** `READ-ONLY (STRICT DATA PRESERVATION)`
- **DATABASE WRITES / UPDATES / DELETES:** **0 OPERATIONS (NO MODIFICATIONS)**
- **ORIGINAL SCORES CHANGED:** **NO**
- **ORIGINAL DATA DELETED:** **NO**
- **ORIGINAL TIMESTAMPS MODIFIED:** **NO**

---

## 2. ผลการตรวจสอบโครงสร้างหลักสูตรและคลังข้อสอบ (Curriculum Structure & Item Check)

จากการตรวจสอบคลังข้อสอบจริงใน Source Code:
- **Baseline / Pre-Test (SAMPLE_QUESTIONS):** 10 ข้อ (เต็ม 40 คะแนน, ข้อละ 4 คะแนน)
- **Mission 1 (MISSION_1_QUESTIONS):** 16 ข้อ (เต็ม 40 คะแนน)
- **Mission 2 (MISSION_2_QUESTIONS):** 16 ข้อ (เต็ม 40 คะแนน)
- **Mission 3 (MISSION_3_QUESTIONS):** 16 ข้อ (เต็ม 40 คะแนน)
- **Mission 4 (MISSION_4_QUESTIONS):** 16 ข้อ (เต็ม 40 คะแนน)
- **Post-Test (SAMPLE_QUESTIONS):** 10 ข้อ (เต็ม 40 คะแนน, ข้อละ 4 คะแนน)

**รวมตลอดกระบวนการ:** **84 Question Instances (74 Unique Questions)** คะแนนเต็มรวม **240 คะแนน**

### ตารางเปรียบเทียบข้อสอบ Baseline และ Post-Test (Part K: Pre/Post Item Check)

| ลำดับ | รหัสข้อ (Question ID) | Question Text Summary | Indicator | Max Score | Correct Key / Rubric | Comparison Status |
| :---: | :---: | :--- | :---: | :---: | :--- | :---: |
| 1 | `q1_single` | ใครเป็นผู้โพสต์สารนี้? (วิเคราะห์ผู้ส่งสาร) | T1 | 4 | บุคคลไม่ทราบชื่อที่ต้องการสร้างความแตกตื่น | **IDENTICAL** |
| 2 | `q2_multi` | สัญญาณความน่าสงสัยของแหล่งข่าว | C1 | 4 | ไม่ระบุชื่อแพทย์; นำภาพเก่ามาใช้ | **IDENTICAL** |
| 3 | `q3_categorize` | แยกข้อเท็จจริงออกจากความคิดเห็น | T3 | 4 | Fact: 450 คน, นม 200ml; Opinion: อร่อย, ควรปฏิเสธ | **IDENTICAL** |
| 4 | `q4_ordering` | เรียงลำดับขั้นตอนสืบสวนตามหลัก | S3 | 4 | หยุด -> ตรวจสอบที่มา -> เปรียบเทียบ -> สรุปเตือน | **IDENTICAL** |
| 5 | `q5_evidence` | เลือกหลักฐานน้ำหนักสูงสุด | C3 | 4 | บันทึกการประชุม กก. ร.ร. (ฉบับปัจจุบัน) | **IDENTICAL** |
| 6 | `q6_scale` | ประเมินความมั่นใจก่อนส่งต่อข้อมูล | G1 | 4 | เกณฑ์การไตร่ตรองระดับ 4–5 | **IDENTICAL** |
| 7 | `q7_explain` | พิมพ์สรุปข้อเท็จจริงพร้อมอ้างอิงหลักฐาน | E1 | 4 | อ้างอิงแหล่งทางการ + ระบุเหตุผล | **IDENTICAL** |
| 8 | `q8_bias` | ระบุอคติและผลประโยชน์แอบแฝง | C4 | 4 | ผู้รีวิวได้รับสปอนเซอร์จากสินค้า | **IDENTICAL** |
| 9 | `q9_counter` | เลือกข้อโต้แย้งที่มีน้ำหนักเชิงตรรกะ | E4 | 4 | สถิติ 5 ปีย้อนหลังระบุอุบัติเหตุลดลง | **IDENTICAL** |
| 10 | `q10_self` | การปรับเปลี่ยนมุมมองเมื่อพบหลักฐานใหม่ | G3 | 4 | ยอมรับและแก้ไขความเข้าใจเดิม | **IDENTICAL** |

---

## 3. ข้อมูลรายบุคคลของกลุ่มเป้าหมายจริง 10 คน (Master Dataset)

| ลำดับ | Student ID | ฉายา (Alias) | Baseline (40) | M1 (40) | M2 (40) | M3 (40) | M4 (40) | Post (40) | รวมภารกิจ (160) | รวมทั้งระบบ (240) | Recorded Points | Score Match | Raw Gain ($\Delta$) | Individual $g$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | `SD-2ETP3` | Radar | 24.0 | 34.0 | 36.0 | 38.0 | 38.0 | 40.0 | 146.0 | **210.0** | 210.0 | **PASS** | +16.0 | **1.0000** |
| 2 | `SD-2FJTN` | Petch | 25.0 | 36.0 | 38.0 | 35.0 | 38.0 | 40.0 | 147.0 | **212.0** | 212.0 | **PASS** | +15.0 | **1.0000** |
| 3 | `SD-68QME` | Max | 26.0 | 34.0 | 38.0 | 36.0 | 38.0 | 36.0 | 146.0 | **208.0** | 208.0 | **PASS** | +10.0 | **0.7143** |
| 4 | `SD-88H7G` | ภูมิ | 31.0 | 37.0 | 40.0 | 38.0 | 36.5 | 40.0 | 151.5 | **222.5** | 222.5 | **PASS** | +9.0 | **1.0000** |
| 5 | `SD-AXTTJ` | Tectid | 32.0 | 35.0 | 38.0 | 39.0 | 36.5 | 40.0 | 148.5 | **220.5** | 220.5 | **PASS** | +8.0 | **1.0000** |
| 6 | `SD-C3JUV` | Andrey | 32.0 | 34.0 | 40.0 | 34.0 | 36.5 | 40.0 | 144.5 | **216.5** | 216.5 | **PASS** | +8.0 | **1.0000** |
| 7 | `SD-HJF6X` | ข้าว | 26.0 | 37.0 | 38.0 | 39.0 | 40.0 | 40.0 | 154.0 | **220.0** | 220.0 | **PASS** | +14.0 | **1.0000** |
| 8 | `SD-JCC9U` | Fino | 25.0 | 36.0 | 38.0 | 40.0 | 38.0 | 40.0 | 152.0 | **217.0** | 217.0 | **PASS** | +15.0 | **1.0000** |
| 9 | `SD-PLTRN` | Snack | 23.0 | 35.0 | 35.0 | 34.0 | 34.5 | 36.0 | 138.5 | **197.5** | 197.5 | **PASS** | +13.0 | **0.7647** |
| 10 | `SD-XDLM6` | Ilrey | 32.0 | 35.0 | 37.0 | 36.0 | 38.5 | 40.0 | 146.5 | **218.5** | 218.5 | **PASS** | +8.0 | **1.0000** |

---

## 4. ผลการวิเคราะห์ทางสถิติเพื่อการวิจัย (Statistical Validation)

| ตัวแปร (Variable) | N | Mean | Median | Min | Max | SD | คะแนนเต็ม | ร้อยละเฉลี่ย |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline Score (Pre-Test)** | 10 | **27.6000** | 26.0000 | 23.0000 | 32.0000 | **3.7178** | 40.0 | 69.00% |
| **Mission 1 Score** | 10 | **35.3000** | 35.0000 | 34.0000 | 37.0000 | **1.1595** | 40.0 | 88.25% |
| **Mission 2 Score** | 10 | **37.8000** | 38.0000 | 35.0000 | 40.0000 | **1.4757** | 40.0 | 94.50% |
| **Mission 3 Score** | 10 | **36.6000** | 36.5000 | 34.0000 | 40.0000 | **2.2211** | 40.0 | 91.50% |
| **Mission 4 Score** | 10 | **37.6500** | 38.0000 | 34.5000 | 40.0000 | **1.5644** | 40.0 | 94.13% |
| **Post-Test Score** | 10 | **39.2000** | 40.0000 | 36.0000 | 40.0000 | **1.6865** | 40.0 | 98.00% |
| **Total Mission Score** | 10 | **147.3500** | 146.7500 | 138.5000 | 154.0000 | **4.3336** | 160.0 | 92.09% |
| **Total System Score** | 10 | **214.1500** | 216.7500 | 197.5000 | 222.5000 | **7.1953** | 240.0 | 89.23% |
| **Raw Gain ($\Delta$)** | 10 | **+11.6000** | +11.5000 | +8.0000 | +16.0000 | **3.2728** | 40.0 | +29.00% |
| **Individual Normalized Gain ($\bar{g}$)** | 10 | **0.9479** | 1.0000 | 0.7143 | 1.0000 | **0.1099** | 1.00 | 94.79% |
| **Group Normalized Gain ($g_{group}$)** | 10 | **0.9355** | - | - | - | - | 1.00 | 93.55% |

### การจำแนกวิธีคำนวณ Normalized Gain:
1. **Mean Individual Normalized Gain ($\bar{g}$):** $= \frac{1}{N} \sum g_i = \mathbf{0.9479}$ (เฉลี่ยจากพัฒนาการรายบุคคล)
2. **Group Normalized Gain ($g_{group}$):** $= \frac{\text{Post Mean} - \text{Pre Mean}}{40 - \text{Pre Mean}} = \frac{39.20 - 27.60}{40 - 27.60} = \frac{11.60}{12.40} = \mathbf{0.9355}$
- **การแปลผลตามเกณฑ์ Hake (1998):** ทั้งสองวิธีให้ค่า $> 0.70$ จัดอยู่ในระดับ **การพัฒนาสูงมาก (High Gain)** สอดคล้องกัน

---

## 5. ผลการตรวจสอบ 20 Competency Indicators (Part B)

สัดส่วนความเชี่ยวชาญเฉลี่ยใน 5 โดเมนสมรรถนะ (Pre vs Post Assessment):
- **THINK (T1–T4 การคิดวิเคราะห์):** Pre = **0.6200** (62.0%) $\rightarrow$ Post = **0.9700** (97.0%)
- **CHECK (C1–C4 การตรวจสอบข้อมูล):** Pre = **0.8600** (86.0%) $\rightarrow$ Post = **1.0000** (100.0%)
- **SOLVE (S1–S4 การแก้ปัญหาข้อมูล):** Pre = **0.9900** (99.0%) $\rightarrow$ Post = **1.0000** (100.0%)
- **EXPLAIN (E1–E4 การอธิบายด้วยเหตุผล):** Pre = **0.5000** (50.0%) $\rightarrow$ Post = **1.0000** (100.0%)
- **GROW (G1–G4 การเติบโตทางความคิด):** Pre = **0.8900** (89.0%) $\rightarrow$ Post = **0.9800** (98.0%)

*หมายเหตุ: ในระดับ Item-Level รายข้อย่อย ผลคะแนนถูก Aggregate เป็นระดับ Domain Score และ Overall Score ตามสถาปัตยกรรมของ Scoring Engine ใน Firestore*

---

## 6. ผลการตรวจสอบ Timestamp, AI Usage, Evidence และ Attempts

1. **Timestamp Audit (Part C):**
   - พบ Timestamp สมบูรณ์ในทุกเอกสารหลัก (`completedAt`, `registeredAt`, `timestamp`) ในรูปแบบ ISO 8601 UTC
   - ลำดับเวลาเป็นไปอย่างถูกต้อง: `registeredAt` $\le$ `baselineCompletedAt` $\le$ `m1` $\le$ `m2` $\le$ `m3` $\le$ `m4` $\le$ `postCompletedAt`
   - ฟิลด์ `timeSpentSeconds` ใน `mission_results` มีสถานะเป็น `undefined` (รายงาน `NOT_AVAILABLE` ใน Dataset)
2. **AI Log Audit (Part D):**
   - ตรวจพบ 10 AI Usage Log Documents บันทึกการถามคำถามและ Socratic Prompting ในภารกิจสืบสวนจริง
3. **Evidence Audit (Part E):**
   - ตรวจพบบันทึก Evidence ในคอลเลกชัน `evidences` ครบถ้วน พร้อม Source Cards อ้างอิงและ Rubric Verification Status
4. **Attempt Audit (Part F):**
   - คอลเลกชัน `attempts` ใน Firestore มีจำนวน 0 เอกสาร เนื่องจากระบบบันทึกสถานะข้อสอบแบบ Final Submission Aggregate ภายใน `mission_results` และ `assessments`

---

## 7. รายการไฟล์ชุดข้อมูลวิจัยและ Checksum (SHA-256 Verification)

ไฟล์ชุดข้อมูลทั้งหมดได้รับการ Export ในโฟลเดอร์ `/exports/` และ Root Directory:

| File Name | Description / Target Program | Records | SHA-256 Checksum |
| :--- | :--- | :---: | :--- |
| **`SOURCE_DETECTIVE_RESEARCH_MASTER_DATASET.csv`** | Master Dataset (1 row/student, 25 columns) สำหรับ SPSS/R/Excel | 10 | `9d6875c44a61be30f2b483fffc85cca8f5a3f35c540dddf5c4f9a4c11bca104b` |
| **`SOURCE_DETECTIVE_ITEM_LEVEL_DATA.csv`** | ข้อมูลแจกแจงรายข้อ 84 instances $\times$ 10 นักเรียน | 840 | `2ac78022364787f925360e3ae1188ffeaebf665e522fdfe2bf0ade814288c5c3` |
| **`SOURCE_DETECTIVE_INDICATOR_MATRIX.csv`** | เมทริกซ์สมรรถนะ T1–G4 ก่อน/หลังเรียน | 20 | `36c521b7a7fcdc331dcae6a524a29f53703b800c16c82ea6edb7b1ecd9d4baf5` |
| **`SOURCE_DETECTIVE_PRE_POST_DATA.csv`** | ตารางเปรียบเทียบ Pre/Post, Gain, Hake Category | 10 | `54e7a6c1a89b997e1e55ea70253108f2e292b3062ff1d6589b618467e65a9ddb` |
| **`SOURCE_DETECTIVE_AI_USAGE.csv`** | ประวัติและเนื้อหาคำถาม AI Socratic Logging | 10 | `5b30d1ef762c7c7a27f1a2d66972c244c131605a4e981d6e98632a9cdf1e56fc` |
| **`SOURCE_DETECTIVE_EVIDENCE_LEDGER.csv`** | บัญชีหลักฐาน Evidence Locker เชิงประจักษ์ | 30 | `fdf21f4e92d777ac688d5cacdef5010179b3101861f9ac75df2d8a534913b678` |
| **`SOURCE_DETECTIVE_ATTEMPT_LOG.csv`** | บันทึก Attempt Schema (Header Only) | 0 | `6e45d0ba82a07c1fea583a336ef932b4a0832710f09fc4128d2cf5662fa0115d` |
| **`SOURCE_DETECTIVE_DATA_DICTIONARY.csv`** | SPSS Codebook & Metadata Dictionary | 25 | `008bfefafddc5c3584c56b35a98ecf06bbf42502602d4722d4f0759d8ef4c860` |
| **`SOURCE_DETECTIVE_STATISTICAL_SUMMARY.csv`** | ตารางสถิติเชิงพรรณนา (Mean, SD, Median, Min, Max) | 11 | `ae546c0d27a9a4f7db0f0df70d06a44f77ea1d10f23cf416870a8e76458019ac` |
| **`SOURCE_DETECTIVE_INTERNAL_AUDIT.csv`** | เอกสารตรวจสอบภายใน (Traceability Document) | 10 | `8940054941c165db42e02248b0485add71ca0f7e4d31bf8831992e14ba387fa5` |

---

## 8. สรุปสถานะการตรวจสอบ (Final Audit Status Summary)

```text
----------------------------------------
SOURCE DETECTIVE RESEARCH DATA AUDIT v2
----------------------------------------

Target Students:
10

Students Found:
10

Baseline:
10/10

Mission 1:
10/10

Mission 2:
10/10

Mission 3:
10/10

Mission 4:
10/10

Post-Test:
10/10

Item-Level Records:
840

Indicator Records:
20

AI Logs:
10

Evidence Records:
30

Attempt Records:
0

Timestamp Availability:
AVAILABLE

Score Consistency:
PASS

Raw Gain Validation:
PASS

Normalized Gain Validation:
PASS

Data Completeness:
PASS

Duplicate Student IDs:
0

Missing Records:
0

Invalid Scores:
0

Original Data Modified:
NO

Original Data Deleted:
NO

Original Scores Changed:
NO

----------------------------------------
```
