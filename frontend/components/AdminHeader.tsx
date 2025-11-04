'use client'

import Link from 'next/link'

export const HEADER_HEIGHT = 80 // ヘッダーの高さ

export default function AdminHeader() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%)',
      color: 'white',
      padding: '24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_HEIGHT,
      zIndex: 999,
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Simple CMS</h1>
        </Link>
      </div>
    </header>
  )
}

