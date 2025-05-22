export const getEnvVar = (key: string): string => {
    // For Vite, we use import.meta.env
    return import.meta.env[key] || '';
};

export const ENV = {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
}; 