import db from '../firebaseConfig';
import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { validateEmail, validatePassword } from '../utils/helpers';

export default function Register() {
  const auth = getAuth();
  const router = useRouter(); // eslint-disable-line react-hooks/exhaustive-deps
  const googleProvider = new GoogleAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [colorPassword, setColorPassword] = useState('#A6A6A6');
  const [valid, setValid] = useState('[#A6A6A6]');
  const [list, setList] = useState('disc');
  const [userData, setUserData] = useState(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [accountAlreadyExist, setAccountAlreadyExist] = useState(false);

  const onChangeEmail = (value) => {
    setEmail(value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 6 && e.target.value.length < 100) {
      setColorPassword('#25A248');
    } else {
      setColorPassword('#A6A6A6');
    }
    if (e.target.value.length > 0 && !validatePassword(e.target.value)) {
      setValid('error');
      setList('none');
    } else {
      setValid('[#A6A6A6]');
      setList('disc');
    }
  }

  useEffect(() => {
    const isValidAccount = () => {
      if (validateEmail(email) && validatePassword(password)) {
        setDisabledForm(false);
      } else {
        setDisabledForm(true);
      }
    }

    isValidAccount();
  }, [email, password]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        router.push('/home');
      }
    });

    unsubscribe();
  }, [auth, router]);

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
        }
        router.push('/home');
      } catch (error) {
        console.log(error);
      }
    };
    if (userData) {
      sendData();
    }
  }, [userData, router]);

  const signUp = () => {

    createUserWithEmailAndPassword(auth, email, password).then((response) => {
      setUserData(response.user);
    }).catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        setAccountAlreadyExist(true);
      }
    })

  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((response) => {
      setUserData(response.user);
    });
  };

  return (
    <div>
      <div className="h-screen flex">
        <div className="flex w-1/2 bg-signin i justify-around items-center">
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
              <h1 className="text-center text-4xl font-semibold text-secondary">
                Create Account
              </h1>
              <p className="mt-3 mb-5 info text-center text-base">
                Please enter your account information to create a new account
              </p>
              <div className="m-5">
                <div className="form-control">
                  <label className="label">
                    {accountAlreadyExist &&
                      <p className="text-sm text-error list-none">
                        <label>⨉ </label>  this account already exist.
                      </p>
                    }
                  </label>
                  <label className="input-group">
                    <input
                      type="email"
                      placeholder="Email"
                      className="input fiel input-bordered"
                      onChange={(e) => onChangeEmail(e.target.value)}
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
                  <label className="label flex justify-center">
                    {valid === "error" ? (
                      <div
                        className={`tooltip tooltip-open tooltip-error`}
                        data-tip="Your password does not meet the requirements"
                      ></div>
                    ) : (
                      <></>
                    )}</label>
                  <label className="input-group">
                    <input
                      type="password"
                      placeholder="Password"
                      className="input fiel input-bordered"
                      onChange={(e) => onChangePassword(e)}
                      value={password}
                    />
                    <span>
                      <svg
                        className="h-6 w-6 text-gray-400"
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
                  <ul className="w-full list-disc list-inside mt-3">
                    <li
                      className={`list text-sm`}
                      style={{ color: colorPassword }}
                    >
                      6 characters minimum
                    </li>

                    <li className={`text-sm text-${valid} list-${list}`}>
                      {list === "none" ? <label>⨉ </label> : <></>}
                      Contains a number, a special character, or a
                      uppercase/lowercase letter
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    disabled={disabledForm}
                    onClick={signUp}
                    className="mt-5 btn btn-block signin text-base"
                  >
                    Create Account
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={signUpWithGoogle}
                    className="mt-5 btn btn-block signin text-base"
                  >
                    Sign up with google
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#9ca3af] text-base">
                Already have an account?{" "}
                <a
                  className="font-semibold text-[#e74f69] text-base"
                  href={"/"}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
