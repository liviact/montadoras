export class Veiculo {
    #id;
    #idMontadora;
    #idCliente;
    #modelo;
    #placa;
    #ano;
    #cor;
    #valor;
    #dataCad;

    constructor(pIdMontadora, pIdCliente, pModelo, pPlaca, pAno, pCor, pValor, pId = null) {
        this.idMontadora = pIdMontadora;
        this.idCliente = pIdCliente;
        this.modelo = pModelo;
        this.placa = pPlaca;
        this.ano = pAno;
        this.cor = pCor;
        this.valor = pValor;
        this.id = pId;
    }

    get id() {
        return this.#id;
    }

    get idMontadora() {
        return this.#idMontadora;
    }

    get idCliente() {
        return this.#idCliente;
    }

    get modelo() {
        return this.#modelo;
    }

    get placa() {
        return this.#placa;
    }

    get ano() {
        return this.#ano;
    }

    get cor() {
        return this.#cor;
    }

    get valor() {
        return this.#valor;
    }

    get dataCad() {
        return this.#dataCad;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    set idMontadora(value) {
        this.#validarIdMontadora(value);
        this.#idMontadora = value;
    }

    set idCliente(value) {
        this.#validarIdCliente(value);
        this.#idCliente = value;
    }

    set modelo(value) {
        this.#validarModelo(value);
        this.#modelo = value;
    }

    set placa(value) {
        this.#validarPlaca(value);
        this.#placa = value;
    }

    set ano(value) {
        this.#validarAno(value);
        this.#ano = value;
    }

    set cor(value) {
        this.#validarCor(value);
        this.#cor = value;
    }

    set valor(value) {
        this.#validarValor(value);
        this.#valor = value;
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("ID inválido");
        }
    }

    #validarIdMontadora(value) {
        if (value === undefined || value === null || isNaN(value) || value <= 0) {
            throw new Error("ID da montadora inválido");
        }
    }

    #validarIdCliente(value) {
        if (value === undefined || value === null || isNaN(value) || value <= 0) {
            throw new Error("ID do cliente inválido");
        }
    }

    #validarModelo(value) {
        if (!value || value.trim().length < 2 || value.trim().length > 60) {
            throw new Error("Modelo inválido");
        }
    }

    #validarPlaca(value) {
        if (!value || value.trim().length < 5 || value.trim().length > 10) {
            throw new Error("Placa inválida");
        }
    }

    #validarAno(value) {
        const anoAtual = new Date().getFullYear() + 1;
        if (value === undefined || value === null || isNaN(value) || value < 1886 || value > anoAtual) {
            throw new Error("Ano inválido");
        }
    }

    #validarCor(value) {
        if (!value || value.trim().length < 2 || value.trim().length > 30) {
            throw new Error("Cor inválida");
        }
    }

    #validarValor(value) {
        if (value === undefined || value === null || isNaN(value) || value <= 0) {
            throw new Error("Valor inválido");
        }
    }

    static criar(dados) {
        return new Veiculo(dados.idMontadora, dados.idCliente, dados.modelo, dados.placa, dados.ano, dados.cor, dados.valor, null);
    }

    static editar(dados, id) {
        return new Veiculo(dados.idMontadora, dados.idCliente, dados.modelo, dados.placa, dados.ano, dados.cor, dados.valor, id);
    }
}