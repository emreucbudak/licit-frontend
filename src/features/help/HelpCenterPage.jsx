import { useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'

const faqItems = [
  {
    id: 'place-bid',
    question: 'Licit platformunda nasıl teklif veririm?',
    answer:
      'Teklif vermek için hesabının doğrulanmış olması ve cüzdanında yeterli bakiye bulunması gerekir. Aktif bir ihaleye gir, teklif tutarını kontrol et ve Teklif Ver işlemini onayla.',
  },
  {
    id: 'bid-increments',
    question: 'Teklif artışları nasıl belirlenir?',
    answer:
      'Her ihalede başlangıç fiyatına ve mevcut en yüksek teklife göre artış aralığı uygulanır. Teklif vermeden önce ekranda görünen güncel tutarı ve ihale kurallarını kontrol edebilirsin.',
  },
  {
    id: 'payment-security',
    question: 'Ödemelerim güvende mi?',
    answer:
      'Cüzdan işlemleri yetkili isteklerle yürütülür ve ihale süreci boyunca bakiye hareketleri sistem tarafından kayıt altında tutulur. Şüpheli bir işlem görürsen destek ekibine hemen ulaş.',
  },
  {
    id: 'withdraw',
    question: 'Cüzdandan nasıl para çekerim?',
    answer:
      'Cüzdan sayfasındaki çekim işlemini başlatıp tutarı girerek talep oluşturabilirsin. Güvenlik kontrolü gerektiren işlemlerde tamamlanma süresi uzayabilir.',
  },
  {
    id: 'create-auction',
    question: 'İhale oluştururken nelere dikkat etmeliyim?',
    answer:
      'Ürünün başlığını, açıklamasını, kategorisini, başlangıç fiyatını ve görsellerini net gir. Alıcının uyması gereken özel şartlar varsa İhale Kuralları bölümüne ekle.',
  },
  {
    id: 'auction-images',
    question: 'İhale görselleri nasıl yüklenir?',
    answer:
      'İhale oluşturma sayfasındaki Ürün Resimleri bölümünden en fazla 3 görsel seçebilirsin. JPG, PNG ve WEBP desteklenir; her görsel en fazla 5 MB olabilir.',
  },
  {
    id: 'auction-rules',
    question: 'İhale kuralları ne işe yarar?',
    answer:
      'İhale kuralları, alıcının uyması gereken şartları netleştirir. Ödeme, teslimat, iade veya özel kontrol şartlarını bu bölümde açıkça yazabilirsin.',
  },
  {
    id: 'blocked-balance',
    question: 'Cüzdanda bloke bakiye ne anlama gelir?',
    answer:
      'Devam eden ihale veya bekleyen işlem nedeniyle geçici olarak kullanılamayan tutar bloke bakiye olarak tutulabilir. İşlem tamamlandığında bakiye hareketi güncellenir.',
  },
  {
    id: 'auction-status',
    question: 'Taslak ve yayındaki ihale arasındaki fark nedir?',
    answer:
      'Taslak ihaleler henüz alıcılara açılmaz. Yayına alınan ihaleler canlı listelerde görünür ve teklif almaya başlayabilir.',
  },
  {
    id: 'edit-auction',
    question: 'Yayındaki ihaleyi düzenleyebilir miyim?',
    answer:
      'İhale yönetimi sayfasından düzenlenebilir alanları güncelleyebilirsin. Teklif alan veya kritik aşamaya gelen ihalelerde bazı değişiklikler kısıtlanabilir.',
  },
  {
    id: 'notifications',
    question: 'Bildirimler ne zaman gelir?',
    answer:
      'Teklif hareketleri, ihale güncellemeleri ve hesapla ilgili önemli durumlarda bildirim alırsın. Okunmamış bildirimler üst bardaki zil ikonunda görünür.',
  },
  {
    id: 'account-security',
    question: 'Hesap güvenliğimi nasıl korurum?',
    answer:
      'Şifreni kimseyle paylaşma, doğrulama kodlarını gizli tut ve bilmediğin cihazlardan çıkış yap. Şüpheli bir giriş fark edersen destek ekibiyle iletişime geç.',
  },
  {
    id: 'support-info',
    question: 'Destek ekibine hangi bilgilerle yazmalıyım?',
    answer:
      'İşlem kimliği, ihale numarası, ekran görüntüsü ve yaşadığın adımları paylaşman çözümü hızlandırır. Hesap güvenliği için şifreni veya doğrulama kodlarını paylaşma.',
  },
]

const supportChannels = [
  {
    icon: 'mail',
    label: 'Destek E-postası',
    value: 'emreucbudak87@gmail.com',
    href: 'mailto:emreucbudak87@gmail.com',
    tone: 'primary',
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: 'github.com/emreucbudak',
    href: 'https://github.com/emreucbudak',
    tone: 'secondary',
  },
]

function HelpCenterPage({ navigate, onLogout }) {
  const [openFaqId, setOpenFaqId] = useState(faqItems[0]?.id || '')

  function toggleFaq(faqId) {
    setOpenFaqId((currentFaqId) => (currentFaqId === faqId ? '' : faqId))
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <AppTopNavbar
        currentPath="/help"
        navigate={navigate}
        searchPlaceholder="Yardım merkezinde ara..."
      />
      <AppSideNavbar
        currentPath="/help"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="min-h-screen px-4 pb-16 pt-28 sm:px-6 sm:pt-28 md:px-10 md:pb-10 md:pt-32 lg:ml-64 lg:px-12 lg:pb-12 lg:pt-32">
        <div className="mx-auto max-w-5xl space-y-10">
          <section>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                  <span className="material-symbols-outlined text-primary">
                    forum
                  </span>
                  Sıkça Sorulan Sorular
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                  Teklif verme, cüzdan, ihale oluşturma ve hesap güvenliğiyle
                  ilgili en çok sorulan konular.
                </p>
              </div>
              <span className="text-sm font-semibold text-secondary">
                {faqItems.length} yanıt
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {faqItems.map((item) => {
                const isOpen = openFaqId === item.id

                return (
                  <article
                    className={`rounded-xl border bg-surface-container-low transition-colors ${
                      isOpen
                        ? 'border-primary/40'
                        : 'border-outline-variant/10 hover:border-primary/30'
                    }`}
                    key={item.id}
                  >
                    <button
                      aria-controls={`${item.id}-answer`}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left text-lg font-bold text-on-surface"
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                    >
                      <span>{item.question}</span>
                      <span
                        className={`material-symbols-outlined shrink-0 text-outline transition-transform ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                      id={`${item.id}-answer`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-on-surface-variant">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-high p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                <h2 className="text-3xl font-bold text-on-surface">
                  Hala yardıma mı ihtiyacın var?
                </h2>
                <p className="mt-3 max-w-2xl text-on-surface-variant">
                  Destek ekibi platformu takip ediyor. Yaşadığın sorunu, işlem
                  kimliğini ve ilgili ihale bilgisini ekleyerek bizimle
                  paylaşabilirsin.
                </p>
              </div>

              <div className="space-y-3">
                {supportChannels.map((channel) => {
                  const content = (
                    <>
                      {channel.icon === 'github' ? (
                        <svg
                          aria-hidden="true"
                          className="h-8 w-8 shrink-0 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.5v-1.74c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.1c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.56 5.05.36.32.68.94.68 1.9v2.65c0 .28.18.6.69.5A10.2 10.2 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                        </svg>
                      ) : (
                        <span
                          className={`material-symbols-outlined text-3xl ${
                            channel.tone === 'secondary'
                              ? 'text-secondary'
                              : 'text-primary'
                          }`}
                        >
                          {channel.icon}
                        </span>
                      )}
                      <span>
                        <span className="block text-xs font-bold uppercase tracking-widest text-outline">
                          {channel.label}
                        </span>
                        <span
                          className={`mt-1 block font-mono text-sm font-bold ${
                            channel.tone === 'secondary'
                              ? 'text-secondary'
                              : 'text-on-surface'
                          }`}
                        >
                          {channel.value}
                        </span>
                      </span>
                    </>
                  )

                  return channel.href ? (
                    <a
                      className="flex items-center gap-4 rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-4 transition-colors hover:border-primary/40"
                      href={channel.href}
                      key={channel.label}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      className="flex items-center gap-4 rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-4"
                      key={channel.label}
                    >
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default HelpCenterPage
