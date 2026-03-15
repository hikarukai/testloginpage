 'use client' 
import { useState } from 'react'
  import { createClient } from '@/lib/supabase/client'
  import { useRouter } from 'next/navigation'
  import Link from 'next/link'

  export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError('')

      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError('メールアドレスまたはパスワードが正しくありません')
        setLoading(false)
      } else {
        router.push('/mypage')
        router.refresh()
      }
    }

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-md w-80">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">ログイン</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-blue-600 hover:underline">新規登録</Link>
          </p>
        </div>
      </main>
    )
  }