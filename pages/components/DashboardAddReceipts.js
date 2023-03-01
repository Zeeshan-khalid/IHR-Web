import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../upload";
import Add from "../icons/Add";
import useAuthContext from "../../hooks/useAuth";
import Spinner from "../icons/Spinner";

const DashboardAddReceipts = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [result, setResult] = useState([]);
  const router = useRouter();
  const AuthContext = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFilesToUpload([acceptedFiles]);
      onUpload();
    }
  }, [acceptedFiles, loading]);

  useEffect(() => {
    setTimeout(() => setLoading(true), 3000);
  }, [loading]);

  const onUpload = () => {
    setUpload(true);
    let bodyFormData = new FormData();
    for (const key of Object.keys(acceptedFiles)) {
      bodyFormData.append("images", acceptedFiles[key]);
    }

    setTimeout(() => {
      postFiles(bodyFormData).then((res) => {
        setFilesToUpload([]);
        sessionStorage.setItem("data", JSON.stringify(res));
        router.push("/upload");
      });
    }, 3000);
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
      {loading === false ? (
        <div className="flex w-full h-screen justify-center items-center flex-col">
          <Spinner />
          <h1 className="text-lg text-base-content mt-5 mb-2">Loading...</h1>
          <h2 className="text-lg text-[#ABABAB]">Please Wait</h2>
        </div>
      ) : (<>
        <div {...getRootProps({ className: "dropzone", })} style={{ height: "100%" }}>
          <div className="flex items-center justify-center h-full">
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
                </div>) : (
                <div>
                  <div className="shrink-0 flex justify-center mb-5">
                    <div className="flex w-[80px] h-[80px] bg-base-200 justify-center items-center rounded-full">
                      <Add />
                    </div>
                  </div>
                  <label className="text-center flex justify-center flex-col">
                    <input type="file" className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100
                        " name="filefield" multiple="multiple" {...getInputProps()} />
                    <h1 className="text-lg text-base-content">
                      You dont have any receipt
                    </h1>
                    <label className="btn bg-base-100 hover:bg-base-100 text-primary text-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                        stroke="#2D007A" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>{" "}
                      Add a Receipt
                    </label>
                  </label>
                </div>)}
            </form>
          </div>
        </div>
        <div className="hidden">
          <Upload value={result} />
        </div>
      </>)}
    </>
  );
};

export default DashboardAddReceipts;