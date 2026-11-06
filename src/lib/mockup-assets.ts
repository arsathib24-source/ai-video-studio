// Embedded vector graphics and asset fallbacks matching the exact design mockup

export const MOCKUP_ASSETS = {
  // 3D AI Robot Mascot for Screen 1 (Welcome Screen)
  robotMascotSvg: `
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="robotGlow" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8b5cf6" stop-opacity="0.6"/>
          <stop offset="0.5" stop-color="#3b82f6" stop-opacity="0.3"/>
          <stop offset="1" stop-color="#06b6d4" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="ringGlow" cx="200" cy="330" r="160" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8b5cf6" stop-opacity="0.8"/>
          <stop offset="0.6" stop-color="#3b82f6" stop-opacity="0.2"/>
          <stop offset="1" stop-color="#0b101e" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bodyGrad" x1="120" y1="120" x2="280" y2="300" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffffff"/>
          <stop offset="0.5" stop-color="#e0e7ff"/>
          <stop offset="1" stop-color="#c7d2fe"/>
        </linearGradient>
        <linearGradient id="visorGrad" x1="140" y1="150" x2="260" y2="210" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0f172a"/>
          <stop offset="1" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="laptopGrad" x1="130" y1="240" x2="270" y2="310" gradientUnits="userSpaceOnUse">
          <stop stop-color="#312e81"/>
          <stop offset="1" stop-color="#4f46e5"/>
        </linearGradient>
      </defs>

      <!-- Holographic glowing platform rings -->
      <ellipse cx="200" cy="340" rx="140" ry="40" fill="url(#ringGlow)"/>
      <ellipse cx="200" cy="340" rx="125" ry="32" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="8 6" opacity="0.8"/>
      <ellipse cx="200" cy="340" rx="90" ry="22" stroke="#06b6d4" stroke-width="2" opacity="0.9"/>
      <ellipse cx="200" cy="340" rx="60" ry="14" fill="#6366f1" opacity="0.4"/>

      <!-- Robot Body -->
      <rect x="145" y="210" width="110" height="95" rx="45" fill="url(#bodyGrad)" filter="drop-shadow(0 10px 20px rgba(99,102,241,0.3))"/>
      <rect x="165" y="235" width="70" height="45" rx="18" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="2"/>

      <!-- Glowing Headset Band -->
      <path d="M 125 155 C 125 100, 275 100, 275 155" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
      <!-- Headset earcups with neon glow -->
      <rect x="110" y="145" width="22" height="42" rx="10" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)"/>
      <rect x="268" y="145" width="22" height="42" rx="10" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)"/>

      <!-- Head -->
      <rect x="130" y="120" width="140" height="105" rx="50" fill="url(#bodyGrad)" stroke="#ffffff" stroke-width="2"/>
      
      <!-- Visor / Face Screen -->
      <rect x="145" y="140" width="110" height="65" rx="28" fill="url(#visorGrad)" stroke="#6366f1" stroke-width="2"/>

      <!-- Happy Glowing Blue Eyes -->
      <path d="M 165 170 Q 177 158 189 170" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" fill="none" filter="drop-shadow(0 0 6px #38bdf8)"/>
      <path d="M 211 170 Q 223 158 235 170" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" fill="none" filter="drop-shadow(0 0 6px #38bdf8)"/>
      
      <!-- Smiling mouth -->
      <path d="M 193 186 Q 200 193 207 186" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Headset Mic -->
      <path d="M 120 175 Q 125 210 160 210" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="162" cy="210" r="5" fill="#ec4899" filter="drop-shadow(0 0 5px #ec4899)"/>

      <!-- Laptop sitting in front -->
      <g filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))">
        <!-- Laptop screen open -->
        <polygon points="150,250 250,250 240,295 160,295" fill="url(#laptopGrad)" stroke="#818cf8" stroke-width="2"/>
        <text x="200" y="278" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">AI</text>
        <!-- Laptop keyboard base -->
        <polygon points="140,295 260,295 275,315 125,315" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
        <line x1="165" y1="305" x2="235" y2="305" stroke="#818cf8" stroke-width="2" opacity="0.6"/>
      </g>
    </svg>
  `,

  // Style Card Thumbnails
  styles: [
    {
      id: 'Realistic',
      label: 'Realistic',
      sublabel: 'বাস্তবসম্মত ফটোগ্রাফি',
      badge: 'Photo',
      previewGradient: 'from-emerald-900 via-teal-950 to-slate-900',
      iconEmoji: '🏡',
      svgArt: `
        <svg viewBox="0 0 120 80" class="w-full h-full object-cover">
          <defs>
            <linearGradient id="skyR" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
              <stop stop-color="#38bdf8"/>
              <stop offset="0.6" stop-color="#bae6fd"/>
              <stop offset="1" stop-color="#fef08a"/>
            </linearGradient>
            <linearGradient id="grassR" x1="0" y1="45" x2="0" y2="80" gradientUnits="userSpaceOnUse">
              <stop stop-color="#15803d"/>
              <stop offset="1" stop-color="#14532d"/>
            </linearGradient>
          </defs>
          <rect width="120" height="80" fill="url(#skyR)"/>
          <circle cx="100" cy="20" r="10" fill="#fef08a" opacity="0.9" filter="drop-shadow(0 0 8px #fde047)"/>
          <polygon points="0,50 35,38 70,52 120,40 120,80 0,80" fill="url(#grassR)"/>
          <!-- Village cottage -->
          <polygon points="35,38 60,24 85,38" fill="#78350f"/>
          <rect x="42" y="38" width="36" height="24" fill="#a16207"/>
          <rect x="54" y="46" width="12" height="16" fill="#451a03"/>
          <rect x="45" y="42" width="6" height="6" fill="#fef08a"/>
          <!-- Trees -->
          <circle cx="22" cy="40" r="12" fill="#166534"/>
          <circle cx="95" cy="42" r="10" fill="#15803d"/>
        </svg>
      `,
    },
    {
      id: '3D',
      label: '3D',
      sublabel: 'থ্রি-ডি অ্যানিমেশন ও রেন্ডার',
      badge: '3D Render',
      previewGradient: 'from-indigo-900 via-purple-950 to-slate-900',
      iconEmoji: '👦',
      svgArt: `
        <svg viewBox="0 0 120 80" class="w-full h-full object-cover">
          <rect width="120" height="80" fill="#1e1b4b"/>
          <circle cx="60" cy="40" r="28" fill="#4338ca" opacity="0.5"/>
          <!-- 3D Boy Head -->
          <ellipse cx="60" cy="38" rx="20" ry="24" fill="#fcd34d"/>
          <!-- Hair -->
          <path d="M 40 32 Q 60 14 80 32 Q 74 18 60 18 Q 46 18 40 32" fill="#78350f"/>
          <!-- Cute 3D eyes -->
          <circle cx="53" cy="36" r="3.5" fill="#1e1b4b"/>
          <circle cx="67" cy="36" r="3.5" fill="#1e1b4b"/>
          <circle cx="54" cy="35" r="1.2" fill="#ffffff"/>
          <circle cx="68" cy="35" r="1.2" fill="#ffffff"/>
          <path d="M 56 46 Q 60 50 64 46" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Collar -->
          <path d="M 45 60 Q 60 72 75 60 L 80 80 L 40 80 Z" fill="#6366f1"/>
        </svg>
      `,
    },
    {
      id: 'Cartoon',
      label: 'Cartoon',
      sublabel: 'কার্টুন ও কমিক ইলাস্ট্রেশন',
      badge: '2D Art',
      previewGradient: 'from-amber-950 via-orange-950 to-slate-900',
      iconEmoji: '🎨',
      svgArt: `
        <svg viewBox="0 0 120 80" class="w-full h-full object-cover">
          <rect width="120" height="80" fill="#042f2e"/>
          <circle cx="60" cy="40" r="30" fill="#0d9488" opacity="0.3"/>
          <!-- Cartoon boy waving -->
          <circle cx="60" cy="36" rx="18" ry="20" fill="#fed7aa" stroke="#7c2d12" stroke-width="1.5"/>
          <!-- Spiky hair -->
          <polygon points="44,28 48,16 54,24 60,14 66,24 72,16 76,28" fill="#9a3412"/>
          <circle cx="54" cy="36" r="3" fill="#1c1917"/>
          <circle cx="66" cy="36" r="3" fill="#1c1917"/>
          <path d="M 54 44 Q 60 52 66 44" fill="#ef4444" stroke="#7c2d12" stroke-width="1.5"/>
          <!-- Cheerful shirt -->
          <rect x="44" y="55" width="32" height="25" rx="6" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
        </svg>
      `,
    },
    {
      id: 'Anime',
      label: 'Anime',
      sublabel: 'জাপানিজ অ্যানিমে মাস্টারপিস',
      badge: 'Anime',
      previewGradient: 'from-pink-950 via-purple-950 to-slate-900',
      iconEmoji: '✨',
      svgArt: `
        <svg viewBox="0 0 120 80" class="w-full h-full object-cover">
          <rect width="120" height="80" fill="#3b0764"/>
          <!-- Radiant glowing background -->
          <circle cx="60" cy="40" r="26" fill="#a855f7" opacity="0.4" filter="blur(6px)"/>
          <!-- Anime Girl with purple hair -->
          <ellipse cx="60" cy="42" rx="17" ry="20" fill="#fed7aa"/>
          <!-- Long Purple anime hair -->
          <path d="M 36 28 C 36 12, 84 12, 84 28 C 88 50, 84 66, 80 78 C 76 60, 72 40, 68 34 C 64 34, 56 34, 52 34 C 48 40, 44 60, 40 78 C 36 66, 32 50, 36 28 Z" fill="#9333ea"/>
          <!-- Big sparkling anime eyes -->
          <ellipse cx="53" cy="40" rx="4" ry="5.5" fill="#7e22ce"/>
          <ellipse cx="67" cy="40" rx="4" ry="5.5" fill="#7e22ce"/>
          <circle cx="54" cy="38" r="1.5" fill="#ffffff"/>
          <circle cx="68" cy="38" r="1.5" fill="#ffffff"/>
          <circle cx="52" cy="42" r="0.8" fill="#c084fc"/>
          <circle cx="66" cy="42" r="0.8" fill="#c084fc"/>
          <path d="M 58 48 Q 60 50 62 48" stroke="#db2777" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `,
    },
  ],

  // Aspect Ratios matching mockup
  aspectRatios: [
    { id: '1:1', label: '1:1', sublabel: 'Square', iconWidth: 'w-4 h-4' },
    { id: '16:9', label: '16:9', sublabel: 'Landscape', iconWidth: 'w-5 h-3' },
    { id: '9:16', label: '9:16', sublabel: 'Portrait', iconWidth: 'w-3 h-5' },
    { id: '4:3', label: '4:3', sublabel: 'Standard', iconWidth: 'w-4.5 h-3.5' },
  ],

  // Recent Generations sample gallery
  recentGenerations: [
    {
      id: 'rec-1',
      title: 'শান্ত গ্রামীণ বাংলা',
      prompt: 'A peaceful rural Bangladeshi village, morning sunlight, green nature, wooden house, cinematic realistic',
      style: 'Realistic',
      aspectRatio: '9:16',
      badge: 'Realistic',
      gradient: 'from-emerald-800 to-teal-950',
      svgThumb: `
        <svg viewBox="0 0 200 150" class="w-full h-full object-cover">
          <defs>
            <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
              <stop stop-color="#38bdf8"/>
              <stop offset="0.5" stop-color="#bae6fd"/>
              <stop offset="1" stop-color="#fef08a"/>
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#sky1)"/>
          <circle cx="160" cy="35" r="18" fill="#fef08a" opacity="0.9" filter="drop-shadow(0 0 12px #fde047)"/>
          <polygon points="0,90 60,75 130,95 200,80 200,150 0,150" fill="#15803d"/>
          <!-- Village cottage -->
          <polygon points="60,70 100,45 140,70" fill="#78350f"/>
          <rect x="70" y="70" width="60" height="40" fill="#a16207"/>
          <rect x="90" y="82" width="20" height="28" fill="#451a03"/>
          <circle cx="40" cy="75" r="22" fill="#166534"/>
          <circle cx="160" cy="78" r="20" fill="#15803d"/>
        </svg>
      `,
    },
    {
      id: 'rec-2',
      title: 'সূর্যাস্তে দৃষ্টিনন্দন মসজিদ',
      prompt: 'Magnificent grand mosque with domes and tall minarets at sunset, golden evening glow, reflection, 8k',
      style: 'Realistic',
      aspectRatio: '9:16',
      badge: 'Architecture',
      gradient: 'from-amber-900 to-purple-950',
      svgThumb: `
        <svg viewBox="0 0 200 150" class="w-full h-full object-cover">
          <defs>
            <linearGradient id="sunset1" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
              <stop stop-color="#7c2d12"/>
              <stop offset="0.4" stop-color="#ea580c"/>
              <stop offset="0.8" stop-color="#fbbf24"/>
              <stop offset="1" stop-color="#431407"/>
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#sunset1)"/>
          <!-- Grand Dome -->
          <ellipse cx="100" cy="75" rx="30" ry="32" fill="#1e293b"/>
          <rect x="75" y="75" width="50" height="45" fill="#334155"/>
          <!-- Minarets -->
          <rect x="40" y="40" width="10" height="80" fill="#1e293b"/>
          <polygon points="38,40 45,20 52,40" fill="#f59e0b"/>
          <rect x="150" y="40" width="10" height="80" fill="#1e293b"/>
          <polygon points="148,40 155,20 162,40" fill="#f59e0b"/>
          <!-- Water reflection -->
          <rect x="0" y="120" width="200" height="30" fill="#1e1b4b" opacity="0.8"/>
          <line x1="30" y1="130" x2="170" y2="130" stroke="#f59e0b" stroke-width="2" opacity="0.5"/>
        </svg>
      `,
    },
    {
      id: 'rec-3',
      title: 'পাহাড় ও শান্ত নীল হ্রদ',
      prompt: 'Pristine mountain alpine lake, pine trees reflection, morning fog, crystal clear turquoise water, 8k photo',
      style: 'Realistic',
      aspectRatio: '16:9',
      badge: 'Landscape',
      gradient: 'from-cyan-900 to-blue-950',
      svgThumb: `
        <svg viewBox="0 0 200 150" class="w-full h-full object-cover">
          <defs>
            <linearGradient id="lake1" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0284c7"/>
              <stop offset="0.5" stop-color="#38bdf8"/>
              <stop offset="0.8" stop-color="#0f766e"/>
              <stop offset="1" stop-color="#042f2e"/>
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#lake1)"/>
          <!-- Mountain peaks -->
          <polygon points="10,75 60,30 110,75" fill="#334155"/>
          <polygon points="50,30 60,30 70,42" fill="#ffffff" opacity="0.9"/>
          <polygon points="90,80 140,25 190,80" fill="#1e293b"/>
          <polygon points="130,25 140,25 150,38" fill="#ffffff" opacity="0.9"/>
          <!-- Pine trees -->
          <polygon points="25,95 35,70 45,95" fill="#064e3b"/>
          <polygon points="155,95 165,70 175,95" fill="#064e3b"/>
          <!-- Turquoise Lake -->
          <rect x="0" y="90" width="200" height="60" fill="#0d9488" opacity="0.85"/>
        </svg>
      `,
    },
  ],
};
