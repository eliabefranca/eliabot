export interface WordleSession {
  id: string;
  totalWins: number;
  totalLosses: number;

  currentGame: {
    word: string;
    tries: number;
    guessedLetters: string[];
    guessedWords: string[];
  };
}
