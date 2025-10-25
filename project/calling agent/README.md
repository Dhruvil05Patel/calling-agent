# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Deployment / n8n integration

This project contains a small React frontend used to trigger an n8n Webhook Trigger to start calls.

What was added for Vercel deployment:

- `api/webhook/start-call.js` — a serverless function that forwards POST requests to your configured n8n webhook.
	- Configure the environment variable `N8N_WEBHOOK_URL` in Vercel (Project → Settings → Environment Variables) to your n8n webhook URL, for example:
		- Key: `N8N_WEBHOOK_URL`
		- Value: `https://voice1agent.app.n8n.cloud/webhook/start-call`

- Optionally set `VITE_N8N_WEBHOOK_URL` if you prefer the frontend to call n8n directly (not recommended for public apps).

Local development:

1. Install deps and run dev server:

```bash
npm install
npm run dev
```

2. The Vite dev server proxies `/api/*` to your n8n host (see `vite.config.js`) so the browser avoids CORS during development.

Security notes:

- Avoid committing `.env` files. Use the `.env.example` as guidance.
- Prefer the serverless proxy (`N8N_WEBHOOK_URL`) to hide the real webhook from client-side code.
