// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — Sidebar Navigation Component
// ═══════════════════════════════════════════════════════════════

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  UploadCloud, 
  BarChart3, 
  Settings, 
  Sparkles, 
  LogOut,
  X
} from 'lucide-react';
import { useData } from '@/lib/DataContext';

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const { user } = useData();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { label: 'Candidates', href: '/dashboard/candidates', icon: Users },
    { label: 'Bulk Upload', href: '/dashboard/jobs/job-1', icon: UploadCloud },
    { label: 'Reports', href: '/dashboard/jobs/job-1/export', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Sparkles size={20} />
        </div>
        <span className="sidebar-brand">RecruitPro AI</span>
        
        {/* Mobile close button */}
        {setIsOpen && (
          <button 
            className="sidebar-close-btn" 
            onClick={() => setIsOpen(false)}
            title="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-item-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.company}</div>
          </div>
          <Link href="/login" style={{ marginLeft: 'auto', color: 'var(--sidebar-text)' }} title="Logout">
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
};
