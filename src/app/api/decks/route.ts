import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const decks = await prisma.deck.findMany({
      where: category ? { category } : undefined,
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      decks: decks.map(deck => ({
        id: deck.id,
        slug: deck.slug,
        name: deck.name,
        description: deck.description,
        category: deck.category,
        questionCount: deck._count.questions,
      })),
    })
  } catch (error) {
    console.error('Get decks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
