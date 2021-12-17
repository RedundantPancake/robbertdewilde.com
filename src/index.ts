const version = "v0.8.3";
const debug = false;
const thinkTime = 1500;
let unlocked = false;
let currentGamestatePosition : number = 0;
let errors : number = 0;

const randomErrorResponses = ["Hmmmm no", "I'd rahter not.", "I don't want to do that.", "Nah.", "That doesn't go there..."];

const gameState : Array<[string, Array<string>, Array<string>, number, Array<number>]>= [
  ["<BR> In order to access the data I need some help, are you willing to help me human?", 
    ["yes", "no"], ["Outstanding!", "I don't undestand sarcasm."], 0, [1]
  ],
  [`<BR> I'm going to ask you a series of 5 questions. Answer them all correctly and unlock this very cool data I have on Robbert. <br> 
    1. What is the answer to life, the universe, and everything`, 
    ["1337", "42"], ["I'm questioning everything right now.", "Well, that was easy. ON TO THE NEXT ONE!"], 1, [0]
  ],
  ["<BR> 2. In Doom (1993) what is the cheat code for god mode?", 
      ["idclip", "idkfa", "iddqd"], ["Wallhacks!", "You unlocked all weapons instead.", "Degreelessness mode on!"], 2, [0, 1]
  ],
  ["<BR> 3. Which video game developer made adventure games in which you could die?", 
    ["Sierra", "LucasArts", "Blizzard"], ["Yep, some pretty hillarious deaths too.", "Quite the opposite. Their philosophy was that the player shouldn't die.", "Warcraft Adventures: Lord of the Clans, the game that could have been."], 0, [1, 2]
  ],
  ["<BR> 4. What are the metal objects called that are connected to a skateboard. Used for'grinding'.", 
    ["Vans", "Trucks", "Bars", "Pegs"], ["Nice shoes, but nope!", "Indeed! Although I don't know why. ", "Candy bars. Spittin bars. Drinking at bars. Nope.", "These are used on BMX bikes to 'grind' with."], 1, [0, 2, 3]
  ]
  ,
  ["<BR> 5. Who holds the current all-time record for most 3 points made in the NBA?", 
    ["Lebron James", " Kobe Bryant", "Kevin Durant", "Stephen Curry", "Ray Allen"], ["A goat but nope!", "RIP... nope", "He wishes he never left the team with the person who just broke this record.", "Yep! The best shooter ever to shoot a basketball. And he is not even close to being done.", "Close, he is currently number 2. Recently passed by another person."], 3, [0, 1, 2, 4]
  ]
];

const gameInitializeText : Array<string> =
  ["....", "Where am I?", "And who are you?", "My memmory hurts.", "I don't think I can save anything right now.",
  "And who is Robbert?", "I only have data about him."];

const facts : Array<string> = //TODO SPELL CHECK ALL OF THIS SHIT PLZ
  ["Did you know Robbert likes to skateboard? He started skateboarding again at the age of 34. What could go wrong.", 
  "Robbert loves baskteball, he gets up at 4am to watch the Warriors LIVE! Whatever floats your boat.",
  "Playing VIDEO GAMES with other people. Yeah I don't get it. I don't socialize all that much. Rob loves it though. ",
  "This guy plays Dungeons & Dragons? That sounds kinda dicey.",
  "Movies and series. Well ain't that generic. Robbert likes the Office. LAME!",
  "One of the first games that Rob played was Doom on the PC. Remember those cheat codes?",
  `During the first expansion pack of World of Warcraft, The Burning Cursade, Robbert used to be guild master and raid leader. That's a lot of responsibility! <BR>
  They cleared everything up to Illidan before the guild broke down.`,
  "Robbert made his own custom keyboard, he did so on Twitch.tv it was a great experience!"
  ]; //secret unlocked cheat codes iddqd idkfa

shuffleArray(facts);
let currentFact = 0;

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
  await addResponse(`Welcome to robbertdewilde.com! ${version}`, false, true);

  for(var i = 0; i < gameInitializeText.length; i++ ){
    await addResponse(gameInitializeText[i], false, false);
  }
   
  await ProgressGamestate();
}

async function ProgressGamestate() {
  if(currentGamestatePosition < gameState.length){
    let text = gameState[currentGamestatePosition];
    await addResponse(text[0], false, false);
    await showResponseOptions(text[1]);
  }else if(!unlocked){
    let answerString = errors > 1 ? "answers" : "answer";
    await addResponse(`Thanks for playing! You gave ${errors} incorrect ${answerString}. <BR> You now unlcocked all the commands, type ls/dir to show them.`, false, false);
    unlocked = true;
  }
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

    await ProgressGamestate();
}

async function checkInput(input : string) : Promise<[boolean, string]> {
  let inputLowerCase = input.toLowerCase();
  
  if(unlocked){
    let funnyCommands = await checkFunnyCommands(inputLowerCase);
    let normalRepsonse = checkNormalCommands(inputLowerCase);
  
    if(normalRepsonse != "")
      return[false, normalRepsonse];
    if(funnyCommands != "")
      return [false, funnyCommands];
  }else{
    let correctNum = gameState[currentGamestatePosition][3];
    let inccorrectNums = gameState[currentGamestatePosition][4];

    if(!isNaN(+inputLowerCase)){ //check input number
      let num = Number(inputLowerCase);
      if(num === gameState[currentGamestatePosition][3]){
        let response = GetTextForAnswer(correctNum);
        currentGamestatePosition++;
        return [false, response];
      }
      else if(num <= inccorrectNums.length){
        console.log(inccorrectNums);
        errors++;
        return [true, GetTextForAnswer(num)];
      }else{
        //check if input number is correct text
        return CheckAnswerText(correctNum, inccorrectNums);
      }
    }
    else{ // check input text
      return CheckAnswerText(correctNum, inccorrectNums);
    }
  }
  //RETURN RANDOM ERROR END OF FUNTION
  return [true, getRandomAnswer(randomErrorResponses)] ;

  function GetTextForAnswer(responseNum : number) : string{
    return gameState[currentGamestatePosition][2][responseNum];
  }

  function CheckAnswerText(correctNum : number, inccorrectNums : Array<number>) : [boolean, string]{
    if(gameState[currentGamestatePosition][1][correctNum].toLowerCase() === inputLowerCase){
      let response = GetTextForAnswer(correctNum);
      currentGamestatePosition++;
      return [false, response];
    }
    else{
      for(let i = 0; i < inccorrectNums.length; i++){
        let currentIncorrectNumber = inccorrectNums[i];
        if(gameState[currentGamestatePosition][1][currentIncorrectNumber].toLowerCase() === inputLowerCase){
          errors++;
          return [true, GetTextForAnswer(currentIncorrectNumber)];
        }
      }
      return [true, getRandomAnswer(randomErrorResponses)] ;
    }
  }
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

async function showResponseOptions(responsestrings: string[]) {
  let response = "options: <BR> ";
  for(let i = 0; i < responsestrings.length; i ++){
    response += `[${i}] ${responsestrings[i]} &emsp;`;
  }
  // responsestrings.forEach(element =>
  //     response += element + "     "
  //   );
  await addResponse(response, false, false);
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

    returnString = `${twitter.outerHTML} &emsp; ${instagram.outerHTML } &emsp; ${twitch.outerHTML} &emsp; ${linkedIn.outerHTML}  &emsp; ${youtube.outerHTML}`; 
  } 
  if(input.startsWith("fact")){
    returnString = facts[currentFact];
    if(currentFact+1 < facts.length){
      currentFact++;
    }
    else{
      currentFact = 0;
      shuffleArray(facts);
    }
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
    returnString = "How about a list of commands: <br> [socials] &emsp; [fact] &emsp; [party]/[rainbow] &emsp; <br> <br> There are some more but I they seem to be hidden."  ; //TODO put in const array
  else if(input.startsWith("rainbow") || input.startsWith("party"))
  {
    returnString = StartOrStopRainbow();    
  }
  //TODO start, exit, iddqd, idkfa, idclip
  return returnString;
  
}

function StartOrStopRainbow() :  string {
  let responseElement = document.getElementById('responseText') as HTMLElement;
  let inputWrapperEl = document.getElementById('inputWrapper') as HTMLElement;
  let classNameToAdd = "rainbow";
  let classnameToRemove = "green";

  let returnString = "Party time!";
  if(responseElement?.classList.contains("rainbow"))
  {
    classNameToAdd = "green";
    classnameToRemove = "rainbow";
    returnString = "All right, enough partying around.";
  }
  // disableInput();
  // await sleep();
  responseElement?.classList.replace(classnameToRemove, classNameToAdd);
  inputWrapperEl?.classList.replace(classnameToRemove, classNameToAdd);

  return returnString;
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

  return new Promise(resolve => setTimeout(resolve, thinkTime));
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


function shuffleArray(array : Array<any>){
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}