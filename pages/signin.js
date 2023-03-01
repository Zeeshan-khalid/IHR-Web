import Image from "next/image";
import { useEffect, useState } from "react";
import db from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { validateLetters, validateEmail } from '../utils/helpers';

const Signin = () => {
  const router = useRouter();
  const phonenumber = router.query.pn;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const register = async () => {
    if (validateLetters(name) && validateEmail(email)) {
      try {
        const docData = {
          nickname: name,
          phoneNumber: phonenumber,
          email: email,
          emailState: null,
          address: null,
          zipcode: null,
          dateOfBirth: null,
          gender: null,
          userID: router.query.id,
          creationDate: new Date(),
          modifiedDate: new Date(),
          dismissedWhatsNewCardIds: null,
          readOfferIds: null,
          linkedRetailerAccounts: null,
          avatarPath: null,
        };
        const docRef = doc(db, "users", router.query.id);
        setDoc(docRef, docData);
        router.push("/home");
      } catch (error) {
        console.log(error);
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (router.query.id === null || router.query.id === undefined) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex justify-center flex-col w-[420px]">
        <label className="flex justify-center">
          <Image
            alt=""
            loading="eager"
            width="80"
            height="68"
            src="/images/heart.png"
          />
        </label>
        <h1 className="text-center text-3xl font-semibold mt-[18px]">
          Almost there!
        </h1>
        <p className="mx-auto mt-3 mb-4 font-semibold text-xs">
          Please complete the information below
        </p>
        <input
          type="text"
          placeholder="Full Name..."
          className="input input-bordered w-full mt-[21px]"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Email..."
          className="input input-bordered w-full mt-[21px]"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        {error && (
          <label className="text-error mt-3">✕ Please verify the fields</label>
        )}
        <button className="btn btn-primary mt-[40px]" onClick={register}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Signin;
