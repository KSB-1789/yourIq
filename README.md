# Standardized Cognitive Assessment & Training Suite 🧠

A clinical-grade, psychometrically calibrated cognitive assessment and brain training platform. Designed with clean, minimalist aesthetics, generous typography, and zero subscription paywalls, marketing funnels, or user data harvesting.

---

## 🎯 Purpose & Vision

Most online intelligence tests lock unredacted results behind monthly checkout paywalls or present elementary puzzles that fail to test actual high-range cognitive ceilings. 

This platform provides:
1. **Clinical Rigor**: Authentic psychometric evaluation adhering to the Cattell-Horn-Carroll (CHC) theory and Wechsler adult distribution standard ($\mu = 100, \sigma = 15$).
2. **Delayed Interference Testing**: A 3-step delayed memory recall framework that tests working memory trace decay under continuous problem-solving load.
3. **100% Open & Client-Side**: All scoring, item randomization, and history tracking run locally in the candidate's browser with zero trackers or server uploads.

---

## ✨ Features

### 1. Progressive Matrix Assessment (3 Phases • 20 Core Items)
* **Phase 1: Abstract & Spatial Logic (Questions 1–8)**: Bivariate Latin square permutations, dual-axis rotational acceleration, 3D net folding with chiral reflections, and centripetal shell stripping.
* **Phase 2: Quantitative Induction & Epistemological Analogies (Questions 9–16)**: Second-order interleaved number series, polynomial delta matrices, and graduate-level conceptual analogies.
* **Phase 3: High-Range Mensa Synthesis (Questions 17–20)**: Ceiling items calibrated for scores above 125 IQ, featuring Boolean line superposition (XOR) with angular drift and modular arithmetic lattices ($(R_1 \times R_2) \pmod{11} = R_3$).
* **Dynamic Retesting & Freshness**: Questions are dynamically sampled on each attempt from a tiered pool. Option order ($A, B, C, D$) is randomized each session to prevent rote memorization.

### 2. 3-Step Delayed Memory Recall Protocol
Separate from the 20 cognitive questions, candidates undergo a structured 3-phase memory interference battery:
* **Step 1 (Verbal Word Trace)**: Candidate commits a vocabulary word (e.g., `LABYRINTH`, `OBSIDIAN`, `SOLSTICE`) to memory before Question 1. Prompted for recall after Question 8 against morphological distractors.
* **Step 2 (Alphanumeric Trace)**: Candidate commits an alphanumeric code (e.g., `8492-BX`, `7319-KT`) before Question 9. Tested after Question 16 against deceptive transposition foils.
* **Step 3 (Compound Key Trace)**: Candidate commits a compound identifier (e.g., `COBALT-815`, `PLATINUM-637`) before Question 17. Tested after Question 20 to gauge resistance to retroactive cognitive interference under high-range load.
* Evaluates the **Working Memory Index (WMI)** and retention rate (0% to 100%).

### 3. Comprehensive Diagnostic Report
* **Wechsler Standard Score ($\mu=100, \sigma=15$)**: Non-linear IRT item weighting with 95% Confidence Intervals and Standard Error of Measurement (SEM ~ 4.5).
* **Interactive Gaussian Normal Distribution**: Visual Bell curve with live marker placement indicating your standing relative to general population thresholds and high-IQ societies (Mensa top 2.2% at 130+).
* **Domain Sub-Scales**: Individual index ratings for Fluid Reasoning ($G_f$), Spatial & Visual Logic ($G_v$), Quantitative Induction ($G_q$), Pattern Speed ($G_s$), and Working Memory Retention ($G_{wm}$).
* **Item-by-Item Solutions**: Complete post-test review with step-by-step logic derivations.
* **Printable Certificate**: High-resolution performance certificate ready for print or PDF export.

### 4. Cognitive Training Gym
Targeted daily drills with specialized normative diagnostic reports:
* **Spatial Memory Grid (Corsi Blocks)**: Train the dorsal visual pathway and spatial coordinate chunking across an expanding 4×4 grid.
* **Working Memory Span (Forward / Reverse)**: Train active central executive manipulation ($G_{wm}$) with forward span and reverse sequence inversion.
* **Mental Rotation Speed (Shepard-Metzler)**: 45-second sprint training 2D/3D rotational symmetry and parietal lobe transformation speed.
* **Pattern Matrix Blitz**: Inductive problem throughput under rapid 45-second clock pressure.

### 5. Persistent Local History
* Automatically records completed assessments and workouts in browser `localStorage`.
* Compare historical attempts, percentile trends, and domain performance over time.

---

## 🛠️ Tech Stack

* **Framework**: React 19 + TypeScript (Strict Mode)
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS v4 + Satoshi Typography
* **Icons**: Lucide React
* **Math / Psychometrics**: Gaussian Error Function (`erf`), Abramowitz & Stegun approximation
* **Linter**: Oxlint (Oxc)

---

## 🚀 Setup & Development Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher)
* [pnpm](https://pnpm.io/) (version 8 or higher) — recommended

### Installation

```bash
# Clone the repository
git clone https://github.com/KSB-1789/cognitive-assessment.git

# Navigate into the project folder
cd cognitive-assessment

# Install project dependencies
pnpm install
```

### Development Server

```bash
pnpm dev
```
Open `http://localhost:5173` in your browser. The Vite development server features instant Hot Module Replacement (HMR).

### Linting & Type Checking

```bash
# Type check TypeScript code
pnpm exec tsc -b

# Fast static linting with Oxlint
pnpm run lint
```

### Production Build

```bash
# Compile and bundle assets for production
pnpm run build

# Preview the production build locally
pnpm run preview
```

The optimized static build is emitted to the `dist/` folder and is ready to deploy on GitHub Pages, Vercel, Netlify, or any static web host.

---

## 📜 License

MIT License. Designed and maintained for open psychometric access and cognitive research.
