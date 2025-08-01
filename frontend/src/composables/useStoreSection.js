import { ref } from 'vue'

const webserverip = 'http://localhost:8000';

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
async function bustask(say) {
  console.log(say);
  
  try {
    // Создаем URL с параметрами
    let inputString = "";
    //const timestamp = getTimeStampInMsW();
    const isPreformatted_ADD = /^\d+\*доб/.test(say);
    const isPreformatted_DEL = /^\d+\*дел/.test(say);

    if (isPreformatted_ADD){
      const [timestampPart, dataPart] = say.split('*доб');

      // Проверяем timestamp
      const timestamp = parseInt(timestampPart);
      if (isNaN(timestamp)) {
        throw new Error('Неверный формат timestamp');
      }

      // Разбираем оставшуюся часть (name group message)
      const dataParts = dataPart.split(' ');
      if (dataParts.length < 2) {
        throw new Error('Недостаточно данных после "*доб"');
      }

      // Извлекаем name, group и message (все что после group)
      const name = dataParts[0];
      const group = dataParts[1];
      const message = dataParts.slice(2).join(' ') || ''; // Объединяем оставшиеся части
      
      inputString = `${timestamp}*доб${name} ${group} ${message}`;
    }
    if (isPreformatted_DEL){
      const [timestampPart, dataPart] = say.split('*дел');

      // Проверяем timestamp
      const timestamp = parseInt(timestampPart);
      if (isNaN(timestamp)) {
        throw new Error('Неверный формат timestamp');
      }
      inputString = `${timestamp}*дел`;
    }
    const encodedString = encodeURIComponent(inputString);
    const url = webserverip+`/api/parse?input_string=${encodedString}`;
    
    // Делаем запрос
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    
    if (data === "данные добавлены") {
      console.log("Данные успешно добавлены на сервер");
      addata(timestamp, say, name, group, message)
      return true;
    } else {
      console.log("Сервер вернул неожиданный ответ:", data);
      return false;
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    return false;
  }
}

function addata(timestamp, name, group, message) {
  const users = sharedData.users.value; // Получаем массив пользователей
  
  // Ищем пользователя с таким id
  const existingUserIndex = users.findIndex(user => user.id === timestamp);
  
  if (existingUserIndex !== -1) {
    // Обновляем существующего пользователя
    sharedData.users.value[existingUserIndex] = {
      ...sharedData.users.value[existingUserIndex],
      name,
      group,
      message
    };
    console.log(`Пользователь с id=${timestamp} обновлен`);
  } else {
    // Добавляем нового пользователя
    sharedData.users.value.push({
      id: timestamp,
      name,
      group,
      message
    });
    console.log(`Добавлен новый пользователь с id=${timestamp}`);
  }
  
  // Для реактивности в Vue нужно "трогать" массив
  sharedData.users.value = [...sharedData.users.value];
}

//id 
function getTimeStampInMsW() {
  var isPerformanceSupported = (
    window.performance &&
    window.performance.now &&
    window.performance.timing &&
    window.performance.timing.navigationStart
  );
  
  return parseInt(isPerformanceSupported ? 
    window.performance.now() + window.performance.timing.navigationStart :
    Date.now());
}


const eventSource = new EventSource(webserverip+'/api/newdata');

eventSource.onmessage = (e) => {
  try {
    // Парсим данные с сервера
    const serverData = JSON.parse(e.data);
    console.log('Новые данные с сервера:', serverData);

    // Преобразуем данные сервера в массив пользователей
    const serverUsers = Object.entries(serverData).map(([id, [name, group, message]]) => ({
      id: parseInt(parseFloat(id)), // Убираем .0 и преобразуем в целое число
      name,
      group,
      message
    }));

    // Получаем текущих пользователей
    const currentUsers = [...sharedData.users.value];

    // 1. Обновляем существующих пользователей
    serverUsers.forEach(serverUser => {
      const existingIndex = currentUsers.findIndex(u => u.id === serverUser.id);
      if (existingIndex !== -1) {
        currentUsers[existingIndex] = { ...currentUsers[existingIndex], ...serverUser };
      } else {
        currentUsers.push(serverUser);
      }
    });

    // 2. Опционально: удаляем пользователей, которых нет на сервере
    // const updatedUsers = currentUsers.filter(user => 
    //   serverUsers.some(serverUser => serverUser.id === user.id)
    // );

    // Обновляем реактивные данные
    sharedData.users.value = currentUsers;
    console.log('Данные успешно обновлены');

  } catch (error) {
    console.error('Ошибка обработки данных SSE:', error);
  }
};

eventSource.onerror = () => {
  console.error('Ошибка SSE. Переподключение...');
  eventSource.close();
  setTimeout(() =>{ new EventSource(webserverip + '/api/newdata')}, 1000);
};

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