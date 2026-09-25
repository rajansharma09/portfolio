document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  const setHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  }));

  const roles = ["web.", "systems.", "interfaces.", "momentum."];
  const typeTarget = document.getElementById("typed-role");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const type = () => {
    if (!typeTarget || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const current = roles[roleIndex];
    typeTarget.textContent = deleting ? current.slice(0, --charIndex) : current.slice(0, ++charIndex);
    let delay = deleting ? 55 : 105;
    if (!deleting && charIndex === current.length) { delay = 1550; deleting = true; }
    if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 260; }
    window.setTimeout(type, delay);
  };
  window.setTimeout(type, 600);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  document.querySelectorAll(".tilt-card").forEach(card => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    card.addEventListener("pointermove", event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -7}deg)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  const form = document.getElementById("form");
  const button = document.getElementById("button");
  const status = document.getElementById("form-status");
  if (window.emailjs) emailjs.init({ publicKey: "CAobN5GpVJihuwv4A" });
  form?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    button.disabled = true;
    button.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
    status.textContent = "";
    try {
      if (!window.emailjs) throw new Error("Email service unavailable");
      await emailjs.sendForm("default_service", "template_zq7stzr", form);
      form.reset();
      status.textContent = "Message sent — I’ll get back to you soon.";
    } catch (error) {
      status.textContent = "That didn’t send. Please email me directly instead.";
    } finally {
      button.disabled = false;
      button.innerHTML = 'Send message <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>';
    }
  });

  const canvas = document.getElementById("constellation");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const context = canvas.getContext("2d");
  const pointer = { x: -1000, y: -1000 };
  let particles = [];
  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(55, Math.floor(window.innerWidth / 22));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.2 + .3
    }));
  };
  const draw = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      if (Math.hypot(dx, dy) < 125) { particle.x -= dx * .004; particle.y -= dy * .004; }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = "rgba(215,255,63,.45)";
      context.fill();
    });
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const first = particles[i];
        const second = particles[j];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance < 120) {
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.strokeStyle = `rgba(157,108,255,${.15 * (1 - distance / 120)})`;
          context.lineWidth = .6;
          context.stroke();
        }
      }
    }
    window.requestAnimationFrame(draw);
  };
  window.addEventListener("pointermove", event => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
});
