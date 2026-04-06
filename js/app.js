/**
 * app.js — Portfolio Rendering Engine
 * 
 * Fetches JSON data files and renders all sections of the portfolio.
 * To edit content, modify the JSON files in /data/ — no HTML changes needed.
 */

(async function () {
    'use strict';

    // ── Data Loading ──────────────────────────────────────────────────────
    async function loadJSON(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        return res.json();
    }

    const [profile, experience, projects, skills, contact] = await Promise.all([
        loadJSON('data/profile.json'),
        loadJSON('data/experience.json'),
        loadJSON('data/projects.json'),
        loadJSON('data/skills.json'),
        loadJSON('data/contact.json'),
    ]);

    // ── Utility ───────────────────────────────────────────────────────────
    function el(tag, attrs = {}, children = []) {
        const node = document.createElement(tag);
        for (const [key, val] of Object.entries(attrs)) {
            if (key === 'className') node.className = val;
            else if (key === 'innerHTML') node.innerHTML = val;
            else if (key === 'textContent') node.textContent = val;
            else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), val);
            else if (key === 'style' && typeof val === 'object') Object.assign(node.style, val);
            else node.setAttribute(key, val);
        }
        for (const child of children) {
            if (typeof child === 'string') node.appendChild(document.createTextNode(child));
            else if (child) node.appendChild(child);
        }
        return node;
    }

    async function typeText(node, text, speed = 40, preDelay = 0, clear = true) {
        if (preDelay) await new Promise(r => setTimeout(r, preDelay));
        if (clear) node.innerHTML = '';
        const chars = text.split('');
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] === '\n') {
                node.appendChild(document.createElement('br'));
            } else {
                node.appendChild(document.createTextNode(chars[i]));
            }
            // Add slight jitter for realistic terminal typing feel
            const jitter = Math.random() * (speed * 0.5);
            await new Promise(r => setTimeout(r, speed + jitter));
        }
    }

    // Remember last mouse position so we can re-evaluate glow mode after boot.
    let lastMouseX = null;
    let lastMouseY = null;

    function updateGlowHeroFromPointer() {
        if (lastMouseX === null || lastMouseY === null) return;
        const hovered = document.elementFromPoint(lastMouseX, lastMouseY);
        const inHero = Boolean(hovered && hovered.closest && hovered.closest('#hero'));
        document.body.classList.toggle('glow-hero', inHero);
    }

    // ── Nav ───────────────────────────────────────────────────────────────
    function renderNav() {
        const navEl = document.getElementById('nav');
        navEl.classList.add('nav--init');

        const container = el('div', { className: 'container-nav' }, [
            el('div', { className: 'nav__title', textContent: profile.navTitle }),
            el('div', { className: 'nav__links' },
                profile.navLinks.map(link =>
                    el('a', {
                        className: `nav__link ${link.active ? 'nav__link--active' : ''}`,
                        href: link.href,
                        textContent: link.label,
                    })
                )
            ),
            el('button', {
                className: 'nav__cta',
                textContent: '> DOWNLOAD_CV',
            }),
        ]);

        navEl.appendChild(container);
    }

    // ── Hero ──────────────────────────────────────────────────────────────
    function renderHero() {
        const heroEl = document.getElementById('hero');

        const tagEl = el('p', { className: 'hero__tag' });
        const nameEl = el('h1', { className: 'hero__name' });
        
        const metaLevelEl = el('span', { className: 'hero__meta-text' });
        const divider = el('span', { className: 'hero__meta-divider', style: { opacity: '0' } });
        const metaLocEl = el('span', { className: 'hero__meta-text' });

        const content = el('div', { className: 'section__content' }, [
            tagEl,
            nameEl,
            el('div', { className: 'hero__meta' }, [
                metaLevelEl,
                divider,
                metaLocEl,
            ]),
        ]);

        const gutter = el('div', { className: 'section__gutter hero--init-gutter', innerHTML: '000<br />001<br />002' });

        heroEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));

        return { tagEl, nameEl, metaLevelEl, metaLocEl, divider };
    }

    // ── Boot Sequence (Typing Animation) ──────────────────────────────────
    async function animateBootSequence(heroEls) {
        document.body.classList.add('is-booting');
        document.body.classList.add('glow-hero');
        
        const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const { tagEl, nameEl, metaLevelEl, metaLocEl, divider } = heroEls;

        if (noMotion) {
            tagEl.textContent = profile.initTag;
            nameEl.innerHTML = profile.name.split('\n').join('<br />');
            metaLevelEl.textContent = `LEVEL: ${profile.level}`;
            metaLocEl.textContent = `LOC: ${profile.location}`;
            divider.style.opacity = '1';
            nameEl.classList.add('blinking-cursor');
            
            document.body.classList.remove('is-booting');
            updateGlowHeroFromPointer();
            initScrollReveal();
            return;
        }

        // --- Terminal Simulation ---
        tagEl.classList.add('blinking-cursor');
        await typeText(tagEl, "> INITIALIZING PERSONA", 25, 200);
        
        // Blinking dots
        for (let i = 0; i < 3; i++) {
            await new Promise(r => setTimeout(r, 450));
            tagEl.appendChild(document.createTextNode("."));
        }
        
        await new Promise(r => setTimeout(r, 400));
        tagEl.appendChild(document.createElement('br'));
        await typeText(tagEl, "> MODULES LOADED.", 25, 0, false); // false = don't clear
        tagEl.appendChild(document.createElement('br'));
        await typeText(tagEl, "> HANDSHAKE ACCEPTED.", 25, 0, false);
        
        await new Promise(r => setTimeout(r, 700));
        tagEl.innerHTML = "";
        tagEl.classList.remove('blinking-cursor');

        // --- Actual Hero Boot ---

        // 1. Type system tag
        tagEl.classList.add('blinking-cursor');
        await typeText(tagEl, profile.initTag, 30, 100);
        tagEl.classList.remove('blinking-cursor');

        // 2. Type main name
        nameEl.classList.add('blinking-cursor');
        await typeText(nameEl, profile.name, 45, 100);
        nameEl.classList.remove('blinking-cursor');

        // 3. Type Level
        metaLevelEl.classList.add('blinking-cursor');
        await typeText(metaLevelEl, `LEVEL: ${profile.level}`, 30, 200);
        metaLevelEl.classList.remove('blinking-cursor');

        // Show divider line instantly
        divider.style.transition = 'opacity 0.3s ease';
        divider.style.opacity = '1';

        // 4. Type Location
        metaLocEl.classList.add('blinking-cursor');
        await typeText(metaLocEl, `LOC: ${profile.location}`, 30, 100);
        metaLocEl.classList.remove('blinking-cursor');

        // Leave cursor permanently on the name to act as standard blinking prompt
        nameEl.classList.add('blinking-cursor');

        // Unlock page
        document.body.classList.remove('is-booting');
        updateGlowHeroFromPointer();
        initScrollReveal();
    }

    // ── Experience ────────────────────────────────────────────────────────
    function renderExperience() {
        const sectionEl = document.getElementById('experience');

        const items = experience.map((exp, i) => {
            const delay = Math.min(i + 3, 8);
            const children = [
                el('div', {
                    className: `timeline__dot ${exp.current ? 'timeline__dot--current' : 'timeline__dot--past'}`,
                }),
                el('div', { className: 'timeline__header' }, [
                    el('h3', { className: 'timeline__role', textContent: exp.role }),
                    el('span', {
                        className: `timeline__date ${exp.current ? 'timeline__date--current' : 'timeline__date--past'}`,
                        textContent: exp.date,
                    }),
                ]),
                el('p', { className: 'timeline__company', textContent: `${exp.company} // ${exp.location}` }),
                el('p', { className: 'timeline__description', textContent: exp.description }),
            ];

            if (exp.tags && exp.tags.length > 0) {
                children.push(
                    el('div', { className: 'timeline__tags' },
                        exp.tags.map(tag => el('span', { className: 'timeline__tag', textContent: tag }))
                    )
                );
            }

            return el('div', { className: `timeline__item reveal reveal--left reveal--delay-${delay}` }, children);
        });

        const timeline = el('div', { className: 'timeline' }, items);

        const header = el('div', { className: 'section-header reveal' }, [
            el('span', { className: 'section-header__tag type-target', 'data-type': '<!-- 01_EXPERIENCE -->' }),
            el('h2', { className: 'section-header__title type-target', 'data-type': 'Professional Timeline' }),
        ]);

        const content = el('div', { className: 'section__content' }, [
            header,
            timeline,
        ]);

        const gutterLines = Array.from({ length: 5 }, (_, i) => String(i + 3).padStart(3, '0')).join('<br />');
        const gutter = el('div', { className: 'section__gutter reveal reveal--delay-2', innerHTML: gutterLines });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Projects ──────────────────────────────────────────────────────────
    function renderProjects() {
        const sectionEl = document.getElementById('projects');

        const cards = projects.map((proj, i) => {
            const delay = Math.min(i + 3, 8);
            const stackStr = `["${proj.stack.join('", "')}"]`;

            return el('div', { className: `project-card reveal reveal--scale reveal--delay-${delay}` }, [
                el('div', { className: 'project-card__header' }, [
                    el('span', {
                        className: 'material-symbols-outlined filled project-card__icon',
                        style: { fontVariationSettings: "'FILL' 1" },
                        textContent: proj.icon,
                    }),
                    el('span', { className: 'project-card__version', textContent: proj.version }),
                ]),
                el('h3', { className: 'project-card__title', textContent: proj.title }),
                el('p', { className: 'project-card__description', textContent: proj.description }),
                el('div', { className: 'project-card__stack' }, [
                    el('span', { className: 'project-card__stack-label', textContent: 'stack: ' }),
                    document.createTextNode(stackStr),
                ]),
            ]);
        });

        const header = el('div', { className: 'section-header reveal' }, [
            el('span', { className: 'section-header__tag type-target', 'data-type': '<!-- 02_PROJECTS -->' }),
            el('h2', { className: 'section-header__title type-target', 'data-type': 'Highlighted Projects' }),
        ]);

        const content = el('div', { className: 'section__content' }, [
            header,
            el('div', { className: 'projects-grid' }, cards),
        ]);

        const gutter = el('div', { className: 'section__gutter reveal reveal--delay-2', innerHTML: '008<br />009<br />010' });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Skills ────────────────────────────────────────────────────────────
    function renderSkills() {
        const sectionEl = document.getElementById('skills');

        const barColorMap = {
            'accent-primary': 'skill__bar-fill--primary',
            'accent-secondary': 'skill__bar-fill--secondary',
            'accent-tertiary': 'skill__bar-fill--tertiary',
        };

        const groups = skills.map((group, gi) => {
            const delay = Math.min(gi + 3, 8);
            const fillClass = barColorMap[group.colorClass] || 'skill__bar-fill--primary';

            const items = group.items.map(item =>
                el('li', {}, [
                    el('div', { className: 'skill__header' }, [
                        el('span', { textContent: item.name }),
                        el('span', { textContent: `${item.level}%` }),
                    ]),
                    el('div', { className: 'skill__bar-bg' }, [
                        el('div', {
                            className: `skill__bar-fill ${fillClass}`,
                            'data-width': `${item.level}%`,
                            style: { width: '0%' },
                        }),
                    ]),
                ])
            );

            return el('div', { className: `reveal reveal--delay-${delay}` }, [
                el('h4', { className: 'skill-group__title', textContent: group.category }),
                el('ul', { className: 'skill-group__list' }, items),
            ]);
        });

        const header = el('div', { className: 'section-header reveal' }, [
            el('span', { className: 'section-header__tag type-target', 'data-type': '<!-- 03_SKILLS -->' }),
            el('h2', { className: 'section-header__title type-target', 'data-type': 'Technical Stack' }),
        ]);

        const content = el('div', { className: 'section__content' }, [
            header,
            el('div', { className: 'skills-grid' }, groups),
        ]);

        const gutter = el('div', { className: 'section__gutter reveal reveal--delay-2', innerHTML: '011<br />012<br />013' });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Contact ───────────────────────────────────────────────────────────
    function renderContact() {
        const sectionEl = document.getElementById('contact');

        const channels = contact.channels.map((ch, i) => {
            const delay = Math.min(i + 4, 8);
            return el('a', { className: `contact-channel reveal reveal--left reveal--delay-${delay}`, href: ch.href }, [
                el('span', { className: 'contact-channel__index', textContent: ch.index }),
                document.createTextNode(ch.label),
            ]);
        });

        const header = el('div', { className: 'section-header reveal' }, [
            el('span', { className: 'section-header__tag type-target', 'data-type': '<!-- 04_CONTACT -->' }),
            el('h2', { className: 'section-header__title type-target', 'data-type': 'Establish Uplink' }),
        ]);

        const content = el('div', { className: 'section__content' }, [
            header,
            el('div', { className: 'contact-box reveal reveal--scale reveal--delay-3' }, [
                el('div', { className: 'contact-status' }, [
                    el('span', { className: 'contact-status__dot animate-pulse' }),
                    el('span', { className: 'contact-status__text', textContent: contact.statusText }),
                ]),
                el('div', { className: 'contact-body' }, [
                    el('div', {}, [
                        el('p', { className: 'contact-body__description', textContent: contact.description }),
                        el('a', {
                            className: 'contact-body__email',
                            href: contact.email.href,
                            textContent: contact.email.text,
                        }),
                    ]),
                    el('div', { className: 'contact-channels' }, channels),
                ]),
            ]),
        ]);

        const gutter = el('div', { className: 'section__gutter reveal reveal--delay-2', innerHTML: '014<br />015' });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Footer ────────────────────────────────────────────────────────────
    function renderFooter() {
        const footerEl = document.getElementById('footer');

        const container = el('div', { className: 'container-footer reveal' }, [
            el('div', { className: 'footer__copyright' }, [
                document.createTextNode(`${profile.footerCopyright} - `),
                el('span', { className: 'footer__status animate-pulse', textContent: 'STATUS: 200 OK' }),
                document.createTextNode(' - PING: 24ms'),
            ]),
            el('div', { className: 'footer__links' },
                profile.footerLinks.map(link =>
                    el('a', { className: 'footer__link', href: link.href, textContent: link.label })
                )
            ),
        ]);

        footerEl.appendChild(container);
    }

    // ── Scroll-Reveal Observer ────────────────────────────────────────────
    function initScrollReveal() {
        const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Skip if reduced-motion is preferred
        if (noMotion) {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal--visible'));
            document.querySelectorAll('.skill__bar-fill[data-width]').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
            document.querySelectorAll('.type-target').forEach(el => {
                el.textContent = el.dataset.type;
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');

                    // Fire sequential typing for target headers if untyped
                    if (!entry.target.dataset.typingActive) {
                        entry.target.dataset.typingActive = 'true';
                        
                        const targets = Array.from(entry.target.querySelectorAll('.type-target'));
                        if (targets.length > 0) {
                            (async () => {
                                for (let el of targets) {
                                    el.classList.add('blinking-cursor');
                                    await typeText(el, el.dataset.type, 10);
                                    el.classList.remove('blinking-cursor');
                                }
                            })();
                        }
                    }

                    // Animate skill bars inside this element
                    const bars = entry.target.querySelectorAll('.skill__bar-fill[data-width]');
                    bars.forEach((bar, i) => {
                        const tid = setTimeout(() => {
                            // Check if still visible before animating
                            if (entry.target.classList.contains('reveal--visible')) {
                                bar.style.width = bar.dataset.width;
                            }
                        }, 200 + i * 80);
                        bar.dataset.tid = tid;
                    });
                } else {
                    entry.target.classList.remove('reveal--visible');

                    // Reset skill bars
                    const bars = entry.target.querySelectorAll('.skill__bar-fill[data-width]');
                    bars.forEach(bar => {
                        if (bar.dataset.tid) clearTimeout(Number(bar.dataset.tid));
                        bar.style.width = '0%';
                    });
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px',
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // ── Mouse Glow Spotlight ──────────────────────────────────────────────
    function initMouseGlow() {
        const glow = el('div', { className: 'mouse-glow' });
        document.body.appendChild(glow);

        let rafId;
        document.addEventListener('mousemove', (e) => {
            if (!document.body.classList.contains('mouse-in')) {
                document.body.classList.add('mouse-in');
            }

            // Switch glow mode based on hovered section:
            // - Hero: Claude Code icon hint
            // - Elsewhere: regular circular spotlight
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            const hovered = document.elementFromPoint(e.clientX, e.clientY);
            const inHero =
                document.body.classList.contains('is-booting') ||
                Boolean(hovered && hovered.closest && hovered.closest('#hero'));
            document.body.classList.toggle('glow-hero', inHero);
            
            // Batch style updates to the next animation frame for smoothness
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                glow.style.setProperty('--mouse-x', `${e.clientX}px`);
                glow.style.setProperty('--mouse-y', `${e.clientY}px`);
            });
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('mouse-in');
            document.body.classList.remove('glow-hero');
        });
    }

    // ── Nav Scroll Spy ────────────────────────────────────────────────────
    function initNavScrollSpy() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav__link');

        function onScroll() {
            let current = null;
            // Check if we are at the very bottom of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                current = sections[sections.length - 1].id;
            } else {
                // Find the section that occupies the largest part of the viewport
                let maxVisibleArea = 0;
                sections.forEach(sec => {
                    const rect = sec.getBoundingClientRect();
                    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                    if (visibleHeight > maxVisibleArea && visibleHeight > 0) {
                        maxVisibleArea = visibleHeight;
                        current = sec.id;
                    }
                });
            }

            if (current) {
                navLinks.forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        // Initial check
        onScroll();
    }

    // ── Render All ────────────────────────────────────────────────────────
    renderNav();
    const heroEls = renderHero();
    renderExperience();
    renderProjects();
    renderSkills();
    renderContact();
    renderFooter();

    // Kick off mouse glow immediately, but delay scroll reveals through the boot sequence
    initMouseGlow();
    initNavScrollSpy();
    animateBootSequence(heroEls);

})();
