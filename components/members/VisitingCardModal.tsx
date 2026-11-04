"use client";

import { useEffect, useRef, useState } from "react";
import {
  ContactRound,
  Download,
  Instagram,
  Mail,
  Phone,
  X,
} from "lucide-react";
import QRCode from "qrcode";

export interface VisitingCardMember {
  username: string;
  name: string;
  designation: string;
  phone?: string | null;
  email?: string | null;
  personalInstagram?: string | null;
  image?: string | null;
  company?: string | null;
  companyLogo?: string | null;
}

function instagramHref(value: string) {
  const clean = value.trim();
  if (!clean) return null;
  return /^https?:\/\//i.test(clean)
    ? clean
    : `https://www.instagram.com/${clean.replace(/^@/, "")}/`;
}

function fileName(value: string) {
  const safeName = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeName || "Member"}-Visiting-Card.pdf`;
}

async function waitForCardImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) return;
      if (typeof image.decode === "function") {
        await image.decode();
        return;
      }
      await new Promise<void>((resolve, reject) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener(
          "error",
          () => reject(new Error("A card image could not be loaded.")),
          { once: true },
        );
      });
    }),
  );
}

export default function VisitingCardModal({
  member,
}: {
  member: VisitingCardMember;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [qrError, setQrError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const instagram = member.personalInstagram
    ? instagramHref(member.personalInstagram)
    : null;
  const initials = member.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const url = new URL(
      `/members/${encodeURIComponent(member.username)}`,
      window.location.origin,
    ).toString();
    let cancelled = false;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    void QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: { dark: "#08245d", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrCode(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, member.username]);

  function openModal() {
    setProfileUrl(
      new URL(
        `/members/${encodeURIComponent(member.username)}`,
        window.location.origin,
      ).toString(),
    );
    setQrCode("");
    setQrError(false);
    setDownloadError("");
    setIsOpen(true);
  }

  async function downloadPdf() {
    const card = cardRef.current;
    if (!card || !qrCode || isDownloading) return;

    setIsDownloading(true);
    setDownloadError("");
    try {
      await waitForCardImages(card);
      await document.fonts.ready;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(card, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: 1050,
        height: 600,
        windowWidth: 1050,
        onclone: (documentClone) => {
          const clonedCard = documentClone.querySelector(
            "[data-visiting-card-export]",
          ) as HTMLElement | null;
          if (clonedCard) {
            clonedCard.style.width = "1050px";
            clonedCard.style.height = "600px";
            clonedCard.style.maxWidth = "none";
            clonedCard.style.transform = "none";
          }
        },
        ignoreElements: (element) =>
          element.hasAttribute("data-html2canvas-ignore"),
      });
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [175, 100],
        compress: true,
      });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        175,
        100,
        undefined,
        "FAST",
      );
      pdf.save(fileName(member.name));
    } catch (error) {
      console.error("Unable to download visiting card PDF:", error);
      setDownloadError("The PDF could not be created. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex min-h-10 items-center gap-2 rounded border border-[#12358f] bg-white px-4 py-2 text-sm font-bold text-[#12358f] shadow-sm transition-colors hover:bg-[#eff4ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]"
      >
        <ContactRound aria-hidden="true" className="h-4 w-4" /> View Card
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="visiting-card-title"
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-xl border border-white/70 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#c8102e]">
                  Member
                </p>
                <h2
                  id="visiting-card-title"
                  className="mt-0.5 text-lg font-extrabold tracking-tight text-[#08245d]"
                >
                  Membership Card
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close visiting card"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#08245d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-[#edf2fc] p-3 sm:p-5">
              <div className="group relative mx-auto w-full max-w-[820px]">
                <div
                  ref={cardRef}
                  data-visiting-card-export
                  className="relative isolate aspect-[3.5/2] w-full overflow-hidden rounded-[clamp(12px,2vw,28px)] border border-[#dbe3f3] bg-white text-[#08245d] shadow-[0_18px_45px_rgba(8,36,93,0.18)]"
                  style={{ containerType: "inline-size" }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/member-card-corners/top-right.png"
                      alt=""
                      className="absolute right-0 top-0 w-[27%] object-contain object-right-top"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/member-card-corners/bottom-left.png"
                      alt=""
                      className="absolute bottom-0 left-0 w-[18%] object-contain object-left-bottom"
                      style={{
                        clipPath:
                          "polygon(0 0, 48% 0, 48% 55%, 100% 55%, 100% 100%, 0 100%)",
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex h-full flex-col px-[5%] pb-[2%] pt-[3%]">
                    <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_34%] gap-[4%] py-[2%]">
                      <div className="flex min-w-0 flex-col justify-center border-r border-[#bdc9df] pr-[5%]">
                        <div className="flex min-h-0 items-center gap-[3%]">
                          <div className="aspect-square w-[25%] shrink-0 overflow-hidden rounded-[14%] border-[3px] border-white bg-[#eaf0fc] shadow-[3px_3px_0_#e51b2b,0_5px_14px_rgba(8,36,93,0.18)]">
                            {member.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={member.image}
                                crossOrigin="anonymous"
                                alt={`${member.name} profile`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[5cqi] font-black text-[#12358f]/50">
                                {initials}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 break-words text-[4.1cqi] font-extrabold leading-[1.06] tracking-tight">
                              {member.name}
                            </h3>
                            <p className="mt-[1.2%] line-clamp-2 break-words text-[2.9cqi] font-medium text-slate-600">
                              {member.designation || "Member"}
                            </p>
                            <div className="mt-[2%] h-[3px] w-[15%] rounded-full bg-[#e51b2b]" />
                          </div>
                        </div>

                        <div className="mt-[3%] space-y-[1.3%] pl-[1%]">
                          {member.phone ? (
                            <a
                              href={`tel:${member.phone}`}
                              className="flex min-w-0 items-center gap-[2%] border-b border-[#e3e9f3] pb-[1%] text-[2.3cqi] leading-tight"
                            >
                              <Phone
                                aria-hidden="true"
                                className="h-[2.8cqi] w-[2.8cqi] shrink-0 text-[#12358f]"
                              />{" "}
                              <span className="truncate">{member.phone}</span>
                            </a>
                          ) : null}
                          {member.email ? (
                            <a
                              href={`mailto:${member.email}`}
                              className="flex min-w-0 items-center gap-[2%] border-b border-[#e3e9f3] pb-[1%] text-[2.3cqi] leading-tight"
                            >
                              <Mail
                                aria-hidden="true"
                                className="h-[2.8cqi] w-[2.8cqi] shrink-0 text-[#12358f]"
                              />{" "}
                              <span className="truncate">{member.email}</span>
                            </a>
                          ) : null}
                          {instagram ? (
                            <a
                              href={instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="flex min-w-0 items-center gap-[2%] text-[2.3cqi] leading-tight"
                            >
                              <Instagram
                                aria-hidden="true"
                                className="h-[2.8cqi] w-[2.8cqi] shrink-0 text-[#e51b2b]"
                              />{" "}
                              <span className="truncate">
                                {member.personalInstagram?.startsWith("@")
                                  ? member.personalInstagram
                                  : `@${member.personalInstagram?.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/$/, "")}`}
                              </span>
                            </a>
                          ) : null}
                          {!member.phone && !member.email && !instagram ? (
                            <span className="text-[2.5cqi] text-slate-500">
                              Contact details unavailable
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col items-center justify-center gap-[4%]">
                        {qrCode && !qrError ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={qrCode}
                            alt={`QR code linking only to ${profileUrl}`}
                            className="aspect-square w-[58%] rounded-[10%] border-2 border-[#d6dfef] bg-white p-[2%]"
                          />
                        ) : (
                          <div
                            className="flex aspect-square w-[58%] items-center justify-center rounded-[10%] border-2 border-[#d6dfef] bg-white p-[3%] text-center text-[2cqi] text-slate-500"
                            role={qrError ? "alert" : "status"}
                          >
                            {qrError ? "QR unavailable" : "Creating QR code…"}
                          </div>
                        )}
                        {member.companyLogo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={member.companyLogo}
                            alt={`${member.company || "Company"} logo`}
                            className="max-h-[25%] max-w-[76%] object-contain"
                          />
                        ) : null}
                      </div>
                    </main>

                    <footer className="relative grid h-[22%] shrink-0 grid-cols-[7fr_3fr] before:absolute before:inset-x-[1%] before:top-0 before:h-px before:bg-gradient-to-r before:from-[#12358f] before:via-[#7751bb] before:to-[#e51b2b]">
                      {/* EDGE INDIA */}
                      <div className="flex h-full min-w-0 flex-col items-center justify-center gap-[3%]">
                        <span className="text-center text-[2cqi] font-semibold italic leading-none text-[#102b61]">
                          A proud member of
                        </span>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/compony-logos/edege-india-logo-png-file.png"
                          alt="EDGE INDIA"
                          className="h-[42%] max-h-full max-w-[74%] object-contain"
                        />
                      </div>

                      {/* VORTEX TECHNOLOGY PARTNER */}
                      <div className="relative flex h-full min-w-0 flex-col items-center justify-center gap-[3%] before:absolute before:bottom-[20%] before:left-0 before:top-[20%] before:w-px before:bg-[#d3dced]">
                        <span className="text-center text-[2cqi] font-semibold italic leading-none text-[#102b61]">
                          Technology Partner
                        </span>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/compony-logos/vortex-global-technologies-wide.png"
                          alt="Vortex Global Technologies"
                          className="h-[38%] max-h-full max-w-[78%] object-contain"
                        />
                      </div>
                    </footer>
                  </div>
                </div>

                <div
                  data-html2canvas-ignore
                  className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-[#071a3a]/0 opacity-0 transition duration-300 group-hover:bg-[#071a3a]/15 group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={!qrCode || isDownloading}
                    className="pointer-events-auto inline-flex min-h-12 items-center gap-2 rounded-full bg-[#08245d] px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-[#12358f] disabled:cursor-wait disabled:opacity-75"
                  >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    {isDownloading ? "Preparing PDF…" : "Download PDF"}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-500">
                Hover over the card to download a print-ready PDF.
              </p>
              {downloadError ? (
                <p
                  role="alert"
                  className="mt-2 text-center text-sm font-medium text-rose-700"
                >
                  {downloadError}
                </p>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
