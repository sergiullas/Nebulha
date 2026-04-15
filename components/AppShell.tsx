'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type AppShellProps = {
  children: ReactNode;
  currentPath?: string;
};

const navItems = [
  { href: '/', label: 'Services' },
];

export function AppShell({ children, currentPath }: AppShellProps) {
  const pathname = usePathname();
  const activePath = pathname ?? currentPath ?? '/';

  return (
    <div className="portal-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">IDP Operations Portal</div>
          <nav className="nav-list" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link className={`nav-link ${activePath === item.href ? 'active' : ''}`} key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-account-meta">
          <span className="sidebar-account-name">Devin</span>
          <span className="sidebar-account-role">Application Engineer</span>
        </div>
      </aside>

      <div className="screen-shell">
        <main className="screen-content">{children}</main>
      </div>
    </div>
  );
}
