type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

export type CookingAssistantContext = {
  recipeTitle: string;
  ingredients: string[];
  steps: string[];
  currentStep: number;
  timerSeconds: number;
  timerRunning: boolean;
  conversation: Array<{ role: "user" | "assistant"; text: string }>;
};

const GEMINI_MODEL = process.env["GEMINI_MODEL"] || "gemini-3.5-flash-lite";

export const cookingAssistantService = {
  async answer(question: string, context: CookingAssistantContext): Promise<string> {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      const error = new Error("GEMINI_API_KEY is not configured");
      (error as Error & { statusCode?: number }).statusCode = 503;
      throw error;
    }

    const history = context.conversation.slice(-6).map((item) => `${item.role === "user" ? "Người nấu" : "Trợ lý"}: ${item.text}`).join("\n");
    const prompt = `Bạn là trợ lý bếp nói chuyện tự nhiên, ấm áp và thực tế với người đang nấu món "${context.recipeTitle}".
Trả lời bằng tiếng Việt, tối đa 3 câu ngắn, dùng đơn vị dễ hiểu. Hiểu câu hỏi tự nhiên, câu hỏi thiếu dấu, hỏi tiếp theo ngữ cảnh và cả những vấn đề phù hợp khi nấu ăn như thay thế nguyên liệu, định lượng, sơ chế, nhiệt độ, thời gian, độ chín, an toàn thực phẩm, dị ứng, bảo quản, xử lý lỗi và điều chỉnh khẩu vị.
Chỉ tư vấn trong phạm vi nấu ăn. Nếu thiếu dữ kiện, hỏi lại một câu cụ thể. Không bịa rằng bạn nhìn thấy món ăn hay biết chính xác nhiệt độ bên trong. Với thịt/gia cầm/trứng/hải sản, nhắc kiểm tra chín an toàn khi cần. Không đưa hướng dẫn nguy hiểm (lửa, dao, điện, hóa chất); hãy khuyên dừng bếp và nhờ người lớn/chuyên gia khi phù hợp.
Bạn có thể đề xuất hành động tiếp theo nhưng không tự nhận đã bấm nút. Ngữ cảnh hiện tại: bước ${context.currentStep + 1}/${context.steps.length}: ${context.steps[context.currentStep] || "chưa có"}; timer ${context.timerSeconds} giây, ${context.timerRunning ? "đang chạy" : "đang dừng"}.
Nguyên liệu: ${context.ingredients.join(", ") || "không có dữ liệu"}.
Các bước: ${context.steps.map((step, index) => `${index + 1}. ${step}`).join(" | ")}
Lịch sử gần đây:\n${history || "chưa có"}
Câu hỏi mới của người nấu: ${question}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 220 },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const error = new Error("Cooking assistant service failed");
      (error as Error & { statusCode?: number }).statusCode = response.status === 429 ? 429 : 502;
      throw error;
    }

    const data = (await response.json()) as GeminiResponse;
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!answer) throw new Error("AI returned no cooking answer");
    return answer.replace(/^```(?:text|markdown)?\s*/i, "").replace(/\s*```$/, "").trim();
  },
};