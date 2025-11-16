# Architecture

**Frontend**: Next.js App Router with TypeScript, React, Tailwind CSS. API routes proxy to ML service.

**ML Service**: FastAPI microservice with scikit-learn model for symptom prediction and embeddings.

**Data Flow**: Frontend → Next.js API routes → ML service / External LLM/Vector DB.

**TODOs**: Vector DB connector (Pinecone/Weaviate/Milvus), LLM integration (OpenAI/Anthropic), PHI scrubbing, auth, BAA compliance, human-in-loop escalation.

