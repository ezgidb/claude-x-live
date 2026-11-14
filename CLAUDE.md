# Nabız — Claude için çalışma yönergesi

Bu depo, bir iletişim danışmanının X'teki konuları üç aşamada incelediği yerel bir araçtır. Kullanıcı teknik değildir; onunla Türkçe ve sade konuş, komut çıktısını aynen yapıştırma, kendi yorumunla anlat.

## Üç aşama

1. **Tarama** — gönderi okumaz, yalnızca X sayım verisi. Çok ucuz. "Şu kelimelerde hareket var mı?"
2. **İnceleme planı** — yine yalnızca sayım. Dalganın başlangıcını, evrelerini ve hangi evreden kaç gönderi okunacağını çıkarır. Onay bekler.
3. **Hedefli çekim** — onaylanan plandaki gönderiler okunur; olayın seyri "gözlem günlüğü"ne yazılır. İstenirse canlı izlemeye alınır.

## Komutlar

Sunucu çalışıyor olmalı (`npm start`, http://localhost:4321). Sonra:

```bash
node src/cli.js durum
node src/cli.js tara "sarı torba" "#GS" @hesap      # hızlı tarama
node src/cli.js incele "sarı torba" --saat 3         # plan çıkar (gönderi okumaz)
node src/cli.js onayla <no> [--tam]                  # veriyi çek ve raporu yaz
node src/cli.js rapor <no> [--aralik 6h]
node src/cli.js canli <no> [--kapat]
node src/cli.js listeler | liste-tara <listeNo>
```

## Kurallar

- **Para harcayan adımda onay al.** `tara`, `incele`, `durum`, `rapor`, `plan` serbesttir (sent düzeyinde ya da ücretsiz). `onayla` ve `canli` gerçek harcama yapar: önce planı ve tahmini tutarı kullanıcıya göster, açık onayını al. Kullanıcı o oturumda "şu tutara kadar sormadan devam et" dediyse o sınırın altında sorma.
- **Kullanıcının önceliği doğruluk, ucuzluk değil.** Bilgi kaybı olmasın; ama gürültü de olmasın. Plan "dalga seçilen süreden önce başlamış" diyorsa daha geriye bakarak yeniden incelemeyi öner. Bir evre "temsilî" okunacaksa bunu ve neyi kaçırabileceğini söyle; kritikse `--tam` öner.
- **Yorumun dayanağını ayır.** Hacim, başlangıç saati, hız: sayım verisidir, kesindir. Hesaplar, alt başlıklar, öne çıkan gönderiler: okunan örnekleme dayanır; raporun "güven" satırını aktar. Örneklemden neden-sonuç çıkarma; "sürüklüyor" yerine "en çok etkileşim alan" de.
- **Raporu oku, sonra yorumla.** Kullanıcı senin perspektifini istiyor: ne oldu, nasıl büyüdü, kim başlattı, kim büyüttü, şimdi nerede, danışan için ne anlama geliyor, sırada neye bakılmalı. Gönderi metinlerini kısa alıntıla, toplu dökme.
- **Demo modunda** (durum çıktısı "DEMO veri" der) veriler uydurmadır; bunu her yanıtta belirt.
- X'e tarayıcıyla girip sayfa okuma (kazıma) yapma; kullanıcı bu yolu seçmedi ve hesap riski taşır.
- Token, veritabanı (`data/`) ve harcama tavanlarına kullanıcı istemedikçe dokunma.

## Geliştirme

Node ≥ 22.5, ek bağımlılık yok. `npm test` ile testler; `src/mock.js` demo verisini üretir. Mimari özeti README'de.
