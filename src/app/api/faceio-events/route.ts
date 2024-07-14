import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  console.log(request, 'data')
  // return ok

  return NextResponse.json(data)
}
