import * as THREE from 'three';

export class ThreeScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Mouse movement tracking
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    // Scroll progress tracking
    this.scrollProgress = 0;

    // View state tracking
    this.currentView = 'home';
    this.viewProgress = 0;

    // Floating icons array
    this.floatingIcons = [];

    this.init();
  }

  init() {
    // --- Scene, Camera, Renderer ---
    this.scene = new THREE.Scene();
    
    // Create dark space fog
    this.scene.background = new THREE.Color('#030107');
    this.scene.fog = new THREE.FogExp2('#030107', 0.015);

    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 18);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#8224e3', 3);
    dirLight1.position.set(5, 5, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#00f2fe', 2);
    dirLight2.position.set(-5, -5, 5);
    this.scene.add(dirLight2);

    // --- Objects ---
    this.createBackgroundParticles();
    this.createGlobeHologram();
    this.createFloatingIcons();

    // --- Event Listeners ---
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));

    // Start Loop
    this.animate(0);
  }

  // --- Background Particle Wave System ---
  createBackgroundParticles() {
    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Set up positions as a flat grid that we will deform in the render loop
    // Also set colors using brand gradient (purple to cyan)
    const colorPurple = new THREE.Color('#8224e3');
    const colorCyan = new THREE.Color('#00f2fe');

    for (let i = 0; i < particleCount; i++) {
      // Spread particles across a wide 3D space
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 40 - 5;
      const z = (Math.random() - 0.5) * 30 - 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color interpolation based on position
      const ratio = (x + 30) / 60;
      const mixedColor = colorPurple.clone().lerp(colorCyan, ratio);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a circular glowing particle texture programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: texture
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  // --- 3D Globe Hologram ---
  createGlobeHologram() {
    this.globeGroup = new THREE.Group();

    // 1. Core wireframe sphere
    const sphereGeom = new THREE.SphereGeometry(4, 30, 30);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: '#8224e3',
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    this.globeWireframe = new THREE.Mesh(sphereGeom, sphereMat);
    this.globeGroup.add(this.globeWireframe);

    // 2. Latitude/Longitude outlines
    const outlineMat = new THREE.LineBasicMaterial({
      color: '#00f2fe',
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 5; i++) {
      const radius = 4 * Math.sin((Math.PI / 6) * (i + 1));
      const height = 4 * Math.cos((Math.PI / 6) * (i + 1));
      const ringGeom = new THREE.BufferGeometry();
      const points = [];

      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(theta), height, radius * Math.sin(theta)));
      }

      ringGeom.setFromPoints(points);
      const ringLine = new THREE.Line(ringGeom, outlineMat);
      this.globeGroup.add(ringLine);
    }

    // 3. Globe node points (representing digital marketing connections)
    const nodeCount = 180;
    const nodeGeom = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    
    const colorCyan = new THREE.Color('#00f2fe');
    const colorMagenta = new THREE.Color('#d946ef');

    for (let i = 0; i < nodeCount; i++) {
      // Distribute points evenly on a sphere using Golden Ratio
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const r = 4;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      // Mix colors
      const mixedColor = colorCyan.clone().lerp(colorMagenta, Math.random());
      nodeColors[i * 3] = mixedColor.r;
      nodeColors[i * 3 + 1] = mixedColor.g;
      nodeColors[i * 3 + 2] = mixedColor.b;
    }

    nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeom.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    // Glow dot texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const nodeMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: texture
    });

    this.globeNodes = new THREE.Points(nodeGeom, nodeMat);
    this.globeGroup.add(this.globeNodes);

    // Initial position on screen (aligned with Hero's graphic container)
    this.globeGroup.position.set(4.5, 0, 0);
    this.scene.add(this.globeGroup);
  }

  // --- Create Social Media Logo Textures ---
  createLogoTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 128, 128);
    
    if (type === 'facebook') {
      ctx.fillStyle = '#8224e3'; // brand purple theme circle
      ctx.beginPath();
      ctx.arc(64, 64, 60, 0, Math.PI * 2);
      ctx.fill();
      
      // White "f"
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 85px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('f', 74, 66);
    }
    else if (type === 'instagram') {
      const grad = ctx.createLinearGradient(15, 115, 115, 15);
      grad.addColorStop(0, '#f9ed32');
      grad.addColorStop(0.3, '#ee2a7b');
      grad.addColorStop(0.6, '#d8017a');
      grad.addColorStop(1, '#8224e3');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 60, 0, Math.PI * 2);
      ctx.fill();
      
      // Camera wire
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(38, 38, 52, 52, 14);
      } else {
        ctx.rect(38, 38, 52, 52);
      }
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(64, 64, 13, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(78, 50, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (type === 'linkedin') {
      ctx.fillStyle = '#00f2fe'; // cyber cyan theme
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(14, 14, 100, 100, 20);
      } else {
        ctx.rect(14, 14, 100, 100);
      }
      ctx.fill();
      
      ctx.fillStyle = '#030107'; // dark text
      ctx.font = 'bold 60px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('in', 64, 64);
    }
    else if (type === 'youtube') {
      ctx.fillStyle = '#d946ef'; // magenta glow theme
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(10, 24, 108, 80, 22);
      } else {
        ctx.rect(10, 24, 108, 80);
      }
      ctx.fill();
      
      // Play triangle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(52, 46);
      ctx.lineTo(84, 64);
      ctx.lineTo(52, 82);
      ctx.closePath();
      ctx.fill();
    }
    else if (type === 'whatsapp') {
      ctx.fillStyle = '#25d366'; // WhatsApp green
      ctx.beginPath();
      ctx.arc(64, 64, 60, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw white bubble
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(64, 62, 26, 0, Math.PI * 2);
      ctx.fill();
      
      // Triangle pointer
      ctx.beginPath();
      ctx.moveTo(44, 76);
      ctx.lineTo(40, 94);
      ctx.lineTo(56, 86);
      ctx.closePath();
      ctx.fill();
      
      // Inner phone symbol (receiver-like arc)
      ctx.strokeStyle = '#25d366';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(66, 60, 12, Math.PI * 0.15, Math.PI * 0.75);
      ctx.stroke();
      
      // Phone dots
      ctx.fillStyle = '#25d366';
      ctx.beginPath();
      ctx.arc(77, 63, 4, 0, Math.PI*2);
      ctx.arc(56, 68, 4, 0, Math.PI*2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- Create and distribute 3D Floating Icon Meshes ---
  createFloatingIcons() {
    const types = ['facebook', 'instagram', 'linkedin', 'youtube', 'whatsapp'];
    const totalIcons = 10; // 2 of each

    for (let i = 0; i < totalIcons; i++) {
      const type = types[i % types.length];
      
      // Cylindrical thin disk geometry
      const geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.12, 32);
      // Rotate geometry so caps face camera (Z-axis)
      geometry.rotateX(Math.PI / 2);

      // Multi-material setup: [sides, top/front, bottom/back]
      const matSide = new THREE.MeshPhysicalMaterial({
        color: '#8224e3',
        roughness: 0.15,
        metalness: 0.9,
        transparent: true,
        opacity: 0.4,
        transmission: 0.6,
        thickness: 0.3
      });

      const matFront = new THREE.MeshBasicMaterial({
        map: this.createLogoTexture(type),
        transparent: true,
        opacity: 0.85
      });

      const matBack = new THREE.MeshBasicMaterial({
        map: this.createLogoTexture(type), // Same on back
        transparent: true,
        opacity: 0.85
      });

      const materials = [matSide, matFront, matBack];
      const mesh = new THREE.Mesh(geometry, materials);

      // Distribute in a large bounding box
      const zOffset = (Math.random() - 0.5) * 10 - 2; // depths from z=-7 to z=3
      const meshX = (Math.random() - 0.5) * 44;
      // Spread vertically, hero sits at 0, services at bottom, contact even further down
      const meshY = (Math.random() - 0.5) * 28 - 2;

      mesh.position.set(meshX, meshY, zOffset);
      this.scene.add(mesh);

      // Push tracking variables for animations
      this.floatingIcons.push({
        mesh: mesh,
        baseX: meshX,
        baseY: meshY,
        baseZ: zOffset,
        speedX: 0.3 + Math.random() * 0.4,
        speedY: 0.3 + Math.random() * 0.4,
        rotX: (Math.random() - 0.5) * 0.015,
        rotY: (Math.random() - 0.5) * 0.015,
        rotZ: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  setView(viewName) {
    if (viewName === 'home' || viewName === 'details') {
      this.currentView = viewName;
    }
  }

  // --- Interactivity ---
  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onMouseMove(e) {
    // Map mouse position to normalized coordinates (-1 to 1)
    this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
    this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;
  }

  onScroll() {
    // Track scroll percentage
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  // --- Animation Loop ---
  animate(timestamp) {
    requestAnimationFrame(this.animate.bind(this));

    const time = timestamp * 0.001;

    // 1. Smooth out mouse movements using linear interpolation (lerp)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // 2. Animate Background Particles (Wave Effect)
    if (this.particles) {
      const positionAttr = this.particles.geometry.attributes.position;
      const count = positionAttr.count;

      for (let i = 0; i < count; i++) {
        const x = positionAttr.getX(i);
        const z = positionAttr.getZ(i);

        // Rippling wave math using sine/cosine combinations
        const newY = Math.sin(x * 0.15 + time * 0.8) * 1.5 + Math.cos(z * 0.2 + time * 0.6) * 1.0;
        
        // Add subtle mouse reaction to background particles
        const mouseEffectY = Math.max(0, 10 - Math.abs(x - this.mouse.x * 20)) * 0.08 * this.mouse.y;
        
        positionAttr.setY(i, newY + mouseEffectY);
      }
      positionAttr.needsUpdate = true;

      // Slow overall rotation of background
      this.particles.rotation.y = time * 0.015;
      this.particles.rotation.x = this.mouse.y * 0.08;
    }

    // 3. Animate Globe Hologram
    if (this.globeGroup) {
      // Rotation
      this.globeWireframe.rotation.y = time * 0.12;
      this.globeWireframe.rotation.x = time * 0.06;
      this.globeNodes.rotation.y = time * 0.18;
      this.globeNodes.rotation.x = -time * 0.08;

      // React to mouse movement (hover tilt)
      this.globeGroup.rotation.y = this.mouse.x * 0.3;
      this.globeGroup.rotation.x = -this.mouse.y * 0.3;

      // 4. Scrolling Layout Camera & Globe Path Logic
      // - Scroll progress 0.0 -> 1.0
      // - At Hero: globe on the right side
      // - At Services: globe shifts center-back, scale gets larger, bg moves closer
      // - At About: globe shifts to the left, scale gets smaller, background particles ripple more
      // - At Contact: globe moves off-screen or sinks down

      // 1. Target coordinates for home view (scroll-based)
      let homeCamX = 0;
      let homeCamY = 0;
      let homeCamZ = 18;

      let homeGlobeX = 4.5;
      let homeGlobeY = 0;
      let homeGlobeZ = 0;

      const p = this.scrollProgress;

      if (p < 0.3) {
        const localProgress = p / 0.3;
        homeGlobeX = 4.5 - (localProgress * 4.5);
        homeGlobeZ = 0 - (localProgress * 8);
        homeCamZ = 18 - (localProgress * 4);
      } 
      else if (p < 0.65) {
        const localProgress = (p - 0.3) / 0.35;
        homeGlobeX = 0 - (localProgress * 4.5);
        homeGlobeY = 0 + (localProgress * 0.8);
        homeGlobeZ = -8 + (localProgress * 6);
        homeCamX = localProgress * 2;
        homeCamY = -localProgress * 1;
        homeCamZ = 14;
      } 
      else {
        const localProgress = (p - 0.65) / 0.35;
        homeGlobeX = -4.5 + (localProgress * 1.5);
        homeGlobeY = 0.8 - (localProgress * 6);
        homeGlobeZ = -2 - (localProgress * 4);
        homeCamX = 2 - (localProgress * 2);
        homeCamY = -1 + (localProgress * 1);
        homeCamZ = 14 + (localProgress * 4);
      }

      // 2. Interpolate view state between Home (0.0) and Details (1.0)
      const targetViewVal = this.currentView === 'details' ? 1 : 0;
      this.viewProgress += (targetViewVal - this.viewProgress) * 0.08;

      // Details View Targets
      const detailCamX = -3.5;
      const detailCamY = 0.5;
      const detailCamZ = 10;

      const detailGlobeX = 4;
      const detailGlobeY = 0.5;
      const detailGlobeZ = -4;

      // Calculate blended positions
      const finalCamX = THREE.MathUtils.lerp(homeCamX, detailCamX, this.viewProgress);
      const finalCamY = THREE.MathUtils.lerp(homeCamY, detailCamY, this.viewProgress);
      const finalCamZ = THREE.MathUtils.lerp(homeCamZ, detailCamZ, this.viewProgress);

      const finalGlobeX = THREE.MathUtils.lerp(homeGlobeX, detailGlobeX, this.viewProgress);
      const finalGlobeY = THREE.MathUtils.lerp(homeGlobeY, detailGlobeY, this.viewProgress);
      const finalGlobeZ = THREE.MathUtils.lerp(homeGlobeZ, detailGlobeZ, this.viewProgress);

      // Apply final positions
      this.camera.position.set(finalCamX, finalCamY, finalCamZ);
      this.globeGroup.position.set(finalGlobeX, finalGlobeY, finalGlobeZ);
    }

    // 4. Animate Floating 3D Social Icons
    if (this.floatingIcons) {
      this.floatingIcons.forEach((icon) => {
        // Slow rotation on all axes
        icon.mesh.rotation.x += icon.rotX;
        icon.mesh.rotation.y += icon.rotY;
        icon.mesh.rotation.z += icon.rotZ;

        // Slow hover bobbing motion
        const bobX = Math.sin(time * icon.speedX + icon.phase) * 0.6;
        const bobY = Math.cos(time * icon.speedY + icon.phase) * 0.5;

        // Base coordinates + bobbing
        let targetX = icon.baseX + bobX;
        let targetY = icon.baseY + bobY;

        // Scroll parallax translation based on depth (Z position)
        // Deeper icons translate more vertically to give heavy parallax
        const scrollOffsetFactor = (10 - icon.baseZ) * 0.8;
        const scrollParallaxY = this.scrollProgress * 22 * scrollOffsetFactor;
        targetY += scrollParallaxY;

        // Mouse cursor force field: icons slide away when cursor is close
        const dx = icon.mesh.position.x - this.mouse.x * 24;
        const dy = icon.mesh.position.y - this.mouse.y * 14;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
          const pushForce = (6 - dist) * 0.08;
          targetX += (dx / dist) * pushForce * 3;
          targetY += (dy / dist) * pushForce * 3;
        }

        // Smoothly slide to coordinates (lerp)
        icon.mesh.position.x += (targetX - icon.mesh.position.x) * 0.08;
        icon.mesh.position.y += (targetY - icon.mesh.position.y) * 0.08;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
