# Devir brifi — yeni sohbet için

Bu brif, önceki sohbeti görmemiş bir okuyucu içindir. Yalnız son kararlar yazılıdır.

## 1. Kullanıcı ve ne istiyor
- **Kim:** bir iletişim danışmanı. Teknik değil. Onunla **Türkçe ve sade** konuşulacak; komut çıktısı yapıştırılmayacak.
- **İş modeli:** aracı satmayacak; danışanlarına (marka, kişi, kurum; **siyasi danışanlar da olacak**) **hizmet**
  satacak.
- **Kullanım biçimi:** danışanlar "ne oluyor" diye sıfırdan sormayacak. Kelimeleri, hesapları, değerleri ve
  hassasiyetleri kendileri verecek; sistem bunlara göre kurulacak.
- **Kapsam:** şimdilik yalnız **X**. **Haber** ve **ek belgeler** isteğe bağlı; kullanıcı isterse çalışır.
- **Bütçe:** önce "fiyat kaygısı yok" dedi, sonra X'in kurumsal paketini pahalı buldu ve makul bir sistem istedi.
  Mesajındaki "3000" rakamı **aylık ~3.000 $ tavan** diye varsayıldı; **kullanıcı henüz doğrulamadı.**
- **İnsan:** en az. Başlangıçta ve doğruluğu artırmak için **bir etiketçi** verebilir; bir **hukukçu** olacak. Veri
  toplama, takip, analiz ve çıktı yapay zekâda; kullanıcı aksiyon ve önerilerde yer almak istiyor.
- **Öğrenme:** sistem, insanın doğruladığı ~%20 veriden öğrenip kalan ~%80'de ≥ %90 doğrulukla karar verebilmeli; gerekiyorsa
  etiketleme sırasında gerekçe istemeli.
- **Alarm:** olumlu/olumsuz duyguya bağlı olmamalı. Nicel kurallar: hacim artışı, trend değişimi, "şu hesaplarda şu
  kelimeler geçerse" vb.
- **Hukuk tutumu:** bilgileri hukukçusuna soracak. Senden **gri alanda, hafif riskli ama kesin hukuka aykırı olmayan**
  yaklaşımlar istiyor; riski kendisi alıyor ("çakal bir yaklaşım").

## 2. Depo, dal, ortam
- Depo: `ezgidb/claude-x-live`. Çalışma dalı: `claude/gifted-dijkstra-qstcwt` (her şey buraya commit + push edildi).
  Kullanıcı istemedikçe PR açılmıyor.
- Bulut ortamı: `claude-x-live` (kişisel). İzinli alan adları: `docs.x.com`, `developer.x.com`, `business.x.com`,
  `www.kvkk.gov.tr`. **KVKK sitesi sertifika zinciri hatası veriyor**; TLS doğrulaması kapatılmadı, okunamadı.
- Bu oturumda paralel çalışan dört model ekibi kullanım kotasını defalarca tüketti. Aynı anda en çok 2–3 ekip çalıştırın.

## 3. Depoda ne var
| Yer | Ne |
|---|---|
| Kök: `CLAUDE.md`, `README.md`, `src/`, `public/` | **Nabız** — X sayım verisiyle tarama → inceleme planı → onaylı hedefli çekim. `npm start` → http://localhost:4321 |
| `pusula/` | **Pusula** — danışan odaklı canlı gündem odası (anlatı, duruş, yayılım, aktör, koordinasyon, risk, tahmin, durum notu, yanıt planı). Yalnız **demo/uydurma veride** çalıştı; `cd pusula && npm start` → http://localhost:4400; `npm test` 44/44. Devir notu: `pusula/DEVIR.md` |
| `KULE-PLANI.md` | **Kule** — konuşarak yönetilen, "yetenek + kapı + ajan" mimarisi planı (yazılmadı) |
| `ZAYIFLIKLAR.md` | Üç aracın zayıflıkları (N1–N6, P1–P16, K1–K9, ortak sınırlar, "en tehlikeli beş") |
| `tasarim/00-BRIEF.md` | Tasarım sürecinin ortak brifi |
| `tasarim/01-GEREKSINIM-MEVCUT.md` | Gereksinimler; doğruluğun 6 boyutu; 31 zayıflığın 11 kök nedeni |
| `tasarim/A-PAZAR.md` | Araştırma A: piyasa ve rakipler |
| `tasarim/B-VERI-HUKUK.md` | Araştırma B: veri erişimi, hukuk; avukata 15 soru (§5.6) |
| `tasarim/C-YONTEM.md` | Araştırma C: doğruluk yöntemleri ve ölçüm çerçevesi |
| `tasarim/D-DENETIM.md` | Sürüm 2 planın bağımsız denetimi (39 bulgu; sürüm 3'te karşılandı) |
| `tasarim/E-FUTURE-BRIGHT.md` | Kullanıcının paylaştığı rakip belgesinin çözümlemesi |
| `tasarim/F-GRI-ALAN.md` | **Gri alan yöntemleri**, risk düzeyleri, kırmızı çizgiler, avukata 8 soru |
| `tasarim/YONETICI-OZETI.md` | **Yönetici özeti** (önce bu okunmalı) |
| `tasarim/PLAN.md` | **Geçerli plan: sürüm 4 (yalın ve gerçekçi)** |
| `tasarim/arsiv/PLAN-v3-tam-olcek.md` | Bütçesiz tam ölçek plan; **geçersiz**, yalnız ayrıntı başvurusu |

Araştırmalar (A, B, C) dış sitelerin tam metnini okuyamadan, arama sonuçlarındaki alıntılarla yapıldı. Sonradan
X'in sayfaları birincil kaynaktan okundu (aşağıda).

## 4. Geçerli tasarım: Rasat (sürüm 4)
"Rasat" çalışma adı. Fark: her sayının yanında ne kadar eksiksiz ve doğru olduğunun **ölçülmüş** değeri.

**Akış:** ① tanım → ② dinleme → ③ alarm → ④ okuma ⇄ ⑤ öğrenme → ⑥ analiz → ⑦ yorum ve rapor → ⑧ haftalık ölçüm.
- **Tanım:** danışan kelime/hesap/değer verir; sistem yazım varyantı ve birlikte geçen etiket önerir, her önerinin
  kaç gönderi eklediğini sayımla gösterir; danışman onaylar. Tanım sürümlüdür.
- **Dinleme, iki katman:**
  - *Kesin katman:* her 15 dakikada sayım. Hacim ve trend buradan gelir; danışan başına ayda ~15–30 $.
  - *Okuma katmanı:* normal hacimde eşleşen gönderilerin %100'ü. Yüksek hacimde tabakalı örnek, artı kritik alt
    kümelerin tamamı.
  - En çok yayılanlar, yeniden paylaşım örneğinde en sık geçen özgün gönderilerden bulunur.
  - Etkileşim 1, 6 ve 24 saat sonra yeniden okunur.
  - Danışan başına aylık bütçe + kriz için taşma bütçesi.
  - Yeni danışanın maliyeti, teklif öncesinde 30–90 günlük sayımla ölçülür.
- **Alarm kural motoru (duygudan bağımsız):** hacim sapması, trend kırılması, eşik, hesap + kelime, kelime
  birlikteliği, yeni ifade, büyük hesap girişi, haber geçişi, çerçeve yükselişi. Her kural geçmiş 30–90 günde denenir.
  Miting/protesto izleme kuralları reddedilir. Hesap + kelime kuralları yalnız kurum, medya ve kamusal figür hesaplarında.
- **Öğrenen etiketleme ("%20 insan, %80 makine"):**
  1. Her gönderi iki yoldan okunur (Haiku + ikinci yöntem). Uyum ve güven yüksekse karar otomatik; değilse etiketçiye.
  2. Etiketçi karar + gerekçe seçer (≤ 10 sn). Bu **örnek kütüphanesine** girer; sistem benzer gönderilerde bu
     örneklere bakarak okur. Model eğitilmez, bu yüzden X'in eğitim yasağına takılmaz.
  3. Gerekçeler haftalık kural önerisine dönüşür.
  4. Otomatik kararların rastgele bir payı etiketçiye kör gider; "%90" iddiası yalnız bundan gelir. Eşik kendini ayarlar.
  - Beklenen seyir: insan payı başta %30–50, 2–3. ayda ~%20, olgun dönemde %5–10.
  - İlgililik ve kaba duruşta gerçekçi; alay ve imada değil. O gönderiler "belirsiz" diye ayrı gösterilir.
  - Tek etiketçi telafisi: kendi tutarlılık kontrolü, danışmanın haftalık ~30 örneği, ilk ~300 örnekte geçici ikinci
    etiketçi.
- **Kapsam (kurumsal paket olmadan dolaylı):** varyant katkısı, geniş sorgu örneği, yanıt/alıntı ağı, bilinen-öğe listesi.
- **Yapay zekâ:** sayılar hesaptan gelir, model yer tutucu yazar. Gönderiyi okuyan model işlem yapamaz, işlem yapan
  model gönderi metnini görmez.
- **KVKK aktarım yolları** (avukat seçecek): ① sözleşmeyle bulut (KVKK standart sözleşmesi + 5 iş günü içinde Kurul
  bildirimi + sıfır saklama); ② kişisel veriyi ayıklayarak bulut; ③ Türkiye'de açık ağırlıklı model. Öneri: avukat ①'i
  uygun bulursa ①+②, bulmazsa ②+③. **Karar verilmeden gerçek veriyle çalışılmaz.**
- **Aşamalar:** A0 hukuk ve hazırlık (2–4 hafta) · A1 sayım ve alarm (4–6) · A2 okuma ve öğrenen etiketleme (6–8) ·
  A3 analiz ve rapor (6–8) · A4 konuşan katman (4–6) · A5 pilot, 2–3 danışan (8).
  - Alarm ürünü 2–3. ayda kullanılabilir ve satılabilir; canlıya ~6–9 ay.
  - Yazılımı yapay zekâ yazar; kapıları etiketçi ve danışman ölçer.

## 5. Doğrulanmış olgular (birincil kaynak)
**X fiyatları** (https://docs.x.com/x-api/getting-started/pricing, 20.11.2026):
- Gönderi okuma 0,005 $ · hesap okuma 0,010 $ · takip/takipçi okuma 0,010 $.
- Sayım (son 7 gün) 0,005 $/istek · sayım (tam arşiv) 0,010 $/istek · kendi hesap verisi 0,001 $.
- Aylık tavan **3 milyon** gönderi okuma (Araştırma B'deki "2 milyon" yanlıştı).
- Aynı kaynak aynı UTC gününde bir kez ücretlenir.
- Kurumsal paket fiyatı yayımlanmıyor; ikincil kaynaklara göre ayda 42–50 bin $'dan başlıyor (**doğrulanmadı**).
- **Açık soru:** gönderiyle gelen yazar bilgisi ayrıca "hesap okuma" olarak ücretleniyor mu? A0'da küçük denemeyle
  ölçülecek.

**X kuralları** (https://docs.x.com/developer-terms/restricted-use-cases, https://docs.x.com/developer-terms/agreement,
https://docs.x.com/developer-guidelines):
- Kullanıcının siyasi eğilim ve inancını (ve sağlık, etnik köken, din vb.) türetmek, çıkarmak, saklamak yasak.
- **İstisna:** kullanıcı kimliği ya da kullanıcı adı **saklamayan toplu analiz serbest.**
- Sözleşmenin "User Protection" maddesi, X'in yazılı onayı olmadan şunları yasaklıyor: (a) gözetim, kullanıcıları
  araştırma/izleme; (c) protesto, miting, topluluk toplantısı izleme; (d) bireyleri siyasi eğilim gibi hassas bilgiye
  göre hedefleme, gruplama, profilleme.
- Bireysel profilleme ve psikografik gruplama yasak.
- X hesabını rıza olmadan X dışı kimlikle eşleştirmek yasak.
- X içeriğiyle "foundation or frontier model" eğitimi yasak (Grok hariç).
- **Government Use:** X içeriği ya da ondan türetilen bilgi bir **devlet kurumuna** sunulacaksa kurumsal paket zorunlu
  ve X'e bildirim gerekli. Parti ya da siyasetçinin kendisi kamu kurumu değil; belediye başkanlığı makamı kamu kurumu.
  Avukat netleştirecek.

**Yapay zekâ fiyatları** (milyon token, giriş/çıkış; toplu işte %50 indirim):
- Haiku 5.5: 0,10 $ / 0,50 $ — ilk okuma; 300 bin gönderi ≈ 3–6 $.
- Sonnet 5.5: 2 $ / 10 $ — ikinci görüş.
- Opus 5.5: 4 $ / 20 $ — notlar ve konuşma.
- Toplam yapay zekâ ayda ~150–300 $.
- Claude API'de işlem yeri yalnız "global" ya da "us"; sağlayıcının KVKK standart sözleşmesini imzaladığına dair kaynak
  bulunamadı.

**KVKK** (ikincil kaynaklar; avukat doğrulayacak):
- Siyasi düşünce özel nitelikli veridir.
- 7499 sonrası: "ilgili kişinin alenileştirdiği ve alenileştirme iradesine uygun" işleme şartı. "Kamuya açık bir yerde
  bulunması tek başına yeterli değildir."
- **28/1-b:** anonim hâle getirilerek araştırma, planlama, istatistik amaçlı işleme Kanun kapsamı dışında (doğrulandı;
  ama anonimleştirilmeden yapılan işleme Kanun'a tabi).
- **AYM 27.01.2026, 2020/32193:** Kurul'un "alenileştirme amacı dışında kullanım" cezasını kanunilik ilkesiyle iptal etti.
- **İlke kararı 2026/347:** rıza dışı dayanaklarda aydınlatma yine gerekli.
- 28/2'deki alenileştirilmiş veri için aydınlatma istisnası **doğrulanmadı.**

## 6. Maliyet ve insan (sürüm 4)
- **Örnek aylık maliyetler:** X 500–2.500 $ · yapay zekâ 150–300 $ · sunucu (Türkiye) 50–200 $.
  - 5 danışan, biri ulusal siyasetçi ≈ 1.800–3.000 $ (insan ve hukuk hariç).
  - Ulusal siyasetçi olmadan ≈ 500–1.000 $.
  - Ulusal siyasetçi günde 50.000–200.000 gönderiyle bütçenin ana belirleyicisi.
- **Kurumsal X paketi yalnız** şu durumlarda: kamu kurumu danışan, aylık 3 milyon okuma aşımı, doğrudan kapsam ölçümü
  ihtiyacı.
- **İnsan:**
  - Danışman (kullanıcı): haftada ~3–5 saat + alarmlar.
  - Etiketçi: ilk 2–3 ay tam zamanlı, sonra günde 1–2 saat.
  - Geçici ikinci etiketçi: 2–4 hafta (önerilir).
  - Hukukçu: kurulumda yoğun, sonra yılda bir.
  - Teknik destek: kurulumda yarı zamanlı, sonra çağrı üzerine.
- **7/24 nöbet:** 168 saat ÷ 40 ≈ 4,2; izinlerle 5–6 kişi. Kullanıcı için gerekli değil. Makine 7/24 izler; kırmızı
  alarm telefona gelir; gece alarmları "doğrulanmadı" etiketiyle; kriz haftalarında geçici nöbet.

## 7. Siyasi danışanlar ve gri alan (son hâli: `tasarim/F-GRI-ALAN.md`)
- **Kullanıcının fikri:** kişileri "solcu" demeden "solcu deyim kullanıyor" diye gruplayıp 5 olayda aynı kişi kümelerini
  bulmak.
  - Kişi düzeyinde etiket saklanırsa bu, X'in yasakladığı şeyin kendisidir.
  - Etiket **gönderiye** konup kişi saklanmazsa fark gerçektir. **Fark adda değil, neyin saklandığındadır.**
- **Future Bright değerlendirmesi (düzeltilmiş):**
  - Belge: Drive dosyası "HOI_Chobani_Hamdi_Ulukaya_Editable.pptx"
    (https://docs.google.com/presentation/d/1pZb3Jt_9J_pkpB2m6ijys4Wo-UT6qeKt/edit?usp=drivesdk&ouid=109971528329195405498&rtpof=true&sd=true).
  - İçerik: Chobani'nin Fenerbahçe sponsorluğuna tepki, Temmuz–Ekim 2025. 41.583 birey, 68.647 bağlantı, 596.754 veri
    noktası; 4 segment (etnik ve ideolojik çizgide); ~80 etkileyici adla listelenmiş; reklam hedeflemesine bağlanmış.
  - KVKK, rıza ya da kaynak hakkında hiçbir cümle yok. "Future Bright" adı belgede geçmiyor.
  - **Hüküm:** açıkça hukuka aykırı değil, savunma argümanları olan gri alan (28/1-b, AYM kararı, "etkileyici"
    çerçevesi, hedeflemenin platformda olması, şikâyet temelli denetim). Kullanıcının sezgisi doğru: segmentleme biçimi
    ve "etkileyici" çerçevesi riski düşürüyor. En zayıf noktalar: etnik segment ve mikro etkileyiciler.
- **Kanun ≠ sözleşme:** KVKK ihlali idari para cezası doğurur. X sözleşmesi ihlali hukuka aykırılık değil; sonucu API
  erişiminin kesilmesi (iş sürekliliği riski).
- **Gri alan yöntemleri** (risk: 🟢 yeşil, 🟡 sarı, 🟠 turuncu, 🔴 kırmızı):
  - **G1-A:** gönderileri söyleme göre kümele, yazarları kimliksiz say. KVKK 🟢–🟡, X 🟢–🟡.
  - **G1-B:** kişileri geçici (ör. 72 saat) segmentle, sonra sil. KVKK 🟡, X 🟠. X verisinde G1-A önerilir. En küçük
    grup ≥ 50.
  - **G2:** olaylar arası "aynı kitle mi?" sorusu, HyperLogLog türü sayım özetiyle. "Kaç kişi" yanıtlanır, "kimler"
    yanıtlanmaz. 🟡/🟡.
  - **G3:** ≥ 10 bin takipçi ya da doğrulanmış kurum/medya/siyasetçi/gazeteci için etkileyici haritası. "Siyasi eğilim"
    alanı yok; olaylarda kendi kullandığı çerçeveler var. 🟡/🟡; eşik düştükçe 🟠.
  - **G4:** hedeflemeyi platforma yaptır (X follower look-alike, anahtar kelime, ilgi). Siyasi reklamda sertifika
    gerekli; Türkiye'de izin durumu doğrulanmadı. KVKK 🟢.
  - **G5:** rıza hunisi (anket, etkinlik, bülten → açık rıza). 🟢.
  - **G6:** danışanın kendi kanalındaki etkileşimciler. 🟢–🟡.
  - **G7:** hassas segmenti lisanslı satıcıdan toplu çıktı olarak almak. 🟡.
  - **G8:** sözleşme mimarisi (rol dağılımı, tazmin, yazılı iç politika).
- **Danışan başına "uyum profili":** Standart (yeşil) / Genişletilmiş (sarı, kullanıcı açar, kayda geçer). Rapor uyum
  beyanı profile göre değişir.
- **Kırmızı çizgiler:**
  1. Kimlikle birlikte siyasi/etnik/dini etiket saklamak ve olaylar boyunca izlemek.
  2. Böyle bir listeyi reklam platformuna kişi listesi olarak yüklemek.
  3. Rıza olmadan X dışı kimlikle eşleştirmek.
  4. X'i kazımak (Ocak 2026 koşulları: 24 saatte 1 milyon gönderi başına 15.000 $ götürü tazminat).
  5. Miting/protesto izlemek.
- **Uygun yollar listesi** (`PLAN.md` §6.3): söylem çerçevesi haritası (kimliksiz), kamusal aktör defteri (X'e yazılı
  sorulacak), konu temelli iş birliği keşfi, platform reklam hedeflemesi, rızaya dayalı panel, "kimlerin takip ettiği"
  toplu yakınlık (gri, pahalı), X'ten yazılı onay.

## 8. Kullanıcının vermesi gereken kararlar
1. Aylık bütçe tavanı (~3.000 $ varsayıldı).
2. Pilot için 2–3 danışan; biri ulusal ölçekte siyasi mi?
3. Kamu kurumu danışanı (belediye, bakanlık) olacak mı?
4. Etiketçi adayı.
5. Kamusal aktör defteri için X'e yazılı soru gönderilsin mi?
6. Haber: ticari haber API'si mi, yalnız GDELT mi?
7. Hukukçuyla görüşme: `B-VERI-HUKUK.md` §5.6'daki 15 soru + `F-GRI-ALAN.md` §6'daki 8 soru.

## 9. Çalışma kuralları
- Kullanıcıyla Türkçe ve sade konuş; teknik terimi açıkla.
- Para harcayan adımda (X API, yapay zekâ API) önce tutarı söyle ve onay al.
- X'e tarayıcıyla girip kazıma yapma.
- Demo verisi kullanılırsa her yanıtta "uydurma" diye belirt.
- Token, veritabanı (`data/`) ve harcama tavanlarına kullanıcı istemedikçe dokunma.
- Sayım kesin, yorum örnekleme dayanır; neden-sonuç yazma ("büyüttü" değil, "paylaşımının ardından hacim arttı").
- Araştırma ve kararları depoya yaz ki tekrar araştırılıp token harcanmasın.
- Commit mesajlarına ve depoya model adı yazma.
