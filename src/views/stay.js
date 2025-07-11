export function calcularValorTotal(ingreso, salida, valorDia) {
  const date1 = new Date(ingreso);
  const date2 = new Date(salida);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // incluye ambos días
  return diffDays * valorDia;
}
