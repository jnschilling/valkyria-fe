// src/components/reunions/Odds.tsx
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRef } from "react";

interface OddsData {
  num_pmu: string;
  name: string;
  latest_odds: {
    odds: string;
    odds_rank: string;
    big_bet: string;
    odds_time: string;
  };
}

interface OddsProps {
  date: string;
  reunionLabel: string;
  raceLabel: string;
}

function Odds({ date, reunionLabel, raceLabel }: OddsProps) {
  const [oddsList, setOddsList] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const connectSocket = () => {
      if (socketRef.current) return;

      socketRef.current = io("http://localhost:5010");

      socketRef.current.on("connect", () => {
        console.log("Odds socket connected");
        socketRef.current?.emit("join_odds", {
          // Assume backend event for odds
          date,
          reunion_label: reunionLabel,
          race_label: raceLabel,
        });
      });

      socketRef.current.on(
        "odds_update",
        (data: { horse_id: string; data: any }) => {
          console.log("Received odds update:", data);
          setOddsList((prev) =>
            prev.map((horse) =>
              horse.num_pmu === data.horse_id
                ? { ...horse, latest_odds: data.data }
                : horse
            )
          );
          setLoading(false);
        }
      );

      socketRef.current.on("connect_error", (error) => {
        console.error("Odds connect error:", error);
        setLoading(false);
      });
    };

    connectSocket();

    // Initial fetch (if REST exists)
    // api.get(`/horse_selections/${date}/${reunionLabel}/${raceLabel}`).then(res => {
    //   setOddsList(res.data.selected_horses.map(horse => ({ ...horse, latest_odds: horse.latest_odds })));
    // });

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
          <TrendingUp className="mr-2 h-5 w-5" />
          Cotes
        </h2>
        <p className="text-gray-500">Chargement des cotes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2 h-5 w-5" />
        Cotes des Chevaux
      </h2>
      {oddsList.length === 0 ? (
        <p className="text-gray-500">
          Aucune cote disponible pour cette course.
        </p>
      ) : (
        <ul className="space-y-2">
          {oddsList
            .sort(
              (a, b) =>
                parseFloat(a.latest_odds.odds) - parseFloat(b.latest_odds.odds)
            ) // Sort by odds ascending
            .map((odds) => (
              <li
                key={odds.num_pmu}
                className="p-3 rounded flex justify-between items-center bg-gray-50"
              >
                <span className="font-medium">
                  {odds.name} (#{odds.num_pmu})
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {odds.latest_odds.odds}
                    {odds.latest_odds.big_bet && " 💰"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Rang: {odds.latest_odds.odds_rank} |{" "}
                    {odds.latest_odds.odds_time}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Odds;
