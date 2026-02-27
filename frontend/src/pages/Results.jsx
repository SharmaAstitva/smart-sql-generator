// src/pages/Results.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Card from '../components/Card';

/* ── Syntax-highlighted SQL block ── */
function SqlBlock({ sql }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copy = () => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(true);
      toast.success('SQL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const download = () => {
    const blob = new Blob([sql], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'query.sql';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded query.sql!');
  };

  // Simple keyword colorizer (no external lib)
  const colorized = sql
    .replace(
      /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|AS|AND|OR|NOT|IN|IS|NULL|DISTINCT|COUNT|SUM|AVG|MAX|MIN|WITH|UNION|ALL|INSERT|UPDATE|DELETE|CREATE|TABLE|INDEX|INTO|VALUES|SET|BY)\b/gi,
      (m) => `<span style="color:#c678f5;font-weight:600">${m}</span>`
    )
    .replace(/('[^']*'|"[^"]*")/g, `<span style="color:#98c379">$1</span>`)
    .replace(/\b(\d+)\b/g, `<span style="color:#e5c07b">$1</span>`);

  return (
    <div style={{
      background: '#0a0c16',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.6rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: '0.78rem', color: '#4f566b', fontFamily: "'JetBrains Mono', monospace" }}>
          SQL · MySQL
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={copy} style={{
            background: copied ? 'rgba(0,229,160,0.1)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.1)'}`,
            color: copied ? '#00e5a0' : '#8892aa',
            borderRadius: '6px', padding: '0.28rem 0.7rem',
            fontSize: '0.78rem', cursor: 'pointer',
            fontFamily: "'Sora', sans-serif", transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
          <button onClick={download} style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8892aa', borderRadius: '6px',
            padding: '0.28rem 0.7rem', fontSize: '0.78rem',
            cursor: 'pointer', fontFamily: "'Sora', sans-serif",
            transition: 'all 0.2s',
          }}>
            ↓ Download
          </button>
        </div>
      </div>
      {/* Code */}
      <pre style={{
        padding: '1.25rem 1.5rem',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.88rem',
        lineHeight: 1.75,
        color: '#abb2bf',
        overflowX: 'auto',
        margin: 0,
      }}
        dangerouslySetInnerHTML={{ __html: colorized }}
      />
    </div>
  );
}

/* ── Markdown-like explanation renderer ── */
function Explanation({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div style={{ lineHeight: 1.8, color: '#c5cce0' }}>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} style={{ color: '#00d4ff', fontSize: '1rem', fontWeight: 700, margin: '1.25rem 0 0.5rem', borderBottom: '1px solid rgba(0,212,255,0.15)', paddingBottom: '0.4rem' }}>{line.slice(3)}</h3>;
        }
        if (line.startsWith('- **') || line.startsWith('- ')) {
          const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c4b5fd">$1</strong>').replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.07);padding:1px 5px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.85em;color:#f78166">$1</code>');
          return <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.9rem' }}><span style={{ color: '#4f566b', flexShrink: 0 }}>›</span><span dangerouslySetInnerHTML={{ __html: content }} /></div>;
        }
        if (line.startsWith('```sql')) return null;
        if (line.startsWith('```'))    return null;
        if (line.trim() === '')        return <div key={i} style={{ height: '0.5rem' }} />;

        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c4b5fd">$1</strong>').replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.07);padding:1px 5px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.85em;color:#f78166">$1</code>');
        return <p key={i} style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }} dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
}

/* ── Main Results page ── */
export default function Results() {
  const navigate = useNavigate();
  const { queryResult } = useApp();
  const [activeTab, setActiveTab] = useState('full'); // 'full' | 'sql' | 'schema'

  // If no result, prompt user to go back
  if (!queryResult) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
        <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No result yet</h2>
        <p style={{ color: '#8892aa', marginBottom: '1.5rem' }}>Ask a question first to see results here.</p>
        <Button variant="primary" onClick={() => navigate('/ask')}>Go ask a question</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'full',   label: '📄 Full Answer' },
    { id: 'sql',    label: '💻 SQL Only'    },
    { id: 'schema', label: '🗂 Schema'      },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '2.5rem 1.5rem',
      maxWidth: '860px',
      margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '1.75rem',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            Results
          </h1>
          <p style={{ color: '#8892aa', fontSize: '0.875rem', fontStyle: 'italic' }}>
            "{queryResult.question}"
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/ask')} style={{ flexShrink: 0 }}>
          ← Ask Another
        </Button>
      </div>

      {/* Tab strip */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            border: `1px solid ${activeTab === t.id ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
            background: activeTab === t.id ? 'rgba(0,212,255,0.1)' : 'transparent',
            color: activeTab === t.id ? '#00d4ff' : '#8892aa',
            fontSize: '0.85rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: "'Sora', sans-serif",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Full Answer ── */}
      {activeTab === 'full' && (
        <Card accent="cyan" style={{ padding: '1.75rem' }}>
          <Explanation text={queryResult.full_answer} />
        </Card>
      )}

      {/* ── Tab: SQL Only ── */}
      {activeTab === 'sql' && (
        <div>
          {queryResult.extracted_sql ? (
            <SqlBlock sql={queryResult.extracted_sql} />
          ) : (
            <Card accent="cyan" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#8892aa' }}>No SQL was extracted. Check the Full Answer tab.</p>
            </Card>
          )}
        </div>
      )}

      {/* ── Tab: Schema ── */}
      {activeTab === 'schema' && (
        <Card accent="green" style={{ padding: '1.5rem' }}>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem', color: '#8892aa',
            whiteSpace: 'pre', overflowX: 'auto',
            lineHeight: 1.65, margin: 0,
          }}>
            {queryResult.schema_ascii || 'No schema available.'}
          </pre>
        </Card>
      )}

      {/* Bottom actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Button variant="subtle" onClick={() => navigate('/ask')}>
          ✨ Ask Another Question
        </Button>
        <Button variant="ghost" onClick={() => navigate('/connect')}>
          🗄️ Change Database
        </Button>
      </div>
    </div>
  );
}
