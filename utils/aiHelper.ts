import { OpenRouter } from '@openrouter/sdk';
import { config } from './env';

const openRouter = new OpenRouter({
    apiKey: config.OPENROUTER_KEY,
});

const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

/**
 * Generates a creative and organic response for economy commands.
 * @param command - The name of the economy command (e.g. "work", "crime")
 * @param context - Additional data like player salary, job, or outcome
 * @param tone - Optional tone restriction (default: "indonesian slang, funny, slightly realistic")
 */
export const generateEconomyResponse = async (
    command: string,
    context: string,
    tone: string = "indonesian slang, casual, direct, avoid being overly hyperbolic or 'cringe', sound like a standard person in Jakarta"
): Promise<string> => {
    try {
        const prompt = `
            Task: Create exactly ONE unique and funny response for a Discord bot economy command.
            Command: ${command}
            Context: ${context}
            Tone: ${tone}
            
            STRICT RULES:
            1. ONLY RETURN THE RESPONSE TEXT. NO INTRO, NO OPTIONS, NO EXPLANATION.
            2. If you give options (e.g., "Option 1", "Option 2"), the developer will be fired.
            3. Response must be in Indonesian (Slang/Gaul/Jakarta style).
            4. Be extremely concise (max 150 characters).
            5. Integrate the context data organically (e.g., if there is a salary, mention it naturally).
            
            Direct Output Only:
        `;

        const completion = await openRouter.chat.send({
            model: DEFAULT_MODEL,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            stream: false,
        });

        const content = completion.choices?.[0]?.message?.content;
        if (typeof content === 'string') return content.trim();
        return "";
    } catch (error) {
        console.error("[AI Response Error]", error);
        return ""; // Fallback will be used in the command
    }
};
