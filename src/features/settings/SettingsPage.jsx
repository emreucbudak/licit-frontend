import { useEffect, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'

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
  useEffect(() => {
    let isCurrent = true

    async function loadProfile() {
      setIsProfileLoading(true)
      setProfileError('')

      try {
        const { payload, response } = await sendAuthorizedRequest('/api/auth/me')

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(payload, 'Profil bilgileri yüklenemedi.'),
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
          setProfileError(
            getUserFacingErrorMessage(error, 'Profil bilgileri yüklenemedi.'),
          )
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

  const profileValues = {
    email: profile?.email || '',
  }

  const normalizedProfileForm = {
    firstName: profileForm.firstName.trim(),
    lastName: profileForm.lastName.trim(),
  }

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
        throw new Error(getApiErrorMessage(payload, 'Profil güncellenemedi.'))
      }

      setProfile(payload)
      setProfileForm({
        firstName: payload?.firstName || '',
        lastName: payload?.lastName || '',
      })
      setProfileStatus({
        message: 'Profil başarıyla güncellendi.',
        type: 'success',
      })
    } catch (error) {
      setProfileStatus({
        message: getUserFacingErrorMessage(error, 'Profil güncellenemedi.'),
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
        message: 'Yeni şifreler eşleşmiyor.',
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
        throw new Error(getApiErrorMessage(payload, 'Şifre güncellenemedi.'))
      }

      setPasswordForm({
        confirmPassword: '',
        currentPassword: '',
        newPassword: '',
      })
      setPasswordStatus({
        message: 'Şifre başarıyla güncellendi.',
        type: 'success',
      })
    } catch (error) {
      setPasswordStatus({
        message: getUserFacingErrorMessage(error, 'Şifre güncellenemedi.'),
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
                Profilini ve güvenlik tercihlerini tek yerden yönet.
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
                    ? 'Ad ve soyad alanları zorunludur.'
                    : undefined
                }
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section
              className="rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-12"
              id="profil"
            >
              <div className="mb-8 flex items-center gap-3">
                <h2 className="text-xl font-bold">Profil Bilgileri</h2>
              </div>

              <form
                className="grid grid-cols-1 gap-6"
                id="settings-profile-form"
                onSubmit={handleProfileSubmit}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      value={isProfileLoading ? 'Yükleniyor...' : profileForm.firstName}
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
                      value={isProfileLoading ? 'Yükleniyor...' : profileForm.lastName}
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      E-posta Adresi
                    </span>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                      readOnly
                      type="email"
                      value={isProfileLoading ? 'Yükleniyor...' : profileValues.email}
                    />
                  </label>

                </div>
              </form>
            </section>

            <section
              className="rounded-xl border border-outline-variant/10 bg-surface-variant/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-12"
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
                      {isPasswordSaving ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
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
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
