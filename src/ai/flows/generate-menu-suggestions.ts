'use server';

/**
 * @fileOverview An AI agent for generating alternative food suggestions for a given menu.
 *
 * - generateMenuSuggestions - A function that handles the menu suggestion generation process.
 * - GenerateMenuSuggestionsInput - The input type for the generateMenuSuggestions function.
 * - GenerateMenuSuggestionsOutput - The return type for the generateMenuSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMenuSuggestionsInputSchema = z.object({
  menu: z.string().describe('The menu for which to generate alternative suggestions.'),
  dietaryRestrictions: z.string().optional().describe('Dietary restrictions to consider when generating suggestions.'),
});
export type GenerateMenuSuggestionsInput = z.infer<typeof GenerateMenuSuggestionsInputSchema>;

const GenerateMenuSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of alternative food suggestions.'),
});
export type GenerateMenuSuggestionsOutput = z.infer<typeof GenerateMenuSuggestionsOutputSchema>;

export async function generateMenuSuggestions(input: GenerateMenuSuggestionsInput): Promise<GenerateMenuSuggestionsOutput> {
  return generateMenuSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMenuSuggestionsPrompt',
  input: {schema: GenerateMenuSuggestionsInputSchema},
  output: {schema: GenerateMenuSuggestionsOutputSchema},
  prompt: `You are a dietitian who specializes in generating alternative food suggestions for menus.

  Given the following menu and dietary restrictions, generate a few alternative food suggestions with similar nutritional information, so that ingredients can be easily swapped out based on supply or preferences.

  Menu: {{{menu}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}

  Please provide the suggestions as a list.
  `,
});

const generateMenuSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateMenuSuggestionsFlow',
    inputSchema: GenerateMenuSuggestionsInputSchema,
    outputSchema: GenerateMenuSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
