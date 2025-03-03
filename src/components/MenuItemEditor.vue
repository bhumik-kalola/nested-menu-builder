<script setup lang="ts">
import { ref } from "vue";
import type { MenuItem as MenuItemType } from '../types';

const props = defineProps<{
  item: MenuItemType;
}>();

const emit = defineEmits<{
  (e: "update", item: MenuItemType): void;
  (e: "delete"): void;
  (e: "move-up"): void;
  (e: "move-down"): void;
  (e: "move-out"): void;
  (e: "cancel"): void;
}>();

const label = ref(props.item.label);
const url = ref(props.item.url);
const cssClass = ref(props.item.cssClass || "");

const updateItem = () => {
  emit("update", {
    ...props.item,
    label: label.value,
    url: url.value,
    cssClass: cssClass.value,
    isEditing: false,
  });
};

const deleteItem = () => {
  emit("delete");
};

const cancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Label</label
        >
        <input
          v-model="label"
          type="text"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input
          v-model="url"
          type="text"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Class CSS (optional)</label
        >
        <input
          v-model="cssClass"
          type="text"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-gray-700">Move:</span>
        <button
          @click="$emit('move-up')"
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Move up
        </button>
        <button
          @click="$emit('move-down')"
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Move Down
        </button>
        <button
          @click="$emit('move-out')"
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Out from parent
        </button>
      </div>

      <div class="flex justify-between">
        <button
          @click="deleteItem"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
        <div class="space-x-2">
          <button
            @click="cancel"
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="updateItem"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update item
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
