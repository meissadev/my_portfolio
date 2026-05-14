pipeline {
    agent {
        label "linux"
    }

    tools {
        nodejs "Node-24"
    }

    environment {
        DOCKERHUB_CREDENTIAL = ("e62a8a17-b1d2-4122-949b-3449fd808ae0")
    }

    stages {
        stage ("Checkout") {
            steps {
                checkout scm
            }
        }

        stage ("Lint du code front et backend") {
            steps {
                dir ("backend") {
                    echo "Execution des tests du code frontend"
                    sh "npm i"
                    sh "npm run lint"
                }
                
                dir ("frontend") {
                    echo "Execution des tests du code frontend"
                    sh "npm i"
                    sh "npm run lint"
                }
            }
        }

        stage ("Build des images") {
            steps {
                echo "Building images !"
            }
        }

        stage ("Test du code") {
            steps {
                echo "Testing the code"
            }
        }
    }
}