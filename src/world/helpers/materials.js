import * as THREE from "three";

export async function createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const fabricTexture = textureLoader.load("assets/textures/fabric/fabric.jpg");
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(4.5,25);
    const fabricNormalMapTexture = textureLoader.load("assets/textures/fabric/fabric_normal.jpg");
    fabricNormalMapTexture.wrapS = THREE.RepeatWrapping;
    fabricNormalMapTexture.wrapT = THREE.RepeatWrapping;
    fabricNormalMapTexture.repeat.set(3,3);
    let fabricMaterial = new THREE.MeshStandardMaterial( {
        color: new THREE.Color(0, 1.3, 0.8),
        map: fabricTexture,
        normalMap: fabricNormalMapTexture,
        flatShading: true,
        normalScale: new THREE.Vector2(5, 5),
         });

         const woodTexture = textureLoader.load("assets/textures/wood/wood.jpg");
         woodTexture.wrapT = THREE.RepeatWrapping;
         woodTexture.wrapS = THREE.RepeatWrapping;
         woodTexture.repeat.set(1,1);
         const woodNormalTexture = textureLoader.load("assets/textures/sand/sand_normal.jpg");
         woodNormalTexture.wrapS = THREE.RepeatWrapping;
         woodNormalTexture.wrapT = THREE.RepeatWrapping;
         woodNormalTexture.repeat.set(1,1);
         let woodMaterial = new THREE.MeshStandardMaterial( {
            //normalMap: woodNormalTexture,
            clearcoatNormalMap: woodNormalTexture,
            flatShading: true,
            transparent: true,
            opacity: 1,
            color: new THREE.Color(1.2, 0.5, 0),
            roughness: 0.1,
            metalness: 0.1,
            transmission: 1,
            thickness: 1.2,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            normalScale: new THREE.Vector2(1, 1),
            clearcoatNormalScale: new THREE.Vector2(0.3, 0.3)
              });

              const brickNormalMapTexture = textureLoader.load("assets/textures/brick/bricks_normalmap.jpg");
              brickNormalMapTexture.wrapS = THREE.RepeatWrapping;
              brickNormalMapTexture.wrapT = THREE.RepeatWrapping;
              
              let brickMaterial = new THREE.MeshPhysicalMaterial({
                  normalMap: brickNormalMapTexture,
                  clearcoatNormalMap: brickNormalMapTexture,
                  flatShading: true,
                  transparent: true,
                  opacity: 1,
                  color: new THREE.Color(Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5),
                  roughness: 0.7,
                  transmission: 1,
                  thickness: 1.2,
                  clearcoat: 1,
                  clearcoatRoughness: 0.1,
                  normalScale: new THREE.Vector2(6, 6),
                  clearcoatNormalScale: new THREE.Vector2(0.3, 0.3)
              });
              brickMaterial.displacementScale = -0.01
              brickMaterial.premultipliedAlpha = true;

    
    return {
        fabricMaterial,
        woodMaterial,
        brickMaterial
    }
}