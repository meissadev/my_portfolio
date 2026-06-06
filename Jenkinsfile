pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "portfolio-app"
        BACKEND_IMAGE  = "portfolio-server"
        VITE_API_URL   = "http://192.168.200.130:32002/api"
        CORS_ORIGIN    = "http://192.168.200.130:32003"
        PORT           = "5000"
    }

    stages {
        stage('Test') {
            steps {
                echo 'Exécution des tests...'
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-creds',
                                    usernameVariable: 'DOCKER_HUB_USER',
                                    passwordVariable: 'DOCKER_HUB_TOKEN'),
                    string(credentialsId: 'mongo_uri',
                           variable: 'MONGO_URI')
                ]) {
                    // ── 1. Namespace ─────────────────────────────────────────────
                    sh '''
                        kubectl get namespace portfolio \
                          || kubectl create namespace portfolio
                    '''

                    // ── 2. Secret Docker Hub ─────────────────────────────────────
                    sh """
                        kubectl create secret docker-registry docker-hub-secret \
                            --docker-username=${DOCKER_HUB_USER} \
                            --docker-password=${DOCKER_HUB_TOKEN} \
                            --docker-server=https://index.docker.io/v1/ \
                            -n portfolio \
                            --dry-run=client -o yaml | kubectl apply -f -
                    """

                    // ── 3. Secret MongoDB ────────────────────────────────────────
                    sh """
                        kubectl create secret generic mongo-secret \
                            --from-literal=MONGO_URI=${MONGO_URI} \
                            -n portfolio \
                            --dry-run=client -o yaml | kubectl apply -f -
                    """

                    // ── 4. ConfigMap ─────────────────────────────────────────────
                    sh """
                        kubectl create configmap app-config \
                            --from-literal=VITE_API_URL=${VITE_API_URL} \
                            --from-literal=CORS_ORIGIN=${CORS_ORIGIN} \
                            --from-literal=PORT=${PORT} \
                            -n portfolio \
                            --dry-run=client -o yaml | kubectl apply -f -
                    """

                    // ── 5. Appliquer les manifests ───────────────────────────────
                    sh 'kubectl apply -f k8s/ -n portfolio'

                    // ── 6. Forcer le re-pull des images :latest ──────────────────
                    sh """
                        kubectl rollout restart deployment/frontend -n portfolio
                        kubectl rollout restart deployment/backend  -n portfolio
                    """

                    // ── 7. Attendre que tout soit prêt ───────────────────────────
                    sh 'kubectl rollout status deployment/frontend -n portfolio'
                    sh 'kubectl rollout status deployment/backend  -n portfolio'

                    // ── 8. Vérification finale ───────────────────────────────────
                    sh 'kubectl get pods -n portfolio'
                    sh 'kubectl get svc  -n portfolio'
                }
            }
        }
    }

    post {
        failure {
            sh '''
                kubectl rollout undo deployment/frontend -n portfolio || true
                kubectl rollout undo deployment/backend  -n portfolio || true
            '''
        }
    }
}