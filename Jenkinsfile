pipeline {
    agent {
        label 'linux'
    }

    environment {
        FRONTEND_IMAGE = "portfolio-app"
        BACKEND_IMAGE  = "portfolio-server"
        VITE_API_URL   = "http://192.168.60.128/api"
        CORS_ORIGIN    = "http://192.168.60.128"
        PORT           = "5000"
        SONAR_HOST_URL = "http://192.168.60.128:9000"   // ← URL de ton SonarQube
    }

    tools {
        nodejs "Node-24"
    }

    stages {

        // ── STAGE LINT ────────────────────────────────────────────────────────
        stage('Lint') {
            parallel {
                stage('lint:code') {
                    steps {
                        sh 'npm install --prefix frontend && npm run lint --prefix frontend'
                        sh 'npm install --prefix backend  && npm run lint --prefix backend'
                    }
                }

                stage('lint:dockerfile') {
                    steps {
                        sh 'docker build --check frontend'
                        sh 'docker build --check backend'
                    }
                }
            }
        }

        // ── STAGE SONARQUBE ───────────────────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token',
                                            variable: 'SONAR_TOKEN')]) {
                        sh """
                            ${tool 'SonarScanner'}/bin/sonar-scanner \
                                -Dsonar.projectKey=portfolio \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.token=${SONAR_TOKEN}
                        """
                        // les autres paramètres sont lus depuis sonar-project.properties
                    }
                }
            }
        }

        // ── STAGE QUALITY GATE ────────────────────────────────────────────────
        // SonarQube analyse en asynchrone → on attend le résultat ici
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    // Attend que SonarQube renvoie "OK" ou "ERROR"
                    waitForQualityGate abortPipeline: true
                    // abortPipeline: true  → le pipeline ÉCHOUE si Quality Gate = ERROR
                    // abortPipeline: false → le pipeline CONTINUE même si Quality Gate = ERROR
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

        // ── STAGE TEST ────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                echo 'Exécution des tests...'
            }
        }

        // ── STAGE DEPLOY ──────────────────────────────────────────────────────
        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                    usernameVariable: 'DOCKER_HUB_USER',
                                                    passwordVariable: 'DOCKER_HUB_TOKEN')]) {
                    sh 'echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin'

                    sh """
                        echo "FRONTEND_IMAGE=${FRONTEND_IMAGE}" >  .env
                        echo "BACKEND_IMAGE=${BACKEND_IMAGE}"   >> .env
                        echo "VITE_API_URL=${VITE_API_URL}"     >> .env
                        echo "CORS_ORIGIN=${CORS_ORIGIN}"       >> .env
                        echo "PORT=${PORT}"                     >> .env
                        echo "MONGO_URI=${env.MONGO_URI}"          >> .env
                        echo "DOCKER_HUB_USER=${DOCKER_HUB_USER}" >> .env
                    """

                    sh 'docker compose down -v'
                    sh 'docker compose up -d --remove-orphans'
                    sh 'docker image prune -f'
                    sh 'sleep 10'
                    sh 'docker ps'
                }
            }

            post {
                always {
                    sh 'rm -f .env || true'
                    sh 'docker logout || true'
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
        }
    }
}