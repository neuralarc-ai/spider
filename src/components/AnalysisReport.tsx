import React, { useEffect, useState } from "react";
import { MistralResponse } from "../services/pdfService";
import { format } from "date-fns";
// import styles from "@/styles/upload.module.scss";
import downloadlogo from "../../public/List item (4).svg"
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
import search from "../../public/pitch search.svg"
import potential from "../../public/potential.svg"
import saved from "../../public/saved.svg"

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
  // if (!data) {
  //   return (
  //     <div className={`${styles.gradientWrapper} font-fustat`}>
  //       <img
  //         src="/images/backgroundgradiant.png"
  //         alt="Gradient Background"
  //         className={styles.gradientBackground}
  //       />
  //       <div className={styles.innerBox}>
  //         <div className="flex flex-col items-center justify-center min-h-[400px]">
  //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
  //           <p className="text-gray-400">Loading analysis report...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className= "font-fustat">
      
      <div  >
        <div className="flex justify-between items-center ">
          <div className="flex flex-col items-start justify-center">
          <h4 className="font-[Fustat] text-[32px] leading-[28px] tracking-[-0.02em] text-black">
              <span className="font-semibold">Analysis for - </span>
              <span className="font-bold">{data.company_overview.company_name}</span>
            </h4>
            <p className=" font-fustat font-normal text-[16px] leading-[28px] tracking-[-0.004em] text-[#696969] mt-2">
            Industry: {data.industry_type} | Date:{" "}
            {format(data.analyzedAt, "MMMM dd yyyy")}
            </p>
          </div>
         <div className="w-16 h-16 rounded-full bg-black bg-opacity-5 flex justify-center items-center">
          <PDFDownloadLink
            document={<PitchDeckPDF data={data} />}
            fileName={`${data.company_overview.company_name}-analysis.pdf`}
            className="w-16 h-16 rounded-full bg-black bg-opacity-5 flex justify-center items-center cursor-pointer"
          >
            <img
              src={downloadlogo}
              className="w-[72px] h-[72px] object-contain"
              alt="Download Analysis"
            />
          </PDFDownloadLink>
         </div>
           
        </div>
        
        <div className="rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Pitch Analysis Card */}
            <div className="  rounded-[12px] p-[6px] gap-[24px] border border-[rgba(255,255,255,0.04)] bg-[#FFFFFF]">
              <div className="flex items-center justify-between p-[20px] mb-4 rounded-md border-[1.5px] border-solid border-[#0000000D] ">
              
                <h3 className="text-lg text-black font-[Fustat] font-medium text-[21px] leading-[20px] tracking-[0]">
                  Pitch Analysis
                </h3>
                <img src={search} alt="Pitch Analysis" className="w-5 h-5 mr-3" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between pl-6 pr-6 gap-20 ">
                  <div>
                    <p className="font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle text-black">Clarity Score:</p>
                    <span className="font-[Fustat] font-semibold text-[24px] leading-[40px] tracking-[-0.004em] align-middle">
                      {data.pitch_clarity}/10
                    </span>
                  </div>
                  <div>
                    <p className="text-black font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle  ">Sentiment:</p>
                    <p
                  className={`font-[Fustat] font-semibold text-[24px] leading-[40px] tracking-[-0.004em] align-middle text-${
                    data.reputation_analysis?.overall?.sentiment?.toLowerCase() === "positive"
                      ? "green"
                      : data.reputation_analysis?.overall?.sentiment?.toLowerCase() === "negative"
                      ? "red"
                      : "yellow"
                  }-500`}
                >
                  {data.reputation_analysis?.overall?.sentiment || "Neutral"}
                </p>

                  </div>
                </div>
                
                <div className="pt-4 bg-[#B7BEAE] items-center rounded-[8px] p-[24px_26px] gap-[16px] justify-center">
                  <div>
                  <p className="font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle text-black">
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
            </div>

            {/* Investment Potential Card */}
            <div className=" rounded-[12px] p-[6px] gap-[24px] border border-[rgba(255,255,255,0.04)] bg-[#FFFFFF]">
              <div className="flex items-center justify-between p-[20px] mb-4 rounded-md border-[1.5px] border-solid border-[#0000000D]">

                 <h3 className="text-lg text-black font-[Fustat] font-medium text-[21px] leading-[20px] tracking-[0]">
                  Investment Potential
                </h3>
                <img src={potential} alt="Investment Potential" className="w-5 h-5 mr-3" />
              </div>
              <div className="space-y-4">
                <div className=" flex items-center justify-between pl-6 pr-6 gap-20 ">
                  <div>
                    <p className="font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle text-black"> Score:</p>
                      <span className="font-[Fustat] font-semibold text-[24px] leading-[40px] tracking-[-0.004em] align-middle">
                        {data.pitch_clarity}/10
                      </span>
                  </div>
                  <div>
                    <p className="text-black font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle ">Exit Potential:</p>
                    <p className="font-[Fustat] font-semibold text-[24px] leading-[40px] tracking-[-0.004em] align-middle text">
                      {data.proposed_deal_structure?.valuation_cap ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 bg-[#C6AEA3] items-center rounded-[8px] p-[24px_26px] gap-[16px] ">
                  <p className="font-[Fustat] font-normal text-[16px] tracking-[-0.004em] ">
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
            <div className=" rounded-[12px] p-[6px] gap-[24px] border border-[rgba(255,255,255,0.04)] bg-[#FFFFFF]">
              <div className="flex items-center justify-between p-[20px] mb-4 rounded-md border-[1.5px] border-solid border-[#0000000D]">
              
                <h3 className="text-lg text-black font-[Fustat] font-medium text-[21px] leading-[20px] tracking-[0]">
                  Market Position
                </h3>
                <img src= {saved} alt="Market Position" className="w-5 h-5 mr-3" />
              </div>
              <div className="space-y-4">
                <div className=" flex items-center justify-between pl-6 pr-6 gap-20 ">
                  <div>
                  <p className="font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle text-black">Classification:</p>
                      <span className="font-[Fustat] font-semibold text-[24px] leading-[40px] tracking-[-0.004em] align-middle">
                        {data.pitch_clarity}/10
                      </span>
                  </div>
                  <div>
                    <p className="text-black font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle">Industry:</p>
                    <p className="font-[Fustat] font-semibold text-[24px] leading-[40px] tracking-[-0.004em] align-middle text-black">
                      {data.industry_type}
                    </p>
                  </div>
                </div>

                <div className= "pt-4 bg-[#A9A9A9] items-center rounded-[8px] p-[24px_26px] gap-[16px] ">
                  <p className="font-[Fustat] font-normal text-[16px] leading-[40px] tracking-[-0.004em] align-middle text-black">
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

            <div className=" bg-[#FFFFFF] mt-3 p-[40px_32px] rounded-[12px] gap-[24px]" >
              <h2 className="font-medium text-black mb-1 border-b border-[#ffffff1a] pb-4 text-left font-[Fustat] text-[32px] leading-[24px] tracking-[-0.02em] align-middle">
                Company Overview
              </h2>
               <div className="border-t border-[rgba(0,0,0,0.1)] pb-4 mb-3"> </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  ["Company Name:", data.company_overview.company_name],
                  ["Industry:", data.company_overview.industry],
                  ["Market Position:", data.company_overview.market_position],
                  ["Founded:", data.company_overview.founded_on || "N/A"],
                  ["Business Model:", data.company_overview.business_model],
                  ["Key Offerings:", data.company_overview.key_offerings],
                ].map(([label, value], i) => (
                  <div key={i} className={`border-b border-[rgba(0,0,0,0.1)] pb-4 grid grid-cols-[150px_1fr] ${i === 5  ? 'border-b-0' : ''}`}>
                    <p className="font-[Fustat] font-semibold text-[16px] leading-[24px] tracking-[-0.02em]">{label}</p>
                    <p className="text-[#4F4F4F] font-[Fustat] font-normal text-[16px] leading-[24px] tracking-[-0.02em]">{value}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
          <div>
            {/* Strengths & Weaknesses Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8 ">
              <div className="bg-[#FFFFFF] border border-[#ffffff1a] rounded-xl p-6 flex flex-col gap-y-3">
                <h2 className="font-[Fustat] font-medium text-[32px] leading-[24px] tracking-[-0.02em] align-middle">
                  Strengths & Weaknesses
                </h2>
                <div className="opacity-50 border border-[#202020] mt-3"> 
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className=" text-lg  mb-4 text-left mt-6 font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle    bg-gradient-to-r from-[#9AB973] to-[#588321] bg-clip-text text-transparent"
                         
                        >
                      Strengths (Pros)
                    </h3>
                      <ul className="list-disc list-outside pl-5 text-left text-black text-sm space-y-3">
                      {data.strengths.map((strength, index) => (
                        <li key={index} className="leading-relaxed">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className=" text-lg mb-4 text-left mt-6 font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle
             bg-gradient-to-r from-[#C0907B] to-[#D95A56] bg-clip-text text-transparent">
                      Weaknesses (Cons)
                    </h3>
                    <ul className="list-disc list-outside pl-5 text-left text-black text-sm space-y-3">
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
              <div className="bg-[#FFFFFF] border border-[#ffffff1a] rounded-xl p-6">
                <h2 className="text-2xl font-medium mb-2 border-b border-[#ffffff1a] pb-4 text-left font-[Fustat] text-[32px] leading-[24px] tracking-[-0.02em] align-middle text-[#222222]">
                  Funding History
                </h2>
                <div className="opacity-50 border border-[#202020] ">

                 </div>
                {data.funding_history?.rounds?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#ffffff1a]">
                          <th className="text-left py-3 px-4 font-semibold font-[Fustat] text-[20px] leading-[24px] tracking-[-0.004em] text-[#222222] align-middle">
                            Round
                          </th>
                          <th className="text-left py-3 px-4 font-semibold font-[Fustat] text-[20px] leading-[24px] tracking-[-0.004em] text-[#222222] align-middle">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 font-semibold font-[Fustat] text-[20px] leading-[24px] tracking-[-0.004em] text-[#222222] align-middle">
                            Key Investors
                          </th>
                          <th >
                            <h6 className="text-left py-3 px-4 font-semibold font-[Fustat] text-[20px] leading-[24px] tracking-[-0.004em] text-[#222222] align-middle "> Date </h6>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.funding_history.rounds.map((round, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#ffffff1a] hover:bg-[#ffffff05] transition-colors"
                          >
                            <td className="py-3 px-4 text-black text-left font-[Fustat]">
                              {round.type || "Unknown Round"}
                            </td>
                            <td className="py-3 px-4 text-black text-left font-[Fustat]">
                              {round.amount || "Not disclosed"}
                            </td>
                            <td className="py-3 px-4 text-black text-left font-[Fustat]">
                              {round.key_investors?.length > 0
                                ? round.key_investors.join(", ")
                                : "Not disclosed"}
                            </td>
                            <td className="py-3 px-4 text-black text-left   font-[fustat]">
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
                    <h3 className="text-xl font-medium text-white mb-2 ">
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
            <div className="bg-[#FFFFFF] border-[#ffffff1a] rounded-xl p-6 mb-8">
              <h2 className="text-2xl text-black border-b border-[#ffffff1a] pb-4 text-left font-[Fustat] font-medium text-[32px] leading-[24px] tracking-[-0.02em] align-middle">
                Competitor Comparison
              </h2>

            <div className="opacity-50 border border-[#202020] mb-3">

            </div>
              
             
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff1a]">
                      <th className="font-[Fustat] text-left font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle">
                        Competitor
                      </th>
                      <th className=" font-[Fustat] text-left font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle">
                        Key Investors
                      </th>
                      <th className="font-[Fustat] text-left font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle">
                        Amount Raised
                      </th>
                      <th className="font-[Fustat] text-left font-semibold text-[20px] leading-[24px] tracking-[-0.004em]  align-middle">
                        Market Position
                      </th>
                      <th className="font-[Fustat] text-left font-semibold text-[20px] leading-[24px] tracking-[-0.004em]  align-middle">
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
                          <td className="py-4 font-[Fustat] font-normal text-[20px] leading-[24px] tracking-[-0.01em] text-[#4F4F4F]">
                            {competitor.name}
                          </td>
                          <td className="py-4 px-4 border-l" style={{ borderColor: '#0000001A' }}>
                            {competitor.key_investors}
                          </td>
                          <td className="py-4 px-4 border-l" style={{ borderColor: '#0000001A' }}>
                            {competitor.amount_raised}
                          </td>
                          <td className="py-4 px-4 border-l" style={{ borderColor: '#0000001A' }}>
                            {competitor.market_position}
                          </td>
                          <td className="py-4 px-4 border-l" style={{ borderColor: '#0000001A' }}>
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
            <div className=" bg-[#FFFFFF] border-[#ffffff1a] rounded-xl p-6 mb-8">
              <h2 className="pb-4 font-[Fustat] font-medium text-[32px] leading-[24px] tracking-[-0.02em] align-middle text-[#000000] ">
                Market Comparison
              </h2>
              <div className="overflow-x-auto mt-2">
                <table className="w-full">
                  <thead className="bg-[#A8B0B8] rounded-md pt-[16px] pr-[88px] pb-[16px] pl-[56px]">
                    <tr className="border-b border-[#ffffff1a]">
                      <th className="text-left py-3 px-4 font-[Fustat] font-medium text-[20px] leading-[24px] tracking-[-0.004em] align-middle">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 font-[Fustat] font-medium text-[20px] leading-[24px] tracking-[-0.004em] align-middle">
                        {data.company_overview.company_name}
                      </th>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <th
                            key={index}
                            className="text-left py-3 px-4 font-[Fustat] font-medium text-[20px] leading-[24px] tracking-[-0.004em] align-middle"
                          >
                            {competitor.name}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-[#4F4F4F] font-[fustat] text-left border-r border-[#ffffff1a]">
                        Market Share
                      </td>
                      <td className="py-4 px-4 text-[#4F4F4F]  font-[fustat]  text-left border-r border-[#ffffff1a]">
                        {data.market_position}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-[#4F4F4F] font-[fustat]  text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.market_position}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-[#4F4F4F]  font-[fustat] text-left border-r border-[#ffffff1a] ">
                        Growth Rate
                      </td>
                      <td className="py-4 px-4 text-[#4F4F4F]  font-[fustat] text-left border-r border-[#ffffff1a]">
                        {data.market_analysis.growth_rate}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-[#4F4F4F]  font-[fustat] text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.growth_rate || "N/A"}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-[#4F4F4F] font-[fustat] text-left border-r border-[#ffffff1a]">
                        Revenue Model
                      </td>
                      <td className="py-4 px-4 text-[#4F4F4F] font-[fustat] text-left border-r border-[#ffffff1a]">
                        {data.company_overview.business_model}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-[#4F4F4F] font-[fustat]  text-left border-r border-[#ffffff1a]"
                          >
                            {competitor.business_model || "N/A"}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-[#4F4F4F] font-[fustat]  text-left border-r border-[#ffffff1a]">
                        Key Differentiator
                      </td>
                      <td className="py-4 px-4 text-[#4F4F4F] font-[fustat]  text-left border-r border-[#ffffff1a]">
                        {data.strengths[0] || "N/A"}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td
                            key={index}
                            className="py-4 px-4 text-[#4F4F4F]  font-[fustat] text-left border-r border-[#ffffff1a]"
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
            <div className=" bg-[#FFFFFF] rounded-xl p-6">
              <h2 className="  font-[Fustat] text-[32px] leading-[24px] tracking-[-0.02em] align-middle text-2xl font-medium text-black mb-3 border-b border-[#ffffff1a] pb-4 text-left">
                Exit Potential
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1E342F] rounded-xl p-6">
                  <h3 className="mb-4 font-[Fustat] font-normal text-[24px] leading-[20px] tracking-[0em] text-white items-center">Exit Likelihood</h3>
                  <div className="relative pt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2 relative">
                      <div
                        className="h-full  items-center rounded-full shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(data.final_verdict.exit_potential / 10) * 100}%`,
                          background: 'linear-gradient(90deg, #262626 -45.63%, #3987BE 23.66%, #D48EA3 86.59%)'
                        }}
                      ></div>
                      <div className="absolute -top-12 right-0  px-5 py-2 rounded-[48px] font-[Fustat] font-normal text-[32px] leading-[21.67px] tracking-[0em] text-white">
                        {data.final_verdict.exit_potential}/10
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" bg-[#1E342F] flex justify-between items-center rounded-xl p-8">
                  <div className="justify-center items-center"> 
                    <h3 className=" font-[Fustat] font-normal text-[18px] leading-[20px] tracking-[0em] text-white">Potential Exit Value</h3>
                  </div>
                  <div className="justify-center items-center">
                      <p className=" font-[Fustat] font-medium text-[32px] leading-[20px] tracking-[0em] text-white">
                        {data.proposed_deal_structure?.valuation_cap ||
                          "Not disclosed"}
                      </p>
                  </div>
                
                 
                </div>
              </div>
            </div>
          </div>

          {/* Expert Insights Section */}
          <div className="bg-[#FFFFFF] border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl  mb-8 border-b border-[#ffffff1a] pb-4 text-left font-[Fustat] font-medium text-[32px] leading-[24px] tracking-[-0.02em] align-middle text-black">
              Expert Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expert Opinions Card */}
              <div className="bg-[#E3E2DF] rounded-xl p-6">
                <h3 className="text-xl text-[#363636] mb-4 text-left border-b border-[#ffffff1a] pb-4">Expert Opinion</h3>
                {data.expert_opinions && data.expert_opinions.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="text-[#363636] text-lg text-left font-[Fustat] font-medium text-[20px] leading-[24px] tracking-[-0.004em] align-middle">
                      {data.expert_opinions[0].name}
                    </h4>
                    <p className=" text-[#363636] mb-2 text-left font-[Fustat] font-semibold text-[20px] leading-[30px] tracking-[-0.004em] align-middle">
                      {data.expert_opinions[0].affiliation}
                    </p>
                    <p className="text-[#363636] mb-2 text-left font-[Fustat] font-semibold text-[20px] leading-[30px] tracking-[-0.004em] align-middle ">
                      {data.expert_opinions[0].summary}
                    </p>
                    <p className="text-[#363636] text-sm text-left">
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
                    <h4 className="text-[#363636] text-lg font-medium mb-2">
                      No Expert Opinion Available
                    </h4>
                    <p className="text-[#363636] text-sm">
                      No expert opinions were found for this analysis.
                    </p>
                  </div>
                )}
              </div>

              {/* Reputation Analysis Card */}
              <div className="bg-[#E3E2DF] rounded-xl p-6">
                <h3 className="text-xl mb-6 text-left border-b border-[#ffffff1a] pb-4 font-[Fustat] font-medium text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">Reputation Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
                          News/Media
                        </td>
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
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
                                        className="w-4 h-4 text-white-[#363636] fill-[#363636]"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-white-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
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
                        <td className=" py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
                          Social Media
                        </td>
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
                          {data.expert_insights?.reputation_analysis
                            ?.social_media || (
                              <span className="text-xs text-gray- text-left">N/A</span>
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
                                        className="w-4 h-4 text-[#363636] fill-[#363636]"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-white-400"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
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
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
                          Investor Reviews
                        </td>
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
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
                                        className="w-4 h-4 text-[#363636] fill-[#363636]"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
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
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
                          Customer Feedback
                        </td>
                        <td className=" py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
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
                                        className="w-4 h-4 text-white-400 fill-[#363636]"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
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
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
                          Overall
                        </td>
                        <td className="py-3  text-left font-[Fustat] font-semibold text-[20px] leading-[24px] tracking-[-0.004em] align-middle text-[#363636]">
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
                                        className="w-4 h-4 text-[#363636] fill-[#363636]"
                                      />
                                    );
                                  } else if (i === fullStars && halfStar) {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
                                        style={{
                                          fill: "url(#halfStarGradient)",
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-[#363636]"
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
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl pt-2 mt-8">
            <h2 className=" font-medium mb-8 pb-2 text-left font-[Fustat] text-[32px] leading-[40px] tracking-[-0.02em] align-middle text-[#000000]">
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
              <div className="bg-[#FFFFFF] rounded-xl p-8 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No Deal Structure Information</h3>
                  <p className="text-gray-400">No deal structure information was proposed or disclosed in the deck</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {data.proposed_deal_structure.investment_amount && data.proposed_deal_structure.investment_amount !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6 ">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Investment Amount
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.investment_amount}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Investment Amount
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">The company has not disclosed their investment ask in the pitch deck</p>
                  </div>
                )}

                {data.proposed_deal_structure.equity_stake && data.proposed_deal_structure.equity_stake !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">Equity Stake</h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.equity_stake}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">Equity Stake</h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">The company has not specified the equity stake they are offering</p>
                  </div>
                )}

                {data.proposed_deal_structure.valuation_cap && data.proposed_deal_structure.valuation_cap !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">Valuation Cap</h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.valuation_cap}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">Valuation Cap</h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">The company has not provided their valuation expectations</p>
                  </div>
                )}

                {data.proposed_deal_structure.liquidation_preference && data.proposed_deal_structure.liquidation_preference !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Liquidation Preference
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.liquidation_preference}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Liquidation Preference
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">Liquidation preference terms have not been specified in the deck</p>
                  </div>
                )}

                {data.proposed_deal_structure.anti_dilution_protection && data.proposed_deal_structure.anti_dilution_protection !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Anti-Dilution Protection
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.anti_dilution_protection}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Anti-Dilution Protection
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">Anti-dilution protection terms have not been disclosed</p>
                  </div>
                )}

                {data.proposed_deal_structure.board_seat && data.proposed_deal_structure.board_seat !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">Board Seat</h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.board_seat}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">Board Seat</h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">Board seat arrangements have not been mentioned in the deck</p>
                  </div>
                )}

                {data.proposed_deal_structure.vesting_schedule && data.proposed_deal_structure.vesting_schedule !== "Not specified" ? (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Vesting Schedule
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">
                      {data.proposed_deal_structure.vesting_schedule}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] rounded-xl p-6">
                    <h3 className="text-base mb-2 text-left font-[Fustat] font-medium text-[18px] leading-[20px] tracking-[0em] text-[#646464]">
                      Vesting Schedule
                    </h3>
                    <p className="font-[Fustat] font-medium text-[27px] leading-[28px] tracking-[0em] text-[#000000]">The company has not outlined their vesting schedule in the pitch deck</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Key Questions Section */}
          <div className="bg-[#FFFFFF] border border-[#ffffff1a] rounded-xl p-6 mt-8">
          <h2 className="font-medium mb-3 pt-2 pb-4 text-left font-[Fustat] text-[32px] leading-[24px] tracking-[-0.02em] align-middle text-[#000000] rounded-xl">
              Key Questions for the Startup
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-3 rounded-md">
              <div className="bg-[#CFD2D4] p-8 rounded-[12px]">
                <h3 className="mb-4 text-left text-[#202020] font-fustat font-semibold text-[24px] leading-[24px] tracking-[-2%]">
                  {data.key_questions?.market_strategy?.question ||
                    "What is the market strategy?"}
                </h3>
                <p className="text-left text-[#202020] font-fustat font-normal text-[20px] leading-[32px] tracking-[0%] ">
                  {data.key_questions?.market_strategy?.answer || "N/A"}
                </p>
              </div>
              <div className="bg-[#CFD2D4] p-8 rounded-[12px]">
                <h3 className="mb-4 text-left text-[#202020] font-fustat font-semibold text-[24px] leading-[24px] tracking-[-2%]">
                  {data.key_questions?.user_retention?.question ||
                    "How is user retention handled?"}
                </h3>
                <p className="text-left text-[#202020] font-fustat font-normal text-[20px] leading-[32px] tracking-[0%] ">
                  {data.key_questions?.user_retention?.answer || "N/A"}
                </p>
              </div>
              <div className="bg-[#CFD2D4] p-8 rounded-[12px]">
                <h3 className="mb-4 text-left text-[#202020] font-fustat font-semibold text-[24px] leading-[24px] tracking-[-2%]">
                  {data.key_questions?.regulatory_risks?.question ||
                    "What are the regulatory risks?"}
                </h3>
                <p className="text-left text-[#202020] font-fustat font-normal text-[20px] leading-[32px] tracking-[0%] ">
                  {data.key_questions?.regulatory_risks?.answer || "N/A"}
                </p>
              </div>
            </div>
          </div>
          {/* Final Verdict Section */}
          <div className=" bg-[#2B2521] border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <div className="flex justify-between items-center mb-3">
                <h2 className="mb-8 pb-4 text-left font-[Fustat] font-medium text-2xl leading-9 tracking-[-0.02em] align-middle text-[white]">
                  Final Verdict
                </h2>
                <div className="relative flex items-center justify-center mb-6" style={{ width: 150, height: 70 }}>
                  {/* Gradient Border */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50px',
                      padding: 8,
                      background: 'linear-gradient(90deg, #CFD2D4 0%, #45FAC2 95.42%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                  {/* Main Content with background */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50px',
                      background: 'linear-gradient(90deg, #C6AEA3 0%, #8EE3F0 95.42%)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span className="font-[Fustat] font-bold text-[32px] text-[#202020]">{data.investment_score * 10}%</span>
                  </div>
                </div>
            </div>
           

            {/* Company Analysis Card */}
            <div className="bg-[#FFFFFF0D] bg-opacity-[0.05] rounded-xl p-6 mb-6">
              <h3 className="text-[#FFFFFF] mb-2 text-left font-[Fustat] font-bold text-[32px] leading-[100%] ">
                {data.company_overview.company_name}
              </h3>
              <p className="text-[#A9A9A9] text-base leading-relaxed mb-8 text-left">
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
              <div className="mb-8 rounded-xl mt-3">
                <div className="flex justify-between items-center mb-2 ">
                  <span className="text-gray-400 mb-5">Investment Potential</span>
                  <span className="text-white bg-[#ffffff1a] px-3 py-1 rounded-full text-sm">
                    {data.investment_score * 10}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(data.investment_score / 10) * 100}%`,
                        background: 'linear-gradient(90deg, #262626 -45.63%, #3987BE 23.66%, #D48EA3 86.59%)'
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
                  <div className="border border-white/25 rounded-xl p-4 flex justify-between items-center ">
                    <span className="text-gray-300">Product Viability</span>
                    <div className="border-l-[0.5px] border-white/25 h-full"></div>

                    <span className="text-white text-lg">
                      {data.final_verdict.product_viability}
                    </span>
                  </div>
                  <div className=" border border-white/25 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Market Potential</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.market_potential}
                    </span>
                  </div>
                  <div className="border border-white/25 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Sustainability</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.sustainability}
                    </span>
                  </div>
                  <div className="border border-white/25 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Exit Potential</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.exit_potential}
                    </span>
                  </div>
                  <div className="border border-white/25 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Risk Factors</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.risk_factor}
                    </span>
                  </div>
                  <div className="border border-white/25 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Innovation</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.innovation}
                    </span>
                  </div>
                  <div className="border border-white/25 rounded-xl p-4 flex justify-between items-center">
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
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-[#343434] text-white rounded-lg hover:shadow-[white] transition-all duration-300 mx-auto"
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