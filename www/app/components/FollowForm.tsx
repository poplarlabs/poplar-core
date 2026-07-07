'use client';

import { useState } from 'react';

// Same zero-account backend as the /start form; signups arrive by email.
const ENDPOINT = 'https://formsubmit.co/ajax/tremylous@poplarlabs.xyz';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function FollowForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Following along — new signup',
          _template: 'table',
          signup: 'follow-along',
          email,
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
      <p className="text-poplar-cream/90 leading-relaxed">
        You&rsquo;re in. We&rsquo;ll write when there&rsquo;s something worth reading.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
        <label htmlFor="follow-email" className="sr-only">Email</label>
        <input
          id="follow-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className="flex-1 h-12 px-4 rounded-lg bg-white text-poplar-text placeholder-poplar-placeholder focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-12 px-6 rounded-lg bg-poplar-button text-white font-medium hover:bg-poplar-button/90 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'sending' ? 'Joining…' : 'Follow along'}
        </button>
      </form>
      {status === 'error' && (
        <p role="alert" className="text-poplar-cream/80 text-sm mt-3">
          That didn&rsquo;t send — email{' '}
          <a href="mailto:tremylous@poplarlabs.xyz" className="underline">tremylous@poplarlabs.xyz</a>{' '}
          instead.
        </p>
      )}
    </div>
  );
}
