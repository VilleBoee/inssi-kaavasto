import type { Formula } from "./shared";
import {
  empty,
  err,
  failed,
  fixed,
  formatDuration,
  formatNum,
  numField,
  ok,
  parseNum,
  readNums,
  row,
  selectField,
  textField,
  val,
  waveSpeed,
} from "./shared";

const R_UNITS = [
  { value: "1", label: "Ω" },
  { value: "1e3", label: "kΩ" },
  { value: "1e6", label: "MΩ" },
];
const C_UNITS = [
  { value: "1", label: "F" },
  { value: "1e-3", label: "mF" },
  { value: "1e-6", label: "µF" },
  { value: "1e-9", label: "nF" },
  { value: "1e-12", label: "pF" },
];
const F_UNITS = [
  { value: "1", label: "Hz" },
  { value: "1e3", label: "kHz" },
  { value: "1e6", label: "MHz" },
  { value: "1e9", label: "GHz" },
];

function scale(id: string, table: { value: string }[], fallback: string): number {
  const raw = id || fallback;
  const found = table.find((u) => u.value === raw);
  return Number(found ? found.value : fallback);
}

export const elektroniikka: Formula[] = [
  {
    id: "ohm",
    subcategory: "piirit",
    name: "Ohmin laki",
    category: "elektroniikka",
    blurb: "Ratkaise jännite, virta tai resistanssi, kun kaksi muuta tunnetaan.",
    expression: "U = I · R",
    tags: ["ohm", "jännite", "virta", "resistanssi", "voltage", "u=ir"],
    seed: { unknown: "I", U: "12", I: "2", R: "6" },
    fields: (raw) => {
      const unknown = val(raw, "unknown", "I");
      const mode = selectField("unknown", "Ratkaistaan", [
        { value: "U", label: "Jännite U" },
        { value: "I", label: "Virta I" },
        { value: "R", label: "Resistanssi R" },
      ]);
      const fields = [
        mode,
        numField("U", "Jännite U", "V", "12"),
        numField("I", "Virta", "A", "2"),
        numField("R", "Resistanssi", "Ω", "6"),
      ];
      return fields.filter((f) => f.id !== unknown);
    },
    compute: (raw) => {
      const unknown = val(raw, "unknown", "I");
      const ids = ["U", "I", "R"].filter((id) => id !== unknown);
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
      let U: number;
      let I: number;
      let R: number;
      if (unknown === "U") {
        I = pick("I");
        R = pick("R");
        U = I * R;
      } else if (unknown === "I") {
        U = pick("U");
        R = pick("R");
        if (R === 0) return err("Resistanssi ei voi olla 0.");
        I = U / R;
      } else {
        U = pick("U");
        I = pick("I");
        if (I === 0) return err("Virta on 0, resistanssia ei voi ratkaista.");
        R = U / I;
      }
      const power = U * I;
      return ok([
        row("u", "Jännite U", formatNum(U), "V", unknown === "U"),
        row("i", "Virta I", formatNum(I), "A", unknown === "I"),
        row("r", "Resistanssi R", formatNum(R), "Ω", unknown === "R"),
        row("p", "Teho P = U·I", formatNum(power), "W"),
      ]);
    },
  },
  {
    id: "power",
    subcategory: "piirit",
    name: "Sähköteho",
    category: "elektroniikka",
    blurb: "Teho kahdesta suureesta: jännite, virta tai resistanssi.",
    expression: "P = U·I = I²·R = U²/R",
    tags: ["teho", "watti", "power", "p=ui"],
    seed: { U: "12", I: "0,5", R: "" },
    fields: fixed([
      numField("U", "Jännite U", "V", "12", "Jätä tyhjäksi, jos sitä ei tunneta"),
      numField("I", "Virta", "A", "0,5"),
      numField("R", "Resistanssi", "Ω"),
    ]),
    compute: (raw) => {
      const read = (id: string) => {
        const s = val(raw, id).trim();
        if (!s) return null;
        return parseNum(s);
      };
      const Uraw = read("U");
      const Iraw = read("I");
      const Rraw = read("R");
      if ([val(raw, "U"), val(raw, "I"), val(raw, "R")].some((s) => s.trim() && parseNum(s) === null)) {
        return err("Lukua ei tunnistettu. Käytä desimaalipilkkua tai pistettä.");
      }
      const filled = [Uraw, Iraw, Rraw].filter((n) => n !== null).length;
      if (filled < 2) return empty();
      let U = Uraw;
      let I = Iraw;
      let R = Rraw;
      if (U !== null && I !== null) {
        if (I === 0 && U !== 0) return err("Virta on 0 mutta jännite ei — resistanssi olisi ääretön.");
        if (I !== 0) {
          const rCalc = U / I;
          if (R !== null && Math.abs(R - rCalc) > 1e-6 * Math.max(1, Math.abs(rCalc))) {
            return err("U, I ja R eivät toteuta Ohmin lakia. Tyhjennä ristiriitainen kenttä.");
          }
          R = rCalc;
        }
      } else if (U !== null && R !== null) {
        if (R === 0) return err("Resistanssi ei voi olla 0.");
        I = U / R;
      } else if (I !== null && R !== null) {
        U = I * R;
      }
      if (U === null || I === null || R === null) return err("Suureita ei saatu ratkaistua.");
      const p = U * I;
      return ok([
        row("p", "Teho", formatNum(p), "W", true),
        row("u", "Jännite U", formatNum(U), "V"),
        row("i", "Virta", formatNum(I), "A"),
        row("r", "Resistanssi", formatNum(R), "Ω"),
      ]);
    },
  },
  {
    id: "resistors",
    subcategory: "piirit",
    name: "Vastukset sarjassa ja rinnan",
    category: "elektroniikka",
    blurb: "Kokonaisresistanssi pilkulla tai välilyönnillä erotetusta listasta.",
    expression: "R_sarja = Σ Rᵢ,   1/R_rinnan = Σ 1/Rᵢ",
    tags: ["vastus", "sarja", "rinnan", "resistor", "parallel", "series"],
    seed: { list: "100, 220, 470" },
    fields: fixed([textField("list", "Resistanssit", "100, 220, 470", "ohmeina")]),
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
        if (n <= 0) return err("Resistanssien pitää olla suurempia kuin 0.");
        values.push(n);
      }
      const series = values.reduce((a, b) => a + b, 0);
      const parallel = 1 / values.reduce((a, b) => a + 1 / b, 0);
      return ok([
        row("series", "Sarjassa", formatNum(series), "Ω", true),
        row("parallel", "Rinnan", formatNum(parallel), "Ω"),
        row("count", "Vastuksia", String(values.length), "kpl"),
      ]);
    },
  },
  {
    id: "rc",
    subcategory: "signaalit",
    name: "RC-aikavakio",
    category: "elektroniikka",
    blurb: "Aikavakio ja alipäästösuodattimen rajataajuus.",
    expression: "τ = R·C,   f_c = 1 / (2πRC)",
    tags: ["rc", "kondensaattori", "aikavakio", "suodatin", "cutoff"],
    seed: { r: "10", runit: "1e3", c: "100", cunit: "1e-9" },
    fields: fixed([
      numField("r", "Resistanssi", undefined, "10"),
      selectField("runit", "R-yksikkö", R_UNITS),
      numField("c", "Kapasitanssi", undefined, "100"),
      selectField("cunit", "C-yksikkö", C_UNITS),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["r", "c"]);
      if (failed(nums)) return nums;
      const [r, c] = nums;
      if (r < 0 || c < 0) return err("R ja C eivät voi olla negatiivisia.");
      const tau = r * scale(val(raw, "runit"), R_UNITS, "1") * c * scale(val(raw, "cunit"), C_UNITS, "1e-6");
      if (tau === 0) return err("Aikavakio on 0. Tarkista arvot.");
      const fc = 1 / (2 * Math.PI * tau);
      return ok([
        row("tau", "Aikavakio τ", formatDuration(tau), undefined, true),
        row("sec", "Sekunteina", formatNum(tau), "s"),
        row("fc", "Rajataajuus −3 dB", formatNum(fc), "Hz"),
        row("t63", "≈ 63 % latauksesta", formatDuration(tau)),
      ]);
    },
  },
  {
    id: "freq",
    subcategory: "signaalit",
    name: "Taajuus ja jaksoaika",
    category: "elektroniikka",
    blurb: "Taajuudesta jaksoaika tai päinvastoin, sekä kulmataajuus.",
    expression: "f = 1 / T,   ω = 2πf",
    tags: ["taajuus", "jakso", "hz", "period", "kulmataajuus"],
    seed: { mode: "f", freq: "440", funit: "1", period: "2", punit: "1e-3" },
    fields: (raw) => {
      const mode = val(raw, "mode", "f");
      const head = selectField("mode", "Tunnetaan", [
        { value: "f", label: "Taajuus" },
        { value: "t", label: "Jaksoaika" },
      ]);
      if (mode === "t") {
        return [
          head,
          numField("period", "Jaksoaika", undefined, "2"),
          selectField("punit", "Aikayksikkö", [
            { value: "1", label: "s" },
            { value: "1e-3", label: "ms" },
            { value: "1e-6", label: "µs" },
            { value: "1e-9", label: "ns" },
          ]),
        ];
      }
      return [head, numField("freq", "Taajuus", undefined, "440"), selectField("funit", "Taajuusyksikkö", F_UNITS)];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "f");
      let hz: number;
      if (mode === "t") {
        const nums = readNums(raw, ["period"]);
        if (failed(nums)) return nums;
        const period = nums[0] * scale(val(raw, "punit"), [{ value: "1" }, { value: "1e-3" }, { value: "1e-6" }, { value: "1e-9" }], "1");
        if (period <= 0) return err("Jaksoajan pitää olla suurempi kuin 0.");
        hz = 1 / period;
      } else {
        const nums = readNums(raw, ["freq"]);
        if (failed(nums)) return nums;
        hz = nums[0] * scale(val(raw, "funit"), F_UNITS, "1");
        if (hz <= 0) return err("Taajuuden pitää olla suurempi kuin 0.");
      }
      return ok([
        row("f", "Taajuus", formatNum(hz), "Hz", true),
        row("t", "Jaksoaika", formatDuration(1 / hz)),
        row("omega", "Kulmataajuus ω", formatNum(2 * Math.PI * hz), "rad/s"),
        row("khz", "Kilohertseinä", formatNum(hz / 1e3), "kHz"),
      ]);
    },
  },
  {
    id: "wave",
    subcategory: "signaalit",
    name: "Aallonpituus",
    category: "elektroniikka",
    blurb: "Aallonpituus taajuudesta tyhjiössä, kaapelissa tai omalla nopeudella.",
    expression: "λ = v / f",
    note: "Tyhjiön valonnopeus on 299 792 458 m/s. Kaapelille käytetään tyypillistä kerrointa 0,66.",
    tags: ["aallonpituus", "wavelength", "radio", "wifi", "valo"],
    seed: { freq: "2400", funit: "1e6", medium: "c", speed: "200000000" },
    fields: (raw) => {
      const fields = [
        numField("freq", "Taajuus", undefined, "2400"),
        selectField("funit", "Taajuusyksikkö", F_UNITS),
        selectField("medium", "Väliaine", [
          { value: "c", label: "Tyhjiö (c)" },
          { value: "cable", label: "Kaapeli (0,66·c)" },
          { value: "custom", label: "Oma nopeus" },
        ]),
      ];
      if (val(raw, "medium", "c") === "custom") fields.push(numField("speed", "Nopeus", "m/s", "200000000"));
      return fields;
    },
    compute: (raw) => {
      const nums = readNums(raw, val(raw, "medium") === "custom" ? ["freq", "speed"] : ["freq"]);
      if (failed(nums)) return nums;
      const freq = nums[0] * scale(val(raw, "funit"), F_UNITS, "1e6");
      if (freq <= 0) return err("Taajuuden pitää olla suurempi kuin 0.");
      const speed = waveSpeed(val(raw, "medium", "c"), nums[1] ?? 0);
      if (speed === null || speed <= 0) return err("Nopeuden pitää olla suurempi kuin 0.");
      const lambda = speed / freq;
      return ok([
        row("lambda", "Aallonpituus", formatNum(lambda), "m", true),
        row("cm", "Senttimetreinä", formatNum(lambda * 100), "cm"),
        row("mhz", "Taajuus", formatNum(freq / 1e6), "MHz"),
        row("v", "Etenemisnopeus", formatNum(speed), "m/s"),
      ]);
    },
  },
  {
    id: "db",
    subcategory: "desibeli",
    name: "Desibeli",
    category: "elektroniikka",
    blurb: "Teho- ja amplitudisuhde desibeleiksi ja takaisin.",
    expression: "dB = 10·log₁₀(P₂/P₁) = 20·log₁₀(U₂/U₁)",
    tags: ["desibeli", "db", "log", "vahvistus", "snr"],
    seed: { mode: "power", ratio: "1000", db: "30" },
    fields: (raw) => {
      const mode = val(raw, "mode", "power");
      const head = selectField("mode", "Muunnos", [
        { value: "power", label: "Tehosuhde → dB" },
        { value: "amp", label: "Amplitudisuhde → dB" },
        { value: "fromdb", label: "dB → suhteet" },
      ]);
      if (mode === "fromdb") return [head, numField("db", "Desibelit", "dB", "30")];
      return [head, numField("ratio", "Suhde", undefined, "1000", "suurempi kuin 0")];
    },
    compute: (raw) => {
      const mode = val(raw, "mode", "power");
      if (mode === "fromdb") {
        const nums = readNums(raw, ["db"]);
        if (failed(nums)) return nums;
        const [db] = nums;
        return ok([
          row("p", "Tehosuhde", formatNum(10 ** (db / 10)), "×", true),
          row("a", "Amplitudisuhde", formatNum(10 ** (db / 20)), "×"),
          row("db", "Desibelit", formatNum(db), "dB"),
        ]);
      }
      const nums = readNums(raw, ["ratio"]);
      if (failed(nums)) return nums;
      const [ratio] = nums;
      if (ratio <= 0) return err("Suhteen pitää olla suurempi kuin 0.");
      const db = mode === "amp" ? 20 * Math.log10(ratio) : 10 * Math.log10(ratio);
      return ok([
        row("db", "Desibelit", formatNum(db), "dB", true),
        row("ratio", mode === "amp" ? "Amplitudisuhde" : "Tehosuhde", formatNum(ratio), "×"),
      ]);
    },
  },
  {
    id: "divider",
    subcategory: "piirit",
    name: "Jännitteenjako",
    category: "elektroniikka",
    blurb: "Kuormittamaton jako. R1 on lähteen puolella, R2 mitattavan jännitteen puolella.",
    expression: "U₂ = U · R₂ / (R₁ + R₂)",
    tags: ["jännitejako", "jännite", "vastus", "piiri", "divider"],
    seed: { U: "12", r1: "1000", r2: "2000" },
    fields: fixed([
      numField("U", "Syöttöjännite U", "V", "12"),
      numField("r1", "R₁", "Ω", "1000"),
      numField("r2", "R₂", "Ω", "2000"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["U", "r1", "r2"]);
      if (failed(nums)) return nums;
      const [U, r1, r2] = nums;
      if (r1 < 0 || r2 < 0) return err("Resistanssi ei voi olla negatiivinen.");
      if (r1 + r2 === 0) return err("Vastusten summa ei voi olla 0.");
      const I = U / (r1 + r2);
      return ok([
        row("u2", "Jännite U₂", formatNum(I * r2), "V", true),
        row("u1", "Jännite U₁", formatNum(I * r1), "V"),
        row("i", "Virta I", formatNum(I), "A"),
      ]);
    },
  },
  {
    id: "source",
    subcategory: "piirit",
    name: "Lähde ja sisäinen vastus",
    category: "elektroniikka",
    blurb: "Kuormitettu jännitelähde. Kuorma annetaan resistanssina tai virtana.",
    expression: "U = E − Ir,   I = E / (R + r)",
    tags: ["sisäinen vastus", "lähde", "kuorma", "jännite", "piiri"],
    seed: { mode: "load", E: "12", r: "0,5", R: "5,5", I: "2" },
    fields: (raw) => {
      const mode = val(raw, "mode", "load");
      const head = [
        selectField("mode", "Kuorma annetaan", [
          { value: "load", label: "Kuormaresistanssi R" },
          { value: "current", label: "Virta I" },
        ]),
        numField("E", "Lähdejännite E", "V", "12"),
        numField("r", "Sisäinen vastus r", "Ω", "0,5"),
      ];
      if (mode === "current") return [...head, numField("I", "Virta I", "A", "2")];
      return [...head, numField("R", "Kuorma R", "Ω", "5,5")];
    },
    compute: (raw) => {
      const nums = readNums(raw, ["E", "r"]);
      if (failed(nums)) return nums;
      const [E, r] = nums;
      if (r < 0) return err("Sisäinen vastus ei voi olla negatiivinen.");
      const mode = val(raw, "mode", "load");
      if (mode === "current") {
        const current = readNums(raw, ["I"]);
        if (failed(current)) return current;
        const I = current[0];
        const U = E - I * r;
        return ok([
          row("u", "Napajännite U", formatNum(U), "V", true),
          row("i", "Virta I", formatNum(I), "A"),
          row("loss", "Sisäinen teho", formatNum(I * I * r), "W"),
          row("load", "Kuorman teho", formatNum(U * I), "W"),
        ]);
      }
      const load = readNums(raw, ["R"]);
      if (failed(load)) return load;
      const R = load[0];
      if (R < 0) return err("Kuorma ei voi olla negatiivinen.");
      if (R + r === 0) return err("Kokonaisresistanssi ei voi olla 0.");
      const I = E / (R + r);
      const U = I * R;
      return ok([
        row("u", "Napajännite U", formatNum(U), "V", true),
        row("i", "Virta I", formatNum(I), "A"),
        row("loss", "Sisäinen teho I²r", formatNum(I * I * r), "W"),
        row("load", "Kuorman teho", formatNum(U * I), "W"),
      ]);
    },
  },
];
