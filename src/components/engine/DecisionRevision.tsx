import React, { useState } from 'react';
import { Question, ChoiceOption } from '../../types';
import { AnswerOption } from '../AnswerOption';
import { GitCompare, Sparkles, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

interface DecisionRevisionProps {
  question: Question;
  answers: Record<string, string>;
  onStepAnswerChange: (stepKey: string, optionId: string) => void;
}

export const DecisionRevision: React.FC<DecisionRevisionProps> = ({
  question,
  answers,
  onStepAnswerChange
}) => {
  const steps = question.multiStepQuestions || [];

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-900 border border-rose-500/30 rounded-2xl p-4 text-slate-200 text-xs sm:text-sm flex items-start space-x-3">
        <GitCompare className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-rose-300 text-sm">
            กิจกรรมสืบสวนขั้นสูง: การทบทวนและปรับเปลี่ยนมุมมอง (Decision Revision Process)
          </h4>
          <p className="text-slate-300 leading-relaxed">
            ตอบคำถามตามลำดับ 5 ขั้นตอน (A → B → C → D → E) เพื่อสะท้อนกระบวนการคิด การประเมินหลักฐานใหม่ และการปรับเปลี่ยนข้อสรุปอย่างมีเหตุผล
          </p>
        </div>
      </div>

      {/* 5-Step Render Loop */}
      <div className="space-y-5">
        {steps.map((step, idx) => {
          const selectedOptionId = answers[step.stepKey] || '';
          const stepLetter = String.fromCharCode(65 + idx); // A, B, C, D, E

          return (
            <div
              key={step.stepKey}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                selectedOptionId
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Step Header */}
              <div className="flex items-center space-x-2.5 mb-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center">
                  {stepLetter}
                </span>
                <h5 className="font-extrabold text-slate-100 text-sm">
                  {step.title}
                </h5>
              </div>

              {/* Step Prompt */}
              <p className="text-xs sm:text-sm text-slate-300 mb-3 pl-8 font-medium">
                {step.prompt}
              </p>

              {/* Options */}
              <div className="space-y-2 pl-8">
                {step.options.map(opt => (
                  <AnswerOption
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    selected={selectedOptionId === opt.id}
                    onSelect={(id) => onStepAnswerChange(step.stepKey, id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
