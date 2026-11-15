// Yerel "Pusula'ya sor": soruyu sınıfla, snapshot'tan yanıtla; karşılayamıyorsa sınırını söyle.
import { norm } from './lexicon.js';
import { readSnapshot, handleOf, confidenceOf } from './read.js';
import { briefLocal } from './local-brief.js';
import { playbookLocal } from './local-playbook.js';
import { fmtNum, fmtBig, fmtPct, fmtWhen, fmtDur, joinTr, excerpt } from './format.js';

// Sıra önemlidir: özgül olan önce.
const INTENTS = [
  ['bot', /(bot|koordin|organize|trol|sahte hesap|kopya|aynı metin|operasyon|örgütlü)/],
  ['basla', /(kim başlat|ilk kim|kimden çık|nereden çık|nasıl başla|kaynağı|ilk paylaş|ilk gönderi|başlatan)/],
  ['nezaman', /(ne zaman bit|ne zaman sön|ne kadar sür|söner mi|biter mi|geçer mi|zirve|tahmin|önümüzdeki|devam eder mi|büyür mü|daha da)/],
  ['yap', /(ne yapma|ne yapalım|ne yapmam|ne önerir|önerin|açıklama yapmalı|yanıt vermeli|cevap vermeli|susmalı|sessiz kalmalı|nasıl yanıt|taslak|plan)/],
  ['hesap', /(en büyük hesap|büyük hesaplar|etkili hesap|kim büyüt|kimler paylaş|hangi hesap|kim yay|en çok etkileşim|fenomen|kimler konuş)/],
  ['medya', /(medya|haber|basın|gazete|televizyon)/],
  ['anlati', /(hangi anlatı|hangi konu|ne konuşul|neler konuşul|hangi başlık|büyüyen|anlatılar|konular)/],
  ['risk', /(risk|ne kadar ciddi|ciddi mi|tehlike|endişelenmeli|panik|kötü mü|alarm)/],
  ['ton', /(ton|duygu|olumlu|olumsuz|destek|eleştiri|alay|ne düşünüyor|tepki)/],
  ['hacim', /(kaç gönderi|kaç tweet|kaç paylaşım|hacim|ne kadar konuşul|sayı)/],
  ['platform', /(platform|bluesky|x'te|twitter|nerede konuşul|kaynak dağıl)/],
  ['ozet', /(özet|ne oldu|ne oluyor|durum ne|son durum|anlat|neler oluyor|bilgi ver)/],
];

export function classifyQuestion(q) {
  const t = norm(q);
  for (const [k, rx] of INTENTS) if (rx.test(t)) return k;
  return null;
}

const basis = (r) => ` (Hesaplar ve anlatılar okunan ${fmtNum(r.sample.enriched || 0)} gönderilik örnekleme dayanır; güven ${confidenceOf(r)}.)`;

export function askLocal({ client, snapshot, items, question }) {
  if (!snapshot) return `${client?.name || 'Bu danışan'} için henüz veri toplanmadı; biraz sonra yeniden sorun.`;
  const r = readSnapshot({ client, snapshot, items });
  const now = r.now;
  const kind = classifyQuestion(question);
  const brief = snapshot.brief || briefLocal({ client, snapshot, items });

  switch (kind) {
    case 'basla':
      return r.calm ? `Şu an ${client.name} için öne çıkan bir olay yok; dolayısıyla bir “başlatan” da yok.` : brief.whoStarted + (r.originItem?.text ? ` Paylaşım: “${excerpt(r.originItem.text, 140)}”` : '');
    case 'hesap': {
      const list = r.actors.slice().sort((a, b) => (b.reach || 0) - (a.reach || 0)).slice(0, 5);
      if (!list.length) return 'Öne çıkan bir hesap görünmüyor; konuşma küçük hesaplar arasında dağınık.';
      return `En çok erişime ulaşan hesaplar: ${joinTr(list.map((a) => `${handleOf(a)} (${fmtBig(a.followers)} takipçi, ${a.role}${a.items ? `, ${fmtNum(a.items)} gönderi` : ''})`))}. ` +
        'Bu sıralama erişime göredir; kimin konuyu “sürüklediğini” göstermez.' + basis(r);
    }
    case 'yap': {
      const pb = snapshot.playbook || playbookLocal({ client, snapshot, items });
      const o = pb.options[0];
      return `Önerilen duruş: ${pb.posture}. ${pb.rationale}\n\nİlk seçenek: ${o.name} — ${o.when}\nTaslak: ${o.draft}\n\nYapmayın: ${pb.doNot.slice(0, 2).join(' ')}`;
    }
    case 'anlati': {
      if (!r.narratives.length) return 'Ayırt edilebilen bir anlatı yok; gönderiler tek bir başlık altında toplanmıyor.';
      const g = r.growing[0];
      const list = r.narratives.slice(0, 4).map((n) => `“${n.label}” (${fmtPct(n.share)}, ${n.status})`);
      return `Öne çıkan başlıklar: ${joinTr(list)}. ` +
        (g ? `En hızlı büyüyen “${g.label}”: son bir saatte bir önceki saatin ${String(Math.round((g.velocity || 0) * 10) / 10).replace('.', ',')} katı gönderi.` : 'Şu an belirgin biçimde büyüyen bir başlık yok.') + basis(r);
    }
    case 'bot': {
      const co = r.coordination.filter((c) => (c.score || 0) >= 0.3);
      if (!co.length) return 'Koordinasyona işaret eden bir örüntü görülmedi: kısa sürede aynı metni paylaşan ya da topluca yeni açılmış hesap kümesi yok. Bu, “kesinlikle yok” demek değil; yalnızca okunan gönderilerde böyle bir iz çıkmadı.';
      const c = co[0];
      return `${co.length} şüpheli küme var. En belirgini: ${fmtNum(c.accounts?.length || 0)} hesap${c.windowMin ? `, ${fmtDur(c.windowMin)} içinde` : ''} (${c.kind}; benzerlik puanı ${fmtPct(c.score)}).${c.note ? ` ${c.note}` : ''} ` +
        'Bu bir işaret, kanıt değil: gerçek kişiler de aynı metni kopyalayıp paylaşabilir. Bu hesapların bot olduğunu ya da arkasında kimin olduğunu bu veriden söyleyemem; kamuya açık bir suçlamaya dayanak olmaz.';
    }
    case 'nezaman': {
      const f = r.forecast;
      if (!f) return 'Tahmin üretmek için yeterli veri yok.';
      return `Kesin bir bitiş saati veremem; eldeki eğilime göre önümüzdeki bir saatte yaklaşık ${fmtNum(f.next1h)}, üç saatte ${fmtNum(f.next3h)} gönderi bekleniyor, yön ${f.direction}.` +
        `${f.peakAt ? ` Zirve ${fmtWhen(f.peakAt, now)} dolayında bekleniyor.` : ''} Tahmin güveni ${f.confidence}.${f.basis ? ` Dayanak: ${f.basis}` : ''} ` +
        'Yeni bir haber, resmî açıklama ya da büyük bir hesabın girişi bu tahmini geçersiz kılar.';
    }
    case 'medya':
      if (!r.media) return `Konu henüz haber sitelerine girmiş görünmüyor (son 24 saatte ${fmtNum(snapshot.sources?.haber || 0)} haber kaydı).`;
      return `Evet, konu habere girdi${r.mediaStep ? ` (ilk kez ${fmtWhen(r.mediaStep.t, now)} sularında)` : ''}. ` +
        (r.mediaActors.length ? `Öne çıkan yayınlar: ${joinTr(r.mediaActors.slice(0, 4).map((a) => a.name || handleOf(a)))}. ` : '') + `Son 24 saatte ${fmtNum(snapshot.sources?.haber || 0)} haber kaydı var.`;
    case 'risk': {
      const d = (r.risk.drivers || []).slice().sort((a, b) => (b.weight || 0) - (a.weight || 0)).slice(0, 3).map((x) => x.note).filter(Boolean);
      return `Risk düzeyi ${r.risk.level} (${r.risk.score}/100).${d.length ? ` Puanı en çok yükseltenler: ${d.join('; ')}.` : ''} ${brief.meaning.split('. ').slice(-1)[0]}`;
    }
    case 'ton': {
      const s = r.stance;
      return `Son üç saatte okunan gönderilerde: eleştiri ${fmtPct(s.elestiri)}, alay ${fmtPct(s.alay)}, soru ${fmtPct(s.soru)}, destek ${fmtPct(s.destek)}, nötr ${fmtPct(s.notr)}.` + basis(r);
    }
    case 'hacim':
      return `Son 24 saatte ${fmtNum(r.total24)} gönderi sayıldı; son bir saatte ${fmtNum(r.rate)}, olağan saatlik düzey ${fmtNum(r.base)} dolayında. Bunlar sayım verisidir, kesindir.`;
    case 'platform': {
      const s = snapshot.sources || {};
      return `Son 24 saatte kaynak dağılımı: X ${fmtNum(s.x || 0)}, haber ${fmtNum(s.haber || 0)}, Bluesky ${fmtNum(s.bluesky || 0)}.`;
    }
    case 'ozet':
      return r.calm ? `${brief.headline}. ${brief.whatHappened} ${brief.meaning}`
        : `${brief.headline}. ${brief.whatHappened} ${brief.whereNow} ${brief.meaning}`;
    default:
      return 'Bu soruyu yerel modda yanıtlayamıyorum; serbest sorular için Claude anahtarı gerekli (Ayarlar bölümünden eklenebilir). ' +
        'Anahtarsız yanıtlayabildiklerim: ne oldu, kim başlattı, en büyük hesaplar, hangi anlatı büyüyor, koordinasyon şüphesi var mı, medyaya girdi mi, risk ne kadar ciddi, ne zaman söner, ne yapmalıyım.';
  }
}
