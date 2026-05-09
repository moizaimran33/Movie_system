pipeline {
    agent any
    
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
                    env.COMMIT_EMAIL = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                    echo "Committer email: ${env.COMMIT_EMAIL}"
                }
            }
        }
        
        stage('Deploy App') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
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
            mail to: "${env.COMMIT_EMAIL ?: 'admin@example.com'}",
                 subject: "✅ Tests PASSED - Movie System",
                 body: "All Selenium tests passed successfully.\n\nBuild URL: ${BUILD_URL}"
        }
        failure {
            mail to: "${env.COMMIT_EMAIL ?: 'admin@example.com'}",
                 subject: "❌ Tests FAILED - Movie System",
                 body: "One or more tests failed. Check Jenkins for details.\n\nBuild URL: ${BUILD_URL}"
        }
    }
}
