import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { buildingData } from "@/data/mockData";
import * as THREE from "three";

function Building({ position, height, intensity, name }: { position: [number, number, number]; height: number; intensity: number; name: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    if (intensity > 0.7) return new THREE.Color("hsl(0, 72%, 55%)");
    if (intensity > 0.5) return new THREE.Color("hsl(38, 92%, 55%)");
    return new THREE.Color("hsl(142, 76%, 46%)");
  }, [intensity]);

  const emissiveIntensity = intensity * 0.8;

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Glass edge lines */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.22, height + 0.02, 1.22]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
      </mesh>
      <Text
        position={[0, height + 0.4, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>
      <Text
        position={[0, height + 0.15, 0]}
        fontSize={0.18}
        color={intensity > 0.7 ? "#ff6b6b" : intensity > 0.5 ? "#fbbf24" : "#4ade80"}
        anchorX="center"
        anchorY="bottom"
      >
        {Math.round(intensity * 100)}%
      </Text>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0a1a1a" roughness={0.9} />
    </mesh>
  );
}

function GridLines() {
  return (
    <gridHelper args={[30, 30, "#1a3a3a", "#0f2a2a"]} position={[0, 0, 0]} />
  );
}

export default function Campus3DView() {
  const positions: [number, number, number][] = [
    [-4, 0, -3], [-1.5, 0, -3], [1.5, 0, -3], [4, 0, -3],
    [-4, 0, 0], [-1.5, 0, 0], [1.5, 0, 0], [4, 0, 0],
    [-4, 0, 3], [-1.5, 0, 3], [1.5, 0, 3], [4, 0, 3],
  ];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-border/30">
      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#080f14"]} />
        <fog attach="fog" args={["#080f14", 15, 35]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#2dd4bf" />
        
        <Ground />
        <GridLines />
        
        {buildingData.map((b, i) => (
          <Building
            key={b.name}
            position={positions[i] || [0, 0, 0]}
            height={1 + b.intensity * 3}
            intensity={b.intensity}
            name={b.name}
          />
        ))}
        
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
