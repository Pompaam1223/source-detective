import React from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileCheck2,
  FolderArchive,
  Bot,
  DownloadCloud,
  CheckCircle,
  Settings
} from 'lucide-react';

export type TeacherPageId =
  | 'PAGE_01_DASHBOARD'
  | 'PAGE_02_STUDENTS'
  | 'PAGE_03_PROGRESS'
  | 'PAGE_04_ASSESSMENT'
  | 'PAGE_05_EVIDENCE'
  | 'PAGE_06_AI_USAGE'
  | 'PAGE_07_RESEARCH_EXPORT'
  | 'PAGE_08_QA_SUITE'
  | 'PAGE_09_SETTINGS_SPEC';

interface TeacherNavigationProps {
  currentPage: TeacherPageId;
  onSelectPage: (page: TeacherPageId) => void;
  stats?: {
    studentCount: number;
    evidenceCount: number;
    aiLogCount: number;
    assessmentCount: number;
  };
}

export const TEACHER_PAGES: {
  id: TeacherPageId;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'studentCount' | 'evidenceCount' | 'aiLogCount' | 'assessmentCount';
}[] = [
  {
    id: 'PAGE_01_DASHBOARD',
    number: '01',
    title: 'Dashboard',
    subtitle: 'สรุปภาพรวมชั้นเรียน',
    icon: LayoutDashboard
  },
  {
    id: 'PAGE_02_STUDENTS',
    number: '02',
    title: 'Student Management',
    subtitle: 'จัดการบัญชีนักเรียน & รีเซ็ตรหัส',
    icon: Users,
    badgeKey: 'studentCount'
  },
  {
    id: 'PAGE_03_PROGRESS',
    number: '03',
    title: 'Learning Progress',
    subtitle: 'ความก้าวหน้าตามลำดับภารกิจ',
    icon: TrendingUp
  },
  {
    id: 'PAGE_04_ASSESSMENT',
    number: '04',
    title: 'Assessment',
    subtitle: 'ผลการประเมิน Pre/Post & 20 ตัวชี้วัด',
    icon: FileCheck2,
    badgeKey: 'assessmentCount'
  },
  {
    id: 'PAGE_05_EVIDENCE',
    number: '05',
    title: 'Evidence',
    subtitle: 'คลังหลักฐานเชิงประจักษ์',
    icon: FolderArchive,
    badgeKey: 'evidenceCount'
  },
  {
    id: 'PAGE_06_AI_USAGE',
    number: '06',
    title: 'AI Helper / Usage',
    subtitle: 'ประวัติการใช้งานผู้ช่วย AI',
    icon: Bot,
    badgeKey: 'aiLogCount'
  },
  {
    id: 'PAGE_07_RESEARCH_EXPORT',
    number: '07',
    title: 'Research / Export',
    subtitle: 'ส่งออกข้อมูลวิจัยนิรนาม (No PII)',
    icon: DownloadCloud
  },
  {
    id: 'PAGE_08_QA_SUITE',
    number: '08',
    title: 'QA / Test Suite',
    subtitle: 'ตรวจสอบระบบ & ความสมบูรณ์ 10 ข้อ',
    icon: CheckCircle
  },
  {
    id: 'PAGE_09_SETTINGS_SPEC',
    number: '09',
    title: 'Settings & Identity Mapping',
    subtitle: 'ข้อมูลระบุตัวตนฝั่งครู & สเปกระบบ',
    icon: Settings
  }
];

export const TeacherNavigation: React.FC<TeacherNavigationProps> = ({
  currentPage,
  onSelectPage,
  stats
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg">
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        {TEACHER_PAGES.map((page) => {
          const Icon = page.icon;
          const isActive = currentPage === page.id;
          const badgeValue = page.badgeKey && stats ? stats[page.badgeKey] : undefined;

          return (
            <button
              key={page.id}
              onClick={() => onSelectPage(page.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/50'
                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-amber-300'
              }`}
              title={`${page.title} — ${page.subtitle}`}
            >
              <div className="flex items-center space-x-1.5">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {page.number}
                </span>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{page.title}</span>
              </div>

              {typeof badgeValue === 'number' && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400 border border-amber-500/30'
                }`}>
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
