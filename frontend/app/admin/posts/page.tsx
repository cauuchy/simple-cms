'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AdminHeader, { HEADER_HEIGHT } from '../../../components/AdminHeader'
import AdminSidebar from '../../../components/AdminSidebar'
import { SidebarProvider, useSidebar } from '../../../components/SidebarContext'
import { verifyAuth } from '../../../utils/auth'

const RichEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false })

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

function AdminPostsPageContent() {
  const router = useRouter()
  const { isOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const createPost = async () => {
    setError('')
    const res = await fetch(`${apiBase}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, contentMarkdown: content })
    })
    if (!res.ok) { setError('作成に失敗しました'); return }
    const data = await res.json()
    setTitle('')
    setContent('')
    router.push(`/posts/${data.id}`)
  }

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <main style={{ 
        marginLeft: isMobile ? 0 : (isOpen ? 240 : 0), 
        marginTop: HEADER_HEIGHT, 
        padding: '24px', 
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        transition: 'margin-left 0.3s ease'
      }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, color: '#0f172a', marginBottom: 24 }}>記事追加</h1>
          {error && <div style={{ color: '#dc2626', marginBottom: 16, padding: 12, background: '#fef2f2', borderRadius: 8 }}>{error}</div>}
          <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>タイトル</label>
            <input
              placeholder="記事のタイトルを入力"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 16
              }}
            />
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 16, marginBottom: 8 }}>本文</label>
            <RichEditor value={content} onChange={setContent} />
            <button
              onClick={createPost}
              disabled={!title.trim() || !content.trim()}
              style={{
                marginTop: 24,
                background: (!title.trim() || !content.trim()) ? '#cbd5e1' : '#2563eb',
                color: 'white',
                border: 0,
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: (!title.trim() || !content.trim()) ? 'not-allowed' : 'pointer',
                fontSize: 16
              }}
            >
              記事を公開
            </button>
          </section>
          </div>
        </main>
      </div>
  )
}

export default function AdminPostsPage() {
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyAuth(apiBase)
      if (!isValid) {
        router.replace('/admin/login')
        return
      }
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [router])

  if (isCheckingAuth) {
    return null
  }

  return (
    <SidebarProvider>
      <AdminPostsPageContent />
    </SidebarProvider>
  )
}


