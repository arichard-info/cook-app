import type { Quiz, QuizAnswer } from '$core/models/Quiz'

export const QUIZ_START_MARKER = '<<<QUIZ_START>>>'
export const QUIZ_END_MARKER = '<<<QUIZ_END>>>'

export const hasQuizStart = (content: string): boolean =>
  content.includes(QUIZ_START_MARKER)

export const hasQuizEnd = (content: string): boolean =>
  content.includes(QUIZ_START_MARKER) && content.includes(QUIZ_END_MARKER)

/**
 * Extracts the text before the quiz start marker — the LLM's intro sentence.
 */
export const extractIntroText = (content: string): string => {
  const startIndex = content.indexOf(QUIZ_START_MARKER)
  if (startIndex === -1) return content.trim()
  return content.substring(0, startIndex).trim()
}

/**
 * Parses the JSON between quiz markers.
 * Returns null if markers are missing or JSON is malformed (triggers plain-text fallback).
 */
export const parseQuiz = (content: string): Quiz | null => {
  const startIndex = content.indexOf(QUIZ_START_MARKER)
  const endIndex = content.indexOf(QUIZ_END_MARKER)
  if (startIndex === -1 || endIndex === -1) return null

  const json = content
    .substring(startIndex + QUIZ_START_MARKER.length, endIndex)
    .trim()

  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed?.questions) || parsed.questions.length === 0) return null
    return parsed as Quiz
  } catch {
    return null
  }
}

/**
 * Builds the formatted user message from quiz answers, for display in the thread
 * and as the prompt sent to the LLM.
 */
export const formatQuizAnswers = (quiz: Quiz, answers: QuizAnswer[]): string => {
  const lines: string[] = ['Voici mes préférences :']

  for (const question of quiz.questions) {
    const answer = answers.find((a) => a.questionId === question.id)
    if (!answer) continue

    const selectedLabels = answer.selectedOptionIds
      .map((id) => question.options.find((o) => o.id === id)?.label)
      .filter((label): label is string => Boolean(label))

    if (answer.otherText?.trim()) {
      selectedLabels.push(answer.otherText.trim())
    }

    if (selectedLabels.length > 0) {
      lines.push(`- ${question.text} → ${selectedLabels.join(', ')}`)
    }
  }

  return lines.join('\n')
}
