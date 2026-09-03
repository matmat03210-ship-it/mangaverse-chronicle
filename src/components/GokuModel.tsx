import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import gokuGlb from "@/assets/models/goku.glb.asset.json";
import texUpper from "@/assets/models/goku-Upper.png.asset.json";
import texLower from "@/assets/models/goku-Lower.png.asset.json";
import texOther from "@/assets/models/goku-other.png.asset.json";
import texBody from "@/assets/models/goku-Body.png.asset.json";
import texHead from "@/assets/models/goku-HeadSSj.png.asset.json";

/** Modèle 3D réel de Goku (Sketchfab), textures appliquées par nom de matériau */
export function GokuModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(gokuGlb.url);

  const textures = useTexture({
    "Upper.bmp": texUpper.url,
    "Lower.bmp": texLower.url,
    "other.bmp": texOther.url,
    "Body.bmp": texBody.url,
    "HeadSSj.bmp": texHead.url,
  });

  useMemo(() => {
    for (const t of Object.values(textures)) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false;
      t.needsUpdate = true;
    }
  }, [textures]);

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mesh.material = Array.isArray(mesh.material)
          ? mats.map((m) => {
              const tex = textures[m.name as keyof typeof textures];
              return new THREE.MeshStandardMaterial({
                map: tex ?? null,
                color: tex ? "#ffffff" : "#ff8833",
                roughness: 0.85,
                metalness: 0,
              });
            })
          : new THREE.MeshStandardMaterial({
              map: (mats[0] ? textures[mats[0].name as keyof typeof textures] : undefined) ?? null,
              roughness: 0.85,
              metalness: 0,
            });
        console.log("[goku] mesh:", mesh.name, "mats:", mats.map((m) => m.name), "skinned:", (mesh as THREE.SkinnedMesh).isSkinnedMesh ?? false);
      }
    });

    // Normalise : le FBX est en Z-up (couché) — on le redresse, puis recentre au sol
    const measure = () => {
      const b = new THREE.Box3().setFromObject(clone);
      const s = new THREE.Vector3();
      b.getSize(s);
      return { b, s };
    };
    let { s } = measure();
    if (s.z > s.y * 1.5) {
      clone.rotation.x = -Math.PI / 2;
      ({ s } = measure());
    }
    const scale = 2.6 / Math.max(s.x, s.y, s.z);
    clone.scale.setScalar(scale);
    const { b: box2 } = measure();
    const center = new THREE.Vector3();
    box2.getCenter(center);
    clone.position.set(-center.x, -box2.min.y - 0.9, -center.z);
    return clone;
  }, [scene, textures]);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(gokuGlb.url);
