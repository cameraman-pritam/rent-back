import React, { createContext, useContext, useState } from "react";
import { supabase } from "../utils/supabase"; // Adjust path to your Supabase client

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sends a prompt to your Supabase Edge Function.
   * @param {string} prompt - The user's question or data.
   * @param {string} functionName - The name of your deployed Edge Function (default: 'openai-chat').
   */
  const askAI = async (prompt, functionName = "ai-backend") => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        functionName,
        {
          body: { prompt },
        },
      );

      if (invokeError) throw new Error(invokeError.message);

      setAiResponse(data.text);
      return data.text;
    } catch (err) {
      const msg = err.message || "Failed to reach AI assistant";
      setError(msg);
      console.error("AI_CONTEXT_ERROR:", msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to clear the previous AI answer (useful when closing a modal)
  const clearAI = () => setAiResponse(null);

  const value = {
    askAI,
    aiResponse,
    isLoading,
    error,
    clearAI,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

// Custom hook for easy access in components
// eslint-disable-next-line react-refresh/only-export-components
export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
