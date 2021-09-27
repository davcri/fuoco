#version 330 core

layout(location = 0) in vec3 aPos;
layout(location = 1) in vec2 aTexCoord;

out vec3 outCol;
out vec2 texCoord;

uniform float elapsed;

void main() {
  gl_Position = vec4(aPos, 1.0);
  outCol = gl_Position.rgb;
  texCoord = aTexCoord;
};
