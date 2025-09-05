import geminiService from "../services/geminiService.js";

class GeminiController {
  async createMetricsAndGenerateDiet(req, res) {
    try {
      const { userId } = req;
      const saveDiet = await geminiService.createMetricsAndGenerateDiet(userId, req.body);
      return res.status(200).json(saveDiet);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new GeminiController();
