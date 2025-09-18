// Configurações da API
const API_CONFIG = {
    // Chave da API do Google Gemini 2.0 Flash
    // Obtenha sua chave em: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'AIzaSyBQ8lMOIFXne3Et8HO7lHNJz1nJy3afquc',
    
    // Chave da API do Unsplash
    // Obtenha sua chave em: https://unsplash.com/developers
    UNSPLASH_ACCESS_KEY: 'ulwOrMxxuiiJ017AKRAFB5-CmQnA1qi2Ti9Rk7Nnieo',
    
    // Google OAuth Client ID
    // Obtenha sua chave em: https://console.developers.google.com/
    GOOGLE_CLIENT_ID: '571729346307-5vc9hud8ojo5r4p8a0loh1km27hhrk67.apps.googleusercontent.com',
    
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

// Função para obter o Client ID do Google
function getGoogleClientId() {
    return API_CONFIG.GOOGLE_CLIENT_ID || '571729346307-5vc9hud8ojo5r4p8a0loh1km27hhrk67.apps.googleusercontent.com';
}

// Verificar se as chaves estão configuradas
function checkApiKeys() {
    const geminiKey = getGeminiApiKey();
    const unsplashKey = getUnsplashApiKey();
    const googleClientId = getGoogleClientId();
    
    if (geminiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('Chave da API do Gemini não configurada.');
        return false;
    }
    
    if (unsplashKey === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
        console.warn('Chave da API do Unsplash não configurada.');
        return false;
    }
    
    if (googleClientId === '571729346307-5vc9hud8ojo5r4p8a0loh1km27hhrk67.apps.googleusercontent.com') {
        console.warn('Google Client ID não configurado.');
        return false;
    }
    
    return true;
}
