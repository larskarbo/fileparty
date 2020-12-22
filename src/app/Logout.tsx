import { UserContext } from "../templates/FirebaseInit";
import Layout from "./Layout";
import { graphql, navigate, useStaticQuery } from "gatsby";
import React, { useContext, useState ,useEffect} from "react";
import GatsbyImage from "gatsby-image";
import firebase from 'firebase/app';

function Logout({ }) {
  useEffect(() => {
    firebase.auth().signOut().then(function (result) {
      console.log("🚀 ~ result", result)
      navigate("/", {replace: true})
      // // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // // The signed-in user info.
      // var user = result.user;
      // ...
    })
  }, [])

  return (
    <Layout>
      logging out...
    </Layout>
  );
}

export default Logout;
