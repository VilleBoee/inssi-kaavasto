import type { Language } from "./types";

export const c: Language = {
  id: "c",
  name: "C",
  short: "C",
  runnable: false,
  blurb: {
    fi: "Pieni kieli ilman luokkia ja merkkijonotyyppiä. Muisti ja osoittimet ovat sinun vastuullasi.",
    en: "A small language with no classes and no string type. Memory and pointers are your job.",
  },
  run: {
    fi: "gcc tiedosto.c -o ohjelma && ./ohjelma",
    en: "gcc file.c -o program && ./program",
  },
  lessons: [
    {
      id: "hello",
      topic: "perusteet",
      title: { fi: "Hei ja printf", en: "Hello and printf" },
      blurb: {
        fi: "stdio.h tuo printf-funktion. Muoto %d on int, %s merkkijono ja \\n rivinvaihto. main palauttaa 0.",
        en: "stdio.h brings in printf. The format %d is an int, %s a string and \\n a newline. main returns 0.",
      },
      points: [
        { fi: "Jokainen include on otsikkotiedosto, ei valmista toteutusta.", en: "Each include is a header, not a finished implementation." },
        { fi: "Väärä muoto, esimerkiksi %d liukuluvulle, on määrittelemätöntä käytöstä.", en: "A wrong format, such as %d for a float, is undefined behavior." },
      ],
      file: "hello.c",
      code: `#include <stdio.h>

int main(void) {
    printf("Hei\\n");
    printf("%d\\n", 2 + 3);
    return 0;
}`,
      output: `Hei
5`,
      tags: ["printf", "main", "hello", "gcc"],
    },
    {
      id: "types",
      topic: "perusteet",
      title: { fi: "Tyypit", en: "Types" },
      blurb: {
        fi: "int, double, char. char on pieni kokonaisluku, joka sattuu olemaan merkin koodi. Koko riippuu kääntäjästä: sizeof kertoo tavut.",
        en: "int, double, char. char is a small integer that happens to be a character code. The size depends on the compiler: sizeof tells you the bytes.",
      },
      points: [
        { fi: "7 / 2 on 3, koska molemmat ovat int.", en: "7 / 2 is 3, because both are int." },
        { fi: "Alustamaton paikallinen muuttuja ei ole nolla.", en: "An uninitialized local variable is not zero." },
      ],
      file: "types.c",
      code: `#include <stdio.h>

int main(void) {
    int credits = 55;
    double ratio = 7.0 / 2;
    printf("%d\\n", credits);
    printf("%.1f\\n", ratio);
    printf("%zu\\n", sizeof(int));
    return 0;
}`,
      output: `55
3.5
4`,
      note: {
        fi: "sizeof(int) on yleensä 4, mutta kieli takaa vain vähintään 2 tavua. Älä kovakoodaa kokoa.",
        en: "sizeof(int) is usually 4, but the language only guarantees at least 2 bytes. Do not hard-code the size.",
      },
      tags: ["int", "double", "char", "sizeof", "tyyppi"],
    },
    {
      id: "input",
      topic: "perusteet",
      title: { fi: "scanf", en: "scanf" },
      blurb: {
        fi: "scanf lukee muotoilun mukaan. Luvulle annetaan osoite: &credits. Paluuarvo on onnistuneiden kenttien määrä.",
        en: "scanf reads according to a format. A number is passed as an address: &credits. The return value is the count of fields that succeeded.",
      },
      points: [
        { fi: "%s kirjoittaa puskurin yli, jos merkkijono on pidempi kuin taulukko. Rajaa se: %19s.", en: "%s writes past the buffer if the string is longer than the array. Limit it: %19s." },
        { fi: "Tarkista, että scanf palautti 1, ennen kuin käytät lukua.", en: "Check that scanf returned 1 before you use the number." },
      ],
      file: "input.c",
      code: `#include <stdio.h>

int main(void) {
    int credits = 0;
    printf("Opintopisteet: ");
    if (scanf("%d", &credits) != 1) {
        printf("ei luku\\n");
        return 1;
    }
    printf("%d\\n", credits);
    return 0;
}`,
      output: `Opintopisteet: 55
55`,
      tags: ["scanf", "input", "syöte", "stdio"],
    },
    {
      id: "control",
      topic: "ohjaus",
      title: { fi: "Ehto ja silmukka", en: "Conditions and loops" },
      blurb: {
        fi: "if, for ja while ovat samat kuin C++:ssa. Lohko on aaltosulkeet, ei sisennys.",
        en: "if, for and while are the same as in C++. A block is braces, not indentation.",
      },
      points: [
        { fi: "Sisennys on vain ihmiselle. Kääntäjä katsoo sulkeita.", en: "Indentation is only for humans. The compiler looks at braces." },
        { fi: "i < n, ei i <= n, kun käyt taulukon.", en: "i < n, not i <= n, when you walk an array." },
      ],
      file: "control.c",
      code: `#include <stdio.h>

int main(void) {
    int score = 12;
    if (score >= 10) {
        printf("jatkoon\\n");
    }
    for (int i = 1; i <= 3; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`,
      output: `jatkoon
1
2
3`,
      note: {
        fi: "for (int i = …) vaatii C99-tilan. gcc hyväksyy sen oletuksena.",
        en: "for (int i = …) needs C99. gcc accepts it by default.",
      },
      tags: ["if", "for", "while", "silmukka", "ehto"],
    },
    {
      id: "functions",
      topic: "ohjaus",
      title: { fi: "Funktiot", en: "Functions" },
      blurb: {
        fi: "Esittely kertoo nimen ja tyypit, määritelmä kertoo rungon. Ilman esittelyä kääntäjä arvaa vanhalla tavalla ja varoittaa.",
        en: "A declaration gives the name and the types, a definition gives the body. Without a declaration the compiler guesses the old way and warns.",
      },
      points: [
        { fi: "Parametrit kopioidaan. Osoitinparametri voi silti muuttaa kutsujan dataa.", en: "Parameters are copied. A pointer parameter can still change the caller's data." },
        { fi: "void tarkoittaa, ettei parametreja ole: int main(void).", en: "void means there are no parameters: int main(void)." },
      ],
      file: "functions.c",
      code: `#include <stdio.h>

int area(int width, int height) {
    return width * height;
}

int main(void) {
    printf("%d\\n", area(3, 4));
    return 0;
}`,
      output: `12`,
      tags: ["function", "return", "funktio", "prototype"],
    },
    {
      id: "arrays",
      topic: "tieto",
      title: { fi: "Taulukot", en: "Arrays" },
      blurb: {
        fi: "int scores[4] on neljä peräkkäistä int-arvoa. Taulukko ei tiedä omaa pituuttaan, kun se annetaan funktiolle.",
        en: "int scores[4] is four ints in a row. An array does not know its own length once you pass it to a function.",
      },
      points: [
        { fi: "Vie pituus erikseen: int sum(int items[], int count).", en: "Pass the length yourself: int sum(int items[], int count)." },
        { fi: "Indeksi count on jo taulukon ulkopuolella.", en: "The index count is already outside the array." },
      ],
      file: "arrays.c",
      code: `#include <stdio.h>

int main(void) {
    int scores[] = {4, 8, 15, 16};
    int count = sizeof scores / sizeof scores[0];
    for (int i = 0; i < count; i++) {
        if (scores[i] >= 10) {
            printf("%d\\n", scores[i]);
        }
    }
    return 0;
}`,
      output: `15
16`,
      tags: ["array", "taulukko", "sizeof", "index"],
    },
    {
      id: "pointers",
      topic: "rakenne",
      title: { fi: "Osoittimet", en: "Pointers" },
      blurb: {
        fi: "Osoitin on osoite. &value antaa osoitteen, *pointer lukee sen päästä. NULL on tyhjä osoitin.",
        en: "A pointer is an address. &value gives the address, *pointer reads through it. NULL is an empty pointer.",
      },
      points: [
        { fi: "Älä dereferoi NULL-osoitinta. Ohjelma kaatuu.", en: "Do not dereference a NULL pointer. The program crashes." },
        { fi: "malloc varaa muistia, free vapauttaa. Jokaiselle mallocille kuuluu yksi free.", en: "malloc reserves memory, free releases it. Every malloc gets one free." },
      ],
      file: "pointers.c",
      code: `#include <stdio.h>

int main(void) {
    int value = 7;
    int *pointer = &value;
    *pointer = 8;
    printf("%d\\n", value);
    return 0;
}`,
      output: `8`,
      tags: ["pointer", "osoitin", "null", "malloc", "address"],
    },
    {
      id: "strings",
      topic: "rakenne",
      title: { fi: "Merkkijonot", en: "Strings" },
      blurb: {
        fi: "Merkkijono on char-taulukko, jonka lopussa on nollatavu '\\0'. strlen ei laske nollatavua mukaan.",
        en: "A string is a char array that ends with the zero byte '\\0'. strlen does not count that zero byte.",
      },
      points: [
        { fi: "char name[20] = \"Ada\"; mahtuu, koska tilaa on 20 ja teksti on lyhyt.", en: "char name[20] = \"Ada\"; fits, because there are 20 slots and the text is short." },
        { fi: "strcpy ilman rajatarkistusta on puskurin ylivuoto. Käytä mieluummin rajattua kopiota.", en: "strcpy without a limit is a buffer overflow. Prefer a bounded copy." },
      ],
      file: "strings.c",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char name[20] = "Ada";
    printf("%s\\n", name);
    printf("%zu\\n", strlen(name));
    return 0;
}`,
      output: `Ada
3`,
      tags: ["string", "strlen", "char", "merkkijono", "null"],
    },
    {
      id: "struct",
      topic: "rakenne",
      title: { fi: "Struct", en: "Struct" },
      blurb: {
        fi: "struct kokoaa kentät yhdeksi tyypiksi. C:ssä ei ole metodeja: funktio saa structurin osoittimena.",
        en: "A struct groups fields into one type. C has no methods: a function receives the struct as a pointer.",
      },
      points: [
        { fi: "Arvolla kenttään pääsee pisteellä, osoittimella nuolella.", en: "A value uses a dot, a pointer uses an arrow." },
        { fi: "typedef säästää sen, että joka paikassa pitää kirjoittaa struct Student.", en: "typedef saves you from writing struct Student everywhere." },
      ],
      file: "struct.c",
      code: `#include <stdio.h>

struct Student {
    char name[20];
    int credits;
};

void add(struct Student *student, int points) {
    student->credits += points;
}

int main(void) {
    struct Student aino = {"Aino", 55};
    add(&aino, 5);
    printf("%s %d\\n", aino.name, aino.credits);
    return 0;
}`,
      output: `Aino 60`,
      tags: ["struct", "member", "arrow"],
    },
    {
      id: "pitfalls",
      topic: "rakenne",
      title: { fi: "Yleiset virheet", en: "Common mistakes" },
      blurb: {
        fi: "Puskurin yli kirjoitus ja vapautetun muistin käyttö eivät aina kaada heti. Ne sotkevat myöhemmän tuloksen.",
        en: "Writing past a buffer and using freed memory do not always crash at once. They corrupt a later result.",
      },
      points: [
        { fi: "Vertaa merkkijonoja strcmp-funktiolla. == vertaa osoitteita.", en: "Compare strings with strcmp. == compares addresses." },
        { fi: "Älä palauta osoitinta funktion paikalliseen taulukkoon. Se häviää, kun funktio päättyy.", en: "Do not return a pointer to a function's local array. It disappears when the function returns." },
      ],
      file: "pitfalls.c",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "Ada";
    char b[] = "Ada";
    printf("%d\\n", a == b);
    printf("%d\\n", strcmp(a, b) == 0);
    return 0;
}`,
      output: `0
1`,
      tags: ["bug", "virhe", "strcmp", "buffer", "overflow"],
    },
  ],
};
