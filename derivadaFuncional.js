import { calcularDerivada } from "./funcoes/derivadas.js";
import { avaliarExpressao, pontoCritico, MaxeMin } from "./funcoes/ponto_critico.js";
import { regradoTrapezio, regradoSimpson, regradoRetangulo } from "./funcoes/integral.js";
import promptSync from "prompt-sync"; // Importa a função prompt-sync como padrão

function calculadoraDerivadaIntegral() {
  const prompt = promptSync();// Importa a biblioteca 'prompt-sync' para ler a entrada do usuário no terminal.

  /**
   * Obtém a função matemática inserida pelo usuário.
   * Retorna A função matemática como uma string.
   */
  function obterFuncaoDoUsuario() {
    let funcaoOriginal;
    const caracteresValidos = /^[0-9+\-*/^().%xeE\s]+$/i;
    while (true) {
      funcaoOriginal = prompt("Digite uma função (ex: 2x^3 + 5x - e^x): f(x) = ");

      // Verifica se há apenas caracteres válidos
      if (!caracteresValidos.test(funcaoOriginal)) {
        console.log("Expressão inválida.");
        continue;
      }

      // Aqui você pode adicionar um teste com `eval`, se quiser, ou apenas aceitar
      console.log(`Função digitada: ${funcaoOriginal}`);
      return funcaoOriginal;
    }
  }

  function intervaloBusca() {
    let intervaloMin = (prompt("Digite o intervalo minimo da busca: "))
    let intervaloMax = (prompt("Digite o intervalo maximo da busca: "))



    if (isNaN(intervaloMin) || isNaN(intervaloMax) || intervaloMin === '' || intervaloMax === '' || intervaloMin >= intervaloMax) {
      console.log("Valor inválido ou vazio para o intervalo mínimo ou máximo. Usando -10 a 10 como padrão.");
      intervaloMin = "-10"
      intervaloMax = "10"
    }
    return { intervaloMin, intervaloMax }
  }

  function pontoInicial_e_Final() {
    let inicio = (prompt("Digite o ponto inicial da integral: ")) // Solicita ao usuário que digite o ponto inicial da integral
    let fim = (prompt("Digite o ponto final da integral: ")) // Solicita ao usuário que digite o ponto final da integral


    if (isNaN(inicio) || isNaN(fim) || inicio === '' || fim === '' || inicio >= fim) { // checa se é um numero válido

      console.log("Valor inválido ou vazio para o ponto inical ou final. Usando 0 a 10 como padrão.");
      inicio = "0"
      fim = "10"
    }

    return { inicio, fim }
  }

  function numDivisoesIntegral() {
    let quantidade = (prompt("Digite a quantidade de divisões da integral: ")) // Solicita ao usuário que digite o numero de divisões


    if (isNaN(quantidade) || quantidade === '' || quantidade === '0') { // checa se é um numero válido

      console.log("Valor inválido ou vazio para o número de divisões. 10 como padrão.");
      quantidade = "10"
    }
    return quantidade
  }

  /**
   * Função principal que coordena o processo.
   */
  function main() {
    let funcao = obterFuncaoDoUsuario() // Obtém a função inserida pelo usuário.
    console.log("\n<========== Derivando ==========>")
    const primeiraDerivada = calcularDerivada(funcao) // Calcula a primeira derivada da função.
    console.log(`A primeira derivada é: ${primeiraDerivada}`) // Exibe a primeira derivada no console.
    const segundaDerivada = calcularDerivada(primeiraDerivada)
    console.log(`A segunda derivada é: ${segundaDerivada}`) // Exibe a segunda derivada da função.

    console.log("\n<========== Escolha dos Intervalos de busca ==========>")
    const intervalo = intervaloBusca()

    console.log("\n<========== Pontos Críticos ==========>");
    // 1. Assumimos que 'pontoCritico' retorna um ARRAY de pontos críticos (Xpc's)
    // Se não houver pontos, deve retornar um array vazio: []
    const pontosCriticosX = pontoCritico(primeiraDerivada, intervalo.intervaloMin, intervalo.intervaloMax);
    if (!pontosCriticosX || pontosCriticosX.length === 0) {
    } else {  
      const pontosCriticosComY = [];
      console.log("\n<========== Valores de Y para cada Ponto Crítico ==========>");
      for (let i = 0; i < pontosCriticosX.length; i++) {
      const Xpc = pontosCriticosX[i];
      const pontoY = avaliarExpressao(funcao, Xpc);
      pontosCriticosComY.push({ x: Xpc, y: pontoY });
      console.log(`Ponto Crítico: X = ${Xpc}, Y = ${pontoY}`);
    }

      console.log("\n<========== Análise de Máximos e Mínimos ==========>");
      const analiseMaxMin = MaxeMin(segundaDerivada, pontosCriticosX);

      if (analiseMaxMin) {
        if (analiseMaxMin.minimos && analiseMaxMin.minimos.length > 0) {
          console.log(`Pontos de Mínimo: ${(analiseMaxMin.minimos)}`);
        }
        if (analiseMaxMin.maximos && analiseMaxMin.maximos.length > 0) {
          console.log(`Pontos de Máximo: ${(analiseMaxMin.maximos)}`);
        }
        if (analiseMaxMin.inflexao && analiseMaxMin.inflexao.length > 0) {
          console.log(`Pontos de Inflexão: ${(analiseMaxMin.inflexao)}`);
        }
        if (analiseMaxMin.minimos.length === 0 && analiseMaxMin.maximos.length === 0 && analiseMaxMin.inflexao.length === 0) {
          console.log("Nenhum ponto de mínimo, máximo ou inflexão classificado.");
        }
      } else {
        console.log("Não foi possível classificar os pontos críticos (função MaxeMin retornou nulo ou vazio).");
      }
    }
    console.log("\n<========== Integral Nº Divisão ==========>")
    const divisoes = numDivisoesIntegral()
    console.log("\n<========== Escolha dos Intervalos da Integral ==========>")
    const inicioFim = pontoInicial_e_Final()
    console.log("\n<========== Resultado Integral ==========>")
    const trapezio = regradoTrapezio(funcao, inicioFim.inicio, inicioFim.fim, divisoes)
    console.log(`A integral por Trapézio é aproximadamente: ${trapezio}`) // Exibe a integral por trapezio da função.
    const simpson = regradoSimpson(funcao, inicioFim.inicio, inicioFim.fim, divisoes)
    console.log(`A integral por Simpson é aproximadamente: ${simpson}`) // Exibe a integral por simpson da função.
    const esquerda = regradoRetangulo(funcao, inicioFim.inicio, inicioFim.fim, divisoes, 'esquerda')
    const meio = regradoRetangulo(funcao, inicioFim.inicio, inicioFim.fim, divisoes, 'meio')
    const direita = regradoRetangulo(funcao, inicioFim.inicio, inicioFim.fim, divisoes, 'direita')
    console.log(`A integral por Riemann(esquerda) é aproximadamente: ${esquerda}`) // Exibe a integral por Riemann da função.
    console.log(`A integral por Riemann(meio) é aproximadamente: ${meio}`) // Exibe a integral por Riemann da função.
    console.log(`A integral por Riemann(direita) é aproximadamente: ${direita}`) // Exibe a integral por Riemann da função.
    /*
      console.log(separarFuncao(primeiraDerivada))
      const segundaDerivada = calcularDerivada(primeiraDerivada) // Calcula a segunda derivada da função.
      console.log(`A segunda derivada é: ${segundaDerivada}`) // Exibe a segunda derivada no console.
    */

  }

  main() // Chama a função principal para iniciar o programa.
}

calculadoraDerivadaIntegral() // Chama a função principal da calculadora.
// 2(3e^(2x+3x^2))^5x