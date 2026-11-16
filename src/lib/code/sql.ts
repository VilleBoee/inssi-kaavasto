import type { Language } from "./types";
import { SQL_THEORY } from "./sql-theory";

const tableNote = {
  fi: "Esimerkit käyttävät taulua students (id, name, credits, year): (1, Aino, 55, 1), (2, Leevi, 120, 2), (3, Noora, 180, 3).",
  en: "Samples use the table students (id, name, credits, year): (1, Aino, 55, 1), (2, Leevi, 120, 2), (3, Noora, 180, 3).",
};

const sqlLessons: Language = {
  id: "sql",
  name: "SQL",
  short: "SQL",
  runnable: false,
  blurb: {
    fi: "Kyselykieli tauluille. Kerrot, mitä rivejä haluat, et askelia joilla ne haetaan.",
    en: "A query language for tables. You say which rows you want, not the steps that fetch them.",
  },
  run: {
    fi: "Aja kysely tietokannan asiakkaassa, esimerkiksi sqlite3 kanta.db.",
    en: "Run the query in a database client, for example sqlite3 database.db.",
  },
  lessons: [
    {
      id: "select",
      topic: "perusteet",
      title: { fi: "SELECT", en: "SELECT" },
      blurb: {
        fi: "SELECT valitsee sarakkeet, FROM kertoo taulun. Tähti * tarkoittaa kaikkia sarakkeita.",
        en: "SELECT picks the columns, FROM names the table. A star * means every column.",
      },
      points: [
        { fi: "Järjestys on SELECT … FROM …, ei toisin päin.", en: "The order is SELECT … FROM …, not the other way around." },
        { fi: "AS antaa sarakkeelle tulosteessa käytettävän nimen.", en: "AS gives the column a name used in the result." },
      ],
      file: "select.sql",
      code: `SELECT name, credits
FROM students;`,
      output: `Aino|55
Leevi|120
Noora|180`,
      note: tableNote,
      tags: ["select", "from", "query", "kysely"],
    },
    {
      id: "where",
      topic: "ohjaus",
      title: { fi: "WHERE", en: "WHERE" },
      blurb: {
        fi: "WHERE rajaa rivit. Teksti kirjoitetaan yksinkertaisiin lainausmerkkeihin. NULL-vertailu on IS NULL, ei = NULL.",
        en: "WHERE keeps some rows. Text is written in single quotes. A NULL test is IS NULL, not = NULL.",
      },
      points: [
        { fi: "AND ja OR yhdistävät ehtoja. Sulut ratkaisevat järjestyksen.", en: "AND and OR combine tests. Parentheses decide the order." },
        { fi: "LIKE '%oo%' etsii osajonoa. % on mikä tahansa pätkä.", en: "LIKE '%oo%' searches for a substring. % is any stretch of text." },
      ],
      file: "where.sql",
      code: `SELECT name, credits
FROM students
WHERE credits >= 100;`,
      output: `Leevi|120
Noora|180`,
      note: tableNote,
      tags: ["where", "and", "null", "like", "ehto"],
    },
    {
      id: "order",
      topic: "ohjaus",
      title: { fi: "ORDER BY ja LIMIT", en: "ORDER BY and LIMIT" },
      blurb: {
        fi: "ORDER BY järjestää tuloksen. DESC on laskeva. LIMIT katkaisee rivimäärän, OFFSET ohittaa alusta.",
        en: "ORDER BY sorts the result. DESC is descending. LIMIT cuts the row count, OFFSET skips from the start.",
      },
      points: [
        { fi: "Ilman ORDER BY -lausetta rivien järjestys ei ole taattu.", en: "Without ORDER BY the row order is not guaranteed." },
        { fi: "LIMIT tulee kyselyn loppuun.", en: "LIMIT goes at the end of the query." },
      ],
      file: "order.sql",
      code: `SELECT name, credits
FROM students
ORDER BY credits DESC
LIMIT 2;`,
      output: `Noora|180
Leevi|120`,
      note: tableNote,
      tags: ["order", "limit", "offset", "sort", "järjestys"],
    },
    {
      id: "write",
      topic: "tieto",
      title: { fi: "INSERT, UPDATE, DELETE", en: "INSERT, UPDATE, DELETE" },
      blurb: {
        fi: "INSERT lisää rivin, UPDATE muuttaa ehtoon osuvia, DELETE poistaa ne. UPDATE ja DELETE ilman WHERE-ehtoa koskevat koko taulua.",
        en: "INSERT adds a row, UPDATE changes rows that match, DELETE removes them. UPDATE and DELETE without WHERE touch the whole table.",
      },
      points: [
        { fi: "Kirjoita WHERE ensin SELECT-kyselynä ja varmista rivit, sitten vasta UPDATE.", en: "Write the WHERE as a SELECT first and check the rows, then run the UPDATE." },
        { fi: "INSERT luettelee sarakkeet. Jätä lista pois vain, jos annat arvon jokaiseen sarakkeeseen.", en: "INSERT names the columns. Omit the list only when you give a value for every column." },
      ],
      file: "write.sql",
      code: `INSERT INTO students (name, credits, year)
VALUES ('Elias', 10, 1);

UPDATE students
SET credits = credits + 5
WHERE name = 'Aino';

DELETE FROM students
WHERE id = 99;`,
      output: `1 rivi lisätty
1 rivi päivitetty
0 riviä poistettu`,
      note: tableNote,
      tags: ["insert", "update", "delete", "lisäys", "poisto"],
    },
    {
      id: "join",
      topic: "kysely",
      title: { fi: "JOIN", en: "JOIN" },
      blurb: {
        fi: "JOIN yhdistää kaksi taulua yhteisen avaimen perusteella. INNER palauttaa vain parit, LEFT pitää vasemman taulun rivit vaikka paria ei ole.",
        en: "JOIN combines two tables on a shared key. INNER returns only pairs, LEFT keeps rows from the left table even when there is no pair.",
      },
      points: [
        { fi: "ON kertoo parituksen. WHERE sen jälkeen rajaa valmista tulosta.", en: "ON states the match. WHERE after that filters the finished result." },
        { fi: "Käytä taulun nimeä sarakkeen edessä, kun sama nimi on molemmissa: s.name.", en: "Put the table name before the column when both tables share it: s.name." },
      ],
      file: "join.sql",
      code: `SELECT s.name, c.name AS course
FROM students AS s
JOIN completions AS e ON e.student_id = s.id
JOIN courses AS c ON c.id = e.course_id
WHERE s.name = 'Aino';`,
      output: `Aino|Ohjelmointi 1`,
      note: {
        fi: "completions yhdistää opiskelijan ja kurssin. Esimerkissä Ainolla on yksi suoritus, kurssi Ohjelmointi 1.",
        en: "completions links a student and a course. In the sample Aino has one completion, the course Ohjelmointi 1.",
      },
      tags: ["join", "inner", "left", "liitos", "foreign"],
    },
    {
      id: "group",
      topic: "kysely",
      title: { fi: "GROUP BY", en: "GROUP BY" },
      blurb: {
        fi: "GROUP BY kokoaa rivit ryhmiksi. COUNT, SUM ja AVG laskevat ryhmän sisällä. HAVING rajaa ryhmiä, WHERE rajaa rivejä ennen ryhmitystä.",
        en: "GROUP BY folds rows into groups. COUNT, SUM and AVG compute inside a group. HAVING filters groups, WHERE filters rows before grouping.",
      },
      points: [
        { fi: "SELECT-listan tavallisen sarakkeen pitää olla mukana GROUP BY -listassa.", en: "A plain column in the SELECT list has to appear in the GROUP BY list." },
        { fi: "COUNT(*) laskee rivit, COUNT(sarake) ohittaa NULL-arvot.", en: "COUNT(*) counts rows, COUNT(column) skips NULLs." },
      ],
      file: "group.sql",
      code: `SELECT year, COUNT(*) AS student_count, SUM(credits) AS credits_sum
FROM students
GROUP BY year
ORDER BY year;`,
      output: `1|1|55
2|1|120
3|1|180`,
      note: tableNote,
      tags: ["group", "count", "sum", "having", "aggregate"],
    },
    {
      id: "create",
      topic: "skeema",
      title: { fi: "CREATE TABLE", en: "CREATE TABLE" },
      blurb: {
        fi: "CREATE TABLE luo rakenteen. PRIMARY KEY yksilöi rivin. NOT NULL kieltää tyhjän arvon. INTEGER PRIMARY KEY on SQLitessä usein myös juokseva tunniste.",
        en: "CREATE TABLE builds the shape. PRIMARY KEY identifies a row. NOT NULL forbids an empty value. INTEGER PRIMARY KEY is often also an auto id in SQLite.",
      },
      points: [
        { fi: "FOREIGN KEY viittaa toisen taulun avaimeen. Se estää orvon rivin, jos tietokanta valvoo viitteitä.", en: "FOREIGN KEY points at another table's key. It blocks an orphan row when the database enforces references." },
        { fi: "Tyyppinimet vaihtelevat. SQLite on löyhä, PostgreSQL tiukka.", en: "Type names differ. SQLite is loose, PostgreSQL is strict." },
      ],
      file: "create.sql",
      code: `CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    year INTEGER NOT NULL
);`,
      output: `(taulu luotu)`,
      note: {
        fi: "Tuloste riippuu asiakkaasta. SQLite ei tulosta rivejä onnistuneesta CREATE-lauseesta.",
        en: "The output depends on the client. SQLite prints no rows for a successful CREATE.",
      },
      tags: ["create", "table", "primary", "foreign", "schema"],
    },
    {
      id: "alias",
      topic: "kysely",
      title: { fi: "Aliakset", en: "Aliases" },
      blurb: {
        fi: "AS antaa taululle tai sarakkeelle lyhyen nimen tässä kyselyssä. Se ei muuta taulua.",
        en: "AS gives a table or a column a short name in this query. It does not change the table.",
      },
      points: [
        { fi: "Taulun alias kirjoitetaan sarakkeen eteen: s.name.", en: "A table alias is written in front of the column: s.name." },
        { fi: "WHERE ei aina näe SELECT-listan aliasta.", en: "WHERE does not always see an alias from the SELECT list." },
      ],
      file: "alias.sql",
      code: `SELECT s.name AS student_name, s.credits AS credit_points
FROM students AS s
WHERE s.credits >= 100;`,
      output: `Leevi|120
Noora|180`,
      note: tableNote,
      tags: ["as", "alias", "alias"],
    },
    {
      id: "subquery",
      topic: "kysely",
      title: { fi: "Alikysely", en: "A subquery" },
      blurb: {
        fi: "Sulkeissa oleva SELECT laskee arvon tai listan, jota ulompi kysely käyttää.",
        en: "A SELECT in parentheses computes a value or a list that the outer query uses.",
      },
      points: [
        { fi: "Yksi arvo sopii vertailuun >. Monta arvoa sopii sanaan IN.", en: "One value fits a comparison >. Many values fit the word IN." },
        { fi: "Sisäpuoli lasketaan ensin.", en: "The inside is computed first." },
      ],
      file: "subquery.sql",
      code: `SELECT name, credits
FROM students
WHERE credits > (SELECT AVG(credits) FROM students);`,
      output: `Noora|180`,
      note: tableNote,
      tags: ["subquery", "avg", "in", "alikysely"],
    },
    {
      id: "nulls",
      topic: "ohjaus",
      title: { fi: "NULL", en: "NULL" },
      blurb: {
        fi: "NULL tarkoittaa puuttuvaa arvoa. Se ei ole nolla. COALESCE näyttää sijaan toisen arvon.",
        en: "NULL means a missing value. It is not zero. COALESCE shows another value instead.",
      },
      points: [
        { fi: "IS NULL on ainoa oikea tyhjyyden testi.", en: "IS NULL is the only correct test for emptiness." },
        { fi: "COUNT(sarake) ohittaa NULL-arvot, COUNT(*) ei.", en: "COUNT(column) skips NULLs, COUNT(*) does not." },
      ],
      file: "null.sql",
      code: `SELECT name, COALESCE(credits, 0) AS credits
FROM students
WHERE credits IS NULL;`,
      output: `(rivit, joiden credits on NULL)`,
      note: tableNote,
      tags: ["null", "coalesce", "is null"],
    },
    {
      id: "index",
      topic: "skeema",
      title: { fi: "Indeksi", en: "An index" },
      blurb: {
        fi: "CREATE INDEX nopeuttaa hakua ja järjestystä. Se ei muuta kyselyn tulosta.",
        en: "CREATE INDEX speeds up a search and an order. It does not change the query result.",
      },
      points: [
        { fi: "PRIMARY KEY on jo indeksi.", en: "A PRIMARY KEY is already an index." },
        { fi: "Indeksi joka sarakkeessa hidastaa kirjoitusta.", en: "An index on every column slows writing." },
      ],
      file: "index.sql",
      code: `CREATE INDEX idx_students_credits
ON students(credits);`,
      output: `(indeksi luotu)`,
      tags: ["index", "create index", "haku", "skeema"],
    },
    {
      id: "pitfalls",
      topic: "rakenne",
      title: { fi: "Yleiset virheet", en: "Common mistakes" },
      blurb: {
        fi: "NULL ja WHERE väärässä kohdassa muuttavat tuloksen ilman virheilmoitusta.",
        en: "NULL and a WHERE in the wrong place change the result without an error message.",
      },
      points: [
        { fi: "WHERE credits = NULL ei palauta rivejä. Oikea muoto on WHERE credits IS NULL.", en: "WHERE credits = NULL returns no rows. The correct form is WHERE credits IS NULL." },
        { fi: "HAVING ilman GROUP BY -lausetta suodattaa koko tuloksen yhtenä ryhmänä.", en: "HAVING without GROUP BY filters the whole result as one group." },
      ],
      file: "pitfalls.sql",
      code: `SELECT name
FROM students
WHERE credits = NULL;

SELECT name
FROM students
WHERE credits IS NULL;`,
      output: `(ei rivejä)
(NULL-rivit, jos niitä on)`,
      note: tableNote,
      tags: ["null", "bug", "virhe", "where", "having"],
    },
  ],
};

export const sql: Language = {
  ...sqlLessons,
  lessons: sqlLessons.lessons.map((lesson) => ({
    ...lesson,
    theory: SQL_THEORY[lesson.id],
  })),
};
