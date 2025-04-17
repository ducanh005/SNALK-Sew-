"use strict";
window.ACCESS_POINT= "https://api.edamam.com/api/recipes/v2"
const APP_ID="4abc1c7b";
const API_KEY="0f7e7debf83f5efb31cf79bae8398e83";
const TYPE="public";
const USER_ID="hirnam"
export const fetchData=async function (queries, successCallback){
    const query=queries?.join("&")
    .replace(/,/g,"=")
    .replace(/ /g,"%20")
    .replace(/\+/g,"%2B")
    const url=`${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}`:""}`;
    const response=await fetch(url,{
        headers: {
            "Edamam-Account-User": USER_ID,  // Thêm userID vào header
        }
    })
    if(response.ok){
        const data=await response.json();
        successCallback(data);
    }
}

