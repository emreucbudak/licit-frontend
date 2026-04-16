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
