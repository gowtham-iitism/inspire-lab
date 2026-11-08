import "./style.css";
import homepage from "../content/homepage.json";

// --------------------------------------------------
// 1. SITE CONFIGURATION
// --------------------------------------------------

const BASE = "/inspire-lab/";

const page = document.body.dataset.page || "home";

const files = import.meta.glob(
  "../content/{research,projects,publications,team,news}/*.json",
  {
    eager: true,
    import: "default",
  }
);

// --------------------------------------------------
// 2. LOAD CONTENT FROM JSON FILES
// --------------------------------------------------

const get = (folder) =>
  Object.entries(files)
    .filter(([path]) => path.includes(`/content/${folder}/`))
    .map(([, value]) => value)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

const research = get("research");
const projects = get("projects");
const publications = get("publications");
const team = get("team");
const news = get("news");

// --------------------------------------------------
// 3. HELPER FUNCTIONS
// --------------------------------------------------

// Escape HTML characters to prevent unwanted HTML injection.
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

// Convert relative image paths into website asset paths.
const asset = (p = "") =>
  !p
    ? ""
    : /^(https?:)?\/\//i.test(p) || p.startsWith("data:")
      ? p
      : BASE + p.replace(/^\/+/, "");

const logo = asset("images/inspire-logo.png");

// --------------------------------------------------
// 4. NAVIGATION LINKS
// --------------------------------------------------

const nav = [
  ["Home", "index.html", "home"],
  ["About", "about.html", "about"],
  ["Research", "research.html", "research"],
  ["Projects", "projects.html", "projects"],
  ["Publications", "publications.html", "publications"],
  ["People", "people.html", "people"],
  ["News", "news.html", "news"],
  ["Contact", "contact.html", "contact"],
];

// --------------------------------------------------
// 5. HEADER
// --------------------------------------------------

const header = `
  <div class="topline">
    <span class="dot"></span>
    INSpIRE Lab <b>/</b> IIT (ISM) DHANBAD
  </div>

  <header class="header">

    <a class="brand" href="${BASE}index.html">
      <img
        class="brand-logo"
        src="${esc(logo)}"
        alt="INSpIRE Lab logo"
      >
    </a>

    <button
      class="menu"
      aria-label="Toggle navigation"
      aria-expanded="false"
    >
      ☰
    </button>

    <nav>
      ${nav
        .map(
          ([name, href, id]) => `
            <a
              class="${page === id ? "active" : ""} ${
                id === "contact" ? "navbtn" : ""
              }"
              href="${BASE}${href}"
            >
              ${name}
            </a>
          `
        )
        .join("")}
    </nav>

  </header>
`;

// --------------------------------------------------
// 6. FOOTER
// --------------------------------------------------

const footer = `
  <footer>

    <div class="footer-grid">

      <div>
        <a class="brand footbrand" href="${BASE}index.html">
          <img
            class="brand-logo"
            src="${esc(logo)}"
            alt="INSpIRE Lab logo"
          >
        </a>

        <p>
          Integrated Solutions for Sustainable and
          Resilient Geotechnical Infrastructure.
        </p>
      </div>

      <div>
        <b>EXPLORE</b>

        ${nav
          .slice(1, 7)
          .map(
            ([name, href]) => `
              <a href="${BASE}${href}">${name}</a>
            `
          )
          .join("")}
      </div>

      <div>
        <b>FIND US</b>

        <p>
          Department of Civil Engineering<br>
          IIT (ISM) Dhanbad<br>
          Jharkhand, India 826004
        </p>

        <a
          href="https://www.iitism.ac.in/"
          target="_blank"
          rel="noopener"
        >
          Institute website ↗
        </a>
      </div>

      <div>
        <b>CONTACT</b>

        ${
          homepage.contactEmail
            ? `
              <a href="mailto:${esc(homepage.contactEmail)}">
                ${esc(homepage.contactEmail)}
              </a>
            `
            : ""
        }
      </div>

    </div>

    <div class="copyright">
      © ${new Date().getFullYear()} INSpIRE Lab · IIT (ISM) Dhanbad

      <a href="${BASE}index.html">Home ↑</a>
    </div>

  </footer>
`;

// --------------------------------------------------
// 7. RESEARCH, PROJECT AND NEWS CARDS
// --------------------------------------------------

const card = (x, i, fallback) => `
  <article class="tile">

    <div class="tile-image">
      <img
        src="${esc(asset(x.image || x.photo || fallback))}"
        alt="${esc(x.imageAlt || x.title || x.name || "")}"
        loading="lazy"
      >
    </div>

    <div class="tile-copy">

      <span class="num">
        ${esc(x.number || String(i + 1).padStart(2, "0"))}
      </span>

      <h3>${esc(x.title || x.name || "")}</h3>

      <p>
        ${esc(x.summary || x.bio || x.description || "")}
      </p>

      ${
        x.url
          ? `
            <a
              class="under"
              href="${esc(x.url)}"
              target="_blank"
              rel="noopener"
            >
              Learn more ↗
            </a>
          `
          : ""
      }

    </div>

  </article>
`;

// --------------------------------------------------
// 8. PUBLICATION FORMAT
// --------------------------------------------------

const pub = (p, i) => `
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
            ? `
              · <a
                  href="${esc(p.doi)}"
                  target="_blank"
                  rel="noopener"
                >
                  DOI ↗
                </a>
            `
            : ""
        }
      </p>
    </div>

  </article>
`;

// --------------------------------------------------
// 9. TEAM MEMBER FORMAT
// --------------------------------------------------

const person = (p) => `
  <article class="person">

    <div class="person-photo">
      <img
        src="${esc(asset(p.photo || "images/person-placeholder.jpg"))}"
        alt="${esc(p.name || "")}"
        loading="lazy"
      >
    </div>

    <h3>${esc(p.name || "")}</h3>

    <small>${esc(p.role || "")}</small>

    <p>${esc(p.bio || "")}</p>

    ${
      p.url
        ? `
          <a
            class="under"
            href="${esc(p.url)}"
            target="_blank"
            rel="noopener"
          >
            Profile ↗
          </a>
        `
        : ""
    }

  </article>
`;

// --------------------------------------------------
// 10. INTERNAL PAGE INTRODUCTION
// --------------------------------------------------

const intro = (eyebrow, title, desc = "") => `
  <section class="page-hero">

    <div class="eyebrow light">
      ${eyebrow}
    </div>

    <h1>${title}</h1>

    ${desc ? `<p>${desc}</p>` : ""}

  </section>
`;

// --------------------------------------------------
// 11. HOME PAGE
// --------------------------------------------------

const home = () => {
  const poster = homepage.heroPoster
    ? asset(homepage.heroPoster)
    : "";

  const video = homepage.heroVideo || "";

  return `

    <!-- HERO SECTION -->

    <section class="hero">

      ${
        video
          ? `
            <video
              autoplay
              muted
              loop
              playsinline
              poster="${esc(poster)}"
            >
              <source
                src="${esc(video)}"
                type="video/mp4"
              >
            </video>
          `
          : `
            <div
              class="hero-poster"
              style="background-image:url('${esc(poster)}')"
            ></div>
          `
      }

      <div class="shade"></div>

      <div class="hero-inner">

        <small>
          GEOTECHNICAL INFRASTRUCTURE · RESEARCH · INNOVATION
        </small>

        <h1>
          ${esc(homepage.heroTitle || "Engineering the")}
          <br>
          <em>
            ${esc(homepage.heroAccent || "Future Below Ground")}
          </em>
        </h1>

        <p>${esc(homepage.tagline || "")}</p>

        <a class="primary" href="${BASE}research.html">
          Explore our research ↗
        </a>

      </div>

      <div class="hero-foot">
        RESEARCH THAT MOVES INFRASTRUCTURE FORWARD
        <span>SCROLL TO EXPLORE ↓</span>
      </div>

    </section>


    <!-- ABOUT SECTION -->

    <section class="section">

      <div class="eyebrow">WHO WE ARE</div>

      <div class="split">

        <h2>
          ${esc(
            homepage.aboutTitle ||
            "Building knowledge. Strengthening the future."
          )}
        </h2>

        <div>
          <p class="lead">${esc(homepage.aboutText || "")}</p>

          <a class="under" href="${BASE}about.html">
            Discover the lab ↗
          </a>
        </div>

      </div>

      <div class="stats">

        <div>
          <b>01</b>
          <span>Research-led<br>innovation</span>
        </div>

        <div>
          <b>02</b>
          <span>Multiscale<br>engineering</span>
        </div>

        <div>
          <b>03</b>
          <span>Real-world<br>impact</span>
        </div>

        <div>
          <b>04</b>
          <span>Collaborative<br>discovery</span>
        </div>

      </div>

    </section>


    <!-- RESEARCH SECTION -->

    <section class="section tinted">

      <div class="section-head">

        <div>
          <div class="eyebrow">WHAT WE EXPLORE</div>
          <h2>Research <em>frontiers.</em></h2>
        </div>

        <p>
          Our work spans geomaterials, underground systems
          and infrastructure exposed to complex environments.
        </p>

      </div>

      <div class="tiles">
        ${research
          .slice(0, 3)
          .map((x, i) => card(x, i, "images/research-placeholder.jpg"))
          .join("")}
      </div>

      <a class="under" href="${BASE}research.html">
        Explore all research ↗
      </a>

    </section>


    <!-- RESEARCH APPROACH SECTION -->

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
          Experimental investigation, numerical modelling
          and data-driven methods for complex geotechnical problems.
        </p>

      </div>

    </section>


    <!-- PROJECTS SECTION -->

    <section class="section">

      <div class="section-head">

        <div>
          <div class="eyebrow">WORK IN ACTION</div>
          <h2>Featured <em>projects.</em></h2>
        </div>

        <p>
          Research with practical relevance and measurable impact.
        </p>

      </div>

      <div class="tiles">
        ${projects
          .slice(0, 3)
          .map((x, i) => card(x, i, "images/project-placeholder.jpg"))
          .join("")}
      </div>

      <a class="under" href="${BASE}projects.html">
        All projects ↗
      </a>

    </section>


    <!-- PUBLICATIONS SECTION -->

    <section class="section dark">

      <div class="pub-layout">

        <div>
          <div class="eyebrow light">KNOWLEDGE & DISCOVERY</div>

          <h2>
            Ideas that
            <br>
            <em>move us forward.</em>
          </h2>

          <p>
            Selected publications from the INSpIRE community.
          </p>

          <a class="outline" href="${BASE}publications.html">
            All publications ↗
          </a>
        </div>

        <div class="pub-list">
          ${publications.slice(0, 3).map(pub).join("")}
        </div>

      </div>

    </section>


    <!-- PEOPLE SECTION -->

    <section class="section tinted">

      <div class="section-head">

        <div>
          <div class="eyebrow">THE PEOPLE BEHIND THE WORK</div>

          <h2>
            Curious minds.
            <br>
            <em>Shared purpose.</em>
          </h2>
        </div>

        <p>Meet the people behind INSpIRE.</p>

      </div>

      <div class="people-grid">
        ${team.slice(0, 4).map(person).join("")}
      </div>

      <a class="under" href="${BASE}people.html">
        Meet the team ↗
      </a>

    </section>


    <!-- CONTACT / JOIN SECTION -->

    <section class="join">

      <div>
        <div class="eyebrow light">BE PART OF THE JOURNEY</div>

        <h2>
          Good questions build
          <br>
          <em>better futures.</em>
        </h2>

        <p>
          Interested in research, collaboration or joining the group?
        </p>
      </div>

      <a class="primary" href="${BASE}contact.html">
        Connect with us ↗
      </a>

    </section>

  `;
};


// --------------------------------------------------
// 12. OTHER WEBSITE PAGES
// --------------------------------------------------

const pages = {

  // ABOUT PAGE
  about: () => `
    ${intro(
      "ABOUT INSPIRE",
      "Building knowledge.<br><em>Strengthening the future.</em>",
      esc(homepage.aboutText || "")
    )}

    <section class="section">

      <div class="split">

        <h2>
          Integrated solutions for resilient infrastructure.
        </h2>

        <p class="lead">
          INSpIRE Lab brings together ideas, people and engineering
          to address complex challenges in geotechnical and
          underground infrastructure. Based at IIT (ISM) Dhanbad,
          our research connects fundamental understanding with
          practical solutions for safer, smarter and more
          resilient infrastructure.
        </p>

      </div>

    </section>
  `,


  // RESEARCH PAGE
  research: () => `
    ${intro(
      "WHAT WE EXPLORE",
      "Research <em>frontiers.</em>",
      "Research themes across geomaterials, underground systems and resilient infrastructure."
    )}

    <section class="section">

      <div class="tiles">
        ${research
          .map((x, i) => card(x, i, "images/research-placeholder.jpg"))
          .join("")}
      </div>

    </section>
  `,


  // PROJECTS PAGE
  projects: () => `
    ${intro(
      "WORK IN ACTION",
      "Featured <em>projects.</em>",
      "Research with practical relevance and measurable impact."
    )}

    <section class="section">

      <div class="tiles">
        ${projects
          .map((x, i) => card(x, i, "images/project-placeholder.jpg"))
          .join("")}
      </div>

    </section>
  `,


  // PUBLICATIONS PAGE
  publications: () => `
    ${intro(
      "KNOWLEDGE & DISCOVERY",
      "Ideas that <em>move us forward.</em>",
      "Selected publications and scholarly contributions from INSpIRE."
    )}

    <section class="section dark">

      <div class="pub-list">
        ${publications.map(pub).join("")}
      </div>

      ${
        homepage.scholarUrl
          ? `
            <a
              class="outline"
              href="${esc(homepage.scholarUrl)}"
              target="_blank"
              rel="noopener"
            >
              Google Scholar ↗
            </a>
          `
          : ""
      }

    </section>
  `,


  // PEOPLE PAGE
  people: () => `
    ${intro(
      "THE PEOPLE BEHIND THE WORK",
      "Curious minds.<br><em>Shared purpose.</em>",
      "Meet the researchers, students and collaborators behind INSpIRE."
    )}

    <section class="section">

      <div class="people-grid">
        ${team.map(person).join("")}
      </div>

    </section>
  `,


  // NEWS PAGE
  news: () => `
    ${intro(
      "LATEST UPDATES",
      "INSpIRE <em>news.</em>",
      "Announcements, awards, events and updates from the lab."
    )}

    <section class="section">

      <div class="tiles">
        ${news
          .map((x, i) => card(x, i, "images/news-placeholder.jpg"))
          .join("")}
      </div>

    </section>
  `,


  // CONTACT PAGE
  contact: () => `
    ${intro(
      "GET IN TOUCH",
      "Start a <em>conversation.</em>",
      "Interested in research, collaboration or joining the group? We'd love to hear from you."
    )}

    <section class="section">

      <div class="contact-panel">

        <h2>Connect with INSpIRE Lab</h2>

        <p>
          Department of Civil Engineering<br>
          IIT (ISM) Dhanbad<br>
          Jharkhand, India 826004
        </p>

        ${
          homepage.contactEmail
            ? `
              <a
                class="primary"
                href="mailto:${esc(homepage.contactEmail)}"
              >
                ${esc(homepage.contactEmail)} ↗
              </a>
            `
            : ""
        }

      </div>

    </section>
  `,

};


// --------------------------------------------------
// 13. RENDER THE CURRENT PAGE
// --------------------------------------------------

document.querySelector("#app").innerHTML =
  header +
  (pages[page] || home)() +
  footer;


// --------------------------------------------------
// 14. MOBILE NAVIGATION MENU
// --------------------------------------------------

const menu = document.querySelector(".menu");
const navEl = document.querySelector("nav");

menu?.addEventListener("click", () => {
  const open = navEl.classList.toggle("open");

  menu.setAttribute("aria-expanded", String(open));
});
