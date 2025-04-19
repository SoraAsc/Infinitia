import { ImageFilter } from "../../utils/GenericTypes";
import { blackAndWhiteFilter } from "./blackWhiteFilter";
import { createHistogram } from "./utils/histogram";

export const otsuFilter: ImageFilter = (imageData: ImageData) => {
    const histogramProbabilities = createHistogram(imageData)
    let bestT = 0, bestVariance = 0;
    for (let t = 0; t < 256; t++) {
        let w0 = 0, w1 = 0;
        for (let i = 0; i <= t; i++) w0 += histogramProbabilities[i];
        for (let i = t + 1; i <= 255; i++) w1 += histogramProbabilities[i];

        if(w0 === 0 || w1 === 0) continue

        let mu0 = 0, mu1 = 0;
        for (let i = 0; i <= t; i++) mu0 += i * histogramProbabilities[i]
        for (let i = t + 1; i <= 255; i++) mu1 += i * histogramProbabilities[i]
        mu0 /= w0;
        mu1 /= w1;

        const variance = w0 * w1 * (mu0 - mu1) ** 2;
        if(variance > bestVariance) {
            bestVariance = variance;
            bestT = t
        }
    }
    console.log("Limiar: " + bestT) // threshold

    blackAndWhiteFilter(imageData, bestT)

    return imageData;
};
