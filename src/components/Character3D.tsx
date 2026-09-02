import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { defaultLook, looks, type Look } from "@/data/looks";

function Hair({ look }: { look: Look }) {
  const { hair, hairStyle } = look;
  const mat = <meshStandardMaterial color={hair} roughness={0.5} />;

  if (hairStyle === "bald") return null;

  if (hairStyle === "antenna")
    return (
      <mesh position={[0, 1.98, 0]} rotation={[0.2, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.045, 0.45, 4, 8]} />
        {mat}
      </mesh>
    );

  if (hairStyle === "horn")
    return (
      <group>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.28, 1.85, 0]} rotation={[0, 0, s * -0.9]} castShadow>
            <coneGeometry args={[0.11, 0.42, 8]} />
            {mat}
          </mesh>
        ))}
      </group>
    );

  if (hairStyle === "smooth" || hairStyle === "bob")
    return (
      <group>
        <mesh position={[0, 1.82, -0.02]} castShadow>
          <sphereGeometry args={[0.335, 24, 20]} />
          {mat}
        </mesh>
        <mesh position={[0, 1.66, -0.14]} castShadow>
          <capsuleGeometry args={[0.26, hairStyle === "bob" ? 0.2 : 0.42, 6, 16]} />
          {mat}
        </mesh>
      </group>
    );

  // spiky / flame
  const spikes =
    hairStyle === "flame"
      ? Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2;
          return { x: Math.cos(a) * 0.14, z: Math.sin(a) * 0.12, h: 0.75, tx: 0, tz: 0 };
        })
      : Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return {
            x: Math.cos(a) * 0.24,
            z: Math.sin(a) * 0.2,
            h: 0.5 + (i % 3) * 0.12,
            tx: Math.cos(a) * 0.5,
            tz: Math.sin(a) * 0.4,
          };
        });

  return (
    <group>
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.32, 24, 20]} />
        {mat}
      </mesh>
      {spikes.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 1.95 + s.h / 2, s.z]}
          rotation={[s.tz, 0, -s.tx]}
          castShadow
        >
          <coneGeometry args={[0.1, s.h, 6]} />
          {mat}
        </mesh>
      ))}
    </group>
  );
}

function Figure({ look }: { look: Look }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
    }
  });

  const skinMat = <meshStandardMaterial color={look.skin} roughness={0.55} />;
  const topMat = <meshStandardMaterial color={look.top} roughness={0.6} />;
  const bottomMat = <meshStandardMaterial color={look.bottom} roughness={0.6} />;
  const bootMat = <meshStandardMaterial color={look.boots} roughness={0.5} />;

  return (
    <group ref={group} scale={look.scale ?? 1} position={[0, -0.9, 0]}>
      {/* head */}
      <mesh position={[0, 1.78, 0]} castShadow>
        <sphereGeometry args={[0.3, 28, 24]} />
        {skinMat}
      </mesh>
      {/* eyes */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 1.8, 0.27]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#16161d" roughness={0.3} />
        </mesh>
      ))}
      <Hair look={look} />

      {/* neck */}
      <mesh position={[0, 1.52, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.14, 12]} />
        {skinMat}
      </mesh>

      {/* torso */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.42, 8, 20]} />
        {topMat}
      </mesh>
      {/* belt */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.29, 0.29, 0.14, 20]} />
        <meshStandardMaterial color={look.belt} roughness={0.5} />
      </mesh>

      {/* arms */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.4, 1.24, 0]} rotation={[0, 0, s * 0.28]} castShadow>
            <capsuleGeometry args={[0.1, 0.36, 6, 14]} />
            {topMat}
          </mesh>
          <mesh position={[s * 0.53, 0.86, 0]} rotation={[0, 0, s * 0.2]} castShadow>
            <capsuleGeometry args={[0.085, 0.32, 6, 14]} />
            {skinMat}
          </mesh>
          <mesh position={[s * 0.6, 0.64, 0]} castShadow>
            <sphereGeometry args={[0.11, 14, 12]} />
            {skinMat}
          </mesh>
        </group>
      ))}

      {/* legs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.16, 0.5, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.42, 6, 14]} />
            {bottomMat}
          </mesh>
          <mesh position={[s * 0.16, 0.13, 0.02]} castShadow>
            <capsuleGeometry args={[0.12, 0.2, 6, 14]} />
            {bootMat}
          </mesh>
          <mesh position={[s * 0.16, 0.03, 0.09]} castShadow>
            <boxGeometry args={[0.22, 0.1, 0.34]} />
            {bootMat}
          </mesh>
        </group>
      ))}

      {look.cape && (
        <mesh position={[0, 1.2, -0.3]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.72, 0.9, 0.06]} />
          <meshStandardMaterial color={look.cape} roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

export function Character3D({
  slug,
  interactive = true,
  autoRotate = true,
  className = "",
}: {
  slug: string;
  interactive?: boolean;
  autoRotate?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const look = looks[slug] ?? defaultLook;

  if (!mounted) return <div className={className} aria-hidden />;

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.6, 3.6], fov: 42 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.6} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#8fb6ff" />
        <Environment>
          <Lightformer intensity={1.6} position={[0, 4, 2]} scale={[8, 8, 1]} />
          <Lightformer intensity={0.9} color="#9ec8ff" position={[-4, 1, -2]} scale={[10, 3, 1]} />
        </Environment>
        <Figure look={look} />
        <ContactShadows position={[0, -0.92, 0]} opacity={0.45} scale={5} blur={2.4} far={3} />
        <OrbitControls
          enablePan={false}
          enableZoom={interactive}
          enabled={interactive}
          autoRotate={autoRotate}
          autoRotateSpeed={1.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.9}
          minDistance={2.4}
          maxDistance={5.5}
        />
      </Canvas>
    </div>
  );
}
