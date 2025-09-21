"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LS_KEY = "typing_pro_v1";

const DEFAULT_PASAGES = {
	classic: [
		"The quick brown fox jumps over the lazy dog.",
		"Practice makes perfect — keep typing and improve your speed.",
		"Simple repetitive practice will build muscle memory and confidence.",
	],
	words: [
		"the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "practice", "speed",
		"focus", "keyboard", "framer", "motion", "javascript", "react", "tailwind", "design"
	],
	code: [
		"function greet(name) {\n  return `Hello, ${name}!`;\n}",
		"const sum = (a, b) => a + b;\nconsole.log(sum(2,3));",
	],
};

function loadLS() {
	try {
		const raw = localStorage.getItem(LS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch { return {}; }
}
function saveLS(data: any) {
	try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

const now = () => performance.now();
const wordsIn = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

import { ToolHeader } from '../../../components/tool-header';

export default function TypingTestPage() {
	const [mode, setMode] = useState<"classic" | "custom" | "code">("classic");
	const [duration, setDuration] = useState<number>(60);
	const [textSource, setTextSource] = useState<string>(DEFAULT_PASAGES.classic[0]);
	const [customText, setCustomText] = useState<string>("");
	const [started, setStarted] = useState(false);
	const [finished, setFinished] = useState(false);
	const [cursor, setCursor] = useState(0);
	const [errors, setErrors] = useState<number>(0);
	const [typed, setTyped] = useState<string>("");
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsed, setElapsed] = useState(0);
	const [highscores, setHighscores] = useState<any[]>([]);
	const [heatmap, setHeatmap] = useState<Record<string, number>>({});
	const rafRef = useRef<number | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isClient, setIsClient] = useState(false);
	useEffect(() => { setIsClient(true); }, []);

	const [testText, setTestText] = useState<string>("");
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (mode === "custom") {
			setTestText(customText || "");
		} else if (mode === "code") {
			setTestText(textSource || DEFAULT_PASAGES.code[0]);
		} else {
			const targetWords = Math.max(20, Math.round(duration / 2));
			const pool = DEFAULT_PASAGES.words;
			let out = [] as string[];
			for (let i = 0; i < targetWords; i++) out.push(pool[Math.floor(Math.random() * pool.length)]);
			setTestText(out.join(" ") + ".");
		}
	}, [mode, duration, customText, textSource]);

	const correctChars = useMemo(() => {
		let c = 0;
		for (let i = 0; i < typed.length; i++) if (typed[i] === testText[i]) c++;
		return c;
	}, [typed, testText]);

	const accuracy = useMemo(() => {
		if (typed.length === 0) return 100;
		return Math.max(0, Math.round((correctChars / typed.length) * 100));
	}, [correctChars, typed]);

	const wpm = useMemo(() => {
		if (!startTime) return 0;
		const minutes = Math.max(1 / 60, (elapsed / 1000) / 60);
		return Math.round((correctChars / 5) / minutes);
	}, [correctChars, elapsed, startTime]);

	const progress = Math.min(1, typed.length / Math.max(1, testText.length));

	useEffect(() => {
		if (!started) return;
		const tick = () => {
			const nowMs = now();
			if (!startTime) return;
			const e = nowMs - startTime;
			setElapsed(e);
			if (e >= duration * 1000) {
				setFinished(true);
				setStarted(false);
			} else {
				rafRef.current = requestAnimationFrame(tick);
			}
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
	}, [started, startTime, duration]);

	function startTest() {
		setStarted(true);
		setFinished(false);
		setCursor(0);
		setErrors(0);
		setTyped("");
		setHeatmap({});
		const t = now();
		setStartTime(t);
		setElapsed(0);
		setTimeout(() => inputRef.current?.focus(), 50);
	}

	function finishTest() {
		setFinished(true);
		setStarted(false);
		if (startTime) {
			const score = { ts: Date.now(), wpm, accuracy, duration, mode };
			const newHs = [score, ...highscores].slice(0, 50);
			setHighscores(newHs);
			if (typeof window !== "undefined") saveLS({ ...loadLS(), highscores: newHs });
		}
	}

	function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (!started || finished) return;
		const key = e.key;
		if (key.length > 1 && key !== "Backspace" && key !== "Enter" && key !== " ") return;
		e.preventDefault();
		if (key === "Backspace") {
			if (typed.length === 0) return;
			setTyped((s) => s.slice(0, -1));
			setCursor((c) => Math.max(0, c - 1));
			return;
		}
		const char = key === "\r" ? "\n" : key;
		const pos = typed.length;
		const expected = testText[pos] || "";
		setTyped((s) => s + char);
		setHeatmap((prev) => ({ ...prev, [char]: (prev[char] || 0) + 1 }));
		if (char !== expected) setErrors((v) => v + 1);
		if (pos + 1 >= testText.length) finishTest();
	}

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const onClick = () => inputRef.current?.focus();
		el.addEventListener("click", onClick);
		return () => el.removeEventListener("click", onClick);
	}, []);

	function resetTest() {
		setStarted(false);
		setFinished(false);
		setCursor(0);
		setErrors(0);
		setTyped("");
		setElapsed(0);
		setStartTime(null);
	}

		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6">
			<div className="max-w-5xl mx-auto">
					<ToolHeader slug="typing-test" className="mb-4" />
					<div className="text-xs sm:text-sm opacity-80 mb-4">Try to beat your best — challenge yourself!</div>
				<div className="h-16 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 mb-6 grid place-items-center bg-white dark:bg-gray-900">
					<span>Ad Space</span>
				</div>
				<main className="grid gap-6 lg:grid-cols-[1fr,320px]">
					<section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
						<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
							<select className="rounded-xl border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:w-auto" value={mode} onChange={(e) => setMode(e.target.value as any)}>
								<option value="classic">Classic (random words)</option>
								<option value="custom">Custom Text</option>
								<option value="code">Code Mode</option>
							</select>
							<label className="sm:ml-2 flex items-center gap-2 text-sm">
								<span>Duration</span>
								<select className="rounded-xl border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={String(duration)} onChange={(e) => setDuration(Number(e.target.value))}>
									<option value={15}>15s</option>
									<option value={30}>30s</option>
									<option value={60}>60s</option>
									<option value={120}>120s</option>
								</select>
							</label>
							<div className="w-full sm:w-auto sm:ml-auto flex gap-2 pt-1 sm:pt-0">
								<button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex-1 sm:flex-none" onClick={() => startTest()} disabled={started}>Start</button>
								<button className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex-1 sm:flex-none" onClick={() => resetTest()}>Reset</button>
							</div>
						</div>
						{mode === "custom" && (
							<textarea className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 mb-4 min-h-[120px]" placeholder="Paste your custom text here" value={customText} onChange={(e) => setCustomText(e.target.value)} />
						)}
						{mode === "code" && (
							<div className="mb-4 flex gap-2">
								<select className="rounded-xl border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" onChange={(e) => setTextSource(e.target.value)}>
									{DEFAULT_PASAGES.code.map((c, i) => <option key={i} value={c}>Snippet {i + 1}</option>)}
								</select>
							</div>
						)}
						<div className="flex items-center gap-4 mb-4">
							<div className="flex-1">
								<div className="text-xs text-gray-700 dark:text-gray-300">Progress</div>
								<div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mt-2 overflow-hidden">
									<div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm text-gray-700 dark:text-gray-300">Time</div>
								<div className="text-lg font-mono font-semibold">{Math.max(0, Math.ceil(duration - elapsed / 1000))}s</div>
							</div>
						</div>
						<div ref={containerRef} className="relative p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[140px] sm:min-h-[160px] mb-4 bg-white dark:bg-gray-900 cursor-text">
							<HiddenInput ref={inputRef} onKey={handleKey} />
							<div className="prose break-words whitespace-pre-wrap text-base sm:text-lg leading-7 text-gray-900 dark:text-gray-100">
								{testText.split("").map((ch, i) => {
									const typedCh = typed[i];
									const status = !typedCh ? "pending" : typedCh === ch ? "correct" : "wrong";
									return (
										<span key={i} className={`inline-block ${status === "pending" ? "opacity-60" : status === "correct" ? "text-emerald-600" : "text-rose-600 animate-shake"}`}>
											{ch}
										</span>
									);
								})}
							</div>
							<div className="absolute top-2 left-2 sm:top-3 sm:left-3 text-xs text-gray-700 dark:text-gray-300 opacity-60">Click to focus and start typing</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							<Stat label="WPM" value={String(wpm)} />
							<Stat label="Accuracy" value={`${accuracy}%`} />
							<Stat label="Errors" value={String(errors)} />
						</div>
						<AnimatePresence>
							{finished && (
								<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-sm opacity-80">Result</div>
											<div className="text-2xl font-bold">{wpm} WPM — {accuracy}%</div>
											<div className="text-xs opacity-70 mt-1">You typed {typed.length} chars, {wordsIn(typed)} words.</div>
										</div>
										<div className="text-right">
											<button onClick={() => { startTest(); }} className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Retry</button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</section>
					<aside className="space-y-4">
						<div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-800">
							<h3 className="font-semibold mb-2">Live Analytics</h3>
							<div className="text-sm opacity-80 mb-2">Speed over time</div>
							<MiniSparkline w={280} h={80} data={generateSpeedSeries(typed, elapsed)} />
							<div className="mt-3 text-xs opacity-70">Keystroke heatmap (most mistyped keys highlighted)</div>
							<KeyHeatmap data={heatmap} />
						</div>
						{isClient && (
							<div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-800">
								<h3 className="font-semibold mb-2">Highscores (local)</h3>
								<ol className="list-decimal pl-5 text-sm space-y-1 max-h-56 overflow-auto">
									{highscores.length === 0 && <li className="opacity-70">No scores yet — set a new personal best!</li>}
									{highscores.map((s: any, i: number) => (
										<li key={i} className="flex justify-between"><span>{new Date(s.ts).toLocaleString()} — {s.wpm} WPM</span><span className="opacity-70">{s.accuracy}%</span></li>
									))}
								</ol>
							</div>
						)}
						<div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-800">
							<h3 className="font-semibold mb-2">Tips</h3>
							<ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
								<li>Keep your wrists relaxed and use all fingers.</li>
								<li>Focus on accuracy first, then speed.</li>
								<li>Practice daily — short bursts are better than one long session.</li>
							</ul>
						</div>
					</aside>
				</main>
				<footer className="mt-8 text-xs text-gray-700 dark:text-gray-300 opacity-70">Made with ❤️ — works offline, stores scores locally. Reserved ad space above.</footer>
			</div>
		</div>
	);
}

const HiddenInput = React.forwardRef(function HiddenInput(props: any, ref: any) {
	return <input ref={ref} onKeyDown={props.onKey} className="opacity-0 absolute pointer-events-none" />;
});
function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border p-3">
			<div className="text-xs opacity-70">{label}</div>
			<div className="text-lg font-semibold mt-1">{value}</div>
		</div>
	);
}
function MiniSparkline({ data, w = 200, h = 60 }: { data: number[]; w?: number; h?: number }) {
	if (!data || data.length === 0) return <div className="h-16" />;
	const max = Math.max(...data, 1);
	const points = data.map((v, i) => `${(i / (data.length - 1 || 1)) * w},${h - (v / max) * h}`).join(" ");
	return (
		<svg width={w} height={h} className="w-full rounded">
			<polyline fill="none" strokeWidth={2} stroke="#06b6d4" points={points} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
function generateSpeedSeries(typed: string, elapsed: number) {
	const secs = Math.max(1, Math.round(elapsed / 1000));
	const buckets = Math.min(20, Math.max(3, Math.ceil(secs / 2)));
	const arr: number[] = new Array(buckets).fill(0);
	if (secs === 0) return arr;
	const chars = typed.length;
	for (let i = 0; i < buckets; i++) arr[i] = Math.round((chars / 5) / (secs / 60));
	return arr;
}
function KeyHeatmap({ data }: { data: Record<string, number> }) {
	const rows = [
		"~` 1 2 3 4 5 6 7 8 9 0 - =",
		"q w e r t y u i o p [ ] \\",
		"a s d f g h j k l ; '",
		"z x c v b n m , . /",
	];
	const max = Math.max(...Object.values(data), 1);
	return (
		<div className="mt-2 space-y-1 text-xs">
			{rows.map((r, i) => (
				<div key={i} className="flex gap-1">
					{r.split(" ").map((k, idx) => {
						const val = data[k] || data[k.toLowerCase()] || 0;
						const intensity = Math.min(1, val / max);
						return (
							<div key={idx} className={`px-2 py-1 rounded text-center min-w-[20px] ${intensity > 0 ? "text-white" : "text-slate-500"}`} style={{ background: intensity ? `rgba(220,38,38,${0.18 + intensity * 0.6})` : "transparent" }}>{k}</div>
						);
					})}
				</div>
			))}
		</div>
	);
}