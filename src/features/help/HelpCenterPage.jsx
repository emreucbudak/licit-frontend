import { useMemo, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'

const faqItems = [
  {
    question: 'Licit platformunda nasıl teklif veririm?',
    answer:
      'Teklif vermek için hesabının doğrulanmış olması ve cüzdanında yeterli bakiye bulunması gerekir. Aktif bir ihaleye gir, teklif tutarını kontrol et ve Teklif Ver işlemini onayla.',
  },
  {
    question: 'Teklif artışları nasıl belirlenir?',
    answer:
      'Her ihalede başlangıç fiyatına ve mevcut en yüksek teklife göre artış aralığı uygulanır. Teklif vermeden önce ekranda görünen güncel tutarı ve ihale kurallarını kontrol edebilirsin.',
  },
  {
    question: 'Ödemelerim güvende mi?',
    answer:
      'Cüzdan işlemleri yetkili isteklerle yürütülür ve ihale süreci boyunca bakiye hareketleri sistem tarafından kayıt altında tutulur. Şüpheli bir işlem görürsen destek ekibine hemen ulaş.',
  },
  {
    question: 'Cüzdandan nasıl para çekerim?',
    answer:
      'Cüzdan sayfasındaki çekim işlemini başlatıp tutarı girerek talep oluşturabilirsin. Güvenlik kontrolü gerektiren işlemlerde tamamlanma süresi uzayabilir.',
  },
  {
    question: 'İhale oluştururken nelere dikkat etmeliyim?',
    answer:
      'Ürünün başlığını, açıklamasını, kategorisini, başlangıç fiyatını ve görsellerini net gir. Alıcının uyması gereken özel şartlar varsa İhale Kuralları bölümüne ekle.',
  },
  {
    question: 'Destek ekibine hangi bilgilerle yazmalıyım?',
    answer:
      'İşlem kimliği, ihale numarası, ekran görüntüsü ve yaşadığın adımları paylaşman çözümü hızlandırır. Hesap güvenliği için şifreni veya doğrulama kodlarını paylaşma.',
  },
]

const supportChannels = [
  {
    icon: 'mail',
    label: 'Destek E-postası',
    value: 'support@licit-market.io',
    href: 'mailto:support@licit-market.io',
    tone: 'primary',
  },
  {
    icon: 'fingerprint',
    label: 'Destek Kimliği',
    value: 'LICIT-HELP-778',
    tone: 'secondary',
  },
]

function HelpCenterPage({ navigate, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('tr-TR')
  const filteredFaqItems = useMemo(() => {
    if (!normalizedSearchTerm) {
      return faqItems
    }

    return faqItems.filter((item) =>
      `${item.question} ${item.answer}`
        .toLocaleLowerCase('tr-TR')
        .includes(normalizedSearchTerm),
    )
  }, [normalizedSearchTerm])

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
          <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 shadow-sm sm:p-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container/15 text-primary">
                <span className="material-symbols-outlined">help_center</span>
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                Nasıl yardımcı olabiliriz?
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                Teklif verme, cüzdan güvenliği, ihale kuralları ve hesap
                işlemleri hakkında hızlı yanıtları burada bulabilirsin.
              </p>

              <label className="relative mt-8 block" htmlFor="help-search">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest py-4 pl-12 pr-4 text-on-surface shadow-inner outline-none transition-all placeholder:text-outline focus:border-primary/60 focus:bg-surface-container-highest"
                  id="help-search"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Örn. teklif verme, cüzdan, ihale kuralları"
                  type="search"
                  value={searchTerm}
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">forum</span>
              Sık Sorulan Sorular
            </h2>

            {filteredFaqItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredFaqItems.map((item) => (
                  <details
                    className="group rounded-xl border border-outline-variant/10 bg-surface-container-low p-5 transition-colors hover:border-primary/30 open:border-primary/40"
                    key={item.question}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-bold text-on-surface">
                      <span>{item.question}</span>
                      <span className="material-symbols-outlined text-outline transition-transform group-open:rotate-180 group-open:text-primary">
                        expand_more
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low p-8 text-center text-on-surface-variant">
                Aramana uygun bir sonuç bulunamadı.
              </div>
            )}
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
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          channel.tone === 'secondary'
                            ? 'text-secondary'
                            : 'text-primary'
                        }`}
                      >
                        {channel.icon}
                      </span>
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
