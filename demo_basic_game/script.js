import { Terminal } from "../terminal/terminal.js";
const terminal = new Terminal(document.getElementById("myTerminal"), 80, 30);
terminal.backgroundColor = "black"; // let's take a retro look
terminal.clear();
terminal.foregroundColor = "red";
terminal.printAt(35, 0, "BULLSEYE\n");
terminal.foregroundColor = "green";
terminal.printAt(15, 2, "Ported from David Ahl's BASIC computer GAMES book\n");
terminal.print("\n\n");
terminal.print("In this game,up to 20 players throw darts at a target\n");
terminal.print("With 10,20,30,and 40 points zones. The objective is to get 200 points.\n\n");
terminal.print("  1  Fast overarm          Bullseye or complete miss\n");
terminal.print("  2  Controlled overarm    10,20,or 30 points\n");
terminal.print("  3  Underarm              Anything\n\n");
let n = await terminal.inputIntAt(7, 12, "How many players: ", 1, 20);
terminal.print("\n\n");
const playersName = []
const scores = [];
for (let player = 0; player < n; player++) {
    scores.push(0);
    playersName.push(await terminal.input(`Name of player #${player + 1} : `));
    terminal.print("\n");
}
let round = 0;
let nWinners = 0;
const probabilities = [[0.65, 0.55, 0.5, 0.5], [0.99, 0.77, 0.43, 0.01], [0.95, 0.75, 0.45, 0.05]];
do {
    round++;
    terminal.print(`\n ------------ Round: ${round} ------------\n`);
    for (let player = 0; player < n; player++) {
        terminal.print(`\n `)
        const t = await terminal.inputInt(`${playersName[player]}'s throw:`, 1, 3);
        terminal.print("\n");
        const u = Math.random();
        if (u > probabilities[t - 1][0]) { terminal.print("Bullseye!! 40 Points\n"); scores[player] += 40; }
        else if (u > probabilities[t - 1][1]) { terminal.print("30 Points zone!\n"); scores[player] += 30; }
        else if (u > probabilities[t - 1][2]) { terminal.print("20 Points zone!\n"); scores[player] += 20; }
        else if (u > probabilities[t - 1][3]) { terminal.print("Whew! 10 Points zone!\n"); scores[player] += 10; }
        else { terminal.print("Missed the target!! Too bad\n"); }
        terminal.print(`Total score = ${scores[player]}\n`);
        if (scores[player] > 200) { nWinners++; }
    }
} while (nWinners === 0);
terminal.print("\n\n We have a winner!!\n\n");
for (let player = 0; player < n; player++) {
    if (scores[player] > 200) {
        terminal.print(`${playersName[player]} scored ${scores[player]} points\n`)
    }
}
terminal.print("\n          Thanks for the game\n");

