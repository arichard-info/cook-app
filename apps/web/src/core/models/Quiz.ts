export interface QuizOption {
  id: string
  label: string
}

export interface QuizQuestion {
  id: string
  text: string
  type: 'single' | 'multiple'
  options: QuizOption[]
  /** If true, render an optional free-text "Autre..." input */
  allowOther?: boolean
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizAnswer {
  questionId: string
  /** Selected option IDs */
  selectedOptionIds: string[]
  /** Defined (even if empty string) when "Autre" is checked; undefined when not */
  otherText?: string
}
