import { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  content: string | string[];
  icon: ReactNode;
  type: string;
}

const InsightCard = ({ title, content }: InsightCardProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      {Array.isArray(content) ? (
        <ul className="list-disc list-inside ml-6">
          {content.map((point, idx) => (
            <li key={idx} className="mb-1">{point}</li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-muted-foreground mb-2">{content}</p>
      )}
    </div>
  );
};

export default InsightCard;
