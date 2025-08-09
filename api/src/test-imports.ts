// Arquivo de teste para verificar importações
console.log('🧪 Testando importações...');

try {
  // Testar importações principais
  const express = require('../config/express');
  const container = require('../config/container');
  
  console.log('✅ Importações básicas funcionando');
  
  // Testar se os arquivos existem
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(__dirname, 'config', 'express.ts');
  const containerPath = path.join(__dirname, 'config', 'container.ts');
  
  console.log('📁 Verificando arquivos:');
  console.log(`- express.ts: ${fs.existsSync(configPath) ? '✅' : '❌'}`);
  console.log(`- container.ts: ${fs.existsSync(containerPath) ? '✅' : '❌'}`);
  
} catch (error) {
  console.log('❌ Erro nas importações:', error.message);
}

// Para executar: npx ts-node src/test-imports.ts 