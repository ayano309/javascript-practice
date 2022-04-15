'use strict';


//geolocation

function success(pos){
  //緯度、経度
  ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

function fail(error){
  alert('位置情報の取得に失敗しました。エラーコード:'+ error.code);
}

navigator.geolocation.getCurrentPosition(success, fail);

//日時UTCをミリ秒に なぜならDateオブジェクトはミリ秒しか使えない
function utcToJSTime(utcTime){
  return utcTime * 1000;
}

//データ取得
function ajaxRequest(lat, long){
  const url ='https://api.openweathermap.org/data/2.5/forecast';
  const appId = '66063288ffe362af23c0d88d03290061'
  //Apiのキー


  $.ajax({
    url:url,
    data:{
      appid:appId,  //apiKey
      lat:lat,      //緯度
      lon:long,     //経度
      units: 'metric',  //データの単位 metricは摂氏℃
      lang: 'ja'
    }
  })
  .done(function(data){
    console.log(data);

    //都市名、国名
    $('#place').text(data.city.name +','+ data.city.country);
    // console.log('都市名:' + data.city.name);
    // console.log('国名:'+ data.city.country);
    
    //天気予報データ
    data.list.forEach(function(forecast,index){
      const dateTime = new Date(utcToJSTime(forecast.dt)); //Dateオブジェクトの初期化
      const month = dateTime.getMonth() +1;
      const date = dateTime.getDate();
      const hours = dateTime.getHours();
      const min = String(dateTime.getMinutes()).padStart(2,'0');
      const temperature =Math.round(forecast.main.temp);  //小数点以下を四捨五入している
      const description = forecast.weather[0].description;
      const iconPath = `images/${forecast.weather[0].icon}.svg`;


      //現在の天気とそれ以外で出力を変える
      if(index === 0){
        const currentWeather = `<div class="icon"><img src="${iconPath}"></div>
        <div class="info">
        <p>
          <span class="description">現在の天気:${description}</span>
          <span class="temp">${temperature}</span>℃
        </p>
        </div>`;
        $('#weather').html(currentWeather);
        //かきかえるからhtml() 
      }else{
        const tableRow =`
        <tr>
          <td class = "info">
            ${month}/${date} ${hours}:${min}
          </td>
          <td class="icon"><img src="${iconPath}"></td>
          <td><span class="description">${description}</span></td>
          <td><span class="temp">${temperature}℃</span></td>
        </tr>`;
        $('#forecast').append(tableRow);
        //forEachしているのでappend()でその都度tableRowの塊を挿入する
      }

      // console.log('日時:' + `${month}/${date}  ${hours}: ${min}`);
      // console.log('気温:' + temperature);
      // console.log('天気:' + description);
      // console.log('画像パス:' + iconPath);

    });
  })


  .fail(function(){
    console.log('$.ajax failed!');
  })
}