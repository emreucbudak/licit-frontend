import { useCallback, useEffect, useState } from 'react'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import './NotificationCenterPage.css'

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

function normalizeNotificationCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  const collection = readField(
    payload,
    'notifications',
    'Notifications',
    'items',
    'Items',
    'data',
    'Data',
    'results',
    'Results',
  )

  return Array.isArray(collection) ? collection : []
}

function isTruthyReadValue(value) {
  return value === true || String(value).toLowerCase() === 'true'
}

function toNotificationText(value, fallback = '') {
  if (value === undefined || value === null) {
    return fallback
  }

  return String(value)
}

function formatNotificationTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000))

  if (diffMinutes < 1) {
    return 'Az önce'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} dk önce`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} sa önce`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) {
    return `${diffDays} gün önce`
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(date)
}

function getNotificationCategory(notification, title, body) {
  const sourceText = [
    readField(notification, 'type', 'Type', 'category', 'Category', 'eventType', 'EventType'),
    title,
    body,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (
    sourceText.includes('security') ||
    sourceText.includes('güven') ||
    sourceText.includes('login') ||
    sourceText.includes('oturum') ||
    sourceText.includes('şifre')
  ) {
    return 'security'
  }

  if (
    sourceText.includes('auction') ||
    sourceText.includes('bid') ||
    sourceText.includes('tender') ||
    sourceText.includes('ihale') ||
    sourceText.includes('teklif') ||
    sourceText.includes('lot')
  ) {
    return 'auction'
  }

  return 'system'
}

function getNotificationIcon(category, title) {
  const normalizedTitle = title.toLowerCase()

  if (category === 'security') {
    return 'shield'
  }

  if (category === 'auction') {
    return normalizedTitle.includes('kazand') || normalizedTitle.includes('won')
      ? 'emoji_events'
      : 'gavel'
  }

  return 'info'
}

function getNotificationActionHref(notification) {
  const directHref = readField(notification, 'href', 'Href', 'url', 'Url', 'link', 'Link')

  if (typeof directHref === 'string' && directHref.startsWith('/')) {
    return directHref
  }

  const auctionId = readField(
    notification,
    'auctionId',
    'AuctionId',
    'tenderId',
    'TenderId',
    'lotId',
    'LotId',
  )

  return auctionId ? `/auctions/${auctionId}` : ''
}

function normalizeNotification(notification, index) {
  const id = readField(notification, 'id', 'Id', 'notificationId', 'NotificationId')
  const createdAt = readField(
    notification,
    'createdAt',
    'CreatedAt',
    'created_at',
    'sentAt',
    'SentAt',
    'timestamp',
    'Timestamp',
  )
  const readAt = readField(notification, 'readAt', 'ReadAt', 'read_at', 'seenAt', 'SeenAt')
  const readValue = readField(
    notification,
    'isRead',
    'IsRead',
    'read',
    'Read',
    'seen',
    'Seen',
  )
  const title = toNotificationText(
    readField(notification, 'title', 'Title', 'subject', 'Subject'),
    'Bildirim',
  )
  const body = toNotificationText(
    readField(
      notification,
      'body',
      'Body',
      'message',
      'Message',
      'description',
      'Description',
      'content',
      'Content',
    ),
  )
  const category = getNotificationCategory(notification, title, body)
  const isRead = Boolean(readAt) || isTruthyReadValue(readValue)

  return {
    actionHref: getNotificationActionHref(notification),
    body,
    category,
    dateTime: createdAt ? String(createdAt) : '',
    icon: getNotificationIcon(category, title),
    id,
    isRead,
    key: String(id || `${title}-${createdAt || index}`),
    time: formatNotificationTime(createdAt),
    title,
  }
}

function NotificationCenterPage({ navigate, onLogout }) {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [readActionId, setReadActionId] = useState('')

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const { payload, response } = await sendAuthorizedRequest('/api/notifications?take=50')

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            'Bildirimler şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.',
          ),
        )
      }

      setNotifications(
        normalizeNotificationCollection(payload).map(normalizeNotification),
      )
    } catch {
      setNotifications([])
      setError('Bildirimler şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  async function handleMarkNotificationRead(notification) {
    if (!notification.id || notification.isRead || readActionId) {
      return
    }

    setReadActionId(notification.key)
    setError('')

    try {
      const { payload, response } = await sendAuthorizedRequest(
        `/api/notifications/${encodeURIComponent(notification.id)}/read`,
        { method: 'PATCH' },
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, 'Bildirim okundu olarak işaretlenemedi.'),
        )
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.key === notification.key
            ? { ...currentNotification, isRead: true }
            : currentNotification,
        ),
      )
    } catch (requestError) {
      setError(
        getUserFacingErrorMessage(
          requestError,
          'Bildirim okundu olarak işaretlenemedi.',
        ),
      )
    } finally {
      setReadActionId('')
    }
  }

  return (
    <div className="notification-center-page">
      <AppTopNavbar
        currentPath="/notifications"
        navigate={navigate}
        searchPlaceholder="İhale ara..."
      />
      <AppSideNavbar
        currentPath="/notifications"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="notification-center-main">
        <div className="notification-center-shell">
          <header className="notification-center-header">
            <div>
              <h1>Bildirimleriniz</h1>
            </div>
          </header>

          {error ? (
            <div className="notification-center-error">
              <span className="material-symbols-outlined">error</span>
              <p>{error || 'Bildirimler şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.'}</p>
            </div>
          ) : null}

          <section className="notification-center-list" aria-label="Bildirimler">
            {isLoading ? (
              <div className="notification-center-state">
                <span className="material-symbols-outlined">progress_activity</span>
                <p>Bildirimler yükleniyor...</p>
              </div>
            ) : null}

            {!isLoading && notifications.length === 0 ? (
              <div className="notification-center-state">
                <span className="material-symbols-outlined">notifications_off</span>
                <p>Henüz bildirim yok.</p>
              </div>
            ) : null}

            {!isLoading
              ? notifications.map((notification) => (
                  <article
                    className={`notification-center-card notification-center-card--${notification.category}${
                      notification.isRead ? '' : ' notification-center-card--unread'
                    }`}
                    key={notification.key}
                  >
                    {!notification.isRead ? (
                      <span
                        aria-hidden="true"
                        className="notification-center-card__unread"
                      ></span>
                    ) : null}
                    <div className="notification-center-card__icon">
                      <span className="material-symbols-outlined">
                        {notification.icon}
                      </span>
                    </div>
                    <div className="notification-center-card__content">
                      <div className="notification-center-card__head">
                        <div>
                          <div className="notification-center-card__title-row">
                            <h2>{notification.title}</h2>
                            {!notification.isRead ? <span>Yeni</span> : null}
                          </div>
                          {notification.body ? <p>{notification.body}</p> : null}
                        </div>
                        {notification.time ? (
                          <time dateTime={notification.dateTime}>
                            {notification.time}
                          </time>
                        ) : null}
                      </div>
                      <div className="notification-center-card__actions">
                        {notification.actionHref ? (
                          <a
                            href={notification.actionHref}
                            onClick={navigate(notification.actionHref)}
                          >
                            İlgili sayfayı aç
                          </a>
                        ) : null}
                        {!notification.isRead && notification.id ? (
                          <button
                            disabled={readActionId === notification.key}
                            onClick={() => handleMarkNotificationRead(notification)}
                            type="button"
                          >
                            {readActionId === notification.key
                              ? 'İşleniyor...'
                              : 'Okundu yap'}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))
              : null}
          </section>
        </div>
      </main>
    </div>
  )
}

export default NotificationCenterPage
