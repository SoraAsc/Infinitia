import { FourierMode, FourierOptions, ImageFilter, RecolorizeMethod } from "../../utils/GenericTypes";
import { nextPow2 } from "../../utils/MathUtils";
import { grayFilter } from "./grayFilter";
import { otsuFilter } from "./otsuFilter";
import { returnColorFilter } from "./returnColorFilter";

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


function ifft1D(real: number[], imag: number[]): void {
    const n = real.length;
    // 1) conjugar
    for (let i = 0; i < n; i++) imag[i] = -imag[i];
    // 2) FFT forward
    fft1D(real, imag);
    // 3) conjugar de novo e normalizar
    for (let i = 0; i < n; i++) {
        real[i] = real[i] / n;
        imag[i] = -imag[i] / n;
    }
}
  
function ifft2D(real: number[][], imag: number[][]): void {
    const H = real.length, W = real[0].length;
    // linhas
    for (let y = 0; y < H; y++) ifft1D(real[y], imag[y]);
    // colunas
    for (let x = 0; x < W; x++) {
        const colR = new Array(H), colI = new Array(H);
        for (let y = 0; y < H; y++) {
            colR[y] = real[y][x];
            colI[y] = imag[y][x];
        }
        ifft1D(colR, colI);
        for (let y = 0; y < H; y++) {
            real[y][x] = colR[y];
            imag[y][x] = colI[y];
        }
    }
}

export const fourierFilter: ImageFilter = (
    imageData: ImageData,
    originalImageData: ImageData,
    opts: Partial<FourierOptions> = {}
  ) => {
    const o = {
        mode: "lowpass" as FourierMode,
        cutoffLow: 0.1,
        cutoffHigh: 0.2,
        gamma: 3.0,
        applyInverse: true,     // por padrão só mostra espectro
        recolorizeMethod: "none" as RecolorizeMethod,
        ...opts
    };
  
    const { width: W, height: H } = imageData;
    const data = imageData.data;
  
    // 1) cinza
    grayFilter(imageData);
  
    // 2) prepara padding real/imag
    const PW = nextPow2(W), PH = nextPow2(H);
    const real = Array.from({ length: PH }, () => Array(PW).fill(0));
    const imag = Array.from({ length: PH }, () => Array(PW).fill(0));
    for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) real[y][x] = data[(y*W + x)*4];
  
    // 3) FFT
    fft2D(real, imag);
  
    // 4) parâmetros de corte
    const R = Math.min(PW,PH)/2;
    const rLow  = R * o.cutoffLow!;
    const rHigh = R * o.cutoffHigh!;
    // 5) criador de máscaras
    const maskFns: Record<FourierMode, (d: number) => number> = {
        spectrum:  () => 1,
        lowpass:  d => d <= rLow ? 1 : 0,
        highpass: d => d >= rLow ? 1 : 0,
        bandpass: d => (d >= rLow && d <= rHigh) ? 1 : 0,
        bandstop: d => (d < rLow || d > rHigh) ? 1 : 0,
        softgauss: d => Math.exp(-d*d/(2*rLow*rLow)),
        glitch:   () => 1, // não usa máscara binária
    };

    // 6) aplica máscara/binário ou fator
    for (let y = 0; y < PH; y++) {
        const dy = y <= PH/2 ? y : y - PH;
        for (let x = 0; x < PW; x++) {
            const dx = x <= PW/2 ? x : x - PW;
            const d = Math.hypot(dx, dy);
            const w = maskFns[o.mode](d);
            real[y][x] *= w;
            imag[y][x] *= w;
        }
    }

    // 7) glitch art = randomiza fase
    if (o.mode === "glitch") {
        const phaseRand = Math.PI; // amplitude de variação
        for (let y = 0; y < PH; y++) {
            for (let x = 0; x < PW; x++) {
                const mag = Math.hypot(real[y][x], imag[y][x]);
                const phi = Math.atan2(imag[y][x], real[y][x]) + (Math.random() - 0.5) * phaseRand;
                real[y][x] = mag * Math.cos(phi);
                imag[y][x] = mag * Math.sin(phi);
            }
        }
    }

    // 8) decide se desenha espectro ou reconstrói
    const needSpectrum = o.mode === "spectrum" || !o.applyInverse;
    if (needSpectrum) {
        // (a) gera magnitude log+shift igual ao antes
        const mag = Array.from({ length: PH }, (_, y) =>
            Array.from({ length: PW }, (_, x) =>
                Math.log(1 + Math.hypot(real[y][x], imag[y][x]))
            )
        );
        const shifted = fftShift(mag);
        const offY = Math.floor((PH-H)/2), offX = Math.floor((PW-W)/2);
        // (b) normaliza e aplica gamma
        let m = -Infinity;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) m = Math.max(m, shifted[offY+y][offX+x]);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const v = shifted[offY+y][offX+x] / m;
                const val = Math.pow(v, o.gamma!) * 255;
                const idx = (y*W + x)*4;
                data[idx] = data[idx+1] = data[idx+2] = val;
            }
        }
        return imageData;
    }

    // 9) caso contrário: IFFT e normaliza imagem filtrada
    ifft2D(real, imag);
    let mn = Infinity, mx = -Infinity;
    for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
            const v = real[y][x];
            mn = Math.min(mn, v);
            mx = Math.max(mx, v);
        }
    for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
            const norm = (real[y][x] - mn) / (mx - mn);
            const val  = Math.round(norm * 255);
            const idx  = (y*W + x)*4;
            data[idx] = data[idx+1] = data[idx+2] = val;
        }

    if(o.recolorizeMethod == "color") returnColorFilter(imageData, originalImageData);
    else if(o.recolorizeMethod === "black") otsuFilter(imageData);
    
    return imageData;
};
