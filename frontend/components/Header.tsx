import Link from 'next/link'

export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%)',
      color: 'white',
      padding: '48px 24px'
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>Simple CMS</h1>
        </Link>
        <p style={{ marginTop: 8, opacity: 0.95 }}>Next.js/Spring Bootで作るシンプルなCMS</p>
        <div style={{ marginTop: 16 }}>
          <Link href="/admin" style={{ background: 'white', color: '#1e40af', padding: '10px 16px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>管理画面へ</Link>
        </div>
      </div>
    </header>
  )
}

