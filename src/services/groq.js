import Groq from 'groq-sdk';

export const generateContent = async (apiKey, type, topic) => {
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

    const systemPrompts = {
        flashcards: `You are a helpful tutor. Create 5 flashcards for the given topic. 
    Return ONLY a JSON array of objects with "front", "back" and "trivia" (a fun fact related to the answer) keys. 
    Example: [{"front": "Who directed Baahubali?", "back": "S. S. Rajamouli", "trivia": "He is known for his epic scale and grandiose storytelling."}]`,
        quiz: `You are a teacher. Create 5 multiple choice questions for the given topic.
    Return ONLY a JSON array of objects with "question", "options" (array of 4 strings), "correctAnswer" (index 0-3), and "trivia" (explanation or fun fact).`,
        mnemonics: `You are a memory expert. Create 5 creative and catchy mnemonics (acronyms, rhymes, or associations) to help memorize key facts about the given topic.
    Return ONLY a JSON array of objects with "concept" (the fact or list of items to memorize), "mnemonic" (the memory aid), "type" (e.g., "Acronym", "Rhyme", "Association"), and "explanation" (how it works).
    Example: [{"concept": "Order of Planets", "mnemonic": "My Very Educated Mother Just Served Us Noodles", "type": "Acronym", "explanation": "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"}]`
    };

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompts[type] },
            { role: 'user', content: `Topic: ${topic}` }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        response_format: { type: 'json_object' }
    });

    try {
        const jsonStr = completion.choices[0]?.message?.content;
        const data = JSON.parse(jsonStr);
        // Handle cases where the model wraps the array in a key like "flashcards": [...]
        return Array.isArray(data) ? data : (data.flashcards || data.quiz || data.questions || data.mnemonics || Object.values(data)[0] || []);
    } catch (e) {
        console.error("Groq API Error Details:", e);
        throw e; // Re-throw so App.jsx can show the message
    }
};

export const getChatCompletion = async (apiKey, messages) => {
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

    const completion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024
    });

    return completion.choices[0]?.message?.content || "I'm not sure how to respond to that.";
};
