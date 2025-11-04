'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader, { HEADER_HEIGHT } from '../../components/AdminHeader'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminDashboard() {
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiBase}/api/posts`, {
          method: 'GET',
          credentials: 'include'
        })
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        setIsCheckingAuth(false)
      } catch (err) {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router, apiBase])

  if (isCheckingAuth) return null

  const menuItems = [
    {
      title: '記事追加',
      description: '新しい記事を作成します',
      href: '/admin/posts',
      color: '#2563eb'
    },
    {
      title: '記事削除',
      description: '既存の記事を削除します',
      href: '/admin/posts/delete',
      color: '#ef4444'
    },
  ]

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <main style={{ marginLeft: 240, marginTop: HEADER_HEIGHT, padding: '24px', minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, color: '#0f172a', marginBottom: 24 }}>管理画面</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              style={{
                display: 'block',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 24,
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
                {item.description}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: item.color,
                color: 'white',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600
              }}>
                移動 →
              </div>
            </a>
          ))}
        </div>
        </div>
      </main>
    </div>
  )
}

