import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createAmmoRamp } from "./ramp.js";
import { createAmmoCone } from "./cone.js";
import { createTorus } from "./torus.js";
import { createAmmoCube } from "./cube.js";
import { createMaterials } from "../helpers/materials.js";
import { createGolfPlane } from "./golfPlane.js";

export function createAmmoCubeShape(
	rotation={x: 0, y: 0, z: 0},
	position= {x: 0, y: 0, z: 0},
	width = 1,
	length = 1,
	depth = 1,
    color = 0xA8A8F8,
    material,
	 ) {
	const mass=0;
	// THREE:

	let geometry = new THREE.BoxGeometry( length, depth, width, 1, 1 );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'xzplane';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(length/2, depth/2, width/2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export async function createGolfCourseTriangleMesh(position={x: -15, y: 4, z: -25}) {
    const mass = 0;
    let compoundShape = new Ammo.btCompoundShape();
    let groupMesh = new THREE.Group();
    groupMesh.userData.tag = "swing";
    await createGolfCourseParts(groupMesh, compoundShape);

    let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
    groupMesh.userData.physicsBody = rigidBody;
    // Legger til physics world:
    g_ammoPhysicsWorld.addRigidBody(
        rigidBody);

    addMeshToScene(groupMesh);
    g_rigidBodies.push(groupMesh);
    rigidBody.threeMesh = groupMesh;
}

export async function createGolfCourse() {
    const materials = await createMaterials();
	createAmmoCubeShape(
		{x: 0, y: 0, z: 0},
		{x: 4.5, y: 1, z: -22},
		50, 1, 2,
        colorScheme.yellow,
        materials.woodMaterial
		);
	createAmmoCubeShape(
		{x: 0, y: 0, z: 0},
		{x: -4.5, y: 1, z: -22},
		50, 1, 2,
        colorScheme.yellow,
        materials.woodMaterial
		);
    createAmmoCubeShape(
        {x: 0, y: Math.PI/2, z: Math.PI/2},
        {x: 0, y: 1, z: -47},
        11, 2, 1,
        colorScheme.yellow
        );
    createAmmoCubeShape(
        {x: 0, y: Math.PI/7, z: Math.PI/2},
        {x: 3.5, y: 1, z: -15},
        7, 2, .5,
        colorScheme.yellow
        );
    createAmmoCubeShape(
        {x: 0, y: Math.PI/2, z: Math.PI/2},
        {x: -3, y: 1, z: -22},
        5, 2, .5,
        colorScheme.yellow
        );
    createAmmoCubeShape(
        {x: Math.PI/10, y: 0, z: 0},
        {x: 0, y: 2, z: -34},
        6, 1, .2,
        colorScheme.blue
        );
    createAmmoCubeShape(
        {x: 0, y: 0, z: 0},
        {x: 0, y: 2, z: -37},
        .4, 1, 2,
        colorScheme.blue
        );
    createAmmoCubeShape(
        {x: 0, y: 0, z: 0},
        {x: 0, y: 2, z: -39.5},
        5, 9, 2,
        colorScheme.pink
        );
    createAmmoCubeShape(
        {x: 0, y: 0, z: 0},
        {x: -2.5, y: 1.5, z: -33},
        1, 4, 1,
        colorScheme.yellow
        );
    createAmmoCubeShape(
        {x: 0, y: 0, z: 0},
        {x: 2.5, y: 1.5, z: -33},
        1, 4, 1,
        colorScheme.yellow
        );
    createTorus(
        {x: Math.PI/2, y: 0, z: 0},
        {x: 0, y: 1.5, z: -44})

    createAmmoCube();
}

