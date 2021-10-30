#version 330 core

out vec4 FragColor;

struct Material {
  // vec3 specular;
  // vec3 diffuse;
  sampler2D diffuseMap;
  sampler2D specularMap;
  float shininess;
};


struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;

uniform Material material;
uniform Light light;

uniform float elapsed;
uniform vec3 viewPos;

void main() {
    // diffuse
    vec3 n = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float diffuseAmount = max(dot(n, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diffuseAmount * vec3(texture(material.diffuseMap, TexCoords));
    
    // specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, n);
    float specularAmount = pow(max(dot(viewDir, reflectDir), 0.0), 32);

    vec3 specular = specularAmount * vec3(texture(material.specularMap, TexCoords));
    vec3 ambient = light.ambient * vec3(texture(material.diffuseMap, TexCoords));
    FragColor = vec4(ambient + diffuse + specular, 1.0);
    
};