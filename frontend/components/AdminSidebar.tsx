'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { HEADER_HEIGHT } from './AdminHeader'
import { useSidebar } from './SidebarContext'
import { useEffect, useState } from 'react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen, toggleSidebar } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // モバイルではデフォルトで閉じる
      if (mobile) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsOpen])

  const menuItems = [
    { href: '/admin', label: 'ダッシュボード' },
    { href: '/admin/posts', label: '記事追加' },
    { href: '/admin/posts/delete', label: '記事削除' },
  ]

  const logout = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      // 続行
    }
    window.location.href = '/admin/login'
  }

  return (
    <>
      {!isMobile && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleSidebar()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          style={{
            position: 'fixed',
            left: isOpen ? 240 : 0,
            top: HEADER_HEIGHT,
            zIndex: 1001,
            background: '#1e40af',
            color: 'white',
            border: 0,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            padding: '16px 20px',
            minWidth: 48,
            minHeight: 48,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'left 0.3s ease',
            pointerEvents: 'auto',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      {isMobile && isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        style={{
          position: 'fixed',
          left: isOpen ? 0 : -240,
          top: HEADER_HEIGHT,
          bottom: 0,
          width: 240,
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          pointerEvents: isOpen ? 'auto' : 'none',
          willChange: 'left'
        }}
        onClick={(e) => {
          if (!isOpen) {
            e.stopPropagation()
          }
        }}
      >
        <div style={{ padding: '16px' }}>
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>メニュー</h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4
                }}
                aria-label="メニューを閉じる"
              >
                <X size={20} />
              </button>
            </div>
          )}
          {!isMobile && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>メニュー</h2>
            </div>
          )}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) {
                    setIsOpen(false)
                  }
                }}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: pathname === item.href ? '#1e40af' : '#0f172a',
                  textDecoration: 'none',
                  borderRadius: 8,
                  background: pathname === item.href ? '#dbeafe' : 'transparent',
                  fontWeight: pathname === item.href ? 600 : 400
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.background = '#f1f5f9'
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#ef4444',
                color: 'white',
                border: 0,
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14
              }}
            >
              ログアウト
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

