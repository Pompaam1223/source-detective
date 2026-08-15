import { Question } from '../types';

export const MISSION_3_QUESTIONS: Question[] = [
  // ==========================================
  // STAGE 1: ด่าน 1 — 🔄 COMPARE (Q01 - Q04) (Total 10 pts)
  // ==========================================

  // Q01 - T2 (MaxScore 2) - EXACT (Single Choice) -> Ans: B
  {
    questionId: 'q01_m3',
    missionId: 'm3',
    indicatorId: 'T2',
    stageNumber: 1,
    stageName: 'ด่าน 1: 🔄 COMPARE (เปรียบเทียบข้อมูล)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 1: หัวข้อหลักของข้อมูล',
    stem: 'ข้อมูลนี้พูดเรื่องเดียวกันหรือไม่?',
    sourceCardIds: ['SC-M3-02', 'SC-M3-03'],
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'สังเกตประเด็นหลักที่ทั้ง SC-M3-02 และ SC-M3-03 กำลังกล่าวถึง',
    options: [
      {
        id: 'opt_m3_q1_a',
        label: 'การออกกำลังกายกับส่วนสูง',
        isCorrect: false,
        feedback: 'ยังไม่ถูกต้อง ทั้งสองแหล่งไม่ได้เน้นเรื่องการออกกำลังกายกับส่วนสูงเป็นหลัก'
      },
      {
        id: 'opt_m3_q1_b',
        label: 'การนอนกับผลการเรียน',
        isCorrect: true,
        feedback: 'ถูกต้อง! ทั้งสองแหล่งข้อมูลระบุถึงความสัมพันธ์ระหว่างการนอนหลับกับประสิทธิภาพการเรียนรู้'
      },
      {
        id: 'opt_m3_q1_c',
        label: 'การใช้โทรศัพท์กับสายตา',
        isCorrect: false,
        feedback: 'ยังไม่ถูกต้อง ไม่มีข้อมูลเรื่องผลกระทบต่อสายตาโดยตรง'
      },
      {
        id: 'opt_m3_q1_d',
        label: 'อาหารกับน้ำหนัก',
        isCorrect: false,
        feedback: 'ยังไม่ถูกต้อง ทั้งสองแหล่งมุ่งเน้นเรื่องการนอนหลับ'
      }
    ]
  },

  // Q02 - T1, T3 (MaxScore 2: 1 + 1) - REVISION_SELECT / Multi-step
  {
    questionId: 'q02_m3',
    missionId: 'm3',
    indicatorId: 'T1',
    indicatorIds: ['T1', 'T3'],
    stageNumber: 1,
    stageName: 'ด่าน 1: 🔄 COMPARE (เปรียบเทียบข้อมูล)',
    type: 'REVISION_SELECT',
    title: 'ข้อ 2: ข้อมูลสำคัญและความเหมือนกัน',
    stem: 'พิจารณา Source Card ทั้งสองแหล่ง (SC-M3-02 และ SC-M3-03) แล้วตอบคำถามทั้ง 2 ส่วน:',
    sourceCardIds: ['SC-M3-02', 'SC-M3-03'],
    maxScore: 2,
    scoringType: 'PARTIAL',
    hint: 'วิเคราะห์สาระสำคัญ (T1) และเปรียบเทียบข้อมูลที่เหมือนกัน (T3) จากทั้งสองแหล่ง',
    multiStepQuestions: [
      {
        stepKey: 'q02_a',
        title: 'Q02-A: ข้อมูลสำคัญที่กำลังพูดถึง',
        prompt: 'จาก Source Card ทั้งสอง ข้อมูลสำคัญที่กำลังพูดถึงคืออะไร?',
        options: [
          {
            id: 'opt_m3_q2_a1',
            label: 'การนอนกับผลการเรียน',
            isCorrect: true,
            feedback: 'ถูกต้อง! สาระสำคัญคือความสัมพันธ์ระหว่างการนอนกับการเรียนรู้'
          },
          {
            id: 'opt_m3_q2_a2',
            label: 'สีของเว็บไซต์',
            isCorrect: false,
            feedback: 'สีของเว็บไซต์ไม่ใช่องค์ประกอบสาระสำคัญของข้อมูล'
          },
          {
            id: 'opt_m3_q2_a3',
            label: 'ชื่อผู้เขียน',
            isCorrect: false,
            feedback: 'ชื่อผู้เขียนเป็นข้อมูลระบุตัวตน ไม่ใช่สาระสำคัญของข้อความ'
          },
          {
            id: 'opt_m3_q2_a4',
            label: 'จำนวนรูปภาพ',
            isCorrect: false,
            feedback: 'จำนวนรูปภาพไม่ใช่องค์ประกอบสาระสำคัญ'
          }
        ]
      },
      {
        stepKey: 'q02_b',
        title: 'Q02-B: ข้อมูลที่เหมือนกัน',
        prompt: 'อะไรคือข้อมูลที่เหมือนกันระหว่างทั้งสองแหล่ง?',
        options: [
          {
            id: 'opt_m3_q2_b1',
            label: 'ความสัมพันธ์ระหว่างการนอนกับผลการเรียน',
            isCorrect: true,
            feedback: 'ถูกต้อง! ทั้งสองแหล่งชี้ให้เห็นความสัมพันธ์ระหว่างการพักผ่อนกับสมอง/การเรียน'
          },
          {
            id: 'opt_m3_q2_b2',
            label: 'การออกกำลังกาย 60 นาที',
            isCorrect: false,
            feedback: 'ไม่มีการระบุเรื่องการออกกำลังกาย 60 นาทีในทั้งสองแหล่ง'
          },
          {
            id: 'opt_m3_q2_b3',
            label: 'การใช้โทรศัพท์ก่อนนอน',
            isCorrect: false,
            feedback: 'ไม่ใช่ข้อมูลหลักที่ทั้งสองแหล่งระบุตรงกัน'
          },
          {
            id: 'opt_m3_q2_b4',
            label: 'การกินอาหารเช้า',
            isCorrect: false,
            feedback: 'ไม่มีการระบุเรื่องอาหารเช้า'
          }
        ]
      }
    ]
  },

  // Q03 - T4 (MaxScore 3: 2 + 1) - REVISION_SELECT / Multi-step
  {
    questionId: 'q03_m3',
    missionId: 'm3',
    indicatorId: 'T4',
    stageNumber: 1,
    stageName: 'ด่าน 1: 🔄 COMPARE (เปรียบเทียบข้อมูล)',
    type: 'REVISION_SELECT',
    title: 'ข้อ 3: ลักษณะของข้อมูลและเหตุผลของความต่าง',
    stem: 'เปรียบเทียบลักษณะข้อมูลและวิเคราะห์เหตุผลที่ผลการศึกษาอาจแตกต่างกัน:',
    sourceCardIds: ['SC-M3-02', 'SC-M3-03'],
    maxScore: 3,
    scoringType: 'PARTIAL',
    hint: 'พิจารณารูปแบบงานศึกษาและข้อจำกัดทางระเบียบวิธีวิจัย',
    multiStepQuestions: [
      {
        stepKey: 'q03_part1',
        title: 'ส่วนที่ 1: ลักษณะของข้อมูล',
        prompt: 'ลักษณะของข้อมูลทั้งสองแหล่งเป็นอย่างไร?',
        options: [
          {
            id: 'opt_m3_q3_p1_a',
            label: 'เป็นการศึกษากลุ่มเดียวกัน',
            isCorrect: false,
            feedback: 'ทั้งสองแหล่งไม่ได้ศึกษากลุ่มตัวอย่างเดียวกัน'
          },
          {
            id: 'opt_m3_q3_p1_b',
            label: 'แหล่งหนึ่งเป็นงานศึกษากลุ่มวัยรุ่น ส่วนอีกแหล่งเป็นการรวบรวมหลายงานวิจัย',
            isCorrect: true,
            feedback: 'ถูกต้อง! รูปแบบการรวบรวมและกลุ่มเป้าหมายของแต่ละแหล่งมีความแตกต่างกัน'
          },
          {
            id: 'opt_m3_q3_p1_c',
            label: 'ทั้งสองเป็นโพสต์ออนไลน์',
            isCorrect: false,
            feedback: 'ทั้งสองเป็นบทความวิชาการทางการแพทย์และมหาวิทยาลัย ไม่ใช่โพสต์ส่วนตัวทั่วไป'
          },
          {
            id: 'opt_m3_q3_p1_d',
            label: 'ทั้งสองเป็นข่าว',
            isCorrect: false,
            feedback: 'ไม่ใช่ข่าวรายวัน'
          }
        ]
      },
      {
        stepKey: 'q03_part2',
        title: 'ส่วนที่ 2: เหตุผลที่ผลอาจแตกต่างกัน',
        prompt: 'เหตุผลที่ผลการศึกษาอาจมีความแตกต่างกันคืออะไร?',
        options: [
          {
            id: 'opt_m3_q3_p2_a',
            label: 'วิธีการศึกษาและการวิเคราะห์ข้อมูลอาจแตกต่างกัน',
            isCorrect: true,
            feedback: 'ถูกต้อง! ความแตกต่างของระเบียบวิธีวิจัยและตัวแปรที่ใช้วัดทำให้ผลสรุปมีมิติที่ต่างกัน'
          },
          {
            id: 'opt_m3_q3_p2_b',
            label: 'เพราะชื่อผู้วิจัยไม่เหมือนกัน',
            isCorrect: false,
            feedback: 'ชื่อผู้วิจัยไม่ใช่สาเหตุทางวิทยาศาสตร์ที่ทำให้ผลต่างกัน'
          },
          {
            id: 'opt_m3_q3_p2_c',
            label: 'เพราะเว็บไซต์มีรูปต่างกัน',
            isCorrect: false,
            feedback: 'รูปภาพบนเว็บไซต์ไม่มีผลต่อระเบียบวิธีวิจัย'
          },
          {
            id: 'opt_m3_q3_p2_d',
            label: 'เพราะข้อมูลต้องมีฝ่ายหนึ่งผิด',
            isCorrect: false,
            feedback: 'ข้อมูลสองแหล่งอาจถูกต้องทั้งคู่ในขอบเขตการศึกษาที่ต่างกัน'
          }
        ]
      }
    ]
  },

  // Q04 - T2, C1 (MaxScore 3: 1+1+1) - MATCHING
  {
    questionId: 'q04_m3',
    missionId: 'm3',
    indicatorId: 'T2',
    indicatorIds: ['T2', 'C1'],
    stageNumber: 1,
    stageName: 'ด่าน 1: 🔄 COMPARE (เปรียบเทียบข้อมูล)',
    type: 'MATCHING',
    title: 'ข้อ 4: จับคู่ Source Card กับสาระสำคัญ',
    stem: 'จับคู่ Source Card แต่ละแผ่นกับสาระสำคัญและหลักฐานที่ปรากฏให้ถูกต้อง:',
    sourceCardIds: ['SC-M3-02', 'SC-M3-03', 'SC-M3-09'],
    maxScore: 3,
    scoringType: 'PARTIAL',
    hint: 'สังเกตประเด็นสำคัญ: SC-M3-02 เรื่อง Growth Hormone, SC-M3-03 เรื่องนาฬิกาชีวภาพ, SC-M3-09 เรื่องคุณภาพการนอน',
    matchingPairs: [
      {
        id: 'm3_q4_pair1',
        item: 'SC-M3-02 (รพ.รามาธิบดี - พัฒนาการและการเรียนรู้)',
        targetMatch: 'การนอนส่งผลต่อ Growth Hormone และการเรียนรู้ของวัยรุ่น'
      },
      {
        id: 'm3_q4_pair2',
        item: 'SC-M3-03 (มหาวิทยาลัยมหิดล - สุขอนามัยและนาฬิกาชีวภาพ)',
        targetMatch: 'ระบบนาฬิกาชีวภาพต้องการเวลาพักผ่อนที่สม่ำเสมอ'
      },
      {
        id: 'm3_q4_pair3',
        item: 'SC-M3-09 (มหาวิทยาลัยมหิดล - คุณภาพการนอน)',
        targetMatch: 'คุณภาพและความต่อเนื่องของการนอนสำคัญไม่แพ้จำนวนชั่วโมง'
      }
    ]
  },

  // ==========================================
  // STAGE 2: ด่าน 2 — 🔍 CHECK (Q05 - Q08) (Total 10 pts)
  // ==========================================

  // Q05 - C2 (MaxScore 2) - EXACT (Single Choice) -> Ans: A
  {
    questionId: 'q05_m3',
    missionId: 'm3',
    indicatorId: 'C2',
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK (ตรวจสอบหลักฐาน)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 5: การมีหลักฐานจากงานวิจัย',
    stem: 'Source ใดมีหลักฐานจากงานวิจัย?',
    sourceCardIds: ['SC-M3-02', 'SC-M3-09', 'SC-M3-10'],
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'พิจารณาว่าแหล่งข้อมูลใดอ้างอิงหลักฐานทางการแพทย์และพัฒนาการสมองอย่างเป็นระบบ',
    options: [
      {
        id: 'opt_m3_q5_a',
        label: 'SC-M3-02',
        isCorrect: true,
        feedback: 'ถูกต้อง! SC-M3-02 มาจากคณะแพทยศาสตร์ รพ.รามาธิบดี มีหลักฐานทางการแพทย์และงานวิจัยรองรับชัดเจน'
      },
      {
        id: 'opt_m3_q5_b',
        label: 'SC-M3-09',
        isCorrect: false,
        feedback: 'SC-M3-09 เป็นบทความแนะนำสุขอนามัยทั่วไป แต่ SC-M3-02 อ้างอิงกลไกการแพทย์ด้าน Growth Hormone ชัดเจนกว่า'
      },
      {
        id: 'opt_m3_q5_c',
        label: 'SC-M3-10',
        isCorrect: false,
        feedback: 'SC-M3-10 เป็นสื่อโฆษณาจำลอง ไม่มีหลักฐานงานวิจัยทางการแพทย์รองรับ'
      },
      {
        id: 'opt_m3_q5_d',
        label: 'B และ C',
        isCorrect: false,
        feedback: 'SC-M3-10 ไม่มีหลักฐานงานวิจัย'
      }
    ]
  },

  // Q06 - C3 (MaxScore 2) - EXACT (Single Choice) -> Ans: B
  {
    questionId: 'q06_m3',
    missionId: 'm3',
    indicatorId: 'C3',
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK (ตรวจสอบหลักฐาน)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 6: ความขัดแย้งของข้อมูล',
    stem: 'สองข้อมูลนี้ขัดแย้งกันจริงหรือไม่?',
    sourceCardIds: ['SC-M3-02', 'SC-M3-03'],
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'สังเกตว่าข้อมูลทั้งสองอาจมองคนละแง่มุมหรือศึกษาตัวแปรที่ต่างกัน ไม่ได้แปลว่าฝ่ายหนึ่งต้องผิด',
    options: [
      {
        id: 'opt_m3_q6_a',
        label: 'ขัดแย้งกันแน่นอน',
        isCorrect: false,
        feedback: 'ยังไม่สามารถด่วนสรุปว่าขัดแย้งกัน เพราะอาจศึกษาคนละมิติ'
      },
      {
        id: 'opt_m3_q6_b',
        label: 'ยังบอกไม่ได้ว่าขัดแย้งกัน เพราะศึกษาตัวแปร/วิธีวิเคราะห์ต่างกัน',
        isCorrect: true,
        feedback: 'ถูกต้อง! การที่ผลต่างกันอาจเกิดจากขอบเขต ตัวแปร หรือระเบียบวิธีวิจัยที่ต่างกัน'
      },
      {
        id: 'opt_m3_q6_c',
        label: 'SC-M3-02 ผิด',
        isCorrect: false,
        feedback: 'SC-M3-02 เป็นบทความทางการแพทย์ที่ถูกต้องตามหลักวิชาการ'
      },
      {
        id: 'opt_m3_q6_d',
        label: 'SC-M3-03 ผิด',
        isCorrect: false,
        feedback: 'SC-M3-03 เป็นบทความวิชาการที่ถูกต้องตามหลักวิชาการ'
      }
    ]
  },

  // Q07 - C3, C4 (MaxScore 3) - MULTI_SELECT (Choose 2: A, B)
  {
    questionId: 'q07_m3',
    missionId: 'm3',
    indicatorId: 'C3',
    indicatorIds: ['C3', 'C4'],
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK (ตรวจสอบหลักฐาน)',
    type: 'MULTI_SELECT',
    title: 'ข้อ 7: สิ่งที่ควรตรวจสอบเพิ่มเติม',
    stem: 'ควรตรวจอะไรเพิ่มเพื่อทำความเข้าใจความต่างของข้อมูล? (เลือก 2 ข้อ)',
    sourceCardIds: ['SC-M3-02', 'SC-M3-03'],
    maxScore: 3,
    scoringType: 'PARTIAL',
    hint: 'พิจารณาตัวแปรสำคัญในงานวิจัย เช่น กลุ่มตัวอย่างและจำนวนผู้เข้าร่วมการทดลอง',
    options: [
      {
        id: 'opt_m3_q7_a',
        label: 'จำนวนผู้เข้าร่วม',
        isCorrect: true,
        feedback: 'ถูกต้อง! ขนาดกลุ่มตัวอย่างส่งผลต่อความแม่นยำทางสถิติ'
      },
      {
        id: 'opt_m3_q7_b',
        label: 'อายุ/กลุ่มตัวอย่าง',
        isCorrect: true,
        feedback: 'ถูกต้อง! ช่วงวัยและลักษณะของกลุ่มตัวอย่างเป็นปัจจัยสำคัญต่อผลการศึกษา'
      },
      {
        id: 'opt_m3_q7_c',
        label: 'สีของเว็บไซต์',
        isCorrect: false,
        feedback: 'สีของเว็บไซต์ไม่มีผลต่อความน่าเชื่อถือของเนื้อหางานวิจัย'
      },
      {
        id: 'opt_m3_q7_d',
        label: 'ชื่อไฟล์ PDF',
        isCorrect: false,
        feedback: 'ชื่อไฟล์ไม่ใช่ปัจจัยที่ใช้ประเมินความถูกต้องของงานวิจัย'
      }
    ]
  },

  // Q08 - S2, S1 (MaxScore 3: 1 + 2) - REVISION_SELECT / Multi-step
  {
    questionId: 'q08_m3',
    missionId: 'm3',
    indicatorId: 'S2',
    indicatorIds: ['S2', 'S1'],
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK (ตรวจสอบหลักฐาน)',
    type: 'REVISION_SELECT',
    title: 'ข้อ 8: สิ่งที่ควรตรวจต่อและเรียงลำดับขั้นตอน',
    stem: 'เมื่อพบว่าข้อมูลสองแหล่งไม่ตรงกัน ให้พิจารณาสิ่งที่ต้องตรวจและเรียงลำดับขั้นตอนการตรวจสอบ:',
    maxScore: 3,
    scoringType: 'PARTIAL',
    hint: 'Q08-A ระบุสิ่งที่ควรตรวจต่อ (S2), Q08-B เรียงลำดับขั้นตอนการสืบสวน (S1)',
    multiStepQuestions: [
      {
        stepKey: 'q08_a',
        title: 'Q08-A: สิ่งที่ควรตรวจต่อเมื่อข้อมูลไม่ตรงกัน',
        prompt: 'ถ้าพบว่าข้อมูลสองแหล่งไม่ตรงกัน ควรตรวจอะไรต่อ?',
        options: [
          {
            id: 'opt_m3_q8_a1',
            label: 'กลุ่มตัวอย่างและวิธีศึกษา',
            isCorrect: true,
            feedback: 'ถูกต้อง! การตรวจสอบกลุ่มตัวอย่างและระเบียบวิธีวิจัยช่วยอธิบายที่มาของความแตกต่าง'
          },
          {
            id: 'opt_m3_q8_a2',
            label: 'สีของเว็บไซต์',
            isCorrect: false,
            feedback: 'สีของเว็บไซต์ไม่ใช่สิ่งที่ต้องตรวจสอบ'
          },
          {
            id: 'opt_m3_q8_a3',
            label: 'จำนวนรูปภาพ',
            isCorrect: false,
            feedback: 'จำนวนรูปภาพไม่มีผลต่อความน่าเชื่อถือ'
          },
          {
            id: 'opt_m3_q8_a4',
            label: 'ความยาวของชื่อบทความ',
            isCorrect: false,
            feedback: 'ความยาวของชื่อบทความไม่ใช่เกณฑ์ตรวจสอบ'
          }
        ]
      },
      {
        stepKey: 'q08_b',
        title: 'Q08-B: เรียงลำดับขั้นตอนการตรวจสอบข้อมูล',
        prompt: 'เรียงลำดับขั้นตอนการตรวจสอบข้อมูลที่ถูกต้องที่สุด: (1. ดูว่าแต่ละแหล่งอ้างอิงอะไร, 2. เปรียบเทียบว่าข้อมูลต่างกันตรงไหน, 3. ตรวจกลุ่มตัวอย่างและวิธีศึกษา, 4. ตัดสินใจว่าจะใช้ข้อมูลอย่างไร)',
        options: [
          {
            id: 'opt_m3_q8_b1',
            label: '2 → 1 → 3 → 4 (เปรียบเทียบจุดต่าง → ตรวจการอ้างอิง → ตรวจกลุ่มตัวอย่าง/วิธีศึกษา → ตัดสินใจใช้ข้อมูล)',
            isCorrect: true,
            feedback: 'ถูกต้อง! ลำดับขั้นตอนการตรวจสอบอย่างเป็นระบบคือ 2 → 1 → 3 → 4'
          },
          {
            id: 'opt_m3_q8_b2',
            label: '1 → 2 → 3 → 4',
            isCorrect: false,
            feedback: 'ควรเริ่มจากการเปรียบเทียบดูว่าข้อมูลต่างกันตรงไหนก่อน'
          },
          {
            id: 'opt_m3_q8_b3',
            label: '4 → 3 → 2 → 1',
            isCorrect: false,
            feedback: 'การตัดสินใจใช้ข้อมูลต้องเป็นขั้นตอนสุดท้ายหลังจากตรวจสอบครบถ้วน'
          },
          {
            id: 'opt_m3_q8_b4',
            label: '3 → 2 → 1 → 4',
            isCorrect: false,
            feedback: 'ควรเปรียบเทียบข้อความและดูการอ้างอิงก่อนเจาะลึกกลุ่มตัวอย่าง'
          }
        ]
      }
    ]
  },

  // ==========================================
  // STAGE 3: ด่าน 3 — 💡 EXPLAIN (Q09 - Q12) (Total 9 pts)
  // ==========================================

  // Q09 - E1 (MaxScore 3) - MULTI_SELECT (Choose 2: A, B)
  {
    questionId: 'q09_m3',
    missionId: 'm3',
    indicatorId: 'E1',
    stageNumber: 3,
    stageName: 'ด่าน 3: 💡 EXPLAIN (อธิบายเหตุผลเบื้องหลัง)',
    type: 'MULTI_SELECT',
    title: 'ข้อ 9: สาเหตุที่ข้อมูลอาจแตกต่างกัน',
    stem: 'ทำไมข้อมูลอาจต่างกัน? (เลือก 2 ข้อ)',
    maxScore: 3,
    scoringType: 'PARTIAL',
    hint: 'พิจารณาปัจจัยทางวิทยาศาสตร์และระเบียบวิธีวิจัยที่ทำให้ผลการศึกษาแตกต่างกัน',
    options: [
      {
        id: 'opt_m3_q9_a',
        label: 'กลุ่มตัวอย่างต่างกัน',
        isCorrect: true,
        feedback: 'ถูกต้อง! กลุ่มตัวอย่างต่างวัยหรือต่างบริบทส่งผลต่อผลลัพธ์'
      },
      {
        id: 'opt_m3_q9_b',
        label: 'วิธีการศึกษาแตกต่างกัน',
        isCorrect: true,
        feedback: 'ถูกต้อง! การใช้วิธีวัดและการเก็บข้อมูลที่ต่างกันทำให้ผลสรุปต่างกันได้'
      },
      {
        id: 'opt_m3_q9_c',
        label: 'ชื่อผู้วิจัยไม่เหมือนกัน',
        isCorrect: false,
        feedback: 'ชื่อผู้วิจัยไม่ใช่สาเหตุที่ทำให้ข้อมูลทางสถิติต่างกัน'
      },
      {
        id: 'opt_m3_q9_d',
        label: 'เว็บไซต์ใช้รูปภาพต่างกัน',
        isCorrect: false,
        feedback: 'รูปภาพบนเว็บไซต์ไม่มีผลต่อผลลัพธ์ของข้อมูล'
      }
    ]
  },

  // Q10 - E2 (MaxScore 2) - EXACT (Single Choice) -> Ans: B
  {
    questionId: 'q10_m3',
    missionId: 'm3',
    indicatorId: 'E2',
    stageNumber: 3,
    stageName: 'ด่าน 3: 💡 EXPLAIN (อธิบายเหตุผลเบื้องหลัง)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 10: การไม่ใช้โพสต์เดี่ยวสรุปแทนทุกคน',
    stem: 'ทำไมไม่ควรใช้โพสต์ของคนคนเดียว (SC-M3-06) สรุปแทนทุกคน?',
    sourceCardId: 'SC-M3-06',
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'สังเกตว่าโพสต์ของต้นเป็นเพียงเรื่องเล่าส่วนบุคคล (Anecdotal) ที่ไม่มีการควบคุมตัวแปร',
    options: [
      {
        id: 'opt_m3_q10_a',
        label: 'เพราะโพสต์มีตัวอักษรน้อย',
        isCorrect: false,
        feedback: 'จำนวนตัวอักษรไม่ใช่เหตุผลหลัก'
      },
      {
        id: 'opt_m3_q10_b',
        label: 'เพราะเป็นประสบการณ์ของคนเดียว',
        isCorrect: true,
        feedback: 'ถูกต้อง! ประสบการณ์ส่วนบุคคลของคนคนเดียวไม่สามารถใช้เป็นหลักฐานอ้างอิงสำหรับคนทั่วไปได้'
      },
      {
        id: 'opt_m3_q10_c',
        label: 'เพราะโพสต์ไม่มีรูปภาพ',
        isCorrect: false,
        feedback: 'การมีหรือไม่มีรูปภาพไม่ใช่เกณฑ์'
      },
      {
        id: 'opt_m3_q10_d',
        label: 'เพราะผู้เขียนใช้โทรศัพท์',
        isCorrect: false,
        feedback: 'อุปกรณ์ที่ใช้โพสต์ไม่มีผลต่อความเป็นวิทยาศาสตร์'
      }
    ]
  },

  // Q11 - E3 (MaxScore 2) - EXACT (Single Choice) -> Ans: C
  {
    questionId: 'q11_m3',
    missionId: 'm3',
    indicatorId: 'E3',
    stageNumber: 3,
    stageName: 'ด่าน 3: 💡 EXPLAIN (อธิบายเหตุผลเบื้องหลัง)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 11: การสรุปเกินหลักฐาน',
    stem: 'ข้อใดสรุปเกินหลักฐาน?',
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'สังเกตข้อความที่ใช้คำว่า "ทุกคน" หรือ "แน่นอน" โดยไม่มีหลักฐานครอบคลุม',
    options: [
      {
        id: 'opt_m3_q11_a',
        label: 'นักเรียน A บอกว่าเมื่อคืนตนนอน 4 ชั่วโมง',
        isCorrect: false,
        feedback: 'นี่เป็นการบอกเล่าข้อเท็จจริงเฉพาะตนเอง ไม่ใช่การสรุปเกินหลักฐานแทนคนอื่น'
      },
      {
        id: 'opt_m3_q11_b',
        label: 'งานวิจัยศึกษาความสัมพันธ์ระหว่างการนอนกับผลการเรียน',
        isCorrect: false,
        feedback: 'นี่คือการอธิบายขอบเขตของงานวิจัยตามจริง'
      },
      {
        id: 'opt_m3_q11_c',
        label: 'ทุกคนที่นอนน้อยจะสอบได้คะแนนสูง',
        isCorrect: true,
        feedback: 'ถูกต้อง! การสรุปว่า "ทุกคนจะสอบได้คะแนนสูง" เป็นการด่วนสรุปเหมารวมที่เกินกว่าหลักฐาน'
      },
      {
        id: 'opt_m3_q11_d',
        label: 'ข้อมูลแต่ละงานควรนำมาเปรียบเทียบ',
        isCorrect: false,
        feedback: 'นี่เป็นแนวทางปฏิบัติที่ถูกต้อง'
      }
    ]
  },

  // Q12 - E4 (MaxScore 2) - EXACT (Single Choice) -> Ans: C
  {
    questionId: 'q12_m3',
    missionId: 'm3',
    indicatorId: 'E4',
    stageNumber: 3,
    stageName: 'ด่าน 3: 💡 EXPLAIN (อธิบายเหตุผลเบื้องหลัง)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 12: ข้อสรุปที่เหมาะสมที่สุด',
    stem: 'ข้อสรุปใดเหมาะสมที่สุดเมื่อพิจารณาหลักฐานเรื่องการนอนกับผลการเรียน?',
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'เลือกข้อสรุปที่มีความรอบคอบและยอมรับข้อจำกัดของหลักฐาน',
    options: [
      {
        id: 'opt_m3_q12_a',
        label: 'นอนมากทำให้เรียนเก่งแน่นอน',
        isCorrect: false,
        feedback: 'การใช้คำว่า "แน่นอน" เป็นการสรุปเกินหลักฐาน'
      },
      {
        id: 'opt_m3_q12_b',
        label: 'การนอนไม่เกี่ยวกับการเรียนเลย',
        isCorrect: false,
        feedback: 'หลักฐานทางการแพทย์ยืนยันว่าการนอนมีผลต่อสมาธิและความจำ'
      },
      {
        id: 'opt_m3_q12_c',
        label: 'มีงานวิจัยที่พบความสัมพันธ์ แต่ต้องพิจารณาวิธีศึกษาและข้อจำกัด',
        isCorrect: true,
        feedback: 'ถูกต้อง! เป็นข้อสรุปทางวิทยาศาสตร์ที่รัดกุมและคำนึงถึงข้อจำกัดของหลักฐาน'
      },
      {
        id: 'opt_m3_q12_d',
        label: 'งานวิจัยทุกงานให้ผลเหมือนกัน',
        isCorrect: false,
        feedback: 'งานวิจัยต่างกันอาจให้ผลต่างมิติกัน'
      }
    ]
  },

  // ==========================================
  // STAGE 4: ด่าน 4 — ⚖️ DECIDE (Q13 - Q16) (Total 11 pts)
  // ==========================================

  // Q13 - G1 (MaxScore 2) - EXACT (Single Choice) -> Ans: C
  {
    questionId: 'q13_m3',
    missionId: 'm3',
    indicatorId: 'G1',
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ DECIDE (ตัดสินใจและทบทวน)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 13: สิ่งแรกที่ควรทำเมื่อพบข้อมูลไม่ตรงกัน',
    stem: 'เมื่อพบข้อมูลสองแหล่งไม่เหมือนกัน สิ่งแรกที่ควรทำคืออะไร?',
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'นักสืบที่ดีต้องไม่เลือกเชื่อตามความชอบส่วนตัว แต่ต้องตรวจสอบที่มาและวิธีศึกษา',
    options: [
      {
        id: 'opt_m3_q13_a',
        label: 'เลือกแหล่งที่ชอบ',
        isCorrect: false,
        feedback: 'การเลือกตามความชอบทำให้เกิดอคติในการสืบสวน'
      },
      {
        id: 'opt_m3_q13_b',
        label: 'เลือกแหล่งที่เขียนสั้นกว่า',
        isCorrect: false,
        feedback: 'ความยาวของข้อความไม่ได้บอกความน่าเชื่อถือ'
      },
      {
        id: 'opt_m3_q13_c',
        label: 'ตรวจว่าแต่ละแหล่งใช้หลักฐานและวิธีศึกษาอย่างไร',
        isCorrect: true,
        feedback: 'ถูกต้อง! การตรวจสอบหลักฐานและวิธีศึกษาเป็นจุดเริ่มต้นของการประเมินข้อมูลอย่างเป็นกลาง'
      },
      {
        id: 'opt_m3_q13_d',
        label: 'เชื่อแหล่งที่เห็นก่อน',
        isCorrect: false,
        feedback: 'การเชื่อแหล่งแรกทันทีอาจทำให้ตกเป็นเหยื่อของข่าวลวงได้'
      }
    ]
  },

  // Q14 - S3, G2, S4 (MaxScore 3: 2 + 1) - REVISION_SELECT / Multi-step
  {
    questionId: 'q14_m3',
    missionId: 'm3',
    indicatorId: 'S3',
    indicatorIds: ['S3', 'G2', 'S4'],
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ DECIDE (ตัดสินใจและทบทวน)',
    type: 'REVISION_SELECT',
    title: 'ข้อ 14: เลือก Source ที่เหมาะสมและแนวทางการตัดสินใจ',
    stem: 'พิจารณาการเลือกใช้ Source Card ที่เหมาะสมและแนวทางการนำข้อมูลไปใช้ตัดสินใจ:',
    maxScore: 3,
    scoringType: 'PARTIAL',
    hint: 'Q14-A เลือก Source Card ที่มีหลักฐานทางการแพทย์ตรวจสอบได้ (S3, G2), Q14-B เลือกแนวทางการตัดสินใจที่รอบคอบ (S4)',
    multiStepQuestions: [
      {
        stepKey: 'q14_a',
        title: 'Q14-A: เลือก Source Card ที่เหมาะสมสำหรับใช้ประกอบการตัดสินใจ',
        prompt: 'Source Card ใดเหมาะสมที่สุดสำหรับนำมาใช้เป็นหลักฐานประกอบการตัดสินใจ (ตรวจสอบได้ มีหลักฐานอ้างอิงชัดเจน)?',
        options: [
          {
            id: 'opt_m3_q14_a1',
            label: 'SC-M3-02 (คณะแพทยศาสตร์ รพ.รามาธิบดี - ข้อมูลทางการแพทย์ที่ตรวจสอบได้)',
            isCorrect: true,
            feedback: 'ถูกต้อง! SC-M3-02 เป็นหลักฐานทางการแพทย์จากโรงพยาบาลชั้นนำที่ตรวจสอบได้จริง'
          },
          {
            id: 'opt_m3_q14_a2',
            label: 'SC-M3-05 (เพจชีวิตฟิตทุกวัน - โฆษณาขายเครื่องดื่มวิตามิน)',
            isCorrect: false,
            feedback: 'SC-M3-05 เป็นสื่อโฆษณาจำลองที่มีผลประโยชน์แอบแฝง'
          },
          {
            id: 'opt_m3_q14_a3',
            label: 'SC-M3-06 (โพสต์เล่าความรู้สึกส่วนตัวของต้น)',
            isCorrect: false,
            feedback: 'SC-M3-06 เป็นเพียงประสบการณ์ส่วนบุคคลของคนคนเดียว'
          },
          {
            id: 'opt_m3_q14_a4',
            label: 'SC-M3-10 (บริษัทสมองไวจำกัด - โฆษณาขายอาหารเสริม)',
            isCorrect: false,
            feedback: 'SC-M3-10 เป็นสื่อโฆษณาจำลองที่อวดอ้างสรรพคุณเกินจริง'
          }
        ]
      },
      {
        stepKey: 'q14_b',
        title: 'Q14-B: แนวทางการนำข้อมูลไปใช้ประกอบการตัดสินใจ',
        prompt: 'ถ้าต้องนำข้อมูลไปใช้ประกอบการตัดสินใจ ควรทำอย่างไร?',
        options: [
          {
            id: 'opt_m3_q14_b1',
            label: 'ใช้ข้อมูลจาก Source เดียวทันที',
            isCorrect: false,
            feedback: 'การใช้แหล่งเดียวอาจทำให้มองข้ามข้อจำกัดสำคัญ'
          },
          {
            id: 'opt_m3_q14_b2',
            label: 'ใช้หลายแหล่งและดูข้อจำกัดก่อนตัดสินใจ',
            isCorrect: true,
            feedback: 'ถูกต้อง! ควรเปรียบเทียบข้อมูลจากหลายแหล่งและประเมินข้อจำกัดเพื่อความรอบคอบ'
          },
          {
            id: 'opt_m3_q14_b3',
            label: 'เลือกข้อมูลที่ตรงกับความคิดของเรา',
            isCorrect: false,
            feedback: 'การเลือกเฉพาะสิ่งที่ตรงใจเป็นอคติเชิงยืนยัน (Confirmation Bias)'
          },
          {
            id: 'opt_m3_q14_b4',
            label: 'ใช้โพสต์ออนไลน์เพียงอย่างเดียว',
            isCorrect: false,
            feedback: 'โพสต์ออนไลน์อาจไม่มีหลักฐานงานวิจัยรองรับ'
          }
        ]
      }
    ]
  },

  // Q15 - G3 (MaxScore 2) - EXACT (Single Choice) -> Ans: C
  {
    questionId: 'q15_m3',
    missionId: 'm3',
    indicatorId: 'G3',
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ DECIDE (ตัดสินใจและทบทวน)',
    type: 'SINGLE_CHOICE',
    title: 'ข้อ 15: การตอบสนองเมื่อพบหลักฐานใหม่',
    stem: 'ถ้ามีหลักฐานใหม่ที่น่าเชื่อถือกว่า และข้อมูลใหม่ไม่เหมือนกับที่เราเคยเชื่อ ควรทำอย่างไร?',
    maxScore: 2,
    scoringType: 'EXACT',
    hint: 'นักสืบที่ดีต้องพร้อมปรับปรุงความคิดตามหลักฐานเชิงประจักษ์ (Open-mindedness)',
    options: [
      {
        id: 'opt_m3_q15_a',
        label: 'ไม่สนใจ',
        isCorrect: false,
        feedback: 'การเพิกเฉยต่อหลักฐานใหม่ทำให้ไม่เกิดการเรียนรู้'
      },
      {
        id: 'opt_m3_q15_b',
        label: 'เปลี่ยนคำตอบทันทีโดยไม่ตรวจ',
        isCorrect: false,
        feedback: 'ต้องตรวจทานความน่าเชื่อถือของหลักฐานใหม่ก่อนเสมอ'
      },
      {
        id: 'opt_m3_q15_c',
        label: 'ตรวจหลักฐานใหม่แล้วปรับความคิดได้',
        isCorrect: true,
        feedback: 'ถูกต้อง! การตรวจสอบหลักฐานใหม่อย่างรอบคอบและพร้อมปรับเปลี่ยนมุมมองเดิมถือเป็นทักษะการเติบโตทางความคิดที่สำคัญ'
      },
      {
        id: 'opt_m3_q15_d',
        label: 'เลือกข้อมูลที่ตรงกับความคิดเดิม',
        isCorrect: false,
        feedback: 'การยึดติดกับความคิดเดิมโดยไม่ดูหลักฐานทำให้อ่อนไหวต่อข้อมูลเท็จ'
      }
    ]
  },

  // Q16 - E4, G4 (MaxScore 4: 1+1+1+1) - REVISION_SELECT / Multi-step
  {
    questionId: 'q16_m3',
    missionId: 'm3',
    indicatorId: 'G4',
    indicatorIds: ['E4', 'G4'],
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ DECIDE (ตัดสินใจและทบทวน)',
    type: 'REVISION_SELECT',
    title: 'ข้อ 16: การตัดสินใจเชิงกระบวนการที่สอดคล้อง (Decision Revision Process)',
    stem: 'สถานการณ์: มีคนแชร์ว่า “ถ้านอนมากขึ้น ทุกคนจะสอบได้คะแนนสูงขึ้นแน่นอน” ให้นักสืบดำเนินการวิเคราะห์ 4 ขั้นตอน:',
    maxScore: 4,
    scoringType: 'RUBRIC',
    hint: 'ดำเนินกระบวนการคิดตามลำดับ: วิเคราะห์ข้อสรุป (A) → เลือกหลักฐาน (B) → กำหนดแนวทางต่อ (C) → ตรวจความสอดคล้อง (D)',
    multiStepQuestions: [
      {
        stepKey: 'q16_a',
        title: 'ขั้นตอนที่ 1: ข้อสรุปต่อข้อความที่แชร์',
        prompt: 'ข้อสรุปต่อข้อความดังกล่าวคืออะไร?',
        options: [
          {
            id: 'opt_m3_q16_a1',
            label: 'เชื่อทันที',
            isCorrect: false,
            feedback: 'ไม่ควรเชื่อทันทีโดยไม่มีการตรวจสอบ'
          },
          {
            id: 'opt_m3_q16_a2',
            label: 'ยังสรุปไม่ได้ว่าเป็นเหตุและผลกับทุกคน',
            isCorrect: true,
            feedback: 'ถูกต้อง! ข้อความนี้เป็นการด่วนสรุปเหมารวมเกินกว่าหลักฐาน'
          },
          {
            id: 'opt_m3_q16_a3',
            label: 'ข่าวนี้ผิดแน่นอน',
            isCorrect: false,
            feedback: 'การนอนส่งผลต่อสมองจริง แต่ไม่สามารถฟันธงเป็นเหตุผลเดียวกับทุกคนได้'
          }
        ]
      },
      {
        stepKey: 'q16_b',
        title: 'ขั้นตอนที่ 2: เลือกหลักฐานที่ควรใช้ตรวจสอบ',
        prompt: 'เลือก Source Card ที่ควรนำมาใช้ตรวจสอบข้ออ้างนี้อย่างน่าเชื่อถือ:',
        options: [
          {
            id: 'opt_m3_q16_b1',
            label: 'SC-M3-02 (รพ.รามาธิบดี - บทความทางการแพทย์เรื่องการนอนและการเจริญเติบโต)',
            isCorrect: true,
            feedback: 'ถูกต้อง! เป็นหลักฐานทางการแพทย์ที่ตรวจสอบได้จริง'
          },
          {
            id: 'opt_m3_q16_b2',
            label: 'SC-M3-05 (เพจชีวิตฟิตทุกวัน - โฆษณาเครื่องดื่มวิตามิน)',
            isCorrect: false,
            feedback: 'SC-M3-05 เป็นสื่อโฆษณาจำลอง'
          },
          {
            id: 'opt_m3_q16_b3',
            label: 'SC-M3-06 (โพสต์แชร์ความเห็นส่วนตัวของต้น)',
            isCorrect: false,
            feedback: 'SC-M3-06 เป็นเพียงความเห็นส่วนตัว'
          },
          {
            id: 'opt_m3_q16_b4',
            label: 'SC-M3-10 (บริษัทสมองไว - โฆษณาอาหารเสริม)',
            isCorrect: false,
            feedback: 'SC-M3-10 เป็นสื่อโฆษณาจำลอง'
          }
        ]
      },
      {
        stepKey: 'q16_c',
        title: 'ขั้นตอนที่ 3: สิ่งที่ควรทำต่อ',
        prompt: 'สิ่งที่นักสืบควรทำต่อไปคืออะไร?',
        options: [
          {
            id: 'opt_m3_q16_c1',
            label: 'แชร์ต่อทันที',
            isCorrect: false,
            feedback: 'ไม่ควรแชร์ต่อก่อนตรวจสอบความถูกต้อง'
          },
          {
            id: 'opt_m3_q16_c2',
            label: 'ตรวจงานวิจัยและข้อจำกัดของหลักฐานเพิ่มเติม',
            isCorrect: true,
            feedback: 'ถูกต้อง! ควรตรวจสอบหลักฐานวิจัยและข้อจำกัดเพิ่มเติมก่อนนำไปใช้'
          },
          {
            id: 'opt_m3_q16_c3',
            label: 'ลบข้อมูลทั้งหมด',
            isCorrect: false,
            feedback: 'การสืบสวนควรเก็บบันทึกหลักฐานเพื่อการวิเคราะห์'
          }
        ]
      },
      {
        stepKey: 'q16_d',
        title: 'ขั้นตอนที่ 4: ตรวจสอบความสอดคล้อง (Consistency)',
        prompt: 'ประเมินความสอดคล้องระหว่างข้อสรุป หลักฐาน และการกระทำต่อไป:',
        options: [
          {
            id: 'opt_m3_q16_d1',
            label: 'ข้อสรุป หลักฐาน และสิ่งที่ควรทำต่อ มีความสอดคล้องกันอย่างสมเหตุสมผล',
            isCorrect: true,
            feedback: 'ถูกต้อง! กระบวนการคิด การเลือกหลักฐาน และการตัดสินใจมีความสอดคล้องสมบูรณ์'
          },
          {
            id: 'opt_m3_q16_d2',
            label: 'ข้อสรุปไม่สอดคล้องกับหลักฐานที่เลือก',
            isCorrect: false,
            feedback: 'ไม่สอดคล้อง'
          },
          {
            id: 'opt_m3_q16_d3',
            label: 'เลือกปฏิบัติตามความรู้สึกส่วนตัวโดยไม่ใช้หลักฐาน',
            isCorrect: false,
            feedback: 'ไม่สอดคล้องกับกระบวนการทางวิทยาศาสตร์'
          }
        ]
      }
    ]
  }
];
