import "@testing-library/jest-dom/vitest";
import { createElement, type ImgHTMLAttributes } from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement>) =>
    createElement("img", { alt: alt ?? "", src: String(src), ...props }),
}));
