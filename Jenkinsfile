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

        stage('Deploy to Minikube') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-creds',
                                    usernameVariable: 'DOCKER_HUB_USER',
                                    passwordVariable: 'DOCKER_HUB_TOKEN'),
                    string(credentialsId: 'mongodb_uri',
                        variable: 'MONGO_URI')
                ]) {
                    sh '''
cat > infra/secrets.auto.tfvars << EOT
docker_hub_user  = "${DOCKER_HUB_USER}"
docker_hub_token = "${DOCKER_HUB_TOKEN}"
mongo_uri        = "${MONGO_URI}"
vite_api_url     = "${VITE_API_URL}"
cors_origin      = "${CORS_ORIGIN}"
EOT
cd infra
kubectl get namespace devops-tools || kubectl create namespace devops-tools
terraform init -input=false

terraform apply -auto-approve -var-file=secrets.auto.tfvars
rm -f secrets.auto.tfvars
                    '''
//                     terraform import kubernetes_namespace.portfolio portfolio
// terraform import kubernetes_secret.docker_hub portfolio/docker-hub-secret
// terraform import kubernetes_secret.mongo portfolio/mongo-secret
// terraform import kubernetes_config_map.app_config portfolio/app-config
                }
            }
        }
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
