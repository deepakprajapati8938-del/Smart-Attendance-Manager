"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  PlusCircle,
  Trash2,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Info,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
}

const REQUIRED_PERCENTAGE = 75;

let _idCounter = 0;
function generateId() {
  return `sub-${++_idCounter}`;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub-1", name: "Mathematics", totalClasses: 40, attendedClasses: 32 },
  { id: "sub-2", name: "Physics", totalClasses: 35, attendedClasses: 22 },
  { id: "sub-3", name: "Chemistry", totalClasses: 30, attendedClasses: 28 },
];

function calcPercentage(attended: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((attended / total) * 1000) / 10;
}

function classesToAttend(attended: number, total: number): number {
  const needed = Math.ceil((0.75 * total - attended) / 0.25);
  return needed > 0 ? needed : 0;
}

function classesCanSkip(attended: number, total: number): number {
  const canSkip = Math.floor(attended / 0.75 - total);
  return canSkip > 0 ? canSkip : 0;
}

type StatusLevel = "safe" | "minimum" | "risk";

function getStatus(pct: number): StatusLevel {
  if (pct >= 85) return "safe";
  if (pct >= 75) return "minimum";
  return "risk";
}

const statusConfig = {
  safe: {
    textClass: "text-emerald-600 dark:text-emerald-400",
    progressClass: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    progressGlow: "progress-glow-emerald",
    glowClass: "glow-emerald",
    iconBg: "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-l-emerald-400 dark:border-l-emerald-500",
    insightBg: "bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-100/80 dark:border-emerald-800/30",
    insightText: "text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-700/40",
  },
  minimum: {
    textClass: "text-violet-600 dark:text-violet-400",
    progressClass: "bg-gradient-to-r from-violet-400 to-violet-500",
    progressGlow: "progress-glow-blue",
    glowClass: "glow-blue",
    iconBg: "bg-violet-100/80 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    borderAccent: "border-l-violet-400 dark:border-l-violet-500",
    insightBg: "bg-violet-50/60 dark:bg-violet-900/20 border border-violet-100/80 dark:border-violet-800/30",
    insightText: "text-violet-700 dark:text-violet-300",
    badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200/60 dark:border-violet-700/40",
  },
  risk: {
    textClass: "text-rose-600 dark:text-rose-400",
    progressClass: "bg-gradient-to-r from-rose-400 to-rose-500",
    progressGlow: "progress-glow-rose",
    glowClass: "glow-rose",
    iconBg: "bg-rose-100/80 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    borderAccent: "border-l-rose-400 dark:border-l-rose-500",
    insightBg: "bg-rose-50/60 dark:bg-rose-900/20 border border-rose-100/80 dark:border-rose-800/30",
    insightText: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-700/40",
  },
};

interface SubjectCardProps {
  subject: Subject;
  onUpdate: (id: string, field: "name" | "totalClasses" | "attendedClasses", value: string | number) => void;
  onDelete: (id: string) => void;
  onIncrement: (id: string, field: "totalClasses" | "attendedClasses", delta: number) => void;
}

function SubjectCard({ subject, onUpdate, onDelete, onIncrement }: SubjectCardProps) {
  const pct = calcPercentage(subject.attendedClasses, subject.totalClasses);
  const status = getStatus(pct);
  const isSafe = pct >= REQUIRED_PERCENTAGE;
  const toAttend = classesToAttend(subject.attendedClasses, subject.totalClasses);
  const canSkip = classesCanSkip(subject.attendedClasses, subject.totalClasses);
  const cfg = statusConfig[status];

  return (
    <div
      className={`group relative rounded-2xl border-l-4 ${cfg.borderAccent} glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden`}
    >
      {/* Top glow strip */}
      <div className={`absolute inset-x-0 top-0 h-px ${cfg.progressClass} opacity-60`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg} ${status !== "risk" ? "" : ""}`}>
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={subject.name}
              onChange={(e) => onUpdate(subject.id, "name", e.target.value)}
              className="h-8 border-0 bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
              placeholder="Subject name"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {subject.totalClasses === 0 ? "—" : `${pct}%`}
            </span>
            <button
              onClick={() => onDelete(subject.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
              aria-label="Delete subject"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Attendance counters */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {(["attendedClasses", "totalClasses"] as const).map((field) => {
            const label = field === "attendedClasses" ? "Attended" : "Total";
            const value = subject[field];
            const isDisabledDown =
              field === "attendedClasses"
                ? value <= 0
                : value <= subject.attendedClasses || value <= 0;
            const isDisabledUp = field === "attendedClasses" ? value >= subject.totalClasses : false;
            return (
              <div key={field} className="rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/8 p-3 backdrop-blur-sm">
                <Label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
                  {label}
                </Label>
                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => onIncrement(subject.id, field, -1)}
                    disabled={isDisabledDown}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-300"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      onUpdate(subject.id, field, field === "attendedClasses" ? Math.min(v, subject.totalClasses) : Math.max(v, subject.attendedClasses));
                    }}
                    className="w-10 text-center text-xl font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-800 dark:text-slate-100"
                  />
                  <button
                    onClick={() => onIncrement(subject.id, field, 1)}
                    disabled={isDisabledUp}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-300"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2.5 w-full rounded-full bg-slate-100/80 dark:bg-white/8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${cfg.progressClass} ${cfg.progressGlow}`}
              style={{ width: subject.totalClasses === 0 ? "0%" : `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="relative h-4 mt-0.5">
            <div className="absolute w-px h-2.5 bg-slate-400/40 dark:bg-slate-500/40" style={{ left: "75%" }} />
            <span className="absolute text-[10px] text-slate-400 dark:text-slate-500 -translate-x-1/2 top-2.5" style={{ left: "75%" }}>75%</span>
          </div>
        </div>

        {/* Insight */}
        {subject.totalClasses === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2 italic">
            Add classes to see insights
          </p>
        ) : (
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${cfg.insightBg}`}>
            {isSafe ? (
              canSkip > 0 ? (
                <>
                  <TrendingDown className={`h-3.5 w-3.5 shrink-0 ${cfg.insightText}`} />
                  <p className={`text-xs ${cfg.insightText}`}>
                    Skip up to <span className="font-bold">{canSkip}</span> {canSkip === 1 ? "class" : "classes"} and stay safe.
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${cfg.insightText}`} />
                  <p className={`text-xs ${cfg.insightText}`}>
                    You&apos;re safe — but don&apos;t miss any more!
                  </p>
                </>
              )
            ) : (
              <>
                <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${cfg.insightText}`} />
                <p className={`text-xs ${cfg.insightText}`}>
                  Attend <span className="font-bold">{toAttend}</span> consecutive {toAttend === 1 ? "class" : "classes"} to reach 75%.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, valueClass, sub }: { label: string; value: string; valueClass: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/8 p-4 text-center backdrop-blur-sm">
      <p className={`text-2xl font-bold tracking-tight ${valueClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function OverallSummary({ subjects }: { subjects: Subject[] }) {
  const total = subjects.reduce((s, sub) => s + sub.totalClasses, 0);
  const attended = subjects.reduce((s, sub) => s + sub.attendedClasses, 0);
  const overallPct = calcPercentage(attended, total);
  const safe = subjects.filter((s) => calcPercentage(s.attendedClasses, s.totalClasses) >= 75).length;
  const atRisk = subjects.filter((s) => calcPercentage(s.attendedClasses, s.totalClasses) < 75 && s.totalClasses > 0).length;
  const status = getStatus(overallPct);
  const cfg = statusConfig[status];

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card glow-indigo">
      {/* Decorative glow blob */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-violet-400/15 dark:bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm glow-indigo">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Overall Summary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{subjects.length} {subjects.length === 1 ? "subject" : "subjects"} tracked</p>
          </div>
          {total > 0 && (
            <div className="ml-auto">
              <span className={`text-3xl font-black tracking-tight ${cfg.textClass}`}>{overallPct}%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Subjects" value={String(subjects.length)} valueClass="text-indigo-600 dark:text-indigo-400" />
          <StatCard label="Safe" value={String(safe)} valueClass="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="At Risk" value={String(atRisk)} valueClass={atRisk > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"} />
        </div>

        {total > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>{attended} of {total} classes attended</span>
              <span className="font-semibold">{overallPct}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/50 dark:bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${cfg.progressClass} ${cfg.progressGlow}`}
                style={{ width: `${Math.min(overallPct, 100)}%` }}
              />
            </div>
            <div className="relative h-4 mt-0.5">
              <div className="absolute w-px h-3 bg-slate-400/40 dark:bg-slate-400/30" style={{ left: "75%" }} />
              <span className="absolute text-[10px] text-slate-400 dark:text-slate-500 -translate-x-1/2 top-3" style={{ left: "75%" }}>75%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AttendanceTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [newSubjectName, setNewSubjectName] = useState("");
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const addSubject = useCallback(() => {
    const name = newSubjectName.trim() || `Subject ${subjects.length + 1}`;
    setSubjects((prev) => [...prev, { id: generateId(), name, totalClasses: 0, attendedClasses: 0 }]);
    setNewSubjectName("");
  }, [newSubjectName, subjects.length]);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSubject = useCallback(
    (id: string, field: "name" | "totalClasses" | "attendedClasses", value: string | number) => {
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (field === "name") return { ...s, name: value as string };
          const num = typeof value === "number" ? value : parseInt(value as string) || 0;
          if (field === "totalClasses") return { ...s, totalClasses: Math.max(num, s.attendedClasses) };
          if (field === "attendedClasses") return { ...s, attendedClasses: Math.min(Math.max(num, 0), s.totalClasses) };
          return s;
        })
      );
    },
    []
  );

  const incrementField = useCallback(
    (id: string, field: "totalClasses" | "attendedClasses", delta: number) => {
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (field === "attendedClasses") {
            return { ...s, attendedClasses: Math.max(0, Math.min(s.attendedClasses + delta, s.totalClasses)) };
          }
          if (field === "totalClasses") {
            return { ...s, totalClasses: Math.max(s.attendedClasses, s.totalClasses + delta) };
          }
          return s;
        })
      );
    },
    []
  );

  const resetAll = useCallback(() => {
    setSubjects((prev) => prev.map((s) => ({ ...s, attendedClasses: 0, totalClasses: 0 })));
  }, []);

  return (
    <TooltipProvider>
      <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-mesh-dark" : "bg-mesh-light"}`}>

        {/* Header */}
        <header className={`sticky top-0 z-20 ${isDark ? "bg-[rgba(8,8,24,0.75)]" : "bg-white/70"} backdrop-blur-xl border-b ${isDark ? "border-white/8" : "border-white/60"} shadow-sm`}>
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md glow-indigo">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                    Smart Attendance Tracker
                  </h1>
                  <Sparkles className="h-3 w-3 text-violet-500" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track &amp; calculate your attendance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-200/60 dark:border-indigo-700/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 cursor-default">
                    <Info className="h-3 w-3" />
                    75% Required
                  </div>
                </TooltipTrigger>
                <TooltipContent>Minimum attendance required by most institutions</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/8"
                    onClick={resetAll}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset all counts to zero</TooltipContent>
              </Tooltip>

              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`relative flex h-9 w-16 items-center rounded-full border transition-all duration-300 ${
                  isDark
                    ? "bg-indigo-900/60 border-indigo-700/50"
                    : "bg-slate-100 border-slate-200/80"
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`absolute flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                    isDark
                      ? "translate-x-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                      : "translate-x-1 bg-white text-slate-600"
                  }`}
                >
                  {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {/* Overall Summary */}
          {subjects.length > 0 && <OverallSummary subjects={subjects} />}

          {/* Add Subject */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name (e.g. Mathematics)"
                className="h-11 rounded-xl bg-white/60 dark:bg-white/5 border-white/70 dark:border-white/10 backdrop-blur-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 pr-4 shadow-sm focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
              />
            </div>
            <Button
              onClick={addSubject}
              className="h-11 gap-2 shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md glow-indigo border-0 transition-all duration-200 hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              Add Subject
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-sm" style={{ boxShadow: "0 0 5px rgba(16,185,129,0.6)" }} />
              Safe ≥ 85%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-violet-500" style={{ boxShadow: "0 0 5px rgba(139,92,246,0.6)" }} />
              Minimum 75–84%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" style={{ boxShadow: "0 0 5px rgba(244,63,94,0.6)" }} />
              At Risk &lt; 75%
            </span>
          </div>

          {/* Subjects grid */}
          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl glass-card py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 mb-4">
                <BookOpen className="h-7 w-7 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No subjects added yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Type a subject name above and click &ldquo;Add Subject&rdquo;
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onUpdate={updateSubject}
                  onDelete={deleteSubject}
                  onIncrement={incrementField}
                />
              ))}
            </div>
          )}

          {/* Quick Calculator */}
          <QuickCalculator />
        </main>
      </div>
    </TooltipProvider>
  );
}

function QuickCalculator() {
  const [total, setTotal] = useState(0);
  const [attended, setAttended] = useState(0);

  const pct = calcPercentage(attended, total);
  const toAttend = classesToAttend(attended, total);
  const canSkip = classesCanSkip(attended, total);
  const isSafe = pct >= 75;
  const status = getStatus(pct);
  const cfg = statusConfig[status];

  return (
    <div className="relative rounded-2xl glass-card overflow-hidden">
      <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-slate-400/10 dark:bg-slate-600/10 blur-2xl pointer-events-none" />
      <div className="relative p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-white/8 text-slate-600 dark:text-slate-300">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">Quick Calculator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">One-time scenario check</p>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs bg-slate-100/80 dark:bg-white/8 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-white/10 rounded-full">
            No save
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { id: "qc-total", label: "Total Classes", value: total, setter: (v: number) => { setTotal(v); if (attended > v) setAttended(v); } },
            { id: "qc-attended", label: "Classes Attended", value: attended, setter: (v: number) => setAttended(Math.min(v, total)) },
          ].map(({ id, label, value, setter }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {label}
              </Label>
              <Input
                id={id}
                type="number"
                min={0}
                value={value || ""}
                onChange={(e) => setter(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="rounded-xl bg-white/50 dark:bg-white/5 border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
          ))}
        </div>

        {total > 0 && (
          <div className={`rounded-xl ${cfg.insightBg} p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Attendance</span>
              <span className={`text-2xl font-black tracking-tight ${cfg.textClass}`}>{pct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/60 dark:bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${cfg.progressClass} ${cfg.progressGlow}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <Separator className="bg-white/40 dark:bg-white/8" />
            <div className="flex items-center gap-2">
              {isSafe ? (
                canSkip > 0 ? (
                  <>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${cfg.insightText}`} />
                    <span className={`text-sm ${cfg.insightText}`}>
                      You can skip <strong>{canSkip}</strong> more {canSkip === 1 ? "class" : "classes"} and remain above 75%.
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${cfg.insightText}`} />
                    <span className={`text-sm ${cfg.insightText}`}>
                      Exactly at the limit — don&apos;t miss any more!
                    </span>
                  </>
                )
              ) : (
                <>
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${cfg.insightText}`} />
                  <span className={`text-sm ${cfg.insightText}`}>
                    Attend <strong>{toAttend}</strong> consecutive {toAttend === 1 ? "class" : "classes"} to reach 75%.
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
