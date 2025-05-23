import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import { processPitchDeck } from "@/services/pdfService";
import { saveToHistory } from "@/services/historyService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";
import styles from "@/styles/upload.module.scss";
import spidergo from "../../public/la_spider.svg"

const starfieldVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
};

const ellipseVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1 } },
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsLoading(true);
    setInsights(null);
    setProgress(0);

    try {
      // Document Processing (0-30%)
      setProgress(5);
      const { pdfUrl, analysis } = await processPitchDeck(file);
      setProgress(30);

      // Startup Profile Analysis (30-50%)
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      setProgress(50);

      // Market Analysis (50-70%)
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      setProgress(70);

      // Save to history (70-90%)
      setProgress(80);
      await saveToHistory(analysis, pdfUrl);
      setProgress(90);

      // Final Report Generation (90-100%)
      setProgress(95);
      setInsights(analysis);
      setProgress(100);

      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      // Keep the progress at 100% briefly before resetting
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const steps = [
    "Document Processing",
    "Startup Profile",
    "Market Analysis",
    "Sentiment Analysis",
    "Report Generation",
  ];

  // Start loading and progress simulation
  const startProcessing = () => {
    setIsLoading(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsLoading(false); // hide loader when done
          return prev;
        }
      });
    }, 2000); // Adjust timing as needed
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden grain-texture">
      <Navbar />

      <div className="flex-grow bg-[#FBFBF8]">
        <h1
          className="text-center text-5xl font-bold mb-8"
          style={{
            color: "#1E1E1E",

            WebkitBackgroundClip: "text",
            // WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 700,
            fontFamily: "Fustat, sans-serif",
            fontSize: "48px",
            marginTop: "32px",
          }}
        >
          {isLoading
            ? "Analyzing"
            : insights && !isLoading
              ? "Analysis Report"
              : "AI-Powered Pitch Deck & Investment Analysis"}
        </h1>

        <div className={styles.uploadContainer}>
          {!insights && !isLoading && (
            <div className={styles.gradientWrapper}>

              <div className={styles.innerBox}>
                <h2 className="font-fustat text-[#232323] font-semibold text-[20px] leading-[24px] tracking-[-0.01em] text-center mb-2 ">
                  Upload Your Pitch Deck
                </h2>

                <div
                  className={styles.uploadArea}
                  onClick={handleUploadClick}
                  role="button"
                  tabIndex={0}
                >
                  <FileUpload
                    ref={fileInputRef}
                    onFileSelected={handleFileSelected}
                    isLoading={isLoading}
                  />
                </div>

                <div className={styles.disclaimerContainer}>
                  <div className={styles.requiredIndicator}>
                    <h2 className="text-[18px] font-bold text-black font-[Fustat]">Disclaimer</h2>
                    <span className={styles.asterisk}>*</span>
                  </div>
                  <div className={styles.disclaimerCheckbox}>
                    <input
                      type="checkbox"
                      id="disclaimer"
                      checked={isDisclaimerAccepted}
                      onChange={(e) => setIsDisclaimerAccepted(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <div className={styles.disclaimerText}>
                      <p className="font-[Fustat] font-normal text-[16px] leading-[24px] tracking-[-0.4%] text-[#676767]">
                        This website is a platform developed and maintained by NeuralArc. All information, content, tools, and services provided through this platform are intended solely for use by authorized personnel for official and approved purposes.
                        The materials and data provided are offered on an "as is" and "as available" basis. No warranties, either express or implied, are made regarding the accuracy, completeness, reliability, or availability of the content on this platform. Use of the site is at your own risk.
                        Unauthorized access, distribution, modification, or misuse of this website or its data is strictly prohibited and may result in disciplinary action and/or legal proceedings under applicable laws and organizational policies.
                      </p>
                    </div>
                  </div>
                </div>
                <div>

                  <button
                    onClick={handleAnalyze}
                    className={styles.analyzeButton}
                    disabled={!file || isLoading || !isDisclaimerAccepted}
                    
                  >
                    <img src={spidergo} alt="spidergo" />
                    Go Spider - Analysis Now
                    
                  </button>
                </div>

              </div>
            </div>
          )}

          {isLoading && (
            <div>
              <LoadingScreen
                progress={progress}
              />
              <div className={styles.disclaimerContainer}>
                <div className={styles.disclaimerText}>
                  <h2 className="text-[18px] font-bold mb-2 text-red-500 font-fustat">Important Notice</h2>
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-white text-justify leading-relaxed text-lg font-fustat">
                      Please stay on the screen. Do not refresh or change screen while analysis is in progress. This process will take a few minutes to complete.
                    </p>
                    <p className="text-white text-lg mt-2 font-fustat">
                      Thank you for patience!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {insights && !isLoading && (
            <div className="mt-8">
              <AnalysisReport data={insights} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
