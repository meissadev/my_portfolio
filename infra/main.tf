# 1. Namespace
resource "kubernetes_namespace" "portfolio" {
  metadata {
    name = "portfolio"
  }
}

# 2. Secret Docker Hub
resource "kubernetes_secret" "docker_hub" {
  metadata {
    name      = "docker-hub-secret"
    namespace = kubernetes_namespace.portfolio.metadata[0].name
  }

  type = "kubernetes.io/dockerconfigjson"

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        "https://index.docker.io/v1/" = {
          username = var.docker_hub_user
          password = var.docker_hub_token
          auth     = base64encode("${var.docker_hub_user}:${var.docker_hub_token}")
        }
      }
    })
  }
}

# 3. Secret MongoDB
resource "kubernetes_secret" "mongo" {
  metadata {
    name      = "mongo-secret"
    namespace = kubernetes_namespace.portfolio.metadata[0].name
  }

  data = {
    MONGO_URI = var.mongo_uri
  }
}

# 4. ConfigMap
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.portfolio.metadata[0].name
  }

  data = {
    VITE_API_URL = var.vite_api_url
    CORS_ORIGIN  = var.cors_origin
    PORT         = var.port
  }
}