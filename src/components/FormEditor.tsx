import React, { useMemo, useState } from 'react';
import * as yaml from 'js-yaml';
import {
  User,
  Briefcase,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  Layers,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react';

interface FormEditorProps {
  cvYaml: string;
  onChangeCvYaml: (nextYaml: string) => void;
  readOnly?: boolean;
}

const SOCIAL_NETWORK_OPTIONS = [
  'LinkedIn',
  'GitHub',
  'GitLab',
  'Google Scholar',
  'ORCID',
  'StackOverflow',
  'X',
  'Mastodon',
  'ResearchGate',
  'YouTube',
  'Telegram',
  'WhatsApp',
];

export const FormEditor: React.FC<FormEditorProps> = ({
  cvYaml,
  onChangeCvYaml,
  readOnly = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    __personal: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
  });
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState<
    'experience' | 'education' | 'projects' | 'skills' | 'bullets'
  >('experience');

  const parsedDoc = useMemo(() => {
    try {
      const doc: any = yaml.load(cvYaml) || { cv: {} };
      if (!doc.cv) doc.cv = {};
      if (!doc.cv.sections) doc.cv.sections = {};
      return { doc, error: null };
    } catch (e: any) {
      return { doc: null, error: e?.message || 'Invalid YAML syntax' };
    }
  }, [cvYaml]);

  const updateDoc = (mutator: (cvObj: any) => void) => {
    if (readOnly || !parsedDoc.doc) return;
    const cloned = JSON.parse(JSON.stringify(parsedDoc.doc));
    if (!cloned.cv) cloned.cv = {};
    if (!cloned.cv.sections) cloned.cv.sections = {};
    mutator(cloned.cv);
    const nextYaml = yaml.dump(cloned, { lineWidth: -1, noRefs: true });
    onChangeCvYaml(nextYaml);
  };

  if (parsedDoc.error || !parsedDoc.doc) {
    return (
      <div className="p-5 m-4 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 font-semibold text-amber-800 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          YAML Syntax Issue Detected
        </div>
        <p className="text-amber-700 font-mono text-xs bg-white/80 p-2.5 rounded-lg border border-amber-200/60 mt-2">
          {parsedDoc.error}
        </p>
        <p className="mt-2.5 text-xs text-amber-700/90">
          Switch to the <strong>YAML Code</strong> tab to fix the syntax error, then return to Form
          View.
        </p>
      </div>
    );
  }

  const cv = parsedDoc.doc.cv || {};
  const sections: Record<string, any[]> = cv.sections || {};
  const socialNetworks: Array<{ network: string; username: string }> = Array.isArray(
    cv.social_networks
  )
    ? cv.social_networks
    : [];

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    updateDoc((c) => {
      if (c.sections[title]) return;
      if (newSectionType === 'experience') {
        c.sections[title] = [
          {
            company: 'Company Name',
            position: 'Role Title',
            location: 'City, State',
            start_date: '2023-01',
            end_date: 'present',
            highlights: ['Spearheaded core architecture and improved throughput by 35%.'],
          },
        ];
      } else if (newSectionType === 'education') {
        c.sections[title] = [
          {
            institution: 'University Name',
            area: 'Computer Science',
            degree: 'BS',
            location: 'City, State',
            start_date: '2019-09',
            end_date: '2023-05',
            highlights: ['GPA: 3.9/4.0'],
          },
        ];
      } else if (newSectionType === 'projects') {
        c.sections[title] = [
          {
            name: 'Project Name',
            start_date: '2024-01',
            end_date: 'present',
            summary: 'High-level project summary',
            highlights: ['Built full-stack system serving 1,000+ active users.'],
          },
        ];
      } else if (newSectionType === 'skills') {
        c.sections[title] = [
          {
            label: 'Languages & Frameworks',
            details: 'TypeScript, React, Python, Node.js, PostgreSQL',
          },
        ];
      } else {
        c.sections[title] = ['Accomplishment or summary point.'];
      }
    });
    setExpandedSections((prev) => ({ ...prev, [title]: true }));
    setNewSectionTitle('');
  };

  const inputClass =
    'w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200/80 rounded-xl text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-400 transition';

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-6 space-y-4 bg-white text-slate-600">
      {/* Personal Information Card */}
      <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('__personal')}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50/60 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-50/80 border border-violet-100 flex items-center justify-center">
              <User className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <span className="font-medium text-sm text-slate-700 block">
                Personal Details & Contact Header
              </span>
              <span className="text-[11px] text-slate-400">
                Name, target role headline, email, phone & social links
              </span>
            </div>
          </div>
          {expandedSections.__personal ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedSections.__personal && (
          <div className="p-4 sm:p-5 space-y-4 border-t border-slate-100 bg-slate-50/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-normal text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={cv.name || ''}
                  disabled={readOnly}
                  onChange={(e) => updateDoc((c) => (c.name = e.target.value))}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-500 mb-1">
                  Target Role / Headline
                </label>
                <input
                  type="text"
                  value={cv.headline || ''}
                  disabled={readOnly}
                  onChange={(e) => updateDoc((c) => (c.headline = e.target.value || null))}
                  placeholder="Senior Full-Stack Engineer | AI & Distributed Systems"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-500 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={cv.email || ''}
                  disabled={readOnly}
                  onChange={(e) => updateDoc((c) => (c.email = e.target.value || null))}
                  placeholder="john.doe@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                </label>
                <input
                  type="text"
                  value={cv.phone || ''}
                  disabled={readOnly}
                  onChange={(e) => updateDoc((c) => (c.phone = e.target.value || null))}
                  placeholder="+1 415 555 0199"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                </label>
                <input
                  type="text"
                  value={cv.location || ''}
                  disabled={readOnly}
                  onChange={(e) => updateDoc((c) => (c.location = e.target.value || null))}
                  placeholder="San Francisco, CA"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-500 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Website / Portfolio URL
                </label>
                <input
                  type="url"
                  value={cv.website || ''}
                  disabled={readOnly}
                  onChange={(e) => updateDoc((c) => (c.website = e.target.value || null))}
                  placeholder="https://yourportfolio.com/"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Social Networks */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-slate-500">
                  Social & Professional Profiles
                </span>
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() =>
                    updateDoc((c) => {
                      const list = Array.isArray(c.social_networks) ? c.social_networks : [];
                      c.social_networks = [...list, { network: 'LinkedIn', username: 'yourname' }];
                    })
                  }
                  className="text-xs font-normal flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Profile
                </button>
              </div>
              <div className="space-y-2">
                {socialNetworks.map((sn, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={sn.network || 'LinkedIn'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateDoc((c) => {
                          c.social_networks[idx].network = e.target.value;
                        })
                      }
                      className="px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl text-slate-600 font-normal focus:outline-none focus:border-violet-400"
                    >
                      {SOCIAL_NETWORK_OPTIONS.map((net) => (
                        <option key={net} value={net}>
                          {net}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={sn.username || ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateDoc((c) => {
                          c.social_networks[idx].username = e.target.value;
                        })
                      }
                      placeholder="username"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl text-slate-600 focus:outline-none focus:border-violet-400"
                    />
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() =>
                        updateDoc((c) => {
                          c.social_networks.splice(idx, 1);
                        })
                      }
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic CV Sections */}
      {Object.entries(sections).map(([sectionKey, entries], secIdx, allSecs) => {
        const isOpen = Boolean(expandedSections[sectionKey]);
        const entryArray = Array.isArray(entries) ? entries : [];

        return (
          <div
            key={sectionKey}
            className="border border-slate-200/90 bg-white rounded-2xl shadow-2xs overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50/80 transition">
              <button
                type="button"
                onClick={() => toggleSection(sectionKey)}
                className="flex items-center gap-2.5 flex-1 text-left cursor-pointer min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="font-semibold text-sm text-slate-900 capitalize truncate">
                  {sectionKey.replace(/_/g, ' ')}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {entryArray.length}
                </span>
              </button>

              <div className="flex items-center gap-1">
                {secIdx > 0 && (
                  <button
                    type="button"
                    title="Move Section Up"
                    onClick={() =>
                      updateDoc((c) => {
                        const pairs = Object.entries(c.sections);
                        const temp = pairs[secIdx - 1];
                        pairs[secIdx - 1] = pairs[secIdx];
                        pairs[secIdx] = temp;
                        c.sections = Object.fromEntries(pairs);
                      })
                    }
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {secIdx < allSecs.length - 1 && (
                  <button
                    type="button"
                    title="Move Section Down"
                    onClick={() =>
                      updateDoc((c) => {
                        const pairs = Object.entries(c.sections);
                        const temp = pairs[secIdx + 1];
                        pairs[secIdx + 1] = pairs[secIdx];
                        pairs[secIdx] = temp;
                        c.sections = Object.fromEntries(pairs);
                      })
                    }
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Delete Section"
                  onClick={() =>
                    updateDoc((c) => {
                      delete c.sections[sectionKey];
                    })
                  }
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleSection(sectionKey)}
                  className="p-1.5 text-slate-400 cursor-pointer"
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="p-4 sm:p-5 space-y-3.5 border-t border-slate-100 bg-slate-50/20">
                {entryArray.map((item, idx) => {
                  // Case 1: Simple string bullet
                  if (typeof item === 'string') {
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={item}
                          disabled={readOnly}
                          onChange={(e) =>
                            updateDoc((c) => {
                              c.sections[sectionKey][idx] = e.target.value;
                            })
                          }
                          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200/80 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-400"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDoc((c) => {
                              c.sections[sectionKey].splice(idx, 1);
                            })
                          }
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }

                  // Case 2: OneLineEntry ({ label, details }) -> e.g. Skills
                  if (item && typeof item === 'object' && 'label' in item && 'details' in item) {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-100"
                      >
                        <input
                          type="text"
                          value={item.label || ''}
                          onChange={(e) =>
                            updateDoc((c) => {
                              c.sections[sectionKey][idx].label = e.target.value;
                            })
                          }
                          placeholder="Category (e.g. Languages)"
                          className="sm:w-48 px-3 py-1.5 text-xs font-medium bg-violet-50/40 border border-violet-200/60 rounded-lg text-violet-700 focus:outline-none focus:border-violet-400"
                        />
                        <input
                          type="text"
                          value={item.details || ''}
                          onChange={(e) =>
                            updateDoc((c) => {
                              c.sections[sectionKey][idx].details = e.target.value;
                            })
                          }
                          placeholder="Comma-separated skills..."
                          className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200/80 rounded-lg text-slate-600 focus:outline-none focus:border-violet-400"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDoc((c) => {
                              c.sections[sectionKey].splice(idx, 1);
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg self-end sm:self-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }

                  // Case 3: Experience / Education / Normal / Publication Entry
                  if (item && typeof item === 'object') {
                    const fields = Object.keys(item).filter(
                      (k) => k !== 'highlights' && k !== 'authors'
                    );
                    const highlights: string[] = Array.isArray(item.highlights)
                      ? item.highlights
                      : [];

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-slate-100 space-y-3.5"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <span className="text-xs sm:text-sm font-medium text-violet-700">
                            {item.company ||
                              item.institution ||
                              item.name ||
                              item.title ||
                              item.bullet ||
                              `Entry #${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateDoc((c) => {
                                c.sections[sectionKey].splice(idx, 1);
                              })
                            }
                            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {fields.map((fieldKey) => (
                            <div key={fieldKey}>
                              <label className="block text-[11px] font-normal uppercase tracking-wider text-slate-400 mb-1">
                                {fieldKey.replace(/_/g, ' ')}
                              </label>
                              <input
                                type="text"
                                value={item[fieldKey] ?? ''}
                                onChange={(e) =>
                                  updateDoc((c) => {
                                    c.sections[sectionKey][idx][fieldKey] = e.target.value;
                                  })
                                }
                                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50/40 border border-slate-200/80 rounded-lg text-slate-600 focus:bg-white focus:border-violet-400 focus:outline-none transition"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Highlights / Accomplishment Bullets */}
                        {'highlights' in item ||
                        'company' in item ||
                        'institution' in item ||
                        'name' in item ? (
                          <div className="pt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-400">
                                Accomplishment Highlights ({highlights.length})
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateDoc((c) => {
                                    if (!Array.isArray(c.sections[sectionKey][idx].highlights)) {
                                      c.sections[sectionKey][idx].highlights = [];
                                    }
                                    c.sections[sectionKey][idx].highlights.push(
                                      'Engineered scalable feature improving key metric by 25%.'
                                    );
                                  })
                                }
                                className="text-xs font-normal text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                              >
                                <Plus className="w-3 h-3" /> Add Bullet
                              </button>
                            </div>
                            {highlights.map((hl, hIdx) => (
                              <div key={hIdx} className="flex items-start gap-2">
                                <span className="text-xs text-violet-400 font-normal mt-2">•</span>
                                <textarea
                                  rows={2}
                                  value={hl}
                                  onChange={(e) =>
                                    updateDoc((c) => {
                                      c.sections[sectionKey][idx].highlights[hIdx] = e.target.value;
                                    })
                                  }
                                  className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-slate-50/40 border border-slate-200/80 rounded-lg text-slate-600 focus:bg-white focus:border-violet-400 focus:outline-none transition"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateDoc((c) => {
                                      c.sections[sectionKey][idx].highlights.splice(hIdx, 1);
                                    })
                                  }
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg mt-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Add Entry to this section */}
                <button
                  type="button"
                  onClick={() =>
                    updateDoc((c) => {
                      const arr = Array.isArray(c.sections[sectionKey])
                        ? c.sections[sectionKey]
                        : [];
                      const first = arr[0];
                      if (typeof first === 'string') {
                        arr.push('New accomplishment or summary statement.');
                      } else if (first && 'label' in first) {
                        arr.push({ label: 'New Category', details: 'Skill 1, Skill 2' });
                      } else if (first && 'institution' in first) {
                        arr.push({
                          institution: 'University Name',
                          area: 'Major / Field',
                          degree: 'MS',
                          location: 'City, State',
                          start_date: '2022-09',
                          end_date: '2024-05',
                          highlights: [],
                        });
                      } else if (first && 'company' in first) {
                        arr.push({
                          company: 'Organization Name',
                          position: 'Role Title',
                          location: 'City, State',
                          start_date: '2024-01',
                          end_date: 'present',
                          highlights: ['Delivered high-impact engineering solution.'],
                        });
                      } else {
                        arr.push({
                          name: 'New Project / Item',
                          start_date: '2024-01',
                          end_date: 'present',
                          summary: 'Summary description',
                          highlights: ['Key technical achievement.'],
                        });
                      }
                      c.sections[sectionKey] = arr;
                    })
                  }
                  className="w-full py-2.5 border border-dashed border-slate-200 hover:border-violet-300 bg-white/70 hover:bg-violet-50/30 rounded-xl text-xs font-normal text-slate-500 hover:text-violet-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Entry to {sectionKey.replace(/_/g, ' ')}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add New Section Box */}
      <div className="border border-slate-100 bg-white rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600">
          <Layers className="w-4 h-4 text-violet-600" />
          Add New Section to Resume
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="Section Title (e.g. Certifications, Awards, Summary)"
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200/80 rounded-xl text-slate-600 focus:bg-white focus:outline-none focus:border-violet-400"
          />
          <select
            value={newSectionType}
            onChange={(e) => setNewSectionType(e.target.value as any)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200/80 rounded-xl text-slate-600 font-normal focus:bg-white focus:outline-none focus:border-violet-400"
          >
            <option value="experience">Experience Entries</option>
            <option value="projects">Project Entries</option>
            <option value="education">Education Entries</option>
            <option value="skills">Skill Rows (Label + Details)</option>
            <option value="bullets">Text / Summary Bullets</option>
          </select>
          <button
            type="button"
            onClick={handleAddSection}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
      </div>
    </div>
  );
};
