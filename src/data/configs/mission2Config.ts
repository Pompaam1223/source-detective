import { MissionConfig } from '../../types';
import { MISSION_2_SOURCE_CARDS } from '../sourceCards';
import { MISSION_2_QUESTIONS } from '../mission2Questions';

export const MISSION_002_CONFIG: MissionConfig = {
  missionId: 'm2',
  caseCode: 'M2-001',
  missionTitle: 'Mission 2: "หลักฐานบอกอะไร?"',
  missionSubtitle: 'สืบค้น ตรวจสอบ และเปรียบเทียบหลักฐานเรื่องการนอนหลับ',
  missionDescription: 'สืบค้น ตรวจสอบ และเปรียบเทียบหลักฐานเรื่องการนอนหลับ (EVIDENCE → COMPARE → VERIFY) ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
  coverIcon: 'FileSearch',
  estimatedMinutes: 20,
  totalScore: 40,
  stages: [
    {
      stageId: 'm2_s1',
      stageNumber: 1,
      title: 'ด่าน 1: 👤 ใครพูด? (วิเคราะห์ผู้ส่งสารและสาระสำคัญ)',
      description: 'สืบเจาะลึกผู้ส่งสาร สาระสำคัญ แหล่งที่มา และเปรียบเทียบข้อความที่สอดคล้องกัน (Q01–Q04 รวม 9 คะแนน)',
      questionIds: ['q01_m2', 'q02_m2', 'q03_m2', 'q04_m2'],
      indicatorIds: ['T1', 'C1', 'C2', 'C3']
    },
    {
      stageId: 'm2_s2',
      stageNumber: 2,
      title: 'ด่าน 2: 🔍 เชื่อได้แค่ไหน? (ตรวจสอบความน่าเชื่อถือ)',
      description: 'จัดระดับความน่าเชื่อถือ แยกข้อเท็จจริง คัดเลือกเบาะแส และจัดลำดับขั้นตอนการตรวจสอบ (Q05–Q08 รวม 11 คะแนน)',
      questionIds: ['q05_m2', 'q06_m2', 'q07_m2', 'q08_m2'],
      indicatorIds: ['C2', 'T3', 'T2', 'S1']
    },
    {
      stageId: 'm2_s3',
      stageNumber: 3,
      title: 'ด่าน 3: 🧩 ทำไมถึงเป็นแบบนี้? (แก้ปัญหาและวิเคราะห์สาเหตุ)',
      description: 'ตรวจหาผลประโยชน์แอบแฝง แนวทางตรวจสอบ แปลความหมายข้อจำกัด และเชื่อมโยงบริบทเวลา (Q09–Q12 รวม 10 คะแนน)',
      questionIds: ['q09_m2', 'q10_m2', 'q11_m2', 'q12_m2'],
      indicatorIds: ['C4', 'C3', 'S2', 'C2', 'T4', 'E2']
    },
    {
      stageId: 'm2_s4',
      stageNumber: 4,
      title: 'ด่าน 4: ⚖️ ตอบด้วยหลักฐาน (อธิบายเหตุผลและทบทวนการตัดสินใจ)',
      description: 'ทบทวนกระบวนการคิด รวบรวมชุดหลักฐาน ปรับเปลี่ยนมุมมอง และสรุปผลการสืบสวน (Q13–Q16 รวม 11 คะแนน)',
      questionIds: ['q13_m2', 'q14_m2', 'q15_m2', 'q16_m2'],
      indicatorIds: ['G1', 'S3', 'E3', 'G3', 'G2', 'G4', 'E4']
    }
  ],
  sourceCards: MISSION_2_SOURCE_CARDS,
  questions: MISSION_2_QUESTIONS,
  indicators: [
    'T1', 'T2', 'T3', 'T4',
    'C1', 'C2', 'C3', 'C4',
    'S1', 'S2', 'S3', 'S4',
    'E1', 'E2', 'E3', 'E4',
    'G1', 'G2', 'G3', 'G4'
  ],
  scoringRules: {
    q01_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q02_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q03_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q04_m2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q05_m2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q06_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q07_m2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q08_m2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q09_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q10_m2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q11_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q12_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q13_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q14_m2: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q15_m2: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q16_m2: {
      scoringType: 'RUBRIC',
      maxScore: 4,
      scoringRule: { full: 4, partial: 3, low: 2, incorrect: 0 }
    }
  },
  aiHelperConfig: {
    welcomeMessage: 'สวัสดีครับนักสืบ! ผมคือ "น้องนักสืบ" ผู้ช่วย AI ประจำภารกิจ Mission 2 พร้อมช่วยแนะนำวิธีสังเกต วิเคราะห์แหล่งข้อมูล และอธิบายคำศัพท์ทางวิชาการ (ไม่บอกเฉลยคำตอบ) มีข้อสงสัยจุดไหนสอบถามได้เลยครับ! 🕵️‍♂️✨',
    contextHints: {
      'SC-M2-01': 'SC-M2-01 เผยแพร่โดย Centers for Disease Control and Prevention (CDC) ซึ่งเป็นหน่วยงานสาธารณสุขระดับสากล มีการระบุชั่วโมงการนอนแยกตามกลุ่มอายุชัดเจน',
      'SC-M2-02': 'SC-M2-02 มาจากคณะแพทยศาสตร์ รพ.รามาธิบดี ซึ่งเป็นสถาบันการแพทย์ชั้นนำของไทย มีข้อมูลเรื่อง Growth Hormone',
      'SC-M2-03': 'SC-M2-03 เผยแพร่โดยมหาวิทยาลัยมหิดล อธิบายเรื่องระบบนาฬิกาชีวภาพและการทำงานของร่างกาย',
      'SC-M2-04': 'SC-M2-04 เป็นบทความจากคณะเภสัชศาสตร์ ม.มหิดล ระบุเรื่อง "ความสัมพันธ์เชิงสถิติ" ซึ่งไม่ใช่สาเหตุเดี่ยวที่ฟันธงกับทุกคน',
      'SC-M2-05': 'SC-M2-05 เป็นสถานการณ์จำลองของเพจโซเชียลมีเดียที่มีเจตนาโฆษณาขายเครื่องดื่มและอวดอ้างสรรพคุณเกินจริง',
      'SC-M2-06': 'SC-M2-06 เป็นสถานการณ์จำลองของการแชร์ประสบการณ์ส่วนตัวเพียงคนเดียวในช่วงสั้นๆ (Anecdotal)',
      'SC-M2-07': 'SC-M2-07 เป็นบทความทางการแพทย์ที่เผยแพร่ในปี 2017 ควรตรวจสอบความทันสมัยร่วมกับแนวปฏิบัติปัจจุบัน',
      'SC-M2-08': 'SC-M2-08 มาจากสำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.) เน้นการส่งเสริมสุขอนามัยในวัยรุ่นไทย',
      'SC-M2-09': 'SC-M2-09 จากมหาวิทยาลัยมหิดล ชี้ให้เห็นมิติเรื่อง "คุณภาพและความต่อเนื่องของการนอนหลับ" นอกเหนือจากจำนวนชั่วโมง',
      'SC-M2-10': 'SC-M2-10 เป็นสถานการณ์จำลองของบริษัทอาหารเสริมที่มีการเร่งรัดให้ตัดสินใจซื้อและอวดอ้างสรรพคุณทดแทนการนอนหลับ'
    },
    definitions: {
      'แหล่งที่มา (Source)': 'ต้นทางของข้อมูล เช่น หน่วยงาน องค์กรวิชาการ หรือผู้ประพันธ์',
      'ข้ออ้าง (Claim)': 'สิ่งที่ผู้เขียนต้องการโน้มน้าวให้เราเชื่อ',
      'ความสัมพันธ์ (Correlation)': 'สิ่งที่เกิดขึ้นร่วมกันในทางสถิติ แต่ไม่ได้แปลว่าสิ่งหนึ่งเป็นสาเหตุโดยตรงของอีกสิ่งหนึ่ง',
      'คุณภาพการนอน (Sleep Quality)': 'ความลึก ความต่อเนื่องของการนอนหลับ และสิ่งแวดล้อมที่เหมาะสม',
      'ประสบการณ์ส่วนบุคคล (Anecdotal)': 'เรื่องเล่าหรือความรู้สึกส่วนตัวของคนคนเดียว ซึ่งไม่สามารถใช้เป็นเกณฑ์ตัดสินใจสำหรับคนทั่วไป'
    },
    verificationMethods: [
      'ตรวจสอบชื่อผู้เขียน ตำแหน่งทางวิชาการ และหน่วยงานต้นสังกัด',
      'ตรวจสอบวันที่เผยแพร่ว่าเป็นข้อมูลที่ทันสมัยหรือไม่',
      'เปรียบเทียบข้อมูลกับองค์กรทางการแพทย์หรือสาธารณสุขอย่างน้อย 2 แหล่ง (Cross-check)',
      'แยกแยะข้อเท็จจริงทางการแพทย์ออกจากโฆษณาชวนเชื่อและอคติทางการค้า'
    ]
  },
  evidenceConfig: {
    requiredEvidenceTypes: ['SOURCE', 'AUTHOR', 'DATE', 'CLAIM', 'COMPARISON', 'REASON', 'DECISION', 'REVISION'],
    autoVerifyThreshold: 0.75
  },
  resultConfig: {
    passThreshold: 0.6,
    title: 'สรุปผลการสืบสวนคดี Mission 2'
  }
};
