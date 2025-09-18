const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputFile = document.getElementById('file');
const buttonDecode = document.getElementById('btnDecode');
const messageInput = document.getElementById('message');

let selectedFile = null;
inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (!file) {
        selectedFile = null;
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result
        img.onload = () => {
            selectedFile = file;
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
        }
    }
    reader.readAsDataURL(file)
})

function convertNumberToBinary(number) {
    return number.toString(2).padStart(24, '0'); // 24-bit binary
}
function convertBinaryToNumber(binary) {
    return parseInt(binary, 2);
}
function convertCharToNumber(char) {
    return char.codePointAt(0);
}
function convertNumberToChar(number) {
    console.log(number)
    return String.fromCodePoint(number);
}

buttonDecode.addEventListener('click', () => {
    if (selectedFile === null) {
        alert('Please select a file first')
        return;
    }
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let fullString = "";
    let bitBuffer = "";

    for (let i = 0; i < data.length; i++) {
        // collect the LSB from each pixel component
        bitBuffer += convertNumberToBinary(data[i])[23]; // take last bit of 24-bit binary
        console.log(bitBuffer);
        // once we collect 24 bits = 1 character
        if (bitBuffer.length === 24) {
            if (bitBuffer == '000000000000000000000000') {
                break; // end marker (all zeros)
            }
            const num = convertBinaryToNumber(bitBuffer);
            fullString += convertNumberToChar(num);
            bitBuffer = "";
        }
    }

    messageInput.value = fullString;
});
