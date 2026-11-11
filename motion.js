/* motion.js: adds animation and the full certifications list to the portfolio. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js-motion");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Certificates. Format: "Title|Issuer|Date (optional)". Edit freely. ---------- */
  var DATA = {
    "Coursera": [
      "Introduction to Relational Databases (RDBMS)|IBM|Jul 2026",
      "Introduction to Data Engineering|IBM|May 2026",
      "Automating Real-World Tasks with Python|Google|Jan 2026",
      "Crash Course on Python|Google|Jan 2026",
      "Basic Information Literacy|SUNY",
      "Data Science Math Skills|Duke University",
      "Excel Fundamentals for Data Analysis|Macquarie University",
      "Data Literacy|4EU+ Alliance / MTN Online Academy"
    ],
    "HP LIFE": ["3D Printing", "Agile Project Management", "AI for Beginners", "AI for Business Professionals", "Basics of Finance", "Business Communications", "Business Email", "Cash Flow", "Circular Economy", "Critical Thinking in the AI Era", "Customer Experience (CX) for Business Success", "Customer Relationship Management", "Data Science & Analytics", "Design Thinking", "Effective Business Websites", "Effective Leadership", "Effective Presentations", "Finding Funding", "Growth Engine for Your Business", "Introduction to Cybersecurity Awareness", "Introduction to Digital Business Skills", "Inventory Management", "IT for Business Success", "Marketing Benefits vs. Features", "Professional Networking for Career Growth", "Profit and Loss", "Social Entrepreneurship", "Social Media Marketing", "Starting a Small Business", "Strategic Planning in the AI Age", "Success Mindset", "The Art of Sales: Fundamentals of Selling", "Unique Value Proposition", "Your Target Audience"],
    "LinkedIn Learning": ["Build Your Generative AI Productivity Skills with Microsoft and LinkedIn (learning path)", "Career Essentials in Cybersecurity by Microsoft and LinkedIn (learning path)", "Professional Soft Skills Learning Pathway", "AI Productivity Hacks to Reimagine Your Workday and Career", "Banish Your Inner Critic to Unleash Creativity", "Basics of Data Visualization Analysis", "Building Resilience", "Communication Foundations", "Copilot in PowerPoint: From Prompt to Presentation", "Critical Thinking for Better Judgment and Decision-Making", "Cybersecurity Awareness: Cybersecurity Terminology", "Cybersecurity Foundations", "Developing Your Emotional Intelligence", "Effective Listening", "Embracing Unexpected Change", "Ethics in the Age of Generative AI", "Excel Statistics Essential Training: 1", "Generative AI Skills for Creative Content", "Introduction to Artificial Intelligence", "Introduction to Prompt Engineering for Generative AI", "Learning Data Analytics: 1 Foundations", "Learning Data Analytics Part 2", "Learning Data Visualization", "Learning Excel: Data Analysis", "Learning Microsoft 365 Copilot", "Microsoft Copilot for Security", "Persuading Others", "Power BI Essential Training", "Predictive Analytics Essential Training: Data Mining", "SQL: Data Reporting and Analysis", "Streamlining Your Work with Microsoft Copilot", "Tableau Essential Training", "Teamwork Foundations", "The Cybersecurity Threat Landscape", "The Non-Technical Skills of Effective Data Scientists", "Unconscious Bias", "What Is Generative AI?", "Why Trust Matters with Rachel Botsman", "Writing in Plain Language"],
    "Other": [
      "Data Science|Federal Government of Nigeria (3MTT)",
      "Data Analysis|The Incubator Hub (DSA)",
      "AI Career Essentials|ALX Africa",
      "Generative AI Master|Nigeria Learning Passport|Oct 2025",
      "Digital Ad Expert|Digital Marketing|Feb 2025",
      "HP LIFE eLearning Ambassador|HP LIFE",
      "English for IT 1|Cisco Networking Academy / OpenEDG",
      "English for IT 2|Cisco Networking Academy / OpenEDG",
      "Generative AI|Skills Academy",
      "Managing Data with Microsoft 365|Skills Academy",
      "HTML & CSS|Web design course|Sep 2023",
      "Certificate of National Service|NYSC"
    ]
  };
  var HL = ["Introduction to Relational Databases (RDBMS)", "Introduction to Data Engineering", "Automating Real-World Tasks with Python", "Crash Course on Python", "Data Science Math Skills", "Excel Fundamentals for Data Analysis", "Data Literacy", "Data Science", "Data Analysis", "AI Career Essentials", "Power BI Essential Training", "SQL: Data Reporting and Analysis", "Tableau Essential Training", "Career Essentials in Cybersecurity by Microsoft and LinkedIn (learning path)", "Build Your Generative AI Productivity Skills with Microsoft and LinkedIn (learning path)"];
  var ICON = { "Coursera": "🎓", "HP LIFE": "⚡", "LinkedIn Learning": "💼", "Other": "🏅" };
  var ISSUERS = ["IBM", "Google", "Duke University", "Macquarie University", "SUNY", "HP LIFE", "LinkedIn Learning", "Microsoft", "Cisco Networking Academy", "ALX Africa", "3MTT Nigeria", "Nigeria Learning Passport", "Skills Academy"];

  var items = [];
  Object.keys(DATA).forEach(function (g) {
    DATA[g].forEach(function (s) {
      var p = s.split("|");
      items.push({ t: p[0], i: p[1] || g, d: p[2] || "", g: g, h: HL.indexOf(p[0]) > -1 });
    });
  });

  /* ---------- Certifications section ---------- */
  var sec = $("#certs"), old = sec && $(".certs-grid", sec);
  if (old) {
    var filter = "Highlights", query = "";
    var tabs = ["Highlights", "All"].concat(Object.keys(DATA));
    var wrap = document.createElement("div");
    var mq = document.createElement("div"), track = document.createElement("div");
    mq.className = "cf-marquee"; track.className = "cf-track"; mq.setAttribute("aria-hidden", "true");
    ISSUERS.concat(ISSUERS).forEach(function (n) { var s = document.createElement("span"); s.textContent = n; track.appendChild(s); });
    mq.appendChild(track);
    var bar = document.createElement("div"); bar.className = "cf-bar"; bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Filter certificates");
    var inp = document.createElement("input"); inp.type = "search"; inp.className = "cf-search"; inp.placeholder = "Search certificates"; inp.setAttribute("aria-label", "Search certificates");
    var meta = document.createElement("p"); meta.className = "cf-meta"; meta.setAttribute("aria-live", "polite");
    var grid = document.createElement("div"); grid.className = "certs-grid";
    [mq, bar, inp, meta, grid].forEach(function (n) { wrap.appendChild(n); });
    old.parentNode.replaceChild(wrap, old);

    var inTab = function (x, tab) { return tab === "All" || (tab === "Highlights" ? x.h : x.g === tab); };
    var drawTabs = function () {
      bar.textContent = "";
      tabs.forEach(function (tab) {
        var b = document.createElement("button"); b.type = "button"; b.className = "cf-btn";
        b.setAttribute("aria-pressed", String(tab === filter)); b.textContent = tab;
        var n = document.createElement("small"); n.textContent = items.filter(function (x) { return inTab(x, tab); }).length; b.appendChild(n);
        b.onclick = function () { filter = tab; drawTabs(); drawList(); };
        bar.appendChild(b);
      });
    };
    var drawList = function () {
      grid.textContent = "";
      var term = query.trim().toLowerCase();
      var rows = items.filter(function (x) {
        return (term ? true : inTab(x, filter)) && (!term || (x.t + " " + x.i).toLowerCase().indexOf(term) > -1);
      });
      meta.textContent = term ? rows.length + " found across all certificates" : "Showing " + rows.length + " of " + items.length + " certificates";
      if (!rows.length) { var e = document.createElement("p"); e.className = "cf-empty"; e.textContent = "No certificates match your search. Try a shorter word."; grid.appendChild(e); return; }
      rows.forEach(function (x, n) {
        var c = document.createElement("div"); c.className = "cert-card cert-in" + (x.h ? " hl" : ""); c.style.setProperty("--i", Math.min(n, 24));
        var ic = document.createElement("div"); ic.className = "cert-icon"; ic.textContent = ICON[x.g];
        var box = document.createElement("div");
        var nm = document.createElement("div"); nm.className = "cert-name"; nm.textContent = x.t;
        var is = document.createElement("div"); is.className = "cert-issuer"; is.textContent = x.d ? x.i + ", " + x.d : x.i;
        box.appendChild(nm); box.appendChild(is); c.appendChild(ic); c.appendChild(box); grid.appendChild(c);
      });
    };
    inp.addEventListener("input", function () { query = inp.value; drawList(); });
    drawTabs(); drawList();
  }

  /* ---------- Count-up stats ---------- */
  var total = items.length;
  $$(".stat").forEach(function (st) {
    var n = $(".stat-num", st), l = ($(".stat-label", st) || {}).textContent || "";
    if (!n) return;
    var txt = n.textContent, target = parseInt(txt, 10), suf = txt.replace(/[0-9]/g, "");
    if (/certif/i.test(l)) { target = total; suf = ""; }
    if (/project/i.test(l)) { target = $$(".project-card").length; suf = ""; }
    n.dataset.t = target; n.dataset.s = suf;
    n.textContent = reduce ? target + suf : "0" + suf;
  });
  var stats = $(".hero-stats");
  if (stats && !reduce && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      so.disconnect();
      var t0 = performance.now();
      (function step(now) {
        var k = Math.min((now - t0) / 1600, 1), e = 1 - Math.pow(1 - k, 3);
        $$(".stat-num", stats).forEach(function (n) { n.textContent = Math.round(n.dataset.t * e) + n.dataset.s; });
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: 0.4 });
    so.observe(stats);
  }

  if (reduce) return;

  /* ---------- Typing effect on the hero tag ---------- */
  var tag = $(".hero-tag");
  if (tag) {
    var full = tag.textContent, i = 0;
    tag.textContent = ""; tag.classList.add("typing");
    setTimeout(function type() {
      tag.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(type, 38);
      else setTimeout(function () { tag.classList.remove("typing"); }, 1800);
    }, 500);
  }

  /* ---------- Scroll progress and hero parallax ---------- */
  var prog = document.createElement("div"); prog.className = "scroll-progress"; document.body.appendChild(prog);
  var hero = $(".hero-content"), ticking = false;
  var onScroll = function () {
    var y = window.scrollY, h = root.scrollHeight - window.innerHeight;
    prog.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (hero && y < window.innerHeight) { hero.style.transform = "translateY(" + y * 0.12 + "px)"; hero.style.opacity = Math.max(0, 1 - y / 750); }
    ticking = false;
  };
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Cursor glow (mouse devices only) ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    var g = document.createElement("div"); g.className = "cursor-glow"; document.body.appendChild(g);
    var x = window.innerWidth / 2, y2 = window.innerHeight / 2, tx = x, ty = y2;
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function follow() {
      x += (tx - x) * 0.12; y2 += (ty - y2) * 0.12;
      g.style.transform = "translate3d(" + (x - 210) + "px," + (y2 - 210) + "px,0)";
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- 3D tilt on project cards ---------- */
  $$(".project-card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.classList.add("tilt-on");
      c.style.transform = "perspective(900px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 8) + "deg) translateY(-4px)";
    });
    c.addEventListener("pointerleave", function () { c.style.transform = ""; c.classList.remove("tilt-on"); });
  });

  /* ---------- Section lines draw in ---------- */
  if ("IntersectionObserver" in window) {
    var lo = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("drawn"); lo.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$(".section-line").forEach(function (l) { lo.observe(l); });
  } else {
    $$(".section-line").forEach(function (l) { l.classList.add("drawn"); });
  }
})();
