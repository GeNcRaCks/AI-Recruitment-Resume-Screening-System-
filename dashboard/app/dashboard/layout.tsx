'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
