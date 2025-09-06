import { useLessonStore } from './useLessonStore';

const toKebabCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
};

/**
 * A custom hook to handle the logic for completing a game and advancing the lesson.
 * It standardizes how game outcomes are processed and how the lesson progresses.
 *
 * @param {object} node - The current gameInteraction node from the lesson.
 * @returns {function(string): void} A function to call with the outcome text to complete the game.
 */
export const useGameOutcomeHandler = (node) => {
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  // Read from `options` first, with a fallback to `outcomes` for compatibility.
  const outcomes = node.data.options || node.data.outcomes || [];

  const handleGameComplete = (outcome) => {
    if (!outcome) {
      console.error('handleGameComplete called with an empty outcome.');
      return;
    }

    let sourceHandle;

    if (typeof outcome === 'string') {
      // Legacy support for string arrays
      const outcomeIndex = outcomes.findIndex((o) => o.toLowerCase() === outcome.toLowerCase());
      sourceHandle = `game-outcome-${outcomeIndex}-${toKebabCase(outcome)}`;
    } else {
      // New format: array of objects with id and text.
      // The sourceHandle format is derived from the handle group and output ID in the builder.
      sourceHandle = `game-outcome-${outcome.id}`;
    }

    advanceLesson(sourceHandle);
  };

  return handleGameComplete;
};