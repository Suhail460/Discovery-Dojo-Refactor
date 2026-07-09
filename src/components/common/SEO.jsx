import { Helmet } from 'react-helmet-async'

const BASE = 'Discovery Dojo'
const URL = 'https://discovery-dojo.vercel.app'
const OG_IMAGE = `${URL}/og-image.png`
const DESC = 'Master Product Discovery through hands-on simulations, quizzes, and a live interview simulator. 15 levels of interactive learning.'

export default function SEO({ title, description, ogImage }) {
  const fullTitle = title ? `${title} · ${BASE}` : BASE
  const desc = description || DESC
  const image = ogImage || OG_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={URL} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={BASE} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={URL} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: BASE,
          description: desc,
          url: URL,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          author: { '@type': 'Person', name: 'Discovery Dojo Team' }
        })}
      </script>
    </Helmet>
  )
}
