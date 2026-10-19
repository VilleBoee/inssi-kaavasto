import type { Formula } from "./shared";
import {
  areaField,
  empty,
  err,
  failed,
  fixed,
  formatCount,
  formatNum,
  formatSciFromLog10,
  nCrLog10,
  nPrLog10,
  numField,
  ok,
  parseNum,
  readNums,
  row,
  selectField,
  val,
} from "./shared";

export const matematiikka: Formula[] = [
  {
    id: "quadratic",
    subcategory: "algebra",
    name: "Toisen asteen yhtälö",
    category: "matematiikka",
    blurb: "Juuret yhtälölle ax² + bx + c = 0.",
    expression: "x = (−b ± √(b² − 4ac)) / 2a",
    tags: ["toinen aste", "quadratic", "diskriminantti", "juuri"],
    seed: { a: "1", b: "-5", c: "6" },
    fields: fixed([
      numField("a", "a", undefined, "1"),
      numField("b", "b", undefined, "-5"),
      numField("c", "c", undefined, "6"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["a", "b", "c"]);
      if (failed(nums)) return nums;
      const [a, b, c] = nums;
      if (a === 0) {
        if (b === 0) return err(c === 0 ? "Yhtälö on 0 = 0, ratkaisuja on äärettömästi." : "Yhtälöllä ei ole ratkaisua.");
        return ok([row("x", "Lineaarinen juuri", formatNum(-c / b), undefined, true), row("d", "Huomio", "a = 0, yhtälö on suora")]);
      }
      const d = b * b - 4 * a * c;
      if (d > 0) {
        const s = Math.sqrt(d);
        return ok([
          row("x1", "x₁", formatNum((-b + s) / (2 * a)), undefined, true),
          row("x2", "x₂", formatNum((-b - s) / (2 * a))),
          row("d", "Diskriminantti", formatNum(d)),
        ]);
      }
      if (d === 0) {
        return ok([
          row("x", "Kaksoisjuuri", formatNum(-b / (2 * a)), undefined, true),
          row("d", "Diskriminantti", "0"),
        ]);
      }
      const real = -b / (2 * a);
      const imag = Math.sqrt(-d) / (2 * a);
      const sign = imag < 0 ? "−" : "+";
      return ok([
        row("x", "Kompleksijuuret", `${formatNum(real)} ${sign} ${formatNum(Math.abs(imag))} i`, undefined, true),
        row("d", "Diskriminantti", formatNum(d)),
      ]);
    },
  },
  {
    id: "pythagoras",
    subcategory: "geometria",
    name: "Pythagoraan lause",
    category: "matematiikka",
    blurb: "Suorakulmaisen kolmion kateetti tai hypotenuusa.",
    expression: "c = √(a² + b²)",
    tags: ["pythagoras", "kolmio", "hypotenuusa", "kateetti"],
    seed: { mode: "hyp", a: "3", b: "4", c: "5" },
    fields: (raw) => {
      const mode = val(raw, "mode", "hyp");
      const head = selectField("mode", "Ratkaistaan", [
        { value: "hyp", label: "Hypotenuusa" },
        { value: "leg", label: "Puuttuva kateetti" },
      ]);
      if (mode === "leg") {
        return [head, numField("c", "Hypotenuusa c", undefined, "5"), numField("a", "Tunnettu kateetti", undefined, "3")];
      }
      return [head, numField("a", "Kateetti a", undefined, "3"), numField("b", "Kateetti b", undefined, "4")];
    },
    compute: (raw) => {
      if (val(raw, "mode", "hyp") === "leg") {
        const nums = readNums(raw, ["c", "a"]);
        if (failed(nums)) return nums;
        const [c, a] = nums;
        if (c <= 0 || a <= 0) return err("Sivujen pitää olla suurempia kuin 0.");
        if (a >= c) return err("Kateetin pitää olla hypotenuusaa lyhyempi.");
        const b = Math.sqrt(c * c - a * a);
        return ok([
          row("b", "Puuttuva kateetti", formatNum(b), undefined, true),
          row("check", "a² + b²", formatNum(a * a + b * b)),
        ]);
      }
      const nums = readNums(raw, ["a", "b"]);
      if (failed(nums)) return nums;
      const [a, b] = nums;
      if (a <= 0 || b <= 0) return err("Sivujen pitää olla suurempia kuin 0.");
      const c = Math.sqrt(a * a + b * b);
      return ok([
        row("c", "Hypotenuusa", formatNum(c), undefined, true),
        row("area", "Pinta-ala", formatNum((a * b) / 2)),
      ]);
    },
  },
  {
    id: "triangle",
    subcategory: "geometria",
    name: "Suorakulmainen kolmio",
    category: "matematiikka",
    blurb: "Loput sivut kulmasta ja yhdestä sivusta.",
    expression: "sin α = vastainen / hypotenuusa",
    note: "Kulma on asteina ja terävä: suurempi kuin 0° ja pienempi kuin 90°.",
    tags: ["sin", "cos", "tan", "kolmio", "trigonometria"],
    seed: { angle: "30", side: "10", which: "hyp" },
    fields: fixed([
      numField("angle", "Kulma α", "°", "30"),
      numField("side", "Sivun pituus", undefined, "10"),
      selectField("which", "Mikä sivu annettiin", [
        { value: "hyp", label: "Hypotenuusa" },
        { value: "opp", label: "Vastainen kateetti" },
        { value: "adj", label: "Viereinen kateetti" },
      ]),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["angle", "side"]);
      if (failed(nums)) return nums;
      const [angle, side] = nums;
      if (angle <= 0 || angle >= 90) return err("Kulman pitää olla välillä 0°–90°, ei rajoja.");
      if (side <= 0) return err("Sivun pitää olla suurempi kuin 0.");
      const rad = (angle * Math.PI) / 180;
      const which = val(raw, "which", "hyp");
      let hyp: number;
      let opp: number;
      let adj: number;
      if (which === "opp") {
        opp = side;
        hyp = side / Math.sin(rad);
        adj = side / Math.tan(rad);
      } else if (which === "adj") {
        adj = side;
        hyp = side / Math.cos(rad);
        opp = side * Math.tan(rad);
      } else {
        hyp = side;
        opp = side * Math.sin(rad);
        adj = side * Math.cos(rad);
      }
      return ok([
        row("hyp", "Hypotenuusa", formatNum(hyp), undefined, true),
        row("opp", "Vastainen kateetti", formatNum(opp)),
        row("adj", "Viereinen kateetti", formatNum(adj)),
        row("other", "Toinen terävä kulma", formatNum(90 - angle), "°"),
      ]);
    },
  },
  {
    id: "log",
    subcategory: "algebra",
    name: "Logaritmi",
    category: "matematiikka",
    blurb: "Logaritmi valitussa kannassa sekä ln, log₁₀ ja log₂.",
    expression: "log_b x = ln x / ln b",
    tags: ["log", "ln", "logaritmi", "log2", "log10"],
    seed: { x: "1000", base: "10" },
    fields: fixed([
      numField("x", "Luku x", undefined, "1000", "> 0"),
      numField("base", "Kanta b", undefined, "10", "> 0, ≠ 1"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["x", "base"]);
      if (failed(nums)) return nums;
      const [x, base] = nums;
      if (x <= 0) return err("Logaritmin argumentin pitää olla suurempi kuin 0.");
      if (base <= 0 || base === 1) return err("Kannan pitää olla positiivinen eikä 1.");
      return ok([
        row("logb", `log_${formatNum(base)}`, formatNum(Math.log(x) / Math.log(base)), undefined, true),
        row("ln", "Luonnollinen ln", formatNum(Math.log(x))),
        row("log10", "log₁₀", formatNum(Math.log10(x))),
        row("log2", "log₂", formatNum(Math.log2(x))),
      ]);
    },
  },
  {
    id: "stats",
    subcategory: "todennakoisyys",
    name: "Tilastoluvut",
    category: "matematiikka",
    blurb: "Keskiarvo, mediaani, otos- ja populaatiokeskihajonta lukujoukosta.",
    expression: "x̄ = Σx / n,   s = √(Σ(x − x̄)² / (n − 1))",
    tags: ["keskiarvo", "keskihajonta", "mediaani", "varianssi", "statistics"],
    seed: { list: "2, 4, 4, 4, 5, 5, 7, 9" },
    fields: fixed([areaField("list", "Luvut", "2, 4, 4, 4, 5, 5, 7, 9", "erotin pilkku, välilyönti tai rivinvaihto")]),
    compute: (raw) => {
      const parts = val(raw, "list")
        .split(/[,;\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 0) return empty();
      const values: number[] = [];
      for (const part of parts) {
        const n = parseNum(part);
        if (n === null) return err(`"${part}" ei ole luku.`);
        values.push(n);
      }
      const n = values.length;
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(n / 2);
      const median = n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const ss = values.reduce((a, v) => a + (v - mean) ** 2, 0);
      const pop = Math.sqrt(ss / n);
      const sample = n > 1 ? Math.sqrt(ss / (n - 1)) : Number.NaN;
      return ok([
        row("mean", "Keskiarvo", formatNum(mean), undefined, true),
        row("median", "Mediaani", formatNum(median)),
        row("sample", "Otoskeskihajonta", n > 1 ? formatNum(sample) : "tarvitaan ≥ 2 arvoa"),
        row("sem", "Keskiarvon keskivirhe", n > 1 ? formatNum(sample / Math.sqrt(n)) : "tarvitaan ≥ 2 arvoa"),
        row("pop", "Populaatiokeskihajonta", formatNum(pop)),
        row("min", "Pienin", formatNum(sorted[0])),
        row("max", "Suurin", formatNum(sorted[n - 1])),
        row("sum", "Summa", formatNum(sum)),
        row("n", "Lukumäärä", String(n), "kpl"),
      ]);
    },
  },
  {
    id: "combinatorics",
    subcategory: "todennakoisyys",
    name: "Kombinaatiot ja permutaatiot",
    category: "matematiikka",
    blurb: "Montako tapaa valita tai järjestää r alkiota n:stä.",
    expression: "C(n, r) = n! / (r!(n−r)!),   P(n, r) = n! / (n−r)!",
    tags: ["kombinaatio", "permutaatio", "ncr", "npr", "kertoma"],
    seed: { n: "10", r: "3" },
    fields: fixed([
      numField("n", "Alkioita n", "kpl", "10"),
      numField("r", "Valitaan r", "kpl", "3"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["n", "r"]);
      if (failed(nums)) return nums;
      const [n, r] = nums;
      if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) return err("n ja r ovat ei-negatiivisia kokonaislukuja.");
      if (n > 5000) return err("Pidä n enintään 5000.");
      if (r > n) return err("r ei voi olla suurempi kuin n.");
      let fact = "1";
      if (n <= 20) {
        let acc = 1;
        for (let i = 2; i <= n; i++) acc *= i;
        fact = formatCount(acc);
      } else if (n <= 170) {
        let acc = 1;
        for (let i = 2; i <= n; i++) acc *= i;
        fact = formatNum(acc);
      } else {
        let log10 = 0;
        for (let i = 2; i <= n; i++) log10 += Math.log10(i);
        fact = formatSciFromLog10(log10);
      }
      return ok([
        row("c", "Kombinaatiot C(n, r)", formatSciFromLog10(nCrLog10(n, r)), "kpl", true),
        row("p", "Permutaatiot P(n, r)", formatSciFromLog10(nPrLog10(n, r)), "kpl"),
        row("fact", "n!", fact),
      ]);
    },
  },
  {
    id: "percent",
    subcategory: "algebra",
    name: "Prosenttilasku",
    category: "matematiikka",
    blurb: "Osuus, muutos sekä prosentin lisääminen ja vähentäminen.",
    expression: "muutos = (uusi − vanha) / vanha",
    tags: ["prosentti", "percent", "muutos", "osuus"],
    seed: { mode: "share", part: "25", whole: "200", before: "80", after: "100", base: "250", pct: "15" },
    fields: (raw) => {
      const mode = val(raw, "mode", "share");
      const head = selectField("mode", "Lasku", [
        { value: "share", label: "Osuus kokonaisuudesta" },
        { value: "change", label: "Muutosprosentti" },
        { value: "add", label: "Lisää prosentti" },
        { value: "sub", label: "Vähennä prosentti" },
      ]);
      if (mode === "change") {
        return [head, numField("before", "Vanha arvo", undefined, "80"), numField("after", "Uusi arvo", undefined, "100")];
      }
      if (mode === "add" || mode === "sub") {
        return [head, numField("base", "Perusarvo", undefined, "250"), numField("pct", "Prosentti", "%", "15")];
      }
      return [head, numField("part", "Osa", undefined, "25"), numField("whole", "Kokonaisuus", undefined, "200")];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "share");
      if (mode === "change") {
        const nums = readNums(raw, ["before", "after"]);
        if (failed(nums)) return nums;
        const [before, after] = nums;
        if (before === 0) return err("Vanha arvo ei voi olla 0.");
        const delta = after - before;
        return ok([
          row("pct", "Muutos", formatNum((100 * delta) / before), "%", true),
          row("delta", "Erotus", formatNum(delta)),
        ]);
      }
      if (mode === "add" || mode === "sub") {
        const nums = readNums(raw, ["base", "pct"]);
        if (failed(nums)) return nums;
        const [base, pct] = nums;
        const factor = mode === "add" ? 1 + pct / 100 : 1 - pct / 100;
        return ok([
          row("result", "Tulos", formatNum(base * factor), undefined, true),
          row("delta", mode === "add" ? "Lisäys" : "Vähennys", formatNum(Math.abs(base * (pct / 100)))),
        ]);
      }
      const nums = readNums(raw, ["part", "whole"]);
      if (failed(nums)) return nums;
      const [part, whole] = nums;
      if (whole === 0) return err("Kokonaisuus ei voi olla 0.");
      return ok([
        row("pct", "Osuus", formatNum((100 * part) / whole), "%", true),
        row("rest", "Loppuosa", formatNum(whole - part)),
      ]);
    },
  },
];
