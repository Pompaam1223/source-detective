import React, { useState, useEffect } from 'react';
import {
  GoogleSheetsService,
  SpreadsheetInfo,
  SyncResult
} from '../services/googleSheetsService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { subscribeAuth } from '../services/googleAuth';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Database,
  Search,
  ChevronDown,
  Layers,
  Sparkles,
  Table,
  Check
} from 'lucide-react';
import { PushPin } from './decorations/DetectiveDecorations';

interface GoogleSheetsSyncCardProps {
  onDataSynced?: () => void;
  className?: string;
}

export const GoogleSheetsSyncCard: React.FC<GoogleSheetsSyncCardProps> = ({
  onDataSynced,
  className = ''
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connectedSheet, setConnectedSheet] = useState<SpreadsheetInfo | null>(
    GoogleSheetsService.getConnectedSpreadsheet()
  );

  const [availableSheets, setAvailableSheets] = useState<SpreadsheetInfo[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [previewValues, setPreviewValues] = useState<any[][] | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'SUMMARY' | 'QUESTIONS' | 'SYSTEM' | 'AI'>('SUMMARY');

  useEffect(() => {
    const unsub = subscribeAuth((user, token) => {
      setCurrentUser(user);
      setAccessToken(token);
      if (user && token) {
        loadSpreadsheets();
      } else {
        setAvailableSheets([]);
      }
    });
    return () => unsub();
  }, []);

  const loadSpreadsheets = async () => {
    setIsLoadingSheets(true);
    setErrorMessage(null);
    try {
      const sheets = await GoogleSheetsService.listSpreadsheets();
      setAvailableSheets(sheets);
      // If no active sheet is set but there's a matching one, set it
      if (!connectedSheet && sheets.length > 0) {
        const detectiveSheet = sheets.find(s => s.name.includes('Source Detective') || s.name.includes('นักสืบ'));
        if (detectiveSheet) {
          handleSelectSheet(detectiveSheet);
        }
      }
    } catch (e: any) {
      console.error('Failed to load spreadsheets:', e);
      // Non-fatal, user might not have granted drive list scope or no files
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!accessToken) {
      alert('กรุณาลงชื่อเข้าใช้ Google ก่อนสร้างตาราง');
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);
    try {
      const newSheet = await GoogleSheetsService.createDetectiveSpreadsheet();
      setConnectedSheet(newSheet);
      setAvailableSheets(prev => [newSheet, ...prev]);
      setShowPicker(false);
      // Auto sync right after creation
      await handleSync(newSheet.id);
    } catch (e: any) {
      console.error('Failed to create sheet:', e);
      setErrorMessage(e.message || 'ไม่สามารถสร้าง Google Sheet ได้');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectSheet = (sheet: SpreadsheetInfo) => {
    setConnectedSheet(sheet);
    GoogleSheetsService.setConnectedSpreadsheet(sheet);
    setShowPicker(false);
  };

  const handleSync = async (sheetIdToUse?: string) => {
    const targetId = sheetIdToUse || connectedSheet?.id;
    if (!targetId) {
      alert('กรุณาสร้างหรือเลือก Google Sheet ที่ต้องการบันทึกข้อมูลก่อน');
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const result = await GoogleSheetsService.syncAllData(targetId);
      setSyncStatus(result);
      if (onDataSynced) onDataSynced();
      // Also refresh preview
      fetchPreview(targetId, activePreviewTab);
    } catch (e: any) {
      console.error('Failed to sync to Google Sheets:', e);
      setErrorMessage(e.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Google Sheets');
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchPreview = async (sheetId: string, tab: 'SUMMARY' | 'QUESTIONS' | 'SYSTEM' | 'AI') => {
    setIsLoadingPreview(true);
    let tabName = 'สรุปคะแนนนักเรียน';
    if (tab === 'QUESTIONS') tabName = 'บันทึกการตอบรายข้อ';
    else if (tab === 'SYSTEM') tabName = 'ประวัติการใช้งานระบบ';
    else if (tab === 'AI') tabName = 'บันทึกการใช้ AI';

    try {
      const values = await GoogleSheetsService.readSheetValues(sheetId, tabName);
      setPreviewValues(values);
    } catch (e) {
      console.error('Failed to read sheet preview:', e);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleTabChange = (tab: 'SUMMARY' | 'QUESTIONS' | 'SYSTEM' | 'AI') => {
    setActivePreviewTab(tab);
    if (connectedSheet) {
      fetchPreview(connectedSheet.id, tab);
    }
  };

  return (
    <div className={`relative bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-3 border-emerald-500/50 rounded-3xl p-6 shadow-2xl space-y-6 ${className}`}>
      <PushPin color="blue" className="absolute -top-3.5 left-8" />

      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5 pt-1">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-black uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-md">
                ★ GOOGLE SHEETS INTEGRATION
              </span>
              <span className="text-xs text-emerald-400 font-bold font-mono">
                ระบบบันทึกคะแนน & Log
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-100 mt-0.5">
              เชื่อมต่อ Google Sheets สำหรับคุณครู
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              บันทึกคะแนนนักเรียนทุกส่วน (Pre-test, 4 Missions, Post-test) และ Timestamp ตรวจย้อนหลังได้ตลอดเวลา
            </p>
          </div>
        </div>

        {/* Google Auth Button */}
        <GoogleSignInButton
          onAuthChange={(user, token) => {
            setCurrentUser(user);
            setAccessToken(token);
          }}
        />
      </div>

      {/* Main Connection Controls */}
      {currentUser && accessToken ? (
        <div className="space-y-5">
          
          {/* Active Sheet Card */}
          <div className="bg-slate-950/80 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-inner">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    ตาราง Google Sheets ที่เชื่อมต่ออยู่:
                  </span>
                  {connectedSheet && (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded border border-emerald-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                {connectedSheet ? (
                  <div className="mt-1">
                    <h4 className="text-base font-bold text-emerald-300 hover:underline flex items-center gap-1.5">
                      <a href={connectedSheet.url} target="_blank" rel="noopener noreferrer">
                        {connectedSheet.name}
                      </a>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ID: {connectedSheet.id}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    ⚠️ ยังไม่ได้เลือกหรือสร้าง Google Sheet
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Sync Now Button */}
              {connectedSheet && (
                <button
                  onClick={() => handleSync()}
                  disabled={isSyncing}
                  className="btn-game-green text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'กำลังบันทึกลง Sheets...' : 'บันทึก & ซิงค์คะแนนทันที (Sync Now)'}</span>
                </button>
              )}

              {/* Create New Sheet Button */}
              <button
                onClick={handleCreateNewSheet}
                disabled={isCreating}
                className="bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-100 border border-emerald-400/50 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>{isCreating ? 'กำลังสร้างตาราง...' : 'สร้างตารางใหม่ (Create Sheet)'}</span>
              </button>

              {/* Select Existing Sheet */}
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>เลือกจาก Google Drive</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Open in new tab */}
              {connectedSheet && (
                <a
                  href={connectedSheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>เปิดดูใน Google</span>
                </a>
              )}

            </div>
          </div>

          {/* Existing Sheets Selector Dropdown */}
          {showPicker && (
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-mono">
                  เลือก Google Sheets ใน Google Drive ของคุณ:
                </span>
                <button
                  onClick={loadSpreadsheets}
                  disabled={isLoadingSheets}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                  รีเฟรชรายการ
                </button>
              </div>

              {isLoadingSheets ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  กำลังค้นหาไฟล์ Spreadsheet ใน Google Drive...
                </div>
              ) : availableSheets.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  ไม่พบตาราง Spreadsheet ในบัญชี กดปุ่ม <strong>"สร้างตารางใหม่"</strong> ด้านบนเพื่อเริ่มต้น
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {availableSheets.map(s => {
                    const isSelected = connectedSheet?.id === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSheet(s)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{s.name}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono shrink-0 ml-2">
                            <Check className="w-3.5 h-3.5" /> เลือกอยู่
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Sync Success Feedback Notice */}
          {syncStatus && (
            <div className="bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl p-4 text-emerald-200 text-xs flex items-start space-x-3 shadow-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-300 text-sm">
                  {syncStatus.message}
                </p>
                <div className="flex flex-wrap gap-3 font-mono text-[11px] text-emerald-300/80">
                  <span>สรุปข้อมูลนักเรียน: <strong>{syncStatus.summaryCount} คน</strong></span>
                  <span>•</span>
                  <span>บันทึกการตอบ: <strong>{syncStatus.attemptsCount} ข้อ</strong></span>
                  <span>•</span>
                  <span>บันทึกการใช้ AI: <strong>{syncStatus.aiLogsCount} รายการ</strong></span>
                  <span>•</span>
                  <span>เวลาบันทึก: <strong>{syncStatus.timestamp}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-950/80 border-2 border-rose-500/60 rounded-2xl p-4 text-rose-200 text-xs flex items-center space-x-2.5 shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Retrospective Google Sheets Data Viewer Inside App */}
          {connectedSheet && (
            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-200 font-mono">
                    ตัวอย่างข้อมูลใน Google Sheets (ตรวจคะแนนย้อนหลัง)
                  </h4>
                </div>

                {/* Sub Tab Switchers */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold font-mono">
                  <button
                    onClick={() => handleTabChange('SUMMARY')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activePreviewTab === 'SUMMARY'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1. สรุปคะแนน
                  </button>
                  <button
                    onClick={() => handleTabChange('QUESTIONS')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activePreviewTab === 'QUESTIONS'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    2. ตอบรายข้อ
                  </button>
                  <button
                    onClick={() => handleTabChange('SYSTEM')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activePreviewTab === 'SYSTEM'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    3. บันทึกระบบ
                  </button>
                  <button
                    onClick={() => handleTabChange('AI')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activePreviewTab === 'AI'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    4. บันทึก AI
                  </button>
                </div>
              </div>

              {/* Data Table */}
              {isLoadingPreview ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono flex items-center justify-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>กำลังดึงข้อมูลล่าสุดจาก Google Sheets...</span>
                </div>
              ) : !previewValues || previewValues.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  กดปุ่ม <strong>"บันทึก & ซิงค์คะแนนทันที"</strong> เพื่อเริ่มเขียนและแสดงข้อมูล
                </div>
              ) : (
                <div className="overflow-x-auto max-h-64 border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-[11px] font-mono border-collapse">
                    <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-emerald-300">
                      <tr>
                        {previewValues[0]?.map((headerCell: any, hIdx: number) => (
                          <th key={hIdx} className="py-2 px-3 whitespace-nowrap font-bold border-r border-slate-800">
                            {headerCell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300">
                      {previewValues.slice(1).map((row: any[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-900/60">
                          {row.map((cell: any, cIdx: number) => (
                            <td key={cIdx} className="py-1.5 px-3 whitespace-nowrap border-r border-slate-800/60">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        /* Unauthenticated Prompt */
        <div className="bg-slate-950/60 border-2 border-dashed border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm font-bold text-slate-300">
            คุณครูสามารถลงชื่อเข้าใช้ด้วย Google เพื่อเปิดใช้งานการเชื่อมต่อ Google Sheets
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            เมื่อเชื่อมต่อแล้ว ระบบจะสร้างและบันทึกคะแนนนักเรียน, เวลาทำกิจกรรม (Timestamp), คะแนนรายข้อ และประวัติการขอความช่วยเหลือจาก AI ไปยัง Google Sheets โดยอัตโนมัติ
          </p>
          <div className="pt-2 flex justify-center">
            <GoogleSignInButton
              onAuthChange={(user, token) => {
                setCurrentUser(user);
                setAccessToken(token);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
