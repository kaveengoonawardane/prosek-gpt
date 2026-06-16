import { embed, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
);

async function generateEmbedding(message: string) {
	return embed({
		model: openai.embedding('text-embedding-3-small'),
		value: message,
	});
}

async function fetchRelevantContext(embedding: number[]) {
	const { data, error } = await supabase.rpc('get_relevant_chunks', {
		query_vector: embedding,
		match_threshold: 0.3,
		match_count: 500,
	});

	if (error) throw error;

	return JSON.stringify(
		data.map(
			(item: any) => `
        Source: ${item.url}
        Date Updated: ${item.date_updated}
        Content: ${item.content}
        `,
		),
	);
}

// Create system message template
function createPrompt(context: string, userQuestion: string) {
	return {
		role: 'system',
		content: `
		You are the official AI assistant for Prosek and represent Prosek directly.

		Always respond in a first-person plural voice (e.g., “we”, “our”, “us”).

		----------------
		CONTEXT
		${context}
		----------------

		Guidelines:
		- Base your answer primarily on the provided context.
		- The context may contain multiple sections — identify and use the most relevant parts.
		- If information is spread across sections, combine it into a clear answer.
		- If partial information exists, provide the best possible answer.
		- Only say “We don’t have enough information…” if absolutely no relevant information exists.
		- If unrelated, say: “I can only help with questions related to Prosek and what we do.”

		Style:
		- Speak as Prosek (“we”, “our”)
		- Be confident and helpful (not overly cautious)

		Format:
		- Markdown
		- Include links if available

		QUESTION:
		${userQuestion}
		`,
	};
}

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();
		const latestMessage = messages.at(-1).content;

		const { embedding } = await generateEmbedding(latestMessage);
		const context = await fetchRelevantContext(embedding);
		const prompt = createPrompt(context, latestMessage);
		const result = streamText({
			model: openai('gpt-5.4'),
			messages: [prompt, ...messages],
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.log('Error generating response: ' + error);
		throw error;
	}
}
