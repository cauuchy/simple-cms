import ReactMarkdown from 'react-markdown'
import Header from '../../../components/Header'

const apiBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://cms_backend:8080'

async function fetchPost(id: string) {
  const res = await fetch(`${apiBase}/api/posts/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
  if (!post) return <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>記事が見つかりませんでした。</div>
  const content: string = post.contentMarkdown || ''
  const looksLikeHtml = /<\w+[^>]*>/.test(content)
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 28, color: '#0f172a' }}>{post.title}</h1>
        <article style={{ marginTop: 16, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          {looksLikeHtml ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </article>
      </main>
    </div>
  )
}


