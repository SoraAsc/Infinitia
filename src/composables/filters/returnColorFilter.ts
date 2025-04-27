import { ImageFilter } from "../../utils/GenericTypes";

export const returnColorFilter: ImageFilter = (
    imageData: ImageData, 
    originalImageData: ImageData,
    eps: number = 1e-5 // para evitar divisão por zero
) => {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const rOrig = originalImageData.data[i];
        const gOrig = originalImageData.data[i + 1];
        const bOrig = originalImageData.data[i + 2];

        const origGray = (rOrig + gOrig + bOrig) / 3;
        const newGray = data[i];

        const scale = newGray / (origGray + eps);

        data[i] = Math.min(255, rOrig * scale);
        data[i + 1] = Math.min(255, gOrig * scale);
        data[i + 2] = Math.min(255, bOrig * scale);
    }

    return imageData;
};