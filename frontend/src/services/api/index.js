import { IMAGE_BASE_URL } from "./config";
import * as adminApi from "./adminApi";
import * as trailsApi from "./trailsApi";
import * as journeysApi from "./journeysApi";
import * as contactApi from "./contactApi";
import * as destinationsApi from "./destinationsApi";
import * as faqsApi from "./faqsApi";
import * as pageHeroesApi from "./pageHeroesApi";
import * as newsletterApi from "./newsletterApi";
import * as homePageApi from "./homePageApi";
import * as testimonialsApi from "./testimonialsApi";
import * as payanaWayApi from "./payanaWayApi";
import * as storiesApi from "./storiesApi";
import * as journeyPageApi from "./journeyPageApi";
import * as layoutApi from "./layoutApi";

/**
 * Central API object that combines all API modules into one export.
 *
 * This allows the application to import a single `api` object and access
 * methods from admin, trails, journeys, contact, destinations, FAQs,
 * page heroes, newsletter, home page, testimonials, Payana Way, stories,
 * journey page, and layout API modules.
 */
export const api = {
  /**
   * Base URL used for rendering uploaded or static images.
   */
  IMAGE_BASE_URL,

  /**
   * Admin authentication, admin exports, and other admin-only API methods.
   */
  ...adminApi,

  /**
   * Trail-related API methods.
   */
  ...trailsApi,

  /**
   * Journey-related API methods.
   */
  ...journeysApi,

  /**
   * Contact, enquiry, referral, gift, and connect page API methods.
   */
  ...contactApi,

  /**
   * Destination management API methods.
   */
  ...destinationsApi,

  /**
   * FAQ management API methods.
   */
  ...faqsApi,

  /**
   * Page hero/banner management API methods.
   */
  ...pageHeroesApi,

  /**
   * Newsletter subscription and admin newsletter API methods.
   */
  ...newsletterApi,

  /**
   * Home page content API methods.
   */
  ...homePageApi,

  /**
   * Testimonial management API methods.
   */
  ...testimonialsApi,

  /**
   * Payana Way page/content API methods.
   */
  ...payanaWayApi,

  /**
   * Story/blog-related API methods.
   */
  ...storiesApi,

  /**
   * Journey page content API methods.
   */
  ...journeyPageApi,

  /**
   * Layout/header/footer/shared site settings API methods.
   */
  ...layoutApi,
};

/**
 * Re-export image base URL for files that only need image path configuration
 * without importing the full API object.
 */
export { IMAGE_BASE_URL };
