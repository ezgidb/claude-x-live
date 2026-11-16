# Kule — konuşarak yönetilen gündem aracı için vizyon ve çalışma planı

"Kule" çalışma adıdır; beğenmezseniz değişir. Bu belge, Nabız ve Pusula'dan öğrenilenlerin üstüne kurulacak
üçüncü aracın **ne olduğunu, neden öyle olduğunu ve hangi sırayla yapılacağını** anlatır. Yapım işini başka
modeller üstlenebilsin diye her aşama kendi başına okunabilir yazıldı. Ayrıntılı kusur listesi için
`pusula/DEVIR.md`'ye bakın; burada tekrar edilmedi.

---

## 1. Tek cümlede vizyon

**Ekranı siz değil, konuşma belirler:** danışman ne istediğini yazıyla söyler; içerideki yapay zekâ hangi
verinin gerektiğine karar verir, maliyetini söyler, onay alır, işi yapar ve sonucu hem anlatır hem ekrana
kalıcı bir kart olarak koyar.

Nabız'da siz adımları sırayla yürütüyordunuz. Pusula'da araç her şeyi kendisi yapıyor ama size yalnızca
önceden çizilmiş ekranları gösteriyor. Kule'de araç bir **çalışma arkadaşı**dır: "neye ihtiyacım olacağını
bilmiyorum" durumuna göre tasarlanır.

## 2. İki araçtan çıkan dersler

| | Nabız | Pusula |
|---|---|---|
| **Güçlü yanı** | Parayı ciddiye alır: önce ucuz sayım, sonra plan, sonra onay. "Kesin" ile "örnekleme dayalı" olanı ayırır. Gerçek X verisiyle çalışacak biçimde olgun. | Danışanı merkeze koyar. Konuşmayı anlar: anlatılar, duruş, yayılım zinciri, aktör rolleri, risk, tahmin, yanıt planı. Çok kaynaklı. Sürekli dinler. |
| **Zayıf yanı** | Katı üç adım; yalnızca X; gönderiyi "okumaz", yalnızca sayar. Ne soracağınızı sizin bilmeniz gerekir. | Ekranlar sabit; öngörülmemiş bir soruya yanıtı yok. Sürekli dinleme gerçek X'te pahalıdır ve hiç denenmedi. Eşikler simülasyona göre ayarlı. Anahtarsız yorum kaba. |
| **Kule'ye taşınacak** | Sayım-önce yaklaşımı, plan ve onay kapısı, harcama defteri, güven satırı, gözlem günlüğü | Danışan dosyası, analiz modülleri, kaynak bağdaştırıcıları, durum notu ve yanıt planı, canlı akış |
| **Geride bırakılacak** | Sabit üç aşamalı akış | Sabit pano; "her şeyi her zaman çek" varsayımı |

Çıkan ana fikir: **Nabız'ın tutumluluğu ile Pusula'nın anlayışı aynı araçta birleşmeli; hangisinin ne zaman
kullanılacağına da kullanıcı değil, yapay zekâ karar vermeli — kullanıcının koyduğu sınırlar içinde.**

## 3. Tasarım ilkeleri

1. **Yetenekler küçük ve kesin, akıl esnek.** Araç, her biri tek iş yapan parçalardan ("yetenek") oluşur:
   say, çek, anlamlandır, analiz et, karşılaştır, izlemeye al, not yaz, grafik çiz. Yapay zekâ bunları bir
   araya getirir. Yeni bir ihtiyaç çıktığında ekran yeniden tasarlanmaz; ya mevcut yetenekler başka sırayla
   kullanılır ya da bir yetenek eklenir.
2. **Para kuralını kod uygular, yapay zekâ değil.** Her yetenek tahmini maliyetini bildirir. Sınırın üstündeki
   iş, kod düzeyinde durur ve onay ister. Yapay zekâ bu kapıyı ikna yoluyla aşamaz. Kullanıcı "şu tutara kadar
   sorma" derse sınır o oturum için yükselir.
3. **Önce ucuz olan.** Yapay zekâ bir soruyu yanıtlarken önce eldeki veriye, sonra sayıma, en son gönderi
   çekmeye başvurur. Bu sıra yönergeyle değil, yeteneklerin maliyet bilgisiyle sağlanır.
4. **Her cümlenin dayanağı görünür.** Yanıttaki her sayı ve iddia, hangi yeteneğin hangi çıktısından geldiğini
   taşır. Sayım kesindir; yorum örnekleme dayanır ve öyle etiketlenir. Neden-sonuç yazılmaz.
5. **Konuşma geçicidir, kart kalıcıdır.** Yapay zekânın ürettiği her grafik, tablo ya da not bir "kart"tır;
   kullanıcı isterse panoya sabitler, canlı güncellenir. Pano böylece kullanıcının sorduklarından kendiliğinden
   oluşur.
6. **Kalıcı görevler yazıyla verilir.** "Anadolu Süt'te boykot lafı geçerse haber ver", "her sabah 8'de özet
   çıkar" gibi talimatlar nöbete dönüşür. Nöbetin ne izlediği, ne sıklıkla çalıştığı ve günde en çok ne
   harcayacağı yazılı olarak görünür ve onaylanır.
7. **Araç öğrenir, ama görünür biçimde.** Kullanıcının düzeltmeleri ("bu alay değil", "bu hesap bizim
   çalışanımız") danışan dosyasına yazılır; dosya okunabilir ve düzenlenebilir bir metindir.
8. **Yapay zekâ yokken de ayakta kalır.** Anahtar yoksa ya da çağrı başarısızsa yetenekler tek tek, düğmelerle
   kullanılabilir. Konuşma katmanı bir kolaylıktır, tek kapı değildir.

## 4. Kullanıcı ne görecek

Tek ekran, üç bölge:

- **Solda danışanlar ve nöbetler** — kimler izleniyor, hangi nöbet açık, bugün ne harcandı.
- **Ortada tuval** — sabitlenmiş kartlar: risk, nabız grafiği, anlatılar, yayılım zinciri, durum notu ya da
  kullanıcının o gün sorduğu herhangi bir şeyin çıktısı. Kartlar canlı güncellenir, taşınır, kaldırılır.
- **Sağda konuşma** — yazıyla istek. Yanıt düzyazı + kart olarak gelir; her kartın altında "neye dayanıyor"
  ve "panoya sabitle".

Örnek konuşmalar (hedeflenen davranış):

> **"Sarı torba konusunda bir şey var mı?"**
> → Sayım yapar (yarım sent), "Son 3 saatte olağanın 4 katı; okumak için yaklaşık 1,20 $ gerekir, çekeyim mi?"
> diye sorar.
>
> **"Çek. Kim başlatmış?"**
> → Gönderileri çeker, yayılım zincirini çıkarır, en erken paylaşımı gösterir, "elimizdeki veride en erken bu;
> daha eskisi olabilir" notunu düşer.
>
> **"Bunu geçen ayki rötar olayıyla karşılaştır."**
> → Arşivden iki olayı yan yana koyar: hız, zirve, olumsuz pay, medyaya giriş süresi.
>
> **"Boykot çağrısı 100 gönderiyi geçerse bana haber ver, günde 2 dolardan fazla harcama."**
> → Nöbeti kurar, koşulunu ve tavanını yazıyla geri okur, onay ister.
>
> **"Danışana gönderilecek yarım sayfalık not hazırla, taslak açıklama da olsun."**
> → Durum notu ve yanıt planından belge kartı üretir; dışa aktarılabilir.

## 5. Mimari

```
        Konuşma + tuval (tarayıcı)
                  │
           ┌──────┴──────┐
           │   AJAN      │  Claude, araç kullanımıyla (tool use) döngü
           │  (akıl)     │  — niyet çözme, plan, yetenek seçimi, anlatım
           └──────┬──────┘
                  │  her çağrı buradan geçer
           ┌──────┴──────┐
           │   KAPI      │  maliyet tahmini · tavan · onay · kayıt (kod; yapay zekâ değil)
           └──────┬──────┘
   ┌──────────┬───┴──────┬───────────┬───────────┐
   │ Kaynak   │ Anlam    │ Analiz    │ Çıktı     │   YETENEKLER
   │ say/çek  │ duruş,   │ nabız,    │ kart,     │   (küçük, saf, testli)
   │ X, haber,│ anlatı   │ anlatı,   │ not, plan,│
   │ Bluesky  │          │ zincir,   │ belge     │
   │          │          │ risk…     │           │
   └────┬─────┴────┬─────┴─────┬─────┴─────┬─────┘
        └──────────┴─────┬─────┴───────────┘
                    ┌────┴────┐
                    │  DEPO   │ gönderiler · olaylar · kartlar · nöbetler ·
                    │         │ danışan dosyaları · harcama defteri · konuşma
                    └─────────┘
              Zamanlayıcı: nöbetleri çalıştırır (yapay zekâsız da çalışır)
```

Mevcut koddan ne nereye gider:

| Kule parçası | Kaynağı | Yapılacak iş |
|---|---|---|
| Kaynak: X sayım, sorgu kurma, harcama defteri | Nabız `src/xapi.js` | Yetenek olarak sar |
| Kaynak: X gönderi, haber, Bluesky | Pusula `src/sources/` | Yetenek olarak sar; gerçek veriyle doğrula |
| İnceleme planı (hangi evreden kaç gönderi) | Nabız `src/plan.js` | "Çekim planı" yeteneği |
| Depo | Pusula `src/store.js` | Kart, nöbet, konuşma, dosya tabloları ekle |
| Analiz | Pusula `src/analysis/` | Olduğu gibi; her biri ayrı yetenek olarak da çağrılabilsin |
| Anlamlandırma, not, plan | Pusula `src/ai/` | Olduğu gibi; ajan döngüsü yeni yazılacak |
| Gözlem günlüğü | Nabız `src/journal.js` + Pusula `events.js` | Tek olay akışında birleştir |
| Demo dünyası | Pusula `src/sources/simulator.js` | Olduğu gibi; ajanı parasız denemek için şart |
| Grafikler | Pusula `public/charts.js` | Kart bileşenlerine dönüştür |
| Sabit pano ve motorun "hepsini her turda yap" döngüsü | Pusula `engine.js`, `room.js` | **Yerini ajan + nöbetler alır**; "varsayılan pano" hazır kart düzeni olarak kalır |

Teknik tercihler: mevcut kurallar korunur (Node ≥ 22.5, SQLite, olabildiğince bağımlılıksız). Ajan döngüsü
Claude API'nin araç kullanımıyla kurulur; yazan ekip model kimlikleri, araç tanımı biçimi ve akış (streaming)
için güncel belgeye baksın, ezbere yazmasın. Model dağılımı: toplu anlamlandırma hızlı ve ucuz modelle,
konuşma orta modelle, durum notu ve yanıt planı en yetenekli modelle; hepsi ayardan değiştirilebilir.

### Yetenek sözleşmesi (bütün aracın omurgası)

Her yetenek aynı kalıba uyar; ajan, düğme ve nöbet aynı kapıdan geçer:

```js
{ ad: 'x.say',
  aciklama: 'Verilen ifadelerin X\'teki saatlik gönderi sayısı. Gönderi okumaz.',   // ajanın okuduğu metin
  girdi: { /* JSON şeması */ },
  maliyet: (girdi) => ({ usd: 0.005, kesin: true }),      // çalıştırmadan önce tahmin
  yanEtki: 'yok' | 'veri-yazar' | 'dışarı-gönderir',
  calistir: async (girdi, baglam) => ({ veri, dayanak: { yontem, ornek, kesinlik }, kart? }) }
```

İlk yetenek kümesi (yaklaşık 20): `x.say`, `x.cek`, `haber.cek`, `bluesky.cek`, `plan.cikar`, `depo.sorgula`,
`anlam.zenginlestir`, `analiz.nabiz`, `analiz.anlatilar`, `analiz.zincir`, `analiz.aktorler`,
`analiz.koordinasyon`, `analiz.risk`, `analiz.tahmin`, `olay.karsilastir`, `not.durum`, `not.yanit-plani`,
`kart.olustur`, `nobet.kur`, `nobet.listele`, `dosya.oku`, `dosya.guncelle`, `harcama.durum`.

## 6. Çalışma planı

Her aşamanın sonunda **çalışan ve kullanıcının deneyebileceği** bir şey çıkar. Sıra önemlidir: sonraki aşama
öncekinin üstüne kurulur.

### Aşama 0 — Gerçek veriyle yüzleşme *(küçük iş; para harcar, onay gerekir)*
Pusula'nın gerçek kaynakları hiç denenmedi. Kule bunların üstüne kurulacağı için önce bu yapılır.
- Haber ve Bluesky'ı gerçek bir danışan adıyla çalıştır (ücretsiz).
- Onayla, küçük bir X denemesi: sayım, gönderi çekme, harcama tavanının gerçekten durdurduğu.
- Onayla, Claude ile anlamlandırma ve not: istek biçimi, hata durumu, gerçek maliyet.
- **Bitti sayılır:** her kaynak için "çalışıyor / şu yüzden çalışmıyor" ve gönderi başına gerçek maliyet yazılı.
- **Kim yapar:** orta düzey model yeter; karar gerektirmez, dikkat gerektirir.

### Aşama 1 — Yetenek katmanı ve kapı *(orta iş)*
- Yetenek sözleşmesini ve kaydını (`registry`) yaz; yukarıdaki kümeyi mevcut koddan sararak doldur.
- **Kapı:** maliyet tahmini, oturum ve gün tavanı, onay bekleme, her çağrının deftere yazılması.
- Her yetenek komut satırından tek başına çağrılabilsin (`kule calistir x.say '{"ifadeler":["…"]}'`).
- Nabız ve Pusula'nın harcama defterlerini tek deftere indir.
- **Bitti sayılır:** her yeteneğin testi var; tavanı aşan çağrı kodda duruyor; demo dünyasında bütün küme
  parasız çalışıyor.
- **Kim yapar:** sözleşme ve kapı tasarımını güçlü model; sarmalama işini orta model (yetenek başına ayrı,
  paralel verilebilir).

### Aşama 2 — Ajan çekirdeği *(büyük iş; aracın kalbi)*
- Konuşma döngüsü: kullanıcı mesajı → model → yetenek çağrıları → kapı → sonuç → model → yanıt. Akışlı.
- Sistem yönergesi: kullanıcı kim, dürüstlük kuralları, "önce ucuz olan", onay dili, Türkçe ve sade anlatım.
  Kökteki `CLAUDE.md` ve `pusula/DEVIR.md` bölüm 4 bunun ham maddesidir.
- Bağlam yönetimi: ajan ham gönderi yığınını görmez; yetenekler özet ve en çok etkileşim alan örnekleri
  döndürür, ayrıntı istendiğinde `depo.sorgula` ile alınır. (Maliyetin ana belirleyicisi budur.)
- Onay akışı: kapı "onay gerekli" dediğinde ajan tutarı ve gerekçeyi sorar, yanıtı bekler.
- Konuşma geçmişi ve danışan dosyası her oturumda yüklenir.
- **Değerlendirme takımı:** 30–40 örnek istek ve beklenen davranış ("şu soruda gönderi çekmeden yanıtlamalı",
  "şu istekte onay sormalı", "neden-sonuç kurmamalı"). Demo dünyasında koşar. Her yönerge değişikliğinde
  yeniden çalıştırılır. Bu olmadan ajan iyileştirilemez, yalnızca değiştirilir.
- **Bitti sayılır:** komut satırında konuşarak 4. bölümdeki beş örnek konuşma demo veride yürüyor;
  değerlendirme takımı ölçülüyor.
- **Kim yapar:** yönerge ve değerlendirme takımını güçlü model; döngü kodunu orta model.

### Aşama 3 — Konuşma ve tuval arayüzü *(büyük iş)*
- Üç bölgeli ekran; konuşma akışlı gelir.
- Kart türleri: sayı, çizgi/alan grafiği, sıralı liste, zaman çizelgesi, tablo, düzyazı not, taslak metin.
  Ajan `kart.olustur` ile yalnızca **veri ve tür** verir; çizimi arayüz yapar (ajan HTML üretmez).
- Sabitleme, yenileme sıklığı, kaldırma; kartın altında dayanak satırı.
- "Varsayılan pano": bir danışan eklendiğinde Pusula odasındaki bölümler hazır kart olarak gelir.
- Onay kutusu: tutar, ne yapılacağı, "bu oturumda şu tutara kadar sorma" seçeneği.
- **Bitti sayılır:** kullanıcı tarayıcıda konuşarak 4. bölümdeki örnekleri yürütebiliyor; telefonda kullanılır.
- **Kim yapar:** orta model; ekran görüntüsüyle kendi kendini denetleyerek.

### Aşama 4 — Nöbetler ve bildirim *(orta iş)*
- Yazılı talimat → yapılandırılmış nöbet (koşul, sıklık, günlük tavan, bildirim kanalı). Çeviriyi ajan yapar,
  kullanıcı onaylar; nöbet sonra **yapay zekâsız** çalışır (ucuz ve öngörülebilir). Yalnızca koşul
  tetiklendiğinde ajan devreye girip not yazar.
- Bildirim: önce tarayıcı, sonra e-posta ya da telefon (kullanıcı kararı).
- Sabah özeti hazır bir nöbet olarak gelir.
- **Bitti sayılır:** demo dünyasında kriz başlamadan kurulan nöbet, kriz sırasında bildirim üretiyor;
  nöbetin günlük harcaması tavanı aşmıyor.
- **Kim yapar:** orta model.

### Aşama 5 — Öğrenme ve arşiv *(orta iş)*
- Kullanıcı düzeltmeleri danışan dosyasına işlenir ve sonraki anlamlandırmada kullanılır.
- Kapanan olaylar arşive alınır; `olay.karsilastir` bunları kullanır.
- Danışan başına eşik ayarı: "bu danışan için olağan" zamanla gerçek veriden öğrenilir.
- Rakip izleme (`rivals` alanı şu an kullanılmıyor).
- **Bitti sayılır:** aynı gönderi düzeltmeden sonra doğru okunuyor; iki eski olay yan yana karşılaştırılabiliyor.

### Aşama 6 — Genişleme *(isteğe bağlı, sırasız)*
Yeni kaynaklar (her biri yalnızca yeni bir yetenek demektir), belge dışa aktarma, çok kullanıcılı kullanım,
internette barındırma ve parola koruması.

## 7. Riskler ve nasıl karşılanacağı

| Risk | Karşılığı |
|---|---|
| Ajan pahalı çalışır (her soru bir model çağrısı, bağlam büyür) | Ajan ham veri görmez; nöbetler yapay zekâsız çalışır; konuşma maliyeti de defterde görünür ve tavanı vardır |
| Ajan emin konuşup yanılır | Dayanak satırı zorunlu; sayılar yalnızca yetenek çıktısından gelir, modelin kendi hesabından değil; değerlendirme takımı |
| Ajan onaysız para harcar | Kapı koddadır; yönergeye güvenilmez |
| Esneklik dağınıklığa dönüşür (her gün başka ekran) | Varsayılan pano; sabitlenmeyen kart kaybolur |
| Gerçek veri simülasyona benzemez | Aşama 0 bu yüzden en başta; eşikler Aşama 5'te danışana göre ayarlanır |
| Üç araç birden yaşar, hangisi geçerli belirsizleşir | Kule çalışır hâle gelince Nabız ve Pusula arşive alınır (kullanıcı kararı) |

## 8. Başlamadan önce sizden gereken kararlar

1. **Bütçe:** gerçek veriyle ilk deneme için ne kadar harcanabilir? Günlük olağan tavan ne olsun?
2. **İlk gerçek danışan:** Aşama 0 hangi adla ve hangi ifadelerle yapılacak?
3. **Yapay zekâ maliyeti:** konuşma ve yorum için aylık kabul edilebilir tutar? (Model seçimi buna göre yapılır.)
4. **Bildirim kanalı:** tarayıcı yeter mi, e-posta ya da telefon şart mı?
5. **Nerede çalışacak:** yalnızca kendi bilgisayarınızda mı, internette mi?
6. **Nabız ve Pusula:** Kule hazır olunca kaldırılsın mı, dursun mu?

## 9. Devralan ekibe not

- Sırayı bozmayın: 0 → 1 → 2. Arayüz (Aşama 3) cazip görünür ama ajan çekirdeği ve değerlendirme takımı
  olmadan yapılırsa Pusula'nın sabit panosu yeniden yazılmış olur.
- Aşama 1'deki yetenek sarmalama ve Aşama 3'teki kart türleri birbirinden bağımsız, paralel verilebilir işlerdir.
  Aşama 2'nin yönergesi ve değerlendirme takımı tek elden çıkmalıdır.
- Yeni kod için önerilen yer: `kule/` (kendi `package.json`'ı ile). Nabız ve Pusula kodunu taşımayın, içe aktarın;
  ikisi de çalışır kalsın.
- Kullanıcı teknik değildir: onunla Türkçe ve sade konuşun, para harcayan her adımda tutarı söyleyip onay alın,
  X'i tarayıcıyla kazımayın, demo verisini her seferinde "uydurma" diye belirtin.
