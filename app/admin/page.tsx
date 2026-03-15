 'use client'                                                                                                                                                                                            
  
  import { useEffect, useState } from 'react'
  import { createClient } from '@/lib/supabase/client'
  import { useRouter } from 'next/navigation'

  type Profile = {
    id: string
    name: string
    gender: string
    age: number | null
    phone: string
    role: string
    created_at: string
  }

  export default function AdminPage() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => { fetchProfiles() }, [])

    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setProfiles(error ? [] : (data || []))
      if (error) setMessage('データの取得に失敗しました')
      setLoading(false)
    }

    const handleDelete = async (id: string, name: string) => {
      if (!confirm(`「${name}」を削除しますか？`)) return
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (error) { setMessage('削除に失敗しました') }
      else { setMessage('削除しました'); setProfiles(profiles.filter(p => p.id !== id)) }
    }

    const handleRoleChange = async (id: string, newRole: string) => {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
      if (error) { setMessage('権限変更に失敗しました') }
      else { setMessage('権限を変更しました'); setProfiles(profiles.map(p => p.id === id ? { ...p, role: newRole } : p)) }
    }

    const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    }

    const genderLabel = (g: string) => ({ male: '男性', female: '女性', other: 'その他' }[g] || '-')

    if (loading) return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>

    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">管理者画面</h1>
            <div className="flex gap-4">
              <a href="/mypage" className="text-sm text-blue-600 hover:underline">マイページ</a>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:underline">ログアウト</button>
            </div>
          </div>
          {message && (
            <p className={`mb-4 text-sm ${message.includes('失敗') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>
          )}
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  {['氏名','性別','年齢','電話番号','権限','登録日','操作'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{genderLabel(p.gender)}</td>
                    <td className="px-4 py-3">{p.age ?? '-'}</td>
                    <td className="px-4 py-3">{p.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <select value={p.role} onChange={e => handleRoleChange(p.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs">
                        <option value="user">一般</option>
                        <option value="admin">管理者</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(p.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-500 hover:underline text-xs">削除</button>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">ユーザーがいません</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    )
  }