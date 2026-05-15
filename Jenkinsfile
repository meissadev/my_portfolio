pipeline {
    agent {
        label "linux"
    }

    tools {
        nodejs "Node-24"
    }

    environment {
        DOCKERHUB_CREDENTIAL = ("e62a8a17-b1d2-4122-949b-3449fd808ae0")
        DOCKERHUB_USER       = "meissadev"

        BACKEND_IMAGE        = "${DOCKERHUB_USER}/backend-portfolio"
        FRONTEND_IMAGE       = "${DOCKERHUB_USER}/frontend-portfolio"
        IMAGE_TAG            = "${GIT_COMMIT[0..6]}"

        // NODE_ENV             = "production"
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
                    echo "Execution des lint du code frontend"
                    sh "npm i"
                    sh "npm run lint"
                    echo "Test du Dockerfile"
                    sh "docker build --check ."
                }
                
        //         dir ("frontend") {
        //             echo "Execution des tests du code frontend"
        //             sh "npm i"
        //             sh "npm run lint"
        //             echo "Test du Dockerfile"
        //             sh "docker build --check ."
        //         }
            }
        }

        stage ("Build des images") {
            steps {
                echo "Building images !"
                echo "${IMAGE_TAG}"
            }
        }

        stage ("Test du code") {
            steps {
                echo "Testing the code"
            }
        }
    }
}