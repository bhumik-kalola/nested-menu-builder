<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MenuItem as MenuItemType } from '../types';
import MenuItemEditor from './MenuItemEditor.vue';

const props = defineProps<{
  item: MenuItemType;
  level: number;
}>();

const emit = defineEmits<{
  (e: 'update', item: MenuItemType): void;
  (e: 'delete', id: string): void;
  (e: 'move-up', id: string): void;
  (e: 'move-down', id: string): void;
  (e: 'move-out', id: string): void;
  (e: 'add-child', id: string): void;
}>();

const isExpanded = ref(props.item.isExpanded || false);
const isEditing = ref(props.item.isEditing || false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  emit('update', { ...props.item, isExpanded: isExpanded.value });
};

const startEditing = () => {
  isEditing.value = true;
  emit('update', { ...props.item, isEditing: true });
};

const updateItem = (updatedItem: MenuItemType) => {
  isEditing.value = false;
  emit('update', updatedItem);
};

const cancelEditing = () => {
  isEditing.value = false;
  emit('update', { ...props.item, isEditing: false });
};

const deleteItem = () => {
  emit('delete', props.item.id);
};

const moveUp = () => {
  emit('move-up', props.item.id);
};

const moveDown = () => {
  emit('move-down', props.item.id);
};

const moveOut = () => {
  emit('move-out', props.item.id);
};

const addChild = () => {
  emit('add-child', props.item.id);
};

const hasChildren = computed(() => props.item.children && props.item.children.length > 0);
const itemType = computed(() => hasChildren.value ? 'Submenu' : 'Link');
const paddingLeft = computed(() => `${props.level * 1.5}rem`);
</script>

<template>
  <div class="nested-sortable-item">
    <div v-if="isEditing">
      <MenuItemEditor 
        :item="item" 
        @update="updateItem" 
        @delete="deleteItem"
        @move-up="moveUp"
        @move-down="moveDown"
        @move-out="moveOut"
        @cancel="cancelEditing"
      />
    </div>
    <div 
      v-else
      class="flex items-center justify-between p-2 border border-gray-200 bg-white rounded mb-2 cursor-move"
      :style="{ paddingLeft }"
      :data-id="item.id"
    >
      <div class="flex items-center">
        <button 
          v-if="hasChildren"
          @click.stop="toggleExpand" 
          class="mr-2 w-6 h-6 flex items-center justify-center"
        >
          <span v-if="isExpanded">▼</span>
          <span v-else>▶</span>
        </button>
        <span v-else class="mr-2 w-6"></span>
        
        <div>
          <div class="font-medium">{{ item.label }}</div>
          <div class="text-xs text-gray-500">{{ itemType }}</div>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click.stop="addChild" 
          class="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
        >
          Add Child
        </button>
        <button 
          @click.stop="startEditing" 
          class="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          Edit
        </button>
      </div>
    </div>
    
    <div 
      v-if="isExpanded && hasChildren" 
      class="pl-4 nested-sortable"
      :data-parent-id="item.id"
    >
      <template v-for="(child) in item.children" :key="child.id">
        <MenuItem 
          :item="child" 
          :level="level + 1"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
          @move-up="$emit('move-up', $event)"
          @move-down="$emit('move-down', $event)"
          @move-out="$emit('move-out', $event)"
          @add-child="$emit('add-child', $event)"
        />
      </template>
    </div>
  </div>
</template>