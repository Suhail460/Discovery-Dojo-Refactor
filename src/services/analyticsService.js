let ga4 = null

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

function getGA() {
  if (ga4) return ga4
  if (typeof window === 'undefined' || !MEASUREMENT_ID) return null
  if (window.gtag) {
    ga4 = window.gtag
    return ga4
  }
  const existed = window.dataLayer?.some((e) => e?.event === 'gtm.js')
  if (!existed) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    ga4 = window.gtag
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(s)
    ga4('js', new Date())
    ga4('config', MEASUREMENT_ID, { send_page_view: false })
  } else {
    ga4 = window.gtag
  }
  return ga4
}

function send(eventName, params = {}) {
  const gtag = getGA()
  if (!gtag) return
  try {
    gtag('event', eventName, params)
  } catch { /* analytics must never throw */ }
}

export function trackPageView(path, title) {
  const gtag = getGA()
  if (!gtag) return
  try {
    gtag('config', MEASUREMENT_ID, { page_path: path, page_title: title, send_page_view: true })
  } catch { /* ignore */ }
}

export function trackLogin(method) {
  send('login', { method })
}

export function trackSignup(method) {
  send('sign_up', { method })
}

export function trackLogout() {
  send('logout')
}

export function trackGuestLogin() {
  send('login', { method: 'guest' })
}

export function trackLessonStarted(level, screen, title) {
  send('lesson_started', { level, screen, lesson_title: title })
}

export function trackLessonCompleted(level, screen, title) {
  send('lesson_completed', { level, screen, lesson_title: title })
}

export function trackQuizCompleted(level, screen, score) {
  send('quiz_completed', { level, screen, score })
}

export function trackInterviewCompleted(score) {
  send('interview_completed', { score })
}

export function trackButtonClick(buttonName, page) {
  send('button_click', { button_name: buttonName, page })
}

export function trackNavigation(from, to) {
  send('navigation', { from, to })
}

export function trackSearch(query) {
  send('search', { search_term: query })
}

export function trackLevelComplete(level) {
  send('level_complete', { level })
}

export function trackBadgeEarned(badgeId, badgeName) {
  send('badge_earned', { badge_id: badgeId, badge_name: badgeName })
}

export function trackCapstoneCompleted() {
  send('capstone_completed')
}

export function trackDailyGoalReached() {
  send('daily_goal_reached')
}

export function trackChallengeCompleted(challengeId) {
  send('challenge_completed', { challenge_id: challengeId })
}

export function trackError(errorCategory, errorMessage) {
  send('error', { error_category: errorCategory, error_message: errorMessage })
}
