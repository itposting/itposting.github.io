import React, { useEffect } from "react";
declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="googleAd-container">
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-4877378276818686" data-ad-slot="1107185301" data-ad-format="auto" data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAd;
