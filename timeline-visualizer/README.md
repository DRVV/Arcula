This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Timeline Visualizer

An interactive timeline visualization tool with AI-powered chat capabilities. Users can explore timeline events, filter by categories, and ask questions about the data using natural language.

## Features

- Interactive timeline visualization
- Event filtering by category, importance, and date range
- AI-powered chat assistant for querying timeline data
- Automatic timeline updates based on relevant data from chat queries

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your OpenAI API key:
   - Copy `.env.local.example` to `.env.local`
   - Replace `your_openai_api_key_here` with your actual OpenAI API key

```bash
cp .env.local.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using the Chat Feature

The timeline visualizer includes an AI-powered chat assistant that can:

- Answer questions about events in the timeline
- Identify and highlight relevant events based on your queries
- Filter the timeline to focus on events related to your questions
- Provide insights and explanations about timeline data

Simply click on the chat icon in the bottom right corner to open the chat interface, then ask questions about the timeline data.

Examples:
- "Show me all events related to mobile hardware innovations"
- "What were the most important milestones in smartphone development?"
- "Tell me about network infrastructure events between 2010 and 2020"

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Accessing Dify

- 過去イベ
   - Chat_Flow: prd-Orchestrator-Past-v0
   - API_Key: app-LIHHLGwqhx0LeFQjPml4U4xr

- 将来シナリオ
   - Chat_Flow: prd-Orchestrator-Future-v0
   - API_Key: app-KUjNs8hGwCjx1Z9lxQ1wMbU1

- 評価・要素技術
   - Chat_Flow: prd-Orchestrator-Evaluate-v0
   - API_Key: app-AXd8ves5mm3SiN4O9QIastoZ
