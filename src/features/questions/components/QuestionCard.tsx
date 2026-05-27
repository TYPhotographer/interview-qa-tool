import Link from "next/link";
import type { QuestionSummary } from "../types";

const levelLabel: Record<QuestionSummary["level"], string> = {
  basic: "基礎",
  mid: "進階",
  senior: "資深",
};

export function QuestionCard({ question }: { question: QuestionSummary }) {
  return (
    <Link
      href={question.href}
      className="group block rounded-lg border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span>{question.category}</span>
        <span aria-hidden="true">/</span>
        <span>{question.topic}</span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-700">{levelLabel[question.level]}</span>
      </div>
      <h2 className="text-lg font-semibold leading-snug text-zinc-950 group-hover:underline">{question.title}</h2>
      {question.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-50 px-2 py-1 text-xs text-zinc-600">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
