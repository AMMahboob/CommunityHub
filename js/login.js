//----------------------------PART ONE - SUPABASE CONNECTIVITY---------------//
//User local data defined in a variable matching elements with Supabase Table- Just for test purpose only.//
// const usersList = [ {id:1, firstname:`mike`, lastname:`jakson`, email:'mikejakson@newmail.com', address:`101 new street kew vic`, password:`111`}, ] 

//requiring support for .env environments - any one option can be used(not used as require not working in browser- temp solution browserify)//
// option1://
// import dotenv from "dotenv";
// // // option2://
// // const dotenv = require('dotenv');

// dotenv.config();

//Getting hidden URL and Key from .env file (not used as require not working in browser- temp solution browserify)//
// const supabase_URL = process.env.supabase_url
// const supabase_KEY = process.env.supabase_key

//connecting to supabase database as a client//
const supabase = require("@supabase/supabase-js")
// const supabaseClient = supabase.createClient(supabase_URL,supabase_KEY)
const supabaseClient = supabase.createClient("https://jbyqkjblmrkxjpsogjyv.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMTI3OTM5NywiZXhwIjoxOTQ2ODU1Mzk3fQ.H9Aiuubj_K3b_ndYv2EzVir6mImQOsNdGK08deJcSqw")

let usersList=[];   //Variable to hold users complete data fetched from Supabase// 
// let upProfile={}; //Variable to hold member's updated data// NO NEED GLOBAL//////
let MemberIndex=""; //Variable to hold member's index number in supabase// 

//Arrow function to fetch all users data from database to local variable//
const fetchUsersList = async ()=>{
    await supabaseClient.from(`chusers01`).select(`*`)  //Fetched complete table from DB//
    .then( (table)=>{
                    usersList = table.data     //Converted to refined data and stored in Variable//
                    }
        )
}

//----------------------------PART TWO - WEB CONNECTIVITY---------------------//

//Connecting to login button and adding listener function//
const loginbtn = document.getElementById("loginButton")
    loginbtn.addEventListener("click",()=>{userLogin();})

//Variables to hold link to member profile action buttons and adding listener functions. 
const editProfileBtn = document.getElementById("editProfileBtn"); 
    editProfileBtn.addEventListener("click",()=>{editProfile();});
const saveChangesBtn = document.getElementById("saveChangesBtn"); 
    saveChangesBtn.addEventListener("click",()=>{saveProfile();}); 

const changePasswordBtn = document.getElementById("changePasswordBtn"); 
    changePasswordBtn.addEventListener("click",()=>{changePasswordMenu();}); 
const savePasswordBtn = document.getElementById("savePasswordBtn"); 
    savePasswordBtn.addEventListener("click",()=>{validatePassword();});

const mCancelBtn = document.getElementById("mCancelBtn"); 
    mCancelBtn.addEventListener("click",()=>{userDashboardActivator(usersList[MemberIndex])});
    
const deleteAccountBtn = document.getElementById("deleteAccountBtn"); 
    deleteAccountBtn.addEventListener("click",()=>{deleteAccount();}); 
 

//----->MEMBER DELETE ACCOUNT FUNCTION START----->// 
const deleteAccount = async ()=>{ 
    if(window.confirm("PROCEED DELETING YOUR ACCOUNT PERMANENTLY?") ){ 
        await supabaseClient.from('chusers01')
        .delete()
        .match({ id: usersList[MemberIndex].id }) 
        //Announcing successful deletion of member Account from Supabase server. 
        window.alert("Account Deleted Permanently.Your data safely discarded\nAll in compliance with Secutity Policy of TCH, \nThanks!"); 
        window.location.replace("homepage.html"); 
    }
} 
//<-----MEMBER DELETE ACCOUNT FUNCTION END<-----|//

//----->MEMBER PASSWORD VALIDATE and SAVE to Supabase FUNCTIONs START----->// 
const savePassword = async(upProfile)=>{ 
    // await supabaseClient.from(`chusers01`).insert([{id: upProfile[0].id, firstname: upProfile[0].firstname, lastname: upProfile[0].lastname, email: upProfile[0].email, address: upProfile[0].address, password: upProfile[0].password }], {upsert : true} )//<--Same as next line-->//
    await supabaseClient.from('chusers01').insert(upProfile, {upsert : true} )

    window.alert("Your Password Change Successful. Re-Login with new password. Thanks!");
    window.location.reload();   //Return to login screen so that user check and remember new password.
} 

const validatePassword = ()=>{
    const mPassword = document.getElementById('mPassword').value;
    const mNewPassword1 = document.getElementById('mNewPassword1').value;
    const mNewPassword2 = document.getElementById('mNewPassword2').value;

    if(!mPassword){ window.alert("Current Password Required."); return; }
    if(mPassword != usersList[MemberIndex].password){ window.alert("Incorrect current password."); return; }
    else if(!mNewPassword1){ window.alert("New Password Required."); return; }
    else if(!mNewPassword2){ window.alert("Confirm New Password."); return; }
    else if(mNewPassword1 != mNewPassword2){ window.alert("Mismatch, ReConfirm New Password."); return; }
    else{
        let upProfile = [{
            id: Number(usersList[MemberIndex].id),
            firstname: usersList[MemberIndex].firstname,
            lastname: usersList[MemberIndex].lastname,
            email: usersList[MemberIndex].email,
            address: usersList[MemberIndex].address,
            password: document.getElementById('mNewPassword1').value
        }]
        savePassword(upProfile);
    }
}
//----->MEMBER SAVE PASSWORD FUNCTION END----->// 

//----->MEMBER CHANGE PASSWORD FUNCTION START----->// 
const changePasswordMenu= ()=>{ 
    
    //changing buttons visibility. 
    savePasswordBtn.hidden=false; mCancelBtn.hidden=false; changePasswordBtn.hidden=true; editProfileBtn.hidden=true; saveChangesBtn.hidden=true; deleteAccountBtn.hidden=true;

    //Disabling edit fields and enabling password change fields. 
    const el = document.querySelectorAll("input.mDataField"); 
        for (i = 0; i < el.length; i++){ el[i].disabled = true; } 
    
    const elPass = document.querySelectorAll("input.mPassDataField"); 
        for (i = 0; i < elPass.length; i++) { 
            elPass[i].value='';
            elPass[i].disabled = false; } 

    document.getElementById("memProfileManager").hidden=true;
    document.getElementById("memPasswordManager").hidden=false;
} 
//----->MEMBER CHANGE PASSWORD FUNCTION END----->// 

//----->MEMBER PROFILE SUPABASE UPDATE FUNCTION START----->// 
const updateSupabase = async (upProfile)=>{
    // await supabaseClient.from(`chusers01`).insert([{id: upProfile[0].id, firstname: upProfile[0].firstname, lastname: upProfile[0].lastname, email: upProfile[0].email, address: upProfile[0].address, password: upProfile[0].password }], {upsert : true} )//<--Same as next line-->//
    await supabaseClient.from('chusers01').insert([upProfile], {upsert : true} ); 
    
    // console.log("upProfile.id", upProfile.id,"upProfile.firstname: ", upProfile.firstname) 
}
//<-----MEMBER PROFILE SUPABASE UPDATE FUNCTION END<-----// 

//----->MEMBER PROFILE DATA SAVE FUNCTION START----->//
const saveProfile = ()=>{
    let upProfile = {
        id : document.getElementById("mId").value, 
        firstname : document.getElementById("mFirstName").value, 
        lastname : document.getElementById("mLastName").value, 
        email : document.getElementById("mEmail").value, 
        address : document.getElementById("mAddress").value, 
        password : document.getElementById("mPassword").value,
        }; 
    //Updated Data validation checks. 
    if(!upProfile.firstname) {window.alert(`Please enter your First name`); return;} 
    else if(!upProfile.lastname) {window.alert(`Please enter your Last name`); return;} 
    else if(!upProfile.email) {window.alert(`Please enter your Email`); return;} 
    else if(!upProfile.email.includes(`@`)) {window.alert(`Please check your email`); return;} 
    else if(upProfile.email.length<7) {window.alert(`Please check your email`);  return;} 
    else if(!upProfile.address) {window.alert(`Please enter your Complete Address`); return;} 
    // else if(!upProfile.password) {window.alert(`Password Incorrect`); return;} 
    // else if(upProfile.password != usersList[MemberIndex].password) {window.alert(`Password Incorrect`); return;} 
    // looking for member email in database and update. 
    else{//console.log("SaveProfile Function ELSE Started")
            for(i=0; i<usersList.length; i++){ 
            // console.log(`\nchecking ${usersList[i][`id`]} vs ${upProfile.id}`)
            if(usersList[i]['id'] == upProfile.id){ 
                // keeping a copy of authenticated updated user complete profile. 
                usersList[i].firstname = String.valueOf(upProfile.firstname); 
                usersList[i].lastname = String.valueOf(upProfile.lastname); 
                usersList[i].email = String.valueOf(upProfile.email); 
                usersList[i].address = String.valueOf(upProfile.address); 
                
                MemberIndex = Number(i); //keeping updated copy of member's record index in database. 
                
                updateSupabase(upProfile); //Updating values to supabase. 
                fetchUsersList(); //after changes, refreshing the updated users profiles from supabase to local variable.
                break;
            } 
        } 
        //Changing buttons visibility and disabling edit to all input fields. 
        saveChangesBtn.hidden=true; editProfileBtn.hidden=false; 
        const el = document.querySelectorAll("input.mDataField"); 
            for (i = 0; i < el.length; i++){ el[i].disabled = true; } 
        window.alert(`Your Requested Changes Saved.\n\nThanks for letting us know!`); 
    }
} 
//----->MEMBER PROFILE DATA SAVE FUNCTION END----->// 

//----->MEMBER PROFILE EDIT FUNCTION START----->// 
const editProfile = ()=>{
    editProfileBtn.hidden=true; saveChangesBtn.hidden=false; 
    const el = document.querySelectorAll("input.mDataField"); 
    for (i = 0; i < el.length; i++) { 
        el[i].disabled = false; 
    }
};
//<-----MEMBER PROFILE EDIT FUNCTION END<-----// 

//<-----USER DASHBOARD ACTIVATION FUNCTION START<-----|//
const userDashboardActivator = (uld)=>{ //function taking userLoginData as an object - complete profile in argument.
    //loading member data from userLoginData variable to form fields.
    document.getElementById("mId").value = uld.id; 
    document.getElementById("mPassId").value = uld.id; 
    document.getElementById("mFirstName").value = uld.firstname; 
    document.getElementById("mLastName").value = uld.lastname; 
    document.getElementById("mEmail").value = uld.email; 
    document.getElementById("mAddress").value = uld.address; 
    document.getElementById("mPassword").value = uld.password; 

    //Making related fields visible and irrelevant fieds hidden. 
    document.getElementById('forLoginOnly').hidden=true; //setting all login form-fields hidden. 
    document.getElementById('logIn').hidden=true; 
    document.getElementById('logOut').hidden=false; 
    document.getElementById('joinTheCommunityHub').hidden=true;

    document.getElementById("accountManagerTitle").hidden=false; //setting member account management-Title visible.  
    document.getElementById("memProfileManager").hidden=false; //setting member profile management-fields visible.  
    document.getElementById("memPasswordManager").hidden=true; //hiding password management-fields. 

    //changing buttons visibility.
    saveChangesBtn.hidden=true;
    savePasswordBtn.hidden=true; 
    mCancelBtn.hidden=true; 
    editProfileBtn.hidden=false; 
    changePasswordBtn.hidden=false; 
    deleteAccountBtn.hidden=false; 
}
//<-----USER DASHBOARD ACTIVATION FUNCTION END<-----|//

//----->USER LOGIN AUTHENTICATION FUNCTION START----->//
const userAuthenticator = async (uld)=>{ //function taking userLoginData object in argument.
    // console.log(`Validation started.....`)
    if(!uld.email) {window.alert(`Please enter your Email`); uld={}; return;} 
    else if(!uld.email.includes(`@`)) {window.alert(`Please check your email`);  uld={}; return;} 
    else if(uld.email.length<7) {window.alert(`Complete your email address required.`);  uld={}; return;} 
    else if(!uld.password) {window.alert(`Please enter your Password`);  uld={}; return;} 
    // checking if email and password both match any record in database.
    else{
        for(i=0; i<usersList.length; i++){ 
            //console.log(`\nchecking ${usersList[i][`email`]} vs ${uld.email}`)
            if(usersList[i][`email`] == uld.email){ 
                //console.log(`\nchecking ${usersList[i].password} vs ${uld.password}`)
                if(usersList[i]["password"] == uld.password){ 
                    //A temporary local copy of user profile for check.
                    uld={}; uld= usersList[i];
                    MemberIndex=Number(i);  //keeping a copy of  member's index number in supabase-usersList. 
                    userDashboardActivator(uld);   //Calling function to activate member dashboard area. 
                    window.alert("Wellcome to Member Dashboard.");
                    return; 
                }
            } 
        }
        if (uld={}){ 
            window.alert("Incorrect Email / Password"); 
            return;} 
    } 
} 
//<-----USER LOGIN AUTHENTICATION FUNCTION END<-----|//

//----->USER LOGIN FUNCTION START----->//
const userLogin = async ()=>{
    // Fetching complete usersList from Supabase DB.
    await fetchUsersList();

    //Variables to hold links to user login data fields to authenticate. 
    let userLoginData ={id:"", email: document.getElementById('email').value, password : document.getElementById('password').value}; 

    userAuthenticator(userLoginData); // Validating New User Data....if returns true means user authenticated successfully.//

    //You may redirect it to member's dashboard webpage or any other website as desired//
    //window.location.replace('memberdashboard.html')
    //window.location.replace(`http://www.google.com`)
}
//<-----USER LOGIN FUNCTION END-----|//