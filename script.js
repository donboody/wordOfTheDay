const dictionaryKey = config.DICTIONARY_KEY;
const spanishKey = config.SPANISH_KEY;
let searchTerm = localStorage.getItem("searchTerm") || "search";
const definitionsDiv = document.querySelector(".definitions");
const FETCH_URL = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=${dictionaryKey}`;

function fetchWordDefinitions() {
  const promise = fetch(FETCH_URL);
  promise
    .then(function(response) {
      const processingPromise = response.json();
      return processingPromise;
    })
    .then(function(processedResponse) {
      console.log(processedResponse);
      document.querySelector(".word-display").innerText = searchTerm;
      buildWordCards(processedResponse);
    });
}

/*
Builds a stack of word card components, one card for each item in the array.
returnedArray: the array of objects returned from the AJAX call to the API
*/
function buildWordCards(returnedArray) {
  const wordCardsDiv = document.createElement("div");
  wordCardsDiv.setAttribute("class", "word-cards");
  definitionsDiv.appendChild(wordCardsDiv);
  if (returnedArray.length > 0) {
    for (element of returnedArray) {
      buildWordCard(element, wordCardsDiv);
    }
  } else {
    const noResultsFound = document.createElement("p");
    noResultsFound.setAttribute("class", "word-cards");
    noResultsFound.innerText = "No results found.";
    definitionsDiv.appendChild(noResultsFound);
  }
}

/*
Builds a word card that includes a part of speech and however many definitions are associated with that specific usage of the word.
returnedObject: the object instance from the array that is returned from the AJAX call to the API
wordCardsParentElement: whichever element this component will be nested inside
*/
function buildWordCard(returnedObject, wordCardsParentElement) {
  const wordCardDiv = document.createElement("div");
  wordCardDiv.setAttribute("class", "word-card");
  wordCardsParentElement.appendChild(wordCardDiv);
  buildPartOfSpeech(returnedObject, wordCardDiv);
  buildDefinitionSet(returnedObject, wordCardDiv);
}

/*
Builds a p that contains the part of speech for the specific useage of the word
returnedObject: the object instance from the array that is returned from the AJAX call to the API
wordCardsParentElement: whichever element this component will be nested inside
*/
function buildPartOfSpeech(returnedObject, parentElement) {
  const partOfSpeech = returnedObject.fl;
  const p = document.createElement("p");
  p.setAttribute("class", "part-of-speech");
  p.innerText = formatPlainString(partOfSpeech);
  parentElement.appendChild(p);
}

/*
Builds a ul that contains a li for each specific defintiion attributed to the specific useage of the word
returnedObject: the object instance from the array that is returned from the AJAX call to the API
wordCardsParentElement: whichever element this component will be nested inside
*/
function buildDefinitionSet(returnedObject, parentElement) {
  const definitionsArray = returnedObject.shortdef;
  const ul = document.createElement("ul");
  ul.setAttribute("class", "definition-set");
  for (let i = 0; i < definitionsArray.length; i++) {
    const li = document.createElement("li");
    li.setAttribute("class", "definition-text");
    const definition = formatPlainString(definitionsArray[i]);
    li.innerText = `${i + 1}. ${definition}.`;
    ul.appendChild(li);
  }
  parentElement.appendChild(ul);
}

/*
Utility function to capitalize first letter of any string
*/
function formatPlainString(unformattedString) {
  if (!unformattedString) {
    return " ";
  }
  const firstLetterOfString = unformattedString.charAt(0).toUpperCase();
  const restOfString = unformattedString.slice(1);
  const formattedString = `${firstLetterOfString}${restOfString}`;
  return formattedString;
}

/*
Adds search term to local storage so it can be referenced when the page reloads
*/
function setSearchTerm() {
  searchTerm = document.querySelector(".search-field").value;
  localStorage.setItem("searchTerm", searchTerm);
}

document
  .querySelector(".search-button")
  .addEventListener("click", fetchWordDefinitions());

document
  .querySelector(".search-form")
  .addEventListener("submit", setSearchTerm);
