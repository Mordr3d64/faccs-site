import React, { useState } from 'react';

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      title: "Ano ang Federation of Agriculture Cooperatives in Camarines Sur (FACCS)? / What is FACCS?",
      answer: "Ang Federation of Agriculture Cooperatives in Camarines Sur (FACCS) ay isang pangalawang kooperatiba na itinatag noong Agosto 15, 2019. Layunin nitong pag-isahin ang mga mapagkumpetensyang, napapanatili, at makabagong teknolohiyang kooperatiba sa agrikultura sa Camarines Sur.",
      answerEnglish: "The Federation of Agriculture Cooperatives in Camarines Sur (FACCS) is a secondary cooperative established on August 15, 2019. It aims to unify competitive, sustainable, and technology-based agriculture cooperatives in Camarines Sur."
    },
    {
      title: "Anong mga serbisyo ang iniaalok ng FACCS? / What services does FACCS offer?",
      answer: "Ang FACCS ay nagbibigay ng iba't ibang serbisyo tulad ng pinansyal na tulong, pagsasanay sa agrikultura, suporta sa pag-access sa merkado, at pagsasama ng teknolohiya upang mapabuti ang ani at pagpapanatili ng sakahan.",
      answerEnglish: "FACCS provides various services including financial assistance, agricultural training, market access support, and technology integration to help farmers enhance productivity and sustainability."
    },
    {
      title: "Paano ako magiging miyembro ng FACCS? / How can I become a member of FACCS?",
      answer: "Upang maging miyembro ng FACCS, kailangang miyembro ka ng isang pangunahing kooperatiba sa Camarines Sur. Maaari kang makipag-ugnayan sa amin sa federation.agricoops.camarinessur@gmail.com o tumawag sa +63 948 933 4240 para sa karagdagang impormasyon.",
      answerEnglish: "To become a member of FACCS, you must be part of a primary cooperative in Camarines Sur. You can contact us at federation.agricoops.camarinessur@gmail.com or call +63 948 933 4240 for more details."
    },
    {
      title: "Paano ako makakakuha ng tulong pinansyal mula sa FACCS? / How can I get financial assistance from FACCS?",
      answer: "Ang FACCS ay nagbibigay ng iba't ibang programa ng tulong pinansyal para sa mga magsasaka. Upang mag-apply, makipag-ugnayan sa amin sa pamamagitan ng federation.agricoops.camarinessur@gmail.com o tumawag sa +63 948 933 4240.",
      answerEnglish: "FACCS offers various financial aid programs for farmers. You may apply by contacting us at federation.agricoops.camarinesur@gmail.com or calling +63 948 933 4240."
    },
    {
      title: "Paano ako makakakuha ng impormasyon sa panahon? / How can I get weather updates?",
      answer: "Maaari mong bisitahin ang aming seksyon na 'Weather' sa website upang makuha ang pinakabagong impormasyon tungkol sa lagay ng panahon sa Camarines Sur.",
      answerEnglish: "You can visit our 'Weather' section on our website to get the latest updates on weather conditions in Camarines Sur."
    },
    {
      title: "Paano makontak ang FACCS? / How can I contact FACCS?",
      answer: "Maaari mo kaming tawagan sa +63 948 933 4240 o i-email sa federation.agricoops.camarinessur@gmail.com. Maaari mo ring bisitahin ang aming opisina sa Naga City, Camarines Sur.",
      answerEnglish: "You can contact us via phone at +63 948 933 4240 or email us at federation.agricoops.camarinessur@gmail.com. You may also visit our office in Naga City, Camarines Sur."
    }
  ];

  return (
    <div className="faqs-container">
      <h1>FAQs / Mga Madalas Itanong</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button onClick={() => toggleFAQ(index)} className="faq-question">
            {faq.title} {openIndex === index ? "▲" : "▼"}
          </button>
          {openIndex === index && (
            <div className="faq-answer">
              <p><strong>🇵🇭 Tagalog:</strong> {faq.answer}</p>
              <p><strong>English:</strong> {faq.answerEnglish}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQs; 