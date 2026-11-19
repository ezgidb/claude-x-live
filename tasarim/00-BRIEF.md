# Ortak brif — yeni nesil gündem ve itibar izleme sistemi

Bu dosya, tasarım sürecine katılan bütün ekiplerin (araştırma, tasarım, denetim) ortak başlangıç noktasıdır.
Önce bunu, sonra aşağıda adı geçen kaynak belgeleri okuyun.

## 1. Kullanıcı ve ne istediği

Kullanıcı bir **iletişim danışmanı**dır. Teknik değildir, Türkçe çalışır. Danışanları marka, kişi ve kurumlardır
(Türkiye ağırlıklı). Bir aracın ona şunları vermesini istiyor:

- Danışanı hakkında konuşulanı **canlı** görmek; bir şey büyümeden **erken** fark etmek.
- Bir olayın **ne olduğunu, nasıl büyüdüğünü, kimin başlattığını, kimin büyüttüğünü, şimdi nerede olduğunu**,
  danışan için **ne anlama geldiğini** ve **sırada neye bakılması gerektiğini** anlamak.
- Danışana **ne yapması gerektiğini** söyleyebilmek (duruş, seçenekler, taslak metinler).
- **Yapay zekâyla konuşarak** çalışmak: neye ihtiyacı olacağını önceden kestiremiyor, esnek bir araç istiyor.

Bu turdaki talebi (kendi sözleriyle özetlenmiş):
> Fiyat kaygısı olmadan, yapılabilirlik sınırları içinde, **en kapsamlı ve en doğru** bilgiyi en doğru biçimde
> veren bir sistem tasarlansın. Yapısal sorunlar, eksik ya da **yanlış ya da alakasız bilgi alınması** ve
> **doğru ve ilgili bilginin dışarıda bırakılması** engellensin. Piyasadaki çözüm ve yaklaşımlar öğrenilsin,
> mevcut durum analizi ve fizibilite yapılsın, plan adım adım ve her adım kontrol edilerek kurulsun.

Bunun anlamı:
- **Bütçe kısıt değildir.** Ücretli kurumsal veri lisansları, insan analistler, en yetenekli modeller seçenek
  olarak değerlendirilebilir. Ama "yapılabilir" olmalı: yasal, sözleşmeye uygun, gerçekten satın alınabilir.
- **Doğruluk iki yönlüdür:** hem *kesinlik* (alakasız ya da yanlış bilgi girmesin) hem *kapsam/duyarlılık*
  (ilgili bilgi dışarıda kalmasın). İkisi de ölçülebilir olmalı.
- **Demo/simülasyon kaygıları kapsam dışı**; tasarım gerçek dünya içindir.

Değişmeyen ilkeler (kullanıcının önceki tercihleri):
- Sayım ve yorum ayrılır: sayılar kesindir, yorum örnekleme dayanır ve öyle etiketlenir.
- Neden-sonuç uydurulmaz ("büyüttü" değil, "paylaşımının ardından hacim arttı").
- Koordinasyon/bot bulguları suçlama değil işarettir.
- Para harcayan adımlarda (bütçe kısıt olmasa da) şeffaflık: ne harcandığı görünür.
- X'e kişisel hesapla tarayıcı üzerinden kazıma yapılmaz (hesap riski; kullanıcı bu yolu seçmedi).
  Genel ilke: **sözleşmeye ve yasaya aykırı veri toplama tasarımın temeli olamaz**; lisanslı ve resmî yollar
  (kurumsal API'ler, lisanslı veri sağlayıcılar, ortaklıklar) değerlendirilir.

## 2. Mevcut durum (okunacak kaynaklar)

Depo: `/home/user/claude-x-live`

| Belge | İçerik |
|---|---|
| `CLAUDE.md`, `README.md` | **Nabız**: X sayım verisiyle tarama → inceleme planı → onaylı hedefli çekim. Tutumlu, yalnızca X, gönderiyi anlamıyor. |
| `pusula/README.md`, `pusula/DEVIR.md` | **Pusula**: danışan odaklı canlı gündem odası; anlatı, duruş, yayılım zinciri, aktör, koordinasyon, risk, tahmin, durum notu, yanıt planı. Yalnızca demo veride denendi. |
| `KULE-PLANI.md` | **Kule**: konuşarak yönetilen, "yetenek" tabanlı ajan mimarisi planı. Yazılmadı. |
| `ZAYIFLIKLAR.md` | Üç aracın zayıflıkları ve yanlış sonuç riskleri (N1–N6, P1–P16, K1–K9, ortak sınırlar, en tehlikeli beş). **Yeni tasarımın birincil girdisi budur.** |

## 3. Süreç

1. **Araştırma** (paralel): A) piyasa ve rakip yaklaşımlar, B) veri erişimi, hukuk ve fizibilite,
   C) doğruluk yöntemleri ve değerlendirme. Her ekip `tasarim/` altına kendi dosyasını yazar.
2. **Tasarım**: lider, bulguları birleştirip mimari, ekip yapısı ve aşamalı planı yazar (`tasarim/PLAN.md`).
3. **Denetim**: bağımsız bir ekip planı araştırma bulgularına ve zayıflık listesine karşı sınar; lider düzeltir.

## 4. Araştırma ekipleri için ortak kurallar

- Bugünün tarihi **19 Kasım 2026**. Modelin bilgisi eskidir; fiyat, API koşulları, ürün özellikleri ve yasal
  durum gibi değişen her bilgi için **web araması yapın** ve kaynağı (URL) yazın. Bulamadığınızı "doğrulanamadı"
  diye işaretleyin; tahmini doğrulanmış gibi yazmayın.
- Her önemli bulguya bir güven etiketi koyun: **[doğrulandı: kaynak]**, **[kısmen]**, **[doğrulanamadı]**.
- Satıcıların pazarlama iddialarını olgu gibi aktarmayın ("%95 doğruluk" gibi rakamları satıcı iddiası diye işaretleyin).
- Yazı dili Türkçe, sade; teknik terimin ilk geçtiği yerde kısa açıklama. Uzunluk: **en çok ~600 satır**,
  özlü olsun; en sonda "Tasarıma çıkarımlar" başlığı altında madde madde öneriler.
- Yalnızca kendi dosyanıza yazın. git commit yapmayın. Para harcayan ya da hesap açan hiçbir işlem yapmayın.
