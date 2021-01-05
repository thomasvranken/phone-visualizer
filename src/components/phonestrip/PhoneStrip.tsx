import React from "react";

function PhoneStrip(props: {}) {
  return <div className="mt-1" style={{
    position: 'relative',
    width: '100%',
    height: '100%',
    border: "2px solid lightgreen",
    backgroundColor: "white"
  }}>
    <div className="mt-4">
      Vrije ruimte voor smartphones waarin je geïnteresseerd bent
    </div>
  </div>;
}

export default PhoneStrip;
