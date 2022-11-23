import * as THREE from "three";
import { addMeshToScene, getRigidBodyFromMesh } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

export async function createAmmoToySoldier(rotation={x: -Math.PI/2, y:0, z: 0}, position= {x: 10, y: 2, z: -22}) {
	let mass=1;
    let mesh2;
    let toySoldier;
	// THREE:
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    return new Promise((resolve, reject) => {
        loader.load('assets/models/toy_soldier/scene.gltf', (gltf) => {
            console.log(gltf.scene);
            toySoldier = gltf.scene.children[0].children[0].children[0];
            mesh2 = new THREE.Mesh(toySoldier.geometry, toySoldier.material);
            mesh2.name = "toy_soldier";
            mesh2.scale.set(0.01,0.01,0.01);
            mesh2.position.set(position.x, position.y, position.z);
            mesh2.rotation.set(rotation.x, rotation.y, rotation.z);
            mesh2.receiveShadow = true;
            mesh2.castShadow = true;

    
            let triangle_mesh = new Ammo.btTriangleMesh();
            let vecA = new Ammo.btVector3(0, 0, 0);
            let vecB = new Ammo.btVector3(0, 0, 0);
            let vecC = new Ammo.btVector3(0, 0, 0);
    
            let verticesPos = mesh2.geometry.getAttribute('position').array;
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
            mesh2.geometry.verticesNeedUpdate = true;
            shape.getMargin( 0.05 );
            let rigidBody = createAmmoRigidBody(shape, mesh2, 0.1, 0.9, position, mass);
            rigidBody.setDamping(0.1, 0.5);
            rigidBody.setActivationState(4);
    
            mesh2.userData.physicsBody = rigidBody;
    
            // Legger til physics world:
            g_ammoPhysicsWorld.addRigidBody(
                rigidBody,
                1, 1 | 1 | 1);
        
            addMeshToScene(mesh2);
            g_rigidBodies.push(mesh2);
            rigidBody.threeMesh = mesh2;
            resolve(rigidBody);
        });
    });
    
}