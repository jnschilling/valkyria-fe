import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { I18nProvider } from "./i18n/I18nContext";
import { LoginPage } from "./components/LoginPage";
import ReunionPage from "./components/ReunionPage";
// import { MeetingsPage } from "./components/MeetingsPage";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <ReunionPage /> : <LoginPage />;
}

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
