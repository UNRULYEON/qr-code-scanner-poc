import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode/esm/core";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type State = {
  isReady: boolean;
  cameraId: string | undefined;
  scanner: Html5Qrcode | undefined;
  ref: any | undefined;
  result: Html5QrcodeResult | undefined;
  error: string | undefined;
  startScanner: () => void;
  pauseScanner: () => void;
  resumeScanner: () => void;
  stopScanner: () => void;
};

const initialState: State = {
  isReady: false,
  cameraId: undefined,
  scanner: undefined,
  ref: undefined,
  result: undefined,
  error: undefined,
  startScanner: () => {},
  pauseScanner: () => {},
  resumeScanner: () => {},
  stopScanner: () => {},
};

const Context = createContext<State>(initialState);

type ScannerContextProps = {
  elementId: string;
  children: ReactNode;
};

const ScannerContext: FC<ScannerContextProps> = ({ elementId, children }) => {
  const [isReady, setIsReady] = useState(false);
  const [cameraId, setCameraId] = useState<string | undefined>(undefined);
  const [scanner, setScanner] = useState<State["scanner"]>(
    initialState.scanner
  );
  const ref = useRef<any>(undefined);

  const [result, setResult] = useState<Html5QrcodeResult | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  // Initialise scanner
  useEffect(() => {
    if (isReady || !elementId) return;

    if (ref.current) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            setCameraId(devices[0].id);
            setScanner(
              new Html5Qrcode(elementId, {
                verbose: true,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
              })
            );
            setIsReady(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ref.current, isReady, elementId]);

  const successCallback = (_: string, decodedResult: Html5QrcodeResult) => {
    if (!scanner) return;

    scanner.stop();
    setError(undefined);
    setResult(decodedResult);
  };

  const errorCallback = (errorMessage: string) => {
    setError(errorMessage);
    setResult(undefined);
  };

  const startScanner = () => {
    if (!isReady || !cameraId || !scanner) return;

    scanner
      .start(
        cameraId,
        {
          aspectRatio: 1,
          fps: 2,
        },
        successCallback,
        errorCallback
      )
      .catch((err) => {
        console.error(err);
      });
  };

  const pauseScanner = () => {
    if (!isReady || !scanner) return;

    scanner.pause();
  };

  const resumeScanner = () => {
    if (!isReady || !scanner) return;

    console.log(scanner.getState());

    scanner.resume();
  };

  const stopScanner = () => {
    if (!isReady || !scanner) return;

    scanner.stop();
  };

  return (
    <Context.Provider
      value={{
        isReady,
        cameraId,
        scanner,
        ref,
        result,
        error,
        startScanner,
        pauseScanner,
        resumeScanner,
        stopScanner,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useScannerContext = () => useContext(Context);

export default ScannerContext;
