import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { intializeDomino } from "../helpers/myAudioHelper.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";
import { createMaterials } from "../helpers/materials.js";

export async function createSkyBox() {
    let materials = await createMaterials();
    let geometry = new THREE.BoxGeometry(60, 50, 100);
    let mesh = new THREE.Mesh(geometry, materials.materialArray);
    mesh.position.set(0, 5, 0);
    addMeshToScene(mesh);
}