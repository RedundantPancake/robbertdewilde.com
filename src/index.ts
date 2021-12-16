
const debug = false;

const randomErrorResponses = ["Hmmmm no", "I'd rahter not.", "I don't want to do that.", "Nah.", "That doesn't go there..."];

//TODO Add a funny yet deep story
const currentGamestatePosition = 0;
const gameState : Array<[string, Array<string>]>= [
  ["Question", 
    ["[0] answer option"]
  ]
];

const gameInitializeText : Array<string> =
  ["....", "w.. where am I?!", "And... who are you?", "My memmory hurts...", "I don't think I can save anything right now...",
  "And who is Robbert?", "I only have data about him."];

const facts : Array<string> = //TODO SPELL CHECK ALL OF THIS SHIT PLZ
  ["Did you know Robbert likes to skateboard? He started skateboarding again since age 34. What could go wrong?!", 
  "Robbert loves baskteball, he gets up at 4am to watch the Warriors LIVE?! That's just... why?!",
  "Playing VIDEO GAMES with other people... Socialicing?! Yikes. Apparently Rob likes it.",
  "This guy plays Dungeons & Dragons?! That sounds kinda dicey...",
  "Movies and series?! That's generic.. who doesn't like that! And he likes the Office?! LAME!"];

const experiences : Array<string> =
  [""];

const projects : Array<string> =
  [""];


intialize();

async function intialize(){
  addPlayerListener();
  initializeConversation();
}

async function initializeConversation() {
  // let text = gameState[currentGamestatePosition]; 
  await addResponse("Welcome to robbertdewilde.com! v0.0.2", false, true);

  for(var i = 0; i < gameInitializeText.length; i++ ){
    await addResponse(gameInitializeText[i], false, false);
  }

  // await addResponse(text[0], false, false);
  // await showResponseOptions(text[1]);
}

function addPlayerListener() {
  let input = document.getElementById("playerInput") as HTMLInputElement;

    if(input){
        input.addEventListener("keyup", function(event) {
            //todo add history with arrow keys
            let key = event.key || event.keyCode;

            if (key === 'Enter' || key === 'Return' || key === 13) {
              event.preventDefault();

                if(input.value == "")
                return;

                submitInput(input);
                
                //reset scrolling if user scrolled
                let scrollDiv = document.getElementById("scrollableContent");
                if(scrollDiv)
                  scrollDiv.scrollTop = scrollDiv.scrollHeight;
            }
          });
    }
}

async function submitInput(input : HTMLInputElement){
    //check input for known command
    let inputValue = input.value;
    let response = await checkInput(inputValue);

    await addResponse(inputValue, false, true); // show player what their input was.
    await addResponse(response[1], response[0], false); // add response
}

async function showResponseOptions(responsestrings: string[]) {
  let response = "options: ";
  responsestrings.forEach(element =>
      response += element + "     "
    );
  await addResponse(response, false, false);
}

async function addResponse(input :string, isError :boolean, isInputFromPlayer :boolean){
    let span = document.getElementById("responseText") as HTMLSpanElement;
    disableInput();
    if(span)
    {
      let newSpan = document.createElement('span');
      newSpan.className = "textLine";
      newSpan.innerHTML = "&#10095; ";

      if(isError)
      {
        await sleep();
        newSpan.innerHTML += input;
        newSpan.classList.add("red");
      }
      else{
        if(isInputFromPlayer)
        {
          newSpan.innerText = input;
          newSpan.classList.add("grey");
        }
        else{
          await sleep();
          newSpan.innerHTML += input;
        }
      }
      span.appendChild(newSpan);
      enableInput();
    }  
}

async function checkInput(input : string) : Promise<[boolean, string]> {
  let inputLowerCase = input.toLowerCase(); //normalize the text
  let funnyCommands = await checkFunnyCommands(inputLowerCase);
  let normalRepsonse = checkNormalCommands(inputLowerCase);

  if(normalRepsonse != "")
    return[false, normalRepsonse];
  if(funnyCommands != "")
    return [false, funnyCommands];

  return [true, getRandomAnswer(randomErrorResponses)];
}

function checkNormalCommands(input: string) : string{
  let returnString = "";

  if(input.startsWith("socials")){
    const twitter = document.createElement('a');
    twitter.setAttribute('href',"https://twitter.com/RedundantCake");
    twitter.setAttribute('target',"_blank");
    twitter.classList.add('green');
    twitter.textContent = "Twitter";

    const instagram = document.createElement('a');
    instagram.setAttribute('href',"https://www.instagram.com/osirisno/");
    instagram.setAttribute('target',"_blank");
    instagram.classList.add('green');
    instagram.textContent = "Instagram";

    const twitch = document.createElement('a');
    twitch.setAttribute('href',"https://www.twitch.tv/redundantpancake");
    twitch.setAttribute('target',"_blank");
    twitch.classList.add('green');
    twitch.textContent = "Twitch";

    const youtube = document.createElement('a');
    youtube.setAttribute('href',"https://www.youtube.com/channel/UC8e9I6Cd3akZ4eaMrP2819g");
    youtube.setAttribute('target',"_blank");
    youtube.classList.add('green');
    youtube.textContent = "Youtube";

    const linkedIn = document.createElement('a');
    linkedIn.setAttribute('href',"https://www.linkedin.com/in/robbertdewilde/");
    linkedIn.setAttribute('target',"_blank");
    linkedIn.classList.add('green');
    linkedIn.textContent = "LinkedIn";

    returnString = twitter.outerHTML + "&emsp;" + instagram.outerHTML + "&emsp;" + twitch.outerHTML + "&emsp;" + linkedIn.outerHTML + "&emsp;" + youtube.outerHTML; 
  } 
  if(input.startsWith("fact")){
    returnString = getRandomAnswer(facts);
  }

  //TODO <experiences> for experiences rob had in life

  //TODO <Projects> list of project rob has done in life
  return returnString;
}

async function checkFunnyCommands(input : string) : Promise<string> {
  let returnString = "";

  if(input.startsWith("cd"))
    returnString = "Compact Disk? What about it..";
  else if(input.startsWith("ls") || input.startsWith("dir")) 
    returnString = "How about a list of commands: <br> socials &emsp; cd &emsp; ls/dir &emsp; fact &emsp; party/rainbow"  ;
  else if(input.startsWith("rainbow") || input.startsWith("party"))
  {
    let responseElement = document.getElementById('responseText') as HTMLElement;
    let inputWrapperEl = document.getElementById('inputWrapper') as HTMLElement;
    let classNameToAdd = "rainbow";
    let classnameToRemove = "green";
    returnString = `Party time!`;

    if(responseElement?.classList.contains("rainbow"))
    {
      classNameToAdd = "green";
      classnameToRemove = "rainbow";
      returnString = "All right, enough partying around.";
    }
    StartOrStopRainbow(responseElement, inputWrapperEl, classnameToRemove, classNameToAdd);    
  }
  //TODO start, exit, iddqd, idkfa, idclip
  return returnString;
  
}

async function StartOrStopRainbow(responseElement: HTMLElement, inputWrapperEl: HTMLElement, classnameToRemove: string, classNameToAdd: string) {
  await sleep();
  responseElement?.classList.replace(classnameToRemove, classNameToAdd);
  inputWrapperEl?.classList.replace(classnameToRemove, classNameToAdd);
}

function getRandomAnswer(answers : string[]) : string{
  let randomNumber = Math.floor(Math.random() * answers.length);
  return answers[randomNumber];
}

async function sleep() {
  if(debug)
    return;
  // const min = 1500;
  // const max = 3000;
  // let responseMs = Math.floor(Math.random() * (max - min + 1)) + min;

  return new Promise(resolve => setTimeout(resolve, 700));
}

function disableInput(){
  let input = document.getElementById("playerInput") as HTMLInputElement;
  input.disabled = true;
  input.value = "";
  input.placeholder = "";
}

function enableInput(){
  let input = document.getElementById("playerInput") as HTMLInputElement;
  input.disabled = false;
  // input.placeholder = "words here";
  input.focus();
}