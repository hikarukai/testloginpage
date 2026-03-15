 'use client'                                                                                                                                                                                            
  
  import { useEffect, useState } from 'react'
  import { createClient } from '@/lib/supabase/client'
  import { useRouter } from 'next/navigation'

  type Profile = {
    name: string
    gender: string
    age: number | null
    phone: string
    role: string
  }

  export default function MyPage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [form, setForm] = useState<Profile | null>(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) { setProfile(data); setForm(data) }
      }
      fetchProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!form) return
      setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!form) return
      setLoading(true)
      setMessage('')

      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('profiles')
        .update({ name: form.name, gender: form.gender, age: form.age ? Number(form.age) : null, phone: form.phone })
        .eq('id', user!.id)

      setMessage(error ? '更新に失敗しました' : '更新しました')
      if (!error) setProfile(form)
      setLoading(false)
    }

    const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    }

    if (!form) return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>

    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-md mx-auto bg-white p-10 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">マイページ</h1>
            <div className="flex gap-4">
              {profile?.role === 'admin' && (
                <a href="/admin" className="text-sm text-purple-600 hover:underline">管理者画面</a>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:underline">
                ログアウト
              </button>
            </div>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
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
              <input type="number" name="age" value={form.age ?? ''} onChange={handleChange} min="0" max="150"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">電話番号</label>
              <input type="tel" name="phone" value={form.phone ?? ''} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            {message && (
              <p className={`text-sm ${message.includes('失敗') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? '更新中...' : '更新する'}
            </button>
          </form>
        </div>
      </main>
    )
  }