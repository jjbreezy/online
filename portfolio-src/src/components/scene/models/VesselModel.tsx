import React from 'react';

interface VesselModelProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export const VesselModel: React.FC<VesselModelProps> = ({
  primaryColor = '#c9bfb1', // stoneware clay
  secondaryColor = '#6e6255', // ash glaze burn
}) => {
  return (
    <group rotation={[0.2, 0.4, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Honed Architectural Sandstone Plinth */}
      <mesh position={[0, -0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, 1.5]} />
        <meshStandardMaterial
          color="#beb6ab"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* Ceramic Stoneware Vase (Layered Lathe/Cylinder Profile) */}
      <group position={[0, -0.15, 0]}>
        {/* Foot Rim */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.1, 32]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.95} />
        </mesh>

        {/* Lower Belly */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.22, 0.35, 32]} />
          <meshStandardMaterial color={primaryColor} roughness={0.9} />
        </mesh>

        {/* Upper Shoulder */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.48, 0.25, 32]} />
          <meshStandardMaterial color={primaryColor} roughness={0.88} />
        </mesh>

        {/* Slender Neck */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.25, 32]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.9} />
        </mesh>

        {/* Flared Mouth Lip */}
        <mesh position={[0, 0.56, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.06, 32]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
};
