import crypto from "crypto";

export const encrypt = (text: string) => {
  return crypto
    .createHmac("sha256", process.env.SECRET)
    .update(text)
    .digest("hex");
};
