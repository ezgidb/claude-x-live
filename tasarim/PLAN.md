# Rasat — uygulama planı (sürüm 4: yalın ve gerçekçi)

Yazan: lider. Tarih: 20 Kasım 2026. Önce `YONETICI-OZETI.md` okunmalı; bu belge onun ayrıntısıdır.

**Bu sürümde ne değişti.** Sürüm 3 (`arsiv/PLAN-v3-tam-olcek.md`) "fiyat kaygısı yok" varsayımıyla yazılmıştı: X'in
kurumsal paketi (ayda 42–50 bin $'dan başladığı söyleniyor), 7/24 analist nöbeti, 20 rollük kadro. Kullanıcı yeni
koşulları belirledi:

| Konu | Yeni koşul |
|---|---|
| Bütçe | Makul, aylık. Mesajdaki "3000" rakamı **aylık ~3.000 $ tavan** diye varsayıldı (teyit bekleniyor). |
| Kanal | **X** (zorunlu) + **haber** (isteğe bağlı, danışan isterse) + **ek belge** (isteğe bağlı: danışanın verdiği rapor, basın bülteni vb.). Diğer platformlar şimdilik yok. |
| Kullanım | Danışan "ne oluyor" diye sıfırdan sormaz: **kelimeleri, hesapları, değerleri ve hassasiyetleri kendisi verir**; sistem bunlara göre kurulur. |
| İnsan | En az. Başlangıçta ve doğruluğu artırmak için **bir etiketçi**; bir **hukukçu**; danışman (kullanıcı) aksiyon ve önerilerde. Toplama, takip, analiz ve çıktı yapay zekâda. |
| Öğrenme | İnsanın doğruladığı **~%20** veriden öğrenip kalan **~%80**'de **≥ %90 doğrulukla** karar veren, gerekçe isteyen bir döngü. |
| Alarm | Duygudan bağımsız, **nicel** kurallar: hacim artışı, trend kırılması, "şu hesaplarda şu kelimeler", vb. |
| Danışanlar | **Siyasi danışanlar olacak.** |
| İş modeli | Araç satılmıyor; danışanlara **hizmet** satılıyor. |

Doğruluk ilkeleri değişmedi: sayım kesindir, yorum örnekleme dayanır ve öyle etiketlenir; neden-sonuç yazılmaz;
kör noktalar gösterilir; her sayının dayanağı vardır.

**Dayanak (bu turda birincil kaynaktan doğrulananlar):**
- X fiyatları ve tavanı: X'in kendi fiyat sayfası (docs.x.com, 20.11.2026'da okundu).
- X kısıtlı kullanım kuralları ve sözleşmenin "Kullanıcı Koruma" maddesi: docs.x.com (aynı gün okundu, birebir
  alıntılar bölüm 6'da).
- Yapay zekâ fiyatları: Claude API güncel fiyat tablosu.
- KVKK özel nitelikli veri: KVKK'nın 2025 rehberinin ikincil özetleri (KVKK sitesi sertifika hatası verdiği için
  doğrudan okunamadı) — **avukat doğrulayacak**.
- Future Bright örnek belgesi: `E-FUTURE-BRIGHT.md`.

---

## 1. Ürün: danışan tanımından başlayan izleme

### 1.1 İzleme tanımı (danışan verir, sistem tamamlar, danışman onaylar)

| Alan | Kim verir | Sistem ne ekler |
|---|---|---|
| Kelimeler ve ifadeler | Danışan / danışman | Yazım varyantları (Türkçe karakterli-karaktersiz, ekli biçimler, yaygın yazım hataları), birlikte geçen etiketler, lakaplar — **öneri olarak**; her önerinin kaç gönderi eklediği sayımla gösterilir |
| İstenmeyen anlamlar (eşsesli) | Danışman | Örnek gönderilerle "bu anlam mı?" soruları |
| Hesaplar | Danışan | Hesap türü kontrolü: kurum, medya, kamusal figür mü (bölüm 6.3) |
| Değerler ve hassasiyetler | Danışan | Kod kitabına "danışan için önemli konu" etiketleri |
| Alarm kuralları | Danışan / danışman | Hazır kural şablonları (bölüm 4), geçmiş veride deneme |
| Kanallar | Danışan | X her zaman; haber ve belge açılıp kapanır |

Tanım **sürümlüdür**: her değişikliğin hacme etkisi sayım verisiyle ölçülür, geçmiş 30 gün üzerinde denenir, sonra
etkinleşir.

### 1.2 Ne üretir
1. **Alarmlar** (bölüm 4) — telefona, önem düzeyine göre.
2. **Pano** — hacim, trend, alarmlar, anlatılar, en çok yayılan gönderiler, kör noktalar, kalite.
3. **Durum notu ve öneri taslağı** — dayanaklı; danışman aksiyonu belirler.
4. **Danışan raporu** — dışa aktarılabilir; zorunlu "kapsam, güven ve uyum" bölümüyle.
5. **Konuşarak sorgu** — "geçen haftaya göre ne değişti", "bu çerçeve hangi olaylarda görüldü".

### 1.3 Mevcut koddan ne kullanılır
- **Nabız**'ın "önce ucuz sayım, sonra hedefli okuma" yaklaşımı bu bütçede tam doğru yaklaşımdır; X istemcisi, harcama
  defteri, onay kapısı ve gözlem günlüğü buraya taşınır.
- **Pusula**'nın veri biçimleri, analiz modülleri (anlatı, yayılım, risk) ve yanıt planı yaklaşımı temel alınır;
  demo verisi yalnız yazılım testi içindir.
- **Kule**'nin "yetenek + kapı + konuşan katman" fikri konuşarak sorgu için kullanılır.

---

## 2. Veri stratejisi ve bütçe

### 2.1 X fiyatları (X'in kendi sayfasından)

| Kalem | Birim fiyat |
|---|---|
| Gönderi okuma | 0,005 $ / gönderi |
| Hesap (kullanıcı) okuma | 0,010 $ / hesap |
| Takip/takipçi okuma | 0,010 $ / kayıt |
| Sayım — son 7 gün | 0,005 $ / istek |
| Sayım — tam arşiv | 0,010 $ / istek |
| Aylık tavan | 3 milyon gönderi okuma (aşılırsa kurumsal paket gerekir) |
| Tekrar | Aynı gönderi aynı gün (UTC) içinde bir kez ücretlenir |

Sözleşme yok, kredi yüklenir, harcama tavanı konabilir. Canlı akış (filtered stream) da gönderi başına ücretlenir.

**Doğrulanacak (A0'da birkaç dolarlık denemeyle):** gönderiyle birlikte gelen yazar bilgisinin ayrıca "hesap okuma"
olarak ücretlenip ücretlenmediği. Ücretleniyorsa gönderi başı maliyet 0,005 $ değil, 0,015 $'a kadar çıkabilir (aynı
yazar gün içinde bir kez ücretlenir).

### 2.2 İki katmanlı toplama: doğruluktan kısmadan ucuz

**Kesin katman (her zaman, çok ucuz):** sayım uçlarıyla her 15 dakikada hacim. Bir sayım isteği bir haftalık saatlik
seriyi tek seferde verir; danışan başına günde ~100 istek ≈ **ayda 15–30 $**. Hacim, trend, olağan düzey ve hacim
alarmları bu katmandan gelir ve **kesindir** (sorgunun sayısı olarak).

**Okuma katmanı (bütçeli):**

| Durum | Yöntem | Doğruluk etkisi |
|---|---|---|
| Normal hacim (bütçenin altında) | Eşleşen gönderilerin **%100'ü** canlı akışla okunur | Örnekleme hatası yok |
| Yüksek hacim / kriz | **Tabakalı örnek**: zaman dilimi × içerik türü (özgün/yanıt/alıntı) dengeli; ayrıca **kritik alt kümeler tam okunur** (danışanın hesaplarına yanıtlar, kural eşleşmeleri, büyük hesaplar) | Oranlar güven aralığıyla verilir; hacim yine sayımdan kesin |
| "En çok yayılan gönderiler" | Yeniden paylaşımlardan alınan küçük örnekte en sık geçen özgün gönderiler bulunur (en çok yayılanlar örnekte kendiliğinden öne çıkar); bunlar tek tek okunur | Az okumayla en çok yayılanlar yakalanır |
| Etkileşim sayıları | Öne çıkan gönderiler 1, 6, 24 saat sonra yeniden okunur | "Donmuş" beğeni sorunu (Pusula P8) çözülür |

**Danışan başına bütçe:** her danışana aylık okuma bütçesi ve kriz için ek "taşma" bütçesi tanımlanır. Bütçe
dolarsa sistem durmaz: okuma örnekleme geçer, sayım ve alarm sürer; danışman bilgilendirilir.

**Bütçeyi önceden bilmek:** yeni bir danışan alınmadan önce son 30–90 günün hacmi tam arşiv sayımıyla birkaç dolara
ölçülür. Danışana teklif verilmeden önce aylık maliyet bilinir.

### 2.3 Örnek aylık maliyetler (yaklaşık)

| Danışan türü | Günlük ilgili gönderi | Okuma yöntemi | X maliyeti / ay |
|---|---|---|---|
| Orta ölçekli marka | ~300 | %100 | ~45–135 $ |
| Büyük marka (sakin dönem) | ~3.000 | %100 | ~450–1.350 $ |
| Yerel siyasetçi / kurum | ~1.000–5.000 | %100 ya da kısmi örnek | ~150–1.000 $ |
| Ulusal siyasetçi | 50.000–200.000 | Sayım + %3–5 tabakalı örnek + kritik alt kümeler | ~800–2.000 $ |

Aralığın alt ucu yazar bilgisinin ayrıca ücretlenmediği, üst ucu ücretlendiği durumdur. **Ulusal ölçekte bir siyasi
danışan bütçenin ana belirleyicisidir.** Tablo örnektir; gerçek hacim A0'da sayımla ölçülür.

**Yapay zekâ maliyeti** (Claude API güncel fiyatları; milyon token başına giriş / çıkış):

| Model | Fiyat | Kullanım | Tahmini maliyet |
|---|---|---|---|
| Haiku 5.5 | 0,10 $ / 0,50 $ (toplu işte %50 indirim) | Her gönderinin ilk okuması | 1.000 gönderi ≈ 0,01–0,02 $ → ayda 300 bin gönderi ≈ **3–6 $** |
| Sonnet 5.5 | 2 $ / 10 $ | Belirsiz gönderilerde ikinci görüş (~%20) | 1.000 gönderi ≈ 0,15 $ → ayda ≈ **10–20 $** |
| Opus 5.5 | 4 $ / 20 $ | Durum notu, öneri taslağı, konuşma | Not başı ≈ 0,10–0,15 $ → 10 danışan × günde 4 not ≈ **ayda 120–180 $** |

**Sonuç:** yapay zekâ maliyeti küçüktür (ayda ~150–300 $). Maliyetin asıl kalemi X verisidir. Sunucu (Türkiye'de)
ayda ~50–200 $.

**Toplam örnek (5 danışan, biri ulusal siyasetçi):** X ~1.500–2.500 $ + yapay zekâ ~150–300 $ + sunucu ~100–200 $ ≈
**ayda 1.800–3.000 $** (insanlar ve hukuk hariç). Ulusal siyasetçi olmadan ≈ 500–1.000 $.

### 2.4 Kurumsal pakete ne zaman geçilir
1. **Danışan bir devlet kurumuysa** (belediye, bakanlık, kamu kuruluşu ya da onlar adına çalışan biri): X sözleşmesi
   (Madde "Government Use") bu kullanıcılara X içeriği ya da ondan türetilmiş bilgi sunmak için **kurumsal paketi
   zorunlu** tutuyor ve her kamu kullanıcısının X'e bildirilmesini istiyor. Bu, siyasi danışanlarda kritik bir ayrım:
   **parti ya da siyasetçi kişisel olarak** kamu kurumu değildir; **belediye başkanlığı makamı** kamu kurumudur.
   Avukat netleştirmeli.
2. Aylık 3 milyon gönderi okuma tavanı aşılırsa.
3. Kapsamı doğrudan ölçmek gerekirse (%10 rastgele örneklem akışı yalnız kurumsal pakette).

Bu üç durum yoksa kullandıkça öde yeterlidir.

### 2.5 Haber ve belge (isteğe bağlı)
- **Haber:** GDELT (ücretsiz, 15 dakikada bir, Türkçe dahil) + bir ticari haber API'si (aylık ~90 $'dan başladığı
  bildiriliyor; doğrulanacak). Google Haberler RSS'inin koşulları ticari olmayan kullanım diyor; hizmet satıldığı için
  **kullanılmaz**. Ajans aboneliği (AA) isteğe bağlı, teklifle.
- **Ek belge:** danışanın verdiği PDF/Word/sunum (bülten, önceki rapor, kurum içi brif). Sisteme bağlam olarak
  yüklenir; yalnız o danışanın alanında durur; yapay zekâya gönderimi aynı KVKK kuralına tabidir.

---

## 3. Doğruluk: tek etiketçiyle öğrenen sistem

### 3.1 Hedefler (sürüm 3'ten korunan, yalınlaştırılan)

| Boyut | Hedef | Nasıl ölçülür |
|---|---|---|
| İlgililik (alakasız girmesin) | Otomatik kararlarda ≥ %90 | Günlük rastgele denetim örneği (etiketçi, sistemin kararını görmeden) |
| Kapsam (ilgili kaçmasın) | ≥ %85–90 (dolaylı tahmin) | Varyant sayımları + geniş sorgudan haftalık örnek + bilinen-öğe listeleri (bölüm 3.4) |
| Anlama (duruş, konu, çerçeve) | Otomatik kararlarda ≥ %90; alay ayrıca raporlanır | Aynı denetim örneği |
| Alarm | Gerçek olayların ≥ %90'ı; danışan başına haftada ≤ 1 yanlış kırmızı | Geçmiş olaylarda deneme + canlı kayıt |
| Sunum | Her sayı hesaptan; her olgusal cümle kayda bağlı | Otomatik denetçi |

Ölçüm, bütün danışanlar üzerinde 4 haftalık birikimle yapılır; tek haftalık değer yalnız uyarıdır (sürüm 3'teki
istatistik dersi).

### 3.2 Öğrenen etiketleme döngüsü ("%20 insan, %80 makine")

```
 Gönderi ─► 1. Okuma A (Haiku + benzer etiketli örnekler + kod kitabı)
         └► 2. Okuma B (farklı yöntem: Sonnet ya da örnek-benzerliği oylaması)
                     │
                     ▼
           3. Güven = iki okumanın uyumu + kalibre olasılık
                     │
        ┌────────────┴─────────────┐
   güven ≥ eşik                güven < eşik
        │                           │
   OTOMATİK KARAR             İNSAN KUYRUĞU (öncelik: belirsizlik × erişim × çeşitlilik)
        │                           │  etiket + gerekçe (≤ 10 sn)
        │                           ▼
        │                 4. Örnek kütüphanesine girer ──► sonraki okumalarda örnek olur
        │                 5. Gerekçeler haftalık "kural önerisi"ne dönüşür ──► danışman onayıyla kod kitabına
        ▼
   6. DENETİM: otomatik kararlardan rastgele küçük pay insana kör gider ──► gerçek doğruluk, kayma
   7. EŞİK AYARI: denetim sonuçlarına göre eşik, otomatik kararların doğruluğu ≥ %90 kalacak şekilde
```

**Nasıl çalışır, sade dille:**
1. Sistem her gönderiyi **iki farklı yoldan** okur. İki okuma aynı sonuca varıyor ve model emin görünüyorsa karar
   otomatik verilir.
2. Emin olmadığı gönderiler etiketçiye gider. Etiketçi kararı ve **gerekçeyi** hızlıca seçer: "alay işareti var",
   "hedef danışan değil", "eşsesli", "haber aktarımı", "soru", "çerçeve: …" ve isterse kısa not ya da metinde işaretleme.
3. Her insan kararı bir **örnek kütüphanesine** girer. Sistem yeni bir gönderiyi okurken kütüphaneden en benzer
   örnekleri ve gerekçelerini kendi okumasına ekler. Yani "öğrenme" model eğitmek değil, **benzer durumlarda insanın ne
   dediğini görmek**tir. Bu iki şey kazandırır: (a) X'in model eğitimi yasağına takılmaz (bölüm 6.1); (b) her öğrenme
   adımı görünür ve geri alınabilir.
4. Gerekçeler haftada bir toplanıp kural önerisine dönüşür ("'tebrikler' + olumsuz bağlam → alay olasılığı yüksek").
   Danışman onaylarsa kod kitabına girer.
5. **Dürüst ölçüm:** otomatik kararların küçük bir rastgele payı da etiketçiye, sistemin kararı gösterilmeden gider.
   "%90 doğru" iddiası yalnız bu ölçümden gelir; kuyruğa düşen zor örneklerden değil.
6. **Eşik kendini ayarlar:** denetimde doğruluk %90'ın altına inerse eşik yükselir (daha çok gönderi insana gider);
   kütüphane büyüdükçe eşik düşer ve otomatik pay artar.

**Beklenen seyir (her görev için ayrı ölçülür):**

| Dönem | İnsana giden pay | Otomatik kararların doğruluğu |
|---|---|---|
| İlk 2–4 hafta (tohum) | %30–50 | Ölçülüyor; eşik temkinli |
| 2–3. ay | ~%20 | ≥ %90 hedef |
| Olgun dönem | %5–10 + denetim örneği | ≥ %90 korunur |

**Dürüst sınır:** "%20 insan ile %80'i ≥ %90 doğrulukla" **ilgililik** ve **kaba duruş** (destek / eleştiri / nötr)
için gerçekçi. **Alay ve ima** için büyük olasılıkla değil. Bu gönderiler zorla karara bağlanmaz, **"belirsiz"**
etiketiyle gösterilir; oranlar bunları ayrı bir dilim olarak taşır.

**Tek etiketçinin sınırı:** iki kişi arasındaki uyum ölçülemez (sürüm 3'te en az iki etiketçi vardı). Telafi:
(1) etiketçi iki hafta sonra aynı örneklerin %10'unu yeniden etiketler (kendi tutarlılığı); (2) danışman haftada
~30 zor örneği bağımsız etiketler; (3) ilk tohum kümesi (~300 örnek) için 2–4 hafta ikinci bir geçici etiketçi önerilir.

### 3.3 Kod kitabı
Her danışan için kısa bir etiket sözlüğü: ilgili / ilgisiz tanımı, duruş türleri, danışanın değer ve hassasiyet
etiketleri, çerçeve (söylem) etiketleri, sınır örnekleri. Danışman yazar, sistem örneklerle önerir; sürümlüdür.

### 3.4 Kapsamı ucuza ölçmek
Kurumsal paketin rastgele örneklem akışı olmadan kapsam **dolaylı** ölçülür ve ekranda öyle yazılır:
1. **Varyant katkısı:** her varyantın kaç gönderi eklediği sayımla (çok ucuz). Eklenmemiş bir varyant çok gönderi
   getiriyorsa kapsam açığı vardır.
2. **Geniş sorgu örneği:** haftada bir, danışan sorgusundan daha geniş bir sorgudan ~200 gönderi okunur; etiketçi
   aralarında sisteme girmemiş ilgili gönderi var mı bakar.
3. **Yanıt ve alıntı ağı:** ilgili gönderilere gelen yanıt ve alıntılar ayrı bir yoldan toplanır; ana sorgunun bunların
   kaçını zaten yakaladığı ikinci bir kapsam tahmini verir.
4. **Bilinen-öğe listesi:** danışmanın ya da danışanın başka yoldan gördüğü gönderiler sisteme girilir; kaçı yakalanmış
   ölçülür.

---

## 4. Alarm kural motoru (duygudan bağımsız)

| Kural türü | Örnek | Veri | Maliyet |
|---|---|---|---|
| **Hacim sapması** | "Son 1 saatte olağanın (günün saatine göre) 3 katı" | Sayım | Çok düşük |
| **Trend kırılması** | "Artış hızı son 3 saatte iki katına çıktı" / "düşüş başladı" | Sayım | Çok düşük |
| **Eşik** | "Günlük 5.000 gönderiyi geçerse" | Sayım | Çok düşük |
| **Hesap + kelime** | "@kurum_hesabı 'zam' ya da 'istifa' yazarsa" | Canlı akış kuralı | Yalnız eşleşen gönderi |
| **Kelime birlikteliği** | "Danışan adı + 'boykot' birlikte 50'yi geçerse" | Sayım | Çok düşük |
| **Yeni ifade belirmesi** | "Danışanla birlikte daha önce görülmemiş bir etiket hızla yükseliyor" | Okuma örneği | Düşük |
| **Büyük hesap girişi** | "100 bin üstü takipçili bir hesap konuya girdi" | Okuma | Düşük |
| **Haber geçişi** | "Konu bir haber sitesinde çıktı" | Haber (isteğe bağlı) | Düşük |
| **Çerçeve yükselişi** | "'X çerçevesi' payı son 6 saatte %10'dan %30'a çıktı" | Okuma + sınıflama | Düşük |

- Her kural kurulurken **geçmiş 30–90 günde denenir**: "bu kural geçen ay kaç kez öterdi, hangi olayları yakalardı?"
  Sessiz ya da çok gürültülü kural kurulmadan görülür.
- Önem düzeyleri: bilgi (panoda), dikkat (uygulama bildirimi), kırmızı (telefon; okunmazsa tekrar). Gece için ayrı eşik.
- **Uyum koruması:** X sözleşmesi protesto, miting ve topluluk toplantısı gibi **hassas olayları izleme ve uyarı
  kurmayı** yasaklıyor. Kural motoru bu tür kuralları reddeder ve nedenini söyler. "Hesap + kelime" kuralları yalnız
  kurum, medya ve kamusal figür hesaplarında kurulabilir (bölüm 6.3).

---

## 5. Yapay zekâ katmanı ve KVKK

### 5.1 Modeller
- **Haiku 5.5:** her gönderinin ilk okuması (toplu işle).
- **Sonnet 5.5:** belirsiz gönderilerde ikinci görüş.
- **Opus 5.5:** durum notu, öneri taslağı, konuşma.
- Sayılar her zaman hesap katmanından gelir; model sayı yazmaz, yer tutucu kullanır; denetçi kontrol eder (sürüm 3,
  bölüm 3.5).
- Gönderi metnini okuyan model hiçbir işlem yapamaz; işlem yapan model gönderi metnini görmez (sürüm 3'teki karantina
  ilkesi). Bu, gönderilere gizlenmiş "talimat"lara karşı korumadır.

### 5.2 KVKK: yurt dışına aktarım
Gönderileri yurt dışındaki bir yapay zekâ hizmetine göndermek yurt dışına aktarımdır. Claude API'de işlem yeri yalnız
"küresel" ya da "ABD" seçilebiliyor; Türkiye ya da AB bölgesi yok. Sağlayıcının KVKK standart sözleşmesini imzaladığına
dair kaynak bulunamadı. Üç yol (avukat görüşüyle seçilir):

| Yol | Ne | Artı | Eksi |
|---|---|---|---|
| **1. Sözleşmeyle bulut** | Sağlayıcıyla KVKK standart sözleşmesi + 5 iş günü içinde Kurul'a bildirim + sıfır saklama | En iyi kalite, en düşük maliyet, en hızlı kurulum | Sağlayıcının imzalaması gerekiyor; olmayabilir |
| **2. Ayıklayarak bulut** | Kullanıcı adı, @etiket, kişi adı, bağlantı gönderilmeden önce yer tutucuya çevrilir; yalnız metin içeriği gider | Aktarılan kişisel veri azalır | Metin içinde kalan özel nitelikli veri (ör. siyasi görüş) için tek başına yetmeyebilir |
| **3. Türkiye'de model** | Açık ağırlıklı bir model Türkiye'deki sunucuda | Aktarım yok | Kalite düşük olabilir; ölçülmeli; sunucu maliyeti artar (GPU) |

**Öneri:** avukat 1. yolu uygun bulursa 1 + 2 birlikte; bulmazsa 2 + 3 karma (ilk okuma Türkiye'de, belirsizlerde
ayıklanmış metinle bulut — avukat izin verirse). Karar verilene kadar gerçek veriyle çalışılmaz.

---

## 6. Siyasi danışanlar: ne yasak, ne yapılabilir

### 6.1 X'in kuralları (birebir, docs.x.com, 20.11.2026)

**Hassas bilgi:** *"Never derive or infer, or store derived or inferred, information about a X user's: … Political
affiliation or beliefs …"* — Bir X kullanıcısının siyasi eğilimini veya inancını türetmek, çıkarmak ya da çıkarılanı
saklamak yasak.

**İstisna:** *"Aggregate analysis of X content that does not store any personal data (for example, user IDs, usernames,
and other identifiers) is permitted, provided that the analysis also complies with applicable laws…"* — Kişisel veri
(kullanıcı kimliği, kullanıcı adı, diğer tanımlayıcılar) **saklamayan toplu analiz serbest.**

**Sözleşme, Kullanıcı Koruma maddesi:** X'in yazılı onayı olmadan X içeriği ya da ondan türetilen bilgi şu amaçlarla
kullanılamaz: (a) gözetim, istihbarat, X kullanıcılarını araştırma ya da izleme; (c) **hassas olayları (protesto,
miting, topluluk örgütlenme toplantıları) izleme**; (d) **bireyleri siyasi eğilim ya da inanç gibi hassas bilgilere
göre hedefleme, gruplama ya da profilleme.**

**Diğer yasaklar:** bireysel profilleme ya da psikografik gruplama; X hesabını açık rıza olmadan X dışı kimlikle
eşleştirme; X içeriğiyle temel/öncü model eğitimi (Grok hariç).

**Kamu kullanıcıları:** X içeriğini bir devlet kurumuna sunmak kurumsal paket ve X'e bildirim gerektirir (bölüm 2.4).

### 6.2 "Solcu demeden solcu deyim" yaklaşımı neden işe yaramaz
Önerilen yöntem: kişileri doğrudan "solcu" diye etiketlememek, ama bir olayda "solcu deyimler kullanıyor" başlığı
altında gruplamak; sonra 5 ayrı olayda bu deyimleri kullanan kişi kümelerini bulmak.

**Bu, X'in yasakladığı şeyin ta kendisidir.** Belirleyici olan etiketin adı değil, sonucudur. Sonuçta **kimliği belli
kişiler, çıkarılmış siyasi eğilimlerine göre gruplanıyor ve birden çok olay boyunca izleniyor.** Bu, X'in (d) maddesi
(siyasi eğilime göre gruplama/profilleme), (a) maddesi (kullanıcıları izleme) ve "bireysel profilleme" yasağına girer.
KVKK açısından da siyasi düşünce özel nitelikli veridir. Kurum rehberine göre sosyo-politik tutum ve davranışlar da bu
kapsamdadır. 7499 sonrası "ilgili kişinin alenileştirdiği ve **alenileştirme iradesine uygun**" işleme şartı vardır,
ama "kamuya açık bir yerde bulunması tek başına yeterli değildir". Bir kişinin tweet atma iradesi, onun siyasi
profilinin çıkarılıp mesaj hedeflemesinde kullanılmasını kapsamaz (bu bir çıkarım, avukat doğrulamalı). Yaptırım
şikâyetle başlar; "henüz sorun yaşanmamış olması" uyumlu olunduğu anlamına gelmez.

### 6.3 Yasaya ve sözleşmeye uygun yollar

| # | Yol | Ne sağlar | Artı | Eksi / risk | Risk |
|---|---|---|---|---|---|
| **1** | **Söylem çerçevesi haritası (kimliksiz)** | Etiket **gönderiye** konur, kişiye değil: "bu olayda 'X çerçevesi' %30, en çok şu ifadelerle, şu saatlerde yükseldi". Çerçeveler olaylar arası karşılaştırılır: "bu çerçeve son 5 olayda nasıl seyretti, hangi kelimelerle birlikte geldi". Kullanıcı kimliği saklanmaz. | Mesaj tasarımı için asıl gereken bilgi (hangi dil, hangi kaygı, ne zaman) | Aynı kişileri olaylar arasında bağlamaz | **Düşük** (X'in toplu analiz istisnası; KVKK için avukat) |
| **2** | **Kamusal aktör defteri** | Siyasetçiler, partiler, medya kuruluşları, kurumlar, STK'lar, kurumsal kimliğiyle yazan gazeteciler: kamusal açıklamaları adla izlenir ve analiz edilir. Siyasi aidiyetleri **çıkarılmaz**, kendi beyanlarıdır (parti üyeliği, görev). | Rakip ve paydaş takibi; kim ne zaman ne dedi | X'in "kullanıcıları izleme" yasağında kamusal figür istisnası **yazılı değil** | **Orta** → X'e yazılı sorulmalı |
| **3** | **Konu temelli iş birliği keşfi** | İş birliği ya da mesaj için içerik üreticisi bulma: kişinin **siyasi eğilimine** değil, **konusuna** (tarım, eğitim, yerel yönetim) ve kamusal/profesyonel hesap olmasına göre. İletişim kamusal iş kanallarından; profil ancak **rızayla** derinleşir. | Doğrudan ortak çalışma önerisi | Siyasi uyum varsayılamaz; görüşmede netleşir | **Düşük–orta** |
| **4** | **Platform reklam hedeflemesi** | Kitleye ulaşmayı platform yapar: anahtar kelime, ilgi alanı, belirli kamusal hesapların takipçilerine benzer kitle. Kişi listesi elinizde hiç olmaz. | Ölçeklenir; sorumluluk platform kurallarında | Siyasi reklam kuralları ülkeye göre değişir; Türkiye'deki durumu doğrulanamadı | **Platform kuralına bağlı** |
| **5** | **Rızaya dayalı panel ve kendi kanallarınız** | Gerçek kişi düzeyinde görüş gruplaması gerekiyorsa: açık rızalı anket paneli, bülten, topluluk. Özel nitelikli veri için açık rıza. | Hukuken en temiz; derin bilgi | Zaman ve maliyet; X verisi değil | **Düşük** |
| **6** | **"Kimlerin takip ettiği" toplu yakınlık** | Bir çerçeveyi kullanan gönderilerin yazarlarının en çok takip ettiği **kamusal** hesaplar, kişiler saklanmadan toplu sayımla hesaplanır. Çıktı yalnız kamusal hesap listesi ve oranlar. | "Hangi ünlüler/kanallar bu kitleye ulaşıyor" | Pahalı (takip listesi okuma hesap başı 0,010 $, kişi başına yüzlerce kayıt); geçici işleme de siyasi çıkarıma yakın | **Gri** → avukat + X |
| **7** | **X'ten yazılı onay** | Sözleşme "X'in yazılı onayı olmadan" diyor; belirli bir siyasi kullanım için başvurulabilir | Tek meşru "bireysel" yol | Onay olasılığı düşük; kurumsal paket gerekebilir | — |

**Kurulmayacak olanlar:** olaylar arası kişi düzeyinde siyasi/etnik/dini kümeleme; böyle bir listeden benzer kitle
(lookalike) ya da yeniden hedefleme; X hesaplarını rıza olmadan gerçek kişilerle eşleştirme; miting, protesto, eylem
izleme ve uyarısı.

### 6.4 Mimari karşılığı: "kimliksiz analiz modu"
Siyasi konularda (ve danışan isterse her konuda) sistem şöyle çalışır:
1. Gönderi okunur, çerçeve/konu/duruş etiketi **gönderiye** konur.
2. Toplu sayılar (çerçeve payı, saatlik seri, birlikte geçen kelimeler) hesaplanır.
3. **Kullanıcı kimliği ve kullanıcı adı saklanmaz.** Aynı gönderinin iki kez sayılmaması için geçici bir kimlik
   kullanılır ve analiz penceresi kapanınca silinir.
4. Kamusal aktör defterindeki hesaplar (yol 2) bu kuralın dışındadır; X'in yazılı yanıtına göre açılır.
5. Rapora "bireysel çıkarım yapılmadı, kullanıcı kimliği saklanmadı" beyanı girer.

---

## 7. Future Bright örneği: ne öğrendik

Ayrıntı: `E-FUTURE-BRIGHT.md`. Paylaşılan belge, bir gıda markasının bir spor kulübü sponsorluğuna verilen tepkiyi
inceleyen yapay zekâ destekli bir kitle analizi sunumu (Temmuz–Ekim 2025). Belgede "Future Bright" adı geçmiyor.

**Ne yapmışlar:**
- ~41.600 kişiyi ağ verisiyle 4 segmente bölmüşler. Segmentler **etnik kimlik ve ideolojik eğilim** çizgisinde
  kurulmuş ve yargılayıcı adlar taşıyor.
- Yaklaşık 80 etkileyici hesabı adıyla listelemişler.
- Segmentleri reklam hedeflemesine bağlamışlar: benzer kitle, yeniden hedefleme, rakip hesabın takipçilerini hedefleme.
- Sıradan kullanıcı adı ya da gönderi alıntısı yok; yüzler sentezle anonimleştirilmiş.
- **Belgede KVKK, rıza, saklama, kaynak ya da platform koşullarına dair tek cümle yok.** Doğruluk ya da güven beyanı da
  yok.

**Değerlendirme:**
- Sunum "toplu" görünüyor, ama segmentin her kişiye atanması ve reklam hedeflemesine taşınması, X'in (d) maddesinin ve
  KVKK'nın özel nitelikli veri kuralının tam ortasında duruyor.
- Bu belge bir "boşluk" değil, **henüz şikâyet almamış bir risk** örneği. Model alınmamalı.

**Alınabilecek iyi uygulamalar:**
- Olayı fazlara bölen kronoloji anlatımı.
- Faz başına kelime ve niyet tabloları.
- Arama niyeti (SEO) tablosu.
- Görsel anonimleştirme.

**Rasat'ın farkı (danışanlara satış argümanı):** her raporda kaynak, kapsam, güven aralığı, kullanılan yöntem ve
**uyum beyanı.**

---

## 8. İnsan ihtiyacı

| Kim | Ne iş | Ne kadar | Ne zaman |
|---|---|---|---|
| **Danışman (siz)** | Kriterleri ve izleme tanımlarını onaylamak; kırmızı alarmın muhatabı olmak; öneri ve aksiyon; haftalık kalite gözden geçirme (~30 zor örnek dahil) | Haftada ~3–5 saat + alarmlar | Sürekli |
| **Etiketçi / kalite sorumlusu** | Tohum kümesi, kod kitabı; günlük kuyruk; gerekçeli etiketler; günlük denetim örneği; varlık dosyası bakımı | İlk 2–3 ay **tam zamanlı**, sonra **yarı zamanlı** (günde 1–2 saat; danışan sayısıyla artar) | Kurulumdan itibaren |
| **Geçici 2. etiketçi** (önerilir) | İlk tohum kümesinde uyum ölçümü; kriz haftalarında kuyruk | 2–4 hafta + gerektikçe | Kurulum, kriz |
| **Hukukçu** | KVKK görüşü, aktarım yolu, X sözleşmesi, siyasi danışan çerçevesi, rapor uyum beyanı, danışan sözleşmeleri | Kurulumda yoğun; sonra yılda bir gözden geçirme + gerektikçe | Başlamadan önce |
| **Teknik destek** | Kodu yapay zekâ yazar; sunucu, yedek, güvenlik, gizli anahtarlar ve arızada müdahale için çağrılabilir bir yazılımcı | Kurulumda yarı zamanlı, sonra çağrı üzerine | Kurulum + işletme |

**Toplam:** sabit 1 kişi (etiketçi) + siz + 2 dış destek (hukuk, teknik).

### 8.1 7/24 nöbet gerçekçi mi?
Bir haftada 168 saat var; tam zamanlı bir kişi ~40 saat çalışır. Tek bir koltuğu sürekli dolu tutmak 168 ÷ 40 ≈ 4,2
kişi eder; izin, hastalık ve vardiya çakışmalarıyla 5–6 kişi. Bu hesap doğru, ama **sizin için ne gerçekçi ne gerekli.**
Bu büyüklük ancak 7/24 izleme hizmeti satan büyük medya takip şirketleri ya da büyük ajanslar için anlamlı.

**Sizin modeliniz:**
- Makine 7/24 izler; insan 7/24 izlemez.
- Kırmızı alarm telefonunuza gelir; açılmazsa tekrar eder (isterseniz ikinci kişiye).
- Gece eşiği daha yüksektir: yalnız gerçekten büyük sıçramalar uyandırır.
- Gece gelen alarmlar "henüz insan doğrulamadı" etiketiyle gösterilir; doğrulama sabah yapılır.
- Kriz haftalarında geçici nöbet (siz + etiketçi) ya da yalnız o dönem için bir medya takip firmasından gece hizmeti.

---

## 9. Aşamalar

İlk kullanılabilir ürün (sayım + alarm) erken gelir; doğruluk katmanları üstüne eklenir. Her aşamanın sonunda
**ölçülebilir bir kapı** vardır ve kapıyı işi yapan değil, etiketçi + danışman ölçer.

| Aşama | Süre (kabaca) | İş | Kapı |
|---|---|---|---|
| **A0 Hukuk ve hazırlık** | 2–4 hafta | Avukat görüşü (KVKK aktarım yolu, siyasi danışan çerçevesi, rapor uyum beyanı); X geliştirici hesabı ve küçük bütçeli deneme (yazar ücreti, Türkçe ekli biçim eşleşmesi); X'e yazılı sorular (kamusal aktör defteri, kamusal figür izleme); ilk 2–3 danışanın izleme tanımı; 30–90 günlük sayımla hacim ve bütçe | Yazılı hukuki görüş; aktarım yolu seçildi; danışan başına aylık maliyet tahmini |
| **A1 Sayım ve alarm** | 4–6 hafta | Varlık dosyası ve varyant önerileri; sayım katmanı; mevsimsel olağan düzey; alarm kural motoru ve geçmişte deneme; telefona bildirim; harcama defteri | Geçmiş olaylarda kural denemesi raporu; kanarya (danışanın kendi paylaşımı) 15 dk içinde görülüyor; yanlış kırmızı ≤ 1/hafta/danışan |
| **A2 Okuma ve öğrenen etiketleme** | 6–8 hafta | Canlı akış + tabakalı örnek + kritik alt kümeler; iki yollu okuma; kuyruk; örnek kütüphanesi; denetim örneği; kod kitabı; tohum kümesi (~300) | Denetim örneğinde otomatik kararların ilgililik ve kaba duruş doğruluğu ≥ %90 (4 haftalık birikimle) |
| **A3 Analiz ve rapor** | 6–8 hafta | Çerçeve haritası (kimliksiz mod), anlatı, en çok yayılanlar, etkileşim yeniden ölçümü, kamusal aktör defteri (X yanıtına göre), durum notu, danışan raporu (uyum bölümüyle); haber ve belge (isteğe bağlı) | Danışman 10 geçmiş olayda raporu "danışana gönderebilirim" diye onaylıyor; her sayı ve cümle dayanak denetiminden geçiyor |
| **A4 Konuşan katman** | 4–6 hafta | Konuşarak sorgu; karantina ilkesi; gönderi içine gizlenmiş talimat sınaması | Gizlenmiş talimat sınamasında işlem değişikliği 0 |
| **A5 Pilot** | 8 hafta | 2–3 gerçek danışan; gerçek kullanım; haftalık kalite | Bütün hedefler 4 haftalık birikimle karşılanıyor; danışan memnuniyeti |

**Toplam:** canlıya ~6–9 ay. **Alarm ürünü 2–3. ayda kullanılabilir** ve ilk danışanlara bu aşamada satılabilir.

**Yazılımı kim yapar:** yapay zekâ (Claude Code / Opus) aşama aşama yazar. Her aşamanın kapısını etiketçi ve danışman
ölçer. Sunucu ve anahtarlar teknik destekte durur. Aynı anda en çok iki model ekibi çalışır; bu oturumda dört paralel
ekip kotayı defalarca tüketti.

---

## 10. Riskler

| Risk | Karşılık |
|---|---|
| Avukat yurt dışı aktarımı uygun bulmaz | Ayıklama + Türkiye'de model yolu (bölüm 5.2) |
| Yazar bilgisi ayrıca ücretlenir, maliyet ~3 katına çıkar | A0'da ölçülür; bütçe tablosu güncellenir; yazar bilgisi yalnız gerektiğinde istenir |
| Ulusal siyasi danışan bütçeyi aşar | Sayım + örnek + kritik alt küme; danışana teklif sayımla ölçülmüş hacme göre |
| Danışan bir kamu kurumu çıkar | Kurumsal paket zorunlu (bölüm 2.4); ya fiyatlanır ya da hizmet verilmez |
| Tek etiketçi yanlılığı | Kendi tutarlılık kontrolü, danışmanın haftalık örneği, geçici ikinci etiketçi |
| Alay ve ima isabeti düşük kalır | "Belirsiz" dilimi; zorla karar yok |
| X kuralları değişir | Üç ayda bir koşul taraması; politika motoru güncellenir |
| Kamusal aktör defterine X olumsuz yanıt verir | Defter yalnız kurum ve medya hesaplarıyla sınırlanır ya da kapanır; çerçeve haritası sürer |

---

## 11. Sizden gereken kararlar

1. **Bütçe:** aylık tavan ~3.000 $ mı? (Mesajınızdaki "3000"ü böyle anladım.)
2. **İlk danışanlar:** pilot için 2–3 danışan; varsa biri ulusal ölçekte siyasi mi?
3. **Kamu kurumu danışan:** belediye, bakanlık gibi danışanlarınız olacak mı? (Kurumsal paket gerektirir.)
4. **Etiketçi:** kimi düşünüyorsunuz? Siyasi danışanlarda tarafsızlık ve gizlilik sözleşmesi önemli.
5. **Kamusal aktör defteri:** X'e yazılı soru gönderilsin mi? (Önerilir.)
6. **Haber:** ticari haber API'si ilk aşamada olsun mu, yoksa yalnız GDELT ile mi başlayalım?
