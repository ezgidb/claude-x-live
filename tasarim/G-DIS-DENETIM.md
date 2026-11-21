# G — Dış denetim: yeni ekip şefinin gözden geçirmesi

Yazan: yeni ekip şefi. Tarih: 21 Kasım 2026. Girdi: `BRIEF-YENI-SOHBET.md`, `tasarim/` altındaki bütün belgeler,
`ZAYIFLIKLAR.md`. **Hukuki görüş değildir.**

Okuma notu:
- **[ölçüldü]** = bu oturumda birincil kaynaktan kontrol edildi.
- **[önceki ekip]** = önceki ekibin birincil kaynak okumasına dayanıyor; bu oturumda yeniden okunamadı (docs.x.com
  bu oturumun ağ ayarlarında açık değil).
- **[kendi hesabım]** = varsayımları yazılı kaba hesap.

---

## 1. Yapı: elimizde ne var (sade anlatım)

Çalışma üç katmandan oluşuyor:

**Katman 1 — Çalışan ya da denenmiş araçlar (kod).**
| Araç | Durum | Ne yapıyor |
|---|---|---|
| **Nabız** | Çalışıyor; gerçek X sayım verisiyle | Ucuz sayımla tarama → inceleme planı → onaylı, hedefli gönderi okuma |
| **Pusula** | Yalnız uydurma (demo) veriyle çalıştı | Danışan odaklı gündem odası: anlatı, yayılım, risk, durum notu |
| **Kule** | Yalnız plan | Konuşarak yönetilen araç fikri |

**Katman 2 — Tasarım süreci (belgeler, ~54 bin kelime).**
Gereksinim → üç araştırma (pazar, veri/hukuk, yöntem) → plan → bağımsız denetim (39 bulgu) → sürüm 3 (bütçesiz, tam ölçek)
→ **sürüm 4 (yalın, ~3.000 $/ay)** → gri alan ve Future Bright değerlendirmesi.

**Katman 3 — Geçerli karar: Rasat, sürüm 4 (`PLAN.md`).**
Sekiz adımlı akış: tanım → dinleme → alarm → okuma ⇄ öğrenme → analiz → yorum/rapor → haftalık ölçüm. Üç temel fikir:
1. **İki katmanlı veri:** hacim ve trend her 15 dakikada ucuz sayımdan (kesin); gönderi okuma bütçeli (normalde %100,
   krizde örnek).
2. **Öğrenen etiketleme:** model eğitilmez; etiketçinin gerekçeli kararları "örnek kütüphanesi"ne girer, sistem
   benzer gönderide bu örneklere bakar. Doğruluk iddiası yalnız kör denetim örneğinden gelir.
3. **Uyum mimarisi:** kişi değil gönderi etiketlenir; kullanıcı kimliği saklanmaz; danışan başına "uyum profili"
   (standart / genişletilmiş); beş kırmızı çizgi.

---

## 2. Önceki ekibin güçlü yanları (katılıyorum)

1. **"Önce ucuz sayım, sonra hedefli okuma"** bu bütçede doğru temel. Nabız'ın kanıtlanmış yaklaşımı.
2. **Ölçüm dürüstlüğü:** "%90" iddiasının yalnız kör denetimden gelmesi, alay/ima için "belirsiz" dilimi, kapsamın
   dolaylı ölçüldüğünün açıkça yazılması. Piyasadaki rakiplerin çoğunda bu yok; gerçek bir satış farkı.
3. **Model eğitmek yerine örnek kütüphanesi:** hem X'in eğitim yasağıyla uyumlu hem geri alınabilir.
4. **Karantina ilkesi** (gönderiyi okuyan model işlem yapamaz) ve **"sayıyı model yazmaz"** ilkesi.
5. **Alarm kurallarının geçmiş 30–90 günde denenmesi** ("bu kural geçen ay kaç kez öterdi?").
6. **Kanun ≠ sözleşme** ayrımı ve kırmızı çizgiler.
7. Bütçesiz sürüm 3'ten yalın sürüm 4'e geçiş cesur ve doğru bir karardı.

---

## 3. Bulgular

Önem: **Kritik** (düzeltilmeden ilerlenmemeli) · **Yüksek** (A0 içinde çözülmeli) · **Orta** · **Düşük**.

### Kritik

**G-1. Sürüm 4'e geçerken bazı yükümlülükler kayboldu.** Sürüm 3 ve denetimde (D) ele alınan ama yalın plana
taşınmayan konular:
- **X silme uyumu:** silinen, korumaya alınan, askıya alınan gönderiler belirli süre içinde sistemden (türetilmiş
  kayıtlar, örnek kütüphanesi, yapay zekâ sağlayıcısındaki kopya dahil) düşmeli (D-6, B §3.1). Sürüm 4'te hiç yok. Örnek
  kütüphanesi ve "olaylar arası karşılaştırma" doğrudan etkilenir.
- **X içeriğini danışana aktarma sınırı:** alıcı başına günde en çok 50.000 tam gönderi, kamuya yayımlanamaz
  [önceki ekip, B §3.1]. Pano ve danışan raporu tasarımı buna göre yapılmalı.
- **Rakip danışanlar arası çıkar çatışması ve veri ayrımı:** siyasi danışanlar olacaksa iki rakip siyasetçiye aynı anda
  hizmet, aynı etiketçi, aynı örnek kütüphanesi ciddi gizlilik ve güven sorunu. Sürüm 4'te tek cümle yok.
- **Bot / koordinasyon ve "suçlayıcı bulgu" uyarısı:** `ZAYIFLIKLAR.md`'nin "en tehlikeli beş" listesinde 4. sırada;
  siyasi danışanların en çok soracağı soru ("bu organize mi?"). Sürüm 4'te ne yöntem ne de "isim vermeden aktar" kuralı
  var.
- **Kriz anında kuyruk ve "bozulmuş mod"** (D-13): kuyruk taşınca ekranda ne görüneceği tanımsız.

**G-2. "%20 insan" ifadesi iki farklı şey olabilir ve etiketçi kapasite hesabı yok.**
- Plan bunu "okunan gönderilerin %20'si insana gider" diye okuyor. Kullanıcı büyük olasılıkla "doğrulanmış %20'lik
  bir örnekten öğrenip gerisine uygula" demek istedi. İkisi çok farklı iş yükü.
- [kendi hesabım] 5 danışan, ayda ~300 bin okunan gönderi ≈ günde 10 bin. Bunun %20'si = günde 2.000 gönderi × 10 sn
  ≈ **5,5 saat saf etiketleme**. İlk ay öngörülen %30–50 payla günde **8–14 saat**: tek etiketçi yetmez. Kriz günü
  hacim 5–10 katına çıkar.
- **Öneri:** insan payı "trafiğin %X'i" değil, **"günlük sabit kapasite"** olarak tanımlanmalı (ör. günde 600–800
  gönderi). Kuyruk önceliklendirilir; taşan kısım "belirsiz" kalır ve oranlarda ayrı dilim olarak gösterilir.

### Yüksek

**G-3. Doğruluk ölçümü kısmen kendi kendini doğruluyor.** Sistem etiketçinin örneklerinden öğreniyor; doğruluğu da aynı
etiketçi ölçüyor. Ölçülen şey "doğruluk" değil, "etiketçiye uyum"dur. Danışmanın haftalık ~30 örneği bunu kısmen
telafi eder, ama istatistik gücü düşük: [kendi hesabım] 4 haftada 120 örnekte %90 ölçülürse %95 güven aralığı kabaca
%83–94'tür. Her görev × her danışan için ayrı hedef konursa örnek sayısı yetmez.
**Öneri:** "%90" iddiası (a) bütün danışanlar toplamında, (b) yalnız ilgililik ve kaba duruş için, (c) **alt sınır**
olarak verilsin ("en az %85, büyük olasılıkla %90"). Danışmanın örnekleri ayrı bir "ikinci göz" ölçümü olarak raporlansın.

**G-4. "Gerçek veriyle çalışılmaz" kuralı gereğinden geniş; ürünü gereksiz geciktiriyor.** Sayım verisi (saatlik
hacim) kişisel veri içermez. Alarm ürünü (A1) KVKK aktarım kararını beklemeden gerçek sayımla kurulabilir. Kişisel veri
ancak gönderi okuma (A2) ile başlar. **Öneri:** A0'ın hukuk kısmı ile A1 paralel yürüsün; alarm ürünü ~2. ayda değil
~1. ayın sonunda denenebilir.

**G-5. Bütçe ve iş modeli eksik.**
- 3.000 $ tavan hâlâ teyit edilmedi; tavanın insan maliyetini (etiketçi, hukukçu, teknik destek) içerip içermediği
  bilinmiyor. Tablo insanları dışarıda bırakıyor.
- Hizmet satılacak, ama **danışana ne kadar fiyat verileceği** (birim ekonomi: danışan başına veri + yapay zekâ + insan
  payı → asgari fiyat) hiç hesaplanmadı. Bu, kullanıcının en önemli iş kararı.

**G-6. Gri alan belgesinde iç tutarsızlık: G3 (etkileyici haritası).** Belgenin kendi ilkesi "fark adda değil, neyin
saklandığında". G3'te ise ≥ 10 bin takipçili hesaplar için **kişi adıyla birlikte, olaylar boyunca hangi söylem
çerçevelerini kullandığı** saklanıyor. Bu, adı konmamış bir siyasi profildir. X kuralı "herhangi bir X kullanıcısı"
diyor; kamusal figür istisnası yazılı değil (önceki ekip de bunu not etmiş). Bence X riski 🟡 değil **🟠**.
Siyasetçi, parti, medya kurumu gibi **beyanı zaten kamusal** hesaplarda (kamusal aktör defteri) risk daha düşük;
"10 bin takipçili herhangi bir hesap" eşiği ise geniş.

**G-7. Future Bright hükmü fazla yumuşamış olabilir.** İlk değerlendirme "X'in (d) maddesinin ve KVKK'nın tam
ortasında" diyordu; kullanıcının itirazından sonra "açıkça hukuka aykırı değil, gri alan"a çekildi. Bazı düzeltmeler
yerinde (AYM kararı, platformda hedefleme, büyük hesaplar). Ancak **etnik köken segmenti** için:
- etnik köken özel nitelikli veridir;
- 7499 sonrası "alenileştirme" dayanağı, kişinin **o veriyi kendisinin** kamuya açmasını gerektiriyor; ağ verisinden
  etnik köken **çıkarmak** kişinin alenileştirdiği bir şey değildir;
- 28/1-b (anonim istatistik) savunması, kümeleme anında kişi düzeyinde çıkarım yapıldığı için zayıf.
Bu yüzden o segment için doğru etiket bence **🟠–🔴**, "savunması olan gri alan" değil. Bu yargıyı avukat verecek;
ama danışana sunulacak bir yöntem olarak bu kalem "gri" diye sınıflanmamalı.

**G-8. Yapay zekâ maliyeti hafife alınmış.** [kendi hesabım]
- Plan gönderi başına ~100–200 token varsayıyor. Tasarım ise her okumaya kod kitabı + benzer etiketli örnekler
  ekliyor: gönderi başına 1.500–3.000 token. Kod kitabı önbelleğe alınabilir; benzer örnekler alınamaz.
- Haiku 5.5'te "düşünme" varsayılan açık; çıktı token'ı da artar [ölçüldü: güncel API başvurusu].
- **Toplu iş indirimi (%50) canlı alarmla uyuşmuyor:** toplu iş 24 saate kadar sürebilir; "çerçeve yükselişi" gibi
  alarmlar canlı okuma ister.
- Kaba yeniden hesap: Haiku ~30–70 $, Sonnet ikinci görüş (%20) ~200–300 $, Opus notlar ~120–180 $ → **ayda ~400–600 $**
  (plan: 150–300 $). Toplam bütçe 1.800–3.000 $'dan **2.100–3.300 $**'a çıkar; tavana dayanır.
- Fiyatlar [ölçüldü]: Haiku 5.5 0,10/0,50 $, Sonnet 5.5 2/10 $, Opus 5.5 4/20 $ (milyon token, giriş/çıkış). Haiku
  fiyatı 100 bin token'a kadar istemler içindir.

**G-9. Sayım maliyeti kural sayısıyla çarpılıyor.** "Danışan başına günde ~100 istek" tek sorgu içindir. Kelime
birlikteliği, eşik, hesap bazlı her sayım kuralı ayrı sorgudur: [kendi hesabım] 10 kural × 96 yoklama/gün ≈ 1.000
istek/gün ≈ danışan başına **ayda ~145 $** (plan: 15–30 $). Çözüm kolay: 15 dakikalık yoklama yalnız ana sorguya; diğer
kurallar saatlik ya da okunan veriden hesaplanır.

### Orta

**G-10. Siyasi danışanın asıl ihtiyacı ile kırmızı çizgi çatışabilir.** "Miting/protesto izleme" yasak. Ama siyasi
danışan büyük olasılıkla **kendi mitingine** ya da **kendi açıklamasına** gelen tepkiyi görmek isteyecek. Bunun
"danışanın kendi etkinliğine gelen tepki" olarak sınırlanıp sınırlanamayacağı netleşmeli (X'e yazılı soru listesine).

**G-11. Sıfır saklama ve model seçimi.** KVKK 1. yolu sıfır saklamaya dayanıyor. Bazı yapay zekâ özellikleri sıfır
saklamayla kullanılamıyor (ör. Fable 5.2 en az 30 gün saklama istiyor; "mesaj dizisi" ve "yönetilen ajan" özellikleri de
sıfır saklama kapsamında değil) [ölçüldü]. X içeriğinin gittiği her yolda bu özellikler kullanılmamalı.

**G-12. Model geri çevirmeleri.** Nefret söylemi ve siyasi şiddet içeren gönderilerde model yanıt vermeyi
reddedebilir; Haiku'da otomatik yedek model yok [ölçüldü]. Akışta "reddedildi → belirsiz / insana" yolu tanımlanmalı.
Yoksa en hassas gönderiler sessizce kaybolur.

**G-13. Belge yığını tek doğruluk kaynağı değil.** ~54 bin kelime, birbiriyle çelişen sürümler (arşiv sürüm 3, sürüm
2'ye karşı yazılmış denetim, Nabız/Pusula/Kule zayıflıkları). Teknik olmayan bir kullanıcı için `PLAN.md` tek kaynak
olmalı; diğerleri "arka plan" diye işaretlenmeli. Pusula ve Kule'nin geleceği (Rasat'a mı katılıyor, bırakılıyor mu)
yazılı değil.

**G-14. X erişimi ve hesabı.** Kullanıcının X geliştirici hesabı, ödeme yöntemi, harcama tavanı ayarı var mı? Nabız
çalışıyorsa vardır; ama planda bu "A0'da açılacak" diye geçiyor. Netleşmeli.

### Düşük

**G-15.** X fiyat ve kural bilgileri bu oturumda yeniden okunamadı (ağ izni yok). Önceki ekibin 20.11.2026 tarihli
okumasına güveniyorum; A0'daki küçük denemede (yazar bilgisinin ücretlenmesi) fiyatlar zaten ölçülecek.

**G-16.** Haber tarafında GDELT'in Türkçe yerel haber kapsamı ölçülmedi; "haber geçişi" alarmının kaçırma oranı
bilinmiyor.

---

## 4. Özet hüküm

- **Yön doğru.** Sayım + hedefli okuma, ölçülmüş doğruluk ve uyum mimarisi sağlam bir temel.
- **Sürüm 4 fazla yalınlaşırken bazı zorunlu parçaları düşürdü** (G-1). Bunlar geri eklenmeden gerçek gönderi okumaya
  geçilmemeli.
- **İnsan iş yükü ve maliyet iyimser** (G-2, G-8, G-9). Bütçe büyük olasılıkla tavana dayanır; etiketçi tek kişiyle
  ilk ayları taşıyamaz.
- **İlk ürün daha erken gelebilir** (G-4): sayım ve alarm, kişisel veri içermediği için hukuk kararını beklemeden.
- **Gri alan değerlendirmesinde iki yerde (G3 ve etnik segment) risk düşük gösterilmiş** (G-6, G-7).
- Kullanıcıya sorulmadan çözülemeyecek konular mülakat planına taşındı (`H-MULAKAT-PLANI.md`).
