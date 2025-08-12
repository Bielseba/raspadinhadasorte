document.addEventListener('DOMContentLoaded', () => {
    // --- VARIÁVEIS GLOBAIS E DE ESTADO ---
    const body = document.body;
    const mainSiteContainer = document.getElementById('main-site-container');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const pageContainers = document.querySelectorAll('.page-container');
    const userProfileIcon = document.getElementById('user-profile-icon');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');

    // --- LÓGICA DE NOTIFICAÇÃO (TOAST) ---
    const toast = document.getElementById('toast-notification');
    function showToast(message, duration = 3000) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, duration);
    }

    // --- Lógica de Autenticação e Modal ---
    const authModal = document.getElementById('auth-modal');
    const openLoginModalBtn = document.querySelector('.btn-login');
    const openRegisterModalBtn = document.querySelector('.btn-register');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const switchToLoginLink = document.querySelector('.switch-to-login');
    const switchToRegisterLink = document.querySelector('.switch-to-register');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerStep1 = document.getElementById('register-step-1');
    const registerStep2 = document.getElementById('register-step-2');
    const registerBtnStep1 = document.getElementById('register-btn-step1');
    const registerBackBtn = document.getElementById('register-back-btn');

    const showModal = (defaultForm = 'register') => {
        mainSiteContainer.classList.add('blurred');
        authModal.classList.add('visible');
        switchAuthTab(defaultForm);
        if (registerStep2.classList.contains('active')) {
            registerStep2.classList.remove('active');
            registerStep1.classList.add('active');
        }
    };
    const hideModal = () => {
        mainSiteContainer.classList.remove('blurred');
        authModal.classList.remove('visible');
    };
    const switchAuthTab = (formName) => {
        authTabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.form === formName));
        authForms.forEach(form => form.classList.toggle('active', form.id === `${formName}-form`));
        if (formName === 'register') {
            registerStep2.classList.remove('active');
            registerStep1.classList.add('active');
        }
    };
    openLoginModalBtn.addEventListener('click', () => showModal('login'));
    openRegisterModalBtn.addEventListener('click', () => showModal('register'));
    closeModalBtn.addEventListener('click', hideModal);
    authTabBtns.forEach(btn => btn.addEventListener('click', () => switchAuthTab(btn.dataset.form)));
    switchToLoginLink.addEventListener('click', () => switchAuthTab('login'));
    switchToRegisterLink.addEventListener('click', () => switchAuthTab('register'));
    registerBtnStep1.addEventListener('click', () => {
        const nome = document.getElementById('reg-nome').value;
        const tel = document.getElementById('reg-tel').value;
        if (nome.trim() && tel.trim()) {
            registerStep1.classList.remove('active');
            registerStep2.classList.add('active');
        } else { showToast('Por favor, preencha todos os campos.'); }
    });
    registerBackBtn.addEventListener('click', () => {
        registerStep2.classList.remove('active');
        registerStep1.classList.add('active');
    });
    // loginForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     hideModal();
    //     handleLogin();
    //     showToast('Bem-vindo de volta à sua conta.');
    // });
    // registerForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const senha = document.getElementById('reg-senha').value;
    //     const senhaRep = document.getElementById('reg-senha-rep').value;
    //     if (senha.length < 6) { showToast('A senha deve ter pelo menos 6 caracteres.'); return; }
    //     if (senha !== senhaRep) { showToast('As senhas não coincidem. Tente novamente.'); return; }
    //     hideModal();
    //     handleLogin();
    //     showToast('Cadastro realizado com sucesso! Bem-vindo.');
    // });

    // --- LÓGICA DE LOGIN / LOGOUT E NAVEGAÇÃO SPA ---
    const logoutButton = document.getElementById('logout-btn');
    const handleLogin = () => { body.classList.remove('logged-out'); body.classList.add('logged-in'); navigateTo('dashboard-page'); };
    const handleLogout = () => { body.classList.remove('logged-in'); body.classList.add('logged-out'); navigateTo('dashboard-page'); };
    logoutButton.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

    const navigateTo = (targetId) => {
        if (!targetId) return;
        pageContainers.forEach(container => container.classList.remove('active'));
        const targetPage = document.getElementById(targetId);
        if (targetPage) targetPage.classList.add('active');
        if(userDropdownMenu) userDropdownMenu.classList.remove('active');
        window.scrollTo(0, 0);
    };
    allNavLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); const targetId = link.getAttribute('data-target'); navigateTo(targetId); }));
    userProfileIcon.addEventListener('click', (e) => { e.stopPropagation(); userDropdownMenu.classList.toggle('active'); });
    window.addEventListener('click', () => { if (userDropdownMenu.classList.contains('active')) userDropdownMenu.classList.remove('active'); });

    // --- INÍCIO DA ALTERAÇÃO: LÓGICA DO CARROSSEL ---
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');

    // Função utilitária: se a imagem não carregar, troca por um placeholder neutro
    function attachImageFallback(img) {
        if (!img) return;
        img.addEventListener('error', () => {
            img.src = 'https://via.placeholder.com/1600x900.png?text=Banner';
        }, { once: true });
    }

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        // cria dots
        slides.forEach((slide, i) => {
            const img = slide.querySelector('img');
            attachImageFallback(img);
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                stopCarousel();
                startCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel-dot');

        const goToSlide = (slideIndex) => {
            if (!carouselTrack) return;
            carouselTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[slideIndex]) dots[slideIndex].classList.add('active');
            currentSlide = slideIndex;
            // Altura controlada por CSS (aspect-ratio). Garantimos que o JS não force altura.
            if (carouselContainer) carouselContainer.style.height = '';
        };
        
        const nextSlide = () => {
            const newIndex = (currentSlide + 1) % slides.length;
            goToSlide(newIndex);
        };

        const startCarousel = () => {
            stopCarousel();
            slideInterval = setInterval(nextSlide, 5000);
        };

        const stopCarousel = () => {
            clearInterval(slideInterval);
        };

        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopCarousel);
            carouselContainer.addEventListener('mouseleave', startCarousel);
        }

        // Suporte a swipe no mobile
        let touchStartX = 0;
        let touchDeltaX = 0;
        const SWIPE_THRESHOLD = 50;

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchDeltaX = 0;
            stopCarousel();
        }, { passive: true });

        carouselContainer.addEventListener('touchmove', (e) => {
            touchDeltaX = e.touches[0].clientX - touchStartX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', () => {
            if (Math.abs(touchDeltaX) > SWIPE_THRESHOLD) {
                if (touchDeltaX < 0) {
                    nextSlide();
                } else {
                    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                    goToSlide(prevIndex);
                }
            }
            startCarousel();
        });

        // Inicia
        goToSlide(0);
        startCarousel();
    }
    // --- FIM DA ALTERAÇÃO ---

    // --- LÓGICA DA PÁGINA DE JOGO ---
    const scratchGridContainer = document.getElementById('scratch-grid-container');
    const btnBuyScratchcard = document.getElementById('btn-buy-scratchcard');
    const lockedOverlay = document.getElementById('game-locked-overlay');
    const allScratchCards = document.querySelectorAll('.scratch-card');
    const SCRATCH_CARDS_DB = {
        pix: { title: 'PIX na conta', price: 'R$ 0,50', description: 'Raspe e receba prêmios em DINHEIRO $$$ até R$2.000.', possible_prizes: ['https://i.imgur.com/rLd7gZz.png', 'https://i.imgur.com/gK9x3Yw.png', 'https://i.imgur.com/pT3Fz5J.png', 'https://i.imgur.com/N5Q8V1j.png'], prize_pool: ['https://i.imgur.com/gK9x3Yw.png', 'https://i.imgur.com/gK9x3Yw.png', 'https://i.imgur.com/gK9x3Yw.png', 'https://i.imgur.com/rLd7gZz.png', 'https://i.imgur.com/pT3Fz5J.png', 'https://i.imgur.com/N5Q8V1j.png', 'https://i.imgur.com/vBw9d2H.png', 'https://i.imgur.com/sC4J7kS.png', 'https://i.imgur.com/tYx4F7q.png'] },
        cosmetics: { title: 'Me Mimei', price: 'R$ 5,00', description: 'Prêmios exclusivos de beleza e cosméticos.', possible_prizes: ['https://i.imgur.com/prize1.png', 'https://i.imgur.com/prize2.png'], prize_pool: ['https://i.imgur.com/prize1.png', 'https://i.imgur.com/prize1.png', 'https://i.imgur.com/prize1.png', 'https://i.imgur.com/prize2.png', 'https://i.imgur.com/prize3.png', 'https://i.imgur.com/prize4.png', 'https://i.imgur.com/prize5.png', 'https://i.imgur.com/prize6.png', 'https://i.imgur.com/prize7.png'] },
    };
    allScratchCards.forEach(cardEl => cardEl.addEventListener('click', () => {
        const cardId = cardEl.dataset.cardId || 'pix';
        const data = SCRATCH_CARDS_DB[cardId];
        if (data) {
            populateGamePage(data);
            navigateTo('game-page');
        }
    }));
    function populateGamePage(data) {
        document.getElementById('game-price-tag').textContent = data.price;
        document.getElementById('game-info-title').textContent = data.title;
        document.getElementById('game-info-description').textContent = data.description;
        const prizesContainer = document.getElementById('game-possible-prizes');
        prizesContainer.innerHTML = data.possible_prizes.map(p => `<img src="${p}" alt="Prêmio">`).join('');
        btnBuyScratchcard.onclick = () => { lockedOverlay.classList.add('hidden'); initializeScratchGrid(data.prize_pool); };
        lockedOverlay.classList.remove('hidden');
        scratchGridContainer.innerHTML = '';
    }
    function initializeScratchGrid(prize_pool) {
        scratchGridContainer.innerHTML = '';
        const prizeDeck = [...prize_pool].sort(() => Math.random() - 0.5);
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'scratch-cell';
            const prizeImg = document.createElement('img');
            prizeImg.className = 'prize-image';
            prizeImg.src = prizeDeck[i];
            const canvas = document.createElement('canvas');
            canvas.className = 'scratch-canvas';
            cell.append(prizeImg, canvas);
            scratchGridContainer.append(cell);
            setupScratchCanvas(canvas);
        }
    }
    function setupScratchCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.fillStyle = '#a9a9a9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let isDrawing = false;
        const scratch = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, canvas.width * 0.2, 0, 2 * Math.PI);
            ctx.fill();
        };
        canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        canvas.addEventListener('touchend', () => isDrawing = false);
    }
    
    // --- LÓGICA DA PÁGINA DE DEPÓSITO ---
    const depositAmountInput = document.getElementById('deposit-amount');
    const setAmountBtns = document.querySelectorAll('.btn-set-amount');
    const generatePixBtn = document.getElementById('btn-generate-pix');
    const depositFormContainer = document.getElementById('deposit-form-container');
    const pixDisplayContainer = document.getElementById('pix-display-container');
    const depositNavBtn = document.querySelector('.btn-deposit');
    if (depositNavBtn) {
        depositNavBtn.addEventListener('click', (e) => { e.preventDefault(); navigateTo('deposit-page'); depositFormContainer.style.display = 'block'; pixDisplayContainer.style.display = 'none'; });
    }
    setAmountBtns.forEach(btn => btn.addEventListener('click', () => { depositAmountInput.value = `R$ ${btn.dataset.amount},00`; }));
    if (generatePixBtn) {
        generatePixBtn.addEventListener('click', () => { if (depositAmountInput.value) { depositFormContainer.style.display = 'none'; pixDisplayContainer.style.display = 'block'; } else { showToast('Por favor, insira um valor para depositar.'); } });
    }

    // --- SIMULAÇÃO DE GANHADORES "AO VIVO" ---
    const winnersContainer = document.getElementById('winners-container');
    if (winnersContainer) {
        const MAX_WINNERS_VISIBLE = 5; const NEW_WINNER_INTERVAL = 4000; const firstNames = ['Carlos', 'Juliana', 'Marcos', 'Fernanda', 'Lucas', 'Beatriz', 'Ricardo', 'Aline', 'Felipe', 'Sandra', 'Vitor', 'Camila']; const lastInitials = ['S.', 'P.', 'M.', 'F.', 'R.', 'L.', 'G.', 'A.']; const prizes = ['PIX de R$50', 'Jaqueta Esportiva', 'Apple Watch', 'Fone Bluetooth', 'Capacete Premium', 'R$100 em Créditos', 'BodySplash WePink', 'Smart TV', 'PIX de R$20', 'Air Fryer'];
        function createWinnerElement() { const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}****`; const prize = prizes[Math.floor(Math.random() * prizes.length)]; const avatarUrl = `https://i.pravatar.cc/50?u=${Math.random()}`; const winnerEl = document.createElement('div'); winnerEl.className = 'winner-card entering'; winnerEl.innerHTML = `<img src="${avatarUrl}" alt="Avatar"><div>${name}<br><strong>${prize}</strong></div>`; return winnerEl; }
        function runWinnerSimulation() { if (!winnersContainer) return; const newWinner = createWinnerElement(); winnersContainer.appendChild(newWinner); requestAnimationFrame(() => { newWinner.classList.remove('entering'); }); if (winnersContainer.children.length > MAX_WINNERS_VISIBLE) { const oldestWinner = winnersContainer.firstElementChild; if (oldestWinner) { oldestWinner.classList.add('exiting'); setTimeout(() => { oldestWinner.remove(); }, 500); } } }
        for (let i = 0; i < MAX_WINNERS_VISIBLE; i++) { setTimeout(() => runWinnerSimulation(), i * 500); } setInterval(runWinnerSimulation, NEW_WINNER_INTERVAL);
    }
    
    // --- ESTADO INICIAL ---
    handleLogout(); 
    showModal('register');
});