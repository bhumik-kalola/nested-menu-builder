<script setup lang="ts">
import type { PageItem as PageItems } from "../types";

defineProps<{
  pages: PageItems[];
}>();

const emit = defineEmits<{
  (e: "add-to-menu", page: PageItems): void;
}>();

const addToMenu = (page: PageItems) => {
  emit("add-to-menu", page);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold mb-4">Available Pages</h2>
    <div class="space-y-2">
      <div
        v-for="page in pages"
        :key="page.id"
        class="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
      >
        <span>{{ page.name }}</span>
        <button
          @click="addToMenu(page)"
          class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
