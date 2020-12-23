

// context:

import React from "react";
import FirebaseInit from "./src/templates/FirebaseInit"
export const wrapRootElement = ({ element }) => (
  <FirebaseInit>{element}</FirebaseInit>
)