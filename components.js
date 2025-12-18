(function(){
  const instagram = "https://instagram.com/smin7459";
  const email = "wjs400@naver.com";
  const phone = "010-0000-0000"; // TODO: 실제 번호로 교체

  // ensure layout exists
  let layout = document.querySelector(".layout");
  if (!layout){
    layout = document.createElement("div");
    layout.className = "layout";

    // move existing body children into content wrapper (safe)
    const content = document.createElement("main");
    content.className = "content";
    while (document.body.firstChild) content.appendChild(document.body.firstChild);

    document.body.appendChild(layout);
    layout.appendChild(document.createElement("aside"));
    layout.appendChild(content);
  }

  // Sidebar
  const sidebar = document.querySelector(".sidebar") || document.querySelector("aside");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <button id="brandTitle" class="brand-btn" aria-label="dichotomiccc (triple click)">
      dichotomiccc
    </button>

    <nav class="nav" aria-label="Sidebar navigation">
      <div class="nav-group">
        <div class="nav-title">dichotomic_smin</div>
        <a href="./works/identity.html">works / identity</a>
        <a href="./works/editorial.html">works / editorial</a>
        <a href="./works/graphic.html">works / graphic</a>
        <a href="./works/motion.html">works / motion</a>
      </div>

      <div class="nav-group" style="margin-top:6px;">
        <div class="nav-title">dichotomic_limin</div>
        <a href="#" id="liminLink">external site → (preparing)</a>
      </div>
    </nav>

    <div class="sidebar-bottom">
      <a href="${instagram}" target="_blank" rel="noreferrer">instagram @dichotomiccc</a>
      <a href="mailto:${email}">${email}</a>
    </div>
  `;

  // Footer (common)
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="left">
      <span>Instagram: <a href="${instagram}" target="_blank" rel="noreferrer">@dichotomiccc</a></span>
      <span>Email: <a href="mailto:${email}">${email}</a></span>
      <span>Contact: <span id="phone">${phone}</span></span>
    </div>
    <div class="right">© 2026 dichotomiccc. All rights reserved.</div>
  `;
  document.body.appendChild(footer);

  // limin placeholder
  const liminLink = document.getElementById("liminLink");
  if (liminLink){
    liminLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("dichotomic_limin external site is preparing.");
    });
  }
})();
