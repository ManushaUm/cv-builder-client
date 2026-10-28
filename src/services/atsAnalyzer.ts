import * as yaml from 'js-yaml';

export interface ATSCheckItem {
  id: string;
  category: 'formatting' | 'content' | 'keywords';
  title: string;
  status: 'pass' | 'warn' | 'fail';
  score: number;
  maxScore: number;
  detail: string;
  fixAction?: string;
}

export interface BulletAudit {
  section: string;
  entryTitle: string;
  bullet: string;
  hasActionVerb: boolean;
  hasMetric: boolean;
  wordCount: number;
  issues: string[];
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  matchRate: number; // 0 to 100
  allExtracted: string[];
}

export interface ATSReport {
  overallScore: number;
  formattingScore: number;
  impactScore: number;
  keywordScore: number;
  hasJD: boolean;
  checks: ATSCheckItem[];
  bulletAudits: BulletAudit[];
  quantifiedRatio: number;
  actionVerbRatio: number;
  totalBullets: number;
  keywords: KeywordAnalysis;
  parsedCv: any;
}

const STRONG_ACTION_VERBS = new Set([
  'architected', 'accelerated', 'achieved', 'administered', 'advocated', 'analyzed', 'authored',
  'automated', 'boosted', 'built', 'championed', 'co-founded', 'collaborated', 'conceived',
  'configured', 'consolidated', 'constructed', 'converted', 'coordinated', 'created', 'cultivated',
  'customized', 'decreased', 'defined', 'delivered', 'deployed', 'designed', 'developed',
  'devised', 'diagnosed', 'directed', 'discovered', 'doubled', 'drove', 'eliminated', 'enabled',
  'engineered', 'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited',
  'facilitated', 'formulated', 'founded', 'generated', 'guided', 'halved', 'headed', 'identified',
  'implemented', 'improved', 'increased', 'initiated', 'innovated', 'instituted', 'integrated',
  'introduced', 'invented', 'launched', 'led', 'leveraged', 'maintained', 'managed', 'maximized',
  'mentored', 'migrated', 'minimized', 'modernized', 'modeled', 'monitored', 'negotiated',
  'operated', 'optimized', 'orchestrated', 'organized', 'overhauled', 'oversaw', 'partnered',
  'pioneered', 'planned', 'produced', 'programmed', 'published', 're-architected', 'redesigned',
  'reduced', 'refactored', 'refined', 'remediated', 'resolved', 'restructured', 'revamped',
  'saved', 'scaled', 'secured', 'simplified', 'solved', 'spearheaded', 'standardized', ' steered',
  'streamlined', 'strengthened', 'structured', 'supervised', 'surpassed', 'synthesized', 'tested',
  'trained', 'transformed', 'tripled', 'troubleshot', 'unified', 'upgraded', 'validated', 'wrote'
]);

const WEAK_STARTS = [
  'responsible for', 'worked on', 'helped', 'assisted', 'participated in',
  'involved in', 'duties included', 'tasked with', 'was responsible', 'handled'
];

const CURATED_SKILL_DICTIONARY = [
  // Languages
  'python', 'typescript', 'javascript', 'java', 'c++', 'c#', 'golang', 'go', 'rust', 'ruby',
  'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'nosql', 'bash', 'shell', 'html', 'css',
  // Frontend & Mobile
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'tailwindcss', 'tailwind', 'redux',
  'zustand', 'graphql', 'rest api', 'restful', 'webpack', 'vite', 'react native', 'flutter', 'wasm', 'webassembly',
  // Backend & Architecture
  'node.js', 'nodejs', 'express', 'fastapi', 'django', 'flask', 'spring boot', 'dotnet', '.net',
  'microservices', 'distributed systems', 'grpc', 'kafka', 'rabbitmq', 'redis', 'celery', 'event-driven',
  'websocket', 'oauth', 'jwt', 'openapi', 'swagger',
  // Data & AI / ML
  'machine learning', 'deep learning', 'llm', 'large language models', 'generative ai', 'rag',
  'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'scipy', 'spark', 'pyspark',
  'hadoop', 'airflow', 'dbt', 'snowflake', 'databricks', 'bigquery', 'tableau', 'power bi',
  'computer vision', 'nlp', 'natural language processing', 'transformers', 'huggingface', 'langchain',
  'fine-tuning', 'prompt engineering', 'vector database', 'pinecone', 'milvus', 'qdrant', 'chromadb',
  // Databases
  'postgresql', 'postgres', 'mysql', 'mongodb', 'dynamodb', 'cassandra', 'elasticsearch', 'sqlite', 'oracle',
  // Cloud & DevOps
  'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'docker', 'kubernetes', 'k8s',
  'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab ci', 'ci/cd', 'linux', 'nginx',
  'prometheus', 'grafana', 'datadog', 'splunk', 'opentelemetry', 'serverless', 'lambda', 's3', 'ec2',
  // Practices & Product
  'agile', 'scrum', 'kanban', 'tdd', 'unit testing', 'integration testing', 'e2e testing',
  'playwright', 'cypress', 'jest', 'pytest', 'system design', 'code review', 'mentorship',
  'cross-functional', 'stakeholder management', 'product roadmap', 'a/b testing', 'data analysis',
  'project management', 'jira', 'figma', 'git', 'secops', 'cybersecurity', 'soc2', 'gdpr', 'hipaa'
];

const STOPWORDS = new Set([
  'about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'alone', 'along',
  'already', 'also', 'although', 'always', 'among', 'an', 'and', 'another', 'any', 'anybody',
  'anyone', 'anything', 'anywhere', 'are', 'area', 'areas', 'around', 'as', 'ask', 'asked',
  'asking', 'asks', 'at', 'away', 'back', 'backed', 'backing', 'backs', 'be', 'became',
  'because', 'become', 'becomes', 'been', 'before', 'began', 'behind', 'being', 'beings',
  'best', 'better', 'between', 'big', 'both', 'but', 'by', 'came', 'can', 'cannot', 'case',
  'cases', 'certain', 'certainly', 'clear', 'clearly', 'come', 'could', 'company', 'candidate',
  'degree', 'description', 'desired', 'develop', 'different', 'do', 'does', 'done', 'down',
  'during', 'each', 'early', 'either', 'end', 'ended', 'ending', 'ends', 'enough', 'even',
  'evenly', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'experience',
  'experiences', 'equal', 'opportunity', 'employer', 'far', 'felt', 'few', 'find', 'finds',
  'first', 'for', 'four', 'from', 'full', 'fully', 'further', 'furthered', 'furthering',
  'furthers', 'gave', 'general', 'generally', 'get', 'gets', 'give', 'given', 'gives', 'go',
  'going', 'good', 'goods', 'got', 'great', 'greater', 'greatest', 'group', 'grouped',
  'grouping', 'groups', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'herself',
  'high', 'higher', 'highest', 'him', 'himself', 'his', 'how', 'however', 'if', 'important',
  'in', 'include', 'includes', 'including', 'into', 'is', 'it', 'its', 'itself', 'job',
  'join', 'just', 'keep', 'keeps', 'kind', 'knew', 'know', 'known', 'knows', 'large', 'largely',
  'last', 'later', 'latest', 'least', 'less', 'let', 'lets', 'like', 'likely', 'long', 'longer',
  'longest', 'look', 'looking', 'make', 'making', 'man', 'many', 'may', 'me', 'member', 'members',
  'men', 'might', 'more', 'most', 'mostly', 'mr', 'mrs', 'much', 'must', 'my', 'myself',
  'necessary', 'need', 'needed', 'needing', 'needs', 'never', 'new', 'newer', 'newest', 'next',
  'no', 'nobody', 'non', 'noone', 'not', 'nothing', 'now', 'nowhere', 'number', 'numbers',
  'of', 'off', 'often', 'old', 'older', 'oldest', 'on', 'once', 'one', 'only', 'open', 'opened',
  'opening', 'opens', 'or', 'order', 'ordered', 'ordering', 'orders', 'other', 'others', 'our',
  'out', 'over', 'part', 'parted', 'parting', 'parts', 'per', 'perhaps', 'place', 'places',
  'plus', 'point', 'pointed', 'pointing', 'points', 'possible', 'preferred', 'present',
  'presented', 'presenting', 'presents', 'problem', 'problems', 'put', 'puts', 'qualification',
  'qualifications', 'quite', 'rather', 'really', 'required', 'requirements', 'responsibilities',
  'responsibility', 'right', 'role', 'room', 'rooms', 'said', 'same', 'saw', 'say', 'says',
  'second', 'seconds', 'see', 'seem', 'seemed', 'seeming', 'seems', 'sees', 'several', 'shall',
  'she', 'should', 'show', 'showed', 'showing', 'shows', 'side', 'sides', 'since', 'small',
  'smaller', 'smallest', 'so', 'some', 'somebody', 'someone', 'something', 'somewhere', 'state',
  'states', 'still', 'such', 'sure', 'take', 'taken', 'team', 'teams', 'than', 'that', 'the',
  'their', 'them', 'then', 'there', 'therefore', 'these', 'they', 'thing', 'things', 'think',
  'thinks', 'this', 'those', 'though', 'thought', 'thoughts', 'three', 'through', 'thus', 'to',
  'today', 'together', 'too', 'took', 'toward', 'turn', 'turned', 'turning', 'turns', 'two',
  'under', 'until', 'up', 'upon', 'us', 'use', 'used', 'uses', 'using', 'very', 'want', 'wanted',
  'wanting', 'wants', 'was', 'way', 'ways', 'we', 'well', 'wells', 'went', 'were', 'what',
  'when', 'where', 'whether', 'which', 'while', 'who', 'whole', 'whose', 'why', 'will', 'with',
  'within', 'without', 'work', 'worked', 'working', 'works', 'would', 'year', 'years', 'yet',
  'you', 'young', 'younger', 'youngest', 'your', 'yours', 'ability', 'strong', 'proven', 'track',
  'record', 'excellent', 'communication', 'skills', 'environment', 'fast-paced', 'bonus', 'nice'
]);

export function extractKeywordsFromJD(jdText: string): string[] {
  if (!jdText || !jdText.trim()) return [];
  const lower = jdText.toLowerCase();
  const found = new Set<string>();

  // 1. Match curated multi-word & single-word technical/domain dictionary
  for (const skill of CURATED_SKILL_DICTIONARY) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9+#.])${escaped}($|[^a-z0-9+#.])`, 'i');
    if (regex.test(lower)) {
      found.add(skill);
    }
  }

  // 2. Match capitalized tech terms / acronyms in original JD (e.g., GraphQL, PyTorch, OAuth2, WCAG, gRPC, LLVM)
  const capMatches = jdText.match(/\b([A-Z][A-Za-z0-9+#.-]{2,18}|[A-Z]{2,8}[0-9]*)\b/g) || [];
  for (const m of capMatches) {
    const clean = m.replace(/[.,;:()]+$/, '');
    const cl = clean.toLowerCase();
    if (clean.length >= 2 && !STOPWORDS.has(cl) && !/^\d+$/.test(clean)) {
      found.add(cl);
    }
  }

  return Array.from(found).slice(0, 35);
}

export function analyzeATS(cvYaml: string, designYaml: string, jdText: string): ATSReport {
  let parsed: any = {};
  try {
    parsed = yaml.load(cvYaml) || {};
  } catch {
    parsed = {};
  }

  const cv = parsed?.cv || {};
  const sections: Record<string, any[]> = cv?.sections || {};
  const checks: ATSCheckItem[] = [];

  // --- 1. FORMATTING & PARSABILITY CHECKS (30 pts) ---
  // 1a. Contact Details (8 pts)
  const hasName = Boolean(cv.name && String(cv.name).trim().length > 1);
  const hasEmail = Boolean(cv.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(cv.email)));
  const hasLocation = Boolean(cv.location && String(cv.location).trim().length > 1);
  const hasPhoneOrLinks = Boolean(
    cv.phone || cv.website || (Array.isArray(cv.social_networks) && cv.social_networks.length > 0)
  );
  const contactParts = [hasName, hasEmail, hasLocation, hasPhoneOrLinks].filter(Boolean).length;
  const contactScore = contactParts * 2;
  checks.push({
    id: 'contact-info',
    category: 'formatting',
    title: 'ATS Contact Header Completeness',
    status: contactScore === 8 ? 'pass' : contactScore >= 6 ? 'warn' : 'fail',
    score: contactScore,
    maxScore: 8,
    detail:
      contactScore === 8
        ? 'Name, email, location, and profile/phone links are properly structured in top-level YAML.'
        : `Missing recommended ATS contact fields (${[
            !hasName && 'Name',
            !hasEmail && 'Valid Email',
            !hasLocation && 'Location',
            !hasPhoneOrLinks && 'Phone/LinkedIn',
          ]
            .filter(Boolean)
            .join(', ')}).`,
    fixAction: contactScore < 8 ? 'Add missing contact fields in the Personal Info panel.' : undefined,
  });

  // 1b. Standard ATS Section Headings (10 pts)
  const sectionKeys = Object.keys(sections).map((k) => k.toLowerCase());
  const hasExperience = sectionKeys.some((k) =>
    /experience|employment|work|history|career|professional/.test(k)
  );
  const hasEducation = sectionKeys.some((k) => /education|academic|degree|university/.test(k));
  const hasSkills = sectionKeys.some((k) => /skill|technologies|technical|competenc|stack|tool/.test(k));
  const hasTemplateBoilerplate = sectionKeys.some((k) => /welcome to rendercv/.test(k));

  let sectionScore = 0;
  if (hasExperience) sectionScore += 4;
  if (hasEducation) sectionScore += 3;
  if (hasSkills) sectionScore += 3;
  if (hasTemplateBoilerplate) sectionScore = Math.max(0, sectionScore - 3);

  checks.push({
    id: 'standard-sections',
    category: 'formatting',
    title: 'Standard ATS Section Taxonomy',
    status: sectionScore === 10 ? 'pass' : sectionScore >= 6 ? 'warn' : 'fail',
    score: sectionScore,
    maxScore: 10,
    detail: hasTemplateBoilerplate
      ? 'Contains starter boilerplate section ("Welcome to RenderCV"). Remove it before submitting to employers!'
      : sectionScore === 10
      ? 'Core ATS sections (Experience, Education, Skills) are clearly labeled.'
      : `Missing standard section headers: ${[
          !hasExperience && 'Experience',
          !hasEducation && 'Education',
          !hasSkills && 'Skills',
        ]
          .filter(Boolean)
          .join(', ')}.`,
    fixAction: hasTemplateBoilerplate
      ? 'Remove "Welcome to RenderCV" section'
      : 'Ensure Experience, Education, and Skills sections exist.',
  });

  // 1c. ISO Date Consistency (6 pts)
  let totalDates = 0;
  let validDates = 0;
  for (const entries of Object.values(sections)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (entry && typeof entry === 'object') {
        for (const df of ['start_date', 'end_date', 'date']) {
          if (entry[df] !== undefined && entry[df] !== null && entry[df] !== '') {
            totalDates++;
            const val = String(entry[df]).trim();
            if (/^(\d{4}(-\d{2}(-\d{2})?)?|present)$/i.test(val)) {
              validDates++;
            }
          }
        }
      }
    }
  }
  const dateScore = totalDates === 0 ? 3 : Math.round((validDates / totalDates) * 6);
  checks.push({
    id: 'date-consistency',
    category: 'formatting',
    title: 'Machine-Readable Chronology (YYYY-MM)',
    status: dateScore >= 5 ? 'pass' : dateScore >= 3 ? 'warn' : 'fail',
    score: dateScore,
    maxScore: 6,
    detail:
      totalDates > 0 && validDates === totalDates
        ? `All ${totalDates} date fields use strict ISO (YYYY-MM / present) format for error-free ATS timeline parsing.`
        : `${validDates}/${totalDates} date fields follow strict YYYY-MM format.`,
  });

  // 1d. Typst Vector Text Layer & Single-Column Layout (6 pts)
  const isModerncv = /theme:\s*moderncv/i.test(designYaml);
  const layoutScore = isModerncv ? 4 : 6;
  checks.push({
    id: 'pdf-parsability',
    category: 'formatting',
    title: 'Single-Column Linear Reading Order & Vector PDF',
    status: layoutScore === 6 ? 'pass' : 'warn',
    score: layoutScore,
    maxScore: 6,
    detail: isModerncv
      ? 'ModernCV uses a wide left-gutter column for dates/titles; some legacy ATS parsers prefer Classic, Harvard, or EngineeringResumes.'
      : 'Typst compiles a 100% selectable vector text layer in strict top-to-bottom linear reading order.',
  });

  const formattingScore = contactScore + sectionScore + dateScore + layoutScore; // max 30

  // --- 2. IMPACT, ACTION VERBS & QUANTIFICATION (30 pts) ---
  const bulletAudits: BulletAudit[] = [];
  for (const [secName, entries] of Object.entries(sections)) {
    if (!Array.isArray(entries) || /welcome to rendercv/i.test(secName)) continue;
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object') continue;
      const highlights: string[] = Array.isArray(entry.highlights) ? entry.highlights : [];
      const entryTitle =
        entry.company || entry.institution || entry.name || entry.title || secName;

      for (const rawBullet of highlights) {
        const bullet = String(rawBullet || '').trim();
        if (!bullet) continue;
        const words = bullet.split(/\s+/);
        const firstWord = words[0]?.toLowerCase().replace(/[^a-z-]/g, '') || '';
        const lowerBullet = bullet.toLowerCase();

        const isWeakStart = WEAK_STARTS.some((w) => lowerBullet.startsWith(w));
        const hasActionVerb = !isWeakStart && (STRONG_ACTION_VERBS.has(firstWord) || /ed$/.test(firstWord));
        const hasMetric =
          /(\d+%|\$\d+|\d+x|\b\d{1,3}(,\d{3})+|\b\d+\+|\b\d+\s*(ms|seconds|mins|hours|days|weeks|months|users|clients|requests|servers|nodes|tb|gb|mb|k|m|b|pip|stars|prs|commits|engineers|members|projects)\b)/i.test(
            bullet
          );

        const issues: string[] = [];
        if (isWeakStart) {
          issues.push('Starts with passive/weak phrasing ("Responsible for / Worked on")');
        } else if (!hasActionVerb) {
          issues.push(`Start with a strong past-tense action verb instead of "${words[0]}"`);
        }
        if (!hasMetric) {
          issues.push('Add quantifiable impact (%, $, latency, scale, or team size)');
        }
        if (words.length < 8) {
          issues.push('Too brief (< 8 words) — add context + outcome');
        } else if (words.length > 38) {
          issues.push('Too long (> 38 words) — split or tighten for recruiter skimmability');
        }

        bulletAudits.push({
          section: secName,
          entryTitle: String(entryTitle),
          bullet,
          hasActionVerb,
          hasMetric,
          wordCount: words.length,
          issues,
        });
      }
    }
  }

  const totalBullets = bulletAudits.length;
  const quantifiedCount = bulletAudits.filter((b) => b.hasMetric).length;
  const actionVerbCount = bulletAudits.filter((b) => b.hasActionVerb).length;
  const quantifiedRatio = totalBullets > 0 ? Math.round((quantifiedCount / totalBullets) * 100) : 0;
  const actionVerbRatio = totalBullets > 0 ? Math.round((actionVerbCount / totalBullets) * 100) : 0;

  // Action Verb check (15 pts)
  const verbScore =
    totalBullets === 0 ? 0 : Math.min(15, Math.round((actionVerbRatio / 85) * 15));
  checks.push({
    id: 'action-verbs',
    category: 'content',
    title: 'Strong Action Verb Lead-Ins',
    status: actionVerbRatio >= 80 ? 'pass' : actionVerbRatio >= 55 ? 'warn' : 'fail',
    score: verbScore,
    maxScore: 15,
    detail: `${actionVerbCount} of ${totalBullets} accomplishment bullets (${actionVerbRatio}%) begin with strong action verbs.`,
  });

  // Quantified Impact check (15 pts)
  const metricScore =
    totalBullets === 0 ? 0 : Math.min(15, Math.round((quantifiedRatio / 60) * 15));
  checks.push({
    id: 'quantified-impact',
    category: 'content',
    title: 'Quantified Business & Engineering Impact',
    status: quantifiedRatio >= 50 ? 'pass' : quantifiedRatio >= 30 ? 'warn' : 'fail',
    score: metricScore,
    maxScore: 15,
    detail: `${quantifiedCount} of ${totalBullets} bullets (${quantifiedRatio}%) include measurable metrics (%, $, scale, time saved). Target is 50%+.`,
  });

  const impactScore = verbScore + metricScore; // max 30

  // --- 3. JOB DESCRIPTION KEYWORD MATCHING (40 pts) ---
  const hasJD = Boolean(jdText && jdText.trim().length > 20);
  const cvLower = cvYaml.toLowerCase();
  let keywordScore = 0;
  let keywords: KeywordAnalysis = {
    matched: [],
    missing: [],
    matchRate: 0,
    allExtracted: [],
  };

  if (hasJD) {
    const extracted = extractKeywordsFromJD(jdText);
    const matched: string[] = [];
    const missing: string[] = [];

    for (const kw of extracted) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-z0-9+#.])${escaped}($|[^a-z0-9+#.])`, 'i');
      if (regex.test(cvLower)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const matchRate =
      extracted.length > 0 ? Math.round((matched.length / extracted.length) * 100) : 100;
    keywordScore = Math.min(40, Math.round((matchRate / 85) * 40));
    keywords = {
      matched,
      missing,
      matchRate,
      allExtracted: extracted,
    };

    checks.push({
      id: 'jd-keyword-match',
      category: 'keywords',
      title: 'Job Description Keyword & Skill Alignment',
      status: matchRate >= 75 ? 'pass' : matchRate >= 45 ? 'warn' : 'fail',
      score: keywordScore,
      maxScore: 40,
      detail: `Matched ${matched.length} of ${extracted.length} core JD skills/keywords (${matchRate}%). ${
        missing.length > 0
          ? `Missing key terms: ${missing.slice(0, 8).join(', ')}.`
          : 'Excellent alignment!'
      }`,
      fixAction:
        missing.length > 0
          ? 'Use AI Tailor to weave missing JD skills into your Experience, Summary, and Skills sections.'
          : undefined,
    });
  } else {
    // Baseline keyword density when no JD is pasted yet
    const baselineSkills = CURATED_SKILL_DICTIONARY.filter((s) => cvLower.includes(s));
    keywordScore = Math.min(40, Math.max(20, baselineSkills.length * 3));
    keywords = {
      matched: baselineSkills.slice(0, 20),
      missing: [],
      matchRate: Math.round((keywordScore / 40) * 100),
      allExtracted: baselineSkills.slice(0, 20),
    };
    checks.push({
      id: 'jd-keyword-match',
      category: 'keywords',
      title: 'Domain & Technical Keyword Density (Paste a JD for exact matching)',
      status: 'warn',
      score: keywordScore,
      maxScore: 40,
      detail: `Detected ${baselineSkills.length} recognized domain/technical keywords in CV. Paste a target Job Description above to unlock exact JD keyword gap analysis and AI tailoring.`,
    });
  }

  const overallScore = Math.min(100, formattingScore + impactScore + keywordScore);

  return {
    overallScore,
    formattingScore,
    impactScore,
    keywordScore,
    hasJD,
    checks,
    bulletAudits,
    quantifiedRatio,
    actionVerbRatio,
    totalBullets,
    keywords,
    parsedCv: parsed,
  };
}
