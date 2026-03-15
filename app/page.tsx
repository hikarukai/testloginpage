import Link from 'next/link'
  import { createClient } from '@/lib/supabase/server'
  import { redirect } from 'next/navigation'

  export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) redirect('/mypage')

    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-md text-center space-y-6 w-80">
          <h1 className="text-2xl font-bold text-gray-800">会員サイト</h1>
          <p className="text-gray-500 text-sm">ログインまたは新規登録してください</p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="block w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              新規登録
            </Link>
          </div>
        </div>
      </main>
    )
  }