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

    // ── Nav ───────────────────────────────────────────────────────────────
    function renderNav() {
        const navEl = document.getElementById('nav');

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
        const nameLines = profile.name.split('\n');

        const content = el('div', { className: 'section__content' }, [
            el('p', { className: 'hero__tag', textContent: profile.initTag }),
            el('h1', {
                className: 'hero__name blinking-cursor',
                innerHTML: nameLines.join('<br />'),
            }),
            el('div', { className: 'hero__meta' }, [
                el('span', { className: 'hero__meta-text', textContent: `LEVEL: ${profile.level}` }),
                el('span', { className: 'hero__meta-divider' }),
                el('span', { className: 'hero__meta-text', textContent: `LOC: ${profile.location}` }),
            ]),
        ]);

        const gutter = el('div', { className: 'section__gutter', innerHTML: '000<br />001<br />002' });

        heroEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Experience ────────────────────────────────────────────────────────
    function renderExperience() {
        const sectionEl = document.getElementById('experience');

        const items = experience.map(exp => {
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

            return el('div', { className: 'timeline__item' }, children);
        });

        const timeline = el('div', { className: 'timeline' }, items);

        const content = el('div', { className: 'section__content' }, [
            el('div', { className: 'section-header' }, [
                el('span', { className: 'section-header__tag', textContent: '<!-- 01_EXPERIENCE -->' }),
                el('h2', { className: 'section-header__title', textContent: 'Professional History' }),
            ]),
            timeline,
        ]);

        const gutterLines = Array.from({ length: 5 }, (_, i) => String(i + 3).padStart(3, '0')).join('<br />');
        const gutter = el('div', { className: 'section__gutter', innerHTML: gutterLines });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Projects ──────────────────────────────────────────────────────────
    function renderProjects() {
        const sectionEl = document.getElementById('projects');

        const cards = projects.map(proj => {
            const stackStr = `["${proj.stack.join('", "')}"]`;

            return el('div', { className: 'project-card' }, [
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

        const content = el('div', { className: 'section__content' }, [
            el('div', { className: 'section-header' }, [
                el('span', { className: 'section-header__tag', textContent: '<!-- 02_PROJECTS -->' }),
                el('h2', { className: 'section-header__title', textContent: 'Technical Repositories' }),
            ]),
            el('div', { className: 'projects-grid' }, cards),
        ]);

        const gutter = el('div', { className: 'section__gutter', innerHTML: '008<br />009<br />010' });

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

        const groups = skills.map(group => {
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
                            style: { width: `${item.level}%` },
                        }),
                    ]),
                ])
            );

            return el('div', {}, [
                el('h4', { className: 'skill-group__title', textContent: group.category }),
                el('ul', { className: 'skill-group__list' }, items),
            ]);
        });

        const content = el('div', { className: 'section__content' }, [
            el('div', { className: 'section-header' }, [
                el('span', { className: 'section-header__tag', textContent: '<!-- 03_SKILLS -->' }),
                el('h2', { className: 'section-header__title', textContent: 'Technical Stack' }),
            ]),
            el('div', { className: 'skills-grid' }, groups),
        ]);

        const gutter = el('div', { className: 'section__gutter', innerHTML: '011<br />012<br />013' });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Contact ───────────────────────────────────────────────────────────
    function renderContact() {
        const sectionEl = document.getElementById('contact');

        const channels = contact.channels.map(ch =>
            el('a', { className: 'contact-channel', href: ch.href }, [
                el('span', { className: 'contact-channel__index', textContent: ch.index }),
                document.createTextNode(ch.label),
            ])
        );

        const content = el('div', { className: 'section__content' }, [
            el('div', { className: 'section-header' }, [
                el('span', { className: 'section-header__tag', textContent: '<!-- 04_CONTACT -->' }),
                el('h2', { className: 'section-header__title', textContent: 'Establish Uplink' }),
            ]),
            el('div', { className: 'contact-box' }, [
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

        const gutter = el('div', { className: 'section__gutter', innerHTML: '014<br />015' });

        sectionEl.appendChild(el('div', { className: 'section__row' }, [gutter, content]));
    }

    // ── Footer ────────────────────────────────────────────────────────────
    function renderFooter() {
        const footerEl = document.getElementById('footer');

        const container = el('div', { className: 'container-footer' }, [
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

    // ── Render All ────────────────────────────────────────────────────────
    renderNav();
    renderHero();
    renderExperience();
    renderProjects();
    renderSkills();
    renderContact();
    renderFooter();

})();
