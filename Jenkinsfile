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
                    // Get the actual committer email from the latest commit
                    sh(script: "git log -1 --pretty=format:'%ae' > committer.txt", returnStdout: false)
                    env.COMMIT_EMAIL = readFile('committer.txt').trim()
                    echo "Committer email: ${env.COMMIT_EMAIL}"
                    sh 'rm -f committer.txt'
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
                emailext(
                    to: recipient,
                    subject: "✅ Tests PASSED - Movie System - Build ${env.BUILD_NUMBER}",
                    body: """
                        <h2>Build Successful!</h2>
                        <p>All Selenium tests passed successfully.</p>
                        <p>Build URL: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
                        <p>Project: Movie System</p>
                        <p>Status: SUCCESS</p>
                    `,
                    mimeType: 'text/html'
                )
            }
        }
        failure {
            script {
                def recipient = env.COMMIT_EMAIL ?: 'moizaimran33@gmail.com'
                echo "Sending failure email to: ${recipient}"
                emailext(
                    to: recipient,
                    subject: "❌ Tests FAILED - Movie System - Build ${env.BUILD_NUMBER}",
                    body: """
                        <h2>Build Failed!</h2>
                        <p>One or more tests failed.</p>
                        <p>Build URL: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
                        <p>Project: Movie System</p>
                        <p>Status: FAILURE</p>
                        <p>Check Jenkins console for details.</p>
                    `,
                    mimeType: 'text/html'
                )
            }
        }
    }
}
