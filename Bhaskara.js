function calcularRaizes(a, b, c) {
    console.log(`Calculando raízes para a=${a}, b=${b}, c=${c}`);
    const delta = b * b - 4 * a * c;
    console.log(`△ = ${b}^2 - 4 * ${a} * ${c}`)
    console.log(`△ = ${delta}`);
  
    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      console.log(`x₁ = ${-b} + √${delta} / 2 * ${a}`);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      console.log(`x₂ = ${-b} - √${delta} / 2 * ${a}`);
      console.log(`x₁ = ${x1}, x₂ = ${x2}`);
      return {
        raizes: [x1, x2],
      };
  
    } else if (delta === 0) {
      const x = -b / (2 * a);
      console.log(`x = ${-b} - √${delta} / 2 * ${a}`);
      console.log(`x = ${x}`);
      return {
        raiz: x,
      };
  
    } else {
      console.log("Não existem raízes reais.");
      return {
        tipo: "nao existem raizes reais"
      };
    }
  }
  
  const a = 3;
  const b = 12;
  const c = 9;
  
  const resultado = calcularRaizes(a, b, c);
  
  