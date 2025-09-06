# SpaceyTutor Client Application

This is the main user-facing application for SpaceyTutor, an AI-powered educational platform. It's built with React and Vite, offering a fast, modern, and responsive user experience for learners.

---

## 🚀 Getting Started

To get the client application running locally, follow these steps:

1.  **Install Dependencies:**
    Navigate to the `client` directory and run:
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    Once the dependencies are installed, start the Vite development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## ✨ Features

-   **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
-   **Dashboard**: A personalized landing page for authenticated users, providing access to different parts of the application.
-   **My Lessons Page**: A responsive grid displaying all available lessons with visually appealing cards.
-   **Interactive Lesson Player**: A feature-rich, responsive interface for taking lessons. The layout includes:
    -   An `InteractionPanel` for primary content (quizzes, narration).
    -   A `ChatPanel` for interacting with the AI tutor.
    -   A collapsible `LessonOutline` and `WebcamView` to optimize space on smaller screens.
-   **State Management**: Utilizes Zustand for efficient, centralized state management, particularly for sharing the active lesson's data across components like the `LessonPage` and `Navbar`.

## 🛠️ Tech Stack

-   **Framework**: React
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Backend & Database**: Firebase (Firestore, Authentication)
-   **Routing**: React Router
