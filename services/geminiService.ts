
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { Moral, StoryPage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryPlot = async (childName: string, petName: string, moral: Moral): Promise<StoryPage[]> => {
    const prompt = `
        You are a world-class children's storybook author. Create a short, 4-page story for a child named ${childName} and their pet, ${petName}.
        The story must teach the moral of ${moral.title}: "${moral.description}".
        The story must be simple, heartwarming, and easy for a young child to understand. Keep each page's text to 2-3 short sentences.

        Please provide the output in a valid JSON format. The JSON must be an array of objects, where each object represents a page of the book. 
        Each object must have these three properties:
        1. "page": The page number (integer, starting from 1).
        2. "text": The text for that page (string).
        3. "imagePrompt": A detailed visual description for an illustrator. This prompt should describe the scene, characters, their actions, and emotions. 
           It is critical that you maintain a consistent physical description of ${childName} and ${petName} in every prompt. Start the first prompt with "A beautiful, whimsical, children's storybook illustration of...".
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            page: { type: Type.INTEGER },
                            text: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING },
                        },
                        required: ["page", "text", "imagePrompt"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const plot = JSON.parse(jsonText) as StoryPage[];
        return plot;
    } catch (error) {
        console.error("Error generating story plot:", error);
        throw new Error("Failed to create a story plot. Please try again.");
    }
};

export const generateInitialImage = async (prompt: string): Promise<{ base64: string; mimeType: string }> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("No image was generated.");
        }
        
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return { base64: base64ImageBytes, mimeType: 'image/png' };

    } catch (error) {
        console.error("Error generating initial image:", error);
        throw new Error("Failed to paint the first scene. Please try again.");
    }
};

export const generateImageFromPhotos = async (
    images: { data: string; mimeType: string }[],
    prompt: string
): Promise<{ base64: string; mimeType: string }> => {
    const textPart = {
        text: `${prompt}. Use the provided image(s) as a reference to create the characters in a whimsical, children's storybook art style. Ensure the characters are consistent with the reference photos.`
    };

    const imageParts = images.map(image => ({
        inlineData: {
            data: image.data,
            mimeType: image.mimeType,
        }
    }));
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [...imageParts, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
             return { base64: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType };
        } else {
            throw new Error("No image was returned from the photo-based generation.");
        }

    } catch (error) {
        console.error("Error generating image from photos:", error);
        throw new Error("Failed to paint the first scene from your photos. Please try again.");
    }
};


export const editImage = async (baseImageBase64: string, mimeType: string, prompt: string): Promise<{ base64: string; mimeType: string }> => {
    const editPrompt = `Following this instruction: "${prompt}", redraw the provided image while keeping the exact same art style and character designs.`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: baseImageBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: editPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
             return { base64: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType };
        } else {
            throw new Error("No image was returned from the edit operation.");
        }

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to illustrate the next page. Please try again.");
    }
};
