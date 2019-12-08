import React, { Component } from "react";
import "./App.css";
import Amplify, { Auth, Hub } from "aws-amplify";
import { withOAuth } from "aws-amplify-react";
import aws_exports from "./aws-exports";

import http from './http'

Amplify.configure(aws_exports);
const oauth = {
  domain: "login-dev.com",
  scope: [
    "phone",
    "email",
    "openid",
  ],
  redirectSignIn: "http://localhost:3000/",
  redirectSignOut: "http://localhost:3000/",
  responseType: "token",

  options: {
    AdvancedSecurityDataCollectionFlag: true
  }
};

Auth.configure({
  oauth: oauth
});

class App extends Component {
  state = { user: null, customState: null };
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    Hub.listen("auth", ( payload) => {
      console.log(payload.payload.event, payload.payload.data);
    });

    Auth.currentAuthenticatedUser()
       .then(user => {
         console.log("---user---", user);
         this.setState({ user });
       })
       .catch(() => console.log("Not signed in"));
  }
  async signIn() {
    Auth.federatedSignIn();
  }
  async adminCall() {
       const a= await http.get("int-user/")
       console.log(a)
  }
  async getSession() {}
  render() {
    return (
      <div className="App">
        <br></br>
        <br></br>
        <button onClick={() => this.signIn()}>Sign in</button>
        <button onClick={() => Auth.signOut()}>Sign Out</button>
        <br></br>
        <br></br>
        <button onClick={() => this.adminCall()}>Admin Lambda</button>
        <button onClick={() => this.getSession()}>User Lambda</button>
      </div>
    );
  }
}

export default withOAuth(App);
