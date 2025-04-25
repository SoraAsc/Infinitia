import { ImageFilter } from "../../utils/GenericTypes";
import { nextPow2 } from "../../utils/MathUtils";
import { grayFilter } from "./grayFilter";

function fft1D(real: number[], imag: number[]): void {
    const n = real.length;
    const levels = Math.log2(n);

    if (Math.floor(levels) !== levels) throw new Error("Tamanho deve ser potência de 2");

    // Bit-reversal permutation
    for (let i = 0; i < n; i++) {
        let j = 0;
        for (let k = 0; k < levels; k++) j |= ((i >> k) & 1) << (levels - 1 - k);
        
        if (j > i) {
            [real[i], real[j]] = [real[j], real[i]];
            [imag[i], imag[j]] = [imag[j], imag[i]];
        }
    }

    // Cooley-Tukey FFT
    for (let size = 2; size <= n; size *= 2) {
        const half = size / 2;
        const phaseStep = -2 * Math.PI / size;
        for (let i = 0; i < n; i += size) {
            for (let j = 0; j < half; j++) {
                const k = i + j;
                const l = k + half;

                const angle = j * phaseStep;
                const wr = Math.cos(angle);
                const wi = Math.sin(angle);

                const tr = wr * real[l] - wi * imag[l];
                const ti = wr * imag[l] + wi * real[l];

                real[l] = real[k] - tr;
                imag[l] = imag[k] - ti;
                real[k] += tr;
                imag[k] += ti;
            }
        }
    }
}


function fft2D(real: number[][], imag: number[][]): void {
    const H = real.length;
    const W = real[0].length;

    // Linha por linha
    for (let y = 0; y < H; y++) fft1D(real[y], imag[y]);
    

    // Coluna por coluna
    for (let x = 0; x < W; x++) {
        const colR = new Array(H);
        const colI = new Array(H);
        for (let y = 0; y < H; y++) {
            colR[y] = real[y][x];
            colI[y] = imag[y][x];
        }

        fft1D(colR, colI);

        for (let y = 0; y < H; y++) {
            real[y][x] = colR[y];
            imag[y][x] = colI[y];
        }
    }
}

function fftShift(mag: number[][]): number[][] {
    const H = mag.length;
    const W = mag[0].length;
    const shifted = Array.from({ length: H }, () => new Array(W).fill(0));

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const newY = (y + Math.floor(H / 2)) % H;
            const newX = (x + Math.floor(W / 2)) % W;
            shifted[newY][newX] = mag[y][x];
        }
    }
    return shifted;
}

export const fourierFilter: ImageFilter = (imageData: ImageData) => {
    imageData = grayFilter(imageData);
    const { width: W, height: H } = imageData;
    const data = imageData.data;

    const PW = nextPow2(W);
    const PH = nextPow2(H);

    const real: number[][] = Array(PH).fill(0).map(() => Array(PW).fill(0));
    const imag: number[][] = Array(PH).fill(0).map(() => Array(PW).fill(0));

    // Copia o canal R (imagem em tons de cinza) para a matriz real
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            real[y][x] = data[i]; // canal R
        }
    }

    fft2D(real, imag);

    // Calcula a magnitude e aplica log para visualização
    const magnitude: number[][] = Array.from({ length: PH }, (_, y) =>
        Array.from({ length: PW }, (_, x) =>
            Math.log(1 + Math.hypot(real[y][x], imag[y][x]))
        )
    );

    // Centraliza as frequências
    const shifted = fftShift(magnitude);

    // Recorta o centro da imagem padded
    const offsetY = Math.floor((PH - H) / 2);
    const offsetX = Math.floor((PW - W) / 2);
    const recorte = Array.from({ length: H }, (_, y) =>
        Array.from({ length: W }, (_, x) =>
            shifted[offsetY + y][offsetX + x]
        )
    );

    // Normaliza e aplica gama
    let max = -Infinity;
    for (const row of recorte) {
        for (const value of row) {
            if (value > max) max = value;
        }
    }

    const gamma = 3.0;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const norm = recorte[y][x] / max;
            const val = Math.pow(norm, gamma) * 255;
            data[i] = data[i + 1] = data[i + 2] = val;
        }
    }


    return imageData;
};
