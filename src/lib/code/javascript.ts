import type { Language } from "./types";
import { JS_THEORY } from "./js-theory";

const javascriptLessons: Language = {
  id: "js",
  name: "JavaScript",
  short: "JS",
  runnable: true,
  blurb: {
    fi: "Selaimen ja Node.js:n kieli. Esimerkit tulostavat konsoliin, ja niitä voi ajaa tästä näkymästä.",
    en: "The language of the browser and Node.js. Samples print to the console, and you can run them here.",
  },
  run: {
    fi: "Selain: F12 → Console. Node: tallenna tiedostoksi ja aja node tiedosto.js.",
    en: "Browser: F12 → Console. Node: save the file and run node file.js.",
  },
  lessons: [
    {
      id: "hello",
      topic: "perusteet",
      title: { fi: "Hei ja konsoli", en: "Hello and the console" },
      blurb: {
        fi: "Ohjelma on lista lauseita. console.log tulostaa arvon. Puolipiste on vapaaehtoinen, mutta rivin loppu päättää lauseen.",
        en: "A program is a list of statements. console.log prints a value. Semicolons are optional, but the end of a line ends the statement.",
      },
      points: [
        { fi: "Merkkijono kirjoitetaan lainausmerkkeihin.", en: "A string is written in quotes." },
        { fi: "Jokainen console.log on oma rivinsä tulosteessa.", en: "Each console.log is its own line of output." },
      ],
      file: "hello.js",
      code: `console.log("Hei");
console.log(2 + 3);`,
      output: `Hei
5`,
      tags: ["hello", "console", "log", "tulostus", "print"],
    },
    {
      id: "variables",
      topic: "perusteet",
      title: { fi: "Muuttujat", en: "Variables" },
      blurb: {
        fi: "let on arvo, jonka saa vaihtaa. const on nimi, jota ei saa osoittaa uuteen arvoon. Älä käytä var-sanaa uudessa koodissa.",
        en: "let is a value you may change. const is a name you must not point at a new value. Do not use var in new code.",
      },
      points: [
        { fi: "Nimet alkavat kirjaimella. camelCase on tavallinen: examCount.", en: "Names start with a letter. camelCase is usual: examCount." },
        { fi: "const ei estä olion kenttien muuttamista, vain uudelleensijoituksen.", en: "const does not freeze object fields, only reassignment." },
      ],
      file: "variables.js",
      code: `let count = 3;
count = count + 1;

const name = "Ada";
console.log(count);
console.log(name);`,
      output: `4
Ada`,
      note: {
        fi: "const name = \"Ada\"; name = \"Bob\"; kaatuu: Assignment to constant variable.",
        en: "const name = \"Ada\"; name = \"Bob\"; throws: Assignment to constant variable.",
      },
      tags: ["let", "const", "var", "muuttuja", "variable"],
    },
    {
      id: "types",
      topic: "perusteet",
      title: { fi: "Tyypit", en: "Types" },
      blurb: {
        fi: "JavaScript on dynaamisesti tyypitetty. typeof kertoo arvon tyypin ajon aikana. Number on aina liukuluku.",
        en: "JavaScript is dynamically typed. typeof reports a value's type at runtime. Number is always a floating-point value.",
      },
      points: [
        { fi: "typeof null on \"object\". Se on vanha kielen virhe, ei null-arvon tyyppi.", en: "typeof null is \"object\". That is an old language bug, not the type of null." },
        { fi: "NaN tarkoittaa epäonnistunutta lukulaskua. NaN === NaN on false.", en: "NaN means a failed numeric operation. NaN === NaN is false." },
      ],
      file: "types.js",
      code: `console.log(typeof 42);
console.log(typeof "42");
console.log(typeof true);
console.log(Number("12"));
console.log(Number("12a"));`,
      output: `number
string
boolean
12
NaN`,
      note: {
        fi: "NaN === NaN on false. Tarkistus on Number.isNaN(x).",
        en: "NaN === NaN is false. The check is Number.isNaN(x).",
      },
      tags: ["typeof", "number", "string", "boolean", "nan", "tyyppi", "type"],
    },
    {
      id: "strings",
      topic: "perusteet",
      title: { fi: "Merkkijonot", en: "Strings" },
      blurb: {
        fi: "Mallimerkkijono (backtick) upottaa lausekkeita ${}. Tavallinen + liittää osat. length on merkkien määrä.",
        en: "A template string (backticks) embeds expressions with ${}. Plain + joins parts. length is the number of characters.",
      },
      points: [
        { fi: "slice(alku, loppu) ei sisällä loppuindeksiä.", en: "slice(start, end) does not include the end index." },
        { fi: "Merkkijonoa ei muuteta paikallaan. Metodit palauttavat uuden.", en: "Strings are not edited in place. Methods return a new one." },
      ],
      file: "strings.js",
      code: `const course = "ohjelmointi";
const points = 5;
console.log(\`\${course}: \${points} op\`);
console.log(course.slice(0, 5));
console.log(course.toUpperCase());`,
      output: `ohjelmointi: 5 op
ohjel
OHJELMOINTI`,
      tags: ["string", "template", "slice", "merkkijono"],
    },
    {
      id: "if",
      topic: "ohjaus",
      title: { fi: "Ehto", en: "Conditionals" },
      blurb: {
        fi: "if ajaa lohkon vain, kun ehto on tosi. === vertaa arvoa ja tyyppiä. == yrittää muuntaa tyypit ja yllättää.",
        en: "if runs a block only when the condition is true. === compares value and type. == converts types and surprises you.",
      },
      points: [
        { fi: "0, \"\", null, undefined ja NaN ovat epätosia.", en: "0, \"\", null, undefined and NaN are falsy." },
        { fi: "Käytä ===, ellei sinulla ole syytä muuntaa tyyppejä.", en: "Use === unless you have a reason to convert types." },
      ],
      file: "if.js",
      code: `const score = 12;
if (score >= 15) {
  console.log("hyvaksytty");
} else if (score >= 10) {
  console.log("täydennettävä");
} else {
  console.log("hylätty");
}
console.log(1 == "1");
console.log(1 === "1");`,
      output: `täydennettävä
true
false`,
      tags: ["if", "else", "===", "ehto", "condition", "vertailu"],
    },
    {
      id: "loops",
      topic: "ohjaus",
      title: { fi: "Silmukat", en: "Loops" },
      blurb: {
        fi: "for toistaa laskurin avulla. for...of käy listan arvot. while toistaa niin kauan kuin ehto pysyy totena.",
        en: "for repeats with a counter. for...of walks the values of a list. while repeats while the condition stays true.",
      },
      points: [
        { fi: "Indeksi alkaa nollasta ja ehto on i < length, ei <=.", en: "The index starts at zero and the test is i < length, not <=." },
        { fi: "break poistuu silmukasta. continue siirtyy seuraavaan kierrokseen.", en: "break leaves the loop. continue skips to the next round." },
      ],
      file: "loops.js",
      code: `const names = ["Aino", "Leevi"];
for (const name of names) {
  console.log(name);
}
let n = 3;
while (n > 0) {
  console.log(n);
  n = n - 1;
}`,
      output: `Aino
Leevi
3
2
1`,
      tags: ["for", "while", "silmukka", "loop", "break"],
    },
    {
      id: "functions",
      topic: "ohjaus",
      title: { fi: "Funktiot", en: "Functions" },
      blurb: {
        fi: "Funktio on nimetty laskenta. return palauttaa arvon ja lopettaa funktion. Nuolifunktio on lyhyt sama asia.",
        en: "A function is a named computation. return sends a value back and stops the function. An arrow function is a short form of the same idea.",
      },
      points: [
        { fi: "Parametrit ovat paikallisia. Ulkopuolinen muuttuja ei vaihdu, ellei sitä sijoiteta.", en: "Parameters are local. An outer variable does not change unless you assign it." },
        { fi: "Ilman return-arvoa funktio palauttaa undefined.", en: "Without a return value the function returns undefined." },
      ],
      file: "functions.js",
      code: `function area(width, height) {
  return width * height;
}

const double = (n) => n * 2;

console.log(area(3, 4));
console.log(double(5));`,
      output: `12
10`,
      tags: ["function", "return", "arrow", "nuolifunktio", "funktio"],
    },
    {
      id: "arrays",
      topic: "tieto",
      title: { fi: "Taulukot", en: "Arrays" },
      blurb: {
        fi: "Taulukko on järjestetty lista. map tekee uuden listan, filter valitsee, reduce kokoaa yhden arvon. Ne eivät muuta alkuperäistä.",
        en: "An array is an ordered list. map builds a new list, filter keeps some items, reduce folds them into one value. They do not change the original.",
      },
      points: [
        { fi: "push lisää loppuun ja muuttaa taulukkoa.", en: "push appends and does change the array." },
        { fi: "Indeksi 0 on ensimmäinen alkio.", en: "Index 0 is the first item." },
      ],
      file: "arrays.js",
      code: `const scores = [4, 8, 15, 16];
const passed = scores.filter((n) => n >= 10);
const doubled = scores.map((n) => n * 2);
console.log(passed);
console.log(doubled);
console.log(scores.length);`,
      output: `[15,16]
[8,16,30,32]
4`,
      tags: ["array", "map", "filter", "taulukko", "lista", "list"],
    },
    {
      id: "objects",
      topic: "tieto",
      title: { fi: "Oliot", en: "Objects" },
      blurb: {
        fi: "Olion kentät haetaan pisteellä tai hakasuluilla. Kentän puuttuminen antaa undefined, ei virhettä.",
        en: "Object fields are read with a dot or brackets. A missing field gives undefined, not an error.",
      },
      points: [
        { fi: "Avain on merkkijono, vaikka sen kirjoittaa ilman lainausmerkkejä.", en: "A key is a string, even when you write it without quotes." },
        { fi: "Sama olio voi olla monessa muuttujassa. Kopio ei synny sijoituksella.", en: "The same object can sit in several variables. Assignment does not copy it." },
      ],
      file: "objects.js",
      code: `const student = { name: "Aino", credits: 55 };
student.credits = student.credits + 5;
console.log(student.name);
console.log(student["credits"]);
console.log(student.email);`,
      output: `Aino
60
undefined`,
      tags: ["object", "olio", "property", "kenttä", "key"],
    },
    {
      id: "json",
      topic: "tieto",
      title: { fi: "JSON", en: "JSON" },
      blurb: {
        fi: "JSON on tekstiformaatti, jolla data liikkuu rajapinnoissa. JSON.stringify tekee tekstin, JSON.parse lukee sen takaisin.",
        en: "JSON is the text format APIs use to move data. JSON.stringify makes text, JSON.parse reads it back.",
      },
      points: [
        { fi: "JSON ei tunne funktioita, undefined-arvoja eikä kommentteja.", en: "JSON has no functions, undefined values or comments." },
        { fi: "Avaimet ovat lainausmerkeissä. Yksinkertainen lainausmerkki ei kelpaa.", en: "Keys are in double quotes. A single quote is not allowed." },
      ],
      file: "json.js",
      code: `const student = { name: "Aino", credits: 55 };
const text = JSON.stringify(student);
const again = JSON.parse(text);
console.log(text);
console.log(again.credits);`,
      output: `{"name":"Aino","credits":55}
55`,
      tags: ["json", "parse", "stringify", "api"],
    },
    {
      id: "async",
      topic: "rakenne",
      title: { fi: "Async ja await", en: "Async and await" },
      blurb: {
        fi: "Hidas työ, kuten verkkopyyntö, palauttaa Promisen. await odottaa sen sisällä async-funktiossa. Ilman awaitia näet Promisen, et tulosta.",
        en: "Slow work, such as a network call, returns a Promise. await waits for it inside an async function. Without await you see a Promise, not the result.",
      },
      points: [
        { fi: "await kelpaa vain async-funktion sisällä.", en: "await is only valid inside an async function." },
        { fi: "Virhe napataan try/catch-lohkolla, kuten synkroninen poikkeus.", en: "A failure is caught with try/catch, like a synchronous exception." },
      ],
      file: "async.js",
      code: `function loadCredits() {
  return Promise.resolve(55);
}

const credits = await loadCredits();
console.log(credits);`,
      output: `55`,
      note: {
        fi: "Tässä näkymässä await toimii ylimmällä tasolla. Tavallisessa skriptissä se pitää laittaa async-funktion sisään. Moduulissa ylimmän tason await kelpaa.",
        en: "In this view, await works at the top level. In a classic script it has to sit inside an async function. A module allows top-level await.",
      },
      tags: ["async", "await", "promise", "fetch"],
    },
    {
      id: "pitfalls",
      topic: "rakenne",
      title: { fi: "Yleiset virheet", en: "Common mistakes" },
      blurb: {
        fi: "Kolme virhettä, jotka näyttävät toimivilta mutta tuottavat väärän tuloksen.",
        en: "Three mistakes that look like they work but produce the wrong result.",
      },
      points: [
        { fi: "Yksi = sijoittaa. Vertailu on ===.", en: "A single = assigns. Comparison is ===." },
        { fi: "const-taulukon sisältöä voi muuttaa. Itse taulukkoa ei saa vaihtaa.", en: "You may change the contents of a const array. You may not replace the array itself." },
        { fi: "for-silmukan var-muuttuja on yhteinen. Käytä let.", en: "A var in a for loop is shared. Use let." },
      ],
      file: "pitfalls.js",
      code: `let mode = "read";
if (mode = "admin") {
  console.log("sijoitus on aina tosi");
}

const items = ["a"];
items.push("b");
console.log(items);`,
      output: `sijoitus on aina tosi
["a","b"]`,
      tags: ["bug", "virhe", "mistake", "=", "const"],
    },
  ],
};

export const javascript: Language = {
  ...javascriptLessons,
  lessons: javascriptLessons.lessons.map((lesson) => ({
    ...lesson,
    theory: JS_THEORY[lesson.id],
  })),
};
