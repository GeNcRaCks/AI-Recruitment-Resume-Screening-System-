'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Key, Sparkles, Check, Upload, Trash2 } from 'lucide-react';
import { API_BASE, useData } from '@/lib/DataContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useData();
  const [activeTab, setActiveTab] = useState<'profile' | 'api'>('profile');
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('user_avatar');
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company_name || '',
  });

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_avatar', result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData.name, formData.company);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('This will permanently delete your account and all associated job data. This action cannot be undone.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to delete account');
      }
      logout();
      router.push('/login');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings & Preferences</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your account settings and API configuration.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          <div 
            className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Account Profile
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Key size={18} /> API & Integrations
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div>
              <div className="settings-section">
                <h3>Profile Details</h3>
                <p className="section-desc">Update your personal and company information.</p>

                <div className="settings-avatar-section">
                  <div className="settings-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarFileSelect}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} style={{ marginRight: '6px' }} /> Change Avatar
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      disabled
                      title="Email cannot be changed"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleDeleteAccount}
                      style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5' }}
                    >
                      <Trash2 size={14} style={{ marginRight: '6px' }} /> Delete Account
                    </button>
                    {saved && <span style={{ color: 'var(--color-success)', fontSize: '0.85rem' }}>✓ Changes saved</span>}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <div className="settings-section">
                <h3>Groq LLM & Backend API Integration</h3>
                <p className="section-desc">Connected to the active recruitment API and language model services.</p>

                <div className="form-group">
                  <label className="form-label">Backend API URL</label>
                  <input type="text" className="form-input" defaultValue={API_BASE} readOnly />
                </div>

                <div className="form-group">
                  <label className="form-label">Groq Model Target</label>
                  <input type="text" className="form-input" defaultValue="openai/gpt-oss-120b" readOnly />
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
