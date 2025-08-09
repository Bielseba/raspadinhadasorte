/**
 * Exemplo de uso da API Raspadinha da Sorte
 * Este arquivo demonstra como interagir com a API
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Função auxiliar para fazer requisições
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  console.log(`${options.method || 'GET'} ${endpoint}:`, data);
  return data;
}

// Exemplo de uso da API
async function exemploUsoAPI() {
  try {
    console.log('🚀 Testando API Raspadinha da Sorte\n');
    
    // 1. Health check
    console.log('1. Verificando saúde da API...');
    await makeRequest('/health');
    
    // 2. Login do usuário admin
    console.log('\n2. Fazendo login...');
    const loginResponse = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@raspadinhadasorte.com',
        password: 'admin123'
      })
    });
    
    const token = loginResponse.data.token;
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    
    // 3. Verificar perfil
    console.log('\n3. Verificando perfil...');
    await makeRequest('/users/profile', {
      headers: authHeaders
    });
    
    // 4. Listar raspadinhas disponíveis
    console.log('\n4. Listando raspadinhas disponíveis...');
    await makeRequest('/raspadinhas/available');
    
    // 5. Criar nova raspadinha (admin)
    console.log('\n5. Criando nova raspadinha...');
    const novaRaspadinha = await makeRequest('/raspadinhas', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Super Raspadinha',
        description: 'Uma raspadinha incrível com grandes prêmios!',
        image: 'super-raspadinha.jpg',
        price: 10.00,
        totalCards: 50,
        prizes: [
          {
            id: 'prize1',
            type: 'money',
            name: 'R$ 100,00',
            value: 100,
            probability: 2
          },
          {
            id: 'prize2',
            type: 'money',
            name: 'R$ 50,00',
            value: 50,
            probability: 5
          },
          {
            id: 'prize3',
            type: 'money',
            name: 'R$ 10,00',
            value: 10,
            probability: 15
          }
        ]
      })
    });
    
    // 6. Registrar novo usuário
    console.log('\n6. Registrando novo usuário...');
    const novoUsuario = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: '123456'
      })
    });
    
    const userToken = novoUsuario.data.token;
    const userHeaders = { 'Authorization': `Bearer ${userToken}` };
    
    // 7. Comprar raspadinha
    console.log('\n7. Comprando raspadinha...');
    const compra = await makeRequest('/purchases/purchase', {
      method: 'POST',
      headers: userHeaders,
      body: JSON.stringify({
        raspadinhaId: novaRaspadinha.data.id
      })
    });
    
    // 8. Raspar carta
    console.log('\n8. Raspando carta...');
    await makeRequest(`/purchases/${compra.data.id}/scratch`, {
      method: 'POST',
      headers: userHeaders
    });
    
    // 9. Ver minhas compras
    console.log('\n9. Verificando minhas compras...');
    await makeRequest('/purchases/my-purchases', {
      headers: userHeaders
    });
    
    console.log('\n✅ Exemplo concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no exemplo:', error);
  }
}

// Executar exemplo (descomente para usar)
// exemploUsoAPI();

module.exports = {
  makeRequest,
  exemploUsoAPI,
  API_BASE_URL
}; 