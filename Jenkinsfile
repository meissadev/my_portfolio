pipeline {
    agent {
        label "linux"
    }
    tools {
        nodejs "Node-24"
    }
    environment {
        DOCKERHUB_CREDENTIAL = ("dockerhub-creds")
        DOCKERHUB_USER       = "meissadev"
        BACKEND_IMAGE        = "${DOCKERHUB_USER}/backend-portfolio"
        FRONTEND_IMAGE       = "${DOCKERHUB_USER}/frontend-portfolio"
        IMAGE_TAG            = "${GIT_COMMIT[0..6]}"
    }
    stages {
        stage ("Checkout") {
            steps {
                checkout scm
            }
        }
        stage ("Lint du code front, backend et des images docker") {
            steps {
                dir ("backend") {
                    echo "Execution des lint du code backend"
                    sh "npm i"
                    sh "npm run lint"
                    echo "Test du Dockerfile"
                    sh "docker build --check ."
                }
                
                dir ("frontend") {
                    echo "Execution des tests du code frontend"
                    sh "npm i"
                    sh "npm run lint"
                    echo "Test du Dockerfile"
                    sh "docker build --check ."
                }
            }
        }
        stage ("Tests de securite et scan") {
            steps {
                echo "Execution des tests de securite"
            }
        }
        stage ("Tests unitaires") {
            steps {
                echo "Execution des tests unitaires"
            }
        }
        stage ("Build des images") {
            when {
                branch 'main'
            }
            environment {
                NODE_ENV  = "production"
            }
            steps {
                echo "Building images !"
                echo "<<<<<<==========Build de l'image Backend"
                sh """
                    docker build \
                        --build-arg NODE_ENV=${NODE_ENV} \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend
                """
                echo "<<<<<<==========Build de l'image frontend"
                sh """
                    docker build \
                        --build-arg NODE_ENV=${NODE_ENV} \
                        --build-arg VITE_API_URL=${env.VITE_API_URL} \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend
                """
                echo "<<<<<<==========Verification des images"
                sh "docker image ls"
            }
        }

        // ─── PUSH ───────────────────────────────────────────────────────
        stage ("Push des images") {
            // when {
            //     branch 'main'
            // }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKERHUB_CREDENTIAL}",
                    usernameVariable: 'DOCKERHUB_CREDENTIALS_USR',
                    passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW'
                )]) {
                    // sh "echo ${DOCKERHUB_CREDENTIALS_USR} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                    sh """
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
        // ────────────────────────────────────────────────────────────────

        stage ("Deploiement") {
            when {
                branch 'main'
            }
            steps {
                sh """
                    docker compose up -d --remove-orphans &&
                    docker image prune -f
                """
            }
        }
    }
    post {
        success {
            echo "✅ Pipeline terminé — image taguée : ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline échoué — vérifier les logs"
        }
        always {
            sh "docker logout || true"
            cleanWs()
        }
    }
}
