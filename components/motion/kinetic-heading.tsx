'use client';

import { Fragment, useEffect, useRef, useState, createElement } from 'react';

/**
 * Headlines arrive — they never fade. Each line rises from a clipped wrapper
 * with a stagger when the heading enters view.
 *
 * `flow`: the authored lines run together, so the title sits on one line when it fits
 * (`text-balance` splits it evenly when it doesn't), and the headline rises as one block.
 */
export function KineticHeading({
  lines,
  as = 'h2',
  className = '',
  lineClassName = '',
  stagger = 0.06,
  flickerWords = [],
  flow = false,
}: {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  lineClassName?: string;
  stagger?: number;
  flickerWords?: string[];
  flow?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const renderedLines = lines.map((line, i) => (
    <Fragment key={i}>
      <span className="kinetic-line-wrap">
        <span
          className={`kinetic-line ${play ? 'play' : ''} ${lineClassName}`}
          style={{ animationDelay: `${i * stagger}s` }}
        >
          {line.split(' ').map((word, w) => {
            const isAccent = flickerWords.includes(word.replace(/[^A-Za-z]/g, ''));
            return (
              <span
                key={w}
                className={isAccent ? 'text-extrude' : undefined}
                style={isAccent ? { color: 'var(--provela-blue)' } : undefined}
              >
                {word}
                {w < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </span>
      </span>
      {/* joins lines when they flow inline; collapses between block lines */}
      {flow && i < lines.length - 1 ? ' ' : null}
    </Fragment>
  ));

  return createElement(
    as,
    { ref, className },
    flow ? (
      <span className="kinetic-flow-clip">
        <span className={`kinetic-flow-inner ${play ? 'play' : ''}`}>{renderedLines}</span>
      </span>
    ) : (
      renderedLines
    ),
  );
}
