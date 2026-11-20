# Araştırma B — Veri erişimi, hukuk ve fizibilite

Yazan: Araştırma B ekibi. Tarih: 20 Kasım 2026. Girdi: `00-BRIEF.md`, `ZAYIFLIKLAR.md`, web araması.
Soru: Türkiye odaklı bir iletişim danışmanı, bütçe kısıtı olmadan, **yasal ve sözleşmeye uygun** biçimde hangi
kaynaktan hangi veriyi, hangi tamlıkta ve gecikmeyle, hangi koşullarla alabilir? Her kaynak için "gerçekte
yapılabilir mi"?

> **Bu belge hukuki görüş değildir.** Hukuk bölümündeki her şey avukatla doğrulanmak üzere hazırlanmış bir
> ön incelemedir.

### Yöntem ve güven etiketleri

- **[doğrulandı: URL]** — bilgi, resmî kaynağın (platform belgesi, kurum duyurusu, şirketin kendi basın bülteni)
  metninde görüldü. **Önemli sınır:** bu oturumda sayfaları doğrudan açma aracı ağ kısıtına takıldı
  (`docs.x.com`, `opentermsarchive.org` çözülemedi). Resmî metinler arama motoru dizinindeki alıntılardan okundu.
  Bağlayıcı bir karar öncesinde canlı sayfa bir kez daha açılmalı.
- **[kısmen: URL]** — kaynaklar çelişiyor, yalnız ikincil kaynak var ya da resmî metnin yalnız bir kısmı görüldü.
- **[doğrulanamadı]** — arama sonuç vermedi ya da yalnız genel bilgiye dayanıyor.
- Satıcıların kapsam iddiaları ("tam firehose", "%X doğruluk") **satıcı iddiası** olarak etiketlendi.
- Oturumun web arama kotası belgenin sonuna doğru doldu; "Kalan boşluklar" başlığında hangi konuların
  aranamadığı yazılı.

---

## 1. Özet (10 madde)

1. **X tek gerçekçi "tam kayıt" kaynağıdır ve iki resmî yolu vardır.** Kendi kendine açılan *kullandıkça öde*
   (gönderi okuma 0,005 $, ayda 2 milyon okuma tavanı, tam arşiv arama ve sayım uçları dahil) ve satış
   görüşmesiyle alınan *Enterprise* (tam akış/firehose, %1 ve %10 rastgele örneklem akışları, uyum akışları,
   anlamsal eşleşme işleci). Pro paketi yeni üyeye kapalı. Enterprise fiyatı yayımlanmıyor; ikincil kaynaklar
   aylık 42–50 bin $'dan başladığını söylüyor (doğrulanamadı).
2. **X sözleşmesi model eğitimini yasaklıyor; LLM ile analiz konusunda açık hüküm bulunamadı.** "X API'yi ya da
   X içeriğini bir temel/öncü modeli eğitmek ya da ince ayarlamak için kullanamazsınız" maddesi var (Grok hariç).
   Anthropic ticari verilerle model eğitmediğini sözleşmede taahhüt ediyor; bu nedenle en olası okuma "analiz
   serbest, eğitim yasak". Ama bu bir çıkarımdır; Enterprise sözleşmesine yazılı teyit konmalıdır.
3. **X'in "kısıtlı kullanım" kuralları danışmanlık işine doğrudan dokunuyor.** Kullanıcıları izleme/profil
   çıkarma, **protesto, miting ve topluluk örgütlenmesi gibi hassas olayları izleme/uyarı kurma**, sendika ve
   aktivist grupları izleme yasak; toplu (kişi saklamayan) analiz serbest. Siyasetçi danışanlar ve
   koordinasyon/aktör bulguları (P5, P12) bu sınırın yakınındadır.
4. **Meta ve TikTok'ta ticari kullanıcıya genel dinleme yolu yok.** Instagram'da anahtar kelime araması yok;
   hashtag araması 7 günde 30 etiketle sınırlı; yalnız kendi hesabını anan/etiketleyen içerik görülebiliyor.
   Facebook'ta yalnız herkese açık *Sayfa* içerikleri (onaylı uygulamayla). Threads'te anahtar kelime araması
   var (günde ~2.200 sorgu; Ağustos 2026'da değişti). Meta Content Library ve TikTok Research API yalnız
   akademik/kâr amacı gütmeyen araştırmacılara açık; TikTok için Türkiye listede değil.
5. **Instagram/TikTok/Facebook için en geniş meşru yol lisanslı dinleme platformlarıdır** (Meltwater,
   Brandwatch, Talkwalker vb.). Meltwater'ın X içeriğini API ile müşteriye aktarma (yeniden dağıtım) hakkı
   2024'te duyuruldu; Brandwatch ve Meltwater TikTok'un "Mentions API" ortaklığına sahip. Kapsamları satıcı
   iddiasıdır, bağımsız doğrulanamıyor; verinin bir LLM'e gönderilip gönderilemeyeceği satıcı sözleşmesinde
   ayrıca sorulmalı.
6. **Açık ve sağlam kaynaklar:** Bluesky (tam akış, ücretsiz, ama Türkiye hacmi küçük), YouTube Data API (günlük
   10.000 birim ücretsiz kota; yorumlar video bazında okunabilir; 30 gün saklama/yenileme kuralı), GDELT (15
   dakikada bir güncellenen küresel haber dizini, Türkçe dahil, ticari kullanım serbest).
7. **Telegram, yapay zekâ hattı için kapalıdır.** Şubat 2026'dan beri Telegram koşulları, platform verisinin
   yapay zekâ modellerinin "geliştirilmesi, iyileştirilmesi ya da kullanımı (deployment)" için toplanmasını
   açıkça yasaklıyor. LinkedIn'de dinleme yolu yok (üye etkinliği 48 saatten fazla saklanamaz).
8. **Türkiye'ye özgü kaynaklarda resmî veri yolu neredeyse yok.** Ekşi Sözlük'ün resmî API'si yok (telif
   yazarlarda; marka kullanımı yazılı izne bağlı). Şikâyetvar markaya kendi şikâyetleri için API anahtarı
   veriyor. Haber ve yayın için gerçekçi yol: ajans abonelikleri (AA vb.) ve **yerli medya izleme firmaları**
   (Ajans Press, Medya Takip Merkezi): basın, TV, radyo, internet, sosyal medya — satın alınabilir.
9. **KVKK açısından üç düğüm var:** (a) kamuya açık gönderi "alenileştirilmiş" sayılsa bile yalnız alenileştirme
   amacıyla uyumlu işlenebilir (dar yorum; Anayasa Mahkemesi'nin Ocak 2026 kararı ceza tarafını etkiledi);
   (b) gönderiler siyasi görüş, din, sağlık gibi **özel nitelikli veri** içerebilir; (c) Anthropic'e (ABD)
   gönderim **yurt dışına aktarımdır**: Haziran 2024'ten beri standart sözleşme imzalanıp **5 iş günü içinde**
   Kurul'a bildirilmeli. Anthropic'in sözleşmesinde AB standart maddeleri var; KVKK'nın kendi standart sözleşme
   metnini imzalayıp imzalamadığı doğrulanamadı — **açık risk budur.**
10. **Anthropic API:** girdiler/çıktılar varsayılan 30 gün içinde silinir; sıfır saklama (ZDR) satış ekibiyle
    yapılan anlaşmayla mümkün ama bazı özellikler ve en üst modeller (Fable/Mythos 5.x) bunun dışında; ticari
    veriyle model eğitilmez; işlem coğrafyası yalnız "küresel" ya da "ABD" seçilebilir (AB/Türkiye seçeneği
    yok). Türkiye'deki erişim kısıtlamaları (Mart 2025'te 42 saat, Eylül 2025, Eylül 2026'da 1.270 hesap
    engeli) izleme sürekliliğini değil, **verinin kendisini** bozar: hacim düşüşleri yanlış okunabilir.

---

## 2. Kaynak tablosu

Fizibilite: **Yüksek** = bugün satın alınabilir/kurulabilir, sözleşmeye uygun; **Orta** = mümkün ama başvuru,
pazarlık ya da dar kapsam var; **Düşük** = kapsam çok dar ya da hukuki belirsizlik yüksek; **Yok** = ticari ve
yasal yol bulunamadı.

| Kaynak | Erişim yolu | Tamlık | Gecikme | Geriye dönük derinlik | Yaklaşık maliyet | Yasal / sözleşme notu | Fizibilite |
|---|---|---|---|---|---|---|---|
| X — kullandıkça öde | Arama (son 7 gün + tam arşiv), sayım (son/tüm), filtreli akış (1.000 kural, 1 bağlantı) | Sorguya uyan herkese açık gönderilerin tamamı; **konunun değil sorgunun** tamlığı; ayda 2 M okuma tavanı | Akış: saniyeler; arama: dakikalar | 2006'ya kadar | Okuma 0,005 $/gönderi, hesap 0,010 $; sayım 0,005–0,010 $/istek; tavan doluysa ≈10 bin $/ay | Eğitim yasak; gözetim/hassas olay izleme yasak; silineni 24 saatte sil | **Yüksek** |
| X — Enterprise | Firehose, %1/%10 örneklem akışları, PowerTrack (5.000–25.000+ kural), tam arşiv, uyum akışı, anlamsal işleç | Platformun tüm herkese açık gönderileri | Gerçek zamanlı | 2006'ya kadar | Teklif; ikincil kaynak: 42–50 bin $/ay+ [doğrulanamadı] | Aynı kurallar; sözleşmeye ek hüküm pazarlığı mümkün | **Orta** (satış süreci, başvuru) |
| X — lisanslı aracılar (Meltwater, Brandwatch, Talkwalker…) | Kendi platformları + API (Meltwater: yeniden dağıtım hakkı) | Satıcı iddiası: tam firehose | Dakikalar | Satıcıya göre 12 ay – tüm geçmiş | Teklif [doğrulanamadı] | Hem X hem satıcı koşulları; LLM'e gönderme izni ayrıca sorulmalı | **Orta-yüksek** |
| Instagram (Graph API) | Hashtag araması, kendi hesabın etiket/anmaları | Çok dar: anahtar kelime yok; 7 günde 30 etiket; hikâye ve gizli hesap yok | Dakikalar | Hashtag için kısa (24 saat iddiası, doğrulanamadı) | Ücretsiz (uygulama incelemesi) | Uygulama incelemesi + "Public Content Access" onayı | **Düşük** |
| Facebook (Page Public Content Access) | Herkese açık Sayfa içerikleri, Sayfa arama | Yalnız Sayfalar; kişisel profil/grup yok [kısmen] | Dakikalar | Sayfa geçmişi [doğrulanamadı] | Ücretsiz | Uygulama incelemesi; onaylı kullanım: toplu/anonim izleme, duygu analizi | **Düşük-orta** |
| Threads API | Anahtar kelime ve konu etiketi araması | Arama tabanlı; günde ~2.200 sorgu (Ağu 2026'da değişti) | Dakikalar | [doğrulanamadı] | Ücretsiz | Ayrı izin onayı (`threads_keyword_search`) | **Orta** |
| Meta Content Library | Araştırma arayüzü/API | Geniş | — | — | Ücretsiz | Yalnız akademik / kâr amacı gütmeyen araştırma kurumları | **Yok** (ticari) |
| TikTok Research API | Araştırma API'si | Geniş | — | — | Ücretsiz | Kâr amacı gütmeyen araştırmacı; ABD, AB, BK, İsviçre, Norveç… Türkiye yok | **Yok** |
| TikTok Commercial Content API | Reklam kütüphanesi | Yalnız reklamlar, AB/BK | Günler [doğrulanamadı] | Son gösterimden 1 yıl | Ücretsiz | Başvuru | **Düşük** |
| TikTok — ortak platformlar (Mentions API) | Dinleme platformu üzerinden | Markayı anan içerik; genel arama yok [kısmen] | [doğrulanamadı] | [doğrulanamadı] | Platform ücreti | Satıcı sözleşmesi | **Düşük-orta** |
| YouTube Data API | Arama, video, kanal, yorum | Arama örneklemsel; yorumlar video bazında tam | Dakikalar | Tüm video geçmişi | Günlük 10.000 birim ücretsiz; arama 100, yorum sayfası 1 birim; denetimle artış | 30 gün yenileme/silme; istatistik 36 ay (onaylı) | **Yüksek** (video/yorum) |
| Reddit Data API | API | Tam (platform içi) | Dakikalar | Geniş | Ticari: sözleşmeyle, fiyat yayımlanmıyor | Kasım 2025'ten beri her istemci onaylı; ticari kullanım yazılı izne bağlı | **Düşük** (Türkiye için önemi az) |
| Bluesky | Jetstream / firehose | **Tam akış** (platformun tümü) | Saniyeler | Canlı + kısa tekrar oynatma (birkaç gün, anahtarlı) | Ücretsiz | Otomatik erişim yalnız sağlanan API'lerle | **Yüksek** (hacim küçük) |
| Telegram | MTProto API / Bot API | Kamuya açık kanallar | Saniyeler | Kanal geçmişi | Ücretsiz | **Yapay zekâ amaçlı toplama/kullanım yasak** (Şub 2026) | **Yok** (YZ hattı) / Düşük (insan okuması) |
| LinkedIn | Community Management API | Yalnız kendi sayfan | — | 48 saat saklama sınırı | Ücretsiz/ortaklık | Pazarlama amaçlı kullanım dışlanmış | **Yok** (dinleme) |
| Ekşi Sözlük | Resmî API yok | — | — | — | Lisans görüşmesi | Telif yazarda; marka yazılı izne bağlı; kazıma riskli | **Düşük** |
| Şikâyetvar | Marka API anahtarı | Danışanın kendi marka sayfası | [doğrulanamadı] | [doğrulanamadı] | Kurumsal üyelik [doğrulanamadı] | Genel veri lisansı doğrulanamadı | **Orta** (kendi markası) |
| İncisözlük, yerel forumlar | [doğrulanamadı] | — | — | — | — | Kullanım koşulları incelenemedi | **Düşük** |
| AA abonelik | Abone API'si | AA haberlerinin tamamı | Dakikalar | [doğrulanamadı] | Teklif | Abonelik sözleşmesi; LLM özetleme izni sorulmalı | **Yüksek** |
| DHA, İHA | Abonelik [doğrulanamadı] | — | — | — | Teklif | — | **Orta** [doğrulanamadı] |
| GDELT | Açık veri (dosya, BigQuery, API) | Geniş ama tam değil; tam metin yok, bağlantı + meta veri + ton | 15 dakika | 2015'ten (2.0) [doğrulanamadı] | Ücretsiz (BigQuery sorgu ücreti ayrı) | Atıfla her amaçla kullanım | **Yüksek** (sinyal) |
| Event Registry / NewsAPI.ai | Ticari haber API'si | ~150 bin kaynak, 50+ dil (satıcı/ikincil) | Dakikalar | 2014'ten | 90 $/ay'dan (ikincil) | Lisans koşulları doğrulanmalı | **Orta-yüksek** |
| Google News RSS | RSS | — | — | — | — | Koşullar kişisel, ticari olmayan kullanım diyor | **Düşük** |
| Yerli medya izleme (Ajans Press, MTM…) | Lisanslı hizmet | Basın, TV, radyo, internet, sosyal | Saatler [doğrulanamadı] | Yıllar | Teklif | Hizmet sözleşmesi; LLM'e gönderme izni sorulmalı | **Yüksek** |

---

## 3. Kaynak ayrıntıları

### 3.1 X (eski Twitter)

**Erişim düzeyleri ve fiyat.**
- Varsayılan model *kullandıkça öde*: abonelik yok, Geliştirici Konsolu'ndan peşin kredi alınır, her başarılı ve
  veri döndüren istek krediden düşer. Şubat 2026'da genel kullanıma açıldı. [doğrulandı:
  https://docs.x.com/x-api/getting-started/pricing] [kısmen: https://gigazine.net/gsc_news/en/20260209-x-api-pay-per-use]
- Birim fiyatlar: gönderi okuma **0,005 $/kaynak**, kullanıcı okuma **0,010 $/kaynak**, kendi verini okuma
  0,001 $; sayım (son 7 gün) 0,005 $/istek, sayım (tüm arşiv) 0,010 $/istek. Fiyat Konsol'da değişebilir.
  [doğrulandı: https://docs.x.com/es/x-api/getting-started/pricing] (Sayım satırı sayfada yanlış başlık altında
  görünüyor; Konsol'dan teyit edilmeli → [kısmen].) Nabız'ın varsayılanları (0,005 / 0,010 / 0,005) bununla uyumlu.
- **Aynı kaynak, aynı UTC gününde ikinci kez ücretlenmez** (24 saatlik tekilleştirme). Filtreli akıştan gelen her
  tekil gönderi de bu kuralla sayılır. [doğrulandı: https://docs.x.com/x-api/fundamentals/post-cap]
- **Aylık okuma tavanı:** belgelerin çoğunda 2 milyon gönderi, bir sayfada 3 milyon. Üstü Enterprise.
  [kısmen: https://docs.x.com/x-api/fundamentals/post-cap]
- **Pro** (5.000 $/ay) yeni üyeye kapalı; Ağustos 2026'da kaldırılacağı duyurulmuş, aboneler Eylül 2026'dan
  itibaren kullandıkça öde'ye geçiriliyor (ikincil kaynaklar; tarihler çelişkili). [kısmen:
  https://opentweet.io/how-to/migrate-x-api-pro-to-pay-per-use]
- **Enterprise:** "firehose, hacim akışları, tam arşiv arama ve PowerTrack; özel teknik destek ve özel fiyat."
  Fiyat yayımlanmıyor. İkincil kaynaklar 42.000 $/ay+ ya da başvuru formuna göre 50.000 $/ay'dan başlangıç
  diyor. [doğrulandı: https://docs.x.com/enterprise-api/introduction] [doğrulanamadı: fiyat —
  https://api.sorsa.io/blog/twitter-enterprise-api-pricing]
- Bir yerel sayfa Enterprise'ta dil bazlı akışlar olarak İngilizce, Japonca, Korece, Portekizce sayıyor;
  **Türkçe'ye özel bir dil akışı görülmedi**. Türkçe için ya tam firehose ya da `lang:tr` kurallı PowerTrack
  gerekir. [kısmen: https://docs.x.com/ko/enterprise-api/introduction]

**Uçlar ve sınırlar.**
- Tam arşiv arama (2006'ya kadar) resmî belgeye göre kullandıkça öde ve Enterprise müşterilerine açık;
  ikincil kaynakların bir kısmı tersini söylüyor (eski bilgi olabilir). [kısmen:
  https://docs.x.com/x-api/posts/search]
- Son 7 gün araması: uygulama başına 15 dakikada 450, kullanıcı başına 300 istek; istek başına en çok 100 sonuç.
  [doğrulandı: https://docs.x.com/x-api/fundamentals/rate-limits] Tam arşiv için "saniyede 1, 15 dakikada 300"
  yalnız ikincil kaynakta. [kısmen: https://api.sorsa.io/blog/twitter-api-rate-limits-2026]
- **Sayım uçları:** dakika/saat/gün ayrıntısında, sayfa başına 31 gün; tam arşiv 2006'ya kadar.
  [doğrulandı: https://docs.x.com/x-api/posts/counts/introduction]
- **Filtreli akış:** kullandıkça öde'de 1.000 kural, kural başına 1.024 karakter, tek bağlantı; Enterprise'ta
  5.000+ (bir sayfada 25.000+) kural, 2.048 karakter, çoklu bağlantı. **Anlamsal `embedding:` işleci yalnız
  Enterprise + "Embedding" düzeyinde.** [kısmen: https://docs.x.com/x-api/posts/filtered-stream/introduction]
  — Bu, N1 (kelimeye bağlılık) için doğrudan bir çözüm adayıdır; ayrıntısı Enterprise satışından öğrenilmeli.
- `min_likes`, `min_replies`, `min_reposts` arama işleçleri kaldırılmış (Japonca değişiklik günlüğü; tarih
  görülemedi): "çok etkileşim alanları getir" sorgusu artık yazılamıyor. [kısmen: https://docs.x.com/ja/changelog]
- **%1 ve %10 (Decahose) rastgele örneklem akışları yalnız Enterprise satış hesabıyla.** [doğrulandı:
  https://docs.x.com/x-api/posts/volume-streams/introduction]

**Etkileşim metrikleri ve yeniden paylaşım.**
- Herkese açık metrikler: yeniden paylaşım, yanıt, beğeni, alıntı, yer imi ve gösterim sayısı (`public_metrics`).
  Gizli metrikler yalnız kendi gönderilerin için ve son 30 gün. [doğrulandı:
  https://docs.x.com/x-api/fundamentals/metrics]
- Metrik, okunduğu anın fotoğrafıdır; güncel değeri almak için gönderinin yeniden okunması gerekir (P8). Aynı
  UTC günü içinde yeniden okuma ücretsizdir; ertesi gün yeniden ücretlenir (tekilleştirme kuralından çıkarım).
  [kısmen]
- Yeniden paylaşanlar ve alıntılar için ayrı uçlar var; sınırları ve fiyatları bu turda doğrulanamadı.
  Sayım ucunun yeniden paylaşımları sorguya göre (`is:retweet` / `-is:retweet`) sayabildiği genel bilgidir.
  [doğrulanamadı]

**Silinen içerik ve uyum.**
- X'te silinen, değiştirilen, korumaya alınan ya da askıya alınan içerik, X ya da hesap sahibinin talebinden
  sonra **24 saat içinde** sistemlerden silinmeli/güncellenmeli. [doğrulandı:
  https://developer.x.com/en/developer-terms/policy/privacy-and-control-are-key]
- Bunun için: toplu uyum ucu (gönderi/kullanıcı kimliği listesi yüklenir, silinmiş/askıda/korumalı durumu
  döner) ve yalnız Enterprise'ta gerçek zamanlı **uyum akışı** (silme, düzenleme, "withheld" olayları). Toplu uç
  yalnız uyum amacıyla kullanılabilir. [doğrulandı: https://docs.x.com/x-api/compliance/batch-compliance]
  [doğrulandı: https://docs.x.com/x-api/compliance/streams]
- **Ülkeye göre gizlenen (withheld) içerik:** API yanıtında hangi ülkelerde gizlendiği yazar; geliştiricinin
  "gizlenme" dahil kullanıcı içeriğindeki değişikliklere uyması beklenir. Türkiye'de gizlenen bir gönderinin
  Türkiye'deki kullanıcıya gösterilmesini yasaklayan cümle bu turda tam görülemedi. [kısmen:
  https://developer.x.com/en/docs/x-api/compliance/streams/integrate/honoring-user-intent]

**Sözleşme: yapay zekâ, paylaşım, kısıtlı kullanım.**
- Geliştirici Sözleşmesi son güncelleme 27 Nisan 2026. Haziran 2025'ten beri: "X API'yi ya da X İçeriğini bir
  temel ya da öncü modeli ince ayarlamak veya eğitmek için kullanamazsınız"; kısıtlı kullanım sayfasında "Grok
  hariç". [doğrulandı: https://docs.x.com/developer-terms/agreement] [doğrulandı:
  https://docs.x.com/developer-terms/restricted-use-cases] [doğrulandı:
  https://techcrunch.com/2025/06/05/x-changes-its-terms-to-bar-training-of-ai-models-using-its-content]
- **Üçüncü taraf bir LLM'e analiz için gönderme:** açıkça izin veren ya da yasaklayan cümle bulunamadı.
  [doğrulanamadı] İlgili kurallar: üçüncü tarafa verilen X içeriği Politika'ya tabi kalır; içerik indirmeden önce
  üçüncü tarafın X koşullarını kabul etmesi gerekir (Politika 16-3, arama özeti). [kısmen:
  https://docs.x.com/developer-terms/policy] Anthropic'in ticari koşulları müşteri içeriğiyle model
  eğitimini yasaklıyor (bkz. 5.6); bu, eğitim yasağıyla uyumlu. **Sonuç:** büyük olasılıkla izinli, ama yazılı teyit
  gereken gri alan.
- Paylaşım sınırları: bir kuruma 30 günde en çok **1,5 milyon gönderi kimliği**; alıcı başına günde en çok
  **50.000 tam gönderi/kullanıcı nesnesi** ve bunlar kamuya açık yayımlanamaz. [doğrulandı:
  https://docs.x.com/developer-terms/policy] [kısmen: 50.000 sınırı yalnız Japonca sayfada görüldü]
- **Kısıtlı kullanım:** X kullanıcılarını ya da içeriklerini araştırma/izleme; **protesto, miting, topluluk
  örgütlenme toplantısı gibi hassas olayları izleme, takip etme ya da uyarı kurma**; sendika ve aktivist grupları
  izleme; geçmiş taraması (background check) yasak. X dışı kimlikle eşleştirme (bir hesabı gerçek kişiyle,
  haneyle, cihazla bağlama) açık rıza ister. Kişisel veri (kullanıcı adı/kimliği) saklamayan **toplu analiz
  serbest**. [doğrulandı: https://docs.x.com/developer-terms/restricted-use-cases] [doğrulandı:
  https://docs.x.com/developer-terms/more-on-restricted-use-cases]
- Kullanıcı (tüketici) koşulları 15 Ocak 2026'da güncellendi; kazıma ihlallerinde 24 saatte 1 milyon gönderi
  başına 15.000 $ götürü tazminat (ikincil kaynak). Kazıma yasağını güçlendirir. [kısmen:
  https://pureai.com/articles/2025/12/22/x-new-terms-ai-prompts.aspx]

**Lisanslı aracılar.**
- **Meltwater**, Ekim 2024'te X'ten "yeniden dağıtım" hakkı aldı: onaylı müşterilerine X'in tam metin içeriğini
  **API ile** verebiliyor. X'in ortak sayfası "X firehose üzerinde hacim kısıtı olmadan sınırsız arama" diyor.
  [doğrulandı: https://www.meltwater.com/en/press-releases/meltwater-expands-partnership-with-x-gaining-resyndication-rights]
  [doğrulandı: https://partners.x.com/en/partners/meltwater]
- **Brandwatch**: resmî X ortağı, "tüm geçmiş gönderiler dahil tam firehose" diyor; başka bir sayfası "12 ay
  geçmiş" diyor. Satıcı iddiası, kendi içinde çelişkili. [kısmen: https://www.brandwatch.com/partnerships/x/]
- **Talkwalker**: 2024 tarihli "tam firehose" iddiası; Hootsuite satın alması sonrası güncel durum
  doğrulanamadı. [doğrulanamadı]

**Fizibilite:** Kullandıkça öde **yüksek** (bugün açılabilir; Nabız zaten bu modelde). Enterprise **orta**:
satın alınabilir, ama başvuru incelemesi, yıllık sözleşme ve kullanım amacının X'e anlatılması gerekir; siyasi
izleme amacı reddedilebilir. Aracılar **orta-yüksek**: hızlı, geniş, ama ham veriye ve LLM'e erişim satıcıya bağlı.

### 3.2 Meta (Instagram, Facebook, Threads)

- **Instagram hashtag araması:** bir İşletme/İçerik Üretici hesabı adına **7 günlük kayan pencerede en çok 30
  farklı etiket**; `recent_media` çağrısı da sayılır; sayfa başına 50 sonuç; sıralama her zaman kronolojik
  değil; emoji ve hikâye etiketi yok; uygulama incelemesi ve "Instagram Public Content Access" onayı gerekli.
  [doğrulandı: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search]
  "Son medya yalnız son 24 saat, en çok 250" bilgisi bir bağlayıcı firmanın belgesinden. [kısmen:
  https://docs.supermetrics.com/docs/good-to-know-about-instagram-public-data.md]
- **Instagram anmaları:** yalnız **kendi** İşletme hesabının etiketlendiği medya (`tags`), açıklamada
  (`mentioned_media`) ya da yorumda (`mentioned_comment`) anıldığı içerik. Hikâye anmaları ve **gizli hesaplar
  yok**; sahibin gizlediği beğeni/yorum sayıları gelmez. [doğrulandı:
  https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/mentioned_media]
- **Instagram'da anahtar kelime araması yok.** Danışanın adını geçen ama onu etiketlemeyen gönderiler API ile
  görülemez. [kısmen — resmî belgelerde böyle bir uç bulunmamasından çıkarım]
- **Facebook — Page Public Content Access:** Sayfa Arama API'si ve onay alınmamış Sayfaların herkese açık
  gönderi, yorum, değerlendirme verisi. Onaylı kullanım örnekleri: toplu/anonim içerikle haber izleme, rakip
  kıyası, **herkese açık Sayfa içeriğinde duygu analizi**. Uygulama incelemesi zorunlu. Kişisel profiller ve
  gruplar kapsam dışı. [doğrulandı: https://developers.facebook.com/docs/features-reference/page-public-content-access]
  [kısmen: profil/grup dışlaması belgede açıkça görülmedi]
- **Threads:** `keyword_search` ucu herkese açık gönderilerde anahtar kelime/konu etiketi arar; ayrı izin
  (`threads_keyword_search`) onayı gerekir, onaysız yalnız kendi gönderilerin. Sınır: kullanıcı başına kayan 24
  saatte 2.200 sorgu (sonuçsuz sorgu sayılmaz); değişiklik günlüğünde 18 Ağustos 2026'da "sorgu sınırı
  değiştirildi" notu var, yeni değer görülemedi. Ocak 2026'da yazara göre süzme eklendi. [kısmen:
  https://developers.facebook.com/docs/threads/keyword-search] [kısmen: https://developers.facebook.com/docs/threads/changelog]
- **Meta Content Library:** başvurucu nitelikli bir akademik kurum ya da bilimsel/kamu yararı araştırmasını
  ana faaliyet edinmiş **kâr amacı gütmeyen** kuruma bağlı olmalı; ücretsiz; başvuruyu bağımsız bir merkez
  (CASD) inceliyor. Şirketler, PR/iletişim ajansları başvuramaz (ikincil kaynak ve kurallardan çıkarım).
  [doğrulandı: https://transparency.meta.com/researchtools/meta-content-library] [kısmen:
  https://www.niemanlab.org/?p=252912]
- **CrowdTangle** 14 Ağustos 2024'te kapandı; yerine geçen araç ticari kullanıcıya açık değil. [doğrulandı:
  https://techcrunch.com/2024/08/15/meta-shut-down-crowdtangle-a-tool-for-tracking-disinformation-heres-how-its-replacement-compares]

**Ticari kullanıcı gerçekte ne görür?** Danışanın kendi Instagram/Facebook hesaplarına gelen yorum, anma ve
etiketler; haftada 30 Instagram etiketi; herkese açık Facebook Sayfaları; Threads'te anahtar kelime araması.
Danışanın adını geçen herkese açık Instagram gönderisi, Reels, hikâye, Facebook grubu ve kişisel profil
**görülemez**. Fizibilite: **düşük** (Threads için orta). Genişletmenin meşru tek yolu lisanslı dinleme
platformları ve onların da kapsamı satıcı iddiasıdır. [doğrulanamadı: Meltwater/Brandwatch'ın Meta kapsamı]

### 3.3 TikTok

- **Research API:** başvurucu ticari çıkarlardan bağımsız, kâr amacı gütmeyen ya da ticari olmayan temelde kamu
  yararı araştırması yapmalı; proje bazında onay. Pilot ülkeler: ABD, BK, İsviçre, Norveç, İzlanda,
  Lihtenştayn (+ Ekim 2024'te Avrupa'daki kâr amacı gütmeyen akademisyenler). **Türkiye ve ticari kullanıcı
  yok.** [doğrulandı: https://developers.tiktok.com/products/research-api] [doğrulandı:
  https://developers.tiktok.com/docs/en/research-api-faq]
- **Commercial Content API:** reklam verisi (etkin/eski reklamlar, son gösterimden bir yıla kadar), AB ve BK
  ülkeleri; başvuru ile. Türkiye reklamları kapsamda görünmüyor. [kısmen:
  https://developers.tiktok.com/docs/en/commercial-content-api-supported-countries]
- **Pazarlama ortakları:** Brandwatch (2022'den beri ortak, Mart 2025'te Mentions API bağlantısı) ve Meltwater
  (Mart 2025'te Mentions/Discovery API). Mentions API'nin markayı anan içerikle sınırlı olduğu, genel anahtar
  kelime dinlemesi sunmadığı anlaşılıyor. [doğrulandı:
  https://www.meltwater.com/en/press-releases/meltwater-joins-tiktok-marketing-partners-program]
  [kısmen: https://www.thesilab.com/resource/how-to-use-tiktok-for-social-listening]
- Bir veri firmasının 2026 analizi: TikTok'un bütün resmî yolları ticari kullanımı dışlıyor. [kısmen:
  https://www.datashake.com/blog/tiktok-data-coverage-in-2026-what-social-intelligence-teams-need-to-know]

**Fizibilite:** doğrudan **yok**; ortak platform üzerinden **düşük-orta** (dar, doğrulanamayan kapsam). TikTok
videoları için kalıcı kör nokta varsayılmalı; görülebilen kısım, haber ve X'e yansıyan TikTok içeriğidir.

### 3.4 YouTube, Reddit, Bluesky, Telegram, LinkedIn

**YouTube Data API v3.**
- Varsayılan kota günde **10.000 birim** (gece yarısı Pasifik saatiyle sıfırlanır). `search.list` 100 birim
  (her ek sayfa yeniden 100), `commentThreads.list` 1 birim. Fazlası için uyum denetimi + kota artış formu.
  [doğrulandı: https://developers.google.com/youtube/v3/determine_quota_cost] [doğrulandı:
  https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits]
- Saklama: kullanıcı silme isterse ya da yetki doğrulanamazsa 30 gün içinde silme; veri süresiz saklanamaz.
  Onaylı analitik kullanımda görüntülenme, beğeni, abone, yorum **sayıları** 36 aya kadar saklanabilir; başlık,
  açıklama, **yorum metni** 30 günlük yenileme/silme kuralına tabi. [doğrulandı:
  https://developers.google.com/youtube/terms/developer-policies-guide] [doğrulandı:
  https://developers.google.com/youtube/terms/derived-metrics-policy]
- Arama sonuç sayısı sınırlı ve platform genelinde yorum metni araması yok (genel bilgi). [doğrulanamadı]
- **Fizibilite: yüksek** — bilinen kanal ve videoların yorumları tam okunabilir; "danışanı anan yeni video"
  keşfi arama kotasıyla sınırlı ve eksiktir. 30 gün kuralı, olay arşivi tasarımını etkiler (bkz. 8).

**Reddit Data API.** 11 Kasım 2025'ten beri her yeni istemci onaylı; ticari kullanım açık yazılı izin ve
sözleşme ister; fiyat yayımlanmıyor (2023'teki ~0,24 $/1.000 çağrı tahmini). [kısmen:
https://data365.co/blog/reddit-api-pricing] Türkiye gündeminde payı küçük. **Fizibilite: düşük, öncelik düşük.**

**Bluesky.**
- Jetstream, ağın tam akışını bir aktarıcıdan (relay) alıp çözer ve süzer; Bluesky'ın herkese açık v2 örnekleri
  var, canlı bağlantı anahtarsız. 13 Ağustos 2026'da "Protocol Services" ile tekrar oynatma (replay) geldi:
  anahtarlı ve ölçülü; tekrar penceresi "birkaç gün" (üçüncü taraf). [doğrulandı:
  https://atproto.com/blog/introducing-bluesky-protocol-services] [kısmen: https://bsky.network/docs/jetstream-replay]
- Koşullar: otomatik erişim yalnız bu amaçla sağlanan API'lerle. Ücretli bir lisans yok; Bluesky, firehose'a
  bağımlı fonlu projelerin altyapı sağlayıcısına ödeme yapmasını ya da kendi aktarıcısını kurmasını bekliyor.
  [doğrulandı: https://www.bsky.social/about/support/tos] [doğrulandı: https://docs.bsky.app/blog/jetstream]
- Türkiye'de kullanıcı sayısı: 2025'te 250–500 bin tahmini (bir uzmanın açıklaması); küresel aylık etkin
  kullanıcı Haziran 2026'da ~10,4 milyon, yıllık %27 düşüş. [doğrulanamadı / kısmen:
  https://pasqualepillitteri.it/tr/news/13547/bluesky-bsky-app-nedir-nasil-calisir]
- **Fizibilite: yüksek**, ama Türkiye kamuoyundaki ağırlığı küçük. Asıl değeri: **tam akış olduğu için sorgu
  duyarlılığını doğrudan ölçmeye uygun bir deney alanı** (bkz. 7).

**Telegram.**
- API kullanımı "İçerik Lisanslama ve Yapay Zekâ Kazıma Koşulları"na tabi: platformdan elde edilen veriyi yapay
  zekâ/makine öğrenmesi modellerini **eğitmek, ince ayarlamak ya da bunların geliştirilmesi, iyileştirilmesi
  veya kullanımı (deployment)** için kullanmak, erişmek ya da toplamak yasak. İstisna yalnız meşru bir Telegram
  istemcisi, botu ya da mini uygulamasını çalıştırmak için gereken veri. Kanal içeriği gösteren uygulamalar resmî
  sponsorlu mesajları desteklemeli; ihlalde 10 gün sonra API erişimi kesiliyor. [doğrulandı:
  https://telegram.org/tos/content-licensing] [doğrulandı: https://core.telegram.org/api/terms]
- Yasak Şubat 2026'da tüm kullanıcı ve işletmelere genişletildi (Open Terms Archive). [kısmen:
  https://opentermsarchive.org/en/memos/telegram-prohibits-collecting-data-for-ai-use/]
- **Fizibilite:** Telegram içeriğini bir LLM'e analiz ettirmek → **yok** (koşullara açıkça aykırı okunabilir).
  Belirli kamuya açık kanalları **insanın** meşru bir istemciyle okuması → düşük ama mümkün; avukata sorulmalı.

**LinkedIn.** Üye sosyal etkinlik verisi en çok **48 saat** saklanabilir; Community Management API verisi
akış (feed) uygulamasında kullanılamaz; CRM, pazarlama otomasyonu, kitle oluşturma gibi kullanımlar dışlanmış;
geliştirme düzeyi günde 500 çağrı; üretim düzeyi ayrı başvuru. Dinleme/anma araması için resmî yol bulunamadı.
[doğrulandı: https://learn.microsoft.com/en-us/linkedin/marketing/restricted-use-cases] **Fizibilite: yok**
(yalnız danışanın kendi sayfasına gelen yorumlar).

### 3.5 Türkiye'ye özgü kaynaklar

**Ekşi Sözlük.**
- Resmî, herkese açık bir API ya da veri lisansı bulunamadı; GitHub'daki araçlar "resmî olmayan" API'lerdir.
  [kısmen: https://github.com/topics/eksi-sozluk]
- Kullanıcı sözleşmesi: entry'lerin telif hakkı **yazarlarına** ait; marka (ekşi sözlük vb.) aksi yazılı
  belirtilmedikçe üçüncü kişilerce kullanılamaz; koşullar önceden bildirilmeden değişebilir. Gizlilik
  politikası verilerin Türkiye'deki sistemlerde tutulduğunu söylüyor. [doğrulandı:
  https://eksisozluk.com/registration/eula]
- Lisans/veri ortaklığı haberi bulunamadı. [doğrulanamadı] Site 2023'te erişim engeli yaşadı, Anayasa
  Mahkemesi kararıyla kalktı. [kısmen: https://bianet.org/haber/eksi-sozluk-ban-lifted-following-top-court-verdict-290923]
- **Fizibilite: düşük.** Meşru yol: Ekşi Teknoloji ile yazılı lisans görüşmesi. Lisans yoksa yalnız insan
  okuması; otomatik toplama telif (FSEK), veri tabanı hakkı ve sözleşme açısından risklidir (avukat).

**Şikâyetvar.** Marka, kendi şikâyetlerini başka panellere aktarmak için Şikâyetvar API anahtarı alabiliyor
(Jetlink entegrasyonu örneği). Genel veri lisansı, fiyat ve kapsam doğrulanamadı. [kısmen:
https://www.jetlink.io/post/jetlink-x-sikayetvar-integration-a-new-era-in-customer-complaint-management]
**Fizibilite: orta** (yalnız danışanın kendi markası için; danışan hesabıyla).

**İncisözlük ve yerel forumlar.** Bu turda aranamadı (kota). [doğrulanamadı] Varsayılan: resmî yol yok,
fizibilite düşük; insan analist okuması.

**Haber ajansları.**
- **AA:** abonelik hizmeti; abonelere `api.aa.com.tr/abone` altında arama/indirme uçları bulunduğunu resmî
  olmayan bir belge ve GitHub istemcileri gösteriyor; abone olmadan veri alınamıyor. AA 2025 genel kurulunda
  2.019 müşteriye hizmet verdiğini açıkladı. [kısmen: https://github.com/bilginpro/agency-aa] [kısmen:
  https://www.haberler.com/guncel/aa-nin-2025-yili-olagan-genel-kurul-toplantisi-19802338-haberi/]
- **DHA, İHA:** abonelik hizmetleri olduğu genel bilgidir; teknik ve lisans koşulları aranamadı. [doğrulanamadı]
- **Fizibilite:** AA **yüksek** (satın alınabilir); haber metinlerinin LLM ile özetlenmesi ve danışana
  aktarılması abonelik sözleşmesinde açıkça sorulmalı.

**Toplu haber dizinleri.**
- **GDELT:** ana veri setleri 15 dakikada bir güncellenir; 65 dilden gerçek zamanlı makine çevirisi, Türkçe
  dahil; BigQuery'de de var. Koşullar: atıf ve bağlantıyla akademik, ticari ya da kamusal her türlü kullanım
  ücretsiz (ikincil alıntı). Tam metin vermez; bağlantı, varlık, tema ve ton verir. [doğrulandı:
  https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime/] [kısmen: lisans —
  https://casrai.org/guides/gdelt]
- **Event Registry / NewsAPI.ai:** ~150 bin kaynak, 50+ dil, 2014'ten arşiv, ücretli planlar 90 $/ay'dan
  (ikincil karşılaştırma). Türkçe kaynak listesi ve ticari lisans koşulu doğrulanamadı. [kısmen:
  https://geekflare.com/guides/global-news-api/]
- **Google News RSS:** Google News koşulları içeriğin yalnız kişisel (ticari olmayan) kullanımla
  gösterilebileceğini söylüyor (2006 tarihli metin); beslemeler de ticari olmayan kullanım için tanıtılmıştı.
  Ticari bir ürünün temeli yapılmamalı. [kısmen: https://www.google.com/intl/en_us/terms_google_news.html]

**TV, radyo, basılı yayın izleme.**
- **Ajans Press:** ~70 yıllık medya takip geçmişi; yazılı basın, TV, radyo, internet ve sosyal medya takibini
  yapay zekâ ve uzman insan desteğiyle analize dönüştürdüğünü söylüyor (Ekim 2026). [doğrulandı:
  https://www.forbes.com.tr/forbes-studyo/veriden-ongoruye-ajans-press-in-medya-zekasi]
- **Medya Takip Merkezi (MTM):** 25 yıl; basın ve TV ile başlamış, radyo, haber siteleri, bloglar, sosyal medya;
  YouTube 2018'de, podcast 2023'te kapsama girmiş; GPT tabanlı süreçler. [kısmen:
  https://www.marketingturkiye.com.tr/?p=163989]
- İnterpress, Medyatakip ve fiyatlar aranamadı. [doğrulanamadı]
- **Fizibilite: yüksek** — TV/radyo/basılı için **tek gerçekçi lisanslı yol** budur. Teslim biçimi (API mi, rapor
  mu), yayın deşifresi, gecikme, tiraj/reyting verisi ve LLM'e aktarma izni sözleşmede sorulmalı. Tiraj/reyting
  bilgisi P15'in (haberde erişim yok) tek ciddi çözümüdür. [doğrulanamadı: bu firmaların erişim verisi verip vermediği]

---

## 4. Türkiye'nin dijital zemini (kaynak seçimine etkisi)

- Türkiye'de Ekim 2026'da 61,0 milyon sosyal medya kullanıcı kimliği (nüfusun %69,3); başka bir rapor Ekim
  2025 için 62,3 milyon diyor. [kısmen: https://datareportal.com/reports/digital-2027-turkey]
- Bir haber, Instagram'ı 62,3 milyon, YouTube'u 57,9 milyon kullanıcıyla ilk iki platform olarak veriyor; X ve
  TikTok için 2026 rakamı bulunamadı. [kısmen: https://www.hurriyetdailynews.com/turkiyes-online-media-usage-surpasses-global-average-220421]
- Çıkarım: **en iyi erişilen kaynak (X), en çok kullanılan kaynak değildir.** Ortak sınır 1 ve 2 veri tarafında
  kalıcıdır; tasarım bunu kapsam göstergesinde açıkça yazmalıdır.

---

## 5. Hukuk

> **Uyarı:** Aşağıdakiler hukuki görüş değildir. Türk ve AB hukuku konusunda yetkin bir avukatla, sistem
> canlıya alınmadan önce doğrulanmalıdır. Kaynakların çoğu Kurum duyuruları ve hukuk bürolarının bilgi
> notlarıdır.

### 5.1 KVKK: kamuya açık sosyal medya verisi

- Kullanıcı adı, profil, gönderi metni ve bunlardan çıkarılan değerlendirmeler kişisel veridir; KVKK uygulanır.
  [değerlendirme]
- **Alenileştirme (m. 5/2-d) dar yorumlanıyor:** verinin herkese açık durması yetmez; ilgili kişinin
  alenileştirme iradesi aranır ve veri **yalnız alenileştirme amacıyla uyumlu** işlenebilir (Kurul: internet
  sitesindeki iletişim bilgisi ticari iletişim için kullanılamaz). [doğrulandı:
  https://www.kvkk.gov.tr/Icerik/6625/Kisisel-Verileri-Koruma-Kurulu-nun-Yeni-Yayinlanan-Karar-Ozetleri]
  [kısmen: https://www.alomaliye.com/2020/12/17/kisisel-verilerin-korunmasi-alenilestirme/]
- **Anayasa Mahkemesi 27.01.2026 (2020/32193):** alenileştirme amacının kanunda açıkça yazmadığı ve buna aykırı
  kullanımın açıkça yaptırıma bağlanmadığı gerekçesiyle bir para cezasını kısmen iptal etti; karar 16 Haziran
  2026'da Resmî Gazete'de. Amaç sınırının uygulamasını değiştirebilir; tam metin okunmalı. [kısmen:
  https://www.alomaliye.com/2026/06/16/kvkk-cezasinda-anayasa-mahkemesinden-onemli-iptal-karari/]
- Danışmanlık işinde olası diğer dayanak **meşru menfaat (m. 5/2-f)**: denge testi, veri azaltma ve kişiye göre
  değil konuya göre çalışma bu dayanağı güçlendirir. [değerlendirme — avukata sorulacak]
- **Özel nitelikli veri (m. 6):** gönderiler siyasi görüş, din, sağlık, sendika üyeliği gibi bilgileri açığa
  vurabilir; yapay zekâyla bunları çıkarmak ayrıca "işleme"dir. 7499 sayılı Kanun (RG 12.03.2024; yürürlük
  1.06.2024) m. 6'yı yeniden yazdı: açık rıza dışında yeni işleme şartları geldi; ilgili kişinin
  alenileştirdiği veriye ilişkin şart rehberde anlatılıyor. [doğrulandı:
  https://www.kvkk.gov.tr/Icerik/8184/Ozel-Nitelikli-Kisisel-Verilerin-Islenmesine-Iliskin-Rehber] [kısmen:
  yeni şartın tam fıkrası]
- Aydınlatma (m. 10), VERBİS kaydı ve saklama-imha politikası, binlerce kişiden kamuya açık veri toplayan bir
  sistem için ayrıca değerlendirilmeli. [doğrulanamadı — avukata sorulacak]

### 5.2 KVKK: yurt dışına aktarım ve yapay zekâ hizmeti

- 7499 ile m. 9 değişti (yürürlük 1 Haziran 2024); usul 10.07.2024 tarihli **Yurt Dışına Aktarım Yönetmeliği**
  ile belirlendi. Uygun güvencelerden biri **standart sözleşme**: Kurul'un 04.06.2024 tarih ve 2024/959 sayılı
  kararıyla dört tip metin (sorumlu→sorumlu, sorumlu→işleyen, işleyen→işleyen, işleyen→sorumlu). Metinde
  seçimlik maddeler dışında **ekleme, çıkarma, değişiklik yapılamaz**; imzalar tamamlandıktan sonra **5 iş günü
  içinde** fiziki, KEP ya da Bildirim Modülü (25 Ekim 2024'te açıldı) ile Kurul'a bildirilir; imzacıların yetki
  belgesi eklenir. [doğrulandı: https://www.kvkk.gov.tr/Icerik/8043/Standart-Sozlesme-Bildirim-Modulu-Hakkinda-Kamuoyu-Duyurusu]
  [doğrulandı: https://www.kvkk.gov.tr/Icerik/8170/Yurt-Disina-Kisisel-Veri-Aktariminda-Kullanilacak-Standart-Sozlesmelerde-Dikkat-Edilmesi-Gereken-Hususlara-Iliskin-Kamuoyu-Duyurusu]
- Bildirim yapılmazsa idari para cezası: 2026 için 90.308 – 1.806.377 TL (hukuk bürosu notu). [kısmen:
  https://www.cottgroup.com/en/blog/item/standart-sozlesme-bildirim-yukumlulugu-ve-yaptirimlari]
- **Arızi aktarım** istisnası dar: olağan faaliyet akışındaki aktarım arızi sayılmaz. Sürekli LLM analizi
  arızi değildir. [kısmen: https://www.erdem-erdem.av.tr/bilgi-bankasi/yurt-disina-kisisel-veri-aktarimi-rehberi-neleri-duzenliyor]
- **Üretken Yapay Zekâ ve Kişisel Verilerin Korunması Rehberi (24.11.2025, 15 soru):** yaşam döngüsünün
  herhangi bir aşamasında kişisel veri işleniyorsa KVKK uygulanır; yurt dışında yerleşik bir sağlayıcı üzerinden
  üretken yapay zekâ kullanımı ve bu yolla aktarım **m. 9 ve 10.07.2024 Yönetmeliği'ne uygun olmalıdır**.
  [doğrulandı: https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda]
- Kurul'un ABD için yeterlilik kararı bulunduğuna dair bilgi bulunamadı. [doğrulanamadı]
- **Anthropic tarafı:** Veri İşleme Eki (DPA, yürürlük 24.02.2025) Ticari Koşullar'a kendiliğinden dahil; AB
  Standart Sözleşme Maddeleri'nin Modül 2 ve 3'ünü ve BK ekini içeriyor. [doğrulandı:
  https://www.anthropic.com/legal/data-processing-addendum] [doğrulandı:
  https://privacy.claude.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa]
  **AB maddeleri KVKK standart sözleşmesinin yerine geçmez** (metin değiştirilemez ve Türkçe Kurul metnidir).
  Anthropic'in KVKK standart sözleşmesini imzalayıp imzalamadığı **doğrulanamadı** — satış ekibine ve avukata
  sorulacak bir numaralı soru.

### 5.3 GDPR'nin olası etkisi

- AB dışındaki bir sorumlu, **AB'deki kişilerin AB içindeki davranışını izliyorsa** GDPR m. 3(2)(b) uygulanabilir;
  "izleme" çevrimiçi takip ve profil çıkarmayı kapsar; amaçlı hedefleme aranır, tesadüfi işleme yetmeyebilir.
  [kısmen: https://www.twobirds.com/-/media/pdfs/gdpr-pdfs/11--guide-to-the-gdpr--material-and-territorial-scope.pdf]
- BK'de Clearview AI kararı "ile ilgili" ifadesini geniş okudu ve davranış izlemesi saydı (BK GDPR; AB'yi
  bağlamaz; temyiz 2026'da sürüyor). [kısmen: https://caselaw.nationalarchives.gov.uk/ukut/aac/2025/319]
- Danışan için olası durum: Avrupa'daki Türk kamuoyu figürleri, gazeteciler, diaspora hesapları belirli
  kişilere göre izlenirse GDPR ve m. 27 (AB temsilcisi) gündeme gelebilir. Konu bazlı toplu analiz riski azaltır.
  [değerlendirme]

### 5.4 5651 sayılı Kanun ve erişim kısıtlamaları

- 19–20 Mart 2025 (İmamoğlu'nun gözaltısı): X, YouTube, Instagram, TikTok vb. için bant daraltma/süzme; HRW ve
  bianet'e göre **42 saat**. OONI ölçümleri X dahil yavaşlatmayı doğruluyor; NetBlocks mekanizmanın "hedefli
  süzme" olabileceğini söylüyor. [doğrulandı: https://ooni.org/post/2025-turkiye-throttling-social-media/]
  [doğrulandı: https://www.hrw.org/news/2025/05/08/social-media-companies-should-resist-turkish-state-censorship]
- 7–8 Eylül 2025: X, YouTube, Instagram, Facebook, TikTok, WhatsApp'a erişim birçok ağda kısıtlandı (CHP
  mitingleri). [doğrulandı: https://www.al-monitor.com/originals/2025/09/access-x-youtube-other-online-platforms-restricted-turkey-internet-monitor-says]
- 19 Mart – 12 Nisan 2025: X, Türkiye'de en az 471 hesabı (toplam 17,2 M takipçi) erişime kapattı. Eylül 2026'da
  mahkemeler en az 1.270 hesabın engellenmesini istedi; X kararların en az %90'ına **yalnız Türkiye'de gizleme**
  (geo-block) ile uydu. [kısmen: https://advox.globalvoices.org/2025/05/09/digital-censorship-and-political-repression-the-blocking-of-the-x-account-of-istanbuls-jailed-mayor/]
  [doğrulandı: https://www.hrw.org/news/2026/10/12/turkiye-end-internet-censorship]
- **İzleme sürekliliğine etkisi:**
  1. Sunucu yurt dışındaysa API çekimi büyük olasılıkla sürer; yurt içindeyse API alan adının da etkilenip
     etkilenmediği bilinmiyor. [doğrulanamadı]
  2. Asıl bozulma **veride**: kısıtlama sırasında Türkiye'den gönderi hacmi düşer, VPN kullanımı artar
     (konum/dil sinyalleri bozulur). Hacim düşüşü "ilgi azaldı" diye okunmamalı.
  3. Türkiye'de gizlenen içerik API'de görünmeye devam edebilir (`withheld` alanıyla). Bu içeriğin Türkiye'deki
     danışmana gösterilmesi ve rapora girmesi hem X kuralları hem Türk hukuku açısından sorulmalı.
  4. Yerli kaynaklar da (ör. Ekşi Sözlük 2023) erişim engeli yaşayabilir.

### 5.5 X sözleşmesinin hukuki boyutu (özet)

Bkz. 3.1. Avukatla birlikte okunacak üç nokta: (a) LLM'e gönderim için yazılı teyit; (b) kısıtlı kullanım ile
danışmanlık hizmet tanımının çakıştığı yerler (siyasi danışan, miting/protesto, boykot, aktör profili);
(c) 24 saatte silme yükümlülüğü ile "kanıt saklama" ihtiyacının çatışması.

### 5.6 Anthropic API: saklama ve kullanım

- API girdi ve çıktıları **30 gün içinde** silinir; istisnalar: ayrı anlaşma (ZDR), kullanım politikası ihlali
  şüphesi, yasal zorunluluk, Files API gibi kullanıcının kontrolündeki saklama. [doğrulandı:
  https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organizations-data]
- **Sıfır saklama (ZDR):** uygun kurumsal müşterilere, Anthropic onayıyla, satış ekibi üzerinden. Kapsam: API ve
  ticari anahtarla Claude Code; beta ürünler, Workbench, Claude for Work kapsam dışı; güvenlik sınıflandırıcı
  sonuçları yine tutulur; Files API içeriği silinene kadar tutulur. [doğrulandı:
  https://privacy.claude.com/en/articles/8956058-i-have-a-zero-data-retention-agreement-with-anthropic-what-products-does-it-apply-to]
- **En üst modeller ZDR dışında olabilir:** belgeler Fable 5/5.1/5.2 ve Mythos 5/5.1/5.2 için 30 günlük saklamanın
  zorunlu olduğunu, ZDR altında ancak Anthropic açıkça izin verirse kullanılabildiğini söylüyor; Eylül 2026
  tarihli bir haber Fable 5.1 için bu şartın geçici olarak kaldırıldığını yazıyor. Çelişkili. [kısmen:
  https://platform.claude.com/docs/en/build-with-claude/api-and-data-retention] Ayrıca "message threads" ve
  Managed Agents ZDR kapsamında değil (Anthropic geliştirici belgesi, 2026-11). [kısmen]
- **Eğitim:** Ticari Koşullar'a göre Anthropic, müşteri içeriğiyle model eğitemez; müşteri çıktının sahibidir.
  [doğrulandı: https://www.anthropic.com/legal/commercial-terms]
- **Coğrafya:** `inference_geo` yalnız "global" (varsayılan; her coğrafyada çalışabilir) ya da "us"; dinlenme
  hâlindeki veri için çalışma alanı coğrafyası yalnız "us". **AB ya da Türkiye bölgesi yok.** [doğrulandı:
  https://platform.claude.com/docs/en/manage-claude/data-residency]
- Bulut sağlayıcılar (Bedrock, Vertex) üzerinden AB bölgesinde çalıştırmak teknik olarak mümkün, ama KVKK
  açısından AB de "yurt dışı"dır; aktarım yükü kalkmaz. [değerlendirme]

### 5.7 Avukata sorulacak sorular

1. Danışan için kamuya açık gönderileri toplamanın hukuki sebebi alenileştirme mi (m. 5/2-d), meşru menfaat mi
   (m. 5/2-f)? AYM'nin 27.01.2026 kararı amaç sınırını nasıl etkiliyor?
2. Gönderilerden yapay zekâyla siyasi görüş, din, sağlık gibi bilgi çıkarmak özel nitelikli veri işlemek sayılır
   mı; yeni m. 6'nın hangi şartına dayanılır; bu çıkarımlar hiç yapılmamalı mı?
3. Binlerce kişiye aydınlatma (m. 10) nasıl yapılır? VERBİS kaydı gerekir mi? Saklama-imha süresi ne olmalı?
4. Anthropic (ABD) ile KVKK standart sözleşmesi zorunlu mu; Anthropic imzalamazsa hangi yol kalır (başka
   sağlayıcı, yurt içi model, kişisel veriyi ayıklayarak gönderme)?
5. Kullanıcı adlarını kodla değiştirip (takma adlandırma) metni göndermek aktarım yükünü kaldırır mı; metin
   kimliği ele veriyorsa ne olur?
6. Zincirdeki diğer yurt dışı işleyenler (bulut, X, dinleme platformu, e-posta/bildirim servisi) için ayrı
   standart sözleşme gerekir mi?
7. X Geliştirici Sözleşmesi: X içeriğinin bir LLM sağlayıcısına "hizmet sağlayıcı" olarak iletilmesi serbest mi;
   X'ten yazılı teyit alınmalı mı; Enterprise sözleşmesine hangi madde konmalı?
8. X kısıtlı kullanım: siyasetçi danışan için miting/protesto, sendika, aktivist grup, boykot kampanyası izleme
   nerede yasak alana girer? Koordinasyon ve aktör bulguları "kullanıcıları izleme/profil çıkarma" sayılır mı?
9. Silinen gönderiyi 24 saatte silme yükümlülüğü ile kriz dosyası/kanıt saklama ihtiyacı nasıl uzlaştırılır?
   Ekran görüntüsü, özet, kimliksiz istatistik saklanabilir mi?
10. Danışana rapor verirken gönderi metni ve kimliği paylaşımı (1,5 M kimlik/30 gün, 50 bin nesne/gün sınırları,
    kamuya açık yayımlama yasağı) nasıl düzenlenmeli?
11. GDPR m. 3(2)(b): AB'de yaşayan kişilerin izlenmesi GDPR'yi tetikler mi; AB temsilcisi gerekir mi?
12. Ekşi Sözlük, Şikâyetvar, forumlar: kullanım koşulları, FSEK (yazar telifi) ve veri tabanı hakkı açısından
    otomatik toplama mümkün mü; lisans sözleşmesinde neler aranmalı?
13. Telegram'ın yapay zekâ yasağı, kanalların yalnız insanlarca okunmasını ve sayılmasını da kapsar mı?
14. Lisanslı dinleme platformundan ve medya izleme firmasından alınan verinin LLM'e gönderilmesi, danışana
    aktarılması ve saklanması sözleşmelere uygun mu? Haber metinlerinin özetlenmesi FSEK ve abonelik koşullarına
    uygun mu?
15. Türkiye'de erişime kapatılmış (5651 kararı ya da X'in gizlemesi) içeriğin Türkiye'deki danışmana gösterilmesi,
    raporlanması, saklanması risk taşır mı?

---

## 6. Kapsam (duyarlılık) ölçümü: veri tarafındaki olanaklar

Duyarlılık = ilgili içeriğin ne kadarının sorguyla yakalandığı. Ölçmek için **sorgudan bağımsız** bir örneklem ya
da tam evren gerekir. Sayım uçları bunu vermez: sayım, sorgunun sayısıdır (N1).

| Olanak | Ne sağlar | Nerede | Sınır |
|---|---|---|---|
| **Firehose** (X Enterprise) | Tam evren: bir dönem için "ilgili olup sorguya uymayan" gönderiler doğrudan bulunabilir | X | Pahalı; işlem yükü büyük; Türkçe dil akışı görülmedi |
| **%10 / %1 örneklem akışı** (X Enterprise) | Rastgele örneklem: örneklemdeki ilgili gönderilerin yüzde kaçının ana sorguya da uyduğu = duyarlılık tahmini | X | Nadir konularda %1 yetersiz (günde 1.000 ilgili gönderi → ~10 örnek); %10 daha iyi; ilgililik etiketi insan/LLM ister |
| **Anlamsal `embedding:` işleci** (Enterprise) | Anahtar kelimeye bağlı olmayan ikinci bir yakalama yolu; iki yöntemin kesişimiyle yakala-yeniden yakala tahmini | X | Ayrıntı ve doğruluk satıcıdan öğrenilmeli [kısmen] |
| **Sayım uçları** | Sorgu varyantlarının hacmini ucuza kıyaslar (lakap, yazım hatası, etiket); "hangi varyant ne kadar ekliyor" | X | Duyarlılığı değil, varyant katkısını gösterir; silinen gönderilerin sayımdan düşüp düşmediği [doğrulanamadı] |
| **Jetstream** (tam akış) | Bluesky'da tam evren; sorgu tasarımını ücretsiz sınama alanı | Bluesky | Kitle ve dil X'ten farklı; sonuç X'e ancak sınırlı genellenir |
| **Kaynaklar arası örtüşme** | GDELT + ticari haber API'si + AA + medya izleme firması: aynı olayı kaçının yakaladığı | Haber | Evren bilinmez; örtüşme yalnız göreli kapsam gösterir |
| **Meta / TikTok** | Ölçüm olanağı yok; aracı platformların kapsamı doğrulanamaz | — | Kalıcı kör nokta |

Pratik öneri: kullandıkça öde ile başlanırsa duyarlılık yalnız **dolaylı** ölçülebilir (geniş "ağ" sorgusu ile dar
sorgu farkı, varyant katkısı, elle bulunan olayların geriye dönük aranması). **Doğrudan ölçüm için Enterprise %10
akışı ya da firehose gerekir.** İstatistik yöntemleri Araştırma C'nin konusudur.

---

## 7. Kesin olarak görülemeyecek alanlar (kör noktalar)

Bütçe ne olursa olsun, yasal ve sözleşmeye uygun yoldan görülemeyecekler:

1. **WhatsApp ve kapalı gruplar** (WhatsApp, Telegram grupları, Facebook grupları, Discord): API yok ya da
   erişim yasak. [değerlendirme]
2. **Instagram ve TikTok'ta danışanı etiketlemeden anan içerik** (Reels, hikâyeler, videolar): resmî ticari yol yok;
   lisanslı platformlar kısmen ve doğrulanamaz biçimde görür.
3. **Kişisel Facebook profilleri ve gruplar.**
4. **Gizli/korumalı hesaplar** (tüm platformlar) ve **silinmiş içerik**: X'te silinen içerik 24 saatte silinmek
   zorunda; sistem "silinmiş bir gönderinin ne dediğini" saklayamaz.
5. **Telegram'ın yapay zekâyla analizi** (koşullar yasaklıyor).
6. **LinkedIn'de danışanı anan üye gönderileri.**
7. **Görsel, video ve ses içindeki metin/söz**: X ve YouTube'da medya dosyasına erişilse bile içeriğin okunması
   ayrı işlem ister; TikTok/Instagram'da dosyaya hiç erişilemez. TV/radyo için yalnız medya izleme firmasının
   deşifresi.
8. **Ekşi Sözlük ve yerel forumlar** (lisans alınamazsa yalnız insan okuması).
9. **Gösterim/erişim verisi**: X'te başkalarının gönderilerinde gösterim sayısı var; haberlerde, Instagram'da,
   TikTok'ta yok (P15). Haber için tiraj/reyting yalnız medya izleme firmasından gelebilir. [doğrulanamadı]
10. **Türkiye'de gizlenen içeriğin Türkiye'deki etkisi** ve **VPN arkasındaki Türk kullanıcıların konumu**.
11. **Geçmiş Meta/TikTok verisi**: olay başlangıcına geri gitmek mümkün değil.

---

## 8. Tasarıma çıkarımlar

**Veri katmanı (öneri: üç kademe).**
- **Kademe 1 — doğrudan, tam ve sözleşmeli:** X Enterprise (firehose ya da `lang:tr` PowerTrack + %10 örneklem +
  uyum akışı) ya da başlangıçta X kullandıkça öde; AA aboneliği ve en az bir ticari haber API'si; GDELT;
  YouTube Data API; Bluesky Jetstream; Threads anahtar kelime araması; Facebook Sayfa içerikleri.
- **Kademe 2 — lisanslı aracı:** Instagram/TikTok/Facebook ve (ikinci kaynak olarak) X için bir dinleme platformu
  (API ile ham veri veren; ör. Meltwater'ın yeniden dağıtım hakkı); TV/radyo/basılı için yerli medya izleme firması.
- **Kademe 3 — insan analist:** Ekşi Sözlük, forumlar, Telegram kanalları, WhatsApp'a yansıyan içerik (danışanın
  ilettiği), lisans alınamayan her kaynak. Sistem bunları "insan okuması, otomatik değil" diye etiketler.

**ZAYIFLIKLAR.md kodlarına bağlı öneriler.**
- **N1 (kelimeye bağlı):** Enterprise'ın anlamsal `embedding:` işleci ve %10 örneklem akışı istenmeli; satış
  görüşmesinde Türkçe başarımı ve fiyatı sorulmalı. Kullandıkça öde'de sayım uçlarıyla varyant katkısı
  ölçülmeli; "kesin sayı" her yerde "sorgunun sayısı" diye yazılmalı. Duyarlılık ölçümü kapsam göstergesine
  bağlanmalı (bkz. 6).
- **N6 (tutar tahmin):** X kullandıkça öde'de faturalama kaynak başına ve günlük tekilleştirmeli; tahmini tutar,
  X'in kullanım ucundan gelen gerçek tüketimle her gün mutabık kılınmalı. Enterprise sabit sözleşmesi bu riski
  büyük ölçüde kaldırır. Anthropic için de gerçek kullanım (usage) raporuyla mutabakat.
- **P1 (gerçek veriyle hiç çalışmadı):** ilk gerçek veri sınaması için ücretsiz/ucuz kaynaklar sırası: Bluesky
  (tam akış), GDELT, YouTube, ardından küçük kredili X kullandıkça öde. Enterprise öncesi bu adım satış
  görüşmesine somut ihtiyaç listesi sağlar.
- **P6 (yeniden paylaşımlar çekilmiyor):** yeniden paylaşım hacmi sayım ucuyla (`is:retweet`) ucuza ve tam
  sayılabilir; metin okumaya gerek yok. Özgün gönderinin `retweet_count` değeri toplamı verir. Kimin paylaştığı
  gerekiyorsa yalnız kritik gönderiler için okunmalı. [kısmen — sayım davranışı doğrulanmalı]
- **P7 (ilk gün verisi eksik):** tam arşiv arama + tam arşiv sayımı kullandıkça öde'de de var: yeni danışan
  için 30–90 günlük sayım tabanı (birkaç dolar) ve olay dönemlerinden hedefli geri doldurma yapılmalı; 2 M/ay
  tavanı bütçelenmeli.
- **P8 (etkileşim donuyor):** metrikler okuma anının fotoğrafı. Öne çıkan gönderiler belirli aralıklarla
  (ör. 1 saat, 6 saat, 24 saat) yeniden okunmalı; aynı UTC günü içinde ücretsiz. `min_likes` işleçleri
  kalktığı için "en çok etkileşim alan" listesi ancak okunan kümede sıralanabilir; bu da örnekleme bağlıdır.
- **P15 (haberde erişim yok):** GDELT ve haber API'leri erişim/tiraj vermez. Medya izleme firmasından tiraj,
  reyting, site trafiği sorulmalı; yoksa erişim alanı "bilinmiyor" gösterilmeli, sıfır değil.
- **K6 (gönderi içi talimat):** bütün kaynaklar yabancıların yazdığı metindir; sözleşmeler bu riski ele almıyor.
  Kaynak metni, yapay zekâya talimat kanalından ayrı ve "güvenilmez veri" olarak verilmeli (Araştırma C / güvenlik).
- **Kule "gizlilik ve sözleşme boyutu ele alınmadı" eksiği:** başlamadan (1) avukat görüşü (5.7), (2) Anthropic
  ile KVKK standart sözleşmesi ya da alternatif, (3) ZDR talebi ve ZDR kapsamındaki model/özellik seçimi,
  (4) X'ten LLM analizi için yazılı teyit, (5) Telegram'ı YZ hattından çıkarma.
- **Ortak sınır 1–2 (X kamuoyu değildir; görünmeyen yerler):** her ekranda ve notta **kaynak kapsam şeridi**:
  hangi kanal tam, hangisi kısmi, hangisi kör; Instagram/TikTok için "görülemiyor" açıkça yazılmalı.
- **Ortak sınır 3 (X'in verdiğiyle sınırlı):** silinen içerik 24 saatte silinir → olay arşivi kimliksiz istatistik
  ve kısa alıntı özetleriyle tutulmalı; hangi verinin silme yükümlülüğüne tabi olduğu veri modelinde işaretlenmeli.
  YouTube metinleri için 30 günlük yenileme aynı biçimde.
- **Erişim kısıtlamaları:** toplama sunucusu yurt dışında olmalı; Türkiye'deki kısıtlama dönemleri bir "olay
  takvimi"nde işaretlenmeli ve hacim yorumunda düzeltici not olarak çıkmalı; `withheld` alanı saklanmalı ve
  gösterilmeli.
- **Kısıtlı kullanım (X):** sistem kişiye göre değil konuya göre çalışmalı; tekil hesap profili ve koordinasyon
  bulguları iç kullanım, isimsiz ve insan onaylı olmalı (P5, P12 ile uyumlu). Siyasi danışanlarda miting/protesto
  izleme kuralı kurulamamalı (tasarım düzeyinde engel).
- **Sağlayıcı bağımlılığı:** Anthropic'te AB/TR bölgesi yok; KVKK sonucu olumsuz çıkarsa yedek yol (başka
  sağlayıcı, yurt içinde çalışan model ya da kişisel veriyi ayıklayan ön katman) mimaride düşünülmeli.

---

## 9. Kalan boşluklar (bu turda doğrulanamayanlar)

Ağ kısıtı nedeniyle resmî sayfalar doğrudan açılamadı; ortak web arama kotası doldu. Aranamayan ya da sonuç
vermeyen konular:
- Reddit'in yapay zekâ ile ilgili koşulları; YouTube aramasının sonuç sınırı.
- İncisözlük, yerel forumlar; DHA ve İHA abonelik koşulları; İnterpress, Medyatakip; medya izleme fiyatları.
- Meltwater/Brandwatch/Talkwalker'ın Instagram/TikTok kapsamı, Türkçe kapsamı, fiyatı ve LLM'e aktarma koşulu.
- X: yeniden paylaşım/alıntı uçlarının sınırları; tam arşiv oran sınırı; Enterprise fiyatı; Türkiye'de gizlenen
  içeriğin gösterimi kuralının tam metni; sayım uçlarının silinen gönderiyi sayıp saymadığı.
- KVKK: yeni m. 6'nın alenileştirme şartının tam metni; ABD için yeterlilik kararı yokluğu; Anthropic'in KVKK
  standart sözleşmesini imzalayıp imzalamadığı.
