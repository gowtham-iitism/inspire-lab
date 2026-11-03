import "./style.css";
import homepage from "../content/homepage.json";

const files = import.meta.glob(
  "../content/{research,projects,publications,team,news}/*.json",
  { eager: true, import: "default" }
);

const byFolder = (folder) =>
  Object.entries(files)
    .filter(([path]) => path.includes(`/content/${folder}/`))
    .map(([, value]) => value)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

const research = byFolder("research");
const projects = byFolder("projects");
const publications = byFolder("publications");
const team = byFolder("team");
const news = byFolder("news");

const esc = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

// GitHub Pages repository path
const BASE = "/inspire-lab/";

const assetPath = (path = "") => {
  if (!path) return "";
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  return `${BASE}${path.replace(/^\/+/, "")}`;
};

const logoPath = assetPath("images/inspire-logo.png");

const makeCard = (item, index, fallback) => {
  const image = assetPath(item.image || item.photo || fallback);

  return `
    <article class="tile">
      <div class="tile-image">
        <img
          src="${esc(image)}"
          alt="${esc(item.imageAlt || item.title || item.name || "")}"
          loading="lazy"
        >
      </div>
      <div class="tile-copy">
        <span class="num">
          ${esc(item.number || String(index + 1).padStart(2, "0"))}
        </span>
        <h3>${esc(item.title || item.name || "")}</h3>
        <p>${esc(item.summary || item.bio || item.description || "")}</p>
        ${
          item.url
            ? `<a class="under" href="${esc(item.url)}" target="_blank" rel="noopener">Learn more ↗</a>`
            : ""
        }
      </div>
    </article>
  `;
};

const heroPoster = homepage.heroPoster
  ? assetPath(homepage.heroPoster)
  : "";

const heroVideo = homepage.heroVideo || "";

document.querySelector("#app").innerHTML = `
  <div class="topline">
    <span class="dot"></span>
    INSpIRE Lab <b>/</b> IIT (ISM) DHANBAD
  </div>

  <header class="header">
    <a class="brand" href="#top" aria-label="INSpIRE Lab home">
      <img
        class="brand-logo"
        src="${esc(logoPath)}"
        alt="INSpIRE Lab logo"
      >
    </a>

    <button class="menu" aria-label="Toggle navigation" aria-expanded="false">
      ☰
    </button>

    <nav>
      <a href="#about">About</a>
      <a href="#research">Research</a>
      <a href="#projects">Projects</a>
      <a href="#publications">Publications</a>
      <a href="#people">People</a>
      <a class="navbtn" href="#contact">Connect ↗</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero">
      ${
        heroVideo
          ? `
            <video autoplay muted loop playsinline poster="${esc(heroPoster)}">
              <source src="${esc(heroVideo)}" type="video/mp4">
            </video>
          `
          : `
            <div
              class="hero-poster"
              style="background-image:url('${esc(heroPoster)}')"
            ></div>
          `
      }

      <div class="shade"></div>

      <div class="hero-inner">
        <small>GEOTECHNICAL INFRASTRUCTURE · RESEARCH · INNOVATION</small>

        <h1>
          ${esc(homepage.heroTitle || "Engineering the")}
          <br>
          <em>${esc(homepage.heroAccent || "Future Below Ground")}</em>
        </h1>

        <p>${esc(homepage.tagline || "")}</p>

        <a class="primary" href="#research">
          Explore our research <b>↗</b>
        </a>
      </div>

      <div class="hero-foot">
        RESEARCH THAT MOVES INFRASTRUCTURE FORWARD
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>

    <section class="section about" id="about">
      <div class="eyebrow">WHO WE ARE</div>

      <div class="split">
        <h2>
          ${esc(homepage.aboutTitle || "Building knowledge. Strengthening the future.")}
        </h2>

        <div>
          <p class="lead">${esc(homepage.aboutText || "")}</p>
          <a class="under" href="#people">Meet the community ↗</a>
        </div>
      </div>

      <div class="stats">
        <div><b>01</b><span>Research-led<br>innovation</span></div>
        <div><b>02</b><span>Multiscale<br>engineering</span></div>
        <div><b>03</b><span>Real-world<br>impact</span></div>
        <div><b>04</b><span>Collaborative<br>discovery</span></div>
      </div>
    </section>

    <section class="section research" id="research">
      <div class="section-head">
        <div>
          <div class="eyebrow">WHAT WE EXPLORE</div>
          <h2>Research <em>frontiers.</em></h2>
        </div>
        <p>
          Our work spans geomaterials, underground systems and infrastructure
          exposed to complex environments.
        </p>
      </div>

      <div class="tiles">
        ${research.map((item, i) =>
          makeCard(item, i, "images/research-placeholder.jpg")
        ).join("")}
      </div>
    </section>

    <section class="statement">
      <div class="statement-shade"></div>
      <div class="statement-inner">
        <div class="eyebrow light">OUR APPROACH</div>
        <h2>
          From fundamental mechanics
          <br>
          to <em>resilient systems.</em>
        </h2>
        <p>
          Experimental investigation, numerical modelling and data-driven
          methods for complex geotechnical problems.
        </p>
      </div>
    </section>

    <section class="section" id="projects">
      <div class="section-head">
        <div>
          <div class="eyebrow">WORK IN ACTION</div>
          <h2>Featured <em>projects.</em></h2>
        </div>
        <p>Research with practical relevance and measurable impact.</p>
      </div>

      <div class="tiles projects">
        ${projects.map((item, i) =>
          makeCard(item, i, "images/project-placeholder.jpg")
        ).join("")}
      </div>
    </section>

    <section class="section dark" id="publications">
      <div class="pub-layout">
        <div>
          <div class="eyebrow light">KNOWLEDGE & DISCOVERY</div>
          <h2>Ideas that<br><em>move us forward.</em></h2>
          <p>
            Selected publications and contributions from the INSpIRE community.
          </p>

          ${
            homepage.scholarUrl
              ? `<a class="outline" href="${esc(homepage.scholarUrl)}" target="_blank" rel="noopener">Google Scholar ↗</a>`
              : ""
          }
        </div>

        <div class="pub-list">
          ${publications.map((p, i) => `
            <article>
              <b>${String(i + 1).padStart(2, "0")}</b>
              <div>
                <h3>${esc(p.title || "")}</h3>
                <p>
                  ${esc(p.authors || "")}
                  ${p.venue ? ` · ${esc(p.venue)}` : ""}
                  ${p.year ? ` · ${esc(p.year)}` : ""}
                  ${
                    p.doi
                      ? ` · <a href="${esc(p.doi)}" target="_blank" rel="noopener">DOI ↗</a>`
                      : ""
                  }
                </p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="section people" id="people">
      <div class="section-head">
        <div>
          <div class="eyebrow">THE PEOPLE BEHIND THE WORK</div>
          <h2>Curious minds.<br><em>Shared purpose.</em></h2>
        </div>
        <p>
          Research is a collective endeavour. Meet the people behind INSpIRE.
        </p>
      </div>

      <div class="people-grid">
        ${team.map((person) => `
          <article class="person">
            <div class="person-photo">
              <img
                src="${esc(assetPath(person.photo || "images/person-placeholder.jpg"))}"
                alt="${esc(person.name || "")}"
                loading="lazy"
              >
            </div>
            <h3>${esc(person.name || "")}</h3>
            <small>${esc(person.role || "")}</small>
            <p>${esc(person.bio || "")}</p>
            ${
              person.url
                ? `<a class="under" href="${esc(person.url)}" target="_blank" rel="noopener">Profile ↗</a>`
                : ""
            }
          </article>
        `).join("")}
      </div>
    </section>

    ${
      news.length
        ? `
          <section class="section news" id="news">
            <div class="section-head">
              <div>
                <div class="eyebrow">LATEST UPDATES</div>
                <h2>Lab <em>news.</em></h2>
              </div>
            </div>
            <div class="news-grid">
              ${news.map((item, i) =>
                makeCard(item, i, "images/news-placeholder.jpg")
              ).join("")}
            </div>
          </section>
        `
        : ""
    }

    <section class="join">
      <div>
        <div class="eyebrow light">BE PART OF THE JOURNEY</div>
        <h2>Good questions build<br><em>better futures.</em></h2>
        <p>
          Interested in research, collaboration or joining the group?
          We'd love to hear from you.
        </p>
      </div>

      ${
        homepage.contactEmail
          ? `<a class="primary" href="mailto:${esc(homepage.contactEmail)}">Start a conversation ↗</a>`
          : ""
      }
    </section>
  </main>

  <footer id="contact">
    <div class="footer-grid">
      <div>
        <a class="brand footbrand" href="#top" aria-label="INSpIRE Lab home">
          <img
            class="brand-logo"
            src="${esc(logoPath)}"
            alt="INSpIRE Lab logo"
          >
        </a>
        <p>
          Integrated Solutions for Sustainable and Resilient
          Geotechnical Infrastructure.
        </p>
      </div>

      <div>
        <b>EXPLORE</b>
        <a href="#about">About</a>
        <a href="#research">Research</a>
        <a href="#projects">Projects</a>
        <a href="#publications">Publications</a>
      </div>

      <div>
        <b>FIND US</b>
        <p>
          Department of Civil Engineering<br>
          IIT (ISM) Dhanbad<br>
          Jharkhand, India 826004
        </p>
        <a href="https://www.iitism.ac.in/" target="_blank" rel="noopener">
          Institute website ↗
        </a>
      </div>

      <div>
        <b>CONTACT</b>
        ${
          homepage.contactEmail
            ? `<a href="mailto:${esc(homepage.contactEmail)}">${esc(homepage.contactEmail)}</a>`
            : ""
        }
      </div>
    </div>

    <div class="copyright">
      © ${new Date().getFullYear()} INSpIRE Lab · IIT (ISM) Dhanbad
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>
`;

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

menu?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  });
});
