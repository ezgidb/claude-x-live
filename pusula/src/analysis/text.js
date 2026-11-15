// Türkçe'ye uygun metin işleme: küçük harf, belirteçleme, kök, slug, benzerlik.
export function trLower(s) {
  return String(s ?? '').replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase().replace(/i̇/g, 'i');
}
export function fold(s) {
  return trLower(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
}
export function slugify(s) {
  return fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64).replace(/-+$/, '') || 'anlati';
}

export const STOP = new Set(`ve veya ile ama fakat ancak çünkü de da ki mi mı mu mü bu şu bir iki için gibi kadar daha en çok az her hiç ne neden niye nasıl ben sen biz siz onlar bana sana bize size beni seni bizi sizi onu ona bunu buna şunu benim senin bizim sizin onun var yok değil olan olarak oldu olur olmuş olsun ise diye ya yani hem bile sadece artık şimdi sonra önce bugün dün yarın evet hayır tamam lütfen rt via the and of to in is http https www com amp şey şeyi bence aynen işte hani zaten yine gene tüm bütün bazı böyle şöyle öyle kendi kim kimse herkes hep hala hâlâ oluyor olacak etti ediyor eden etmek olmak yapıyor yapan yaptı dedi diyor göre karşı üzere tarafından biri birisi bunlar şunlar orada burada nerede bişey falan filan abi yaa bunun şunun onların mısınız misiniz musunuz iyi tek ilk son yeni eski bana kez defa hiçbir birkaç ayrıca üstelik resmen gerçekten kesinlikle acaba belki galiba sanki tam hemen bunları olsa olmaz olmasın oldu olduğu olduğunu değilse nedir budur`.split(/\s+/));

// Sözcükler: bağlantı ve @anma atılır, etiketler (#AnadoluSütBoykot) parçalanır, kesme sonrası ek düşer.
export function words(text) {
  const s = String(text ?? '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/@[\w.]+/g, ' ')
    .replace(/#(\p{L}[\p{L}\p{N}_]*)/gu, (m, w) => ' ' + w.replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2').replace(/_/g, ' ') + ' ')
    .replace(/(\p{L})['’]\p{L}+/gu, '$1 ');
  return trLower(s).match(/[\p{L}\p{N}]+/gu) || [];
}
// Türkçe sondan eklemeli olduğu için basit ama işe yarar kök: ilk 5 harf.
export const stemOf = (w) => (w.length > 5 ? w.slice(0, 5) : w);

export function stemsOf(ws, extraStop) {
  const out = new Set();
  for (const w of ws) {
    if (w.length < 3 || STOP.has(w)) continue;
    const st = stemOf(w);
    if (extraStop && extraStop.has(st)) continue;
    out.add(st);
  }
  return out;
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  const [s, l] = a.size <= b.size ? [a, b] : [b, a];
  let inter = 0;
  for (const x of s) if (l.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

// Zenginleştirme (enr) hiç yoksa kaba bir duruş tahmini; yalnızca yedek.
const NEG = ['rezal', 'skand', 'boyko', 'şikay', 'şikây', 'iğren', 'yazık', 'utanç', 'utanm', 'berba', 'kötü', 'zehir', 'tehli', 'mağdu', 'rötar', 'iptal', 'sahte', 'yalan', 'dolan', 'pahal', 'fahiş', 'bozuk', 'bıktı', 'yeter', 'kepaz', 'saygı', 'almay', 'almıy', 'mide', 'hesap', 'soruş', 'denet', 'ihmal', 'sorum', 'hasta', 'zarar', 'korku', 'vicda', 'ayıp'];
const POS = ['teşek', 'harik', 'mükem', 'bayıl', 'tavsi', 'süper', 'güzel', 'sevdi', 'başar', 'tebri', 'lezze', 'memnu', 'helal', 'bravo', 'güven', 'iftir', 'deste', 'yanın'];
const NEGS = new Set(NEG), POSS = new Set(POS);
const CTA = /boykot|payla[sş]ın|payla[sş]al[ıi]m|rt\s?(yap|le)|imza|[sş]ik[aâ]yet edin|almay[ıi]n|kullanmay[ıi]n|yayal[ıi]m|duyural[ıi]m|herkes g[oö]rs[uü]n/;
export function guessStance(ws, raw) {
  let n = 0, p = 0;
  for (const w of ws) { const st = stemOf(w); if (NEGS.has(st)) n++; else if (POSS.has(st)) p++; }
  const low = trLower(raw);
  const stance = n > p ? 'elestiri' : p > n ? 'destek' : /\?/.test(low) ? 'soru' : 'notr';
  return { stance, cta: CTA.test(low) };
}
