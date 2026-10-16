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

const portfolioCopy = {
  en: {
    games: ["UNITY GAMEPLAY DEVELOPER", "Original gameplay systems from concept to working prototype.", "Commercial gameplay prototypes, interactive museum installations and Unity projects in development."],
    museums: ["INTERACTIVE SYSTEMS DEVELOPER", "Interactive installations connecting people, software and hardware.", "Unity museum exhibits featuring body tracking, eye tracking, physical controls and device integration."],
    industrial: ["AUTOMATION SOFTWARE ENGINEER", "Industrial automation and interactive control systems.", "Experience with PLC, HMI, SCADA, C++, FBD, Modbus and software integration."]
  },
  ru: {
    games: ["UNITY GAMEPLAY DEVELOPER", "От идеи механики до рабочего игрового прототипа.", "Коммерческие игровые прототипы, музейные инсталляции и проекты на Unity."],
    museums: ["РАЗРАБОТЧИК ИНТЕРАКТИВНЫХ СИСТЕМ", "Интерактивные экспонаты на стыке программирования и оборудования.", "Музейные проекты на Unity: трекинг тела и взгляда, физические органы управления и интеграция устройств."],
    industrial: ["РАЗРАБОТЧИК ПО АВТОМАТИЗАЦИИ", "Промышленная автоматизация и системы управления.", "Опыт работы с PLC, HMI, SCADA, C++, FBD, Modbus и интеграцией программного обеспечения."]
  },
  he: {
    games: ["מפתח משחקים ב-UNITY", "ממכניקת משחק מקורית לאב־טיפוס עובד.", "אבות־טיפוס מסחריים, מיצגים אינטראקטיביים ופרויקטים ב-Unity."],
    museums: ["מפתח מערכות אינטראקטיביות", "מיצגים אינטראקטיביים המחברים אנשים, תוכנה וחומרה.", "מיצגים ב-Unity עם מעקב תנועה ומבט, בקרים פיזיים ושילוב חומרה."],
    industrial: ["מהנדס תוכנה לאוטומציה", "אוטומציה תעשייתית ומערכות בקרה.", "ניסיון עם PLC, HMI, SCADA, C++, FBD, Modbus ושילוב מערכות תוכנה."]
  }
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
  const copy = (portfolioCopy[lang] || portfolioCopy.en)[portfolioMode];
  ["eyebrow", "title", "text"].forEach((key, i) => {
    const el = document.querySelector(`.hero [data-i18n="hero.${key}"]`);
    if (el) el.textContent = copy[i];
  });
  const labels = {
    en: ["Industrial", "INDUSTRIAL AUTOMATION", "Industrial Automation & Control Systems", "PLC programming, HMI, SCADA, C++, FBD and Modbus. Detailed projects will be added later."],
    ru: ["АСУ", "ПРОМЫШЛЕННАЯ АВТОМАТИЗАЦИЯ", "Автоматизация и системы управления", "Программирование ПЛК, HMI, SCADA, C++, FBD и Modbus. Подробные проекты будут добавлены позже."],
    he: ["אוטומציה", "אוטומציה תעשייתית", "אוטומציה ומערכות בקרה", "תכנות PLC, HMI, SCADA, C++, FBD ו-Modbus. פרויקטים נוספים יתווספו בהמשך."]
  }[lang] || ["Industrial", "INDUSTRIAL AUTOMATION", "Industrial Automation & Control Systems", "PLC programming, HMI, SCADA, C++, FBD and Modbus. Detailed projects will be added later."];
  ['.main-nav [data-i18n="nav.industrial"]', '[data-i18n="industrial.kicker"]', '[data-i18n="industrial.title"]', '[data-i18n="industrial.text"]'].forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = labels[i];
  });
  document.title = `${copy[0]} — Dmitry Tal`;
}

configurePortfolioLayout();

let translations = {};
let projects = [];
let currentLang = localStorage.getItem("portfolioLang") || "en";

async function loadData(){
  const [translationsResponse, projectsResponse] = await Promise.all([
    fetch("data/translations.json"),
    fetch("data/projects.json")
  ]);
  translations = await translationsResponse.json();
  projects = await projectsResponse.json();
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
}

function makeProjectCard(project){
  const card = document.createElement("article");
  card.className = "project-card";
  card.innerHTML = `
    <img src="${project.image}" alt="${project.title}">
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

      <div class="project-actions">
        <button class="button video-button" type="button" data-title="${project.title}">
          ${t("projects.watch")}
        </button>
      </div>
    </div>`;

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

  card.querySelector(".video-button").addEventListener("click",()=>{
    document.getElementById("videoTitle").textContent = project.title;
    const modal = document.getElementById("videoModal");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  });

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

document.getElementById("year").textContent = new Date().getFullYear();

loadData().catch(err=>{
  console.error(err);
  alert("The site data could not be loaded. For local preview, use a small local server or GitHub Pages.");
});
