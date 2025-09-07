const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputFile = document.getElementById('file');
const encodeButton = document.getElementById('btnEncode');
const downloadButton = document.getElementById('btnDownload');
const messageInput = document.getElementById('message');
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
function convertNumberToBinary(number) {
    return number.toString(2).padStart(8, '0');
}
function convertBinaryToNumber(binary) {
    return parseInt(binary, 2);
}
function convertCharToNumber(char) {
    return char.charCodeAt();
}
function convertNumberToChar(number) {
    return String.fromCharCode(number);
}
function addLsb(binaryOfPixel, binaryOfNumber) {
    binaryOfPixel = binaryOfPixel.split('')
    binaryOfPixel[7] = binaryOfNumber
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
    const hideMessage = messageInput.value.trim();
    let binaryDataToHide = hideMessage.split('');
    binaryDataToHide = binaryDataToHide.map(char => convertCharToNumber(char))
    binaryDataToHide = binaryDataToHide.map(number => convertNumberToBinary(number))
    binaryDataToHide = binaryDataToHide.join('')
    console.log(binaryDataToHide)
    let i;
    for(i=0;i< binaryDataToHide.length;i++){
        const binaryOfData = convertNumberToBinary(data[i])
        data[i] =convertBinaryToNumber(addLsb(binaryOfData, binaryDataToHide[i]))
    }
    for(let j=0;j<8;j++){
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
