# Araştırma A — Piyasa ve rakip yaklaşımlar

Yazan: Araştırma A ekibi. Tarih: 19 Kasım 2026. Girdi: `00-BRIEF.md`, `ZAYIFLIKLAR.md`, `01-GEREKSINIM-MEVCUT.md`.
Soru: Sosyal medya dinleme, medya izleme, kriz/itibar istihbaratı ve anlatı/dezenformasyon istihbaratında en
gelişmiş ürünler **ne yapıyor**, doğruluğu ve kapsamı **nasıl** sağlıyor, **nerede** yetersiz kalıyor?

## 0. Yöntem, etiketler ve bu belgenin sınırları

**Etiketlerin anlamı**
- **[doğrulandı: URL]** — Bilgi, adı geçen sayfanın kendi metninde görüldü. Satıcı sayfasıysa bu, yalnızca
  "satıcı bunu iddia ediyor" bilgisinin doğrulandığı anlamına gelir; o durumda ayrıca **(satıcı iddiası)** yazıldı.
- **[kısmen]** — Tek ve ikincil bir kaynak, kaynaklar birbiriyle çelişiyor ya da bilgi eski tarihli.
- **[doğrulanamadı]** — Kaynak bulunamadı; model bilgisinden geliyorsa "(model bilgisi)" diye ayrıca belirtildi.

**Sınırlar (okurken akılda tutun)**
1. Sayfaları tam açıp okuyan araç (WebFetch) bu oturumda dış sitelere erişemedi (`docs.x.com`, `iddp.gwu.edu`,
   `ndi.org` "çözümlenemedi" hatası verdi). Bütün bulgular **arama motoru sonuçlarındaki alıntılara** dayanır;
   tam metinler okunmadı. Ayrıntıya girmeden önce kritik kaynaklar tam metinden kontrol edilmeli.
2. Oturumdaki ortak web arama kotası (200 arama, bütün ekiplerin toplamı) bu çalışmanın sonunda doldu. Türkiye'de
   TV/radyo/basılı izlemenin kapsamı ve lisanslaması, küresel araçların Türkçe desteği, Ekşi Sözlük'e erişim yolu ve
   büyük PR ajanslarının kriz masaları **araştırılamadı**; bunlar 9. bölümde "açık kalanlar" olarak listelendi.
3. Satıcıların doğruluk rakamları (ör. "%90 üzeri") hiçbir yerde olgu olarak aktarılmadı.

---

## 1. Özet (10 madde)

1. **Pazar "veri erişimi" ile ayrışıyor, yapay zekâ ile değil.** X'in tam akışına (firehose: bütün herkese açık
   gönderilerin anlık akışı) resmî ortaklıkla erişen az sayıda satıcı var (Brandwatch, Talkwalker iddia ediyor;
   Meltwater 2024'te X içeriğini müşterisine yeniden dağıtma hakkı aldı). Bağımsız bir rapor pazarı "ayrıcalıklı
   erişim ile kazımanın (scraping) karışımı, opak bir ekosistem" diye tanımlıyor. [doğrulandı: https://iddp.gwu.edu/node/5711]
2. **En pahalı araçlar bile kör noktalarla çalışıyor.** Instagram'da yalnızca işletme hesabı başına haftada 30
   etiket aranabiliyor, kişisel hesaplar ve Hikâye etiketleri kapsam dışı; TikTok'un ticari veri API'si yok.
   Bu, ZAYIFLIKLAR "ortak sınır 2"nin piyasa liderleri için de geçerli olduğunu gösteriyor.
3. **Sorgu tek başına yetmiyor; pazar "geniş sorgu + yapay zekâ ilgililik süzgeci"ne geçiyor.** Sprinklr kendi
   belgesinde Boolean sorgularla gelen alakasız içeriğin "yaklaşık %50'den %10'un altına" indirildiğini iddia ediyor;
   yani satıcı, salt sorgunun yarı yarıya gürültü getirebildiğini kendisi kabul ediyor. (satıcı iddiası)
4. **Duygu/duruş okumasının bağımsız ölçümü pazarda yok.** 16 satıcının 8'i doğruluk rakamı yayımlıyor, hiçbiri
   bağımsız denetimle değil; hakemli bir çalışma dört ticari aracın aynı metne farklı duygu verdiğini gösteriyor.
   Kullanıcı yorumlarında "yerel dil, lehçe ve alayı okuyamıyor" şikâyeti tekrar ediyor.
5. **Yapay zekâ asistanları her yerde; en iyiler "kaynak gösteren" ve "sorguyu gösteren" asistanlar.** Meltwater
   Mira yanıtlarını özgün içeriğe bağlanan atıflarla veriyor; Brandwatch Iris sorguyu düzenlenebilir Boolean olarak
   yazıyor ki mantık denetlenebilsin. Bu, bizim K2/K3/K4 risklerimize doğrudan yanıt veren bir uygulama.
6. **Uyarıda iyi uygulama: öğrenilmiş taban + sapma.** Sprinklr modeli beklenen hareketi tahmin edip sapmayı
   işaretliyor; Emplifi "gerçek kriz" ile "viral an"ı salt hacimle değil duygu hızı ve platformlar arası yayılımla
   ayırdığını söylüyor. "Kurulan uyarının geçmiş veride sınanması" ise hiçbir satıcıda görülmedi — bir boşluk.
7. **Anlatı/dezenformasyon firmaları ağ analizi + davranış işaretleri kullanıyor, ama yöntem ayrıntısı kapalı.**
   Blackbird'ün risk puanı "yüzlerce sinyal"den oluşuyor, ağırlıkları yayımlanmamış; Cyabra'nın %90 üzeri
   isabeti kendi beyanı. Akademik yazın, koordinasyon tespitinin en büyük yanlış pozitif kaynağının **meşru
   toplulukların doğal eşgüdümü** olduğunu söylüyor (bizim P12).
8. **Güven dilinde en olgun örnekler istihbarat geleneğinden.** Graphika atıflarını "orta/yüksek güvenle" ve
   gerekçe göstergeleriyle veriyor; "yalnızca içerik paylaşımı güçlü atıf işareti değildir" diyor. NewsGuard 2025'te
   "dezenformasyon" etiketini bıraktı, yerine "kanıtlanabilir biçimde yanlış iddia" dilini kullanıyor.
9. **Türkiye'de üç büyük medya takip şirketi (Ajans Press, MTM, Interpress) basılı/TV/radyo + dijitali birlikte
   izliyor ve yapay zekâ ile insan analisti birleştiriyor**; ama Türkçe duygu/duruş başarısına dair yayımlanmış
   ölçüm yok. Türkiye'ye özgü bir etken: X'in Türkiye'de erişime kapattığı ("withheld") hesaplar (Mart–Nisan
   2025'te en az 471 hesap) — Türkiye'den bakan ile yurt dışından bakan farklı şey görür.
10. **Fiyat: kurumsal dinleme yıllık ~10–130 bin $ bandında (Sprinklr daha yüksek); hepsi satın alınabilir.**
    Bütçe kısıt olmadığına göre asıl soru "hangisini alırız" değil, **"satın aldığımız verinin kapsamını ve
    okumasının isabetini kendimiz nasıl ölçeriz"** — çünkü pazarın en zayıf olduğu yer tam olarak burası.

---

## 2. Ürün grupları

| Grup | Örnekler | Ne yapar | X verisi | Öne çıkan güç | Öne çıkan zaaf | Fiyat düzeyi |
|---|---|---|---|---|---|---|
| **Kurumsal dinleme (tüketici istihbaratı)** | Brandwatch (Cision), Talkwalker (Hootsuite), Meltwater, Sprinklr Insights, Emplifi, NetBase Quid, Pulsar, Synthesio (Ipsos) | Çok kaynaklı arama, pano, duygu, görsel tanıma, uyarı, YZ asistanı | Brandwatch ve Talkwalker resmî ortak/firehose iddiası; Meltwater yeniden dağıtım hakkı; Sprinklr için X ortaklığı bulunamadı | Veri genişliği, geçmiş arşiv, olgun uyarı | Duygu isabeti, yerel dil, sözleşme katılığı, öğrenme eğrisi | Yıllık ~10 bin $ – 1 milyon $+ |
| **Orta segment dinleme** | YouScan, Brand24, Determ, Mention | Daha dar kaynak, kolay kullanım, sabit paketler | Sınırlı/belirsiz | Fiyat şeffaflığı (Brand24), görsel tanıma (YouScan) | Kapsam ve geçmiş derinliği, X erişimi belirsiz | Aylık ~200–1.500 $ |
| **Haber/medya izleme + tahmin** | Meltwater, Cision, NewsWhip, Signal AI, Fullintel | Lisanslı haber, basın, etkileşim tahmini, risk sinyali | Dolaylı | Ücretli/kapalı yayınlara lisanslı erişim; 24 saatlik etkileşim tahmini (NewsWhip) | Sosyal kapsamı sınırlı, tahminlerin bağımsız sınaması yok | Yıllık on binlerce $ (doğrulanamadı) |
| **Anlık olay tespiti** | Dataminr | Kamuya açık kaynaklardan dakikalar içinde olay uyarısı | X ortaklık verisine bağımlı olduğu söyleniyor [kısmen] | Hız, "ajan tabanlı doğrulama" | Güvenlik odaklı; marka iletişimi değil | Doğrulanamadı |
| **Anlatı ve dezenformasyon istihbaratı** | Blackbird.AI, Graphika, Cyabra, Alethea, PeakMetrics, Valent, NewsGuard; (Logically 2025'te iflas etti) | Anlatı kümeleme, koordinasyon/bot işareti, ağ haritası, sahte hesap, yanlış iddia veritabanı | Kendi toplama altyapıları; ayrıntı yok | Ağ analizi, analist raporları, güven dili | Yöntem kapalı, isabet beyanları bağımsız denetlenmemiş | Doğrulanamadı (özel teklif) |
| **Türkiye medya takip** | Ajans Press, Medya Takip Merkezi (MTM), Interpress; BoomSonar, Ipsos Türkiye (Synthesio) | Basılı/TV/radyo/internet + sosyal izleme, Türkçe analist hizmeti | Belirsiz | Yerel basın/TV arşivi, insan analist, Türkçe | Türkçe okuma isabeti yayımlanmamış; sosyal kapsamın kaynağı belirsiz | Doğrulanamadı |

---

## 3. Yaklaşım bazında en iyi uygulamalar

### 3.1 Veri kapsamı

**X verisi nasıl alınıyor**
- Brandwatch "Resmî X Ortağı" olduğunu, bütün X veri ürünlerine, tam akışa ve geçmiş gönderilere eriştiğini
  söylüyor. [doğrulandı: https://www.brandwatch.com/datanetworks/x/ (satıcı iddiası)]
- Talkwalker, resmî ortak olarak tam akışa eriştiğini ve 5 yıla kadar geçmiş veri sunduğunu söylemişti; ancak bu
  beyan Ocak 2024 tarihli, Hootsuite satın alımından önce. [kısmen: https://talkwalker.com/blog/twitter-x-social-listening]
  5 Aralık 2025'te "X API bağlantısındaki sorun Hootsuite Listening ve Talkwalker'da veri toplamayı etkiliyor"
  diye bir arıza kaydı var; aynı gün çözülmüş. [doğrulandı: https://isdown.app/status/hootsuite-inc/incidents/485103-x-data-acquisition-issues-in-talkwalker]
- Meltwater Ekim 2024'te X'ten **içeriği onaylı müşterilerine yeniden dağıtma (resyndication) hakkı** aldığını,
  müşterilerin X tam metnini Meltwater API'si üzerinden kullanabildiğini duyurdu; bu bir firehose lisansı olarak
  tarif edilmiyor. [doğrulandı: https://www.meltwater.com/en/press-releases/meltwater-expands-partnership-with-x-gaining-resyndication-rights (satıcı iddiası)]
- Sprinklr için 2025'te X veri ortaklığı haberi bulunamadı; Reddit (2024) ve Bluesky (Şubat 2025) entegrasyonları
  var. [doğrulandı: https://www.businesswire.com/news/home/20250213906433/en] — X tarafı [doğrulanamadı].
- X'in kendisi: kurumsal (Enterprise) katman tam akış, %1 ve %10 örneklem akışları sunuyor; fiyat yayımlanmıyor.
  Kullandıkça öde modelinde gönderi okuma başına ~0,005 $ ve ayda 3 milyon okuma tavanı var; üstü Enterprise.
  Enterprise için dolaşan "ayda 42 bin $+" rakamı ikincil kaynaklı. [kısmen: https://docs.x.com/x-api/getting-started/pricing ;
  https://www.blotato.com/blog/twitter-api-pricing] — ayrıntı Araştırma B'nin alanı.
- Bağımsız çerçeve: GWU (Eylül 2025) platformların veriyi "kapıda tuttuğunu", seçkin birkaç satıcıya özel erişim
  verdiğini; pazarın ayrıcalıklı erişim ve kazımanın karışımıyla işlediğini söylüyor.
  [doğrulandı: https://iddp.gwu.edu/node/5711 ; https://mediawell.ssrc.org/news-items/from-dashboard-to-data-acquisition-charting-the-social-media-monitoring-market/]
- Bir sektör raporu (Kasım 2025) bazı kurumların X'e bağımlılığı azaltmak istediğini not ediyor.
  [doğrulandı: https://thesilab.com/resource/how-to-do-social-listening-with-x-formerly-twitter]

**Diğer platformlar**
- Reddit: Brandwatch, Talkwalker, Meltwater, Sprinklr resmî Reddit Data API ortaklığıyla çalışıyor; Talkwalker
  ve Meltwater "tam Reddit akışı" iddiasında. [doğrulandı: https://martech.org/brandwatch-adds-reddit-mini-firehose-social-data ;
  https://www.meltwater.com/en/press-releases/meltwater-expands-partnership-with-reddit-providing-full-access-to-extended-firehose (satıcı)]
- Instagram: Meta belgesine göre bir işletme/içerik üretici hesabı adına 7 günde en çok 30 farklı etiket
  sorgulanabilir; yalnızca herkese açık gönderi; kişisel hesaplara erişilemez; Hikâye etiketleri desteklenmez;
  "Public Content Access" için uygulama incelemesi gerekir. Bir satıcı, üçüncü taraf araçların Instagram'da
  anahtar kelime ve @bahsetme izleyemediğini yazıyor.
  [doğrulandı: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search ;
  https://intercom.help/pulsar/pulsar-trac/faqs-instagram-hashtags]
- TikTok: ticari veri erişimi için API yok; bazı araçlar yalnızca markanın kendi TikTok işletme hesabı üzerinden
  çalışıyor. [kısmen: https://www.thesilab.com/resource/how-to-use-tiktok-for-social-listening (satıcı blogu)]
- Facebook: CrowdTangle'ın 2024'te kapatıldığı ve Meta Content Library'nin yalnızca araştırmacılara açık olduğu
  [doğrulanamadı (model bilgisi); bu oturumda aranmadı].
- Bluesky: Sprinklr, Pulsar, Meltwater ekledi. [doğrulandı: https://www.pulsarplatform.com/blog/2025/narratives-ai-new-features-bluesky-location-insights (satıcı)]
- Bölgesel platformlar: NDI'nin 100'ü aşkın aracı incelediği raporu, araçların çoğunun büyük platformlara odaklandığını,
  bölgesel olarak önemli platformların (Telegram, VK vb.) sıklıkla dışarıda kaldığını söylüyor.
  [doğrulandı: https://ndi.org/node/27079 (tarih doğrulanamadı)]

**En iyi uygulama:** Kapsam bir **sözleşme ve lisans sorusu**dur; aynı Boolean sorgu iki satıcıda farklı sonuç
verir çünkü altındaki veri farklıdır. Hiçbir satıcının "şu platformda şu oranda kapsıyoruz" diye ölçülmüş bir
kapsam beyanı yayımladığı görülmedi. [doğrulanamadı — bulunamadı]

### 3.2 Sorgu ve ilgililik

- **Boolean sorgu hâlâ temel.** Talkwalker'ın kendi rehberi eşsesli gürültüyü dışlama kalıbıyla anlatıyor
  ("Apple NOT (fruit OR pie OR recipe)"). [doğrulandı: https://www.talkwalker.com/blog/boolean-operators]
- **Yapay zekâ ile sorgu yazımı yaygınlaştı:** Brandwatch Iris "AI Query Writer" önerilen etiket, kelime ve
  subreddit'lerden Boolean kuruyor (Kasım 2025); Hootsuite "AI Query Builder"; Infegy "AI-Assist" doğal dili
  sorguya çeviriyor. [doğrulandı: https://www.cision.com/about/press-releases/2025-press-releases/brandwatch-strengthens-ai-leadership-with-deeper-insights-and-expanded-data-coverage-302621990/ ;
  https://www.hootsuite.com/whats-new/ai-query-builder-in-listening-quick-search (satıcı)]
- **İki okul:** (a) "düz dille neyin ilgili olduğunu anlat, model karar versin"; (b) "model Boolean yazsın, sen
  mantığı gör ve düzelt". Brandwatch (b)'yi savunuyor: tek tek sonuç denetlemek yerine ilgililiği yöneten mantığı
  denetleyebilirsiniz. [doğrulandı: https://www.brandwatch.com/?p=192885 (satıcı görüşü)]
- **İlgililik süzgeci ayrı bir katman olarak:** Sprinklr "AI Topics" Boolean'ın niyetini yorumlayıp alakasız payı
  ~%50'den %10'un altına indirdiğini; Syncly anahtar kelime listesi + düz dille ilgililik tarifiyle gönderileri
  "tut/gürültü" diye etiketlediğini söylüyor. [doğrulandı: https://www.sprinklr.com/help/articles/sprinklr-ai/ai-topics/6a01b25e5821af6a70b77c60 ;
  https://syncly.app/social/feature/smart-query (satıcı iddiaları)]
- **Kullanıcı tarafı:** Meltwater yorumlarında "aynı adı taşıyan başka markaları ayıklamak zor, Boolean gerekiyor",
  "alakasız sonuçlar ek süzme gerektiriyor" şikâyetleri var. [doğrulandı: https://www.trustradius.com/reviews/meltwater-media-intelligence-platform-2020-09-28-11-13-43 ;
  https://aws.amazon.com/marketplace/reviews/reviews-list/prodview-fhgmfs4qbt4vw?page=32 (anekdot)]

**En iyi uygulama:** Geniş (duyarlılığı yüksek) sorgu → ayrı, ölçülen bir ilgililik sınıflandırıcısı → mantığı
insan tarafından okunabilir kalan sorgu. Satıcıların hiçbiri ilgililik sınıflandırıcısının kesinlik/duyarlılık
ölçümünü müşteriye düzenli raporlamıyor (bulunamadı).

### 3.3 Dil anlama (duygu, duruş, alay)

- Hakemli çalışma (Jung, Salminen, Jansen 2022): dört büyük ticari duygu aracı (Azure, IBM, Google, AWS) aynı
  içeriğe sıklıkla farklı etiket veriyor; "araç seçimi elde edilen duygu etiketini değiştirir".
  [doğrulandı: https://osuva.uwasa.fi/handle/11111/2709 ; https://acua.qcri.org/blog/engineers-aware-commercial-tools-disagree-on-social-media-sentiment/]
- Syncly'nin 16 satıcının sayfasını 14 Ekim 2026'da tarayan incelemesi: 8'i doğruluk rakamı yayımlıyor, hiçbiri
  bağımsız denetimle eşleşmiyor; insan etiketine karşı güncel bağımsız karşılaştırma yok. Ayrıca nötr gönderi
  çoğunluktayken düz "doğruluk" yanıltıcıdır. [doğrulandı: https://syncly.app/blog/ai-sentiment-analysis-accuracy-what-vendors-disclose-%282026%29 (rakip satıcının yayını)]
- Eski bir danışmanlık testi (FreshMinds): marka bahsetmelerinde gönderi düzeyinde ortalama ~%30 doğru, toplu
  düzeyde %60–80. [kısmen: https://www.research-live.com/article/news/automated-sentiment-analysis-gives-poor-showing-in-accuracy-test/id/4002844 — tarihsiz/eski]
- Kullanıcı sesi: Brandwatch yorumcusu "duygu analizi pek isabetli değil; dürüst olmak gerekirse hiçbir platformun
  değil"; Meltwater yorumcusu "yerel dili, lehçeyi işleyemiyor, alayı ayırt edemiyor"; NetBase Quid için
  "özellikle duygu analizinde tutarsız veri doğruluğu". [doğrulandı: https://www.g2.com/compare/brandwatch-consumer-intelligence ;
  https://nl-be.trustpilot.com/review/meltwater.com ; https://www.softwareadvice.com/public-relations/netbase-profile/ (anekdot)]
- Türkçe (araştırma, ürün değil): 2026 tarihli bir çalışmada üç sınıflı Türkçe duyguda ince ayarlı BERTurk %83,7,
  en iyi genel açık model (Qwen3 32B) %77,3 doğruluk; veri yorum metni, tweet değil.
  [doğrulandı: https://arxiv.org/pdf/2606.29614] Ekşi Sözlük girdilerinden kurulan SarcasTürk alay kümesinde en iyi
  model %76. [doğrulandı: https://aclanthology.org/2026.sigturk-1.6] Ayrıntı Araştırma C'nin alanı.

**En iyi uygulama:** Pazarda yok. Satıcılar duygu üretiyor ama sınıf bazında, dil bazında, müşteri verisinde
ölçülmüş başarı sunmuyor. Alıcı rehberleri bile "kendi etiketli verinizde kesinlik/duyarlılık/F1 isteyin" diyor.
[doğrulandı: https://www.clootrack.com/knowledge/customer-feedback-analysis/ai-customer-feedback-analysis]

### 3.4 Çoklu ortam (görsel, video, ses)

- X üzerinde yayımlanan bir vaka (Publicis + YouScan, 2022 verisi): spor markalarının bahsetmelerinin ~%22'sinde
  marka adı ya da etiketi yoktu, yalnızca logo vardı. [doğrulandı: https://docs.x.com/success-stories/publicis-youscan (X ve satıcı yayını)]
  Bu, N1'deki "metinsiz görsel kaçar" riskinin büyüklüğüne dair bulabildiğimiz tek sayısal işaret.
- YouScan logo/nesne/sahne tanıma ile "%80 daha fazla bahsetme" iddia ediyor. [doğrulandı: https://youscan.io/visual-insights/ (satıcı iddiası)]
- Talkwalker görsel, video ve konuşmada marka tespiti iddia ediyor; TikTok/Reels/Shorts derinliği belirsiz.
  [doğrulandı: https://www.talkwalker.com/speech-analytics (satıcı)] [kısmen: https://syncly.app/blog/top-video-social-listening-tools (rakip)]
- Brandwatch 2026 yol haritasında "daha akıllı video ve görsel analizi" var — yani Kasım 2025 itibarıyla eksik
  saydığı bir alan. [doğrulandı: Cision basın bülteni, yukarıda]
- Bağımsız sayılabilecek tek gözlem (bilimsel olmadığını kendisi söylüyor): video dinleme araçları bol meta veri
  üretiyor ama içgörüyü insan çıkarıyor. [kısmen: https://www.thesilab.com/resource/what-video-listening-tools-still-cant-see]

### 3.5 Anlatı tespiti

- Pulsar "Narratives AI" (Mart 2025): gerçek zamanlı ve geçmiş gönderi ve haberleri kümeleyip dizinliyor; anlatının
  ivmesini ve kimin sürüklediğini gösterdiğini söylüyor; sonradan konum süzgeci ve "Narrative Spotlight" eklendi.
  [doğrulandı: https://www.newswire.com/news/pulsar-launches-narratives-ai-the-first-search-engine-for-public-22544847 (satıcı)]
- Blackbird.AI "Narrative Feed": anlatıları "Narrative Risk Score" ile sıralıyor; puan "yüzlerce risk sinyali"nden,
  müşteri profiline göre ayarlanabilir; risk endeksi toksiklik, kutuplaşma, "otomatik ağ etkinliği", nefret söylemi,
  manipülasyon gibi bileşenler içeriyor. Ağırlık ve eşikleri açıklayan teknik belge bulunamadı.
  [doğrulandı: https://www.datanami.com/this-just-in/blackbird-ai-unveils-rav3n-risk-llm-elevating-fight-against-misinformation ;
  https://blackbird.ai/wp-content/uploads/2024/04/BlackbirdAI-1.pdf (satıcı)]
- Graphika: hesap → topluluk → anlatı bağlantılarını ağ analiziyle haritalıyor; ATLAS platformu 12'den fazla
  platformu tek normalize görünümde topluyor. [doğrulandı: https://www.graphika.com/how-it-works (satıcı)]
- Gartner (Aralık 2025) Blackbird'ü "dezenformasyon anlatı istihbaratında yenilmesi gereken şirket" diye
  nitelemiş. [kısmen: başlık arama sonucunda görüldü, rapor okunmadı]

**En iyi uygulama:** Anlatı = anlamsal kümeleme + zaman içinde ivme + aktör ağı. Ancak hiçbir satıcı küme
kararlılığını (aynı konu iki kümeye bölünüyor mu, P4) ya da adlandırmanın güncellenmesini (P14) nasıl ölçtüğünü
yayımlamıyor. [doğrulanamadı — bulunamadı]

### 3.6 Koordinasyon ve sahte hesap tespiti

- İşaretler: Alethea "toplu açılmış hesaplar, birebir aynı açıklamalar, anormal etkileşim, platformlar arası
  yayılım"; PeakMetrics "zaman içindeki davranış + eşzamanlı hareket eden hesap kümelerinin ağ haritası";
  Valent "zamanlama: koordineli anlatılar günlerce, haftalarca uykuda bekler"; Cyabra "500'den fazla davranış ve
  bağlam parametresi". [doğrulandı: https://alethea.com/insights/inside-a-coordinated-ai-generated-propaganda-campaign-on-tiktok ;
  https://www.peakmetrics.com/insights/enterprise-social-media-bot-detection-software-guide ;
  https://valentspotreportone.edgeone.app/ ; https://cyabra.com/?p=18282 (hepsi satıcı)]
- İsabet beyanları: Cyabra "%90 üzeri" — bağımsız denetim bulunamadı. Marka vakaları da satıcı yayını (ör. Target
  tartışmasında "600'den fazla sahte profil", Uber boykotunda "profillerin %29'u sahte"). [doğrulandı: satıcı iddiası]
- Akademik uyarılar:
  - Yanlış pozitiflerin ana kaynağı, meşru toplulukların eşgüdümlü etkinliğinin devlet bağlantılı faaliyet sanılması
    ve gerçek dünya olaylarına toplu tepki. [doğrulandı: https://arxiv.org/pdf/2005.13466]
  - Benzerlik eşikleri çoğu zaman keyfî; taban hareketlerinin örgütlü davranışından ayırmak zor. [doğrulandı: aynı arama, 2022 ara seçim çalışması]
  - "Kontrol grubu" tasarımı: şüpheli hesaplar aynı konuyu konuşan doğal kullanıcılarla kıyaslandığında iddia
    edilen devletler arası koordinasyonun kanıtı kalmadı. [doğrulandı: https://arxiv.org/html/2502.17344v1]
  - Bot sınıflandırıcıların ayrılmış test verisindeki başarısı gerçek dünya başarısının yalnızca vekilidir.
    [doğrulandı: https://arxiv.org/pdf/2303.17251v4]
- Pazar bağlamı: Marketing Brew (13 Kasım 2025) "botlar sosyal dinlemeyi bitirecek mi?" diye soruyor; Axios
  (Eylül 2024) botlar yüzünden sosyal sohbetin kamuoyu göstergesi olarak değer yitirdiğini yazmıştı.
  [doğrulandı: https://www.marketingbrew.com/stories/2025/11/13/will-bots-end-social-listening-as-we-know-it ;
  https://www.axios.com/2024/09/05/social-media-bot-engagement-communication]

**Güven dili — en iyi örnekler**
- Graphika: "orta derecede güvenle değerlendiriyoruz" + gerekçe; "içerik paylaşımı tek başına asla güçlü bir atıf
  işareti değildir". [doğrulandı: https://www.graphika.com/reports/posing-as-patriots]
- Microsoft MTAC atıf modeli NATO StratCom COE (Pamment & Smith 2022) çerçevesine dayanıyor: "orta güven =
  güvenilir kaynaklı ve makul bilgi, ama yeterli nitelik ya da teyit yok". [doğrulandı: https://blogs.microsoft.com/wp-content/uploads/prod/sites/5/2024/07/MTAC-Attribution-Model-for-Influence.pdf]
- NewsGuard Temmuz 2025'te "misinformation/disinformation" etiketlerini bıraktı; iddia ancak kanıtlanabilir biçimde
  yanlışsa ve birkaç editör katmanından geçtiyse veritabanına giriyor, arada "inceleniyor" etiketi taşıyor.
  [doğrulandı: https://www.niemanlab.org/2025/07/language-that-once-clarified-is-now-obscuring-newsguard-retires-the-labels-misinformation-and-disinformation/ ;
  https://www.newsguardtech.com/ratings/false-claim-fingerprints-process/]

### 3.7 Uyarı ve kriz tespiti

- Sprinklr "Smart Alerts": model gelecekteki hareketi tahmin ediyor, tahminden sapmayı anomali sayıyor; e-posta ve
  mobil bildirim. McDonald's vakasında hız, hacim ve olumsuz duygu uyarıları dört dilde 450 uyarıya çıkmış.
  [doğrulandı: https://www.sprinklr.com/help/articles/introduction-to-smart-alerts/identify-crisis-events-proactively-with-smart-alerts/640704d97517d84a3aaf2c91/ ;
  https://www.casestudies.com/company/sprinklr/case-study/how-mcdonalds-uses-sprinklr-smart-alerts-for-crisis-management-and-research (satıcı)]
- Emplifi: "Spike Alerts" olağan hacmi öğreniyor; kriz ajanı ciddiyeti puanlıyor, önceden onaylı sınırlar içinde
  planlı paylaşımları durdurup nöbetçi ekibi uyarıyor; kamuya açık yanıt insan onayı gerektiriyor; "tam otomatik /
  YZ taslak + insan onayı / insan yönetiminde" üç kademe. [doğrulandı: https://emplifi.io/resources/blog/crisis-management-guide/ (satıcı)]
- Talkwalker/Hootsuite: hacim, erişim ya da etkileşimde olağandışı sıçramaları otomatik işaretleme; Blue Silk ile
  konu hacmi tahmini. [doğrulandı: https://hootsuite.com/platform/crisis-management (satıcı)]
- NewsWhip: makale ve gönderilerin etkileşimini 24 saat ileriye tahmin ediyor; 2019'dan beri "tahmine dayalı uyarı".
  [doğrulandı: https://www.newswhip.com/newswhip-spike/ (satıcı)]
- Dataminr: "ajan tabanlı teyit" ve "yakın vadeli tahmin" (kurumsal güvenlik ürünü). [doğrulandı: https://www.hpcwire.com/bigdatawire/this-just-in/dataminr-advanced-for-corporate-security-brings-autonomous-real-time-intelligence-to-the-enterprise/ (satıcı)]

**Boşluk:** Hiçbir satıcıda "bu uyarı kuralı geçmişteki şu olayda tetiklenir miydi?" sınaması ya da uyarının
kaçırma/yanlış alarm oranının raporlanması görülmedi. [doğrulanamadı — bulunamadı] Tahminlerin (NewsWhip,
Blue Silk) bağımsız sınaması da yok.

### 3.8 Yapay zekâ asistanları ve ajanlar

| Ürün | Ne yapıyor | Dayanak gösterme |
|---|---|---|
| Meltwater **Mira** (Mayıs 2025) | "Ajan tabanlı ekip arkadaşı"; günlük milyarı aşkın haber/sosyal içerik üzerinde | Yanıtlar özgün içeriğe bağlanan atıflarla [doğrulandı: https://www.meltwater.com/en/press-releases/meltwater-unveils-mira-latest-ai-innovations-in-2025 (satıcı)] |
| Brandwatch **Iris AI / Ask Iris** (Kasım 2025) | Doğal dille soru, sorgu yazıcı, çeviri, sektör kıyası; 2026'da "kendi verini getir" | Sorgu Boolean olarak görünür, düzenlenebilir [doğrulandı: Cision bülteni] |
| Hootsuite **Yeti Agent** | Karmaşık soruya "tam atıflı" yanıt | Atıflı [doğrulandı: https://hootsuite.com/platform/ai (satıcı; çıkış tarihi bilinmiyor)] |
| YouScan **Insights Copilot** (2023) | Dinleme verisi üzerinde sohbet | Doğrulanamadı [doğrulandı: https://en.wikipedia.org/wiki/YouScan] |
| Pulsar **Saga** | "Otonom araştırma ajanı" | Doğrulanamadı [kısmen] |
| Blackbird **RAV3N** | Anlatı istihbaratı ajanı; RAV3N Watch gömülü analist hizmeti (Nisan 2025) | Doğrulanamadı [kısmen: https://blackbird.ai/blog/blackbird-ai-rav3n-recon-constellation-api/] |
| Signal AI **AIQ** | İzlenen külliyat üzerinde soru yanıtlama | Doğrulanamadı [kısmen] |

**En iyi uygulama:** (1) Her yanıt özgün içeriğe bağlanır; (2) ajanın kurduğu sorgu insanın göreceği biçimde
kalır; (3) ajan eylemleri önceden onaylanmış sınırlar içinde kalır, kamuya açık her şey insan onayından geçer.
**Boşluk:** Satıcıların hiçbiri asistanın yanıt isabetini, "veride yok" ile "örneklemde/özette yok" ayrımını ya da
gönderi içine gömülü talimatlara (K6) karşı önlemini yayımlamıyor. [doğrulanamadı — bulunamadı]

### 3.9 İnsan + makine (hibrit) modeller

- Signal AI: iletişim, risk ve PR geçmişli "gömülü analistler" her çıktıyı her aşamada iyileştiriyor (satıcı
  iddiası); Eylül 2025'te 165 milyon $ yatırım aldı; 2024'te itibar izleme firması Social 360'ı satın aldı.
  [doğrulandı: https://fintech.global/2025/09/24/risk-and-reputation-firm-signal-ai-bags-165m-funding-round/]
- Fullintel: "24/7 durum izleme" — yapay zekâ + uzman insan analizi; ajanslara bir saat içinde konu uyarısı.
  [doğrulandı: https://fullintel.com/by-need/pr-agencies/ (satıcı)]
- Resolver: yapay zekâyı analistle birleştiren tam yönetilen çevrimiçi risk istihbaratı hizmeti.
  [doğrulandı: https://resolver.com/brand-reputation-protection/ (satıcı)]
- NewsGuard: iddia veritabanına giriş çok katmanlı editör incelemesine bağlı (yukarıda).
- Ajans Press: "yapay zekâ analizi hızlandırıyor, insan uzmanlığı veriyi doğru bağlama oturtuyor" (şirket beyanı).
  [doğrulandı: https://www.foreks.com/haber/detay/6abe1ae1f3c5b95d82f8e8bd/FRKS/tr/ajans-press-medya-takibini-yapay-zeka-destekli-analiz-dijital-itibar-yonetimi-ve-stratejik-karar-destek-teknolojileriyle-bulusturuyor-01-10-26/]
- Ipsos Türkiye: Synthesio platformu üzerinde sosyal dinleme ve metin analitiği ekipleri; "komuta merkezi" ürünü
  (Beam). [doğrulandı: https://www.ipsos.com/tr-tr/node/534691]
- NewsWhip kriz panosu sayfasında Ketchum (PR ajansı) temsilcisi müşteriye daha hızlı danışmanlık verdiklerini
  söylüyor. [doğrulandı: https://www.newswhip.com/crisis-management-dashboard/ (satıcı)]
- Büyük PR ajanslarının (Edelman, Weber Shandwick vb.) kriz masalarının iç işleyişi: [doğrulanamadı — arama sonuç
  vermedi, kota bitti]. Bir ajans yazısı 7/24 hızlı müdahaleyi üst düzey kriz firmaları için "temel beklenti"
  sayıyor. [doğrulandı: https://www.5wpr.com/new/real-time-reputation-monitoring-in-the-era-of-intense-scrutiny/]

**Örüntü:** Makine tarar, sıralar, taslak çıkarır; insan analist (a) ilgililiği ve bağlamı onaylar, (b) atıf ve
koordinasyon gibi suçlayıcı okunabilecek bulguları süzer, (c) danışana gidecek dili yazar. Bu, bizim
`01-GEREKSINIM-MEVCUT.md`'deki "kritik çıkarımlarda son söz insan analist" ilkesiyle örtüşüyor.

---

## 4. Ölçülen doğruluk: ne biliniyor, ne bilinmiyor

| Konu | Bağımsız kanıt | Durum |
|---|---|---|
| Aynı sorgunun satıcılar arasında kapsam farkı | Publicis SMI biriminin 5 satıcıyı (Talkwalker, YouScan, NetBase, Sysomos, Crimson Hexagon) veri hacmi ve duygu üzerinden kıyaslayan resmî olmayan çalışması var; rakamlar görülemedi. Brandwatch/Talkwalker/Meltwater için bağımsız karşılaştırma bulunamadı. | [kısmen: https://www.thesilab.com/resource/social-listening-head-to-head-comparing-data-volumes-and-sentiment-analysis-across-vendors-free-download] |
| Duygu isabeti | Ticari araçlar birbirinden farklı etiketliyor (hakemli); satıcı beyanları bağımsız denetlenmemiş; eski bir testte gönderi düzeyinde ~%30 | [doğrulandı, bkz. 3.3] |
| Türkçe | Ürün düzeyinde ölçüm yok; araştırmada ince ayarlı Türkçe modeller önde | [doğrulandı: arXiv/ACL, bkz. 3.3] |
| Koordinasyon/bot | Satıcı beyanları denetlenmemiş; akademide yanlış pozitif riski iyi belgelenmiş | [doğrulandı, bkz. 3.6] |
| Uyarı/tahmin | Bağımsız ölçüm bulunamadı | [doğrulanamadı] |
| Analist pazar değerlendirmeleri | Gartner MQ 2026 (Sosyal Medya Yönetimi ve Dinleme, 6 Temmuz 2026): Liderler Sprinklr ve Emplifi; Vizyonerler Hootsuite (Talkwalker dahil) ve Sprout Social; Niş oyuncular Brandwatch ve Oktopost. Forrester'ın son ayrı dinleme değerlendirmesi 2020; 2024 "Social Suites"te Emplifi lider, Brandwatch güçlü oyuncu. Bu değerlendirmeler yetenek ve vizyonu ölçer, veri isabetini değil. | [doğrulandı: https://www.cxtoday.com/community-social-engagement/gartner-magic-quadrant-for-social-media-management-and-listening-2026-the-rundown/ ; https://businesswire.com/news/home/20241121640904/en] |

**Kullanıcı yorumlarında tekrar eden eleştiriler** (G2, Capterra, TrustRadius, Trustpilot; anekdot düzeyinde):
- **Kaçırılan içerik:** Talkwalker için "izlemem gereken her parçayı yakalamıyor, tek tek sitelere bakmam
  gerekiyor"; G2 özeti "kapsam boşluklarından doğan veri yanlışlıkları". [doğrulandı: https://g2.com/products/talkwalker-by-hootsuite/reviews]
- **Alakasız sonuç:** Meltwater için aynı adlı markaları ayıklama güçlüğü (yukarıda).
- **Duygu hatası ve yerel dil:** Meltwater, Brandwatch, NetBase Quid (yukarıda). CisionOne için G2'de "veri
  yanlışlığı" en sık eleştiri (37 yorum). [doğrulandı: https://g2.com/compare/brand24-vs-onclusive-vs-cisionone-vs-brandwatch-consumer-intelligence]
- **Geçmiş derinliği:** Talkwalker'ın bazı paketlerinde yalnızca son 30 gün. [doğrulandı: G2, yukarıda]
- **Sözleşme:** Meltwater'da otomatik yenileme, imzalanan sözleşmenin üstüne geçen çevrimiçi koşullar, bildirimsiz
  özellik kaldırma şikâyetleri; G2 puanı 4,1/5 (2.655 yorum), Trustpilot 1,5/5 (17 yorum).
  [doğrulandı: https://www.g2.com/products/meltwater/reviews ; https://nl-be.trustpilot.com/review/meltwater.com]
- **Öğrenme eğrisi:** Brandwatch ve Talkwalker'da en sık eleştirilerden. [doğrulandı: G2 karşılaştırma sayfaları]
- Türkçe zayıflığına özgü G2/Capterra yorumu: [doğrulanamadı — bulunamadı].

---

## 5. Tekrar eden zayıflıklar ve pazardaki boşluklar

1. **Kapsam beyanı yok.** "Hangi platformun yüzde kaçını görüyoruz, neyi göremiyoruz" ölçülüp gösterilmiyor;
   kör noktalar (Instagram kişisel hesaplar, TikTok, WhatsApp, kapalı gruplar, TV) kullanıcıya açıkça sunulmuyor.
2. **İsabet ölçümü yok.** İlgililik, duygu, anlatı, koordinasyon için müşterinin kendi verisinde, dil ve sınıf
   bazında ölçülmüş başarı raporlayan satıcı bulunamadı. Bağımsız kıyaslama da yok.
3. **Yerel dil ikinci sınıf.** Kullanıcılar yerel dil, lehçe ve alayda hatayı tekrar tekrar bildiriyor; Türkçe için
   ürün düzeyinde yayımlanmış ölçüm yok.
4. **Yöntem kara kutu.** Risk puanları ve bot/koordinasyon kararları "yüzlerce sinyal" diye anlatılıyor; ağırlık,
   eşik, yanlış pozitif oranı yayımlanmıyor. Suçlayıcı okunabilecek bulgu için bu kabul edilemez (P12).
5. **Uyarılar sınanmıyor.** Geçmiş olaylarda geri sınama, uyarı yorgunluğu (450 uyarılı vaka) ve sessiz kaçırma
   ölçümü görülmüyor (K5).
6. **YZ asistanları atıf veriyor ama isabet ölçmüyor;** gönderi içi talimat (prompt injection) riskinden söz eden
   satıcı bulunamadı (K6).
7. **Bot/YZ içeriği veriyi kirletiyor;** sektör bunu 2025'te yüksek sesle tartışmaya başladı, ama hacim
   sayılarından otomatik içeriği ayıran ölçülmüş bir standart yok.
8. **Platform bağımlılığı ve satıcı riski.** Logically, TikTok ve Meta sözleşmelerini kaybedince Temmuz 2025'te
   kayyuma girdi, varlıkları satıldı; Talkwalker Aralık 2025'te X bağlantı arızası yaşadı; Hootsuite Talkwalker'ı
   2024'te aldı. [doğrulandı: https://www.uktech.news/ai/ai-fact-checker-logically-sold-off-in-administration-deal-20250707 ;
   https://www.hootsuite.com/platform/listening]
9. **Neden-sonuç dili gevşek.** "Driving", "amplifying" ("sürükleyen", "büyüten") sözcükleri satıcı arayüzlerinde
   yaygın; Graphika ve NewsGuard dışında temkinli dil örneği az (ortak sınır 7).
10. **Sözleşme katılığı ve fiyat opaklığı.** Brand24 dışında fiyatlar yayımlanmıyor; çok yıllı, otomatik yenilenen
    sözleşmeler yaygın.

---

## 6. Türkiye'ye özgü durum

**Oyuncular**
- Akademik bir çalışma (Özçağlayan & Yeniceler Kortak, 2023, TOJDAC 13(3)) Türkiye'de üç medya takip şirketi
  sayıyor: Ajans Press, Medya Takip Merkezi, Interpress; odak grup yöntemiyle üçünün de işleyişinin yapay zekâ
  temelli olduğunu bildiriyor. [doğrulandı: https://dergipark.org.tr/en/download/article-file/3052124]
- **Ajans Press:** basından TV'ye, radyodan sosyal medyaya izleme; "Newscope" 197 ülke, 152 milyonu aşkın haber
  kaynağı ve 41 sosyal platform izlediğini söylüyor; "Next Vision" "ne oldu"nun yanında "ne yapılmalı" sorusuna
  yanıt vermeyi hedefliyor; "Reputation Pro" kullanıcı yorumlarını analiz ediyor (şirket beyanları, 2026).
  [doğrulandı: https://medyascope.tv/2026/06/16/atif-unaldi-ile-netizen-398-medya-takibinde-yapay-zeka-donemi-tolga-topcu-anlatti/ ;
  https://www.haberkenti.com/ajans-press-70-yillik-tecrubesini-yapay-zeka-ile-guclendiriyor]
  41 platformun hangileri olduğu [doğrulanamadı].
- **Medya Takip Merkezi (MTM):** 2011'de küresel sosyal medya takibi, 2018'de YouTube, 2023'te podcast izleme;
  süreçlerine GPT teknolojisini entegre ettiğini söylüyor. [doğrulandı: https://www.marketingturkiye.com.tr/?p=163989 (şirket beyanı)]
- **Interpress:** yapay zekâ destekli sunucu altyapısına 9 milyon TL yatırım; "Türkiye'nin en büyük dijital basın
  arşivi". [doğrulandı: https://www.dha.com.tr/teknoloji/interpress-9-milyon-tllik-yatirimla-yapay-zeka-destekli-sunucu-altyapisini-guclendirdi-2893432 (şirket beyanı)]
- **BoomSonar:** kendini "Türkiye'nin ilk ve en kapsamlı web ve sosyal medya izleme programı" diye tanıtıyor;
  fiyat, kaynak listesi, Türkçe duygu başarısı bulunamadı. [kısmen: https://www.thesilab.com/vendor-directory/boomsonar]
- **Ipsos Türkiye (Synthesio):** sosyal dinleme ve metin analitiği ekipleri; kurumsal araştırma odaklı.
  [doğrulandı, yukarıda]
- **PRNet:** Türkiye'de medya takip hizmetine dair kaynak bulunamadı. [doğrulanamadı]
- Diğer: SocialMonitoring.net (2014'te kurulmuş yerli platform) [kısmen: https://webrazzi.com/2017/05/29/socialmonitoring-sosyal-medya-izleme/].

**Yerel kaynaklar**
- Ekşi Sözlük ve Şikâyetvar kurumların sosyal medya ekiplerince fiilen izleniyor (ör. Yemeksepeti iç belgesi).
  [doğrulandı: https://backofficeyemeksepeti.knowledgeowl.com/help/pdfexport/id/63f758ce43afcc2f4e4aa415]
  Küresel ya da yerli bir aracın bu iki kaynağı **lisanslı** biçimde kapsadığı [doğrulanamadı]. Erişim yolu
  Araştırma B'ye bırakıldı.
- Ekşi Sözlük, Türkçe alay araştırmalarında veri kaynağı olarak kullanılıyor (SarcasTürk) — alayın bu platformda
  yoğun olduğuna dair dolaylı işaret. [doğrulandı: https://aclanthology.org/2026.sigturk-1.6]
- Next Sosyal: 2025'te bir savunma sanayi şirketi ve bir vakıfça kurulan yerli sosyal ağ; izleme kapsamına
  alınıp alınmayacağı izlenmeli. [doğrulandı: https://turkishminute.com/2025/07/23/turkish-defense-contractor-govt-backed-foundation-launch-social-media-platform-with-integrated-ai/amp/]

**Erişim engelleri ve görünürlük**
- 19 Mart – 12 Nisan 2025 arasında X'te Türkiye'de erişime kapatılan en az 471 hesap (İFÖD EngelliWeb); X, 700'ü
  aşkın hesap için kararlara itiraz ettiğini açıkladı; İmamoğlu'nun hesabı Mayıs 2025'te "TR'de yasal talep üzerine
  kısıtlandı". İçişleri Bakanı 2025'in ilk dört ayında bütün platformlarda 27.304 hesabın engellendiğini söyledi.
  CPJ (2026), X'in kararların en az %90'ına coğrafi engelleme ile uyduğunu bildiriyor.
  [doğrulandı: https://thenextweb.com/news/x-blocks-accounts-turkey-fund-crisis ;
  https://globalvoices.org/2025/05/09/digital-censorship-and-political-repression-the-blocking-of-the-x-account-of-istanbuls-jailed-mayor/ ;
  https://cpj.org/wp-content/uploads/2026/10/The-Escalation-of-Internet-Censorship-in-Turkiye-3.pdf]
- **Çıkarım (doğrulanmadı):** Coğrafi engelleme olduğu için Türkiye'deki bir kullanıcının gördüğü ile API üzerinden
  küresel akışın verdiği farklı olabilir; engelli içeriğin API'de hangi işaretle geldiği Araştırma B'de kontrol
  edilmeli. Olay anlarında yaşanan bant daraltmaları hacimde "ilgi azaldı" gibi görünen düşüşler yaratabilir
  [doğrulanamadı (model bilgisi)].

**Türkiye'de TV/radyo/basılı izleme için lisans** (`01`'deki açık soru 6): üç takip şirketinin bu hizmeti verdiği
doğrulandı; içeriğin telif/lisans çerçevesi ve verinin üçüncü bir sisteme (bizim sistemimize, bir YZ sağlayıcısına)
aktarılabilirliği [doğrulanamadı]. Satın alma görüşmesinde ilk sorulacak konu budur.

---

## 7. Fiyat düzeyleri (yaklaşık)

| Ürün | Düzey | Etiket |
|---|---|---|
| Brand24 | Bireysel 199 $/ay (2 bin bahsetme), Ekip 299 $ (10 bin), İşletme 599 $ (100 bin), Kurumsal 1.499 $/ay'dan (yıllık faturada) | [doğrulandı: https://brand24.com/pricing/ — sayfa ile belge arasında küçük çelişki] |
| YouScan | En sık bildirilen ~499 $/ay (yıllık); sınırsız paketler ~1.000 $/ay | [kısmen: https://www.capterra.com/p/173036/YouScan/pricing/] |
| Talkwalker | Yıllık ~9–13 bin $ başlangıç bildirimleri | [kısmen: https://archive.com/blog/talkwalker-pricing] |
| Meltwater | Vendr medyanı ~25,8 bin $/yıl (126 alım, ~5,4–57 bin $); gösterge başlangıçlar 10 / 25 / 130 bin $ | [kısmen: https://octolens.com/blog/meltwater-pricing] |
| Brandwatch | Vendr medyanı ~50 bin $/yıl (~19,5–81 bin $) | [kısmen: https://octolens.com/brandwatch-vs-meltwater-vs-talkwalker] |
| Sprinklr | Bütün ürünler için medyan ~129 bin $/yıl; Insights için 200 bin–1 milyon $+ tahmini | [kısmen: https://vendorbenchmark.com/vendors/sprinklr-pricing] |
| Pulsar | Yayımlanmış fiyat yok, yalnızca teklif | [doğrulandı: https://socialrails.com/blog/pulsar-pricing] |
| Blackbird, Graphika, Cyabra, Alethea, Signal AI | Yayımlanmış fiyat bulunamadı | [doğrulanamadı] |
| Ajans Press, MTM, Interpress, BoomSonar | Yayımlanmış fiyat bulunamadı | [doğrulanamadı] |
| X API | Kullandıkça öde: okuma başına ~0,005 $, ayda 3 milyon okuma tavanı; Enterprise yayımlanmıyor (ikincil kaynak: 42 bin $+/ay) | [kısmen, bkz. 3.1; Araştırma B] |

**Satın alınabilirlik:** Listelenen bütün ürünler kurumsal satışla alınabilir; hesap açmak gerekmeden demo
istenebilir. Pazarlıkta çok yıllı sözleşmelerde %10–35 indirim bildiriliyor [kısmen]. Kritik soru fiyat değil,
**sözleşmenin veriyi kendi sistemimize ve bir YZ sağlayıcısına aktarmaya izin verip vermediği** (Meltwater'ın X
yeniden dağıtım hakkı bu yüzden önemli) — Araştırma B ile birlikte sorulmalı.

---

## 8. Tasarıma çıkarımlar

Kodlar `ZAYIFLIKLAR.md`'dekilerdir (N = Nabız, P = Pusula, K = Kule, "Ortak-n" = ortak sınırlar).

**Veri ve kapsam**
- **N1, N3, P6, P7, Ortak-3 için:** X verisini çağrı başına çekmek yerine **lisanslı tam akış/arşiv erişimi olan bir
  satıcı** (Brandwatch ya da Talkwalker; X Enterprise doğrudan seçenek) ya da yeniden dağıtım hakkı olan bir satıcı
  (Meltwater) üzerinden almak değerlendirilmeli. Pazarın ayrıştığı yer burası. Satıcı seçmeden önce aynı geçmiş
  olay için **iki satıcıdan ve doğrudan X'ten örnek çekip kapsam farkını ölçün** — bağımsız kıyas yok, kendimiz yapmalıyız.
- **N4 için:** "İlk paylaşan" yalnızca geriye dönük arşiv aramasından sonra söylenmeli; dil Graphika gibi olmalı:
  "**topladığımız veride** gözlenen en erken gönderi". Satıcı arşivi (Brandwatch/Talkwalker beyanı: yıllar) bunu mümkün kılar.
- **Ortak-2 için:** Sistem bir **kör nokta haritası** göstermeli: Instagram (yalnızca işletme hesabı başına 30
  etiket/hafta), TikTok (ticari API yok), WhatsApp/Telegram grupları, TV. En pahalı satıcılar da bunları göremiyor;
  bunu açıkça yazmak bizi pazarın önüne koyar.
- **P15, Ortak-2 için:** Basılı/TV/radyo ve yerel haber erişimi için Türkiye'deki üç takip şirketinden biriyle
  (Ajans Press, MTM, Interpress) veri ortaklığı görüşülmeli; ilk soru, içeriğin kendi sistemimize ve bir YZ
  hizmetine aktarılabilirliği ve yayın kitlesi (tiraj/izlenme) verisinin gelip gelmediği.
- **Ortak-3 için:** Türkiye'de erişime kapatılan hesap/içerik ayrı işaretlenmeli ("TR'de görünmüyor"); danışanın
  kitlesinin görmediği içerik ile gördüğü ayrılmalı.
- **N1 için (görsel):** Metinsiz logo/görsel bahsetmeleri için görsel tanıma kanalı gerekli; tek nicel işaret
  (%22 yalnızca logo, satıcı-X vakası) bunun küçük bir pay olmadığını düşündürüyor. Payı kendi danışan verimizde ölçün.

**İlgililik ve dil**
- **N1, N5, K3 için:** Mimari "geniş sorgu → ayrı ilgililik sınıflandırıcısı → insanın okuyabildiği sorgu" olmalı.
  YZ sorguyu yazsa bile Brandwatch'taki gibi **Boolean görünür ve onaylanır** kalmalı (K3: yanlış sorgu sessizce
  çalışmasın). Satıcının kendi kabulü (Sprinklr: süzgeçsiz ~%50 alakasız) ilgililik adımının zorunlu olduğunu gösteriyor.
- **N2, P3, Ortak-4 için:** Hiçbir satıcının duygu/duruş okumasına Türkçe için güvenilemez — ölçülmüş değil.
  Satın alınan platformun duygu alanı **kullanılmamalı ya da yalnızca kendi Türkçe altın kümemizde ölçüldükten
  sonra** kullanılmalı. Alay ayrı bir sınıf olarak ölçülmeli (Ekşi Sözlük kaynaklı alay kümesi bir başlangıç olabilir).
- **P4, P14, N5 için:** Anlatı = anlamsal kümeleme + zaman içinde ivme + aktör ağı (Pulsar, Blackbird, Graphika
  ortak deseni). Kümelerin birleştirilmesi/yeniden adlandırılması insan analist düzeltmesine açık olmalı ve küme
  kararlılığı ölçülmeli — bunu yayımlayan satıcı yok.

**Koordinasyon ve güven dili**
- **P5, P12, Ortak-7 için:** Koordinasyon işareti en az üç bağımsız sinyalden kurulmalı (hesap açılış toplulukları,
  birebir/çok benzer metin, zamanlama, ağ kümesi) ve **aynı konuyu konuşan doğal kullanıcılardan oluşan kontrol
  grubuyla** kıyaslanmalı (akademideki yanlış pozitif dersine yanıt).
- **P5, P12, En tehlikeli beş-4 için:** Bulgular NATO/MTAC tarzı **güven basamaklarıyla** (düşük/orta/yüksek +
  gerekçe göstergeleri) sunulmalı; "yalnızca içerik paylaşımı atıf değildir" kuralı yazılı olmalı; danışana ya da
  kamuya isim içeren her koordinasyon bulgusu analist onayından geçmeli. NewsGuard örneği: "dezenformasyon" yerine
  tarif edici dil ("aynı metni 4 dakika içinde paylaşan 37 hesap").
- **P12 için:** Bot/sahte hesap oranı satıcıdan alınacaksa (Cyabra, Blackbird vb.) satıcının yanlış pozitif oranı ve
  test kümesi istenmeli; yoksa sonuç "satıcı değerlendirmesi" diye etiketlenmeli.

**Uyarı ve zaman**
- **P7, P9 için:** Taban, en az birkaç haftalık geçmişten **günün saati ve haftanın günü** etkisini öğrenen bir
  tahmin modeliyle kurulmalı; uyarı tahminden sapmadır (Sprinklr deseni). Lisanslı arşiv ilk gün sorununu çözer.
- **N2 için:** "Kriz mi viral an mı?" ayrımı salt hacimle değil, duruş hızı ve platformlar arası yayılımla yapılmalı
  (Emplifi'nin anlattığı yaklaşım) — duruş ölçümü güvenilir hale geldiğinde.
- **K5, En tehlikeli beş-3 için:** Her uyarı kuralı kurulurken **geçmiş olaylarda geri sınanmalı** ve kaçırma/yanlış
  alarm oranı gösterilmeli. Pazarda bunu yapan bulunamadı; farklılaştırıcı olur. Uyarı yorgunluğuna karşı (450 uyarılı
  vaka) uyarılar danışan bazında öncelik sırasıyla birleştirilmeli.
- **P8 için:** Etkileşim sayıları, tahmin araçlarının (NewsWhip) yaptığı gibi zaman içinde yeniden ölçülmeli; "en çok
  etkileşim alan" sıralaması ölçüm zamanıyla birlikte gösterilmeli.
- **P11 için:** Danışanın kendi hesapları "sahip olunan kanal" olarak ayrı tutulmalı (Emplifi'nin kaynak ayrımında
  "owned channels" ayrı) — yükseltici listesine girmemeli. [çıkarım]

**Yapay zekâ katmanı**
- **K2, K4 için:** Asistanın her cümlesi özgün içeriğe atıf vermeli (Mira, Yeti deseni) ve asistan özet yerine ham
  veriyi sorgulayabilmeli; "veride yok" ile "okunan örneklemde yok" ayrı söylenmeli. Atıf vermek tek başına isabeti
  kanıtlamaz; atıfların örneklemle denetimi (01'deki "sunum dürüstlüğü") ölçülmeli.
- **K6 için:** Gönderi içi talimata karşı önlem piyasada konuşulmuyor; bizim tasarımda zorunlu. Dış metin her zaman
  "veri" olarak işaretlenmeli; taslak ve not üreten adım araç kullanamamalı. (Araştırma C ile birlikte.)
- **P13 için:** Emplifi'nin üç kademesi benimsenmeli: kamuya giden her metin "YZ taslağı + insan onayı". Taslaktan önce
  iddia denetimi (NewsGuard/Blackbird Compass türü "iddia ↔ kaynak" eşleme) yapılmalı; Türkiye'de teyit
  kuruluşlarıyla (ör. Teyit, Doğruluk Payı) veri ilişkisi [doğrulanamadı] araştırılmalı.
- **K7 için:** Kullanıcı düzeltmeleri sınıflandırıcıya dönecekse (satıcıların "özel sınıflandırıcı" yaklaşımı),
  her düzeltme sürümlenmeli ve altın kümede önce/sonra ölçülmeli.
- **K9 için:** Bütün satıcılar ajanın yanında **sabit pano** tutuyor; biz de sabit sayımlar (hacim, taban, uyarı)
  için değişmeyen bir pano, açık uçlu sorular için asistan kullanmalıyız.

**İnsan ve işletme**
- **P5, P12, P13 için (ve 01'deki "insan yok" kök nedeni):** Hibrit model pazarın standardı (Signal AI, Fullintel,
  Resolver, Ajans Press, Blackbird RAV3N Watch). Seçenekler: (a) Türkiye'deki bir takip şirketinin analist hizmeti,
  (b) küresel bir yönetilen izleme hizmeti, (c) danışmanın kendi ekibinde nöbetçi analist. Gece/hafta sonu için
  7/24 sorumluluk tanımlanmalı (Nabız'ın "panel kapanınca durma" eksiği).
- **Ortak-5, P2, K8 için:** Pazarda da "doğruyu bilen ölçüt" yok. Elle çözümlenmiş Türkçe geçmiş olay kümesi kurmak
  hem bizim en büyük riskimizi kapatır hem de satıcı seçiminde **kıyas aracı** olur: her aday satıcıya aynı olay
  için veri çekme ve okuma denemesi yaptırılmalı.
- **Satıcı riski için:** Logically örneği ve Talkwalker'ın X arızası, tek veri satıcısına bağlanmamayı ve "izleyeni
  izleyen" sağlık kontrolünü (veri akışı kesildiğinde uyarı) gerekli kılıyor.
- **N6 ve şeffaflık için:** Satıcı sözleşmeleri sabit yıllık bedelli; harcama defteri "çağrı başına maliyet"ten
  "lisans + değişken YZ maliyeti" yapısına evrilmeli.

---

## 9. Açık kalanlar (sonraki aramada bakılacaklar)

Kota dolduğu için araştırılamadı ya da doğrulanamadı:
1. Türkiye'de TV/radyo/basılı izlemenin kapsamı (kanal/yayın sayısı) ve içerik lisansı — Ajans Press, MTM, Interpress
   ürün sayfaları ve doğrudan görüşme.
2. Brandwatch, Talkwalker, Meltwater, Sprinklr'ın **Türkçe** duygu desteği ve Ekşi Sözlük/Şikâyetvar kapsamı.
3. Büyük PR ajanslarının (Edelman, Weber Shandwick, FleishmanHillard, Brunswick, FTI) ve Türkiye'deki kriz
   ajanslarının izleme masası işleyişi.
4. Blackbird, Graphika, Cyabra fiyatları ve yöntem belgeleri (müşteri olarak istenebilir).
5. Publicis "Social Listening Head-to-Head" çalışmasının rakamları (thesilab.com'dan ücretsiz indirilebilir).
6. GWU (Eylül 2025) ve NDI raporlarının tam metinleri (bu oturumda erişilemedi).
7. X'in güncel resmî ortak listesi (`partners.x.com`) — Brandwatch dışındaki satıcıların güncel statüsü.
8. BoomSonar ve diğer yerli araçların kaynakları ve Türkçe başarısı; PRNet'in ne olduğu.
