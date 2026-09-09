// Canvas Balloon Animation & Homepage Performance Optimization
(function () {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
        // Guard canvas initialization: if canvas is null, avoid throwing errors on pages without a canvas
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sprite configuration
    const SPRITE_CANVAS_SIZE = 512;
    const SPRITE_CENTER_X = 256;
    const SPRITE_CENTER_Y = 230;
    const SPRITE_RADIUS = 180;
    const MAX_BALLOONS = 14;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    // Throttled window resize via requestAnimationFrame
    let resizeScheduled = false;
    window.addEventListener('resize', () => {
        if (!resizeScheduled) {
            resizeScheduled = true;
            requestAnimationFrame(() => {
                resizeCanvas();
                resizeScheduled = false;
            });
        }
    }, { passive: true });

    // Throttled mouse tracking via requestAnimationFrame
    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };

    let pendingMouseX = mouse.x;
    let pendingMouseY = mouse.y;
    let mouseUpdateScheduled = false;

    window.addEventListener('mousemove', (e) => {
        pendingMouseX = e.clientX;
        pendingMouseY = e.clientY;
        if (!mouseUpdateScheduled) {
            mouseUpdateScheduled = true;
            requestAnimationFrame(() => {
                mouse.x = pendingMouseX;
                mouse.y = pendingMouseY;
                mouseUpdateScheduled = false;
            });
        }
    }, { passive: true });

    // Standard & Rare Balloon Palette
    const standardBalloonColors = [
        { main: '#4285F4', light: '#93bbfd', dark: '#1d5ec4' }, // Blue
        { main: '#DB4437', light: '#f59890', dark: '#a82015' }, // Red
        { main: '#F4B400', light: '#fce38a', dark: '#b88500' }, // Yellow
        { main: '#0F9D58', light: '#74e3a9', dark: '#086337' }, // Green
        { main: '#ea580c', light: '#ffedd5', dark: '#c2410c' }  // Orange
    ];

    const rareBalloonColors = [
        { main: '#e1306c', light: '#ff85b3', dark: '#9b1544', rare: 'pink' },       // Hot Pink
        { main: '#a855f7', light: '#7dd3fc', dark: '#c084fc', rare: 'iridescent' }, // Opalescent Iridescent
        { main: '#ff2a6d', light: '#ffd700', dark: '#0056ff', rare: 'rainbow' },    // Horizontal Striped Rainbow
        { main: '#f59e0b', light: '#fef3c7', dark: '#78350f', rare: 'gold' },       // Metallic Gold with Chrome Reflection
        { main: '#94a3b8', light: '#f8fafc', dark: '#334155', rare: 'silver' }      // Metallic Silver with Chrome Reflection
    ];

    function getRandomBalloonColor() {
        // 22% chance rare color, 78% chance standard color
        if (Math.random() < 0.22) {
            return rareBalloonColors[Math.floor(Math.random() * rareBalloonColors.length)];
        }
        return standardBalloonColors[Math.floor(Math.random() * standardBalloonColors.length)];
    }

    // Pre-render Balloon Sprites (Offscreen Canvases)
    // Eliminates per-frame ctx.shadowBlur, radial gradient allocations, and clipping operations
    const balloonSpriteCache = new Map();

    function createBalloonSprite(colorDef) {
        const sprite = document.createElement('canvas');
        sprite.width = SPRITE_CANVAS_SIZE;
        sprite.height = SPRITE_CANVAS_SIZE;
        const sCtx = sprite.getContext('2d');
        const r = SPRITE_RADIUS;
        const cx = SPRITE_CENTER_X;
        const cy = SPRITE_CENTER_Y;

        sCtx.save();
        sCtx.translate(cx, cy);

        // 1. Bent 3D Curved Striped Rainbow Balloon
        if (colorDef.rare === 'rainbow') {
            // Pre-baked ambient drop shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.08)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#a12559';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            // Spherical balloon clipping
            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            const stripeColors = ['#ff2a6d', '#ff9900', '#ffd700', '#05d9e8', '#0056ff', '#a12559'];
            sCtx.fillStyle = stripeColors[stripeColors.length - 1];
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            const yPositions = [-r * 0.72, -r * 0.4, -r * 0.08, r * 0.24, r * 0.56];
            const rx = r * 1.25;
            const ry = r * 0.38;

            for (let i = 0; i < yPositions.length; i++) {
                sCtx.fillStyle = stripeColors[i];
                sCtx.beginPath();
                sCtx.ellipse(0, yPositions[i], rx, ry, 0, 0, Math.PI * 2);
                sCtx.fill();
            }

            // 3D Spherical Radial Shading & Surface Contour Overlay
            const sphereShade = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
            sphereShade.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
            sphereShade.addColorStop(0.75, 'rgba(0, 0, 0, 0.08)');
            sphereShade.addColorStop(1, 'rgba(0, 0, 0, 0.45)');

            sCtx.fillStyle = sphereShade;
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();

            // Specular Glossy Highlight
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            sCtx.fill();

            sCtx.restore(); // end clip
            sCtx.restore(); // end translate
            return sprite;
        }

        // 2. Truly Metallic Gold & Silver with Chrome Reflections
        if (colorDef.rare === 'gold' || colorDef.rare === 'silver') {
            const isGold = colorDef.rare === 'gold';
            const grad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.02,
                0, 0, r * 1.1
            );

            if (isGold) {
                grad.addColorStop(0, '#ffffff');       // Chrome Specular Peak
                grad.addColorStop(0.12, '#fff7ed');    // Highlight Gold
                grad.addColorStop(0.35, '#f59e0b');    // Mid Gold
                grad.addColorStop(0.55, '#ffffff');    // Horizon Mirror Line
                grad.addColorStop(0.72, '#b45309');    // Deep Amber Shadow
                grad.addColorStop(0.92, '#d97706');    // Metallic Rim Light
                grad.addColorStop(1, '#451a03');       // Edge Shadow
            } else {
                grad.addColorStop(0, '#ffffff');       // Chrome Specular Peak
                grad.addColorStop(0.15, '#f8fafc');    // Bright Silver
                grad.addColorStop(0.38, '#94a3b8');    // Mid Silver
                grad.addColorStop(0.58, '#ffffff');    // Horizon Mirror Line
                grad.addColorStop(0.75, '#475569');    // Deep Steel Shadow
                grad.addColorStop(0.92, '#cbd5e1');    // Metallic Rim Light
                grad.addColorStop(1, '#0f172a');       // Edge Shadow
            }

            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fillStyle = grad;
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.16)';
            sCtx.shadowBlur = 65;
            sCtx.shadowOffsetY = 29;
            sCtx.fill();
            sCtx.shadowColor = 'transparent';

            // Primary Specular Reflection Spot
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            sCtx.fill();

            // Secondary Rim Mirror Reflection Curve
            sCtx.beginPath();
            sCtx.ellipse(r * 0.25, r * 0.35, r * 0.45, r * 0.15, -Math.PI / 6, 0, Math.PI * 2);
            sCtx.fillStyle = isGold ? 'rgba(254, 243, 199, 0.45)' : 'rgba(255, 255, 255, 0.45)';
            sCtx.fill();

            sCtx.restore();
            return sprite;
        }

        // 3. Standard & Pink/Iridescent Spherical Balloon
        const grad = sCtx.createRadialGradient(
            -r * 0.35, -r * 0.35, r * 0.05,
            -r * 0.1, -r * 0.1, r * 1.15
        );

        if (colorDef.rare === 'iridescent') {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.2, '#f472b6'); // Soft Pink
            grad.addColorStop(0.45, '#7dd3fc'); // Opalescent Sky Blue
            grad.addColorStop(0.7, '#c084fc'); // Lavender
            grad.addColorStop(1, '#6366f1');    // Indigo Pearl
        } else {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.25, colorDef.light);
            grad.addColorStop(0.75, colorDef.main);
            grad.addColorStop(1, colorDef.dark);
        }

        sCtx.beginPath();
        sCtx.arc(0, 0, r, 0, Math.PI * 2);
        sCtx.fillStyle = grad;
        sCtx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        sCtx.shadowBlur = 58;
        sCtx.shadowOffsetY = 22;
        sCtx.fill();
        sCtx.shadowColor = 'transparent';

        // Soft Specular Glossy Highlight
        sCtx.beginPath();
        sCtx.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2);
        sCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        sCtx.fill();

        sCtx.restore();
        return sprite;
    }

    function initSpriteCache() {
        const allColors = [...standardBalloonColors, ...rareBalloonColors];
        for (let i = 0; i < allColors.length; i++) {
            const color = allColors[i];
            const key = color.rare || color.main;
            balloonSpriteCache.set(key, createBalloonSprite(color));
        }
    }
    initSpriteCache();

    class Balloon {
        constructor(x, y, radius, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.baseRadius = radius;
            this.radius = radius;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.swaySpeed = Math.random() * 0.008 + 0.004;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.opacity = 1.0;
            this.isExpiring = false;
        }

        update() {
            // Gentle fade out if marked for expiration
            if (this.isExpiring) {
                this.opacity -= 0.02;
            }

            // Smooth, gentle upward buoyancy
            this.vy -= 0.003;
            if (this.vy < -0.6) this.vy = -0.6;

            // Smooth horizontal sway
            this.swayAngle += this.swaySpeed;
            this.x += Math.sin(this.swayAngle) * 0.3 + this.vx;
            this.y += this.vy;

            // Damping velocity
            this.vx *= 0.98;

            // Clean wall bouncing
            if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.vx *= -0.5;
            } else if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
                this.vx *= -0.5;
            }

            // Top ceiling wrap
            if (this.y + this.radius < -50) {
                if (this.isExpiring) {
                    this.opacity = 0;
                } else {
                    this.y = canvas.height + this.radius + 20;
                    this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
                    this.vy = -Math.random() * 0.4 - 0.2;
                    this.vx = (Math.random() - 0.5) * 0.4;
                }
            }

            // Gentle mouse hover & repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetRadius = this.baseRadius;
            if (dist < 120 && dist > 0) {
                targetRadius = this.baseRadius * 1.25;
                const force = (120 - dist) / 120;
                this.vx += (dx / dist) * force * 0.25;
                this.vy += (dy / dist) * force * 0.25;
            }

            // Smooth size lerping
            this.radius += (targetRadius - this.radius) * 0.08;
        }

        // Pass 1: Floor Shadow Layer
        drawShadow() {
            const r = this.radius;
            const shadowDist = (canvas.height - this.y) * 0.25;
            const shadowY = this.y + Math.max(r * 1.2, shadowDist);
            const shadowAlpha = Math.max(0.02, 0.16 * (1 - this.y / canvas.height)) * this.opacity;

            ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
            ctx.beginPath();
            ctx.ellipse(this.x, shadowY, r * 0.95, r * 0.28, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Pass 2: Solid 3D Balloon Sphere Body Layer using pre-rendered offscreen sprite
        drawBody() {
            const key = this.color.rare || this.color.main;
            let sprite = balloonSpriteCache.get(key);
            if (!sprite) {
                sprite = createBalloonSprite(this.color);
                balloonSpriteCache.set(key, sprite);
            }

            const scale = this.radius / SPRITE_RADIUS;
            const w = SPRITE_CANVAS_SIZE * scale;
            const h = SPRITE_CANVAS_SIZE * scale;
            const dx = this.x - SPRITE_CENTER_X * scale;
            const dy = this.y - SPRITE_CENTER_Y * scale;

            if (this.opacity < 0.999) {
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.drawImage(sprite, dx, dy, w, h);
                ctx.globalAlpha = 1.0;
            } else {
                ctx.drawImage(sprite, dx, dy, w, h);
            }
        }
    }

    // Instantiate initial set of balloons
    const balloons = [];
    for (let i = 0; i < 6; i++) {
        const radius = Math.random() * 15 + 42;
        const x = Math.random() * (canvas.width - radius * 4) + radius * 2;
        const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
        const vx = (Math.random() - 0.5) * 0.6;
        const vy = -Math.random() * 0.5 - 0.2;
        const color = getRandomBalloonColor();

        balloons.push(new Balloon(x, y, radius, vx, vy, color));
    }

    // Click handler with balloon capping and interactive UI exclusion
    window.addEventListener('click', (e) => {
        // Prevent click-to-spawn when clicking interactive UI elements
        const interactive = e.target.closest('a, button, nav, header, input, select, textarea, [role="button"]');
        if (interactive && !interactive.closest('.balloon-badge-btn')) {
            return;
        }

        // Cap concurrent balloons with gentle FIFO fade-out
        const activeBalloons = balloons.filter(b => !b.isExpiring);
        if (activeBalloons.length >= MAX_BALLOONS) {
            activeBalloons[0].isExpiring = true;
        }

        // Hard cap safeguard against rapid clicking
        while (balloons.length >= MAX_BALLOONS + 4) {
            balloons.shift();
        }

        const radius = Math.random() * 15 + 40;
        const color = getRandomBalloonColor();
        const vx = (Math.random() - 0.5) * 1.2;
        const vy = -Math.random() * 0.6 - 0.3;

        balloons.push(new Balloon(e.clientX, e.clientY, radius, vx, vy, color));
    }, { passive: true });

    // Animation Loop with visibilitychange pause / resume
    let animId = null;
    let isAnimating = false;

    function animate() {
        if (!isAnimating) return;
        animId = requestAnimationFrame(animate);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update balloons and prune expired ones
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            b.update();
            if (b.opacity <= 0) {
                balloons.splice(i, 1);
            }
        }

        // 2-Pass rendering: floor shadows, then 3D bodies
        for (let i = 0; i < balloons.length; i++) {
            balloons[i].drawShadow();
        }
        for (let i = 0; i < balloons.length; i++) {
            balloons[i].drawBody();
        }
    }

    function startAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            animId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        if (isAnimating) {
            isAnimating = false;
            if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    if (!document.hidden) {
        startAnimation();
    }
})();

// --- Typewriter Effect with Balloon Color & Metallic Theme Cycling ---
const phrases = [
    "personal website.",
    "portfolio.",
    "resume.",
    "certifications.",
    "projects."
];

const balloonAccentPalette = [
    // Standard Common Themes (~75%)
    { main: '#4285F4', light: '#dbeaff', type: 'standard' },
    { main: '#DB4437', light: '#fde8e8', type: 'standard' },
    { main: '#d97706', light: '#fef3c7', type: 'standard' },
    { main: '#0F9D58', light: '#dcfce7', type: 'standard' },
    { main: '#ea580c', light: '#ffedd5', type: 'standard' },
    // Rare Themes (~25%)
    { main: '#e1306c', light: '#fce7f3', type: 'pink' },
    { main: '#a855f7', light: '#f3e8ff', type: 'iridescent' },
    { main: '#ff2a6d', light: '#ffe4e6', type: 'rainbow' },
    { main: '#b45309', light: '#fef3c7', type: 'gold' },
    { main: '#64748b', light: '#f1f5f9', type: 'silver' }
];

let currentAccentIndex = 4;
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isSelectDeleteMode = false;
let isHighlighting = false;

function cycleRandomAccentColor() {
    let nextIndex = currentAccentIndex;
    const isRare = Math.random() < 0.25;
    if (isRare) {
        nextIndex = 5 + Math.floor(Math.random() * 5);
    } else {
        nextIndex = Math.floor(Math.random() * 5);
    }
    currentAccentIndex = nextIndex;
    const accent = balloonAccentPalette[currentAccentIndex];

    const typewriterEl = document.getElementById('typewriter');
    const cursorEl = document.querySelector('.cursor');
    const pressBtn = document.getElementById('press-btn');

    if (typewriterEl) {
        typewriterEl.classList.remove('rainbow-text', 'iridescent-text', 'gold-text', 'silver-text');
        if (accent.type === 'rainbow') {
            typewriterEl.classList.add('rainbow-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'iridescent') {
            typewriterEl.classList.add('iridescent-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'gold') {
            typewriterEl.classList.add('gold-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'silver') {
            typewriterEl.classList.add('silver-text');
            typewriterEl.style.color = '';
        } else {
            typewriterEl.style.color = accent.main;
        }
        typewriterEl.style.setProperty('--active-highlight-bg', accent.light);
    }

    if (cursorEl) cursorEl.style.color = accent.main;
    if (pressBtn) pressBtn.style.setProperty('--active-accent', accent.main);
}

function typeEffect() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const currentPhrase = phrases[phraseIndex];

    // Handle Highlight-Select-All Delete Mode
    if (isHighlighting) {
        return; // Pause during highlight window
    }

    if (isDeleting) {
        if (isSelectDeleteMode) {
            // Mode B: Highlight all text for 320ms then erase all at once!
            isHighlighting = true;
            typewriterEl.classList.add('highlighted');
            setTimeout(() => {
                typewriterEl.textContent = '';
                typewriterEl.classList.remove('highlighted');
                charIndex = 0;
                isDeleting = false;
                isHighlighting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                cycleRandomAccentColor();
                setTimeout(typeEffect, 350);
            }, 320);
            return;
        } else {
            // Mode A: Character-by-character backspacing
            typewriterEl.classList.remove('highlighted');
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        }
    } else {
        typewriterEl.classList.remove('highlighted');
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 75;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 1900; // Pause at end of phrase
        isDeleting = true;
        // 50% chance to select-all & delete vs. 50% chance to backspace character by character
        isSelectDeleteMode = Math.random() > 0.45;

        // Trigger mechanical button press animation when text is fully typed
        const pressBtn = document.getElementById('press-btn');
        if (pressBtn) {
            pressBtn.classList.add('pressed');
            setTimeout(() => {
                pressBtn.classList.remove('pressed');
            }, 380);
        }
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        cycleRandomAccentColor();
        typeSpeed = 350; // Pause before typing next phrase
    }

    setTimeout(typeEffect, typeSpeed);
}

function initTypewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;
    cycleRandomAccentColor();
    typeEffect();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
} else {
    initTypewriter();
}