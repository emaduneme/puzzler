import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    })

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      deck: {
        id: deck.id,
        slug: deck.slug,
        name: deck.name,
        description: deck.description,
        category: deck.category,
        questionCount: deck._count.questions,
      },
    })
  } catch (error) {
    console.error('Get deck error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
