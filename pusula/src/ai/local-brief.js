// Yerel durum notu: snapshot'tan doğal Türkçe metin. Sayım kesin, yorum örneklem.
import { readSnapshot, handleOf, confidenceOf } from './read.js';
import { fmtNum, fmtBig, fmtPct, fmtWhen, fmtDur, pick, excerpt, joinTr, cap } from './format.js';

const TREND = {
  patlama: 'hacim çok hızlı artıyor',
  yükseliyor: 'hacim artmayı sürdürüyor',
  hareketli: 'akış olağandan canlı ama sıçrama yok',
  sakin: 'akış olağan düzeyde',
  sönüyor: 'hacim geriliyor',
};
const ROLE = { yükseltici: 'erişimi sıçratan hesap', köprü: 'konuyu farklı bir kitleye taşıyan hesap', medya: 'haber kuruluşu', savunucu: 'savunan hesap', kaynak: 'ilk paylaşan', şüpheli: 'şüpheli küme üyesi' };
const AROUND = ['sularında', 'dolayında', 'civarında'];

function actorPhrase(a) {
  const bits = [];
  if (a.followers != null) bits.push(`${fmtBig(a.followers)} takipçi`);
  if (ROLE[a.role]) bits.push(ROLE[a.role]);
  return `${handleOf(a)}${bits.length ? ` (${bits.join(', ')})` : ''}`;
}

function stanceLine(st) {
  const parts = [['eleştiri', st.elestiri], ['alay', st.alay], ['soru', st.soru], ['destek', st.destek], ['nötr', st.notr]]
    .filter(([, v]) => v >= 0.05).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${fmtPct(v)}`);
  return parts.join(', ');
}

function basisNote(r) {
  const { items = 0, enriched = 0 } = r.sample;
  return `Gönderi sayıları, saatler ve hız sayım verisidir, kesindir. Anlatılar, duruş payları ve öne çıkan hesaplar ise okunan ${fmtNum(enriched)} gönderilik örnekleme dayanır${items > enriched ? ` (toplam ${fmtNum(items)} gönderinin içinden)` : ''}; ` +
    'bu not sıralamayı ve zamanlamayı anlatır, neden-sonuç iddia etmez.';
}

function calmBrief(r) {
  const { client, pulse, stance, narratives, total24 } = r;
  const seed = client.id;
  const top = narratives[0];
  const positive = (stance.destek || 0) >= 0.35 && (stance.destek || 0) > (stance.elestiri || 0) + (stance.alay || 0);
  const fading = pulse.trend === 'sönüyor';
  const what = [
    `Son 24 saatte ${client.name} hakkında ${fmtNum(total24)} gönderi sayıldı; ${pick(seed + 'w', ['bu, olağan düzeyin içinde', 'olağan aralığın dışına çıkan bir şey yok', 'her günkü akıştan farklı değil'])}.`,
    top ? `En çok konuşulan başlık “${top.label}” (okunan gönderilerde ${fmtPct(top.share)}).` : '',
  ].filter(Boolean).join(' ');
  return {
    headline: fading ? `${client.name}: dalgalanma sönüyor, kayda değer hareket yok` : positive ? `${client.name}: sakin, ton olumlu` : `${client.name}: kayda değer hareket yok`,
    whatHappened: what,
    howItGrew: fading
      ? `Önceki saatlerdeki hareketlenme geri çekildi; son bir saatte ${fmtNum(r.rate)} gönderi var, olağan düzey ${fmtNum(r.base)} dolayında.`
      : `Bir büyüme yok. Son bir saatte ${fmtNum(r.rate)} gönderi sayıldı; olağan saatlik düzey ${fmtNum(r.base)} dolayında.`,
    whoStarted: 'Öne çıkan bir başlangıç noktası yok; konuşma dağınık ve gündelik.',
    whoAmplified: r.amplifiers.length
      ? `Erişimi en yüksek paylaşım ${actorPhrase(r.amplifiers[0])} hesabından geldi; yine de bir yayılma zinciri oluşmadı.`
      : 'Konuyu geniş kitleye taşıyan bir hesap görülmedi.',
    whereNow: `Şu an ${TREND[pulse.trend] || 'akış olağan düzeyde'}. Okunan gönderilerde dağılım: ${stanceLine(stance) || 'belirgin bir yön yok'}.`,
    meaning: positive
      ? `Risk düşük (${r.risk.score}/100). Ton ağırlıklı olumlu; bu ilgiyi kendi kanallarınızda değerlendirmek için uygun bir zaman.`
      : `Risk düşük (${r.risk.score}/100). Şu an ${client.name} adına bir açıklama ya da müdahale gerektiren bir tablo yok.`,
    watchNext: [
      r.attack ? `“${r.attack.label}” başlığının payı büyüyor mu` : 'Olağan akışta ani bir sıçrama olup olmadığı',
      'Büyük bir hesabın ya da haber sitesinin konuya girip girmediği',
    ],
  };
}

function eventBrief(r) {
  const { client, now, pulse, risk, stance, narratives, steps, attack, counter } = r;
  const seed = `${client.id}:${r.incident?.id || risk.level}`;
  const top = attack || narratives[0];
  const second = narratives.find((n) => n !== top);
  const srcName = handleOf(r.source);
  const origin = steps.find((x) => x.kind === 'ilk') || steps[0] || null;
  const originT = origin?.t ?? top?.firstSeen ?? r.incident?.startedAt;

  // --- Ne oldu ---
  const what = [];
  if (srcName && originT) {
    what.push(pick(seed + 'a', [
      `${cap(fmtWhen(originT, now))} sularında ${srcName} hesabının paylaşımıyla başlayan konuşma, ${client.name} için günün ana gündemine dönüştü.`,
      `${client.name} hakkındaki konuşma, ${fmtWhen(originT, now)} sularında ${srcName} hesabından gelen bir paylaşımın ardından olağan düzeyin çok üstüne çıktı.`,
    ]));
  } else {
    what.push(`${client.name} hakkındaki konuşma olağan düzeyin belirgin biçimde üstüne çıktı.`);
  }
  if (r.originItem?.text) what.push(`Paylaşımda yazan: “${excerpt(r.originItem.text, 130)}”`);
  const times = Number.isFinite(r.ratio) && r.ratio >= 2 ? `; bu, olağanın yaklaşık ${fmtNum(r.ratio)} katı` : '';
  what.push(`Son bir saatte ${fmtNum(r.rate)} gönderi sayıldı, olağan saatlik düzey ${fmtNum(r.base)} dolayında${times}.`);
  if (top) {
    what.push(`Okunan gönderilerde en geniş yeri “${top.label}” tutuyor (${fmtPct(top.share)})` +
      (second ? `; onu “${second.label}” izliyor (${fmtPct(second.share)}).` : '.'));
  }

  // --- Nasıl büyüdü ---
  const grew = [];
  steps.filter((x) => x.kind !== 'ilk').slice(0, 6).forEach((x, i) => {
    const it = r.byId.get(x.itemId);
    const who = it?.author ? handleOf(it.author) : null;
    const fol = it?.author?.followers != null ? ` (${fmtBig(it.author.followers)} takipçi)` : '';
    const t = `${cap(fmtWhen(x.t, now))} ${AROUND[i % AROUND.length]}`;
    const tail = !who && x.note ? ` (${x.note})` : '';
    if (x.kind === 'sıçrama') grew.push(`${t} ${who ? `${who}${fol} paylaşımı alıntıladı` : 'paylaşım alıntılandı'} ve konu ilk kez çıktığı çevrenin dışına taştı${tail}.`);
    else if (x.kind === 'büyük-hesap') grew.push(`${t} ${who ? `${who}${fol} konuya girdi` : 'büyük bir hesap konuya girdi'}; erişim bir basamak daha yükseldi${tail}.`);
    else if (x.kind === 'medya') grew.push(`${t} konu haber sitelerine girdi${who ? ` (${who})` : ''}${tail}.`);
    else if (x.kind === 'platform-geçişi') grew.push(`${t} konuşma başka bir platforma da geçti${it?.source ? ` (${it.source === 'haber' ? 'haber siteleri' : it.source})` : ''}${tail}.`);
    else if (x.kind === 'karşı-anlatı') grew.push(`${t} karşı yönde bir anlatı belirdi${counter ? `: “${counter.label}”` : ''}${who ? ` (${who})` : ''}${tail}.`);
    else grew.push(`${t} ${x.note || 'yeni bir aşamaya geçildi'}.`);
  });
  if (!grew.length) {
    grew.push(top?.firstSeen
      ? `“${top.label}” başlığındaki ilk gönderi ${fmtWhen(top.firstSeen, now)} sularında görüldü; belirgin bir sıçrama noktası ayırt edilemiyor, artış kademeli.`
      : 'Belirgin bir sıçrama noktası ayırt edilemiyor; artış kademeli.');
  }
  if (r.peak && r.peak.n > 0) {
    const stillRising = pulse.trend === 'patlama' || pulse.trend === 'yükseliyor';
    grew.push(stillRising
      ? `Şimdiye kadarki en yoğun ${pulse.bucketMin || 10} dakika ${fmtWhen(r.peak.t, now)} dilimi oldu (${fmtNum(r.peak.n)} gönderi); zirvenin geçildiğini söylemek için erken.`
      : `En yoğun ${pulse.bucketMin || 10} dakika ${fmtWhen(r.peak.t, now)} dilimiydi (${fmtNum(r.peak.n)} gönderi); o zamandan beri hacim daha düşük.`);
  }
  if (steps.length > 1) grew.push('Bu sıralama gönderilerin saatine dayanır; bir adımın diğerine yol açtığını kanıtlamaz.');

  // --- Kim başlattı ---
  let started;
  if (r.source && srcName) {
    const f = r.source.followers;
    const size = f == null ? '' : f < 5000 ? ` Küçük bir hesap (${fmtBig(f)} takipçi); gönderi asıl etkileşimini başkaları alıntıladıktan sonra aldı.`
      : ` ${fmtBig(f)} takipçili${r.source.verified ? ', onaylı' : ''} bir hesap.`;
    started = `Verideki en erken paylaşım ${srcName} hesabına ait.${size} Daha önce paylaşılmış ama taramaya girmemiş bir gönderi olabilir; “ilk” derken elimizdeki veriyi kastediyoruz.`;
  } else {
    started = 'Tek bir başlangıç gönderisi ayırt edilemiyor; konu birkaç hesapta yakın saatlerde belirmiş görünüyor.';
  }

  // --- Kim büyüttü ---
  const amp = [];
  const tops = r.amplifiers.slice(0, 4);
  if (tops.length) amp.push(`En çok erişime ulaşan paylaşımlar şu hesaplardan geldi: ${joinTr(tops.map(actorPhrase))}.`);
  else amp.push('Erişimi tek başına sıçratan bir hesap öne çıkmıyor; yayılma çok sayıda küçük hesap üzerinden.');
  if (r.defenders.length) amp.push(`Karşı tarafta ${joinTr(r.defenders.slice(0, 2).map(actorPhrase))} ${client.name} lehine paylaşımlarla görünür durumda.`);
  const co = r.coordination[0];
  if (co && (co.score || 0) >= 0.5) {
    const what2 = co.kind === 'kopya-metin' ? 'neredeyse aynı metni paylaştı' : co.kind === 'yeni-hesap' ? 'yeni açılmış hesaplardan paylaşım yaptı' : 'aynı dakikalarda paylaşım yaptı';
    amp.push(`Ayrıca ${fmtNum(co.accounts?.length || 0)} hesap ${co.windowMin ? `${fmtDur(co.windowMin)} içinde ` : ''}${what2}. Bu, organize bir çabaya işaret edebilir; tek başına kanıt değildir.`);
  }

  // --- Şimdi nerede ---
  const where = [`Şu an ${TREND[pulse.trend] || 'eğilim belirsiz'}.`];
  const sl = stanceLine(stance);
  if (sl) where.push(`Son üç saatte okunan gönderilerde dağılım: ${sl}.`);
  if (counter) where.push(`“${counter.label}” karşı-anlatısı okunan gönderilerin ${fmtPct(counter.share)} kadarını tutuyor${counter.status === 'büyüyor' ? ' ve büyüyor' : ''}.`);
  const fc = r.forecast;
  if (fc) {
    where.push(`Tahmin: önümüzdeki bir saatte yaklaşık ${fmtNum(fc.next1h)}, üç saatte ${fmtNum(fc.next3h)} gönderi; yön ${fc.direction}` +
      `${fc.peakAt ? `, zirve ${fmtWhen(fc.peakAt, now)} dolayında bekleniyor` : ''} (tahmin güveni ${fc.confidence}).`);
  }
  if (r.incident?.status === 'soğuyor') where.push('Olay soğuma evresinde; kapanmış sayılmaz.');

  // --- Danışan için anlamı ---
  const mean = [`Risk düzeyi ${risk.level} (${risk.score}/100).`];
  const drv = (risk.drivers || []).slice().sort((a, b) => (b.weight || 0) - (a.weight || 0)).slice(0, 3).map((d) => d.note).filter(Boolean);
  if (drv.length) mean.push(`Puanı en çok yükseltenler: ${drv.join('; ')}.`);
  if (r.sensitivities.length) mean.push(`Konu, ${client.name} için hassas sayılan ${joinTr(r.sensitivities.map((x) => `“${x}”`))} alanına dokunuyor.`);
  if (r.nature === 'iddia') mean.push('Baskın başlık doğrulanabilir bir iddia. Doğru olup olmadığı bu verilerden anlaşılamaz; ancak yanıtsız kaldığı sürece dolaşımdaki tek anlatı o oluyor.');
  else if (r.nature === 'alay') mean.push('Baskın ton alay. Alay dalgaları genellikle kısa sürer ama markanın adını bir espriyle eşleştirip kalıcı hâle getirebilir.');
  else if (r.nature === 'şikâyet') mean.push('Baskın başlık bir hizmet şikâyeti; gerçeğini en iyi danışanın kendisi bilir ve insanlar çoğunlukla açıklamadan çok çözüm bekler.');
  if (r.cta) mean.push('Boykot ve şikâyet çağrıları konuyu itibar tartışmasından ticari riske taşıyabilir.');
  if (r.media) mean.push('Konunun haber sitelerine girmesi, sosyal medyayı izlemeyen kitleye de ulaştığı anlamına gelir.');

  // --- Sırada neye bakılmalı ---
  const watch = [];
  if (fc?.peakAt && fc.peakAt > now) watch.push(`Zirve beklenen ${fmtWhen(fc.peakAt, now)} dolayında hacim gerçekten dönüyor mu`);
  if (r.boycott) watch.push(`“${r.boycott.label}” başlığının hızı (şu an bir önceki saatin ${String(Math.round((r.boycott.velocity || 0) * 10) / 10).replace('.', ',')} katı)`);
  if (counter) watch.push(`“${counter.label}” karşı-anlatısı pay kazanıyor mu, kim taşıyor`);
  else if (r.nature === 'iddia') watch.push('İddiayı doğrulayan ya da çürüten yeni bir belge, görüntü ya da tanık çıkıyor mu');
  watch.push(r.media ? 'Ulusal yayınlar ve televizyon konuyu alıyor mu' : 'İlk haber sitesi ya da büyük hesap konuya giriyor mu');
  if (r.cta || r.issue === 'ürün') watch.push('Resmî bir kurumdan (bakanlık, tüketici kuruluşu) açıklama geliyor mu');
  if (co && (co.score || 0) >= 0.5) watch.push('Aynı metni paylaşan hesap kümesi büyüyor mu');
  if (!watch.length) watch.push('Hacmin bir sonraki saatte hangi yöne döndüğü');

  const headline = r.incident?.headline ||
    (top ? `“${top.label}” ${pulse.trend === 'sönüyor' ? 'geriliyor' : pulse.trend === 'patlama' ? 'hızla yayılıyor' : 'gündemde'} — risk ${risk.level}` : `${client.name}: hareketlilik var — risk ${risk.level}`);

  return { headline, whatHappened: what.join(' '), howItGrew: grew.join(' '), whoStarted: started, whoAmplified: amp.join(' '),
    whereNow: where.join(' '), meaning: mean.join(' '), watchNext: watch.slice(0, 5) };
}

export function briefLocal({ client, snapshot, items }) {
  const r = readSnapshot({ client, snapshot, items });
  const body = r.calm ? calmBrief(r) : eventBrief(r);
  return { at: snapshot.at, by: 'yerel', ...body, confidence: confidenceOf(r), basisNote: basisNote(r) };
}
