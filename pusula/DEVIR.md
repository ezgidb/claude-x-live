# Pusula — devir notu

Bu not, Pusula'yı devralacak ekip içindir: ürünün ne olduğu, şu an ne durumda olduğu, nasıl çalışılacağı ve
sırada ne yapılması gerektiği. Ürünün tanıtımı `README.md`'de; burada tekrar edilmedi.

## 1. Kullanıcı ve amaç

Kullanıcı bir **iletişim danışmanı**, teknik değil. Danışanları (marka, kişi, kurum) hakkında sosyal medyada ne
konuşulduğunu canlı görmek, bir şey büyümeden fark etmek ve danışana ne yapması gerektiğini söyleyebilmek istiyor.

- Onunla **Türkçe ve sade** konuşun; komut çıktısı yapıştırmayın, kendi yorumunuzla anlatın.
- Önceliği **doğruluk**; ucuzluk değil. Ama gürültü de istemiyor.
- Kök dizindeki eski araç **Nabız**'dır (`/src`, `/public`, `/CLAUDE.md`). Pusula ondan bağımsızdır; Nabız'a dokunmayın.
  Kullanıcı ikisini karşılaştırmak için yan yana tutuyor.

## 2. Şu anki durum (dürüst özet)

| Parça | Durum |
|---|---|
| Demo modu (simülasyon) | Çalışıyor; tarayıcıda uçtan uca denendi |
| Testler | `npm test` → 44/44 geçiyor |
| Yerel yorum (anahtarsız) | Çalışıyor ama kaba (bkz. 5. bölüm) |
| Claude yorumu | Yazıldı, **gerçek API ile hiç denenmedi** (yalnızca sahte `fetch` ile) |
| X kaynağı | Yazıldı, **gerçek API ile hiç denenmedi** |
| Haber (Google Haberler RSS) | Yazıldı, **canlı denenmedi** |
| Bluesky | Yazıldı, **canlı denenmedi**; açık arama ucu zaman zaman 403 veriyor |
| Canlı mod (gerçek veriyle tam tur) | **Hiç çalıştırılmadı** |
| Analiz modülü | Çalışıyor ve testli; yazan ekip son raporunu veremeden durdu, kod ikinci bir gözle okunmadı |

Demo ekranındaki her şey uydurmadır. Kullanıcıya demo çıktısı anlatırken bunu her seferinde söyleyin.

## 3. Çalıştırma

```bash
cd pusula
npm start                       # http://localhost:4400, demo modu
npm test
node src/cli.js durum           # çalışan sunucuya sorar
node src/cli.js rapor anadolu-sut
```

Ortam değişkenleri: `PORT`, `HOST`, `PUSULA_MODE` (`demo` | `canlı`), `PUSULA_SPEED` (demo hızı, varsayılan 60),
`PUSULA_DB` (varsayılan `data/pusula.db`), `ANTHROPIC_API_KEY`, `X_BEARER_TOKEN`,
`PUSULA_MODEL_FAST`, `PUSULA_MODEL_DEEP`.

Hızlı deneme için: `PUSULA_SPEED=600 npm start` → kriz bir dakikadan kısa sürede zirveye çıkar.

## 4. Mimari ve çalışma kuralları

Akış: **kaynak → depo → anlamlandırma → analiz → olay → not → yayın** (`src/engine.js`, `cycle` ve `runClient`).

| Katman | Dosya | Bilinmesi gereken |
|---|---|---|
| Motor | `src/engine.js` | Demo saatini yönetir; demo verisi bellekte, ayarlar ve canlı veri `data/pusula.db`'de |
| Kaynaklar | `src/sources/` | Her kaynak `poll({client, since, until})` → `Item[]`; hata fırlatmaz, `lastError` doldurur |
| Depo | `src/store.js` | `items()` aralığı: `since` dahil, `until` hariç |
| Analiz | `src/analysis/` | Saf fonksiyonlar: `analyze`, `diffEvents`. G/Ç yok |
| Yorum | `src/ai/` | `createAI({apiKey})`; anahtar yoksa yerel. Hiçbir yöntem fırlatmaz, hata olursa yerele düşer |
| Sunucu | `src/server.js` | JSON API + SSE (`/api/stream`) |
| Arayüz | `public/` | `app.js` (genel bakış, ayarlar), `room.js` (danışan odası), `charts.js` (elle SVG) |

Uyulacak kurallar:

- **Sıfır npm bağımlılığı.** Node ≥ 22.5; `node:sqlite`, `node:http`, `fetch`, `node:test`.
- **"Şimdi" parametredir.** Analiz ve yorum katmanında `Date.now()` kullanmayın; demo saati hızlandırılmıştır.
- **Veri biçimleri sabittir** (`Client`, `Item`, `Enrichment`, `Snapshot`, `Event`, `Brief`, `Playbook`). Bir alan
  değişecekse üreteni, tüketeni, `test/fake-engine.js`'i ve arayüzü birlikte güncelleyin.
- **Dürüstlük kuralı.** Sayılar kesindir; duruş, anlatı ve rol yorumdur. Neden-sonuç yazmayın ("büyüttü" değil,
  "paylaşımının ardından hacim arttı"). Koordinasyon bulgusu suçlama değil işarettir; kamuya açık taslaklara girmez.
- **Para harcayan adım kullanıcı onayı ister.** X API ve Claude API ücretlidir. Token'ı kullanıcı girmeden çağrı
  yapmayın; ilk canlı denemeden önce tahmini tutarı söyleyip açık onay alın. X için günlük tavan var (varsayılan 10 $,
  depoda `x.dailyCapUsd`); kullanıcı istemedikçe değiştirmeyin.
- **X'i tarayıcıyla kazımayın.** Hesap riski taşır; kullanıcı bu yolu seçmedi.
- **Gerçek marka, kişi, hesap adı yok** — demo verisinde ve testlerde.
- Arayüz metinleri Türkçe ve HTML kaçışlı; yeniden çizimde kaydırma konumu ve yazılmakta olan girdiler korunur.
- Geliştirme dalı: `claude/gifted-dijkstra-qstcwt`. Kullanıcı istemedikçe PR açmayın.

Ekip hâlinde çalışacaksanız: bu oturumda dört paralel ekip kullanım kotasını üç kez tüketti. İşi iki ekiple ya da
sırayla yürütmek daha güvenli.

## 5. Bilinen kusurlar

1. **Yerel duruş okuma kaba.** Görülmemiş cümlelerde isabet yaklaşık %75; ince alayı çoğunlukla kaçırıyor
   (denemede 5 alaydan 1'i tuttu). Demo krizinde gönderilerin %40'tan fazlası "nötr" çıkıyor; gerçekte daha azı nötr.
   → `src/ai/local-enrich.js`, `src/ai/lexicon.js`
2. **Yerel anlatı adları bazen anlamsız** ("Sut ve yoneten tartışması", "Hangi ve tesis soruları").
   → `src/ai/local-names.js`
3. **Aynı konu birden çok anlatıya bölünüyor** ("Üründe yabancı madde iddiası" ile "Sütü ve çocuk eleştirileri"
   aslında aynı konu). Motor yalnızca adı birebir aynı olanları birleştiriyor (`engine.js`, `nameNarratives` sonu);
   bu bir yamadır, doğru yeri analiz katmanıdır. → `src/analysis/narratives.js`
4. **Tahmin ile eğilim çelişebiliyor.** Aynı notta "hacim çok hızlı artıyor" ve "yön yatay" görülebiliyor; güven
   düzeyi de tutarsız (aynı durumda bir "yüksek", bir "düşük" çıktı). → `src/analysis/forecast.js`, `pulse.js`
5. **Danışanın kendi hesabı "yükseltici" sayılıyor.** `client.terms` içindeki `@hesap` ayrı bir rol ("danışan")
   olmalı ve notlarda öyle anılmalı. → `src/analysis/actors.js`, `src/ai/local-brief.js`
6. **Olay başlıklarında danışan adı yok** ("Yeni konu", "Konu medyada"); genel akışta hangi danışan olduğu yalnızca
   etiketten anlaşılıyor, konu adı başlıkta geçmiyor. → `src/analysis/events.js`
7. **"Konu medyada" olayı çok sık.** Her yeni haber sitesi ayrı olay üretiyor; ilk giriş ve ulusal yayın dışındakiler
   toplanmalı. → `src/analysis/events.js`
8. **Sakin danışanda da 12 anlatı listeleniyor.** Düşük hacimde anlatı çıkarmak gürültü; eşik gerekli.
9. **Demo bağlantıları açılmıyor** (`demo.pusula.example`). Bilerek böyle; arayüz demo modunda bağlantıyı
   tıklanamaz göstermeli.
10. **Genel bakışta masaüstünde kartların altı boş kalıyor** (üç danışanla).
11. **Yerel "Pusula'ya sor" 12 soru türü tanıyor**; dışındakilere "Claude anahtarı gerekli" diyor.
12. **Yerel taslaklarda `[köşeli parantez]` boşlukları var**; danışman doldurur. Arayüz bunları vurgulamıyor.

## 6. Yapılacaklar (öncelik sırasıyla)

### A. Önce: gerçek veriyle doğrulama
Demo iyi görünüyor ama ürünün asıl sınavı gerçek veri. Bu yapılmadan başka iyileştirme önceliklendirilmesin.

- [ ] Canlı modu anahtarsız kaynaklarla (haber + Bluesky) gerçek bir danışan adıyla çalıştır; RSS ayrıştırma,
      tarih, yinelenen haber, Bluesky 403 davranışını gör. Ücretsizdir.
- [ ] Kullanıcıdan onay alarak X token'ı ile küçük bir deneme (tek danışan, kısa süre). Sorgu kurma
      (`buildXQuery`), sayfalama, harcama defteri ve tavanın gerçekten durdurduğunu doğrula.
- [ ] Kullanıcıdan onay alarak Claude anahtarıyla deneme: istek biçimi, yapılandırılmış çıktı, hata → yerel düşüş,
      maliyet. `src/ai/claude.js` yazılırken kullanılan model kimlikleri ve başlıklar güncel belgeyle yeniden
      doğrulanmalı (kod `claude-api` skill'ine göre yazıldı, ezbere güvenmeyin).
- [ ] Derin model kararı: varsayılan `claude-opus-5-5`. En yetenekli model daha pahalı ve yavaş; kullanıcıya
      sorulacak bir tercih.
- [ ] Gerçek veride analiz eşiklerini (risk düzeyleri, olay açılışı, koordinasyon) yeniden ayarla; hepsi
      simülasyona göre ayarlandı.
- [ ] Canlı modda Claude ile zenginleştirmenin danışan başına günlük maliyetini ölç ve arayüzde göster;
      X'teki gibi bir tavan ekle.

### B. Doğruluk
- [ ] 5. bölümdeki 3, 4, 5 numaralı kusurlar (anlatı bölünmesi, tahmin tutarlılığı, danışan hesabı rolü).
- [ ] Yerel alay ve olumsuzlama okumasını güçlendir; `test/zeka-ornekler.js`'e ayar yapılmamış yeni örnekler ekle
      ve isabeti o kümeyle raporla.
- [ ] Yanıt zincirleri: simülasyonda yanıta yanıt yok; gerçek veride konuşma ağacı (`conversation_id`) kullanılmalı.
- [ ] Analiz modülüne ikinci göz: `src/analysis/` baştan sona okunmadı; özellikle `risk.js` içindeki olay yaşam
      döngüsü ve `events.js`'in tekrar üretmeme mantığı.
- [ ] Arayüzde her yorumun yanında dayanak: kaç gönderi, hangi yöntem (Claude / yerel), ne zaman.

### C. Gürültü
- [ ] 5. bölümdeki 6, 7, 8 numaralı kusurlar (olay başlıkları, medya olaylarının toplanması, anlatı eşiği).
- [ ] Olay akışında düzeye göre süzgeç ve "yalnızca alarm" görünümü.

### D. Ürün
- [ ] **Bildirim:** alarm düzeyinde olay için tarayıcı bildirimi; sonra e-posta ya da telefon. Şu an yalnızca
      ekrandaki şerit var — danışman ekrana bakmıyorsa haberi olmaz.
- [ ] **Sabah özeti:** tüm danışanlar için tek sayfalık günlük not.
- [ ] **Olay raporu dışa aktarma:** kapanan bir olayın danışana gönderilebilir özeti (PDF ya da belge).
- [ ] **Danışan düzenleme:** şu an yalnızca ekle ve sil var.
- [ ] **Yanlış okumayı düzeltme:** danışman bir gönderinin duruşunu ya da anlatısını elle düzeltebilsin; düzeltme
      kalıcı olsun.
- [ ] **Rakip izleme:** `client.rivals` alanı toplanıyor ama hiçbir yerde kullanılmıyor.
- [ ] **Yeni kaynaklar:** YouTube, Ekşi Sözlük, Instagram değerlendirilecek (erişim ve koşullar araştırılmalı;
      kazıma yok).
- [ ] **Geçmiş olaylar arşivi:** kapanan olaylar ve o günkü notlar geri açılabilsin. Depo danışan başına son 30
      anlık görüntüyü tam tutuyor, eskisinden yalnızca risk ve hız kalıyor.

### E. Altyapı
- [ ] İnternette barındırma: parola koruması yok (Nabız'da `APP_PASSWORD` vardı). Dışarı açılmadan önce şart.
- [ ] Anahtarlar `data/pusula.db` içinde düz metin duruyor.
- [ ] Canlı modda eski gönderilerin temizlenmesi (saklama süresi) yok.
- [ ] `package.json` kök dizinle ayrı; kökte `pusula` için bir kısayol betiği yok.
- [ ] Kökteki `CLAUDE.md` yalnızca Nabız'ı anlatıyor. Pusula için çalışma yönergesi (bu notun 1. ve 4. bölümleri)
      oraya ya da `pusula/CLAUDE.md`'ye taşınmalı — kullanıcıya sorarak.

## 7. Kullanıcıya sorulacak açık kararlar

1. Gerçek veriyle ilk deneme hangi danışanla ve hangi harcama sınırıyla yapılacak?
2. Pusula Nabız'ın yerini mi alacak, yoksa ikisi birlikte mi yaşayacak?
3. Claude yorumu için varsayılan model ve günlük harcama tavanı ne olsun?
4. Bildirim hangi kanaldan gelsin (tarayıcı, e-posta, telefon)?
5. Araç yalnızca kendi bilgisayarında mı kalacak, internete mi taşınacak?
