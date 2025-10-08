// src/i18n/translations.ts
export type Locale = "fr" | "en" | "es";

export const translations = {
  fr: {
    auth: {
      signInWithGoogle: "Se connecter avec Google",
      signOut: "Se déconnecter",
      welcome: "Bienvenue",
      loading: "Chargement...",
    },
    meetings: {
      title: "Réunions du jour",
      noMeetings: "Aucune réunion prévue aujourd'hui",
      race: "Course",
      loading: "Chargement des réunions...",
    },
  },
  en: {
    auth: {
      signInWithGoogle: "Sign in with Google",
      signOut: "Sign out",
      welcome: "Welcome",
      loading: "Loading...",
    },
    meetings: {
      title: "Today's Meetings",
      noMeetings: "No meetings scheduled today",
      race: "Race",
      loading: "Loading meetings...",
    },
  },
  es: {
    auth: {
      signInWithGoogle: "Iniciar sesión con Google",
      signOut: "Cerrar sesión",
      welcome: "Bienvenido",
      loading: "Cargando...",
    },
    meetings: {
      title: "Reuniones de hoy",
      noMeetings: "No hay reuniones programadas hoy",
      race: "Carrera",
      loading: "Cargando reuniones...",
    },
  },
} as const;

// Define TranslationKeys based on the structure
export type TranslationKeys = (typeof translations)[Locale];
