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
    return number.toString(2).padStart(8, '0');
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
buttonDecode.addEventListener('click', () => {
    if(selectedFile === null){
        alert('Please select a file first')
        return;
    }
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let fullString = "";
    let count = 0;
    let eightBitData  = "";
    for(let i = 0;i < data.length;i++){
        count++;
        if(count == 9){
            count = 0;
            fullString+=" ";
            eightBitData = ""
            i--;
        }else{
            fullString+=convertNumberToBinary(data[i])[7]
            eightBitData+=convertNumberToBinary(data[i])[7]
            if(eightBitData.length == 8){
                if(eightBitData.split('').every(c => c == '0')){
                    fullString = fullString.substring(0,fullString.length-9);
                    break;
                }
            }
        }
    }
    messageInput.value = fullString.split(' ').map(bin => convertBinaryToNumber(bin)).map(num => convertNumberToChar(num)).join('')

})
