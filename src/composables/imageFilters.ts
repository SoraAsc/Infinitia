import { blackAndWhiteFilter } from "./filters/blackWhiteFilter";
import { grayFilter } from "./filters/grayFilter";
import { otsuFilter } from "./filters/otsuFilter";

export const filters = {
    gray: grayFilter,
    "black-and-white": blackAndWhiteFilter,
    "otsu": otsuFilter,
} as const;

export type FilterType = keyof typeof filters;
