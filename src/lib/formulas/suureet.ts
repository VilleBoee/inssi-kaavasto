import type { Formula } from "./shared";
import {
  err,
  failed,
  fixed,
  formatNum,
  numField,
  ok,
  prefixExp,
  readNums,
  row,
  selectField,
  SI_PREFIXES,
  val,
} from "./shared";

export const suureet: Formula[] = [
  {
    id: "geometry",
    subcategory: "kappaleet",
    name: "Geometria",
    category: "suureet",
    blurb: "Pinta-ala ja tilavuus tavallisille kappaleille.",
    expression: "A = πr²,   V = 4/3 πr³",
    tags: ["pinta-ala", "tilavuus", "ympyrä", "pallo", "sylinteri", "geometry"],
    seed: { shape: "circle", w: "4", h: "3", r: "5", a: "2" },
    fields: (raw) => {
      const shape = val(raw, "shape", "circle");
      const head = selectField("shape", "Kappale", [
        { value: "rect", label: "Suorakulmio" },
        { value: "triangle", label: "Kolmio" },
        { value: "circle", label: "Ympyrä" },
        { value: "cube", label: "Kuutio" },
        { value: "sphere", label: "Pallo" },
        { value: "cylinder", label: "Sylinteri" },
      ]);
      if (shape === "rect") return [head, numField("w", "Leveys", undefined, "4"), numField("h", "Korkeus", undefined, "3")];
      if (shape === "triangle") return [head, numField("w", "Kanta", undefined, "4"), numField("h", "Korkeus", undefined, "3")];
      if (shape === "cube") return [head, numField("a", "Särmä", undefined, "2")];
      if (shape === "cylinder") return [head, numField("r", "Säde", undefined, "5"), numField("h", "Korkeus", undefined, "3")];
      return [head, numField("r", "Säde", undefined, "5")];
    },
    compute: (raw) => {
      const shape = val(raw, "shape", "circle");
      const pi = Math.PI;
      if (shape === "rect" || shape === "triangle") {
        const nums = readNums(raw, ["w", "h"]);
        if (failed(nums)) return nums;
        const [w, h] = nums;
        if (w <= 0 || h <= 0) return err("Mittojen pitää olla suurempia kuin 0.");
        if (shape === "rect") {
          return ok([
            row("area", "Pinta-ala", formatNum(w * h), undefined, true),
            row("per", "Piiri", formatNum(2 * (w + h))),
          ]);
        }
        return ok([row("area", "Pinta-ala", formatNum((w * h) / 2), undefined, true)]);
      }
      if (shape === "cube") {
        const nums = readNums(raw, ["a"]);
        if (failed(nums)) return nums;
        const [a] = nums;
        if (a <= 0) return err("Särmän pitää olla suurempi kuin 0.");
        return ok([
          row("vol", "Tilavuus", formatNum(a ** 3), undefined, true),
          row("area", "Pinta-ala", formatNum(6 * a * a)),
        ]);
      }
      if (shape === "cylinder") {
        const nums = readNums(raw, ["r", "h"]);
        if (failed(nums)) return nums;
        const [r, h] = nums;
        if (r <= 0 || h <= 0) return err("Mittojen pitää olla suurempia kuin 0.");
        return ok([
          row("vol", "Tilavuus", formatNum(pi * r * r * h), undefined, true),
          row("area", "Vaipan ja päätyjen ala", formatNum(2 * pi * r * (r + h))),
        ]);
      }
      const nums = readNums(raw, ["r"]);
      if (failed(nums)) return nums;
      const [r] = nums;
      if (r <= 0) return err("Säteen pitää olla suurempi kuin 0.");
      if (shape === "sphere") {
        return ok([
          row("vol", "Tilavuus", formatNum((4 / 3) * pi * r ** 3), undefined, true),
          row("area", "Pinta-ala", formatNum(4 * pi * r * r)),
        ]);
      }
      return ok([
        row("area", "Pinta-ala", formatNum(pi * r * r), undefined, true),
        row("circ", "Ympärysmitta", formatNum(2 * pi * r)),
      ]);
    },
  },
  {
    id: "density",
    subcategory: "kappaleet",
    name: "Tiheys",
    category: "suureet",
    blurb: "Tiheys, massa tai tilavuus. Yksiköt pysyvät johdonmukaisina.",
    expression: "ρ = m / V",
    note: "Esimerkki on grammoina ja kuutiosenttimetreinä. Vaihda kaikki kentät samassa mittajärjestelmässä.",
    tags: ["tiheys", "massa", "tilavuus", "density"],
    seed: { unknown: "rho", m: "2700", v: "1000", rho: "2,7" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "rho");
      const mode = selectField("unknown", "Ratkaistaan", [
        { value: "rho", label: "Tiheys ρ" },
        { value: "m", label: "Massa m" },
        { value: "v", label: "Tilavuus V" },
      ]);
      return [
        mode,
        numField("m", "Massa", "g", "2700"),
        numField("v", "Tilavuus", "cm³", "1000"),
        numField("rho", "Tiheys", "g/cm³", "2,7"),
      ].filter((f) => f.id !== unknown);
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "rho");
      const ids = ["m", "v", "rho"].filter((id) => id !== unknown);
      const known = readNums(raw, ids);
      if (failed(known)) return known;
      const map: Record<string, number> = {};
      ids.forEach((id, i) => {
        map[id] = known[i];
      });
      const pick = (id: string) => {
        const n = map[id];
        if (n === undefined) throw new Error("puuttuva suure");
        return n;
      };
      let m: number;
      let v: number;
      let rho: number;
      if (unknown === "rho") {
        m = pick("m");
        v = pick("v");
        if (v === 0) return err("Tilavuus ei voi olla 0.");
        rho = m / v;
      } else if (unknown === "m") {
        rho = pick("rho");
        v = pick("v");
        m = rho * v;
      } else {
        m = pick("m");
        rho = pick("rho");
        if (rho === 0) return err("Tiheys ei voi olla 0, jos tilavuus ratkaistaan.");
        v = m / rho;
      }
      return ok([
        row("rho", "Tiheys", formatNum(rho), "g/cm³", unknown === "rho"),
        row("m", "Massa", formatNum(m), "g", unknown === "m"),
        row("v", "Tilavuus", formatNum(v), "cm³", unknown === "v"),
      ]);
    },
  },
  {
    id: "kinematics",
    subcategory: "liike",
    name: "Tasaisesti kiihtyvä liike",
    category: "suureet",
    blurb: "Nopeus ja matka, kun alkunopeus, kiihtyvyys ja aika tunnetaan.",
    expression: "v = v₀ + at,   s = v₀t + ½at²",
    tags: ["kiihtyvyys", "nopeus", "matka", "kinematiikka", "liike"],
    seed: { v0: "0", a: "9,81", t: "2" },
    fields: fixed([
      numField("v0", "Alkunopeus v₀", "m/s", "0"),
      numField("a", "Kiihtyvyys a", "m/s²", "9,81"),
      numField("t", "Aika t", "s", "2"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["v0", "a", "t"]);
      if (failed(nums)) return nums;
      const [v0, a, t] = nums;
      if (t < 0) return err("Aika ei voi olla negatiivinen.");
      const v = v0 + a * t;
      const s = v0 * t + 0.5 * a * t * t;
      return ok([
        row("v", "Nopeus hetkellä t", formatNum(v), "m/s", true),
        row("s", "Siirtymä", formatNum(s), "m"),
        row("avg", "Keskinopeus", formatNum((v0 + v) / 2), "m/s"),
        row("check", "v² − v₀²", formatNum(v * v - v0 * v0), "m²/s²"),
      ]);
    },
  },
  {
    id: "temperature",
    subcategory: "liike",
    name: "Lämpötila",
    category: "suureet",
    blurb: "Celsius, Fahrenheit ja kelvin.",
    expression: "K = °C + 273,15,   °F = °C · 9/5 + 32",
    tags: ["lämpötila", "celsius", "fahrenheit", "kelvin"],
    seed: { value: "20", unit: "C" },
    fields: fixed([
      numField("value", "Lämpötila", undefined, "20"),
      selectField("unit", "Yksikkö", [
        { value: "C", label: "Celsius °C" },
        { value: "F", label: "Fahrenheit °F" },
        { value: "K", label: "Kelvin K" },
      ]),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["value"]);
      if (failed(nums)) return nums;
      const [value] = nums;
      const unit = val(raw, "unit", "C");
      let c: number;
      if (unit === "F") c = ((value - 32) * 5) / 9;
      else if (unit === "K") c = value - 273.15;
      else c = value;
      const k = c + 273.15;
      if (k < -1e-9) return err("Lämpötila on absoluuttisen nollapisteen alapuolella.");
      return ok([
        row("c", "Celsius", formatNum(c), "°C", unit === "C"),
        row("f", "Fahrenheit", formatNum((c * 9) / 5 + 32), "°F", unit === "F"),
        row("k", "Kelvin", formatNum(k), "K", unit === "K"),
      ]);
    },
  },
  {
    id: "si-jarjestelma",
    subcategory: "yksikot",
    name: "SI-järjestelmä",
    category: "suureet",
    blurb: "Johdannaissuureiden tunnukset ja kerrannaisyksiköiden etuliitteet.",
    expression: "U on jännite, V on voltti",
    note: "Jännitteen tunnuksia ovat V, ΔV, U ja E. Yksikkö on voltti, tunnus V. Tiheydellä ja jännityksellä ei ole erillistä johdannaisyksikköä tässä taulukossa. Vuoden 2022 etuliitteet ronna, quetta, ronto ja quecto eivät kuulu tähän listaan.",
    tags: [
      "si",
      "johdannainen",
      "yksikkö",
      "tunnus",
      "voltti",
      "newton",
      "pascal",
      "joule",
      "watti",
      "coulombi",
      "faradi",
      "ohmi",
      "siemens",
      "weber",
      "tesla",
      "henry",
      "hertsi",
      "radiaani",
      "luumen",
      "luksi",
      "jotta",
      "tsetta",
      "eksa",
      "peta",
      "femto",
      "atto",
      "tsepto",
      "jokto",
      "etuliite",
    ],
    seed: {},
    fields: () => [],
    compute: () => ({ status: "empty" }),
    tables: [
      {
        title: "Johdannaissuureita",
        columns: ["Suure", "Tunnus", "Yksikön nimi", "Yksikkö", "Perusyksiköinä"],
        rows: [
          ["tasokulma", "α, β, …", "radiaani", "rad", "1 rad = 1 m/m = 1"],
          ["avaruuskulma", "Ω, ω", "steradiaani", "sr", "1 sr = 1 m²/m² = 1"],
          ["taajuus", "f, ν", "hertsi", "Hz", "1 Hz = 1 s⁻¹"],
          ["voima", "F, G", "newton", "N", "1 N = 1 kg·m/s²"],
          ["paine", "p", "pascal", "Pa", "1 Pa = 1 N/m²"],
          ["tiheys", "ρ", "—", "—", "—"],
          ["jännitys", "σ, τ, R", "—", "—", "—"],
          ["energia, työ, lämpömäärä", "E, W, Q", "joule", "J", "1 J = 1 N·m"],
          ["teho, säteilyvirta", "P, Φ", "watti", "W", "1 W = 1 J/s"],
          ["sähkövaraus, sähkömäärä", "Q", "coulombi", "C", "1 C = 1 A·s"],
          ["sähköpotentiaali, potentiaaliero, jännite, smv", "V, ΔV, U, E", "voltti", "V", "1 V = 1 W/A"],
          ["kapasitanssi", "C", "faradi", "F", "1 F = 1 C/V"],
          ["resistanssi", "R", "ohmi", "Ω", "1 Ω = 1 V/A"],
          ["konduktanssi", "G", "siemens", "S", "1 S = 1 Ω⁻¹"],
          ["magneettivuo", "Φ", "weber", "Wb", "1 Wb = 1 V·s"],
          ["magneettivuon tiheys", "B", "tesla", "T", "1 T = 1 Wb/m²"],
          ["induktanssi", "L", "henry", "H", "1 H = 1 Wb/A"],
          ["celsiuslämpötila", "t, θ", "celsiusaste", "°C", "1 °C = 1 K lämpötilaerolle"],
          ["valovirta", "Φ", "luumen", "lm", "1 lm = 1 cd·sr"],
          ["valaistusvoimakkuus", "E", "luksi", "lx", "1 lx = 1 lm/m²"],
        ],
      },
      {
        title: "Kerrannaisyksiköt",
        columns: ["Kerroin", "Nimi", "Tunnus"],
        rows: [
          ["10²⁴", "jotta", "Y"],
          ["10²¹", "tsetta", "Z"],
          ["10¹⁸", "eksa", "E"],
          ["10¹⁵", "peta", "P"],
          ["10¹²", "tera", "T"],
          ["10⁹", "giga", "G"],
          ["10⁶", "mega", "M"],
          ["10³", "kilo", "k"],
          ["10²", "hehto", "h"],
          ["10¹", "deka", "da"],
          ["10⁻¹", "desi", "d"],
          ["10⁻²", "sentti", "c"],
          ["10⁻³", "milli", "m"],
          ["10⁻⁶", "mikro", "µ"],
          ["10⁻⁹", "nano", "n"],
          ["10⁻¹²", "piko", "p"],
          ["10⁻¹⁵", "femto", "f"],
          ["10⁻¹⁸", "atto", "a"],
          ["10⁻²¹", "tsepto", "z"],
          ["10⁻²⁴", "jokto", "y"],
        ],
      },
    ],
  },
  {
    id: "si",
    subcategory: "yksikot",
    name: "SI-etuliitteet",
    category: "suureet",
    blurb: "Siirrä sama suure etuliitteestä toiseen. Yksikkö itse ei vaihdu.",
    expression: "arvo_uusi = arvo · 10^(exp₁ − exp₂)",
    note: "Etuliitteet jotta (10²⁴) … jokto (10⁻²⁴). Esimerkiksi 3,3 volttia on 3300 millivolttia.",
    tags: ["si", "etuliite", "kilo", "milli", "mikro", "giga", "yksikkö"],
    seed: { value: "3,3", from: "0", to: "-3" },
    fields: fixed([
      numField("value", "Arvo", undefined, "3,3"),
      selectField("from", "Etuliitteestä", SI_PREFIXES),
      selectField("to", "Etuliitteeseen", SI_PREFIXES),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["value"]);
      if (failed(nums)) return nums;
      const [value] = nums;
      const delta = prefixExp(val(raw, "from", "0")) - prefixExp(val(raw, "to", "0"));
      const out = value * 10 ** delta;
      const base = value * 10 ** prefixExp(val(raw, "from", "0"));
      return ok([
        row("out", "Tulos", formatNum(out), undefined, true),
        row("base", "Perusyksikköinä", formatNum(base)),
      ]);
    },
  },
];
