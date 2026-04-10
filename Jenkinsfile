pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/hasssanraheem/Movie_System.git'
            }
        }

        stage('Build & Deploy with Docker') {
            steps {
                sh 'docker-compose -f docker-compose.jenkins.yml down || true'
                sh 'docker-compose -f docker-compose.jenkins.yml up -d --build'
            }
        }

        stage('Verify') {
            steps {
                sh 'sleep 10'
                sh 'docker ps | grep backend-ci'
                sh 'docker ps | grep mongodb-ci'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! App is running on port 5001.'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
