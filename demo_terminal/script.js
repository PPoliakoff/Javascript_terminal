import { Terminal, History } from "../terminal/terminal.js";
const COL = 60;
const ROW = 100;
const myTerminal = new Terminal(document.getElementById("myTerminal"), COL, ROW);

const myHistory = new History()

async function run() {
    let prompt = ">";
    do {
        const value = await myTerminal.input(prompt, myHistory);
        myTerminal.print("\n");
        if (value.length > 0) {
            myHistory.push(value);
            let space = value.indexOf(" ");
            if (space < 0) {
                space = value.length;
            }
            const command = value.substring(0, space);
            const parameter = value.substring(space + 1)

            // handle the command
            if (command === "back") {
                myTerminal.backgroundColor = parameter;
            }
            else if (command === "clear") {
                myTerminal.clear();
            }
            else if (command === "color") {
                myTerminal.foregroundColor = parameter;
            }
            else if (command === "help" || command === "man") {
                myTerminal.print("\n");
                myTerminal.print("Supported commands:\n");
                myTerminal.print("back <color>    : Set the background color\n");
                myTerminal.print("clear           : clear the screen\n");
                myTerminal.print("color <color>   : Set the text color\n");
                myTerminal.print("help            : display this help\n");
                myTerminal.print("history         : display the history of commands\n");
                myTerminal.print("man             : display this help\n");
                myTerminal.print("prompt <prompt> : specify the input prompt\n");
                myTerminal.print("reset           : clear everything and restore settings\n");
                myTerminal.print("\n");
            }
            else if (command === "history") {
                myTerminal.print("\n");
                for (let i = 0; i < myHistory.getLength(); i++) {
                    myTerminal.print("- " + myHistory.getEntry(i) + "\n");
                }
                myTerminal.print("\n");

            }
            else if (command === "prompt") {
                prompt = parameter;
            }
            else if (command === "reset") {
                prompt = ">";
                myTerminal.foregroundColor = "black";
                myTerminal.backgroundColor = "cyan";
                myTerminal.clear();
                myHistory.reset();
            }
            else {
                myTerminal.print('unknown command ' + value + '\n');
            }
        }
    }
    while (true);
}

run();
/*
// create web audio api context
//const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
// const oscillator = audioCtx.createOscillator();
// const gain = audioCtx.createGain();
// gain.gain.value = 0;
// oscillator.type = 'square';
// oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
// oscillator.connect(gain);
// gain.connect(audioCtx.destination);
// oscillator.start();
// gain.gain.value = 0.1;
window.addEventListener("keydown", (event) => {
    const key = event.key;
    myTerminal.setCharAt(' ', 20, 12);
    myTerminal.backgroundColor = "cyan";

    if (key == 'ArrowDown') {
        myTerminal.scrollUp();
        // oscillator.frequency.setValueAtTime(660, audioCtx.currentTime); // value in hertz

    }
    else if (key == 'ArrowUp') {
        myTerminal.scrollDown();
        // oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // value in hertz

    }
    else if (key == 'ArrowRight') {
        myTerminal.scrollLeft();
        // oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // value in hertz


    }
    else if (key == 'ArrowLeft') {
        myTerminal.scrollRight();
        // oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    }
    myTerminal.backgroundColor = "red";
    myTerminal.setCharAt('@', 20, 12);

})
*/


//Create the terminal
