import styles from "./contact.module.scss";
import globalStyles from "../App.module.scss";
import SectionHeading from "../common/SectionHeading";
import { ReactComponent as GithubLogo } from "../icons/github.svg";
import { ReactComponent as LinkedinLogo } from "../icons/linkedin.svg";
import React, { FormEvent, useEffect, useState } from "react";
import ButtonLink from "../common/ButtonLink";
import axios from "axios";
import backendUrl from "../backendUrl";
import PortfolioSection from "../common/PortfolioSection";
import Spinner from "../common/Spinner";

type ContactForm = {
  fullName: string;
  email: string;
  message: string;
};

type ContactFormChangeHandler = (
  key: keyof ContactForm,
  event:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
) => void;

function getContactFormFields(
  handleChange: ContactFormChangeHandler
): Omit<ContactFormFieldProps, "value">[] {
  return [
    {
      fieldId: "fullName",
      label: "Name",
      handleChange: handleChange,
    },
    {
      fieldId: "email",
      label: "Email",
      handleChange: handleChange,
    },
    {
      fieldId: "message",
      label: "Message",
      handleChange: handleChange,
      textArea: true,
    },
  ];
}

const blankContactForm = {
  fullName: "",
  email: "",
  message: "",
};
export default function Contact() {
  const [contactForm, setContactForm] = useState(blankContactForm);

  const [submitStatus, setSubmitStatus] = useState<
    "in progress" | "loading" | "sent"
  >("in progress");

  useEffect(() => {
    const submitMessage = async () => {
      try {
        const response = await axios.post(backendUrl("contact"), contactForm);

        setSubmitStatus("sent");
        setContactForm(blankContactForm);

        window.setTimeout(() => setSubmitStatus("in progress"), 10000);
      } catch (error) {
        setSubmitStatus("sent");
        setContactForm(blankContactForm);

        window.setTimeout(() => setSubmitStatus("in progress"), 10000);
      }
    };

    if (submitStatus === "loading") {
      submitMessage();
    }
  }, [submitStatus]);

  const handleContactForm = (
    key: keyof ContactForm,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContactForm = { ...contactForm };
    newContactForm[key] = event.target.value;

    setContactForm(newContactForm);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitStatus("loading");
  };

  const renderedContactFormInputs = getContactFormFields(handleContactForm).map(
    (contactFormField) => (
      <ContactFormField
        {...contactFormField}
        value={contactForm[contactFormField.fieldId]}
        key={`contact-form-${contactFormField.fieldId}`}
      />
    )
  );

  return (
    <PortfolioSection sectionTitle="Contact Me" backgroundColor="accent">
      <div className={styles.contactContainer}>
        <div className={styles.contactSubsection}>
          <p className={styles.callToAction}>Want to get in touch with me?</p>

          <div className={styles.socials}>
            <ButtonLink
              href="https://www.linkedin.com"
              icon={<LinkedinLogo />}
              color="primary"
            />
            <ButtonLink
              href="https://www.github.com"
              icon={<GithubLogo />}
              color="primary"
            />
          </div>
        </div>

        <div className={styles.contactDivider}></div>

        <div className={styles.contactSubsection}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            {renderedContactFormInputs}

            <div className={styles.submitButtonContainer}>
              {!(submitStatus === "loading") ? (
                <button type="submit" className={styles.submitButton}>
                  {submitStatus === "in progress" ? "Send" : "Received!"}
                </button>
              ) : (
                <Spinner />
              )}
            </div>
          </form>
        </div>
      </div>
    </PortfolioSection>
  );
}

type ContactFormFieldProps = {
  fieldId: keyof ContactForm;
  label: string;
  value: string;
  handleChange: (
    key: keyof ContactForm,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  textArea?: boolean;
};

function ContactFormField(props: ContactFormFieldProps) {
  const { fieldId, label, handleChange, textArea, value } = props;

  if (textArea) {
    return (
      <div className={`${styles.inputContainer} ${styles.multiLineInput}`}>
        <textarea
          className={styles.contactInput}
          id={fieldId}
          placeholder=" "
          value={value}
          onChange={(e) => handleChange(fieldId, e)}
        ></textarea>
        <label className={styles.contactLabel} htmlFor={fieldId}>
          {label}
        </label>
      </div>
    );
  } else {
    return (
      <div className={`${styles.inputContainer} ${styles.oneLineInput}`}>
        <input
          className={styles.contactInput}
          id={fieldId}
          type={fieldId !== "email" ? "text" : "email"}
          placeholder=" "
          value={value}
          onChange={(e) => handleChange(fieldId, e)}
        ></input>
        <label className={styles.contactLabel} htmlFor={fieldId}>
          {label}
        </label>
      </div>
    );
  }
}
