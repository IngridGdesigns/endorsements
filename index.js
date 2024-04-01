import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const databaseURL = "https://we-are-the-champions-2024-default-rtdb.firebaseio.com/";

const appSettings = {
    databaseURL
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementDatabase = ref(database, "endorsements");

const btnEl = document.getElementById("btn-el");
const inputTextArea = document.getElementById("text-area");
const inputToElement = document.getElementById("to-element");
const inputFromElement = document.getElementById("from-element");
const error = document.getElementById("error");
const endorsementsList = document.getElementById("endorsements-list")

function clearInputs() {
    inputTextArea.value = "";
    inputToElement.value = "";
    inputFromElement.value = "";
}

function clearListEl(){
    endorsementsList.innerHTML = "";
}

btnEl.addEventListener("click", function() {
    let textArea = inputTextArea.value;
    const fromPraiser = inputFromElement.value;
    const toPraised = inputToElement.value;
    
    const endorsement = {
        endorsement: textArea,
        to: toPraised,
        from: fromPraiser
    }
    
    if(textArea === ""){
        error.textContent = "---- Please write your endorsement ----"
        return;
    }
    
    if(textArea && toPraised === "" && fromPraiser === ""){
        error.textContent = "---- Please add names ----"
        return;
    }
    
    if(textArea && toPraised === "" && fromPraiser){
        error.textContent = "---- Please add 'To' name ----"
        return;
    }
    
    if(textArea && toPraised && fromPraiser === ""){
        error.textContent = "---- Please add 'From' name ----"
        return;
    } // error block probably needs to transform to switch statements
    
    error.textContent = "";
    
    push(endorsementDatabase, endorsement);
    
    clearInputs();
   
})

onValue(endorsementDatabase, function (snapshot) {
    if(snapshot.exists()) {
        let items = Object.entries(snapshot.val());
       
        clearListEl();
       
        for (let i = 0; i < items.length; i++) {
        let currentItem = items[i];
        
           addToEndorsementList(currentItem);
        }
        
    }
})

function addToEndorsementList(item){
    const [endorsementID, endorsementValue] = item;

    const { endorsement, to, from } = endorsementValue;
    
    let newEl = document.createElement("li");
   
    newEl.innerHTML = `<h3>To: ${to}</h3> ${endorsement} <h3>From: ${from}</h3>`;
    newEl.style.padding = '5px 10px';
    
    newEl.addEventListener("click", function (){
        const specificItemId = ref(database, `endorsements/${endorsementID}`);
        
        remove(specificItemId);
    })
    
    endorsementsList.append(newEl);
}