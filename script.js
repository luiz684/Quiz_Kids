// EduKids - Sistema Educativo Interativo

// Sistema de Acessibilidade
class AccessibilityManager {
    constructor() {
        this.settings = {
            textSize: 100,
            zoom: 100,
            darkMode: false,
            soundEffects: true
        };
        
        this.audioContext = null;
        this.sounds = {};
        this.originalFontSizes = new Map(); // Armazena tamanhos originais dos elementos
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.initializeAudio();
        // Aguarda o DOM estar pronto antes de armazenar tamanhos
        setTimeout(() => {
            this.storeOriginalFontSizes();
        this.applySettings();
        }, 100);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('edukids-accessibility');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('edukids-accessibility', JSON.stringify(this.settings));
    }
    
    setupEventListeners() {
        // Botão de acessibilidade
        document.getElementById('accessibility-btn').addEventListener('click', () => {
            this.togglePanel();
            this.playSound('click');
        });
        
        // Fechar painel
        document.getElementById('close-accessibility').addEventListener('click', () => {
            this.closePanel();
            this.playSound('click');
        });
        
        document.getElementById('accessibility-overlay').addEventListener('click', () => {
            this.closePanel();
        });
        
        // Controles de tamanho de texto
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('text-size-value');
        
        textSizeSlider.addEventListener('input', (e) => {
            this.settings.textSize = parseInt(e.target.value);
            textSizeValue.textContent = this.settings.textSize + '%';
            this.applyTextSize();
            this.playSound('slider');
        });
        
        // Controles de zoom
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        zoomSlider.addEventListener('input', (e) => {
            this.settings.zoom = parseInt(e.target.value);
            zoomValue.textContent = this.settings.zoom + '%';
            this.applyZoom();
            this.playSound('slider');
        });
        
        // Modo escuro
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            this.applyDarkMode();
            this.playSound('toggle');
        });
        
        // Efeitos sonoros
        document.getElementById('sound-effects-toggle').addEventListener('change', (e) => {
            this.settings.soundEffects = e.target.checked;
            this.playSound('toggle');
        });
        
        // Reset
        document.getElementById('reset-accessibility').addEventListener('click', () => {
            this.resetSettings();
            this.playSound('click');
        });
        
        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.log('Audio não suportado:', error);
        }
    }
    
    createSounds() {
        // Som de clique
        this.sounds.click = this.createTone(800, 0.1, 'sine');
        // Som de slider
        this.sounds.slider = this.createTone(600, 0.05, 'sine');
        // Som de toggle
        this.sounds.toggle = this.createTone(1000, 0.1, 'square');
        // Som de sucesso
        this.sounds.success = this.createTone(523, 0.2, 'sine');
        // Som de erro
        this.sounds.error = this.createTone(200, 0.3, 'sawtooth');
    }
    
    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.settings.soundEffects || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    togglePanel() {
        const panel = document.getElementById('accessibility-panel');
        const overlay = document.getElementById('accessibility-overlay');
        
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            overlay.classList.remove('hidden');
            this.updateControls();
        } else {
            this.closePanel();
        }
    }
    
    closePanel() {
        document.getElementById('accessibility-panel').classList.add('hidden');
        document.getElementById('accessibility-overlay').classList.add('hidden');
        this.saveSettings();
    }
    
    updateControls() {
        document.getElementById('text-size-slider').value = this.settings.textSize;
        document.getElementById('text-size-value').textContent = this.settings.textSize + '%';
        
        document.getElementById('zoom-slider').value = this.settings.zoom;
        document.getElementById('zoom-value').textContent = this.settings.zoom + '%';
        
        document.getElementById('dark-mode-toggle').checked = this.settings.darkMode;
        document.getElementById('sound-effects-toggle').checked = this.settings.soundEffects;
    }
    
    storeOriginalFontSizes() {
        try {
            const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, label, .question-text, .option-btn, .subject-title, .subject-description, .main-title, .subtitle, .form-title, .section-title, .avatar-name, .result-title, .result-message p, .page-title, .page-subtitle, .user-details h2, .user-details p, .accessibility-header h3, .accessibility-option label, .hint-content h3, .hint-content p, .timer, .subject-badge, #question-counter, #time-left, #final-score, #total-questions, #score-percentage, #result-message-text');
            
            textElements.forEach(element => {
                if (element && !this.originalFontSizes.has(element)) {
                    try {
                        const computedStyle = window.getComputedStyle(element);
                        const fontSize = computedStyle.fontSize;
                        if (fontSize && fontSize !== '0px') {
                            this.originalFontSizes.set(element, fontSize);
                        }
                    } catch (error) {
                        console.warn('Erro ao armazenar tamanho de fonte para elemento:', element, error);
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao armazenar tamanhos originais:', error);
        }
    }
    
    applySettings() {
        this.applyTextSize();
        this.applyZoom();
        this.applyDarkMode();
    }
    
    applyTextSize() {
        const body = document.body;
        
        // Remove classes anteriores
        body.classList.remove('text-size-small', 'text-size-normal', 'text-size-large', 'text-size-extra-large', 'text-size-huge');
        
        // Aplica nova classe baseada no valor
        if (this.settings.textSize <= 100) {
            body.classList.add('text-size-normal');
        } else if (this.settings.textSize <= 110) {
            body.classList.add('text-size-large');
        } else if (this.settings.textSize <= 120) {
            body.classList.add('text-size-extra-large');
        } else {
            body.classList.add('text-size-huge');
        }
        
        // Aplica tamanho customizado via CSS
        document.documentElement.style.setProperty('--text-size-multiplier', this.settings.textSize / 100);
        
        // Atualiza elementos de texto existentes
        this.updateTextElements();
    }
    
    updateTextElements() {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, label, .question-text, .option-btn, .subject-title, .subject-description, .main-title, .subtitle, .form-title, .section-title, .avatar-name, .result-title, .result-message p, .page-title, .page-subtitle, .user-details h2, .user-details p, .accessibility-header h3, .accessibility-option label, .hint-content h3, .hint-content p, .timer, .subject-badge, #question-counter, #time-left, #final-score, #total-questions, #score-percentage, #result-message-text');
        
        textElements.forEach(element => {
            // Armazena tamanho original se ainda não foi armazenado
            if (!this.originalFontSizes.has(element)) {
                const computedStyle = window.getComputedStyle(element);
                const fontSize = computedStyle.fontSize;
                this.originalFontSizes.set(element, fontSize);
            }
            
            // Remove estilos inline anteriores
            element.style.fontSize = '';
            
            // Aplica novo tamanho baseado no tamanho original
            if (this.settings.textSize !== 100) {
                const originalSize = this.originalFontSizes.get(element);
                const numericSize = parseFloat(originalSize);
            element.style.fontSize = `${numericSize * (this.settings.textSize / 100)}px`;
            }
        });
    }
    
    applyZoom() {
        const body = document.body;
        
        // Remove classes anteriores
        body.classList.remove('zoom-100', 'zoom-110', 'zoom-120', 'zoom-130', 'zoom-140', 'zoom-150', 'zoom-160', 'zoom-170', 'zoom-180', 'zoom-190', 'zoom-200');
        
        // Aplica nova classe
        const zoomClass = `zoom-${this.settings.zoom}`;
        body.classList.add(zoomClass);
        
        // Aplica zoom via CSS
        document.documentElement.style.zoom = this.settings.zoom / 100;
    }
    
    applyDarkMode() {
        const body = document.body;
        
        if (this.settings.darkMode) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    }
    
    resetSettings() {
        this.settings = {
            textSize: 100,
            zoom: 100,
            darkMode: false,
            soundEffects: true
        };
        
        // Remove todas as classes de zoom e texto
        document.body.classList.remove('zoom-100', 'zoom-110', 'zoom-120', 'zoom-130', 'zoom-140', 'zoom-150', 'zoom-160', 'zoom-170', 'zoom-180', 'zoom-190', 'zoom-200');
        document.body.classList.remove('text-size-small', 'text-size-normal', 'text-size-large', 'text-size-extra-large', 'text-size-huge');
        
        // Reset CSS customizado
        document.documentElement.style.zoom = '1';
        document.documentElement.style.setProperty('--text-size-multiplier', '1');
        
        // Reset font sizes - remove todos os estilos inline
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, label, .question-text, .option-btn, .subject-title, .subject-description, .main-title, .subtitle, .form-title, .section-title, .avatar-name, .result-title, .result-message p, .page-title, .page-subtitle, .user-details h2, .user-details p, .accessibility-header h3, .accessibility-option label, .hint-content h3, .hint-content p, .timer, .subject-badge, #question-counter, #time-left, #final-score, #total-questions, #score-percentage, #result-message-text');
        textElements.forEach(element => {
            element.style.fontSize = '';
        });
        
        // Limpa o cache de tamanhos originais para recarregar
        this.originalFontSizes.clear();
        this.storeOriginalFontSizes();
        
        // Aplica as configurações padrão
        this.applySettings();
        this.updateControls();
        this.saveSettings();
    }
}

class EduKidsApp {
    constructor() {
        this.currentUser = null;
        this.currentSubject = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.trophyPoints = 0; // pontuação em pontos (±)
        this.totalQuestions = 0;
        this.timeLeft = 180;
        this.timer = null;
        this.selectedTime = 180;
        this.selectedAvatar = 1;
        this.accessibilityManager = null;
        this.lastSubjectScores = {};
        this.lastRunDetails = null;



        
        
        // Dados das matérias e perguntas
        this.subjects = {
            math: {
                name: 'Matemática',
                icon: 'M',
                questions: [
                    {
                        question: 'João tem 5 balas e ganhou mais 3. Quantas balas ele tem agora?',
                        options: ['6', '7', '8', '9'],
                        correct: 2,
                        hint: 'João tinha 5 balas e ganhou mais 3 → pense em juntar tudo para saber o total.'
                    },
                    {
                        question: 'Maria tinha 10 brinquedos e deu 4 para sua amiga. Quantos brinquedos sobraram?',
                        options: ['4', '5', '6', '7'],
                        correct: 2,
                        hint: 'Maria tinha 10 brinquedos e deu 4 → pense no que sobrou depois de dar alguns.'
                    },
                    {
                        question: 'Se cada caixa tem 6 lápis e temos 7 caixas, quantos lápis temos no total?',
                        options: ['36', '42', '48', '54'],
                        correct: 1,
                        hint: 'Se cada caixa tem 6 lápis e são 7 caixas → pense em multiplicar ou somar várias vezes.'
                    },
                    {
                        question: 'Ana tem 20 doces e quer dividir igualmente entre 4 amigos. Quantos doces cada um recebe?',
                        options: ['3', '4', '5', '6'],
                        correct: 2,
                        hint: '20 doces para dividir entre 4 amigos → cada um recebe a mesma parte, quantos?'
                    },
                    {
                        question: 'Complete a sequência: 2, 4, 6, __, 10',
                        options: ['7', '8', '9', '11'],
                        correct: 1,
                        hint: 'A sequência cresce de 2 em 2: 2, 4, 6… qual vem antes do 10?'
                    },
                    {
                        question: 'Pedro tem 15 figurinhas e ganhou mais 25. Quantas figurinhas ele tem agora?',
                        options: ['35', '40', '45', '50'],
                        correct: 1,
                        hint: 'Pedro tinha 15 figurinhas e ganhou 25 → junte as dezenas e depois as unidades.'
                    },
                    {
                        question: 'Se cada pacote tem 8 biscoitos e temos 9 pacotes, quantos biscoitos temos?',
                        options: ['64', '72', '80', '88'],
                        correct: 1,
                        hint: '8 biscoitos em cada pacote × 9 pacotes → é uma multiplicação, use a tabuada do 8.'
                    },
                    {
                        question: 'Lucas tem 100 moedas e quer dividir em 5 cofrinhos iguais. Quantas moedas em cada cofrinho?',
                        options: ['15', '18', '20', '25'],
                        correct: 2,
                        hint: '100 moedas em 5 cofrinhos → dividir em partes iguais, pense: 5 × ? = 100.'
                    }
                ]
            },
            portuguese: {
                name: 'Português',
                icon: 'P',
                questions: [
                    {
                        question: 'Se eu tenho uma casa e ganho mais uma, quantas casas eu tenho?',
                        options: ['casas', 'casaes', 'casases', 'casa'],
                        correct: 0,
                        hint: 'Uma casa, duas… Quando temos mais de uma coisa, mudamos a palavra.'
                    },
                    {
                        question: 'Complete: "O menino ___ bonito"',
                        options: ['é', 'está', 'ser', 'estar'],
                        correct: 0,
                        hint: '"O menino ___ bonito" → é algo que sempre é verdade, não só agora.'
                    },
                    {
                        question: 'Qual palavra significa a mesma coisa que "feliz"?',
                        options: ['triste', 'alegre', 'bravo', 'calmo'],
                        correct: 1,
                        hint: 'Feliz = outra palavra parecida… é o contrário de triste, qual é?'
                    },
                    {
                        question: 'Quantas sílabas tem a palavra "escola"?',
                        options: ['2', '3', '4', '5'],
                        correct: 1,
                        hint: '"Escola" tem pedacinhos de som → bata palmas para separar em sílabas.'
                    },
                    {
                        question: 'Qual palavra é o contrário de "grande"?',
                        options: ['alto', 'pequeno', 'largo', 'estreito'],
                        correct: 1,
                        hint: 'O contrário de "grande" é algo bem menorzinho.'
                    },
                    {
                        question: 'Complete: "A menina ___ estudiosa"',
                        options: ['é', 'está', 'ser', 'estar'],
                        correct: 0,
                        hint: '"A menina ___ estudiosa" → é uma característica dela, não só de hoje.'
                    },
                    {
                        question: 'Quantas sílabas tem a palavra "universidade"?',
                        options: ['4', '5', '6', '7'],
                        correct: 2,
                        hint: '"Universidade" tem várias sílabas → fale devagar u-ni-ver-si-da-de.'
                    },
                    {
                        question: 'Se eu tenho um papel e ganho mais um, quantos papéis eu tenho?',
                        options: ['papéis', 'papeis', 'papel', 'papéis'],
                        correct: 0,
                        hint: 'Um papel, dois… Quando passa de um, muda a palavra no final.'
                    }
                ]
            },
            science: {
                name: 'Ciências',
                icon: 'C',
                questions: [
                    {
                        question: 'Qual é o maior órgão do nosso corpo?',
                        options: ['Coração', 'Cérebro', 'Pele', 'Fígado'],
                        correct: 2,
                        hint: 'Qual parte do corpo cobre tudo e nos protege do frio, calor e machucados?'
                    },
                    {
                        question: 'Quantos ossos temos no nosso corpo?',
                        options: ['156', '206', '256', '306'],
                        correct: 1,
                        hint: 'Nosso corpo adulto tem pouco mais de 200 ossos, pense em algo próximo a isso.'
                    },
                    {
                        question: 'Qual animal é conhecido como "rei da selva"?',
                        options: ['Tigre', 'Leão', 'Elefante', 'Gorila'],
                        correct: 1,
                        hint: 'Qual animal com juba é chamado de "rei da selva"?'
                    },
                    {
                        question: 'Qual é a cor das folhas das plantas?',
                        options: ['Vermelha', 'Azul', 'Verde', 'Amarela'],
                        correct: 2,
                        hint: 'As folhas das plantas geralmente têm a mesma cor… qual é a mais comum?'
                    },
                    {
                        question: 'Quantos planetas existem no sistema solar?',
                        options: ['7', '8', '9', '10'],
                        correct: 1,
                        hint: 'O sistema solar tem 8 planetas que giram ao redor do Sol, você lembra?'
                    },
                    {
                        question: 'Qual é o gás que respiramos para viver?',
                        options: ['Nitrogênio', 'Oxigênio', 'Dióxido de carbono', 'Hidrogênio'],
                        correct: 1,
                        hint: 'O ar tem vários gases, mas só um é essencial para respirarmos e viver.'
                    },
                    {
                        question: 'Qual é o animal mais rápido do mundo?',
                        options: ['Guepardo', 'Leão', 'Tigre', 'Leopardo'],
                        correct: 0,
                        hint: 'O animal mais rápido do mundo corre muito mais rápido que um carro na rua.'
                    },
                    {
                        question: 'Para que servem as raízes das plantas?',
                        options: ['Fazer fotossíntese', 'Absorver água e nutrientes', 'Produzir flores', 'Fazer frutos'],
                        correct: 1,
                        hint: 'As raízes puxam algo do solo para a planta crescer forte, qual é a função?'
                    }
                ]
            },
            history: {
                name: 'História',
                icon: 'H',
                questions: [
                    {
                        question: 'Quem descobriu o Brasil em 1500?',
                        options: ['Pedro Álvares Cabral', 'Dom Pedro II', 'Tiradentes', 'Santos Dumont'],
                        correct: 0,
                        hint: 'Quem chegou ao Brasil em 1500 foi um navegador português famoso.'
                    },
                    {
                        question: 'Em que ano o Brasil se tornou independente?',
                        options: ['1808', '1822', '1889', '1922'],
                        correct: 1,
                        hint: 'O grito de independência foi em 1822, lembra da data especial?'
                    },
                    {
                        question: 'Qual foi a primeira capital do Brasil?',
                        options: ['Salvador', 'Rio de Janeiro', 'Brasília', 'São Paulo'],
                        correct: 0,
                        hint: 'A primeira capital não foi Brasília → começou lá no Nordeste do Brasil.'
                    },
                    {
                        question: 'Quem foi Dom Pedro I?',
                        options: ['Um navegador', 'Um herói da independência', 'Um imperador', 'Um artista'],
                        correct: 2,
                        hint: 'Dom Pedro I → ele foi imperador, filho do rei de Portugal, muito importante no Brasil.'
                    },
                    {
                        question: 'Em que século vivemos?',
                        options: ['Século XIX', 'Século XX', 'Século XXI', 'Século XXII'],
                        correct: 2,
                        hint: 'Estamos no século 21 → pense que os anos atuais começam com "20…".'
                    },
                    {
                        question: 'O que comemoramos no dia 7 de setembro?',
                        options: ['República', 'Independência', 'Descobrimento', 'Abolição'],
                        correct: 1,
                        hint: 'No dia 7 de setembro comemoramos algo que nos deixou livres da coroa portuguesa.'
                    },
                    {
                        question: 'Quem foi Tiradentes?',
                        options: ['Um rei', 'Um herói da Inconfidência', 'Um navegador', 'Um artista'],
                        correct: 1,
                        hint: 'Tiradentes foi um herói que lutou por liberdade no Brasil.'
                    },
                    {
                        question: 'Em que data foi proclamada a República do Brasil?',
                        options: ['15 de novembro de 1889', '7 de setembro de 1822', '13 de maio de 1888', '22 de abril de 1500'],
                        correct: 0,
                        hint: 'A República foi proclamada em 1889 → lembra a data especial de novembro?'
                    }
                ]
            },
            geography: {
                name: 'Geografia',
                icon: 'G',
                questions: [
                    {
                        question: 'Qual é a capital do Brasil?',
                        options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
                        correct: 2,
                        hint: 'A capital atual fica no Centro-Oeste, construída só para ser a capital.'
                    },
                    {
                        question: 'Quantos estados tem o Brasil?',
                        options: ['25', '26', '27', '28'],
                        correct: 1,
                        hint: 'O Brasil tem 26 estados + 1 Distrito Federal → totalize isso.'
                    },
                    {
                        question: 'Qual é o maior estado do Brasil?',
                        options: ['São Paulo', 'Minas Gerais', 'Amazonas', 'Pará'],
                        correct: 2,
                        hint: 'O maior estado fica na região Norte e tem a Floresta Amazônica.'
                    },
                    {
                        question: 'Qual é o rio mais famoso do Brasil?',
                        options: ['Rio São Francisco', 'Rio Amazonas', 'Rio Paraná', 'Rio Tietê'],
                        correct: 1,
                        hint: 'O rio mais famoso do Brasil também é o maior em volume de água do mundo.'
                    },
                    {
                        question: 'Qual é a montanha mais alta do Brasil?',
                        options: ['Pico da Neblina', 'Pico da Bandeira', 'Pedra da Mina', 'Morro da Igreja'],
                        correct: 0,
                        hint: 'A montanha mais alta do Brasil fica no Amazonas, bem no topo.'
                    },
                    {
                        question: 'Qual é a região mais populosa do Brasil?',
                        options: ['Norte', 'Nordeste', 'Sudeste', 'Sul'],
                        correct: 2,
                        hint: 'A região mais populosa tem São Paulo, Rio e Minas Gerais → qual é?'
                    },
                    {
                        question: 'Qual é a capital de São Paulo?',
                        options: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
                        correct: 0,
                        hint: 'A capital do estado de São Paulo tem o mesmo nome do estado.'
                    },
                    {
                        question: 'Qual é o ponto turístico mais famoso do Rio de Janeiro?',
                        options: ['Pão de Açúcar', 'Cristo Redentor', 'Praia de Copacabana', 'Maracanã'],
                        correct: 1,
                        hint: 'O ponto turístico mais famoso do Rio é uma estátua gigante de braços abertos.'
                    }
                ]
            },
            art: {
                name: 'Artes',
                icon: 'A',
                questions: [
                    {
                        question: 'Qual cor é formada pela mistura de azul e amarelo?',
                        options: ['Roxo', 'Verde', 'Laranja', 'Rosa'],
                        correct: 1,
                        hint: 'Azul + Amarelo → pense na mistura das tintas, que cor aparece?'
                    },
                    {
                        question: 'Qual é o nome do artista que pintou a Mona Lisa?',
                        options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Monet'],
                        correct: 2,
                        hint: 'A Mona Lisa foi pintada por um artista italiano do Renascimento.'
                    },
                    {
                        question: 'Quantas cordas tem um violão?',
                        options: ['4', '5', '6', '7'],
                        correct: 2,
                        hint: 'O violão tradicional tem várias cordas → conte no desenho.'
                    },
                    {
                        question: 'Qual é o nome da técnica de pintura com pequenos pontos?',
                        options: ['Aquarela', 'Pontilhismo', 'Óleo', 'Giz'],
                        correct: 1,
                        hint: 'Pontilhismo = feito com vários pontinhos pequenos, como se fosse um mosaico.'
                    },
                    {
                        question: 'Qual forma geométrica tem 3 lados?',
                        options: ['Quadrado', 'Retângulo', 'Triângulo', 'Círculo'],
                        correct: 2,
                        hint: '"Tri" significa 3 → que figura tem 3 lados?'
                    },
                    {
                        question: 'Qual é a cor do céu em um dia ensolarado?',
                        options: ['Verde', 'Azul', 'Roxo', 'Amarelo'],
                        correct: 1,
                        hint: 'Em dias de sol, olhe para o céu… qual cor você vê?'
                    },
                    {
                        question: 'Qual instrumento musical tem teclas pretas e brancas?',
                        options: ['Violão', 'Flauta', 'Piano', 'Bateria'],
                        correct: 2,
                        hint: 'Qual instrumento tem teclas brancas e pretas, muito usado em música clássica?'
                    },
                    {
                        question: 'Qual é o nome do movimento artístico de Van Gogh?',
                        options: ['Cubismo', 'Impressionismo', 'Expressionismo', 'Realismo'],
                        correct: 2,
                        hint: 'Van Gogh usava cores fortes e pinceladas expressivas → qual movimento é esse?'
                    }
                ]
            },
            physical_education: {
                name: 'Educação Física',
                icon: 'E',
                questions: [
                    {
                        question: 'Quantos jogadores tem um time de futebol?',
                        options: ['10', '11', '12', '13'],
                        correct: 1,
                        hint: 'Um time de futebol completo tem 10 jogadores + 1 goleiro.'
                    },
                    {
                        question: 'Qual é o nome do esporte que usa raquete e uma bola pequena?',
                        options: ['Tênis', 'Vôlei', 'Basquete', 'Handebol'],
                        correct: 0,
                        hint: 'Esporte de raquete + bolinha pequena → jogado em quadra ou grama.'
                    },
                    {
                        question: 'Quantos quartos tem um jogo de basquete?',
                        options: ['2', '3', '4', '5'],
                        correct: 2,
                        hint: 'O basquete é dividido em 4 períodos → como "quartos".'
                    },
                    {
                        question: 'Qual é o nome do movimento de alongamento que fazemos antes de exercícios?',
                        options: ['Aquecimento', 'Resfriamento', 'Relaxamento', 'Meditação'],
                        correct: 0,
                        hint: 'Antes do exercício, sempre fazemos um movimento para aquecer os músculos.'
                    },
                    {
                        question: 'Qual é a cor da faixa de judô para iniciantes?',
                        options: ['Branca', 'Amarela', 'Verde', 'Azul'],
                        correct: 0,
                        hint: 'A faixa inicial do judô é branca, todos começam iguais.'
                    },
                    {
                        question: 'Quantos metros tem uma pista de atletismo?',
                        options: ['300m', '400m', '500m', '600m'],
                        correct: 1,
                        hint: 'A pista oficial de atletismo tem 400 metros → uma volta completa na pista.'
                    },
                    {
                        question: 'Qual é o nome do esporte que usa rede e bola?',
                        options: ['Futebol', 'Vôlei', 'Basquete', 'Tênis'],
                        correct: 1,
                        hint: 'Esporte de rede, a bola não pode cair no chão → qual é?'
                    },
                    {
                        question: 'Qual é a velocidade máxima permitida em uma corrida de 100m?',
                        options: ['Não há limite', '10 segundos', '15 segundos', '20 segundos'],
                        correct: 0,
                        hint: 'Na corrida de 100m não há limite → cada um corre o mais rápido possível.'
                    }
                ]
            },
            english: {
                name: 'Inglês',
                icon: 'I',
                questions: [
                    {
                        question: 'Como se diz "casa" em inglês?',
                        options: ['House', 'Home', 'Car', 'Book'],
                        correct: 0,
                        hint: 'É o lugar onde dormimos e guardamos nossas coisas. Em inglês, começa com H.'
                    },
                    {
                        question: 'Qual é a tradução de "hello" para português?',
                        options: ['Tchau', 'Olá', 'Obrigado', 'Desculpe'],
                        correct: 1,
                        hint: 'Quando atendemos o telefone, usamos essa palavra em inglês. Começa com H.'
                    },
                    {
                        question: 'Como se diz "gato" em inglês?',
                        options: ['Dog', 'Cat', 'Bird', 'Fish'],
                        correct: 1,
                        hint: 'Esse animal gosta de caçar ratos. Em inglês, começa com C.'
                    },
                    {
                        question: 'Qual é a cor "red" em português?',
                        options: ['Azul', 'Verde', 'Vermelho', 'Amarelo'],
                        correct: 2,
                        hint: 'É a cor que aparece no sinal de trânsito para indicar "pare". Em inglês, começa com R.'
                    },
                    {
                        question: 'Como se diz "obrigado" em inglês?',
                        options: ['Please', 'Thank you', 'Sorry', 'Excuse me'],
                        correct: 1,
                        hint: 'Quando alguém faz algo por você e você quer ser educado, usa-se essa expressão. A primeira palavra começa com T.'
                    },
                    {
                        question: 'Qual é o número "five" em português?',
                        options: ['Três', 'Quatro', 'Cinco', 'Seis'],
                        correct: 2,
                        hint: 'É o número que vem depois do quatro e antes do seis. Em inglês, começa com F.'
                    },
                    {
                        question: 'Como se diz "água" em inglês?',
                        options: ['Fire', 'Water', 'Earth', 'Air'],
                        correct: 1,
                        hint: 'É o líquido que bebemos todos os dias. Em inglês, começa com W.'
                    },
                    {
                        question: 'Qual é a tradução de "good morning"?',
                        options: ['Boa tarde', 'Boa noite', 'Bom dia', 'Boa sorte'],
                        correct: 2,
                        hint: 'É a expressão usada quando encontramos alguém cedo, antes do almoço. A primeira palavra começa com G.'
                    }
                ]
            }
        };
        
        this.init();
    }

    logout() {
        // Limpa dados do usuário
        localStorage.removeItem("edukids-user");
        this.currentUser = null;
    
        // Troca de telas
        document.getElementById("main-screen").classList.remove("active");
        document.getElementById("registration-screen").classList.add("active");
    }
    

    
    init() {
        console.log('Iniciando EduKidsApp...');
        try {
        this.setupEventListeners();
            console.log('Event listeners configurados');
            
            // Inicializar acessibilidade de forma segura
            try {
        this.accessibilityManager = new AccessibilityManager();
                console.log('AccessibilityManager criado');
            } catch (accessibilityError) {
                console.warn('Erro ao inicializar acessibilidade:', accessibilityError);
                this.accessibilityManager = null;
            }
            
            console.log('Mostrando tela de cadastro');
        this.showScreen('registration-screen');
            console.log('App inicializado com sucesso');
            this.loadLastScores();
        } catch (error) {
            console.error('Erro ao inicializar app:', error);
        }
    }
    
    setupEventListeners() {
        // Seleção de avatar
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectAvatar(e.currentTarget.dataset.avatar);
            });
        });
        
        // Botão de começar
        document.getElementById('start-learning-btn').addEventListener('click', () => {
            this.startLearning();
        });
        
        // Botão de sair
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        
        // Cards das matérias
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.startQuiz(e.currentTarget.dataset.subject);
            });
        });
        
        // Botão voltar do quiz
        document.getElementById('back-to-main').addEventListener('click', () => {
            this.showScreen('main-screen');
        });
        
        // Botão de dica
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });
        
        // Botão próxima pergunta
        document.getElementById('next-question-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        
        // Botões de resultado
        document.getElementById('try-again-btn').addEventListener('click', () => {
            this.startQuiz(this.currentSubject);
        });
        
        document.getElementById('back-to-subjects-btn').addEventListener('click', () => {
            this.showScreen('main-screen');
        });
    }
    
    selectAvatar(avatarNumber) {
        this.selectedAvatar = avatarNumber;
        
        // Remove seleção anterior
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        document.querySelector(`[data-avatar="${avatarNumber}"]`).classList.add('selected');
        
        // Efeito sonoro
        if (this.accessibilityManager) {
            this.accessibilityManager.playSound('click');
        }
    }
    
    startLearning() {
        const nickname = document.getElementById('student-nickname').value.trim();
        
        if (!nickname) {
            alert('Por favor, digite como quer ser chamado!');
            return;
        }
        
        this.currentUser = {
            name: nickname, // Usa o nickname como nome também
            nickname: nickname,
            avatar: this.selectedAvatar,
            provider: 'manual'
        };
        
        this.updateUserInfo();
        this.showScreen('main-screen');
        
        // Efeito sonoro de sucesso
        if (this.accessibilityManager) {
            this.accessibilityManager.playSound('success');
        }
    }


    
    
    
    updateUserInfo() {
        const avatarImg = document.getElementById('user-avatar-img');
        const greeting = document.getElementById('user-greeting');
        const nameDisplay = document.getElementById('user-name-display');
        
        // Verifica se é um usuário do Google
        if (this.currentUser.provider === 'google') {
            avatarImg.src = this.currentUser.avatar;
            greeting.textContent = `Olá, ${this.currentUser.nickname}!`;
            nameDisplay.textContent = 'Vamos aprender juntos!';
        } else {
            // Usuário cadastrado manualmente
        const avatarOption = document.querySelector(`[data-avatar="${this.currentUser.avatar}"]`);
            if (avatarOption) {
        avatarImg.src = avatarOption.querySelector('img').src;
            }
        greeting.textContent = `Olá, ${this.currentUser.nickname}!`;
        nameDisplay.textContent = 'Vamos aprender juntos!';
        }
    }
    
    logout() {
        // Se for usuário do Google, faz logout do Google
        if (this.currentUser && this.currentUser.provider === 'google') {
            try {
                google.accounts.id.disableAutoSelect();
                google.accounts.id.revoke(this.currentUser.email, () => {
                    console.log('Logout do Google realizado com sucesso');
                });
            } catch (error) {
                console.warn('Erro ao fazer logout do Google:', error);
            }
        }
        
        this.currentUser = null;
        this.showScreen('registration-screen');
        
        // Limpa os campos do formulário
        document.getElementById('student-nickname').value = '';
        this.selectAvatar(1);
    }
    
    startQuiz(subjectKey) {

        // zera pontos ao iniciar nova matéria
    this.trophyPoints = 0;

    // atualiza no HTML também
    const currentPointsEl = document.getElementById('current-points');
    const trophyDeltaEl = document.getElementById('trophy-delta');

    if (currentPointsEl) currentPointsEl.textContent = '0🏆';
    if (trophyDeltaEl) trophyDeltaEl.textContent = '';

    // ... resto do código que carrega perguntas da matéria

        this.currentSubject = subjectKey;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.trophyPoints = 0;
        this.totalQuestions = this.subjects[subjectKey].questions.length;
        this.lastRunDetails = { subject: subjectKey, questions: [] };
        
        // Atualiza informações do quiz
        document.getElementById('current-subject').textContent = this.subjects[subjectKey].name;
        
        // Reinicia o timer para o quiz inteiro (3:00)
        this.stopTimer();
        this.timeLeft = this.selectedTime;
        this.updateTimerDisplay();
        this.showScreen('quiz-screen');
        this.startTimer();
        this.showQuestion();
    }
    
    showQuestion() {
        const subject = this.subjects[this.currentSubject];
        const question = subject.questions[this.currentQuestionIndex];
        
        // Atualiza contador de perguntas
        document.getElementById('question-counter').textContent = 
            `Pergunta ${this.currentQuestionIndex + 1} de ${this.totalQuestions}`;
        
        // Atualiza barra de progresso
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Atualiza texto da pergunta
        document.getElementById('question-text').textContent = question.question;
        
        // Cria opções
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(button);
        });
        
        // Reseta botões
        document.getElementById('next-question-btn').disabled = true;
        document.getElementById('hint-container').classList.add('hidden');
        // Limpa delta de troféu da pergunta anterior
        const trophyDeltaEl = document.getElementById('trophy-delta');
        if (trophyDeltaEl) {
            trophyDeltaEl.textContent = '';
        }
        
        // Atualiza elementos de texto para acessibilidade
        if (this.accessibilityManager) {
            this.accessibilityManager.updateTextElements();
        }
        
        // Timer já está rodando para o quiz inteiro
    }
    
    selectAnswer(selectedIndex) {
        const subject = this.subjects[this.currentSubject];
        const question = subject.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        
        // Mantém o timer do quiz rodando
        
        // Desabilita todas as opções
        options.forEach(btn => btn.disabled = true);
        
        // Marca resposta correta e incorreta
        options[question.correct].classList.add('correct');
        if (selectedIndex !== question.correct) {
            options[selectedIndex].classList.add('incorrect');
        }
        
        // Atualiza pontuação
// Atualiza pontuação
const trophyDeltaEl = document.getElementById('trophy-delta');
const currentPointsEl = document.getElementById('current-points');

if (selectedIndex === question.correct) {
    this.score++;
    this.trophyPoints += 10;

    if (trophyDeltaEl) {
        trophyDeltaEl.textContent = '+10🏆';
        trophyDeltaEl.style.color = '#2e7d32';
    }

    if (this.accessibilityManager) {
        this.accessibilityManager.playSound('success');
    }

    if (this.lastRunDetails) {
        this.lastRunDetails.questions.push({ q: question.question, correct: true, chosen: selectedIndex, right: question.correct });
    }
} else {
    this.trophyPoints -= 5;

    if (trophyDeltaEl) {
        trophyDeltaEl.textContent = '-5🏆';
        trophyDeltaEl.style.color = '#c62828';
    }

    if (this.accessibilityManager) {
        this.accessibilityManager.playSound('error');
    }

    if (this.lastRunDetails) {
        this.lastRunDetails.questions.push({ q: question.question, correct: false, chosen: selectedIndex, right: question.correct });
    }
}

// 👉 Atualiza o acumulado
if (currentPointsEl) {
    currentPointsEl.textContent = `${this.trophyPoints}🏆`;
}

// Habilita botão próxima pergunta
document.getElementById('next-question-btn').disabled = false;


    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.totalQuestions) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('total-questions').textContent = this.totalQuestions;
        document.getElementById('score-percentage').textContent = percentage;
        const trophyScoreSpan = document.getElementById('trophy-score');
        if (trophyScoreSpan) {
            trophyScoreSpan.textContent = `${this.trophyPoints}🏆`;
        }
        const resultStars = document.getElementById('result-stars');
        if (resultStars) {
            resultStars.innerHTML = this.generateStars(percentage);
        }
        // Detalhes da última jogatina
        const lastRunList = document.getElementById('last-run-questions');
        if (lastRunList && this.lastRunDetails) {
            lastRunList.innerHTML = '';
            this.lastRunDetails.questions.forEach((item, idx) => {
                const li = document.createElement('li');
                li.className = item.correct ? 'last-run-item correct' : 'last-run-item incorrect';
                li.textContent = `${idx + 1}. ${item.q}`;
                lastRunList.appendChild(li);
            });
        }
        
        // Mensagem baseada na pontuação
        let message = '';
        if (percentage >= 90) {
            message = 'Excelente! Você é um gênio!';
        } else if (percentage >= 70) {
            message = 'Muito bem! Você está indo muito bem!';
        } else if (percentage >= 50) {
            message = 'Bom trabalho! Continue estudando!';
        } else {
            message = 'Não desista! Pratique mais e você vai melhorar!';
        }
        
        document.getElementById('result-message-text').textContent = message;
        
        // Persiste última pontuação por matéria e encerra o timer
        if (this.currentSubject) {
            this.lastSubjectScores[this.currentSubject] = {
                trophies: this.trophyPoints,
                percentage: percentage,
                correct: this.score,
                total: this.totalQuestions
            };
            try {
                localStorage.setItem('edukids-last-scores', JSON.stringify(this.lastSubjectScores));
            } catch (e) {
                console.warn('Não foi possível salvar últimas pontuações:', e);
            }
        }
        this.stopTimer();

        this.showScreen('result-screen');
        
        // Efeito sonoro baseado na pontuação
        if (this.accessibilityManager) {
            if (percentage >= 70) {
                this.accessibilityManager.playSound('success');
            } else {
                this.accessibilityManager.playSound('error');
            }
        }
    }
    
    showHint() {
        const subject = this.subjects[this.currentSubject];
        const question = subject.questions[this.currentQuestionIndex];
        
        const hintContainer = document.getElementById('hint-container');
        const hintText = document.getElementById('hint-text');
        const hintImage = document.getElementById('hint-image');
        
        // Mostra a dica estática
        hintText.textContent = question.hint;
        hintContainer.classList.remove('hidden');
        
        // Esconde a imagem (não usamos mais)
                    if (hintImage) {
                        hintImage.style.display = 'none';
        }
        
        // Efeito sonoro
        if (this.accessibilityManager) {
            this.accessibilityManager.playSound('click');
        }
    }
    

    

    

    

    
    
    
    
    
    startTimer() {
        this.timeLeft = this.selectedTime;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('time-left').textContent = display;
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    timeUp() {
        this.stopTimer();
        // Tempo esgotado: mostra resultados
        this.showResults();
    }
    
    showScreen(screenId) {
        console.log('Mostrando tela:', screenId);
        // Esconde todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostra a tela selecionada
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log('Tela ativada:', screenId);
            if (screenId === 'main-screen') {
                this.updateSubjectLastScoresUI();
            }
        } else {
            console.error('Tela não encontrada:', screenId);
        }
    }

    loadLastScores() {
        try {
            const raw = localStorage.getItem('edukids-last-scores');
            if (raw) {
                this.lastSubjectScores = JSON.parse(raw) || {};
            }
        } catch (e) {
            console.warn('Não foi possível carregar últimas pontuações:', e);
            this.lastSubjectScores = {};
        }
    }

    updateSubjectLastScoresUI() {
        try {
            document.querySelectorAll('.subject-card').forEach(card => {
                const key = card.getAttribute('data-subject');
                if (!key) return;
                const last = this.lastSubjectScores[key];
                let stats = card.querySelector('.subject-stats');
                if (!stats) return;
                let lastEl = stats.querySelector('.last-score');
                if (!lastEl) {
                    lastEl = document.createElement('span');
                    lastEl.className = 'last-score';
                    lastEl.style.marginLeft = '8px';
                    stats.appendChild(lastEl);
                }
                let starsEl = stats.querySelector('.last-stars');
                if (!starsEl) {
                    starsEl = document.createElement('span');
                    starsEl.className = 'last-stars';
                    starsEl.style.marginLeft = '6px';
                    stats.appendChild(starsEl);
                }
                if (last && typeof last === 'object') {
                    const trophies = typeof last.trophies === 'number' ? last.trophies : 0;
                    const pct = typeof last.percentage === 'number' ? last.percentage : 0;
                    lastEl.textContent = `Última Pontuação: ${trophies}🏆`;
                    starsEl.innerHTML = this.generateStars(pct);
                } else {
                    lastEl.textContent = 'Última Pontuação: —';
                    starsEl.innerHTML = '';
                }
            });
        } catch (e) {
            console.warn('Erro ao atualizar UI de últimas pontuações:', e);
        }
    }

    generateStars(percentage) {
        // Converte % para 0-5 estrelas (inteiro)
        const stars = Math.max(0, Math.min(5, Math.round((percentage / 100) * 5)));
        const full = '⭐'.repeat(stars);
        const empty = '☆'.repeat(5 - stars);
        return `${full}${empty}`;
    }
}

// Função para lidar com a resposta do Google Sign-In
function handleCredentialResponse(response) {
    try {
        // Decodifica o JWT token
        const responsePayload = decodeJwtResponse(response.credential);
        
        // Cria o usuário com dados do Google
        const googleUser = {
            name: responsePayload.name,
            nickname: responsePayload.given_name,
            email: responsePayload.email,
            avatar: responsePayload.picture,
            provider: 'google'
        };
        
        // Inicializa a aplicação se ainda não foi inicializada
        if (!window.edukidsApp) {
            window.edukidsApp = new EduKidsApp();
        }
        
        // Define o usuário atual
        window.edukidsApp.currentUser = googleUser;
        
        // Atualiza as informações do usuário
        window.edukidsApp.updateUserInfo();
        
        // Mostra a tela principal
        window.edukidsApp.showScreen('main-screen');
        
        // Efeito sonoro de sucesso
        if (window.edukidsApp.accessibilityManager) {
            window.edukidsApp.accessibilityManager.playSound('success');
        }
        
        console.log('Login com Google realizado com sucesso:', googleUser);
        
    } catch (error) {
        console.error('Erro no login com Google:', error);
        alert('Erro ao fazer login com Google. Tente novamente.');
    }
}

// Função para decodificar o JWT response do Google
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

// Inicializa a aplicação quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.edukidsApp = new EduKidsApp();
    
    // Configura o Google Sign-In se o Client ID estiver configurado
    const googleClientId = getGoogleClientId();
    if (googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        // Atualiza o data-client_id no HTML
        const gIdOnload = document.getElementById('g_id_onload');
        if (gIdOnload) {
            gIdOnload.setAttribute('data-client_id', googleClientId);
        }
        
        // Inicializa o Google Sign-In
        google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse
        });
        
        // Renderiza o botão do Google Sign-In
        google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                shape: 'rectangular',
                text: 'sign_in_with',
                logo_alignment: 'left'
            }
        );
    } else {
        // Esconde o botão do Google se não estiver configurado
        const googleSignInContainer = document.querySelector('.g_id_signin');
        const divider = document.querySelector('.divider');
        if (googleSignInContainer) {
            googleSignInContainer.style.display = 'none';
        }
        if (divider) {
            divider.style.display = 'none';
        }
    }
});


window.handleCredentialResponse = (response) => {
    // Decodificar o token JWT do Google
    const data = parseJwt(response.credential);

    // Exibir usuário no app
    document.getElementById("user-name-display").textContent = data.name;
    document.getElementById("user-greeting").textContent = `Olá, ${data.given_name}!`;
    document.getElementById("user-avatar-img").src = data.picture;

    // Salvar no localStorage
    localStorage.setItem("edukids-user", JSON.stringify(data));

    // Trocar de tela (cadastro -> principal)
    document.getElementById("registration-screen").classList.remove("active");
    document.getElementById("main-screen").classList.add("active");
};

// Função auxiliar para decodificar JWT
function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

