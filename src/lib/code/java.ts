import type { Language } from "./types";

export const java: Language = {
  id: "java",
  name: "Java",
  short: "Java",
  runnable: false,
  blurb: {
    fi: "Luokka on pakollinen. Tiedoston nimi ja julkinen luokka ovat sama sana, ja ohjelma alkaa metodista main.",
    en: "A class is required. The file name and the public class are the same word, and the program starts in main.",
  },
  run: {
    fi: "javac Tiedosto.java && java Tiedosto",
    en: "javac File.java && java File",
  },
  lessons: [
    {
      id: "hello",
      topic: "perusteet",
      title: { fi: "Luokka ja main", en: "Class and main" },
      blurb: {
        fi: "Julkinen luokka Hello asuu tiedostossa Hello.java. main on se metodi, jonka käynnistin kutsuu.",
        en: "The public class Hello lives in the file Hello.java. main is the method the launcher calls.",
      },
      points: [
        { fi: "System.out.println tulostaa ja vaihtaa riviä.", en: "System.out.println prints and breaks the line." },
        { fi: "Iso alkukirjain luokalla, pieni metodilla.", en: "A capital letter for a class, a small letter for a method." },
      ],
      file: "Hello.java",
      code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hei");
        System.out.println(2 + 3);
    }
}`,
      output: `Hei
5`,
      tags: ["main", "class", "println", "hello"],
    },
    {
      id: "types",
      topic: "perusteet",
      title: { fi: "Tyypit", en: "Types" },
      blurb: {
        fi: "int, double, boolean ja char ovat alkeistyyppejä. String on luokka, joten sitä verrataan equals-metodilla, ei ==.",
        en: "int, double, boolean and char are primitive types. String is a class, so compare it with equals, not ==.",
      },
      points: [
        { fi: "int-jakolasku katkaisee: 7 / 2 on 3.", en: "int division truncates: 7 / 2 is 3." },
        { fi: "String name = \"Aino\"; on viittaus olioon.", en: "String name = \"Aino\"; is a reference to an object." },
      ],
      file: "Types.java",
      code: `public class Types {
    public static void main(String[] args) {
        int credits = 55;
        double ratio = 7.0 / 2;
        String name = "Aino";
        System.out.println(credits);
        System.out.println(ratio);
        System.out.println(name.equals("Aino"));
    }
}`,
      output: `55
3.5
true`,
      tags: ["int", "double", "string", "tyyppi", "type"],
    },
    {
      id: "if",
      topic: "ohjaus",
      title: { fi: "Ehto", en: "Conditionals" },
      blurb: {
        fi: "if ja else if toimivat kuten C-sukuisissa kielissä. switch valitsee tasaisen arvon perusteella.",
        en: "if and else if work as in the C family. switch picks a branch from a flat value.",
      },
      points: [
        { fi: "== vertaa alkeistyyppejä. Merkkijonolle käytä equals.", en: "== compares primitives. For a string, use equals." },
        { fi: "Unohtunut break switchissä jatkaa seuraavaan haaraan.", en: "A missing break in a switch falls through to the next branch." },
      ],
      file: "If.java",
      code: `public class If {
    public static void main(String[] args) {
        int score = 12;
        if (score >= 15) {
            System.out.println("hyvaksytty");
        } else if (score >= 10) {
            System.out.println("taydennettava");
        } else {
            System.out.println("hylatty");
        }
    }
}`,
      output: `taydennettava`,
      tags: ["if", "else", "switch", "ehto"],
    },
    {
      id: "loops",
      topic: "ohjaus",
      title: { fi: "Silmukat", en: "Loops" },
      blurb: {
        fi: "for on laskuri, while ehto ja for-each käy taulukon tai listan alkiot.",
        en: "for is a counter, while is a condition, and for-each walks an array or a list.",
      },
      points: [
        { fi: "for-each ei anna indeksiä. Jos tarvitset indeksin, käytä tavallista for-silmukkaa.", en: "for-each does not give you the index. If you need it, use an ordinary for." },
      ],
      file: "Loops.java",
      code: `public class Loops {
    public static void main(String[] args) {
        String[] names = {"Aino", "Leevi"};
        for (String name : names) {
            System.out.println(name);
        }
    }
}`,
      output: `Aino
Leevi`,
      tags: ["for", "while", "silmukka", "loop"],
    },
    {
      id: "methods",
      topic: "ohjaus",
      title: { fi: "Metodit", en: "Methods" },
      blurb: {
        fi: "Metodi on luokan funktio. static-metodia kutsutaan ilman oliota. main on static, joten sen apurit ovat usein myös static.",
        en: "A method is a function on a class. A static method is called without an object. main is static, so its helpers are often static too.",
      },
      points: [
        { fi: "Palautustyyppi kirjoitetaan nimen eteen. void ei palauta arvoa.", en: "The return type is written before the name. void returns no value." },
        { fi: "Parametrit kopioidaan. Olion kenttiä voi silti muuttaa, koska kopioituu viittaus.", en: "Parameters are copied. You can still change an object's fields, because the reference is what gets copied." },
      ],
      file: "Methods.java",
      code: `public class Methods {
    static int area(int width, int height) {
        return width * height;
    }

    public static void main(String[] args) {
        System.out.println(area(3, 4));
    }
}`,
      output: `12`,
      tags: ["method", "static", "return", "metodi"],
    },
    {
      id: "lists",
      topic: "tieto",
      title: { fi: "Taulukko ja ArrayList", en: "Arrays and ArrayList" },
      blurb: {
        fi: "Taulukon pituus on kiinteä. ArrayList kasvaa. Indeksi alkaa nollasta, ja get heittää poikkeuksen, jos indeksi on yli.",
        en: "An array has a fixed length. ArrayList grows. Indexes start at zero, and get throws if the index is out of range.",
      },
      points: [
        { fi: "Taulukon pituus on names.length ilman sulkuja. Listan pituus on size().", en: "An array's length is names.length with no parentheses. A list's length is size()." },
        { fi: "ArrayList<int> ei kelpaa. Käytä ArrayList<Integer>.", en: "ArrayList<int> is illegal. Use ArrayList<Integer>." },
      ],
      file: "Lists.java",
      code: `import java.util.ArrayList;

public class Lists {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Aino");
        names.add("Leevi");
        System.out.println(names.get(0));
        System.out.println(names.size());
    }
}`,
      output: `Aino
2`,
      tags: ["array", "arraylist", "lista", "taulukko"],
    },
    {
      id: "strings",
      topic: "tieto",
      title: { fi: "Merkkijonot", en: "Strings" },
      blurb: {
        fi: "String on muuttumaton. concat ja + tekevät uuden olion. equals vertaa sisältöä, == vertaa onko sama olio.",
        en: "String is immutable. concat and + build a new object. equals compares the contents, == compares whether it is the same object.",
      },
      points: [
        { fi: "substring(alku, loppu) ei sisällä loppuindeksiä.", en: "substring(start, end) does not include the end index." },
        { fi: "length() on merkkien määrä.", en: "length() is the number of characters." },
      ],
      file: "Strings.java",
      code: `public class Strings {
    public static void main(String[] args) {
        String course = "ohjelmointi";
        System.out.println(course + " 1");
        System.out.println(course.substring(0, 5));
        System.out.println(course.equals("Ohjelmointi"));
    }
}`,
      output: `ohjelmointi 1
ohjel
false`,
      tags: ["string", "equals", "substring", "merkkijono"],
    },
    {
      id: "classes",
      topic: "rakenne",
      title: { fi: "Oliot", en: "Objects" },
      blurb: {
        fi: "new luo olion ja kutsuu konstruktoria. Kentät pidetään private-näkyvyydessä, ja niihin kosketaan metodeilla.",
        en: "new creates an object and calls the constructor. Fields stay private, and you touch them through methods.",
      },
      points: [
        { fi: "Konstruktorin nimi on luokan nimi, eikä sillä ole palautustyyppiä.", en: "The constructor's name is the class name, and it has no return type." },
        { fi: "this.credits on olion kenttä, credits voi olla parametrin nimi.", en: "this.credits is the object's field, credits can be a parameter name." },
      ],
      file: "Student.java",
      code: `public class Student {
    private String name;
    private int credits;

    public Student(String name, int credits) {
        this.name = name;
        this.credits = credits;
    }

    public void add(int points) {
        credits += points;
    }

    public int getCredits() {
        return credits;
    }

    public static void main(String[] args) {
        Student aino = new Student("Aino", 55);
        aino.add(5);
        System.out.println(aino.getCredits());
    }
}`,
      output: `60`,
      tags: ["class", "new", "constructor", "olio", "luokka"],
    },
    {
      id: "exceptions",
      topic: "rakenne",
      title: { fi: "Poikkeukset", en: "Exceptions" },
      blurb: {
        fi: "try, catch ja finally. NumberFormatException tulee, kun teksti ei ole luku. Älä nappaa pelkkää Exception-kantaluokkaa, ellet tiedä miksi.",
        en: "try, catch and finally. NumberFormatException happens when text is not a number. Do not catch the bare Exception base type unless you know why.",
      },
      points: [
        { fi: "Tarkistettavat poikkeukset pitää joko napata tai merkitä throws-sanalla.", en: "Checked exceptions must be caught or marked with throws." },
        { fi: "RuntimeException, kuten NullPointerException, on tarkistamaton.", en: "RuntimeException, such as NullPointerException, is unchecked." },
      ],
      file: "Errors.java",
      code: `public class Errors {
    public static void main(String[] args) {
        try {
            int n = Integer.parseInt("12a");
            System.out.println(n);
        } catch (NumberFormatException error) {
            System.out.println("ei luku");
        }
    }
}`,
      output: `ei luku`,
      tags: ["try", "catch", "exception", "poikkeus"],
    },
    {
      id: "pitfalls",
      topic: "rakenne",
      title: { fi: "Yleiset virheet", en: "Common mistakes" },
      blurb: {
        fi: "Merkkijonon == ja kokonaisjakolasku tuottavat väärän tuloksen ilman käännösvirhettä.",
        en: "== on strings and integer division produce the wrong result without a compile error.",
      },
      points: [
        { fi: "new String(\"Aino\") == \"Aino\" voi olla false, vaikka teksti on sama.", en: "new String(\"Aino\") == \"Aino\" can be false even when the text matches." },
        { fi: "Tiedoston nimi ja public-luokan nimi eivät saa erota, tai javac kieltäytyy.", en: "The file name and the public class name must match, or javac refuses." },
      ],
      file: "Pitfalls.java",
      code: `public class Pitfalls {
    public static void main(String[] args) {
        String name = new String("Aino");
        System.out.println(name == "Aino");
        System.out.println(name.equals("Aino"));
        System.out.println(7 / 2);
    }
}`,
      output: `false
true
3`,
      tags: ["bug", "virhe", "equals", "=="],
    },
  ],
};
