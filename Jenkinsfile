pipeline {
    agent any
    
    stages {
        stage('Clone App with Full History') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [
                        [$class: 'CloneOption', depth: 0, shallow: false]
                    ],
                    userRemoteConfigs: [[url: 'https://github.com/moizaimran33/Movie_system.git']]
                ])
            }
        }
        
        stage('Get Committer Email') {
            steps {
                script {
                    // This gets the email of whoever made the commit
                    def email = sh(script: "git show -s --format='%ae' HEAD", returnStdout: true).trim()
                    
                    if (email && email != '' && email != 'null') {
                        env.COMMIT_EMAIL = email
                    } else {
                        // Fallback for any user
                        env.COMMIT_EMAIL = sh(script: "git show -s --format='%ce' HEAD", returnStdout: true).trim()
                    }
                    
                    echo "Sending email to: ${env.COMMIT_EMAIL}"
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
                mail(
                    to: recipient,
                    subject: "✅ Tests PASSED - Build ${env.BUILD_NUMBER}",
                    body: "Build successful!\n\nBuild URL: ${env.BUILD_URL}\nCommitter: ${recipient}"
                )
            }
        }
        failure {
            script {
                def recipient = env.COMMIT_EMAIL ?: 'moizaimran33@gmail.com'
                mail(
                    to: recipient,
                    subject: "❌ Tests FAILED - Build ${env.BUILD_NUMBER}",
                    body: "Build failed!\n\nBuild URL: ${env.BUILD_URL}\nCommitter: ${recipient}\n\nCheck console for details."
                )
            }
        }
    }
}
