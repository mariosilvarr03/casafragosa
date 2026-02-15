// app/components/BreadcrumbsWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Breadcrumbs, { Crumb } from './Breadcrumbs';

export default function BreadcrumbsWrapper() {
  const pathname = usePathname();

  // Não mostrar na Home
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, idx) => {
      const isLast = idx === segments.length - 1;

      const label = seg
        .replace('-', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        label,
        href: isLast
          ? undefined
          : '/' + segments.slice(0, idx + 1).join('/'),
      };
    }),
  ];

  return <Breadcrumbs items={crumbs} />;
}
