const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const filePath = path.join(__dirname, 'text.txt');
const outputStream = fs.createWriteStream(filePath);
rl.question('Please enter any text:', (data) => {
    outputStream.write(data);
    console.log("Enter something else:");
});

rl.on('line', (data) => {
    if (data === 'exit') {
        console.log("Have a good day!");
        rl.close();
    } else {
        outputStream.write(data + '\n');
        console.log("Enter something else:");
    }
});

rl.on('SIGINT', () => {
    console.log("Have a good day!");
    rl.close();
}
);





// const filePath = path.join(__dirname, 'text.txt');
// const output = fs.createWriteStream(filePath);

// stdin.on('data', data => {
//     const dataStr = data.toString();
//     console.log(dataStr);
//     if (dataStr == 'exit') {

//         process.exit();
//     } else {
//         output.write(data)
//     }
// });

