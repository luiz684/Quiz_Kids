// EXEMPLO de configuração das APIs
// Copie este arquivo para config.js e substitua pelas suas chaves reais

const API_CONFIG = {
    // Chave da API do Google Gemini 2.0 Flash
    // Obtenha sua chave em: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'AIzaSyBvOkBw3cF1gHhJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz', // SUBSTITUA PELA SUA CHAVE
    
    // Chave da API do Unsplash
    // Obtenha sua chave em: https://unsplash.com/developers
    UNSPLASH_ACCESS_KEY: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz', // SUBSTITUA PELA SUA CHAVE
    
    // Configurações de fallback
    USE_FALLBACK_IMAGES: true,
    FALLBACK_IMAGE_QUALITY: 'regular' // 'thumb', 'small', 'regular', 'full'
};

// Função para obter a chave da API do Gemini
function getGeminiApiKey() {
    return API_CONFIG.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
}

// Função para obter a chave da API do Unsplash
function getUnsplashApiKey() {
    return API_CONFIG.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY_HERE';
}

// Verificar se as chaves estão configuradas
function checkApiKeys() {
    const geminiKey = getGeminiApiKey();
    const unsplashKey = getUnsplashApiKey();
    
    if (geminiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('⚠️ Chave da API do Gemini não configurada. Dicas serão limitadas.');
        return false;
    }
    
    if (unsplashKey === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
        console.warn('⚠️ Chave da API do Unsplash não configurada. Imagens serão limitadas.');
        return false;
    }
    
    return true;
}

// INSTRUÇÕES:
// 1. Copie este arquivo para config.js
// 2. Substitua as chaves pelas suas chaves reais
// 3. Salve o arquivo
// 4. Teste o aplicativo



