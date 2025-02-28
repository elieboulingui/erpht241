// /app/api/translate/route.ts

import { TranslationServiceClient } from '@google-cloud/translate';

const translationClient = new TranslationServiceClient();

const projectId = 'erpht-451216';
const location = 'global';

export async function POST(request: Request) {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    const requestPayload = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: sourceLanguage,
        targetLanguageCode: targetLanguage,
    };

    try {
        const [response] = await translationClient.translateText(requestPayload);
        return new Response(JSON.stringify(response.translations), { status: 200 });
    } catch (error) {
        console.error('Error during translation:', error);
        return new Response('Failed to translate text', { status: 500 });
    }
}
