'use client';

import { useState } from 'react';

export default function CopyBlock({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Selection fallback: user can select the text manually.
    }
  }

  return (
    <div className="bg-white rounded-xl border border-poplar-text/5 px-6 py-5">
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss">{label}</p>
        <button
          onClick={copy}
          className="shrink-0 text-sm font-medium bg-poplar-button text-white px-4 py-1.5 rounded-md hover:bg-poplar-button/90 transition-colors"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <p className="text-poplar-text whitespace-pre-wrap leading-relaxed">{value}</p>
      {note && <p className="text-poplar-text/55 text-sm mt-3 leading-relaxed">{note}</p>}
    </div>
  );
}
