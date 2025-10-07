CREATE TABLE "Salle" (
  "id_salle" int
);

CREATE TABLE "Question" (
  "id_question" int,
  "id_salle" int,
  "id_indice" int,
  "id_joueur" int,
  "contenu" varchar(255)
);

CREATE TABLE "Reponse" (
  "id_reponse" int,
  "contenu" varchar(255),
  "is_correct" bool
);

CREATE TABLE "Question_réponse" (
  "id_question" int,
  "id_reponse" int
);

CREATE TABLE "indice" (
  "id_indice" int,
  "contenu" varchar(255)
);

CREATE TABLE "Joueur" (
  "id_joueur" int,
  "pseudo" int
);

ALTER TABLE "Salle" ADD FOREIGN KEY ("id_salle") REFERENCES "Question" ("id_salle");

ALTER TABLE "indice" ADD FOREIGN KEY ("id_indice") REFERENCES "Question" ("id_indice");

ALTER TABLE "Joueur" ADD FOREIGN KEY ("id_joueur") REFERENCES "Question" ("id_joueur");

ALTER TABLE "Question_réponse" ADD FOREIGN KEY ("id_question") REFERENCES "Question" ("id_question");

ALTER TABLE "Question_réponse" ADD FOREIGN KEY ("id_reponse") REFERENCES "Reponse" ("id_reponse");
