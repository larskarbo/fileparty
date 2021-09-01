import { Link } from "gatsby";
import React from "react";

function Layout({ children }) {
  return (
    <div className="flex flex-col bg-gradient-to-tr justify-center  from-gray-100 pt-0 to-yellow-50 flex-grow min-h-screen p-2 md:p-12">
      <div className=" py-4">
        <div className="w-12">
          <Link to="/">
            <img className="w-12" src={"/logo.svg"} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-grow">{children}</div>
    </div>
  );
}

export default Layout;
