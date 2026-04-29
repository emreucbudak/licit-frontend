import { useEffect, useMemo, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import { getApiErrorMessage } from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'

const profileAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBRljr7YaJ_oWQZEY8qFX7vRVl8ITpebpEKpwBk4k47oODTiuvrom4gbZgmapINGaFLiaWXsQJEFSFc6NFCVkR3umm5o18Uodt8-jPFwWjMUiI1pEuWJDiPGcOUjDg1-VwEeLxqdsIESvraCSQ-dM0DlE9Dk2GPHprazaES2vtj6A-8jhbMOIpmJwgAcRsjQihE7Nh8bNcEwRzc3QyxwaNptpzPjJFo3YEiEs2eawr4kz_xh0ApRS3Ef98oXW4AeVG6rbe60SuTTM4'

const settingsTabs = [
  ['person', 'Profil'],
  ['shield', 'Güvenlik'],
  ['notifications_active', 'Bildirimler'],
]

const notificationOptions = [
  {
    key: 'email',
    title: 'Email bildirimleri',
    description: 'Hesap ve ihale gelismelerini email ile al.',
    tone: 'primary',
  },
  {
    key: 'onsite',
    title: 'Site ici bildirimler',
    description: 'Bildirimleri uygulama icinde goster.',
    tone: 'secondary',
  },
]

function Toggle({ checked = false, onChange, tone = 'secondary' }) {
  const checkedColor = tone === 'primary' ? 'peer-checked:bg-primary' : 'peer-checked:bg-secondary'

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        checked={checked}
        className="peer sr-only"
        onChange={onChange}
        type="checkbox"
      />
      <span
        className={`h-6 w-11 rounded-full bg-surface-container-highest transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white ${checkedColor}`}
      ></span>
    </label>
  )
}

function getFullName(profile) {
  return [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
}

function getUsernameFallback(profile) {
  const fullName = getFullName(profile)
  const emailPrefix = profile?.email?.split('@')[0]
  const source = fullName || emailPrefix || 'licit_user'
  const username = source
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return username || emailPrefix || 'licit_user'
}

function SettingsPage({ navigate, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  })
  const [profileError, setProfileError] = useState('')
  const [profileStatus, setProfileStatus] = useState({
    message: '',
    type: '',
  })
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    confirmPassword: '',
    currentPassword: '',
    newPassword: '',
  })
  const [passwordStatus, setPasswordStatus] = useState({
    message: '',
    type: '',
  })
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    onsite: true,
  })

  function toggleNotificationPreference(key) {
    setNotificationPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  useEffect(() => {
    let isCurrent = true

    async function loadProfile() {
      setIsProfileLoading(true)
      setProfileError('')

      try {
        const { payload, response } = await sendAuthorizedRequest('/api/auth/me')

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(payload, 'Profil bilgileri yuklenemedi.'),
          )
        }

        if (isCurrent) {
          setProfile(payload)
          setProfileForm({
            firstName: payload?.firstName || '',
            lastName: payload?.lastName || '',
          })
        }
      } catch (error) {
        if (isCurrent) {
          setProfileError(error.message || 'Profil bilgileri yuklenemedi.')
        }
      } finally {
        if (isCurrent) {
          setIsProfileLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isCurrent = false
    }
  }, [])

  const profileValues = useMemo(
    () => ({
      email: profile?.email || '',
      username: getUsernameFallback(profile),
    }),
    [profile],
  )

  const normalizedProfileForm = useMemo(
    () => ({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
    }),
    [profileForm],
  )

  const isProfileDirty =
    normalizedProfileForm.firstName !== (profile?.firstName || '').trim() ||
    normalizedProfileForm.lastName !== (profile?.lastName || '').trim()

  const isProfileValid =
    normalizedProfileForm.firstName.length > 0 &&
    normalizedProfileForm.lastName.length > 0

  const isProfileSubmitDisabled =
    isProfileLoading || isProfileSaving || !isProfileDirty || !isProfileValid

  function updateProfileField(event) {
    const { name, value } = event.target

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setProfileStatus({ message: '', type: '' })
  }

  function resetProfileForm() {
    setProfileForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
    })
    setProfileStatus({ message: '', type: '' })
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()

    if (!isProfileDirty || !isProfileValid) {
      return
    }

    setIsProfileSaving(true)
    setProfileStatus({ message: '', type: '' })

    try {
      const { payload, response } = await sendAuthorizedRequest('/api/auth/me', {
        body: normalizedProfileForm,
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, 'Profil guncellenemedi.'))
      }

      setProfile(payload)
      setProfileForm({
        firstName: payload?.firstName || '',
        lastName: payload?.lastName || '',
      })
      setProfileStatus({
        message: 'Profil basariyla guncellendi.',
        type: 'success',
      })
    } catch (error) {
      setProfileStatus({
        message: error.message || 'Profil guncellenemedi.',
        type: 'error',
      })
    } finally {
      setIsProfileSaving(false)
    }
  }

  function updatePasswordField(event) {
    const { name, value } = event.target

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setPasswordStatus({ message: '', type: '' })
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        message: 'Yeni sifreler eslesmiyor.',
        type: 'error',
      })
      return
    }

    setIsPasswordSaving(true)
    setPasswordStatus({ message: '', type: '' })

    try {
      const { payload, response } = await sendAuthorizedRequest(
        '/api/auth/change-password',
        {
          body: {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          },
          method: 'POST',
        },
      )

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, 'Sifre guncellenemedi.'))
      }

      setPasswordForm({
        confirmPassword: '',
        currentPassword: '',
        newPassword: '',
      })
      setPasswordStatus({
        message: 'Sifre basariyla guncellendi.',
        type: 'success',
      })
    } catch (error) {
      setPasswordStatus({
        message: error.message || 'Sifre guncellenemedi.',
        type: 'error',
      })
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const isPasswordSubmitDisabled =
    isPasswordSaving ||
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword

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
                Profilini, güvenlik tercihlerini ve bildirim ayarlarını tek yerden yönet.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-surface-container-high px-5 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
                disabled={!isProfileDirty || isProfileSaving}
                onClick={resetProfileForm}
                type="button"
              >
                Vazgeç
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-5 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isProfileSubmitDisabled}
                form="settings-profile-form"
                type="submit"
                title={
                  isProfileDirty && !isProfileValid
                    ? 'Ad ve soyad alanlari zorunludur.'
                    : undefined
                }
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </header>

          <nav
            className="grid grid-cols-1 gap-2 rounded-xl border border-outline-variant/10 bg-surface-container/50 p-2 sm:grid-cols-3"
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
              className="rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-12"
              id="profil"
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  account_circle
                </span>
                <h2 className="text-xl font-bold">Profil Bilgileri</h2>
              </div>

              <form
                className="flex flex-col gap-10 md:flex-row"
                id="settings-profile-form"
                onSubmit={handleProfileSubmit}
              >
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
                      className="absolute -bottom-2 -right-2 cursor-not-allowed rounded-lg bg-primary p-2 text-on-primary opacity-60 shadow-xl"
                      disabled
                      type="button"
                      aria-label="Avatarı düzenle"
                      title="Avatar guncelleme API'si henuz yok."
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Avatarı Güncelle
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                  {profileError ? (
                    <p className="rounded-lg bg-error/10 px-4 py-2 text-sm font-semibold text-error md:col-span-2">
                      {profileError}
                    </p>
                  ) : null}
                  {profileStatus.message ? (
                    <p
                      className={`rounded-lg px-4 py-2 text-sm font-semibold md:col-span-2 ${
                        profileStatus.type === 'success'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {profileStatus.message}
                    </p>
                  ) : null}
                  <label className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Görünen Ad
                    </span>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      disabled={isProfileLoading || isProfileSaving}
                      name="firstName"
                      onChange={updateProfileField}
                      placeholder="Ad"
                      type="text"
                      value={isProfileLoading ? 'Yukleniyor...' : profileForm.firstName}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Soyad
                    </span>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      disabled={isProfileLoading || isProfileSaving}
                      name="lastName"
                      onChange={updateProfileField}
                      placeholder="Soyad"
                      type="text"
                      value={isProfileLoading ? 'Yukleniyor...' : profileForm.lastName}
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
                        readOnly
                        type="text"
                        value={isProfileLoading ? '...' : profileValues.username}
                      />
                    </span>
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      E-posta Adresi
                    </span>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      readOnly
                      type="email"
                      value={isProfileLoading ? 'Yukleniyor...' : profileValues.email}
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Koleksiyoner Biyografisi
                    </span>
                    <textarea
                      className="w-full resize-none rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      placeholder="Biyografi guncelleme API'si henuz yok."
                      readOnly
                      rows="3"
                      value=""
                    ></textarea>
                  </label>
                </div>
              </form>
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
                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                    Şifreyi Güncelle
                  </h3>
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      name="currentPassword"
                      onChange={updatePasswordField}
                      placeholder="Mevcut şifre"
                      type="password"
                      value={passwordForm.currentPassword}
                    />
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      name="newPassword"
                      onChange={updatePasswordField}
                      placeholder="Yeni şifre"
                      type="password"
                      value={passwordForm.newPassword}
                    />
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      name="confirmPassword"
                      onChange={updatePasswordField}
                      placeholder="Yeni şifreyi onayla"
                      type="password"
                      value={passwordForm.confirmPassword}
                    />
                  </div>
                  {passwordStatus.message ? (
                    <p
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        passwordStatus.type === 'success'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {passwordStatus.message}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isPasswordSubmitDisabled}
                      type="submit"
                    >
                      {isPasswordSaving ? 'Kaydediliyor...' : 'Sifreyi Guncelle'}
                    </button>
                    <button className="text-sm font-bold text-primary hover:underline" type="button">
                      Şifreni mi unuttun?
                    </button>
                  </div>
                </form>

                <div className="space-y-6">
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
                  {notificationOptions.map((option) => (
                    <div
                      className="flex items-center justify-between gap-4"
                      key={option.key}
                    >
                      <div>
                        <p className="text-sm font-medium">{option.title}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {option.description}
                        </p>
                      </div>
                      <div className="scale-75 origin-right">
                        <Toggle
                          checked={notificationPreferences[option.key]}
                          onChange={() =>
                            toggleNotificationPreference(option.key)
                          }
                          tone={option.tone}
                        />
                      </div>
                    </div>
                  ))}
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
