# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# google login setup

Setting Up a Vite-Based SiteVite is a fast frontend build tool, commonly used with frameworks like React or Vue. I'll assume you're building a React app for this example, as it's popular and straightforward. If you prefer Vue or another framework, the process is similar—just adjust the create command.Initialize the Project:Install Node.js (v18+ recommended) if you haven't already.
Run: npm create vite@latest my-site -- --template react
Navigate to the project: cd my-site
Install dependencies: npm install
Start the dev server: npm run dev
This sets up a basic React app at http://localhost:5173.

Basic Structure:Your app will have components like App.jsx for the main layout.
Add routing if needed (e.g., via react-router-dom): npm install react-router-dom
Create pages for login, dashboard, and payment (e.g., /login, /pay).

Implementing Login with Gmail (Google OAuth)This uses Google's OAuth 2.0 for secure login. You'll need a Google Developer Console account.Set Up Google OAuth Credentials:Go to the Google Cloud Console (console.cloud.google.com).
Create a project, enable the "Google+ API" (or search for OAuth).
In Credentials, create an OAuth 2.0 Client ID for web app.
Set authorized JavaScript origins (e.g., http://localhost:5173) and redirect URIs (e.g., http://localhost:5173/callback).
Note your Client ID.

setup in locki labs
->
Install Dependencies:npm install @react-oauth/google
