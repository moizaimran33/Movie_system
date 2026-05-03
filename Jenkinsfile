pipeline {
    agent {
        docker {
            image 'markhobson/maven-chrome:jdk-11'
            args '--network host -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    environment { COMMIT_EMAIL = "" }
    stages {
        stage('Clone App') {
            steps {
                git branch: 'main', url: 'https://github.com/moizaimran33/Movie_system.git'
            }
        }
        stage('Get Committer Email') {
            steps {
                script {
                    COMMIT_EMAIL = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                    echo "Committer email: ${COMMIT_EMAIL}"
                }
            }
        }
        stage('Deploy App') {
            steps {
                sh 'cd /home/ubuntu/movie-system && docker compose down || true'
                sh 'cd /home/ubuntu/movie-system && docker compose up -d'
                sh 'sleep 10'
            }
        }
        stage('Clone Tests') {
            steps {
                dir('movie-tests') {
                    git branch: 'main', url: 'https://github.com/moizaimran33/movie-system-tests.git'
                }
            }
        }
        stage('Run Selenium Tests') {
            steps {
                dir('movie-tests') { sh 'mvn test' }
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
                 subject: "✅ Tests PASSED - Movie System",
                 body: "All 17 Selenium tests passed successfully."
        }
        failure {
            mail to: "${COMMIT_EMAIL}",
                 subject: "❌ Tests FAILED - Movie System",
                 body: "One or more Selenium tests failed. Check Jenkins for details."
        }
    }
}
