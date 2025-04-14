'use client';

import { useEffect } from 'react';

const LAUNCHLIST_SCRIPT_ID = 'launchlist-widget-script';
const LAUNCHLIST_SCRIPT_SRC = 'https://getlaunchlist.com/js/widget.js';

export default function LaunchListWidget() {
  useEffect(() => {
    // Check if the script already exists
    if (document.getElementById(LAUNCHLIST_SCRIPT_ID)) {
      // Optionally, re-initialize if LaunchList provides a function
      // (Assuming no specific function is available based on prior checks)
      // If the script handles multiple widgets correctly, we might not need to do anything.
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.id = LAUNCHLIST_SCRIPT_ID;
    script.src = LAUNCHLIST_SCRIPT_SRC;
    script.defer = true;
    // Append to body. Appending to head might also work.
    document.body.appendChild(script);

    // Basic cleanup: remove the script when the *last* instance unmounts?
    // This is tricky with multiple widgets. For now, let's not remove it
    // as removing it might break other widgets if one unmounts.
    // A more robust solution might involve reference counting.

  }, []); // Run only once per component instance after mount

  return (
    <div className="launchlist-widget" data-key-id="S4M4zl" data-height="180px"></div>
  );
}
