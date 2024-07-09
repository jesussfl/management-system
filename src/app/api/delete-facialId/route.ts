import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: any) {
  const { searchParams } = new URL(request.url)
  const facialId = searchParams.get('facialId')
  const apiKey = process.env.NEXT_PUBLIC_FACEIO_API_KEY

  if (!facialId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing facialId or API key' },
      { status: 400 }
    )
  }

  const url = `https://api.faceio.net/deletefacialid?fid=${facialId}&key=${apiKey}`
  console.log(url)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (res.status !== 200) {
      return NextResponse.json({ error: data.error }, { status: res.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
