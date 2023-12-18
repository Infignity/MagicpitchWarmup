import React, {
  LegacyRef,
  MouseEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import TextInput from "@/app/(dashboard)/components/TextInput";
import SelectInput from "@/app/(dashboard)/components/SelectInput";
import { MailServer, NewMailServer, ServerConfig } from "@/app/types";
import { mailServerVerificationType, securityOptions } from "@/app/constants";
import { IconContext } from "react-icons";
import { BsX } from "react-icons/bs";
import { mode } from "@/app/constants";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import { VerifyMailServerApi } from "@/app/api/verifymailserverapi";
import { CreateMailServerApi } from "@/app/api/createmailserverapi";
import { useUser } from "../../contexts/UserProvider";
import Loader1 from "../../components/Loader1";
import { AllMailServersApi } from "@/app/api/allmailserversapi";

type MailServerFormProps = {
  name: string;
  smtpHostname: string;
  smtpPort: string;
  smtpEmail: string;
  smtpPassword: string;
  smtpSecurity: string | null; // Change this to string type if it's not already
  smtpRecipientEmail: string;
};
type MailServerProps = {
  setAllMailServers: React.Dispatch<React.SetStateAction<any[]>>; // Adjust the type as per your 'setAllMailServers' function
};
export default function MailServerForm({ setAllMailServers }: MailServerProps) {
  const { showSuccessToast, showErrorToast } = useGlobalToastContext();
  const { isMailServerModal, setIsMailServerModal } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState<MailServerFormProps>({
    name: "",
    smtpHostname: "",
    smtpPort: "",
    smtpEmail: "",
    smtpPassword: "",
    smtpSecurity: "",
    smtpRecipientEmail: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSelectInputChange = (selectedValue: string | null) => {
    setFormFields((prevState) => ({
      ...prevState,
      smtpSecurity: selectedValue,
    }));
  };

  useEffect(() => {
    console.log(formFields);
  }, [formFields]);

  // error refs
  const nameRef = useRef<HTMLParagraphElement>(null);
  // imap

  // smtp
  const smtpHostnameRef = useRef<HTMLParagraphElement>(null);
  const smtpPortRef = useRef<HTMLParagraphElement>(null);
  const smtpEmailRef = useRef<HTMLParagraphElement>(null);
  const smtpPasswordRef = useRef<HTMLParagraphElement>(null);
  const smtpSecurityRef = useRef<HTMLParagraphElement>(null);
  const smtpRecipientEmailRef = useRef<HTMLParagraphElement>(null);

  const [isSMTPVerified, setIsSMTPVerified] = useState(false);
  const [isIMAPVerified, setIsIMAPVerified] = useState(false);
  const isSubmitDisabled = isSMTPVerified === false;
  // const isSubmitDisabled = isSMTPVerified === false

  const handleVerifyMailServer = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = JSON.stringify({
      hostname: formFields.smtpHostname,
      port: formFields.smtpPort,
      email: formFields.smtpEmail,
      password: formFields.smtpPassword,
      security: formFields.smtpSecurity,
      recipientEmail: formFields.smtpRecipientEmail,
      verificationType: mailServerVerificationType.smtp,
    });
    try {
      const response = await VerifyMailServerApi(data);
      console.log(response);
      showSuccessToast("Mail server verified successfully");
      isSubmitDisabled && setIsSMTPVerified(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      showErrorToast("Unable to verify mail server");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = JSON.stringify({
      name: formFields.name,
      smtpDetails: {
        hostname: formFields.smtpHostname,
        port: formFields.smtpPort,
        email: formFields.smtpEmail,
        password: formFields.smtpPassword,
        security: formFields.smtpSecurity,
      },
    });
    try {
      const response = await CreateMailServerApi(data);
      console.log(response);
      setIsMailServerModal(false);
      const allMailServersResponse = await AllMailServersApi(0);
      setAllMailServers(allMailServersResponse.data.results);
      setIsLoading(false);
      showSuccessToast("Mail server Added successfully");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showErrorToast("Unable to add mail server");
    }
  };

  return (
    <section className="absolute inset-0 w-full h-full overflow-auto flex bg-gray-150 px-5 py-10 z-50">
      <div className="w-full h-fit flex flex-col items-center justify-center gap-5 ">
        <form className="bg-white p-5 lg:p-10 rounded-3xl border-[1px] border-[#C2C2C2] w-full max-w-[60rem] flex flex-col gap-7 h-fit relative">
          {isLoading ? (
            <>
              <div className="absolute inset-0 flex justify-center items-center z-50">
                <Loader1 />
              </div>
              <div className="absolute inset-0 bg-gray-800 opacity-50 z-40  max-h-[100vh]"></div>
            </>
          ) : null}
          <div className="flex w-full justify-between gap-3">
            <h3 className="text-xl text-blue font-medium">Add Mail Server</h3>
            <button
              type="button"
              className="w-fit h-fit self-end"
              onClick={() => setIsMailServerModal(false)}
            >
              <IconContext.Provider
                value={{
                  size: "2em",
                  className: `p-1 rounded-full bg-white text-gray-800 hover:bg-gray-200`,
                }}
              >
                <BsX />
              </IconContext.Provider>
            </button>
          </div>
          <div className="flex flex-col gap-12 h-full w-full">
            <div className="w-full flex flex-col md:flex-row gap-5">
              <TextInput
                errRef={nameRef}
                label="Name of email server"
                placeholder="Enter mail server name"
                value={formFields.name}
                onChange={handleInputChange}
                name="name"
              />
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="text-gray-800 text-xl">SMTP (sending emails)</h3>
              <div className="w-full flex flex-col md:flex-row gap-5">
                <TextInput
                  errRef={smtpHostnameRef}
                  label="Host"
                  placeholder="Enter server name"
                  value={formFields.smtpHostname}
                  onChange={handleInputChange}
                  name="smtpHostname"
                />
                <TextInput
                  errRef={smtpPortRef}
                  label="Port"
                  placeholder="Enter port number"
                  value={formFields.smtpPort}
                  onChange={handleInputChange}
                  name="smtpPort"
                />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5">
                <TextInput
                  errRef={smtpEmailRef}
                  label="From SMTP Email"
                  placeholder="Enter email"
                  value={formFields.smtpEmail}
                  onChange={handleInputChange}
                  name="smtpEmail"
                />
                <TextInput
                  errRef={smtpPasswordRef}
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={formFields.smtpPassword}
                  onChange={handleInputChange}
                  name="smtpPassword"
                />
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectInput
                  errRef={smtpSecurityRef}
                  label="SMTP Security"
                  placeholder="Choose security type"
                  options={securityOptions}
                  onChange={handleSelectInputChange} // Pass the onChange handler
                  value={formFields.smtpSecurity} // Set the value and handle changes in this field
                />
                <TextInput
                  errRef={smtpRecipientEmailRef}
                  label="Recipient Email"
                  placeholder="Enter recipient emai l"
                  value={formFields.smtpRecipientEmail}
                  onChange={handleInputChange}
                  name="smtpRecipientEmail"
                />
              </div>
              <button
                type="button"
                className="disabled:opacity-50 disabled:cursor-not-allowed px-5 md:px-10 py-2 bg-blue rounded-md text-white w-fit"
                disabled={
                  !formFields.smtpHostname ||
                  !formFields.smtpPort ||
                  !formFields.smtpEmail ||
                  !formFields.smtpPassword ||
                  !formFields.smtpSecurity ||
                  !formFields.smtpRecipientEmail
                }
                onClick={handleVerifyMailServer}
              >
                Verify
              </button>
            </div>

            <button
              disabled={isSubmitDisabled}
              type="button"
              className="px-5 md:px-10 py-2 bg-blue rounded-md text-white w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
