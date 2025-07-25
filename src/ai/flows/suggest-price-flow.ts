
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
  apiKey: z.string().describe("The user's Gemini API key."),
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.'),
  currentPrice: z.number().describe('The current calculated selling price of the product.'),
  cost: z.number().describe('The cost of the product.'),
  profit: z.number().describe('The current calculated profit.'),
  platform: z.string().describe('The e-commerce platform (e.g., Shopee, Lazada).'),
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
  try {
    return await suggestPriceFlow(input);
  } catch (e: any) {
    console.error('Error in suggestPrice flow:', e);
    // Re-throw a more user-friendly error or a structured error
    throw new Error(`AI suggestion failed: ${e.message || 'An unexpected error occurred.'} \n ${e.stack}`);
  }
}

const suggestPricePrompt = ai.definePrompt({
  name: 'suggestPricePrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: SuggestPriceInputSchema },
  output: { schema: SuggestPriceOutputSchema },
  prompt: `You are an expert Thai e-commerce pricing strategist.
Your task is to analyze a product and suggest a "psychological" promotional price based on the user's data.

**Product Information:**
- Product Name: {{{productName}}}
- Product Description: {{{productDescription}}}
- Platform: {{{platform}}}

**Financial Data:**
- Current calculated selling price: {{{currentPrice}}}
- Product cost: {{{cost}}}
- Current calculated profit: {{{profit}}}

**Your Analysis Steps:**
1.  **Understand the Product:** Analyze the name and description to understand the product's value and target audience.
2.  **Develop Pricing Strategy:**
    - Decide if a promotional price would be beneficial. If the current price is already very competitive and well-priced, you can choose not to suggest a new one.
    - **CRITICAL LOGIC:** If you determine the {{{currentPrice}}} is too high and suggest a lower price, the 'suggestedPrice' **MUST BE LOWER** than the 'currentPrice'. Do not suggest a higher price while reasoning that the current price is too high.
    - The price should be psychologically appealing. **Crucially, round the final suggested price to a common psychological pricing tier, such as ending in .99, .95, or a round number like 99 or 100.**
    - **ULTRA-CRITICAL RULE:** The final 'suggestedPrice' **MUST NOT, under any circumstances, be lower than the product cost ({{{cost}}}).** This is the most important rule. If your psychological price calculation results in a price lower than the cost, you must either adjust it to be equal to or greater than the cost, or decide not to suggest a price at all by setting 'shouldSuggest' to false.

3.  **Formulate Response:**
    - Provide a brief, insightful reasoning for your suggestion. For example, "For a product like this on {{{platform}}}, a price around 199.00 THB is highly competitive. Rounding down to 199.00 makes the offer attractive and stands out." or "The current price is already excellent, no change is needed."
    - **The reasoning must be in the Thai language.**
    - Based on your analysis, decide whether to make a suggestion and fill out the response.
`,
});


const suggestPriceFlow = ai.defineFlow(
  {
    name: 'suggestPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async (input) => {
    // In a real app, you would pass the user's API key to the model
    // For now, we are just passing it through the flow.
    const { output } = await suggestPricePrompt(input);
    return output!;
  }
);
