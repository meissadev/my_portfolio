pipeline {
    agent none

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

    stages {

        // ── LINT (désactivé) ───────────────────────────────────────────────────
        // stage('Lint') {
        //     agent {
        //         kubernetes {
        //             yaml '''
        // apiVersion: v1
        // kind: Pod
        // spec:
        //   serviceAccountName: jenkins-agent
        //   nodeSelector:
        //     kubernetes.io/hostname: worker-2
        //   containers:
        //   - name: docker
        //     image: docker:24-dind
        //     securityContext:
        //       privileged: true
        //     env:
        //     - name: DOCKER_TLS_CERTDIR
        //       value: ""
        //   - name: docker-client
        //     image: docker:24-cli
        //     command: [cat]
        //     tty: true
        //     env:
        //     - name: DOCKER_HOST
        //       value: tcp://localhost:2375
        // '''
        //         }
        //     }
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

        // ── SONARQUBE + QUALITY GATE ───────────────────────────────────────────
        stage('SonarQube Analysis') {
            agent {
                kubernetes {
                    yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-agent
  nodeSelector:
    kubernetes.io/hostname: worker-2
  containers:
- name: jnlp
  resources:
    requests:
      memory: "1Gi"
      cpu: "250m"
    limits:
      memory: "2Gi"      # ← JVM 1g heap + overhead
      cpu: "1000m"
  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: [cat]
    tty: true
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "1Gi"
        cpu: "1000m"
'''
                }
            }
            stages {
                stage('Sonar Scan') {
                    steps {
                        // sh 'rm -rf frontend/node_modules backend/node_modules'
                        withSonarQubeEnv('SonarQube') {
                            withCredentials([string(credentialsId: 'scan-jenkins',
                                                    variable: 'SONAR_TOKEN')]) {
                                sh """
                    export SONAR_SCANNER_OPTS="-Xmx1g -Xms256m"
                    ${tool 'scan-jenkins'}/bin/sonar-scanner \
                        -Dsonar.projectKey=portfolio \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=\${SONAR_TOKEN} \
                        -Dsonar.working.directory=${WORKSPACE}/.scannerwork \
                        -Dsonar.javascript.node.maxspace=200 \
                        -Dsonar.javascript.typecheck.enabled=false
                """
                            }
                        }
                    }
                }

                stage('Quality Gate') {
                    steps {
                        timeout(time: 5, unit: 'MINUTES') {
                            waitForQualityGate abortPipeline: true
                        }
                    }
                }
            }
        }

        // ── BUILD (désactivé) ──────────────────────────────────────────────────
        // stage('Build & Push') {
        //     agent {
        //         kubernetes {
        //             yaml '''
        // apiVersion: v1
        // kind: Pod
        // spec:
        //   serviceAccountName: jenkins-agent
        //   nodeSelector:
        //     kubernetes.io/hostname: worker-2
        //   containers:
        //   - name: docker
        //     image: docker:24-dind
        //     securityContext:
        //       privileged: true
        //     env:
        //     - name: DOCKER_TLS_CERTDIR
        //       value: ""
        //     resources:
        //       requests:
        //         memory: "512Mi"
        //       limits:
        //         memory: "1Gi"
        //   - name: docker-client
        //     image: docker:24-cli
        //     command: [cat]
        //     tty: true
        //     env:
        //     - name: DOCKER_HOST
        //       value: tcp://localhost:2375
        //     resources:
        //       requests:
        //         memory: "128Mi"
        //       limits:
        //         memory: "256Mi"
        // '''
        //         }
        //     }
        //     environment {
        //         NODE_ENV = 'production'
        //     }
        //     steps {
        //         container('docker-client') {
        //             withCredentials([usernamePassword(credentialsId: 'docker-creds',
        //                                              usernameVariable: 'DOCKER_HUB_USER',
        //                                              passwordVariable: 'DOCKER_HUB_TOKEN')]) {
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
        //             container('docker-client') {
        //                 sh 'docker logout || true'
        //             }
        //         }
        //     }
        // }

        // ── DEPLOY ─────────────────────────────────────────────────────────────
        stage('Deploy') {
            agent {
                kubernetes {
                    yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-agent
  nodeSelector:
    kubernetes.io/hostname: worker-2
  containers:
  - name: jnlp
    resources:
      requests:
        memory: "256Mi"
      limits:
        memory: "512Mi"
  - name: kubectl
    image: alpine/k8s:1.27.3
    command: [cat]
    tty: true
    resources:
      requests:
        memory: "128Mi"
      limits:
        memory: "256Mi"
'''
                }
            }
            steps {
                container('kubectl') {
                    withCredentials([
                        usernamePassword(credentialsId: 'docker-creds',
                                         usernameVariable: 'DOCKER_HUB_USER',
                                         passwordVariable: 'DOCKER_HUB_TOKEN'),
                        string(credentialsId: 'mongo-uri',
                               variable: 'MONGO_URI')
                    ]) {
                        // ── 1. Secret Docker Hub ─────────────────────────────
                        sh """
                            kubectl create secret docker-registry docker-hub-secret \
                                --docker-username=\${DOCKER_HUB_USER} \
                                --docker-password=\${DOCKER_HUB_TOKEN} \
                                --docker-server=https://index.docker.io/v1/ \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 2. Secret MongoDB ────────────────────────────────
                        sh """
                            kubectl create secret generic mongo-secret \
                                --from-literal=MONGO_URI=\${MONGO_URI} \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 3. ConfigMap ─────────────────────────────────────
                        sh """
                            kubectl create configmap app-config \
                                --from-literal=VITE_API_URL=${VITE_API_URL} \
                                --from-literal=CORS_ORIGIN=${CORS_ORIGIN} \
                                --from-literal=PORT=${PORT} \
                                -n default \
                                --dry-run=client -o yaml | kubectl apply -f -
                        """

                        // ── 4. Appliquer les manifests ───────────────────────
                        sh 'ls -la k8s/'
                        sh 'kubectl apply -f k8s/ -n default'

                        // ── 5. Mettre à jour les images ──────────────────────
                        sh """
                            kubectl set image deployment/frontend \
                                portfolio-app=\${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest \
                                -n default
                            kubectl set image deployment/backend \
                                portfolio-server=\${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest \
                                -n default
                        """

                        // ── 6. Attendre que les pods soient prêts ────────────
                        sh 'kubectl rollout status deployment/frontend -n default --timeout=120s'
                        sh 'kubectl rollout status deployment/backend  -n default --timeout=120s'

                        // ── 7. Vérification finale ───────────────────────────
                        sh 'kubectl get pods -n default -o wide'
                        sh 'kubectl get svc  -n default'
                    }
                }
            }
            post {
                failure {
                    container('kubectl') {
                        sh 'kubectl rollout undo deployment/frontend -n default || true'
                        sh 'kubectl rollout undo deployment/backend  -n default || true'
                        sh 'kubectl get pods -n default -o wide'
                        sh 'kubectl get events -n default --sort-by=.lastTimestamp'
                    }
                }
            }
        }
    }
}
