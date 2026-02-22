declare module "pdfjs-dist/build/pdf.worker.entry" {
  const workerSrc: any;
  export default workerSrc;
}

declare module "pdfjs-dist/build/pdf" {
  const pdfjs: any;
  export = pdfjs;
}
