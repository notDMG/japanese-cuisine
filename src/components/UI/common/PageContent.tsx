'use client'

import { siteConf } from "@/config/site.conf";
import DOMPurify from "isomorphic-dompurify";
import HTMLReactParser from "html-react-parser/lib/index";
import { usePathname } from "next/navigation"

export function PageContent() {
  const pathName = usePathname();
  const pageContent= siteConf.pageContent[pathName as keyof typeof siteConf.pageContent];

  const cleanHTML = DOMPurify.sanitize(pageContent.content)

  return (
    <div>{HTMLReactParser(cleanHTML)}</div>
  )
}