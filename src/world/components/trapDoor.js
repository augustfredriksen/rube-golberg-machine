import * as THREE from "three";
import { addMeshToScene, g_camera, g_controls } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";

export async function createTrapDoorTriangleMesh(position={x: 8.5, y: 3, z: -25}) {
    const mass = 0;
    let compoundShape = new Ammo.btCompoundShape();
    let groupMesh = new THREE.Group();
    groupMesh.userData.tag = "trap_door";
    await createTrapDoorParts(groupMesh, compoundShape);

    let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
    groupMesh.userData.physicsBody = rigidBody;
    // Legger til physics world:
    g_ammoPhysicsWorld.addRigidBody(
        rigidBody);

    addMeshToScene(groupMesh);
    g_rigidBodies.push(groupMesh);
    rigidBody.threeMesh = groupMesh;
}

async function createTrapDoorParts(groupMesh, compoundShape) {
    let material = new THREE.MeshStandardMaterial({color: colorScheme.pink, transparent: true, opacity: 1});

    let pillarGeometry = new THREE.BoxGeometry(.4, 4, .4);
    let pillarMesh = new THREE.Mesh(pillarGeometry, material);
    pillarMesh.castShadow = true;
    pillarMesh.receiveShadow = true;
    pillarMesh.name = "pillar";
    groupMesh.add(pillarMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh);

    let pillarMesh2 = pillarMesh.clone();
    pillarMesh2.name = "pillar2";
    pillarMesh2.position.set(pillarMesh.position.x + 3, pillarMesh.position.y, pillarMesh.position.z)
    groupMesh.add(pillarMesh2);
    createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh2);

    let pillarMesh3 = pillarMesh.clone();
    pillarMesh3.name = "pillar3";
    pillarMesh3.position.set(pillarMesh.position.x, pillarMesh.position.y, pillarMesh.position.z + 3)
    groupMesh.add(pillarMesh3);
    createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh3);

    let pillarMesh4 = pillarMesh.clone();
    pillarMesh4.name = "pillar2";
    pillarMesh4.position.set(pillarMesh.position.x + 3, pillarMesh.position.y, pillarMesh.position.z + 3)
    groupMesh.add(pillarMesh4);
    createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh4);

    let topGeometry = new THREE.BoxGeometry(3, .4, .4);
    let topMesh = new THREE.Mesh(topGeometry, material);
    topMesh.position.set(topMesh.position.x + 1.5, pillarMesh.geometry.parameters.height/2 - topMesh.geometry.parameters.height/2, topMesh.position.z)
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    topMesh.name = "top";
    groupMesh.add(topMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, topMesh);

    let topMesh2 = topMesh.clone();
    topMesh2.name = "top2";
    topMesh2.position.set(topMesh.position.x - 1.5, topMesh.position.y, topMesh.position.z + 1.5)
    topMesh2.rotation.set(0 , Math.PI/2, 0);
    groupMesh.add(topMesh2);
    createConvexTriangleShapeAddToCompound(compoundShape, topMesh2);

    let topMesh3 = topMesh.clone();
    topMesh3.name = "top3";
    topMesh3.position.set(topMesh.position.x, topMesh.position.y, topMesh.position.z + 3)
    topMesh3.rotation.set(0 , 0, 0);
    groupMesh.add(topMesh3);
    createConvexTriangleShapeAddToCompound(compoundShape, topMesh3);

    let topMesh4 = topMesh.clone();
    topMesh4.name = "top4";
    topMesh4.position.set(topMesh.position.x + 1.5, topMesh.position.y, topMesh.position.z + 1.5)
    topMesh4.rotation.set(0 , Math.PI/2, 0);
    groupMesh.add(topMesh4);
    createConvexTriangleShapeAddToCompound(compoundShape, topMesh4);
}