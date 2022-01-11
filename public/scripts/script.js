function goVerifyYouEmail(){
    var elm = document.getElementById("verifyEmail");
    if(elm.classList.contains("alert-shake")){
        elm.classList.remove("alert-shake");
    }
    elm.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    elm.classList.add("alert-shake");
}

function vote(candidate, emailVerified){
    if(emailVerified == false){
        goVerifyYouEmail();
    }
    
    
}

