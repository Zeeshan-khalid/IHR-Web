import React, { createContext, useReducer, useMemo, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import JWT from "expo-jwt";
import db from "../../firebaseConfig";
const AuthContext = createContext({});

export const AuthProvider = ({ children, ...props }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    firebaseToken: null,
    encodedToken: null,
    userId: null,
    apiKey: process.env.API_KEY,
  });
  const auth = getAuth();



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (state.user === null) {
          try {
            const docRef = doc(db, "users", auth.currentUser.uid);

            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              dispatch({
                type: "SET_SESSION",
                user: data,
                firebaseToken: auth.currentUser.accessToken,
                encodedToken: enconded(auth.currentUser.uid),
                userId: auth.currentUser.uid,
              });
            } else {
              dispatch({
                type: "SET_TOKENS",
                firebaseToken: auth?.currentUser?.accessToken,
                encodedToken: enconded(auth?.currentUser?.uid),
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        dispatch({ type: "CLEAR_SESSION" });
      }
    });

    unsubscribe();
  }, []);

  const authContext = useMemo(
    () => ({
      set: async (data) => {
        dispatch({
          type: "SET_SESSION",
          user: data,
          firebaseToken: data.accessToken,
          encodedToken: enconded(data.uid),
          userId: data.uid,
        });
      },
      setUser: async (data) => {
        dispatch({ type: "SET_USER", user: data });
      },
      clear: async () => {
        logout(auth);
        dispatch({ type: "CLEAR_SESSION" });
      },
      user: state.user,
      firebaseToken: state.firebaseToken,
      encodedToken: state.encodedToken,
      userId: state.userId,
      apiKey: state.apiKey,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={authContext} {...props}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.element,
};

const authReducer = (prevState, action) => {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...prevState,
        user: action.user,
        firebaseToken: action.firebaseToken,
        encodedToken: action.encodedToken,
        userId: action.userId,
      };
    case "SET_USER":
      return {
        ...prevState,
        user: action.user,
      };
    case "SET_TOKENS":
      return {
        ...prevState,
        encodedToken: action.encodedToken,
        firebaseToken: action.firebaseToken,
      };
    case "CLEAR_SESSION":
      return {
        ...prevState,
        user: null,
        firebaseToken: null,
        encodedToken: null,
        userId: null,
      };
    default:
      return {
        ...prevState,
        user: null,
        firebaseToken: null,
        encodedToken: null,
        userId: null,
      };
  }
};

const logout = async (auth) => {
  signOut(auth)
    .then(() => {
      console.log("User logget out");
    })
    .catch((error) => {
      console.log("Logout Error");
      console.log(error);
    });
};

const enconded = (id) => {
  const data = {
    userId: id,
    sub: "com.ihatereceipts.web",
  };
  const key = process.env.SECRET_JWT_KEY;
  const myEncodedToken = JWT.encode(data, key, {
    algorithm: "HS256",
  });
  return myEncodedToken;
};

export default AuthContext;
