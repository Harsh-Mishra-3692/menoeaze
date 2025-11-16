# MenoEaze

Menopause symptom tracking and support platform with AI-powered insights.

## Quick Start

### Frontend
```bash
npm install
npm run dev
```
Frontend runs on http://localhost:3000

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run migrate       # Set up database
npm run dev          # Start backend server
```
Backend runs on http://localhost:3001

### ML Service
```bash
cd ml_service
pip install -r requirements.txt
python train.py      # Train the model
```

### Full Stack (Docker)
```bash
docker-compose up
```

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for complete file structure.

## Features

- **Symptom Tracking**: Comprehensive daily tracking with detailed insights
- **AI Chat Support**: Personalized guidance from OpenAI-powered assistant
- **ML Insights**: Personalized recommendations based on ML models
- **Community**: Connect with others on similar journeys
- **Privacy First**: HIPAA compliant, encrypted data storage

## Integration TODOs

- **Database**: Set up PostgreSQL and run migrations
- **OpenAI API**: Add API key in `backend/.env`
- **Vector DB**: Implement Pinecone/Weaviate/Milvus connector
- **ML Model**: Train with real data in `backend/ml/train.py`
- **Frontend-Backend**: Update API calls to use backend URL
- **Authentication**: Connect frontend auth to backend JWT
- **PHI Scrubbing**: Add before sending to external APIs
- **Production**: Add logging, monitoring, and deployment configs

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, React, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Sequelize
- **ML**: Python, scikit-learn, FastAPI
- **AI**: OpenAI API (GPT-4)
- **Auth**: JWT tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file
