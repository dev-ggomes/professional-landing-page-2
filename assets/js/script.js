/* =========================================
   GUILHERME GOMES - LANDING PAGE
   Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // PARTICLES BACKGROUND
    // =========================================
    (function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const colors = ['#7c3aed', '#a855f7', '#06b6d4', '#22d3ee', '#10b981'];
        const particleCount = window.innerWidth < 600 ? 20 : 40;

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');

            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 20 + 15;
            const color = colors[Math.floor(Math.random() * colors.length)];

            p.style.cssText = `
                left: ${x}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                box-shadow: 0 0 ${size * 3}px ${color};
            `;

            container.appendChild(p);
        }
    })();

    // =========================================
    // NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =========================================
    // MOBILE HAMBURGER MENU
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // =========================================
    // TYPED TEXT EFFECT
    // =========================================
    (function initTyped() {
        const el = document.getElementById('typed-text');
        if (!el) return;

        const texts = [
            'Full Stack Developer',
            'Game Developer',
            'Python Enthusiast',
            'Automation Builder',
            'Web Creator'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
            const currentText = texts[textIndex];

            if (isPaused) {
                setTimeout(type, 1500);
                isPaused = false;
                return;
            }

            if (!isDeleting) {
                el.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentText.length) {
                    isPaused = true;
                    isDeleting = true;
                    setTimeout(type, 100);
                    return;
                }

                setTimeout(type, 80);
            } else {
                el.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 300);
                    return;
                }

                setTimeout(type, 40);
            }
        }

        setTimeout(type, 1000);
    })();

    // =========================================
    // COUNTER ANIMATION
    // =========================================
    function animateCounter(el, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // =========================================
    // INTERSECTION OBSERVER (AOS + Counters)
    // =========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // AOS Observer
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                aosObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        aosObserver.observe(el);
    });

    // Counter Observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    // =========================================
    // PROJECT FILTER
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // reflow
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // =========================================
    // CONTACT FORM
    // =========================================
    const form = document.getElementById('contato-form');
    const formSuccess = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            emailjs.send("Nero&Kira123GuillickiCR7", "template_84h4g2g", {
                name: form.nome.value,
                email: form.email.value,
                assunto: form.assunto.value,
                mensagem: form.mensagem.value
            })
            .then(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                formSuccess.classList.add('show');
                form.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    formSuccess.classList.remove('show');
                }, 4000);
            })
            .catch((error) => {
                console.error('Erro EmailJS:', error);
                submitBtn.innerHTML = 'Erro ao enviar ❌';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }, 3000);
            });
        });
    }

    // =========================================
    // SMOOTH SCROLL FOR ANCHORS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80; // navbar height
                const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // =========================================
    // ACTIVE NAV LINK ON SCROLL
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--primary-light)';
                    }
                });
            }
        });
    }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // =========================================
    // GLITCH EFFECT ON LOGO (Easter Egg)
    // =========================================
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            if (e.currentTarget.tagName === 'A') return;
            logo.style.animation = 'glitch 0.3s ease';
            setTimeout(() => logo.style.animation = '', 300);
        });
    }

    // =========================================
    // CURSOR GLOW EFFECT (Desktop only)
    // =========================================
    if (window.innerWidth > 900) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
            top: -200px;
            left: -200px;
        `;
        document.body.appendChild(glow);

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = `${glowX}px`;
            glow.style.top = `${glowY}px`;
            requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }

    // =========================================
    // PROJECT CARD HOVER 3D TILT (Desktop)
    // =========================================
    if (window.innerWidth > 900) {
        document.querySelectorAll('.project-card, .setup-card, .github-stat-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // =========================================
    // INIT - Trigger initial AOS for visible elements
    // =========================================
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('aos-animate');
            }
        });
    }, 100);

    // =========================================
    // GITHUB STARS AUTO UPDATE
    // =========================================
    document.querySelectorAll('.project-card').forEach(card => {
        const repo = card.dataset.repo;
        if (!repo) return;
        
        const starEl = card.querySelector('.project-stars');
        const cacheKey = `github_stars_${repo}`;
        const cacheTimeKey = `github_stars_time_${repo}`;

        const cachedStars = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);

        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        // ✅ Se tiver cache e não passou 1 dia → usa cache
        if (cachedStars && cachedTime && (now - cachedTime < ONE_DAY)) {
            starEl.innerHTML = `<i class="fas fa-star"></i> ${cachedStars}`;
            return;
        }

        // ❌ Senão vai buscar à API
        fetch(`https://api.github.com/repos/dev-ggomes/${repo}`)
            .then(res => {
                if (!res.ok) throw new Error('Erro na API');
                return res.json();
            })
            .then(data => {
                const stars = data.stargazers_count ?? 0;

                // Atualiza UI
                starEl.innerHTML = `<i class="fas fa-star"></i> ${stars}`;

                // Guarda cache
                localStorage.setItem(cacheKey, stars);
                localStorage.setItem(cacheTimeKey, now);
            })
            .catch(err => {
                console.error('GitHub API error:', err);

                // fallback
                if (cachedStars) {
                    starEl.innerHTML = `<i class="fas fa-star"></i> ${cachedStars}`;
                } else {
                    starEl.innerHTML = `<i class="fas fa-star"></i> —`;
                }
            });
    });

    console.log('%c👋 Olá dev! Esse site foi criado para o Guilherme Gomes.', 'color: #a855f7; font-size: 14px; font-weight: bold;');
    console.log('%c🚀 Acesse: https://github.com/dev-ggomes', 'color: #06b6d4; font-size: 12px;');

});