import { useEffect, useState } from "react";
import { Flag, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useI18n } from "../i18n/I18nContext";
import { Header } from "./Header";

interface Race {
  id: string;
  number: number;
  name: string;
  start_time: string;
}

interface Meeting {
  id: string;
  name: string;
  date: string;
  location: string;
  races: Race[];
}

export function MeetingsPage() {
  const { t } = useI18n();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);

      const today = new Date().toISOString().split("T")[0];

      const { data: meetingsData, error: meetingsError } = await supabase
        .from("meetings")
        .select("*")
        .eq("date", today)
        .order("date", { ascending: true });

      if (meetingsError) throw meetingsError;

      if (meetingsData) {
        const meetingsWithRaces = await Promise.all(
          meetingsData.map(async (meeting) => {
            const { data: racesData } = await supabase
              .from("races")
              .select("*")
              .eq("meeting_id", meeting.id)
              .order("number", { ascending: true });

            return {
              ...meeting,
              races: racesData || [],
            };
          })
        );

        setMeetings(meetingsWithRaces);
      }
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">{t.meetings.loading}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-lg text-slate-600">{t.meetings.noMeetings}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">
                      {meeting.name}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {meeting.location}
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {meeting.races.map((race) => (
                      <div
                        key={race.id}
                        className="px-6 py-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                              <Flag className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">
                                {t.meetings.race} {race.number}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {race.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-700">
                              {new Date(race.start_time).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
