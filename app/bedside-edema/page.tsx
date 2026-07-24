import type { Metadata } from "next";
import EdemaNavigator from "./components";
import "./styles.css";

export const metadata: Metadata = {
  title: "Bedside Edema Navigator | Medical Hub",
  description: "身体診察から始める浮腫ベッドサイド診察支援",
};

export default function BedsideEdemaPage() {
  return <EdemaNavigator />;
}

