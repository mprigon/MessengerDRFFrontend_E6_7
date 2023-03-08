// GET запрос к бэкэнду при нажатии на кнопку, результат выводится
// в область div на странице и в консоль
// JSON и объект

/**
  * Функция-обертка над XMLHttpRequest, осуществляющая GET запрос
  * url, по которому будет осуществляться запрос
  * callback - функция, которая вызовется при успешном выполнении
  * и первым параметром получит объект-результат запроса
  */
function useRequestGET(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    
  xhr.onload = function() {
    if (xhr.status != 200) {
      console.log('Статус ответа: ', xhr.status);
    } else {
      let responseObj = xhr.response;
      console.log(responseObj);
      const result = JSON.stringify(responseObj);
      console.log(`Ответ сервера JSON ${result}`);
      console.log(`Ответ сервера object ${responseObj}`);

      if (callback) {
        callback(responseObj);
      }
    }
  };
    
  xhr.onerror = function() {
    console.log('Ошибка! Статус ответа: ', xhr.status);
  };
    
  xhr.send();
  };

// Ищем тег для вставки результата GET запроса
const resultNode = document.querySelector('.j-result');
// Ищем кнопку, по нажатии на которую будет GET запрос
const btnNode = document.querySelector('.j-btn-request');

// Ищем второй элемент для вставки GET запроса, туда выведем JSON
const resultNodeJSON = document.querySelector('.k-result');

/**
* Функция обработки полученного результата
* apiData - объект с результатом GET запроса
*/
function displayResult(apiData) {
  let allRooms = 'Список всех комнат: '
  for (i=0; i < apiData.length; i++) {
    allRooms += apiData[i].roomName + ' ';
    }
  allRooms += 'Получено объектов-комнат: ' + apiData.length;

  resultNode.innerHTML = allRooms;
  resultNodeJSON.innerHTML = 'JSON:' + JSON.stringify(apiData);
  
}

// Вешаем обработчик на кнопку для запроса
btnNode.addEventListener('click', () => {
  useRequestGET('http://127.0.0.1:8000/api/v1/roomlist/', displayResult);
})

//форма редактирования данных комнаты
//извлекаем данные из формы - id, name
//событие - нажата кнопка submit
const formElem = document.querySelector('form[name="editroom"]');
const domain = 'http://127.0.0.1:8000/api/v1/roomdetail/';

formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
});

formElem.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // Get the form data from the event object
    const data = e.formData;
    
    let user = data.get('username');
    console.log(user);
    let password = data.get('password');
    console.log(password);
    let idRoom = data.get('id');
    console.log(`id комнаты, данные которой обновляются = ${idRoom}`);
    //уточняем путь, добавляя id из формы
    let domainId = domain +`${idRoom}/`;
    //получаем токен, если он был сохранен в localStorage
    let token = localStorage.getItem("token");
    console.log(`token from localStorage: ${token}`)
    if (token == null) {
        alert("токен отсутствует в localStorage!")
    }

    let xhr1 = new XMLHttpRequest();
      xhr1.withCredentials = true;
      xhr1.open("PUT", domainId, true, user, password);
      xhr1.responseType = 'json';
      xhr1.setRequestHeader('Authorization', token);

      xhr1.onload = function() {
        if (xhr1.status != 200) {
          console.log('Статус ответа: ', xhr1.status);
        } else {
          let responseObj = xhr1.response;
          console.log(responseObj);
        }
  };
  
  xhr1.onerror = function() {
    console.log('Ошибка! Статус ответа: ', xhr.status);
  };
  
  xhr1.send(data);

  xhr1.onload = () => alert('ответ сервера: ', xhr1.response);
  });

  const wsUri = "wss://ws.postman-echo.com/raw";

const output = document.getElementById("output");
const btnOpen = document.querySelector('.j-btn-open');
const btnClose = document.querySelector('.j-btn-close');
const btnSend = document.querySelector('.j-btn-send');

let websocket;

function writeToScreen(message) {
  let pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  output.appendChild(pre);
}

btnOpen.addEventListener('click', () => {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) {
    writeToScreen("CONNECTED");
  };
  websocket.onclose = function(evt) {
    writeToScreen("DISCONNECTED");
  };
  websocket.onmessage = function(evt) {
    writeToScreen(
      '<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'
    );
  };
  websocket.onerror = function(evt) {
    writeToScreen(
      '<span style="color: red;">ERROR:</span> ' + evt.data
    );
  };
});

btnClose.addEventListener('click', () => {
  websocket.close();
  websocket = null;
});

btnSend.addEventListener('click', () => {
  const message = 'Test message';
  writeToScreen("SENT: " + message);
  websocket.send(message);
});

