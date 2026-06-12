variable "kubeconfig_path" {
  description = "Chemin vers le fichier kubeconfig"
  type        = string
  default     = "~/.kube/config"
}

variable "docker_hub_user" {
  description = "Nom d'utilisateur Docker Hub"
  type        = string
}

variable "docker_hub_token" {
  description = "Token/mot de passe Docker Hub"
  type        = string
  sensitive   = true
}

variable "mongo_uri" {
  description = "URI de connexion MongoDB"
  type        = string
  sensitive   = true
}

variable "vite_api_url" {
  description = "URL de l'API utilisée par le frontend (build-time)"
  type        = string
}

variable "cors_origin" {
  description = "Origine autorisée pour CORS sur le backend"
  type        = string
}

variable "port" {
  description = "Port d'écoute du backend"
  type        = string
  default     = "5000"
}

variable "namespace" {
  description = "Namespace Kubernetes cible"
  type        = string
  default     = "portfolio"
}
