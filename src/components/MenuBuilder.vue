<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Sortable from 'sortablejs';
import { v4 as uuidv4 } from 'uuid';
import type { MenuItem as MenuItemType, PageItem } from '../types';
import MenuItem from './MenuItem.vue';
import PageList from './PageList.vue';

const props = defineProps<{
  initialMenus?: Record<string, MenuItemType[]>;
  pages: PageItem[];
}>();

const menus = ref<Record<string, MenuItemType[]>>(props.initialMenus || { 'Main Menu': [] });
const selectedMenu = ref('Main Menu');
const menuName = ref(selectedMenu.value);
const newMenuName = ref('');
const showNewMenuInput = ref(false);

const createNewMenu = () => {
  if (newMenuName.value.trim()) {
    menus.value[newMenuName.value] = [];
    selectedMenu.value = newMenuName.value;
    menuName.value = newMenuName.value;
    newMenuName.value = '';
    showNewMenuInput.value = false;
  }
};

const selectMenu = (menu: string) => {
  selectedMenu.value = menu;
  menuName.value = menu;
};

const saveMenu = () => {
  if (menuName.value.trim() && menuName.value !== selectedMenu.value) {
    const menuItems = menus.value[selectedMenu.value];
    delete menus.value[selectedMenu.value];
    menus.value[menuName.value] = menuItems;
    selectedMenu.value = menuName.value;
  }
  alert('Menu saved successfully!');
};

const deleteMenu = () => {
  if (confirm(`Are you sure you want to delete the menu "${selectedMenu.value}"?`)) {
    delete menus.value[selectedMenu.value];
    if (Object.keys(menus.value).length === 0) {
      menus.value['Main Menu'] = [];
      selectedMenu.value = 'Main Menu';
      menuName.value = 'Main Menu';
    } else {
      selectedMenu.value = Object.keys(menus.value)[0];
      menuName.value = selectedMenu.value;
    }
  }
};

const addCustomLink = () => {
  const newItem: MenuItemType = {
    id: uuidv4(),
    label: 'New Link',
    url: 'http://example.com',
    children: [],
    isEditing: true
  };
  
  menus.value[selectedMenu.value].push(newItem);
};

const addToMenu = (page: PageItem) => {
  const newItem: MenuItemType = {
    id: uuidv4(),
    label: page.name,
    url: page.url,
    children: []
  };
  
  menus.value[selectedMenu.value].push(newItem);
};

const addChildToMenuItem = (parentId: string) => {
  const newItem: MenuItemType = {
    id: uuidv4(),
    label: 'New Child Item',
    url: 'http://example.com/child',
    children: [],
    isEditing: true
  };
  
  addChildRecursively(menus.value[selectedMenu.value], parentId, newItem);
  
  // Ensure the parent is expanded to show the new child
  const parent = findItemById(menus.value[selectedMenu.value], parentId);
  if (parent) {
    parent.isExpanded = true;
  }
  
  // Re-initialize sortable to handle the new nested structure
  nextTick(() => {
    initSortable();
  });
};

const addChildRecursively = (items: MenuItemType[], parentId: string, newChild: MenuItemType): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === parentId) {
      if (!items[i].children) {
        items[i].children = [];
      }
      items[i].children.push(newChild);
      return true;
    }
    
    if (items[i].children && items[i].children.length > 0) {
      if (addChildRecursively(items[i].children, parentId, newChild)) {
        return true;
      }
    }
  }
  
  return false;
};

const updateMenuItem = (updatedItem: MenuItemType) => {
  updateItemRecursively(menus.value[selectedMenu.value], updatedItem);
};

const updateItemRecursively = (items: MenuItemType[], updatedItem: MenuItemType): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === updatedItem.id) {
      items[i] = updatedItem;
      return true;
    }
    
    if (items[i].children && items[i].children.length > 0) {
      if (updateItemRecursively(items[i].children, updatedItem)) {
        return true;
      }
    }
  }
  
  return false;
};

const deleteMenuItem = (id: string) => {
  deleteItemRecursively(menus.value[selectedMenu.value], id);
};

const deleteItemRecursively = (items: MenuItemType[], id: string): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items.splice(i, 1);
      return true;
    }
    
    if (items[i].children && items[i].children.length > 0) {
      if (deleteItemRecursively(items[i].children, id)) {
        return true;
      }
    }
  }
  
  return false;
};

const moveItemUp = (id: string) => {
  moveItemUpRecursively(menus.value[selectedMenu.value], id);
};

const moveItemUpRecursively = (items: MenuItemType[], id: string): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      if (i > 0) {
        const temp = items[i];
        items[i] = items[i - 1];
        items[i - 1] = temp;
      }
      return true;
    }
    
    if (items[i].children && items[i].children.length > 0) {
      if (moveItemUpRecursively(items[i].children, id)) {
        return true;
      }
    }
  }
  
  return false;
};

const moveItemDown = (id: string) => {
  moveItemDownRecursively(menus.value[selectedMenu.value], id);
};

const moveItemDownRecursively = (items: MenuItemType[], id: string): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      if (i < items.length - 1) {
        const temp = items[i];
        items[i] = items[i + 1];
        items[i + 1] = temp;
      }
      return true;
    }
    
    if (items[i].children && items[i].children.length > 0) {
      if (moveItemDownRecursively(items[i].children, id)) {
        return true;
      }
    }
  }
  
  return false;
};

const moveItemOut = (id: string) => {
  const result = findItemAndParent(menus.value[selectedMenu.value], id);
  if (result && result.parent) {
    const { item, parent, index } = result;
    parent.splice(index, 1);
    menus.value[selectedMenu.value].push(item);
  }
};

const findItemAndParent = (
  items: MenuItemType[], 
  id: string, 
  parent: MenuItemType[] | null = null
): { item: MenuItemType, parent: MenuItemType[] | null, index: number } | null => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return { item: items[i], parent, index: i };
    }
    
    if (items[i].children && items[i].children.length > 0) {
      const result = findItemAndParent(items[i].children, id, items[i].children);
      if (result) {
        return result;
      }
    }
  }
  
  return null;
};

const initSortable = () => {
  const mainContainer = document.querySelector('.menu-structure');
  if (!(mainContainer instanceof HTMLElement)) return;
  
  // Initialize main sortable
  new Sortable(mainContainer, {
    group: 'nested',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: function(evt: Sortable.SortableEvent) {
      const itemEl = evt.item;
      const itemId = itemEl.getAttribute('data-id');
      const toParentId = evt.to.getAttribute('data-parent-id');
      
      if (itemId && toParentId) {
        // Moving to a nested list
        const item = findAndRemoveItem(menus.value[selectedMenu.value], itemId);
        if (item) {
          const parentItem = findItemById(menus.value[selectedMenu.value], toParentId);
          if (parentItem) {
            const newIndex = Array.from(evt.to.children).indexOf(itemEl);
            parentItem.children.splice(newIndex, 0, item);
          }
        }
      } else if (itemId) {
        // Moving within the main list
        const item = findAndRemoveItem(menus.value[selectedMenu.value], itemId);
        if (item) {
          const newIndex = Array.from(evt.to.children).indexOf(itemEl);
          menus.value[selectedMenu.value].splice(newIndex, 0, item);
        }
      }
    }
  });
  
  // Initialize all nested sortables
  const nestedSortables = document.querySelectorAll('.nested-sortable');
  for (let i = 0; i < nestedSortables.length; i++) {
    new Sortable(nestedSortables[i] as HTMLElement, {
      group: 'nested',
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd: function(evt: Sortable.SortableEvent) {
        const itemEl = evt.item;
        const itemId = itemEl.getAttribute('data-id');
        const toParentId = evt.to.getAttribute('data-parent-id');
        
        if (itemId && toParentId) {
          // Moving to a nested list
          const item = findAndRemoveItem(menus.value[selectedMenu.value], itemId);
          if (item) {
            const parentItem = findItemById(menus.value[selectedMenu.value], toParentId);
            if (parentItem) {
              const newIndex = Array.from(evt.to.children).indexOf(itemEl);
              parentItem.children.splice(newIndex, 0, item);
            }
          }
        } else if (itemId) {
          // Moving to the main list
          const item = findAndRemoveItem(menus.value[selectedMenu.value], itemId);
          if (item) {
            const newIndex = Array.from(evt.to.children).indexOf(itemEl);
            menus.value[selectedMenu.value].splice(newIndex, 0, item);
          }
        }
      }
    });
  }
};

const findAndRemoveItem = (items: MenuItemType[], id: string): MenuItemType | null => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return items.splice(i, 1)[0];
    }
    
    if (items[i].children && items[i].children.length > 0) {
      const found = findAndRemoveItem(items[i].children, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

const findItemById = (items: MenuItemType[], id: string): MenuItemType | null => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return items[i];
    }
    
    if (items[i].children && items[i].children.length > 0) {
      const found = findItemById(items[i].children, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

onMounted(() => {
  initSortable();
});

// Re-initialize sortable whenever the menu structure changes
const reinitSortable = async () => {
  await nextTick();
  initSortable();
};

// Watch for changes that require re-initializing sortable
const watchMenuChanges = () => {
  reinitSortable();
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left Sidebar - Available Pages -->
      <div class="md:col-span-1">
        <PageList :pages="pages" @add-to-menu="addToMenu" />
      </div>
      
      <!-- Right Side - Menu Builder -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <label for="menu-select" class="mr-2">Select the menu you want to edit:</label>
              <select 
                id="menu-select"
                v-model="selectedMenu" 
                @change="selectMenu(selectedMenu)"
                class="p-2 border border-gray-300 rounded"
              >
                <option v-for="(_, menuKey) in menus" :key="menuKey" :value="menuKey">
                  {{ menuKey }}
                </option>
              </select>
              <span class="mx-2">or</span>
              <button 
                v-if="!showNewMenuInput"
                @click="showNewMenuInput = true" 
                class="text-blue-500 hover:underline"
              >
                Create new menu
              </button>
            </div>
            
            <div v-if="showNewMenuInput" class="flex items-center mt-2">
              <input 
                v-model="newMenuName" 
                type="text" 
                id="new-menu-name"
                placeholder="New menu name" 
                class="p-2 border border-gray-300 rounded mr-2"
              />
              <button 
                @click="createNewMenu" 
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button 
                @click="showNewMenuInput = false" 
                class="px-3 py-1 ml-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between mb-6">
            <div>
              <label for="menu-name" class="mr-2">Name:</label>
              <input 
                id="menu-name"
                v-model="menuName" 
                type="text" 
                class="p-2 border border-gray-300 rounded"
              />
            </div>
            <button 
              @click="saveMenu" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save menu
            </button>
          </div>
          
          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">Menu Structure</h2>
            <p class="text-sm text-gray-600 mb-4">
              Place each item in the order you prefer. Click on the arrow to the right of the item to display more configuration options.
            </p>
            
            <div class="menu-structure">
              <template v-for="item in menus[selectedMenu]" :key="item.id">
                <MenuItem 
                  :item="item" 
                  :level="0"
                  @update="updateMenuItem"
                  @delete="deleteMenuItem"
                  @move-up="moveItemUp"
                  @move-down="moveItemDown"
                  @move-out="moveItemOut"
                  @add-child="addChildToMenuItem"
                  @click="watchMenuChanges"
                />
              </template>
            </div>
            
            <div v-if="menus[selectedMenu].length === 0" class="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-gray-500">
              Your menu is empty. Add items from the left panel or create a custom link.
            </div>
          </div>
          
          <div class="flex justify-between">
            <div>
              <button 
                @click="addCustomLink" 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add custom link
              </button>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="deleteMenu" 
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete menu
              </button>
              <button 
                @click="saveMenu" 
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>