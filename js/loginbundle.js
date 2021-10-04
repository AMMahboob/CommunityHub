(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"@supabase/supabase-js":40}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./lib/fetch");
const constants_1 = require("./lib/constants");
const cookies_1 = require("./lib/cookies");
const helpers_1 = require("./lib/helpers");
class GoTrueApi {
    constructor({ url = '', headers = {}, cookieOptions, }) {
        this.url = url;
        this.headers = headers;
        this.cookieOptions = Object.assign(Object.assign({}, constants_1.COOKIE_OPTIONS), cookieOptions);
    }
    /**
     * Creates a new user using their email address.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param data Optional user metadata.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    signUpWithEmail(email, password, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString = '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/signup${queryString}`, { email, password, data: options.data }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Logs in an existing user using their email address.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    signInWithEmail(email, password, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '?grant_type=password';
                if (options.redirectTo) {
                    queryString += '&redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/token${queryString}`, { email, password }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Signs up a new user using their phone number and a password.
     * @param phone The phone number of the user.
     * @param password The password of the user.
     * @param data Optional user metadata.
     */
    signUpWithPhone(phone, password, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                const data = yield fetch_1.post(`${this.url}/signup`, { phone, password, data: options.data }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Logs in an existing user using their phone number and password.
     * @param phone The phone number of the user.
     * @param password The password of the user.
     */
    signInWithPhone(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '?grant_type=password';
                const data = yield fetch_1.post(`${this.url}/token${queryString}`, { phone, password }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends a magic login link to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    sendMagicLinkEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/magiclink${queryString}`, { email }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends a mobile OTP via SMS. Will register the account if it doesn't already exist
     * @param phone The user's phone number WITH international prefix
     */
    sendMobileOTP(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                const data = yield fetch_1.post(`${this.url}/otp`, { phone }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Send User supplied Mobile OTP to be verified
     * @param phone The user's phone number WITH international prefix
     * @param token token that user was sent to their mobile phone
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    verifyMobileOTP(phone, token, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                const data = yield fetch_1.post(`${this.url}/verify`, { phone, token, type: 'sms', redirect_to: options.redirectTo }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param data Optional user metadata
     */
    inviteUserByEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/invite${queryString}`, { email, data: options.data }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends a reset request to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    resetPasswordForEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/recover${queryString}`, { email }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Create a temporary object with all configured headers and
     * adds the Authorization token to be used on request methods
     * @param jwt A valid, logged-in JWT.
     */
    _createRequestHeaders(jwt) {
        const headers = Object.assign({}, this.headers);
        headers['Authorization'] = `Bearer ${jwt}`;
        return headers;
    }
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     */
    signOut(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch_1.post(`${this.url}/logout`, {}, { headers: this._createRequestHeaders(jwt), noResolveJson: true });
                return { error: null };
            }
            catch (error) {
                return { error };
            }
        });
    }
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param provider One of the providers supported by GoTrue.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param scopes A space-separated list of scopes granted to the OAuth application.
     */
    getUrlForProvider(provider, options) {
        let urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options === null || options === void 0 ? void 0 : options.redirectTo) {
            urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
        }
        if (options === null || options === void 0 ? void 0 : options.scopes) {
            urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
        }
        return `${this.url}/authorize?${urlParams.join('&')}`;
    }
    /**
     * Gets the user details.
     * @param jwt A valid, logged-in JWT.
     */
    getUser(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.get(`${this.url}/user`, { headers: this._createRequestHeaders(jwt) });
                return { user: data, data, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Updates the user data.
     * @param jwt A valid, logged-in JWT.
     * @param attributes The data you want to update.
     */
    updateUser(jwt, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.put(`${this.url}/user`, attributes, {
                    headers: this._createRequestHeaders(jwt),
                });
                return { user: data, data, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @param uid The user uid you want to remove.
     * @param jwt A valid JWT. Must be a full-access API key (e.g. service_role key).
     */
    deleteUser(uid, jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.remove(`${this.url}/admin/users/${uid}`, {}, {
                    headers: this._createRequestHeaders(jwt),
                });
                return { user: data, data, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/token?grant_type=refresh_token`, { refresh_token: refreshToken }, { headers: this.headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Set/delete the auth cookie based on the AuthChangeEvent.
     * Works for Next.js & Express (requires cookie-parser middleware).
     */
    setAuthCookie(req, res) {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            res.status(405).end('Method Not Allowed');
        }
        const { event, session } = req.body;
        if (!event)
            throw new Error('Auth event missing!');
        if (event === 'SIGNED_IN') {
            if (!session)
                throw new Error('Auth session missing!');
            cookies_1.setCookie(req, res, {
                name: this.cookieOptions.name,
                value: session.access_token,
                domain: this.cookieOptions.domain,
                maxAge: this.cookieOptions.lifetime,
                path: this.cookieOptions.path,
                sameSite: this.cookieOptions.sameSite,
            });
        }
        if (event === 'SIGNED_OUT')
            cookies_1.deleteCookie(req, res, this.cookieOptions.name);
        res.status(200).json({});
    }
    /**
     * Get user by reading the cookie from the request.
     * Works for Next.js & Express (requires cookie-parser middleware).
     */
    getUserByCookie(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.cookies)
                    throw new Error('Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!');
                if (!req.cookies[this.cookieOptions.name])
                    throw new Error('No cookie found!');
                const token = req.cookies[this.cookieOptions.name];
                const { user, error } = yield this.getUser(token);
                if (error)
                    throw error;
                return { user, data: user, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Generates links to be sent via email or other.
     * @param type The link type ("signup" or "magiclink" or "recovery" or "invite").
     * @param email The user's email.
     * @param password User password. For signup only.
     * @param data Optional user metadata. For signup only.
     * @param redirectTo The link type ("signup" or "magiclink" or "recovery" or "invite").
     */
    generateLink(type, email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/admin/generate_link`, {
                    type,
                    email,
                    password: options.password,
                    data: options.data,
                    redirect_to: options.redirectTo,
                }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
}
exports.default = GoTrueApi;

},{"./lib/constants":5,"./lib/cookies":6,"./lib/fetch":7,"./lib/helpers":8}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GoTrueApi_1 = __importDefault(require("./GoTrueApi"));
const helpers_1 = require("./lib/helpers");
const constants_1 = require("./lib/constants");
const polyfills_1 = require("./lib/polyfills");
polyfills_1.polyfillGlobalThis(); // Make "globalThis" available
const DEFAULT_OPTIONS = {
    url: constants_1.GOTRUE_URL,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    headers: constants_1.DEFAULT_HEADERS,
};
class GoTrueClient {
    /**
     * Create a new client for use in the browser.
     * @param options.url The URL of the GoTrue server.
     * @param options.headers Any additional headers to send to the GoTrue server.
     * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
     * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
     * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
     * @param options.localStorage
     * @param options.cookieOptions
     */
    constructor(options) {
        this.stateChangeEmitters = new Map();
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        this.currentUser = null;
        this.currentSession = null;
        this.autoRefreshToken = settings.autoRefreshToken;
        this.persistSession = settings.persistSession;
        this.localStorage = settings.localStorage || globalThis.localStorage;
        this.api = new GoTrueApi_1.default({
            url: settings.url,
            headers: settings.headers,
            cookieOptions: settings.cookieOptions,
        });
        this._recoverSession();
        this._recoverAndRefresh();
        // Handle the OAuth redirect
        try {
            if (settings.detectSessionInUrl && helpers_1.isBrowser() && !!helpers_1.getParameterByName('access_token')) {
                this.getSessionFromUrl({ storeSession: true });
            }
        }
        catch (error) {
            console.log('Error getting session from URL.');
        }
    }
    /**
     * Creates a new user.
     * @type UserCredentials
     * @param email The user's email address.
     * @param password The user's password.
     * @param phone The user's phone number.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param data Optional user metadata.
     */
    signUp({ email, password, phone }, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._removeSession();
                const { data, error } = phone && password
                    ? yield this.api.signUpWithPhone(phone, password, {
                        data: options.data,
                    })
                    : yield this.api.signUpWithEmail(email, password, {
                        redirectTo: options.redirectTo,
                        data: options.data,
                    });
                if (error) {
                    throw error;
                }
                if (!data) {
                    throw 'An error occurred on sign up.';
                }
                let session = null;
                let user = null;
                if (data.access_token) {
                    session = data;
                    user = session.user;
                    this._saveSession(session);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
                if (data.id) {
                    user = data;
                }
                return { data, user, session, error: null };
            }
            catch (error) {
                return { data: null, user: null, session: null, error };
            }
        });
    }
    /**
     * Log in an existing user, or login via a third-party provider.
     * @type UserCredentials
     * @param email The user's email address.
     * @param password The user's password.
     * @param refreshToken A valid refresh token that was returned on login.
     * @param provider One of the providers supported by GoTrue.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param scopes A space-separated list of scopes granted to the OAuth application.
     */
    signIn({ email, phone, password, refreshToken, provider }, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._removeSession();
                if (email && !password) {
                    const { error } = yield this.api.sendMagicLinkEmail(email, {
                        redirectTo: options.redirectTo,
                    });
                    return { data: null, user: null, session: null, error };
                }
                if (email && password) {
                    return this._handleEmailSignIn(email, password, {
                        redirectTo: options.redirectTo,
                    });
                }
                if (phone && !password) {
                    const { error } = yield this.api.sendMobileOTP(phone);
                    return { data: null, user: null, session: null, error };
                }
                if (phone && password) {
                    return this._handlePhoneSignIn(phone, password);
                }
                if (refreshToken) {
                    // currentSession and currentUser will be updated to latest on _callRefreshToken using the passed refreshToken
                    const { error } = yield this._callRefreshToken(refreshToken);
                    if (error)
                        throw error;
                    return {
                        data: this.currentSession,
                        user: this.currentUser,
                        session: this.currentSession,
                        error: null,
                    };
                }
                if (provider) {
                    return this._handleProviderSignIn(provider, {
                        redirectTo: options.redirectTo,
                        scopes: options.scopes,
                    });
                }
                throw new Error(`You must provide either an email, phone number or a third-party provider.`);
            }
            catch (error) {
                return { data: null, user: null, session: null, error };
            }
        });
    }
    /**
     * Log in a user given a User supplied OTP received via mobile.
     * @param phone The user's phone number.
     * @param token The user's password.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    verifyOTP({ phone, token }, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._removeSession();
                const { data, error } = yield this.api.verifyMobileOTP(phone, token, options);
                if (error) {
                    throw error;
                }
                if (!data) {
                    throw 'An error occurred on token verification.';
                }
                let session = null;
                let user = null;
                if (data.access_token) {
                    session = data;
                    user = session.user;
                    this._saveSession(session);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
                if (data.id) {
                    user = data;
                }
                return { data, user, session, error: null };
            }
            catch (error) {
                return { data: null, user: null, session: null, error };
            }
        });
    }
    /**
     * Inside a browser context, `user()` will return the user data, if there is a logged in user.
     *
     * For server-side management, you can get a user through `auth.api.getUserByCookie()`
     */
    user() {
        return this.currentUser;
    }
    /**
     * Returns the session data, if there is an active session.
     */
    session() {
        return this.currentSession;
    }
    /**
     * Force refreshes the session including the user data in case it was updated in a different session.
     */
    refreshSession() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                    throw new Error('Not logged in.');
                // currentSession and currentUser will be updated to latest on _callRefreshToken
                const { error } = yield this._callRefreshToken();
                if (error)
                    throw error;
                return { data: this.currentSession, user: this.currentUser, error: null };
            }
            catch (error) {
                return { data: null, user: null, error };
            }
        });
    }
    /**
     * Updates user data, if there is a logged in user.
     */
    update(attributes) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                    throw new Error('Not logged in.');
                const { user, error } = yield this.api.updateUser(this.currentSession.access_token, attributes);
                if (error)
                    throw error;
                if (!user)
                    throw Error('Invalid user data.');
                const session = Object.assign(Object.assign({}, this.currentSession), { user });
                this._saveSession(session);
                this._notifyAllSubscribers('USER_UPDATED');
                return { data: user, user, error: null };
            }
            catch (error) {
                return { data: null, user: null, error };
            }
        });
    }
    /**
     * Sets the session data from refresh_token and returns current Session and Error
     * @param refresh_token a JWT token
     */
    setSession(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refresh_token) {
                    throw new Error('No current session.');
                }
                const { data, error } = yield this.api.refreshAccessToken(refresh_token);
                if (error) {
                    return { session: null, error: error };
                }
                if (!data) {
                    return {
                        session: null,
                        error: { name: 'Invalid refresh_token', message: 'JWT token provided is Invalid' },
                    };
                }
                this._saveSession(data);
                this._notifyAllSubscribers('SIGNED_IN');
                return { session: data, error: null };
            }
            catch (error) {
                return { error, session: null };
            }
        });
    }
    /**
     * Overrides the JWT on the current client. The JWT will then be sent in all subsequent network requests.
     * @param access_token a jwt access token
     */
    setAuth(access_token) {
        this.currentSession = Object.assign(Object.assign({}, this.currentSession), { access_token, token_type: 'bearer', user: null });
        return this.currentSession;
    }
    /**
     * Gets the session data from a URL string
     * @param options.storeSession Optionally store the session in the browser
     */
    getSessionFromUrl(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!helpers_1.isBrowser())
                    throw new Error('No browser detected.');
                const error_description = helpers_1.getParameterByName('error_description');
                if (error_description)
                    throw new Error(error_description);
                const provider_token = helpers_1.getParameterByName('provider_token');
                const access_token = helpers_1.getParameterByName('access_token');
                if (!access_token)
                    throw new Error('No access_token detected.');
                const expires_in = helpers_1.getParameterByName('expires_in');
                if (!expires_in)
                    throw new Error('No expires_in detected.');
                const refresh_token = helpers_1.getParameterByName('refresh_token');
                if (!refresh_token)
                    throw new Error('No refresh_token detected.');
                const token_type = helpers_1.getParameterByName('token_type');
                if (!token_type)
                    throw new Error('No token_type detected.');
                const timeNow = Math.round(Date.now() / 1000);
                const expires_at = timeNow + parseInt(expires_in);
                const { user, error } = yield this.api.getUser(access_token);
                if (error)
                    throw error;
                const session = {
                    provider_token,
                    access_token,
                    expires_in: parseInt(expires_in),
                    expires_at,
                    refresh_token,
                    token_type,
                    user: user,
                };
                if (options === null || options === void 0 ? void 0 : options.storeSession) {
                    this._saveSession(session);
                    this._notifyAllSubscribers('SIGNED_IN');
                    if (helpers_1.getParameterByName('type') === 'recovery') {
                        this._notifyAllSubscribers('PASSWORD_RECOVERY');
                    }
                }
                // Remove tokens from URL
                window.location.hash = '';
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Inside a browser context, `signOut()` will remove the logged in user from the browser session
     * and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
     *
     * For server-side management, you can disable sessions by passing a JWT through to `auth.api.signOut(JWT: string)`
     */
    signOut() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token;
            this._removeSession();
            this._notifyAllSubscribers('SIGNED_OUT');
            if (accessToken) {
                const { error } = yield this.api.signOut(accessToken);
                if (error)
                    return { error };
            }
            return { error: null };
        });
    }
    /**
     * Receive a notification every time an auth event happens.
     * @returns {Subscription} A subscription object which can be used to unsubscribe itself.
     */
    onAuthStateChange(callback) {
        try {
            const id = helpers_1.uuid();
            const self = this;
            const subscription = {
                id,
                callback,
                unsubscribe: () => {
                    self.stateChangeEmitters.delete(id);
                },
            };
            this.stateChangeEmitters.set(id, subscription);
            return { data: subscription, error: null };
        }
        catch (error) {
            return { data: null, error };
        }
    }
    _handleEmailSignIn(email, password, options = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield this.api.signInWithEmail(email, password, {
                    redirectTo: options.redirectTo,
                });
                if (error || !data)
                    return { data: null, user: null, session: null, error };
                if (((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.confirmed_at) || ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.email_confirmed_at)) {
                    this._saveSession(data);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
                return { data, user: data.user, session: data, error: null };
            }
            catch (error) {
                return { data: null, user: null, session: null, error };
            }
        });
    }
    _handlePhoneSignIn(phone, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield this.api.signInWithPhone(phone, password);
                if (error || !data)
                    return { data: null, user: null, session: null, error };
                if ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.phone_confirmed_at) {
                    this._saveSession(data);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
                return { data, user: data.user, session: data, error: null };
            }
            catch (error) {
                return { data: null, user: null, session: null, error };
            }
        });
    }
    _handleProviderSignIn(provider, options = {}) {
        const url = this.api.getUrlForProvider(provider, {
            redirectTo: options.redirectTo,
            scopes: options.scopes,
        });
        try {
            // try to open on the browser
            if (helpers_1.isBrowser()) {
                window.location.href = url;
            }
            return { provider, url, data: null, session: null, user: null, error: null };
        }
        catch (error) {
            // fallback to returning the URL
            if (!!url)
                return { provider, url, data: null, session: null, user: null, error: null };
            return { data: null, user: null, session: null, error };
        }
    }
    /**
     * Attempts to get the session from LocalStorage
     * Note: this should never be async (even for React Native), as we need it to return immediately in the constructor.
     */
    _recoverSession() {
        var _a;
        try {
            const json = helpers_1.isBrowser() && ((_a = this.localStorage) === null || _a === void 0 ? void 0 : _a.getItem(constants_1.STORAGE_KEY));
            if (!json || typeof json !== 'string') {
                return null;
            }
            const data = JSON.parse(json);
            const { currentSession, expiresAt } = data;
            const timeNow = Math.round(Date.now() / 1000);
            if (expiresAt >= timeNow && (currentSession === null || currentSession === void 0 ? void 0 : currentSession.user)) {
                this._saveSession(currentSession);
                this._notifyAllSubscribers('SIGNED_IN');
            }
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
     * Recovers the session from LocalStorage and refreshes
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    _recoverAndRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = helpers_1.isBrowser() && (yield this.localStorage.getItem(constants_1.STORAGE_KEY));
                if (!json) {
                    return null;
                }
                const data = JSON.parse(json);
                const { currentSession, expiresAt } = data;
                const timeNow = Math.round(Date.now() / 1000);
                if (expiresAt < timeNow) {
                    if (this.autoRefreshToken && currentSession.refresh_token) {
                        const { error } = yield this._callRefreshToken(currentSession.refresh_token);
                        if (error) {
                            console.log(error.message);
                            yield this._removeSession();
                        }
                    }
                    else {
                        this._removeSession();
                    }
                }
                else if (!currentSession || !currentSession.user) {
                    console.log('Current session is missing data.');
                    this._removeSession();
                }
                else {
                    // should be handled on _recoverSession method already
                    // But we still need the code here to accommodate for AsyncStorage e.g. in React native
                    this._saveSession(currentSession);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
            }
            catch (err) {
                console.error(err);
                return null;
            }
        });
    }
    _callRefreshToken(refresh_token) {
        var _a;
        if (refresh_token === void 0) { refresh_token = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.refresh_token; }
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refresh_token) {
                    throw new Error('No current session.');
                }
                const { data, error } = yield this.api.refreshAccessToken(refresh_token);
                if (error)
                    throw error;
                if (!data)
                    throw Error('Invalid session data.');
                this._saveSession(data);
                this._notifyAllSubscribers('SIGNED_IN');
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    _notifyAllSubscribers(event) {
        this.stateChangeEmitters.forEach((x) => x.callback(event, this.currentSession));
    }
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    _saveSession(session) {
        this.currentSession = session;
        this.currentUser = session.user;
        const expiresAt = session.expires_at;
        if (expiresAt) {
            const timeNow = Math.round(Date.now() / 1000);
            const expiresIn = expiresAt - timeNow;
            const refreshDurationBeforeExpires = expiresIn > 60 ? 60 : 0.5;
            this._startAutoRefreshToken((expiresIn - refreshDurationBeforeExpires) * 1000);
        }
        // Do we need any extra check before persist session
        // access_token or user ?
        if (this.persistSession && session.expires_at) {
            this._persistSession(this.currentSession);
        }
    }
    _persistSession(currentSession) {
        const data = { currentSession, expiresAt: currentSession.expires_at };
        helpers_1.isBrowser() && this.localStorage.setItem(constants_1.STORAGE_KEY, JSON.stringify(data));
    }
    _removeSession() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentSession = null;
            this.currentUser = null;
            if (this.refreshTokenTimer)
                clearTimeout(this.refreshTokenTimer);
            helpers_1.isBrowser() && (yield this.localStorage.removeItem(constants_1.STORAGE_KEY));
        });
    }
    /**
     * Clear and re-create refresh token timer
     * @param value time intervals in milliseconds
     */
    _startAutoRefreshToken(value) {
        if (this.refreshTokenTimer)
            clearTimeout(this.refreshTokenTimer);
        if (value <= 0 || !this.autoRefreshToken)
            return;
        this.refreshTokenTimer = setTimeout(() => this._callRefreshToken(), value);
        if (typeof this.refreshTokenTimer.unref === 'function')
            this.refreshTokenTimer.unref();
    }
}
exports.default = GoTrueClient;

},{"./GoTrueApi":2,"./lib/constants":5,"./lib/helpers":8,"./lib/polyfills":9}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoTrueClient = exports.GoTrueApi = void 0;
const GoTrueApi_1 = __importDefault(require("./GoTrueApi"));
exports.GoTrueApi = GoTrueApi_1.default;
const GoTrueClient_1 = __importDefault(require("./GoTrueClient"));
exports.GoTrueClient = GoTrueClient_1.default;
__exportStar(require("./lib/types"), exports);

},{"./GoTrueApi":2,"./GoTrueClient":3,"./lib/types":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_OPTIONS = exports.STORAGE_KEY = exports.EXPIRY_MARGIN = exports.DEFAULT_HEADERS = exports.AUDIENCE = exports.GOTRUE_URL = void 0;
const version_1 = require("./version");
exports.GOTRUE_URL = 'http://localhost:9999';
exports.AUDIENCE = '';
exports.DEFAULT_HEADERS = { 'X-Client-Info': `gotrue-js/${version_1.version}` };
exports.EXPIRY_MARGIN = 60 * 1000;
exports.STORAGE_KEY = 'supabase.auth.token';
exports.COOKIE_OPTIONS = {
    name: 'sb:token',
    lifetime: 60 * 60 * 8,
    domain: '',
    path: '/',
    sameSite: 'lax',
};

},{"./version":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.setCookie = exports.setCookies = void 0;
/**
 * Serialize data into a cookie header.
 */
function serialize(name, val, options) {
    const opt = options || {};
    const enc = encodeURIComponent;
    const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    if (typeof enc !== 'function') {
        throw new TypeError('option encode is invalid');
    }
    if (!fieldContentRegExp.test(name)) {
        throw new TypeError('argument name is invalid');
    }
    const value = enc(val);
    if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError('argument val is invalid');
    }
    let str = name + '=' + value;
    if (null != opt.maxAge) {
        const maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
            throw new TypeError('option maxAge is invalid');
        }
        str += '; Max-Age=' + Math.floor(maxAge);
    }
    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError('option domain is invalid');
        }
        str += '; Domain=' + opt.domain;
    }
    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError('option path is invalid');
        }
        str += '; Path=' + opt.path;
    }
    if (opt.expires) {
        if (typeof opt.expires.toUTCString !== 'function') {
            throw new TypeError('option expires is invalid');
        }
        str += '; Expires=' + opt.expires.toUTCString();
    }
    if (opt.httpOnly) {
        str += '; HttpOnly';
    }
    if (opt.secure) {
        str += '; Secure';
    }
    if (opt.sameSite) {
        const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
                break;
            default:
                throw new TypeError('option sameSite is invalid');
        }
    }
    return str;
}
/**
 * Based on the environment and the request we know if a secure cookie can be set.
 */
function isSecureEnvironment(req) {
    if (!req || !req.headers || !req.headers.host) {
        throw new Error('The "host" request header is not available');
    }
    const host = (req.headers.host.indexOf(':') > -1 && req.headers.host.split(':')[0]) || req.headers.host;
    if (['localhost', '127.0.0.1'].indexOf(host) > -1 || host.endsWith('.local')) {
        return false;
    }
    return true;
}
/**
 * Serialize a cookie to a string.
 */
function serializeCookie(cookie, secure) {
    var _a, _b, _c;
    return serialize(cookie.name, cookie.value, {
        maxAge: cookie.maxAge,
        expires: new Date(Date.now() + cookie.maxAge * 1000),
        httpOnly: true,
        secure,
        path: (_a = cookie.path) !== null && _a !== void 0 ? _a : '/',
        domain: (_b = cookie.domain) !== null && _b !== void 0 ? _b : '',
        sameSite: (_c = cookie.sameSite) !== null && _c !== void 0 ? _c : 'lax',
    });
}
/**
 * Set one or more cookies.
 */
function setCookies(req, res, cookies) {
    const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
    const previousCookies = res.getHeader('Set-Cookie');
    if (previousCookies) {
        if (previousCookies instanceof Array) {
            Array.prototype.push.apply(strCookies, previousCookies);
        }
        else if (typeof previousCookies === 'string') {
            strCookies.push(previousCookies);
        }
    }
    res.setHeader('Set-Cookie', strCookies);
}
exports.setCookies = setCookies;
/**
 * Set one or more cookies.
 */
function setCookie(req, res, cookie) {
    setCookies(req, res, [cookie]);
}
exports.setCookie = setCookie;
function deleteCookie(req, res, name) {
    setCookie(req, res, {
        name,
        value: '',
        maxAge: -1,
    });
}
exports.deleteCookie = deleteCookie;

},{}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.put = exports.post = exports.get = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const handleError = (error, reject) => {
    if (typeof error.json !== 'function') {
        return reject(error);
    }
    error.json().then((err) => {
        return reject({
            message: _getErrorMessage(err),
            status: (error === null || error === void 0 ? void 0 : error.status) || 500,
        });
    });
};
const _getRequestParams = (method, options, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === 'GET') {
        return params;
    }
    params.headers = Object.assign({ 'Content-Type': 'text/plain;charset=UTF-8' }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
    return params;
};
function _handleRequest(method, url, options, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            cross_fetch_1.default(url, _getRequestParams(method, options, body))
                .then((result) => {
                if (!result.ok)
                    throw result;
                if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                    return resolve;
                return result.json();
            })
                .then((data) => resolve(data))
                .catch((error) => handleError(error, reject));
        });
    });
}
function get(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('GET', url, options);
    });
}
exports.get = get;
function post(url, body, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('POST', url, options, body);
    });
}
exports.post = post;
function put(url, body, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('PUT', url, options, body);
    });
}
exports.put = put;
function remove(url, body, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('DELETE', url, options, body);
    });
}
exports.remove = remove;

},{"cross-fetch":46}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParameterByName = exports.isBrowser = exports.uuid = exports.expiresAt = void 0;
function expiresAt(expiresIn) {
    const timeNow = Math.round(Date.now() / 1000);
    return timeNow + expiresIn;
}
exports.expiresAt = expiresAt;
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.uuid = uuid;
exports.isBrowser = () => typeof window !== 'undefined';
function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
exports.getParameterByName = getParameterByName;

},{}],9:[function(require,module,exports){
"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.polyfillGlobalThis = void 0;
/**
 * https://mathiasbynens.be/notes/globalthis
 */
function polyfillGlobalThis() {
    if (typeof globalThis === 'object')
        return;
    try {
        Object.defineProperty(Object.prototype, '__magic__', {
            get: function () {
                return this;
            },
            configurable: true,
        });
        __magic__.globalThis = __magic__;
        delete Object.prototype.__magic__;
    }
    catch (e) {
        if (typeof self !== 'undefined') {
            self.globalThis = self;
        }
    }
}
exports.polyfillGlobalThis = polyfillGlobalThis;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
// generated by genversion
exports.version = '1.18.0';

},{}],12:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostgrestQueryBuilder_1 = __importDefault(require("./lib/PostgrestQueryBuilder"));
const PostgrestRpcBuilder_1 = __importDefault(require("./lib/PostgrestRpcBuilder"));
const constants_1 = require("./lib/constants");
class PostgrestClient {
    /**
     * Creates a PostgREST client.
     *
     * @param url  URL of the PostgREST endpoint.
     * @param headers  Custom headers.
     * @param schema  Postgres schema to switch to.
     */
    constructor(url, { headers = {}, schema } = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.schema = schema;
    }
    /**
     * Authenticates the request with JWT.
     *
     * @param token  The JWT token to use.
     */
    auth(token) {
        this.headers['Authorization'] = `Bearer ${token}`;
        return this;
    }
    /**
     * Perform a table operation.
     *
     * @param table  The table name to operate on.
     */
    from(table) {
        const url = `${this.url}/${table}`;
        return new PostgrestQueryBuilder_1.default(url, { headers: this.headers, schema: this.schema });
    }
    /**
     * Perform a function call.
     *
     * @param fn  The function name to call.
     * @param params  The parameters to pass to the function call.
     * @param count  Count algorithm to use to count rows in a table.
     */
    rpc(fn, params, { count = null, } = {}) {
        const url = `${this.url}/rpc/${fn}`;
        return new PostgrestRpcBuilder_1.default(url, {
            headers: this.headers,
            schema: this.schema,
        }).rpc(params, { count });
    }
}
exports.default = PostgrestClient;

},{"./lib/PostgrestQueryBuilder":15,"./lib/PostgrestRpcBuilder":16,"./lib/constants":18}],13:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestBuilder = exports.PostgrestClient = void 0;
const PostgrestClient_1 = __importDefault(require("./PostgrestClient"));
exports.PostgrestClient = PostgrestClient_1.default;
const PostgrestFilterBuilder_1 = __importDefault(require("./lib/PostgrestFilterBuilder"));
exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
const PostgrestQueryBuilder_1 = __importDefault(require("./lib/PostgrestQueryBuilder"));
exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
const types_1 = require("./lib/types");
Object.defineProperty(exports, "PostgrestBuilder", { enumerable: true, get: function () { return types_1.PostgrestBuilder; } });

},{"./PostgrestClient":12,"./lib/PostgrestFilterBuilder":14,"./lib/PostgrestQueryBuilder":15,"./lib/types":19}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostgrestTransformBuilder_1 = __importDefault(require("./PostgrestTransformBuilder"));
class PostgrestFilterBuilder extends PostgrestTransformBuilder_1.default {
    constructor() {
        super(...arguments);
        /** @deprecated Use `contains()` instead. */
        this.cs = this.contains;
        /** @deprecated Use `containedBy()` instead. */
        this.cd = this.containedBy;
        /** @deprecated Use `rangeLt()` instead. */
        this.sl = this.rangeLt;
        /** @deprecated Use `rangeGt()` instead. */
        this.sr = this.rangeGt;
        /** @deprecated Use `rangeGte()` instead. */
        this.nxl = this.rangeGte;
        /** @deprecated Use `rangeLte()` instead. */
        this.nxr = this.rangeLte;
        /** @deprecated Use `rangeAdjacent()` instead. */
        this.adj = this.rangeAdjacent;
        /** @deprecated Use `overlaps()` instead. */
        this.ov = this.overlaps;
    }
    /**
     * Finds all rows which doesn't satisfy the filter.
     *
     * @param column  The column to filter on.
     * @param operator  The operator to filter with.
     * @param value  The value to filter with.
     */
    not(column, operator, value) {
        this.url.searchParams.append(`${column}`, `not.${operator}.${value}`);
        return this;
    }
    /**
     * Finds all rows satisfying at least one of the filters.
     *
     * @param filters  The filters to use, separated by commas.
     * @param foreignTable  The foreign table to use (if `column` is a foreign column).
     */
    or(filters, { foreignTable } = {}) {
        const key = typeof foreignTable === 'undefined' ? 'or' : `${foreignTable}.or`;
        this.url.searchParams.append(key, `(${filters})`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` exactly matches the
     * specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    eq(column, value) {
        this.url.searchParams.append(`${column}`, `eq.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` doesn't match the
     * specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    neq(column, value) {
        this.url.searchParams.append(`${column}`, `neq.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` is greater than the
     * specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    gt(column, value) {
        this.url.searchParams.append(`${column}`, `gt.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` is greater than or
     * equal to the specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    gte(column, value) {
        this.url.searchParams.append(`${column}`, `gte.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` is less than the
     * specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    lt(column, value) {
        this.url.searchParams.append(`${column}`, `lt.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` is less than or equal
     * to the specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    lte(column, value) {
        this.url.searchParams.append(`${column}`, `lte.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value in the stated `column` matches the supplied
     * `pattern` (case sensitive).
     *
     * @param column  The column to filter on.
     * @param pattern  The pattern to filter with.
     */
    like(column, pattern) {
        this.url.searchParams.append(`${column}`, `like.${pattern}`);
        return this;
    }
    /**
     * Finds all rows whose value in the stated `column` matches the supplied
     * `pattern` (case insensitive).
     *
     * @param column  The column to filter on.
     * @param pattern  The pattern to filter with.
     */
    ilike(column, pattern) {
        this.url.searchParams.append(`${column}`, `ilike.${pattern}`);
        return this;
    }
    /**
     * A check for exact equality (null, true, false), finds all rows whose
     * value on the stated `column` exactly match the specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    is(column, value) {
        this.url.searchParams.append(`${column}`, `is.${value}`);
        return this;
    }
    /**
     * Finds all rows whose value on the stated `column` is found on the
     * specified `values`.
     *
     * @param column  The column to filter on.
     * @param values  The values to filter with.
     */
    in(column, values) {
        const cleanedValues = values
            .map((s) => {
            // handle postgrest reserved characters
            // https://postgrest.org/en/v7.0.0/api.html#reserved-characters
            if (typeof s === 'string' && new RegExp('[,()]').test(s))
                return `"${s}"`;
            else
                return `${s}`;
        })
            .join(',');
        this.url.searchParams.append(`${column}`, `in.(${cleanedValues})`);
        return this;
    }
    /**
     * Finds all rows whose json, array, or range value on the stated `column`
     * contains the values specified in `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    contains(column, value) {
        if (typeof value === 'string') {
            // range types can be inclusive '[', ']' or exclusive '(', ')' so just
            // keep it simple and accept a string
            this.url.searchParams.append(`${column}`, `cs.${value}`);
        }
        else if (Array.isArray(value)) {
            // array
            this.url.searchParams.append(`${column}`, `cs.{${value.join(',')}}`);
        }
        else {
            // json
            this.url.searchParams.append(`${column}`, `cs.${JSON.stringify(value)}`);
        }
        return this;
    }
    /**
     * Finds all rows whose json, array, or range value on the stated `column` is
     * contained by the specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    containedBy(column, value) {
        if (typeof value === 'string') {
            // range
            this.url.searchParams.append(`${column}`, `cd.${value}`);
        }
        else if (Array.isArray(value)) {
            // array
            this.url.searchParams.append(`${column}`, `cd.{${value.join(',')}}`);
        }
        else {
            // json
            this.url.searchParams.append(`${column}`, `cd.${JSON.stringify(value)}`);
        }
        return this;
    }
    /**
     * Finds all rows whose range value on the stated `column` is strictly to the
     * left of the specified `range`.
     *
     * @param column  The column to filter on.
     * @param range  The range to filter with.
     */
    rangeLt(column, range) {
        this.url.searchParams.append(`${column}`, `sl.${range}`);
        return this;
    }
    /**
     * Finds all rows whose range value on the stated `column` is strictly to
     * the right of the specified `range`.
     *
     * @param column  The column to filter on.
     * @param range  The range to filter with.
     */
    rangeGt(column, range) {
        this.url.searchParams.append(`${column}`, `sr.${range}`);
        return this;
    }
    /**
     * Finds all rows whose range value on the stated `column` does not extend
     * to the left of the specified `range`.
     *
     * @param column  The column to filter on.
     * @param range  The range to filter with.
     */
    rangeGte(column, range) {
        this.url.searchParams.append(`${column}`, `nxl.${range}`);
        return this;
    }
    /**
     * Finds all rows whose range value on the stated `column` does not extend
     * to the right of the specified `range`.
     *
     * @param column  The column to filter on.
     * @param range  The range to filter with.
     */
    rangeLte(column, range) {
        this.url.searchParams.append(`${column}`, `nxr.${range}`);
        return this;
    }
    /**
     * Finds all rows whose range value on the stated `column` is adjacent to
     * the specified `range`.
     *
     * @param column  The column to filter on.
     * @param range  The range to filter with.
     */
    rangeAdjacent(column, range) {
        this.url.searchParams.append(`${column}`, `adj.${range}`);
        return this;
    }
    /**
     * Finds all rows whose array or range value on the stated `column` overlaps
     * (has a value in common) with the specified `value`.
     *
     * @param column  The column to filter on.
     * @param value  The value to filter with.
     */
    overlaps(column, value) {
        if (typeof value === 'string') {
            // range
            this.url.searchParams.append(`${column}`, `ov.${value}`);
        }
        else {
            // array
            this.url.searchParams.append(`${column}`, `ov.{${value.join(',')}}`);
        }
        return this;
    }
    /**
     * Finds all rows whose text or tsvector value on the stated `column` matches
     * the tsquery in `query`.
     *
     * @param column  The column to filter on.
     * @param query  The Postgres tsquery string to filter with.
     * @param config  The text search configuration to use.
     * @param type  The type of tsquery conversion to use on `query`.
     */
    textSearch(column, query, { config, type = null, } = {}) {
        let typePart = '';
        if (type === 'plain') {
            typePart = 'pl';
        }
        else if (type === 'phrase') {
            typePart = 'ph';
        }
        else if (type === 'websearch') {
            typePart = 'w';
        }
        const configPart = config === undefined ? '' : `(${config})`;
        this.url.searchParams.append(`${column}`, `${typePart}fts${configPart}.${query}`);
        return this;
    }
    /**
     * Finds all rows whose tsvector value on the stated `column` matches
     * to_tsquery(`query`).
     *
     * @param column  The column to filter on.
     * @param query  The Postgres tsquery string to filter with.
     * @param config  The text search configuration to use.
     *
     * @deprecated Use `textSearch()` instead.
     */
    fts(column, query, { config } = {}) {
        const configPart = typeof config === 'undefined' ? '' : `(${config})`;
        this.url.searchParams.append(`${column}`, `fts${configPart}.${query}`);
        return this;
    }
    /**
     * Finds all rows whose tsvector value on the stated `column` matches
     * plainto_tsquery(`query`).
     *
     * @param column  The column to filter on.
     * @param query  The Postgres tsquery string to filter with.
     * @param config  The text search configuration to use.
     *
     * @deprecated Use `textSearch()` with `type: 'plain'` instead.
     */
    plfts(column, query, { config } = {}) {
        const configPart = typeof config === 'undefined' ? '' : `(${config})`;
        this.url.searchParams.append(`${column}`, `plfts${configPart}.${query}`);
        return this;
    }
    /**
     * Finds all rows whose tsvector value on the stated `column` matches
     * phraseto_tsquery(`query`).
     *
     * @param column  The column to filter on.
     * @param query  The Postgres tsquery string to filter with.
     * @param config  The text search configuration to use.
     *
     * @deprecated Use `textSearch()` with `type: 'phrase'` instead.
     */
    phfts(column, query, { config } = {}) {
        const configPart = typeof config === 'undefined' ? '' : `(${config})`;
        this.url.searchParams.append(`${column}`, `phfts${configPart}.${query}`);
        return this;
    }
    /**
     * Finds all rows whose tsvector value on the stated `column` matches
     * websearch_to_tsquery(`query`).
     *
     * @param column  The column to filter on.
     * @param query  The Postgres tsquery string to filter with.
     * @param config  The text search configuration to use.
     *
     * @deprecated Use `textSearch()` with `type: 'websearch'` instead.
     */
    wfts(column, query, { config } = {}) {
        const configPart = typeof config === 'undefined' ? '' : `(${config})`;
        this.url.searchParams.append(`${column}`, `wfts${configPart}.${query}`);
        return this;
    }
    /**
     * Finds all rows whose `column` satisfies the filter.
     *
     * @param column  The column to filter on.
     * @param operator  The operator to filter with.
     * @param value  The value to filter with.
     */
    filter(column, operator, value) {
        this.url.searchParams.append(`${column}`, `${operator}.${value}`);
        return this;
    }
    /**
     * Finds all rows whose columns match the specified `query` object.
     *
     * @param query  The object to filter with, with column names as keys mapped
     *               to their filter values.
     */
    match(query) {
        Object.keys(query).forEach((key) => {
            this.url.searchParams.append(`${key}`, `eq.${query[key]}`);
        });
        return this;
    }
}
exports.default = PostgrestFilterBuilder;

},{"./PostgrestTransformBuilder":17}],15:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const PostgrestFilterBuilder_1 = __importDefault(require("./PostgrestFilterBuilder"));
class PostgrestQueryBuilder extends types_1.PostgrestBuilder {
    constructor(url, { headers = {}, schema } = {}) {
        super({});
        this.url = new URL(url);
        this.headers = Object.assign({}, headers);
        this.schema = schema;
    }
    /**
     * Performs vertical filtering with SELECT.
     *
     * @param columns  The columns to retrieve, separated by commas.
     * @param head  When set to true, select will void data.
     * @param count  Count algorithm to use to count rows in a table.
     */
    select(columns = '*', { head = false, count = null, } = {}) {
        this.method = 'GET';
        // Remove whitespaces except when quoted
        let quoted = false;
        const cleanedColumns = columns
            .split('')
            .map((c) => {
            if (/\s/.test(c) && !quoted) {
                return '';
            }
            if (c === '"') {
                quoted = !quoted;
            }
            return c;
        })
            .join('');
        this.url.searchParams.set('select', cleanedColumns);
        if (count) {
            this.headers['Prefer'] = `count=${count}`;
        }
        if (head) {
            this.method = 'HEAD';
        }
        return new PostgrestFilterBuilder_1.default(this);
    }
    insert(values, { upsert = false, onConflict, returning = 'representation', count = null, } = {}) {
        this.method = 'POST';
        const prefersHeaders = [`return=${returning}`];
        if (upsert)
            prefersHeaders.push('resolution=merge-duplicates');
        if (upsert && onConflict !== undefined)
            this.url.searchParams.set('on_conflict', onConflict);
        this.body = values;
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        if (Array.isArray(values)) {
            const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
            if (columns.length > 0) {
                const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
                this.url.searchParams.set('columns', uniqueColumns.join(','));
            }
        }
        return new PostgrestFilterBuilder_1.default(this);
    }
    /**
     * Performs an UPSERT into the table.
     *
     * @param values  The values to insert.
     * @param onConflict  By specifying the `on_conflict` query parameter, you can make UPSERT work on a column(s) that has a UNIQUE constraint.
     * @param returning  By default the new record is returned. Set this to 'minimal' if you don't need this value.
     * @param count  Count algorithm to use to count rows in a table.
     * @param ignoreDuplicates  Specifies if duplicate rows should be ignored and not inserted.
     */
    upsert(values, { onConflict, returning = 'representation', count = null, ignoreDuplicates = false, } = {}) {
        this.method = 'POST';
        const prefersHeaders = [
            `resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`,
            `return=${returning}`,
        ];
        if (onConflict !== undefined)
            this.url.searchParams.set('on_conflict', onConflict);
        this.body = values;
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        return new PostgrestFilterBuilder_1.default(this);
    }
    /**
     * Performs an UPDATE on the table.
     *
     * @param values  The values to update.
     * @param returning  By default the updated record is returned. Set this to 'minimal' if you don't need this value.
     * @param count  Count algorithm to use to count rows in a table.
     */
    update(values, { returning = 'representation', count = null, } = {}) {
        this.method = 'PATCH';
        const prefersHeaders = [`return=${returning}`];
        this.body = values;
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        return new PostgrestFilterBuilder_1.default(this);
    }
    /**
     * Performs a DELETE on the table.
     *
     * @param returning  If `true`, return the deleted row(s) in the response.
     * @param count  Count algorithm to use to count rows in a table.
     */
    delete({ returning = 'representation', count = null, } = {}) {
        this.method = 'DELETE';
        const prefersHeaders = [`return=${returning}`];
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        return new PostgrestFilterBuilder_1.default(this);
    }
}
exports.default = PostgrestQueryBuilder;

},{"./PostgrestFilterBuilder":14,"./types":19}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const PostgrestFilterBuilder_1 = __importDefault(require("./PostgrestFilterBuilder"));
class PostgrestRpcBuilder extends types_1.PostgrestBuilder {
    constructor(url, { headers = {}, schema } = {}) {
        super({});
        this.url = new URL(url);
        this.headers = Object.assign({}, headers);
        this.schema = schema;
    }
    /**
     * Perform a function call.
     */
    rpc(params, { count = null, } = {}) {
        this.method = 'POST';
        this.body = params;
        if (count) {
            if (this.headers['Prefer'] !== undefined)
                this.headers['Prefer'] += `,count=${count}`;
            else
                this.headers['Prefer'] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default(this);
    }
}
exports.default = PostgrestRpcBuilder;

},{"./PostgrestFilterBuilder":14,"./types":19}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
/**
 * Post-filters (transforms)
 */
class PostgrestTransformBuilder extends types_1.PostgrestBuilder {
    /**
     * Performs vertical filtering with SELECT.
     *
     * @param columns  The columns to retrieve, separated by commas.
     */
    select(columns = '*') {
        // Remove whitespaces except when quoted
        let quoted = false;
        const cleanedColumns = columns
            .split('')
            .map((c) => {
            if (/\s/.test(c) && !quoted) {
                return '';
            }
            if (c === '"') {
                quoted = !quoted;
            }
            return c;
        })
            .join('');
        this.url.searchParams.set('select', cleanedColumns);
        return this;
    }
    /**
     * Orders the result with the specified `column`.
     *
     * @param column  The column to order on.
     * @param ascending  If `true`, the result will be in ascending order.
     * @param nullsFirst  If `true`, `null`s appear first.
     * @param foreignTable  The foreign table to use (if `column` is a foreign column).
     */
    order(column, { ascending = true, nullsFirst = false, foreignTable, } = {}) {
        const key = typeof foreignTable === 'undefined' ? 'order' : `${foreignTable}.order`;
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}.${nullsFirst ? 'nullsfirst' : 'nullslast'}`);
        return this;
    }
    /**
     * Limits the result with the specified `count`.
     *
     * @param count  The maximum no. of rows to limit to.
     * @param foreignTable  The foreign table to use (for foreign columns).
     */
    limit(count, { foreignTable } = {}) {
        const key = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
        this.url.searchParams.set(key, `${count}`);
        return this;
    }
    /**
     * Limits the result to rows within the specified range, inclusive.
     *
     * @param from  The starting index from which to limit the result, inclusive.
     * @param to  The last index to which to limit the result, inclusive.
     * @param foreignTable  The foreign table to use (for foreign columns).
     */
    range(from, to, { foreignTable } = {}) {
        const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `${foreignTable}.offset`;
        const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        // Range is inclusive, so add 1
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
    }
    /**
     * Retrieves only one row from the result. Result must be one row (e.g. using
     * `limit`), otherwise this will result in an error.
     */
    single() {
        this.headers['Accept'] = 'application/vnd.pgrst.object+json';
        return this;
    }
    /**
     * Retrieves at most one row from the result. Result must be at most one row
     * (e.g. using `eq` on a UNIQUE column), otherwise this will result in an
     * error.
     */
    maybeSingle() {
        this.headers['Accept'] = 'application/vnd.pgrst.object+json';
        const _this = new PostgrestTransformBuilder(this);
        _this.then = ((onfulfilled, onrejected) => this.then((res) => {
            var _a, _b;
            if ((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.details) === null || _b === void 0 ? void 0 : _b.includes('Results contain 0 rows')) {
                return onfulfilled({
                    error: null,
                    data: null,
                    count: res.count,
                    status: 200,
                    statusText: 'OK',
                    body: null,
                });
            }
            return onfulfilled(res);
        }, onrejected));
        return _this;
    }
    /**
     * Set the response type to CSV.
     */
    csv() {
        this.headers['Accept'] = 'text/csv';
        return this;
    }
}
exports.default = PostgrestTransformBuilder;

},{"./types":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HEADERS = void 0;
const version_1 = require("./version");
exports.DEFAULT_HEADERS = { 'X-Client-Info': `postgrest-js/${version_1.version}` };

},{"./version":20}],19:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgrestBuilder = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
class PostgrestBuilder {
    constructor(builder) {
        Object.assign(this, builder);
    }
    /**
     * If there's an error with the query, throwOnError will reject the promise by
     * throwing the error instead of returning it as part of a successful response.
     *
     * {@link https://github.com/supabase/supabase-js/issues/92}
     */
    throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    then(onfulfilled, onrejected) {
        // https://postgrest.org/en/stable/api.html#switching-schemas
        if (typeof this.schema === 'undefined') {
            // skip
        }
        else if (['GET', 'HEAD'].includes(this.method)) {
            this.headers['Accept-Profile'] = this.schema;
        }
        else {
            this.headers['Content-Profile'] = this.schema;
        }
        if (this.method !== 'GET' && this.method !== 'HEAD') {
            this.headers['Content-Type'] = 'application/json';
        }
        return cross_fetch_1.default(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.body),
        })
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let error = null;
            let data = null;
            let count = null;
            if (res.ok) {
                const isReturnMinimal = (_a = this.headers['Prefer']) === null || _a === void 0 ? void 0 : _a.split(',').includes('return=minimal');
                if (this.method !== 'HEAD' && !isReturnMinimal) {
                    const text = yield res.text();
                    if (!text) {
                        // discard `text`
                    }
                    else if (this.headers['Accept'] === 'text/csv') {
                        data = text;
                    }
                    else {
                        data = JSON.parse(text);
                    }
                }
                const countHeader = (_b = this.headers['Prefer']) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
                const contentRange = (_c = res.headers.get('content-range')) === null || _c === void 0 ? void 0 : _c.split('/');
                if (countHeader && contentRange && contentRange.length > 1) {
                    count = parseInt(contentRange[1]);
                }
            }
            else {
                error = yield res.json();
                if (error && this.shouldThrowOnError) {
                    throw error;
                }
            }
            const postgrestResponse = {
                error,
                data,
                count,
                status: res.status,
                statusText: res.statusText,
                body: data,
            };
            return postgrestResponse;
        }))
            .then(onfulfilled, onrejected);
    }
}
exports.PostgrestBuilder = PostgrestBuilder;

},{"cross-fetch":46}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
// generated by genversion
exports.version = '0.33.3';

},{}],21:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./lib/constants");
const timer_1 = __importDefault(require("./lib/timer"));
const RealtimeSubscription_1 = __importDefault(require("./RealtimeSubscription"));
const websocket_1 = require("websocket");
const serializer_1 = __importDefault(require("./lib/serializer"));
const noop = () => { };
class RealtimeClient {
    /**
     * Initializes the Socket
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket.
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers The optional headers to pass when connecting.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.longpollerTimeout The maximum timeout of a long poll AJAX request. Defaults to 20s (double the server long poll timer).
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     */
    constructor(endPoint, options) {
        this.channels = [];
        this.endPoint = '';
        this.headers = constants_1.DEFAULT_HEADERS;
        this.params = {};
        this.timeout = constants_1.DEFAULT_TIMEOUT;
        this.transport = websocket_1.w3cwebsocket;
        this.heartbeatIntervalMs = 30000;
        this.longpollerTimeout = 20000;
        this.heartbeatTimer = undefined;
        this.pendingHeartbeatRef = null;
        this.ref = 0;
        this.logger = noop;
        this.conn = null;
        this.sendBuffer = [];
        this.serializer = new serializer_1.default();
        this.stateChangeCallbacks = {
            open: [],
            close: [],
            error: [],
            message: [],
        };
        this.endPoint = `${endPoint}/${constants_1.TRANSPORTS.websocket}`;
        if (options === null || options === void 0 ? void 0 : options.params)
            this.params = options.params;
        if (options === null || options === void 0 ? void 0 : options.headers)
            this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
        if (options === null || options === void 0 ? void 0 : options.timeout)
            this.timeout = options.timeout;
        if (options === null || options === void 0 ? void 0 : options.logger)
            this.logger = options.logger;
        if (options === null || options === void 0 ? void 0 : options.transport)
            this.transport = options.transport;
        if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
            this.heartbeatIntervalMs = options.heartbeatIntervalMs;
        if (options === null || options === void 0 ? void 0 : options.longpollerTimeout)
            this.longpollerTimeout = options.longpollerTimeout;
        this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs
            : (tries) => {
                return [1000, 2000, 5000, 10000][tries - 1] || 10000;
            };
        this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode
            : (payload, callback) => {
                return callback(JSON.stringify(payload));
            };
        this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode
            : this.serializer.decode.bind(this.serializer);
        this.reconnectTimer = new timer_1.default(() => __awaiter(this, void 0, void 0, function* () {
            yield this.disconnect();
            this.connect();
        }), this.reconnectAfterMs);
    }
    /**
     * Connects the socket.
     */
    connect() {
        if (this.conn) {
            return;
        }
        this.conn = new this.transport(this.endPointURL(), [], null, this.headers);
        if (this.conn) {
            // this.conn.timeout = this.longpollerTimeout // TYPE ERROR
            this.conn.binaryType = 'arraybuffer';
            this.conn.onopen = () => this._onConnOpen();
            this.conn.onerror = (error) => this._onConnError(error);
            this.conn.onmessage = (event) => this.onConnMessage(event);
            this.conn.onclose = (event) => this._onConnClose(event);
        }
    }
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     */
    disconnect(code, reason) {
        return new Promise((resolve, _reject) => {
            try {
                if (this.conn) {
                    this.conn.onclose = function () { }; // noop
                    if (code) {
                        this.conn.close(code, reason || '');
                    }
                    else {
                        this.conn.close();
                    }
                    this.conn = null;
                    // remove open handles
                    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
                    this.reconnectTimer.reset();
                }
                resolve({ error: null, data: true });
            }
            catch (error) {
                resolve({ error, data: false });
            }
        });
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging.
     */
    log(kind, msg, data) {
        this.logger(kind, msg, data);
    }
    /**
     * Registers a callback for connection state change event.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onOpen(() => console.log("Socket opened."))
     */
    onOpen(callback) {
        this.stateChangeCallbacks.open.push(callback);
    }
    /**
     * Registers a callbacks for connection state change events.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onOpen(() => console.log("Socket closed."))
     */
    onClose(callback) {
        this.stateChangeCallbacks.close.push(callback);
    }
    /**
     * Registers a callback for connection state change events.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onOpen((error) => console.log("An error occurred"))
     */
    onError(callback) {
        this.stateChangeCallbacks.error.push(callback);
    }
    /**
     * Calls a function any time a message is received.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onMessage((message) => console.log(message))
     */
    onMessage(callback) {
        this.stateChangeCallbacks.message.push(callback);
    }
    /**
     * Returns the current state of the socket.
     */
    connectionState() {
        switch (this.conn && this.conn.readyState) {
            case constants_1.SOCKET_STATES.connecting:
                return 'connecting';
            case constants_1.SOCKET_STATES.open:
                return 'open';
            case constants_1.SOCKET_STATES.closing:
                return 'closing';
            default:
                return 'closed';
        }
    }
    /**
     * Retuns `true` is the connection is open.
     */
    isConnected() {
        return this.connectionState() === 'open';
    }
    /**
     * Removes a subscription from the socket.
     *
     * @param channel An open subscription.
     */
    remove(channel) {
        this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
    }
    channel(topic, chanParams = {}) {
        let chan = new RealtimeSubscription_1.default(topic, chanParams, this);
        this.channels.push(chan);
        return chan;
    }
    push(data) {
        let { topic, event, payload, ref } = data;
        let callback = () => {
            this.encode(data, (result) => {
                var _a;
                (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
            });
        };
        this.log('push', `${topic} ${event} (${ref})`, payload);
        if (this.isConnected()) {
            callback();
        }
        else {
            this.sendBuffer.push(callback);
        }
    }
    onConnMessage(rawMessage) {
        this.decode(rawMessage.data, (msg) => {
            let { topic, event, payload, ref } = msg;
            if (ref && ref === this.pendingHeartbeatRef) {
                this.pendingHeartbeatRef = null;
            }
            else if (event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
                this._resetHeartbeat();
            }
            this.log('receive', `${payload.status || ''} ${topic} ${event} ${(ref && '(' + ref + ')') || ''}`, payload);
            this.channels
                .filter((channel) => channel.isMember(topic))
                .forEach((channel) => channel.trigger(event, payload, ref));
            this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
        });
    }
    /**
     * Returns the URL of the websocket.
     */
    endPointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: constants_1.VSN }));
    }
    /**
     * Return the next message ref, accounting for overflows
     */
    makeRef() {
        let newRef = this.ref + 1;
        if (newRef === this.ref) {
            this.ref = 0;
        }
        else {
            this.ref = newRef;
        }
        return this.ref.toString();
    }
    _onConnOpen() {
        this.log('transport', `connected to ${this.endPointURL()}`);
        this._flushSendBuffer();
        this.reconnectTimer.reset();
        this._resetHeartbeat();
        this.stateChangeCallbacks.open.forEach((callback) => callback());
    }
    _onConnClose(event) {
        this.log('transport', 'close', event);
        this._triggerChanError();
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.reconnectTimer.scheduleTimeout();
        this.stateChangeCallbacks.close.forEach((callback) => callback(event));
    }
    _onConnError(error) {
        this.log('transport', error.message);
        this._triggerChanError();
        this.stateChangeCallbacks.error.forEach((callback) => callback(error));
    }
    _triggerChanError() {
        this.channels.forEach((channel) => channel.trigger(constants_1.CHANNEL_EVENTS.error));
    }
    _appendParams(url, params) {
        if (Object.keys(params).length === 0) {
            return url;
        }
        const prefix = url.match(/\?/) ? '&' : '?';
        const query = new URLSearchParams(params);
        return `${url}${prefix}${query}`;
    }
    _flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
            this.sendBuffer.forEach((callback) => callback());
            this.sendBuffer = [];
        }
    }
    _resetHeartbeat() {
        this.pendingHeartbeatRef = null;
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
    }
    _sendHeartbeat() {
        var _a;
        if (!this.isConnected()) {
            return;
        }
        if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
            this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(constants_1.WS_CLOSE_NORMAL, 'hearbeat timeout');
            return;
        }
        this.pendingHeartbeatRef = this.makeRef();
        this.push({
            topic: 'phoenix',
            event: 'heartbeat',
            payload: {},
            ref: this.pendingHeartbeatRef,
        });
    }
}
exports.default = RealtimeClient;

},{"./RealtimeSubscription":22,"./lib/constants":24,"./lib/serializer":26,"./lib/timer":27,"websocket":48}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./lib/constants");
const push_1 = __importDefault(require("./lib/push"));
const timer_1 = __importDefault(require("./lib/timer"));
class RealtimeSubscription {
    constructor(topic, params = {}, socket) {
        this.topic = topic;
        this.params = params;
        this.socket = socket;
        this.bindings = [];
        this.state = constants_1.CHANNEL_STATES.closed;
        this.joinedOnce = false;
        this.pushBuffer = [];
        this.timeout = this.socket.timeout;
        this.joinPush = new push_1.default(this, constants_1.CHANNEL_EVENTS.join, this.params, this.timeout);
        this.rejoinTimer = new timer_1.default(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
        this.joinPush.receive('ok', () => {
            this.state = constants_1.CHANNEL_STATES.joined;
            this.rejoinTimer.reset();
            this.pushBuffer.forEach((pushEvent) => pushEvent.send());
            this.pushBuffer = [];
        });
        this.onClose(() => {
            this.rejoinTimer.reset();
            this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
            this.state = constants_1.CHANNEL_STATES.closed;
            this.socket.remove(this);
        });
        this.onError((reason) => {
            if (this.isLeaving() || this.isClosed()) {
                return;
            }
            this.socket.log('channel', `error ${this.topic}`, reason);
            this.state = constants_1.CHANNEL_STATES.errored;
            this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive('timeout', () => {
            if (!this.isJoining()) {
                return;
            }
            this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
            this.state = constants_1.CHANNEL_STATES.errored;
            this.rejoinTimer.scheduleTimeout();
        });
        this.on(constants_1.CHANNEL_EVENTS.reply, (payload, ref) => {
            this.trigger(this.replyEventName(ref), payload);
        });
    }
    rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout();
        if (this.socket.isConnected()) {
            this.rejoin();
        }
    }
    subscribe(timeout = this.timeout) {
        if (this.joinedOnce) {
            throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
        }
        else {
            this.joinedOnce = true;
            this.rejoin(timeout);
            return this.joinPush;
        }
    }
    onClose(callback) {
        this.on(constants_1.CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
        this.on(constants_1.CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
        this.bindings.push({ event, callback });
    }
    off(event) {
        this.bindings = this.bindings.filter((bind) => bind.event !== event);
    }
    canPush() {
        return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
            throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        }
        let pushEvent = new push_1.default(this, event, payload, timeout);
        if (this.canPush()) {
            pushEvent.send();
        }
        else {
            pushEvent.startTimeout();
            this.pushBuffer.push(pushEvent);
        }
        return pushEvent;
    }
    /**
     * Leaves the channel
     *
     * Unsubscribes from server events, and instructs channel to terminate on server.
     * Triggers onClose() hooks.
     *
     * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
     * channel.unsubscribe().receive("ok", () => alert("left!") )
     */
    unsubscribe(timeout = this.timeout) {
        this.state = constants_1.CHANNEL_STATES.leaving;
        let onClose = () => {
            this.socket.log('channel', `leave ${this.topic}`);
            this.trigger(constants_1.CHANNEL_EVENTS.close, 'leave', this.joinRef());
        };
        // Destroy joinPush to avoid connection timeouts during unscription phase
        this.joinPush.destroy();
        let leavePush = new push_1.default(this, constants_1.CHANNEL_EVENTS.leave, {}, timeout);
        leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
        leavePush.send();
        if (!this.canPush()) {
            leavePush.trigger('ok', {});
        }
        return leavePush;
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling before dispatching to the channel callbacks.
     * Must return the payload, modified or unmodified.
     */
    onMessage(event, payload, ref) {
        return payload;
    }
    isMember(topic) {
        return this.topic === topic;
    }
    joinRef() {
        return this.joinPush.ref;
    }
    sendJoin(timeout) {
        this.state = constants_1.CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
    }
    rejoin(timeout = this.timeout) {
        if (this.isLeaving()) {
            return;
        }
        this.sendJoin(timeout);
    }
    trigger(event, payload, ref) {
        let { close, error, leave, join } = constants_1.CHANNEL_EVENTS;
        let events = [close, error, leave, join];
        if (ref && events.indexOf(event) >= 0 && ref !== this.joinRef()) {
            return;
        }
        let handledPayload = this.onMessage(event, payload, ref);
        if (payload && !handledPayload) {
            throw 'channel onMessage callbacks must return the payload, modified or unmodified';
        }
        this.bindings
            .filter((bind) => {
            // Bind all events if the user specifies a wildcard.
            if (bind.event === '*') {
                return event === (payload === null || payload === void 0 ? void 0 : payload.type);
            }
            else {
                return bind.event === event;
            }
        })
            .map((bind) => bind.callback(handledPayload, ref));
    }
    replyEventName(ref) {
        return `chan_reply_${ref}`;
    }
    isClosed() {
        return this.state === constants_1.CHANNEL_STATES.closed;
    }
    isErrored() {
        return this.state === constants_1.CHANNEL_STATES.errored;
    }
    isJoined() {
        return this.state === constants_1.CHANNEL_STATES.joined;
    }
    isJoining() {
        return this.state === constants_1.CHANNEL_STATES.joining;
    }
    isLeaving() {
        return this.state === constants_1.CHANNEL_STATES.leaving;
    }
}
exports.default = RealtimeSubscription;

},{"./lib/constants":24,"./lib/push":25,"./lib/timer":27}],23:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformers = exports.RealtimeSubscription = exports.RealtimeClient = void 0;
const Transformers = __importStar(require("./lib/transformers"));
exports.Transformers = Transformers;
const RealtimeClient_1 = __importDefault(require("./RealtimeClient"));
exports.RealtimeClient = RealtimeClient_1.default;
const RealtimeSubscription_1 = __importDefault(require("./RealtimeSubscription"));
exports.RealtimeSubscription = RealtimeSubscription_1.default;

},{"./RealtimeClient":21,"./RealtimeSubscription":22,"./lib/transformers":28}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSPORTS = exports.CHANNEL_EVENTS = exports.CHANNEL_STATES = exports.SOCKET_STATES = exports.WS_CLOSE_NORMAL = exports.DEFAULT_TIMEOUT = exports.VSN = exports.DEFAULT_HEADERS = void 0;
const version_1 = require("./version");
exports.DEFAULT_HEADERS = { 'X-Client-Info': `realtime-js/${version_1.version}` };
exports.VSN = '1.0.0';
exports.DEFAULT_TIMEOUT = 10000;
exports.WS_CLOSE_NORMAL = 1000;
var SOCKET_STATES;
(function (SOCKET_STATES) {
    SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
    SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
    SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
    SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
})(SOCKET_STATES = exports.SOCKET_STATES || (exports.SOCKET_STATES = {}));
var CHANNEL_STATES;
(function (CHANNEL_STATES) {
    CHANNEL_STATES["closed"] = "closed";
    CHANNEL_STATES["errored"] = "errored";
    CHANNEL_STATES["joined"] = "joined";
    CHANNEL_STATES["joining"] = "joining";
    CHANNEL_STATES["leaving"] = "leaving";
})(CHANNEL_STATES = exports.CHANNEL_STATES || (exports.CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function (CHANNEL_EVENTS) {
    CHANNEL_EVENTS["close"] = "phx_close";
    CHANNEL_EVENTS["error"] = "phx_error";
    CHANNEL_EVENTS["join"] = "phx_join";
    CHANNEL_EVENTS["reply"] = "phx_reply";
    CHANNEL_EVENTS["leave"] = "phx_leave";
})(CHANNEL_EVENTS = exports.CHANNEL_EVENTS || (exports.CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function (TRANSPORTS) {
    TRANSPORTS["websocket"] = "websocket";
})(TRANSPORTS = exports.TRANSPORTS || (exports.TRANSPORTS = {}));

},{"./version":29}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../lib/constants");
class Push {
    /**
     * Initializes the Push
     *
     * @param channel The Channel
     * @param event The event, for example `"phx_join"`
     * @param payload The payload, for example `{user_id: 123}`
     * @param timeout The push timeout in milliseconds
     */
    constructor(channel, event, payload = {}, timeout = constants_1.DEFAULT_TIMEOUT) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.timeout = timeout;
        this.sent = false;
        this.timeoutTimer = undefined;
        this.ref = '';
        this.receivedResp = null;
        this.recHooks = [];
        this.refEvent = null;
    }
    resend(timeout) {
        this.timeout = timeout;
        this._cancelRefEvent();
        this.ref = '';
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
        this.send();
    }
    send() {
        if (this._hasReceived('timeout')) {
            return;
        }
        this.startTimeout();
        this.sent = true;
        this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload,
            ref: this.ref,
        });
    }
    receive(status, callback) {
        var _a;
        if (this._hasReceived(status)) {
            callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
        }
        this.recHooks.push({ status, callback });
        return this;
    }
    startTimeout() {
        if (this.timeoutTimer) {
            return;
        }
        this.ref = this.channel.socket.makeRef();
        this.refEvent = this.channel.replyEventName(this.ref);
        this.channel.on(this.refEvent, (payload) => {
            this._cancelRefEvent();
            this._cancelTimeout();
            this.receivedResp = payload;
            this._matchReceive(payload);
        });
        this.timeoutTimer = setTimeout(() => {
            this.trigger('timeout', {});
        }, this.timeout);
    }
    trigger(status, response) {
        if (this.refEvent)
            this.channel.trigger(this.refEvent, { status, response });
    }
    destroy() {
        this._cancelRefEvent();
        this._cancelTimeout();
    }
    _cancelRefEvent() {
        if (!this.refEvent) {
            return;
        }
        this.channel.off(this.refEvent);
    }
    _cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = undefined;
    }
    _matchReceive({ status, response, }) {
        this.recHooks
            .filter((h) => h.status === status)
            .forEach((h) => h.callback(response));
    }
    _hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
    }
}
exports.default = Push;

},{"../lib/constants":24}],26:[function(require,module,exports){
"use strict";
// This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
// License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
Object.defineProperty(exports, "__esModule", { value: true });
class Serializer {
    constructor() {
        this.HEADER_LENGTH = 1;
    }
    decode(rawPayload, callback) {
        if (rawPayload.constructor === ArrayBuffer) {
            return callback(this._binaryDecode(rawPayload));
        }
        if (typeof rawPayload === 'string') {
            return callback(JSON.parse(rawPayload));
        }
        return callback({});
    }
    _binaryDecode(buffer) {
        const view = new DataView(buffer);
        const decoder = new TextDecoder();
        return this._decodeBroadcast(buffer, view, decoder);
    }
    _decodeBroadcast(buffer, view, decoder) {
        const topicSize = view.getUint8(1);
        const eventSize = view.getUint8(2);
        let offset = this.HEADER_LENGTH + 2;
        const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
        offset = offset + topicSize;
        const event = decoder.decode(buffer.slice(offset, offset + eventSize));
        offset = offset + eventSize;
        const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
        return { ref: null, topic: topic, event: event, payload: data };
    }
}
exports.default = Serializer;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
 *
 * @example
 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *      return [1000, 5000, 10000][tries - 1] || 10000
 *    })
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 *    reconnectTimer.scheduleTimeout() // fires after 5000
 *    reconnectTimer.reset()
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 */
class Timer {
    constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = undefined;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
    }
    reset() {
        this.tries = 0;
        clearTimeout(this.timer);
    }
    // Cancels any previous scheduleTimeout and schedules callback
    scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.tries = this.tries + 1;
            this.callback();
        }, this.timerCalc(this.tries + 1));
    }
}
exports.default = Timer;

},{}],28:[function(require,module,exports){
"use strict";
/**
 * Helpers to convert the change Payload into native JS types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimestampString = exports.toArray = exports.toJson = exports.toIntRange = exports.toInt = exports.toFloat = exports.toDateRange = exports.toDate = exports.toBoolean = exports.convertCell = exports.convertColumn = exports.convertChangeData = exports.PostgresTypes = void 0;
// Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
// 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
var PostgresTypes;
(function (PostgresTypes) {
    PostgresTypes["abstime"] = "abstime";
    PostgresTypes["bool"] = "bool";
    PostgresTypes["date"] = "date";
    PostgresTypes["daterange"] = "daterange";
    PostgresTypes["float4"] = "float4";
    PostgresTypes["float8"] = "float8";
    PostgresTypes["int2"] = "int2";
    PostgresTypes["int4"] = "int4";
    PostgresTypes["int4range"] = "int4range";
    PostgresTypes["int8"] = "int8";
    PostgresTypes["int8range"] = "int8range";
    PostgresTypes["json"] = "json";
    PostgresTypes["jsonb"] = "jsonb";
    PostgresTypes["money"] = "money";
    PostgresTypes["numeric"] = "numeric";
    PostgresTypes["oid"] = "oid";
    PostgresTypes["reltime"] = "reltime";
    PostgresTypes["time"] = "time";
    PostgresTypes["timestamp"] = "timestamp";
    PostgresTypes["timestamptz"] = "timestamptz";
    PostgresTypes["timetz"] = "timetz";
    PostgresTypes["tsrange"] = "tsrange";
    PostgresTypes["tstzrange"] = "tstzrange";
})(PostgresTypes = exports.PostgresTypes || (exports.PostgresTypes = {}));
/**
 * Takes an array of columns and an object of string values then converts each string value
 * to its mapped type.
 *
 * @param {{name: String, type: String}[]} columns
 * @param {Object} records
 * @param {Object} options The map of various options that can be applied to the mapper
 * @param {Array} options.skipTypes The array of types that should not be converted
 *
 * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
 * //=>{ first_name: 'Paul', age: 33 }
 */
exports.convertChangeData = (columns, records, options = {}) => {
    let result = {};
    let skipTypes = typeof options.skipTypes !== 'undefined' ? options.skipTypes : [];
    Object.entries(records).map(([key, value]) => {
        result[key] = exports.convertColumn(key, columns, records, skipTypes);
    });
    return result;
};
/**
 * Converts the value of an individual column.
 *
 * @param {String} columnName The column that you want to convert
 * @param {{name: String, type: String}[]} columns All of the columns
 * @param {Object} records The map of string values
 * @param {Array} skipTypes An array of types that should not be converted
 * @return {object} Useless information
 *
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
 * //=> 33
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
 * //=> "33"
 */
exports.convertColumn = (columnName, columns, records, skipTypes) => {
    let column = columns.find((x) => x.name == columnName);
    if (!column || skipTypes.includes(column.type)) {
        return noop(records[columnName]);
    }
    else {
        return exports.convertCell(column.type, records[columnName]);
    }
};
/**
 * If the value of the cell is `null`, returns null.
 * Otherwise converts the string value to the correct type.
 * @param {String} type A postgres column type
 * @param {String} stringValue The cell value
 *
 * @example convertCell('bool', 't')
 * //=> true
 * @example convertCell('int8', '10')
 * //=> 10
 * @example convertCell('_int4', '{1,2,3,4}')
 * //=> [1,2,3,4]
 */
exports.convertCell = (type, stringValue) => {
    try {
        if (stringValue === null)
            return null;
        // if data type is an array
        if (type.charAt(0) === '_') {
            let arrayValue = type.slice(1, type.length);
            return exports.toArray(stringValue, arrayValue);
        }
        // If not null, convert to correct type.
        switch (type) {
            case PostgresTypes.abstime:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.bool:
                return exports.toBoolean(stringValue);
            case PostgresTypes.date:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.daterange:
                return exports.toDateRange(stringValue);
            case PostgresTypes.float4:
                return exports.toFloat(stringValue);
            case PostgresTypes.float8:
                return exports.toFloat(stringValue);
            case PostgresTypes.int2:
                return exports.toInt(stringValue);
            case PostgresTypes.int4:
                return exports.toInt(stringValue);
            case PostgresTypes.int4range:
                return exports.toIntRange(stringValue);
            case PostgresTypes.int8:
                return exports.toInt(stringValue);
            case PostgresTypes.int8range:
                return exports.toIntRange(stringValue);
            case PostgresTypes.json:
                return exports.toJson(stringValue);
            case PostgresTypes.jsonb:
                return exports.toJson(stringValue);
            case PostgresTypes.money:
                return exports.toFloat(stringValue);
            case PostgresTypes.numeric:
                return exports.toFloat(stringValue);
            case PostgresTypes.oid:
                return exports.toInt(stringValue);
            case PostgresTypes.reltime:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.time:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.timestamp:
                return exports.toTimestampString(stringValue); // Format to be consistent with PostgREST
            case PostgresTypes.timestamptz:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.timetz:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.tsrange:
                return exports.toDateRange(stringValue);
            case PostgresTypes.tstzrange:
                return exports.toDateRange(stringValue);
            default:
                // All the rest will be returned as strings
                return noop(stringValue);
        }
    }
    catch (error) {
        console.log(`Could not convert cell of type ${type} and value ${stringValue}`);
        console.log(`This is the error: ${error}`);
        return stringValue;
    }
};
const noop = (stringValue) => {
    return stringValue;
};
exports.toBoolean = (stringValue) => {
    switch (stringValue) {
        case 't':
            return true;
        case 'f':
            return false;
        default:
            return null;
    }
};
exports.toDate = (stringValue) => {
    return new Date(stringValue);
};
exports.toDateRange = (stringValue) => {
    let arr = JSON.parse(stringValue);
    return [new Date(arr[0]), new Date(arr[1])];
};
exports.toFloat = (stringValue) => {
    return parseFloat(stringValue);
};
exports.toInt = (stringValue) => {
    return parseInt(stringValue);
};
exports.toIntRange = (stringValue) => {
    let arr = JSON.parse(stringValue);
    return [parseInt(arr[0]), parseInt(arr[1])];
};
exports.toJson = (stringValue) => {
    return JSON.parse(stringValue);
};
/**
 * Converts a Postgres Array into a native JS array
 *
 * @example toArray('{1,2,3,4}', 'int4')
 * //=> [1,2,3,4]
 * @example toArray('{}', 'int4')
 * //=> []
 */
exports.toArray = (stringValue, type) => {
    // this takes off the '{' & '}'
    let stringEnriched = stringValue.slice(1, stringValue.length - 1);
    // converts the string into an array
    // if string is empty (meaning the array was empty), an empty array will be immediately returned
    let stringArray = stringEnriched.length > 0 ? stringEnriched.split(',') : [];
    let array = stringArray.map((string) => {
        return exports.convertCell(type, string);
    });
    return array;
};
/**
 * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
 * See https://github.com/supabase/supabase/issues/18
 *
 * @example toTimestampString('2019-09-10 00:00:00')
 * //=> '2019-09-10T00:00:00'
 */
exports.toTimestampString = (stringValue) => {
    return stringValue.replace(' ', 'T');
};

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
// generated by genversion
exports.version = '1.1.3';

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageClient = void 0;
const lib_1 = require("./lib");
class SupabaseStorageClient extends lib_1.StorageBucketApi {
    constructor(url, headers = {}) {
        super(url, headers);
    }
    /**
     * Perform file operation in a bucket.
     *
     * @param id The bucket id to operate on.
     */
    from(id) {
        return new lib_1.StorageFileApi(this.url, this.headers, id);
    }
}
exports.SupabaseStorageClient = SupabaseStorageClient;

},{"./lib":36}],31:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageClient = void 0;
const SupabaseStorageClient_1 = require("./SupabaseStorageClient");
Object.defineProperty(exports, "SupabaseStorageClient", { enumerable: true, get: function () { return SupabaseStorageClient_1.SupabaseStorageClient; } });
__exportStar(require("./lib/types"), exports);

},{"./SupabaseStorageClient":30,"./lib/types":37}],32:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageBucketApi = void 0;
const fetch_1 = require("./fetch");
const constants_1 = require("./constants");
class StorageBucketApi {
    constructor(url, headers = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
    }
    /**
     * Retrieves the details of all Storage buckets within an existing product.
     */
    listBuckets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.get(`${this.url}/bucket`, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Retrieves the details of an existing Storage bucket.
     *
     * @param id The unique identifier of the bucket you would like to retrieve.
     */
    getBucket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.get(`${this.url}/bucket/${id}`, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Creates a new Storage bucket
     *
     * @param id A unique identifier for the bucket you are creating.
     * @returns newly created bucket id
     */
    createBucket(id, options = { public: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/bucket`, { id, name: id, public: options.public }, { headers: this.headers });
                return { data: data.name, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Updates a new Storage bucket
     *
     * @param id A unique identifier for the bucket you are creating.
     */
    updateBucket(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.put(`${this.url}/bucket/${id}`, { id, name: id, public: options.public }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Removes all objects inside a single bucket.
     *
     * @param id The unique identifier of the bucket you would like to empty.
     */
    emptyBucket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
     * You must first `empty()` the bucket.
     *
     * @param id The unique identifier of the bucket you would like to delete.
     */
    deleteBucket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.remove(`${this.url}/bucket/${id}`, {}, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
}
exports.StorageBucketApi = StorageBucketApi;

},{"./constants":34,"./fetch":35}],33:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFileApi = void 0;
const fetch_1 = require("./fetch");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const DEFAULT_SEARCH_OPTIONS = {
    limit: 100,
    offset: 0,
    sortBy: {
        column: 'name',
        order: 'asc',
    },
};
const DEFAULT_FILE_OPTIONS = {
    cacheControl: '3600',
    contentType: 'text/plain;charset=UTF-8',
    upsert: false,
};
class StorageFileApi {
    constructor(url, headers = {}, bucketId) {
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
    }
    /**
     * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
     *
     * @param method HTTP method.
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     * @param fileOptions HTTP headers.
     * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
     * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
     * `upsert`: boolean, whether to perform an upsert.
     */
    uploadOrUpdate(method, path, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body;
                const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
                const headers = Object.assign(Object.assign({}, this.headers), (method === 'POST' && { 'x-upsert': String(options.upsert) }));
                if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                    body = new FormData();
                    body.append('cacheControl', options.cacheControl);
                    body.append('', fileBody);
                }
                else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                    body = fileBody;
                    body.append('cacheControl', options.cacheControl);
                }
                else {
                    body = fileBody;
                    headers['cache-control'] = `max-age=${options.cacheControl}`;
                    headers['content-type'] = options.contentType;
                }
                const _path = this._getFinalPath(path);
                const res = yield cross_fetch_1.default(`${this.url}/object/${_path}`, {
                    method,
                    body: body,
                    headers,
                });
                if (res.ok) {
                    // const data = await res.json()
                    // temporary fix till backend is updated to the latest storage-api version
                    return { data: { Key: _path }, error: null };
                }
                else {
                    const error = yield res.json();
                    return { data: null, error };
                }
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Uploads a file to an existing bucket.
     *
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     * @param fileOptions HTTP headers.
     * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
     * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
     * `upsert`: boolean, whether to perform an upsert.
     */
    upload(path, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
        });
    }
    /**
     * Replaces an existing file at the specified path with a new one.
     *
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     * @param fileOptions HTTP headers.
     * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
     * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
     * `upsert`: boolean, whether to perform an upsert.
     */
    update(path, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
        });
    }
    /**
     * Moves an existing file, optionally renaming it at the same time.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
     */
    move(fromPath, toPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Create signed url to download file without requiring permissions. This URL can be valid for a set number of seconds.
     *
     * @param path The file path to be downloaded, including the current file name. For example `folder/image.png`.
     * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
     */
    createSignedUrl(path, expiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _path = this._getFinalPath(path);
                let data = yield fetch_1.post(`${this.url}/object/sign/${_path}`, { expiresIn }, { headers: this.headers });
                const signedURL = `${this.url}${data.signedURL}`;
                data = { signedURL };
                return { data, error: null, signedURL };
            }
            catch (error) {
                return { data: null, error, signedURL: null };
            }
        });
    }
    /**
     * Downloads a file.
     *
     * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
     */
    download(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _path = this._getFinalPath(path);
                const res = yield fetch_1.get(`${this.url}/object/${_path}`, {
                    headers: this.headers,
                    noResolveJson: true,
                });
                const data = yield res.blob();
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Retrieve URLs for assets in public buckets
     *
     * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
     */
    getPublicUrl(path) {
        try {
            const _path = this._getFinalPath(path);
            const publicURL = `${this.url}/object/public/${_path}`;
            const data = { publicURL };
            return { data, error: null, publicURL };
        }
        catch (error) {
            return { data: null, error, publicURL: null };
        }
    }
    /**
     * Deletes files within the same bucket
     *
     * @param paths An array of files to be deletes, including the path and file name. For example [`folder/image.png`].
     */
    remove(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.remove(`${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Get file metadata
     * @param id the file id to retrieve metadata
     */
    // async getMetadata(id: string): Promise<{ data: Metadata | null; error: Error | null }> {
    //   try {
    //     const data = await get(`${this.url}/metadata/${id}`, { headers: this.headers })
    //     return { data, error: null }
    //   } catch (error) {
    //     return { data: null, error }
    //   }
    // }
    /**
     * Update file metadata
     * @param id the file id to update metadata
     * @param meta the new file metadata
     */
    // async updateMetadata(
    //   id: string,
    //   meta: Metadata
    // ): Promise<{ data: Metadata | null; error: Error | null }> {
    //   try {
    //     const data = await post(`${this.url}/metadata/${id}`, { ...meta }, { headers: this.headers })
    //     return { data, error: null }
    //   } catch (error) {
    //     return { data: null, error }
    //   }
    // }
    /**
     * Lists all the files within a bucket.
     * @param path The folder path.
     * @param options Search options, including `limit`, `offset`, and `sortBy`.
     * @param parameters Fetch parameters, currently only supports `signal`, which is an AbortController's signal
     */
    list(path, options, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || '' });
                const data = yield fetch_1.post(`${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    _getFinalPath(path) {
        return `${this.bucketId}/${path}`;
    }
}
exports.StorageFileApi = StorageFileApi;

},{"./fetch":35,"cross-fetch":46}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HEADERS = void 0;
const version_1 = require("./version");
exports.DEFAULT_HEADERS = { 'X-Client-Info': `storage-js/${version_1.version}` };

},{"./version":38}],35:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.put = exports.post = exports.get = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const handleError = (error, reject) => {
    if (typeof error.json !== 'function') {
        return reject(error);
    }
    error.json().then((err) => {
        return reject({
            message: _getErrorMessage(err),
            status: (error === null || error === void 0 ? void 0 : error.status) || 500,
        });
    });
};
const _getRequestParams = (method, options, parameters, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === 'GET') {
        return params;
    }
    params.headers = Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
    return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest(method, url, options, parameters, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            cross_fetch_1.default(url, _getRequestParams(method, options, parameters, body))
                .then((result) => {
                if (!result.ok)
                    throw result;
                if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                    return resolve(result);
                return result.json();
            })
                .then((data) => resolve(data))
                .catch((error) => handleError(error, reject));
        });
    });
}
function get(url, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('GET', url, options, parameters);
    });
}
exports.get = get;
function post(url, body, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('POST', url, options, parameters, body);
    });
}
exports.post = post;
function put(url, body, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('PUT', url, options, parameters, body);
    });
}
exports.put = put;
function remove(url, body, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest('DELETE', url, options, parameters, body);
    });
}
exports.remove = remove;

},{"cross-fetch":46}],36:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./StorageBucketApi"), exports);
__exportStar(require("./StorageFileApi"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./constants"), exports);

},{"./StorageBucketApi":32,"./StorageFileApi":33,"./constants":34,"./types":37}],37:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
// generated by genversion
exports.version = '0.0.0';

},{}],39:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./lib/constants");
const SupabaseAuthClient_1 = require("./lib/SupabaseAuthClient");
const SupabaseQueryBuilder_1 = require("./lib/SupabaseQueryBuilder");
const storage_js_1 = require("@supabase/storage-js");
const postgrest_js_1 = require("@supabase/postgrest-js");
const realtime_js_1 = require("@supabase/realtime-js");
const DEFAULT_OPTIONS = {
    schema: 'public',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    headers: constants_1.DEFAULT_HEADERS,
};
/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
class SupabaseClient {
    /**
     * Create a new client for use in the browser.
     * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
     * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
     * @param options.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
     * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
     * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
     * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
     * @param options.headers Any additional headers to send with each network request.
     * @param options.realtime Options passed along to realtime-js constructor.
     */
    constructor(supabaseUrl, supabaseKey, options) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        if (!supabaseUrl)
            throw new Error('supabaseUrl is required.');
        if (!supabaseKey)
            throw new Error('supabaseKey is required.');
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        this.restUrl = `${supabaseUrl}/rest/v1`;
        this.realtimeUrl = `${supabaseUrl}/realtime/v1`.replace('http', 'ws');
        this.authUrl = `${supabaseUrl}/auth/v1`;
        this.storageUrl = `${supabaseUrl}/storage/v1`;
        this.schema = settings.schema;
        this.auth = this._initSupabaseAuthClient(settings);
        this.realtime = this._initRealtimeClient(settings.realtime);
        // In the future we might allow the user to pass in a logger to receive these events.
        // this.realtime.onOpen(() => console.log('OPEN'))
        // this.realtime.onClose(() => console.log('CLOSED'))
        // this.realtime.onError((e: Error) => console.log('Socket error', e))
    }
    /**
     * Supabase Storage allows you to manage user-generated content, such as photos or videos.
     */
    get storage() {
        return new storage_js_1.SupabaseStorageClient(this.storageUrl, this._getAuthHeaders());
    }
    /**
     * Perform a table operation.
     *
     * @param table The table name to operate on.
     */
    from(table) {
        const url = `${this.restUrl}/${table}`;
        return new SupabaseQueryBuilder_1.SupabaseQueryBuilder(url, {
            headers: this._getAuthHeaders(),
            schema: this.schema,
            realtime: this.realtime,
            table,
        });
    }
    /**
     * Perform a function call.
     *
     * @param fn  The function name to call.
     * @param params  The parameters to pass to the function call.
     * @param count  Count algorithm to use to count rows in a table.
     *
     */
    rpc(fn, params, { count = null } = {}) {
        const rest = this._initPostgRESTClient();
        return rest.rpc(fn, params, { count });
    }
    /**
     * Removes an active subscription and returns the number of open connections.
     *
     * @param subscription The subscription you want to remove.
     */
    removeSubscription(subscription) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._closeSubscription(subscription);
                const openSubscriptions = this.getSubscriptions().length;
                if (!openSubscriptions) {
                    const { error } = yield this.realtime.disconnect();
                    if (error)
                        return resolve({ error });
                }
                return resolve({ error: null, data: { openSubscriptions } });
            }
            catch (error) {
                return resolve({ error });
            }
        }));
    }
    _closeSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!subscription.isClosed()) {
                yield this._closeChannel(subscription);
            }
        });
    }
    /**
     * Returns an array of all your subscriptions.
     */
    getSubscriptions() {
        return this.realtime.channels;
    }
    _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, localStorage, headers, }) {
        const authHeaders = {
            Authorization: `Bearer ${this.supabaseKey}`,
            apikey: `${this.supabaseKey}`,
        };
        return new SupabaseAuthClient_1.SupabaseAuthClient({
            url: this.authUrl,
            headers: Object.assign(Object.assign({}, headers), authHeaders),
            autoRefreshToken,
            persistSession,
            detectSessionInUrl,
            localStorage,
        });
    }
    _initRealtimeClient(options) {
        return new realtime_js_1.RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { apikey: this.supabaseKey }) }));
    }
    _initPostgRESTClient() {
        return new postgrest_js_1.PostgrestClient(this.restUrl, {
            headers: this._getAuthHeaders(),
            schema: this.schema,
        });
    }
    _getAuthHeaders() {
        var _a, _b;
        const headers = constants_1.DEFAULT_HEADERS;
        const authBearer = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
        headers['apikey'] = this.supabaseKey;
        headers['Authorization'] = `Bearer ${authBearer}`;
        return headers;
    }
    _closeChannel(subscription) {
        return new Promise((resolve, reject) => {
            subscription
                .unsubscribe()
                .receive('ok', () => {
                this.realtime.remove(subscription);
                return resolve(true);
            })
                .receive('error', (e) => reject(e));
        });
    }
}
exports.default = SupabaseClient;

},{"./lib/SupabaseAuthClient":41,"./lib/SupabaseQueryBuilder":42,"./lib/constants":44,"@supabase/postgrest-js":13,"@supabase/realtime-js":23,"@supabase/storage-js":31}],40:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseClient = exports.createClient = void 0;
const SupabaseClient_1 = __importDefault(require("./SupabaseClient"));
exports.SupabaseClient = SupabaseClient_1.default;
__exportStar(require("@supabase/gotrue-js"), exports);
__exportStar(require("@supabase/realtime-js"), exports);
/**
 * Creates a new Supabase Client.
 */
const createClient = (supabaseUrl, supabaseKey, options) => {
    return new SupabaseClient_1.default(supabaseUrl, supabaseKey, options);
};
exports.createClient = createClient;

},{"./SupabaseClient":39,"@supabase/gotrue-js":4,"@supabase/realtime-js":23}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthClient = void 0;
const gotrue_js_1 = require("@supabase/gotrue-js");
class SupabaseAuthClient extends gotrue_js_1.GoTrueClient {
    constructor(options) {
        super(options);
    }
}
exports.SupabaseAuthClient = SupabaseAuthClient;

},{"@supabase/gotrue-js":4}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseQueryBuilder = void 0;
const postgrest_js_1 = require("@supabase/postgrest-js");
const SupabaseRealtimeClient_1 = require("./SupabaseRealtimeClient");
class SupabaseQueryBuilder extends postgrest_js_1.PostgrestQueryBuilder {
    constructor(url, { headers = {}, schema, realtime, table, }) {
        super(url, { headers, schema });
        this._subscription = new SupabaseRealtimeClient_1.SupabaseRealtimeClient(realtime, schema, table);
        this._realtime = realtime;
    }
    /**
     * Subscribe to realtime changes in your databse.
     * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
     * @param callback A callback that will handle the payload that is sent whenever your database changes.
     */
    on(event, callback) {
        if (!this._realtime.isConnected()) {
            this._realtime.connect();
        }
        return this._subscription.on(event, callback);
    }
}
exports.SupabaseQueryBuilder = SupabaseQueryBuilder;

},{"./SupabaseRealtimeClient":43,"@supabase/postgrest-js":13}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseRealtimeClient = void 0;
const realtime_js_1 = require("@supabase/realtime-js");
class SupabaseRealtimeClient {
    constructor(socket, schema, tableName) {
        const topic = tableName === '*' ? `realtime:${schema}` : `realtime:${schema}:${tableName}`;
        this.subscription = socket.channel(topic);
    }
    getPayloadRecords(payload) {
        const records = {
            new: {},
            old: {},
        };
        if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
            records.new = realtime_js_1.Transformers.convertChangeData(payload.columns, payload.record);
        }
        if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
            records.old = realtime_js_1.Transformers.convertChangeData(payload.columns, payload.old_record);
        }
        return records;
    }
    /**
     * The event you want to listen to.
     *
     * @param event The event
     * @param callback A callback function that is called whenever the event occurs.
     */
    on(event, callback) {
        this.subscription.on(event, (payload) => {
            let enrichedPayload = {
                schema: payload.schema,
                table: payload.table,
                commit_timestamp: payload.commit_timestamp,
                eventType: payload.type,
                new: {},
                old: {},
            };
            enrichedPayload = Object.assign(Object.assign({}, enrichedPayload), this.getPayloadRecords(payload));
            callback(enrichedPayload);
        });
        return this;
    }
    /**
     * Enables the subscription.
     */
    subscribe(callback = () => { }) {
        this.subscription.onError((e) => callback('SUBSCRIPTION_ERROR', e));
        this.subscription.onClose(() => callback('CLOSED'));
        this.subscription
            .subscribe()
            .receive('ok', () => callback('SUBSCRIBED'))
            .receive('error', (e) => callback('SUBSCRIPTION_ERROR', e))
            .receive('timeout', () => callback('RETRYING_AFTER_TIMEOUT'));
        return this.subscription;
    }
}
exports.SupabaseRealtimeClient = SupabaseRealtimeClient;

},{"@supabase/realtime-js":23}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HEADERS = void 0;
// constants.ts
const version_1 = require("./version");
exports.DEFAULT_HEADERS = { 'X-Client-Info': `supabase-js/${version_1.version}` };

},{"./version":45}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
// generated by genversion
exports.version = '1.22.6';

},{}],46:[function(require,module,exports){
var global = typeof self !== 'undefined' ? self : this;
var __self__ = (function () {
function F() {
this.fetch = false;
this.DOMException = global.DOMException
}
F.prototype = global;
return new F();
})();
(function(self) {

var irrelevant = (function (exports) {

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
})(__self__);
__self__.fetch.ponyfill = true;
// Remove "polyfill" property added by whatwg-fetch
delete __self__.fetch.polyfill;
// Choose between native implementation (global) or custom implementation (__self__)
// var ctx = global.fetch ? global : __self__;
var ctx = __self__; // this line disable service worker support temporarily
exports = ctx.fetch // To enable: import fetch from 'cross-fetch'
exports.default = ctx.fetch // For TypeScript consumers without esModuleInterop.
exports.fetch = ctx.fetch // To enable: import {fetch} from 'cross-fetch'
exports.Headers = ctx.Headers
exports.Request = ctx.Request
exports.Response = ctx.Response
module.exports = exports

},{}],47:[function(require,module,exports){
var naiveFallback = function () {
	if (typeof self === "object" && self) return self;
	if (typeof window === "object" && window) return window;
	throw new Error("Unable to resolve global `this`");
};

module.exports = (function () {
	if (this) return this;

	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

	// Fallback to standard globalThis if available
	if (typeof globalThis === "object" && globalThis) return globalThis;

	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
	// In all ES5+ engines global object inherits from Object.prototype
	// (if you approached one that doesn't please report)
	try {
		Object.defineProperty(Object.prototype, "__global__", {
			get: function () { return this; },
			configurable: true
		});
	} catch (error) {
		// Unfortunate case of updates to Object.prototype being restricted
		// via preventExtensions, seal or freeze
		return naiveFallback();
	}
	try {
		// Safari case (window.__global__ works, but __global__ does not)
		if (!__global__) return naiveFallback();
		return __global__;
	} finally {
		delete Object.prototype.__global__;
	}
})();

},{}],48:[function(require,module,exports){
var _globalThis;
if (typeof globalThis === 'object') {
	_globalThis = globalThis;
} else {
	try {
		_globalThis = require('es5-ext/global');
	} catch (error) {
	} finally {
		if (!_globalThis && typeof window !== 'undefined') { _globalThis = window; }
		if (!_globalThis) { throw new Error('Could not determine global this'); }
	}
}

var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;
var websocket_version = require('./version');


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new NativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new NativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}
if (NativeWebSocket) {
	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
		Object.defineProperty(W3CWebSocket, prop, {
			get: function() { return NativeWebSocket[prop]; }
		});
	});
}

/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};

},{"./version":49,"es5-ext/global":47}],49:[function(require,module,exports){
module.exports = require('../package.json').version;

},{"../package.json":50}],50:[function(require,module,exports){
module.exports={
  "_from": "websocket@^1.0.34",
  "_id": "websocket@1.0.34",
  "_inBundle": false,
  "_integrity": "sha512-PRDso2sGwF6kM75QykIesBijKSVceR6jL2G8NGYyq2XrItNC2P5/qL5XeR056GhA+Ly7JMFvJb9I312mJfmqnQ==",
  "_location": "/websocket",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "websocket@^1.0.34",
    "name": "websocket",
    "escapedName": "websocket",
    "rawSpec": "^1.0.34",
    "saveSpec": null,
    "fetchSpec": "^1.0.34"
  },
  "_requiredBy": [
    "/@supabase/realtime-js"
  ],
  "_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.34.tgz",
  "_shasum": "2bdc2602c08bf2c82253b730655c0ef7dcab3111",
  "_spec": "websocket@^1.0.34",
  "_where": "/home/mahboob/code/p/CommunityHub/node_modules/@supabase/realtime-js",
  "author": {
    "name": "Brian McKelvey",
    "email": "theturtle32@gmail.com",
    "url": "https://github.com/theturtle32"
  },
  "browser": "lib/browser.js",
  "bugs": {
    "url": "https://github.com/theturtle32/WebSocket-Node/issues"
  },
  "bundleDependencies": false,
  "config": {
    "verbose": false
  },
  "contributors": [
    {
      "name": "Iñaki Baz Castillo",
      "email": "ibc@aliax.net",
      "url": "http://dev.sipdoc.net"
    }
  ],
  "dependencies": {
    "bufferutil": "^4.0.1",
    "debug": "^2.2.0",
    "es5-ext": "^0.10.50",
    "typedarray-to-buffer": "^3.1.5",
    "utf-8-validate": "^5.0.2",
    "yaeti": "^0.0.6"
  },
  "deprecated": false,
  "description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
  "devDependencies": {
    "buffer-equal": "^1.0.0",
    "gulp": "^4.0.2",
    "gulp-jshint": "^2.0.4",
    "jshint": "^2.0.0",
    "jshint-stylish": "^2.2.1",
    "tape": "^4.9.1"
  },
  "directories": {
    "lib": "./lib"
  },
  "engines": {
    "node": ">=4.0.0"
  },
  "homepage": "https://github.com/theturtle32/WebSocket-Node",
  "keywords": [
    "websocket",
    "websockets",
    "socket",
    "networking",
    "comet",
    "push",
    "RFC-6455",
    "realtime",
    "server",
    "client"
  ],
  "license": "Apache-2.0",
  "main": "index",
  "name": "websocket",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theturtle32/WebSocket-Node.git"
  },
  "scripts": {
    "gulp": "gulp",
    "test": "tape test/unit/*.js"
  },
  "version": "1.0.34"
}

},{}]},{},[1]);
