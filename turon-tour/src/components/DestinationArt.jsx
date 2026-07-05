// Арт-иллюстрация направления (SVG, «золотой час»).
// Пока настоящих фото нет — рисуем сцену: city (город) или sea (море).
// Когда появятся фото, в TourCard достаточно заменить <DestinationArt> на <img src={tour.фотоURL}>.

// Палитры и тип сцены по id тура. Незнакомый id → дефолт (город, тёплый).
const SCENES = {
  'dubai-5d':    { type: 'city', sky: ['#9fb0ce', '#cba593', '#e9a86f', '#fbdd9e'], sun: '#fff2cf' },
  'istanbul-6d': { type: 'city', sky: ['#8f9fce', '#c9a0b0', '#eaa07f', '#fbd7c0'], sun: '#ffe6cf' },
  'georgia-5d':  { type: 'city', sky: ['#7d90bb', '#b59a9a', '#d99f74', '#f6d29b'], sun: '#fff0c8' },
  'egypt-8d':    { type: 'sea',  sky: ['#7cc7d6', '#a9dbdf', '#f2cf8f', '#fce3b0'], sun: '#fff4d0', sea: ['#2a95a8', '#187f97'] },
  'maldives-7d': { type: 'sea',  sky: ['#6a7bb0', '#b98fa8', '#f0a56a', '#fbd79e'], sun: '#fff1cf', sea: ['#1f7f9c', '#125f7d'] },
}
const DEFAULT_SCENE = { type: 'city', sky: ['#9fb0ce', '#cba593', '#e9a86f', '#fbdd9e'], sun: '#fff2cf' }

function CitySkyline() {
  return (
    <>
      {/* far skyline (hazy) */}
      <path
        fill="#b98a6e"
        opacity="0.5"
        d="M0,214 L18,214 L18,196 L34,196 L34,214 L52,214 L52,182 L64,182 L64,214 L86,214 L86,190 L100,190 L100,214 L128,214 L128,176 L138,176 L138,214 L360,214 L360,188 L374,188 L374,214 L400,214 L400,230 L0,230 Z"
      />
      {/* front skyline */}
      <path
        fill="url(#art-front)"
        d="M0,232 L0,206 L16,206 L16,188 L30,188 L30,206 L40,206 L40,168 L52,168 L52,206 L74,206
          L74,150 L84,150 L84,120 L90,120 L84,150 L96,206
          L118,206 L118,178 L130,178 L130,206
          L150,206 L150,120 L155,86 L157,58 L159,86 L164,120 L164,206
          L188,206 L188,164 L200,164 L200,206
          L222,206 L222,184 L236,184 L236,148 L244,148 L244,206
          L268,206 L268,172 L280,172 L280,206
          L300,206 L300,158 L312,158 L312,138 L318,138 L318,158 L328,158 L328,206
          L352,206 L352,182 L366,182 L366,160 L372,160 L372,206
          L400,206 L400,300 L0,300 Z"
      />
    </>
  )
}

function SeaScene({ sea }) {
  return (
    <>
      {/* water */}
      <rect x="0" y="205" width="400" height="95" fill="url(#art-sea)" />
      {/* sun reflection */}
      <rect x="272" y="205" width="32" height="95" fill="#ffe9b0" opacity="0.30" />
      {/* wave hints */}
      <g stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M40,236 q10,-4 20,0 t20,0" />
        <path d="M120,256 q10,-4 20,0 t20,0" />
        <path d="M300,244 q10,-4 20,0 t20,0" />
      </g>
      {/* small island + palm */}
      <g fill="#26170f" opacity="0.9">
        <ellipse cx="70" cy="206" rx="46" ry="8" />
        <rect x="66" y="176" width="4" height="30" rx="2" transform="rotate(-6 68 190)" />
        <path d="M68,176 q-16,-6 -26,-2 q12,-6 26,0 q14,-8 28,-2 q-14,-2 -28,4 q10,4 14,14 q-8,-8 -14,-8 q-6,2 -10,10 q2,-12 10,-18 Z" />
      </g>
      <ellipse cx="70" cy="206" rx="30" ry="4" fill="#3a2a20" opacity="0.5" />
    </>
  )
}

export default function DestinationArt({ tourId, alt }) {
  const s = SCENES[tourId] || DEFAULT_SCENE
  const [t0, t1, t2, t3] = s.sky
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="art-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t0} />
          <stop offset="30%" stopColor={t1} />
          <stop offset="62%" stopColor={t2} />
          <stop offset="100%" stopColor={t3} />
        </linearGradient>
        <radialGradient id="art-sun" cx="72%" cy="60%" r="42%">
          <stop offset="0%" stopColor={s.sun} stopOpacity="0.98" />
          <stop offset="42%" stopColor={s.sun} stopOpacity="0.5" />
          <stop offset="100%" stopColor={s.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="art-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b2b21" />
          <stop offset="100%" stopColor="#22160f" />
        </linearGradient>
        {s.sea && (
          <linearGradient id="art-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.sea[0]} />
            <stop offset="100%" stopColor={s.sea[1]} />
          </linearGradient>
        )}
        <linearGradient id="art-scrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stopColor="#140c08" stopOpacity="0" />
          <stop offset="100%" stopColor="#140c08" stopOpacity="0.42" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill="url(#art-sky)" />
      <rect width="400" height="300" fill="url(#art-sun)" />
      <circle cx="288" cy="178" r="25" fill={s.sun} />
      <rect x="0" y="150" width="400" height="60" fill="#ffffff" opacity="0.06" />

      {s.type === 'sea' ? <SeaScene sea={s.sea} /> : <CitySkyline />}

      {/* birds */}
      <g stroke="#3a2b22" strokeWidth="1.4" fill="none" opacity="0.5" strokeLinecap="round">
        <path d="M96,74 q5,-5 10,0 q5,-5 10,0" />
        <path d="M122,92 q4,-4 8,0 q4,-4 8,0" />
        <path d="M78,100 q3,-3 6,0 q3,-3 6,0" />
      </g>

      <rect width="400" height="300" fill="url(#art-scrim)" />
    </svg>
  )
}
