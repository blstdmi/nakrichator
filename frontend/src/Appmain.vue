<script setup>
import HelloWorld from './components/CardElement.vue'
</script>

<script>
import { useSharedData } from './composables/useStoreSection.js'
const { users, products, tasks } = useSharedData()
/* export default defineComponent({

  setup() {
    const { users, products, tasks } = useSharedData()
    
    return {
      users,
      products,
      tasks
    }
  },
}) */
</script>


<template>
<header>
  <!-- <caption style="left:20%; top:0px;position: absolute; font-size: 10vw; pointer-events: none;">
    <p style="transform: skew(15deg,-15deg);">НАКР</p>
    <p style="transform: skew(15deg,-15deg);">И</p>
    <p style="transform: skew(15deg,-15deg);">ЧАТОР</p></caption> -->
    <caption  style="left:20%; top:0px;position: absolute; font-size: 10vw; pointer-events: none;">
      <svg xmlns="http://www.w3.org/2000/svg"     width="60vw" height="50vh"  viewBox="0 0 200 100">
      <path id="SunCatcherStudio2" fill="none" stroke="none"  d="M2,5 C20,80 190,80 190,4"></path>
      <text font-size="30" fill="white" letter-spacing="2" font-family="sans-serif" font-weight="bold">
        <textPath xlink:href="#SunCatcherStudio2" side="left" startOffset="5">   <tspan fill="#FF0000">Н</tspan>
      <tspan fill="#FF7F00">А</tspan>
      <tspan fill="#FFFF00">К</tspan>
      <tspan fill="#00FF00">Р</tspan>
      <tspan fill="#0000FF">И</tspan>
      <tspan fill="#4B0082">Ч</tspan>
      <tspan fill="#9400D3">А</tspan>
      <tspan fill="#FF1493">Т</tspan>
      <tspan fill="#00BFFF">О</tspan>
      <tspan fill="#32CD32">Р</tspan></textPath></text>
        </svg>
    </caption>
</header>
<main class="flex" style="color:black">
<section>
  <h>A</h>
  <article v-for="user in users" :key="user.id">
    <span>{{ user.name }}</span> <span>{{user.id}}</span>
    <p>{{ user.message }}</p>
  </article>
</section>
<section>
  <h>B</h>
  <article v-for="user in users" :key="user.id">
    <span>{{ user.name }}</span> <span>{{user.id}}</span>
    <p>{{ user.message }}</p>
  </article>
</section>
<section>
  <h>C</h>
  <article v-for="user in users" :key="user.id">
    <span>{{ user.name }}</span> <span>{{user.id}}</span>
    <p>{{ user.message }}</p>
  </article>
</section>

</main>
</template>

<style scoped>
.flex {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  flex-grow: 1;
  align-items: stretch
}
section {
  
}
</style>
