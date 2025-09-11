#!/usr/bin/env node
// Safe no-op postinstall script to avoid failing installs on CI/Netlify

try {
  // Detect common CI/Netlify env vars if you want to conditionally run setup
  const isCI = !!process.env.CI || !!process.env.NETLIFY;
  console.log(`postinstall: noop${isCI ? ' (running in CI)' : ''}`);
  // Add any optional setup logic here if needed in the future
  process.exit(0);
} catch (err) {
  // Log the error but exit successfully to avoid breaking the install on CI
  console.error('postinstall encountered an error, exiting gracefully:', err);
  process.exit(0);
}
