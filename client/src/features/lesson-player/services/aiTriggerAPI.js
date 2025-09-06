/**
 * Simulates an API call to an AI behavior analysis service.
 * @param {object} nodeData - The data from the aiTrigger node.
 * @returns {Promise<string>} A promise that resolves with the fallback text.
 */
export const analyzeBehavior = async (nodeData) => {
  console.log('Simulating AI behavior analysis for:', nodeData.ai_action);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real implementation, this would make a fetch call to a backend service.
  // For now, we just return the fallback text.
  return nodeData.fallback_text || 'Analyzing behavior...';
};