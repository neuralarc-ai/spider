import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getAnalysisReport } from "@/services/storageService";
import { MistralResponse } from "@/services/pdfService";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const Insight = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<MistralResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsight = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("No insight ID provided");
        }
        const data = await getAnalysisReport(`analysis-${id}`);
        setInsight(data.insights);
      } catch (error) {
        console.error("Error loading insight:", error);
        toast.error("Failed to load insight details");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    loadInsight();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple" />
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No insight data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col grain-texture">
      <Navbar />
      <main className="flex-1 container py-8 px-4 max-w-3xl mx-auto">
        <section className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-2 ">Analysis Report</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of the pitch deck
          </p>
        </section>

        {/* Company Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Company Overview</h2>
          <div className="mb-2"><strong>Company Name:</strong> {insight.company_overview.company_name}</div>
          <div className="mb-2"><strong>Industry:</strong> {insight.company_overview.industry}</div>
          <div className="mb-2"><strong>Business Model:</strong> {insight.company_overview.business_model}</div>
          <div className="mb-2"><strong>Key Offerings:</strong> {insight.company_overview.key_offerings}</div>
          <div className="mb-2"><strong>Founded On:</strong> {insight.company_overview.founded_on || insight.company_overview.founded_year || 'Not available'}</div>
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Market Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Market Analysis</h2>
          <div className="mb-2"><strong>Market Size:</strong> {insight.market_analysis.market_size}</div>
          <div className="mb-2"><strong>Growth Rate:</strong> {insight.market_analysis.growth_rate}</div>
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Strengths & Weaknesses */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Strengths & Weaknesses</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Strengths</h3>
              <ul className="list-disc list-inside ml-6">
                {insight.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Weaknesses</h3>
              <ul className="list-disc list-inside ml-6">
                {insight.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Funding History */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Funding History</h2>
          {insight.funding_history?.rounds && insight.funding_history.rounds.length > 0 ? (
            <ul className="list-disc list-inside ml-6">
              {insight.funding_history.rounds.map((round, index) => (
                <li key={index} className="mb-1">
                  <strong>{round.type}:</strong> Amount: {round.amount}, Key Investors: {round.key_investors.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <div>No funding history specified in the pitch deck.</div>
          )}
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Expert Opinions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Expert Opinions</h2>
          {insight.expert_opinions && insight.expert_opinions.length > 0 ? (
            <ul className="list-disc list-inside ml-6">
              {insight.expert_opinions.map((opinion, idx) => (
                <li key={idx} className="mb-4">
                  <div className="mb-1"><strong>Name:</strong> {opinion.name}</div>
                  <div className="mb-1"><strong>Affiliation:</strong> {opinion.affiliation}</div>
                  <div className="mb-1"><strong>Summary:</strong> {opinion.summary}</div>
                  <div className="mb-1"><strong>Reference:</strong> {opinion.reference}</div>
                  <div className="mb-1"><strong>Date:</strong> {opinion.date}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div>No expert opinions available.</div>
          )}
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Competitor Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Competitor Analysis</h2>
          {insight.competitor_analysis.competitors.length > 0 ? (
            <ul className="list-disc list-inside ml-6">
              {insight.competitor_analysis.competitors.map((competitor, index) => (
                <li key={index} className="mb-1">
                  <strong>{competitor.name}</strong> - Market Position: {competitor.market_position}, Key Investors: {competitor.key_investors}, Amount Raised: {competitor.amount_raised}, Strengths: {competitor.strengths}
                </li>
              ))}
            </ul>
          ) : (
            <div>No competitor data available.</div>
          )}
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Market Comparison */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Market Comparison</h2>
          <div className="mb-2"><strong>Growth Rate:</strong> {insight.market_comparison.metrics.startup.growth_rate}</div>
          <div className="mb-2"><strong>Market Share:</strong> {insight.market_comparison.metrics.startup.market_share}</div>
          <div className="mb-2"><strong>Revenue Model:</strong> {insight.market_comparison.metrics.startup.revenue_model}</div>
          <div className="mb-2"><strong>Differentiator:</strong> {insight.market_comparison.metrics.startup.differentiator}</div>
        </section>
        <hr className="my-8 border-t border-gray-300" />
        {/* Final Verdict */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Final Verdict</h2>
          <div className="mb-2"><strong>Product Viability:</strong> {insight.final_verdict.product_viability}/10</div>
          <div className="mb-2"><strong>Market Potential:</strong> {insight.final_verdict.market_potential}/10</div>
          <div className="mb-2"><strong>Sustainability:</strong> {insight.final_verdict.sustainability}/10</div>
          <div className="mb-2"><strong>Innovation:</strong> {insight.final_verdict.innovation}/10</div>
          <div className="mb-2"><strong>Exit Potential:</strong> {insight.final_verdict.exit_potential}/10</div>
          <div className="mb-2"><strong>Risk Factor:</strong> {insight.final_verdict.risk_factor}/10</div>
          <div className="mb-2"><strong>Competitive Edge:</strong> {insight.final_verdict.competitive_edge}/10</div>
          <p className="text-white text-base leading-relaxed mb-8 text-left" style={{ background: '#2B2521', borderRadius: 8, padding: '20px' }}>
            {(() => {
              const score = insight.investment_score ?? insight.final_verdict?.product_viability;
              const companyName = insight.company_overview.company_name;
              const industry = insight.industry_type || insight.company_overview.industry || "the industry";
              if (score >= 8) {
                return `${companyName} presents an excellent investment opportunity with a strong position in the ${industry.toLowerCase()} sector. The company demonstrates exceptional market potential, innovative solutions, and a clear competitive advantage, making it a highly attractive investment prospect.`;
              } else if (score >= 5 && score <= 7) {
                return `${companyName} shows promising investment potential in the ${industry.toLowerCase()} sector. While there are some areas for improvement, the company's market position and growth trajectory indicate good potential for returns.`;
              } else if (score >= 1 && score <= 4) {
                return `${companyName} presents a moderate investment opportunity in the ${industry.toLowerCase()} sector. The company shows some potential but faces significant challenges that need to be addressed for better investment prospects.`;
              } else {
                return `${companyName} currently presents a high-risk investment opportunity in the ${industry.toLowerCase()} sector. The company faces substantial challenges and requires significant improvements before being considered a viable investment option.`;
              }
            })()}
          </p>
        </section>
      </main>
    </div>
  );
};

export default Insight; 