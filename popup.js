// получаем доступ к кнопке
let _body = document.body;
let searchbutton = document.getElementById("_finder_button");



// когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
searchbutton.addEventListener("click", async () => {
  // получаем доступ к активной вкладке
  
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // выполняем скрипт

  chrome.scripting.executeScript({
  	// скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
    target: { tabId: tab.id },
    // вызываем функцию, в которой лежит запуск снежинок
    function: startsearch,
  }, (results) => {
    // Обрабатываем результаты выполнения скрипта
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }
    const dataFromSite = results[0]?.result; // Получаем результат
    addDynamicButton(dataFromSite); // Добавляем кнопку с результатами
  });
  
});

function addDynamicButton(data) {
  document.getElementById('mkcl').replaceChildren();
  name_b = "";
  pixles = "";
  data.forEach((url_link) => {
    if(url_link.includes('1080p')){
      pixles = '1080p';
    }
    if(url_link.includes('360p')){
      pixles = '360p';
    }
    if(url_link.includes('480p')){
      pixles = '480p';
    }
    if(url_link.includes('720p')){
      pixles = '720p';
    }
    if(!url_link.includes("1080p") && !url_link.includes("720p") && !url_link.includes("360p") && !url_link.includes("480p")){
      return;
    }
    const container = document.getElementById('mkcl');
    const newButton = document.createElement('button');
    newButton.textContent = pixles
    newButton.className  = 'buttoncls transition';
    newButton.addEventListener('click', () => {
      
      //window.open(url_link, '_blank').focus();
      chrome.downloads.download({
        url: url_link,
        filename: 'juicevideo_'+getFormattedDateTime()+'.mp4' // Укажите имя файла, если хотите
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log('Download initiated with ID:', downloadId);
        }
    });
    });
    container.appendChild(newButton);
  });  
}

// запускаем поиск
function startsearch(resultsArray) {
  return new Promise((resolve) => {
  var datalinks  = [];
  var entries = performance.getEntriesByType('resource'); //находим вхождения ресурсов страницы
  entries.map(function(entry) {
    if (entry.initiatorType === 'iframe') { //если тип вхождения iframe
      if (entry.name.includes('kinescope'))  //если  iframe содержит в себе наименование kinescope
      {
      fetch(entry.name)  //извлекаем запрос по выделенному имени-ссылке
          .then(response => {
              if (!response.ok) { 
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.text();
          })
          .then(html => {
              // Создаем временный элемент для парсинга HTML
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html'); //получаем DOM дерево чистого видео с Kinescope 

              // Получаем DOM-дерево
              const jsonScripts  = doc.querySelectorAll('script[type="application/ld+json"]');
              jsonScripts.forEach(script => {
                try {
                    // Парсим содержимое скрипта как JSON
                    const jsonData = JSON.parse(script.innerHTML);
                    
                    var newlink = (jsonData.embedUrl+"/master.mpd").replace("embed/", "");
                    // Проверяем наличие поля embedUrl
                    if (jsonData.embedUrl) {
                        fetch(newlink)
                            .then(response => {
                              if (!response.ok) {
                                  throw new Error('Network response was not ok ' + response.statusText);
                              }
                              return response.text();
                              })
                        .then(html => {
                            // Создаем временный элемент для парсинга HTML
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            // Получаем DOM-дерево
                            const jsonScripts  = doc.querySelectorAll('baseurl');
                            const baseUrlElements = doc.querySelectorAll('baseurl');
                                baseUrlElements.forEach((element, index) => {
                                  datalinks.push(element.textContent);
                                });
                                resolve(datalinks);
                        })
                        .catch(error => {
                            console.error('Ошибка при получении страницы:', error);
                        });
                    }
                } catch (error) {
                    console.error('Ошибка при парсинге JSON:', error);
                }
            });
          })
          .catch(error => {
              console.error('Ошибка при получении страницы:', error);
          });
      }
    }
  });
});

}


function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear(); // Получаем год
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Получаем месяц (0-11, поэтому +1)
  const day = String(now.getDate()).padStart(2, '0'); // Получаем день
  const hours = String(now.getHours()).padStart(2, '0'); // Получаем часы
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Получаем минуты

  // Форматируем строку
  return `${year}_${month}_${day}-${hours}_${minutes}`;
}