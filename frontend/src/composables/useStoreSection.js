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
  
}

export function useSharedData() {
  return {
    ...sharedData,
    //addUser,
    //addProduct,
    //toggleTask
  }
}