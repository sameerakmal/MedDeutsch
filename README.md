# MedDeutsch

Medical German learning for nursing professionals.

Live Demo: [MedDeutsch](https://med-deutsch-sameerakmal.vercel.app/)

## Overview

MedDeutsch is a focused medical German learning web application built specifically for nursing professionals acquiring A1/A2 clinical German. The platform enables healthcare workers to build and retain essential clinical vocabulary through an active, continuous learning loop:

**Learn → Practice → Make Mistakes → Review → Improve**

The application emphasizes beginner-friendly clinical communication, helping nurses learn critical terminology, recognize grammatical gender and articles, practice through clinical scenarios, and reinforce terms they find challenging.

## Features

- **A1/A2 Vocabulary Learning**: Curated clinical terminology tailored for foundational German healthcare environments.
- **Categorized Clinical Terms**: Medical vocabulary structured across practical clinical categories (e.g., body parts, nursing actions, hospital equipment, symptoms).
- **German Articles and Gender**: Clear identification of grammatical gender (*der*, *die*, *das*) and noun articles essential for correct medical charting and communication.
- **Clinical Example Sentences**: German workplace context sentences paired with clear English translations.
- **Browser-Based Pronunciation Support**: Native text-to-speech audio pronunciation powered by the Web Speech API.
- **Interactive Practice Quizzes**: Category- and session-based quizzes designed to test clinical comprehension.
- **Multiple Question Types**: Diverse question formats including multiple-choice translations, article selection, and term identification.
- **Immediate Answer Feedback**: Instant correctness indicators with explanations to reinforce immediate learning.
- **Mistake Tracking**: Automatic logging of incorrect quiz responses into a dedicated mistake list.
- **Active Recall / Review Workflow**: Targeted review sessions focused exclusively on terms previously missed.
- **Mastery Progression**: Step-by-step progress from newly introduced terms to mastered vocabulary based on successful recalls.
- **Learning Progress & Quiz Statistics**: Comprehensive dashboard metrics showing session performance, accuracy rates, and vocabulary mastery levels.
- **Responsive Desktop and Mobile UI**: Clean, mobile-friendly interface designed for bedside study and desktop review alike.
- **Local Persistence via localStorage**: Full client-side state storage ensuring learning progress, mistake logs, and quiz history persist across browser sessions without requiring an account.

## Learning Experience

The platform is designed around a structured, feedback-driven product loop:

1. **Learn New Vocabulary**: Browse clinical terms by category, inspect grammatical gender, hear pronunciation, and review contextual clinical usage.
2. **Practise Through Questions**: Reinforce knowledge with interactive quizzes that simulate real-world comprehension challenges.
3. **Identify Mistakes**: The system automatically captures missed terms and incorrect choices without interrupting the quiz flow.
4. **Review Difficult Terms**: Access a dedicated review queue containing only the vocabulary needing reinforcement.
5. **Revisit Terms Through Active Recall**: Clear items from the review queue by answering them correctly in subsequent review sessions.
6. **Track Progress**: Inspect mastery metrics, accuracy trends, and completion statistics on the personal dashboard.

## Tech Stack

- **Framework**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/) 8
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Routing**: [React Router](https://reactrouter.com/) 7 (`react-router-dom`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio / Pronunciation**: Browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (`window.speechSynthesis`)
- **Code Quality**: [Oxlint](https://oxc.rs/)

## Architecture

MedDeutsch is a pure frontend, client-side single-page application (SPA).

- **Frontend Application**: Component-driven architecture built with React, TypeScript, and Tailwind CSS.
- **Static Learning Data**: Clinical vocabulary, categories, example sentences, and quiz definitions reside within local data modules in the project (`src/data/`).
- **Client-Side State & Persistence**: All learner progress, quiz metrics, active recall queues, and mistake histories are stored directly in the user's browser using `localStorage`.
- **Audio Engine**: Audio pronunciations are generated on demand using the browser's native Web Speech Synthesis API, requiring no external voice services.
- **No Backend Dependency**: There are no external databases, authentication services, or backend APIs required to operate the application.

## Pages

- **`/` — Welcome**: Introduction to MedDeutsch, core value proposition, and quick entry into the platform.
- **`/dashboard` — Dashboard**: High-level learning overview, key performance metrics, quick study actions, and category exploration.
- **`/learn` — Learn**: Structured vocabulary browser organized by clinical category with pronunciation and example sentences.
- **`/practice` — Practice**: Interactive quiz environment with configurable categories, question progression, and immediate answer evaluation.
- **`/review` — Review**: Dedicated active-recall workspace to review, practice, and clear previously missed vocabulary.
- **`/results` — Quiz Results**: Performance summary following a completed quiz session, displaying score breakdowns and recorded mistakes.
- **`/progress` — Progress**: In-depth analytics tracking vocabulary mastery, quiz accuracy, and category completion rates.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/meddeutsch.git
   cd meddeutsch
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### Other Available Scripts

- **Build for production**:
  ```bash
  npm run build
  ```
  Compiles TypeScript types and builds production assets into the `dist/` directory.

- **Preview production build**:
  ```bash
  npm run preview
  ```
  Locally serves the built `dist/` bundle.

- **Run linter**:
  ```bash
  npm run lint
  ```
  Runs Oxlint across project files to check for syntax and lint issues.

## Deployment

MedDeutsch is a standalone frontend application created with Vite and can be deployed directly to [Vercel](https://vercel.com/) (or any static hosting platform such as Netlify or GitHub Pages) without any server-side configuration.

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Live Demo: [Add Vercel URL]

## Project Structure

```text
src/
├── components/     # Reusable UI primitives and feature modules (learn, practice, review)
├── data/           # Static clinical vocabulary data, categories, and example sentences
├── hooks/          # Custom React hooks for learner progress and Web Speech API synthesis
├── layouts/        # Application shell, navigation bar, and responsive sidebar layout
├── pages/          # Top-level page components corresponding to application routes
├── types/          # TypeScript interfaces for vocabulary, quizzes, mistakes, and metrics
└── utils/          # Helper utilities for quiz generation, scoring, and localStorage storage
```

- **`components/`**: Houses foundational UI components (`Button`, `Card`, `Header`, `ProgressBar`) alongside domain-specific component groups for vocabulary learning (`components/learn/`), quiz sessions (`components/practice/`), and active recall (`components/review/`).
- **`data/`**: Contains curated A1/A2 medical vocabulary items with German terms, grammatical genders, English translations, clinical notes, and categories (`categories.ts`, `vocabulary.ts`).
- **`hooks/`**: Provides reusable hooks such as `useLearnerProgress` for reactive progress synchronization and `useSpeechSynthesis` for German voice playback.
- **`layouts/`**: Implements `AppLayout`, managing the responsive sidebar, mobile navigation drawer, and application header.
- **`pages/`**: Implements view components matching the primary application routes (`WelcomePage`, `DashboardPage`, `LearnPage`, `PracticePage`, `ResultsPage`, `ReviewPage`, `ProgressPage`).
- **`types/`**: Defines strict TypeScript interfaces for vocabulary items, categories, quiz configurations, mistake records, and learner progress snapshots.
- **`utils/`**: Contains core domain logic including `quiz.ts` (question selection and quiz mechanics) and `storage.ts` (safe persistence and retrieval of learner state via `localStorage`).

## Design Principles

- **Professional Clinical/Healthcare Aesthetic**: Clean, trustworthy medical visual identity prioritizing clarity, readability, and calm colors.
- **English-First Application Interface**: Navigation, instructions, and explanations are presented in English so beginning language learners can easily navigate.
- **German Preserved for Learning Content**: Clinical terms, grammatical markers, articles, and sample medical dialogues maintain pure German formatting.
- **Clear Typography and Visual Hierarchy**: Structured type scales with distinct visual cues for articles (*der*, *die*, *das*), parts of speech, and clinical context.
- **Accessible Touch Targets**: Generous tap areas on mobile devices to facilitate study on smartphones and tablets.
- **Responsive Desktop and Mobile Experience**: Fully responsive interface adapted for both mobile handheld use and wider desktop screens.
- **Minimal Visual Noise**: Focused learning surface eliminating clutter and distracting elements.
- **No Unnecessary Decorative Gradients or AI-Dashboard Styling**: Grounded, distraction-free utility designed for genuine medical study rather than flashy marketing templates.

## Notes

- **Local Data Storage**: All learner data (learning metrics, mistake logs, quiz histories, and term mastery) is persisted exclusively in the browser's `localStorage`.
- **Device-Specific Progress**: Because there is no central backend database, learning progress is tied to the specific browser and device being used and does not synchronize across different devices or incognito sessions.

## License

License information has not been specified.
