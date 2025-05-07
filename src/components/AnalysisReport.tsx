import React, { useEffect, useState } from "react";
import { MistralResponse } from "../services/pdfService";
import { format } from "date-fns";
import styles from "@/styles/upload.module.scss";
import {
  FileText,
  Globe,
  Download,
  History as HistoryIcon,
  ArrowRight,
} from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { saveToHistory } from "@/services/historyService";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Star } from "lucide-react";
import RadarChart from "./RadarChart";

interface AnalysisReportProps {
  data?: MistralResponse & {
    analyzedAt: Date;
  };
}

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  gridItem: {
    width: "50%",
    padding: 5,
  },
  label: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    padding: 5,
  },
  bulletPoint: {
    fontSize: 12,
    color: "#000000",
    marginLeft: 10,
    marginBottom: 5,
  },
  chart: {
    marginVertical: 20,
    alignItems: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  verdict: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 20,
    lineHeight: 1.5,
  },
});

const blackStrip = (title: string) => (
  <View style={{ backgroundColor: '#111', padding: 10, marginBottom: 10, borderRadius: 4 }}>
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{title}</Text>
  </View>
);

const PitchDeckPDF = ({ data }: AnalysisReportProps) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>Spider AI Analysis Report</Text>
        <Text style={pdfStyles.subtitle}>{data.company_overview.company_name}</Text>
        <Text style={pdfStyles.subtitle}>
          Industry: {data.industry_type} | Date: {format(data.analyzedAt, "MMMM dd yyyy")}
        </Text>
      </View>

      {/* Initial Assessment */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Initial Assessment</Text>
        <View style={pdfStyles.grid}>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Pitch Clarity</Text>
            <Text style={pdfStyles.value}>{data.pitch_clarity}/10</Text>
          </View>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Investment Score</Text>
            <Text style={pdfStyles.value}>{data.investment_score}/10</Text>
          </View>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Market Position</Text>
            <Text style={pdfStyles.value}>{data.market_position}</Text>
          </View>
        </View>
      </View>

      {/* Company Overview */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Company Overview</Text>
        <View style={pdfStyles.grid}>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Company Name</Text>
            <Text style={pdfStyles.value}>{data.company_overview.company_name}</Text>
          </View>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Business Model</Text>
            <Text style={pdfStyles.value}>{data.company_overview.business_model}</Text>
          </View>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Founded</Text>
            <Text style={pdfStyles.value}>{data.company_overview.founded_on || "N/A"}</Text>
          </View>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Key Offerings</Text>
            <Text style={pdfStyles.value}>
              {Array.isArray(data.company_overview.key_offerings)
                ? data.company_overview.key_offerings.join(", ")
                : data.company_overview.key_offerings}
            </Text>
          </View>
        </View>
      </View>

      {/* Strengths & Weaknesses */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Strengths & Weaknesses</Text>
        <View style={pdfStyles.grid}>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Strengths</Text>
            {data.strengths.map((strength, index) => (
              <Text key={index} style={pdfStyles.bulletPoint}>• {strength}</Text>
            ))}
          </View>
          <View style={pdfStyles.gridItem}>
            <Text style={pdfStyles.label}>Weaknesses</Text>
            {data.weaknesses.map((weakness, index) => (
              <Text key={index} style={pdfStyles.bulletPoint}>• {weakness}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Funding History */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Funding History</Text>
        {data.funding_history?.rounds?.length > 0 ? (
          <View style={pdfStyles.table}>
            <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
              <Text style={pdfStyles.tableCell}>Round</Text>
              <Text style={pdfStyles.tableCell}>Amount</Text>
              <Text style={pdfStyles.tableCell}>Key Investors</Text>
            </View>
            {data.funding_history.rounds.map((round, index) => (
              <View key={index} style={pdfStyles.tableRow}>
                <Text style={pdfStyles.tableCell}>{round.type}</Text>
                <Text style={pdfStyles.tableCell}>{round.amount}</Text>
                <Text style={pdfStyles.tableCell}>{round.key_investors?.join(", ")}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={pdfStyles.value}>No funding history available</Text>
        )}
      </View>

      {/* Competitor Analysis */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Competitor Analysis</Text>
        {data.competitor_analysis?.competitors?.length > 0 ? (
          <View style={pdfStyles.table}>
            <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
              <Text style={pdfStyles.tableCell}>Competitor</Text>
              <Text style={pdfStyles.tableCell}>Market Position</Text>
              <Text style={pdfStyles.tableCell}>Key Investors</Text>
            </View>
            {data.competitor_analysis.competitors.map((competitor, index) => (
              <View key={index} style={pdfStyles.tableRow}>
                <Text style={pdfStyles.tableCell}>{competitor.name}</Text>
                <Text style={pdfStyles.tableCell}>{competitor.market_position}</Text>
                <Text style={pdfStyles.tableCell}>{competitor.key_investors}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={pdfStyles.value}>No competitor data available</Text>
        )}
      </View>

      {/* Final Verdict */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Final Verdict</Text>
        <Text style={pdfStyles.score}>{data.investment_score}/10</Text>
        <Text style={pdfStyles.verdict}>
          {(() => {
            const score = data.investment_score;
            if (score >= 8) {
              return `${data.company_overview.company_name} presents an excellent investment opportunity with a strong position in the ${data.industry_type.toLowerCase()} sector. The company demonstrates exceptional market potential, innovative solutions, and a clear competitive advantage, making it a highly attractive investment prospect.`;
            } else if (score >= 5 && score <= 7) {
              return `${data.company_overview.company_name} shows promising investment potential in the ${data.industry_type.toLowerCase()} sector. While there are some areas for improvement, the company's market position and growth trajectory indicate good potential for returns.`;
            } else if (score >= 1 && score <= 4) {
              return `${data.company_overview.company_name} presents a moderate investment opportunity in the ${data.industry_type.toLowerCase()} sector. The company shows some potential but faces significant challenges that need to be addressed for better investment prospects.`;
            } else {
              return `${data.company_overview.company_name} currently presents a high-risk investment opportunity in the ${data.industry_type.toLowerCase()} sector. The company faces substantial challenges and requires significant improvements before being considered a viable investment option.`;
            }
          })()}
        </Text>
      </View>
    </Page>
  </Document>
);

type Competitor = {
  name: string;
  marketShare: string;
  keyInvestors: string;
  growthRate: string;
  keyDifferentiator: string;
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data }) => {
  const [showHistory, setShowHistory] = useState(false);

  // Prepare data for radar chart
  const chartData = [
    {
      subject: "Product Viability",
      value: data.final_verdict.product_viability,
    },
    {
      subject: "Financial Health",
      value: data.final_verdict.product_viability,
    },
    { subject: "Market Potential", value: data.final_verdict.market_potential },
    { subject: "Sustainability", value: data.final_verdict.sustainability },
    { subject: "Innovation", value: data.final_verdict.innovation },
    { subject: "Exit Potential", value: data.final_verdict.exit_potential },
    { subject: "Risk Factors", value: data.final_verdict.risk_factor },
    {
      subject: "Customer Traction",
      value: data.final_verdict.market_potential,
    },
    { subject: "Competitive Edge", value: data.final_verdict.competitive_edge },
    { subject: "Team Strength", value: data.final_verdict.innovation },
  ];

  useEffect(() => {
    // Save to history when component mounts (analysis is complete)
    if (data) {
      saveToHistory(data);
    }
  }, [data]);

  if (showHistory) {
    return (
      <div>
        <button
          onClick={() => setShowHistory(false)}
          className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10"
        >
          <FileText className="w-4 h-4" />
          Back to Analysis
        </button>
        <div className="history-view">
          {/* Add history view implementation here */}
          <p className="text-center text-gray-400">
            History view coming soon...
          </p>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (!data) {
    return (
      <div className={`${styles.gradientWrapper} font-fustat`}>
        <img
          src="/images/backgroundgradiant.png"
          alt="Gradient Background"
          className={styles.gradientBackground}
        />
        <div className={styles.innerBox}>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Loading analysis report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.gradientWrapper} font-fustat`}>
      <img
        src="/images/backgroundgradiant.png"
        alt="Gradient Background"
        className={styles.gradientBackground}
      />
      <div className={styles.innerBox}>
        <div className="flex flex-col items-start mb-4">
          <h4 className="text-xl font-medium text-white">
            Analysis For: {data.company_overview.company_name}
          </h4>
          <p className="text-gray-400 text-sm mt-1">
            Industry: {data.industry_type} | Date:{" "}
            {format(data.analyzedAt, "MMMM dd yyyy")}
          </p>
        </div>
        <div className="bg-[#212228] bg-opacity-50 backdrop-blur-md rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Pitch Analysis Card */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <div className="flex items-center mb-4 border border-[#ffffff1a] rounded-[48px] p-2 pl-6">
                <img src="/panalysis.svg" alt="Pitch Analysis" className="w-5 h-5 mr-3" />
                <h3 className="text-white text-lg font-medium">
                  Pitch Analysis
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between pl-2 pr-2 gap-20 text-left">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Clarity Score:</p>
                    <p className="text-white text-2xl font-bold">
                      {data.pitch_clarity}/10
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Sentiment:</p>
                    <p
                      className={`text-${data.reputation_analysis?.overall?.sentiment?.toLowerCase() ===
                        "positive"
                        ? "green"
                        : data.reputation_analysis?.overall?.sentiment?.toLowerCase() ===
                          "negative"
                          ? "red"
                          : "yellow"
                        }-500 font-medium`}
                    >
                      {data.reputation_analysis?.overall?.sentiment || "Neutral"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#ffffff1a]">
                  <p className="text-sm text-gray-300 text-left">
                    AI detected{" "}
                    <span className="font-medium">
                      {data.strengths?.length || 0} strengths
                    </span>{" "}
                    and{" "}
                    <span className="font-medium">
                      {data.weaknesses?.length || 0} potential issues
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Potential Card */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <div className="flex items-center mb-4 border border-[#ffffff1a] rounded-[48px] p-2 pl-6">
                <img src="/ipotential.svg" alt="Investment Potential" className="w-5 h-5 mr-3" />
                <h3 className="text-white text-lg font-medium">
                  Investment Potential
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between pl-2 pr-2 gap-20 text-left">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Score:</p>
                    <p className="text-white text-2xl font-bold">
                      {data.investment_score}/10
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Exit Potential:</p>
                    <p className="text-white font-medium">
                      {data.proposed_deal_structure?.valuation_cap ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#ffffff1a]">
                  <p className="text-sm text-gray-300 text-left">
                    {data.market_analysis?.growth_rate ? (
                      <>
                        Growth rate:{" "}
                        <span className="font-medium">
                          {data.market_analysis.growth_rate}
                        </span>{" "}
                        with{" "}
                        <span className="font-medium">
                          {data.final_verdict.risk_factor >= 7
                            ? "high"
                            : data.final_verdict.risk_factor >= 4
                              ? "moderate"
                              : "low"}{" "}
                          risk factors
                        </span>
                      </>
                    ) : (
                      "Market analysis data not available"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Market Position Card */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <div className="flex items-center mb-4 border border-[#ffffff1a] rounded-[48px] p-2 pl-6">
                <img src="/mposition.svg" alt="Market Position" className="w-5 h-5 mr-3" />
                <h3 className="text-white text-lg font-medium">
                  Market Position
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between pl-2 pr-2 gap-20 text-left">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Classification:</p>
                    <p className="text-white text-2xl font-bold">
                      {data.market_position}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Industry:</p>
                    <p className="text-gray-300 font-medium">
                      {data.industry_type}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#ffffff1a]">
                  <p className="text-sm text-gray-300 text-left">
                    {data.competitor_analysis?.competitors ? (
                      <>
                        Competing with{" "}
                        <span className="font-medium">
                          {data.competitor_analysis.competitors.length}{" "}
                          established players
                        </span>
                      </>
                    ) : (
                      "Competitor data not available"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
              <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
                Company Overview
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  ["Company Name:", data.company_overview.company_name],
                  ["Industry:", data.company_overview.industry],
                  ["Market Position:", data.company_overview.market_position],
                  ["Founded:", data.company_overview.founded_on || "N/A"],
                  ["Business Model:", data.company_overview.business_model],
                  ["Key Offerings:", data.company_overview.key_offerings],
                ].map(([label, value], i) => (
                  <div key={i} className="border-b border-[#ffffff1a] pb-4 grid grid-cols-[150px_1fr]">
                    <p className="text-gray-400 text-sm text-left">{label}</p>
                    <p className="text-white text-base text-left">{value}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
          <div>
            {/* Strengths & Weaknesses Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
              <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
                <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
                  Strengths & Weaknesses
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-green-500 text-lg pl-5 mb-4 text-left">
                      Strengths (Pros)
                    </h3>
                    <ul className="list-disc list-outside pl-5 text-left text-gray-300 text-sm space-y-3">
                      {data.strengths.map((strength, index) => (
                        <li key={index} className="leading-relaxed">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-red-500 pl-5 text-lg mb-4 text-left">
                      Weaknesses (Cons)
                    </h3>
                    <ul className="list-disc list-outside pl-5 text-left text-gray-300 text-sm space-y-3">
                      {data.weaknesses.map((weakness, index) => (
                        <li key={index} className="leading-relaxed">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Funding History Section */}
              <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
                <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
                  Funding History
                </h2>
                {data.funding_history?.rounds?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#ffffff1a]">
                          <th className="text-left py-3 px-4 text-gray-400 font-normal">
                            Round
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400 font-normal">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400 font-normal">
                            Key Investors
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400 font-normal">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.funding_history.rounds.map((round, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#ffffff1a] hover:bg-[#ffffff05] transition-colors"
                          >
                            <td className="py-3 px-4 text-white text-left">
                              {round.type || "Unknown Round"}
                            </td>
                            <td className="py-3 px-4 text-white text-left">
                              {round.amount || "Not disclosed"}
                            </td>
                            <td className="py-3 px-4 text-white text-left">
                              {round.key_investors?.length > 0
                                ? round.key_investors.join(", ")
                                : "Not disclosed"}
                            </td>
                            <td className="py-3 px-4 text-white text-left">
                              {round.date || "Not specified"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#ffffff10] flex items-center justify-center">
                      <HistoryIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      No Funding History Available
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      The pitch deck does not contain any funding history
                      information. This could be because the company is pre-seed
                      or has not disclosed their funding rounds.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            {/* Competitor Comparison Section */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
                Competitor Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff1a]">
                      <th className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]">
                        Competitor
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]">
                        Key Investors
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]">
                        Amount Raised
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]">
                        Market Position
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Strengths
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.competitor_analysis.competitors.map(
                      (competitor, index) => (
                        <tr
                          key={index}
                          className={index === data.competitor_analysis.competitors.length - 1 ? '' : 'border-b border-[#ffffff1a]'}
                        >
                          <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                            {competitor.name}
                          </td>
                          <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                            {competitor.key_investors}
                          </td>
                          <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                            {competitor.amount_raised}
                          </td>
                          <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                            {competitor.market_position}
                          </td>
                          <td className="py-4 px-4 text-white text-left">
                            {competitor.strengths}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Market Comparison Section */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
                Market Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff1a]">
                      <th className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]">
                        {data.company_overview.company_name}
                      </th>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <th
                            key={index}
                            className="text-left py-3 px-4 text-gray-400 font-normal border-r border-[#ffffff1a]"
                          >
                            {competitor.name}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        Market Share
                      </td>
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        {data.market_position}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.market_position}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        Growth Rate
                      </td>
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        {data.market_analysis.growth_rate}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.growth_rate || "N/A"}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        Revenue Model
                      </td>
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        {data.company_overview.business_model}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.business_model || "N/A"}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        Key Differentiator
                      </td>
                      <td className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]">
                        {data.strengths[0] || "N/A"}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-white text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.key_differentiator || "N/A"}
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exit Potential Section */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
                Exit Potential
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1a1b1f] rounded-xl p-6">
                  <h3 className="text-gray-400 mb-4 text-left">Exit Likelihood</h3>
                  <div className="relative pt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2 relative">
                      <div
                        className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-1000 ease-out"
                        style={{ width: `${(data.final_verdict.exit_potential / 10) * 100}%` }}
                      ></div>
                      <div className="absolute -top-12 right-0 bg-[#F38416]/10 border border-[#F38416] text-[#FFC491] px-5 py-2 rounded-[48px] text-sm">
                        {data.final_verdict.exit_potential}/10
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1a1b1f] rounded-xl p-6">
                  <h3 className="text-gray-400 mb-4 text-left">Potential Exit Value</h3>
                  <p className="text-3xl font-semibold text-white text-left">
                    {data.proposed_deal_structure?.valuation_cap ||
                      "Not disclosed"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expert Insights Section */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
              Expert Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expert Opinions Card */}
              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-xl text-white mb-4 text-left border-b border-[#ffffff1a] pb-4">Expert Opinion</h3>
                {data.expert_opinions && data.expert_opinions.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="text-white text-lg font-medium">
                      {data.expert_opinions[0].name}
                    </h4>
                    <p className="text-gray-400 mb-2">
                      {data.expert_opinions[0].affiliation}
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      {data.expert_opinions[0].summary}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Reference: {data.expert_opinions[0].reference} | Date:{" "}
                      {data.expert_opinions[0].date}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-400 text-lg font-medium mb-2">
                      No Expert Opinion Available
                    </h4>
                    <p className="text-gray-500 text-sm">
                      No expert opinions were found for this analysis.
                    </p>
                  </div>
                )}
              </div>

              {/* Reputation Analysis Card */}
              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-xl text-white mb-6 text-left border-b border-[#ffffff1a] pb-4">Reputation Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400  text-left">
                          News/Media
                        </td>
                        <td className="py-3 text-white text-left">
                          {data.expert_insights?.reputation_analysis
                            ?.news_media || (
                              <span className="text-xs text-gray-500 text-left">N/A</span>
                            )}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {(() => {
                            const score =
                              data.expert_insights?.reputation_analysis
                                ?.news_media || 0;
                            const fullStars = Math.floor(score / 2);
                            const halfStar = score % 2 >= 1 ? 1 : 0;
                            return (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => {
                                  if (i < fullStars) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-gray-600"
                                      />
                                    );
                                  }
                                })}
                              </>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400 text-left">
                          Social Media
                        </td>
                        <td className="py-3 text-white text-left">
                          {data.expert_insights?.reputation_analysis
                            ?.social_media || (
                              <span className="text-xs text-gray-500 text-left">N/A</span>
                            )}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {(() => {
                            const score =
                              data.expert_insights?.reputation_analysis
                                ?.social_media || 0;
                            const fullStars = Math.floor(score / 2);
                            const halfStar = score % 2 >= 1 ? 1 : 0;
                            return (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => {
                                  if (i < fullStars) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-gray-600"
                                      />
                                    );
                                  }
                                })}
                              </>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400 text-left">
                          Investor Reviews
                        </td>
                        <td className="py-3 text-white text-left">
                          {data.expert_insights?.reputation_analysis
                            ?.investor_reviews || (
                              <span className="text-xs text-gray-500 text-left">N/A</span>
                            )}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {(() => {
                            const score =
                              data.expert_insights?.reputation_analysis
                                ?.investor_reviews || 0;
                            const fullStars = Math.floor(score / 2);
                            const halfStar = score % 2 >= 1 ? 1 : 0;
                            return (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => {
                                  if (i < fullStars) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-gray-600"
                                      />
                                    );
                                  }
                                })}
                              </>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400 text-left">
                          Customer Feedback
                        </td>
                        <td className="py-3 text-white text-left">
                          {data.expert_insights?.reputation_analysis
                            ?.customer_feedback || (
                              <span className="text-xs text-gray-500 text-left">N/A</span>
                            )}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {(() => {
                            const score =
                              data.expert_insights?.reputation_analysis
                                ?.customer_feedback || 0;
                            const fullStars = Math.floor(score / 2);
                            const halfStar = score % 2 >= 1 ? 1 : 0;
                            return (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => {
                                  if (i < fullStars) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-gray-600"
                                      />
                                    );
                                  }
                                })}
                              </>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-gray-400 text-left">
                          Overall
                        </td>
                        <td className="py-3 text-white font-semibold text-left">
                          {data.expert_insights?.reputation_analysis
                            ?.overall || (
                              <span className="text-xs text-gray-500 text-left">N/A</span>
                            )}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {(() => {
                            const score =
                              data.expert_insights?.reputation_analysis
                                ?.overall || 0;
                            const fullStars = Math.floor(score / 2);
                            const halfStar = score % 2 >= 1 ? 1 : 0;
                            return (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => {
                                  if (i < fullStars) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-gray-600"
                                      />
                                    );
                                  }
                                })}
                              </>
                            );
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Proposed Deal Structure */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
              Proposed Deal Structure
            </h2>
            {(!data.proposed_deal_structure ||
              (!data.proposed_deal_structure.investment_amount &&
                !data.proposed_deal_structure.valuation_cap &&
                !data.proposed_deal_structure.equity_stake &&
                !data.proposed_deal_structure.liquidation_preference &&
                !data.proposed_deal_structure.anti_dilution_protection &&
                !data.proposed_deal_structure.board_seat &&
                !data.proposed_deal_structure.vesting_schedule)) ? (
              <div className="bg-[#1a1b1f] rounded-xl p-8 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No Deal Structure Information</h3>
                  <p className="text-gray-400">No deal structure information was proposed or disclosed in the deck</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.proposed_deal_structure.investment_amount && data.proposed_deal_structure.investment_amount !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">
                      Investment Amount
                    </h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.investment_amount}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">
                      Investment Amount
                    </h3>
                    <p className="text-gray-400 text-sm text-left">The company has not disclosed their investment ask in the pitch deck</p>
                  </div>
                )}

                {data.proposed_deal_structure.equity_stake && data.proposed_deal_structure.equity_stake !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">Equity Stake</h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.equity_stake}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">Equity Stake</h3>
                    <p className="text-gray-400 text-sm text-left">The company has not specified the equity stake they are offering</p>
                  </div>
                )}

                {data.proposed_deal_structure.valuation_cap && data.proposed_deal_structure.valuation_cap !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">Valuation Cap</h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.valuation_cap}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">Valuation Cap</h3>
                    <p className="text-gray-400 text-sm text-left">The company has not provided their valuation expectations</p>
                  </div>
                )}

                {data.proposed_deal_structure.liquidation_preference && data.proposed_deal_structure.liquidation_preference !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">
                      Liquidation Preference
                    </h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.liquidation_preference}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">
                      Liquidation Preference
                    </h3>
                    <p className="text-gray-400 text-sm text-left">Liquidation preference terms have not been specified in the deck</p>
                  </div>
                )}

                {data.proposed_deal_structure.anti_dilution_protection && data.proposed_deal_structure.anti_dilution_protection !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">
                      Anti-Dilution Protection
                    </h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.anti_dilution_protection}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">
                      Anti-Dilution Protection
                    </h3>
                    <p className="text-gray-400 text-sm text-left">Anti-dilution protection terms have not been disclosed</p>
                  </div>
                )}

                {data.proposed_deal_structure.board_seat && data.proposed_deal_structure.board_seat !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">Board Seat</h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.board_seat}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">Board Seat</h3>
                    <p className="text-gray-400 text-sm text-left">Board seat arrangements have not been mentioned in the deck</p>
                  </div>
                )}

                {data.proposed_deal_structure.vesting_schedule && data.proposed_deal_structure.vesting_schedule !== "Not specified" ? (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-white text-base mb-2 text-left">
                      Vesting Schedule
                    </h3>
                    <p className="text-white text-2xl text-left">
                      {data.proposed_deal_structure.vesting_schedule}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1b1f] rounded-xl p-6">
                    <h3 className="text-gray-400 text-base mb-2 text-left">
                      Vesting Schedule
                    </h3>
                    <p className="text-gray-400 text-sm text-left">The company has not outlined their vesting schedule in the pitch deck</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Key Questions Section */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
              Key Questions
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-[#1a1b1f] p-4 rounded-lg ">
                <h3 className="text-sm font-medium text-white mb-2 text-left">
                  {data.key_questions?.market_strategy?.question ||
                    "What is the market strategy?"}
                </h3>
                <p className="text-sm text-gray-400 text-left">
                  {data.key_questions?.market_strategy?.answer || "N/A"}
                </p>
              </div>
              <div className="bg-[#1a1b1f] p-4 rounded-lg ">
                <h3 className="text-sm font-medium text-white mb-2 text-left">
                  {data.key_questions?.user_retention?.question ||
                    "How is user retention handled?"}
                </h3>
                <p className="text-sm text-gray-400 text-left">
                  {data.key_questions?.user_retention?.answer || "N/A"}
                </p>
              </div>
              <div className="bg-[#1a1b1f] p-4 rounded-lg ">
                <h3 className="text-sm font-medium text-white mb-2 text-left">
                  {data.key_questions?.regulatory_risks?.question ||
                    "What are the regulatory risks?"}
                </h3>
                <p className="text-sm text-gray-400 text-left">
                  {data.key_questions?.regulatory_risks?.answer || "N/A"}
                </p>
              </div>
            </div>
          </div>
          {/* Final Verdict Section */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-medium text-white mb-8 border-b border-[#ffffff1a] pb-4 text-left">
              Final Verdict
            </h2>

            {/* Company Analysis Card */}
            <div className="bg-[#1a1b1f] rounded-xl p-6 mb-6">
              <h3 className="text-xl text-white mb-2 text-left">
                {data.company_overview.company_name}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed mb-8 text-left">
                {(() => {
                  const score = data.investment_score;
                  if (score >= 8) {
                    return `${data.company_overview.company_name} presents an excellent investment opportunity with a strong position in the ${data.industry_type.toLowerCase()} sector. The company demonstrates exceptional market potential, innovative solutions, and a clear competitive advantage, making it a highly attractive investment prospect.`;
                  } else if (score >= 5 && score <= 7) {
                    return `${data.company_overview.company_name} shows promising investment potential in the ${data.industry_type.toLowerCase()} sector. While there are some areas for improvement, the company's market position and growth trajectory indicate good potential for returns.`;
                  } else if (score >= 1 && score <= 4) {
                    return `${data.company_overview.company_name} presents a moderate investment opportunity in the ${data.industry_type.toLowerCase()} sector. The company shows some potential but faces significant challenges that need to be addressed for better investment prospects.`;
                  } else {
                    return `${data.company_overview.company_name} currently presents a high-risk investment opportunity in the ${data.industry_type.toLowerCase()} sector. The company faces substantial challenges and requires significant improvements before being considered a viable investment option.`;
                  }
                })()}
              </p>
              {/* Investment Potential Bar */}
              <div className="mb-8 border border-[#ffffff1a] rounded-xl p-6">
                <div className="flex justify-between items-center mb-2 ">
                  <span className="text-gray-400">Investment Potential</span>
                  <span className="text-white bg-[#ffffff1a] px-3 py-1 rounded-full text-sm">
                    {data.investment_score * 10}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 relative">
                  <div
                    className="bg-white h-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    style={{
                      width: `${data.investment_score * 10}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Radar Chart and Metrics Grid */}
              <div className="flex flex-row gap-8 items-start justify-center">
                <div className="flex flex-col">
                  {/* Radar Chart */}
                  <div
                    style={{ width: 590, height: 420 }}
                    className="flex-shrink-0"
                  >
                    <RadarChart data={{
                      product_viability: data.final_verdict.product_viability,
                      market_potential: data.final_verdict.market_potential,
                      sustainability: data.final_verdict.sustainability,
                      innovation: data.final_verdict.innovation,
                      exit_potential: data.final_verdict.exit_potential,
                      risk_factors: data.final_verdict.risk_factor,
                      financial_health: data.final_verdict.product_viability,
                      customer_traction: data.final_verdict.market_potential,
                      competitive_edge: data.final_verdict.competitive_edge,
                      team_strength: data.final_verdict.innovation
                    }} />
                  </div>

                  {/* Performance Analysis Title */}
                  <h3 className="text-xl text-white mt-14 mb-2 text-center">
                    Performance Analysis
                  </h3>
                </div>

                {/* Metrics List */}
                <div className="space-y-4 flex-1 min-w-[220px]">
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Product Viability</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.product_viability}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Market Potential</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.market_potential}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Sustainability</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.sustainability}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Exit Potential</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.exit_potential}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Risk Factors</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.risk_factor}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Innovation</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.innovation}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Competitive Edge</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.competitive_edge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Download and Regenerate Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <PDFDownloadLink
            document={<PitchDeckPDF data={data} />}
            fileName={`${data.company_overview.company_name}-analysis.pdf`}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#36EEFC] to-[#693597] text-white rounded-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300"
          >
            
            Download Analysis
            <Download className="w-5 h-5" />
          </PDFDownloadLink>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-[#343434] text-white rounded-lg hover:shadow-[white] transition-all duration-300"
          >
            
            Generate New Report
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;