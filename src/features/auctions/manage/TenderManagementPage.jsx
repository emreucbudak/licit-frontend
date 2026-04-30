import { useEffect, useMemo, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../../shared/components/navigation/AppNavigation'
import { sendAuthorizedRequest } from '../../../shared/api/authorizedRequest'
import { getApiErrorMessage } from '../../../shared/api/apiError'
import {
  findCategorySelection,
  flattenSubCategoryOptions,
  normalizeCategoryTree,
} from '../create/categoryOptions'
import TenderRulesEditor from '../rules/TenderRulesEditor'
import {
  buildTenderRulePayload,
  normalizeTenderRules,
} from '../rules/tenderRuleUtils'
import {
  uploadTenderImage,
  validateTenderImageFile,
} from '../images/tenderImageUpload'

const pageSizeOptions = [10, 20, 50]

const statusLabels = {
  active: 'Açık',
  cancelled: 'İptal edildi',
  closed: 'Bitti',
  completed: 'Tamamlandı',
  draft: 'Taslak',
}

const nextStatusesByStatus = {
  active: ['Closed', 'Cancelled'],
  closed: ['Completed'],
  draft: ['Active', 'Cancelled'],
}

function createEmptyEditValues() {
  return {
    title: '',
    description: '',
    startingPrice: '',
    startDate: '',
    endDate: '',
    mainCategoryId: '',
    categoryId: '',
    imageUrl: '',
    rules: [],
  }
}

function readField(source, ...keys) {
  if (!source || typeof source !== 'object') {
    return undefined
  }

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key]
    }
  }

  return undefined
}

function toId(value) {
  return value === undefined || value === null ? '' : String(value)
}

function toNumber(value, fallback = 0) {
  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? numericValue : fallback
}

function normalizeStatus(status) {
  return String(status || '').trim()
}

function normalizeStatusKey(status) {
  return normalizeStatus(status).toLowerCase()
}

function getStatusLabel(status) {
  const normalizedStatus = normalizeStatusKey(status)

  return statusLabels[normalizedStatus] || normalizeStatus(status) || 'Bilinmiyor'
}

function getStatusBadgeClass(status) {
  switch (normalizeStatusKey(status)) {
    case 'active':
      return 'border-secondary/30 bg-secondary/10 text-secondary'
    case 'cancelled':
      return 'border-error/30 bg-error/10 text-error'
    case 'closed':
      return 'border-tertiary/30 bg-tertiary/10 text-tertiary'
    case 'completed':
      return 'border-primary/30 bg-primary/10 text-primary'
    default:
      return 'border-outline-variant/30 bg-surface-container-high text-on-surface-variant'
  }
}

function getNextStatuses(status) {
  return nextStatusesByStatus[normalizeStatusKey(status)] || []
}

function formatMoney(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return '-'
  }

  return new Intl.NumberFormat('tr-TR', {
    currency: 'TRY',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: 'currency',
  }).format(numericValue)
}

function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function toDateTimeInputValue(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function normalizeTender(tender) {
  return {
    id: toId(readField(tender, 'id', 'Id')),
    title: readField(tender, 'title', 'Title') || 'Basliksiz ihale',
    description: readField(tender, 'description', 'Description') || '',
    startingPrice: readField(
      tender,
      'startingPrice',
      'StartingPrice',
      'startPrice',
      'StartPrice',
    ),
    startDate: readField(tender, 'startDate', 'StartDate', 'startsAt', 'starts_at'),
    endDate: readField(tender, 'endDate', 'EndDate', 'endsAt', 'ends_at'),
    status: readField(tender, 'status', 'Status') || 'Draft',
    categoryId: toId(readField(tender, 'categoryId', 'CategoryId')),
    categoryName: readField(tender, 'categoryName', 'CategoryName') || 'Kategori yok',
    createdAt: readField(tender, 'createdAt', 'CreatedAt'),
    imageUrl: readField(tender, 'imageUrl', 'ImageUrl', 'image_url') || '',
    ruleCount: toNumber(readField(tender, 'ruleCount', 'RuleCount'), 0),
  }
}

function readTenderList(payload) {
  const candidateLists = [
    payload?.tenders,
    payload?.Tenders,
    payload?.items,
    payload?.Items,
    payload?.data?.tenders,
    payload?.data?.Tenders,
    payload?.data,
    payload,
  ]

  return candidateLists.find((candidate) => Array.isArray(candidate)) || []
}

function flattenCategoryFilterOptions(categories, prefix = '') {
  return categories.flatMap((category) => {
    const label = prefix ? `${prefix} / ${category.name}` : category.name

    return [
      {
        id: category.id,
        label,
      },
      ...flattenCategoryFilterOptions(category.children || [], label),
    ]
  })
}

function buildPagination(payload, fallbackPage, fallbackPageSize, visibleCount) {
  const totalCount = toNumber(
    readField(payload, 'totalCount', 'TotalCount', 'total_count'),
    visibleCount,
  )
  const pageSize = toNumber(
    readField(payload, 'pageSize', 'PageSize', 'page_size'),
    fallbackPageSize,
  )
  const totalPages = Math.max(
    1,
    toNumber(
      readField(payload, 'totalPages', 'TotalPages', 'total_pages'),
      Math.ceil(totalCount / Math.max(pageSize, 1)) || 1,
    ),
  )
  const page = toNumber(readField(payload, 'page', 'Page'), fallbackPage)

  return {
    totalCount,
    totalPages,
    page,
    pageSize,
    hasNextPage:
      readField(payload, 'hasNextPage', 'HasNextPage', 'has_next_page') ??
      page < totalPages,
    hasPreviousPage:
      readField(payload, 'hasPreviousPage', 'HasPreviousPage', 'has_previous_page') ??
      page > 1,
  }
}

function TenderManagementPage({ navigate, onLogout }) {
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [tenders, setTenders] = useState([])
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    page: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [listError, setListError] = useState('')
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyAction, setBusyAction] = useState('')
  const [editingTenderId, setEditingTenderId] = useState('')
  const [editValues, setEditValues] = useState(createEmptyEditValues)
  const [editImageFile, setEditImageFile] = useState(null)
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState('')
  const [editImageError, setEditImageError] = useState('')

  const selectedMainCategory = categories.find(
    (category) => category.id === editValues.mainCategoryId,
  )
  const subCategoryOptions = useMemo(
    () => flattenSubCategoryOptions(selectedMainCategory?.children || []),
    [selectedMainCategory],
  )
  const categoryFilterOptions = useMemo(
    () => flattenCategoryFilterOptions(categories),
    [categories],
  )
  const isSelectedCategoryVisible = subCategoryOptions.some(
    (category) => category.id === editValues.categoryId,
  )
  const isSavingEdit = busyAction === `save:${editingTenderId}`

  useEffect(
    () => () => {
      if (editImagePreviewUrl) {
        URL.revokeObjectURL(editImagePreviewUrl)
      }
    },
    [editImagePreviewUrl],
  )

  useEffect(() => {
    let isCurrent = true

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

        if (isCurrent) {
          setCategories(normalizeCategoryTree(payload))
        }
      } catch (error) {
        if (isCurrent) {
          setCategoryError(
            error?.message || 'Kategoriler yuklenemedi. Lutfen tekrar dene.',
          )
        }
      } finally {
        if (isCurrent) {
          setIsLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    async function loadTenders() {
      setIsLoading(true)
      setListError('')

      try {
        const tenderParams = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        })

        if (filterCategoryId) {
          tenderParams.set('categoryId', filterCategoryId)
        }

        const tenderPath = `/api/tender?${tenderParams.toString()}`
        const { payload, response } = await sendAuthorizedRequest(tenderPath)

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              'Ihaleler yuklenemedi. Lutfen tekrar dene.',
            ),
          )
        }

        const nextTenders = readTenderList(payload).map(normalizeTender)
        const nextPagination = buildPagination(
          payload,
          page,
          pageSize,
          nextTenders.length,
        )

        if (!isCurrent) {
          return
        }

        if (page > nextPagination.totalPages) {
          setPage(nextPagination.totalPages)
          return
        }

        setTenders(nextTenders)
        setPagination(nextPagination)
      } catch (error) {
        if (isCurrent) {
          setTenders([])
          setListError(error?.message || 'Ihaleler yuklenemedi.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadTenders()

    return () => {
      isCurrent = false
    }
  }, [filterCategoryId, page, pageSize, reloadKey])

  useEffect(() => {
    if (
      !editingTenderId ||
      !editValues.categoryId ||
      editValues.mainCategoryId ||
      categories.length === 0
    ) {
      return
    }

    const selection = findCategorySelection(categories, editValues.categoryId)

    if (!selection.mainCategoryId) {
      return
    }

    setEditValues((currentValues) => ({
      ...currentValues,
      mainCategoryId: selection.mainCategoryId,
      categoryId: selection.categoryId || currentValues.categoryId,
    }))
  }, [
    categories,
    editingTenderId,
    editValues.categoryId,
    editValues.mainCategoryId,
  ])

  const startEditingTender = async (tender) => {
    if (busyAction || !tender.id) {
      return
    }

    setBusyAction(`edit:${tender.id}`)
    setActionError('')
    setNotice('')

    try {
      const { payload, response } = await sendAuthorizedRequest(
        `/api/tender/${tender.id}`,
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, 'Ihale detaylari alinamadi.'),
        )
      }

      const detail = normalizeTender(payload)
      const selection = findCategorySelection(categories, detail.categoryId)

      setEditingTenderId(detail.id || tender.id)
      setEditValues({
        title: detail.title,
        description: detail.description,
        startingPrice:
          detail.startingPrice === undefined || detail.startingPrice === null
            ? ''
            : String(detail.startingPrice),
        startDate: toDateTimeInputValue(detail.startDate),
        endDate: toDateTimeInputValue(detail.endDate),
        mainCategoryId: selection.mainCategoryId,
        categoryId: selection.categoryId || detail.categoryId,
        imageUrl: detail.imageUrl,
        rules: normalizeTenderRules(payload),
      })
      clearEditImageSelection()
    } catch (error) {
      setActionError(error?.message || 'Ihale detaylari alinamadi.')
    } finally {
      setBusyAction('')
    }
  }

  const closeEditor = () => {
    setEditingTenderId('')
    setEditValues(createEmptyEditValues())
    clearEditImageSelection()
    setActionError('')
  }

  const clearEditImageSelection = () => {
    if (editImagePreviewUrl) {
      URL.revokeObjectURL(editImagePreviewUrl)
    }

    setEditImageFile(null)
    setEditImagePreviewUrl('')
    setEditImageError('')
  }

  const handleEditImageChange = (event) => {
    const file = event.target.files?.[0]
    setActionError('')
    setNotice('')

    if (!file) {
      clearEditImageSelection()
      return
    }

    const validationError = validateTenderImageFile(file)
    if (validationError) {
      clearEditImageSelection()
      setEditImageError(validationError)
      event.target.value = ''
      return
    }

    if (editImagePreviewUrl) {
      URL.revokeObjectURL(editImagePreviewUrl)
    }

    setEditImageFile(file)
    setEditImagePreviewUrl(URL.createObjectURL(file))
    setEditImageError('')
  }

  const handleEditFieldChange = (event) => {
    const { name, value } = event.target

    setEditValues((currentValues) => ({
      ...currentValues,
      [name]: value,
      ...(name === 'mainCategoryId' ? { categoryId: '' } : {}),
    }))
    setActionError('')
    setNotice('')
  }

  const buildEditPayload = () => {
    const title = editValues.title.trim()
    const description = editValues.description.trim()
    const startingPrice = Number(editValues.startingPrice)
    const startDate = new Date(editValues.startDate)
    const endDate = new Date(editValues.endDate)

    if (!title || !description || !editValues.startDate || !editValues.endDate) {
      throw new Error('Lutfen ihale detaylarini eksiksiz doldur.')
    }

    if (!editValues.categoryId) {
      throw new Error('Lutfen alt kategori sec.')
    }

    if (!Number.isFinite(startingPrice) || startingPrice < 0) {
      throw new Error('Baslangic fiyati 0 veya daha buyuk olmali.')
    }

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      throw new Error('Bitis tarihi baslangic tarihinden sonra olmali.')
    }

    return {
      title,
      description,
      startingPrice,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      categoryId: editValues.categoryId,
      rules: buildTenderRulePayload(editValues.rules),
    }
  }

  const handleSaveEdit = async (event) => {
    event.preventDefault()

    if (!editingTenderId || busyAction) {
      return
    }

    setBusyAction(`save:${editingTenderId}`)
    setActionError('')
    setNotice('')

    try {
      const { payload, response } = await sendAuthorizedRequest(
        `/api/tender/${editingTenderId}`,
        {
          method: 'PUT',
          body: buildEditPayload(),
        },
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, 'Ihale guncellenemedi. Lutfen tekrar dene.'),
        )
      }

      if (editImageFile) {
        const {
          payload: imagePayload,
          response: imageResponse,
        } = await uploadTenderImage(editingTenderId, editImageFile)

        if (!imageResponse.ok) {
          throw new Error(
            getApiErrorMessage(
              imagePayload,
              'Ihale guncellendi ancak gorsel yuklenemedi.',
            ),
          )
        }
      }

      setNotice(editImageFile ? 'Ihale ve gorsel guncellendi.' : 'Ihale guncellendi.')
      closeEditor()
      setReloadKey((currentKey) => currentKey + 1)
    } catch (error) {
      setActionError(error?.message || 'Ihale guncellenemedi.')
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteTender = async (tender) => {
    if (busyAction || !tender.id) {
      return
    }

    const confirmed = window.confirm(
      `"${tender.title}" ihalesini silmek istiyor musun?`,
    )

    if (!confirmed) {
      return
    }

    setBusyAction(`delete:${tender.id}`)
    setActionError('')
    setNotice('')

    try {
      const { payload, response } = await sendAuthorizedRequest(
        `/api/tender/${tender.id}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, 'Ihale silinemedi. Lutfen tekrar dene.'),
        )
      }

      if (editingTenderId === tender.id) {
        closeEditor()
      }

      setNotice('Ihale silindi.')
      setTenders((currentTenders) =>
        currentTenders.filter((currentTender) => currentTender.id !== tender.id),
      )
      setReloadKey((currentKey) => currentKey + 1)
    } catch (error) {
      setActionError(error?.message || 'Ihale silinemedi.')
    } finally {
      setBusyAction('')
    }
  }

  const handleStatusChange = async (tender, nextStatus) => {
    if (busyAction || !tender.id || !nextStatus) {
      return
    }

    setBusyAction(`status:${tender.id}`)
    setActionError('')
    setNotice('')

    try {
      const { payload, response } = await sendAuthorizedRequest(
        `/api/tender/${tender.id}/status`,
        {
          method: 'PATCH',
          body: {
            status: nextStatus,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            'Ihale durumu guncellenemedi. Lutfen tekrar dene.',
          ),
        )
      }

      const updatedStatus = readField(payload, 'status', 'Status') || nextStatus

      setNotice('Ihale durumu guncellendi.')
      setTenders((currentTenders) =>
        currentTenders.map((currentTender) =>
          currentTender.id === tender.id
            ? {
                ...currentTender,
                status: updatedStatus,
              }
            : currentTender,
        ),
      )
      setReloadKey((currentKey) => currentKey + 1)
    } catch (error) {
      setActionError(error?.message || 'Ihale durumu guncellenemedi.')
    } finally {
      setBusyAction('')
    }
  }

  const handleRefresh = () => {
    setReloadKey((currentKey) => currentKey + 1)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setPage(1)
  }

  const handleFilterCategoryChange = (event) => {
    setFilterCategoryId(event.target.value)
    setPage(1)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <AppTopNavbar currentPath="/auctions/manage" navigate={navigate} />
      <AppSideNavbar
        currentPath="/auctions/manage"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Tender Operations
              </span>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                Ihale Yonetimi
              </h1>
              <p className="mt-2 max-w-2xl text-on-surface-variant">
                Kayitli ihaleleri listele, taslaklari duzenle, durum akisini
                ilerlet veya silinebilir kayitlari kaldir.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-surface-container-highest"
                href="/auctions/create"
                onClick={navigate('/auctions/create')}
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                Yeni Ihale
              </a>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                type="button"
                onClick={handleRefresh}
              >
                <span className="material-symbols-outlined text-base">sync</span>
                Yenile
              </button>
            </div>
          </header>

          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-surface-container-low p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Toplam Ihale
              </p>
              <strong className="mt-2 block text-3xl font-extrabold text-white">
                {pagination.totalCount}
              </strong>
            </div>
            <div className="rounded-lg bg-surface-container-low p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Sayfa
              </p>
              <strong className="mt-2 block text-3xl font-extrabold text-white">
                {pagination.page} / {pagination.totalPages}
              </strong>
            </div>
            <div className="rounded-lg bg-surface-container-low p-5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Sayfa Boyutu
              </label>
              <select
                className="mt-2 w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} kayit
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-lg bg-surface-container-low p-5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Kategori
              </label>
              <select
                className="mt-2 w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoadingCategories}
                value={filterCategoryId}
                onChange={handleFilterCategoryChange}
              >
                <option value="">Tum kategoriler</option>
                {categoryFilterOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {notice ? (
            <p
              className="mb-4 rounded-lg border border-secondary/20 bg-secondary-container/20 px-4 py-3 text-sm font-semibold text-secondary"
              role="status"
            >
              {notice}
            </p>
          ) : null}

          {actionError ? (
            <p
              className="mb-4 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error"
              role="alert"
            >
              {actionError}
            </p>
          ) : null}

          {editingTenderId ? (
            <section className="mb-8 rounded-xl bg-surface-container-low p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Ihaleyi Duzenle</h2>
                  <p className="text-sm text-on-surface-variant">
                    PUT /api/tender/{editingTenderId}
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-white"
                  type="button"
                  onClick={closeEditor}
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Kapat
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSaveEdit}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Baslik
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container"
                      maxLength="200"
                      name="title"
                      required
                      type="text"
                      value={editValues.title}
                      onChange={handleEditFieldChange}
                    />
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Baslangic Fiyati
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container"
                      min="0"
                      name="startingPrice"
                      required
                      step="0.01"
                      type="number"
                      value={editValues.startingPrice}
                      onChange={handleEditFieldChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Ana Kategori
                    </label>
                    <select
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isLoadingCategories}
                      name="mainCategoryId"
                      value={editValues.mainCategoryId}
                      onChange={handleEditFieldChange}
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
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={!editValues.mainCategoryId && !editValues.categoryId}
                      name="categoryId"
                      required
                      value={editValues.categoryId}
                      onChange={handleEditFieldChange}
                    >
                      <option value="">
                        {editValues.mainCategoryId
                          ? 'Alt kategori sec'
                          : 'Once ana kategori sec'}
                      </option>
                      {editValues.categoryId && !isSelectedCategoryVisible ? (
                        <option value={editValues.categoryId}>Mevcut kategori</option>
                      ) : null}
                      {subCategoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Baslangic Tarihi
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container"
                      name="startDate"
                      required
                      type="datetime-local"
                      value={editValues.startDate}
                      onChange={handleEditFieldChange}
                    />
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Bitis Tarihi
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container"
                      name="endDate"
                      required
                      type="datetime-local"
                      value={editValues.endDate}
                      onChange={handleEditFieldChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Aciklama
                  </label>
                  <textarea
                    className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container"
                    maxLength="2000"
                    name="description"
                    required
                    rows="5"
                    value={editValues.description}
                    onChange={handleEditFieldChange}
                  ></textarea>
                </div>

                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest/60 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-24 w-24 overflow-hidden rounded-lg bg-surface-container-high">
                      {editImagePreviewUrl || editValues.imageUrl ? (
                        <img
                          alt="Ihale gorseli"
                          className="h-full w-full object-cover"
                          src={editImagePreviewUrl || editValues.imageUrl}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary-container/30 bg-primary-container/10 px-4 py-2 text-sm font-bold text-primary-container transition-colors hover:bg-primary-container/20">
                        <span className="material-symbols-outlined text-base">upload_file</span>
                        Gorsel Sec
                        <input
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          disabled={isSavingEdit}
                          type="file"
                          onChange={handleEditImageChange}
                        />
                      </label>
                      {editImageFile ? (
                        <button
                          className="ml-2 text-xs font-bold text-error hover:underline"
                          disabled={isSavingEdit}
                          type="button"
                          onClick={clearEditImageSelection}
                        >
                          Secimi kaldir
                        </button>
                      ) : null}
                      <p className="text-xs text-on-surface-variant">
                        JPG, PNG veya WEBP. En fazla 5 MB.
                      </p>
                      {editImageError ? (
                        <p className="text-xs font-semibold text-error">{editImageError}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <TenderRulesEditor
                  disabled={isSavingEdit}
                  embedded
                  onChange={(rules) =>
                    setEditValues((currentValues) => ({
                      ...currentValues,
                      rules,
                    }))
                  }
                  rules={editValues.rules}
                  subtitle="Kaydedince ihale kurallari bu listeyle guncellenir."
                />

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-white"
                    type="button"
                    onClick={closeEditor}
                  >
                    Vazgec
                  </button>
                  <button
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSavingEdit}
                    type="submit"
                  >
                    {isSavingEdit ? 'Kaydediliyor' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
            {listError ? (
              <p className="m-4 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                {listError}
              </p>
            ) : null}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline-variant/20 text-left">
                <thead className="bg-surface-container-high text-xs uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-4 font-bold">Ihale</th>
                    <th className="px-5 py-4 font-bold">Kategori</th>
                    <th className="px-5 py-4 font-bold">Tarih</th>
                    <th className="px-5 py-4 font-bold">Durum</th>
                    <th className="px-5 py-4 text-right font-bold">Islem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {isLoading ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-on-surface-variant" colSpan="5">
                        Ihaleler yukleniyor...
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && !listError && tenders.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-on-surface-variant" colSpan="5">
                        Gosterilecek ihale bulunamadi.
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading
                    ? tenders.map((tender) => {
                        const nextStatuses = getNextStatuses(tender.status)
                        const isRowBusy = busyAction.endsWith(`:${tender.id}`)

                        return (
                          <tr key={tender.id} className="align-top">
                            <td className="max-w-md px-5 py-5">
                              <div className="flex gap-3">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                                  {tender.imageUrl ? (
                                    <img
                                      alt=""
                                      className="h-full w-full object-cover"
                                      src={tender.imageUrl}
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                                      <span className="material-symbols-outlined text-base">image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-white">{tender.title}</span>
                                  <span className="line-clamp-2 text-sm text-on-surface-variant">
                                    {tender.description || 'Aciklama yok'}
                                  </span>
                                  <span className="text-sm font-semibold text-primary">
                                    {formatMoney(tender.startingPrice)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5">
                              <span className="block font-medium text-white">
                                {tender.categoryName}
                              </span>
                              <span className="mt-1 block text-xs text-on-surface-variant">
                                {tender.ruleCount} kural
                              </span>
                            </td>
                            <td className="px-5 py-5 text-sm text-on-surface-variant">
                              <span className="block">Baslangic: {formatDateTime(tender.startDate)}</span>
                              <span className="mt-1 block">Bitis: {formatDateTime(tender.endDate)}</span>
                            </td>
                            <td className="px-5 py-5">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(tender.status)}`}
                              >
                                {getStatusLabel(tender.status)}
                              </span>
                              <select
                                aria-label={`${tender.title} durumunu degistir`}
                                className="mt-3 block w-full min-w-36 rounded-lg border-none bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isRowBusy || nextStatuses.length === 0}
                                value=""
                                onChange={(event) => {
                                  handleStatusChange(tender, event.target.value)
                                }}
                              >
                                <option value="">
                                  {nextStatuses.length === 0 ? 'Son durum' : 'Durum degistir'}
                                </option>
                                {nextStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {getStatusLabel(status)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-5 py-5">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={isRowBusy}
                                  title="Duzenle"
                                  type="button"
                                  onClick={() => startEditingTender(tender)}
                                >
                                  <span className="material-symbols-outlined text-base">edit</span>
                                </button>
                                <button
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-error/30 text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={isRowBusy}
                                  title="Sil"
                                  type="button"
                                  onClick={() => handleDeleteTender(tender)}
                                >
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    : null}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-outline-variant/10 px-5 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center">
              <span>
                {pagination.totalCount} kayit icinden sayfa {pagination.page}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/30 transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading || !pagination.hasPreviousPage}
                  type="button"
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <span className="min-w-24 text-center font-semibold text-white">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/30 transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading || !pagination.hasNextPage}
                  type="button"
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(pagination.totalPages, currentPage + 1),
                    )
                  }
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default TenderManagementPage
