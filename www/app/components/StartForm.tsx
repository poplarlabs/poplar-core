'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

// FormSubmit delivers submissions to the inbox with no vendor account.
// To move to Tally/Airtable/Typeform later, replace ENDPOINT (or the whole form) —
// everything else on the page stays.
const ENDPOINT = 'https://formsubmit.co/ajax/tremylous@poplarlabs.xyz';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputClass =
  'w-full rounded-lg border border-poplar-text/15 bg-poplar-cream/60 px-4 py-3 text-poplar-text placeholder-poplar-placeholder focus:border-poplar-moss focus:outline-none transition-colors';

function QuestionCard({
  number,
  label,
  hint,
  children,
}: {
  number: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-poplar-text/5 px-6 py-5">
      <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss mb-2" aria-hidden="true">
        {number}
      </p>
      <label className="block">
        <span className="block text-poplar-text font-semibold mb-1">{label}</span>
        <span className="block text-poplar-text/60 text-sm leading-relaxed mb-3">{hint}</span>
        {children}
      </label>
    </div>
  );
}

export default function StartForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data._honey) return;
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Planting a grove — a community wrote in',
          _template: 'table',
          ...data,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-2xl border border-poplar-moss/30 px-8 py-10 text-center">
        <p className="font-display text-2xl text-poplar-text mb-3">Got it.</p>
        <p className="text-poplar-text/80 leading-relaxed">
          We read everything, and we reply to everyone. Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-poplar-text/5 px-6 py-5">
          <label className="block">
            <span className="block text-poplar-text font-semibold mb-3">Your name</span>
            <input name="name" type="text" required autoComplete="name" className={inputClass} />
          </label>
        </div>
        <div className="bg-white rounded-xl border border-poplar-text/5 px-6 py-5">
          <label className="block">
            <span className="block text-poplar-text font-semibold mb-3">Email</span>
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </label>
        </div>
      </div>

      <QuestionCard
        number="01"
        label="Who are you?"
        hint="The short version — what your community is about, in your own words."
      >
        <textarea name="who_you_are" required rows={3} className={inputClass} />
      </QuestionCard>

      <QuestionCard
        number="02"
        label="How did you find each other?"
        hint="A craft, a faith, a hometown, an idea, a corner of the internet — whatever it was."
      >
        <textarea name="how_you_found_each_other" rows={3} className={inputClass} />
      </QuestionCard>

      <QuestionCard
        number="03"
        label="Roughly how many of you are there?"
        hint="A dozen or a thousand — there's no wrong answer, we just want the shape of it."
      >
        <input name="how_many" type="text" className={inputClass} />
      </QuestionCard>

      <QuestionCard
        number="04"
        label="Where would you put down roots?"
        hint="A place you have in mind, or none yet — both are fine."
      >
        <input name="where_youd_put_down_roots" type="text" className={inputClass} />
      </QuestionCard>

      <div className="bg-white rounded-xl border border-poplar-text/5 px-6 py-5">
        <label className="block">
          <span className="block text-poplar-text font-semibold mb-1">Anything else?</span>
          <span className="block text-poplar-text/60 text-sm leading-relaxed mb-3">Optional.</span>
          <textarea name="anything_else" rows={2} className={inputClass} />
        </label>
      </div>

      {/* Honeypot — humans never see it, bots fill it */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center bg-poplar-button text-white text-lg font-medium px-8 py-3 rounded-lg hover:bg-poplar-button/90 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Tell us about your community'}
        {status !== 'sending' && <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />}
      </button>

      {status === 'error' && (
        <p className="text-poplar-button leading-relaxed" role="alert">
          Something went wrong sending this. Your answers are still here — try again in a
          minute, or email them to{' '}
          <a href="mailto:tremylous@poplarlabs.xyz" className="underline">
            tremylous@poplarlabs.xyz
          </a>
          .
        </p>
      )}
    </form>
  );
}
