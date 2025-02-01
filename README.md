# Ollama Express API

A containerized Express.js API that interfaces with Ollama for AI model interactions. This setup provides a persistent storage solution for AI models and a REST API interface.

## System Architecture

- Express.js server on port 3000
- Ollama service on port 11434
- Persistent storage via Docker volume
- REST API endpoints for model interaction

## Getting Started

### Initial Setup

1. Clone the repository
2. Build the container:

```bash
docker compose build
```

3. Start the services

```bash
docker compose up -d
```

4. Verify services are running

```bash
docker compose ps
```

### Container Management

- Stop container

```bash
docker compose down
```

- Restart services

```bash
docker compose restart
```

- View logs

```bash
docker compose logs
```

- View real-time logs

```bash
docker compose logs -f
```

### Model Management

- List installed models

```bash
docker compose exec api ollama list
```

- Download a new model

```bash
docker compose exec api ollama pull mistral
```

- Remove a specific model

```bash
docker compose exec api ollama rm mistral
```

- View volumes

```bash
docker volume ls
```

- Remove volume (deletes all models)

```bash
docker compose down -v
```

- Inspect volume

```bash
docker volume inspect ollama-models
```
