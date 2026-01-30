# Autonomous AI Project Manager & Software Team

> **Your Digital Dev Team for Any Idea** - A production-ready, full-stack, multi-agent AI system that plans, codes, and delivers projects autonomously.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Overview

This is a **hackathon-winning** autonomous AI project manager that uses multiple specialized AI agents to collaborate in real-time. Watch as Requirements Analysts, Planners, Developers, and QA Engineers work together to bring your ideas to life.

### ✨ Key Features

- 🤖 **6 Specialized AI Agents** - Manager, Requirements, Planner, Executor, QA, and Reporting agents
- 🎨 **Vibrant, Modern UI** - Multi-color gradients (blue, orange, purple, green) with smooth animations
- 🎤 **Voice Input** - Speak your project ideas using Web Speech API
- 💾 **Full Persistence** - MongoDB integration for saving and resuming projects
- 🔐 **Authentication** - Secure sign-up/sign-in with NextAuth.js
- 🎉 **Celebration Effects** - Confetti animations on project completion
- 📊 **Real-Time Updates** - Live streaming of agent activities and progress
- 📥 **Export Options** - Download reports in Markdown, PDF, or DOCX formats
- 🌐 **Vercel-Ready** - Optimized for one-click deployment

## 🎬 Demo

1. **Landing Page** - Colorful hero section with animated gradients
2. **Sign Up/Sign In** - Vibrant authentication pages
3. **Dashboard** - Start projects with voice or text input
4. **Live Execution** - Watch agents collaborate in real-time
5. **Results** - View code, reports, and export options

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Next.js API Routes, LangChain, LangGraph
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js with credentials provider
- **AI**: OpenAI GPT-4 (configurable)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- OpenAI API key

### Step 1: Clone & Install

\`\`\`bash
git clone <your-repo-url>
cd ai-project-manager
npm install
\`\`\`

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# OpenAI API Key
OPENAI_API_KEY=sk-...your-key-here

# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-project-manager?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Optional: Force demo mode (uses mock agents instead of real API)
NEXT_PUBLIC_DEMO_MODE=false
\`\`\`

**To generate NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### Step 3: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

### Step 4: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. Install Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Login to Vercel:
   \`\`\`bash
   vercel login
   \`\`\`

3. Deploy:
   \`\`\`bash
   vercel --prod
   \`\`\`

4. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL, e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`

## 🏗️ Architecture

### Agent Workflow

\`\`\`
User Input → Manager Agent → Requirements Agent → Planner Agent → Executor Agent → QA Agent → Reporting Agent → Finish
                    ↑                                                                                              ↓
                    └──────────────────────────────────────────────────────────────────────────────────────────────┘
\`\`\`

### Directory Structure

\`\`\`
src/
├── app/
│   ├── api/
│   │   ├── agent/          # Main agent orchestration endpoint
│   │   ├── auth/           # NextAuth configuration
│   │   └── projects/       # Project CRUD endpoints
│   ├── auth/               # Sign-in/sign-up pages
│   ├── about/              # About page
│   └── page.tsx            # Main page (landing + dashboard)
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── landing/            # Landing page
│   ├── layout/             # Sidebar, etc.
│   └── ui/                 # Reusable UI components
├── context/
│   └── ProjectContext.tsx  # Global state management
├── hooks/
│   └── useVoiceInput.ts    # Voice input hook
├── lib/
│   ├── agents/             # Agent nodes and graph
│   └── db/                 # Database models and connection
└── types/                  # TypeScript definitions
\`\`\`

## 🎨 Features in Detail

### Voice Assistant

- Uses Web Speech API (Chrome/Edge only)
- Click microphone button to speak your project idea
- Automatic transcription to text input
- Graceful fallback for unsupported browsers

### Multi-Agent System

1. **Manager Agent** - Orchestrates the workflow, decides which agent to call next
2. **Requirements Agent** - Analyzes user input and creates structured requirements
3. **Planner Agent** - Creates a task breakdown with dependencies
4. **Executor Agent** - Implements code and artifacts
5. **QA Agent** - Reviews outputs for quality and safety
6. **Reporting Agent** - Generates final summaries and documentation

### Persistence

- All projects automatically saved to MongoDB
- Resume projects from history
- User-specific project isolation
- Real-time state updates

## 🎯 Usage

1. **Sign Up** - Create an account
2. **Start Project** - Describe your idea (text or voice)
3. **Watch Agents** - See real-time collaboration
4. **Review Results** - Check generated code and reports
5. **Export** - Download in your preferred format

## 🔒 Security

- Passwords hashed with bcrypt
- JWT-based session management
- QA agent vets all outputs for safety
- No autonomous external actions (emails, deployments, etc.)

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify database user credentials

### Voice Input Not Working

- Use Chrome or Edge browser
- Ensure HTTPS in production (Vercel provides this)
- Check browser permissions for microphone

### API Quota Exceeded

- System automatically falls back to mock mode
- Set `NEXT_PUBLIC_DEMO_MODE=true` to force mock mode

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Built for the Agentathon Hackathon
- Powered by OpenAI, LangChain, and LangGraph
- UI inspired by modern SaaS applications

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ by the Emergent Team**
