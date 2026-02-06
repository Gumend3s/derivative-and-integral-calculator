import {
    dissecaTermo,
    montaTermo
} from "./termos.js";

/**
 * Remove os espaços em branco, corrige X -> x e remove parênteses inúteis de uma função.
 * @param {string} funcao A função a ser limpa.
 * Retorna a função corrigida.
 */
export function limparFuncao(funcao) {
    let resultado = "" // Inicializa uma string vazia para armazenar o resultado limpo.

    if (funcao[0] === '(' && funcao[funcao.length - 1] === ')') { // Verifica se a função está em um parênteses
        let qtdParenteses = 1, i = 1
        do {
            if (funcao[i] === '(') qtdParenteses++ // Ao encontrar um ( considera que há mais um parênteses aberto
            if (funcao[i] === ')') qtdParenteses-- // Ao encontrar um ) considera que um parênteses foi fechado
            i++
        } while (qtdParenteses > 0) // Repete enquanto  ainda houver um parênteses aberto
        if (i === funcao.length) funcao = funcao.slice(1, -1) // Se sempre houve um parênteses aberto até chegar no fim da função, retira os ( e ) do início e fim
    }

    for (let i = 0; i < funcao.length; i++) { // Loop através de cada termo.
        let charAtual = funcao[i] // Armazena o caractere atual.
        switch (charAtual) {
            case ' ': // Ignora espaços vazios
                break;
            case 'X': // Corrige X -> x
                resultado += 'x'
                break;
            case 'E':
                resultado += 'e'
                break;
            default: // Guarda o caractere atual no resultado
                resultado += charAtual
        }
    }

    return resultado // Retorna a string 'resultado' que contém a função limpa.
}

/**
 * Separa uma função em um array de termos.
 * @param {string} funcaoOriginal A função matemática como uma string.
 * @returns {string[]} Um array contendo os termos da função.
 */
export function separarFuncao(funcaoOriginal) {
    const termos = []         // Inicializa um array vazio para armazenar os termos separados.
    let termoAtual = ""       // Inicializa uma string vazia para construir o termo atual que está sendo lido.
    let qtdParenteses = 0     // Conta quantos parênteses estão abertos em um dado momento
    let charAtual             // Guarda o caractere atual.

    let funcaoLimpa = limparFuncao(funcaoOriginal)
    for (let i = 0; i < funcaoLimpa.length; i++) { // Loop através de cada caractere da função original.
        charAtual = funcaoLimpa[i] // Obtém o caractere atual.

        switch (charAtual) {
            case '-':
            case '+':
                if (funcaoLimpa[i - 1] === '^' || funcaoLimpa[i - 1] === '*')
                    break; // Se o ultimo caractere for um * ou ^ considera que o sinal é da multiplicação ou expoente, respectivamente
                if (termoAtual !== '') termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                termoAtual = '' // Inicia o próximo termo vazio
                break;
            case 'x':
                if (funcaoLimpa[i - 1] === ')' || funcaoLimpa[i - 1] === 'e') { // Se o termo atual já tem um parenteses, considera que são dois termos distintos se multiplicando
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
                break;
            case 'e':
                if (funcaoLimpa[i - 1] === ')' || funcaoLimpa[i - 1] === 'x') { // Se o termo atual já tem um parenteses, considera que são dois termos distintos se multiplicando
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
                break;
            case '(': // Ao encontrar o início de um parênteses colocorá todo o seu conteúdo em um único termo
                if (funcaoLimpa[i - 1] === 'x' || funcaoLimpa[i - 1] === 'e') { // Se o termo atual já tem um x, considera que são dois termos distintos se multiplicando
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
                qtdParenteses++ // Incrementa a quantidade de parênteses
                do {
                    termoAtual += funcaoLimpa[i]                // Adciona o próximo termo do parênteses
                    i++                                         // Incrementa i para continuar verificar o próximo termo
                    if (funcaoLimpa[i] === '(') qtdParenteses++ // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                    if (funcaoLimpa[i] === ')') qtdParenteses-- // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                charAtual = funcaoLimpa[i]
                break;
            case '^':
                break;
            case '*':
                if (termoAtual !== '') termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                termoAtual = '' // Inicia o próximo termo vazio
                break;
            default:
                if (funcaoLimpa[i - 1] === 'x' || funcaoLimpa[i - 1] === ')') {
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
        }
        termoAtual += charAtual // Adiciona o caratere encontrado ao termo atual
    }
    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
    /*
        console.log(termos)
        for(i = 0; i < termos.length; i++) console.log(montaTermo(termos))
    */
    return termos // Retorna o array 'termos' contendo os termos separados da função em forma de termo dissecado.
}

export function corrigirFuncao(funcao) {
    let termos = separarFuncao(funcao)
    let funcaoCorrigida = montaTermo(termos[0], true, false, true)
    for (let i = 1; i < termos.length; i++) {
        funcaoCorrigida += montaTermo(termos[i], false, false, true)
    }
    return funcaoCorrigida
}

/**
 * 
 * @param {*} funcao 
 * @param {*} separado 
 */
export function simplificaFuncao(funcao, separado = false) {
    let termos, resultado = '', termoAtual, achouZero
    let i, j
    if (!separado) {
        termos = separarFuncao(funcao)
    } else {
        termos = funcao
    }

    console.log(termos.length)
    for (i = 0; i < termos.length; i++) {
        termoAtual = termos[i]

        achouZero = false
        console.log(i)
        if (i < termos.length - 1) if (termos[i + 1].temProduto) {
            j = i
            if (termos[j].coeficiente == 0) achouZero = true
            while (termos[j + 1].temProduto) {
                if (termos[j + 1].coeficiente == 0) achouZero = true
                j++
                if (j >= termos.length - 1) break
            }

            if (achouZero) i = j;
        } else {
            if (termoAtual.coeficiente == 1 && !termoAtual.temParenteses && termos[i + 1].temProduto) i++;
        }

        if (i >= termos.length) break
        if (resultado == '')
            resultado += montaTermo(termos[i], true) // Primeiro termo 
        else
            resultado += montaTermo(termos[i]) // Não é o primeiro termo
    }
console.log(resultado)
    if (resultado == '') resultado = '0'
    if (resultado.slice(0, 3) == " * ") resultado = resultado.slice(3)
        console.log(resultado)
    return resultado
}
