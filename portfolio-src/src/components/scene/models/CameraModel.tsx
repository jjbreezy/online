import React from 'react';

interface CameraModelProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export const CameraModel: React.FC<CameraModelProps> = ({
  primaryColor = '#242321', // leatherette body
  secondaryColor = '#c8c5bf', // satin chrome plates
  accentColor = '#b83227', // red dot
}) => {
  return (
    <group rotation={[0.25, -0.2, 0.05]} scale={[1.2, 1.2, 1.2]}>
      {/* Main Body Chassis */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 0.45]} />
        <meshPhysicalMaterial
          color={primaryColor}
          roughness={0.9}
          clearcoat={0.1}
        />
      </mesh>

      {/* Chrome Top Plate */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[1.62, 0.12, 0.46]} />
        <meshStandardMaterial
          color={secondaryColor}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* Chrome Bottom Plate */}
      <mesh position={[0, -0.47, 0]} castShadow>
        <boxGeometry args={[1.62, 0.06, 0.46]} />
        <meshStandardMaterial
          color={secondaryColor}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* Shutter Speed Dial */}
      <mesh position={[0.42, 0.57, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Shutter Button & Threaded Cable Release */}
      <mesh position={[0.62, 0.57, 0.08]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.09, 20]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Viewfinder Window (Glass) */}
      <mesh position={[-0.55, 0.48, 0.231]}>
        <boxGeometry args={[0.2, 0.09, 0.02]} />
        <meshPhysicalMaterial
          color="#88bbcc"
          transmission={0.8}
          roughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* Signature Red Dot Accent */}
      <mesh position={[-0.38, 0.22, 0.232]}>
        <cylinderGeometry args={[0.07, 0.07, 0.01, 24]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Cylindrical Stepped Lens Barrel */}
      <group position={[0.08, 0.02, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Base Mount Ring */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.18, 32]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Focus Ring (Black Anodized Ribbed) */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.16, 32]} />
          <meshStandardMaterial color="#1f1e1c" roughness={0.7} />
        </mesh>
        {/* Front Filter Ring */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.1, 32]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Front Lens Glass (Deep Curvature & Antireflective coating) */}
        <mesh position={[0, 0.42, 0]}>
          <sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, 0, 0.8]} />
          <meshPhysicalMaterial
            color="#2a4d69"
            transmission={0.9}
            roughness={0.05}
            ior={1.6}
            clearcoat={1}
          />
        </mesh>
      </group>
    </group>
  );
};
