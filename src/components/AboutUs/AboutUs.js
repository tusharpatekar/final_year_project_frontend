import React, { useState, useEffect } from "react";

export default function AboutUs() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  // Static translations for different languages
  const translations = {
    en: {
      title: "About Us",
      content: `We are engineering students from <b>Sanjivani College of Engineering Kopargaon</b>. 
      As part of our graduation project, we aim to help farmers improve crop health by detecting diseases. 
      Our research indicates that many crops are lost due to undiagnosed diseases, leading to financial 
      and food security challenges. With innovative technology, we strive to provide timely solutions 
      to safeguard farmers' livelihoods and ensure a sustainable agricultural future.`,
    },
    hi: {
      title: "हमारे बारे में",
      content: `हम <b>संजीवनी कॉलेज ऑफ इंजीनियरिंग कोपरगांव</b> के इंजीनियरिंग छात्र हैं। 
      हमारे स्नातक परियोजना के हिस्से के रूप में, हम किसानों को फसलों के स्वास्थ्य में सुधार करने 
      में मदद करने का लक्ष्य रखते हैं। हमारा शोध यह दर्शाता है कि कई फसलें बिना निदान वाली बीमारियों 
      के कारण खो जाती हैं, जिससे वित्तीय और खाद्य सुरक्षा चुनौतियाँ उत्पन्न होती हैं। अभिनव प्रौद्योगिकी 
      के साथ, हम किसानों की आजीविका की रक्षा करने और एक सतत कृषि भविष्य सुनिश्चित करने के लिए समय पर 
      समाधान प्रदान करने का प्रयास करते हैं।`,
    },
    mr: {
      title: "आमच्याबद्दल",
      content: `आम्ही <b>संजीवनी कॉलेज ऑफ इंजीनियरिंग कोपरगांव</b> चे अभियंत्रण विद्यार्थी आहोत. 
      आमच्या पदवी प्रकल्पाचा भाग म्हणून, आम्ही शेतकऱ्यांना रोग ओळखून त्यांची पिकांची आरोग्य स्थिती सुधारण्यास मदत 
      करण्याचा उद्देश ठेवतो. आमचा संशोधन सूचित करतो की अनेक पिकं निदान न झालेल्या रोगांमुळे गमावली जातात, 
      ज्यामुळे आर्थिक आणि अन्नसुरक्षा समस्यांचा सामना करावा लागतो. अभिनव तंत्रज्ञानासह, आम्ही शेतकऱ्यांच्या 
      जीवनाधाराची सुरक्षा सुनिश्चित करण्यासाठी आणि एक टिकाऊ कृषी भविष्य तयार करण्यासाठी वेळेवर उपाय 
      प्रदान करण्याचा प्रयत्न करीत आहोत.`,
    },
  };

  // Listen for language change event and update language accordingly
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "en"); // Update the language when the event is triggered
    };

    window.addEventListener("languageChange", handleLanguageChange); // Add event listener

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  return (
    <div
      className="about min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: "url('/bg.jpg')", // Full-page agricultural background
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Fixed background while scrolling
      }}
    >
      <div className="bg-opacity-80 bg-green-800 w-11/12 md:w-2/3 p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="w-full md:w-3/4">
          <h2 className="text-4xl font-extrabold mb-4 text-center md:text-left text-white">
            {translations[language].title}
          </h2>
          <p className="text-lg leading-8 text-white" dangerouslySetInnerHTML={{
            __html: translations[language].content,
          }}></p>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/4 mt-4 md:mt-0 flex justify-center">
          <img
            src="/rightbox.jpg" // Farmer carrying soil
            alt="Farmer carrying soil"
            className="rounded-lg shadow-lg object-cover h-48 w-48"
          />
        </div>
      </div>
    </div>
  );
}
