'use server';

import { suggestPsychologicalPrice } from '@/ai/flows/suggest-pricing';
import type { SuggestPsychologicalPriceOutput } from '@/ai/flows/suggest-pricing';

export async function getPsychologicalPriceSuggestion(
  calculatedPrice: number
): Promise<SuggestPsychologicalPriceOutput | { error: string }> {
  if (calculatedPrice <= 0) {
    return { error: 'Calculated price must be positive to get a suggestion.' };
  }
  try {
    const result = await suggestPsychologicalPrice({ calculatedPrice });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get AI suggestion. Please try again.' };
  }
}
