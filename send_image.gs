var convert_api_secret = PropertiesService.getScriptProperties().getProperty('CONVERT_API_SECRET');

// pdf->png
function pdf2png(pdf){
  var pdf2png_URL = "https://v2.convertapi.com/convert/pdf/to/png?Secret=" + convert_api_secret;
  var postData = {
    "Parameters": [
        {
            "Name": "File",
            "FileValue": {
                "Name": pdf.getName(),
                "Data": Utilities.base64Encode(pdf.getBytes())
            }
        }
    ]
  };
  var options = {
    "method" : "POST",
    "headers" : {
      "Content-Type" : "application/json"
    },
    "payload" : JSON.stringify(postData)
  };
  
  var response = UrlFetchApp.fetch(pdf2png_URL, options);
  var content = JSON.parse(response.getContentText());
  var decoded = Utilities.base64Decode(content['Files'][0]['FileData']);
  var filename = content['Files'][0]['FileName'];
  var png = Utilities.newBlob(decoded, 'image/png', filename)
  
  return png;
}

// get sheet's pdf -> png
function get_sheet_image() {
  var spreadSheet = SpreadsheetApp.openById(CCSheetId);
  var pdf = spreadSheet.getAs('application/pdf').setName('seminar_seat.pdf'); // pdf取得
  var png = pdf2png(pdf);
  
  return png;
}

// send sheet image
function send_sheet_image(){
  var channel = "general";
  //var text = "This is a test chat.";
  //post_message(channel, text);
  var png = get_seat_image();
  post_file(channel, png);
}