'use server';

/**
 * @fileOverview Suggests a final selling price incorporating psychological pricing strategies.
 *
 * - suggestPsychologicalPrice - A function that suggests a final selling price.
 * - SuggestPsychologicalPriceInput - The input type for the suggestPsychologicalPrice function.
 * - SuggestPsychologicalPriceOutput - The return type for the suggestPsychologicalPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPsychologicalPriceInputSchema = z.object({
  calculatedPrice: z.number().describe('The calculated selling price.'),
});
export type SuggestPsychologicalPriceInput = z.infer<
  typeof SuggestPsychologicalPriceInputSchema
>;

const SuggestPsychologicalPriceOutputSchema = z.object({
  suggestedPrice: z
    .number()
    .describe(
      'The suggested selling price incorporating psychological pricing strategies, like ending in .99.'
    ),
  reasoning: z.string().describe('The reasoning behind the suggested price.'),
});
export type SuggestPsychologicalPriceOutput = z.infer<
  typeof SuggestPsychologicalPriceOutputSchema
>;

export async function suggestPsychologicalPrice(
  input: SuggestPsychologicalPriceInput
): Promise<SuggestPsychologicalPriceOutput> {
  return suggestPsychologicalPriceFlow(input);
}

const suggestPsychologicalPricePrompt = ai.definePrompt({
  name: 'suggestPsychologicalPricePrompt',
  input: {schema: SuggestPsychologicalPriceInputSchema},
  output: {schema: SuggestPsychologicalPriceOutputSchema},
  prompt: `You are an expert in pricing strategies, especially psychological pricing.

  Given a calculated selling price of {{calculatedPrice}}, suggest a final selling price that incorporates psychological pricing strategies (e.g., ending in .99).

  Explain your reasoning for the suggested price.
  Reason whether or not to include it in the response, in case the calculated price is already psychologically optimized.
  `,
});

const suggestPsychologicalPriceFlow = ai.defineFlow(
  {
    name: 'suggestPsychologicalPriceFlow',
    inputSchema: SuggestPsychologicalPriceInputSchema,
    outputSchema: SuggestPsychologicalPriceOutputSchema,
  },
  async input => {
    const {output} = await suggestPsychologicalPricePrompt(input);
    return output!;
  }
);
