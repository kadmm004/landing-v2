import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarGLItemBase } from './AvatarGLItemBase';
export class AvatarGLItemCartoon extends AvatarGLItemBase {
    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>Server DevOps</div>
            <div className='avatar-extra-subtitle'>Data Analytics</div>
            <div className='avatar-extra-subtitle'>Community / Social</div>
        </>
    );

    load() {
        if (this.loaded || this.loading) {
            return;
        }
        this.loading = true;
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-cartoon.glb'),
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -3.18, 0);
                model.scale.set(3.5, 3.5, 3.5);
                this.scene.add(model);
                this.mixer = new THREE.AnimationMixer(model);
                this.loaded = true;
                this.loading = false;
                this.render();
                loadingEE.emit(
                    `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON}`,
                    1
                );
            },
            (event) => {
                loadingEE.emit(
                    `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON}`,
                    event.total ? (event.loaded / event.total) * 0.95 : 0.5
                );
            }
        );
    }
}
