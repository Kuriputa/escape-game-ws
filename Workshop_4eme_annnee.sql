CREATE TABLE "Room" (
  "id_room" SERIAL PRIMARY KEY,
  "name" VARCHAR(255)
);

CREATE TABLE "Clue" (
    "id_clue" SERIAL PRIMARY KEY,
    "content" VARCHAR(255)
);

CREATE TABLE "Player" (
    "id_player" SERIAL PRIMARY KEY,
    "pseudo" VARCHAR(255)
);

CREATE TABLE "Answer" (
    "id_answer" SERIAL PRIMARY KEY,
    "content" VARCHAR(255),
    "is_correct" BOOLEAN
);

CREATE TABLE "Question" (
    "id_question" SERIAL PRIMARY KEY,
    "id_room" INT REFERENCES "Room" ("id_room"),
    "id_clue" INT REFERENCES "Clue" ("id_clue"),
    "id_player" INT REFERENCES "Player" ("id_player"),
    "content" VARCHAR(255)
);

CREATE TABLE "Question_Answer" (
    "id_question" INT REFERENCES "Question" ("id_question"),
    "id_answer" INT REFERENCES "Answer" ("id_answer"),
    PRIMARY KEY ("id_question", "id_answer")
);
