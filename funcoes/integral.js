import {
    avaliarExpressao
} from "./ponto_critico.js";

import {
    corrigirFuncao
} from "./funcoes.js";

// Calcula a integral pela regra do trapézio
export function regradoTrapezio(funcao, inicial, final, numeroDivisoes) {
    funcao = corrigirFuncao(funcao)
    let h = (final - inicial) / numeroDivisoes // Calcula o valor de H(a base de x no gráfico)
    let soma = avaliarExpressao(funcao, inicial) + avaliarExpressao(funcao, final) // Calcula a soma do ponto inicial + final
    let resultado = 0

    // Calcula o ponto entre todos os trapézios
    for (let i = 1; i < numeroDivisoes; i++) {
        let x = (Number(inicial) + (i * h))   // Calcula os pontos de cada trapézio
        soma += 2 * avaliarExpressao(funcao, x) // multiplica o calculo dos trapézios por 2 e acumulam eles na variavel soma
    }
    resultado = soma * (h / 2)
    if(!isFinite(resultado)){
        return "Divergente/Indefinido"
    }
    return Number(resultado.toFixed(4))
}

// Calcula a integral pela regra de Simpson
export function regradoSimpson(funcao, inicial, final, numeroDivisoes) {
    funcao = corrigirFuncao(funcao)
    if (numeroDivisoes % 2 != 0) // Checa se o número de divisões é par, se não for, adiciona 1
        numeroDivisoes++
    let h = (final - inicial) / numeroDivisoes  // Calcula o valor de H(a base de x no gráfico)
    let soma = avaliarExpressao(funcao, inicial) + avaliarExpressao(funcao, final) // Calcula a soma do ponto inicial + final
    let resultado = 0

    // Calcula o ponto entre todas as parábolas
    for (let i = 1; i < numeroDivisoes; i++) {
        let x = (Number(inicial) + (i * h))   // Calcula os pontos de cada parábola
        let peso = (i % 2 === 0) ? 2 : 4    // Calcula o peso do número, 2 para impar e 4 para par
        soma += peso * avaliarExpressao(funcao, x) // multiplica o calculo das parábolas pelo peso e acumulam eles na variavel soma
    }
    resultado = soma * (h / 3)
    if(!isFinite(resultado)){
        return "Divergente/Indefinido"
    }
    return Number(resultado.toFixed(4))
}

export function regradoRetangulo(funcao, inicial, final, numeroDivisoes, tipo = 'meio') {
    funcao = corrigirFuncao(funcao)
    let h = (final - inicial) / numeroDivisoes // Calcula o valor de H(a base de x no gráfico)
    let resultado = 0
    let soma = 0

    // Calcula o ponto entre todos os Retângulo
    for (let i = 0; i < numeroDivisoes; i++) {
        let x 
        if (tipo === 'esquerda') {
            x = (Number(inicial) + (i * h))
        } else if (tipo === 'direita') {
            x = (Number(inicial) + (i + 1) * h)
        } else { // meio
            x = (Number(inicial) + (i + 0.5) * h)
        }
        soma += avaliarExpressao(funcao, x) // Acumulam os cálculos na variavel soma
    }
    resultado = soma * h
       if(!isFinite(resultado)){
        return "Divergente/Indefinido"
    }
 
    return Number(resultado.toFixed(4))
}
