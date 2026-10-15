'use client'; // Error boundaries must be client components.

// Replaces the root layout when it fails, so globals.css and the font may be missing: inline styles only.
const COLORS = {
  navy: '#12261F',
  page: '#F5F1E8',
  card: '#FBF9F4',
  border: '#E4DCCB',
  text: '#12261F',
  body: '#4C5A54',
  marigold: '#E2892B',
};

const styles = {
  body: {
    margin: 0,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    background: COLORS.page,
    color: COLORS.text,
    fontFamily: "Figtree, 'Segoe UI', ui-sans-serif, system-ui, sans-serif",
  },
  card: {
    maxWidth: 440,
    width: '100%',
    boxSizing: 'border-box',
    padding: 32,
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 26,
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontFamily: "'Young Serif', Georgia, serif",
    fontSize: 32,
    lineHeight: 1.1,
    fontWeight: 400,
  },
  text: { margin: '12px 0 24px', fontSize: 15, lineHeight: '24px', color: COLORS.body },
  button: {
    height: 48,
    padding: '0 24px',
    border: 0,
    borderRadius: 999,
    background: COLORS.marigold,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  link: { display: 'block', marginTop: 16, color: '#A2481A', fontSize: 14, fontWeight: 700 },
};

export default function GlobalError({ retry }) {
  return (
    <html lang="en-IN">
      <body style={styles.body}>
        <title>Something went wrong</title>
        <main style={styles.card}>
          <h1 style={styles.title}>Something went wrong</h1>
          <p style={styles.text}>We couldn’t load the site right now. Please try again in a moment.</p>
          <button type="button" style={styles.button} onClick={() => retry()}>
            Try again
          </button>
          {/* A full page load on purpose: the app shell itself failed. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={styles.link}>
            Go to home
          </a>
        </main>
      </body>
    </html>
  );
}
