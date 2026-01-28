# 🛡️ Sentinel - AI Smart Contract Auditor

![Sentinel AI Hero](public/sentinel.png)

> **Secure Your Sui Smart Contracts in Seconds.**
> Powered by Google Gemini 2.5 Flash & Sui Move.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fsentinel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sui](https://img.shields.io/badge/Sui-Move-4DA2FF)](https://sui.io)
[![Gemini](https://img.shields.io/badge/AI-Gemini_Flash-8E75B2)](https://deepmind.google/technologies/gemini/)

## 🔗 Live Demo
**[https://sentinel-pi-two.vercel.app/](https://sentinel-pi-two.vercel.app/)**

---

## 🚀 Overview

**Sentinel** is an advanced security analysis tool built for the **Sui Blockchain**. It leverages the reasoning capabilities of **Google Gemini** to audit Move smart contracts, identifying critical vulnerabilities, generating visual attack vectors, and suggesting code fixes in real-time.

Move security is complex. Sentinel makes it accessible, visual, and actionable.

## ✨ Key Features

-   **🧠 AI-Powered Analysis**: Deep semantic analysis of Move code using Gemini 2.5 Flash.
-   **📉 Attack Vector Visualization**: Automatically generates **Mermaid.js sequence diagrams** to visualize how an exploit would occur.
-   **🛡️ Security Scoring**: precise 0-100 security score based on vulnerability severity and code quality.
-   **⚡ Serverless Architecture**: Secure backend proxy prevents API key exposure (`/api/analyze`).
-   **🎨 Sui-Native UI**: Beautiful, dark-mode interface inspired by the Sui design system (Sharp edges, radial gradients, specialized fonts).

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS
-   **AI Model**: Google Gemini 2.5 Flash
-   **Backend**: Vercel Serverless Functions (Node.js)
-   **Visualization**: Mermaid.js
-   **Blockchain**: Sui (Move Language)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sentinel.git
    cd sentinel
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Create a `.env.local` file in the root:
    ```env
    # Google Gemini API Key (Get at aistudio.google.com)
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npx vercel dev
    ```
    *Note: We use `vercel dev` to simulate the serverless backend locally.*

5.  **Open in Browser**
    Navigate to `http://localhost:3000`

## 🔒 Security

This project uses a **Serverless Proxy Pattern** to protect the Gemini API Key.
-   **Frontend**: Sends code to `/api/analyze`
-   **Backend (`api/analyze.ts`)**: Injects the API key and calls Google servers.
-   The API key is **never** exposed to the client browser.

## 🤝 Contributing

Contributions are welcome! Please check the [issues](https://github.com/yourusername/sentinel/issues) tab.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Built for the **Google Gemini x Sui Hackathon**. 🚀
