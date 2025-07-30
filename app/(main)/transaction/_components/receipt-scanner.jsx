import { scanReceipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { Camera, Loader2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef();

  const {
    loading: scanLoading,
    fn: scanFn,
    data: scanResult,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    await scanFn(file);
  };

  useEffect(() => {
    if (scanResult && !scanLoading) {
      onScanComplete(scanResult);
      toast.success("Receipt scanned successfully");
    }
  }, [scanLoading, scanResult]);
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleReceiptScan(file);
          }
        }}
      />

      <Button
        className="w-full h-10 bg-gradient-to-br from-orange-300 via-blue-400 to-green-400 animate-gradient hover:opacity-90
      transition-opacity text-black"
        onClick={() => fileInputRef.current.click()}
        disabled={scanLoading}
      >
        {" "}
        {scanLoading ? (
          <>
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="w-6 h-6 mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}{" "}
      </Button>
    </div>
  );
};

export default ReceiptScanner;
