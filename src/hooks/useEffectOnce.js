import { useEffect, useRef } from "react";

/* This hook is used to run only once */
/*  NOTE: Due to strict mode of react v18, the useEffect runs twice.
This hook helps us solve this issue  */

const useEffectOnce = (callback) => {
  const useEffectRef = useRef(null);

  useEffect(() => {
    if (useEffectRef.current) {
      return;
    }
    useEffectRef.current = true;
    callback();
  });
};

export default useEffectOnce;
