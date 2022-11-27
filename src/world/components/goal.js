import * as THREE from "three";
import { addMeshToScene, g_camera, g_controls } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { createMaterials } from "../helpers/materials.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { initializeBoing } from "../helpers/myAudioHelper.js";
import { create3dText, createCustomThing } from "./finish.js";

export async function createGoalTriangleMesh(position={x: 10, y: 1, z: 3}) {

    const mass = 0;
    let compoundShape = new Ammo.btCompoundShape();
    let groupMesh = new THREE.Group();
    groupMesh.userData.tag = "goal";
    await createGoalParts(groupMesh, compoundShape);

    let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
    groupMesh.userData.physicsBody = rigidBody;
    // Legger til physics world:
    g_ammoPhysicsWorld.addRigidBody(
        rigidBody);

    addMeshToScene(groupMesh);
    g_rigidBodies.push(groupMesh);
    rigidBody.threeMesh = groupMesh;
}

async function createGoalParts(groupMesh, compoundShape) {
    const materials = await createMaterials("firebrick");
    createBottomGoal();

    let frontWallGeometry = new THREE.BoxGeometry(20, 10, 1);
    let frontWallMesh = new THREE.Mesh(frontWallGeometry, materials.basicMaterial);
    frontWallMesh.position.set(0 , -frontWallMesh.geometry.parameters.height/2 , 0);
    groupMesh.add(frontWallMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, frontWallMesh);

    let leftWallMesh = frontWallMesh.clone();
    leftWallMesh.rotateY(Math.PI/2);
    leftWallMesh.position.x = leftWallMesh.geometry.parameters.width/2;
    leftWallMesh.position.z = leftWallMesh.geometry.parameters.width/2;
    groupMesh.add(leftWallMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, leftWallMesh);

    let rightWallMesh = frontWallMesh.clone();
    rightWallMesh.rotateY(Math.PI/2);
    rightWallMesh.position.x = -rightWallMesh.geometry.parameters.width/2;
    rightWallMesh.position.z = rightWallMesh.geometry.parameters.width/2;
    groupMesh.add(rightWallMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, rightWallMesh);

    let backWallMesh = frontWallMesh.clone();
    backWallMesh.position.z = backWallMesh.geometry.parameters.width;
    groupMesh.add(backWallMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, backWallMesh);

    let bottomWallGeometry = new THREE.BoxGeometry(20, 1, 20);
    let bottomWallMesh = new THREE.Mesh(bottomWallGeometry, materials.basicMaterial);
    bottomWallMesh.position.set(0, -rightWallMesh.geometry.parameters.height, rightWallMesh.geometry.parameters.width/2);
    groupMesh.add(bottomWallMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, bottomWallMesh);
}

function createBottomGoal(position = {x: 10, y: -5, z: 13}) {
    let isCollided = false;
	const mass=15;
	// THREE:
	let geometry = new THREE.BoxGeometry( 18, 1, 18, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.pink, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);

	mesh.receiveShadow = true;
	mesh.name = 'bottom_goal';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(18/2, 1/2, 18/2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);

    mesh.collisionResponse = (mesh1) => {
        if(!isCollided) {
            setTimeout(() => {
            g_camera.position.set(9, 10, 0)
            g_controls.target = new THREE.Vector3(10, -5, 13);
            }, 500);
            g_controls.maxDistance = 50;
            create3dText();
            for(let i = 0; i < 25; i++) {
                createCustomThing(Math.random(), {x: Math.random()*(19 - 1) + 1, y: -7, z: Math.random()*(22 - 4) + 4});
            }
            initializeBoing();
            mesh1.material.color.setHex( 0xffffff);
            isCollided = true;
        }
    };

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}