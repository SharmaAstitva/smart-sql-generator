// src/components/DifficultySelector.jsx
import React from 'react';

const difficulties = [
  {
    id: 'easy',
    label: 'Easy',
    color: '#00e5a0',
    dimColor: 'rgba(0,229,160,0.12)',
    glowColor: 'rgba(0,229,160,0.25)',
    borderColor: 'rgba(0,229,160,0.45)',
    icon: '🟢',
    desc: 'JOINs & basic aggregation',
  },
  {
    id: 'medium',
    label: 'Medium',
    color: '#f59e0b',
    dimColor: 'rgba(245,158,11,0.12)',
    glowColor: 'rgba(245,158,11,0.2)',
    borderColor: 'rgba(245,158,11,0.45)',
    icon: '🟡',
    desc: 'Subqueries & window functions',
  },
  {
    id: 'hard',
    label: 'Hard',
    color: '#f87171',
    dimColor: 'rgba(248,113,113,0.12)',
    glowColor: 'rgba(248,113,113,0.2)',
    borderColor: 'rgba(248,113,113,0.45)',
    icon: '🔴',
    desc: 'Complex multi-step queries',
  },
];

export default function DifficultySelector({ selected, onChange }) {
  return (
    <div>
      <p style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#4f566b',
        marginBottom: '0.75rem',
      }}>
        Difficulty
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {difficulties.map((d) => {
          const isSelected = selected === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onChange(d.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                border: `1px solid ${isSelected ? d.borderColor : 'rgba(255,255,255,0.08)'}`,
                background: isSelected ? d.dimColor : 'rgba(255,255,255,0.03)',
                color: isSelected ? d.color : '#8892aa',
                fontFamily: "'Sora', sans-serif",
                fontSize: '0.875rem',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: isSelected ? `0 0 0 3px ${d.glowColor}` : 'none',
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = d.borderColor;
                  e.currentTarget.style.color = d.color;
                  e.currentTarget.style.background = d.dimColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#8892aa';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{d.icon}</span>
              <span>{d.label}</span>
              {isSelected && (
                <span style={{ fontSize: '0.72rem', opacity: 0.7, marginLeft: '2px' }}>
                  · {d.desc}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
