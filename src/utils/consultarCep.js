import axios from 'axios';

export async function consultarCep(cep) {
    const cepLimpo = String(cep ?? '').replace(/\D+/g, '');
    console.log('CEP limpo:', cepLimpo);
    if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido');
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    console.log('Resposta da API:', response);
    if (!response.data || response.data.erro) {
        throw new Error('CEP não encontrado');
    }

    return {
        cep: cepLimpo,
        logradouro: response.data.logradouro || '',
        bairro: response.data.bairro || '',
        cidade: response.data.localidade || '',
        uf: response.data.uf || ''
    };
}