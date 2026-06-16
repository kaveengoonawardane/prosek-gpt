# Prosek GPT

A simple AI assistant for the Prosek website. It answers questions about Prosek
using Retrieval-Augmented Generation (RAG): the public Prosek site is scraped,
split into chunks, embedded with OpenAI, and stored in a Supabase
[pgvector](https://github.com/pgvector/pgvector) table. At query time the user's
question is embedded, the most relevant chunks are retrieved, and the answer is
streamed back from an OpenAI chat model.

## Tech stack

- **[Next.js](https://nextjs.org) 16** (App Router) + **React 19**
- **[Vercel AI SDK](https://sdk.vercel.ai)** (`ai`, `@ai-sdk/openai`) for embeddings and streaming chat
- **[Supabase](https://supabase.com)** with the `pgvector` extension as the vector store
- **[LangChain](https://js.langchain.com)** + **Puppeteer** for scraping and text splitting (seed step only)
- **Tailwind CSS v4** + **shadcn/ui** (Radix) components
- **TypeScript**

## Project structure

```
app/
  api/chat/route.ts   # RAG chat endpoint: embeds the question, retrieves chunks, streams the answer
  page.tsx            # Chat UI page
  layout.tsx          # Root layout
components/            # Chat UI (ChatContainer/Input/Output) and shadcn/ui primitives
lib/                  # Helpers (e.g. getLastSeeded)
middleware.ts         # HTTP Basic Auth gate for the whole app
seed.ts              # One-off ingestion script: scrape -> chunk -> embed -> store
setupDb.sql          # Supabase schema: vector extension, chunks table, get_relevant_chunks()
```

## Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API account with credit

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database.** In the Supabase SQL editor, run the contents of
   [`setupDb.sql`](./setupDb.sql). This enables the `vector` extension and
   creates the `chunks` table plus the `get_relevant_chunks` similarity-search
   function.

3. **Configure environment variables.** Copy `.env.example` to `.env` and fill
   in the values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Required | Description |
   | --- | --- | --- |
   | `OPENAI_API_KEY` | Yes | OpenAI API key, used for embeddings and chat completions. |
   | `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL. |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key. |
   | `BASIC_AUTH_USERNAME` | No | Username for the Basic Auth gate (defaults to `prosek`). |
   | `BASIC_AUTH_PASSWORD` | No | Password for the Basic Auth gate (defaults to `clientpreview`). |
   | `OPENAI_VECTOR_STORE_ID` | No | Reserved for an OpenAI-hosted vector store. |

4. **Seed the database** (see [`npm run seed`](#npm-scripts) below). This can take
   a while, as it scrapes the full Prosek sitemap.

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The app is protected by
   HTTP Basic Auth — log in with the credentials above.

## npm scripts

| Script | Command | What it does |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the local development server with hot reload at `localhost:3000`. |
| `npm run build` | `next build` | Create an optimized production build. |
| `npm run start` | `next start` | Serve the production build (run `build` first). |
| `npm run lint` | `next lint` | Run ESLint using the Next.js config. |
| `npm run seed` | `ts-node seed.ts` | Ingest content into Supabase: crawl the Prosek sitemaps with Puppeteer, split pages into chunks, embed each chunk with OpenAI, and insert them into the `chunks` table. Re-run to refresh the data. |

## How it works

- **Ingestion (`seed.ts`).** Resolves the Prosek sitemaps (including nested
  sitemap indexes), filters to valid `prosek.com` HTML pages, scrapes each page's
  text with Puppeteer, splits it into ~512-character overlapping chunks, embeds
  each chunk with `text-embedding-3-small`, and stores the content, vector, and
  source URL in the `chunks` table.
- **Retrieval & answer (`app/api/chat/route.ts`).** Embeds the latest user
  message, calls the `get_relevant_chunks` Postgres function to fetch the most
  similar chunks (cosine similarity), injects them as context into a system
  prompt, and streams the model's response back to the client.
- **Auth (`middleware.ts`).** Every request passes through HTTP Basic Auth before
  reaching the app.

## Notes

- The seed script uses Puppeteer, which downloads a headless Chromium on install.
- The retrieval embedding model and the chat model are configured directly in
  `app/api/chat/route.ts` and `seed.ts` — update them there if you change models.
- This is a standard Next.js app; deploy it anywhere Next.js runs (e.g. Vercel),
  making sure the environment variables above are set.
