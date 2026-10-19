import type { Formula } from "./shared";
import {
  BW_UNITS,
  DATA_UNITS,
  bwUnit,
  bytesLabel,
  dataUnit,
  empty,
  err,
  failed,
  fixed,
  formatDuration,
  formatNum,
  intToIpv4,
  ipv4ToInt,
  maskOf,
  numField,
  ok,
  readNums,
  row,
  selectField,
  textField,
  val,
} from "./shared";

export const verkko: Formula[] = [
  {
    id: "subnet",
    subcategory: "osoitteet",
    name: "IPv4-aliverkko",
    category: "verkko",
    blurb: "Verkko-osoite, maski, broadcast ja käytettävät osoitteet CIDR-etuliitteestä.",
    expression: "verkko = osoite ∧ maski",
    note: "/31 on pisteestä pisteeseen (RFC 3021, molemmat osoitteet käytössä). /32 on yksittäinen osoite.",
    tags: ["ip", "cidr", "subnet", "maski", "ipv4", "aliverkko"],
    seed: { ip: "192.168.1.50", prefix: "24" },
    fields: fixed([
      textField("ip", "IPv4-osoite", "192.168.1.50"),
      numField("prefix", "Etuliite", "/bittiä", "24", "0–32"),
    ]),
    compute: (raw) => {
      const ipRaw = val(raw, "ip").trim();
      if (!ipRaw || !val(raw, "prefix").trim()) return empty();
      const addr = ipv4ToInt(ipRaw);
      if (addr === null) return err("IPv4-osoite ei kelpaa. Muoto on a.b.c.d, osat 0–255.");
      const nums = readNums(raw, ["prefix"]);
      if (failed(nums)) return nums;
      const prefix = nums[0];
      if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return err("Etuliitteen pitää olla kokonaisluku 0–32.");
      const mask = maskOf(prefix);
      const network = (addr & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      const total = 2 ** (32 - prefix);
      const usable = prefix >= 31 ? total : Math.max(0, total - 2);
      const first = prefix >= 31 ? network : (network + 1) >>> 0;
      const last = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
      return ok([
        row("net", "Verkko-osoite", intToIpv4(network), `/${prefix}`, true),
        row("mask", "Aliverkon peite", intToIpv4(mask)),
        row("wild", "Jokeripeite", intToIpv4(~mask >>> 0)),
        row("bc", "Broadcast", intToIpv4(broadcast)),
        row("first", "Ensimmäinen käytettävä", intToIpv4(first)),
        row("last", "Viimeinen käytettävä", intToIpv4(last)),
        row("usable", "Käytettäviä osoitteita", formatNum(usable), "kpl"),
        row("total", "Osoitteita yhteensä", formatNum(total), "kpl"),
      ]);
    },
  },
  {
    id: "transfer",
    subcategory: "siirto",
    name: "Siirtoaika",
    category: "verkko",
    blurb: "Kuinka kauan tiedoston siirto kestää annetulla kaistalla.",
    expression: "t = koko / kaista",
    note: "Kaavat olettavat täyden kaistan ilman protokollan overheadia. Mbit/s on megabittiä sekunnissa, MB/s megatavua.",
    tags: ["kaista", "bandwidth", "siirto", "download", "aika"],
    seed: { size: "1,5", sizeUnit: "GiB", bw: "100", bwUnit: "Mbps" },
    fields: fixed([
      numField("size", "Tiedoston koko", undefined, "1,5"),
      selectField("sizeUnit", "Kokoyksikkö", DATA_UNITS),
      numField("bw", "Kaistanleveys", undefined, "100"),
      selectField("bwUnit", "Kaistayksikkö", BW_UNITS),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["size", "bw"]);
      if (failed(nums)) return nums;
      const [size, bw] = nums;
      if (size < 0) return err("Koko ei voi olla negatiivinen.");
      if (bw <= 0) return err("Kaistan pitää olla suurempi kuin 0.");
      const bytes = size * dataUnit(val(raw, "sizeUnit", "B")).bytes;
      const bps = bw * bwUnit(val(raw, "bwUnit", "Mbps")).bps;
      const seconds = (bytes * 8) / bps;
      return ok([
        row("time", "Siirtoaika", formatDuration(seconds), undefined, true),
        row("sec", "Sekunteina", formatNum(seconds), "s"),
        row("bytes", "Koko", bytesLabel(bytes)),
        row("mbps", "Kaista", formatNum(bps / 1e6), "Mbit/s"),
      ]);
    },
  },
  {
    id: "bdp",
    subcategory: "siirto",
    name: "Kaista–viive-tulo",
    category: "verkko",
    blurb: "Montako bittiä on matkalla, ja miten suuri ikkuna linkin täyttämiseen tarvitaan.",
    expression: "BDP = kaista · RTT",
    note: "TCP-ikkunan pitää olla vähintään BDP, jotta pitkä nopea linkki täyttyy. RTT on edestakainen viive.",
    tags: ["bdp", "rtt", "tcp", "ikkuna", "latency", "bandwidth delay"],
    seed: { bw: "1", bwUnit: "Gbps", rtt: "30" },
    fields: fixed([
      numField("bw", "Kaistanleveys", undefined, "1"),
      selectField("bwUnit", "Kaistayksikkö", BW_UNITS),
      numField("rtt", "RTT", "ms", "30"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["bw", "rtt"]);
      if (failed(nums)) return nums;
      const [bw, rtt] = nums;
      if (bw < 0 || rtt < 0) return err("Kaista ja viive eivät voi olla negatiivisia.");
      const bps = bw * bwUnit(val(raw, "bwUnit", "Gbps")).bps;
      const bits = bps * (rtt / 1000);
      const bytes = bits / 8;
      return ok([
        row("bytes", "Bittien määrä matkalla", bytesLabel(bytes), undefined, true),
        row("bits", "Bitteinä", formatNum(bits), "bit"),
        row("window", "TCP-ikkuna vähintään", bytesLabel(bytes)),
        row("pkts", "1500 tavun paketteja", formatNum(bytes / 1500), "kpl"),
      ]);
    },
  },
  {
    id: "shannon",
    subcategory: "siirto",
    name: "Shannonin kapasiteetti",
    category: "verkko",
    blurb: "Kohinaisen kanavan suurin virheetön bittinopeus.",
    expression: "C = B · log₂(1 + SNR)",
    note: "SNR voi olla lineaarinen tehosuhde tai desibeleinä. B on kaistanleveys hertseinä.",
    tags: ["shannon", "snr", "kapasiteetti", "kanava", "kohina"],
    seed: { mhz: "20", snr: "30", snrMode: "db" },
    fields: fixed([
      numField("mhz", "Kaistanleveys", "MHz", "20"),
      numField("snr", "SNR", undefined, "30"),
      selectField("snrMode", "SNR:n muoto", [
        { value: "db", label: "Desibeliä (dB)" },
        { value: "lin", label: "Lineaarinen tehosuhde" },
      ]),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["mhz", "snr"]);
      if (failed(nums)) return nums;
      const [mhz, snrIn] = nums;
      if (mhz < 0) return err("Kaista ei voi olla negatiivinen.");
      const mode = val(raw, "snrMode", "db");
      const snr = mode === "db" ? 10 ** (snrIn / 10) : snrIn;
      if (snr < 0) return err("Lineaarinen SNR ei voi olla negatiivinen.");
      const b = mhz * 1e6;
      const c = b * Math.log2(1 + snr);
      return ok([
        row("c", "Kanavakapasiteetti", formatNum(c / 1e6), "Mbit/s", true),
        row("bps", "Bittiä sekunnissa", formatNum(c), "bit/s"),
        row("snrlin", "SNR lineaarisena", formatNum(snr)),
        row("snrdb", "SNR desibeleinä", formatNum(10 * Math.log10(Math.max(snr, 1e-15))), "dB"),
      ]);
    },
  },
  {
    id: "nyquist",
    subcategory: "siirto",
    name: "Nyquistin nopeus",
    category: "verkko",
    blurb: "Kohinattoman kanavan symbolinopeuden yläraja, kun tasoja on M.",
    expression: "C = 2 B · log₂ M",
    tags: ["nyquist", "symboli", "taso", "kanava"],
    seed: { hz: "4000", m: "16" },
    fields: fixed([
      numField("hz", "Kaistanleveys B", "Hz", "4000"),
      numField("m", "Signalointitasoja M", "kpl", "16"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["hz", "m"]);
      if (failed(nums)) return nums;
      const [hz, m] = nums;
      if (hz < 0) return err("Kaista ei voi olla negatiivinen.");
      if (!Number.isInteger(m) || m < 2) return err("Tasojen määrän pitää olla kokonaisluku ≥ 2.");
      const c = 2 * hz * Math.log2(m);
      return ok([
        row("c", "Bittinopeus", formatNum(c), "bit/s", true),
        row("sym", "Symbolinopeus", formatNum(2 * hz), "symbolia/s"),
        row("bits", "Bittejä / symboli", formatNum(Math.log2(m)), "bittiä"),
      ]);
    },
  },
  {
    id: "sla",
    subcategory: "palvelu",
    name: "Saatavuus ja seisokki",
    category: "verkko",
    blurb: "Kuinka pitkä seisokki sallitaan, kun käytettävyysprosentti tunnetaan.",
    expression: "seisokki = (1 − A) · jakso",
    note: "Vuosi on 365,25 vuorokautta. 99,9 % on kolme yhdeksikköä.",
    tags: ["sla", "uptime", "saatavuus", "nines", "downtime", "käytettävyys"],
    seed: { pct: "99,9" },
    fields: fixed([numField("pct", "Saatavuus", "%", "99,9")]),
    compute: (raw) => {
      const nums = readNums(raw, ["pct"]);
      if (failed(nums)) return nums;
      const [pct] = nums;
      if (pct < 0 || pct > 100) return err("Saatavuuden pitää olla 0–100 %.");
      const frac = 1 - pct / 100;
      const year = 365.25 * 86400 * frac;
      const nines = frac <= 0 ? Infinity : -Math.log10(frac);
      return ok([
        row("year", "Seisokki vuodessa", formatDuration(year), undefined, true),
        row("month", "Kuukaudessa", formatDuration(year / 12)),
        row("week", "Viikossa", formatDuration(7 * 86400 * frac)),
        row("day", "Vuorokaudessa", formatDuration(86400 * frac)),
        row("nines", "Yhdeksikköjä", Number.isFinite(nines) ? formatNum(nines) : "rajatta"),
      ]);
    },
  },
  {
    id: "mtbf",
    subcategory: "palvelu",
    name: "MTBF ja käytettävyys",
    category: "verkko",
    blurb: "Käytettävyys keskimääräisestä vikavälistä ja korjausajasta.",
    expression: "A = MTBF / (MTBF + MTTR)",
    tags: ["mtbf", "mttr", "availability", "luotettavuus", "vika"],
    seed: { mtbf: "10000", mttr: "2" },
    fields: fixed([
      numField("mtbf", "MTBF", "h", "10000"),
      numField("mttr", "MTTR", "h", "2"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["mtbf", "mttr"]);
      if (failed(nums)) return nums;
      const [mtbf, mttr] = nums;
      if (mtbf < 0 || mttr < 0) return err("Ajat eivät voi olla negatiivisia.");
      if (mtbf + mttr === 0) return err("Ainakin toisen ajan pitää olla suurempi kuin 0.");
      const a = mtbf / (mtbf + mttr);
      const yearDown = (1 - a) * 365.25 * 24;
      return ok([
        row("a", "Käytettävyys", formatNum(a * 100), "%", true),
        row("down", "Seisokki vuodessa", formatNum(yearDown), "h"),
        row("up", "Käynnissä vuodessa", formatNum(a * 365.25 * 24), "h"),
      ]);
    },
  },
  {
    id: "mm1",
    subcategory: "palvelu",
    name: "M/M/1-jono",
    category: "verkko",
    blurb: "Yhden palvelimen jono Poisson-saapumisilla ja eksponentiaalisella palvelulla.",
    expression: "ρ = λ / μ,  L = ρ / (1 − ρ)",
    note: "λ on saapumisintensiteetti ja μ palveluintensiteetti samassa aikayksikössä. Jono on stabiili vain kun λ < μ.",
    tags: ["jono", "queue", "little", "mm1", "käyttöaste"],
    seed: { lambda: "8", mu: "10" },
    fields: fixed([
      numField("lambda", "Saapumiset λ", "1/s", "8"),
      numField("mu", "Palvelu μ", "1/s", "10"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["lambda", "mu"]);
      if (failed(nums)) return nums;
      const [lambda, mu] = nums;
      if (lambda < 0 || mu <= 0) return err("λ ≥ 0 ja μ > 0.");
      if (lambda >= mu) return err("Jono ei ole stabiili: λ:n pitää olla pienempi kuin μ.");
      const rho = lambda / mu;
      const l = rho / (1 - rho);
      const lq = (rho * rho) / (1 - rho);
      const w = 1 / (mu - lambda);
      const wq = rho / (mu - lambda);
      return ok([
        row("rho", "Käyttöaste ρ", formatNum(rho * 100), "%", true),
        row("l", "Asiakkaita järjestelmässä L", formatNum(l), "kpl"),
        row("lq", "Jonossa Lq", formatNum(lq), "kpl"),
        row("w", "Viipymä W", formatDuration(w)),
        row("wq", "Odotus Wq", formatDuration(wq)),
      ]);
    },
  },
  {
    id: "little",
    subcategory: "palvelu",
    name: "Littlen laki",
    category: "verkko",
    blurb: "Keskimääräinen määrä järjestelmässä saapumisnopeudesta ja viipymästä.",
    expression: "L = λ · W",
    tags: ["little", "jono", "queue", "viipymä"],
    seed: { lambda: "4", w: "0,5" },
    fields: fixed([
      numField("lambda", "Saapumiset λ", "1/s", "4"),
      numField("w", "Keskimääräinen viipymä W", "s", "0,5"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["lambda", "w"]);
      if (failed(nums)) return nums;
      const [lambda, w] = nums;
      if (lambda < 0 || w < 0) return err("Arvot eivät voi olla negatiivisia.");
      return ok([
        row("l", "Keskimääräinen määrä L", formatNum(lambda * w), "kpl", true),
        row("check", "Tarkistus λ = L / W", w === 0 ? "—" : formatNum((lambda * w) / w), "1/s"),
      ]);
    },
  },
  {
    id: "iops",
    subcategory: "palvelu",
    name: "Levy-IOPS",
    category: "verkko",
    blurb: "Arvio satunnaisten I/O-operaatioiden määrästä hakuajasta ja kierrosnopeudesta.",
    expression: "IOPS ≈ 1000 / (haku + 30 000 / RPM)",
    note: "Pyörähdysviive on keskimäärin puoli kierrosta. SSD-levyille tämä malli ei päde — niillä ei ole mekaanista hakua.",
    tags: ["iops", "hdd", "levy", "rpm", "seek", "latency"],
    seed: { rpm: "7200", seek: "8,5" },
    fields: fixed([
      numField("rpm", "Kierrosnopeus", "r/min", "7200"),
      numField("seek", "Keskimääräinen hakuaika", "ms", "8,5"),
    ]),
    compute: (raw) => {
      const nums = readNums(raw, ["rpm", "seek"]);
      if (failed(nums)) return nums;
      const [rpm, seek] = nums;
      if (rpm <= 0 || seek < 0) return err("RPM > 0 ja hakuaika ≥ 0.");
      const rot = 30000 / rpm;
      const access = seek + rot;
      if (access <= 0) return err("Kokonaisaika ei voi olla 0.");
      return ok([
        row("iops", "Arvioitu IOPS", formatNum(1000 / access), "op/s", true),
        row("rot", "Pyörähdysviive", formatNum(rot), "ms"),
        row("access", "Keskimääräinen saantiaika", formatNum(access), "ms"),
      ]);
    },
  },
];
