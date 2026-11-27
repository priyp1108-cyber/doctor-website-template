import type { GetServerSideProps } from "next";
import { makePage } from "@keystatic/next/ui/pages";
import keystaticConfig, { editorEnabled } from "../../../keystatic.config";

/**
 * The website editor (Journal + treatments). It lives in the Pages Router on purpose: the site's
 * root layout (smooth scroll, reveal animations, site CSS) must not wrap
 * the editor UI. See keystatic.config.ts.
 */
export default makePage(keystaticConfig);

export const getServerSideProps: GetServerSideProps = async () => (editorEnabled ? { props: {} } : { notFound: true });
