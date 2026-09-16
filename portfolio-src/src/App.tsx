import React, { useRef } from 'react';
import { PROJECTS } from './data/projects';
import { useContinuousScroll } from './hooks/useContinuousScroll';
import { Canvas3D } from './components/scene/Canvas3D';
import { HeaderNav } from './components/layout/HeaderNav';
import { TitleTicker } from './components/layout/TitleTicker';
import { InspectPanel } from './components/layout/InspectPanel';
import { Orbit } from 'lucide-react';
import './styles/main.css';

export const App: React.FC = () => {
  const userRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);

  const { progressRef, activeIndex, jumpToIndex } = useContinuousScroll({
    totalItems: PROJECTS.length,
    damping: 0.08,
  });

  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];

  return (
    <div className="portfolio-viewport">
      {/* Top Navigation */}
      <HeaderNav
        currentIndex={activeIndex}
        totalCount={PROJECTS.length}
      />

      {/* 3D WebGL Background Scene */}
      <Canvas3D
        projects={PROJECTS}
        progressRef={progressRef}
        userRotationRef={userRotationRef}
        isDraggingRef={isDraggingRef}
      />

      {/* 3-Column 2D UI Overlay */}
      <main className="columns-container">
        {/* Left Column: Synchronized Title Ticker */}
        <TitleTicker
          projects={PROJECTS}
          activeIndex={activeIndex}
          onSelectProject={jumpToIndex}
        />

        {/* Center Column: 360° Interaction Hint */}
        <div className="center-column-overlay">
          <div className="rotation-hint">
            <Orbit size={14} color="#d95d39" />
            <span>Drag to rotate 360° &bull; Scroll to unstack</span>
          </div>
        </div>

        {/* Right Column: Wider Inspect Card with Embedded Media */}
        <InspectPanel project={activeProject} />
      </main>

      {/* Subtle Scroll Progress Indicator */}
      <div className="scroll-progress-track" aria-hidden="true">
        <div
          className="scroll-progress-thumb"
          style={{
            height: `${((activeIndex + 1) / PROJECTS.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
export default App;
