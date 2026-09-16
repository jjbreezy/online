import React from 'react';
import { ProjectItem } from '../../data/projects';

interface TitleTickerProps {
  projects: ProjectItem[];
  activeIndex: number;
  onSelectProject: (index: number) => void;
}

export const TitleTicker: React.FC<TitleTickerProps> = ({
  projects,
  activeIndex,
  onSelectProject,
}) => {
  return (
    <aside className="left-column" aria-label="Project Index Navigation">
      <div className="ticker-wrapper">
        <div className="ticker-section-label">Index & Archive</div>
        {projects.map((project, idx) => {
          const isActive = idx === activeIndex;
          const isUpcoming = idx > activeIndex;
          const isPrevious = idx < activeIndex;

          let stateClass = '';
          if (isActive) stateClass = 'active';
          else if (isUpcoming) stateClass = 'upcoming';
          else if (isPrevious) stateClass = 'previous';

          return (
            <button
              key={project.id}
              className={`ticker-item ${stateClass}`}
              onClick={() => onSelectProject(idx)}
              aria-label={`Jump to ${project.title}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="ticker-indicator" />
              <div className="ticker-text-block">
                <span className="ticker-title">{project.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
