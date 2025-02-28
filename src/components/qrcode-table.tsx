"use client";

import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // By default: QRCode library will draw this canvas
    // Custom: create a virtual canvas element ,
    // then use QRCode draw QR code on virtual canvas element
    // and edit real canvas element
    // finally, pass virtual canvas with QRCode to real canvas element
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;

    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height); // x, y, width, height
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(
      `Table ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Scan QR Code to order `,
      canvas.width / 2,
      canvas.width + 50
    );

    const virtualCanvas = document.createElement("canvas");

    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      {
        width,
        margin: 4,
      },
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
      }
    );
  }, [token, tableNumber, width]);
  return <canvas ref={canvasRef} />;
}
