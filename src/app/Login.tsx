import { UserContext } from "../templates/FirebaseInit";
import Layout from "./Layout";
import { graphql, navigate, useStaticQuery } from "gatsby";
import React, { useContext, useState, useRef, useEffect } from "react";
import GatsbyImage from "gatsby-image";
import firebase from 'firebase/app';

function Login({user}) {
  const data = useStaticQuery(graphql`
  {
    pb: file(relativePath: { eq: "pb.jpeg" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
  `)
  const [updates, setUpdates] = useState(true)
  const yoRef = useRef()
  const isGoogle = (user && !user.isAnonymous)

  if(isGoogle){
    
  }

  useEffect(() => {
    if(isGoogle){
      navigate("/create", {replace: true})
    }
  }, [isGoogle])


  return (
    <Layout>
      <div className="flex flex-col flex-grow items-center">
        <div
          className={
            "flex flex-col flex-grow-0 p-12 max-w-md  w-full rounded bg-white  border border-gray-300 shadow-lg "
          }
        >
          <div className="flex flex-row items-center text mb-3">
            <GatsbyImage fixed={data.pb.childImageSharp.fixed} className="flex-shrink-0 rounded-full mr-3" />
            👋 Thanks for checking out FileParty
          </div>
          <div className="mb-3 text-xs">
            FileParty will do it's best, but it is still early so it has some faults. If you want, subscribe to get email updates:
          </div>
          <label className="flex items-center pb-2">
            <input type="checkbox" ref={yoRef} className="rounded" checked={updates} onChange={e => setUpdates(e.target.checked)} />
            <span className="ml-2">
              FileParty updates
            </span>
          </label>
          {/* <label className="flex items-center pb-2">
            <input type="checkbox" className="rounded" />
            <span className="ml-2">
              Larskarbo launch updates 🚀
            </span>
          </label> */}
          <button className="rounded mt-4 text-center font-normal p-3 px-5  bg-blue-500 text-white"

            onClick={() => {
              firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (result) {
                console.log("🚀 ~ result", result)
                if(yoRef.current.checked){
                fetch("/.netlify/functions/newsletter", { method: "POST", body: JSON.stringify({ email: result.user.email }) })
                  .then(a => {
                    console.log("🚀 ~ a", a)

                  })
                  .catch(err => {
                    console.log("🚀 ~ err", err)

                  })
                }

                // if(yoRef.current.checked){
                //   var formdata = new FormData();
                //   formdata.append("api_key", "ZjpxszTpvyuzLR2lmbyV");
                //   formdata.append("email", result.user.email);
                //   formdata.append("list", "D2bQiPtCtKgJh763Erye3NGA");

                //   var requestOptions = {
                //     method: 'POST',
                //     body: formdata,
                //     redirect: 'follow'
                //   };

                //   fetch("https://lesto.larskarbo.no/subscribe", requestOptions)
                //     .then(response => response.text())
                //     .then(result => console.log(result))
                //     .catch(error => console.log('error', error));
                // }
                // // This gives you a Google Access Token. You can use it to access the Google API.
                // var token = result.credential.accessToken;
                // // The signed-in user info.
                // var user = result.user;
                // ...
              })
            }}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
