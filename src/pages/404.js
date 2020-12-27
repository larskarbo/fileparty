import React, { useCallback, useContext } from "react";
import Layout from '../app/Layout';

function NotFound() {


  return (
    <Layout>
      <div className="flex flex-col flex-grow items-center">
        <div
          className={
            "flex flex-col flex-grow-0 p-12 max-w-md  w-full rounded bg-white  border border-gray-300 shadow-lg "
          }
        >
          404 not found
        </div>
      </div>
    </Layout>

  );
}

export default NotFound;
