export function toPascal(s) {
  return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

export function pick(a) {
  return a[Math.floor(Math.random() * a.length)]
}

export function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

export function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export function shuffle(a) {
  a = [...a]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
