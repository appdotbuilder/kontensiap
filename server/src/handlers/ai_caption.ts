import { type AiCaptionRequest, type AiCaptionResponse } from '../schema';

export async function generateAiCaptions(input: AiCaptionRequest): Promise<AiCaptionResponse> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is generating AI-powered caption alternatives based on user prompt.
    // Should provide 3 different caption styles and relevant hashtags for culinary content.
    
    const mockCaptions = [
        `🍽️ ${input.prompt} - Rasakan cita rasa yang tak terlupakan! Siap memanjakan lidah Anda hari ini.`,
        `✨ Spesial hari ini: ${input.prompt}! Dibuat dengan bahan-bahan pilihan dan resep rahasia keluarga.`,
        `🔥 Jangan sampai terlewat! ${input.prompt} yang lezat dan bergizi menanti Anda. Pesan sekarang!`
    ];
    
    const mockHashtags = [
        '#kulinerlokal',
        '#makananenak',
        '#resepspesial',
        '#kulinernusantara',
        '#makananbergizi',
        '#cicilanrasa',
        '#promokuliner',
        '#diskonmakanan'
    ];
    
    return Promise.resolve({
        alternatives: mockCaptions,
        hashtags: mockHashtags
    } as AiCaptionResponse);
}

export async function generateHashtagsForNiche(niche: 'CULINARY', businessContext?: string): Promise<string[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is generating relevant hashtags based on business niche and context.
    // Should return trending and relevant hashtags for the specific culinary business type.
    
    const culinaryHashtags = [
        '#kulinerlokal',
        '#makananenak',
        '#kulinernusantara',
        '#makananbergizi',
        '#resepspesial',
        '#cicilanrasa',
        '#warungmakan',
        '#kafeenak'
    ];
    
    return Promise.resolve(culinaryHashtags);
}

export async function mockAiContentSuggestions(templateTitle: string, businessName: string): Promise<{ captions: string[]; hashtags: string[] }> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is providing AI-generated content suggestions based on template and business.
    // Should consider business name and template context for personalized suggestions.
    
    const suggestions = {
        captions: [
            `🌟 ${businessName} persembahkan ${templateTitle}! Menu istimewa yang wajib dicoba hari ini.`,
            `💫 Selamat datang di ${businessName}! ${templateTitle} siap memanjakan selera Anda.`,
            `🎯 Promo spesial ${businessName}: ${templateTitle} dengan harga terjangkau dan rasa premium!`
        ],
        hashtags: [
            '#kulinerlokal',
            '#makananenak',
            '#promokuliner',
            '#resepspesial',
            '#kulinernusantara'
        ]
    };
    
    return Promise.resolve(suggestions);
}