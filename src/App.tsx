import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import {
  FileText,
  Code2,
  Sparkles,
  Download,
  Plus,
  Copy,
  Trash2,
  Palette,
  Globe,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Upload,
  GitCompare,
  Edit3,
  Eye,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  User as UserIcon,
  Cloud,
} from 'lucide-react';
import {
  DEFAULT_CV_TEMPLATE,
  generateUUID,
  LOCALE_IDS,
  LOCALE_META,
  LOCALE_YAMLS,
  THEME_DESIGNS,
  THEME_IDS,
  THEME_LABELS,
} from './data/defaults';
import { type RenderCVError, renderPipeline, type RenderSections } from './services/renderer';
import { analyzeATS } from './services/atsAnalyzer';
import { FormEditor } from './components/FormEditor';
import { DesignFormEditor } from './components/DesignFormEditor';
import { AtsAndTailorPanel } from './components/AtsAndTailorPanel';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { BrandLogo } from './components/BrandLogo';
import {
  type AuthUser,
  clearAuthSession,
  deleteResumeFromCloud,
  fetchCurrentUser,
  fetchUserResumes,
  getAuthToken,
  getStoredUser,
  saveResumeToCloud,
  syncAllResumesToCloud,
} from './services/api';

export interface CVFile {
  id: string;
  name: string;
  cv: string;
  settings: string;
  designs: Record<string, string>;
  locales: Record<string, string>;
  selectedTheme: string;
  selectedLocale: string;
  reviewBaseline?: Partial<RenderSections>;
  lastEdited: number;
}

const STORAGE_KEY = 'rendercv_guest_files_v2';
const AUTO_COLLAPSE_BREAKPOINT = 1180; // Automatically collapse sidebar below 1180px
const MOBILE_BREAKPOINT = 768; // Switch to single-pane + bottom nav below 768px

function getCleanStarterCvYaml(): string {
  // Remove the internal "Welcome to RenderCV" instructional boilerplate from the starter template
  return DEFAULT_CV_TEMPLATE.cv.replace(
    /\s+Welcome to RenderCV:[\s\S]*?(?=\s+education:)/,
    '\n    summary:\n      - Results-driven software & AI engineer with a strong track record of building scalable full-stack and machine learning systems.\n'
  );
}

function createDefaultFile(name = 'My Resume'): CVFile {
  return {
    id: generateUUID(),
    name,
    cv: getCleanStarterCvYaml(),
    settings: DEFAULT_CV_TEMPLATE.settings,
    designs: { classic: DEFAULT_CV_TEMPLATE.design },
    locales: { english: DEFAULT_CV_TEMPLATE.locale },
    selectedTheme: 'classic',
    selectedLocale: 'english',
    reviewBaseline: {},
    lastEdited: Date.now(),
  };
}

function getResolvedSections(file: CVFile): RenderSections {
  return {
    cv: file.cv || DEFAULT_CV_TEMPLATE.cv,
    design:
      file.designs?.[file.selectedTheme] ||
      THEME_DESIGNS[file.selectedTheme] ||
      `design:\n  theme: ${file.selectedTheme}\n`,
    locale:
      file.locales?.[file.selectedLocale] ||
      LOCALE_YAMLS[file.selectedLocale] ||
      `locale:\n  language: ${file.selectedLocale}\n`,
    settings: file.settings || DEFAULT_CV_TEMPLATE.settings,
  };
}

export function App() {
  const [files, setFiles] = useState<CVFile[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [createDefaultFile()];
  });

  const [selectedFileId, setSelectedFileId] = useState<string>(() => files[0]?.id || '');
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= AUTO_COLLAPSE_BREAKPOINT : true
  );
  const [desktopPreviewOpen, setDesktopPreviewOpen] = useState<boolean>(true);
  // Split ratio (% width of the right preview pane on md+ screens)
  const [previewWidthPct, setPreviewWidthPct] = useState<number>(46);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // Active tab ('preview' is used on <768px mobile screens or when split preview is toggled off)
  const [activeTab, setActiveTab] = useState<'form' | 'yaml' | 'ats' | 'preview'>('form');
  const [activeYamlSubTab, setActiveYamlSubTab] = useState<keyof RenderSections>('design');
  const [showYamlDiff, setShowYamlDiff] = useState(false);

  const [jdText, setJdText] = useState<string>(() => {
    return localStorage.getItem('rendercv_target_jd') || '';
  });

  // Rendering state
  const [svgPages, setSvgPages] = useState<string[]>([]);
  const [renderErrors, setRenderErrors] = useState<RenderCVError[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  // Multi-user Auth & MongoDB Cloud Sync state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());
  const [showLoginPage, setShowLoginPage] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/login') return true;
    return !getAuthToken();
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>(
    'idle'
  );

  // Measure preview container width so pages always fit any screen cleanly
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const [previewContainerWidth, setPreviewContainerWidth] = useState<number>(560);
  const mainBodyRef = useRef<HTMLDivElement | null>(null);
  const prevWidthRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const renderCounterRef = useRef(0);

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
  const isCompactScreen = windowWidth < AUTO_COLLAPSE_BREAKPOINT;

  // Automatically collapse sidebar when crossing below AUTO_COLLAPSE_BREAKPOINT,
  // and automatically expand when resizing back to wide desktop (>= AUTO_COLLAPSE_BREAKPOINT)
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const prevW = prevWidthRef.current;
      setWindowWidth(w);

      if (w < AUTO_COLLAPSE_BREAKPOINT && prevW >= AUTO_COLLAPSE_BREAKPOINT) {
        setSidebarOpen(false);
      } else if (w >= AUTO_COLLAPSE_BREAKPOINT && prevW < AUTO_COLLAPSE_BREAKPOINT) {
        setSidebarOpen(true);
      }

      // If transitioning from mobile (<768) to tablet/desktop (>=768) while on 'preview' tab,
      // switch active editor tab back to 'ats' since preview is already visible side-by-side
      if (w >= MOBILE_BREAKPOINT && prevW < MOBILE_BREAKPOINT) {
        setActiveTab((prev) => (prev === 'preview' ? 'ats' : prev));
      }

      prevWidthRef.current = w;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Observe the PDF preview container width for exact responsive page fitting
  useEffect(() => {
    const el = previewScrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) {
          setPreviewContainerWidth(w);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeTab, desktopPreviewOpen, sidebarOpen, windowWidth]);

  // Handle split pane dragging
  useEffect(() => {
    if (!isDraggingSplit) return;
    const handlePointerMove = (e: PointerEvent) => {
      if (!mainBodyRef.current) return;
      const rect = mainBodyRef.current.getBoundingClientRect();
      const rightWidth = rect.right - e.clientX;
      const pct = Math.max(30, Math.min(65, Math.round((rightWidth / rect.width) * 100)));
      setPreviewWidthPct(pct);
    };
    const handlePointerUp = () => {
      setIsDraggingSplit(false);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingSplit]);

  const activeFile = useMemo(
    () => files.find((f) => f.id === selectedFileId) || files[0],
    [files, selectedFileId]
  );

  const sections = useMemo(() => getResolvedSections(activeFile), [activeFile]);

  const atsSummary = useMemo(
    () => analyzeATS(sections.cv, sections.design, jdText),
    [sections.cv, sections.design, jdText]
  );

  // Load existing user session on mount
  useEffect(() => {
    if (getAuthToken()) {
      fetchCurrentUser()
        .then(async (user) => {
          setCurrentUser(user);
          const cloudResumes = await fetchUserResumes();
          if (cloudResumes.length > 0) {
            setFiles(cloudResumes);
            setSelectedFileId(cloudResumes[0].id);
            if (cloudResumes[0].targetJd) {
              setJdText(cloudResumes[0].targetJd);
            }
            setCloudSyncStatus('saved');
          } else {
            const synced = await syncAllResumesToCloud(files, jdText);
            if (synced.length > 0) setCloudSyncStatus('saved');
          }
        })
        .catch(() => {
          // token expired
        });
    }
  }, []);

  // Debounced auto-save of active resume to MongoDB when user is logged in
  useEffect(() => {
    if (!currentUser || !getAuthToken() || !activeFile) return;
    setCloudSyncStatus('syncing');
    const timer = setTimeout(async () => {
      try {
        await saveResumeToCloud(activeFile, jdText);
        setCloudSyncStatus('saved');
      } catch {
        setCloudSyncStatus('error');
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [activeFile, jdText, currentUser]);

  const handleAuthSuccess = async (user: AuthUser) => {
    setCurrentUser(user);
    setShowLoginPage(false);
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      window.history.pushState({}, '', '/');
    }
    setCloudSyncStatus('syncing');
    try {
      const existingCloud = await fetchUserResumes();
      if (existingCloud.length > 0) {
        setFiles(existingCloud);
        setSelectedFileId(existingCloud[0].id);
        if (existingCloud[0].targetJd) setJdText(existingCloud[0].targetJd);
      } else {
        const seeded = await syncAllResumesToCloud([createDefaultFile(`${user.name} — CV`)], jdText);
        if (seeded.length > 0) {
          setFiles(seeded);
          setSelectedFileId(seeded[0].id);
        }
      }
      setCloudSyncStatus('saved');
    } catch {
      setCloudSyncStatus('error');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setCloudSyncStatus('idle');
    const fresh = createDefaultFile();
    setFiles([fresh]);
    setSelectedFileId(fresh.id);
    setShowLoginPage(true);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/login');
    }
  };

  // Persist files & JD
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch {
      // ignore
    }
  }, [files]);

  useEffect(() => {
    try {
      localStorage.setItem('rendercv_target_jd', jdText);
    } catch {
      // ignore
    }
  }, [jdText]);

  // Debounced Pyodide + Typst WASM rendering
  useEffect(() => {
    const currentJob = ++renderCounterRef.current;
    const timer = setTimeout(async () => {
      setIsRendering(true);
      try {
        const result = await renderPipeline.renderToSvg(sections);
        if (renderCounterRef.current !== currentJob) return;
        setRenderErrors(result.errors);
        if (result.errors.length === 0) {
          setSvgPages(result.svgs);
        }
      } catch (err: any) {
        if (renderCounterRef.current !== currentJob) return;
        setRenderErrors([
          {
            message: err?.message || 'Unexpected rendering error',
            schema_location: null,
            input: null,
            yaml_source: 'cv',
            yaml_location: null,
          },
        ]);
      } finally {
        if (renderCounterRef.current === currentJob) {
          setIsRendering(false);
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [sections]);

  const updateActiveFile = useCallback(
    (updater: (file: CVFile) => CVFile) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === activeFile.id ? { ...updater(f), lastEdited: Date.now() } : f
        )
      );
    },
    [activeFile.id]
  );

  const handleSectionChange = useCallback(
    (secKey: keyof RenderSections, value: string) => {
      updateActiveFile((f) => {
        if (secKey === 'cv') return { ...f, cv: value };
        if (secKey === 'settings') return { ...f, settings: value };
        if (secKey === 'design') {
          return {
            ...f,
            designs: { ...f.designs, [f.selectedTheme]: value },
          };
        }
        if (secKey === 'locale') {
          return {
            ...f,
            locales: { ...f.locales, [f.selectedLocale]: value },
          };
        }
        return f;
      });
    },
    [updateActiveFile]
  );

  const handleThemeChange = (themeId: string) => {
    updateActiveFile((f) => ({
      ...f,
      selectedTheme: themeId,
      designs: {
        ...f.designs,
        [themeId]: f.designs[themeId] || THEME_DESIGNS[themeId],
      },
    }));
  };

  const handleLocaleChange = (localeId: string) => {
    updateActiveFile((f) => ({
      ...f,
      selectedLocale: localeId,
      locales: {
        ...f.locales,
        [localeId]: f.locales[localeId] || LOCALE_YAMLS[localeId],
      },
    }));
  };

  const handleApplyTailoredYaml = (newCvYaml: string, newSettingsYaml?: string) => {
    updateActiveFile((f) => {
      const baseline = { ...(f.reviewBaseline || {}) };
      if (!baseline.cv) {
        baseline.cv = f.cv;
      }
      if (newSettingsYaml && !baseline.settings) {
        baseline.settings = f.settings;
      }
      return {
        ...f,
        cv: newCvYaml,
        settings: newSettingsYaml || f.settings,
        reviewBaseline: baseline,
      };
    });
  };

  const hasReviewBaseline = Boolean(
    activeFile.reviewBaseline && Object.keys(activeFile.reviewBaseline).length > 0
  );

  const handleAcceptReview = () => {
    updateActiveFile((f) => ({
      ...f,
      reviewBaseline: {},
    }));
    setShowYamlDiff(false);
  };

  const handleRevertReview = () => {
    updateActiveFile((f) => ({
      ...f,
      cv: f.reviewBaseline?.cv ?? f.cv,
      settings: f.reviewBaseline?.settings ?? f.settings,
      reviewBaseline: {},
    }));
    setShowYamlDiff(false);
  };

  // Exports
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const pdfBytes = await renderPipeline.exportPdfBytes();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeFile.name.replace(/[^a-z0-9-_]+/gi, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || 'PDF export failed');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadYaml = () => {
    const fullYaml = [sections.cv, sections.design, sections.locale, sections.settings]
      .map((s) => s.trim())
      .join('\n\n');
    const blob = new Blob([fullYaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeFile.name.replace(/[^a-z0-9-_]+/gi, '_')}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportYamlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      if (content.trim()) {
        const imported = createDefaultFile(file.name.replace(/\.(ya?ml)$/i, ''));
        imported.cv = content;
        setFiles((prev) => [imported, ...prev]);
        setSelectedFileId(imported.id);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const atsBadgeColor =
    atsSummary.overallScore >= 80
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : atsSummary.overallScore >= 60
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-rose-100 text-rose-800 border-rose-300';

  const currentCenterTab = activeTab === 'preview' ? 'ats' : activeTab;

  // Compute responsive page width based on measured preview container width and zoom %
  const horizontalPad = windowWidth < 640 ? 20 : 40;
  const baseFitWidth = Math.max(240, Math.min(previewContainerWidth - horizontalPad, 680));
  const computedPageWidth = Math.round(baseFitWidth * (zoom / 100));

  // Render dedicated Full-Screen Login / Register Page when unauthenticated or at /login
  if (showLoginPage) {
    return (
      <LoginPage
        onAuthSuccess={handleAuthSuccess}
        onContinueAsGuest={() => {
          setShowLoginPage(false);
          if (typeof window !== 'undefined' && window.location.pathname === '/login') {
            window.history.pushState({}, '', '/');
          }
        }}
      />
    );
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* Hidden file input for YAML import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml"
        onChange={handleImportYamlFile}
        className="hidden"
      />

      {/* Top Studio Header */}
      <header className="h-14 px-2.5 sm:px-4 border-b border-slate-200/90 bg-white flex items-center justify-between gap-2 shrink-0 z-30 shadow-2xs">
        {/* Left Brand & Collapsible Sidebar Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              sidebarOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Open Resumes & Themes Sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-indigo-600" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-slate-600" />
            )}
            <span className="hidden sm:inline">{sidebarOpen ? 'Hide Menu' : 'Resumes'}</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <BrandLogo size="md" />
            <div className="min-w-0 hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 truncate">
                  BuildCV
                </span>
                <span className="hidden xl:inline-block text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold shrink-0">
                  ATS + AI Studio
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-0.5 hidden lg:block shrink-0" />

          {/* Theme Quick Selector */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeFile.selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              aria-label="Resume Theme"
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer transition"
            >
              {THEME_IDS.map((tId) => (
                <option key={tId} value={tId}>
                  {THEME_LABELS[tId] || tId}
                </option>
              ))}
            </select>
          </div>

          {/* Locale Quick Selector */}
          <div className="hidden 2xl:flex items-center gap-1.5 shrink-0">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeFile.selectedLocale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              aria-label="Resume Language"
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer transition"
            >
              {LOCALE_IDS.map((lId) => (
                <option key={lId} value={lId}>
                  {LOCALE_META[lId]?.flag} {LOCALE_META[lId]?.name || lId}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Mode Switcher (Tablet & Desktop >= 768px) */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('form');
              setActiveYamlSubTab('cv');
            }}
            className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'form' && activeYamlSubTab === 'cv'
                ? 'bg-white text-slate-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-violet-600" />
            CV
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('form');
              setActiveYamlSubTab('design');
            }}
            className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'form' && activeYamlSubTab === 'design'
                ? 'bg-white text-slate-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-violet-600" />
            Design
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('yaml')}
            className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'yaml'
                ? 'bg-white text-slate-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-violet-600" />
            YAML
            {renderErrors.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ats')}
            className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ats'
                ? 'bg-white text-violet-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>ATS & AI</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${atsBadgeColor}`}
            >
              {atsSummary.overallScore}%
            </span>
          </button>

          {/* If user hid the split preview pane on desktop/tablet, show a Full Preview tab */}
          {!desktopPreviewOpen && (
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-white text-violet-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-violet-600" />
              Preview
            </button>
          )}
        </div>

        {/* Right Export & Split Preview Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Compact Theme selector on screens < 1024px */}
          <select
            value={activeFile.selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            aria-label="Resume Theme"
            className="lg:hidden px-2 py-1.5 text-xs font-medium bg-slate-100 border border-slate-200 rounded-xl text-slate-800 max-w-[108px] truncate"
          >
            {THEME_IDS.map((tId) => (
              <option key={tId} value={tId}>
                {THEME_LABELS[tId] || tId}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={isExportingPdf || isRendering || renderErrors.length > 0}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Download</span>
            <span>PDF</span>
          </button>

          {/* Toggle Split Preview Pane Button (Tablet & Desktop >= 768px) */}
          <button
            type="button"
            onClick={() => {
              setDesktopPreviewOpen((v) => {
                const next = !v;
                if (next && activeTab === 'preview') setActiveTab('ats');
                return next;
              });
            }}
            className={`hidden md:flex p-2 rounded-xl border transition cursor-pointer ${
              desktopPreviewOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={desktopPreviewOpen ? 'Collapse Split PDF Preview' : 'Show Split PDF Preview'}
          >
            {desktopPreviewOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>

          {/* Multi-User Account & Cloud Sync Button */}
          <button
            type="button"
            onClick={() => {
              if (currentUser) {
                setAuthModalOpen(true);
              } else {
                setShowLoginPage(true);
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/login');
                }
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              currentUser
                ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign In / Create Account'}
          >
            {currentUser ? (
              <>
                <Cloud
                  className={`w-3.5 h-3.5 ${
                    cloudSyncStatus === 'syncing'
                      ? 'text-indigo-600 animate-pulse'
                      : 'text-emerald-600'
                  }`}
                />
                <span className="hidden sm:inline max-w-[95px] truncate">{currentUser.name}</span>
              </>
            ) : (
              <>
                <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Sign In</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div
        ref={mainBodyRef}
        className={`flex-1 flex min-h-0 relative overflow-hidden ${
          isDraggingSplit ? 'select-none cursor-col-resize' : ''
        }`}
      >
        {/* Backdrop when Sidebar is opened as an overlay drawer on compact/mobile screens (<1180px) */}
        {sidebarOpen && isCompactScreen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px] z-40 transition-opacity"
          />
        )}

        {/* Collapsible Left Sidebar:
            - On compact/small screens (<1180px): Automatically hidden (0px) when closed; smooth slide-over overlay drawer when opened.
            - On wide desktop (>=1180px): Docked full sidebar (w-64) when open, or sleek collapsed mini-rail (w-13) when collapsed! */}
        {sidebarOpen ? (
          <aside
            className={`${
              isCompactScreen
                ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] shadow-2xl'
                : 'relative w-64 xl:w-68 shrink-0'
            } border-r border-slate-200 bg-white flex flex-col transition-all duration-200`}
          >
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                My Resumes ({files.length})
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Import .yaml CV"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const created = createDefaultFile(`Resume ${files.length + 1}`);
                    setFiles((prev) => [created, ...prev]);
                    setSelectedFileId(created.id);
                    if (isCompactScreen) setSidebarOpen(false);
                  }}
                  title="Create New CV"
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  title="Collapse Sidebar"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  {isCompactScreen ? (
                    <X className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {files.map((f) => {
                const isSelected = f.id === activeFile.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSelectedFileId(f.id);
                      if (isCompactScreen) setSidebarOpen(false);
                    }}
                    className={`group px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      {renamingId === f.id ? (
                        <input
                          type="text"
                          autoFocus
                          value={f.name}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setFiles((prev) =>
                              prev.map((item) =>
                                item.id === f.id ? { ...item, name: e.target.value } : item
                              )
                            )
                          }
                          onBlur={() => setRenamingId(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setRenamingId(null)}
                          className="w-full px-2 py-0.5 text-xs bg-white border border-indigo-500 rounded text-slate-900"
                        />
                      ) : (
                        <div className="text-xs font-semibold truncate">{f.name}</div>
                      )}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">
                          {THEME_LABELS[f.selectedTheme] || f.selectedTheme}
                        </span>
                        <span>•</span>
                        <span>{LOCALE_META[f.selectedLocale]?.flag || '🇬🇧'}</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-0.5 transition ${
                        isSelected
                          ? 'opacity-100'
                          : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100'
                      }`}
                    >
                      <button
                        type="button"
                        title="Rename"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(f.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Duplicate CV"
                        onClick={(e) => {
                          e.stopPropagation();
                          const copy: CVFile = {
                            ...JSON.parse(JSON.stringify(f)),
                            id: generateUUID(),
                            name: `${f.name} (Copy)`,
                            lastEdited: Date.now(),
                          };
                          setFiles((prev) => [copy, ...prev]);
                          setSelectedFileId(copy.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {files.length > 1 && (
                        <button
                          type="button"
                          title="Delete CV"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles((prev) => prev.filter((item) => item.id !== f.id));
                            if (currentUser && getAuthToken()) {
                              deleteResumeFromCloud(f.id).catch(() => {});
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Theme Cards & Language in Sidebar Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 space-y-3 overflow-y-auto max-h-[48%]">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  9 Built-In Typst Themes
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {THEME_IDS.map((tId) => (
                    <button
                      key={tId}
                      type="button"
                      onClick={() => handleThemeChange(tId)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left truncate border transition cursor-pointer ${
                        activeFile.selectedTheme === tId
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                          : 'bg-white border-slate-200/90 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {THEME_LABELS[tId] || tId}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Resume Language
                </label>
                <select
                  value={activeFile.selectedLocale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  {LOCALE_IDS.map((lId) => (
                    <option key={lId} value={lId}>
                      {LOCALE_META[lId]?.flag} {LOCALE_META[lId]?.name || lId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        ) : (
          /* Collapsed Desktop Mini-Rail (Visible on >= 1024px when sidebar is collapsed; 0px on small screens) */
          <aside className="hidden lg:flex w-13 border-r border-slate-200 bg-white flex-col items-center py-3 gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              title="Expand Sidebar"
              className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const created = createDefaultFile(`Resume ${files.length + 1}`);
                setFiles((prev) => [created, ...prev]);
                setSelectedFileId(created.id);
              }}
              title="Create New CV"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Import .yaml CV"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>
            <div className="w-6 h-px bg-slate-200 my-0.5" />
            <div className="flex-1 overflow-y-auto flex flex-col items-center gap-1.5 w-full px-1.5">
              {files.map((f, idx) => {
                const isSelected = f.id === activeFile.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFileId(f.id)}
                    title={`${f.name} (${THEME_LABELS[f.selectedTheme] || f.selectedTheme})`}
                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center border transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Pane: Form / YAML / ATS & AI Tailor */}
        <main
          className={`${
            activeTab === 'preview' && (isMobile || !desktopPreviewOpen)
              ? 'hidden'
              : 'flex'
          } flex-1 min-w-0 flex-col bg-slate-50/50 overflow-hidden`}
        >
          {/* Validation Errors Banner (if Pyodide reported schema errors) */}
          {renderErrors.length > 0 && (
            <div className="p-3 bg-rose-50 border-b border-rose-200 space-y-1.5 max-h-36 overflow-y-auto shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                RenderCV Validation Issue ({renderErrors.length})
              </div>
              {renderErrors.map((err, i) => (
                <div key={i} className="text-xs text-rose-700 pl-6 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 border border-rose-200 font-mono text-[10px] font-semibold">
                    {err.yaml_source}.yaml
                    {err.yaml_location ? `:${err.yaml_location[0][0]}` : ''}
                  </span>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Unified Sub-Header Bar: [CV] [Design] [Locale] [Settings] on left + [YAML] toggle switch on right */}
          {(currentCenterTab === 'form' || currentCenterTab === 'yaml') && (
            <div className="h-12 px-4 sm:px-6 border-b border-slate-100 bg-white flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
              <div className="flex items-center gap-1">
                {(
                  [
                    ['cv', 'CV'],
                    ['design', 'Design'],
                    ['locale', 'Locale'],
                    ['settings', 'Settings'],
                  ] as const
                ).map(([subKey, subLabel]) => {
                  const isActive = activeYamlSubTab === subKey;
                  return (
                    <button
                      key={subKey}
                      type="button"
                      onClick={() => setActiveYamlSubTab(subKey)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] transition cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-100/90 text-slate-700 font-medium'
                          : 'text-slate-500 hover:text-slate-700 font-normal'
                      }`}
                    >
                      {subLabel}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {currentCenterTab === 'yaml' && (
                  <>
                    {hasReviewBaseline && activeFile.reviewBaseline?.[activeYamlSubTab] && (
                      <button
                        type="button"
                        onClick={() => setShowYamlDiff((v) => !v)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-normal flex items-center gap-1 border transition cursor-pointer whitespace-nowrap ${
                          showYamlDiff
                            ? 'bg-violet-50 border-violet-200 text-violet-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        {showYamlDiff ? 'Exit Diff' : 'Diff'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleDownloadYaml}
                      className="text-xs font-normal text-slate-400 hover:text-violet-600 cursor-pointer whitespace-nowrap"
                      title="Export YAML file"
                    >
                      Export .yaml
                    </button>
                  </>
                )}

                {/* YAML Toggle Switch (matching the screenshot's top-right YAML switch) */}
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={currentCenterTab === 'yaml'}
                    onClick={() =>
                      setActiveTab(currentCenterTab === 'yaml' ? 'form' : 'yaml')
                    }
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      currentCenterTab === 'yaml' ? 'bg-violet-600' : 'bg-slate-200/90'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        currentCenterTab === 'yaml' ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-normal text-slate-500">YAML</span>
                </label>
              </div>
            </div>
          )}

          {currentCenterTab === 'form' && activeYamlSubTab === 'cv' && (
            <FormEditor
              cvYaml={sections.cv}
              onChangeCvYaml={(next) => handleSectionChange('cv', next)}
            />
          )}

          {currentCenterTab === 'form' && activeYamlSubTab !== 'cv' && (
            <DesignFormEditor
              mode={activeYamlSubTab}
              yamlText={sections[activeYamlSubTab]}
              onChangeYaml={(next) => handleSectionChange(activeYamlSubTab, next)}
              selectedTheme={activeFile.selectedTheme}
              onSelectTheme={handleThemeChange}
              selectedLocale={activeFile.selectedLocale}
              onSelectLocale={handleLocaleChange}
              onResetCurrent={() => {
                if (activeYamlSubTab === 'design') {
                  handleSectionChange(
                    'design',
                    THEME_DESIGNS[activeFile.selectedTheme] || DEFAULT_CV_TEMPLATE.design
                  );
                } else if (activeYamlSubTab === 'locale') {
                  handleSectionChange(
                    'locale',
                    LOCALE_YAMLS[activeFile.selectedLocale] || DEFAULT_CV_TEMPLATE.locale
                  );
                } else if (activeYamlSubTab === 'settings') {
                  handleSectionChange('settings', DEFAULT_CV_TEMPLATE.settings);
                }
              }}
            />
          )}

          {currentCenterTab === 'yaml' && (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <div className="flex-1 min-h-0">
                {showYamlDiff && activeFile.reviewBaseline?.[activeYamlSubTab] ? (
                  <DiffEditor
                    height="100%"
                    language="yaml"
                    theme="light"
                    original={activeFile.reviewBaseline[activeYamlSubTab] || ''}
                    modified={sections[activeYamlSubTab]}
                    options={{
                      minimap: { enabled: false },
                      fontSize: windowWidth < 640 ? 12 : 13,
                      wordWrap: 'on',
                      renderSideBySide: windowWidth >= 900,
                      automaticLayout: true,
                    }}
                  />
                ) : (
                  <Editor
                    height="100%"
                    language="yaml"
                    theme="light"
                    value={sections[activeYamlSubTab]}
                    onChange={(val) => handleSectionChange(activeYamlSubTab, val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: windowWidth < 640 ? 12 : 13,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                      automaticLayout: true,
                      padding: { top: 12 },
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {currentCenterTab === 'ats' && (
            <AtsAndTailorPanel
              cvYaml={sections.cv}
              designYaml={sections.design}
              settingsYaml={sections.settings}
              jdText={jdText}
              onChangeJdText={setJdText}
              onApplyTailoredYaml={handleApplyTailoredYaml}
              hasReviewBaseline={hasReviewBaseline}
              onAcceptReview={handleAcceptReview}
              onRevertReview={handleRevertReview}
            />
          )}
        </main>

        {/* Draggable Split Divider (visible on md+ when split preview is open) */}
        {!isMobile && desktopPreviewOpen && (
          <div
            onPointerDown={() => setIsDraggingSplit(true)}
            title="Drag to resize Editor & Preview panes"
            className="hidden md:flex w-1.5 bg-slate-200/80 hover:bg-indigo-400 active:bg-indigo-600 cursor-col-resize items-center justify-center transition-colors shrink-0 z-10"
          >
            <div className="w-0.5 h-8 rounded-full bg-slate-400/70" />
          </div>
        )}

        {/* Right Pane: Live Typst WASM SVG & PDF Preview
            - Visible side-by-side on all tablet/desktop screens (>= 768px) when desktopPreviewOpen is true!
            - Visible full-width on mobile (< 768px) or when activeTab === 'preview'! */}
        <section
          style={
            !isMobile && desktopPreviewOpen && activeTab !== 'preview'
              ? { width: `${previewWidthPct}%` }
              : undefined
          }
          className={`${
            activeTab === 'preview'
              ? 'flex w-full'
              : !isMobile && desktopPreviewOpen
              ? 'flex'
              : 'hidden'
          } flex-col bg-slate-100 shrink-0 min-h-0 overflow-hidden`}
        >
          {/* Preview Toolbar */}
          <div className="h-11 px-3 sm:px-4 border-b border-slate-200 bg-white flex items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {isRendering ? (
                <span className="flex items-center gap-1.5 text-indigo-600 font-semibold truncate">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 shrink-0" />
                  <span className="truncate">Updating preview...</span>
                </span>
              ) : renderErrors.length > 0 ? (
                <span className="flex items-center gap-1.5 text-rose-600 font-semibold truncate">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Check highlighted fields</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">
                    Live Preview ({svgPages.length} {svgPages.length === 1 ? 'page' : 'pages'})
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                title="Fit Page to Pane (100%)"
              >
                {zoom === 100 ? (
                  <>
                    <Maximize2 className="w-2.5 h-2.5 text-indigo-600" /> Fit
                  </>
                ) : (
                  `${zoom}%`
                )}
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(160, z + 10))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {!isMobile && activeTab === 'preview' && (
                <button
                  type="button"
                  onClick={() => {
                    setDesktopPreviewOpen(true);
                    setActiveTab('ats');
                  }}
                  className="ml-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Restore Split View"
                >
                  <Columns2 className="w-3 h-3" /> Split
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Multi-Page Paper Canvas */}
          <div
            ref={previewScrollRef}
            className="flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-5 preview-canvas-bg"
          >
            {svgPages.length === 0 && isRendering ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center text-center max-w-xs p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Preparing Live Resume Preview
                  </div>
                  <p className="text-xs text-slate-500">
                    Formatting your resume layout and typography...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:gap-8 pb-12 min-h-min">
                {svgPages.map((svgHtml, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${computedPageWidth}px`,
                    }}
                    className="shrink-0 h-auto bg-white rounded-md shadow-lg shadow-slate-300/90 border border-slate-200/90 transition-[width] duration-150 select-text typst-svg-container"
                    dangerouslySetInnerHTML={{ __html: svgHtml }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Dedicated Mobile Bottom Navigation Bar (<768px) */}
      <nav className="md:hidden h-14 bg-white border-t border-slate-200 grid grid-cols-4 items-center px-1 shrink-0 z-20 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'form' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span className="text-[11px]">Form</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('yaml')}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'yaml' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Code2 className="w-4 h-4 mb-0.5" />
          <span className="text-[11px]">YAML</span>
          {renderErrors.length > 0 && (
            <span className="absolute top-1 right-6 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ats')}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'ats' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span
              className={`text-[9px] px-1 py-0.2 rounded-full border font-bold ${atsBadgeColor}`}
            >
              {atsSummary.overallScore}%
            </span>
          </div>
          <span className="text-[11px]">ATS & AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'preview' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 mb-0.5" />
            {svgPages.length > 0 && (
              <span className="text-[9px] px-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {svgPages.length}p
              </span>
            )}
          </div>
          <span className="text-[11px]">Preview</span>
        </button>
      </nav>

      {/* Multi-User Auth & Cloud Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
