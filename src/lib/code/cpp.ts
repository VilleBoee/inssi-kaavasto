import type { Language } from "./types";
import { CPP_THEORY } from "./cpp-theory";

const cppLessons: Language = {
  id: "cpp",
  name: "C++",
  short: "C++",
  runnable: false,
  blurb: {
    fi: "Johdannosta muistiin: syntaksi, tyypit, ohjaus, taulukot, tietueet, osoittimet ja new/delete.",
    en: "From the introduction through memory: syntax, types, control flow, arrays, structs, pointers and new/delete.",
  },
  run: {
    fi: "g++ tiedosto.cpp -o ohjelma && ./ohjelma",
    en: "g++ file.cpp -o program && ./program",
  },
  lessons: [
    {
      id: "concepts",
      topic: "perusteet",
      title: { fi: "Johdanto", en: "Intro" },
      blurb: {
        fi: "Ohjelma on lista käskyjä. Kääntäjä tekee niistä konekieltä, jonka suoritin ajaa. Muuttuja on nimetty paikka muistissa: suoritin lukee sen, laskee ja kirjoittaa tuloksen takaisin.",
        en: "A program is a list of instructions. A compiler turns them into machine code the processor runs. A variable is a named place in memory: the processor reads it, computes, and writes the result back.",
      },
      points: [
        { fi: "Lähdekoodi on tekstiä ihmiselle. Suoritin ei aja sitä suoraan.", en: "Source code is text for a human. The processor does not run it directly." },
        { fi: "Muisti pitää sekä ohjelman että sen datan. Sijoitus kirjoittaa muistiin uuden arvon.", en: "Memory holds both the program and its data. An assignment writes a new value into memory." },
        { fi: "return 0 kertoo käyttöjärjestelmälle, että ohjelma päättyi ilman virhettä.", en: "return 0 tells the operating system the program ended without an error." },
      ],
      file: "concepts.cpp",
      code: `#include <iostream>

int main() {
    int credits = 55;
    credits = credits + 5;
    std::cout << credits << "\\n";
    return 0;
}`,
      output: `60`,
      note: {
        fi: "Lause credits = credits + 5 lukee vanhan arvon, lisää viisi ja tallettaa tuloksen samaan paikkaan.",
        en: "The statement credits = credits + 5 reads the old value, adds five and stores the result in the same place.",
      },
      tags: ["tietokone", "muisti", "suoritin", "käsite", "computer", "memory", "cpu"],
    },
    {
      id: "tools",
      topic: "perusteet",
      title: { fi: "Aloitus", en: "Get started" },
      blurb: {
        fi: "Editori kirjoittaa tekstin. Kääntäjä tekee objektitiedoston. Linkkeri kokoaa objektit ja kirjastot suoritettavaksi ohjelmaksi. Debugger pysäyttää ohjelman riville ja näyttää muuttujat.",
        en: "An editor writes the text. The compiler makes an object file. The linker joins object files and libraries into a program you can run. A debugger stops on a line and shows the variables.",
      },
      points: [
        { fi: "g++ on sekä kääntäjä että linkkeri. Pelkkä g++ tiedosto.cpp tekee molemmat.", en: "g++ is both the compiler and the linker. A plain g++ file.cpp does both." },
        { fi: "g++ -c tekee vain objektitiedoston. Ilman -c syntyy valmis ohjelma.", en: "g++ -c makes only an object file. Without -c you get a finished program." },
        { fi: "-g jättää debuggaustiedon. gdb ./ohjelma käynnistää debuggerin.", en: "-g leaves debug information. gdb ./program starts the debugger." },
      ],
      file: "komennot.sh",
      code: `g++ -c ohjelma.cpp -o ohjelma.o
g++ ohjelma.o -o ohjelma
./ohjelma

g++ -g ohjelma.cpp -o ohjelma
gdb ./ohjelma`,
      output: `(komentoja, ei ohjelman tulostetta)`,
      note: {
        fi: "Editori voi olla mikä tahansa, joka tallentaa pelkän tekstin. Käännösvirhe kertoo tiedoston ja rivinumeron.",
        en: "The editor can be anything that saves plain text. A compile error names the file and the line.",
      },
      tags: ["editori", "kääntäjä", "linkkeri", "debugger", "gdb", "g++", "compiler", "linker", "editor"],
    },
    {
      id: "syntax",
      topic: "perusteet",
      title: { fi: "Syntaksi", en: "Syntax" },
      blurb: {
        fi: "Ohjelma alkaa main-funktiosta. Lause päättyy puolipisteeseen. Lohko on aaltosulkeet. Välilyönnit ja rivinvaihdot eivät muuta merkitystä, mutta isot ja pienet kirjaimet ovat eri nimiä.",
        en: "A program starts in main. A statement ends with a semicolon. A block is a pair of braces. Spaces and line breaks do not change the meaning, but capital and small letters are different names.",
      },
      points: [
        { fi: "#include liittää kirjaston ennen käännöstä.", en: "#include pulls in a library before compilation." },
        { fi: "Credits ja credits ovat eri muuttujia.", en: "Credits and credits are different variables." },
        { fi: "Puuttuva puolipiste on yleisin ensimmäinen käännösvirhe.", en: "A missing semicolon is the most common first compile error." },
      ],
      file: "syntax.cpp",
      code: `#include <iostream>

int main() {
    std::cout << "Hei\\n";
    return 0;
}`,
      output: `Hei`,
      tags: ["syntaksi", "syntax", "main", "semicolon", "puolipiste"],
    },
    {
      id: "output",
      topic: "perusteet",
      title: { fi: "Tulostus", en: "Output" },
      blurb: {
        fi: "std::cout kirjoittaa tavallisen tulosteen. << lisää virtaan tekstin tai luvun. \\n vaihtaa riviä. std::cerr on sama kirjoitus, mutta virheille.",
        en: "std::cout writes ordinary output. << adds text or a number to the stream. \\n breaks the line. std::cerr is the same kind of write, but for errors.",
      },
      points: [
        { fi: "Useita << -merkkejä voi ketjuttaa samalle riville.", en: "Several << marks can be chained on the same line." },
        { fi: "Lainausmerkit tekevät tekstin. Ilman niitä nimi etsitään muuttujista.", en: "Quotes make text. Without them the name is looked up as a variable." },
        { fi: "Virheilmoitus kuuluu cerr-virtaan, jotta sen voi ohjata eri paikkaan kuin tuloksen.", en: "An error belongs on cerr, so it can be sent somewhere other than the result." },
      ],
      file: "output.cpp",
      code: `#include <iostream>

int main() {
    int credits = 55;
    std::cout << "Hei\\n";
    std::cout << "pisteet: " << credits << "\\n";
    return 0;
}`,
      output: `Hei
pisteet: 55`,
      tags: ["cout", "tulostus", "output", "cerr", "endl"],
    },
    {
      id: "comments",
      topic: "perusteet",
      title: { fi: "Kommentit", en: "Comments" },
      blurb: {
        fi: "// aloittaa kommentin, joka päättyy rivin loppuun. /* ja */ rajaavat kommentin, joka saa jatkua usealle riville. Kääntäjä ohittaa kommentit kokonaan.",
        en: "// starts a comment that ends at the end of the line. /* and */ wrap a comment that may span several lines. The compiler skips comments entirely.",
      },
      points: [
        { fi: "Kommentti selittää miksi, ei toista mitä rivi jo sanoo.", en: "A comment explains why, it does not repeat what the line already says." },
        { fi: "Kommentin sisällä olevaa koodia ei ajeta.", en: "Code inside a comment does not run." },
        { fi: "Älä jätä kesken jäänyttä /* -alkua. Se syö lopputiedoston.", en: "Do not leave an unclosed /*. It swallows the rest of the file." },
      ],
      file: "comments.cpp",
      code: `#include <iostream>

int main() {
    int credits = 55; // opintopisteet
    std::cout << credits << "\\n";
    /* tätä ei ajeta
    std::cout << "piilossa\\n";
    */
    return 0;
}`,
      output: `55`,
      tags: ["kommentti", "comment", "//", "/*"],
    },
    {
      id: "variables",
      topic: "perusteet",
      title: { fi: "Muuttujat", en: "Variables" },
      blurb: {
        fi: "Muuttuja on nimi muistipaikalle. Tyyppi kirjoitetaan eteen ja arvo kannattaa antaa heti. const-nimeä ei saa siirtää toiseen arvoon sen jälkeen.",
        en: "A variable is a name for a place in memory. The type is written in front, and the value should be given at once. A const name must not be moved to another value afterwards.",
      },
      points: [
        { fi: "Sijoitus kirjoittaa uuden arvon. Vanha katoaa.", en: "An assignment writes a new value. The old one is gone." },
        { fi: "Nimi alkaa kirjaimella. credits ja Credits ovat eri nimiä.", en: "A name starts with a letter. credits and Credits are different names." },
        { fi: "const on lupaus: goal = 40 ei käänny, jos goal on const.", en: "const is a promise: goal = 40 does not compile if goal is const." },
      ],
      file: "variables.cpp",
      code: `#include <iostream>

int main() {
    int credits = 55;
    credits = 60;
    const int goal = 30;
    std::cout << credits << "\\n";
    std::cout << goal << "\\n";
    return 0;
}`,
      output: `60
30`,
      tags: ["muuttuja", "variable", "const", "sijoitus", "assignment"],
    },
    {
      id: "input",
      topic: "perusteet",
      title: { fi: "Syöte", en: "User input" },
      blurb: {
        fi: "std::cin lukee näppäimistöltä seuraavaan välilyöntiin asti. Jos luku ei kelpaa, virta menee virhetilaan. Virheilmoitus kirjoitetaan std::cerr-virtaan.",
        en: "std::cin reads the keyboard up to the next space. If the number is invalid, the stream fails. The error message is written to std::cerr.",
      },
      points: [
        { fi: "<< kirjoittaa virtaan, >> lukee sieltä. Luku päättyy välilyöntiin.", en: "<< writes to a stream, >> reads from one. A read stops at a space." },
        { fi: "Jos cin ei saa lukua, virta menee virhetilaan. Tarkista if (!(std::cin >> n)).", en: "If cin does not get a number, the stream fails. Check if (!(std::cin >> n))." },
        { fi: "Virheilmoitus kuuluu cerr-virtaan, ei cout-virtaan.", en: "An error message belongs on cerr, not cout." },
      ],
      file: "input.cpp",
      code: `#include <iostream>

int main() {
    int credits = 0;
    std::cout << "Opintopisteet: ";
    if (!(std::cin >> credits)) {
        std::cerr << "ei luku\\n";
        return 1;
    }
    std::cout << credits << "\\n";
    return 0;
}`,
      output: `Opintopisteet: 55
55`,
      note: {
        fi: "Syöte 55 on käyttäjän kirjoittama. Jos kirjoitat abc, ohjelma tulostaa cerr-virtaan ei luku ja palauttaa 1.",
        en: "The input 55 is typed by the user. If you type abc, the program writes ei luku to cerr and returns 1.",
      },
      tags: ["cout", "cin", "cerr", "syöte", "tulostus", "input", "output", "iostream"],
    },
    {
      id: "types",
      topic: "perusteet",
      title: { fi: "Tietotyypit", en: "Data types" },
      blurb: {
        fi: "Tyyppi kirjoitetaan nimen eteen. int on kokonaisluku, float ja double liukulukuja, char yksi merkki ja bool totuusarvo.",
        en: "The type is written before the name. int is an integer, float and double are floating-point numbers, char is one character and bool is a truth value.",
      },
      points: [
        { fi: "float on lyhyempi likiarvo, double tarkempi. 7.0f on float, 7.0 on double.", en: "float is the shorter approximation, double the more precise one. 7.0f is a float, 7.0 is a double." },
        { fi: "char-literaali on yksinkertaisissa lainausmerkeissä: 'A'. Merkkijono on eri tyyppi.", en: "A char literal uses single quotes: 'A'. A string is a different type." },
        { fi: "bool tulostuu oletuksena lukuna 1 tai 0.", en: "A bool prints as the number 1 or 0 by default." },
      ],
      file: "types.cpp",
      code: `#include <iostream>

int main() {
    int credits = 55;
    float rough = 7.0f / 2;
    double ratio = 7.0 / 2;
    char mark = 'A';
    bool passed = credits >= 30;
    std::cout << credits << "\\n";
    std::cout << rough << "\\n";
    std::cout << ratio << "\\n";
    std::cout << mark << "\\n";
    std::cout << passed << "\\n";
    return 0;
}`,
      output: `55
3.5
3.5
A
1`,
      tags: ["int", "float", "double", "char", "bool", "muuttuja", "variable", "type"],
    },
    {
      id: "booleans",
      topic: "perusteet",
      title: { fi: "Totuusarvot", en: "Booleans" },
      blurb: {
        fi: "bool on tosi tai epätosi. Vertailu palauttaa boolin. Ilman boolalpha-asetusta true tulostuu lukuna 1 ja false lukuna 0.",
        en: "A bool is true or false. A comparison returns a bool. Without the boolalpha setting, true prints as the number 1 and false as 0.",
      },
      points: [
        { fi: "std::boolalpha vaihtaa tulosteen sanoiksi true ja false.", en: "std::boolalpha switches the printout to the words true and false." },
        { fi: "Luvun käyttäminen ehtona toimii, mutta vertailu on selkeämpi.", en: "Using a number as a condition works, but a comparison is clearer." },
        { fi: "bool on oma tyyppinsä, ei vain int jonka arvo on 0 tai 1.", en: "bool is its own type, not just an int whose value is 0 or 1." },
      ],
      file: "booleans.cpp",
      code: `#include <iostream>

int main() {
    bool passed = 55 >= 30;
    std::cout << passed << "\\n";
    std::cout << std::boolalpha << passed << "\\n";
    std::cout << false << "\\n";
    return 0;
}`,
      output: `1
true
false`,
      tags: ["bool", "boolean", "totuusarvo", "true", "false", "boolalpha"],
    },
    {
      id: "arithmetic",
      topic: "ohjaus",
      title: { fi: "Operaattorit", en: "Operators" },
      blurb: {
        fi: "+ − * / laskevat. Jos molemmat ovat int, / katkaisee desimaalit. % on jakojäännös, ja se toimii vain kokonaisluvuilla.",
        en: "+ − * / compute. If both sides are int, / drops the fraction. % is the remainder, and it works only on integers.",
      },
      points: [
        { fi: "7 / 2 on 3. 7.0 / 2 on 3.5, koska toinen operandi on liukuluku.", en: "7 / 2 is 3. 7.0 / 2 is 3.5, because one operand is floating-point." },
        { fi: "7 % 2 on 1. Sillä testataan parillisuus: n % 2 == 0.", en: "7 % 2 is 1. Use it to test evenness: n % 2 == 0." },
        { fi: "a += 1 on sama kuin a = a + 1. ++a kasvattaa yhdellä.", en: "a += 1 is the same as a = a + 1. ++a adds one." },
      ],
      file: "arithmetic.cpp",
      code: `#include <iostream>

int main() {
    int a = 7;
    std::cout << (a + 2) << "\\n";
    std::cout << (a - 2) << "\\n";
    std::cout << (a * 2) << "\\n";
    std::cout << (a / 2) << "\\n";
    std::cout << (a % 2) << "\\n";
    return 0;
}`,
      output: `9
5
14
3
1`,
      tags: ["aritmetiikka", "arithmetic", "+", "-", "*", "/", "%", "jakolasku"],
    },
    {
      id: "compare",
      topic: "ohjaus",
      title: { fi: "Vertailu", en: "Comparison" },
      blurb: {
        fi: "< > <= >= == != tuottavat totuusarvon. == vertaa, yksi = sijoittaa. Sijoitus ehdon paikalla on tavallinen bugi.",
        en: "< > <= >= == != produce a truth value. == compares, a single = assigns. An assignment where a condition belongs is a common bug.",
      },
      points: [
        { fi: "Vertailun tulos on bool. Tulosteessa true on 1 ja false on 0.", en: "The result of a comparison is a bool. In the output true is 1 and false is 0." },
        { fi: "Älä vertaa liukulukuja suoraan ==:lla. Likiarvo ei aina osu tasan.", en: "Do not compare floating-point values with ==. An approximation does not always land exactly." },
      ],
      file: "compare.cpp",
      code: `#include <iostream>

int main() {
    int score = 12;
    std::cout << (score > 10) << "\\n";
    std::cout << (score < 10) << "\\n";
    std::cout << (score == 12) << "\\n";
    std::cout << (score != 12) << "\\n";
    std::cout << (score >= 12) << "\\n";
    return 0;
}`,
      output: `1
0
1
0
1`,
      tags: ["vertailu", "==", "<", ">", "!=", "comparison", "päätös"],
    },
    {
      id: "logic",
      topic: "ohjaus",
      title: { fi: "Loogiset operaattorit", en: "Logical operators" },
      blurb: {
        fi: "&& on ja, || on tai, ! on ei. && ja || lopettavat kesken, jos tulos on jo selvä: epätosi && ei laske oikeaa puolta.",
        en: "&& is and, || is or, ! is not. && and || stop early when the result is already known: a false && does not evaluate the right side.",
      },
      points: [
        { fi: "Sulut tekevät järjestyksen näkyväksi: (a && b) || c.", en: "Parentheses make the order visible: (a && b) || c." },
        { fi: "! kääntää totuusarvon. !true on false.", en: "! flips a truth value. !true is false." },
      ],
      file: "logic.cpp",
      code: `#include <iostream>

int main() {
    bool passed = true;
    bool returned = false;
    std::cout << (passed && !returned) << "\\n";
    std::cout << (passed || returned) << "\\n";
    std::cout << (!passed) << "\\n";
    return 0;
}`,
      output: `1
1
0`,
      tags: ["&&", "||", "!", "looginen", "and", "or", "logical"],
    },
    {
      id: "if",
      topic: "ohjaus",
      title: { fi: "if ja else", en: "if and else" },
      blurb: {
        fi: "if ajaa lohkon vain, kun ehto on tosi. else if kokeilee seuraavan ehdon, else ottaa jäljelle jäävät.",
        en: "if runs a block only when the condition is true. else if tries the next condition, else takes whatever is left.",
      },
      points: [
        { fi: "Laita aaltosulkeet aina, myös yhden rivin lohkoon.", en: "Always use braces, even for a one-line block." },
        { fi: "Ehdon pitää olla vertailu tai bool. Yksi = sijoittaa.", en: "The condition must be a comparison or a bool. A single = assigns." },
      ],
      file: "if.cpp",
      code: `#include <iostream>

int main() {
    int score = 12;
    if (score >= 15) {
        std::cout << "hyvaksytty\\n";
    } else if (score >= 10) {
        std::cout << "taydennettava\\n";
    } else {
        std::cout << "hylatty\\n";
    }
    return 0;
}`,
      output: `taydennettava`,
      tags: ["if", "else", "ehto", "condition", "kontrolli"],
    },
    {
      id: "switch",
      topic: "ohjaus",
      title: { fi: "switch", en: "switch" },
      blurb: {
        fi: "switch valitsee haaran kokonaisluvun tai merkin perusteella. break lopettaa haaran. Ilman sitä suoritus jatkuu seuraavaan haaraan.",
        en: "switch picks a branch from an integer or a character. break ends the branch. Without it, execution falls into the next branch.",
      },
      points: [
        { fi: "default on haara, johon tullaan kun mikään case ei täsmää.", en: "default is the branch used when no case matches." },
        { fi: "case-arvo on vakio. Muuttuja ei kelpaa case-nimeksi.", en: "A case value is a constant. A variable is not allowed as a case label." },
      ],
      file: "switch.cpp",
      code: `#include <iostream>

int main() {
    int year = 2;
    switch (year) {
    case 1:
        std::cout << "ensimmainen\\n";
        break;
    case 2:
        std::cout << "toinen\\n";
        break;
    default:
        std::cout << "muu\\n";
        break;
    }
    return 0;
}`,
      output: `toinen`,
      tags: ["switch", "case", "break", "default", "kontrolli"],
    },
    {
      id: "while",
      topic: "ohjaus",
      title: { fi: "while-silmukka", en: "While loop" },
      blurb: {
        fi: "while testaa ehdon ennen runkoa. Jos ehto on heti epätosi, runkoa ei ajeta kertaakaan. do-while ajaa rungon ensin ja testaa sitten, joten kysymys näkyy vähintään kerran.",
        en: "while tests the condition before the body. If the condition is already false, the body never runs. do-while runs the body first and tests afterwards, so a question is shown at least once.",
      },
      points: [
        { fi: "Jonkin rungossa pitää muuttua, muuten silmukka ei pääty.", en: "Something in the body must change, or the loop never ends." },
        { fi: "do-while sopii valikkoon.", en: "do-while fits a menu." },
        { fi: "Laskuri kannattaa alustaa ennen silmukkaa, ei sen sisällä.", en: "Initialize the counter before the loop, not inside it." },
      ],
      file: "while.cpp",
      code: `#include <iostream>

int main() {
    int n = 3;
    while (n > 0) {
        std::cout << n << "\\n";
        n--;
    }
    int round = 0;
    do {
        round++;
        std::cout << "kierros " << round << "\\n";
    } while (round < 1);
    return 0;
}`,
      output: `3
2
1
kierros 1`,
      tags: ["while", "do-while", "silmukka", "loop"],
    },
    {
      id: "for",
      topic: "ohjaus",
      title: { fi: "for-silmukka", en: "For loop" },
      blurb: {
        fi: "for kokoaa alustuksen, testin ja askeleen yhteen otsikkoon. for (int x : lista) käy arvot, kun et tarvitse indeksiä.",
        en: "for gathers the setup, the test and the step into one header. for (int x : list) walks the values when you do not need the index.",
      },
      points: [
        { fi: "i < n käy indeksit 0…n-1. i <= n menee yhden yli.", en: "i < n visits indexes 0…n-1. i <= n goes one past the end." },
        { fi: "Laskurin tyyppi kirjoitetaan for-otsikkoon, niin se ei elä silmukan jälkeen.", en: "Write the counter's type in the for header, and it does not live on after the loop." },
      ],
      file: "for.cpp",
      code: `#include <iostream>

int main() {
    for (int i = 1; i <= 3; i++) {
        std::cout << i << "\\n";
    }
    int scores[3] = {4, 8, 15};
    for (int score : scores) {
        std::cout << score << "\\n";
    }
    return 0;
}`,
      output: `1
2
3
4
8
15`,
      tags: ["for", "silmukka", "loop", "range"],
    },
    {
      id: "jump",
      topic: "ohjaus",
      title: { fi: "break ja continue", en: "Break and continue" },
      blurb: {
        fi: "break poistuu koko silmukasta. continue ohittaa vain tämän kierroksen lopun ja siirtyy seuraavaan. for-silmukassa continue ajaa silti askeleen, esimerkiksi i++.",
        en: "break leaves the whole loop. continue skips only the rest of this round and moves to the next. In a for loop, continue still runs the step, for example i++.",
      },
      points: [
        { fi: "break switch-haarassa ja break silmukassa ovat eri paikkoja. Sisempi voittaa.", en: "break in a switch and break in a loop are different places. The inner one wins." },
        { fi: "Älä käytä breakia paikkaamaan ehtoa, jonka voi kirjoittaa silmukan otsikkoon.", en: "Do not use break to patch a condition that can be written in the loop header." },
      ],
      file: "break.cpp",
      code: `#include <iostream>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i == 2) {
            continue;
        }
        if (i == 4) {
            break;
        }
        std::cout << i << "\\n";
    }
    return 0;
}`,
      output: `1
3`,
      tags: ["break", "continue", "silmukka", "loop"],
    },
    {
      id: "arrays",
      topic: "tieto",
      title: { fi: "Taulukot", en: "Arrays" },
      blurb: {
        fi: "int scores[4] on neljä peräkkäistä int-arvoa. Indeksi alkaa nollasta. Taulukko ei tiedä kokoaan, kun se annetaan funktiolle, joten pituus kulkee erikseen.",
        en: "int scores[4] is four ints in a row. Indexes start at zero. An array does not know its size once you pass it to a function, so the length travels separately.",
      },
      points: [
        { fi: "Indeksi 4 on jo taulukon ulkopuolella. Siellä kirjoittaminen sotkee muun muistin.", en: "Index 4 is already outside the array. Writing there corrupts other memory." },
        { fi: "for-silmukan ehto on i < count, ei i <= count.", en: "The for-loop test is i < count, not i <= count." },
        { fi: "Taulukon koko on käännösaikainen vakio. Kasvavaan listaan tarvitaan myöhemmin vector.", en: "An array's size is a compile-time constant. A list that grows needs vector later." },
      ],
      file: "arrays.cpp",
      code: `#include <iostream>

int main() {
    int scores[4] = {4, 8, 15, 16};
    int count = 4;
    for (int i = 0; i < count; i++) {
        if (scores[i] >= 10) {
            std::cout << scores[i] << "\\n";
        }
    }
    return 0;
}`,
      output: `15
16`,
      tags: ["array", "taulukko", "indeksi", "[]"],
    },
    {
      id: "string",
      topic: "tieto",
      title: { fi: "Merkkijonot", en: "Strings" },
      blurb: {
        fi: "std::string on merkkijono, joka hoitaa muistin itse. char-taulukko on eri asia ja vaatii tilan päättävälle \\0-tavulle.",
        en: "std::string is a string that manages its own memory. A char array is a different thing and needs room for the terminating \\0 byte.",
      },
      points: [
        { fi: "+ ja += liittävät tekstiä. Luvun liittämiseen tarvitaan std::to_string.", en: "+ and += join text. Joining a number needs std::to_string." },
        { fi: "size() on merkkien määrä. Indeksi 0 on ensimmäinen merkki.", en: "size() is the number of characters. Index 0 is the first character." },
        { fi: "std::getline(std::cin, rivi) lukee kokonaisen rivin, myös välilyönnit.", en: "std::getline(std::cin, line) reads a whole line, spaces included." },
      ],
      file: "string.cpp",
      code: `#include <iostream>
#include <string>

int main() {
    std::string course = "ohjelmointi";
    course += " 1";
    std::cout << course << "\\n";
    std::cout << course.substr(0, 5) << "\\n";
    std::cout << course.size() << "\\n";
    return 0;
}`,
      output: `ohjelmointi 1
ohjel
13`,
      tags: ["string", "merkkijono", "getline", "substr"],
    },
    {
      id: "math",
      topic: "tieto",
      title: { fi: "Matematiikka", en: "Math" },
      blurb: {
        fi: "<cmath> tuo neliöjuuren, potenssin ja pyöristyksen. min ja max ovat otsikossa <algorithm>. Ne eivät muuta muuttujia, vaan palauttavat tuloksen.",
        en: "<cmath> brings the square root, the power and rounding. min and max live in the header <algorithm>. They do not change the variables, they return a result.",
      },
      points: [
        { fi: "sqrt ja pow palauttavat double-luvun.", en: "sqrt and pow return a double." },
        { fi: "round pyöristää lähimpään kokonaislukuun. 2.6 menee ylöspäin.", en: "round rounds to the nearest integer. 2.6 goes up." },
        { fi: "Oma jakolasku on yhä operaattori. Kirjasto ei korvaa +-merkkiä.", en: "Your own division is still an operator. The library does not replace +." },
      ],
      file: "math.cpp",
      code: `#include <algorithm>
#include <cmath>
#include <iostream>

int main() {
    std::cout << std::max(3, 8) << "\\n";
    std::cout << std::min(3, 8) << "\\n";
    std::cout << std::sqrt(16) << "\\n";
    std::cout << std::round(2.6) << "\\n";
    std::cout << std::pow(2, 3) << "\\n";
    return 0;
}`,
      output: `8
3
4
3
8`,
      tags: ["math", "matematiikka", "sqrt", "pow", "cmath", "round"],
    },
    {
      id: "functions",
      topic: "rakenne",
      title: { fi: "Funktiot ja parametrit", en: "Functions and parameters" },
      blurb: {
        fi: "Arvoparametri on kopio: funktion sisällä tehty muutos ei näy kutsujalle. Viittausparametri T& on sama muuttuja. const T& lukee ison arvon kopioimatta sitä.",
        en: "A value parameter is a copy: a change inside the function is not visible to the caller. A reference parameter T& is the same variable. const T& reads a large value without copying it.",
      },
      points: [
        { fi: "Kopio on oletus. Käytä viittausta vain, kun kutsujan pitää muuttua tai kopio on turhan kallis.", en: "A copy is the default. Use a reference only when the caller must change or the copy is needlessly expensive." },
        { fi: "const viittauksen kautta ei saa sijoittaa. Se on lukemisen rajapinta.", en: "You cannot assign through a const reference. It is a read-only interface." },
        { fi: "return lähettää arvon takaisin ja lopettaa funktion.", en: "return sends a value back and ends the function." },
      ],
      file: "functions.cpp",
      code: `#include <iostream>

int area(int width, int height) {
    return width * height;
}

void add(int& credits, int points) {
    credits += points;
}

int main() {
    int credits = 55;
    add(credits, 5);
    std::cout << area(3, 4) << "\\n";
    std::cout << credits << "\\n";
    return 0;
}`,
      output: `12
60`,
      note: {
        fi: "area saa kopiot, joten width = 0 funktion sisällä ei muuttaisi kutsujan lukuja. add muuttaa credits-muuttujaa, koska parametri on viittaus.",
        en: "area receives copies, so width = 0 inside the function would not change the caller's numbers. add changes credits, because the parameter is a reference.",
      },
      tags: ["funktio", "function", "arvoparametri", "viittaus", "reference", "const", "parametri"],
    },
    {
      id: "struct",
      topic: "rakenne",
      title: { fi: "Struct eli tietue", en: "Struct" },
      blurb: {
        fi: "struct kokoaa yhteen kuuluvat kentät yhdeksi tyypiksi. Kenttään pääsee pisteellä. Tietue kannattaa pitää pienenä: data yhdessä, toiminnot funktioina sen vieressä.",
        en: "A struct groups fields that belong together into one type. A field is reached with a dot. Keep the record small: the data in one place, the operations as functions beside it.",
      },
      points: [
        { fi: "Student aino{\"Aino\", 55}; täyttää kentät järjestyksessä.", en: "Student aino{\"Aino\", 55}; fills the fields in order." },
        { fi: "Funktio voi ottaa tietueen viittauksena: void add(Student& student, int points).", en: "A function can take the record by reference: void add(Student& student, int points)." },
        { fi: "Osoittimen kautta kenttään mennään nuolella: pointer->credits.", en: "Through a pointer a field uses an arrow: pointer->credits." },
      ],
      file: "struct.cpp",
      code: `#include <iostream>
#include <string>

struct Student {
    std::string name;
    int credits;
};

void add(Student& student, int points) {
    student.credits += points;
}

int main() {
    Student student{"Aino", 55};
    add(student, 5);
    std::cout << student.name << " " << student.credits << "\\n";
    return 0;
}`,
      output: `Aino 60`,
      tags: ["struct", "tietue", "record", "member", "luokka"],
    },
    {
      id: "enums",
      topic: "rakenne",
      title: { fi: "Enum", en: "Enums" },
      blurb: {
        fi: "enum class nimeää pienen joukon sallittuja arvoja. Nimi pitää kirjoittaa tyypin kanssa: Mark::passed. Tavallinen enum vuotaa nimet ympäröivään lohkoon, joten kurssilla käytetään enum classia.",
        en: "enum class names a small set of allowed values. The name is written with the type: Mark::passed. A plain enum leaks its names into the surrounding block, so this course uses enum class.",
      },
      points: [
        { fi: "Vertaa enumia toiseen saman tyypin arvoon, älä kokonaislukuun.", en: "Compare an enum with another value of the same type, not with an integer." },
        { fi: "enum class ei tulostu sanana ilman omaa funktiota. Esimerkki tulostaa tekstin if-haarassa.", en: "enum class does not print as a word without a function of your own. The sample prints text in an if branch." },
        { fi: "Uusi arvo lisätään listaan. Irrallinen luku ei ole sallittu arvo.", en: "A new value is added to the list. A stray number is not an allowed value." },
      ],
      file: "enums.cpp",
      code: `#include <iostream>

enum class Mark { failed, passed, excellent };

int main() {
    Mark mark = Mark::passed;
    if (mark == Mark::passed) {
        std::cout << "lapi\\n";
    }
    return 0;
}`,
      output: `lapi`,
      tags: ["enum", "enumeration", "lueteltu", "enum class"],
    },
    {
      id: "references",
      topic: "rakenne",
      title: { fi: "Viittaukset", en: "References" },
      blurb: {
        fi: "Viittaus on toinen nimi olemassa olevalle muuttujalle. Sitä ei voi myöhemmin siirtää muualle, eikä se voi olla null. Funktion parametri int& muuttaa kutsujan muuttujaa.",
        en: "A reference is another name for an existing variable. You cannot later move it elsewhere, and it cannot be null. A parameter int& changes the caller's variable.",
      },
      points: [
        { fi: "const T& lukee ison arvon kopioimatta sitä.", en: "const T& reads a large value without copying it." },
        { fi: "Viittaus pitää sitoa heti. Tyhjää viittausta ei ole.", en: "A reference must be bound at once. There is no empty reference." },
        { fi: "Osoitin voi olla tyhjä ja vaihtaa kohdetta. Viittaus ei.", en: "A pointer may be empty and may change its target. A reference may not." },
      ],
      file: "references.cpp",
      code: `#include <iostream>

void add(int& credits, int points) {
    credits += points;
}

int main() {
    int credits = 55;
    add(credits, 5);
    std::cout << credits << "\\n";
    return 0;
}`,
      output: `60`,
      tags: ["reference", "viittaus", "&", "arvoparametri"],
    },
    {
      id: "pointers",
      topic: "rakenne",
      title: { fi: "Osoittimet", en: "Pointers" },
      blurb: {
        fi: "Osoitin säilyttää muistiosoitteen. & antaa muuttujan osoitteen, * lukee osoittimen päästä arvon. Viittaus on yleensä turvallisempi tapa samaan tarpeeseen.",
        en: "A pointer holds a memory address. & gives a variable's address, * reads the value at the pointer. A reference is usually the safer way to do the same job.",
      },
      points: [
        { fi: "Alusta osoitin heti. Alustamaton osoitin ei ole null, se on roska.", en: "Initialize a pointer immediately. An uninitialized pointer is not null, it is garbage." },
        { fi: "nullptr tarkoittaa, että osoitin ei osoita mihinkään.", en: "nullptr means the pointer points nowhere." },
      ],
      file: "pointers.cpp",
      code: `#include <iostream>

int main() {
    int value = 7;
    int* pointer = &value;
    *pointer = 8;
    std::cout << value << "\\n";
    std::cout << (pointer == nullptr) << "\\n";
    return 0;
}`,
      output: `8
0`,
      note: {
        fi: "Älä käytä osoitinta sen jälkeen, kun sen osoittama muisti on vapautettu.",
        en: "Do not use a pointer after the memory it points at has been freed.",
      },
      tags: ["pointer", "osoitin", "nullptr", "address"],
    },
    {
      id: "memory",
      topic: "rakenne",
      title: { fi: "Muistinhallinta", en: "Memory management" },
      blurb: {
        fi: "Tavallinen muuttuja elää pinossa ja katoaa lohkon päättyessä. new varaa muistin keosta ja palauttaa osoittimen. delete vapauttaa sen. Jokaisella new-kutsulla on yksi delete.",
        en: "An ordinary variable lives on the stack and disappears when the block ends. new reserves memory on the heap and returns a pointer. delete frees it. Every new has one delete.",
      },
      points: [
        { fi: "delete kahdesti samaan osoitteeseen on määrittelemätöntä.", en: "delete twice on the same address is undefined." },
        { fi: "Sijoita nullptr deletin jälkeen, jotta osoitinta ei käytetä vahingossa.", en: "Assign nullptr after delete, so the pointer is not used by accident." },
        { fi: "Taulukolle new int[n] vapautetaan delete[]:llä, ei delete:llä.", en: "An array from new int[n] is freed with delete[], not delete." },
      ],
      file: "memory.cpp",
      code: `#include <iostream>

int main() {
    int* credits = new int(55);
    *credits = 60;
    std::cout << *credits << "\\n";
    delete credits;
    credits = nullptr;
    return 0;
}`,
      output: `60`,
      note: {
        fi: "Kurssin taulukko ja vector hoitavat muistin itse. new tarvitaan, kun koko selviää vasta ajossa eikä vector ole käytössä.",
        en: "The course's array and vector manage memory themselves. new is needed when the size is known only at run time and vector is not in use.",
      },
      tags: ["new", "delete", "muisti", "memory", "heap", "keko", "nullptr"],
    },
    {
      id: "modules",
      topic: "rakenne",
      title: { fi: "Modularisointi", en: "Modularization" },
      blurb: {
        fi: "Rajapinta on otsikkotiedosto: nimet, tyypit ja se, mitä saa kutsua. Toteutus on .cpp-tiedosto. Käyttäjä näkee vain otsikon, joten toteutuksen saa vaihtaa rikkomatta kutsujia.",
        en: "The interface is the header: names, types and what may be called. The implementation is the .cpp file. A caller sees only the header, so the implementation can change without breaking callers.",
      },
      points: [
        { fi: "#pragma once estää saman otsikon liittämisen kahdesti.", en: "#pragma once stops the same header from being included twice." },
        { fi: "Otsikkoon ei kuulu käyttävä main. main.cpp vain kutsuu rajapintaa.", en: "main does not belong in the header. main.cpp only calls the interface." },
        { fi: "Käännä molemmat toteutukset: g++ opiskelija.cpp main.cpp -o ohjelma.", en: "Compile both implementation files: g++ opiskelija.cpp main.cpp -o ohjelma." },
      ],
      file: "opiskelija.h",
      code: `// opiskelija.h — rajapinta
#pragma once

struct Student {
    int credits;
};

void add(Student& student, int points);

// opiskelija.cpp — toteutus
#include "opiskelija.h"

void add(Student& student, int points) {
    student.credits += points;
}

// main.cpp
#include "opiskelija.h"
#include <iostream>

int main() {
    Student aino{55};
    add(aino, 5);
    std::cout << aino.credits << "\\n";
    return 0;
}`,
      output: `60`,
      note: {
        fi: "Kolme tiedostoa on yhdessä esimerkissä, jotta rajapinta ja toteutus näkyvät rinnakkain. Oikeassa työssä ne ovat erillisiä tiedostoja.",
        en: "Three files are shown in one sample so the interface and the implementation sit side by side. In a real project they are separate files.",
      },
      tags: ["modularisointi", "rajapinta", "header", "module", "interface", "pragma"],
    },
    {
      id: "project",
      topic: "rakenne",
      title: { fi: "Harjoitustyö", en: "A small project" },
      blurb: {
        fi: "Pieni kurssirekisteri kokoaa tyypit, tietueen, taulukon, funktiot, valikon ja virhevirran. Komento l tulostaa listan ja keskiarvon, q lopettaa.",
        en: "A small course register brings together types, a struct, an array, functions, a menu and the error stream. Command l prints the list and the average, q quits.",
      },
      points: [
        { fi: "average saa taulukon ja pituuden. Taulukko muuttuu parametrina osoittimeksi, joten pituus ei kulje mukana itsestään.", en: "average receives the array and the length. As a parameter the array becomes a pointer, so the length does not travel with it." },
        { fi: "addCredits ottaa tietueen viittauksena, koska sen pitää muuttaa kutsujan oliota.", en: "addCredits takes the record by reference, because it must change the caller's object." },
        { fi: "Tuntematon komento menee cerr-virtaan. Lista menee cout-virtaan.", en: "An unknown command goes to cerr. The list goes to cout." },
      ],
      file: "rekisteri.cpp",
      code: `#include <iostream>
#include <string>

struct Student {
    std::string name;
    int credits;
};

void addCredits(Student& student, int points) {
    student.credits += points;
}

double average(const Student students[], int count) {
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += students[i].credits;
    }
    if (count == 0) {
        return 0;
    }
    return static_cast<double>(sum) / count;
}

int main() {
    Student group[2] = {{"Aino", 55}, {"Leevi", 120}};
    addCredits(group[0], 5);
    char command = ' ';
    do {
        std::cout << "komento (l/q): ";
        if (!(std::cin >> command)) {
            std::cerr << "syote loppui\\n";
            return 1;
        }
        if (command == 'l') {
            for (int i = 0; i < 2; i++) {
                std::cout << group[i].name << " " << group[i].credits << "\\n";
            }
            std::cout << "keskiarvo " << average(group, 2) << "\\n";
        } else if (command != 'q') {
            std::cerr << "tuntematon komento\\n";
        }
    } while (command != 'q');
    return 0;
}`,
      output: `komento (l/q): l
Aino 60
Leevi 120
keskiarvo 90
komento (l/q): q`,
      note: {
        fi: "Kirjaimet l ja q rivien lopussa ovat käyttäjän syötettä. Laajenna työtä: lisää opiskelija taulukkoon, pyydä pisteet cinillä ja siirrä keskiarvo omaan tiedostoonsa otsikon taakse.",
        en: "The letters l and q at the ends of the lines are what the user types. Extend the work: add a student into the array, ask for the points with cin, and move the average behind a header in its own file.",
      },
      tags: ["harjoitustyö", "projekti", "exercise", "project", "valikko", "rekisteri"],
    },
    {
      id: "vector",
      topic: "tieto",
      title: { fi: "vector", en: "vector" },
      blurb: {
        fi: "std::vector on taulukko, jonka pituus saa muuttua ajossa. Käytä sitä, kun kurssin kiinteä taulukko loppuu kesken. at() tarkistaa rajat, [] ei tarkista.",
        en: "std::vector is an array whose length may change at run time. Use it when the course's fixed array is not enough. at() checks the bounds, [] does not.",
      },
      points: [
        { fi: "push_back lisää loppuun.", en: "push_back appends." },
        { fi: "size() on alkioiden määrä. Viimeinen kelvollinen indeksi on size() - 1.", en: "size() is the number of items. The last valid index is size() - 1." },
      ],
      file: "vector.cpp",
      code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {4, 8, 15};
    scores.push_back(16);
    for (int score : scores) {
        if (score >= 10) {
            std::cout << score << "\\n";
        }
    }
    return 0;
}`,
      output: `15
16`,
      tags: ["vector", "push_back", "taulukko"],
    },
    {
      id: "pitfalls",
      topic: "rakenne",
      title: { fi: "Yleiset virheet", en: "Common mistakes" },
      blurb: {
        fi: "Kokonaisjakolasku, taulukon rajat ja = ehdon paikalla menevät käännöksestä läpi ja tuottavat väärän tuloksen.",
        en: "Integer division, array bounds and = where a condition belongs all compile and still produce the wrong result.",
      },
      points: [
        { fi: "int a[3] ei kerro pituuttaan funktiolle. Vie count mukana tai käytä vectoria.", en: "int a[3] does not tell a function its length. Pass count along, or use vector." },
        { fi: "Alustamaton paikallinen int ei ole nolla.", en: "An uninitialized local int is not zero." },
      ],
      file: "pitfalls.cpp",
      code: `#include <iostream>

int main() {
    std::cout << (7 / 2) << "\\n";
    std::cout << (7 / 2.0) << "\\n";
    return 0;
}`,
      output: `3
3.5`,
      tags: ["bug", "virhe", "off-by-one", "division"],
    },
  ],
};

export const cpp: Language = {
  ...cppLessons,
  lessons: cppLessons.lessons.map((lesson) => ({
    ...lesson,
    theory: CPP_THEORY[lesson.id],
  })),
};
