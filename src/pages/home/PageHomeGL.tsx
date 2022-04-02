import React, { useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getPublicAssetPath } from '../../utils';
import { StyledPageHomeGL } from './styled/StyledPageHomeGL';
import { gsap } from 'gsap';
import { get } from 'lodash-es';

export const PageHomeGL: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let mixer: THREE.AnimationMixer;
        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // scene.background = new THREE.Color(0x000000);
        // scene.background = new THREE.Color(0xbfe3dd);
        // scene.environment = pmremGenerator.fromScene(
        //     new RoomEnvironment(),
        //     0.04
        // ).texture;

        // const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        // scene.add(ambient);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(5, 2, 8);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.1;
        spotLight.decay = 2;
        spotLight.distance = 200;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 512;
        spotLight.shadow.mapSize.height = 512;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.focus = 1;
        scene.add(spotLight);

        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            1,
            100
        );
        camera.position.set(5, 2, 8);

        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        const pointer = new THREE.Vector2();
        const radius = 100;
        const raycaster = new THREE.Raycaster();

        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath("js/libs/draco/gltf/");

        const loader = new GLTFLoader();
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            // getPublicAssetPath("assets/demo1/demo1.glb"),
            getPublicAssetPath('assets/demo1/demo1.glb'),
            function (gltf) {
                console.log('gltf', gltf);
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(3, 3, 3);
                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[0]).play();

                // let count = 0;
                // model.traverse(function (child: any) {
                //     if (child.isMesh) {
                //         const buffer = child.geometry.attributes.position;

                //         count += buffer.array.length;
                //     }
                // });
                // const combined = new Float32Array(count);

                // let offset = 0;
                // model.traverse(function (child: any) {
                //     if (child.isMesh) {
                //         const buffer = child.geometry.attributes.position;
                //         combined.set(buffer.array, offset);
                //         offset += buffer.array.length;
                //     }
                // });

                // const positions = new THREE.BufferAttribute(combined, 3);
                // const geometry = new THREE.BufferGeometry();
                // geometry.setAttribute('position', positions.clone());
                // geometry.setAttribute('initialPosition', positions.clone());
                // const mesh = new THREE.Points(
                //     geometry,
                //     new THREE.PointsMaterial({
                //         size: 0.05,
                //         color: '#0099ff',
                //         transparent: true,
                //         blending: THREE.AdditiveBlending,
                //     })
                // );
                // mesh.scale.set(0.01, 0.01, 0.01);
                // scene.add(mesh);
                // const mesh = new THREE.Points(
                //     get(gltf.scene.children, '0.children.4.geometry'),
                //     new THREE.PointsMaterial({
                //         color: '#f00',
                //     })
                // );
                // scene.add(mesh);

                animate();
            },
            void 0,
            function (e) {
                console.error(e);
            }
        );

        function resize() {
            if (!container) {
                return;
            }
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        let frameId: number;

        function animate() {
            frameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            controls.update();

            // raycaster.setFromCamera(pointer, camera);
            // const intersects = raycaster.intersectObjects(
            //     scene.children,
            //     false
            // );
            // if (intersects.length > 0) {
            //     console.log(intersects);
            // } else {
            // }
            renderer.render(scene, camera);
        }

        function onPointerMove(event) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        container.addEventListener('pointermove', onPointerMove);

        return () => {
            console.log(2);
            cancelAnimationFrame(frameId);
            observer.disconnect();
            container.removeEventListener('pointermove', onPointerMove);
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <StyledPageHomeGL ref={containerRef} />;
};
