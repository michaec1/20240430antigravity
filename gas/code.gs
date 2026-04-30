function doGet(e) {
  var count = parseInt(e.parameter.count) || 5;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  var data = sheet.getDataRange().getValues();
  
  var headers = data[0];
  var rows = data.slice(1);
  
  // 洗牌
  rows.sort(function() { return 0.5 - Math.random() });
  var selected = rows.slice(0, count);
  
  var result = selected.map(function(row) {
    return {
      id: row[0],
      question: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      },
      answer: row[6] // 如果不想讓前端知道答案，可以拿掉這行，改由 doPost 來算分
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Invalid JSON'})).setMimeType(ContentService.MimeType.JSON);
  }
  
  var id = data.id;
  var score = parseInt(data.score) || 0;
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
  var allData = sheet.getDataRange().getValues();
  
  var foundRow = -1;
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] == id) {
      foundRow = i + 1;
      break;
    }
  }
  
  var timestamp = new Date();
  
  if (foundRow > -1) {
    // 已存在 ID
    var playCount = parseInt(sheet.getRange(foundRow, 2).getValue()) || 0;
    var totalScore = parseInt(sheet.getRange(foundRow, 3).getValue()) || 0;
    var highestScore = parseInt(sheet.getRange(foundRow, 4).getValue()) || 0;
    // 第一次通關分數 (第5欄), 花了幾次通關 (第6欄)
    var firstClearScore = sheet.getRange(foundRow, 5).getValue();
    var attemptsToClear = sheet.getRange(foundRow, 6).getValue();
    
    playCount += 1;
    totalScore += score;
    if (score > highestScore) highestScore = score;
    
    if (data.passed && firstClearScore === "") {
      firstClearScore = score;
      attemptsToClear = playCount;
      sheet.getRange(foundRow, 5).setValue(firstClearScore);
      sheet.getRange(foundRow, 6).setValue(attemptsToClear);
    }
    
    sheet.getRange(foundRow, 2).setValue(playCount);
    sheet.getRange(foundRow, 3).setValue(totalScore);
    sheet.getRange(foundRow, 4).setValue(highestScore);
    sheet.getRange(foundRow, 7).setValue(timestamp);
  } else {
    // 新 ID
    var passed = data.passed;
    sheet.appendRow([
      id, 
      1, 
      score, 
      score, 
      passed ? score : "", 
      passed ? 1 : "", 
      timestamp
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
