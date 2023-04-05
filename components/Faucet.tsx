import { useState } from "react";
import { FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";

export default function Faucet() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [hcaptchaToken, setHcaptchaToken] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerificationSuccess = async (token: string, ekey: string) => {
    // set hcaptcha token
    setHcaptchaToken(token);
    // enable submit button
    setIsDisabled(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // disable submit button
    setIsDisabled(true);
    // send request to faucet
    const response = await fetch("/api/faucet", {
      method: "POST",
      body: JSON.stringify({ address: event.currentTarget.address.value, hcaptchaToken }),
    });
    // parse response
    const data = await response.json();
    // if error
    if (response.status != 200) return setErrorMessage(data.message);
    // success!
    setSuccessMessage(data.message);
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src="logo.png" alt="Testnet Faucet" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Testnet Faucet</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              <a href="https://github.com/orgs/0xDeploy/repositories" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">
                Open Source
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <input id="address" name="address" type="string" required className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="0xdD4c825203f97984e7867F11eeCc813A036089D1" />
              </div>
            </div>
            <div className="flex justify-center">
              <HCaptcha sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string} onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)} />
            </div>
            <div>
              <button disabled={isDisabled} type="submit" className="disabled:opacity-25 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Request Funds
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal message={successMessage} />
      <ErrorModal message={errorMessage} />
    </>
  );
}
