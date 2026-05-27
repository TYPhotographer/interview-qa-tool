import Link from "next/link";
import { notFound } from "next/navigation";
import { markdownToHtml } from "@/src/features/questions/lib/markdown";
import { getQuestion, getQuestionStaticParams } from "@/src/features/questions/lib/questions";

type QuestionPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

const levelLabel = {
  basic: "基礎",
  mid: "進階",
  senior: "資深",
} as const;

export async function generateStaticParams() {
  return getQuestionStaticParams();
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { category, slug } = await params;
  const question = await getQuestion(category, slug);

  if (!question) {
    notFound();
  }

  const contentHtml = await markdownToHtml(question.content);

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <article className="mx-auto max-w-3xl">
        <Link href={`/?category=${question.categorySlug}`} className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
          ← 回到 {question.category}
        </Link>

        <header className="mt-8 border-b border-zinc-200 pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <span>{question.category}</span>
            <span aria-hidden="true">/</span>
            <span>{question.topic}</span>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-700">{levelLabel[question.level]}</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{question.title}</h1>
          {question.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-600 ring-1 ring-zinc-200">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <div className="qa-prose mt-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </main>
  );
}
