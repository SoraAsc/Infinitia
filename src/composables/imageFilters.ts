export type ImageFilter = (imageData: ImageData) => ImageData;

export const blackAndWhiteFilter: ImageFilter = (imageData: ImageData) => {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;      // R
        data[i + 1] = avg;  // G
        data[i + 2] = avg;  // B
    }
    
    return imageData;
};

export const filters = {
    'black-and-white': blackAndWhiteFilter,
} as const;

export type FilterType = keyof typeof filters; 