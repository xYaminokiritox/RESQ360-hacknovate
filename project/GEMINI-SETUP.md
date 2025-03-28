# Setting Up Gemini AI Integration

This guide will help you set up the Gemini AI integration for the ResQ360 application.

## 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API key" or "Create API key"
4. Copy the API key

## 2. Add the API Key to Your .env File

1. Open the `.env` file in the root of your project
2. Find the line that says `VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE`
3. Replace `YOUR_GEMINI_API_KEY_HERE` with the API key you got from Google AI Studio
4. Save the file

Your `.env` file should now look like this:

```
VITE_GEMINI_API_KEY=your-actual-api-key-here
```

## 3. Test the Integration

1. Start your development server: `npm run dev`
2. Go to the Dashboard page
3. Click on the "Gemini Status" button in the top-right corner
4. You should see a green "API Key is Valid" message if your API key is working

## 4. Use the Gemini AI Chatbot

1. On the Dashboard, you'll see a floating chatbot button in the bottom-right corner
2. Click on the button to open the chatbot
3. Type your message and press Enter or click the send button
4. The chatbot will respond with information powered by Gemini AI

## Troubleshooting

If you encounter issues with the Gemini AI integration, check the following:

1. Make sure your API key is correctly added to the `.env` file
2. Make sure your API key is valid and has not expired
3. Make sure you're connected to the internet
4. Check the browser console for any error messages

## Offline Mode

The chatbot has an offline mode that will be activated automatically if:

1. Your device loses internet connection
2. There's an issue with the Gemini API
3. Your API key is invalid or has not been set up

In offline mode, the chatbot will provide basic responses to common queries.

## Developer Notes

- The Gemini API integration is implemented in `src/services/geminiChatService.ts`
- The chatbot component is implemented in `src/components/GeminiChatbot.tsx`
- The API key test component is implemented in `src/components/GeminiApiTest.tsx` 