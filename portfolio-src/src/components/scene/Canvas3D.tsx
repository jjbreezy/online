import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectItem } from '../../data/projects';
import { StackManager } from './StackManager';

interface Canvas3DProps {
  projects: ProjectItem[];
  progressRef: React.MutableRefObject<number>;
  userRotationRef: React.MutableRefObject<{ x: number; y: number }>;
  isDraggingRef: React.MutableRefObject<boolean>;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({
  projects,
  progressRef,
  userRotationRef,
  isDraggingRef,
}) => {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Studio Lighting */}
        <ambientLight intensity={0.95} color="#fbfaf7" />
        
        {/* Primary Key Light */}
        <directionalLight
          position={[5, 9, 6]}
          intensity={1.8}
          color="#fff8ed"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Soft Fill Light */}
        <directionalLight
          position={[-6, -3, 4]}
          intensity={0.65}
          color="#dce6eb"
        />

        {/* Crisp Rim Light */}
        <directionalLight
          position={[0, 6, -7]}
          intensity={1.1}
          color="#ffffff"
        />

        <StackManager
          projects={projects}
          progressRef={progressRef}
          userRotationRef={userRotationRef}
          isDraggingRef={isDraggingRef}
        />

        {/* Floor Contact Shadows - Baked once at mount (frames=1) for 60-120 FPS performance */}
        <ContactShadows
          frames={1}
          resolution={512}
          position={[-1.25, -3.2, 0]}
          opacity={0.32}
          scale={14}
          blur={2.5}
          far={9}
          color="#1e1c1a"
        />
      </Canvas>
    </div>
  );
};
