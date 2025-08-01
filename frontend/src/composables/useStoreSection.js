import { ref } from 'vue'

// Общие данные, доступные всем компонентам
const sharedData = {
  users: ref([
    { group: 'A', id: 1, name: 'Алексей', message: "старое небо" },
    { group: 'A', id: 2, name: 'Мария', message: "только вверх" },
    { group: 'A',id: 3, name: 'Иван', message: "меньшее в низ" },
    { group: 'B', id: 1, name: 'Алексей', message: "старое небо" },
    { group: 'B', id: 2, name: 'Мария', message: "только вверх" },
    { group: 'B',id: 3, name: 'Иван', message: "меньшее в низ" },
    { group: 'C', id: 1, name: 'Алексей', message: "старое небо" },
    { group: 'C', id: 2, name: 'Мария', message: "только вверх" },
    { group: 'C',id: 3, name: 'Иван', message: "меньшее в низ" }
  ]),
  
/* можно было использовать 3 группы решил объеденить..
  products: ref([
    { id: 4, name: 'Ноутбук', message: 999 },
    { id: 5, name: 'Телефон', message: 699 },
    { id: 6, name: 'Наушники', message: 199 }
  ]),
  
  tasks: ref([
    { id: 7, title: 'Изучить Vue 3', message: false },
    { id: 8, title: 'Создать проект', message: true },
    { id: 9, title: 'Развернуть на сервере', message: false }
  ]) */
}

export function useSharedData() {
  return {
    ...sharedData,
    //addUser,
    //addProduct,
    //toggleTask
  }
}