// src/pages/Ask.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuery, getSchemaAscii } from '../services/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Card from '../components/Card';
import { useEffect } from 'react';

const EXAMPLES = [
  'Find all customers who placed more than 3 orders',
  'Get the top 5 products by total revenue',
  'List employees who earn more than their manager',
  'Find customers who never placed an order',
  'Calculate the second highest salary from employees',
  'Show monthly revenue trend for the last 12 months',
];

export default function Ask() {
  const navigate = useNavigate();
  const { handleQueryResult, isConnected } = useApp();
  const toast = useToast();

  const [question, setQuestion] = useState('');
  const [loading, setLoading]   = useState(false);
  const [schema, setSchema]     = useState('');
  const [charCount, setCharCount] = useState(0);

  // Load schema preview if connected
  useEffect(() => {
    if (isConnected) {
      getSchemaAscii()
        .then(setSchema)
        .catch(() => {}); // Non-critical
    }
  }, [isConnected]);

  const handleChange = (e) => {
    setQuestion(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async () => {
    const q = question.trim();
    if (!q) { toast.error('Please enter a question.'); return; }

    setLoading(true);
    try {
      const result = await generateQuery(q);
      handleQueryResult(result);
      toast.success('SQL generated successfully!');
      navigate('/results');
    } catch (err) {
      toast.error(err.message || 'Failed to generate SQL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '3rem 1.5rem',
      maxWidth: '800px',
      margin: '0 auto',
      background: `radial-gradient(ellipse 50% 60% at 80% 20%, rgba(124,58,237,0.07) 0%, transparent 60%)`,
    }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.78rem', color: '#8892aa', marginBottom: '0.75rem',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          padding: '0.3rem 0.8rem', borderRadius: '999px',
        }}>
          {isConnected ? '● Connected' : '○ No DB connected'}
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Ask Your Question
        </h1>
        <p style={{ color: '#8892aa', fontSize: '0.9rem' }}>
          Describe what you need in plain English. Press <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: '0.8rem' }}>Ctrl+Enter</kbd> to generate.
        </p>
      </div>

      {/* Main input card */}
      <Card accent="purple" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Find all customers who placed more than 3 orders in 2024 and live in New York..."
            rows={6}
            style={{
              width: '100%',
              background: '#0c0e1a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1rem',
              color: '#eef0f8',
              fontFamily: "'Sora', sans-serif",
              fontSize: '0.95rem',
              lineHeight: 1.65,
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
              minHeight: '140px',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
            onBlur={(e)  => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <div style={{
            position: 'absolute', bottom: '0.75rem', right: '0.85rem',
            fontSize: '0.75rem', color: charCount > 400 ? '#f59e0b' : '#4f566b',
          }}>
            {charCount}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSubmit}
            disabled={!question.trim()}
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Generating SQL...' : '✨ Generate SQL'}
          </Button>
        </div>
      </Card>

      {/* Example chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.78rem', color: '#4f566b', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Try an example
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuestion(ex); setCharCount(ex.length); }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#8892aa',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Sora', sans-serif",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.4)'; e.target.style.color = '#c4b5fd'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = '#8892aa'; }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Schema preview */}
      {schema && (
        <Card accent="cyan" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.78rem', color: '#8892aa', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            📋 Current Schema
          </p>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.78rem',
            color: '#8892aa',
            whiteSpace: 'pre',
            overflowX: 'auto',
            maxHeight: '220px',
            overflowY: 'auto',
            lineHeight: 1.6,
          }}>
            {schema}
          </pre>
        </Card>
      )}
    </div>
  );
}
