import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Lightformer, Outlines } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { defaultLook, looks, type Look } from "@/data/looks";
import { GokuModel } from "./GokuModel";
import { ImportedCharacterModel, importedCharacterSlugs } from "./ImportedCharacterModel";

/** 3-step toon ramp — donne le rendu cel-shading façon anime */
function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

const OUTLINE = "#14121c";

type PartProps = {
  color: string;
  gradient: THREE.Texture;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  outline?: number;
  children: React.ReactNode;
};

/** Un morceau de corps : géométrie + matériau toon + contour noir */
function Part({
  color,
  gradient,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  outline = 0.012,
  children,
}: PartProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      {children}
      <meshToonMaterial color={color} gradientMap={gradient} />
      <Outlines thickness={outline} color={OUTLINE} />
    </mesh>
  );
}

function Hair({ look, g }: { look: Look; g: THREE.Texture }) {
  const { hair, hairStyle } = look;

  if (hairStyle === "bald") return null;

  if (hairStyle === "antenna")
    return (
      <Part color={hair} gradient={g} position={[0, 2.02, -0.02]} rotation={[0.25, 0, 0.12]}>
        <capsuleGeometry args={[0.04, 0.5, 6, 10]} />
      </Part>
    );

  if (hairStyle === "horn")
    return (
      <group>
        {[-1, 1].map((s) => (
          <Part
            key={s}
            color={hair}
            gradient={g}
            position={[s * 0.26, 1.9, -0.04]}
            rotation={[-0.25, 0, s * -0.85]}
          >
            <coneGeometry args={[0.1, 0.5, 10]} />
          </Part>
        ))}
      </group>
    );

  if (hairStyle === "smooth" || hairStyle === "bob")
    return (
      <group>
        <Part color={hair} gradient={g} position={[0, 1.86, -0.02]} scale={[1.06, 1, 1.06]}>
          <sphereGeometry args={[0.3, 24, 20]} />
        </Part>
        <Part
          color={hair}
          gradient={g}
          position={[0, 1.66, -0.16]}
          scale={[1, 1, 0.7]}
        >
          <capsuleGeometry args={[0.24, hairStyle === "bob" ? 0.18 : 0.44, 6, 16]} />
        </Part>
        {/* mèche frontale */}
        <Part color={hair} gradient={g} position={[0.12, 1.96, 0.2]} rotation={[0.5, 0, -0.3]}>
          <coneGeometry args={[0.09, 0.28, 8]} />
        </Part>
      </group>
    );

  // spiky (Goku / Gohan) & flame (Vegeta) — mèches en pics tirées vers le haut/arrière
  const spikes =
    hairStyle === "flame"
      ? Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return {
            x: Math.cos(a) * 0.15,
            z: Math.sin(a) * 0.13,
            h: 0.62 + Math.cos(a) * 0.08,
            r: 0.075,
            tiltX: -0.18,
            tiltZ: -Math.cos(a) * 0.18,
          };
        })
      : Array.from({ length: 13 }, (_, i) => {
          const a = (i / 13) * Math.PI * 2;
          const back = (Math.sin(a) + 1) / 2;
          return {
            x: Math.cos(a) * 0.24,
            z: Math.sin(a) * 0.22,
            h: 0.34 + back * 0.34 + (i % 3) * 0.06,
            r: 0.085,
            tiltX: Math.sin(a) * 0.75 - 0.15,
            tiltZ: -Math.cos(a) * 0.8,
          };
        });

  return (
    <group>
      <Part color={hair} gradient={g} position={[0, 1.85, -0.03]} scale={[1.05, 0.92, 1.05]}>
        <sphereGeometry args={[0.295, 24, 20]} />
      </Part>
      {spikes.map((s, i) => (
        <Part
          key={i}
          color={hair}
          gradient={g}
          position={[s.x, 1.96 + s.h * 0.42, s.z - 0.03]}
          rotation={[s.tiltX, 0, s.tiltZ]}
          outline={0.01}
        >
          <coneGeometry args={[s.r, s.h, 6]} />
        </Part>
      ))}
    </group>
  );
}

function Figure({ look }: { look: Look }) {
  const group = useRef<THREE.Group>(null);
  const g = useToonGradient();

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = -0.9 + Math.sin(state.clock.elapsedTime * 1.3) * 0.035;
    }
  });

  const skin = look.skin;
  const top = look.top;
  const bottom = look.bottom;

  return (
    <group ref={group} scale={look.scale ?? 1} position={[0, -0.9, 0]}>
      {/* ---------- tête ---------- */}
      <Part color={skin} gradient={g} position={[0, 1.79, 0]} scale={[0.93, 1.05, 0.95]}>
        <sphereGeometry args={[0.29, 28, 24]} />
      </Part>
      {/* yeux façon manga : sclère + iris + sourcil marqué */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.115, 1.79, 0.245]} rotation={[0, s * 0.22, 0]} scale={[1.5, 0.85, 0.5]}>
            <sphereGeometry args={[0.055, 14, 12]} />
            <meshToonMaterial color="#fbf7f2" gradientMap={g} />
          </mesh>
          <mesh position={[s * 0.118, 1.785, 0.275]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshToonMaterial color="#1c1a26" gradientMap={g} />
          </mesh>
          <mesh
            position={[s * 0.12, 1.865, 0.26]}
            rotation={[0, 0, s * 0.35]}
            scale={[1.6, 0.35, 0.4]}
          >
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshToonMaterial color={look.hair} gradientMap={g} />
          </mesh>
        </group>
      ))}
      <Hair look={look} g={g} />

      {/* ---------- cou ---------- */}
      <Part color={skin} gradient={g} position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.095, 0.13, 0.16, 14]} />
      </Part>

      {/* ---------- torse : trapèze large, taille fine ---------- */}
      <Part color={top} gradient={g} position={[0, 1.29, 0]} scale={[1.5, 1, 1]}>
        <sphereGeometry args={[0.29, 24, 20]} />
      </Part>
      <Part color={top} gradient={g} position={[0, 1.06, 0]} scale={[1.18, 1, 0.92]}>
        <capsuleGeometry args={[0.2, 0.2, 8, 20]} />
      </Part>
      {/* pectoraux */}
      {[-1, 1].map((s) => (
        <Part
          key={s}
          color={top}
          gradient={g}
          position={[s * 0.16, 1.31, 0.16]}
          scale={[1.15, 0.8, 0.7]}
          outline={0.008}
        >
          <sphereGeometry args={[0.16, 18, 16]} />
        </Part>
      ))}
      {/* ceinture / obi */}
      <Part color={look.belt} gradient={g} position={[0, 0.87, 0]} scale={[1.12, 1, 0.95]}>
        <cylinderGeometry args={[0.23, 0.24, 0.19, 20]} />
      </Part>
      {/* pan de ceinture qui retombe */}
      <Part
        color={look.belt}
        gradient={g}
        position={[0.16, 0.68, 0.19]}
        rotation={[0.15, 0, 0.1]}
        scale={[1, 1, 0.35]}
      >
        <boxGeometry args={[0.16, 0.34, 0.16]} />
      </Part>

      {/* ---------- bras : deltoïde, biceps, avant-bras, poing ---------- */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Part
            color={top}
            gradient={g}
            position={[s * 0.38, 1.34, 0]}
            scale={[1, 0.95, 1]}
            outline={0.01}
          >
            <sphereGeometry args={[0.145, 18, 16]} />
          </Part>
          <Part
            color={top}
            gradient={g}
            position={[s * 0.47, 1.11, 0.01]}
            rotation={[0, 0, s * 0.26]}
            scale={[1, 1, 0.95]}
          >
            <capsuleGeometry args={[0.105, 0.24, 8, 16]} />
          </Part>
          <Part
            color={skin}
            gradient={g}
            position={[s * 0.6, 0.83, 0.05]}
            rotation={[-0.25, 0, s * 0.2]}
          >
            <capsuleGeometry args={[0.085, 0.26, 8, 16]} />
          </Part>
          {/* bracelet */}
          <Part color={look.belt} gradient={g} position={[s * 0.65, 0.66, 0.1]} rotation={[-0.25, 0, s * 0.2]}>
            <cylinderGeometry args={[0.095, 0.095, 0.1, 14]} />
          </Part>
          <Part color={skin} gradient={g} position={[s * 0.67, 0.55, 0.12]} scale={[1, 1.1, 1]}>
            <sphereGeometry args={[0.1, 16, 14]} />
          </Part>
        </group>
      ))}

      {/* ---------- jambes : posture de combat, appuis écartés ---------- */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Part
            color={bottom}
            gradient={g}
            position={[s * 0.17, 0.6, 0]}
            rotation={[0, 0, s * 0.09]}
            scale={[1.05, 1, 1]}
          >
            <capsuleGeometry args={[0.135, 0.24, 8, 16]} />
          </Part>
          <Part
            color={bottom}
            gradient={g}
            position={[s * 0.22, 0.31, 0]}
            rotation={[0, 0, s * 0.05]}
          >
            <capsuleGeometry args={[0.115, 0.2, 8, 16]} />
          </Part>
          {/* botte montante */}
          <Part color={look.boots} gradient={g} position={[s * 0.24, 0.13, 0]}>
            <capsuleGeometry args={[0.12, 0.14, 8, 16]} />
          </Part>
          <Part color={look.boots} gradient={g} position={[s * 0.24, 0.035, 0.07]}>
            <boxGeometry args={[0.22, 0.09, 0.34]} />
          </Part>
        </group>
      ))}

      {look.cape && (
        <Part
          color={look.cape}
          gradient={g}
          position={[0, 1.18, -0.28]}
          rotation={[0.1, 0, 0]}
          scale={[1, 1, 0.25]}
        >
          <capsuleGeometry args={[0.36, 0.6, 8, 18]} />
        </Part>
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
  const cameraDistance = 4.6;

  if (!mounted) return <div className={className} aria-hidden />;

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.35, cameraDistance], fov: 42 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 3]} intensity={1.7} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#8fb6ff" />
        <Environment>
          <Lightformer intensity={1.6} position={[0, 4, 2]} scale={[8, 8, 1]} />
          <Lightformer intensity={0.9} color="#9ec8ff" position={[-4, 1, -2]} scale={[10, 3, 1]} />
        </Environment>
        {slug === "goku" ? (
          <Suspense fallback={null}>
            <GokuModel />
          </Suspense>
        ) : importedCharacterSlugs.has(slug) ? (
          <Suspense fallback={null}>
            <ImportedCharacterModel slug={slug} />
          </Suspense>
        ) : (
          <Figure look={look} />
        )}
        <ContactShadows position={[0, -0.92, 0]} opacity={0.45} scale={5} blur={2.4} far={3} />
        <OrbitControls
          target={[0, 0.25, 0]}
          enablePan={false}
          enableZoom={interactive}
          enabled={interactive}
          autoRotate={autoRotate}
          autoRotateSpeed={1.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.9}
          minDistance={cameraDistance * 0.65}
          maxDistance={cameraDistance * 1.2}
        />
      </Canvas>
    </div>
  );
}
