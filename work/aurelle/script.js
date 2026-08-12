(function(){
"use strict";
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var body = document.body;

/* ---------- Preloader ---------- */
var preloader = document.getElementById("preloader");
var preDone = false;
function finishPreloader(){
  if(preDone) return; preDone = true;
  body.classList.add("loaded");
  if(preloader){ preloader.classList.add("preloader-done"); setTimeout(function(){ if(preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 800); }
}
if(reduced){ finishPreloader(); } else { setTimeout(finishPreloader, 1300); }

/* ---------- Header / progress / parallax ---------- */
var header = document.getElementById("site-header");
var progress = document.getElementById("scroll-progress");
var paraEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
var ticking = false;
function frame(){
  ticking = false;
  var y = window.scrollY || window.pageYOffset;
  header.classList.toggle("scrolled", y > 40);
  var doc = document.documentElement;
  var max = doc.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  if(!reduced && paraEls.length){
    var vh = window.innerHeight;
    paraEls.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.bottom < -120 || r.top > vh + 120) return;
      var f = parseFloat(el.getAttribute("data-parallax")) || 0.06;
      var off = (r.top + r.height / 2 - vh / 2) * f;
      el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
    });
  }
}
window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, {passive:true});
frame();

/* ---------- Reveal on scroll ---------- */
var revealEls = document.querySelectorAll(".reveal");
if(reduced || !("IntersectionObserver" in window)){
  revealEls.forEach(function(el){ el.classList.add("in"); });
}else{
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  revealEls.forEach(function(el){ io.observe(el); });
}

/* ---------- Counters ---------- */
function animateCount(el){
  var target = parseInt(el.getAttribute("data-count"), 10);
  var suffix = el.getAttribute("data-suffix") || "";
  if(reduced){ el.textContent = target + suffix; return; }
  var dur = 1600, t0 = null;
  function tick(t){
    if(t0 === null) t0 = t;
    var p = Math.min((t - t0) / dur, 1);
    var e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * e) + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
var counters = document.querySelectorAll(".stat-num");
if("IntersectionObserver" in window && !reduced){
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
  }, {threshold:.5});
  counters.forEach(function(el){ cio.observe(el); });
}else{
  counters.forEach(animateCount);
}

/* ---------- Stone tabs ---------- */
var tabs = Array.prototype.slice.call(document.querySelectorAll(".stone-tab"));
var panels = Array.prototype.slice.call(document.querySelectorAll(".stone-panel"));
function activateStone(id){
  tabs.forEach(function(t){
    var on = t.getAttribute("data-stone") === id;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on ? "true" : "false");
  });
  panels.forEach(function(p){ p.classList.toggle("active", p.getAttribute("data-panel") === id); });
}
tabs.forEach(function(t, i){
  t.addEventListener("click", function(){ activateStone(t.getAttribute("data-stone")); });
  t.addEventListener("keydown", function(ev){
    var dir = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    if(!dir) return;
    ev.preventDefault();
    var next = tabs[(i + dir + tabs.length) % tabs.length];
    next.focus(); activateStone(next.getAttribute("data-stone"));
  });
});

/* ---------- Lightbox ---------- */
var lb = document.getElementById("lightbox");
var lbImg = document.getElementById("lb-img");
var lbCap = document.getElementById("lb-cap");
function openLb(src, cap){
  lbImg.src = src; lbCap.textContent = cap || "";
  lb.classList.add("open"); body.classList.add("no-scroll");
}
function closeLb(){ lb.classList.remove("open"); body.classList.remove("no-scroll"); }
document.querySelectorAll("[data-lb]").forEach(function(el){
  function open(){ openLb(el.getAttribute("data-lb"), el.getAttribute("data-cap")); }
  el.addEventListener("click", open);
  el.addEventListener("keydown", function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); open(); } });
});
lb.addEventListener("click", function(e){ if(e.target === lb || e.target.closest(".lb-close")) closeLb(); });

/* ---------- Mobile menu ---------- */
var burger = document.getElementById("burger");
burger.addEventListener("click", function(){
  var open = body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  body.classList.toggle("no-scroll", open);
});
document.querySelectorAll("#mobile-menu a").forEach(function(a){
  a.addEventListener("click", function(){ body.classList.remove("menu-open"); body.classList.remove("no-scroll"); burger.setAttribute("aria-expanded","false"); });
});

/* ---------- Escape closes overlays ---------- */
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){ closeLb(); body.classList.remove("menu-open"); body.classList.remove("no-scroll"); }
});

/* ---------- Inquire buttons prefill ---------- */
var interestSel = document.getElementById("interest");
document.querySelectorAll("[data-inquire]").forEach(function(btn){
  btn.addEventListener("click", function(){
    var val = btn.getAttribute("data-inquire");
    if(interestSel){
      interestSel.value = val;
      interestSel.classList.add("flash");
      setTimeout(function(){ interestSel.classList.remove("flash"); }, 1600);
    }
  });
});

/* ---------- Active nav link ---------- */
var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
var sections = navLinks.map(function(l){ return document.querySelector(l.getAttribute("href")); }).filter(Boolean);
if("IntersectionObserver" in window){
  var nio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        navLinks.forEach(function(l){ l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id); });
      }
    });
  }, {rootMargin:"-40% 0px -55% 0px"});
  sections.forEach(function(s){ nio.observe(s); });
}

/* ---------- Inquiry form ---------- */
var form = document.getElementById("inquiry-form");
var panel = document.getElementById("form-panel");
form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = true;
  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var msg = document.getElementById("message");
  var fName = document.getElementById("f-name");
  var fEmail = document.getElementById("f-email");
  var fMsg = document.getElementById("f-msg");
  fName.classList.toggle("invalid", !(ok = name.value.trim().length > 1, ok));
  if(!ok) ok = false;
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  fEmail.classList.toggle("invalid", !emailOk);
  var msgOk = msg.value.trim().length > 5;
  fMsg.classList.toggle("invalid", !msgOk);
  if(ok && emailOk && msgOk){
    var label = interestSel.options[interestSel.selectedIndex].text;
    document.getElementById("success-text").textContent =
      "Merci, " + name.value.trim().split(" ")[0] + " — your inquiry regarding “" + label + "” is with the atelier. We reply within one working day.";
    panel.classList.add("sent");
  }
});

/* ---------- Newsletter ---------- */
var nlForm = document.getElementById("nl-form");
nlForm.addEventListener("submit", function(e){
  e.preventDefault();
  var em = document.getElementById("nl-email");
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())){
    nlForm.innerHTML = '<p class="nl-thanks">✦ Bienvenue — your first letter arrives with the next drop.</p>';
  }else{
    em.style.borderBottom = "1px solid #A4552E";
    setTimeout(function(){ em.style.borderBottom = ""; }, 1400);
  }
});

/* ---------- Cursor ring ---------- */
if(window.matchMedia("(pointer:fine)").matches && !reduced){
  body.classList.add("has-cursor");
  var ring = document.querySelector(".cursor-ring");
  var mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener("mousemove", function(e){ mx = e.clientX; my = e.clientY; });
  (function loop(){
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", function(e){
    ring.classList.toggle("big", !!e.target.closest("a,button,.stone-tab,.product-media,input,textarea,select"));
  });
}

/* ---------- Year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
})();