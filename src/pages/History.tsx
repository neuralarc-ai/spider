import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getHistory } from "@/services/historyService";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const History = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        setInsights(data || []);
      } catch (error) {
        console.error("Error loading insights:", error);
        toast.error("Failed to load insights history");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const handleViewInsight = (id: string) => {
    navigate(`/insight/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col grain-texture">
      <Navbar />
      <main className="flex-1 container py-8 px-4">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#202020' }}>Analysis History</h1>
          <p className="text-muted-foreground" style={{ color: '#202020' }}>
            View all your previously analyzed pitch decks
          </p>
        </section>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#2B2521' }} />
            <p className="mt-4 text-lg" style={{ color: '#696969' }}>Loading insights...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-white rounded-2xl p-6 cursor-pointer transition hover:shadow-md  flex flex-col items-start"
                onClick={() => handleViewInsight(insight.id)}
                style={{ color: '#202020' }}
              >
                {/* Icon at top left */}
                <img
                  src="/images/history.svg"
                  alt="history icon"
                  className="w-14 h-14 mb-4"
                />
                {/* Company name */}
                <div className="text-lg font-semibold mb-1" style={{ color: '#202020' }}>{insight.insights?.company_overview?.company_name || 'Company Name'}</div>
                {/* Timestamp */}
                <div className="text-sm mb-3" style={{ color: '#202020', opacity: 0.7 }}>
                  {insight.timestamp ? new Date(insight.timestamp).toLocaleString() : 'Timestamp'}
                </div>
                {/* Investment Potential tag */}
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium mb-5"
                  style={{ background: '#B7BEAE8A', color: '#3C4C27' }}
                >
                  Investment Potential: {typeof insight.insights?.investment_score === 'number' ? `${insight.insights.investment_score * 10}%` : 'N/A'}
                </span>
                {/* Divider */}
                <div className="w-full my-4 border-t border-[#E6E6E6]" />
                {/* Key Statistics */}
                <div className="w-full">
                  <div className="font-medium mb-3" style={{ color: '#202020' }}>Key Statistics</div>
                  <div className="flex flex-col gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium w-fit" style={{ background: '#2020200D', color: '#202020' }}>
                      Pitch Clarity: {typeof insight.insights?.pitch_clarity === 'number' ? `${insight.insights.pitch_clarity}/10` : 'N/A'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium w-fit" style={{ background: '#2020200D', color: '#202020' }}>
                      Investment Score: {typeof insight.insights?.investment_score === 'number' ? `${insight.insights.investment_score}/10` : 'N/A'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium w-fit" style={{ background: '#2020200D', color: '#202020' }}>
                      Market Position: {insight.insights?.market_position || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
