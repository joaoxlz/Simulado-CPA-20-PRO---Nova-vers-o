
export interface Question {
  p: string; // pergunta
  o: string[]; // opções
  c: number; // index_correto
  e?: string; // explicação/comentário (opcional)
}

export interface SimuladoProgress {
  currentIndex: number;
  score: number;
  userAnswers: (number | null)[];
  isAnswered: boolean;
  selectedOption: number | null;
  hasStarted: boolean;
  showResult: boolean;
  isReviewMode: boolean;
  timeLeft: number | null; // in seconds
  totalTime: number | null; // in seconds
  sessionQuestions?: Question[]; // To store randomized or sliced questions for the current session
}

export interface QuizState {
  selectedSimulado: number;
  progressions: { [key: number]: SimuladoProgress };
}
