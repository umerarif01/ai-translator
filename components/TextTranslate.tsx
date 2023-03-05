import Image from "next/image";
import React, { useState, useEffect } from "react";
import LoadingDots from "../components/LoadingDots";
import languages from "../utils/languages";
import { Toaster, toast } from "react-hot-toast";

const TextTranslate = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string>(languages[0].value);
  const [generatedTranslation, setGeneratedTranslation] = useState<string>("");
  const [text, setText] = useState<string>("");
  const currentModel = "text-davinci-003";

  const prompt = `Please translate the following text into ${language}. The translation should always be in ${language}. \n\nOriginal text:\n"${text}"\n\nPlease provide your translation below:`;

  const translateText = async () => {
    setGeneratedTranslation("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        currentModel,
      }),
    });
    const data = await response.json();
    setGeneratedTranslation(data.data);

    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedLabel = languages.find(
      (language) => language.value === selectedValue
    )?.value;
    if (selectedLabel) {
      setLanguage(selectedLabel);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <div className="flex mt-10 items-center space-x-3 ">
        <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
        <p className="text-left font-medium ">
          Enter the text you want to translate.
        </p>
      </div>
      <textarea
        className="block p-2.5 my-3 w-full h-[80px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-black focus:border-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
        placeholder="Write your text here..."
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="flex mb-5 items-center space-x-3">
        <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
        <p className="text-left font-medium">Choose your Language.</p>
      </div>

      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
        onChange={handleChange}
        value={language}
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>

      {!loading && (
        <button
          className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
          onClick={translateText}
        >
          Translate &rarr;
        </button>
      )}
      {loading && (
        <button
          className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
          disabled
        >
          <LoadingDots color="white" style="large" />
        </button>
      )}

      {generatedTranslation && (
        <>
          <label className="block my-2 text-md text-left font-medium text-gray-900 dark:text-white">
            Translation:
          </label>
          <div
            className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(generatedTranslation);
              toast("Translation copied to clipboard", {
                icon: "✂️",
              });
            }}
          >
            <p> {generatedTranslation}</p>
          </div>
          <p className="my-1 text-sm text-gray-500 dark:text-gray-300">
            Click on translation to copy on clipboard
          </p>
        </>
      )}
    </div>
  );
};

export default TextTranslate;
