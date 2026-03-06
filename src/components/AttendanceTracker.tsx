"use client";

import { useState, useCallback, useEffect } from "react";
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

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

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

function getStatusColor(pct: number): string {
  if (pct >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 75) return "text-blue-600 dark:text-blue-400";
  return "text-rose-600 dark:text-rose-400";
}

function getProgressColor(pct: number): string {
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 75) return "bg-blue-500";
  return "bg-rose-500";
}

function getCardAccent(pct: number) {
  if (pct >= 85)
    return {
      icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      border: "border-l-emerald-500",
    };
  if (pct >= 75)
    return {
      icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      border: "border-l-blue-500",
    };
  return {
    icon: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    border: "border-l-rose-500",
  };
}

interface SubjectCardProps {
  subject: Subject;
  onUpdate: (
    id: string,
    field: "name" | "totalClasses" | "attendedClasses",
    value: string | number
  ) => void;
  onDelete: (id: string) => void;
  onIncrement: (
    id: string,
    field: "totalClasses" | "attendedClasses",
    delta: number
  ) => void;
}

function SubjectCard({
  subject,
  onUpdate,
  onDelete,
  onIncrement,
}: SubjectCardProps) {
  const pct = calcPercentage(subject.attendedClasses, subject.totalClasses);
  const isSafe = pct >= REQUIRED_PERCENTAGE;
  const toAttend = classesToAttend(subject.attendedClasses, subject.totalClasses);
  const canSkip = classesCanSkip(subject.attendedClasses, subject.totalClasses);
  const accent = getCardAccent(pct);

  return (
    <div
      className={`group relative rounded-xl border-l-4 ${accent.border} border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}
        >
          <BookOpen className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            value={subject.name}
            onChange={(e) => onUpdate(subject.id, "name", e.target.value)}
            className="h-8 border-0 bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Subject name"
          />
        </div>
        <button
          onClick={() => onDelete(subject.id)}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
          aria-label="Delete subject"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Attendance counters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3">
          <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block font-medium">
            Attended
          </Label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onIncrement(subject.id, "attendedClasses", -1)}
              disabled={subject.attendedClasses <= 0}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={0}
              max={subject.totalClasses}
              value={subject.attendedClasses}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 0;
                onUpdate(
                  subject.id,
                  "attendedClasses",
                  Math.min(v, subject.totalClasses)
                );
              }}
              className="w-12 text-center text-lg font-bold bg-transparent outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-800 dark:text-slate-100"
            />
            <button
              onClick={() => onIncrement(subject.id, "attendedClasses", 1)}
              disabled={subject.attendedClasses >= subject.totalClasses}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3">
          <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block font-medium">
            Total
          </Label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onIncrement(subject.id, "totalClasses", -1)}
              disabled={
                subject.totalClasses <= subject.attendedClasses ||
                subject.totalClasses <= 0
              }
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={0}
              value={subject.totalClasses}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 0;
                onUpdate(
                  subject.id,
                  "totalClasses",
                  Math.max(v, subject.attendedClasses)
                );
              }}
              className="w-12 text-center text-lg font-bold bg-transparent outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-800 dark:text-slate-100"
            />
            <button
              onClick={() => onIncrement(subject.id, "totalClasses", 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Attendance
          </span>
          <span className={`text-sm font-bold ${getStatusColor(pct)}`}>
            {subject.totalClasses === 0 ? "—" : `${pct}%`}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
            style={{
              width:
                subject.totalClasses === 0 ? "0%" : `${Math.min(pct, 100)}%`,
            }}
          />
        </div>
        <div className="relative mt-1">
          <div
            className="absolute -top-3.5 w-px h-2 bg-slate-400/50 dark:bg-slate-500/50"
            style={{ left: "75%" }}
          />
          <span
            className="absolute text-[10px] text-slate-400 dark:text-slate-500 -translate-x-1/2"
            style={{ left: "75%" }}
          >
            75%
          </span>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-5">
        <Separator className="mb-3 bg-slate-100 dark:bg-slate-700" />
        {subject.totalClasses === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-1">
            Add classes to see insights
          </p>
        ) : isSafe ? (
          <div className="flex items-center gap-2">
            {canSkip > 0 ? (
              <>
                <TrendingDown className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  You can skip{" "}
                  <span className="font-semibold">{canSkip}</span> more{" "}
                  {canSkip === 1 ? "class" : "classes"} and still be safe.
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Attendance is safe. Don&apos;t skip any more classes!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <p className="text-xs text-rose-600 dark:text-rose-400">
              Attend <span className="font-semibold">{toAttend}</span>{" "}
              consecutive {toAttend === 1 ? "class" : "classes"} to reach 75%.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OverallSummary({ subjects }: { subjects: Subject[] }) {
  const total = subjects.reduce((s, sub) => s + sub.totalClasses, 0);
  const attended = subjects.reduce((s, sub) => s + sub.attendedClasses, 0);
  const overallPct = calcPercentage(attended, total);
  const safe = subjects.filter(
    (s) => calcPercentage(s.attendedClasses, s.totalClasses) >= 75
  ).length;
  const atRisk = subjects.length - safe;

  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-950/40 dark:to-slate-800/60 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <GraduationCap className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Overall Summary
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Subjects"
          value={String(subjects.length)}
          valueClass="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          label="Overall"
          value={total === 0 ? "—" : `${overallPct}%`}
          valueClass={getStatusColor(overallPct)}
        />
        <StatCard
          label="Safe"
          value={String(safe)}
          valueClass="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="At Risk"
          value={String(atRisk)}
          valueClass={atRisk > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400"}
        />
      </div>

      {total > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>
              {attended} / {total} classes attended
            </span>
            <span className={`font-semibold ${getStatusColor(overallPct)}`}>
              {overallPct}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/70 dark:bg-slate-700/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getProgressColor(overallPct)}`}
              style={{ width: `${Math.min(overallPct, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 p-3 text-center">
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
        {label}
      </p>
    </div>
  );
}

const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: generateId(),
    name: "Mathematics",
    totalClasses: 40,
    attendedClasses: 32,
  },
  { id: generateId(), name: "Physics", totalClasses: 35, attendedClasses: 22 },
  {
    id: generateId(),
    name: "Chemistry",
    totalClasses: 30,
    attendedClasses: 28,
  },
];

export function AttendanceTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [dark, setDark] = useState(false);

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  const addSubject = useCallback(() => {
    const name = newSubjectName.trim() || `Subject ${subjects.length + 1}`;
    setSubjects((prev) => [
      ...prev,
      { id: generateId(), name, totalClasses: 0, attendedClasses: 0 },
    ]);
    setNewSubjectName("");
  }, [newSubjectName, subjects.length]);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSubject = useCallback(
    (
      id: string,
      field: "name" | "totalClasses" | "attendedClasses",
      value: string | number
    ) => {
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (field === "name") return { ...s, name: value as string };
          const num =
            typeof value === "number" ? value : parseInt(value as string) || 0;
          if (field === "totalClasses") {
            return { ...s, totalClasses: Math.max(num, s.attendedClasses) };
          }
          if (field === "attendedClasses") {
            return {
              ...s,
              attendedClasses: Math.min(Math.max(num, 0), s.totalClasses),
            };
          }
          return s;
        })
      );
    },
    []
  );

  const incrementField = useCallback(
    (
      id: string,
      field: "totalClasses" | "attendedClasses",
      delta: number
    ) => {
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (field === "attendedClasses") {
            const next = Math.max(
              0,
              Math.min(s.attendedClasses + delta, s.totalClasses)
            );
            return { ...s, attendedClasses: next };
          }
          if (field === "totalClasses") {
            const next = Math.max(s.attendedClasses, s.totalClasses + delta);
            return { ...s, totalClasses: next };
          }
          return s;
        })
      );
    },
    []
  );

  const resetAll = useCallback(() => {
    setSubjects((prev) =>
      prev.map((s) => ({ ...s, attendedClasses: 0, totalClasses: 0 }))
    );
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-sm">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold leading-none text-slate-800 dark:text-slate-100 tracking-tight">
                  Smart Attendance Tracker
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track &amp; calculate your attendance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <Info className="h-3 w-3" />
                    75% Required
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Minimum attendance required by most institutions
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={resetAll}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset all counts to zero</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={() => setDark((d) => !d)}
                  >
                    {dark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dark ? "Switch to light mode" : "Switch to dark mode"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
          {/* Overall Summary */}
          {subjects.length > 0 && <OverallSummary subjects={subjects} />}

          {/* Add Subject */}
          <div className="flex gap-2">
            <Input
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Enter subject name (e.g. Mathematics)"
              className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              onKeyDown={(e) => e.key === "Enter" && addSubject()}
            />
            <Button
              onClick={addSubject}
              className="gap-1.5 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add Subject
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Safe ≥ 85%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Minimum 75–84%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              At Risk &lt; 75%
            </span>
          </div>

          {/* Subjects grid */}
          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-16 text-center">
              <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No subjects added yet
              </p>
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

          {/* Quick calculator */}
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

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          <TrendingUp className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Quick Calculator
        </h2>
        <Badge
          variant="secondary"
          className="text-xs ml-auto bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-0"
        >
          One-time check
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="qc-total"
            className="text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Total Classes
          </Label>
          <Input
            id="qc-total"
            type="number"
            min={0}
            value={total || ""}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 0;
              setTotal(v);
              if (attended > v) setAttended(v);
            }}
            placeholder="e.g. 50"
            className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="qc-attended"
            className="text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Classes Attended
          </Label>
          <Input
            id="qc-attended"
            type="number"
            min={0}
            max={total}
            value={attended || ""}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 0;
              setAttended(Math.min(v, total));
            }}
            placeholder="e.g. 40"
            className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          />
        </div>
      </div>

      {total > 0 && (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Attendance Percentage
            </span>
            <span className={`text-2xl font-bold ${getStatusColor(pct)}`}>
              {pct}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <Separator className="bg-slate-200 dark:bg-slate-600" />
          {isSafe ? (
            canSkip > 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You can skip <strong>{canSkip}</strong> more{" "}
                {canSkip === 1 ? "class" : "classes"} and remain above 75%.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Attendance is exactly at the safe line. Don&apos;t miss any more!
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Attend <strong>{toAttend}</strong> consecutive{" "}
              {toAttend === 1 ? "class" : "classes"} to reach 75%.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
