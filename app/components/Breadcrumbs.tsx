// app/components/Breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string; // 👈 opcional para o último item
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="hover:text-emerald-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400 transition-transform" />
          )}
        </div>
      ))}
    </nav>
  );
}
