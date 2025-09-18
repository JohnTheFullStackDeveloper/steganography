const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputFile = document.getElementById('file');
const encodeButton = document.getElementById('btnEncode');
const downloadButton = document.getElementById('btnDownload');
const messageInput = document.getElementById('message');
const passwordInput = document.getElementById('pass');
var selectedFile = null;
downloadButton.style.display = 'none';
inputFile.addEventListener('change', (event) => {
    downloadButton.style.display = 'none';
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
function textToBytes(str) {
    return new TextEncoder().encode(str); // UTF-8 bytes
}

function bytesToText(bytes) {
    return new TextDecoder().decode(Uint8Array.from(bytes));
}

// Encrypt function
function Encrypt(text, password) {
    const chars = [...text];       // ensures emojis are treated as single characters
    const pwdChars = [...password];
    let result = '';

    for (let i = 0; i < chars.length; i++) {
        const msgCode = chars[i].codePointAt(0);
        const shift = pwdChars[i % pwdChars.length].codePointAt(0);
        // Simple shift with wraparound (max 0x10FFFF)
        result += String.fromCodePoint((msgCode + shift) % 0x10FFFF);
    }

    return result;
}

// Decrypt function

function convertNumberToBinary(number) {
    return number.toString(2).padStart(24, '0');
}
function convertBinaryToNumber(binary) {
    return parseInt(binary, 2);
}
function convertCharToNumber(char) {
    return char.codePointAt(0);
}
function convertNumberToChar(number) {
    return String.fromCodePoint(number);
}
function addLsb(binaryOfPixel, binaryOfNumber) {
    binaryOfPixel = binaryOfPixel.split('')
    binaryOfPixel[23] = binaryOfNumber
    binaryOfPixel = binaryOfPixel.join('')
    return binaryOfPixel
}
encodeButton.addEventListener('click', () => {
    if (selectedFile == null) {
        alert('Please select a file first')
        return;
    }
    if (messageInput.value.trim() === '') {
        alert('Please enter a secret message')
        return;
    }
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let hideMessage = messageInput.value.trim();
    hideMessage = Encrypt(hideMessage, passwordInput.value.trim() || 'pass');
    let binaryDataToHide = [...hideMessage];
    binaryDataToHide = binaryDataToHide.map(char => convertCharToNumber(char))
    console.log(binaryDataToHide);
    binaryDataToHide = binaryDataToHide.map(number => convertNumberToBinary(number))
    console.log(binaryDataToHide);
    binaryDataToHide = binaryDataToHide.join('')
    console.log(binaryDataToHide)
    let i;
    for(i=0;i< binaryDataToHide.length;i++){
        const binaryOfData = convertNumberToBinary(data[i])
        data[i] =convertBinaryToNumber(addLsb(binaryOfData, binaryDataToHide[i]))
    }
    for(let j=0;j<24;j++){
        data[j+i] = convertBinaryToNumber(addLsb(convertNumberToBinary(data[j+i]),0))
    }
    ctx.putImageData(imgData,0,0)
    downloadButton.style.display = 'block';
})
downloadButton.addEventListener('click', () => {
    const link = document.createElement("a");
    link.download = "stego.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
})

