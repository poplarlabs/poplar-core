'use client';

import { useState } from 'react';

// No script needed here, it's loaded globally via layout.tsx for referral tracking.

type LaunchListWidgetProps = {
  variant?: 'default' | 'cta';
};

export default function LaunchListWidget({ variant = 'default' }: LaunchListWidgetProps) {
  const isCTA = variant === 'cta';
  const [isLoading, setIsLoading] = useState(false);
  // We don't need the handleSubmit function here as LaunchList handles the form submission directly
  // when using the standard action attribute. The loading state can be handled via form events if needed,
  // but for simplicity with direct action, we might omit complex loading indicators tied to JS fetch.

  return (
    <form
      className={`launchlist-form flex flex-col lg:flex-row w-full gap-3 ${isCTA ? 'justify-center' : ''}`}
      action="https://getlaunchlist.com/s/S4M4zl"
      method="POST"
    >
      {/* Twitter Input - Removed responsive max-w constraints */}
      <div className={`w-full`}>
        <label htmlFor="launchlist-twitter" className="sr-only">Twitter Handle</label>
        <input
          id="launchlist-twitter"
          name="twitter" // Make sure this name matches LaunchList expected field if any
          type="text"
          disabled={isLoading} // Reuse loading state if form submission is handled via JS
          placeholder="Twitter Handle"
          className={`w-full h-12 px-4 text-lg rounded-lg ${
            isCTA
              ? 'bg-white border-white text-poplar-text placeholder-poplar-placeholder border'
              : 'bg-white border-gray-200 text-poplar-text placeholder-poplar-placeholder border'
          } disabled:opacity-50`}
        />
      </div>

      {/* Email Input - Removed responsive max-w constraints */}
      <div className={`w-full`}>
        <label htmlFor="launchlist-email" className="sr-only">Email</label>
        <input
          id="launchlist-email"
          name="email"
          type="email"
          required // Email is required by LaunchList
          disabled={isLoading}
          placeholder="Enter your email"
          className={`w-full h-12 px-4 text-lg rounded-lg ${
            isCTA
              ? 'bg-white border-white text-poplar-text placeholder-poplar-placeholder border'
              : 'bg-white border-gray-200 text-poplar-text placeholder-poplar-placeholder border'
          } disabled:opacity-50`}
        />
      </div>

      {/* Submit Button - Changed sm:w-auto to lg:w-auto */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full lg:w-auto h-12 px-8 text-lg font-medium rounded-lg transition-colors whitespace-nowrap ${
          isCTA
            ? 'bg-poplar-button text-white hover:bg-poplar-button/90 shadow-lg hover:shadow-xl'
            : 'bg-poplar-button text-white hover:bg-poplar-button/90'
        } disabled:opacity-50`}
      >
        {isLoading ? 'Joining...' : 'Join Waitlist'}
      </button>
    </form>
  );
}
