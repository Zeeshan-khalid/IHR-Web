import { useState, useEffect } from "react";
import db from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import ReactFlagsSelect from 'react-flags-select';
import { onlyNumberRegex } from '../utils/helpers';
import { countries } from '../utils/countries';

export default function Login() {
  const auth = getAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [active, setActive] = useState(1);
  const [error, setError] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [showResend, setShowResend] = useState(false);

  const onFirstStep = () => {
    generateRecaptcha();
    setShowPhone(true)
  };

  const onSelectCountry = (data) => setSelectedCountry(data);

  const onChangePhoneNumber = (e) => {
    if (e.target.value === '' || onlyNumberRegex.test(e.target.value)) {
      setPhoneNumber(e.target.value)
    }
  }

  const onChangeVerificationCode = (e) => {
    if (e.target.value === '' || onlyNumberRegex.test(e.target.value)) {
      setCode(e.target.value)
    }
  }

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => response,
      },
      auth
    );
  };

  const signIn = () => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, countryCode + phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setActive(2);
        setError("");
      })
      .catch((error) => {
        setError("phone validation");
      });

  };

  const validateOTP = () => {
    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(code)
      .then((result) => {
        const user = result.user;
        console.log(user);
        const verifyUser = async () => {
          let validation = await userExisting(user.uid);
          if (validation) {
            router.push("/home");
          } else {
            router.push({
              pathname: "/signin",
              query: { id: user.uid, pn: countryCode + phoneNumber },
            });
          }
        };
        verifyUser();
        setError("");
      })
      .catch((error) => {
        console.log("Validation error");
        setError("code");
      });
    setCode("");
  };

  const userExisting = async (id) => {
    let userExist = false;
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userExist = true;
    }
    return userExist;
  };

  const onResendCode = async () => {
    signIn();
    setShowResend(true);
    setTimeout(() => {
      setShowResend(false);
    }, 3000);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        let validation = await userExisting(user.uid);
        if (validation) {
          router.push("/home");
        } else {
          router.push({
            pathname: "/signin",
            query: { id: user.uid, pn: user.phoneNumber },
          });
        }
      }
    });

    unsubscribe();
  }, []);

  useEffect(() => {
    if (countries?.length > 0) {
      const country = countries?.find(data => data.code == selectedCountry);
      if (country) {
        setCountryCode(country.dial_code);
      }
    }
  }, [selectedCountry]);

  return (
    <div>
      <div className="h-screen flex">
        <div className="flex w-1/2 bg-[#F8EAFE] justify-around items-center">
          <div className="flex justify-center flex-col items-center">
            <div className="flex justify-center items-center w-[254px] h-[254px] rounded-full border-2 border-black mb-[30px]">
              {/* <Image
                alt=""
                loading="eager"
                width="200"
                height="80"
                src="/images/newlogo.png"
              /> */}
              <video
                src="/images/ihranimation.mp4"
                muted
                autoPlay={"autoplay"}
                preload="auto"
                loop
                style={{ borderRadius: "50%" }}
              ></video>
            </div>

            <h1 className="mt-5 font-bold text-2xl font-sans text-center">
            Is It Love or Hate?
            </h1>
            <div className="carousel w-[50%]">
              <div id="item1" className="carousel-item w-full text-center">
                <p className="mx-auto mt-3 mb-4 text-lg">
                  Our brand brings levity to the relationship that we have with receipts.
                </p>
              </div>
              <div id="item2" className="carousel-item w-full text-center">
                <p className="mx-auto mt-3 mb-4 text-lg">
                  We have a Jester archetype, we embody our belief that we need to lighten up the world, and torch the “receipt” tape.
                </p>
              </div>
              <div id="item3" className="carousel-item w-full text-center">
                <p className="mx-auto mt-3 mb-4 text-lg">
                  We are enthusiastic, passionate, and refreshing.
                </p>
              </div>
              <div id="item4" className="carousel-item w-full text-center">
                <p className="mx-auto mt-3 mb-4 text-lg">
                  We honor a bit of fun in how we relate and communicate with others about what we do.
                </p>
              </div>
            </div>
            <div className="flex justify-center w-full py-2 gap-2">
              <a
                href="#item1"
                className="btn btn-x-s bg-white hover:bg-primary"
              ></a>
              <a
                href="#item2"
                className="btn btn-x-s bg-white hover:bg-primary"
              ></a>
              <a
                href="#item3"
                className="btn btn-x-s bg-white hover:bg-primary"
              ></a>
              <a
                href="#item4"
                className="btn btn-x-s bg-white hover:bg-primary"
              ></a>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 justify-center items-center bg-white">
          <div className="bg-base-100">
            <div className="create flex justify-center flex-col">
              <div className="flex justify-center flex-col items-center">
                <label>
                  <Image
                    alt=""
                    loading="eager"
                    width="80"
                    height="68"
                    src="/images/heart.png"
                  />
                </label>
                <div className="flex justify-center flex-col">
                  <h1 className="text-center text-4xl font-normal mt-[18px]">
                    Welcome to
                  </h1>
                  <h1 className="text-center text-secondary text-4xl font-normal text-primary">
                    I Hate Receipts!
                  </h1>
                </div>
              </div>

              {!showPhone ? (
                <>
                  <div
                    className="btn btn-primary mt-[25px]"
                    onClick={onFirstStep}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="none"
                      viewBox="0 0 26 26"
                    >
                      <g fill="#fff" clipPath="url(#clip0_2813_4907)">
                        <path d="M18.056 2.889H7.944A1.444 1.444 0 006.5 4.333v17.333a1.444 1.444 0 001.444 1.445h10.112a1.444 1.444 0 001.444-1.445V4.334a1.444 1.444 0 00-1.444-1.444zM7.944 4.333h10.112v13H7.944v-13zm0 17.333v-2.888h10.112v2.889H7.944z"></path>
                        <path d="M12.281 19.5h1.445v1.444H12.28V19.5z"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_2813_4907">
                          <path fill="#fff" d="M0 0H26V26H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                    Login with Phone
                  </div>
                </>
              ) : (
                <>
                  <p className="mx-auto mt-3 mb-4">
                    {active === 1 ? 'We will send a code to verify your identity' : 'We’ve sent you a verification code, please enter it below'}
                  </p>
                  {active === 1 && <>
                    <ReactFlagsSelect
                      selected={selectedCountry}
                      onSelect={onSelectCountry}
                      selectedSize={16}
                      searchable
                      placeholder={'Select country'}
                    />
                    <div>
                    <input
                      type="text"
                      placeholder="Enter your phone number..."
                      value={phoneNumber}
                      onChange={(event) => onChangePhoneNumber(event)}
                      className="input input-bordered w-full mt-[30px] pl-[50px]"
                      disabled={!countryCode}
                    />
                    <p className="ml-[10px] countrycode">{countryCode}</p>
                    </div>
                    
                    <button
                      className="btn btn-primary mt-[25px] capitalize text-white"
                      onClick={signIn}
                      disabled={countryCode.length <= 0 || phoneNumber.length <= 8}
                    >
                      Continue
                    </button>
                  </>}

                  {active === 2 && <>
                    <input
                      type="text"
                      placeholder="Code"
                      className="input input-bordered w-full mt-[40px]"
                      onChange={(event) => onChangeVerificationCode(event)}
                      value={code}
                    ></input>
                    <div className="flex items-center justify-end cursor-pointer">
                      <p className="text-[#262626] font-semibold pt-4 pr-1" onClick={onResendCode}>
                        Resend
                      </p>
                    </div>

                    {showResend && (
                      <label className="text-success mt-3">
                        Verification code resent
                      </label>
                    )}

                    {error === "code" && (
                      <label className="text-error mt-3">
                        ✕ Confirmation code doesn't match
                      </label>
                    )}
                    {error === "phone validation" && (
                      <label className="text-error mt-3">
                        ✕ Too many attempts, please try later
                      </label>
                    )}
                    <button
                      className="btn btn-primary mt-[25px]"
                      onClick={validateOTP}
                      disabled={code.length < 6}
                    >
                      Confirm
                    </button>
                  </>}
                </>
              )}
            </div>
          </div>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
}
