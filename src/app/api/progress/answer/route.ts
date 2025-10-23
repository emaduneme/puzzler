import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'
import { calculateNextReview } from '@/lib/spaced-repetition'
import { z } from 'zod'

const answerSchema = z.object({
  questionId: z.string(),
  correct: z.boolean(),
  responseTime: z.number().optional(),
})

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { questionId, correct } = answerSchema.parse(body)

    // Get or create user progress for this question
    let progress = await prisma.userProgress.findUnique({
      where: {
        userId_questionId: {
          userId: payload.userId,
          questionId,
        },
      },
    })

    let currentEaseFactor = 2.5
    let currentRepetition = 0
    let currentIntervalDays = 1

    if (progress) {
      currentEaseFactor = progress.easeFactor
      currentRepetition = progress.repetition
      currentIntervalDays = progress.intervalDays
    }

    // Calculate next review using spaced repetition algorithm
    const nextReview = calculateNextReview({
      correct,
      currentEaseFactor,
      currentRepetition,
      currentIntervalDays,
    })

    // Update or create progress
    const updatedProgress = await prisma.userProgress.upsert({
      where: {
        userId_questionId: {
          userId: payload.userId,
          questionId,
        },
      },
      update: {
        lastReviewed: new Date(),
        intervalDays: nextReview.intervalDays,
        easeFactor: nextReview.easeFactor,
        repetition: nextReview.repetition,
        nextReviewAt: nextReview.nextReviewAt,
        correctCount: correct
          ? { increment: 1 }
          : undefined,
        incorrectCount: !correct
          ? { increment: 1 }
          : undefined,
      },
      create: {
        userId: payload.userId,
        questionId,
        lastReviewed: new Date(),
        intervalDays: nextReview.intervalDays,
        easeFactor: nextReview.easeFactor,
        repetition: nextReview.repetition,
        nextReviewAt: nextReview.nextReviewAt,
        correctCount: correct ? 1 : 0,
        incorrectCount: correct ? 0 : 1,
      },
    })

    return NextResponse.json({
      progress: {
        nextReviewAt: updatedProgress.nextReviewAt,
        intervalDays: updatedProgress.intervalDays,
        easeFactor: updatedProgress.easeFactor,
        repetition: updatedProgress.repetition,
        correctCount: updatedProgress.correctCount,
        incorrectCount: updatedProgress.incorrectCount,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Answer progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
