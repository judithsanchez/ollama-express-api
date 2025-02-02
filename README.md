```bash
docker exec -it ollama-server ollama list
```

```bash
docker compose down
```

```bash
docker compose up --build
```

```bash
docker restart node-api
```

```bash
docker compose up --build
```

````bash
docker exec -it ollama-server ollama pull MODEL-NAME```


````

http://localhost:3000/ask

Content-Type
application/json

{
"prompt": "What is the capital of Venezuela?",
"model": "deepseek-r1:14b",
"format": {
"type": "object",
"properties": {
"country": { "type": "string" },
"capital": { "type": "string" }
},
"required": ["country", "capital"]
}
}
