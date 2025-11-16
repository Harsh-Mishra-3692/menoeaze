# API Key Setup Instructions

## Perplexity AI API Key

To make the chat assistant functional, you need to add your Perplexity AI API key.

### Step 1: Get Your API Key
1. Go to https://www.perplexity.ai/
2. Sign up or log in
3. Navigate to API settings
4. Generate or copy your API key

### Step 2: Add to Backend Environment

**File: `backend/.env`**

Add this line:
```
PERPLEXITY_API_KEY=your-actual-api-key-here
```

Replace `your-actual-api-key-here` with your actual Perplexity API key.

### Step 3: Restart Backend Server

After adding the API key, restart your backend server:
```bash
cd backend
npm run dev
```

### Verification

The chat assistant will now use Perplexity AI to provide intelligent, context-aware responses about menopause symptoms, treatments, and wellness advice.

## Important Notes

- ⚠️ **Never commit your `.env` file to GitHub**
- The `.env` file is already in `.gitignore`
- Keep your API key secure and private
- If you see errors about API key, check that:
  1. The key is correctly added to `backend/.env`
  2. The backend server has been restarted
  3. The key is valid and has sufficient credits

