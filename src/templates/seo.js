import React, { useCallback, useContext } from "react";
// import firebase from "firebase/app";
import Helmet from "react-helmet"


// lag dei 1220 x 630

function SEO() {

  return (
    <Helmet>
      <title>FileParty</title>
      <meta property="og:title" content="FileParty" />
      <meta name="twitter:title" content="FileParty " />
      <meta name="title" content="FileParty" />

      <meta name="description" content="FileParty is the best app for watching movies together" />
      <meta property="og:description" content="FileParty is the best app for watching movies together" />
      <meta name="twitter:description" content=" FileParty is the best app for watching movies together" />

      <meta property="og:image" content="https://fileparty.co/fileparty-screenshot.png" />
      <meta name="twitter:image" content="https://fileparty.co/fileparty-screenshot.png" />
      
      <meta property="og:site_name" content="European Travel, Inc." />
      <meta name="twitter:card" content="summary_large_image" />


      <meta
        name="twitter:creator"
        content={"larskarbo"}
      />
    </Helmet>
  );
}


export default SEO;
