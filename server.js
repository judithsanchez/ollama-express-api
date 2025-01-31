const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_API_URL = 'http://0.0.0.0:11434/api/generate';

app.use(express.json());

app.post('/process-text', async (req, res) => {
	try {
		const {prompt, model} = req.body;
		console.log('Received request:', {prompt, model});

		if (!prompt || !model) {
			return res.status(400).json({error: 'Prompt and model are required'});
		}

		const allowedModels = ['mistral'];
		if (!allowedModels.includes(model)) {
			return res.status(400).json({error: 'Invalid model selection'});
		}

		console.log('Sending request to Ollama');
		const response = await axios.post(OLLAMA_API_URL, {
			model: model,
			prompt: prompt,
			stream: false,
		});
		console.log('Ollama response:', response.data);

		res.json({response: response.data.response});
	} catch (error) {
		console.error('Error details:', error.response?.data || error.message);
		res
			.status(500)
			.json({error: 'Failed to process text', details: error.message});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
