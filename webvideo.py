import sys
import cv2
from datetime import datetime, timedelta
from socketIO_client import SocketIO

nextCapture = datetime.now()

socketIO = SocketIO('http://localhost', 8081)

webcam = cv2.VideoCapture(0)
webcam.set(cv2.cv.CV_CAP_PROP_FRAME_WIDTH,320)
webcam.set(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT,240)

def on_aaa_response(*args):
    sys.exit(0)

def on_bbb_response(*args):
    flg = not flg

socketIO.on('aaa_response', on_aaa_response)

flg = True
while flg:
    if nextCapture <= datetime.now():
        nextCapture = nextCapture + timedelta(seconds=1)
        img = webcam.read()[1]
        cv2.imwrite('./public/img.png', img)
        socketIO.emit('new_image')
        socketIO.wait(1)
