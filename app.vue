<template>
  <NuxtLayout>
    <main class="my-5 mx-auto max-w-screen-lg">
      <NuxtPage />
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { initFlowbite } from "flowbite";
onMounted(() => {
  initFlowbite();
});
</script>
