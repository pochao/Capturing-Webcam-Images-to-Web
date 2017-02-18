# Capturing-Webcam-Images-to-Web

使用Beaglebone Green Wireless(BBGW)接logictech C160 webcam
利用webvideo.py擷取影像，再透過Node Js建立網頁伺服器，可以在瀏覽器觀看影像

webvideo.py利用opncv擷取影像，透過socket io將更新資訊傳給server.js

server.js建立一個簡易網頁伺服器及socket io伺服器，接收傳遞webvideo.py、index.html訊息

index.html接收到影像更新訊息，使用jQuery更新img屬性 (不會重整網頁)

安裝套件
```linux
npm install socketio
opkg install opencv-apps
pip install socketIO-client-2
```
