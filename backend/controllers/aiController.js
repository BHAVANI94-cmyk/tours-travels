const { GoogleGenerativeAI } = require(
    "@google/generative-ai"
);

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


exports.chatBot = async (req, res) => {

    try {

        const { message } = req.body;


        if (!message) {

            return res.status(400).json({
                message: "Message is required"
            });

        }


        const model =
            genAI.getGenerativeModel({
                model: "gemini-3.5-flash"
            });


        const result =
            await model.generateContent(
                message
            );


        const reply =
            result.response.text();


        res.json({
            reply: reply
        });

    }

    catch (err) {

        console.log(
            "AI Error:",
            err.message
        );


        if (
            err.message.includes("429")
        ) {

            return res.status(429).json({
                message:
                    "AI service quota exceeded. Please try again later."
            });

        }


        res.status(500).json({
            error:
                "AI service temporarily unavailable"
        });

    }

};