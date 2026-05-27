import { CategoryFilter } from "@/src/features/questions/components/CategoryFilter";
import { QuestionGrid } from "@/src/features/questions/components/QuestionGrid";
import { categories, getCategoryBySlug } from "@/src/features/questions/lib/categories";
import { getAllQuestions, getQuestionsByCategory } from "@/src/features/questions/lib/questions";

type HomeProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeCategory = params.category && getCategoryBySlug(params.category) ? params.category : undefined;
  const [allQuestions, filteredQuestions] = await Promise.all([
    getAllQuestions(),
    getQuestionsByCategory(activeCategory),
  ]);
  const activeCategoryLabel = activeCategory ? getCategoryBySlug(activeCategory)?.label : "全部分類";

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-500">Interview Q&A Tool</p>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">前端面試題庫</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                用 Markdown 管理題目，透過分類卡片快速閱讀與整理答案。
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
              <span className="font-medium text-zinc-950">{filteredQuestions.length}</span> / {allQuestions.length} 題
              <span className="mx-2 text-zinc-300">|</span>
              {activeCategoryLabel}
            </div>
          </div>
        </header>

        <CategoryFilter categories={categories} activeCategory={activeCategory} />
        <QuestionGrid questions={filteredQuestions} />
      </div>
    </main>
  );
}
