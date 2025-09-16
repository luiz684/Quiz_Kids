# Configuração do Google Authentication

Este documento explica como configurar o Google Authentication no EduKids.

## Pré-requisitos

1. Uma conta Google
2. Acesso ao Google Cloud Console

## Passo a Passo

### 1. Criar um Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar um projeto" no topo da página
3. Clique em "Novo Projeto"
4. Digite um nome para o projeto (ex: "EduKids Auth")
5. Clique em "Criar"

### 2. Habilitar a Google Identity API

1. No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
2. Procure por "Google Identity"
3. Clique em "Google Identity" e depois em "Ativar"

### 3. Configurar a Tela de Consentimento OAuth

1. Vá em "APIs e Serviços" > "Tela de consentimento OAuth"
2. Selecione "Externo" e clique em "Criar"
3. Preencha os campos obrigatórios:
   - Nome do aplicativo: "EduKids"
   - Email de suporte do usuário: seu email
   - Email de contato do desenvolvedor: seu email
4. Clique em "Salvar e Continuar"
5. Na seção "Escopos", clique em "Adicionar ou Remover Escopos"
6. Adicione os seguintes escopos:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
7. Clique em "Atualizar" e depois "Salvar e Continuar"
8. Na seção "Usuários de teste", adicione seu email
9. Clique em "Salvar e Continuar"

### 4. Criar Credenciais OAuth 2.0

1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do cliente OAuth 2.0"
3. Selecione "Aplicativo da Web"
4. Digite um nome (ex: "EduKids Web Client")
5. Em "Origens JavaScript autorizadas", adicione:
   - `http://localhost` (para desenvolvimento)
   - `https://seudominio.com` (para produção)
6. Em "URIs de redirecionamento autorizados", adicione:
   - `http://localhost` (para desenvolvimento)
   - `https://seudominio.com` (para produção)
7. Clique em "Criar"

### 5. Obter o Client ID

1. Após criar as credenciais, você verá uma tela com o Client ID
2. Copie o Client ID (algo como: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### 6. Configurar no EduKids

1. Abra o arquivo `config.js`
2. Substitua `YOUR_GOOGLE_CLIENT_ID_HERE` pelo seu Client ID:

```javascript
GOOGLE_CLIENT_ID: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
```

### 7. Testar a Configuração

1. Abra o arquivo `index.html` em um navegador
2. Você deve ver duas seções na tela de cadastro:
   - **Seção superior**: "Entrar com Google" com o botão do Google
   - **Seção inferior**: "Criar Perfil Manual" com campo de nickname e seleção de avatar
3. Teste ambas as opções:
   - Clique no botão "Entrar com Google" para login via Google
   - Ou preencha o nickname, escolha um avatar e clique "Começar a Aprender!" para cadastro manual

## Solução de Problemas

### Botão do Google não aparece
- Verifique se o Client ID está correto no `config.js`
- Verifique se o domínio está nas "Origens JavaScript autorizadas"

### Erro "This app isn't verified"
- Isso é normal durante o desenvolvimento
- Clique em "Avançado" e depois "Ir para EduKids (não seguro)"

### Erro de CORS
- Certifique-se de que o domínio está nas "Origens JavaScript autorizadas"
- Para desenvolvimento local, use `http://localhost`

## Produção

Para usar em produção:

1. Adicione seu domínio real nas "Origens JavaScript autorizadas"
2. Publique a tela de consentimento OAuth
3. Configure o domínio de produção no `config.js`

## Segurança

- Nunca compartilhe seu Client ID publicamente
- Use HTTPS em produção
- Configure corretamente as origens autorizadas
- Monitore o uso das credenciais no Google Cloud Console
