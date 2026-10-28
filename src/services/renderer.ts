export interface RenderCVError {
  message: string;
  schema_location: string[] | null;
  input: string | null;
  yaml_source: 'cv' | 'design' | 'locale' | 'settings' | 'photo';
  yaml_location: [[number, number], [number, number]] | null;
}

export interface RenderSections {
  cv: string;
  design: string;
  locale: string;
  settings: string;
}

const FONT_BASE_URL = 'https://raw.githubusercontent.com/rendercv/rendercv-fonts/main/rendercv_fonts';

const FONT_FAMILIES: Record<string, string[]> = {
  Fontin: ['Fontin-Regular.otf', 'Fontin-Bold.otf', 'Fontin-Italic.otf'],
  'Font Awesome 7': [
    'Font Awesome 7 Free-Regular-400.otf',
    'Font Awesome 7 Free-Solid-900.otf',
    'Font Awesome 7 Brands-Regular-400.otf',
  ],
  'Source Sans 3': [
    'SourceSans3-Regular.ttf',
    'SourceSans3-Bold.ttf',
    'SourceSans3-Italic.ttf',
    'SourceSans3-BoldItalic.ttf',
  ],
  XCharter: [
    'XCharter-Regular.otf',
    'XCharter-Bold.otf',
    'XCharter-Italic.otf',
    'XCharter-BoldItalic.otf',
  ],
  Raleway: [
    'Raleway-Regular.ttf',
    'Raleway-Bold.ttf',
    'Raleway-Italic.ttf',
    'Raleway-BoldItalic.ttf',
  ],
  'Open Sans': [
    'OpenSans-Regular.ttf',
    'OpenSans-Bold.ttf',
    'OpenSans-Italic.ttf',
    'OpenSans-BoldItalic.ttf',
  ],
  'Gentium Book Plus': [
    'GentiumBookPlus-Regular.ttf',
    'GentiumBookPlus-Bold.ttf',
    'GentiumBookPlus-Italic.ttf',
    'GentiumBookPlus-BoldItalic.ttf',
  ],
  Lato: ['Lato-Regular.ttf', 'Lato-Bold.ttf', 'Lato-Italic.ttf', 'Lato-BoldItalic.ttf'],
  'EB Garamond': [
    'EBGaramond-Regular.ttf',
    'EBGaramond-Bold.ttf',
    'EBGaramond-Italic.ttf',
    'EBGaramond-BoldItalic.ttf',
  ],
  'Open Sauce Sans': [
    'OpenSauceSans-Regular.ttf',
    'OpenSauceSans-Bold.ttf',
    'OpenSauceSans-Italic.ttf',
    'OpenSauceSans-BoldItalic.ttf',
  ],
  Roboto: ['Roboto-Regular.ttf', 'Roboto-Bold.ttf', 'Roboto-Italic.ttf', 'Roboto-BoldItalic.ttf'],
  Ubuntu: ['Ubuntu-Regular.ttf', 'Ubuntu-Bold.ttf', 'Ubuntu-Italic.ttf', 'Ubuntu-BoldItalic.ttf'],
  Poppins: [
    'Poppins-Regular.ttf',
    'Poppins-Bold.ttf',
    'Poppins-Italic.ttf',
    'Poppins-BoldItalic.ttf',
  ],
  Mukta: ['Mukta-Regular.ttf', 'Mukta-Bold.ttf'],
  'Noto Sans': [
    'NotoSans-Regular.ttf',
    'NotoSans-Bold.ttf',
    'NotoSans-Italic.ttf',
    'NotoSans-BoldItalic.ttf',
  ],
};

const PRELOADED_FAMILIES = ['Fontin', 'Font Awesome 7', 'Source Sans 3', 'XCharter', 'Raleway'];

function getFontUrlsForFamily(family: string): string[] {
  const files = FONT_FAMILIES[family];
  if (!files) return [];
  const encodedDir = encodeURIComponent(family);
  return files.map((f) => `${FONT_BASE_URL}/${encodedDir}/${encodeURIComponent(f)}`);
}

export class RenderCVPipeline {
  private pyodideWorker: Worker | null = null;
  private typstWorker: Worker | null = null;
  private pyodidePending = new Map<number, { resolve: (v: any) => void; reject: (e: any) => void }>();
  private typstPending = new Map<number, { resolve: (v: any) => void; reject: (e: any) => void }>();
  private pyodideMsgId = 0;
  private typstMsgId = 0;
  private loadedFontFamilies = new Set<string>(PRELOADED_FAMILIES);
  private unavailablePhotos = new Map<string, number>();

  private pyodideInitPromise: Promise<void> | null = null;
  private typstInitPromise: Promise<void> | null = null;

  public lastTypstContent: string | null = null;
  public lastPhoto: { url: string; bytes: Uint8Array } | null = null;

  private callPyodide(type: string, payload?: any): Promise<any> {
    if (!this.pyodideWorker) {
      this.pyodideWorker = new Worker('/workers/pyodide.worker.js', { type: 'module' });
      this.pyodideWorker.onmessage = (ev) => {
        const { id, type: resType, payload: resPayload } = ev.data;
        const entry = this.pyodidePending.get(id);
        if (!entry) return;
        this.pyodidePending.delete(id);
        if (resType === 'ERROR') {
          entry.reject(new Error(resPayload?.message || 'Pyodide worker error'));
        } else {
          entry.resolve(resPayload);
        }
      };
    }
    const id = ++this.pyodideMsgId;
    return new Promise((resolve, reject) => {
      this.pyodidePending.set(id, { resolve, reject });
      this.pyodideWorker!.postMessage({ id, type, payload });
    });
  }

  private callTypst(type: string, payload?: any): Promise<any> {
    if (!this.typstWorker) {
      this.typstWorker = new Worker('/workers/typst.worker.js', { type: 'module' });
      this.typstWorker.onmessage = (ev) => {
        const { id, type: resType, payload: resPayload } = ev.data;
        const entry = this.typstPending.get(id);
        if (!entry) return;
        this.typstPending.delete(id);
        if (resType === 'ERROR') {
          entry.reject(new Error(resPayload?.message || 'Typst worker error'));
        } else {
          entry.resolve(resPayload);
        }
      };
    }
    const id = ++this.typstMsgId;
    return new Promise((resolve, reject) => {
      this.typstPending.set(id, { resolve, reject });
      this.typstWorker!.postMessage({ id, type, payload });
    });
  }

  public async init(onStage?: (stage: string) => void): Promise<void> {
    if (!this.pyodideInitPromise) {
      onStage?.('Initializing Python & RenderCV engine...');
      this.pyodideInitPromise = this.callPyodide('INIT').then(() => {});
    }
    if (!this.typstInitPromise) {
      const fontUrls = Array.from(this.loadedFontFamilies).flatMap(getFontUrlsForFamily);
      this.typstInitPromise = this.callTypst('INIT', { fontUrls }).then(() => {});
    }
    await Promise.all([this.pyodideInitPromise, this.typstInitPromise]);
  }

  private async ensureFontsForTypst(typstContent: string): Promise<void> {
    const regex = /font-family-\w+:\s*"([^"]+)"/g;
    let match: RegExpExecArray | null;
    let added = false;
    while ((match = regex.exec(typstContent)) !== null) {
      const family = match[1];
      if (family in FONT_FAMILIES && !this.loadedFontFamilies.has(family)) {
        this.loadedFontFamilies.add(family);
        added = true;
      }
    }
    if (added) {
      const fontUrls = Array.from(this.loadedFontFamilies).flatMap(getFontUrlsForFamily);
      await this.callTypst('REINIT', { fontUrls });
    }
  }

  public async renderToSvg(
    sections: RenderSections,
    onStage?: (stage: string) => void
  ): Promise<{ svgs: string[]; typstCode: string; errors: RenderCVError[] }> {
    await this.init(onStage);
    onStage?.('Validating YAML & compiling Typst template...');

    const unavailablePhotoUrls = Array.from(this.unavailablePhotos.keys());
    const pyRes = await this.callPyodide('RENDER', {
      ...sections,
      unavailablePhotoUrls,
    });

    if (pyRes.errors) {
      return { svgs: [], typstCode: this.lastTypstContent || '', errors: pyRes.errors };
    }

    const typstCode: string = pyRes.content;
    let photoData: { url: string; bytes: Uint8Array } | null = null;

    if (pyRes.photo?.url) {
      try {
        const resp = await fetch(pyRes.photo.url);
        if (!resp.ok) throw new Error('Photo fetch failed');
        const bytes = new Uint8Array(await resp.arrayBuffer());
        await this.callTypst('CHECK_PHOTO', { url: pyRes.photo.url, bytes });
        photoData = { url: pyRes.photo.url, bytes };
      } catch {
        this.unavailablePhotos.set(pyRes.photo.url, Date.now());
      }
    }

    await this.ensureFontsForTypst(typstCode);
    onStage?.('Rendering SVG pages with Typst WASM...');

    const svgRes = await this.callTypst('SVG', {
      content: typstCode,
      photo: photoData,
    });

    this.lastTypstContent = typstCode;
    this.lastPhoto = photoData;

    const svgs: string[] = Array.isArray(svgRes) ? svgRes : svgRes?.svgs || [];

    return {
      svgs,
      typstCode,
      errors: [],
    };
  }

  public async exportPdfBytes(): Promise<Uint8Array> {
    if (!this.lastTypstContent) {
      throw new Error('Wait for the CV preview to finish rendering before exporting PDF.');
    }
    const res = await this.callTypst('PDF', {
      content: this.lastTypstContent,
      photo: this.lastPhoto,
    });
    return (res instanceof Uint8Array ? res : res?.pdf) as Uint8Array;
  }
}

export const renderPipeline = new RenderCVPipeline();
