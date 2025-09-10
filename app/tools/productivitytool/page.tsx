"use client";

import React, { useEffect, useMemo, useReducer, useRef } from "react";

/* ---------------------------------- Types --------------------------------- */
type Mode = "work" | "short" | "long";
type Settings = {
  workMin: number;
  shortMin: number;
  longMin: number;
  cyclesUntilLong: number; // after N work sessions, take long break
  autoStartNext: boolean;
  soundOn: boolean;
  notificationsOn: boolean;
  tickSounds: boolean;
};
type Task = { id: string; title: string; done: boolean; sessions: number };
type SessionLog = { ts: number; mode: Mode; durationSec: number };
type State = {
  mode: Mode;
  // timer
  running: boolean;
  startedAt: number | null; // epoch ms when started
  endAt: number | null; // epoch ms when ends
  // progress
  completedCycles: number; // completed work sessions in current set
  // data
  tasks: Task[];
  activeTaskId: string | null;
  settings: Settings;
  logs: SessionLog[];
  // ui
  theme: "light" | "dark";
};

/* ------------------------------ Local Storage ----------------------------- */
const LS_KEY = "pomodoro_pro_v1";

function loadState(): Partial<State> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Partial<State>) : null;
  } catch {
    return null;
  }
}

function saveState(partial: Partial<State>) {
  try {
    const prev = loadState() || {};
    const next = { ...prev, ...partial };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {}
}

/* --------------------------------- Utils ---------------------------------- */
const pad = (n: number) => n.toString().padStart(2, "0");

function secondsToClock(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${pad(m)}:${pad(s)}`;
}

function uuid() {
  return Math.random().toString(36).slice(2, 10);
}

function startTimestamp(durationSec: number) {
  const now = Date.now();
  return { startedAt: now, endAt: now + durationSec * 1000 };
}

function todayKey(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function isSameDay(a: number, b: number) {
  return todayKey(a) === todayKey(b);
}

/* ------------------------------ Audio (beeps) ----------------------------- */
function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensure = () => {
    if (!ctxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      ctxRef.current = new Ctx();
    }
    return ctxRef.current!;
  };
  const beep = (freq = 880, durMs = 140, type: OscillatorType = "sine") => {
    const ctx = ensure();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + durMs / 1000);
    o.start(t);
    o.stop(t + durMs / 1000);
  };
  const chime = () => {
    // simple two-tone
    beep(880, 150, "sine");
    setTimeout(() => beep(1175, 180, "sine"), 170);
  };
  const tick = () => beep(440, 40, "square");
  return { beep, chime, tick };
}

/* ----------------------------- Notifications ----------------------------- */
async function requestNotifyPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const res = await Notification.requestPermission();
  return res === "granted";
}
function notify(title: string, body?: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") new Notification(title, { body });
}

/* --------------------------------- Reducer -------------------------------- */
type Action =
  | { type: "TIMER_START"; payload: { durationSec: number } }
  | { type: "TIMER_STOP" }
  | { type: "TIMER_TICK" }
  | { type: "SWITCH_MODE"; payload: { mode: Mode; durationSec: number; logged?: SessionLog } }
  | { type: "COMPLETE_WORK" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<Settings> }
  | { type: "ADD_TASK"; payload: { title: string } }
  | { type: "TOGGLE_TASK"; payload: { id: string } }
  | { type: "REMOVE_TASK"; payload: { id: string } }
  | { type: "SET_ACTIVE_TASK"; payload: { id: string | null } }
  | { type: "LOAD"; payload: Partial<State> }
  | { type: "TOGGLE_THEME" };

const initialSettings: Settings = {
  workMin: 25,
  shortMin: 5,
  longMin: 20,
  cyclesUntilLong: 4,
  autoStartNext: true,
  soundOn: true,
  notificationsOn: true,
  tickSounds: false,
};

const initialState: State = {
  mode: "work",
  running: false,
  startedAt: null,
  endAt: null,
  completedCycles: 0,
  tasks: [],
  activeTaskId: null,
  settings: initialSettings,
  logs: [],
  theme: "dark",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return { ...state, ...action.payload, settings: { ...state.settings, ...(action.payload.settings || {}) } };
    case "TIMER_START":
      return { ...state, running: true, startedAt: startTimestamp(action.payload.durationSec).startedAt, endAt: startTimestamp(action.payload.durationSec).endAt };
    case "TIMER_STOP":
      return { ...state, running: false, startedAt: null, endAt: null };
    case "SWITCH_MODE": {
      const { mode, durationSec, logged } = action.payload;
      const logs = logged ? [...state.logs, logged] : state.logs;
      return {
        ...state,
        mode,
        running: false,
        startedAt: null,
        endAt: null,
        logs,
      };
    }
    case "COMPLETE_WORK":
      return { ...state, completedCycles: state.completedCycles + 1 };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "ADD_TASK": {
      const t: Task = { id: uuid(), title: action.payload.title, done: false, sessions: 0 };
      return { ...state, tasks: [t, ...state.tasks], activeTaskId: state.activeTaskId ?? t.id };
    }
    case "TOGGLE_TASK": {
      const tasks = state.tasks.map((t) => (t.id === action.payload.id ? { ...t, done: !t.done } : t));
      return { ...state, tasks };
    }
    case "REMOVE_TASK": {
      const tasks = state.tasks.filter((t) => t.id !== action.payload.id);
      const activeTaskId = state.activeTaskId === action.payload.id ? (tasks[0]?.id ?? null) : state.activeTaskId;
      return { ...state, tasks, activeTaskId };
    }
    case "SET_ACTIVE_TASK":
      return { ...state, activeTaskId: action.payload.id };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    default:
      return state;
  }
}

/* ------------------------------- Main Page -------------------------------- */
export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { chime, tick } = useAudio();
  const rafRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(0);

  // Load persisted state
  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: "LOAD", payload: saved });
  }, []);

  // Persist key pieces
  useEffect(() => {
    saveState({
      settings: state.settings,
      tasks: state.tasks,
      logs: state.logs,
      theme: state.theme,
      activeTaskId: state.activeTaskId,
      completedCycles: state.completedCycles,
    });
  }, [state.settings, state.tasks, state.logs, state.theme, state.activeTaskId, state.completedCycles]);

  // Theme toggle on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [state.theme]);

  // Notification permission
  useEffect(() => {
    if (state.settings.notificationsOn) requestNotifyPermission();
  }, [state.settings.notificationsOn]);

  /* --------------------------- Time Computations --------------------------- */
  const defaultDurationSec = useMemo(() => {
    const s = state.settings;
    const map: Record<Mode, number> = {
      work: s.workMin * 60,
      short: s.shortMin * 60,
      long: s.longMin * 60,
    };
    return map[state.mode];
  }, [state.mode, state.settings]);

  const nowSec = Date.now() / 1000;
  const remainingSec = useMemo(() => {
    if (!state.endAt) return defaultDurationSec;
    const rem = Math.max(0, Math.round(state.endAt / 1000 - nowSec));
    return rem;
  }, [state.endAt, nowSec, defaultDurationSec]);

  const progress = 1 - remainingSec / defaultDurationSec; // 0..1

  /* ----------------------------- Timer Engine ------------------------------ */
  const start = () => {
    const durationSec = remainingSec; // continue if paused
    const { startedAt, endAt } = startTimestamp(durationSec);
    dispatch({ type: "TIMER_START", payload: { durationSec } });
    // override with proper timestamps
    (state as any).startedAt = startedAt;
    (state as any).endAt = endAt;
  };

  const stop = () => {
    dispatch({ type: "TIMER_STOP" });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  // requestAnimationFrame loop for smooth updates + optional tick sound
  useEffect(() => {
    if (!state.endAt || !state.running) return;
    let lastWhole = Math.floor((state.endAt - Date.now()) / 1000);

    const loop = () => {
      const rem = Math.max(0, state.endAt! - Date.now());
      remainingRef.current = Math.ceil(rem / 1000);
      const currentWhole = Math.floor(rem / 1000);
      if (state.settings.tickSounds && state.settings.soundOn && currentWhole !== lastWhole && currentWhole > 0 && state.mode === "work") {
        tick();
        lastWhole = currentWhole;
      }
      if (rem <= 0) {
        // Finish this segment
        handleSegmentComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current!);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.running, state.endAt, state.mode, state.settings.tickSounds, state.settings.soundOn]);

  function handleSegmentComplete() {
    // Log finished session
    const logged: SessionLog = {
      ts: Date.now(),
      mode: state.mode,
      durationSec: defaultDurationSec,
    };

    if (state.settings.soundOn) chime();
    if (state.settings.notificationsOn) {
      notify(
        state.mode === "work" ? "Work session complete" : "Break complete",
        state.mode === "work" ? "Time for a break!" : "Back to focus!"
      );
    }

    if (state.mode === "work") {
      // increment task session count
      if (state.activeTaskId) {
        const idx = state.tasks.findIndex((t) => t.id === state.activeTaskId);
        if (idx >= 0) {
          const tasks = [...state.tasks];
          tasks[idx] = { ...tasks[idx], sessions: tasks[idx].sessions + 1 };
          dispatch({ type: "LOAD", payload: { tasks } });
        }
      }
      dispatch({ type: "COMPLETE_WORK" });
      const nextMode = state.completedCycles + 1 >= state.settings.cyclesUntilLong ? "long" : "short";
      dispatch({
        type: "SWITCH_MODE",
        payload: { mode: nextMode, durationSec: nextMode === "long" ? state.settings.longMin * 60 : state.settings.shortMin * 60, logged },
      });
      // reset cycles if long break
      if (nextMode === "long") dispatch({ type: "LOAD", payload: { completedCycles: 0 } });
    } else {
      // from break -> work
      dispatch({
        type: "SWITCH_MODE",
        payload: { mode: "work", durationSec: state.settings.workMin * 60, logged },
      });
    }

    // auto start next
    if (state.settings.autoStartNext) {
      const nextDuration =
        state.mode === "work"
          ? (state.completedCycles + 1 >= state.settings.cyclesUntilLong ? state.settings.longMin : state.settings.shortMin) * 60
          : state.settings.workMin * 60;
      setTimeout(() => {
        const ts = startTimestamp(nextDuration);
        dispatch({ type: "TIMER_START", payload: { durationSec: nextDuration } });
        (state as any).startedAt = ts.startedAt;
        (state as any).endAt = ts.endAt;
      }, 400);
    }
  }

  /* --------------------------------- Stats --------------------------------- */
  const todaySessions = useMemo(
    () => state.logs.filter((l) => l.mode === "work" && isSameDay(l.ts, Date.now())).length,
    [state.logs]
  );
  const weekWorkMinutes = useMemo(() => {
    const now = Date.now();
    const dayMs = 86400000;
    const last7 = now - dayMs * 6;
    const mins = state.logs
      .filter((l) => l.mode === "work" && l.ts >= last7)
      .reduce((acc, l) => acc + l.durationSec / 60, 0);
    return Math.round(mins);
  }, [state.logs]);

  // streak: consecutive days with >=1 work session
  const streak = useMemo(() => {
    const days = new Set(
      state.logs.filter((l) => l.mode === "work").map((l) => todayKey(l.ts))
    );
    let count = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (days.has(todayKey(d.getTime()))) count++;
      else break;
    }
    return count;
  }, [state.logs]);

  /* ------------------------------ UI helpers ------------------------------- */
  const ring = {
    size: 260,
    stroke: 14,
  };
  const radius = (ring.size - ring.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0.001, circumference * progress);

  const modeLabel: Record<Mode, string> = { work: "Focus", short: "Short Break", long: "Long Break" };
  const modeColor: Record<Mode, string> = {
    work: "from-emerald-500 to-teal-600",
    short: "from-sky-500 to-indigo-600",
    long: "from-fuchsia-500 to-purple-700",
  };

  const displayRemaining = secondsToClock(remainingSec);

  /* --------------------------------- Render -------------------------------- */
  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top bar */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-slate-900/30 border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">⏳ Pomodoro Pro</h1>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
              onClick={() => dispatch({ type: "TOGGLE_THEME" })}
              aria-label="Toggle theme"
            >
              {state.theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>
      </header>

      {/* Reserved Ad (top) */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="h-16 w-full rounded-xl border border-dashed border-black/10 dark:border-white/10 grid place-items-center text-xs opacity-60">
          {/* Reserved for Google Ads */}
          <span>Ad Space</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 grid lg:grid-cols-[1fr,380px] gap-6">
        {/* Left: Timer */}
        <section className="bg-white/70 dark:bg-white/5 rounded-3xl p-5 shadow-xl shadow-black/5 dark:shadow-none border border-black/5 dark:border-white/10">
          {/* Mode tabs */}
          <div className="flex gap-2 mb-4">
            {(["work", "short", "long"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => dispatch({ type: "SWITCH_MODE", payload: { mode: m, durationSec: 0 } })}
                className={`px-3 py-1.5 rounded-xl text-sm border transition ${
                  state.mode === m
                    ? "bg-black/80 text-white dark:bg-white/90 dark:text-black border-transparent"
                    : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {modeLabel[m]}
              </button>
            ))}
          </div>

          {/* Animated ring */}
          <div className="flex flex-col items-center relative">
            <div
              className={`relative grid place-items-center rounded-full p-1 transition-all duration-500 bg-gradient-to-br ${modeColor[state.mode]} shadow-lg shadow-black/10`}
              style={{ width: ring.size + 30, height: ring.size + 30 }}
            >
              <svg width={ring.size} height={ring.size} className="rotate-[-90deg]">
                <circle
                  cx={ring.size / 2}
                  cy={ring.size / 2}
                  r={radius}
                  stroke="currentColor"
                  className="text-white/30 dark:text-white/20"
                  strokeWidth={ring.stroke}
                  fill="none"
                />
                <circle
                  cx={ring.size / 2}
                  cy={ring.size / 2}
                  r={radius}
                  stroke="currentColor"
                  className="text-white"
                  strokeWidth={ring.stroke}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${dash} ${circumference}`}
                  style={{ transition: "stroke-dasharray 150ms linear" }}
                />
              </svg>

              {/* Time text */}
              <div className="absolute text-center">
                <div className="text-xs uppercase tracking-widest opacity-80">{modeLabel[state.mode]}</div>
                <div className="text-6xl sm:text-7xl font-bold tabular-nums drop-shadow-sm mt-1">{displayRemaining}</div>
                <div className="text-xs opacity-80 mt-1">
                  Cycle {state.completedCycles % state.settings.cyclesUntilLong}/{state.settings.cyclesUntilLong}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 mt-5">
              {!state.running ? (
                <button
                  onClick={start}
                  className="px-5 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[.98] transition shadow-lg shadow-emerald-600/20"
                >
                  ▶ Start
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="px-5 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 active:scale-[.98] transition shadow-lg shadow-red-600/20"
                >
                  ⏸ Pause
                </button>
              )}
              <button
                onClick={() => {
                  stop();
                  const secs = defaultDurationSec;
                  const ts = startTimestamp(secs);
                  dispatch({ type: "LOAD", payload: { startedAt: ts.startedAt, endAt: ts.endAt, running: false } as any });
                }}
                className="px-5 py-2 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                ↺ Reset
              </button>
              <button
                onClick={async () => {
                  const ok = await navigator.clipboard?.writeText(
                    JSON.stringify(
                      {
                        mode: state.mode,
                        remainingSec,
                        settings: state.settings,
                        activeTask: state.tasks.find((t) => t.id === state.activeTaskId)?.title ?? null,
                      },
                      null,
                      2
                    )
                  ).then(() => true).catch(() => false);
                  if (ok && state.settings.soundOn) chime();
                }}
                className="px-5 py-2 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                📋 Copy status
              </button>
            </div>

            {/* Settings */}
            <details className="mt-6 w-full">
              <summary className="cursor-pointer select-none text-sm opacity-80 hover:opacity-100 transition">Settings</summary>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <NumberField
                  label="Work (min)"
                  value={state.settings.workMin}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { workMin: v } })}
                />
                <NumberField
                  label="Short break (min)"
                  value={state.settings.shortMin}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { shortMin: v } })}
                />
                <NumberField
                  label="Long break (min)"
                  value={state.settings.longMin}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { longMin: v } })}
                />
                <NumberField
                  label="Long break every (work cycles)"
                  value={state.settings.cyclesUntilLong}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { cyclesUntilLong: v } })}
                  min={2}
                  max={8}
                />
                <Toggle
                  label="Auto-start next segment"
                  checked={state.settings.autoStartNext}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { autoStartNext: v } })}
                />
                <Toggle
                  label="Enable sound"
                  checked={state.settings.soundOn}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { soundOn: v } })}
                />
                <Toggle
                  label="Tick sounds during focus"
                  checked={state.settings.tickSounds}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { tickSounds: v } })}
                />
                <Toggle
                  label="Desktop notifications"
                  checked={state.settings.notificationsOn}
                  onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { notificationsOn: v } })}
                />
              </div>
            </details>
          </div>
        </section>

        {/* Right: Tasks + Stats */}
        <aside className="space-y-6">
          {/* Tasks */}
          <div className="bg-white/70 dark:bg-white/5 rounded-3xl p-5 shadow-xl shadow-black/5 dark:shadow-none border border-black/5 dark:border-white/10">
            <h2 className="font-semibold mb-3">Tasks</h2>
            <TaskEditor
              tasks={state.tasks}
              activeId={state.activeTaskId}
              onAdd={(title) => dispatch({ type: "ADD_TASK", payload: { title } })}
              onToggle={(id) => dispatch({ type: "TOGGLE_TASK", payload: { id } })}
              onRemove={(id) => dispatch({ type: "REMOVE_TASK", payload: { id } })}
              onActivate={(id) => dispatch({ type: "SET_ACTIVE_TASK", payload: { id } })}
            />
          </div>

          {/* Stats */}
          <div className="bg-white/70 dark:bg-white/5 rounded-3xl p-5 shadow-xl shadow-black/5 dark:shadow-none border border-black/5 dark:border-white/10">
            <h2 className="font-semibold mb-3">Statistics</h2>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Today Pomodoros" value={`${todaySessions}`} />
              <Stat label="Weekly Focus (min)" value={`${weekWorkMinutes}`} />
              <Stat label="Streak (days)" value={`${streak}`} />
              <Stat
                label="Active Task"
                value={state.tasks.find((t) => t.id === state.activeTaskId)?.title || "—"}
              />
            </div>
            <details className="mt-3">
              <summary className="text-sm opacity-80 cursor-pointer">Session Log (recent)</summary>
              <ul className="mt-2 space-y-1 max-h-56 overflow-auto pr-1">
                {[...state.logs].reverse().slice(0, 30).map((l, i) => (
                  <li key={i} className="text-sm opacity-80">
                    {new Date(l.ts).toLocaleString()} — {l.mode} {Math.round(l.durationSec / 60)}m
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Reserved Ad (side/bottom) */}
          <div className="h-40 w-full rounded-2xl border border-dashed border-black/10 dark:border-white/10 grid place-items-center text-xs opacity-60">
            {/* Reserved for Google Ads */}
            <span>Ad Space</span>
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto p-6 text-xs opacity-70">
        <p>
          Tip: leave this tab visible for the most reliable notifications and sound. Your settings and stats are saved locally in your browser.
        </p>
      </footer>
    </div>
  );
}

/* ------------------------------- Components ------------------------------- */

function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 180,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2">
      <span className="text-sm">{label}</span>
      <input
        type="number"
        className="w-20 bg-transparent outline-none text-right"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

function TaskEditor({
  tasks,
  activeId,
  onAdd,
  onToggle,
  onRemove,
  onActivate,
}: {
  tasks: Task[];
  activeId: string | null;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onActivate: (id: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = inputRef.current?.value?.trim();
          if (v) {
            onAdd(v);
            if (inputRef.current) inputRef.current.value = "";
          }
        }}
        className="flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a task and press Enter"
          className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
        />
        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black">
          Add
        </button>
      </form>
      <ul className="mt-3 space-y-2">
        {tasks.length === 0 && <li className="text-sm opacity-70">No tasks yet.</li>}
        {tasks.map((t) => (
          <li
            key={t.id}
            className={`group flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
              t.id === activeId
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-black/10 dark:border-white/10"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => onToggle(t.id)}
                className="accent-emerald-600"
                aria-label={`Toggle ${t.title}`}
              />
              <button
                className={`text-left truncate ${t.done ? "line-through opacity-60" : ""}`}
                onClick={() => onActivate(t.id)}
                title="Set active"
              >
                {t.title}
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs opacity-70">🧠 {t.sessions}</span>
              <button
                className="opacity-60 hover:opacity-100 transition"
                onClick={() => onRemove(t.id)}
                title="Remove task"
              >
                ✖
              </button>
            </div>
          </li>
        ))}
      </ul>
      {activeId && (
        <button
          className="mt-2 text-xs opacity-80 hover:opacity-100 underline"
          onClick={() => onActivate(null)}
        >
          Clear active task
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-3">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
