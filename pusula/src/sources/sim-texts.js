// Simülasyon metin bankası. Her şey uydurmadır: gerçek marka, kişi ya da hesap yoktur.
// Sözdizimi: "{a|b|}" → seçeneklerden biri (boş da olabilir). Aile = { o: açılış, b: gövde, e: ek cümle, c: kapanış, r: kısa yanıt }.

export const FIRST = ['Ayşe', 'Mehmet', 'Elif', 'Mustafa', 'Zeynep', 'Ahmet', 'Fatma', 'Emre', 'Merve', 'Burak', 'Selin', 'Can',
  'Derya', 'Oğuz', 'Gizem', 'Serkan', 'Büşra', 'Kerem', 'Esra', 'Tolga', 'İrem', 'Onur', 'Sibel', 'Volkan', 'Aslı', 'Barış',
  'Pınar', 'Hakan', 'Melis', 'Cem', 'Nur', 'Yusuf', 'Hande', 'Murat', 'Ceren', 'Ozan', 'Tuğba', 'Erdem', 'Şeyma', 'Kaan',
  'Gül', 'Umut', 'Damla', 'Sinan', 'Ebru', 'Tarık', 'Nazlı', 'Koray', 'Betül', 'Deniz', 'Hatice', 'Levent', 'Özge', 'Ferhat',
  'Sevgi', 'Alper', 'Dilek', 'Gökhan', 'Yasemin', 'Engin'];
export const LAST = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan',
  'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdoğdu', 'Güneş', 'Aksoy', 'Bulut', 'Tekin',
  'Yavuz', 'Güler', 'Uçar', 'Sarı', 'Keskin', 'Bozkurt', 'Türkmen', 'Acar', 'Ateş', 'Işık', 'Toprak', 'Sönmez', 'Ergin',
  'Altun', 'Bayram', 'Duman', 'Karaca', 'Tuna', 'Soylu', 'Erol', 'Akın', 'Yiğit', 'Çakır', 'Özer', 'Tan'];
export const NICK_A = ['uykusuz', 'cayci', 'kahveci', 'gezgin', 'sessiz', 'dalgin', 'kedili', 'yorgun', 'neseli', 'huysuz', 'meraklı',
  'sakin', 'telasli', 'kitapsever', 'bisikletli', 'balkon', 'mutfak', 'pazartesi', 'yagmurlu', 'mavi', 'limonlu', 'tuzlu',
  'eski', 'gece', 'sabahci', 'ucuncu', 'kayip', 'minik', 'koca', 'serseri'];
export const NICK_B = ['baykus', 'kedi', 'marti', 'yolcu', 'anne', 'baba', 'muhendis', 'ogretmen', 'defter', 'kalem', 'bulut', 'ruzgar',
  'simit', 'tost', 'cay', 'fincan', 'papatya', 'kaplumbaga', 'penguen', 'kirpi', 'serce', 'kavanoz', 'vapur', 'iskele',
  'sokak', 'pencere', 'gunluk', 'notlar', 'mucit', 'seyyah'];
export const NAME_EMOJI = ['', '', '', '', '', ' 🌿', ' ☕', ' 🐈', ' ✨', ' 🌙', ' 🇹🇷', ' 📚', ' 🌻', ' 🎧'];

// ---------------------------------------------------------------- Anadolu Süt
const A = {};

A.fiyat = {
  o: ['{Ya|Yahu|Abi} bu ne:', 'Markete girdim.', '{Bugün|Dün akşam|Sabah sabah} kasada şok:', 'Soruyorum:', 'Fişe baktım da.'],
  b: [
    "Anadolu Süt'ün litresi {yine|gene|bir kez daha} {zamlanmış|artmış}{, etiketi görünce şaşırdım|}",
    '1 litre Anadolu Süt {olmuş|olmuş mu sana} {52|54|56|58} lira',
    'anadolu süt tereyağına {zam gelmiş|yine zam}, {geçen ay|iki hafta önce} {daha ucuzdu|bu fiyat değildi}',
    'Anadolu Süt yoğurdun {gramajı|kabı} küçülmüş ama fiyat aynı{, fark etmedik sanıyorlar|}',
    'Süt almak lüks oldu, Anadolu Süt {bile|de} {el yakıyor|cep yakıyor}',
    "Anadolu Süt'te indirim {varmış|var diyorlar} {ama bizim markette yok|, gören haber versin}",
    '{Üç|İki|Dört} kutu Anadolu Süt aldım, {kasada|fişe bakınca} {gözlerim doldu|bir daha düşündüm}',
    'Anadolu Süt kaşarın kilosu {ne olmuş öyle|uçmuş}, {dilim dilim sayarak yiyoruz artık|misafire çıkarmıyorum}',
    "Geçen yıl bu zamanlar Anadolu Süt'ün litresi {yarı fiyatınaydı|bunun yarısıydı}, {hatırlayan var mı|not almıştım}",
    'Çocuklu eve haftada {altı|sekiz|on} litre süt giriyor. Anadolu Süt fiyatıyla {ay sonu gelmiyor|hesap şaşıyor}',
  ],
  c: ['{Nereye kadar|Bu nereye kadar gidecek}?', 'Maaşlar yerinde sayıyor ama.', '😤', '🙄', 'Pes.', 'Neyse, sağlık olsun.', '#zam', '💸'],
  pc: 0.5, po: 0.3,
};

A.tarif = {
  o: ['Bugünün tarifi:', 'Hafta sonu mutfaktaydım.', 'Not düşeyim:', 'Tavsiye:', 'Mutfak günlüğü:'],
  b: [
    'Anadolu Süt kremasıyla {sütlaç|kazandibi|muhallebi|tavuk göğsü} yaptım, {kıvamı tam oldu|bayıldık|ev mis gibi koktu}',
    "{Kahvaltıya|Akşama|Misafire} Anadolu Süt'ün {lor peyniriyle|labnesiyle|tereyağıyla} {gözleme|börek|poğaça} {yaptım|açtım}",
    "Evde yoğurt mayalayanlar: Anadolu Süt'ün günlük sütüyle {çok güzel tutuyor|taş gibi oluyor}",
    'Anadolu Süt kaymaklı yoğurdun üstüne bal, yanına ceviz. {Başka bir şey istemem|Öğün tamam}',
    "Çocuklara {kakaolu süt|puding|sütlü irmik} yaptım Anadolu Süt'le, {tabaklar sıyrıldı|ikisi de bayıldı}",
    'Latte için en iyi köpüren süt {hangisi|hangisi sizce}? Ben Anadolu Süt barista kullanıyorum{, memnunum|}',
    'Anadolu Süt labnesiyle {cheesecake|limonlu tart} denedim, {tutmadı ama tadı güzel|ilk seferde oldu}',
    'Ayranı evde çırpıyorum artık: Anadolu Süt yoğurt, {bir tutam tuz|taze nane}, buz. {Yaz kurtarıcısı|Bu kadar}',
    "Anneannemin sütlü tatlısını Anadolu Süt'le yaptım, {aynı tadı tutturamadım ama yaklaştım|kokusu çocukluğumu getirdi}",
    'Beşamel sosun sırrı soğuk süt. {Ben Anadolu Süt kullanıyorum, topaklanmıyor|Anadolu Süt tam yağlıyla deneyin}',
  ],
  c: ['😋', '🥛', 'Tarif isteyen yazsın.', 'Afiyet olsun bize.', '🤍', 'Deneyin derim.', '👩‍🍳'],
  pc: 0.55, po: 0.3,
};

A.reklam = {
  b: [
    "Anadolu Süt'ün yeni reklamındaki {nine|dede|küçük kız} {çok tatlı|içimi ısıttı}{, kim bulduysa tebrikler|}",
    'Anadolu Süt reklam müziği {dilime dolandı|kafamdan çıkmıyor}',
    "O 'sabah olmadan sofrada' reklamı {iyi çekilmiş|güzel iş}, {uzun zamandır böyle sıcak reklam görmemiştim|ajansı tebrik ederim}",
    'Anadolu Süt reklamı çıkınca {annem ağlıyor|babam kanal değiştirmiyor}, {ciddiyim|şaka değil}',
    "Reklamcı gözüyle: Anadolu Süt'ün son kampanyası {sade ve etkili|biraz uzun ama sıcak}",
    'Anadolu Süt reklamındaki köy {neresi|gerçek mi}, {gidip görmek istiyorum|bilen var mı}?',
    'Reklam arasında telefona bakmadığım tek marka Anadolu Süt{, o nine yüzünden|}',
    "Anadolu Süt'ün reklamı güzel de {keşke fiyatı da o kadar sıcak olsa|ürün de o kadar taze gelse}",
  ],
  c: ['👏', '🥹', 'Helal.', '😂', '❤️'],
  pc: 0.45,
};

A.siradan = {
  b: [
    'Bizim {bakkalda|markette|sitenin marketinde} Anadolu Süt {laktozsuz|keçi sütü|kefir} {bulamıyorum|kalmamış}, {başka yerde gören var mı|nerede var}?',
    "Anadolu Süt'ün {cam şişeli|eski cam şişeli} sütünü özleyen {bir ben miyim|var mı}",
    '@anadolusut {laktozsuz kefir ne zaman geliyor|protein sütünün çileklisi çıkacak mı|kutuların kapağı neden değişti}?',
    'Çocukken {dedem|annem|babaannem} sadece Anadolu Süt alırdı, {tadı hâlâ aynı mı bilmiyorum|hâlâ o tadı arıyorum}',
    'Anadolu Süt ayranı {yazın|bu sıcakta|yemekte} {iyi gidiyor|kurtarıyor}',
    'Kargoyla gelen kolide Anadolu Süt ezilmiş, market {değiştirdi sağ olsun|iade aldı}',
    'Anadolu Süt mü yoksa {Trakya Süt|köy sütü} mü diye {evde tartışma çıktı|eşimle anlaşamadık}',
    'Spor sonrası Anadolu Süt protein sütü içiyorum, {fena değil|tadı idare eder}{, fiyatı biraz tuzlu|}',
    "Kedim Anadolu Süt kutusunun sesini {tanıyor|duyunca koşuyor}{, veremiyorum ama|}",
    'Anadolu Süt kutularındaki {bilmece|küçük hikâye} köşesini {kim yazıyorsa iyi yazıyor|kızım her sabah okuyor}',
    'Ofiste çay ocağına Anadolu Süt aldırdık, {kahveler güzelleşti|herkes memnun}',
    "Anadolu Süt'ün yarım yağlısı ile tam yağlısı arasında {tat farkı var mı sizce|ben fark alamıyorum}",
  ],
  c: ['🥛', '🤔', '', '🙂'],
  pc: 0.3,
};

A.ilktepki = {
  r: [
    '{Geçmiş olsun|Çok geçmiş olsun}, {çocuk içti mi|kızınız içmedi inşallah}?',
    'Bu ne ya {😳|😨|}',
    '{Parti numarası|Son kullanma tarihi|Üretim tarihi} {ne|kaç} yazıyor{, paylaşır mısınız|}?',
    '{Kutuyu|Ürünü} {atmayın|sakın atmayın}, {fişle birlikte saklayın|numune lazım olur}',
    'Hangi marketten aldınız{, zincir mi|}?',
    '@anadolusut {buna bir açıklama|bir cevap} {bekliyoruz|gelecek mi}?',
    '{İnanılır gibi değil|Midem kalktı|Tüylerim diken diken oldu}',
    'Plastik mi o{ yoksa conta mı|, ambalaj parçası gibi duruyor}?',
    '{Şikâyet ettiniz mi|Firmayı aradınız mı}{, ne dediler|}?',
    'Aynı ürün bizim evde de var, {şimdi bakıyorum|korktum şimdi}',
    'Videoyu {sabitleyin|silmeyin}, {herkes görsün|kaybolmasın}',
    '{Doktora götürdünüz mü|Çocukta bir şey var mı}, {önce o önemli|Allah korusun}',
    'Bunu {kutunun içinden mi|bardağa dökünce mi} fark ettiniz?',
  ],
  b: [
    'Az önce gördüm: {biri|bir anne} Anadolu Süt çocuk sütünden {plastik gibi bir şey|yabancı madde} çıktığını paylaşmış{, video var|}',
    'Anadolu Süt çocuk sütünden {bir şey|yabancı madde} çıkmış diyorlar, {gören var mı|doğru mu bu}?',
    'Şu Anadolu Süt videosunu {gören oldu mu|izlediniz mi}? {Çocuk sütünün içinden parça çıkıyor|Kutudan plastik gibi bir şey çıkıyor}',
    'Bir annenin paylaştığı videoya denk geldim. Anadolu Süt çocuk sütü, içinden {yabancı madde çıkmış|ne olduğu belli olmayan bir parça çıkmış}',
    'Anadolu Süt içirenler {şu videoya baksın|dikkat}: çocuk sütünden {plastik parça|yabancı madde} çıktığı {söyleniyor|iddia ediliyor}',
    'Zaman akışıma düştü, {inanamadım|iki kere izledim}. Anadolu Süt çocuk sütünde {yabancı madde|plastik parçası}',
  ],
  c: ['😳', '😨', 'İnşallah yanlıştır.', 'Ciddi bir şeye benziyor.', ''],
  pc: 0.4,
};

A.kaygi = {
  o: ['Anne olarak söylüyorum:', '{İki|Üç|Dört} yaşında çocuğum var.', 'Gerçekten soruyorum.', 'Sabahtan beri aklımda:', 'Baba olarak yazıyorum.', 'İçim içimi yiyor.'],
  b: [
    'Biz de her {sabah|gün} Anadolu Süt çocuk sütü içiriyoruz, {şimdi ne yapacağız|içim hiç rahat değil}',
    "Evdeki {iki|üç|dört} kutu Anadolu Süt'ü {çöpe attım|kenara ayırdım}, {risk alamam|çocuk bu, şaka değil}",
    'O videodan sonra Anadolu Süt çocuk sütünü {bardağa süzerek|tülbentten geçirip} baktım, {bir şey yok ama|yine de} güvenemiyorum',
    'Çocuk sütünden yabancı madde çıkması {ne demek|nasıl olur}, {bu ürün|bunlar} hiç {kontrolden|denetimden} geçmiyor mu',
    "Anadolu Süt'e yıllardır güveniyordum, {o görüntüden sonra|bugünden sonra} {elim gitmez|bir daha zor alırım}",
    'Kreşte çocuklara Anadolu Süt veriyorlarmış, {müdürü aradım|veli grubuna yazdım}{, başka markaya geçsinler|}',
    '{Bebeğime|Oğluma|Kızıma} dün akşam o sütten içirdim, {şu an çok kötüyüm|uyuyamıyorum}',
    'Çocuğun içtiği sütten {plastik|yabancı madde} çıkıyorsa {büyükler ne içiyor kim bilir|diğer ürünlerde ne var}',
    'Veli grubunda sabahtan beri Anadolu Süt videosu dönüyor, {herkes panikte|kimse ne yapacağını bilmiyor}',
    'Anadolu Süt çocuk sütü alanlar {parti numarasına|kutunun altındaki koda} baksın{, videodaki ürünle aynı olabilir|}',
    'Okul çantasına her gün Anadolu Süt koyuyordum. {Bugün koymadım|Yarın ne koyacağımı bilmiyorum}',
    'Çocuk doktorumuza sordum, {"şüphedeyseniz içirmeyin" dedi|"belirti yoksa panik yapmayın" dedi}. Anadolu Süt yine de {bir açıklama yapmalı|bizi rahatlatmalı}',
    'Annem aradı, "{torunuma o sütten verme|Anadolu Süt almayın}" diyor. {Haber ona kadar gitmiş|Mahallede herkes konuşuyormuş}',
    "Marketten Anadolu Süt çocuk sütünü iade etmek istedim, {almadılar|'firmadan talimat yok' dediler}",
    'Yutulsaydı ne olacaktı? {O parça bir çocuğun boğazına kaçabilirdi|Bunu düşünmek bile istemiyorum}. Anadolu Süt bunu açıklamak zorunda',
    'Gece kalkıp mutfaktaki Anadolu Süt kutularını tek tek {ışığa tuttum|kontrol ettim}. {Bu hâle geldik|Böyle yaşanmaz}',
    'İkizlere günde iki kutu Anadolu Süt içiriyorduk. {Şimdi elimde on kutu var, ne yapacağım|Hepsini kapının önüne koydum}',
    'Hangi ürünler etkilenmiş bilen var mı? Biz Anadolu Süt {muzlu çocuk sütü|200 ml çocuk sütü} alıyoruz, {aynı hat mı|aynı tesis mi}',
    'Kayınvalidem bile mesaj attı "Anadolu Süt içirmeyin" diye. {Konu ne kadar yayıldı siz düşünün|Kadın sosyal medya bile kullanmıyor}',
    "Belki tek bir kutudur, belki değildir. {Bilmediğim için|Emin olamadığım için} çocuğuma Anadolu Süt veremem",
  ],
  e: ['Çocuk sağlığı bu, şaka değil.', 'Lütfen biri açıklasın.', 'Kime güveneceğiz?', 'Bilen biri varsa yazsın.', 'Açıklama bekliyorum.'],
  c: ['😔', '😟', 'İçim hiç rahat değil.', 'Allah korusun.', '💔', '🥺', '@anadolusut'],
  pc: 0.45, po: 0.3, pe: 0.22, tag: 0.12,
  r: [
    'Biz de aynı durumdayız{, ne yapacağımı bilmiyorum|} 😔',
    '{Aynı kaygı bende de var|Ben de çok korktum}{, iki çocuğum içiyor|}',
    'Siz ne yaptınız, {atıp attınız mı|iade ettiniz mi}?',
    '{Çocuklar için|Küçükler için} başka ne alıyorsunuz{ şimdi|}?',
  ],
};

A.kizgin = {
  o: ['Açık konuşayım:', 'Sinirden yazıyorum.', 'Kusura bakmayın ama:', 'Bir şey diyeceğim.'],
  b: [
    'Çocuk sütü bu, {çocuk|bebek}! {İnsanda hiç vicdan yok mu|Kalite kontrol diye bir şey yok mu} Anadolu Süt',
    'Anadolu Süt {rezalet|skandal}{, başka söz bulamıyorum|}',
    "Anadolu Süt'ün {kalite kontrolünü|üretim hattını} kim denetliyor, {Allah aşkına|merak ediyorum}",
    'Reklama {milyonlar|o kadar para} harcayacağına {hattını temizle|kontrolünü yap} Anadolu Süt',
    'Anadolu Süt yetkilileri {çıksın hesap versin|kendi çocuklarına içiriyor mu bunu}',
    'Bu ilk değil, son da olmayacak. {Ceza|Yaptırım} yok çünkü. Anadolu Süt {yarın unutulur diye bekliyor|unutulmasını bekliyor}',
    '{Yazıklar olsun|Yuh} Anadolu Süt, {çocuk sağlığıyla|çocukların sağlığıyla} {oynanmaz|oyun olmaz}',
    "Anadolu Süt'ün o 'el değmeden üretim' {lafı|reklamı} {nerede kaldı|ne oldu}? {El değmemiş ama plastik değmiş|Belli ki başka şeyler değmiş}",
    'Bir çocuk sütü firması {bunu nasıl atlar|bu kadar özensiz olamaz}. Anadolu Süt {sorumluları bulsun|hesap versin}',
    'Kutunun üstüne "çocuklar için" yazıp içine {özen koymayan|bakmayan} Anadolu Süt{, tebrikler|}',
    'Anadolu Süt üretim müdürü bu gece {rahat uyuyor mu|uyuyabiliyor mu} merak ediyorum',
    'Parasıyla rezil olmak bu. {Hem pahalı hem güvensiz|Hem zam yap hem bunu yap}. Anadolu Süt',
    "Anadolu Süt'ün {özür dilemesi|'üzgünüz' demesi} yetmez, {o partiyi toplatması lazım|ne olduğunu belgeyle anlatması lazım}",
    'İnsan en azından çocuk ürününde {dikkat eder|titiz olur} sanıyordum. Anadolu Süt {yanılttı|şaşırttı}',
    'Bunu yapan firma {hâlâ rafta|hâlâ satışta}. Anadolu Süt için {kimse kılını kıpırdatmıyor|bir yaptırım yok mu}',
    'Yıllarca "güven" diye reklam yaptılar. Anadolu Süt o güveni {bir kutuyla|bir günde} bitirdi',
  ],
  e: ['Firma hâlâ sessiz.', 'Bunun hesabı sorulur.', 'Çocuk bu, çocuk.', 'Unutmayacağız.', 'Yeter artık.'],
  c: ['😡', '🤬', 'Ayıp.', 'Rezalet.', 'Yazık.', '@anadolusut', '‼️'],
  pc: 0.5, po: 0.25, pe: 0.25, tag: 0.3,
  r: ['{Rezalet|Skandal} {gerçekten|ya}', '{Hesap sorulmalı|Bunun peşini bırakmamak lazım}', 'Çocuk ürününde bu {olmaz|kabul edilemez} 😡', '{Ceza yok ki|Yaptırım olmayınca böyle}'],
};

A.sessizlik = {
  b: [
    '{Saatler oldu|Kaç saat oldu}, @anadolusut hâlâ {tek kelime etmedi|sessiz}',
    "Anadolu Süt'ten {bir açıklama|ses} {yok|gelmedi hâlâ}{, sosyal medya ekibi uyuyor herhalde|}",
    'Bir marka çocuk sütüyle ilgili {böyle bir iddiaya|bu videoya} {üç|dört|beş} saattir cevap vermiyorsa {sorun büyüktür|ben şüphelenirim}',
    '@anadolusut {reklam paylaşmayı biliyorsunuz|günaydın paylaşımı yapıyorsunuz} da {bu videoya cevap yok mu|iki satır açıklama yok mu}',
    'Kriz yönetimi dersi: Anadolu Süt {nasıl yapılmaz|ne yapılmaz} onu gösteriyor{, sustukça büyüyor|}',
    'Anadolu Süt sustukça insanlar {en kötüsünü düşünüyor|daha çok paylaşıyor}',
    "Anadolu Süt müşteri hattını aradım, {'konu inceleniyor' dediler|kimse bir şey bilmiyor}{, o kadar|}",
    'Anadolu Süt hesabı bugün {reklam paylaştı ama videoya tek kelime yok|sanki hiçbir şey olmamış gibi davranıyor}',
    '"İnceliyoruz" demek {iki dakika|bir cümle}. Anadolu Süt onu bile {demedi|yazmadı}',
    'Anadolu Süt basın bürosuna {mail attım|yazdım}, {otomatik yanıt geldi|dönen olmadı}',
    'İletişimciler not alsın: {ilk saatlerde susan|geç kalan} marka hikâyeyi başkasına yazdırır. Bugünkü örnek Anadolu Süt',
    'Anadolu Süt yorumları {kapatmış|sınırlamış} diyorlar, {doğruysa daha kötü|bu mu çözüm}',
    'Açıklama yapmamak da bir açıklama. Anadolu Süt {bunu bilmiyor mu|ne bekliyor}',
  ],
  c: ['Bekliyoruz.', '⏳', 'Susmak da bir cevap.', '🤐', 'Ayıp.', 'Hâlâ ses yok.'],
  pc: 0.45, tag: 0.2,
  r: ['{Hâlâ ses yok|Tek kelime yok}, {inanılmaz|şaşırmadım}', 'Önce {şu videoya cevap verin|açıklama yapın}, {reklam sonra|günaydın sonra}', '{Sustukça batıyorlar|Susarak geçmez bu}'],
};

A.alay = {
  b: [
    "Anadolu Süt'ün yeni ürünü: {sürprizli süt|içinden oyuncak çıkan süt}{. Koleksiyonu tamamlayana hediye|}",
    'Anadolu Süt {çocuk sütü|kutusu} açıyorum, {bakalım bugün ne çıkacak|şansıma ne çıkacak} 🎁',
    'Anadolu Süt: {yüzde yüz doğal|%100 süt}, {yüzde beş plastik|biraz da ambalaj}',
    '{Kalsiyum, protein, plastik|Protein, kalsiyum ve bir tutam conta}. Anadolu Süt {her şeyi düşünmüş|eksik bırakmamış}',
    'Çocuk sütünden yabancı madde çıkmış. {Yabancı olduğuna göre ithal demek ki|En azından yerli değilmiş}. Anadolu Süt',
    'Anadolu Süt içenler {mıknatısa yapışıyor mu|havalimanında ötüyor mu}, {merak ettim|bilgisi olan}?',
    "Anadolu Süt'ün reklamındaki nine {şimdi ne diyecek|de şaşkın}{: 'evladım biz süzerdik'|}",
    'Anadolu Süt sosyal medya ekibi şu an {masanın altında|telefonu uçak moduna almış}',
    "Anadolu Süt kutusunun üstüne '{ağır çekimde için|çiğneyerek tüketiniz|içindekiler: sürpriz}' yazsınlar bari",
    'Bugünkü burç yorumu: Anadolu Süt içenler {beklenmedik bir şeyle karşılaşabilir|sürprizlere açık olsun}',
    'Lif oranı yüksek süt arayanlara Anadolu Süt{ öneriyorlarmış|}',
    'Sütü süzgeçten geçirip içtiğimiz günlere döndük{, sağ ol Anadolu Süt|. Teşekkürler Anadolu Süt}',
    'Anadolu Süt "sabah olmadan sofrada" diyordu, {içindekini saymayı unutmuş|sofraya neyle geldiğini söylememiş}',
    'Evde Anadolu Süt açma töreni: {bir kişi döküyor, iki kişi bakıyor|önce el feneri, sonra bardak}',
    'Anadolu Süt içtim, {şimdilik sadece süt çıktı|bir şey çıkmadı, şanssız günümdeyim}',
    'Anadolu Süt pazarlama toplantısı: "{İçine ne koysak da konuşulsak|Nasıl gündem oluruz}?" {Stajyer: "Bende bir fikir var"|Sonuç ortada}',
    'Kutudan çıkan parçaları biriktirene Anadolu Süt {buzdolabı magneti|tencere seti} veriyormuş',
    'Anadolu Süt kutusu açmak artık {kazı kazan gibi|çekiliş gibi}: {amorti de çıkabilir|ne çıkacağı belli değil}',
    'Diyetisyenim "lifli beslen" dedi, {Anadolu Süt içiyorum|ben de Anadolu Süt aldım}',
    'Anadolu Süt krizi yöneten kişi şu an {üçüncü kahvesinde|çoktan istifa dilekçesini yazmış}',
    'Çocuk: "Anne sütten bir şey çıktı." Anne: "{Dilek tut|Kimseye söyleme, zengin olacağız}." Anadolu Süt',
    'Anadolu Süt yeni seri: {Maceracı Çocuklar İçin|Cesurlar İçin}. İçinden ne çıkacağını {üretici de bilmiyor|biz de bilmiyoruz}',
  ],
  c: ['😂', '😂😂', '🤡', '💀', 'Şaka gibi.', 'Gülsek mi ağlasak mı.', '😭', 'Pes.'],
  pc: 0.55, tag: 0.12,
  r: ['{Ağladım|Koptum} 😂', 'Bu çok iyi{ydi|} 💀', 'Sürpriz yumurta değil sürpriz süt 😂', '{Koleksiyon yapan var mı|Benimkinden henüz bir şey çıkmadı, şanssızım}',
    'Reklam ajansı bunu {alsın|kullansın}{ direkt|}', '{Gülüyoruz ama|Komik de} çocuk sütü bu ya', 'Sosyal medya ekibine {sabır|kolay gelsin} 😂', '{Yazan ele sağlık|Kim yazdıysa} 😂😂'],
};

A.haberpay = {
  b: [
    'Haberlere {de|bile} çıktı: Anadolu Süt çocuk sütünde yabancı madde iddiası',
    '{Gündem Hattı|Marmara Postası|Kent Gündemi} {yazmış|haber yapmış}: Anadolu Süt {videosu|iddiası} {büyüyor|gündemde}',
    'Artık haber sitelerinde. Anadolu Süt {hâlâ susacak mı|bunu görmezden gelemez}',
    'Haberde "şirkete ulaşılamadı" yazıyor{. Bir çocuk sütü markasına ulaşılamıyor|, Anadolu Süt telefonları açmıyormuş}',
    'Anadolu Süt haberi {ana sayfalara çıkmış|en çok okunanlarda}, {akşam bültenlerine de girer bu|yarın gazetelerde görürüz}',
    'Sosyal medyada başlayan Anadolu Süt tartışması {habere dönüştü|medyaya taşındı}{, artık kapanmaz|}',
    'Haberi okudum: {video dışında yeni bilgi yok|firmadan tek satır yok}. Anadolu Süt konuşmadıkça {haber de bu kadar|iddia böyle kalıyor}',
    'Annem haberi televizyonda görmüş. Anadolu Süt meselesi {sosyal medyadan çıktı artık|büyüklere kadar ulaştı}',
  ],
  c: ['📰', 'Okuyun.', '', 'Bilginize.'],
  pc: 0.35, tag: 0.15,
  r: ['Haberde {yeni bir şey var mı|firma ne demiş}?', '{Sonunda haber oldu|Haber olması iyi oldu}', '"Ulaşılamadı" ne demek ya'],
};

A.benzer = {
  b: [
    'Geçen {ay|hafta|yaz} bizim aldığımız Anadolu Süt {ekşi|kesik|kokulu} çıkmıştı, {üstünde durmamıştım|şikâyet etmemiştim}{, demek tesadüf değilmiş|}',
    'Bizde de Anadolu Süt yoğurdundan {saç teli|siyah bir parça} çıkmıştı{, fotoğrafını çekmediğime pişmanım|}',
    "Kuzenim {geçen sene|iki ay önce} Anadolu Süt'ten {midem bozuldu|rahatsızlandım} demişti{, inanmamıştım|}",
    "Anadolu Süt'ün kutusu {şişmişti bir keresinde|sızdırıyordu}, market {'olur öyle' demişti|geri almıştı}",
    "'Benim de başıma geldi' diyenler {çoğalıyor|artıyor}. Anadolu Süt'te {bir sorun var belli ki|bir şeyler oluyor}",
    'Ben de {geçen kış|birkaç ay önce} Anadolu Süt kutusunun dibinde {tortu gibi bir şey|sarı bir tabaka} görmüştüm, {süt taşı sanmıştım|önemsememiştim}',
    'Arkadaşım markette çalışıyor, Anadolu Süt için {son aylarda iade arttı|şikâyet geliyordu} diyor{. Ne kadar doğru bilmem|}',
    'Komşumun oğlu Anadolu Süt içtikten sonra {kusmuştu|karnı ağrımıştı}. {O zaman bağlantı kurmamıştık|Şimdi aklıma geldi}',
  ],
  c: ['Demek tek değilmişiz.', '🤔', 'Şimdi taşlar yerine oturuyor.', '', 'Bilginize.'],
  pc: 0.35, tag: 0.12,
  r: ['Bizde de {olmuştu|benzeri oldu}, {şikâyet etmemiştim|şimdi pişmanım}', '{Tek değilmişiz|Demek yalnız değilim}'],
};

A.soru = {
  b: [
    'Anadolu Süt olayı {doğru mu|gerçek mi}, {teyit eden|doğrulayan} var mı?',
    'Bu Anadolu Süt videosu {nereden çıktı|kimin}, {kaynağı|ilk paylaşan} belli mi?',
    "Hangi ürün tam olarak, {çocuk sütü mü|200 ml'lik kutular mı}? Evdeki Anadolu Süt'e bakacağım",
    'Anadolu Süt {açıklama yaptı mı|bir şey dedi mi}, kaçırdım mı?',
    'Tek bir video üzerinden mi konuşuyoruz yoksa Anadolu Süt için {başka şikâyet de var mı|başka örnek var mı}?',
    'Anadolu Süt videosundaki yabancı madde ne{ymiş|}, {plastik mi cam mı|belli mi}?',
    'Anadolu Süt ürünleri {toplatılıyor mu|raflardan kalktı mı}{, bilen var mı|}?',
    'Gündemi yeni gördüm. Anadolu Süt meselesini {özetleyen|baştan anlatan} biri var mı?',
    'Anadolu Süt için {resmî bir inceleme|bir numune analizi} başladı mı, {yoksa hâlâ sadece video mu var|bilen var mı}?',
    'Video hangi şehirde çekilmiş? Anadolu Süt {her yere aynı tesisten mi gidiyor|kaç tesiste üretiyor}?',
    'Evdeki Anadolu Süt kutusunun kodunu nereden {sorgulayabilirim|kontrol edebilirim}?',
    'Samimi soruyorum: Anadolu Süt içirmeye {devam eden var mı|devam mı, bırakalım mı}?',
  ],
  c: ['🤔', 'Bilen yazsın.', '', 'Kafam karıştı.'],
  pc: 0.3, tag: 0.08,
  r: ['Kaynak {var mı|ne}?', '{Firma bir şey dedi mi|Açıklama geldi mi}?', '{Doğrulandı mı bu|Teyitli mi}?', 'Hangi ürünmüş{ tam olarak|}?'],
};

A.boykot = {
  o: ['Net konuşuyorum:', 'Karar verdik:', 'Bu kadar basit:', 'Herkese çağrı:', 'Tek yol var:'],
  b: [
    '{Açıklama|Doğru dürüst bir açıklama} gelene kadar Anadolu Süt {almıyorum|almıyoruz}',
    "Anadolu Süt'ü {rafta bırakın|sepete koymayın}, {başka dilden anlamıyorlar|ancak böyle ciddiye alırlar}",
    'Çocuklarımızın sağlığını hiçe sayanı {uyarmanın|durdurmanın} tek yolu {almamak|rafta bırakmak}. Anadolu Süt',
    "Market sahipleri, Anadolu Süt'ü {raftan indirin|iade edin}{. Müşteri olarak rica ediyoruz|}",
    'Anadolu Süt boykotuna {katılıyorum|biz de varız}{, ailecek|}',
    'Bugünden itibaren {evimize|mutfağıma} Anadolu Süt girmeyecek{, komşulara da söyledim|}',
    '{Paylaşın|Yayın}, {herkes görsün|duymayan kalmasın}: Anadolu Süt çocuk sütünden yabancı madde çıktı, firma susuyor',
    "Tüketicinin gücü cüzdanıdır. Anadolu Süt'e {bu hafta|bu ay} tek kuruş yok",
    'Anadolu Süt alacağınız parayla {başka marka alın|sütçüden alın}. {Mesaj böyle gider|Anladıkları tek dil bu}',
    'Okul aile birliğine yazdım: kantinden Anadolu Süt {kaldırılsın|çıkarılsın}. {Siz de yazın|Her veli yazsın}',
    'Sitemizin marketine söyledik, Anadolu Süt siparişini {durdurdu|bu hafta vermeyecek}',
    "Bugün markette Anadolu Süt rafının {önünden yürüyüp geçtim|fotoğrafını çektim, dolu duruyor}. {Böyle devam|Almıyoruz}",
    'Boykot {bir linç değil|ceza değil}, hesap sormanın {en sakin|en medeni} yolu. Anadolu Süt açıklama yapana kadar yokuz',
    'Anadolu Süt açıklama yapmadıkça her gün bu etikete yazacağım{, bıkmadan|}',
    'Bir kişi almazsa bir şey olmaz diyenler: {bugün binlerce kişiyiz|etikete bakın}. Anadolu Süt {bunu görüyor|rakamlarda görecek}',
    "Anneler babalar, {bir hafta|on gün} Anadolu Süt almasak {ne olur|ne kaybederiz}? {Onlar çok şey kaybeder|Ama çok şey kazanırız}",
  ],
  c: ['#AnadoluSütBoykot', 'Almıyoruz.', '✊', 'Paylaşalım.', 'Yayalım.', '#AnadoluSütBoykot ✊'],
  pc: 0.6, po: 0.3, tag: 0.75,
  r: ['{Katılıyorum|Biz de varız} ✊', '{Almıyoruz|Bizim eve de girmeyecek}', 'Açıklama gelene kadar {yokuz|almak yok}', '{Paylaştım|Yaydım}, {herkes görsün|duymayan kalmasın}'],
};

A.rakip = {
  b: [
    "Biz {dün|bugün} Trakya Süt'e geçtik, {şimdilik|en azından} {içim rahat|bir şey duymadım}. Anadolu Süt bitti bizim için",
    'Anadolu Süt yerine {ne alıyorsunuz|hangi markayı önerirsiniz}? {Trakya Süt iyi mi|Köyden süt bulan var mı}?',
    "Trakya Süt'ün pazarlamacıları bugün {bayram ediyordur|prim yapıyordur}. Anadolu Süt {altın tepside sundu|kendi eliyle verdi}",
    '{Mahalledeki sütçüye|Açık süte|Köy sütüne} döndük, {Anadolu Süt sağ olsun|paketli süte güven kalmadı}',
    'Bu Anadolu Süt işinden en kârlı çıkan Trakya Süt oldu{, reklam yapmasına bile gerek kalmadı|}',
    'Markette Trakya Süt rafı {boşalmış|yarı boş}, Anadolu Süt {olduğu gibi duruyor|dokunulmamış}',
    'Anadolu Süt yerine Trakya Süt aldım ama {onu da süzdüm|ona da güvenim yok artık}',
    'Trakya Süt bugün "{güvenle için|her kutu kontrolden geçer}" diye paylaşım yapmış. {Fırsatı kaçırmamışlar|Zamanlama tesadüf değil}. Anadolu Süt düşünsün',
  ],
  c: ['🤷', '', 'Durum bu.', '😅'],
  pc: 0.3, tag: 0.1,
};

A.savunma = {
  o: ['Sakin olalım.', 'Ters düşeceğim ama:', 'Bir dakika.', 'Popüler olmayan görüş:'],
  b: [
    '{15|20|10} yıldır Anadolu Süt içiyoruz, {bir kere bile|bugüne kadar} sorun yaşamadık{. Tek videoyla hüküm vermeyin|}',
    'Tek bir videoyla {koca markayı|yüzlerce çalışanı olan firmayı} linç etmek {doğru değil|çok kolay}{, sonucu bekleyelim|}. Anadolu Süt için de geçerli',
    'Anadolu Süt tesisini {gezmiştim|okul gezisinde görmüştük}, {her şey otomatik|el değmeden üretim}. {O parça oraya nasıl girecek|Bana pek inandırıcı gelmedi}',
    'O kutu açıldıktan sonra {içine her şey konabilir|ne olduğu belli olmaz}. {Kimse bunu söylemiyor|Video tek başına kanıt değil}. Anadolu Süt hemen suçlu ilan edildi',
    "Anadolu Süt'te çalışan {kuzenim|arkadaşım} var, {'o filtreden iğne geçmez' diyor|kalite kontrolün çok sıkı olduğunu söylüyor}",
    "Çiftçi de {binlerce aile de|bayiler de} Anadolu Süt'ten ekmek yiyor. {Linç etmeden önce|Paylaşmadan önce} {bir düşünün|inceleme sonucunu bekleyin}",
    'Rakip firmaların {parmağı|işi} olabilir. {Zamanlama manidar|Boykot etiketi bir anda çıktı}. Anadolu Süt hedefte',
    'Anadolu Süt hata yaptıysa bedelini öder ama {önce|ilk önce} {gerçekten yaptı mı öğrenelim|kanıt görelim}',
    'Ben Anadolu Süt almaya devam ediyorum. {Bir videoyla yirmi yıllık alışkanlık değişmez|Analiz sonucu çıkana kadar kimseyi suçlamam}',
    "Süt toplama merkezinde çalışıyorum, Anadolu Süt'e giden süt {üç ayrı testten geçiyor|her gün numuneyle kontrol ediliyor}. {Bunu da bilin|Bilginize}",
    'Bugün Anadolu Süt, yarın başka marka. {Kanıtsız linç|Bu öfke} kimseye {yaramaz|bir şey kazandırmaz}',
    'Anadolu Süt bayisiyim. {Bugün telefonlar susmadı|İade isteyenler geldi}. {Biz de açıklama bekliyoruz ama ürünün arkasındayım|Yirmi yıldır tek şikâyet almadım}',
  ],
  c: ['Sakin olalım.', '🙏', 'Adil olalım.', 'Linç kültürü işte.', 'Bekleyip görelim.', ''],
  pc: 0.4, po: 0.3,
  r: ['Tek videoyla {hüküm verilmez|bu kadar emin olmayın}', '{Analiz sonucunu bekleyin|Kanıt nerede}?', 'Kutu açıldıktan sonra çekilmiş{, bunu da düşünün|}', '{Linç etmeden önce bir durun|Biraz sakin}'],
};

A.eski = {
  b: [
    "Video {2019'danmış|2019'da da dolaşmış}, Kaynak Kontrol {göstermiş|paylaşmış}. {Herkes|Millet} eski videoyla {ayağa kalkmış|Anadolu Süt'e yüklenmiş}",
    "O Anadolu Süt videosu {eski çıktı|yeni değilmiş}{, 2019'da başka bir başlıkla paylaşılmış|}. {Boykotçular|Paylaşanlar} şimdi ne diyecek?",
    "{Demedim mi|Söylemiştik}, video 2019'dan. Anadolu Süt'e {özür borcu olanlar var|haksızlık edildi}",
    'Eski bir videoyu {yeniymiş gibi|bugün çekilmiş gibi} paylaşıp {marka batırmak|linç başlatmak} bu kadar kolay. Anadolu Süt örneği',
    '2019 tarihli videoyla Anadolu Süt boykotu. {Sosyal medya|Bu ülke} {işte|maalesef} böyle',
    'Anadolu Süt videosunun eski olduğu ortaya çıktı. {Peki o kopyala yapıştır hesaplar|Aynı cümleyi atan onlarca hesap} {kimin|nereden çıktı}?',
    "Kaynak Kontrol'ün paylaşımını okuyun: görüntü {2019'da da dolaşımdaymış|yeni değil}. Anadolu Süt için {yazdıklarımı siliyorum|acele etmişiz}",
    'Sabahtan beri Anadolu Süt diye bağıranlar video eski çıkınca {sustu|ortadan kayboldu}',
    'Video 2019. {Yani bugünkü ürünle ilgisi yok|Bugün raftaki sütle alakası yok}. Anadolu Süt {mağdur|boşuna yıprandı}',
    "Bir teyit hesabı 'eski' deyince anladık ki {kimse kaynağa bakmamış|herkes ezbere paylaşmış}. Anadolu Süt krizinin özeti",
    'Anadolu Süt videosu eskiymiş. {Dün boykot diyen arkadaşlara sevgiler|Etiketi açanlar özür dileyecek mi}',
  ],
  c: ['🤦', 'Araştırmadan paylaşmayın.', 'Teyit şart.', '', 'Sonra da özür dileyen olmaz.', '#AnadoluSüt'],
  pc: 0.4,
  r: ["{Video 2019'danmış|Eski videoymuş}{, haberiniz olsun|}", "Kaynak Kontrol'e bakın, {eski çıktı|2019 diyor}", '{Sildiniz mi paylaşımı|Düzeltme yapacak mısınız}?'],
};

A.itiraz = {
  b: [
    "Video eskiyse {bile|de} {kadın|anne} 'dün çektim' diyor. Anadolu Süt konusunda {kime inanacağız|hangisi doğru}?",
    "'Video eski' diyenler: {eski olması|2019'dan olması} {sorunu ortadan kaldırmıyor|Anadolu Süt'ü aklamıyor}. {O zaman da mı çıkmıştı|Demek yıllardır böyle}",
    "Kaynak Kontrol 'benzer görüntü' diyor, 'aynı video' demiyor{. Okuduğunuzu anlayın|}. Anadolu Süt aklanmış değil",
    "Bir anda 'video eski' diyen hesaplar çoğaldı. {Anadolu Süt ajans mı tuttu|Halkla ilişkiler çalışması başladı galiba}",
    "Eski ya da yeni, Anadolu Süt {kendisi çıkıp konuşsun|açıklama yapsın}. {Başkaları|Teyit hesapları} onun adına konuşmasın",
    "Anne '{kutuyu göstermeye hazırım|ürün hâlâ bende}' demiş. {Analiz edilsin|Laboratuvara gitsin}, Anadolu Süt meselesi bitsin",
    "2019 iddiası doğruysa Anadolu Süt neden {çıkıp söylemiyor|hâlâ susuyor}? {En çok onların işine yarar|Tuhaf değil mi}",
    "'Eski video' deyip geçmeyin. {Kadın kutunun tarihini paylaştı|Anne fişi de göstermiş}. Anadolu Süt {buna cevap versin|bunu açıklasın}",
    'Video eski olabilir, olmayabilir. {Emin olmanın yolu numune analizi|Bunu sosyal medya çözemez}. Anadolu Süt ve Bakanlık {nerede|konuşsun}',
    "İki iddia var, ikisi de doğrulanmadı. Ben Anadolu Süt konusunda {sonucu görmeden|belge görmeden} {kimseye inanmıyorum|taraf tutmuyorum}",
  ],
  c: ['🤨', 'Kafa karıştırmayın.', '', 'Bekliyoruz.', 'Bu iş burada bitmez.'],
  pc: 0.35, tag: 0.3,
  r: ["Anne 'dün çektim' diyor ama{, onu ne yapacağız|}", "{'Benzer' demiş, 'aynı' dememiş|Dikkatli okuyun, kesin konuşmuyor}", '{Eski olsa ne değişir|Bu firmayı aklamaz}'],
};

A.bakanlik = {
  b: [
    '{Tarım Bakanlığı|Bakanlık} Anadolu Süt tesisini {denetlesin|derhal denetlesin}{, sonucu da açıklasın|}',
    'Bakanlığa {şikâyet|başvuru} yaptım, {herkes yapsın|siz de yapın}{, iki dakika sürüyor|}. Konu: Anadolu Süt çocuk sütü',
    '{Gıda denetimi|Denetim} bu ülkede {videodan sonra mı başlıyor|sosyal medyayla mı yapılıyor}? Anadolu Süt {incelensin|için numune alınsın}',
    'Tüketici Nöbeti Bakanlığa başvurmuş{, destekliyorum|}. Anadolu Süt denetlensin, {temizse aklansın|sonuç neyse bilelim}',
    'Anadolu Süt için {il tarım müdürlüğüne|gıda hattına} {şikâyet bıraktım|kayıt açtırdım}, {başvuru numarası aldım|takipçisiyim}',
    'Denetim raporu açıklanmadan {boykot diyene de|Anadolu Süt savunucusuna da} {inanmam|güvenmem}. Bakanlık {nerede|konuşsun}',
    'Bakanlık bugüne kadar Anadolu Süt tesisini {kaç kez denetledi|en son ne zaman denetledi}? {Raporlar açıklansın|Bilgi edinme başvurusu yapacağım}',
    "Anadolu Süt'ün o partisinden numune alınsın, {bağımsız laboratuvar baksın|sonuç kamuoyuyla paylaşılsın}. {Başka türlü kapanmaz|Tartışma ancak böyle biter}",
    'Milletvekillerine yazıyorum: Anadolu Süt konusu {Meclis gündemine gelsin|için soru önergesi verin}',
    'Bakanlıktan bir yetkili çıkıp "{inceleme başlattık|numune aldık}" dese {herkes rahatlar|iş çözülür}. Anadolu Süt de biz de bekliyoruz',
    'Şikâyet nasıl yapılır diye soranlar: {il tarım müdürlüğüne dilekçe|gıda hattına kayıt}, {kutuyu ve fişi saklayın|ürünü atmayın}. Anadolu Süt için ben yaptım',
  ],
  c: ['Denetim şart.', 'Takipteyiz.', '📢', '#AnadoluSütBoykot', ''],
  pc: 0.45, tag: 0.35,
  r: ['{Başvurdum|Ben de şikâyet bıraktım}, {numarayı aldım|takipteyim}', 'Bakanlık {ne zaman konuşacak|hâlâ sessiz}', '{Numune alınsın|Denetim yapılsın}, {bitsin bu iş|öğrenelim}'],
};

// Koordineli küme: bilerek neredeyse aynı metinler
export const CLUSTER_TEXTS = {
  dalga1: {
    base: ["{Çocuklarımızın|Evlatlarımızın} sağlığıyla oynayan Anadolu Süt'ü raflarda bırakıyoruz{!|.|!!} Almıyoruz{,|} aldırmıyoruz{.|!|} #AnadoluSütBoykot{| ✊| ‼️| #boykot|}"],
  },
  dalga2: {
    base: ['Bakanlık göreve{!|!!|.} Çocuk sütünde yabancı madde skandalının hesabı sorulsun{.|,} Anadolu Süt {denetlensin|kapatılsın}{.|!|} #AnadoluSütBoykot{| ✊| ‼️|}'],
  },
};

// ---------------------------------------------------------------- Kuzey Havayolları
const K = {};
K.ovgu = {
  b: [
    'Kuzey Havayolları kabin ekibi {bugün çok ilgiliydi|çocuğumla tek tek ilgilendi}, {teşekkür etmek istedim|emeklerine sağlık}',
    "Kuzey Havayolları'yla {Ankara–İzmir|İstanbul–Trabzon|Adana–İstanbul} uçtum, {tam vaktinde indik|sorunsuzdu}",
    'Kuzey Havayolları ikramındaki {peynirli sandviç|vişneli kek} {beklediğimden iyiydi|fena değildi}',
    'Koltuk aralığı konusunda Kuzey Havayolları {hâlâ en rahatı|rakiplerinden iyi}{, uzun boylular bilir|}',
    'Kuzey Havayolları pilotunun iniş anonsu {çok tatlıydı|bütün uçağı güldürdü}',
    'Bagajım ilk çıkanlardandı, {Kuzey Havayolları bugün şaşırttı|teşekkürler Kuzey Havayolları}',
  ],
  c: ['✈️', '👏', '', '🙏'], pc: 0.5,
};
K.sikayet = {
  b: [
    'Kuzey Havayolları bagajımı {iki gündür|üç gündür} bulamıyor, {arayan soran yok|form doldurdum bekliyorum}',
    "Kuzey Havayolları çağrı merkezinde {40 dakika|yarım saat} bekledim, {sonunda hat düştü|kimse açmadı}",
    'Kuzey Havayolları uygulaması {yine çöktü|check-in yaptırmıyor}{, kapıda sıra bekledim|}',
    'Kuzey Havayolları {ikramı kaldırmış|suyu bile parayla veriyor}, {bilet fiyatı aynı ama|haber veren de yok}',
    '@kuzeyhavayollari valizimin tekeri kırık geldi, {tutanak tuttum|kime başvuracağım}?',
    'Kuzey Havayolları koltuk seçimi için {ayrı para istiyor|ücret almaya başlamış}, {aileyi ayırdılar|yan yana oturamadık}',
  ],
  c: ['😤', '🙄', '', 'Yazık.'], pc: 0.45,
};
K.fiyat = {
  b: [
    'Kuzey Havayolları {bayram biletleri|yaz biletleri} {uçmuş|el yakıyor}, {otobüse döneceğiz|erken alan kazandı}',
    'Kuzey Havayolları kampanyası {gerçekten ucuz mu|var diyorlar}, {tarih bulamadım|yakalayan oldu mu}?',
    'Aynı uçuş dün {1.800|2.100|2.400} liraydı, bugün Kuzey Havayolları {500 lira zam yapmış|fiyatı değiştirmiş}',
    'Kuzey Havayolları mil puanlarım {yanmış|silinmiş}, {haber bile vermediler|bir e-posta bile yok}',
  ],
  c: ['💸', '', '🤷'], pc: 0.35,
};
K.soru = {
  b: [
    "Kuzey Havayolları'nda kabin bagajı {8 kilo mu|kaç kilo}, {sırt çantası ayrı sayılıyor mu|bilen var mı}?",
    'Kuzey Havayolları bebek arabasını {kapıda alıyor mu|bagaja mı veriyoruz}?',
    'Kuzey Havayolları ile evcil hayvan taşıyan oldu mu, {kabine alıyorlar mı|nasıl bir süreç}?',
    '@kuzeyhavayollari {isim düzeltme|tarih değişikliği} için {ücret alıyor musunuz|ne yapmam lazım}?',
    'Kuzey Havayolları online check-in {kaç saat önce açılıyor|kaçta kapanıyor}?',
  ],
  c: ['🤔', '', 'Teşekkürler.'], pc: 0.3,
};
K.rotar = {
  o: ['Havalimanından yazıyorum.', 'Kapıdayız.', 'Durum şu:', 'Hâlâ buradayız.'],
  b: [
    'Kuzey Havayolları KH 418 İzmir–Trabzon {üç|dört} saattir kalkmadı, {tek bir anons yok|kimse bilgi vermiyor}',
    'KH 418 yolcusuyum. Kuzey Havayolları {"teknik kontrol" dedi, o kadar|bize sadece "bekleyin" diyor}',
    "Kuzey Havayolları rötarı {dört saati geçti|beşinci saate giriyor}. {Çocuklar yerde uyuyor|Yaşlı yolcular perişan}",
    'Kuzey Havayolları yer görevlisi {ortadan kayboldu|"ben de bilmiyorum" diyor}. KH 418 kapısında {yüz elli kişiyiz|herkes ayakta}',
    'Annem KH 418 uçağında, {dört saattir havalimanında bekliyor|Trabzon’da cenazeye yetişecekti}. Kuzey Havayolları {telefonlara çıkmıyor|bilgi vermiyor}',
    'Kuzey Havayolları rötar için {bir su bile dağıtmadı|sandviç kuponu verdi, büfe kapalı}',
    'KH 418 ekranında hâlâ "{gecikmeli|yeni saat bekleniyor}" yazıyor. Kuzey Havayolları {bir saat söylesin yeter|en azından dürüst olsun}',
    'Aktarmamı kaçırdım, Kuzey Havayolları {yeni bilet için para istiyor|"sorumluluk bizde değil" diyor}',
    'İzmir’de KH 418 bekleyenler: {tazminat hakkınız var, form isteyin|biniş kartlarınızı saklayın}. Kuzey Havayolları kendiliğinden söylemez',
    'Kuzey Havayolları yarım saatte bir "{az kaldı|hazırlanıyoruz}" diyor. {Dört saattir az kaldı|Kimse inanmıyor artık}',
  ],
  c: ['😤', '😡', 'Rezalet.', '⏰', '@kuzeyhavayollari', '', 'Yazık.'],
  pc: 0.5, po: 0.25,
  r: ['{Geçmiş olsun|Kolay gelsin}, {hâlâ kalkmadı mı|bilgi verdiler mi}?', 'Biz de aynı uçaktayız, {kimse bir şey demiyor|durum aynı}', '{Tazminat formu isteyin|Biniş kartını saklayın}', 'Kuzey Havayolları klasiği{ maalesef|}'],
};
K.rotarAlay = {
  b: [
    'Kuzey Havayolları ile İzmir–Trabzon: {otobüsle gitsem varmıştım|yürüyerek yola çıkan arkadaş Sivas’ta}',
    'Kuzey Havayolları yeni sloganı: "{Acele işe şeytan karışır|Yol değil yolculuk önemli}"',
    'KH 418 yolcuları kapıda {aile oldu|WhatsApp grubu kurmuş}. Kuzey Havayolları insanları birleştiriyor',
    'Kuzey Havayolları rötarı o kadar uzadı ki {biletin son kullanma tarihi geçecek|yolcular kira ödemeye başlayacak}',
    'Kuzey Havayolları: {uçmak dışında her şey|kalkış saati hariç her şey} dahil',
  ],
  c: ['😂', '💀', '😅', ''], pc: 0.6,
};
K.rotarBitti = {
  b: [
    'KH 418 {sonunda kalktı|nihayet havalandı}. Kuzey Havayolları {beş saat sonra|bir özürle} yolladı bizi',
    'İndik. Kuzey Havayolları kaptanı {özür diledi|anons yaptı}, {yine de yorgunuz|teşekkür ederiz ama geç oldu}',
    'Kuzey Havayolları rötar için {açıklama yapmış|özür paylaşmış}, {geç ama iyi|en azından bir şey dedi}',
    'Annem Trabzon’a indi{, şükür|}. Kuzey Havayolları {ikram vermiş sonunda|tazminat formu dağıtmış}',
    'Kuzey Havayolları tazminat başvurumu {aldı|kaydetti}, {bakalım ne olacak|sonucu yazarım}',
    'Teknik arıza olabilir, anlarım. Kuzey Havayolları {keşke baştan düzgün bilgi verseydi|iletişimi beceremedi sadece}',
  ],
  c: ['🙏', '✈️', '', 'Geçti gitti.'], pc: 0.4,
};

// ---------------------------------------------------------------- Dr. Selin Aktaş
const S = {};
S.kitap = {
  b: [
    "Selin Aktaş'ın yeni kitabı Tabağımdaki Denge {geldi|elime ulaştı}, {ilk bölüm çok iyi|bir oturuşta yarısını okudum}",
    "Tabağımdaki Denge'yi bitirdim. Selin Aktaş {yasak koymadan anlatıyor|suçluluk duygusu yüklemiyor}, {en sevdiğim yanı bu|bu yüzden okunuyor}",
    'Selin Aktaş kitabında "{kötü besin yoktur, kötü alışkanlık vardır|tabağını değil gününü düzenle}" diyor. {Altını çizdim|Buzdolabına astım}',
    "Anneme Tabağımdaki Denge aldım, {Selin Aktaş'ı televizyondan tanıyormuş|çok sevindi}",
    "Selin Aktaş'ın kitabındaki {haftalık plan|alışveriş listesi} bölümü {çok pratik|hayat kurtarıyor}",
    "Diyet kitabı sanmıştım, değilmiş. Selin Aktaş {daha çok ilişkimizi anlatıyor yemekle|sakin sakin anlatmış}. Tabağımdaki Denge'yi öneririm",
    'Kitap kulübümüzün bu ayki seçimi Tabağımdaki Denge. Selin Aktaş {okuru yormuyor|güzel yazmış}',
    'Selin Aktaş kitabı {çok satanlara girmiş|ikinci baskıya gitmiş}, {hak ediyor|şaşırmadım}',
  ],
  c: ['📚', '👏', '🤍', '', 'Tavsiye ederim.'], pc: 0.5,
};
S.imza = {
  b: [
    "Selin Aktaş imza gününe gittim, {kuyruk kapıya kadardı|bir saat bekledim ama değdi}",
    'Selin Aktaş {herkesle tek tek konuştu|kitabıma çok güzel bir not yazdı}, {çok sıcak biri|yüz yüze daha da tatlı}',
    'İmza gününde Selin Aktaş’a {sorumu sorabildim|teşekkür edebildim}, {mutluyum|günüm güzelleşti}',
    'Selin Aktaş imza günü {başka şehirlere de gelecek mi|Ankara’da olacak mı}, bilen var mı?',
    'Kitabevinde Selin Aktaş kuyruğu{: sokağa taşmış|, fotoğrafı çektim}. {İlgi büyük|Kitap çabuk biter}',
    'Selin Aktaş imzalı Tabağımdaki Denge artık {kitaplığımda|başucumda}',
  ],
  c: ['🥰', '📖', '✨', ''], pc: 0.55,
};
S.tarif = {
  b: [
    "Selin Aktaş'ın {yulaflı kahvaltı kasesini|mercimekli salatasını|fırın sebzesini} denedim, {doyurucu|pratik ve lezzetli}",
    'Selin Aktaş "{öğün atlama|suyu unutma}" diyor ya, {üç haftadır uyguluyorum|telefonuma hatırlatma kurdum}',
    "Selin Aktaş'ın önerdiği ara öğün {işe yaradı|tatlı krizimi kesti}{, öğleden sonra abur cubura saldırmıyorum|}",
    'Akşam yemeğini Selin Aktaş tabağına göre kurdum: {yarısı sebze|protein, sebze, tahıl}. {Çocuklar bile yedi|Fena olmadı}',
  ],
  c: ['🥗', '😋', '', '💪'], pc: 0.5,
};
S.soru = {
  b: [
    'Selin Aktaş kitabı {e-kitap olarak var mı|sesli kitap olacak mı}?',
    '@drselinaktas {emziren anneler için|vardiyalı çalışanlar için} bir bölüm var mı kitapta?',
    'Selin Aktaş {online danışmanlık veriyor mu|randevu alıyor mu}, {nereden ulaşılıyor|bilen var mı}?',
    'Tabağımdaki Denge {diyabetliler için uygun mu|çocuklu aileler için de geçerli mi}? Selin Aktaş okurlarına soruyorum',
  ],
  c: ['🤔', '', 'Teşekkürler.'], pc: 0.3,
};
S.elestiri = {
  b: [
    'Selin Aktaş kitabı güzel de {fiyatı biraz yüksek|tarifler pahalı malzeme istiyor}',
    "Selin Aktaş'ı severim ama {her yerde o var artık|kitapta yeni bir şey bulamadım}",
    'Tabağımdaki Denge {iyi niyetli|akıcı} ama Selin Aktaş {kaynak göstermeyi azaltmış|bilimsel kısmı kısa geçmiş}',
    'Diyetisyenlerin kitap yazması {moda oldu|iyi hoş}, Selin Aktaş {en azından abartmıyor|yine de ölçülü}',
  ],
  c: ['🤷', '', 'Fikrim bu.'], pc: 0.3,
};

// ---------------------------------------------------------------- Genel (sonradan eklenen danışan)
export const GENERIC = {
  b: [
    '{NAME} hakkında {ne düşünüyorsunuz|yorumunuz ne}?',
    '{NAME} ile ilgili {güzel bir deneyimim oldu|bugün iyi bir şey duydum}',
    '{NAME} {son zamanlarda çok konuşuluyor|yine gündemde}{, sebebini bilen var mı|}',
    '{NAME} konusunda {kararsızım|emin değilim}, {tavsiyesi olan|deneyen} var mı?',
    'Dün {bir arkadaşım|iş yerinde biri} {NAME} dedi, {merak edip baktım|ilk kez duydum}',
    '{NAME} {beklediğimden iyi|fena değil}{, öneririm|}',
    '{NAME} {biraz hayal kırıklığı oldu|beklentimi karşılamadı}{, belki bana öyle geldi|}',
    '{NAME} için {yeni bir duyuru|bir haber} gördüm, {takip edeceğim|bakalım ne olacak}',
    'Bizim evde {NAME} {tartışması bitmez|konusu açıldı yine}',
    '{NAME} tarafında {bir yenilik var mı|neler oluyor}?',
    'Yıllardır {NAME} takip ediyorum, {çizgisi değişmedi|memnunum}',
    '{NAME} bu aralar {sessiz|ortalarda yok}{, dikkatimi çekti|}',
  ],
  c: ['🤔', '👍', '', '🙂', '👀'], pc: 0.35,
};

export const FAM = { ...prefix('a', A), ...prefix('k', K), ...prefix('s', S) };
function prefix(p, obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[`${p}.${k}`] = v;
  return out;
}
