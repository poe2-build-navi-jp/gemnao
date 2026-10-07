-- Additive private intake; no changes to existing tables or data.
CREATE TABLE IF NOT EXISTS game_requests (
 id TEXT PRIMARY KEY, game_name TEXT NOT NULL, normalized_name TEXT NOT NULL UNIQUE,
 locale TEXT NOT NULL CHECK(locale IN ('ja','en','zh','es')),
 status TEXT NOT NULL DEFAULT 'received' CHECK(status IN ('received','verifying','researching','drafting','qa','published','covered','held','rejected')),
 canonical_game TEXT, reason_code TEXT, lease_token TEXT, lease_until INTEGER,
 attempt_count INTEGER NOT NULL DEFAULT 0, publication_url TEXT, publication_sha TEXT,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS game_requests_pending ON game_requests(status,created_at,id);
CREATE TABLE IF NOT EXISTS game_request_daily_salts (day TEXT PRIMARY KEY, salt TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS game_request_attempts (id TEXT PRIMARY KEY, day TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS game_request_attempts_network ON game_request_attempts(day,fingerprint);
CREATE INDEX IF NOT EXISTS game_request_attempts_day ON game_request_attempts(day);
