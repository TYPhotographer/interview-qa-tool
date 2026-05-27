export type QuestionLevel = "basic" | "mid" | "senior";

export type Category = {
  slug: string;
  label: string;
  order: number;
};

export type QuestionMeta = {
  title: string;
  category: string;
  topic: string;
  tags: string[];
  level: QuestionLevel;
  order: number;
};

export type QuestionSummary = QuestionMeta & {
  slug: string;
  categorySlug: string;
  href: string;
};

export type QuestionDetail = QuestionSummary & {
  content: string;
};
