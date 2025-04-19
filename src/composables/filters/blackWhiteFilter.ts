import { ImageFilter } from "../../utils/GenericTypes";

export const blackAndWhiteFilter: ImageFilter = (imageData: ImageData, threshold: number = 127) => {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let colorIntensity = 255;
        if(avg < threshold) colorIntensity = 0;
        data[i] = colorIntensity; // R
        data[i + 1] = colorIntensity; // G
        data[i + 2] = colorIntensity; // B
    }

    return imageData;
};