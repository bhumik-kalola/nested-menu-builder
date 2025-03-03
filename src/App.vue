<script setup lang="ts">
import { ref } from 'vue';
import MenuBuilder from './components/MenuBuilder.vue';
import type { PageItem as PageItems } from "./types"


// Sample pages data
const pages = ref<PageItems[]>([
  { id: '1', name: 'Home', url: '/home' },
  { id: '2', name: 'About', url: '/about' },
  { id: '3', name: 'Products', url: '/products' },
  { id: '4', name: 'Services', url: '/services' },
  { id: '5', name: 'Blog', url: '/blog' },
  { id: '6', name: 'Contact', url: '/contact' },
  { id: '7', name: 'FAQ', url: '/faq' },
  { id: '8', name: 'Terms', url: '/terms' },
  { id: '9', name: 'Privacy Policy', url: '/privacy' }
]);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800">Menu Builder</h1>
        <p class="text-gray-600">Create and organize your website navigation menus</p>
      </div>
    </header>
    
    <main class="container mx-auto py-6">
      <MenuBuilder :pages="pages" />
    </main>
  </div>
</template>