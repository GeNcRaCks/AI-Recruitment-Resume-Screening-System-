'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      background: 'var(--color-bg, #0b0f19)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#fff',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
      }}>
        <Sparkles size={32} color="#ffffff" />
      </div>

      <div style={{
        fontSize: '5rem',
        fontWeight: '800',
        lineHeight: 1,
        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '16px'
      }}>
        404
      </div>

      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '12px', color: '#f3f4f6' }}>
        Page Not Found
      </h1>

      <p style={{ maxWidth: '460px', color: '#9ca3af', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#fff',
          fontWeight: '600',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}>
          <Home size={18} /> Return Home
        </Link>
        <Link href="/dashboard" className="btn btn-secondary" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          color: '#e5e7eb',
          fontWeight: '600',
          textDecoration: 'none',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <ArrowLeft size={18} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
