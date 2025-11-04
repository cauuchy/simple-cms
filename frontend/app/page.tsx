import Link from 'next/link'
import Header from '../components/Header'

const apiBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://cms_backend:8080'

async function fetchPosts() {
  const res = await fetch(`${apiBase}/api/posts`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function HomePage() {
  const posts = await fetchPosts()
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: '#0f172a' }}>新着記事</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {posts.length === 0 && (
            <div style={{ color: '#64748b' }}>まだ記事がありません。</div>
          )}
          {posts.map((p: any) => (
            <Link key={p.id} href={`/posts/${p.id}`} style={{
              border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, textDecoration: 'none', background: 'white'
            }}>
              <div style={{ color: '#0f172a', fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>#{p.id}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}


