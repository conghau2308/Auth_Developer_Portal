# 🛡️ WiFaKey Developer Portal & Authorization UI

[![Next.js](https://img.shields.io/badge/Next.js-Black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-00A67E?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://auth-developer-portal.vercel.app/)

WiFaKey Developer Portal is the frontend application for the WiFaKey Authentication ecosystem. It serves a dual purpose: providing a highly secure, passwordless facial biometric authentication interface for end-users, handling the core OAuth authorization flow, and offering a comprehensive management dashboard for developers to configure OAuth 2.1 / OIDC clients.

🌍 **Live Demo:** [WiFaKey Developer Portal](https://auth-developer-portal.vercel.app/)

## ✨ Key Features

### 🔄 OAuth 2.1 Authorization Flow Handling
*   **Authorization Endpoint:** Acts as the primary interface for initiating the OAuth 2.1 / OIDC flow.
*   **Parameter Parsing & Validation:** Securely captures and validates standard authorization request parameters including `client_id`, `redirect_uri`, `response_type`, `scope`, `state`, and PKCE parameters (`code_challenge`, `code_challenge_method`).
*   **Seamless Redirection Pipeline:** Guides users through the biometric authentication and consent pipeline, safely redirecting back to the client application with the authorization `code` upon completion.

### 👤 Passwordless Biometric Authentication
*   **Client-side Face Processing:** Utilizes `MediaPipe FaceMesh` directly in the browser for fast, privacy-preserving biometric capture.
*   **Advanced Liveness Detection:** Multi-layered anti-spoofing mechanism ensuring real-user presence:
    *   *Challenge-Response:* Prompts for blinking and head turning.
    *   *Passive Analysis:* Evaluates micro-movements and depth variance.
    *   *Quality Control:* Real-time image quality checks and a recasting/recentering phase before final capture.

### ⚙️ Developer Management & Dashboard
*   **OAuth Client Management:** Intuitive dashboard for developers to register and manage OAuth clients, configure redirect URIs, and handle credentials.
*   **Consent Management:** User-facing consent screens for scope authorization, featuring an auto-skip mechanism for previously authorized clients.
*   **Secure Session Handling:** Seamless token management using Axios interceptors and `TanStack Query` for automatic, background token refreshing without interrupting the user experience.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI / Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **State & Data Fetching:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
*   **Computer Vision:** [MediaPipe FaceMesh](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)
*   **HTTP Client:** [Axios](https://axios-http.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
*   Node.js 18.x or higher
*   npm, yarn, pnpm, or bun installed

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/wifakey-frontend.git](https://github.com/your-username/wifakey-frontend.git)
   cd wifakey-frontend