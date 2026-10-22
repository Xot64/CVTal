const portfolioMode = (() => {
  const segments = window.location.pathname.toLowerCase().split("/").filter(Boolean);
  const last = segments[segments.length - 1] === "index.html" ? segments[segments.length - 2] : segments[segments.length - 1];
  return ["games", "museums", "industrial"].includes(last) ? last : "games";
})();

const portfolioOrders = {
  games: ["projects", "museum", "industrial"],
  museums: ["museum", "projects", "industrial"],
  industrial: ["industrial", "museum", "projects"]
};

function configurePortfolioLayout() {
  const main = document.querySelector("main");
  const anchor = document.getElementById("experience");
  portfolioOrders[portfolioMode].forEach(id => {
    const section = document.getElementById(id);
    if (section && anchor) main.insertBefore(section, anchor);
  });
  const nav = document.querySelector(".main-nav");
  const experienceLink = nav?.querySelector('a[href="#experience"]');
  portfolioOrders[portfolioMode].forEach(id => {
    const link = nav?.querySelector(`a[href="#${id}"]`);
    if (link && experienceLink) nav.insertBefore(link, experienceLink);
  });
}

function applyPortfolioCopy(lang) {
  const dictionary = translations[lang] || translations.en;
  const copy = dictionary.heroModes?.[portfolioMode] || dictionary.hero;
  ["eyebrow", "title", "text"].forEach(key => {
    const el = document.querySelector(`.hero [data-i18n="hero.${key}"]`);
    if (el) el.textContent = copy[key];
  });
  const about = dictionary.aboutModes?.[portfolioMode] || dictionary.about;
  const aboutFields = ["kicker", "title", "text", "card1.title", "card1.text", "card2.title", "card2.text", "card3.title", "card3.text"];
  aboutFields.forEach(key => {
    const el = document.querySelector(`#about [data-i18n="about.${key}"]`);
    if (el) el.textContent = key.split(".").reduce((obj, part) => obj?.[part], about);
  });
  document.title = `${copy.eyebrow} — Dmitry Tal`;
  const heroAction = document.querySelector(".hero-actions a");
  if (heroAction) heroAction.href = window.location.pathname + "#" + (portfolioMode === "museums" ? "museum" : portfolioMode === "industrial" ? "industrial" : "projects");
}
function fixSectionLinks() {
  // <base href="../"> keeps shared assets working in subfolders;
  // explicit same-page URLs keep navigation on the selected portfolio route.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.setAttribute("href", window.location.pathname + a.getAttribute("href"));
  });
}
fixSectionLinks();

configurePortfolioLayout();

let translations = {};
let projects = [];
let museumProjects = [];
let industrialProjects = [];
let currentLang = localStorage.getItem("portfolioLang") || "en";

async function loadData(){
  const [translationsResponse, projectsResponse, museumResponse, industrialResponse] = await Promise.all([
    fetch("data/translations.json"),
    fetch("data/projects.json"),
    fetch("data/museum-projects.json"),
    fetch("data/industrial-projects.json")
  ]);
  translations = await translationsResponse.json();
  projects = await projectsResponse.json();
  museumProjects = await museumResponse.json();
  industrialProjects = await industrialResponse.json();
  renderProjects();
  applyLanguage(currentLang);
}

function t(key){
  return key.split(".").reduce((obj, part) => obj?.[part], translations[currentLang]) ?? key;
}

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem("portfolioLang", lang);

  document.documentElement.lang = lang;
  const rtl = lang === "he";
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  document.body.setAttribute("dir", rtl ? "rtl" : "ltr");

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = t(el.dataset.i18n);
  });

  

document.querySelectorAll("[data-lang]").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  applyPortfolioCopy(lang);
  renderProjects();
  renderMuseumProjects();
  renderIndustrialProjects();
}

function coverPath(project) {
  return project.image || "assets/images/word.svg";
}

let galleryItems = [];
let galleryIndex = 0;
let lastGalleryTrigger = null;

function projectScreenshots(project, isMuseum = false) {
  if (Array.isArray(project.screenshots) && project.screenshots.length) return project.screenshots.filter(Boolean);
  // Existing game cover can be viewed until additional screenshots are supplied.
  if (!isMuseum) return [coverPath(project)];
  return []; // Museum placeholders are not real screenshots.
}

function openGallery(project, isMuseum, trigger) {
  const images = projectScreenshots(project, isMuseum);
  if (!images.length) return;
  galleryItems = images;
  galleryIndex = 0;
  lastGalleryTrigger = trigger;
  document.getElementById("galleryTitle").textContent = project.title;
  document.getElementById("galleryModal").hidden = false;
  document.body.style.overflow = "hidden";
  updateGallery();
  document.getElementById("galleryClose").focus();
}
function updateGallery() {
  const image = document.getElementById("galleryImage");
  image.src = galleryItems[galleryIndex];
  image.alt = `${document.getElementById("galleryTitle").textContent} — ${galleryIndex + 1}`;
  document.getElementById("galleryCount").textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
  document.getElementById("galleryPrev").hidden = galleryItems.length < 2;
  document.getElementById("galleryNext").hidden = galleryItems.length < 2;
}
function shiftGallery(delta) {
  if (!galleryItems.length) return;
  galleryIndex = (galleryIndex + delta + galleryItems.length) % galleryItems.length;
  updateGallery();
}
function closeGallery() {
  document.getElementById("galleryModal").hidden = true;
  document.body.style.overflow = "";
  lastGalleryTrigger?.focus();
}
function createMediaActions(project, isMuseum = false) {
  const actions = document.createElement("div");
  actions.className = "project-actions";
  if (projectScreenshots(project, isMuseum).length) {
    const screenshots = document.createElement("button");
    screenshots.type = "button";
    screenshots.className = "button screenshots-button";
    screenshots.textContent = t("common.screenshots");
    screenshots.addEventListener("click", () => openGallery(project, isMuseum, screenshots));
    actions.appendChild(screenshots);
  }
  // Video action only exists if the project actually provides a video URL.
  if (typeof project.video === "string" && project.video.trim()) {
    const video = document.createElement("a");
    video.className = "button video-button";
    video.href = project.video;
    video.target = "_blank";
    video.rel = "noopener noreferrer";
    video.textContent = t("projects.watch");
    actions.appendChild(video);
  }
  return actions;
}

function makeProjectCard(project){
  const card = document.createElement("article");
  card.className = "project-card";
  card.innerHTML = `
    <img src="${coverPath(project)}" alt="${project.title}">
    <div class="project-body">
      <div class="project-title-row">
        <h3>${project.title}</h3>
        ${project.nda ? `<span class="nda-badge">🔒 ${t("projects.ndaBadge")}</span>` : ""}
      </div>
      <div class="tags">${project.tags.map(tag=>`<span>${tag}</span>`).join("")}</div>

      <div class="tabs">
        <button class="tab-btn active" type="button" data-tab="game">${t("projects.tabs.game")}</button>
        <button class="tab-btn" type="button" data-tab="role">${t("projects.tabs.role")}</button>
        <button class="tab-btn" type="button" data-tab="tech">${t("projects.tabs.tech")}</button>
      </div>

      <div class="tab-panel active" data-panel="game">${project.content[currentLang].game}</div>
      <div class="tab-panel" data-panel="role">${project.content[currentLang].role}</div>
      <div class="tab-panel" data-panel="tech">${project.content[currentLang].tech}</div>

    </div>`;

  const cover = card.querySelector(".project-card > img");
  cover.addEventListener("error", () => {
    if (cover.getAttribute("src") !== project.image) cover.src = project.image;
    else { cover.onerror = null; cover.src = "assets/images/museum.svg"; }
  });
  const buttons = card.querySelectorAll(".tab-btn");
  const panels = card.querySelectorAll(".tab-panel");
  buttons.forEach(btn=>{
    btn.addEventListener("click",()=>{
      buttons.forEach(b=>b.classList.remove("active"));
      panels.forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      card.querySelector(`[data-panel="${btn.dataset.tab}"]`)?.classList.add("active");
    });
  });

  card.querySelector(".project-body").appendChild(createMediaActions(project));

  return card;
}

function renderProjects(){
  if(!projects.length || !translations[currentLang]) return;
  const featured = document.getElementById("featuredProjects");
  const more = document.getElementById("moreProjects");
  featured.innerHTML = "";
  more.innerHTML = "";

  projects.filter(p=>p.featured).forEach(p=>featured.appendChild(makeProjectCard(p)));
  projects.filter(p=>!p.featured).forEach(p=>more.appendChild(makeProjectCard(p)));
}


function renderMuseumProjects() {
  renderInformationProjects("museumProjects", museumProjects, "museum");
}

function renderIndustrialProjects() {
  renderInformationProjects("industrialProjects", industrialProjects, "industrial");
}

function renderInformationProjects(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container || !translations[currentLang]) return;
  container.replaceChildren();
  items.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title;
    img.loading = "lazy";
    img.addEventListener("error", () => { img.onerror = null; img.src = type === "industrial" ? "assets/images/industrial.svg" : "assets/images/museum.svg"; });
    card.appendChild(img);
    const body = document.createElement("div");
    body.className = "project-body";
    const h3 = document.createElement("h3");
    h3.textContent = project.title;
    body.appendChild(h3);
    const tags = document.createElement("div");
    tags.className = "tags";
    project.tags.forEach(tag => {
      const span = document.createElement("span");
      span.textContent = tag;
      tags.appendChild(span);
    });
    body.appendChild(tags);
    const tabs = document.createElement("div");
    tabs.className = "tabs";
    const panels = [];
    ["game", "role", "tech"].forEach((key, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tab-btn" + (index === 0 ? " active" : "");
      button.textContent = t(type + ".tabs." + key);
      const panel = document.createElement("div");
      panel.className = "tab-panel" + (index === 0 ? " active" : "");
      panel.textContent = (project.content[currentLang] || project.content.en)[key];
      panels.push(panel);
      button.addEventListener("click", () => {
        tabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        button.classList.add("active");
        panel.classList.add("active");
      });
      tabs.appendChild(button);
    });
    body.appendChild(tabs);
    panels.forEach(panel => body.appendChild(panel));
    body.appendChild(createMediaActions(project, true));
    card.appendChild(body);
    container.appendChild(card);
  });
}


document.querySelectorAll("[data-lang]").forEach(btn=>{
  btn.addEventListener("click",()=>applyLanguage(btn.dataset.lang));
});

const moreButton = document.getElementById("moreProjectsButton");
const moreProjects = document.getElementById("moreProjects");
moreButton.addEventListener("click",()=>{
  const open = moreButton.getAttribute("aria-expanded") === "true";
  moreButton.setAttribute("aria-expanded", String(!open));
  moreProjects.hidden = open;
  moreButton.querySelector("[data-i18n]").textContent = open ? t("projects.more") : t("projects.less");
});

document.querySelectorAll("[data-close-modal]").forEach(el=>{
  el.addEventListener("click",()=>{
    document.getElementById("videoModal").hidden = true;
    document.body.style.overflow = "";
  });
});

document.addEventListener("keydown",e=>{
  if(e.key === "Escape"){
    document.getElementById("videoModal").hidden = true;
    document.body.style.overflow = "";
  }
});

document.querySelectorAll("[data-close-gallery]").forEach(el => el.addEventListener("click", closeGallery));
document.getElementById("galleryPrev").addEventListener("click", () => shiftGallery(-1));
document.getElementById("galleryNext").addEventListener("click", () => shiftGallery(1));
document.addEventListener("keydown", e => {
  if (document.getElementById("galleryModal").hidden) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowLeft") shiftGallery(-1);
  if (e.key === "ArrowRight") shiftGallery(1);
});

document.getElementById("year").textContent = new Date().getFullYear();

loadData().catch(err=>{
  console.error(err);
  alert("The site data could not be loaded. For local preview, use a small local server or GitHub Pages.");
});
