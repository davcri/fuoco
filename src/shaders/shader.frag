#version 330 core

out vec4 FragColor;

struct Material {
  // vec3 specular;
  // vec3 diffuse;
  sampler2D diffuseMap;
  sampler2D specularMap;
  sampler2D emissionMap;
  float shininess;
};

struct Light {
    vec3 position;
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;

    float cutoff;
    float outerCutoff;
};

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;

uniform Material material;
uniform Light light;

uniform float elapsed;
uniform vec3 viewPos;

void main() {
    vec3 outCol;
    vec3 lightDir = normalize(light.position - FragPos);
    // diffuse
    vec3 n = normalize(Normal);
    float theta = dot(lightDir, normalize(-light.direction));
    float epsilon = light.cutoff - light.outerCutoff;
    float intensity = clamp(-(theta - light.outerCutoff) / epsilon, 0.0, 1.0);
    float distance = length(light.position - FragPos);
    // inside the spotlight cone
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * pow(distance, 2));
    float diffuseAmount = max(dot(n, lightDir), 0.0);
    vec3 diffuse = intensity * attenuation * (light.diffuse * diffuseAmount * vec3(texture(material.diffuseMap, TexCoords)));
    // specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, n);
    float specularAmount = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specularIntensityFromTexture = vec3(texture(material.specularMap, TexCoords));
    vec3 specular = intensity * attenuation * (specularAmount * vec3(TexCoords, 0.0) * specularIntensityFromTexture);
    // ambient
    vec3 ambient = attenuation * light.ambient * vec3(texture(material.diffuseMap, TexCoords));
    // emission
    // vec3 emission = vec3(texture(material.emissionMap, TexCoords));
    outCol = ambient + specular + diffuse;
    FragColor = vec4(outCol, 1.0);
};