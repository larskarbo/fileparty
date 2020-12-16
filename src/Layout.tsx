import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.svg"


function Layout({children}) {

  return (
    <div className="flex flex-col bg-gradient-to-tr  from-gray-100 pt-0 to-yellow-50 flex-grow h-screen p-12"
    //  {...getRootProps()}
    >
      <div className=" py-4">
        <Link to="/">
          <img className="w-12" src={logo} />

        </Link>
      </div>

      {children}
    </div>
  );
}

export default Layout;
