import type { Category } from "../types";

export const categories: Category[] = [
  { slug: "html-seo", label: "HTML / 語意化 / SEO", order: 1 },
  { slug: "css-layout", label: "CSS / 版面系統", order: 2 },
  { slug: "javascript-deep-dive", label: "JavaScript 深度", order: 3 },
  { slug: "typescript-react", label: "TypeScript with React", order: 4 },
  { slug: "browser-web-api", label: "瀏覽器 / Web API", order: 5 },
  { slug: "network-http", label: "網路 / HTTP", order: 6 },
  { slug: "react-core", label: "React 核心觀念", order: 7 },
  { slug: "react-hooks", label: "React Hooks 深度", order: 8 },
  { slug: "react-state-server-state", label: "React 狀態管理 / Server State", order: 9 },
  { slug: "react-router-nextjs", label: "React Router / Next.js 生態", order: 10 },
  { slug: "performance", label: "效能優化", order: 11 },
  { slug: "engineering-quality", label: "工程化 / 打包 / 品質", order: 12 },
  { slug: "testing-security-a11y", label: "測試 / 安全 / 無障礙", order: 13 },
  { slug: "architecture-design", label: "架構設計", order: 14 },
  { slug: "system-design-traffic", label: "系統設計 / 中高流量場景", order: 15 },
  { slug: "senior-impact", label: "專案深挖 / 團隊影響力 / 資深面試加分題", order: 16 },
];

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
export const categoryByLabel = new Map(categories.map((category) => [category.label, category]));

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}
