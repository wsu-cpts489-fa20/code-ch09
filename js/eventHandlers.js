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

//saveRoundData -- Callback function called from logRoundForm's submit handler.
//Stops the spinner and then saves the entered round data to local storage.
function saveRoundData() {
  document.getElementById("logRoundIcon").classList.remove("fas","fa-spinner", "fa-spin");
  document.getElementById("logRoundIcon").classList.add("fas","fa-save");

  //Retrieve from localStorage this user's rounds and roundCount
  let thisUser = localStorage.getItem("userId");
  let data = JSON.parse(localStorage.getItem(thisUser));
  //increment roundCount since we're adding a new round
  data.roundCount++;
  //Initialize empty JavaScript object to store this new round
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
  //Add this round to associative array of rounds
  data.rounds[data.roundCount] = thisRound;
  //Commit updated user data to app data in local storage
  localStorage.setItem(thisUser,JSON.stringify(data));
  //Debug: Show alert box with current state of speedgolfUserData for debugging purposes
  data = localStorage.getItem(thisUser);
  alert("Data for " + thisUser + ": " +  data);
  //Go back to "My Rounds" page by programmatically clicking the menu button
  document.getElementById("menuBtn").click();
  //Clear form to ready for next use
  clearRoundForm();
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
    //Change page title:
    document.getElementById("topBarTitle").textContent = "Log New Round";  
    //Set pageLocked to true, thus indicating that we're on a page that may only
    //be exited by clicking on the left arrow at top left
    pageLocked = true;
    //When pageLocked is true, the menu  icon is the left arrow
    document.getElementById("menuBtnIcon").classList.remove("fa-times");
    document.getElementById("menuBtnIcon").classList.add("fa-arrow-left");
    //When pageLocked is true, the bottom bar buttons are disabled
    document.getElementById("bottomBar").classList.add("disabledButton");
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
  