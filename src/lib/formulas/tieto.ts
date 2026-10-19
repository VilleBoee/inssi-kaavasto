import type { Formula } from "./shared";
import {
  areaField,
  bytesLabel,
  dataUnit,
  DATA_UNITS,
  empty,
  err,
  failed,
  fixed,
  formatCount,
  formatNum,
  formatPow2,
  formatSciFromLog10,
  groupBits,
  isBig,
  numField,
  ok,
  parseAutoInt,
  parseBig,
  parseInBase,
  readNums,
  row,
  selectField,
  textField,
  toBase,
  val,
} from "./shared";

const baseOptions = [
  { value: "2", label: "2 — binääri" },
  { value: "8", label: "8 — oktaali" },
  { value: "10", label: "10 — desimaali" },
  { value: "16", label: "16 — heksadesimaali" },
];

export const tieto: Formula[] = [
  {
    id: "bases",
    subcategory: "luvut",
    name: "Lukujärjestelmät",
    category: "tieto",
    blurb: "Muunna kokonaisluku kantalukujen 2, 8, 10 ja 16 välillä.",
    expression: "n₍b₎ → bin, oct, dec, hex",
    note: "Etuliitteet 0b, 0o ja 0x hyväksytään, kun ne vastaavat valittua kantalukua.",
    tags: ["binääri", "heksa", "hex", "oktaali", "kantaluku", "binary", "decimal"],
    seed: { value: "2026", base: "10" },
    fields: fixed([
      textField("value", "Luku", "FF, 0xFF tai 11111111"),
      selectField("base", "Luvun kantaluku", baseOptions),
    ]),
    compute: (raw) => {
      const base = Number(val(raw, "base", "10"));
      if (!Number.isInteger(base) || base < 2 || base > 36) return err("Kantaluvun pitää olla välillä 2–36.");
      const n = parseInBase(val(raw, "value"), base);
      if (isBig(n)) return n;
      const bin = toBase(n, 2);
      return ok([
        row("bin", "Binääri", groupBits(bin), "kanta 2", true),
        row("oct", "Oktaali", toBase(n, 8), "kanta 8"),
        row("dec", "Desimaali", toBase(n, 10), "kanta 10"),
        row("hex", "Heksadesimaali", toBase(n, 16).toUpperCase(), "kanta 16"),
      ]);
    },
  },
  {
    id: "datasize",
    subcategory: "luvut",
    name: "Datakoon muunnos",
    category: "tieto",
    blurb: "SI-etuliitteet (kB, MB) ja binäärietuliitteet (KiB, MiB) erikseen.",
    expression: "koko → B, KiB, MiB, GiB, MB, GB",
    note: "IEC: KiB = 1024 B. SI: kB = 1000 B. Levyt myydään usein SI-yksiköissä, käyttöjärjestelmät näyttävät GiB:tä.",
    tags: ["tavu", "bitti", "kib", "gib", "megatavu", "storage", "byte"],
    seed: { value: "1", from: "GiB", to: "MB" },
    fields: fixed([
      numField("value", "Määrä", undefined, "1"),
      selectField("from", "Yksiköstä", DATA_UNITS),
      selectField("to", "Yksikköön", DATA_UNITS),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["value"]);
      if (failed(nums)) return nums;
      const [value] = nums;
      if (value < 0) return err("Koko ei voi olla negatiivinen.");
      const bytes = value * dataUnit(val(raw, "from", "B")).bytes;
      const target = dataUnit(val(raw, "to", "MB"));
      const show = ["bit", "B", "KiB", "MiB", "GiB", "TiB", "kB", "MB", "GB", "TB"];
      return ok([
        row("target", `Tuloksena (${target.label})`, formatNum(bytes / target.bytes), target.value, true),
        ...show.map((id) => {
          const u = dataUnit(id);
          return row(id, u.label, formatNum(bytes / u.bytes), u.value);
        }),
      ]);
    },
  },
  {
    id: "twos",
    subcategory: "luvut",
    name: "Kahden komplementti",
    category: "tieto",
    blurb: "Etumerkillinen kokonaisluku annetulla bittileveydellä.",
    expression: "signed = unsigned − 2ⁿ, kun MSB = 1",
    note: "Alue on −2ⁿ⁻¹ … 2ⁿ⁻¹ − 1. Lyhyt bittijono täydennetään vasemmalta nollilla.",
    tags: ["two's complement", "etumerkki", "bitti", "signed", "integer"],
    seed: { width: "8", mode: "signed", signed: "-5", bits: "11111011" },
    fields: (raw) => {
      const mode = val(raw, "mode", "signed");
      const head = [
        numField("width", "Bittileveys", "bittiä", "8", "1–64"),
        selectField("mode", "Syöte", [
          { value: "signed", label: "Etumerkillinen desimaali" },
          { value: "bits", label: "Bittijono" },
        ]),
      ];
      if (mode === "bits") return [...head, textField("bits", "Bitit", "11111011")];
      return [...head, textField("signed", "Desimaaliluku", "-5")];
    },
    compute: (raw) => {
      const widthNums = readNums(raw, ["width"]);
      if (failed(widthNums)) return widthNums;
      const width = widthNums[0];
      if (!Number.isInteger(width) || width < 1 || width > 64) return err("Bittileveyden pitää olla kokonaisluku 1–64.");
      const span = 1n << BigInt(width);
      const mode = val(raw, "mode", "signed");
      let signed: bigint;
      let bits: string;
      if (mode === "bits") {
        const body = val(raw, "bits").replace(/\s/g, "");
        if (!body) return empty();
        if (!/^[01]+$/.test(body)) return err("Bittijonossa saa olla vain merkkejä 0 ja 1.");
        if (body.length > width) return err(`Jonossa on ${body.length} bittiä, leveys on ${width}.`);
        bits = body.padStart(width, "0");
        const unsigned = BigInt(`0b${bits}`);
        signed = bits[0] === "1" ? unsigned - span : unsigned;
      } else {
        const n = parseBig(val(raw, "signed"));
        if (n === null) {
          if (!val(raw, "signed").trim()) return empty();
          return err("Syötä kokonaisluku ilman desimaaleja.");
        }
        const min = -(span / 2n);
        const max = span / 2n - 1n;
        if (n < min || n > max) return err(`Luku ei mahdu ${width} bittiin (${min} … ${max}).`);
        signed = n;
        const unsigned = signed < 0n ? signed + span : signed;
        bits = unsigned.toString(2).padStart(width, "0");
      }
      const unsigned = BigInt(`0b${bits}`);
      return ok([
        row("bits", "Kahden komplementti", groupBits(bits), `${width} bittiä`, true),
        row("signed", "Etumerkillinen", signed.toString(), "desimaali"),
        row("unsigned", "Etumerkitön", unsigned.toString(), "desimaali"),
        row("hex", "Heksa", unsigned.toString(16).toUpperCase().padStart(Math.ceil(width / 4), "0"), "hex"),
      ]);
    },
  },
  {
    id: "bitwise",
    subcategory: "luvut",
    name: "Bittioperaatiot",
    category: "tieto",
    blurb: "AND, OR, XOR, NOT ja siirrot. Syöte desimaalina, 0x-heksana tai 0b-binäärinä.",
    expression: "a ∧ b, a ∨ b, a ⊕ b, ¬a, a << 1",
    tags: ["and", "or", "xor", "not", "shift", "maski", "bitwise"],
    seed: { a: "0xFF00", b: "0x0FF0" },
    fields: fixed([
      textField("a", "A", "0xFF00"),
      textField("b", "B", "0x0FF0"),
    ]),
    compute: (raw) => {
      const aRaw = val(raw, "a").trim();
      const bRaw = val(raw, "b").trim();
      if (!aRaw || !bRaw) return empty();
      const a = parseAutoInt(aRaw);
      const b = parseAutoInt(bRaw);
      if (a === null || b === null) return err("Lukua ei tunnistettu. Käytä desimaalia, 0x-heksaa tai 0b-binääriä.");
      if (a.toString(2).replace("-", "").length > 256 || b.toString(2).replace("-", "").length > 256) {
        return err("Luku on liian pitkä (enintään 256 bittiä).");
      }
      const show = (n: bigint) => groupBits(toBase(n, 2));
      return ok([
        row("and", "AND", show(a & b), undefined, true),
        row("or", "OR", show(a | b)),
        row("xor", "XOR", show(a ^ b)),
        row("nota", "NOT A", show(~a)),
        row("shl", "A << 1", show(a << 1n)),
        row("shr", "A >> 1", show(a >> 1n)),
        row("deca", "A desimaalina", a.toString()),
        row("decb", "B desimaalina", b.toString()),
        row("hexand", "AND heksana", (a & b).toString(16).toUpperCase()),
      ]);
    },
  },
  {
    id: "cpu",
    subcategory: "suoritus",
    name: "CPU-aika",
    category: "tieto",
    blurb: "Ohjelman suoritusaika käskyjen, CPI:n ja kellotaajuuden avulla.",
    expression: "T = IC · CPI / f",
    note: "CPI on keskimääräinen kellojaksojen määrä käskyä kohti. MIPS = f / (CPI · 10⁶).",
    tags: ["cpi", "mips", "kello", "clock", "instruction", "suorituskyky"],
    seed: { ic: "5e9", cpi: "1,5", ghz: "3,2" },
    fields: fixed([
      numField("ic", "Käskyjen määrä IC", "kpl", "5e9"),
      numField("cpi", "CPI", "jaksoa / käsky", "1,5"),
      numField("ghz", "Kellotaajuus", "GHz", "3,2"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["ic", "cpi", "ghz"]);
      if (failed(nums)) return nums;
      const [ic, cpi, ghz] = nums;
      if (ic < 0 || cpi <= 0 || ghz <= 0) return err("IC ≥ 0, CPI ja taajuus > 0.");
      const cycles = ic * cpi;
      const hz = ghz * 1e9;
      const seconds = cycles / hz;
      const mips = hz / (cpi * 1e6);
      return ok([
        row("time", "Suoritusaika", formatNum(seconds), "s", true),
        row("cycles", "Kellojaksoja", formatCount(cycles), "kpl"),
        row("mips", "MIPS", formatNum(mips), "milj. käskyä/s"),
        row("period", "Kellojakson pituus", formatNum(1 / hz), "s"),
      ]);
    },
  },
  {
    id: "amat",
    subcategory: "suoritus",
    name: "Keskimääräinen muistiviive",
    category: "tieto",
    blurb: "AMAT, kun osuma-aika, hudin osuus ja hudin sakko tunnetaan.",
    expression: "AMAT = t_osuma + h · t_huti",
    tags: ["amat", "cache", "välimuisti", "miss", "hit"],
    seed: { hit: "1", miss: "2", penalty: "100" },
    fields: fixed([
      numField("hit", "Osumaaika", "ns", "1"),
      numField("miss", "Hudit", "%", "2"),
      numField("penalty", "Hudin sakko", "ns", "100"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["hit", "miss", "penalty"]);
      if (failed(nums)) return nums;
      const [hit, miss, penalty] = nums;
      if (hit < 0 || penalty < 0) return err("Ajat eivät voi olla negatiivisia.");
      if (miss < 0 || miss > 100) return err("Hudin osuus on 0–100 %.");
      const extra = (miss / 100) * penalty;
      return ok([
        row("amat", "AMAT", formatNum(hit + extra), "ns", true),
        row("extra", "Hudin osuus viiveestä", formatNum(extra), "ns"),
        row("hitrate", "Osumaosuus", formatNum(100 - miss), "%"),
      ]);
    },
  },
  {
    id: "raid",
    subcategory: "suoritus",
    name: "RAID-kapasiteetti",
    category: "tieto",
    blurb: "Käyttökelpoinen tila ja vikasietoisuus yleisimmillä RAID-tasoilla.",
    expression: "RAID 5: (n − 1) · levy",
    note: "Oletus: saman kokoiset levyt. RAID 10 vaatii parillisen määrän. Luvut ovat nimelliskapasiteettia, eivät tiedostojärjestelmän overheadia.",
    tags: ["raid", "levy", "storage", "redundanssi", "raid5", "raid6", "raid10"],
    seed: { level: "5", count: "6", size: "4", unit: "TB" },
    fields: fixed([
      selectField("level", "RAID-taso", [
        { value: "0", label: "RAID 0 — raidoitus" },
        { value: "1", label: "RAID 1 — peilaus" },
        { value: "5", label: "RAID 5 — yksi pariteetti" },
        { value: "6", label: "RAID 6 — kaksoispariteetti" },
        { value: "10", label: "RAID 10 — peili + raidoitus" },
      ]),
      numField("count", "Levyjä", "kpl", "6"),
      numField("size", "Yhden levyn koko", undefined, "4"),
      selectField("unit", "Kokoyksikkö", [
        { value: "GB", label: "GB (10⁹ B)" },
        { value: "TB", label: "TB (10¹² B)" },
        { value: "GiB", label: "GiB" },
        { value: "TiB", label: "TiB" },
      ]),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["count", "size"]);
      if (failed(nums)) return nums;
      const [count, size] = nums;
      if (!Number.isInteger(count) || count < 1) return err("Levyjen määrän pitää olla positiivinen kokonaisluku.");
      if (size <= 0) return err("Levyn koon pitää olla suurempi kuin 0.");
      const level = val(raw, "level", "5");
      const unit = val(raw, "unit", "TB");
      let usable = 0;
      let fault = "";
      let min = 1;
      if (level === "0") {
        min = 2;
        usable = count * size;
        fault = "0 levyä (ei siedä vikaa)";
      } else if (level === "1") {
        min = 2;
        usable = size;
        fault = `${count - 1} levyä`;
      } else if (level === "5") {
        min = 3;
        usable = (count - 1) * size;
        fault = "1 levy";
      } else if (level === "6") {
        min = 4;
        usable = (count - 2) * size;
        fault = "2 levyä";
      } else {
        min = 4;
        if (count % 2 !== 0) return err("RAID 10 tarvitsee parillisen levymäärän.");
        usable = (count / 2) * size;
        fault = "1 levy varmasti, joskus useampi eri peilipareista";
      }
      if (count < min) return err(`Tämä RAID-taso tarvitsee vähintään ${min} levyä.`);
      const rawTotal = count * size;
      return ok([
        row("usable", "Käyttökelpoinen tila", formatNum(usable), unit, true),
        row("raw", "Raakakapasiteetti", formatNum(rawTotal), unit),
        row("eff", "Hyötysuhde", formatNum((100 * usable) / rawTotal), "%"),
        row("fault", "Vikasietoisuus", fault),
        row("parity", "Redundanssiin", formatNum(rawTotal - usable), unit),
      ]);
    },
  },
  {
    id: "complexity",
    subcategory: "suoritus",
    name: "Aikavaativuus",
    category: "tieto",
    blurb: "Askelmäärän kertaluokka syötteen koolle n. Vakiot on jätetty pois.",
    expression: "O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)",
    note: "Luvut ovat vertailukertoimia, eivät sekunteja. O(2ⁿ) ja O(n!) kasvavat käyttökelvottomiksi jo pienellä n:llä.",
    tags: ["big-o", "algoritmi", "complexity", "n log n", "kertaluokka"],
    seed: { n: "1000" },
    fields: fixed([numField("n", "Syötteen koko n", "alkiota", "1000")]),
    compute: (raw) => {
      const nums = readNums(raw, ["n"]);
      if (failed(nums)) return nums;
      const [n] = nums;
      if (!Number.isInteger(n) || n < 1) return err("n:n pitää olla positiivinen kokonaisluku.");
      if (n > 1_000_000) return err("Pidä n enintään 1 000 000, jotta taulukko pysyy luettavana.");
      const log2 = Math.log2(n);
      const nlog = n * log2;
      let fact: string;
      if (n <= 20) {
        let acc = 1;
        for (let i = 2; i <= n; i++) acc *= i;
        fact = formatCount(acc);
      } else {
        let log10 = 0;
        for (let i = 2; i <= n; i++) log10 += Math.log10(i);
        fact = formatSciFromLog10(log10);
      }
      return ok([
        row("c1", "O(1)", "1", "askelta"),
        row("log", "O(log₂ n)", formatNum(log2), "askelta"),
        row("n", "O(n)", formatCount(n), "askelta", true),
        row("nlog", "O(n log₂ n)", formatCount(nlog), "askelta"),
        row("n2", "O(n²)", formatCount(n * n), "askelta"),
        row("n3", "O(n³)", formatCount(n * n * n), "askelta"),
        row("exp", "O(2ⁿ)", formatPow2(n), "askelta"),
        row("fact", "O(n!)", fact, "askelta"),
      ]);
    },
  },
  {
    id: "hamming",
    subcategory: "informaatio",
    name: "Hamming-etäisyys",
    category: "tieto",
    blurb: "Eriävien bittien määrä kahden yhtä pitkän jonon välillä.",
    expression: "d(a, b) = |{ i | aᵢ ≠ bᵢ }|",
    tags: ["hamming", "virhe", "bitti", "xor", "koodi"],
    seed: { a: "1011001", b: "1001101" },
    fields: fixed([
      textField("a", "Jono A", "1011001"),
      textField("b", "Jono B", "1001101"),
    ]),
    compute: (raw) => {
      const a = val(raw, "a").replace(/\s/g, "");
      const b = val(raw, "b").replace(/\s/g, "");
      if (!a || !b) return empty();
      if (!/^[01]+$/.test(a) || !/^[01]+$/.test(b)) return err("Vain merkit 0 ja 1 sallitaan.");
      if (a.length !== b.length) return err(`Pituudet eroavat (${a.length} ja ${b.length}).`);
      let d = 0;
      let xor = "";
      for (let i = 0; i < a.length; i++) {
        const diff = a[i] !== b[i];
        if (diff) d += 1;
        xor += diff ? "1" : "0";
      }
      return ok([
        row("d", "Hamming-etäisyys", String(d), "bittiä", true),
        row("xor", "XOR", groupBits(xor)),
        row("len", "Pituus", String(a.length), "bittiä"),
      ]);
    },
  },
  {
    id: "parity",
    subcategory: "informaatio",
    name: "Pariteettibitti",
    category: "tieto",
    blurb: "Parillinen ja pariton pariteetti bittijonolle.",
    expression: "p_parillinen = popcount mod 2",
    tags: ["parity", "pariteetti", "virheentunnistus", "even", "odd"],
    seed: { bits: "1011001" },
    fields: fixed([textField("bits", "Databitit", "1011001")]),
    compute: (raw) => {
      const bits = val(raw, "bits").replace(/\s/g, "");
      if (!bits) return empty();
      if (!/^[01]+$/.test(bits)) return err("Vain merkit 0 ja 1 sallitaan.");
      const ones = [...bits].filter((c) => c === "1").length;
      const even = ones % 2;
      const odd = even ^ 1;
      return ok([
        row("ones", "Ykkösiä", String(ones), "kpl", true),
        row("even", "Parillinen pariteettibitti", String(even)),
        row("odd", "Pariton pariteettibitti", String(odd)),
        row("evenword", "Sana, parillinen pariteetti", `${bits}${even}`),
        row("oddword", "Sana, pariton pariteetti", `${bits}${odd}`),
      ]);
    },
  },
  {
    id: "birthday",
    subcategory: "informaatio",
    name: "Törmäystodennäköisyys",
    category: "tieto",
    blurb: "Syntymäpäiväparadoksi: vähintään yksi törmäys hajautusavaruudessa.",
    expression: "P ≈ 1 − exp(−n(n−1) / 2d)",
    note: "d = 2^bittiä. Approksimaatio on tarkka, kun n on pieni verrattuna d:hen, ja lähestyy yhtä kun n kasvaa.",
    tags: ["birthday", "hash", "collision", "törmäys", "sha"],
    seed: { bits: "32", n: "100000" },
    fields: fixed([
      numField("bits", "Hajautuksen bittejä", "bittiä", "32"),
      numField("n", "Alkioita n", "kpl", "100000"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["bits", "n"]);
      if (failed(nums)) return nums;
      const [bits, n] = nums;
      if (!Number.isInteger(bits) || bits < 1 || bits > 4096) return err("Bittimäärän pitää olla kokonaisluku 1–4096.");
      if (!Number.isInteger(n) || n < 0) return err("n:n pitää olla ei-negatiivinen kokonaisluku.");
      if (n < 2) {
        return ok([
          row("p", "Törmäyksen todennäköisyys", "0", "%", true),
          row("half", "n noin 50 % törmäykselle", formatPow2(bits / 2), "alkiota"),
        ]);
      }
      const lnRatio = Math.log(n) + Math.log(n - 1) - Math.log(2) - bits * Math.LN2;
      const ratio = lnRatio > 700 ? Infinity : Math.exp(lnRatio);
      let pLabel: string;
      if (!Number.isFinite(ratio)) {
        pLabel = "≈ 100";
      } else if (ratio < 1e-12) {
        pLabel = `< ${formatNum(1e-10)}`;
      } else {
        const p = 1 - Math.exp(-Math.min(ratio, 700));
        pLabel = formatNum(p * 100);
      }
      // 50 %: n ≈ 2^(b/2) · √(2 ln 2)
      const half = (bits / 2) * Math.log10(2) + 0.5 * Math.log10(2 * Math.LN2);
      return ok([
        row("p", "Vähintään yksi törmäys", pLabel, "%", true),
        row("half", "n ≈ 50 % todennäköisyydellä", formatSciFromLog10(half), "alkiota"),
        row("space", "Avaruus d = 2^b", formatPow2(bits), "alkiota"),
      ]);
    },
  },
  {
    id: "entropy",
    subcategory: "informaatio",
    name: "Binäärientropia",
    category: "tieto",
    blurb: "Shannonin entropia kolikonheitolle, jonka ykkösen todennäköisyys on p.",
    expression: "H(p) = −p log₂ p − (1−p) log₂(1−p)",
    tags: ["entropia", "shannon", "informaatio", "bitti", "entropy"],
    seed: { p: "0,1" },
    fields: fixed([numField("p", "Todennäköisyys p", "0–1", "0,1")]),
    compute: (raw) => {
      const nums = readNums(raw, ["p"]);
      if (failed(nums)) return nums;
      const [p] = nums;
      if (p < 0 || p > 1) return err("p:n pitää olla välillä 0–1.");
      const term = (x: number) => (x === 0 || x === 1 ? 0 : -x * Math.log2(x));
      const h = term(p) + term(1 - p);
      return ok([
        row("h", "Entropia H(p)", formatNum(h), "bittiä / symboli", true),
        row("max", "Maksimi H(0,5)", "1", "bitti"),
        row("q", "1 − p", formatNum(1 - p)),
      ]);
    },
  },
  {
    id: "textsize",
    subcategory: "luvut",
    name: "Merkkijonon koko",
    category: "tieto",
    blurb: "Merkit, Unicode-koodipisteet, UTF-8-tavut ja Base64-pituus.",
    expression: "Base64-pituus = 4 · ⌈tavut / 3⌉",
    tags: ["utf-8", "utf8", "base64", "merkki", "tavu", "encoding"],
    seed: { text: "insinööri" },
    fields: fixed([areaField("text", "Teksti", "insinööri")]),
    compute: (raw) => {
      const text = val(raw, "text");
      if (!text) return empty();
      const bytes = new TextEncoder().encode(text).length;
      const points = [...text].length;
      const b64 = Math.ceil(bytes / 3) * 4;
      return ok([
        row("bytes", "UTF-8", String(bytes), "tavua", true),
        row("chars", "UTF-16-koodiyksikköä", String(text.length), "kpl"),
        row("points", "Unicode-koodipisteitä", String(points), "kpl"),
        row("b64", "Base64 ilman rivinvaihtoja", String(b64), "merkkiä"),
        row("human", "Luettava koko", bytesLabel(bytes)),
      ]);
    },
  },
  {
    id: "address",
    subcategory: "luvut",
    name: "Osoitebitit",
    category: "tieto",
    blurb: "Montako osoitetta bittileveys kattaa, tai montako bittiä tarvitaan.",
    expression: "osoitteita = 2ⁿ",
    note: "Tavuosoitteisessa koneessa n bittiä kattaa 2ⁿ tavua.",
    tags: ["osoite", "address", "bitti", "muisti", "2^n"],
    seed: { mode: "bits", bits: "32", count: "4096" },
    fields: (raw) => {
      const mode = val(raw, "mode", "bits");
      const modeField = selectField("mode", "Lasketaan", [
        { value: "bits", label: "Biteistä osoitemäärä" },
        { value: "count", label: "Osoitemäärästä bitit" },
      ]);
      if (mode === "count") return [modeField, numField("count", "Osoitteita", "kpl", "4096")];
      return [modeField, numField("bits", "Osoitebittejä", "bittiä", "32")];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "bits");
      if (mode === "count") {
        const nums = readNums(raw, ["count"]);
        if (failed(nums)) return nums;
        const [count] = nums;
        if (count <= 0) return err("Osoitemäärän pitää olla suurempi kuin 0.");
        const bits = count <= 1 ? 0 : Math.ceil(Math.log2(count));
        return ok([
          row("bits", "Tarvittavat bitit", String(bits), "bittiä", true),
          row("cover", "2ⁿ kattaa", formatPow2(bits), "osoitetta"),
          row("bytes", "Tavuosoitteinen tila", bytesLabel(2 ** Math.min(bits, 1023))),
        ]);
      }
      const nums = readNums(raw, ["bits"]);
      if (failed(nums)) return nums;
      const [bits] = nums;
      if (!Number.isInteger(bits) || bits < 0 || bits > 1023) return err("Bittimäärän pitää olla kokonaisluku 0–1023.");
      return ok([
        row("count", "Osoitteita", formatPow2(bits), "kpl", true),
        row("bytes", "Tavuosoitteinen tila", bytesLabel(2 ** bits)),
        row("hex", "Suurin osoite", bits === 0 ? "0" : bits > 64 ? `2^${bits} − 1` : "0x" + ((1n << BigInt(bits)) - 1n).toString(16).toUpperCase()),
      ]);
    },
  },
  {
    id: "gcd",
    subcategory: "informaatio",
    name: "GCD, LCM ja jakojäännös",
    category: "tieto",
    blurb: "Suurin yhteinen tekijä, pienin yhteinen jaettava ja a mod b.",
    expression: "gcd(a, b) · lcm(a, b) = |a · b|",
    tags: ["gcd", "lcm", "syt", "pyj", "modulo", "eukleides"],
    seed: { a: "48", b: "18" },
    fields: fixed([
      textField("a", "a", "48"),
      textField("b", "b", "18"),
    ]),
    compute: (raw) => {
      const aRaw = val(raw, "a").trim();
      const bRaw = val(raw, "b").trim();
      if (!aRaw || !bRaw) return empty();
      const a = parseBig(aRaw);
      const b = parseBig(bRaw);
      if (a === null || b === null) return err("Syötä kokonaisluvut.");
      const abs = (n: bigint) => (n < 0n ? -n : n);
      let x = abs(a);
      let y = abs(b);
      while (y !== 0n) {
        const t = y;
        y = x % y;
        x = t;
      }
      const g = x;
      const lcm = g === 0n ? 0n : (abs(a) / g) * abs(b);
      let mod = "—";
      if (b !== 0n) {
        const r = a % b;
        const positive = r < 0n ? r + abs(b) : r;
        mod = positive.toString();
      }
      return ok([
        row("gcd", "Suurin yhteinen tekijä", g.toString(), undefined, true),
        row("lcm", "Pienin yhteinen jaettava", lcm.toString()),
        row("mod", "a mod |b| (ei-negatiivinen)", b === 0n ? "ei määritelty" : mod),
      ]);
    },
  },
  {
    id: "amdahl",
    subcategory: "suoritus",
    name: "Amdahlin laki",
    category: "tieto",
    blurb: "Rinnakkaistamisen nopeutus, kun osa työstä jää sarjamuotoiseksi.",
    expression: "S = 1 / ((1 − p) + p / n)",
    note: "p on rinnastettavissa oleva osuus, n sen nopeutuskerroin. Yläraja on 1 / (1 − p), vaikka n kasvaisi rajatta.",
    tags: ["amdahl", "rinnakkaisuus", "speedup", "nopeutus"],
    seed: { p: "60", n: "8" },
    fields: fixed([
      numField("p", "Rinnastettava osuus", "%", "60"),
      numField("n", "Tämän osan nopeutus", "×", "8"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["p", "n"]);
      if (failed(nums)) return nums;
      const [pPct, n] = nums;
      if (pPct < 0 || pPct > 100) return err("Osuuden pitää olla 0–100 %.");
      if (n <= 0) return err("Nopeutuskertoimen pitää olla suurempi kuin 0.");
      const p = pPct / 100;
      const serial = 1 - p;
      const speedup = 1 / (serial + p / n);
      const cap = serial === 0 ? Infinity : 1 / serial;
      return ok([
        row("s", "Kokonaisnopeutus", formatNum(speedup), "×", true),
        row("cap", "Yläraja n → ∞", Number.isFinite(cap) ? formatNum(cap) : "rajaton", "×"),
        row("serial", "Sarjaosuus", formatNum(serial * 100), "%"),
        row("left", "Aikaa jäljellä", formatNum(100 / speedup), "% alkuperäisestä"),
      ]);
    },
  },
];
