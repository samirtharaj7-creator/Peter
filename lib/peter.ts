import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ChapterContentSchema, type ChapterContent } from "@/lib/schemas";
import { padChapter } from "@/lib/utils";

export const PETER_BOOKS = {
  "1-peter": {
    slug: "1-peter",
    name: "1 Peter",
    chapterCount: 5,
    verseCounts: [25, 25, 22, 19, 14]
  },
  "2-peter": {
    slug: "2-peter",
    name: "2 Peter",
    chapterCount: 3,
    verseCounts: [21, 22, 18]
  }
} as const;

export type PeterBookSlug = keyof typeof PETER_BOOKS;
export type PeterBookConfig = (typeof PETER_BOOKS)[PeterBookSlug];

export type ChapterAdjacency = {
  previous: number | null;
  next: number | null;
};

const contentRoot = join(process.cwd(), "content");

export function getPeterBookConfig(bookSlug: PeterBookSlug): PeterBookConfig {
  return PETER_BOOKS[bookSlug];
}

export function getPeterStaticParams(bookSlug: PeterBookSlug) {
  const { chapterCount } = getPeterBookConfig(bookSlug);
  return Array.from({ length: chapterCount }, (_, index) => ({ chapter: String(index + 1) }));
}

export function parsePeterChapterNumber(
  bookSlug: PeterBookSlug,
  chapter: number | string
): number | null {
  const rawChapter = String(chapter);
  if (!/^[1-9]\d*$/.test(rawChapter)) return null;

  const chapterNumber = Number(rawChapter);
  const { chapterCount } = getPeterBookConfig(bookSlug);
  if (!Number.isSafeInteger(chapterNumber) || chapterNumber > chapterCount) return null;

  return chapterNumber;
}

export function getPeterChapter(
  bookSlug: PeterBookSlug,
  chapter: number | string
): ChapterContent | null {
  const chapterNumber = parsePeterChapterNumber(bookSlug, chapter);
  if (chapterNumber === null) return null;

  const config = getPeterBookConfig(bookSlug);
  const chapterPath = join(contentRoot, config.slug, `chapter-${padChapter(chapterNumber)}.json`);
  if (!existsSync(chapterPath)) return null;

  const parsed = ChapterContentSchema.parse(JSON.parse(readFileSync(chapterPath, "utf8")));
  const expectedVerseCount = config.verseCounts[chapterNumber - 1];

  if (parsed.chapterNumber !== chapterNumber) {
    throw new Error(
      `${config.name} ${chapterNumber} loaded chapterNumber ${parsed.chapterNumber}.`
    );
  }

  if (parsed.verses.length !== expectedVerseCount) {
    throw new Error(
      `${config.name} ${chapterNumber} has ${parsed.verses.length} verses; expected ${expectedVerseCount}.`
    );
  }

  parsed.verses.forEach((verse, index) => {
    const expectedReference = `${config.name} ${chapterNumber}:${index + 1}`;
    if (verse.verse !== expectedReference) {
      throw new Error(
        `${config.name} ${chapterNumber} contains ${verse.verse}; expected ${expectedReference}.`
      );
    }
  });

  return parsed;
}

export function getPeterChapterAdjacency(
  bookSlug: PeterBookSlug,
  chapter: number | string
): ChapterAdjacency | null {
  const chapterNumber = parsePeterChapterNumber(bookSlug, chapter);
  if (chapterNumber === null) return null;

  const { chapterCount } = getPeterBookConfig(bookSlug);
  return {
    previous: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < chapterCount ? chapterNumber + 1 : null
  };
}
