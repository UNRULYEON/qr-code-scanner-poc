import { Html5QrcodeResult } from "html5-qrcode/esm/core";
import { useEffect, useState } from "react";
import useScanner from "./QRCodeReader";
import { useScannerContext } from "./ScannerContext";

const App = () => {
  const [history, setHistory] = useState<string[]>([]);
  const { ref, isReady, startScanner, result } = useScannerContext();

  useEffect(() => {
    if (isReady) startScanner();
  }, [isReady]);

  useEffect(() => {
    if (result) {
      console.log(result);
      try {
        const parsed = JSON.parse(result.decodedText);

        setHistory((h) => [JSON.stringify(parsed), ...h]);
      } catch (e) {
        console.error(e);
        startScanner();
      }
    }
  }, [result, startScanner]);

  return (
    <div className="App flex h-full w-full items-center justify-center bg-neutral-900 ">
      <div className="flex h-[600px] w-[400px] flex-col overflow-hidden rounded-lg bg-neutral-800">
        <div id="qr-code-reader" className="-invisible w-[400px]" ref={ref} />
        <div className="flex h-full w-full flex-col gap-2 p-4">
          <button
            className="rounded-full bg-neutral-700 p-3 font-bold text-white transition-all disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-500"
            disabled={!result}
            onClick={() => startScanner()}
          >
            Reset
          </button>
          <div className="overflow-hidden text-neutral-300">
            {history.map((h, i) => (
              <div key={`${i}-${h}`}>{h}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
