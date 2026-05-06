import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../api/apiError'
import { sendAuthorizedRequest } from '../../api/authorizedRequest'
import { getStoredAuthTokens } from '../../auth/authStorage'
import { buildSignalRHubUrl } from '../../config/runtimeConfig'
import './AppNavigation.css'

const notificationHubPath = '/notification-hub'
const notificationHubEvents = [
  'NotificationCreated',
  'NotificationReceived',
  'NotificationsUpdated',
  'UnreadCountChanged',
]

const sideNavLinks = [
  {
    label: 'Canl\u0131 M\u00fczayedeler',
    icon: 'gavel',
    href: '/auctions',
    route: true,
    match: ['/auctions'],
  },
  {
    label: '\u0130hale Y\u00f6netimi',
    icon: 'inventory_2',
    href: '/auctions/manage',
    route: true,
    match: ['/auctions/manage'],
  },
  {
    label: 'Panel',
    icon: 'dashboard',
    href: '/dashboard',
    route: true,
    match: ['/dashboard'],
  },
  {
    label: 'C\u00fczdan',
    icon: 'account_balance_wallet',
    href: '/wallet',
    route: true,
    match: ['/wallet'],
  },
  {
    label: 'Ayarlar',
    icon: 'settings',
    href: '/settings',
    route: true,
    match: ['/settings'],
  },
]

const footerNavLinks = [
  {
    label: 'Yard\u0131m Merkezi',
    icon: 'help',
    href: '/help',
    route: true,
    match: ['/help'],
  },
  {
    label: '\u00c7\u0131k\u0131\u015f Yap',
    icon: 'logout',
    href: '/login',
    action: 'logout',
  },
]

function isActive(currentPath, link) {
  return link.match?.includes(currentPath)
}

function routeHandler(navigate, link) {
  return link.route ? navigate(link.href) : undefined
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

function toNotificationText(value, fallback = '') {
  if (value === undefined || value === null) {
    return fallback
  }

  return String(value)
}

function normalizeUnreadCount(payload) {
  const rawCount =
    typeof payload === 'number'
      ? payload
      : readField(
          payload,
          'count',
          'Count',
          'unreadCount',
          'UnreadCount',
          'unread_count',
          'total',
          'Total',
        )
  const count = Number(rawCount)

  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0
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

function formatNotificationTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const now = new Date()
  const includeYear = date.getFullYear() !== now.getFullYear()

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(date)
}

function normalizeNotification(notification, index) {
  const id = readField(
    notification,
    'id',
    'Id',
    'notificationId',
    'NotificationId',
  )
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
  const readAt = readField(
    notification,
    'readAt',
    'ReadAt',
    'read_at',
    'seenAt',
    'SeenAt',
  )
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

  return {
    body,
    dateTime: createdAt ? String(createdAt) : '',
    id,
    isRead: Boolean(readAt) || isTruthyReadValue(readValue),
    key: String(id || `${title}-${createdAt || index}`),
    time: formatNotificationTime(createdAt),
    title,
  }
}

export function AppTopNavbar({
  navigate,
  searchPlaceholder = 'M\u00fczayede ara...',
  searchValue = '',
}) {
  const [searchTerm, setSearchTerm] = useState(searchValue)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false)
  const [notificationsError, setNotificationsError] = useState('')
  const [readActionId, setReadActionId] = useState('')
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const notificationsRef = useRef(null)
  const isNotificationsOpenRef = useRef(false)

  useEffect(() => {
    setSearchTerm(searchValue)
  }, [searchValue])

  useEffect(() => {
    isNotificationsOpenRef.current = isNotificationsOpen
  }, [isNotificationsOpen])

  const loadUnreadCount = useCallback(async ({ showError = false } = {}) => {
    try {
      const { payload, response } = await sendAuthorizedRequest(
        '/api/notifications/unread-count',
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            'Bildirim sayısı alınamadı.',
          ),
        )
      }

      setUnreadCount(normalizeUnreadCount(payload))
    } catch (error) {
      if (showError || isNotificationsOpenRef.current) {
        setNotificationsError(
          getUserFacingErrorMessage(error, 'Bildirim sayısı alınamadı.'),
        )
      }
    }
  }, [])

  const loadNotifications = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsNotificationsLoading(true)
    }

    setNotificationsError('')

    try {
      const { payload, response } = await sendAuthorizedRequest(
        '/api/notifications?take=20',
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, 'Bildirimler yüklenemedi.'),
        )
      }

      setNotifications(
        normalizeNotificationCollection(payload).map(normalizeNotification),
      )
    } catch (error) {
      setNotificationsError(
        getUserFacingErrorMessage(error, 'Bildirimler yüklenemedi.'),
      )
    } finally {
      if (!silent) {
        setIsNotificationsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!isNotificationsOpen) {
      return
    }

    loadUnreadCount({ showError: true })
    loadNotifications()
  }, [isNotificationsOpen, loadNotifications, loadUnreadCount])

  useEffect(() => {
    if (!isNotificationsOpen || typeof document === 'undefined') {
      return undefined
    }

    function handlePointerDown(event) {
      if (!notificationsRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNotificationsOpen])

  useEffect(() => {
    if (!isNotificationsOpen) {
      return undefined
    }

    let connection = null
    let isDisposed = false

    function handleRealtimeNotification() {
      loadUnreadCount()

      if (isNotificationsOpenRef.current) {
        loadNotifications({ silent: true })
      }
    }

    async function startNotificationConnection() {
      try {
        const { HubConnectionBuilder } = await import('@microsoft/signalr')

        if (isDisposed) {
          return
        }

        connection = new HubConnectionBuilder()
          .withUrl(buildSignalRHubUrl(notificationHubPath), {
            accessTokenFactory: () => getStoredAuthTokens().accessToken || '',
          })
          .withAutomaticReconnect()
          .build()

        notificationHubEvents.forEach((eventName) => {
          connection.on(eventName, handleRealtimeNotification)
        })

        await connection.start()
      } catch {
        // The REST notification panel remains usable if realtime startup fails.
      }
    }

    startNotificationConnection()

    return () => {
      isDisposed = true

      if (!connection) {
        return
      }

      notificationHubEvents.forEach((eventName) => {
        connection.off(eventName, handleRealtimeNotification)
      })
      connection.stop().catch(() => {})
    }
  }, [isNotificationsOpen, loadNotifications, loadUnreadCount])

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const trimmedSearch = searchTerm.trim()
    const searchPath = trimmedSearch
      ? `/auctions?search=${encodeURIComponent(trimmedSearch)}`
      : '/auctions'

    navigate(searchPath)(event)
  }

  const hasUnreadNotifications = useMemo(
    () => notifications.some((notification) => !notification.isRead),
    [notifications],
  )
  const unreadBadgeLabel = unreadCount > 99 ? '99+' : String(unreadCount)

  const handleNotificationToggle = () => {
    setIsNotificationsOpen((isOpen) => !isOpen)
  }

  const handleRetryNotifications = () => {
    loadUnreadCount({ showError: true })
    loadNotifications()
  }

  const handleMarkNotificationRead = async (notification) => {
    if (!notification.id || notification.isRead || readActionId) {
      return
    }

    setNotificationsError('')
    setReadActionId(notification.key)

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
      setUnreadCount((currentCount) => Math.max(currentCount - 1, 0))
      loadUnreadCount()
    } catch (error) {
      setNotificationsError(
        getUserFacingErrorMessage(
          error,
          'Bildirim okundu olarak işaretlenemedi.',
        ),
      )
    } finally {
      setReadActionId('')
    }
  }

  const handleMarkAllNotificationsRead = async () => {
    if (isMarkingAllRead || (!hasUnreadNotifications && unreadCount === 0)) {
      return
    }

    setNotificationsError('')
    setIsMarkingAllRead(true)

    try {
      const { payload, response } = await sendAuthorizedRequest(
        '/api/notifications/read-all',
        { method: 'PATCH' },
      )

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, 'Bildirimler okundu olarak işaretlenemedi.'),
        )
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      )
      setUnreadCount(0)
      loadUnreadCount()
    } catch (error) {
      setNotificationsError(
        getUserFacingErrorMessage(
          error,
          'Bildirimler okundu olarak işaretlenemedi.',
        ),
      )
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  return (
    <header className="app-topbar">
      <div className="app-topbar__brand-row">
        <a className="app-brand" href="/" onClick={navigate('/')}>
          Licit
        </a>
      </div>

      <div className="app-topbar__actions">
        <form className="app-search" aria-label="M\u00fczayede ara" onSubmit={handleSearchSubmit}>
          <span className="material-symbols-outlined">search</span>
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={searchTerm}
          />
        </form>

        <div className="app-notifications" ref={notificationsRef}>
          <button
            className={`app-icon-button app-notifications__trigger${
              isNotificationsOpen ? ' app-icon-button--active' : ''
            }`}
            type="button"
            aria-controls="app-notifications-panel"
            aria-expanded={isNotificationsOpen}
            aria-label={
              unreadCount > 0
                ? `${unreadCount} okunmamış bildirim`
                : 'Bildirimler'
            }
            onClick={handleNotificationToggle}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 ? (
              <span className="app-icon-button__badge">
                {unreadBadgeLabel}
              </span>
            ) : null}
          </button>

          {isNotificationsOpen ? (
            <section
              className="app-notifications__panel"
              id="app-notifications-panel"
              aria-label="Bildirimler"
              role="dialog"
            >
              <div className="app-notifications__header">
                <div>
                  <h2>Bildirimler</h2>
                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} okunmamış`
                      : 'Tümü okundu'}
                  </p>
                </div>
                <button
                  className="app-notifications__mark-all"
                  disabled={
                    isMarkingAllRead ||
                    (!hasUnreadNotifications && unreadCount === 0)
                  }
                  onClick={handleMarkAllNotificationsRead}
                  type="button"
                >
                  {isMarkingAllRead ? 'İşleniyor...' : 'Tümünü okundu olarak işaretle'}
                </button>
              </div>

              <div className="app-notifications__body">
                {isNotificationsLoading ? (
                  <div className="app-notifications__state">
                    <span className="material-symbols-outlined">progress_activity</span>
                    <p>Bildirimler yükleniyor...</p>
                  </div>
                ) : null}

                {!isNotificationsLoading && notificationsError ? (
                  <div className="app-notifications__state app-notifications__state--error">
                    <span className="material-symbols-outlined">error</span>
                    <p>{notificationsError}</p>
                    <button type="button" onClick={handleRetryNotifications}>
                      Tekrar dene
                    </button>
                  </div>
                ) : null}

                {!isNotificationsLoading &&
                !notificationsError &&
                notifications.length === 0 ? (
                  <div className="app-notifications__state">
                    <span className="material-symbols-outlined">notifications_off</span>
                    <p>Yeni bildirim yok.</p>
                  </div>
                ) : null}

                {!isNotificationsLoading &&
                !notificationsError &&
                notifications.length > 0 ? (
                  <ul className="app-notifications__list">
                    {notifications.map((notification) => (
                      <li
                        className={`app-notifications__item${
                          notification.isRead
                            ? ''
                            : ' app-notifications__item--unread'
                        }`}
                        key={notification.key}
                      >
                        <span
                          className="app-notifications__item-status"
                          aria-hidden="true"
                        ></span>
                        <div className="app-notifications__item-content">
                          <div className="app-notifications__item-title">
                            <h3>{notification.title}</h3>
                            {notification.time ? (
                              <time dateTime={notification.dateTime}>
                                {notification.time}
                              </time>
                            ) : null}
                          </div>
                          {notification.body ? (
                            <p>{notification.body}</p>
                          ) : null}
                        </div>
                        {!notification.isRead && notification.id ? (
                          <button
                            className="app-notifications__read-button"
                            disabled={readActionId === notification.key}
                            onClick={() =>
                              handleMarkNotificationRead(notification)
                            }
                            type="button"
                            aria-label={`${notification.title} bildirimini okundu olarak işaretle`}
                          >
                            <span className="material-symbols-outlined">
                              {readActionId === notification.key
                                ? 'hourglass_empty'
                                : 'done'}
                            </span>
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>

        <button className="app-icon-button" type="button" aria-label="Hesap">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
}

export function AppSideNavbar({ currentPath, navigate, onLogout }) {
  const createAuctionActive = currentPath === '/auctions/create'

  return (
    <aside className="app-sidebar">
      <nav className="app-sidebar__nav" aria-label="Yan navigasyon">
        {sideNavLinks.map((link) => (
          <a
            key={link.label}
            className={`app-sidebar__link${
              isActive(currentPath, link) ? ' app-sidebar__link--active' : ''
            }`}
            href={link.href}
            onClick={routeHandler(navigate, link)}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <a
        className={`app-sidebar__cta${
          createAuctionActive ? ' app-sidebar__cta--active' : ''
        }`}
        href="/auctions/create"
        onClick={navigate('/auctions/create')}
      >
        <span className="material-symbols-outlined">add_circle</span>
        {'M\u00fczayede Olu\u015ftur'}
      </a>

      <nav className="app-sidebar__footer" aria-label="Hesap navigasyonu">
        {footerNavLinks.map((link) => (
          <a
            key={link.label}
            className={`app-sidebar__link${
              isActive(currentPath, link) ? ' app-sidebar__link--active' : ''
            }`}
            href={link.href}
            onClick={
              link.action === 'logout'
                ? (event) => {
                    event.preventDefault()
                    onLogout?.()
                  }
                : routeHandler(navigate, link)
            }
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
