package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func Open(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ping sqlite: %w", err)
	}

	db.SetMaxOpenConns(1)

	if err := migrate(db); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}

	log.Printf("[db] connected to %s", dbPath)
	return db, nil
}

func migrate(db *sql.DB) error {
	const schema = `
	CREATE TABLE IF NOT EXISTS volunteers (
		id         INTEGER  PRIMARY KEY AUTOINCREMENT,
		name       TEXT     NOT NULL,
		email      TEXT     NOT NULL UNIQUE,
		phone      TEXT     NOT NULL,
		role       TEXT     NOT NULL DEFAULT '',
		message    TEXT     NOT NULL DEFAULT '',
		created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
	);

	CREATE INDEX IF NOT EXISTS idx_volunteers_email      ON volunteers(email);
	CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at);

	CREATE TABLE IF NOT EXISTS events (
		id          INTEGER  PRIMARY KEY AUTOINCREMENT,
		title       TEXT     NOT NULL,
		category    TEXT     NOT NULL DEFAULT '',
		location    TEXT     NOT NULL DEFAULT '',
		description TEXT     NOT NULL DEFAULT '',
		event_date  TEXT     NOT NULL,
		latitude    REAL     NOT NULL DEFAULT 0,
		longitude   REAL     NOT NULL DEFAULT 0,
		created_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
	);

	CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

	CREATE TABLE IF NOT EXISTS payments (
		id          INTEGER  PRIMARY KEY AUTOINCREMENT,
		reference   TEXT     NOT NULL UNIQUE,
		email       TEXT     NOT NULL,
		amount      INTEGER  NOT NULL,
		status      TEXT     NOT NULL DEFAULT 'pending',
		created_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
	);

	CREATE INDEX IF NOT EXISTS idx_payments_reference  ON payments(reference);
	CREATE INDEX IF NOT EXISTS idx_payments_email      ON payments(email);
	CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

	CREATE TABLE IF NOT EXISTS stories (
		id          INTEGER  PRIMARY KEY AUTOINCREMENT,
		story       TEXT     NOT NULL,
		duration    TEXT     NOT NULL DEFAULT '',
		support     TEXT     NOT NULL DEFAULT '',
		pseudonym   TEXT     NOT NULL DEFAULT '',
		final_note  TEXT     NOT NULL DEFAULT '',
		created_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
	);

	CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at);
	`

	alterStatements := []string{
		`ALTER TABLE events ADD COLUMN latitude  REAL NOT NULL DEFAULT 0`,
		`ALTER TABLE events ADD COLUMN longitude REAL NOT NULL DEFAULT 0`,
	}

	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("exec schema: %w", err)
	}

	for _, stmt := range alterStatements {
		db.Exec(stmt)
	}

	log.Println("[db] schema ok")
	return nil
}