import axios from 'axios';

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

export const analisisPesanAI = async (teks) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.3-70b-versatile", // Model gratis yang sangat pintar
        messages: [
          {
            role: "system",
            content: `Analisis apakah pesan ini scam/penipuan. 
            Berikan output JSON: 
            { "skor": 0-100, "level": "AMAN/BAHAYA", "alasan": "singkat", "modus": "nama modus" }`
          },
          { role: "user", content: teks }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Groq AI Error:", error);
    return { skor: 0, level: "ERROR", alasan: "Gagal terhubung ke AI gratisan." };
  }
};