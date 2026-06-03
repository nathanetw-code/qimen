import { Solar } from 'lunar-typescript';
import { QimenUtil } from './QimenUtil';

const dates = [
  { y: 1985, m: 9, d: 6, h: 16, min: 59, label: '1985-09-06 16:59 (known wrong)' },
  { y: 1985, m: 9, d: 7, h: 8,  min: 0,  label: '1985-09-07 08:00' },
  { y: 1985, m: 9, d: 7, h: 20, min: 0,  label: '1985-09-07 20:00' },
  { y: 1985, m: 10, d: 1, h: 12, min: 0, label: '1985-10-01 12:00' },
];

const pnames = ['P1(N)','P2(SW)','P3(E)','P4(SE)','P5(C)','P6(NW)','P7(W)','P8(NE)','P9(S)'];

for (const d of dates) {
  const solar = Solar.fromYmdHms(d.y, d.m, d.d, d.h, d.min, 0);
  const pan = QimenUtil.create(solar.getLunar());
  console.log(`\n=== ${d.label} ===`);
  console.log(`遁:${pan.遁} 局:${pan.局數} 旬:${pan.遁干}`);
  pan.九宮.forEach((c, i) => {
    console.log(`  ${pnames[i]}: 神=${c.八神||'-'} 星=${c.九星||'-'} 門=${c.八門||'-'}`);
  });
}
