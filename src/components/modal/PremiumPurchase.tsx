"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import Modal from "./Modal";

export default function PremiumPurchase() {
  const searchParams = useSearchParams();

  if (searchParams.get("purchase") !== "premium") {
    return null;
  }

  return <PremiumPurchaseContent />;
}

function PremiumPurchaseContent() {
  return (
    <Modal>
      <div className="relative flex w-full max-w-xl flex-col gap-4 rounded-t border border-zinc-800 bg-zinc-900 px-8 py-4">
        <div className="text-medium grid-flow-rows z-10 grid h-28 grid-cols-[28px,_auto] grid-rows-[28px,_auto] gap-x-1">
          <ShieldCheckIcon className="row-span-2 h-7 w-7 text-rose-500" />
          <h1 className="text-lg capitalize tracking-wide">
            buy shreddit premium!
          </h1>
          <p className="max-w-[10rem] text-sm">
            You&apos;re purchasing Shreddit Premium for yourself!
          </p>
        </div>
        <Image
          src="https://www.redditstatic.com/desktop2x/img/gold/premium-hero-g.jpg"
          alt="premium banner"
          width={3040}
          height={1088}
          className="absolute left-0 top-0 h-32 rounded-t object-cover object-bottom"
        />
        <fieldset className="flex gap-4">
          <label className="flex gap-2.5">
            <input
              type="radio"
              name="payment-option"
              value="creditCard"
              defaultChecked
            />
            <div className="flex items-center gap-2 rounded bg-zinc-300 p-2">
              <Image
                src="https://www.redditstatic.com/desktop2x/img/payment-icons/visa.png"
                alt="visa"
                height={21}
                width={60}
                className="h-8 w-8 object-contain"
              />
              <Image
                src="https://www.redditstatic.com/desktop2x/img/payment-icons/mastercard.png"
                alt="mastercard"
                height={37}
                width={60}
                className="h-8 w-8 object-contain"
              />
              <Image
                src="https://www.redditstatic.com/desktop2x/img/payment-icons/amex.png"
                alt="amex"
                height={21}
                width={60}
                className="h-8 w-8 object-contain"
              />
              <Image
                src="https://www.redditstatic.com/desktop2x/img/payment-icons/discover.jpg"
                alt="discover"
                height={10}
                width={60}
                className="h-8 w-8 object-contain"
              />
            </div>
          </label>

          <label className="flex gap-2.5">
            <input type="radio" name="payment-option" value="paypal" />
            <div className="flex items-center gap-2 rounded bg-zinc-300 p-2">
              <Image
                src="https://www.redditstatic.com/desktop2x/img/payment-icons/paypal.png"
                alt="paypal"
                height={60}
                width={59}
                className="h-8 w-8 object-contain"
              />
            </div>
          </label>
        </fieldset>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <input
            className="col-span-2 rounded bg-zinc-800 px-4 py-3 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 placeholder:uppercase focus:ring-zinc-300"
            placeholder="name on card"
          />
          <input
            className="rounded bg-zinc-800 px-4 py-3 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 placeholder:uppercase focus:ring-zinc-300"
            placeholder="card number"
          />
          <input
            className="rounded bg-zinc-800 px-4 py-3 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 placeholder:uppercase focus:ring-zinc-300"
            placeholder="mm/yy"
          />
          <input
            className="rounded bg-zinc-800 px-4 py-3 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 placeholder:uppercase focus:ring-zinc-300"
            placeholder="cvc"
          />
          <input
            className="rounded bg-zinc-800 px-4 py-3 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 placeholder:uppercase focus:ring-zinc-300"
            placeholder="zip code"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-medium tracking-wide">Total: $49.99/yearly</h2>
          <p className="text-xs font-medium">
            By completing your purchase, you are agreeing to automatic payments
            for Shreddit Premium and Shreddit’s{" "}
            <Link
              href="https://utfs.io/f/6d2aac46-9ced-4376-abf4-d6be13b2a4ab-pmcoca.jpg"
              target="_blank"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              User Agreement
            </Link>{" "}
            and{" "}
            <Link
              href="https://utfs.io/f/6d2aac46-9ced-4376-abf4-d6be13b2a4ab-pmcoca.jpg"
              target="_blank"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              Privacy Policy
            </Link>
            . Your Premium subscription will auto-renew yearly for $49.99 (plus
            tax where applicable). Cancel at least 24 hours before your
            subscription ends to avoid getting charged for the next year. No
            partial refunds. No shreking around.
          </p>
        </div>
        <hr className="border-zinc-700/70" />
        <button
          className="self-end rounded-full bg-zinc-300 px-4 py-1.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400"
          onClick={() => toast.info("Currently unavaliable.")}
        >
          Complete purchase
        </button>
      </div>
    </Modal>
  );
}
