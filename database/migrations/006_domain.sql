-- ALICE Queue: Domain-specific tables
CREATE TABLE IF NOT EXISTS message_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    retention_hours INTEGER NOT NULL DEFAULT 168,
    max_size_mb INTEGER NOT NULL DEFAULT 1024,
    dead_letter_queue TEXT,
    messages_ready BIGINT NOT NULL DEFAULT 0,
    messages_unacked BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queue_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID NOT NULL REFERENCES message_queues(id) ON DELETE CASCADE,
    period_start TIMESTAMPTZ NOT NULL,
    published BIGINT NOT NULL DEFAULT 0,
    consumed BIGINT NOT NULL DEFAULT 0,
    acknowledged BIGINT NOT NULL DEFAULT 0,
    dead_lettered BIGINT NOT NULL DEFAULT 0,
    bytes_throughput BIGINT NOT NULL DEFAULT 0,
    avg_latency_us BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_message_queues_user ON message_queues(user_id);
CREATE INDEX idx_queue_metrics_queue ON queue_metrics(queue_id, period_start);
