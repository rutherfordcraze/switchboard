# TypeMedia Studio Indicator v1.1
# Rutherford Craze
# CC BY 4.0
# 180929

# Checks for changes in the pi GPIO switch state, saves the state to a file, then uploads that file to the server

# JSON is needed to save the datafile; FTP is needed to upload it
import json
from ftplib import FTP
from time import sleep

# Import 
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)

# GPIO pins on the inside of the GPIO panel (for better cable management) except 14 (because of bad planning)
GPIO.setup(14,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 0
GPIO.setup(4,GPIO.IN,pull_up_down=GPIO.PUD_UP)   # Switch 1
# ---
GPIO.setup(17,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 2
GPIO.setup(27,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 3
GPIO.setup(22,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 4
# ---
GPIO.setup(10,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 5
GPIO.setup(9,GPIO.IN,pull_up_down=GPIO.PUD_UP)   # Switch 6
GPIO.setup(11,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 7
# ---
GPIO.setup(5,GPIO.IN,pull_up_down=GPIO.PUD_UP)   # Switch 8
GPIO.setup(6,GPIO.IN,pull_up_down=GPIO.PUD_UP)   # Switch 9
GPIO.setup(13,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 10
GPIO.setup(19,GPIO.IN,pull_up_down=GPIO.PUD_UP)  # Switch 11
print("Switchboard running. Press Ctrl+C to interrupt.")

# Change this to whichever file you want to upload
filename = 'data.txt'

# Set the initial switch state (switch0 set to 2 so we can check whether this is being updated properly later)
switchState = [2,0,0,0,0,0,0,0,0,0,0,0]

# Check for changes in the switch state
def Listen():
    global switchState
    
    switchStateLast = switchState
    switchState = [
        GPIO.input(14),
        GPIO.input(4),
        GPIO.input(17),
        GPIO.input(27),
        GPIO.input(22),
        GPIO.input(10),
        GPIO.input(9),
        GPIO.input(11),
        GPIO.input(5),
        GPIO.input(6),
        GPIO.input(13),
        GPIO.input(19)
    ]
    # Invert switchState array order because I soldered everything backwards like a fucking scrub
    switchState.reverse()
    
    # If switch state has changed, update the website
    if(switchState != switchStateLast):
        Update()

# Update datafile and server with changes in the switch state
def Update():
    # Save switchState to textfile
    payload = json.dumps(switchState)
    with open(filename, 'r+') as f:
        f.write(payload)
    
    # Upload textfile to server
    ftp = FTP('whoisinthetypemediastudio.today')
    ftp.login(user='XXX', passwd='XXX') # Can't make these public — t]m 19–20, ask me if you need them
    # Change directory to the server root
    ftp.cwd('/')
    # Upload the data file and then close the connection
    ftp.storbinary('STOR ' + filename, open(filename, 'rb'))
    ftp.quit()
    print("Uploaded data.")
        

# Call the Listen() func every 10 seconds, but only for 2 minutes (then the script ends and cron opens a new one)
loops = 0
while True:
    global loops
    loops += 1
    if(loops < 12):
        Listen()
        sleep(10)
    else:
        break