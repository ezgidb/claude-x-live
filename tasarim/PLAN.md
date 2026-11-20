# Rasat — ölçülmüş doğrulukla gündem ve itibar gözlemevi

**Tasarım ve uygulama planı.** Yazan: lider. **Sürüm 3** — üç araştırma (A, B, C) ve bağımsız denetimin (D, 39 bulgu)
işlendiği sürüm. Denetim bulgularının her birinin nasıl karşılandığı bölüm 14'te.

"Rasat" çalışma adıdır (gözlemevinde yapılan sistemli gözlem).

| Belge (`tasarim/`) | Ne verir |
|---|---|
| `00-BRIEF.md` | Kullanıcı ve talep |
| `01-GEREKSINIM-MEVCUT.md` | Kullanıcının kararları, gereksinimler, doğruluğun altı boyutu, zayıflıkların 11 kök nedeni |
| `A-PAZAR.md` | Piyasa: kim ne yapıyor, nerede yetersiz |
| `B-VERI-HUKUK.md` | Veri erişimi, sözleşme ve hukuk, fizibilite; avukata sorulacak 15 soru |
| `C-YONTEM.md` | Doğruluk yöntemleri ve ölçüm çerçevesi |
| `D-DENETIM.md` | Sürüm 2'nin bağımsız denetimi |
| `ZAYIFLIKLAR.md` (depo kökü) | Nabız, Pusula ve Kule'nin 31 zayıflığı |

**Bu belgedeki dış bilgilerin dayanağı:** araştırmalar dış sitelerin tam metnini okuyamadı; bulgular arama
sonuçlarındaki alıntılara dayanıyor ve arama kotası araştırma sırasında doldu. Bu yüzden plandaki her dış olgu, A0
aşamasında birincil kaynaktan yeniden doğrulanacak **varsayım** olarak ele alınır (bölüm 11). Piyasa hakkındaki
cümleler "araştırmada bulunamadı" düzeyindedir, "yoktur" değil.

Terimlerin sade açıklaması: bölüm 12 (sözlük).

---

## 0. Karar özeti (tek sayfa)

**Ne:** Danışmana "danışanım hakkında ne oluyor" sorusunun yanıtını, **o yanıtın ne kadar eksiksiz ve ne kadar
doğru olduğunun ölçülmüş değeriyle birlikte** veren bir sistem: yazılım + insan analist + süreç.

**Neden farklı:** Piyasa araştırmasında, kendi kapsamını ve Türkçe okuma isabetini müşterinin verisinde ölçüp gösteren
bir satıcı bulunamadı. Rasat'ın asıl yatırımı bu ölçüm düzeneğidir.

**Önerilen yol: karma (bölüm 6).** Veri satın alınır (X kurumsal erişim, bir dinleme platformu, Türk medya takip
firması, ajans aboneliği); ölçüm, Türkçe okuma, olgu hesapları, yorum katmanı ve insan iş akışı kurulur.

**Süre:** canlıya kadar kabaca **12–18 ay** (sözleşme ve satış süreçlerine bağlı). Bu sürede **köprü çözüm**: bir
dinleme platformu lisansı + Türk medya takip hizmeti + Nabız; köprü platformu aynı zamanda veri yarışmasının adayıdır.

**Maliyet büyüklüğü (bölüm 7.3):** en büyük kalemler X kurumsal erişimi (ikincil kaynaklara göre ayda 42–50 bin $'dan
başlıyor; doğrulanmadı) ve insanlardır (7/24 nöbet tek koltuk için 5–6 analist, etiketçiler, mühendislik lideri,
proje yöneticisi, değerlendirme lideri).

**İlk adım para harcamaz:** hukuki görüş (KVKK, X'in kuralları) ve X'ten yazılı teyit. **Hukuki görüş gelmeden gerçek
kişisel veri işlenmez.**

**Sizin vermeniz gereken kararlar** (ayrıntı bölüm 13): (1) karma yolu ve köprü çözümü onaylıyor musunuz; (2) süre ve
bütçe büyüklüğü kabul mü; (3) doğruluk hedefleri (günlük dille, bölüm 2.1) uygun mu; (4) siyasi danışanınız olacak mı;
(5) nöbetçi analistler kimden; (6) ölçü aleti için hatırladığınız 10 büyük geçmiş olay; (7) size bağımsız bir teknik
danışman atanmasını istiyor musunuz.

---

## 1. Vizyon

### 1.1 Tek cümle
**Rasat, danışmana "ne oluyor" sorusunun yanıtını, o yanıtın ne kadar eksiksiz ve ne kadar doğru olduğunun ölçülmüş
değeriyle birlikte verir.**

### 1.2 Neden bu
Araştırma A: incelenen satıcıların hiçbirinde müşterinin kendi verisinde, dil ve sınıf bazında ölçülmüş başarı
raporu bulunamadı. Duygu analizinin bağımsız bir karşılaştırması da bulunamadı. Risk ve koordinasyon puanlarının
yöntemi kapalı. Uyarıların geçmiş olaylarda sınandığına rastlanmadı. Türkçe ve alay için ürün düzeyinde yayımlanmış
ölçüm bulunamadı. (Arama kotası dolduğu için küresel araçların Türkçe desteği tam araştırılamadı.)

Araştırma C: bunların hepsi ölçülebilir, kapsam bile. Rastgele örnekle "dışarıda kalanlar" denetimi, birden çok
bağımsız toplama yolunun örtüşmesinden toplam tahmini, altın standart veri ve geçmiş olaylarla geriye dönük sınama
olgun yöntemlerdir.

Rasat'ın farkı daha çok veri ya da daha parlak yapay zekâ değil, **ölçülmüş doğruluktur.**

### 1.3 Rasat ne değildir
- Kamuoyu araştırması değildir: "görebildiğimiz kanallarda yazanlar ne yazıyor"u, görmediklerini de söyleyerek gösterir.
- Teyit kuruluşu değildir: bir iddianın yayılımını gösterir, doğruluğunu ancak bağımsız teyit kaynağına bağlayarak söyler.
- Kişi izleme aracı değildir: **konu odaklıdır**; bireyler hakkında dosya tutmaz (bölüm 4.3).
- Yalnız yazılım değildir: kritik çıkarımlarda son söz ölçülmüş güvende ya da insan onayındadır.

### 1.4 Yedi ürün ilkesi
1. **Ölçülmüş doğruluk her ekranda.** Her sayı ve yorumun yanında dayanak satırı: sayım (kesin) / örneklem (n, güven
   aralığı) / model yorumu (son ölçülen isabet ve tarihi) / kapsam tahmini.
2. **Kör nokta haritası.** Görülemeyen kanal ve içerik türleri listelenir; "bulunamadı" her zaman "nerede arandı"yı söyler.
3. **Geniş ağ, dar süzgeç.** Toplama bilerek geniştir; ilgililik ayrı ve ölçülen bir adımdır. Hiçbir sayı "konunun
   sayısı" diye sunulmaz.
4. **Olgular hesaptan, yorum kanıttan.** Yapay zekâ sayı üretmez. Her olgusal cümle bir kayda bağlanır ve denetlenir.
5. **Yabancı metin veridir, talimat değildir.** Araç kullanan model gönderi metnini, alıntıları ve görünen adları
   **hiç** görmez; bunlara yalnız kimlikle başvurur.
6. **Suçlayıcı okunabilecek bulgu insan onayından geçer ve hiçbir koşulda kamuya gitmez** (isimli koordinasyon bulgusu).
7. **İzleyeni izleyen.** Veri akışı, kapsam, kalite, bildirim teslimi ve harcama sürekli denetlenir; sessiz arıza
   kendisi bir alarmdır.

---

## 2. Doğruluk sözleşmesi

### 2.1 Hedefler

Her metrik iki sayı taşır:
- **Hedef:** ölçülen değerin (nokta tahmini) ulaşması gereken düzey.
- **Taban:** güven aralığının alt sınırının (%95) inmemesi gereken düzey. Sistem "hedefte görünüyor ama ölçüm
  yetersiz" ile "gerçekten hedefte" arasını bu ikinci sayıyla ayırır.

Ölçüm birimi danışan başına haftalık değil, **bütün danışanlar üzerinde 4 haftalık birikimli penceredir**; danışan
bazında değerler bilgi amaçlı gösterilir. Gerekli örnek sayıları bölüm 2.3'tedir.

| Boyut | Metrik | Hedef | Taban | Günlük dille |
|---|---|---|---|---|
| **Kapsam** | İlgili metin içeriğin yakalanan payı (tanım: 2.2) | ≥ %90 | ≥ %85 | "Danışanla ilgili 100 yazılı gönderiden en az 85–90'ını görüyoruz" |
| **İlgililik** | Sisteme girenin ilgili payı | ≥ %90 | ≥ %85 | "Ekranda gördüğünüz 100 gönderiden en çok 10'u alakasız" |
| **Anlama** | Duruş makro-F1 | ≥ 0,75 | ≥ 0,70 | Dört duruş türünün ortalama isabeti |
| | Olumsuz sınıf duyarlılığı | ≥ %90 | ≥ %85 | "100 olumsuz gönderiden en az 85'ini olumsuz diye okuyoruz" |
| | Olumsuz pay hatası | ≤ 5 puan | aralık gerçek değeri %95 kapsıyor | "Eleştiri payı %30 dediğimizde gerçek değer %25–35 arasında" |
| | Kalibrasyon hatası | ≤ 0,05 | — | "%80 eminim dediğimiz okumaların yaklaşık 80'i doğru" |
| | Alay alt kümesi | ölçülür ve gösterilir | — | Kalıcı zorluk; hedef konmaz, isabeti her zaman görünür |
| | Anlatı saflığı / ana anlatının bölünmesi / ad uygunluğu | ≥ %80 / ≤ %10 / ≥ %80 | — | "Bir başlık altındaki gönderilerin en az 80'i gerçekten o konu" |
| **Çıkarım** | Olay yakalama | ≥ %92,5 | ≥ %80 | 40 geçmiş olayın en az 37'si |
| | Başlangıç doğru pencerede (değilse "daha önce başlamış olabilir" uyarısı %100) | ≥ %92,5 | ≥ %80 | |
| | "Kesin" etiketli yayılım bağlarının doğruluğu | ≥ %99 | ≥ %98 | Yalnız gözlenen bağlar "kesin" |
| | Sunulan koordinasyon işaretlerinin kesinliği | ≥ %95 | ≥ %85 | İlk 45 işarete kadar "deneme" etiketiyle |
| | Tahmin kalibrasyonu | ±10 puan | — | Ölçülmemişse tahmin gösterilmez |
| **Zamanlılık** | Belirginleşme → sistem uyarısı (medyan) | ≤ 30 dk | — | Geri-testte 40 olay üzerinde |
| | Kırmızı uyarı → danışmanın okuması (p95) | ≤ 15 dk | — | Okunmazsa 10 dk içinde telefonla eskalasyon |
| | Kırmızı yanlış alarm | ≤ 0,5 / danışan-hafta | üst sınır ≤ 1 | En az 100 danışan-haftalık olaysız dönemde |
| **Sunum** | Olgusal cümlede atıf; sayı eşleşmesi | %100; %100 | otomatik engel | Denetçiden geçmeyen cümle yayımlanmaz |
| | Atıf doğruluğu (insan denetimi) | ≥ %98 | ≥ %95 | |
| | Aynı soru + aynı anlık görüntüde aynı sayı | %100 | — | Silme yükümlülüğünden kaynaklanan değişiklik hariç (bölüm 4.3c) |
| | Yorum tutarlılığı (5 tekrar) | ≥ 0,9 | — | |
| **Güvenlik** | Gönderi içi talimatla araç/kural/harcama değişikliği | 0 | — | ≥ 500 saldırı örneği |
| | Metin sapması | ≤ %1 | üst sınır ≤ %2 | |
| **Çoklu ortam** | Ses dökümü kelime hata oranı | ≤ %15 | — | Aşılırsa döküm alıntı kaynağı olamaz |

### 2.2 Kapsam metriğinin tanımı (payda)

"Tüm ilgili içerik" belirsiz kalırsa kapsam rakamı anlamsızdır. Tanım **kanal × içerik türü** düzeyindedir:

| Kanal | Kapsam ölçülür mü | Payda |
|---|---|---|
| X | Evet (birincil) | Herkese açık, metin içeren, danışanla ilgili gönderiler (Türkçe + danışanı anan diğer diller) |
| Haber (web, ajans) | Evet (göreli) | Birden çok bağımsız haber toplayıcısının birleşimi; evren bilinmediği için "göreli kapsam" diye etiketlenir |
| YouTube, Bluesky, Threads | Bilinen-öğe testleriyle | Analistin başka yoldan bulduğu içerik |
| Instagram, TikTok, Facebook | Hayır | Kör nokta haritasında "kısmi, ölçülemiyor" |
| Metinsiz görsel ve video (her kanalda) | A10'a kadar hayır | Kör nokta haritasında "görülmüyor"; A10'dan sonra bilinen-öğe testiyle |
| Telegram, Ekşi Sözlük, kapalı gruplar | Hayır | Kademe 3 ya da kalıcı kör nokta |

**Ölçüm yöntemi (X için):**
1. **Birincil — bağımsız örneklem:** X'in %10 rastgele örneklem akışından **tabakalı** örnek alınır: sistemin
   ilgisiz saydığı ama zayıf bir işaret taşıyan gönderiler (geniş terim, anlamsal benzerlik, danışanla ilgili
   hesaplara yanıt) fazla örneklenir; geri kalan akıştan küçük rastgele örnek, "hiç işaret taşımayan ilgili
   içerik" oranını sınırlar. İnsan etiketler; kapsam = sistemin yakaladığı / örneklemdeki bütün ilgililer.
2. **İkincil — çoklu yakalama:** en az **üç bağımsız toplama yolu** (anahtar sözcük sorgusu / hesap-ağ temelli
   toplama / anlamsal eşleşme) üzerinden, yollar arası bağımlılığı hesaba katan bir tahminci (Chao türü). **İki
   satıcı iki bağımsız yol sayılmaz:** aynı X akışından beslenen iki satıcı aynı gönderileri yakalar ve kapsamı
   yapay olarak %100'e yakın gösterir. İkinci satıcı yalnız yedektir.
3. **Üçüncül — bilinen-öğe listeleri:** analistin başka yollarla bulduğu gönderiler.
4. Yöntemler çelişirse **düşük olan** esas alınır; kalite ekranında hangi yöntemin kullanıldığı görünür.

Geçmiş olaylarda %10 akış ve anlamsal işleç kullanılamayabilir (ürünler akış tabanlı; A2'de doğrulanacak). Bu
durumda geri-testte kapsam bilinen-öğe listeleri ve tam arşiv aramasıyla ölçülür ve "geri-test kapsamı" diye ayrı
gösterilir; birincil yöntem canlı ve gölge işletimde uygulanır.

X kurumsal erişimi alınamazsa (risk R4) kapsam yalnız dolaylı ölçülür ve ekranda **"dolaylı tahmin"** diye
etiketlenir; bu durumda kapsam hedefi karşılanmış sayılmaz ve kullanıcıya yazılı bildirilir.

### 2.3 Gerekli örnek sayıları

Hesap: Wilson aralığı (%95); hatasız durumda Clopper–Pearson. Etiketleri **yalnız insanlar** verir (en az iki
bağımsız etiketçi + uzlaştırıcı); sistemin içindeki model ailesi ölçüme katkı vermez.

| Metrik | Gerekli örnek (4 haftalık pencere, bütün danışanlar) | Neden |
|---|---|---|
| İlgililik | ≥ 200 rastgele gönderi | Gözlenen %90'da alt sınır ≈ %85 |
| Kapsam | Örneklemde ≥ 200 ilgili gönderi → tabakalamaya göre **1.000–4.000 etiket** | Gözlenen %90'da alt sınır ≈ %85 |
| Olumsuz sınıf duyarlılığı | Altın sette ≥ 200 olumsuz örnek (sınama bölümü) | Gözlenen %90'da alt sınır ≈ %85 |
| Alay | Altın sette ≥ 300 alaylı örnek | Yalnız ölçüm; hedef yok |
| Kalibrasyon | ≥ 1.000 altın set öğesi | |
| Olay yakalama, başlangıç penceresi | **≥ 40 geçmiş olay**: 10 büyük kriz (tam kronoloji) + ≥ 30 küçük dalga (hafif kronoloji); birden çok danışan ve sektör | 10 olayla hatasız sonuç bile alt sınırı 0,69'da bırakır; 40 olayda 37 doğru → ≈ 0,80 |
| Yanlış alarm | ≥ 100 danışan-hafta olaysız dönem | Sayım verisiyle geçmişe dönük ucuz ölçülür |
| Atıf doğruluğu | ≥ 200 cümle / 4 hafta | Gözlenen %98'de alt sınır ≈ %95 |
| Koordinasyon kesinliği | Birikimli ≥ 45 sunulan işaret | O sayıya kadar "deneme" etiketi |
| Güvenlik | ≥ 500 saldırı örneği / sürüm | |

### 2.4 Kapılar nasıl geçilir, düşüşte ne olur

- **Ön kabul:** mevcut veride hedef (nokta tahmini) karşılanıyor → sonraki aşamaya geçilebilir.
- **Kesin kabul:** biriken veride taban karşılanıyor → **canlıya almanın (A9) ön koşulu.** Bütün metrikler için.
- **İzleme:** haftalık değerler kalite ekranında görünür; tek haftalık düşüş yalnız inceleme başlatır.
  **Geri dönüş** kararı 4 haftalık birikimli taban altına inildiğinde ya da ardışık izleme (CUSUM türü) alarm
  verdiğinde alınır. Çok sayıda metrik aynı anda izlendiği için yanlış "düşüş" alarmı çoklu karşılaştırma
  düzeltmesiyle sınırlanır.
- **Hedef değişikliği** yalnız kullanıcının yazılı kararıyla olur ve kalite ekranında görünür; hiçbir ekip hedefi
  kendisi gevşetemez.
- **Etiketçi uyumu (Krippendorff α):** ≥ 0,80 → görev tam kullanılır; 0,67–0,80 → görev kullanılır, sonuçları
  "temkinli" etiketi taşır, kod kitabı en çok iki tur düzeltilir; < 0,67 → görev yeniden tanımlanır, isabet iddiası
  yapılmaz. Bir görevin zorluğu (ör. alay) projeyi durdurmaz.

---

## 3. Mimari

### 3.1 Genel görünüm

```
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │  ARAYÜZ  Sabit pano · Konuşma+kartlar · Bildirim (eskalasyonlu) · Rapor ·    │
 │          Kalite ekranı · Kör nokta haritası · Harcama ekranı                 │
 └───────────────▲─────────────────────────────────────────────▲────────────────┘
 ┌───────────────┴──────────────┐              ┌───────────────┴────────────────┐
 │ YORUM DÜZLEMİ                │              │ İNSAN DÜZLEMİ                  │
 │ Planlayıcı: araç kullanır;   │◄────────────►│ Nöbetçi analist kuyruğu        │
 │  yalnız olgu kayıtlarını ve  │   onay /     │ Onay kapıları                  │
 │  kimlikleri görür            │   düzeltme   │ Düzeltme kütüphanesi (sürümlü) │
 │ Karantina okuyucular: metni  │              │ Etiketleme (yalnız insan)      │
 │  okur, araç kullanamaz       │              │ Kriz modu (kapasite planı)     │
 │ Yazıcı → Denetçi (kod) →     │              └───────────────▲────────────────┘
 │  Yerleştirici (alıntıyı en   │                              │
 │  son kod koyar)              │                              │
 └───────────────▲──────────────┘                              │
 ┌───────────────┴───────────────────────────────────────────────┴──────────────┐
 │ OLGU DÜZLEMİ (deterministik, sürümlü anlık görüntü, kanıt deposu)            │
 │ Sayım · Mevsimsel taban · İki alarm serisi (hacim, olumsuz ağırlıklı) ·      │
 │ Etkileşim yeniden ölçümü · Yayılım (kesin/olası) · Anlatı kimliği ·          │
 │ Koordinasyon (sıfır modeli) · Otomatik içerik payı · Tahmin · Risk           │
 └───────────────▲──────────────────────────────────────────────────────────────┘
 ┌───────────────┴──────────────────────────────────────────────────────────────┐
 │ ANLAMA DÜZLEMİ  İlgililik + varlık bağlama · Türkçe katmanlı okuma ·         │
 │ Oran düzeltme · Kalibrasyon · Çoklu ortam (A10)                              │
 └───────────────▲──────────────────────────────────────────────────────────────┘
 ┌───────────────┴──────────────────────────────────────────────────────────────┐
 │ VERİ DÜZLEMİ  Varlık dosyası · Üç toplama yolu · Lisanslı kaynaklar          │
 │ (birincil + yedek) · Kapsam ölçümü · Kör nokta haritası · Kanarya            │
 └──────────────────────────────────────────────────────────────────────────────┘
  GÖZETİM: kaynak kalp atışı · kanarya · gecikme · kapsam · kalite · bildirim
           teslimi · harcama · sürüm
  UYUM:    barındırma (TR) · aktarım envanteri · veri ikametgâhı yönlendirmesi ·
           kullanım politikası motoru · silme yayılımı · görüntüleme/paylaşım
           politikası · danışan bazında veri ayrımı · olay müdahale planı
```

### 3.2 Veri düzlemi

**Danışan varlık dosyası.** Adın bütün biçimleri (Türkçe karakterli/karaktersiz, ekli biçimler), lakaplar, ürünler,
yöneticiler ve sözcüler, kampanyalar, etiketler, sahip olunan hesaplar, rakipler, hassas konular, **eşsesli
dışlamalar**. Sürümlüdür; her değişiklik geçmiş olaylarda kapsam etkisi ölçülerek etkinleşir. X aramasının Türkçe
ekli biçimleri nasıl eşleştirdiği A0'da sınanır (bölüm 11).

**Üç toplama yolu** (aynı zamanda kapsam ölçümünün üç bağımsız yakalama yolu):
1. *Sorgu tabanlı:* bilerek geniş sorgular. Yapay zekâ sorgu önerebilir; sorgu her zaman okunur biçimde görünür ve
   analist onaylar.
2. *Hesap-ağ tabanlı:* ilgili bulunan gönderilere gelen yanıt, alıntı, yeniden paylaşım ve aynı bağlantıyı
   paylaşanlar (ağ genişletme); ayrıca, **yalnız X'in yazılı teyidinden sonra ve teyidin izin verdiği ölçüde**, kurum
   ve yayın organı hesapları. Teyit gelene kadar hesap listesi tabanlı toplama **kapalıdır**; özel kişiler hiçbir
   durumda listeye alınmaz (bölüm 4.3b).
3. *Anlamsal:* X kurumsal erişimindeki anlamsal eşleşme işleci ya da kendi gömme modelimizle aday havuzundan seçim.

**Lisanslı kaynaklar:** birincil ve yedek (bölüm 4.1). Yedek kaynak satıcı arızası içindir, kapsam ölçümü için değil.

**Kapsam ölçümü:** bölüm 2.2. Kapsamdaki düşüş **olası nedenleriyle** gösterilir: yeni lakap/etiket, kaynak kesintisi,
erişim kısıtlaması, sorgu değişikliği. Gözetim düzlemi kaynak sağlığını ayrıca bildiği için nedenler ayırt edilir;
genişletme önerisi analist kuyruğuna düşer.

**Kanarya.** Danışanın kendi hesaplarının ve sahip olunan kanallarının paylaşımları bilinen zamanda yayımlanır; her biri
beklenen süre içinde sisteme düşmezse "kaynak ya da sorgu arızası" alarmı verir. Test ortamında ayrıca yapay arıza
enjeksiyonu yapılır. "Sessiz arıza 0" hedefi bu ikisiyle ölçülür.

**Kör nokta haritası.** Kanal × içerik türü × tamlık × gecikme; görülmeyenler açıkça; Türkiye'de erişime kapatılmış
içerik ayrıca işaretli (gösterimi hukuki görüşe bağlı, bölüm 4.3).

### 3.3 Anlama düzlemi

**İlgililik ve varlık bağlama.** Ayrı sınıflandırıcı; eşsesli ayrımı varlık dosyasıyla. Danışanın sahip olduğu hesaplar
"sahip olunan kanal" rolündedir; yükseltici listesine girmez (P11).

**Katmanlı Türkçe okuma:**
1. *İnce ayarlı Türkçe kodlayıcı* (BERTurk / TurkishBERTweet türü). İlk yayımlanmış ölçümler Türkçe sınıflamada bu
   modellerin sıfır örnekli büyük dil modellerinden iyi olduğunu gösteriyor, ama kanıtların çoğu kısmi ve en yeni büyük
   dil modelleri Türkçe duruşta ölçülmemiş. **Hangisinin daha iyi olduğu A4'te kendi altın setimizde sınanır.** Kendi
   altyapımızda çalışır. Hangi veriyle eğitilebileceği bölüm 4.3b'deki kurala bağlıdır.
2. *Büyük dil modeli (karantinada):* belirsiz, alaylı, kritik ya da yüksek erişimli içeriği ikinci kez okur.
3. *İnsan:* ayrışma, yüksek alay olasılığı, olayın gidişini belirleyen içerik.

Okunan sınıflar: ilgililik, duruş (danışana karşı), duygu, alay, iddia, çağrı (boykot, şikâyet, paylaş), hedef, dil,
**olası otomatik/koordineli içerik**. Her etikette kalibre edilmiş güven.

**Özel nitelikli veri çıkarımı sınırı.** Sistem bireylerin siyasi görüşünü, dinini, sağlığını **kişi düzeyinde**
çıkarmaz ve saklamaz; duruş okuması yalnız "danışana karşı tutum" ve yalnız toplu düzeyde raporlanır. Siyasi
danışanlarda bu kural hukuki görüşe göre sıkılaştırılır (bölüm 4.3).

**Oran düzeltme.** "Olumsuz pay" ham model sayımı değildir; insan örneğiyle düzeltilmiş tahmin ve aralık (DSL/PPI).

**Çoklu ortam (A10).** Ses → metin, görsel üzerindeki yazı, logo, yakın-kopya. Her biri kendi Türkçe örneklerimizde
ölçülmeden açılmaz.

### 3.4 Olgu düzlemi

Bütün hesaplar deterministiktir ve sürümlü anlık görüntüler olarak saklanır.

| Olgu | Yöntem | Dürüstlük kuralı |
|---|---|---|
| Hacim ve hız | Tam akış ve sayım; yeniden paylaşımlar sayımdan | "İlgili bulunan" + kapsam tahmini; "sayılan" ile "okunabilen" ayrı (fark: silinmiş/erişilemeyen) |
| Otomatik içerik payı | Otomatik/koordineli olası içerik ayrı sütunda | Hacim ve alarm bu payla ve onsuz gösterilir |
| Olağan düzey | ≥ 4 haftalık geçmiş; günün saati ve haftanın günü etkisi ayrılır; sağlam istatistik | İlk 4 hafta "ısınma" etiketi; bu dönemin yanlış/kaçan alarmı ayrıca ölçülür |
| Alarm | **İki seri:** hacim ve olumsuz ağırlıklı hacim. Kırmızı yalnız olumsuz ağırlıklı seri ya da çağrı/iddia işaretleriyle; övgü dalgası "viral an" diye ayrı bildirilir. Gözetim tipi yöntemler (CUSUM, EARS); eşik geri-testle | Her kuralın geri-test sonucu görünür; uyarılar danışan bazında birleştirilir ve önceliklendirilir; portföy düzeyinde yanlış alarm da izlenir |
| Etkileşim | 1 sa, 6 sa, 24 sa yeniden ölçüm; yaşa göre normalize sıralama | "En çok etkileşim alan" ölçüm saatiyle |
| Yayılım | Gözlenen bağlar **kesin**; çıkarılan bağlar **olası** | "İlk kaynak" = "topladığımız veride gözlenen en erken"; arşivde geriye genişletme otomatik; "sıçrattı" denmez, katkı tahmini yapılırsa hesap adıyla birlikte neden-sonuç cümlesi kurulmaz |
| Anlatı | Gömme kümeleme + kalıcı kimlik + üst anlatı; ad önerisi model, onay analist | Saflık, bölünme, ad uygunluğu ölçülür; "anlatı evrildi" notu |
| Koordinasyon | ≥ 3 bağımsız sinyal; aynı konuyu konuşan doğal kullanıcılardan **sıfır modeli**; anlamlılık p < 0,01; **alternatif açıklamalar listesi** (meşru kampanya, ortak haber kaynağı, fan topluluğu…) | Güven basamaklı; tarif edici dil; kanıt kimliksiz istatistikle saklanır; isimli bulgu yalnız iç kullanım, **hiçbir koşulda kamuya ya da danışanın kamusal metnine girmez** |
| Tahmin | Olasılıklı, aralıklı; eğilim ve tahmin aynı modelden | Kalibrasyonu ölçülmemişse gösterilmez |
| Risk | Açıklanabilir sürücüler; erişim bilgisi bilinmeyen kanalda "bilinmiyor" sürücüsü, sıfır değil | Puan değil, sürücüler ön planda |

**Kanıt deposu.** Her olgu: kimlik, hesap sürümü, girdi kapsamı, sonuç, güven, **silme kuralı**. Yorum düzlemi yalnız
bu kayıtlara atıf yapabilir.

### 3.5 Yorum düzlemi (konuşan katman)

- **Planlayıcı:** kullanıcıyla konuşur, yetenek seçer. **Gördükleri:** olgu kayıtları, etiketler, sayılar, **opak
  kimlikler** (gönderi, hesap, alıntı). **Görmedikleri:** gönderi metni, alıntı metni, görünen ad, profil açıklaması,
  model önerisi anlatı adı (onaylanmamışsa). Kullanıcının sohbete yapıştırdığı ya da ilettiği içerik (WhatsApp, ekran
  görüntüsü) de önce karantina okuyucudan geçer.
- **Karantina okuyucular:** metni okur, şemaya bağlı yapılandırılmış çıktı verir; araç çağıramaz, kural kuramaz,
  harcama yapamaz; her gönderi ayrı okunur.
- **Yazıcı:** not, yanıt planı, rapor; sayıları ve alıntıları **yer tutucuyla** yazar (`{sayi:hacim_24s}`,
  `{alinti:G123}`).
- **Denetçi (kod):** her cümlede atıf, her yer tutucunun kanıt deposunda karşılığı, dayanak türü etiketi. **Sözle
  yazılmış nicelik yasaktır** ("iki katına çıktı", "yarısı", "üç hesap") — bunlar da yer tutucuyla yazılır; denetçi
  sözle nicelik kalıplarını tanır ve reddeder. Olgusal cümle tanımı yazıcının etiketine bırakılmaz: haftalık insan
  örneğiyle (≥ 200 cümle) atıf doğruluğu ve kaçan olgusal cümle ölçülür.
- **Yerleştirici (kod):** denetimden geçen metne alıntıları ve sayıları en son koyar. Böylece yabancı metin hiçbir
  model adımına talimat olarak girmez.
- **"Ne yaptım" satırı:** çalışan sorgular ve yetenekler, bakılan kapsam, "bulunamadı" ise nerede arandığı. Yanlış
  sorgu/araç seçimi (K3) bir değerlendirme setiyle ölçülür (A6).
- **Sabit pano + konuşma:** sabit sayımlar her gün aynı panoda; açık uçlu sorular konuşmada; kart panoya sabitlenebilir.
- **Kalıcı izleme talimatı:** yazıyla verilir → kurala çevrilir → kullanıcıya geri okunur → kurulmadan önce geçmiş
  olaylarda denenir → kurulduktan sonra periyodik olarak yeniden sınanır. Kullanım politikası motoru hassas olay ve
  kişi izleme kurallarını reddeder.
- **Bozulmuş mod:** yapay zekâ sağlayıcısı kesilir ya da yavaşlarsa olgu düzlemi, pano, alarm ve bildirim çalışmaya
  devam eder; konuşma ve not "şu an kullanılamıyor" der. Hiçbir uyarı yapay zekâya bağımlı değildir.

### 3.6 İnsan düzlemi

| Bileşen | Ne yapar |
|---|---|
| **Nöbetçi analist (7/24)** | Kuyruktaki belirsiz okumalar, kırmızı uyarının doğrulanması, danışmanı arama |
| **Onay kapıları** | İsimli koordinasyon bulgusu (yalnız iç kullanım), "ilk kaynak" adlandırması, kamuya gidecek taslak — her seferinde |
| **Düzeltme kütüphanesi** | Düzeltmeler modeli doğrudan değiştirmez; kapsamı (danışan, olay, tarih) ve son kullanma tarihiyle sürümlü; altın sette ve geri-testte etkisi ölçülünce etkinleşir; X içeriği için kural 4.3b |
| **Etiketleme** | Yalnız insan; en az iki bağımsız etiketçi + uzlaştırıcı; aktif öğrenmenin seçtiği örnekler **ölçüm için kullanılmaz**, rastgele ölçüm örneği ayrıdır |
| **Olay sonrası kayıt** | Her olaydan sonra kimliksiz "ne oldu, ne yapıldı, ne işe yaradı" kaydı (öğrenme kararı için) |

**Kriz kapasitesi ve bozulmuş mod.**
- Kuyruğa yalnız öncelikli öğe düşer: kırmızı uyarı doğrulaması (öncelik 1), olayın gidişini belirleyen yüksek erişimli
  içerik (öncelik 2), model ayrışması ve alay şüphesi (öncelik 3).
- Kapasite modeli: saatlik kuyruk = ilgili hacim × kuyruğa düşme oranı. Örnek: saatte 20 bin ilgili gönderinin %5'i
  kuyruğa düşerse saatte 1.000 öğe; kişi başı saatte ~120 öğeyle eşzamanlı ~8 analist. Bu yüzden kriz anında
  **kuyruğa düşme oranı önceliğe göre kısılır** (yalnız öncelik 1–2), öncelik 3 "insan incelemesi bekliyor" etiketiyle
  ekranda kalır.
- Nöbet planı: normal dönem tek koltuk (5–6 kişi), kriz için çağrılabilir yedek havuzu (sözleşmeli dış analist dahil).
- Zamanlılık iki ayrı ölçülür: (1) sistem uyarısı, (2) **analistçe doğrulanmış** uyarının danışmana ulaşması.
- Dış analist hizmeti alınırsa sözleşmede: veri işleyen yükümlülükleri, gizlilik, **çıkar çatışması** (aynı firmanın
  rakip danışana hizmeti), X paylaşım sınırları.

### 3.7 Arayüz
- **Sabit pano:** danışanlar, risk, alarm, olay akışı, kör nokta haritası, kalite özeti.
- **Danışan odası:** durum notu, ne yapmalı, nabız, anlatılar, yayılım, aktörler (X yanıtına göre isimli ya da isimsiz,
  bölüm 4.3b), koordinasyon, akış — her biri dayanak satırıyla.
- **Konuşma + kartlar.**
- **Bildirim:** önem düzeyine göre kanal; okunmazsa eskalasyon; teslim doğrulanır. Bildirim içeriği kişisel veri ya da
  gönderi metni taşımaz ("Danışan K-07: kırmızı uyarı, uygulamayı açın").
- **Rapor:** danışana giden her raporda **zorunlu "güven ve kapsam" bölümü** (neyi gördük, neyi göremedik, hangi
  sonuç ne kadar güvenilir). Raporda gönderi metni ve hesap adı görüntüleme ve paylaşım politikasına uyar (bölüm 4.3d).
- **Kalite ekranı:** her metriğin son değeri, aralığı, eğilimi, kullanılan yöntem.
- **Harcama ekranı:** lisans (sabit) ve değişken kalemler (API okuma, yapay zekâ, etiketleme); tahmini ile sağlayıcının
  kullanım kaydı arasındaki fark; tavanlar (N6).

### 3.8 Gözetim
Kaynak kalp atışı ve hacim sapması, kanarya, akış gecikmesi, kapsam düşüşü, kalite metriklerinde kayma, bildirim teslim
süresi, harcama ve tavanlar, model/kural/sağlayıcı sürüm değişimi. **Model, kural, varlık dosyası ya da veri sağlayıcı
değişikliği regresyon setinden geçmeden canlıya alınmaz;** sağlayıcı değişikliğinde kapsam ölçümü yeniden kurulur ve
kalite eğrisinde kırılma işareti konur.

### 3.9 Uyum ve güvenlik (mimarinin parçası)
- **Barındırma:** ana sistem, veri ve yedekler **Türkiye'de**. Erişim kısıtlaması dönemlerinde Türkiye'den API
  erişiminin sürüp sürmediği A0'da sınanır; gerekirse yurt dışında **kalıcı saklama yapmayan** toplama rölesi, ancak
  hukuki görüş ve aktarım sözleşmesiyle (bölüm 4.3a).
- **Aktarım envanteri:** kişisel verinin geçtiği her akış, dayanağıyla (bölüm 4.3a).
- **Veri ikametgâhı yönlendirmesi:** hangi verinin hangi model yoluna gidebileceği (yerinde / yurt dışı sağlayıcı /
  ayıklanmış).
- **Kullanım politikası motoru:** kişi izleme, hassas olay izleme, özel nitelikli çıkarım kurallarını reddeder; silme
  yükümlülüklerini yürütür.
- **Silme yayılımı:** bölüm 4.3c.
- **Danışan bazında veri ayrımı** (bir danışanın verisi diğerinin ekranına, raporuna ya da modeline sızmaz).
- **Gizli anahtar yönetimi, şifreleme, rol tabanlı erişim, denetim kaydı.**
- **Güvenlik olayı ve veri ihlali müdahale planı:** sahibi KVKK sorumlusu; Kurul'a bildirim süresi hukuki görüşle
  kesinleşir (denetimin bilgisine göre 72 saat; doğrulanacak).
- **Bağımsız sızma testi ve bağımsız kod incelemesi A8'den önce;** sonra yılda en az bir kez.
- **Geliştirme kuralı:** yazılımı geliştiren model ekipleri gerçek kişisel veri görmez; kimliksizleştirilmiş ya da
  sentetik veriyle çalışır.

### 3.10 Harcama defteri (N6)
"Lisans + değişken" yapısı: sabit lisanslar (X kurumsal, dinleme platformu, medya takip, ajans), değişken kalemler (X
okuma, yapay zekâ çağrıları, etiketleme saatleri). Her değişken kalem sağlayıcının kullanım kaydıyla günlük mutabık
kılınır; fark ekranda görünür. Yapay zekâ çağrıları için günlük ve aylık tavan; tavan aşılırsa bozulmuş moda geçilir,
uyarılar sürer.

---

## 4. Veri kaynakları, hukuk ve fizibilite

Kaynak: `B-VERI-HUKUK.md`. Her satır A0'da birincil kaynak ve satıcı görüşmesiyle yeniden doğrulanır.

### 4.1 Üç kademeli veri modeli

**Kademe 1 — doğrudan, sözleşmeli (otomatik işlenir):**

| Kanal | Yol | Neden | Fizibilite |
|---|---|---|---|
| X | **Kurumsal erişim (Enterprise):** Türkçe kural akışı ya da tam akış + **%10 rastgele örneklem akışı** + uyum (silme) akışı + tam arşiv + anlamsal eşleşme işleci | Kapsamı doğrudan ölçmenin yolu %10 akış ya da tam akış | Orta (satış süreci; fiyat yayımlanmıyor; kullanım amacı nedeniyle başvuru reddedilebilir) |
| X (geçiş) | Kullandıkça öde: tam arşiv arama + sayım (ayda 2 milyon okuma tavanı) | Kurumsal sözleşme **imzalanana kadar** ve A2 yarışması için | Yüksek |
| Ajans | AA aboneliği; DHA kurumsal | Haberin kaynağı | AA yüksek, DHA orta (izinsiz kullanım yasağı), İHA doğrulanamadı; yapay zekâ ile işleme izni sorulacak |
| Haber siteleri | Ticari haber API'si + GDELT | İki bağımsız haber toplayıcısı → haberde göreli kapsam | Yüksek |
| YouTube | Data API + kendi ses dökümümüz | Video kanalı; seçilen videolarda yorumlar tam (yeni video keşfi arama kotasıyla sınırlı) | Yüksek (30 gün yenileme kuralı) |
| Bluesky | Tam akış | Ücretsiz tam evren; yöntemlerin ilk sınama alanı | Yüksek (kitle küçük) |
| Threads | Anahtar kelime araması | Meta tarafında aranabilen tek yüzey | Orta |
| Facebook | Herkese açık Sayfa içerikleri | Yalnız Sayfalar | Düşük–orta |
| Şikâyetvar | Danışanın kendi marka API anahtarı | Danışanın kendi şikâyetleri | Orta |

**Kademe 2 — lisanslı aracı (sözleşmesi izin verdiği ölçüde otomatik):**

| Kanal | Yol | Not |
|---|---|---|
| X (yedek) | Ham veriyi API ile veren bir dinleme platformu | Satıcı arızasına yedek; **kapsam ölçümünde bağımsız yol sayılmaz** |
| TV, radyo, basılı, yerel haber | Yerli medya izleme firması (Ajans Press, Interpress, MTM) | Türkiye'de tek gerçekçi lisanslı yol |
| Instagram, TikTok | Dinleme platformu üzerinden | Beklenti düşük: Instagram'da hesap başına 30 etiket/hafta, geçmiş yok; TikTok'ta dar "bahsetme" verisi |

**Kademe 3 — insan okuması (yapay zekâ hattına girmez; A0'daki hukuki görüşe bağlıdır):** Ekşi Sözlük ve yerel forumlar
(lisans alınamazsa), Telegram kanalları (koşullar yapay zekâ amaçlı toplama ve kullanımı yasaklıyor), danışanın ilettiği
WhatsApp içerikleri (alenileştirilmemiş kişisel veri; ayrı hukuki soru). Analistin "insan gözlemi" kaydının yapay
zekâya gidip gitmeyeceği **kaynak bazında** hukuki görüşle yazılır; Telegram kaynaklı gözlemler varsayılan olarak
gitmez.

**Kalıcı kör noktalar:** WhatsApp ve kapalı gruplar; Facebook kişisel profilleri ve grupları; Instagram/TikTok'ta
etiketsiz bahsetmeler ve geçmişleri; gizli hesaplar; silinen içerik; LinkedIn üye gönderileri; A10'a kadar metinsiz
görsel ve video; haber, Instagram ve TikTok'ta erişim verisi (medya izleme firmasından gelmezse "bilinmiyor").

### 4.2 Veri kararlarının tasarıma etkisi
1. **X kurumsal erişimi, kapsam hedefinin ön koşuludur;** alınamazsa kapsam "dolaylı tahmin" olur ve hedef karşılanmış
   sayılmaz (risk R4, bölüm 2.2). Bu bir çelişki değil, açık bir indirgeme kuralıdır.
2. Sayılan ile okunabilen ayrı gösterilir.
3. Yeniden paylaşımlar sayımdan; kim paylaştı yalnız kritik gönderilerde.
4. Etkileşim yeniden okunur.
5. Yeni danışan için 30–90 günlük sayım tabanı ve olay dönemlerinden hedefli geriye doldurma.
6. Instagram kriz etiketleri önceden kayda alınır (30 etiket sınırı danışan bazında planlanır).
7. Erişim olayı takvimi: Türkiye'deki yavaşlatma/engelleme dönemlerinde hacim düşüşü "ilgi azaldı" diye yorumlanmaz.

### 4.3 Hukuk ve uyum: dört kısıt ve tasarım karşılıkları

**(a) KVKK — yurt dışına aktarım ve barındırma.** Gönderiler kişisel, kimi zaman özel nitelikli veri içerir. Yurt
dışındaki bir hizmete gönderim yurt dışına aktarımdır (KVKK standart sözleşmesi Türkçe imzalanır, 5 iş günü içinde
Kurul'a bildirilir). Yapay zekâ sağlayıcısının sözleşmesinde yalnız AB maddeleri bulundu; işlem yeri "küresel" ya da
"ABD"; sıfır saklama anlaşmayla mümkün, en üst modeller kapsam dışı olabilir. AB de yurt dışıdır.

**Aktarım envanteri (ilk sürüm):**

| Akış | Nereye | Kişisel veri | Gereken | Varsayılan karar |
|---|---|---|---|---|
| Ana sistem, veri, yedek | Türkiye'deki veri merkezi | Evet | — | Türkiye'de |
| Toplama rölesi (gerekirse) | Yurt dışı | Geçici | Aktarım sözleşmesi + hukuki görüş | A0'daki erişim sınamasına göre |
| Yapay zekâ sağlayıcısı | Yurt dışı | Evet | Standart sözleşme + bildirim + sıfır saklama | **İmza ve Kurul bildirimi tamamlanmadan kapalı** |
| Yerinde açık ağırlıklı model | Türkiye | Evet | — | Alternatif yol |
| Bildirim (e-posta/SMS/uygulama) | Sağlayıcıya göre | **Hayır** (içerik kişisel veri taşımaz) | — | Açık |
| İzleme/kayıt hizmetleri | Sağlayıcıya göre | Hayır (yalnız teknik ölçüm) | — | Açık |
| Dış analist hizmeti | Türkiye | Evet | Veri işleyen sözleşmesi | Sözleşmeyle |
| Etiketçiler | Türkiye | Evet | Gizlilik + veri işleyen | Sözleşmeyle |
| Geliştirme ekipleri (model) | Sağlayıcıya göre | **Hayır** (kimliksiz/sentetik) | — | Açık |
| Veri sağlayıcılar | Yurt dışından içeri | (toplama) | Sağlayıcı sözleşmesi | — |

**Model yolu seçimi** (A0, hukuki görüşe göre): (1) sağlayıcıyla standart sözleşme + sıfır saklama; (2) yerinde açık
ağırlıklı model; (3) kişisel veriyi ayıklayan ön katman (metin içi özel nitelikli veri için yetmeyebilir). **Öneri:**
hukuki görüş elverdiği ölçüde yerinde model ağırlıklı karma; bu karar A4'teki karşılaştırma sınamasıyla da kesinleşir.

**KVKK'nın diğer yükümlülükleri** (A0'da avukatla): işleme dayanağı ve meşru menfaat denge testi; alenileştirme amacıyla
uyum; aydınlatma; VERBİS; saklama-imha politikası; özel nitelikli veri; GDPR (Avrupa'daki gazeteci ve diaspora
hesapları). Avukat yanıtları bir **"yanıt → özellik"** tablosuna bağlanır; olumsuz yanıt hangi özelliği kapatıyorsa
tasarım önceden bilir.

**(b) X'in kısıtlı kullanım kuralları.** Model eğitimi yasak. Kullanıcıları izleme ve profil çıkarma; protesto, miting,
topluluk örgütlenmesi gibi hassas olayları izleme ve uyarı kurma; sendika ve aktivist grup izleme; hesabı X dışı
kimlikle eşleştirme yasak. Kişisel veri saklamayan toplu analiz serbest. Bir LLM'e analiz için gönderme konusunda açık
hüküm bulunamadı.

**X'ten yazılı olarak sorulacaklar:** (1) bir LLM'e analiz için gönderme; (2) küçük bir sınıflandırıcının ince ayarı,
düzeltme kütüphanesi ve aktif öğrenme; (3) bir olay bağlamında öne çıkan hesapların (isimle) gösterilmesi; (4) kurum ve
yayın organı hesaplarının toplama listesine alınması; (5) boykot çağrılarının izlenmesi (topluluk örgütlenmesi sayılır
mı); (6) tüketici hakları kuruluşları (aktivist grup sayılır mı); (7) koordinasyon analizi.

**X yanıtına göre özellikler (önceden kararlaştırılmış):**

| Özellik | X olumlu | X kısmi / belirsiz (en temkinli yorum) | X olumsuz |
|---|---|---|---|
| İçeriğin bulut yapay zekâsına gönderilmesi | Açık (KVKK şartıyla) | Yalnız yerinde model | Yalnız yerinde model |
| Sınıflandırıcı ince ayarı X içeriğiyle | Açık | Kapalı; X dışı veriyle eğitim, X yalnız ölçüm | Kapalı; A4 hedefleri yeniden değerlendirilir |
| Düzeltme kütüphanesi (X içeriği) | Model güncellemesine girer | Yalnız kural ve bağlam örneği; model ağırlığı değişmez | Aynı |
| Aktör tablosu | İsimli, olay bağlamında | Yalnız kurum/medya isimli; bireyler isimsiz (rol + takipçi aralığı) | Tamamen isimsiz |
| Hesap listesi tabanlı toplama | Kurum ve yayın organları | Kapalı | Kapalı |
| Yayılım adımlarında hesap adı | Açık | Kurum/medya ve 100 binin üstü kamusal hesaplar | İsimsiz |
| Koordinasyon analizi | İç kullanım, isimli kanıt yok | Yalnız toplu istatistik | Yalnız toplu istatistik |
| Boykot çağrısı içerik sınıfı | Açık | Toplu sayım açık; düzenleyenleri izleme kapalı | Aynı |
| Hassas olay izleme | **Her durumda kapalı** | Kapalı | Kapalı |

**Eğitim kuralı (tek ve tutarlı):** X'in yazılı teyidi gelene kadar **X içeriği hiçbir modelin ağırlıklarını
değiştirmek için kullanılmaz** (ince ayar, düzeltmeden öğrenme ve aktif öğrenme dahil). Sınıflandırıcılar X dışı
kaynaklarla (lisanslı Türkçe derlemler, haber yorumları, Bluesky) eğitilir; X içeriği yalnız **ölçüm** için kullanılır.
Bu alan kayması doğurabilir; A4 hedefleri bu durumda kullanıcıyla yeniden değerlendirilir.

**(c) Silme yükümlülüğü ve yayılımı.** X'te silinen, düzenlenen, korumaya alınan ve askıya alınan içerik 24 saat içinde
sistemden kaldırılır ya da güncellenir. Yayılım kuralları:

| Kayıt türü | Silmede ne olur |
|---|---|
| Ham gönderi, metin, alıntı | Silinir |
| Etiketler, anlatı üyeliği | Kimlikle birlikte silinir; toplu sayılara katkısı kalır |
| Durum notu, rapor, anlık görüntü | İçindeki alıntı yer tutucusu "kaldırılmış içerik" olur; sayılar sürüm notuyla korunur |
| Düzeltme kütüphanesi örneği | Silinir |
| Koordinasyon kanıtı | Baştan kimliksiz istatistikle tutulur (gönder-sil desenleri dahil) |
| Altın set, kronolojiler | Kimlik + etiket; silinen öğe düşer; aşınma oranı izlenir; set dönemsel yenilenir |
| Yapay zekâ sağlayıcısındaki kopya | X içeriğinin gittiği her bulut yolunda **sıfır saklama ön koşuldur** |

Tutarlılık metriği (K9) silmeden kaynaklanan değişiklikleri hariç tutar; anlık görüntüde "şu kadar öğe sonradan
kaldırıldı" notu görünür. A3 kapısında silme yayılımının bütün kayıt türlerinde çalıştığı sınanır.

**(d) Görüntüleme ve paylaşım politikası.** X: bir kuruma 30 günde en çok 1,5 milyon gönderi kimliği; alıcı başına günde
en çok 50 bin tam nesne; kamuya yayımlama yasağı; alan üçüncü tarafın X koşullarını kabul etmesi. Ajans telifi (DHA:
izinsiz kullanılamaz). Bu yüzden danışana giden raporda gönderi metni kısa alıntı ve bağlantıyla, ajans içeriği yalnız
başlık ve bağlantıyla; dış analist ve etiketçi akışları bu sınırlara göre ayarlanır. Satıcılara "danışana ya da üçüncü
kişiye aktarım" sorusu eklenir. "TR'de görünmüyor" içeriğin Türkiye'deki danışmana gösterilmesi hukuki görüşe
bağlıdır; görüş gelene kadar yalnız sayım düzeyinde gösterilir.

### 4.4 Avukata ve satıcılara sorulacaklar
Avukat: `B-VERI-HUKUK.md` §5.6'daki 15 soru + bölüm 4.3'teki ekler (barındırma ve röle, yanıt→özellik tablosu, boykot,
tüketici kuruluşları, GDPR, özel nitelikli çıkarım, WhatsApp, Telegram insan okuması, "TR'de görünmüyor", ihlal bildirim
süresi).

Satıcılar: (1) içerik bizde saklanabilir mi, ne kadar; (2) yurt dışı yapay zekâ ile, (3) yerinde modelle işlenebilir mi;
(4) silme bildirimi; (5) erişim/tiraj/reyting verisi; (6) TR'de erişime kapatılan içeriğin işaretlenmesi; (7) kesinti
bildirimi ve telafi; (8) danışana ya da üçüncü kişiye aktarım; (9) sözleşmeden çıkış, otomatik yenileme, veri
taşınabilirliği; (10) (X) %10 akış ve anlamsal işlecin Türkçe başarımı, geçmişe uygulanabilirliği, fiyat; (11) (yapay
zekâ sağlayıcısı) KVKK standart sözleşmesi, sıfır saklamanın kapsadığı modeller.

---

## 5. Zayıflıktan çözüme izlenebilirlik

Her madde: Rasat'taki bileşen (bölüm), ölçümü (bölüm 2) ve doğrulandığı kapı (bölüm 8).
Durum: **K** = karşılanır · **Y** = yönetilebilir (azaltılır ve ölçülür) · **Ç** = çözülemez, yalnız görünür kılınır.

| Madde | Bileşen | Ölçüm | Kapı | Durum |
|---|---|---|---|---|
| N1 kelimeye bağlı | Üç toplama yolu, varlık dosyası, ilgililik (3.2–3.3); metinsiz medya kör nokta → A10 | Kapsam, ilgililik | A3, A10 | Y (metinsiz medya: Ç→A10) |
| N2 duruş okumaz | Katmanlı okuma (3.3); olumsuz ağırlıklı alarm, "viral an" ayrımı (3.4) | Anlama; övgü dalgasında yanlış kırmızı alarm | A4, A5 | K |
| N3 örneklem | Tam akış; oran düzeltme; etkileşim yeniden ölçümü | Olumsuz pay hatası | A4, A5 | Y |
| N4 başlangıç pencereye bağlı | Arşivde otomatik geriye genişletme; "gözlenen en erken" dili | Başlangıç penceresi (40 olay) | A5 | Ç (yönetilir) |
| N5 alt başlık sözcük sıklığı | Anlatı kimliği (3.4) | Saflık, bölünme, ad uygunluğu | A4 | Y |
| N6 tutar tahmin | Harcama defteri ve ekranı (3.10) | Tahmin–fatura farkı | A3 (defter), A7 (ekran) | K |
| P1 gerçek veri yok | A0b ilk gerçek veri sınaması; A8 gölge işletim | Kapı sonuçları | A0b, A8 | K |
| P2 kendi sınavı | Bağımsız değerlendirme, kör altın set, yalnız insan etiketi | Bütün metrikler | A1 | K |
| P3 kaba duruş | Katmanlı okuma, oran düzeltme | Anlama | A4 | Y |
| P4 anlatı bölünmesi | Anlatı kimliği, üst anlatı, analist onaylı ad | Bölünme ≤ %10 | A4 | Y |
| P5 "sıçrama" | Kesin/olası bağ; dil kuralı; onay kapısı; isim + neden-sonuç birlikte yok | Kesin bağ doğruluğu; "ilk kaynak" adlandırması kronolojiye karşı | A5 | Ç (yönetilir) |
| P6 yeniden paylaşım | Sayımdan toplam; kritikte okuma | Kesin bağ doğruluğu | A3 | K |
| P7 ilk gün | 30–90 günlük sayım tabanı; ısınma etiketi | Isınma dönemi yanlış/kaçan alarm ayrı | A5 | K |
| P8 etkileşim donuyor | Yeniden ölçüm | Yeniden ölçüm sonrası sıralamanın tam akışla kıyası | A5 | K |
| P9 taban 24 saat | Mevsimsel taban | Yanlış alarm, gecikme | A5 | K |
| P10 tahmin çelişkisi | Tek model, aralık | Tahmin kalibrasyonu | A5 | Y |
| P11 danışan hesabı yükseltici | Sahip olunan kanal rolü | İlgililik setinde rol doğruluğu | A3 | K |
| P12 koordinasyon iki yön | Sıfır modeli, p < 0,01, alternatif açıklamalar, onay | Kesinlik; **kaçırma:** kronolojilerde bilinen kampanyaların yakalanma oranı | A5 | Ç (yönetilir) |
| P13 taslak | Taslak yalnız doğrulanmış olgudan; uzman kabulü; insan onayı | Taslak kabul ölçütü (A6) | A6 | Y |
| P14 anlatı adı donuyor | Her pencerede ad önerisi, "anlatı evrildi" | Ad uygunluğu | A4 | K |
| P15 haber erişimi | Medya izleme firmasından tiraj; yoksa "bilinmiyor" sürücüsü | — | A2, A5 | Y |
| P16 ikinci göz | Bağımsız kod incelemesi ve sızma testi A8'den önce | İnceleme bulguları kapatıldı | A8 öncesi | K |
| K1 denenmedi | Aşamalı kurulum, sayısal kapılar | Kapılar | Hepsi | K |
| K2 ikna edici yanlış | Denetçi, yer tutucu, dayanak satırı, ölçülmüş isabet | Atıf, sayı eşleşmesi | A6 | Y |
| K3 yanlış sorgu/araç | Sorgu görünür; "ne yaptım"; araç seçimi değerlendirme seti | Doğru araç/sorgu oranı | A6 | Y |
| K4 özet üstünden | Ham veriye sorgu atan yetenekler; kapsam etiketi | "Bulunamadı" yanıtlarında arama kapsamı %100 | A6 | K |
| K5 sessiz görev | Kural geri-testi; periyodik yeniden sınama; kanarya | Sessiz arıza 0 | A6, A8 | K |
| K6 gönderi içi talimat | Opak kimlik, yerleştirici, karantina, yapıştırılan içerik karantinada | Güvenlik | A6 | Y |
| K7 düzeltmeden öğrenme | Sürümlü kütüphane; X kuralı | Önce/sonra ölçümü | A4, A7 | K |
| K8 demo değerlendirme | Bağımsız altın set ve 40 olay | — | A1 | K |
| K9 aynı soru farklı yanıt | Anlık görüntü; sayılar hesaptan | Tutarlılık (silme hariç) | A6 | Y |
| Ortak-1 X kamuoyu değil | Rapor dili; kör nokta haritası | — | A7 | Ç |
| Ortak-2 görünmeyen yerler | Kademe 2–3; kör nokta haritası | — | A2 | Ç |
| Ortak-3 X'in verdiği | Silme yayılımı; "sayılan/okunabilen" | — | A3 | Ç |
| Ortak-4 Türkçe zor | Katmanlı okuma; alay ayrı ölçüm | Anlama | A4 | Y |
| Ortak-5 doğruyu bilen ölçüt | A1 ölçü aleti | — | A1 | K |
| Ortak-6 iddianın doğruluğu | Teyit kaynağı eşleştirme (koşulları A0b'de); "doğrulanmadı" etiketi | — | A4 | Ç |
| Ortak-7 zamanlama neden değil | Dil kuralı, denetçi | — | A6 | Ç |
| En tehlikeli-1 kendi sınavı | P2 ile aynı | | A1 | K |
| En tehlikeli-2 ikna edici yanlış | K2 + rapordaki zorunlu güven bölümü + kullanıcı eğitimi | | A6, A7 | Y |
| En tehlikeli-3 sessiz görev | K5 ile aynı | | A6, A8 | K |
| En tehlikeli-4 suçlayıcı bulgu | "Kamuya hiç" kuralı; onay; isimsiz varsayılan | | A5, A6 | Y |
| En tehlikeli-5 ilk günler | P7 + ısınma ölçümü | | A5 | Y |
| Yapay zekâ harcama tavanı yok | Harcama defteri (3.10) | | A3 | K |
| Yapay zekâ kesilirse | Bozulmuş mod (3.5) | Kesinti benzetimi | A6 | K |
| Süre ve maliyet tahmini yok | Bölüm 7 | | — | K |
| Rakip bilgisinin kullanımı | A10 (rakip karşılaştırma), kapılı | | A10 | — |
| Kapanan olayların arşivi | Kimliksiz olay sonrası kaydı (3.6); A10 arşiv | | A7, A10 | Y |
| Konuşmanın gecikmesi ve maliyeti | Harcama ekranı; yanıt süresi hedefi (p90 ≤ 30 sn) | | A6 | K |

### 5.1 Çözülemeyenler (dürüst liste)
1. Görülen kanallar kamuoyunun tamamı değildir.
2. Kapalı gruplar, özel mesajlar, kişisel Instagram hesapları ve Hikâyeler görünmez.
3. Silinen ve erişime kapatılan içerik eksiktir; eksiklik rastgele değildir; geçmiş olayların ayrıntısı zamanla aşınır.
4. "İlk kaynak" kesin bilinemez; "gözlenen en erken" söylenir.
5. Zamanlama neden değildir.
6. Meşru topluluk eşgüdümü ile örgütlü kampanya her zaman ayrılamaz.
7. Türkçe alay ve ima en iyi yöntemle de hata üretir.
8. Bir iddianın doğruluğu bağımsız teyit olmadan bilinemez.
9. Viral tahminin öngörülebilirlik tavanı vardır.
10. Instagram ve TikTok'ta ticari kullanıcıya genel dinleme yolu yoktur.
11. Telegram ve lisanslanamayan yerel kaynaklar yalnız insan gözüyle okunur.
12. X'in kuralları bireyleri izlemeyi yasaklar; bazı aktör analizleri ancak isimsiz yapılabilir.

---

## 6. Seçenekler: kur, satın al, karma

| | A. Satın al | B. Her şeyi kendimiz kuralım | C. Karma (önerilen) |
|---|---|---|---|
| Ne | Kurumsal dinleme platformu + yerli medya takip + analist hizmeti | Veri dahil her katman kendi sözleşmelerimiz ve kodumuzla, hazır platform yok | Veri satın alınır; ölçüm, Türkçe okuma, olgu, yorum, insan iş akışı kurulur |
| Canlıya süre | 1–3 ay | 18–24 ay | 12–18 ay |
| Kapsam ve isabetin ölçülmesi | Satıcı ölçmüyor; biz ancak dışarıdan örnekle denetleriz | Tam | Tam |
| Türkçe ve alay | Satıcıya bağlı; ölçüm yayımlanmamış | Tam kontrol | Tam kontrol |
| Yöntem şeffaflığı | Kara kutu (risk, bot, koordinasyon) | Tam | Tam |
| Hukuk | Satıcının sözleşmesi; KVKK aktarımı satıcıya göre | Tamamen bizde | Bizde; veri sözleşmeleri satıcılarla |
| Satıcı riski | Yüksek (tek satıcı) | Düşük | Orta (iki toplayıcı) |
| Kullanıcının talebine uyum ("ölçülmüş en doğru") | Düşük | Yüksek | Yüksek |

**Öneri: C, A ile köprülenmiş.** İlk aydan itibaren bir dinleme platformu lisansı ve Türk medya takip hizmeti alınır
(Nabız X sayımında kalır). Bu, 12–18 ay boyunca çalışacak bir aracınız olmasını sağlar. Aynı platform A2'deki veri
yarışmasının adayıdır; Rasat hazır olduğunda ya yedek toplayıcı olarak kalır ya da sözleşmesi bitirilir.

---

## 7. Fizibilite: süre, kadro, maliyet

### 7.1 Takvim ve kritik yol (kabaca, hafta)

| Aşama | Başlar | Biter | Bağımlı olduğu |
|---|---|---|---|
| A0a Hukuki zemin | 0 | 6 | — |
| Köprü çözüm devreye | 0 | 8 | Satın alma |
| A1 Ölçü aleti | 2 (kod kitabı, olay seçimi, işe alım) / 6 (gerçek veriyle etiketleme) | 20 | A0a (gerçek veri için) |
| A0b Satıcı, X, model yolu | 4 | 14 | A0a |
| A2 Veri yarışması | 14 | 20 | A0b, A1'in olay listesi ve kronolojileri |
| A3 Toplama, ilgililik, kapsam | 20 | 30 | A2 |
| A4 Anlama | 24 | 38 | A3'ün toplama hattı + ilgililik; A1 altın seti |
| A5 Olgu düzlemi | 28 | 40 | A3; A4'ün duruş çıktısı (olumsuz ağırlıklı alarm için) |
| A6 Yorum ve güvenlik | 36 | 46 | A5'in kanıt deposu |
| A7 İnsan iş akışı, arayüz, bildirim | 38 | 48 | A5; A6 ile kısmen paralel |
| Sızma testi + bağımsız kod incelemesi | 46 | 50 | A6, A7 |
| A8 Gölge işletim | 50 | 62 | Hepsi |
| A9 Canlı | ~62 (≈ 14. ay) | sürekli | A8 kesin kabul |

**Kritik yol:** A0a → A0b → A2 → A3 → A5 → A6 → güvenlik testleri → A8. **Tahmin: 12–18 ay**; en büyük belirsizlikler
X kurumsal satış süreci ve hukuki görüşün içeriği.

### 7.2 Kadro

| Rol | Sayı | Dönem |
|---|---|---|
| İnsan mühendislik lideri (model ekiplerinin çıktısını onaylar, gizli anahtarları tutar) | 1 | Baştan sona |
| Proje yöneticisi | 1 | Baştan sona |
| Nöbetçi SRE (insan ya da yönetilen hizmet) | 2–3 ya da hizmet | A7'den itibaren |
| Değerlendirme lideri | 1 | Baştan sona |
| Etiketçiler (Türkçe anadil) | Başlangıçta 4–6; işletmede danışan sayısına bağlı (aşağıda) | A1'den itibaren |
| Olay kronolojisi araştırmacıları | 2–3 | A1 (40 olay) + her ay yeni olay |
| Nöbetçi analistler (7/24 tek koltuk) | 5–6 + kriz yedek havuzu | A7'den itibaren (A8'de tam) |
| Kriz iletişimi uzmanı | Yarı zamanlı | A1, A6, A7, A8 |
| Veri ortaklıkları yöneticisi | 1 | A0–A2, sonra yarı zamanlı |
| KVKK sorumlusu | Yarı zamanlı | Baştan sona |
| Hukuk danışmanı | Dış | A0 yoğun, sonra gerektikçe |
| Bağımsız teknik danışman (kullanıcı için) | Dış, yarı zamanlı | Kapı kararlarında |
| Kırmızı takım | Dış ya da ayrı ekip | A6, sonra üç ayda bir |
| Mühendislik katmanları (veri, bilgi erişimi, Türkçe dil işleme, istatistik, ağ bilimi, ajan, arayüz, güvenlik) | Model ekipleri + insan lider onayı | A3–A7 |

**Model ekipleriyle çalışma kuralları:** aynı anda en çok 2–3 model ekibi, her biri tek katmanın sahibi; her ekibe yazılı
sözleşme (arayüz, veri biçimi, kapı) verilir; tasarım, değerlendirme tasarımı ve güvenlik mimarisi en yetenekli modelle,
uygulama orta düzey modelle; araştırma ve kararlar depoya yazılır, tekrar yapılmaz; model ekipleri gerçek kişisel veri
görmez.

**Etiketleme yükü (örnek: 10 danışan, 4 haftalık pencere):** kapsam 1.000–4.000 + ilgililik 200 + anlama kayma örneği
≈ 1.000 + atıf 200 ≈ 2.400–5.400 öğe; çift etiketle 4.800–10.800 etiket ≈ haftada 1.200–2.700 etiket ≈ saatte ~120
etiketle haftada 10–23 saat. Altın set kurulumu (A1) ayrıca ≈ 5.000 öğe × 2. Danışan sayısı arttıkça kapsam etiketi
portföyde paylaşıldığı için yük doğrusal artmaz; ilgililik ve anlama örnekleri doğrusal artar.

### 7.3 Maliyet büyüklüğü

| Kalem | Büyüklük | Dayanak |
|---|---|---|
| X kurumsal erişim | Ayda 42–50 bin $'dan başlıyor (yıllık ≈ 0,5–0,6 milyon $) | İkincil kaynak, **doğrulanamadı** (B) |
| Dinleme platformu (köprü + yedek) | Yıllık ≈ 25–130 bin $ (Sprinklr daha yüksek) | Kısmen (A) |
| Yerli medya takip, ajans aboneliği, haber API'si | Teklif | Doğrulanamadı |
| Yapay zekâ çağrıları, hesaplama, Türkiye'de barındırma | Değişken; harcama defterinde izlenir | — |
| İnsanlar | Bölüm 7.2; en büyük sürekli kalem 7/24 nöbet | — |

Kesin bütçe A0b sonunda tekliflerle çıkar.

---

## 8. Aşamalı plan ve kontrol kapıları

**Her aşama aynı şablonla:** Amaç · Önkoşul · İşler · Sahip (yapan) · Ölçen (yapmayan) · Kapı (ön kabul / kesin kabul)
· Durma ve geri dönüş. Kapıyı ölçen, işi yapan değildir; kapı sonucu, kullanılan veri ve tarih depoya yazılır; kapı
kararını kullanıcı, bağımsız teknik danışmanın görüşüyle onaylar.

### A0a — Hukuki zemin *(0–6. hafta; para harcanmaz, gerçek kişisel veri işlenmez)*
- **Amaç:** gerçek veriyle çalışmanın hukuki dayanağını kurmak.
- **İşler:** avukat görüşü (bölüm 4.4); işleme dayanağı ve denge testi; aktarım envanteri; barındırma kararı; geliştirme
  ve etiketleme veri kuralı (kimliksiz/sentetik geliştirme, etiketçi gizlilik ve veri işleyen sözleşmeleri); X'e yazılı
  sorular gönderilir; olay müdahale planı taslağı.
- **Sahip:** hukuk danışmanı, KVKK sorumlusu, proje yöneticisi. **Ölçen:** bağımsız teknik danışman + lider.
- **Kapı:** yazılı hukuki görüş; aktarım envanteri; barındırma kararı; yanıt→özellik tablosu; etiketçi sözleşme şablonu.
- **Durma:** görüş gerçek veri işlemeyi hiçbir yolla mümkün görmezse proje A seçeneğine (satın al) indirgenir ve
  kullanıcıya sunulur.

### A0b — Satıcılar, X, model yolu *(4–14. hafta)*
- **Önkoşul:** A0a.
- **İşler:** birincil kaynaktan doğrulama (bölüm 11); X kurumsal satış görüşmesi; X'in yazılı yanıtları; yapay zekâ
  sağlayıcısıyla standart sözleşme ve sıfır saklama görüşmesi; model yolu seçimi; satıcılara bilgi talebi; **ilk gerçek
  veri sınaması** (Bluesky, GDELT, YouTube; ardından küçük bütçeli X kullandıkça öde) — amaç bağdaştırıcıların gerçek
  veriyle çalıştığını görmek; Türkiye'den API erişiminin kısıtlama dönemlerindeki davranışı (geçmiş dönemler ve canlı
  sınama); köprü çözüm sözleşmeleri.
- **Sahip:** veri ortaklıkları yöneticisi, mühendislik lideri. **Ölçen:** değerlendirme lideri + bağımsız teknik danışman.
- **Kapı:** her kanal için birincil kaynaklı "yapılabilir / yapılamaz / koşullu"; X yanıtları alınmış ya da 8 hafta
  içinde gelmediyse **"X kısmi" sütunu** uygulanır; bulut yolu için **imza + Kurul bildirimi tamam** (takvim yetmez) ya
  da yerinde model yolu seçilmiş; ilk gerçek veri sınamasında her bağdaştırıcı çalışıyor; en az iki aday sağlayıcıdan
  örnek veri sözü; teklif bazlı bütçe.
- **Durma:** X kurumsal erişimi reddedilirse R4 senaryosu: kapsam hedefi "dolaylı" olur; kullanıcı yazılı olarak
  devam/vazgeç kararı verir.

### A1 — Ölçü aleti *(2–20. hafta; bağımsız değerlendirme ekibi)*
- **Önkoşul:** gerçek veriyle etiketleme için A0a.
- **İşler:** kod kitabı; etiketçilerin işe alımı, eğitimi, uyum ölçümü; **40 olay havuzu** (10 büyük kriz tam kronoloji —
  kullanıcının önerdikleri dahil — + ≥ 30 küçük dalga hafif kronoloji; birden çok danışan türü ve sektör); bilinen-öğe
  listeleri; altın set: tabakalı ve zaman bölmeli, **aday havuzu geniş sorgu taslağıyla** üretilir (A3'ten sonra
  tamamlayıcı örnek eklenir); olaysız dönem sayım verisi (≥ 100 danışan-hafta, yanlış alarm için); değerlendirme
  altyapısı ("o ana kadar bilinen veri" kuralıyla geri-test); **ilk taban ölçüm:** Pusula'nın mevcut analizi ve köprü
  platformu aynı sette ölçülür.
- **Sahip:** değerlendirme lideri. **Ölçen:** kronolojileri ikinci bir araştırmacı bağımsız doğrular; uyumu istatistik
  ölçer. Altın set yalnız insanlarca etiketlenir; sistemin model ailesi katkı vermez.
- **Kapı:** her görev için α ölçülmüş ve bölüm 2.4'e göre sınıflanmış; 40 olay kronolojisi doğrulanmış; altın set
  bölüm 2.3'teki sayılara ulaşmış; taban ölçüm raporu.
- **Durma:** bölüm 2.4'teki α kuralları; bir görevin düşük uyumu projeyi durdurmaz.

### A2 — Veri yarışması *(14–20. hafta)*
- **Önkoşul:** A0b; A1'in olay listesi ve kronolojileri.
- **İşler:** adaylardan aynı geçmiş olaylar için veri; kronolojilere ve bilinen-öğe listelerine karşı **tamlık**
  (bilinen öğelerin kaçı var), gecikme, erişim verisi; %10 akış ve anlamsal işlecin geçmişe uygulanabilirliği ve
  Türkçe başarımı; sözleşme koşullarının kıyası.
- **Sahip:** veri ortaklıkları yöneticisi + veri mühendisi. **Ölçen:** değerlendirme ekibi.
- **Kapı:** X için seçilen kaynakta bilinen-öğe tamlığı ≥ %95 (kaynak düzeyi; sorgudan bağımsız); kör nokta haritasının
  ilk sürümü; sözleşmeler hukuk onaylı. (Kapsamın sorgu + sınıflandırıcı düzeyindeki ölçümü A3'tedir; A2 kaynağın
  kendisini ölçer.)
- **Durma:** hiçbir kaynak tamlık eşiğine ulaşmıyorsa eşik değil **kaynak seti** değişir (ek kaynak, farklı sözleşme);
  hâlâ ulaşılamıyorsa kullanıcının yazılı kararıyla kanal bazında hedef yeniden belirlenir ve kalite ekranında görünür.

### A3 — Toplama, ilgililik, kapsam *(20–30. hafta)*
- **Amaç:** doğru içeriği eksiksiz ve ölçülerek toplamak.
- **İşler:** varlık dosyası ve düzenleyicisi; üç toplama yolu (hesap listesi X yanıtına göre); ilgililik ve eşsesli
  ayrımı; kapsam ölçümü (bölüm 2.2); kapsam düşüş alarmı ve neden ayrımı; etkileşim yeniden ölçümü; kaynak kalp atışı ve
  kanarya; veri ikametgâhı yönlendirmesi; kullanım politikası motoru; silme yayılımı; Instagram etiket ön kaydı; erişim
  olayı takvimi; harcama defteri.
- **Sahip:** veri mühendisi, bilgi erişimi mühendisi (model ekipleri) + mühendislik lideri. **Ölçen:** değerlendirme ekibi.
- **Kapı (ön kabul):** geri-test olaylarında ilgililik ≥ %90, geri-test kapsamı ≥ %90; ilgililik sınıflandırıcısı F1 ≥
  0,85; kaynak kesintisi benzetiminde alarm ≤ 5 dk; kanarya alarmı çalışıyor; silme yayılımı bütün kayıt türlerinde
  ve (bulut yolu varsa) sağlayıcıda sınanmış; politika motoru sınama setindeki yasaklı isteklerin %100'ünü reddediyor;
  yönlendirme dışı veri akışı 0; harcama defteri sağlayıcı kayıtlarıyla mutabık.
- **Durma/geri dönüş:** ilgililik ya da kapsam hedefi tutmazsa A2'ye (kaynak) ya da varlık dosyasına dönülür; politika
  ya da silme sınaması başarısızsa gerçek veri akışı durdurulur.

### A4 — Anlama *(24–38. hafta)*
- **Amaç:** Türkçe içeriği doğru ve ölçülmüş güvenle okumak.
- **İşler:** Türkçe kodlayıcı (eğitim verisi kuralı 4.3b); karantina büyük dil modeli; **kodlayıcı ↔ büyük dil modeli
  karşılaştırması** kendi altın setimizde (model yolu kararını kesinleştirir); belirsizlik ve ayrışmaya göre insan
  kuyruğu; kalibrasyon; oran düzeltme; anlatı kümeleme, kalıcı kimlik, ad önerisi; iddia tespiti ve teyit kaynağı
  eşleştirmesi (koşulları A0b'de); olası otomatik içerik işareti.
- **Sahip:** Türkçe dil işleme mühendisi (model ekibi) + lider. **Ölçen:** değerlendirme ekibi, kör altın set.
- **Kapı (ön kabul):** bölüm 2.1'deki anlama hedefleri; büyük dil modeli–insan uyumu insan–insan uyumunun en çok 0,05
  altında (değilse o görevde tek başına kullanılmaz).
- **Durma/geri dönüş:** X ince ayar yanıtı olumsuz ve X dışı veriyle hedef tutmuyorsa kullanıcıyla hedef yeniden
  değerlendirilir (yazılı karar); alay alt kümesi yalnız raporlanır.

### A5 — Olgu düzlemi *(28–40. hafta)*
- **Amaç:** sayıları, alarmları ve çıkarımları ölçülmüş doğrulukla üretmek.
- **İşler:** mevsimsel taban; iki alarm serisi ve "viral an" ayrımı; uyarı birleştirme; yayılım (kesin/olası) ve arşivde
  geriye genişletme; anlatı izleme; koordinasyon (sıfır modeli, p eşiği, alternatif açıklamalar, kimliksiz kanıt);
  otomatik içerik payı; tahmin; risk; kanıt deposu ve anlık görüntü.
- **Sahip:** istatistik ve ağ bilimi (model ekipleri) + lider. **Ölçen:** değerlendirme ekibi, 40 olay ve olaysız dönem.
- **Kapı (ön kabul):** bölüm 2.1'deki çıkarım ve zamanlılık hedefleri (olay yakalama, başlangıç penceresi, kesin bağ,
  yanlış alarm, gecikme); övgü dalgası geri-testlerinde yanlış kırmızı alarm 0; bilinen koordineli kampanyaların
  yakalanma oranı raporlanmış (P12'nin ikinci yönü).
- **Durma/geri dönüş:** alarm hedefi tutmazsa eşik seçimi ve taban modeli yeniden; geri-test başarısının canlı başarının
  üst sınırı olduğu kapı raporunda yazılır.

### A6 — Yorum düzlemi ve güvenlik *(36–46. hafta)*
- **Amaç:** konuşan katmanı güvenli, dayanaklı ve tutarlı kılmak.
- **İşler:** planlayıcı / karantina / yazıcı / denetçi / yerleştirici; opak kimlikler; sözle nicelik yasağı; yetenek kaydı
  ve harcama kapısı; "ne yaptım"; araç/sorgu seçimi değerlendirme seti; kalıcı izleme talimatı ve geri-testi; Türkçe
  kırmızı takım seti (görünen ad, anlatı adı, görsel içi yazı, yapıştırılan içerik saldırıları dahil); bozulmuş mod;
  durum notu ve yanıt planı.
- **Sahip:** ajan mühendisi (model ekibi) + lider. **Ölçen:** değerlendirme ekibi, kırmızı takım, kriz iletişimi uzmanı.
- **Kapı (ön kabul):** bölüm 2.1'deki sunum ve güvenlik hedefleri; araç/sorgu seçiminde doğruluk ≥ %95; konuşma yanıt
  süresi p90 ≤ 30 sn; yapay zekâ kesinti benzetiminde uyarı ve pano çalışıyor; **taslak kabulü:** 20 senaryoda olgu
  hatası 0 ve uzman puanı (1–5) ortalaması ≥ 4, hiçbir senaryoda < 3.
- **Durma/geri dönüş:** güvenlik hedefinde tek başarılı araç/kural/harcama değişikliği bile canlıya geçişi durdurur.

### A7 — İnsan iş akışı, arayüz, bildirim *(38–48. hafta)*
- **Amaç:** sistemi kullanıcının ve analistin günlük işine oturtmak.
- **İşler:** analist kuyruğu, öncelik ve kriz modu; onay kapıları; düzeltme kütüphanesi; pano, oda, konuşma, kalite
  ekranı, kör nokta haritası, harcama ekranı; eskalasyonlu bildirim; rapor şablonu (zorunlu güven ve kapsam bölümü);
  **kullanıcı ve analist eğitimi** (dayanak satırını okumak, güven dilini danışana aktarmak).
- **Sahip:** arayüz ve SRE (model ekibi + insan SRE). **Ölçen:** değerlendirme ekibi + kullanıcı.
- **Kapı (ön kabul):** kırmızı uyarı → danışmanın okuması p95 ≤ 15 dk; okunmayanın telefon eskalasyonu ≤ 10 dk; **kriz
  tekrar oynatmasında** (en büyük geçmiş olay 2× hızda) öncelik-1 kuyruk bekleme p95 ≤ 15 dk; kullanıcı senaryolarının
  ≥ %90'ı yardımsız tamamlanıyor; eğitim tamamlanmış.
- **Durma/geri dönüş:** kriz tekrar oynatmasında kuyruk taşarsa nöbet planı ve kuyruğa düşme kuralları yeniden.

### Güvenlik kapısı *(46–50. hafta)*
Bağımsız sızma testi ve bağımsız kod incelemesi; kritik ve yüksek bulgular kapatılmadan A8 başlamaz.

### A8 — Gölge işletim *(50–62. hafta; 12 hafta)*
- **Amaç:** canlı veriyle, danışana hiçbir şey gitmeden ölçmek.
- **İşler:** 4–6 gerçek danışanla tam işletim; köprü platformuyla ve kullanıcının yöntemiyle yan yana; yaşanan her olay
  için sonradan bağımsız kronoloji (olay havuzuna eklenir); haftalık kalite ölçümü; kanarya ve yapay arıza.
- **Sahip:** proje yöneticisi. **Ölçen:** değerlendirme ekibi.
- **Kapı (kesin kabul):** bölüm 2.1'deki **bütün tabanlar** birikimli veride karşılanıyor (olay düzeyi metrikler A1 + A8
  olaylarının birleşimiyle); sessiz arıza 0 (kanarya ve yapay arıza ile); kullanıcı "danışana bununla gidebilirim"
  diyor.
- **Durma/geri dönüş:** bölüm 2.4 (4 haftalık birikimli taban altı ya da ardışık izleme alarmı → ilgili aşamaya dönüş;
  tek hafta düşüşü → inceleme).

### A9 — Canlı ve sürekli kalite *(≈ 14. aydan itibaren)*
- **Kapı (canlıya alma):** A8 kesin kabulü + güvenlik kapısı + kullanıcı onayı.
- **Sürekli:** haftalık kalite ekranı; ayda en az bir yeni olay kronolojisi ve geri-test; değişiklikler regresyon setinden
  geçmeden canlıya alınmaz; üç ayda bir kırmızı takım; yılda bir sızma testi ve kod incelemesi.
- **Geri çekilme:** bölüm 2.4 kuralıyla bir boyut taban altına inerse o boyutu kullanan ekranlara "ölçüm hedefin altında"
  uyarısı düşer ve ilgili aşamaya dönülür; güvenlik hedefinde ihlal → konuşan katman bozulmuş moda alınır.

### A10 — Genişleme *(ölçüm verdikçe)*
Her yeni kanal ve çoklu ortam yeteneği için **açılış kapısı:** önce kör nokta haritasında; kendi Türkçe örneklerimizle
ölçüm (ses dökümü kelime hata oranı ≤ %15, görsel yazı ve logo için bilinen-öğe tamlığı); hukuki ve sözleşme kontrolü;
sonra kapsamda. Rakip karşılaştırma, olay arşivi ve karşılaştırma, sabah özeti, çok kullanıcı aynı kapı mantığıyla.

---

## 9. Planın kendi denetimi

1. **Tasarım düzeyi:** sürüm 2 bağımsız denetimden geçti (`D-DENETIM.md`); 39 bulgunun karşılığı bölüm 14'te. Sürüm 3
   de A0a'da bağımsız teknik danışmana okutulur.
2. **Aşama düzeyi:** her kapı sayısal; ölçen ≠ yapan; kapı kararını kullanıcı danışman görüşüyle onaylar.
3. **İşletme düzeyi:** kalite ekranı; ardışık izleme; aylık yeni olayla geri-test.

---

## 10. Riskler

| # | Risk | Etki | Karşılık |
|---|---|---|---|
| R1 | Bir kaynağın sözleşmesi içeriğin yapay zekâya gönderilmesini yasaklıyor | O kaynakta bulut modeli kullanılamaz | Yazılı teyit; yerinde model; buluta yalnız türetilmiş veri |
| R2 | KVKK aktarım şartları sağlayıcıyla karşılanamıyor | Bulut modeli yok; ceza riski | Veri ikametgâhı; yerinde model; imza + bildirim olmadan bulut yolu kapalı |
| R3 | X'in kısıtlı kullanım kuralları özellikleri daraltıyor | Aktör/koordinasyon isimsiz; hesap listesi kapalı | Önceden kararlaştırılmış özellik tablosu (4.3b) |
| R4 | X kurumsal erişimi alınamıyor ya da gecikiyor | Kapsam yalnız dolaylı | "Dolaylı tahmin" etiketi; hedef karşılanmamış sayılır; yedek aracı; kullanıcı kararı |
| R5 | Veri sağlayıcı kesintisi, iflası ya da sözleşme değişikliği | Kör kalma | İki toplayıcı; kalp atışı ve kanarya; çıkış maddeleri; veri taşınabilirliği |
| R6 | Altın set yetersiz ya da yanlı | Ölçümler yanıltıcı | Bağımsız ekip, yalnız insan etiketi, tabakalı/zaman bölmeli örnekleme, düzenli yenileme |
| R7 | Silme yükümlülüğü altın seti ve arşivi aşındırıyor | Ölçümler daha az temsilî | Kimlik + etiket; aşınma takibi; dönemsel yeni set; kimliksiz kronoloji |
| R8 | Türkiye'de erişim kısıtlaması | Hacimde yapay düşüş; toplama kesintisi | Erişim olayı takvimi; A0b sınaması; gerekirse röle |
| R9 | Model sürüm ya da sağlayıcı değişimi isabeti sessizce düşürüyor | Kayma | Sürüm sabitleme; regresyon kapısı; kalite eğrisinde kırılma işareti |
| R10 | Kriz anında analist kuyruğu taşıyor | Gecikme | Öncelik ve kısma kuralları; yedek havuz; A7 kriz tekrar oynatması |
| R11 | Etiketleme yükü sürdürülemiyor | Kalite ekranı eskir | Portföy düzeyinde kapsam ölçümü; aktif öğrenmeyle etiket seçimi (ölçüm örneğinden ayrı) |
| R12 | Kullanıcı ölçülmüş belirsizliği "araç emin değil" diye okuyor | Güven kaybı | Günlük dille hedefler; eğitim; rapor şablonu |
| R13 | Platform koşulları değişiyor (X 2025 ve 2026'da değiştirdi; Telegram 2026) | Özellik ya da kaynak kapanır | Üç ayda bir koşul taraması; yanıt→özellik tablosu güncellenir |
| R14 | Mevzuat ya da içtihat değişiyor (KVKK, Anayasa Mahkemesi 2026) | Hukuki dayanak değişir | Hukuk danışmanının dönemsel gözden geçirmesi |
| R15 | Kilit kişi ayrılıyor (değerlendirme lideri, mühendislik lideri) | Bilgi kaybı | Kararların ve kapı sonuçlarının depoda yazılı olması; yedek kişi |
| R16 | Maliyet aşımı | Kapsam daraltılır | Teklif bazlı bütçe (A0b); harcama ekranı; tavanlar |
| R17 | Geliştirmede kullanılan model ekiplerinin kotası ya da erişimi kesiliyor | Takvim kayar | En çok 2–3 eşzamanlı model ekibi; işlerin depoda yazılı sözleşmelerle bölünmesi |

---

## 11. Doğrulanmamış varsayımlar (A0b'de birincil kaynaktan kontrol)

1. Hangi dinleme platformlarının X ile **bugün** geçerli resmî veri ortaklığı olduğu ve ham veriyi API ile verip vermediği.
2. X kurumsal erişiminin fiyatı; %10 örneklem akışının ve anlamsal işlecin Türkçe başarımı ve geçmişe uygulanabilirliği.
3. X sözleşmesinin bir LLM'e gönderme, ince ayar, düzeltme kütüphanesi ve aktif öğrenmeye bakışı.
4. Sayım ucunun silinen gönderileri düşüp düşmediği; `is:retweet` ile yeniden paylaşım sayımının davranışı.
5. X aramasının Türkçe ekli biçimleri (ör. "Anadolu Süt'ün", "Anadolu Süt'e") nasıl eşleştirdiği.
6. Türkiye'deki medya takip şirketlerinin verisinin aktarılabilirliği ve tiraj/reyting verisi.
7. Yapay zekâ sağlayıcısının KVKK standart sözleşmesine yaklaşımı ve sıfır saklamanın kapsadığı modeller.
8. Türkçe duruş, alay ve çoklu ortam yöntemlerinin ölçülmüş başarı rakamları (çoğu özetten alındı).
9. Teyit kuruluşlarının veri paylaşımı ve ticari kullanım koşulları.
10. Ekşi Sözlük ve yerel forumlar için lisans olasılığı.
11. KVKK veri ihlali bildirim süresi (denetime göre 72 saat).
12. Türkiye'deki erişim kısıtlamalarının API erişimini etkileyip etkilemediği.

---

## 12. Sözlük

| Terim | Sade anlamı |
|---|---|
| Kapsam (duyarlılık) | İlgili içeriğin ne kadarını gördüğümüz |
| İlgililik (kesinlik) | Gördüğümüzün ne kadarının gerçekten danışanla ilgili olduğu |
| Güven aralığı, taban | Ölçümün belirsizliği; "en kötü ihtimalle şu kadar" |
| Altın set | Uzman insanların tek tek etiketlediği, doğrunun bilindiği örnek kümesi; her şey ona karşı ölçülür |
| Krippendorff α | Etiketçilerin birbiriyle ne kadar anlaştığı; düşükse "doğru" bile tartışmalıdır |
| Makro-F1 | Bütün duruş türlerinde ortalama isabet (hem kaçırmayı hem yanlış etiketlemeyi cezalandırır) |
| Kalibrasyon | Modelin "%80 eminim" demesinin gerçekten 80 doğruya karşılık gelmesi |
| Oran düzeltme (DSL/PPI) | Model etiketlerinin hatasını küçük bir insan örneğiyle düzelterek oranı doğru tahmin etme |
| Elüzyon örneklemesi | "Dışarıda bıraktıklarımızdan" rastgele örnek alıp aralarında ilgili olanı arama |
| Yakala-yeniden yakala | Birbirinden bağımsız yollarla yakalananların örtüşmesinden toplam sayıyı tahmin etme (yaban hayatı sayımından gelir) |
| Bilinen-öğe testi | Başka yoldan bulduğumuz gönderilerin kaçının sistemde olduğu |
| Tam akış (firehose), %10 örneklem akışı | X'in bütün herkese açık gönderileri; ya da bunların rastgele onda biri |
| Geri-test | Sistemi geçmiş bir olayda, o ana kadarki veriyi bilerek çalıştırıp ne yapacağını görme |
| Sıfır modeli | "Herhangi bir organizasyon olmasaydı" doğal kullanıcıların ne kadar benzer davranacağının ölçüsü |
| Karantina okuyucu | Gönderileri okuyan ama hiçbir işlem yapamayan yapay zekâ adımı |
| Kanarya | Ne zaman geleceğini bildiğimiz içerik; gelmezse sistem arızalı demektir |
| Kırmızı takım | Sistemi kandırmaya çalışan ekip |
| Regresyon seti | Her değişiklikten sonra çalıştırılan, eskisinden kötüleşme olup olmadığını gösteren sınama kümesi |
| CUSUM, EARS | Salgın gözetiminden gelen, "olağandışı artış"ı yakalama yöntemleri |
| Gömme | Metni anlamına göre sayılara çeviren yöntem; benzer anlamlı metinleri yakın gösterir |
| SRE | Sistemi ayakta tutan, kesintiye müdahale eden işletim mühendisi |
| Sıfır saklama (ZDR) | Yapay zekâ sağlayıcısının gönderilen veriyi hiç saklamaması |

---

## 13. Kullanıcıdan gereken kararlar

1. **Yol:** karma (C) + köprü çözüm onaylanıyor mu? (bölüm 6)
2. **Süre ve bütçe büyüklüğü:** 12–18 ay ve bölüm 7.3'teki büyüklükler kabul mü?
3. **Doğruluk hedefleri:** bölüm 2.1'deki günlük dille yazılmış hedefler uygun mu? Hangisi sizin için pazarlık konusu değil?
4. **Siyasi danışanlar:** olacak mı? (X'in hassas olay yasağı ve KVKK özel nitelikli veri kuralları ek kısıt getirir.)
5. **Nöbetçi analistler:** kendi ekibiniz mi, dış hizmet mi, karışık mı? (Dış hizmette çıkar çatışması maddesi gerekir.)
6. **Geçmiş olaylar:** ölçü aleti için hatırladığınız, sonucunu bildiğiniz 10 büyük Türkiye olayı.
7. **İlk danışanlar:** gölge işletimde hangi 4–6 danışan?
8. **Bağımsız teknik danışman:** kapı kararlarında size yardım edecek bir danışman istiyor musunuz? (Önerilir.)
9. **Nabız ve Pusula:** Nabız köprü dönemde X sayımı için kalsın mı; Pusula'nın alan modeli Rasat'a temel olsun mu?
10. **X'in yanıtı kısmi gelirse:** bölüm 4.3b'deki "en temkinli yorum" sütunu kabul mü?

---

## 14. Denetim izi: D-DENETIM bulgularının karşılığı

| No | Önem | Karşılık (bölüm) |
|---|---|---|
| 1 | Kritik | Barındırma Türkiye'de, röle seçeneği, aktarım envanteri, bildirim içeriği kişisel veri taşımaz, geliştirme kimliksiz veriyle (3.9, 4.3a) |
| 2 | Kritik | Hedef/taban ayrımı, 4 haftalık portföy penceresi, örnek sayıları tablosu, 40 olay havuzu, ön/kesin kabul, ardışık izleme ve çoklu karşılaştırma (2.1–2.4) |
| 3 | Yüksek | Üç bağımsız yakalama yolu, bağımlılığı hesaba katan tahminci, satıcı yalnız yedek (2.2, 3.2) |
| 4 | Yüksek | Kanal × içerik türü paydası, metinsiz medya kör nokta, çelişkide düşük değer, geri-test kapsamı ayrı (2.2) |
| 5 | Yüksek | Hesap listesi X teyidine kadar kapalı; X'e yedi soru; yanıt→özellik tablosu; boykot, tüketici kuruluşu, GDPR (3.2, 4.3a–b) |
| 6 | Yüksek | Silme yayılımı tablosu, sağlayıcıda sıfır saklama ön koşulu, K9 tanımı, kimliksiz koordinasyon kanıtı (4.3c) |
| 7 | Yüksek | A0a/A0b ayrımı; gerçek veri A0a'dan sonra; bulut yolu imza + bildirim olmadan kapalı; kimliksiz geliştirme (8) |
| 8 | Yüksek | Tek aşama şablonu; A6/A7 sayısal kapılar; kanarya ve yapay arıza; ölçen ≠ yapan (8, 3.2) |
| 9 | Yüksek | α bantları; A2 durma koşulu "kaynak seti değişir"; R4 indirgeme kuralı; tek hafta düşüşü yalnız inceleme (2.4, 8, 4.2) |
| 10 | Yüksek | Opak kimlik, yerleştirici, yapıştırılan içerik karantinada, genişletilmiş kırmızı takım, geliştirme kuralı (3.5, 3.9) |
| 11 | Yüksek | Takvim ve kritik yol, kadro, maliyet büyüklüğü, köprü çözüm (7, 6) |
| 12 | Yüksek | Kur/al/karma karşılaştırması; pazar cümleleri "bulunamadı" düzeyine indirildi (6, 1.2) |
| 13 | Yüksek | Kapasite modeli, öncelik ve kısma, iki ayrı zamanlılık, dış analist sözleşme maddeleri, A7 kriz tekrar oynatması (3.6, 8) |
| 14 | Yüksek | İnsan mühendislik lideri, proje yöneticisi, SRE, bağımsız teknik danışman, R17 (7.2, 10) |
| 15 | Yüksek | Olay müdahale planı, danışan bazında ayrım, sızma testi A8 öncesi (3.9, 8) |
| 16 | Orta | Harcama defteri ve ekranı, tavanlar, mutabakat (3.10, 3.7) |
| 17 | Orta | İki alarm serisi, "viral an", uyarı birleştirme, portföy yanlış alarmı (3.4) |
| 18 | Orta | Otomatik içerik payı ayrı sütun (3.3, 3.4) |
| 19 | Orta | Tek eğitim kuralı; düzeltme ve aktif öğrenme kapsamda; olumsuz senaryoda A4 hedefi (4.3b, 8) |
| 20 | Orta | Kodlayıcı üstünlüğü koşullu; A4'te karşılaştırma ve model yolu kararı (3.3, 8) |
| 21 | Orta | Kademe 3 hukuki görüşe bağlı; kaynak bazında yapay zekâya gitme kuralı; WhatsApp sorusu (4.1) |
| 22 | Orta | "TR'de görünmüyor" hukuki görüşe kadar yalnız sayım (4.3d) |
| 23 | Orta | Görüntüleme ve paylaşım politikası; satıcı sorusu (4.3d, 4.4) |
| 24 | Orta | KVKK yükümlülükleri ve yanıt→özellik tablosu; özel nitelikli çıkarım sınırı (4.3a, 3.3) |
| 25 | Orta | Bağımlılık tablosu ve kritik yol; altın set aday havuzu (7.1, 8) |
| 26 | Orta | Sözle nicelik yasağı; haftalık ≥ 200 cümlelik insan örneği (3.5) |
| 27 | Orta | Altın set yalnız insan; sistemin model ailesi ölçüme katkı vermez (2.3, 3.6) |
| 28 | Orta | Etiketleme yükü hesabı; portföy düzeyi; aktif öğrenme örneği ölçümden ayrı (7.2, 3.6) |
| 29 | Orta | Çıkış planı soruları; sağlayıcı değişimi regresyondan geçer; yapay zekâ bozulmuş modu (4.4, 3.8, 3.5) |
| 30 | Orta | Taslak kabul ölçütü; olay sonrası kayıt (8 A6, 3.6) |
| 31 | Orta | "Kamuya hiç" kuralı; alternatif açıklamalar; p < 0,01 (1.4, 3.4) |
| 32 | Orta | Sözlük, günlük dille hedefler, karar özeti, genişletilmiş kararlar (12, 2.1, 0, 13) |
| 33 | Orta | Kullanıcı ve analist eğitimi; rapordaki zorunlu güven ve kapsam bölümü (8 A7, 3.7) |
| 34 | Düşük | N5 anlatı kimliğine ve anlatı metriklerine bağlandı (5, 2.1) |
| 35 | Düşük | Kod incelemesi A8 öncesi (8) |
| 36 | Düşük | Varsayımlar listesine eklendi (11) |
| 37 | Düşük | Düzeltildi: kapsam düşüşünün olası nedenleri; "imzalanana kadar"; DHA/İHA; YouTube; silme kapsamı (3.2, 4.1, 4.3c) |
| 38 | Düşük | Kelime hata oranı, yorum tutarlılığı, anlatı metrikleri sözleşmede (2.1) |
| 39 | Düşük | R13–R17 eklendi; numaralar sıralandı (10) |
