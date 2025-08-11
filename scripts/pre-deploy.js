#!/usr/bin/env node

/**
 * Script di pre-deploy per verificare che tutto sia pronto per Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'vercel.json',
  '.env.example',
  'tsconfig.json'
];

const optionalFiles = [
  '.env.local'
];

console.log('🚀 Verifica pre-deploy per Vercel\n');

// Verifica file richiesti
console.log('📋 Controllo file richiesti...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANCANTE`);
    process.exit(1);
  }
});

// Verifica file opzionali
console.log('\n📋 Controllo file opzionali...');
optionalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} - Opzionale, non presente`);
  }
});

// Verifica dipendenze
console.log('\n📦 Controllo dipendenze...');
try {
  execSync('npm list --depth=0', { stdio: 'ignore' });
  console.log('✅ Tutte le dipendenze sono installate');
} catch (error) {
  console.log('❌ Alcune dipendenze mancano. Esegui: npm install');
  process.exit(1);
}

// Type check
console.log('\n🔍 Type checking...');
try {
  execSync('npm run type-check', { stdio: 'ignore' });
  console.log('✅ Type check superato');
} catch (error) {
  console.log('❌ Errori di TypeScript trovati');
  process.exit(1);
}

// Lint check
console.log('\n🧹 Linting...');
try {
  execSync('npm run lint', { stdio: 'ignore' });
  console.log('✅ Lint check superato');
} catch (error) {
  console.log('⚠️  Avvisi di linting trovati (non bloccanti)');
}

// Build test
console.log('\n🏗️  Test build...');
try {
  execSync('npm run build', { stdio: 'ignore' });
  console.log('✅ Build completata con successo');
} catch (error) {
  console.log('❌ Build fallita');
  process.exit(1);
}

console.log('\n🎉 Tutto pronto per il deploy su Vercel!');
console.log('\n📝 Prossimi passi:');
console.log('1. git add .');
console.log('2. git commit -m "Deploy ready: Configurazione Vercel completa"');
console.log('3. git push origin main');
console.log('4. Connetti il repository su vercel.com');