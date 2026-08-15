import { MissionConfig } from '../../types';
import { SOURCE_CARDS } from '../sourceCards';
import { MISSION_1_QUESTIONS } from '../mission1Questions';

export const MISSION_001_CONFIG: MissionConfig = {
  missionId: 'm1',
  caseCode: 'CASE-001',
  missionTitle: 'Mission 1: "ใครพูด? เชื่อได้แค่ไหน?"',
  missionSubtitle: 'สืบเจาะลึกผู้ส่งสาร แหล่งที่มา และความน่าเชื่อถือ',
  missionDescription: 'สืบเจาะลึกผู้ส่งสาร แหล่งที่มา และความน่าเชื่อถือ (WHO → SOURCE → CREDIBILITY) ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
  coverIcon: 'UserCheck',
  estimatedMinutes: 20,
  totalScore: 40,
  stages: [
    {
      stageId: 's1',
      stageNumber: 1,
      title: 'ด่าน 1: 👤 ใครพูด? (วิเคราะห์ผู้ส่งสารและสาระสำคัญ)',
      description: 'สืบเจาะลึกผู้ส่งสาร สาระสำคัญ และข้ออ้างเรื่องการนอน',
      questionIds: ['q01_t1', 'q02_t2', 'q03_t3', 'q04_t4'],
      indicatorIds: ['T1', 'T2', 'T3', 'T4']
    },
    {
      stageId: 's2',
      stageNumber: 2,
      title: 'ด่าน 2: 🔍 เชื่อได้แค่ไหน? (ตรวจสอบความน่าเชื่อถือ)',
      description: 'ตรวจสอบแหล่งที่มา วันที่เผยแพร่ ข้อจำกัด และเปรียบเทียบข้อมูลหลายแหล่ง',
      questionIds: ['q05_c1', 'q06_c2', 'q07_c3', 'q08_c4'],
      indicatorIds: ['C1', 'C2', 'C3', 'C4']
    },
    {
      stageId: 's3',
      stageNumber: 3,
      title: 'ด่าน 3: 🧩 ทำไมถึงเป็นแบบนี้? (แก้ปัญหาและวิเคราะห์สาเหตุ)',
      description: 'วิเคราะห์สาเหตุ วางแผนสืบค้น กำหนดทางเลือก และประเมินวิธีการแก้ปัญหาข้อมูล',
      questionIds: ['q09_s1', 'q10_s2', 'q11_s3', 'q12_s4'],
      indicatorIds: ['S1', 'S2', 'S3', 'S4']
    },
    {
      stageId: 's4',
      stageNumber: 4,
      title: 'ด่าน 4: ⚖️ ตอบด้วยหลักฐาน (อธิบายเหตุผลและทบทวนการตัดสินใจ)',
      description: 'เลือกหลักฐานเชิงประจักษ์ อธิบายเหตุผล โต้แย้ง และประเมินทบทวนการตัดสินใจเมื่อพบหลักฐานใหม่',
      questionIds: ['q13_e1', 'q14_e2', 'q15_e3', 'q16_e4_g1_g4'],
      indicatorIds: ['E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4']
    }
  ],
  sourceCards: SOURCE_CARDS,
  questions: MISSION_1_QUESTIONS,
  indicators: [
    'T1', 'T2', 'T3', 'T4',
    'C1', 'C2', 'C3', 'C4',
    'S1', 'S2', 'S3', 'S4',
    'E1', 'E2', 'E3', 'E4',
    'G1', 'G2', 'G3', 'G4'
  ],
  scoringRules: {
    q04_t4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q07_c3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q08_c4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q14_e2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q16_e4_g1_g4: {
      scoringType: 'RUBRIC',
      maxScore: 4,
      scoringRule: { full: 4, partial: 3, low: 2, incorrect: 0 }
    }
  },
  aiHelperConfig: {
    welcomeMessage: 'สวัสดีครับ! ผมคือ "น้องนักสืบ" ผู้ช่วย AI สำหรับช่วยคุณสังเกตแหล่งที่มา อธิบายคำศัพท์ และให้คำแนะนำวิธีสืบสวน (ไม่เฉลยข้อสอบ) มีอะไรให้ช่วยแนะนำไหมครับ? 🕵️‍♂️✨',
    contextHints: {
      SC01: 'SC01 เผยแพร่โดยหน่วยงานสาธารณสุขระดับประเทศ (CDC) มีข้อมูลสถิติที่ชัดเจน',
      SC02: 'SC02 มาจากคณะแพทยศาสตร์โรงพยาบาลรามาธิบดี สามารถนำมาเปรียบเทียบกับ SC01 ได้',
      SC05: 'SC05 มีลักษณะของการโฆษณาสินค้าและอวดอ้างสรรพคุณเกินจริง',
      SC06: 'SC06 เป็นการเล่าประสบการณ์ส่วนบุคคลเพียงคนเดียว',
      SC07: 'SC07 เป็นบทความทางการแพทย์ที่มีวันที่ตีพิมพ์ในอดีต (ปี 2017)',
      SC08: 'SC08 มาจากสำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
      SC09: 'SC09 กล่าวถึงเรื่อง "คุณภาพและความต่อเนื่องของการนอน" เพิ่มเติมจากจำนวนชั่วโมง',
      SC10: 'SC10 มีเจตนาทางการค้าและการเร่งรัดให้สั่งซื้อสินค้า'
    },
    verificationMethods: [
      'ตรวจสอบชื่อผู้เขียน ตำแหน่ง หรือหน่วยงานต้นสังกัด',
      'ตรวจสอบวันที่เผยแพร่ว่าทันสมัยหรือไม่',
      'เปรียบเทียบข้อมูลกับองค์กรทางการแพทย์หรือสาธารณสุขอื่น',
      'สังเกตเจตนาว่าเพื่อการศึกษาหรือเพื่อการค้า'
    ]
  },
  evidenceConfig: {
    requiredEvidenceTypes: ['CLAIM', 'SOURCE', 'AUTHOR', 'COMPARISON', 'REASON', 'DECISION', 'REVISION'],
    autoVerifyThreshold: 0.75
  },
  resultConfig: {
    passThreshold: 24, // 60% of 40
    title: 'รายงานสรุปผลการสืบสวนคดีที่ 1 (Case 001 Summary)'
  }
};
