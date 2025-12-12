<script setup>
import { ref } from 'vue'
import AppModal from '../components/common/AppModal.vue'

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">AppModal Example</h1>

    <button
      @click="openModal"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Open Modal
    </button>

    <AppModal
      :isOpen="isModalOpen"
      title="Example Modal"
      size="md"
      :closeOnClickOutside="true"
      @close="closeModal"
    >
      <p class="text-gray-700">
        This is the modal content. You can put any content here.
      </p>
      <p class="text-gray-700 mt-2">
        The modal supports:
      </p>
      <ul class="list-disc list-inside text-gray-700 mt-2">
        <li>Animations</li>
        <li>Focus trap</li>
        <li>Body scroll prevention</li>
        <li>Click outside to close</li>
        <li>Custom slots</li>
      </ul>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>
