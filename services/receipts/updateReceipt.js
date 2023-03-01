import AuthContext from "../../context/AuthContext/AuthProvider";

export const updateReceipt = async (receipt) => {
  const update = await fetch(`{{baseUrl}}/api/v1/receipts/images/upload`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      bundleid: "com.ihatereceipts.web",
      "x-api-key": AuthContext?.apiKey,
      Authorization: "Bearer " + AuthContext?.encodedToken,
    },
    body: JSON.stringify(receipt),
  })
    .then((response) => response.json())
    .catch((err) => {
      throw err;
    });
  return update;
};
