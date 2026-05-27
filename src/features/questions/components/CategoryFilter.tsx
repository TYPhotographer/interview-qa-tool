import Link from "next/link";
import type { Category } from "../types";

type CategoryFilterProps = {
  categories: Category[];
  activeCategory?: string;
};

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="題目分類">
      <Link
        href="/"
        className={`rounded-full border px-3 py-1.5 text-sm transition ${
          !activeCategory
            ? "border-zinc-950 bg-zinc-950 text-white"
            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
        }`}
      >
        全部
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/?category=${category.slug}`}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            activeCategory === category.slug
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
