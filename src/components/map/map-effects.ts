import {
  LightingEffect,
  AmbientLight,
  PointLight,
  DirectionalLight,
} from "@deck.gl/core/typed";
import { vignette } from "@luma.gl/shadertools";
import { PostProcessEffect } from "@deck.gl/core/typed";

const postProcessEffect = new PostProcessEffect(vignette, {
  radius: 0.5,
  amount: 0.5,
});

const ambientLight = new AmbientLight({
  color: [240, 204, 221],
  intensity: 1,
});

const pointLight = new PointLight({
  color: [240, 204, 221],
  intensity: 1.0,
  position: [24.9, 60.4, 7000],
});

const directionalLight = new DirectionalLight({
  color: [240, 204, 221],
  intensity: 1,
  direction: [24.9, 60.4, -100],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight,
  directionalLight,
});

export const mapEffects = [lightingEffect, postProcessEffect];
