import { useState, useEffect, useRef } from "react";
import Filter from "bad-words";
import toast, { Toaster } from "react-hot-toast";
import Fade from "react-reveal/Fade";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import mail from "./mailer";
import styles from "./Contact.module.scss";
import { MENULINKS } from "../../constants";

// Initialize the profanity filter
const filter = new Filter();
filter.removeWords("hell", "god", "shit");

// Toast configuration
const toastOptions = {
  style: {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
    fontFamily: "sans-serif",
  },
};

// Contact Component
const Contact = () => {
  // Initial form state
  const initialState = { name: "", email: "", message: "" };
  
  // State hooks
  const [formData, setFormData] = useState(initialState);
  const [isSending, setIsSending] = useState(false);
  
  // Refs for DOM elements
  const buttonElementRef = useRef(null);
  const sectionRef = useRef(null);

  // Handle input changes with profanity filtering
  const handleChange = ({ target }) => {
    const { id, value } = target;
    setFormData((prevVal) => ({
      ...prevVal,
      [id]: value.trim() !== prevVal[id].trim() && value.trim().length > prevVal[id].trim().length
        ? filter.clean(value.trim())
        : value,
    }));
  };

  // Reset form fields
  const emptyForm = () => {
    setFormData(initialState);
  };

  // Display error toast for empty fields
  const showEmptyError = () => {
    toast.error("Please fill the required fields", { ...toastOptions, id: "empty-error" });
  };

  // Display error toast for sending failure
  const showSendError = () => {
    toast.error("Error sending your message", { ...toastOptions, id: "send-error" });
  };

  // Display success toast
  const showSuccess = () => {
    toast.success("Message sent successfully", { ...toastOptions, id: "success" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    // Validate form fields
    if (!name || !email || !message) {
      showEmptyError();
      return;
    }

    setIsSending(true);

    try {
      const res = await mail({ name, email, message });

      if (res.status === 200) {
        showSuccess();
        emptyForm();
      } else {
        showSendError();
      }
    } catch (err) {
      console.error(err);
      showSendError();
    } finally {
      setIsSending(false);
    }
  };

  // GSAP Button Animation
  const animateButton = () => {
    const btn = buttonElementRef.current;
    if (!btn) return;

    if (!btn.classList.contains("active")) {
      btn.classList.add("active");

      gsap.to(btn, {
        keyframes: [
          {
            "--left-wing-first-x": 50,
            "--left-wing-first-y": 100,
            "--right-wing-second-x": 50,
            "--right-wing-second-y": 100,
            duration: 0.2,
            onComplete() {
              gsap.set(btn, {
                "--left-wing-first-y": 0,
                "--left-wing-second-x": 40,
                "--left-wing-second-y": 100,
                "--left-wing-third-x": 0,
                "--left-wing-third-y": 100,
                "--left-body-third-x": 40,
                "--right-wing-first-x": 50,
                "--right-wing-first-y": 0,
                "--right-wing-second-x": 60,
                "--right-wing-second-y": 100,
                "--right-wing-third-x": 100,
                "--right-wing-third-y": 100,
                "--right-body-third-x": 60,
              });
            },
          },
          {
            "--left-wing-third-x": 20,
            "--left-wing-third-y": 90,
            "--left-wing-second-y": 90,
            "--left-body-third-y": 90,
            "--right-wing-third-x": 80,
            "--right-wing-third-y": 90,
            "--right-body-third-y": 90,
            "--right-wing-second-y": 90,
            duration: 0.2,
          },
          {
            "--rotate": 50,
            "--left-wing-third-y": 95,
            "--left-wing-third-x": 27,
            "--right-body-third-x": 45,
            "--right-wing-second-x": 45,
            "--right-wing-third-x": 60,
            "--right-wing-third-y": 83,
            duration: 0.25,
          },
          {
            "--rotate": 60,
            "--plane-x": -8,
            "--plane-y": 40,
            duration: 0.2,
          },
          {
            "--rotate": 40,
            "--plane-x": 45,
            "--plane-y": -300,
            "--plane-opacity": 0,
            duration: 0.375,
            onComplete() {
              setTimeout(() => {
                btn.removeAttribute("style");
                gsap.fromTo(
                  btn,
                  { opacity: 0, y: -8 },
                  {
                    opacity: 1,
                    y: 0,
                    clearProps: true,
                    duration: 0.3,
                    onComplete() {
                      btn.classList.remove("active");
                    },
                  }
                );
              }, 1800);
            },
          },
        ],
      });

      gsap.to(btn, {
        keyframes: [
          {
            "--text-opacity": 0,
            "--border-radius": 0,
            "--left-wing-background": "#9f55ff",
            "--right-wing-background": "#9f55ff",
            duration: 0.11,
          },
          {
            "--left-wing-background": "#8b31ff",
            "--right-wing-background": "#8b31ff",
            duration: 0.14,
          },
          {
            "--left-body-background": "#9f55ff",
            "--right-body-background": "#9f55ff",
            duration: 0.25,
            delay: 0.1,
          },
          {
            "--trails-stroke": 171,
            duration: 0.22,
            delay: 0.22,
          },
          {
            "--success-opacity": 1,
            "--success-x": 0,
            duration: 0.2,
            delay: 0.15,
          },
          {
            "--success-stroke": 0,
            duration: 0.15,
          },
        ],
      });
    }
  };

  // Handle button click: animate and submit form
  const handleButtonClick = (e) => {
    animateButton();
    handleSubmit(e);
  };

  // GSAP Scroll Animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    tl.from(
      sectionRef.current.querySelectorAll(".staggered-reveal"),
      { opacity: 0, duration: 0.5, stagger: 0.2 }
    );

    ScrollTrigger.create({
      trigger: sectionRef.current.querySelector(".contact-wrapper"),
      start: "top 80%",
      end: "top 30%",
      scrub: 1,
      animation: tl,
    });

    return () => {
      tl.kill();
      ScrollTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[4].ref}
      className="mt-30 w-full relative select-none bg-black pt-20 sm:pt-10 md:pt-5 lg:pt-1 pb-20"
    >
      {/* Toast Container */}
      <Toaster toastOptions={toastOptions} />

      <div className="section-container flex flex-col justify-center">
        {/* Header Section */}
        <div className="flex flex-col contact-wrapper">
          <div className="flex flex-col">
            <p className="uppercase tracking-widest text-gray-light-1 staggered-reveal">
              CONTACT
            </p>
            <h1 className="text-6xl mt-2 font-medium text-gradient w-fit staggered-reveal">
              Contact
            </h1>
          </div>
          <h2 className="text-[1.65rem] font-medium md:max-w-lg w-full mt-2 staggered-reveal">
            Get In Touch.
          </h2>
        </div>

        {/* Contact Form */}
        <form
          className="pt-10 sm:mx-auto sm:w-[30rem] md:w-[35rem] staggered-reveal"
          onSubmit={handleSubmit}
        >
          <Fade bottom distance={"4rem"}>
            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                id="name"
                className="block w-full h-12 sm:h-14 px-4 text-xl sm:text-2xl font-mono outline-none border-2 border-purple bg-transparent rounded-[0.6rem] transition-all duration-200"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="name"
                className="absolute top-0 left-0 h-full flex items-center pl-4 text-lg font-mono transform transition-all"
              >
                Name
              </label>
            </div>

            {/* Email Input */}
            <div className="relative mt-14">
              <input
                type="email"
                id="email"
                className="block w-full h-12 sm:h-14 px-4 text-xl sm:text-2xl font-mono outline-none border-2 border-purple bg-transparent rounded-[0.6rem] transition-all duration-200"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="email"
                className="absolute top-0 left-0 h-full flex items-center pl-4 text-lg font-mono transform transition-all"
              >
                Email
              </label>
            </div>

            {/* Message Textarea */}
            <div className="relative mt-14">
              <textarea
                id="message"
                className="block w-full h-auto min-h-[10rem] max-h-[20rem] sm:h-14 py-2 px-4 text-xl sm:text-2xl font-mono outline-none border-2 border-purple bg-transparent rounded-[0.6rem] transition-all duration-200 resize-none"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="message"
                className="absolute top-0 left-0 h-14 flex items-center pl-4 text-lg font-mono transform transition-all"
              >
                Message
              </label>
            </div>
          </Fade>
        </form>

        {/* Submit Button */}
        <div className="mt-9 mx-auto">
          <button
            ref={buttonElementRef}
            className={styles.button}
            disabled={
              !formData.name.trim() ||
              !formData.email.trim() ||
              !formData.message.trim() ||
              isSending
            }
            onClick={handleButtonClick}
          >
            <span>Send &rarr;</span>
            <span className={styles.success}>
              <svg viewBox="0 0 16 16">
                <polyline points="3.75 9 7 12 13 5"></polyline>
              </svg>
              Sent
            </span>
            <svg className={styles.trails} viewBox="0 0 33 64">
              <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60"></path>
              <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60"></path>
            </svg>
            <div className={styles.plane}>
              <div className={styles.left} />
              <div className={styles.right} />
            </div>
          </button>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        input,
        label,
        textarea {
          cursor: none;
        }

        input:hover,
        textarea:hover {
          box-shadow: 0 0 0.3rem #7000ff;
        }

        input:active,
        input:focus,
        textarea:active,
        textarea:focus {
          box-shadow: 0 0 0.3rem #000000;
        }

        input:focus + label,
        input:valid + label {
          height: 50%;
          padding-left: 0;
          transform: translateY(-100%);
        }

        textarea:focus + label,
        textarea:valid + label {
          height: 17%;
          padding-left: 0;
          transform: translateY(-100%);
        }

        /* Disable button styling when disabled */
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default Contact;
