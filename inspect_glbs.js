import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
import fs from 'fs';
import path from 'path';

const files = [
  'cell_perfect_-_dragon_ball_z.glb',
  'dragon_ball_z_krillin.glb',
  'freezer.glb',
  'gohan.glb',
  'majin_buu.glb',
  'piccolo_fortnite.glb',
  'thesaiyajin_-_vegeta_bodyguard.glb',
  'trunks_manga_dimensions.glb'
];

const dir = '/tmp/user-uploads/';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

async function inspect(file) {
  const filePath = path.join(dir, file);
  const stats = fs.statSync(filePath);
  const document = await io.read(filePath);
  const root = document.getRoot();

  const scenes = root.listScenes().length;
  const nodes = root.listNodes().length;
  const meshes = root.listMeshes().length;
  const materials = root.listMaterials().length;
  const textures = root.listTextures().length;
  const animations = root.listAnimations().map(a => a.getName());

  // Check if textures are embedded (in a GLB they usually are, but let's verify if they have URIs)
  const externalTextures = root.listTextures().filter(t => t.getURI());

  // Bounds
  const bounds = getBounds(root.listScenes()[0]);
  const size = {
    x: bounds.max[0] - bounds.min[0],
    y: bounds.max[1] - bounds.min[1],
    z: bounds.max[2] - bounds.min[2]
  };

  return {
    file,
    fileSizeMB: (stats.size / 1024 / 1024).toFixed(2),
    scenes,
    nodes,
    meshes,
    materials,
    textures,
    externalTextures: externalTextures.length,
    animations,
    bounds: {
      min: bounds.min,
      max: bounds.max,
      size
    }
  };
}

async function main() {
  const results = [];
  for (const file of files) {
    try {
      const res = await inspect(file);
      results.push(res);
    } catch (e) {
      console.error('Error processing ' + file, e);
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

main();
