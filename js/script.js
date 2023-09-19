const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("button");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const icons = document.querySelectorAll(".icons");

selectTag.forEach( (tag, id) => {
    for(const country_code in countries){
        //selecting english by default as FROM and languge Hindi as to language
        let selected;
        if(id == 0 && country_code == "en-GB"){
            selected =  "selected";
        }else if(id == 1 && country_code == "hi-IN"){
            selected =  "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); //adding option tag inside select tag
    }
});

exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;

    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value;
    let translateFrom = selectTag[0].value; // get user language from tag value
    let translateTo = selectTag[1].value; // get translate languge tag value
    //return when fromTextArea has no value
    if(!text) return;

    toText.setAttribute("placeholder", "Translating...")


    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    //fethhing api url and returning it with parse into js object
    //and in another then method recieving that obj
    fetch(apiUrl).then((res) => res.json()).then((data) => {
        // console.log(data);
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")){
            //if clicked icon has from id, copy the fromTextArea value else copy the toTextArea value
            if(target.id == "from"){
                navigator.clipboard.writeText(fromText.value);
            }else{
                navigator.clipboard.writeText(toText.value);
            }
        }else{
            let utterance;
            // if clicked icon has form id, speak the fromTextArea value else speak the toTextArea value
            if(target.id == 'from'){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang  = selectTag[0].value; //setting utterance language to fromSelect tag value
            }
            else{
                utterance =  new SpeechSynthesisUtterance(toText.value);
                utterance.lang  = selectTag[1].value; //setting utterance language to toSelect tag value
            }
            speechSynthesis.speak(utterance); //speak the passed utterance
        }
    })
});