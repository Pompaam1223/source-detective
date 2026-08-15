import { MissionConfig } from '../../types';
import { MISSION_4_SOURCE_CARDS } from '../sourceCards';
import { MISSION_4_QUESTIONS } from '../mission4Questions';

export const MISSION_004_CONFIG: MissionConfig = {
  missionId: 'm4',
  caseCode: 'M4-001',
  missionTitle: 'Mission 4: "ก่อนแชร์ ต้องชัวร์!"',
  missionSubtitle: 'สืบสวน ตรวจสอบแหล่งที่มาและหลักฐาน และตัดสินใจก่อนเชื่อหรือแชร์',
  missionDescription: 'ฝึกฝนทักษะการรู้เท่าทันสื่อและการคิดเชิงวิพากษ์ วิเคราะห์คำกล่าวอ้าง ตรวจสอบผู้ส่งสารและหลักฐานเชิงประจักษ์ และสร้างกระบวนการตัดสินใจอย่างมีวิจารณญาณก่อนแชร์ข้อมูล ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
  coverIcon: 'Share2',
  estimatedMinutes: 20,
  totalScore: 40,
  stages: [
    {
      stageId: 'm4_s1',
      stageNumber: 1,
      title: 'ด่าน 1: 💡 THINK (วิเคราะห์ข้อมูล)',
      description: 'วิเคราะห์ตัวตนผู้ส่งสาร ระบุคำกล่าวอ้าง และจับคู่แนวทางการตรวจสอบ (Q01–Q04 รวม 10 คะแนน)',
      questionIds: ['q01_m4', 'q02_m4', 'q03_m4', 'q04_m4'],
      indicatorIds: ['T1', 'T2', 'T3', 'T4']
    },
    {
      stageId: 'm4_s2',
      stageNumber: 2,
      title: 'ด่าน 2: 🔍 CHECK (ตรวจสอบหลักฐาน)',
      description: 'ประเมินประสบการณ์ส่วนตัว ตรวจสอบช่องทางทางการ และระบุข้อจำกัดของข้อมูล (Q05–Q08 รวม 10 คะแนน)',
      questionIds: ['q05_m4', 'q06_m4', 'q07_m4', 'q08_m4'],
      indicatorIds: ['C1', 'C2', 'C3', 'C4']
    },
    {
      stageId: 'm4_s3',
      stageNumber: 3,
      title: 'ด่าน 3: 🧩 SOLVE (แก้ปัญหาและกำหนดทางเลือก)',
      description: 'วางแผนสืบค้น จัดลำดับขั้นตอนตรวจสอบ และตัดสินใจเกี่ยวกับความเสี่ยง (Q09–Q12 รวม 10 คะแนน)',
      questionIds: ['q09_m4', 'q10_m4', 'q11_m4', 'q12_m4'],
      indicatorIds: ['S1', 'S2', 'S3', 'S4']
    },
    {
      stageId: 'm4_s4',
      stageNumber: 4,
      title: 'ด่าน 4: ⚖️ EXPLAIN & GROW (อธิบายและพัฒนาความคิด)',
      description: 'อธิบายเหตุผลของการตรวจที่มา ตรวจจับข้อสรุปเกินจริง เปิดใจรับหลักฐานใหม่ และจัดลำดับการกระทำ (Q13–Q16 รวม 10 คะแนน)',
      questionIds: ['q13_m4', 'q14_m4', 'q15_m4', 'q16_m4'],
      indicatorIds: ['E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4']
    }
  ],
  sourceCards: MISSION_4_SOURCE_CARDS,
  questions: MISSION_4_QUESTIONS,
  indicators: [
    'T1', 'T2', 'T3', 'T4',
    'C1', 'C2', 'C3', 'C4',
    'S1', 'S2', 'S3', 'S4',
    'E1', 'E2', 'E3', 'E4',
    'G1', 'G2', 'G3', 'G4'
  ],
  scoringRules: {
    q01_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q02_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q03_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q04_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1, incorrect: 0 }
    },
    q05_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q06_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q07_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q08_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q09_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q10_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 0.75, incorrect: 0 }
    },
    q11_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q12_m4: {
      scoringType: 'EXACT',
      maxScore: 3,
      scoringRule: { full: 3, incorrect: 0 }
    },
    q13_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q14_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1.5, incorrect: 0 }
    },
    q15_m4: {
      scoringType: 'EXACT',
      maxScore: 2,
      scoringRule: { full: 2, incorrect: 0 }
    },
    q16_m4: {
      scoringType: 'PARTIAL',
      maxScore: 3,
      scoringRule: { full: 3, partial: 1, incorrect: 0 }
    }
  }
};
