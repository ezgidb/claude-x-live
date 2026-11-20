# Rasat — yönetici özeti

*Danışanlarına iletişim danışmanlığı veren bir danışmanın X ve haber gündemini ölçülmüş doğrulukla izleyip yorumlaması
için hizmet altyapısı. Tarih: 20 Kasım 2026. Ayrıntı: `PLAN.md` (sürüm 4).*

---

## 1. Hangi sorunu çözüyoruz

Bir iletişim danışmanı danışanları için üç soruya hızlı ve güvenilir yanıt ister:
1. **Ne oluyor?** Danışan hakkında ne konuşuluyor, ne zaman başladı, nasıl büyüdü, şimdi nerede?
2. **Ne kadar eminiz?** Gördüğümüz tablo eksik mi, alakasız içerik mi karışmış, okuma doğru mu?
3. **Ne yapmalı?** Danışana ne önerilmeli, ne zaman?

Piyasadaki araçlar birinci soruyu yanıtlıyor ama ikincisini yanıtlamıyor. Araştırmamızda incelenen hiçbir satıcı
kendi kapsamını ve Türkçe okuma isabetini müşterinin verisinde ölçüp göstermiyordu. Örnek alınan rakip raporunda
(`E-FUTURE-BRIGHT.md`) ne doğruluk beyanı ne de KVKK açıklaması vardı.

Bizim önceki üç denememiz de (Nabız, Pusula, Kule) aynı açıkları taşıyordu:
- Kelimeye bağlıydılar.
- Kaçırılanı ölçmüyorlardı.
- Türkçeyi kaba okuyorlardı.
- Kendi sınavlarını kendileri hazırlıyorlardı.

## 2. Ne yaptık (süreç)

1. **Üç araştırma:** piyasa ve rakipler; veri erişimi ve hukuk; doğruluk yöntemleri.
2. **Gereksinim ve kök neden analizi:** 31 zayıflık 11 kök nedene indirildi.
3. **Tam ölçekli tasarım** (sürüm 3): bütçe sınırsız varsayımıyla.
4. **Bağımsız denetim:** 39 bulgu; ikisi kritik (istatistiksel olarak geçilemeyen kapılar, verinin hangi ülkede
   işleneceği). Hepsi karşılandı.
5. **Yalın uygulama planı** (sürüm 4): gerçek bütçe, en az insan, X + isteğe bağlı haber, siyasi danışanlar.
6. **Birincil kaynaktan doğrulama:** X'in fiyat ve kullanım kuralları kendi sayfalarından okundu.

## 3. Değer önerisi (danışanlara ne satıyorsunuz)

> **"Ne konuşulduğunu, ne kadar emin olduğumuzu ve ne yapmanız gerektiğini; erken, Türkçe'de ölçülmüş isabetle ve
> hukuka uygun biçimde söylüyoruz."**

- **Erken uyarı, danışanın kendi kurallarıyla:** "şu kelimeler şu hesaplarda geçerse", "hacim olağanın 3 katına
  çıkarsa", "trend kırılırsa" → telefona.
- **Ölçülmüş doğruluk:** her raporda kapsam, güven aralığı ve otomatik okumanın son ölçülen isabeti.
- **Türkçeye özgü okuma:** danışana özel kod kitabı; alay ve ima ayrı işaretlenir, zorla karara bağlanmaz.
- **Dayanaklı yorum:** her sayı hesaptan, her cümle kayda bağlı; "şu hesap büyüttü" gibi neden-sonuç iddiası yok.
- **Uyum beyanı:** "bireysel çıkarım yapılmadı, kullanıcı kimliği saklanmadı" — kurumsal ve siyasi danışanlar için
  rakiplerden ayıran güvence.
- **Öneri ve aksiyon sizde:** sistem taslak çıkarır, kararı siz verirsiniz.

## 4. Nasıl çalışır (algoritma, sade dille)

```
 ① TANIM ─► ② DİNLEME ─► ③ ALARM
                │
                ▼
           ④ OKUMA ⇄ ⑤ ÖĞRENME (insan + gerekçe)
                │
                ▼
           ⑥ ANALİZ ─► ⑦ YORUM ve RAPOR ─► siz: aksiyon
                │
           ⑧ ÖLÇÜM (her hafta: ne kadar doğru, ne kaçtı)
```

**① Tanım.** Danışan kelimeleri, hesapları, değerleri ve hassasiyetleri verir. Sistem yazım varyantlarını ve birlikte
geçen etiketleri önerir; her önerinin kaç gönderi eklediğini gösterir; siz onaylarsınız.

**② Dinleme, iki katman.**
- *Kesin katman:* her 15 dakikada X'ten sayım. Hacim ve trend buradan gelir, kesindir ve çok ucuzdur.
- *Okuma katmanı:* eşleşen gönderiler okunur. Normal dönemde **hepsi**; kriz anında zaman dilimlerine dengeli dağılmış
  bir örnek, artı kritik gönderilerin tamamı (danışana yanıtlar, kural eşleşmeleri, büyük hesaplar).
- En çok yayılan gönderiler, yeniden paylaşımlardan alınan küçük bir örnekte kendiliğinden öne çıkar; az okumayla
  bulunurlar.
- Haber ve ek belgeler isteğe bağlıdır.

**③ Alarm.** Duygudan bağımsız nicel kurallar:
- hacim sapması (günün saatine göre olağan düzeyden),
- trend kırılması,
- eşik,
- "hesap + kelime",
- kelime birlikteliği,
- yeni ifade belirmesi,
- büyük hesap girişi,
- haber geçişi.

Her kural kurulmadan önce geçmiş 30–90 günde denenir ("geçen ay kaç kez öterdi?").

**④ Okuma.** Her gönderi **iki farklı yoldan** okunur (hızlı model + ikinci bir yöntem): ilgili mi, duruş, konu, söylem
çerçevesi.

**⑤ Öğrenme ("%20 insan, %80 makine").**
1. İki okuma uyuşuyor ve güven yüksekse karar otomatiktir.
2. Uyuşmuyorsa gönderi etiketçiye gider. Etiketçi kararını ve **gerekçesini** saniyeler içinde seçer: "alay", "hedef
   başkası", "eşsesli", "haber aktarımı"…
3. Her insan kararı bir **örnek kütüphanesine** girer. Sistem benzer gönderilerde bu örnekleri ve gerekçeleri görerek
   okur. Model eğitilmez, bu yüzden X'in eğitim yasağına takılmaz; her öğrenme görünür ve geri alınabilir.
4. Gerekçeler haftalık kural önerilerine dönüşür; siz onaylarsınız.
5. Otomatik kararların küçük bir payı, etiketçiye sistemin kararı gösterilmeden gider. "%90 doğru" iddiası **yalnız bu
   ölçümden** gelir.
6. Eşik kendini ayarlar: doğruluk düşerse daha çok gönderi insana gider, kütüphane büyüdükçe daha az.

Beklenen seyir: başta insana giden pay %30–50, 2–3. ayda ~%20, olgun dönemde %5–10. Alay ve ima için bu hedef
büyük olasılıkla tutmaz; o gönderiler "belirsiz" diye ayrı gösterilir.

**⑥ Analiz.** Hepsi hesap katmanında üretilir; yapay zekâ sayı üretmez:
- olağan düzey ve sapma,
- anlatılar ve söylem çerçeveleri (siyasi konularda **kimliksiz**: etiket gönderiye konur, kişiye değil; kullanıcı
  kimliği saklanmaz),
- en çok yayılanlar ve etkileşimin zamanla değişimi,
- kamusal aktörlerin (siyasetçi, parti, medya, kurum) açıklamaları.

**⑦ Yorum ve rapor.** Durum notu ve öneri taslağı. Sayılar yer tutucuyla yazılır ve hesaptan doldurulur; denetimden
geçmeyen cümle yayımlanmaz. Gönderileri okuyan model hiçbir işlem yapamaz; böylece gönderilere gizlenmiş "talimat"lar
etkisiz kalır. Danışan raporunda zorunlu "kapsam, güven ve uyum" bölümü var.

**⑧ Ölçüm.** Her hafta kalite ekranı: otomatik kararların isabeti, tahmini kapsam, alarmların doğruluğu.

## 5. Maliyet (aylık, yaklaşık)

| Kalem | Tutar | Not |
|---|---|---|
| X verisi | 500–2.500 $ | Danışan karışımına bağlı; ulusal siyasi danışan en büyük kalem |
| Yapay zekâ | 150–300 $ | Sınıflama çok ucuz (300 bin gönderi ≈ 5–25 $); asıl kalem notlar ve konuşma |
| Sunucu (Türkiye) | 50–200 $ | |
| **Toplam (insan ve hukuk hariç)** | **~700–3.000 $** | Örnek: 5 danışan, biri ulusal siyasetçi ≈ 1.800–3.000 $ |

- Yeni bir danışanın maliyeti, teklif verilmeden önce geçmiş hacim sayımıyla birkaç dolara ölçülür.
- Kurumsal X paketi yalnız iki durumda gerekir: danışan bir kamu kurumuysa (X sözleşmesi zorunlu kılıyor) ya da aylık
  3 milyon gönderi okuma aşılırsa.

## 6. İnsan

| Kim | Ne kadar |
|---|---|
| Siz | Haftada ~3–5 saat + alarmlar; kriterler, öneri, aksiyon |
| Etiketçi / kalite sorumlusu | İlk 2–3 ay tam zamanlı, sonra günde 1–2 saat |
| Hukukçu | Kurulumda yoğun, sonra yılda bir |
| Teknik destek | Kurulumda yarı zamanlı, sonra çağrı üzerine (sunucu, anahtarlar, arıza) |

**7/24 nöbet:** tek bir koltuğu sürekli dolu tutmak 5–6 kişi demek; sizin ölçeğinizde gerekli değil. Makine 7/24
izler, kırmızı alarm telefonunuza gelir, gece alarmları "doğrulanmadı" etiketiyle gösterilir. Kriz haftalarında geçici
nöbet kurulur.

## 7. Siyasi danışanlar: çizgi nerede

X'in sözleşmesi (birincil kaynaktan okundu), yazılı onay olmadan **bireyleri siyasi eğilim ya da inanca göre
hedeflemeyi, gruplamayı ve profillemeyi** yasaklıyor. Ayrıca kullanıcı izlemeyi ve miting, protesto gibi hassas
olayların izlenmesini de yasaklıyor. KVKK'da siyasi düşünce özel nitelikli veridir. Etiketin adını değiştirmek ("solcu"
yerine "solcu deyim kullanan") sonucu değiştirmez: kimliği belli kişiler, çıkarılmış eğilimlerine göre gruplanmış olur.

**Serbest olan:** kişisel veri saklamayan **toplu analiz**. Bunun üstüne kurulan yollar:
1. **Söylem çerçevesi haritası (kimliksiz):** hangi dil, hangi kaygı, ne zaman yükseldi; olaylar arası karşılaştırma.
2. **Kamusal aktör defteri:** siyasetçi, parti, medya, kurum açıklamaları (X'e yazılı teyit sorulacak).
3. **Konu temelli iş birliği keşfi:** içerik üreticisi siyasi eğilimine değil konusuna göre seçilir; profil yalnız rızayla
   derinleşir.
4. **Platform reklam hedeflemesi:** kitleye ulaşmayı platform yapar, elinizde kişi listesi olmaz.
5. **Rızaya dayalı panel ve kendi kanallarınız:** kişi düzeyinde görüş gerektiğinde.
6. **X'ten yazılı onay:** belirli bir kullanım için başvuru.

Ayrıntı ve risk düzeyleri: `PLAN.md` bölüm 6.

## 8. Takvim

| Ay | Ne hazır |
|---|---|
| 0–1 | Hukuki görüş; danışan tanımları; hacim ve bütçe ölçümü |
| 2–3 | **Sayım + alarm ürünü** (ilk danışanlara satılabilir) |
| 3–5 | Okuma ve öğrenen etiketleme; ilgililik ve duruşta ölçülmüş ≥ %90 |
| 5–7 | Analiz, çerçeve haritası, danışan raporu; konuşarak sorgu |
| 7–9 | 2–3 danışanla pilot; hedefler 4 haftalık birikimle karşılanınca canlı |

## 9. Bilinen sınırlar
- X kamuoyunun tamamı değildir. Instagram, TikTok ve WhatsApp bu sürümde yok.
- Kapsam, kurumsal paket olmadan **dolaylı** ölçülür ve öyle yazılır.
- Alay ve ima en iyi yöntemle de hata üretir.
- Bir iddianın doğruluğunu sistem bilemez; yalnız ne kadar yayıldığını gösterir.
- Tek etiketçiyle iki kişi arasındaki uyum ölçülemez; kendi tutarlılık kontrolü ve danışman örneğiyle telafi edilir.
- KVKK'da yurt dışına aktarım yolu avukat görüşüne bağlı; görüş gelmeden gerçek veriyle çalışılmaz.

## 10. Sizden beklenenler
1. Aylık bütçe tavanı (~3.000 $ varsayıldı).
2. Pilot için 2–3 danışan.
3. Kamu kurumu danışanınız olacak mı?
4. Etiketçi adayı.
5. X'e yazılı teyit sorusu gönderilsin mi?
6. Hukukçuyla ilk görüşme.
