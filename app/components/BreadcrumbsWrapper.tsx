// app/components/BreadcrumbsWrapper.tsx
'use client'; // ⚠️ necessário para hooks

import Breadcrumbs from './Breadcrumbs';
import { usePathname } from 'next/navigation';

export default function BreadcrumbsWrapper() {
  const pathname = usePathname();

  // não mostrar na Home
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  const crumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      const label = seg.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return { label, href };
    }),
  ];

  // último breadcrumb não clicável
  crumbs[crumbs.length - 1].href = undefined;

  return <Breadcrumbs items={crumbs} />;
}
