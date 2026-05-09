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
                sh '''
                    docker-compose down -v || true
                    docker rm -f mongodb backend || true
                    docker-compose up -d --build
                    sleep 10
                '''
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
            script {
                def recipient = env.COMMIT_EMAIL ?: 'moizaimran33@gmail.com'
                echo "Sending success email to: ${recipient}"
                mail(
                    to: recipient,
                    subject: "✅ Tests PASSED - Movie System - Build ${env.BUILD_NUMBER}",
                    body: "All Selenium tests passed successfully.\n\nBuild URL: ${env.BUILD_URL}\nProject: Movie System\nStatus: SUCCESS\nCommitter: ${env.COMMIT_EMAIL}"
                )
            }
        }
        failure {
            script {
                def recipient = env.COMMIT_EMAIL ?: 'moizaimran33@gmail.com'
                echo "Sending failure email to: ${recipient}"
                mail(
                    to: recipient,
                    subject: "❌ Tests FAILED - Movie System - Build ${env.BUILD_NUMBER}",
                    body: "One or more tests failed.\n\nBuild URL: ${env.BUILD_URL}\nProject: Movie System\nStatus: FAILURE\nCommitter: ${env.COMMIT_EMAIL}\n\nCheck Jenkins console for details."
                )
            }
        }
    }
}
