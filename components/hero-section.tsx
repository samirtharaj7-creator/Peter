/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation is intentional for the static Pages export. */

import {
  ArrowRight,
  BookOpen,
  BookOpenCheck
} from "lucide-react";

const studyActions = [
  {
    title: "Introduction",
    href: "/background/",
    description: "Explore Peter's life and ministry, the churches of Asia Minor, the pressures they faced, and the setting of both letters.",
    icon: BookOpenCheck
  },
  {
    title: "1 Peter",
    href: "/1-peter/1/",
    description: "Read the five-chapter study of living hope, holy conduct, submission, suffering, and shepherding.",
    icon: BookOpen
  },
  {
    title: "2 Peter",
    href: "/2-peter/1/",
    description: "Read the three-chapter study of growth in grace, prophetic certainty, false teachers, and the day of the Lord.",
    icon: BookOpen
  }
] as const;

const bookPlans = [
  {
    id: "1-peter",
    slug: "1-peter",
    eyebrow: "First Letter · Five Chapters",
    title: "1 Peter",
    chapterCount: 5
  },
  {
    id: "2-peter",
    slug: "2-peter",
    eyebrow: "Second Letter · Three Chapters",
    title: "2 Peter",
    chapterCount: 3
  }
] as const;

export function HeroSection() {
  return (
    <section className="home-showcase">
      <div className="home-showcase-shell">
        <section className="home-showcase-hero" aria-labelledby="home-title">
          <div className="home-showcase-copy">
            <p className="home-title-prefix">The Epistles of</p>
            <h1 id="home-title">Peter</h1>
            <p className="home-showcase-description">
              {"Enter Peter's letters to scattered believers, where living hope, holy conduct, and Christlike endurance meet suffering, and the sure word of prophecy guards the church against error until the day of the Lord."}
            </p>
            <div className="home-showcase-actions">
              <a href="/1-peter/1/" className="home-showcase-primary">
                Explore 1 Peter
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/2-peter/1/" className="home-showcase-secondary">
                Explore 2 Peter
              </a>
              <a href="/background/" className="home-showcase-secondary">
                Read the Introduction
              </a>
            </div>
          </div>
        </section>

        <section className="home-action-grid" aria-label="Primary study paths">
          {studyActions.map((action) => {
            const Icon = action.icon;
            return (
              <a key={action.href} href={action.href} className="home-action-card">
                <span className="home-action-icon">
                  <Icon className="h-5 w-5" />
                </span>
                <strong>{action.title}</strong>
                <span>{action.description}</span>
                <em>
                  Open
                  <ArrowRight className="h-4 w-4" />
                </em>
              </a>
            );
          })}
        </section>

        <section className="home-chapter-study" aria-labelledby="home-chapter-title">
          <div className="home-section-split">
            <div>
              <p className="home-section-kicker">Two-Book Study</p>
              <h2 id="home-chapter-title">{"Choose a letter and follow Peter's call to hope and holiness."}</h2>
            </div>
            <p id="content-status">
              The complete 8-chapter reader places Scripture on the left and verse-by-verse
              exposition, historical context, and selected word studies on the right.
            </p>
          </div>

          <div className="home-chapter-group-grid">
            {bookPlans.map((book) => (
              <article key={book.id} id={book.id} className="home-chapter-group">
                <BookOpen className="home-chapter-group-icon h-6 w-6" />
                <p>{book.eyebrow}</p>
                <h3>{book.title}</h3>
                <div className="home-chapter-mini-grid">
                  {Array.from({ length: book.chapterCount }, (_, index) => index + 1).map((chapterNumber) => (
                    <a key={chapterNumber} href={`/${book.slug}/${chapterNumber}/`} aria-label={`${book.title} chapter ${chapterNumber}`}>
                      <span>{book.title}</span>
                      <strong>Chapter {chapterNumber}</strong>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
