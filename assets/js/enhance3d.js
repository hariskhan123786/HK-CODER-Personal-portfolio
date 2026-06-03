/**
 * HK-Portfolio — 3D Enhancement JavaScript
 * Features: Particle Canvas, 3D Tilt Cards, Floating Orbs, Neon Cursor
 * Pure Vanilla JS — no dependencies
 */

(function () {
  'use strict';

  /* ============================================================
     PARTICLE CANVAS — Interactive Network
     ============================================================ */
  class ParticleNetwork {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null, radius: 140 };
      this.colors = ['#18d26e', '#0ca853', '#7dffb3', '#ffffff'];
      this.count = this._getCount();
      this.animId = null;

      this._resize();
      this._initParticles();
      this._bindEvents();
      this._animate();
    }

    _getCount() {
      const area = window.innerWidth * window.innerHeight;
      return Math.min(Math.floor(area / 10000), 110);
    }

    _resize() {
      this.canvas.width  = this.canvas.offsetWidth  || window.innerWidth;
      this.canvas.height = this.canvas.offsetHeight || window.innerHeight;
    }

    _initParticles() {
      this.particles = [];
      for (let i = 0; i < this.count; i++) {
        this.particles.push(this._makeParticle());
      }
    }

    _makeParticle() {
      const radius = Math.random() * 2.5 + 0.5;
      return {
        x:   Math.random() * this.canvas.width,
        y:   Math.random() * this.canvas.height,
        vx:  (Math.random() - 0.5) * 0.55,
        vy:  (Math.random() - 0.5) * 0.55,
        r:   radius,
        alpha: Math.random() * 0.5 + 0.3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      };
    }

    _bindEvents() {
      window.addEventListener('resize', () => {
        this._resize();
        this.count = this._getCount();
        this._initParticles();
      });

      this.canvas.closest('section')?.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      document.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    _drawParticle(p) {
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha + Math.sin(p.pulse) * 0.15;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.min(Math.max(alpha, 0.1), 0.9);
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.shadowBlur = 0;
    }

    _connectParticles() {
      const maxDist = 130;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.35;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);

            // gradient line
            const grad = this.ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(24,210,110,${opacity})`);
            grad.addColorStop(1, `rgba(12,168,83,${opacity * 0.5})`);
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 0.7;
            this.ctx.stroke();
          }
        }
      }
    }

    _repelFromMouse(p) {
      if (this.mouse.x === null) return;
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius && dist > 0) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.vx += (dx / dist) * force * 0.8;
        p.vy += (dy / dist) * force * 0.8;
      }
      // dampen velocity
      p.vx *= 0.97;
      p.vy *= 0.97;
    }

    _update(p) {
      this._repelFromMouse(p);
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;
    }

    _animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this._connectParticles();
      this.particles.forEach(p => {
        this._update(p);
        this._drawParticle(p);
      });
      this.animId = requestAnimationFrame(() => this._animate());
    }

    destroy() {
      if (this.animId) cancelAnimationFrame(this.animId);
    }
  }

  /* ============================================================
     3D TILT CARD — Mouse Parallax Effect
     ============================================================ */
  class TiltCard {
    constructor(el) {
      this.el = el;
      this.max = parseFloat(el.dataset.tiltMax) || 12;
      this.glare = el.dataset.tiltGlare !== 'false';
      this._addGlare();
      this._bind();
    }

    _addGlare() {
      if (!this.glare) return;
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      glare.style.cssText = `
        position: absolute; inset: 0; border-radius: inherit;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, transparent 60%);
        opacity: 0; transition: opacity 0.3s ease; pointer-events: none; z-index: 1;
      `;
      this.el.style.position = 'relative';
      this.el.style.overflow = 'hidden';
      this.el.appendChild(glare);
      this.glareEl = glare;
    }

    _bind() {
      this.el.addEventListener('mousemove', (e) => this._onMove(e));
      this.el.addEventListener('mouseleave', () => this._onLeave());
      this.el.addEventListener('mouseenter', () => this._onEnter());
    }

    _onEnter() {
      this.el.style.transition = 'transform 0.15s ease, box-shadow 0.3s ease';
      if (this.glareEl) this.glareEl.style.opacity = '1';
    }

    _onMove(e) {
      const rect = this.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (dy / (rect.height / 2)) * this.max;
      const ry = -(dx / (rect.width / 2)) * this.max;

      this.el.style.transition = 'transform 0.05s ease, box-shadow 0.3s ease';
      this.el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03, 1.03, 1.03)`;
      this.el.style.boxShadow = `
        ${-ry * 1.5}px ${rx * 1.5}px 40px rgba(0,0,0,0.5),
        0 0 30px rgba(24,210,110,0.15)
      `;

      if (this.glareEl) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        this.glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, transparent 65%)`;
      }
    }

    _onLeave() {
      this.el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease';
      this.el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      this.el.style.boxShadow = '';
      if (this.glareEl) this.glareEl.style.opacity = '0';
    }
  }

  /* ============================================================
     NEON CURSOR TRAIL
     ============================================================ */
  class NeonCursor {
    constructor() {
      this.dots = [];
      this.count = 8;
      this.mouse = { x: 0, y: 0 };
      this._create();
      this._bind();
    }

    _create() {
      const container = document.createElement('div');
      container.id = 'neon-cursor-trail';
      container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999998;overflow:hidden;';
      document.body.appendChild(container);

      for (let i = 0; i < this.count; i++) {
        const dot = document.createElement('div');
        const size = (this.count - i) * 3 + 2;
        dot.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          border-radius: 50%;
          background: rgba(24,210,110,${0.9 - i * 0.1});
          box-shadow: 0 0 ${size * 2}px rgba(24,210,110,${0.5 - i * 0.06});
          transform: translate(-50%,-50%);
          transition: left ${0.05 + i * 0.04}s ease, top ${0.05 + i * 0.04}s ease;
          pointer-events: none;
          opacity: 0;
        `;
        container.appendChild(dot);
        this.dots.push(dot);
      }
    }

    _bind() {
      document.addEventListener('mousemove', (e) => {
        this.dots.forEach((dot, i) => {
          dot.style.left = e.clientX + 'px';
          dot.style.top  = e.clientY + 'px';
          dot.style.opacity = '1';
        });
      });

      document.addEventListener('mouseleave', () => {
        this.dots.forEach(d => d.style.opacity = '0');
      });
    }
  }

  /* ============================================================
     FLOATING ORBS ENHANCER — adds movement on scroll
     ============================================================ */
  function initOrbParallax() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const factor = (i + 1) * 0.12;
          orb.style.transform = `translateY(${scrollY * factor}px)`;
        });
        ticking = false;
      });
    });
  }

  /* ============================================================
     COUNTER GLOW — pulse glow on counter end
     ============================================================ */
  function initCounterGlow() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.purecounter').forEach(el => {
        const val = parseInt(el.textContent);
        const max = parseInt(el.dataset.purecounterEnd);
        if (val === max && !el.dataset.glowed) {
          el.dataset.glowed = '1';
          el.style.animation = 'counterGlowPop 0.6s ease forwards';
        }
      });
    });

    document.querySelectorAll('.purecounter').forEach(el => {
      observer.observe(el, { childList: true, subtree: true, characterData: true });
    });

    // inject keyframe
    const style = document.createElement('style');
    style.textContent = `
      @keyframes counterGlowPop {
        0%   { text-shadow: 0 0 10px #18d26e; transform: scale(1); }
        50%  { text-shadow: 0 0 30px #18d26e, 0 0 60px rgba(24,210,110,0.5); transform: scale(1.15); }
        100% { text-shadow: 0 0 15px #18d26e, 0 0 30px rgba(24,210,110,0.3); transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     SECTION ENTRANCE — enhanced AOS supplement
     ============================================================ */
  function initSectionGlowLines() {
    document.querySelectorAll('section, .section').forEach(sec => {
      if (sec.querySelector('.section-glow-line')) return;
      const line = document.createElement('div');
      line.className = 'section-glow-line';
      sec.insertBefore(line, sec.firstChild);
    });
  }

  /* ============================================================
     HERO CANVAS SETUP (index.html)
     ============================================================ */
  function initHeroCanvas() {
    const heroSection = document.querySelector('#hero');
    if (!heroSection) return;

    // Apply dark gradient background (bg image was removed; character card handles the visual)
    heroSection.style.background = 'linear-gradient(135deg, #020d07 0%, #031a0e 40%, #040f0a 70%, #020c07 100%)';

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';

    // Create orb container
    const orbContainer = document.createElement('div');
    orbContainer.className = 'orb-container';
    orbContainer.innerHTML = `
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    `;

    heroSection.insertBefore(orbContainer, heroSection.firstChild);
    heroSection.insertBefore(canvas, orbContainer.nextSibling);

    // Size canvas
    function sizeCanvas() {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    new ParticleNetwork('particles-canvas');
  }

  /* ============================================================
     TILT INIT — auto-apply to matching elements
     ============================================================ */
  function initTiltCards() {
    const selectors = [
      '.services .service-item',
      '.stats .stats-item',
      '.portfolio .portfolio-content',
      '.interests .features-item',
      '.tilt-card',
    ];

    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('tilt-card');
        new TiltCard(el);
      });
    });
  }

  /* ============================================================
     ADD GLASS CLASS TO ELEMENTS
     ============================================================ */
  function initGlassElements() {
    // testimonial items
    document.querySelectorAll('.testimonial-item').forEach(el => {
      el.classList.add('glass-card');
    });
  }

  /* ============================================================
     INIT — runs on DOMContentLoaded
     ============================================================ */
  function init() {
    initHeroCanvas();
    initTiltCards();
    initGlassElements();
    initOrbParallax();
    initCounterGlow();
    initSectionGlowLines();

    // Neon cursor — only on desktop
    if (!window.matchMedia('(hover: none)').matches && window.innerWidth > 768) {
      new NeonCursor();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
