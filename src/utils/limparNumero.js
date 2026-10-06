export function limparNumero(numero) {
    return String(numero ?? '').replace(/\D+/g, '');
}