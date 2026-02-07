"use client";

import { useEffect, useRef, useState, useMemo } from "react";

const scenes = [
  {
    emoji: "\u{1F41A}",
    bg: "linear-gradient(135deg, #0a3d5c 0%, #1a6b7a 50%, #2d9a8f 100%)",
    track: "Aquarium",
    source: "Maplestory OST",
    location: "Alki Beach, Seattle",
    tags: [
      ["\u{1F3D6}\uFE0F Beach", "tag-loc"],
      ["Afternoon", "tag-time"],
      ["Walking", "tag-act"],
    ] as [string, string][],
    waveColor: "#1dd3b0",
    btnLabel: "\u{1F3D6}\uFE0F Beach",
  },
  {
    emoji: "\u{1F306}",
    bg: "linear-gradient(135deg, #1a1040 0%, #3d2070 50%, #6a3093 100%)",
    track: "Lazy Afternoons",
    source: "Kingdom Hearts II",
    location: "Capitol Hill, Seattle",
    tags: [
      ["\u{1F3D9}\uFE0F City", "tag-loc"],
      ["Evening", "tag-time"],
      ["Exploring", "tag-act"],
    ] as [string, string][],
    waveColor: "#7b6bdb",
    btnLabel: "\u{1F3D9}\uFE0F City",
  },
  {
    emoji: "\u{1F33F}",
    bg: "linear-gradient(135deg, #0d2818 0%, #1a4a2e 50%, #2d6a4f 100%)",
    track: "Kokiri Forest",
    source: "Zelda: Ocarina of Time",
    location: "Discovery Park, Seattle",
    tags: [
      ["\u{1F332} Park", "tag-loc"],
      ["Morning", "tag-time"],
      ["Walking", "tag-act"],
    ] as [string, string][],
    waveColor: "#4ade80",
    btnLabel: "\u{1F332} Park",
  },
];

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const notesCanvasRef = useRef<HTMLCanvasElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const mapSectionRef = useRef<HTMLElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const scene = scenes[currentScene];

  const waveformBars = useMemo(
    () =>
      Array.from({ length: 32 }, () => ({
        height: Math.random() * 18 + 4,
        delay: Math.random() * 1.4,
      })),
    []
  );

  const dividerBars = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        height: Math.random() * 28 + 6,
        delay: Math.random() * 1.4,
      })),
    []
  );

  // Auto-cycle scenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0, rootMargin: "0px 0px 50px 0px" }
    );
    const revealEls = document.querySelectorAll(".reveal");
    revealEls.forEach((el) => observer.observe(el));

    // Fallback: force-reveal any elements still hidden after 2s
    const fallbackTimer = setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("visible"));
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Nav shrink on scroll
  useEffect(() => {
    const handler = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Cursor glow
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const handler = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = e.clientX + "px";
        cursorGlowRef.current.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  // Floating music notes canvas (skip if prefers-reduced-motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = notesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Note {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      symbol: string;
      rotation: number;
      rotSpeed: number;
    }

    let notes: Note[] = [];
    const symbols = ["\u266A", "\u266B", "\u266C", "\u{1F3B5}"];
    let animId: number;
    let paused = false;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Pause when tab is hidden
    function onVisibility() {
      paused = document.hidden;
      if (!paused) animId = requestAnimationFrame(animate);
    }
    document.addEventListener("visibilitychange", onVisibility);

    function spawnNote() {
      if (paused || notes.length > 12) return;
      notes.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height + 20,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.15),
        size: Math.random() * 12 + 10,
        opacity: Math.random() * 0.12 + 0.03,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    function animate() {
      if (paused) return;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      notes = notes.filter((n) => n.y > -40 && n.opacity > 0);
      notes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.rotation += n.rotSpeed;
        n.opacity -= 0.00015;
        ctx!.save();
        ctx!.translate(n.x, n.y);
        ctx!.rotate(n.rotation);
        ctx!.globalAlpha = Math.max(0, n.opacity);
        ctx!.font = `${n.size}px sans-serif`;
        ctx!.textAlign = "center";
        ctx!.fillText(n.symbol, 0, 0);
        ctx!.restore();
      });
      animId = requestAnimationFrame(animate);
    }

    const spawnInterval = setInterval(spawnNote, 1200);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Animated map canvas (pauses when off-screen, skips if reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = mapCanvasRef.current;
    const section = mapSectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 60;
    let cols: number, rows: number;
    let grid: (typeof zoneTypes[number] | null)[][] = [];
    let t = 0;
    let animId: number;
    let isVisible = false;

    const zoneTypes = [
      { type: "beach", fill: "rgba(29, 211, 176, 0.07)", border: "rgba(29, 211, 176, 0.2)" },
      { type: "urban_dense", fill: "rgba(150, 150, 170, 0.06)", border: "rgba(150, 150, 170, 0.18)" },
      { type: "park", fill: "rgba(100, 200, 100, 0.07)", border: "rgba(100, 200, 100, 0.2)" },
      { type: "residential", fill: "rgba(244, 162, 97, 0.06)", border: "rgba(244, 162, 97, 0.18)" },
      { type: "cafe", fill: "rgba(123, 107, 219, 0.06)", border: "rgba(123, 107, 219, 0.18)" },
      { type: "waterfront", fill: "rgba(100, 180, 255, 0.06)", border: "rgba(100, 180, 255, 0.18)" },
    ];

    let playerPath: { x: number; y: number }[] = [];
    let playerIdx = 0;
    let playerX = 0,
      playerY = 0;

    function initGrid() {
      cols = Math.ceil(canvas!.width / CELL) + 1;
      rows = Math.ceil(canvas!.height / CELL) + 1;
      grid = Array.from({ length: rows }, () => Array(cols).fill(null));

      const numSeeds = Math.floor((cols * rows) / 25);
      const seeds: { c: number; r: number; zone: typeof zoneTypes[number] }[] = [];
      for (let i = 0; i < numSeeds; i++) {
        const sc = Math.floor(Math.random() * cols);
        const sr = Math.floor(Math.random() * rows);
        const zone = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
        seeds.push({ c: sc, r: sr, zone });
        grid[sr][sc] = zone;
      }

      seeds.forEach((seed) => {
        const w = Math.floor(Math.random() * 4) + 2;
        const h = Math.floor(Math.random() * 3) + 2;
        for (let dr = 0; dr < h; dr++) {
          for (let dc = 0; dc < w; dc++) {
            const r = seed.r + dr;
            const c = seed.c + dc;
            if (r >= 0 && r < rows && c >= 0 && c < cols && !grid[r][c]) {
              grid[r][c] = seed.zone;
            }
          }
        }
      });
    }

    function initPlayer() {
      playerPath = [];
      let c = Math.floor(cols / 2),
        r = Math.floor(rows / 2);
      for (let i = 0; i < 200; i++) {
        playerPath.push({ x: c * CELL + CELL / 2, y: r * CELL + CELL / 2 });
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0 && c < cols - 2) c++;
        else if (dir === 1 && c > 1) c--;
        else if (dir === 2 && r < rows - 2) r++;
        else if (dir === 3 && r > 1) r--;
      }
      playerIdx = 0;
      playerX = playerPath[0].x;
      playerY = playerPath[0].y;
    }

    function resize() {
      canvas!.width = section!.offsetWidth;
      canvas!.height = section!.offsetHeight;
      initGrid();
      initPlayer();
    }
    resize();
    window.addEventListener("resize", resize);

    // Pause when section is off-screen
    const visObs = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) animId = requestAnimationFrame(animate);
      },
      { threshold: 0 }
    );
    visObs.observe(section);

    function animate() {
      if (!isVisible) return;
      t += 0.008;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Street grid
      ctx!.strokeStyle = "rgba(255,255,255,0.025)";
      ctx!.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        ctx!.beginPath();
        ctx!.moveTo(c * CELL, 0);
        ctx!.lineTo(c * CELL, rows * CELL);
        ctx!.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx!.beginPath();
        ctx!.moveTo(0, r * CELL);
        ctx!.lineTo(cols * CELL, r * CELL);
        ctx!.stroke();
      }

      // Zone cells
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const zone = grid[r][c];
          if (!zone) continue;
          const x = c * CELL;
          const y = r * CELL;
          const pulse = Math.sin(t * 1.5 + c * 0.3 + r * 0.2) * 0.015 + 1;

          ctx!.globalAlpha = pulse;
          ctx!.fillStyle = zone.fill;
          ctx!.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);

          ctx!.strokeStyle = zone.border;
          ctx!.lineWidth = 1;
          const drawTop = r === 0 || grid[r - 1][c] !== zone;
          const drawBot = r === rows - 1 || grid[r + 1]?.[c] !== zone;
          const drawLeft = c === 0 || grid[r][c - 1] !== zone;
          const drawRight = c === cols - 1 || grid[r][c + 1] !== zone;

          ctx!.beginPath();
          if (drawTop) { ctx!.moveTo(x, y); ctx!.lineTo(x + CELL, y); }
          if (drawBot) { ctx!.moveTo(x, y + CELL); ctx!.lineTo(x + CELL, y + CELL); }
          if (drawLeft) { ctx!.moveTo(x, y); ctx!.lineTo(x, y + CELL); }
          if (drawRight) { ctx!.moveTo(x + CELL, y); ctx!.lineTo(x + CELL, y + CELL); }
          ctx!.stroke();
          ctx!.globalAlpha = 1;
        }
      }

      // Player movement
      const target = playerPath[playerIdx];
      const dx = target.x - playerX;
      const dy = target.y - playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        playerIdx = (playerIdx + 1) % playerPath.length;
      } else {
        playerX += (dx / dist) * 0.6;
        playerY += (dy / dist) * 0.6;
      }

      // Player glow
      const grad = ctx!.createRadialGradient(playerX, playerY, 0, playerX, playerY, 40);
      grad.addColorStop(0, "rgba(249, 112, 104, 0.15)");
      grad.addColorStop(1, "transparent");
      ctx!.fillStyle = grad;
      ctx!.fillRect(playerX - 40, playerY - 40, 80, 80);

      // Player dot
      ctx!.beginPath();
      ctx!.arc(playerX, playerY, 4, 0, Math.PI * 2);
      ctx!.fillStyle = "#f97068";
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(playerX, playerY, 8, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(249, 112, 104, 0.3)";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      visObs.disconnect();
    };
  }, []);

  return (
    <>
      <div className="grid-bg" />
      <canvas ref={notesCanvasRef} id="notes-canvas" />
      <div className="cursor-glow" ref={cursorGlowRef} />

      {/* NAV */}
      <nav ref={navRef}>
        <div className="container">
          <div className="logo">
            OVER<span>WORLD</span>
          </div>
          <div className="nav-links">
            <a href="#concept">Concept</a>
            <a href="#how">How It Works</a>
            <a href="#community">Community</a>
            <a href="#help">Contribute</a>
            <a href="#cta" className="nav-cta">
              Join
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="container">
          <div className="hero-inner">
            <div>
              <div className="hero-tag">
                <div className="dot" />
                <span>Building now &middot; MVP targeting spring 2026</span>
              </div>
              <h1>
                Your personal
                <br />
                <span className="gradient-text">soundtrack</span>
                <br />
                for reality.
              </h1>
              <p className="hero-sub">
                A music app that knows where you are, what time it is, and what
                you&apos;re doing &mdash; then plays the perfect song. No scrolling.
                No choosing. Just living.
              </p>
              <div className="hero-actions">
                <a href="#cta" className="btn btn-primary">
                  Get Involved &rarr;
                </a>
                <a href="#concept" className="btn btn-ghost">
                  See how it works
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 18,
                  color: "var(--text-dim)",
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                <span>Works with</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#ccc"
                  aria-label="Apple Music"
                  role="img"
                >
                  <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0 0 19.7.28a10.16 10.16 0 0 0-1.898-.122C17.337.09 16.87.07 12 .07s-5.337.02-5.798.09A10.19 10.19 0 0 0 4.302.28a5.02 5.02 0 0 0-1.874.61C1.31 1.6.565 2.6.248 3.91a9.23 9.23 0 0 0-.24 2.19c-.07.46-.09.93-.09 5.9s.02 5.44.09 5.9a9.23 9.23 0 0 0 .24 2.19c.317 1.31 1.062 2.31 2.18 3.043a5.02 5.02 0 0 0 1.874.61c.597.1 1.2.15 1.898.17.466.06.932.08 5.802.08s5.337-.02 5.798-.08a10.19 10.19 0 0 0 1.898-.17 5.022 5.022 0 0 0 1.874-.61c1.118-.733 1.863-1.733 2.18-3.043a9.23 9.23 0 0 0 .24-2.19c.07-.46.09-.93.09-5.9s-.02-5.44-.09-5.9zm-6.92 14.554a.56.56 0 0 1-.373.148.54.54 0 0 1-.148-.02l-.107-.04a4.94 4.94 0 0 1-1.713-1.145 3.17 3.17 0 0 1-.773-1.347c-.15-.555-.165-1.16-.044-1.7.184-.82.674-1.49 1.32-1.883a2.86 2.86 0 0 1 1.404-.45c.108-.006.254.006.37.016V8.076a.34.34 0 0 0-.275-.335l-6.51 1.395a.34.34 0 0 0-.266.33v7.463a4.24 4.24 0 0 1-.178 1.08 3.17 3.17 0 0 1-.773 1.348 4.94 4.94 0 0 1-1.713 1.145l-.107.04a.54.54 0 0 1-.148.02.56.56 0 0 1-.373-.148 2.85 2.85 0 0 1-.612-1.013 3.12 3.12 0 0 1-.178-1.504c.09-.64.374-1.19.79-1.608a3.67 3.67 0 0 1 1.572-.955c.33-.108.693-.17 1.066-.19V8.198c0-.557.353-1.053.88-1.235l6.51-1.93a1.3 1.3 0 0 1 .388-.06c.677 0 1.23.548 1.23 1.22v10.56a4.24 4.24 0 0 1-.178 1.08 3.12 3.12 0 0 1-.45.845z" />
                </svg>
                <span style={{ color: "#ccc", fontSize: 13, fontWeight: 400 }}>
                  Apple Music
                </span>
                <span>&</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#ccc"
                  aria-label="Spotify"
                  role="img"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span style={{ color: "#ccc", fontSize: 13, fontWeight: 400 }}>
                  Spotify
                </span>
              </div>
            </div>

            {/* NOW PLAYING CARD */}
            <div className="hero-demo">
              <div className="now-playing-card">
                <div className="np-header">
                  <span className="np-label">Now Playing</span>
                  <span className="np-location">
                    <span className="loc-dot" /> {scene.location}
                  </span>
                </div>
                <div className="np-album" style={{ background: scene.bg }}>
                  <div className="np-album-bg">{scene.emoji}</div>
                </div>
                <div className="np-track-name">{scene.track}</div>
                <div className="np-track-source">{scene.source}</div>
                <div className="np-waveform">
                  {waveformBars.map((bar, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{
                        ["--h" as string]: `${bar.height}px`,
                        animationDelay: `${bar.delay}s`,
                        background: scene.waveColor,
                      }}
                    />
                  ))}
                </div>
                <div className="np-context-tags">
                  {scene.tags.map(([label, cls]) => (
                    <span key={label} className={`np-ctx-tag ${cls}`}>
                      {label}
                    </span>
                  ))}
                </div>
                <div className="scene-switcher">
                  {scenes.map((s, i) => (
                    <button
                      key={i}
                      className={`scene-btn ${i === currentScene ? "active" : ""}`}
                      onClick={() => setCurrentScene(i)}
                      aria-label={`Switch to ${s.track} - ${s.location}`}
                      aria-pressed={i === currentScene}
                    >
                      {s.btnLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAVE DIVIDER */}
      <div className="wave-divider" id="concept">
        {dividerBars.map((bar, i) => (
          <div
            key={i}
            className="bar"
            style={{
              ["--h" as string]: `${bar.height}px`,
              animationDelay: `${bar.delay}s`,
            }}
          />
        ))}
      </div>

      {/* CONCEPT */}
      <section>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">The Concept</p>
            <h2>
              Every place has
              <br />
              its own theme.
            </h2>
            <p>
              In games, walking into a new area changes the music. Overworld
              does that for real life &mdash; matching soundtracks to the world
              around you.
            </p>
          </div>

          <div className="concept-grid">
            <div className="concept-card reveal reveal-delay-1">
              <div className="cc-tags">
                <span className="cc-tag tag-loc">{"\u{1F3D6}\uFE0F"} Beach</span>
                <span className="cc-tag tag-time">Afternoon</span>
                <span className="cc-tag tag-act">Walking</span>
              </div>
              <p className="cc-desc">
                Sun on your face, sand underfoot, waves in the distance. The
                music just fits.
              </p>
              <div className="cc-track">
                <div className="cc-art" style={{ background: "var(--teal-dim)" }}>
                  {"\u{1F41A}"}
                </div>
                <div>
                  <div className="cc-track-name">Aquarium</div>
                  <div className="cc-track-src">Maplestory OST</div>
                </div>
              </div>
            </div>
            <div className="concept-card reveal reveal-delay-2">
              <div className="cc-tags">
                <span className="cc-tag tag-loc">{"\u{1F3D9}\uFE0F"} City</span>
                <span className="cc-tag tag-time">Evening</span>
                <span className="cc-tag tag-act">Exploring</span>
              </div>
              <p className="cc-desc">
                Neon signs flicker on. The city hums around you. Main character
                energy.
              </p>
              <div className="cc-track">
                <div className="cc-art" style={{ background: "var(--purple-dim)" }}>
                  {"\u{1F306}"}
                </div>
                <div>
                  <div className="cc-track-name">Lazy Afternoons</div>
                  <div className="cc-track-src">Kingdom Hearts II</div>
                </div>
              </div>
            </div>
            <div className="concept-card reveal reveal-delay-3">
              <div className="cc-tags">
                <span className="cc-tag tag-loc">{"\u{1F332}"} Park</span>
                <span className="cc-tag tag-time">Morning</span>
                <span className="cc-tag tag-act">Walking</span>
              </div>
              <p className="cc-desc">
                Quiet trails, birdsong, dappled light through the canopy. Peace.
              </p>
              <div className="cc-track">
                <div className="cc-art" style={{ background: "rgba(100,200,100,0.1)" }}>
                  {"\u{1F33F}"}
                </div>
                <div>
                  <div className="cc-track-name">Kokiri Forest</div>
                  <div className="cc-track-src">Zelda: Ocarina of Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: "var(--bg-elevated)" }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">How It Works</p>
            <h2>
              Three dimensions
              <br />
              of context.
            </h2>
            <p>
              Overworld connects to Apple Music or Spotify &mdash; your
              playlists, your albums, your library. It reads where you are, what
              time it is, and what you&apos;re doing &mdash; then plays the
              perfect match.
            </p>
          </div>

          <div className="dim-grid reveal">
            <div className="dim-card">
              <span className="dim-num">01</span>
              <span className="dim-icon">{"\u{1F4CD}"}</span>
              <h3>Location</h3>
              <p>
                Create &ldquo;grids&rdquo; &mdash; zones classified by type. Beach, park,
                city, residential. Not specific addresses &mdash; types that work
                anywhere in the world.
              </p>
            </div>
            <div className="dim-card">
              <span className="dim-num">02</span>
              <span className="dim-icon">{"\u23F0"}</span>
              <h3>Time</h3>
              <p>
                Morning energy is different from evening calm. Overworld adapts
                your soundtrack as the day progresses.
              </p>
            </div>
            <div className="dim-card">
              <span className="dim-num">03</span>
              <span className="dim-icon">{"\u{1F6B6}"}</span>
              <h3>Activity</h3>
              <p>
                Walking gets exploration vibes. Sitting gets focus beats.
                Driving gets road trip energy. Motion sensors handle it.
              </p>
            </div>
          </div>

          <div className="modes-row reveal">
            <div className="mode-card">
              <h3>{"\u26A1"} Manual Mode</h3>
              <p>
                Quick scene switching. Zero battery drain. The default for
                everyone.
              </p>
            </div>
            <div className="mode-card">
              <h3>{"\u2728"} Automatic Mode</h3>
              <p>
                Opt-in hands-free. Motion-triggered, battery-optimized. Music
                flows as you move.
              </p>
            </div>
          </div>

          <p
            className="reveal"
            style={{
              textAlign: "center",
              color: "var(--text-dim)",
              marginTop: 40,
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.75,
            }}
          >
            <span style={{ color: "var(--text-mid)", fontWeight: 500 }}>
              Free to use. Seriously.
            </span>
            <br />
            Create zones, paint your map, play your music &mdash; all free,
            forever.
            <br />
            <span style={{ opacity: 0.7 }}>
              Premium unlocks community sharing and automatic mode. $4.99/month.
            </span>
          </p>
        </div>
      </section>

      {/* ANIMATED MAP INTERLUDE */}
      <section className="map-demo-section" ref={mapSectionRef}>
        <canvas ref={mapCanvasRef} id="map-canvas" />
        <div className="map-demo-overlay reveal">
          <p className="label" style={{ marginBottom: 14 }}>
            The Grid System
          </p>
          <h2>
            Your city, your
            <br />
            sonic zones.
          </h2>
          <p>
            Draw zones on a map. Classify them by type. Assign soundtracks. Walk
            through them and the music changes.
          </p>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community">
        <div className="container">
          <div className="section-header reveal">
            <p className="label">The Differentiator</p>
            <h2>
              Shared sonic
              <br />
              landscapes.
            </h2>
            <p>
              Create grids for your city. Share them globally. When someone
              visits, they experience the world through your ears.
            </p>
          </div>

          <div className="community-grid">
            <div className="sonic-map reveal reveal-delay-1">
              <div className="map-author">
                <div
                  className="avatar"
                  style={{
                    background: "linear-gradient(135deg,var(--accent),var(--gold))",
                  }}
                >
                  N
                </div>
                <div>
                  <div className="name">Nathan&apos;s Seattle</div>
                  <div className="city">
                    47 grids &middot; 12 scenes &middot; 340 downloads
                  </div>
                </div>
              </div>
              <div className="map-zones">
                <div className="zone" style={{ background: "rgba(100,200,255,0.06)" }}>
                  <span className="zone-name">{"\u{1F30A}"} Alki Beach</span>
                  <span className="zone-track">Aquarium &mdash; Maplestory</span>
                </div>
                <div className="zone" style={{ background: "rgba(150,150,150,0.06)" }}>
                  <span className="zone-name">{"\u{1F3D9}\uFE0F"} Pike Place</span>
                  <span className="zone-track">Traverse Town &mdash; KH</span>
                </div>
                <div className="zone" style={{ background: "rgba(100,200,100,0.06)" }}>
                  <span className="zone-name">{"\u{1F332}"} Discovery Park</span>
                  <span className="zone-track">Kokiri Forest &mdash; Zelda</span>
                </div>
              </div>
            </div>
            <div className="sonic-map reveal reveal-delay-2">
              <div className="map-author">
                <div
                  className="avatar"
                  style={{
                    background: "linear-gradient(135deg,var(--purple),var(--teal))",
                  }}
                >
                  Y
                </div>
                <div>
                  <div className="name">Yuki&apos;s Tokyo</div>
                  <div className="city">
                    63 grids &middot; 18 scenes &middot; 892 downloads
                  </div>
                </div>
              </div>
              <div className="map-zones">
                <div className="zone" style={{ background: "rgba(123,107,219,0.06)" }}>
                  <span className="zone-name">{"\u{1F3EE}"} Shibuya</span>
                  <span className="zone-track">City Pop Mixtape</span>
                </div>
                <div className="zone" style={{ background: "rgba(249,112,104,0.06)" }}>
                  <span className="zone-name">{"\u26E9\uFE0F"} Asakusa</span>
                  <span className="zone-track">Okami &mdash; Main Theme</span>
                </div>
                <div className="zone" style={{ background: "rgba(244,162,97,0.06)" }}>
                  <span className="zone-name">{"\u{1F338}"} Ueno Park</span>
                  <span className="zone-track">Stardew &mdash; Spring</span>
                </div>
              </div>
            </div>
          </div>
          <p
            className="reveal"
            style={{
              textAlign: "center",
              color: "var(--text-dim)",
              marginTop: 28,
              fontSize: 14,
              fontWeight: 300,
            }}
          >
            Same place. Different soundtrack. Every grid is a personal
            expression.
          </p>
        </div>
      </section>

      {/* TECH + TIMELINE */}
      <section style={{ background: "var(--bg-elevated)" }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">Under the Hood</p>
            <h2>Built to ship.</h2>
            <p>
              Real tech, realistic timeline. This isn&apos;t a concept &mdash;
              it&apos;s being actively built.
            </p>
          </div>

          <div className="tech-pills reveal">
            {[
              "React Native",
              "TypeScript",
              "Apple Music + Spotify",
              "AWS Lambda",
              "DynamoDB",
              "GPS + Motion",
              "iOS First",
            ].map((pill) => (
              <div key={pill} className="tech-pill">
                {pill}
              </div>
            ))}
          </div>

          <div className="timeline reveal">
            <div className="tl-item active">
              <div className="tl-date">Q1&ndash;Q2 2026</div>
              <div className="tl-title">Build MVP</div>
              <div className="tl-desc">
                Manual mode, Spotify integration, grid system
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-date">Summer 2026</div>
              <div className="tl-title">Launch Seattle</div>
              <div className="tl-desc">
                Friends &amp; family, community features, backend
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-date">Fall 2026</div>
              <div className="tl-title">Auto Mode</div>
              <div className="tl-desc">
                Context detection, battery optimization, more cities
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-date">2027</div>
              <div className="tl-title">Scale</div>
              <div className="tl-desc">
                Growth push, expand cities, explore partnerships
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HELP / CONTRIBUTE */}
      <section id="help">
        <div className="container">
          <div className="section-header reveal">
            <p className="label">Join the Build</p>
            <h2>
              Looking for
              <br />
              collaborators.
            </h2>
            <p>
              No equity, no contracts. Just people who think this sounds cool
              and want to help make it real.
            </p>
          </div>

          <div className="roles-grid">
            <div className="role-card reveal reveal-delay-1">
              <span className="role-emoji">{"\u{1F3B5}"}</span>
              <h3>Music Curators</h3>
              <ul>
                <li>Define what &ldquo;beach afternoon&rdquo; sounds like</li>
                <li>Contribute playlists &amp; soundtrack picks</li>
                <li>Build the first Seattle sound library</li>
                <li>Help create context-to-music mappings</li>
              </ul>
            </div>
            <div className="role-card reveal reveal-delay-2">
              <span className="role-emoji">{"\u{1F3A8}"}</span>
              <h3>Designers</h3>
              <ul>
                <li>Make grid creation feel intuitive</li>
                <li>Design the map &amp; zone interfaces</li>
                <li>Create smooth scene transitions</li>
                <li>Shape the community discovery UX</li>
              </ul>
            </div>
            <div className="role-card reveal reveal-delay-3">
              <span className="role-emoji">{"\u{1F9EA}"}</span>
              <h3>Early Testers</h3>
              <ul>
                <li>Use it daily, give honest feedback</li>
                <li>Help tune context detection</li>
                <li>Create grids for your neighborhoods</li>
                <li>Spread the word</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL */}
      <section style={{ background: "var(--bg-elevated)" }}>
        <div className="container">
          <div className="personal-block reveal">
            <p className="label" style={{ marginBottom: 20 }}>
              Why I&apos;m Building This
            </p>
            <blockquote>
              I want to walk to the beach and have it just <em>know</em> to play
              Maplestory Aquarium. I want city walks to feel like moving through
              a game world.
            </blockquote>
            <p
              style={{
                color: "var(--text-dim)",
                fontWeight: 300,
                fontSize: 14,
                marginTop: 14,
                lineHeight: 1.75,
              }}
            >
              I&apos;ve wanted this for years. The Sony XM6&apos;s auto-scene
              feature came close but felt too limited. I can build the thing
              &mdash; I just need people who care about music and places to help
              make it something special.
            </p>
            <div className="personal-bio">
              <div className="bio-av">N</div>
              <div>
                <div className="bio-name">Nathan</div>
                <div className="bio-desc">Developer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div
          className="orb"
          style={{
            width: 600,
            height: 600,
            background: "var(--accent)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.04,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <p className="label reveal" style={{ marginBottom: 14 }}>
            Ready?
          </p>
          <h2 className="reveal">
            Make the world sound
            <br />
            as good as it{" "}
            <span className="gradient-text" style={{ fontSize: "inherit" }}>
              feels
            </span>
            .
          </h2>
          <p className="reveal">
            MVP targeting spring 2026. Looking for music lovers, designers, and
            early believers.
          </p>
          <div className="cta-actions reveal">
            <a href="mailto:nathan@overworld.dev" className="btn btn-primary">
              Let&apos;s Talk &rarr;
            </a>
            <a href="https://discord.gg/VgwJt2TM" className="btn btn-ghost">
              Join Discord
            </a>
          </div>
          {submitted ? (
            <p
              className="reveal"
              style={{
                color: "var(--teal)",
                fontSize: 14,
                fontWeight: 500,
                marginTop: 32,
                textAlign: "center",
              }}
            >
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          ) : (
            <form
              className="reveal"
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginTop: 32,
                maxWidth: 420,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                try {
                  await fetch("https://formsubmit.co/ajax/nathan@overworld.dev", {
                    method: "POST",
                    body: data,
                  });
                  setSubmitted(true);
                } catch {
                  setSubmitted(true);
                }
              }}
            >
              <input type="text" name="_honey" style={{ display: "none" }} />
              <input type="hidden" name="_subject" value="New Overworld signup!" />
              <input type="hidden" name="_template" value="table" />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  borderRadius: 100,
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text)",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                Notify Me
              </button>
            </form>
          )}
          <p className="cta-fine reveal">
            passion project &middot; no equity needed &middot; just come build
            cool stuff
          </p>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="logo" style={{ fontSize: 14 }}>
            OVER<span>WORLD</span>
          </div>
          <p>
            Your Personal Soundtrack for Reality &middot; overworld.dev &middot;
            2026
          </p>
        </div>
      </footer>
    </>
  );
}
