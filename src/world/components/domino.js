import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"


export function createAmmoGolfBall(rotation={x: 0, y: 0, z: 0}, position= {x: 0, y: 2, z: 0}) {
	const mass=1;
    let domino;
	// THREE:
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('assets/models/golf_ball/golf_ball.glb', (gltf) => {
        console.log(gltf.scene)
        domino =  gltf.scene.children[0].children[0].children[0].children[0];
        console.log(domino.geometry)
        domino.scale.set(.5, .5, .5);
        domino.position.set(position.x, position.y, position.z);
        domino.rotation.set(rotation.x, rotation.y, rotation.z);
        domino.receiveShadow = true;
        domino.castShadow = true;

/*         let triangle_mesh = new Ammo.btTriangleMesh();
        let vecA = new Ammo.btVector3(0, 0, 0);
        let vecB = new Ammo.btVector3(0, 0, 0);
        let vecC = new Ammo.btVector3(0, 0, 0);

        let verticesPos = domino.geometry.getAttribute('position').array;
        let triangles = [];
        for(let i = 0; i < verticesPos.length; i +=3) {
            triangles.push({
                x: verticesPos[i],
                y: verticesPos[i+1],
                z: verticesPos[i+2],
            });
        }

        for(let i = 0; i < triangles.length - 3; i +=3) {
            vecA.setX(triangles[i].x);
            vecA.setY(triangles[i].y);
            vecA.setZ(triangles[i].z);

            vecB.setX(triangles[i + 1].x);
            vecB.setY(triangles[i + 1].y);
            vecB.setZ(triangles[i + 1].z);

            vecC.setX(triangles[i + 2].x);
            vecC.setY(triangles[i + 2].y);
            vecC.setZ(triangles[i + 2].z);

            triangle_mesh.addTriangle(vecA, vecB, vecC, true)
        }
        Ammo.destroy(vecA);
        Ammo.destroy(vecB);
        Ammo.destroy(vecC);

        const shape = new Ammo.btConvexTriangleMeshShape(triangle_mesh);
        domino.geometry.verticesNeedUpdate = true;
        shape.getMargin( 0.05 );
        let rigidBody = createAmmoRigidBody(shape, domino, 0.3, 1, position, mass);

        domino.userData.physicsBody = rigidBody;

        // Legger til physics world:
        g_ammoPhysicsWorld.addRigidBody(
            rigidBody,
            1, 1);
    
        addMeshToScene(domino);
        g_rigidBodies.push(domino);
        rigidBody.threeMesh = domino; */

        let shape = new Ammo.btSphereShape(domino.geometry.boundingSphere.radius/1.74);
        shape.setMargin( 0.05 );
        let rigidBody = createAmmoRigidBody(shape, domino, 0.9, 0.9, position, mass);
    
        domino.userData.physicsBody = rigidBody;
    
        // Legger til physics world:
        g_ammoPhysicsWorld.addRigidBody(
            rigidBody,
            1,1 );
    
        addMeshToScene(domino);
        g_rigidBodies.push(domino);
        rigidBody.threeMesh = domino;


    })
}