import InsightCard from "./InsightCard";
import { MistralResponse } from "@/services/pdfService";

export type Insights = MistralResponse;

interface InsightsGridProps {
  insights: Insights;
}

const InsightsGrid = ({ insights }: InsightsGridProps) => {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <InsightCard
        title="Innovation"
        content={insights.innovation}
        icon={null}
        type="innovation"
      />
      <InsightCard
        title="Industry"
        content={insights.industry}
        icon={null}
        type="industry"
      />
      <InsightCard
        title="Problem"
        content={insights.problem}
        icon={null}
        type="problem"
      />
      <InsightCard
        title="Solution"
        content={insights.solution}
        icon={null}
        type="solution"
      />
      <InsightCard
        title="Funding"
        content={insights.funding}
        icon={null}
        type="funding"
      />
      <InsightCard
        title="Market"
        content={insights.market}
        icon={null}
        type="market"
      />
    </div>
  );
};

export default InsightsGrid;
