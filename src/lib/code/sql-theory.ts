import type { Copy } from "./types";

export const SQL_THEORY: Record<string, Copy> = {
  select: {
    fi: `**SELECT** kertoo, mitkä sarakkeet halutaan. **FROM** kertoo, mistä taulusta. Järjestys on aina tämä. Tähti §*§ on kaikki sarakkeet. Sitä käytetään, kun tutkit taulua. Oikeassa kyselyssä luettele nimet, jotta tulos ei hajoa, jos tauluun lisätään sarake.

§AS§ antaa tulossarakkeelle nimen. §credits AS credit_points§ ei muuta taulua. Se muuttaa vain tämän tulosteen otsikon. Lasku voi olla sarake: §credits / 60.0 AS years§. Jakolasku kokonaisluvuilla voi katketa, joten desimaali kirjoitetaan näkyviin.

>> Kysely ei käy rivejä for-silmukalla. Kirjoitat ehdon, ja tietokanta päättää tien. Siksi et ohjaa hakua askel askeleelta, vaan kuvaat tuloksen.`,
    en: `**SELECT** says which columns you want. **FROM** says which table they come from. The order is always this. A star §*§ means every column. Use it while you are looking at a table. In a real query, list the names, so the result does not break when a column is added.

§AS§ gives the result column a name. §credits AS credit_points§ does not change the table. It only changes the heading of this result. A calculation can be a column: §credits / 60.0 AS years§. Division of integers can truncate, so write a decimal when you need one.

>> A query does not walk the rows in a for loop. You write the condition, and the database chooses the path. You do not steer the search step by step. You describe the result.`,
  },
  where: {
    fi: `**WHERE** heittää pois rivit, jotka eivät täytä ehtoa. Ehto on vertailu: §credits >= 100§. Teksti kirjoitetaan yksinkertaisiin lainausmerkkeihin. Luku kirjoitetaan ilman lainausmerkkejä.

§AND§ vaatii molemmat ehdot. §OR§ riittää, että toinen on tosi. Sulut ratkaisevat, mikä yhdistyy ensin. §LIKE 'A%'§ etsii alun. Prosentti on mikä tahansa pätkä, alaviiva on yksi merkki.

>> §NULL§ ei ole yhtä suuri kuin mikään, ei edes toinen NULL. §= NULL§ ei palauta rivejä. Kirjoita §IS NULL§ tai §IS NOT NULL§.`,
    en: `**WHERE** drops the rows that do not pass the test. The test is a comparison: §credits >= 100§. Text is written in single quotes. A number is written without quotes.

§AND§ requires both tests. §OR§ is enough when one of them is true. Parentheses decide what combines first. §LIKE 'A%'§ searches for a prefix. A percent is any stretch of text, an underscore is one character.

>> §NULL§ is not equal to anything, not even another NULL. §= NULL§ returns no rows. Write §IS NULL§ or §IS NOT NULL§.`,
  },
  order: {
    fi: `**ORDER BY** järjestää valmiin tuloksen. Ilman sitä rivien järjestys saa vaihtua, vaikka tänään se näyttäisi vakaalta. §DESC§ on suurin ensin. §ASC§ on pienin ensin, ja se on oletus.

Usea sarake järjestää tasapelit: §ORDER BY year, name§. Ensin vuosikurssi, ja saman kurssin sisällä nimi. §LIMIT 2§ katkaisee kahteen riviin. §OFFSET 2§ ohittaa kaksi ensimmäistä, joten seuraava sivu alkaa kolmannesta.

>> LIMIT ilman ORDER BY -lausetta antaa kaksi riviä, mutta et tiedä mitkä. Kirjoita järjestys aina, kun näytät listan käyttäjälle.`,
    en: `**ORDER BY** sorts the finished result. Without it the row order may change, even if it looks stable today. §DESC§ is largest first. §ASC§ is smallest first, and it is the default.

Several columns break ties: §ORDER BY year, name§. First the year, and inside the same year the name. §LIMIT 2§ cuts the result to two rows. §OFFSET 2§ skips the first two, so the next page starts at the third.

>> LIMIT without ORDER BY gives you two rows, but you do not know which. Always write the order when you show a list to a user.`,
  },
  write: {
    fi: `**INSERT** lisää rivin. Luettele sarakkeet ja sitten arvot samassa järjestyksessä. Jos jätät sarakkeen pois, siihen tulee oletus tai NULL. **UPDATE** muuttaa olemassa olevia rivejä. **DELETE** poistaa ne.

WHERE on pakollinen mielessä, vaikka kieli ei sitä vaadi. Ilman WHERE-ehtoa UPDATE ja DELETE koskevat jokaista riviä. Kirjoita sama ehto ensin SELECT-kyselyksi. Kun rivit ovat oikeat, vaihda alku UPDATE- tai DELETE-lauseeksi.

>> INSERT ei päivitä vanhaa riviä. Jos avain on jo olemassa, tietokanta hylkää rivin tai, erillisellä lauseella, päivittää sen. Älä oleta, että toinen INSERT korjaa ensimmäisen.`,
    en: `**INSERT** adds a row. List the columns and then the values in the same order. If you leave a column out, it gets the default or NULL. **UPDATE** changes rows that already exist. **DELETE** removes them.

WHERE is mandatory in your head, even when the language does not require it. Without a WHERE, UPDATE and DELETE touch every row. Write the same condition first as a SELECT. When the rows are the right ones, change the start into an UPDATE or a DELETE.

>> INSERT does not update an old row. If the key already exists, the database rejects the row or, with a separate statement, updates it. Do not assume that a second INSERT repairs the first.`,
  },
  join: {
    fi: `**JOIN** yhdistää kaksi taulua. §ON§ kertoo, mitkä rivit ovat pari. Opiskelijan id ja suorituksen student_id ovat se pari. Ilman ON-ehtoa jokainen rivi pariutuu jokaisen kanssa, ja tulos räjähtää.

§JOIN§ yksinään on sisäliitos: rivi jää pois, jos paria ei ole. §LEFT JOIN§ pitää vasemman taulun jokaisen rivin. Puuttuvan puolen sarakkeet ovat NULL. Sitä käytetään, kun haluat myös opiskelijan, jolla ei ole suoritusta.

>> Anna taululle lyhyt nimi §AS s§ ja kirjoita §s.name§. Kun molemmissa tauluissa on sarake name, pelkkä name on monitulkintainen ja kysely ei käy.`,
    en: `**JOIN** combines two tables. §ON§ says which rows are a pair. The student's id and the completion's student_id are that pair. Without an ON condition every row pairs with every row, and the result explodes.

§JOIN§ alone is an inner join: a row is dropped when there is no pair. §LEFT JOIN§ keeps every row of the left table. The columns of the missing side are NULL. Use it when you also want a student who has no completion.

>> Give the table a short name §AS s§ and write §s.name§. When both tables have a column name, a bare name is ambiguous and the query fails.`,
  },
  group: {
    fi: `**GROUP BY** kokoaa rivit ryhmiksi, yksi ryhmä jokaista arvoa kohti. §COUNT(*)§ laskee rivit ryhmässä. §SUM§ ja §AVG§ laskevat sarakkeen. SELECT-listassa saa olla ryhmityssarake ja kooste, ei vapaata saraketta ryhmän sisältä.

**WHERE** rajaa rivit ennen ryhmitystä. **HAVING** rajaa valmiit ryhmät. §WHERE credits >= 100§ poistaa pienet rivit. §HAVING COUNT(*) > 1§ poistaa ryhmät, joissa on vain yksi opiskelija. Having ei näe yksittäistä pois suodatettua riviä.

>> NULL on oma ryhmänsä, jos ryhmityssarakkeessa on tyhjiä. COUNT(sarake) ei laske niitä. COUNT(*) laskee. Valitse se, jota tarkoitat.`,
    en: `**GROUP BY** folds rows into groups, one group for each value. §COUNT(*)§ counts the rows in a group. §SUM§ and §AVG§ compute a column. The SELECT list may contain the grouping column and an aggregate, not a free column from inside the group.

**WHERE** filters rows before grouping. **HAVING** filters the finished groups. §WHERE credits >= 100§ drops the small rows. §HAVING COUNT(*) > 1§ drops groups that have only one student. Having does not see a row that was already filtered out.

>> NULL is its own group when the grouping column has empties. COUNT(column) does not count them. COUNT(*) does. Pick the one you mean.`,
  },
  create: {
    fi: `**CREATE TABLE** luo tyhjän rakenteen. Jokaisella sarakkeella on nimi ja tyyppi. §PRIMARY KEY§ on se sarake, joka yksilöi rivin. Kahta samaa avainta ei saa olla. §NOT NULL§ kieltää tyhjän. §DEFAULT§ antaa arvon, jos INSERT ei sitä kerro.

§FOREIGN KEY§ sanoo, että arvon pitää löytyä toisesta taulusta. Opiskelijan id suorituksessa ei saa olla keksitty. SQLite ei valvo viitettä, ellei sitä ole kytketty päälle. PostgreSQL valvoo.

>> Älä tallenna laskettavaa arvoa, jos sen voi kysyä. Opintopisteiden summa kurssilta on kysely, ei oma sarake, ellei summa on kallis ja erikseen perusteltu. Rakenne kertoo tosiasiat. Kysely kertoo yhteenvedon.`,
    en: `**CREATE TABLE** builds an empty shape. Each column has a name and a type. §PRIMARY KEY§ is the column that identifies a row. Two equal keys are not allowed. §NOT NULL§ forbids an empty value. §DEFAULT§ supplies a value when INSERT does not.

§FOREIGN KEY§ says the value has to exist in another table. A student id on a completion must not be invented. SQLite does not enforce the reference unless it is switched on. PostgreSQL does.

>> Do not store a value you can query, unless the sum is expensive and you have a reason. The sum of credits is a query, not its own column. The shape stores facts. A query stores the summary.`,
  },
  pitfalls: {
    fi: `**NULL** on yleisin hiljainen virhe. §WHERE credits = NULL§ on tuntematon, ei tosi, joten riviä ei tule. Oikea muoto on §IS NULL§. Sama koskee §<>§-vertailua: tyhjä ei ole eri suuri tavallisessa mielessä, vaan tuntematon.

Toinen virhe on WHERE ja HAVING väärinpäin. WHERE ei näe koostetta §COUNT(*)§. HAVING ei ole paikka rivin suodatukselle, joka voidaan tehdä aiemmin. Kolmas on JOIN ilman ON-ehtoa tai väärällä sarakkeella, jolloin jokainen pariutuu jokaisen kanssa.

>> Aja uusi UPDATE ensin SELECT-muodossa. Lue rivimäärä. Vasta sitten kirjoita muutos. Yksi puuttuva WHERE tyhjentää taulun.`,
    en: `**NULL** is the most common silent mistake. §WHERE credits = NULL§ is unknown, not true, so no row comes back. The right form is §IS NULL§. The same goes for §<>§: an empty value is not "different" in the ordinary sense. It is unknown.

The second mistake is WHERE and HAVING swapped. WHERE cannot see the aggregate §COUNT(*)§. HAVING is not the place for a row filter that can be done earlier. The third is a JOIN without an ON condition, or on the wrong column, so every row pairs with every row.

>> Run a new UPDATE first as a SELECT. Read the row count. Only then write the change. One missing WHERE empties the table.`,
  },
  alias: {
    fi: `**Alias** on lyhyt nimi tälle kyselylle. §students AS s§ antaa taululle nimen s. §name AS student_name§ antaa sarakkeelle otsikon. Alias ei elä seuraavassa kyselyssä eikä muuta taulun oikeaa nimeä.

Taulun alias tarvitaan, kun liität useita tauluja ja sama sarakenimi toistuu. Sarakkeen alias tarvitaan, kun näytät laskun tai haluat otsikon, jonka ihminen ymmärtää. WHERE ei aina näe sarakkeen aliasta. Toista lauseke, tai kääri kysely alikyselyksi.

>> Pidä aliakset lyhyinä ja vakaina: s opiskelijalle, e suoritukselle, c kurssille. Älä vaihda niitä kyselyn keskellä.`,
    en: `An **alias** is a short name for this query. §students AS s§ gives the table the name s. §name AS student_name§ gives the column a heading. An alias does not live into the next query, and it does not change the table's real name.

A table alias is needed when you join several tables and the same column name repeats. A column alias is needed when you show a calculation or you want a heading a person understands. WHERE does not always see a column alias. Repeat the expression, or wrap the query as a subquery.

>> Keep aliases short and stable: s for a student, e for a completion, c for a course. Do not rename them in the middle of the query.`,
  },
  subquery: {
    fi: `**Alikysely** on kysely toisen kyselyn sisällä. Sitä käytetään, kun tarvitset luvun, joka itse on haun tulos. §WHERE credits > (SELECT AVG(credits) FROM students)§ vertaa jokaista riviä keskiarvoon. Sulkeissa oleva kysely ajetaan, ja sen yksi arvo täyttää vertailun.

Jos alikysely palauttaa monta arvoa, vertaa §IN§-sanalla: §WHERE id IN (SELECT student_id FROM completions)§. Yksi arvo ja monen arvon lista ovat eri työkalut. Väärä työkalu antaa virheen tai tyhjän tuloksen.

>> Alikysely lukee kuin sulkulauseke matematiikassa: sisäpuoli ensin. Jos sama asia onnistuu JOINilla, JOIN on usein selkeämpi. Käytä alikyselyä, kun tarvitset yhden koonnin, et rivien paritusta.`,
    en: `A **subquery** is a query inside another query. Use it when you need a number that is itself the result of a search. §WHERE credits > (SELECT AVG(credits) FROM students)§ compares each row with the average. The query in parentheses runs, and its one value fills the comparison.

If the subquery returns many values, compare with §IN§: §WHERE id IN (SELECT student_id FROM completions)§. One value and a list of values are different tools. The wrong tool gives an error or an empty result.

>> A subquery reads like parentheses in mathematics: the inside first. If the same thing works as a JOIN, the JOIN is often clearer. Use a subquery when you need one aggregate, not a pairing of rows.`,
  },
  nulls: {
    fi: `**NULL** tarkoittaa, että arvoa ei ole. Se ei ole nolla eikä tyhjä merkkijono. Nolla opintopistettä on luku. NULL tarkoittaa, että opintopisteitä ei ole kirjattu. Lasku NULL-arvon kanssa on yleensä NULL: §1 + NULL§ ei ole 1.

§COALESCE(credits, 0)§ antaa ensimmäisen arvon, joka ei ole NULL. Sillä tyhjä voidaan näyttää nollana tulosteessa ilman, että tauluun kirjoitetaan nollaa. §COUNT(credits)§ ohittaa tyhjät. §COUNT(*)§ ei ohita.

>> Älä korvaa NULL-arvoa nollalla taulussa vain siksi, että vertailu olisi helpompi. Menetät eron *ei kirjattu* ja *kirjattu nolla*. Korvaa se vasta kyselyssä, jos näkymä sitä tarvitsee.`,
    en: `**NULL** means there is no value. It is not zero and it is not an empty string. Zero credits is a number. NULL means the credits were not recorded. Arithmetic with NULL is usually NULL: §1 + NULL§ is not 1.

§COALESCE(credits, 0)§ gives the first value that is not NULL. It can show an empty as zero in the result without writing a zero into the table. §COUNT(credits)§ skips empties. §COUNT(*)§ does not.

>> Do not replace NULL with zero in the table just so the comparison would be easier. You lose the difference between *not recorded* and *recorded as zero*. Replace it only in the query, if the view needs it.`,
  },
  index: {
    fi: `**Indeksi** on hakemisto, joka nopeuttaa ehdon tai järjestyksen. §CREATE INDEX idx_credits ON students(credits)§ auttaa kyselyä §WHERE credits >= 100§ ja järjestystä saman sarakkeen mukaan. Se ei muuta tulosta. Se muuttaa sitä, miten tietokanta etsii.

Jokainen INSERT ja UPDATE joutuu päivittämään indeksin. Indeksi joka sarakkeelle hidastaa kirjoitusta, eikä kaikkia kyselyitä auta. Tee indeksi sarakkeelle, jolla oikeasti haet tai liität: avain, vierasavain ja usein rajattu sarake.

>> PRIMARY KEY on jo indeksi. Sitä ei tarvitse luoda uudestaan. Katso suunnitelma, jos kysely on hidas. [[Iso taulu|complexity]] ei ole hidas vain rivimäärän vuoksi, vaan koska hakuehto ei osu indeksiin.`,
    en: `An **index** is a lookup structure that speeds up a condition or an order. §CREATE INDEX idx_credits ON students(credits)§ helps the query §WHERE credits >= 100§ and an order by that same column. It does not change the result. It changes how the database searches.

Every INSERT and UPDATE has to update the index. An index on every column slows writing, and it does not help every query. Make an index on a column you actually search or join: a key, a foreign key and a column you often filter.

>> A PRIMARY KEY is already an index. You do not create it again. Look at the plan when a query is slow. A [[large table|complexity]] is not slow only because of the row count, but because the condition does not hit an index.`,
  },
};
