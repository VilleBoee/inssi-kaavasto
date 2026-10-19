import type { ComputeResult, Formula } from "./shared";
import {
  err,
  failed,
  fixed,
  formatNum,
  numField,
  ok,
  parseNum,
  readNums,
  row,
  selectField,
  val,
} from "./shared";

const G_STD = 9.80665;
const K_E = 8.9875517923e9;
const MU_0 = 1.25663706212e-6;
const R_GAS = 8.314462618;

const BODIES: Record<string, { label: string; gm: number; radius: number }> = {
  earth: { label: "Maa", gm: 3.986004418e14, radius: 6.371e6 },
  moon: { label: "Kuu", gm: 4.9048695e12, radius: 1.7374e6 },
  mars: { label: "Mars", gm: 4.282837e13, radius: 3.3895e6 },
};

function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function deg(radians: number): number {
  return (radians * 180) / Math.PI;
}

function opt(raw: Record<string, string>, id: string): { value: number | null } | ComputeResult {
  const s = val(raw, id).trim();
  if (!s) return { value: null };
  const n = parseNum(s);
  if (n === null) return err("Lukua ei tunnistettu. Käytä desimaalipilkkua tai pistettä.");
  return { value: n };
}

function isErr(value: { value: number | null } | ComputeResult): value is ComputeResult {
  return "status" in value;
}

function inertia(shape: string, mass: number, size: number): number | null {
  if (shape === "point" || shape === "hoop") return mass * size * size;
  if (shape === "rod-center") return (mass * size * size) / 12;
  if (shape === "rod-end") return (mass * size * size) / 3;
  if (shape === "disk") return 0.5 * mass * size * size;
  if (shape === "sphere") return (2 / 5) * mass * size * size;
  if (shape === "shell") return (2 / 3) * mass * size * size;
  return null;
}

export const fysiikka: Formula[] = [
  {
    id: "newton",
    subcategory: "newton",
    name: "Newtonin II laki",
    category: "fysiikka",
    blurb: "Ratkaise voima, massa tai kiihtyvyys. Paino lasketaan samalla massalla.",
    expression: "F = ma,   G = mg",
    tags: ["newton", "voima", "massa", "kiihtyvyys", "paino", "dynamiikka"],
    seed: { unknown: "F", m: "2", a: "3", g: "9,81", F: "6" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "F");
      return [
        selectField("unknown", "Ratkaistaan", [
          { value: "F", label: "Voima F" },
          { value: "m", label: "Massa m" },
          { value: "a", label: "Kiihtyvyys a" },
        ]),
        numField("m", "Massa m", "kg", "2"),
        numField("a", "Kiihtyvyys a", "m/s²", "3"),
        numField("F", "Voima F", "N", "6"),
        numField("g", "Putoamiskiihtyvyys g", "m/s²", "9,81"),
      ].filter((field) => field.id !== unknown);
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "F");
      const ids = ["m", "a", "F", "g"].filter((id) => id !== unknown);
      const known = readNums(raw, ids);
      if (failed(known)) return known;
      const map: Record<string, number> = {};
      ids.forEach((id, index) => {
        map[id] = known[index];
      });
      const g = map.g;
      if (g === undefined) return err("Putoamiskiihtyvyys puuttuu.");
      let m = map.m;
      let a = map.a;
      let F = map.F;
      if (unknown === "F") {
        if (m === undefined || a === undefined) return err("Massa ja kiihtyvyys tarvitaan.");
        F = m * a;
      } else if (unknown === "m") {
        if (F === undefined || a === undefined) return err("Voima ja kiihtyvyys tarvitaan.");
        if (a === 0) return err("Kiihtyvyys on 0, massaa ei voi ratkaista.");
        m = F / a;
      } else {
        if (F === undefined || m === undefined) return err("Voima ja massa tarvitaan.");
        if (m === 0) return err("Massa ei voi olla 0.");
        a = F / m;
      }
      if (m === undefined || a === undefined || F === undefined) return err("Suuretta ei saatu ratkaistua.");
      return ok([
        row("f", "Voima F", formatNum(F), "N", unknown === "F"),
        row("m", "Massa m", formatNum(m), "kg", unknown === "m"),
        row("a", "Kiihtyvyys a", formatNum(a), "m/s²", unknown === "a"),
        row("ag", "a / g", g === 0 ? "—" : formatNum(a / g), "g"),
        row("weight", "Paino G = mg", formatNum(m * g), "N"),
      ]);
    },
  },
  {
    id: "friction",
    subcategory: "newton",
    name: "Kitkavoima",
    category: "fysiikka",
    blurb: "Liike- tai lepokitkan suuruus. Lepokitka on maksimi, kun μ on lepokitkakerroin.",
    expression: "F = μN",
    tags: ["kitka", "lepokitka", "liikekitka", "normaali", "myy"],
    seed: { unknown: "F", mu: "0,3", n: "20", F: "6" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "F");
      return [
        selectField("unknown", "Ratkaistaan", [
          { value: "F", label: "Kitkavoima F" },
          { value: "mu", label: "Kitkakerroin μ" },
          { value: "n", label: "Normaalivoima N" },
        ]),
        numField("mu", "Kitkakerroin μ", undefined, "0,3"),
        numField("n", "Normaalivoima N", "N", "20"),
        numField("F", "Kitkavoima F", "N", "6"),
      ].filter((field) => field.id !== unknown);
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "F");
      const ids = ["mu", "n", "F"].filter((id) => id !== unknown);
      const known = readNums(raw, ids);
      if (failed(known)) return known;
      const map: Record<string, number> = {};
      ids.forEach((id, index) => {
        map[id] = known[index];
      });
      let mu = map.mu;
      let normal = map.n;
      let F = map.F;
      if (unknown === "F") {
        if (mu === undefined || normal === undefined) return err("Kerroin ja normaalivoima tarvitaan.");
        F = mu * normal;
      } else if (unknown === "mu") {
        if (F === undefined || normal === undefined) return err("Voima ja normaalivoima tarvitaan.");
        if (normal === 0) return err("Normaalivoima ei voi olla 0.");
        mu = F / normal;
      } else {
        if (F === undefined || mu === undefined) return err("Voima ja kerroin tarvitaan.");
        if (mu === 0) return err("Kitkakerroin on 0, normaalivoimaa ei voi ratkaista.");
        normal = F / mu;
      }
      if (mu === undefined || normal === undefined || F === undefined) return err("Suuretta ei saatu ratkaistua.");
      if (mu < 0) return err("Kitkakerroin ei voi olla negatiivinen.");
      return ok([
        row("f", "Kitkavoima F", formatNum(F), "N", unknown === "F"),
        row("mu", "Kitkakerroin μ", formatNum(mu), undefined, unknown === "mu"),
        row("n", "Normaalivoima N", formatNum(normal), "N", unknown === "n"),
      ]);
    },
  },
  {
    id: "work",
    subcategory: "energia",
    name: "Työ ja teho",
    category: "fysiikka",
    blurb: "Työ voiman ja siirtymän välisellä kulmalla. Teho ajasta tai nopeudesta, jos annat ne.",
    expression: "W = Fs cosθ,   P = W/t = Fv cosθ",
    tags: ["työ", "teho", "joule", "watti", "voima", "energia"],
    seed: { F: "20", s: "3", theta: "0", t: "4", v: "" },
    fields: fixed([
      numField("F", "Voima F", "N", "20"),
      numField("s", "Siirtymä s", "m", "3"),
      numField("theta", "Kulma θ", "°", "0", "voiman ja siirtymän välinen kulma"),
      numField("t", "Aika t", "s", "4", "valinnainen, antaa keskitehon"),
      numField("v", "Nopeus v", "m/s", "", "valinnainen, antaa tehon P = Fv cosθ"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["F", "s", "theta"]);
      if (failed(nums)) return nums;
      const [F, s, theta] = nums;
      const t = opt(raw, "t");
      if (isErr(t)) return t;
      const v = opt(raw, "v");
      if (isErr(v)) return v;
      if (t.value !== null && t.value <= 0) return err("Ajan pitää olla suurempi kuin 0.");
      const W = F * s * Math.cos(rad(theta));
      const rows = [row("w", "Työ W", formatNum(W), "J", true)];
      if (t.value !== null) rows.push(row("pt", "Keskiteho W/t", formatNum(W / t.value), "W"));
      if (v.value !== null) rows.push(row("pv", "Teho Fv cosθ", formatNum(F * v.value * Math.cos(rad(theta))), "W"));
      rows.push(row("cos", "cos θ", formatNum(Math.cos(rad(theta)))));
      return ok(rows);
    },
  },
  {
    id: "energy",
    subcategory: "energia",
    name: "Mekaaninen energia",
    category: "fysiikka",
    blurb: "Liike-energia ja potentiaalienergia samalle kappaleelle.",
    expression: "Eₖ = ½mv²,   Eₚ = mgh",
    tags: ["liike-energia", "potentiaalienergia", "energia", "joule", "korkeus"],
    seed: { m: "2", v: "4", h: "3", g: "9,81" },
    fields: fixed([
      numField("m", "Massa m", "kg", "2"),
      numField("v", "Nopeus v", "m/s", "4"),
      numField("h", "Korkeus h", "m", "3"),
      numField("g", "Putoamiskiihtyvyys g", "m/s²", "9,81"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["m", "v", "h", "g"]);
      if (failed(nums)) return nums;
      const [m, v, h, g] = nums;
      if (m < 0) return err("Massa ei voi olla negatiivinen.");
      const kinetic = 0.5 * m * v * v;
      const potential = m * g * h;
      return ok([
        row("ek", "Liike-energia", formatNum(kinetic), "J", true),
        row("ep", "Potentiaalienergia", formatNum(potential), "J"),
        row("sum", "Summa", formatNum(kinetic + potential), "J"),
      ]);
    },
  },
  {
    id: "vectors",
    subcategory: "vektorit",
    name: "Vektorit",
    category: "fysiikka",
    blurb: "Komponentit, napakoordinaatit, summa ja pistetulo tasossa.",
    expression: "r = √(x² + y²),   a·b = ax bx + ay by",
    tags: ["vektori", "komponentti", "pistetulo", "kulma", "resultantti"],
    seed: { mode: "components", x: "3", y: "4", r: "5", theta: "53,13", x1: "3", y1: "4", x2: "1", y2: "2" },
    fields: (raw) => {
      const mode = val(raw, "mode", "components");
      const head = selectField("mode", "Lasketaan", [
        { value: "components", label: "Komponenteista napakoordinaatit" },
        { value: "polar", label: "Napakoordinaateista komponentit" },
        { value: "sum", label: "Kahden vektorin summa" },
        { value: "dot", label: "Pistetulo ja välikulma" },
      ]);
      if (mode === "polar") {
        return [head, numField("r", "Pituus r", undefined, "5"), numField("theta", "Kulma θ", "°", "53,13", "x-akselista")];
      }
      if (mode === "components") {
        return [head, numField("x", "x-komponentti", undefined, "3"), numField("y", "y-komponentti", undefined, "4")];
      }
      return [
        head,
        numField("x1", "ax", undefined, "3"),
        numField("y1", "ay", undefined, "4"),
        numField("x2", "bx", undefined, "1"),
        numField("y2", "by", undefined, "2"),
      ];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "components");
      if (mode === "polar") {
        const nums = readNums(raw, ["r", "theta"]);
        if (failed(nums)) return nums;
        const [r, theta] = nums;
        if (r < 0) return err("Pituus ei voi olla negatiivinen.");
        return ok([
          row("x", "x", formatNum(r * Math.cos(rad(theta))), undefined, true),
          row("y", "y", formatNum(r * Math.sin(rad(theta)))),
        ]);
      }
      if (mode === "components") {
        const nums = readNums(raw, ["x", "y"]);
        if (failed(nums)) return nums;
        const [x, y] = nums;
        const r = Math.hypot(x, y);
        return ok([
          row("r", "Pituus r", formatNum(r), undefined, true),
          row("theta", "Kulma θ", formatNum(deg(Math.atan2(y, x))), "°"),
        ]);
      }
      const nums = readNums(raw, ["x1", "y1", "x2", "y2"]);
      if (failed(nums)) return nums;
      const [x1, y1, x2, y2] = nums;
      if (mode === "sum") {
        const x = x1 + x2;
        const y = y1 + y2;
        return ok([
          row("x", "Rx", formatNum(x), undefined, true),
          row("y", "Ry", formatNum(y)),
          row("r", "Pituus", formatNum(Math.hypot(x, y))),
          row("theta", "Kulma", formatNum(deg(Math.atan2(y, x))), "°"),
        ]);
      }
      const dot = x1 * x2 + y1 * y2;
      const a = Math.hypot(x1, y1);
      const b = Math.hypot(x2, y2);
      if (a === 0 || b === 0) return err("Nollavektorin välistä kulmaa ei voi laskea.");
      const cos = Math.min(1, Math.max(-1, dot / (a * b)));
      return ok([
        row("dot", "Pistetulo", formatNum(dot), undefined, true),
        row("angle", "Välikulma", formatNum(deg(Math.acos(cos))), "°"),
        row("a", "|a|", formatNum(a)),
        row("b", "|b|", formatNum(b)),
      ]);
    },
  },
  {
    id: "uncertainty",
    subcategory: "mittaus",
    name: "Mittausepävarmuus",
    category: "fysiikka",
    blurb: "Absoluuttinen ja suhteellinen epävarmuus. Summa ja tulo riippumattomille virheille neliösummana.",
    expression: "δz = √(δa² + δb²),   δz/z = √((δa/a)² + (δb/b)²)",
    tags: ["epävarmuus", "virhe", "mittaus", "suhteellinen", "neliösumma"],
    seed: { mode: "single", x: "10", dx: "0,2", a: "10", da: "0,2", b: "4", db: "0,1", op: "add" },
    fields: (raw) => {
      const mode = val(raw, "mode", "single");
      const head = selectField("mode", "Tapaus", [
        { value: "single", label: "Yksi mittaustulos" },
        { value: "sum", label: "Summa tai erotus" },
        { value: "product", label: "Tulo tai osamäärä" },
      ]);
      if (mode === "single") {
        return [head, numField("x", "Arvo x", undefined, "10"), numField("dx", "Epävarmuus δx", undefined, "0,2")];
      }
      const op =
        mode === "sum"
          ? selectField("op", "Laskutoimitus", [
              { value: "add", label: "a + b" },
              { value: "sub", label: "a − b" },
            ])
          : selectField("op", "Laskutoimitus", [
              { value: "mul", label: "a · b" },
              { value: "div", label: "a / b" },
            ]);
      return [
        head,
        op,
        numField("a", "a", undefined, "10"),
        numField("da", "δa", undefined, "0,2"),
        numField("b", "b", undefined, "4"),
        numField("db", "δb", undefined, "0,1"),
      ];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "single");
      if (mode === "single") {
        const nums = readNums(raw, ["x", "dx"]);
        if (failed(nums)) return nums;
        const [x, dx] = nums;
        if (dx < 0) return err("Epävarmuus ei voi olla negatiivinen.");
        const rows = [
          row("abs", "Tulos", `${formatNum(x)} ± ${formatNum(dx)}`, undefined, true),
          row("dx", "Absoluuttinen", formatNum(dx)),
        ];
        rows.push(row("rel", "Suhteellinen", x === 0 ? "nollasta ei määritelty" : formatNum((Math.abs(dx) / Math.abs(x)) * 100), x === 0 ? undefined : "%"));
        return ok(rows);
      }
      const nums = readNums(raw, ["a", "da", "b", "db"]);
      if (failed(nums)) return nums;
      const [a, da, b, db] = nums;
      if (da < 0 || db < 0) return err("Epävarmuus ei voi olla negatiivinen.");
      const op = val(raw, "op", mode === "sum" ? "add" : "mul");
      const quad = Math.hypot(da, db);
      const linear = Math.abs(da) + Math.abs(db);
      if (mode === "sum") {
        const z = op === "sub" ? a - b : a + b;
        return ok([
          row("z", "Tulos", `${formatNum(z)} ± ${formatNum(quad)}`, undefined, true),
          row("quad", "Neliösumma", formatNum(quad)),
          row("max", "Maksimivirhe", formatNum(linear)),
        ]);
      }
      if (op === "div" && b === 0) return err("Jakaja ei voi olla 0.");
      if (a === 0 || b === 0) return err("Suhteellista virhettä ei voi laskea nollasta.");
      const z = op === "div" ? a / b : a * b;
      const rel = Math.hypot(da / a, db / b);
      return ok([
        row("z", "Tulos", `${formatNum(z)} ± ${formatNum(Math.abs(z) * rel)}`, undefined, true),
        row("rel", "Suhteellinen", formatNum(rel * 100), "%"),
        row("abs", "Absoluuttinen", formatNum(Math.abs(z) * rel)),
      ]);
    },
  },
  {
    id: "momentum",
    subcategory: "liikemaara",
    name: "Liikemäärä ja impulssi",
    category: "fysiikka",
    blurb: "Liikemäärä mv tai impulssi voiman ja ajan tulona.",
    expression: "p = mv,   J = FΔt = Δp",
    tags: ["liikemäärä", "impulssi", "massa", "nopeus", "voima"],
    seed: { mode: "p", unknown: "p", m: "2", v: "3", p: "6", F: "10", dt: "0,2" },
    fields: (raw) => {
      const mode = val(raw, "mode", "p");
      const head = selectField("mode", "Lasketaan", [
        { value: "p", label: "Liikemäärä p = mv" },
        { value: "impulse", label: "Impulssi J = FΔt" },
      ]);
      if (mode === "impulse") {
        return [
          head,
          numField("F", "Voima F", "N", "10"),
          numField("dt", "Aika Δt", "s", "0,2"),
          numField("m", "Massa m", "kg", "2", "valinnainen, antaa nopeuden muutoksen"),
        ];
      }
      const unknown = val(raw, "unknown", "p");
      return [
        head,
        selectField("unknown", "Ratkaistaan", [
          { value: "p", label: "Liikemäärä p" },
          { value: "m", label: "Massa m" },
          { value: "v", label: "Nopeus v" },
        ]),
        numField("m", "Massa m", "kg", "2"),
        numField("v", "Nopeus v", "m/s", "3"),
        numField("p", "Liikemäärä p", "kg·m/s", "6"),
      ].filter((field) => field.id !== unknown);
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "p");
      if (mode === "impulse") {
        const nums = readNums(raw, ["F", "dt"]);
        if (failed(nums)) return nums;
        const [F, dt] = nums;
        const m = opt(raw, "m");
        if (isErr(m)) return m;
        const J = F * dt;
        const rows = [row("j", "Impulssi J", formatNum(J), "N·s", true), row("dp", "Δp", formatNum(J), "kg·m/s")];
        if (m.value !== null) {
          if (m.value === 0) return err("Massa ei voi olla 0.");
          rows.push(row("dv", "Δv = J/m", formatNum(J / m.value), "m/s"));
        }
        return ok(rows);
      }
      const unknown = val(raw, "unknown", "p");
      const ids = ["m", "v", "p"].filter((id) => id !== unknown);
      const known = readNums(raw, ids);
      if (failed(known)) return known;
      const map: Record<string, number> = {};
      ids.forEach((id, index) => {
        map[id] = known[index];
      });
      let m = map.m;
      let v = map.v;
      let p = map.p;
      if (unknown === "p") {
        if (m === undefined || v === undefined) return err("Massa ja nopeus tarvitaan.");
        p = m * v;
      } else if (unknown === "m") {
        if (p === undefined || v === undefined) return err("Liikemäärä ja nopeus tarvitaan.");
        if (v === 0) return err("Nopeus on 0, massaa ei voi ratkaista.");
        m = p / v;
      } else {
        if (p === undefined || m === undefined) return err("Liikemäärä ja massa tarvitaan.");
        if (m === 0) return err("Massa ei voi olla 0.");
        v = p / m;
      }
      if (m === undefined || v === undefined || p === undefined) return err("Suuretta ei saatu ratkaistua.");
      return ok([
        row("p", "Liikemäärä p", formatNum(p), "kg·m/s", unknown === "p"),
        row("m", "Massa m", formatNum(m), "kg", unknown === "m"),
        row("v", "Nopeus v", formatNum(v), "m/s", unknown === "v"),
      ]);
    },
  },
  {
    id: "collision",
    subcategory: "liikemaara",
    name: "Törmäys suoralla",
    category: "fysiikka",
    blurb: "Yksiulotteinen törmäys. Kimmoton tarttuu yhteen, kimmoisa säilyttää liike-energian.",
    expression: "m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'",
    tags: ["törmäys", "kimmoisa", "kimmoton", "liikemäärä", "liike-energia"],
    seed: { mode: "inelastic", m1: "2", v1: "4", m2: "2", v2: "0" },
    fields: fixed([
      selectField("mode", "Törmäys", [
        { value: "inelastic", label: "Kimmoton, kappaleet tarttuvat" },
        { value: "elastic", label: "Täysin kimmoisa" },
      ]),
      numField("m1", "Massa m₁", "kg", "2"),
      numField("v1", "Nopeus v₁", "m/s", "4", "suunta positiiviseen"),
      numField("m2", "Massa m₂", "kg", "2"),
      numField("v2", "Nopeus v₂", "m/s", "0"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["m1", "v1", "m2", "v2"]);
      if (failed(nums)) return nums;
      const [m1, v1, m2, v2] = nums;
      if (m1 <= 0 || m2 <= 0) return err("Massojen pitää olla suurempia kuin 0.");
      const before = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
      const mode = val(raw, "mode", "inelastic");
      if (mode === "inelastic") {
        const v = (m1 * v1 + m2 * v2) / (m1 + m2);
        const after = 0.5 * (m1 + m2) * v * v;
        return ok([
          row("v", "Yhteinen nopeus", formatNum(v), "m/s", true),
          row("p", "Liikemäärä", formatNum(m1 * v1 + m2 * v2), "kg·m/s"),
          row("before", "Eₖ ennen", formatNum(before), "J"),
          row("after", "Eₖ jälkeen", formatNum(after), "J"),
          row("loss", "Häviö", formatNum(before - after), "J"),
        ]);
      }
      const v1p = ((m1 - m2) / (m1 + m2)) * v1 + ((2 * m2) / (m1 + m2)) * v2;
      const v2p = ((2 * m1) / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2;
      const after = 0.5 * m1 * v1p * v1p + 0.5 * m2 * v2p * v2p;
      return ok([
        row("v1", "v₁'", formatNum(v1p), "m/s", true),
        row("v2", "v₂'", formatNum(v2p), "m/s", true),
        row("p", "Liikemäärä", formatNum(m1 * v1 + m2 * v2), "kg·m/s"),
        row("before", "Eₖ ennen", formatNum(before), "J"),
        row("after", "Eₖ jälkeen", formatNum(after), "J"),
      ]);
    },
  },
  {
    id: "rotation-kin",
    subcategory: "pyoriminen",
    name: "Pyörimisen perusyhtälöt",
    category: "fysiikka",
    blurb: "Tasaisesti kiihtyvä pyöriminen. Kulmat radiaaneina ja kierroksina.",
    expression: "ω = ω₀ + αt,   θ = ω₀t + ½αt²",
    tags: ["pyöriminen", "kulmanopeus", "kulmakiihtyvyys", "radiaani"],
    seed: { w0: "0", alpha: "2", t: "3" },
    fields: fixed([
      numField("w0", "Alkukulmanopeus ω₀", "rad/s", "0"),
      numField("alpha", "Kulmakiihtyvyys α", "rad/s²", "2"),
      numField("t", "Aika t", "s", "3"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["w0", "alpha", "t"]);
      if (failed(nums)) return nums;
      const [w0, alpha, t] = nums;
      if (t < 0) return err("Aika ei voi olla negatiivinen.");
      const w = w0 + alpha * t;
      const theta = w0 * t + 0.5 * alpha * t * t;
      return ok([
        row("w", "Kulmanopeus ω", formatNum(w), "rad/s", true),
        row("f", "Kierrostaajuus", formatNum(w / (2 * Math.PI)), "1/s"),
        row("theta", "Kiertokulma θ", formatNum(theta), "rad"),
        row("rev", "Kierrokset", formatNum(theta / (2 * Math.PI)), "kierrosta"),
      ]);
    },
  },
  {
    id: "inertia",
    subcategory: "pyoriminen",
    name: "Hitausmomentti",
    category: "fysiikka",
    blurb: "Jäykän kappaleen hitausmomentti akselin suhteen. Anna kulmakiihtyvyys, jos haluat vääntömomentin.",
    expression: "I = k m r²,   τ = Iα",
    tags: ["hitausmomentti", "vääntömomentti", "kiekko", "sauva", "pallo"],
    seed: { shape: "disk", m: "2", size: "0,1", alpha: "10" },
    fields: (raw) => {
      const shape = val(raw, "shape", "disk");
      const rod = shape === "rod-center" || shape === "rod-end";
      return [
        selectField("shape", "Kappale", [
          { value: "point", label: "Pistemassa, I = mr²" },
          { value: "rod-center", label: "Ohut sauva, akseli keskellä" },
          { value: "rod-end", label: "Ohut sauva, akseli päässä" },
          { value: "hoop", label: "Ohut rengas tai sylinterivaippa" },
          { value: "disk", label: "Kiekko tai umpisylinteri" },
          { value: "sphere", label: "Umpinainen pallo" },
          { value: "shell", label: "Ohut pallokuori" },
        ]),
        numField("m", "Massa m", "kg", "2"),
        numField("size", rod ? "Pituus L" : "Säde R", "m", "0,1"),
        numField("alpha", "Kulmakiihtyvyys α", "rad/s²", "10", "valinnainen"),
      ];
    },
    compute: (raw) => {
      const nums = readNums(raw, ["m", "size"]);
      if (failed(nums)) return nums;
      const [m, size] = nums;
      const alpha = opt(raw, "alpha");
      if (isErr(alpha)) return alpha;
      if (m < 0 || size < 0) return err("Massa ja mitta eivät voi olla negatiivisia.");
      const I = inertia(val(raw, "shape", "disk"), m, size);
      if (I === null) return err("Kappaletta ei tunnistettu.");
      const rows = [row("i", "Hitausmomentti I", formatNum(I), "kg·m²", true)];
      if (alpha.value !== null) rows.push(row("tau", "Vääntömomentti τ = Iα", formatNum(I * alpha.value), "N·m"));
      return ok(rows);
    },
  },
  {
    id: "torque",
    subcategory: "pyoriminen",
    name: "Vääntömomentti",
    category: "fysiikka",
    blurb: "Voiman momentti varren suhteen. Anna hitausmomentti, jos haluat kulmakiihtyvyyden.",
    expression: "τ = r F sinθ",
    tags: ["vääntömomentti", "momentti", "vipuvarsi", "torque"],
    note: "Koulukirjoissa vääntömomentin tunnus on usein M. Tässä se on τ.",
    seed: { r: "0,2", F: "10", theta: "90", I: "" },
    fields: fixed([
      numField("r", "Vipuvarsi r", "m", "0,2"),
      numField("F", "Voima F", "N", "10"),
      numField("theta", "Kulma θ", "°", "90", "voiman ja varren välinen kulma"),
      numField("I", "Hitausmomentti I", "kg·m²", "", "valinnainen"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["r", "F", "theta"]);
      if (failed(nums)) return nums;
      const [r, F, theta] = nums;
      const I = opt(raw, "I");
      if (isErr(I)) return I;
      const tau = r * F * Math.sin(rad(theta));
      const rows = [row("tau", "Vääntömomentti τ", formatNum(tau), "N·m", true)];
      if (I.value !== null) {
        if (I.value === 0) return err("Hitausmomentti ei voi olla 0, jos kulmakiihtyvyys lasketaan.");
        rows.push(row("alpha", "Kulmakiihtyvyys α = τ/I", formatNum(tau / I.value), "rad/s²"));
      }
      return ok(rows);
    },
  },
  {
    id: "lever",
    subcategory: "pyoriminen",
    name: "Vipu ja tasapaino",
    category: "fysiikka",
    blurb: "Kiertokeskipisteen suhteen momentit kumoavat toisensa. Varret ovat kohtisuoria etäisyyksiä.",
    expression: "F₁ d₁ = F₂ d₂",
    tags: ["vipu", "tasapaino", "momentti", "staatiikka"],
    seed: { unknown: "F2", F1: "20", d1: "0,3", F2: "12", d2: "0,5" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "F2");
      return [
        selectField("unknown", "Ratkaistaan", [
          { value: "F1", label: "Voima F₁" },
          { value: "d1", label: "Varsi d₁" },
          { value: "F2", label: "Voima F₂" },
          { value: "d2", label: "Varsi d₂" },
        ]),
        numField("F1", "Voima F₁", "N", "20"),
        numField("d1", "Varsi d₁", "m", "0,3"),
        numField("F2", "Voima F₂", "N", "12"),
        numField("d2", "Varsi d₂", "m", "0,5"),
      ].filter((field) => field.id !== unknown);
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "F2");
      const ids = ["F1", "d1", "F2", "d2"].filter((id) => id !== unknown);
      const known = readNums(raw, ids);
      if (failed(known)) return known;
      const map: Record<string, number> = {};
      ids.forEach((id, index) => {
        map[id] = known[index];
      });
      const need = (id: string) => {
        const n = map[id];
        if (n === undefined) throw new Error("puuttuva");
        return n;
      };
      let F1: number;
      let d1: number;
      let F2: number;
      let d2: number;
      try {
        if (unknown === "F1") {
          d1 = need("d1");
          F2 = need("F2");
          d2 = need("d2");
          if (d1 === 0) return err("Varsi d₁ ei voi olla 0.");
          F1 = (F2 * d2) / d1;
        } else if (unknown === "d1") {
          F1 = need("F1");
          F2 = need("F2");
          d2 = need("d2");
          if (F1 === 0) return err("Voima F₁ on 0, vartta ei voi ratkaista.");
          d1 = (F2 * d2) / F1;
        } else if (unknown === "F2") {
          F1 = need("F1");
          d1 = need("d1");
          d2 = need("d2");
          if (d2 === 0) return err("Varsi d₂ ei voi olla 0.");
          F2 = (F1 * d1) / d2;
        } else {
          F1 = need("F1");
          d1 = need("d1");
          F2 = need("F2");
          if (F2 === 0) return err("Voima F₂ on 0, vartta ei voi ratkaista.");
          d2 = (F1 * d1) / F2;
        }
      } catch {
        return err("Tarvittava suure puuttuu.");
      }
      if (d1 < 0 || d2 < 0) return err("Vipuvarsi ei voi olla negatiivinen.");
      return ok([
        row("f1", "Voima F₁", formatNum(F1), "N", unknown === "F1"),
        row("d1", "Varsi d₁", formatNum(d1), "m", unknown === "d1"),
        row("f2", "Voima F₂", formatNum(F2), "N", unknown === "F2"),
        row("d2", "Varsi d₂", formatNum(d2), "m", unknown === "d2"),
        row("tau", "Momentti", formatNum(F1 * d1), "N·m"),
      ]);
    },
  },
  {
    id: "circular",
    subcategory: "pyoriminen",
    name: "Ympyräliike",
    category: "fysiikka",
    blurb: "Keskipakois- eli normaalikiihtyvyys. Anna massa, jos haluat keskihakuisvoiman.",
    expression: "a = v²/r = ω²r,   F = ma",
    tags: ["ympyräliike", "keskeiskiihtyvyys", "kulmanopeus", "sentripetaali"],
    seed: { kind: "v", r: "2", speed: "4", m: "1" },
    fields: fixed([
      numField("r", "Säde r", "m", "2"),
      selectField("kind", "Nopeuden laatu", [
        { value: "v", label: "Ratanopeus v" },
        { value: "w", label: "Kulmanopeus ω" },
        { value: "f", label: "Kierrostaajuus f" },
      ]),
      numField("speed", "Nopeuden arvo", undefined, "4"),
      numField("m", "Massa m", "kg", "1", "valinnainen"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["r", "speed"]);
      if (failed(nums)) return nums;
      const [r, speed] = nums;
      const m = opt(raw, "m");
      if (isErr(m)) return m;
      if (r <= 0) return err("Säteen pitää olla suurempi kuin 0.");
      const kind = val(raw, "kind", "v");
      let v: number;
      let w: number;
      if (kind === "w") {
        w = speed;
        v = w * r;
      } else if (kind === "f") {
        w = 2 * Math.PI * speed;
        v = w * r;
      } else {
        v = speed;
        w = v / r;
      }
      const a = (v * v) / r;
      const rows = [
        row("a", "Keskipakoiskiihtyvyys", formatNum(a), "m/s²", true),
        row("v", "Ratanopeus v", formatNum(v), "m/s"),
        row("w", "Kulmanopeus ω", formatNum(w), "rad/s"),
        row("f", "Kierrostaajuus", formatNum(w / (2 * Math.PI)), "Hz"),
        row("t", "Jakso", w === 0 ? "—" : formatNum((2 * Math.PI) / w), w === 0 ? undefined : "s"),
      ];
      if (m.value !== null) rows.push(row("force", "Keskihakuisvoima", formatNum(m.value * a), "N"));
      return ok(rows);
    },
  },
  {
    id: "heat",
    subcategory: "lampo",
    name: "Lämpömäärä",
    category: "fysiikka",
    blurb: "Lämpeneminen tai olomuodon muutos. Ominaislämmöt ovat tavallisia taulukkoarvoja.",
    expression: "Q = cmΔT,   Q = Lm",
    tags: ["lämpö", "lämpömäärä", "ominaislämpö", "sulaminen", "höyrystyminen"],
    seed: { mode: "heat", material: "vesi", m: "0,2", dT: "80", c: "4186", latent: "sulaminen", L: "3,34e5" },
    fields: (raw) => {
      const mode = val(raw, "mode", "heat");
      const head = selectField("mode", "Ilmiö", [
        { value: "heat", label: "Lämpeneminen Q = cmΔT" },
        { value: "latent", label: "Olomuodon muutos Q = Lm" },
      ]);
      if (mode === "latent") {
        const kind = val(raw, "latent", "sulaminen");
        const fields = [
          head,
          selectField("latent", "Aine ja muutos", [
            { value: "sulaminen", label: "Veden sulaminen 334 kJ/kg" },
            { value: "hoyry", label: "Veden höyrystyminen 2260 kJ/kg" },
            { value: "custom", label: "Oma L" },
          ]),
          numField("m", "Massa m", "kg", "0,2"),
        ];
        if (kind === "custom") fields.push(numField("L", "Ominaismuutoslämpö L", "J/kg", "3,34e5"));
        return fields;
      }
      const material = val(raw, "material", "vesi");
      const fields = [
        head,
        selectField("material", "Aine", [
          { value: "vesi", label: "Vesi 4186 J/(kg·K)" },
          { value: "jaa", label: "Jää 2090 J/(kg·K)" },
          { value: "al", label: "Alumiini 897 J/(kg·K)" },
          { value: "rauta", label: "Rauta 449 J/(kg·K)" },
          { value: "kupari", label: "Kupari 385 J/(kg·K)" },
          { value: "ilma", label: "Ilma 1005 J/(kg·K)" },
          { value: "custom", label: "Oma c" },
        ]),
        numField("m", "Massa m", "kg", "0,2"),
        numField("dT", "Lämpötilan muutos ΔT", "K", "80"),
      ];
      if (material === "custom") fields.push(numField("c", "Ominaislämpökapasiteetti c", "J/(kg·K)", "4186"));
      return fields;
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "heat");
      const table: Record<string, number> = { vesi: 4186, jaa: 2090, al: 897, rauta: 449, kupari: 385, ilma: 1005 };
      const latentTable: Record<string, number> = { sulaminen: 3.34e5, hoyry: 2.26e6 };
      if (mode === "latent") {
        const m = readNums(raw, ["m"]);
        if (failed(m)) return m;
        const kind = val(raw, "latent", "sulaminen");
        let L = latentTable[kind];
        if (kind === "custom") {
          const custom = readNums(raw, ["L"]);
          if (failed(custom)) return custom;
          L = custom[0];
        }
        if (L === undefined) return err("Ominaismuutoslämpö puuttuu.");
        return ok([
          row("q", "Lämpömäärä Q", formatNum(m[0] * L), "J", true),
          row("kj", "Lämpömäärä", formatNum((m[0] * L) / 1000), "kJ"),
          row("l", "L", formatNum(L), "J/kg"),
        ]);
      }
      const nums = readNums(raw, ["m", "dT"]);
      if (failed(nums)) return nums;
      const [m, dT] = nums;
      const material = val(raw, "material", "vesi");
      let c = table[material];
      if (material === "custom") {
        const custom = readNums(raw, ["c"]);
        if (failed(custom)) return custom;
        c = custom[0];
      }
      if (c === undefined) return err("Ominaislämpökapasiteetti puuttuu.");
      const Q = c * m * dT;
      return ok([
        row("q", "Lämpömäärä Q", formatNum(Q), "J", true),
        row("kj", "Lämpömäärä", formatNum(Q / 1000), "kJ"),
        row("c", "c", formatNum(c), "J/(kg·K)"),
      ]);
    },
  },
  {
    id: "idealgas",
    subcategory: "lampo",
    name: "Ideaalikaasu",
    category: "fysiikka",
    blurb: "Ratkaise paine, tilavuus, ainemäärä tai lämpötila. Lämpötila annetaan kelvineinä.",
    expression: "pV = nRT",
    note: "R = 8,314 J/(mol·K). 0 °C = 273,15 K.",
    tags: ["ideaalikaasu", "paine", "tilavuus", "lämpötila", "mooli"],
    seed: { unknown: "p", p: "101325", V: "0,024", n: "1", T: "293,15" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "p");
      return [
        selectField("unknown", "Ratkaistaan", [
          { value: "p", label: "Paine p" },
          { value: "V", label: "Tilavuus V" },
          { value: "n", label: "Ainemäärä n" },
          { value: "T", label: "Lämpötila T" },
        ]),
        numField("p", "Paine p", "Pa", "101325"),
        numField("V", "Tilavuus V", "m³", "0,024"),
        numField("n", "Ainemäärä n", "mol", "1"),
        numField("T", "Lämpötila T", "K", "293,15"),
      ].filter((field) => field.id !== unknown);
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "p");
      const ids = ["p", "V", "n", "T"].filter((id) => id !== unknown);
      const known = readNums(raw, ids);
      if (failed(known)) return known;
      const map: Record<string, number> = {};
      ids.forEach((id, index) => {
        map[id] = known[index];
      });
      const pick = (id: string) => map[id] as number;
      let p: number;
      let V: number;
      let n: number;
      let T: number;
      if (unknown === "p") {
        V = pick("V");
        n = pick("n");
        T = pick("T");
        if (V === 0) return err("Tilavuus ei voi olla 0.");
        p = (n * R_GAS * T) / V;
      } else if (unknown === "V") {
        p = pick("p");
        n = pick("n");
        T = pick("T");
        if (p === 0) return err("Paine ei voi olla 0.");
        V = (n * R_GAS * T) / p;
      } else if (unknown === "n") {
        p = pick("p");
        V = pick("V");
        T = pick("T");
        if (T === 0) return err("Lämpötila 0 K ei käy ainemäärän ratkaisuun.");
        n = (p * V) / (R_GAS * T);
      } else {
        p = pick("p");
        V = pick("V");
        n = pick("n");
        if (n === 0) return err("Ainemäärä ei voi olla 0.");
        T = (p * V) / (n * R_GAS);
      }
      if (V < 0 || n < 0 || T < 0) return err("Tilavuus, ainemäärä ja lämpötila eivät voi olla negatiivisia.");
      return ok([
        row("p", "Paine p", formatNum(p), "Pa", unknown === "p"),
        row("bar", "Paine", formatNum(p / 1e5), "bar"),
        row("v", "Tilavuus V", formatNum(V), "m³", unknown === "V"),
        row("n", "Ainemäärä n", formatNum(n), "mol", unknown === "n"),
        row("t", "Lämpötila T", formatNum(T), "K", unknown === "T"),
        row("c", "Lämpötila", formatNum(T - 273.15), "°C"),
      ]);
    },
  },
  {
    id: "expansion",
    subcategory: "lampo",
    name: "Lämpölaajeneminen",
    category: "fysiikka",
    blurb: "Pituuden muutos ja siitä arvioitu pinta-alan sekä tilavuuden suhteellinen muutos.",
    expression: "ΔL = α L₀ ΔT,   ΔV/V ≈ 3αΔT",
    tags: ["lämpölaajeneminen", "pituus", "tilavuus", "lämpötila"],
    seed: { alpha: "2,3e-5", L: "1", dT: "50" },
    fields: fixed([
      numField("alpha", "Pituuden lämpötilakerroin α", "1/K", "2,3e-5"),
      numField("L", "Alkuperäinen pituus L₀", "m", "1"),
      numField("dT", "Lämpötilan muutos ΔT", "K", "50"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["alpha", "L", "dT"]);
      if (failed(nums)) return nums;
      const [alpha, L, dT] = nums;
      const dL = alpha * L * dT;
      return ok([
        row("dl", "Pituuden muutos ΔL", formatNum(dL), "m", true),
        row("l", "Uusi pituus", formatNum(L + dL), "m"),
        row("a", "Pinta-alan suhteellinen muutos", formatNum(2 * alpha * dT * 100), "%"),
        row("v", "Tilavuuden suhteellinen muutos", formatNum(3 * alpha * dT * 100), "%"),
      ]);
    },
  },
  {
    id: "coulomb",
    subcategory: "kentat",
    name: "Coulombin laki ja kenttä",
    category: "fysiikka",
    blurb: "Kahden pistevarauksen voima sekä ensimmäisen varauksen kenttä ja potentiaali etäisyydellä r.",
    expression: "F = k q₁q₂ / r²,   E = kq / r²,   V = kq / r",
    note: "k = 8,988×10⁹ N·m²/C². Negatiivinen voima tarkoittaa vetoa. Potentiaali on ensimmäisen varauksen potentiaali.",
    tags: ["coulomb", "sähkökenttä", "potentiaali", "varaus", "jännite"],
    seed: { q1: "1e-6", q2: "1e-6", r: "0,1" },
    fields: fixed([
      numField("q1", "Varaus q₁", "C", "1e-6"),
      numField("q2", "Varaus q₂", "C", "1e-6"),
      numField("r", "Etäisyys r", "m", "0,1"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["q1", "q2", "r"]);
      if (failed(nums)) return nums;
      const [q1, q2, r] = nums;
      if (r <= 0) return err("Etäisyyden pitää olla suurempi kuin 0.");
      const F = (K_E * q1 * q2) / (r * r);
      const E = (K_E * q1) / (r * r);
      const V = (K_E * q1) / r;
      return ok([
        row("f", "Voima F", formatNum(F), "N", true),
        row("dir", "Suunta", F < 0 ? "veto" : F > 0 ? "poisto" : "ei voimaa"),
        row("e", "Kenttä E(q₁)", formatNum(E), "N/C"),
        row("v", "Potentiaali V(q₁)", formatNum(V), "V"),
      ]);
    },
  },
  {
    id: "magnetic",
    subcategory: "kentat",
    name: "Magneettikenttä ja Lorentz",
    category: "fysiikka",
    blurb: "Suoran johtimen kenttä, varauksen Lorentzin voima tai virtajohtimeen kohdistuva voima.",
    expression: "B = μ₀I / (2πr),   F = qvB sinθ,   F = ILB sinθ",
    note: "μ₀ = 4π×10⁻⁷ H/m. Kulma on nopeuden tai johtimen ja kentän välinen.",
    tags: ["magneettikenttä", "lorentz", "tesla", "johdin", "voima"],
    seed: { mode: "wire", I: "10", r: "0,05", q: "1,6e-19", v: "1e6", B: "0,5", theta: "90", L: "0,2" },
    fields: (raw) => {
      const mode = val(raw, "mode", "wire");
      const head = selectField("mode", "Tapaus", [
        { value: "wire", label: "Suoran johtimen kenttä B" },
        { value: "lorentz", label: "Varaus kentässä" },
        { value: "force", label: "Virtajohdin kentässä" },
      ]);
      if (mode === "lorentz") {
        return [
          head,
          numField("q", "Varaus q", "C", "1,6e-19"),
          numField("v", "Nopeus v", "m/s", "1e6"),
          numField("B", "Kenttä B", "T", "0,5"),
          numField("theta", "Kulma θ", "°", "90"),
        ];
      }
      if (mode === "force") {
        return [
          head,
          numField("I", "Virta I", "A", "10"),
          numField("L", "Pituus L", "m", "0,2"),
          numField("B", "Kenttä B", "T", "0,5"),
          numField("theta", "Kulma θ", "°", "90"),
        ];
      }
      return [head, numField("I", "Virta I", "A", "10"), numField("r", "Etäisyys r", "m", "0,05")];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "wire");
      if (mode === "wire") {
        const nums = readNums(raw, ["I", "r"]);
        if (failed(nums)) return nums;
        const [I, r] = nums;
        if (r <= 0) return err("Etäisyyden pitää olla suurempi kuin 0.");
        const B = (MU_0 * I) / (2 * Math.PI * r);
        return ok([row("b", "Magneettivuon tiheys B", formatNum(B), "T", true)]);
      }
      if (mode === "lorentz") {
        const nums = readNums(raw, ["q", "v", "B", "theta"]);
        if (failed(nums)) return nums;
        const [q, v, B, theta] = nums;
        const F = Math.abs(q) * v * B * Math.sin(rad(theta));
        return ok([row("f", "Voima F", formatNum(F), "N", true)]);
      }
      const nums = readNums(raw, ["I", "L", "B", "theta"]);
      if (failed(nums)) return nums;
      const [I, L, B, theta] = nums;
      return ok([row("f", "Voima F", formatNum(I * L * B * Math.sin(rad(theta))), "N", true)]);
    },
  },
  {
    id: "tsiolkovsky",
    subcategory: "raketti",
    name: "Tsiolkovskin rakettiyhtälö",
    category: "fysiikka",
    blurb: "Nopeuden muutos pakokaasun nopeudesta ja massasuhteesta, tai loppumassa halutulle Δv:lle.",
    expression: "Δv = vₑ ln(m₀ / mf)",
    tags: ["tsiolkovski", "raketti", "delta-v", "ominaisimpulssi", "pakokaasu"],
    note: "Ominaisimpulssista vₑ = Iₛₚ g₀ ja g₀ = 9,80665 m/s².",
    seed: { unknown: "dv", drive: "ve", ve: "3000", isp: "306", m0: "1000", mf: "200", dv: "4828" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "dv");
      const drive = val(raw, "drive", "ve");
      const fields = [
        selectField("unknown", "Ratkaistaan", [
          { value: "dv", label: "Nopeuden muutos Δv" },
          { value: "mf", label: "Loppumassa mf" },
          { value: "ve", label: "Pakokaasun nopeus vₑ" },
        ]),
      ];
      if (unknown !== "ve") {
        fields.push(
          selectField("drive", "Työntö annetaan", [
            { value: "ve", label: "Pakokaasun nopeus vₑ" },
            { value: "isp", label: "Ominaisimpulssi Iₛₚ" },
          ]),
        );
        if (drive === "isp") fields.push(numField("isp", "Ominaisimpulssi Iₛₚ", "s", "306"));
        else fields.push(numField("ve", "Pakokaasun nopeus vₑ", "m/s", "3000"));
      }
      fields.push(numField("m0", "Alkumassa m₀", "kg", "1000"));
      if (unknown !== "mf") fields.push(numField("mf", "Loppumassa mf", "kg", "200"));
      if (unknown !== "dv") fields.push(numField("dv", "Nopeuden muutos Δv", "m/s", "4828"));
      return fields;
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "dv");
      const drive = val(raw, "drive", "ve");
      const m0n = readNums(raw, ["m0"]);
      if (failed(m0n)) return m0n;
      const m0 = m0n[0];
      if (m0 <= 0) return err("Alkumassan pitää olla suurempi kuin 0.");
      let ve: number | undefined;
      if (unknown !== "ve") {
        if (drive === "isp") {
          const isp = readNums(raw, ["isp"]);
          if (failed(isp)) return isp;
          if (isp[0] <= 0) return err("Ominaisimpulssin pitää olla suurempi kuin 0.");
          ve = isp[0] * G_STD;
        } else {
          const given = readNums(raw, ["ve"]);
          if (failed(given)) return given;
          ve = given[0];
          if (ve <= 0) return err("Pakokaasun nopeuden pitää olla suurempi kuin 0.");
        }
      }
      let mf: number | undefined;
      let dv: number | undefined;
      if (unknown !== "mf") {
        const given = readNums(raw, ["mf"]);
        if (failed(given)) return given;
        mf = given[0];
        if (mf <= 0) return err("Loppumassan pitää olla suurempi kuin 0.");
        if (mf > m0) return err("Loppumassa ei voi olla alkumassaa suurempi.");
      }
      if (unknown !== "dv") {
        const given = readNums(raw, ["dv"]);
        if (failed(given)) return given;
        dv = given[0];
      }
      if (unknown === "dv") {
        if (ve === undefined || ve <= 0 || mf === undefined) return err("Pakokaasun nopeus ja massat tarvitaan.");
        dv = ve * Math.log(m0 / mf);
      } else if (unknown === "mf") {
        if (ve === undefined || ve <= 0 || dv === undefined) return err("Nopeudet ja alkumassa tarvitaan.");
        mf = m0 * Math.exp(-dv / ve);
        if (mf <= 0 || mf > m0) return err("Δv ei ole saavutettavissa tällä pakokaasun nopeudella.");
      } else {
        if (mf === undefined || dv === undefined || mf === m0) return err("Massojen pitää erota, jotta vₑ voidaan ratkaista.");
        ve = dv / Math.log(m0 / mf);
      }
      if (ve === undefined || mf === undefined || dv === undefined || ve <= 0) return err("Suureita ei saatu ratkaistua.");
      return ok([
        row("dv", "Δv", formatNum(dv), "m/s", unknown === "dv"),
        row("ve", "Pakokaasun nopeus vₑ", formatNum(ve), "m/s", unknown === "ve"),
        row("isp", "Ominaisimpulssi", formatNum(ve / G_STD), "s"),
        row("ratio", "Massasuhde m₀/mf", formatNum(m0 / mf)),
        row("prop", "Ajoaine", formatNum(m0 - mf), "kg"),
        row("mf", "Loppumassa", formatNum(mf), "kg", unknown === "mf"),
      ]);
    },
  },
  {
    id: "orbit",
    subcategory: "raketti",
    name: "Kiertorata ja pakonopeus",
    category: "fysiikka",
    blurb: "Ympyräradan nopeus, pakonopeus ja jakso, tai Hohmannin siirto kahden ympyräradan välillä.",
    expression: "v = √(GM/r),   vₑₛc = √(2GM/r)",
    tags: ["kiertorata", "pakonopeus", "hohmann", "kepler", "gravitaatio"],
    seed: { mode: "orbit", body: "earth", h: "0", gm: "3,986e14", radius: "6,371e6", r1: "6771000", r2: "42164000" },
    fields: (raw) => {
      const mode = val(raw, "mode", "orbit");
      const body = val(raw, "body", "earth");
      const head = [
        selectField("mode", "Lasketaan", [
          { value: "orbit", label: "Rata korkeudella h" },
          { value: "hohmann", label: "Hohmannin siirto" },
        ]),
        selectField("body", "Keskuskappale", [
          { value: "earth", label: "Maa" },
          { value: "moon", label: "Kuu" },
          { value: "mars", label: "Mars" },
          { value: "custom", label: "Oma GM ja säde" },
        ]),
      ];
      if (body === "custom") {
        head.push(numField("gm", "GM", "m³/s²", "3,986e14"));
        if (mode === "orbit") head.push(numField("radius", "Säde R", "m", "6,371e6"));
      }
      if (mode === "hohmann") {
        return [...head, numField("r1", "Alempi säde r₁", "m", "6771000"), numField("r2", "Ylempi säde r₂", "m", "42164000")];
      }
      return [...head, numField("h", "Korkeus h", "m", "0", "pinnasta")];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "orbit");
      const bodyId = val(raw, "body", "earth");
      const body = BODIES[bodyId];
      let gm: number | undefined = body?.gm;
      let radius: number | undefined = body?.radius;
      if (bodyId === "custom") {
        const ids = mode === "orbit" ? ["gm", "radius"] : ["gm"];
        const nums = readNums(raw, ids);
        if (failed(nums)) return nums;
        gm = nums[0];
        radius = mode === "orbit" ? nums[1] : undefined;
      }
      if (gm === undefined || gm <= 0) return err("GM:n pitää olla suurempi kuin 0.");
      if (mode === "hohmann") {
        const radii = readNums(raw, ["r1", "r2"]);
        if (failed(radii)) return radii;
        const [r1, r2] = radii;
        if (r1 <= 0 || r2 <= 0) return err("Säteiden pitää olla suurempia kuin 0.");
        if (r1 === r2) return err("Säteet ovat samat, siirtoa ei tarvita.");
        const lo = Math.min(r1, r2);
        const hi = Math.max(r1, r2);
        const dv1 = Math.sqrt(gm / lo) * (Math.sqrt((2 * hi) / (lo + hi)) - 1);
        const dv2 = Math.sqrt(gm / hi) * (1 - Math.sqrt((2 * lo) / (lo + hi)));
        const a = (lo + hi) / 2;
        const time = Math.PI * Math.sqrt((a * a * a) / gm);
        return ok([
          row("dv1", "Δv₁ alemmalla radalla", formatNum(dv1), "m/s", true),
          row("dv2", "Δv₂ ylemmällä radalla", formatNum(dv2), "m/s"),
          row("sum", "Δv yhteensä", formatNum(dv1 + dv2), "m/s"),
          row("t", "Siirtoaika", formatNum(time / 60), "min"),
        ]);
      }
      const h = readNums(raw, ["h"]);
      if (failed(h)) return h;
      if (radius === undefined || radius <= 0) return err("Säteen pitää olla suurempi kuin 0.");
      const r = radius + h[0];
      if (r <= 0) return err("Ratakorkeus jää kappaleen sisään tai sen keskipisteeseen.");
      const v = Math.sqrt(gm / r);
      const vesc = Math.sqrt((2 * gm) / r);
      const period = 2 * Math.PI * Math.sqrt((r * r * r) / gm);
      const g = gm / (r * r);
      return ok([
        row("v", "Kiertonopeus", formatNum(v), "m/s", true),
        row("esc", "Pakonopeus", formatNum(vesc), "m/s"),
        row("t", "Jakso", formatNum(period / 60), "min"),
        row("g", "Painovoimakiihtyvyys", formatNum(g), "m/s²"),
        row("r", "Ratäsäde", formatNum(r), "m"),
      ]);
    },
  },
];
