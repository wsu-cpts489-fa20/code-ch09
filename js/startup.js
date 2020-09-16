//Start-up functions run when page is loaded.
//Define global vars and function bindings
//Set up UI state
var menuOpen = false; //Boolean variable to capture the state of the side menu.
var mode = "loginMode"; //Variable captures current UI mode

//Associative array maps modes to page titles
var modeToTitle = {"feedMode": "Activity Feed",
                   "roundsMode": "My Rounds",
                   "coursesMode": "Speedgolf Courses",
                   "loginMode": "Welcome to SpeedScore"};

//pageLocked captures whether we're on a page that may be exited only 
//by clicking on the left arrow menu button icon
var pageLocked = false; 

//Bind bottomBarBtnClick function to all elements of class bottomBarBtn
var bottomBtns = document.getElementsByClassName("bottomBarBtn");
for (var i = 0; i < bottomBtns.length; ++i) {
    bottomBtns[i].addEventListener("click",bottomBarBtnClick);
}

//Load the golf course database into 'courses' global array to be used in 
//autoCompleteCourse(). Normally, we would get these values from a database. 
//This is for demo purposes only.
let courses = ['Arrowhead Golf Course','Bandon Dunes Golf Course','Bing Maloney Golf Course',
    'Circling Raven Golf Club','Blackhorse Golf Club','Bryden Canyon Golf Course',
    'Desert Canyon Golf Course','Esmeralda Golf Course','Glenoaks Golf & Country Club',
    'Horton Smith Golf Course','Meriwether National Golf Club','Oneway Golf Club',
    'Palouse Ridge Golf Club','Rivercut Golf Course','Rome Country Club',
    'Sunriver Meadows Golf Course','The Golf Club of Houston','Turning Stone Shenendoah',
    'University of Idaho Golf Course','Windross Farm Golf Course'];

//Execute function to set start state of app
startUp();
