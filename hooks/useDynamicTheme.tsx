import { useCallback, useState, useEffect, useRef } from "react";
import { getDynamicTheme } from "../utils/DynamicTheme";

export function useDynamicTheme(
  src: string | null,
  light = 100,
  noFontColor = false
) {
  const [color, setColor] = useState();
  const isMountedRef = useRef();

  const getCardTheme = useCallback(
    async (src: string, light: number, noFontColor: boolean) => {
      var im = new Image();
      im.src = src;

      im.onload = () => {
        let a = getDynamicTheme(im, light, noFontColor);
        setColor(a);
      };
    },
    [isMountedRef]
  );

  useEffect(() => {
    if (src) {
      getCardTheme(src, light, noFontColor);
    } else {
      setColor(null);
    }
  }, [src, light, noFontColor, getCardTheme]);

  return color;
}
