
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface MapsGroundingProps {
  query: string;
  onResult: (text: string, links: { title: string; uri: string }[]) => void;
}

const MapsGrounding: React.FC<MapsGroundingProps> = ({ query, onResult }) => {
  const [loading, setLoading] = useState(false);

  const fetchMapsData = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Get user location for better grounding
      let location = { latitude: -1.2921, longitude: 36.8219 }; // Default Nairobi
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        location = { 
          latitude: pos.coords.latitude, 
          longitude: pos.coords.longitude 
        };
      } catch (e) {
        console.warn("Location access denied, using default.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: location
            }
          }
        },
      });

      const text = response.text || "No detailed information found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks
        .filter((c: any) => c.maps)
        .map((c: any) => ({
          title: c.maps.title || "View on Maps",
          uri: c.maps.uri
        }));

      onResult(text, links);
    } catch (error) {
      console.error("Maps Grounding Error:", error);
      onResult("Failed to fetch live map data.", []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={fetchMapsData}
      disabled={loading}
      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
    >
      {loading ? (
        <span className="animate-pulse">Searching Satellite Data...</span>
      ) : (
        <>
          <span className="text-sm">📍</span> Verify Local Market Data
        </>
      )}
    </button>
  );
};

export default MapsGrounding;
