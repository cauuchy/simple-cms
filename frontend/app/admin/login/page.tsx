'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) { setError('ログインに失敗しました'); return }
      router.push('/admin')
    } catch (err) {
      setError('サーバーへ接続できませんでした')
    }
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#f8fafc' }}>
      <div style={{ width: 320 }}>
        <Link href="/" style={{ display: 'block', marginBottom: 16, color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← トップページに戻る</Link>
        <form onSubmit={onSubmit} style={{ background: 'white', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <h1 style={{ marginTop: 0, fontSize: 20, color: '#0f172a' }}>管理者ログイン</h1>
        <label style={{ display: 'block', fontSize: 12, color: '#475569' }}>ユーザー名</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            marginTop: 4,
            marginBottom: 12,
            lineHeight: 1.4
          }}
        />
        <label style={{ display: 'block', fontSize: 12, color: '#475569' }}>パスワード</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 44px 10px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              marginTop: 4,
              lineHeight: 1.4
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            title={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 0,
              color: '#64748b',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', marginTop: 16, background: '#2563eb', color: 'white', border: 0, padding: 10, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>ログイン</button>
        </form>
      </div>
    </div>
  )
}


