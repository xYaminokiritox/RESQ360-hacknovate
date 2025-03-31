declare module 'otp-generator' {
  interface OTPOptions {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
  }

  function generate(length: number, options?: OTPOptions): string;
  export = generate;
} 