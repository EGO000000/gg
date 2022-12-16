/*
 * Created by Stefan Korecko, 2020-21
 * Opinions form processing functionality
 */

/*
This function works with the form:

<form id="opnFrm">
    <label for="nameElm">Your name:</label>
    <input type="text" name="login" id="nameElm" size="20" maxlength="50" placeholder="Enter your name here" required />
    <br><br>
    <label for="opnElm">Your opinion:</label>
    <textarea name="comment" id="opnElm" cols="50" rows="3" placeholder="Express your opinion here" required></textarea>
    <br><br>
    <input type="checkbox" id="willReturnElm" />
    <label for="willReturnElm">I will definitely return to this page.</label>
    <br><br>
    <button type="submit">Send</button>
</form>

 */
export default function processOpnFrmData(event){
    //1.prevent normal event (form sending) processing
    event.preventDefault();
    const UserName = document.getElementById("User").value.trim();
    const UserEmail = document.getElementById("EmailUser").value.trim();
    const UserOpn = document.getElementById("opn").value.trim();
    const UserUrl = document.getElementById("UserUrl").value.trim();
    const rad = document.querySelector('input[ name = fig ]:checked');
    const site1 = document.getElementById("site1").checked;
    const site2 = document.getElementById("site2").checked;
    const site3 = document.getElementById("site3").checked;
    const UserGrade = document.getElementById("grad").value.trim();
    if(UserName=="" || UserEmail=="" || UserOpn==""){
        //if(UserName==""|| UserOpn==""){
        window.alert("Please, enter both your name, email and opinion");
        return;
    }

    let newOpinion =
        {
            name: UserName,
            email: UserEmail,
            comment: UserOpn,
            url: UserUrl,
            radiobtn: rad,
            site1like: site1,
            site2like: site2,
            site3like: site3,
            grade: UserGrade,
            created: new Date()
        };
    let opinions = [];

    if(localStorage.myTreesComments){
        opinions=JSON.parse(localStorage.myTreesComments);
    }

    opinions.push(newOpinion);
    localStorage.myTreesComments = JSON.stringify(opinions);


    //5. Go to the opinions
    window.location.hash="#opinions";

}
