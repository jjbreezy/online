// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse state
const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('click', (e) => {
    // Spawn balloon at click position with gentle upward velocity
    const radius = Math.random() * 15 + 40;
    const colors = [
        { main: '#4285F4', light: '#93bbfd', dark: '#1d5ec4' }, // Blue
        { main: '#DB4437', light: '#f59890', dark: '#a82015' }, // Red
        { main: '#F4B400', light: '#fce38a', dark: '#b88500' }, // Yellow
        { main: '#0F9D58', light: '#74e3a9', dark: '#086337' }, // Green
        { main: '#ea580c', light: '#ffedd5', dark: '#c2410c' }  // Orange
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const vx = (Math.random() - 0.5) * 1.2;
    const vy = -Math.random() * 0.6 - 0.3;
    
    balloons.push(new Balloon(e.clientX, e.clientY, radius, vx, vy, color));
});

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
    }

    update() {
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
            this.y = canvas.height + this.radius + 20;
            this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.vy = -Math.random() * 0.4 - 0.2;
            this.vx = (Math.random() - 0.5) * 0.4;
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
        ctx.save();
        ctx.translate(this.x, this.y);

        const r = this.radius;
        const shadowDist = (canvas.height - this.y) * 0.25;
        const shadowY = Math.max(r * 1.2, shadowDist);
        const shadowAlpha = Math.max(0.02, 0.16 * (1 - this.y / canvas.height));

        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.beginPath();
        ctx.ellipse(0, shadowY, r * 0.95, r * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Pass 2: Solid 3D Balloon Sphere Body Layer
    drawBody() {
        ctx.save();
        ctx.translate(this.x, this.y);

        const r = this.radius;

        // Draw Solid Round 3D Balloon Orb
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);

        // 3D Spherical Radial Gradient Fill
        const grad = ctx.createRadialGradient(
            -r * 0.35, -r * 0.35, r * 0.05,
            -r * 0.1, -r * 0.1, r * 1.15
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, this.color.light);
        grad.addColorStop(0.75, this.color.main);
        grad.addColorStop(1, this.color.dark);

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Soft Specular Glossy Highlight
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();

        ctx.restore();
    }
}

// Instantiate initial set of balloons
const balloons = [];
const colorPalette = [
    { main: '#4285F4', light: '#93bbfd', dark: '#1d5ec4' }, // Blue
    { main: '#DB4437', light: '#f59890', dark: '#a82015' }, // Red
    { main: '#F4B400', light: '#fce38a', dark: '#b88500' }, // Yellow
    { main: '#0F9D58', light: '#74e3a9', dark: '#086337' }, // Green
    { main: '#ea580c', light: '#ffedd5', dark: '#c2410c' }  // Orange
];

for (let i = 0; i < 6; i++) {
    const radius = Math.random() * 15 + 42;
    const x = Math.random() * (canvas.width - radius * 4) + radius * 2;
    const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
    const vx = (Math.random() - 0.5) * 0.6;
    const vy = -Math.random() * 0.5 - 0.2;
    const color = colorPalette[i % colorPalette.length];

    balloons.push(new Balloon(x, y, radius, vx, vy, color));
}

// 2-Pass Animation Loop: Shadows first, then Balloon Bodies
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balloons.length; i++) {
        balloons[i].update();
    }
    for (let i = 0; i < balloons.length; i++) {
        balloons[i].drawShadow();
    }
    for (let i = 0; i < balloons.length; i++) {
        balloons[i].drawBody();
    }
}

animate();

// --- Typewriter Effect with Balloon Color Cycling & Deletion Modes ---
const phrases = [
    "personal website.",
    "portfolio.",
    "resume.",
    "certifications.",
    "projects."
];

const balloonAccentPalette = [
    { main: '#4285F4', light: '#dbeaff' }, // Blue
    { main: '#DB4437', light: '#fde8e8' }, // Red
    { main: '#d97706', light: '#fef3c7' }, // Gold/Yellow
    { main: '#0F9D58', light: '#dcfce7' }, // Green
    { main: '#ea580c', light: '#ffedd5' }  // Orange
];

let currentAccentIndex = 4;
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isSelectDeleteMode = false;
let isHighlighting = false;

function cycleRandomAccentColor() {
    let nextIndex = currentAccentIndex;
    while (nextIndex === currentAccentIndex && balloonAccentPalette.length > 1) {
        nextIndex = Math.floor(Math.random() * balloonAccentPalette.length);
    }
    currentAccentIndex = nextIndex;
    const accent = balloonAccentPalette[currentAccentIndex];

    const typewriterEl = document.getElementById('typewriter');
    const cursorEl = document.querySelector('.cursor');
    const pressBtn = document.getElementById('press-btn');

    if (typewriterEl) {
        typewriterEl.style.color = accent.main;
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cycleRandomAccentColor();
        typeEffect();
    });
} else {
    cycleRandomAccentColor();
    typeEffect();
}