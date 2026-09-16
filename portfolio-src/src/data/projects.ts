export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  poster?: string;
  caption: string;
}

export type ModelType = 'book' | 'chair' | 'synth' | 'camera' | 'sculpture' | 'vessel';

export interface ProjectModelConfig {
  type: ModelType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  roughness: number;
  metalness: number;
  scale?: [number, number, number];
  rotationOffset?: [number, number, number];
}

export interface ProjectItem {
  id: string;
  indexFormatted: string;
  title: string;
  subtitle: string;
  year: string;
  discipline: string;
  location: string;
  tags: string[];
  description: string;
  specs: ProjectSpec[];
  media: ProjectMedia;
  caseStudyUrl: string;
  model: ProjectModelConfig;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'monograph-indoavt',
    indexFormatted: '01 / 06',
    title: 'Monograph Publications: Indoavt',
    subtitle: 'Editorial Print & Exhibition Monograph',
    year: '2024',
    discipline: 'Editorial Design',
    location: 'Zurich / Tokyo',
    tags: ['Print', 'Monograph', 'Swiss Grid', 'Exhibition'],
    description: 'A 384-page architectural monograph examining minimalist spatial concrete structures. Designed with Japanese Smyth-sewn binding, dual metallic Pantone inks, and translucent vellum page inserts.',
    specs: [
      { label: 'Dimensions', value: '280 × 195 × 42 mm' },
      { label: 'Paper Stock', value: '140gsm Munken Lynx' },
      { label: 'Binding', value: 'Open Smyth-Sewn' },
      { label: 'Print Edition', value: '1,200 Copies' },
    ],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
      caption: 'Foil-stamped hardcover binding with tactile linen spine',
    },
    caseStudyUrl: '#case-study-monograph',
    model: {
      type: 'book',
      primaryColor: '#d6cfc4', // warm linen cover
      secondaryColor: '#ffffff', // interior pages
      accentColor: '#1a1918', // foil embossing
      roughness: 0.85,
      metalness: 0.05,
      scale: [1.1, 1.1, 1.1],
    },
  },
  {
    id: 'bauhaus-cesca',
    indexFormatted: '02 / 06',
    title: 'Sculptural Space: Form & Structure',
    subtitle: 'Architectural Furniture Miniature & Study',
    year: '2024',
    discipline: 'Spatial Design',
    location: 'Berlin / New York',
    tags: ['Industrial', 'Bauhaus', 'Furniture', 'Curated'],
    description: 'An architectural reinterpretation of modernist tubular steel cantilever seating. Explores the tension between rigid chrome structural loops and organic woven French cane surfaces.',
    specs: [
      { label: 'Dimensions', value: '460 × 580 × 820 mm' },
      { label: 'Structure', value: 'Seamless Tubular Chrome' },
      { label: 'Seat / Back', value: 'Hand-Woven Natural Rattan' },
      { label: 'Weight', value: '6.4 kg' },
    ],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
      caption: 'Continuous cantilever frame curve in polished mirror finish',
    },
    caseStudyUrl: '#case-study-cesca',
    model: {
      type: 'chair',
      primaryColor: '#1c1b1a', // black beech frame
      secondaryColor: '#d4b382', // natural cane rattan
      accentColor: '#e0e0e0', // polished tubular chrome
      roughness: 0.25,
      metalness: 0.85,
      scale: [1.0, 1.0, 1.0],
    },
  },
  {
    id: 'analog-synth',
    indexFormatted: '03 / 06',
    title: 'Analog Waveform Synthesizer',
    subtitle: 'Physical Computing & Tactile Sound Machine',
    year: '2023',
    discipline: 'Audio & Hardware',
    location: 'Stockholm',
    tags: ['Hardware', 'Sound Design', 'Analog', 'Interface'],
    description: 'A dual-oscillator subtractive analog synthesizer encased in CNC-milled walnut and brushed bead-blasted aluminum. Features hand-tuned stepped potentiometers and low-jitter analog clock circuitry.',
    specs: [
      { label: 'Chassis', value: 'Solid Walnut & Aluminum' },
      { label: 'Oscillators', value: 'Discrete VCO with Saw/Pulse' },
      { label: 'Filter', value: '4-Pole 24dB Ladder VCF' },
      { label: 'Weight', value: '3.8 kg' },
    ],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      caption: 'Knurled aluminum control knobs with tactile 30-step detents',
    },
    caseStudyUrl: '#case-study-synth',
    model: {
      type: 'synth',
      primaryColor: '#8a5d3b', // walnut cheek panels
      secondaryColor: '#f3ede3', // cream metal faceplate
      accentColor: '#d95d39', // warm amber led & pitch strip
      roughness: 0.45,
      metalness: 0.55,
      scale: [1.15, 1.15, 1.15],
    },
  },
  {
    id: 'rangefinder-cam',
    indexFormatted: '04 / 06',
    title: 'Leica Chronos: Precision Optics',
    subtitle: 'Mechanical Rangefinder Camera Study',
    year: '2023',
    discipline: 'Industrial Design',
    location: 'Wetzlar / Tokyo',
    tags: ['Optics', 'Industrial', 'Mechanical', 'Tactile'],
    description: 'A tribute to classical mechanical rangefinder engineering. Featuring brass top plates with matte black enamel finish, coupled optical split-image rangefinder, and high-transmission aspherical glass elements.',
    specs: [
      { label: 'Body Material', value: 'Machined Brass & Magnesium' },
      { label: 'Shutter', value: 'Mechanical Cloth 1/1000s' },
      { label: 'Lens Mount', value: 'Bayonet 35mm f/1.4 Asph' },
      { label: 'Dimensions', value: '138 × 77 × 38 mm' },
    ],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      caption: 'Solid brass dials with engraved numeric indices',
    },
    caseStudyUrl: '#case-study-camera',
    model: {
      type: 'camera',
      primaryColor: '#2b2a28', // anodized matte body
      secondaryColor: '#c5c2bc', // satin chrome top plate
      accentColor: '#b32d20', // signature red dot
      roughness: 0.35,
      metalness: 0.75,
      scale: [1.2, 1.2, 1.2],
    },
  },
  {
    id: 'translucent-prism',
    indexFormatted: '05 / 06',
    title: 'Refractive Geometry: Spatial Study',
    subtitle: 'Frosted Borosilicate Glass Sculpture',
    year: '2023',
    discipline: 'Sculpture & Light',
    location: 'Venice / Kyoto',
    tags: ['Glass', 'Optics', 'Installation', 'Refraction'],
    description: 'An exploration of chromatic dispersion and caustic light phenomena. Hand-blown borosilicate glass annealed in vacuum kilns and selectively frosted using diamond-slurry sandblasting.',
    specs: [
      { label: 'Material', value: 'Optical Borosilicate 3.3' },
      { label: 'Finish', value: 'Selective Satin Frost' },
      { label: 'Refraction Index', value: 'η = 1.52 (Glass)' },
      { label: 'Dimensions', value: '220 × 220 × 260 mm' },
    ],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      caption: 'Spectral caustic refraction through frosted convex curves',
    },
    caseStudyUrl: '#case-study-sculpture',
    model: {
      type: 'sculpture',
      primaryColor: '#e8f0f2', // frosted icy glass
      secondaryColor: '#c4dbe0', // refractive caustics
      accentColor: '#5da4b8', // spectral glow
      roughness: 0.15,
      metalness: 0.1,
      scale: [1.1, 1.1, 1.1],
    },
  },
  {
    id: 'archival-vessel',
    indexFormatted: '06 / 06',
    title: 'Material Archive & Ceramic Vessels',
    subtitle: 'Stoneware Ceramics & Architectural Plinths',
    year: '2022',
    discipline: 'Ceramics & Spatial',
    location: 'Kyoto / Copenhagen',
    tags: ['Ceramics', 'Stoneware', 'Wabi-Sabi', 'Plinth'],
    description: 'Thrown on a kick wheel using iron-rich coarse stoneware clay from Shigaraki. Fired in a wood-burning Anagama kiln for 72 hours, creating unique natural fly-ash glaze deposits.',
    specs: [
      { label: 'Clay Body', value: 'Iron Coarse Shigaraki Clay' },
      { label: 'Firing', value: '72-Hour Wood Anagama 1280°C' },
      { label: 'Glaze', value: 'Natural Wood Fly-Ash & Feldspar' },
      { label: 'Plinth', value: 'Honed Pietra Serena Sandstone' },
    ],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1000&auto=format&fit=crop',
      caption: 'Natural wood-ash glaze stratification on unrefined stoneware',
    },
    caseStudyUrl: '#case-study-vessel',
    model: {
      type: 'vessel',
      primaryColor: '#c9bfb1', // warm oatmeal stoneware
      secondaryColor: '#8a7d6d', // ash glaze burn
      accentColor: '#5c5246', // iron speckle
      roughness: 0.9,
      metalness: 0.05,
      scale: [1.2, 1.2, 1.2],
    },
  },
];
