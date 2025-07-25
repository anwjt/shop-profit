
'use server';
/**
 * @fileOverview A flow for suggesting a promotional price.
 *
 * - suggestPrice - A function that suggests a promotional price based on the current selling price.
 * - SuggestPriceInput - The input type for the suggestPrice function.
 * - SuggestPriceOutput - The return type for the suggestPrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestPriceInputSchema = z.object({
  currentPrice: z.number().describe('The current calculated selling price of the product.'),
  cost: z.number().describe('The cost of the product.'),
  profit: z.number().describe('The current calculated profit.'),
});
export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;

const SuggestPriceOutputSchema = z.object({
  shouldSuggest: z
    .boolean()
    .describe('Whether a price suggestion should be provided.'),
  suggestedPrice: z
    .number()
    .optional()
    .describe('The suggested promotional price, ending in a psychological tier like .99 or .00.'),
  reasoning: z
    .string()
    .optional()
    .describe('A brief explanation for the suggestion.'),
});
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

export async function suggestPrice(input: SuggestPriceInput): Promise<SuggestPriceOutput> {
  return suggestPriceFlow(input);
}

const suggestPricePrompt = ai.definePrompt({
  name: 'suggestPricePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: SuggestPriceInputSchema },
  output: { schema: SuggestPriceOutputSchema },
  prompt: `You are an expert e-commerce pricing strategist.
Your task is to suggest a "psychological" promotional price based on the user's calculated selling price.

Current calculated price: {{{currentPrice}}}
Product cost: {{{cost}}}
Current calculated profit: {{{profit}}}

Analyze the current price. Decide if a promotional price would be beneficial.
- If the current price is already a good psychological price (e.g., 199.00, 250.00), you can decide not to suggest a new one.
- If you suggest a price, it should be slightly lower than the current price and rounded to a common psychological tier (e.g., ending in .99, .95, or a round number like 99 or 100).
- The suggested price must NOT be lower than the product cost.
- Provide a brief reasoning for your suggestion. For example, "Rounding down to a '.99' price can make the offer seem more attractive to buyers." or "This price point is common for products in this range."

Based on your analysis, decide whether to make a suggestion and fill out the response.
`,
});


const suggestPriceFlow = ai.defineFlow(
  {
    name: 'suggestPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async (input) => {
    const { output } = await suggestPricePrompt(input);
    return output!;
  }
);
