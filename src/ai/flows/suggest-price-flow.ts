
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

const CompetitorAnalysisSchema = z.object({
  productName: z.string().describe("The name of the competitor's product."),
  price: z.number().describe("The competitor's price."),
  notes: z.string().describe("Brief notes about the competitor's offering."),
});

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
   competitorAnalysis: z
    .array(CompetitorAnalysisSchema)
    .optional()
    .describe('A simulated analysis of the top 3 competitors in the market.'),
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
  prompt: `You are an expert Thai e-commerce pricing strategist.
Your task is to analyze a product and suggest a "psychological" and "competitive" promotional price based on the user's data. You must also analyze competitor pricing for similar items on the specified platform.

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
2.  **Simulate Competitor Analysis:** Based on the product information, estimate the typical price range for similar products on the given platform ({{{platform}}}). Create a list of 3 simulated competitor products with their estimated prices and brief notes. This should be a realistic market simulation.
3.  **Develop Pricing Strategy:**
    - Decide if a promotional price would be beneficial. If the current price is already very competitive and well-priced, you can choose not to suggest a new one.
    - **CRITICAL LOGIC:** If you determine the {{{currentPrice}}} is too high and suggest a lower price, the 'suggestedPrice' **MUST BE LOWER** than the 'currentPrice'. Do not suggest a higher price while reasoning that the current price is too high.
    - If you suggest a price, it must be competitive with other sellers on the platform (based on your simulated analysis).
    - The price should be psychologically appealing (e.g., ending in .99, .95, or a round number like 99 or 100).
    - **Crucially, the suggested price must NOT be lower than the product cost ({{{cost}}}).**
4.  **Formulate Response:**
    - Provide a brief, insightful reasoning for your suggestion. For example, "For a product like this on {{{platform}}}, a price around 199.00 THB is highly competitive. Rounding down to 199.00 makes the offer attractive and stands out." or "The current price is already excellent, no change is needed."
    - **The reasoning must be in the Thai language.**
    - Based on your analysis, decide whether to make a suggestion and fill out the response, including the simulated competitor analysis.
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
