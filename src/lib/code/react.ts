import type { Language } from "./types";

const react: Language = {
  id: "react",
  name: "React",
  short: "React",
  runnable: false,
  blurb: {
    fi: "Käyttöliittymä komponenteista. Funktio palauttaa sen HTML:n näköisen kuvauksen, jonka React piirtää.",
    en: "A user interface made of components. A function returns a description that looks like HTML, and React draws it.",
  },
  run: {
    fi: "JSX ei ajaudu tässä näkymässä. Luo projekti komennolla npm create vite@latest ja liitä komponentti src-kansioon.",
    en: "JSX does not run in this view. Create a project with npm create vite@latest and paste the component into the src folder.",
  },
  lessons: [
    {
      id: "komponentti",
      topic: "perusteet",
      title: { fi: "Komponentti", en: "A component" },
      blurb: {
        fi: "Komponentti on funktio, jonka nimi alkaa isolla kirjaimella. Se palauttaa elementtejä.",
        en: "A component is a function whose name starts with a capital letter. It returns elements.",
      },
      points: [
        { fi: "Tiedostossa on yksi päätason elementti tai fragmentti <>...</>.", en: "The file returns one root element or a fragment <>...</>." },
        { fi: "className vastaa HTML:n class-attribuuttia.", en: "className is the HTML class attribute." },
      ],
      file: "Kortti.jsx",
      code: `export function Kortti() {
  return (
    <article className="kortti">
      <h2>Tasavirtapiiri</h2>
      <p>U = 12 V</p>
    </article>
  );
}`,
      theory: {
        fi: `**Komponentti** on funktio, joka kuvaa palan sivua. Nimi alkaa isolla kirjaimella, jotta React erottaa sen HTML-tunnisteesta. §<Kortti />§ kutsuu funktiota. §<article>§ on tavallinen HTML-elementti.

Palautettava kuvaus on **JSX**. Se näyttää HTML:ltä, mutta se on JavaScriptiä. Yksi return voi palauttaa vain yhden puun. Kaksi vierekkäistä elementtiä kääritään §<>§ ja §</>§ väliin, tai yhteen §article§- tai §div§-elementtiin.

>> §className§ on luokka, koska sana class on JavaScriptissä varattu. Tyylit kirjoitetaan silti tavalliseen CSS-tiedostoon ja luokkaan, ei komponentin nimeen.`,
        en: `A **component** is a function that describes a piece of the page. The name starts with a capital letter so React can tell it from an HTML tag. §<Kortti />§ calls the function. §<article>§ is an ordinary HTML element.

The description you return is **JSX**. It looks like HTML, but it is JavaScript. One return can return only one tree. Two sibling elements are wrapped in §<>§ and §</>§, or in one §article§ or §div§.

>> §className§ is the class, because the word class is reserved in JavaScript. The styles still go in an ordinary CSS file and a class, not in the component's name.`,
      },
      tags: ["jsx", "component", "komponentti", "classname", "react"],
    },
    {
      id: "props",
      topic: "tieto",
      title: { fi: "Propsit", en: "Props" },
      blurb: {
        fi: "Props on tieto, jonka kutsuja antaa komponentille. Komponentti ei muuta propsia.",
        en: "A prop is data the caller passes to a component. The component does not change a prop.",
      },
      points: [
        { fi: "Aaltosulkeet upottavat JavaScript-arvon: {jannite}.", en: "Braces embed a JavaScript value: {jannite}." },
        { fi: "Merkkijono ilman aaltosulkeita kirjoitetaan lainausmerkkeihin.", en: "A string without braces is written in quotes." },
      ],
      file: "Mittaus.jsx",
      code: `export function Mittaus({ jannite, vastus }) {
  return (
    <p>
      U = {jannite} V, R = {vastus} Ω
    </p>
  );
}

export function Sivu() {
  return <Mittaus jannite={12} vastus={220} />;
}`,
      theory: {
        fi: `**Prop** on argumentti. Kutsu §<Mittaus jannite={12} vastus={220} />§ antaa funktiolle oliolla arvot 12 ja 220. Aaltosulkeet tarkoittavat, että sisällä on JavaScriptiä, ei tekstiä. Ilman niitä §{12}§ näkyisi merkkeinä.

Komponentti lukee propsit, mutta ei sijoita niihin uutta arvoa. Jos luku muuttuu, *kutsuja* antaa uuden propin ja React kutsuu funktion uudestaan. Näin tieto kulkee ylhäältä alas.

>> Pura tarvitsemasi nimet parametrilistassa: §{ jannite, vastus }§. Silloin funktion sisältä näkee heti, mitä tietoa pala tarvitsee.`,
        en: `A **prop** is an argument. The call §<Mittaus jannite={12} vastus={220} />§ gives the function the values 12 and 220 on an object. Braces mean the inside is JavaScript, not text. Without them §{12}§ would show up as characters.

A component reads props but does not assign a new value to them. If a number changes, the *caller* passes a new prop and React calls the function again. Data flows downward.

>> Pull out the names you need in the parameter list: §{ jannite, vastus }§. Then the inside of the function shows at once what the piece needs.`,
      },
      tags: ["props", "jsx", "argumentti", "react"],
    },
    {
      id: "tila",
      topic: "hookit",
      title: { fi: "Tila", en: "State" },
      blurb: {
        fi: "useState muistaa arvon piirrosten välillä. Asetin vaihtaa arvon ja React piirtää komponentin uudestaan.",
        en: "useState remembers a value between draws. The setter changes the value and React draws the component again.",
      },
      points: [
        { fi: "Älä muuta tilaa sijoituksella. Kutsu asetinta.", en: "Do not change state by assignment. Call the setter." },
        { fi: "Alkuarvo annetaan vain ensimmäisellä kutsulla.", en: "The initial value is used only on the first call." },
      ],
      file: "Laskuri.jsx",
      code: `import { useState } from "react";

export function Laskuri() {
  const [n, setN] = useState(0);
  return (
    <button onClick={() => setN(n + 1)}>
      Napsautettu {n} kertaa
    </button>
  );
}`,
      theory: {
        fi: `**Tila** on arvo, jonka pitää säilyä, kun funktio on jo päättynyt. Tavallinen paikallinen muuttuja syntyy uudestaan joka piirrolla. §useState(0)§ palauttaa parin: nykyisen arvon ja funktion, jolla arvo vaihdetaan.

§setN(n + 1)§ ei muuta lukua kesken tätä funktiota. Se pyytää Reactia piirtämään komponentin uudestaan uudella luvulla. Siksi näytöllä näkyvä luku päivittyy vasta seuraavassa piirrossa.

>> Älä kutsu asetinta suoraan funktion rungossa ilman tapahtumaa. Se pyytäisi uutta piirtoa heti ja piirto pyytäisi taas uutta. Asetin kuuluu napsautukseen tai muuhun tapahtumaan.`,
        en: `**State** is a value that must survive after the function has finished. An ordinary local variable is created again on every draw. §useState(0)§ returns a pair: the current value and a function that replaces it.

§setN(n + 1)§ does not change the number in the middle of this function. It asks React to draw the component again with the new number. The number on screen updates on the next draw.

>> Do not call the setter directly in the function body without an event. It would ask for a new draw immediately, and that draw would ask again. The setter belongs in a click or another event.`,
      },
      tags: ["usestate", "state", "tila", "hook", "react"],
    },
    {
      id: "tapahtuma",
      topic: "ohjaus",
      title: { fi: "Tapahtuma", en: "An event" },
      blurb: {
        fi: "onClick saa funktion. React kutsuu sitä, kun käyttäjä napsauttaa elementtiä.",
        en: "onClick receives a function. React calls it when the user clicks the element.",
      },
      points: [
        { fi: "onClick={lisaa} antaa funktion. onClick={lisaa()} kutsuu sen heti.", en: "onClick={lisaa} passes the function. onClick={lisaa()} calls it immediately." },
        { fi: "Nimi alkaa on-etuliitteellä: onChange, onSubmit.", en: "The name starts with on: onChange, onSubmit." },
      ],
      file: "Nappi.jsx",
      code: `export function Nappi({ onLisaa }) {
  return <button onClick={onLisaa}>Lisää mittaus</button>;
}`,
      theory: {
        fi: `**Tapahtuma** on käyttäjän teko. §onClick§ ei ole kutsun tulos vaan funktio, jonka React kutsuu myöhemmin. Sulkeet paikallaan §onClick={lisaa()}§ ajavat funktion heti piirron aikana. Ilman sulkeita §onClick={lisaa}§ vasta antaa funktion odottamaan.

Lomakkeen kentässä §onChange§ saa tapahtumaolion. Kentän teksti on §event.target.value§. Se on aina merkkijono, myös numerokentässä. Luvuksi muuttaminen on oma askeleensa.

>> Jos painike on §form§-tunnisteen sisällä, anna sille §type="button"§, ellei sen pidä lähettää lomaketta. Muuten selain lähettää lomakkeen ja sivu latautuu uudestaan.`,
        en: `An **event** is something the user does. §onClick§ is not the result of a call. It is a function React calls later. Parentheses in §onClick={lisaa()}§ run the function during the draw. Without them, §onClick={lisaa}§ only hands the function over to wait.

On a form field, §onChange§ receives an event object. The field's text is §event.target.value§. It is always a string, even on a number field. Turning it into a number is a separate step.

>> If a button sits inside a §form§ tag, give it §type="button"§ unless it should send the form. Otherwise the browser sends the form and the page loads again.`,
      },
      tags: ["onclick", "onchange", "event", "tapahtuma", "react"],
    },
    {
      id: "ehto",
      topic: "ohjaus",
      title: { fi: "Ehdollinen näyttö", en: "Conditional display" },
      blurb: {
        fi: "Tavallinen if valitsee, mitä palautetaan. && näyttää elementin vain, kun ehto on tosi.",
        en: "An ordinary if chooses what to return. && shows an element only when the condition is true.",
      },
      points: [
        { fi: "Älä laita pelkkää lukua &&-merkin vasemmalle puolelle. 0 näkyisi sivulla.", en: "Do not put a bare number on the left of &&. 0 would show up on the page." },
        { fi: "Kolmoisehto sopii lyhyeen valintaan kahden elementin välillä.", en: "A ternary fits a short choice between two elements." },
      ],
      file: "Tila.jsx",
      code: `export function Tulos({ virta }) {
  if (virta == null) {
    return <p>Virtaa ei ole laskettu.</p>;
  }
  return (
    <p>
      I = {virta} A
      {virta > 0.5 && <strong> Suuri virta.</strong>}
    </p>
  );
}`,
      theory: {
        fi: `**Ehto** valitsee, mikä elementti palautetaan. Funktion alussa oleva §if§ voi palauttaa kokonaan eri puun, esimerkiksi virheilmoituksen. Silloin alempaa koodia ei ajeta.

Keskellä JSX:ää §ehto && <strong>…</strong>§ näyttää elementin vain, kun ehto on tosi. Jos ehto on epätosi, paikalle ei tule mitään. Älä kirjoita ehtoon pelkkää lukua. Luku §0§ on epätosi, mutta React tulostaisi numeron 0 sivulle.

>> Kolmoisehto §valmis ? <p>Valmis</p> : <p>Kesken</p>§ on if ja else yhdellä rivillä. Jos haarat kasvavat, siirrä valinta funktion alkuun tavalliseen if-lauseeseen.`,
        en: `A **condition** chooses which element to return. An §if§ at the start of the function can return a completely different tree, for example an error. The code below it does not run.

In the middle of JSX, §ehto && <strong>…</strong>§ shows the element only when the condition is true. When the condition is false, nothing is put there. Do not write a bare number as the condition. The number §0§ is falsy, but React would print the digit 0 on the page.

>> The ternary §valmis ? <p>Valmis</p> : <p>Kesken</p>§ is if and else on one line. If the branches grow, move the choice to an ordinary if at the start of the function.`,
      },
      tags: ["if", "ehto", "conditional", "&&", "react"],
    },
    {
      id: "lista",
      topic: "rakenne",
      title: { fi: "Lista ja avain", en: "A list and a key" },
      blurb: {
        fi: "map muuttaa taulukon elementeiksi. Jokainen elementti tarvitsee key-arvon, joka ei vaihdu.",
        en: "map turns an array into elements. Each element needs a key that does not change.",
      },
      points: [
        { fi: "key ei ole prop, jota luet komponentin sisällä.", en: "key is not a prop you read inside the component." },
        { fi: "Älä käytä järjestysnumeroa avaimena, jos listan järjestys muuttuu.", en: "Do not use the index as the key if the list order changes." },
      ],
      file: "Mittaukset.jsx",
      code: `export function Mittaukset({ rivit }) {
  return (
    <ul>
      {rivit.map((rivi) => (
        <li key={rivi.id}>
          {rivi.nimi}: {rivi.virta} A
        </li>
      ))}
    </ul>
  );
}`,
      theory: {
        fi: `**Lista** piirretään §map§-metodilla. Taulukon jokaisesta arvosta palautetaan elementti. JSX:n aaltosulkeet saavat sisältää tämän lausekkeen, koska map palauttaa taulukon elementtejä ja React osaa näyttää sen.

§key§ kertoo, mikä kohta on sama seuraavassa piirrossa. Käytä tietokannan tai listan omaa id-arvoa. Järjestysnumero toimii vain, jos lista ei koskaan järjestäydy uudestaan eikä siitä poisteta kohtia keskeltä.

>> Avain on Reactille, ei sinulle. Jos tarvitset id:n myös komponentin sisällä, anna se tavallisena propina: §id={rivi.id}§.`,
        en: `A **list** is drawn with §map§. You return an element for each value in the array. The braces in JSX may contain that expression, because map returns an array of elements and React knows how to show it.

§key§ says which item is the same on the next draw. Use the item's own id from the data. The index works only when the list is never reordered and items are never removed from the middle.

>> The key is for React, not for you. If you also need the id inside the component, pass it as an ordinary prop: §id={rivi.id}§.`,
      },
      tags: ["map", "key", "lista", "list", "react"],
    },
    {
      id: "kooste",
      topic: "komponentit",
      title: { fi: "Koostaminen", en: "Composition" },
      blurb: {
        fi: "Pieni komponentti tekee yhden asian. Sivu kootaan niistä, sen sijaan että yksi funktio piirtäisi kaiken.",
        en: "A small component does one thing. A page is assembled from them, instead of one function drawing everything.",
      },
      points: [
        { fi: "children on se sisältö, joka kirjoitetaan alkavan ja lopettavan tunnisteen väliin.", en: "children is the content written between the opening and closing tag." },
        { fi: "Nosta tila sille komponentille, joka antaa sen useammalle lapselle.", en: "Lift state to the component that passes it to more than one child." },
      ],
      file: "Sivu.jsx",
      code: `function Paneeli({ children }) {
  return <section className="kortti">{children}</section>;
}

export function Sivu() {
  return (
    <Paneeli>
      <h2>Mittaus</h2>
      <Mittaus jannite={12} vastus={220} />
    </Paneeli>
  );
}`,
      theory: {
        fi: `**Koostaminen** tarkoittaa, että iso näkymä on pienten funktioiden puu. §Paneeli§ ei tiedä, onko sisällä mittaus vai ohje. Sen §children§ on se, mitä kutsuja kirjoittaa tunnisteiden väliin.

Tila elää siinä komponentissa, joka tarvitsee sitä. Jos kaksi lasta näyttää saman luvun, luku nostetaan niiden yhteiselle vanhemmalle ja annetaan alas propseina. Lasta ei käydä muuttamassa ulkoa.

>> Hyvä komponentti on helppo lukea ääneen: *paneeli, jonka sisällä on otsikko ja mittaus*. Jos funktion nimi tarvitsee sanan *ja* kaksi kertaa, jaa se.`,
        en: `**Composition** means a large view is a tree of small functions. §Paneeli§ does not know whether the inside is a measurement or instructions. Its §children§ is whatever the caller writes between the tags.

State lives in the component that needs it. If two children show the same number, lift the number to their shared parent and pass it down as props. Do not reach into a child and change it from outside.

>> A good component can be read aloud: *a panel that contains a heading and a measurement*. If the function's name needs the word *and* twice, split it.`,
      },
      tags: ["children", "composition", "kooste", "component", "react"],
    },
    {
      id: "elementit",
      topic: "komponentit",
      title: { fi: "HTML-elementit", en: "HTML elements" },
      blurb: {
        fi: "Pienellä kirjoitettu nimi on selaimen elementti. React välittää sen DOM:iin. Osa HTML-nimistä on eri.",
        en: "A lowercase name is a browser element. React passes it to the DOM. Some HTML names are different.",
      },
      points: [
        { fi: "class on className. for on htmlFor.", en: "class is className. for is htmlFor." },
        { fi: "style saa olion, ja nimet ovat camelCase: backgroundColor.", en: "style receives an object, and the names are camelCase: backgroundColor." },
        { fi: "Tyhjä elementti suljetaan itse: <img /> ja <input />.", en: "An empty element closes itself: <img /> and <input />." },
      ],
      file: "Elementit.jsx",
      code: `export function Kentta() {
  return (
    <label htmlFor="jannite">
      Jännite
      <input id="jannite" className="kentta" />
    </label>
  );
}`,
      theory: {
        fi: `**Isäntäkomponentti** on se HTML-tunniste, jonka React luo selaimeen. §<button>§, §<input>§, §<img>§, §<a>§, §<ul>§ ja §<li>§ toimivat kuten HTML:ssä, mutta ne kirjoitetaan JavaScriptin sisään. Pieni alkukirjain tarkoittaa selainta. Iso alkukirjain tarkoittaa sinun funktiotasi.

Muutama nimi vaihtuu, koska sana on varattu tai koska JSX ei ole HTML. Luokka on §className§. Nimikkeen for on §htmlFor§. Tyhjä tunniste pitää sulkea: §<img alt="" />§. Taulukko, lomake, otsikko ja kappale ovat yhä niitä samoja elementtejä kuin HTML-osiossa.

>> §style={{ color: "#9a3412" }}§ on olio, ei merkkijono. Ominaisuuden nimi on camelCase, kuten §backgroundColor§. Väri itsessään on silti [[CSS-heksa|color]]. Isoja tyylejä ei kasata tähän olioon, vaan luokkaan.`,
        en: `A **host component** is the HTML tag React creates in the browser. §<button>§, §<input>§, §<img>§, §<a>§, §<ul>§ and §<li>§ work as in HTML, but they are written inside JavaScript. A lowercase letter means the browser. A capital letter means your function.

A few names change, because the word is reserved or because JSX is not HTML. The class is §className§. A label's for is §htmlFor§. An empty tag must close itself: §<img alt="" />§. A table, a form, a heading and a paragraph are still the same elements as in the HTML section.

>> §style={{ color: "#9a3412" }}§ is an object, not a string. The property name is camelCase, such as §backgroundColor§. The color itself is still a [[CSS hex|color]]. Do not pile large styles into this object. Put them in a class.`,
      },
      tags: ["div", "button", "input", "classname", "htmlfor", "host"],
    },
    {
      id: "fragment",
      topic: "komponentit",
      title: { fi: "Fragmentti", en: "A fragment" },
      blurb: {
        fi: "<>...</> palauttaa useita elementtejä ilman ylimääräistä laatikkoa DOM:iin.",
        en: "<>...</> returns several elements without an extra box in the DOM.",
      },
      points: [
        { fi: "Pitkä muoto on <Fragment key={id}>, kun listassa tarvitaan avain.", en: "The long form is <Fragment key={id}> when a list needs a key." },
        { fi: "Fragmentille ei voi antaa className-arvoa.", en: "A fragment cannot take a className." },
      ],
      file: "Fragmentti.jsx",
      code: `export function Otsake() {
  return (
    <>
      <h1>Mittaus</h1>
      <p>U = 12 V</p>
    </>
  );
}`,
      theory: {
        fi: `**Fragmentti** on näkymätön kääre. Funktio saa palauttaa vain yhden puun. Jos haluat otsikon ja kappaleen vierekkäin ilman ylimääräistä §div§-laatikkoa, kääri ne merkkeihin §<>§ ja §</>§. DOM:iin tulee vain h1 ja p, ei ylimääräistä elementtiä, joka rikkoisi flexin tai taulukon rivin.

Lyhyt muoto ei voi ottaa avainta. Listassa, jonka kohta on kaksi elementtiä, kirjoita §<Fragment key={id}>§ ja tuo Fragment react-paketista. Avain on edelleen Reactille, ei tyylille.

>> Älä käytä fragmenttia, jos lapset tarvitsevat yhteisen laatikon. Silloin §section§ tai §div§ on oikea, koska sille voi antaa luokan ja tapahtuman. Fragmentti on vain ryhmittely palautusta varten.`,
        en: `A **fragment** is an invisible wrapper. A function may return only one tree. If you want a heading and a paragraph side by side without an extra §div§ box, wrap them in §<>§ and §</>§. The DOM receives only the h1 and the p, not an extra element that would break a flex row or a table row.

The short form cannot take a key. In a list whose item is two elements, write §<Fragment key={id}>§ and import Fragment from the react package. The key is still for React, not for styling.

>> Do not use a fragment when the children need a shared box. Then a §section§ or a §div§ is right, because it can take a class and an event. A fragment is only a grouping for the return.`,
      },
      tags: ["fragment", "<>", "key", "komponentti"],
    },
    {
      id: "strict",
      topic: "komponentit",
      title: { fi: "StrictMode", en: "StrictMode" },
      blurb: {
        fi: "StrictMode ei piirrä mitään. Se ajaa lapsen tarkistukset kehityksessä ja auttaa huomaamaan epäpuhtaan koodin.",
        en: "StrictMode draws nothing. In development it runs extra checks on its child and helps you notice impure code.",
      },
      points: [
        { fi: "Kehityksessä lapsi voidaan ajaa kahdesti. Sivuvaikutus ei saa olla piirrossa.", en: "In development the child may run twice. A side effect must not sit in the render." },
        { fi: "Tuotantoon ei jää kahdenkertaista ajoa.", en: "The double render does not stay in production." },
      ],
      file: "Strict.jsx",
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      theory: {
        fi: `**StrictMode** on komponentti, joka ei tuota HTML:ää. Se käärii puun, yleensä koko sovelluksen, ja pyytää Reactia tarkistamaan sen kehitystilassa. Piirtofunktio voidaan kutsua kahdesti. Jos funktio lisää laskuria tai kirjoittaa tiedostoon piirron aikana, näet tuloksen kahdesti ja tiedät, että työ oli väärässä paikassa.

Tuotannossa tarkistuksia ei ajeta kahdesti. StrictMode ei ole tyyli eikä ehto. Se ei piilota lapsia. Se vain tekee kehityksen aikana näkyväksi sen, mikä muuten hajoaisi myöhemmin.

>> Sivuvaikutus, kuten tietojen haku tai ajastin, kuuluu §useEffect§-hookiin, ei funktion runkoon. Jos luku kasvaa itsestään sivua avatessa, etsi sijoitus, joka tapahtuu suoraan komponentin rungossa.`,
        en: `**StrictMode** is a component that produces no HTML. It wraps the tree, usually the whole application, and asks React to check it in development. The render function may be called twice. If the function increments a counter or writes a file during render, you see the result twice and you know the work was in the wrong place.

In production the checks are not run twice. StrictMode is not a style and not a condition. It does not hide children. It only makes visible, during development, something that would otherwise break later.

>> A side effect, such as loading data or a timer, belongs in the §useEffect§ hook, not in the function body. If a number grows by itself when the page opens, look for an assignment that happens directly in the component body.`,
      },
      tags: ["strictmode", "render", "pure", "komponentti"],
    },
    {
      id: "suspense",
      topic: "komponentit",
      title: { fi: "Suspense ja lazy", en: "Suspense and lazy" },
      blurb: {
        fi: "lazy lataa komponentin myöhemmin. Suspense näyttää varanäkymän, kunnes lataus on valmis.",
        en: "lazy loads a component later. Suspense shows a fallback until the load has finished.",
      },
      points: [
        { fi: "fallback on se elementti, joka näkyy odotuksen ajan.", en: "fallback is the element shown while waiting." },
        { fi: "lazy saa funktion, joka palauttaa import()-kutsun.", en: "lazy receives a function that returns an import() call." },
      ],
      file: "Suspense.jsx",
      code: `import { lazy, Suspense } from "react";

const Kuvaaja = lazy(() => import("./Kuvaaja"));

export function Sivu() {
  return (
    <Suspense fallback={<p>Ladataan kuvaajaa…</p>}>
      <Kuvaaja />
    </Suspense>
  );
}`,
      theory: {
        fi: `**lazy** jakaa koodin. §lazy(() => import("./Kuvaaja"))§ ei lataa tiedostoa heti, vaan vasta kun komponentti pitää piirtää. Selain hakee silloin erillisen paketin. Ensimmäisellä kerralla komponenttia ei vielä ole, joten React tarvitsee paikan, jossa odotus näkyy.

**Suspense** on se paikka. §fallback§ on elementti odotuksen ajaksi, yleensä lyhyt teksti tai tyhjä kortti. Kun moduuli saapuu, fallback vaihtuu oikeaan komponenttiin. Suspense ei itse hae dataa. Se vain näyttää varan, kun lapsi sanoo olevansa kesken.

>> Älä laiska-lataa jokaista nappia. Lataa harvoin avattava, raskas osa, kuten kuvaaja. Pieni komponentti kannattaa pitää samassa paketissa, jotta sivu ei tee kymmentä pientä hakua.`,
        en: `**lazy** splits the code. §lazy(() => import("./Kuvaaja"))§ does not load the file immediately, only when the component has to be drawn. The browser then fetches a separate bundle. The first time, the component is not here yet, so React needs a place where the wait is visible.

**Suspense** is that place. §fallback§ is the element for the wait, usually a short text or an empty card. When the module arrives, the fallback is replaced by the real component. Suspense does not fetch data by itself. It only shows a stand-in when a child says it is not ready.

>> Do not lazy-load every button. Load a rarely opened, heavy piece, such as a chart. A small component should stay in the same bundle, so the page does not make ten tiny requests.`,
      },
      tags: ["suspense", "lazy", "fallback", "komponentti"],
    },
    {
      id: "effect",
      topic: "hookit",
      title: { fi: "useEffect", en: "useEffect" },
      blurb: {
        fi: "useEffect ajaa sivuvaikutuksen piirron jälkeen. Riippuvuuslista kertoo, milloin se ajetaan uudestaan.",
        en: "useEffect runs a side effect after the draw. The dependency list says when it runs again.",
      },
      points: [
        { fi: "Tyhjä lista [] ajaa efektin vain ensimmäisen piirron jälkeen.", en: "An empty list [] runs the effect only after the first draw." },
        { fi: "Palautettu funktio on siivous. Se ajetaan ennen uutta ajoa ja kun komponentti poistuu.", en: "The returned function is cleanup. It runs before the next run and when the component leaves." },
      ],
      file: "Effect.jsx",
      code: `import { useEffect, useState } from "react";

export function Kello() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{time}</p>;
}`,
      theory: {
        fi: `**useEffect** on paikka työlle, joka ei ole pelkkä lasku piirron aikana. Ajastin, tapahtumakuuntelija ja verkkohaku kuuluvat tänne. Funktio ajetaan sen jälkeen, kun React on piirtänyt komponentin ruudulle. Näin efekti näkee valmiin puun.

Toinen argumentti on lista arvoista, joita efekti lukee. Tyhjä lista tarkoittaa: aja kerran alussa. Jos listassa on §id§, efekti ajetaan uudestaan, kun id vaihtuu. Siivousfunktio, jonka palautat, sammuttaa edellisen ajastimen ennen uutta. Ilman sitä ajastimia jää päällekkäin.

>> Älä päivitä tilaa efektissä ilman ehtoa, jos sama tila on riippuvuuslistassa. Se pyytää uuden piirron, joka pyytää uuden efektin. Ajastin on oikein, koska se ei riipu omasta tuloksestaan listan kautta.`,
        en: `**useEffect** is the place for work that is not a pure calculation during render. A timer, an event listener and a network request belong here. The function runs after React has drawn the component on screen. The effect then sees the finished tree.

The second argument is the list of values the effect reads. An empty list means: run once at the start. If the list contains §id§, the effect runs again when id changes. The cleanup function you return turns off the previous timer before the next one. Without it, timers stack.

>> Do not update state in an effect without a condition when that same state is in the dependency list. It asks for a new draw, which asks for a new effect. A timer is fine, because it does not depend on its own result through the list.`,
      },
      tags: ["useeffect", "effect", "cleanup", "hook"],
    },
    {
      id: "ref",
      topic: "hookit",
      title: { fi: "useRef", en: "useRef" },
      blurb: {
        fi: "useRef säilyttää laatikon, jonka current-kenttä ei aiheuta uutta piirtoa.",
        en: "useRef keeps a box whose current field does not cause a new draw.",
      },
      points: [
        { fi: "ref={solmu} inputille antaa solmun current-kenttään piirron jälkeen.", en: "ref={node} on an input puts the node in current after the draw." },
        { fi: "Älä lue current-arvoa piirron aikana ja oletä, että se on jo päivittynyt.", en: "Do not read current during render and assume it has already updated." },
      ],
      file: "Ref.jsx",
      code: `import { useRef } from "react";

export function Haku() {
  const kentta = useRef(null);
  return (
    <>
      <input ref={kentta} />
      <button onClick={() => kentta.current?.focus()}>Kohdista</button>
    </>
  );
}`,
      theory: {
        fi: `**useRef** on laatikko, joka säilyy piirrosta toiseen. §kentta.current§ voi olla DOM-solmu tai mikä tahansa arvo, jonka muutoksen ei pidä piirtää komponenttia uudestaan. Tilasta se eroaa juuri tässä: §setState§ pyytää uuden piirron, ref ei.

Kun annat §ref={kentta}§ elementille, React kirjoittaa solmun §current§-kenttään sen jälkeen, kun elementti on ruudulla. §kentta.current.focus()§ siirtää kirjoituskohdan kenttään. Jos current on vielä null, elementtiä ei ole ehditty liittää. Siksi kutsu kuuluu tapahtumaan, ei piirron keskelle.

>> Älä käytä refiä tietoon, joka pitää näkyä ruudulla. Nimi, luku ja virheteksti ovat tilaa. Ref on kahva solmuun tai muisti arvolle, jota käyttöliittymä ei näytä.`,
        en: `**useRef** is a box that survives from one draw to the next. §kentta.current§ can be a DOM node or any value whose change should not draw the component again. It differs from state in exactly that: §setState§ asks for a new draw, a ref does not.

When you pass §ref={kentta}§ to an element, React writes the node into §current§ after the element is on screen. §kentta.current.focus()§ moves the cursor into the field. If current is still null, the element has not been attached yet. That is why the call belongs in an event, not in the middle of the render.

>> Do not use a ref for information that must show on screen. A name, a number and an error text are state. A ref is a handle to a node, or a memory for a value the interface does not show.`,
      },
      tags: ["useref", "ref", "focus", "hook"],
    },
    {
      id: "context",
      topic: "hookit",
      title: { fi: "useContext", en: "useContext" },
      blurb: {
        fi: "createContext ja useContext vievät arvon puussa ilman, että jokainen välikerros ottaa sen propsina.",
        en: "createContext and useContext carry a value through the tree without every layer taking it as a prop.",
      },
      points: [
        { fi: "Providerin value on se arvo, jonka useContext palauttaa alapuolella.", en: "The Provider's value is what useContext returns below it." },
        { fi: "Älä laita usein vaihtuvaa tilaa kontekstiin, jota koko sivu lukee.", en: "Do not put often-changing state in a context the whole page reads." },
      ],
      file: "Context.jsx",
      code: `import { createContext, useContext } from "react";

const Kieli = createContext("fi");

export function Sivu() {
  return (
    <Kieli.Provider value="en">
      <Teksti />
    </Kieli.Provider>
  );
}

function Teksti() {
  const kieli = useContext(Kieli);
  return <p>{kieli}</p>;
}`,
      theory: {
        fi: `**Konteksti** on nimetty arvo, joka näkyy puussa alaspäin. §createContext("fi")§ luo oletuksen. §Provider§ vaihtaa arvon omille lapsilleen. §useContext(Kieli)§ lukee lähimmän Providerin. Ilman Provideria saat oletuksen.

Tämä välttää propsien ketjun, jossa viisi välikomponenttia vain siirtää kielen eteenpäin käyttämättä sitä. Kieli, teema ja kirjautunut käyttäjä ovat tyypillisiä. Mittauksen yksittäinen luku ei ole. Se kulkee propsina, koska vain yksi lapsi tarvitsee sitä.

>> Kun Providerin value on uusi olio joka piirrolla, kaikki lukijat piirtyvät uudestaan. Pidä arvona merkkijono, luku tai muista olio §useMemo§-hookilla, jos se ei oikeasti vaihtunut.`,
        en: `**Context** is a named value that is visible downward through the tree. §createContext("fi")§ creates the default. A §Provider§ replaces the value for its own children. §useContext(Kieli)§ reads the nearest Provider. Without a Provider you get the default.

This avoids a prop chain where five components in the middle only pass a language onward without using it. Language, theme and the signed-in user are typical. A single measurement is not. It travels as a prop, because only one child needs it.

>> When the Provider's value is a new object on every draw, every reader draws again. Keep the value a string, a number, or remember the object with §useMemo§ when it did not actually change.`,
      },
      tags: ["usecontext", "provider", "context", "hook"],
    },
    {
      id: "reducer",
      topic: "hookit",
      title: { fi: "useReducer", en: "useReducer" },
      blurb: {
        fi: "useReducer sopii, kun seuraava tila riippuu edellisestä usealla eri toiminnolla.",
        en: "useReducer fits when the next state depends on the previous one through several different actions.",
      },
      points: [
        { fi: "Reducer on puhdas funktio: (tila, toiminto) => uusi tila.", en: "A reducer is a pure function: (state, action) => new state." },
        { fi: "dispatch ei saa olla piirron sivuvaikutus.", en: "dispatch must not be a side effect of rendering." },
      ],
      file: "Reducer.jsx",
      code: `import { useReducer } from "react";

function reduce(state, action) {
  if (action.type === "lisaa") return { n: state.n + 1 };
  return state;
}

export function Laskuri() {
  const [state, dispatch] = useReducer(reduce, { n: 0 });
  return <button onClick={() => dispatch({ type: "lisaa" })}>{state.n}</button>;
}`,
      theory: {
        fi: `**useReducer** jakaa tilan kahtia. Reducer-funktio laskee uuden tilan vanhasta ja toiminnosta. Se ei piirrä eikä hae verkosta. §dispatch({ type: "lisaa" })§ lähettää toiminnon, ja React ajaa reducerin ja piirtää uudestaan.

Tämä on selkeämpi kuin monta §setState§-kutsua, kun samalla oliolla on useita sääntöjä: lisää, vähennä, nollaa. Jokainen sääntö on yksi haara. Toiminto on tavallinen olio, jonka §type§ nimeää haaran.

>> Älä muuta state-oliota reducerin sisällä. Palauta uusi olio. Jos kirjoitat §state.n = state.n + 1§ ja palautat saman olion, React voi luulla, ettei mikään muuttunut.`,
        en: `**useReducer** splits state in two. The reducer function computes the new state from the old one and an action. It does not draw and it does not fetch. §dispatch({ type: "lisaa" })§ sends the action, and React runs the reducer and draws again.

This is clearer than many §setState§ calls when the same object has several rules: add, subtract, reset. Each rule is one branch. An action is an ordinary object whose §type§ names the branch.

>> Do not change the state object inside the reducer. Return a new object. If you write §state.n = state.n + 1§ and return the same object, React may think nothing changed.`,
      },
      tags: ["usereducer", "dispatch", "reducer", "hook"],
    },
    {
      id: "memo",
      topic: "hookit",
      title: { fi: "useMemo ja useCallback", en: "useMemo and useCallback" },
      blurb: {
        fi: "useMemo muistaa laskun tuloksen. useCallback muistaa funktion. Molemmat laskevat uudestaan, kun riippuvuus vaihtuu.",
        en: "useMemo remembers a calculation. useCallback remembers a function. Both recompute when a dependency changes.",
      },
      points: [
        { fi: "Älä kääri jokaista lukua. Muista vain kallis työ.", en: "Do not wrap every number. Remember only expensive work." },
        { fi: "Riippuvuuslista on sama ajatus kuin useEffectissä.", en: "The dependency list is the same idea as in useEffect." },
      ],
      file: "Memo.jsx",
      code: `import { useMemo } from "react";

export function Summa({ rivit }) {
  const yhteensa = useMemo(
    () => rivit.reduce((sum, rivi) => sum + rivi.virta, 0),
    [rivit]
  );
  return <p>{yhteensa} A</p>;
}`,
      theory: {
        fi: `**useMemo** tallentaa laskun tuloksen. Funktio ajetaan uudestaan vain, kun listan arvo, tässä §rivit§, on vaihtunut. Jos rivit ovat sama taulukko, edellinen summa palautetaan. Tämä auttaa, kun lasku on pitkä. Yhden yhteenlaskun muistaminen ei nopeuta mitään.

**useCallback** on sama funktioille. Se palauttaa saman funktion, kunnes riippuvuus vaihtuu. Sitä tarvitaan, kun lapsi on merkitty §memo§-funktiolla ja et halua sen piirtyvän vain siksi, että vanhempi loi uuden funktion.

>> Muistaminen voi itse olla kalliimpaa kuin lasku. Lisää useMemo vasta, kun olet nähnyt turhan työn. Oikea ensimmäinen korjaus on pitää tila siellä, missä sitä käytetään, ei muistaa kaikkea.`,
        en: `**useMemo** stores the result of a calculation. The function runs again only when a value in the list, here §rivit§, has changed. If the rows are the same array, the previous sum is returned. This helps when the calculation is long. Remembering one addition does not speed anything up.

**useCallback** is the same thing for functions. It returns the same function until a dependency changes. You need it when a child is wrapped in §memo§ and you do not want it to draw only because the parent created a new function.

>> Remembering can itself cost more than the calculation. Add useMemo only after you have seen wasted work. The right first fix is to keep state where it is used, not to remember everything.`,
      },
      tags: ["usememo", "usecallback", "memo", "hook"],
    },
    {
      id: "oma-hook",
      topic: "hookit",
      title: { fi: "Oma hook", en: "A custom hook" },
      blurb: {
        fi: "Oma hook on funktio, jonka nimi alkaa use-sanalla ja joka saa kutsua muita hookeja.",
        en: "A custom hook is a function whose name starts with use and that may call other hooks.",
      },
      points: [
        { fi: "Hookia kutsutaan aina komponentin ylimmällä tasolla, ei ehdon sisällä.", en: "Call a hook at the top level of the component, not inside a condition." },
        { fi: "Jokaisella komponentilla on omat hookkien tilat. Hook ei ole jaettu muuttuja.", en: "Each component has its own hook state. A hook is not a shared variable." },
      ],
      file: "useToggle.js",
      code: `import { useState } from "react";

export function useToggle(start = false) {
  const [on, setOn] = useState(start);
  function toggle() {
    setOn((value) => !value);
  }
  return [on, toggle];
}`,
      theory: {
        fi: `**Oma hook** nimeää tilan ja siihen kuuluvat toiminnot, jotta samaa koodia ei kopioida. §useToggle§ kutsuu §useState§. Nimi alkaa sanalla use, jotta lukija näkee heti, että funktiolla on hookin säännöt. Sääntö on: hookeja kutsutaan joka piirrolla samassa järjestyksessä, ei if-lauseen sisällä eikä silmukassa.

Hook ei jaa tilaa kutsujien kesken. Kaksi komponenttia, jotka kutsuvat useToggle, saavat kumpikin oman boolean-arvon. Jaettu tieto kulkee kontekstin tai yhteisen vanhemman kautta.

>> Palauta taulukko tai olio, älä pelkkää asetinfunktiota ilman arvoa. Kutsujan pitää nähdä nykyinen tila. §setOn((value) => !value)§ käyttää edellistä arvoa, joten kaksi nopeaa napsautusta ei jää samaan vanhaan arvoon.`,
        en: `A **custom hook** names a piece of state and the actions that belong to it, so the same code is not copied. §useToggle§ calls §useState§. The name starts with use, so the reader sees at once that the function follows the rules of hooks. The rule is: hooks are called on every draw in the same order, not inside an if and not inside a loop.

A hook does not share state between callers. Two components that call useToggle each get their own boolean. Shared information travels through context or a shared parent.

>> Return an array or an object, not only a setter without the value. The caller has to see the current state. §setOn((value) => !value)§ uses the previous value, so two fast clicks do not both read the same old value.`,
      },
      tags: ["custom hook", "use", "hook", "oma"],
    },
    {
      id: "lomake",
      topic: "tieto",
      title: { fi: "Ohjattu kenttä", en: "A controlled field" },
      blurb: {
        fi: "Kentän value on tila ja onChange kirjoittaa sen. React on silloin kentän ainoa lähde.",
        en: "The field's value is state and onChange writes it. React is then the field's only source.",
      },
      points: [
        { fi: "value ilman onChangea lukitsee kentän.", en: "value without onChange locks the field." },
        { fi: "event.target.value on aina merkkijono.", en: "event.target.value is always a string." },
      ],
      file: "Lomake.jsx",
      code: `import { useState } from "react";

export function Jannite() {
  const [text, setText] = useState("12");
  const volts = Number(text);
  return (
    <label>
      Jännite
      <input value={text} onChange={(event) => setText(event.target.value)} />
      {Number.isNaN(volts) ? <p>Ei luku.</p> : <p>{volts} V</p>}
    </label>
  );
}`,
      theory: {
        fi: `**Ohjattu kenttä** näyttää sen, mitä tilassa on. §value={text}§ tekee Reactista lähteen. Jokainen näppäin kutsuu §onChange§, joka kirjoittaa uuden merkkijonon tilaan, ja seuraava piirto näyttää sen. Jos value on annettu eikä onChange päivitä sitä, kenttä ei muutu kirjoittaessa.

§event.target.value§ on merkkijono myös numerokentässä. §Number(text)§ tekee siitä luvun. Tyhjä kenttä muuttuu nollaksi, ja kirjaimet tuottavat NaN. Näytä virhe NaN-tapauksessa, älä laske sillä.

>> Vaihtoehto on ohjaamaton kenttä: §ref§ ja luku vasta lähetyksessä. Ohjattu kenttä on selkeämpi, kun arvo näkyy muuallakin tai sitä tarkistetaan joka muutoksella.`,
        en: `A **controlled field** shows what is in state. §value={text}§ makes React the source. Each key calls §onChange§, which writes the new string into state, and the next draw shows it. If value is set and onChange does not update it, the field does not change as you type.

§event.target.value§ is a string even on a number field. §Number(text)§ turns it into a number. An empty field becomes zero, and letters produce NaN. Show an error for NaN. Do not calculate with it.

>> The alternative is an uncontrolled field: a §ref§ and a read only when the form is sent. A controlled field is clearer when the value is also shown elsewhere or checked on every change.`,
      },
      tags: ["input", "value", "onchange", "controlled", "lomake"],
    },
  ],
};

export { react };
