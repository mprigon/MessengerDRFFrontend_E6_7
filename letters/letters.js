// GET запрос к бэкэнду при нажатии на кнопку, результат выводится
// в область div на странице и в консоль
// JSON и объект

/**
  * Функция-обертка над XMLHttpRequest, осуществляющая запрос
  * url, по которому будет осуществляться запрос
  * callback - функция, которая вызовется при успешном выполнении
  * и первым параметром получит объект-результат запроса
  */
function useRequest(url, callback) {
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
  }; //закрывающая скобка xhr.onload
    
  xhr.onerror = function() {
    console.log('Ошибка! Статус ответа: ', xhr.status);
  };
    
  xhr.send();
  }; //закрывающая скобка useRequest
  
// Ищем элемент НТМL-документа для вставки результата запроса
const resultNode = document.querySelector('.j-result');
// Ищем элемент - кнопку, по нажатии на которую будет запрос
const btnNode = document.querySelector('.j-btn-request');

// Ищем вторую ноду для другого запроса
const resultNodeCurrentUser = document.querySelector('.k-result');

/**
* Функция обработки полученного результата
* apiData - объект с результатом запроса
*/
function displayResult(apiData) {
  //получим выборку из нескольких объектов-результатов в виде строки
  let allLetters = ''
  for (i=0; i < apiData.length; i++) {
    allLetters += apiData[i].text + ' ';
    }
  allLetters += 'получено объектов: ' + apiData.length;

  resultNode.innerHTML = allLetters;
  //справочно выводим объекты в JSON
  resultNodeCurrentUser.innerHTML = 'JSON:' + JSON.stringify(apiData);
  
}

// Вешаем обработчик на кнопку для запроса
btnNode.addEventListener('click', () => {
  useRequest('http://127.0.0.1:8000/api/v1/letterlist/', displayResult);
})

//форма создания письма
//извлекаем данные из формы
//событие - нажата кнопка submit
const formElem = document.querySelector('form[name="sendletter"]');
const domain = 'http://127.0.0.1:8000/api/v1/letterlist/';

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
    let recipient = data.get('recipient');
    console.log(`получатель = ${recipient}`);
    let text = data.get('text');
    console.log(`текст = ${text}`);
    //получаем токен, если он был сохранен в localStorage
    let token = localStorage.getItem("token");
    console.log(`token from localStorage: ${token}`)
    if (token == null) {
        alert("токен отсутствует в localStorage!")
    }

    let xhr1 = new XMLHttpRequest();
      xhr1.withCredentials = true;
      xhr1.open("POST", domain, true, user, password);
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
