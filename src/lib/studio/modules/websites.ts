import { M, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 01 — Website Types.                                        */
/*  Each module defines the *experience archetype*: audience, primary   */
/*  conversion, expected sections and the quality bar for the genre.    */
/* ------------------------------------------------------------------ */

export const WEBSITE_MODULES = [
  M({
    id: "websites/personal-portfolio",
    category: "websites", subcategory: "portfolio",
    name: "Personal Portfolio",
    tagline: "One person, one index, proof of craft.",
    description:
      "A first-person portfolio where the work index is the homepage. The visitor should reach a real project in one click, and the presentation should feel curated rather than exhaustive.",
    prompt:
      "Build a personal portfolio structured as a curated work index: the homepage IS the project list (numbered rows or oversized cards, ordered by recency or strength), one project deep-dive per page, an about page, and a direct contact path. Prioritise showing over telling — no generic hero banner, the strongest work occupies the first viewport. Include an availability/status line and a colophon footer.",
    implementation:
      "Static-first Next.js routes; /, /work/[slug], /about, /contact. Images via next/image with BlurHash-style placeholders. Work index data in a typed array or CMS table with explicit ordering.",
    stack: ["Next.js", "Tailwind CSS"],
    params: [
      select("indexStyle", "Index style", "numbered-list", ["numbered-list", "card-grid", "horizontal-rail"], "How the work index presents projects"),
    ],
    tags: ["portfolio", "index", "personal", "showcase"],
    aliases: ["solo portfolio", "freelance portfolio"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover", "scroll"],
    responsive: "Index rows must become stacked cards under 768px without losing meta (year/client) visibility.",
  }),
  M({
    id: "websites/creative-portfolio",
    category: "websites", subcategory: "portfolio",
    name: "Creative Portfolio",
    tagline: "Gallery-grade presentation for image-led work.",
    description:
      "A portfolio for creative professionals where imagery dominates: full-bleed sequences, hover previews, and typography treated like museum wall labels.",
    prompt:
      "Build a creative portfolio with museum-grade presentation: full-bleed project imagery, captions set like gallery placards (mono, small, meta data), hover states that reveal floating previews, and a restrained contact path. Sequencing of images within a project should feel like a slow-looking editorial layout with generous vertical gaps.",
    implementation: "Full-bleed <figure> stacks with 12vh gaps on project pages; preview images lazily decoded; cursor-follow preview on the index for pointer devices only.",
    stack: ["Next.js", "Framer Motion"],
    params: [],
    tags: ["portfolio", "creative", "gallery", "imagery"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["hover", "pointer"],
    a11y: "Every image requires descriptive alt text; hover-only previews must not gate content access.",
    responsive: "On touch devices previews become inline thumbnails; full-bleed images respect safe-area insets.",
  }),
  M({
    id: "websites/developer-portfolio",
    category: "websites", subcategory: "portfolio",
    name: "Developer Portfolio",
    tagline: "Code-native identity with real, running proof.",
    description:
      "A portfolio for engineers: projects with technical depth, live demos, terminal-flavored identity, and writing that proves thinking, not just shipping.",
    prompt:
      "Build a developer portfolio that proves engineering depth: project cards with the actual problem solved (not just screenshots), links to live demos and source, a writing/notes section, and a now-page. Identity may lean terminal/editor (monospace accents, command-palette navigation) without becoming a gimmick — readability first.",
    implementation: "Project data as typed records with fields: problem, approach, stack, outcome, links. Optional ⌘K command palette for navigation. Code samples in syntactically highlighted blocks.",
    stack: ["Next.js", "Tailwind CSS"],
    tags: ["developer", "engineering", "terminal", "portfolio"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover", "animated"],
    responsive: "Command palette must have a mobile sheet equivalent; code blocks scroll horizontally without breaking layout.",
  }),
  M({
    id: "websites/designer-portfolio",
    category: "websites", subcategory: "portfolio",
    name: "Designer Portfolio",
    tagline: "Art-directed case studies with process evidence.",
    description:
      "A designer's portfolio built around case studies that show process — brief, exploration, system, outcome — not only final screens.",
    prompt:
      "Build a designer portfolio organised around narrative case studies: each project page tells brief → exploration (sketches, variants) → design system → final outcome with measured results where possible. The index should feel art-directed: custom covers per project rather than uniform thumbnails.",
    implementation: "Case-study template with section variants (compare-slider, process grid, outcome stats). Covers treated individually with per-project aspect ratios allowed.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["designer", "case-study", "ux", "visual-design"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["scroll", "hover"],
  }),
  M({
    id: "websites/photography-portfolio",
    category: "websites", subcategory: "portfolio",
    name: "Photography Portfolio",
    tagline: "Darkroom discipline: the photograph is the interface.",
    description:
      "A photography portfolio where UI chrome disappears: edge-to-edge images, series navigation, EXIF-level captions, and zero decoration competing with the pictures.",
    prompt:
      "Build a photography portfolio with darkroom discipline: edge-to-edge imagery on near-black, UI that recedes (thin mono captions, minimal nav), series-based organisation with numbered frames, and a lightbox-like project view. Color management matters — embed-displayed images at high quality with preloading of adjacent frames.",
    implementation: "Image pipeline: AVIF/WebP with responsive srcsets up to 2400px; adjacent-image prefetch on project pages; CSS :fullscreen-capable lightbox or dedicated series route.",
    stack: ["Next.js"],
    tags: ["photography", "gallery", "darkroom", "series"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["hover", "scroll"],
  }),
  M({
    id: "websites/agency",
    category: "websites", subcategory: "brand",
    name: "Agency Website",
    tagline: "Manifesto, proof, and a brief intake that converts.",
    description:
      "A creative agency site that leads with a point of view: oversized manifesto typography, case studies with quantified outcomes, and a structured project-brief intake form.",
    prompt:
      "Build an agency website that opens with a manifesto-level statement, proves it with 3–5 case studies carrying quantified outcomes (+212% signups beats adjectives), states capabilities as a tight stack, and ends with a structured brief intake (project type → budget range → timeline → details). The site's own craft is the first case study.",
    implementation: "Case studies from structured records (client, year, disciplines, results[]). Brief form as multi-step with review screen and honeypot.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["agency", "studio", "manifesto", "case-study"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["scroll", "animated"],
  }),
  M({
    id: "websites/creative-studio",
    category: "websites", subcategory: "brand",
    name: "Creative Studio",
    tagline: "Experimental identity with a public showreel.",
    description:
      "A studio site that treats itself as an experiment — a living identity piece with a showreel, a principles list with real opinions, and culture proof.",
    prompt:
      "Build a creative studio site that is itself a portfolio piece: an experimental but legible identity system, a showreel (muted, on-view playback), an opinionated principles list, selected work, and a culture section that makes the team feel real. Take one memorable interactive risk on the homepage — one signature move, not ten.",
    implementation: "Showreel as lazy-loaded <video> with IntersectionObserver play/pause. Signature interaction isolated to its own component with a reduced-motion static variant.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["studio", "showreel", "culture", "identity"],
    difficulty: "advanced", perf: "heavy", dimension: "both", interactivity: ["animated", "pointer", "scroll"],
  }),
  M({
    id: "websites/digital-product",
    category: "websites", subcategory: "product",
    name: "Digital Product Website",
    tagline: "The product is the hero; the demo is the pitch.",
    description:
      "A marketing site for a digital product where real UI (not stock mockups) drives the story: live-feeling demos, feature proof, and integrations.",
    prompt:
      "Build a digital product website where the product's actual UI is the hero: a real (or faithfully recreated) interface under a two-line headline, floating KPI chips, a problem→outcome narrative in three beats, feature grid with mini-UI previews that animate on hover-equals-intent, an integration orbit, and honest pricing.",
    implementation: "Recreate 3–4 key screens as components (not screenshots) so they stay sharp and animatable. KPI chips float on phase-offset ease loops.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["product", "saas", "marketing", "demo"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "hover"],
  }),
  M({
    id: "websites/saas",
    category: "websites", subcategory: "product",
    name: "SaaS Website",
    tagline: "Position, prove, convert — with numbers, not adjectives.",
    description:
      "A B2B SaaS site architecture: product-led hero, proof metrics, feature bento, pricing with toggle, changelog and docs sub-sites.",
    prompt:
      "Build a SaaS website with the proven conversion architecture: product-led hero with one filled CTA and 'no credit card' microcopy, monochrome logo cloud, three-beat problem→outcome story, bento feature grid with mini-UI loops, integration strip, quantified testimonials, pricing with monthly/annual toggle and count-up prices, and objection-focused FAQ.",
    implementation: "Bento cells as composable components; pricing toggle animates with spring + count-up; FAQ with FAQPage JSON-LD.",
    stack: ["Next.js", "Framer Motion", "Tailwind CSS"],
    tags: ["saas", "b2b", "bento", "pricing"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated", "hover"],
  }),
  M({
    id: "websites/ecommerce",
    category: "websites", subcategory: "brand",
    name: "Ecommerce Experience",
    tagline: "Editorial commerce: desire → detail → 90-second checkout.",
    description:
      "A storefront that sells through editorial storytelling: drop culture, lookbook heroes, honest stock states, and a checkout so short it feels inevitable.",
    prompt:
      "Build an ecommerce experience with editorial gravity: campaign-based homepage with a drop/season concept, collection rails with hover second-images, product pages that read like magazine features (fit notes, materials, provenance), honest scarcity ('3 left' only when true), a cart drawer with a progress meter, and express-wallet checkout.",
    implementation: "Product data model with variants + stock. Cart as slide-over. PDP gallery with hover-zoom. All prices in tabular numerals.",
    stack: ["Next.js"],
    tags: ["ecommerce", "shop", "retail", "drops"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["hover", "animated"],
    a11y: "Size/variant selection must be real form controls with labels, not styled divs.",
  }),
  M({
    id: "websites/luxury-brand",
    category: "websites", subcategory: "brand",
    name: "Luxury Brand",
    tagline: "Restraint, ceremony, and time as a design material.",
    description:
      "A luxury brand site where slowness is the flex: long easings, enormous type with tiny captions, cinematic media, and absolute typographic discipline.",
    prompt:
      "Build a luxury brand website that uses time as a material: long, weighted easings (600–1200ms), enormous display type paired with tiny precise captions, cinematic full-bleed media with letterboxing, near-zero UI chrome, and a mise-en-scène approach to every section transition. Nothing blinks, bounces or chirps.",
    implementation: "Global motion tokens with extended durations; media art-directed with focal-point cropping; serif italics reserved for single-word emphasis.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["luxury", "premium", "cinematic", "fashion-adjacent"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll", "animated"],
    conflicts: [
      { id: "direction/neo-brutalism", reason: "Brutalist rawness (borders, harshness, system UI) contradicts luxury's polished ceremony — pick one voice." },
      { id: "direction/y2k", reason: "Y2K's playful chrome-and-plastic nostalgia reads as kitsch against luxury restraint." },
    ],
  }),
  M({
    id: "websites/editorial",
    category: "websites", subcategory: "content",
    name: "Editorial Website",
    tagline: "Long-form reading engineered like print craft.",
    description:
      "An editorial site with print-grade typography: fluid measures, pull quotes, drop caps, footnote systems, and reading-progress affordances.",
    prompt:
      "Build an editorial website with print-grade reading craft: optimal measure (62–68ch), fluid type scale, drop caps and pull quotes used with restraint, figures with real captions, footnote/sidenote system, related-reading modules, and a quiet dark reading mode. The grid should allow art-directed article openers while keeping body text sacred.",
    implementation: "Article template around a 680px measure column with wide asides for figures; use font-variant-numeric: oldstyle for body; footnotes as sidenotes on ≥1280px.",
    stack: ["Next.js"],
    tags: ["editorial", "magazine", "reading", "longform"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll", "static"],
  }),
  M({
    id: "websites/magazine",
    category: "websites", subcategory: "content",
    name: "Digital Magazine",
    tagline: "Cover momentum, section rhythm, archive depth.",
    description:
      "A magazine-style publication: cover-style homepage, section fronts, issue metaphor optional, and a browsable archive.",
    prompt:
      "Build a digital magazine with cover momentum: a homepage front that leads with one dominant story, 2–3 secondary stories, and a running ticker of latest pieces; section fronts (Culture / Tech / Opinion) with distinct but related layouts; article pages with strong kicker-headline-deck hierarchy; an archive browsable by topic and date.",
    implementation: "Content model: articles with kicker, deck, section, authors, art-direction flags. Section fronts are curated (manual ordering), not just chronological.",
    stack: ["Next.js"],
    tags: ["magazine", "publication", "news", "journalism"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll", "hover"],
  }),
  M({
    id: "websites/corporate",
    category: "websites", subcategory: "brand",
    name: "Corporate Website",
    tagline: "Institutional trust with modern speed.",
    description:
      "A corporate site that feels accountable: clear divisions, leadership, newsroom, careers, investor relations — executed with contemporary restraint.",
    prompt:
      "Build a corporate website that earns institutional trust without being boring: clear division routing, a leadership section with consistent portrait treatment, a newsroom with press assets, careers with honest job descriptions, and investor-relations clarity where relevant. Navigation must survive 200+ pages of content growth.",
    implementation: "Deep but shallow interaction design: fast pages, restrained motion, document downloads, strong search. Mega-menu keyboard navigable.",
    stack: ["Next.js"],
    tags: ["corporate", "enterprise", "b2b", "institutional"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static", "hover"],
  }),
  M({
    id: "websites/startup",
    category: "websites", subcategory: "product",
    name: "Startup Website",
    tagline: "One promise, one proof, one action.",
    description:
      "A startup marketing site: a single-message homepage, proof strip, pricing clarity, and a founding-team face. Built to move fast.",
    prompt:
      "Build a startup website with ruthless focus: one headline promise, one product proof (live demo, video, or quantified stat strip), one primary CTA repeated at scroll intervals, a pricing or waitlist module, founder credibility, and a crisp FAQ. Every section must answer 'so what' within one glance.",
    implementation: "Single-scroll homepage plus /pricing, /about; every CTA scrolls or routes to the same conversion point.",
    stack: ["Next.js", "Tailwind CSS"],
    tags: ["startup", "landing", "conversion", "mvp"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "hover"],
  }),
  M({
    id: "websites/dashboard",
    category: "websites", subcategory: "product",
    name: "Dashboard / Admin",
    tagline: "Information density with mercy: hierarchy, not clutter.",
    description:
      "A data-dense application shell: collapsible rail navigation, stat cards, sortable tables, charts with honest axes, and command-palette speed.",
    prompt:
      "Build a dashboard experience with disciplined density: left rail navigation (collapsible to icons), an overview of stat cards with count-up deltas, a primary data table (sticky header, sortable, filterable, keyset-paginated), trend charts with honest axes and loading skeletons that resolve without layout shift, empty states with next-action CTAs, and a ⌘K command palette.",
    implementation: "Table virtualization above 500 rows; chart lib rendered into sized containers (no CLS); all async regions get skeletons.",
    stack: ["Next.js", "TypeScript"],
    tags: ["dashboard", "admin", "data", "app"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["hover", "realtime"],
    a11y: "Tables require proper <th> scope and sort announcements via aria-live.",
  }),
  M({
    id: "websites/product-showcase",
    category: "websites", subcategory: "product",
    name: "Product Showcase",
    tagline: "One object, worshipped from every angle.",
    description:
      "A single-product site where the object is examined from every angle: exploded views, material callouts, spec sheets, configurator optional.",
    prompt:
      "Build a product showcase that worships one object: a hero with the product in dramatic light, scroll-driven examination (exploded view, material close-ups, dimension overlays), a spec sheet treated with typographic pride, comparison against the mundane alternative, and a single decisive purchase CTA. Motion should feel like a camera on a dolly, not a page scroll.",
    implementation: "Scroll-choreographed media sequence; exploded view as layered images translated by scroll progress; spec numbers in tabular mono.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["product", "showcase", "hardware", "detail"],
    difficulty: "advanced", perf: "medium", dimension: "both", interactivity: ["scroll", "animated"],
    suggests: ["motion/scroll-scrub", "layout/pinned-storytelling"],
  }),
  M({
    id: "websites/landing-page",
    category: "websites", subcategory: "product",
    name: "Landing Page",
    tagline: "A single argument, top to bottom.",
    description:
      "A single-purpose landing page: hook, agitate, solve, prove, act — with one CTA and zero navigation escape routes.",
    prompt:
      "Build a landing page as a single argument: hero with hook + sub-hook + CTA, agitation of the problem, the solution in three visual beats, social proof with specifics, offer/pricing clarity, objection-handling FAQ, and a final CTA band. The nav is minimal or absent; every scroll meter must increase commitment.",
    implementation: "Single route with 7–9 sections; CTA components share one idempotent action; heat of experience rises with scroll (calmer hero → denser proof).",
    stack: ["Next.js", "Tailwind CSS"],
    tags: ["landing", "conversion", "marketing", "cta"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll", "animated"],
  }),
  M({
    id: "websites/scrollytelling",
    category: "websites", subcategory: "immersive",
    name: "Interactive Storytelling",
    tagline: "Scrollytelling: narrative advanced by the scrollbar.",
    description:
      "A scroll-driven narrative where the scrollbar becomes the timeline: pinned scenes, step-triggered graphics, and reading-paced reveals.",
    prompt:
      "Build an interactive storytelling piece where scroll position is the narrative timeline: a pinned visual stage that evolves through discrete steps as text blocks pass, scrubbed transitions between states, chapter markers in a progress rail, and text that never competes with the graphic it describes. The story must be fully readable and meaningful with motion disabled.",
    implementation: "Sticky viewport stage + step triggers (IntersectionObserver or ScrollTrigger); each step maps to a scene state; progress rail with chapter jump links.",
    stack: ["Next.js", "GSAP ScrollTrigger"],
    tags: ["scrollytelling", "narrative", "storytelling", "editorial"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll", "animated"],
    a11y: "Provide a 'read without animation' mode that linearizes scenes into static figures.",
    responsive: "On <768px the pinned stage becomes a stacked layout: figure above, caption below, no pinning.",
    suggests: ["motion/sticky-pinning", "engineering/reduced-motion"],
  }),
  M({
    id: "websites/experimental",
    category: "websites", subcategory: "immersive",
    name: "Experimental Digital Experience",
    tagline: "The browser as a creative medium, not a document.",
    description:
      "An experimental site that uses the browser as its own medium: unconventional navigation, procedural visuals, and interaction as the content itself.",
    prompt:
      "Build an experimental digital experience where interaction is the content: unconventional but learnable navigation (canvas menus, spatial browsing, or play mechanics), procedural or generative visuals that make every visit slightly unique, and a strong fallback content layer so the piece degrades to readable. Document the interaction model onboarding in the first 5 seconds.",
    implementation: "Keep DOM content semantic and complete underneath the experience layer; experience mounts progressively after first paint; feature-detect WebGL before committing.",
    stack: ["Next.js", "Three.js"],
    tags: ["experimental", "avant-garde", "webgl", "playful"],
    difficulty: "advanced", perf: "heavy", dimension: "both", interactivity: ["pointer", "realtime", "scroll"],
    a11y: "The complete content must remain reachable via keyboard and readable by screen readers even when the experience layer is active.",
    fallback: "Static layout with the same content, imagery and copy — the experiment is an enhancement, never the only path.",
  }),
  M({
    id: "websites/architecture-portfolio",
    category: "websites", subcategory: "portfolio",
    name: "Architecture Portfolio",
    tagline: "Space translated into interface: plans, mass, light.",
    description:
      "An architecture studio portfolio: project pages structured like site visits (context → massing → material → detail), drawings treated as first-class media.",
    prompt:
      "Build an architecture portfolio that translates spatial thinking into interface: project pages sequenced like site visits (context map → massing photos → plans/sections → material details → occupied-life imagery), drawings displayed at readable zoom with pan, a projects index filterable by typology/place/year, and typography with Swiss discipline.",
    implementation: "Deep-zoom viewer for drawings (tiled or large-format with pan); monochrome-heavy palette with one warm accent; Swiss grid.",
    stack: ["Next.js"],
    tags: ["architecture", "spatial", "portfolio", "drawings"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["hover", "scroll"],
    suggests: ["direction/architectural-minimalism", "layout/swiss-grid"],
  }),
  M({
    id: "websites/automotive",
    category: "websites", subcategory: "brand",
    name: "Automotive Website",
    tagline: "Machine theatre: specs, stance, and configurability.",
    description:
      "An automotive site that sells the machine emotionally first: cinematic hero, scroll-configured exploration, spec theatre, and a dealer/test-drive conversion path.",
    prompt:
      "Build an automotive website as machine theatre: a cinematic hero of the vehicle in motion, scroll-driven exterior exploration (rotating stance, lighting changes), interior detail dives, a spec sheet presented like a trophy wall, an optional configurer (paint/wheels/interior) with live price, and a test-drive booking flow that stays under 3 steps.",
    implementation: "360° spin via frame sequence or 3D model; scroll-scrubbed reveal; configurator state in URL for shareability.",
    stack: ["Next.js", "Framer Motion"],
    tags: ["automotive", "vehicle", "configurator", "cinematic"],
    difficulty: "advanced", perf: "heavy", dimension: "both", interactivity: ["scroll", "pointer", "animated"],
    suggests: ["webgl/three-scene", "motion/scroll-scrub"],
  }),
  M({
    id: "websites/fashion",
    category: "websites", subcategory: "brand",
    name: "Fashion Experience",
    tagline: "Lookbook gravity with cart-level honesty.",
    description:
      "A fashion site balancing lookbook art direction with commerce utility: campaign films, size honesty, and editorial product pages.",
    prompt:
      "Build a fashion experience that moves like a lookbook but converts like a store: full-viewport campaign media, collections browsed as editorial spreads, product cards with instant size availability, PDPs with movement video and honest fit notes ('model wears M, runs small'), and checkout express-laned. Type should carry the season's attitude — treat it as casting, not decoration.",
    implementation: "Hover swaps to alternate shots; fit data structured per garment; campaign media lazy with poster frames.",
    stack: ["Next.js"],
    tags: ["fashion", "lookbook", "retail", "editorial"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["hover", "scroll"],
  }),
  M({
    id: "websites/restaurant",
    category: "websites", subcategory: "immersive",
    name: "Restaurant & Hospitality",
    tagline: "Atmosphere → appetite → reservation in one scroll.",
    description:
      "A hospitality site that converts appetite into bookings: sensory media, menu as editorial object, and reservation flow under 60 seconds.",
    prompt:
      "Build a restaurant/hospitality website sequenced atmosphere → appetite → reservation: cinematic sensory hero, a menu treated as an editorial object (dotted leaders, italic dish poetry, allergen legend), the room shown honestly (real interior photography), a reservation widget with live-ish availability, hours with open/closed state, and gift-card/private-dining routes.",
    implementation: "Reservation stepper with capacity states; menu from structured data (course, dish, description, price, allergens).",
    stack: ["Next.js"],
    tags: ["restaurant", "hospitality", "menu", "reservations"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "hover"],
  }),
  M({
    id: "websites/hotel",
    category: "websites", subcategory: "immersive",
    name: "Hotel & Retreat",
    tagline: "Sell the silence before selling the room.",
    description:
      "A hotel/retreat site that leads with atmosphere and books through a floating dock: seasonal storytelling, honest availability, calm commerce.",
    prompt:
      "Build a hotel or retreat website that sells the feeling before the room: slow cinematic hero with a floating booking dock (dates → guests → availability), rooms/stays as contemplative cards with nightly rates, seasonal storytelling ('what October feels like'), honest 'good to know' lists, and a booking flow with visible total from step one.",
    implementation: "Booking dock floats bottom-center on desktop, becomes a sticky bar on mobile; availability calendar with range selection.",
    stack: ["Next.js"],
    tags: ["hotel", "travel", "retreat", "booking"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "hover"],
  }),
  M({
    id: "websites/travel-experience",
    category: "websites", subcategory: "immersive",
    name: "Travel Experience",
    tagline: "A journey told as a map, a mood, and an itinerary.",
    description:
      "A travel experience site that mixes map-led browsing with mood films: destinations as stories, itineraries as commitments.",
    prompt:
      "Build a travel experience site organised around place and feeling: map-anchored destination browsing, mood-first destination pages (film, weather-light, sound of the place in copy), itineraries presented as scannable day-by-day timelines, group-vs-solo clarity, and booking with transparent inclusions/exclusions tables.",
    implementation: "Itinerary timeline as vertical stepper with day collapse; destination cards keyed to a simple map or stylized coordinates list.",
    stack: ["Next.js"],
    tags: ["travel", "itinerary", "map", "adventure"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["hover", "scroll"],
  }),
  M({
    id: "websites/education",
    category: "websites", subcategory: "content",
    name: "Educational Platform",
    tagline: "Curriculum as product; progress as the retention loop.",
    description:
      "An education platform with outcome-first marketing and a real classroom: syllabus accordions, progress rails, and honest difficulty ratings.",
    prompt:
      "Build an educational platform with outcome-first positioning: 'you'll build X' on every course card, syllabus accordions with week-level granularity, instructor credibility with real credentials, cohort seat meters that tell the truth, and a classroom view pairing lesson content with a persistent progress rail. Learning momentum must be visible at all times.",
    implementation: "Course/cohort/lesson data model; progress persisted per enrollment; seat counts rendered server-side for accuracy.",
    stack: ["Next.js"],
    tags: ["education", "courses", "learning", "classroom"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated", "hover"],
  }),
  M({
    id: "websites/fintech-dashboard",
    category: "websites", subcategory: "product",
    name: "Financial Dashboard",
    tagline: "Money UI where every number earns its pixels.",
    description:
      "A finance-grade interface: tabular numerals, honest deltas (up AND down), transaction feeds, and security information as content.",
    prompt:
      "Build a financial dashboard with money-grade discipline: tabular numerals everywhere numbers appear, balances with odometer transitions that move honestly up and down, a transaction feed with pending states, category chips, export paths (CSV/PDF), a security section that reads like an audit (encryption, custody, certifications), and zero decorative motion — finance motion must feel safe.",
    implementation: "All currency formatted via Intl.NumberFormat; pending transactions visually distinct; deltas colored green/red with text equivalents (not color-only).",
    stack: ["Next.js", "TypeScript"],
    tags: ["fintech", "finance", "dashboard", "banking"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["realtime", "hover"],
    a11y: "Never encode financial state by color alone; provide text deltas and aria-live announcements for balance changes.",
    conflicts: [
      { id: "motion/elastic-movement", reason: "Bouncy/elastic motion undermines the perceived safety of money movement — use measured easings." },
    ],
  }),
  M({
    id: "websites/dataviz-platform",
    category: "websites", subcategory: "content",
    name: "Data Visualization Platform",
    tagline: "Charts as arguments, not decorations.",
    description:
      "A platform where visualization is the product: interactive charts with provenance, explorable datasets, and methodology transparency.",
    prompt:
      "Build a data visualization platform where every chart argues a point: interactive charts with hover detail and provenance notes ('source: …, updated …'), explorable dataset views with filter→chart sync, annotation layers for key events, exportable states (share links preserve filters), and a methodology page that explains collection and caveats honestly.",
    implementation: "Chart state (filters, ranges) encoded in URL params; axis animation minimal; keyboard-operable data tables mirror every chart.",
    stack: ["Next.js", "Canvas/SVG"],
    tags: ["dataviz", "charts", "analytics", "transparency"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["hover", "realtime"],
    a11y: "Every chart ships with a data-table alternative and a text summary of the key finding.",
    suggests: ["math/force-graph", "math/heatmap"],
  }),
];
