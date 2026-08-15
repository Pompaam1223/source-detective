import { Question } from '../types';

export const MISSION_4_QUESTIONS: Question[] = [
  // ==========================================
  // STAGE 1: 💡 THINK — วิเคราะห์ข้อมูล (Q01–Q04) [10 คะแนน]
  // ==========================================
  {
    questionId: 'q01_m4',
    missionId: 'm4',
    stageId: 's1',
    stageNumber: 1,
    stageName: 'ด่าน 1: 💡 THINK — วิเคราะห์ข้อมูล',
    indicatorId: 'T1',
    indicatorIds: ['T1'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 1: การตรวจสอบตัวตนผู้ส่งสาร (T1)',
    stem: 'ถ้าเห็นบัญชีที่บอกว่าเป็น CDC สิ่งแรกที่ควรตรวจคืออะไร?',
    contextScenario: 'พบบัญชีหนึ่งบนโซเชียลมีเดียระบุชื่อโปรไฟล์ว่า CDC และโพสต์คำแนะนำสุขภาพ',
    sourceCardId: 'SC-M4-01',
    options: [
      {
        id: 'opt_m4_q1_a',
        label: 'A. มีคนติดตามมากไหม',
        isCorrect: false,
        feedback: 'จำนวนผู้ติดตามไม่ได้การันตีว่าเป็นบัญชีทางการจริง'
      },
      {
        id: 'opt_m4_q1_b',
        label: 'B. เป็นช่องทางทางการของ CDC หรือไม่',
        isCorrect: true,
        feedback: 'ถูกต้อง! สิ่งแรกที่ต้องตรวจคือการยืนยันว่าเป็นช่องทางทางการของหน่วยงานจริง'
      },
      {
        id: 'opt_m4_q1_c',
        label: 'C. รูปโปรไฟล์สวยไหม',
        isCorrect: false,
        feedback: 'รูปภาพและโลโก้สามารถคัดลอกมาใช้ได้'
      },
      {
        id: 'opt_m4_q1_d',
        label: 'D. มีคนกดไลก์มากไหม',
        isCorrect: false,
        feedback: 'ยอดกดไลก์สามารถปั่นกระแสหรือซื้อโฆษณาได้'
      }
    ],
    hint: 'ความน่าเชื่อถือขององค์กรสาธารณสุขขึ้นอยู่กับความเป็นช่องทางทางการ ไม่ใช่ยอดตัวเลขบนโซเชียล',
    evidenceType: 'AUTHOR'
  },
  {
    questionId: 'q02_m4',
    missionId: 'm4',
    stageId: 's1',
    stageNumber: 1,
    stageName: 'ด่าน 1: 💡 THINK — วิเคราะห์ข้อมูล',
    indicatorId: 'T2',
    indicatorIds: ['T2'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 2: การระบุคำกล่าวอ้างที่ต้องตรวจสอบ (T2)',
    stem: 'ข้อใดเป็นคำกล่าวอ้างที่ต้องตรวจสอบ?',
    contextScenario: 'ข้อความต่อไปนี้ ข้อใดมีลักษณะเป็นคำกล่าวอ้างผลลัพธ์ที่ต้องการให้ผู้อ่านเชื่อ',
    sourceCardId: 'SC-M4-05',
    options: [
      {
        id: 'opt_m4_q2_a',
        label: 'A. “วิธีนี้ช่วยให้ทุกคนดีขึ้นแน่นอน”',
        isCorrect: true,
        feedback: 'ถูกต้อง! คำว่า "ช่วยให้ทุกคนดีขึ้นแน่นอน" เป็นคำกล่าวอ้างแบบเหมารวม (Claim) ที่ต้องหาหลักฐานพิสูจน์'
      },
      {
        id: 'opt_m4_q2_b',
        label: 'B. “โพสต์นี้ไม่มี URL”',
        isCorrect: false,
        feedback: 'นี่คือการสังเกตข้อเท็จจริงทางกายภาพของโพสต์ ไม่ใช่คำกล่าวอ้างผลลัพธ์'
      },
      {
        id: 'opt_m4_q2_c',
        label: 'C. “ผู้เขียนไม่ได้ระบุชื่อ”',
        isCorrect: false,
        feedback: 'นี่คือการระบุข้อจำกัดของผู้ส่งสาร ไม่ใช่คำกล่าวอ้าง'
      },
      {
        id: 'opt_m4_q2_d',
        label: 'D. “ไม่มีงานวิจัยแนบมา”',
        isCorrect: false,
        feedback: 'นี่คือการระบุข้อจำกัดของหลักฐาน ไม่ใช่คำกล่าวอ้าง'
      }
    ],
    hint: 'คำกล่าวอ้าง (Claim) คือข้อความที่บอกผลลัพธ์หรือชักชวนให้เชื่อในสิ่งใดสิ่งหนึ่ง',
    evidenceType: 'CLAIM'
  },
  {
    questionId: 'q03_m4',
    missionId: 'm4',
    stageId: 's1',
    stageNumber: 1,
    stageName: 'ด่าน 1: 💡 THINK — วิเคราะห์ข้อมูล',
    indicatorId: 'T3',
    indicatorIds: ['T3'],
    type: 'MULTI_SELECT',
    maxScore: 3,
    scoringType: 'PARTIAL',
    title: 'ข้อ 3: การตรวจข้อมูลเพิ่มเติมเมื่อพบข้ออ้าง (T3)',
    stem: 'ถ้ามีข้อความว่า ‘ผู้เชี่ยวชาญบอกว่าวิธีนี้ได้ผล 100%’ ควรตรวจข้อมูลอะไรเพิ่ม? (เลือก 2 ข้อ)',
    contextScenario: 'การอ้างลอยๆ ว่า "ผู้เชี่ยวชาญบอกว่า..." จำเป็นต้องตรวจสอบองค์ประกอบใดเพื่อยืนยันความจริง',
    sourceCardId: 'SC-M4-05',
    options: [
      {
        id: 'opt_m4_q3_a',
        label: 'A. ชื่อและคุณวุฒิของผู้เชี่ยวชาญ',
        isCorrect: true,
        feedback: 'ถูกต้อง! ต้องรู้ว่าผู้เชี่ยวชาญคือใคร มีตัวตนและเชี่ยวชาญตรงสาขาจริงหรือไม่'
      },
      {
        id: 'opt_m4_q3_b',
        label: 'B. แหล่งอ้างอิงหรือหลักฐานงานวิจัยที่รองรับ',
        isCorrect: true,
        feedback: 'ถูกต้อง! คำอ้างว่าได้ผล 100% ต้องมีรายงานการวิจัยและเอกสารอ้างอิงที่ตรวจสอบได้'
      },
      {
        id: 'opt_m4_q3_c',
        label: 'C. สีพื้นหลังของโพสต์',
        isCorrect: false,
        feedback: 'สีพื้นหลังเป็นเพียงการตกแต่ง ไม่เกี่ยวข้องกับความถูกต้องของเนื้อหา'
      },
      {
        id: 'opt_m4_q3_d',
        label: 'D. จำนวน Emoji ในข้อความ',
        isCorrect: false,
        feedback: 'Emoji ไม่ใช่หลักฐานยืนยันความน่าเชื่อถือ'
      }
    ],
    hint: 'มองหาองค์ประกอบที่ยืนยันตัวตนผู้เชี่ยวชาญและเอกสารอ้างอิงเชิงวิชาการ',
    evidenceType: 'CLAIM'
  },
  {
    questionId: 'q04_m4',
    missionId: 'm4',
    stageId: 's1',
    stageNumber: 1,
    stageName: 'ด่าน 1: 💡 THINK — วิเคราะห์ข้อมูล',
    indicatorId: 'T4',
    indicatorIds: ['T4'],
    type: 'MATCHING',
    maxScore: 3,
    scoringType: 'EXACT',
    title: 'ข้อ 4: การจับคู่ข้อสังเกตกับแนวทางการตรวจสอบ (T4)',
    stem: 'จับคู่ข้อสังเกตเกี่ยวกับแหล่งข้อมูลด้านซ้าย กับแนวทางการตรวจสอบที่เหมาะสมด้านขวา:',
    contextScenario: 'วิเคราะห์ลักษณะของข้อมูลและกำหนดแนวทางการสืบสวนที่ถูกต้อง',
    sourceCardIds: ['SC-M4-05', 'SC-M4-06', 'SC-M4-08'],
    matchingPairs: [
      {
        id: 'm4_q4_pair1',
        item: 'A. ไม่มีชื่อผู้เขียน',
        targetMatch: '1. ตรวจเพิ่ม'
      },
      {
        id: 'm4_q4_pair2',
        item: 'B. มีแหล่งอ้างอิง',
        targetMatch: '2. ตรวจแหล่งนั้น'
      },
      {
        id: 'm4_q4_pair3',
        item: 'C. มีแต่ประสบการณ์คนเดียว',
        targetMatch: '3. ยังไม่สรุปแทนทุกคน'
      }
    ],
    hint: 'เชื่อมโยงลักษณะของแหล่งข้อมูลกับระดับการระมัดระวังและการสืบค้นย้อนกลับ',
    evidenceType: 'COMPARISON'
  },

  // ==========================================
  // STAGE 2: 🔍 CHECK — ตรวจสอบหลักฐาน (Q05–Q08) [10 คะแนน]
  // ==========================================
  {
    questionId: 'q05_m4',
    missionId: 'm4',
    stageId: 's2',
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK — ตรวจสอบหลักฐาน',
    indicatorId: 'C1',
    indicatorIds: ['C1'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 5: การประเมินน้ำหนักของประสบการณ์ส่วนบุคคล (C1)',
    stem: '‘ฉันลองแล้วดีขึ้น’ เพียงพอหรือไม่ที่จะบอกว่าทุกคนควรทำตาม?',
    contextScenario: 'มีคนโพสต์ว่าตนเองลองทำตามวิธีหนึ่งแล้วรู้สึกดีขึ้นมาก จึงแนะนำให้ทุกคนทำเหมือนกัน',
    sourceCardId: 'SC-M4-06',
    options: [
      {
        id: 'opt_m4_q5_a',
        label: 'A. เพียงพอ',
        isCorrect: false,
        feedback: 'ประสบการณ์คนเดียวอาจมีปัจจัยเฉพาะบุคคล ไม่เพียงพอที่จะสรุปเป็นมาตรฐานสำหรับทุกคน'
      },
      {
        id: 'opt_m4_q5_b',
        label: 'B. ยังไม่เพียงพอ',
        isCorrect: true,
        feedback: 'ถูกต้อง! ประสบการณ์ส่วนบุคคล (Anecdotal) ยังไม่มีกลุ่มตัวอย่างและการควบคุมตัวแปรทางวิทยาศาสตร์'
      }
    ],
    hint: 'พิจารณาความแตกต่างระหว่างประสบการณ์ของคนคนเดียวกับงานวิจัยที่มีกลุ่มตัวอย่างขนาดใหญ่',
    evidenceType: 'REASON'
  },
  {
    questionId: 'q06_m4',
    missionId: 'm4',
    stageId: 's2',
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK — ตรวจสอบหลักฐาน',
    indicatorId: 'C2',
    indicatorIds: ['C2'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 6: วิธีตรวจสอบช่องทางทางการของหน่วยงาน (C2)',
    stem: 'ถ้าต้องตรวจว่า Account เป็น CDC จริงหรือไม่ ควรทำอย่างไร?',
    contextScenario: 'ต้องการยืนยันว่าข้อมูลที่เห็นมาจากหน่วยงาน CDC สหรัฐฯ จริงหรือไม่',
    sourceCardId: 'SC-M4-01',
    options: [
      {
        id: 'opt_m4_q6_a',
        label: 'A. ดูจำนวนผู้ติดตาม',
        isCorrect: false,
        feedback: 'จำนวนผู้ติดตามสามารถสร้างหรือซื้อยอดปลอมได้'
      },
      {
        id: 'opt_m4_q6_b',
        label: 'B. ตรวจสอบกับช่องทางทางการของ CDC',
        isCorrect: true,
        feedback: 'ถูกต้อง! การ Cross-check กับเว็บไซต์หลักของ CDC เป็นวิธีที่แม่นยำที่สุด'
      },
      {
        id: 'opt_m4_q6_c',
        label: 'C. ดูจำนวนคนแชร์',
        isCorrect: false,
        feedback: 'ยอดแชร์ไม่ได้ยืนยันความถูกต้องของเจ้าของบัญชี'
      },
      {
        id: 'opt_m4_q6_d',
        label: 'D. ดูรูปโปรไฟล์',
        isCorrect: false,
        feedback: 'รูปโปรไฟล์สามารถถูกบันทึกมาแอบอ้างได้ง่าย'
      }
    ],
    hint: 'มองหาวิธีการตรวจสอบย้อนกลับไปยังเว็บไซต์หลักของหน่วยงานต้นสังกัด',
    evidenceType: 'AUTHOR'
  },
  {
    questionId: 'q07_m4',
    missionId: 'm4',
    stageId: 's2',
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK — ตรวจสอบหลักฐาน',
    indicatorId: 'C3',
    indicatorIds: ['C3'],
    type: 'MULTI_SELECT',
    maxScore: 3,
    scoringType: 'PARTIAL',
    title: 'ข้อ 7: การตรวจหลักฐานรองรับคำอ้างได้ผล 100% (C3)',
    stem: 'ถ้าโพสต์บอกว่า ‘ได้ผล 100%’ ควรตรวจอะไร? (เลือก 2 ข้อ)',
    contextScenario: 'พบข้อความอ้างสรรพคุณว่าได้ผลแน่นอน 100% กับทุกคน',
    sourceCardId: 'SC-M4-05',
    options: [
      {
        id: 'opt_m4_q7_a',
        label: 'A. มีงานวิจัยหรือหลักฐานรองรับหรือไม่',
        isCorrect: true,
        feedback: 'ถูกต้อง! ต้องตรวจว่ามีงานวิจัยและผลการทดลองที่พิสูจน์ได้จริงหรือไม่'
      },
      {
        id: 'opt_m4_q7_b',
        label: 'B. แหล่งอ้างอิงมาจากไหน',
        isCorrect: true,
        feedback: 'ถูกต้อง! ต้องตรวจสอบความน่าเชื่อถือและความเป็นกลางของสถาบันที่อ้างอิง'
      },
      {
        id: 'opt_m4_q7_c',
        label: 'C. สีของภาพ',
        isCorrect: false,
        feedback: 'สีของภาพไม่เกี่ยวข้องกับหลักฐานทางวิทยาศาสตร์'
      },
      {
        id: 'opt_m4_q7_d',
        label: 'D. จำนวน Emoji',
        isCorrect: false,
        feedback: 'Emoji ไม่ใช่ข้อมูลเชิงประจักษ์'
      }
    ],
    hint: 'เน้นการค้นหาหลักฐานทางวิชาการและตรวจสอบที่มาของแหล่งอ้างอิง',
    evidenceType: 'CLAIM'
  },
  {
    questionId: 'q08_m4',
    missionId: 'm4',
    stageId: 's2',
    stageNumber: 2,
    stageName: 'ด่าน 2: 🔍 CHECK — ตรวจสอบหลักฐาน',
    indicatorId: 'C4',
    indicatorIds: ['C4'],
    type: 'REVISION_SELECT',
    maxScore: 3,
    scoringType: 'PARTIAL',
    title: 'ข้อ 8: การระบุข้อจำกัดและกำหนดแนวทางสืบค้นต่อ (C4)',
    stem: 'พิจารณาโพสต์จากเพื่อนที่ระบุว่า "ฉันลองแล้วดีขึ้น" แล้วตอบคำถามทั้ง 2 ส่วน:',
    contextScenario: 'เพื่อนสนิทส่งข้อความมาบอกว่าตนเองทดลองวิธีนี้แล้วรู้สึกดีขึ้นมาก',
    sourceCardId: 'SC-M4-06',
    multiStepQuestions: [
      {
        stepKey: 'q08_a',
        title: 'ส่วนที่ 1: ข้อจำกัดสำคัญ',
        prompt: 'โพสต์จากเพื่อนบอกว่า ‘ฉันลองแล้วดีขึ้น’ ข้อจำกัดสำคัญคืออะไร?',
        options: [
          {
            id: 'opt_m4_q8_a1',
            label: 'A. เป็นประสบการณ์ของคนเดียว',
            isCorrect: true,
            feedback: 'ถูกต้อง! ข้อจำกัดสำคัญคือเป็นเพียงประสบการณ์เดี่ยว (Anecdotal)'
          },
          {
            id: 'opt_m4_q8_a2',
            label: 'B. ไม่รู้ว่าภาพสวยหรือไม่',
            isCorrect: false,
            feedback: 'ความสวยงามของภาพไม่ใช่ข้อจำกัดด้านความน่าเชื่อถือ'
          },
          {
            id: 'opt_m4_q8_a3',
            label: 'C. ไม่รู้ว่ามีคนกดไลก์เท่าไร',
            isCorrect: false,
            feedback: 'ยอดไลก์ไม่ใช่ตัววัดความถูกต้องของข้อมูล'
          },
          {
            id: 'opt_m4_q8_a4',
            label: 'D. ข้อความสั้น',
            isCorrect: false,
            feedback: 'ความสั้นยาวไม่ใช่ข้อจำกัดหลักทางระเบียบวิธี'
          }
        ]
      },
      {
        stepKey: 'q08_b',
        title: 'ส่วนที่ 2: แนวทางดำเนินการต่อ',
        prompt: 'ควรทำอย่างไรต่อก่อนนำไปปฏิบัติตามหรือแชร์ต่อ?',
        options: [
          {
            id: 'opt_m4_q8_b1',
            label: 'A. ตรวจหลักฐานเพิ่มเติม',
            isCorrect: true,
            feedback: 'ถูกต้อง! ควรค้นหาหลักฐานทางการแพทย์เพิ่มเติมก่อนเชื่อหรือแชร์'
          },
          {
            id: 'opt_m4_q8_b2',
            label: 'B. แชร์ทันที',
            isCorrect: false,
            feedback: 'การแชร์ข้อมูลที่ยังไม่ได้ตรวจสอบอาจเผยแพร่ข้อมูลที่คลาดเคลื่อน'
          }
        ]
      }
    ],
    hint: 'ระบุข้อจำกัดของประสบการณ์เดี่ยว และเลือกแนวทางค้นหาหลักฐานเพิ่ม',
    evidenceType: 'REASON'
  },

  // ==========================================
  // STAGE 3: 🧩 SOLVE — แก้ปัญหาและกำหนดทางเลือก (Q09–Q12) [10 คะแนน]
  // ==========================================
  {
    questionId: 'q09_m4',
    missionId: 'm4',
    stageId: 's3',
    stageNumber: 3,
    stageName: 'ด่าน 3: 🧩 SOLVE — แก้ปัญหาและกำหนดทางเลือก',
    indicatorId: 'S1',
    indicatorIds: ['S1'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 9: การวางแผนเมื่อพบข้อมูลน่าสงสัย (S1)',
    stem: 'วิธีใดเหมาะสมที่สุดเมื่อพบข้อมูลที่น่าสงสัย?',
    contextScenario: 'คุณกำลังท่องอินเทอร์เน็ตและพบข้อมูลสุขภาพที่มีข้อความชวนสงสัย',
    sourceCardId: 'SC-M4-10',
    options: [
      {
        id: 'opt_m4_q9_a',
        label: 'A. แชร์ก่อน',
        isCorrect: false,
        feedback: 'การแชร์ก่อนตรวจอาจสร้างความตื่นตระหนกหรือความเข้าใจผิด'
      },
      {
        id: 'opt_m4_q9_b',
        label: 'B. ตรวจแหล่งที่มาและหลักฐาน',
        isCorrect: true,
        feedback: 'ถูกต้อง! วิธีที่เหมาะสมที่สุดคือหยุดตรวจสอบแหล่งที่มาและหลักฐานก่อน'
      },
      {
        id: 'opt_m4_q9_c',
        label: 'C. เชื่อเพราะเพื่อนส่ง',
        isCorrect: false,
        feedback: 'เพื่อนอาจรู้เท่าไม่ถึงการณ์และส่งข้อมูลเท็จมาได้'
      },
      {
        id: 'opt_m4_q9_d',
        label: 'D. เชื่อเพราะมีคนแชร์มาก',
        isCorrect: false,
        feedback: 'การแชร์จำนวนมากไม่ได้สะท้อนข้อเท็จจริง'
      }
    ],
    hint: 'หลักปฏิบัติพื้นฐานคือ "หยุด คิด ตรวจสอบแหล่งที่มาและหลักฐานก่อนเชื่อ"',
    evidenceType: 'PROCESS'
  },
  {
    questionId: 'q10_m4',
    missionId: 'm4',
    stageId: 's3',
    stageNumber: 3,
    stageName: 'ด่าน 3: 🧩 SOLVE — แก้ปัญหาและกำหนดทางเลือก',
    indicatorId: 'S2',
    indicatorIds: ['S2'],
    type: 'ORDERING',
    maxScore: 3,
    scoringType: 'PARTIAL',
    title: 'ข้อ 10: การจัดลำดับขั้นตอนการตรวจสอบข้อมูล (S2)',
    stem: 'เรียงขั้นตอนการตรวจสอบข้อมูลให้ถูกต้องตามลำดับ:',
    contextScenario: 'จัดเรียงกระบวนการสืบสวนข้อมูลข่าวสาร 4 ขั้นตอน',
    orderingItems: [
      {
        id: 'm4_q10_item2',
        text: 'อ่าน Claim (วิเคราะห์คำกล่าวอ้าง)',
        correctOrder: 1
      },
      {
        id: 'm4_q10_item3',
        text: 'ตรวจแหล่งที่มา (ตรวจสอบผู้ส่งสารและต้นทาง)',
        correctOrder: 2
      },
      {
        id: 'm4_q10_item1',
        text: 'ตรวจหลักฐาน (ตรวจสอบเอกสารและงานวิจัยรองรับ)',
        correctOrder: 3
      },
      {
        id: 'm4_q10_item4',
        text: 'ตัดสินใจ (ประเมินว่าจะเชื่อ ใช้ หรือแชร์หรือไม่)',
        correctOrder: 4
      }
    ],
    hint: 'เริ่มจากอ่านข้ออ้าง (2) -> ตรวจแหล่งที่มา (3) -> ตรวจหลักฐาน (1) -> ตัดสินใจ (4)',
    evidenceType: 'PROCESS'
  },
  {
    questionId: 'q11_m4',
    missionId: 'm4',
    stageId: 's3',
    stageNumber: 3,
    stageName: 'ด่าน 3: 🧩 SOLVE — แก้ปัญหาและกำหนดทางเลือก',
    indicatorId: 'S3',
    indicatorIds: ['S3'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 11: การกำหนดทางเลือกเมื่อหลักฐานไม่เพียงพอ (S3)',
    stem: 'ถ้าตรวจแล้วพบว่าหลักฐานยังไม่เพียงพอ ควรทำอย่างไร?',
    contextScenario: 'หลังจากสืบค้นข้อมูลแล้ว พบว่าหลักฐานยังมีน้ำหนักน้อยและยังไม่ชัดเจน',
    sourceCardId: 'SC-M4-04',
    options: [
      {
        id: 'opt_m4_q11_a',
        label: 'A. แชร์ไปก่อน',
        isCorrect: false,
        feedback: 'การแชร์ข้อมูลที่หลักฐานไม่พอนำไปสู่ความเข้าใจคลาดเคลื่อน'
      },
      {
        id: 'opt_m4_q11_b',
        label: 'B. ยังไม่แชร์และค้นข้อมูลเพิ่ม',
        isCorrect: true,
        feedback: 'ถูกต้อง! เมื่อหลักฐานยังไม่พอ ต้องระงับการแชร์และค้นหาข้อมูลเพิ่มเติม'
      },
      {
        id: 'opt_m4_q11_c',
        label: 'C. เชื่อเพราะมีคนพูดหลายคน',
        isCorrect: false,
        feedback: 'จำนวนคนที่พูดไม่สามารถทดแทนหลักฐานเชิงประจักษ์ได้'
      },
      {
        id: 'opt_m4_q11_d',
        label: 'D. เลือกคำตอบที่ชอบ',
        isCorrect: false,
        feedback: 'การตัดสินใจต้องยึดหลักฐาน ไม่ใช่อารมณ์ความชอบส่วนตัว'
      }
    ],
    hint: 'ยึดหลักความรอบคอบ: เมื่อข้อมูลยังไม่ชัดเจน ต้องชะลอการส่งต่อและสืบค้นเพิ่ม',
    evidenceType: 'DECISION'
  },
  {
    questionId: 'q12_m4',
    missionId: 'm4',
    stageId: 's3',
    stageNumber: 3,
    stageName: 'ด่าน 3: 🧩 SOLVE — แก้ปัญหาและกำหนดทางเลือก',
    indicatorId: 'S4',
    indicatorIds: ['S4'],
    type: 'SINGLE_CHOICE',
    maxScore: 3,
    scoringType: 'EXACT',
    title: 'ข้อ 12: การตัดสินใจเกี่ยวกับข้อมูลที่มีความเสี่ยงสูง (S4)',
    stem: 'พบว่าโพสต์หนึ่งไม่มีผู้เขียน ไม่มีแหล่งอ้างอิง และไม่มีหลักฐาน ควรตัดสินใจอย่างไร?',
    contextScenario: 'โพสต์หนึ่งในโซเชียลระบุสูตรบำรุงสมอง แต่ไม่มีชื่อผู้เขียน ไม่มีแหล่งอ้างอิง และไม่มีงานวิจัยใดๆ',
    sourceCardId: 'SC-M4-10',
    options: [
      {
        id: 'opt_m4_q12_a',
        label: 'A. แชร์',
        isCorrect: false,
        feedback: 'ข้อมูลที่ไร้ที่มา ไร้ผู้รับผิดชอบ และไร้หลักฐาน มีความเสี่ยงสูงมาก'
      },
      {
        id: 'opt_m4_q12_b',
        label: 'B. ยังไม่แชร์',
        isCorrect: true,
        feedback: 'ถูกต้อง! โพสต์ที่ไม่มีผู้เขียน แหล่งอ้างอิง หรือหลักฐาน ไม่ควรแชร์ต่อโดยเด็ดขาด'
      },
      {
        id: 'opt_m4_q12_c',
        label: 'C. เชื่อไว้ก่อน',
        isCorrect: false,
        feedback: 'การเชื่อข้อมูลไร้ที่มาอาจส่งผลเสียต่อสุขภาพและการดำเนินชีวิต'
      },
      {
        id: 'opt_m4_q12_d',
        label: 'D. ส่งต่อให้เพื่อนตรวจแทน',
        isCorrect: false,
        feedback: 'การส่งต่อไปให้คนอื่นเป็นการเพิ่มความเสี่ยงในการแพร่กระจายข้อมูลเท็จ'
      }
    ],
    hint: 'เมื่อโพสต์ขาดองค์ประกอบความน่าเชื่อถือทุกด้าน การไม่แชร์คือการตัดสินใจที่ปลอดภัยที่สุด',
    evidenceType: 'DECISION'
  },

  // ==========================================
  // STAGE 4: ⚖️ EXPLAIN & GROW — อธิบายและพัฒนาความคิด (Q13–Q16) [10 คะแนน]
  // ==========================================
  {
    questionId: 'q13_m4',
    missionId: 'm4',
    stageId: 's4',
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ EXPLAIN & GROW — อธิบายและพัฒนาความคิด',
    indicatorId: 'E1',
    indicatorIds: ['E1', 'G1'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 13: เหตุผลที่ต้องตรวจแหล่งที่มาก่อนเชื่อ (E1, G1)',
    stem: 'ทำไมเราจึงควรตรวจแหล่งที่มาก่อนเชื่อข้อมูล?',
    contextScenario: 'การตรวจสอบแหล่งที่มามีบทบาทสำคัญอย่างไรต่อกระบวนการเรียนรู้และการตัดสินใจ',
    sourceCardId: 'SC-M4-01',
    options: [
      {
        id: 'opt_m4_q13_a',
        label: 'A. เพราะข้อมูลทุกอย่างผิด',
        isCorrect: false,
        feedback: 'ข้อมูลออนไลน์มีทั้งข้อมูลจริงและข้อมูลเท็จ ไม่ใช่ผิดทั้งหมด'
      },
      {
        id: 'opt_m4_q13_b',
        label: 'B. เพราะเราต้องรู้ว่าข้อมูลมาจากไหนและน่าเชื่อถือเพียงใด',
        isCorrect: true,
        feedback: 'ถูกต้อง! การรู้ที่มาช่วยให้เราประเมินความเชี่ยวชาญและระดับความน่าเชื่อถือของข้อมูลได้'
      },
      {
        id: 'opt_m4_q13_c',
        label: 'C. เพราะโพสต์ออนไลน์ไม่ดี',
        isCorrect: false,
        feedback: 'การเหมาว่าโพสต์ออนไลน์ไม่ดีทั้งหมดไม่ใช่การคิดเชิงวิพากษ์'
      },
      {
        id: 'opt_m4_q13_d',
        label: 'D. เพราะคนอื่นบอกให้ตรวจ',
        isCorrect: false,
        feedback: 'เราตรวจเพื่อความปลอดภัยและความถูกต้องของตนเอง ไม่ใช่ทำตามคนอื่นสั่ง'
      }
    ],
    hint: 'เข้าใจเหตุผลเชิงตรรกะว่าทำไมการตรวจสอบต้นทางจึงจำเป็นต่อความน่าเชื่อถือ',
    evidenceType: 'REASON'
  },
  {
    questionId: 'q14_m4',
    missionId: 'm4',
    stageId: 's4',
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ EXPLAIN & GROW — อธิบายและพัฒนาความคิด',
    indicatorId: 'E2',
    indicatorIds: ['E2', 'G2'],
    type: 'REVISION_SELECT',
    maxScore: 3,
    scoringType: 'PARTIAL',
    title: 'ข้อ 14: การจับข้อสรุปเกินจริงและการเปิดใจตรวจสอบ (E2, G2)',
    stem: 'วิเคราะห์คำกล่าวอ้างและแนวทางการรับมือเมื่อยังตรวจหลักฐานไม่ได้:',
    contextScenario: 'พิจารณาข้อความโฆษณาและประเมินแนวทางปฏิบัติที่ถูกต้อง',
    sourceCardIds: ['SC-M4-05', 'SC-M4-02'],
    multiStepQuestions: [
      {
        stepKey: 'q14_a',
        title: 'ส่วนที่ 1: ข้อใดเป็นการสรุปเกินหลักฐาน?',
        prompt: 'ข้อใดเป็นการสรุปเกินหลักฐาน (Overgeneralization)?',
        options: [
          {
            id: 'opt_m4_q14_a1',
            label: 'A. ควรตรวจชื่อผู้เชี่ยวชาญ',
            isCorrect: false,
            feedback: 'นี่คือขั้นตอนการตรวจสอบที่ถูกต้อง ไม่ใช่การสรุปเกินจริง'
          },
          {
            id: 'opt_m4_q14_a2',
            label: 'B. ควรดูหลักฐานเพิ่มเติม',
            isCorrect: false,
            feedback: 'นี่คือแนวปฏิบัติที่ดี'
          },
          {
            id: 'opt_m4_q14_a3',
            label: 'C. วิธีนี้ได้ผลกับทุกคนแน่นอน',
            isCorrect: true,
            feedback: 'ถูกต้อง! การสรุปว่าได้ผลกับทุกคนแน่นอนเป็นการสรุปเกินหลักฐาน'
          }
        ]
      },
      {
        stepKey: 'q14_b',
        title: 'ส่วนที่ 2: ถ้ายังตรวจหลักฐานไม่ได้ ควรทำอย่างไร?',
        prompt: 'ถ้ายังตรวจหลักฐานไม่ได้ ควรทำอย่างไร?',
        options: [
          {
            id: 'opt_m4_q14_b1',
            label: 'A. รอและตรวจเพิ่ม',
            isCorrect: true,
            feedback: 'ถูกต้อง! ต้องชะลอการตัดสินใจและค้นหาข้อมูลเพิ่มเติมจนมั่นใจ'
          },
          {
            id: 'opt_m4_q14_b2',
            label: 'B. แชร์ไปก่อน',
            isCorrect: false,
            feedback: 'การแชร์ไปก่อนอาจแพร่กระจายข้อมูลที่ไม่เป็นความจริง'
          }
        ]
      }
    ],
    hint: 'ตรวจจับคำกล่าวอ้างแบบเหมารวม และเลือกการรอตรวจสอบเพิ่มเมื่อยังไม่มีหลักฐาน',
    evidenceType: 'REASON'
  },
  {
    questionId: 'q15_m4',
    missionId: 'm4',
    stageId: 's4',
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ EXPLAIN & GROW — อธิบายและพัฒนาความคิด',
    indicatorId: 'E3',
    indicatorIds: ['E3', 'G3'],
    type: 'SINGLE_CHOICE',
    maxScore: 2,
    scoringType: 'EXACT',
    title: 'ข้อ 15: การทบทวนและปรับเปลี่ยนความคิดตามหลักฐานใหม่ (E3, G3)',
    stem: 'ถ้าเราเคยเชื่อข้อมูลหนึ่ง แต่พบหลักฐานใหม่ที่น่าเชื่อถือกว่า เราควรทำอย่างไร?',
    contextScenario: 'เมื่อมีข้อมูลเชิงประจักษ์ใหม่จากสถาบันการแพทย์ที่ขัดแย้งกับสิ่งที่เราเคยเชื่อในอดีต',
    sourceCardId: 'SC-M4-09',
    options: [
      {
        id: 'opt_m4_q15_a',
        label: 'A. ยืนยันความคิดเดิมเสมอ',
        isCorrect: false,
        feedback: 'การยึดติดความคิดเดิมโดยไม่สนใจหลักฐานใหม่เป็นการปิดกั้นการเติบโต'
      },
      {
        id: 'opt_m4_q15_b',
        label: 'B. ตรวจหลักฐานใหม่และปรับความคิดได้',
        isCorrect: true,
        feedback: 'ถูกต้อง! การเปิดใจตรวจหลักฐานใหม่และพร้อมปรับความคิด (Growth Mindset) คือหัวใจของนักสืบ'
      },
      {
        id: 'opt_m4_q15_c',
        label: 'C. ไม่ต้องตรวจ',
        isCorrect: false,
        feedback: 'การเพิกเฉยต่อหลักฐานใหม่อาจทำให้ตัดสินใจผิดพลาด'
      },
      {
        id: 'opt_m4_q15_d',
        label: 'D. เลิกสนใจข้อมูลทั้งหมด',
        isCorrect: false,
        feedback: 'ควรใช้หลักฐานเป็นเกณฑ์ในการเรียนรู้และตัดสินใจ'
      }
    ],
    hint: 'นักสืบที่มี Growth Mindset จะยินดีตรวจสอบหลักฐานใหม่และปรับเปลี่ยนมุมมองตามความจริง',
    evidenceType: 'REVISION'
  },
  {
    questionId: 'q16_m4',
    missionId: 'm4',
    stageId: 's4',
    stageNumber: 4,
    stageName: 'ด่าน 4: ⚖️ EXPLAIN & GROW — อธิบายและพัฒนาความคิด',
    indicatorId: 'E4',
    indicatorIds: ['E4', 'G4'],
    type: 'ORDERING',
    maxScore: 3,
    scoringType: 'PARTIAL',
    title: 'ข้อ 16: กระบวนการตัดสินใจก่อนแชร์ (E4, G4)',
    stem: 'แชร์ด่วน! วิธีนี้ได้ผล 100% ทุกคนควรทำตาม — ควรทำอะไรตามลำดับ?',
    contextScenario: 'เห็นโพสต์ข้อความ "แชร์ด่วน! ได้ผล 100%" เรียงลำดับขั้นตอนการปฏิบัติที่ถูกต้อง',
    orderingItems: [
      {
        id: 'm4_q16_item1',
        text: 'A. ตรวจแหล่งที่มา (ใครเป็นผู้เผยแพร่ มีความเชี่ยวชาญหรือไม่)',
        correctOrder: 1
      },
      {
        id: 'm4_q16_item2',
        text: 'B. ตรวจหลักฐาน (มีงานวิจัยหรือข้อมูลเชิงประจักษ์รองรับหรือไม่)',
        correctOrder: 2
      },
      {
        id: 'm4_q16_item3',
        text: 'C. ตัดสินใจว่าจะใช้หรือแชร์หรือไม่ (ประเมินความปลอดภัยและความถูกต้อง)',
        correctOrder: 3
      }
    ],
    hint: 'กระบวนการที่ถูกต้อง: ตรวจแหล่งที่มา (A) -> ตรวจหลักฐาน (B) -> ตัดสินใจว่าจะใช้หรือแชร์หรือไม่ (C)',
    evidenceType: 'DECISION'
  }
];
