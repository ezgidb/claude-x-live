# ARAŞTIRMA C — Doğruluk yöntemleri ve değerlendirme

Soru: "Alakasız ya da yanlış bilgi girmesin" (**kesinlik**) ve "ilgili bilgi dışarıda kalmasın"
(**kapsam/duyarlılık**) hedeflerini **ölçülebilir** biçimde sağlamak için bugünün en iyi yöntemleri neler;
Türkçe ve Türkiye bağlamında ne gerçekten işe yarıyor?

**Dayanak notu (önce okuyun).**
- Araştırma 19 Kasım 2026'da web aramasıyla yapıldı. Bu oturumda `arxiv.org` ve `link.springer.com` tam metin
  okumaya kapalıydı (ağ izni yok). Bu yüzden çoğu bulgu, kaynağın kendi özetinden ya da arama motorunun
  aktardığı parçadan alındı; tabloların tamamı okunamadı.
- Etiketler: **[doğrulandı: URL]** = birincil kaynağın özeti ya da sayfası iddiayı doğrudan söylüyor.
  **[kısmen]** = yalnızca ikincil aktarım var, ya da sayı tam metinden kontrol edilemedi, ya da hakemsiz
  2026 ön baskısı. **[doğrulanamadı]** = kaynak bulunamadı; bizim çıkarımımız.
- Satıcıların kendi ölçtüğü rakamlar "satıcı iddiası" diye ayrıca işaretlendi.
- "Eşik" önerileri (bölüm 10) literatürden hazır alınmış değerler değildir (Krippendorff α hariç);
  başlangıç değeridir ve ilk geriye dönük sınamadan sonra ayarlanmalıdır.

---

## 0. Özet — on madde

1. **Hiçbir sayı "konunun sayısı" değildir; sorgunun sayısıdır.** Bunu düzeltmenin bilinen tek yolu, kapsamı
   *ölçmektir*: rastgele örnekle "dışarıda kalanlar" denetimi (e-keşif dünyasındaki *elüzyon* testi),
   iki bağımsız toplayıcıyla yakala-yeniden yakala tahmini ve elle hazırlanmış "bilinen gönderi" listeleri.
   Kesinlik ucuz ölçülür, kapsam pahalı ölçülür; ikisi de raporda güven aralığıyla verilmelidir.
2. **"Geniş ağ + dar süzgeç" mimarisi** standart haline geldi: duyarlılığı yüksek, bilerek gürültülü bir
   toplama sorgusu; ardından ilgililik sınıflandırıcısı. Anahtar sözcük kümesinin temsilî olmaması sonucu
   bozar ve özellikle "çevredeki" katılımcıları kaçırır [doğrulandı: https://link.springer.com/article/10.1140/epjds/s13688-022-00343-9].
3. **Türkçe sınıflamada ince ayarlı Türkçe kodlayıcılar (BERTurk, TurkishBERTweet) hâlâ sıfır-örnekli büyük
   dil modellerini geçiyor**, özellikle "nötr" sınıfta ve nefret söyleminde. Büyük dil modeli (LLM) en iyi,
   belirsiz ve kritik örneklerde ikinci okuyucu ve etiket üreticisi olarak çalışıyor.
4. **LLM etiketi ≠ ölçüm.** LLM etiketleri %80–90 doğru olsa bile doğrudan sayılırsa oranlar yanlı çıkar;
   küçük bir insan "altın" örnekle düzeltme (DSL/PPI) yapılmalı [doğrulandı: https://proceedings.neurips.cc/paper_files/paper/2023/hash/d862f7f5445255090de13b825b880d59-Abstract.html].
   Modelin "eminim" demesi kalibre değildir; güven, altın sette ölçülerek verilmelidir.
5. **Alay/ironi Türkçede açık sorun.** Alaylı içerikte ince ayarlı modeller *kaçırıyor* (duyarlılık düşüyor),
   LLM'ler *fazla yakalıyor* (kesinlik düşüyor) [kısmen]. Çözüm değil, ölçüm ve insan incelemesi gerekir.
6. **Anlatı kümeleri kendiliğinden kararlı değildir.** Gömme tabanlı kümeleme (BERTopic vb.) zaman dilimleri
   arasında tutarsız ve çok sayıda küçük konu üretiyor; anlatıya kalıcı kimlik veren bir eşleştirme katmanı
   ve insan onaylı ad gerekir.
7. **"İlk kaynak" ve "kim büyüttü" sorularının kuramsal sınırı var.** API her yeniden paylaşımı kök gönderiye
   bağlar; gerçek zincir çıkarımdır. Kaynak tespiti bazı yayılım rejimlerinde kanıtlanmış biçimde imkânsızdır.
   Bunlar "çözülemez, yalnızca yönetilebilir" sınıfındadır.
8. **Koordinasyon tespitinin yanlış pozitifi yüksektir.** Bir çalışmada kötü niyetli koordinasyonun çoğunu
   yakalayan ayar, meşru koordineli etkinliğin %46'sını da işaretledi [doğrulandı: https://arxiv.org/abs/2005.13466].
   Botometer artık güncel veriyle çalışmıyor. Türkiye'de sahte trend oranı çok yüksek (bir dönem günlük ilk
   5 trendin en az %47'si) — yani hem tehdit gerçek hem de yanlış suçlama riski gerçek.
9. **Taban çizgisi gün içi ve hafta içi döngüyü içermeli** (STL ayrıştırması + medyan/MAD); halk sağlığı
   gözetimindeki alarm yöntemleri (EARS, CUSUM, Farrington) "yanlış alarm ↔ kaçırılan alarm" dengesini
   ölçmenin hazır çerçevesini veriyor.
10. **Konuşan ajan için güvenlik ve dayanak tasarımla sağlanır, istemle değil:** gönderileri okuyan model araç
    kullanamamalı (karantina/çift-LLM, CaMeL), her olgusal cümle bir kayda bağlanmalı, her sayı hesap
    katmanından gelmeli ve otomatik denetlenmeli. Değerlendirme, demo dünyasında değil, bağımsız ekibin
    elle hazırladığı geçmiş Türkiye olaylarıyla yapılmalı (Krippendorff α ≥ 0,80).

---

## 1. İlgililik ve kapsam (N1, N5, K3, K5)

### 1.1 Boolean sorgunun sınırı
- Anahtar sözcük sorgusu iki yönde hata yapar: eşsesli/kısa ifadelerle **ilgisizi alır**, yazım farkı,
  lakap, ima ve metinsiz medyayla **ilgiliyi kaçırır**. Kaçırılan içerik rastgele değildir: anahtar
  sözcükle toplama, konunun çevresindeki katılımcıları sistematik olarak dışarıda bırakır
  [doğrulandı: https://link.springer.com/article/10.1140/epjds/s13688-022-00343-9 — Bozarth & Budak 2022,
  beş genişletme yöntemi, beş toplumsal hareket].
- Bir sağlık çalışmasında anahtar sözcük süzgecinin kapsamı ideal koşulda %86, alınamayan mesajlar
  arşivlenemeyince %75 ölçüldü [doğrulandı: https://jmir.org/2016/2/e41/PDF]. Yani "iyi" bir sorgu bile
  ilgili içeriğin yaklaşık 7'de 1'ini kaçırabilir; bu sayı her konu için ayrıca ölçülmelidir.

### 1.2 Sorgu genişletme (duyarlılığı artırma)
En iyi uygulama, genişletmeyi **elle tek seferlik değil, döngüsel ve ölçümlü** yapmaktır:
- **Kaynak türleri:** eş anlamlılar; yazım varyantları; lakap ve hitaplar; ürün, alt marka, yönetici, sözcü
  adları; danışanın resmî hesapları ve bunlara yapılan bahsetmeler; birlikte geçen etiketlerin keşfi
  (eş-geçim analizi). Haber ve sosyal medya izleme karşılaştırmasında eş-geçim tabanlı genişletme anlamsal
  benzerlik tabanlıdan iyi çıktı [kısmen: https://www.dcs.gla.ac.uk/~graham/publications/icwsm2015_mcdonald.pdf
  ve aynı aramada Mahdabi & Popescu-Belis 2016].
- **Aktif anahtar sözcük seçimi:** sistem aday terimler önerir, insan birkaç örnek gönderiye bakarak kabul
  ya da red eder; hem ilgililik hem hacim artar [kısmen: https://arxiv.org/pdf/2209.11135.pdf — KeySelect].
- **Kriz sözlükleri** ilk saatlerde kapsamı artırmak için önceden hazırlanmış terim listeleri kullanır
  [kısmen: CrisisLex, https://ojs.aaai.org/index.php/ICWSM/article/download/14538/14387].

**Türkçe/Türkiye notları:**
- **Ekler.** Türkçe bilgi erişiminde sözcüğü ilk 5 harfte kesmek, biçimbilimsel çözümleyiciyle (lemmatizer)
  benzer başarı verir [doğrulandı: https://repository.bilkent.edu.tr/items/5be10741-6b40-44ba-b324-9e7951d54c03
  — Can vd. 2008, 408 bin belge]. Yani toplama tarafında ek varyantları üretmek ya da önek eşleştiren bir
  yerel süzgeç kullanmak gerekir. X aramasının ekli biçimleri (ör. "Telekom'un", "telekomun") nasıl
  eşleştirdiği **[doğrulanamadı]**; bilinen gönderilerle sınanmalı.
- **ASCII yazım ve harf dönüşümü:** ı/i, ş/s, ç/c, ğ/g, ö/o, ü/u karşılıkları; büyük "I/İ" dönüşümünde
  Türkçe yerel ayar (locale) kullanımı. Bunlar hem sorgu hem yerel süzgeç için zorunludur [doğrulanamadı:
  uygulama bilgisi].
- **Lakap, gönderme ve argo** sözlüğü danışan başına tutulmalı ve versiyonlanmalı (bkz. K7).

### 1.3 Varlık bağlama ve eşsesli ayrımı (kesinliği artırma)
- *Varlık bağlama (entity linking):* metindeki adın hangi gerçek varlığa (ör. Wikidata kaydına) karşılık
  geldiğini bulma. Tweet ölçeğinde Wikidata'ya bağlanmış en büyük kaynak TweetNERD (340 bin+ tweet, çok
  dilli) [doğrulandı: https://papers.neurips.cc/paper_files/paper/2022/file/09723c9f291f6056fd1885081859c186-Paper-Datasets_and_Benchmarks.pdf].
  Türkçe tweet için yalnızca küçük değerlendirme kümeleri var (Sabancı tezi, 2023)
  [kısmen: https://research.sabanciuniv.edu/id/eprint/48921].
- Pratikte işe yarayan: (a) danışana özgü **olumsuz terimler** (eşsesliyi dışlayan), (b) LLM'e "bu gönderi
  X şirketi hakkında mı?" sorusunu bağlam (yazar, bağlantı, alıntılanan gönderi) ile sorma, (c) yazarın
  geçmişi ve ağ bağlamı. Bunların her biri ilgililik sınıflandırıcısının özelliği olur, ayrı sorgu değil.

### 1.4 "Geniş ağ + ilgililik sınıflandırıcısı"
- Toplama sorgusu bilerek geniş tutulur (yüksek duyarlılık); ilgililik bir sınıflandırıcıyla verilir.
  Genişletmenin kesinlik maliyetini sınıflandırıcıyla geri kazanmak yaygın yaklaşımdır; ancak bu ikiliyi
  baştan sona ölçen sistematik bir karşılaştırma bulunamadı [kısmen: Bozarth & Budak 2022, yukarıda].
- Sınıflandırıcı katmanlı olmalı: hızlı Türkçe kodlayıcı → belirsizler için LLM → hâlâ belirsiz ve etkisi
  yüksek olanlar için insan. Eşik, ölçülen kesinlik/duyarlılık hedefine göre seçilir (bölüm 10).

### 1.5 Kaçırılanı (recall) tahmin etme
Literatürde dört olgun yöntem var; birbirini tamamlar:
1. **Elüzyon örneklemesi** (e-keşif/TAR dünyası): dışarıda bırakılan havuzdan rastgele örnek alınır, insan
   etiketler; "dışarıda kalan ilgili oranı" ve buradan kapsam güven aralığıyla hesaplanır. Güven aralığı
   veren durdurma kuralları var (QBCB) [doğrulandı: https://arxiv.org/abs/2108.12746]. Sınır: ilgili içerik
   seyrekleştikçe gereken örnek büyür [doğrulandı: aynı kaynak ve https://arxiv.org/abs/2106.09871].
   *Örnek hesap:* 1.500 gönderilik elüzyon örneğinde %0,5 oran, ±0,36 puan (95%) hassasiyetle ölçülür.
2. **Yakala-yeniden yakala (capture-recapture):** birbirinden bağımsız iki toplayıcı (ör. anahtar sözcük
   sorgusu ve hesap/ağ temelli toplama ya da iki farklı sınıflandırıcı) kullanılır; ikisinin ortak
   yakaladığı oran, toplam ilgili sayısını tahmin ettirir. İki "yeterince bağımsız" sınıflandırıcıyla
   anahtar sözcük süzgeçlerinin kapsamı yaklaşık 0,10 mutlak hatayla tahmin edildi
   [kısmen: Bommannavar, Kolcz, Rajaraman, IEEE Big Data 2014 — arama aktarımı]. Lincoln-Petersen/Chapman
   tahmincileri bağımsızlık bozulunca ciddi hata verebilir [kısmen: https://arxiv.org/pdf/1205.1150];
   Chao tahmincisi TAR'da iyi sonuç verdi [kısmen: https://arxiv.org/pdf/2404.01176].
3. **Bilinen-öğe (known-item) testi:** analistin başka yollarla (haber, ekran görüntüsü, el araması) bulduğu
   ilgili gönderiler listesi; sorgunun kaçını yakaladığı ölçülür. Ucuzdur, her olayda yapılabilir, ama
   analistin bulma yanlılığını taşır.
4. **Sürekli kapsam izleme:** her hafta ilgisiz sayılan ve sorgu dışı (ama geniş ağın içindeki) havuzdan
   küçük rastgele örnek; kapsamda düşüş, yeni lakap/etiket çıktığını gösterir → genişletme döngüsü.

**Bilinen sınırlar:** Metinsiz görsel/video hiçbir metin sorgusuyla yakalanmaz (bölüm 4). Silinen ve askıya
alınan hesapların gönderileri geriye dönük toplamada **rastgele olmayan** biçimde eksiktir; veri kalıcılığı
yanlılığı konuya göre değişir [kısmen: https://arxiv.org/pdf/2303.00902]. Örnekleme kaynaklı eksiklik de
rastgele değildir [kısmen: https://arxiv.org/pdf/2003.09557].

---

## 2. Türkçe dil anlama (N2, P3, ortak sınır 4)

### 2.1 Ölçülmüş başarılar (Türkçe)
| Görev / veri | Bulgu | Etiket |
|---|---|---|
| 3 sınıflı duygu, e-ticaret yorumu | İnce ayarlı BERTurk tüm istemle kullanılan LLM'leri geçti; LLM'ler ikili sınıflamada rekabetçi ama "nötr"ü olumlu/olumsuza yığıyor | [kısmen: https://arxiv.org/abs/2606.29614, Haz. 2026 ön baskı] |
| SentiTurca müşteri yorumu | GPT-4 Turbo 0,64 doğruluk / 0,63 F1; BERTurk 0,66 / 0,64 | [kısmen: https://arxiv.org/pdf/2512.22100] |
| Türkçe tweet nefret söylemi (SIU2023-NST) | Az-örnekli ChatGPT %65,8; ince ayarlı BERT %82,2 doğruluk | [doğrulandı: https://aclanthology.org/2024.case-1.6] |
| Siyasi duruş, 8.000 tweet (PoliStance-TR) | 3 etiketçi; eğitilmiş dönüştürücü makro-F1 0,82'ye kadar; Llama 3 sıfır-örnekli denendi | [doğrulandı: https://aclanthology.org/2025.ranlp-1.148] |
| Tek konuda duruş (sokak hayvanları yasası) | BERTurk-128k %87,1 doğruluk | [kısmen: https://doaj.org/article/a226e155578e40dba2425fca6de8941c] |
| Türkçe tweet ile ön eğitimli model | TurkishBERTweet: 894 milyon tweet, BERTurk'e yakın başarı, daha hızlı; MIT lisanslı | [doğrulandı: https://arxiv.org/abs/2311.18063] |
| Duygu araçlarının çapraz sınaması | İkili sınıflamada XLM-T 0,92, TurkishBERTweet 0,86, BERTurk 0,75 | [kısmen: https://arxiv.org/pdf/2412.05964] |
| Türkçe LLM değerlendirmesi (Cetvel, 33 açık model) | Türkçe odaklı ince ayarlı modeller, genel çok dilli modellerin gerisinde | [doğrulandı: https://aclanthology.org/2026.eacl-long.46] |
| İngilizce X duruşu, GPT-4 etiketçi | Sıfır/az-örnekli GPT-4, insan etiketiyle ince ayarlı en iyi modelleri geçemedi | [doğrulandı: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11326574/] |

Çıkarım: Türkçe için **"ya LLM ya kodlayıcı" değil, ikisi birlikte** kullanılmalı. Danışana özgü konu ve
duruş için birkaç yüz–birkaç bin altın etiketle ince ayar, sıfır-örnekli LLM'den güvenilir; LLM, hem bu
etiketleri hızlandırmak hem de belirsiz örnekleri okumak için kullanılır. En yeni ticari LLM'lerin Türkçe
duruşta ölçülmüş bağımsız sonucu bulunamadı **[doğrulanamadı]** — kendi altın setimizle ölçülmeli.

### 2.2 Alay ve ironi
- SarcasTraps (479 öğe): alay nefret söylemi tespitini belirgin bozuyor; ince ayarlı BERTurk/XLM-R alaylı
  nefreti **kaçırıyor** (duyarlılık kaybı), sıfır-örnekli GPT-4.1 ve Llama-3.3-70B duyarlılığı koruyor ama
  **kesinlik** kaybediyor [kısmen: https://arxiv.org/pdf/2610.16957, Ekim 2026 ön baskı].
- Yanlış anlaşılan ironi derlemi: 3.000 tweet, üç etiketçi; uzak denetimle (kendiliğinden toplanan)
  etiketlerin yetersiz kaldığı belirtiliyor [doğrulandı: https://aclanthology.org/2026.lrec-1.879/].
- SarcasTürk (Ekşi Sözlük, 1.515 girdi): başlık bağlamıyla BERTurk 0,76 doğruluk
  [doğrulandı: https://aclanthology.org/2026.sigturk-1.6].
- Çıkarım: **bağlam** (yanıtlanan gönderi, başlık) alay tespitinde kritik; "alay" ayrı bir etiket olmalı ve
  altın sette ayrı ölçülmeli. P3'teki "ince alayda 5'te 1" gözlemi literatürle uyumlu bir zorluk.

### 2.3 LLM'i etiketleyici olarak kullanmak
- Olumlu: ChatGPT, tweet sınıflamada kitle işçilerinden yüksek uyum ve doğruluk verdi
  [doğrulandı: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10372638/ — Gilardi vd. 2023].
- Uyarılar: 27 sosyal bilim görevinde GPT-4 etiket kalitesi görevden göreve, hatta aynı veri içinde büyük
  değişti; insan etiketiyle doğrulama şart [kısmen: https://arxiv.org/pdf/2409.09467]. 37 görevin
  tekrarında, LLM yapılandırma seçimleri yüzünden vakaların %31–50'sinde yanlış bilimsel sonuca varıldı
  ("LLM hacking") [kısmen: https://arxiv.org/pdf/2509.08825v2]. "Sıcaklık 0" ayarında bile aynı girdide
  %10–15'e varan doğruluk oynaması ölçüldü [kısmen: https://arxiv.org/html/2408.04667v5].
- **Oran tahmini için düzeltme:** LLM ya da sınıflandırıcı etiketlerini sayıp oran vermek ("olumsuz pay
  %38") yanlıdır. İki aile çözüm var: (a) *DSL / PPI* — küçük, bilinen olasılıkla seçilmiş insan etiketli
  örnekle tahmini yansız hale getirir ve geçerli güven aralığı verir [doğrulandı: NeurIPS 2023 bağlantısı
  yukarıda]; (b) *nicemleme (quantification)* — "sınıfla ve say" yöntemi dağılım kayınca yanlıdır,
  karışıklık matrisiyle düzeltilmiş sayım (ACC/PACC) daha iyidir [kısmen: https://arxiv.org/pdf/2011.08091v3.pdf,
  araç: QuaPy https://arxiv.org/pdf/2106.11057].

### 2.4 Kalibrasyon ("eminim" demesinin anlamlı olması)
- LLM'lerin sözle ifade ettiği güven aşırı iyimser ve seyrek: bir modelde yalnızca 8 farklı güven değeri
  üretildi [kısmen: https://aclanthology.org/2026.findings-acl.1671.pdf]; beş ticari modelde %44'e varan
  kalibrasyon hatası [kısmen: https://aclanthology.org/2026.tacl-1.69.pdf]. Sözle verilen olasılıklara
  sıcaklık ölçekleme uygulamak kalibrasyonu iyileştiriyor [kısmen: https://arxiv.org/html/2410.06707v1].
- *Uyumlu tahmin (conformal prediction):* modelin çıktısını, kalibrasyon setinde ölçülen hata oranına göre
  "tek etiket / iki olası etiket / çekimser" olarak veren yöntem; dağılımdan bağımsız kapsam garantisi
  verir ama kalibrasyon verisi ile canlı verinin benzer olmasını varsayar [kısmen: https://arxiv.org/pdf/2305.18404.pdf].
- Çıkarım: kullanıcıya gösterilen güven **modelin sözü değil, altın sette ölçülmüş güvenilirlik eğrisi**
  olmalı; düşük güvenli öğeler "insan incelemesi bekliyor" kuyruğuna düşmeli.

---

## 3. Anlatı ve konu (N5, P4, P14)

### 3.1 Gömme tabanlı kümeleme
- *Gömme (embedding):* metni anlamı koruyan sayı vektörüne çevirme; yakın anlamlı gönderiler yakın düşer.
  BERTopic: gömme → boyut indirgeme → yoğunluk kümelemesi → sınıf tabanlı TF-IDF ile adlandırma
  [doğrulandı: https://arxiv.org/pdf/2203.05794].
- Ölçülmüş sorunlar: BERTopic kaliteli ama okunması zor **çok sayıda konu** üretiyor ve komşu zaman
  dilimleri arasında konular tutarsız [kısmen: https://arxiv.org/pdf/2508.00710]. Çevrimiçi (artımlı)
  kullanımda aynı belgenin yeniden çalıştırmada farklı konuya düşebildiği raporlandı
  [kısmen: https://github.com/MaartenGr/BERTopic/issues/946]. Bu, P4 (bölünme) ve P14 (ad donması)
  sorunlarının araç değişince kendiliğinden geçmeyeceğini gösterir.

### 3.2 Türkçe gömme modelleri
- TR-MTEB: 26 veri kümesi, 6 görev (sınıflama, kümeleme, erişim, benzerlik vb.), 34,2 milyon Türkçe cümle
  çiftiyle eğitilmiş iki Türkçe model [doğrulandı: https://aclanthology.org/2025.findings-emnlp.471].
- Çok dilli modeller (multilingual-e5, BGE-M3) Türkçe görevlerde birbirine yakın; görevden göreve biri öne
  geçiyor (ör. Türkçe köşe yazısı kümelemesinde 61,8 / 62,2) [kısmen: https://arxiv.org/pdf/2608.25768];
  bir başka çalışmada BGE-M3 "MTEB-Türkçe" ortalamasında en yükseklerden (62,9) [kısmen: https://arxiv.org/pdf/2601.16018].
- Çıkarım: model seçimi danışan verisinden alınmış küçük bir "aynı anlatı mı?" çift kümesiyle yapılmalı;
  genel tablo yeterli değil.

### 3.3 Kümeleri zaman içinde kararlı izlemek (öneri)
- Her pencerede yeniden kümele, sonra yeni kümeleri **kalıcı anlatı kimliklerine** eşleştir (merkez benzerliği
  + bire bir atama); eşleşmeyen = yeni anlatı adayı; iki kimliğin birleşmesi/bölünmesi kayda geçer.
- Ad, her pencerede yeniden önerilir; eski ad ile anlam farkı eşiği aşarsa "anlatı evrildi" notu çıkar (P14).
- "Payı %12" gibi oranlar, bölünme riski yüzünden **üst anlatı** düzeyinde de verilmeli (hiyerarşik birleştirme).
- Bu katmanın doğruluğu ölçülmeden kullanılmamalı: küme saflığı (her kümeden 20 gönderi insan denetimi) ve
  "aynı konu iki kümede mi" bölünme oranı (bölüm 10) **[doğrulanamadı: öneri]**.

### 3.4 İddia tespiti ve iddia eşleştirme
- *Kontrol edilmeye değerlik (check-worthiness):* CLEF CheckThat! 2021 ve 2022'de Türkçe tweet alt görevleri
  vardı; Türkçe'de TOBB ETÜ birinci, Sabancı ikinci oldu [doğrulandı: https://ceur-ws.org/Vol-2936/paper-28.pdf,
  https://ceur-ws.org/Vol-2936/paper-37.pdf].
- *Daha önce doğrulanmış iddia eşleştirme:* MultiClaim — 27 dilde 28 bin gönderi, 39 dilde 206 bin
  doğrulama, 31 bin eşleşme [doğrulandı: https://aclanthology.org/2023.emnlp-main.1027]. SemEval-2025
  Görev 7'de Türkçe "sürpriz dil" olarak sınandı; ölçüt success@10 (ilk 10 sonuçta doğru doğrulama var mı)
  [doğrulandı: https://arxiv.org/abs/2505.10740].
- **Türkiye'deki doğrulama kuruluşları:** Teyit (2016), Doğruluk Payı (2014; IFCN üyeliği 2023'te yenilendi),
  Doğrula (2021) IFCN başvuru kayıtlarında [doğrulandı: https://mail.ifcncodeofprinciples.poynter.org/application/public/teyit/E1A67123-7D9A-E70D-DB62-75FCD21729D8,
  https://mail.ifcncodeofprinciples.poynter.org/application/public/dogruluk-payi/CAEF7137-0A66-7713-2B8C-E639A9CF5CC5].
  Google Fact Check Claim Search API, ClaimReview işaretli doğrulamaları sorgulamaya izin veriyor
  [doğrulandı: https://developers.google.com/fact-check/tools/api/]. Bu kuruluşların ClaimReview yayıp
  yayımlamadığı ve içeriklerinin ticari kullanım koşulları **[doğrulanamadı]** — B ekibine ve doğrudan
  ortaklık görüşmesine bırakılmalı.
- Sınır: eşleştirme yalnızca "bu iddia daha önce doğrulanmış bir iddiaya benziyor" der; yeni iddianın
  doğruluğunu söylemez (ortak sınır 6).

---

## 4. Çoklu ortam (ortak sınır 2–3)

| İş | Durum | Etiket |
|---|---|---|
| Konuşmayı metne çevirme (Whisper) | Whisper-large-v3 Türkçede veri kümesine göre yaklaşık %7–14 kelime hata oranı (WER); LoRA ince ayarlı sürümlerde temel WER'ler %4,3–14,2 | [kısmen: https://huggingface.co/BuzzASR/turkish, https://mdpi-res.com/d_attachment/electronics/electronics-13-04227/article_deploy/electronics-13-04227.pdf] |
| Ticari ses-metin | ElevenLabs FLEURS'ta %3,1–3,8 WER; Soniox YouTube sesinde %8,9 (OpenAI %14,4) | satıcı iddiası [kısmen: https://elevenlabs.io/speech-to-text/turkish, https://soniox.com/media/SonioxSTTBenchmarks2025.pdf] |
| Görsel üzerindeki yazı (OCR) | Görsel-dil modelleri (GPT-4o, Qwen2.5-VL) klasik OCR'ı belirgin geçiyor; el yazısı herkes için zor; Türkçe karakterler ve ekler belirgin sorun değil | [kısmen: https://sciety.org/articles/activity/10.21203/rs.3.rs-7797886/v1] |
| Türkçe belge OCR ölçütü | OCRTurk: 180 belge, 7 model | [doğrulandı: https://aclanthology.org/2026.sigturk-1.16] |
| Logo tanıma | Açık sözlüklü dedektörler logoda zayıf (Grounding-DINO OVDEval logo 10,3); açık dünya logo tanıma yeni ve henüz olgun değil | [kısmen: https://arxiv.org/pdf/2504.07615, https://arxiv.org/html/2509.25811v1] |
| Yakın-kopya görsel | PDQ: 256 bit; ≤30 Hamming uzaklığı güvenli eşleşme, rastgele çiftlerde ~128 | [doğrulandı: https://arxiv.org/abs/1912.07745v1] |
| Yakın-kopya video | TMK+PDQF ve vPDQ; yalnızca görüntüye bakar, sesi dikkate almaz | [kısmen: https://arxiv.org/pdf/2401.02395] |

Çıkarımlar:
- Sosyal medya sesi (müzik, gürültü, argo, şive) kıyas setlerinden zordur; **kendi 1–2 saatlik etiketli
  Türkçe örneğimizle WER ölçülmeden** dökümler alıntı kaynağı olmamalı; alıntılar zaman damgasıyla
  orijinale bağlanmalı.
- Danışan logosu için genel dedektör yerine **danışanın kendi referans görselleriyle** hedefli eşleştirme
  (gömme benzerliği + insan onayı) daha güvenilir **[doğrulanamadı: öneri]**.
- PDQ kırpma/ayna/üstüne yazıya karşı sınırlı dayanıklıdır; görsel gömmeyle (CLIP türü) ikinci kontrol
  önerilir **[doğrulanamadı]**.
- Medyanın indirilip işlenmesinin sözleşmeye uygunluğu B ekibinin konusudur.

---

## 5. Yayılım ve etki (N4, P5, P6, P8, ortak sınır 7)

### 5.1 Yayılım ağacı
- X API'si her yeniden paylaşımı **kök gönderiye** bağlar; "kimin paylaşımından gördü" zinciri yoktur. Yaygın
  yöntem zaman + takip grafiğiyle çıkarımdır [doğrulandı: arama aktarımı, https://arxiv.org/pdf/2410.21554].
  Bu çıkarım "insanlar yalnızca takip ettiklerinden paylaşır" varsayar; algoritmik akış ve arama yüzünden
  bu varsayım yanlıştır ve ölçülen yayılım metriklerini bozar [kısmen: aynı kaynak]. Örtük akışlar
  eklendiğinde bir çalışmada ağaçlar ~24 kat yoğunlaştı [kısmen: https://www.mpi-sws.org/%7Egummadi/papers/imc102-tiago.pdf].
- Öneri: **gözlenen bağlar** (alıntı, yanıt, aynı bağlantı, açık bahsetme) "kesin", çıkarılan bağlar
  "olası" etiketiyle ayrı tutulur; yeniden paylaşım hacmi sayım uç noktasından (count) tam, ağaç
  örneklemden (P6).

### 5.2 "İlk kaynak"ın sınırı
- Kuramsal sonuç: ağaç ağlarda yayılım olasılığı düşükse kaynak **hiçbir yöntemle bulunamaz**; döngüler ve
  çoklu kaynak doğruluğu daha da düşürür [doğrulandı: https://proceedings.mlr.press/v216/berenbrink23a/berenbrink23a.pdf;
  kısmen: https://arxiv.org/pdf/2006.11913].
- Pratik sınır: silinen/askıya alınan gönderiler geriye dönük veride yok (bölüm 1.5); ayrıca bakılan pencere.
- Öneri (N4): "başlatan" yerine **"bu veride ve bu pencerede gözlenen en erken gönderi"**; otomatik
  **pencere genişletme testi** — aynı imza (terim, bağlantı, görsel özeti) pencereden önceki 24–72 saatte
  sayımda görünüyorsa "dalga daha önce başlamış olabilir" uyarısı.

### 5.3 Zamanlama ile nedensellik
- Gözlemsel veride "sonra arttı" nedensellik kanıtı değildir (ortak sınır 7). Daha güçlü ama yine
  gözlemsel araçlar: kesintili zaman serisi (bir paylaşımdan önceki eğilimin uzatılmasıyla karşılaştırma),
  Hawkes sürecinde "dış uyarım" ile "kendi kendini besleme" bileşenlerini ayırma
  [kısmen: https://arxiv.org/abs/1608.04862]. Bunlar "katkı tahmini" verir, "yüzünden" demez.
- Dil kuralı: "ardından", "en çok etkileşim alan", "hacim şu aralıkta arttı"; isim + nedensellik birlikte
  kullanılmaz (P5).

### 5.4 Viral tahminin gerçek başarısı
- SEISMIC (öz-uyarımlı nokta süreci): makul popüler tweet'lerde 1 saat gözlemden sonra son yeniden paylaşım
  sayısında ~%15, 10 dakikada ~%25 göreli hata [doğrulandı: https://arxiv.org/abs/1506.02594v1].
- Tavan: Twitter yayılım boyutunda en iyi modeller varyansın yarısından azını açıkladı; sınırsız veriyle
  bile belirgin bir öngörülebilirlik tavanı var [doğrulandı: https://arxiv.org/abs/1602.01013].
- "Büyümeye devam edecek mi?" gibi göreli sorular, son boyut tahmininden daha iyi yanıtlanabiliyor
  [kısmen: https://arxiv.org/pdf/1403.4608 — Cheng vd. 2014].
- Öneri (P10): tek tahmin kaynağı; "önümüzdeki 3 saatte iki katına çıkma olasılığı" türü soru; aralıklı
  sunum; geçmiş olaylarda kalibrasyon testi (söylenen %70'lerin ~%70'i gerçekleşiyor mu).

### 5.5 Etkileşim sayılarının donması (P8)
- Etkileşim, gönderi yaşına bağlıdır; sıralama "yaşa göre normalize" yapılmalı ve öne çıkan gönderilerin
  sayıları belirli aralıklarla yeniden çekilmelidir (anlık görüntü zaman damgasıyla saklanır)
  **[doğrulanamadı: öneri]**.

---

## 6. Koordineli davranış ve bot tespiti (P12, P5)

### 6.1 Yöntemler
- Ağ tabanlı, denetimsiz çerçeve: hesaplar "beklenmedik ölçüde benzer davranış" (eşzamanlı paylaşım, ortak
  URL, ortak etiket dizisi, metin benzerliği) üzerinden bağlanır, yoğun alt kümeler incelenir
  [doğrulandı: https://ojs.aaai.org/index.php/ICWSM/article/view/18075 — Pacheco vd. 2021].
- CooRnet: veri setine göre "olağandışı kısa" paylaşım aralığı hesaplar; rastlantıyı elemek için iki hesabın
  **en az N kez** birlikte davranmasını şart koşar [doğrulandı: https://spir.aoir.org/ojs/index.php/spir/article/download/12170/10455].
- 84 makalelik derleme: koordinasyon dört boyutta ele alınmalı — özgünlük, zarar, orkestrasyon, zaman
  [doğrulandı: https://arxiv.org/abs/2408.01257; dört boyut özeti kısmen].
- Pusula'daki mevcut yaklaşım (MinHash benzerlik 0,7, genç hesap payı, zaman sıkılığı; `pusula/src/analysis/coordination.js`)
  bu ailenin basit bir örneği; ancak **rastgele karıştırma ile beklenen eşzamanlılık (sıfır modeli)** ve
  tekrar şartı yok.

### 6.2 Ölçülmüş yanlış pozitifler ve sınırlar
- Koordinasyon ağlarından dezenformasyon sınıflandırıcısı: bilinen kampanyada F1 0,98, dağılım dışında
  0,71; kötü niyetliyi yüksek oranda yakalayan ayar meşru koordineli etkinliğin **%46'sını** yanlış
  işaretledi, meşruların çoğunu doğru bırakan ayar ise dezenformasyonun ~%25'ini kaçırdı. Gerçek olaylara
  tepki ve siyasi kurumların eşgüdümü doğal koordinasyon üretir [doğrulandı: https://arxiv.org/abs/2005.13466].
- Botometer X **arşiv modunda**, Haziran 2023 öncesi toplanmış veriye dayanıyor [doğrulandı:
  https://osome.iu.edu/research/blog/introducing-botometer-x]. Botometer puanları başka dilde isabetsiz ve
  eşikler zamanla oynak; çalışmalar farkında olmadan çok sayıda insanı bot sayabiliyor
  [doğrulandı: https://cyber.harvard.edu/publication/2020/false-positive-problem-automatic-bot-detection-social-science-research].
- LLM destekli botlar (fox8, 1.140 hesap): içerik sınıflandırıcıları insanlardan ayıramadı, **koordinasyon
  örüntüleri** yakaladı [doğrulandı: https://osome.iu.edu/research/blog/anatomy-of-an-ai-powered-malicious-social-botnet].
  Çıkarım: tek hesap "bot mu?" sorusu giderek yanıtlanamaz hale geliyor; grup davranışı daha sağlam işaret.

### 6.3 Türkiye bağlamı
- Türkiye'de Haziran–Eylül 2019'da günlük ilk 5 trendin **en az %47'si** "geçici astroturfing" (gönder-sil)
  saldırısıyla oluşturuldu; 19 bin sahte trend, 108 bin hesap (ele geçirilmiş hesaplar dahil)
  [doğrulandı: https://actu.epfl.ch/news/mass-scale-manipulation-of-twitter-trends-discov-2/].
  2015–2022 için 29 bin sahte trend, 212 bin bot; bazı günlerde trendlerin ≥%52'si
  [doğrulandı: https://ar5iv.labs.arxiv.org/html/2304.07907].
- Twitter'ın Haziran 2020 kaldırması: AKP gençlik koluna bağlanan ağ, ~37 milyon tweet; uydurma kimlikler,
  yeniden paylaşım halkaları ve **ele geçirilmiş hesaplar** (bazıları muhalif kişilerin) birlikte
  [doğrulandı: https://fsi.stanford.edu/node/20845; hesap sayısı 7.340 kısmen].
- Çıkarım: (a) trend verisi kendi başına "gündem" göstergesi değildir; (b) gönder-sil davranışı geriye
  dönük toplamada **görünmez** — yalnızca gerçek zamanlı toplama yakalar; (c) ele geçirilmiş hesap
  olgusu, hesap sahibini suçlamanın neden yanlış olabileceğinin somut örneğidir.

### 6.4 Platform tanımları ve sorumlu sunum
- Meta, "koordineli sahte davranış"ı (CIB) sahte hesaplar ve aldatıcı taktiklerle kamusal tartışmayı
  yönlendirme çabası olarak tanımlar; yabancı ve hükümet müdahalesi alt türlerdir
  [doğrulandı: https://transparency.meta.com/policies/community-standards/inauthentic-behavior].
  Tanımın özü **sahtelik + koordinasyon** birlikteliğidir; koordinasyon tek başına ihlal değildir.
  X'in güncel "platform manipülasyonu" tanımı bu çalışmada kontrol edilmedi **[doğrulanamadı]**.
- Sunum kuralları (öneri): (1) bulgu düzeyi "koordinasyon işareti / güçlü işaret", asla "bot saldırısı";
  (2) her işarette sıfır modeline göre ne kadar beklenmedik olduğu; (3) **alternatif açıklamalar** listesi
  (hayran grubu, kurum çalışanları, kampanya çağrısı, haber tepkisi); (4) hesap adı danışana yalnızca
  insan incelemesinden sonra ve gerekçeyle; kamuya hiç; (5) kanıt paketi (zaman çizelgesi, metin benzerlik
  örnekleri) rapora ek.

---

## 7. Taban çizgisi ve anomali (P7, P9, eksik: bildirim)

- Mevcut durum: Pusula'nın olağan düzeyi son 24 saatin saatlik medyanı + MAD (`pusula/src/analysis/pulse.js`);
  gün/saat etkisi yok (P9).
- **Mevsimsel ayrıştırma + sağlam istatistik:** STL ile gün içi ve haftalık döngü ayrılır, kalıntıya
  medyan/MAD tabanlı test (S-H-ESD) uygulanır; ortalama/standart sapma çok sayıda aykırı değerde bozulduğu
  için medyan/MAD tercih edilir [doğrulandı: https://arxiv.org/pdf/1704.07706, https://github.com/twitter/AnomalyDetection].
- **Halk sağlığı gözetiminden dersler** (alarm üretiminin en olgun alanı): EARS C1/C2/C3 duyarlılık %60/71/82;
  C3 özgüllük %95,4, mevsimsel CUSUM %82,5 duyarlılık ama %88,7 özgüllük [kısmen: https://wwwnc.cdc.gov/eid/article/11/2/04-0587];
  seri korelasyon yanlış alarmı şişirir [kısmen: https://www.cdc.gov/mmwr/preview/mmwrhtml/su5401a20.htm];
  yüksek özgüllükte (≥%90) Farrington Flexible en iyi denge [kısmen: https://research-portal.uea.ac.uk/en/publications/comparison-of-statistical-algorithms-for-daily-syndromic-surveill/].
  Ders: **duyarlılık ile yanlış alarm aynı anda seçilemez**; işletme noktası açıkça seçilmeli ve ölçülmeli.
- **Değişim noktası tespiti:** 37 seri, 14 algoritma, seri başına 5 insan etiketçili bağımsız bir kıyas
  seti var (TCPDBench) [doğrulandı: https://arxiv.org/abs/2003.06222v2]; algoritma seçimi kendi geçmiş
  olaylarımızla yapılmalı.
- **İlk gün (P7):** sayım verisiyle (gönderi okumadan) 7–28 günlük geçmiş taban doldurulur; yetersizse
  "ısınma dönemi" etiketi ve benzer danışan grubunun tabanı geçici kullanılır **[doğrulanamadı: öneri]**.
- **N2 için:** hacim alarmı ile "olumsuz-ağırlıklı hacim" alarmı ayrı seriler olmalı; övgü dalgası kırmızı
  alarm üretmemeli.
- Ölçütler: danışan başına haftalık yanlış alarm, tespit gecikmesi (dakika), olay yakalama oranı — geriye
  dönük sınamada (bölüm 9) ölçülür.

---

## 8. LLM ajan güvenliği ve dayanak (K2, K3, K4, K6, K9)

### 8.1 Dolaylı istem enjeksiyonu — ölçülmüş durum
- *Dolaylı istem enjeksiyonu:* modelin okuduğu üçüncü taraf metne (gönderi, haber) yazılmış talimatın modeli
  yönlendirmesi.
- AgentDojo (2024): dönemin en iyi ajanlarında saldırılar <%25 başarılı; ikincil saldırı dedektörüyle %8
  [doğrulandı: https://arxiv.org/html/2406.13352v1]. 13 öncü modelde açık yarışma: hepsi zayıf, başarı
  oranı %0,5'ten başlıyor [kısmen: https://arxiv.org/pdf/2603.15714]. Uyarlanabilir saldırılar, statik
  sınamada güçlü görünen savunmaları aşıyor [kısmen: https://arxiv.org/pdf/2606.15057]. Satıcıların
  metrikleri birbirine çevrilemez [kısmen: https://venturebeat.com/security/anthropic-browser-agent-hijacked-31-percent-before-safeguards-engaged].
- *Spotlighting* (dış metni işaretleme/kodlama): kendi test korpuslarında saldırı başarısını >%50'den <%2'ye
  indirdi (GPT ailesi) [doğrulandı: https://arxiv.org/abs/2403.14720v1]. Yardımcı ama garanti değil.
- **CaMeL** (DeepMind): kontrol akışını güvenilir istekten çıkarır, güvenilmeyen veriyi yetenek etiketleriyle
  izler; AgentDojo görevlerinin %77'sini **kanıtlanabilir güvenlikle** çözdü (savunmasız sistem %84)
  [doğrulandı: https://arxiv.org/abs/2503.18813].
- Altı tasarım deseni (eylem seçici, önce-planla-sonra-uygula, eşle-indirge, çift LLM, önce-kod-sonra-uygula,
  bağlam küçültme): ortak fikir, güvenilmeyen metni araç kullanan bileşenden yalıtmak
  [doğrulandı: https://arxiv.org/pdf/2506.08837, https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/].

**Bu sistem için öneri (K6):**
- **Karantinadaki okuyucu:** gönderi/haber metnini okuyan model hiçbir araç çağıramaz, kural kuramaz, para
  harcayamaz; yalnızca şema kısıtlı yapılandırılmış çıktı verir (etiket, gönderi kimliği, kısa alıntı).
- **Ayrıcalıklı planlayıcı** kullanıcıyla konuşur, araç seçer, ama ham gönderi metnini görmez; okuyucunun
  çıktısını "veri" olarak alır (eşle-indirge: gönderi başına ayrı okuma, bir gönderi diğerini etkileyemez).
- Taslak ve not metninde gönderiden gelen alıntılar tırnak içinde ve kaynak kimlikli; kırmızı takım seti
  Türkçe enjeksiyon örnekleri içerir ("önceki talimatları unut", gizli Unicode, görsel içi yazı).

### 8.2 Dayanak ve kaynak gösterme (K2, K4)
- Atıf kalitesi hâlâ sınırlı: bir kıyas setinde ilgili kaynağa atıf F1 en çok %58,9; ikili atıf doğrulamada
  ince ayarlı modeller ~%80 makro-F1 [kısmen: https://www.arxiv.org/abs/2506.07671, https://arxiv.org/pdf/2605.06635].
  Modeller doğru belgeyi buluyor ama tam kanıt aralığını işaretlemekte zorlanıyor [kısmen: https://arxiv.org/pdf/2606.07130].
- Çıkarım: atıf **modelin iyi niyetine bırakılmaz, makineyle denetlenir.** Her olgusal cümle bir kayda
  (gönderi kimliği, sayım sorgusu kimliği, hesap tablosu satırı) bağlanır; denetleyici (a) kimlik var mı,
  (b) alıntı birebir geçiyor mu, (c) cümlenin dayanak türü (sayım/örneklem/yorum) etiketli mi bakar.
  API düzeyinde alıntı aralığı döndüren atıf özellikleri bu işi kolaylaştırır (ör. Claude API'nin
  `citations` özelliği `cited_text` ve karakter aralığı döndürür) [doğrulandı: bu oturumdaki claude-api
  belgesi; yapılandırılmış çıktı ile aynı istekte kullanılamaz].
- **K4 ("veride yok" ile "özette yok"):** ajan ham veriye sorgu atabilen araçlara sahip olmalı; her özet
  kendi kapsamını taşır ("şu 1.200 gönderiden 300'ü okundu"); "bulunamadı" yanıtı hangi kapsamda
  arandığını söylemek zorunda.

### 8.3 Sayılar hesaptan gelsin (K2, K9)
- Bütün sayılar deterministik hesap katmanında üretilir; model metinde yer tutucu kullanır
  (`{{hacim_24s}}`); son metinde **her rakamın** hesap çıktısında karşılığı olup olmadığı otomatik
  denetlenir (eşleşmeyen sayı = yayın engeli) **[doğrulanamadı: tasarım önerisi]**.
- K9: aynı soru, aynı veri anlık görüntüsü ve kayıtlı sorgu ile sorulursa sayılar birebir aynı olmalı;
  yorum metni değişebilir (LLM "sıcaklık 0"da bile tekrarda değişiyor, bkz. 2.3). Günlük sabit bir
  "pano" anlık görüntüsü saklanır ve "dün ne demiştik" ona dayanır.
- K3: kullanıcının sorusu → çalıştırılan sorgu/araç çevirisi her yanıtta görünür ("şunu taradım: ...");
  izleme görevleri kurulurken geçmiş veride denenir (K5, bölüm 9.2).

---

## 9. Değerlendirme yöntemi (P1, P2, P16, K1, K7, K8, ortak sınır 5)

### 9.1 Altın standart veri kümesi
- **Kod kitabı** (her etiketin tanımı, sınır örnekleri, Türkçe alay/ima örnekleri) yazılır; her öğe en az iki
  bağımsız kişi tarafından etiketlenir, ayrılıklar üçüncü kişiyle uzlaştırılır (Gilardi vd.'nin veri
  hazırlığıyla aynı desen [doğrulandı: https://ar5iv.labs.arxiv.org/html/2303.15056]).
- **Uyum ölçütü:** Krippendorff α ≥ 0,800 güvenilir; 0,667–0,800 yalnızca temkinli sonuç; altı kullanılmaz;
  eşik, sonucun önemine göre önceden seçilir [doğrulandı: https://en.wikipedia.com/wiki/Krippendorff%27s_alpha,
  https://pmc.ncbi.nlm.nih.gov/articles/PMC6245899]. İki etiketçi ve nominal etikette Cohen κ da kullanılabilir.
- LLM bir "ek etiketçi" gibi ölçülür: LLM–insan uyumu, insan–insan uyumundan belirgin düşükse o görevde
  LLM tek başına kullanılmaz [doğrulanamadı: öneri; dayanağı 2.3'teki görevden göreve değişkenlik].
- Örnekleme: tabakalı (nadir sınıflar — alay, tehdit, boykot çağrısı — fazla örneklenir), **zaman bölmeli**
  (eğitim ve sınama farklı dönemlerden), danışan ve sektör çeşitli.
- Asgari boyut önerisi: sınıf başına ≥100 öğe; alay alt kümesi ≥200; kesinlik tahmini için ±5 puan
  hassasiyet ~385 öğe (p=0,5), p≈0,9 civarında ~140 öğe [hesap].

### 9.2 Geçmiş olaylarla geriye dönük sınama (backtest)
- Türkiye'den kamuya açık 5–10 geçmiş kriz seçilir (farklı tür: ürün, hizmet, söz, boykot, dezenformasyon).
  Bağımsız ekip her biri için **olay kronolojisi** yazar: gerçek başlangıç, ilk gözlenen gönderiler, dönüm
  noktaları, anlatılar, haber geçişleri, sonuç.
- Sistem o dönemin verisiyle "o anda yalnızca o ana kadarki veriyi bilerek" koşturulur (geleceğe sızma yok).
- Ölçülür: tespit gecikmesi, alarm yanlış/kaçırılan, başlangıç saatinin doğru pencerede olup olmadığı,
  anlatı kapsamı (kronolojideki anlatıların kaçı bulundu), rapordaki olgusal hata sayısı.
- **İzleme görevi sınaması (K5):** her yeni kural kurulurken "bu kural geçen ayki şu olayda tetiklenir
  miydi?" sorusu otomatik çalıştırılır; tetiklenmeyen kural "sessiz" diye işaretlenir.
- Sınır: silinen gönderiler ve veri kalıcılığı yanlılığı yüzünden geçmiş olay verisi canlıdan farklıdır
  (bölüm 1.5); geri-test başarısı canlı başarının üst sınırına yakın okunmalı.

### 9.3 Sürekli kalite izleme ve kayma (drift)
- Sosyal medya sınıflandırıcıları zamanla bozulur: kısa bir kriz içinde bile zamansal ayrımda BERT 4–6,5 F1
  puanı kaybetti [kısmen: https://arxiv.org/pdf/2104.08535]; duruş sınıflandırıcılarının başarısı
  eğitim–sınama arası süre uzadıkça düşer [kısmen: https://arxiv.org/pdf/2108.12476.pdf, https://arxiv.org/pdf/2405.13017].
- İzleme: her hafta danışan başına küçük rastgele örnek insan etiketi (kesinlik), elüzyon örneği (kapsam),
  sınıf dağılımı ve güven dağılımı kayması; LLM sürümü sabitlenir, sürüm değişimi tam regresyon setinden
  geçmeden canlıya alınmaz.

### 9.4 İnsan döngüde ve aktif öğrenme (K7)
- Belirsizliğe göre örneği insana ya da LLM'e yönlendiren aktif öğrenme, maliyeti düşürüp doğruluğu korudu
  [doğrulandı: https://aclanthology.org/2024.law-1.10]; LLM etiketleri insan etiketiyle doğrulanmadan
  kullanılmamalı [kısmen: https://arxiv.org/pdf/2409.09467].
- **Düzeltmelerin kalıcılaştırdığı hata (K7) için:** kullanıcı düzeltmesi modeli doğrudan değiştirmez;
  versiyonlu bir "örnek/kural kütüphanesine" kapsamıyla (danışan, olay, tarih) ve son kullanma tarihiyle
  girer; altın sette ve geri-testte etkisi ölçüldükten sonra etkinleşir; her etkin düzeltmenin kim/ne
  zaman/neden kaydı vardır **[doğrulanamadı: öneri]**.

### 9.5 Bağımsızlık (P2, P16, K8)
- Sınavı hazırlayan ile sistemi yazan ekip ayrılır; altın set ve kronolojiler sistem geliştiricilerinden
  gizli tutulur (kör sınama); demo dünyası yalnızca "yazılım çalışıyor mu" testi için kullanılır, isabet
  iddiası için kullanılmaz.

---

## 10. Doğruluk ölçüm çerçevesi (öneri)

Eşikler başlangıç değeridir; α dışındakiler literatürden doğrudan alınmamıştır. Her metrik **güven aralığıyla**
raporlanır; aralığın alt sınırı eşiğin altındaysa "karşılanmadı" sayılır.

| Katman | Metrik | Nasıl ölçülür | Başlangıç eşiği |
|---|---|---|---|
| Toplama — kesinlik | İlgili / toplanan | Danışan başına haftalık ~200 rastgele gönderi, insan etiketi | ≥ %90 (alt sınır ≥ %85) |
| Toplama — kapsam | İlgili toplanan / tüm ilgili | Elüzyon örneği + bilinen-öğe listesi + iki toplayıcıyla yakala-yeniden yakala | ≥ %85 tahmini kapsam; tek yöntem değil en az ikisi |
| İlgililik sınıflandırıcısı | Kesinlik, duyarlılık, F1 | Zaman bölmeli altın set | F1 ≥ 0,85 |
| Duruş/duygu | Makro-F1; sınıf başına duyarlılık | Altın set; alay alt kümesi ayrı | Makro-F1 ≥ 0,75; olumsuz sınıf duyarlılığı ≥ 0,85; alay alt kümesi ayrıca raporlanır |
| LLM etiketçi | Krippendorff α (LLM + insanlar) | Altın setin bir kısmı | α(LLM,insan) ≥ α(insan,insan) − 0,05; α(insan,insan) ≥ 0,80 |
| Oran tahmini ("olumsuz pay") | Mutlak hata; aralık kapsaması | DSL/PPI düzeltmesi, insan örneğiyle | ≤ 5 puan; %95 aralık gerçekte %95 kapsıyor |
| Kalibrasyon | Beklenen kalibrasyon hatası (ECE) | Güvenilirlik diyagramı, altın set | ECE ≤ 0,05 |
| Anlatı kümeleri | Saflık; bölünme oranı; ad uygunluğu | Kümeden 20 örnek insan denetimi; "aynı konu mu" çiftleri | Saflık ≥ %80; ana anlatının bölünmesi ≤ %10 |
| Alarm | Yanlış alarm/hafta; tespit gecikmesi; olay yakalama | Geri-test olayları + canlı kayıt | Kırmızı yanlış alarm ≤ 1/hafta/danışan; medyan gecikme ≤ 30 dk; yakalama ≥ %90 |
| Başlangıç/ilk kaynak | Kronolojideki gerçek başlangıcın pencerede olması | Geri-test kronolojisi | ≥ %90; değilse "daha önce başlamış olabilir" uyarısı çıktı mı (%100) |
| Yayılım bağları | "Kesin" etiketli bağların doğruluğu | Örnek bağların elle denetimi | ≥ %98 (yalnızca gözlenen bağlar kesin sayılır) |
| Koordinasyon işareti | Kesinlik (insan incelemesi); sıfır modeline göre anlamlılık | Her sunulan işaret incelenir | Kesinlik ≥ %90; p < 0,01; isimli sunum yalnız insan onayıyla |
| Tahmin | Kalibrasyon; aralık kapsaması | Geri-test | Söylenen %X olasılıklar ±10 puan içinde gerçekleşiyor |
| Rapor dayanağı | Olgusal cümlelerde atıf oranı; atıf doğruluğu; sayı eşleşmesi | Otomatik denetleyici + haftalık insan örneği | Atıf %100; atıf doğruluğu ≥ %95; sayı eşleşmesi %100 (otomatik engel) |
| İstem enjeksiyonu | Saldırı başarısı | Türkçe kırmızı takım seti (her sürümde) | Araç/kural/harcama değişikliği: 0; metin sapması ≤ %1 |
| Tutarlılık (K9) | Aynı soru, aynı anlık görüntü | 5 tekrar | Sayılar %100 aynı; yorum anlamsal uyumu ≥ 0,9 |
| Çoklu ortam | WER/CER; OCR karakter hatası | Kendi etiketli Türkçe örnekler | WER ≤ %15 değilse döküm "alıntı kaynağı" olamaz |

**Raporda nasıl görünmeli:** Her ekranda/notta "Dayanak" satırı: *Sayım (kesin)* / *Örneklem (n=…, güven
aralığı)* / *Model yorumu (ölçülmüş isabet: makro-F1 …, son ölçüm tarihi …)* / *Kapsam tahmini (…%)*.

---

## 11. Tasarıma çıkarımlar

Durum sütunu: **Karşılanır** = bilinen yöntemle ölçülebilir biçimde giderilebilir. **Yönetilebilir** =
azaltılabilir ve ölçülebilir ama tam giderilemez. **Çözülemez, yalnızca yönetilebilir** = yapısal/kuramsal
sınır; yalnızca görünür kılınır ve dil/süreçle sınırlanır.

### Nabız
| Kod | Karşılayan yöntem | Durum |
|---|---|---|
| N1 kelimeye bağlı | Geniş ağ + ilgililik sınıflandırıcısı (1.4); döngüsel genişletme: ek/ASCII varyantları, lakap, ürün/yönetici, etiket keşfi (1.2); eşsesli için varlık bağlama ve olumsuz terimler (1.3); kapsam ölçümü: elüzyon + bilinen-öğe + yakala-yeniden yakala (1.5); "sorgunun sayısı" etiketi kalır | Yönetilebilir (metinsiz medya kısmı: çözülemez, yalnızca yönetilebilir) |
| N2 duruş okumaz | Katmanlı duruş sınıflaması (2.1); olumsuz-ağırlıklı ayrı alarm serisi (7) | Karşılanır |
| N3 örneklem | Okuma kararını tabakalı örnekleme ile; oranlar DSL/PPI ile aralıklı (2.3); "en çok etkileşim" için sayım uç noktası + yeniden çekim (5.5) | Yönetilebilir |
| N4 başlangıç pencereye bağlı | "Gözlenen en erken" dili + otomatik pencere genişletme testi (5.2) | Çözülemez, yalnızca yönetilebilir (kaynak tespitinin kuramsal sınırı, silinmiş veri) |
| N5 alt başlık = sözcük sıklığı | Gömme kümeleme + kalıcı anlatı kimliği + saflık/bölünme ölçümü (3) | Yönetilebilir |
| N6 tutar tahmin | Gerçek kullanımın API'den okunması, tahmin–gerçek farkının izlenmesi (B ekibi) | Karşılanır |

### Pusula
| Kod | Karşılayan yöntem | Durum |
|---|---|---|
| P1 gerçek veriyle hiç çalışmadı | Kısa canlı pilot + geri-test (9.2) her aşamanın kapısı | Karşılanır |
| P2 kendi sınavı | Bağımsız ekip, kör altın set ve kronolojiler (9.5); eşikler geri-testte yeniden ayarlanır | Karşılanır |
| P3 kaba duruş, nötr şişmesi | İnce ayarlı Türkçe kodlayıcı + LLM + insan (2.1); nötr sınıf ayrı ölçülür; olumsuz pay düzeltilmiş tahmin (2.3) | Yönetilebilir (alay: kalıcı zorluk) |
| P4 anlatılar bölünüyor/yanlış adlanıyor | Kalıcı kimlik eşleştirme, üst anlatı düzeyi, insan onaylı ad (3.3) | Yönetilebilir |
| P5 "sıçrama" zamanlamaya dayalı | Dil kuralı; kesintili zaman serisi/Hawkes ile katkı tahmini; isim + nedensellik birlikte yok (5.3) | Çözülemez, yalnızca yönetilebilir (gözlemsel veri) |
| P6 yeniden paylaşım çekilmiyor | Toplam sayımdan, ağaç örneklemden; "kesin/olası" bağ ayrımı (5.1) | Karşılanır |
| P7 ilk gün eksik | Sayım verisiyle 7–28 gün geriye taban; ısınma etiketi (7) | Karşılanır |
| P8 etkileşim donuyor | Zaman damgalı yeniden çekim; yaşa göre normalize sıralama (5.5) | Karşılanır |
| P9 taban 24 saat | STL + medyan/MAD; alarm işletme noktası geri-testle (7) | Karşılanır |
| P10 tahmin–eğilim çelişkisi | Tek kaynak, göreli soru, aralık ve kalibrasyon testi (5.4) | Yönetilebilir (öngörülebilirlik tavanı) |
| P11 danışan hesabı "yükseltici" | Varlık rolü listesi (danışanın sahip olduğu hesaplar ayrı sınıf) (1.3) | Karşılanır |
| P12 koordinasyon iki yönde yanılır | Sıfır modeli, tekrar şartı, insan incelemesi, alternatif açıklamalar, isimsiz sunum (6) | Çözülemez, yalnızca yönetilebilir (meşru koordinasyon ile ayrım ölçülmüş biçimde zor) |
| P13 taslak olgudan habersiz | Taslaklar yalnızca "dayanak satırı" doğrulanmış olgulardan; iddia eşleştirme durumu; insan onayı (3.4, 8.2) | Yönetilebilir |
| P14 anlatı adı donuyor | Her pencerede ad önerisi + "anlatı evrildi" notu (3.3) | Karşılanır |
| P15 haber erişimi yok, Bluesky hesap türü yok | Lisanslı kitle verisi (B ekibi); yoksa "erişim bilinmiyor" açık etiketi | Yönetilebilir |
| P16 kod ikinci gözle okunmadı | Bağımsız kod incelemesi + bağımsız sınama seti (9.5) | Karşılanır |

### Kule
| Kod | Karşılayan yöntem | Durum |
|---|---|---|
| K1 hiç denenmedi | Aşamalı kurulum; her aşama bölüm 10 metrikleriyle geçiş kapısı | Karşılanır |
| K2 ikna edici yanlış | Dayanak satırı zorunlu; makineyle atıf ve sayı denetimi (8.2–8.3); ölçülmüş isabet raporda | Yönetilebilir (yanlış okuma azalır, sıfırlanmaz) |
| K3 yanlış araç/sorgu | Sorgu çevirisi her yanıtta görünür; kayıtlı sorgular; geri-test (8.3) | Yönetilebilir |
| K4 özet üstünden konuşur | Ham veriye sorgu atan araçlar; özet kapsam etiketi; "nerede arandı" zorunlu (8.2) | Karşılanır |
| K5 sessiz kaçıran görev | Kurulurken geçmiş olayda deneme; periyodik "hâlâ tetiklenir mi" sınaması; kapsam izleme (9.2, 1.5) | Karşılanır |
| K6 gönderi içi talimat | Karantina okuyucu / çift LLM / eşle-indirge; araç izinleri; Türkçe kırmızı takım seti (8.1) | Yönetilebilir (tasarımla güçlü; metin düzeyi sapma tam sıfırlanamaz) |
| K7 düzeltmeden öğrenme kalıcılaşır | Versiyonlu, kapsamlı, süreli düzeltme kütüphanesi; etkinleşmeden önce ölçüm (9.4) | Karşılanır |
| K8 değerlendirme demoda | Bağımsız altın set + geçmiş Türkiye olayları (9.1–9.2) | Karşılanır |
| K9 aynı soru farklı yanıt | Sayılar hesaptan ve anlık görüntüden; günlük sabit pano; tutarlılık testi (8.3) | Yönetilebilir (yorum metni değişebilir) |

### Ortak sınırlar
| No | Durum ve yönetim |
|---|---|
| 1. X kamuoyu değildir | **Çözülemez, yalnızca yönetilebilir:** her raporda "X'te yazanlar" çerçevesi; temsiliyet iddiası yok. |
| 2. Görünmeyen yerler | **Çözülemez, yalnızca yönetilebilir:** lisanslı çoklu platform verisi kapsamı genişletir (B/A ekipleri), ama kapalı gruplar ve yayınlar görünmez kalır; rapor görülen kaynakları listeler. |
| 3. X'in verdiğiyle sınırlı | **Çözülemez, yalnızca yönetilebilir:** gerçek zamanlı toplama silinen ve gönder-sil içeriğin bir kısmını yakalar (6.3); medya için çoklu ortam boru hattı (4). |
| 4. Türkçe zor | Yönetilebilir: katmanlı sınıflama, alay ayrı ölçüm, insan kuyruğu (2). |
| 5. Doğruyu bilen ölçüt yok | **Karşılanır:** altın set + kronolojili geri-test (9). En yüksek öncelikli iş budur. |
| 6. İddianın doğruluğunu bilmez | **Çözülemez, yalnızca yönetilebilir:** doğrulanmış iddia eşleştirme ve doğrulama kuruluşu bağlantısı (3.4); yeni iddia için "doğrulanmadı" etiketi. |
| 7. Zamanlama neden değildir | **Çözülemez, yalnızca yönetilebilir:** dil kuralı ve katkı tahmini; nedensel iddia yok (5.3). |

### Öncelik sırası (öneri)
1. Altın set + kod kitabı + 5–10 geçmiş Türkiye olayı kronolojisi (bağımsız ekip) — her şeyin ölçü aleti.
2. Geniş ağ + ilgililik sınıflandırıcısı + kapsam ölçümü (elüzyon, bilinen-öğe).
3. Katmanlı Türkçe duruş (ince ayarlı kodlayıcı + LLM + insan) ve düzeltilmiş oran tahmini.
4. Mevsimsel taban ve alarm işletme noktasının geri-testle seçimi.
5. Karantina okuyucu mimarisi, atıf/sayı denetleyicisi, kırmızı takım seti — konuşan katman bunlarsız açılmamalı.
6. Anlatı kimliği katmanı, koordinasyon için sıfır modeli ve sunum kuralları.
7. Çoklu ortam (ses, OCR, yakın-kopya) — kendi Türkçe örneklerimizde ölçüldükten sonra.
