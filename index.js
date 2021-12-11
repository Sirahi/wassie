import * as THREE from 'three';
import metaversefile from 'metaversefile';
const { useApp, useScene } = metaversefile;

export default e => {
  const app = useApp();
  const scene = useScene();
  app.name = 'Sunnan';

  const worker = new Worker('https://sirahi.github.io/wassie/testWorker.js');

  worker.postMessage("HELLO");

  worker.addEventListener('message', e => {
    console.log("WORKING MAIN");
  })

  worker.terminate();

  {
    const texture = new THREE.Texture();
    // const geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);
    const uniforms = {
      map: {
        type: 't',
        value: texture,
        needsUpdate: true,
      }
    };
    const vertexShader = `
        ${THREE.ShaderChunk.common}
            precision highp float;
            precision highp int;

            varying vec2 vUv;

            ${THREE.ShaderChunk.logdepthbuf_pars_vertex}

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                vUv = uv;

            ${THREE.ShaderChunk.logdepthbuf_vertex}
            }
        `

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: `
                precision highp float;
                precision highp int;

                uniform sampler2D map;

                varying vec2 vUv;

                ${THREE.ShaderChunk.logdepthbuf_pars_fragment}

                void main() {
                    // gl_FragColor = texture(map, vUv);
                    // if(gl_FragColor.a < 0.1) {
                    //     discard;
                    // }
                    gl_FragColor.rgb = vec3(0., 1., 0.);
                    gl_FragColor.a = 1.0;

                ${THREE.ShaderChunk.logdepthbuf_fragment}
                }
            `,
      transparent: false,
      side: THREE.DoubleSide
    });

    const imageMesh = new THREE.Mesh(geometry, material);
    imageMesh.position.set(0, 0.5, 2);

    const materialBack = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: `
                precision highp float;
                precision highp int;

                uniform sampler2D map;

                varying vec2 vUv;

                void main() {
                    // gl_FragColor = texture(map, vUv);
                    // if(gl_FragColor.a < 0.1) {
                    //     discard;
                    // }
                    gl_FragColor.rgb = vec3(1., 0., 0.);
                    gl_FragColor.a = 1.0;
                }
            `,
      transparent: false,
      side: THREE.FrontSide
    });

    const imageMeshBack = new THREE.Mesh(geometry, materialBack);
    // imageMesh.add(imageMeshBack);

    app.add(imageMesh);

    // (async () => {
    //     const img = new Image();
    //     await new Promise((accept, reject) => {
    //         img.onload = accept;
    //         img.onerror = reject;
    //         img.crossOrigin = 'Aynonymous';
    //         img.src = './scenes/wassie/test1.png';
    //     });

    //     const canvas = document.createElement('canvas');
    //     canvas.width = img.naturalWidth;
    //     canvas.height = img.naturalHeight;
    //     const ctx = canvas.getContext('2d');
    //     ctx.drawImage(img, 0, 0);
    //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     const queue = [
    //         [0, 0],
    //         [canvas.width - 1, 0],
    //         [0, canvas.height - 1],
    //         [canvas.width - 1, canvas.height - 1],
    //     ];
    //     const seen = {};
    //     const _getKey = (x, y) => x + ':' + y;
    //     while (queue.length > 0) {
    //         const [x, y] = queue.pop();
    //         const k = _getKey(x, y);
    //         if (!seen[k]) {
    //             seen[k] = true;

    //             const startIndex = y * imageData.width * 4 + x * 4;
    //             const endIndex = startIndex + 4;
    //             const [r, g, b, a] = imageData.data.slice(startIndex, endIndex);
    //             if (r < 255 / 8 && g < 255 / 8 && b < 255 / 8) {
    //                 // nothing
    //             } else {
    //                 imageData.data[startIndex] = 0;
    //                 imageData.data[startIndex + 1] = 0;
    //                 imageData.data[startIndex + 2] = 0;
    //                 imageData.data[startIndex + 3] = 0;

    //                 const _tryQueue = (x, y) => {
    //                     if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
    //                         const k = _getKey(x, y);
    //                         if (!seen[k]) {
    //                             queue.push([x, y]);
    //                         }
    //                     }
    //                 };
    //                 _tryQueue(x - 1, y - 1);
    //                 _tryQueue(x, y - 1);
    //                 _tryQueue(x + 1, y - 1);

    //                 _tryQueue(x - 1, y);
    //                 _tryQueue(x, y);
    //                 _tryQueue(x + 1, y);

    //                 _tryQueue(x - 1, y + 1);
    //                 _tryQueue(x, y + 1);
    //                 _tryQueue(x + 1, y + 1);
    //             }
    //         }
    //     }
    //     ctx.putImageData(imageData, 0, 0);

    //     texture.image = canvas;
    //     texture.needsUpdate = true;
    //     imageMesh.material.uniforms.map.needsUpdate = true;
    // })();
  }

  return app;
}