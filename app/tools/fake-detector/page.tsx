"use client";

import React, { useState } from "react"; // Removed useMemo as it is not used

/**
 * Fake News Detector - Text Analyzer (client-side)
 * - Paste text or URL (tool treats text input; URL presence counted)
 * - Heuristic checks: readability (Flesch-Kincaid), clickbait phrases, excessive punctuation,
 *   all-caps ratio, sentiment keywords, presence of numeric claims, hedge words, citation presence (URLs).
 * - Produces Trust Score 0..100 + breakdown and suggestions.
 *
 * No external deps. All processing client-side. Keep UX clean & accessible.
 */

/* ----------------------------- Helper Data ------------------------------ */

const CLICKBAIT_TERMS = [
	"shocking", "you won't believe", "what happens next", "this is why", "go viral",
	"must see", "won't believe", "secret", "revealed", "exposed", "miracle", "will shock you"
];

const HEDGE_TERMS = [
	"might", "could", "may", "suggests", "possible", "likely", "reportedly", "allegedly", "some", "appear"
];

const POSITIVE_WORDS = ["good","great","excellent","amazing","love","success","win"];
const NEGATIVE_WORDS = ["bad","terrible","awful","hate","failure","lose","wrong","danger"];

const SENSATIONAL_PUNCTUATION_PATTERN = /[!?]{2,}|…{2,}/g;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const NUMBER_PATTERN = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g;

/* --------------------------- Utility Functions -------------------------- */

function wordTokens(text: string): string[] {
	return text
		.replace(/\n/g, " ")
		.split(/\s+/)
		.filter(Boolean);
}

function sentenceTokens(text: string): string[] {
	// naive split by punctuation that ends a sentence
	return text
		.split(/[.!?]+/)
		.map((s: string) => s.trim())
		.filter(Boolean);
}

function avgSyllablesPerWord(text: string): number {
	// rough syllable estimate
	const words = wordTokens(text);
	if (!words.length) return 0;
		const syllableCount = words.reduce((acc: number, w: string) => acc + countSyllables(w), 0);
	return syllableCount / words.length;
}

function countSyllables(word: string): number {
	word = word.toLowerCase().replace(/[^a-z]/g, "");
	if (!word) return 0;
	const syl = word
		.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
		.replace(/^y/, "")
		.match(/[aeiouy]{1,2}/g);
	return (syl ? syl.length : 1);
}

function fleschKincaidReadingEase(text: string): number {
	const words = wordTokens(text).length;
	const sentences = Math.max(1, sentenceTokens(text).length);
	const syllables = Math.max(1, Math.round(words * avgSyllablesPerWord(text)));
	// Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
	const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / Math.max(1, words));
	return Math.round(score * 10) / 10;
}

function fleschKincaidGrade(text: string): number {
	const words = wordTokens(text).length;
	const sentences = Math.max(1, sentenceTokens(text).length);
	const syllables = Math.max(1, Math.round(words * avgSyllablesPerWord(text)));
	// FK grade: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
	const grade = 0.39 * (words / sentences) + 11.8 * (syllables / Math.max(1, words)) - 15.59;
	return Math.round(grade * 10) / 10;
}

function countMatches(regex: RegExp, text: string): number {
	const m = text.match(regex);
	return m ? m.length : 0;
}

function ratio(n: number, total: number): number {
	return total === 0 ? 0 : n / total;
}

function clamp01(v: number): number {
	return Math.max(0, Math.min(1, v));
}

/* -------------------------- Core Analyzer Logic ------------------------- */

function analyzeText(text: string): {
	trustScore: number;
	details: {
		wordCount: number;
		sentenceCount: number;
		urlCount: number;
		numberCount: number;
		exclamations: number;
		clickbaitHits: number;
		hedgeHits: number;
		uppercaseRatio: number;
		sensationalPunct: number;
		sentimentScore: number;
		readability: number;
		grade: number;
	};
	reasons: string[];
	suggestions: string[];
	riskySnippets: string[];
	raw: Record<string, number>;
} {
	const clean = text.trim();
	const words = wordTokens(clean);
	const wordCount = words.length;
	// use distinct names to avoid redeclaration conflicts later
	const sentenceArr = sentenceTokens(clean);
	const sentenceCount = Math.max(1, sentenceArr.length);
	const urls = (clean.match(URL_REGEX) || []);
	const urlCount = urls.length;
	const numbers = (clean.match(NUMBER_PATTERN) || []).length;
	const exclamations = countMatches(/!/g, clean);
	const sensationalPunct = countMatches(SENSATIONAL_PUNCTUATION_PATTERN, clean);
		const allCapsWords = words.filter((w: string) => w.length >= 2 && /^[A-Z0-9\-]+$/.test(w)).length;
	const uppercaseRatio = ratio(allCapsWords, wordCount);
	const clickbaitHits = CLICKBAIT_TERMS.filter(t => clean.toLowerCase().includes(t)).length;
	const hedgeHits = HEDGE_TERMS.filter(t => clean.toLowerCase().includes(t)).length;
	const positiveHits = POSITIVE_WORDS.filter(t => clean.toLowerCase().includes(t)).length;
	const negativeHits = NEGATIVE_WORDS.filter(t => clean.toLowerCase().includes(t)).length;
	const sentimentScore = clamp01((positiveHits - negativeHits + 2) / 4); // rough normalized 0..1

	const readability = fleschKincaidReadingEase(clean);
	const grade = fleschKincaidGrade(clean);

	// heuristics that lower trust:
	// - many clickbait terms
	// - high uppercase ratio
	// - many sensational punctuations
	// - no sources/urls but many numeric claims
	// - high hedge usage (makes it vague) or extreme sentiment
	// - low readability (very low or very high grade can be suspicious)
	// We'll compute sub-scores (0..1 where 1 is good/trustworthy)

	const sourceScore = urlCount > 0 ? 1 : clamp01(1 - Math.min(1, numbers / 6)); // having URLs increases trust (but not always)
	const clickbaitPenalty = clamp01(1 - (clickbaitHits / 3)); // 1 -> no clickbait
	const capsPenalty = clamp01(1 - uppercaseRatio * 3); // if uppercase ratio > .33 -> big penalty
	const punctPenalty = clamp01(1 - sensationalPunct / 3);
	const hedgePenalty = clamp01(1 - hedgeHits / 6); // hedging lowers decisive reliability a bit
	const sentimentPenalty = clamp01(1 - Math.abs(0.5 - sentimentScore)); // if extreme sentiment, penalty

	// readability ideal range: Flesch 60..80 (easy), grade ~7-12; penalize if below 30 or above 90 (nonsense)
	const readabilityScore = clamp01((readability - 30) / (80 - 30));
	const gradeScore = clamp01(1 - Math.abs(9 - grade) / 12); // prefer grade near 9

	// final aggregated trust score 0..100
	const weights = {
		source: 0.18,
		clickbait: 0.18,
		caps: 0.12,
		punct: 0.12,
		hedge: 0.08,
		sentiment: 0.08,
		readability: 0.12,
		grade: 0.12
	};

	const score =
		sourceScore * weights.source +
		clickbaitPenalty * weights.clickbait +
		capsPenalty * weights.caps +
		punctPenalty * weights.punct +
		hedgePenalty * weights.hedge +
		sentimentPenalty * weights.sentiment +
		readabilityScore * weights.readability +
		gradeScore * weights.grade;

	const trustScore = Math.round(score * 100);

	// detailed reasons (explainable)
	const reasons = [];
	if (clickbaitHits) reasons.push(`${clickbaitHits} clickbait phrase(s) found`);
	if (uppercaseRatio > 0.05) reasons.push(`High ALL-CAPS usage (${Math.round(uppercaseRatio * 100)}% words)`);
	if (sensationalPunct > 0) reasons.push(`${sensationalPunct} sensational punctuation groups (?? !! …)`);
	if (urlCount === 0 && numbers > 2) reasons.push(`Numeric claims (${numbers}) without linked sources`);
	if (hedgeHits) reasons.push(`${hedgeHits} hedging phrase(s) (makes claims vague)`);
	if (sentimentScore > 0.8) reasons.push("Strong positive sentiment detected (emotional language)");
	if (sentimentScore < 0.2) reasons.push("Strong negative sentiment detected (emotional language)");

	// suggestions
	const suggestions = [];
	if (!urlCount) suggestions.push("Add citations or URLs to primary sources when making numeric claims.");
	if (clickbaitHits) suggestions.push("Avoid sensational clickbait phrases; be factual and precise.");
	if (uppercaseRatio > 0.05) suggestions.push("Avoid typing words in ALL CAPS; it reduces credibility.");
	if (sensationalPunct > 0) suggestions.push("Reduce excessive question/exclamation punctuation.");
	if (hedgeHits) suggestions.push("Replace vague hedging words with clear evidence or exact findings.");
	if (readability < 30) suggestions.push("Text is hard to read; simplify sentences and avoid long clauses.");
	if (grade < 5 || grade > 15) suggestions.push("Adjust tone: aim for a general audience readability (grade ~6–12).");

	// highlight risky snippets: find sentences with clickbait or extreme punctuation or many numbers
	const riskySnippets = sentenceArr
		.map((s: string) => s.trim())
		.filter((s: string) => {
			const lc = s.toLowerCase();
			if (CLICKBAIT_TERMS.some(t => lc.includes(t))) return true;
			if ((s.match(/[!?]{2,}/) || []).length) return true;
			if ((s.match(/\d{2,}/) || []).length >= 2) return true;
			return false;
		})
		.slice(0, 6);

	return {
		trustScore,
		details: {
			wordCount,
			sentenceCount,
			urlCount,
			numberCount: numbers,
			exclamations,
			clickbaitHits,
			hedgeHits,
			uppercaseRatio,
			sensationalPunct,
			sentimentScore,
			readability,
			grade
		},
		reasons,
		suggestions,
		riskySnippets,
		// sub-scores and their raw values for display
		raw: {
			sourceScore,
			clickbaitPenalty,
			capsPenalty,
			punctPenalty,
			hedgePenalty,
			sentimentPenalty,
			readabilityScore,
			gradeScore
		}
	};
}

/* ----------------------------- UI Components ---------------------------- */

type AnalysisResult = ReturnType<typeof analyzeText>;

const FakeNewsDetector: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [analyzed, setAnalyzed] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);

	const doAnalyze = () => {
		const res = analyzeText(text || "");
		setResult(res);
		setAnalyzed(true);
		setCopied(false);
	};

	const reset = () => {
		setText("");
		setResult(null);
		setAnalyzed(false);
	};

	const exportJson = () => {
		if (!result) return;
		const blob = new Blob([JSON.stringify({ input: text, analysis: result }, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "analysis.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 p-6">
			<div className="max-w-5xl mx-auto">
				<header className="flex items-start justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl font-bold">🕵️ Fake News Detector — Text Analyzer</h1>
						<p className="text-sm opacity-80 mt-1">Paste an article or snippet. This tool uses client-side heuristics to show suspicious signals and a trust score (for guidance only).</p>
					</div>
					<div className="text-xs opacity-80">Client-side only • No text leaves your browser</div>
				</header>

				<div className="h-16 rounded-xl border border-dashed border-black/10 dark:border-white/10 mb-6 grid place-items-center bg-white/80 dark:bg-slate-900/80 text-black dark:text-white">Ad Space</div>

				<main className="grid lg:grid-cols-[1fr,380px] gap-6">
					<section className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
						<label className="text-sm font-medium mb-2 block">Paste article or paragraph</label>
						<textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Paste text here (or paste a news URL and the article snippet)..."
							rows={12}
							className="w-full rounded-xl border p-3 bg-white dark:bg-slate-900 text-black dark:text-white outline-none text-sm"
						/>

						<div className="flex gap-2 mt-4">
							<button
								onClick={doAnalyze}
								className="px-4 py-2 rounded-xl bg-emerald-600 text-white dark:bg-emerald-700 shadow"
								aria-label="Analyze text"
							>
								Analyze
							</button>
							<button onClick={reset} className="px-3 py-2 rounded-xl border dark:border-slate-700">Clear</button>
							<button
								onClick={() => {
									navigator.clipboard?.writeText(text).then(() => {
										setCopied(true);
										setTimeout(() => setCopied(false), 1500);
									});
								}}
								className="px-3 py-2 rounded-xl border dark:border-slate-700"
							>
								Copy Text
							</button>
							<div className="ml-auto text-xs opacity-70 self-center">Words: {wordTokens(text).length}</div>
						</div>

						{!analyzed && (
							<div className="mt-6 text-sm opacity-70">
								Tip: paste full paragraphs for better analysis. This tool gives guidance — it is not a substitute for journalistic fact-checking.
							</div>
						)}

						{result && (
							<div className="mt-6 space-y-4">
								<TrustCard result={result} />
								<DetailsBlock text={text} result={result} />
								<div className="flex gap-2">
									<button onClick={() => { navigator.clipboard?.writeText(JSON.stringify({ input: text, analysis: result }, null, 2)); }} className="px-3 py-2 rounded-xl border dark:border-slate-700">Copy JSON</button>
									<button onClick={exportJson} className="px-3 py-2 rounded-xl border dark:border-slate-700">Download JSON</button>
								</div>
							</div>
						)}
					</section>

					<aside className="space-y-4">
						<div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
							<h3 className="font-semibold mb-2">Why this score?</h3>
							<p className="text-sm opacity-80">We combine signals like clickbait words, punctuation, caps, source presence, numeric claims, and readability to produce a trust estimate. It's heuristic — always verify with reputable fact-checkers.</p>
						</div>

						<div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
							<h3 className="font-semibold mb-2">Quick Checklist</h3>
							<ul className="text-sm opacity-80 list-disc pl-5 space-y-1">
								<li>Are primary sources cited (links to studies, official statements)?</li>
								<li>Are claims supported by data and reputable outlets?</li>
								<li>Does the language sound emotional or sensational?</li>
								<li>Is there balanced reporting (quotes from multiple sides)?</li>
							</ul>
						</div>

						<div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
							<h3 className="font-semibold mb-2">Useful resources</h3>
							<ul className="text-sm opacity-80 list-disc pl-5 space-y-1">
								<li><a className="underline" href="https://www.snopes.com/" target="_blank" rel="noreferrer">Snopes</a></li>
								<li><a className="underline" href="https://www.poynter.org/" target="_blank" rel="noreferrer">Poynter</a></li>
								<li><a className="underline" href="https://www.factcheck.org/" target="_blank" rel="noreferrer">FactCheck.org</a></li>
							</ul>
						</div>

					</aside>
				</main>

				<footer className="mt-6 text-xs opacity-70">Note: This tool is heuristic and intended for guidance and triage only — use professional fact-checking for critical claims.</footer>
			</div>
		</div>
	);
}

/* --------------------------- UI Subcomponents --------------------------- */

function TrustCard({ result }: { result: AnalysisResult }) {
	const score = result.trustScore;
	const color =
		score >= 75 ? "bg-emerald-500" :
		score >= 50 ? "bg-amber-500" : "bg-rose-500";
	const label =
		score >= 75 ? "Likely Trustworthy" :
		score >= 50 ? "Mixed / Verify" : "Likely Suspicious";

	return (
		<div className="rounded-xl border p-4 flex items-center gap-4">
			<div className={`w-20 h-20 rounded-full grid place-items-center text-white ${color} text-2xl font-bold`}>{score}</div>
			<div>
				<div className="text-lg font-semibold">{label}</div>
				<div className="text-sm opacity-80 mt-1">Score explained below. Click suggestions to copy to clipboard.</div>
			</div>
		</div>
	);
}

function DetailsBlock({ text, result }: { text: string; result: AnalysisResult }) {
	return (
		<div className="rounded-xl border p-4">
			<div className="grid grid-cols-2 gap-4">
				<Metric name="Words" value={result.details.wordCount} />
				<Metric name="Sentences" value={result.details.sentenceCount} />
				<Metric name="URLs" value={result.details.urlCount} />
				<Metric name="Numeric claims" value={result.details.numberCount} />
				<Metric name="Clickbait hits" value={result.details.clickbaitHits} />
				<Metric name="Hedge terms" value={result.details.hedgeHits} />
				<Metric name="Sensational punctuation" value={result.details.sensationalPunct} />
				<Metric name="All-caps ratio" value={`${Math.round(result.details.uppercaseRatio * 100)}%`} />
				<Metric name="Readability (Flesch)" value={result.details.readability} />
				<Metric name="FK Grade" value={result.details.grade} />
			</div>

			<hr className="my-4" />

			<div>
				<h4 className="font-semibold mb-2">Reasons</h4>
				{result.reasons.length === 0 ? (
					<div className="text-sm opacity-80">No strong warning signals detected.</div>
				) : (
					<ul className="list-disc pl-5 text-sm space-y-1">
						{result.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
					</ul>
				)}
			</div>

			<div className="mt-4">
				<h4 className="font-semibold mb-2">Suggestions</h4>
						<ul className="list-decimal pl-5 text-sm space-y-1">
							{result.suggestions.map((s: string, i: number) => (
								<li key={i} className="flex items-start gap-2">
									<div className="flex-1">{s}</div>
									<button
										onClick={() => { navigator.clipboard?.writeText(s); }}
										className="ml-2 text-xs px-2 py-1 rounded border"
									>
										Copy
									</button>
								</li>
							))}
						</ul>
			</div>

			<div className="mt-4">
				<h4 className="font-semibold mb-2">Risky snippets</h4>
						{result.riskySnippets.length === 0 ? <div className="text-sm opacity-80">No high-risk sentences detected.</div>
							: <ol className="list-decimal pl-5 text-sm space-y-2">{result.riskySnippets.map((s: string, i: number) => <li key={i}><span className="font-mono text-xs opacity-70">{s}</span></li>)}</ol>}
			</div>
		</div>
	);
}

function Metric({ name, value }: { name: string; value: any }) {
	return (
		<div className="rounded-xl p-3 border bg-white/50 dark:bg-transparent">
			<div className="text-xs opacity-80">{name}</div>
			<div className="text-lg font-semibold mt-1">{value}</div>
		</div>
	);
}
export default FakeNewsDetector;
