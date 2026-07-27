import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCode,
  faLayerGroup,
  faMobileScreenButton,
  faCartShopping,
  faPenNib,
  faRobot,
  faDiagramProject,
  faPlug,
  faMagnifyingGlass,
  faBullhorn,
  faPalette,
  faServer,
  faWrench,
  faGlobe,
  faRocket,
  faCubes,
  faLaptopCode,
  faLeaf,
  faInfinity,
  faShieldHalved,
  faChartLine,
  faDatabase,
  faCloud,
  faGears,
  faLightbulb,
  faBoxesStacked,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Services live in MongoDB, and a FontAwesome `IconDefinition` is a live object
 * (prefix, width, SVG path data) that cannot round-trip through the database.
 * So a service stores an icon *name* and this registry resolves it back to the
 * real definition at render time.
 *
 * Keys are the stable contract between the admin form's icon picker, the
 * database, and every component that renders a service. Renaming a key orphans
 * every service already using it, so add new entries instead of renaming.
 */
export const serviceIcons = {
  code: faCode,
  layers: faLayerGroup,
  mobile: faMobileScreenButton,
  cart: faCartShopping,
  pen: faPenNib,
  robot: faRobot,
  diagram: faDiagramProject,
  plug: faPlug,
  search: faMagnifyingGlass,
  megaphone: faBullhorn,
  palette: faPalette,
  server: faServer,
  wrench: faWrench,
  globe: faGlobe,
  rocket: faRocket,
  cubes: faCubes,
  laptop: faLaptopCode,
  leaf: faLeaf,
  infinity: faInfinity,
  shield: faShieldHalved,
  chart: faChartLine,
  database: faDatabase,
  cloud: faCloud,
  gears: faGears,
  lightbulb: faLightbulb,
  boxes: faBoxesStacked,
} satisfies Record<string, IconDefinition>;

export type ServiceIconName = keyof typeof serviceIcons;

/** Options for the admin icon picker, derived so the two can't drift apart. */
export const serviceIconNames = Object.keys(serviceIcons) as ServiceIconName[];

/**
 * Resolve a stored icon name. Falls back to a neutral icon rather than throwing
 * — an unknown name (renamed key, hand-edited DB row) should degrade to a dull
 * card, never take down the page that renders it.
 */
export function resolveServiceIcon(name?: string): IconDefinition {
  if (name && name in serviceIcons) {
    return serviceIcons[name as ServiceIconName];
  }
  return faCode;
}
