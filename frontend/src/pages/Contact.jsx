import React, { useContext, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { Helmet } from "react-helmet";

const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const Contact = () => {
  const { token } = useContext(ShopContext);
  return (
    <>
      <Helmet>
        <title>Contact Us | Crazy Dukaan - Dukaan in Your Hand</title>
        <meta name="google-site-verification" content="Ge6IsUiKWA-SWtWQqAiihdEp-oczhyGYhtwewuGIYX4" />
        {/* Primary Meta Tags */}
        <meta
          name="description"
          content="Get in touch with Crazy Dukaan. Have Feedback or need support? Reach out to our Us for help with orders, products, or any other inquiries."
        />
        <meta
          name="keywords"
          content="Crazy Dukaan contact, customer support, help, get in touch, contact Crazy Dukaan, support team, order support, fashion help, product inquiries, feedback, reach out"
        />
        <meta name="author" content="Crazy Dukaan" />
        <meta name="robots" content="index, follow" />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.crazydukaan.store/contact"
        />
        <meta property="og:site_name" content="Crazy Dukaan" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="Contact Us | Crazy Dukaan - Dukaan in Your Hand" />
        <meta
          property="og:description"
          content="Get in touch with Crazy Dukaan. Have Feedback or need support? Reach out to our Us for help with orders, products, or any other inquiries."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Contact Us | Crazy Dukaan" />
        <meta name="instagram:site" content="@crazydukaan.store" />
        <meta name="instagram:card" content="summary_large_image" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Crazy Dukaan" />
        <meta
          name="twitter:description"
          content="Get in touch with Crazy Dukaan. Have Feedback or need support? Reach out to our Us for help with orders, products, or any other inquiries."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png"
        />

        {/* Theme & Favicon */}
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6XEBXHJCN7"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6XEBXHJCN7');
          `}
        </script>
      </Helmet>
      <div className="bg-white">
        <div className="text-center text-2xl pt-10 border-t">
          <Title text1={"CONTACT"} text2={"US"} />
          <p className="max-w-2xl mx-auto mt-4 text-gray-500 text-base">
            We'd love to hear from you. Whether you have a question, or a
            feedback, feel free to reach out to us. Our team is here to assist
            you with anything you need.
          </p>
        </div>

        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-10 max-w-6xl mx-auto px-4">
          <img
            className="w-full md:max-w-[480px] rounded-lg shadow-md"
            src={assets.contact_img}
            alt="Contact Us"
          />

          <div className="flex flex-col justify-center items-start gap-8">
            <div>
              <h2 className="font-semibold text-2xl text-gray-800 mb-2">
                Our Contacts
              </h2>
              <div className="w-20 h-1 bg-blue-500 mb-6"></div>

              <div className="py-12">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeInLeft}
                >
                  <div
                    className="bg-gray-50 rounded-lg p-8 sm:p-12 max-w-4xl mx-auto"
                    id="teams-seciton"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Get in Touch
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                          Have questions or feedback? Our team is ready to
                          assist you with any inquiries about our products or
                          services.
                        </p>

                        <div className="space-y-4 flex flex-col">
                          <div className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-orange-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-gray-600">
                              support@crazydukaan.com
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-orange-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span className="text-gray-600">+918318042859</span>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-4 flex flex-col items-start">
                              <h3 className="font-semibold text-lg text-gray-700 mb-2">
                                Follow Us
                              </h3>
                              <div className="flex space-x-4 ">
                                <a
                                  href="https://www.instagram.com/crazydukaan.store"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-blue-500 transition-colors"
                                >
                                  <FaInstagram size={24} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Quick Connect
                        </h3>
                        <button
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 mb-4"
                          onClick={() =>
                            window.open(
                              "https://wa.me/918318042859?text=Hello%2C%20I%20would%20like%20to%20get%20in%20touch%20with%20you.",
                              "_blank"
                            )
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Chat on WhatsApp
                        </button>
                        <p className="text-gray-500 text-sm text-center">
                          Typically replies within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {!token && <NewsletterBox />}
      </div>
    </>
  );
};

export default Contact;
