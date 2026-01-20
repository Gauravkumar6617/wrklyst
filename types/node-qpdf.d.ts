declare module "node-qpdf" {
  interface EncryptOptions {
    userPassword?: string;
    ownerPassword?: string;
    keyLength?: 40 | 128 | 256;
    restrictions?: {
      print?: "none" | "low" | "full";
      modify?: "none" | "assembly" | "form" | "all";
      extract?: boolean;
      annotate?: boolean;
    };
  }

  export function encrypt(
    inputPath: string,
    options: EncryptOptions,
    outputPath: string,
    callback: (err: Error | null) => void,
  ): void;

  export function decrypt(
    inputPath: string,
    password: string,
    outputPath: string,
    callback: (err: Error | null) => void,
  ): void;
}
