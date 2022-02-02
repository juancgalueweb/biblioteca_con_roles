import { createContext, useState } from "react";

export const EnrollUserContext = createContext();

export const EnrollUserProvider = (props) => {
  const [enrollUser, setEnrollUser] = useState({});

  return (
    <EnrollUserContext.Provider value={{ enrollUser, setEnrollUser }}>
      {props.children}
    </EnrollUserContext.Provider>
  );
};
