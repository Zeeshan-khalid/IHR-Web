import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import useAuthContext from "../../hooks/useAuth";

const AddReceipts = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const router = useRouter();
  const AuthContext = useAuthContext();
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFilesToUpload([acceptedFiles]);
      onUpload();
    }
  }, [acceptedFiles]);

  const onUpload = () => {
    setUpload(true);
    let bodyFormData = new FormData();
    for (const key of Object.keys(acceptedFiles)) {
      bodyFormData.append("images", acceptedFiles[key]);
    }
    // setTimeout(() => {
      postFiles(bodyFormData).then((res) => {
        setFilesToUpload([]);
        if (res !== undefined) {
          sessionStorage.setItem("data", JSON.stringify(res));
          router.push("/upload");
        } else {
          setErrorMsg(true);
          setTimeout(() => {
            setErrorMsg(false);
          }, 3000);
        }
      });
    // }, 3000);
  };

  const postFiles = async (bodyFormData) => {
    try {
      if (AuthContext?.encodedToken) {
        const response = await fetch(
          `${process.env.IHR_BASE_URL}/receipts/images/upload`,

          {
            method: "POST",
            headers: {
              "x-api-key": AuthContext?.apiKey,
              Authorization: "Bearer " + AuthContext?.encodedToken,
            },
            body: bodyFormData,
          }
        ).then((response) => response.json());
        return response;
      }
    } catch (error) {
      console.log("ADDRECEIPTS: Error response");
    }
  };

  return (
    <>
      <label htmlFor="uploads" className="modal cursor-pointer">
        <label
          className="modal-box relative h-full w-11/12 max-w-7xl"
          htmlFor=""
        >
          <div
            {...getRootProps({
              className: "dropzone",
            })}
            style={{ height: "100%" }}
          >
            <div className="customborder border-primary flex items-center justify-center">
              <form className="space-x-6">

              {upload == true ? (
                <div className="flex w-full h-screen justify-center items-center flex-col">
                  <h1 className="text-lg text-base-content mt-5 mb-2">Uploading Please Wait...</h1>
                  <ul className="flex justify-center flex-col">
                    {acceptedFiles.map((file) => (
                      <li key={file.path}>
                        {file.path} - {file.size} bytes
                      </li>
                    ))}
                  </ul>
                </div>) : (<div>

                <div className="shrink-0 flex justify-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-[#ea3358]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#2D007A"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <label className="text-center flex justify-center flex-col">
                  <input
                    type="file"
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100
                    "
                    name="filefield"
                    multiple="multiple"
                    {...getInputProps()}
                  />
                  <h1 className="text-lg text-base-content">
                    Press to select or drag your receipts to upload
                  </h1>
                  <h2 className="text-lg text-[#ABABAB]">(Not more than 4)</h2>
                </label>
                </div>)}

              </form>
            </div>
          </div>
        </label>
      </label>
      {errorMsg && (
        <div className="toast z-[12344555] fixed bottom-16">
          <div className="alert alert-error">
            <div>
              <span>Files cant be uploaded, please try again later.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddReceipts;
