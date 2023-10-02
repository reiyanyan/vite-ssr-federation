<template>
  <div>
    <p>Halo ini dari server</p>
    <p>{{ coin }}</p>
    <!-- <tv-container-page-client></tv-container-page-client> -->
    <ClientOnly>
      <!-- <Suspense> -->
      <TradingView v-if="true" :symbol="coin.replace('-', '/')"></TradingView>
      <!-- <template #fallback> Loading ... </template> -->
      <!-- </Suspense> -->
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { ClientOnly } from "../../components/ClientOnly";
import { defineAsyncComponent } from "vue";
const TradingView = defineAsyncComponent(
  () => import("../../components/TradingView.vue")
);

defineProps(["coin"]);
</script>
