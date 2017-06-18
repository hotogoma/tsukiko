function deltaT(year) {
  return (0.44 * (year - 1990)) + 58;
}

const sla = [36000.7695, 280.4659, 1.9147, 0.0200, -0.0048, 0.0020, 0.0018, 0.0018, 0.0015,
  0.0013, 0.0007, 0.0007, 0.0007, 0.0006, 0.0005, 0.0005, 0.0004, 0.0004];
const slb = [0, 0, 35999.05, 71998.1, 35999, 32964, 19, 445267, 45038, 22519,
  65929, 3035, 9038, 33718, 155, 2281, 29930, 31557];
const slc = [0, 0, 267.52, 265.1, 268, 158, 159, 208, 254, 352,
  45, 110, 64, 316, 118, 221, 48, 161];

function SunMLong(T) {
  let ans = 0.0;
  let kaku;
  const t = T / 36525.0;
  for (let i = 17; i >= 0; i -= 1) {
    kaku = ((slb[i] * t) + slc[i]) * (Math.PI / 180.0);
    if ((i === 0) || (i === 4)) ans += sla[i] * t * Math.cos(kaku);
    else ans += sla[i] * Math.cos(kaku);
  }
  ans -= Math.floor(ans / 360.0) * 360.0;
  return ans;
}

function SunLong(T) {
  const dans = -0.0057 + (0.0048 * Math.cos((((1934 * T) / 36525.0) + 145) * (Math.PI / 180.0)));
  let ans = SunMLong(T) + dans;
  while (ans < 0.0) ans += 360.0;
  while (ans >= 360.0) ans -= 360.0;
  return ans;
}

function getJulian(y, m, d) {
  const date = new Date(y, m, d);
  return Math.floor(((date.getTime() / 86400000) - (date.getTimezoneOffset() / 1440)) + 2440587.5);
}

function Sunlongdays(year, kaku) {
  let sl;
  const t0 = getJulian(year, 1, 1) - getJulian(2000, 1, 1) - 1.5;
  let bsl = SunLong(t0);
  const ofs = kaku < bsl ? -360.0 : 0.0;
  let t = Math.floor((kaku - bsl - ofs) * 0.9);
  for (;;) {
    sl = SunLong(t + t0);
    if (sl < bsl) bsl += ofs;
    if ((sl >= kaku) && (bsl < kaku)) {
      t += (kaku - sl) / (sl - bsl);
      t += (kaku - SunLong(t + t0)) / (sl - bsl);
      break;
    }
    bsl = sl;
    t += 1;
  }
  return t;
}

module.exports = function lng2date(year, sl) {
  const dt = deltaT(year) / 86400.0;
  const h = (Sunlongdays(year, sl) + (9 / 24)) - dt;
  const date = new Date(year, 0, 0);
  return new Date(date.getTime() + (h * 86400000));
};
