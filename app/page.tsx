type Experience = {
  period: string;
  role: string;
  company: string;
  points: readonly string[];
};

type Project = {
  kicker: string;
  title: string;
  description: string;
  tags: readonly string[];
};

type WritingItem = {
  date: string;
  title: string;
  href: string;
};

const experienceData: readonly Experience[] = [
  {
    period: "2024 — Present",
    role: "Senior Frontend Engineer",
    company: "Spotify",
    points: [
      "Build accessible product experiences and design-system patterns for high-traffic surfaces.",
      "Partner with design and product teams to ship polished UI with strong performance budgets.",
      "Turn ambiguous requirements into reusable frontend architecture that scales across teams.",
    ],
  },
  {
    period: "2021 — 2024",
    role: "Frontend Engineer",
    company: "Upstatement",
    points: [
      "Delivered marketing and product sites with a focus on motion, readability, and maintainability.",
      "Worked across design systems, content-heavy pages, and editorial experiences.",
      "Translated brand direction into resilient component APIs and responsive layouts.",
    ],
  },
  {
    period: "2019 — 2021",
    role: "Frontend Developer",
    company: "Scout",
    points: [
      "Shipped refined digital products with strong typography, careful spacing, and clear hierarchy.",
      "Improved accessibility and interaction patterns across internal and customer-facing tools.",
      "Built small, composable interfaces that made changes easier for the whole team.",
    ],
  },
  {
    period: "2017 — 2019",
    role: "Design Engineer",
    company: "Apple",
    points: [
      "Prototyped interface concepts and production-ready frontends for polished, high-stakes experiences.",
      "Used tight visual systems and precise implementation details to keep the product feel consistent.",
      "Collaborated closely with multidisciplinary teams to reduce ambiguity and move faster.",
    ],
  },
];

const projects: readonly Project[] = [
  {
    kicker: "Featured Project",
    title: "Halcyon Theme",
    description: "A dark portfolio template built with Next.js and styled-components for calm hierarchy and easy customization.",
    tags: ["Next.js", "styled-components", "Portfolio"],
  },
  {
    kicker: "Featured Project",
    title: "Spotify Profile",
    description: "A web app for visualizing Spotify data with playful, restrained presentation and strong structure.",
    tags: ["React", "Data viz", "API"],
  },
  {
    kicker: "Selected Project",
    title: "Design System Explorer",
    description: "A lightweight interface for browsing component variations, usage guidelines, and tokens.",
    tags: ["TypeScript", "Design systems", "Accessibility"],
  },
  {
    kicker: "Selected Project",
    title: "Editorial Archive",
    description: "A content-first layout for long-form writing built to keep typography, rhythm, and reading comfort front and center.",
    tags: ["Editorial", "Responsive", "Content"],
  },
];

const writing: readonly WritingItem[] = [
  { date: "2026", title: "What makes a good portfolio website", href: "#" },
  { date: "2024", title: "Small interface choices that make products feel bigger", href: "#" },
  { date: "2020", title: "Design systems that keep teams moving", href: "#" },
  { date: "2019", title: "Why accessibility belongs in the first draft", href: "#" },
];

const stack = ["JavaScript", "TypeScript", "React", "Next.js", "Accessibility", "Design systems"];

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <div className="page-shell">
        <aside className="sidebar" aria-label="Primary navigation">
          <a className="logo" href="#top" aria-label="Brittany Chiang home">
            <span>BC</span>
          </a>

          <nav className="nav">
            <a className="nav-link active" href="#about">
              <span>01.</span> About
            </a>
            <a className="nav-link" href="#experience">
              <span>02.</span> Experience
            </a>
            <a className="nav-link" href="#work">
              <span>03.</span> Work
            </a>
            <a className="nav-link" href="#writing">
              <span>04.</span> Writing
            </a>
            <a className="nav-link" href="#contact">
              <span>05.</span> Contact
            </a>
          </nav>

          <div className="socials" aria-label="Social links">
            <a href="https://github.com/bchiang7" target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
            <a href="mailto:hello@brittanychiang.com">Email</a>
          </div>
        </aside>

        <main id="content" className="main-content" tabIndex={-1}>
          <section id="top" className="hero section">
            <p className="eyebrow">Hi, my name is</p>
            <h1>Brittany Chiang.</h1>
            <h2>I build accessible digital experiences for the web.</h2>
            <p className="intro">
              I’m a software engineer based in San Francisco, focused on calm interfaces,
              accessible systems, and product work that feels effortless.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                See selected work
              </a>
              <a className="button button-secondary" href="#contact">
                Get in touch
              </a>
            </div>
          </section>

          <section id="about" className="section">
            <div className="section-heading">
              <span className="section-index">01.</span>
              <h3>About</h3>
              <span className="section-rule" />
            </div>
            <div className="about-grid">
              <div className="about-copy">
                <p>I build quiet, fast interfaces where design systems, frontend engineering, and accessibility overlap.</p>
                <p>I like turning complex requirements into a few clear decisions that feel invisible to the people using them.</p>
              </div>
              <div className="about-card">
                <p className="card-label">Core stack</p>
                <ul className="tech-list">
                  {stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="experience" className="section">
            <div className="section-heading">
              <span className="section-index">02.</span>
              <h3>Experience</h3>
              <span className="section-rule" />
            </div>

            <div className="experience-grid">
              <div className="experience-tabs" role="tablist" aria-label="Work history">
                <button type="button" className="experience-tab active" role="tab" aria-selected="true">
                  Spotify
                </button>
                <button type="button" className="experience-tab" role="tab" aria-selected="false">
                  Upstatement
                </button>
                <button type="button" className="experience-tab" role="tab" aria-selected="false">
                  Scout
                </button>
                <button type="button" className="experience-tab" role="tab" aria-selected="false">
                  Apple
                </button>
              </div>

              <article className="experience-panel" aria-live="polite">
                <p className="experience-meta">2024 — Present</p>
                <h4>
                  Senior Frontend Engineer <span>@ Spotify</span>
                </h4>
                <ul className="experience-points">
                  {experienceData[0].points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="work" className="section">
            <div className="section-heading">
              <span className="section-index">03.</span>
              <h3>Work</h3>
              <span className="section-rule" />
            </div>

            <div className="project-grid">
              {projects.map((project, index) => (
                <article className="project-card" key={project.title}>
                  <div className="project-media" aria-hidden="true" />
                  <div className="project-copy">
                    <p className="project-kicker">
                      {project.kicker} {String(index + 1).padStart(2, "0")}
                    </p>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <ul className="project-tags">
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="writing" className="section">
            <div className="section-heading">
              <span className="section-index">04.</span>
              <h3>Writing</h3>
              <span className="section-rule" />
            </div>

            <div className="writing-list">
              {writing.map((item) => (
                <article className="writing-item" key={item.title}>
                  <div className="writing-date">{item.date}</div>
                  <h4 className="writing-title">
                    <a href={item.href}>{item.title}</a>
                  </h4>
                  <div className="writing-arrow">↗</div>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="section contact-section">
            <p className="section-index">05.</p>
            <h3>What’s next?</h3>
            <p className="contact-copy">
              My inbox is open. If you want to talk product, design systems, or frontend work,
              send a note.
            </p>
            <a className="button button-primary contact-button" href="mailto:hello@brittanychiang.com">
              Say hello
            </a>
          </section>

          <footer className="footer">
            <p>Designed in Figma, built with care, deployed on Vercel.</p>
          </footer>
        </main>
      </div>
    </>
  );
}
