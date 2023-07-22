/* Terminal API
clear
setCharAt
Print
GetCharAt
SetTextColor
SetBackgroundColor
ScrollUp
scrollDown
GetCursorX
GetCursorY
PrintAt
scrollLeft
scrollRight

Input

DefineChar
ResetChar

HideCursor
ShowCursor

keypressed
*/
class History {
    constructor() {
        this.reset();
    }

    getEntry(index) {
        return this.history[index];
    }

    getLength() {
        return this.history.length;
    }

    push(entry) {
        const alreadyInHistory = this.history.indexOf(entry);
        if (alreadyInHistory > -1) {
            this.history.splice(alreadyInHistory, 1);
        }
        this.history.push(entry);
        this.historyIndex = this.history.length;
    }

    previousEntry() {
        if (this.history.length > 0) {
            this.historyIndex--;
            if (this.historyIndex < 0) {
                this.historyIndex = this.history.length - 1;
            }
            return this.history[this.historyIndex];
        }
        return "";
    }

    nextEntry() {
        if (this.history.length > 0) {
            this.historyIndex++;
            if (this.historyIndex >= this.history.length) {
                this.historyIndex = 0;
            }
            return this.history[this.historyIndex];
        }
        return "";
    }

    reset() {
        this.history = []
        this.historyIndex = 0;
    }
}


class Terminal {
    constructor(div, nColumns, nRows) {
        this.nColumns = nColumns;
        this.nRows = nRows;
        this.containerDiv = document.createElement('div');
        this.containerDiv.style.width = "fit-content";
        this.containerDiv.style.height = "fit-content";
        this.containerDiv.style.border = "solid 1px yellow";

        this.tableElement = document.createElement('table');
        //this.tableElement.style.tableLayout = "auto";
        div.appendChild(this.containerDiv);
        this.containerDiv.appendChild(this.tableElement);

        this.tableElement.style.aspectRatio = `${this.nColumns} / ${this.nRows}`
        this.xpos = 0;
        this.ypos = 0;
        this.foregroundColor = "black";
        this.backgroundColor = "cyan";
        for (let i = 0; i < this.nRows; i++) {
            this.#insertRow(i);
        }
        window.addEventListener("resize", event => this.resizeTerminal());
        this.inputX = -1;
        this.inputY = -1;

        this.resizeTerminal();
    }

    // private methods
    #insertRow(row) {
        const tr = this.tableElement.insertRow(row);
        tr.style.display = "flex";
        tr.style.height = (100 / this.nRows) + "%"
        for (let j = 0; j < this.nColumns; j++) {
            const cell = tr.insertCell();
            //cell.style.width = (100 / this.nColumns) + "%"
            //cell.style.fontSize = (100 / this.nColumns) + "vw"
            cell.classList.add("terminalChar");
        }
        this.#clearLine(tr.rowIndex);
    }

    #clearLine(i) {
        for (let j = 0; j < this.nColumns; j++) {
            this.setCharAt(' ', j, i);
        }

    }

    #getCellElement(x, y) {
        return this.tableElement.rows[y].cells[x];
    }

    #displayInputField(prompt) {
        // create an input field

        let myInput = document.createElement("input");
        myInput.setAttribute('type', 'text');
        myInput.classList.add("terminalChar");
        this.print(prompt);
        const cell = this.#getCellElement(this.xpos, this.ypos);
        cell.style.backgroundColor = this.backgroundColor;
        cell.style.color = this.foregroundColor;
        cell.innerHTML = "";
        for (let x = this.xpos + 1; x < this.nColumns; x++) {
            //hide the cells where the input field shall be placed
            this.tableElement.rows[this.ypos].cells[x].style.width = "0px";
        }

        myInput.style.backgroundColor = this.backgroundColor;
        myInput.style.color = this.foregroundColor;
        myInput.style.outline = "none";
        myInput.style.borderStyle = "solid";
        myInput.style.borderWidth = "1px";
        myInput.style.borderColor = this.foregroundColor;
        myInput.style.width = "100%"
        cell.appendChild(myInput);
        myInput.focus();
        cell.style.display = "flex";
        cell.style.width = (100 / this.nColumns * (this.nColumns - this.xpos)) + "%";
        return myInput
    }

    #removeInputField(myInput) {
        // destroy the input field
        myInput.remove();
        for (let x = this.xpos; x < this.nColumns; x++) {
            this.#getCellElement(x, this.ypos).style.width = null;
        }
        this.#getCellElement(this.xpos, this.ypos).style.display = null;
        this.setCharAt(' ', this.xpos, this.ypos);
    }

    setCharAt(c, x, y) {
        //const cell = this.tableElement.getElementsByTagName("td")[y * this.nColumns + x];
        const cell = this.#getCellElement(x, y);
        cell.style.backgroundColor = this.backgroundColor;
        cell.style.color = this.foregroundColor;
        cell.innerHTML = c.charAt(0);
    }

    getCharAt(x, y) {
        //const cell = this.tableElement.getElementsByTagName("td")[y * this.nColumns + x];
        return this.#getCellElement(x, y).textContent;
    }

    getCaretX() {
        return this.xpos;
    }

    getCaretY() {
        return this.ypos;
    }

    clear() {
        for (let i = 0; i < this.nRows; i++) {
            this.#clearLine(i);
        }
        this.xpos = 0;
        this.ypos = 0;
    }

    //print char at caret and goes to the next line if needed
    printChar(c) {
        if (c == '\n') {
            this.newLine();
        }
        else {
            this.setCharAt(c, this.xpos, this.ypos);
            this.xpos++;
            if (this.xpos >= this.nColumns) {
                this.newLine();
            }
        }
    }

    //move the caret to the beginning of next line
    newLine() {
        this.xpos = 0;
        this.ypos++;
        if (this.ypos >= this.nRows) {
            this.ypos = this.nRows - 1;
            this.scrollUp();
        }
    }

    // print a string at caret position
    print(str) {
        for (let i = 0; i < str.length; i++) {
            this.printChar(str.charAt(i));

        }

    }

    // print a string at specified location
    printAt(x, y, str) {
        this.xpos = x;
        this.ypos = y;
        this.print(str);
    }

    async inputAt(x, y, prompt, history) {
        this.xpos = x;
        this.ypos = y;
        return await this.input(prompt, history);
    }

    async inputIntAt(x, y, prompt, minValue, maxValue) {
        this.xpos = x;
        this.ypos = y;
        return await this.inputInt(prompt, minValue, maxValue);
    }

    async inputInt(prompt, minValue, maxValue) {
        const myInput = this.#displayInputField(prompt);

        let retval;
        do {
            // wait for event
            myInput.value = "";
            await this.waitForEnter(myInput);
            retval = Number(myInput.value);
        } while (!Number.isInteger(retval) || retval < minValue || retval > maxValue)

        this.#removeInputField(myInput);

        // print the inputed text
        this.print(retval.toString());

        //return the string
        return retval;

    }

    async input(prompt, history) {
        const myInput = this.#displayInputField(prompt);

        // wait for event
        await this.waitForEnter(myInput, history);
        const retval = myInput.value.trim();

        this.#removeInputField(myInput);

        // print the inputed text
        this.print(retval);

        //return the string
        return retval;
    }

    waitForEnter(input, history) {
        return new Promise((resolve) => {
            const keyboardHandler = (event) => {
                if (event.key === 'Enter') {
                    resolve();
                } else if (history != undefined && event.key === 'ArrowUp') {
                    input.value = history.previousEntry();
                }
                else if (history != undefined && event.key === 'ArrowDown') {
                    input.value = history.nextEntry();
                }
            }
            input.addEventListener("keydown", keyboardHandler);
        })
    }


    resizeTerminal() {
        // if (this.inputX >= 0) {
        //     this.#getCellElement(this.inputX, this.inputY).style.width = (this.tableElement.clientWidth / this.nColumns * (this.nColumns - 11)) + "px";

        // }
        //handle the resize including font size, row height, column width
        //resize the table

        //compute font size
        // let targetSize = 4;
        // const mydiv = document.createElement("div");
        // mydiv.innerText = "0";
        // mydiv.classList.add("terminalChar");
        // mydiv.style.width = "min-content";
        // document.getElementsByTagName("body")[0].appendChild(mydiv);
        // let divH;
        // let divW;
        // //const targetWidth = window.screen.width / this.nColumns;// 
        // const targetWidth = this.tableElement.parentElement.scrollWidth / this.nColumns;

        // console.(this.tableElement.parentElement.scrollWidth);
        // //this.tableElement.style.visibility = "collapse";

        // const targetHeight = window.screen.height / this.nRows;// this.tableElement.parentElement.scrollHeight / this.nRows;
        // // this.tableElement.style.height = "100%";
        // // this.tableElement.style.width = "min-content";

        // do {
        //     targetSize++;
        //     mydiv.style.fontSize = `${targetSize}px`;
        //     divW = mydiv.scrollWidth;
        //     divH = mydiv.clientHeight;
        // }
        // while (divH < targetHeight &&
        // divW < targetWidth && targetSize < 148);
        // this.tableElement.style.fontSize = `${targetSize - 1}px`;
        // //mydiv.remove();

        // this.tableElement.style.height = divH * this.nRows + "px";
        // this.tableElement.style.width = divW * this.nColumns + "px";

    }

    scrollUp() {
        this.tableElement.deleteRow(0);
        this.#insertRow(-1);
    }

    scrollDown() {
        this.tableElement.deleteRow(this.tableElement.rows.length - 1);
        this.#insertRow(0);
    }

    scrollLeft() {
        for (let i = 0; i < this.tableElement.rows.length; i++) {
            const tr = this.tableElement.rows[i]
            tr.deleteCell(0);
            const cell = tr.insertCell();
            cell.classList.add("terminalChar");
            cell.style.backgroundColor = this.backgroundColor;
            cell.style.color = this.foregroundColor;
            cell.innerHTML = ' ';
        }
    }

    scrollRight() {
        for (let i = 0; i < this.tableElement.rows.length; i++) {
            const tr = this.tableElement.rows[i]
            tr.deleteCell(-1);
            const cell = tr.insertCell(0);
            cell.classList.add("terminalChar");
            cell.style.backgroundColor = this.backgroundColor;
            cell.style.color = this.foregroundColor;
            cell.innerHTML = ' ';
        }
    }

}

export { Terminal, History }
