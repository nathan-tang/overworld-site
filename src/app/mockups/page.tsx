"use client";

import "./mockups.css";

/* ============================================
   Shared Components
   ============================================ */

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div className="status-bar-right">
        <span>&#9679;&#9679;&#9679;&#9679;</span>
        <span>WiFi</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function TabBar({ active }: { active: string }) {
  const tabs = [
    { id: "music", icon: "♪", label: "Music" },
    { id: "scenes", icon: "⊞", label: "Scenes" },
    { id: "map", icon: "◉", label: "Map" },
    { id: "community", icon: "◈", label: "Community" },
    { id: "profile", icon: "○", label: "Profile" },
  ];
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item${tab.id === active ? " active" : ""}`}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </div>
      ))}
    </div>
  );
}

function PhoneFrame({
  children,
  label,
  sublabel,
}: {
  children: React.ReactNode;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-dynamic-island" />
          {children}
        </div>
      </div>
      <div className="phone-label">{label}</div>
      {sublabel && <div className="phone-sublabel">{sublabel}</div>}
    </div>
  );
}

/* ============================================
   App Screens
   ============================================ */

function NowPlayingScreen() {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    delay: `${(i * 0.06).toFixed(2)}s`,
    height: `${10 + Math.sin(i * 0.7) * 14 + 8}px`,
  }));

  const minimapColors = [
    "#1a6b5a", "#1a6b5a", "#5a3e9e", "#5a3e9e", "#c87f32", "#2ecc71",
    "#1a6b5a", "#1dd3b0", "#5a3e9e", "#c87f32", "#c87f32", "#2ecc71",
    "#f97068", "#1dd3b0", "#7b6bdb", "#c87f32", "#2ecc71", "#2ecc71",
  ];

  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="back-btn">‹</span>
        <h2>Now Playing</h2>
        <span className="nav-spacer" />
      </div>

      <div className="np-scene-label">☀ Beach Scene</div>

      <div className="np-album-art beach">
        <span>🌊</span>
      </div>

      <div className="np-track-info">
        <p className="np-track-name">Aquarium</p>
        <p className="np-track-source">Maplestory OST</p>
      </div>

      <div className="np-tags">
        <span className="tag tag-location">🏖 Beach</span>
        <span className="tag tag-time">🌅 Afternoon</span>
        <span className="tag tag-activity">🚶 Walking</span>
      </div>

      <div className="np-waveform">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="bar"
            style={{
              animationDelay: bar.delay,
              height: bar.height,
            }}
          />
        ))}
      </div>

      <div className="np-progress">
        <div className="np-progress-bar">
          <div className="np-progress-fill" />
        </div>
        <div className="np-progress-times">
          <span>1:24</span>
          <span>4:02</span>
        </div>
      </div>

      <div className="np-controls">
        <span className="np-control">⇆</span>
        <span className="np-control">⏮</span>
        <span className="np-control play">▶</span>
        <span className="np-control">⏭</span>
        <span className="np-control">↻</span>
      </div>

      <div className="np-minimap">
        <div className="np-minimap-grid">
          {minimapColors.map((color, i) => (
            <div
              key={i}
              className="np-minimap-cell"
              style={{ background: color, opacity: 0.6 }}
            />
          ))}
        </div>
        <span className="np-minimap-label">Seattle Downtown</span>
      </div>

      <TabBar active="music" />
    </div>
  );
}

function SceneSwitcherScreen() {
  const scenes = [
    { emoji: "🏖", name: "Beach", tracks: 24, active: true },
    { emoji: "🏙", name: "City", tracks: 18, active: false },
    { emoji: "🌳", name: "Park", tracks: 21, active: false },
    { emoji: "☕", name: "Café", tracks: 16, active: false },
    { emoji: "🏠", name: "Home", tracks: 12, active: false },
    { emoji: "💪", name: "Gym", tracks: 28, active: false },
    { emoji: "🌙", name: "Night Drive", tracks: 15, active: false },
    { emoji: "🌧", name: "Rain", tracks: 20, active: false },
    { emoji: "📚", name: "Library", tracks: 14, active: false },
  ];

  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="nav-spacer" />
        <h2>Scenes</h2>
        <span className="nav-spacer" />
      </div>

      <div className="screen-scroll" style={{ padding: "4px 0 0" }}>
        <div className="scenes-grid">
          {scenes.map((scene) => (
            <div
              key={scene.name}
              className={`scene-card${scene.active ? " active" : ""}`}
            >
              <span className="scene-emoji">{scene.emoji}</span>
              <span className="scene-name">{scene.name}</span>
              <span className="scene-tracks">{scene.tracks} tracks</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="scenes" />
    </div>
  );
}

function MapViewScreen() {
  const zoneColors: Record<string, string> = {
    beach: "rgba(29,211,176,0.35)",
    city: "rgba(123,107,219,0.35)",
    park: "rgba(46,204,113,0.35)",
    cafe: "rgba(244,162,97,0.35)",
    home: "rgba(249,112,104,0.25)",
    gym: "rgba(249,112,104,0.35)",
    empty: "rgba(255,255,255,0.02)",
  };

  const grid = [
    ["beach","beach","beach","park","park","park","park","park"],
    ["beach","beach","beach","park","park","park","park","park"],
    ["beach","beach","city","city","park","park","empty","empty"],
    ["cafe","city","city","city","city","gym","gym","empty"],
    ["cafe","cafe","city","city","city","gym","gym","empty"],
    ["cafe","cafe","city","city","city","city","home","home"],
    ["empty","cafe","city","city","city","city","home","home"],
    ["empty","empty","city","city","city","home","home","home"],
    ["empty","empty","empty","city","city","home","home","home"],
    ["empty","empty","empty","empty","city","home","empty","empty"],
  ];

  const legend = [
    { name: "Beach", color: "rgba(29,211,176,0.6)" },
    { name: "City", color: "rgba(123,107,219,0.6)" },
    { name: "Park", color: "rgba(46,204,113,0.6)" },
    { name: "Café", color: "rgba(244,162,97,0.6)" },
    { name: "Gym", color: "rgba(249,112,104,0.6)" },
    { name: "Home", color: "rgba(249,112,104,0.4)" },
  ];

  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="back-btn">‹</span>
        <h2>My Grid</h2>
        <span className="nav-spacer" />
      </div>

      <div className="map-container">
        <div className="map-title-bar">
          <h3>Seattle Downtown</h3>
          <span>47 zones</span>
        </div>

        <div className="map-grid">
          {grid.flat().map((zone, i) => (
            <div
              key={i}
              className={`map-cell${i === 35 ? " player" : ""}`}
              style={{ background: zoneColors[zone] }}
            />
          ))}
        </div>

        <div className="map-legend">
          {legend.map((item) => (
            <div key={item.name} className="map-legend-item">
              <div
                className="map-legend-dot"
                style={{ background: item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="map" />
    </div>
  );
}

function CommunityScreen() {
  const grids = [
    {
      name: "Nathan's Seattle",
      user: "Nathan",
      initial: "N",
      gradient: "linear-gradient(135deg, #f97068, #f4a261)",
      zones: 47,
      scenes: 12,
      downloads: 340,
      colors: ["#1dd3b0", "#7b6bdb", "#2ecc71", "#f4a261", "#f97068"],
    },
    {
      name: "Yuki's Tokyo",
      user: "Yuki",
      initial: "Y",
      gradient: "linear-gradient(135deg, #7b6bdb, #1dd3b0)",
      zones: 63,
      scenes: 18,
      downloads: 892,
      colors: ["#f97068", "#1dd3b0", "#7b6bdb", "#f4a261", "#2ecc71", "#7b6bdb"],
    },
    {
      name: "Marco's Rome",
      user: "Marco",
      initial: "M",
      gradient: "linear-gradient(135deg, #f4a261, #f97068)",
      zones: 35,
      scenes: 8,
      downloads: 156,
      colors: ["#f4a261", "#f97068", "#7b6bdb", "#1dd3b0"],
    },
  ];

  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="nav-spacer" />
        <h2>Community</h2>
        <span className="nav-spacer" />
      </div>

      <div className="community-tabs">
        <div className="community-tab active">Popular</div>
        <div className="community-tab">New</div>
        <div className="community-tab">Nearby</div>
      </div>

      <div className="screen-scroll">
        <div className="community-list">
          {grids.map((grid) => (
            <div key={grid.name} className="community-card">
              <div className="community-card-header">
                <div
                  className="community-avatar"
                  style={{ background: grid.gradient }}
                >
                  {grid.initial}
                </div>
                <div className="community-card-info">
                  <h4>{grid.name}</h4>
                  <p>by {grid.user}</p>
                </div>
              </div>
              <div className="community-card-stats">
                <span>
                  <strong>{grid.zones}</strong> zones
                </span>
                <span>
                  <strong>{grid.scenes}</strong> scenes
                </span>
                <span>
                  <strong>{grid.downloads}</strong> downloads
                </span>
              </div>
              <div className="community-zones-preview">
                {grid.colors.map((color, i) => (
                  <div key={i} style={{ background: color, opacity: 0.6 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="community" />
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="settings-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="nav-spacer" />
        <h2>Settings</h2>
        <span className="nav-spacer" />
      </div>

      <div className="settings-scroll">
        <div className="settings-section">
          <div className="settings-section-title">Music Services</div>
          <div className="settings-group">
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">🎵</span>
                <span className="settings-row-label">Apple Music</span>
              </div>
              <span className="settings-row-value">
                <span className="settings-check">✓</span> Connected
              </span>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">🎧</span>
                <span className="settings-row-label">Spotify</span>
              </div>
              <span className="settings-row-value" style={{ color: "#f97068" }}>
                Connect →
              </span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Mode</div>
          <div className="settings-group">
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">🎯</span>
                <span className="settings-row-label">Manual Mode</span>
              </div>
              <div className="settings-toggle" />
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">⚡</span>
                <span className="settings-row-label">Automatic Mode</span>
              </div>
              <div className="settings-toggle off" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Permissions</div>
          <div className="settings-group">
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">📍</span>
                <span className="settings-row-label">Location</span>
              </div>
              <span className="settings-row-value">
                <span className="settings-check">✓</span> Enabled
              </span>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">🏃</span>
                <span className="settings-row-label">Motion</span>
              </div>
              <span className="settings-row-value">
                <span className="settings-check">✓</span> Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Appearance</div>
          <div className="settings-group">
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">🌙</span>
                <span className="settings-row-label">Theme</span>
              </div>
              <span className="settings-row-value">Dark</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">About</div>
          <div className="settings-group">
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">ℹ️</span>
                <span className="settings-row-label">Version</span>
              </div>
              <span className="settings-row-value">1.0.0</span>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <span className="settings-row-icon">💬</span>
                <span className="settings-row-label">Discord</span>
              </div>
              <span className="settings-row-value" style={{ color: "#7b6bdb" }}>
                Join →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const previewColors1 = [
    "#1dd3b0", "#7b6bdb", "#2ecc71",
    "#f4a261", "#f97068", "#7b6bdb",
    "#1dd3b0", "#f97068", "#2ecc71",
  ];
  const previewColors2 = [
    "#2ecc71", "#2ecc71", "#f4a261",
    "#7b6bdb", "#1dd3b0", "#f4a261",
    "#7b6bdb", "#1dd3b0", "#f97068",
  ];

  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="nav-spacer" />
        <h2>Profile</h2>
        <span className="nav-spacer" />
      </div>

      <div className="profile-header">
        <div className="profile-avatar">N</div>
        <p className="profile-name">Nathan Tang</p>
        <p className="profile-handle">@nathan</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">3</div>
            <div className="profile-stat-label">Grids</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">47</div>
            <div className="profile-stat-label">Zones</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">340</div>
            <div className="profile-stat-label">Downloads</div>
          </div>
        </div>
        <button className="profile-edit-btn">Edit Profile</button>
      </div>

      <div className="screen-scroll">
        <div className="profile-section-title">My Grids</div>

        <div className="profile-grid-card">
          <div className="profile-grid-preview">
            {previewColors1.map((c, i) => (
              <div key={i} style={{ background: c, opacity: 0.6 }} />
            ))}
          </div>
          <div className="profile-grid-info">
            <h4>Seattle Downtown</h4>
            <p>47 zones · 12 scenes · 340 downloads</p>
          </div>
        </div>

        <div className="profile-grid-card">
          <div className="profile-grid-preview">
            {previewColors2.map((c, i) => (
              <div key={i} style={{ background: c, opacity: 0.6 }} />
            ))}
          </div>
          <div className="profile-grid-info">
            <h4>Portland Pearl District</h4>
            <p>28 zones · 8 scenes · 64 downloads</p>
          </div>
        </div>

        <div className="profile-grid-card">
          <div className="profile-grid-preview">
            {[
              "#f97068", "#f4a261", "#f4a261",
              "#1dd3b0", "#f97068", "#7b6bdb",
              "#1dd3b0", "#2ecc71", "#7b6bdb",
            ].map((c, i) => (
              <div key={i} style={{ background: c, opacity: 0.6 }} />
            ))}
          </div>
          <div className="profile-grid-info">
            <h4>Capitol Hill</h4>
            <p>19 zones · 6 scenes · 28 downloads</p>
          </div>
        </div>
      </div>

      <TabBar active="profile" />
    </div>
  );
}

function GridEditorScreen() {
  const palette = [
    { name: "Beach", color: "#1dd3b0", active: true },
    { name: "City", color: "#7b6bdb", active: false },
    { name: "Park", color: "#2ecc71", active: false },
    { name: "Café", color: "#f4a261", active: false },
    { name: "Gym", color: "#f97068", active: false },
    { name: "Home", color: "#e06050", active: false },
  ];

  const gridCells = [
    "#1dd3b0","#1dd3b0","#7b6bdb","#7b6bdb","#2ecc71","#2ecc71",
    "#1dd3b0","#1dd3b0","#7b6bdb","#7b6bdb","#2ecc71","#2ecc71",
    "#f4a261","#7b6bdb","#7b6bdb","#7b6bdb","#2ecc71","#2ecc71",
    "#f4a261","#f4a261","#7b6bdb","#7b6bdb","#f97068","#f97068",
    "#f4a261","#f4a261","#7b6bdb","#e06050","#e06050","#e06050",
    "rgba(255,255,255,0.04)","#f4a261","#7b6bdb","#e06050","#e06050","#e06050",
  ];

  return (
    <div className="editor-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="back-btn">‹</span>
        <h2>Edit Grid</h2>
        <span className="action-btn">Done</span>
      </div>

      <div
        className="editor-name-input"
        style={{ display: "block" }}
      >
        Seattle Downtown
      </div>

      <div className="editor-grid-container">
        <div className="editor-grid">
          {gridCells.map((color, i) => (
            <div
              key={i}
              className={`editor-cell${i === 14 ? " selected" : ""}`}
              style={{ background: color, opacity: 0.5 }}
            />
          ))}
        </div>
      </div>

      <div className="editor-palette">
        {palette.map((p) => (
          <div
            key={p.name}
            className={`editor-palette-swatch${p.active ? " active" : ""}`}
            style={{ background: p.color }}
            title={p.name}
          />
        ))}
      </div>
      <div className="editor-palette-label">Beach selected — tap a cell to paint</div>

      <div className="editor-actions">
        <button className="editor-btn-save">Save Grid</button>
        <button className="editor-btn-share">Share</button>
      </div>
    </div>
  );
}

function SearchScreen() {
  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="nav-spacer" />
        <h2>Search</h2>
        <span className="nav-spacer" />
      </div>

      <div className="search-input-wrapper">
        <span className="search-input-icon">🔍</span>
        <span className="search-input-text">Search grids, scenes, cities...</span>
      </div>

      <div className="screen-scroll">
        <div className="search-section">
          <div className="search-section-title">Recent</div>
          <div className="search-recent-list">
            <div className="search-recent-item">
              <span className="icon">↺</span> Tokyo
            </div>
            <div className="search-recent-item">
              <span className="icon">↺</span> Beach scenes
            </div>
            <div className="search-recent-item">
              <span className="icon">↺</span> Night drive playlists
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-section-title">Trending</div>
          <div className="search-trending-grid">
            <div className="search-trending-card">
              <h4>Yuki&apos;s Tokyo</h4>
              <p>63 zones · 892 ↓</p>
              <div className="search-trending-bar">
                <div style={{ background: "#f97068" }} />
                <div style={{ background: "#1dd3b0" }} />
                <div style={{ background: "#7b6bdb" }} />
                <div style={{ background: "#f4a261" }} />
              </div>
            </div>
            <div className="search-trending-card">
              <h4>LA Vibes</h4>
              <p>41 zones · 567 ↓</p>
              <div className="search-trending-bar">
                <div style={{ background: "#f4a261" }} />
                <div style={{ background: "#f97068" }} />
                <div style={{ background: "#1dd3b0" }} />
              </div>
            </div>
            <div className="search-trending-card">
              <h4>Rainy Portland</h4>
              <p>28 zones · 445 ↓</p>
              <div className="search-trending-bar">
                <div style={{ background: "#7b6bdb" }} />
                <div style={{ background: "#2ecc71" }} />
                <div style={{ background: "#1dd3b0" }} />
                <div style={{ background: "#7b6bdb" }} />
              </div>
            </div>
            <div className="search-trending-card">
              <h4>NYC Night</h4>
              <p>52 zones · 389 ↓</p>
              <div className="search-trending-bar">
                <div style={{ background: "#7b6bdb" }} />
                <div style={{ background: "#f97068" }} />
                <div style={{ background: "#f4a261" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar active="scenes" />
    </div>
  );
}

function NotificationsScreen() {
  const notifications = [
    {
      icon: "📥",
      text: (
        <>
          <strong>Yuki</strong> downloaded your Seattle grid
        </>
      ),
      time: "2h ago",
      unread: true,
    },
    {
      icon: "🗺",
      text: (
        <>
          New grid available: <strong>Portland Downtown</strong>
        </>
      ),
      time: "5h ago",
      unread: true,
    },
    {
      icon: "🏆",
      text: (
        <>
          Achievement unlocked: <strong>100 hours of Overworld</strong>
        </>
      ),
      time: "1d ago",
      unread: false,
    },
    {
      icon: "❤️",
      text: (
        <>
          <strong>Marco</strong> liked your Seattle grid
        </>
      ),
      time: "2d ago",
      unread: false,
    },
    {
      icon: "📥",
      text: (
        <>
          <strong>Aiko</strong> downloaded your Seattle grid
        </>
      ),
      time: "3d ago",
      unread: false,
    },
    {
      icon: "🌟",
      text: (
        <>
          Your Seattle grid is now <strong>trending</strong>
        </>
      ),
      time: "4d ago",
      unread: false,
    },
  ];

  return (
    <div className="np-screen">
      <StatusBar />
      <div className="screen-nav">
        <span className="nav-spacer" />
        <h2>Notifications</h2>
        <span className="nav-spacer" />
      </div>

      <div className="screen-scroll">
        <div className="notif-list">
          {notifications.map((notif, i) => (
            <div key={i} className="notif-item">
              <div className="notif-icon">{notif.icon}</div>
              <div className="notif-content">
                <p className="notif-text">{notif.text}</p>
                <p className="notif-time">{notif.time}</p>
              </div>
              {notif.unread && <div className="notif-dot" />}
            </div>
          ))}
        </div>
      </div>

      <TabBar active="profile" />
    </div>
  );
}

/* ============================================
   Onboarding Screens
   ============================================ */

function OnboardingWelcome() {
  return (
    <div className="onboarding-screen">
      <div className="onboarding-icon">🌍</div>
      <h2 className="onboarding-title">
        OVER<span>WORLD</span>
      </h2>
      <p className="onboarding-subtitle">
        Your personal soundtrack for reality. Every place has its own theme.
      </p>
      <div style={{ height: 12 }} />
      <button className="onboarding-btn primary">Get Started</button>
      <div className="onboarding-dots">
        <div className="onboarding-dot active" />
        <div className="onboarding-dot" />
        <div className="onboarding-dot" />
      </div>
    </div>
  );
}

function OnboardingConnect() {
  return (
    <div className="onboarding-screen">
      <div className="onboarding-icon">🎵</div>
      <h2 className="onboarding-title" style={{ fontSize: 20, letterSpacing: 1 }}>
        Connect Your Music
      </h2>
      <p className="onboarding-subtitle">
        Choose your streaming service to get started
      </p>
      <div style={{ height: 8 }} />
      <button className="onboarding-btn apple">Apple Music</button>
      <button className="onboarding-btn spotify">Spotify</button>
      <p className="onboarding-skip">Skip for now</p>
      <div className="onboarding-dots">
        <div className="onboarding-dot" />
        <div className="onboarding-dot active" />
        <div className="onboarding-dot" />
      </div>
    </div>
  );
}

function OnboardingLocation() {
  return (
    <div className="onboarding-screen">
      <div className="onboarding-icon">📍</div>
      <h2 className="onboarding-title" style={{ fontSize: 20, letterSpacing: 1 }}>
        Enable Location
      </h2>
      <p className="onboarding-subtitle">
        Overworld uses your location to match music to the world around you
      </p>
      <div style={{ height: 8 }} />
      <button className="onboarding-btn primary">Allow Location</button>
      <button className="onboarding-btn outline">Not Now</button>
      <div className="onboarding-dots">
        <div className="onboarding-dot" />
        <div className="onboarding-dot" />
        <div className="onboarding-dot active" />
      </div>
    </div>
  );
}

/* ============================================
   Page
   ============================================ */

export default function MockupsPage() {
  return (
    <div className="mockups-page">
      <header className="mockups-header">
        <h1>
          OVER<span>WORLD</span>
        </h1>
        <p>Mobile App Screens</p>
      </header>

      <div className="mockups-section-label">Core Experience</div>
      <div className="mockups-grid">
        <PhoneFrame label="Now Playing" sublabel="Main screen">
          <NowPlayingScreen />
        </PhoneFrame>
        <PhoneFrame label="Scene Switcher" sublabel="Choose your vibe">
          <SceneSwitcherScreen />
        </PhoneFrame>
        <PhoneFrame label="Grid Map" sublabel="Zone overview">
          <MapViewScreen />
        </PhoneFrame>
        <PhoneFrame label="Community" sublabel="Shared grids">
          <CommunityScreen />
        </PhoneFrame>
      </div>

      <div className="mockups-section-label">User &amp; Content</div>
      <div className="mockups-grid">
        <PhoneFrame label="Profile" sublabel="Your grids">
          <ProfileScreen />
        </PhoneFrame>
        <PhoneFrame label="Grid Editor" sublabel="Create zones">
          <GridEditorScreen />
        </PhoneFrame>
        <PhoneFrame label="Search" sublabel="Discover grids">
          <SearchScreen />
        </PhoneFrame>
        <PhoneFrame label="Notifications" sublabel="Activity feed">
          <NotificationsScreen />
        </PhoneFrame>
      </div>

      <div className="mockups-section-label">Settings &amp; Onboarding</div>
      <div className="mockups-grid">
        <PhoneFrame label="Settings" sublabel="Preferences">
          <SettingsScreen />
        </PhoneFrame>
        <PhoneFrame label="Welcome" sublabel="Onboarding 1/3">
          <OnboardingWelcome />
        </PhoneFrame>
        <PhoneFrame label="Connect Music" sublabel="Onboarding 2/3">
          <OnboardingConnect />
        </PhoneFrame>
        <PhoneFrame label="Location" sublabel="Onboarding 3/3">
          <OnboardingLocation />
        </PhoneFrame>
      </div>
    </div>
  );
}
