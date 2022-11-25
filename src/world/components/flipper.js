import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { intializeSwingDoor } from "../helpers/myAudioHelper.js";

export async function createFlipper(position={x: 12, y: 1.7, z:-25}) {
    const anchor = createAnchor({x: position.x, y: position.y, z: position.z});
    const arm = createArm({x: position.x, y: position.y, z: position.z - 3});

	const anchorPivot = new Ammo.btVector3( 0, 0, 0 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	const armPivot = new Ammo.btVector3( 0, 0, 1.25 );
	const armAxis = new Ammo.btVector3(0,0,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		anchor,
		arm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI;
	const upperLimit = Math.PI;
	const softness = 1;
	const biasFactor = 1;
	const relaxationFactor = 0;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0, 0.01);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );
}

export async function createFlipper2(position={x: 11, y: 1.7, z:-26}) {
    const anchor = createAnchor({x: position.x, y: position.y, z: position.z});
    const arm = createArm({x: position.x - 4, y: position.y, z: position.z});

	const anchorPivot = new Ammo.btVector3( 0, 0, 0 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	const armPivot = new Ammo.btVector3( 0, 0, -1.25 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		anchor,
		arm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI;
	const upperLimit = Math.PI;
	const softness = 1;
	const biasFactor = 1;
	const relaxationFactor = 0;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0, 0.1);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );
}

function createArm(position={x: 12, y: 1.5, z:-25}) {
	let isCollided = false;
	let width = .1;
    let height = .5;
    let depth = 2;
	const mass = 5;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth),
		new THREE.MeshStandardMaterial({color: colorScheme.gray, transparent: true, opacity: 1}));
	mesh.name = 'flipper_arm';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
        if(!isCollided) {
			intializeSwingDoor();
            isCollided = true;
        }
    };
	//AMMO
	const shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
    }

function createAnchor(position={x: 12, y: 1.7, z:-22}) {
	const radius = .2;
	const mass = 0;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: 0xb846db, transparent: true, opacity: .5}));
	mesh.name = 'anchor';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
		1 | 1 | 1);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;



	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
    }