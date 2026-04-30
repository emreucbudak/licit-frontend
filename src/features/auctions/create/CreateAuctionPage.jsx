import { useEffect, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../../shared/components/navigation/AppNavigation'
import { sendAuthorizedRequest } from '../../../shared/api/authorizedRequest'
import { getApiErrorMessage } from '../../../shared/api/apiError'
import {
  flattenSubCategoryOptions,
  normalizeCategoryTree,
} from './categoryOptions'
import TenderRulesEditor from '../rules/TenderRulesEditor'
import { buildTenderRulePayload } from '../rules/tenderRuleUtils'

const previewImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCEmI0z_YuP3x3BkXaINgNm4oQ4DHezF5XTTEjwh-70YPkKbgx1IYxq0koBKWQccZpreJLFFpkezKTdgTNXPtUqrgOOZKYT8ckcuXNQDwdeEtxj-jt-Geql1-IRNTpvgp35ZDgHl74pVzf5DjITuyboTLPceLctGcnbD84hh9THRfLtGsLfE3L0mGr4gvuKiHkanvdupB8_Ky44VsZ-lMtOfaC17lsVJBXbRLe2U9nd78B8OBiMbRtCAyzVnakb_FXHaf6Rh93fPlY'

const durationOptions = [
  { days: 3, label: '3 Gun' },
  { days: 5, label: '5 Gun' },
  { days: 7, label: '7 Gun' },
  { days: 14, label: '14 Gun' },
]

function getTodayInputValue() {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

function createStartDate(dateValue) {
  const today = getTodayInputValue()
  const selectedDate = new Date(`${dateValue}T09:00:00`)

  if (dateValue === today && selectedDate < new Date()) {
    return new Date()
  }

  return selectedDate
}

function createEndDate(startDate, durationDays) {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + Number(durationDays))
  return endDate
}

const initialFormValues = {
  title: '',
  mainCategoryId: '',
  categoryId: '',
  startingPrice: '',
  description: '',
  durationDays: '7',
  startDate: getTodayInputValue(),
  rules: [],
}

function CreateAuctionPage({ navigate, onLogout }) {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [createdTenderId, setCreatedTenderId] = useState('')
  const [submitMode, setSubmitMode] = useState('')
  const isSubmitting = Boolean(submitMode)
  const isSavingDraft = submitMode === 'draft'
  const isPublishing = submitMode === 'publish'
  const selectedMainCategory = categories.find(
    (category) => category.id === formValues.mainCategoryId,
  )
  const subCategoryOptions = flattenSubCategoryOptions(
    selectedMainCategory?.children || [],
  )

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      setIsLoadingCategories(true)
      setCategoryError('')

      try {
        const { payload, response } = await sendAuthorizedRequest('/api/categories')

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              'Kategoriler yuklenemedi. Lutfen tekrar dene.',
            ),
          )
        }

        const nextCategories = normalizeCategoryTree(payload)

        if (!isMounted) {
          return
        }

        setCategories(nextCategories)
        setFormValues((currentValues) => {
          const currentMainCategory = nextCategories.find(
            (category) => category.id === currentValues.mainCategoryId,
          )

          if (currentMainCategory) {
            const currentSubCategories = flattenSubCategoryOptions(
              currentMainCategory.children || [],
            )

            return {
              ...currentValues,
              categoryId: currentSubCategories.some(
                (category) => category.id === currentValues.categoryId,
              )
                ? currentValues.categoryId
                : '',
            }
          }

          return {
            ...currentValues,
            mainCategoryId: nextCategories[0]?.id || '',
            categoryId: '',
          }
        })
      } catch (error) {
        if (isMounted) {
          setCategoryError(
            error?.message || 'Kategoriler yuklenemedi. Lutfen tekrar dene.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
      ...(name === 'mainCategoryId' ? { categoryId: '' } : {}),
    }))
    setSubmitError('')
    setSubmitSuccess('')
  }

  const buildPayload = () => {
    const title = formValues.title.trim()
    const description = formValues.description.trim()
    const startingPrice = Number(formValues.startingPrice)

    if (!title || !description || !formValues.startDate) {
      throw new Error('Lutfen urun detaylarini eksiksiz doldur.')
    }

    if (!formValues.mainCategoryId) {
      throw new Error('Lutfen once ana kategori sec.')
    }

    if (!formValues.categoryId) {
      throw new Error('Lutfen alt kategori sec. Ihaleler alt kategoriye gore filtrelenecek.')
    }

    if (!Number.isFinite(startingPrice) || startingPrice < 0) {
      throw new Error('Baslangic fiyati 0 veya daha buyuk olmali.')
    }

    const startDate = createStartDate(formValues.startDate)
    const endDate = createEndDate(startDate, formValues.durationDays)

    return {
      title,
      description,
      startingPrice,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      categoryId: formValues.categoryId,
      rules: buildTenderRulePayload(formValues.rules),
    }
  }

  const handleSubmit = async (event, shouldPublish = false) => {
    event?.preventDefault()

    if (isSubmitting) {
      return
    }

    setSubmitError('')
    setSubmitSuccess('')
    setCreatedTenderId('')
    setSubmitMode(shouldPublish ? 'publish' : 'draft')

    try {
      const { payload, response } = await sendAuthorizedRequest('/api/tender', {
        method: 'POST',
        body: buildPayload(),
      })

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            'Muzayede olusturulamadi. Lutfen tekrar dene.',
          ),
        )
      }

      if (!payload?.id) {
        throw new Error('Muzayede olusturuldu ama sonuc kimligi alinamadi.')
      }

      setCreatedTenderId(payload.id)

      if (shouldPublish) {
        const {
          payload: statusPayload,
          response: statusResponse,
        } = await sendAuthorizedRequest(`/api/tender/${payload.id}/status`, {
          method: 'PATCH',
          body: {
            status: 'Active',
          },
        })

        if (!statusResponse.ok) {
          throw new Error(
            getApiErrorMessage(
              statusPayload,
              'Taslak olustu ancak muzayede yayina alinamadi.',
            ),
          )
        }
      }

      setSubmitSuccess(
        shouldPublish
          ? 'Muzayede olusturuldu ve yayina alindi.'
          : 'Muzayede taslak olarak kaydedildi.',
      )
      setFormValues({
        ...initialFormValues,
        mainCategoryId: categories[0]?.id || '',
        rules: [],
      })
    } catch (error) {
      setSubmitError(
        error?.message || 'Muzayede olusturulamadi. Lutfen tekrar dene.',
      )
    } finally {
      setSubmitMode('')
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <AppTopNavbar currentPath="/auctions/create" navigate={navigate} />
      <AppSideNavbar
        currentPath="/auctions/create"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="min-h-screen px-4 pb-28 pt-24 sm:px-6 lg:ml-64 lg:px-8 lg:pb-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Yeni Başvuru
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                Yeni Müzayede Oluştur
              </h1>
              <p className="mt-2 max-w-lg text-on-surface-variant">
                Ürününü listele. Alıcı güvenini artırmak için detaylı
                özellikler ve net bilgiler ekle.
              </p>
            </div>

            <div className="hidden gap-3 md:flex">
              <button
                className="rounded-lg border border-outline-variant/20 bg-surface-container-high px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="button"
                onClick={(event) => handleSubmit(event, false)}
              >
                {isSavingDraft ? 'Kaydediliyor' : 'Taslak Kaydet'}
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="button"
                onClick={(event) => handleSubmit(event, true)}
              >
                {isPublishing ? 'Yayina aliniyor' : 'Muzayedeyi Yayina Al'}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form
              className="space-y-8 lg:col-span-7"
              id="create-auction-form"
              onSubmit={(event) => handleSubmit(event, false)}
            >
              {submitError ? (
                <p
                  className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
                  role="alert"
                >
                  {submitError}
                </p>
              ) : null}

              {submitSuccess ? (
                <div
                  className="rounded-lg border border-secondary/20 bg-secondary-container/30 px-4 py-3 text-sm font-medium text-secondary"
                  role="status"
                >
                  <p>{submitSuccess}</p>
                  {createdTenderId ? (
                    <p className="mt-1 font-mono text-xs text-on-surface-variant">
                      ID: {createdTenderId}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <section className="rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="material-symbols-outlined text-primary-container">
                    info
                  </span>
                  Ürün Detayları
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Ürün Başlığı
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-primary-container"
                      placeholder="Örn. Nadir Vintage Kronograf 1964"
                      maxLength="200"
                      name="title"
                      required
                      type="text"
                      value={formValues.title}
                      onChange={handleFieldChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Ana Kategori
                      </label>
                      <select
                        className="w-full appearance-none rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoadingCategories}
                        name="mainCategoryId"
                        required
                        value={formValues.mainCategoryId}
                        onChange={handleFieldChange}
                      >
                        <option value="">
                          {isLoadingCategories ? 'Kategoriler yukleniyor' : 'Ana kategori sec'}
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {categoryError ? (
                        <p className="mt-2 text-xs font-medium text-error">
                          {categoryError}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Alt Kategori
                      </label>
                      <select
                        className="w-full appearance-none rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!formValues.mainCategoryId || subCategoryOptions.length === 0}
                        name="categoryId"
                        required
                        value={formValues.categoryId}
                        onChange={handleFieldChange}
                      >
                        <option value="">
                          {formValues.mainCategoryId
                            ? 'Alt kategori sec'
                            : 'Once ana kategori sec'}
                        </option>
                        {subCategoryOptions.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {formValues.mainCategoryId && subCategoryOptions.length === 0 ? (
                        <p className="mt-2 text-xs font-medium text-error">
                          Bu ana kategori icin alt kategori bulunmuyor.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Başlangıç Fiyatı ($)
                      </label>
                      <input
                        className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-primary-container"
                        placeholder="0.00"
                        min="0"
                        name="startingPrice"
                        required
                        step="0.01"
                        type="number"
                        value={formValues.startingPrice}
                        onChange={handleFieldChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Açıklama
                    </label>
                    <textarea
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-primary-container"
                      maxLength="2000"
                      name="description"
                      placeholder="Ürünün geçmişini, durumunu ve öne çıkan özelliklerini anlat..."
                      required
                      rows="6"
                      value={formValues.description}
                      onChange={handleFieldChange}
                    ></textarea>
                  </div>
                </div>
              </section>

              <TenderRulesEditor
                disabled={isSubmitting}
                onChange={(rules) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    rules,
                  }))
                }
                rules={formValues.rules}
              />

              <section className="rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="material-symbols-outlined text-primary-container">
                    schedule
                  </span>
                  Müzayede Takvimi
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Süre
                    </label>
                    <select
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary-container"
                      name="durationDays"
                      value={formValues.durationDays}
                      onChange={handleFieldChange}
                    >
                      {durationOptions.map((duration) => (
                        <option key={duration.days} value={duration.days}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Başlangıç Tarihi
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface transition-all focus:ring-2 focus:ring-primary-container"
                      min={getTodayInputValue()}
                      name="startDate"
                      required
                      type="date"
                      value={formValues.startDate}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </section>
            </form>

            <aside className="space-y-8 lg:col-span-5">
              <section className="rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="material-symbols-outlined text-primary-container">
                    image
                  </span>
                  Ürün Resimleri
                </h2>
                <button
                  className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest/50 p-8 transition-colors hover:border-primary-container/50"
                  type="button"
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl text-primary-container">
                      upload_file
                    </span>
                  </span>
                  <span className="mb-1 font-medium text-white">
                    Yüksek çözünürlüklü görselleri sürükle ve bırak
                  </span>
                  <span className="mb-6 text-center text-sm text-on-surface-variant">
                    PNG, JPG veya WEBP desteklenir. En fazla 20MB. Önerilen oran 4:3.
                  </span>
                  <span className="rounded-lg border border-primary-container/20 bg-primary-container/10 px-4 py-2 text-sm font-bold text-primary-container transition-colors group-hover:bg-primary-container/20">
                    Dosya Seç
                  </span>
                </button>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container-high">
                    <img
                      alt="Koyu taş yüzey üzerinde beyaz kadranlı minimalist gümüş kol saati"
                      className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-100"
                      src={previewImage}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm text-white">
                        delete
                      </span>
                    </div>
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-outline-variant/20 bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-slate-700">add</span>
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-outline-variant/20 bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-slate-700">add</span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-outline-variant/10 bg-gradient-to-br from-surface-container-high to-surface-container-low p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container/20">
                    <span className="material-symbols-outlined text-secondary">
                      verified
                    </span>
                  </div>
                  <h3 className="font-bold text-white">Licit Pro İpuçları</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-1 text-sm text-primary">
                      check_circle
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Detaylı açıklamalar teklif verme oranını ciddi şekilde artırır.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-1 text-sm text-primary">
                      check_circle
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Hafta sonuna yayılan müzayedeler genellikle daha yüksek etkileşim alır.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-1 text-sm text-primary">
                      check_circle
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Farklı açılardan en az 3 yüksek çözünürlüklü fotoğraf ekle.
                    </p>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-white/5 bg-[#0b1326] p-4 md:hidden">
        <button
          className="flex-1 rounded-lg bg-surface-container-high py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="button"
          onClick={(event) => handleSubmit(event, false)}
        >
          {isSavingDraft ? 'Kaydediliyor' : 'Taslak Kaydet'}
        </button>
        <button
          className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="button"
          onClick={(event) => handleSubmit(event, true)}
        >
          {isPublishing ? 'Yayina aliniyor' : 'Yayina Al'}
        </button>
      </div>
    </div>
  )
}

export default CreateAuctionPage
