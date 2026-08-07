'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Key, Sparkles, Check } from 'lucide-react';
import { useData } from '@/lib/DataContext';

export default function SettingsPage() {
  const { user } = useData();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'api'>('profile');
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    company: user.company,
  });

  const [toggles, setToggles] = useState({
    emailNotifs: true,
    scoreAlerts: true,
    weeklyDigest: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings & Preferences</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your account settings, notification alerts, and API configuration.
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
            className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
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
                  <div className="settings-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <button className="btn btn-secondary btn-sm">Change Avatar</button>
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    {saved && <span style={{ color: 'var(--color-success)', fontSize: '0.85rem' }}>✓ Changes saved</span>}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <p className="section-desc">Manage how and when you receive candidate updates.</p>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h4>New Candidate Email Alerts</h4>
                    <p>Receive email notifications when new resumes are submitted or uploaded.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${toggles.emailNotifs ? 'active' : ''}`}
                    onClick={() => setToggles({ ...toggles, emailNotifs: !toggles.emailNotifs })}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h4>High-Score Candidate Alerts (&gt;0.8)</h4>
                    <p>Get instant alerts when a candidate scores above 0.8 match score.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${toggles.scoreAlerts ? 'active' : ''}`}
                    onClick={() => setToggles({ ...toggles, scoreAlerts: !toggles.scoreAlerts })}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h4>Weekly Recruitment Summary</h4>
                    <p>Receive a weekly digest email summarizing candidate pipeline statistics.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${toggles.weeklyDigest ? 'active' : ''}`}
                    onClick={() => setToggles({ ...toggles, weeklyDigest: !toggles.weeklyDigest })}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <div className="settings-section">
                <h3>Groq LLM & Backend API Integration</h3>
                <p className="section-desc">Configured for next week's Python FastAPI backend integration.</p>

                <div className="form-group">
                  <label className="form-label">Backend API URL</label>
                  <input type="text" className="form-input" defaultValue="http://localhost:8000/api/v1" readOnly />
                </div>

                <div className="form-group">
                  <label className="form-label">Groq Model Target</label>
                  <input type="text" className="form-input" defaultValue="openai/gpt-oss-120b" readOnly />
                </div>

                <div style={{ padding: '16px', background: 'var(--color-primary-lighter)', color: 'var(--color-primary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Python backend endpoints (`src/api/`) will connect seamlessly next week.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
