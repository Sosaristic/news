const mainContainer = document.querySelector('.main-container');
const searchField = document.querySelector('.search-field');
const searchIcon = document.querySelector('.fa-magnifying-glass')
const generatedContainer = document.querySelector('.generated-content');
const nextButton = document.querySelector('.next-button');
const previousButton = document.querySelector('.previous-button');
const navButtonsContainer = document.querySelector('.nav-button');
const searchResultContainer = document.querySelector('.search-results');
let articlesReturned;
let itemsReturned = 9;
let pageNumber = 1;
let totalResults;
let numberOfRsultsFetched = 0;
let currentResults;
let previousButtonClicked;

let inputValue;


async function getNews(whatToDo, typeOfButton) {
    if (whatToDo == "search") {
        let url = `https://newsapi.org/v2/everything?q=${inputValue}&searchIn=title&pageSize=12&page=${pageNumber}`;
        await fetch(url, {
            "method": "GET",
            "headers": {

                "x-Api-key": "1cadf7b5efbf443ea71bf42963420972"
            }
        })
            .then(response => {
                return response.json()
            })
            .then(data => {

                console.log(data);
                totalResults = data.totalResults;
                console.log(totalResults)
                removeAllChilds(generatedContainer);
                articlesReturned = data.articles;
                if (totalResults != undefined) {
                    searchResultContainer.innerText = `${totalResults} results found for ${inputValue}`;
                }
               else if(totalResults == undefined){
                   searchResultContainer.innerText = `no search found`;
               }

                dataContainer(articlesReturned);
                //handling buttons 
                previousButton.style.display = "none";
                nextButton.style.display = "none";
                nextButton.removeEventListener('click', nextPage);
                previousButton.removeEventListener('click', previousPage);
                if (totalResults > generatedContainer.childNodes.length) {
                    nextButton.style.display = "inline-block";
                }
                if (pageNumber > 1) {
                    previousButton.style.display = "inline-block";
                }
                nextButton.addEventListener('click', nextSearchPage);
                previousButton.addEventListener('click', previousSearchPage);

                if (typeOfButton == "next") {
                    numberOfRsultsFetched += generatedContainer.childNodes.length;
                    currentResults = generatedContainer.childNodes.length;
                }


                else if (typeOfButton == "previous") {
                    if (numberOfRsultsFetched == totalResults) {
                        numberOfRsultsFetched -= currentResults;
                    }
                    else {
                        numberOfRsultsFetched -= generatedContainer.childNodes.length;
                    }
                }
                else {
                    numberOfRsultsFetched = generatedContainer.childNodes.length;
                    currentResults = generatedContainer.childNodes.length;
                }

                window.scrollTo(0, 0);

                if (numberOfRsultsFetched === totalResults) {
                    nextButton.style.display = "none";
                }
                console.log(`results fetched ${numberOfRsultsFetched}`);
                console.log(`currentresult ${currentResults}`);

            })
            .catch(err => {
                console.error(err);
            })

    }

    // when user is not sarching
    else {
        let url = `https://newsapi.org/v2/top-headlines?country=ng&pageSize=${itemsReturned}&page=${pageNumber}`;

        await fetch(url, {
            "method": "GET",
            "headers": {

                "x-Api-key": "1cadf7b5efbf443ea71bf42963420972"
            }
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data);
                totalResults = data.totalResults;
                console.log(totalResults)
                removeAllChilds(generatedContainer);
                articlesReturned = data.articles;
                //display the articles container
                dataContainer(articlesReturned);
                //handling buttons 
                previousButton.style.display = "none";
                nextButton.style.display = "none";
                nextButton.removeEventListener('click', nextSearchPage);
                previousButton.removeEventListener('click', previousSearchPage);
                if (totalResults > generatedContainer.childNodes.length) {
                    nextButton.style.display = "inline-block";
                }
                if (pageNumber > 1) {
                    previousButton.style.display = "inline-block";
                }
                nextButton.addEventListener('click', nextPage);
                previousButton.addEventListener('click', previousPage);
                //remove next button


                if (typeOfButton == "next") {
                    numberOfRsultsFetched += generatedContainer.childNodes.length;
                    currentResults = generatedContainer.childNodes.length;
                }


                else if (typeOfButton == "previous") {
                    if (numberOfRsultsFetched == totalResults) {
                        numberOfRsultsFetched -= currentResults;
                    }
                    else {
                        numberOfRsultsFetched -= generatedContainer.childNodes.length;
                    }
                }
                else {
                    numberOfRsultsFetched = generatedContainer.childNodes.length;
                    currentResults = generatedContainer.childNodes.length;
                }
                window.scrollTo(0, 0);
                if (numberOfRsultsFetched === totalResults) {
                    nextButton.style.display = "none";
                }
                console.log(`results fetched ${numberOfRsultsFetched}`);
                console.log(`currentresult ${currentResults}`);

            })
            .catch(err => {
                console.error(err);
            })
    }
}



getNews("none");

searchIcon.addEventListener('click', () => {
    pageNumber = 1;
    numberOfRsultsFetched = 0;
    inputValue = searchField.value;
    getNews("search");
})

function removeAllChilds(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

// creating containers 

function dataContainer(dataObtained) {
    for (x in dataObtained) {
        //creating containers and adding styles
        const articleContainer = document.createElement('span');
        articleContainer.classList.add("articles-container")
        const imageContainer = document.createElement('div');
        imageContainer.classList.add("image-container")
        const titleContainer = document.createElement('h5');
        titleContainer.classList.add("title-container")
        const descriptionContainer = document.createElement('p');
        descriptionContainer.classList.add("description")
        const authorContainer = document.createElement('div');
        authorContainer.classList.add("author-container")
        const sourceContainer = document.createElement('div');
        sourceContainer.classList.add("source-container")
        const timeContainer = document.createElement('div');
        timeContainer.classList.add("time-container")
        const articleLink = document.createElement('a');
        articleLink.classList.add("link-text");

        const {
            author,
            content,
            description,
            publishedAt,
            title,
            source,
            url,
            urlToImage } = dataObtained[x];

        //setting the text contents
        titleContainer.innerText = title;
        if (description != null) {
            descriptionContainer.innerText = `${description}  ... `;
        }
        if (author != null) {
            authorContainer.innerHTML = `<b>Author:</b>    ${author}`
        }

        sourceContainer.innerText = `Source: ${source.name}`;
        let datePublished = new Date(publishedAt);

        let publishedDay = datePublished.getUTCDate();
        let publishedMonth = datePublished.getUTCMonth() + 1;
        if (publishedMonth < 10) {
            publishedMonth = "0" + publishedMonth
        }
        let publishedYear = datePublished.getFullYear();
        let publishedHour = datePublished.getUTCHours();

        let publishedMinutes = datePublished.getUTCMinutes();
        if (publishedMinutes < 10) {
            publishedMinutes = "0" + publishedMinutes;
        }

        let timeFormat;
        function formatTime(hours) {

            if (hours <= 23 && hours > 12) {
                timeFormat = "pm";
                publishedHour -= 12;
            }
            else {
                timeFormat = "am";
            }
        }
        formatTime(publishedHour);

        timeContainer.innerHTML = `<i class="fa-regular fa-clock"></i>
          ${publishedDay}/${publishedMonth}/${publishedYear} ${publishedHour}:${publishedMinutes} ${timeFormat}`;

        // creating image           

        if (urlToImage != null) {
            let articleImage = document.createElement('IMG');
            articleImage.setAttribute("src", `${urlToImage}`);
            articleImage.setAttribute("height", "100%");
            articleImage.setAttribute("width", "100%")
            articleImage.setAttribute("alt", "article image");
            imageContainer.append(articleImage)
        }
        else {
            let articleImage = document.createElement('IMG');
            articleImage.setAttribute("src", "images/News 24.png");
            articleImage.setAttribute("height", "100%");
            articleImage.setAttribute("width", "100%")
            articleImage.setAttribute("alt", "article image");
            articleImage.style.opacity = "0.2"
            imageContainer.append(articleImage)
        }


        articleLink.href = url;
        articleLink.target = "blank"
        let linkText = document.createTextNode("see more");

        articleLink.appendChild(linkText);

        //appending elements
        articleContainer.append(imageContainer);
        articleContainer.append(titleContainer);
        articleContainer.append(titleContainer);
        articleContainer.append(descriptionContainer);
        articleContainer.append(authorContainer);
        articleContainer.append(sourceContainer);
        articleContainer.append(timeContainer);
        articleContainer.append(articleLink)

        generatedContainer.append(articleContainer)
        generatedContainer.classList.add("content-container");

        // mainContainer.insertBefore(generatedContainer, navButtonsContainer);
    }
}

function nextPage() {
    pageNumber++;
    getNews("none", "next");
    previousButton.style.display = "inline-block";
}

function nextSearchPage() {
    pageNumber++;
    getNews("search", "next");
    previousButton.style.display = "inline-block";
}

function previousPage() {
    pageNumber--;
    getNews("none", "previous");


}
function previousSearchPage() {
    pageNumber--;
    getNews("search", "previous");

}