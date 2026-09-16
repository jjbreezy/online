import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ProjectItem } from '../../data/projects';
import { BookModel } from './models/BookModel';
import { ChairModel } from './models/ChairModel';
import { SynthModel } from './models/SynthModel';
import { CameraModel } from './models/CameraModel';
import { SculptureModel } from './models/SculptureModel';
import { VesselModel } from './models/VesselModel';

interface StackItemProps {
  project: ProjectItem;
  index: number;
  progressRef: React.MutableRefObject<number>;
  userRotationRef: React.MutableRefObject<{ x: number; y: number }>;
  isDraggingRef: React.MutableRefObject<boolean>;
}

const COMPACT_SPACING = 0.55; // Physical thickness between stacked objects
const UNSTACK_GAP = 2.1;      // Zero-gravity separation around active focal object

export const StackItem: React.FC<StackItemProps> = ({
  project,
  index,
  progressRef,
  userRotationRef,
  isDraggingRef,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const progress = progressRef.current;
    const dist = index - progress; // negative = below/past, positive = above/upcoming
    const absDist = Math.abs(dist);

    // Cull items that are outside the camera visible bounds so they never stick or linger
    if (absDist > 2.8) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Smooth C1 unstacking displacement using hyperbolic tangent:
    // - At dist = 0 (center): tanh(0) = 0, exactly centered at Y = 0
    // - For dist > 0: smoothly pushes items above upwards by UNSTACK_GAP
    // - For dist < 0: smoothly pushes items below downwards by -UNSTACK_GAP
    // - Spacing between adjacent non-focal items is strictly COMPACT_SPACING
    const targetY = dist * COMPACT_SPACING + UNSTACK_GAP * Math.tanh(dist * 1.8);
    
    // Active focal forward lift (+Z) via smooth Gaussian bell curve
    const focalInfluence = Math.exp(-3.2 * dist * dist);
    const targetZ = focalInfluence * 0.75;

    // Smooth position interpolation
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      9,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetZ,
      7,
      delta
    );

    // If this is the active item (closest to center)
    const isActive = absDist < 0.45;

    // Apply user 360-degree interactive rotation
    if (rotGroupRef.current) {
      if (isActive) {
        rotGroupRef.current.rotation.y = THREE.MathUtils.damp(
          rotGroupRef.current.rotation.y,
          userRotationRef.current.y,
          10,
          delta
        );
        rotGroupRef.current.rotation.x = THREE.MathUtils.damp(
          rotGroupRef.current.rotation.x,
          userRotationRef.current.x,
          10,
          delta
        );
      } else {
        // Smoothly return to canonical rest rotation when scrolled away
        rotGroupRef.current.rotation.y = THREE.MathUtils.damp(
          rotGroupRef.current.rotation.y,
          0,
          5,
          delta
        );
        rotGroupRef.current.rotation.x = THREE.MathUtils.damp(
          rotGroupRef.current.rotation.x,
          0,
          5,
          delta
        );
      }
    }

    // Scale breathing on focus with subtle edge tapering
    const edgeTaper = Math.min(1, Math.max(0.1, 1 - Math.max(0, absDist - 1.2) * 0.3));
    const targetScale = (1.0 + focalInfluence * 0.12) * edgeTaper;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 7, delta)
    );
  });

  const renderModel = (isActive: boolean) => {
    const { model } = project;
    switch (model.type) {
      case 'book':
        return (
          <BookModel
            primaryColor={model.primaryColor}
            secondaryColor={model.secondaryColor}
            accentColor={model.accentColor}
            isActive={isActive}
          />
        );
      case 'chair':
        return (
          <ChairModel
            primaryColor={model.primaryColor}
            secondaryColor={model.secondaryColor}
            accentColor={model.accentColor}
            isActive={isActive}
          />
        );
      case 'synth':
        return (
          <SynthModel
            primaryColor={model.primaryColor}
            secondaryColor={model.secondaryColor}
            accentColor={model.accentColor}
            isActive={isActive}
          />
        );
      case 'camera':
        return (
          <CameraModel
            primaryColor={model.primaryColor}
            secondaryColor={model.secondaryColor}
            accentColor={model.accentColor}
            isActive={isActive}
          />
        );
      case 'sculpture':
        return (
          <SculptureModel
            primaryColor={model.primaryColor}
            secondaryColor={model.secondaryColor}
            accentColor={model.accentColor}
            isActive={isActive}
          />
        );
      case 'vessel':
        return (
          <VesselModel
            primaryColor={model.primaryColor}
            secondaryColor={model.secondaryColor}
            accentColor={model.accentColor}
            isActive={isActive}
          />
        );
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef} position={[0, index * COMPACT_SPACING, 0]}>
      <group ref={rotGroupRef}>
        {renderModel(false)}
      </group>
    </group>
  );
};
