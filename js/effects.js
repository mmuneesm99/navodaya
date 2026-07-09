document.addEventListener('DOMContentLoaded', function () {
  // Shared emitter references for Kuttichathan magical gravity dust
  var heroSparkleEmitter = null;
  var lastMobileSparkleTime = 0;

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
  var heroTitle = document.querySelector('.hero h1');
  
  var lastScrollY = -1;
  var mouseHeroX = 0;
  var mouseHeroY = 0;
  var currentMouseHeroX = 0;
  var currentMouseHeroY = 0;
  
  // Mousemove listener for Hero section 3D perspective tilt & Kuttichathan magic sparkles
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    var lastSparkleTime = 0;
    
    function spawnSparkle(x, y, customVx, customVy) {
      var sparkle = document.createElement('div');
      sparkle.className = 'magic-sparkle';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      
      var rz = (Math.random() - 0.5) * 300; // depth range -150px to +150px
      var vx = customVx !== undefined ? customVx + (Math.random() - 0.5) * 35 : (Math.random() - 0.5) * 80;
      var vy = customVy !== undefined ? customVy + (Math.random() - 0.5) * 35 : (Math.random() - 0.5) * 80 - 25;
      var finalZ = rz + (Math.random() - 0.5) * 80; // drift Z coordinate
      
      heroSection.appendChild(sparkle);
      
      // Force initial layout paint state with 3D depth translation
      sparkle.style.transform = 'translate3d(0, 0, ' + rz + 'px) scale(1.2)';
      sparkle.style.opacity = '1';
      
      // Defer transition modifications to secondary paint cycle
      setTimeout(function () {
        sparkle.style.transform = 'translate3d(' + vx + 'px, ' + vy + 'px, ' + finalZ + 'px) scale(0.1)';
        sparkle.style.opacity = '0';
      }, 20);
      
      setTimeout(function () {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
    
    // Assign shared emitter reference
    heroSparkleEmitter = spawnSparkle;

    heroSection.addEventListener('mousemove', function (e) {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      var rect = heroSection.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var xc = rect.width / 2;
      var yc = rect.height / 2;
      mouseHeroX = (x - xc) / xc;
      mouseHeroY = (y - yc) / yc;
      
      var now = Date.now();
      if (now - lastSparkleTime > 40) {
        spawnSparkle(x, y);
        lastSparkleTime = now;
      }
    });
    
    heroSection.addEventListener('mouseleave', function () {
      mouseHeroX = 0;
      mouseHeroY = 0;
    });
  }
  
  function updateScrollParallax() {
    var scrolled = window.scrollY;
    
    // Smoothly ease mouse/gyro coordinates
    currentMouseHeroX += (mouseHeroX - currentMouseHeroX) * 0.12;
    currentMouseHeroY += (mouseHeroY - currentMouseHeroY) * 0.12;
    
    // Sprocket sync (runs on scroll change)
    if (scrolled !== lastScrollY) {
      sprocketRails.forEach(function (rail, index) {
        var speed = (index % 2 === 0) ? 0.12 : -0.12;
        rail.style.transform = 'translateX(' + (scrolled * speed) + 'px)';
      });

      if (milestoneRail) {
        milestoneRail.style.setProperty('--sprocket-offset', (scrolled * 0.25) + 'px');
      }
    }
    
    // Hero 3D Perspective & Chromatic Aberration (runs always to allow smooth easing)
    var bgScrollY = scrolled * 0.4;
    var bgOffsetX = -currentMouseHeroX * 30; // slide background up to 30px
    var bgOffsetY = -currentMouseHeroY * 20; // slide background up to 20px
    
    heroBgLayers.forEach(function (bg) {
      bg.style.transform = 'translate3d(' + bgOffsetX + 'px, ' + (bgScrollY + bgOffsetY) + 'px, 0)';
    });
    
    if (heroText) {
      var textScrollY = scrolled * 0.15;
      var rx = -currentMouseHeroY * 10; // X axis tilt
      var ry = currentMouseHeroX * 12;  // Y axis tilt
      heroText.style.transform = 'translate3d(0, ' + textScrollY + 'px, 0) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      heroText.style.opacity = Math.max(0, 1 - (scrolled / 550));
    }
    
    if (heroTitle) {
      var ax = currentMouseHeroX * 12; // 12px split
      var ay = currentMouseHeroY * 5;  // 5px split
      heroTitle.style.setProperty('--anaglyph-x', ax + 'px');
      heroTitle.style.setProperty('--anaglyph-y', ay + 'px');
      
      var px = -currentMouseHeroX * 18; // 18px horizontal pop
      var py = -currentMouseHeroY * 18; // 18px vertical pop
      heroTitle.style.setProperty('--poster-shadow-x', px + 'px');
      heroTitle.style.setProperty('--poster-shadow-y', py + 'px');
    }
    
    // Viewport-based Image Parallax (runs on scroll change)
    if (scrolled !== lastScrollY) {
      lastScrollY = scrolled;
      
      var viewportHeight = window.innerHeight;
      var parallaxImgs = document.querySelectorAll('.frame-photo, .project-photo img, .blog-post-thumb img, .history-photo-card img, .chapter-photo-wrap img');
      
      parallaxImgs.forEach(function (img) {
        var parent = img.parentElement;
        if (!parent) return;
        var rect = parent.getBoundingClientRect();
        
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
      
      // Update console telemetry tags
      var telemetryPerspective = document.getElementById('telemetryPerspective');
      var telemetryAngle = document.getElementById('telemetryAngle');
      if (telemetryPerspective) {
        telemetryPerspective.textContent = activeMode.toUpperCase();
      }
      if (telemetryAngle) {
        telemetryAngle.textContent = currentAngle + '°';
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

  // 8. Mobile Device Orientation Parallax (Gyroscope Tilt)
  var lastBeta = 0;
  var lastGamma = 0;
  var isOrientationBound = false;
  
  function handleOrientation(e) {
    if (e.beta === null || e.gamma === null) return;
    
    // Normalize holding angles (pitch beta: ~45deg default, roll gamma: ~0deg default)
    var targetBeta = Math.max(15, Math.min(e.beta, 75));
    var targetGamma = Math.max(-30, Math.min(e.gamma, 30));
    
    var db = targetBeta - 45;
    var dg = targetGamma;
    
    // Push updates to the global hero tracking coordinates
    mouseHeroX = dg / 30; // value between -1 and 1
    mouseHeroY = db / 30; // value between -1 and 1
    
    // Spawn gravity sparkles inside Hero section on mobile tilt
    if (heroSparkleEmitter && heroSection) {
      var now = Date.now();
      if (now - lastMobileSparkleTime > 150) {
        var rx = Math.random() * heroSection.clientWidth;
        var ry = Math.random() * heroSection.clientHeight;
        var driftVx = dg * 1.5;
        var driftVy = db * 1.5 - 15; // drift in direction of tilt
        heroSparkleEmitter(rx, ry, driftVx, driftVy);
        lastMobileSparkleTime = now;
      }
    }
    
    // Smooth transition filtering
    lastBeta += (db - lastBeta) * 0.12;
    lastGamma += (dg - lastGamma) * 0.12;
    
    var tiltCards = document.querySelectorAll('.project-card, .blog-post-card, .stat-card');
    tiltCards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var rx = -lastBeta * 0.25; // X-axis tilt
        var ry = lastGamma * 0.25;  // Y-axis tilt
        
        card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        card.style.transition = 'transform 150ms cubic-bezier(0.1, 0.8, 0.2, 1)';
        
        var img = card.querySelector('.project-photo img, .blog-post-thumb img');
        if (img) {
          var tx = -lastGamma * 0.5;
          var ty = -lastBeta * 0.5;
          img.style.transform = 'scale(1.15) translate3d(' + tx + 'px, ' + ty + 'px, 0)';
          img.style.transition = 'transform 150ms cubic-bezier(0.1, 0.8, 0.2, 1)';
        }
      }
    });
  }

  function bindOrientationEvents() {
    if (isOrientationBound) return;
    window.addEventListener('deviceorientation', handleOrientation);
    isOrientationBound = true;
  }

  function initOrientationPermissions() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('click', function requestIOSPermission() {
        DeviceOrientationEvent.requestPermission()
          .then(function (response) {
            if (response === 'granted') {
              bindOrientationEvents();
            }
          })
          .catch(console.error);
        document.removeEventListener('click', requestIOSPermission);
      });
    } else {
      bindOrientationEvents();
    }
  }

  // Attach gyroscope sensors only on mobile touch screens (coarse pointer)
  if (window.matchMedia("(pointer: coarse)").matches) {
    initOrientationPermissions();
  }
});
