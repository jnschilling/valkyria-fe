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
    races: {
      title: "Courses",
      noRaces: "Aucune course.",
      loading: "Chargement...",
      quinte: "Quinté",
      noSelections: "Aucune sélection.",
    },
    participants: {
      title: "Participants Sélectionnés",
      loading: "Chargement des sélections...",
      noSelections: "Aucune sélection pour cette course.",
      rank: "Rang",
      favori: "Favori",
      tocard: "Tocard",
      watched: "Surveillé",
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
    races: {
      title: "Races",
      noRaces: "No races.",
      loading: "Loading...",
      quinte: "Quinté",
      noSelections: "No selections.",
    },
    participants: {
      title: "Selected Participants",
      loading: "Loading selections...",
      noSelections: "No selections for this race.",
      rank: "Rank",
      favori: "Favorite",
      tocard: "Outsider",
      watched: "Watched",
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
    races: {
      title: "Carreras",
      noRaces: "Sin carreras.",
      loading: "Cargando...",
      quinte: "Quinté",
      noSelections: "Sin selecciones.",
    },
    participants: {
      title: "Participantes Seleccionados",
      loading: "Cargando selecciones...",
      noSelections: "Sin selecciones para esta carrera.",
      rank: "Rango",
      favori: "Favorito",
      tocard: "Outsider",
      watched: "Vigilado",
    },
  },
} as const;

// Define TranslationKeys based on the structure
export type TranslationKeys = (typeof translations)[Locale];
