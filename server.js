const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = 'http://ollama:11434/api/generate'; // Use Docker service name

app.use(express.json());

const formatOllamaResponse = data => {
	return {
		generated_text: {
			model: data.model,
			created_at: data.created_at,
			output: data.response,
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
	};
};

app.get('/', (req, res) => {
	res.send('Node.js API with Ollama in Docker');
});

app.post('/ask', async (req, res) => {
	try {
		const {prompt, model, stream, format} = req.body;

		const modelName = model || 'llama3.2';
		const requestPayload = {
			model: modelName,
			prompt: prompt || 'Hello, how are you?',
			stream: stream || false,
		};

		if (format) {
			requestPayload.format = format;
		}

		const response = await axios.post(OLLAMA_URL, requestPayload);

		res.json(formatOllamaResponse(response.data));
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({error: error.message});
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
