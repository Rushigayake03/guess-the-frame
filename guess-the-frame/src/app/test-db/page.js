// app/test-db/page.js
import { supabase } from '@/lib/supabase'

export default async function TestDB() {
  // Try to fetch from movies table
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Database Connection Test</h1>
      
      {error ? (
        <div className="bg-red-500 p-4 rounded">
          <p className="font-bold">Error:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div className="bg-green-500 p-4 rounded">
          <p className="font-bold">✅ Connected Successfully!</p>
          <p className="mt-2">Movies in database: {data?.length || 0}</p>
          <pre className="mt-4 bg-black p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}