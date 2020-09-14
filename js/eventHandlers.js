//document click: If the user clicks anywhere in the document while the side
//menu is open, we need to close the menu, toggle the menu state, and
//re-enable all buttons/input fields on the page.
document.addEventListener("click",function(e) {
    if (document.getElementById("sideMenu").style.width == "250px") {
        //Menu is open
        if (!pageLocked) { //Change hamburger back to 'X'
          document.getElementById("menuBtnIcon").classList.remove("fa-times"); 
          document.getElementById("menuBtnIcon").classList.add("fa-bars");
        }
        document.getElementById("sideMenu").style.width = "0px"; //close menu
    }
});
  
//menuBtn click: When the top-left side menu button is clicked and the menu
//is closed, we need to open it
document.getElementById("menuBtn").addEventListener("click",function(e) {
    if (pageLocked) { //user is clicking left arrow to exit locked page
        pageLocked = false;
        //restore hamburger icon
        document.getElementById("menuBtnIcon").classList.remove("fa-arrow-left"); 
        document.getElementById("menuBtnIcon").classList.add("fa-bars"); 
        //Hide current page
        let currModePages = document.getElementsByClassName(mode + "Div");
        for (var i = 0; i < currModePages.length; ++i) {
          currModePages[i].style.display = "none"; //hide
        }
        //Show main mode page
        document.getElementById(mode + "Div").style.display = "block";
        //Restore main mode page title
        document.getElementById("topBarTitle").textContent = modeToTitle[mode];
        //Re-enable bottom bar buttons
        document.getElementById("bottomBar").classList.remove("disabledButton");
        e.stopPropagation();
        return;
    }    
    let menuWidth = document.getElementById("sideMenu").style.width;
    if (menuWidth != "250px") { //menu is closed -- open it!
        //Change hamburger to X to open menu
        document.getElementById("menuBtnIcon").classList.remove("fa-bars"); 
        document.getElementById("menuBtnIcon").classList.add("fa-times");
        document.getElementById("sideMenu").style.width = "250px"; //open up menu
        e.stopPropagation();
    } 
}); 

//bottomBarBtnClick -- When a button in the bottom bar is clicked, we toggle the mode.
var bottomBarBtnClick = function() {
    var prevMode = mode;
    //Switch mode button that is highlighted
    document.getElementById(mode).classList.remove("menuItemSelected");
    mode = this.id;
    this.classList.add("menuItemSelected");
    //Change page title
    document.getElementById("topBarTitle").textContent = modeToTitle[mode];
    //Swap out page content
    document.getElementById(prevMode + "Div").style.display = "none";
    document.getElementById(mode + "Div").style.display = "block";
    //Change menu items
    var oldItems = document.getElementsByClassName(prevMode + "Item");
    var newItems = document.getElementsByClassName(mode + "Item");
    for (var i = 0; i < oldItems.length; ++i) {
    oldItems[i].style.display = "none";
    }
    for (var i = 0; i < newItems.length; ++i) {
    newItems[i].style.display = "block";
    }
}

//loginInterface submit: When the login button is clicked, we rely on form
//pattern matching to ensure validity of username and password. To log in, we
//switch the mode to "feedMode" and make the necessary UI and state changes.
document.getElementById("loginInterface").onsubmit = function(e) {
    //Start spinner:
    //Start spinner:
    document.getElementById("loginBtnIcon").classList.
    add("fas","fa-spinner","fa-spin");
    setTimeout(login,500);
    e.preventDefault(); //Prevents form refresh -- the default behavior
};

//login -- This function sets the initial app state after login. It is called
//from setTimeout after the button spinner has commenced.
function login() {
    //Stop spinner
    document.getElementById("loginBtnIcon").
    classList.remove("fas","fa-spinner","fa-spin");
    //Restore login icon
    document.getElementById("loginBtnIcon").
    classList.add("fas","fa-sign-in-alt");
    //Enable menu button:
    document.getElementById("menuBtn").disabled = false;

    //Show bottom bar buttons and highlight feed mode button
    document.getElementById("bottomBar").style.display = "block";
    document.getElementById("feedMode").classList.add("menuItemSelected");
    document.getElementById("roundsMode").classList.remove("menuItemSelected");
    document.getElementById("coursesMode").classList.remove("menuItemSelected");

    //Change title bar to Activity Feed
    document.getElementById("topBarTitle").textContent = "Activity Feed";
    //Show only feed mode items
    items = document.getElementsByClassName("feedModeItem");
    for (var i = 0; i < items.length; ++i) {
        items[i].style.display = "block";
    }
    //Hide other mode menu items
    items = document.getElementsByClassName("roundsModeItem");
    for (var i = 0; i < items.length; ++i) {
        items[i].style.display = "none";
    }
    items = document.getElementsByClassName("coursesModeItem");
    for (var i = 0; i < items.length; ++i) {
        items[i].style.display = "none";
    }
    //Hide login screen and show feed screen
    document.getElementById("loginModeDiv").style.display = "none";
    document.getElementById("feedModeDiv").style.display = "block";
    //Set mode to feedMode
    mode = "feedMode";
    //Write login name of user who just logged in to localStorage
    let thisUser = document.getElementById("emailInput").value;
    localStorage.setItem("userId",thisUser);
    //Check whether we have saved data on this SpeedScore user:
    let data = localStorage.getItem(thisUser);
    if (data == null) { 
      //No data for this user yet -- create a blank data store for this user
      localStorage.setItem(thisUser, JSON.stringify({"rounds" : {}, "roundCount": 0}));  
    } else { //There is data for this user; add it to the "My Rounds" table
      data = JSON.parse(data);
      for (const thisRound in data.rounds) {
        addRoundToTable(data.rounds[thisRound].roundNum);
      } 
    }
  };

//logRoundForm SUBMIT: When the user clicks the "Save" button to save a newly
//entered speedgolf round, we need to save it to local storage
document.getElementById("logRoundForm").onsubmit = function(e) {
  e.preventDefault(); //We do NOT want the button to trigger a page reload!
  document.getElementById("logRoundIcon").classList.add("fas", "fa-spinner", "fa-spin");
  //Set spinner to spin for one second, after which saveRoundData will be called
  setTimeout(saveRoundData,500);
}

//addToOrUpdateRoundTable -- Helper function that adds a new round with unique index
//roundIndex to the "My Rounds" table. The round is a "condensed view" that
//shows only the date, course and score for the round, together with buttons to
//view/edit the detailed round data and delete the round data.
function addToOrUpdateRoundTable(add, roundIndex) {
  let user = localStorage.getItem("userId");
  let data = JSON.parse(localStorage.getItem(user));
  let roundData = data.rounds[roundIndex]; //the round data to add/edit
  let roundsTable = document.getElementById("myRoundsTable");
  let roundRow;
  if (add) { //add new row
    //Test whether table is empty
    if (roundsTable.rows[1].innerHTML.includes ("colspan")) {
      //empty table! Need to remove this row before adding new one
      roundsTable.deleteRow(1);
     }
     roundRow = roundsTable.insertRow(1); //insert new row
     roundRow.id = "r-" + roundIndex; //set id of this row so we can edit/delete later
  } else { //update existing row
    roundRow = document.getElementById("r-" + roundIndex);
  }
  //Add/update row with five cols to table
  roundRow.innerHTML = "<td>" + roundData.date + "</td><td>" +
   roundData.course + "</td><td>" + roundData.SGS + 
   " (" + roundData.strokes +
   " in " + roundData.minutes + ":" + roundData.seconds + 
   ")</td>" +
   "<td><button onclick='editRound(" + roundIndex + ")'><span class='fas fa-eye'>" +
   "</span>&nbsp;<span class='fas fa-edit'></span></button></td>" +
   "<td><button onclick='confirmDelete(" + roundIndex + ")'>" +
   "<span class='fas fa-trash'></span></button></td>";
}

//saveRoundData -- Callback function called from logRoundForm's submit handler.
//Stops the spinner and then saves the entered round data to local storage.
function saveRoundData() {
  //Stop spinner
  document.getElementById("logRoundIcon").classList.remove("fas","fa-spinner", "fa-spin");
  document.getElementById("logRoundIcon").classList.add("fas","fa-save");
  //Retrieve from localStorage this user's rounds and roundCount
  let thisUser = localStorage.getItem("userId");
  let data = JSON.parse(localStorage.getItem(thisUser));
  //Initialize empty JavaScript object to store new or updated round
  let thisRound = {}; //iniitalize empty object for this round
  let temp; //temporary value for storying DOM elements as needed
  //Store the data
  thisRound.roundNum = data.roundCount;
  thisRound.date = document.getElementById("roundDate").value; //round date
  thisRound.course = document.getElementById("roundCourse").value;
  temp = document.getElementById("roundType");
  thisRound.type = temp.options[temp.selectedIndex].value;
  temp = document.getElementById("roundHoles");
  thisRound.numHoles = temp.options[temp.selectedIndex].value;
  thisRound.strokes = document.getElementById("roundStrokes").value;
  thisRound.minutes = document.getElementById("roundMinutes").value;
  thisRound.seconds = document.getElementById("roundSeconds").value;
  thisRound.SGS = document.getElementById("roundSGS").value;
  thisRound.notes = document.getElementById("roundNotes").value;
  //Determine whether we're saving new or editing existing round, saving accordingly
  let submitBtnLabel = document.getElementById("submitBtnLabel").textContent;
  let addNew;
  if (submitBtnLabel == "Log Round") {
    //Adding new round
    addNew = true;
    //Add 1 to roundCount, setting thisRound's roundNum to that value
    thisRound.roundNum = ++(data.roundCount);
    data.rounds[thisRound.roundNum] = thisRound; //add to local storage 
  } else {
    //Editing existing round
    addNew = false;
    //Grab index of round being edited from localStorage. It was set in editRound()
    thisRound.roundNum = Number(localStorage.getItem("roundIndex")); 
  }
  //Add/update this round in associative array of rounds
  data.rounds[thisRound.roundNum] = thisRound;
  //Commit rounsd object with added/updated round to local storage
  localStorage.setItem(thisUser,JSON.stringify(data));
  //Go back to "My Rounds" page by programmatically clicking the menu button
  document.getElementById("menuBtn").click();
  //Clear form to ready for next use
  clearRoundForm();
  //Add to or update "My Rounds" table
  addToOrUpdateRoundTable(addNew, thisRound.roundNum);
}

//addRoundToTable -- Helper function that adds a new round with unique index
//roundIndex to the "My Rounds" table. The round is a summary view that
//shows only the date, course and score for the round, together with buttons to
//view/edit the detailed round data and delete the round data.
function addRoundToTable(roundIndex) {
  let user = localStorage.getItem("userId");
  let data = JSON.parse(localStorage.getItem(user));
  let rounds = data.rounds;
 //Test whether table is empty
 let roundsTable = document.getElementById("myRoundsTable");
 if (roundsTable.rows[1].innerHTML.includes ("colspan")) {
   //empty table! Need to remove this row before adding new one
   roundsTable.deleteRow(1);
 }
//Write new row with five cols to table
 let thisRound = roundsTable.insertRow(1);
 thisRound.id = "r-" + roundIndex; //set unique id of this row so we can edit/delete later
 thisRound.innerHTML = "<td>" + rounds[roundIndex].date + "</td><td>" +
   rounds[roundIndex].course + "</td><td>" + rounds[roundIndex].SGS + 
   " (" + rounds[roundIndex].strokes +
   " in " + rounds[roundIndex].minutes + ":" + rounds[roundIndex].seconds + 
   ")</td>" +
   "<td><button onclick='editRound(" + roundIndex + ")'><span class='fas fa-eye'>" +
   "</span>&nbsp;<span class='fas fa-edit'></span></button></td>" +
   "<td><button onclick='confirmDelete(" + roundIndex + ")'>" +
   "<span class='fas fa-trash'></span></button></td>";
}
 
//startUp -- This function sets up the initial state of the app: Login page is
//visible, bottom bar is invisible, all menu items invisible except feed items,
//menu button disabled, UI mode = login
function startUp() {
  //Hide all pages except for Login Page, which is the start page.
  document.getElementById("feedModeDiv").style.display = "none";
  document.getElementById("followedUsersDiv").style.display = "none";
  document.getElementById("roundsModeDiv").style.display = "none";
  document.getElementById("logRoundDiv").style.display = "none";
  document.getElementById("coursesModeDiv").style.display = "none";
  document.getElementById("searchCourseDiv").style.display = "none";
  document.getElementById("loginModeDiv").style.display = "block";
  //Clear all text from email and password fields
  document.getElementById("emailInput").value = "";
  document.getElementById("passwordInput").value = "";
  //Set top bar text
  document.getElementById("topBarTitle").textContent = "Welcome to SpeedScore";
  //Hide the bottom bar initially
  document.getElementById("bottomBar").style.display = "none";
  //Hide all menu items except for Activity Feed items:
  var feedItems = document.getElementsByClassName("feedModeItem");
  var roundItems = document.getElementsByClassName("roundsModeItem");
  var courseItems = document.getElementsByClassName("coursesModeItem");
  for (var i = 0; i < feedItems.length; ++i) {
      feedItems[i].style.display = "block";
    }
  for (var i = 0; i < roundItems.length; ++i) {
    roundItems[i].style.display = "none";
  }
  for (var i = 0; i < courseItems.length; ++i) {
      courseItems[i].style.display = "none";
  }
  //Disable menu button:
  document.getElementById("menuBtn").disabled = true;
  mode = "loginMode";
  //set the input focus to the email field of login screen
  document.getElementById("emailInput").focus();

  //Set default date to today in Log Round Page
  document.getElementById("roundDate").valueAsNumber = 
    Date.now()-(new Date()).getTimezoneOffset()*60000;

}; //Startup

//clearRoundForm -- Helper function that clears out data previously entered into
//the "Log New Round" form and resets all fields to their default values
function clearRoundForm() {
  document.getElementById("roundDate").valueAsNumber = 
  Date.now()-(new Date()).getTimezoneOffset()*60000;
  document.getElementById("roundCourse").value = "";
  document.getElementById("roundType").value = "practice";
  document.getElementById("roundHoles").value = "18";
  document.getElementById("roundStrokes").value = "80";
  document.getElementById("roundMinutes").value = "50";
  document.getElementById("roundSeconds").value = "00";
  document.getElementById("roundSGS").value = "130:00";
  document.getElementById("roundNotes").value = "";
}

//fillRoundForm -- When the user chooses to view/edit an existing round, we need
//to fill the round form with the corresponding round data and provide the
//option to update the data
function fillRoundForm(round) {
  document.getElementById("roundDate").value = round.date;
  document.getElementById("roundCourse").value = round.course;
  document.getElementById("roundType").value = round.type;
  document.getElementById("roundHoles").value = round.numHoles;
  document.getElementById("roundStrokes").value = round.strokes;
  document.getElementById("roundMinutes").value = round.minutes;
  document.getElementById("roundSeconds").value = round.seconds;
  document.getElementById("roundSGS").value = round.SGS;
  document.getElementById("roundNotes").value = round.notes;
}

//transitionToLockedPage: Take the user to a locked page that is subsidiary to
//the main mode page. The new page is identified by lockedPageId and should have
//the title lockedPageTitle. Note: Any other tweaks to the locked page (e.g., 
//changing of button labels or hiding/showing of input fields and controls) must
//be done manually before or after calling this function.
function transitionToLockedPage(lockedPageId, lockedPageTitle) {
  //Swap pages
  document.getElementById(mode + "Div").style.display = "none";
  document.getElementById(lockedPageId).style.display = "block";
  //Change page title
  document.getElementById("topBarTitle").textContent = lockedPageTitle;
  //Set pageLocked to true, thus indicating that we're on a page that may only
  //be exited by clicking on the left arrow at top left
  pageLocked = true;
  //When pageLocked is true, the menu  icon is the left arrow
  document.getElementById("menuBtnIcon").classList.remove("fa-times");
  document.getElementById("menuBtnIcon").classList.remove("fa-bars");
  document.getElementById("menuBtnIcon").classList.add("fa-arrow-left");
  //When pageLocked is true, the bottom bar buttons are disabled
  document.getElementById("bottomBar").classList.add("disabledButton");
}


//LOG OUT ITEM CLICK -- When the user clicks the "Log Out" button
//log them out of the app and redisplay the log in screen
document.getElementById("logoutItem").onclick = function() {
  startUp();
};

//logRoundItem click: Take the user to the log round page
document.getElementById("logRoundItem").onclick = function(e) {
    //Swap pages:
    document.getElementById("roundsModeDiv").style.display = "none";
    document.getElementById("logRoundDiv").style.display = "block";
    //Change page title, submit button title and icon
    document.getElementById("topBarTitle").textContent = "Log New Round"; 
    document.getElementById("logRoundIcon").classList.remove("fa-edit");
    document.getElementById("logRoundIcon").classList.add("fa-save");
    document.getElementById("submitBtnLabel").textContent = "Log Round";
    //Set pageLocked to true, thus indicating that we're on a page that may only
    //be exited by clicking on the left arrow at top left
    pageLocked = true;
    //When pageLocked is true, the menu  icon is the left arrow
    document.getElementById("menuBtnIcon").classList.remove("fa-times");
    document.getElementById("menuBtnIcon").classList.add("fa-arrow-left");
    //When pageLocked is true, the bottom bar buttons are disabled
    document.getElementById("bottomBar").classList.add("disabledButton");
  }

//editRound: Event handler called when "View/Edit" button clicked in "My Rounds"
//table. roundIndex indicates the index of the round that was clicked. Grab
//the round data from local storage, fill it into the edit form and transition
//to the view/edit round page.
function editRound(roundIndex) {
  //Grab appropriate round to view/edit from localStorage
  let user = localStorage.getItem("userId");
  let data = JSON.parse(localStorage.getItem(user));
    
  //Pre-populate form with round data
  fillRoundForm(data.rounds[roundIndex]);

  //Set local storage var to index of round being edited. This will allow us to
  //save updated data to correct round when the user clicks "Update Round Data"
  localStorage.setItem("roundIndex",roundIndex);

  //Transition to round view/edit page with "Update" label for form submit button
  document.getElementById("logRoundIcon").classList.remove("fa-save");
  document.getElementById("logRoundIcon").classList.add("fa-edit");
  document.getElementById("submitBtnLabel").textContent = "Update Round";
  transitionToLockedPage("logRoundDiv","View/Edit Round");
}

  
//ABOUT ITEM click: When the user clicks on "About", 
//launch the modal About dialog box.
document.getElementById("aboutItem").onclick = function() {
    document.getElementById("aboutModal").style.display = "block";
};

//closeModal -- Close the About dialog box
function closeModal() {
    document.getElementById("aboutModal").style.display = "none";
}
//Bind closeModal to click event of About box "X" and "OK" buttons
document.getElementById("modalClose").onclick = closeModal;
document.getElementById("aboutOK").onclick = closeModal;

//updateSGS --When the strokes, minutes or seconds fields are updated, we need
//to update the speedgolf score accordingly.
function updateSGS() {
    var strokes = document.getElementById("roundStrokes").valueAsNumber;
    var minutes = document.getElementById("roundMinutes").valueAsNumber;
    var seconds = document.getElementById("roundSeconds").value;
    document.getElementById("roundSGS").value = (strokes + minutes) + ":" + seconds;
  }

//changeSeconds - When the seconds field is updated, we need to ensure that the
//seconds field of the round time is zero-padded. We also need to call updateSGS to
//update the speedgolf score based on the new seconds value.
function changeSeconds() {
    var seconds = document.getElementById("roundSeconds").value;
    if (seconds.length < 2) {
      document.getElementById("roundSeconds").value = "0" + seconds;
    }
    updateSGS();
  }
  