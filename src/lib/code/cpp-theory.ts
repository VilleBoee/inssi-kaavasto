import type { Copy } from "./types";

export const CPP_THEORY: Record<string, Copy> = {
  concepts: {
    fi: `**Ohjelma** on lista käskyjä. Ihminen kirjoittaa ne tekstinä, [[kääntäjä]] tekee niistä konekieltä, ja [[suoritin]] ajaa konekielen askel kerrallaan. Suoritin ei ymmärrä muuttujan nimeä. Se lukee ja kirjoittaa **muistipaikkoja**.

Muuttuja on nimetty paikka muistissa. Lause §credits = credits + 5§ lukee vanhan arvon, laskee summan ja kirjoittaa tuloksen takaisin samaan paikkaan. Nimi credits on olemassa vain lähdekoodissa. Käännöksen jälkeen siitä on jäljellä osoite.

>> §return 0§ kertoo käyttöjärjestelmälle, että ohjelma päättyi ilman virhettä. Muu luku, usein 1, tarkoittaa epäonnistumista. Konsolissa sen näkee komennon jälkeen, ei yleensä tulosteessa.`,
    en: `A **program** is a list of instructions. A person writes them as text, a [[compiler]] turns them into machine code, and the [[processor]] runs that machine code one step at a time. The processor does not understand a variable's name. It reads and writes **memory locations**.

A variable is a named place in memory. The statement §credits = credits + 5§ reads the old value, computes the sum and writes the result back to the same place. The name credits exists only in the source. After compilation, an address is all that remains.

>> §return 0§ tells the operating system the program ended without an error. Another number, often 1, means failure. In a console you see it after the command, not usually in the printed text.`,
  },
  tools: {
    fi: `Työ jakautuu neljään työkaluun. **Editori** tallentaa pelkän tekstin. [[Kääntäjä]] tarkistaa kieliopin ja tekee objektitiedoston. [[Linkkeri]] yhdistää objektitiedostot ja kirjastot yhdeksi ohjelmaksi. [[Debugger]] pysäyttää ajon riville ja näyttää muuttujien arvot.

§g++§ on sekä kääntäjä että linkkeri. §g++ -c ohjelma.cpp§ pysähtyy objektitiedostoon. Ilman §-c§ syntyy valmis ohjelma. §-g§ jättää mukaan tiedon, jota §gdb§ tarvitsee: ilman sitä debugger näkee vain konekieltä.

>> Käännösvirhe kertoo tiedoston ja rivin. Lue ensimmäinen virhe, älä viimeistä. Myöhemmät rivit ovat usein seurausta ensimmäisestä puuttuvasta puolipisteestä.`,
    en: `The work splits into four tools. An **editor** saves plain text. A [[compiler]] checks the grammar and makes an object file. A [[linker]] joins object files and libraries into one program. A [[debugger]] stops the run on a line and shows the values of variables.

§g++§ is both the compiler and the linker. §g++ -c file.cpp§ stops at an object file. Without §-c§ you get a finished program. §-g§ keeps the information §gdb§ needs: without it the debugger sees only machine code.

>> A compile error names the file and the line. Read the first error, not the last. Later lines are often the consequence of the first missing semicolon.`,
  },
  input: {
    fi: `Konsoliohjelma puhuu kolmen virran kautta. [[std::cout]] on tavallinen tulos. [[std::cerr]] on virheilmoituksille. [[std::cin]] lukee näppäimistöltä. Tulos ja virhe pidetään erillään, jotta käyttäjä voi ohjata ne eri tiedostoihin.

§<<§ kirjoittaa virtaan, §>>§ lukee siitä. Luku päättyy ensimmäiseen välilyöntiin, joten yksi §cin >> credits§ ei lue kokonaista lausetta. Jos käyttäjä kirjoittaa tekstiä luvun paikalle, virta menee **virhetilaan** ja seuraavat luvut epäonnistuvat, kunnes virhe kuitataan.

>> Tarkista luku heti: §if (!(std::cin >> credits))§. Virheilmoitus kirjoitetaan cerr-virtaan, ei cout-virtaan. Esimerkin riviin ilmestyvä luku 55 on käyttäjän syöte, ei ohjelman keksimä.`,
    en: `A console program speaks through three streams. [[std::cout]] is the ordinary result. [[std::cerr]] is for errors. [[std::cin]] reads the keyboard. The result and the error stay separate so the user can send them to different files.

§<<§ writes to a stream, §>>§ reads from one. A read stops at the first space, so one §cin >> credits§ does not read a whole sentence. If the user types text where a number belongs, the stream enters an **error state** and later reads fail until the error is cleared.

>> Check the read at once: §if (!(std::cin >> credits))§. The error message is written to cerr, not cout. The number 55 that appears on the sample's line is the user's input, not something the program invented.`,
  },
  types: {
    fi: `**Tyyppi** kertoo, montako tavua varataan ja mitä bitit tarkoittavat. §int§ on kokonaisluku. §float§ on lyhyt likiarvo, §double§ tarkempi. §char§ on yksi merkki ja samalla pieni kokonaisluku. §bool§ on totuusarvo.

Tyyppi kirjoitetaan nimen eteen ja se päätetään **käännöksessä**. §7.0f§ on float, §7.0§ on double. Merkkiliteraali on yksinkertaisissa lainausmerkeissä, §'A'§. Merkkijono on eri tyyppi, eikä se mahdu yhteen chariin.

>> Alustamaton paikallinen muuttuja ei ole nolla. Siinä on mitä muistissa sattui olemaan. Anna arvo heti: §int credits = 55§. bool tulostuu oletuksena lukuna 1 tai 0.`,
    en: `A **type** says how many bytes are reserved and what the bits mean. §int§ is an integer. §float§ is a short approximation, §double§ a more precise one. §char§ is one character and also a small integer. §bool§ is a truth value.

The type is written before the name and it is decided at **compile time**. §7.0f§ is a float, §7.0§ is a double. A character literal uses single quotes, §'A'§. A string is a different type, and it does not fit in one char.

>> An uninitialized local variable is not zero. It holds whatever happened to be in memory. Give a value at once: §int credits = 55§. A bool prints as the number 1 or 0 by default.`,
  },
  arithmetic: {
    fi: `**Aritmetiikka** on §+§, §-§, §*§ ja §/§. Jos molemmat operandit ovat §int§, jakolasku katkaisee desimaalit: §7 / 2§ on 3, ei 3.5. §%§ on jakojäännös ja toimii vain kokonaisluvuilla. §7 % 2§ on 1.

Toinen operandi liukulukuna muuttaa laskun: §7.0 / 2§ on 3.5. Sekoita tyyppejä vain tietoisesti. §a += 1§ on sama kuin §a = a + 1§. §++a§ kasvattaa yhdellä ennen kuin arvoa käytetään.

>> Parillisuustesti on §n % 2 == 0§. Älä kirjoita §n % 2 = 0§: yksi yhtäsuuruusmerkki sijoittaa, eikä se ole vertailu.`,
    en: `**Arithmetic** is §+§, §-§, §*§ and §/§. If both operands are §int§, division drops the fraction: §7 / 2§ is 3, not 3.5. §%§ is the remainder and works only on integers. §7 % 2§ is 1.

A floating-point operand changes the calculation: §7.0 / 2§ is 3.5. Mix types only on purpose. §a += 1§ is the same as §a = a + 1§. §++a§ adds one before the value is used.

>> The evenness test is §n % 2 == 0§. Do not write §n % 2 = 0§: a single equals sign assigns, and it is not a comparison.`,
  },
  compare: {
    fi: `**Vertailu** tuottaa totuusarvon. §<§, §>§, §<=§ ja §>=§ vertaavat suuruutta. §==§ kysyy, ovatko arvot samat. §!=§ kysyy, ovatko ne eri. Tulos on §bool§, ja tulosteessa tosi on 1 ja epätosi 0.

Yksi §=§ **sijoittaa**. Kaksi on vertailu. Ehto §if (score = 12)§ kirjoittaa luvun muuttujaan ja on lähes aina tosi. Kääntäjä saattaa varoittaa, mutta ohjelma syntyy silti.

>> Älä vertaa liukulukuja suoraan §==§-operaattorilla. Likiarvo ei aina osu tasan, vaikka matematiikassa luvut olisivat yhtä suuret. Vertaa erotuksen itseisarvoa pieneen rajaan.`,
    en: `A **comparison** produces a truth value. §<§, §>§, §<=§ and §>=§ compare magnitude. §==§ asks whether the values are the same. §!=§ asks whether they differ. The result is a §bool§, and in the output true is 1 and false is 0.

A single §=§ **assigns**. Two of them compare. The condition §if (score = 12)§ writes the number into the variable and is almost always true. The compiler may warn, but the program is still produced.

>> Do not compare floating-point values directly with §==§. An approximation does not always land exactly, even when the numbers are equal in mathematics. Compare the absolute difference with a small limit.`,
  },
  logic: {
    fi: `**Loogiset operaattorit** yhdistävät totuusarvoja. §&&§ on ja: molempien pitää olla tosia. §||§ on tai: riittää, että toinen on tosi. §!§ kääntää arvon. Sulut tekevät järjestyksen näkyväksi, vaikka kielellä on oma etusijansa.

§&&§ ja §||§ ovat [[oikosulkevia]]. Jos vasen puoli ratkaisee tuloksen, oikeaa puolta ei lasketa. §ptr && ptr->credits§ on turvallinen vain siksi: jos ptr on null, nuolta ei seurata.

>> Älä sekoita näitä bittioperaattoreihin §&§ ja §|§. Yksi merkki toimii biteittäin. Kaksi merkkiä toimii totuusarvoilla. Ehdossa tarvitaan melkein aina kaksi.`,
    en: `**Logical operators** combine truth values. §&&§ is and: both sides must be true. §||§ is or: one true side is enough. §!§ flips a value. Parentheses make the order visible, even though the language has its own precedence.

§&&§ and §||§ are [[short-circuiting]]. If the left side already decides the result, the right side is not evaluated. §ptr && ptr->credits§ is safe only because of that: if ptr is null, the arrow is not followed.

>> Do not mix these up with the bitwise operators §&§ and §|§. One character works on bits. Two characters work on truth values. A condition almost always needs two.`,
  },
  if: {
    fi: `§if§ ajaa lohkon vain, kun ehto on tosi. §else if§ kokeillaan järjestyksessä, ja ensimmäinen tosi haara voittaa. §else§ ei testaa mitään: se ottaa tapaukset, joihin mikään edellinen ehto ei sopinut.

Lohko on **aaltosulkeet**, ei sisennys. Sisennys on ihmiselle. Kääntäjä katsoo sulkeita. Yhden rivin if ilman sulkeita sitoo vain seuraavan lauseen, ja seuraava rivi ajetaan aina. Laita sulkeet joka kertaan.

>> Ehdon pitää olla vertailu tai bool. Kirjoita §score >= 15§, älä pelkkää sijoitusta. Esimerkissä 12 ei yllä 15:een mutta ylittää 10, joten haara on *täydennettävä*.`,
    en: `§if§ runs a block only when the condition is true. §else if§ is tried in order, and the first true branch wins. §else§ tests nothing: it takes the cases no earlier condition matched.

A block is **braces**, not indentation. Indentation is for humans. The compiler looks at the braces. A one-line if without braces binds only the next statement, and the line after that always runs. Put braces every time.

>> The condition must be a comparison or a bool. Write §score >= 15§, not a bare assignment. In the sample, 12 does not reach 15 but it passes 10, so the branch is the middle one.`,
  },
  switch: {
    fi: `§switch§ valitsee haaran **vakion** perusteella. Sopiva tyyppi on §int§, §char§ tai lueteltu tyyppi. Merkkijono tai liukuluku ei kelpaa. Jokainen §case§ on yksi vakioarvo, ei väli eikä vertailu.

[[break]] lopettaa haaran. Ilman sitä suoritus *putoaa* seuraavaan case-haaraan ja ajaa senkin. Se on joskus tahallista, useammin unohdus. §default§ ajetaan, kun mikään case ei täsmää. Se kannattaa kirjoittaa, vaikka se olisi tyhjä.

>> case-nimi ei voi olla muuttuja. Jos valinta riippuu välistä, kuten §score >= 15§, käytä if-lausetta. switch on tasaisille, erillisille arvoille.`,
    en: `§switch§ picks a branch from a **constant**. A suitable type is §int§, §char§ or an enumeration. A string or a floating-point value is not allowed. Each §case§ is one constant value, not a range and not a comparison.

[[break]] ends the branch. Without it, execution *falls through* into the next case and runs that too. That is sometimes deliberate and more often a slip. §default§ runs when no case matches. Write it, even if it is empty.

>> A case label cannot be a variable. If the choice depends on a range, such as §score >= 15§, use an if statement. switch is for flat, separate values.`,
  },
  while: {
    fi: `§while§ testaa ehdon **ennen** runkoa. Jos ehto on heti epätosi, runkoa ei ajeta kertaakaan. §do-while§ ajaa rungon ja testaa **sitten**, joten runko ajetaan vähintään kerran. Siksi valikko kirjoitetaan usein do-while-silmukaksi.

Jokaisella kierroksella jonkin pitää muuttua kohti loppua. Jos §n§ ei pienene, ehto §n > 0§ pysyy totena ja ohjelma ei pääty. Laskuri alustetaan ennen silmukkaa. Alustus rungon sisällä nollaisi sen joka kierroksella.

>> Esimerkki tulostaa 3, 2 ja 1, koska testi on ennen tulostusta ja n pienenee. Sen jälkeen do-while tulostaa yhden kierroksen, vaikka ehto §round < 1§ on jo epätosi testin hetkellä.`,
    en: `§while§ tests the condition **before** the body. If the condition is already false, the body never runs. §do-while§ runs the body and tests **after**, so the body runs at least once. That is why a menu is often a do-while loop.

Something must move toward the end on every round. If §n§ does not shrink, the condition §n > 0§ stays true and the program never ends. The counter is initialized before the loop. Initializing it inside the body would reset it every round.

>> The sample prints 3, 2 and 1, because the test is before the print and n shrinks. After that, do-while prints one round even though the condition §round < 1§ is already false when it is tested.`,
  },
  for: {
    fi: `§for§ kokoaa kolme osaa otsikkoon: alustus, testi ja askel. Alustus ajetaan kerran. Testi ajetaan ennen jokaista kierrosta. Askel ajetaan kierroksen jälkeen. §for (int i = 1; i <= 3; i++)§ on sama työ kuin while, mutta laskuri näkyy yhdessä paikassa.

[[Aluepohjainen for]] §for (int score : scores)§ käy taulukon arvot ilman indeksiä. Sitä käytetään, kun paikkaa ei tarvitse tietää. Indeksiä tarvitaan, jos kirjoitat taulukkoon tai vertaat viereisiä alkioita.

>> Ehto §i < n§ käy paikat 0…n-1. §i <= n§ lukee yhden paikan taulukon ulkopuolelta. Laskuri, joka on luotu for-otsikossa, ei ole olemassa silmukan jälkeen.`,
    en: `§for§ gathers three parts into the header: setup, test and step. The setup runs once. The test runs before every round. The step runs after the round. §for (int i = 1; i <= 3; i++)§ is the same job as while, but the counter is visible in one place.

A [[range-based for]] §for (int score : scores)§ walks the values of an array without an index. Use it when you do not need the place. You need the index if you write into the array or compare neighbouring items.

>> The test §i < n§ visits places 0…n-1. §i <= n§ reads one place past the array. A counter created in the for header does not exist after the loop.`,
  },
  jump: {
    fi: `§break§ poistuu **koko** silmukasta heti. §continue§ ohittaa vain tämän kierroksen loput lauseet. for-silmukassa continue ei ohita askelta: §i++§ ajetaan silti, ja seuraava kierros alkaa uudella indeksillä.

break kuuluu myös switch-haaraan. Jos switch on silmukan sisällä, break lopettaa vain switchin. Silmukasta poistumiseen tarvitaan oma break, lippumuuttuja tai funktion return.

>> Esimerkki ohittaa luvun 2 ja lopettaa, kun i on 4. Tulosteeseen jää 1 ja 3. Lukua 5 ei ehditä käsitellä, koska break päätti silmukan jo aiemmin.`,
    en: `§break§ leaves the **whole** loop at once. §continue§ skips only the remaining statements of this round. In a for loop, continue does not skip the step: §i++§ still runs, and the next round starts with the new index.

break also belongs in a switch branch. If the switch is inside a loop, break ends only the switch. Leaving the loop needs its own break, a flag variable or a return from the function.

>> The sample skips the number 2 and stops when i is 4. The output keeps 1 and 3. The number 5 is never handled, because break already ended the loop.`,
  },
  arrays: {
    fi: `**Taulukko** on monta saman tyypin arvoa peräkkäin muistissa. §int scores[4]§ varaa neljä int-arvoa. Koko on käännösaikainen vakio. Indeksi alkaa nollasta, joten viimeinen kelvollinen paikka on §3§, ei 4.

Paikka §scores[4]§ on jo taulukon ulkopuolella. Kääntäjä ei aina huomaa sitä. Sinne kirjoittaminen sotkee viereisen muistin, ja ohjelma voi kaatua myöhemmin toisella rivillä. Ehto on §i < count§.

>> Taulukko ei kuljeta pituuttaan mukana, kun sen antaa funktiolle. Vie §count§ omana parametrinaan. Jos pituuden pitää kasvaa ajossa, kurssin seuraava askel on §std::vector§.`,
    en: `An **array** is many values of the same type, one after another in memory. §int scores[4]§ reserves four ints. The size is a compile-time constant. The index starts at zero, so the last valid place is §3§, not 4.

The place §scores[4]§ is already outside the array. The compiler does not always notice. Writing there corrupts neighbouring memory, and the program may crash later on another line. The test is §i < count§.

>> An array does not carry its length when you pass it to a function. Pass §count§ as its own parameter. If the length must grow at run time, the next step on the course is §std::vector§.`,
  },
  string: {
    fi: `§std::string§ on oikea **merkkijono**. Se varaa muistin, kasvaa ja vapauttaa sen itse. §char name[20]§ on eri työkalu: kiinteä taulukko, jonka lopussa pitää olla nollatavu. Kurssilla teksti kirjoitetaan string-tyyppinä, ellei tehtävä erikseen vaadi char-taulukkoa.

§+§ ja §+=§ liittävät tekstiä. Ne eivät laske lukuja yhteen, kun molemmat puolet ovat merkkijonoja. Luku liitetään tekstiksi funktiolla §std::to_string§. §size()§ on merkkien määrä tässä toteutuksessa. §substr(0, 5)§ ottaa alun, eikä loppupaikka kuulu mukaan.

>> §std::getline(std::cin, line)§ lukee kokonaisen rivin, myös välilyönnit. §cin >>§ pysähtyy välilyöntiin. Älä sekoita niitä peräkkäin ilman, että tiedät mitä syötepuskuriin jäi.`,
    en: `§std::string§ is a real **string**. It reserves memory, grows and frees it itself. §char name[20]§ is a different tool: a fixed array that must end with a zero byte. On this course, text is a string unless the task explicitly asks for a char array.

§+§ and §+=§ join text. They do not add numbers when both sides are strings. A number is joined as text with §std::to_string§. §size()§ is the number of characters in this implementation. §substr(0, 5)§ takes the start, and the end index is not included.

>> §std::getline(std::cin, line)§ reads a whole line, spaces included. §cin >>§ stops at a space. Do not mix them one after another unless you know what was left in the input buffer.`,
  },
  functions: {
    fi: `**Funktio** erottaa yhden tehtävän omaksi nimettyyn lohkoon. Palautustyyppi kirjoitetaan nimen eteen. §void§ ei palauta arvoa. §return§ lähettää arvon ja lopettaa funktion heti.

[[Arvoparametri]] on **kopio**. Funktion sisällä tehty sijoitus ei näy kutsujalle. [[Viittausparametri]] §int&§ on sama muuttuja uudella nimellä: sijoitus muuttaa kutsujaa. §const int&§ on lukuoikeus ilman kopiota. Sitä kautta ei saa sijoittaa.

>> Kopio on oletus ja turvallisin valinta pienelle luvulle. Käytä viittausta, kun funktion pitää muuttaa kutsujan dataa tai kun tietue on turhan suuri kopioitavaksi. Esimerkissä §area§ saa kopiot ja §add§ muuttaa credits-muuttujaa.`,
    en: `A **function** sets one job aside in its own named block. The return type is written before the name. §void§ returns no value. §return§ sends a value and ends the function at once.

A [[value parameter]] is a **copy**. An assignment inside the function is not visible to the caller. A [[reference parameter]] §int&§ is the same variable under a new name: an assignment changes the caller. §const int&§ is read access without a copy. You cannot assign through it.

>> A copy is the default and the safest choice for a small number. Use a reference when the function must change the caller's data, or when a record is needlessly large to copy. In the sample, §area§ receives copies and §add§ changes the credits variable.`,
  },
  struct: {
    fi: `[[Struct]] eli **tietue** kokoaa yhteen kuuluvat kentät yhdeksi tyypiksi. §Student§ ei ole kaksi erillistä muuttujaa vaan yksi arvo, jolla on nimi ja opintopisteet. Kenttään pääsee pisteellä: §student.credits§.

Tietue kannattaa pitää datana. Toiminto, kuten pisteiden lisääminen, on funktio tietueen vieressä ja saa tietueen viittauksena. Silloin kutsujan olio muuttuu. Arvona viety tietue olisi kopio, ja lisäys katoaisi funktion päättyessä.

>> §Student student{"Aino", 55}§ täyttää kentät määritysjärjestyksessä. Osoittimen kautta samaan kenttään mennään nuolella §pointer->credits§. Nuoli on sama asia kuin §(*pointer).credits§.`,
    en: `A [[struct]], a **record**, groups fields that belong together into one type. §Student§ is not two separate variables but one value that has a name and a credit count. A field is reached with a dot: §student.credits§.

Keep the record as data. An operation, such as adding credits, is a function beside the record and receives the record by reference. Then the caller's object changes. A record passed by value would be a copy, and the addition would disappear when the function returns.

>> §Student student{"Aino", 55}§ fills the fields in declaration order. Through a pointer the same field uses an arrow, §pointer->credits§. The arrow is the same thing as §(*pointer).credits§.`,
  },
  modules: {
    fi: `Iso ohjelma jaetaan **rajapintaan** ja **toteutukseen**. Rajapinta on otsikkotiedosto §.h§: tyypit ja funktioiden nimet, ei niiden runkoa. Toteutus on §.cpp§. Käyttäjä, yleensä §main.cpp§, näkee vain otsikon.

§#pragma once§ estää saman otsikon liittämisen kahdesti, mikä muuten aiheuttaisi määritelmän kahteen kertaan. Otsikkoon ei kuulu tulostus eikä main. Kun toteutus muuttuu mutta nimet pysyvät, kutsujia ei tarvitse kirjoittaa uusiksi.

>> Käännä jokainen toteutus ja linkitä ne yhteen: §g++ opiskelija.cpp main.cpp -o ohjelma§. Esimerkki näyttää kolme tiedostoa peräkkäin, jotta rajapinta ja toteutus mahtuvat samaan ruutuun. Oikeassa työssä ne ovat erillisiä tiedostoja.`,
    en: `A large program is split into an **interface** and an **implementation**. The interface is the header §.h§: the types and the names of the functions, not their bodies. The implementation is the §.cpp§. The caller, usually §main.cpp§, sees only the header.

§#pragma once§ stops the same header from being included twice, which would otherwise define the same name twice. Printing and main do not belong in the header. When the implementation changes but the names stay, the callers do not have to be rewritten.

>> Compile each implementation and link them: §g++ opiskelija.cpp main.cpp -o ohjelma§. The sample shows three files one after another so the interface and the implementation fit on one screen. In a real project they are separate files.`,
  },
  project: {
    fi: `**Harjoitustyö** kokoaa kurssin yhdeksi ohjelmaksi. Tietue kuvaa opiskelijan. Taulukko pitää ryhmän. Funktio §addCredits§ muuttaa yhtä opiskelijaa viittauksen kautta. Funktio §average§ lukee koko taulukon eikä muuta sitä, siksi parametri on §const§.

Taulukko muuttuu funktion parametrina osoittimeksi, eikä pituus kulje mukana. Siksi §average§ saa myös §count§-parametrin. Valikko on §do-while§, koska kysymys näytetään vähintään kerran. Komento §l§ tulostaa listan, §q§ lopettaa, ja tuntematon komento menee cerr-virtaan.

>> Kirjaimet l ja q tulosteessa ovat käyttäjän syötettä. Laajenna työtä vasta, kun tämä versio kääntyy ja vastaa komentoihin: lisää opiskelija, kysy pisteet cinillä ja siirrä keskiarvo omaan otsikkoonsa.`,
    en: `The **exercise** gathers the course into one program. A record describes a student. An array holds the group. The function §addCredits§ changes one student through a reference. The function §average§ reads the whole array and does not change it, so the parameter is §const§.

As a function parameter an array becomes a pointer, and the length does not travel with it. That is why §average§ also receives a §count§ parameter. The menu is a §do-while§, because the question is shown at least once. Command §l§ prints the list, §q§ quits, and an unknown command goes to cerr.

>> The letters l and q in the output are what the user types. Extend the work only after this version compiles and answers the commands: add a student, ask for the points with cin, and move the average into its own header.`,
  },
  vector: {
    fi: `§std::vector§ on taulukko, jonka pituus saa muuttua ajossa. Se on oikea valinta, kun kurssin kiinteä §int scores[4]§ loppuu kesken. §push_back§ lisää loppuun ja kasvattaa varausta tarvittaessa. §size()§ on alkioiden määrä juuri nyt.

Indeksi alkaa yhä nollasta. §[]§ ei tarkista rajoja. §at()§ tarkistaa ja heittää poikkeuksen, jos indeksi on yli. Harjoituksissa §at§ tekee virheestä näkyvän. Nopeassa silmukassa, kun indeksi on jo testattu, §[]§ riittää.

>> vector sisältyy otsikkoon §<vector>§. Ilman include-riviä nimi ei löydy. For-silmukka §for (int score : scores)§ käy arvot ilman indeksiä, kun et tarvitse paikkaa.`,
    en: `§std::vector§ is an array whose length may change at run time. It is the right choice when the course's fixed §int scores[4]§ is not enough. §push_back§ appends and grows the storage when needed. §size()§ is the number of items right now.

The index still starts at zero. §[]§ does not check the bounds. §at()§ checks and throws if the index is out of range. In exercises §at§ makes the mistake visible. In a tight loop, when the index is already tested, §[]§ is enough.

>> vector lives in the header §<vector>§. Without the include, the name is not found. The loop §for (int score : scores)§ walks the values without an index, when you do not need the place.`,
  },
  pointers: {
    fi: `**Osoitin** säilyttää muistiosoitteen, ei itse arvoa. §&value§ antaa muuttujan osoitteen. §*pointer§ lukee tai kirjoittaa sen osoitteen päässä olevan arvon. Esimerkissä §*pointer = 8§ muuttaa value-muuttujan, koska osoitin osoittaa siihen.

Alustamaton osoitin ei ole [[nullptr]]. Se sisältää roskaosoitteen, ja sen lukeminen on määrittelemätöntä. Alusta heti: joko oikealla osoitteella tai arvolla §nullptr§, joka tarkoittaa että osoitin ei osoita mihinkään. nullptr-osoitinta ei saa lukea.

>> Viittaus hoitaa saman tarpeen turvallisemmin, kun osoitteen ei tarvitse vaihtua eikä se saa olla tyhjä. Osoitin tarvitaan, kun muisti varataan itse tai kun osoite voi puuttua. Älä käytä osoitinta sen jälkeen, kun muisti on vapautettu.`,
    en: `A **pointer** holds a memory address, not the value itself. §&value§ gives a variable's address. §*pointer§ reads or writes the value at that address. In the sample, §*pointer = 8§ changes the variable value, because the pointer points at it.

An uninitialized pointer is not [[nullptr]]. It holds a garbage address, and reading it is undefined. Initialize it at once: either with a real address or with §nullptr§, which means the pointer points nowhere. A nullptr pointer must not be read.

>> A reference does the same job more safely when the address must not change and must not be empty. A pointer is needed when you reserve the memory yourself or when the address may be missing. Do not use a pointer after the memory has been freed.`,
  },
  pitfalls: {
    fi: `Kolme virhettä menee käännöksestä läpi ja tuottaa silti väärän ohjelman. **Kokonaisjakolasku** §7 / 2§ on 3. Jos halusit 3.5, toisen operandin pitää olla liukuluku. **Taulukon raja** §i <= count§ lukee yhden paikan liikaa. **Sijoitus ehdossa** §if (n = 0)§ nollaa muuttujan ja tekee ehdosta epätoden.

§int a[3]§ ei kerro pituuttaan funktiolle. Kääntäjä ei estä liian suurta indeksiä, jos indeksi on muuttuja. Vie pituus mukana tai käytä vectoria ja §at§-kutsua.

>> Paikallinen §int§ ilman alkuarvoa ei ole nolla. Tulosta se, ja näet milloin mitäkin. Anna alkuarvo samalla rivillä, jolla muuttuja syntyy.`,
    en: `Three mistakes compile and still produce the wrong program. **Integer division** §7 / 2§ is 3. If you wanted 3.5, one operand has to be floating-point. An **array bound** §i <= count§ reads one place too far. An **assignment in a condition** §if (n = 0)§ zeroes the variable and makes the condition false.

§int a[3]§ does not tell a function its length. The compiler does not stop an index that is too large when the index is a variable. Pass the length along, or use vector and §at§.

>> A local §int§ without an initial value is not zero. Print it and you will see whatever happens to be there. Give the initial value on the same line that creates the variable.`,
  },
  syntax: {
    fi: `**Syntaksi** on kielen kielioppi. Ohjelmalla on tasan yksi §main§, josta suoritus alkaa. Lause päättyy puolipisteeseen. Lohko on aaltosulkeet, ja sen sisällä luodut nimet eivät näy ulkopuolelle.

Välilyönnit, sisennykset ja rivinvaihdot ovat ihmiselle. Kääntäjä ei välitä niistä. Isot ja pienet kirjaimet välittävät: §Credits§ ja §credits§ ovat eri nimiä. §#include <iostream>§ liittää tulostukseen tarvittavan kirjaston ennen kuin käännös varsinaisesti alkaa.

>> Unohtunut puolipiste ilmoitetaan usein **seuraavalla** rivillä, koska kääntäjä huomaa virheen vasta kun seuraava sana ei sovi jatkoksi. Korjaa ensimmäinen virhe ja käännä uudestaan.`,
    en: `**Syntax** is the grammar of the language. A program has exactly one §main§, where execution starts. A statement ends with a semicolon. A block is a pair of braces, and names created inside it are not visible outside.

Spaces, indentation and line breaks are for humans. The compiler does not care about them. Capital and small letters do matter: §Credits§ and §credits§ are different names. §#include <iostream>§ pulls in the library printing needs before compilation proper begins.

>> A forgotten semicolon is often reported on the **next** line, because the compiler notices only when the next word does not fit as a continuation. Fix the first error and compile again.`,
  },
  output: {
    fi: `[[std::cout]] on ohjelman tavallinen tuloste. §<<§ työntää virtaan tekstin tai luvun. Merkkiyhdistelmä kenoviiva ja n vaihtaa riviä. Ilman sitä seuraava tuloste jatkaa samalta riviltä.

Teksti kirjoitetaan lainausmerkeillä. Luku ja muuttuja kirjoitetaan ilman lainausmerkkejä, koska muuten tulostuisi nimi eikä arvo. Useita §<<§-merkkejä saa ketjuttaa: ensin sana, sitten luku, sitten rivinvaihto.

>> [[std::cerr]] on toinen kirjoitusvirta virheilmoituksille. Käyttäjä voi ohjata cout-virran tiedostoon ja jättää cerr-virran näkyviin. Älä sekoita tulosta ja virhettä samaan virtaan.`,
    en: `[[std::cout]] is the program's ordinary output. §<<§ pushes text or a number into the stream. The pair of a backslash and n breaks the line. Without it the next print continues on the same line.

Text is written in quotes. A number and a variable are written without quotes, because otherwise the name would be printed instead of the value. Several §<<§ marks may be chained: first a word, then a number, then a newline.

>> [[std::cerr]] is a second output stream for errors. A user can send the cout stream to a file and leave cerr visible. Do not mix the result and the error on the same stream.`,
  },
  comments: {
    fi: `**Kommentti** on tekstiä kääntäjälle ohitettavaksi. §//§ alkaa ja päättyy rivin loppuun. §/*§ ja §*/§ rajaavat alueen, joka saa jatkua usealle riville. Kommentin sisällä olevaa koodia ei käännetä eikä ajeta.

Hyvä kommentti kertoo *miksi* rivi on olemassa, ei toista mitä koodi jo sanoo. Vanhentunut kommentti on vaarallisempi kuin puuttuva, koska lukija uskoo sitä. Poista kommentti, kun koodi muuttuu.

>> Kesken jäänyt §/*§ syö kaiken seuraavaan §*/§-merkkiin asti, myös oikeaa koodia. Jos ohjelmasta katoaa puoli tiedostoa, etsi avoin kommentti.`,
    en: `A **comment** is text the compiler skips. §//§ starts one and it ends at the end of the line. §/*§ and §*/§ wrap a region that may span several lines. Code inside a comment is neither compiled nor run.

A good comment says *why* the line exists, it does not repeat what the code already says. A stale comment is more dangerous than a missing one, because the reader trusts it. Remove the comment when the code changes.

>> An unclosed §/*§ swallows everything up to the next §*/§, including real code. If half the file disappears from the program, look for an open comment.`,
  },
  variables: {
    fi: `**Muuttuja** yhdistää nimen, tyypin ja muistipaikan. §int credits = 55§ luo paikan ja kirjoittaa sinne alkuarvon. Myöhempi §credits = 60§ kirjoittaa saman paikan päälle. Vanhaa arvoa ei jää talteen, ellei sitä kopioida toiseen nimeen.

§const§ on lupaus kääntäjälle: tätä nimeä ei sijoiteta uudestaan. Yritys §goal = 40§ ei käänny. Itse luku ei ole taianomaisesti suojattu, jos annat sen funktion viittausparametrille ilman const-määrettä.

>> Anna alkuarvo samalla rivillä, jolla muuttuja syntyy. Alustamaton paikallinen §int§ ei ole nolla. Siinä on mitä pinossa sattui olemaan, ja ohjelma voi tulostaa eri luvun joka ajolla.`,
    en: `A **variable** joins a name, a type and a place in memory. §int credits = 55§ creates the place and writes an initial value there. A later §credits = 60§ writes over the same place. The old value is not kept unless you copy it to another name.

§const§ is a promise to the compiler: this name is not assigned again. The attempt §goal = 40§ does not compile. The number itself is not magically protected if you pass it to a function as a reference without const.

>> Give the initial value on the same line that creates the variable. An uninitialized local §int§ is not zero. It holds whatever happened to be on the stack, and the program may print a different number every run.`,
  },
  booleans: {
    fi: `§bool§ säilyttää vain kaksi arvoa: §true§ ja §false§. Vertailu, kuten §55 >= 30§, tuottaa boolin. Ehto if-lauseessa ja silmukassa on bool, vaikka kirjoittaisit sinne luvun: nolla on epätosi ja muut luvut tosia.

Oletuksena tuloste näyttää toden lukuna 1 ja epätoden lukuna 0. §std::boolalpha§ vaihtaa saman virran tulosteen sanoiksi. Asetus jää voimaan seuraaviin tulosteisiin samassa virrassa.

>> Älä tallenna totuusarvoa int-muuttujaan. bool kertoo lukijalle, että luku ei ole määrä vaan kyllä tai ei. Seuraava sivu, vertailu, näyttää miten bool syntyy operaattorista.`,
    en: `§bool§ stores only two values: §true§ and §false§. A comparison, such as §55 >= 30§, produces a bool. The condition of an if or a loop is a bool, even if you write a number there: zero is false and every other number is true.

By default the output shows true as the number 1 and false as 0. §std::boolalpha§ switches that stream's output to words. The setting stays in force for later prints on the same stream.

>> Do not store a truth value in an int. A bool tells the reader that the value is not a quantity but a yes or a no. The next page, comparison, shows how a bool is born from an operator.`,
  },
  math: {
    fi: `Peruslaskut §+ - * / %§ ovat operaattoreita, eivät funktiokutsuja. Kulmat, juuret ja pyöristys tulevat otsikosta §<cmath>§. §std::sqrt§ palauttaa neliöjuuren, §std::pow§ potenssin ja §std::round§ lähimmän kokonaisluvun. Kaikki kolme palauttavat §double§-luvun.

§std::min§ ja §std::max§ eivät ole cmath-otsikossa. Ne tulevat otsikosta §<algorithm>§. Ne vertaavat kahta saman tyypin arvoa ja palauttavat pienemmän tai suuremman. Ne eivät muuta argumenttejaan.

>> §std::pow(2, 3)§ on 8, mutta tyyppi on double, joten jatkossa lasku voi näyttää desimaalin. Jos tarvitset kokonaisluvun, pyöristä tai laske potenssi itse kokonaisilla kertolaskuilla.`,
    en: `The basic operations §+ - * / %§ are operators, not function calls. Roots, powers and rounding come from the header §<cmath>§. §std::sqrt§ returns a square root, §std::pow§ a power and §std::round§ the nearest integer. All three return a §double§.

§std::min§ and §std::max§ are not in the cmath header. They come from §<algorithm>§. They compare two values of the same type and return the smaller or the larger. They do not change their arguments.

>> §std::pow(2, 3)§ is 8, but the type is double, so a later calculation may show a fraction. If you need an integer, round it or compute the power yourself with integer multiplications.`,
  },
  enums: {
    fi: `**Enum** nimeää pienen, suljetun joukon arvoja. §enum class Mark§ tekee tyypin, jonka arvot ovat §Mark::failed§, §Mark::passed§ ja §Mark::excellent§. Muu luku ei ole tätä tyyppiä, joten vahingossa syötetty 2 ei käänny vertailuksi ilman muunnosta.

§enum class§ pitää nimet tyypin takana. Tavallinen §enum§ ilman class-sanaa tuo nimet suoraan ympäröivään lohkoon, jossa ne voivat törmätä toiseen funktioon tai muuttujaan. Kurssilla käytetään enum classia.

>> Enum ei tulostu sanana itsestään. Jos haluat tekstin ruudulle, kirjoita if tai switch, joka tulostaa sanan. Esimerkki tulostaa *lapi*, kun arvo on §Mark::passed§.`,
    en: `An **enum** names a small, closed set of values. §enum class Mark§ makes a type whose values are §Mark::failed§, §Mark::passed§ and §Mark::excellent§. Any other number is not of this type, so a stray 2 does not compile as a comparison without a cast.

§enum class§ keeps the names behind the type. A plain §enum§ without the word class drops the names straight into the surrounding block, where they can collide with another function or variable. This course uses enum class.

>> An enum does not print as a word by itself. If you want text on the screen, write an if or a switch that prints the word. The sample prints *lapi* when the value is §Mark::passed§.`,
  },
  references: {
    fi: `**Viittaus** on toinen nimi jo olemassa olevalle muuttujalle. §int& alias = credits§ ei varaa uutta paikkaa. Sijoitus aliaksen kautta kirjoittaa credits-muuttujaan. Viittausta ei voi myöhemmin siirtää toiseen muuttujaan, eikä se voi olla tyhjä.

Funktion parametri §int&§ on sama asia rajapinnassa. Kutsu §add(credits, 5)§ ei kopioi credits-muuttujaa, vaan antaa funktiolle nimen samaan paikkaan. Parametri ilman &-merkkiä olisi kopio, ja lisäys katoaisi funktion päättyessä.

>> §const int&§ on lukuoikeus ilman kopiota. Sitä kautta ei saa sijoittaa. Käytä sitä, kun viet ison tietueen funktiolle etkä halua sen muuttuvan. Pieni §int§ kannattaa yhä viedä kopiona, ellei funktio nimenomaan muuta sitä.`,
    en: `A **reference** is another name for a variable that already exists. §int& alias = credits§ does not reserve a new place. An assignment through the alias writes into the variable credits. A reference cannot later be moved to another variable, and it cannot be empty.

A function parameter §int&§ is the same idea in an interface. The call §add(credits, 5)§ does not copy credits, it gives the function a name for the same place. A parameter without & would be a copy, and the addition would disappear when the function returns.

>> §const int&§ is read access without a copy. You cannot assign through it. Use it when you pass a large record to a function and you do not want it to change. A small §int§ is still worth passing by copy, unless the function is specifically meant to change it.`,
  },
  memory: {
    fi: `Tavallinen muuttuja elää **pinossa**. Se syntyy lohkon alussa ja katoaa lohkon päättyessä. §new§ varaa muistin **keosta** ja palauttaa osoittimen. Keon muisti ei katoa itsestään. §delete§ vapauttaa sen.

§int* credits = new int(55)§ luo yhden int-arvon kekoon. §*credits§ lukee sen. Yksi §delete credits§ riittää. Toinen delete samaan osoitteeseen on määrittelemätöntä käytöstä. Sijoita sen jälkeen §nullptr§, jotta vanhaa osoitetta ei seurata vahingossa.

>> Taulukko varataan muodossa §new int[n]§ ja vapautetaan §delete[]§-operaattorilla. Pelkkä delete ei vapauta taulukkoa oikein. Jos koko muuttuu ajossa, §std::vector§ tekee saman työn ilman delete-kutsua. Käytä new-operaattoria vasta, kun vector ei ole käytössä.`,
    en: `An ordinary variable lives on the **stack**. It is created at the start of the block and disappears when the block ends. §new§ reserves memory on the **heap** and returns a pointer. Heap memory does not disappear by itself. §delete§ frees it.

§int* credits = new int(55)§ creates one int on the heap. §*credits§ reads it. One §delete credits§ is enough. A second delete on the same address is undefined behaviour. Assign §nullptr§ afterwards, so the old address is not followed by accident.

>> An array is reserved as §new int[n]§ and freed with §delete[]§. A plain delete does not free an array correctly. If the size changes at run time, §std::vector§ does the same job without a delete call. Use new only when vector is not available.`,
  },
};
