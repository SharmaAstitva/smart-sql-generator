// src/components/ScoreTracker.jsx
import React, { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'sqlPracticeStats';

const defaultStats = {
  total: 0,
  streak: 0,
  lastDate: null,          // ISO date string of last attempt
  byDifficulty: { easy: 0, medium: 0, hard: 0 },
  solved: 0,               // questions where AI solution was fetched
};

/** Load stats from localStorage, merging with defaults for safety */
function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultStats };
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch {
    return { ...defaultStats };
  }
}

/** Save stats to localStorage */
function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage might be full or unavailable — fail silently
  }
}

/** Public helper: call this when user generates a question */
export function recordAttempt(difficulty) {
  const stats = loadStats();
  const today = new Date().toISOString().slice(0, 10);

  stats.total += 1;
  stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;

  // Streak logic: +1 if last attempt was today or yesterday, reset otherwise
  if (!stats.lastDate) {
    stats.streak = 1;
  } else {
    const last = new Date(stats.lastDate);
    const now  = new Date(today);
    const diffDays = Math.round((now - last) / 86400000);
    if (diffDays === 1) {
  stats.streak += 1;     // Consecutive day
} else if (diffDays > 1) {
  stats.streak = 1;      // Gap — reset
}
// If diffDays === 0 → do nothing (no assignment needed)          // Gap — reset
  }

  stats.lastDate = today;
  saveStats(stats);
  return stats;
}

/** Public helper: call this when user gets AI solution */
export function recordSolved() {
  const stats = loadStats();
  stats.solved += 1;
  saveStats(stats);
  return stats;
}

const statBoxStyle = (accent) => ({
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  padding: '0.9rem 1.1rem',
  flex: '1 1 100px',
  minWidth: '90px',
  textAlign: 'center',
  transition: 'border-color 0.2s',
  borderTopColor: accent,
  borderTopWidth: '2px',
});

export default function ScoreTracker({ refreshTrigger }) {
  const [stats, setStats] = useState(loadStats);

  // Re-read from localStorage whenever parent triggers a refresh
  useEffect(() => {
    setStats(loadStats());
  }, [refreshTrigger]);

  const reset = useCallback(() => {
    if (window.confirm('Reset all practice stats?')) {
      localStorage.removeItem(STORAGE_KEY);
      setStats({ ...defaultStats });
    }
  }, []);

  return (
    <div style={{
      background: '#131628',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4f566b' }}>
          Your Progress
        </p>
        <button
          onClick={reset}
          style={{
            background: 'none', border: 'none', color: '#4f566b',
            fontSize: '0.75rem', cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.color = '#f87171'}
          onMouseLeave={(e) => e.target.style.color = '#4f566b'}
        >
          Reset
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <div style={statBoxStyle('#00d4ff')}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00d4ff', letterSpacing: '-0.03em' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#8892aa', marginTop: '2px' }}>Attempted</div>
        </div>

        <div style={statBoxStyle('#f59e0b')}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.03em' }}>
            {stats.streak}🔥
          </div>
          <div style={{ fontSize: '0.72rem', color: '#8892aa', marginTop: '2px' }}>Day Streak</div>
        </div>

        <div style={statBoxStyle('#00e5a0')}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00e5a0', letterSpacing: '-0.03em' }}>
            {stats.solved}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#8892aa', marginTop: '2px' }}>Solved</div>
        </div>
      </div>

      {/* Per-difficulty breakdown */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'easy',   label: 'Easy',   color: '#00e5a0' },
          { key: 'medium', label: 'Medium', color: '#f59e0b' },
          { key: 'hard',   label: 'Hard',   color: '#f87171' },
        ].map(({ key, label, color }) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.78rem', color: '#8892aa',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.3rem 0.7rem', borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ color, fontWeight: 700 }}>{stats.byDifficulty[key] || 0}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
