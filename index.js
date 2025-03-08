import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chatbot", async (req, res) => {
    try {
        const { website } = req.body;
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!website) {
            return res.status(400).json({ error: "Website link is required" });
        }

        // Custom prompt jo har website ka alag chatbot banayega
        const prompt = `You are a chatbot specifically designed for this website: ${website}. 
        Analyze the website and generate responses accordingly. 
        If the website is about a business, answer as a customer service representative. 
        If it's a blog, respond like an expert in that niche.`;

        // OpenRouter.ai API call with Qwen2.5-Max
        const response = await axios.post(
            "https://openrouter.ai/api/chat/completions",
            {
                model: "qwen2.5-max",
                messages: [{ role: "system", content: prompt }],
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
