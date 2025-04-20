import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import WhatsAppButton from "../components/whatsapp";
import InteractiveScrollingBox from "../components/InteractiveBox";
import FrequentyAskedQuestions from "../components/FrequentlyQuestions";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import ProductBanner from "../components/CouponBanner";

const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  const { token } = useContext(ShopContext);
  const location = useLocation();
  
  // Reset scroll position when the Home component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Crazy Dukaan | Dukaan in Your hand</title>
        <meta name="title" content="Crazy Dukaan | Dukaan in Your hand" />
        <meta name="google-site-verification" content="Ge6IsUiKWA-SWtWQqAiihdEp-oczhyGYhtwewuGIYX4" />
        <meta
          name="description"
          content="Crazy Dukaan assists you with brand-new fashion outfit trends by offering you items, peddling your style, or selling a will-o'-the-wisp, as seen on other popular media channels."
        />
        <meta
          name="keywords"
          content="Crazy Dukaan, eCommerce, outfits, fashion products, online store, accessories, trendy outfits, fashion retailer, online shopping, best deals"
        />
        <meta name="author" content="Crazy Dukaan" />
        <link rel="canonical" href="https://www.crazydukaan.store/" />

        {/* Open Graph Meta Tags (For Instagram + Generic Preview) */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Crazy Dukaan | Dukaan in Your hand"
        />
        <meta
          property="og:description"
          content="Shop the latest fashion outfits, accessories, and more at Crazy Dukaan. Get the best deals on your favorite fashion products."
        />
        <meta property="og:url" content="https://www.crazydukaan.store/" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744657344/pc6yvs6rzxgjc6dqnglg.png"
        />

        {/* Instagram username for social preview */}
        <meta name="instagram:site" content="@crazydukaan.store" />

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
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

      <div id="top-of-page" className="overflow-x-hidden">
        <ProductBanner />
        <WhatsAppButton />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInLeft}
        >
          <Hero />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInRight}
        >
          <InteractiveScrollingBox />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInLeft}
        >
          <LatestCollection />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInRight}
        >
          <BestSeller />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInLeft}
        >
          <OurPolicy />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInRight}
        >
          <FrequentyAskedQuestions />
        </motion.div>
        {!token && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInLeft}
          >
            <NewsletterBox />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Home;
