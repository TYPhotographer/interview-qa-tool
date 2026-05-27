import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { categoryByLabel, categoryBySlug, categories } from "./categories";
import type { QuestionDetail, QuestionLevel, QuestionMeta, QuestionSummary } from "../types";

const questionsDirectory = path.join(process.cwd(), "content", "questions");
const allowedLevels: QuestionLevel[] = ["basic", "mid", "senior"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseQuestionMeta(data: unknown, filePath: string): QuestionMeta {
  if (!isRecord(data)) {
    throw new Error(`Invalid frontmatter in ${filePath}: expected an object.`);
  }

  const { title, category, topic, tags, level, order } = data;

  if (typeof title !== "string" || title.trim() === "") {
    throw new Error(`Invalid frontmatter in ${filePath}: title is required.`);
  }

  if (typeof category !== "string" || !categoryByLabel.has(category)) {
    throw new Error(`Invalid frontmatter in ${filePath}: category must match a fixed category label.`);
  }

  if (typeof topic !== "string" || topic.trim() === "") {
    throw new Error(`Invalid frontmatter in ${filePath}: topic is required.`);
  }

  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`Invalid frontmatter in ${filePath}: tags must be a string array.`);
  }

  if (typeof level !== "string" || !allowedLevels.includes(level as QuestionLevel)) {
    throw new Error(`Invalid frontmatter in ${filePath}: level must be basic, mid, or senior.`);
  }

  if (typeof order !== "number" || !Number.isFinite(order)) {
    throw new Error(`Invalid frontmatter in ${filePath}: order must be a number.`);
  }

  return {
    title,
    category,
    topic,
    tags,
    level: level as QuestionLevel,
    order,
  };
}

async function listMarkdownFiles(): Promise<Array<{ categorySlug: string; slug: string; filePath: string }>> {
  const entries = await fs.readdir(questionsDirectory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  });

  const files: Array<{ categorySlug: string; slug: string; filePath: string }> = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const categorySlug = entry.name;
    if (!categoryBySlug.has(categorySlug)) {
      throw new Error(`Unknown question category folder: ${categorySlug}`);
    }

    const categoryDirectory = path.join(questionsDirectory, categorySlug);
    const categoryEntries = await fs.readdir(categoryDirectory, { withFileTypes: true });

    for (const categoryEntry of categoryEntries) {
      if (!categoryEntry.isFile() || !categoryEntry.name.endsWith(".md")) {
        continue;
      }

      const slug = categoryEntry.name.replace(/\.md$/, "");
      files.push({
        categorySlug,
        slug,
        filePath: path.join(categoryDirectory, categoryEntry.name),
      });
    }
  }

  return files;
}

function sortQuestions(questions: QuestionSummary[]): QuestionSummary[] {
  return questions.sort((a, b) => {
    const categoryOrderA = categoryBySlug.get(a.categorySlug)?.order ?? Number.MAX_SAFE_INTEGER;
    const categoryOrderB = categoryBySlug.get(b.categorySlug)?.order ?? Number.MAX_SAFE_INTEGER;
    return categoryOrderA - categoryOrderB || a.order - b.order || a.title.localeCompare(b.title, "zh-Hant");
  });
}

async function readQuestionFile(file: { categorySlug: string; slug: string; filePath: string }): Promise<QuestionDetail> {
  const raw = await fs.readFile(file.filePath, "utf8");
  const parsed = matter(raw);
  const meta = parseQuestionMeta(parsed.data, file.filePath);
  const category = categoryBySlug.get(file.categorySlug);

  if (!category) {
    throw new Error(`Unknown category for ${file.filePath}`);
  }

  if (meta.category !== category.label) {
    throw new Error(`Category mismatch in ${file.filePath}: expected "${category.label}".`);
  }

  return {
    ...meta,
    slug: file.slug,
    categorySlug: file.categorySlug,
    href: `/questions/${file.categorySlug}/${file.slug}`,
    content: parsed.content,
  };
}

export async function getAllQuestions(): Promise<QuestionSummary[]> {
  const files = await listMarkdownFiles();
  const routeKeys = new Set<string>();
  const questions = await Promise.all(files.map(readQuestionFile));

  for (const question of questions) {
    const key = `${question.categorySlug}/${question.slug}`;
    if (routeKeys.has(key)) {
      throw new Error(`Duplicate question route: ${key}`);
    }
    routeKeys.add(key);
  }

  return sortQuestions(
    questions.map((question) => ({
      title: question.title,
      category: question.category,
      topic: question.topic,
      tags: question.tags,
      level: question.level,
      order: question.order,
      slug: question.slug,
      categorySlug: question.categorySlug,
      href: question.href,
    })),
  );
}

export async function getQuestionsByCategory(categorySlug?: string): Promise<QuestionSummary[]> {
  const questions = await getAllQuestions();

  if (!categorySlug || !categoryBySlug.has(categorySlug)) {
    return questions;
  }

  return questions.filter((question) => question.categorySlug === categorySlug);
}

export async function getQuestion(categorySlug: string, slug: string): Promise<QuestionDetail | null> {
  if (!categoryBySlug.has(categorySlug)) {
    return null;
  }

  const filePath = path.join(questionsDirectory, categorySlug, `${slug}.md`);

  try {
    return await readQuestionFile({ categorySlug, slug, filePath });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function getQuestionStaticParams(): Promise<Array<{ category: string; slug: string }>> {
  const questions = await getAllQuestions();
  return questions.map((question) => ({
    category: question.categorySlug,
    slug: question.slug,
  }));
}

export function getCategoryCount(): number {
  return categories.length;
}
