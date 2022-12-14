/*
Denne koden er basert på kodeeksempel ammoConstraints/myAmmoHelper.js
https://source.coderefinery.org/3d/threejs_std/-/blob/main/src/del4/ammoConstraints/myAmmoHelper.js
*/

let g_checkCollisions = false;
let g_transform;

export const IMPULSE_FORCE = 10;

export let g_ammoPhysicsWorld;
export let g_rigidBodies = [];

export function createAmmoWorld(checkCollisions= true) {
	g_checkCollisions = checkCollisions;

	g_transform = new Ammo.btTransform();           // Hjelpeobjekt.

	// Initialiserer g_ammoPhysicsWorld:
	let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
		dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
		overlappingPairCache = new Ammo.btDbvtBroadphase(),
		solver = new Ammo.btSequentialImpulseConstraintSolver();

	g_ammoPhysicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
	g_ammoPhysicsWorld.setGravity(new Ammo.btVector3(0, -9.80665, 0));
}

//boxShape, springCubeMesh1, 0.4, 0.6, pos1, mass1
export function createAmmoRigidBody(shape, threeMesh, restitution=0.7, friction=0.8, position={x:0, y:50, z:0}, mass=1) {

	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

	let quaternion = threeMesh.quaternion;
	transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

	let scale = threeMesh.scale;
	shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

	let motionState = new Ammo.btDefaultMotionState(transform);
	let localInertia = new Ammo.btVector3(0, 0, 0);
	shape.calculateLocalInertia(mass, localInertia);

	let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
	let rigidBody = new Ammo.btRigidBody(rbInfo);
	rigidBody.setRestitution(restitution);
	rigidBody.setFriction(friction);

	return rigidBody;
}

export function updatePhysics(deltaTime) {
	// Step physics world:
	g_ammoPhysicsWorld.stepSimulation(deltaTime, 10);

	// Update rigid bodies
	for (let i = 0; i < g_rigidBodies.length; i++) {
		let mesh = g_rigidBodies[i];
		let rigidBody = mesh.userData.physicsBody;
		let motionState = rigidBody.getMotionState();
		if (motionState) {
			motionState.getWorldTransform(g_transform);
			let p = g_transform.getOrigin();
			let q = g_transform.getRotation();
			mesh.position.set(p.x(), p.y(), p.z());
			mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
		}
	}

	// Kollisjonsdeteksjon:
	if (g_checkCollisions)
		checkCollisions(deltaTime);
}

// Finner alle manifolds, gjennomløper og gjør noe dersom kollison mellom kulene:
function checkCollisions(deltaTime) {
	// Finner alle mulige kollisjonspunkter/kontaktpunkter (broad phase):
	let numManifolds = g_ammoPhysicsWorld.getDispatcher().getNumManifolds();
	// Gjennomløper alle kontaktpunkter:
	for (let i=0; i < numManifolds;i++) {
		// contactManifold er et btPersistentManifold-objekt:
		let contactManifold =  g_ammoPhysicsWorld.getDispatcher().getManifoldByIndexInternal(i);
		let numContacts = contactManifold.getNumContacts();
		if (numContacts>0) {
			// Henter objektene som er involvert:
			// getBody0() og getBody1() returnerer et btCollisionObject,
			// gjøres derfor om til btRigidBody-objekter vha. Ammo.castObject():
			let rbObject0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
			let rbObject1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);
			let threeMesh0 = rbObject0.threeMesh;
			let threeMesh1 = rbObject1.threeMesh;
			if (threeMesh0 && threeMesh1) {
				for (let j = 0; j < numContacts; j++) {
					let contactPoint = contactManifold.getContactPoint(j);
					const distance = contactPoint.getDistance();
					if (distance <= 0) {
						// Vi har en kollisjon og er
						// kun interessert i kollisjon mellom kulene:
						if ((threeMesh0.name === 'golfclub' && threeMesh1.name === 'golfball') ||
							threeMesh1.name === 'golfball' && threeMesh0.name === 'golfclub') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
						}
						if ((threeMesh0.name === 'seesawSphere' && threeMesh1.name === 'button') ||
						threeMesh1.name === 'button' && threeMesh0.name === 'seesawSphere') {

						if (typeof threeMesh0.collisionResponse === 'function')
							threeMesh0.collisionResponse(threeMesh0);
						if (typeof threeMesh1.collisionResponse === 'function')
							threeMesh1.collisionResponse(threeMesh1);
					}
						if ((threeMesh0.name === 'domino' && threeMesh1.name === 'domino') ||
							threeMesh1.name === 'domino' && threeMesh0.name === 'domino') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
						}

						if ((threeMesh0.name === 'trap_door_cube' && threeMesh1.name === 'domino') ||
							threeMesh1.name === 'domino' && threeMesh0.name === 'trap_door_cube') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
						}

						if ((threeMesh0.name === 'trap_door_cube' && threeMesh1.name === 'brick') ||
							threeMesh1.name === 'brick' && threeMesh0.name === 'trap_door_cube') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
						}

						if ((threeMesh0.name === 'bottom_goal' && threeMesh1.name === 'brick') ||
							threeMesh1.name === 'brick' && threeMesh0.name === 'bottom_goal') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
						}
						if ((threeMesh0.name === 'golf_course_2' && threeMesh1.name === 'seesawSphere') ||
						threeMesh1.name === 'seesawSphere' && threeMesh0.name === 'golf_course_2') {

						if (typeof threeMesh0.collisionResponse === 'function')
							threeMesh0.collisionResponse(threeMesh0);
						if (typeof threeMesh1.collisionResponse === 'function')
							threeMesh1.collisionResponse(threeMesh1);
					}

					if ((threeMesh0.name === 'xzplane' && threeMesh1.name === 'seesawSphere') ||
						threeMesh1.name === 'seesawSphere' && threeMesh0.name === 'xzplane') {

						if (typeof threeMesh0.collisionResponse === 'function')
							threeMesh0.collisionResponse(threeMesh0);
						if (typeof threeMesh1.collisionResponse === 'function')
							threeMesh1.collisionResponse(threeMesh1);
					}
					if ((threeMesh0.name === 'flipper_arm' && threeMesh1.name === 'seesawSphere') ||
						threeMesh1.name === 'seesawSphere' && threeMesh0.name === 'flipper_arm') {

						if (typeof threeMesh0.collisionResponse === 'function')
							threeMesh0.collisionResponse(threeMesh0);
						if (typeof threeMesh1.collisionResponse === 'function')
							threeMesh1.collisionResponse(threeMesh1);
					}

						if ((threeMesh0.name === 'hinge_sphere' && threeMesh1.name === 'golf_cart') ||
						threeMesh1.name === 'golf_cart' && threeMesh0.name === 'hinge_sphere') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
					}
					if ((threeMesh0.name === 'spring_board' && threeMesh1.name === 'golf_cart') ||
						threeMesh1.name === 'golf_cart' && threeMesh0.name === 'spring_board') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
					}
					if ((threeMesh0.name === 'hinge_sphere' && threeMesh1.name === 'golfball') ||
						threeMesh1.name === 'golfball' && threeMesh0.name === 'hinge_sphere') {

							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0);
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1);
						}
					}
				}
			}
		}
	}
}