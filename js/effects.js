document.addEventListener('DOMContentLoaded', function () {
  // 0. Page Loader Ticker (Flashing initiatives on first enter)
  var loader = document.getElementById('siteLoader');
  var ticker = document.getElementById('loaderTicker');
  
  if (loader && ticker) {
    var initiatives = [
      "1978 · PIONEERING REGIONAL CINEMASCOPE...",
      "1982 · SHOOTING FIRST DOMESTIC 70MM...",
      "1984 · RELEASING FIRST STEREOSCOPIC 3D...",
      "1984 · ROTATING MECHANICAL 3D ROOM SET...",
      "1987 · BUILDING FIRST THEME PARK...",
      "1992 · INTRODUCING DIGITAL NON-LINEAR EDITING...",
      "LOADING ARCHIVE RECORDS..."
    ];
    
    var stepDelay = 500; // ms per ticker step
    var tickerIndex = 0;
    
    function showNextInitiative() {
      if (tickerIndex < initiatives.length) {
        ticker.classList.add('fade');
        setTimeout(function () {
          ticker.textContent = initiatives[tickerIndex];
          ticker.classList.remove('fade');
          tickerIndex++;
          setTimeout(showNextInitiative, stepDelay);
        }, 150);
      } else {
        setTimeout(function () {
          loader.classList.add('fade-out');
        }, 400);
      }
    }
    
    // Check if loader has run in this session to bypass load wait
    if (sessionStorage.getItem('site-loader-shown')) {
      loader.classList.add('fade-out');
    } else {
      sessionStorage.setItem('site-loader-shown', 'true');
      setTimeout(showNextInitiative, 500);
    }
  }

  // 0B. Global Film Grain Overlay
  var grainOverlay = document.createElement('div');
  grainOverlay.className = 'global-grain';
  document.body.appendChild(grainOverlay);



  // 1. Futuristic Cursor Glow Tracker
  var glowEl = document.createElement('div');
  glowEl.className = 'cursor-glow';
  glowEl.style.opacity = '0';
  document.body.appendChild(glowEl);

  window.addEventListener('mousemove', function (e) {
    glowEl.style.left = e.clientX + 'px';
    glowEl.style.top = e.clientY + 'px';
    glowEl.style.opacity = '1';
  });

  document.addEventListener('mouseleave', function () {
    glowEl.style.opacity = '0';
  });

  // Expand cursor glow on hover over interactive elements
  function addGlowActive() { glowEl.classList.add('active'); }
  function removeGlowActive() { glowEl.classList.remove('active'); }

  var interactives = document.querySelectorAll('a, button, [role="button"], .milestone, .project-card, .blog-post-card, .stat-card');
  interactives.forEach(function (el) {
    el.addEventListener('mouseenter', addGlowActive);
    el.addEventListener('mouseleave', removeGlowActive);
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

  // 3. Smooth Parallax Scroll sync & RequestAnimationFrame Loop
  var sprocketRails = document.querySelectorAll('.sprockets');
  var milestoneRail = document.getElementById('milestoneRail');
  var heroBgLayers = document.querySelectorAll('.hero-bg-layer');
  var heroText = document.querySelector('.hero > .reveal');
  
  var lastScrollY = -1;
  function updateScrollParallax() {
    var scrolled = window.scrollY;
    
    if (scrolled !== lastScrollY) {
      lastScrollY = scrolled;
      
      // Sprocket sync
      sprocketRails.forEach(function (rail, index) {
        var speed = (index % 2 === 0) ? 0.12 : -0.12;
        rail.style.transform = 'translateX(' + (scrolled * speed) + 'px)';
      });

      if (milestoneRail) {
        milestoneRail.style.setProperty('--sprocket-offset', (scrolled * 0.25) + 'px');
      }
      
      // Hero Background & Text Parallax
      heroBgLayers.forEach(function (bg) {
        bg.style.transform = 'translate3d(0, ' + (scrolled * 0.4) + 'px, 0)';
      });
      
      if (heroText) {
        heroText.style.transform = 'translate3d(0, ' + (scrolled * 0.15) + 'px, 0)';
        heroText.style.opacity = Math.max(0, 1 - (scrolled / 550));
      }
      
      // Viewport-based Image Parallax
      var viewportHeight = window.innerHeight;
      var parallaxImgs = document.querySelectorAll('.frame-photo, .project-photo img, .blog-post-thumb img, .history-photo-card img, .chapter-photo-wrap img');
      
      parallaxImgs.forEach(function (img) {
        var parent = img.parentElement;
        if (!parent) return;
        var rect = parent.getBoundingClientRect();
        
        // If image container is within the viewport
        if (rect.top < viewportHeight && rect.bottom > 0) {
          var elementTop = rect.top + scrolled;
          var relativeScroll = (scrolled + viewportHeight - elementTop) / (viewportHeight + rect.height);
          var translateVal = (relativeScroll - 0.5) * 45; // translate by up to 45px
          img.style.setProperty('--img-parallax', translateVal + 'px');
        }
      });
    }
    requestAnimationFrame(updateScrollParallax);
  }
  
  // Start scroll parallax loop
  requestAnimationFrame(updateScrollParallax);

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

  // 5. 3D Card Perspective Tilt and Spotlight Tracking
  var cards = document.querySelectorAll('.project-card, .blog-post-card, .stat-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      
      var xc = rect.width / 2;
      var yc = rect.height / 2;
      var dx = x - xc;
      var dy = y - yc;
      
      var rotateX = -(dy / yc) * 6; // up to 6 degrees tilt
      var rotateY = (dx / xc) * 6;
      
      card.style.transform = 'translateY(-6px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      card.style.transition = 'transform 100ms cubic-bezier(0.1, 0.8, 0.2, 1)';
      
      var img = card.querySelector('.project-photo img, .blog-post-thumb img');
      if (img) {
        img.style.transform = 'scale(1.22) translate3d(' + (dx / xc * -12) + 'px, ' + (dy / yc * -12) + 'px, 0)';
        img.style.transition = 'transform 100ms cubic-bezier(0.1, 0.8, 0.2, 1)';
      }
    });
    
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
      var img = card.querySelector('.project-photo img, .blog-post-thumb img');
      if (img) {
        img.style.transform = '';
        img.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  });

  // 6. Kakkanad 3D Gravity Room Exhibition Controller
  var currentAngle = 0;
  var activeMode = 'studio';
  
  var gravityRoom = document.getElementById('gravityRoom');
  var gravityChar = document.getElementById('gravityChar');
  var gravityIndicator = document.getElementById('gravityIndicator');
  var toggleBtns = document.querySelectorAll('.toggle-switch-wrapper .toggle-btn');
  var rotBtns = document.querySelectorAll('.rotation-btns .rot-btn');
  
  if (gravityRoom && gravityChar) {
    function applyGravityState() {
      // Update text indicator
      if (gravityIndicator) {
        if (activeMode === 'studio') {
          gravityIndicator.textContent = 'Studio Camera (Outside Set)';
        } else {
          gravityIndicator.textContent = 'Cinematic Camera (Inside Set)';
        }
      }
      
      // Update toggle buttons active state
      toggleBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.mode === activeMode);
      });
      
      // Update rotation buttons active state
      rotBtns.forEach(function (btn) {
        btn.classList.toggle('active', Number(btn.dataset.angle) === currentAngle);
      });
      
      if (activeMode === 'studio') {
        // Studio Mode: Room spins, character stays vertically upright relative to screen (gravity)
        gravityRoom.style.transform = 'rotateX(-12deg) rotateY(-18deg) rotateZ(' + currentAngle + 'deg)';
        gravityChar.style.transform = 'translate3d(0px, 130px, 0px) rotateZ(0deg)';
      } else {
        // Cinematic Mode: Room stays upright, character walks along the walls/ceiling
        gravityRoom.style.transform = 'rotateX(-12deg) rotateY(-18deg) rotateZ(0deg)';
        
        var tx = 0, ty = 130, tz = 0, rz = 0;
        if (currentAngle === 0) {
          tx = 0; ty = 130; rz = 0;
        } else if (currentAngle === 90) {
          tx = -130; ty = 0; rz = -90;
        } else if (currentAngle === 180) {
          tx = 0; ty = -130; rz = 180;
        } else if (currentAngle === 270) {
          tx = 130; ty = 0; rz = 90;
        }
        gravityChar.style.transform = 'translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px) rotateZ(' + rz + 'deg)';
      }
    }
    
    // Bind Perspective Toggle buttons
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeMode = btn.dataset.mode;
        applyGravityState();
      });
    });
    
    // Bind Rotation buttons
    rotBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentAngle = Number(btn.dataset.angle);
        applyGravityState();
      });
    });
    
    // Initial state render
    applyGravityState();
  }

  // 7. Kakkanad Engineering Desk Schematic Highlights
  var expertCards = document.querySelectorAll('.expert-card');
  var blueprintGroups = document.querySelectorAll('.blueprint-group');
  
  if (expertCards.length > 0 && blueprintGroups.length > 0) {
    function highlightBlueprintPart(partName) {
      blueprintGroups.forEach(function (group) {
        var matchId = 'part-' + partName;
        if (group.id === matchId) {
          group.classList.add('active');
        } else {
          group.classList.remove('active');
        }
      });
    }
    
    expertCards.forEach(function (card) {
      card.addEventListener('click', function () {
        // Toggle card active state
        expertCards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        
        // Highlight corresponding blueprint component
        var targetPart = card.dataset.part;
        highlightBlueprintPart(targetPart);
      });
    });
    
    // Highlight the default active card's component on start
    var defaultActiveCard = document.querySelector('.expert-card.is-active');
    if (defaultActiveCard) {
      highlightBlueprintPart(defaultActiveCard.dataset.part);
    }
  }
});
