//----------------------------PART ONE - SUPABASE CONNECTIVITY---------------//

//requiring support for .env environments - any one option can be used(not used as require not working in browser- temp solution browserify)//
// option1://
// import dotenv from "dotenv";
// option2://
// const dotenv = require('dotenv');
// dotenv.config();

//Getting hidden URL and Key from .env file (not used as require not working in browser- temp solution browserify)//
// const supabase_URL = process.env.supabase_url
// const supabase_KEY = process.env.supabase_key

//connecting to supabase database as a client//
const supabase = require("@supabase/supabase-js")
// const supabaseClient = supabase.createClient(supabase_URL,supabase_KEY)
const supabaseClient = supabase.createClient("https://jbyqkjblmrkxjpsogjyv.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMTI3OTM5NywiZXhwIjoxOTQ2ODU1Mzk3fQ.H9Aiuubj_K3b_ndYv2EzVir6mImQOsNdGK08deJcSqw")

let usersList=[];   //Variable to hold users complete data fetched from Supabase// 
let newuserdata={}; //Variable to hold new data as input by new user for registration//
let id=0;    //Variable to hold id to be assigned to new user.//

let supabaseMemberIndex=""; //Variable to hold member's index number in supabase// 

//Arrow function to fetch all users data from database to local variable//
const fetchUsersList = async ()=>{
    await supabaseClient.from(`chusers01`).select(`*`)  //Fetched complete table from DB//
    .then( (table)=>{
                    usersList = table.data     //Converted to refined data and stored in Variable//
                    }
        )
}

//----------------------------PART TWO - WEB CONNECTIVITY---------------------//

//Connecting to submit button//
const register = document.getElementById('register')
register.addEventListener('click',()=>{userRegister();})

//Connecting to Clear form button//
const clearform = document.getElementById('clearform')
clearform.addEventListener('click',()=>{ window.location.reload();})

//User local data defined in a variable matching elements with Supabase Table- Just for test purpose only.//
// const usersList =[
//     {id:1, firstname:`mike`, lastname:`jakson`, email:'mikejakson@newmail.com', address:`101 new street kew vic`, password:`111`},
//     {id:2, firstname:`arnold`, lastname:`jack`, email:'arnoldj@newmail.com', address:`1 my street coburg vic`, password:`222`},
//     {id:3, firstname:`kate`, lastname:`chen`, email:'katec@newmail.com', address:`313 old street frankston vic`, password:`333`},
//     {id:4, firstname:`lil`, lastname:`zhou`, email:'lzhou@newmail.com', address:`19 this street melton vic`, password:`444`},
//     {id:5, firstname:`david`, lastname:`brian`, email:'davidbrian@newmail.com', address:`2/91 grand street geelong vic`, password:`555`},
//     {id:6, firstname:`bonnie`, lastname:`hudson`, email:'bhudson@newmail.com', address:`35 vistory street preston vic`, password:`666`},
//     {id:7, firstname:`tina`, lastname:`alan`, email:'tinaalan@newmail.com', address:`135 james street fairfield vic`, password:`777`}
// ]


//User data validation function//
const userValidate = (nud)=>{
    
    // console.log(`Validation started.....`)
    if(!nud[0].firstname) {window.alert(`Please enter your First name`); return false;}
    if(!nud[0].lastname) {window.alert(`Please enter your Last name`); return false;}
    if(!nud[0].email) {window.alert(`Please enter your Email`); return false;}
    if(!nud[0].email.includes(`@`)) {window.alert(`Please check your email`); return false;}
    if(!nud[0].address) {window.alert(`Please enter your Complete Address`); return false;}
    if(!nud[0].password) {window.alert(`Please enter your Password`); return false;}
    if(!nud[0].password1) {window.alert(`Please Confirm your Password`); return false;}
    if(nud[0].password !== nud[0].password1)  {window.alert(`Password mismatched, please re enter Password`); return false;}
    
    //checking if user already exists//
    for(i=0; i<usersList.length; i++){
        //console.log(`\nchecking ${usersList[i][`email`]} vs ${nud.email}`)
        if(usersList[i][`email`] === nud[0].email){
            window.alert(`User already exists`); return false;
        }
        id=i+2;  //adding 2 because JavaScript array elements start at [0] while Supabase starts at ID:1//
        console.log("i: ", i, "vs  id: ", id)
    }
    return id;
}



//User Registration function//
const userRegister = async ()=>{
    //Fetching complete usersList from Supabase DB//
    await fetchUsersList();
    //Getting fresh link to field values as enttered by user//
    let firstname = document.getElementById('firstname').value; 
    let lastname = document.getElementById('lastname').value
    let email = document.getElementById('email').value
    let address = document.getElementById('address').value
    let password = document.getElementById('password1').value
    let password1 = document.getElementById('password2').value

    //Storing new user input data to a Variable//
    newuserdata = [{firstname, lastname, email, address, password, password1}]

    // Validating New User Data....if returns true means new user data incomplete / user already exists.//
    // newuserdata = userValidate(newuserdata);
    if (!userValidate(newuserdata)) return;

console.log(`Validation Completed successfully`)
    newuserdata = [{ id, firstname, lastname, email, address, password }]
    //Defining Arrow function to insert row in supabase//
    const pushUserDataToSupabase = async ()=>{
        await supabaseClient.from(`chusers01`).insert( newuserdata); 
        console.log(newuserdata);
        }
    
    //Calling/activating Arrow function to action row insert(new user data) in Supabase//
    pushUserDataToSupabase();


    //Displaying confirmation message upon new user registration//
    window.alert(`Registration Successful.\nYou can login to access your Dashboard.`)

    //Redirect to user login page.//
    window.location.replace('login.html')
    
    //You may direct it to other website if required//
    //window.location.replace(`http://www.google.com`)
    
}
