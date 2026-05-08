pipeline {
    agent any  // Use Jenkins server directly instead of Docker container
    
    environment { 
        COMMIT_EMAIL = "" 
    }
    
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
                // Using correct path with capital 'M' in Movie_system
                sh 'cd /home/ubuntu/Movie_system && docker-compose down || true'
                sh 'cd /home/ubuntu/Movie_system && docker-compose up -d --build'
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
                 subject: "✅ Tests PASSED - Movie System",
                 body: "All Selenium tests passed successfully.\n\nBuild URL: ${BUILD_URL}"
        }
        failure {
            mail to: "${COMMIT_EMAIL}",
                 subject: "❌ Tests FAILED - Movie System",
                 body: "One or more tests failed. Check Jenkins for details.\n\nBuild URL: ${BUILD_URL}"
        }
    }
}
