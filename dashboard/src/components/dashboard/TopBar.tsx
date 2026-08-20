// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — TopBar Component
// ═══════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { user } = useData();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const displayName = user?.name || 'Recruiter';

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/dashboard/candidates?search=${encodeURIComponent(query)}` : '/dashboard/candidates');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {onToggleSidebar && (
          <button className="topbar-menu-toggle" onClick={onToggleSidebar} title="Toggle Menu">
            <Menu size={20} />
          </button>
        )}
        <form className="topbar-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="search"
            placeholder="Search candidates, skills, jobs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search candidates, skills, and jobs"
          />
        </form>
      </div>

      <div className="topbar-right">
        <Link href="/dashboard/settings" className="topbar-avatar">
          {displayName.charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
};
