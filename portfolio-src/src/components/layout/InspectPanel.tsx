import React, { useState } from 'react';
import { ProjectItem } from '../../data/projects';
import { ExternalLink, Play, Sparkles } from 'lucide-react';

interface InspectPanelProps {
  project: ProjectItem;
}

export const InspectPanel: React.FC<InspectPanelProps> = ({ project }) => {
  const [isPlayingMedia, setIsPlayingMedia] = useState(false);

  return (
    <aside className="right-column" aria-label="Project Details and Specifications">
      <div className="inspect-card" key={project.id}>
        {/* Meta Header */}
        <div className="inspect-header-meta">
          <div className="inspect-tag-list">
            <span className="inspect-tag">{project.discipline}</span>
            <span className="inspect-tag">{project.location}</span>
          </div>
          <span className="inspect-year">{project.year}</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="inspect-title">{project.title}</h1>
          <p className="inspect-subtitle">{project.subtitle}</p>
        </div>

        {/* Embedded Media Container */}
        <div className="embedded-media-wrapper">
          <img
            src={project.media.url}
            alt={project.title}
            className="embedded-media-content"
            loading="lazy"
          />
          <div className="media-interactive-badge">
            <Sparkles size={13} color="#d95d39" />
            <span>Curatorial Archive Preview</span>
          </div>
        </div>

        {/* Curatorial Description */}
        <p className="inspect-description">
          {project.description}
        </p>

        {/* Key Inspect Specifications Grid */}
        <div className="inspect-specs-grid">
          {project.specs.map((spec, i) => (
            <div key={i} className="spec-item">
              <span className="spec-label">{spec.label}</span>
              <span className="spec-value">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Primary Action Button */}
        <a
          href={project.caseStudyUrl}
          className="cta-button"
          onClick={(e) => {
            // Smooth alert / modal placeholder until specific case study subpages are wired
            if (project.caseStudyUrl.startsWith('#')) {
              e.preventDefault();
              alert(`Navigating to full case study for "${project.title}"`);
            }
          }}
        >
          <span>View Full Case Study</span>
          <ExternalLink size={15} />
        </a>
      </div>
    </aside>
  );
};
