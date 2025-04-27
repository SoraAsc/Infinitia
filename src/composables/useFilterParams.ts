import { reactive, watch } from 'vue'

export interface FilterParamMeta<T> {
  options?: T[]
  range?: { min: number; max: number }
  description?: string
}

export function useFilterParams<T extends Record<string, any>>(
  filterName: string,
  defaults: T,
  meta: Partial<Record<keyof T, FilterParamMeta<T[keyof T]>>> = {}
): T {
  const storageKey = `filter-${filterName}`
  const saved = localStorage.getItem(storageKey)
  // Initialize reactive params from saved or defaults
  const params = reactive<T>(saved ? JSON.parse(saved) : defaults) as T

  // Expose params and metadata in window for console access
  const globalName = `filter_${filterName}`;
  (window as any)[globalName] = params;
  (window as any)[`${globalName}_meta`] = meta;

  // Initial console info
  console.info(`[${globalName}] initialized with:`, params);
  console.info(`[${globalName}] metadata:`, meta);

  // Watch for changes, validate, and persist
  watch(params, (newVal) => {
      let mutated = false;
      (Object.keys(newVal) as (keyof T)[]).forEach((key) => {
        const value = newVal[key];
        const m = meta[key];
        if (!m) return;
        // Validate options
        if (m.options && !m.options.includes(value)) {
          console.warn(`[${globalName}] invalid value for '${String(key)}':`, value, `→ allowed:`, m.options);
          // reset
          params[key] = defaults[key];
          mutated = true;
        }
        // Validate range
        if (m.range && typeof value === 'number' && (value < m.range.min || value > m.range.max)) {
          console.warn(`[${globalName}] '${String(key)}' out of range:`, value, `→ range: [${m.range.min}, ${m.range.max}]`);
          // clamp
          params[key] = Math.min(Math.max(value, m.range.min), m.range.max) as any;
          mutated = true;
        }
      })
      // Persist after possible mutation
      if (mutated) console.info(`[${globalName}] after validation:`, params)
      
      localStorage.setItem(storageKey, JSON.stringify(newVal))
    },
    { deep: true }
  )

  return params
}