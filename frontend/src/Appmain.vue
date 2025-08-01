<script setup>
import HelloWorld from './components/CardElement.vue'
</script>

<script>
import { useSharedData } from './composables/useStoreSection.js'
import {ref} from 'vue'
const { users, bustask, timeStampInMs } = useSharedData()
//const groups = computed(() => [...new Set(users.value.map(u => u.group))]) наверное надо бы для групп

//------------
let draggedItem = null;
function dragStart(event, user) {
  draggedItem = user;
  event.dataTransfer.setData('text/plain', user.id);
  event.currentTarget.style.opacity = '0.4';
}

function dragEnd(event) {
  event.currentTarget.style.opacity = '1';
}

function dragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function drop(event, targetGroup) {
  console.log(event, targetGroup)
  event.preventDefault();
  if (draggedItem) {
    // Обновляем группу перетаскиваемого пользователя
    draggedItem.group = targetGroup;
    // Сбрасываем draggedItem
    draggedItem = null;
  }
}



//------------
const saycommand_input_val = ref("");
//const saycommand_userid = ref();
const saycommand_show = ref(false);

//** меню - это блог быстрые команды 
// баг debounce, если ховер то не надо закрывать */
function saycommand_showmenu(userid=undefined){

  saycommand_show.value = true;
  if ( !isNaN(Number(userid)) ){
    saycommand_input_val.value=userid;
  }


  setTimeout(i=> saycommand_show.value  = false,1000*6)
}
</script>


<template>
<header>
  <!-- <caption style="left:20%; top:0px;position: absolute; font-size: 10vw; pointer-events: none;">
    <p style="transform: skew(15deg,-15deg);">НАКР</p>
    <p style="transform: skew(15deg,-15deg);">И</p>
    <p style="transform: skew(15deg,-15deg);">ЧАТОР</p></caption> -->
    <caption  style="left:20%; top:0px;position: absolute; font-size: 10vw; pointer-events: none; opacity: 0.7;">
      <svg xmlns="http://www.w3.org/2000/svg"     width="60vw" height="50vh"  viewBox="0 0 200 100">
      <path id="SunCatcherStudio2" fill="none" stroke="none"  d="M2,5 C20,80 190,80 190,4"></path>
      <text font-size="30" fill="white" letter-spacing="2" font-family="sans-serif" font-weight="bold">
        <textPath xlink:href="#SunCatcherStudio2" side="left" startOffset="5">   
      <tspan fill="#FF0000">Н</tspan>
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

<section v-for="(col, index) in ['A', 'B', 'C']" :key="index" 
@dragover="dragOver" 
@drop="drop($event, col)">
  <h5>{{ col }}</h5>
  <article v-for="user in users.filter(u => u.group === col)" :key="user.id" @click="saycommand_showmenu(user.id)"
    draggable="true" 
    
    @dragstart="dragStart($event, user)"
    @dragend="dragEnd($event)" 
    >
    <span>{{ user.name }}</span> <span>{{user.id}}</span>
    <p>{{ user.message }}</p>
  </article>
</section>

</main>

<footer>
  <section class="saycommand-root" @click="saycommand_showmenu">
    <menu v-show="saycommand_show">
      <h5>** Всплывашка с набором комманд **</h5>
      <button @click="saycommand_input_val = ''+timeStampInMs()+'*доб'+ 'test' + ' '+ 'A' +' ' + 'ТЕКСТ'">Создать новую плитку</button>
      <button>Удалить плитку</button>
      <p>тут могла быть твоя кнопка если закинеш донат.</p>
      <p>(Удалить) id*дел</p>
      <p>(Добавить id имя группа текст) id*доб тест А Текст</p>
    </menu>
    <input ref="saycomand" placeholder="| Что нужно?" v-model="saycommand_input_val"
     @change.lazy="()=>{bustask(saycommand_input_val);saycommand_input_val=''}"></input>
     
  </section>
</footer>
</template>

<style scoped>
.flex {
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  justify-content: space-between;
  
}
section {
  margin: 1vw;
  flex: 1; 
  min-width: 0; 
  padding: 16px;
}
article {
  margin: 1vw;
  flex: 1; 
  min-width: 0; 
  padding: 16px;
  border-radius: 8px;
  background-color: aquamarine;
}
/* article[draggable=true] {
  cursor: move;
} 
 v-on:dragover="dragover"
 */

.saycommand-root {
  position:fixed;
  bottom:0;
}
.saycommand-root button {
  padding:5px;
}
.saycommand-root input{
  width:300px;
} 
</style>
