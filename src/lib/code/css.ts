import type { Language } from "./types";

const css: Language = {
  id: "css",
  name: "CSS",
  short: "CSS",
  runnable: false,
  blurb: {
    fi: "Sivun ulkoasu. CSS valitsee elementin ja kertoo, miltä se näyttää.",
    en: "The look of a page. CSS selects an element and says how it looks.",
  },
  run: {
    fi: "Tallenna tiedosto.css ja lisää HTML-sivun head-osaan link-tunniste, jonka href osoittaa siihen.",
    en: "Save tiedosto.css and add a link tag in the HTML head whose href points at it.",
  },
  lessons: [
    {
      id: "saanto",
      topic: "perusteet",
      title: { fi: "Sääntö", en: "A rule" },
      blurb: {
        fi: "Valitsin nimeää elementit. Aaltosulkeissa ominaisuus ja arvo erotetaan kaksoispisteellä.",
        en: "A selector names the elements. Inside the braces a property and a value are separated by a colon.",
      },
      points: [
        { fi: "Rivi loppuu puolipisteeseen.", en: "A line ends with a semicolon." },
        { fi: "p { } koskee jokaista kappaletta.", en: "p { } applies to every paragraph." },
      ],
      file: "saanto.css",
      code: `p {
  color: #1c1917;
  font-size: 1.125rem;
}

h1 {
  font-size: 2rem;
}`,
      theory: {
        fi: `**Sääntö** on valitsin ja lohko. Valitsin §p§ tarkoittaa jokaista kappaletta. Lohkon sisällä jokainen rivi on yksi päätös: ominaisuuden nimi, kaksoispiste, arvo ja puolipiste.

CSS ei lisää sisältöä. Se vain muuttaa HTML-elementin ulkoasua. Jos kappaletta ei ole HTML:ssä, sääntö ei näy missään. Linkitä tyylitiedosto sivun §head§-osassa: §<link rel="stylesheet" href="saanto.css">§.

>> Kirjoita yksi ominaisuus rivilleen. Selain ei välitä rivinvaihdoista, mutta ihminen löytää puuttuvan puolipisteen nopeammin.`,
        en: `A **rule** is a selector and a block. The selector §p§ means every paragraph. Inside the block each line is one decision: the property name, a colon, the value and a semicolon.

CSS does not add content. It only changes how an HTML element looks. If the paragraph is not in the HTML, the rule shows up nowhere. Link the stylesheet from the page's §head§: §<link rel="stylesheet" href="saanto.css">§.

>> Put one property on its own line. The browser does not care about line breaks, but a person finds a missing semicolon faster.`,
      },
      tags: ["css", "selector", "property", "sääntö", "valitsin"],
    },
    {
      id: "vari",
      topic: "perusteet",
      title: { fi: "Väri", en: "Color" },
      blurb: {
        fi: "color on tekstin väri. background on tausta. #RRGGBB on kolme tavua: punainen, vihreä ja sininen.",
        en: "color is the text color. background is the background. #RRGGBB is three bytes: red, green and blue.",
      },
      points: [
        { fi: "#000000 on musta ja #ffffff on valkoinen.", en: "#000000 is black and #ffffff is white." },
        { fi: "Kolmen merkin #3a7 on sama kuin #33aa77.", en: "The three-character #3a7 is the same as #33aa77." },
      ],
      file: "vari.css",
      code: `body {
  background: #f5f0e8;
  color: #1c1917;
}

strong {
  color: #9a3412;
}`,
      theory: {
        fi: `**Väri** kirjoitetaan usein heksana. §#3A7BD5§ on kolme kanavaa: §3A§ punaista, §7B§ vihreää ja §D5§ sinistä. Heksa on [[kantaluku 16|bases]]. Jokainen kanava on 8 bittiä, joten eri arvoja on [[256|address]].

Samat luvut voi lukea myös kymmenkantaisina. [[RGB-muunnin|color]] muuttaa heksan muotoon R, G ja B väliltä 0–255. §color§ maalaa kirjaimet. §background§ maalaa laatikon taustan.

>> Älä jätä tekstin ja taustan kontrastia arvauksen varaan. Musta teksti vaalealla pohjalla on varma alku. Väri ei korvaa otsikon rakennetta.`,
        en: `A **color** is often written as hex. §#3A7BD5§ is three channels: §3A§ of red, §7B§ of green and §D5§ of blue. Hex is [[base 16|bases]]. Each channel is 8 bits, so there are [[256 different values|address]].

The same numbers can be read in base 10. The [[RGB converter|color]] turns the hex into R, G and B from 0 to 255. §color§ paints the letters. §background§ paints the box behind them.

>> Do not guess the contrast between text and background. Black text on a light background is a safe start. Color does not replace the heading structure.`,
      },
      tags: ["color", "background", "hex", "rgb", "väri"],
    },
    {
      id: "laatikko",
      topic: "rakenne",
      title: { fi: "Laatikko", en: "The box" },
      blurb: {
        fi: "Jokainen elementti on laatikko. Sisältö, täyte, reunus ja marginaali ovat eri kerroksia.",
        en: "Every element is a box. Content, padding, border and margin are different layers.",
      },
      points: [
        { fi: "padding on laatikon sisällä, margin sen ulkopuolella.", en: "padding is inside the box, margin is outside it." },
        { fi: "margin yhdistyy viereisen kappaleen marginaaliin.", en: "A margin collapses with the next paragraph's margin." },
      ],
      file: "laatikko.css",
      code: `section {
  padding: 1rem;
  border: 1px solid #d6d3d1;
  margin-bottom: 1rem;
}`,
      theory: {
        fi: `**Laatikkomalli** on neljä kerrosta. Keskellä on sisältö, kuten teksti. §padding§ on tyhjää sisällön ja reunuksen välissä. §border§ on viiva. §margin§ on tyhjää tämän laatikon ja seuraavan laatikon välissä.

§padding: 1rem§ asettaa saman täytteen joka reunalle. Neljä arvoa järjestyksessä ovat ylä, oikea, ala ja vasen. Reunus tarvitsee leveyden, tyylin ja värin: §1px solid #d6d3d1§.

>> Marginaali ei ole taustan sisällä. Jos laatikolla on taustaväri, se täyttää täytteen mutta ei marginaalia. Siksi väli kahden värillisen laatikon välissä näyttää sivun taustaa.`,
        en: `The **box model** is four layers. In the middle is the content, such as text. §padding§ is empty space between the content and the border. §border§ is the line. §margin§ is empty space between this box and the next box.

§padding: 1rem§ sets the same padding on every side. Four values, in order, are top, right, bottom and left. A border needs a width, a style and a color: §1px solid #d6d3d1§.

>> Margin is not inside the background. If a box has a background color, it fills the padding but not the margin. That is why the gap between two colored boxes shows the page background.`,
      },
      tags: ["margin", "padding", "border", "box", "laatikko"],
    },
    {
      id: "yksikot",
      topic: "perusteet",
      title: { fi: "Yksiköt", en: "Units" },
      blurb: {
        fi: "px on näyttöpikseli. rem on juurielementin fontin koko. % on osuus vanhemmasta elementistä.",
        en: "px is a screen pixel. rem is the root element's font size. % is a share of the parent element.",
      },
      points: [
        { fi: "1rem on yleensä 16px, kunnes juuren fonttia muutetaan.", en: "1rem is usually 16px, until the root font is changed." },
        { fi: "Leveyden 50% laskee vanhemman leveydestä, ei koko näytöstä.", en: "A width of 50% is computed from the parent width, not the whole screen." },
      ],
      file: "yksikot.css",
      code: `html {
  font-size: 100%;
}

h1 {
  font-size: 2rem;
}

.palsta {
  width: 50%;
}`,
      theory: {
        fi: `**Yksikkö** kertoo, mihin mitta vertautuu. §px§ on kiinteä askel näytöllä. §rem§ on §html§-elementin fonttikoko, joten koko sivu skaalautuu, jos lukija suurentaa oletusfonttia.

§%§ on osuus vanhemmasta. Laatikko, jonka leveys on §50%§, on puolet *vanhempansa* leveydestä, ei puolet ikkunasta, jos vanhempi on kapeampi. Osuuden voi tarkistaa [[prosenttilaskusta|percent]].

>> Älä sekoita korkeutta ja leveyttä. Prosenttikorkeus toimii vain, jos vanhemmalla on itse korkeus. Prosenttileveys toimii useammin, koska sivulla on jo leveys.`,
        en: `A **unit** says what a measurement is compared with. §px§ is a fixed step on the screen. §rem§ is the font size of the §html§ element, so the whole page scales if the reader enlarges the default font.

§%§ is a share of the parent. A box whose width is §50%§ is half of its *parent's* width, not half of the window, if the parent is narrower. You can check the share with [[percent calculation|percent]].

>> Do not mix up height and width. A percentage height works only when the parent itself has a height. A percentage width works more often, because the page already has a width.`,
      },
      tags: ["px", "rem", "percent", "yksikkö", "unit"],
    },
    {
      id: "valinta",
      topic: "ohjaus",
      title: { fi: "Mikä sääntö voittaa", en: "Which rule wins" },
      blurb: {
        fi: "Tarkempi valitsin voittaa yleisen. Jos tarkkuus on sama, tiedoston myöhempi sääntö voittaa.",
        en: "A more specific selector beats a general one. If specificity is equal, the later rule in the file wins.",
      },
      points: [
        { fi: ".huomio on tarkempi kuin p.", en: ".huomio is more specific than p." },
        { fi: "Älä käytä !important-sanaa, ellei muuta keinoa ole.", en: "Do not use !important unless nothing else works." },
      ],
      file: "valinta.css",
      code: `p {
  color: #1c1917;
}

p.huomio {
  color: #9a3412;
}`,
      theory: {
        fi: `**Voittava sääntö** valitaan tarkkuudella. Elementin nimi §p§ on väljä. Luokka §.huomio§ on tarkempi, koska se osuu vain elementteihin, joilla on tämä luokka. §p.huomio§ on vielä tarkempi: sen pitää olla kappale *ja* sillä pitää olla luokka.

Jos kaksi sääntöä on yhtä tarkkoja, alempana tiedostossa oleva voittaa. Selain ei sekoita arvoja keskenään. Yksi ominaisuus saa yhden voittavan arvon.

>> §!important§ pakottaa arvon läpi tarkkuuden. Se tekee myöhemmästä korjauksesta vaikean. Korjaa valitsin, älä lisää important-sanaa.`,
        en: `The **winning rule** is chosen by specificity. An element name §p§ is broad. A class §.huomio§ is more specific, because it hits only elements with that class. §p.huomio§ is more specific still: it must be a paragraph *and* it must have the class.

If two rules are equally specific, the one later in the file wins. The browser does not blend the values. One property gets one winning value.

>> §!important§ forces a value past specificity. It makes a later fix hard. Fix the selector. Do not add important.`,
      },
      tags: ["cascade", "specificity", "class", "important", "valitsin"],
    },
    {
      id: "luokka",
      topic: "tieto",
      title: { fi: "Luokka", en: "A class" },
      blurb: {
        fi: "class on nimi, jonka HTML antaa elementille. CSS:ssä luokka alkaa pisteellä.",
        en: "class is a name the HTML gives an element. In CSS a class starts with a dot.",
      },
      points: [
        { fi: "Sama luokka saa olla monella elementillä.", en: "The same class may be on many elements." },
        { fi: "id on yksilöllinen. Sitä ei käytetä tavalliseen tyyliin.", en: "id is unique. It is not used for ordinary styling." },
      ],
      file: "luokka.css",
      code: `.kortti {
  padding: 1rem;
  border: 1px solid #d6d3d1;
}

.kortti h2 {
  margin-top: 0;
}`,
      theory: {
        fi: `**Luokka** on yhteinen nimi. HTML:ssä kirjoitetaan §class="kortti"§. CSS:ssä sama nimi on §.kortti§. Piste kuuluu vain CSS:ään, ei HTML-attribuuttiin.

§.kortti h2§ tarkoittaa otsikkoa, joka on kortin *sisällä*. Väli valitsimessa on tärkeä. §.kortti.h2§ ilman väliä tarkoittaisi elementtiä, jolla on molemmat luokat, eikä sellaista otsikkoa ole.

>> Nimeä luokka asian mukaan, esimerkiksi §kortti§ tai §varoitus§, ei ulkoasun mukaan kuten §punainen-laatikko§. Kun väri muuttuu, nimi ei jää valheeksi.`,
        en: `A **class** is a shared name. In HTML you write §class="kortti"§. In CSS the same name is §.kortti§. The dot belongs only in CSS, not in the HTML attribute.

§.kortti h2§ means a heading that is *inside* a card. The space in the selector matters. §.kortti.h2§ without a space would mean an element that has both classes, and a heading is not that.

>> Name the class by the thing, for example §kortti§ or §varoitus§, not by the look such as §punainen-laatikko§. When the color changes, the name does not become a lie.`,
      },
      tags: ["class", "luokka", "selector", "id"],
    },
    {
      id: "flex",
      topic: "asettelu",
      title: { fi: "Flex", en: "Flex" },
      blurb: {
        fi: "display: flex asettaa lapset riviin tai sarakkeeseen. gap on lasten väli.",
        en: "display: flex lays the children in a row or a column. gap is the space between the children.",
      },
      points: [
        { fi: "flex-direction: column kasaa lapset allekkain.", en: "flex-direction: column stacks the children." },
        { fi: "justify-content säätää pääsuuntaa, align-items sivusuuntaa.", en: "justify-content sets the main direction, align-items the cross direction." },
      ],
      file: "flex.css",
      code: `.rivi {
  display: flex;
  gap: 1rem;
}

.rivi > * {
  flex: 1;
}`,
      theory: {
        fi: `**Flex** muuttaa laatikon lasten asettelun. §display: flex§ laittaa lapset oletuksena vierekkäin. §gap§ on väli heidän välissään. Se ei ole marginaali, joten ensimmäisen lapsen eteen ei tule ylimääräistä tyhjää.

§flex: 1§ lapsella tarkoittaa, että lapset jakavat vapaan tilan tasan. Ilman sitä lapsi on vain sisältönsä levyinen. §flex-direction: column§ kääntää rivin pystysuuntaan.

>> Flex vaikuttaa suoriin lapsiin, ei lapsenlapsiin. Jos väli ei muutu, tarkista että §display: flex§ on sillä elementillä, jonka *sisällä* rivin pitää olla.`,
        en: `**Flex** changes how a box lays out its children. §display: flex§ puts the children side by side by default. §gap§ is the space between them. It is not margin, so there is no extra empty space before the first child.

§flex: 1§ on a child means the children share the free space equally. Without it a child is only as wide as its content. §flex-direction: column§ turns the row vertical.

>> Flex affects the direct children, not the grandchildren. If the gap does not change, check that §display: flex§ is on the element *inside which* the row should be.`,
      },
      tags: ["flex", "gap", "display", "asettelu", "layout"],
    },
    {
      id: "valitsimet",
      topic: "perusteet",
      title: { fi: "Valitsimet", en: "Selectors" },
      blurb: {
        fi: "Valitsin rajaa, mihin elementteihin sääntö osuu: nimi, luokka, lapsi, näennäisluokka.",
        en: "A selector limits which elements a rule hits: a name, a class, a child, a pseudo-class.",
      },
      points: [
        { fi: "Väli tarkoittaa jälkeläistä. > tarkoittaa suoraa lasta.", en: "A space means a descendant. > means a direct child." },
        { fi: ":hover on hiiri elementin päällä. :focus on näppäimistön kohde.", en: ":hover is the pointer over the element. :focus is the keyboard target." },
      ],
      file: "valitsimet.css",
      code: `nav a {
  color: #1c1917;
}

nav > a {
  font-weight: 600;
}

a:hover,
button:focus {
  outline: 2px solid #9a3412;
}`,
      theory: {
        fi: `**Valitsin** on osoite elementtiin. §nav a§ osuu jokaiseen linkkiin, joka on nav-alueen sisällä, vaikka välissä olisi lista. §nav > a§ osuu vain linkkiin, joka on navin suora lapsi. Merkki §>§ on se ero.

Näennäisluokka alkaa kaksoispisteellä. §:hover§ on voimassa, kun osoitin on elementin päällä. §:focus§ on voimassa, kun elementti on näppäimistön kohde. Molemmat kannattaa tyylittää, koska kaikki eivät käytä hiirtä. §:first-child§ on vanhemman ensimmäinen lapsi.

>> Pilkku yhdistää valitsimia: §h1, h2§ tarkoittaa otsikkoa yksi tai otsikkoa kaksi. Ilman pilkkua §h1 h2§ tarkoittaisi kakkosotsikkoa, joka on ykkösotsikon sisällä, eikä sellaista rakennetta yleensä ole.`,
        en: `A **selector** is an address for an element. §nav a§ hits every link inside a nav region, even if a list sits between them. §nav > a§ hits only a link that is a direct child of the nav. The §>§ sign is that difference.

A pseudo-class starts with a colon. §:hover§ applies when the pointer is over the element. §:focus§ applies when the element is the keyboard target. Style both, because not everyone uses a pointer. §:first-child§ is the parent's first child.

>> A comma joins selectors: §h1, h2§ means a level-one heading or a level-two heading. Without the comma, §h1 h2§ would mean a level-two heading inside a level-one heading, and that structure is not usual.`,
      },
      tags: ["selector", "hover", "focus", "child", "valitsin"],
    },
    {
      id: "tyyppi",
      topic: "tieto",
      title: { fi: "Teksti", en: "Text" },
      blurb: {
        fi: "font-family valitsee kirjasimen, line-height rivin korkeuden ja text-align tasauksen.",
        en: "font-family chooses the typeface, line-height the line height and text-align the alignment.",
      },
      points: [
        { fi: "Kirjasinlista päättyy yleiseen nimeen, kuten sans-serif.", en: "A font list ends with a generic name, such as sans-serif." },
        { fi: "line-height ilman yksikköä on kerroin, esimerkiksi 1.5.", en: "line-height without a unit is a multiplier, for example 1.5." },
      ],
      file: "tyyppi.css",
      code: `body {
  font-family: "Source Sans 3", sans-serif;
  line-height: 1.5;
}

h1 {
  line-height: 1.2;
  text-align: left;
}`,
      theory: {
        fi: `**Kirjasin** ei ole aina asennettu lukijan koneelle. §font-family§ on lista. Selain kokeilee vasemmalta ja käyttää ensimmäistä, joka löytyy. Viimeinen nimi on yleinen: §sans-serif§, §serif§ tai §monospace§. Ilman sitä selain valitsee itse, jos nimettyä kirjasinta ei ole.

§font-size§ on merkkien koko. §line-height: 1.5§ tekee rivivälistä 1,5 kertaa fontin koon. Yksikötön luku periytyy kertoimena, mikä on yleensä parempi kuin kiinteä pikseli. §text-align: left§ on vasen reuna. Keskitys sopii lyhyeen otsikkoon, ei pitkään kappaleeseen.

>> Älä pienennä leipätekstiä alle lukijan oletuksen vain siksi, että sitä mahtuu enemmän. §1rem§ on se koko, jonka lukija on itse valinnut.`,
        en: `A **typeface** is not always installed on the reader's computer. §font-family§ is a list. The browser tries from the left and uses the first one it finds. The last name is generic: §sans-serif§, §serif§ or §monospace§. Without it the browser chooses by itself when the named font is missing.

§font-size§ is the size of the characters. §line-height: 1.5§ makes the line spacing 1.5 times the font size. A unitless number is inherited as a multiplier, which is usually better than a fixed pixel size. §text-align: left§ is the left edge. Centering fits a short heading, not a long paragraph.

>> Do not shrink body text below the reader's default just so more of it fits. §1rem§ is the size the reader chose.`,
      },
      tags: ["font", "line-height", "text-align", "typografia"],
    },
    {
      id: "grid",
      topic: "asettelu",
      title: { fi: "Grid", en: "Grid" },
      blurb: {
        fi: "display: grid jakaa laatikon riveihin ja sarakkeisiin. grid-template-columns kertoo sarakkeiden leveydet.",
        en: "display: grid splits a box into rows and columns. grid-template-columns sets the column widths.",
      },
      points: [
        { fi: "1fr on yksi osuus vapaasta tilasta.", en: "1fr is one share of the free space." },
        { fi: "repeat(3, 1fr) on kolme yhtä leveää saraketta.", en: "repeat(3, 1fr) is three columns of equal width." },
      ],
      file: "grid.css",
      code: `.kortit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}`,
      theory: {
        fi: `**Grid** on ruudukko kahdessa suunnassa. §display: grid§ tekee laatikosta ruudukon. §grid-template-columns: 1fr 1fr§ tekee kaksi saraketta, jotka jakavat vapaan leveyden. §repeat(2, 1fr)§ on sama asia lyhyemmin. §gap§ on sama väli kuin flexissä.

Lapsi menee seuraavaan soluun kirjoitusjärjestyksessä. §grid-column: span 2§ venyttää elementin kahden sarakkeen yli. Sitä tarvitaan, kun yksi kortti on otsikko ja muut ovat tavallisia soluja.

>> Grid sopii korttiseinään ja sivun isoon palstajakoon. Flex sopii yhteen riviin, jonka määrä elää. Älä tee kummallakin samaa tehtävää samaan laatikkoon.`,
        en: `A **grid** is a grid in two directions. §display: grid§ turns a box into a grid. §grid-template-columns: 1fr 1fr§ makes two columns that share the free width. §repeat(2, 1fr)§ is the same thing, shorter. §gap§ is the same kind of space as in flex.

A child goes into the next cell in writing order. §grid-column: span 2§ stretches an element across two columns. You need that when one card is a heading and the others are ordinary cells.

>> Grid fits a wall of cards and the large columns of a page. Flex fits one row whose count changes. Do not give both the same job on the same box.`,
      },
      tags: ["grid", "fr", "columns", "asettelu"],
    },
    {
      id: "sijainti",
      topic: "asettelu",
      title: { fi: "Sijainti", en: "Position" },
      blurb: {
        fi: "position irrottaa laatikon normaalista virrasta. relative siirtää sitä, absolute ja fixed kiinnittävät sen.",
        en: "position pulls a box out of the normal flow. relative shifts it, absolute and fixed pin it.",
      },
      points: [
        { fi: "absolute hakee lähimmän position-arvon, joka ei ole static.", en: "absolute looks for the nearest position that is not static." },
        { fi: "fixed on kiinni ikkunassa, ei sivun vierityksessä.", en: "fixed is tied to the window, not to scrolling the page." },
      ],
      file: "sijainti.css",
      code: `.kehys {
  position: relative;
}

.merkki {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}`,
      theory: {
        fi: `**Sijainti** muuttaa sen, mihin laatikko lasketaan. Oletus §static§ on normaali virta: laatikot tulevat allekkain. §relative§ pitää laatikon sen paikalla virtauksessa, mutta §top§ ja §left§ siirtävät sen silminnähtävästi. Sen jättämä aukko jää paikalleen.

§absolute§ ottaa laatikon pois virtauksesta. Se kiinnittyy lähimpään esi-isään, jolla on jokin muu position kuin static. Siksi kehys saa §position: relative§, vaikka sitä ei siirretä. Lapsen §top: 0.5rem§ mitataan silloin kehyksen nurkasta, ei koko sivusta.

>> §fixed§ kiinnittyy ikkunaan. Se pysyy paikallaan, kun sivua vieritetään. Käytä sitä harvoin. Kiinteä palkki peittää sisältöä, jos sille ei jätä marginia.`,
        en: `**Position** changes where a box is measured from. The default §static§ is the normal flow: boxes stack. §relative§ keeps the box in that place in the flow, but §top§ and §left§ shift how it looks. The gap it left behind stays.

§absolute§ takes the box out of the flow. It attaches to the nearest ancestor whose position is something other than static. That is why the frame gets §position: relative§ even when the frame itself is not shifted. The child's §top: 0.5rem§ is then measured from the frame's corner, not from the whole page.

>> §fixed§ attaches to the window. It stays put when the page scrolls. Use it rarely. A fixed bar covers content if you do not leave a margin for it.`,
      },
      tags: ["position", "absolute", "relative", "fixed", "sijainti"],
    },
    {
      id: "muuttujat",
      topic: "rakenne",
      title: { fi: "Muuttujat", en: "Variables" },
      blurb: {
        fi: "Custom property on nimetty arvo. Sitä käyttää var(--nimi). Määrittele se :root-valitsimessa, jos koko sivu tarvitsee sitä.",
        en: "A custom property is a named value. You use it with var(--name). Define it on :root when the whole page needs it.",
      },
      points: [
        { fi: "Nimi alkaa kahdella viivalla: --vari.", en: "The name starts with two dashes: --vari." },
        { fi: "var(--vari, #000) käyttää mustaa, jos muuttujaa ei ole.", en: "var(--vari, #000) uses black when the variable is missing." },
      ],
      file: "muuttujat.css",
      code: `:root {
  --paper: #f5f0e8;
  --ink: #1c1917;
}

body {
  background: var(--paper);
  color: var(--ink);
}`,
      theory: {
        fi: `**CSS-muuttuja** on arvo, jolla on nimi. §--ink: #1c1917§ tallentaa värin. §color: var(--ink)§ lukee sen. Jos väri vaihtuu, muutat sen yhdessä kohdassa. Nimi alkaa kahdella viivalla, jotta se ei sekoitu tavalliseen ominaisuuteen.

§:root§ on sivun juuri, käytännössä html-elementti. Siinä määritelty muuttuja näkyy kaikille. Voit myös määritellä muuttujan yhdessä luokassa, jolloin se näkyy vain sen laatikon lapsille. Näin kortilla voi olla oma korostusväri.

>> §var(--ink, #1c1917)§ antaa varavärin. Toinen argumentti käytetään, jos muuttujaa ei ole määritelty. Se pelastaa kirjoitusvirheeltä, jossa viiva tai nimi ei täsmää.`,
        en: `A **CSS variable** is a value with a name. §--ink: #1c1917§ stores a color. §color: var(--ink)§ reads it. When the color changes, you change it in one place. The name starts with two dashes so it does not collide with an ordinary property.

§:root§ is the root of the page, in practice the html element. A variable defined there is visible to everyone. You can also define a variable on one class, and then it is visible only to that box's children. A card can then have its own accent color.

>> §var(--ink, #1c1917)§ gives a fallback. The second argument is used when the variable was not defined. It saves you from a typo where the dashes or the name do not match.`,
      },
      tags: ["variable", "custom property", "var", "root", "muuttuja"],
    },
    {
      id: "mukautuva",
      topic: "asettelu",
      title: { fi: "Kapea ja leveä", en: "Narrow and wide" },
      blurb: {
        fi: "media-kysely vaihtaa sääntöjä, kun ikkuna on tarpeeksi leveä. Aloita kapeasta näkymästä.",
        en: "A media query swaps rules when the window is wide enough. Start from the narrow view.",
      },
      points: [
        { fi: "min-width: 48rem tarkoittaa vähintään tätä leveyttä.", en: "min-width: 48rem means at least this width." },
        { fi: "Kirjoita puhelimen tyyli ensin, leveän näytön poikkeus kyselyn sisään.", en: "Write the phone styles first, and the wide-screen exception inside the query." },
      ],
      file: "mukautuva.css",
      code: `.kortit {
  display: grid;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .kortit {
    grid-template-columns: 1fr 1fr;
  }
}`,
      theory: {
        fi: `**Media-kysely** on ehto ikkunan koolle. §@media (min-width: 48rem)§ on tosi, kun ikkuna on vähintään 48 rem leveä. Sen sisällä olevat säännöt tulevat voimaan vasta sitten. Kapeammalla näytöllä ne eivät ole olemassa.

Kirjoita ensin tyyli, joka toimii kapealla. Yksi palsta, isot napit, ei vierekkäisiä kortteja. Leveällä näytöllä lisää sarakkeet kyselyn sisään. Tätä kutsutaan mobile first -järjestyksesi. Toinen suunta, jossa kapea näyttö yrittää kumota leveän tyylin, unohtuu helpommin.

>> Älä lukitse sivua pikselileveyteen. [[Prosentti|percent]] ja §fr§ elävät vanhemman mukana. Kyselyä tarvitaan vasta, kun asettelun idea muuttuu, ei jokaista kymmentä pikseliä varten.`,
        en: `A **media query** is a condition on the window size. §@media (min-width: 48rem)§ is true when the window is at least 48 rem wide. The rules inside it apply only then. On a narrower screen they do not exist.

Write first the style that works when narrow. One column, large buttons, no cards side by side. On a wide screen, add the columns inside the query. This order is called mobile first. The other direction, where a narrow screen tries to undo a wide style, is easier to forget.

>> Do not lock the page to a pixel width. A [[percent|percent]] and §fr§ live with the parent. You need a query when the idea of the layout changes, not for every ten pixels.`,
      },
      tags: ["media", "responsive", "min-width", "mukautuva"],
    },
  ],
};

export { css };
