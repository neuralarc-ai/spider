import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env";

export async function testGeminiAPI() {
    try {
        const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro"
        });

        const result = await model.generateContent([{
            parts: [{ text: "Hello, are you working? Please respond with 'Yes, I am working.'" }]
        }]);

        const response = await result.response;
        const text = response.text();
        console.log("Gemini API Test Response:", text);
        return true;
    } catch (error) {
        console.error("Gemini API Test Error:", error);
        return false;
    }
} 