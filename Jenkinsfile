pipeline {
    agent {
        docker {
            image 'markhobson/maven-chrome:jdk-11'
            args '--network host -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        COMMIT_EMAIL = ""
    }

    stages {

        stage('Clone App') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/moizaimran33/Movie_system.git'
            }
        }

        stage('Get Committer Email') {
            steps {
                script {
                    COMMIT_EMAIL = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()
                    echo "Committer email: ${COMMIT_EMAIL}"
                }
            }
        }

        stage('Clone Tests') {
            steps {
                dir('movie-tests') {
                    git branch: 'main',
                        url: 'https://github.com/moizaimran33/movie-system-tests.git'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('movie-tests') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit 'movie-tests/target/surefire-reports/*.xml'
                }
            }
        }
    }

    post {
        success {
            mail to: "${COMMIT_EMAIL}",
                 subject: "✅ Tests PASSED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Your commit passed all Selenium tests! Build: ${env.BUILD_NUMBER} URL: ${env.BUILD_URL}"
        }
        failure {
            mail to: "${COMMIT_EMAIL}",
                 subject: "❌ Tests FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Your commit failed Selenium tests. Build: ${env.BUILD_NUMBER} URL: ${env.BUILD_URL}"
        }
    }
}
