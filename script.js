/* ═══════════════════════════════════════════════════════════
   BIRTHDAY SURPRISE WEBSITE — script.js
   
   Contains:
   1.  Floating hearts background animation
   2.  Navigation scroll effect + active link tracking
   3.  Mobile hamburger menu toggle
   4.  Smooth scrolling for nav links
   5.  Scroll reveal (IntersectionObserver)
   6.  Gallery lightbox open/close
   7.  Teddy bear head turning animation
   8.  Gift unlock / login validation logic
   9.  Confetti burst on unlock
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   Wait for the DOM to fully load before running any code
───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. FLOATING HEARTS BACKGROUND
     Creates heart emoji elements dynamically
     and animates them floating upward
     Runs on a repeating timer every 1.4 seconds
  ───────────────────────────────────────── */
  const heartsBg = document.getElementById('heartsBg');

  // Array of heart characters to randomly pick from
  const heartChars = ['♥', '❤', '♡', '💕', '💗', '💖', '✿', '🌸'];

  function createFloatingHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';

    // Randomly pick a heart character from the array
    heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

    // Randomise horizontal position across the full width
    heart.style.left = Math.random() * 100 + 'vw';

    // Randomise size between 14px and 28px
    heart.style.fontSize = (Math.random() * 14 + 14) + 'px';

    // Randomise animation duration between 8 and 18 seconds
    const duration = Math.random() * 10 + 8;
    heart.style.animationDuration = duration + 's';

    // Randomise delay so they don't all start at once
    heart.style.animationDelay = Math.random() * 4 + 's';

    heartsBg.appendChild(heart);

    // Remove the element after it finishes animating to avoid DOM build-up
    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, (duration + 4) * 1000);
  }

  // Create hearts every 1.4 seconds
  setInterval(createFloatingHeart, 1400);

  // Create a few immediately on page load so the effect is visible right away
  for (let i = 0; i < 5; i++) createFloatingHeart();


  /* ─────────────────────────────────────────
     2. NAVIGATION SCROLL EFFECT
     Adds .scrolled class to navbar when the
     user scrolls past 30px — triggers frosted glass
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // Add class if scrolled more than 30px from top
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Also update which nav link is "active" based on scroll position
    updateActiveNavLink();
  }, { passive: true });

  // Run once on load to set initial state
  navbar.classList.toggle('scrolled', window.scrollY > 30);


  /* ─────────────────────────────────────────
     3. ACTIVE NAV LINK TRACKING
     Watches which section is in view and highlights
     the matching nav link with the .active class
  ───────────────────────────────────────── */
  function updateActiveNavLink() {
    // All section IDs that match nav links
    const sectionIds = ['home', 'gift', 'about', 'gallery'];

    // How far from the top we consider a section "active"
    const offset = window.innerHeight * 0.4;

    let currentActive = 'home';

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // If the top of the section is above the midpoint of the screen
      if (rect.top <= offset) {
        currentActive = id;
      }
    });

    // Update the active class on each nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentActive);
    });
  }


  /* ─────────────────────────────────────────
     4. MOBILE HAMBURGER MENU
     Toggles the nav menu open/closed on mobile
     Also closes menu when a link is clicked
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('navList');

  hamburger.addEventListener('click', () => {
    // Toggle open state on both hamburger and nav list
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  });

  // Close mobile menu when any nav link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navList.classList.remove('open');
    });
  });


  /* ─────────────────────────────────────────
     5. SMOOTH SCROLLING FOR NAV LINKS
     Intercepts anchor clicks and scrolls smoothly
     to the target section, accounting for nav height
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      // Get navbar height to offset scroll position
      const navHeight = navbar.offsetHeight;

      window.scrollTo({
        top: target.offsetTop - navHeight,
        behavior: 'smooth'
      });
    });
  });


  /* ─────────────────────────────────────────
     6. SCROLL REVEAL ANIMATION
     Uses IntersectionObserver to watch elements
     with class .scroll-reveal
     When they enter the viewport, adds .revealed
     which triggers the CSS fade-up animation
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add revealed class — CSS handles the actual animation
        entry.target.classList.add('revealed');
        // Stop observing this element — no need to re-animate
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,    // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // slightly before the bottom edge
  });

  // Observe every element with the .scroll-reveal class
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ─────────────────────────────────────────
     7. GALLERY LIGHTBOX
     Opens a fullscreen lightbox when a gallery
     item is clicked, showing the image + caption
  ───────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCap    = document.getElementById('lbCap');
  const lbClose  = document.getElementById('lbClose');

  // Add click listener to each gallery item
  document.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', () => {
      // Read src and caption from the element's data attributes
      const src     = item.dataset.src;
      const caption = item.dataset.caption;

      // Set the lightbox image and caption
      lbImg.src        = src;
      lbImg.alt        = caption;
      lbCap.textContent = caption;

      // Show the lightbox
      lightbox.classList.add('open');

      // Prevent scrolling the background while lightbox is open
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox when X button is clicked
  lbClose.addEventListener('click', closeLightbox);

  // Close lightbox when clicking outside the image box (on the dark backdrop)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close lightbox on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';   // restore scrolling
    // Clear src after transition ends to avoid flash
    setTimeout(() => { lbImg.src = ''; }, 350);
  }


  /* ─────────────────────────────────────────
     8. TEDDY BEAR HEAD TURNING ANIMATION
     
     Initial state:    teddy looks straight (default)
     When typing:      teddy turns head LEFT toward the input
     When done typing: teddy slowly looks away (reset)
     
     JS adds/removes .looking class on #teddyBear
     CSS handles the smooth rotation transition
  ───────────────────────────────────────── */
  const nameInput  = document.getElementById('nameInput');
  const teddyBear  = document.getElementById('teddyBear');
  const tBubble    = document.getElementById('tBubble');
  const tBubbleTxt = document.getElementById('tBubbleText');

  let typingTimer;  // timer handle for "stopped typing" detection

  // When user STARTS typing — teddy looks toward the input
  nameInput.addEventListener('focus', () => {
    teddyBear.classList.add('looking');
    teddyBear.classList.remove('sad');
  });

  // While typing — keep the teddy looking, restart "idle" timer
  nameInput.addEventListener('input', () => {
    // Make sure teddy is looking while typing
    teddyBear.classList.add('looking');
    teddyBear.classList.remove('sad');

    // Clear any pending "stop typing" timer
    clearTimeout(typingTimer);

    // After 2 seconds of no typing, teddy looks away
    typingTimer = setTimeout(() => {
      teddyBear.classList.remove('looking');
    }, 2000);
  });

  // When input loses focus — teddy looks away
  nameInput.addEventListener('blur', () => {
    clearTimeout(typingTimer);
    teddyBear.classList.remove('looking');
  });


  /* ─────────────────────────────────────────
     9. GIFT UNLOCK / LOGIN VALIDATION LOGIC
     
     Check if user typed the correct secret name
     Correct name = "wikkii" (case-insensitive)
     
     If CORRECT:
       - Lock icon animates
       - Teddy bear becomes happy (dancing)
       - Form hides, gift reveal shows
       - Confetti burst fires
     
     If WRONG:
       - Input shakes
       - Teddy bear looks sad
       - Error message shows
       - Bubble shows a hint
  ───────────────────────────────────────── */
  const unlockBtn  = document.getElementById('unlockBtn');
  const inputRow   = document.getElementById('inputRow');
  const lockIcon   = document.getElementById('lockIcon');
  const errMsg     = document.getElementById('errMsg');
  const unlockForm = document.getElementById('unlockForm');
  const giftReveal = document.getElementById('giftReveal');

  // The secret name — change this to any word you want
  const SECRET_NAME = 'wikkii';

  // Unlock button click handler
  unlockBtn.addEventListener('click', checkGiftName);

  // Also allow pressing Enter in the input field
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkGiftName();
  });

  function checkGiftName() {
    const typed = nameInput.value.trim().toLowerCase();

    if (!typed) {
      // Empty input — show gentle hint
      showBubble('Type a name first! 🐻');
      return;
    }

    if (typed === SECRET_NAME) {
      // ✅ CORRECT NAME — unlock the gift!
      handleCorrectName();
    } else {
      // ❌ WRONG NAME — shake animation + error
      handleWrongName();
    }
  }

  /* Called when the user enters the correct name */
  function handleCorrectName() {
    // 1. Change lock icon to open lock
    lockIcon.textContent = '🔓';
    lockIcon.classList.add('unlocking');

    // 2. Hide error message if visible
    errMsg.classList.remove('visible');

    // 3. Make teddy happy (dance animation)
    teddyBear.classList.remove('looking', 'sad');
    teddyBear.classList.add('happy');
    showBubble('Yay!! 🎉 Welcome!', 4000);

    // 4. Brief delay, then show gift reveal
    setTimeout(() => {
      // Hide the form
      unlockForm.style.display = 'none';

      // Show the gift reveal section with pop animation
      giftReveal.classList.add('open');

      // Fire confetti celebration
      fireConfetti();
    }, 800);
  }

  /* Called when the user enters a wrong name */
  function handleWrongName() {
    // 1. Shake the input row
    inputRow.classList.add('shake');
    // Remove shake class after animation so it can trigger again
    inputRow.addEventListener('animationend', () => {
      inputRow.classList.remove('shake');
    }, { once: true });

    // 2. Show error message
    errMsg.classList.add('visible');
    // Auto-hide error after 3 seconds
    setTimeout(() => errMsg.classList.remove('visible'), 3000);

    // 3. Make teddy sad
    teddyBear.classList.remove('looking', 'happy');
    teddyBear.classList.add('sad');
    showBubble('Hmm... try again! 🐻', 2500);

    // 4. Clear the input so they can type again easily
    nameInput.value = '';
    nameInput.focus();

    // 5. Reset teddy after animation
    setTimeout(() => {
      teddyBear.classList.remove('sad');
    }, 1000);
  }

  /* Helper — shows the teddy speech bubble with a message
     message: string text to show
     duration: ms to show before auto-hiding (default 2000ms) */
  function showBubble(message, duration = 2000) {
    tBubbleTxt.textContent = message;
    tBubble.classList.add('visible');
    setTimeout(() => tBubble.classList.remove('visible'), duration);
  }


  /* ─────────────────────────────────────────
     10. CONFETTI BURST
     Creates colorful confetti particles that
     fall from the top of the screen when the
     gift is unlocked
  ───────────────────────────────────────── */
  function fireConfetti() {
    // Colors for confetti particles
    const colors = ['#E8769A','#C8784A','#F2C9B0','#FFD700','#FFFFFF','#D4845A'];
    const shapes = ['♥','✦','✿','★','●','▲','♦'];

    // Create 80 particles
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');

        // Style each confetti piece
        piece.style.cssText = `
          position: fixed;
          top: -20px;
          left: ${Math.random() * 100}vw;
          font-size: ${Math.random() * 16 + 10}px;
          color: ${colors[Math.floor(Math.random() * colors.length)]};
          z-index: 3000;
          pointer-events: none;
          animation: confettiFall ${Math.random() * 2 + 2}s ease-in forwards;
          transform: rotate(${Math.random() * 360}deg);
        `;
        piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];

        document.body.appendChild(piece);

        // Remove after animation completes
        setTimeout(() => piece.parentNode && piece.parentNode.removeChild(piece), 4000);
      }, i * 30); // stagger each piece by 30ms
    }
  }

  // CSS for confetti fall animation — injected into a style tag
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confettiFall {
      0%   { transform: translateY(0)    rotate(0deg)   scale(1);   opacity: 1; }
      60%  { opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg) scale(0.6); opacity: 0; }
    }
  `;
  document.head.appendChild(confettiStyle);


  /* ─────────────────────────────────────────
     11. PHOTO PLACEHOLDER FALLBACK
     If a photo can't be loaded (placeholder path),
     shows a pretty gradient placeholder instead
  ───────────────────────────────────────── */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      // Replace broken image with a gradient placeholder
      this.style.cssText = `
        background: linear-gradient(135deg, #FAE8D8 0%, #F2C9B0 50%, #EDE4CC 100%);
        display: flex; align-items: center; justify-content: center;
        font-size: 32px;
      `;
      this.alt = '🌸';
      // Remove the broken image src to stop the reload loop
      this.removeAttribute('src');
    });
  });

});  // end DOMContentLoaded
