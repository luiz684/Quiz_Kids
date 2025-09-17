# 🤖 Configuração da IA para Dicas Inteligentes

## 📋 Pré-requisitos

Para usar a funcionalidade de dicas com IA real, você precisa configurar as seguintes APIs:

### 1. 🔑 Google Gemini 2.0 Flash API

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Abra o arquivo `config.js`
6. Substitua `YOUR_GEMINI_API_KEY_HERE` pela sua chave real

```javascript
GEMINI_API_KEY: 'sua_chave_aqui',
```

**Exemplo de uso da API:**
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: SUA_CHAVE_AQUI' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explique como a IA funciona em poucas palavras"
          }
        ]
      }
    ]
  }'
```

### 2. 🖼️ Unsplash API (Opcional)

1. Acesse: https://unsplash.com/developers
2. Crie uma conta gratuita
3. Crie uma nova aplicação
4. Copie a "Access Key"
5. Abra o arquivo `config.js`
6. Substitua `YOUR_UNSPLASH_ACCESS_KEY_HERE` pela sua chave real

```javascript
UNSPLASH_ACCESS_KEY: 'sua_chave_aqui',
```

**Exemplo de uso da API:**
```javascript
// Buscar foto por ID
unsplash.photos.getPhoto("pFqrYbhIAXs");

// Buscar fotos por termo
unsplash.search.getPhotos({
  query: 'matemática educação',
  perPage: 1
});
```

## 🚀 Como Funciona

### Dicas Inteligentes
- A IA analisa a pergunta específica
- Gera dicas personalizadas e educativas
- Usa linguagem apropriada para crianças
- Inclui emojis e formatação visual

### Imagens Relacionadas
- Busca imagens relevantes no Unsplash
- Fallback para imagens genéricas se a API falhar
- Imagens otimizadas para web

## ⚙️ Configuração Alternativa

Se você não quiser configurar as APIs, o sistema funcionará com:
- Dicas genéricas por matéria
- Imagens pré-definidas
- Funcionalidade básica mantida

## 🔧 Troubleshooting

### Erro: "Chaves da API não configuradas"
- Verifique se as chaves estão corretas no `config.js`
- Certifique-se de que as chaves são válidas

### Erro: "API Error: 403"
- Verifique se a chave do Gemini está correta
- Verifique se a API está habilitada no Google Cloud

### Erro: "API Error: 401"
- Verifique se a chave do Unsplash está correta
- Verifique se a aplicação está ativa

## 📱 Testando

1. Abra o aplicativo
2. Vá para qualquer quiz
3. Clique no botão "Dica"
4. Aguarde a geração da dica inteligente
5. Verifique se a imagem está relacionada ao conteúdo

## 🎯 Benefícios

- ✅ Dicas personalizadas para cada pergunta
- ✅ Imagens relevantes e educativas
- ✅ Linguagem adaptada para crianças
- ✅ Experiência de aprendizado mais rica
- ✅ Fallback robusto em caso de erro
