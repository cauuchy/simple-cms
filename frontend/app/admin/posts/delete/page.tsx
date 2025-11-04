'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader, { HEADER_HEIGHT } from '../../../../components/AdminHeader'
import AdminSidebar from '../../../../components/AdminSidebar'
import { verifyAuth } from '../../../../utils/auth'

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function DeletePostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const fetchPosts = async () => {
    const res = await fetch(`${apiBase}/api/posts`, {
      credentials: 'include'
    })
    if (res.ok) {
      setPosts(await res.json())
    } else if (res.status === 401) {
      router.replace('/admin/login')
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyAuth(apiBase)
      if (!isValid) {
        router.replace('/admin/login')
        return
      }
      setIsCheckingAuth(false)
      fetchPosts()
    }
    checkAuth()
  }, [router, apiBase])

  const deletePost = async (id: number) => {
    if (!confirm('この記事を削除してもよろしいですか？')) return
    setError('')
    const res = await fetch(`${apiBase}/api/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) { setError('削除に失敗しました'); return }
    fetchPosts()
  }

  if (isCheckingAuth) {
    return null
  }

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <main style={{ marginLeft: 240, marginTop: HEADER_HEIGHT, padding: '24px', minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, color: '#0f172a', marginBottom: 24 }}>記事削除</h1>
        {error && <div style={{ color: '#dc2626', marginBottom: 16, padding: 12, background: '#fef2f2', borderRadius: 8 }}>{error}</div>}
        <div style={{ display: 'grid', gap: 12 }}>
          {posts.length === 0 ? (
            <div style={{ color: '#64748b', padding: 24, textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12 }}>
              記事がありません。
            </div>
          ) : (
            posts.map(p => (
              <div key={p.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
                background: 'white'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>ID: {p.id}</div>
                </div>
                <button
                  onClick={() => deletePost(p.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 0,
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>
        </div>
      </main>
    </div>
  )
}

