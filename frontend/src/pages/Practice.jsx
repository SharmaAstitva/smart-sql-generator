// src/pages/Practice.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuery } from '../services/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Card from '../components/Card';
import DifficultySelector from '../components/DifficultySelector';
import ScoreTracker, { recordAttempt, recordSolved } from '../components/ScoreTracker';
import questionBank from '../data/questionBank';

const TOPICS = ['All', 'Joins', 'Aggregation', 'Subqueries', 'Window Functions'];

const topicColors = {
  Joins:            { bg: 'rgba(0,212,255,0.1)',    color: '#00d4ff',   border: 'rgba(0,212,255,0.25)' },
  Aggregation:      { bg: 'rgba(124,58,237,0.1)',   color: '#a78bfa',   border: 'rgba(124,58,237,0.25)' },
  Subqueries:       { bg: 'rgba(245,158,11,0.1)',   color: '#fbbf24',   border: 'rgba(245,158,11,0.25)' },
  'Window Functions':{ bg: 'rgba(248,113,113,0.1)', color: '#f87171',   border: 'rgba(248,113,113,0.25)' },
};

const difficultyConfig = {
  easy:   { color: '#00e5a0', label: 'Easy'  },
  medium: { color: '#f59e0b', label: 'Medium'},
  hard:   { color: '#f87171', label: 'Hard'  },
};

/* Fade-in animation injected once */
const ANIM_STYLE = `
  @keyframes practiceCardIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes practiceShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .practice-card-in {
    animation: practiceCardIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }
`;

export default function Practice() {
  const navigate = useNavigate();
  const { handleQueryResult } = useApp();
  const toast = useToast();

  const [difficulty, setDifficulty] = useState('medium');
  const [topic, setTopic]           = useState('All');
  const [question, setQuestion]     = useState(null);
  const [loadingAI, setLoadingAI]   = useState(false);
  const [statsRefresh, setStatsRefresh] = useState(0); // increment to re-read localStorage

  /** Pick a random question matching difficulty + topic filters */
  const generateQuestion = useCallback(() => {
    const pool = questionBank[difficulty].filter(
      (q) => topic === 'All' || q.topic === topic
    );

    if (pool.length === 0) {
      toast.info(`No ${difficulty} questions for topic "${topic}". Try "All".`);
      return;
    }

    // Avoid repeating the same question twice in a row
    let candidates = question ? pool.filter((q) => q.id !== question.id) : pool;
    if (candidates.length === 0) candidates = pool;

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    setQuestion(picked);

    // Record attempt in localStorage
    recordAttempt(difficulty);
    setStatsRefresh((n) => n + 1);
  }, [difficulty, topic, question, toast]);

  /** Send the current question to the AI and redirect to /results */
  const getAISolution = useCallback(async () => {
    if (!question) return;

    // Build a rich prompt combining the question description + table hint
    const prompt = `${question.title}\n\n${question.description}\n\nSchema hint: ${question.tableHint}`;

    setLoadingAI(true);
    try {
      const result = await generateQuery(prompt);
      handleQueryResult(result);
      recordSolved();
      setStatsRefresh((n) => n + 1);
      toast.success('AI solution ready!');
      navigate('/results');
    } catch (err) {
      toast.error(err.message || 'Failed to get AI solution. Check your backend.');
    } finally {
      setLoadingAI(false);
    }
  }, [question, handleQueryResult, navigate, toast]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '2.5rem 1.5rem',
      maxWidth: '900px',
      margin: '0 auto',
      background: `
        radial-gradient(ellipse 60% 40% at 20% 0%, rgba(124,58,237,0.07) 0%, transparent 55%),
        radial-gradient(ellipse 50% 50% at 80% 80%, rgba(0,212,255,0.05) 0%, transparent 55%)
      `,
    }}>
      <style>{ANIM_STYLE}</style>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.75rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#7c3aed', marginBottom: '0.6rem',
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.2)',
          padding: '0.28rem 0.75rem', borderRadius: '999px',
        }}>
          🎯 Interview Mode
        </div>
        <h1 style={{
          fontSize: '1.9rem', fontWeight: 800,
          letterSpacing: '-0.03em', marginBottom: '0.4rem',
        }}>
          SQL Interview Practice
        </h1>
        <p style={{ color: '#8892aa', fontSize: '0.9rem' }}>
          Pick a difficulty and topic, generate a real interview question, then get the AI-powered solution.
        </p>
      </div>

      {/* ── Two-column layout: controls + tracker ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 280px',
        gap: '1.5rem',
        alignItems: 'start',
      }}>

        {/* LEFT: Controls + question */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Difficulty + Topic selectors */}
          <Card accent="purple" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <DifficultySelector selected={difficulty} onChange={setDifficulty} />

            {/* Topic selector */}
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: '#4f566b', marginBottom: '0.75rem',
              }}>
                Topic
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {TOPICS.map((t) => {
                  const isSelected = topic === t;
                  const tc = t !== 'All' ? topicColors[t] : null;
                  return (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      style={{
                        padding: '0.38rem 0.9rem',
                        borderRadius: '8px',
                        border: `1px solid ${isSelected && tc ? tc.border : isSelected ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        background: isSelected && tc ? tc.bg : isSelected ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
                        color: isSelected && tc ? tc.color : isSelected ? '#00d4ff' : '#8892aa',
                        fontSize: '0.82rem', fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer', transition: 'all 0.18s',
                        fontFamily: "'Sora', sans-serif",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            <Button
              variant="primary"
              onClick={generateQuestion}
              style={{ alignSelf: 'flex-start', padding: '0.7rem 1.6rem' }}
            >
              🎲 Generate Interview Question
            </Button>
          </Card>

          {/* Question display card */}
          {question && (
            <div className="practice-card-in">
              <Card accent="cyan" style={{ padding: '1.75rem' }}>

                {/* Question meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {/* Difficulty badge */}
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    padding: '0.25rem 0.65rem', borderRadius: '999px',
                    color: difficultyConfig[difficulty].color,
                    background: `${difficultyConfig[difficulty].color}18`,
                    border: `1px solid ${difficultyConfig[difficulty].color}40`,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {difficultyConfig[difficulty].label}
                  </span>
                  {/* Topic badge */}
                  {topicColors[question.topic] && (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      padding: '0.25rem 0.65rem', borderRadius: '999px',
                      color: topicColors[question.topic].color,
                      background: topicColors[question.topic].bg,
                      border: `1px solid ${topicColors[question.topic].border}`,
                    }}>
                      {question.topic}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '1.2rem', fontWeight: 700,
                  letterSpacing: '-0.02em', marginBottom: '0.85rem',
                  color: '#eef0f8',
                }}>
                  {question.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '0.93rem', color: '#c5cce0',
                  lineHeight: 1.75, marginBottom: '1.25rem',
                }}>
                  {question.description}
                </p>

                {/* Schema hint box */}
                <div style={{
                  background: '#0a0c16',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.5rem',
                }}>
                  <p style={{ fontSize: '0.72rem', color: '#4f566b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                    Schema Hint
                  </p>
                  <code style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8rem', color: '#8892aa',
                    lineHeight: 1.6,
                  }}>
                    {question.tableHint}
                  </code>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    loading={loadingAI}
                    onClick={getAISolution}
                    style={{ padding: '0.7rem 1.5rem' }}
                  >
                    {loadingAI ? 'Getting Solution...' : '🤖 Get AI Solution'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={generateQuestion}
                    disabled={loadingAI}
                    style={{ padding: '0.7rem 1.25rem' }}
                  >
                    Skip →
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Empty state */}
          {!question && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              color: '#4f566b',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.07)',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: '#8892aa' }}>
                Select a difficulty and topic above
              </p>
              <p style={{ fontSize: '0.82rem' }}>
                then click <strong style={{ color: '#eef0f8' }}>Generate Interview Question</strong>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Score tracker */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <ScoreTracker refreshTrigger={statsRefresh} />

          {/* Tips card */}
          <div style={{
            marginTop: '1rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '1.1rem 1.25rem',
          }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4f566b', marginBottom: '0.75rem' }}>
              💡 Tips
            </p>
            {[
              'Try to write the query yourself first',
              'Think about which JOIN type is needed',
              'Check NULL handling in aggregations',
              'Practice daily to build your streak',
            ].map((tip) => (
              <div key={tip} style={{
                display: 'flex', gap: '0.5rem',
                fontSize: '0.8rem', color: '#8892aa',
                marginBottom: '0.5rem', lineHeight: 1.45,
              }}>
                <span style={{ color: '#4f566b', flexShrink: 0 }}>›</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Responsive: stack on mobile ── */}
      <style>{`
        @media (max-width: 680px) {
          .practice-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
