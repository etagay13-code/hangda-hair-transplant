'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'figure' | 'li' | 'span';
  threshold?: number;
  once?: boolean;
}

export function RevealOnScroll({
  children,
  delay = 0,
  className = '',
  as = 'div',
  threshold = 0.15,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  const Tag = as as 'div';
  return (
    <Tag
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      className={`reveal ${delay ? `reveal-delay-${delay}` : ''} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
