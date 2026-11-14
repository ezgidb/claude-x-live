# Nabız — X konu izleme ve danışmanlık paneli

X'te seçtiğiniz konuları (kelime, etiket, ifade, hesap ya da tek bir gönderi) geriye dönük ve ardından belirli aralıklarla izler; konunun ne kadar hızlandığını, yükselen alt başlıkları, öne çıkan ve ulaşılabilir hesapları gösterir ve danışanınıza iletebileceğiniz bir **danışmanlık notu** üretir.

## Çalıştırma

Gereken tek şey [Node.js](https://nodejs.org) 22.5 ya da üstü. Kurulacak başka paket yok.

```bash
npm start
```

Ardından tarayıcıda <http://localhost:4321> adresini açın.

1. **Demo veriyle dene** — X'e bağlanmadan, uydurma veriyle bütün ekranları görürsünüz.
2. **X Bearer Token** girin (Ayarlar ve Bütçe) — gerçek veriye geçer. Token yalnızca bu bilgisayardaki `data/nabiz.db` dosyasında saklanır.
3. **Danışan** profilini doldurun, **Yeni izleme** ile bir konu ekleyin.

Testler: `npm test`

## Nasıl çalışır

| Katman | Dosya | Görev |
|---|---|---|
| X istemcisi | `src/xapi.js` | Sorgu kurma, X API v2 çağrıları, hata çevirisi, harcama defteri ve tavan denetimi |
| İzleme döngüsü | `src/monitor.js` | Geçmişi zamana yayılmış örneklemle getirir; sonra her aralıkta sayım + yeni gönderiler |
| Analiz | `src/analytics.js` | İvme puanı ve aşama, yükselen başlıklar, hesap sıralamaları, biçim/saat, öneri kartları |
| Not | `src/brief.js` | Danışmanlık notu metni |
| Sunucu | `src/server.js` | Arayüz, JSON API, canlı güncelleme |
| Veri | `src/store.js` | SQLite (Node'un yerleşik modülü) |
| Demo | `src/mock.js` | X yanıt biçiminde sentetik veri |
| Arayüz | `public/` | Çerçevesiz HTML/CSS/JS |

- **Hacim ve ivme** X'in *sayım* ucundan gelir: eksiksizdir ve ucuzdur (istek başına ücret).
- **İçerik ve hesap analizleri** çekilen gönderi *örnekleminden* hesaplanır; ekranda örneklem büyüklüğü ve güven düzeyi gösterilir.
- Analizlerin tamamı istatistiktir; yapay zekâ kullanılmaz (sonradan eklenebilecek biçimde ayrıdır).

## Maliyet ve güvenlik önlemleri

X API kullandıkça öde modelindedir. Varsayılan birim fiyatlar (Ayarlar'dan değiştirilebilir): gönderi 0,005 $, hesap 0,010 $, sayım isteği 0,005 $.

- Her izleme başlamadan önce tahmini maliyet gösterilir.
- Günlük (varsayılan 10 $) ve aylık (100 $) tavan aşılınca veri çekimi kendiliğinden durur.
- Panel 30 dakikadır hiçbir tarayıcıda açık değilse veri çekilmez.
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
