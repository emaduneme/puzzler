import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const reviewDueOnly = searchParams.get('reviewDueOnly') === 'true'

    // Get user ID from token if available
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    const payload = token ? verifyAccessToken(token) : null
    const userId = payload?.userId

    let questions

    if (reviewDueOnly && userId) {
      // Get questions due for review for this user
      questions = await prisma.question.findMany({
        where: {
          deckId: params.id,
          userProgress: {
            some: {
              userId,
              nextReviewAt: {
                lte: new Date(),
              },
            },
          },
        },
        take: limit,
        include: {
          userProgress: {
            where: { userId },
          },
        },
      })
    } else {
      // Get all questions for this deck
      questions = await prisma.question.findMany({
        where: { deckId: params.id },
        take: limit,
        include: userId
          ? {
              userProgress: {
                where: { userId },
              },
            }
          : undefined,
      })
    }

    return NextResponse.json({
      questions: questions.map(q => ({
        id: q.id,
        frontText: q.frontText,
        backText: q.backText,
        scriptureRefs: q.scriptureRefs,
        difficulty: q.difficulty,
        progress: q.userProgress?.[0] || null,
      })),
    })
  } catch (error) {
    console.error('Get questions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
