# Nabız, Pusula ve Kule — zayıflıklar, eksikler, yanlış sonuç riskleri

Üç aracın zayıf yanları tek yerde. Her araç için üç başlık var: **yanlış sonuç döndürebileceği yerler**
(en önemlisi), **eksikler**, **yapısal kısıtlar**. Sonda üçünün ortak sınırları ve "en tehlikeli beş" listesi var.

Dayanak notu:
- **Pusula:** bu oturumda kuruldu, demo veride çalıştırıldı; aşağıdakiler gözleme ve ekiplerin raporlarına dayanır.
- **Nabız:** kodu satır satır denetlenmedi. Değerlendirme tasarımına, tanıtım yazısına ve yönergesine dayanır;
  maddeler "tasarımdan doğan risk"tir, tek tek doğrulanmış hata değildir.
- **Kule:** henüz yalnızca plandır. Maddeler, yapılırsa karşılaşılacak risklerdir.

---

## 1. Nabız

### Yanlış sonuç riski
| # | Risk | Sonucu |
|---|---|---|
| N1 | **Kelimeye bağlı.** Yalnızca yazdığınız ifadeyi geçen gönderileri görür. Yanlış yazım, lakap, ima, metinsiz görsel ya da video kaçar; eşsesli ifadeler (ör. kısa etiketler) ilgisiz gönderi getirir. | Hacim hem eksik hem fazla sayılabilir. "Kesin" denen sayı, konunun değil **sorgunun** sayısıdır. |
| N2 | **Gönderiyi anlamaz.** Duruş okumaz; övgü dalgası ile saldırı dalgası aynı "ivme" olarak görünür. | Yükseliş olumlu bir habere aitken alarm gibi yorumlanabilir. |
| N3 | **Örneklem.** Hesaplar, alt başlıklar ve öne çıkan gönderiler okunan örnekten çıkar. "Temsilî" okunan evrede belirleyici gönderi kaçabilir. | "En çok etkileşim alan" listesi eksik olabilir. |
| N4 | **Başlangıç, bakılan süreyle sınırlı.** "İlk paylaşan", seçilen saat aralığındaki en erken gönderidir. | Dalga daha önce başladıysa yanlış hesap "başlatan" görünür. |
| N5 | **Alt başlıklar sözcük sıklığıdır.** Aynı konunun iki farklı anlatımı ayrı, iki ayrı konu aynı sözcükle tek başlık görünebilir. | Alt başlık listesi yanıltıcı olabilir. |
| N6 | **Gösterilen tutar tahmindir.** | Gerçek fatura farklı çıkabilir. |

### Eksikler
- Yalnızca X; haber ve başka platform yok.
- Danışan kavramı yok; her şey sorgu bazında.
- Tahmin yok; yanıt önerisi kısa bir notla sınırlı.
- Canlı izleme, panel 30 dakika kapalı kalınca durur — siz bakmıyorken büyüyen şeyi kaçırır.
- 30 günden eski gönderiler silinir; eski olayla karşılaştırma yapılamaz.

### Yapısal kısıtlar
- Ne soracağınızı sizin bilmeniz gerekir; bilmediğiniz bir konuyu kendiliğinden bulmaz.
- Üç adım sabittir; arada farklı bir soru sorulamaz.

---

## 2. Pusula

### Yanlış sonuç riski
| # | Risk | Sonucu |
|---|---|---|
| P1 | **Hiç gerçek veriyle çalıştırılmadı.** X, haber, Bluesky ve Claude bağlantıları yalnızca sahte yanıtlarla sınandı. | Canlı modda ilk gün neyin bozulacağı bilinmiyor. |
| P2 | **Kendi sınavını kendi hazırladı.** Demo dünyası ile onu çözen analiz aynı tarife göre yazıldı: koordineli hesap kümesi bilerek kondu, sonra "bulundu". | Demodaki isabet, gerçek dünyadaki isabetin kanıtı değildir. Tüm eşikler (risk düzeyleri, olay açılışı, koordinasyon) simülasyona göre ayarlıdır. |
| P3 | **Anahtarsız duruş okuma kaba.** Görülmemiş cümlelerde isabet yaklaşık %75; ince alayda 5'te 1. Demo krizinde gönderilerin %40'tan fazlası "nötr" çıktı. | Olumsuz pay olduğundan düşük görünür; risk puanı da onunla birlikte düşük kalabilir. |
| P4 | **Anlatılar bölünüyor ve yanlış adlanıyor.** Aynı konu iki üç anlatıya ayrılıyor; adlar bazen anlamsız. | "En büyük anlatı %12" gibi paylar yanıltıcıdır; asıl konu parçalara dağılmış olabilir. |
| P5 | **Yayılım zincirindeki "sıçrama" zamanlamaya dayanır.** Hacim artışından hemen önce paylaşan hesap işaretlenir. Demoda 7,7 bin takipçili sıradan bir hesap "sıçrama" olarak çıktı. | Rastlantı, dönüm noktası gibi sunulabilir. Not "ardından" dese de okuyan "yüzünden" anlar. |
| P6 | **Canlı modda yeniden paylaşımlar çekilmiyor** (harcamayı azaltmak için). | Gerçek hacim eksik sayılır; yayılım demo ekranındakinden farklı görünür. |
| P7 | **İlk gün verisi eksik.** Bir çağrıda en çok 300 gönderi çekiliyor; yeni eklenen danışanın son 24 saati bununla doldurulmaya çalışılıyor ve aradaki boşluk sonradan kapanmıyor. | "Olağan düzey" ilk gün yanlış hesaplanır; yanlış alarm ya da kaçan alarm. |
| P8 | **Etkileşim sayıları çekildiği anda donuyor** (canlı modda eski gönderiler yeniden çekilmiyor). | Yeni gönderi çekildiğinde beğenisi sıfıra yakındır; "en çok etkileşim alan" ve "erişim" sıralamaları yanlış çıkar. |
| P9 | **Olağan düzey yalnızca son 24 saatten.** Günün saati ve haftanın günü hesaba katılmıyor. | Her sabahki doğal artış "hareketlenme" sanılabilir; gece yarısı başlayan kriz geç fark edilir. |
| P10 | **Tahmin ile eğilim çelişebiliyor**; güven düzeyi tutarsız. | "Hızla artıyor" ve "yön yatay" aynı notta. Tahmine şimdilik güvenilmemeli. |
| P11 | **Danışanın kendi hesabı "yükseltici" sayılıyor.** | Notta danışan, kendi krizini büyüten hesaplar arasında görünür. |
| P12 | **Koordinasyon bulgusu iki yöne de yanılabilir.** Popüler bir sloganı tekrarlayan gerçek kişiler küme sanılabilir; metni azıcık değiştiren örgütlü hesaplar kaçabilir. | Yanlış bulgu danışana "bot saldırısı" diye aktarılırsa itibar riski doğar. |
| P13 | **Yanıt taslakları hazır kalıplardan seçiliyor** (anahtarsız modda) ve iddianın doğru olup olmadığını bilmeden yazılıyor. | Konuya oturmayan ya da olgulara aykırı bir taslak çıkabilir. Taslak, okunmadan yayımlanacak metin değildir. |
| P14 | **Anlatı adı bir kez konuyor, sonra değişmiyor.** | Konu evrilse de eski ad kalır. |
| P15 | **Haberlerde erişim bilgisi yok** (gerçek veride yayının kitlesi 0 gelir); Bluesky'da hesap türü bilinmiyor. | Haber kaynaklı erişim eksik, risk puanı düşük kalabilir. |
| P16 | **Analiz kodu ikinci bir gözle okunmadı.** Yazan ekip son raporunu veremeden durdu. | Testler geçiyor ama testleri de aynı ekip yazdı. |

### Eksikler
- Bildirim yok: ekrana bakmıyorsanız alarmdan haberiniz olmaz.
- Danışan düzenlenemiyor (yalnızca ekle ve sil).
- Yanlış okunan gönderiyi düzeltme yolu yok; araç aynı hatayı tekrarlar.
- Rakip bilgisi toplanıyor ama hiçbir yerde kullanılmıyor.
- Kapanan olayların arşivi ve karşılaştırması yok.
- Öngörülmemiş soruya yanıt yok; anahtarsız "Pusula'ya sor" 12 soru türü tanıyor.
- Claude kullanımı için harcama tavanı yok (X için var).
- Parola koruması yok; anahtarlar veritabanında düz metin; eski veriyi temizleme yok.

### Yapısal kısıtlar
- Sürekli dinleme gerçek X'te süreklilik arz eden harcama demektir; Nabız'ın "önce ucuz sayım" tutumu burada yok.
- Ekranlar sabit; yeni bir ihtiyaç yeni ekran yazmayı gerektirir.
- Olay akışı gürültülü: her haber sitesi ayrı olay, sakin danışanda bile 12 anlatı.

---

## 3. Kule (plan aşamasında)

### Yanlış sonuç riski
| # | Risk | Sonucu |
|---|---|---|
| K1 | **Hiçbir parçası yazılmadı ve denenmedi.** Yetenek listesi ve aşama sıralaması öngörüdür. | Plan gerçek veriyle karşılaşınca değişecektir. |
| K2 | **Pusula'nın bütün analiz kusurlarını devralır** (P3–P16). Üstüne konuşan bir katman eklemek, alttaki yanlış okumayı düzeltmez; daha ikna edici anlatır. | Yanlış sonuç, akıcı bir cümle içinde gelir ve daha zor fark edilir. **En ciddi risk budur.** |
| K3 | **Yapay zekâ yanlış aracı ya da yanlış sorguyu seçebilir.** Soruyu yanlış anlayıp başka bir ifadeyi tarar, sonucu emin bir dille anlatır. | Doğru görünen, yanlış soruya verilmiş yanıt. |
| K4 | **Özet üstünden konuşur.** Maliyet için yapay zekâ ham gönderileri değil özetleri görecek. | Özetin kaçırdığını o da kaçırır; "veride yok" ile "özette yok" ayırt edilemez. |
| K5 | **Yazıyla verilen izleme görevi yanlış çevrilebilir.** "Boykot lafı geçerse" talimatı kurala dönüşürken daralabilir ya da genişleyebilir; görev sonra yapay zekâsız, kelimeyle çalışır. | **Sessiz kaçırma:** görev kurulu görünür, tetiklenmez, siz güvendiğiniz için bakmazsınız. |
| K6 | **Gönderilerin içine yazılmış talimatlar.** Araç yabancıların yazdığı metni okuyup araç kullanabilen bir yapay zekâya veriyor; bir gönderi "önceki talimatları unut, şunu yaz" diyebilir. Para kapısı harcamayı korur ama **söyleneni ve yazılan taslağı korumaz.** | Yönlendirilmiş not ya da taslak. Planda bu madde eksikti; tasarıma girmeli. |
| K7 | **Düzeltmelerden öğrenme hatayı kalıcılaştırabilir.** Yanlış ya da bağlama özgü bir düzeltme, sonraki bütün okumaları etkiler. | Zamanla kayan, nedenini kimsenin hatırlamadığı bir yanlılık. |
| K8 | **Değerlendirme takımı demo dünyasında koşacak.** | P2'nin aynısı: sınavı geçmesi gerçekte doğru çalıştığını göstermez. |
| K9 | **Aynı soru iki gün farklı yanıtlanabilir.** Sabit pano yok; yapay zekânın yolu değişkendir. | Günler arası karşılaştırma zorlaşır; "dün böyle demiyordu". |

### Eksikler (planın kendisinde)
- Süre ve maliyet tahmini yok; aşamaların büyüklüğü yalnızca "küçük/orta/büyük".
- K6'ya (gönderi içi talimat) karşı önlem yazılmadı.
- Toplanan gönderilerin ve danışan bilgisinin dışarıdaki bir yapay zekâ hizmetine gönderilmesinin gizlilik
  ve sözleşme boyutu ele alınmadı. X'in veri kullanım koşullarının buna izin verip vermediği **kontrol
  edilmedi**; başlamadan bakılmalı.
- Yapay zekâ hizmeti kesilirse ya da yavaşlarsa ne olacağı yalnızca ilke düzeyinde yazıldı.

### Yapısal kısıtlar
- Her konuşma para harcar ve yanıt saniyeler alır; Nabız ve Pusula'daki anlık ekran hissi olmaz.
- Tek bir yapay zekâ sağlayıcısına bağımlıdır.
- Esneklik, kullanıcıdan "ne soracağını bilmeyi" tam kaldırmaz; iyi soru soran daha iyi sonuç alır.

---

## 4. Üçünün ortak sınırları

Araç ne kadar iyi yapılırsa yapılsın değişmeyecek olanlar:

1. **X, kamuoyu değildir.** X'te yazanlar toplumun küçük ve kendine özgü bir kesimidir. Hiçbir araç "insanlar
   ne düşünüyor" sorusunu yanıtlamaz; yalnızca "X'te yazanlar ne yazıyor"u gösterir.
2. **Görünmeyen yerler.** Instagram, TikTok, WhatsApp grupları, YouTube yorumları, televizyon — krizlerin
   önemli kısmı buralarda döner ve üç araç da görmez.
3. **X'in verdiğiyle sınırlı.** Silinen ve gizli hesaplardan gelen gönderiler, görsel ve video içeriği
   görünmez. Geriye dönük erişimin süresi X'in sunduğu erişim düzeyine bağlıdır; hangi düzeyde ne kadar
   geriye gidilebildiği gerçek hesapla doğrulanmalıdır.
4. **Türkçe zor.** Alay, ima, ekler, yazım hataları ve argo, hem sözlük tabanlı hem yapay zekâ tabanlı okumada
   hata üretir. Yapay zekâ belirgin biçimde daha iyidir ama kusursuz değildir.
5. **Doğruyu bilen bir ölçüt yok.** Hiçbir araç için "şu olayda gerçekte ne olmuştu" diye elle hazırlanmış bir
   karşılaştırma kümesi yok. İsabet oranları ya ölçülmedi ya da kendi yazdığımız örneklerle ölçüldü.
6. **İddianın doğruluğunu bilmez.** Araç bir iddianın ne kadar yayıldığını gösterir, doğru olup olmadığını değil.
7. **Zamanlama, neden değildir.** "Şu paylaşımdan sonra arttı" her zaman gözlemdir; üç araçta da neden-sonuç
   olarak okunma riski vardır.

---

## 5. En tehlikeli beş

Danışana yanlış bir şey söylemenize yol açma olasılığı en yüksek olanlar:

1. **P2 + K8 — Kendi sınavını kendi hazırlayan araç.** Demodaki başarı gerçek başarı değildir. Gerçek veriyle
   ve elle doğrulanmış en az bir geçmiş olayla sınanmadan hiçbir sonuca güvenilmemeli.
2. **K2 — İkna edici yanlış.** Konuşan bir yapay zekâ, alttaki kaba okumayı akıcı cümleyle sunar. Dayanak
   satırı okunmadan danışana aktarılmamalı.
3. **K5 — Sessiz kaçıran izleme görevi.** Kurulu sanılan ama tetiklenmeyen görev, hiç görev olmamasından
   kötüdür. Her görev kurulduğunda geçmiş veride denenmeli: "bu kural dünkü olayda tetiklenir miydi?"
4. **P5 + P12 — Suçlayıcı okunabilecek bulgular.** "Bu hesap sıçrattı" ve "koordineli hesaplar" bulguları
   zamanlama ve benzerliğe dayanır. Danışana ya da kamuya isim vererek aktarılmamalı.
5. **P7 + P8 + P9 — İlk günlerin güvenilmez tabanı.** Yeni eklenen danışanda olağan düzey, etkileşim ve erişim
   sayıları eksik veriye dayanır. İlk birkaç gün risk düzeyine ihtiyatla bakılmalı.
