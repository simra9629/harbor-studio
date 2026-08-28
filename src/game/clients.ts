import { ClientProfile } from './types';

export const clients: Record<string, ClientProfile> = {
  elena: {
    id: 'elena',
    name: 'Elena Vargas',
    role: 'Bakery Owner',
    avatar: '🧁',
    personality: 'Warm, practical, easily impressed early on. Encouraging and supportive.',
    valuesmost: ['creativity', 'precision'],
    communicationStyle: 'email',
  },
  iqbal: {
    id: 'iqbal',
    name: 'Mr. Iqbal',
    role: 'Bookstore Owner',
    avatar: '📚',
    personality: 'Polite but exacting. Loves order and clean structure. Will request revisions.',
    valuesmost: ['precision', 'professionalism'],
    communicationStyle: 'email',
  },
  theo: {
    id: 'theo',
    name: 'Theo Park',
    role: 'Café Owner',
    avatar: '☕',
    personality: 'Detail-oriented perfectionist. Wants pixel-perfect layout. Short and direct.',
    valuesmost: ['professionalism', 'precision'],
    communicationStyle: 'chat',
  },
  maya: {
    id: 'maya',
    name: 'Maya Cole',
    role: 'Florist — Harbor Blooms',
    avatar: '🌸',
    personality: 'Soft-spoken, poetic, loves seasonal palettes. Trusts your taste.',
    valuesmost: ['creativity'],
    communicationStyle: 'email',
  },
  // === Act II — Seabrook Promenade ===
  mira: {
    id: 'mira',
    name: 'Mira Shah',
    role: 'Boutique Owner — Tide & Linen',
    avatar: '👗',
    personality: 'Stylish, fashion-forward, expects modern layouts and bold typography.',
    valuesmost: ['creativity', 'professionalism'],
    communicationStyle: 'chat',
  },
  lucas: {
    id: 'lucas',
    name: 'Lucas Bennett',
    role: 'Startup Founder — Bennett & Co.',
    avatar: '🚀',
    personality: 'Ambitious, energetic. Wants modern marketing pages with clear conversion paths.',
    valuesmost: ['creativity', 'professionalism'],
    communicationStyle: 'chat',
  },
  // === Act III — Cedar Heights University Campus ===
  dean: {
    id: 'dean',
    name: 'Dean Raghav',
    role: 'Department Head — Cedar Heights University',
    avatar: '🎓',
    personality: 'Minimalist, exacting. Cares about whitespace, grid, type, and proper forms.',
    valuesmost: ['precision', 'professionalism'],
    communicationStyle: 'email',
  },
  nora: {
    id: 'nora',
    name: 'Nora Lin',
    role: 'Campus Innovation Lead — Kindle.dev (campus incubator)',
    avatar: '💻',
    personality: 'Sharp, modern, asks for responsive layouts and dark UI.',
    valuesmost: ['professionalism', 'creativity'],
    communicationStyle: 'chat',
  },
  robotics: {
    id: 'robotics',
    name: 'Student Robotics Club',
    role: 'Cedar Heights Robotics — Captain Priya',
    avatar: '🤖',
    personality: 'Enthusiastic students. Want a club page with team roster and event countdown.',
    valuesmost: ['creativity'],
    communicationStyle: 'chat',
  },
  events: {
    id: 'events',
    name: 'Campus Event Portal',
    role: 'Student Affairs Office',
    avatar: '🗓️',
    personality: 'Wants a reliable event listings hub with filters and registration.',
    valuesmost: ['precision', 'professionalism'],
    communicationStyle: 'email',
  },
  // === Act IV — Cliffside Research Facility ===
  aria: {
    id: 'aria',
    name: 'Dr. Aria Sen',
    role: 'Director — Cliffside Observatory',
    avatar: '🔭',
    personality: 'Calm, intelligent, unforgiving of sloppy work. Demands JS accuracy.',
    valuesmost: ['precision', 'professionalism'],
    communicationStyle: 'email',
  },
  launch: {
    id: 'launch',
    name: 'Launch Countdown Team',
    role: 'Mission Control — Cliffside',
    avatar: '🚀',
    personality: 'High-stakes, exact specifications. Every second matters.',
    valuesmost: ['precision'],
    communicationStyle: 'chat',
  },
  dataviz: {
    id: 'dataviz',
    name: 'Data Visualization Panel',
    role: 'Research Analytics — Cliffside',
    avatar: '📊',
    personality: 'Cares about clarity, accessibility, and honest charting.',
    valuesmost: ['precision', 'professionalism'],
    communicationStyle: 'email',
  },
  // === Final Act — Seabrook Town Portal ===
  civic: {
    id: 'civic',
    name: 'Mayor Halvorsen',
    role: 'Seabrook Town Council',
    avatar: '🏛️',
    personality: 'Wants the official town digital portal. Civic pride, full creative trust.',
    valuesmost: ['precision', 'creativity', 'professionalism'],
    communicationStyle: 'email',
  },
  // Seabrook fillers
  sole:  { id: 'sole',  name: 'Sole Romano',     role: 'Gelato Maker — Sole Gelato',          avatar: '🍨', personality: 'Warm, family-run, Italian.', valuesmost: ['creativity'],          communicationStyle: 'email' },
  kira:  { id: 'kira',  name: 'Kira Volkov',     role: 'Arcade Operator — Promenade Arcade',  avatar: '🕹️', personality: 'Loud, retro, neon-loving.',  valuesmost: ['creativity'],          communicationStyle: 'chat'  },
  evren: { id: 'evren', name: 'Evren Demir',     role: 'Hotel Manager — Hotel Mistral',       avatar: '🏨', personality: 'Polished concierge.',         valuesmost: ['professionalism'],     communicationStyle: 'email' },
  rune:  { id: 'rune',  name: 'Rune Larsen',     role: 'Curator — Driftwood Gallery',         avatar: '🖼️', personality: 'Quiet, considered.',          valuesmost: ['creativity','precision'], communicationStyle: 'email' },
  // Cedar fillers (Innovation Hall / Student Hub leftovers)
  jun:   { id: 'jun',   name: 'Jun Tanaka',      role: 'Owner — Hush Matcha',                 avatar: '🍵', personality: 'Sparse, considered.',         valuesmost: ['precision'],            communicationStyle: 'email' },
  sasha: { id: 'sasha', name: 'Sasha Ortiz',     role: 'Coach — Cedar Climb',                 avatar: '🧗', personality: 'Direct, energetic.',          valuesmost: ['professionalism'],      communicationStyle: 'chat'  },
  iris:  { id: 'iris',  name: 'Iris Whitman',    role: 'Librarian — Cedar Library',           avatar: '🏢', personality: 'Pragmatic, businesslike.',    valuesmost: ['professionalism','precision'], communicationStyle: 'email' },
  mo:    { id: 'mo',    name: 'Mo Adeyemi',      role: 'Ops — Cedar Transit',                 avatar: '🚊', personality: 'Operational, terse.',         valuesmost: ['precision'],            communicationStyle: 'email' },

  // ===================================================================
  // ACT III — Cedar Heights expanded roster (per doc)
  // ===================================================================
  // NORTH LAWN
  primary:  { id: 'primary',  name: 'Cedar Heights Primary School', role: 'Collective Client — Teachers & Students', avatar: '🏫', personality: 'Bright, encouraging, practical.', valuesmost: ['creativity','professionalism'], communicationStyle: 'email' },
  eliza:    { id: 'eliza',    name: 'Mrs. Eliza Hart',              role: 'Librarian — Cedar Heights Library',       avatar: '📖', personality: 'Calm, organized, observant.',     valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },
  jonah:    { id: 'jonah',    name: 'Mr. Jonah Clarke',             role: 'History Teacher — Cedar Heights High',    avatar: '📜', personality: 'Enthusiastic storyteller.',       valuesmost: ['creativity','professionalism'],  communicationStyle: 'email' },
  ecoclub:  { id: 'ecoclub',  name: 'Environmental Club',           role: 'Student Group — Cedar Heights High',      avatar: '🌱', personality: 'Earnest, purpose-driven.',        valuesmost: ['creativity','precision'],        communicationStyle: 'chat'  },
  mathdept: { id: 'mathdept', name: 'Math Department',              role: 'Cedar Heights High School',               avatar: '➗', personality: 'Structured, clear.',              valuesmost: ['precision'],                     communicationStyle: 'email' },
  artprog:  { id: 'artprog',  name: 'After-School Art Program',     role: 'Cedar Heights Primary',                   avatar: '🎨', personality: 'Playful, experimental.',          valuesmost: ['creativity'],                    communicationStyle: 'chat'  },
  studentu: { id: 'studentu', name: 'Cedar Heights Student Union',  role: 'Bridge Client',                           avatar: '🎒', personality: 'Casual, mobile-first generation.', valuesmost: ['professionalism'],              communicationStyle: 'chat'  },
  langdept: { id: 'langdept', name: 'Language Department',          role: 'Cedar Heights High School',               avatar: '🗣️', personality: 'Methodical, cultural.',           valuesmost: ['precision'],                    communicationStyle: 'email' },

  // INNOVATION HALL
  brooks:   { id: 'brooks',   name: 'Professor Daniel Brooks',      role: 'Computer Science — Cedar Heights University', avatar: '👨‍🏫', personality: 'Direct, no fluff.',          valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },
  hackcom:  { id: 'hackcom',  name: 'Hackathon Committee',          role: 'University Hackathon Org',                 avatar: '⚡', personality: 'Time-pressured chaos.',           valuesmost: ['professionalism'],              communicationStyle: 'chat'  },
  grants:   { id: 'grants',   name: 'Research Grant Office',        role: 'University Administration',                avatar: '📑', personality: 'Formal, exact.',                  valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },
  gamedev:  { id: 'gamedev',  name: 'Oliver Grant',                 role: 'Game Dev Club — Lead',                     avatar: '🎮', personality: 'Overcaffeinated genius.',         valuesmost: ['creativity'],                    communicationStyle: 'chat'  },
  debate:   { id: 'debate',   name: 'Debate & Policy Club',         role: 'Student Society',                          avatar: '⚖️', personality: 'Structured but intense.',         valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },

  // STUDENT HUB
  noah:     { id: 'noah',     name: 'Noah Bennett',                 role: 'Hackathon Organizer',                      avatar: '⏱️', personality: 'Deadline-driven chaos.',          valuesmost: ['professionalism'],              communicationStyle: 'chat'  },
  lina:     { id: 'lina',     name: 'Lina Kovács',                  role: 'Art & Media Society — President',          avatar: '🎭', personality: 'Vision-first creative.',          valuesmost: ['creativity'],                    communicationStyle: 'chat'  },
  cafemgr:  { id: 'cafemgr',  name: 'Campus Café Manager',          role: 'Student Hub — Café',                       avatar: '🥐', personality: 'Practical, friendly.',            valuesmost: ['professionalism'],              communicationStyle: 'email' },
  film:     { id: 'film',     name: 'Film Society President',       role: 'Cedar Heights Film Society',               avatar: '🎬', personality: 'Passionate, dramatic.',           valuesmost: ['creativity'],                    communicationStyle: 'chat'  },
  psyclub:  { id: 'psyclub',  name: 'Psychology Club',              role: 'Student Society',                          avatar: '🧠', personality: 'Curious, experimental.',          valuesmost: ['precision','creativity'],        communicationStyle: 'email' },

  // ===================================================================
  // ACT IV — Axiom Institute (per doc)
  // ===================================================================
  // aria stays (Director — repurposed as Systems Research Lead)
  moreau:   { id: 'moreau',   name: 'Dr. Elias Moreau',             role: 'Systems Architect — Axiom Institute',      avatar: '♟️', personality: 'Precise, competitive, theatrical.', valuesmost: ['precision','professionalism'], communicationStyle: 'email' },
  yuna:     { id: 'yuna',     name: 'Yuna Park',                    role: 'Lead Visualization Designer — Axiom',      avatar: '📐', personality: 'Minimal, confident, observant.', valuesmost: ['creativity','precision'],        communicationStyle: 'email' },
  matteo:   { id: 'matteo',   name: 'Matteo Silva',                 role: 'Research Intern — Axiom',                  avatar: '🧪', personality: 'Fast-talking, charming, defensive.', valuesmost: ['creativity'],                  communicationStyle: 'chat'  },
  hoffman:  { id: 'hoffman',  name: 'Dr. Lena Hoffman',             role: 'Cognitive Modeling Lead — Axiom',          avatar: '⚙️', personality: 'Animated, enthusiastic.',         valuesmost: ['creativity','precision'],        communicationStyle: 'email' },
  khan:     { id: 'khan',     name: 'Dr. Ibrahim Khan',             role: 'Environmental Systems Analyst — Axiom',    avatar: '🌍', personality: 'Grounded, patient, reflective.',  valuesmost: ['precision'],                     communicationStyle: 'email' },
  maya2:    { id: 'maya2',    name: 'Maya Chen',                    role: 'Accessibility Consultant — Axiom',         avatar: '♿', personality: 'Direct, warm, sharp humor.',      valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },
  helena:   { id: 'helena',   name: 'Helena Duarte',                role: 'UX Stability Auditor — Axiom',             avatar: '💥', personality: 'Playful menace.',                 valuesmost: ['precision'],                     communicationStyle: 'chat'  },
  liaison:  { id: 'liaison',  name: 'Civic Services Liaison',       role: 'Public Deployment Coordinator',            avatar: '🤝', personality: 'Professional, persuasive.',       valuesmost: ['professionalism','precision'],   communicationStyle: 'email' },
  reviewbd: { id: 'reviewbd', name: 'Grants Review Board',          role: 'Oversight & Reporting Authority',          avatar: '🏷️', personality: 'Formal but fair.',                valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },

  // ===================================================================
  // ACT V — Meridian District (per doc)
  // ===================================================================
  varga:    { id: 'varga',    name: 'Elena Varga',                  role: 'Civic Services Director — Meridian',       avatar: '🏛️', personality: 'Direct, composed, quietly intense.', valuesmost: ['precision','professionalism'], communicationStyle: 'email' },
  marcus:   { id: 'marcus',   name: 'Marcus Chen',                  role: 'Financial Aid Systems — Meridian',         avatar: '💰', personality: 'Methodical, exact, slightly rigid.', valuesmost: ['precision'],                  communicationStyle: 'email' },
  mthompson:{ id: 'mthompson',name: 'Dr. Mira Thompson',            role: 'Health Portal Lead — Meridian',            avatar: '🏥', personality: 'Calm, empathetic, precise.',      valuesmost: ['professionalism','precision'],   communicationStyle: 'email' },
  rafael:   { id: 'rafael',   name: 'Rafael Ortega',                role: 'Urban Planning — Meridian',                avatar: '🗺️', personality: 'Charismatic, visual, analytical.', valuesmost: ['creativity','precision'],       communicationStyle: 'email' },
  lila:     { id: 'lila',     name: 'Lila Haddad',                  role: 'Permit Officer — Meridian',                avatar: '📋', personality: 'Slightly overwhelmed.',           valuesmost: ['professionalism'],              communicationStyle: 'email' },
  jonas:    { id: 'jonas',    name: 'Jonas Weber',                  role: 'Transport UI Lead — Meridian',             avatar: '🚍', personality: 'Obsessed with motion clarity.',   valuesmost: ['precision'],                     communicationStyle: 'email' },
  aisha:    { id: 'aisha',    name: 'Aisha Bello',                  role: 'Library Systems Lead — Meridian',          avatar: '📚', personality: 'Quiet but sharp.',                valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },
  daniel:   { id: 'daniel',   name: 'Daniel Novak',                 role: 'Business Registry — Meridian',             avatar: '🏷️', personality: 'Friendly, detail-heavy.',         valuesmost: ['precision'],                     communicationStyle: 'email' },
  sofia:    { id: 'sofia',    name: 'Sofia Alvarez',                role: 'Budget Office — Meridian',                 avatar: '📊', personality: 'Transparent, principled.',        valuesmost: ['precision','professionalism'],   communicationStyle: 'email' },
};
