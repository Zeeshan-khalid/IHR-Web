import { useState, useEffect } from 'react';
import { app, db } from '../firebaseConfig';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import useAuthContext from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/helpers';

export default function Login() {
  const auth = getAuth();
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const AuthContext = useAuthContext();
  const [disabledForm, setDisabledForm] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState('valid');
  const [isValidPassword, setIsValidPassword] = useState('valid');
  const [accountDoesNotExist, setAccountDoesNotExist] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState('password');

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((response) => {
      setUserData(response.user);
    }).catch((error) => {
      if (error.code === 'auth/user-not-found') {
        setAccountDoesNotExist(true);
      }
    })
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((response) => {
      setUserData(response.user);
    });
  };

  const onChangeInputType = () => {
    console.log('cambiamos el input type');
    setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password');
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        router.push('/home');
      }
    });

    unsubscribe();
  }, []);

  useEffect(() => {
    const sendData = async () => {
      try {
        const docData = {
          nickname: userData.displayName,
          phoneNumber: null,
          email: userData.email,
          emailState: userData.emailVerified,
          address: null,
          zipcode: null,
          dateOfBirth: null,
          gender: null,
          userID: userData.uid,
          creationDate: new Date(),
          modifiedDate: new Date(),
          dismissedWhatsNewCardIds: null,
          readOfferIds: null,
          linkedRetailerAccounts: null,
          avatarPath: userData.photoURL
        };
        const docRef = doc(db, 'users', userData.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setDoc(docRef, docData);
        } else {
          const data = docSnap.data();
          AuthContext.set(data);
        }

        router.push('/home');
      } catch (error) {
        console.log(error);
      }
    };
    if (userData) {
      sendData();
    }
  }, [userData]);

  useEffect(() => {
    const isValidForm = () => {
      if (validateEmail(email) && validatePassword(password)) {
        setDisabledForm(false);
      } else {
        setDisabledForm(true);
      }
    }

    isValidForm();
  }, [email, password]);

  useEffect(() => {
    const isValidAccount = () => {
      if (email !== '' || password !== '') {
        if (email.length >= 1) {
          setIsValidEmail(validateEmail(email) ? 'valid' : 'error');
        } else {
          setIsValidEmail('valid');
        }
        if (password.length >= 1) {
          setIsValidPassword(validatePassword(password) ? 'valid' : 'error');
        } else {
          setIsValidPassword('valid');
        }
      }
    }

    isValidAccount();
  }, [email, password]);

  return (
    <div>
      <div className="h-screen flex">
        <div className="flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
          <div>
            <h1 className="text-white font-bold text-3xl font-sans text-center">
              Illustration logo here
            </h1>
            <h1 className="text-white mt-5 font-bold text-2xl font-sans text-center">
              Lorem Ipsum
            </h1>
            <div className="carousel w-full">
              <div
                id="item1"
                className="carousel-item w-full text-white text-center"
              >
                <p className="mx-auto mt-3 mb-4 text-lg">
                  Lorem ipsum, dolor sit amet consectetur <br /> adipisicing
                  elit adipisicing elit.
                </p>
              </div>
              <div
                id="item2"
                className="carousel-item w-full text-white text-center"
              >
                <p className="mx-auto mt-3 mb-4 text-lg">
                  Lorem ipsum, dolor sit amet consectetur <br /> adipisicing
                  elit adipisicing elit.
                </p>
              </div>
              <div
                id="item3"
                className="carousel-item w-full text-white text-center"
              >
                <p className="mx-auto mt-3 mb-4 text-lg">
                  Lorem ipsum, dolor sit amet consectetur <br /> adipisicing
                  elit adipisicing elit.
                </p>
              </div>
              <div
                id="item4"
                className="carousel-item w-full text-white text-center"
              >
                <p className="mx-auto mt-3 mb-4 text-lg">
                  Lorem ipsum, dolor sit amet consectetur <br /> adipisicing
                  elit adipisicing elit.
                </p>
              </div>
            </div>
            <div className="flex justify-center w-full py-2 gap-2">
              <a href="#item1" className="btn btn-x-s bg-white"></a>
              <a href="#item2" className="btn btn-x-s bg-white"></a>
              <a href="#item3" className="btn btn-x-s bg-white"></a>
              <a href="#item4" className="btn btn-x-s bg-white"></a>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 justify-center items-center bg-white">
          <div className="bg-base-100">
            <div className="create">
              <h1 className="text-center text-4xl font-semibold text-[#6A2FE8]">
                Hello Again
              </h1>
              <p className="mt-3 mb-5 info text-center text-base">
                Please enter your account information to login
              </p>
              <div className="m-5">
                <div className="form-control">

                  <label className="label">
                    {accountDoesNotExist &&
                      <p className="text-sm text-error list-none">
                        <label>⨉ </label>  The account doesnt exist. Enter a different account.
                      </p>
                    }
                  </label>

                  {isValidEmail === 'error' && <label className="label flex justify-center">
                    <div
                      className={`tooltip tooltip-open tooltip-error`}
                      data-tip="Your account is incorrect."
                    ></div></label>}

                  <label className="input-group">
                    <input
                      type="email"
                      placeholder="info@site.com"
                      className="input input-bordered"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <span>
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  {isValidPassword === 'error' ? (<label className="label flex justify-center">
                    <div
                      className={`tooltip tooltip-open tooltip-error`}
                      data-tip="Your password is incorrect."
                    ></div></label>) : (<label className="label"></label>)}
                  <label className="input-group">
                    <input
                      type={passwordInputType}
                      placeholder="*********"
                      className="input input-bordered"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                    <span className="cursor-pointer" onClick={() => onChangeInputType()}>
                      <svg
                        className={`h-6 w-6 ${passwordInputType === 'password' ? 'text-gray-400' : 'text-[#262626]'}`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <circle cx="12" cy="12" r="2" />{" "}
                        <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />{" "}
                        <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                      </svg>
                    </span>
                  </label>
                </div>

                <div className="text-center">
                  <button
                    onClick={signIn}
                    className="mt-5 btn btn-block text-base signup"
                    disabled={disabledForm}
                  >
                    Login
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={signInWithGoogle}
                    className="mt-5 btn btn-block text-base signup"
                  >
                    Sign In with google
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#9ca3af] text-base">
                Dont have an account yet?
                <a
                  className="font-semibold text-[#6A2FE8] text-base"
                  href={"/register"}
                >
                  {" "}
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
