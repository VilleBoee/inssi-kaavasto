import type { Copy } from "./types";

/** Code spans use §like this§ so the file can stay a template literal. */
export const JS_THEORY: Record<string, Copy> = {
  hello: {
    fi: `JavaScript-ohjelma on jono **lauseita**. Jokainen lause tekee yhden asian: laskee, sijoittaa tai tulostaa. [[console.log]] on ohjelman ääni kehityksen aikana. Se ei muuta arvoja, se vain näyttää ne.

Selain ajaa koodin sivun sisällä, [[Node.js]] ajaa saman kielen tiedostosta. Molemmissa §console.log§ kirjoittaa konsoliin. Puolipiste rivin lopussa on vapaaehtoinen, mutta rivinvaihto päättää lauseen. Älä jaa yhtä lausetta kahdelle riville kesken laskutoimituksen.

>> Esimerkki tulostaa ensin tekstin *Hei* ja sitten lausekkeen §2 + 3§ tuloksen. Lainausmerkit tekevät tekstistä merkkijonon. Ilman niitä Hei olisi nimi, jota ei ole olemassa.`,
    en: `A JavaScript program is a sequence of **statements**. Each statement does one thing: it computes, assigns or prints. [[console.log]] is the program's voice while you are learning. It does not change values, it only shows them.

The browser runs the code inside a page, [[Node.js]] runs the same language from a file. In both, §console.log§ writes to the console. A semicolon at the end of a line is optional, but a line break ends the statement. Do not split one statement across two lines in the middle of a calculation.

>> The sample first prints the text *Hei* and then the result of the expression §2 + 3§. Quotes turn text into a string. Without them Hei would be a name that does not exist.`,
  },
  variables: {
    fi: `**Muuttuja** on nimi, joka osoittaa arvoon. §let§ luo nimen, jonka saa myöhemmin osoittaa toiseen arvoon. §const§ luo nimen, jota ei saa siirtää. Itse arvo, esimerkiksi taulukon sisältö, voi silti muuttua.

Sijoitus §count = count + 1§ ei ole vertailu. Oikea puoli lasketaan ensin, ja tulos kirjoitetaan vasemmalle nimelle. Nimet alkavat kirjaimella. [[camelCase]] on tavallinen: §examCount§, ei alaviivaa eikä isoa alkukirjainta.

>> Älä käytä sanaa §var§ uudessa koodissa. Se ei noudata lohkon rajaa, joten silmukan laskuri vuotaa ulos. §let§ ja §const§ elävät siinä aaltosulkeiden välissä, jossa ne luotiin.`,
    en: `A **variable** is a name that points at a value. §let§ creates a name you may later point at another value. §const§ creates a name you must not move. The value itself, for example the contents of an array, may still change.

The assignment §count = count + 1§ is not a comparison. The right side is computed first, and the result is written to the name on the left. Names start with a letter. [[camelCase]] is usual: §examCount§, not an underscore and not a capital first letter.

>> Do not use the word §var§ in new code. It ignores block boundaries, so a loop counter leaks out. §let§ and §const§ live between the braces where they were created.`,
  },
  types: {
    fi: `JavaScript on **dynaamisesti tyypitetty**. Nimeen ei kirjoiteta tyyppiä etukäteen. [[typeof]] kertoo, millainen arvo nimessä on juuri nyt. Samalle nimelle voi myöhemmin sijoittaa toisen tyypin, mutta se tekee koodista vaikean lukea.

Tavalliset tyypit ovat §number§, §string§ ja §boolean§. Luku on aina liukuluku, myös §42§. §Number("12")§ muuttaa tekstin luvuksi. §Number("12a")§ epäonnistuu ja tuottaa [[NaN]]-arvon. §NaN === NaN§ on epätosi, joten tarkistus on §Number.isNaN(x)§.

>> §null§ on tietoinen tyhjä arvo. §undefined§ tarkoittaa, että arvoa ei ole annettu. §typeof null§ palauttaa tekstin object. Se on vanha kielen virhe, ei null-arvon oikea tyyppi.`,
    en: `JavaScript is **dynamically typed**. You do not write a type in front of a name. [[typeof]] tells you what kind of value the name holds right now. You can later assign another type to the same name, but that makes the code hard to read.

The ordinary types are §number§, §string§ and §boolean§. A number is always floating-point, even §42§. §Number("12")§ turns text into a number. §Number("12a")§ fails and produces [[NaN]]. §NaN === NaN§ is false, so the check is §Number.isNaN(x)§.

>> §null§ is a deliberate empty value. §undefined§ means no value was given. §typeof null§ returns the text object. That is an old language bug, not the real type of null.`,
  },
  strings: {
    fi: `**Merkkijono** on teksti. Se kirjoitetaan lainausmerkeillä tai [[mallimerkkijonolla]], jonka rajat ovat backtick-merkit. Vain mallimerkkijono upottaa lausekkeita aaltosulkeisiin dollarimerkin kanssa.

Merkkijonoa ei muuteta paikallaan. §toUpperCase§ ja §slice§ palauttavat *uuden* tekstin ja jättävät vanhan ennalleen. Indeksi alkaa nollasta. §slice(0, 5)§ ottaa merkit paikoista 0, 1, 2, 3 ja 4. Loppupaikka ei kuulu mukaan.

>> §length§ on merkkien määrä, ei viimeinen indeksi. Viimeinen merkki on paikassa §length - 1§. Kenoviiva aloittaa erikoismerkin: rivinvaihto tekstin sisällä kirjoitetaan kenoviivalla ja n-kirjaimella.`,
    en: `A **string** is text. It is written with quotes or as a [[template string]], delimited by backticks. Only a template string embeds expressions in braces after a dollar sign.

A string is not edited in place. §toUpperCase§ and §slice§ return a *new* text and leave the old one alone. Indexes start at zero. §slice(0, 5)§ takes the characters at 0, 1, 2, 3 and 4. The end index is not included.

>> §length§ is the number of characters, not the last index. The last character is at §length - 1§. A backslash starts an escape: a newline inside text is written with a backslash and the letter n.`,
  },
  if: {
    fi: `**Ehto** valitsee, mikä lohko ajetaan. §if§ testaa ensimmäisenä. §else if§ testaa vain, jos edelliset olivat epätosia. §else§ ottaa kaiken jäljelle jäävän, eikä sillä ole omaa testiä.

Vertailu on §===§. Se vaatii saman arvon *ja* saman tyypin. §==§ yrittää muuntaa tyypit ensin, joten luku 1 ja teksti "1" näyttävät yhtä suurilta. Yksi =-merkki sijoittaa. Sitä ei käytetä ehdossa.

>> Osa arvoista on [[epätosia]]: §0§, tyhjä teksti, §null§, §undefined§ ja §NaN§. Kaikki muut arvot ovat tosia, myös teksti "0" ja tyhjä taulukko. Jos haluat testata lukua, kirjoita vertailu näkyviin.`,
    en: `A **condition** chooses which block runs. §if§ tests first. §else if§ tests only when the earlier tests were false. §else§ takes whatever remains, and it has no test of its own.

Comparison is §===§. It demands the same value *and* the same type. §==§ tries to convert types first, so the number 1 and the text "1" look equal. A single equals sign assigns. It does not belong in a condition.

>> Some values are [[falsy]]: §0§, an empty text, §null§, §undefined§ and §NaN§. Every other value is truthy, including the text "0" and an empty array. If you mean to test a number, write the comparison out.`,
  },
  loops: {
    fi: `**Silmukka** toistaa lohkon. §for§ sopii, kun kierrosten määrä tai indeksi on tiedossa. §for...of§ käy listan arvot ilman indeksiä. §while§ toistaa niin kauan kuin ehto pysyy totena.

Indeksi alkaa nollasta. Ehto §i < length§ on oikea. §i <= length§ menee yhden yli ja lukee paikan, jota ei ole. Jokaisella kierroksella jonkin pitää muuttua, muuten silmukka ei pääty.

>> §break§ poistuu koko silmukasta. §continue§ ohittaa vain tämän kierroksen lopun ja siirtyy seuraavaan. Älä muuta listan pituutta kesken §for...of§-kierrosta.`,
    en: `A **loop** repeats a block. §for§ fits when you know the number of rounds or you need the index. §for...of§ walks the values of a list without an index. §while§ repeats as long as the condition stays true.

The index starts at zero. The test §i < length§ is right. §i <= length§ goes one past the end and reads a place that does not exist. Something must change on every round, or the loop never ends.

>> §break§ leaves the whole loop. §continue§ skips only the rest of this round and moves to the next. Do not change a list's length in the middle of §for...of§.`,
  },
  functions: {
    fi: `**Funktio** nimeää laskennan, jotta sitä voi kutsua uudestaan. Parametrit ovat paikallisia nimiä: kutsujan muuttuja ei vaihdu, ellei funktio palauta uutta arvoa ja kutsuja sijoita sitä.

§return§ lähettää arvon takaisin ja lopettaa funktion heti. Ilman sitä funktio palauttaa §undefined§. [[Nuolifunktio]] §(n) => n * 2§ on lyhyt muoto, kun runko on yksi lauseke. Tähti on kertolasku, ei osoitin.

>> Funktio kannattaa pitää lyhyenä: yksi tehtävä, selkeä nimi. Jos nimi on §area§, sen pitää palauttaa pinta-ala eikä tulostaa sitä sivuvaikutuksena.`,
    en: `A **function** names a computation so you can call it again. Parameters are local names: the caller's variable does not change unless the function returns a new value and the caller assigns it.

§return§ sends a value back and ends the function at once. Without it the function returns §undefined§. An [[arrow function]] §(n) => n * 2§ is the short form when the body is one expression. The star is multiplication, not a pointer.

>> Keep a function short: one job, a clear name. If the name is §area§, it should return the area and not print it as a side effect.`,
  },
  arrays: {
    fi: `**Taulukko** on järjestetty lista. Ensimmäinen alkio on indeksissä §0§. §length§ on alkioiden määrä. §push§ lisää loppuun ja *muuttaa* taulukkoa.

§map§, §filter§ ja §reduce§ eivät muuta alkuperäistä. Ne rakentavat uuden arvon. §filter§ pitää alkiot, joille testi on tosi. §map§ tekee jokaisesta alkiosta uuden. Vanha lista säilyy, jos haluat verrata tulosta siihen.

>> Kaksi nimeä voi osoittaa samaan taulukkoon. Sijoitus §const copy = scores§ ei kopioi. Oikea matala kopio on §scores.slice()§. Muutos copy-nimen kautta näkyy myös scores-nimessä, jos ne ovat sama taulukko.`,
    en: `An **array** is an ordered list. The first item is at index §0§. §length§ is the number of items. §push§ appends and *changes* the array.

§map§, §filter§ and §reduce§ do not change the original. They build a new value. §filter§ keeps the items for which the test is true. §map§ makes a new item from each one. The old list stays, if you want to compare the result with it.

>> Two names can point at the same array. The assignment §const copy = scores§ does not copy. A real shallow copy is §scores.slice()§. A change through the name copy also shows up on scores when they are the same array.`,
  },
  objects: {
    fi: `**Olio** kokoaa nimetyt kentät. Kenttä luetaan pisteellä §student.name§ tai hakasuluilla §student["credits"]§. Hakasulut tarvitaan, kun avain on muuttujassa tai siinä on merkki, joka ei kelpaa pisteen jälkeen.

Puuttuva kenttä ei kaada ohjelmaa. Se on §undefined§. Sijoitus §student.credits = 60§ muuttaa oliota. §const§ estää vain sen, että nimi student osoitetaan *toiseen* olioon. Kenttiä saa silti muuttaa.

>> Sijoitus §const other = student§ ei kopioi. Molemmat nimet ovat sama olio. Kenttien pintakopio tehdään levittämällä olio uuteen aaltosulkeiden pariin. Sisäkkäiset oliot jäävät silti jaetuiksi.`,
    en: `An **object** groups named fields. A field is read with a dot §student.name§ or with brackets §student["credits"]§. Brackets are required when the key is in a variable or contains a character that is illegal after a dot.

A missing field does not crash the program. It is §undefined§. The assignment §student.credits = 60§ changes the object. §const§ only stops the name student from being pointed at *another* object. You may still change the fields.

>> The assignment §const other = student§ does not copy. Both names are the same object. A shallow copy of the fields spreads the object into a new pair of braces. Nested objects are still shared.`,
  },
  json: {
    fi: `[[JSON]] on tekstiformaatti, ei JavaScript-olio. Rajapinnat lähettävät tekstiä, koska verkko ei siirrä eläviä olioita. §JSON.stringify§ tekee oliosta tekstin. §JSON.parse§ tekee tekstistä olion.

JSON vaatii **kaksoislainausmerkit** avaimissa ja merkkijonoissa. Yksinkertainen lainausmerkki, kommentti ja pilkku viimeisen kentän jälkeen ovat virheitä. §undefined§ ja funktiot katoavat stringify-kutsussa.

>> §parse§ heittää poikkeuksen, jos teksti on rikki. Käytä sitä §try/catch§-lohkossa, kun teksti tulee käyttäjältä tai verkosta. Oma koodisi voi luottaa stringify-tulokseen, koska se on aina kelvollista JSONia.`,
    en: `[[JSON]] is a text format, not a JavaScript object. APIs send text, because the network does not move live objects. §JSON.stringify§ turns an object into text. §JSON.parse§ turns text into an object.

JSON requires **double quotes** around keys and strings. A single quote, a comment and a comma after the last field are errors. §undefined§ and functions disappear in a stringify call.

>> §parse§ throws if the text is broken. Use it inside §try/catch§ when the text comes from a user or the network. Your own code can trust the result of stringify, because it is always valid JSON.`,
  },
  async: {
    fi: `Hidas työ ei pysäytä koko sivua. Se palauttaa [[Promisen]], joka valmistuu myöhemmin. §await§ odottaa sen tuloksen, mutta vain §async§-funktion sisällä tai moduulin ylimmällä tasolla. Tässä näkymässä await toimii ylimmällä tasolla, koska ajuri käärii koodin.

Ilman await-sanaa näet Promisen, et lukua. Virhe napataan §try/catch§-lohkolla samoin kuin tavallinen poikkeus. §Promise.resolve(55)§ on valmis promise, jolla asynkronisuutta voi harjoitella ilman verkkoa.

>> Oikea §fetch§ käynnistää verkkopyynnön. Tämä ajuri ei päästä verkkoon, joten esimerkki käyttää valmista promisea. Selaimessa await kuuluu async-funktion sisään, ellei tiedosto ole moduuli.`,
    en: `Slow work does not freeze the whole page. It returns a [[Promise]] that finishes later. §await§ waits for its result, but only inside an §async§ function or at the top level of a module. In this view await works at the top level, because the runner wraps the code.

Without the word await you see a Promise, not a number. A failure is caught with §try/catch§, the same way as an ordinary exception. §Promise.resolve(55)§ is an already finished promise, so you can practise asynchrony without a network.

>> A real §fetch§ starts a network request. This runner has no network, so the sample uses a finished promise. In the browser await belongs inside an async function, unless the file is a module.`,
  },
  pitfalls: {
    fi: `Yksi yhtäsuuruusmerkki **sijoittaa**. Ehdossa §if (mode = "admin")§ kirjoittaa muuttujaan tekstin, ja ehto on tosi, koska epätyhjä merkkijono on tosi. Vertailu on §===§.

§const items = ["a"]§ estää sijoituksen, joka vaihtaisi koko taulukon. Se ei estä §items.push("b")§. Vakio on nimi, ei pakastettu sisältö. Jos sisällön pitää pysyä, älä kutsu muuttavaa metodia.

>> §for (var i = 0; ...)§ jakaa yhden i-muuttujan kaikille kierroksille. Myöhemmin luettu i on silmukan loppuarvo. Kirjoita §let§, niin jokaisella kierroksella on oma indeksi.`,
    en: `A single equals sign **assigns**. In the condition §if (mode = "admin")§ the text is written into the variable, and the condition is true because a non-empty string is truthy. Comparison is §===§.

§const items = ["a"]§ forbids an assignment that would replace the whole array. It does not forbid §items.push("b")§. A constant is a name, not a frozen content. If the content must stay, do not call a method that changes it.

>> §for (var i = 0; ...)§ shares one i variable across every round. An i read later is the loop's final value. Write §let§, and each round has its own index.`,
  },
};
