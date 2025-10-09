// src/components/reunions/Races.tsx
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../lib/api"; // Adjust path

interface RaceDetail {
  race_label: string;
  race_name: string;
  start_timestamp: number;
  race_status: string;
  distance: string;
  discipline: string;
  race_is_quinte: boolean;
}

interface Participant {
  num_pmu: string;
  type: "favori" | "tocard" | "watched";
  latest_odds?:
    | {
        time_diff: string;
        odds: string;
        odds_rank: string;
        odds_date?: string;
        big_bet: string;
      }
    | "No odds available"
    | "Error loading odds";
}

interface RacesProps {
  races: RaceDetail[];
  date: string;
  reunionLabel: string;
}

function Races({ races, date, reunionLabel }: RacesProps) {
  const [participantsByRace, setParticipantsByRace] = useState<
    Record<string, Participant[]>
  >({});
  const [loadingParticipants, setLoadingParticipants] = useState(true);

  useEffect(() => {
    const fetchAllParticipants = async () => {
      try {
        setLoadingParticipants(true);
        const participantsData: Record<string, Participant[]> = {};
        for (const race of races) {
          try {
            const response = await api.get(
              `/horse_selections/${date}/${reunionLabel}/${race.race_label}`
            );
            const { selected_horses } = response.data;
            participantsData[race.race_label] = selected_horses;
          } catch (error) {
            console.error(`Error for ${race.race_label}:`, error);
            participantsData[race.race_label] = [];
          }
        }
        setParticipantsByRace(participantsData);
      } finally {
        setLoadingParticipants(false);
      }
    };

    if (races.length > 0) fetchAllParticipants();
  }, [races, date, reunionLabel]);

  const getTypeClass = (type: string) => {
    switch (type) {
      case "favori":
        return "bg-green-100 text-green-800 border-green-300";
      case "tocard":
        return "bg-red-100 text-red-800 border-red-300";
      case "watched":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getOdds = (participant: Participant) =>
    typeof participant.latest_odds === "object"
      ? participant.latest_odds.odds
      : "N/A";

  if (races.length === 0)
    return <p className="text-gray-500">Aucune course.</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Clock className="mr-2 h-5 w-5" />
        Courses
      </h2>
      <ul className="space-y-2">
        {races.map((race) => {
          const participants = participantsByRace[race.race_label] || [];

          return (
            <li
              key={race.race_label}
              className="p-3 bg-gray-50 rounded border-l-4 border-blue-500"
            >
              {/* Race Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="text-left">
                  <div className="text-lg font-bold text-blue-600">
                    {race.start_timestamp
                      ? new Date(race.start_timestamp).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Europe/Paris",
                          }
                        )
                      : "TBD"}
                  </div>
                  <div className="text-xs text-gray-500 capitalize mt-1">
                    {race.race_status}
                  </div>
                  <div className="mt-1">
                    <span className="font-medium">{race.race_label}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {race.distance} ({race.discipline})
                    </span>
                    {race.race_is_quinte && (
                      <span className="ml-2 text-yellow-500">⭐ Quinté</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Embedded Participants Stack */}
              {loadingParticipants ? (
                <div className="text-xs text-gray-500">Chargement...</div>
              ) : participants.length === 0 ? (
                <div className="text-xs text-gray-500">Aucune sélection.</div>
              ) : (
                <div className="space-y-1 mt-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.num_pmu}
                      className={`flex justify-between items-center p-2 text-xs rounded border ${getTypeClass(
                        participant.type
                      )}`}
                    >
                      <span className="font-medium">
                        #{participant.num_pmu}
                      </span>
                      <span className="capitalize px-1">
                        {participant.type}
                      </span>
                      <span className="font-mono ml-auto">
                        {getOdds(participant)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Races;
