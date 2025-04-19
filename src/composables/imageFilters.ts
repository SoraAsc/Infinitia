import { blackAndWhiteFilter } from "./filters/blackWhiteFilter";
import { fourierFilter } from "./filters/fourierFilter";
import { grayFilter } from "./filters/grayFilter";
import { otsuFilter } from "./filters/otsuFilter";

export const filters = {
    gray: grayFilter,
    "black-and-white": blackAndWhiteFilter,
    "otsu": otsuFilter,
    "fourier": fourierFilter,
} as const;

export type FilterType = keyof typeof filters;
