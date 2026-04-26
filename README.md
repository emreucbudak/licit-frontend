# Licit Frontend

Bu proje, `Licit` uygulamasinin kullanici arayuzunu gelistirmek icin olusturulmus React tabanli frontend projesidir. Proje `Vite` ile baslatilmistir ve hizli gelistirme ortami, modern React yapisi ve uretim build sureci sunar.

## Proje Amaci

Bu repository, `Licit` platformunun web arayuzunu gelistirmek icin kullanilir. Tasarimlar, sayfa yapilari ve bilesenler bu proje icinde React bilesenlerine donusturulerek gelistirilecektir.

Mevcut durumda proje:

- React + Vite altyapisi ile hazirdir
- Gelistirme ve production build komutlarina sahiptir
- Sonraki tasarim ve sayfa gelistirmeleri icin uygun bir baslangic sunar

## Teknolojiler

- React
- Vite
- JavaScript
- ESLint

## Kurulum

Projeyi lokal ortamda calistirmak icin:

```bash
npm install
```

## Gelistirme Ortami

Asagidaki komut ile gelistirme sunucusunu baslatabilirsin:

```bash
npm run dev
```

Ardindan terminalde verilen lokal adres uzerinden projeyi tarayicida acabilirsin.

## Build Alma

Production build almak icin:

```bash
npm run build
```

Olusan cikti `dist/` klasorune yazilir.

## Onizleme

Build alinmis surumu lokal olarak test etmek icin:

```bash
npm run preview
```

## Azure Container Apps

Frontend image'i statik Vite build'ini `nginx` ile servis eder. Container App'te
external ingress acilir ve target port `80` olarak ayarlanir.

Frontend backend servislerine tek tek baglanmaz. Browser istekleri Gateway'e
gider; Gateway de `auth-service`, `tendering-service`, `wallet-service`,
`mail-service`, `bidding-engine` ve `auction-streamer` servislerine yonlendirir.

### Secrets

Frontend icin secret gerekmez. Browser tarafina secret verilmemelidir.

### Gateway adresleri

Frontend icin tek gerekli bilgi Gateway'in public adresidir. Bu bilgi secret
degildir; browser zaten Gateway'e istek atacagi icin kullanici tarafindan da
gorulebilir.

Production build almadan once Git'e girmeyen `.env.production.local` dosyasini
olustur:

```text
VITE_API_BASE_URL=https://<gateway-public-url>
VITE_WS_BASE_URL=wss://<gateway-public-host>
```

Ornek:

```text
VITE_API_BASE_URL=https://gateway.<environment>.<region>.azurecontainerapps.io
VITE_WS_BASE_URL=wss://gateway.<environment>.<region>.azurecontainerapps.io
```

`.gitignore` icindeki `*.local` kurali bu dosyanin GitHub'a gitmesini engeller.
Image build edilirken Vite bu degerleri statik dosyalara yazar.

## Proje Yapisi

```text
licit-frontend/
  public/
  src/
  index.html
  package.json
  vite.config.js
```

## Not

Bu README, projenin ilk kurulum asamasina gore hazirlanmistir. Yeni sayfalar, bilesenler ve tasarimlar eklendikce dokumantasyon da guncellenecektir.
