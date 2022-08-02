import styles from "./contact.module.scss";
import globalStyles from "../App.module.scss";
import SectionHeading from "../SectionHeading";
import { ReactComponent as GithubLogo } from "../icons/github.svg";
import { ReactComponent as LinkedinLogo } from "../icons/linkedin.svg";
import React, { useState } from "react";

type ContactForm = {
  fullName: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    message: "",
  });

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
  return (
    <div className={styles.contactContainer}>
      <SectionHeading title="Contact Me" />

      <div className={styles.detailsContainer}>
        <div className={styles.textAndSocials}>
          <p>Want to get in touch with me?</p>

          <div className={styles.socials}>
            <a href="https://www.linkedin.com" className={styles.socialButton}>
              <LinkedinLogo />
            </a>

            <a href="https://wwww.github.com" className={styles.socialButton}>
              <GithubLogo />
            </a>
          </div>
        </div>

        <div className={styles.contactDivider}></div>

        <div className={styles.contactFormContainer}>
          <form onSubmit={() => console.log(contactForm)}>
            <input
              id="fullName"
              type="text"
              onChange={(e) => handleContactForm("fullName", e)}
            ></input>
            <label htmlFor="fullName">Name:</label>

            <input
              id="email"
              type="email"
              onChange={(e) => handleContactForm("email", e)}
            ></input>
            <label htmlFor="email">Email:</label>

            <textarea
              id="message"
              onChange={(e) => handleContactForm("message", e)}
            ></textarea>
            <label htmlFor="message">Message:</label>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
