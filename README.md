# Synopsis:
Reflect, be entertained, and stay grounded with Echo — the voice journal powered by AI. Echo enables users to record memories, journal about emotions, and more with a straight-forward, low-friction design and a unique set of features including automatic quote extraction, transcription, and AI summaries of journal entries. 
<br><br>
<img width="258" alt="logo" src="https://github.com/StanfordCS194/Win24-Team16/assets/63484896/f709888c-da07-4293-a41a-c5905dd9705d">
<br><br>
Theme songs: ["Tell Me a Story" by Jimmy Boyd](https://www.youtube.com/watch?v=LjBWApYXSTg) and ["Remember When" by Alan Jackson](https://www.youtube.com/watch?v=TTA2buWlNyM) because they speak to the purpose of our app in capturing stories. 


## Getting Started

1. To run the client on your laptop:
   1. `cd client`
   2. `yarn` installs packages
   3. `yarn ios`
   4. **Important**: Verify that you can build with `npx expo run:ios`

2. To run the backend locally:
   1. `cd flask-server`
   2. Create a Python virtual environment using `python3 -m venv venv`. Activate the environment using `source venv/bin/activate`
   3. Install packages using `pip install -r requirements.txt`. Note in some environments, use pip3 instead of pip. Install any additional needed dependencies using pip3 or pip.
   4. In the 'flask-server' directory, create an .env file and add your OPENAI key using the format `OPENAI_KEY=` (no quotations).
   5. Run the server using `flask run`.

3. Using your phone:
   1. download the `Expo Go` app on your phone
   2. scan the QR code that appears in your laptop command line after running the above commands to launch the application in the `Expo Go` app

4. make edits to the codebase! you should see your changes live on your phone

5. NOTE: if info.plist is getting denied, remove the entire `ios` folder and run `yarn ios` again

The website is initialized within `echo-web/` as a submodule for cleanliness and deployment convenience. You will have to `cd echo-web` then `git pull` to receive the submodule, or have `git clone`d this entire repo with `--recurse-submodules` specified.

## Troubleshooting

- If `yarn ios` does not work, try re-building the project from a new folder that **does not contain any file or folder containing a space** in its pathname. This appears to be an unfixed expo bug (booo)
- If compile error: remove ios folder `sudo rm rf ios` and node modules `sudo rm rf node_modules`, then build using `npx expo run:ios`.
