/**
 * 認証トークンを検証する
 * @param apiBase APIのベースURL
 * @returns 認証が有効な場合true、無効な場合false
 */
export async function verifyAuth(apiBase: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase}/api/auth/verify`, {
      method: 'GET',
      credentials: 'include'
    })
    return res.ok
  } catch (err) {
    return false
  }
}

