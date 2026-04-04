const projects = [
  {
    tag: "Brand site",
    title: "Northstar Studio",
    description:
      "A clean launch site with a stronger hierarchy, richer visuals, and a conversion-focused contact flow.",
    chips: ["Strategy", "UI design", "Build"],
  },
  {
    tag: "Product page",
    title: "Signal OS",
    description:
      "A product narrative that leads with value, uses crisp motion, and keeps the call to action visible throughout.",
    chips: ["Frontend", "Copy layout", "Conversion"],
    featured: true,
  },
  {
    tag: "Portfolio refresh",
    title: "Field Notes",
    description: "A personal showcase with a cleaner grid, better spacing, and a more memorable first screen.",
    chips: ["Content", "Motion", "Responsive"],
  },
] as const;

const services = [
  {
    title: "Visual direction",
    description: "Layout systems, typography choices, color direction, and page structure that feels deliberate.",
  },
  {
    title: "Frontend build",
    description: "Responsive implementation with accessible components, polished interactions, and clean code.",
  },
  {
    title: "Content framing",
    description: "Hero messaging, project summaries, and a better narrative for who you are and what you do.",
  },
] as const;

const contactLinks = [
  { label: "Email", href: "mailto:hello@yourdomain.com", text: "hello@yourdomain.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com", text: "LinkedIn" },
  { label: "GitHub", href: "https://github.com", text: "GitHub" },
  { label: "Instagram", href: "https://www.instagram.com", text: "Instagram" },
] as const;

export default function HomePage() {
  return (
    <>
      <div className="background" aria-hidden="true">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid" />
      </div>

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Jump to top">
          <span className="brand-mark">YN</span>
          <span className="brand-text">Your Name</span>
        </a>

        <details className="nav-shell">
          <summary className="menu-toggle">
            <span />
            <span />
            <span />
            <span className="sr-only">Menu</span>
          </summary>

          <nav className="nav">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </details>

        <nav className="nav desktop-nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="home">
        <section className="hero section reveal">
          <div className="eyebrow">Portfolio website</div>
          <div className="hero-copy">
            <p className="intro">Designing and building focused digital experiences.</p>
            <h1>Hi, I am Your Name. I create sharp, useful websites that feel intentional.</h1>
            <p className="summary">
              I partner on personal brands, startup launches, and product pages that need clean structure,
              strong storytelling, and a polished finish.
            </p>
          </div>

          <div className="hero-actions">
            <a className="button primary" href="#work">
              View selected work
            </a>
            <a className="button secondary" href="#contact">
              Get in touch
            </a>
          </div>

          <dl className="hero-metrics">
            <div>
              <dt>Focus</dt>
              <dd>Web design, frontend, storytelling</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>Fast, clear, content-first builds</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Open for freelance and collaborations</dd>
            </div>
          </dl>
        </section>

        <section id="work" className="section reveal">
          <div className="section-heading">
            <p className="label">Selected work</p>
            <h2>A few project shapes that show the range.</h2>
          </div>

          <div className="card-grid projects">
            {projects.map((project) => (
              <article className={`card project-card${project.featured ? " featured" : ""}`} key={project.title}>
                <p className="project-tag">{project.tag}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="chips">
                  {project.chips.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section reveal split">
          <div className="section-heading">
            <p className="label">Services</p>
            <h2>Everything needed to turn an idea into a credible web presence.</h2>
          </div>

          <div className="card-grid services-grid">
            {services.map((service) => (
              <article className="card service-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section reveal split about">
          <div className="section-heading">
            <p className="label">About</p>
            <h2>Built for people who want a portfolio that is calm, credible, and easy to scan.</h2>
          </div>

          <div className="card about-card">
            <p>
              I like websites that make a strong first impression without feeling loud. The aim is simple:
              show the work clearly, keep the experience fast, and let the details do the talking.
            </p>
            <p>
              This template is set up to be easy to personalize. Replace the placeholder projects, swap in
              your own links, and adjust the copy to match your voice.
            </p>
          </div>
        </section>

        <section className="section reveal">
          <div className="callout card">
            <div>
              <p className="label">Need a portfolio now?</p>
              <h2>Start with this layout, then refine the copy and project examples.</h2>
            </div>
            <a className="button primary" href="#contact">
              Contact me
            </a>
          </div>
        </section>

        <section id="contact" className="section reveal contact">
          <div className="section-heading">
            <p className="label">Contact</p>
            <h2>Use this section for email, socials, and a simple call to action.</h2>
          </div>

          <div className="card contact-card">
            {contactLinks.map((link) => (
              <a className="contact-link" href={link.href} key={link.label} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                {link.text}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built for Vercel deployment.</p>
        <p>
          © {new Date().getFullYear()} Your Name
        </p>
      </footer>
    </>
  );
}
