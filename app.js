"use strict";

(function () {
  const TIME_PER_QUESTION_SECONDS = 30;
  const WIKI_API = "https://pt.wikipedia.org/w/api.php";

  const AVATAR_PRESETS = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Ava'
  ];

  const THEMES = {
    default: { primary: '#00d26a', accent: '#7ed7ff', pink: '#ff85d2', purple: '#a78bfa', green: '#34d399', bg: '#0f172a' },
    disney:  { primary: '#ffcc00', accent: '#0077ff', pink: '#ff80ab', purple: '#8e24aa', green: '#36c9a3', bg: '#0b102d' },
    marvel:  { primary: '#ff1e1e', accent: '#3b82f6', pink: '#fb7185', purple: '#9333ea', green: '#10b981', bg: '#0b102d' },
    dc:      { primary: '#1e3a8a', accent: '#60a5fa', pink: '#f472b6', purple: '#6366f1', green: '#22c55e', bg: '#0b102d' },
  };

  const categories = {
    matematica: {
      id: "matematica",
      name: "Matemática",
      description: "Contas e números divertidos",
      emoji: "🧮",
      questions: [
        { text: "Quanto é 3 + 4?", options: ["5","6","7","8"], correctIndex: 2, hintQuery: "adição 3+4 crianças" },
        { text: "Sequência: 2, 4, 6, __, 10", options: ["7","8","9","11"], correctIndex: 1, hintQuery: "sequência números pares" },
        { text: "Quanto é 9 − 5?", options: ["3","4","5","6"], correctIndex: 1, hintQuery: "subtração 9-5 crianças" },
      ],
    },
    portugues: {
      id: "portugues",
      name: "Português",
      description: "Palavras e textos",
      emoji: "🔤",
      questions: [
        { text: "Plural de 'pão'", options: ["pães","pãoes","paeses","pans"], correctIndex: 0, hintQuery: "pão plural português" },
        { text: "Palavra correta", options: ["excessão","exceção","exessão","execessão"], correctIndex: 1, hintQuery: "ortografia exceção" },
        { text: "O ____ ladra", options: ["cao","cão","cãu","cäo"], correctIndex: 1, hintQuery: "cachorro latindo" },
      ],
    },
    ciencias: {
      id: "ciencias",
      name: "Ciências",
      description: "Descobrindo o mundo",
      emoji: "🔬",
      questions: [
        { text: "Planeta vermelho", options: ["Terra","Marte","Júpiter","Vênus"], correctIndex: 1, hintQuery: "Marte planeta vermelho" },
        { text: "Peixes respiram com...", options: ["Pulmões","Brânquias","Pele","Nariz"], correctIndex: 1, hintQuery: "brânquias peixes" },
        { text: "Água ferve a...", options: ["50 °C","80 °C","100 °C","120 °C"], correctIndex: 2, hintQuery: "ponto de ebulição água 100 °C" },
      ],
    },
    historia: {
      id: "historia",
      name: "História",
      description: "Viagem ao passado",
      emoji: "🗺️",
      questions: [
        { text: "Quem chegou ao Brasil em 1500?", options: ["Pedro Álvares Cabral","Dom Pedro II","Tiradentes","Santos Dumont"], correctIndex: 0, hintQuery: "caravela Pedro Álvares Cabral" },
        { text: "Povos antes de 1500 no Brasil", options: ["Colonizadores","Indígenas","Reis","Romanos"], correctIndex: 1, hintQuery: "povos indígenas Brasil" },
        { text: "7 de setembro comemora...", options: ["República","Independência","Descobrimento","Abolição"], correctIndex: 1, hintQuery: "Independência do Brasil" },
      ],
    },
    geografia: {
      id: "geografia",
      name: "Geografia",
      description: "Lugares e mapas",
      emoji: "🧭",
      questions: [
        { text: "Capital do Brasil", options: ["Rio","São Paulo","Brasília","Salvador"], correctIndex: 2, hintQuery: "Brasília capital" },
        { text: "Continente do Brasil", options: ["América do Sul","Europa","África","América do Norte"], correctIndex: 0, hintQuery: "mapa América do Sul" },
        { text: "Amazônia é...", options: ["Deserto","Floresta","Gelo","Montanhas"], correctIndex: 1, hintQuery: "Floresta Amazônica" },
      ],
    },
  };

  // Elements
  const loginScreen = document.getElementById("login-screen");
  const openLoginBtn = document.getElementById("open-login");
  const closeLoginBtn = document.getElementById("close-login");
  const openThemeBtn = document.getElementById("open-theme");
  const themePanel = document.getElementById("theme-panel");
  const closeThemeBtn = document.getElementById("close-theme");
  const menuScreen = document.getElementById("menu-screen");
  const subjectsGrid = document.getElementById("subjects-grid");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const confettiContainer = document.getElementById("confetti-container");

  const backToMenuBtn = document.getElementById("back-to-menu");
  const categoryNameEl = document.getElementById("category-name");
  const timeRemainingEl = document.getElementById("time-remaining");
  const progressEl = document.getElementById("progress");
  const questionTextEl = document.getElementById("question-text");
  const optionsEl = document.getElementById("options");
  const hintButton = document.getElementById("hint-button");
  const hintImage = document.getElementById("hint-image");
  const nextButton = document.getElementById("next-button");

  const resultSummary = document.getElementById("result-summary");
  const retryButton = document.getElementById("retry-button");
  const resultMenuButton = document.getElementById("result-menu-button");

  // Login/profile
  const userProfile = document.getElementById("user-profile");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");
  const logoutButton = document.getElementById("logout-button");
  const firstNameInput = document.getElementById("first-name");
  const lastNameInput = document.getElementById("last-name");
  const nicknameInput = document.getElementById("nickname");
  const avatarGrid = document.getElementById("avatar-grid");
  const quickCreateBtn = document.getElementById("quick-create");

  // A11y
  const a11yButton = document.getElementById("a11y-button");
  const a11yPanel = document.getElementById("a11y-panel");
  const a11yClose = document.getElementById("a11y-close");
  const toggleContrast = document.getElementById("toggle-contrast");
  const toggleText = document.getElementById("toggle-text");
  const toggleMotion = document.getElementById("toggle-motion");

  // State
  let currentCategoryId = null;
  let currentQuestionIndex = 0;
  let currentScore = 0;
  let timeLeft = TIME_PER_QUESTION_SECONDS;
  let timerId = null;
  let hasAnsweredCurrent = false;
  let hintVisibleForCurrent = false;
  let currentUser = null;
  let selectedAvatarIndex = 0;

  // Render cards das matérias
  function renderSubjectCards() {
    const fragment = document.createDocumentFragment();
    Object.values(categories).forEach((cat) => {
      const card = document.createElement("button");
      card.className = "subject-card";
      card.innerHTML = `
        <div class="subject-title">
          <span style="font-size:20px">${cat.emoji}</span>
          <span>${cat.name}</span>
        </div>
        <div class="subject-desc">${cat.description}</div>
      `;
      card.addEventListener("click", () => startQuiz(cat.id));
      fragment.appendChild(card);
    });
    subjectsGrid.innerHTML = "";
    subjectsGrid.appendChild(fragment);
  }

  // Render escolha de avatar
  function renderAvatarChoices() {
    avatarGrid.innerHTML = '';
    AVATAR_PRESETS.forEach((url, i) => {
      const btn = document.createElement('button');
      btn.className = 'avatar-choice';
      btn.setAttribute('aria-selected', String(i === selectedAvatarIndex));
      btn.innerHTML = `<img src="${url}" alt="Avatar ${i+1}" width="72" height="72"/>`;
      btn.addEventListener('click', () => {
        selectedAvatarIndex = i;
        Array.from(avatarGrid.children).forEach((c, idx) => c.setAttribute('aria-selected', String(idx === i)));
      });
      avatarGrid.appendChild(btn);
    });
  }

  // --- Quiz ---
  function startQuiz(categoryId) {
    currentCategoryId = categoryId;
    currentQuestionIndex = 0;
    currentScore = 0;
    hasAnsweredCurrent = false;
    hintVisibleForCurrent = false;
    categoryNameEl.textContent = categories[categoryId].name;
    menuScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    renderQuestion();
  }

  function getCurrentQuestion() {
    return categories[currentCategoryId].questions[currentQuestionIndex];
  }

  function renderQuestion() {
    const cat = categories[currentCategoryId];
    const total = cat.questions.length;
    const q = getCurrentQuestion();
    const progressPercent = Math.round((currentQuestionIndex / total) * 100);
    progressEl.style.setProperty("--w", progressPercent + "%");

    hasAnsweredCurrent = false;
    hintVisibleForCurrent = false;
    nextButton.disabled = true;
    hintImage.classList.add("hidden");
    hintImage.removeAttribute("src");

    questionTextEl.textContent = q.text;
    optionsEl.innerHTML = "";
    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.textContent = opt;
      btn.addEventListener("click", () => handleSelectOption(index));
      optionsEl.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(timerId);
    timeLeft = TIME_PER_QUESTION_SECONDS;
    timeRemainingEl.textContent = String(timeLeft);
    timerId = setInterval(() => {
      timeLeft -= 1;
      timeRemainingEl.textContent = String(timeLeft);
      if (timeLeft <= 0) { clearInterval(timerId); handleTimeOut(); }
    }, 1000);
  }
  function stopTimer() { clearInterval(timerId); }

  function handleSelectOption(index) {
    if (hasAnsweredCurrent) return;
    const q = getCurrentQuestion();
    hasAnsweredCurrent = true;
    stopTimer();
    const optionButtons = Array.from(optionsEl.querySelectorAll(".option"));
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) btn.classList.add("correct");
      if (idx === index && idx !== q.correctIndex) btn.classList.add("wrong");
    });
    if (index === q.correctIndex) currentScore += 1;
    nextButton.disabled = false;
  }

  function handleTimeOut() {
    if (hasAnsweredCurrent) return;
    hasAnsweredCurrent = true;
    const q = getCurrentQuestion();
    const optionButtons = Array.from(optionsEl.querySelectorAll(".option"));
    optionButtons.forEach((btn, idx) => { btn.disabled = true; if (idx === q.correctIndex) btn.classList.add("correct"); });
    nextButton.disabled = false;
  }

  // Dicas
  async function showHint() {
    if (!currentCategoryId) return;
    const q = getCurrentQuestion();
    const query = q.hintQuery || q.text;
    if (!hintVisibleForCurrent) {
      const url = await buildHintUrl(query);
      hintImage.onerror = () => { hintImage.src = ""; };
      hintImage.src = url || "";
      hintImage.classList.remove("hidden");
      hintVisibleForCurrent = true;
    } else {
      hintImage.classList.add("hidden");
      hintVisibleForCurrent = false;
    }
  }

  async function buildHintUrl(keyword) {
    const params = new URLSearchParams({
      action: "query", origin: "*", format: "json",
      prop: "pageimages", piprop: "thumbnail", pithumbsize: "640",
      generator: "search", gsrsearch: keyword, gsrlimit: "1"
    });
    try {
      const res = await fetch(`${WIKI_API}?${params.toString()}`);
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const first = Object.values(pages)[0];
      return first?.thumbnail?.source || "";
    } catch { return ""; }
  }

  function goToNextQuestion() {
    const cat = categories[currentCategoryId];
    if (currentQuestionIndex < cat.questions.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    stopTimer();
    const cat = categories[currentCategoryId];
    const total = cat.questions.length;
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    resultSummary.textContent = `Você acertou ${currentScore} de ${total} perguntas em ${cat.name}!`;
    launchConfetti();
  }

  function backToMenu() {
    stopTimer();
    menuScreen.classList.remove("hidden");
    quizScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
  }

  // --- Login manual ---
  const openLogin = () => { renderAvatarChoices(); loginScreen.classList.remove('hidden'); };
  const closeLogin = () => loginScreen.classList.add('hidden');
  openLoginBtn.addEventListener('click', openLogin);
  closeLoginBtn.addEventListener('click', closeLogin);
  logoutButton.addEventListener('click', () => { currentUser = null; userProfile.classList.add('hidden'); });
  quickCreateBtn.addEventListener('click', () => {
    const first = (firstNameInput.value || 'Aluno').trim();
    const last = (lastNameInput.value || '').trim();
    const nick = (nicknameInput.value || first).trim();
    const avatarUrl = AVATAR_PRESETS[selectedAvatarIndex];
    currentUser = { name: `${first} ${last}`.trim(), nickname: nick, avatar: avatarUrl };
    userAvatar.src = avatarUrl;
    userName.textContent = nick;
    userProfile.classList.remove('hidden');
    closeLogin();
  });

  // --- Google Login ---
  window.onGoogleCredentialResponse = async (response) => {
    try {
      const payload = parseJwt(response.credential);
      const name = (payload?.name || 'Usuário Google').trim();
      const nick = payload?.given_name || 'Hero';
      const avatarUrl = payload?.picture || AVATAR_PRESETS[0];
      currentUser = { name, nickname: nick, avatar: avatarUrl, googleSub: payload?.sub };
      userAvatar.src = avatarUrl;
      userName.textContent = nick;
      userProfile.classList.remove('hidden');
      closeLogin();
    } catch (e) { alert('Falha no login do Google.'); console.error(e); }
  };
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  }

  // Tema
  async function applyTheme(key) {
    const t = THEMES[key] || THEMES.default;
    const root = document.documentElement;
    root.style.setProperty('--primary', t.primary);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--pink', t.pink);
    root.style.setProperty('--purple', t.purple);
    root.style.setProperty('--green', t.green);
    root.style.setProperty('--bg', t.bg);
    themePanel.classList.add('hidden');
  }
  openThemeBtn.addEventListener('click', () => themePanel.classList.remove('hidden'));
  closeThemeBtn.addEventListener('click', () => themePanel.classList.add('hidden'));
  themePanel.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.matches('button[data-theme]')) await applyTheme(t.getAttribute('data-theme'));
  });

  // --- Acessibilidade ---
  a11yButton.addEventListener('click', () => a11yPanel.classList.remove('hidden'));
  a11yClose.addEventListener('click', () => a11yPanel.classList.add('hidden'));
  toggleContrast.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
  toggleText.addEventListener('click', () => document.body.classList.toggle('large-text'));
  toggleMotion.addEventListener('click', () => document.body.classList.toggle('reduce-motion'));

  // --- Confete ---
  function launchConfetti() {
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const div = document.createElement('div');
      div.className = 'confetti';
      div.style.left = `${Math.random() * 100}%`;
      div.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      div.style.animationDuration = `${2 + Math.random() * 3}s`;
      confettiContainer.appendChild(div);
    }
    setTimeout(() => confettiContainer.innerHTML = '', 5000);
  }

  // --- Eventos finais ---
  hintButton.addEventListener('click', showHint);
  nextButton.addEventListener('click', goToNextQuestion);
  retryButton.addEventListener('click', () => startQuiz(currentCategoryId));
  resultMenuButton.addEventListener('click', backToMenu);
  backToMenuBtn.addEventListener('click', backToMenu);

  // Init
  renderSubjectCards();
})();
