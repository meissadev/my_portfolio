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

        // ── STAGE BUILD ───────────────────────────────────────────────────────
        stage('Build') {
            environment {
                NODE_ENV = 'production'
            }
            steps {
                // docker login via Jenkins credentials
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', 
                                                    usernameVariable: 'DOCKER_HUB_USER', 
                                                    passwordVariable: 'DOCKER_HUB_TOKEN')]) {
                    sh 'echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin'

                    sh """
                        docker build \\
                            --build-arg NODE_ENV=${NODE_ENV} \\
                            --build-arg VITE_API_URL=${VITE_API_URL} \\
                            -t "\${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest" \\
                            frontend
                    """
                    sh """
                        docker build \\
                            --build-arg NODE_ENV=${NODE_ENV} \\
                            -t "\${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest" \\
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
                // Générer le fichier .env
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

                    sh 'docker compose down -v --remove-orphans'
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