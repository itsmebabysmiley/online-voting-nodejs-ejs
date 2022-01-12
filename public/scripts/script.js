

function getCookie(){
    //assume that we have only cookie name userData.
    let x = decodeURIComponent(document.cookie)
    var userData = JSON.parse(x.substring(x.indexOf(":")+1));
    return userData;
}

//main function
async function vote(candidate){

    var userData = getCookie();
    if(userData.emailVerified === 'false'){
        goVerifyYouEmail();
    }
    var newData = await axios.post('/voteme', {
        email: userData.email,
        candidateID: candidate
      })
    //TODO : update the chart by export newData to use with other js files.
    
}


//purpose for only animation.
//if user haven't verify email, it will go to the alert box and shake.
function goVerifyYouEmail(){
    var elm = document.getElementById("verifyEmail");
    if(elm.classList.contains("alert-shake")){
        elm.classList.remove("alert-shake");
    }
    elm.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    elm.classList.add("alert-shake");
}
