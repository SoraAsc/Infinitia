export type ImageFilter = (imageData: ImageData, ...args: any[]) => ImageData;

export type FourierMode = "spectrum" | "lowpass" | "highpass" | "bandpass" | "bandstop" | "softgauss" | "glitch";
export type RecolorizeMethod = "none" | "black" | "color";
export interface FourierOptions {
  mode: FourierMode;
  cutoffLow?: number;    // [0,1]
  cutoffHigh?: number;   // só pra bandpass
  gamma?: number;        // só pra spectrum
  applyInverse?: boolean;// se true, faz IFFT e retorna imagem espacial
  recolorizeMethod: RecolorizeMethod;
}
