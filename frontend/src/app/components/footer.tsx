"use client";

import React from "react";
import { useI18n } from "../i18n";

const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="mt-10 w-full rounded-[1.5rem] border border-slate-200/70 bg-white/60 px-6 py-4 text-center text-sm text-slate-500 backdrop-blur-xl">
      {t("footer.text")}
    </footer>
  );
};

export default Footer;
