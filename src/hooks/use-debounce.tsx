import React, { useEffect } from "react";

type Props = {
  callback: () => void,
  delay: number,
  dependencies: any[]
}

export default function useDebounce(callback: Props['callback'], delay: Props['delay'], dependencies: Props['dependencies']) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies]);
}