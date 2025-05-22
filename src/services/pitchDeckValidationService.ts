import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/utils/env";
import { toast } from "@/components/ui/sonner";

export interface ValidationResult {
    isPitchDeck: boolean;
    confidence: number;
    reason: string;
}

class PitchDeckValidationService {
    private model;
    private isApiKeyValid: boolean = false;

    constructor() {
        if (!ENV.GEMINI_API_KEY) {
            console.error('VITE_GEMINI_API_KEY is not set in your environment variables');
            toast.error('API key is not configured. Please check your environment settings.');
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
            this.model = genAI.getGenerativeModel({ 
                model: "gemini-pro"
            });
            this.isApiKeyValid = true;
        } catch (error) {
            console.error('Failed to initialize Gemini AI:', error);
            toast.error('Failed to initialize AI service. Please check your configuration.');
        }
    }

    async validatePitchDeck(content: string): Promise<ValidationResult> {
        if (!this.isApiKeyValid) {
            return {
                isPitchDeck: true,
                confidence: 0.5,
                reason: "Validation service is unavailable - proceeding with analysis"
            };
        }

        try {
            // Prepare a shorter sample of the content to analyze
            const contentSample = content.slice(0, 1500); // Take first 1500 characters

            const prompt = `Analyze this content and determine if it's from a pitch deck/startup presentation.
                Look for these key indicators:
                - Company/product introduction
                - Problem statement
                - Solution description
                - Market analysis
                - Business model
                - Team information
                - Financial projections
                - Investment ask

                Content to analyze:
                ${contentSample}

                Respond ONLY with a JSON object in this exact format:
                {
                    "isPitchDeck": true/false,
                    "confidence": number between 0 and 1,
                    "reason": "brief explanation"
                }`;

            const result = await this.model.generateContent([{
                parts: [{ text: prompt }]
            }]);

            const response = await result.response;
            const text = response.text();
            
            try {
                const jsonResponse = JSON.parse(text);
                return {
                    isPitchDeck: jsonResponse.isPitchDeck,
                    confidence: jsonResponse.confidence,
                    reason: jsonResponse.reason
                };
            } catch (e) {
                console.error("Failed to parse Gemini response:", e);
                return {
                    isPitchDeck: true,
                    confidence: 0.5,
                    reason: "Unable to validate format - proceeding with analysis"
                };
            }
        } catch (error) {
            console.error("Pitch deck validation error:", error);
            
            if (error.message?.includes('API key expired') || error.message?.includes('API_KEY_INVALID')) {
                toast.error('API key is expired or invalid. Please contact support.');
            } else if (error.message?.includes('not found for API version')) {
                toast.error('Invalid API configuration. Please check API version and model.');
            } else {
                toast.error('Validation service is temporarily unavailable.');
            }

            return {
                isPitchDeck: true,
                confidence: 0.5,
                reason: "Validation service error - proceeding with analysis"
            };
        }
    }
}

export const pitchDeckValidationService = new PitchDeckValidationService(); 