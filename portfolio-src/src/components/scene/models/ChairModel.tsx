import React from 'react';

interface ChairModelProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export const ChairModel: React.FC<ChairModelProps> = ({
  primaryColor = '#1c1b1a', // black wood frame
  secondaryColor = '#c8a87b', // woven cane
  accentColor = '#e0e0e0', // chrome tubing
}) => {
  return (
    <group rotation={[0.3, 0.4, -0.05]} scale={[1.1, 1.1, 1.1]}>
      {/* Tubular Chrome Cantilever Base (Legs & Sled Runners) */}
      {/* Left Runner & Vertical Leg */}
      <mesh position={[-0.5, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Right Runner & Vertical Leg */}
      <mesh position={[0.5, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Sled horizontal floor tubes */}
      <mesh position={[-0.5, -1.0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.5, -1.0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Crossbar under seat */}
      <mesh position={[0, -0.05, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Backrest chrome uprights */}
      <mesh position={[-0.5, 0.45, -0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.5, 0.45, -0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Cantilever Seat (Wooden outer frame + Woven Cane inner surface) */}
      <group position={[0, -0.05, 0.1]}>
        {/* Wood frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.06, 1.0]} />
          <meshStandardMaterial color={primaryColor} roughness={0.6} />
        </mesh>
        {/* Cane Rattan insert */}
        <mesh position={[0, 0.015, 0]} castShadow>
          <boxGeometry args={[0.88, 0.05, 0.82]} />
          <meshPhysicalMaterial
            color={secondaryColor}
            roughness={0.75}
            clearcoat={0.1}
          />
        </mesh>
      </group>

      {/* Cantilever Backrest */}
      <group position={[0, 0.55, -0.2]}>
        {/* Wood frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.65, 0.06]} />
          <meshStandardMaterial color={primaryColor} roughness={0.6} />
        </mesh>
        {/* Cane Rattan insert */}
        <mesh position={[0, 0, 0.015]} castShadow>
          <boxGeometry args={[0.88, 0.48, 0.05]} />
          <meshPhysicalMaterial
            color={secondaryColor}
            roughness={0.75}
            clearcoat={0.1}
          />
        </mesh>
      </group>

      {/* Armrests */}
      <mesh position={[-0.55, 0.2, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.04, 0.7]} />
        <meshStandardMaterial color={primaryColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.55, 0.2, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.04, 0.7]} />
        <meshStandardMaterial color={primaryColor} roughness={0.5} />
      </mesh>
    </group>
  );
};
