# Gereksinimler ve mevcut durum analizi

Yazan: lider. Kaynak: kullanıcıyla yapılan konuşmalar, `00-BRIEF.md`, `ZAYIFLIKLAR.md`, üç aracın kodu ve
belgeleri. Araştırma yapılmadan yazıldı; hedef değerler araştırma C'den sonra `PLAN.md`'de kesinleşir.

---

## 1. Kullanıcının işi: hangi kararları veriyor?

Araç bir "veri ekranı" değil, **danışmanın kararlarına girdi**dir. Kullanıcının gün içinde verdiği kararlar:

| Karar | Soru | Yanlış bilginin bedeli |
|---|---|---|
| **Fark etme** | "Danışanım hakkında olağandışı bir şey var mı?" | Kaçırılan erken sinyal → kriz büyüdükten sonra öğrenilir |
| **Anlama** | "Ne oluyor, kim başlattı, nasıl büyüdü, şimdi nerede?" | Yanlış teşhis → yanlış yanıt |
| **Tartma** | "Bu ciddi mi, sönecek mi, kimleri etkiliyor?" | Gereksiz panik ya da yersiz rahatlık |
| **Önerme** | "Danışan ne yapmalı, ne söylemeli, ne söylememeli?" | Kamuya açık hata; sözü geri alınamaz |
| **Raporlama** | "Danışana ne anlatacağım, neye dayanarak?" | Güven kaybı; yanlış kişiyi suçlama |
| **Öğrenme** | "Geçen sefer ne oldu, ne işe yaradı?" | Aynı hatanın tekrarı |

Buradan çıkan ilk tasarım ilkesi: **her çıktı, bir karara ne kadar güvenle dayanak olabileceğini söylemeli.**

## 2. İşlevsel gereksinimler

1. **Danışan dosyası:** ad, tür, dinlenecek ifadeler (yazım varyantları, lakaplar, ürünler, yöneticiler, kampanyalar,
   etiketler, resmî hesaplar), eşsesli dışlamalar, hassas konular, rakipler, geçmiş olaylar, kullanıcı notları.
2. **Kapsam:** Türkiye'de kamuoyunu etkileyen bütün kanallar — X, haber siteleri ve ajanslar, TV/radyo/basılı,
   Instagram, TikTok, YouTube, Facebook, Ekşi Sözlük ve şikâyet siteleri, Telegram kanalları, Bluesky, Threads,
   LinkedIn; görsel, ses ve video içeriği dahil. Erişilemeyen her kanal açıkça "kör nokta" olarak gösterilir.
3. **Canlı dinleme ve erken uyarı:** dakikalar düzeyinde gecikme; kullanıcı ekrana bakmasa da ulaşan bildirim.
4. **Anlama:** ilgililik, duruş, duygu, alay, iddia, çağrı, anlatı, aktör rolü, yayılım, koordinasyon işareti, risk.
5. **Geçmiş:** olayın başlangıcına kadar geri gidebilme; kapanmış olayların arşivi ve karşılaştırması.
6. **Yorum ve öneri:** durum notu, yanıt planı, taslaklar, basın soruları; her cümle dayanağıyla.
7. **Konuşarak çalışma:** öngörülmemiş sorulara yanıt; kalıcı izleme talimatı; kartlar ve pano.
8. **Düzeltme:** kullanıcı ya da analist yanlış okumayı düzeltebilir; düzeltme ölçülebilir biçimde sisteme döner.
9. **Raporlama:** danışana gönderilecek, dayanağı belli, dışa aktarılabilir rapor.

## 3. Kalite gereksinimleri (doğruluk tanımı)

Kullanıcı "en doğru bilgi" istiyor. Bu belirsiz bir hedef olarak kalırsa ölçülemez; ölçülemeyen şey iyileştirilemez.
Doğruluğu **altı ölçülebilir boyuta** ayırıyoruz:

| Boyut | Tanım | Nasıl ölçülür (ilk öneri) |
|---|---|---|
| **Kapsam (duyarlılık)** | İlgili içeriğin ne kadarı sisteme girdi? | Bağımsız geniş örneklemde elle bulunan ilgili içeriğin yüzde kaçını sistem yakaladı |
| **İlgililik (kesinlik)** | Sisteme girenin ne kadarı gerçekten danışanla ilgili? | Rastgele örneklemin elle denetimi |
| **Anlama doğruluğu** | Duruş, alay, anlatı, iddia doğru okunuyor mu? | Altın standart küme üzerinde sınıf bazında başarı; etiketleyiciler arası uyumla kıyas |
| **Çıkarım doğruluğu** | "İlk kaynak", "sıçrama", "koordinasyon", "risk" doğru mu? | Elle çözümlenmiş geçmiş olaylarda geriye dönük sınama |
| **Zamanlılık** | Olay ne kadar sürede fark ediliyor? | Geçmiş olaylarda "ilk ilgili gönderi → ilk uyarı" süresi |
| **Sunum dürüstlüğü** | Notlardaki her iddianın dayanağı var mı, güven düzeyi doğru mu? | Notlardan örneklenen cümlelerin kanıta karşı denetimi; kalibrasyon |

İkinci tasarım ilkesi: **bu altı boyutun her biri sürekli ölçülür ve kullanıcıya görünür.** "Bu hafta duruş
okumasının denetimde ölçülen başarısı %X" gibi.

## 4. Mevcut durum: zayıflıkların kök nedenleri

`ZAYIFLIKLAR.md`'deki 31 madde, tek tek düzeltilecek hatalar değil; birkaç yapısal kök nedenin belirtileridir.
Yeni sistem bu kök nedenlerden tasarlanmalı.

| Kök neden | Belirtileri | Neden oluştu |
|---|---|---|
| **K-1. Veri, maliyete göre toplanıyor** | N1, N4, P6, P7, P8, P15, ortak 2–3 | Nabız ve Pusula "çağrı başına para" varsayımıyla tasarlandı: çek az, örnekle, yeniden çekme |
| **K-2. Kapsam ölçülmüyor** | N1, N3, N4, P6, P7 | "Ne kaçırdık?" sorusunu soracak bir düzenek yok; sorgu tek kaynak ve doğrulanmıyor |
| **K-3. İlgililik ayrı bir adım değil** | N1, N5 | Eşleşen = ilgili varsayılıyor; eşsesli ayrımı yok |
| **K-4. Doğruyu bilen ölçüt yok** | P2, P3, P16, K8, ortak 5 | Altın standart veri yok; testler aynı ekibin kendi örnekleri; demo dünyası çözümle aynı tariften |
| **K-5. Anlama kaba ve kalibresiz** | N2, P3, P4, P13, P14, ortak 4 | Sözlük tabanlı; model "ne kadar emin" bilmiyor |
| **K-6. Çıkarım, ilişkiyi bulgu gibi sunuyor** | N4, P5, P11, P12, ortak 7 | Sezgisel kurallar (zamanlama, benzerlik) güven aralığı ve insan onayı olmadan sonuca dönüşüyor |
| **K-7. Zaman modeli zayıf** | P8, P9, P10 | Etkileşim donuk; taban mevsimselliksiz; tahmin basit eğim |
| **K-8. Akıcı anlatım hatayı gizliyor** | K2, K4, K9, P13 | Yorum katmanı dayanaksız cümle kurabiliyor; özet üstünden konuşuyor |
| **K-9. İzleyeni izleyen yok** | K5, Nabız'ın panel kapanınca durması, bildirim yokluğu | Sessiz arıza fark edilmiyor |
| **K-10. Güvenlik ve hukuk sonradan** | K6, ortak hukuki belirsizlik, düz metin anahtarlar | Hiçbir araç güvenlik ve uyum gözüyle tasarlanmadı |
| **K-11. İnsan yok** | P5, P12, P13, K7 | Tamamen otomatik; kritik çıktıyı onaylayacak uzman rolü tanımlı değil |

Üçüncü tasarım ilkesi: **otomasyon hızı ve kapsamı sağlar; kritik çıkarımlarda son söz, ölçülmüş güven ve
gerektiğinde insan analisttir.** Bütçe kısıt olmadığına göre insan analist bir zayıflık değil, bir tasarım öğesidir.

## 5. Mevcut araçlardan korunacaklar

| Varlık | Neden değerli |
|---|---|
| Nabız'ın "sayım ↔ örneklem" ayrımı ve güven satırı | Dürüst sunumun çekirdeği |
| Nabız'ın onay kapısı ve harcama defteri | Bütçe kısıt olmasa da şeffaflık ve kontrol |
| Pusula'nın veri biçimleri (Item, Enrichment, Snapshot, Event, Brief, Playbook) | Olgunlaşmış bir alan modeli |
| Pusula'nın analiz modülleri | Yöntemlerin ilk sürümü; ölçülerek değiştirilecek |
| Pusula'nın yanıt planı yaklaşımı (duruşlar, taslak, yapılmayacaklar, bekleme açıklaması) | Danışmanın asıl ürünü |
| Kule'nin yetenek + kapı + ajan mimarisi | Esnekliğin temeli |
| Pusula'nın simülatörü | Yalnızca yazılım testi için; **doğruluk ölçümü için kullanılmaz** |

## 6. Açık sorular (araştırmanın yanıtlaması beklenen)

1. X'in tam akışına (firehose) ya da tam arşivine ticari olarak erişilebilir mi, hangi koşulla? (B)
2. X içeriğini bir LLM sağlayıcısına göndermek sözleşmeye uygun mu? (B)
3. Instagram, TikTok, Ekşi Sözlük için meşru erişim yolu var mı, yoksa yalnızca lisanslı aracılar mı? (B)
4. KVKK açısından yurt dışındaki bir yapay zekâ hizmetine kişisel veri aktarımı nasıl düzenlenmeli? (B)
5. Piyasa liderleri kapsamı ve ilgililiği nasıl ölçüyor; nerede yetersiz kalıyorlar? (A)
6. Türkiye'de TV/radyo/basılı izleme için kim lisans veriyor? (A, B)
7. Türkçe duruş ve alay okumasında bugünkü en iyi ölçülmüş başarı ne? İnsan uyumu ne? (C)
8. Kapsamı (kaçırılan içerik oranını) ölçmenin pratik yöntemi ne? (C)
9. Koordinasyon tespitinde kabul edilebilir yanlış pozitif oranı ve sorumlu sunum nasıl? (C)
10. Gönderi içine yazılmış talimatlara karşı en güvenilir mimari ne? (C)
