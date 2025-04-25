// calcula a próxima potência de 2 ≥ n
export function nextPow2(n: number): number {
    return 1 << Math.ceil(Math.log2(n));
}