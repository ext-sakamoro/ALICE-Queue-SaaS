"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

type Tab = "publish" | "consume" | "create" | "stats";

export default function ConsolePage() {
  const [tab, setTab] = useState<Tab>("publish");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // publish tab
  const [publishQueue, setPublishQueue] = useState("default");
  const [publishPayload, setPublishPayload] = useState('{"event":"user.created","id":"u-001"}');
  const [publishPriority, setPublishPriority] = useState("0");
  const [publishDedup, setPublishDedup] = useState("");

  // consume tab
  const [consumeQueue, setConsumeQueue] = useState("default");
  const [consumeMax, setConsumeMax] = useState("10");
  const [consumeAckId, setConsumeAckId] = useState("");

  // create tab
  const [createName, setCreateName] = useState("my-queue");
  const [createDlq, setCreateDlq] = useState("my-queue-dlq");
  const [createMaxRetries, setCreateMaxRetries] = useState("3");

  async function post(path: string, body: unknown) {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  async function get(path: string) {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE}${path}`);
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  const tabs: Tab[] = ["publish", "consume", "create", "stats"];

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-300">
        ALICE-Queue-SaaS / Console
      </h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setResult(""); }}
            className={`px-4 py-2 rounded text-sm uppercase tracking-wide transition-colors ${
              tab === t
                ? "bg-green-700 text-white"
                : "bg-gray-800 text-green-400 hover:bg-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-4">
        {/* PUBLISH */}
        {tab === "publish" && (
          <>
            <h2 className="text-lg font-semibold text-green-300">Publish Message</h2>
            <label className="block text-sm">
              Queue Name
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                value={publishQueue}
                onChange={(e) => setPublishQueue(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Payload (JSON)
              <textarea
                rows={4}
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500 resize-none"
                value={publishPayload}
                onChange={(e) => setPublishPayload(e.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm">
                Priority (0 = normal, 9 = highest)
                <input
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                  type="number"
                  min={0}
                  max={9}
                  value={publishPriority}
                  onChange={(e) => setPublishPriority(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                Deduplication Key (optional)
                <input
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                  placeholder="idempotency key"
                  value={publishDedup}
                  onChange={(e) => setPublishDedup(e.target.value)}
                />
              </label>
            </div>
            <button
              onClick={() => {
                let payload: unknown;
                try { payload = JSON.parse(publishPayload); } catch { payload = publishPayload; }
                post("/api/v1/queue/publish", {
                  queue: publishQueue,
                  payload,
                  priority: parseInt(publishPriority),
                  dedup_key: publishDedup || undefined,
                });
              }}
              disabled={loading}
              className="px-5 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm disabled:opacity-50"
            >
              {loading ? "Publishing..." : "POST /queue/publish"}
            </button>
          </>
        )}

        {/* CONSUME */}
        {tab === "consume" && (
          <>
            <h2 className="text-lg font-semibold text-green-300">Consume / Ack Messages</h2>
            <label className="block text-sm">
              Queue Name
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                value={consumeQueue}
                onChange={(e) => setConsumeQueue(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Max Messages
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                type="number"
                min={1}
                value={consumeMax}
                onChange={(e) => setConsumeMax(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Ack ID (for /queue/ack)
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                placeholder="ack-xxxxxxxx"
                value={consumeAckId}
                onChange={(e) => setConsumeAckId(e.target.value)}
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  post("/api/v1/queue/consume", {
                    queue: consumeQueue,
                    max_messages: parseInt(consumeMax),
                  })
                }
                disabled={loading}
                className="px-5 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm disabled:opacity-50"
              >
                {loading ? "Consuming..." : "POST /queue/consume"}
              </button>
              <button
                onClick={() =>
                  post("/api/v1/queue/ack", {
                    ack_id: consumeAckId,
                  })
                }
                disabled={loading || !consumeAckId}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white text-sm disabled:opacity-50"
              >
                POST /queue/ack
              </button>
            </div>
          </>
        )}

        {/* CREATE */}
        {tab === "create" && (
          <>
            <h2 className="text-lg font-semibold text-green-300">Create Queue</h2>
            <label className="block text-sm">
              Queue Name
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Dead Letter Queue Name
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                value={createDlq}
                onChange={(e) => setCreateDlq(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Max Retries
              <input
                className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-500"
                type="number"
                min={0}
                value={createMaxRetries}
                onChange={(e) => setCreateMaxRetries(e.target.value)}
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  post("/api/v1/queue/create", {
                    name: createName,
                    dlq: createDlq,
                    max_retries: parseInt(createMaxRetries),
                  })
                }
                disabled={loading}
                className="px-5 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm disabled:opacity-50"
              >
                {loading ? "Creating..." : "POST /queue/create"}
              </button>
              <button
                onClick={() => get("/api/v1/queue/list")}
                disabled={loading}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded text-green-400 text-sm disabled:opacity-50"
              >
                GET /queue/list
              </button>
            </div>
          </>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <>
            <h2 className="text-lg font-semibold text-green-300">Queue Stats</h2>
            <p className="text-sm text-gray-400">
              Fetch aggregated stats for all queues including depth, throughput, and DLQ counts.
            </p>
            <button
              onClick={() => get("/api/v1/queue/stats")}
              disabled={loading}
              className="px-5 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm disabled:opacity-50"
            >
              {loading ? "Loading..." : "GET /queue/stats"}
            </button>
          </>
        )}
      </div>

      {/* Result */}
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Response</p>
        <pre className="text-green-400 text-sm whitespace-pre-wrap break-all min-h-[120px]">
          {loading ? "Waiting for response..." : result || "— no result yet —"}
        </pre>
      </div>
    </div>
  );
}
