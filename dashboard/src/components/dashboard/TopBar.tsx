// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — TopBar Component
// ═══════════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import Link from 'next/link';

export const TopBar: React.FC = () => {
  const { user } = useData();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search candidates, skills, jobs..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Help & Documentation">
          <HelpCircle size={18} />
        </button>

        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <Link href="/dashboard/settings" className="topbar-avatar">
          {user.name.charAt(0)}
        </Link>
      </div>
    </header>
  );
};
