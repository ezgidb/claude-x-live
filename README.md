# Nabız — X konu izleme ve danışmanlık paneli

X'teki konuları üç aşamada inceler:

1. **Tarama** — kelime, etiket ve hesap listelerinizde hareket var mı? Gönderi okumaz, yalnızca X'in sayım verisini kullanır; öğe başına yarım sent dolayındadır. İsterseniz nöbetçi olarak belirli aralıkla kendiliğinden çalışır ve hareketlenmede haber verir.
2. **İnceleme planı** — bir konu için "şu kadar saat geriye bak": olay ne zaman başlamış, nasıl hızlanmış. Dalgayı evrelere ayırır ve hangi evreden kaç gönderi okunacağını, tutarıyla birlikte önerir. Başlangıç evresi eksiksiz okunur; diğerleri zamana eşit yayılarak temsil edilir.
3. **Hedefli çekim ve izleme** — onayladığınız plan kadar veri çekilir; olayın seyri zaman damgalı notlarla yazılır (ilk paylaşanlar, yükselişi büyüten gönderi, büyük hesapların girişi, hız basamakları). İsterseniz konu canlı izlemeye alınır ve danışmanlık notu üretilir.

## Çalıştırma

Gereken tek şey [Node.js](https://nodejs.org) 22.5 ya da üstü. Kurulacak başka paket yok.

```bash
npm start
```

Ardından tarayıcıda <http://localhost:4321> adresini açın.

1. **Demo veriyle dene** — X'e bağlanmadan, uydurma veriyle bütün ekranları görürsünüz.
2. **X Bearer Token** girin (Ayarlar ve Bütçe) — gerçek veriye geçer. Token yalnızca bu bilgisayardaki `data/nabiz.db` dosyasında saklanır.
3. **Tarama** sayfasında bir liste oluşturup tarayın; hareket gördüğünüz öğede **İncele**'ye basın, planı onaylayın.

### Claude ile sohbet ederek kullanma

Bilgisayarınızda Claude (Claude Code ya da masaüstü uygulaması) bu klasörde açıkken yazıyla isteyebilirsiniz: *"sarı torba ve #GS'yi bir tara"*, *"sarı torbayı 3 saat geriden incele"*. Claude `src/cli.js` komutlarıyla aynı taramayı çalıştırır, raporu okur ve kendi yorumuyla anlatır; para harcayan adımlarda onayınızı ister. Kurallar `CLAUDE.md` dosyasındadır.

Testler: `npm test`

## Nasıl çalışır

| Katman | Dosya | Görev |
|---|---|---|
| X istemcisi | `src/xapi.js` | Sorgu kurma, X API v2 çağrıları, hata çevirisi, harcama defteri ve tavan denetimi |
| İzleme döngüsü | `src/monitor.js` | Geçmişi zamana yayılmış örneklemle getirir; sonra her aralıkta sayım + yeni gönderiler |
| Analiz | `src/analytics.js` | İvme puanı ve aşama, yükselen başlıklar, hesap sıralamaları, biçim/saat, öneri kartları |
| İzleme döngüsü (tarama) | `src/monitor.js` | Tarama listelerini yalnızca sayımla tarar; onaylanan planı uygular |
| Plan | `src/plan.js` | Sayım verisinden dalga evrelerini ve okunacak gönderi sayılarını çıkarır |
| Gözlem günlüğü | `src/journal.js` | Canlı izlemede değişenleri, incelemede olayın geçmişe dönük seyrini not olarak yazar |
| Komut satırı | `src/cli.js` | Claude'un (ya da sizin) taramayı ve incelemeyi yazıyla başlatması için |
| Not | `src/brief.js` | Danışmanlık notu metni |
| Sunucu | `src/server.js` | Arayüz, JSON API, canlı güncelleme |
| Veri | `src/store.js` | SQLite (Node'un yerleşik modülü) |
| Demo | `src/mock.js` | X yanıt biçiminde sentetik veri |
| Arayüz | `public/` | Çerçevesiz HTML/CSS/JS |

- **Hacim ve ivme** X'in *sayım* ucundan gelir: eksiksizdir ve ucuzdur (istek başına ücret).
- **İçerik ve hesap analizleri** çekilen gönderi *örnekleminden* hesaplanır; ekranda örneklem büyüklüğü ve güven düzeyi gösterilir.
- **Gözlem günlüğü** konu ekranının varsayılan görünümüdür: "hareketlenmeye başladı", "hızlanıyor", "zirveye ulaştı", "yeni alt başlık belirdi", "şu hesap öne çıkanlar arasına girdi", "şu gönderi hızla etkileşim topluyor" gibi notlar yalnızca bir şey değiştiğinde yazılır (yenileme başına en çok 3, saatte en çok 12 not). Önemli notlar tarayıcı bildirimi olarak da gelebilir.
- Analizlerin tamamı istatistiktir; yapay zekâ kullanılmaz (sonradan eklenebilecek biçimde ayrıdır).

## Maliyet ve güvenlik önlemleri

X API kullandıkça öde modelindedir. Varsayılan birim fiyatlar (Ayarlar'dan değiştirilebilir): gönderi 0,005 $, hesap 0,010 $, sayım isteği 0,005 $.

- Her izleme başlamadan önce tahmini maliyet gösterilir.
- Günlük (varsayılan 10 $) ve aylık (100 $) tavan aşılınca veri çekimi kendiliğinden durur.
- Canlı izlemeler, panel 30 dakikadır hiçbir tarayıcıda açık değilse veri çekmez. Nöbetçi tarama ise açtığınız sürece panel kapalıyken de sürer (yalnızca sayım).
- İnceleme planları onayınızla çekilir. Bir listede "başında değilken onaysız başlat" seçeneğini açarsanız, belirlediğiniz üst sınırın altındaki planlar kendiliğinden yürür.
- Uygulamanın gösterdiği tutar kendi tuttuğu **tahmindir**; kesin tutar X Geliştirici Konsolu'ndadır.
- 30 günden eski gönderiler yerel veritabanından silinir.

## İnternette barındırma (ileride)

Uygulama tek bir Node süreci ve tek bir SQLite dosyasıdır; herhangi bir sunucuya taşınabilir.

```bash
APP_PASSWORD=guclu-bir-parola X_BEARER_TOKEN=... PORT=8080 npm start
```

`APP_PASSWORD` verildiğinde sunucu dışarıya açılır ve tarayıcı parola sorar (kullanıcı adı önemsizdir). Mutlaka HTTPS arkasında çalıştırın ve `data/` klasörünü kalıcı diske koyun.

| Ortam değişkeni | Varsayılan | Açıklama |
|---|---|---|
| `PORT` | `4321` | Dinlenecek port |
| `HOST` | `127.0.0.1` | `APP_PASSWORD` varsa `0.0.0.0` |
| `APP_PASSWORD` | – | Parola koruması |
| `X_BEARER_TOKEN` | – | Token'ı arayüz yerine ortamdan verir |
| `DB_FILE` | `data/nabiz.db` | Veritabanı yolu |
