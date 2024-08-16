import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { OrbitControls, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from 'react';


function Avatar() {
  const gltf = useLoader(GLTFLoader, 'src/assets/cartoonboy.glb'); // Use the correct path to your .glb file
  const { actions } = useAnimations(gltf.animations, gltf.scene);

  React.useEffect(() => {
    if (actions['HandMovement']) {
      actions['HandMovement'].play();
    }
  }, [actions]);

  return (
    <primitive
      object={gltf.scene}
      scale={1.5}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

function AvatarViewer() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Avatar />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default AvatarViewer;
