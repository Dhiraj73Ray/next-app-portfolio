export const SKILL_CATEGORIES = {
  LANGUAGES:   { id: 'languages',   label: 'Languages',        color: '#3b82f6', planet: 'blue'   },
  FRONTEND:    { id: 'frontend',    label: 'Frontend',         color: '#a855f7', planet: 'purple' },
  BACKEND:     { id: 'backend',     label: 'Backend',          color: '#22c55e', planet: 'green'  },
  DATABASE:    { id: 'database',    label: 'Databases',        color: '#f59e0b', planet: 'amber'  },
  CLOUD:       { id: 'cloud',       label: 'Cloud & Hosting',  color: '#06b6d4', planet: 'cyan'   },
  AI:          { id: 'ai',          label: 'AI & ML',          color: '#ec4899', planet: 'pink'   },
  HARDWARE:    { id: 'hardware',    label: 'Hardware & ECE',   color: '#f97316', planet: 'orange' },
  TOOLS:       { id: 'tools',       label: 'Tools',            color: '#84cc16', planet: 'lime'   },
  SECURITY:    { id: 'security',    label: 'Security',         color: '#ef4444', planet: 'red'    },
  CS_CONCEPTS: { id: 'cs',          label: 'CS Concepts',      color: '#8b5cf6', planet: 'violet' },
};

export const SKILLS = [
  // ── LANGUAGES ──────────────────────────────────────────────────────
  { id: 's001', name: 'Python',        cat: 'LANGUAGES', level: 90, core: true,  dna: true,  icon: '🐍', desc: 'Primary language. Used in FastAPI, automation, AI pipelines.' },
  { id: 's002', name: 'JavaScript',    cat: 'LANGUAGES', level: 85, core: true,  dna: true,  icon: '🟨', desc: 'Core web language. Used across all frontend and Node projects.' },
  { id: 's003', name: 'TypeScript',    cat: 'LANGUAGES', level: 70, core: false, dna: false, icon: '🔷', desc: 'Typed JS. Used in React + Vite projects for better DX.' },
  { id: 's004', name: 'C',             cat: 'LANGUAGES', level: 65, core: true,  dna: true,  icon: '⚙️', desc: 'College foundation. Pointers, memory management, systems.' },
  { id: 's005', name: 'C++',           cat: 'LANGUAGES', level: 60, core: false, dna: false, icon: '⚙️', desc: 'OOP, STL, college DSA problems.' },
  { id: 's006', name: 'Java',          cat: 'LANGUAGES', level: 55, core: false, dna: false, icon: '☕', desc: 'College OOP course. Android basics.' },
  { id: 's007', name: 'HTML5',         cat: 'LANGUAGES', level: 90, core: true,  dna: true,  icon: '🌐', desc: 'Semantic markup. The backbone of every web project.' },
  { id: 's008', name: 'CSS3',          cat: 'LANGUAGES', level: 85, core: true,  dna: false, icon: '🎨', desc: 'Flexbox, Grid, animations, custom properties.' },
  { id: 's009', name: 'SQL',           cat: 'LANGUAGES', level: 80, core: true,  dna: false, icon: '🗃️', desc: 'Queries, joins, aggregations. Used daily with PostgreSQL.' },
  { id: 's010', name: 'Bash',          cat: 'LANGUAGES', level: 55, core: false, dna: false, icon: '💻', desc: 'Shell scripting, automation, Linux workflow.' },
  { id: 's011', name: 'MATLAB',        cat: 'LANGUAGES', level: 50, core: false, dna: false, icon: '📊', desc: 'ECE lab simulations. Signal processing coursework.' },
  { id: 's012', name: 'Verilog',       cat: 'LANGUAGES', level: 45, core: false, dna: false, icon: '🔌', desc: 'HDL for digital circuit design. FPGA lab work.' },
  { id: 's013', name: 'Go',            cat: 'LANGUAGES', level: 30, core: false, dna: false, icon: '🐹', desc: 'Heard of it. Interested in learning for backend.' },
  { id: 's014', name: 'Rust',          cat: 'LANGUAGES', level: 25, core: false, dna: false, icon: '🦀', desc: 'Aware of it. Memory safety without GC.' },
  { id: 's015', name: 'PHP',           cat: 'LANGUAGES', level: 30, core: false, dna: false, icon: '🐘', desc: 'Basic exposure. Seen in older web projects.' },
  { id: 's016', name: 'Dart',          cat: 'LANGUAGES', level: 35, core: false, dna: false, icon: '🎯', desc: 'Flutter language. Touched in mobile experiments.' },

  // ── FRONTEND ───────────────────────────────────────────────────────
  { id: 's017', name: 'React',         cat: 'FRONTEND',  level: 88, core: true,  dna: true,  icon: '⚛️', desc: 'Main frontend framework. Hooks, context, Router v6, RSC.' },
  { id: 's018', name: 'Next.js',       cat: 'FRONTEND',  level: 60, core: false, dna: false, icon: '▲',  desc: 'SSR/SSG. Used for portfolio and SEO-heavy projects.' },
  { id: 's019', name: 'Tailwind CSS',  cat: 'FRONTEND',  level: 85, core: true,  dna: false, icon: '🌊', desc: 'Utility-first CSS. Used in every recent project.' },
  { id: 's020', name: 'Framer Motion', cat: 'FRONTEND',  level: 70, core: false, dna: false, icon: '🎞️', desc: 'Declarative animations in React. Used across this portfolio.' },
  { id: 's021', name: 'Three.js',      cat: 'FRONTEND',  level: 40, core: false, dna: false, icon: '🎲', desc: '3D in the browser. Learning via this skills section!' },
  { id: 's022', name: 'Vite',          cat: 'FRONTEND',  level: 75, core: false, dna: false, icon: '⚡', desc: 'Build tool. Blazing fast dev server. Used in all React projects.' },
  { id: 's023', name: 'SWR',           cat: 'FRONTEND',  level: 55, core: false, dna: false, icon: '🔄', desc: 'Data fetching with caching. Used in MDS frontend.' },
  { id: 's024', name: 'Zustand',       cat: 'FRONTEND',  level: 50, core: false, dna: false, icon: '🐻', desc: 'Lightweight state management.' },
  { id: 's025', name: 'Bootstrap',     cat: 'FRONTEND',  level: 60, core: false, dna: false, icon: '🅱️', desc: 'Early web projects. Pre-Tailwind era.' },
  { id: 's026', name: 'GSAP',          cat: 'FRONTEND',  level: 45, core: false, dna: false, icon: '🎬', desc: 'Professional animation library. Driving this skills section.' },

  // ── BACKEND ────────────────────────────────────────────────────────
  { id: 's027', name: 'FastAPI',       cat: 'BACKEND',   level: 85, core: true,  dna: true,  icon: '🚀', desc: 'Primary backend framework. Built full MDS API with it.' },
  { id: 's028', name: 'Flask',         cat: 'BACKEND',   level: 75, core: true,  dna: false, icon: '🧪', desc: 'First backend framework. College projects + early work.' },
  { id: 's029', name: 'Node.js',       cat: 'BACKEND',   level: 65, core: false, dna: false, icon: '🟩', desc: 'JS runtime. Used with Express for API projects.' },
  { id: 's030', name: 'Express',       cat: 'BACKEND',   level: 60, core: false, dna: false, icon: '🛤️', desc: 'Minimal Node framework. RESTful APIs.' },
  { id: 's031', name: 'Django',        cat: 'BACKEND',   level: 45, core: false, dna: false, icon: '🎸', desc: 'Batteries-included Python framework. Explored briefly.' },
  { id: 's032', name: 'REST API',      cat: 'BACKEND',   level: 88, core: true,  dna: false, icon: '🔗', desc: 'Core API design pattern. Implemented in MDS and other projects.' },
  { id: 's033', name: 'WebSockets',    cat: 'BACKEND',   level: 50, core: false, dna: false, icon: '🔌', desc: 'Real-time communication. Explored for live features.' },
  { id: 's034', name: 'GraphQL',       cat: 'BACKEND',   level: 35, core: false, dna: false, icon: '◼️', desc: 'Query language for APIs. Aware of its benefits.' },
  { id: 's035', name: 'JWT',           cat: 'BACKEND',   level: 80, core: true,  dna: false, icon: '🔑', desc: 'Auth token standard. Implemented role-based auth in MDS.' },

  // ── DATABASES ──────────────────────────────────────────────────────
  { id: 's036', name: 'PostgreSQL',    cat: 'DATABASE',  level: 85, core: true,  dna: true,  icon: '🐘', desc: 'Primary database. Used in MDS with complex queries and relations.' },
  { id: 's037', name: 'MySQL',         cat: 'DATABASE',  level: 65, core: false, dna: false, icon: '🐬', desc: 'College DB lab. Web hosting environments.' },
  { id: 's038', name: 'SQLite',        cat: 'DATABASE',  level: 70, core: false, dna: false, icon: '💾', desc: 'Lightweight embedded DB. Flask college projects.' },
  { id: 's039', name: 'MongoDB',       cat: 'DATABASE',  level: 55, core: false, dna: false, icon: '🍃', desc: 'NoSQL document store. Explored for unstructured data.' },
  { id: 's040', name: 'Redis',         cat: 'DATABASE',  level: 45, core: false, dna: false, icon: '🔴', desc: 'In-memory cache. Aware of use cases for rate limiting, sessions.' },
  { id: 's041', name: 'Supabase',      cat: 'DATABASE',  level: 60, core: false, dna: false, icon: '⚡', desc: 'Open-source Firebase alternative. Postgres under the hood.' },
  { id: 's042', name: 'Firebase',      cat: 'DATABASE',  level: 55, core: false, dna: false, icon: '🔥', desc: 'Realtime DB + auth. Android and quick project use.' },
  { id: 's043', name: 'SQLAlchemy',    cat: 'DATABASE',  level: 70, core: false, dna: false, icon: '🧬', desc: 'Python ORM. Used with FastAPI in MDS backend.' },

  // ── CLOUD & HOSTING ────────────────────────────────────────────────
  { id: 's044', name: 'Git',           cat: 'CLOUD',     level: 88, core: true,  dna: true,  icon: '🌿', desc: 'Daily driver. Branching, merging, rebasing, conflict resolution.' },
  { id: 's045', name: 'GitHub',        cat: 'CLOUD',     level: 85, core: true,  dna: false, icon: '🐙', desc: 'Remote repos, PRs, issues, GitHub Pages deployments.' },
  { id: 's046', name: 'Vercel',        cat: 'CLOUD',     level: 70, core: false, dna: false, icon: '▲',  desc: 'Frontend deployments. Zero config React/Next deploys.' },
  { id: 's047', name: 'Netlify',       cat: 'CLOUD',     level: 55, core: false, dna: false, icon: '🌐', desc: 'Static site hosting. CI/CD from GitHub.' },
  { id: 's048', name: 'Google Cloud',  cat: 'CLOUD',     level: 40, core: false, dna: false, icon: '☁️', desc: 'GCP basics. Cloud functions, Cloud Run exposure.' },
  { id: 's049', name: 'AWS',           cat: 'CLOUD',     level: 35, core: false, dna: false, icon: '🟠', desc: 'EC2, S3 basics. Aware of the ecosystem.' },
  { id: 's050', name: 'Cloudflare',    cat: 'CLOUD',     level: 45, core: false, dna: false, icon: '🌥️', desc: 'DNS, CDN, DDoS protection. Used for domain management.' },

  // ── AI & ML ────────────────────────────────────────────────────────
  { id: 's051', name: 'OpenAI API',    cat: 'AI',        level: 75, core: true,  dna: false, icon: '🤖', desc: 'GPT-4 API. Built AI-powered features in projects.' },
  { id: 's052', name: 'Claude API',    cat: 'AI',        level: 70, core: false, dna: false, icon: '🧠', desc: 'Anthropic API. Used for reasoning-heavy tasks.' },
  { id: 's053', name: 'Gemini',        cat: 'AI',        level: 60, core: false, dna: false, icon: '♊', desc: 'Google AI API. Multimodal use cases.' },
  { id: 's054', name: 'Ollama',        cat: 'AI',        level: 65, core: false, dna: false, icon: '🦙', desc: 'Run LLMs locally. Privacy-first AI experiments.' },
  { id: 's055', name: 'HuggingFace',   cat: 'AI',        level: 55, core: false, dna: false, icon: '🤗', desc: 'Model hub. Transformers, datasets, spaces.' },
  { id: 's056', name: 'LangChain',     cat: 'AI',        level: 50, core: false, dna: false, icon: '🔗', desc: 'LLM orchestration. Chains, agents, RAG pipelines.' },
  { id: 's057', name: 'ElevenLabs',    cat: 'AI',        level: 55, core: false, dna: false, icon: '🎙️', desc: 'AI voice synthesis. Used in AI video/audio experiments.' },
  { id: 's058', name: 'Stable Diff',   cat: 'AI',        level: 50, core: false, dna: false, icon: '🎨', desc: 'Image generation. ComfyUI workflows.' },
  { id: 's059', name: 'PyTorch',       cat: 'AI',        level: 40, core: false, dna: false, icon: '🔥', desc: 'Deep learning framework. College AI coursework.' },
  { id: 's060', name: 'Prompt Eng.',   cat: 'AI',        level: 80, core: false, dna: false, icon: '✍️', desc: 'System prompts, few-shot, chain-of-thought. Daily use.' },

  // ── HARDWARE & ECE ─────────────────────────────────────────────────
  { id: 's061', name: 'Arduino',       cat: 'HARDWARE',  level: 70, core: true,  dna: false, icon: '🔵', desc: 'Microcontroller projects. Sensors, actuators, IoT experiments.' },
  { id: 's062', name: 'Raspberry Pi',  cat: 'HARDWARE',  level: 65, core: false, dna: false, icon: '🫐', desc: 'Linux SBC. Home server, GPIO projects.' },
  { id: 's063', name: 'ESP32',         cat: 'HARDWARE',  level: 60, core: false, dna: false, icon: '📡', desc: 'WiFi+BT microcontroller. IoT and wireless projects.' },
  { id: 's064', name: 'MQTT',          cat: 'HARDWARE',  level: 50, core: false, dna: false, icon: '📨', desc: 'IoT messaging protocol. Pub/sub for sensor data.' },
  { id: 's065', name: 'I2C / SPI',     cat: 'HARDWARE',  level: 55, core: false, dna: false, icon: '🔌', desc: 'Serial protocols. Sensor interfacing in lab work.' },
  { id: 's066', name: 'DSP',           cat: 'HARDWARE',  level: 60, core: false, dna: false, icon: '📈', desc: 'Digital Signal Processing. FFT, filters, MATLAB sims.' },
  { id: 's067', name: 'VLSI Design',   cat: 'HARDWARE',  level: 45, core: false, dna: false, icon: '🔬', desc: 'CMOS logic, layout, digital IC design coursework.' },
  { id: 's068', name: 'LTSpice',       cat: 'HARDWARE',  level: 50, core: false, dna: false, icon: '⚡', desc: 'Circuit simulation. Op-amp and filter design.' },
  { id: 's069', name: 'Proteus',       cat: 'HARDWARE',  level: 55, core: false, dna: false, icon: '🧪', desc: 'Circuit + microcontroller simulation. Arduino + 8051 labs.' },
  { id: 's070', name: 'MOSFET/BJT',    cat: 'HARDWARE',  level: 65, core: false, dna: false, icon: '📟', desc: 'Transistor theory. Amplifiers, switching circuits.' },
  { id: 's071', name: 'ADC/DAC',       cat: 'HARDWARE',  level: 60, core: false, dna: false, icon: '🎚️', desc: 'Signal conversion. Interface between analog and digital worlds.' },
  { id: 's072', name: 'ARM Cortex',    cat: 'HARDWARE',  level: 50, core: false, dna: false, icon: '💪', desc: 'Architecture studied in microprocessor coursework.' },

  // ── TOOLS ──────────────────────────────────────────────────────────
  { id: 's073', name: 'VS Code',       cat: 'TOOLS',     level: 95, core: true,  dna: false, icon: '💙', desc: 'Primary IDE. Extensions, debugging, integrated terminal.' },
  { id: 's074', name: 'Cursor',        cat: 'TOOLS',     level: 80, core: false, dna: false, icon: '🖱️', desc: 'AI-powered IDE. Used daily for AI-assisted coding.' },
  { id: 's075', name: 'Postman',       cat: 'TOOLS',     level: 75, core: false, dna: false, icon: '📮', desc: 'API testing and documentation. Used throughout MDS dev.' },
  { id: 's076', name: 'Notion',        cat: 'TOOLS',     level: 70, core: false, dna: false, icon: '📝', desc: 'Notes, project planning, documentation.' },
  { id: 's077', name: 'Figma',         cat: 'TOOLS',     level: 50, core: false, dna: false, icon: '🎨', desc: 'UI design and prototyping. Used for wireframes.' },
  { id: 's078', name: 'npm / pip',     cat: 'TOOLS',     level: 85, core: false, dna: false, icon: '📦', desc: 'Package managers. Daily use for JS and Python ecosystems.' },

  // ── SECURITY ───────────────────────────────────────────────────────
  { id: 's079', name: 'Kali Linux',    cat: 'SECURITY',  level: 50, core: false, dna: false, icon: '🐉', desc: 'Penetration testing OS. CTF and security experiments.' },
  { id: 's080', name: 'Wireshark',     cat: 'SECURITY',  level: 55, core: false, dna: false, icon: '🦈', desc: 'Network packet analysis. College networking lab.' },
  { id: 's081', name: 'OAuth 2.0',     cat: 'SECURITY',  level: 70, core: false, dna: false, icon: '🔐', desc: 'Authorization framework. Implemented in web projects.' },
  { id: 's082', name: 'TCP/IP',        cat: 'SECURITY',  level: 70, core: false, dna: false, icon: '🌐', desc: 'Core networking protocol. OSI model, subnetting, DNS.' },
  { id: 's083', name: 'OSI Model',     cat: 'SECURITY',  level: 65, core: false, dna: false, icon: '📡', desc: '7 layer model. Foundation of networking knowledge.' },

  // ── CS CONCEPTS ────────────────────────────────────────────────────
  { id: 's084', name: 'DSA',           cat: 'CS_CONCEPTS', level: 75, core: true,  dna: false, icon: '🌳', desc: 'Arrays, trees, graphs, DP, sliding window. Active LeetCode practice.' },
  { id: 's085', name: 'OOP',           cat: 'CS_CONCEPTS', level: 80, core: false, dna: false, icon: '🎯', desc: 'Classes, inheritance, polymorphism, encapsulation. Used across all languages.' },
  { id: 's086', name: 'DBMS',          cat: 'CS_CONCEPTS', level: 75, core: false, dna: false, icon: '🗄️', desc: 'Normalization, ACID, indexing, transactions. Theory + practice.' },
  { id: 's087', name: 'OS Concepts',   cat: 'CS_CONCEPTS', level: 65, core: false, dna: false, icon: '⚙️', desc: 'Processes, memory, scheduling, file systems, virtual memory.' },
  { id: 's088', name: 'Networking',    cat: 'CS_CONCEPTS', level: 65, core: false, dna: false, icon: '🌐', desc: 'HTTP, DNS, routing, load balancing, TCP/UDP.' },
  { id: 's089', name: 'Design Patterns', cat: 'CS_CONCEPTS', level: 60, core: false, dna: false, icon: '📐', desc: 'Singleton, Factory, Observer, MVC, Repository pattern.' },
  { id: 's090', name: 'Linux CLI',     cat: 'CS_CONCEPTS', level: 75, core: false, dna: false, icon: '🐧', desc: 'Terminal daily driver. File system, processes, permissions, ssh.' },
];
