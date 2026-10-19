import type { Language } from "./types";

export const python: Language = {
  id: "python",
  name: "Python",
  short: "PY",
  runnable: false,
  blurb: {
    fi: "Sisennys on lohkon raja, ei aaltosulkeet. Esimerkit on kirjoitettu Python 3:lle.",
    en: "Indentation marks a block, not braces. Samples are written for Python 3.",
  },
  run: {
    fi: "Tallenna tiedosto ja aja: python3 tiedosto.py",
    en: "Save the file and run: python3 file.py",
  },
  lessons: [
    {
      id: "hello",
      topic: "perusteet",
      title: { fi: "Hei ja print", en: "Hello and print" },
      blurb: {
        fi: "print kirjoittaa rivin. Rivin alun välilyönnit merkitsevät: väärä sisennys on SyntaxError.",
        en: "print writes a line. Leading spaces matter: a bad indent is a SyntaxError.",
      },
      points: [
        { fi: "Kommentti alkaa risuaidalla #.", en: "A comment starts with #." },
        { fi: "Python 3: print on funktio, joten sulut kuuluvat asiaan.", en: "In Python 3 print is a function, so the parentheses belong there." },
      ],
      file: "hello.py",
      code: `print("Hei")
print(2 + 3)`,
      output: `Hei
5`,
      tags: ["print", "hello", "sisennys", "indent"],
    },
    {
      id: "variables",
      topic: "perusteet",
      title: { fi: "Muuttujat ja tyypit", en: "Variables and types" },
      blurb: {
        fi: "Muuttujaa ei määritellä tyypillä. Nimi osoittaa arvoon. type() kertoo, mihin se osoittaa nyt.",
        en: "A variable is not declared with a type. A name points at a value. type() tells you what it points at now.",
      },
      points: [
        { fi: "int on kokonaisluku, float liukuluku, str teksti, bool totuusarvo.", en: "int is an integer, float a decimal, str text, bool a truth value." },
        { fi: "Sama nimi voidaan myöhemmin osoittaa toisen tyyppiseen arvoon.", en: "The same name can later point at a value of another type." },
      ],
      file: "variables.py",
      code: `credits = 55
name = "Aino"
passed = credits >= 30
print(type(credits).__name__)
print(passed)`,
      output: `int
True`,
      tags: ["variable", "int", "float", "str", "type", "muuttuja"],
    },
    {
      id: "strings",
      topic: "perusteet",
      title: { fi: "Merkkijonot", en: "Strings" },
      blurb: {
        fi: "f-merkkijono upottaa lausekkeita aaltosulkeisiin. Tekstiä ei muuteta paikallaan.",
        en: "An f-string embeds expressions in braces. Text is not changed in place.",
      },
      points: [
        { fi: "Len kertoo merkkien määrän. Indeksi alkaa nollasta.", en: "len is the number of characters. Indexes start at zero." },
        { fi: "Viipale [alku:loppu] ei sisällä loppuindeksiä.", en: "A slice [start:end] does not include the end index." },
      ],
      file: "strings.py",
      code: `course = "ohjelmointi"
points = 5
print(f"{course}: {points} op")
print(course[:5])
print(course.upper())`,
      output: `ohjelmointi: 5 op
ohjel
OHJELMOINTI`,
      tags: ["f-string", "slice", "merkkijono", "string"],
    },
    {
      id: "if",
      topic: "ohjaus",
      title: { fi: "Ehto", en: "Conditionals" },
      blurb: {
        fi: "if, elif ja else. Ehdon perään tulee kaksoispiste, ja lohko sisennetään neljällä välilyönnillä.",
        en: "if, elif and else. The condition ends with a colon, and the block is indented four spaces.",
      },
      points: [
        { fi: "Vertailu on ==. Yksi = on sijoitus, eikä se kelpaa ehdoksi.", en: "Comparison is ==. A single = is assignment and is not valid as a condition." },
        { fi: "and, or ja not kirjoitetaan sanoina.", en: "and, or and not are written as words." },
      ],
      file: "if.py",
      code: `score = 12
if score >= 15:
    print("hyvaksytty")
elif score >= 10:
    print("taydennettava")
else:
    print("hylatty")`,
      output: `taydennettava`,
      tags: ["if", "elif", "else", "ehto"],
    },
    {
      id: "loops",
      topic: "ohjaus",
      title: { fi: "Silmukat", en: "Loops" },
      blurb: {
        fi: "for käy jonon alkiot. range(n) antaa luvut 0…n-1. while toistaa ehdon voimassa ollessa.",
        en: "for walks the items of a sequence. range(n) yields the numbers 0…n-1. while repeats while the condition holds.",
      },
      points: [
        { fi: "range(1, 4) on 1, 2, 3. Loppua ei oteta mukaan.", en: "range(1, 4) is 1, 2, 3. The end is excluded." },
        { fi: "break ja continue toimivat kuten muissakin kielissä.", en: "break and continue work as in other languages." },
      ],
      file: "loops.py",
      code: `for name in ["Aino", "Leevi"]:
    print(name)

n = 3
while n > 0:
    print(n)
    n -= 1`,
      output: `Aino
Leevi
3
2
1`,
      tags: ["for", "while", "range", "silmukka", "loop"],
    },
    {
      id: "functions",
      topic: "ohjaus",
      title: { fi: "Funktiot", en: "Functions" },
      blurb: {
        fi: "def aloittaa funktion. return palauttaa arvon. Ilman returnia funktio palauttaa None.",
        en: "def starts a function. return sends a value back. Without return the function returns None.",
      },
      points: [
        { fi: "Oletusarvo lasketaan kerran, määrittelyhetkellä. Älä käytä oletuksena listaa.", en: "A default is computed once, at definition time. Do not use a list as a default." },
        { fi: "Kutsu vastaa parametrien järjestystä, ellei käytä nimiä.", en: "The call matches parameter order, unless you pass names." },
      ],
      file: "functions.py",
      code: `def area(width, height):
    return width * height

print(area(3, 4))
print(area(height=5, width=2))`,
      output: `12
10`,
      note: {
        fi: "Virheellinen oletus: def add(item, bag=[]): bag on sama lista joka kutsulla.",
        en: "The bad default: def add(item, bag=[]): bag is the same list on every call.",
      },
      tags: ["def", "return", "funktio", "function", "default"],
    },
    {
      id: "lists",
      topic: "tieto",
      title: { fi: "Listat", en: "Lists" },
      blurb: {
        fi: "Lista on muutettava jono. append lisää loppuun. Listakooste rakentaa uuden listan yhdellä lauseella.",
        en: "A list is a mutable sequence. append adds to the end. A comprehension builds a new list in one statement.",
      },
      points: [
        { fi: "Leikkaus tekee kopion: items[:]. Sijoitus items2 = items ei kopioi.", en: "A slice copies: items[:]. The assignment items2 = items does not copy." },
        { fi: "len(items) on alkioiden määrä, ei viimeinen indeksi.", en: "len(items) is the count, not the last index." },
      ],
      file: "lists.py",
      code: `scores = [4, 8, 15, 16]
passed = [n for n in scores if n >= 10]
print(passed)
print(len(scores))`,
      output: `[15, 16]
4`,
      tags: ["list", "lista", "append", "comprehension"],
    },
    {
      id: "dicts",
      topic: "tieto",
      title: { fi: "Sanakirjat", en: "Dictionaries" },
      blurb: {
        fi: "Sanakirja yhdistää avaimen arvoon. Haku puuttuvalla avaimella kaataa ohjelman. get palauttaa oletuksen.",
        en: "A dictionary maps a key to a value. Looking up a missing key crashes. get returns a default instead.",
      },
      points: [
        { fi: "Avaimen pitää olla muuttumaton, esimerkiksi merkkijono tai luku.", en: "A key must be immutable, for example a string or a number." },
        { fi: "in testaa avainta, ei arvoa.", en: "in tests for a key, not a value." },
      ],
      file: "dicts.py",
      code: `student = {"name": "Aino", "credits": 55}
student["credits"] += 5
print(student["name"])
print(student.get("email", "—"))
print("credits" in student)`,
      output: `Aino
—
True`,
      tags: ["dict", "sanakirja", "dictionary", "get", "key"],
    },
    {
      id: "files",
      topic: "rakenne",
      title: { fi: "Tiedostot", en: "Files" },
      blurb: {
        fi: "with sulkee tiedoston, vaikka kesken tulisi poikkeus. encoding=\"utf-8\" kannattaa kirjoittaa näkyviin.",
        en: "with closes the file even if an exception happens. Write encoding=\"utf-8\" explicitly.",
      },
      points: [
        { fi: "\"w\" ylikirjoittaa. \"a\" lisää loppuun. \"r\" lukee.", en: "\"w\" overwrites. \"a\" appends. \"r\" reads." },
        { fi: "read() palauttaa koko tekstin, readline() yhden rivin.", en: "read() returns the whole text, readline() one line." },
      ],
      file: "files.py",
      code: `with open("muistiinpanot.txt", "w", encoding="utf-8") as handle:
    handle.write("hei\\n")

with open("muistiinpanot.txt", encoding="utf-8") as handle:
    print(handle.read().strip())`,
      output: `hei`,
      tags: ["file", "open", "with", "tiedosto", "utf-8"],
    },
    {
      id: "exceptions",
      topic: "rakenne",
      title: { fi: "Poikkeukset", en: "Exceptions" },
      blurb: {
        fi: "try yrittää, except nappaa nimetyn poikkeuksen. Pelkkä except ilman tyyppiä nielaisee myös keskeytyksen, älä käytä sitä.",
        en: "try attempts the block, except catches a named exception. A bare except also swallows interrupts, so do not use it.",
      },
      points: [
        { fi: "else ajetaan, jos poikkeusta ei tullut. finally ajetaan aina.", en: "else runs when there was no exception. finally always runs." },
        { fi: "ValueError on väärä muoto, KeyError puuttuva avain, ZeroDivisionError jako nollalla.", en: "ValueError is a bad format, KeyError a missing key, ZeroDivisionError division by zero." },
      ],
      file: "exceptions.py",
      code: `try:
    n = int("12a")
except ValueError:
    print("ei luku")
else:
    print(n)`,
      output: `ei luku`,
      tags: ["try", "except", "exception", "poikkeus", "error"],
    },
    {
      id: "classes",
      topic: "rakenne",
      title: { fi: "Luokat", en: "Classes" },
      blurb: {
        fi: "class kokoaa tiedon ja siihen kuuluvat metodit. self on olio itse, ja se kirjoitetaan metodin ensimmäiseksi parametrikseksi.",
        en: "class groups data and the methods that belong to it. self is the object itself, and it is the first parameter of a method.",
      },
      points: [
        { fi: "__init__ alustaa olion. Sitä kutsutaan, kun kirjoitat Student(...).", en: "__init__ sets up the object. It runs when you write Student(...)." },
        { fi: "Kentät luodaan selfillä. Luokan ulkopuolinen nimi ei riitä.", en: "Fields are created on self. A bare name inside the method is not a field." },
      ],
      file: "classes.py",
      code: `class Student:
    def __init__(self, name, credits):
        self.name = name
        self.credits = credits

    def add(self, points):
        self.credits += points

aino = Student("Aino", 55)
aino.add(5)
print(aino.credits)`,
      output: `60`,
      tags: ["class", "self", "init", "luokka", "olio"],
    },
    {
      id: "pitfalls",
      topic: "rakenne",
      title: { fi: "Yleiset virheet", en: "Common mistakes" },
      blurb: {
        fi: "Sisennys, jaollisuus ja muuttuva oletusargumentti ovat yleisimmät kompastukset.",
        en: "Indentation, division and a mutable default argument are the usual stumbles.",
      },
      points: [
        { fi: "Python 3:ssa / on liukulukujakolasku. Kokonaisjako on //.", en: "In Python 3, / is float division. Integer division is //." },
        { fi: "Sekoita välilyöntejä ja sarkainta, niin IndentationError tulee heti.", en: "Mix spaces and tabs and you get an IndentationError immediately." },
      ],
      file: "pitfalls.py",
      code: `print(7 / 2)
print(7 // 2)

def add(item, bag=None):
    if bag is None:
        bag = []
    bag.append(item)
    return bag

print(add("a"))
print(add("b"))`,
      output: `3.5
3
['a']
['b']`,
      tags: ["bug", "virhe", "division", "indent", "default"],
    },
  ],
};
