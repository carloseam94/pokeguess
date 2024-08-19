<template>
  <div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
const title = ref("Pokeguess");
const description = ref(
  "Have fun trying to guess the pokemon based on yes/no questions."
);
useHead({
  title,
  meta: [
    {
      name: "description",
      content: description,
    },
  ],
});
</script>
