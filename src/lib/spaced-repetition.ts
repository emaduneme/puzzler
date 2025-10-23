/**
 * Spaced Repetition Algorithm (SM-2 inspired)
 *
 * This algorithm calculates the next review date and ease factor
 * based on whether the user answered correctly or incorrectly.
 */

export interface ReviewResult {
  nextReviewAt: Date
  intervalDays: number
  easeFactor: number
  repetition: number
}

export interface ReviewParams {
  correct: boolean
  currentEaseFactor: number
  currentRepetition: number
  currentIntervalDays: number
}

export function calculateNextReview(params: ReviewParams): ReviewResult {
  const { correct, currentEaseFactor, currentRepetition, currentIntervalDays } = params

  let newEaseFactor = currentEaseFactor
  let newRepetition = currentRepetition
  let newIntervalDays = currentIntervalDays

  if (correct) {
    // Increase repetition
    newRepetition = currentRepetition + 1

    // Calculate new interval based on repetition
    if (newRepetition === 1) {
      newIntervalDays = 1
    } else if (newRepetition === 2) {
      newIntervalDays = 6
    } else {
      newIntervalDays = Math.round(currentIntervalDays * currentEaseFactor)
    }

    // Slightly increase ease factor for correct answers (max 2.5)
    newEaseFactor = Math.min(2.5, currentEaseFactor + 0.1)
  } else {
    // Reset on incorrect answer
    newRepetition = 0
    newIntervalDays = 1

    // Decrease ease factor (min 1.3)
    newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2)
  }

  // Calculate next review date
  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + newIntervalDays)

  return {
    nextReviewAt,
    intervalDays: newIntervalDays,
    easeFactor: newEaseFactor,
    repetition: newRepetition,
  }
}

/**
 * Determine if a question is due for review
 */
export function isDueForReview(nextReviewAt: Date): boolean {
  return new Date() >= nextReviewAt
}
