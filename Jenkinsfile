pipeline {
    agents {
        label "linux"
    }

    stages {
        stage ("Checkout") {
            steps {
                checkout scm
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