/*
 * routes definition and handling for paramHashRouter
 */

import Mustache from "./mustache.js";
import processOpnFrmData from "./addOpinion.js";

//an array, defining the routes
export default[

    {
        //the part after '#' in the url (so-called fragment):
        hash:"welcome",
        ///id of the target html element:
        target:"router-view",
        //the function that returns content to be rendered to the target html element:
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML
    },
    {
        hash:"articles",
        target:"router-view",
        getTemplate: fetchAndDisplayArticles
    },
    {
        hash:"opinions",
        target:"router-view",
        getTemplate: createHtml4opinions
    },
    {
        hash:"addOpinion",
        target:"router-view",
        getTemplate: (targetElm) =>{
            document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
            document.getElementById("formM").onsubmit=processOpnFrmData;
        }
    }

];

const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 20;

function createHtml4opinions(targetElm){
    const opinionsFromStorage=localStorage.myTreesComments;
    let opinions=[];

    if(opinionsFromStorage){
        opinions=JSON.parse(opinionsFromStorage);
        opinions.forEach(opinion => {
            opinion.created = (new Date(opinion.created)).toDateString();
            // opinion.willReturn =
            //     opinion.willReturn?"I will return to this page.":"Sorry, one visit was enough.";
        });
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
    );
}

function fetchAndDisplayArticles(targetElm, offsetFromHash, totalCountFromHash){

    const offset=parseInt(offsetFromHash);
    const totalCount=parseInt(totalCountFromHash);

    let urlQuery = "";
    // console.log(offset);
    if (offset != null && totalCount != null){
        urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
    }else{
        urlQuery=`?max=${articlesPerPage}`;
    }

    const url = `${urlBase}/article${urlQuery}`;

    const data = {
        currPage:offset,
        pageCount:totalCount
    }
    if(offset > 1){
        data.prevPage = offset-1;
    }

    if(offset < totalCount){
        data.nextPage = offset + 1;
    }

    function reqListener () {
        // stiahnuty text
        console.log(this.responseText)
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText)
            addArtDetailLink2ResponseJson(responseJSON);
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    {responseJSON,
                        ...data}
                );

        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }

    }

    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}

// function fetchAndDisplayArticles(targetElm, offsetFromHash, totalCountFromHash){
//
//     const offset=Number(offsetFromHash);
//     const totalCount=Number(totalCountFromHash);
//     console.log(offset);
//     let urlQuery = "";
//
//     if (!offset && totalCount){
//         urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
//     }else{
//         urlQuery=`?max=${articlesPerPage}`;
//     }
//
//     const url = `${urlBase}/article${urlQuery}`;
//     const data = {
//         currPage:offset,
//         pageCount:totalCount
//     }
//    console.log(url);
//     if(offset > 1){
//         data.prevPage = offset - 1;
//     }
//
//     if(offset < totalCount){
//         data.nextPage = offset + 1;
//     }
//
//     function reqListener () {
//         // stiahnuty text
//         console.log(this.responseText)
//         if (this.status == 200) {
//             const responseJSON = JSON.parse(this.responseText)
//             addArtDetailLink2ResponseJson(responseJSON);
//             document.getElementById(targetElm).innerHTML =
//                 Mustache.render(
//                     document.getElementById("template-articles").innerHTML,
//                     {responseJSON,
//                     ...data}
//                 );
//
//         } else {
//             const errMsgObj = {errMessage:this.responseText};
//             document.getElementById(targetElm).innerHTML =
//                 Mustache.render(
//                     document.getElementById("template-articles-error").innerHTML,
//                     errMsgObj
//                 );
//         }
//
//     }
//
//     console.log(url)
//     var ajax = new XMLHttpRequest();
//     ajax.addEventListener("load", reqListener);
//     ajax.open("GET", url, true);
//     ajax.send();
// }

function addArtDetailLink2ResponseJson(responseJSON){
    responseJSON.articles = responseJSON.articles.map(
        article =>(
            {
                ...article,
                detailLink:`#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`
            }
        )
    );
}