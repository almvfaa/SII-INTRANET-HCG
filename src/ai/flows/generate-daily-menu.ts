'use server';

/**
 * @fileOverview An AI agent for generating daily menus based on service and pathology profiles.
 *
 * - generateDailyMenu - A function that generates a daily menu.
 * - GenerateDailyMenuInput - The input type for the generateDailyMenu function.
 * - GenerateDailyMenuOutput - The return type for the generateDailyMenu function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyMenuInputSchema = z.object({
  serviceProfile: z
    .string()
    .describe('The name of the service profile to use for menu generation.'),
  pathologyProfile: z
    .string()
    .describe('The name of the pathology profile to use for menu generation.'),
  date: z
    .string()
    .describe('The date for which to generate the menu (YYYY-MM-DD).'),
});
export type GenerateDailyMenuInput = z.infer<typeof GenerateDailyMenuInputSchema>;

const GenerateDailyMenuOutputSchema = z.object({
  menu: z.string().describe('The generated daily menu.'),
});
export type GenerateDailyMenuOutput = z.infer<typeof GenerateDailyMenuOutputSchema>;

export async function generateDailyMenu(input: GenerateDailyMenuInput): Promise<GenerateDailyMenuOutput> {
  return generateDailyMenuFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyMenuPrompt',
  input: {schema: GenerateDailyMenuInputSchema},
  output: {schema: GenerateDailyMenuOutputSchema},
  prompt: `You are a dietitian specializing in creating daily menus based on service and pathology profiles.

You will use the provided service profile, pathology profile, and date to generate a daily menu that adheres to the dietary rules and nutritional needs of the specified profiles.

Service Profile: {{{serviceProfile}}}
Pathology Profile: {{{pathologyProfile}}}
Date: {{{date}}}

Generate a detailed daily menu, including breakfast, lunch, dinner, and snacks, that is appropriate for the given profiles and date. Format the response as a list.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateDailyMenuFlow = ai.defineFlow(
  {
    name: 'generateDailyMenuFlow',
    inputSchema: GenerateDailyMenuInputSchema,
    outputSchema: GenerateDailyMenuOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

