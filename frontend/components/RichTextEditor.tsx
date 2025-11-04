'use client'

import { useEffect, useRef, useState } from 'react'

type Formats = { bold: boolean; italic: boolean; underline: boolean }

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [formats, setFormats] = useState<Formats>({ bold: false, italic: false, underline: false })

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const updateFormatState = () => {
    if (!editorRef.current) return
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      setFormats({ bold: false, italic: false, underline: false })
      return
    }
    
    const range = selection.getRangeAt(0)
    let element: HTMLElement | null = null
    
    if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
      element = range.commonAncestorContainer as HTMLElement
    } else {
      element = range.commonAncestorContainer.parentElement
    }
    
    while (element && element !== editorRef.current) {
      if (editorRef.current.contains(element)) break
      element = element.parentElement
    }
    
    if (!element || element === editorRef.current) {
      setFormats({ bold: false, italic: false, underline: false })
      return
    }
    
    let currentElement: HTMLElement | null = element
    let isBold = false
    let isItalic = false
    let isUnderline = false
    
    while (currentElement && currentElement !== editorRef.current) {
      const style = window.getComputedStyle(currentElement)
      const tagName = currentElement.tagName.toLowerCase()
      
      if (tagName === 'b' || tagName === 'strong') isBold = true
      if (tagName === 'i' || tagName === 'em') isItalic = true
      if (tagName === 'u') isUnderline = true
      
      const fontWeight = parseInt(style.fontWeight) || 0
      if (fontWeight >= 700 || style.fontWeight === 'bold') isBold = true
      if (style.fontStyle === 'italic') isItalic = true
      if (style.textDecoration.includes('underline')) isUnderline = true
      
      currentElement = currentElement.parentElement
    }
    
    setFormats({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
    })
  }

  const applyFormat = (tagName: string, attributes?: Record<string, string>) => {
    if (!editorRef.current) return
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    
    if (range.collapsed) {
      const element = document.createElement(tagName)
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          if (key === 'style' && typeof value === 'string') {
            element.setAttribute('style', value)
          } else {
            element.setAttribute(key, value)
          }
        })
      }
      element.appendChild(document.createTextNode('\u200B')) // ゼロ幅スペース
      range.insertNode(element)
      range.setStartAfter(element)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      try {
        const element = document.createElement(tagName)
        if (attributes) {
          Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'string') {
              element.setAttribute('style', value)
            } else {
              element.setAttribute(key, value)
            }
          })
        }
        range.surroundContents(element)
        const newRange = document.createRange()
        newRange.selectNodeContents(element)
        newRange.collapse(false)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } catch (err) {
        // surroundContentsが失敗した場合（境界が適切でない場合）
        const contents = range.extractContents()
        const element = document.createElement(tagName)
        if (attributes) {
          Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'string') {
              element.setAttribute('style', value)
            } else {
              element.setAttribute(key, value)
            }
          })
        }
        element.appendChild(contents)
        range.insertNode(element)
        const newRange = document.createRange()
        newRange.selectNodeContents(element)
        newRange.collapse(false)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
    
    editorRef.current.focus()
    updateFormatState()
    onChange(editorRef.current.innerHTML || '')
  }

  const toggleFormat = (tagName: string) => {
    if (!editorRef.current) return
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    let element: HTMLElement | null = null
    
    if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
      element = range.commonAncestorContainer as HTMLElement
    } else {
      element = range.commonAncestorContainer.parentElement
    }
    
    while (element && element !== editorRef.current) {
      if (element.tagName.toLowerCase() === tagName.toLowerCase()) {
        const parent = element.parentElement
        if (parent) {
          const rangeBefore = document.createRange()
          rangeBefore.setStartBefore(element)
          rangeBefore.setEndAfter(element)
          const contents = rangeBefore.extractContents()
          element.parentNode?.replaceChild(contents, element)
          normalizeEditor()
          editorRef.current.focus()
          updateFormatState()
          onChange(editorRef.current.innerHTML || '')
          return
        }
      }
      element = element.parentElement
    }
    
    applyFormat(tagName)
  }

  const normalizeEditor = () => {
    if (!editorRef.current) return
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_ELEMENT,
      null
    )
    const nodesToRemove: Node[] = []
    let node: Node | null = walker.nextNode()
    while (node) {
      const el = node as HTMLElement
      if (el.childNodes.length === 0 && el.textContent?.trim() === '') {
        nodesToRemove.push(node)
      }
      node = walker.nextNode()
    }
    nodesToRemove.forEach(n => n.parentNode?.removeChild(n))
  }

  const exec = (command: string, val?: string) => {
    switch (command) {
      case 'bold':
        toggleFormat('b')
        break
      case 'italic':
        toggleFormat('i')
        break
      case 'underline':
        toggleFormat('u')
        break
      case 'strikeThrough':
        toggleFormat('s')
        break
      case 'foreColor':
        if (val) applyFormat('span', { style: `color: ${val}` })
        break
      case 'hiliteColor':
        if (val) {
          if (val === 'transparent') {
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0 && editorRef.current) {
              const range = selection.getRangeAt(0)
              let element: HTMLElement | null = null
              if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
                element = range.commonAncestorContainer as HTMLElement
              } else {
                element = range.commonAncestorContainer.parentElement
              }
              while (element && element !== editorRef.current) {
                const style = element.getAttribute('style')
                if (style && style.includes('background-color')) {
                  const newStyle = style.replace(/background-color\s*:[^;]*;?/gi, '').trim()
                  if (newStyle) {
                    element.setAttribute('style', newStyle)
                  } else {
                    element.removeAttribute('style')
                  }
                  editorRef.current.focus()
                  updateFormatState()
                  onChange(editorRef.current.innerHTML || '')
                  break
                }
                element = element.parentElement
              }
            }
          } else {
            applyFormat('span', { style: `background-color: ${val}` })
          }
        }
        break
    }
  }

  const applyTextColor = (color: string) => exec('foreColor', color)
  
  const getSelectedBackgroundColor = (): string | null => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null
    
    const range = selection.getRangeAt(0)
    let element: HTMLElement | null = null
    
    if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
      element = range.commonAncestorContainer as HTMLElement
    } else {
      element = range.commonAncestorContainer.parentElement
    }
    
    while (element && element !== editorRef.current) {
      const bgColor = window.getComputedStyle(element).backgroundColor
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        // RGB --> HEX
        const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1])
          const g = parseInt(rgbMatch[2])
          const b = parseInt(rgbMatch[3])
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
        return bgColor.startsWith('#') ? bgColor : null
      }
      element = element.parentElement
    }
    
    return null
  }
  
  const normalizeColorForCompare = (color: string): string => {
    if (!color) return ''
    const trimmed = color.trim().toLowerCase()
    
    // RGB --> HEX
    const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
    
    return trimmed
  }
  
  const applyBackgroundColor = (color: string) => {
    const currentBgColor = getSelectedBackgroundColor()
    const normalizedCurrent = normalizeColorForCompare(currentBgColor || '')
    const normalizedTarget = normalizeColorForCompare(color)
    
    if (normalizedCurrent === normalizedTarget && normalizedCurrent !== '') {
      exec('hiliteColor', 'transparent')
    } else {
      exec('hiliteColor', color)
    }
  }

  const btn = (
    opts: { label: React.ReactNode; active?: boolean; onClick: () => void; title?: string }
  ) => (
    <button
      type="button"
      onClick={opts.onClick}
      title={opts.title}
      style={{
        padding: '6px 8px',
        borderRadius: 6,
        border: '1px solid ' + (opts.active ? '#1d4ed8' : '#cbd5e1'),
        background: opts.active ? '#dbeafe' : '#f1f5f9',
        color: opts.active ? '#1e40af' : '#0f172a',
        cursor: 'pointer'
      }}
    >{opts.label}</button>
  )

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 8, borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div style={{ display: 'flex', gap: 6, paddingRight: 8, borderRight: '1px solid #e2e8f0' }}>
          {btn({ label: 'B', active: formats.bold, onClick: () => exec('bold'), title: '太字 (Ctrl+B)' })}
          {btn({ label: 'I', active: formats.italic, onClick: () => exec('italic'), title: '斜体 (Ctrl+I)' })}
          {btn({ label: 'U', active: formats.underline, onClick: () => exec('underline'), title: '下線 (Ctrl+U)' })}
          {btn({ label: 'S', onClick: () => exec('strikeThrough'), title: '取り消し線' })}
        </div>
        <div style={{ display: 'flex', gap: 6, paddingRight: 8, borderRight: '1px solid #e2e8f0', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>文字色</span>
          {['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
            <button key={color} onClick={() => applyTextColor(color)} title="テキスト色"
              style={{ width: 20, height: 20, borderRadius: 6, border: '2px solid #cbd5e1', background: color, cursor: 'pointer' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>背景色</span>
          {['#fef08a', '#bfdbfe', '#bbf7d0', '#fecaca', '#e9d5ff'].map(color => (
            <button key={color} onClick={() => applyBackgroundColor(color)} title="背景色"
              style={{
                width: 20, height: 20, borderRadius: 6, border: '2px solid #cbd5e1', cursor: 'pointer',
                background: color
              }} />
          ))}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        onPaste={(e) => {
        }}
        onKeyUp={updateFormatState}
        onMouseUp={updateFormatState}
        style={{ minHeight: 280, padding: 16, outline: 'none', color: '#0f172a', lineHeight: 1.7, fontSize: 16 }}
      >
      </div>
    </div>
  )
}


