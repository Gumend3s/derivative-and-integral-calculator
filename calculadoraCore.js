import { calcularDerivada } from "./funcoes/derivadas.js";
import { avaliarExpressao, pontoCritico, MaxeMin } from "./funcoes/ponto_critico.js";
import { regradoTrapezio, regradoSimpson, regradoRetangulo } from "./funcoes/integral.js";

/**
 * Função principal que coordena os cálculos de derivadas e integrais.
 * Recebe todos os parâmetros de entrada e retorna um objeto com os resultados.
 * Esta função é agnóstica à interface (não usa DOM nem prompt-sync).
 * @param {string} funcao A função original (ex: "x^2 + 3*x").
 * @param {number} intervaloMin O limite inferior para busca de pontos críticos.
 * @param {number} intervaloMax O limite superior para busca de pontos críticos.
 * @param {number} integralInicio O ponto inicial para o cálculo da integral.
 * @param {number} integralFim O ponto final para o cálculo da integral.
 * @param {number} numDivisoes O número de divisões para as integrais.
 * @returns {object} Um objeto contendo todos os resultados dos cálculos.
 */
export function realizarCalculos(funcao, intervaloMin, intervaloMax, integralInicio, integralFim, numDivisoes) {
    const resultados = {};

    try {
        // --- Cálculos de Derivadas ---
        resultados.primeiraDerivada = calcularDerivada(funcao);
        resultados.segundaDerivada = calcularDerivada(resultados.primeiraDerivada);

        // --- Pontos Críticos e Max/Min/Inflexão ---
        // As funções pontoCritico e MaxeMin já retornam arrays ou objetos, o que é ideal.
        const Xpc = pontoCritico(resultados.primeiraDerivada, intervaloMin, intervaloMax);
        resultados.pontosCriticos = Xpc;
        resultados.classificacaoPontos = MaxeMin(resultados.segundaDerivada, Xpc);

        // --- Cálculos de Integrais ---
        resultados.integralTrapezio = regradoTrapezio(funcao, integralInicio, integralFim, numDivisoes);
        resultados.integralSimpson = regradoSimpson(funcao, integralInicio, integralFim, numDivisoes);
        resultados.integralRiemannEsquerda = regradoRetangulo(funcao, integralInicio, integralFim, numDivisoes, 'esquerda');
        resultados.integralRiemannMeio = regradoRetangulo(funcao, integralInicio, integralFim, numDivisoes, 'meio');
        resultados.integralRiemannDireita = regradoRetangulo(funcao, integralInicio, integralFim, numDivisoes, 'direita');

    } catch (e) {
        // Captura erros de avaliação de expressão, etc., e retorna um erro amigável
        console.error("Erro no motor de cálculo:", e);
        return {
            error: "Erro ao processar a função. Verifique a sintaxe ou os parâmetros.",
            details: e.message
        };
    }

    return resultados;
}