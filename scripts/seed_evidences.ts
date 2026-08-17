import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Evidence } from '../src/types';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const sampleEvidences: Evidence[] = [
  {
    id: 'ev_01_rad_sc01',
    studentId: 'SD-2ETP3',
    missionId: 'm1',
    questionId: 'q01_t1',
    indicatorId: 'T1',
    sourceCardId: 'SC01',
    type: 'AUTHOR',
    title: 'ผู้เผยแพร่ระดับสากล CDC',
    content: 'ข้อมูลคำแนะนำชั่วโมงการนอนมาจากหน่วยงานสาธารณสุขสหรัฐฯ (CDC) ซึ่งเป็นองค์กรที่น่าเชื่อถือและมีงานวิจัยรองรับ',
    sourceTag: 'SC01',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:24:12.100Z'
  },
  {
    id: 'ev_02_rad_sc02',
    studentId: 'SD-2ETP3',
    missionId: 'm1',
    questionId: 'q05_c1',
    indicatorId: 'C1',
    sourceCardId: 'SC02',
    type: 'SOURCE',
    title: 'การเทียบเคียงแหล่งข้อมูลทางการแพทย์',
    content: 'คณะแพทยศาสตร์รามาธิบดีระบุวัยรุ่นต้องการเวลานอน 8-10 ชม. สอดคล้องกับแนวทางสากลของ CDC',
    sourceTag: 'SC02',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:26:05.420Z'
  },
  {
    id: 'ev_03_pet_sc05',
    studentId: 'SD-2FJTN',
    missionId: 'm1',
    questionId: 'q09_s1',
    indicatorId: 'S1',
    sourceCardId: 'SC05',
    type: 'CLAIM',
    title: 'การตรวจจับเจตนาแฝงเชิงพาณิชย์',
    content: 'เพจชีวิตฟิตทุกวันมีโฆษณาขายเครื่องดื่มสูตรพิเศษล้อมรอบ จึงมีอคติและผลประโยชน์ทางการค้าแอบแฝง',
    sourceTag: 'SC05',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:25:40.880Z'
  },
  {
    id: 'ev_04_max_scm203',
    studentId: 'SD-68QME',
    missionId: 'm2',
    questionId: 'q03_c2',
    indicatorId: 'C2',
    sourceCardId: 'SC-M2-03',
    type: 'DATE',
    title: 'การตรวจสอบความสดใหม่ของข้อมูล',
    content: 'ประกาศกระทรวงสาธารณสุขฉบับนี้เป็นของปี 2562 ไม่ใช่สถานการณ์ปัจจุบัน นำมาแชร์ซ้ำทำให้เข้าใจผิด',
    sourceTag: 'SC-M2-03',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:33:15.300Z'
  },
  {
    id: 'ev_05_max_scm302',
    studentId: 'SD-68QME',
    missionId: 'm3',
    questionId: 'q07_m3',
    indicatorId: 'C4',
    sourceCardId: 'SC-M3-02',
    type: 'COMPARISON',
    title: 'เปรียบเทียบภาพต้นฉบับกับภาพแชร์',
    content: 'พบร่องรอยการตัดต่อเงาและปรับแต่งแสงในภาพขวดน้ำวิเศษ ทำให้ข้ออ้างรักษาทุกโรคขาดความน่าเชื่อถือ',
    sourceTag: 'SC-M3-02',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:41:20.150Z'
  },
  {
    id: 'ev_06_poom_scm205',
    studentId: 'SD-88H7G',
    missionId: 'm2',
    questionId: 'q08_e1',
    indicatorId: 'E1',
    sourceCardId: 'SC-M2-05',
    type: 'REASON',
    title: 'การอ้างอิงผลตรวจแล็บ อย.',
    content: 'ผลการตรวจทางห้องปฏิบัติการของ อย. ยืนยันว่าน้ำดังกล่าวไม่มีสารออกฤทธิ์ทางยาและไม่ผ่านเกณฑ์มาตรฐาน',
    sourceTag: 'SC-M2-05',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T14:25:30.600Z'
  },
  {
    id: 'ev_07_tete_scm306',
    studentId: 'SD-AXTTJ',
    missionId: 'm3',
    questionId: 'q10_m3',
    indicatorId: 'S3',
    sourceCardId: 'SC-M3-06',
    type: 'DECISION',
    title: 'การตัดสินใจปฏิเสธการแชร์ข้อมูล',
    content: 'ตัดสินใจไม่แชร์ต่อและแจ้งเตือนผู้ส่ง เพราะยังไม่มีงานวิจัยทางคลินิกที่ผ่านการรับรองทางวิทยาศาสตร์',
    sourceTag: 'SC-M3-06',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T14:29:45.920Z'
  },
  {
    id: 'ev_08_and_sc04',
    studentId: 'SD-C3JUV',
    missionId: 'm1',
    questionId: 'q14_g1',
    indicatorId: 'G1',
    sourceCardId: 'SC04',
    type: 'REVISION',
    title: 'การปรับความเข้าใจเรื่องความสัมพันธ์ทางสถิติ',
    content: 'เดิมเข้าใจว่านอนน้อยทำให้ทุกคนอ้วนแน่นอน แต่หลักฐานระบุว่าเป็นเพียงความสัมพันธ์เชิงสถิติไม่ใช่ข้อสรุปเบ็ดเสร็จ',
    sourceTag: 'SC04',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:27:10.500Z'
  },
  {
    id: 'ev_09_khaw_scm207',
    studentId: 'SD-HJF6X',
    missionId: 'm2',
    questionId: 'q12_m2',
    indicatorId: 'E2',
    sourceCardId: 'SC-M2-07',
    type: 'PROCESS',
    title: 'ขั้นตอนการตรวจสอบเลขสารบบอาหาร',
    content: 'นำเลข อย. บนฉลากไปตรวจสอบในฐานข้อมูลระบบสืบค้น อย. พบว่าเป็นเลขปลอมที่สวมทะเบียนของผลิตภัณฑ์อื่น',
    sourceTag: 'SC-M2-07',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T14:04:55.700Z'
  },
  {
    id: 'ev_10_khaw_scm402',
    studentId: 'SD-HJF6X',
    missionId: 'm4',
    questionId: 'q04_m4',
    indicatorId: 'E3',
    sourceCardId: 'SC-M4-02',
    type: 'STUDENT_VOICE',
    title: 'การสะท้อนคิดเรื่องการเตือนเพื่อนในกลุ่ม',
    content: 'เตือนเพื่อนในกลุ่มแชตห้องเรียนด้วยข้อเท็จจริงและท่าทีสุภาพ พร้อมแนบลิงก์บทความทางการจาก สสส. ประกอบ',
    sourceTag: 'SC-M4-02',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T14:14:22.330Z'
  },
  {
    id: 'ev_11_fino_scm304',
    studentId: 'SD-JCC9U',
    missionId: 'm3',
    questionId: 'q05_m3',
    indicatorId: 'T3',
    sourceCardId: 'SC-M3-04',
    type: 'CLAIM',
    title: 'การแยกข้อเท็จจริงออกจากความคิดเห็น',
    content: 'ข้อความที่รีวิวว่าดื่มแล้วหายเหนื่อยทันทีเป็นความรู้สึกเฉพาะบุคคล ไม่สามารถใช้เป็นข้อเท็จจริงทางการแพทย์ได้',
    sourceTag: 'SC-M3-04',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T14:09:12.800Z'
  },
  {
    id: 'ev_12_snk_scm204',
    studentId: 'SD-PLTRN',
    missionId: 'm2',
    questionId: 'q11_m2',
    indicatorId: 'C3',
    sourceCardId: 'SC-M2-04',
    type: 'AUTHOR',
    title: 'ผู้เผยแพร่ คณะเภสัชศาสตร์ ม.มหิดล',
    content: 'บทความเขียนโดยอาจารย์ประจำคณะเภสัชศาสตร์ ซึ่งมีความรู้เชี่ยวชาญตรงด้านการประเมินความปลอดภัยของสารอาหาร',
    sourceTag: 'SC-M2-04',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:34:40.110Z'
  },
  {
    id: 'ev_13_snk_scm408',
    studentId: 'SD-PLTRN',
    missionId: 'm4',
    questionId: 'q15_m4',
    indicatorId: 'G2',
    sourceCardId: 'SC-M4-08',
    type: 'REVISION',
    title: 'การยอมรับข้อผิดพลาดเมื่อพบหลักฐานใหม่',
    content: 'ยอมรับว่าข่าวการหยุดเรียนที่เคยหลงเชื่อเป็นข้อมูลเก่าที่ถูกตัดต่อวันที่ จึงลบโพสต์และแจ้งข้อเท็จจริงใหม่',
    sourceTag: 'SC-M4-08',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:46:50.450Z'
  },
  {
    id: 'ev_14_ilr_sc03',
    studentId: 'SD-XDLM6',
    missionId: 'm1',
    questionId: 'q04_t4',
    indicatorId: 'T4',
    sourceCardId: 'SC03',
    type: 'SOURCE',
    title: 'การพิจารณาบริบทช่วงวัยและสุขอนามัย',
    content: 'ความต้องการชั่วโมงการนอนแปรผันตามอายุ วัยรุ่นต้องการ 8-10 ชม. ขณะที่ผู้ใหญ่ต้องการ 7-9 ชม.',
    sourceTag: 'SC03',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:23:55.200Z'
  },
  {
    id: 'ev_15_ilr_scm410',
    studentId: 'SD-XDLM6',
    missionId: 'm4',
    questionId: 'q16_m4',
    indicatorId: 'G4',
    sourceCardId: 'SC-M4-10',
    type: 'DECISION',
    title: 'แผนการตรวจสอบข้อมูลก่อนส่งต่อในชีวิตประจำวัน',
    content: 'กำหนดแนวทาง 3 ขั้นตอนส่วนตัว: 1) เช็กชื่อผู้ส่ง 2) เทียบกับข่าวหลัก 3) ดูวันที่ ก่อนกดแชร์ในโซเชียลมีเดีย',
    sourceTag: 'SC-M4-10',
    isVerified: true,
    score: 4,
    maxScore: 4,
    timestamp: '2026-08-15T13:47:35.800Z'
  }
];

async function seedEvidences() {
  console.log('=== SEEDING 15 PIECES OF EVIDENCE TO FIRESTORE ===');
  for (const ev of sampleEvidences) {
    const docId = `${ev.studentId}_${ev.id}`;
    const docRef = doc(db, 'evidences', docId);
    await setDoc(docRef, { ...ev }, { merge: true });
    console.log(`Saved Evidence: ${docId} | ${ev.title} (${ev.type})`);
  }
  console.log('Successfully saved all 15 evidences!');
}

seedEvidences().then(() => process.exit(0)).catch(err => {
  console.error('Error seeding evidences:', err);
  process.exit(1);
});
