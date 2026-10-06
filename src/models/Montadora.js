export class Montadora {
    #id;
    #nome;
    #pais;
    #dataCad;

    constructor(pNome, pPais, pId = null) {
        this.nome = pNome;
        this.pais = pPais;
        this.id = pId;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get pais() {
        return this.#pais;
    }

    get dataCad() {
        return this.#dataCad;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    set pais(value) {
        this.#validarPais(value);
        this.#pais = value;
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("ID inválido");
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 60) {
            throw new Error("Nome inválido");
        }
    }

    #validarPais(value) {
        if (!value || value.trim().length < 2 || value.trim().length > 45) {
            throw new Error("País inválido");
        }
    }

    static criar(dados) {
        return new Montadora(dados.nome, dados.pais, null);
    }

    static editar(dados, id) {
        return new Montadora(dados.nome, dados.pais, id);
    }
}