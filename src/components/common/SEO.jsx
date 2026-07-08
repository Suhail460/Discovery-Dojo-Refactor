import { Helmet } from 'react-helmet-async'

const BASE = 'Discovery Dojo'

export default function SEO({ title, description }) {
  const fullTitle = title ? `${title} · ${BASE}` : BASE
  const desc = description || 'Master Product Discovery through simulations, quizzes, and a live interview simulator.'
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  )
}
