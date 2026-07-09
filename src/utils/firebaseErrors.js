const ERROR_MAP = {
  'auth/popup-closed-by-user': 'Sign-in cancelled. Try again.',
  'auth/cancelled-popup-request': 'Sign-in cancelled. Try again.',
  'auth/popup-blocked': 'Popup was blocked. Allow popups and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/wrong-password': 'Wrong password. Try again.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with that email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/requires-recent-login': 'Please sign in again before making this change.',
  'auth/credential-already-in-use': 'This credential is linked to another account.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in method.',
  'auth/expired-action-code': 'This link has expired.',
  'auth/invalid-action-code': 'This link is invalid or has already been used.',
  'auth/provider-already-linked': 'This account is already linked to this provider.',
  'auth/no-such-provider': 'No account linked to this provider.',
  'auth/timeout': 'Request timed out. Please try again.',
  'auth/web-storage-unsupported': 'Private browsing may limit session persistence.',
  'unavailable': 'Service temporarily unavailable. Please try again.'
}

export function friendlyError(error) {
  if (error?.code && ERROR_MAP[error.code]) return ERROR_MAP[error.code]
  if (error?.message) return error.message
  return 'Something went wrong. Please try again.'
}

export function isOfflineError(error) {
  return error?.code === 'auth/network-request-failed' || error?.code === 'unavailable' || error?.message?.includes?.('network')
}
