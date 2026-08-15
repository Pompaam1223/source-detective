import { IndicatorDefinition, CompetencyDomain, IndicatorId } from '../types';

export interface DomainMeta {
  code: CompetencyDomain;
  titleTh: string;
  subtitleTh: string;
  descriptionTh: string;
  colorClass: string;
  bgClass: string;
  badgeBorder: string;
  iconName: string;
}

export const COMPETENCY_DOMAINS: Record<CompetencyDomain, DomainMeta> = {
  THINK: {
    code: 'THINK',
    titleTh: 'THINK - การคิดและวิเคราะห์',
    subtitleTh: 'การวิเคราะห์สาระสำคัญ แยกแยะข้อเท็จจริง',
    descriptionTh: 'ความสามารถในการระบุผู้ส่งสาร สาระสำคัญ แยกข้อเท็จจริงออกจากความเห็น และเข้าใจบริบท',
    colorClass: 'text-amber-700 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    badgeBorder: 'border-amber-400 bg-amber-100 text-amber-900',
    iconName: 'Brain'
  },
  CHECK: {
    code: 'CHECK',
    titleTh: 'CHECK - การตรวจสอบข้อมูล',
    subtitleTh: 'ประเมินความน่าเชื่อถือ ตรวจแหล่งที่มา',
    descriptionTh: 'การตรวจสอบแหล่งที่มา ความน่าเชื่อถือ การเปรียบเทียบหลายแหล่ง และการตรวจหาอคติ',
    colorClass: 'text-sky-700 dark:text-sky-400',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
    badgeBorder: 'border-sky-400 bg-sky-100 text-sky-900',
    iconName: 'SearchCheck'
  },
  SOLVE: {
    code: 'SOLVE',
    titleTh: 'SOLVE - การแก้ปัญหาข้อมูล',
    subtitleTh: 'ระบุสาเหตุ กำหนดทางเลือก วางแผนการตรวจ',
    descriptionTh: 'การวิเคราะห์สาเหตุของข่าวลวง/ข้อมูลผิดพลาด การวางแผนสืบค้น และการดำเนินการแก้ไข',
    colorClass: 'text-indigo-700 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    badgeBorder: 'border-indigo-400 bg-indigo-100 text-indigo-900',
    iconName: 'Wrench'
  },
  EXPLAIN: {
    code: 'EXPLAIN',
    titleTh: 'EXPLAIN - การอธิบายด้วยเหตุผล',
    subtitleTh: 'สรุปข้อคิดเห็น อธิบายด้วยหลักฐานเชิงประจักษ์',
    descriptionTh: 'การใช้หลักฐานอ้างอิง การเรียบเรียงข้อสรุป การสื่อสารอย่างสร้างสรรค์ และโต้แย้งอย่างมีเหตุผล',
    colorClass: 'text-emerald-700 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    badgeBorder: 'border-emerald-400 bg-emerald-100 text-emerald-900',
    iconName: 'MessageSquareText'
  },
  GROW: {
    code: 'GROW',
    titleTh: 'GROW - การเติบโตทางความคิด',
    subtitleTh: 'ทบทวน ปรับมุมมองเมื่อพบหลักฐานใหม่',
    descriptionTh: 'การทบทวนการตัดสินใจ ยอมรับข้อผิดพลาด ปรับเปลี่ยนความคิดเมื่อพบหลักฐาน และวางแผนพัฒนาตนเอง',
    colorClass: 'text-rose-700 dark:text-rose-400',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    badgeBorder: 'border-rose-400 bg-rose-100 text-rose-900',
    iconName: 'TrendingUp'
  }
};

export const INDICATOR_DEFINITIONS: Record<IndicatorId, IndicatorDefinition> = {
  // THINK (T1 - T4)
  T1: {
    id: 'T1',
    code: 'T1',
    domain: 'THINK',
    nameTh: 'วิเคราะห์ผู้ส่งสารและเจตนา',
    descriptionTh: 'ความสามารถในการระบุว่าใครเป็นผู้ส่งสาร และเข้าใจวัตถุประสงค์ในการสื่อสาร',
    maxScore: 2
  },
  T2: {
    id: 'T2',
    code: 'T2',
    domain: 'THINK',
    nameTh: 'ระบุสาระสำคัญและประเด็นหลัก',
    descriptionTh: 'ความสามารถในการจับใจความสำคัญของข้อมูลข่าวสารได้อย่าง準確',
    maxScore: 2
  },
  T3: {
    id: 'T3',
    code: 'T3',
    domain: 'THINK',
    nameTh: 'แยกข้อเท็จจริงออกจากความคิดเห็น',
    descriptionTh: 'ความสามารถในการจำแนกข้อความที่เป็นข้อเท็จจริงพิสูจน์ได้ ออกจากความรู้สึกหรืออคติส่วนตัว',
    maxScore: 2
  },
  T4: {
    id: 'T4',
    code: 'T4',
    domain: 'THINK',
    nameTh: 'เชื่อมโยงบริบทและสภาพแวดล้อม',
    descriptionTh: 'ความสามารถในการนำบริบท เวลา และสถานที่มาประกอบการพิจารณาเนื้อหา',
    maxScore: 2
  },

  // CHECK (C1 - C4)
  C1: {
    id: 'C1',
    code: 'C1',
    domain: 'CHECK',
    nameTh: 'ตรวจสอบแหล่งที่มาของข้อมูล',
    descriptionTh: 'ความสามารถในการสืบค้นและยืนยันต้นทาง ผู้เขียน หรือหน่วยงานที่รับผิดชอบข้อมูล',
    maxScore: 2
  },
  C2: {
    id: 'C2',
    code: 'C2',
    domain: 'CHECK',
    nameTh: 'ประเมินระดับความน่าเชื่อถือ',
    descriptionTh: 'ความสามารถในการให้คะแนนความน่าเชื่อถือโดยใช้เกณฑ์มาตรฐานทางการสืบค้น',
    maxScore: 2
  },
  C3: {
    id: 'C3',
    code: 'C3',
    domain: 'CHECK',
    nameTh: 'เปรียบเทียบข้อมูลจากหลายแหล่ง',
    descriptionTh: 'ความสามารถในการนำข้อมูลจาก 2 แหล่งขึ้นไปมาเทียบเคียงหาจุดสอดคล้องหรือขัดแย้ง',
    maxScore: 2
  },
  C4: {
    id: 'C4',
    code: 'C4',
    domain: 'CHECK',
    nameTh: 'ระบุอคติและผลประโยชน์แอบแฝง',
    descriptionTh: 'ความสามารถในการมองเห็นการบิดเบือน อคติ หรือแรงจูงใจทางการค้า/การเมือง',
    maxScore: 2
  },

  // SOLVE (S1 - S4)
  S1: {
    id: 'S1',
    code: 'S1',
    domain: 'SOLVE',
    nameTh: 'ระบุปัญหาและสาเหตุของข้อมูลผิดพลาด',
    descriptionTh: 'ความสามารถในการชี้จุดผิดพลาดในสารและอธิบายว่าทำไมจึงเกิดปัญหา',
    maxScore: 2
  },
  S2: {
    id: 'S2',
    code: 'S2',
    domain: 'SOLVE',
    nameTh: 'กำหนดทางเลือกในการแก้ไขปัญหา',
    descriptionTh: 'ความสามารถในการเสนอทางเลือกหลายวิธีในการสืบหาความจริง',
    maxScore: 2
  },
  S3: {
    id: 'S3',
    code: 'S3',
    domain: 'SOLVE',
    nameTh: 'วางแผนขั้นตอนการตรวจสอบ',
    descriptionTh: 'ความสามารถในการจัดลำดับขั้นตอนการสืบค้นอย่างเป็นระบบและเป็นลำดับขั้นตอน',
    maxScore: 2
  },
  S4: {
    id: 'S4',
    code: 'S4',
    domain: 'SOLVE',
    nameTh: 'ลงมือสืบค้นและแก้ไขความเข้าใจผิด',
    descriptionTh: 'ความสามารถในการเลือกเครื่องมือและวิธีการสืบค้นที่เหมาะสมจนได้คำตอบที่ถูกต้อง',
    maxScore: 2
  },

  // EXPLAIN (E1 - E4)
  E1: {
    id: 'E1',
    code: 'E1',
    domain: 'EXPLAIN',
    nameTh: 'อธิบายเหตุผลด้วยหลักฐานเชิงประจักษ์',
    descriptionTh: 'ความสามารถในการยกหลักฐานประกอบการอธิบายเหตุผลอย่างมีน้ำหนัก',
    maxScore: 2
  },
  E2: {
    id: 'E2',
    code: 'E2',
    domain: 'EXPLAIN',
    nameTh: 'เรียบเรียงข้อสรุปอย่างเป็นระบบ',
    descriptionTh: 'ความสามารถในการสรุปผลการสืบสวนเป็นภาษาที่เข้าใจง่ายและเป็นลำดับ',
    maxScore: 2
  },
  E3: {
    id: 'E3',
    code: 'E3',
    domain: 'EXPLAIN',
    nameTh: 'สื่อสารข้อเตือนภัยอย่างสร้างสรรค์',
    descriptionTh: 'ความสามารถในการแจ้งเตือนหรือให้คำแนะนำแก่ผู้อื่นอย่างนุ่มนวลและตรงจุด',
    maxScore: 2
  },
  E4: {
    id: 'E4',
    code: 'E4',
    domain: 'EXPLAIN',
    nameTh: 'โต้แย้งอย่างเป็นเหตุเป็นผล',
    descriptionTh: 'ความสามารถในการหักล้างข้อความเท็จด้วยข้อมูลที่ถูกต้องโดยไม่อิงอารมณ์',
    maxScore: 2
  },

  // GROW (G1 - G4)
  G1: {
    id: 'G1',
    code: 'G1',
    domain: 'GROW',
    nameTh: 'ทบทวนกระบวนการตัดสินใจ',
    descriptionTh: 'ความสามารถในการประเมินว่าก่อนหน้านี้ตนเองตัดสินใจเร็วเกินไปหรือไม่',
    maxScore: 2
  },
  G2: {
    id: 'G2',
    code: 'G2',
    domain: 'GROW',
    nameTh: 'ยอมรับข้อผิดพลาดทางความคิด',
    descriptionTh: 'ความสามารถในการเปิดใจยอมรับเมื่อพบว่าความเชื่อเดิมของตนเองไม่ถูกต้อง',
    maxScore: 2
  },
  G3: {
    id: 'G3',
    code: 'G3',
    domain: 'GROW',
    nameTh: 'ปรับเปลี่ยนมุมมองเมื่อพบหลักฐานใหม่',
    descriptionTh: 'ความสามารถในการปรับข้อสรุปให้สอดคล้องกับหลักฐานชิ้นใหม่ที่เพิ่งถูกค้นพบ',
    maxScore: 2
  },
  G4: {
    id: 'G4',
    code: 'G4',
    domain: 'GROW',
    nameTh: 'วางแผนพัฒนาทักษะการตรวจสอบในอนาคต',
    descriptionTh: 'ความสามารถในการตั้งเป้าหมายปรับปรุงพฤติกรรมการเสพสื่อเพื่อเป็นนักสืบที่ดีขึ้น',
    maxScore: 2
  }
};

export const ALL_INDICATOR_KEYS = Object.keys(INDICATOR_DEFINITIONS) as IndicatorId[];
