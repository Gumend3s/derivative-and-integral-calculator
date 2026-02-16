import {
    dissecaTermo,
    montaTermo
} from "./termos.js";

import { 
    separarFuncao
} from "./funcoes.js";
/**
 * Deriva um único termo da função (considerando a regra do tombo para polinômios) sem usar métodos restritos.
 * @param {object} termo O termo a ser derivado.
 * @returns {string} Rtorna a derivada do termo
 */
export function derivarTermo(termo) {
    let res = "0" // Variável para guardar o conteúdo do resultado
    if (termo.temE) {
        // Caso o termo tenha um e de Euler, aplica sua regra
        if (termo.expoente[0] !== '(' || termo.expoente[termo.expoente.length - 1] !== ')')
            res = termo.coeficiente + "e^(" + termo.expoente + ")" // Se o expoente não for um parênteses, adiciona o expoente do e^ em um
        else
            res = termo.coeficiente + "e^" + termo.expoente        // Se o expoente for um parênteses, não adiciona o expoente do e^ em um
    } else {
        let novoCoeficiente, novoExpoente
        if (!termo.temTermoPot) {                                // Se a potência não for uma expressão
            novoCoeficiente = termo.coeficiente * termo.expoente // O novo coeficiente recebe o resultado da multiplicação do coeficiente e do expoente originais do termo
            novoExpoente = termo.expoente - 1                    // e o novo expoente recebe o expoente original do termo menos 1
        } else {                                                         // Se a potência for uma expressão
            novoCoeficiente = termo.expoente + " * " + termo.coeficiente // O novo coeficiente recebe o coeficiente e do expoente originais do termo separados por um " * "
            novoExpoente = "(" + termo.expoente + "-1)"                  // e o novo expoente recebe o expoente original do termo juntamente com um -1 dentro de um parênteses 
        }

        if (termo.temX) { // Tratamento para quando o termo tem um x
            if (novoExpoente === 0) {
                res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente // Se o novo expoente for 0 (x vai sumir) retorna somente o novo coeficiente
            } else if (novoExpoente === 1) {
                res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x' // Se o novo expoente for 1 (pode ser omitido) retorna somente o novo coeficiente seguido de x
            } else {
                res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x^' + novoExpoente // Senão retorna o novo coeficiente seguido de x seguido do expoente
            }
        } else if (termo.temParenteses) { // Tratamento para quando o termo tem um parênteses(f'(g(x) * g'(x)))
            if (novoExpoente === 0) {
                res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente // Se o novo expoente for 0 (parenteses vai sumir) guarda somente o novo coeficiente
            } else if (novoExpoente === 1) {
                res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + termo.conteudoParenteses // Se o novo expoente for 1 (pode ser omitido) guarda somente o novo coeficiente seguido do parênteses
            } else {
                res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + termo.conteudoParenteses + '^' + novoExpoente // Senão guarda o novo coeficiente seguido do parênteses seguido do expoente
            }
            if (res === '1') res = '' // Se o resultado do tombo do parênteses for 1 (pode ser omitido) limpa res para que fique somente g'(x)

            if (termo.conteudoParenteses.charAt(0) === '+') termo.conteudoParenteses.slice(1) // Se o conteúdo do parenteses começar com um + (pode ser omitido), o retira

            let derivadaParenteses = calcularDerivada(termo.conteudoParenteses) // Guarda o valor da derivada do parênteses(g'(x))
            if (separarFuncao(derivadaParenteses).length > 1 || res !== '') derivadaParenteses = '(' + derivadaParenteses + ')' // Caso a derivada do parênteses tenha mais de um termo ou f(g(x)) não seja vazio, adiciona coloca a derivada do parênteses em um parênteses

            if (termo.temPotencia) res += ' * ' // Caso não haja potência, ou seja, o resultado é somente um número, não é adicionado o ' * ' para que a vizualização fique melhor
            res += derivadaParenteses // Adiciona a derivada do parênteses no resultado
        }
    }

    if (termo.temTermoPot && termo.expoente !== 'x') {         // Se  o termo tiver uma potência em forma de termo que não seja somente 'x'
        res += " * (" + calcularDerivada(termo.expoente) + ")" // é adicionada a derivada do expoente multiplicando o resultado final
    }

    return res // Retorna o resultado da derivada completa
}

/**
 * Calcula a derivada de da função inserida sem usar métodos restritos.
 * @param {string} funcaoOriginal Função que será derivada
 * @returns {string} Retorna A string representando a derivada.
 */
export function calcularDerivada(funcaoOriginal) {
    const termos = separarFuncao(funcaoOriginal) // Separa a função original em um array de termos.
    const derivadas = []        // Inicializa um array para armazenar as derivadas de cada termo.
    const termosDerivadas = []  // Inicializa um array para armazenar os termos da derivada.
    let produto                 // Guarda o produto de duas derivadas
    let i
    for (i = 0; i < termos.length; i++) { // Loop através de cada termo.
        if (termos[i].temProduto) { // Caso o termo atual(g(x)) começe com um '*' aplica a regra do produdo com ele e o termo anterior(f(x))
            produto = `(${derivadas[i - 1]}${montaTermo(termos[i], true, true)}${montaTermo(termos[i - 1])} * ${derivarTermo(termos[i])})` // produto recebe "(f'(x) * g(x) + f(x) * g'(x))
            derivadas[i - 1] = '' // Zera a derivada anterior para que não seja repetida
            termos[i] = dissecaTermo(`(${montaTermo(termos[i - 1], true)}${montaTermo(termos[i])})`) // Transforma o termo atual em f(x) * g(x) para corresponder com sua derivada
            derivadas.push(produto) // Adiciona a nova derivada de f(x) * g(x) em derivadas
        } else {
            derivadas.push(derivarTermo(termos[i])) // Deriva o termo atual e adiciona a derivada ao array 'derivadas'.
        }
    }

    for (i = 0; i < derivadas.length; i++) {                     // Percorre o array derivadas
        if (derivadas[i] !== '' && derivadas[i] !== '0')         // se a derivada não estiver vazia e não for 0
            termosDerivadas.push(...separarFuncao(derivadas[i])) // são separados os termos da derivada e guardados em termosDerivadas
    }

    let resultado = "" // Inicializa uma string vazia para construir a string da derivada resultante
    for (i = 0; i < termosDerivadas.length; i++) { // Loop através de cada termo da derivadas em termosDerivadas
        if (resultado === '')
            resultado += montaTermo(termosDerivadas[i], true) // Primeiro termo 
        else
            resultado += montaTermo(termosDerivadas[i]) // Não é o primeiro termo
    }

    resultado = resultado.replaceAll("* +", "*")
    return resultado === "" ? "0" : resultado // Retorna a string da derivada resultante (ou "0" se todas as derivadas forem zero).
}
