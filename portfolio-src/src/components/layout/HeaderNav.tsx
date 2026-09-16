import React, { useState } from 'react';

interface HeaderNavProps {
  currentIndex?: number;
  totalCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header id="top-nav">
      <a className="logo" href="../index.html" style={{ textDecoration: 'none', color: 'inherit' }}>
        JJB.
      </a>

      <button
        className={`hamburger ${mobileOpen ? 'open' : ''}`}
        id="hamburgerBtn"
        aria-label="Toggle Navigation"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav id="navMenu" className={mobileOpen ? 'open' : ''}>
        <a className="nav-item" href="../index.html">Home</a>
        <a className="nav-item active" href="index.html">Portfolio</a>
        <a className="nav-item" href="../resume.html" rel="nofollow">Resume</a>
        <a className="nav-item" href="../photography.html">Photography</a>
        <a className="nav-item" href="../nyc.html">NYC</a>
        <a className="nav-item" href="../giftguide/index.html">Gift Guide</a>
        <a
          className="nav-item nav-item-linkedin"
          href="https://www.linkedin.com/in/jordanbroihier/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
          </svg>
        </a>
      </nav>
    </header>
  );
};
