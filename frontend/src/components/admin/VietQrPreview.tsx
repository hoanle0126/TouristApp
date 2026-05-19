"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, QrCode } from "lucide-react";

interface VietQrPreviewProps {
  readonly bankBin: string;
  readonly bankName: string;
  readonly accountNumber: string;
  readonly accountName: string;
}

function buildVietQrUrl(
  bankBin: string,
  accountNumber: string,
  accountName: string,
) {
  const query = new URLSearchParams({
    accountName,
    addInfo: "CURATOR PREVIEW",
  });

  return `https://img.vietqr.io/image/${encodeURIComponent(bankBin)}-${encodeURIComponent(accountNumber)}-compact2.png?${query.toString()}`;
}

export function VietQrPreview({
  bankBin,
  bankName,
  accountNumber,
  accountName,
}: Readonly<VietQrPreviewProps>) {
  const [imageError, setImageError] = useState(false);

  const trimmedBin = bankBin.trim();
  const trimmedBank = bankName.trim();
  const trimmedNumber = accountNumber.trim();
  const trimmedName = accountName.trim();

  const missing: string[] = [];
  if (!trimmedBin) missing.push("Bank BIN");
  if (!trimmedBank) missing.push("Bank name");
  if (!trimmedNumber) missing.push("Account number");
  if (!trimmedName) missing.push("Account name");

  const hasAllFields = missing.length === 0;
  const qrUrl = hasAllFields
    ? buildVietQrUrl(trimmedBin, trimmedNumber, trimmedName)
    : null;

  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <QrCode className="size-4 text-red-800" />
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
          Live QR preview
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-white p-3">
          {qrUrl && !imageError ? (
            <Image
              alt="VietQR payment preview"
              className="h-auto w-full object-contain"
              height={520}
              key={qrUrl}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
              src={qrUrl}
              width={400}
              unoptimized
            />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 px-4 text-center">
              <AlertTriangle className="size-8 text-rose-500" />
              <p className="text-xs font-bold text-rose-700">QR unavailable</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-3">
          {hasAllFields && !imageError ? (
            <>
              <div className="flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <p className="font-medium">
                  QR is generating successfully. Customers will see this image
                  after submitting checkout.
                </p>
              </div>
              <dl className="grid gap-1 text-xs text-stone-600">
                <div className="flex justify-between gap-4">
                  <dt className="font-bold uppercase tracking-[0.18em] text-stone-500">
                    Bank
                  </dt>
                  <dd className="text-right font-medium text-stone-900">
                    {trimmedBank}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-bold uppercase tracking-[0.18em] text-stone-500">
                    Account
                  </dt>
                  <dd className="text-right font-medium text-stone-900">
                    {trimmedNumber}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-bold uppercase tracking-[0.18em] text-stone-500">
                    Holder
                  </dt>
                  <dd className="text-right font-medium text-stone-900">
                    {trimmedName}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="size-4 text-rose-600" />
                {imageError
                  ? "QR generation failed"
                  : "QR cannot be generated yet"}
              </div>
              {imageError ? (
                <p className="mt-2 leading-relaxed">
                  vietqr.io rejected these credentials. Double-check the Bank
                  BIN and Account number — invalid combinations will leave
                  customers without a QR at checkout.
                </p>
              ) : (
                <p className="mt-2 leading-relaxed">
                  Missing: <strong>{missing.join(", ")}</strong>. Customers
                  will not see a QR at checkout until every field is filled.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
