import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";


export function createAmmoCone(rotation={x: 0, y: Math.PI/4, z:Math.PI}, position= {x: -3.5, y: 4, z: -35}) {
	const mass=1;
    const radius = 1;
    let geometry = new THREE.ConeGeometry(radius, 4, 64, 1, false);
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.blue, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'cone';

    let height = mesh.geometry.parameters.height
	let shape = new Ammo.btConeShape(mesh.geometry.parameters.radius, height);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 2, 0.1, position, mass);

	mesh.userData.physicsBody = rigidBody;
    mesh.collisionResponse = (mesh1) => {
        mesh1.scale.set(0,0,0);
	};

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}