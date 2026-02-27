// src/pages/Connect.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectDatabase } from '../services/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Card from '../components/Card';

const inputStyle = {
  width: '100%',
  padding: '0.7rem 1rem',
  background: '#0c0e1a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#eef0f8',
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block', marginBottom: '0.4rem',
        fontSize: '0.82rem', color: '#8892aa', fontWeight: 500,
      }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(0,212,255,0.08)' : 'none',
        }}
        autoComplete="off"
      />
    </div>
  );
}

export default function Connect() {
  const navigate = useNavigate();
  const { handleConnected } = useApp();
  const toast = useToast();

  const [form, setForm] = useState({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'port' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    if (!form.database.trim()) {
      toast.error('Database name is required.');
      return;
    }
    setLoading(true);
    try {
      const result = await connectDatabase(form);
      handleConnected({ database: result.database, tables_found: result.tables_found });
      toast.success(`Connected! Found ${result.tables_found} table(s) in "${result.database}".`);
      setTimeout(() => navigate('/ask'), 600);
    } catch (err) {
      toast.error(err.message || 'Connection failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: `radial-gradient(ellipse 60% 50% at 30% 50%, rgba(0,212,255,0.06) 0%, transparent 60%)`,
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52,
            background: 'rgba(0,212,255,0.1)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 1rem',
          }}>🗄️</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Connect Database
          </h1>
          <p style={{ color: '#8892aa', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Enter your MySQL credentials to extract the schema.
          </p>
        </div>

        <Card accent="cyan" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0 1rem' }}>
            <Field label="Host"     name="host"     value={form.host}     onChange={handleChange} placeholder="localhost" />
            <Field label="Port"     name="port"     type="number" value={form.port} onChange={handleChange} placeholder="3306" />
          </div>
          <Field label="Username"   name="user"     value={form.user}     onChange={handleChange} placeholder="root" />
          <Field label="Password"   name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          <Field label="Database"   name="database" value={form.database} onChange={handleChange} placeholder="my_database" />

          <Button
            variant="primary"
            loading={loading}
            onClick={handleSubmit}
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
          >
            Connect & Extract Schema
          </Button>
        </Card>

        {/* Hint */}
        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#4f566b', fontSize: '0.8rem' }}>
          No MySQL yet?{' '}
          <button
            onClick={() => navigate('/ask')}
            style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontSize: '0.8rem' }}
          >
            Skip → Ask a question directly
          </button>
        </p>
      </div>
    </div>
  );
}
