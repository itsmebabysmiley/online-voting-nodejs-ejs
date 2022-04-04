var dontWorryAboutNameVariable = `<div class="container" >
                                    <h1> <b>Thank you for your vote!</b></h1>
                                    You can donate the developer by scan this QR-code.
                                    <div class="container my-4 ">
                                        <img src="./images/donate/donateQR.jpg" alt="" srcset="" width="300">
                                    </div>
                                   </div>`
var dontWorryAboutNameVariableV2 = `<h1> <b>Your vote is important!</b></h1>
                                    <div class="container d-flex" style="width: 550px;">
                                        <p style="text-align: justify;  margin-top: 1rem;">You can vote only one time. Therefore, please be careful about the candidate. If you vote for Payut, you will face the bright future. </p>
                                    </div>
                                    <div class="container">
                                        <div class="row justify-content-start">
                                            <div class="col">
                                                <h2 id="vote-btn1"></h2>
                                                <a class="btn btn-primary btn-lg zoom shadow m-3" id="button1" onclick="vote(1)" value=""> VOTE NOW </a>
                                            </div>
                                            <div class="col">
                                                <h2 id="vote-btn2"></h2>
                                                <a class="btn btn-primary btn-lg zoom shadow m-3" onclick="vote(2)" value=""> VOTE NOW </a>
                                            </div>
                                        </div>
                                    </div>`
var dontWorryAboutNameVariableV3 = `<div class="container" id="never-vote">
                                        <h1> <b>Your vote is important!</b></h1>
                                        <a class="btn btn-primary btn-lg  zoom shadow m-5 " data-bs-toggle="modal" data-bs-target="#exampleModal"> VOTE NOW </a>
                                    </div>`     
var canId = []
var canName =[];
var voteInfo;

function getCookie(){
    let x = decodeURIComponent(document.cookie);
    if(x !== '')
        return JSON.parse(x.substring(x.indexOf(":")+1));
    else
        return "";
    }



async function vote(candidate){

    var userData = getCookie();
    //if user hasn't verified email, user can't vote.
    if(userData.emailVerified === 'false'){
        return goVerifyYouEmail();
    }
    //TODO : send vote to server
    axios.post('/voteme', {
        email: userData.email,
        candidateID: voteInfo[candidate-1].ID
    })
    .then(function (response) {
        if(response.data.error === false){
            return location.reload();
        }else{
            console.log(response.data);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    

    
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


async function getVoteInfo(){
    var response = await axios.get('/vote-info');
    if(response.error){
        console.log(response.data);
    }
    for(i in response.data.data){
        canId.push(response.data.data[i].ID);
        canName.push(response.data.data[i].fullname);
    }
    voteInfo = response.data.data;
    
    var userData = getCookie(); // If cookie is empty, user haven't login.
    if(userData.voted == 'true'){
        document.getElementById("already-vote").innerHTML += dontWorryAboutNameVariable;
    }else if(userData.voted == 'false'){
        document.getElementById("already-vote").innerHTML += dontWorryAboutNameVariableV2;
        document.getElementById("vote-btn1").innerHTML += canName[0];
        document.getElementById("vote-btn2").innerHTML += canName[1];
    }else if(!userData){
        document.getElementById("already-vote").innerHTML += dontWorryAboutNameVariableV3
    }
}

getVoteInfo();