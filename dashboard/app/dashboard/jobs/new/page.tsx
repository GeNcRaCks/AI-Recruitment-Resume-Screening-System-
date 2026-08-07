'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, X, ArrowLeft } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { allAvailableSkills } from '@/lib/mockData';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();
  const { addJob } = useData();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('San Francisco, CA');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship'>('Full-time');
  const [description, setDescription] = useState('');
  const [detectedSkills, setDetectedSkills] = useState<string[]>(['Python', 'PostgreSQL', 'REST API', 'Docker']);
  const [customSkill, setCustomSkill] = useState('');

  // Extract skills dynamically as user types JD
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    const found = allAvailableSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    if (found.length > 0) {
      setDetectedSkills(Array.from(new Set([...detectedSkills, ...found])));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setDetectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !detectedSkills.includes(customSkill.trim())) {
      setDetectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = (status: 'Active' | 'Draft') => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in Job Title and Description.');
      return;
    }

    const newJob = addJob({
      title,
      department,
      location,
      employmentType,
      description,
      detectedSkills,
      status,
    });

    router.push(`/dashboard/jobs/${newJob.id}`);
  };

  return (
    <div className="job-form-page">
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard/jobs" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Jobs
        </Link>
        <h1 style={{ marginTop: '8px' }}>Create New Job Posting</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Enter job details. Our NLP engine will automatically extract key required skills.
        </p>
      </div>

      <div className="job-form-card">
        <h3>Job Overview</h3>

        <div className="form-group">
          <label className="form-label">Job Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Senior Backend Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Engineering">Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Employment Type</label>
          <select
            className="form-input"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as any)}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      <div className="job-form-card">
        <h3>Job Description & Skill Extraction</h3>

        <div className="form-group">
          <label className="form-label">Paste Job Description *</label>
          <textarea
            className="form-input textarea-large"
            placeholder="Paste complete job description here..."
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </div>

        {/* Detected Skills Chip List (Scene 1 requirement) */}
        <div className="detected-skills-section">
          <div className="detected-skills-label">
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
            Detected Required Skills ({detectedSkills.length}) — Confirm or add/remove before saving:
          </div>

          <div className="detected-skills-list">
            {detectedSkills.map((skill) => (
              <span key={skill} className="skill-chip-removable">
                {skill}
                <span className="remove-skill" onClick={() => removeSkill(skill)}>
                  <X size={12} />
                </span>
              </span>
            ))}
          </div>

          {/* Add custom skill manual input */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', maxWidth: '300px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add skill manually..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={addCustomSkill}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => handleSubmit('Draft')}>
          Save as Draft
        </button>
        <button type="button" className="btn btn-primary" onClick={() => handleSubmit('Active')}>
          Publish & Start Screening
        </button>
      </div>
    </div>
  );
}
