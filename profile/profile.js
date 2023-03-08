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
  

  //отдельная функция для POST-запроса с авторизацией по токену
  function useRequestPUT(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
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
  let allAuthors = 'Список имен всех пользователей: '
  for (i=0; i < apiData.length; i++) {
    allAuthors += apiData[i].name + ' ';
    }
  allAuthors += 'Получено объектов-пользователей: ' + apiData.length;

  resultNode.innerHTML = allAuthors;
  resultNodeJSON.innerHTML = 'JSON:' + JSON.stringify(apiData);
  
}

// Вешаем обработчик на кнопку для запроса
btnNode.addEventListener('click', () => {
  useRequestGET('http://127.0.0.1:8000/api/v1/authorlist/', displayResult);
})

//форма редактирования данных пользователя
//извлекаем данные из формы - id, name
//событие - нажата кнопка submit
const formElem = document.querySelector('form[name="editprofile"]');
const domain = 'http://127.0.0.1:8000/api/v1/authordetail/';

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

    let idUser = data.get('id');
    console.log(`id пользователя данные которого обновляются = ${idUser}`);
    //уточняем путь, добавляя id из формы
    let domainId = domain +`${idUser}/`;
    //получаем токен, если он был сохранен в localStorage
    const token = localStorage.getItem("token");
    console.log(`token from localStorage: ${token}`);

    let xhr1 = new XMLHttpRequest();
      xhr1.withCredentials = true;
      xhr1.open("PUT", domainId);
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

