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

// Вброс в шину действий
//**
// * 'name':'test','group':'?','id':timestamp,'message':val
// */
async function bustask(say){
 console.log(say)
  fetch()
}



//id 
function getTimeStampInMsW() {
  var isPerformanceSupported = (
    window.performance &&
    window.performance.now &&
    window.performance.timing &&
    window.performance.timing.navigationStart
  );
  
  return isPerformanceSupported ? 
    window.performance.now() + window.performance.timing.navigationStart :
    Date.now();
}

// как store
export function useSharedData() { 
  return {
    ...sharedData,
    bustask,
    timeStampInMs:getTimeStampInMsW
    //addUser,
    //addProduct,
    //toggleTask
  }
}