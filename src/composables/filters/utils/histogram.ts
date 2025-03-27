export const createHistogram = (imageData: ImageData) => {
    const data = imageData.data;

    const histogram = new Float32Array(256).fill(0);
    const numPixels = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
        const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
        histogram[avg] += 1;
    }
    normalizeHistogram(histogram, numPixels)
    // console.log(histogram.reduce((acc, val) => acc + val, 0)) // Should be 1
    // console.log(histogram);
    return histogram;
}

const normalizeHistogram = (histogram: Float32Array, maxCount: number) => {
    for (let i = 0; i < histogram.length; i++) histogram[i] /= maxCount;
}