# Build stage
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM debian:bookworm-slim AS runtime

# Build arguments for model selection
ARG MODELS="mistral llama3.2"

# Runtime stage
FROM debian:bookworm-slim AS runtime

# Install Node.js and other dependencies
RUN apt-get update && apt-get install -y curl procps nodejs npm && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node modules and app files
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Install Ollama and download specified models
RUN curl -fsSL https://ollama.ai/install.sh | sh
RUN OLLAMA_HOST=0.0.0.0:11434 ollama serve & \
    sleep 30 && \
    ollama pull mistral:latest && \
    ollama pull llama3.2:latest && \
    sleep 5 && \
    pkill ollama

EXPOSE 3000
EXPOSE 11434

# Healthcheck for both Ollama and Express
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:11434/api/health && \
        curl -f http://localhost:3000/health || exit 1

# Start services
CMD ["sh", "-c", "OLLAMA_HOST=0.0.0.0:11434 ollama serve & sleep 2 && node server.js"]
