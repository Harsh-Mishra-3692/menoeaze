# MenoEaze Backend Documentation

## Overview

Backend API for MenoEaze application providing:
- User authentication (JWT)
- Symptom tracking and storage
- OpenAI-powered chat assistant
- ML model for personalization and analysis
- Community matching

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

Install PostgreSQL and create database:
```sql
CREATE DATABASE menoeaze;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Train ML Model (Optional)

```bash
cd ml
python train.py
```

### 6. Start Server

```bash
npm run dev  # Development
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Symptoms
- `GET /api/symptoms` - Get all symptoms
- `POST /api/symptoms` - Create symptom
- `GET /api/symptoms/:id` - Get symptom
- `PUT /api/symptoms/:id` - Update symptom
- DELETE /api/symptoms/:id` - Delete symptom

### Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Send message

### ML/Analytics
- `GET /api/ml/insights` - Get personalized insights
- `GET /api/ml/report` - Generate health report
- `GET /api/ml/trends` - Analyze trends

### Community
- `GET /api/community/matches` - Get matched users

## TODO: Integration Steps

1. **OpenAI API**: Add API key to `.env`
2. **Vector DB**: Implement Pinecone/Weaviate/Milvus connector in `services/vectordb.js`
3. **ML Model**: Train model with real data in `ml/train.py`
4. **Database**: Run migrations and seed data
5. **Frontend**: Update API calls to point to backend URL

## File Structure

```
backend/
├── api/              # API routes
├── auth/             # JWT authentication
├── database/         # Models and connection
├── services/         # Business logic
├── ml/               # ML training and inference
├── scripts/          # Utility scripts
└── server.js         # Main server file
```

