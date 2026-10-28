import React, { useMemo } from 'react';
import * as yaml from 'js-yaml';
import { ChevronLeft, ChevronRight, RotateCcw, AlertTriangle, Plus, X } from 'lucide-react';
import {
  LOCALE_IDS,
  LOCALE_META,
  THEME_IDS,
  THEME_LABELS,
} from '../data/defaults';

interface DesignFormEditorProps {
  mode: 'design' | 'locale' | 'settings';
  yamlText: string;
  onChangeYaml: (nextYaml: string) => void;
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
  selectedLocale: string;
  onSelectLocale: (localeId: string) => void;
  onResetCurrent: () => void;
}

const FONT_FAMILIES = [
  'Source Sans 3',
  'XCharter',
  'Charter',
  'Raleway',
  'Ubuntu',
  'Gentium Book Plus',
  'Latin Modern Roman',
  'Libertinus Serif',
  'EB Garamond',
  'Open Sans',
  'Roboto',
  'Noto Sans',
  'Mukta',
  'Poppins',
  'Inter',
];

const SECTION_TITLE_TYPES = [
  { value: 'with_partial_line', label: 'Partial Line' },
  { value: 'with_full_line', label: 'Full Line' },
  { value: 'without_line', label: 'Without Line' },
  { value: 'moderncv', label: 'ModernCV Style' },
  { value: 'centered_without_line', label: 'Centered (No Line)' },
  { value: 'centered_with_partial_line', label: 'Centered (Partial Line)' },
  { value: 'centered_with_full_line', label: 'Centered (Full Line)' },
];

/** Convert `rgb(r, g, b)` or `#rrggbb` to `#rrggbb` for `<input type="color" />` */
function colorStringToHex(val: string | undefined): string {
  if (!val) return '#000000';
  const trimmed = String(val).trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (match) {
    const r = Math.max(0, Math.min(255, Number(match[1]))).toString(16).padStart(2, '0');
    const g = Math.max(0, Math.min(255, Number(match[2]))).toString(16).padStart(2, '0');
    const b = Math.max(0, Math.min(255, Number(match[3]))).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#000000';
}

/** Convert `#rrggbb` from `<input type="color" />` to `rgb(r, g, b)` for RenderCV */
function hexToRgbString(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 'rgb(0, 0, 0)';
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  return `rgb(${r}, ${g}, ${b})`;
}

/** Reusable Low-Contrast Row Component matching the clean table layout */
const SettingRow: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="flex items-center justify-between sm:justify-start py-2.5 border-b border-slate-100/90 gap-4">
    <span className="w-40 sm:w-48 shrink-0 text-[13px] font-normal text-slate-500 select-none">
      {label}
    </span>
    <div className="flex-1 flex items-center min-w-0">{children}</div>
  </div>
);

/** Reusable Purple/Violet Toggle Switch */
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-violet-600' : 'bg-slate-200/90'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

/** Reusable Segmented Pill Selector */
const SegmentedPills: React.FC<{
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (val: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="inline-flex items-center gap-1 flex-wrap">
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
            active
              ? 'bg-violet-100/90 text-violet-700 font-medium'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/70 font-normal'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <div className="pt-7 pb-2 border-b border-slate-100 text-[11px] font-medium uppercase tracking-wider text-slate-400 select-none">
    {title}
  </div>
);

export const DesignFormEditor: React.FC<DesignFormEditorProps> = ({
  mode,
  yamlText,
  onChangeYaml,
  selectedTheme,
  onSelectTheme,
  selectedLocale,
  onSelectLocale,
  onResetCurrent,
}) => {
  const parsed = useMemo(() => {
    try {
      const doc: any = yaml.load(yamlText) || {};
      return { doc, error: null };
    } catch (e: any) {
      return { doc: null, error: e?.message || 'Invalid YAML syntax' };
    }
  }, [yamlText]);

  const updateRoot = (rootKey: 'design' | 'locale' | 'settings', mutator: (obj: any) => void) => {
    if (!parsed.doc) return;
    const cloned = JSON.parse(JSON.stringify(parsed.doc));
    if (!cloned[rootKey] || typeof cloned[rootKey] !== 'object') {
      cloned[rootKey] = {};
    }
    mutator(cloned[rootKey]);
    const nextYaml = yaml.dump(cloned, { lineWidth: -1, noRefs: true });
    onChangeYaml(nextYaml);
  };

  if (parsed.error || !parsed.doc) {
    return (
      <div className="p-5 m-4 text-sm text-amber-800 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
        <div className="flex items-center gap-2 font-medium text-amber-800 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          YAML Syntax Issue Detected
        </div>
        <p className="text-amber-700 font-mono text-xs bg-white/80 p-2.5 rounded-lg border border-amber-200/60 mt-2">
          {parsed.error}
        </p>
        <p className="mt-2.5 text-xs text-amber-700/80">
          Toggle <strong>YAML</strong> in the top right to fix the syntax or click Reset.
        </p>
      </div>
    );
  }

  const inlineInputClass =
    'w-full max-w-[240px] px-2 py-1 text-[13px] font-normal text-slate-600 bg-transparent hover:bg-slate-50 focus:bg-slate-50/90 rounded-md border border-transparent focus:border-slate-200 focus:outline-none transition';

  // ============================================================================
  // 1. DESIGN VISUAL EDITOR
  // ============================================================================
  if (mode === 'design') {
    const d = parsed.doc.design || {};
    const page = d.page || {};
    const colors = d.colors || {};
    const typography = d.typography || {};
    const fontFamily = typography.font_family || {};
    const fontSize = typography.font_size || {};
    const bold = typography.bold || {};
    const smallCaps = typography.small_caps || {};
    const links = d.links || {};
    const header = d.header || {};
    const headerConnections = header.connections || {};
    const sectionTitles = d.section_titles || {};
    const sections = d.sections || {};
    const entries = d.entries || {};
    const highlights = entries.highlights || {};
    const templates = d.templates || {};

    const themeIdx = Math.max(0, THEME_IDS.indexOf(selectedTheme));
    const prevTheme = THEME_IDS[(themeIdx - 1 + THEME_IDS.length) % THEME_IDS.length];
    const nextTheme = THEME_IDS[(themeIdx + 1) % THEME_IDS.length];

    const COLOR_FIELDS: Array<{ key: string; label: string; fallback: string }> = [
      { key: 'body', label: 'Body', fallback: 'rgb(55, 65, 81)' },
      { key: 'name', label: 'Name', fallback: 'rgb(30, 41, 59)' },
      { key: 'headline', label: 'Headline', fallback: 'rgb(55, 65, 81)' },
      { key: 'connections', label: 'Connections', fallback: 'rgb(71, 85, 105)' },
      { key: 'section_titles', label: 'Section Titles', fallback: 'rgb(30, 41, 59)' },
      { key: 'links', label: 'Links', fallback: 'rgb(30, 41, 59)' },
      { key: 'footer', label: 'Footer', fallback: 'rgb(128, 128, 128)' },
      { key: 'top_note', label: 'Top Note', fallback: 'rgb(128, 128, 128)' },
    ];

    return (
      <div className="h-full overflow-y-auto bg-white px-5 sm:px-9 py-6 text-slate-600">
        <div className="max-w-3xl">
          {/* Theme Stepper Row */}
          <div className="flex items-center justify-between py-2.5 border-b border-slate-100/90 gap-4">
            <span className="w-40 sm:w-48 shrink-0 text-[13px] font-normal text-slate-500">
              Theme
            </span>
            <div className="flex-1 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTheme(prevTheme)}
                  title="Previous Theme"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select
                  value={selectedTheme}
                  onChange={(e) => onSelectTheme(e.target.value)}
                  className="min-w-[140px] text-center text-[13px] font-normal text-slate-700 bg-transparent hover:bg-slate-50 px-2 py-1 rounded-md focus:outline-none cursor-pointer appearance-none"
                >
                  {THEME_IDS.map((tId) => (
                    <option key={tId} value={tId}>
                      {THEME_LABELS[tId] || tId}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onSelectTheme(nextTheme)}
                  title="Next Theme"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={onResetCurrent}
                title="Reset theme design to defaults"
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* PAGE SECTION */}
          <SectionHeading title="PAGE" />

          <SettingRow label="Page Size">
            <SegmentedPills
              value={page.size || 'us-letter'}
              options={[
                { value: 'a4', label: 'A4' },
                { value: 'us-letter', label: 'US Letter' },
              ]}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), size: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Top Margin">
            <input
              type="text"
              value={page.top_margin ?? '0.5in'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), top_margin: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Bottom Margin">
            <input
              type="text"
              value={page.bottom_margin ?? '0.5in'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), bottom_margin: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Left Margin">
            <input
              type="text"
              value={page.left_margin ?? '0.5in'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), left_margin: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Right Margin">
            <input
              type="text"
              value={page.right_margin ?? '0.5in'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), right_margin: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Show Footer">
            <ToggleSwitch
              checked={Boolean(page.show_footer ?? true)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), show_footer: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Show Top Note">
            <ToggleSwitch
              checked={Boolean(page.show_top_note ?? false)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.page = { ...(obj.page || {}), show_top_note: val };
                })
              }
            />
          </SettingRow>

          {/* COLORS SECTION */}
          <SectionHeading title="COLORS" />

          {COLOR_FIELDS.map(({ key, label, fallback }) => {
            const rawVal = colors[key] ?? fallback;
            const hexVal = colorStringToHex(rawVal);
            return (
              <SettingRow key={key} label={label}>
                <div className="flex items-center gap-3">
                  <label
                    className="relative w-5 h-5 rounded-full border border-slate-200 shadow-2xs cursor-pointer shrink-0 overflow-hidden"
                    style={{ backgroundColor: hexVal }}
                  >
                    <input
                      type="color"
                      value={hexVal}
                      onChange={(e) => {
                        const rgb = hexToRgbString(e.target.value);
                        updateRoot('design', (obj) => {
                          obj.colors = { ...(obj.colors || {}), [key]: rgb };
                        });
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </label>
                  <input
                    type="text"
                    value={rawVal}
                    onChange={(e) =>
                      updateRoot('design', (obj) => {
                        obj.colors = { ...(obj.colors || {}), [key]: e.target.value };
                      })
                    }
                    className="w-44 px-1.5 py-1 text-[13px] font-mono text-slate-600 bg-transparent hover:bg-slate-50 focus:bg-slate-50 rounded-md border border-transparent focus:border-slate-200 focus:outline-none transition"
                  />
                </div>
              </SettingRow>
            );
          })}

          {/* TYPOGRAPHY SECTION */}
          <SectionHeading title="TYPOGRAPHY" />

          <SettingRow label="Line Spacing">
            <input
              type="text"
              value={typography.line_spacing ?? '0.6em'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.typography = { ...(obj.typography || {}), line_spacing: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Alignment">
            <SegmentedPills
              value={typography.alignment || 'justified'}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'justified', label: 'Justified' },
                { value: 'justified-with-no-hyphenation', label: 'Justified (No Hyphen)' },
              ]}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.typography = { ...(obj.typography || {}), alignment: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Date & Location Align">
            <SegmentedPills
              value={typography.date_and_location_column_alignment || 'right'}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.typography = {
                    ...(obj.typography || {}),
                    date_and_location_column_alignment: val,
                  };
                })
              }
            />
          </SettingRow>

          {(
            [
              ['body', 'Body Font'],
              ['name', 'Name Font'],
              ['headline', 'Headline Font'],
              ['connections', 'Connections Font'],
              ['section_titles', 'Section Titles Font'],
            ] as const
          ).map(([fKey, fLabel]) => {
            const currentFont =
              typeof fontFamily === 'string' ? fontFamily : fontFamily[fKey] || 'Source Sans 3';
            return (
              <SettingRow key={fKey} label={fLabel}>
                <select
                  value={currentFont}
                  onChange={(e) =>
                    updateRoot('design', (obj) => {
                      const prevFf =
                        typeof obj.typography?.font_family === 'object'
                          ? obj.typography.font_family
                          : {};
                      obj.typography = {
                        ...(obj.typography || {}),
                        font_family: { ...prevFf, [fKey]: e.target.value },
                      };
                    })
                  }
                  className="px-2 py-1 text-[13px] font-normal text-slate-600 bg-transparent hover:bg-slate-50 rounded-md border border-transparent focus:border-slate-200 focus:outline-none cursor-pointer"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                  {!FONT_FAMILIES.includes(currentFont) && (
                    <option value={currentFont}>{currentFont}</option>
                  )}
                </select>
              </SettingRow>
            );
          })}

          {(
            [
              ['body', 'Body Font Size', '10pt'],
              ['name', 'Name Font Size', '25pt'],
              ['headline', 'Headline Font Size', '10pt'],
              ['connections', 'Connections Font Size', '10pt'],
              ['section_titles', 'Section Titles Size', '1.3em'],
            ] as const
          ).map(([sKey, sLabel, fallback]) => (
            <SettingRow key={sKey} label={sLabel}>
              <input
                type="text"
                value={fontSize[sKey] ?? fallback}
                onChange={(e) =>
                  updateRoot('design', (obj) => {
                    obj.typography = {
                      ...(obj.typography || {}),
                      font_size: { ...(obj.typography?.font_size || {}), [sKey]: e.target.value },
                    };
                  })
                }
                className={inlineInputClass}
              />
            </SettingRow>
          ))}

          {(
            [
              ['name', 'Bold Name'],
              ['headline', 'Bold Headline'],
              ['connections', 'Bold Connections'],
              ['section_titles', 'Bold Section Titles'],
            ] as const
          ).map(([bKey, bLabel]) => (
            <SettingRow key={bKey} label={bLabel}>
              <ToggleSwitch
                checked={Boolean(bold[bKey] ?? false)}
                onChange={(val) =>
                  updateRoot('design', (obj) => {
                    obj.typography = {
                      ...(obj.typography || {}),
                      bold: { ...(obj.typography?.bold || {}), [bKey]: val },
                    };
                  })
                }
              />
            </SettingRow>
          ))}

          {(
            [
              ['name', 'Small Caps Name'],
              ['headline', 'Small Caps Headline'],
              ['connections', 'Small Caps Connections'],
              ['section_titles', 'Small Caps Titles'],
            ] as const
          ).map(([scKey, scLabel]) => (
            <SettingRow key={scKey} label={scLabel}>
              <ToggleSwitch
                checked={Boolean(smallCaps[scKey] ?? false)}
                onChange={(val) =>
                  updateRoot('design', (obj) => {
                    obj.typography = {
                      ...(obj.typography || {}),
                      small_caps: { ...(obj.typography?.small_caps || {}), [scKey]: val },
                    };
                  })
                }
              />
            </SettingRow>
          ))}

          {/* HEADER SECTION */}
          <SectionHeading title="HEADER" />

          <SettingRow label="Header Alignment">
            <SegmentedPills
              value={header.alignment || 'center'}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.header = { ...(obj.header || {}), alignment: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Space Below Name">
            <input
              type="text"
              value={header.space_below_name ?? '0.7cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.header = { ...(obj.header || {}), space_below_name: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Space Below Headline">
            <input
              type="text"
              value={header.space_below_headline ?? '0.7cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.header = { ...(obj.header || {}), space_below_headline: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Space Below Connections">
            <input
              type="text"
              value={header.space_below_connections ?? '0.7cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.header = { ...(obj.header || {}), space_below_connections: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Phone Format">
            <SegmentedPills
              value={headerConnections.phone_number_format || 'national'}
              options={[
                { value: 'national', label: 'National' },
                { value: 'international', label: 'International' },
                { value: 'e164', label: 'E164' },
              ]}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.header = {
                    ...(obj.header || {}),
                    connections: { ...(obj.header?.connections || {}), phone_number_format: val },
                  };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Show Connection Icons">
            <ToggleSwitch
              checked={Boolean(headerConnections.show_icons ?? true)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.header = {
                    ...(obj.header || {}),
                    connections: { ...(obj.header?.connections || {}), show_icons: val },
                  };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Hyperlink Connections">
            <ToggleSwitch
              checked={Boolean(headerConnections.hyperlink ?? true)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.header = {
                    ...(obj.header || {}),
                    connections: { ...(obj.header?.connections || {}), hyperlink: val },
                  };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Display Full URLs">
            <ToggleSwitch
              checked={Boolean(headerConnections.display_urls_instead_of_usernames ?? false)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.header = {
                    ...(obj.header || {}),
                    connections: {
                      ...(obj.header?.connections || {}),
                      display_urls_instead_of_usernames: val,
                    },
                  };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Space Between Links">
            <input
              type="text"
              value={headerConnections.space_between_connections ?? '0.5cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.header = {
                    ...(obj.header || {}),
                    connections: {
                      ...(obj.header?.connections || {}),
                      space_between_connections: e.target.value,
                    },
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          {/* LINKS SECTION */}
          <SectionHeading title="LINKS" />

          <SettingRow label="Underline Links">
            <ToggleSwitch
              checked={Boolean(links.underline ?? false)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.links = { ...(obj.links || {}), underline: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="External Link Icon">
            <ToggleSwitch
              checked={Boolean(links.show_external_link_icon ?? false)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.links = { ...(obj.links || {}), show_external_link_icon: val };
                })
              }
            />
          </SettingRow>

          {/* SECTION TITLES */}
          <SectionHeading title="SECTION TITLES" />

          <SettingRow label="Title Style">
            <select
              value={sectionTitles.type || 'with_partial_line'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.section_titles = { ...(obj.section_titles || {}), type: e.target.value };
                })
              }
              className="px-2 py-1 text-[13px] font-normal text-slate-600 bg-transparent hover:bg-slate-50 rounded-md border border-transparent focus:border-slate-200 focus:outline-none cursor-pointer"
            >
              {SECTION_TITLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow label="Line Thickness">
            <input
              type="text"
              value={sectionTitles.line_thickness ?? '0.5pt'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.section_titles = {
                    ...(obj.section_titles || {}),
                    line_thickness: e.target.value,
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Space Above Title">
            <input
              type="text"
              value={sectionTitles.space_above ?? '0.5cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.section_titles = {
                    ...(obj.section_titles || {}),
                    space_above: e.target.value,
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Space Below Title">
            <input
              type="text"
              value={sectionTitles.space_below ?? '0.3cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.section_titles = {
                    ...(obj.section_titles || {}),
                    space_below: e.target.value,
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          {/* SECTIONS & ENTRIES */}
          <SectionHeading title="SECTIONS & ENTRIES" />

          <SettingRow label="Allow Section Breaks">
            <ToggleSwitch
              checked={Boolean(sections.allow_page_break ?? true)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.sections = { ...(obj.sections || {}), allow_page_break: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Space Between Entries">
            <input
              type="text"
              value={sections.space_between_regular_entries ?? '1.2em'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.sections = {
                    ...(obj.sections || {}),
                    space_between_regular_entries: e.target.value,
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Space Between Text">
            <input
              type="text"
              value={sections.space_between_text_based_entries ?? '0.3em'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.sections = {
                    ...(obj.sections || {}),
                    space_between_text_based_entries: e.target.value,
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Date Column Width">
            <input
              type="text"
              value={entries.date_and_location_width ?? '4.15cm'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.entries = {
                    ...(obj.entries || {}),
                    date_and_location_width: e.target.value,
                  };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>

          <SettingRow label="Allow Entry Page Break">
            <ToggleSwitch
              checked={Boolean(entries.allow_page_break ?? false)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.entries = { ...(obj.entries || {}), allow_page_break: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Short Second Row">
            <ToggleSwitch
              checked={Boolean(entries.short_second_row ?? false)}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.entries = { ...(obj.entries || {}), short_second_row: val };
                })
              }
            />
          </SettingRow>

          <SettingRow label="Bullet Character">
            <SegmentedPills
              value={highlights.bullet || '•'}
              options={[
                { value: '•', label: '•' },
                { value: '●', label: '●' },
                { value: '◆', label: '◆' },
                { value: '◦', label: '◦' },
                { value: '-', label: '-' },
                { value: '▸', label: '▸' },
              ]}
              onChange={(val) =>
                updateRoot('design', (obj) => {
                  obj.entries = {
                    ...(obj.entries || {}),
                    highlights: { ...(obj.entries?.highlights || {}), bullet: val },
                  };
                })
              }
            />
          </SettingRow>

          {/* TEMPLATES */}
          <SectionHeading title="TEMPLATES" />

          <SettingRow label="Footer Text">
            <input
              type="text"
              value={templates.footer ?? '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.templates = { ...(obj.templates || {}), footer: e.target.value };
                })
              }
              className="w-full max-w-md px-2 py-1 text-[13px] font-normal text-slate-600 bg-transparent hover:bg-slate-50 focus:bg-slate-50 rounded-md border border-transparent focus:border-slate-200 focus:outline-none transition"
            />
          </SettingRow>

          <SettingRow label="Top Note Text">
            <input
              type="text"
              value={templates.top_note ?? '*LAST_UPDATED CURRENT_DATE*'}
              onChange={(e) =>
                updateRoot('design', (obj) => {
                  obj.templates = { ...(obj.templates || {}), top_note: e.target.value };
                })
              }
              className="w-full max-w-md px-2 py-1 text-[13px] font-normal text-slate-600 bg-transparent hover:bg-slate-50 focus:bg-slate-50 rounded-md border border-transparent focus:border-slate-200 focus:outline-none transition"
            />
          </SettingRow>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. LOCALE VISUAL EDITOR
  // ============================================================================
  if (mode === 'locale') {
    const loc = parsed.doc.locale || {};
    const phrases = loc.phrases || {};
    const locIdx = Math.max(0, LOCALE_IDS.indexOf(selectedLocale));
    const prevLoc = LOCALE_IDS[(locIdx - 1 + LOCALE_IDS.length) % LOCALE_IDS.length];
    const nextLoc = LOCALE_IDS[(locIdx + 1) % LOCALE_IDS.length];

    return (
      <div className="h-full overflow-y-auto bg-white px-5 sm:px-9 py-6 text-slate-600">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between py-2.5 border-b border-slate-100/90 gap-4">
            <span className="w-40 sm:w-48 shrink-0 text-[13px] font-normal text-slate-500">
              Language
            </span>
            <div className="flex-1 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectLocale(prevLoc)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select
                  value={selectedLocale}
                  onChange={(e) => onSelectLocale(e.target.value)}
                  className="min-w-[160px] text-center text-[13px] font-normal text-slate-700 bg-transparent hover:bg-slate-50 px-2 py-1 rounded-md focus:outline-none cursor-pointer appearance-none"
                >
                  {LOCALE_IDS.map((lId) => (
                    <option key={lId} value={lId}>
                      {LOCALE_META[lId]?.flag} {LOCALE_META[lId]?.name || lId}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onSelectLocale(nextLoc)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={onResetCurrent}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          <SectionHeading title="LABELS & TRANSLATIONS" />

          {(
            [
              ['last_updated', 'Last Updated Phrase', 'Last updated in'],
              ['present', 'Present Keyword', 'present'],
              ['month', 'Month (Singular)', 'month'],
              ['months', 'Months (Plural)', 'months'],
              ['year', 'Year (Singular)', 'year'],
              ['years', 'Years (Plural)', 'years'],
            ] as const
          ).map(([lKey, lLabel, fallback]) => (
            <SettingRow key={lKey} label={lLabel}>
              <input
                type="text"
                value={loc[lKey] ?? fallback}
                onChange={(e) =>
                  updateRoot('locale', (obj) => {
                    obj[lKey] = e.target.value;
                  })
                }
                className={inlineInputClass}
              />
            </SettingRow>
          ))}

          <SettingRow label="Degree With Area">
            <input
              type="text"
              value={phrases.degree_with_area ?? 'DEGREE in AREA'}
              onChange={(e) =>
                updateRoot('locale', (obj) => {
                  obj.phrases = { ...(obj.phrases || {}), degree_with_area: e.target.value };
                })
              }
              className={inlineInputClass}
            />
          </SettingRow>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. SETTINGS VISUAL EDITOR
  // ============================================================================
  const s = parsed.doc.settings || {};
  const boldKeywords: string[] = Array.isArray(s.bold_keywords) ? s.bold_keywords : [];

  return (
    <div className="h-full overflow-y-auto bg-white px-5 sm:px-9 py-6 text-slate-600">
      <div className="max-w-3xl">
        <SectionHeading title="GENERAL SETTINGS" />

        <SettingRow label="Current Date">
          <input
            type="text"
            value={s.current_date ?? 'today'}
            placeholder="today or YYYY-MM-DD"
            onChange={(e) =>
              updateRoot('settings', (obj) => {
                obj.current_date = e.target.value;
              })
            }
            className={inlineInputClass}
          />
        </SettingRow>

        <SettingRow label="PDF Document Title">
          <input
            type="text"
            value={s.pdf_title ?? 'NAME - CV'}
            onChange={(e) =>
              updateRoot('settings', (obj) => {
                obj.pdf_title = e.target.value;
              })
            }
            className="w-full max-w-md px-2 py-1 text-[13px] font-normal text-slate-600 bg-transparent hover:bg-slate-50 focus:bg-slate-50 rounded-md border border-transparent focus:border-slate-200 focus:outline-none transition"
          />
        </SettingRow>

        <SectionHeading title="AUTOMATIC BOLD KEYWORDS" />
        <div className="py-3 space-y-3">
          <p className="text-xs text-slate-400">
            Words or phrases listed below will automatically be bolded across your resume entries.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {boldKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-600"
              >
                {kw}
                <button
                  type="button"
                  onClick={() =>
                    updateRoot('settings', (obj) => {
                      const next = [...boldKeywords];
                      next.splice(idx, 1);
                      obj.bold_keywords = next;
                    })
                  }
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                const word = window.prompt('Enter keyword to auto-bold (e.g., TypeScript, AWS):');
                if (word && word.trim()) {
                  updateRoot('settings', (obj) => {
                    obj.bold_keywords = [...boldKeywords, word.trim()];
                  });
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-violet-50 text-violet-600 hover:bg-violet-100 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add Keyword
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
