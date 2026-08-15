import { MissionConfig } from '../../types';
import { MISSION_3_SOURCE_CARDS } from '../sourceCards';
import { MISSION_3_QUESTIONS } from '../mission3Questions';

export const MISSION_003_CONFIG: MissionConfig = {
  missionId: 'm3',
  caseCode: 'M3-001',
  missionTitle: 'Mission 3: "เปรียบเทียบ ตรวจสอบ และตัดสินใจ"',
  missionSubtitle: 'สืบสวน เปรียบเทียบข้อมูล ตรวจสอบหลักฐาน และตัดสินใจอย่างเป็นระบบ',
  missionDescription: 'เปรียบเทียบข้อมูลจากหลายแหล่ง ตรวจสอบความสอดคล้อง อธิบายเหตุผลเบื้องหลังความแตกต่าง และตัดสินใจอย่างรอบคอบตามหลักฐาน ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
  coverIcon: 'GitCompare',
  estimatedMinutes: 20,
  totalScore: 40,
  stages: [
    {
      stageId: 'm3_s1',
      stageNumber: 1,
      title: 'ด่าน 1: 🔄 COMPARE (เปรียบเทียบข้อมูล)',
      description: 'เปรียบเทียบสาระสำคัญ ข้อมูลที่เหมือนและต่าง และจับคู่แผ่นเบาะแส (Q01–Q04 รวม 10 คะแนน)',
      questionIds: ['q01_m3', 'q02_m3', 'q03_m3', 'q04_m3'],
      indicatorIds: ['T2', 'T1', 'T3', 'T4', 'C1']
    },
    {
      stageId: 'm3_s2',
      stageNumber: 2,
      title: 'ด่าน 2: 🔍 CHECK (ตรวจสอบหลักฐาน)',
      description: 'ตรวจสอบความน่าเชื่อถือ วิเคราะห์ความขัดแย้ง และจัดลำดับขั้นตอนการตรวจสอบ (Q05–Q08 รวม 10 คะแนน)',
      questionIds: ['q05_m3', 'q06_m3', 'q07_m3', 'q08_m3'],
      indicatorIds: ['C2', 'C3', 'C4', 'S2', 'S1']
    },
    {
      stageId: 'm3_s3',
      stageNumber: 3,
      title: 'ด่าน 3: 💡 EXPLAIN (อธิบายเหตุผลเบื้องหลัง)',
      description: 'อธิบายสาเหตุความแตกต่าง แยกแยะเรื่องเล่าส่วนตัว และหลีกเลี่ยงการสรุปเกินหลักฐาน (Q09–Q12 รวม 9 คะแนน)',
      questionIds: ['q09_m3', 'q10_m3', 'q11_m3', 'q12_m3'],
      indicatorIds: ['E1', 'E2', 'E3', 'E4']
    },
    {
      stageId: 'm3_s4',
      stageNumber: 4,
      title: 'ด่าน 4: ⚖️ DECIDE (ตัดสินใจและทบทวน)',
      description: 'กำหนดแนวทางตรวจสอบ คัดเลือกหลักฐานที่เหมาะสม ปรับเปลี่ยนมุมมอง และตัดสินใจอย่างรอบคอบ (Q13–Q16 รวม 11 คะแนน)',
      questionIds: ['q13_m3', 'q14_m3', 'q15_m3', 'q16_m3'],
      indicatorIds: ['G1', 'S3', 'G2', 'S4', 'G3', 'G4', 'E4']
    }
  ],
  sourceCards: MISSION_3_SOURCE_CARDS,
  questions: MISSION_3_QUESTIONS,
  indicators: [
    'T1', 'T2', 'T3', 'T4',
    'C1', 'C2', 'C3', 'C4',
    'S1', 'S2', 'S3', 'S4',
    'E1', 'E2', 'E3', 'E4',
    'G1', 'G2', 'G3', 'G4'
  ],
  scoringRules: {
    q01_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q02_m3: {
      scoringType: 'PARTIAL',
      maxScore: 2,
      scoringRule: { full: 2, partial: 1, incorrect: 0 }
    },
    q03_m3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q04_m3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q05_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q06_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q07_m3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q08_m3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q09_m3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q10_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q11_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q12_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q13_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q14_m3: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 2, low: 1, incorrect: 0 }
    },
    q15_m3: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q16_m3: {
      scoringType: 'RUBRIC',
      maxScore: 4,
      scoringRule: { full: 4, partial: 3, low: 2, incorrect: 0 }
    }
  },
  aiHelperConfig: {
    welcomeMessage: 'สวัสดีครับนักสืบ! ผมคือ "น้องนักสืบ" ผู้ช่วย AI ประจำภารกิจ Mission 3 พร้อมช่วยแนะนำวิธีเปรียบเทียบข้อมูล ตรวจสอบความสอดคล้อง และวิเคราะห์ระเบียบวิธีวิจัย (ไม่บอกเฉลยคำตอบ) มีข้อสงสัยจุดไหนสอบถามได้เลยครับ! 🕵️‍♂️🔍',
    contextHints: {
      'SC-M3-01': 'SC-M3-01 เผยแพร่โดย Centers for Disease Control and Prevention (CDC) ซึ่งเป็นหน่วยงานสาธารณสุขระดับสากล มีการระบุชั่วโมงการนอนแยกตามกลุ่มอายุชัดเจน',
      'SC-M3-02': 'SC-M3-02 มาจากคณะแพทยศาสตร์ รพ.รามาธิบดี ซึ่งเป็นสถาบันการแพทย์ชั้นนำของไทย มีข้อมูลเรื่อง Growth Hormone และการเรียนรู้',
      'SC-M3-03': 'SC-M3-03 เผยแพร่โดยมหาวิทยาลัยมหิดล อธิบายเรื่องระบบนาฬิกาชีวภาพและการทำงานของร่างกาย',
      'SC-M3-04': 'SC-M3-04 เป็นบทความจากคณะเภสัชศาสตร์ ม.มหิดล ระบุเรื่อง "ความสัมพันธ์เชิงสถิติ" ซึ่งไม่ใช่สาเหตุเดี่ยวที่ฟันธงกับทุกคน',
      'SC-M3-05': 'SC-M3-05 เป็นสถานการณ์จำลองของเพจโซเชียลมีเดียที่มีเจตนาโฆษณาขายเครื่องดื่มและอวดอ้างสรรพคุณเกินจริง',
      'SC-M3-06': 'SC-M3-06 เป็นสถานการณ์จำลองของการแชร์ประสบการณ์ส่วนตัวเพียงคนเดียวในช่วงสั้นๆ (Anecdotal)',
      'SC-M3-07': 'SC-M3-07 เป็นบทความทางการแพทย์ที่เผยแพร่ในปี 2017 ควรตรวจสอบความทันสมัยร่วมกับแนวปฏิบัติปัจจุบัน',
      'SC-M3-08': 'SC-M3-08 มาจากสำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.) เน้นการส่งเสริมสุขอนามัยในวัยรุ่นไทย',
      'SC-M3-09': 'SC-M3-09 จากมหาวิทยาลัยมหิดล ชี้ให้เห็นมิติเรื่อง "คุณภาพและความต่อเนื่องของการนอนหลับ" นอกเหนือจากจำนวนชั่วโมง',
      'SC-M3-10': 'SC-M3-10 เป็นสถานการณ์จำลองของบริษัทอาหารเสริมที่มีการเร่งรัดให้ตัดสินใจซื้อและอวดอ้างสรรพคุณทดแทนการนอนหลับ'
    },
    definitions: {
      'การเปรียบเทียบข้อมูล (Comparison)': 'การนำข้อมูลจากสองแหล่งขึ้นไปมาพิจารณาจุดที่เหมือน จุดที่ต่าง และขอบเขตการศึกษา',
      'กลุ่มตัวอย่าง (Sample Size / Group)': 'กลุ่มบุคคลที่เข้าร่วมในงานศึกษา ซึ่งขนาดและลักษณะของกลุ่มตัวอย่างส่งผลต่อการนำผลวิจัยไปใช้',
      'ระเบียบวิธีวิจัย (Methodology)': 'วิธีการที่ใช้ในการเก็บรวบรวมและวิเคราะห์ข้อมูลทางวิทยาศาสตร์',
      'การสรุปเกินหลักฐาน (Overgeneralization)': 'การนำผลการศึกษาเฉพาะกลุ่มหรือประสบการณ์ส่วนบุคคลไปสรุปเหมารวมว่าเกิดกับทุกคนแน่นอน',
      'การทบทวนมุมมอง (Decision Revision)': 'ความกล้าหาญและความยืดหยุ่นในการปรับเปลี่ยนความคิดเมื่อพบหลักฐานใหม่ที่น่าเชื่อถือกว่า'
    },
    verificationMethods: [
      'เปรียบเทียบว่าข้อมูลสองแหล่งศึกษาตัวแปรและกลุ่มตัวอย่างเดียวกันหรือไม่',
      'ตรวจสอบระเบียบวิธีวิจัยและขนาดกลุ่มตัวอย่าง',
      'แยกแยะผลการศึกษาวิจัยทางการแพทย์ออกจากประสบการณ์ส่วนบุคคล (Anecdotal)',
      'พิจารณาข้อจำกัดของหลักฐานก่อนด่วนสรุปการตัดสินใจ'
    ]
  },
  evidenceConfig: {
    requiredEvidenceTypes: ['SOURCE', 'AUTHOR', 'DATE', 'CLAIM', 'COMPARISON', 'REASON', 'DECISION', 'REVISION'],
    autoVerifyThreshold: 0.75
  },
  resultConfig: {
    passThreshold: 0.6,
    title: 'สรุปผลการสืบสวนคดี Mission 3'
  }
};
