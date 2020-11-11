import React, { Component } from "react";
import Profile from "./Profile";
import ProfileList from "./ProfileList";
import "./ProfileView.css";

import axios from "axios";

class ProfileView extends Component {
  state = {
    currentView: "SUGGESTIONS",
    userList: [
      { id: 1, name: "test name", handle: "test handle 2" ,pImage:"profile.png" },
      { id: 2, name: "test name", handle: "test handle 2" , pImage:"profile.png" },
      { id: 3, name: "test name", handle: "test handle 2" , pImage:"profile.png" },
    ],
  };

  changeView = async (view)=>{
    if (view == "SUGGESTIONS" && this.state.currentView != "SUGGESTIONS") {
      let userObj = await axios.get("https://insta-backend-api.herokuapp.com/user/80b5f987-6e55-4264-9245-5fd75faa92e7");
      userObj = userObj.data.user;  // user details

      let followingObj = await axios.get("https://insta-backend-api.herokuapp.com/user/follower/80b5f987-6e55-4264-9245-5fd75faa92e7");
      followingObj = followingObj.data.data; // user ki followering

      let follow_arr = [];  //user ki following ki uid
      for (let i = 0; i < followingObj.length && i < 2; i++) {
        follow_arr.push(followingObj[i].uid);
      }


      let followrs = []; //suggestion

      for (let i = 0; i < follow_arr.length; i++) {
        let suggestionObj = await axios.get("https://insta-backend-api.herokuapp.com/user/follower/" + follow_arr[i]);  //following ki following
        suggestionObj = suggestionObj.data.data;   //following ki following ki details

        let followrs_check = suggestionObj.map((obj) => {       //validate suggestions 
          return obj.uid != userObj.uid && followingObj.every((followers) => {
            return followers.uid != obj.uid;
          });
        })

        for(let j =0; j<followrs_check.length;j++){       //adding suggestions
          if(followrs_check[j]==true) followrs.push(suggestionObj[j]);
        }

      }
    let suggestions = [];
    for(let i=0;i<followrs.length;i++){
      suggestions.push({
        id : i+1,
        name : followrs[i].name,
        handle: followrs[i].handle
      })
    };


      this.setState({
        currentView: view,
        userList: suggestions
      })
    }
      else if(view == "REQUESTS" && this.state.currentView != "REQUESTS"){
        let requestObj = await axios.get("https://insta-backend-api.herokuapp.com/user/request/80b5f987-6e55-4264-9245-5fd75faa92e7")
        let pendingRequests = requestObj.data.data;
        this.setState({
            currentView :view,
            userList : pendingRequests
        })
      }
      else if(view == "FOLLOWING" && this.state.currentView != "FOLLOWING"){
        let followingObj =await axios.get("https://insta-backend-api.herokuapp.com/user/following/80b5f987-6e55-4264-9245-5fd75faa92e7")
        let following = followingObj.data.data;
        this.setState({
            currentView :view,
            userList : following
        })
      }
      else if(view == "FOLLOWERS" && this.state.currentView != "FOLLOWERS"){
        let followerObj =await axios.get("https://insta-backend-api.herokuapp.com/user/follower/80b5f987-6e55-4264-9245-5fd75faa92e7")
        let followers = followerObj.data.data;
        this.setState({
            currentView :view,
            userList : followers
        })
      }
  }

  render() {
    return (
      <div className="profile-view">
        <Profile changeViewHandler = {this.changeView} />
        <ProfileList
          view={this.state.currentView}
          userList={this.state.userList}
        />
        
      </div>
    );
  }
}

export default ProfileView;
