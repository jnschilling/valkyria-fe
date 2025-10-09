// src/components/ReunionPage.tsx
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Calendar } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import api from "../lib/api";
import io, { Socket } from "socket.io-client";
import debounce from "lodash/debounce"; // npm i lodash if not installed

interface RaceDetail {
  meeting_timestamp: number;
  reunion_label: string;
  race_label: string;
  start_time_in_s: number;
  race_status: string;
  race_name: string;
  race_is_quinte: boolean;
  race_guid: string;
  start_date: string;
  start_timestamp: number | null;
  distance: string;
  discipline: string;
  starters_count: number;
  racecourse: string;
  ground_condition: string;
  weather_description: string;
}

interface ReunionData {
  [reunion_label: string]: RaceDetail[];
}

interface ReunionResponse {
  date: string;
  reunions_races: { [reunion_label: string]: string[] };
  full_details: ReunionData;
}

// Extend i18n meetings type to include new keys (update your I18nContext types accordingly)
interface ExtendedMeetings {
  title: string;
  noMeetings: string;
  loading: string;
  cached?: string;
  error?: string;
  updated?: string;
}

function Reunion({ date }: { date?: string }) {
  const { t } = useI18n();
  const [reunions, setReunions] = useState<ReunionData>({});
  const [loading, setLoading] = useState(true);
  const [changeMessage, setChangeMessage] = useState<string>("");

  // Compute date if not provided (DDMMYYYY format)
  const today =
    date ||
    (() => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear().toString();
      return `${day}${month}${year}`;
    })();

  const prevReunionsRef = useRef<ReunionData>({}); // Stable compare ref
  const socketRef = useRef<Socket | null>(null); // Single socket instance
  const meetings = t.meetings as ExtendedMeetings;

  // Debounced state update to reduce re-renders (optional, for high-frequency)
  const debouncedSetReunions = useMemo(
    () =>
      debounce((data: ReunionData) => {
        setReunions(data);
      }, 500), // 500ms debounce
    []
  );

  const handleReunionsUpdate = useCallback(
    (updatedData: ReunionData) => {
      console.log("Received reunions_update:", updatedData);
      const prevData = prevReunionsRef.current;
      const hasChanged =
        JSON.stringify(updatedData) !== JSON.stringify(prevData);
      console.log("Data changed?", hasChanged);

      if (hasChanged) {
        prevReunionsRef.current = updatedData; // Update ref (stable)
        localStorage.setItem(`reunions_${today}`, JSON.stringify(updatedData));
        console.log("Updating state with new data");
        debouncedSetReunions(updatedData); // Debounced set
        setChangeMessage(meetings.updated || "Reunions updated live!");
        setTimeout(() => setChangeMessage(""), 3000);
      } else {
        console.log("No change—skipping update");
      }
    },
    [today, debouncedSetReunions, meetings.updated]
  ); // Stable deps

  useEffect(() => {
    // Initial fetch via REST API
    const fetchReunions = async () => {
      try {
        setLoading(true);
        const response = await api.get<ReunionResponse>(`/reunions/${today}`);
        const { full_details } = response.data;
        console.log("Fetched initial data:", full_details);

        // Cache data in localStorage for offline fallback
        localStorage.setItem(`reunions_${today}`, JSON.stringify(full_details));

        prevReunionsRef.current = full_details; // Init ref
        setReunions(full_details);
        setChangeMessage(""); // Clear any previous message
      } catch (error: unknown) {
        console.error("Error fetching reunions:", error);
        // Fallback to cached data
        const cached = localStorage.getItem(`reunions_${today}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          prevReunionsRef.current = parsed;
          setReunions(parsed);
          setChangeMessage(meetings.cached || "Using cached data");
        } else {
          setChangeMessage(meetings.error || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    // Connect to SocketIO (only if not already)
    const connectSocket = () => {
      if (socketRef.current) {
        console.log("Socket already exists—reusing");
        return; // Prevent multiples
      }

      socketRef.current = io("http://localhost:5010", {
        reconnection: true,
        reconnectionAttempts: 3, // Limit retries
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["polling", "websocket"],
      });

      const socket = socketRef.current;
      socket.on("connect", () => {
        console.log("SocketIO connected");
        socket.emit("join_reunions", { date: today });
        console.log("Emitted join_reunions for", today);
      });

      socket.on("reunions_update", handleReunionsUpdate);

      socket.on("disconnect", (reason) => {
        console.log("SocketIO disconnected:", reason);
        if (reason === "io server disconnect") {
          socket.disconnect();
        }
      });

      socket.on("connect_error", (error) => {
        console.error("SocketIO connect error:", error);
      });

      socket.on("error", (data) => {
        console.error("Server error:", data.message);
        setChangeMessage(data.message || "Server error");
      });
    };

    // Run initial fetch then connect
    fetchReunions().then(connectSocket);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Clear ref
      }
      debouncedSetReunions.cancel(); // Cancel pending debounces
    };
  }, [
    t,
    today,
    handleReunionsUpdate,
    debouncedSetReunions,
    meetings.cached,
    meetings.error,
  ]); // Stable deps

  console.log("Rendering with", Object.keys(reunions).length, "reunions"); // Debug render count

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          {meetings.title}
        </h1>
        <p>{meetings.loading || "Loading reunions..."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Calendar className="mr-2 h-6 w-6" />
        {meetings.title} - {today}
      </h1>
      {changeMessage && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          {changeMessage}
        </div>
      )}
      {Object.keys(reunions).length === 0 ? (
        <p>{meetings.noMeetings || "No meetings available"}</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(reunions).map(([reunionLabel, races]) => (
            <div key={reunionLabel} className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{reunionLabel}</h2>
              <ul className="space-y-1">
                {races.map((race) => (
                  <li
                    key={race.race_label}
                    className="p-2 bg-white rounded flex justify-between items-center"
                  >
                    <span>
                      {race.race_is_quinte && " ⭐"} {race.race_label} -{" "}
                      {race.distance} ({race.discipline})
                    </span>
                    <span className="text-sm text-gray-600">
                      {race.start_time_in_s
                        ? new Date(
                            race.start_time_in_s / 1000
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "TBD"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reunion;
