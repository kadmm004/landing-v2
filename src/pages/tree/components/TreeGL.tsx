/* eslint-disable */
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getPublicAssetPath, IS_MOBILE } from '../../../utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PageType } from '../../app/App.config';
import {
    AppContext,
    loadingEE,
    LoadingSourceType,
    usePageVisible,
} from '../../app/App.utils';
import './TreeGL.less';

export const TreeGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    usePageVisible(PageType.Tree, () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const clock = new THREE.Clock();
        let mixer: THREE.AnimationMixer;
        let frameId: number;
        let loaded = false;
        let loading = false;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);
        // 初始化场景
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        camera.position.set(5, 2, 8);
        camera.lookAt(0, 0, 0);
        const controls = new OrbitControls(camera, container);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;

        const loader = new GLTFLoader();
        loader.load(
            getPublicAssetPath('files/tree/ThirdPersonExampleMap.gltf'), (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(1, 1, 1);
                scene.add(model);
                mixer = new THREE.AnimationMixer(model);
                loaded = true;
                loadingEE.emit(
                    `progress.${LoadingSourceType.TREE_MODEL}`,
                    1
                );
            }, function (xhr) {
                const loaded = xhr.loaded;
                const total = xhr.total;
                const percent = (loaded / total);

            }, function (e) {

                console.error(e);

            })

        // function load() {
        //     if (loaded || loading) {
        //         return;
        //     }
        //     loading = true;
        //     container?.classList.add('app-container-loading');
        //     container?.classList.add('loading');

        // }

        function animate() {
            frameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            mixer.update(delta);
            renderer.render(scene, camera);
            controls.update();
        }

        window.onresize = function () {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        };

        /** 首页loading结束后，再开始loading */
        // loadingEE.on('loaded', () => setTimeout(load, 200));

        return {
            onVisible: () => {
                // load();
                animate();
            },
            onHide: () => {
                cancelAnimationFrame(frameId);
            },
            onDestroy: () => { },
        };
    });

    return (
        <div className='tree-gl' ref={containerRef}>
        </div>
    );
};
