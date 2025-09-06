# 🚀 Spacey Mission

## Project Overview
**Spacey Mission** is an AI-powered educational platform designed to provide a personalized and engaging learning experience. The project is structured as a monorepo to cleanly separate the concerns of the user-facing application, the administrative backend, and the server-side logic.

At its core lies a **multi-LLM routing strategy**, where a **central orchestrator LLM** intelligently manages specialized LLMs (like an Explainer, Quiz, and Canvas LLM) to deliver dynamic and interactive content.

The project’s vision is to create an **adaptive learning environment** with:
- Gamification
- Progress tracking
- A user-friendly interface
- Personalized AI tutor guidance

---

## ✨ Features
This section outlines the key features of the application, with a checklist to track progress.

### Core Architecture
- [ ] **AI Orchestrator System**: A central LLM that routes user queries to specialized LLMs based on pedagogical needs.
- [ ] **Specialized LLMs**: Dedicated models for explanations, quizzes, Socratic dialogues, and visual aids.
- [ ] **Conditional UI Rendering**: The front-end dynamically renders different components (text, quiz, canvas) based on the AI's response.

### User Experience
- [x] **User Dashboard**: A personalized hub for the user after login.
- [ ] **Proactive Recommendations**: Lessons suggested by the AI based on the user’s progress.
- [ ] **Gamification Hub**: Awards, badges, and leaderboards to motivate users.
- [ ] **Progress & Stats Page**: Analytics with graphs and charts for tracking mastery and time spent.
- [ ] **Lessons Catalog**: A browsable library of all available subjects and lessons.

### Admin & Content Management
- [x] **Admin Dashboard**: A separate, secure application for content management.
- [x] **Lesson Design System**: A visual interface (e.g., node editor, knowledge graph) for creating and structuring lessons.
- [x] **Direct Database Interaction**: Secure endpoints for admins to create, read, update, and delete lesson content.

### Data & Technology
- [ ] **Firebase Firestore Integration**: To store user data, learning paths, and achievements.
- [ ] **Source Document Ingestion**: Backend process to chunk and index educational content for the LLM.
- [x] **User Authentication**: A system for user sign-up and login.

---


## 📂 Project Structure
The project is organized as a monorepo with distinct directories for the client-facing app, the admin panel, and the server.

```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignUpForm.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   └── index.js         // Exports everything from this feature
│   ├── lesson/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── LessonOutline.jsx
│   │   │   ├── InteractiveCanvas.jsx
│   │   │   └── MessageTypes/
│   │   │       ├── ExplanationMessage.jsx
│   │   │       └── QuizMessage.jsx
│   │   ├── hooks/
│   │   │   └── useLessonState.js
│   │   ├── services/
│   │   │   └── lessonAPI.js   // Handles API calls to the backend
│   │   └── index.js
│   └── dashboard/
│       ├── components/
│       │   ├── LessonCard.jsx
│       │   └── ContinueLesson.jsx
│       └── ...
├── components/               // Shared, reusable components (Button, Input, Modal)
│   ├── Button.jsx
│   └── LoadingSpinner.jsx
├── hooks/                    // Shared, global hooks
│   └── useAPI.js
├── lib/                      // External libraries or helper functions
│   └── axios.js              // Pre-configured Axios instance
├── pages/                    // Top-level page components that assemble features
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   ├── MyLessonPage.jsx
│   └── LessonPage.jsx
├── services/                 // Global API services
│   └── api.js
├── state/                    // Global state management (Zustand, Redux, Context)
│   └── store.js
├── App.jsx
└── main.jsx
```
