// src/components/reunions/Participants.tsx
import { Users } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useI18n } from "../../i18n/I18nContext";
import api from "../../lib/api";
import io, { Socket } from "socket.io-client";
import { Participant } from "./types";

interface ParticipantsProps {
  date: string;
  reunionLabel: string;
  raceLabel: string;
}

function Participants({ date, reunionLabel, raceLabel }: ParticipantsProps) {
  const { t } = useI18n();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchInitialSelections = async () => {
      try {
        const response = await api.get(
          `/horse_selections/${date}/${reunionLabel}/${raceLabel}`
        );
        const { selected_horses } = response.data;
        console.log("Fetched initial selections:", selected_horses);
        setParticipants(selected_horses);
      } catch (error: unknown) {
        console.error("Error fetching initial selections:", error);
        setParticipants([]); // Or fallback from cache/localStorage
      } finally {
        setLoading(false);
      }
    };

    const connectSocket = () => {
      if (socketRef.current) {
        console.log("Participants socket already exists—reusing");
        return;
      }

      socketRef.current = io("http://localhost:5010");

      const socket = socketRef.current;
      socket.on("connect", () => {
        console.log("Participants socket connected");
        // Join the specific race room for selections updates
        const room = `${date}:${reunionLabel}:${raceLabel}`;
        socket.emit("join", {
          date,
          reunion_label: reunionLabel,
          race_label: raceLabel,
        }); // Use existing 'join' event if it supports selections
        console.log("Joined room for selections:", room);
      });

      socket.on(
        "selection_update",
        (data: { selected_horses: Participant[] }) => {
          console.log("Received selection update:", data);
          setParticipants(data.selected_horses || []);
        }
      );

      socket.on("connect_error", (error) => {
        console.error("Participants connect error:", error);
        setLoading(false);
      });

      socket.on("error", (data) => {
        console.error("Server error in participants:", data.message);
        // Optional: set error state
      });
    };

    fetchInitialSelections();
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [date, reunionLabel, raceLabel]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-5 w-5" />
          {t.participants.title}
        </h2>
        <p className="text-gray-500">{t.participants.loading}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="mr-2 h-5 w-5" />
        {t.participants.title}
      </h2>
      {participants.length === 0 ? (
        <p className="text-gray-500">{t.participants.noSelections}</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((participant) => {
            const getTypeClass = (type: string) => {
              switch (type) {
                case "favori":
                  return "bg-green-50 border-l-4 border-green-500";
                case "tocard":
                  return "bg-red-50 border-l-4 border-red-500";
                case "watched":
                  return "bg-blue-50 border-l-4 border-blue-500";
                default:
                  return "bg-gray-50 border-l-4 border-gray-500";
              }
            };

            const odds =
              typeof participant.latest_odds === "object"
                ? participant.latest_odds
                : null;

            return (
              <li
                key={participant.num_pmu}
                className={`p-3 rounded flex justify-between items-center ${getTypeClass(
                  participant.type
                )}`}
              >
                <div className="flex items-center">
                  <span className="font-medium mr-2">
                    #{participant.num_pmu}
                  </span>
                  <span className="font-medium">{participant.name}</span>
                  <span className="ml-2 px-2 py-1 text-xs rounded bg-white capitalize">
                    {participant.type}
                  </span>
                </div>
                <div className="text-right">
                  {odds ? (
                    <>
                      <div className="text-lg font-bold text-green-600">
                        {odds.odds} {odds.big_bet && "💰"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.participants.rank}: {odds.odds_rank} | {odds.time_diff}
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {participant.latest_odds}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Participants;
