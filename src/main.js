import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n'
import { router } from './router'

import { OhVueIcon, addIcons } from "oh-vue-icons";

import { IoMoonOutline, CoSun, RiGithubLine, FcMenu, MdClose, FaBrain, BiPencil, BiCardImage } from "oh-vue-icons/icons";

addIcons(IoMoonOutline, CoSun, RiGithubLine, FcMenu, MdClose, FaBrain, BiPencil, BiCardImage);

const app = createApp(App)
app.component('v-icon', OhVueIcon)
app.use(i18n)
app.use(router)
app.mount('#app')
