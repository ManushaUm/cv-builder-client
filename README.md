# BuildCV Client (`buildcv-client`)

The frontend application for **BuildCV**, built with **React 19, TypeScript, Vite 8, and Tailwind CSS v4**. It provides an interactive visual resume & design studio, real-time client-side **Pyodide + Typst WASM** vector SVG/PDF rendering, deterministic ATS compatibility scoring (`0–100`), and 1-click AI Job Description (JD) resume tailoring.

---

## Directory Structure

```text
client/
├── public/
│   ├── favicon.svg                      # BuildCV favicon
│   ├── logo.svg                         # BuildCV brand icon
│   ├── rendercv-2.8-py3-none-any.whl    # Bundled RenderCV Python wheel for Pyodide
│   └── workers/
│       ├── pyodide.worker.js            # Web Worker: YAML schema validation & Typst generation
│       └── typst.worker.js              # Web Worker: Typst WASM vector SVG & PDF compilation
├── src/
│   ├── components/
│   │   ├── AtsAndTailorPanel.tsx        # 0–100 ATS score breakdown & 1-click AI JD tailoring UI
│   │   ├── AuthModal.tsx                # User profile, cloud sync status & daily AI quota modal
│   │   ├── BrandLogo.tsx                # Vector BuildCV brand icon component
│   │   ├── DesignFormEditor.tsx         # Visual UI customizer for Design, Locale & Settings
│   │   ├── FormEditor.tsx               # Visual UI editor for CV contact info & dynamic sections
│   │   ├── LoginPage.tsx                # Multi-user authentication & registration screen (/login)
│   │   └── YamlDiffModal.tsx            # Side-by-side Before vs. After YAML comparison modal
│   ├── data/
│   │   └── defaults.ts                  # 9 built-in Typst themes, 22 locales & starter templates
│   ├── services/
│   │   ├── aiTailor.ts                  # AI tailoring client & Smart ATS Optimizer fallback
│   │   ├── api.ts                       # REST client for /api/auth, /api/resumes, and /api/ai
│   │   ├── atsAnalyzer.ts               # Real-time 100-point ATS & JD keyword matching engine
│   │   └── renderer.ts                  # Orchestrates Pyodide + Typst WASM workers & remote fonts
│   ├── App.tsx                          # Main studio layout (Sidebar, Editor, Split Live Preview)
│   ├── index.css                        # Global styles & Tailwind v4 configuration
│   └── main.tsx                         # React DOM root entry
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts                       # Vite dev server & /api proxy configuration
```

---

## Key Features

- **Dual Visual UI & Raw YAML Editing**:
  - Toggle seamlessly between visual form controls (**`CV`**, **`Design`**, **`Locale`**, **`Settings`**) and the Monaco **`YAML`** code editor using the top-right `YAML` switch.
- **100% Client-Side Vector SVG & PDF Rendering**:
  - Compiles resumes directly in the browser via `pyodide.worker.js` and `typst.worker.js` with zero server rendering latency.
  - Supports **9 built-in themes** (`classic`, `ember`, `engineeringclassic`, `engineeringresumes`, `harvard`, `ink`, `moderncv`, `opal`, `sb2nov`) and **22 languages/locales**.
- **ATS Readiness Score (`0–100`) & 1-Click AI Tailoring**:
  - Evaluates Structure & Parsability (`30 pts`), Action Verbs & Quantified Impact (`30 pts`), and Target Job Description Keyword Match (`40 pts`).
  - Tailors summary, headline, skills, and bullet points to any target Job Description with 1-click diff inspection and undo.
- **Responsive Across All Screens**:
  - Auto-collapsing sidebar below `1180px`, draggable split-pane preview on tablet/desktop (`>= 768px`), and dedicated 4-tab bottom navigation bar on mobile (`< 768px`).

---

## Scripts

Run inside the `client/` directory (or from the repository root using `--workspace=client`):

```bash
# Start Vite development server on http://localhost:5173
npm run dev

# Type-check with TypeScript and build production bundle to client/dist/
npm run build

# Preview production build locally
npm run preview

# Run Oxlint static analysis
npm run lint
```

### API Proxy in Development

In [`vite.config.ts`](./vite.config.ts), requests to `/api/*` are automatically proxied to the Express backend (`http://127.0.0.1:4000`), and `/api/ollama/*` is proxied to local Ollama (`http://127.0.0.1:11434`).
