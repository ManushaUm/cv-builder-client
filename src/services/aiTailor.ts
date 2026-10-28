import * as yaml from 'js-yaml';
import { analyzeATS, type ATSReport } from './atsAnalyzer';
import { callBackendAiGateway, getAuthToken } from './api';

export type AIProviderType = 'backend-gateway' | 'ollama' | 'gemini' | 'smart-local';

export interface AIConfig {
  provider: AIProviderType;
  ollamaUrl: string;
  ollamaModel: string;
  geminiApiKey: string;
  geminiModel: string;
}

export interface TailoringChange {
  section: string;
  type: 'headline' | 'summary' | 'skills' | 'bullet_rewrite' | 'cleanup' | 'bold_keywords';
  before?: string;
  after: string;
  reason: string;
}

export interface TailoringResult {
  newCvYaml: string;
  newSettingsYaml?: string;
  thinkingTrace?: string;
  summaryMessage: string;
  changes: TailoringChange[];
  addedKeywords: string[];
  providerUsed: string;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'backend-gateway',
  ollamaUrl: '/api/ollama',
  ollamaModel: 'lfm2.5-thinking:latest',
  geminiApiKey: '',
  geminiModel: 'gemini-2.5-flash',
};

export async function detectOllamaStatus(baseUrl = '/api/ollama'): Promise<{
  online: boolean;
  models: string[];
}> {
  const urlsToTry = [baseUrl, 'http://localhost:11434', 'http://127.0.0.1:11434'];
  for (const url of urlsToTry) {
    try {
      const cleanUrl = url.replace(/\/$/, '');
      const res = await fetch(`${cleanUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        const models = Array.isArray(data?.models)
          ? data.models.map((m: any) => String(m.name))
          : [];
        return { online: true, models };
      }
    } catch {
      // try next URL
    }
  }
  return { online: false, models: [] };
}

function extractThinkingAndJson(rawText: string): { thinking: string; jsonObj: any | null } {
  let thinking = '';
  const thinkMatch = rawText.match(/<think>([\s\S]*?)<\/think>/i);
  if (thinkMatch) {
    thinking = thinkMatch[1].trim();
  }
  const cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Extract JSON block from markdown fences or first { ... }
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = codeBlockMatch ? codeBlockMatch[1].trim() : cleaned;

  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSlice = candidate.slice(firstBrace, lastBrace + 1);
    try {
      return { thinking, jsonObj: JSON.parse(jsonSlice) };
    } catch {
      // Try repairing trailing commas
      try {
        const repaired = jsonSlice.replace(/,\s*([}\]])/g, '$1');
        return { thinking, jsonObj: JSON.parse(repaired) };
      } catch {
        return { thinking, jsonObj: null };
      }
    }
  }
  return { thinking, jsonObj: null };
}

/**
 * Engineered Prompt Builder specifically tuned for lightweight reasoning models (LFM 2.5 Thinking)
 * and Gemini Flash. Uses compact context + strict JSON output schema so YAML indentation can never break.
 */
function buildTailoringPrompt(
  cvObj: any,
  jdText: string,
  atsReport: ATSReport,
  customInstruction?: string
): { system: string; user: string } {
  const cv = cvObj?.cv || {};
  const sections = cv?.sections || {};

  // Extract existing bullets with indices so the model can rewrite specific weak bullets accurately
  const sampleBullets: Array<{ section: string; org: string; index: number; text: string }> = [];
  for (const [secName, entries] of Object.entries(sections)) {
    if (!Array.isArray(entries) || /welcome to rendercv/i.test(secName)) continue;
    for (const entry of entries) {
      if (entry && typeof entry === 'object' && Array.isArray(entry.highlights)) {
        const org = entry.company || entry.institution || entry.name || entry.title || secName;
        entry.highlights.forEach((b: string, idx: number) => {
          if (sampleBullets.length < 10) {
            sampleBullets.push({
              section: secName,
              org: String(org),
              index: idx,
              text: String(b),
            });
          }
        });
      }
    }
  }

  const existingSkills: Array<{ label: string; details: string }> = [];
  for (const [secName, entries] of Object.entries(sections)) {
    if (/skill|tech/i.test(secName) && Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry && typeof entry === 'object' && entry.label && entry.details) {
          existingSkills.push({ label: String(entry.label), details: String(entry.details) });
        }
      }
    }
  }

  const system = `You are an elite ATS Resume Strategist and Principal Career Coach.
Your job is to tailor a candidate's RenderCV resume to maximize ATS keyword alignment and recruiter impact for a target Job Description (JD), WITHOUT fabricating fake companies, degrees, or dates.

CRITICAL RULES:
1. Output ONLY a single valid JSON object matching the exact schema below. Do NOT output markdown prose outside the JSON block.
2. Start every rewritten accomplishment bullet with a strong past-tense Action Verb (e.g., Architected, Engineered, Spearheaded, Optimized, Automated, Reduced, Scaled).
3. Naturally weave missing JD keywords into the headline, summary, skills, and bullet rewrites where truthful and relevant.
4. Preserve existing metrics (%, $, numbers) in bullets or frame clear engineering/business outcomes.

OUTPUT JSON SCHEMA:
{
  "tailored_headline": "Concise target role headline matching JD (e.g., Senior Full-Stack Engineer | React, TypeScript & Cloud Architecture)",
  "tailored_summary": "2-sentence high-impact executive summary aligned with the JD and candidate background",
  "skills_additions": [
    { "category": "Existing or new skill category name", "skills": ["Skill 1", "Skill 2"] }
  ],
  "bullet_rewrites": [
    {
      "original_substring": "Exact first 4-6 words of the original bullet being improved",
      "rewritten_bullet": "Upgraded ATS-friendly bullet starting with a strong action verb and incorporating relevant JD keywords",
      "reason": "Brief reason for this upgrade"
    }
  ],
  "bold_keywords": ["Top 6-10 matched technical keywords to highlight in the CV"],
  "coaching_summary": "1-2 sentence explanation of how the CV was tailored for this JD"
}`;

  const user = `TARGET JOB DESCRIPTION (JD):
"""
${jdText.slice(0, 2800)}
"""

${customInstruction ? `USER CUSTOM REQUEST: "${customInstruction}"\n` : ''}
ATS GAP ANALYSIS (PRE-COMPUTED):
- Current ATS Score: ${atsReport.overallScore}/100
- Matched JD Keywords (${atsReport.keywords.matched.length}): ${atsReport.keywords.matched.slice(0, 18).join(', ') || 'None yet'}
- MISSING High-Priority JD Keywords to integrate (${atsReport.keywords.missing.length}): ${atsReport.keywords.missing.slice(0, 15).join(', ') || 'Focus on action verbs & impact'}

CANDIDATE CURRENT CV DIGEST:
- Name: ${cv.name || 'Candidate'}
- Current Headline: ${cv.headline || '(empty)'}
- Existing Skill Rows: ${JSON.stringify(existingSkills)}
- Current Experience/Project Bullets:
${sampleBullets.map((b, i) => `  [${i + 1}] (${b.org}): "${b.text}"`).join('\n')}

Return ONLY the JSON object matching the schema.`;

  return { system, user };
}

/**
 * Applies the structured tailoring plan (either from LFM/Gemini JSON or smart deterministic fallback)
 * safely onto the YAML AST so RenderCV's strict schema is 100% preserved.
 */
function applyTailoringPlanToYaml(
  cvYaml: string,
  settingsYaml: string,
  plan: any,
  atsReport: ATSReport,
  removeBoilerplate = true
): {
  newCvYaml: string;
  newSettingsYaml: string;
  changes: TailoringChange[];
  addedKeywords: string[];
} {
  const doc: any = yaml.load(cvYaml) || { cv: {} };
  if (!doc.cv) doc.cv = {};
  if (!doc.cv.sections) doc.cv.sections = {};

  const changes: TailoringChange[] = [];
  const addedKeywords = new Set<string>();

  // 1. Remove "Welcome to RenderCV" starter boilerplate if present
  if (removeBoilerplate && doc.cv.sections['Welcome to RenderCV']) {
    delete doc.cv.sections['Welcome to RenderCV'];
    changes.push({
      section: 'Welcome to RenderCV',
      type: 'cleanup',
      before: 'Welcome to RenderCV (3 boilerplate items)',
      after: 'Removed starter template instructions for ATS compliance',
      reason: 'Starter template instructions hurt ATS section parsing.',
    });
  }

  // 2. Update Headline
  if (plan.tailored_headline && typeof plan.tailored_headline === 'string') {
    const prevHeadline = doc.cv.headline || '';
    const nextHeadline = plan.tailored_headline.trim();
    if (nextHeadline && nextHeadline !== prevHeadline) {
      doc.cv.headline = nextHeadline;
      changes.push({
        section: 'Header',
        type: 'headline',
        before: prevHeadline || '(None)',
        after: nextHeadline,
        reason: 'Aligned professional headline with target JD role title and core stack.',
      });
    }
  }

  // 3. Insert or Update Summary Section at top of sections
  if (plan.tailored_summary && typeof plan.tailored_summary === 'string') {
    const cleanSummary = plan.tailored_summary.trim();
    if (cleanSummary) {
      const existingSummaryKey = Object.keys(doc.cv.sections).find((k) =>
        /^(summary|professional_summary|profile|about)$/i.test(k)
      );
      if (existingSummaryKey) {
        const beforeVal = Array.isArray(doc.cv.sections[existingSummaryKey])
          ? doc.cv.sections[existingSummaryKey].join(' ')
          : String(doc.cv.sections[existingSummaryKey]);
        doc.cv.sections[existingSummaryKey] = [cleanSummary];
        changes.push({
          section: existingSummaryKey,
          type: 'summary',
          before: beforeVal,
          after: cleanSummary,
          reason: 'Tailored executive summary to mirror target role requirements and key competencies.',
        });
      } else {
        // Prepend summary section first
        const reordered: Record<string, any> = {
          summary: [cleanSummary],
          ...doc.cv.sections,
        };
        doc.cv.sections = reordered;
        changes.push({
          section: 'summary',
          type: 'summary',
          before: '(No Summary Section)',
          after: cleanSummary,
          reason: 'Added targeted ATS executive summary highlighting core JD keywords.',
        });
      }
    }
  }

  // 4. Add missing JD skills into the skills section (`one_line_entry` format: { label, details })
  if (Array.isArray(plan.skills_additions) && plan.skills_additions.length > 0) {
    let skillsKey = Object.keys(doc.cv.sections).find((k) => /skill|technologies|stack/i.test(k));
    if (!skillsKey) {
      skillsKey = 'skills';
      doc.cv.sections[skillsKey] = [];
    }
    const skillEntries: any[] = Array.isArray(doc.cv.sections[skillsKey])
      ? doc.cv.sections[skillsKey]
      : [];

    for (const addition of plan.skills_additions) {
      if (!addition || !Array.isArray(addition.skills) || addition.skills.length === 0) continue;
      const category = String(addition.category || 'Core Technologies & Alignment').trim();
      const newSkills = addition.skills
        .map((s: any) => String(s).trim())
        .filter((s: string) => s.length > 0);
      if (newSkills.length === 0) continue;

      newSkills.forEach((s: string) => addedKeywords.add(s));

      // Check if a matching label already exists
      const existingRow = skillEntries.find(
        (row) =>
          row &&
          typeof row === 'object' &&
          row.label &&
          String(row.label).toLowerCase() === category.toLowerCase()
      );

      if (existingRow) {
        const beforeDetails = String(existingRow.details || '');
        const existingList = beforeDetails.split(',').map((s) => s.trim().toLowerCase());
        const toAppend = newSkills.filter((s: string) => !existingList.includes(s.toLowerCase()));
        if (toAppend.length > 0) {
          existingRow.details = beforeDetails
            ? `${beforeDetails}, ${toAppend.join(', ')}`
            : toAppend.join(', ');
          changes.push({
            section: skillsKey,
            type: 'skills',
            before: `${existingRow.label}: ${beforeDetails}`,
            after: `${existingRow.label}: ${existingRow.details}`,
            reason: `Appended missing JD keywords (${toAppend.join(', ')}) to ${existingRow.label}.`,
          });
        }
      } else {
        const newRow = {
          label: category,
          details: newSkills.join(', '),
        };
        skillEntries.push(newRow);
        changes.push({
          section: skillsKey,
          type: 'skills',
          before: '(New Skill Row)',
          after: `${newRow.label}: ${newRow.details}`,
          reason: `Added targeted JD skill group (${newSkills.join(', ')}).`,
        });
      }
    }
    doc.cv.sections[skillsKey] = skillEntries;
  }

  // 5. Apply Bullet Rewrites across Experience & Projects
  if (Array.isArray(plan.bullet_rewrites)) {
    for (const rw of plan.bullet_rewrites) {
      const needle = String(rw?.original_substring || '')
        .trim()
        .toLowerCase();
      const replacement = String(rw?.rewritten_bullet || '').trim();
      if (!needle || !replacement || needle.length < 5) continue;

      let matched = false;
      for (const [secName, entries] of Object.entries(doc.cv.sections)) {
        if (matched || !Array.isArray(entries)) continue;
        for (const entry of entries) {
          if (matched || !entry || typeof entry !== 'object' || !Array.isArray(entry.highlights))
            continue;
          for (let i = 0; i < entry.highlights.length; i++) {
            const currentBullet = String(entry.highlights[i] || '');
            if (currentBullet.toLowerCase().includes(needle)) {
              const beforeBullet = currentBullet;
              entry.highlights[i] = replacement;
              changes.push({
                section: secName,
                type: 'bullet_rewrite',
                before: beforeBullet,
                after: replacement,
                reason: String(rw.reason || 'Upgraded action verb, ATS keywords, and measurable impact.'),
              });
              matched = true;
              break;
            }
          }
        }
      }
    }
  }

  // 6. Keep settingsYaml clean (do not auto-inject bold_keywords unless user configures them in Settings)
  const newSettingsYaml = settingsYaml;

  // Check which previously missing JD keywords are now present in the updated CV
  const newCvYaml = yaml.dump(doc, { lineWidth: -1, noRefs: true });
  const newCvLower = newCvYaml.toLowerCase();
  for (const kw of atsReport.keywords.missing) {
    if (newCvLower.includes(kw.toLowerCase())) {
      addedKeywords.add(kw);
    }
  }

  return {
    newCvYaml,
    newSettingsYaml,
    changes,
    addedKeywords: Array.from(addedKeywords),
  };
}

/**
 * Deterministic Fallback Tailoring Engine when user chooses Smart Local Mode
 * or if an LLM call times out.
 */
function buildDeterministicTailoringPlan(
  _cvObj: any,
  jdText: string,
  atsReport: ATSReport
): any {
  const missing = atsReport.keywords.missing;
  const matched = atsReport.keywords.matched;

  // Infer role title from first line of JD or top keywords
  const firstLine = jdText
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 3 && l.length < 75);
  const roleTitle =
    firstLine && /engineer|developer|scientist|manager|analyst|architect|designer|lead|director/i.test(firstLine)
      ? firstLine.replace(/^(job title:|role:|position:)\s*/i, '').trim()
      : 'Senior Software & Systems Engineer';

  const topKeywords = [...matched.slice(0, 3), ...missing.slice(0, 3)]
    .map((k) => (k.length <= 4 ? k.toUpperCase() : k.replace(/\b\w/g, (c) => c.toUpperCase())));

  const tailored_headline =
    topKeywords.length > 0
      ? `${roleTitle} | ${topKeywords.slice(0, 4).join(' • ')}`
      : roleTitle;

  const tailored_summary = `Results-driven ${roleTitle} with proven expertise in ${
    topKeywords.slice(0, 5).join(', ') || 'scalable architecture and high-reliability systems'
  }. Demonstrated track record of spearheading end-to-end delivery, optimizing system performance, and translating complex cross-functional requirements into measurable production outcomes.`;

  const skills_additions =
    missing.length > 0
      ? [
          {
            category: 'Target Role Alignment & Core Stack',
            skills: missing.slice(0, 8).map((k) =>
              k.length <= 3 ? k.toUpperCase() : k.replace(/\b\w/g, (c) => c.toUpperCase())
            ),
          },
        ]
      : [];

  // Upgrade weak bullets deterministically
  const bullet_rewrites: any[] = [];
  for (const audit of atsReport.bulletAudits) {
    if (bullet_rewrites.length >= 4) break;
    if (!audit.hasActionVerb || !audit.hasMetric) {
      let improved = audit.bullet
        .replace(/^responsible for\s+/i, 'Spearheaded ')
        .replace(/^worked on\s+/i, 'Engineered ')
        .replace(/^helped\s+(with\s+)?/i, 'Collaborated to deliver ')
        .replace(/^assisted\s+(in\s+|with\s+)?/i, 'Accelerated ');

      if (!audit.hasActionVerb && improved === audit.bullet) {
        improved = `Engineered and optimized ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
      }
      if (missing.length > 0 && bullet_rewrites.length < missing.length) {
        const kw = missing[bullet_rewrites.length];
        if (!improved.toLowerCase().includes(kw.toLowerCase())) {
          improved = improved.replace(/\.$/, '') + ` leveraging ${kw} best practices.`;
        }
      }
      if (improved !== audit.bullet) {
        bullet_rewrites.push({
          original_substring: audit.bullet.split(/\s+/).slice(0, 5).join(' '),
          rewritten_bullet: improved,
          reason: 'Strengthened action verb lead-in and integrated target JD terminology.',
        });
      }
    }
  }

  return {
    tailored_headline,
    tailored_summary,
    skills_additions,
    bullet_rewrites,
    bold_keywords: [...matched.slice(0, 6), ...missing.slice(0, 4)],
    coaching_summary:
      'Applied deterministic ATS optimization: aligned headline & executive summary with JD, injected missing core keywords into Skills, removed template boilerplate, and strengthened accomplishment bullets.',
  };
}

export async function tailorCvWithAI(
  cvYaml: string,
  designYaml: string,
  settingsYaml: string,
  jdText: string,
  config: AIConfig,
  customInstruction?: string,
  onProgress?: (status: string) => void
): Promise<TailoringResult> {
  const atsReport = analyzeATS(cvYaml, designYaml, jdText);
  const cvObj: any = yaml.load(cvYaml) || { cv: {} };
  const { system, user } = buildTailoringPrompt(cvObj, jdText, atsReport, customInstruction);

  // 0. Production Hybrid Backend Gateway (Server Gemini / Groq / Queued Ollama + Automatic Fallback)
  if (config.provider === 'backend-gateway') {
    onProgress?.('Analyzing job requirements & tailoring your resume...');

    // 0a. If user is authenticated, try the Backend Hybrid AI Gateway first
    if (getAuthToken()) {
      try {
        const gwRes = await callBackendAiGateway({
          systemPrompt: system,
          userPrompt: user,
          preferredProvider: 'auto',
          ollamaModel: config.ollamaModel,
          geminiModel: config.geminiModel,
          clientGeminiKey: config.geminiApiKey || undefined,
        });

        const { thinking, jsonObj } = extractThinkingAndJson(gwRes.rawContent);
        const plan = jsonObj || buildDeterministicTailoringPlan(cvObj, jdText, atsReport);
        const applied = applyTailoringPlanToYaml(cvYaml, settingsYaml, plan, atsReport);

        return {
          newCvYaml: applied.newCvYaml,
          newSettingsYaml: applied.newSettingsYaml,
          thinkingTrace: thinking || undefined,
          summaryMessage:
            plan.coaching_summary ||
            `Tailored your resume with ${applied.changes.length} targeted ATS improvements.`,
          changes: applied.changes,
          addedKeywords: applied.addedKeywords,
          providerUsed: 'BuildCV AI',
        };
      } catch {
        // Silently cascade to client-side key or local engine
      }
    }

    // 0b. If user provided a personal Gemini key in preferences, try direct Gemini call
    if (config.geminiApiKey.trim()) {
      try {
        const modelName = config.geminiModel || 'gemini-2.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
          config.geminiApiKey.trim()
        )}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: user }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const { thinking, jsonObj } = extractThinkingAndJson(rawContent);
          const plan = jsonObj || buildDeterministicTailoringPlan(cvObj, jdText, atsReport);
          const applied = applyTailoringPlanToYaml(cvYaml, settingsYaml, plan, atsReport);
          return {
            newCvYaml: applied.newCvYaml,
            newSettingsYaml: applied.newSettingsYaml,
            thinkingTrace: thinking || undefined,
            summaryMessage:
              plan.coaching_summary ||
              `Tailored your resume with ${applied.changes.length} targeted ATS improvements.`,
            changes: applied.changes,
            addedKeywords: applied.addedKeywords,
            providerUsed: 'BuildCV AI',
          };
        }
      } catch {
        // Silently cascade
      }
    }

    // 0c. Seamless Instant ATS Optimization Fallback (never fails)
    const plan = buildDeterministicTailoringPlan(cvObj, jdText, atsReport);
    const applied = applyTailoringPlanToYaml(cvYaml, settingsYaml, plan, atsReport);
    return {
      newCvYaml: applied.newCvYaml,
      newSettingsYaml: applied.newSettingsYaml,
      summaryMessage: plan.coaching_summary,
      changes: applied.changes,
      addedKeywords: applied.addedKeywords,
      providerUsed: 'BuildCV AI',
    };
  }

  // 1. Try Local Ollama (e.g. lfm2.5-thinking:latest)
  if (config.provider === 'ollama') {
    onProgress?.(`Running local LLM (${config.ollamaModel}) via Ollama...`);
    const urls = [config.ollamaUrl, '/api/ollama', 'http://localhost:11434'];
    let lastErr: Error | null = null;

    for (const baseUrl of urls) {
      try {
        const cleanUrl = baseUrl.replace(/\/$/, '');
        const res = await fetch(`${cleanUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: config.ollamaModel || 'lfm2.5-thinking:latest',
            stream: false,
            options: {
              temperature: 0.25,
              num_predict: 1800,
            },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        });

        if (!res.ok) {
          throw new Error(`Ollama returned HTTP ${res.status}`);
        }

        const data = await res.json();
        const rawContent: string = data?.message?.content || '';
        const { thinking, jsonObj } = extractThinkingAndJson(rawContent);

        const plan = jsonObj || buildDeterministicTailoringPlan(cvObj, jdText, atsReport);
        const applied = applyTailoringPlanToYaml(cvYaml, settingsYaml, plan, atsReport);

        return {
          newCvYaml: applied.newCvYaml,
          newSettingsYaml: applied.newSettingsYaml,
          thinkingTrace: thinking || undefined,
          summaryMessage:
            plan.coaching_summary ||
            `Tailored CV using local Ollama (${config.ollamaModel}) with ${applied.changes.length} targeted ATS improvements.`,
          changes: applied.changes,
          addedKeywords: applied.addedKeywords,
          providerUsed: `Ollama (${config.ollamaModel})`,
        };
      } catch (err: any) {
        lastErr = err;
      }
    }
    throw new Error(
      `Could not reach local Ollama (${lastErr?.message || 'connection failed'}). Make sure Ollama is running or switch to Smart Local / Gemini API.`
    );
  }

  // 2. Try Google Gemini API (Google AI Studio key)
  if (config.provider === 'gemini') {
    if (!config.geminiApiKey.trim()) {
      throw new Error('Please enter your free Google AI Studio Gemini API Key in AI Settings.');
    }
    onProgress?.(`Calling Google Gemini (${config.geminiModel})...`);
    const modelName = config.geminiModel || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
      config.geminiApiKey.trim()
    )}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const { thinking, jsonObj } = extractThinkingAndJson(rawContent);

    const plan = jsonObj || buildDeterministicTailoringPlan(cvObj, jdText, atsReport);
    const applied = applyTailoringPlanToYaml(cvYaml, settingsYaml, plan, atsReport);

    return {
      newCvYaml: applied.newCvYaml,
      newSettingsYaml: applied.newSettingsYaml,
      thinkingTrace: thinking || undefined,
      summaryMessage:
        plan.coaching_summary ||
        `Tailored CV using Google ${modelName} with ${applied.changes.length} ATS improvements.`,
      changes: applied.changes,
      addedKeywords: applied.addedKeywords,
      providerUsed: `Google Gemini (${modelName})`,
    };
  }

  // 3. Smart Deterministic Local Engine
  onProgress?.('Running Smart Deterministic ATS & JD Optimizer...');
  const plan = buildDeterministicTailoringPlan(cvObj, jdText, atsReport);
  const applied = applyTailoringPlanToYaml(cvYaml, settingsYaml, plan, atsReport);
  return {
    newCvYaml: applied.newCvYaml,
    newSettingsYaml: applied.newSettingsYaml,
    summaryMessage: plan.coaching_summary,
    changes: applied.changes,
    addedKeywords: applied.addedKeywords,
    providerUsed: 'Smart Local Rule Engine',
  };
}
