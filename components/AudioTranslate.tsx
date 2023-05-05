import Image from "next/image";
import React, { useState, useEffect } from "react";
import LoadingDots from "../components/LoadingDots";
import languages from "../utils/languages";
import { Toaster, toast } from "react-hot-toast";

const AudioTranslate = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string>(languages[0].value);
  const [generatedTranslation, setGeneratedTranslation] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const url = "https://api.openai.com/v1/audio/transcriptions";

  const transcribe = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    if (language) {
      formData.append("language", language);
    }

    const headers = new Headers();
    headers.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    );

    return fetch(url, {
      method: "POST",
      body: formData,
      headers: headers,
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const translateAudio = async () => {
    setGeneratedTranslation("");
    setLoading(true);

    const transcribed = await transcribe();
    console.log(transcribed);
    console.log(transcribed.text);
    setGeneratedTranslation(transcribed.text);
    setLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
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

  const fileUrl = "/audio.mp3";

  function handleDownload() {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div className="max-w-xl w-full">
        <div className="flex flex-row mt-10 items-center space-x-3">
          <Image
            src="/1-black.png"
            width={30}
            height={30}
            alt="1 icon"
            className="mb-5 sm:mb-0"
          />
          <div className="">
            <p className="text-left font-medium ">
              Upload Audio File{" "}
              <span className="text-slate-500 mr-[1px]">
                (To download a sample file, please click
              </span>
              <span
                className="pl-1 text-green-400 font-semibold underline hover:cursor-pointer hover:text-green-500"
                onClick={handleDownload}
              >
                here
              </span>
              <span className="text-slate-500 ">)</span>.
            </p>
          </div>
        </div>

        <label className="block my-1 ml-1 text-sm text-left font-medium text-gray-900 dark:text-white">
          Upload file:
        </label>
        <input
          className="block mb-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <p className="my-2 text-sm text-gray-500 dark:text-gray-300">
          The following file formats are accepted: m4a, mp3, webm, mp4, mpga,
          wav, and mpeg.
        </p>

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
            onClick={translateAudio}
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
              <pre className="whitespace-pre-wrap break-words text-justify">
                {generatedTranslation}
              </pre>
            </div>
            <p className="my-1 text-sm text-gray-500 dark:text-gray-300">
              Click on translation to copy on clipboard
            </p>
            <div className="mb-[-80px]" />
          </>
        )}
      </div>
    </div>
  );
};

export default AudioTranslate;
