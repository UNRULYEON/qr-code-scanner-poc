import { useEffect, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode/esm/core";

const useScanner = () => {
  const [cameraId, setCameraId] = useState<string | undefined>(undefined);
  const [scanner, setScanner] = useState<Html5Qrcode | undefined>(undefined);
  const [result, setResult] = useState<Html5QrcodeResult | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) setCameraId(devices[0].id);
      })
      .catch((err) => {
        console.error(err);
      });

    setScanner(
      new Html5Qrcode("qr-code-reader", {
        verbose: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      })
    );
  }, []);

  useEffect(() => {
    if (cameraId && scanner) {
      scanner
        .start(
          cameraId,
          {
            aspectRatio: 1,
            fps: 2,
          },
          (_, decodedResult) => {
            scanner.pause();
            setError(undefined);
            setResult(decodedResult);
          },
          (errorMessage) => {
            setError(errorMessage);
            setResult(undefined);
          }
        )
        .catch((err) => {
          console.error(err);
        });
    }
  }, [cameraId]);

  const unPauseScanner = () => scanner?.resume();

  return {
    result,
    error,
    unPauseScanner,
  } as const;
};

export default useScanner;
