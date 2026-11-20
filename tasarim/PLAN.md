# Rasat — ölçülmüş doğrulukla gündem ve itibar gözlemevi

**Tasarım ve uygulama planı.** Yazan: lider. Sürüm: 1 (denetim öncesi taslak).

"Rasat" çalışma adıdır (gözlemevinde yapılan sistemli gözlem). Bu belge, Nabız, Pusula ve Kule'den öğrenilenlerin
ve üç araştırmanın üstüne kurulmuş **dördüncü ve son tasarımdır**: bütçe kısıtı olmadan, yapılabilirlik sınırları
içinde en kapsamlı ve en doğru bilgiyi vermek üzere.

Dayanaklar (hepsi `tasarim/` altında):

| Belge | Ne verir |
|---|---|
| `00-BRIEF.md` | Kullanıcı ve talep |
| `01-GEREKSINIM-MEVCUT.md` | Kullanıcının kararları, gereksinimler, doğruluğun altı boyutu, zayıflıkların 11 kök nedeni |
| `A-PAZAR.md` | Piyasa: kim ne yapıyor, nerede yetersiz |
| `B-VERI-HUKUK.md` | Veri erişimi, sözleşme ve hukuk, fizibilite |
| `C-YONTEM.md` | Doğruluk yöntemleri ve ölçüm çerçevesi |
| `ZAYIFLIKLAR.md` (depo kökü) | Mevcut üç aracın 31 zayıflığı |

Araştırmaların sınırı: dış sitelerin tam metni bu ortamda okunamadı; bulgular arama sonuçlarındaki alıntılara
dayanıyor. Bu yüzden plandaki her dış olgu, **Aşama 0'da birincil kaynaktan yeniden doğrulanacak** varsayım
olarak ele alınır (bkz. bölüm 10).

---

## 1. Vizyon

### 1.1 Tek cümle
**Rasat, danışmana "ne oluyor" sorusunun yanıtını, o yanıtın ne kadar eksiksiz ve ne kadar doğru olduğunun
ölçülmüş değeriyle birlikte verir.**

### 1.2 Neden bu, neden şimdi
Araştırma A'nın en önemli bulgusu: pazarda en pahalı araçlar bile **kendi doğruluklarını ölçmüyor ve
göstermiyor.** Hiçbir satıcı "hangi platformun yüzde kaçını görüyoruz" ya da "Türkçe duruş okumamız sizin
verinizde ölçüldüğünde şu kadar isabetli" demiyor. Duygu analizi için bağımsız ölçüm yok; koordinasyon ve risk
puanları kara kutu; uyarılar geçmiş olaylarda sınanmıyor; Türkçe ve alay ikinci sınıf.

Araştırma C'nin bulgusu: bunların hepsi **ölçülebilir** — kapsam bile. E-keşif dünyasından gelen elüzyon
örneklemesi, iki bağımsız toplayıcıyla yakala-yeniden yakala tahmini, altın standart veri ve geçmiş olaylarla
geriye dönük sınama olgun yöntemler.

Dolayısıyla Rasat'ın farkı daha çok veri ya da daha parlak yapay zekâ değil, **ölçülmüş doğruluk**tur. Bütçe
kısıt olmadığı için en iyi veriyi de satın alacağız; ama asıl yatırım, o verinin ve okumanın isabetini sürekli
ölçen düzenektir.

### 1.3 Rasat ne değildir
- Kamuoyu araştırması değildir. "İnsanlar ne düşünüyor" sorusunu yanıtlamaz; "görebildiğimiz kanallarda
  yazanlar ne yazıyor"u, görmediği kanalları da açıkça söyleyerek gösterir.
- Doğruluk kontrolü (teyit) kuruluşu değildir. Bir iddianın ne kadar yayıldığını gösterir; doğru olup
  olmadığını ancak bağımsız teyit kaynağına bağlayarak söyler.
- Yalnızca yazılım değildir. **Yazılım + insan analist + süreç**tir. Kritik çıkarımlarda son söz ölçülmüş
  güvende ya da insan onayındadır.

### 1.4 Yedi ürün ilkesi
1. **Ölçülmüş doğruluk her ekranda.** Her sayı ve yorumun yanında dayanak satırı: sayım (kesin) / örneklem
   (n, güven aralığı) / model yorumu (son ölçülen isabet ve tarihi) / kapsam tahmini.
2. **Kör nokta haritası.** Görülemeyen kanallar ve içerik türleri listelenir; "bulunamadı" yanıtı her zaman
   "nerede arandı"yı söyler.
3. **Geniş ağ, dar süzgeç.** Toplama bilerek geniş ve gürültülüdür; ilgililik ayrı ve ölçülen bir adımdır.
   Hiçbir sayı "konunun sayısı" diye sunulmaz; "ilgili bulunan gönderilerin sayısı, tahmini kapsam %X"tir.
4. **Olgular hesaptan, yorum kanıttan.** Sayılar deterministik hesap katmanından gelir; yapay zekâ sayı
   üretmez. Her olgusal cümle bir kayda bağlanır ve makine tarafından denetlenir; denetimden geçmeyen cümle
   yayımlanmaz.
5. **Yabancı metin veridir, talimat değildir.** Gönderileri okuyan model hiçbir araç kullanamaz; araç kullanan
   model gönderi metnini görmez.
6. **Suçlayıcı okunabilecek bulgu insan onayından geçer.** Koordinasyon, "ilk kaynak", "sıçratan hesap" gibi
   bulgular güven basamaklı, tarif edici dille ve isimli sunumda analist onayıyla.
7. **İzleyeni izleyen.** Veri akışı, kapsam, kalite ve bildirim teslimi sürekli denetlenir; sessiz arıza
   kendisi bir alarmdır.

---

## 2. Doğruluk sözleşmesi

Kullanıcının "en doğru bilgi" talebi, aşağıdaki ölçülebilir hedeflere çevrildi. Değerler Araştırma C'nin
önerdiği **başlangıç** eşikleridir; Aşama 1'deki geçmiş olay sınamasından sonra kullanıcıyla birlikte
kesinleşir. Her metrik güven aralığıyla raporlanır; **aralığın alt sınırı eşiğin altındaysa hedef karşılanmamış
sayılır.**

| Boyut | Metrik | Başlangıç hedefi | Nasıl ölçülür |
|---|---|---|---|
| **Kapsam** | İlgili içeriğin yakalanan payı | ≥ %85 (en az iki bağımsız yöntemle) | Elüzyon örneklemesi, iki toplayıcıyla yakala-yeniden yakala, bilinen-öğe listeleri |
| **İlgililik** | Toplananın ilgili payı | ≥ %90 (alt sınır ≥ %85) | Danışan başına haftalık ~200 rastgele gönderi, insan etiketi |
| **Anlama** | Duruş makro-F1; olumsuz sınıf duyarlılığı; kalibrasyon hatası; olumsuz pay hatası | ≥ 0,75; ≥ 0,85; ≤ 0,05; ≤ 5 puan | Kör altın set; alay alt kümesi ayrıca raporlanır |
| **Çıkarım** | Başlangıç doğru pencerede; kesin yayılım bağları; koordinasyon işareti kesinliği; tahmin kalibrasyonu | ≥ %90; ≥ %98; ≥ %90; ±10 puan | Geçmiş olay kronolojileri; sunulan her koordinasyon işaretinin incelenmesi |
| **Zamanlılık** | İlk ilgili gönderi → ilk uyarı; olay yakalama; kırmızı yanlış alarm | medyan ≤ 30 dk; ≥ %90; ≤ 1/hafta/danışan | Geri-test + canlı kayıt |
| **Sunum dürüstlüğü** | Olgusal cümlede atıf; atıf doğruluğu; sayı eşleşmesi; aynı soruda aynı sayı | %100; ≥ %95; %100 (otomatik engel); %100 | Otomatik denetleyici + haftalık insan örneği |
| **Güvenlik** | Gönderi içi talimatla araç/kural/harcama değişikliği | 0 | Türkçe kırmızı takım seti, her sürümde |

Etiketleyici uyumu (Krippendorff α) ≥ 0,80 olmayan bir görev için altın set güvenilir sayılmaz; o görevde
isabet iddiası yapılmaz.

---

## 3. Mimari

### 3.1 Genel görünüm

```
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │  ARAYÜZ   Sabit pano · Konuşma + kartlar · Bildirim (eskalasyonlu) · Rapor   │
 └───────────────▲─────────────────────────────────────────────▲────────────────┘
                 │                                             │
 ┌───────────────┴──────────────┐              ┌───────────────┴────────────────┐
 │ YORUM DÜZLEMİ                │              │ İNSAN DÜZLEMİ                  │
 │ Planlayıcı (araç kullanır,   │◄────────────►│ Nöbetçi analist kuyruğu        │
 │   ham metin görmez)          │   onay /     │ Onay kapıları                  │
 │ Karantina okuyucular (metin  │   düzeltme   │ Düzeltme kütüphanesi (sürümlü) │
 │   okur, araç kullanamaz)     │              │ Etiketleme (altın set)         │
 │ Yazıcı + atıf/sayı denetçisi │              └───────────────▲────────────────┘
 └───────────────▲──────────────┘                              │
                 │ yalnızca olgu kayıtları ve kimlikli alıntılar │
 ┌───────────────┴───────────────────────────────────────────────┴──────────────┐
 │ OLGU DÜZLEMİ (deterministik, sürümlü anlık görüntüler)                       │
 │ Sayımlar · Mevsimsel taban + alarm · Etkileşim yeniden ölçümü ·              │
 │ Yayılım ağacı (kesin/olası bağ) · Anlatı kimliği · Koordinasyon (sıfır       │
 │ modeli) · Tahmin (aralıklı) · Risk (açıklanabilir) · Kanıt deposu            │
 └───────────────▲──────────────────────────────────────────────────────────────┘
 ┌───────────────┴──────────────────────────────────────────────────────────────┐
 │ ANLAMA DÜZLEMİ                                                               │
 │ İlgililik + varlık bağlama · Türkçe duruş/duygu/alay/iddia/çağrı (katmanlı)  │
 │ Oran düzeltme · Kalibrasyon · Çoklu ortam (ses→metin, görsel yazı, logo,     │
 │ yakın-kopya)                                                                 │
 └───────────────▲──────────────────────────────────────────────────────────────┘
 ┌───────────────┴──────────────────────────────────────────────────────────────┐
 │ VERİ DÜZLEMİ                                                                 │
 │ Danışan varlık dosyası · Geniş ağ toplama (sorgu + hesap + ağ) ·             │
 │ Lisanslı çok kaynak (en az iki bağımsız toplayıcı) · Kapsam ölçümü ·         │
 │ Kör nokta haritası                                                           │
 └──────────────────────────────────────────────────────────────────────────────┘
   GÖZETİM (her katmanı izler): kaynak sağlığı · gecikme · kapsam düşüşü ·
   kalite metrikleri · bildirim teslimi · denetim kaydı · harcama
   UYUM: KVKK · platform sözleşmeleri · veri saklama/silme · şifreleme · erişim
```

### 3.2 Veri düzlemi

**Danışan varlık dosyası.** Danışanın adı ve bütün biçimleri: yazım varyantları (Türkçe karakterli/karaktersiz,
ekli biçimler), lakaplar, ürün ve marka adları, yöneticiler ve sözcüler, kampanya adları, etiketler, resmî ve
sahip olunan hesaplar, rakipler, hassas konular; **eşsesli dışlamalar** (aynı adı taşıyan başka şeyler). Dosya
sürümlüdür; her değişiklik geçmiş olaylarda kapsam etkisi ölçülerek etkinleşir.

**Geniş ağ toplama.** Üç bağımsız yoldan:
1. *Sorgu tabanlı:* bilerek geniş, yüksek duyarlılıklı sorgular. Yapay zekâ sorgu önerebilir ama sorgu her
   zaman insanın okuyabileceği biçimde görünür ve onaylanır.
2. *Hesap tabanlı:* danışanın ekosistemindeki hesaplar (gazeteciler, sektör hesapları, eleştirmenler,
   tüketici hakları hesapları, geçmiş olaylarda öne çıkanlar) — ad geçmese de konuşmayı yakalar.
3. *Ağ tabanlı:* ilgili bulunan gönderilere gelen yanıt, alıntı, yeniden paylaşım ve aynı bağlantıyı
   paylaşanlar — sorgunun kaçırdığı "çevre" konuşmayı yakalar.

**Lisanslı çok kaynak.** Veri, çağrı başına değil, lisanslı ve tam erişimle alınır (kök neden K-1'in çözümü).
X için **en az iki bağımsız toplayıcı** hedeflenir (örneğin doğrudan X kurumsal erişimi + X ile resmî veri
ortaklığı olan bir dinleme platformu). İki toplayıcı hem satıcı arızasına karşı yedek hem de kapsamın
yakala-yeniden yakala ile ölçülmesi için gereklidir. Kaynak listesi ve fizibilitesi: bölüm 4.

**Kapsam ölçümü** (Araştırma C §1.5):
- Haftalık elüzyon örneklemesi: geniş ağın "ilgisiz" sayılan ve sorgu dışı kalan kısmından rastgele örnek,
  insan etiketi → kaçırılan ilgili oranı.
- Yakala-yeniden yakala: iki bağımsız toplayıcının ortak yakaladığı payla toplam ilgili hacim tahmini.
- Bilinen-öğe listeleri: analistin başka yollarla (haber, ekran görüntüsü, el araması) bulduğu gönderilerden
  kaçının sistemde olduğu.
- Kapsamda düşüş = yeni lakap/etiket/kanal belirdi demektir → genişletme önerisi analist kuyruğuna düşer.

**Kör nokta haritası.** Her danışan ekranında: hangi kanal görülüyor, hangi tamlıkta, hangi gecikmeyle; hangi
kanal hiç görülmüyor (kapalı gruplar, kişisel Instagram hesapları vb.); Türkiye'de erişime kapatılmış içerik
ayrıca işaretli ("TR'de görünmüyor": danışanın Türkiye'deki kitlesi bunu görmüyor).

### 3.3 Anlama düzlemi

**İlgililik ve varlık bağlama.** Toplanan her içerik için "danışanla ilgili mi, hangi anlamda" kararı ayrı bir
sınıflandırıcıyla verilir; eşsesli ayrımı varlık dosyasındaki dışlamalar ve bağlamla yapılır. Danışanın sahip
olduğu hesaplar ayrı rol alır ("sahip olunan kanal"); yükseltici listesine girmez (P11).

**Katmanlı Türkçe okuma** (Araştırma C §2):
1. *İnce ayarlı Türkçe kodlayıcı* (BERTurk / TurkishBERTweet türü): bütün içeriği hızlı ve tutarlı okur.
   Araştırma C'ye göre Türkçe sınıflamada hâlâ sıfır-örnekli büyük dil modellerinden iyidir.
2. *Büyük dil modeli (karantinada):* kodlayıcının emin olmadığı, alaylı, kritik ya da yüksek erişimli
   içeriği ikinci kez okur.
3. *İnsan:* ikisinin ayrıştığı, alay olasılığı yüksek ya da olayın gidişatını belirleyen içerik nöbetçi
   analiste gider.

Okunan sınıflar: ilgililik, duruş (danışana karşı), duygu, alay, iddia (doğrulanabilir önerme), çağrı (boykot,
şikâyet, paylaş), hedef (ürün, kişi, kurum), dil. Her etiketin yanında **kalibre edilmiş** güven.

**Oran düzeltme.** "Olumsuz pay" gibi oranlar model etiketlerinin ham sayımı değildir; küçük bir insan
örneğiyle düzeltilmiş tahmin ve güven aralığı verilir (DSL/PPI yöntemleri; Araştırma C §2.3).

**Çoklu ortam.** Videolardan ses → metin, görseller üzerindeki yazı, logo tanıma, yakın-kopya görsel/video
eşleştirme. Her biri kendi Türkçe örneklerimizde ölçülür; ölçülen hata eşiğin üstündeyse o dökümden alıntı
yapılmaz, yalnızca "olası bahsetme" sayılır.

### 3.4 Olgu düzlemi

Bütün hesaplar deterministiktir, aynı veriyle aynı sonucu verir ve **sürümlü anlık görüntüler** olarak
saklanır ("dün ne demiştik" sorusu bu kayda dayanır).

| Olgu | Yöntem | Dürüstlük kuralı |
|---|---|---|
| Hacim ve hız | Sayım uçları ve tam akış; yeniden paylaşımlar toplam sayımdan | "İlgili bulunan" sayısı + kapsam tahmini |
| Olağan düzey | En az 4 haftalık geçmişten günün saati ve haftanın günü etkisini ayıran ayrıştırma + sağlam istatistik | İlk haftalarda "ısınma" etiketi |
| Alarm | Halk sağlığı gözetimi yöntemleri (CUSUM, EARS türü); eşik geçmiş olaylarda yanlış/kaçırılan dengesine göre seçilir | Her alarm kuralının geri-test sonucu görünür |
| Etkileşim | Zaman damgalı yeniden ölçüm (yayımdan sonra 1 sa, 6 sa, 24 sa…); yaşa göre normalize sıralama | "En çok etkileşim alan" ölçüm saatiyle birlikte |
| Yayılım | Gözlenen bağlar (yanıt, alıntı, yeniden paylaşım) **kesin**; çıkarılan bağlar (zamanlama, metin benzerliği) **olası** | "İlk kaynak" = "topladığımız veride gözlenen en erken"; arşivde geriye genişletme otomatik |
| Anlatı | Gömme tabanlı kümeleme + zaman içinde kalıcı kimlik eşleştirme + üst anlatı düzeyi; ad önerisi model, onay analist | Saflık ve bölünme oranı ölçülür |
| Koordinasyon | En az üç bağımsız sinyal (eşzamanlılık, metin benzerliği, ortak bağlantı, hesap yaşı kümeleri); aynı konuyu konuşan doğal kullanıcılardan kurulan **sıfır modeli** ile kıyas | Güven basamaklı (düşük/orta/yüksek + gerekçe); tarif edici dil; isimli sunum analist onayıyla |
| Tahmin | Olasılıklı ve aralıklı; tek kaynak (eğilim ve tahmin aynı modelden) | Kalibrasyonu geri-testte ölçülür; ölçülmemişse gösterilmez |
| Risk | Açıklanabilir sürücüler; ağırlıklar yazılı ve danışana göre ayarlanabilir | Puan değil, sürücüler ön planda |

**Kanıt deposu.** Her olgu bir kayıttır: kimlik, hesaplama sürümü, girdi kapsamı, sonuç, güven. Yorum düzlemi
yalnızca bu kayıtlara ve kimlikli alıntılara atıf yapabilir.

### 3.5 Yorum düzlemi (konuşan katman)

Kule'deki "yetenek + kapı + ajan" fikri korunur; güvenlik ve dayanak **mimariyle** sağlanır (Araştırma C §8):

- **Planlayıcı:** kullanıcıyla konuşur, hangi yeteneğin çalışacağına karar verir. Ham gönderi metnini görmez;
  yalnızca olgu kayıtlarını ve karantina okuyucuların yapılandırılmış çıktısını görür.
- **Karantina okuyucular:** gönderi ve haber metnini okur, şemaya bağlı yapılandırılmış çıktı verir (etiket,
  gönderi kimliği, kısa alıntı). Araç çağıramaz, kural kuramaz, harcama yapamaz. Her gönderi ayrı okunur; bir
  gönderi diğerinin okumasını etkileyemez.
- **Yazıcı:** durum notu, yanıt planı, rapor. Sayıları yer tutucuyla yazar; yer tutucular olgu kayıtlarından
  doldurulur.
- **Denetçi (yapay zekâ değil, kod):** her olgusal cümlede atıf var mı, alıntı birebir geçiyor mu, her rakamın
  olgu kayıtlarında karşılığı var mı, dayanak türü etiketli mi. Geçmeyen cümle yayımlanmaz; yazıcıya geri döner.
- **Her yanıtta "ne yaptım":** çalıştırılan sorgu ve yetenekler, bakılan kapsam, "bulunamadı" ise nerede
  arandığı.
- **Sabit pano + konuşma:** hacim, taban, alarm, risk gibi sabit sayımlar her gün aynı panoda; açık uçlu
  sorular konuşmada. Konuşmada üretilen kart panoya sabitlenebilir.
- **Kalıcı izleme talimatı:** yazıyla verilir, yapılandırılmış kurala çevrilir, kullanıcıya geri okunur ve
  **kurulmadan önce geçmiş olaylarda denenir** ("bu kural geçen ayki olayda tetiklenir miydi?"). Kurulu
  kurallar periyodik olarak yeniden sınanır; tetiklenmeyecek hale gelen kural uyarı üretir (K5).

### 3.6 İnsan düzlemi

| Rol | Ne yapar | Ne zaman devreye girer |
|---|---|---|
| **Nöbetçi analist** (7/24) | Kuyruktaki belirsiz okumaları çözer, kırmızı uyarıyı doğrular, danışmanı arar | Model ayrışması, alay şüphesi, kritik içerik, kırmızı uyarı |
| **Onay kapıları** | İsimli koordinasyon bulgusu, "ilk kaynak/sıçratan" adlandırması, kamuya gidecek taslak | Her seferinde, istisnasız |
| **Düzeltme kütüphanesi** | Kullanıcı ve analist düzeltmeleri modeli doğrudan değiştirmez; kapsamı (danışan, olay, tarih) ve son kullanma tarihiyle sürümlü kütüphaneye girer; altın sette ve geri-testte etkisi ölçüldükten sonra etkinleşir | Sürekli (K7) |
| **Etiketleme** | Altın set ve haftalık kalite örnekleri; en az iki bağımsız etiketçi + uzlaştırıcı | Sürekli |

### 3.7 Arayüz
- **Sabit pano:** danışanlar, risk, alarm, olay akışı, kör nokta haritası, kalite özeti.
- **Danışan odası:** Pusula'daki bölümler (durum notu, ne yapmalı, nabız, anlatılar, yayılım, aktörler,
  koordinasyon, akış) — her biri dayanak satırıyla.
- **Konuşma + kartlar** (Kule): öngörülmemiş sorular; sonuçlar kart olarak panoya sabitlenebilir.
- **Bildirim:** önem düzeyine göre kanal (uygulama, e-posta, SMS/arama); okunmazsa eskalasyon (nöbetçi
  analist arar). Teslim edildiği doğrulanır.
- **Rapor:** danışana gönderilecek, dayanak ekli, dışa aktarılabilir.
- **Kalite ekranı:** her boyutun son ölçülen değeri ve eğilimi; kullanıcı aracın ne kadar güvenilir olduğunu
  her zaman görebilir.

### 3.8 Gözetim ve uyum
- **Gözetim:** her kaynağın akış gecikmesi ve hacmi (beklenenden sapma = arıza şüphesi), kapsam ölçümünde
  düşüş, kalite metriklerinde kayma, bildirim teslim süresi, model sürüm değişimi. Her biri kendi alarmı olan
  bir olgudur. Model ya da kural sürümü değişimi tam regresyon setinden geçmeden canlıya alınmaz.
- **Uyum:** KVKK kapsamında işleme ve yurt dışı aktarım çerçevesi, platform sözleşmelerine uygun saklama ve
  silme (silinen içeriğin sistemden de silinmesi), yapay zekâ sağlayıcısıyla veri saklamama/eğitimde
  kullanmama koşulları, şifreleme, rol tabanlı erişim, denetim kaydı. Ayrıntı: bölüm 4.3 ve Araştırma B.

---

## 4. Veri kaynakları ve fizibilite

> Bu bölüm Araştırma B tamamlandığında güncellenecek. Aşağıdaki tablo Araştırma A'dan ve genel bilgiden
> derlenen **ön görünümdür**; her satır Aşama 0'da birincil kaynak ve satıcı görüşmesiyle doğrulanır.

### 4.1 Kaynak görünümü (ön)

| Kanal | Erişim yolu (aday) | Beklenen tamlık | Fizibilite | Ana belirsizlik |
|---|---|---|---|---|
| X | Doğrudan kurumsal erişim (tam akış/arşiv) + resmî veri ortağı bir dinleme platformu | Yüksek | Yüksek (pahalı) | Sözleşmenin YZ sağlayıcısına içerik göndermeye izni; TR'de erişime kapatılan içeriğin işaretlenmesi |
| Haber siteleri, ajanslar | Türkiye medya takip şirketi + haber API'si + ajans abonelikleri | Yüksek | Yüksek | Yeniden kullanım ve YZ'ye aktarım hakkı |
| TV, radyo, basılı | Türkiye medya takip şirketi (deşifre + arşiv) | Orta–yüksek | Orta | Lisans çerçevesi; gecikme |
| YouTube | Resmî API (video, yorum) + ses → metin | Orta | Yüksek | Kota; videonun ses içeriği |
| Instagram, Facebook, Threads | Dinleme platformları üzerinden; resmî API'ler dar | Düşük–orta | Orta | Kişisel hesaplar ve Hikâyeler görünmez |
| TikTok | Ticari dinleme için resmî yol dar | Düşük | Düşük | Araştırma B |
| Ekşi Sözlük, Şikayetvar, forumlar | Lisans/ortaklık araştırılacak | Bilinmiyor | Bilinmiyor | Araştırma B; kullanım koşulları |
| Telegram (kamuya açık kanallar) | Resmî API | Orta | Orta | Kanal keşfi |
| Bluesky | Açık akış | Yüksek | Yüksek | Türkiye'de küçük kitle |
| WhatsApp, kapalı gruplar, özel mesajlar | Yok | — | Yok | Kalıcı kör nokta |

### 4.2 Satıcı seçimi: kendimiz ölçerek
Pazarda bağımsız kıyas olmadığı için (Araştırma A) satıcı seçimi bir **veri yarışması** ile yapılır: her aday
sağlayıcıdan aynı geçmiş Türkiye olayları için veri istenir; Aşama 1'de hazırlanan kronolojiler ve bilinen-öğe
listeleri karşısında kapsam, gecikme ve tamlık ölçülür. Sözleşme görüşmesinde ilk sorular:
1. İçerik kendi sistemimizde saklanabilir mi, ne kadar süre?
2. İçerik analiz için bir yapay zekâ sağlayıcısına gönderilebilir mi?
3. Silinen içerik bildirimi (uyum akışı) veriliyor mu?
4. Kitle/erişim verisi (tiraj, izlenme, takipçi) geliyor mu?
5. Türkiye'de erişime kapatılan içerik nasıl işaretleniyor?
6. Hizmet kesintisinde bildirim ve telafi?

### 4.3 Hukuk (ön)
Kamuya açık sosyal medya verisinin işlenmesi, kişisel verinin yurt dışındaki bir yapay zekâ hizmetine aktarımı
(KVKK 2024 değişiklikleri ve standart sözleşmeler), platform sözleşmelerinin model eğitimi ve yeniden dağıtım
yasakları, yayın içeriğinin telif durumu, Türkiye'deki erişim engelleri. Hukuki görüş Aşama 0'da alınır;
görüş gelmeden gerçek veri işlenmez.

---

## 5. Zayıflıktan çözüme izlenebilirlik

Her kök neden (bkz. `01-GEREKSINIM-MEVCUT.md` §4) bir mimari bileşene, bir metriğe ve dürüst bir duruma
bağlanır. Kod bazında ayrıntılı eşleme `C-YONTEM.md` §11'dedir; bu tablo onun mimariye izdüşümüdür.

| Kök neden | Kapsadığı zayıflıklar | Rasat'taki karşılığı | Metrik (bölüm 2) | Durum |
|---|---|---|---|---|
| K-1 Veri maliyete göre | N1, N4, P6, P7, P8, P15, Ortak-3 | Lisanslı tam erişim, iki toplayıcı, etkileşim yeniden ölçümü, arşivle geriye genişletme | Kapsam, zamanlılık | Karşılanır |
| K-2 Kapsam ölçülmüyor | N1, N3, N4, P6, P7 | Elüzyon + yakala-yeniden yakala + bilinen-öğe; kapsam düşüş alarmı | Kapsam | Karşılanır (metinsiz medya: yönetilebilir) |
| K-3 İlgililik ayrı adım değil | N1, N5 | Geniş ağ + ilgililik sınıflandırıcısı + varlık dosyası + eşsesli dışlama | İlgililik | Karşılanır |
| K-4 Doğruyu bilen ölçüt yok | P2, P3, P16, K8, Ortak-5 | Bağımsız değerlendirme ekibi, kör altın set, geçmiş olay kronolojileri | Hepsi | Karşılanır |
| K-5 Anlama kaba, kalibresiz | N2, P3, P4, P13, P14, Ortak-4 | Katmanlı Türkçe okuma, kalibrasyon, oran düzeltme, anlatı kimliği | Anlama | Yönetilebilir (alay kalıcı zorluk) |
| K-6 İlişki bulgu gibi | N4, P5, P11, P12, Ortak-7 | Kesin/olası bağ ayrımı, sıfır modeli, güven basamakları, onay kapısı, tarif edici dil | Çıkarım | Çözülemez, yönetilebilir |
| K-7 Zaman modeli zayıf | P8, P9, P10 | Mevsimsel taban, gözetim tipi alarm, kalibre tahmin, yeniden ölçüm | Zamanlılık, çıkarım | Karşılanır (tahmin tavanı: yönetilebilir) |
| K-8 Akıcı anlatım hatayı gizliyor | K2, K4, K9, P13 | Olgular hesaptan, atıf/sayı denetçisi, "ne yaptım" satırı, sürümlü anlık görüntü | Sunum dürüstlüğü | Yönetilebilir |
| K-9 İzleyeni izleyen yok | K5, Nabız'ın durması, bildirim yokluğu | Gözetim düzlemi, kural geri-testi, eskalasyonlu bildirim, 7/24 nöbet | Zamanlılık | Karşılanır |
| K-10 Güvenlik/hukuk sonradan | K6, hukuki belirsizlik, düz metin anahtar | Karantina mimarisi, kırmızı takım, Aşama 0 hukuk görüşü, şifreleme | Güvenlik | Yönetilebilir |
| K-11 İnsan yok | P5, P12, P13, K7 | İnsan düzlemi: nöbetçi analist, onay kapıları, sürümlü düzeltme | Çıkarım, sunum | Karşılanır |

### 5.1 Çözülemeyenler (dürüst liste)
Bu sınırlar hiçbir bütçeyle kaldırılamaz; Rasat bunları **görünür kılar ve diliyle sınırlar**:
1. Görülen kanallar kamuoyunun tamamı değildir.
2. Kapalı gruplar, özel mesajlar, kişisel Instagram hesapları ve Hikâyeler görünmez.
3. Silinen ve erişime kapatılan içerik geriye dönük olarak eksiktir ve bu eksiklik rastgele değildir.
4. "İlk kaynak" kuramsal olarak kesin bilinemez; "gözlenen en erken" söylenir.
5. Zamanlama neden değildir; "sıçrattı" denmez.
6. Meşru topluluk eşgüdümü ile örgütlü kampanya her zaman ayrılamaz.
7. Türkçe alay ve ima, en iyi yöntemle bile hata üretir.
8. Bir iddianın doğruluğu, bağımsız teyit olmadan bilinemez.
9. Viral tahminin öngörülebilirlik tavanı vardır.

---

## 6. Ekip

İki ayrı ekip vardır: **tasarlayan** (bu belgeyi üreten, tamamlandı) ve **kuran ve işleten**. İkincisinin en
önemli kuralı: **sistemi kuranlar ile doğruluğunu ölçenler ayrıdır** (Araştırma C §9.5). Sınavı hazırlayan,
sınava girmez.

### 6.1 Tasarım ekibi (bu süreçte kullanıldı)
| Rol | Yaptığı | Çıktı |
|---|---|---|
| Lider | Gereksinim, kök neden analizi, sentez, mimari, plan | `01`, `PLAN.md` |
| Araştırma A — piyasa | Dünya ve Türkiye'deki araçlar, yaklaşımlar, boşluklar | `A-PAZAR.md` |
| Araştırma B — veri ve hukuk | Kaynak erişimi, sözleşme, KVKK, fizibilite | `B-VERI-HUKUK.md` |
| Araştırma C — yöntem | Doğruluk yöntemleri, ölçüm çerçevesi | `C-YONTEM.md` |
| Denetim | Planı araştırmalara ve zayıflıklara karşı sınama | `D-DENETIM.md` |

### 6.2 Kurma ve işletme ekibi

İnsan olması gereken roller ile yapay zekâ modellerine verilebilecek roller ayrı işaretlenmiştir.
"Model" yazan rollerde de son onay ve sorumluluk bir insandadır.

**Ürün ve alan**
| Rol | Yetkinlik | Sorumluluk | Kim |
|---|---|---|---|
| Ürün sahibi | Danışmanlık işinin kendisi | Öncelikler, kabul, eşiklerin son kararı | Kullanıcı |
| Kriz iletişimi uzmanı | Kurumsal kriz yönetimi deneyimi | Kod kitabındaki iletişim kavramları, yanıt planı kuralları, kabul senaryoları | İnsan (danışman) |

**Veri, hukuk, güvenlik**
| Rol | Yetkinlik | Sorumluluk | Kim |
|---|---|---|---|
| Veri ortaklıkları yöneticisi | Veri lisansı ve satıcı müzakeresi | Satıcı yarışması, sözleşmeler, hizmet seviyeleri | İnsan |
| Hukuk danışmanı | KVKK, platform sözleşmeleri, telif | Hukuki görüş, aktarım çerçevesi, saklama politikası | İnsan (dış) |
| Güvenlik ve gizlilik mühendisi | Uygulama güvenliği, şifreleme, erişim | Tehdit modeli, gizli anahtar yönetimi, denetim kaydı | Model + insan onayı |

**Mühendislik** (model ekiplerine verilebilir; her biri bir katmanın sahibi)
| Rol | Yetkinlik | Sorumluluk |
|---|---|---|
| Veri mühendisi | Akış işleme, depolama, yeniden ölçüm zamanlaması | Veri düzlemi, kaynak bağdaştırıcıları, kanıt deposu |
| Bilgi erişimi mühendisi | Sorgu tasarımı, sorgu genişletme, varlık bağlama | Varlık dosyası, geniş ağ, ilgililik, kapsam ölçüm düzeneği |
| Türkçe dil işleme mühendisi | İnce ayar, kalibrasyon, oran düzeltme, aktif öğrenme | Anlama düzlemi |
| Çoklu ortam mühendisi | Ses → metin, görsel yazı, logo, yakın-kopya | Çoklu ortam kanalı |
| İstatistik ve zaman serisi uzmanı | Mevsimsellik, gözetim alarmları, tahmin, güven aralıkları | Taban, alarm, tahmin, kapsam istatistiği |
| Ağ bilimi uzmanı | Yayılım ağaçları, koordinasyon ağları, sıfır modelleri | Yayılım ve koordinasyon |
| Yapay zekâ ajan mühendisi | Araç kullanımı, karantina deseni, atıf | Yorum düzlemi, denetçi |
| Arayüz tasarımcısı ve geliştiricisi | Teknik olmayan kullanıcı için arayüz, veri görselleştirme | Pano, oda, konuşma, kalite ekranı |
| İşletim (SRE) mühendisi | İzleme, kesinti yönetimi, bildirim altyapısı | Gözetim düzlemi, eskalasyon |

**Bağımsız değerlendirme** (kuranlardan ayrı; çıktıları kuranlardan gizli tutulur)
| Rol | Yetkinlik | Sorumluluk | Kim |
|---|---|---|---|
| Değerlendirme lideri | Ölçüm tasarımı, istatistik, etiketleme yönetimi | Altın set, kod kitabı, geçiş kapılarının ölçümü | İnsan (model destekli) |
| Etiketçiler (en az 3) | Türkçe anadil; sosyal medya dili, alay, ima | Altın set, haftalık kalite örnekleri | İnsan |
| Olay kronolojisi araştırmacıları | Gazetecilik ya da açık kaynak araştırması | Geçmiş olayların bağımsız kronolojileri | İnsan |
| Kırmızı takım | İstem enjeksiyonu, kötüye kullanım senaryoları | Türkçe saldırı seti, her sürümde sınama | Model + insan |

**İşletme**
| Rol | Yetkinlik | Sorumluluk | Kim |
|---|---|---|---|
| Nöbetçi analistler (7/24) | Sosyal medya analizi, Türkçe, kriz duyarlılığı | Kuyruk, onay kapıları, kırmızı uyarı doğrulama, eskalasyon | İnsan (kendi ekip ya da Türkiye'deki bir takip şirketinin analist hizmeti) |
| Kalite sorumlusu | Değerlendirme lideriyle birlikte | Haftalık ölçüm, kayma takibi, kalite ekranı | İnsan |

### 6.3 Model ekipleriyle çalışma kuralları
Bu oturumda dört paralel model ekibi kullanım kotasını tekrar tekrar tüketti. Kurma aşamasında:
- Aynı anda en çok iki ya da üç model ekibi; her biri tek katmanın sahibi.
- Her ekibe sözleşme (arayüz, veri biçimi, geçiş kapısı) yazılı verilir; çıktı lider ve bağımsız değerlendirme
  tarafından kapıdan geçirilir.
- Tasarım, değerlendirme tasarımı ve güvenlik mimarisi en yetenekli modelle; uygulama orta düzey modelle;
  toplu etiketleme ve sınıflama en hızlı modelle.
- Araştırma çıktıları ve kararlar depoya yazılır; aynı araştırma tekrar yapılmaz.

---

## 7. Aşamalı plan ve kontrol kapıları

Her aşamanın: **amacı, iş paketleri, sahibi, çıktısı, geçiş kapısı** (ölçülebilir) ve **durma koşulu** vardır.
Kapıyı ölçen, işi yapan değildir. Kapıdan geçilmeden sonraki aşamaya yalnızca kapının bağımlı olmadığı işler
için geçilir. Süreler kabaca verilmiştir; kesin süre Aşama 0 sonunda çıkar.

```
 A0 Doğrulama ve hazırlık ──┬──► A2 Veri yarışması ──► A3 Toplama+ilgililik+kapsam ──┐
 A1 Ölçü aleti (bağımsız) ──┘                          A4 Anlama (Türkçe) ────────────┤
                                                       A5 Olgu düzlemi ───────────────┤
                                                       A6 Yorum + güvenlik ───────────┤
                                                                                      ▼
                                       A7 İnsan iş akışı + arayüz + bildirim ──► A8 Gölge işletim
                                                                                      ▼
                                                    A9 Canlı + sürekli kalite ──► A10 Genişleme
```

### A0 — Doğrulama ve hazırlık *(paralel A1 ile; kabaca 4–6 hafta)*
- **Amaç:** plandaki dış varsayımları birincil kaynaktan doğrulamak; hukuki zemini kurmak.
- **İşler:** araştırmalardaki "doğrulanamadı/kısmen" bulguların birincil kaynaktan kontrolü (bölüm 10);
  hukuki görüş (KVKK, aktarım, platform sözleşmeleri, telif); aday veri sağlayıcılara bölüm 4.2'deki
  sorularla bilgi talebi; yapay zekâ sağlayıcısının veri saklamama ve eğitimde kullanmama koşullarının
  sözleşmeye bağlanması; ilk danışan ve ilk 5–10 geçmiş olayın seçimi.
- **Sahip:** veri ortaklıkları yöneticisi, hukuk danışmanı, lider.
- **Kapı:** hukuki görüş yazılı; her kanal için "yapılabilir/yapılamaz/koşullu" kararı birincil kaynağa
  dayalı; en az iki aday sağlayıcıdan örnek veri sözü.
- **Durma koşulu:** X içeriğinin bir yapay zekâ sağlayıcısına gönderilmesi sözleşmeyle yasaksa yorum düzlemi
  mimarisi yeniden ele alınır (bkz. bölüm 9, risk R1).

### A1 — Ölçü aleti *(paralel A0 ile; kabaca 6–10 hafta)*
- **Amaç:** her şeyin ölçüleceği bağımsız altın standardı kurmak. Araştırma C'ye göre en yüksek öncelikli iş.
- **İşler:** kod kitabı (her etiketin tanımı, sınır örnekleri, Türkçe alay ve ima örnekleri); etiketçilerin
  eğitimi ve uyum ölçümü; tabakalı ve zaman bölmeli altın set (sınıf başına ≥ 100, alay ≥ 200); 5–10 geçmiş
  Türkiye olayının bağımsız kronolojisi (gerçek başlangıç, dönüm noktaları, anlatılar, haber geçişleri);
  bilinen-öğe listeleri; değerlendirme altyapısı (her bileşeni aynı sette otomatik ölçen düzenek, "o ana kadar
  bilinen veri" kuralıyla geri-test).
- **Sahip:** bağımsız değerlendirme ekibi.
- **Kapı:** Krippendorff α ≥ 0,80 (her görev için ayrı); kronolojiler iki araştırmacı tarafından bağımsız
  doğrulanmış; değerlendirme altyapısı Pusula'nın mevcut analiziyle ilk ölçümü üretmiş (bu, "hiçbir şey
  yapmasak" taban çizgisidir).
- **Durma koşulu:** bir görevde α 0,67'nin altında kalırsa o görevin tanımı yeniden yazılır; isabet iddiası
  yapılmaz.

### A2 — Veri yarışması *(A0 ve A1'e bağlı; kabaca 4–6 hafta)*
- **Amaç:** veri kaynaklarını kendi ölçümümüzle seçmek.
- **İşler:** aday sağlayıcılardan aynı geçmiş olaylar için veri; kronolojilere ve bilinen-öğe listelerine
  karşı kapsam, gecikme, tamlık; iki sağlayıcı arasında yakala-yeniden yakala; sözleşme koşullarının kıyası.
- **Sahip:** veri ortaklıkları yöneticisi + veri mühendisi; ölçüm değerlendirme ekibinde.
- **Kapı:** seçilen kaynak setiyle X için tahmini kapsam ≥ %85 (en az iki yöntemle); diğer kanallar için kör
  nokta haritasının ilk sürümü; sözleşmeler hukuk onaylı.
- **Durma koşulu:** hiçbir sağlayıcı hedefe ulaşmıyorsa hedef değil plan değişir: kapsam hedefi kanal bazında
  yeniden belirlenir ve kullanıcıya açıkça bildirilir.

### A3 — Toplama, ilgililik, kapsam ölçümü *(kabaca 8–10 hafta)*
- **İşler:** varlık dosyası ve düzenleme aracı; üç yollu geniş ağ; ilgililik sınıflandırıcısı ve eşsesli
  ayrımı; elüzyon, yakala-yeniden yakala ve bilinen-öğe ölçümlerinin otomatik çalışması; kapsam düşüş alarmı;
  etkileşim yeniden ölçümü; kaynak sağlığı gözetimi.
- **Kapı:** geri-test olaylarında ilgililik ≥ %90 (alt sınır ≥ %85), kapsam ≥ %85; ilgililik sınıflandırıcısı
  F1 ≥ 0,85; kaynak kesintisi benzetiminde gözetim alarmı ≤ 5 dk.

### A4 — Anlama düzlemi *(A3 ile kısmen paralel; kabaca 8–12 hafta)*
- **İşler:** ince ayarlı Türkçe kodlayıcı; karantina okuyucu olarak büyük dil modeli; ayrışma ve belirsizliğe
  göre insan kuyruğu; kalibrasyon; oran düzeltme; anlatı kümeleme ve kalıcı kimlik; iddia tespiti ve teyit
  kaynaklarıyla eşleştirme.
- **Kapı:** kör altın sette duruş makro-F1 ≥ 0,75, olumsuz sınıf duyarlılığı ≥ 0,85, kalibrasyon hatası ≤ 0,05;
  olumsuz pay hatası ≤ 5 puan ve güven aralığı kapsaması doğru; anlatı saflığı ≥ %80, ana anlatının bölünmesi
  ≤ %10; büyük dil modeli–insan uyumu insan–insan uyumunun en çok 0,05 altında (değilse o görevde tek başına
  kullanılmaz).

### A5 — Olgu düzlemi *(kabaca 8–10 hafta)*
- **İşler:** mevsimsel taban; gözetim tipi alarm ve eşiğin geri-testle seçimi; yayılım ağacı (kesin/olası);
  arşivde geriye otomatik genişletme; koordinasyon sinyalleri ve sıfır modeli; kalibre tahmin; açıklanabilir
  risk; kanıt deposu ve sürümlü anlık görüntü.
- **Kapı:** geri-testte olay yakalama ≥ %90, medyan tespit gecikmesi ≤ 30 dk, kırmızı yanlış alarm ≤ 1/hafta/
  danışan; başlangıç doğru pencerede ≥ %90 (değilse "daha önce başlamış olabilir" uyarısı %100); kesin yayılım
  bağı doğruluğu ≥ %98; sunulan koordinasyon işaretlerinin kesinliği ≥ %90; tahmin kalibrasyonu ±10 puan.

### A6 — Yorum düzlemi ve güvenlik *(kabaca 8–10 hafta)*
- **İşler:** planlayıcı / karantina okuyucu / yazıcı / denetçi ayrımı; yetenek kaydı ve harcama kapısı
  (Kule'den); atıf ve sayı denetçisi; "ne yaptım" satırı; kalıcı izleme talimatının kurala çevrilmesi ve
  geri-testi; Türkçe kırmızı takım seti; tutarlılık sınaması; durum notu ve yanıt planı (Pusula'dan, olgu
  kayıtlarına bağlanarak).
- **Kapı:** kırmızı takım setinde araç/kural/harcama değişikliği 0, metin sapması ≤ %1; olgusal cümlelerde atıf
  %100, atıf doğruluğu ≥ %95, sayı eşleşmesi %100; aynı soru ve anlık görüntüde sayılar 5 tekrarda %100 aynı;
  kriz iletişimi uzmanının 20 senaryoluk kabul değerlendirmesi.

### A7 — İnsan iş akışı, arayüz, bildirim *(A6 ile kısmen paralel; kabaca 6–8 hafta)*
- **İşler:** analist kuyruğu ve onay kapıları; sürümlü düzeltme kütüphanesi; pano, danışan odası, konuşma,
  kalite ekranı, kör nokta haritası; eskalasyonlu bildirim; rapor dışa aktarma.
- **Kapı:** kullanıcının kendi senaryolarıyla kabul testi; kırmızı uyarıdan danışmana ulaşma süresi ölçülmüş;
  okunmayan bildirimin eskalasyonu sınanmış; analistin kuyruktan karar süresi ölçülmüş.

### A8 — Gölge işletim *(kabaca 6–8 hafta)*
- **Amaç:** canlı veriyle, danışana hiçbir şey gitmeden, gerçek dünyada ölçmek.
- **İşler:** 2–3 gerçek danışanla tam işletim; kullanıcının mevcut yöntemiyle (elle izleme ya da satıcı aracı)
  yan yana; her hafta kalite ölçümü; yaşanan her gerçek olay için sonradan bağımsız kronoloji ve kıyas.
- **Kapı:** bölüm 2'deki bütün hedefler canlı veride, güven aralığının alt sınırıyla karşılanıyor; sessiz
  arıza 0; kullanıcı "danışana bununla gidebilirim" diyor.
- **Durma koşulu:** bir boyut iki ardışık hafta hedefin altındaysa ilgili aşamaya geri dönülür.

### A9 — Canlıya alma ve sürekli kalite *(sürekli)*
- Haftalık kalite ölçümü ve kalite ekranı; aylık yeni geçmiş olay eklenerek geri-test; model, kural ve varlık
  dosyası değişiklikleri regresyon setinden geçmeden canlıya alınmaz; kayma alarmı; üç ayda bir kırmızı takım
  ve bağımsız kod incelemesi.

### A10 — Genişleme *(ölçüm verdikçe)*
Çoklu ortam kanallarının kendi Türkçe ölçümüyle açılması; yeni kanallar (her biri önce kör nokta haritasında,
sonra ölçülerek kapsamda); rakip karşılaştırması; olay arşivi ve karşılaştırma; sabah özeti; çok kullanıcı.

---

## 8. Planın kendi denetimi

"Her adım kontrol edilerek" talebi üç düzeyde karşılanır:
1. **Tasarım düzeyi:** bu plan bağımsız bir denetim ekibince araştırmalara ve zayıflık listesine karşı
   sınanır (`D-DENETIM.md`); bulgular plana işlenir.
2. **Aşama düzeyi:** her aşamanın kapısı sayısaldır ve kapıyı ölçen, işi yapan değildir. Kapı sonucu,
   kullanılan veri kümesi ve tarih depoya yazılır.
3. **İşletme düzeyi:** kalite ekranı her hafta günceldir; kullanıcı aracın güvenilirliğini her an görebilir.

---

## 9. Riskler

| # | Risk | Etki | Karşılık |
|---|---|---|---|
| R1 | X ya da başka bir kaynağın sözleşmesi içeriğin yapay zekâ sağlayıcısına gönderilmesini yasaklıyor | Yorum ve anlama düzlemi o kaynakta kullanılamaz | A0'da erken kontrol; yerinde çalışan (kendi sunucumuzda) modeller seçeneği; yalnızca türetilmiş verinin (etiket, sayım) gönderilmesi |
| R2 | Veri sağlayıcı kesintisi ya da iflası (pazarda örnekleri var) | Kör kalma | İki bağımsız toplayıcı; gözetim alarmı |
| R3 | Altın set yetersiz ya da yanlı | Bütün ölçümler yanıltıcı | Bağımsız ekip, uyum eşiği, zaman bölmeli ve tabakalı örnekleme, düzenli yenileme |
| R4 | Türkiye'de erişim kısıtlaması (platform yavaşlatma/engelleme) | Hacimde yapay düşüş, kitlenin görmediği içerik | Gözetimde "erişim olayı" sınıfı; "TR'de görünmüyor" işareti |
| R5 | Model sürüm değişimi isabeti sessizce düşürür | Kayma | Sürüm sabitleme, regresyon kapısı |
| R6 | Analist darboğazı (kriz anında kuyruk taşar) | Gecikme | Önceliklendirme, nöbet planında kriz kapasitesi, takip şirketiyle yedek analist sözleşmesi |
| R7 | Ölçüm maliyeti (etiketleme) sürdürülemez hale gelir | Kalite ekranı eskir | Aktif öğrenme ile etiketlenecek örneğin akıllı seçimi; asgari haftalık örnek sabit |
| R8 | Kullanıcı ölçülmüş belirsizliği "araç emin değil" diye okur | Güven kaybı | Arayüzde sade dil, kalite ekranının anlatımı, kabul testinde birlikte okuma |

---

## 10. Doğrulanmamış varsayımlar (A0'da kontrol edilecek)

Araştırmalar dış sitelerin tam metnine erişemedi; aşağıdakiler plan için önemlidir ve birincil kaynaktan
doğrulanmalıdır:
1. Hangi dinleme platformlarının X ile **bugün** geçerli resmî veri ortaklığı olduğu.
2. X kurumsal erişiminin güncel koşulları, fiyatı ve yapay zekâ maddeleri.
3. Instagram, TikTok, Ekşi Sözlük, Şikayetvar için meşru erişim yolları.
4. Türkiye'deki medya takip şirketlerinin verisinin üçüncü sisteme ve yapay zekâ sağlayıcısına aktarılabilirliği.
5. Türkiye'de erişime kapatılan içeriğin API'de nasıl işaretlendiği.
6. Türkçe duruş, alay ve çoklu ortam yöntemlerinin ölçülmüş başarı rakamları (araştırmada çoğu özetten alındı).
7. Yapay zekâ sağlayıcısının veri saklama ve eğitimde kullanmama koşulları.

---

## 11. Kullanıcıdan gereken kararlar

1. **Eşikler:** bölüm 2'deki başlangıç hedefleri kabul mü? Hangisi sizin için pazarlık konusu değil?
2. **İnsan modeli:** nöbetçi analistler kendi ekibiniz mi, Türkiye'deki bir medya takip şirketinin hizmeti mi,
   karışık mı?
3. **İlk danışanlar:** gölge işletimde hangi 2–3 danışanla çalışılacak?
4. **Geçmiş olaylar:** ölçü aleti için hangi 5–10 Türkiye olayı (sizin bildiğiniz, sonucunu bildiğiniz olaylar
   en değerlisidir)?
5. **Nabız ve Pusula:** Rasat'ın parçaları olarak mı kalsın (Nabız'ın tutumlu tarama yaklaşımı, Pusula'nın
   alan modeli), yoksa arşive mi alınsın?
6. **Kule:** Kule planı Rasat'ın yorum düzlemine dönüştü; ayrı bir ürün olarak sürdürülmesine gerek yok — kabul mü?
