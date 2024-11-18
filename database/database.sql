DROP TABLE IF EXISTS chat_history;

CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY, 
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title TEXT NOT NULL, 
    prompt_file BYTEA NOT NULL, 
    answer_file BYTEA NOT NULL, 
    deleted BOOLEAN DEFAULT FALSE
);
