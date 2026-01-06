#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar a configuração do Mapbox
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do Mapbox...\n');

// 1. Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado!');
  console.log('   Crie um arquivo .env na raiz do projeto\n');
  process.exit(1);
}
console.log('✅ Arquivo .env encontrado');

// 2. Ler e verificar o token do Mapbox
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/VITE_MAPBOX_ACCESS_TOKEN=(.+)/);

if (!tokenMatch || !tokenMatch[1] || tokenMatch[1].trim() === '') {
  console.error('❌ Token do Mapbox não encontrado no .env');
  console.log('   Adicione: VITE_MAPBOX_ACCESS_TOKEN=seu_token_aqui\n');
  process.exit(1);
}

const token = tokenMatch[1].trim();

if (token === 'your_mapbox_access_token_here') {
  console.error('❌ Token do Mapbox não foi configurado (ainda está com o valor padrão)');
  console.log('   Obtenha seu token em: https://account.mapbox.com/access-tokens/\n');
  process.exit(1);
}

if (!token.startsWith('pk.')) {
  console.error('❌ Token do Mapbox parece inválido (deve começar com "pk.")');
  console.log('   Token encontrado:', token.substring(0, 20) + '...\n');
  process.exit(1);
}

console.log('✅ Token do Mapbox configurado');
console.log('   Token:', token.substring(0, 20) + '...');

// 3. Verificar se mapbox-gl está instalado
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const hasMapboxInDeps = packageJson.dependencies && packageJson.dependencies['mapbox-gl'];
const hasMapboxInDevDeps = packageJson.devDependencies && packageJson.devDependencies['mapbox-gl'];

if (!hasMapboxInDeps && !hasMapboxInDevDeps) {
  console.error('❌ mapbox-gl não está instalado');
  console.log('   Execute: npm install mapbox-gl\n');
  process.exit(1);
}

if (hasMapboxInDevDeps && !hasMapboxInDeps) {
  console.warn('⚠️  mapbox-gl está em devDependencies (deveria estar em dependencies)');
  console.log('   Execute: npm install --save mapbox-gl\n');
}

console.log('✅ mapbox-gl instalado');

// 4. Verificar se o componente MapLayout existe
const mapLayoutPath = path.join(__dirname, 'src/components/organisms/MapLayout.tsx');
if (!fs.existsSync(mapLayoutPath)) {
  console.error('❌ Componente MapLayout.tsx não encontrado');
  console.log('   Esperado em:', mapLayoutPath, '\n');
  process.exit(1);
}
console.log('✅ Componente MapLayout.tsx encontrado');

console.log('\n✨ Todas as verificações passaram!');
console.log('\n📝 Próximos passos:');
console.log('   1. Execute: npm run dev');
console.log('   2. Abra: http://localhost:5173');
console.log('   3. Verifique o console do navegador para erros\n');
