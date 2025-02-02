const express = require('express');
const axios = require('axios');
const {z} = require('zod');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = 'http://ollama:11434/api/generate';

app.use(express.json());

const OllamaResponseSchema = z.object({
	model: z.string(),
	created_at: z.string(),
	response: z.string(),
	done: z.boolean(),
	done_reason: z.string().optional(),
	total_duration: z.number(),
	load_duration: z.number(),
	prompt_eval_duration: z.number(),
	eval_duration: z.number(),
	prompt_eval_count: z.number(),
	eval_count: z.number(),
});

const CapitalResponseSchema = z.object({
	country: z.string(),
	capital: z.string(),
});

const formatOllamaResponse = data => ({
	generated_text: {
		model: data.model,
		created_at: data.created_at,
		output: data.response.trim(),
		status: {
			is_done: data.done,
			reason: data.done_reason,
		},
	},
	performance_metrics: {
		timing: {
			total_duration_s: data.total_duration / 1_000_000_000,
			load_duration_s: data.load_duration / 1_000_000_000,
			prompt_processing_duration_s: data.prompt_eval_duration / 1_000_000_000,
			generation_duration_s: data.eval_duration / 1_000_000_000,
		},
		tokens: {
			input_token_count: data.prompt_eval_count,
			output_token_count: data.eval_count,
		},
	},
});

app.get('/', (req, res) => {
	res.send('Node.js API with Ollama in Docker');
});

app.post('/ask', async (req, res) => {
	try {
		const {prompt, model, stream, temperature, format} = req.body;

		const requestPayload = {
			model: model || 'llama3.2',
			prompt: prompt || 'Ups! Something happended with the prompt!',
			stream: stream || false,
			format: format,
			temperature: temperature || 0,
		};

		const response = await axios.post(OLLAMA_URL, requestPayload);

		const validatedResponse = OllamaResponseSchema.safeParse(response.data);
		if (!validatedResponse.success) {
			throw new Error('Invalid API response format from Ollama.');
		}

		let structuredData;
		try {
			structuredData = CapitalResponseSchema.parse(
				JSON.parse(validatedResponse.data.response),
			);
		} catch (error) {
			throw new Error('Invalid structured output format received.');
		}

		res.json({
			...formatOllamaResponse(validatedResponse.data),
			parsed_data: structuredData,
		});
	} catch (error) {
		console.error('❌ Error:', error.message);
		res.status(500).json({error: error.message});
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
