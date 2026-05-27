import type { QuestionSummary } from "../types";
import { QuestionCard } from "./QuestionCard";

export function QuestionGrid({ questions }: { questions: QuestionSummary[] }) {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-zinc-950">尚未加入題目</h2>
        <p className="mt-2 text-sm text-zinc-600">
          將 Markdown 題目放到{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5">content/questions/&lt;category&gt;/</code>{" "}
          後，這裡會自動顯示卡片。
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="題目列表">
      {questions.map((question) => (
        <QuestionCard key={`${question.categorySlug}/${question.slug}`} question={question} />
      ))}
    </section>
  );
}
