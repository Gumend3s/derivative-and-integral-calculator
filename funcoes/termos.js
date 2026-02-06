
/**
 * Coleta todos os dados de um termo e os separa em um objeto 
 * @param {string} termo O termo que será dissecado
 * @returns {object}    Um objeto contendo todos os dados do termo
 */
export function dissecaTermo(termo) {
    let sinalCoeficiente = "+",  // Guarda o sinal do coeficiente do termo
        sinalExpoente = "+"     // Guarda o sinal do expoente do termo

    let i
    
    let valsTermo = { // Inicia valsTermo como um termo com todos os dados zerados 
        coeficiente: "",        // Guarda o valor do coeficiente do termo
        temX: false,            // Guarda se o termo tem um x ou não]
        temParenteses: false,   // Guarda se o termo tem um parênteses ou não
        conteudoParenteses: '', // Gurda o conteúdo de um parênteses encontrado
        temPotencia: false,     // Guarda se o termo tem uma potência ou não
        temTermoPot: false,     // Guarda se o expoente tem um termo guardado em vez de um número
        expoente: "",           // Guarda o valor do expoente do termo
        temE: false,            // Guarda se o termo tem o e de Euler
        temProduto: false       // Guarda se o termo atual deve ter a regra do produto aplicada
    }
    if (termo === '' || termo === undefined) return { ...valsTermo }

    let qtdParenteses = 0 // Guarda quantos parênteses estão abertos

    if (termo[0] === '-' || termo[0] === '*' && termo[1] === '-') sinalCoeficiente = '-' // Se o termo começa com menos define o sinal como -
    
    let charAtual // Guarda o caractere atual
    for (i = 0; i < termo.length; i++) {
        charAtual = termo[i] // Obtém o caractere atual

        switch (charAtual) {
            case '*':
                valsTermo.temProduto = true // Ao encontrar um * atualiza temProduto
                break;
            case 'x':
                if (!valsTermo.temPotencia){
                    valsTermo.temX = true // Ao encontrar um x antes de um ^ atualiza temX
                } else {
                    valsTermo.expoente += 'x'    // Ao encontrar um x depois de um ^ adiciona um x no expoente
                    valsTermo.temTermoPot = true // e atualiza temTermoPot para que a potência seja tratada corretamente
                }
                break;
            case '+':
            case '-':
                if (valsTermo.temPotencia)sinalExpoente = charAtual // Ao encontrar um sinal após encontrar um ^ atualiza o sinal do expoente   
                if (valsTermo.temE)valsTermo.expoente += charAtual
                break;
            case '^':
                if (valsTermo.temX || valsTermo.temParenteses || valsTermo.temE) valsTermo.temPotencia = true // Ao encontrar uma potência após um x, 'e' ou parenteses atualiza temPotencia
                break;
            case 'e':
                valsTermo.temE = true // Ao encontrar um e atualiza temE
                break;
            case '(': // Ao encontrar o início de um parênteses guardará seu conteúdo em uma varialvel adequada
                if (!valsTermo.temPotencia) {      // Caso encontre antes de um ^ guardará em temParenteses
                    valsTermo.temParenteses = true // Atualiza temParenteses
                    qtdParenteses++                // Inicia a contagem de quantos parênteses estão abertos
                    valsTermo.conteudoParenteses = charAtual
                    do {
                        i++                                      // Avança para o próximo termo
                        valsTermo.conteudoParenteses += termo[i] // Insere o termo atual em conteudoParenteses
                        if (termo[i] === '(') qtdParenteses++    // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                        if (termo[i] === ')') qtdParenteses--    // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                    } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                } else { // Caso encontre depois de um ^ guardará em expoente
                    valsTermo.temTermoPot = true   // Atualiza temTermoPot para que a potência seja tratada corretamente
                    qtdParenteses++                // Inicia a contagem de quantos parênteses estão abertos
                    valsTermo.expoente += charAtual
                    do {
                        i++                                      // Avança para o próximo termo
                        valsTermo.expoente += termo[i]           // Insere o termo atual em expoente
                        if (termo[i] === '(') qtdParenteses++    // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                        if (termo[i] === ')') qtdParenteses--    // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                    } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                }
                break;
            case ' ':
            case '/':
                break; // Ignora / e espaços vazios
            default: // qualquer outro caractere será adicionado no coeficiente ou no expoente
                if (!valsTermo.temX && !valsTermo.temParenteses && !valsTermo.temE) valsTermo.coeficiente += charAtual // Enquanto um x ou parênteses não tiver sido encontrado, adiciona no coeficiente
                if (valsTermo.temPotencia)valsTermo.expoente += charAtual                          // Após encontrar uma potência adiciona no expoente
        }
    }

    valsTermo.coeficiente = parseFloat(sinalCoeficiente + (valsTermo.coeficiente === '' ? 1 : valsTermo.coeficiente)) // Adiciona o sinal ao valor do coeficiente
    if (isNaN(valsTermo.coeficiente)) valsTermo.coeficiente = sinalCoeficiente === '-' ? -1 : 1 // Caso tenha algum erro no coeficiente, o reseta para 1 ou -1

    if(!valsTermo.temTermoPot){ // Caso o expoente seja um número e não um termo, o valida para um número em vez de texto
        valsTermo.expoente = parseInt(sinalExpoente + (valsTermo.expoente === '' ? 1 : valsTermo.expoente)) // Adiciona o sinal ao valor do expoente
        if (isNaN(valsTermo.expoente)) { // Caso tenha algum erro no expoente, o reseta para 0 e atualiza temPotencia para falso
            valsTermo.expoente = 0
            valsTermo.temPotencia = false
        }
    } 
    return valsTermo // Retorna o objeto contendo o termo dissecado
}

/**
 * Recebe um objeto termo dissecado e o monta em forma de texto
 * @param {object} termo       Um termo em forma de termo dissecado
 * @param {boolean} primeiro   Define se o termo é o primeiro da expressão
 * @param {boolean} parenteses Define se o termo estará dentro de um parênteses
 * @param {boolean} parentesesExpoente Define se o expoente do termo estará dentro de um parênteses
 * @returns {string} O termo montado em forma de texto
 */
export function montaTermo(termo, primeiro = false, parenteses = false, parentesesExpoente = false) {
    let termoMontado = "" // Inicia o termoMontado vazio
    
    if (!((termo.temParenteses || termo.temX || termo.temE) && termo.coeficiente === 1)) // Verifica se o termo tem x, 'e' ou parênteses juntamenente com um coeficiente 1, caso tenha não o adiciona ao termo montado
        termoMontado += `${Math.abs(termo.coeficiente)}` // Em todos os outros casos adiciona o módulo do coeficiente no termo montado

    if (termo.temX) {       // Caso tenha x, o adiciona no termo
        termoMontado += "x"
    } else if(termo.temE) { // Caso tenha e, o adiciona no termo
        termoMontado += "e"
    } else if (termo.temParenteses) { // Caso tenha um parênteses o adiciona no termo 
        termoMontado += termo.conteudoParenteses
    }
    
    if (termo.temPotencia) { // Caso tenha uma potência, a adiciona no termo 
        if (parentesesExpoente && (termo.expoente[0] !== '(' || termo.expoente[0] !== ')')) {
            termoMontado += "^(" + termo.expoente + ')'
        } else
            termoMontado += '^' + termo.expoente
    }

    if (termo.coeficiente < 0) // Se o coeficiente for negativo adiciona o sinal -
        if (primeiro)
            termoMontado = `-${termoMontado}`  // Caso seja o primeiro na expressão, o - ficará colado no termo
        else
            termoMontado = ` - ${termoMontado}` // Senão, será dado o espaçamento deviduo

    if (!primeiro && termo.coeficiente >= 0 && !termo.temProduto) // Adiciona o sinal de + quando o termo é positivo, o omite quando é o primeiro termo na expressão ou quando há uma multiplicação
        termoMontado = ` + ${termoMontado}`

    if (parenteses && termo.coeficiente < 0) // Adiciona o termo dentro de parênteses quando o termo deve estar dentro de um parênteses e o termo é negativo 
        termoMontado = '(' + termoMontado.replace(" - ", "-") + ')'

    if (termo.temProduto) // Se o termo contiver um *, adiciona " * " 
        termoMontado = ` * ${termoMontado}`

    return termoMontado.replace("  ", " ") // Retorna o termo montado substituindo redundâncias de espaços duplos
}
