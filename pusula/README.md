# Pusula — danışan odaklı canlı gündem odası

Pusula, bir iletişim danışmanının danışanları hakkında sosyal medyada ne konuşulduğunu **canlı** izlemesi,
bir şey büyümeden fark etmesi ve danışana **ne yapması gerektiğini** söyleyebilmesi için tasarlandı.

Kök dizindeki Nabız'dan farkı: birim "anahtar kelime" değil **danışan**dır. Siz sorgu yazmazsınız;
Pusula sürekli dinler ve her danışan için şunları kendisi çıkarır:

| Ne | Nasıl |
|---|---|
| **Risk düzeyi** (yeşil / sarı / turuncu / kırmızı) | Hacim sapması, olumsuz pay, erişim, büyük hesap ve medya girişi, hassas konu eşleşmesi, çağrılar, koordinasyon. Her etken açıklamasıyla görünür. |
| **Anlatılar** | Konuşma tek bir yığın değildir: "ürün güvenliği iddiası", "boykot çağrısı", "alay", "video eski savunması" ayrı ayrı izlenir; hangisi doğuyor, hangisi sönüyor. |
| **Yayılım zinciri** | İlk paylaşan, sıçramayı getiren alıntı, büyük hesabın girişi, haberin çıkışı, başka platforma geçiş — saat saat. |
| **Aktörler** | Kaynak, yükseltici, köprü, medya, savunucu, şüpheli rolleriyle. |
| **Koordinasyon şüphesi** | Kısa sürede neredeyse aynı metni atan yeni hesap kümeleri. Kanıt değil, işarettir. |
| **Tahmin** | 1 ve 3 saat sonrası için beklenen hacim, yön ve dürüst bir güven düzeyi. |
| **Durum notu** | Ne oldu, nasıl büyüdü, kim başlattı, kim büyüttü, şimdi nerede, danışan için anlamı, sırada neye bakılmalı. |
| **Yanıt planı** | İzle / hazırlan / yanıtla / düzelt / üstlen; seçenekler, hazır metin taslakları, yapılmaması gerekenler, olası basın soruları. |
| **Pusula'ya sor** | "Kim başlattı?", "Şu an ne yapmalıyım?", "Ne zaman söner?" |

Kaynaklar: **X**, **haber** (Google Haberler) ve **Bluesky**. Yorum katmanı **Claude** ile çalışır; anahtar
girilmemişse yerel sözlük ve kurallarla da eksiksiz çalışır (daha kaba ama ücretsiz).

## Çalıştırma

Node.js 22.5 ya da üstü yeterli; kurulacak paket yok.

```bash
cd pusula
npm start          # http://localhost:4400
```

İlk açılışta **demo** modundadır: üç uydurma danışanlı, hızlandırılmış bir dünya canlı akar. Açılıştan birkaç
dakika sonra "Anadolu Süt" için bir kriz doğar ve büyümesini adım adım izlersiniz. Demo verisi tamamen uydurmadır.

Gerçek veriye geçmek için **Ayarlar**'dan modu "canlı" yapın ve danışanlarınızı ekleyin. Haber ve Bluesky anahtarsız
çalışır; X için Bearer Token, Claude yorumu için Anthropic API anahtarı gerekir. Anahtarlar yalnızca bu bilgisayardaki
`data/pusula.db` dosyasında saklanır. X çağrıları ücretlidir; günlük harcama tavanı vardır (varsayılan 10 $).

### Yazıyla kullanma

```bash
node src/cli.js durum
node src/cli.js rapor anadolu-sut
node src/cli.js olaylar
node src/cli.js sor anadolu-sut "şu an ne yapmalıyım?"
node src/cli.js ekle "Danışan Adı" "@hesap" "#etiket"
```

## Yapı

| Katman | Dosya | Görev |
|---|---|---|
| Motor | `src/engine.js` | Döngü: dinle → anlamlandır → analiz et → olay üret → not yaz → yayınla |
| Kaynaklar | `src/sources/` | `simulator` (demo dünyası), `x`, `haber`, `bluesky` |
| Veri | `src/store.js` | SQLite (Node'un yerleşik modülü) |
| Analiz | `src/analysis/` | Nabız, anlatılar, aktörler, yayılım, koordinasyon, tahmin, risk, olaylar — saf fonksiyonlar |
| Yorum | `src/ai/` | Claude ile ya da yerel: duruş/duygu, anlatı adları, durum notu, yanıt planı, soru-yanıt |
| Sunucu | `src/server.js` | JSON API + canlı akış (SSE) |
| Arayüz | `public/` | Çerçevesiz HTML/CSS/JS |
| Komut satırı | `src/cli.js` | Çalışan sunucuya yazıyla sorar |

Testler: `npm test`

## Dürüstlük notu

Hacim, hız ve saatler toplanan gönderilerden sayılır. Duruş, anlatı ve rol atamaları yorumdur; yanılabilir.
Pusula neden-sonuç iddia etmez ("şu hesap büyüttü" değil, "şu hesabın paylaşımının ardından hacim arttı").
Koordinasyon bulguları suçlama değil, bakılması gereken işaretlerdir.
