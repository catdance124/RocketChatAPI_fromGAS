# RocketChatAPI_fromGAS
SAMPLE of using rocket chat API from Google Apps Script

# Reference
https://rocket.chat/docs/developer-guides/rest-api/

# functions in code
rocketchat_api.gs
- `login_rocketchat()`
  - login to rocketchat
- `get_channel_id(channel)`
  - get channnel ID
- `post_message(channel, text)`
  - send message to specified channel
- `post_file(channel, file)`
  - send file to specified channel
- `get_channel_history(channel)`
  - get specified channel history
- `delete_message(channel, message_id)`
  - delete message
- `delete_latest_message(channel)`
  - delete latest message

Please see the code for details!

## Appendix
get sheet pdf -> png function
### Reference
https://www.convertapi.com/pdf-to-png  
send_images.gs
- `pdf2png(pdf)`
  - convert pdf to png using [convertapi](https://www.convertapi.com/)
- `get_sheet_image()`
  - get specified sheet image
- `send_sheet_image()`
  - send sheet image