// app/api/tmdb-fetch/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get id from query parameter
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('Received TMDb ID:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
    console.log('API Key exists:', !!apiKey)

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TMDb API key not configured' },
        { status: 500 }
      )
    }

    const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    console.log('Fetching from TMDb...')
    
    const response = await fetch(tmdbUrl, {
      cache: 'no-store'
    })

    console.log('TMDb status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('TMDb error:', errorData)
      return NextResponse.json(
        { error: 'Movie not found on TMDb' },
        { status: 404 }
      )
    }

    const data = await response.json()
    console.log('Movie found:', data.title)

    let year = null
    if (data.release_date) {
      try {
        year = new Date(data.release_date).getFullYear()
      } catch (e) {
        console.error('Error parsing year:', e)
      }
    }

    return NextResponse.json({
      tmdb_id: data.id,
      title: data.title,
      original_title: data.original_title || data.title,
      year: year || 2000,
      poster_path: data.poster_path,
      overview: data.overview,
      release_date: data.release_date
    })

  } catch (error) {
    console.error('TMDb API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie data', details: error.message },
      { status: 500 }
    )
  }
}