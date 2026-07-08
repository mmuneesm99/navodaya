document.addEventListener('DOMContentLoaded', function () {
  // 0. Global Film Grain Overlay
  var grainOverlay = document.createElement('div');
  grainOverlay.className = 'global-grain';
  document.body.appendChild(grainOverlay);



  // 1. Futuristic Cursor Glow Tracker
  var glowEl = document.createElement('div');
  glowEl.className = 'cursor-glow';
  document.body.appendChild(glowEl);

  window.addEventListener('mousemove', function (e) {
    glowEl.style.left = e.clientX + 'px';
    glowEl.style.top = e.clientY + 'px';
  });

  // 2. Responsive Scroll Reveal Controller
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // 3. Sprockets Scroll Sync (Horizontal film strip slide)
  var sprocketRails = document.querySelectorAll('.sprockets');
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    
    sprocketRails.forEach(function (rail, index) {
      var speed = (index % 2 === 0) ? 0.12 : -0.12;
      rail.style.transform = 'translateX(' + (scrolled * speed) + 'px)';
    });

    var railEl = document.getElementById('milestoneRail');
    if (railEl) {
      railEl.style.setProperty('--sprocket-offset', (scrolled * 0.25) + 'px');
    }
  });

  // 4. Background Dust / Embers Particle System (Generative Vintage overlay)
  var canvas = document.createElement('canvas');
  canvas.className = 'ambient-particles';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var particles = [];
  var count = 30;
  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.8,
      vx: -0.15 + Math.random() * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      alpha: 0.08 + Math.random() * 0.25
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < count; i++) {
      var p = particles[i];
      p.y += p.vy;
      p.x += p.vx;
      
      // If particle drifts out of screen, reset to bottom
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10 || p.x > w + 10) {
        p.x = Math.random() * w;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(197, 168, 128, ' + p.alpha + ')'; // Amber celluloid color
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
});
