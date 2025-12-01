pipeline {
    agent any
    
    tools {
        nodejs 'node20'
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Format Check') {
            steps {
                sh 'npm run format:check'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm run test:coverage'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            // Publica relatório de cobertura
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Coverage Report',
                reportTitles: ''
            ])
            
            // Arquiva artefatos
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
        }
        
        success {
            echo '✅ Pipeline executado com sucesso!'
        }
        
        failure {
            echo '❌ Pipeline falhou!'
        }
    }
}
