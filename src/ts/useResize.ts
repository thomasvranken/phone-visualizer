import { useState, useEffect } from "react";

// https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
const useResize = (myRef: React.RefObject<HTMLHeadingElement>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      console.log("handling resize");
      if (myRef.current) {
        setWidth(myRef.current.offsetWidth);
        setHeight(myRef.current.offsetHeight);
        console.log(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height, myRef, width]);

  return { width, height };
};

export default useResize;
