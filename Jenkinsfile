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

    // stages {
    //     stage('Test de l Agent') {
    //         steps {
    //             container('maven') {
    //                 sh 'mvn --version'
    //             }
    //             container('kubectl') {
    //                 sh 'kubectl version --client'
    //                 sh 'kubectl get pods -n devops-tools -o wide'
    //             }
    //         }
    //     }

        // ── STAGE LINT  ────────────────────────────────────────────────────────
        // stage('Lint') {
        //     parallel {
        //         stage('lint:code') {
        //             steps {
        //                 sh 'npm install --prefix frontend && npm run lint --prefix frontend'
        //                 sh 'npm install --prefix backend  && npm run lint --prefix backend'
        //             }
        //         }

        //         stage('lint:dockerfile') {
        //             steps {
        //                 container('docker-client') {
        //                     sh 'docker build --check frontend'
        //                     sh 'docker build --check backend'
        //                 }
        //             }
        //         }
        //     }
        // }

        // ── STAGE SONARQUBE ───────────────────────────────────────────────────
        // stage('SonarQube Analysis') {
        //     steps {
        //                          // Supprimer node_modules pour éviter OOMKill pendant le scan
                // sh 'rm -rf frontend/node_modules backend/node_modules
        //         withSonarQubeEnv('SonarQube') {
        //             withCredentials([string(credentialsId: 'scan-jenkins',
        //                                     variable: 'SONAR_TOKEN')]) {
        //                 sh """
        //                     ${tool 'SonarScanner'}/bin/sonar-scanner \
        //                         -Dsonar.projectKey=portfolio \
        //                         -Dsonar.host.url=${SONAR_HOST_URL} \
        //                         -Dsonar.token=${SONAR_TOKEN}
        //                 """
        //                 // les autres paramètres sont lus depuis sonar-project.properties
        //             }
        //         }
        //     }
        // }

        // ── STAGE QUALITY GATE ────────────────────────────────────────────────
        // SonarQube analyse en asynchrone → on attend le résultat ici
        // stage('Quality Gate') {
        //     steps {
        //         timeout(time: 5, unit: 'MINUTES') {
        //             // Attend que SonarQube renvoie "OK" ou "ERROR"
        //             waitForQualityGate abortPipeline: true
        //             // abortPipeline: true  → le pipeline ÉCHOUE si Quality Gate = ERROR
        //             // abortPipeline: false → le pipeline CONTINUE même si Quality Gate = ERROR
        //         }
        //     }
        // }

        // ── STAGE BUILD ───────────────────────────────────────────────────────
        // stage('Build') {
        //     environment {
        //         NODE_ENV = 'production'
        //     }
        //     steps {
        //         container('docker-client') {
        //             withCredentials([usernamePassword(credentialsId: 'docker-creds',
        //                                                 usernameVariable: 'DOCKER_HUB_USER',
        //                                                 passwordVariable: 'DOCKER_HUB_TOKEN')]) {
        //                 sh 'echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin'

        //                 sh """
        //                     docker build \
        //                         --build-arg NODE_ENV=${NODE_ENV} \
        //                         --build-arg VITE_API_URL=${VITE_API_URL} \
        //                         -t "\${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest" \
        //                         frontend
        //                 """
        //                 sh """
        //                     docker build \
        //                         --build-arg NODE_ENV=${NODE_ENV} \
        //                         -t "\${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest" \
        //                         backend
        //                 """
        //                 sh 'docker push "${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"'
        //                 sh 'docker push "${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest"'
        //             }
        //         }
        //     }
        //     post {
        //         always {
        //             sh 'docker logout || true'
        //         }
        //     }
        // }

        // ── STAGE TEST ────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                echo 'Exécution des tests...'
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
                        // ── 1. Secret Docker Hub ─────────────────────────────────────
                        sh """
                            kubectl create secret docker-registry docker-hub-secret \
                                --docker-username=${DOCKER_HUB_USER} \
                                --docker-password=${DOCKER_HUB_TOKEN} \
                                --docker-server=https://index.docker.io/v1/ \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 2. Secret MongoDB ────────────────────────────────────────
                        sh """
                            kubectl create secret generic mongo-secret \
                                --from-literal=MONGO_URI=${env.MONGO_URI} \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 3. ConfigMap ─────────────────────────────────────────────
                        sh """
                            kubectl create configmap app-config \
                                --from-literal=VITE_API_URL=${VITE_API_URL} \
                                --from-literal=CORS_ORIGIN=${CORS_ORIGIN} \
                                --from-literal=PORT=${PORT} \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 4. Apply avec substitution des variables ─────────────────
                        sh """
                            export DOCKER_HUB_USER=${DOCKER_HUB_USER}

                            for f in k8s/*.yaml; do
                                envsubst < "\$f" | kubectl apply -f - -n default
                            done
                        """

                        // ── 5. Rollout status ────────────────────────────────────────
                        sh 'kubectl rollout status deployment/frontend -n default --timeout=120s'
                        sh 'kubectl rollout status deployment/backend  -n default --timeout=120s'

                        // ── 6. Vérification finale ───────────────────────────────────
                        sh 'kubectl get pods -n default'
                        sh 'kubectl get svc  -n default'
                    }
                }
            }

            post {
                failure {
                    container('kubectl') {
                        // ── 5. Rollout status ────────────────────────────────────────
sh 'kubectl rollout status deployment/frontend -n default --timeout=120s || true'
sh 'kubectl rollout status deployment/backend  -n default --timeout=120s || true'

// ── 6. Diagnostic complet ────────────────────────────────────
sh '''
    echo "===== PODS ====="
    kubectl get pods -n default -o wide

    echo "===== EVENTS (triés par date) ====="
    kubectl get events -n default --sort-by=.lastTimestamp

    echo "===== DESCRIBE FRONTEND ====="
    kubectl describe deployment frontend -n default

    echo "===== DESCRIBE BACKEND ====="
    kubectl describe deployment backend -n default

    echo "===== LOGS FRONTEND (dernier pod) ====="
    POD=$(kubectl get pods -n default -l io.kompose.service=frontend \
          --sort-by=.metadata.creationTimestamp -o jsonpath="{.items[-1].metadata.name}" 2>/dev/null)
    [ -n "$POD" ] && kubectl logs "$POD" -n default --tail=50 || echo "Aucun pod frontend trouvé"

    echo "===== LOGS BACKEND (dernier pod) ====="
    POD=$(kubectl get pods -n default -l io.kompose.service=backend \
          --sort-by=.metadata.creationTimestamp -o jsonpath="{.items[-1].metadata.name}" 2>/dev/null)
    [ -n "$POD" ] && kubectl logs "$POD" -n default --tail=50 || echo "Aucun pod backend trouvé"

    echo "===== PVC STATUS ====="
    kubectl get pvc -n default

    echo "===== SECRETS & CONFIGMAP ====="
    kubectl get secrets,configmap -n default
'''
                    }
                }
            }
        }

//     post {
//         always {
//             emailext(
//                 subject: "[Jenkins] ${currentBuild.currentResult} — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
//                 body: """Pipeline: ${env.JOB_NAME}
// Build: #${env.BUILD_NUMBER}
// Status: ${currentBuild.currentResult}
// Duration: ${currentBuild.durationString}
// Branch: ${env.GIT_BRANCH}
// Commit: ${env.GIT_COMMIT}

// Logs: ${env.BUILD_URL}console""",
//                 mimeType: 'text/plain',
//                 to: 'meissababou66@gmail.com'
//             )
//         }

//         failure {
//             emailext(
//                 subject: "FAILED — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
//                 body: """Le pipeline a echoue.

// Job: ${env.JOB_NAME}
// Build: #${env.BUILD_NUMBER}
// Logs: ${env.BUILD_URL}console""",
//                 mimeType: 'text/plain',
//                 to: 'meissababou66@gmail.com'
//             )
//         }
    }
}