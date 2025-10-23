import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface QuestionRow {
  deck_slug: string
  deck_name: string
  deck_category: string
  front_text: string
  back_text: string
  scripture_refs: string
  difficulty: string
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  console.log('👤 Creating demo user...')
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@knowingapp.com' },
    update: {},
    create: {
      email: 'demo@knowingapp.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })
  console.log(`✅ Demo user created: ${demoUser.email}`)

  // Read CSV file
  console.log('📖 Reading questions from CSV...')
  const csvPath = join(__dirname, 'seed-questions.csv')
  const csvContent = readFileSync(csvPath, 'utf-8')

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as QuestionRow[]

  console.log(`📊 Found ${records.length} questions`)

  // Group by deck
  const deckMap = new Map<string, QuestionRow[]>()
  records.forEach(record => {
    if (!deckMap.has(record.deck_slug)) {
      deckMap.set(record.deck_slug, [])
    }
    deckMap.get(record.deck_slug)!.push(record)
  })

  console.log(`📚 Creating ${deckMap.size} decks...`)

  // Create decks and questions
  for (const [slug, questions] of deckMap.entries()) {
    const firstQuestion = questions[0]

    const deck = await prisma.deck.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: firstQuestion.deck_name,
        category: firstQuestion.deck_category,
        description: `${questions.length} questions about ${firstQuestion.deck_name}`,
      },
    })

    console.log(`  📘 Created deck: ${deck.name} (${questions.length} questions)`)

    // Create questions for this deck
    for (const q of questions) {
      const scriptureRefs = q.scripture_refs
        ? q.scripture_refs.split('|').filter(ref => ref.trim())
        : []

      // Check if question already exists
      const existingQuestion = await prisma.question.findFirst({
        where: {
          deckId: deck.id,
          frontText: q.front_text,
        },
      })

      if (!existingQuestion) {
        await prisma.question.create({
          data: {
            deckId: deck.id,
            frontText: q.front_text,
            backText: q.back_text,
            scriptureRefs: scriptureRefs,
            difficulty: parseInt(q.difficulty) || 1,
          },
        })
      }
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`   Users: ${await prisma.user.count()}`)
  console.log(`   Decks: ${await prisma.deck.count()}`)
  console.log(`   Questions: ${await prisma.question.count()}`)
  console.log('\n🎮 Demo credentials:')
  console.log('   Email: demo@knowingapp.com')
  console.log('   Password: demo123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
