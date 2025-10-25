import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Use an environment variable in production. For local development we proxy
  // requests through Vite at /api/webhook/start-call (see vite.config.js).
  // On Vercel set VITE_N8N_WEBHOOK_URL to your n8n webhook (e.g.
  // https://your-n8n-host/webhook/start-call). If unset, the app falls back
  // to the local dev proxy path which will 404 in production.
  const defaultDevProxy = '/api/webhook/start-call'
  const envWebhook = import.meta.env.VITE_N8N_WEBHOOK_URL
  const N8N_WEBHOOK_URL = envWebhook ? envWebhook : defaultDevProxy

  const handleCallClients = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          action: 'call_clients'
        })
      });

      if (response.ok) {
        setMessage('Successfully triggered client calls!');
      } else {
        setMessage('Failed to trigger calls. Please try again.');
      }
    } catch (error) {
      setMessage('Error connecting to webhook. Please check your connection.');
      console.error('Webhook error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Phone className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Calling Agent
          </h1>
          <p className="text-gray-600">
            Automate your client outreach with one click
          </p>
        </div>

        <button
          onClick={handleCallClients}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Call the Clients
            </>
          )}
        </button>

        {message && (
          <div
            className={`mt-4 p-4 rounded-lg text-center font-medium ${
              message.includes('Success')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            In production set <code>VITE_N8N_WEBHOOK_URL</code> (Vercel env var) to your n8n webhook
            (for example <code>https://voice1agent.app.n8n.cloud/webhook/start-call</code>). For local
            development the app uses <code>/api/webhook/start-call</code> which is proxied to your n8n
            host by Vite. If you change <code>vite.config.js</code> restart the dev server.
          </p>
        </div>
      </div>
    </div>
  );
}