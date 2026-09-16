import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { ProjectItem } from '../../data/projects';
import { StackItem } from './StackItem';

interface StackManagerProps {
  projects: ProjectItem[];
  progressRef: React.MutableRefObject<number>;
  userRotationRef: React.MutableRefObject<{ x: number; y: number }>;
  isDraggingRef: React.MutableRefObject<boolean>;
}

export const StackManager: React.FC<StackManagerProps> = ({
  projects,
  progressRef,
  userRotationRef,
  isDraggingRef,
}) => {
  const { gl } = useThree();
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 360-Degree Object Pointer Drag Interaction
  useEffect(() => {
    const domElement = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore if click originated on HTML overlay elements
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.columns-container')) return;

      isDraggingRef.current = true;
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastPointerPos.current.x;
      const deltaY = e.clientY - lastPointerPos.current.y;
      lastPointerPos.current = { x: e.clientX, y: e.clientY };

      // Update yaw and pitch
      userRotationRef.current.y += deltaX * 0.012;
      userRotationRef.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, userRotationRef.current.x + deltaY * 0.012)
      );
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, userRotationRef, isDraggingRef]);

  // Stack is shifted slightly to the left (x: -1.25) so it lives at ~40% screen width,
  // making room for the wider right detail pane and balancing with the left title list.
  return (
    <group position={[-1.25, 0, 0]}>
      {projects.map((project, index) => (
        <StackItem
          key={project.id}
          project={project}
          index={index}
          progressRef={progressRef}
          userRotationRef={userRotationRef}
          isDraggingRef={isDraggingRef}
        />
      ))}
    </group>
  );
};
