import type { Language } from "./types";

const html: Language = {
  id: "html",
  name: "HTML",
  short: "HTML",
  runnable: false,
  blurb: {
    fi: "Sivun rakenne. HTML kertoo, mikä on otsikko, linkki tai kuva. Se ei vielä päätä värejä.",
    en: "The structure of a page. HTML says what is a heading, a link or a picture. It does not choose colors yet.",
  },
  run: {
    fi: "Tallenna tiedosto päätteellä .html ja avaa se selaimessa.",
    en: "Save the file with a .html ending and open it in a browser.",
  },
  lessons: [
    {
      id: "sivu",
      topic: "perusteet",
      title: { fi: "Sivu ja tunnisteet", en: "A page and tags" },
      blurb: {
        fi: "HTML-sivu on tunnisteita. Tunniste alkaa kulmasulkeella ja loppuu samaan nimeen kauttaviivalla.",
        en: "An HTML page is tags. A tag starts with an angle bracket and ends with the same name and a slash.",
      },
      points: [
        { fi: "html, head ja body ovat sivun runko.", en: "html, head and body are the skeleton of the page." },
        { fi: "title näkyy selaimen välilehdessä, ei sivun keskellä.", en: "title shows on the browser tab, not in the middle of the page." },
      ],
      file: "page.html",
      code: `<!DOCTYPE html>
<html lang="fi">
  <head>
    <meta charset="utf-8">
    <title>Kurssisivu</title>
  </head>
  <body>
    <h1>Ohjelmointi</h1>
    <p>Ensimmäinen sivu.</p>
  </body>
</html>`,
      output: `Ohjelmointi
Ensimmäinen sivu.`,
      theory: {
        fi: `**HTML** kuvaa sivun osat. Selain lukee tunnisteet ylhäältä alas ja piirtää niiden sisällön. §<!DOCTYPE html>§ kertoo, että tiedosto on nykyistä HTML:ää.

§head§ on sivun konepellin alla: kieli, merkistö ja välilehden nimi. §body§ on se, minkä ihminen näkee. Merkit luetaan [[UTF-8-koodauksena|textsize]], jotta ä ja ö eivät rikkoudu.

>> Tunnisteella on alku ja loppu: §<p>§ aloittaa kappaleen ja §</p>§ lopettaa sen. Sisennys ei muuta tulosta. Se auttaa vain lukemaan, mikä tunniste on minkäkin sisällä.`,
        en: `**HTML** describes the parts of a page. The browser reads the tags from top to bottom and draws their contents. §<!DOCTYPE html>§ says the file is modern HTML.

§head§ is under the hood: language, character set and the tab name. §body§ is what a person sees. Characters are read as [[UTF-8|textsize]], so ä and ö do not break.

>> A tag has a start and an end: §<p>§ opens a paragraph and §</p>§ closes it. Indentation does not change the result. It only helps you see which tag sits inside which.`,
      },
      tags: ["html", "doctype", "head", "body", "tunniste", "tag"],
    },
    {
      id: "teksti",
      topic: "perusteet",
      title: { fi: "Otsikot ja kappaleet", en: "Headings and paragraphs" },
      blurb: {
        fi: "h1 on sivun pääotsikko. p on kappale. strong korostaa merkityksen, ei vain lihavointia.",
        en: "h1 is the page's main heading. p is a paragraph. strong marks importance, not just bold type.",
      },
      points: [
        { fi: "Käytä yhtä h1-otsikkoa sivua kohti.", en: "Use one h1 heading per page." },
        { fi: "h2 ja h3 ovat alaotsikoita, eivät isompaa fonttia.", en: "h2 and h3 are subheadings, not a bigger font." },
      ],
      file: "text.html",
      code: `<h1>Laboratorio</h1>
<p>Mittaa jännite ennen kuin vaihdat vastuksen.</p>
<h2>Välineet</h2>
<p>Tarvitset <strong>yleismittarin</strong> ja johdot.</p>`,
      output: `Laboratorio
Mittaa jännite ennen kuin vaihdat vastuksen.
Välineet
Tarvitset yleismittarin ja johdot.`,
      theory: {
        fi: `**Otsikko** kertoo rakenteen. §h1§ on koko sivun aihe. §h2§ jakaa sen osiin ja §h3§ osan pienempiin kohtiin. Älä valitse numeroa sen mukaan, miltä teksti näyttää. Numero kertoo tason.

**Kappale** §p§ on yksi ajatus. Selain lisää kappaleiden väliin tyhjää. Rivinvaihto tekstin keskellä ei vielä aloita uutta kappaletta. Siihen on §<br>§, mutta yleensä uusi §p§ on selkeämpi.

>> §strong§ tarkoittaa, että sana on tärkeä. §em§ tarkoittaa painotusta, kuten äänenpainoa. Myöhemmin CSS voi näyttää ne lihavoituna tai kursiivina, mutta merkitys on jo HTML:ssä.`,
        en: `A **heading** tells the structure. §h1§ is the subject of the whole page. §h2§ splits it into parts and §h3§ splits a part into smaller points. Do not pick the number by how big you want the text. The number is the level.

A **paragraph** §p§ is one thought. The browser adds space between paragraphs. A line break in the file does not start a new paragraph. §<br>§ does that, but a new §p§ is usually clearer.

>> §strong§ means the word matters. §em§ means emphasis, like stress in speech. CSS can later show them bold or italic, but the meaning is already in the HTML.`,
      },
      tags: ["h1", "p", "strong", "em", "otsikko", "heading"],
    },
    {
      id: "linkki",
      topic: "ohjaus",
      title: { fi: "Linkit", en: "Links" },
      blurb: {
        fi: "a-tunniste vie toiselle sivulle. href on osoite. Linkin tekstin pitää kertoa, minne se vie.",
        en: "The a tag goes to another page. href is the address. The link text must say where it goes.",
      },
      points: [
        { fi: "href=\"ohje.html\" on samassa kansiossa.", en: "href=\"ohje.html\" is in the same folder." },
        { fi: "https:// aloittaa toisen sivuston osoitteen.", en: "https:// starts an address on another site." },
      ],
      file: "link.html",
      code: `<p>
  Lue
  <a href="ohje.html">mittausohje</a>
  ennen työtä.
</p>
<p>
  <a href="https://example.edu/kaavasto">Kurssin kaavasto</a>
</p>`,
      output: `Lue mittausohje ennen työtä.
Kurssin kaavasto`,
      theory: {
        fi: `**Linkki** on §a§-tunniste, jonka §href§-attribuutti on kohde. Ilman href-arvoa teksti ei ole linkki. Näkyvä teksti on tunnisteen välissä, ei osoitteen sisällä.

Osoite voi olla suhteellinen tai täysi. §ohje.html§ tarkoittaa tiedostoa samassa kansiossa. §../ohje.html§ nousee yhden kansion ylös. Täysi osoite alkaa §https://§ ja nimeää koko palvelimen.

>> Älä kirjoita linkin tekstiksi *klikkaa tästä*. Kirjoita kohteen nimi, esimerkiksi *mittausohje*. Silloin linkin ymmärtää myös ilman ympäröivää lausetta.`,
        en: `A **link** is an §a§ tag whose §href§ attribute is the target. Without href the text is not a link. The visible text sits between the tags, not inside the address.

An address can be relative or full. §ohje.html§ means a file in the same folder. §../ohje.html§ goes up one folder. A full address starts with §https://§ and names the whole server.

>> Do not write *click here* as the link text. Write the name of the target, for example *measurement guide*. Then the link makes sense even without the sentence around it.`,
      },
      tags: ["a", "href", "linkki", "link", "url"],
    },
    {
      id: "kuva",
      topic: "tieto",
      title: { fi: "Kuvat", en: "Images" },
      blurb: {
        fi: "img näyttää kuvatiedoston. src on tiedoston osoite ja alt kertoo kuvan, jos sitä ei näe.",
        en: "img shows an image file. src is the file address and alt describes the picture if it cannot be seen.",
      },
      points: [
        { fi: "img ei tarvitse lopputunnistetta.", en: "img does not need a closing tag." },
        { fi: "alt ei ole kuvateksti sivulla. Se on varateksti.", en: "alt is not a caption on the page. It is the fallback text." },
      ],
      file: "image.html",
      code: `<img src="kytkenta.png" alt="Sarjaankytketty vastus ja ledi">
<p>Kytkentäkaavio.</p>`,
      output: `[kuva: Sarjaankytketty vastus ja ledi]
Kytkentäkaavio.`,
      theory: {
        fi: `**Kuva** on erillinen tiedosto, jonka sivu vain näyttää. §src§ osoittaa tiedostoon, kuten §kytkenta.png§. Jos polku on väärä, selain näyttää rikkinäisen kuvan ja §alt§-tekstin.

Kuvan tiedostokoko on tavuja. Iso kuva hidastaa sivua, koska selain joutuu hakemaan kaikki tavut. [[Datakoon muunnos|datasize]] kertoo, onko kuva kilotavuja vai megatavuja.

>> Kirjoita alt niin, että sen kuulemalla ymmärtää kuvan asian. Koristekuvalle alt saa olla tyhjä: §alt=""§. Älä kirjoita alkuun sanaa *kuva*, ruudunlukija sanoo sen jo.`,
        en: `An **image** is a separate file that the page only displays. §src§ points at the file, such as §kytkenta.png§. If the path is wrong, the browser shows a broken image and the §alt§ text.

An image's file size is bytes. A large image slows the page, because the browser has to fetch every byte. [[Data size conversion|datasize]] tells you whether the image is kilobytes or megabytes.

>> Write alt so that hearing it explains the picture. A decorative image may have an empty alt: §alt=""§. Do not start with the word *image*. A screen reader already says that.`,
      },
      tags: ["img", "src", "alt", "kuva", "image"],
    },
    {
      id: "lista",
      topic: "tieto",
      title: { fi: "Listat", en: "Lists" },
      blurb: {
        fi: "ul on lista ilman järjestystä. ol on numeroitu lista. Jokainen kohta on li.",
        en: "ul is a list without order. ol is a numbered list. Each item is an li.",
      },
      points: [
        { fi: "li on aina ul- tai ol-tunnisteen sisällä.", en: "li is always inside a ul or ol tag." },
        { fi: "Älä tee listaa pelkillä rivinvaihdoilla.", en: "Do not fake a list with line breaks." },
      ],
      file: "list.html",
      code: `<h2>Välineet</h2>
<ul>
  <li>Yleismittari</li>
  <li>Vastus 220 Ω</li>
</ul>
<h2>Työn vaiheet</h2>
<ol>
  <li>Kytke mittari.</li>
  <li>Lue jännite.</li>
</ol>`,
      output: `Välineet
• Yleismittari
• Vastus 220 Ω
Työn vaiheet
1. Kytke mittari.
2. Lue jännite.`,
      theory: {
        fi: `**Lista** kokoaa samanlaiset kohdat. §ul§ on järjestämätön: kohtien järjestys ei ole viesti. §ol§ on järjestetty: ensimmäinen kohta tehdään ennen toista.

Jokainen kohta on oma §li§. Älä laita kahta asiaa samaan kohtaan rivinvaihdolla. Jos kohdan sisällä on kappale tai toinen lista, sekin tulee §li§-tunnisteen sisään.

>> Selain piirtää pallon tai numeron itse. Älä kirjoita numeroa tekstin alkuun, jos käytät §ol§. Muuten numero näkyy kahdesti.`,
        en: `A **list** gathers similar items. §ul§ is unordered: the order is not the message. §ol§ is ordered: the first item happens before the second.

Each item is its own §li§. Do not put two things in one item with a line break. If an item contains a paragraph or another list, that also goes inside the §li§ tag.

>> The browser draws the bullet or the number itself. Do not type a number at the start of the text when you use §ol§. Otherwise the number shows twice.`,
      },
      tags: ["ul", "ol", "li", "lista", "list"],
    },
    {
      id: "lomake",
      topic: "ohjaus",
      title: { fi: "Lomake", en: "A form" },
      blurb: {
        fi: "form kokoaa kentät. label kertoo, mitä kenttään kirjoitetaan. button lähettää lomakkeen.",
        en: "form gathers the fields. label says what to type. button sends the form.",
      },
      points: [
        { fi: "for ja id yhdistävät nimikkeen kenttään.", en: "for and id connect the label to the field." },
        { fi: "type=\"number\" pyytää lukua, type=\"text\" tekstiä.", en: "type=\"number\" asks for a number, type=\"text\" for text." },
      ],
      file: "form.html",
      code: `<form>
  <label for="voltage">Jännite (V)</label>
  <input id="voltage" name="voltage" type="number">
  <button type="submit">Laske</button>
</form>`,
      output: `Jännite (V)  [    ]
[Laske]`,
      theory: {
        fi: `**Lomake** kerää käyttäjän antaman tiedon. §input§ on kenttä. §label§ on sen nimi. Yhdistä ne: nimikkeen §for§ on sama teksti kuin kentän §id§. Silloin nimikkeen napsautus vie kirjoituskohdan kenttään.

§name§ on nimi, jolla vastaus lähetetään. §id§ on nimi sivun sisällä. Ne saavat olla samat, mutta ne ovat eri asiat. §type§ valitsee, millaista vastausta pyydetään.

>> §button type="submit"§ lähettää lomakkeen. Ilman type-arvoa painike saattaa tehdä jotain muuta, jos sivuun lisätään myöhemmin komentosarja. Kirjoita type näkyviin.`,
        en: `A **form** collects what the user types. §input§ is a field. §label§ is its name. Connect them: the label's §for§ is the same text as the field's §id§. Then clicking the label puts the cursor in the field.

§name§ is the name used when the answer is sent. §id§ is the name inside the page. They may match, but they are different jobs. §type§ chooses what kind of answer you want.

>> §button type="submit"§ sends the form. Without type, the button may do something else once a script is added later. Write the type out.`,
      },
      tags: ["form", "input", "label", "button", "lomake"],
    },
    {
      id: "rakenne",
      topic: "rakenne",
      title: { fi: "Sivun osat", en: "Parts of a page" },
      blurb: {
        fi: "header, main ja footer nimeävät sivun alueet. section kokoaa yhden aiheen.",
        en: "header, main and footer name the regions of a page. section groups one topic.",
      },
      points: [
        { fi: "main on sivun varsinainen sisältö, kerran sivulla.", en: "main is the real content, once per page." },
        { fi: "div ei kerro merkitystä. Käytä sitä vasta, kun sopivampaa tunnistetta ei ole.", en: "div has no meaning. Use it only when no better tag fits." },
      ],
      file: "layout.html",
      code: `<header>
  <p>Kurssi</p>
  <h1>Tasavirtapiiri</h1>
</header>
<main>
  <section>
    <h2>Mittaus</h2>
    <p>U = 12 V ja R = 220 Ω.</p>
  </section>
</main>
<footer>
  <p>Päivitetty tänään.</p>
</footer>`,
      output: `Kurssi
Tasavirtapiiri
Mittaus
U = 12 V ja R = 220 Ω.
Päivitetty tänään.`,
      theory: {
        fi: `**Alue** kertoo, mitä varten pala sivua on olemassa. §header§ on johdanto, §main§ on itse asia ja §footer§ on loppu, esimerkiksi tekijä tai päiväys. §nav§ on linkkilista, jolla liikutaan.

§section§ on yksi aihe, ja sillä on yleensä otsikko. §article§ on pala, joka voisi olla olemassa yksinään, kuten uutinen. §div§ on tyhjä laatikko ilman merkitystä. Sitä tarvitaan joskus asetteluun, mutta se ei korvaa otsikkoa tai listaa.

>> Älä laita koko sivua peräkkäisiin §div§-laatikoihin. Kun alueella on nimi, sivu on helpompi lukea sekä ihmiselle että myöhemmin CSS:lle ja Reactille.`,
        en: `A **region** says what a piece of the page is for. §header§ is the introduction, §main§ is the actual subject and §footer§ is the end, for example the author or the date. §nav§ is the list of links used to move around.

§section§ is one topic, and it usually has a heading. §article§ is a piece that could stand alone, such as a news item. §div§ is an empty box with no meaning. You sometimes need it for layout, but it does not replace a heading or a list.

>> Do not put the whole page in a row of §div§ boxes. When a region has a name, the page is easier to read for a person and later for CSS and React.`,
      },
      tags: ["header", "main", "footer", "section", "nav", "semanttinen"],
    },
    {
      id: "taulukko",
      topic: "tieto",
      title: { fi: "Taulukko", en: "A table" },
      blurb: {
        fi: "table on rivejä ja sarakkeita. thead kertoo otsikot, tbody varsinaiset rivit ja th on sarakkeen nimi.",
        en: "table is rows and columns. thead holds the headings, tbody the actual rows and th is a column name.",
      },
      points: [
        { fi: "Älä käytä taulukkoa sivun asetteluun.", en: "Do not use a table to lay out the page." },
        { fi: "caption on taulukon otsikko, jonka ruudunlukija lukee ensin.", en: "caption is the table's title, which a screen reader reads first." },
      ],
      file: "table.html",
      code: `<table>
  <caption>Mittaukset</caption>
  <thead>
    <tr><th>Nimi</th><th>Jännite</th></tr>
  </thead>
  <tbody>
    <tr><td>Piiri A</td><td>12 V</td></tr>
    <tr><td>Piiri B</td><td>5 V</td></tr>
  </tbody>
</table>`,
      output: `Mittaukset
Nimi     Jännite
Piiri A  12 V
Piiri B  5 V`,
      theory: {
        fi: `**Taulukko** on dataa, jossa jokaisella rivillä on samat sarakkeet. §tr§ on rivi, §td§ on solu ja §th§ on otsikkosolu. §thead§ ja §tbody§ erottavat otsikkorivin varsinaisista riveistä. Selain osaa toistaa otsikon, ja ruudunlukija osaa kertoa, minkä sarakkeen solu on.

§caption§ on koko taulukon nimi, ei sivun otsikko. Se tulee heti §table§-tunnisteen sisään. Jos taulukko on mittauksia, caption voi olla *Mittaukset*. Älä jätä taulukkoa ilman otsikkoa tai captionia, jos taulukoita on sivulla useita.

>> Taulukko ei ole ruudukko sivun palstoille. Palstat tehdään CSS:n flexillä tai gridillä. Taulukkoon kuuluu vain tieto, jonka voisi avata myös laskentataulukossa.`,
        en: `A **table** is data where every row has the same columns. §tr§ is a row, §td§ is a cell and §th§ is a heading cell. §thead§ and §tbody§ separate the heading row from the real rows. The browser can repeat the heading, and a screen reader can say which column a cell belongs to.

§caption§ is the name of the whole table, not a page heading. It goes immediately inside the §table§ tag. If the table is measurements, the caption can be *Measurements*. Do not leave a table without a heading or a caption when the page has several tables.

>> A table is not a grid for the page's columns. Columns are made with CSS flex or grid. A table is only for information you could also open in a spreadsheet.`,
      },
      tags: ["table", "tr", "td", "th", "taulukko"],
    },
    {
      id: "media",
      topic: "tieto",
      title: { fi: "Kuva, ääni ja video", en: "Image, audio and video" },
      blurb: {
        fi: "img, audio ja video upottavat tiedoston. figure ja figcaption nimeävät sen.",
        en: "img, audio and video embed a file. figure and figcaption name it.",
      },
      points: [
        { fi: "controls näyttää soittimen painikkeet.", en: "controls shows the player's buttons." },
        { fi: "videoon voi laittaa useita source-tunnisteita eri muodoille.", en: "A video can contain several source tags for different formats." },
      ],
      file: "media.html",
      code: `<figure>
  <img src="kytkenta.png" alt="Sarjaankytketty vastus ja ledi">
  <figcaption>Kuva 1. Kytkentäkaavio.</figcaption>
</figure>
<audio src="ohje.mp3" controls></audio>`,
      output: `[kuva ja kuvateksti]
[soitin]`,
      theory: {
        fi: `**Media** on tiedosto, jonka selain soittaa tai näyttää. §img§ näyttää kuvan. §audio§ ja §video§ soittavat äänen ja kuvan. §controls§ lisää painikkeet. Ilman sitä käyttäjä ei voi käynnistää ääntä, ellei sivu tee sitä itse JavaScriptillä.

§figure§ kokoaa median ja sen selitteen. §figcaption§ on se selite, esimerkiksi *Kuva 1*. Se ei korvaa §alt§-tekstiä. alt kertoo kuvan sisällön sille, joka ei näe kuvaa. figcaption on kuvateksti kaikille.

>> Iso video on paljon tavuja. Ennen kuin upotat sen sivulle, tarkista koko [[datakoon muunnoksella|datasize]]. Jos tiedosto on kymmeniä megatavuja, anna sille erillinen latauslinkki äläkä pakota selainta hakemaan sitä heti.`,
        en: `**Media** is a file the browser shows or plays. §img§ shows a picture. §audio§ and §video§ play sound and picture. §controls§ adds the buttons. Without them the user cannot start the audio, unless the page does it with JavaScript.

§figure§ groups the media and its caption. §figcaption§ is that caption, for example *Figure 1*. It does not replace the §alt§ text. alt describes the picture for someone who cannot see it. figcaption is the caption for everyone.

>> A large video is a lot of bytes. Before you embed it, check the size with [[data size conversion|datasize]]. If the file is tens of megabytes, give it a separate download link instead of making the browser fetch it immediately.`,
      },
      tags: ["audio", "video", "figure", "figcaption", "media"],
    },
    {
      id: "syotteet",
      topic: "ohjaus",
      title: { fi: "Kenttien tyypit", en: "Field types" },
      blurb: {
        fi: "inputin type valitsee, mitä käyttäjältä kysytään. select on lista, textarea on useampi rivi.",
        en: "The type of an input chooses what you ask from the user. select is a list, textarea is several lines.",
      },
      points: [
        { fi: "fieldset ja legend ryhmittelevät samaan asiaan kuuluvat kentät.", en: "fieldset and legend group fields that belong to the same thing." },
        { fi: "required estää lähetyksen, jos kenttä on tyhjä.", en: "required blocks sending when the field is empty." },
      ],
      file: "inputs.html",
      code: `<form>
  <label for="name">Nimi</label>
  <input id="name" name="name" type="text" required>
  <label for="date">Päivä</label>
  <input id="date" name="date" type="date">
  <label for="course">Kurssi</label>
  <select id="course" name="course">
    <option value="ohm">Ohm</option>
    <option value="verkko">Verkko</option>
  </select>
  <label for="note">Huomio</label>
  <textarea id="note" name="note"></textarea>
  <button type="submit">Tallenna</button>
</form>`,
      output: `Nimi [____]
Päivä [kalenteri]
Kurssi [Ohm v]
Huomio [      ]
[Tallenna]`,
      theory: {
        fi: `**Kentän tyyppi** kertoo selaimelle, mitä vastaus on. §type="text"§ on yksi rivi tekstiä. §type="number"§ pyytää lukua. §type="date"§ avaa kalenterin. §type="email"§ ja §type="password"§ muuttavat näppäimistöä ja tarkistusta. Tyyppi ei vielä tallenna mitään. Se vain auttaa käyttäjää antamaan oikean muodon.

§select§ on valmiiden vaihtoehtojen lista. Jokainen §option§ on yksi vaihtoehto, ja sen §value§ on se arvo, joka lähetetään. Näkyvä teksti voi olla pidempi kuin value. §textarea§ on vapaa teksti, joka saa viedä useita rivejä.

>> §fieldset§ piirtää ryhmän ympärille kehyksen ja §legend§ nimeää sen, esimerkiksi *Mittaus*. §required§ estää lomakkeen lähetyksen, jos kenttä on tyhjä. Se ei korvaa tarkistusta palvelimella, mutta se pysäyttää tyhjän lähetyksen heti.`,
        en: `A **field type** tells the browser what the answer is. §type="text"§ is one line of text. §type="number"§ asks for a number. §type="date"§ opens a calendar. §type="email"§ and §type="password"§ change the keyboard and the check. The type does not save anything yet. It only helps the user give the right shape.

§select§ is a list of ready choices. Each §option§ is one choice, and its §value§ is the value that gets sent. The visible text may be longer than the value. §textarea§ is free text that may take several lines.

>> §fieldset§ draws a frame around a group and §legend§ names it, for example *Measurement*. §required§ blocks sending the form when the field is empty. It does not replace a check on the server, but it stops an empty send immediately.`,
      },
      tags: ["input", "select", "textarea", "fieldset", "required", "lomake"],
    },
    {
      id: "head",
      topic: "rakenne",
      title: { fi: "Head, tyyli ja skripti", en: "Head, style and script" },
      blurb: {
        fi: "headissa on sivun konepellin alinen tieto: merkistö, otsikko, CSS ja JavaScript.",
        en: "The head holds what sits under the hood: character set, title, CSS and JavaScript.",
      },
      points: [
        { fi: "link tuo ulkoisen CSS-tiedoston. script tuo JavaScript-tiedoston.", en: "link brings an external CSS file. script brings a JavaScript file." },
        { fi: "script sivun lopussa ei pysäytä HTML:n lukemista yhtä aikaisin.", en: "A script at the end of the page does not pause HTML reading as early." },
      ],
      file: "head.html",
      code: `<!DOCTYPE html>
<html lang="fi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mittaus</title>
    <link rel="stylesheet" href="tyyli.css">
  </head>
  <body>
    <h1>Mittaus</h1>
    <script src="app.js"></script>
  </body>
</html>`,
      output: `Mittaus`,
      theory: {
        fi: `**head** ei näy sivun keskellä. §meta charset="utf-8"§ kertoo, että teksti on [[UTF-8|textsize]]. Ilman sitä ä ja ö voivat muuttua roskaksi. §title§ on välilehden nimi. §meta name="viewport"§ käskee puhelinta käyttämään sivun oikeaa leveyttä, ei pienennettyä työpöytänäkymää.

§link rel="stylesheet"§ lataa CSS-tiedoston ennen kuin sivu piirretään, jotta tyylit ovat valmiina. §script src="app.js"§ lataa JavaScriptin. Jos skripti on §head§-osassa ilman §defer§-attribuuttia, selain pysähtyy ja ajaa sen ennen kuin body on luettu. Siksi skripti on usein bodyn lopussa tai merkitty §defer§.

>> Älä kirjoita pitkää ohjelmaa suoraan HTML-tiedoston keskelle. HTML kuvaa rakenteen, CSS ulkoasun ja JavaScript toiminnan. Kolme tiedostoa on helpompi lukea kuin yksi sekava.`,
        en: `The **head** does not show in the middle of the page. §meta charset="utf-8"§ says the text is [[UTF-8|textsize]]. Without it, ä and ö can turn into garbage. §title§ is the name of the tab. §meta name="viewport"§ tells a phone to use the page's real width, not a shrunk desktop view.

§link rel="stylesheet"§ loads the CSS file before the page is drawn, so the styles are ready. §script src="app.js"§ loads the JavaScript. If the script is in the §head§ without a §defer§ attribute, the browser stops and runs it before the body has been read. That is why the script is often at the end of the body, or marked §defer§.

>> Do not write a long program in the middle of the HTML file. HTML describes the structure, CSS the look and JavaScript the behaviour. Three files are easier to read than one muddle.`,
      },
      tags: ["head", "meta", "link", "script", "viewport", "charset"],
    },
  ],
};

export { html };
