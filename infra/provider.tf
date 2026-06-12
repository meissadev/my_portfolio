terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "~> 3.1"
    }
  }
  backend "kubernetes" {
    secret_suffix = "portfolio-state"
    namespace     = "devops-tools"
    config_path   = "~/.kube/config"
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}