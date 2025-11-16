# MenoEaze Project Structure

Complete project structure for GitHub collaboration.

## Frontend (Next.js)

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxies to backend)
│   ├── dashboard/         # Dashboard page (protected)
│   ├── community/         # Community page (protected)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── AuthModal.tsx      # Login/Signup modal
│   ├── ChatWidget.tsx     # AI chat interface
│   ├── Chart.tsx          # Chart component
│   ├── EnhancedChart.tsx  # Chart with normal levels
│   ├── Footer.tsx         # Footer component
│   ├── Header.tsx         # Navigation header
│   ├── ProtectedRoute.tsx # Route protection
│   └── SymptomForm.tsx    # Symptom logging form
├── lib/                   # Utilities
│   ├── api.ts             # API client functions
│   ├── auth.tsx           # Auth context/provider
│   └── types.ts           # TypeScript types
├── styles/                # Global styles
├── public/                # Static assets
└── package.json           # Dependencies
```

## Backend (Node.js/Express)

```
backend/
├── api/                   # API route handlers
│   ├── auth.js           # Authentication endpoints
│   ├── chat.js            # Chat/OpenAI endpoints
│   ├── community.js       # Community matching
│   ├── ml.js              # ML insights endpoints
│   ├── symptoms.js        # Symptom CRUD
│   └── users.js           # User profile
├── auth/                   # Authentication logic
│   └── jwt.js             # JWT token handling
├── database/              # Database layer
│   ├── connection.js      # Sequelize connection
│   └── models/            # Database models
│       ├── User.js
│       ├── Symptom.js
│       ├── ChatMessage.js
│       └── index.js       # Model associations
├── services/              # Business logic
│   ├── embeddings.js      # OpenAI embeddings
│   ├── ml.js              # ML service integration
│   ├── openai.js          # OpenAI chat service
│   ├── rag.js             # RAG context retrieval
│   └── vectordb.js        # Vector DB connector (TODO)
├── ml/                    # ML model code
│   ├── train.py           # Model training script
│   ├── inference.py       # Model inference
│   └── analysis.py        # Pattern analysis
├── scripts/               # Utility scripts
│   └── migrate.js         # Database migration
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README_BACKEND.md      # Backend documentation
```

## ML Service (Python/FastAPI)

```
ml_service/
├── app.py                 # FastAPI application
├── model.py               # Model wrapper
├── data_generator.py      # Synthetic data generator
├── train.py               # Training script
├── tests/                 # Unit tests
├── models/                # Saved models (gitignored)
├── requirements.txt       # Python dependencies
└── Dockerfile             # Container definition
```

## Infrastructure

```
├── docker-compose.yml     # Full stack orchestration
├── Dockerfile             # Frontend container
├── .github/
│   └── workflows/        # CI/CD pipelines
├── .gitignore            # Git ignore rules
└── README.md             # Main project README
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
See `backend/.env.example`

## Setup Instructions

1. **Frontend**: `npm install && npm run dev`
2. **Backend**: `cd backend && npm install && npm run dev`
3. **Database**: Install PostgreSQL, create database
4. **ML Service**: `cd ml_service && pip install -r requirements.txt`

## TODO: Integration Checklist

- [ ] Set up PostgreSQL database
- [ ] Add OpenAI API key to backend/.env
- [ ] Implement vector DB connector (Pinecone/Weaviate/Milvus)
- [ ] Train ML model with real data
- [ ] Update frontend API calls to use backend URL
- [ ] Add authentication token handling in frontend
- [ ] Set up CI/CD pipelines
- [ ] Add PHI scrubbing before OpenAI calls
- [ ] Implement consent flow
- [ ] Add production logging/monitoring

