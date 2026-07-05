// Central Font Awesome setup — import once in the root layout.
// Disables auto-CSS injection (we import the stylesheet ourselves) to avoid
// the flash-of-huge-icons issue in Next.js App Router.
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
