"use client";

import React from "react";
import dynamic from "next/dynamic";
import WordCounter from "@/app/components/Tools/WritingTool/WordCounter/WordCounter";
import { TOOLS_CONFIG } from "@/lib/tools-data";
import TextCompare from "@/app/components/Tools/WritingTool/TextCompare/TextCompare";
import TextFormatter from "@/app/components/Tools/WritingTool/TextFormatter/TextFormatter";
import JsonFormatter from "@/app/components/Tools/DeveloperTools/JsonFormatter/JsonFormatter";
import CodeBeautifier from "@/app/components/Tools/DeveloperTools/CodeBeautifier/CodeBeautifier";
import DummyTextGenerator from "@/app/components/Tools/WritingTool/DummyTextGenerator/DummyTextGenerator";
import ConverterTool from "@/app/components/Tools/DeveloperTools/ConverterTool/ConverterTool";
import GrammarChecker from "@/app/components/Tools/WritingTool/GrammarChecker/GrammarChecker";
import RemoveSpecialChars from "@/app/components/Tools/WritingTool/RemoveSpecialChars/RemoveSpecialChars";
import RemoveEmojis from "@/app/components/Tools/WritingTool/RemoveEmojis/RemoveEmojis";
import JsonToCsv from "@/app/components/Tools/DeveloperTools/JsonToCsv/JsonToCsv";
import TimestampConverter from "@/app/components/Tools/TimestampConverter/TimestampConverter";
import HashGenerator from "@/app/components/Tools/DeveloperTools/HashGenerator/HashGenerator";
import HtpasswdGenerator from "@/app/components/Tools/DeveloperTools/HtpasswdGenerator/HtpasswdGenerator";
import EmojiConverter from "@/app/components/Tools/WritingTool/EmojiConverter/EmojiConverter";
import TextSummarizer from "@/app/components/Tools/WritingTool/TextSummarizer/TextSummarizer";
import ReadabilityChecker from "@/app/components/Tools/WritingTool/ReadabilityChecker/ReadabilityChecker";
import KeywordDensity from "@/app/components/Tools/WritingTool/KeywordDensity/KeywordDensity";
import RegexTester from "@/app/components/Tools/DeveloperTools/RegexTester/RegexTester";
import PasswordChecker from "@/app/components/Tools/DeveloperTools/PasswordChecker/PasswordChecker";
import PasswordGenerator from "@/app/components/Tools/DeveloperTools/PasswordGenerator/PasswordGenerator";
import CommentRemover from "@/app/components/Tools/DeveloperTools/CommentRemover/CommentRemover";
import ImageConverter from "@/app/components/Tools/ImageTools/ImageConverter/ImageConverter";
import PdfToImage from "@/app/components/Tools/PdfTools/PdfToImage";
import ImageToPdf from "@/app/components/Tools/PdfTools/ImageToPdf";
import AgeCalculator from "@/app/components/Tools/Utilities/AgeCalculator/AgeCalculator";
import DateDifference from "@/app/components/Tools/Utilities/DateDifference/DateDifference";
import IpChecker from "@/app/components/Tools/Utilities/IpChecker/IpChecker";
import SpeedTest from "@/app/components/Tools/Utilities/SpeedTest/SpeedTest";
import QrGenerator from "@/app/components/Tools/Utilities/QrGenerator/QrGenerator";
import LineSorter from "@/app/components/Tools/WritingTool/LineSorter/LineSorter";
import WishFlowPage from "@/app/components/Tools/wishflow/wishflow";
import RotatePdf from "@/app/components/Tools/Pdf/RotatePdf/RotatePdf";
// import PdfEdit from "@/app/components/Tools/Pdf/PdfEdit/PdfEdit";

// Dynamically import the PDF tool with SSR disabled
const ProtectPdf = dynamic(
  () => import("@/app/components/Tools/Pdf/ProtectPdf/ProtectPdf"),
  {
    ssr: false,
    loading: () => (
      <div className="p-10 text-center font-bold text-slate-400">
        Loading Security Engine...
      </div>
    ),
  },
);
const PdfToWord = dynamic(
  () => import("@/app/components/Tools/Pdf/PdfToWord/PdfToWord"),
  { ssr: false },
);
const PdfToPpt = dynamic(
  () => import("@/app/components/Tools/Pdf/PdfToPpt/PdfToPpt"),
  { ssr: false },
);
const PdfToExcel = dynamic(() =>
  import("@/app/components/Tools/Pdf/PdfToExcel/PdfToExcel").then(
    (mod) => mod.default,
  ),
);
const PdfToHtml = dynamic(
  () => import("@/app/components/Tools/Pdf/PdfToHtml/PdfToHtml"),
);
// merge-pdf
const PdfMerge = dynamic(
  () => import("@/app/components/Tools/Pdf/MergePdf/MergePdf"),
);
const PdfSplit = dynamic(
  () => import("@/app/components/Tools/Pdf/SplitPdf/SplitPdf"),
);
const PdfCompress = dynamic(
  () => import("@/app/components/Tools/Pdf/CompressPdf/CompressPdf"),
);
const PdfUnlock = dynamic(
  () => import("@/app/components/Tools/Pdf/UnlockPdf/UnlockPdf"),
);
const PdfToPdfA = dynamic(
  () => import("@/app/components/Tools/Pdf/PdfToPdfA/PdfToPdfA"),
);

// Add your other tools here
const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // --- ✍️ WRITING & CONTENT TOOLS ---
  "word-counter": WordCounter,
  "grammar-checker": GrammarChecker,
  "text-summarizer": TextSummarizer,
  "readability-checker": ReadabilityChecker,
  "paragraph-counter": ReadabilityChecker, // Reusing the advanced logic
  "keyword-density-checker": KeywordDensity,
  "dummy-text-generator": DummyTextGenerator,
  "text-formatter": TextFormatter,
  "text-compare": TextCompare,
  "remove-special-characters": RemoveSpecialChars,
  "remove-emojis": RemoveEmojis,
  "emoji-converter": EmojiConverter,
  "line-sorter": LineSorter,

  // --- 💻 DEVELOPER & DATA TOOLS ---
  "json-formatter": JsonFormatter,
  "json-to-csv": JsonToCsv,
  "code-beautifier": CodeBeautifier,
  "comment-remover": CommentRemover,
  "regex-tester": RegexTester,
  "timestamp-converter": TimestampConverter,
  "text-to-slug": () => <ConverterTool mode="slug" />,
  "url-encoder-decoder": () => <ConverterTool mode="url-enc" />,
  "base64-encoder-decoder": () => <ConverterTool mode="base64-enc" />,

  // --- 🔐 SECURITY & HASHING TOOLS ---
  "hash-generator": HashGenerator,
  "password-generator": PasswordGenerator,
  "password-strength-checker": PasswordChecker,
  "htpasswd-generator": HtpasswdGenerator,

  ///Image tools ////
  "image-converter": ImageConverter,

  // --- 🔄 STANDARD CONVERTERS ---
  "jpg-to-png": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/png"
      title="JPG to PNG Converter"
    />
  ),
  "png-to-jpg": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/jpeg"
      title="PNG to JPG Converter"
    />
  ),
  "webp-to-png": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/png"
      title="WebP to PNG Converter"
    />
  ),
  "png-to-webp": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/webp"
      title="PNG to WebP Converter"
    />
  ),

  // --- 🆕 MISSING TOOLS (Add these now) ---
  "webp-to-jpg": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/jpeg"
      title="WebP to JPG Converter"
    />
  ),
  "jpg-to-webp": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/webp"
      title="JPG to WebP Converter"
    />
  ),
  "png-to-bmp": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/bmp"
      title="PNG to BMP Converter"
    />
  ),
  "bmp-to-png": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/png"
      title="BMP to PNG Converter"
    />
  ),
  "gif-to-png": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/png"
      title="GIF to PNG Converter"
    />
  ),

  // --- ⚡ OPTIMIZERS ---
  "jpg-to-jpg": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/jpeg"
      title="JPG Optimizer"
      isOptimizer={true}
    />
  ),
  "png-to-png": (props) => (
    <ImageConverter
      {...props}
      defaultTarget="image/png"
      title="PNG Optimizer"
      isOptimizer={true}
    />
  ),
  // --- 📄 PDF TOOLS ---
  "pdf-to-jpg": (props) => <PdfToImage {...props} format="image/jpeg" />,
  "pdf-to-png": (props) => <PdfToImage {...props} format="image/png" />,

  // New Separate Tools
  "image-to-pdf": ImageToPdf, // General version
  "jpg-to-pdf": (props) => (
    <ImageToPdf
      {...props}
      title="JPG to PDF Converter"
      acceptedTypes="image/jpeg"
    />
  ),
  "png-to-pdf": (props) => (
    <ImageToPdf
      {...props}
      title="PNG to PDF Converter"
      acceptedTypes="image/png"
    />
  ),

  ///
  "protect-pdf": ProtectPdf,
  "unlock-pdf": PdfUnlock,
  "pdf-to-word": PdfToWord,
  "pdf-to-powerpoint": PdfToPpt,
  "pdf-to-excel": PdfToExcel,
  "pdf-to-html": PdfToHtml,
  "merge-pdf": PdfMerge,
  "split-pdf": PdfSplit,
  "compress-pdf": PdfCompress,
  "pdf-to-pdfa": PdfToPdfA,

  "rotate-pdf": RotatePdf,
  // "pdf-edits": PdfEdit,
  ////utility///
  "age-calculator": AgeCalculator,
  "date-difference": DateDifference,
  "ip-checker": IpChecker,
  "speed-test": SpeedTest,
  "qr-generator": QrGenerator,

  "wish-flow": WishFlowPage,
};

export default function ToolRenderer({
  slug,
  toolName,
}: {
  slug: string;
  toolName: string;
}) {
  const ActiveTool = TOOL_COMPONENTS[slug];

  if (!ActiveTool) {
    return (
      <div className="text-center py-20 italic text-slate-400">
        Logic for {toolName} is coming soon...
      </div>
    );
  }

  return <ActiveTool />;
}
