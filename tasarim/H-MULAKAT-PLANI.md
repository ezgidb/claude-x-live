# H — Kullanıcı mülakatı planı

Yazan: mülakat tasarımı, ekip şefi için. Tarih: 21 Kasım 2026. Girdi: `BRIEF-YENI-SOHBET.md`,
`tasarim/G-DIS-DENETIM.md` (G-1 … G-16), `tasarim/PLAN.md` (sürüm 4), `tasarim/F-GRI-ALAN.md`.

Mülakatı ekip şefi sohbette turlar hâlinde yapar. Her tur en çok 4 çoktan seçmeli sorudur ve 2–3 dakikada
yanıtlanabilir. Açık uçlu sorular (bölüm 3) son turdan sonra ya da kullanıcının vakti varsa turların arasında sorulur.

**Kullanıcıya açılış cümlesi (önerilen):** "Planı sizin işinize göre ayarlamak için beş kısa tur soru soracağım. Doğru ya
da yanlış yanıt yok; 'bilmiyorum' da geçerli bir yanıt. Her turda en çok dört soru var."

**Sorulmayacaklar (karara bağlandı):** kazıma yapılmaz; beş kırmızı çizgi (F §5) değişmez; model eğitilmez; 7/24 tam
kadrolu nöbet kurulmaz; kapsam şimdilik yalnız X (+ isteğe bağlı haber ve belge).

**Sorulmadan öğrenilebilecek:** G-14 (X geliştirici hesabı, ödeme, harcama tavanı). Nabız gerçek sayım verisiyle
çalışıyorsa hesap vardır; ekip şefi bunu ücretsiz `durum` komutuyla kendisi kontrol eder, kullanıcıya sormaz.

---

## 1. Mülakatın amacı

1. **Bütçeyi ve iş modelini netleştirmek:** "3000"ün anlamı, bütçenin danışan sayısıyla büyüyüp büyümediği, danışana
   satış fiyatı ve danışanın asıl neye para ödediği. Sonuç: `PLAN.md` §2.3 maliyet tablosu varsayım olmaktan çıkar,
   birim ekonomi (danışan başına asgari fiyat) yazılabilir (G-5, G-8, G-9).
2. **İnsan yükünü gerçeğe oturtmak:** "%20 insan"ın kullanıcının kafasındaki anlamı, etiketçinin kim olduğu, kullanıcının
   kendi ayırabileceği zaman. Sonuç: etiketçi kapasitesi "trafiğin yüzdesi" yerine "günlük sabit kapasite" olarak
   yazılabilir (G-2, G-3).
3. **Danışan profilini ve buna bağlı zorunlulukları belirlemek:** ulusal siyasetçi var mı, kamu kurumu/makam var mı,
   rakip danışanlar aynı anda olur mu. Sonuç: kurumsal paket gerekip gerekmediği ve danışanlar arası veri ayrımı kuralı
   (G-1, PLAN §2.4).
4. **Gri alanda nereye kadar gidileceğini kayda geçirmek:** varsayılan uyum profili, adla izlenecek hesap eşiği,
   "organize mi" sorusunun yanıt biçimi, danışanın kendi etkinliğine gelen tepki. Sonuç: `F-GRI-ALAN.md` §3–4 ve
   `PLAN.md` §6 kesinleşir (G-6, G-10, G-1).
5. **Başlama sırası ve hizmet sözü:** hukuk görüşünü beklemeden sayım ve alarmla başlanıp başlanmayacağı, krizde bütçe
   aşımı yetkisi, danışana verilecek hız sözü. Sonuç: `PLAN.md` §9 takvimi ve §8.1 nöbet modeli güncellenir (G-4).

---

## 2. Turlar

Okuma notu: "(Önerilen)" yalnız gerçek bir öneri olduğunda konuldu. "Bu yanıt gelirse" sütunu ekip şefinin
kullanıcıya göstermeyeceği iç nottur; kullanıcıya yalnız "Soru" ile "Seçenek + Açıklama" gösterilir.

### Tur 1 — İş modeli ve bütçe

#### S1.1
- **Soru:** Mesajınızdaki "3000" rakamı tam olarak neyi anlatıyordu?
- **Kısa başlık:** 3000 nedir
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Aylık 3.000 $, teknik gider | X verisi, yapay zekâ ve sunucu için ayda en çok 3.000 $; insanlar ayrı. | Plan geçerli, ama G-8 ve G-9 düzeltmeleriyle toplam 2.100–3.300 $ olur, tavana dayanır. Ulusal siyasetçi pilotta tek başına alınır ya da okuma oranı düşürülür. |
| Aylık 3.000 $, her şey dahil | Etiketçi, hukukçu ve teknik destek de bu tutarın içinde. | İnsan maliyeti düşülünce teknik gidere kalan pay küçülür. Pilottan ulusal siyasetçi çıkar; etiketçi yarı zamanlı; okuma oranı düşer. §2.3 ve §8 yeniden yazılır. |
| Danışan başına aylık 3.000 $ | Her danışan için ayrı ayrı bu kadar harcanabilir. | Toplam tavan sorunu kalkar. Asıl belge "danışan türü × maliyet" tablosu olur; ulusal siyasetçide %3–5'ten daha yüksek okuma oranı mümkün. |
| Başka bir şey | TL, tek seferlik kurulum ya da başka bir anlam (açıklarım). | Tutar netleşene kadar bütçe tablosu "varsayım" etiketiyle kalır; takip sorusuyla netleştirilir. |

- **Neden soruyoruz:** brif §1 ve §8 karar 1; G-5 (tavan teyit edilmedi, insanı içerip içermediği bilinmiyor);
  PLAN §2.3, §11.1.
- **Takip sorusu:** "Bu tutar ilk aylar için mi düşünüldü, yoksa sürekli bir sınır mı?"

#### S1.2
- **Soru:** Danışan sayısı arttıkça bu sisteme ayırdığınız bütçe de artabilir mi?
- **Kısa başlık:** Bütçe ölçeği
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Evet, gelirle birlikte artar | Her yeni danışan kendi maliyetini getirir; sınır danışan sayısıyla büyür. | PLAN §2.2'deki "danışan başına bütçe" ana kural olur; toplam tavan yerine danışan başına asgari fiyat yazılır. |
| Hayır, sabit kalır | Kaç danışan olursa olsun toplam harcama aynı. | Plana danışan sayısı sınırı yazılır (ör. ulusal siyasetçiyle en çok 3–5 danışan); yeni danışan, bütçe payı ölçülmeden alınmaz. |
| Başta sabit, sonra artar | Pilot dönemi sabit; satışlar başlayınca yeniden konuşulur. | A5 pilotu için sabit tavan, sonrası için "danışan başına" kural; geçiş koşulu yazılır. |

- **Neden soruyoruz:** G-5 (birim ekonomi); PLAN §2.2–2.3. Sabit tavan ile hizmet satışı modeli birbirine uymayabilir.
- **Takip sorusu:** "Sabit tavanla en çok kaç danışana hizmet vermeyi düşünüyorsunuz?"

#### S1.3
- **Soru:** Danışanlarınız size en çok hangi iş için para ödeyecek?
- **Kısa başlık:** Ana ürün
- **Seçim:** çoklu (en çok 2)

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Erken uyarı | Bir şey büyümeden haber almak: alarm ve kısa not. | A1 (sayım + alarm) ilk satılan ürün olur; G-4'teki paralel başlama kritikleşir. |
| Kriz anında yönetim | Kriz başlayınca ne olduğunu, nereye gittiğini, ne yapılacağını anlatmak. | Okuma katmanı, taşma bütçesi ve kriz modu (G-1 "bozulmuş mod") öne alınır; satılabilir ürün A2–A3'e kayar. |
| Düzenli rapor | Haftalık ya da aylık gündem ve itibar raporu. | A3 rapor şablonu öne alınır; canlı okuma yerine toplu işlem (yarı fiyat) kullanılabilir, yapay zekâ maliyeti düşer (G-8). |
| Kitle ve söylem içgörüsü | Hangi kesim hangi dille ne diyor; mesaj ve kampanya tasarımı için. | Gri alan yöntemleri (F §3: G1-A, G2, G3) ürünün merkezine geçer; avukat görüşü ve uyum profili A0'ın ana işi olur. |

- **Neden soruyoruz:** brif §1 (hizmet satışı); YONETICI-OZETI §3 değer önerisi kullanıcıyla doğrulanmadı;
  PLAN §9 aşama sırası buna göre değişir; G-4.
- **Takip sorusu:** "Danışanlarınız bu ihtiyacı bugün nasıl karşılıyor: başka bir firma, kendi ekibi, sizin elle
  takibiniz?"

#### S1.4
- **Soru:** Bir danışana bu hizmeti ayda yaklaşık kaça satmayı düşünüyorsunuz?
- **Kısa başlık:** Satış fiyatı
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Henüz bilmiyorum | Maliyet tablosunu görünce karar vereceğim. | Plana "danışan türü başına asgari fiyat" tablosu eklenir; karar kullanıcıya bırakılır. |
| 1.000 $'ın altında | Küçük ve orta danışanlara uygun fiyat. | Ulusal siyasetçi bu fiyata sığmaz (yalnız X verisi 800–2.000 $); marka ve yerel danışanlara odaklanılır, okuma oranı ve insan payı kısılır. |
| 1.000–5.000 $ | Orta-üst bant. | Plan bu banda göre kurulu; ulusal siyasetçi bandın üst ucunda fiyatlanır. |
| 5.000 $'ın üstünde | Üst bant; az sayıda büyük danışan. | Daha yüksek okuma oranı, ikinci etiketçi ve ücretli haber kaynağı karşılanabilir; doğruluk hedefleri yükseltilebilir. |

- **Neden soruyoruz:** G-5 (danışan fiyatı ve birim ekonomi hiç hesaplanmadı; kullanıcının en önemli iş kararı).
- **Takip sorusu:** "Siyasi danışanla marka danışanı arasında fiyat farkı olacak mı?"

---

### Tur 2 — Danışan profili ve "%20 insan"

#### S2.1
- **Soru:** İlk 6 ayda hizmet vermeyi düşündüğünüz danışanlar hangi türde?
- **Kısa başlık:** Danışan türü
- **Seçim:** çoklu

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Marka ya da şirket | Ürün, hizmet, şirket itibarı. | Danışan başına X maliyeti ~45–1.350 $; %100 okuma; standart uyum profili yeterli. |
| Ulusal siyasetçi ya da parti | Milletvekili, genel başkan, parti. | Bütçenin ana belirleyicisi; sayım + %3–5 örnek; kimliksiz mod zorunlu; "organize mi" (S3.4) ve rakip ayrımı (S2.3) öne çıkar. |
| Yerel siyasetçi | Aday ya da il/ilçe düzeyinde kişi (makam değil). | Orta maliyet (~150–1.000 $); kimliksiz mod; makam ayrımı için S2.2'ye bakılır. |
| Kurum, STK ya da ünlü | Kamu kurumu olmayan kuruluş ya da tanınmış kişi. | Orta maliyet; standart profil; kişi odaklı izlemede danışanın kendi hesabı merkezde. |

- **Neden soruyoruz:** brif §8 karar 2; PLAN §2.3 (maliyet danışan karışımına bağlı); G-5.
- **Takip soruları:** (1) "Aklınızda somut 2–3 pilot danışan var mı? Adını vermeden türünü ve büyüklüğünü söyler
  misiniz?" (2) "Bu danışanlar kendi X hesaplarına sizin sisteminiz için okuma izni verir mi?" (bkz. ek bulgu E-4)

#### S2.2
- **Soru:** Danışanlarınız arasında bir makam ya da kamu kurumu olacak mı? (Ör. belediye başkanlığı, bakanlık, kamu
  şirketi)
- **Kısa başlık:** Kamu kurumu
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Hayır | Yalnız kişiler, partiler, şirketler. | Kullandıkça öde yeterli; PLAN §2.4'teki 1. koşul kapanır. |
| Evet | Kurumun kendisi danışan olacak. | X'in kurumsal paketi zorunlu (fiyatı yayımlanmıyor; ayda on binlerce $ olduğu söyleniyor, doğrulanmadı). Ya ayrı fiyatlanır ya da bu danışan alınmaz; PLAN §2.4 ve §10. |
| Kişi olarak, makam değil | Ör. belediye başkanının kendisi; sınır belirsiz. | Avukata öncelikli soru: faturayı kim öder, rapor kime gider, makam adına kullanılır mı. Sözleşme mimarisi (F §3 G8) bu ayrımı yazılı kılar. |
| Bilmiyorum | Henüz belli değil. | A0'da avukata ilk sorulardan biri olur; o zamana kadar kamu danışanı alınmaz. |

- **Neden soruyoruz:** PLAN §2.4; brif §5 ("Government Use") ve §8 karar 3.
- **Takip sorusu:** "Makam adına çalışan birinden teklif gelirse ne yapmak istersiniz?"

#### S2.3
- **Soru:** Birbirine rakip iki danışana aynı anda hizmet verebilir misiniz? (Ör. aynı seçimde iki aday, aynı sektörde
  iki marka)
- **Kısa başlık:** Rakipler
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Hayır, asla | Rakip danışan almam. | Danışan kabul kuralı olarak yazılır; ortak örnek kütüphanesi danışanlar arasında paylaşılabilir. |
| Sektörde evet, siyasette hayır | Markalarda olur, siyasi rakiplerde olmaz. | Markalar için ayrı kod kitabı ve ayrı kütüphane bölümü; siyasi danışanlar arası yasak kural olarak yazılır. |
| Evet, ayrı tutulursa | Bilgileri birbirine karışmazsa olur. | Danışan başına tam ayrım: ayrı örnek kütüphanesi, mümkünse ayrı etiketçi, erişim kaydı, danışan sözleşmesinde gizlilik maddesi. Ortak öğrenme kaybolur: doğruluk daha geç yükselir, maliyet artar. |

- **Neden soruyoruz:** G-1 (rakip danışanlar arası çıkar çatışması ve veri ayrımı planda yok); PLAN §3.2 (tek örnek
  kütüphanesi), §8 (tek etiketçi).
- **Takip sorusu:** "Danışanlarınız birbirinin kim olduğunu bilir mi, bilmeli mi?"

#### S2.4
- **Soru:** "İnsanın doğruladığı %20 veriden öğrenen sistem" derken hangisini kastettiniz?
- **Kısa başlık:** %20 insan
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Örnekten öğrenme | Başta bir örnek kümesini insan doğrular; sistem gerisini kendi yapar; insan arada kontrol eder. | "%20" bir tohum büyüklüğü olur (ör. 300 yerine 1.000–2.000 örnek); sonra insan payı hızla düşer; günlük iş yükü küçük kalır. |
| Sürekli beşte bir | Her gün gelen gönderilerin beşte biri insan elinden geçer. | 5 danışanda günde ~2.000 gönderi; olgun dönemde de ~1 tam zamanlı, ilk aylarda 2 etiketçi gerekir; bütçeye insan kalemi eklenir. |
| Zor olanlar insana | Sistem emin olmadığını insana sorar; oran ne çıkarsa. | Mevcut plan (§3.2); ama kuyruk G-2'ye göre günlük sabit kapasiteyle sınırlanır, taşan kısım "belirsiz" dilimine düşer. |
| Oran değil sonuç önemli | %90 doğruluk tutsun; insan payını siz ayarlayın. | G-2 önerisi doğrudan uygulanır: "günde 600–800 gönderi" gibi sabit kapasite; doğruluk G-3'e göre alt sınırla raporlanır. |

- **Neden soruyoruz:** G-2 (iki farklı anlam, çok farklı iş yükü; kapasite hesabı yok); brif §1 öğrenme; PLAN §3.2.
- **Takip sorusu:** "Etiketçiden her kararda kısa bir gerekçe istemek sizce uygulanabilir mi, yoksa yalnız zor
  örneklerde mi?"

---

### Tur 3 — Gri alan sınırları

Tur öncesi ekip şefinin söyleyeceği tek cümle: "Bu turdaki sorular beş kırmızı çizgiyi değiştirmiyor; sarı alanda ne
kadar ilerleyeceğimizi soruyor. Riski sizin aldığınızı biliyoruz."

#### S3.1
- **Soru:** Siyasi danışanlarda sistem hangi ayarla başlasın?
- **Kısa başlık:** Uyum ayarı
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Danışan başına karar (Önerilen) | Her danışanda siz seçersiniz; seçmezseniz standart. Her değişiklik kayda geçer. | F §4 olduğu gibi kalır; profil değişiklik kaydı A1'de yazılır. |
| Hep standart (yeşil) | Kimliksiz analiz; yalnız kurum, medya, siyasetçi hesapları adla. Savunması en güçlü. | G1-A, G2, G3 A3'ten çıkar; iş azalır; rapor uyum beyanı tek tip. |
| Hep genişletilmiş (sarı) | Standarda ek: olaylar arası kimliksiz kitle örtüşmesi, etkileyici haritası, lisanslı satıcı çıktısı. | G2 ve G3 A3'e girer; F §6'daki 1, 4 ve 5 numaralı avukat soruları A0'da önceliklenir; varsayılan rapor beyanı sarı profilinki olur. |

- **Neden soruyoruz:** F §4 (uyum profili); brif §7; G-6. Öneri gerekçesi: risk danışana göre değişiyor ve kayıt,
  denetimde "özen gösterdik" savunmasının belgesi (F §3 G8).
- **Takip sorusu:** "Danışanınız raporda 'bireysel çıkarım yapılmadı' gibi bir uyum beyanı görmek ister mi, yoksa bu
  yalnız sizin iç kaydınız mı olsun?"

#### S3.2
- **Soru:** Adıyla izlenecek ve olaylarda kullandığı söylem kaydedilecek hesaplar hangi sınırla seçilsin?
- **Kısa başlık:** Adla izleme
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Beyanı kamusal olanlar (Önerilen) | Siyasetçi, parti, kurum, medya, kurumsal kimliğiyle yazan gazeteci. | G3 "kamusal aktör defteri"yle birleşir; X riski 🟡; avukat ve X'e gidecek soru daralır. |
| + 100 bin üstü takipçi | Kamusal hesaplara ek olarak çok büyük bireysel hesaplar. | G3 riski 🟡–🟠; F §6 soru 4'e eşik olarak eklenir; ayrı kayıt. |
| + 10 bin üstü takipçi | Mevcut gri alan önerisi; kapsam geniş. | G-6'ya göre F §3 G3'ün X riski 🟠'ye yükseltilir; yalnız genişletilmiş profilde açılır; X erişim kaybı riski yazılı kabul edilir. |

- **Neden soruyoruz:** G-6 (G3'te adla saklanan çerçeve geçmişi adı konmamış bir siyasi profil; 10 bin eşiği geniş);
  F §3 G3; PLAN §6.3 yol 2; F §6 soru 4.
- **Takip sorusu:** "Bu listede olmasını isteyeceğiniz ama kamusal sayılmayan hesaplar var mı? (Ör. anonim ama çok
  etkili haber ya da yorum hesapları)"

#### S3.3
- **Soru:** Siyasi danışanınız kendi mitingi ya da etkinliği hakkında X'te ne konuşulduğunu görmek isteyecek mi?
- **Kısa başlık:** Etkinlik
- **Seçim:** tek
- **Ekip şefine not:** Miting izleme kırmızı çizgisi değişmez. Bu soru, danışanın kendi sözlerine gelen tepkiyi bu
  çizginin içinde nasıl vereceğimizi belirler. Kullanıcıya şöyle açıklanır: "X'in kuralları miting izlemeyi yasaklıyor;
  bunu değiştirmiyoruz. Ama danışanın orada söylediği sözlere gelen tepkiyi farklı bir yoldan gösterebiliriz."

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Sözlerine gelen tepki yeter | Mitingde ya da açıklamada söylediklerine gelen tepki; etkinliğin kendisi değil. | Konu ve söz temelli kural şablonu (danışanın sözlerinden ifadeler); yer, katılım, kalabalık sorgusu yok. PLAN §4'e not. |
| Etkinliğin kendisi de önemli | Etkinlik hakkında ne konuşulduğunu da görmek ister. | X'e gidecek yazılı soru listesine "danışanın kendi etkinliğine gelen tepki" eklenir (S5.3'e bağlı); yanıt gelene kadar yalnız "sözlere tepki" modu. |
| Gerek yok | Bu ihtiyaç olmayacak. | Kural motorundaki ret yeterli; değişiklik yok. |

- **Neden soruyoruz:** G-10 (asıl ihtiyaç kırmızı çizgiyle çatışabilir); PLAN §4 uyum koruması; F §5 madde 5.
- **Takip sorusu:** "Danışanınız bu bilgiyi en çok ne zaman ister: etkinlik sırasında mı, ertesi sabah mı?"

#### S3.4
- **Soru:** Danışan "Bu organize mi, botlar mı?" diye sorduğunda nasıl yanıt verelim?
- **Kısa başlık:** Organize mi
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Toplu işaret, isimsiz (Önerilen) | "Aynı metin 2 saatte 400 kez paylaşıldı, yeni açılmış hesap oranı yüksek" gibi; hesap adı yok. | A3'e kimliksiz "koordinasyon işaretleri" modülü (metin tekrarı, zaman kümelenmesi, hesap yaşı dağılımı) + "isim vermeden aktar" kuralı. |
| Kamusal hesaplar adla | Toplu işaret + yalnız kamusal aktör defterindeki hesaplar adla; diğerleri isimsiz. | Aynı modül + aktör defteri bağlantısı; avukata itibar/iftira riski sorusu eklenir. |
| Bu soruyu yanıtlamayalım | Sistem koordinasyon bulgusu üretmez. | Modül çıkar; raporda "kapsam dışı" satırı. |

- **Neden soruyoruz:** G-1 (bot/koordinasyon yöntemi ve "isim vermeden aktar" kuralı sürüm 4'te yok);
  `ZAYIFLIKLAR.md` "en tehlikeli beş" 4. madde; brif §9 (neden-sonuç yazılmaz). Öneri gerekçesi: zamanlama ve
  benzerliğe dayanan bulgu, isimle aktarılınca suçlama gibi okunur.
- **Takip sorusu:** "Danışanınız böyle bir bulguyu kamuya açıklamak isterse ne yaparsınız?"

---

### Tur 4 — İşletme: etiketçi, alarm, rapor

#### S4.1
- **Soru:** Etiketçi olarak kimi düşünüyorsunuz?
- **Kısa başlık:** Etiketçi
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Ekibimden biri | Şu an sizinle çalışan biri. | A0'da gizlilik ve tarafsızlık sözleşmesi, kısa eğitim; takvim korunur. |
| Dışarıdan bulunacak | Yeni biri aranacak. | A0'a 2–4 hafta işe alım eklenir; A2 başlangıcı buna bağlanır. |
| Başta kendim | İlk dönemde etiketlemeyi ben yaparım. | Sizin süreniz haftada 3–5 saatten günde saatlere çıkar; tohum kümesi küçülür, A2 uzar; G-3'teki "ikinci göz" kaybolur. |
| Henüz yok | Kimse belli değil. | A2 kapısı (≥ %90) bu kişi bulunana kadar başlamaz; A1 (sayım + alarm) etkilenmez. |

- **Neden soruyoruz:** brif §8 karar 4; PLAN §8; G-2 (kapasite); G-1 (rakip danışanlarda aynı etiketçi).
- **Takip sorusu:** "Bu kişi siyasi gönderilerde tarafsız kalabilir mi, ve günde yüzlerce hakaret ya da tehdit içeren
  gönderi okumaya uygun mu?" (bkz. E-7)

#### S4.2
- **Soru:** Sistemin kalitesini kontrol etmek için haftada ne kadar zaman ayırabilirsiniz?
- **Kısa başlık:** Süreniz
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Haftada 1 saatten az | Yalnız alarmlara ve raporlara bakarım. | G-3'teki "ikinci göz" sizden alınamaz; geçici ikinci etiketçi kalıcı olur (ayda birkaç gün) ve bütçeye girer; kural önerileri birikir, toplu onaylanır. |
| Haftada 1–3 saat | ~30 zor örneği kendim değerlendiririm. | Haftalık 30 örnek korunur; kural onayları haftada bir topluca. |
| Haftada 3–5 saat ya da fazla | Plandaki rol: kural onayı, kalite gözden geçirme, örnekler. | Plan (§8) aynen. |

- **Neden soruyoruz:** PLAN §3.2 ve §8 (danışman haftada 3–5 saat ve ~30 örnek varsayıldı, sorulmadı); G-3 (bağımsız
  ölçüm kullanıcının örneklerine dayanıyor).
- **Takip sorusu:** "Yeni bir danışanı kurarken (kelimeler, hesaplar, hassas konular) kaç saat ayırabilirsiniz?"
  (bkz. E-5)

#### S4.3
- **Soru:** Bir kriz başladığında danışanınıza en geç ne kadar sürede haber vermeyi söz vermek istersiniz?
- **Kısa başlık:** Hız sözü
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Mesaide 1 saat, gece sabah (Önerilen) | Gündüz bir saat içinde; gece yalnız çok büyük olaylarda, gerisi sabah. | PLAN §8.1 aynen: gece eşiği yüksek, gece alarmları "doğrulanmadı" etiketli. |
| 7/24, 1 saat içinde | Gece de bir saat içinde haber. | Yedek kişi zorunlu; gece kırmızı alarmı sizi uyandırır; seçim ve kriz haftaları için nöbet planı yazılır. |
| 7/24, 15 dakika içinde | Her saatte çok hızlı haber. | 15 dakikalık yoklamayla verilemez (olay yoklamadan hemen sonra başlarsa 15–30 dk geçer). 5 dakikalık yoklama (sayım maliyeti ~3 kat, G-9) + sürekli nöbet gerekir. |
| Süre sözü vermem | En kısa sürede, ama rakam yok. | Hizmet sözleşmesine "en iyi çaba" yazılır; alarm tasarımı değişmez. |

- **Neden soruyoruz:** PLAN §4 (önem düzeyleri) ve §8.1 (nöbet modeli); G-1 (kriz modu); brif §6. Öneri gerekçesi:
  tek danışman + bir etiketçiyle sürdürülebilen tek söz bu.
- **Takip sorusu:** "Siz ulaşılamadığınızda (yolculuk, hastalık) kırmızı alarmı kim karşılar?"

#### S4.4
- **Soru:** Danışanınıza sonuçları hangi biçimde vermek istersiniz?
- **Kısa başlık:** Teslim
- **Seçim:** çoklu

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Kısa mesajla anlık not | WhatsApp ya da e-postayla birkaç satırlık durum notu. | Her notta sayı denetçisi çalışır; gönderi alıntısı kısa ve bağlantılı; not başına yapay zekâ maliyeti hesaba girer (G-8). |
| Dönemsel rapor (PDF) | Haftalık ya da aylık, dayanaklı rapor. | A3 rapor şablonu; X gönderisi tam metin yerine bağlantı ve kısa alıntı (G-1 aktarım sınırı). |
| Danışana pano erişimi | Danışan sisteme kendisi girip bakar. | Danışan başına erişim ve kayıt; kişi adlarının nasıl gösterileceği kuralı; "kamuya yayımlanamaz" uyarısı; A3'e +1–2 hafta güvenlik işi. |
| Yalnız ben görürüm | Danışan yalnız benim yorumumu alır. | En basit yol; X içeriği aktarma sorunu büyük ölçüde kalkar; pano tek kullanıcılı kalır. |

- **Neden soruyoruz:** PLAN §1.2; G-1 (X içeriğini danışana aktarma sınırı: alıcı başına günde en çok 50.000 tam
  gönderi, kamuya yayımlanamaz); E-2 (kimliksiz mod ile "kim başlattı" sorusu).
- **Takip sorusu:** "Danışanınız raporu kendi ekibinin ya da basının önüne koyar mı?"

---

### Tur 5 — Öncelik, zamanlama ve kaynaklar

#### S5.1
- **Soru:** Hukuk görüşü gelmeden, kişisel veri içermeyen "sayım ve alarm" kısmıyla başlayalım mı? (Sayım = "saatte kaç
  gönderi atıldı" bilgisi; kimin yazdığı yok.)
- **Kısa başlık:** Başlama
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Evet, paralel başlansın (Önerilen) | Sayım ve alarm hemen kurulur; gönderi okuma avukat onayını bekler. | A0 ile A1 aynı anda; alarm ~1. ayın sonunda denenir; PLAN §5.2'deki "gerçek veriyle çalışılmaz" cümlesi "gönderi okuma yapılmaz" diye daralır. |
| Evet, ama danışana satmadan | Yalnız kendi denemem için; danışana hukuk görüşünden sonra. | A1 kurulur, iç kullanımda kalır; ilk gelir A0 bitince başlar. |
| Hayır, önce hukuk | Avukat görüşü gelene kadar hiçbir şey gerçek veriyle çalışmaz. | Takvim aynen (alarm 2–3. ay). |

- **Neden soruyoruz:** G-4; PLAN §5.2 son cümle, §9 (A0, A1). Öneri gerekçesi: sayım verisi kişisel veri içermiyor;
  hukuk süreci haftalar sürebilir. Not: E-8 (a)'ya göre yalnız sayım veren alarm "ne oldu?" sorusunu yanıtlamaz.
- **Takip sorusu:** "Avukatınızla ilk görüşme ne zaman olabilir? KVKK ve sözleşme hukukunda deneyimi var mı?"

#### S5.2
- **Soru:** Bir krizde danışanın aylık okuma bütçesi biterse sistem ne yapsın?
- **Kısa başlık:** Kriz bütçesi
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Belli tutara kadar sormadan (Önerilen) | Ör. danışan başına aylık bütçenin yarısı kadar ek; üstü için size sorar. | Taşma tavanı rakamla yazılır; harcama defteri danışan başına tutulur; kriz modu tanımlanır. |
| Her seferinde bana sor | Her ek harcamada onay. | Gece krizlerinde gecikme; ekranda "onay bekliyor" durumu; onaysız sürede örnekleme. |
| Aşmasın, örneklemeye geçsin | Hacim yine kesin; okunan gönderi oranı düşer. | G-1'deki "bozulmuş mod" yazılır: ekranda okunan oran, genişleyen güven aralığı, kaçırılabilecekler. |

- **Neden soruyoruz:** PLAN §2.2 (taşma bütçesi var ama sınırı ve yetkisi yok); G-1 (bozulmuş mod); proje kuralı
  ("şu tutara kadar sormadan devam et"). Öneri gerekçesi: kullanıcının önceliği doğruluk; krizde bilgi kaybını
  önlerken harcamayı sınırlar.
- **Takip sorusu:** "Kriz dönemindeki ek maliyeti danışana yansıtmayı düşünür müsünüz?"

#### S5.3
- **Soru:** Kamusal hesapları adla izlemenin X'in kurallarına uyup uymadığını X'e yazılı olarak soralım mı?
- **Kısa başlık:** X'e soru
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Önce avukat karar versin (Önerilen) | Sorup sormamayı ve soru metnini avukat belirler. | Soru taslağı A0'da hazırlanır; gönderim avukat kararına bağlanır; S3.3'teki etkinlik sorusu da aynı pakete girer. |
| Evet, soralım | Belirsizlik kapanır; ama "hayır" gelirse o kullanım kesin yasak olur. | A0'da gönderilir; yanıt gelene kadar defter yalnız kurum ve medya hesaplarıyla; olumsuz yanıtta PLAN §10 son satır. |
| Hayır, sormayalım | Gri kalır; yalnız beyanı kamusal hesaplarla ve kayıtla yürütülür. | Aktör defteri S3.2'deki ilk seçenekle sınırlı açılır; risk kaydına yazılır. |

- **Neden soruyoruz:** brif §8 karar 5; PLAN §6.3 yol 2 ve §11.5 (plan "önerilir" diyor); G-6, G-10. Öneri
  gerekçesi: E-8 (b).
- **Takip sorusu:** yok.

#### S5.4
- **Soru:** Haber sitelerini izlemek ilk aşamada gerekli mi?
- **Kısa başlık:** Haber
- **Seçim:** tek

| Seçenek | Açıklama | Bu yanıt gelirse plan |
|---|---|---|
| Ücretsiz kaynakla başla (Önerilen) | Ücretsiz uluslararası haber veritabanı (GDELT); Türkçe yerel haber kapsamı ölçülmedi. | A3'te GDELT; ilk ay danışmanın bildiği haberlerle kaçırma oranı ölçülür, sonra ücretli kaynağa karar verilir. |
| Ücretli haber servisiyle | Ayda ~90 $'dan başladığı bildiriliyor (doğrulanmadı); daha geniş kapsam. | Bütçeye ~90 $ ve üstü eklenir; "haber geçişi" alarmı A1'e alınabilir. |
| Şimdilik gerek yok | Yalnız X. | "Haber geçişi" kuralı çıkar; raporda "haber: kör nokta" satırı. |

- **Neden soruyoruz:** brif §8 karar 6; PLAN §2.5; G-16. Öneri gerekçesi: önce ucuza ölç, sonra harca.
- **Takip sorusu:** "Danışanlarınız için en kritik haber kaynakları hangileri? (Ajans, yerel site, TV)"

---

## 3. Açık uçlu sorular

Sıra önem sırasıdır. Her biri gerçek kullanımı ve planın varsayımlarını sınar.

| # | Soru | Neyi ortaya çıkarır | Bağlı olduğu yer |
|---|---|---|---|
| A-1 | "Siyasi bir danışanınız sizinle çalışmaya başladığı ilk hafta size hangi soruyu sorar? Bir marka danışanı hangisini sorar?" | Ürünün asıl sorusu; kimliksiz modun bu soruyu yanıtlayıp yanıtlayamadığı | E-2; PLAN §6.4; S1.3 |
| A-2 | "Son yaşadığınız bir kriz nasıl gelişti? İlk ne zaman fark ettiniz, neyi geç fark ettiniz, o an elinizde ne olsaydı farklı yapardınız?" Takip: "O sırada X'e erişimde yavaşlama ya da engel oldu mu?" | Alarm kural şablonları; bu kriz A1 kapısındaki "geçmiş olayda kural denemesi"nin ilk vakası olabilir | PLAN §4, §9 A1; E-3 |
| A-3 | "Paylaştığınız Future Bright sunumunda danışanınızın en çok işine yarayacak sayfa hangisiydi? Hangisini siz de satmak isterdiniz?" | Kişi/kitle segmenti talebinin gerçek boyutu; etnik ve ideolojik segment beklentisi | G-7; F §1, §3 G1, G7 |
| A-4 | "Bir danışan neden sizi bir medya takip firması ya da başka bir ajans yerine seçer? Bu sistem bunu nasıl güçlendirmeli?" | Değer önerisinin doğrulanması ("ölçülmüş doğruluk" ve "uyum beyanı" gerçekten satış farkı mı) | E-1; YONETICI-OZETI §3 |
| A-5 | "Bugün bir danışandan hangi bilgileri alabiliyorsunuz: kelimeler, hesaplar, hassas konular? Bunları kim yazıyor, ne kadar sürüyor?" | Danışan tanımı akışının gerçekçiliği; kurulum yükü | E-5, E-6; PLAN §1.1 |
| A-6 | "6 ay sonra 'iyi ki yapmışız' demeniz için ne olmuş olmalı? Hangi durumda bu sistemi başarısız sayarsınız?" | Kullanıcının başarı ölçütü; aşama kapılarıyla uyumu; önünde bir tarih (seçim, sözleşme) olup olmadığı | PLAN §9 kapılar |

---

## 4. Ek bulgular (planda ve G denetiminde gözden kaçtığını düşündüklerim)

**E-1. Değer önerisi kullanıcıyla doğrulanmadı.**
- **Ne:** YONETICI-OZETI §3 satış farkını "ölçülmüş doğruluk" ve "uyum beyanı"na dayandırıyor. Bu, önceki ekibin
  varsayımı; kullanıcının ya da danışanlarının bunu istediğine dair bir kayıt yok.
- **Neden önemli:** Siyasi danışanlar büyük olasılıkla hız ve içgörü ister, güven aralığı değil. Gri alan isteyen bir
  kullanıcı için genişletilmiş profilde "uyum beyanı" zaten zayıflıyor. A3'teki rapor emeği yanlış yere gidebilir.
- **Netleştiren soru:** S1.3, S3.1 takip sorusu, A-4.

**E-2. "Kim başlattı, kim büyüttü" sorusu ile kimliksiz mod çelişiyor.**
- **Ne:** Danışmanın temel kararı "ne oluyor, kim başlattı" (01-GEREKSINIM §1; Nabız'ın raporu da bunu yanıtlıyor).
  PLAN §6.4 siyasi konularda kullanıcı adını saklamıyor. O hâlde siyasi danışanda "ilk kim yazdı, kim yaydı" yalnız
  aktör defterindeki hesaplar için yanıtlanabilir. Plan bunu söylemiyor. Ayrıca "saklamak" ile "anlık göstermek"
  ayrılmamış: X'in gösterim kuralları bir gönderi gösterilirken yazarının da gösterilmesini istiyor olabilir
  (doğrulanmadı).
- **Neden önemli:** Danışanın ilk sorusu yanıtsız kalırsa ürün değer kaybeder; ya da ekip sessizce kimliksiz modu deler.
- **Netleştiren soru:** A-1, S3.2, S4.4. Plan tarafında: "kaydetmeden göster (bağlantıyla), analizde saklama" kuralı
  yazılmalı.

**E-3. Türkiye'ye özgü erişim olayları: yavaşlatma ve engellenmiş içerik.**
- **Ne:** (a) Büyük krizlerde X'e Türkiye'den erişim zaman zaman yavaşlatılıyor. Bu sırada hacim düşer; alarm motoru
  bunu "konu sönüyor" diye okuyabilir. (b) Mahkeme kararıyla Türkiye'de erişimi engellenen gönderi ve hesaplar var.
  X'in geliştirici kurallarının, bir ülkede engellenmiş içeriğin o ülkede gösterilmemesini istediği biliniyor
  (bu oturumda doğrulanmadı; A0'da okunmalı).
- **Neden önemli:** (a) Kriz anında yanlış "düşüş" sinyali, en pahalı hatadır. (b) Türkiye'deki danışana engelli
  gönderiyi raporda göstermek hem X sözleşmesi hem mahkeme kararı açısından ayrı bir risk; siyasi danışanlarda olası.
- **Netleştiren soru:** A-2 takip sorusu. Asıl çözüm mülakat değil: kural motoruna "erişim kısıtı" bayrağı ve rapor
  üretiminde "engelli içerik" süzgeci; A0 kaynak okumasına eklenmeli.

**E-4. Danışanın kendi hesabı üzerinden ucuz ve temiz veri, veri stratejisinde kullanılmamış.**
- **Ne:** Danışanın kendi X hesabına gelen yanıt ve anmalar, danışan izin verirse "kendi hesap verisi" fiyatıyla
  (kayıt başına 0,001 $) okunabilir (hangi verilerin bu fiyata girdiği doğrulanmadı). Plan bu yolu yalnız gri alan
  belgesinde G6 olarak anıyor; PLAN §2.2'deki "kritik alt küme: danışanın hesaplarına yanıtlar" ise tam fiyatla okunuyor.
- **Neden önemli:** Hem maliyeti düşürür (özellikle ulusal siyasetçide yanıt hacmi çok yüksek) hem de uyumda en savunulur
  yol (danışanın kendi ilişkisi).
- **Netleştiren soru:** S2.1 takip sorusu (2). A0 denemesine "kendi hesap verisi" fiyatının hangi uçları kapsadığı
  eklenmeli.

**E-5. Yeni danışan kurulum yükü hesapta yok.**
- **Ne:** Plan danışanın kelime, hesap, değer ve hassasiyet vereceğini varsayıyor. Pratikte bunu çoğunlukla danışman
  yazar. Danışan başına kod kitabı, eşsesli ayıklama, alarm kurallarının geçmişte denenmesi ve danışana özel tohum
  etiketleme gerekir. Danışmanın "haftada 3–5 saat"i bunu kapsamıyor.
- **Neden önemli:** Büyümenin darboğazı veri maliyeti değil, kurulum emeği olabilir; her yeni danışan birkaç gün iş demek.
- **Netleştiren soru:** S4.2 takip sorusu, A-5.

**E-6. Danışanın verdiği "hassasiyet listesi" sistemin en hassas belgesi.**
- **Ne:** Plan KVKK'yı X verisi için tartışıyor. Ama danışanın verdiği hassas konular, iç brifler ve danışmanın
  notları (siyasi danışanda zaaflar, kriz senaryoları) ticari sır niteliğinde; yapay zekâya bağlam olarak gidiyor,
  panoda duruyor. Erişim yetkisi, kayıt, saklama süresi ve sızıntı durumunda ne yapılacağı tanımsız. G-1 bunu yalnız
  rakip danışanlar açısından ele alıyor; sorun tek danışanda da var.
- **Neden önemli:** Sızıntı, KVKK cezasından çok daha hızlı biçimde danışmanın işini bitirir.
- **Netleştiren soru:** S2.3, S4.4 (pano erişimi), A-5.

**E-7. Etiketçinin içerik yükü ve siyasi tarafsızlığı.**
- **Ne:** Siyasi danışanlarda etiketçi günde yüzlerce hakaret, nefret ve tehdit içeren gönderi okuyacak; modelin
  yanıtlamayı reddettiği gönderiler de (G-12) ona gidecek. Ayrıca tek etiketçinin kendi siyasi eğilimi "kaba duruş"
  etiketlerini sistematik olarak kaydırabilir. G-3 "etiketçiye uyum" sorununu doğru tespit ediyor; siyasette bu
  sorun bir yanlılığa dönüşür ve danışana yanlış "destek/eleştiri" oranı olarak yansır.
- **Neden önemli:** Tükenme, tek etiketçili planı ilk krizde çökertir; yanlılık en çok siyasi danışanın göreceği
  sayıyı bozar.
- **Netleştiren soru:** S4.1 takip sorusu. Plan tarafında: siyasi danışanlarda kör denetimin bir kısmı farklı
  bakışta ikinci bir kişiye; günlük ağır içerik sınırı.

**E-8. Katılmadığım ya da farklı gördüğüm noktalar.**
- **(a) G-4'e kısmen katılmıyorum.** Sayımla hukuktan bağımsız başlamak doğru. Ama "alarm ürünü ~1. ayın sonunda"
  ifadesi deneme için doğru, satış için iyimser. Yalnız hacim söyleyen bir alarm danışanın ilk sorusunu ("ne oldu?")
  yanıtlamaz. Ara çözüm: alarm, o zaman aralığı için X'te arama bağlantısı verir; danışman gönderileri X'te kendisi
  okur. Sistem gönderi işlemez, kazıma da yapılmaz. Böylece A1 satılabilir hâle gelir ve kişisel veri işlenmez.
  Netleştiren soru: S5.1, S1.3.
- **(b) PLAN §11.5'teki "X'e yazılı soru önerilir" görüşüne ve G-6 / G-10'un bu yola dayanmasına katılmıyorum (en
  azından otomatik olarak).** Yazılı soru kullanımı X'e duyurur; olumsuz yanıt, bugün gri olan bir alanı kayıtlı bir
  ihlale çevirir ve X erişimini riske atar. Fayda (belirsizliğin kapanması) ile bu risk avukat tarafından tartılmalı.
  Netleştiren soru: S5.3.

---

## 5. Mülakat sonrası güncelleme haritası

| Yanıt alanı | `PLAN.md` | `YONETICI-OZETI.md` | `F-GRI-ALAN.md` |
|---|---|---|---|
| S1.1–S1.2 bütçe ve ölçek | §2.2 danışan başına bütçe; §2.3 toplam örnek; §11 karar 1 kapanır | §5 maliyet; §10 madde 1 | — |
| S1.3 ana ürün | §1.2 ne üretir (sıra); §9 aşama sırası | §3 değer önerisi; §8 takvim | — (kitle içgörüsü seçilirse §3–4 öne çıkar) |
| S1.4 satış fiyatı | Yeni §2.6 "birim ekonomi: danışan türü başına asgari fiyat" | §5'e bir satır | — |
| S2.1 danışan türü (+ hesap izni) | §2.3 tablo; §2.2 kritik alt küme (E-4); §9 A5 pilot | §5 örnek | — |
| S2.2 kamu kurumu | §2.4; §10 riskler | §5 son madde | — |
| S2.3 rakip danışanlar | §3.2 örnek kütüphanesi; §8 etiketçi; yeni §6.5 "danışanlar arası ayrım" | §6 insan | §3 G8 sözleşme mimarisi |
| S2.4 "%20 insan" | §3.2 döngü ve beklenen seyir; §8 etiketçi kapasitesi | §4 algoritma; §6 insan | — |
| S3.1 uyum ayarı | §6.4 kimliksiz mod | §7 siyasi danışanlar | §4 uyum profili |
| S3.2 adla izleme eşiği | §6.3 yol 2 | §7 | §3 G3 (risk 🟡/🟠), §4, §6 soru 4 |
| S3.3 kendi etkinliği | §4 uyum koruması | — | §5 madde 5'e açıklama notu (çizgi değişmez) |
| S3.4 "organize mi" | Yeni §6.6 "koordinasyon işaretleri"; §9 A3 | §9 bilinen sınırlar | — |
| S4.1 etiketçi | §8; §9 A0 (işe alım) ve A2 | §6; §10 madde 4 | — |
| S4.2 kullanıcının süresi | §3.2 tek etiketçi telafisi; §8 danışman satırı | §6 | — |
| S4.3 hız sözü | §4 önem düzeyleri; §8.1 nöbet | §6 7/24 paragrafı | — |
| S4.4 teslim biçimi | §1.2; §9 A3; aktarım sınırı ve gösterim kuralı (E-2) | §3 | — |
| S5.1 başlama sırası | §5.2 son cümle; §9 A0–A1 | §8 takvim; §9 son madde | — |
| S5.2 kriz bütçesi | §2.2 taşma bütçesi ve bozulmuş mod | — | — |
| S5.3 X'e yazılı soru | §6.3 yol 2 ve 7; §11 karar 5 | §7 madde 2; §10 madde 5 | §6 avukat soruları (yeni madde) |
| S5.4 haber | §2.5; §4 "haber geçişi" | §10 (yeni madde) | — |
| A-2 son kriz | §9 A1 kapısı: ilk geçmiş olay; §4 kural şablonları | — | — |
| A-3 Future Bright | §7 | §7 | §1 hüküm (G-7 ile birlikte); §3 G1, G7 |
| A-4 değer önerisi | §1.2 | §3 | — |
| A-5, E-5, E-6 kurulum ve gizlilik | §1.1 izleme tanımı; yeni §5.3 "danışan verisinin korunması" | §6 | — |

Mülakat bitince `BRIEF-YENI-SOHBET.md` §8'deki açık kararlar listesi de yanıtlara göre kapatılır.
