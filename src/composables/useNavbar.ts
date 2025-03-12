import { ref } from 'vue'

const showNavbar = ref(true)

export function useNavbar() {
  const toggleNavbar = (show: boolean) => {
    showNavbar.value = show
  }

  return {
    showNavbar,
    toggleNavbar
  }
} 