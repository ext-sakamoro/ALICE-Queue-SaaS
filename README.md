# ALICE-Queue-SaaS

Message queue service with BLAKE3 content-addressing, priority queues, dead-letter queues, and exact-once deduplication. Part of Project A.L.I.C.E.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       ALICE-Queue-SaaS                       │
│                                                             │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │  Next.js │   │  Rust API    │   │  Queue Engine      │  │
│  │ Frontend │──▶│  (Axum)      │──▶│  Priority Heap     │  │
│  │          │   │  :8081       │   │  DLQ Router        │  │
│  └──────────┘   └──────────────┘   └────────────────────┘  │
│                        │                      │             │
│                 ┌──────▼──────┐    ┌──────────▼─────────┐  │
│                 │  BLAKE3     │    │  Dedup Index        │  │
│                 │  Hasher     │    │  Ack Tracker        │  │
│                 └─────────────┘    └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Features

| Feature | Detail |
|---|---|
| BLAKE3 content-addressing | Fast, collision-resistant message hashing |
| Publish / Consume / Ack | Full lifecycle with at-least-once delivery |
| Priority queues | Message priorities 0 (normal) to 9 (highest) |
| Dead letter queues | Failed messages routed to DLQ after N retries |
| Deduplication | Idempotency key deduplication within time window |
| Live stats | Queue depth, throughput, DLQ count per queue |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/queue/publish` | Publish a message to a queue |
| POST | `/api/v1/queue/consume` | Consume up to N messages |
| POST | `/api/v1/queue/ack` | Acknowledge a consumed message |
| POST | `/api/v1/queue/create` | Create a new queue with DLQ config |
| GET | `/api/v1/queue/list` | List all queues |
| GET | `/api/v1/queue/stats` | Stats for all queues |

## Quick Start

```bash
# Clone and start
git clone https://github.com/ext-sakamoro/ALICE-Queue-SaaS.git
cd ALICE-Queue-SaaS

# Start the API (Rust)
cargo run --release

# Start the frontend
cd frontend
npm install
npm run dev
# Open http://localhost:3000

# Create a queue
curl -X POST http://localhost:8081/api/v1/queue/create \
  -H "Content-Type: application/json" \
  -d '{"name":"orders","dlq":"orders-dlq","max_retries":3}'

# Publish a message
curl -X POST http://localhost:8081/api/v1/queue/publish \
  -H "Content-Type: application/json" \
  -d '{"queue":"orders","payload":{"order_id":"o-001"},"priority":5}'

# Consume messages
curl -X POST http://localhost:8081/api/v1/queue/consume \
  -H "Content-Type: application/json" \
  -d '{"queue":"orders","max_messages":10}'
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8081` | Backend API base URL |
| `ALICE_QUEUE_DATA_DIR` | `/var/lib/alice-queue` | Queue persistence directory |
| `ALICE_QUEUE_MAX_RETENTION_SECS` | `86400` | Message retention period |

## License

AGPL-3.0-or-later. See [LICENSE](./LICENSE).

Part of [Project A.L.I.C.E.](https://github.com/ext-sakamoro)
