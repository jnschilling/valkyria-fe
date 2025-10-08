import { LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useI18n } from "../i18n/I18nContext";

export function Header() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            {t.meetings.title}
          </h1>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.auth.signOut}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
