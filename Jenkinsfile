pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "portfolio-app"
        BACKEND_IMAGE  = "portfolio-server"
        VITE_API_URL   = "http://192.168.49.2:32002/api"   // ← IP Minikube
        CORS_ORIGIN    = "http://192.168.49.2:32003"        // ← IP Minikube
        PORT           = "5000"
    }

    stages {
        stage('Test') {
            steps {
                echo 'Exécution des tests...'
            }
        }

        // ── STAGE SONARQUBE ───────────────────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                                 // Supprimer node_modules pour éviter OOMKill pendant le scan
                // sh 'rm -rf frontend/node_modules backend/node_modules
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token',
                                            variable: 'SONAR_TOKEN')]) {
                        sh """
                            ${tool 'SonarScanner'}/bin/sonar-scanner \
                                -Dsonar.javascript.node.maxspace=1024 \
                                -Dsonar.projectKey=portfolio \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.token=${SONAR_TOKEN}
                        """
                        // les autres paramètres sont lus depuis sonar-project.properties
                    }
                }
            }
        }

        // ── STAGE BUILD ───────────────────────────────────────────────────────
        stage('Build') {
            environment {
                NODE_ENV = 'production'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                    usernameVariable: 'DOCKER_HUB_USER',
                                                    passwordVariable: 'DOCKER_HUB_TOKEN')]) {
                    sh 'echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin'

                    sh """
                        docker build \
                            --build-arg NODE_ENV=${NODE_ENV} \
                            --build-arg VITE_API_URL=${VITE_API_URL} \
                            -t "\${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest" \
                            frontend
                    """
                    sh """
                        docker build \
                            --build-arg NODE_ENV=${NODE_ENV} \
                            -t "\${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest" \
                            backend
                    """
                    sh 'docker push "${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"'
                    sh 'docker push "${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest"'
                }
            }
            post {
                always {
                    sh 'docker logout || true'
                }
            }
        }

        // stage('Deploy to Minikube') {
        //     steps {
        //         withCredentials([
        //             usernamePassword(credentialsId: 'dockerhub-creds',
        //                             usernameVariable: 'DOCKER_HUB_USER',
        //                             passwordVariable: 'DOCKER_HUB_TOKEN'),
        //             string(credentialsId: 'mongodb_uri',
        //                    variable: 'MONGO_URI')
        //         ]) {
        //             // ── 1. Namespace ─────────────────────────────────────────────
        //             sh '''
        //                 kubectl get namespace portfolio \
        //                   || kubectl create namespace portfolio
        //             '''

        //             // ── 2. Secret Docker Hub ─────────────────────────────────────
        //             sh """
        //                 kubectl create secret docker-registry docker-hub-secret \
        //                     --docker-username=${DOCKER_HUB_USER} \
        //                     --docker-password=${DOCKER_HUB_TOKEN} \
        //                     --docker-server=https://index.docker.io/v1/ \
        //                     -n portfolio \
        //                     --dry-run=client -o yaml | kubectl apply -f -
        //             """

        //             // ── 3. Secret MongoDB ────────────────────────────────────────
        //             sh """
        //                 kubectl create secret generic mongo-secret \
        //                     --from-literal=MONGO_URI=${MONGO_URI} \
        //                     -n portfolio \
        //                     --dry-run=client -o yaml | kubectl apply -f -
        //             """

        //             // ── 4. ConfigMap ─────────────────────────────────────────────
        //             sh """
        //                 kubectl create configmap app-config \
        //                     --from-literal=VITE_API_URL=${VITE_API_URL} \
        //                     --from-literal=CORS_ORIGIN=${CORS_ORIGIN} \
        //                     --from-literal=PORT=${PORT} \
        //                     -n portfolio \
        //                     --dry-run=client -o yaml | kubectl apply -f -
        //             """

        //            // ── 5. Appliquer les manifests ───────────────────────────────
        //             sh """
        //                 export DOCKER_HUB_USER=${DOCKER_HUB_USER}
        //                 for f in k8s/*.yaml; do
        //                     envsubst < \$f | kubectl apply -f - -n portfolio
        //                 done
        //             """
                    
        //             // ── 6. Attendre la propagation des secrets puis redémarrer ───
        //             sh '''
        //                 sleep 30
        //                 kubectl rollout restart deployment/backend  -n portfolio
        //                 kubectl rollout restart deployment/frontend -n portfolio
        //             '''

        //             // ── 7. Attendre que tout soit prêt ───────────────────────────
        //             sh 'kubectl rollout status deployment/frontend -n portfolio'
        //             sh 'kubectl rollout status deployment/backend  -n portfolio'

        //             // ── 8. Vérification finale ───────────────────────────────────
        //             sh 'kubectl get pods -n portfolio'
        //             sh 'kubectl get svc  -n portfolio'

        //             // ── 8. Re-forward des ports ──────────────────────────────────
        //             // sh '''
        //             //     pkill -u jenkins -f "port-forward" || true
        //             //     sleep 2
        //             //     kubectl port-forward svc/frontend 32003:80   -n portfolio --address=0.0.0.0 > /var/lib/jenkins/pf-frontend.log 2>&1 &
        //             //     kubectl port-forward svc/backend  32002:5000 -n portfolio --address=0.0.0.0 > /var/lib/jenkins/pf-backend.log  2>&1 &
        //             //     echo "Port-forwards relancés"
        //             // '''
        //         }
        //     }
        // }
    }

    post {
        always {
            emailext(
                subject: "[Jenkins] ${currentBuild.currentResult} — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Pipeline: ${env.JOB_NAME}
                Build: #${env.BUILD_NUMBER}
                Status: ${currentBuild.currentResult}
                Duration: ${currentBuild.durationString}
                Branch: ${env.GIT_BRANCH}
                Commit: ${env.GIT_COMMIT}
                Logs: ${env.BUILD_URL}console""",
                            mimeType: 'text/plain',
                            to: 'meissababou66@gmail.com'
                        )
        }
        failure {
            emailext(
                subject: "FAILED — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Le pipeline a echoue.
                Job: ${env.JOB_NAME}
                Build: #${env.BUILD_NUMBER}
                Logs: ${env.BUILD_URL}console""",
                            mimeType: 'text/plain',
                            to: 'meissababou66@gmail.com'
                        )
            sh '''
                kubectl rollout undo deployment/frontend -n portfolio || true
                kubectl rollout undo deployment/backend  -n portfolio || true
            '''
        }
    }
}
