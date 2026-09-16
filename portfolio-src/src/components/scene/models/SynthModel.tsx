import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SynthModelProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export const SynthModel: React.FC<SynthModelProps> = ({
  primaryColor = '#8a5d3b', // walnut sides
  secondaryColor = '#ded8cc', // cream faceplate
  accentColor = '#d95d39', // led / accent
  isActive = false,
}) => {
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshBasicMaterial;
      if (isActive) {
        mat.color.setRGB(
          0.85 + Math.sin(state.clock.elapsedTime * 4) * 0.15,
          0.36,
          0.22
        );
      } else {
        mat.color.setRGB(0.5, 0.2, 0.1);
      }
    }
  });

  return (
    <group rotation={[0.45, -0.3, 0.1]}>
      {/* Main Metal Wedge Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.28, 1.3]} />
        <meshPhysicalMaterial
          color={secondaryColor}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* Left Walnut Cheek */}
      <mesh position={[-1.14, 0.04, 0]} castShadow>
        <boxGeometry args={[0.08, 0.36, 1.34]} />
        <meshStandardMaterial color={primaryColor} roughness={0.7} />
      </mesh>

      {/* Right Walnut Cheek */}
      <mesh position={[1.14, 0.04, 0]} castShadow>
        <boxGeometry args={[0.08, 0.36, 1.34]} />
        <meshStandardMaterial color={primaryColor} roughness={0.7} />
      </mesh>

      {/* Tilted Control Panel Section */}
      <mesh position={[0, 0.16, -0.2]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[2.14, 0.06, 0.75]} />
        <meshPhysicalMaterial
          color="#222120"
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>

      {/* Control Knobs (Array of cylindrical dials) */}
      {[-0.8, -0.5, -0.2, 0.1, 0.4, 0.7].map((x, i) => (
        <group key={`knob-${i}`} position={[x, 0.23, -0.2]} rotation={[-0.15, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#ded8cc" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Knob pointer line */}
          <mesh position={[0, 0.041, 0.02]}>
            <boxGeometry args={[0.01, 0.005, 0.04]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
        </group>
      ))}

      {/* Pulsing Status LED */}
      <mesh position={[0.95, 0.23, -0.45]} ref={ledRef}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Keyboard Bed */}
      <group position={[0, 0.1, 0.35]}>
        {/* White Keys */}
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={`white-key-${i}`} position={[-0.95 + i * 0.145, 0, 0]} castShadow>
            <boxGeometry args={[0.13, 0.06, 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        ))}

        {/* Black Keys */}
        {[0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((idx) => (
          <mesh
            key={`black-key-${idx}`}
            position={[-0.88 + idx * 0.145, 0.04, -0.09]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.08, 0.3]} />
            <meshStandardMaterial color="#111111" roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
