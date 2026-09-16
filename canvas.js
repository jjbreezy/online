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

    // Standard, Rare, and Specialty Balloon Palettes
    const standardBalloonColors = [
        { main: '#4285F4', light: '#93bbfd', dark: '#1d5ec4' }, // Blue
        { main: '#DB4437', light: '#f59890', dark: '#a82015' }, // Red
        { main: '#F4B400', light: '#fce38a', dark: '#b88500' }, // Yellow
        { main: '#0F9D58', light: '#74e3a9', dark: '#086337' }, // Google Green
        { main: '#10b981', light: '#a7f3d0', dark: '#047857' }, // Mint Emerald Green
        { main: '#84cc16', light: '#d9f99d', dark: '#4d7c0f' }, // Lime Green
        { main: '#ea580c', light: '#ffedd5', dark: '#c2410c' }  // Orange
    ];

    const rareBalloonColors = [
        { main: '#e1306c', light: '#ff85b3', dark: '#9b1544', rare: 'pink' },       // Hot Pink
        { main: '#a855f7', light: '#7dd3fc', dark: '#c084fc', rare: 'iridescent' }, // Opalescent Iridescent
        { main: '#ff2a6d', light: '#ffd700', dark: '#0056ff', rare: 'rainbow' },    // Horizontal Striped Rainbow
        { main: '#f59e0b', light: '#fef3c7', dark: '#78350f', rare: 'gold' },       // Metallic Gold with Chrome Reflection
        { main: '#94a3b8', light: '#f8fafc', dark: '#334155', rare: 'silver' },     // Metallic Silver with Chrome Reflection
        { main: '#059669', light: '#a7f3d0', dark: '#064e3b', rare: 'emerald' }     // Metallic Emerald with Chrome Reflection
    ];

    const specialtyBalloonTypes = [
        { main: '#facc15', light: '#fef9c3', dark: '#ca8a04', rare: 'smiley' },     // Classic Smiley Face
        { main: '#0284c7', light: '#7dd3fc', dark: '#0c4a6e', rare: 'earth' },      // Earth Globe
        { main: '#dc2626', light: '#fee2e2', dark: '#991b1b', rare: 'beachball' },  // Summer Beach Ball
        { main: '#94a3b8', light: '#f8fafc', dark: '#334155', rare: 'discoball' },  // Disco Mirror Ball
        { main: '#38bdf8', light: '#fdf4ff', dark: '#0369a1', rare: 'bubble' },     // Translucent Soap Bubble
        { main: '#ea580c', light: '#ffedd5', dark: '#7c2d12', rare: 'basketball' }, // Classic Basketball
        { main: '#84cc16', light: '#ecfccb', dark: '#3f6212', rare: 'tennisball' }, // Neon Tennis Ball
        { main: '#16a34a', light: '#dcfce7', dark: '#052e16', rare: 'watermelon' }  // Striped Watermelon
    ];

    function getRandomBalloonColor() {
        const rand = Math.random();
        // 40% Specialty balloons, 20% Classic rare balloons, 40% Standard solid balloons
        if (rand < 0.40) {
            return specialtyBalloonTypes[Math.floor(Math.random() * specialtyBalloonTypes.length)];
        } else if (rand < 0.60) {
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

        // 2. Truly Metallic Gold, Silver & Emerald with Chrome Reflections
        if (colorDef.rare === 'gold' || colorDef.rare === 'silver' || colorDef.rare === 'emerald') {
            const isGold = colorDef.rare === 'gold';
            const isEmerald = colorDef.rare === 'emerald';
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
            } else if (isEmerald) {
                grad.addColorStop(0, '#ffffff');       // Chrome Specular Peak
                grad.addColorStop(0.12, '#ecfdf5');    // Highlight Emerald Mint
                grad.addColorStop(0.35, '#10b981');    // Mid Emerald
                grad.addColorStop(0.55, '#ffffff');    // Horizon Mirror Line
                grad.addColorStop(0.72, '#047857');    // Deep Emerald Shadow
                grad.addColorStop(0.92, '#34d399');    // Metallic Rim Light
                grad.addColorStop(1, '#064e3b');       // Edge Shadow
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
            sCtx.fillStyle = isGold ? 'rgba(254, 243, 199, 0.45)' : (isEmerald ? 'rgba(167, 243, 208, 0.45)' : 'rgba(255, 255, 255, 0.45)');
            sCtx.fill();

            sCtx.restore();
            return sprite;
        }

        // 4. Classic Smiley Face Balloon
        if (colorDef.rare === 'smiley') {
            // Ambient drop shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.08)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#ca8a04';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            // Warm Spherical Sun-Yellow Gradient
            const grad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                -r * 0.1, -r * 0.1, r * 1.15
            );
            grad.addColorStop(0, '#fffdf0');
            grad.addColorStop(0.22, '#fde047');
            grad.addColorStop(0.68, '#eab308');
            grad.addColorStop(0.88, '#ca8a04');
            grad.addColorStop(1, '#a16207');

            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fillStyle = grad;
            sCtx.fill();

            // Rosy Peach Blush Cheeks
            sCtx.fillStyle = 'rgba(244, 63, 94, 0.28)';
            sCtx.beginPath();
            sCtx.ellipse(-r * 0.44, r * 0.14, r * 0.16, r * 0.10, -0.08, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.beginPath();
            sCtx.ellipse(r * 0.44, r * 0.14, r * 0.16, r * 0.10, 0.08, 0, Math.PI * 2);
            sCtx.fill();

            // Friendly Oval Eyes (Midnight Charcoal)
            sCtx.fillStyle = '#1e1b4b';
            sCtx.beginPath();
            sCtx.ellipse(-r * 0.28, -r * 0.13, r * 0.088, r * 0.145, 0, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.beginPath();
            sCtx.ellipse(r * 0.28, -r * 0.13, r * 0.088, r * 0.145, 0, 0, Math.PI * 2);
            sCtx.fill();

            // Specular Eye Glints (Primary & Secondary Shines)
            sCtx.fillStyle = '#ffffff';
            sCtx.beginPath();
            sCtx.arc(-r * 0.31, -r * 0.18, r * 0.04, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.beginPath();
            sCtx.arc(r * 0.25, -r * 0.18, r * 0.04, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.beginPath();
            sCtx.arc(-r * 0.24, -r * 0.08, r * 0.02, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.beginPath();
            sCtx.arc(r * 0.32, -r * 0.08, r * 0.02, 0, Math.PI * 2);
            sCtx.fill();

            // Beaming Smile Arc
            sCtx.strokeStyle = '#1e1b4b';
            sCtx.lineWidth = r * 0.08;
            sCtx.lineCap = 'round';
            sCtx.beginPath();
            sCtx.arc(0, -r * 0.02, r * 0.42, Math.PI * 0.18, Math.PI * 0.82, false);
            sCtx.stroke();

            // Smile Dimple Accents
            sCtx.lineWidth = r * 0.055;
            sCtx.beginPath();
            sCtx.moveTo(-r * 0.39, r * 0.15);
            sCtx.lineTo(-r * 0.35, r * 0.22);
            sCtx.moveTo(r * 0.39, r * 0.15);
            sCtx.lineTo(r * 0.35, r * 0.22);
            sCtx.stroke();

            // Soft Specular Glossy Highlight
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.72)';
            sCtx.fill();

            sCtx.restore();
            return sprite;
        }

        // 5. Earth Globe Balloon
        if (colorDef.rare === 'earth') {
            // Ambient drop shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.12)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#0c4a6e';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            // Vibrant Ocean Gradient
            const oceanGrad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            oceanGrad.addColorStop(0, '#38bdf8');
            oceanGrad.addColorStop(0.25, '#0284c7');
            oceanGrad.addColorStop(0.65, '#0369a1');
            oceanGrad.addColorStop(0.9, '#075985');
            oceanGrad.addColorStop(1, '#0c4a6e');

            sCtx.fillStyle = oceanGrad;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Continents: Stylized Emerald & Forest Green Landmasses
            sCtx.fillStyle = '#10b981';
            sCtx.strokeStyle = '#059669';
            sCtx.lineWidth = 3;

            // North America
            sCtx.beginPath();
            sCtx.moveTo(-r * 0.72, -r * 0.65);
            sCtx.bezierCurveTo(-r * 0.55, -r * 0.78, -r * 0.25, -r * 0.72, -r * 0.18, -r * 0.55);
            sCtx.bezierCurveTo(-r * 0.12, -r * 0.40, -r * 0.25, -r * 0.32, -r * 0.22, -r * 0.18);
            sCtx.bezierCurveTo(-r * 0.30, -r * 0.05, -r * 0.38, -r * 0.10, -r * 0.45, -r * 0.12);
            sCtx.bezierCurveTo(-r * 0.58, -r * 0.15, -r * 0.75, -r * 0.35, -r * 0.82, -r * 0.48);
            sCtx.closePath();
            sCtx.fill();
            sCtx.stroke();

            // Greenland
            sCtx.beginPath();
            sCtx.ellipse(-r * 0.12, -r * 0.68, r * 0.11, r * 0.07, 0.3, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.stroke();

            // South America
            sCtx.beginPath();
            sCtx.moveTo(-r * 0.24, -r * 0.06);
            sCtx.bezierCurveTo(-r * 0.08, -r * 0.02, -r * 0.05, r * 0.18, -r * 0.14, r * 0.42);
            sCtx.bezierCurveTo(-r * 0.18, r * 0.58, -r * 0.26, r * 0.68, -r * 0.32, r * 0.66);
            sCtx.bezierCurveTo(-r * 0.38, r * 0.52, -r * 0.35, r * 0.25, -r * 0.32, r * 0.10);
            sCtx.closePath();
            sCtx.fill();
            sCtx.stroke();

            // Eurasia
            sCtx.beginPath();
            sCtx.moveTo(r * 0.08, -r * 0.58);
            sCtx.bezierCurveTo(r * 0.25, -r * 0.68, r * 0.62, -r * 0.62, r * 0.78, -r * 0.42);
            sCtx.bezierCurveTo(r * 0.85, -r * 0.22, r * 0.72, -r * 0.12, r * 0.58, -r * 0.10);
            sCtx.bezierCurveTo(r * 0.45, -r * 0.05, r * 0.38, -r * 0.18, r * 0.22, -r * 0.22);
            sCtx.bezierCurveTo(r * 0.12, -r * 0.25, r * 0.04, -r * 0.42, r * 0.08, -r * 0.58);
            sCtx.closePath();
            sCtx.fill();
            sCtx.stroke();

            // Africa
            sCtx.beginPath();
            sCtx.moveTo(r * 0.14, -r * 0.16);
            sCtx.bezierCurveTo(r * 0.35, -r * 0.14, r * 0.42, 0, r * 0.38, r * 0.22);
            sCtx.bezierCurveTo(r * 0.32, r * 0.45, r * 0.20, r * 0.55, r * 0.15, r * 0.48);
            sCtx.bezierCurveTo(r * 0.06, r * 0.32, r * 0.04, r * 0.08, r * 0.14, -r * 0.16);
            sCtx.closePath();
            sCtx.fill();
            sCtx.stroke();

            // Australia
            sCtx.beginPath();
            sCtx.ellipse(r * 0.62, r * 0.42, r * 0.14, r * 0.09, -0.2, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.stroke();

            // Swirling Translucent Clouds
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            // Equatorial Cloud Bands
            sCtx.beginPath();
            sCtx.ellipse(-r * 0.15, -r * 0.28, r * 0.45, r * 0.06, 0.2, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.beginPath();
            sCtx.ellipse(r * 0.35, r * 0.12, r * 0.38, r * 0.05, -0.15, 0, Math.PI * 2);
            sCtx.fill();

            // Polar Caps
            sCtx.fillStyle = 'rgba(248, 250, 252, 0.88)';
            sCtx.beginPath();
            sCtx.ellipse(0, -r * 0.88, r * 0.42, r * 0.14, 0, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.beginPath();
            sCtx.ellipse(0, r * 0.90, r * 0.48, r * 0.15, 0, 0, Math.PI * 2);
            sCtx.fill();

            // 3D Planetary Sphere Shading (Day/Night depth)
            const planetShade = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            planetShade.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
            planetShade.addColorStop(0.35, 'rgba(255, 255, 255, 0.0)');
            planetShade.addColorStop(0.72, 'rgba(7, 35, 60, 0.35)');
            planetShade.addColorStop(1, 'rgba(3, 16, 30, 0.72)');

            sCtx.fillStyle = planetShade;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Specular Ocean Sun Glint
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.16, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            sCtx.fill();

            sCtx.restore(); // end clip

            // Atmospheric Cyan Corona Rim Glow
            const corona = sCtx.createRadialGradient(0, 0, r * 0.85, 0, 0, r * 1.05);
            corona.addColorStop(0, 'rgba(56, 189, 248, 0)');
            corona.addColorStop(0.8, 'rgba(56, 189, 248, 0.38)');
            corona.addColorStop(1, 'rgba(14, 165, 233, 0)');
            sCtx.fillStyle = corona;
            sCtx.beginPath();
            sCtx.arc(0, 0, r * 1.05, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.restore(); // end translate
            return sprite;
        }

        // 6. Summer Beach Ball
        if (colorDef.rare === 'beachball') {
            // Ambient drop shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#991b1b';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            // 6 Vertical Curved Segments (Blue, Yellow, Red, White, Green, Orange)
            const segColors = ['#2563eb', '#facc15', '#dc2626', '#f8fafc', '#16a34a', '#ea580c'];
            sCtx.fillStyle = segColors[5];
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            const topY = -r * 0.78;
            const botY = r * 0.95;
            const xOffsets = [-r * 0.95, -r * 0.62, -r * 0.22, r * 0.22, r * 0.62, r * 0.95];

            for (let i = 0; i < 5; i++) {
                sCtx.fillStyle = segColors[i];
                sCtx.beginPath();
                sCtx.moveTo(0, topY);
                sCtx.bezierCurveTo(xOffsets[i] * 1.15, -r * 0.15, xOffsets[i] * 1.15, r * 0.45, 0, botY);
                sCtx.bezierCurveTo(xOffsets[i + 1] * 1.15, r * 0.45, xOffsets[i + 1] * 1.15, -r * 0.15, 0, topY);
                sCtx.closePath();
                sCtx.fill();
            }

            // Top White Valve Hub Cap
            sCtx.beginPath();
            sCtx.ellipse(0, topY, r * 0.24, r * 0.12, 0, 0, Math.PI * 2);
            sCtx.fillStyle = '#ffffff';
            sCtx.fill();
            sCtx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
            sCtx.lineWidth = 2;
            sCtx.stroke();

            // Valve center dot
            sCtx.beginPath();
            sCtx.arc(0, topY, r * 0.05, 0, Math.PI * 2);
            sCtx.fillStyle = '#cbd5e1';
            sCtx.fill();

            // 3D Spherical Volume Shading Overlay
            const sphereShade = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
            sphereShade.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
            sphereShade.addColorStop(0.72, 'rgba(0, 0, 0, 0.12)');
            sphereShade.addColorStop(1, 'rgba(0, 0, 0, 0.48)');

            sCtx.fillStyle = sphereShade;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Specular Gloss
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            sCtx.fill();

            sCtx.restore(); // end clip
            sCtx.restore(); // end translate
            return sprite;
        }

        // 7. Disco Mirror Ball
        if (colorDef.rare === 'discoball') {
            // Ambient drop shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            sCtx.shadowBlur = 60;
            sCtx.shadowOffsetY = 24;
            sCtx.fillStyle = '#334155';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            // Chrome Silver Base
            const baseGrad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.1
            );
            baseGrad.addColorStop(0, '#ffffff');
            baseGrad.addColorStop(0.3, '#cbd5e1');
            baseGrad.addColorStop(0.7, '#64748b');
            baseGrad.addColorStop(1, '#1e293b');
            sCtx.fillStyle = baseGrad;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Faceted Mirror Tiles
            const rows = 13;
            const facetTones = [
                '#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', 
                '#94a3b8', '#64748b', '#cbd5e1', '#f1f5f9', 
                '#e0f2fe', '#f8fafc', '#94a3b8', '#ffffff'
            ];

            for (let row = 0; row < rows; row++) {
                const y1Norm = (row / rows) * 2 - 1;
                const y2Norm = ((row + 1) / rows) * 2 - 1;
                const y1 = y1Norm * r * 0.94;
                const y2 = y2Norm * r * 0.94;
                const rowH = y2 - y1;

                const midY = (y1 + y2) / 2;
                const rowR = Math.sqrt(Math.max(0, r * r - midY * midY));
                const cols = Math.max(5, Math.floor((rowR / r) * 14));

                for (let col = 0; col < cols; col++) {
                    const x1 = ((col / cols) * 2 - 1) * rowR;
                    const x2 = (((col + 1) / cols) * 2 - 1) * rowR;
                    const tileW = x2 - x1;

                    const dx = (x1 + x2) / 2 - (-r * 0.4);
                    const dy = midY - (-r * 0.4);
                    const distToLight = Math.sqrt(dx * dx + dy * dy) / (r * 1.8);
                    
                    const toneIdx = Math.abs((row * 7 + col * 11 + Math.floor(distToLight * 10)) % facetTones.length);
                    sCtx.fillStyle = facetTones[toneIdx];
                    sCtx.fillRect(x1 + 1, y1 + 1, Math.max(1, tileW - 1.5), Math.max(1, rowH - 1.5));
                }
            }

            // Grout Mesh Grid Lines
            sCtx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
            sCtx.lineWidth = 1;
            for (let row = 0; row <= rows; row++) {
                const yNorm = (row / rows) * 2 - 1;
                const y = yNorm * r * 0.94;
                const rowR = Math.sqrt(Math.max(0, r * r - y * y));
                sCtx.beginPath();
                sCtx.ellipse(0, y, rowR, rowR * 0.22, 0, 0, Math.PI * 2);
                sCtx.stroke();
            }

            // Spherical Chrome Contrast Overlay
            const sphereOverlay = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            sphereOverlay.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
            sphereOverlay.addColorStop(0.25, 'rgba(255, 255, 255, 0.05)');
            sphereOverlay.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
            sphereOverlay.addColorStop(1, 'rgba(15, 23, 42, 0.6)');
            sCtx.fillStyle = sphereOverlay;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Sparkling 4-Point Star Glints
            function drawStarGlint(gx, gy, size) {
                sCtx.save();
                sCtx.translate(gx, gy);
                sCtx.fillStyle = '#ffffff';
                sCtx.shadowColor = 'rgba(255, 255, 255, 0.9)';
                sCtx.shadowBlur = 12;

                sCtx.beginPath();
                sCtx.moveTo(0, -size);
                sCtx.quadraticCurveTo(0, 0, size, 0);
                sCtx.quadraticCurveTo(0, 0, 0, size);
                sCtx.quadraticCurveTo(0, 0, -size, 0);
                sCtx.quadraticCurveTo(0, 0, 0, -size);
                sCtx.fill();

                sCtx.beginPath();
                sCtx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
                sCtx.fill();
                sCtx.restore();
            }

            drawStarGlint(-r * 0.38, -r * 0.38, r * 0.24);
            drawStarGlint(r * 0.22, -r * 0.28, r * 0.14);
            drawStarGlint(-r * 0.15, r * 0.25, r * 0.12);

            sCtx.restore(); // end clip
            sCtx.restore(); // end translate
            return sprite;
        }

        // 8. Translucent Soap Bubble
        if (colorDef.rare === 'bubble') {
            // Ethereal subtle shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(56, 189, 248, 0.15)';
            sCtx.shadowBlur = 45;
            sCtx.shadowOffsetY = 15;
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            sCtx.fill();
            sCtx.restore();

            // Very light glassy interior
            const glass = sCtx.createRadialGradient(
                -r * 0.25, -r * 0.25, r * 0.05,
                0, 0, r
            );
            glass.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
            glass.addColorStop(0.5, 'rgba(224, 242, 254, 0.04)');
            glass.addColorStop(0.85, 'rgba(240, 249, 255, 0.12)');
            glass.addColorStop(1, 'rgba(255, 255, 255, 0.32)');

            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fillStyle = glass;
            sCtx.fill();

            // Thin-Film Iridescent Rainbow Rim
            const rimViolet = sCtx.createRadialGradient(0, 0, r * 0.82, 0, 0, r);
            rimViolet.addColorStop(0, 'rgba(236, 72, 153, 0)');
            rimViolet.addColorStop(0.5, 'rgba(236, 72, 153, 0.35)');
            rimViolet.addColorStop(0.85, 'rgba(168, 85, 247, 0.45)');
            rimViolet.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
            sCtx.fillStyle = rimViolet;
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();

            const rimCyan = sCtx.createRadialGradient(r * 0.1, r * 0.1, r * 0.8, 0, 0, r * 1.02);
            rimCyan.addColorStop(0, 'rgba(56, 189, 248, 0)');
            rimCyan.addColorStop(0.4, 'rgba(56, 189, 248, 0.4)');
            rimCyan.addColorStop(0.75, 'rgba(74, 222, 128, 0.35)');
            rimCyan.addColorStop(0.92, 'rgba(250, 204, 21, 0.4)');
            rimCyan.addColorStop(1, 'rgba(56, 189, 248, 0)');
            sCtx.fillStyle = rimCyan;
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();

            // Thin Outer Glass Border
            sCtx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            sCtx.lineWidth = 2.5;
            sCtx.beginPath();
            sCtx.arc(0, 0, r - 1, 0, Math.PI * 2);
            sCtx.stroke();

            // Primary Specular Crescent (Top-Left)
            sCtx.beginPath();
            sCtx.ellipse(-r * 0.48, -r * 0.48, r * 0.36, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            sCtx.fill();

            // Secondary Specular Glint Spot
            sCtx.beginPath();
            sCtx.arc(-r * 0.68, -r * 0.22, r * 0.05, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            sCtx.fill();

            // Bottom-Right Counter-Reflection Arc
            sCtx.beginPath();
            sCtx.ellipse(r * 0.46, r * 0.46, r * 0.28, r * 0.08, -Math.PI / 4, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.48)';
            sCtx.fill();

            sCtx.restore();
            return sprite;
        }

        // 9. Classic Basketball
        if (colorDef.rare === 'basketball') {
            // Ambient drop shadow
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.12)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#7c2d12';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            // Leather Base Radial Gradient
            const bballGrad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.08
            );
            bballGrad.addColorStop(0, '#fb923c');
            bballGrad.addColorStop(0.25, '#ea580c');
            bballGrad.addColorStop(0.7, '#c2410c');
            bballGrad.addColorStop(0.9, '#9a3412');
            bballGrad.addColorStop(1, '#431407');

            sCtx.fillStyle = bballGrad;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Pebbled Texture Stippling
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            for (let i = 0; i < 240; i++) {
                const angle = (i * 137.5) * (Math.PI / 180);
                const dist = Math.sqrt(i / 240) * (r * 0.94);
                const px = Math.cos(angle) * dist;
                const py = Math.sin(angle) * dist;
                sCtx.fillRect(px, py, 2.2, 2.2);
            }

            // Dark Embossed Seams
            sCtx.strokeStyle = '#18181b';
            sCtx.lineWidth = r * 0.045;
            sCtx.lineCap = 'round';

            // Vertical Center Seam
            sCtx.beginPath();
            sCtx.moveTo(0, -r);
            sCtx.lineTo(0, r);
            sCtx.stroke();

            // Horizontal Equator Seam
            sCtx.beginPath();
            sCtx.moveTo(-r, 0);
            sCtx.lineTo(r, 0);
            sCtx.stroke();

            // Left Curved Seam
            sCtx.beginPath();
            sCtx.moveTo(-r * 0.72, -r * 0.7);
            sCtx.bezierCurveTo(-r * 0.28, -r * 0.32, -r * 0.28, r * 0.32, -r * 0.72, r * 0.7);
            sCtx.stroke();

            // Right Curved Seam
            sCtx.beginPath();
            sCtx.moveTo(r * 0.72, -r * 0.7);
            sCtx.bezierCurveTo(r * 0.28, -r * 0.32, r * 0.28, r * 0.32, r * 0.72, r * 0.7);
            sCtx.stroke();

            // 3D Spherical Volume Shading Overlay
            const sphereShade = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
            sphereShade.addColorStop(0.25, 'rgba(255, 255, 255, 0.05)');
            sphereShade.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
            sphereShade.addColorStop(1, 'rgba(0, 0, 0, 0.55)');

            sCtx.fillStyle = sphereShade;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Specular Highlight Spot
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            sCtx.fill();

            sCtx.restore(); // end clip
            sCtx.restore(); // end translate
            return sprite;
        }

        // 10. Neon Tennis Ball
        if (colorDef.rare === 'tennisball') {
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.12)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#4d7c0f';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            // Neon Chartreuse Felt Gradient
            const tennisGrad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.08
            );
            tennisGrad.addColorStop(0, '#f7fee7');
            tennisGrad.addColorStop(0.25, '#d9f99d');
            tennisGrad.addColorStop(0.65, '#a3e635');
            tennisGrad.addColorStop(0.88, '#65a30d');
            tennisGrad.addColorStop(1, '#365314');

            sCtx.fillStyle = tennisGrad;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Fuzzy Felt Stippling Texture
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            for (let i = 0; i < 280; i++) {
                const angle = (i * 137.5) * (Math.PI / 180);
                const dist = Math.sqrt(i / 280) * (r * 0.94);
                const px = Math.cos(angle) * dist;
                const py = Math.sin(angle) * dist;
                sCtx.fillRect(px, py, 1.8, 1.8);
            }

            // Curved Tennis Ball Seams with Grooved Shadow
            sCtx.strokeStyle = 'rgba(63, 98, 18, 0.6)';
            sCtx.lineWidth = r * 0.065;
            sCtx.lineCap = 'round';

            // Left Curved Seam Shadow
            sCtx.beginPath();
            sCtx.moveTo(-r * 0.62, -r * 0.72);
            sCtx.bezierCurveTo(-r * 0.1, -r * 0.38, -r * 0.1, r * 0.38, -r * 0.62, r * 0.72);
            sCtx.stroke();

            // Right Curved Seam Shadow
            sCtx.beginPath();
            sCtx.moveTo(r * 0.62, -r * 0.72);
            sCtx.bezierCurveTo(r * 0.1, -r * 0.38, r * 0.1, r * 0.38, r * 0.62, r * 0.72);
            sCtx.stroke();

            // Crisp Off-White Tennis Seams
            sCtx.strokeStyle = '#f8fafc';
            sCtx.lineWidth = r * 0.045;

            sCtx.beginPath();
            sCtx.moveTo(-r * 0.62, -r * 0.72);
            sCtx.bezierCurveTo(-r * 0.1, -r * 0.38, -r * 0.1, r * 0.38, -r * 0.62, r * 0.72);
            sCtx.stroke();

            sCtx.beginPath();
            sCtx.moveTo(r * 0.62, -r * 0.72);
            sCtx.bezierCurveTo(r * 0.1, -r * 0.38, r * 0.1, r * 0.38, r * 0.62, r * 0.72);
            sCtx.stroke();

            // 3D Spherical Volume Overlay
            const sphereShade = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
            sphereShade.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
            sphereShade.addColorStop(0.72, 'rgba(0, 0, 0, 0.1)');
            sphereShade.addColorStop(1, 'rgba(20, 40, 5, 0.45)');

            sCtx.fillStyle = sphereShade;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Specular Highlight
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            sCtx.fill();

            sCtx.restore(); // end clip
            sCtx.restore(); // end translate
            return sprite;
        }

        // 11. Summer Watermelon Balloon
        if (colorDef.rare === 'watermelon') {
            sCtx.save();
            sCtx.shadowColor = 'rgba(0, 0, 0, 0.14)';
            sCtx.shadowBlur = 58;
            sCtx.shadowOffsetY = 22;
            sCtx.fillStyle = '#064e3b';
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();

            sCtx.save();
            sCtx.beginPath();
            sCtx.arc(0, 0, r, 0, Math.PI * 2);
            sCtx.clip();

            // Vibrant Green Rind Gradient
            const rindGrad = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.08
            );
            rindGrad.addColorStop(0, '#bbf7d0');
            rindGrad.addColorStop(0.25, '#4ade80');
            rindGrad.addColorStop(0.65, '#16a34a');
            rindGrad.addColorStop(0.88, '#15803d');
            rindGrad.addColorStop(1, '#064e3b');

            sCtx.fillStyle = rindGrad;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Dark Forest Green Wavy Tiger Rind Stripes
            sCtx.strokeStyle = '#052e16';
            sCtx.lineWidth = r * 0.085;
            sCtx.lineCap = 'round';
            sCtx.lineJoin = 'round';

            const stripeXCoords = [-0.75, -0.48, -0.22, 0.05, 0.32, 0.58, 0.78];
            for (let i = 0; i < stripeXCoords.length; i++) {
                const sx = stripeXCoords[i] * r;
                sCtx.beginPath();
                sCtx.moveTo(0, -r * 0.95);
                sCtx.bezierCurveTo(sx * 1.25, -r * 0.5, sx * 0.8, -r * 0.1, sx, r * 0.15);
                sCtx.bezierCurveTo(sx * 1.15, r * 0.45, sx * 0.7, r * 0.75, 0, r * 0.95);
                sCtx.stroke();
            }

            // Small stem circle at top pole
            sCtx.beginPath();
            sCtx.ellipse(0, -r * 0.88, r * 0.07, r * 0.04, 0, 0, Math.PI * 2);
            sCtx.fillStyle = '#78350f';
            sCtx.fill();

            // 3D Spherical Volume Overlay
            const sphereShade = sCtx.createRadialGradient(
                -r * 0.35, -r * 0.35, r * 0.05,
                0, 0, r * 1.05
            );
            sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
            sphereShade.addColorStop(0.28, 'rgba(255, 255, 255, 0.08)');
            sphereShade.addColorStop(0.72, 'rgba(0, 0, 0, 0.12)');
            sphereShade.addColorStop(1, 'rgba(2, 44, 20, 0.55)');

            sCtx.fillStyle = sphereShade;
            sCtx.fillRect(-r, -r, r * 2, r * 2);

            // Specular Gloss
            sCtx.beginPath();
            sCtx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.82)';
            sCtx.fill();

            sCtx.restore(); // end clip
            sCtx.restore(); // end translate
            return sprite;
        }

        // 12. Standard & Pink/Iridescent Spherical Balloon
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
        const allColors = [...standardBalloonColors, ...rareBalloonColors, ...specialtyBalloonTypes];
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
            let shadowAlpha = Math.max(0.02, 0.16 * (1 - this.y / canvas.height)) * this.opacity;
            if (this.color.rare === 'bubble') {
                shadowAlpha *= 0.3; // Ethereal subtle shadow for translucent soap bubble
            }

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
            const tilt = Math.sin(this.swayAngle) * 0.08;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(tilt);

            if (this.opacity < 0.999) {
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.drawImage(sprite, -SPRITE_CENTER_X * scale, -SPRITE_CENTER_Y * scale, w, h);
                ctx.globalAlpha = 1.0;
            } else {
                ctx.drawImage(sprite, -SPRITE_CENTER_X * scale, -SPRITE_CENTER_Y * scale, w, h);
            }
            ctx.restore();
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
    // Standard Common Themes (includes 3 rich greens!)
    { main: '#4285F4', light: '#dbeaff', type: 'standard' },
    { main: '#DB4437', light: '#fde8e8', type: 'standard' },
    { main: '#d97706', light: '#fef3c7', type: 'standard' },
    { main: '#0F9D58', light: '#dcfce7', type: 'standard' }, // Google Green
    { main: '#10b981', light: '#d1fae5', type: 'standard' }, // Mint Emerald Green
    { main: '#84cc16', light: '#ecfccb', type: 'standard' }, // Lime Green
    { main: '#ea580c', light: '#ffedd5', type: 'standard' },
    // Rare Themes
    { main: '#e1306c', light: '#fce7f3', type: 'pink' },
    { main: '#a855f7', light: '#f3e8ff', type: 'iridescent' },
    { main: '#ff2a6d', light: '#ffe4e6', type: 'rainbow' },
    { main: '#b45309', light: '#fef3c7', type: 'gold' },
    { main: '#64748b', light: '#f1f5f9', type: 'silver' },
    { main: '#059669', light: '#d1fae5', type: 'emerald' }, // Metallic Emerald
    // Specialty Balloon Themes
    { main: '#ca8a04', light: '#fef9c3', type: 'smiley' },
    { main: '#0284c7', light: '#e0f2fe', type: 'earth' },
    { main: '#dc2626', light: '#fee2e2', type: 'beachball' },
    { main: '#64748b', light: '#f1f5f9', type: 'discoball' },
    { main: '#0284c7', light: '#fdf4ff', type: 'bubble' },
    { main: '#ea580c', light: '#ffedd5', type: 'basketball' },
    { main: '#65a30d', light: '#ecfccb', type: 'tennisball' }, // Neon Tennis Ball
    { main: '#15803d', light: '#dcfce7', type: 'watermelon' }  // Striped Watermelon
];

let currentAccentIndex = 3;
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isSelectDeleteMode = false;
let isHighlighting = false;

function cycleRandomAccentColor() {
    let nextIndex = currentAccentIndex;
    const rand = Math.random();
    if (rand < 0.40) {
        // Specialty theme (indices 13 to 20)
        nextIndex = 13 + Math.floor(Math.random() * 8);
    } else if (rand < 0.65) {
        // Rare theme (indices 7 to 12)
        nextIndex = 7 + Math.floor(Math.random() * 6);
    } else {
        // Standard theme (indices 0 to 6)
        nextIndex = Math.floor(Math.random() * 7);
    }
    currentAccentIndex = nextIndex;
    const accent = balloonAccentPalette[currentAccentIndex];

    const typewriterEl = document.getElementById('typewriter');
    const cursorEl = document.querySelector('.cursor');
    const pressBtn = document.getElementById('press-btn');

    if (typewriterEl) {
        typewriterEl.classList.remove(
            'rainbow-text', 'iridescent-text', 'gold-text', 'silver-text',
            'earth-text', 'discoball-text', 'bubble-text', 'beachball-text',
            'emerald-text'
        );
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
        } else if (accent.type === 'emerald') {
            typewriterEl.classList.add('emerald-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'earth') {
            typewriterEl.classList.add('earth-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'discoball') {
            typewriterEl.classList.add('discoball-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'bubble') {
            typewriterEl.classList.add('bubble-text');
            typewriterEl.style.color = '';
        } else if (accent.type === 'beachball') {
            typewriterEl.classList.add('beachball-text');
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