import React, { useCallback, useContext } from "react";
// import firebase from "firebase/app";
import Helmet from "react-helmet"


// lag dei 1220 x 630

function SEO({
  title="FileParty - Watch Local Files Together"
}) {

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="title" content={title} />

      <meta name="description" content="Watch local files together in real time. Drag and drop any file and it will be transfered to everyone. Be on the same page" />
      <meta property="og:description" content="Watch local files together in real time. Drag and drop any file and it will be transfered to everyone. Be on the same page" />
      <meta name="twitter:description" content=" Watch local files together in real time. Drag and drop any file and it will be transfered to everyone. Be on the same page" />

      <meta property="og:image" content="https://fileparty.co/fileparty-screenshot.png" />
      <meta name="twitter:image" content="https://fileparty.co/fileparty-screenshot.png" />
      
      <meta property="og:site_name" content="FileParty" />
      <meta name="twitter:card" content="summary_large_image" />


      <meta
        name="twitter:creator"
        content={"larskarbo"}
      />
    </Helmet>
  );
}


export default SEO;
