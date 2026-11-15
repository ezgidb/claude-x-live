// Yerel yanıt planı: kurallı ama gerekçeli duruş seçimi + danışanın yayımlayabileceği taslaklar.
// İlke: iddianın doğruluğu bu veriden bilinemez; taslaklar bunu varsaymaz. Koordinasyon şüphesi kamuya açık suçlama olmaz.
import { readSnapshot } from './read.js';
import { fmtPct, fmtDur } from './format.js';

function voice(client) {
  const single = client.kind === 'kişi';
  return { single, sign: `— ${client.name}`, p: (pl, sg) => (single ? sg : pl) };
}

// --- Taslak metinler (danışanın ağzından) ---
function draftInvestigate(r, v) {
  if (v.single) return `Hakkımda dolaşan paylaşımları gördüm ve ciddiye alıyorum. Konuyu geçiştirmek istemiyorum; ne olduğunu netleştirip en kısa sürede buradan açıkça paylaşacağım. Sorusu olan herkes bana [iletişim kanalı] üzerinden ulaşabilir. ${v.sign}`;
  if (r.issue === 'ürün') return `Ürünümüzle ilgili paylaşılan görüntüleri gördük ve konuyu ciddiyetle ele alıyoruz. Paylaşımı yapan tüketicimize ulaşıp ürünün parti bilgilerini istiyoruz; aynı anda üretim ve kalite kayıtlarımızı incelemeye başladık. Sonucu, ne çıkarsa çıksın, bu hesaptan açıkça paylaşacağız. Benzer bir durum yaşayan herkes bize [iletişim kanalı] üzerinden doğrudan ulaşabilir. ${v.sign}`;
  if (r.issue === 'hizmet') return `Yaşanan aksaklığın farkındayız ve etkilenen herkesten özür dileriz. Nedenini inceliyoruz; ne olduğunu ve attığımız adımları [saat] itibarıyla buradan paylaşacağız. Mağduriyet yaşayanlar [iletişim kanalı] üzerinden bize yazabilir, her başvuruyu tek tek yanıtlayacağız. ${v.sign}`;
  if (r.issue === 'fiyat') return `Fiyatlarımızla ilgili yorumları okuyoruz ve duyuyoruz. Fiyatlarımızın nasıl oluştuğunu ve bundan sonra ne yapacağımızı [tarih] tarihinde açık biçimde paylaşacağız. ${v.sign}`;
  return `Hakkımızda gündeme gelen konuyu takip ediyoruz ve ciddiye alıyoruz. Gerekli incelemeyi başlattık; netleşen her bilgiyi bu hesaptan paylaşacağız. Sorusu olan herkes bize [iletişim kanalı] üzerinden ulaşabilir. ${v.sign}`;
}

function draftCorrect(r, v) {
  if (v.single) return `Hakkımdaki iddiayı inceledim. İddia doğru değil; dayandığım kayıtları burada paylaşıyorum: [bağlantı]. Konuyu merak eden herkesin sorusunu yanıtlamaya hazırım. ${v.sign}`;
  if (r.issue === 'ürün') return `İncelememizi tamamladık. Paylaşılan görüntü [tarih] tarihine ait; o tarihte [yapılan işlem] yapılmış ve konu kapatılmıştı. İlgili kayıtları burada paylaşıyoruz: [bağlantı]. Bugün satıştaki ürünlerimizde böyle bir durum yok. Endişe duyan herkesin sorusunu yanıtlamaya hazırız: [iletişim kanalı]. ${v.sign}`;
  return `İncelememizi tamamladık. Gündeme gelen iddia kayıtlarımızla örtüşmüyor; dayandığımız belgeleri burada paylaşıyoruz: [bağlantı]. Sorusu olan herkesi yanıtlamaya hazırız: [iletişim kanalı]. ${v.sign}`;
}

function draftOwn(r, v) {
  if (v.single) return `Bu konuda hata yaptım ve özür diliyorum. [Ne olduğu, bir cümleyle.] Bundan sonra [atılacak somut adım]. Kırdığım herkesten özür dilerim. ${v.sign}`;
  if (r.issue === 'ürün') return `İncelememiz sonucunda [parti numarası] partili ürünlerimizde bir sorun tespit ettik. Bu partiyi satıştan çekiyoruz; elinde bu üründen bulunan herkese ücretini iade edeceğiz: [iade adımları]. Bunu yaşattığımız için özür dileriz. Sorunun kaynağını ve aldığımız önlemleri [tarih] tarihinde yine buradan paylaşacağız. ${v.sign}`;
  if (r.issue === 'hizmet') return `[Tarih] günü yaşanan aksaklık bizim sorumluluğumuzdaydı; etkilenen herkesten özür dileriz. Nedeni: [kısa ve açık neden]. Etkilenen müşterilerimize [telafi: iade / değişim / tazminat] sağlıyoruz; başvuru için [iletişim kanalı]. Tekrarlanmaması için [alınan önlem]. ${v.sign}`;
  return `Bu konuda eksiğimiz olduğunu gördük ve özür dileriz. [Ne olduğu, bir cümleyle.] Etkilenenler için [telafi adımı] sağlıyoruz; tekrarlanmaması için [alınan önlem]. ${v.sign}`;
}

function draftReply(r, v) {
  return v.p(
    'Merhaba, yazdığınız için teşekkür ederiz. Konuyu inceleyebilmemiz için ayrıntıları [iletişim kanalı] üzerinden bize iletir misiniz? En kısa sürede dönüş yapacağız.',
    'Merhaba, yazdığınız için teşekkür ederim. Sorunuzu görüyorum; ayrıntıları [iletişim kanalı] üzerinden iletirseniz yanıtlayacağım.');
}

function holding(r, v) {
  return v.p(
    `Konudan haberdarız ve ciddiye alıyoruz. İncelememiz sürüyor; doğrulanmış bilgi elimize ulaştığında ilk olarak buradan paylaşacağız. ${v.sign}`,
    `Konudan haberdarım ve ciddiye alıyorum. Netleştirdiğim anda ilk olarak buradan paylaşacağım. ${v.sign}`);
}

// --- Duruş seçimi ---
function choosePosture(r) {
  const lvl = r.risk.level;
  const rising = r.pulse.trend === 'patlama' || r.pulse.trend === 'yükseliyor' || r.forecast?.direction === 'artış';
  const why = [];
  let posture;
  if (r.calm || lvl === 'yeşil') {
    posture = 'izle';
    why.push(`Risk düşük (${r.risk.score}/100) ve akış olağan düzeyde; açıklama yapmak, olmayan bir konuya dikkat çeker.`);
  } else if (lvl === 'sarı') {
    posture = rising || r.sensitivities.length ? 'hazırlan' : 'izle';
    why.push(posture === 'hazırlan'
      ? `Risk sarı (${r.risk.score}/100)${rising ? ' ve hacim artıyor' : ''}${r.sensitivities.length ? '; konu hassas bir alana dokunuyor' : ''}. Kamuya açık yanıt için erken, ama metinler şimdiden hazır olmalı.`
      : `Risk sarı (${r.risk.score}/100) ancak hacim artmıyor; bu ölçekteki dalgalanmalar çoğu zaman kendiliğinden söner. Açıklama, konuyu görmemiş kitleye de taşır.`);
  } else {
    // turuncu / kırmızı
    const counterStrong = r.counter && r.attack && (r.counter.share || 0) >= (r.attack.share || 0) * 0.5 && !rising;
    if (r.nature === 'şikâyet' && r.issue === 'hizmet') {
      posture = 'üstlen';
      why.push(`Risk ${lvl} (${r.risk.score}/100) ve baskın başlık bir hizmet şikâyeti. Ne yaşandığını en iyi siz bilirsiniz; insanlar burada savunma değil özür ve çözüm bekler.`);
    } else if (r.nature === 'iddia' && counterStrong) {
      posture = 'düzelt';
      why.push(`Risk ${lvl} (${r.risk.score}/100). İddiaya karşı bir anlatı (“${r.counter.label}”, okunan gönderilerde ${fmtPct(r.counter.share)}) zaten dolaşımda ve hacim artmıyor. Bu anlatı kendi kayıtlarınızla doğrulanıyorsa belgeli bir düzeltme için uygun an; doğrulanmadan sahiplenmeyin.`);
    } else if (r.nature === 'alay' && !r.media && lvl === 'turuncu') {
      posture = 'hazırlan';
      why.push(`Risk turuncu (${r.risk.score}/100) ama baskın ton alay ve konu haber sitelerine girmedi. Alaya verilen kurumsal yanıt çoğu zaman yeni malzeme olur; metinleri hazırlayıp eşiği bekleyin.`);
    } else if (lvl === 'turuncu' && !r.media && r.nature !== 'iddia' && !rising) {
      posture = 'hazırlan';
      why.push(`Risk turuncu (${r.risk.score}/100) ancak hacim artmıyor ve konu haber sitelerine girmedi. Yanıt metni hazır dursun; eşik aşılırsa hemen yayımlanır.`);
    } else {
      posture = 'yanıtla';
      why.push(`Risk ${lvl} (${r.risk.score}/100)${rising ? ' ve hacim hâlâ artıyor' : ''}.`);
      if (r.nature === 'iddia') why.push('Baskın başlık doğrulanabilir bir iddia; sessiz kalındığında dolaşımdaki tek anlatı o oluyor.');
      else if (r.nature === 'boykot') why.push('Baskın başlık bir boykot çağrısı; yanıtsız kalması çağrıyı tartışmasız bırakır.');
      if (r.media) why.push('Konu haber sitelerine girdi; gazeteciler yanıt arayacak, bulamazsa “açıklama yapılmadı” diye yazacak.');
      why.push('İddianın doğru olup olmadığı bu verilerden bilinemez. Bu yüzden ilk adım savunma ya da yalanlama değil, “inceliyoruz, sonucu paylaşacağız” tonunda kısa bir açıklama olmalı.');
    }
    if (r.cta && posture !== 'yanıtla') why.push('Boykot ve şikâyet çağrıları sürüyor; bu, bekleme süresini kısaltır.');
    const co = r.coordination[0];
    if (co && (co.score || 0) >= 0.5) why.push('Benzer metinleri kısa sürede paylaşan bir hesap kümesi görülüyor. Bu bir şüphe, kanıt değil; plana yön vermemeli ve kamuya açık biçimde dile getirilmemeli.');
    if (r.counter && posture === 'yanıtla') why.push(`Karşı yönde “${r.counter.label}” anlatısı var; kendi kayıtlarınızla doğrulamadan buna yaslanmayın.`);
  }
  return { posture, rationale: why.join(' '), rising };
}

function buildOptions(r, v, posture, rising) {
  const A = { name: 'İnceleme açıklaması', when: 'Hemen; doğrulanmış bilgi beklenmeden yayımlanabilir.',
    upside: 'Sessizlik algısını kırar, gazetecilere atıf yapılacak bir metin verir, hiçbir sonucu peşinen kabul ya da reddetmez.',
    risk: 'Konuyu henüz görmemiş kişilere de duyurur; söz verilen sonuç açıklaması gecikirse ikinci bir eleştiri dalgası doğar.', draft: draftInvestigate(r, v) };
  const B = { name: 'Belgeli düzeltme', when: 'Yalnızca iddianın yanlış ya da eski olduğu kendi kayıtlarınızla doğrulandıktan sonra.',
    upside: 'Belgeyle gelen düzeltme, karşı-anlatıyı savunanların eline somut bir kaynak verir.',
    risk: 'Doğrulanmadan yayımlanır ve yanlış çıkarsa güven kaybı ilk iddiadan büyük olur.', draft: draftCorrect(r, v) };
  const C = { name: 'Üstlen ve telafi et', when: 'İnceleme sorunu doğrularsa, vakit kaybetmeden.',
    upside: 'Sorumluluk almak tartışmayı “ne oldu”dan “ne yapılıyor”a çevirir; telafi somut olduğunda eleştirinin dayanağı zayıflar.',
    risk: 'Hukuki ve mali sonuçları olabilir; yayımlamadan önce hukuk ve kalite birimlerinin onayı gerekir.', draft: draftOwn(r, v) };
  const W = { name: 'Hazırlıklı bekle', when: `Şimdi; hacim artmadığı ve haber siteleri konuya girmediği sürece. Eşik: risk bir üst düzeye çıkarsa ya da ${r.media ? 'ulusal bir yayın' : 'ilk haber sitesi'} konuyu alırsa açıklamaya geçin.`,
    upside: 'Konuyu büyütmeden zaman kazandırır; eşik aşılırsa metin dakikalar içinde yayımlanır.',
    risk: 'Dalga beklenenden hızlı büyürse ilk saat kaçırılmış olur.', draft: holding(r, v) };
  const R = { name: 'Birebir yanıt', when: 'Doğrudan size yazan ya da sizi etiketleyen gerçek kullanıcılara; toplu açıklama yapmadan.',
    upside: 'Sorun yaşayan kişiyi muhatap alır, konuyu geniş kitleye taşımaz.',
    risk: 'Yanıtların ekran görüntüsü paylaşılabilir; her yanıt kamuya açık bir açıklama gibi yazılmalı.', draft: draftReply(r, v) };

  if (posture === 'izle') {
    const supportive = (r.stance.destek || 0) >= 0.35;
    return [
      { name: 'Olağan akışı sürdür', when: 'Şimdi; izleme dışında özel bir adım gerekmiyor.', upside: 'Olmayan bir konuya dikkat çekmez.', risk: 'Yok denecek kadar az; izleme sürdüğü sürece ani bir değişim fark edilir.', draft: draftReply(r, v) },
      supportive
        ? { name: 'Olumlu ilgiyi değerlendir', when: 'Bugün içinde; ton olumluyken.', upside: 'Destekleyen kitleyle bağ kurar, olumlu içeriği görünür kılar.', risk: 'Aşırı tanıtım tonu ters tepebilir; kısa ve içten tutun.',
          draft: v.p(`Güzel sözleriniz ve ilginiz için teşekkür ederiz. Yorumlarınızı tek tek okuyoruz. ${v.sign}`, `Güzel sözleriniz için çok teşekkür ederim; hepsini tek tek okuyorum. ${v.sign}`) }
        : R,
    ];
  }
  if (posture === 'hazırlan') return rising ? [W, R, A] : [W, R];
  if (posture === 'üstlen') return [C, R, { ...A, name: 'Kısa bilgilendirme', when: 'Neden henüz net değilse; özür ve telafi metninden önce köprü olarak.' }];
  if (posture === 'düzelt') return [B, A, C];
  return [A, r.counter || r.nature === 'iddia' ? B : R, C];
}

function buildDoNot(r, posture) {
  const out = [];
  const co = r.coordination[0];
  if (co && (co.score || 0) >= 0.5) out.push('“Bot”, “trol” ya da “organize saldırı” demeyin. Koordinasyon bulgusu bir şüphe, kanıt değil; kamuya açık bir suçlama gerçek şikâyet sahiplerini de hedef almış olur ve konuyu büyütür.');
  if (posture === 'izle') {
    out.push('Gündemde olmayan bir konu için açıklama yapmayın.', 'Tek tük eleştirilere savunmacı ya da uzun yanıtlar yazmayın.');
    return out;
  }
  if (r.nature === 'iddia' || r.counter) out.push('Doğrulamadan iddiaya “yalan”, “asılsız” ya da “eski” demeyin; yanlış çıkarsa ikinci bir kriz doğar.');
  out.push('Eleştiri içeren gönderileri silmeyin, hesapları engellemeyin, şikâyet yoluyla kaldırtmaya çalışmayın.');
  out.push('Bu aşamada hukuki işlem tehdidini kamuya açık dile getirmeyin.');
  if (r.nature === 'alay' || (r.stance.alay || 0) >= 0.2) out.push('Alay eden hesaplarla tartışmaya ya da espriyle karşılık vermeye girmeyin.');
  if (r.boycott) out.push('Boykot etiketini kendi paylaşımlarınızda kullanmayın ya da alıntılamayın; etikete erişim kazandırır.');
  out.push('Planlanmış reklam ve tanıtım paylaşımlarını bu süre boyunca yayımlamayın.');
  out.push('Farklı kişilerin farklı açıklamalar yapmasına izin vermeyin; tek sözcü, tek metin.');
  return out;
}

function buildQna(r, v, posture) {
  if (posture === 'izle') return [{ q: 'Gündemde hakkınızda bir konu var mı?', a: v.p('Olağan dışı bir durum yok; bize ulaşan her soruyu yanıtlıyoruz.', 'Olağan dışı bir durum yok; bana ulaşan soruları yanıtlıyorum.') }];
  const q = [];
  if (r.issue === 'ürün') {
    q.push({ q: 'Görüntüdeki ürün size mi ait, iddia doğru mu?', a: 'Görüntüyü inceliyoruz. Ürünün parti bilgilerine ulaşmadan kesin bir şey söylemek doğru olmaz; sonucu ne çıkarsa çıksın paylaşacağız.' });
    q.push({ q: 'Ürünleri raflardan çekecek misiniz?', a: 'Bu kararı incelemenin sonucu belirleyecek. Bir risk tespit edersek ilgili partiyi derhal çeker ve bunu kamuoyuna duyururuz.' });
  } else if (r.issue === 'hizmet') {
    q.push({ q: 'Aksaklığın nedeni ne?', a: 'Nedenini netleştiriyoruz; kesinleşmeden tahmin yürütmek istemiyoruz. Netleştiğinde paylaşacağız.' });
    q.push({ q: 'Etkilenenlere ne sunacaksınız?', a: 'Etkilenen herkesin başvurusunu tek tek ele alıyoruz; haklarının eksiksiz karşılanması için gerekeni yapacağız.' });
  } else {
    q.push({ q: 'İddialar doğru mu?', a: v.p('Konuyu inceliyoruz. İnceleme tamamlanmadan doğrulamak da yalanlamak da doğru olmaz; sonucu paylaşacağız.', 'Konuyu netleştiriyorum; tamamlanmadan doğrulamak da yalanlamak da doğru olmaz. Sonucu paylaşacağım.') });
  }
  q.push({ q: 'İncelemenin sonucunu ne zaman açıklayacaksınız?', a: v.p('[Tarih/saat] itibarıyla. Erken ama eksik bir açıklama yerine doğru bilgiyi paylaşmak istiyoruz.', '[Tarih/saat] itibarıyla; eksik bilgiyle konuşmak istemiyorum.') });
  if (r.boycott) q.push({ q: 'Boykot çağrıları hakkında ne diyorsunuz?', a: 'Tüketicilerimizin kaygısını anlıyoruz. Güveni sözle değil, incelemenin sonucunu açıkça paylaşarak kazanmamız gerektiğinin farkındayız.' });
  if (r.counter) q.push({ q: `“${r.counter.label}” deniyor; doğru mu?`, a: 'Bu bilgiyi biz de gördük ve kendi kayıtlarımızla karşılaştırıyoruz. Doğrulamadan sahiplenmek istemeyiz.' });
  if (r.coordination.some((c) => (c.score || 0) >= 0.5)) q.push({ q: 'Paylaşımların organize olduğunu düşünüyor musunuz?', a: v.p('Bu konuda bir değerlendirme yapmıyoruz. Önceliğimiz, soru soran herkese doğru bilgiyi vermek.', 'Bu konuda bir değerlendirme yapmıyorum; önceliğim soruları yanıtlamak.') });
  return q.slice(0, 5);
}

function nextCheck(r, posture, rising) {
  const lvl = r.risk.level;
  const soon = r.forecast?.peakAt && r.forecast.peakAt > r.now && r.forecast.peakAt - r.now < 90 * 60000;
  if (lvl === 'kırmızı') return rising || soon ? 15 : 30;
  if (lvl === 'turuncu') return rising || soon ? 30 : 60;
  if (lvl === 'sarı') return rising ? 60 : 120;
  return posture === 'izle' ? 360 : 180;
}

export function playbookLocal({ client, snapshot, items }) {
  const r = readSnapshot({ client, snapshot, items });
  const v = voice(client);
  const { posture, rationale, rising } = choosePosture(r);
  const nextCheckMin = nextCheck(r, posture, rising);
  return {
    at: snapshot.at, by: 'yerel', posture,
    rationale: `${rationale} Bir sonraki kontrol: ${fmtDur(nextCheckMin)} sonra.`,
    options: buildOptions(r, v, posture, rising),
    doNot: buildDoNot(r, posture),
    holdingStatement: posture === 'izle'
      ? holding(r, v)
      : holding(r, v),
    qna: buildQna(r, v, posture),
    nextCheckMin,
  };
}
