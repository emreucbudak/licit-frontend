export function titleForPath(pathname) {
  return (
    {
      '/auctions': 'Canlı Müzayedeler | Licit',
      '/auctions/lot-4429': 'Licit | Lot Detayı',
      '/auctions/create': 'Müzayede Oluştur | Licit',
      '/auctions/manage': 'İhale Yönetimi | Licit',
      '/dashboard': 'Licit Paneli | Licit',
      '/settings': 'Hesap Ayarları | Licit',
      '/wallet': 'Cüzdan | Licit',
      '/login': 'Giriş Yap - Licit',
      '/verify-login': 'Giriş Kodunu Doğrula | Licit',
      '/forgot-password': 'Şifremi Unuttum | Licit',
      '/verify-identity': 'Kimliğini Doğrula | Licit',
      '/verify-email': 'E-postanı Doğrula | Licit',
      '/reset-password': 'Yeni Şifre Oluştur | Licit',
      '/register': 'Kaydol - Licit',
    }[pathname] || 'Licit - Canlı Müzayede Platformu'
  )
}
