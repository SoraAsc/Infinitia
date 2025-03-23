import { computed, ref } from "vue";
import { filters, FilterType } from './imageFilters';

export function useImageEditor() {
    const currentFile = ref<File | null>(null)
    const currentImageUrl = ref<string | null>(null)

    const history = ref<ImageData[]>([])
    const currentStep = ref(-1)
    
    const canUndo = computed(() => currentStep.value > 0)
    const canRedo = computed(() => currentStep.value < history.value.length - 1)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const updateCurrentImageUrl = () => currentImageUrl.value = canvas.toDataURL()

    const loadImage = (file: File): Promise<void> => {
        currentFile.value = file
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if(e.target?.result) {
                    currentImageUrl.value = e.target.result as string
                    const img = new Image()
                    img.onload = () => {
                        canvas.width = img.width
                        canvas.height = img.height
                        ctx?.drawImage(img, 0, 0)
                        if(ctx) {
                            const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
                            history.value = [initialState]
                            currentStep.value = 0
                            resolve()
                        } else reject(new Error('Failed to create canvas context'))
                    }
                    img.onerror = () => reject(new Error('Failed to load image'))
                    img.src = currentImageUrl.value
                }
            }
            reader.onerror = (err) => reject(err)
            reader.readAsDataURL(file)
        })
    }

    const applyFilter = (filterType: FilterType) => {
        if (!ctx || currentStep.value === -1) return;

        const filter = filters[filterType];
        if (filter) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const processedImageData = filter(imageData);
            ctx.putImageData(processedImageData, 0, 0);
            updateCurrentImageUrl();

            if (currentStep.value < history.value.length - 1) history.value.splice(currentStep.value + 1);
            
            history.value.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            currentStep.value++;
        } else reset();
    }

    const restoreHistory = (step: number) => {
        if (!ctx || !history.value[step]) return;
        ctx.putImageData(history.value[step], 0, 0);
        updateCurrentImageUrl();
    };

    const undo = () => {
        if (canUndo.value) {
            currentStep.value--;
            restoreHistory(currentStep.value);
        }
    };
    
    const redo = () => {
        if (canRedo.value) {
            currentStep.value++;
            restoreHistory(currentStep.value);
        }
    };

    const reset = () => {
        if (!ctx || currentStep.value === -1) return;
        ctx.putImageData(history.value[0], 0, 0);
        currentStep.value = 0;
        updateCurrentImageUrl();
    };

    const download = () => {
        if (!currentImageUrl.value) return;
        
        const link = document.createElement('a');
        link.download = currentFile.value?.name || 'edited-image.png';
        link.href = currentImageUrl.value;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        currentFile,
        history,
        currentStep,
        canUndo,
        canRedo,
        currentImageUrl,
        loadImage,
        undo,
        redo,
        applyFilter,
        download,
    }
}