import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user progress summary
    const totalProgress = await prisma.userProgress.count({
      where: { userId: payload.userId },
    })

    const dueForReview = await prisma.userProgress.count({
      where: {
        userId: payload.userId,
        nextReviewAt: {
          lte: new Date(),
        },
      },
    })

    const correctAnswers = await prisma.userProgress.aggregate({
      where: { userId: payload.userId },
      _sum: {
        correctCount: true,
        incorrectCount: true,
      },
    })

    const totalCorrect = correctAnswers._sum.correctCount || 0
    const totalIncorrect = correctAnswers._sum.incorrectCount || 0
    const totalAnswered = totalCorrect + totalIncorrect
    const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0

    // Get progress by deck
    const progressByDeck = await prisma.userProgress.groupBy({
      by: ['userId'],
      where: { userId: payload.userId },
      _count: true,
    })

    return NextResponse.json({
      summary: {
        totalCardsStudied: totalProgress,
        dueForReview,
        totalCorrect,
        totalIncorrect,
        totalAnswered,
        accuracy: Math.round(accuracy * 10) / 10,
      },
    })
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
