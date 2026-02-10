
/**
 * Collects all the data on a given term and organizes it on an object
 * @param {string} term The term that will be dissected
 * @returns {object}    Um objeto contendo todos os dados do term
 */
export function dissectTerm(term) {
    let coefSign = "+",  // Stores the sign of the term's coefficient
        expoSign = "+",  // Stores the sign of the term's exponent
        i
    
    let termVals = {            // Starts termVals as a dissected term with all values resetted 
        coefficient: "",        // Stores the term's coefficient value
        hasX: false,            // Stores if the term has an X in it
        hasParentheses: false,  // Stores if the term has an parentheses in it
        parenthesesContent: '', // stores the content of a found parentheses
        hasExp: false,          // Stores if the term has an exponent in it
        hasExpTerm: false,      // Stores if the exponent is another term instead of just a number
        exponent: "",           // Stores the value of the exponent of the term
        hasE: false,            // Stores if the term has Euler's E
        hasProduct: false       // Stores if the term needs the product rule to be applied
    }
    if (term === '' || term === undefined) return { ...termVals } // returns a blank dissected term if the given term is incorect or empty

    let parenthesesCount = 0 // Stores how many parentheses are open

    if (term[0] === '-' || term[0] === '*' && term[1] === '-') coefSign = '-' // If the term starts with - or *- sets the coefficient sign as -
    
    let currentChar // Stores the current character
    for (i = 0; i < term.length; i++) {
        currentChar = term[i] // Gets the current character

        switch (currentChar) {
            case '*':
                termVals.hasProduct = true // Upon finding an * updates hasProduct
                break;
            case 'x':
                if (!termVals.hasExp){
                    termVals.hasX = true // Upon finding an x before and ^ updates hasX
                } else {
                    termVals.exponent += 'x'    // Upon finding an x after an ^ adds an x to the exponent
                    termVals.hasExpTerm = true  // and updates hasExpTerm for the exponent to be treated correctly
                }
                break;
            case '+':
            case '-':
                if (termVals.hasExp)expoSign = currentChar // Upon finding an sign after an ^ updates the exponent sign
                if (termVals.hasE)termVals.exponent += currentChar
                break;
            case '^':
                if (termVals.hasX || termVals.hasParentheses || termVals.hasE) termVals.hasExp = true // Upon finding an exponent after an x, e or a parentheses updates hasExp
                break;
            case 'e':
                termVals.hasE = true // Upon finding an e updates hasE
                break;
            case '(': // Upon finding the start of a parentheses will store it's content on a appropriate variable
                if (!termVals.hasExp) {               // If a ^ wasn't found before the parentheses will store on parenthesesContent
                    termVals.hasParentheses = true    // Updates hasParentheses
                    parenthesesCount++                // Starts the count of how many parentheses are open
                    termVals.parenthesesContent = currentChar 
                    do {
                        i++                                        // Advances to the next character
                        termVals.parenthesesContent += term[i]     // Iserts the current character in parenthesesContent
                        if (term[i] === '(') parenthesesCount++    // Upon finding the start of a new parentheses incresases parenthesesCount
                        if (term[i] === ')') parenthesesCount--    // Upon finding the end of a parentheses decreases parenthesesCount
                    } while (parenthesesCount > 0) // Repeats until there are no more open parentheses
                } else {                              // If a ^ was found before the parentheses will store on exponent
                    termVals.hasExpTerm = true        // Atualiza hasExpTerm para que a potência seja tratada corretamente
                    parenthesesCount++                // Inicia a contagem de quantos parentheses estão abertos
                    termVals.exponent += currentChar
                    do {
                        i++                                        // Advances to the next character
                        termVals.exponent += term[i]               // Iserts the current character in exponent
                        if (term[i] === '(') parenthesesCount++    // Upon finding the start of a new parentheses incresases parenthesesCount
                        if (term[i] === ')') parenthesesCount--    // Upon finding the end of a parentheses decreases parenthesesCount
                    } while (parenthesesCount > 0) // Repeats until there are no more open parentheses
                }
                break;
            case ' ':
            case '/':
                break; // Ignores / and blank spaces
            default: // any other character will be added to either coefficient ou exponent depending on the circunstances
                if (!termVals.hasX && !termVals.hasParentheses && !termVals.hasE) termVals.coefficient += currentChar // whaile and x, e or parentheses hasn't been found, adds to coefficient
                if (termVals.hasExp)termVals.exponent += currentChar                          // After finding an exponent add to exponent
        }
    }

    termVals.coefficient = parseFloat(coefSign + (termVals.coefficient === '' ? 1 : termVals.coefficient)) // Adds the sign to the coefficient
    if (isNaN(termVals.coefficient)) termVals.coefficient = coefSign === '-' ? -1 : 1 // If there is an error in the coefficient, resets it to 1 or -1

    if(!termVals.hasExpTerm){ // If the exponent is a number and not a term, validates it to a number instead of a string
        termVals.exponent = parseInt(expoSign + (termVals.exponent === '' ? 1 : termVals.exponent)) // Adds the sign to the value of the exponent
        if (isNaN(termVals.exponent)) { // If there's a error in the exponent, resets it to 0 and updates hasExp to false
            termVals.exponent = 0
            termVals.hasExp = false
        }
    } 
    return termVals // Returns the object containing the dissected term
}

/**
 * Receives an dissected term and assembles it in a string
 * @param {object} term                 A term in the form of a dissected term
 * @param {boolean} first               Defines if the term is the first in a expression
 * @param {boolean} parentheses         Defines if the term needs to be inside an parentheses
 * @param {boolean} parenthesesExponent Defines if the expoent of the term needs to be inside an parentheses
 * @returns {string} The assembled term in the form of a string
 */
export function assembleTerm(term, first = false, parentheses = false, parenthesesExponent = false) {
    let assembledTerm = "" // Starts assembledTerm empty
    
    if (!((term.hasParentheses || term.hasX || term.hasE) && term.coefficient === 1)) // Verifica se o term tem x, 'e' ou parentheses juntamenente com um coefficient 1, caso tenha não o adiciona ao term montado
        assembledTerm += `${Math.abs(term.coefficient)}` // Em todos os outros casos adiciona o módulo do coefficient no term montado

    if (term.hasX) {       // Caso tenha x, o adiciona no term
        assembledTerm += "x"
    } else if(term.hasE) { // Caso tenha e, o adiciona no term
        assembledTerm += "e"
    } else if (term.hasParentheses) { // Caso tenha um parentheses o adiciona no term 
        assembledTerm += term.parenthesesContent
    }
    
    if (term.hasExp) { // Caso tenha uma potência, a adiciona no term 
        if (parenthesesExponent && (term.exponent[0] !== '(' || term.exponent[0] !== ')')) {
            assembledTerm += "^(" + term.exponent + ')'
        } else
            assembledTerm += '^' + term.exponent
    }

    if (term.coefficient < 0) // Se o coefficient for negativo adiciona o sinal -
        if (first)
            assembledTerm = `-${assembledTerm}`  // Caso seja o first na expressão, o - ficará colado no term
        else
            assembledTerm = ` - ${assembledTerm}` // Senão, será dado o espaçamento deviduo

    if (!first && term.coefficient >= 0 && !term.hasProduct) // Adiciona o sinal de + quando o term é positivo, o omite quando é o first term na expressão ou quando há uma multiplicação
        assembledTerm = ` + ${assembledTerm}`

    if (parentheses && term.coefficient < 0) // Adiciona o term dentro de parentheses quando o term deve estar dentro de um parentheses e o term é negativo 
        assembledTerm = '(' + assembledTerm.replace(" - ", "-") + ')'

    if (term.hasProduct) // Se o term contiver um *, adiciona " * " 
        assembledTerm = ` * ${assembledTerm}`

    return assembledTerm.replace("  ", " ") // Retorna o term montado substituindo redundâncias de espaços duplos
}
