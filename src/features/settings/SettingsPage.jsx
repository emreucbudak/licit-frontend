import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'

const profileAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBRljr7YaJ_oWQZEY8qFX7vRVl8ITpebpEKpwBk4k47oODTiuvrom4gbZgmapINGaFLiaWXsQJEFSFc6NFCVkR3umm5o18Uodt8-jPFwWjMUiI1pEuWJDiPGcOUjDg1-VwEeLxqdsIESvraCSQ-dM0DlE9Dk2GPHprazaES2vtj6A-8jhbMOIpmJwgAcRsjQihE7Nh8bNcEwRzc3QyxwaNptpzPjJFo3YEiEs2eawr4kz_xh0ApRS3Ef98oXW4AeVG6rbe60SuTTM4'

const settingsTabs = [
  ['person', 'Profil'],
  ['shield', 'Güvenlik'],
  ['notifications_active', 'Bildirimler'],
  ['payments', 'Ödemeler'],
]

const alertRows = [
  {
    title: 'Müzayede başlangıç uyarıları',
    description: 'Takip ettiğin lotlar yayına alındığında',
    channels: ['mail'],
  },
  {
    title: 'Geçilme bildirimleri',
    description: 'Teklifin geçildiğinde anında haber ver',
    channels: ['mail', 'smartphone', 'chat_bubble'],
  },
  {
    title: 'Teklif önerileri',
    description: 'İlgine göre seçilmiş ürün tavsiyeleri',
    channels: [],
  },
]

function ChannelButton({ icon, active }) {
  return (
    <button
      className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
        active
          ? 'bg-primary/20 text-primary hover:bg-primary/30'
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
      }`}
      type="button"
      aria-label={icon}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
    </button>
  )
}

function Toggle({ checked = false, tone = 'secondary' }) {
  const checkedColor = tone === 'primary' ? 'peer-checked:bg-primary' : 'peer-checked:bg-secondary'

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input className="peer sr-only" defaultChecked={checked} type="checkbox" />
      <span
        className={`h-6 w-11 rounded-full bg-surface-container-highest transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white ${checkedColor}`}
      ></span>
    </label>
  )
}

function SettingsPage({ navigate, onLogout }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <AppTopNavbar
        currentPath="/settings"
        navigate={navigate}
        searchPlaceholder="Hesap ayarlarında ara..."
      />
      <AppSideNavbar
        currentPath="/settings"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-white">
                Hesap Ayarları
              </h1>
              <p className="text-on-surface-variant">
                Profilini, güvenlik tercihlerini ve ödeme ayarlarını tek yerden yönet.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-surface-container-high px-5 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
                type="button"
              >
                Vazgeç
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-5 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
                type="button"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </header>

          <nav
            className="grid grid-cols-2 gap-2 rounded-xl border border-outline-variant/10 bg-surface-container/50 p-2 md:grid-cols-4"
            aria-label="Hesap ayarları bölümleri"
          >
            {settingsTabs.map(([icon, label], index) => (
              <a
                key={label}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  index === 0
                    ? 'bg-slate-800/70 text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
                href={`#${label.toLocaleLowerCase('tr-TR')}`}
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
                {label}
              </a>
            ))}
          </nav>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section
              className="rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-8"
              id="profil"
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  account_circle
                </span>
                <h2 className="text-xl font-bold">Profil Bilgileri</h2>
              </div>

              <div className="flex flex-col gap-10 md:flex-row">
                <div className="flex flex-col items-center gap-4">
                  <div className="group relative">
                    <div className="h-32 w-32 overflow-hidden rounded-2xl border-2 border-primary/20 bg-surface-container-lowest transition-colors group-hover:border-primary/50">
                      <img
                        alt="Kullanıcı profil görseli"
                        className="h-full w-full object-cover"
                        src={profileAvatar}
                      />
                    </div>
                    <button
                      className="absolute -bottom-2 -right-2 rounded-lg bg-primary p-2 text-on-primary shadow-xl transition-transform hover:scale-110"
                      type="button"
                      aria-label="Avatarı düzenle"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Avatarı Güncelle
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Görünen Ad
                    </span>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      defaultValue="Alexander Vance"
                      type="text"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Kullanıcı Adı
                    </span>
                    <span className="relative block">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/50">
                        @
                      </span>
                      <input
                        className="w-full rounded-lg border-none bg-surface-container-lowest py-2.5 pl-8 pr-4 text-sm focus:ring-1 focus:ring-primary"
                        defaultValue="vance_licit"
                        type="text"
                      />
                    </span>
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      E-posta Adresi
                    </span>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      defaultValue="alex.v@licit-market.io"
                      type="email"
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Koleksiyoner Biyografisi
                    </span>
                    <textarea
                      className="w-full resize-none rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      defaultValue="Gelişen dijital varlıklara ve nadir koleksiyon ürünlerine odaklanan stratejik koleksiyoner. 12 yıllık pazar deneyimi."
                      placeholder="Koleksiyoner biyografini gir..."
                      rows="3"
                    ></textarea>
                  </label>
                </div>
              </div>
            </section>

            <section
              className="flex flex-col justify-between rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-4"
              id="ödemeler"
            >
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">
                    account_balance_wallet
                  </span>
                  <h2 className="text-xl font-bold">Ödeme ve Cüzdan</h2>
                </div>

                <div className="mb-6 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Aktif Cüzdan
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="truncate font-mono text-sm text-primary">
                      0x71C...3F29
                    </span>
                    <button
                      className="text-on-surface-variant transition-colors hover:text-white"
                      type="button"
                      aria-label="Cüzdan adresini kopyala"
                    >
                      <span className="material-symbols-outlined text-sm">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    className="group flex w-full items-center justify-between text-left"
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-surface-container-high">
                        <span className="material-symbols-outlined text-lg">
                          history
                        </span>
                      </span>
                      <span className="text-sm">İşlem Geçmişi</span>
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1">
                      chevron_right
                    </span>
                  </button>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-surface-container-high">
                        <span className="material-symbols-outlined text-lg">
                          currency_exchange
                        </span>
                      </span>
                      <span className="text-sm">Para Birimi</span>
                    </span>
                    <select
                      className="cursor-pointer border-none bg-transparent text-sm font-bold text-primary focus:ring-0"
                      defaultValue="USD ($)"
                    >
                      <option>USD ($)</option>
                      <option>ETH (Ξ)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                className="mt-8 w-full rounded-lg border-2 border-secondary/30 py-3 font-bold text-secondary transition-colors hover:bg-secondary/5"
                type="button"
              >
                Yeni Ödeme Yöntemi Ekle
              </button>
            </section>

            <section
              className="rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-7"
              id="güvenlik"
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">lock</span>
                <h2 className="text-xl font-bold">Güvenlik Ayarları</h2>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                    Şifreyi Güncelle
                  </h3>
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      placeholder="Mevcut şifre"
                      type="password"
                    />
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      placeholder="Yeni şifre"
                      type="password"
                    />
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      placeholder="Yeni şifreyi onayla"
                      type="password"
                    />
                  </div>
                  <button className="text-sm font-bold text-primary hover:underline" type="button">
                    Şifreni mi unuttun?
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border-l-4 border-secondary bg-surface-container-high/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold">
                          İki Aşamalı Doğrulama
                        </h3>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          Hesabına ekstra bir güvenlik katmanı ekle.
                        </p>
                      </div>
                      <Toggle checked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                      Aktif Oturumlar
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-lowest/50 px-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-on-surface-variant">
                            laptop_mac
                          </span>
                          <div>
                            <p className="text-xs font-medium">MacOS - Chrome</p>
                            <p className="text-[10px] text-secondary">
                              Şu anda aktif
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-[10px] font-bold text-error/60 hover:text-error"
                          type="button"
                        >
                          SONLANDIR
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-lowest/50 px-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-on-surface-variant">
                            smartphone
                          </span>
                          <div>
                            <p className="text-xs font-medium">iPhone 15 Pro - App</p>
                            <p className="text-[10px] text-on-surface-variant">
                              İstanbul, TR
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-[10px] font-bold text-error/60 hover:text-error"
                          type="button"
                        >
                          SONLANDIR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-5"
              id="bildirimler"
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">
                  notifications_active
                </span>
                <h2 className="text-xl font-bold">Bildirim Tercihleri</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  {alertRows.map((row) => (
                    <div
                      className="flex items-center justify-between gap-4"
                      key={row.title}
                    >
                      <div>
                        <p className="text-sm font-medium">{row.title}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {row.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {['mail', 'smartphone', 'chat_bubble'].map((icon) => (
                          <ChannelButton
                            active={row.channels.includes(icon)}
                            icon={icon}
                            key={`${row.title}-${icon}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-high/30 p-4">
                  <h3 className="mb-2 text-xs font-bold">Sessiz Saatler</h3>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-on-surface-variant">
                      Gece yarısından sonra push bildirimlerini sustur
                    </span>
                    <div className="scale-75 origin-right">
                      <Toggle tone="primary" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
