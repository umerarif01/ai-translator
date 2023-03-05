import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Effortlessly translate any text with our AI translator tool powered by OpenAI GPT-3 and Whisper API."
          />
          <meta property="og:site_name" content="AITranslate.com" />
          <meta
            property="og:description"
            content="Effortlessly translate any text with our AI translator tool powered by OpenAI GPT-3 and Whisper API."
          />
          <meta property="og:title" content="AI Translator Tool" />
          <meta name="aitranslate:card" content="summary_large_image" />
          <meta name="aitranslater:title" content="AI Translator Tool" />
          <meta
            name="aitranslate:description"
            content="Effortlessly translate any text with our AI translator tool powered by OpenAI GPT-3 and Whisper API."
          />
          <meta
            property="og:image"
            content="https://aitranslate.com/logo.svg"
          />
          <meta
            name="twitter:image"
            content="https://aitranslate.com/logo.svg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
