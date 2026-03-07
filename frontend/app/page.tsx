import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-bold tracking-tight text-green-400">
          ALICE-Queue-SaaS
        </span>
        <Link
          href="/dashboard/console"
          className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-sm font-medium transition-colors"
        >
          Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Message Queuing with{" "}
          <span className="text-green-400">BLAKE3 Content-Addressing</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Publish, consume, and acknowledge messages with exact-once semantics.
          Priority queues, dead-letter queues, and BLAKE3-based deduplication
          keep your pipelines reliable.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard/console"
            className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors"
          >
            Open Console
          </Link>
          <a
            href="#features"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-semibold transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-300">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "BLAKE3 Content-Addressing",
              desc: "Every message is hashed with BLAKE3 for fast, collision-resistant deduplication and content verification.",
              icon: "#",
            },
            {
              title: "Publish / Consume / Ack",
              desc: "Full message lifecycle with at-least-once delivery guarantees and explicit acknowledgment.",
              icon: "↔",
            },
            {
              title: "Priority Queues",
              desc: "Assign priorities 0-9 to messages. High-priority work always runs first.",
              icon: "⬆",
            },
            {
              title: "Dead Letter Queues",
              desc: "Failed messages are routed to a DLQ after configurable retries for inspection and replay.",
              icon: "✗",
            },
            {
              title: "Deduplication",
              desc: "Supply an idempotency key to guarantee a message is enqueued exactly once within a time window.",
              icon: "≡",
            },
            {
              title: "Live Stats",
              desc: "Real-time queue depth, throughput, and DLQ counts via a single API call.",
              icon: "~",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-700 transition-colors"
            >
              <div className="text-3xl mb-3 font-mono text-green-500">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-green-300">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        ALICE-Queue-SaaS — Project A.L.I.C.E. &mdash; AGPL-3.0-or-later
      </footer>
    </div>
  );
}
