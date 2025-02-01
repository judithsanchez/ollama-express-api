const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = 'http://ollama:11434/api/generate'; // Use Docker service name

app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
	res.send('Node.js API with Ollama in Docker');
});

app.post('/ask', async (req, res) => {
	try {
		const {prompt, model} = req.body;

		// Set default model to 'mistral' if none is provided
		const modelName = model || 'mistral';

		// Send request to Ollama API
		const response = await axios({
			method: 'post',
			url: 'http://ollama:11434/api/generate',
			data: {
				model: modelName, // Use the requested model
				prompt: prompt || 'Hello, how are you?',
				stream: false,
			},
		});

		res.json(response.data);
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({error: error.message});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
