// Array of journal prompts for daily reflection
const journalPrompts = [
  'Type here or 🎙️. Spill your tea',
  'What made you smile today? 😊',
  'Unexpected moments and your reactions today? 🔄',
  'Any small victories or accomplishments today? 🏆',
  'How did you relax or unwind today? 🛀',
  'What challenges did you face today? 🚧',
  'Memorable conversations or interactions from today? 💬',
  'Witnessed or experienced kindness today? 🌟',
  'What were you grateful for today? 🙏',
  'Any new discoveries or learnings today? 📚',
  'Impactful decisions made today? 🤔',
];

/**
 * Generates a random number within the specified range, inclusive.
 *
 * @owner Anna Hudson
 *
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (inclusive).
 * @returns {number} - A random integer within the specified range.
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Chooses a random journal prompt from the predefined array.
 *
 * @owner Anna Hudson
 *
 * @returns {string} - A randomly selected journal prompt.
 */
export function getRandomJournalingPrompt() {
  const length = journalPrompts.length;

  // Generate a random index within the length of journalPrompts
  const randomIndex = getRandomNumber(0, length - 1);

  // Retrieve the prompt at the randomly chosen index
  const randomPrompt = journalPrompts[randomIndex];

  return randomPrompt;
}