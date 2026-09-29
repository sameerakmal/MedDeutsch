import type { VocabularyItem } from "../types/vocabulary";
import type {
  Question,
  QuestionType,
  AnswerOption,
  PracticeSessionConfig,
  PracticeSession,
  PracticeResult,
  QuestionExplanation,
} from "../types/practice";
import { vocabulary } from "../data/vocabulary";

/**
 * Fisher-Yates array shuffle (pure, returns new array).
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Safely escape regex special characters.
 */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Formats a German word with its grammatical article if applicable.
 */
export function formatGermanTerm(item: VocabularyItem): string {
  return item.article ? `${item.article} ${item.german}` : item.german;
}

/**
 * Checks whether an item's example sentence cleanly contains the target German word
 * as a standalone word (suitable for sentence completion).
 */
export function canGenerateSentenceCompletion(item: VocabularyItem): boolean {
  if (!item.exampleGerman || !item.german) return false;
  // Look for standalone word boundary supporting German umlauts
  const regex = new RegExp(
    `(^|[^a-zA-ZäöüÄÖÜß])${escapeRegExp(item.german)}([^a-zA-ZäöüÄÖÜß]|$)`,
    "i"
  );
  return regex.test(item.exampleGerman);
}

/**
 * Replaces the target German word in an example sentence with an underlined blank.
 */
export function blankOutSentence(
  sentence: string,
  targetWord: string
): { blanked: string; matchedWord: string } {
  const regex = new RegExp(
    `(^|[^a-zA-ZäöüÄÖÜß])(${escapeRegExp(targetWord)})([^a-zA-ZäöüÄÖÜß]|$)`,
    "i"
  );
  const match = sentence.match(regex);
  if (!match) {
    return {
      blanked: sentence.replace(targetWord, "_______"),
      matchedWord: targetWord,
    };
  }

  const before = match[1];
  const matched = match[2];
  const after = match[3];

  const replaced = sentence.replace(
    `${before}${matched}${after}`,
    `${before}________${after}`
  );

  return {
    blanked: replaced,
    matchedWord: matched,
  };
}

/**
 * Selects 3 distinct, semantically coherent distractors for a given target item.
 * Prioritises:
 * 1. Same level & same category
 * 2. Same level & other categories
 * 3. Any other level in vocabulary
 */
function selectDistractorItems(
  targetItem: VocabularyItem,
  count = 3
): VocabularyItem[] {
  // Pool 1: Same level and same category
  const poolSameCat = shuffle(
    vocabulary.filter(
      (v) =>
        v.id !== targetItem.id &&
        v.level === targetItem.level &&
        v.category === targetItem.category
    )
  );

  // Pool 2: Same level, other categories
  const poolSameLevel = shuffle(
    vocabulary.filter(
      (v) =>
        v.id !== targetItem.id &&
        v.level === targetItem.level &&
        v.category !== targetItem.category
    )
  );

  // Pool 3: Fallback from entire vocabulary
  const poolAll = shuffle(
    vocabulary.filter(
      (v) => v.id !== targetItem.id && v.level !== targetItem.level
    )
  );

  const selected: VocabularyItem[] = [];
  const seenTexts = new Set<string>([
    targetItem.english.toLowerCase().trim(),
    targetItem.german.toLowerCase().trim(),
  ]);

  for (const candidate of [...poolSameCat, ...poolSameLevel, ...poolAll]) {
    const englishKey = candidate.english.toLowerCase().trim();
    const germanKey = candidate.german.toLowerCase().trim();

    if (!seenTexts.has(englishKey) && !seenTexts.has(germanKey)) {
      seenTexts.add(englishKey);
      seenTexts.add(germanKey);
      selected.push(candidate);
      if (selected.length === count) break;
    }
  }

  return selected;
}

/**
 * Creates an explanation payload for feedback and review.
 */
function createExplanation(
  targetItem: VocabularyItem,
  type: QuestionType
): QuestionExplanation {
  const formattedGerman = formatGermanTerm(targetItem);

  let note: string | undefined;
  if (targetItem.article) {
    const gender =
      targetItem.article === "der"
        ? "masculine (m)"
        : targetItem.article === "die"
        ? "feminine (f)"
        : "neuter (n)";
    note = `Grammar: "${targetItem.german}" is a ${gender} noun with the article "${targetItem.article}".`;
  } else if (type === "sentenceCompletion") {
    note = `Clinical usage: Always watch the surrounding sentence context for subject-verb agreement.`;
  }

  return {
    germanText: formattedGerman,
    englishText: targetItem.english,
    exampleGerman: targetItem.exampleGerman,
    exampleEnglish: targetItem.exampleEnglish,
    note,
  };
}

/**
 * Constructs a single Question from a target item and question type.
 */
export function buildQuestion(
  targetItem: VocabularyItem,
  type: QuestionType,
  index: number
): Question {
  const distractors = selectDistractorItems(targetItem, 3);
  const questionId = `q-${index + 1}-${targetItem.id}-${type}`;
  const explanation = createExplanation(targetItem, type);

  if (type === "germanToEnglish") {
    const displayGerman = formatGermanTerm(targetItem);
    const prompt = `What does "${displayGerman}" mean?`;

    const rawOptions = [
      { text: targetItem.english, isCorrect: true, item: targetItem },
      ...distractors.map((d) => ({
        text: d.english,
        isCorrect: false,
        item: d,
      })),
    ];

    const shuffledOptions = shuffle(rawOptions);
    const options: AnswerOption[] = shuffledOptions.map((opt, i) => ({
      id: `opt-${index}-${i}`,
      text: opt.text,
      isCorrect: opt.isCorrect,
      item: opt.item,
    }));

    const correctOption = options.find((o) => o.isCorrect);

    return {
      id: questionId,
      type,
      prompt,
      targetItem,
      options,
      correctOptionId: correctOption?.id ?? options[0].id,
      explanation,
    };
  }

  if (type === "englishToGerman") {
    const prompt = `Which German word means "${targetItem.english}"?`;

    const correctText = formatGermanTerm(targetItem);
    const rawOptions = [
      { text: correctText, isCorrect: true, item: targetItem },
      ...distractors.map((d) => ({
        text: formatGermanTerm(d),
        isCorrect: false,
        item: d,
      })),
    ];

    const shuffledOptions = shuffle(rawOptions);
    const options: AnswerOption[] = shuffledOptions.map((opt, i) => ({
      id: `opt-${index}-${i}`,
      text: opt.text,
      isCorrect: opt.isCorrect,
      item: opt.item,
    }));

    const correctOption = options.find((o) => o.isCorrect);

    return {
      id: questionId,
      type,
      prompt,
      targetItem,
      options,
      correctOptionId: correctOption?.id ?? options[0].id,
      explanation,
    };
  }

  // Sentence Completion
  const { blanked, matchedWord } = blankOutSentence(
    targetItem.exampleGerman,
    targetItem.german
  );

  const prompt = "Complete the clinical sentence:";
  const promptContext = blanked;
  const promptContextTranslation = targetItem.exampleEnglish;

  const rawOptions = [
    { text: matchedWord, isCorrect: true, item: targetItem },
    ...distractors.map((d) => ({
      text: d.german,
      isCorrect: false,
      item: d,
    })),
  ];

  const shuffledOptions = shuffle(rawOptions);
  const options: AnswerOption[] = shuffledOptions.map((opt, i) => ({
    id: `opt-${index}-${i}`,
    text: opt.text,
    isCorrect: opt.isCorrect,
    item: opt.item,
  }));

  const correctOption = options.find((o) => o.isCorrect);

  return {
    id: questionId,
    type: "sentenceCompletion",
    prompt,
    promptContext,
    promptContextTranslation,
    targetItem,
    options,
    correctOptionId: correctOption?.id ?? options[0].id,
    explanation,
  };
}

/**
 * Generates an array of varied, balanced quiz questions based on the session config.
 */
export function generateQuestions(config: PracticeSessionConfig): Question[] {
  // 1. Filter items by level and category
  const filtered = vocabulary.filter((item) => {
    const levelMatch = item.level === config.level;
    const catMatch =
      config.category === "all" || item.category === config.category;
    return levelMatch && catMatch;
  });

  const availableItems =
    filtered.length > 0
      ? filtered
      : vocabulary.filter((v) => v.level === config.level);

  // 2. Shuffle available items and select questionCount
  const shuffledItems = shuffle(availableItems);
  const targetItems = shuffledItems.slice(
    0,
    Math.min(config.questionCount, shuffledItems.length)
  );

  // 3. Balance question types across the session
  // Types cycle: germanToEnglish -> englishToGerman -> sentenceCompletion
  const typeCycle: QuestionType[] = [
    "germanToEnglish",
    "englishToGerman",
    "sentenceCompletion",
  ];

  return targetItems.map((item, index) => {
    let desiredType = typeCycle[index % typeCycle.length];

    // If sentence completion is not viable for this item, fallback to translation
    if (
      desiredType === "sentenceCompletion" &&
      !canGenerateSentenceCompletion(item)
    ) {
      desiredType = index % 2 === 0 ? "germanToEnglish" : "englishToGerman";
    }

    return buildQuestion(item, desiredType, index);
  });
}

/**
 * Generates active recall questions for an explicit list of vocabulary items (e.g. for review sessions).
 * Cycles through question formats while ensuring sentence completion has viable context.
 */
export function generateReviewQuestions(items: VocabularyItem[]): Question[] {
  const typeCycle: QuestionType[] = [
    "germanToEnglish",
    "englishToGerman",
    "sentenceCompletion",
  ];

  return items.map((item, index) => {
    let desiredType = typeCycle[index % typeCycle.length];

    if (
      desiredType === "sentenceCompletion" &&
      !canGenerateSentenceCompletion(item)
    ) {
      desiredType = index % 2 === 0 ? "germanToEnglish" : "englishToGerman";
    }

    return buildQuestion(item, desiredType, index);
  });
}

/**
 * Initializes a new practice session state.
 */
export function createPracticeSession(
  config: PracticeSessionConfig
): PracticeSession {
  const questions = generateQuestions(config);
  return {
    id: `session-${Date.now()}`,
    config,
    questions,
    currentIndex: 0,
    answers: {},
    isCompleted: false,
    startedAt: Date.now(),
  };
}

/**
 * Pure calculation of the session results summary.
 */
export function calculatePracticeResult(
  session: PracticeSession
): PracticeResult {
  const totalQuestions = session.questions.length;
  const answersList = Object.values(session.answers);
  const correctCount = answersList.filter((a) => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    accuracy,
    level: session.config.level,
    category: session.config.category,
    questions: session.questions,
    answers: session.answers,
  };
}
