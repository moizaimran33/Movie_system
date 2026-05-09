pipeline {
    agent any
    
    environment {
        COMMIT_EMAIL = ""
    }
    
    stages {
        stage('Clone App') {
            steps {
                // Clone with full history to get commit details
                checkout scmGit(
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/moizaimran33/Movie_system.git']],
                    extensions: [[$class: 'CloneOption', depth: 10, noTags: false, reference: '', shallow: false]]
                )
            }
        }
        
        stage('Get Committer Email') {
            steps {
                script {
                    // Method 1: Try to get from GitHub environment variables
                    if (env.GIT_COMMITTER_EMAIL && env.GIT_COMMITTER_EMAIL != '') {
                        env.COMMIT_EMAIL = env.GIT_COMMITTER_EMAIL
                        echo "Got email from GIT_COMMITTER_EMAIL: ${env.COMMIT_EMAIL}"
                    }
                    // Method 2: Get from git log
                    else {
                        sh 'git log -1 --pretty=format:"%ae" > email.txt'
                        def email = readFile('email.txt').trim()
                        sh 'rm -f email.txt'
                        
                        if (email && email != '') {
                            env.COMMIT_EMAIL = email
                            echo "Got email from git log: ${env.COMMIT_EMAIL}"
                        } else {
                            // Method 3: Try committer email
                            sh 'git log -1 --pretty=format:"%ce" > email.txt'
                            email = readFile('email.txt').trim()
                            sh 'rm -f email.txt'
                            env.COMMIT_EMAIL = email ?: 'moizaimran33@gmail.com'
                            echo "Got email from git committer: ${env.COMMIT_EMAIL}"
                        }
                    }
                    
                    echo "Final committer email: ${env.COMMIT_EMAIL}"
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
                echo "Sending success email to: ${env.COMMIT_EMAIL}"
                mail(
                    to: "${env.COMMIT_EMAIL}",
                    subject: "✅ Tests PASSED - Movie System - Build ${env.BUILD_NUMBER}",
                    body: """
All Selenium tests passed successfully.

Build Details:
- Build URL: ${env.BUILD_URL}
- Project: Movie System
- Status: SUCCESS
- Committer: ${env.COMMIT_EMAIL}
- Build Number: ${env.BUILD_NUMBER}

Tests run: 17
Failures: 0
Errors: 0

This email was sent by Jenkins CI/CD pipeline.
                    """
                )
            }
        }
        failure {
            script {
                echo "Sending failure email to: ${env.COMMIT_EMAIL}"
                mail(
                    to: "${env.COMMIT_EMAIL}",
                    subject: "❌ Tests FAILED - Movie System - Build ${env.BUILD_NUMBER}",
                    body: """
One or more tests failed.

Build Details:
- Build URL: ${env.BUILD_URL}
- Project: Movie System
- Status: FAILURE
- Committer: ${env.COMMIT_EMAIL}
- Build Number: ${env.BUILD_NUMBER}

Please check Jenkins console for details.
                    """
                )
            }
        }
    }
}
