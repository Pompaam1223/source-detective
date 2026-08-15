import { Mission } from '../types';

export const MISSIONS_DATA: Mission[] = [
  {
    missionId: 'm1',
    number: 1,
    caseCode: 'CASE-001',
    title: 'Mission 1: "ใครพูด? เชื่อได้แค่ไหน?"',
    subtitle: 'สืบเจาะลึกผู้ส่งสาร แหล่งที่มา และความน่าเชื่อถือ',
    description: 'สืบเจาะลึกผู้ส่งสาร แหล่งที่มา และความน่าเชื่อถือ (WHO → SOURCE → CREDIBILITY) ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
    coverIcon: 'UserCheck',
    indicatorIds: ['T1', 'T2', 'T3', 'T4', 'C1', 'C2', 'C3', 'C4', 'S1', 'S2', 'S3', 'S4', 'E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4'],
    estimatedMinutes: 20,
    status: 'AVAILABLE',
    unlocked: true,
    totalQuestionsCount: 16
  },
  {
    missionId: 'm2',
    number: 2,
    caseCode: 'M2-001',
    title: 'Mission 2: "หลักฐานบอกอะไร?"',
    subtitle: 'สืบค้น ตรวจสอบ และเปรียบเทียบหลักฐานเรื่องการนอนหลับ',
    description: 'สืบค้น ตรวจสอบ และเปรียบเทียบหลักฐานเรื่องการนอนหลับ (EVIDENCE → COMPARE → VERIFY) ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
    coverIcon: 'FileSearch',
    indicatorIds: ['T1', 'T2', 'T3', 'T4', 'C1', 'C2', 'C3', 'C4', 'S1', 'S2', 'S3', 'S4', 'E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4'],
    estimatedMinutes: 20,
    status: 'AVAILABLE',
    unlocked: true,
    totalQuestionsCount: 16
  },
  {
    missionId: 'm3',
    number: 3,
    caseCode: 'M3-001',
    title: 'Mission 3: "เปรียบเทียบ ตรวจสอบ และตัดสินใจ"',
    subtitle: 'สืบสวน เปรียบเทียบข้อมูล ตรวจสอบหลักฐาน และตัดสินใจอย่างเป็นระบบ',
    description: 'เปรียบเทียบข้อมูลจากหลายแหล่ง ตรวจสอบความสอดคล้อง อธิบายเหตุผลเบื้องหลังความแตกต่าง และตัดสินใจอย่างรอบคอบตามหลักฐาน ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
    coverIcon: 'GitCompare',
    indicatorIds: ['T1', 'T2', 'T3', 'T4', 'C1', 'C2', 'C3', 'C4', 'S1', 'S2', 'S3', 'S4', 'E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4'],
    estimatedMinutes: 20,
    status: 'AVAILABLE',
    unlocked: true,
    totalQuestionsCount: 16
  },
  {
    missionId: 'm4',
    number: 4,
    caseCode: 'M4-001',
    title: 'Mission 4: "ก่อนแชร์ ต้องชัวร์!"',
    subtitle: 'สืบสวน ตรวจสอบแหล่งที่มาและหลักฐาน และตัดสินใจก่อนเชื่อหรือแชร์',
    description: 'ฝึกฝนทักษะการรู้เท่าทันสื่อและการคิดเชิงวิพากษ์ วิเคราะห์คำกล่าวอ้าง ตรวจสอบผู้ส่งสารและหลักฐานเชิงประจักษ์ และสร้างกระบวนการตัดสินใจอย่างมีวิจารณญาณก่อนแชร์ข้อมูล ผ่าน 4 ด่านหลัก รวม 16 ข้อ 40 คะแนนเต็ม',
    coverIcon: 'Share2',
    indicatorIds: ['T1', 'T2', 'T3', 'T4', 'C1', 'C2', 'C3', 'C4', 'S1', 'S2', 'S3', 'S4', 'E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4'],
    estimatedMinutes: 20,
    status: 'AVAILABLE',
    unlocked: true,
    totalQuestionsCount: 16
  }
];
