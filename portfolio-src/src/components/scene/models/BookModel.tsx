import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface BookModelProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export const BookModel: React.FC<BookModelProps> = ({
  primaryColor = '#d6cfc4',
  secondaryColor = '#fcfbf7',
  accentColor = '#1a1918',
  isActive = false,
}) => {
  const coverMeshRef = useRef<THREE.Group>(null);
  const openAngleRef = useRef<number>(0);

  // Smoothly open the cover slightly when active
  useFrame((_, delta) => {
    const targetAngle = isActive ? 0.35 : 0;
    openAngleRef.current = THREE.MathUtils.damp(openAngleRef.current, targetAngle, 4, delta);
    if (coverMeshRef.current) {
      coverMeshRef.current.rotation.z = openAngleRef.current;
    }
  });

  return (
    <group rotation={[0.4, -0.35, 0.15]}>
      {/* Back Cover */}
      <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.04, 2.5]} />
        <meshPhysicalMaterial
          color={primaryColor}
          roughness={0.85}
          metalness={0.05}
          clearcoat={0.1}
        />
      </mesh>

      {/* Spine */}
      <mesh position={[-0.93, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.2, 2.5]} />
        <meshPhysicalMaterial
          color={primaryColor}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Pages Block */}
      <mesh position={[0.02, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.16, 2.44]} />
        <meshStandardMaterial
          color={secondaryColor}
          roughness={0.95}
        />
      </mesh>

      {/* Foil Embossed Front Cover (Articulates open on active) */}
      <group position={[-0.93, 0.08, 0]} ref={coverMeshRef}>
        <mesh position={[0.93, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.04, 2.5]} />
          <meshPhysicalMaterial
            color={primaryColor}
            roughness={0.8}
            metalness={0.05}
            clearcoat={0.2}
          />
        </mesh>

        {/* Embossed Artwork Plate on Cover */}
        <mesh position={[0.95, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[1.3, 1.7]} />
          <meshPhysicalMaterial
            color={accentColor}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* Minimalist Spine Text Accent */}
        <mesh position={[0.95, 0.023, 0.95]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 0.08]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      </group>
    </group>
  );
};
