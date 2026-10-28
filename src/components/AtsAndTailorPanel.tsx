import React, { useMemo, useState } from 'react';
import * as yaml from 'js-yaml';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  FileSearch,
  Award,
  TrendingUp,
  Settings2,
} from 'lucide-react';
import { analyzeATS, type ATSReport } from '../services/atsAnalyzer';
import {
  type AIConfig,
  DEFAULT_AI_CONFIG,
  tailorCvWithAI,
  type TailoringResult,
} from '../services/aiTailor';

interface AtsAndTailorPanelProps {
  cvYaml: string;
  designYaml: string;
  settingsYaml: string;
  jdText: string;
  onChangeJdText: (jd: string) => void;
  onApplyTailoredYaml: (newCvYaml: string, newSettingsYaml?: string) => void;
  hasReviewBaseline: boolean;
  onAcceptReview: () => void;
  onRevertReview: () => void;
}

const SAMPLE_JDS = [
  {
    label: 'Full-Stack & AI Engineer',
    text: `Senior Full-Stack AI Engineer (React, TypeScript, Python, LLMs)
We are seeking a Senior Full-Stack Engineer to architect and scale our next-generation AI workspace.
Responsibilities:
- Design and build responsive frontends using React, TypeScript, TailwindCSS, and WebAssembly.
- Architect resilient backend microservices in Python, FastAPI, Node.js, and PostgreSQL.
- Build production Generative AI and RAG pipelines using Large Language Models (LLM), LangChain, Vector Databases, and Prompt Engineering.
- Deploy and scale containerized workloads on AWS, Docker, and Kubernetes with CI/CD via GitHub Actions.
- Collaborate with cross-functional product and design teams, driving system design, code review, and unit/E2E testing with Playwright.`,
  },
  {
    label: 'Cloud & DevOps Architect',
    text: `Staff Cloud Infrastructure & Site Reliability Engineer (AWS, Kubernetes, Terraform)
Join our core infrastructure organization to lead reliability, observability, and cloud scale.
Requirements:
- Deep expertise in AWS, Google Cloud (GCP), Kubernetes (K8s), Docker, and Terraform Infrastructure-as-Code.
- Strong programming and automation skills in Go (Golang), Python, Rust, and Bash/Linux systems.
- Proven experience building observability stacks using Prometheus, Grafana, OpenTelemetry, and Datadog.
- Design high-throughput distributed systems, Kafka event streaming, Redis caching, and zero-downtime CI/CD pipelines.`,
  },
  {
    label: 'ML & Data Scientist',
    text: `Lead Machine Learning Engineer — NLP & Deep Learning
We are looking for a Machine Learning Engineer to train, fine-tune, and deploy production deep learning models.
Qualifications:
- Strong proficiency in Python, PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, and SQL.
- Hands-on experience with Transformers, HuggingFace, Fine-Tuning, NLP, and Computer Vision.
- Experience scaling data pipelines with Spark, PySpark, Airflow, Snowflake, and Databricks.
- Track record of A/B testing, model optimization, and reducing inference latency in production.`,
  },
];

export const AtsAndTailorPanel: React.FC<AtsAndTailorPanelProps> = ({
  cvYaml,
  designYaml,
  settingsYaml,
  jdText,
  onChangeJdText,
  onApplyTailoredYaml,
  hasReviewBaseline,
  onAcceptReview,
  onRevertReview,
}) => {
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    try {
      const saved = localStorage.getItem('rendercv_ai_config');
      return saved
        ? { ...DEFAULT_AI_CONFIG, ...JSON.parse(saved), provider: 'backend-gateway' }
        : DEFAULT_AI_CONFIG;
    } catch {
      return DEFAULT_AI_CONFIG;
    }
  });

  const [customInstruction, setCustomInstruction] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorProgress, setTailorProgress] = useState('');
  const [tailorError, setTailorError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<TailoringResult | null>(null);
  const [showWeakBullets, setShowWeakBullets] = useState(false);
  const [showAdvancedKey, setShowAdvancedKey] = useState(false);

  const atsReport: ATSReport = useMemo(
    () => analyzeATS(cvYaml, designYaml, jdText),
    [cvYaml, designYaml, jdText]
  );

  const updateAiConfig = (patch: Partial<AIConfig>) => {
    setAiConfig((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('rendercv_ai_config', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleInjectSingleKeyword = (keyword: string) => {
    try {
      const doc: any = yaml.load(cvYaml) || { cv: {} };
      if (!doc.cv) doc.cv = {};
      if (!doc.cv.sections) doc.cv.sections = {};

      const formattedKw =
        keyword.length <= 3
          ? keyword.toUpperCase()
          : keyword.replace(/\b\w/g, (c) => c.toUpperCase());

      let skillsKey = Object.keys(doc.cv.sections).find((k) =>
        /skill|technologies|stack/i.test(k)
      );
      if (!skillsKey) {
        skillsKey = 'skills';
        doc.cv.sections[skillsKey] = [];
      }
      const list = Array.isArray(doc.cv.sections[skillsKey]) ? doc.cv.sections[skillsKey] : [];
      if (list.length > 0 && typeof list[0] === 'object' && 'details' in list[0]) {
        const current = String(list[0].details || '');
        if (!current.toLowerCase().includes(keyword.toLowerCase())) {
          list[0].details = current ? `${current}, ${formattedKw}` : formattedKw;
        }
      } else {
        list.push({ label: 'Core Skills', details: formattedKw });
      }
      doc.cv.sections[skillsKey] = list;
      const nextYaml = yaml.dump(doc, { lineWidth: -1, noRefs: true });
      onApplyTailoredYaml(nextYaml);
    } catch {
      // ignore
    }
  };

  const handleSyncBoldKeywords = () => {
    if (atsReport.keywords.matched.length === 0) return;
    try {
      const sDoc: any = yaml.load(settingsYaml) || { settings: {} };
      if (!sDoc.settings) sDoc.settings = {};
      sDoc.settings.bold_keywords = atsReport.keywords.matched.slice(0, 12);
      const nextSettings = yaml.dump(sDoc, { lineWidth: -1, noRefs: true });
      onApplyTailoredYaml(cvYaml, nextSettings);
    } catch {
      // ignore
    }
  };

  const handleRunTailor = async () => {
    if (!jdText.trim()) {
      setTailorError('Please paste a target Job Description (or select a sample role above) first.');
      return;
    }
    setIsTailoring(true);
    setTailorError(null);
    setTailorProgress('Tailoring your resume to the job description...');
    try {
      const res = await tailorCvWithAI(
        cvYaml,
        designYaml,
        settingsYaml,
        jdText,
        { ...aiConfig, provider: 'backend-gateway' },
        customInstruction,
        (status) => setTailorProgress(status)
      );
      setLastResult(res);
      onApplyTailoredYaml(res.newCvYaml, res.newSettingsYaml);
    } catch (err: any) {
      setTailorError(err?.message || 'Unable to tailor resume right now.');
    } finally {
      setIsTailoring(false);
      setTailorProgress('');
    }
  };

  const scoreRingStyle =
    atsReport.overallScore >= 80
      ? 'text-emerald-700 border-emerald-400 bg-emerald-50'
      : atsReport.overallScore >= 60
      ? 'text-amber-700 border-amber-400 bg-amber-50'
      : 'text-rose-700 border-rose-400 bg-rose-50';

  const weakBullets = atsReport.bulletAudits.filter((b) => b.issues.length > 0);

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-5 space-y-4 bg-slate-50/70 text-slate-800">
      {/* Review Baseline Banner when AI edits are active */}
      {hasReviewBaseline && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-indigo-950">
                Tailored Resume Draft Ready
              </p>
              <p className="text-xs text-indigo-700">
                Review the updated PDF preview on the right, then keep or revert the changes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={onRevertReview}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Undo Changes
            </button>
            <button
              type="button"
              onClick={onAcceptReview}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Keep Changes
            </button>
          </div>
        </div>
      )}

      {/* 1. Overall ATS Score Dashboard Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 shadow-2xs ${scoreRingStyle}`}
            >
              <span className="text-2xl font-extrabold leading-none">{atsReport.overallScore}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-75 mt-0.5">
                / 100
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  ATS Match & Readiness Score
                </h3>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    atsReport.overallScore >= 80
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : atsReport.overallScore >= 60
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {atsReport.overallScore >= 80
                    ? 'Strong Match'
                    : atsReport.overallScore >= 60
                    ? 'Good Baseline'
                    : 'Needs Tailoring'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Measures ATS formatting compliance, measurable impact bullets, and job keyword
                alignment.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Sub-Score Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Formatting & Structure</span>
              <span className="font-bold text-slate-900">
                {Math.round((atsReport.formattingScore / 30) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((atsReport.formattingScore / 30) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Action Verbs & Impact</span>
              <span className="font-bold text-slate-900">
                {Math.round((atsReport.impactScore / 30) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((atsReport.impactScore / 30) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">
                {atsReport.hasJD ? 'Job Keyword Match' : 'Skill Coverage'}
              </span>
              <span className="font-bold text-slate-900">
                {Math.round((atsReport.keywordScore / 40) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((atsReport.keywordScore / 40) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Target Job Description & 1-Click AI Tailoring */}
      <div className="p-4 sm:p-5 rounded-2xl border border-indigo-200/80 bg-white shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tailor Resume to a Job Description
              </h3>
              <p className="text-[11px] text-slate-500">
                Paste the job posting below to match missing keywords and optimize your bullet points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400">Try sample role:</span>
            {SAMPLE_JDS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangeJdText(s.text)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 transition cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={5}
          value={jdText}
          onChange={(e) => onChangeJdText(e.target.value)}
          placeholder="Paste the target Job Description (responsibilities, required skills, and qualifications) here..."
          className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />

        {/* Clean Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="Optional focus (e.g., 'Highlight backend scalability and leadership')..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            disabled={isTailoring}
            onClick={handleRunTailor}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition cursor-pointer shrink-0"
          >
            {isTailoring ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{tailorProgress || 'Tailoring Resume...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tailor Resume with AI</span>
              </>
            )}
          </button>
        </div>

        {tailorError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {tailorError}
          </div>
        )}

        {/* Subtle collapsible custom API key option for power users */}
        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setShowAdvancedKey((v) => !v)}
            className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
          >
            <Settings2 className="w-3 h-3" />
            {showAdvancedKey ? 'Hide AI Preferences' : 'AI Preferences'}
          </button>
        </div>

        {showAdvancedKey && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Personal Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={aiConfig.geminiApiKey}
                onChange={(e) => updateAiConfig({ geminiApiKey: e.target.value })}
                placeholder="Use default BuildCV AI or paste key..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Preferred Model Tier
              </label>
              <select
                value={aiConfig.geminiModel}
                onChange={(e) => updateAiConfig({ geminiModel: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="gemini-2.5-flash">Fast & Balanced (Recommended)</option>
                <option value="gemini-2.5-pro">Deep Reasoning</option>
              </select>
            </div>
          </div>
        )}

        {/* AI Tailoring Summary & Applied Improvements */}
        {lastResult && (
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                {lastResult.changes.length} Resume Improvements Applied
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700">{lastResult.summaryMessage}</p>

            {lastResult.changes.length > 0 && (
              <div className="space-y-2 pt-1">
                {lastResult.changes.map((chg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-indigo-700 uppercase text-[10px] tracking-wider">
                        {chg.section} • {chg.type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-500">{chg.reason}</span>
                    </div>
                    {chg.before && (
                      <div className="text-xs text-rose-600/80 line-through truncate">
                        − {chg.before}
                      </div>
                    )}
                    <div className="text-xs text-emerald-700 font-medium">+ {chg.after}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Keyword Match & 1-Click Skill Addition Matrix */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {atsReport.hasJD
                ? `Job Keyword Alignment (${atsReport.keywords.matchRate}% Matched)`
                : 'Detected Resume Skills'}
            </h3>
          </div>
          {atsReport.keywords.matched.length > 0 && (
            <button
              type="button"
              onClick={handleSyncBoldKeywords}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition cursor-pointer"
            >
              Highlight Matched Skills in PDF
            </button>
          )}
        </div>

        {atsReport.hasJD && atsReport.keywords.missing.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <p className="text-xs text-amber-900 mb-2 font-semibold">
              Missing Job Keywords — Click any skill below to add it to your Skills section:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {atsReport.keywords.missing.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleInjectSingleKeyword(kw)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-medium flex items-center gap-1 shadow-2xs transition cursor-pointer"
                  title="Click to add to your Skills section"
                >
                  <Plus className="w-3 h-3 text-amber-600" /> {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">
            Matched Skills Found in Your Resume ({atsReport.keywords.matched.length}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {atsReport.keywords.matched.length > 0 ? (
              atsReport.keywords.matched.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-600" /> {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No keywords matched yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Detailed ATS Checklist */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          ATS Readiness Checklist
        </h3>
        <div className="space-y-2.5">
          {atsReport.checks.map((chk) => (
            <div
              key={chk.id}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                {chk.status === 'pass' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : chk.status === 'warn' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">{chk.title}</div>
                  <p className="text-xs text-slate-600 mt-0.5">{chk.detail}</p>
                  {chk.fixAction && (
                    <p className="text-xs font-medium text-indigo-600 mt-1">
                      Recommendation: {chk.fixAction}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shrink-0">
                {chk.status === 'pass' ? 'Passed' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Bullet Point Action Verb & Quantification Audit */}
        {weakBullets.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowWeakBullets((v) => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-amber-800 hover:text-amber-900 py-2.5 px-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 cursor-pointer"
            >
              <span>
                Accomplishment Bullet Suggestions ({weakBullets.length} bullets can be strengthened)
              </span>
              {showWeakBullets ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {showWeakBullets && (
              <div className="space-y-2 mt-2.5 max-h-64 overflow-y-auto pr-1">
                {weakBullets.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">
                      {b.section} — {b.entryTitle}
                    </div>
                    <div className="text-slate-800 font-medium">"{b.bullet}"</div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {b.issues.map((iss, j) => (
                        <span
                          key={j}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-medium"
                        >
                          {iss}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
