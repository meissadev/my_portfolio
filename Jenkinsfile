pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: jenkins-test
spec:
  serviceAccountName: jenkins-agent
  nodeSelector:
    kubernetes.io/hostname: worker-2
  containers:
  - name: maven
    image: maven:3.8.1-openjdk-11
    command: [cat]
    tty: true
  - name: kubectl
    image: alpine/k8s:1.27.3
    command: [cat]
    tty: true
  - name: docker
    image: docker:24-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
  - name: docker-client
    image: docker:24-cli
    command: [cat]
    tty: true
    env:
    - name: DOCKER_HOST
      value: tcp://localhost:2375
'''
        }
    }

    environment {
        FRONTEND_IMAGE = "portfolio-app"
        BACKEND_IMAGE  = "portfolio-server"
        VITE_API_URL   = "http://192.168.137.188:32002/api"
        CORS_ORIGIN    = "http://192.168.137.188:32003"
        PORT           = "5000"
        SONAR_HOST_URL = "http://sonarqube-sonarqube.devops-tools.svc.cluster.local:9000"
    }

    tools {
        nodejs "Node-24"
    }

    stages {

        stage('Test') {
            steps {
                echo 'Exécution des tests....'
            }
        }

        stage('Deploy') {
            steps {
                container('kubectl') {
                    withCredentials([
                        usernamePassword(credentialsId: 'docker-creds',
                                        usernameVariable: 'DOCKER_HUB_USER',
                                        passwordVariable: 'DOCKER_HUB_TOKEN')
                    ]) {
                        sh 'envsubst --version || echo "envsubst NON DISPONIBLE"'

                        // ── 1. Secret Docker Hub ─────────────────────────────
                        sh """
                            kubectl create secret docker-registry docker-hub-secret \
                                --docker-username=${DOCKER_HUB_USER} \
                                --docker-password=${DOCKER_HUB_TOKEN} \
                                --docker-server=https://index.docker.io/v1/ \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 2. Secret MongoDB ────────────────────────────────
                        sh """
                            kubectl create secret generic mongo-secret \
                                --from-literal=MONGO_URI=${env.MONGO_URI} \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 3. ConfigMap ─────────────────────────────────────
                        sh """
                            kubectl create configmap app-config \
                                --from-literal=VITE_API_URL=${VITE_API_URL} \
                                --from-literal=CORS_ORIGIN=${CORS_ORIGIN} \
                                --from-literal=PORT=${PORT} \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 4. Apply avec substitution des variables ──────────
                        sh """
                            export DOCKER_HUB_USER=${DOCKER_HUB_USER}

                            for f in k8s/*.yaml; do
                                envsubst < "\$f" | kubectl apply -f - -n default
                            done
                        """

                        // ── 5. Rollout status ─────────────────────────────────
                        sh 'kubectl rollout status deployment/frontend -n default --timeout=120s'
                        sh 'kubectl rollout status deployment/backend  -n default --timeout=120s'

                        // ── 6. Vérification finale ────────────────────────────
                        sh 'kubectl get pods -n default'
                        sh 'kubectl get svc  -n default'
                    }
                }
            }

            post {
                failure {
                    container('kubectl') {
                        sh '''
                            echo "===== PODS ====="
                            kubectl get pods -n default -o wide

                            echo "===== EVENTS ====="
                            kubectl get events -n default --sort-by=.lastTimestamp

                            echo "===== DESCRIBE FRONTEND ====="
                            kubectl describe deployment frontend -n default || true

                            echo "===== DESCRIBE BACKEND ====="
                            kubectl describe deployment backend -n default || true

                            echo "===== LOGS FRONTEND ====="
                            POD=$(kubectl get pods -n default -l io.kompose.service=frontend \
                                --sort-by=.metadata.creationTimestamp \
                                -o jsonpath="{.items[-1].metadata.name}" 2>/dev/null)
                            [ -n "$POD" ] && kubectl logs "$POD" -n default --tail=50 \
                                          || echo "Aucun pod frontend trouvé"

                            echo "===== LOGS BACKEND ====="
                            POD=$(kubectl get pods -n default -l io.kompose.service=backend \
                                --sort-by=.metadata.creationTimestamp \
                                -o jsonpath="{.items[-1].metadata.name}" 2>/dev/null)
                            [ -n "$POD" ] && kubectl logs "$POD" -n default --tail=50 \
                                          || echo "Aucun pod backend trouvé"

                            echo "===== PVC ====="
                            kubectl get pvc -n default

                            echo "===== SECRETS & CONFIGMAP ====="
                            kubectl get secrets,configmap -n default

                            echo "===== ROLLBACK ====="
                            kubectl rollout undo deployment/frontend -n default 2>/dev/null || true
                            kubectl rollout undo deployment/backend  -n default 2>/dev/null || true
                        '''
                    }
                }
            }
        }

    }  // ← fermeture stages
}      // ← fermeture pipeline