// app/components/Breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type Crumb = {
  label: string;
  href?: string; // opcional para o último item
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm text-gray-500 mb-6"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-emerald-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-gray-700 font-medium"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
