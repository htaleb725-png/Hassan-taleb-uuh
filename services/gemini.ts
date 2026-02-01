
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types.ts";

// استخدام حماية لضمان عدم تعطل التطبيق إذا كان process غير معرف
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export const performSmartOCR = async (base64Image: string): Promise<OCRResult> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
        { text: "تحلل هذا المستند الرسمي واستخرج المعلومات بدقة عالية جداً. إذا لم تجد حقلاً معيناً اترك قيمته فارغة." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          applicantName: { type: Type.STRING, description: "اسم مقدم الطلب الكامل" },
          recipient: { type: Type.STRING, description: "الجهة الموجه إليها الكتاب" },
          subject: { type: Type.STRING, description: "موضوع الكتاب أو الطلب" },
          date: { type: Type.STRING, description: "تاريخ الكتاب بصيغة YYYY-MM-DD" },
          fullText: { type: Type.STRING, description: "النص الكامل المستخرج من الصورة" }
        },
        required: ["applicantName", "recipient", "subject", "date", "fullText"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("Parsing Error", e);
    throw new Error("فشل في تحليل بيانات المستند هيكلياً.");
  }
};
