/**
 * THREE.JS ShaderMaterial that removes a specified color (e.g. greens screen)
 * from a texture. Shader code by https://github.com/Mugen87 on THREE.js forum:
 * https://discourse.threejs.org/t/production-ready-green-screen-with-three-js/23113/2
 */
// import {ColorRepresentation} from 'three/src/utils';

import * as THREE from 'three';

import {VERTEX_SHADER, FRAGMENT_SHADER} from './shadersGrayscale';

class ChromaKeyMaterial extends THREE.ShaderMaterial {
  /**
   *
   * @param {string} url Image or video to load into material's texture
   * @param {ColorRepresentation} keyColor
   * @param {number} width
   * @param {number} height
   * @param {number} similarity
   * @param {number} smoothness
   * @param {number} spill
   * @param {number} grayscale
   */
  constructor(
    url, keyColor, width, height, similarity = 0.01, smoothness = 0.18,
    spill = 0.1, grayscale = 0.0
  ) {
    super()

    this.url = url
    this.isVideo = /\.(mp4|mov|webm)/.test(this.url)
    if (this.isVideo) {
      this.video = document.createElement('video')
      this.video.src = url
      this.video.muted = true
      //this.video.loop = true
      this.video.setAttribute('playsinline', '')
      this.video.load()
      this.video.play()

      this.texture = new THREE.VideoTexture(this.video)
    } else {
      this.texture = new THREE.TextureLoader().load(url)
    }

    const chromaKeyColor = new THREE.Color(keyColor)

    this.setValues({
      uniforms: {
        tex: {
          value: this.texture,
        },
        keyColor: {value: chromaKeyColor},
        texWidth: {value: width},
        texHeight: {value: height},
        similarity: {value: similarity},
        smoothness: {value: smoothness},
        spill: {value: spill},
        grayscale: {value: grayscale}

      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
    })
  }

  playVideo() {
    if (this.isVideo && this.video) {
      this.video.play()
    } else {
      throw new Error(`${this.url} is not a video file.`)
    }
  }

  pauseVideo() {
    if (this.isVideo && this.video) {
      this.video.pause()
    } else {
      throw new Error(`${this.url} is not a video file.`)
    }
  }
}

export {ChromaKeyMaterial};