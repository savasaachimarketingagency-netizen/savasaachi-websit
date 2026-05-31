import './style.css';
import { ThreeScene } from './three-scene';
import { gsap } from 'gsap';

// --- Services Detailed Copywriting Database ---
const servicesDatabase = {
  reels: {
    title: 'Reels & Videos Content Creation',
    tag: 'Video Production Division',
    description: 'In the fast-paced digital arena, video content is your most powerful tool for engagement. We combine expert cinematography, trending sound patterns, and narrative hooks to create reels, TikToks, and brand ads that capture attention within the first 1.5 seconds. Our data-driven approach focuses on audience retention, algorithm metrics, and converting impressions into lifelong brand advocates.',
    timeline: '2 Weeks / Monthly Cycle',
    features: [
      'High-definition 4K cinematic shooting',
      'Sound design & trending audio integration',
      'Advanced motion typography & subtitles',
      'Weekly editing cycles & rapid turnarounds',
      'Hook testing and content testing strategies',
      'Scripting and storyboarding by digital copywriters'
    ],
    process: [
      { num: 'Step 1', name: 'Concept & Scripting', desc: 'Brainstorming hooks, outlines, and scripts designed for short-form retention and algorithm trigger optimization.' },
      { num: 'Step 2', name: 'Production & Filming', desc: 'High-fidelity shooting with advanced lighting, sound setups, and dynamic camera angles matching modern video formats.' },
      { num: 'Step 3', name: 'Post-Production Visuals', desc: 'Dynamic cutting, color grading, visual sound design, sound effects, and custom animated typography overlays.' },
      { num: 'Step 4', name: 'Optimize & Schedule', desc: 'Title hooks, description writing, keyword tags, and scheduled publishing times to maximize exposure.' }
    ]
  },
  web: {
    title: 'Web Design & Development',
    tag: 'Interactive Web Division',
    description: 'Your website is your ultimate digital storefront. We design custom high-end websites that load instantly, feel alive with micro-interactions, and are optimized to maximize conversion rates. We specialize in blending gorgeous responsive CSS, premium interactive visual elements, and modern architectures (Vite, NextJS, ThreeJS) to separate you from competitors.',
    timeline: '4-6 Weeks',
    features: [
      'Fully custom UI/UX design (Figma prototypes)',
      'Responsive WebGL and interactive animations',
      'Speed optimization (95+ Google PageSpeed score)',
      'Full SEO layout structure & semantic markup',
      'Custom admin CMS integrations',
      'Hosting setup and automated back-ups'
    ],
    process: [
      { num: 'Step 1', name: 'Wireframing & UI/UX Design', desc: 'Creating high-fidelity Figma prototypes matching your exact branding guidelines and user journey models.' },
      { num: 'Step 2', name: '3D & Visual Prototyping', desc: 'Developing interactive canvas scenes, particles, or mesh animations in WebGL to create a wow-factor.' },
      { num: 'Step 3', name: 'Clean Code Development', desc: 'Coding with clean syntax, optimized loaders, asset bundling, and fluid layouts for all devices.' },
      { num: 'Step 4', name: 'Launch & Performance Audit', desc: 'Rigorous testing across mobile, tablet, desktop, and performance scoring before final deployment.' }
    ]
  },
  social: {
    title: 'Social Media Marketing',
    tag: 'Social Strategy Division',
    description: "Social media is more than just posting—it's about community building and conversations. We build brand-specific social ecosystems that grow your follower base, drive high engagement rates, and establish your brand as a trusted industry authority. Our creative team designs custom visual grids, writes compelling copy, and executes active community management.",
    timeline: 'Monthly Campaign Strategy',
    features: [
      'Custom social media content calendar',
      'Custom graphics, grids, and carousel slides',
      'Direct community management & comment engagement',
      'Influencer outreach and marketing campaigns',
      'Monthly analytical reporting and audits',
      'Ad creative styling and target persona research'
    ],
    process: [
      { num: 'Step 1', name: 'Brand & Target Alignment', desc: 'Reviewing your current social presence, target demographics, competitor grids, and brand voice guidelines.' },
      { num: 'Step 2', name: 'Content Design & Copy', desc: 'Writing copy and designing graphic grids, carousels, and stories for the upcoming month.' },
      { num: 'Step 3', name: 'Active Publishing & Community', desc: 'Strategic timing of publications and active engagement with followers in comments to drive engagement score.' },
      { num: 'Step 4', name: 'Audit & Pivot', desc: 'Checking traffic, click-through-rates, and engagement patterns to optimize content for the next cycle.' }
    ]
  },
  seo: {
    title: 'Search Engine Optimisation',
    tag: 'Search Visibility Division',
    description: 'Organic search visibility is a compounding asset that drives passive leads 24/7. We implement comprehensive SEO frameworks focusing on deep keyword research, technical performance audits, authoritative link building, and user-intent content creation to move your keywords into the top spots on Google. We prioritize high-converting transactional search phrases.',
    timeline: '3-6 Month Growth Plan',
    features: [
      'Complete technical SEO codebase audit',
      'High-intent commercial keyword mapping',
      'Authoritative link building (digital PR outreach)',
      'Semantic content writing & copy optimization',
      'Full tracking dashboards (Search Console & Analytics)',
      'Local maps pack and schema markup code'
    ],
    process: [
      { num: 'Step 1', name: 'Audit & Keyword Mapping', desc: 'Finding high-value, high-volume search phrases and auditing technical indexing variables.' },
      { num: 'Step 2', name: 'On-Page Optimization', desc: 'Tuning HTML elements, loading speeds, metadata, schema markup, and internal linking structures.' },
      { num: 'Step 3', name: 'Content Expansion', desc: 'Publishing authoritative blog articles and hub pages addressing target buyer queries.' },
      { num: 'Step 4', name: 'Authority Acquisition', desc: 'Reaching out to industry partners and editorial networks to build high-authority backlink references.' }
    ]
  },
  digital: {
    title: 'Digital Marketing Plans',
    tag: 'Omnichannel Growth Division',
    description: 'Achieve rapid scaling through omnichannel growth strategies. We set up high-converting paid acquisition campaigns (Google Ads, Meta Ads) blended with organic funnel optimization to maximize customer lifetime value and minimize customer acquisition cost. Our campaigns are monitored hourly, using A/B testing and precise target parameters.',
    timeline: 'Campaign Setup + Monthly Optimisation',
    features: [
      'Omnichannel ad accounts setup and audit',
      'Google Search, Display, and Performance Max setups',
      'Retargeting grids & dynamic catalog ads',
      'Visual landing page optimization',
      'Custom ROAS (Return on Ad Spend) dashboard',
      'Ad copyright writing and split test variations'
    ],
    process: [
      { num: 'Step 1', name: 'Funnel Mapping', desc: 'Designing buyer journeys from cold impressions to conversions, mapping lead magnets and email touchpoints.' },
      { num: 'Step 2', name: 'Ad Creative & Copywriting', desc: 'Creating graphics, short videos, and copy variations targeting diverse buyer personas.' },
      { num: 'Step 3', name: 'Launch & Target Tuning', desc: 'Direct target implementation, pixel/API conversion settings, and bidding algorithm tuning.' },
      { num: 'Step 4', name: 'Scale & A/B Testing', desc: 'Duplicating winning angles to scale budgets and launching landing page split tests to boost conversions.' }
    ]
  },
  reputation: {
    title: 'Reputation Management',
    tag: 'Brand Credibility Division',
    description: 'Your online reputation is your most fragile and valuable asset. We help businesses monitor their digital footprint, systematically generate positive 5-star reviews from satisfied clients, and buffer negative feedback. We build brand credibility that gives prospective customers the trust they need to choose you over a competitor.',
    timeline: 'Immediate Setup + Constant Monitoring',
    features: [
      'Review generation email & SMS systems',
      'Digital reputation tracking & alerts',
      'Customer feedback sorting & responses',
      'Review widget embedding for website conversions',
      'Negative review mitigation systems',
      'Google Business Profile ranking optimization'
    ],
    process: [
      { num: 'Step 1', name: 'Footprint Analysis', desc: 'Auditing Google Business Profile, Trustpilot, Facebook, and reviews across major industry directories.' },
      { num: 'Step 2', name: 'System Integration', desc: 'Syncing review request APIs with your client database, POS, or CRM software for automation.' },
      { num: 'Step 3', name: 'Automated Outreach', desc: 'Sending automated request workflows immediately after successful client interactions or project completions.' },
      { num: 'Step 4', name: 'Promotion & Conversion', desc: 'Displaying top reviews on your web pages to drive conversion and improve organic search visibility.' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Experience
  const webglScene = new ThreeScene('webgl-canvas');

  // --- 1. Preloader Fade Out ---
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        triggerHeroAnimations();
      }, 800);
    }
  });

  // Fallback for preloader
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      triggerHeroAnimations();
    }
  }, 3500);

  // --- 2. Custom Cursor Physics ---
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (cursor && cursorDot) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const updateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(updateCursor);
    };
    updateCursor();

    // Hover states for cursor - wrapped in helper since we will bind dynamic cards
    const refreshCursorHovers = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, .service-card, .mobile-nav-toggle'
      );

      interactiveElements.forEach((el) => {
        // Clear previous listeners to prevent duplicates
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    function onMouseEnter() {
      cursor.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    }

    function onMouseLeave() {
      cursor.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    }

    refreshCursorHovers();
    // Expose this internationally so the router can refresh hovers when dynamic content renders
    window.refreshCursorHovers = refreshCursorHovers;
  }

  // --- 3. Hero Entry Animations (GSAP) ---
  function triggerHeroAnimations() {
    const tl = gsap.timeline();

    tl.from('.site-header', {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    tl.from('.hero-badge', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.5');

    tl.from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.4');

    tl.from('.hero-subtitle', {
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');

    tl.from('.hero-description', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');

    tl.from('.hero-ctas .btn', {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'back.out(1.2)'
    }, '-=0.6');

    tl.from('.hero-stats', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // --- 4. Interactive 3D Card Tilt Effect ---
  const cards = document.querySelectorAll('.service-card, .reel-card, .blog-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rotateX = -((y / rect.height) - 0.5) * 20;
      const rotateY = ((x / rect.width) - 0.5) * 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      
      const glow = card.querySelector('.service-icon');
      if (glow) {
        glow.style.transform = `translateZ(20px) scale(1.05)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      const glow = card.querySelector('.service-icon');
      if (glow) {
        glow.style.transform = 'translateZ(0) scale(1)';
      }
    });
  });

  // --- 5. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 6. Active Navigation Indicator on Scroll ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    if (window.location.hash.startsWith('#/services/')) return; // Ignore if on detail page

    let current = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.4;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      // Fix href links pointing to hashes (Home is empty link #)
      if (href === '#' && !current) {
        item.classList.add('active');
      } else if (href === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // --- 7. Interactive Form Submission ---
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Transmitting Data...';
      submitBtn.disabled = true;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      submitBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';

      setTimeout(() => {
        alert('Thank you! Your growth request has been securely transmitted. Our strategy experts will analyze your digital footprint and get in touch shortly.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.style.boxShadow = '';
      }, 2000);
    });
  }

  // --- 8. SPA Hash Router for Service Detail Pages ---
  const mainLanding = document.getElementById('main-landing');
  const serviceDetailsPage = document.getElementById('service-details-page');

  // DOM Elements inside details template
  const dTag = document.getElementById('detail-tag');
  const dTitle = document.getElementById('detail-title');
  const dDesc = document.getElementById('detail-description');
  const dProcess = document.getElementById('detail-process');
  const dFeatures = document.getElementById('detail-features');
  const dTimeline = document.getElementById('detail-timeline');

  function handleRoute() {
    const hash = window.location.hash;

    // Check if the route is a service details route
    if (hash.startsWith('#/services/')) {
      const serviceId = hash.replace('#/services/', '');
      const serviceData = servicesDatabase[serviceId];

      if (serviceData) {
        // 1. Populate Service details dynamically
        dTag.textContent = serviceData.tag;
        dTitle.textContent = serviceData.title;
        dDesc.innerHTML = `<p>${serviceData.description}</p>`;
        dTimeline.textContent = serviceData.timeline;

        // Populate WhatsApp share link dynamically
        const dShareWhatsapp = document.getElementById('detail-share-whatsapp');
        if (dShareWhatsapp) {
          const shareText = encodeURIComponent(`Check out the ${serviceData.title} division at Savasaachi Marketing Agency:`);
          const shareUrl = encodeURIComponent(window.location.href);
          dShareWhatsapp.href = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
        }

        // Populate what's included list
        dFeatures.innerHTML = serviceData.features
          .map(f => `<li>${f}</li>`)
          .join('');

        // Populate process timeline
        dProcess.innerHTML = serviceData.process
          .map(p => `
            <div class="process-step">
              <span class="step-num">${p.num}</span>
              <h4 class="step-name">${p.name}</h4>
              <p class="step-desc">${p.desc}</p>
            </div>
          `).join('');

        // 2. Hide Landing Page and Show Details Page
        mainLanding.classList.add('hidden');
        serviceDetailsPage.classList.remove('hidden');

        // Scroll to top of details page
        window.scrollTo(0, 0);

        // 3. Clear active nav tags
        navItems.forEach(item => item.classList.remove('active'));

        // 4. Trigger GSAP entrance animation for details layout
        gsap.from('#service-details-page .details-page-content', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        });

        // 5. Notify Three.js to slide camera to details focus state
        webglScene.setView('details');

        // Refresh cursor hover binds for new back button
        if (window.refreshCursorHovers) window.refreshCursorHovers();
        return;
      }
    }

    // Default route: Hide details page, reveal main landing layout
    serviceDetailsPage.classList.add('hidden');
    mainLanding.classList.remove('hidden');

    // Notify Three.js to slide camera back to home scroll-based coordinates
    webglScene.setView('home');

    // Re-highlight active nav menu based on scroll position
    const currentScrollY = window.scrollY;
    // Trigger scroll event manually to update nav highlights
    window.dispatchEvent(new Event('scroll'));
  }

  // Bind Router Events
  window.addEventListener('hashchange', handleRoute);
  
  // Initialize router check on page load
  handleRoute();
});
