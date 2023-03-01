import Head from 'next/head';
import { useState, useEffect } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import Image from 'next/image';
import db from '../firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { v4 } from 'uuid'
import Alert from './Alert';
import Navbar from './navbar';
import useAuthContext from '../hooks/useAuth';
import Datetimepicker from './components/Datetimepicker';
import moment from 'moment';
import CloseOutlineIcon from './icons/CloseOutline';
import InfoOutlineIcon from './icons/InfoOutline';
import WarningTriangleIcon from './icons/WarningTriangle';
import { validateEmail, onlyNumberRegex, phoneNumberRegex, isUrlRegex } from '../utils/helpers';

const Profile = () => {
  const [loading, setloading] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [zipcode, setZipCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState('/images/noimage.jpg');
  const [userId, setUserId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [alert, setAlert] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const storage = getStorage();
  const AuthContext = useAuthContext();
  const [disabledForm, setDisabledForm] = useState(true);
  const genders = ['Female', 'Male'];
  const [isLinkedAccount, setIsLinkedAccount] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState('valid');

  const liftState = (data) => {
    setDateOfBirth(data);
  };

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const updateData = async () => {
    await UploadImage().then((avatarPath) => {
      const fieldToEdit = doc(db, 'users', userId);
      let userUpdateData = {
        email: email,
        nickname: nickname,
        gender: gender,
        dateOfBirth: typeof dateOfBirth === 'object' ? dateOfBirth?.format('YYYY/MM/DD') : dateOfBirth,
        zipcode: Number(zipcode),
        phoneNumber: Number(phoneNumber)
      };

      if (avatarPath !== undefined) {
        userUpdateData = { ...userUpdateData, ...{ avatarPath: avatarPath } };
      }

      updateDoc(fieldToEdit, userUpdateData).then(() => {
        setIsUpdate(false);
        setIsLinkedAccount(false);
        showAlert('Your changes have been saved successfully', 'Success');
        userUpdateData = { ...userUpdateData, ...{ userID: userId } }
        AuthContext.setUser(userUpdateData);
      }).catch((error) => {
        console.log('An error exist');
        console.log(error);
      })
    });
  };

  const isUrl = (url) => {
    return isUrlRegex.test(url);
  }

  const UploadImage = () => {
    if (imageUpload === null) return new Promise((resolve) => { resolve() });
    const imageRef = ref(storage, `/images/${userId}/${v4() + imageUpload.name.trim()}`);
    return uploadBytes(imageRef, imageUpload).then(async (item) => {
      const url = await getDownloadURL(item.ref);
      setPhoto(url);
      return item.ref.fullPath;
    })
  }

  const deleteLinkedAccount = () => {
    console.log('delete linked account');
  }

  const setNewLinkedEmailAccount = (email) => {
    if (validateEmail(email)) {
      setIsValidEmail('valid');
    } else {
      setIsValidEmail('error');
    }
  }

  const onChangeZipcode = (e) => {
    if (e.target.value === '' || onlyNumberRegex.test(e.target.value)) {
      setZipCode(e.target.value);
    }
  }

  const onChangePhoneNumber = (e) => {
    if (e.target.value === '' || phoneNumberRegex.test(e.target.value)) {
      setPhoneNumber(e.target.value);
    }
  }

  useEffect(() => {
    const user = AuthContext?.user;
    console.log(user);
    (async () => {
      if (user) {
        setUserId(user.userID);
        setEmail(user.email);
        setNickName(user.nickname);
        setGender(user.gender);
        setDateOfBirth(user.dateOfBirth ? user.dateOfBirth : moment());
        setZipCode(user?.zipcode >= 1 ? user.zipcode : '');
        setPhoneNumber(user?.phoneNumber >= 1 ? user.phoneNumber : '');
        if (user.avatarPath) {
          if (isUrl(user.avatarPath)) {
            setPhoto(user.avatarPath);
          } else {
            const avatarRef = ref(storage, user.avatarPath);
            const avatarURL = await getDownloadURL(avatarRef);
            setPhoto(avatarURL);
          }
        }
      }
      
    })();
  }, [AuthContext?.user, storage]);

  useEffect(() => {

    if (nickname && gender && dateOfBirth) {
      setDisabledForm(false);
    } else {
      setDisabledForm(true);
    }

  }, [nickname, gender, dateOfBirth])

  return (
    <div>
      <Head>
        <title>I Hate Receipt</title>
        <meta name="description" content="I Hate receipt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <div className="loader">
          <HashLoader color={"#F37A24"} loading={loading} size={80} />
        </div>
      ) : (
        <main>
          <Navbar type={"profile"} route={"/home"} />

          <div className="profile">
            <Alert alert={alert} />
            {isUpdate ? (<>
              <div className="grid grid-cols-[700px_minmax(700px,_1fr)_100px]">
                <div className="personal-info">
                  <div className="avatar">
                    <div className="mb-8 rounded-full w-32 h-32">
                      <Image
                        alt=""
                        loading="eager"
                        width="180"
                        height="180"
                        src={photo}
                      />
                    </div>
                  </div>
                  <input className="mt-11 mb-16" type="file" onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                        setPhoto(e.target.result);
                      };
                      reader.readAsDataURL(event.target.files[0]);
                    }
                    setImageUpload(event.target.files[0])
                  }} />
                  <h1 className="font-bold text-2xl mb-4">
                    Personal Information
                  </h1>

                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={nickname}
                      onChange={(event) => setNickName(event.target.value)}
                      className="input input-bordered max-w-sm"
                    />
                  </div>
                  <div className="form-control mb-3">
                    <select id="gender" className="input input-bordered max-w-sm" onChange={(event) => setGender(event.target.value)} defaultValue={gender}>
                      <option>Select a gender</option>
                      {genders.map((item) => {
                        return <option key={item} value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                  <div className="form-control mb-3">
                    {dateOfBirth &&
                      <Datetimepicker
                        lift={liftState}
                        defaultValue={dateOfBirth}
                        className={'input input-bordered max-w-sm'}
                        dateFormat={'YYYY/MM/DD'}
                      />
                    }

                  </div>
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={zipcode}
                      onChange={(event) => onChangeZipcode(event)}
                      className="input input-bordered max-w-sm"
                    />
                  </div>
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(event) => onChangePhoneNumber(event)}
                      className="input input-bordered max-w-sm"
                    />
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn bg-[#ea3358]"
                      onClick={() => updateData()}
                      disabled={disabledForm}
                    >
                      Save Changes
                    </button>
                  </div>

                  <h1 className="font-bold text-2xl mb-4 mt-5 pt-3">
                    Account Information <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
                  </h1>

                  <div className="form-control mb-3">
                    <label className="label">
                      <span className="label-text font-semibold text-sm flex items-center">
                        Linked Email Accounts &nbsp; <span className="inline-block"> <InfoOutlineIcon /></span>
                      </span>
                    </label>
                    <div className="w-[385px] h-[50px] rounded-[8px] border border-gray-300 px-4 py-3 relative mb-2" role="alert">
                      <strong className="block sm:inline text-sm">{email}</strong>
                      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <CloseOutlineIcon onClick={() => deleteLinkedAccount()} />
                      </span>
                    </div>
                    <div className="w-[385px] h-[50px] rounded-[8px] border border-gray-300 px-4 py-3 relative" role="alert">
                      <span className="absolute top-0 bottom-0 left-0 px-4 py-3">
                        <WarningTriangleIcon />
                      </span>
                      <strong className="block sm:inline text-sm text-[#EF6400] pl-10">email@example.com</strong>
                      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <CloseOutlineIcon />
                      </span>
                    </div>
                  </div>
                  {isLinkedAccount && (<div className="form-control mb-3">
                    {isValidEmail === 'error' && (<label className="label flex justify-center">
                      <div
                        className={`tooltip tooltip-open tooltip-error`}
                        data-tip="Your email is not valid"
                      ></div></label>)}
                    <input
                      type="email"
                      placeholder="Email"
                      onChange={(event) => setNewLinkedEmailAccount(event.target.value)}
                      className="input input-bordered max-w-sm"
                    />
                  </div>)}
                  <div className="card-actions">
                    {!isLinkedAccount && (<button className="btn bg-[#ea3358]" onClick={() => setIsLinkedAccount(true)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Add Account
                    </button>)}
                  </div>

                  {isLinkedAccount && (<div className="flex items-center justify-end w-9/12 cursor-pointer">
                    <p className="text-[#262626] font-semibold pr-10" onClick={() => setIsLinkedAccount(false)}>
                      Cancel
                    </p>
                    <button className="btn bg-[#25A248]" onClick={() => setIsLinkedAccount(false)}>
                      Save account
                    </button>
                  </div>)}

                  <div className="form-control mt-3 mb-3">
                    <label className="label">
                      <span className="label-text font-semibold text-sm">
                        Share Settings
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      defaultValue=""
                      className="input input-bordered max-w-sm"
                    />
                  </div>
                </div>
                <div className="bank p-32">
                  <h1 className="font-bold text-2xl mb-4 ml-2">
                    Bank Accounts <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
                  </h1>
                  <div className="overflow-x-auto text-left">
                    <div className="payment">
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/card-1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/card.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/amex.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges link">
                        <a className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>{" "}
                          <p>Add Bank Account</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
            ) : (
              <div
                className="grid grid-cols-[700px_minmax(700px,_1fr)_100px]"
              >
                <div className="personal-info">
                  <div className="avatar">
                    <div className="mb-8 rounded-full w-32 h-32">
                      <Image
                        alt={nickname}
                        loading="eager"
                        width="180"
                        height="180"
                        src={photo}
                      />
                    </div>
                  </div>

                  <h1 className="font-bold text-2xl mb-4">
                    Personal Information
                  </h1>
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Name"
                      defaultValue={nickname}
                      className="input input-bordered max-w-sm"
                      disabled
                    />
                  </div>
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Gender"
                      className="input input-bordered max-w-sm"
                      defaultValue={gender}
                      disabled
                    />
                  </div>

                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Date of Birth"
                      className="input input-bordered max-w-sm"
                      defaultValue={typeof dateOfBirth === 'object' ? dateOfBirth?.format('YYYY/MM/DD') : dateOfBirth}
                      disabled
                    />
                  </div>
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Zip Code"
                      className="input input-bordered max-w-sm"
                      defaultValue={zipcode}
                      disabled
                    />
                  </div>
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="input input-bordered max-w-sm"
                      defaultValue={phoneNumber}
                      disabled
                    />
                  </div>
                  <div className="card-actions">
                    <p
                      className="btn bg-[#ea3358]"
                      onClick={() => setIsUpdate(true)}
                    >
                      Edit Profile
                    </p>
                  </div>

                  <h1 className="font-bold text-2xl mb-4 mt-5 pt-3">
                    Account Information <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
                  </h1>

                  <div className="form-control mb-3">
                    <label className="label">
                      <span className="label-text font-semibold text-sm flex items-center">
                        Linked Email Accounts &nbsp; <span className="inline-block"> <InfoOutlineIcon /></span>
                      </span>
                    </label>
                    <div className="w-[385px] h-[50px] rounded-[8px] border border-gray-300 px-4 py-3 relative mb-2" role="alert">
                      <strong className="block sm:inline text-sm">{email}</strong>
                      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <CloseOutlineIcon onClick={() => deleteLinkedAccount()} />
                      </span>
                    </div>
                    <div className="w-[385px] h-[50px] rounded-[8px] border border-gray-300 px-4 py-3 relative" role="alert">
                      <span className="absolute top-0 bottom-0 left-0 px-4 py-3">
                        <WarningTriangleIcon />
                      </span>
                      <strong className="block sm:inline text-sm text-[#EF6400] pl-10">email@example.com</strong>
                      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <CloseOutlineIcon />
                      </span>
                    </div>
                  </div>
                  <div className="form-control mt-3 mb-3">
                    <label className="label">
                      <span className="label-text font-semibold text-sm">
                        Share Settings
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      defaultValue=""
                      className="input input-bordered max-w-sm"
                      disabled
                    />
                  </div>
                </div>
                <div className="bank p-32">
                  <h1 className="font-bold text-2xl mb-4 ml-2">
                    Bank Accounts
                  </h1>
                  <div className="overflow-x-auto text-left">
                    <div className="payment">
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/card-1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/card.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/amex.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges">
                        <div className="grid">
                          <Image
                            alt=""
                            loading="eager"
                            width="150"
                            height="100%"
                            src="/images/other1.png"
                          />
                          <span className="number">2565</span>
                        </div>
                      </div>
                      <div className="badges link">
                        <a className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p>Add Bank Account</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
};
export default Profile;
