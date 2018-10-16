# Switchboard

[whoisinthetypemediastudio.today](https://whoisinthetypemediastudio.today) is a project by Rutherford Craze for the MA Type and Media course at KABK in The Hague. It is in two parts:

1. A board of twelve switches (each representing one student) connected to a Raspberry Pi Zero W, which hangs on the wall of the TypeMedia studio.

2. A website, which is updated every time the switch configuration changes.

This repo contains all of the code which supports the current system, with the exception of the Raspberry Pi's cron table, and a font file which is not in the public domain.

- - -

The script `listener.py` in the `pi` directory runs as a scheduled task. It checks switch states and uploads a text file with their configurations every time the state changes.

The contents of the `web` directory are hosted on the web server. `read.js` is responsible for parsing the `data.txt` file sent by the Pi, and displaying its contents on the page. `stretch.js` handles variable font implementation (quite inefficiently, too) — it doesn't affect how the system functions, just how it looks.

- - -

There is a brief log of the hardware build available on [my site.](https://craze.co.uk/switchboard+build+log)