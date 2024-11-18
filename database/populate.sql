INSERT INTO chat_history (title, prompt_file, answer_file, deleted)
VALUES 
    ('Sample Chat 1', decode('This is a sample prompt for chat 1', 'escape'), decode('This is a sample answer for chat 1', 'escape'), FALSE),
    ('Sample Chat 2', decode('Another prompt for chat 2', 'escape'), decode('Another answer for chat 2', 'escape'), FALSE),
    ('Sample Chat 3', decode('Prompt text for chat 3', 'escape'), decode('Answer text for chat 3', 'escape'), TRUE);