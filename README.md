# Sentilens - Customer Sentiment Dashboard

Sentilens is an intelligent analytics dashboard that transforms raw customer feedback into actionable insights using Google's advanced Gemini models.

## Features

- **Sentiment Trend Analysis**: Visualizes customer sentiment over time to identify dips and spikes in satisfaction using interactive charts.
- **Key Themes Word Cloud**: Automatically extracts and visualizes the most frequent complaints (red), praises (green), and neutral topics.
- **AI Executive Summary**: Generates a high-level overview and identifies top 3 actionable areas for business improvement.
- **Interactive AI Assistant**: A built-in chatbot allows you to ask specific questions about the analyzed dataset (e.g., "What are users saying about battery life?").
- **Thinking Mode**: Toggle "Thinking Mode" to leverage `gemini-3-pro-preview` with extended thinking budgets for deeper reasoning on complex datasets.

## How to Use

1. **Input Data**: Paste raw text reviews, chat logs, CSV content, or survey responses into the input field.
2. **Select Mode**: 
   - **Standard**: Uses `gemini-2.5-flash` for rapid analysis.
   - **Thinking Mode**: Uses `gemini-3-pro-preview` for complex reasoning (slower but more detailed).
3. **Analyze**: Click "Generate Report".
4. **Explore**: Review the charts, word clouds, and AI-generated summary.
5. **Chat**: Use the floating chat button to interrogate the data further.

## Technologies

- **Frontend**: React, Tailwind CSS
- **Visualization**: Recharts
- **Icons**: Lucide React
- **AI**: Google GenAI SDK (`@google/genai`)
  - **Models**: `gemini-2.5-flash` (Analysis), `gemini-3-pro-preview` (Chat & Thinking Mode)

## Configuration

This application requires a Google Gemini API Key. 

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. The application expects the key to be available via `process.env.API_KEY`.

## License

MIT