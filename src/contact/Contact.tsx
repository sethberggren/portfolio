import styles from "./contact.module.scss";
import globalStyles from "../App.module.scss";
import SectionHeading from "../SectionHeading";
import { ReactComponent as GithubLogo } from "../icons/github.svg";
import { ReactComponent as LinkedinLogo } from "../icons/linkedin.svg";
import React, { FormEvent, useState } from "react";
import ButtonLink from "../common/ButtonLink";

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
): ContactFormFieldProps[] {
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

export default function Contact() {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    console.log(contactForm);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("done submitting");
    }, 5000);
  };

  const renderedContactFormInputs = getContactFormFields(handleContactForm).map(
    (contactFormField) => (
      <ContactFormField
        {...contactFormField}
        key={`contact-form-${contactFormField.fieldId}`}
      />
    )
  );

  return (
    <div className={styles.contactContainerMain}>
      <SectionHeading title="Contact Me" />

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
            <button
              type="submit"
              className={`${styles.submitButton} ${
                isSubmitting ? styles.submitting : ""
              }`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

type ContactFormFieldProps = {
  fieldId: keyof ContactForm;
  label: string;
  handleChange: (
    key: keyof ContactForm,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  textArea?: boolean;
};

function ContactFormField(props: ContactFormFieldProps) {
  const { fieldId, label, handleChange, textArea } = props;

  if (textArea) {
    return (
      <div className={`${styles.inputContainer} ${styles.multiLineInput}`}>
        <textarea
          className={styles.contactInput}
          id={fieldId}
          placeholder=" "
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
          onChange={(e) => handleChange(fieldId, e)}
        ></input>
        <label className={styles.contactLabel} htmlFor={fieldId}>
          {label}
        </label>
      </div>
    );
  }
}
