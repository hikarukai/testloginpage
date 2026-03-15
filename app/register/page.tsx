  'use client'                                                                                                                                                                                            
  
  import { useState } from 'react'
  import { createClient } from '@/lib/supabase/client'
  import { useRouter } from 'next/navigation'
  import Link from 'next/link'

  export default function RegisterPage() {
    const [form, setForm] = useState({
      email: '', password: '', name: '', gender: '', age: '', phone: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError('')

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (signUpError || !data.user) {
        setError(signUpError?.message || '登録に失敗しました')
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name: form.name,
        gender: form.gender,
        age: form.age ? parseInt(form.age) : null,
        phone: form.phone,
        role: 'user',
      })

      if (profileError) {
        setError('プロフィールの保存に失敗しました: ' + profileError.message)
        setLoading(false)
        return
      }

      router.push('/mypage')
      router.refresh()
    }

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
        <div className="bg-white p-10 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">新規登録</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">氏名 *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">性別</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">年齢</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} min="0" max="150"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">電話番号</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <hr />
            <div>
              <label className="block text-sm text-gray-600 mb-1">メールアドレス *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">パスワード *（8文字以上）</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            既にアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>
          </p>
        </div>
      </main>
    )
  }