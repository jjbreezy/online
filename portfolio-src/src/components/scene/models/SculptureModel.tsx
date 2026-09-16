import React from 'react';

interface SculptureModelProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export const SculptureModel: React.FC<SculptureModelProps> = ({
  primaryColor = '#e8f0f2',
  secondaryColor = '#c4dbe0',
}) => {
  return (
    <group rotation={[0.4, 0.2, 0.3]} scale={[1.1, 1.1, 1.1]}>
      {/* Outer Torus Knot Glass Curve */}
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.7, 0.22, 128, 32, 2, 3]} />
        <meshPhysicalMaterial
          color={primaryColor}
          transmission={0.88}
          roughness={0.18}
          ior={1.52}
          thickness={1.4}
          clearcoat={0.3}
          attenuationColor={secondaryColor}
          attenuationDistance={1.2}
        />
      </mesh>

      {/* Internal Light Prism Seed */}
      <mesh>
        <octahedronGeometry args={[0.25, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          roughness={0.05}
          ior={2.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};
