/* global tns */
import Component from "@ember/component";
import { concat } from "@ember/helper";
import { action, computed, set } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { Promise } from "rsvp";
import { and } from "truth-helpers";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import DButton from "discourse/components/d-button";
import avatar from "discourse/helpers/avatar";
import icon from "discourse/helpers/d-icon";
import htmlSafe from "discourse/helpers/html-safe";
import { ajax } from "discourse/lib/ajax";
import cookie from "discourse/lib/cookie";
import discourseComputed from "discourse/lib/decorators";
import loadScript from "discourse/lib/load-script";
import { i18n } from "discourse-i18n";
import moment from "moment";

export default class BigCarousel extends Component {
  @service router;

  isLoading = true;
  sliderInstance = null;
  @tracked carouselClosed = this.cookieClosed || false;
  @tracked componentElement = null;

  // Helper function to determine if a link is external
  isExternalLink(url) {
    if (!url) return false;

    // Handle relative URLs (internal)
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return false;
    }

    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }

    try {
      const linkUrl = new URL(url);
      const currentUrl = new URL(window.location.href);

      // Compare hostnames to determine if external
      return linkUrl.hostname !== currentUrl.hostname;
    } catch (error) {
      // If URL parsing fails, assume it's internal
      return false;
    }
  }

  // Helper to get link attributes for external links
  getLinkAttributes(url) {
    if (this.isExternalLink(url)) {
      return {
        target: "_blank",
        rel: "noopener noreferrer"
      };
    }
    return {};
  }

  get cookieClosed() {
    // Handle "until_reload" option using sessionStorage
    if (settings.big_carousel_cookie_lifespan === "until_reload") {
      try {
        const sessionData = sessionStorage.getItem("big_carousel_closed");
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          return parsed.name === settings.big_carousel_cookie_name &&
                 parsed.closed === "true" &&
                 parsed.pageLoadId === this.getPageLoadId();
        }
      } catch (error) {
        console.warn("Error parsing carousel session data:", error);
      }
      return false;
    }

    // Handle persistent cookie options
    const cookieData = cookie("big_carousel_closed");
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        return parsed.name === settings.big_carousel_cookie_name && parsed.closed === "true";
      } catch (error) {
        console.warn("Error parsing carousel cookie:", error);
        return false;
      }
    }
    return false;
  }

  get cookieExpirationDate() {
    if (settings.big_carousel_cookie_lifespan === "session" ||
        settings.big_carousel_cookie_lifespan === "until_reload") {
      return null; // Session cookie or until_reload (handled separately)
    } else {
      return moment().add(1, settings.big_carousel_cookie_lifespan).toDate();
    }
  }

  getPageLoadId() {
    // Generate or retrieve a unique ID for this page load session
    if (!this._pageLoadId) {
      this._pageLoadId = sessionStorage.getItem("big_carousel_page_load_id");
      if (!this._pageLoadId) {
        this._pageLoadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("big_carousel_page_load_id", this._pageLoadId);
      }
    }
    return this._pageLoadId;
  }

  @computed
  get bigSlides() {
    return JSON.parse(settings.big_carousel_slides);
  }

  @computed
  get carouselClasses() {
    let classes = "custom-big-carousel";
    if (settings.big_carousel_mobile_arrows) {
      classes += " mobile-arrows-enabled";
    }
    if (settings.big_carousel_desktop_arrows_always_visible) {
      classes += " desktop-arrows-always-visible";
    }
    return classes;
  }

  get carouselId() {
    if (!this._carouselId) {
      this._carouselId = `carousel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return this._carouselId;
  }

  @action
  closeCarousel() {
    this.carouselClosed = true;

    if (settings.big_carousel_cookie_lifespan === "until_reload") {
      // Store dismissal in sessionStorage with current page load ID
      const carouselState = {
        name: settings.big_carousel_cookie_name,
        closed: "true",
        pageLoadId: this.getPageLoadId()
      };

      try {
        sessionStorage.setItem("big_carousel_closed", JSON.stringify(carouselState));
      } catch (error) {
        console.warn("Error storing carousel dismissal in sessionStorage:", error);
      }
    } else if (settings.big_carousel_cookie_lifespan !== "session") {
      // Store dismissal in persistent cookie
      const carouselState = {
        name: settings.big_carousel_cookie_name,
        closed: "true"
      };

      const expirationDate = this.cookieExpirationDate;
      cookie("big_carousel_closed", JSON.stringify(carouselState), {
        expires: expirationDate,
        path: "/"
      });
    }
    // For "session" option, we rely on the tracked property only (no persistence)
  }

  clearDismissalState() {
    // Clear the dismissal state when the dismissible feature is disabled
    this.carouselClosed = false;

    // Clear sessionStorage (for until_reload option)
    try {
      sessionStorage.removeItem("big_carousel_closed");
    } catch (error) {
      console.warn("Error clearing carousel sessionStorage:", error);
    }

    // Clear persistent cookie
    cookie("big_carousel_closed", "", {
      expires: new Date(0), // Expire immediately
      path: "/"
    });
  }

  ensureSlider() {
    // Destroy existing slider instance if it exists
    if (this.sliderInstance && typeof this.sliderInstance.destroy === 'function') {
      try {
        this.sliderInstance.destroy();
      } catch (error) {
        console.warn('Error destroying slider instance:', error);
      }
      this.sliderInstance = null;
    }

    if (this.shouldDisplay && this.bigSlides.length > 1) {
      // set up static populated slides

      const bigStaticSlides = this.bigSlides.filterBy("slide_type", "slide");
      const staticSlides = Promise.all(
        this.bigSlides.filterBy("slide_type", "slide")
      );

      let bigUserSlides = [];

      // get user info
      const userSlides = this.bigSlides.filterBy("slide_type", "user");
      let userSetup = Promise.all(
        userSlides.map((slide) => {
          return ajax(`/u/${slide.link}.json`).then((result) => {
            set(slide, "user_info", result);
          });
        })
      );

      // get user activity
      let userActivity = Promise.all(
        userSlides.map((slide) => {
          return ajax(
            `user_actions.json?offset=0&username=${slide.link}&filter=5`
          ).then((result) => {
            set(slide, "user_activity", result.user_actions.slice(0, 3));
            bigUserSlides.push(slide);
          });
        })
      );

      Promise.all([staticSlides, userSetup, userActivity])
        .then(() => {
          this.set("bigUserSlides", bigUserSlides);
          this.set("bigStaticSlides", bigStaticSlides);
          loadScript(settings.theme_uploads.tiny_slider).then(() => {
            // Use a longer delay and multiple attempts to ensure DOM is fully rendered
            this._sliderTimeout = setTimeout(() => {
              this.initializeSliderWithRetry();
            }, 200);
          }).catch((error) => {
            console.error('Error loading tiny-slider script:', error);
          });
        })
        .finally(() => {
          this.set("isLoading", false);
        });
    }
  }

  initializeSliderWithRetry(attempt = 1, maxAttempts = 3) {
    // Check if component is still alive
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    // Find the carousel container using the unique carousel ID
    const carouselId = this.carouselId;
    let container = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-slides`);
    let prevButton = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-prev`);
    let nextButton = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-next`);
    let navContainer = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-nav`);

    // If not found with unique ID, fall back to finding within the carousel container
    if (!container) {
      const carouselContainer = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel`);
      if (carouselContainer) {
        container = carouselContainer.querySelector(".custom-big-carousel-slides");
        prevButton = carouselContainer.querySelector(".custom-big-carousel-prev");
        nextButton = carouselContainer.querySelector(".custom-big-carousel-next");
        navContainer = carouselContainer.querySelector(".custom-big-carousel-nav");
      }
    }

    if (!container) {
      if (attempt < maxAttempts) {
        console.warn(`Carousel container not found, retrying (${attempt}/${maxAttempts})...`);
        this._sliderTimeout = setTimeout(() => {
          this.initializeSliderWithRetry(attempt + 1, maxAttempts);
        }, 200 * attempt);
        return;
      } else {
        console.warn('Carousel container not found after all retries, skipping slider initialization');
        return;
      }
    }

    // Additional check to ensure container has content
    if (container.children.length === 0) {
      if (attempt < maxAttempts) {
        console.warn(`Carousel container is empty, retrying (${attempt}/${maxAttempts})...`);
        this._sliderTimeout = setTimeout(() => {
          this.initializeSliderWithRetry(attempt + 1, maxAttempts);
        }, 200 * attempt);
        return;
      } else {
        console.warn('Carousel container is empty after all retries, skipping slider initialization');
        return;
      }
    }

    // Validate that all slides have proper structure
    const slides = container.querySelectorAll('.custom-big-carousel-slide');
    if (slides.length === 0) {
      console.warn('No carousel slides found, skipping slider initialization');
      return;
    }

    // Check if slides are properly rendered (have content)
    let hasValidSlides = false;
    slides.forEach(slide => {
      if (slide.offsetHeight > 0 && slide.offsetWidth > 0) {
        hasValidSlides = true;
      }
    });

    if (!hasValidSlides && attempt < maxAttempts) {
      console.warn(`Slides not properly rendered, retrying (${attempt}/${maxAttempts})...`);
      this._sliderTimeout = setTimeout(() => {
        this.initializeSliderWithRetry(attempt + 1, maxAttempts);
      }, 200 * attempt);
      return;
    }

    try {
      // Validate all elements exist and are properly rendered
      if (!container || !prevButton || !nextButton || !navContainer) {
        throw new Error('Required carousel elements not found');
      }

      // Double-check that elements are visible and have dimensions
      if (container.offsetHeight === 0 || container.offsetWidth === 0) {
        throw new Error('Carousel container has no dimensions');
      }

      // Initialize slider with element references instead of selectors
      this.sliderInstance = tns({
        container: container,
        items: 1,
        controls: true,
        autoplay: settings.big_carousel_autoplay,
        speed: settings.big_carousel_speed,
        prevButton: prevButton,
        nextButton: nextButton,
        navContainer: navContainer,
        preventScrollOnTouch: "force",
      });

      console.log('Carousel slider initialized successfully');
    } catch (error) {
      console.error('Error initializing carousel slider:', error);

      // If initialization fails, try one more time with a longer delay
      if (attempt < maxAttempts) {
        console.warn(`Slider initialization failed, retrying (${attempt}/${maxAttempts})...`);
        this._sliderTimeout = setTimeout(() => {
          this.initializeSliderWithRetry(attempt + 1, maxAttempts);
        }, 500 * attempt);
      }
    }
  }

  @discourseComputed("router.currentRouteName", "carouselClosed")
  shouldDisplay(currentRouteName, carouselClosed) {
    // Don't show if carousel has been closed AND the dismissible feature is enabled
    if (settings.big_carousel_dismissible && carouselClosed) {
      return false;
    }

    // Always show on categories page (original behavior)
    if (currentRouteName === "discovery.categories") {
      return true;
    }

    // Show on home page routes if the setting is enabled
    if (settings.big_carousel_show_on_homepage) {
      const homePageRoutes = [
        "discovery.latest",
        "discovery.top",
        "discovery.new",
        "discovery.unread",
        "discovery.custom"
      ];
      return homePageRoutes.includes(currentRouteName);
    }

    return false;
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    // Store reference to component element
    this.componentElement = this.element;

    // Ensure we have access to appEvents before using it
    if (this.appEvents) {
      this.appEvents.on("page:changed", this, "ensureSlider");
    }

    // Initialize page load tracking for "until_reload" option
    this.initializePageLoadTracking();

    // Clear dismissal state if dismissible feature is disabled
    if (!settings.big_carousel_dismissible && this.carouselClosed) {
      this.clearDismissalState();
    }

    // Initialize slider after DOM is ready
    setTimeout(() => {
      this.ensureSlider();
    }, 50);
  }

  initializePageLoadTracking() {
    // For "until_reload" option, clear any existing page load ID to start fresh
    if (settings.big_carousel_cookie_lifespan === "until_reload") {
      try {
        sessionStorage.removeItem("big_carousel_page_load_id");
        this._pageLoadId = null; // Reset the cached ID
      } catch (error) {
        console.warn("Error initializing page load tracking:", error);
      }
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    // Clean up event listeners
    if (this.appEvents) {
      this.appEvents.off("page:changed", this, "ensureSlider");
    }

    // Clean up slider instance with better error handling
    if (this.sliderInstance) {
      try {
        if (typeof this.sliderInstance.destroy === 'function') {
          this.sliderInstance.destroy();
        }
      } catch (error) {
        console.warn('Error destroying slider instance on component destroy:', error);
      } finally {
        this.sliderInstance = null;
      }
    }

    // Clear any pending timeouts
    if (this._sliderTimeout) {
      clearTimeout(this._sliderTimeout);
      this._sliderTimeout = null;
    }
  }

  <template>
    {{#if this.shouldDisplay}}
      <div class={{this.carouselClasses}} data-carousel-id={{this.carouselId}}>
        {{#if settings.big_carousel_dismissible}}
          <div class="big-carousel-close-container">
            <DButton
              @icon="circle-xmark"
              @action={{this.closeCarousel}}
              @title={{i18n "close_button.title"}}
              class="btn-transparent big-carousel-close-btn"
            />
          </div>
        {{/if}}

        <div class="custom-big-carousel-prev" data-carousel-id={{this.carouselId}}>
          {{icon "chevron-left"}}
        </div>

        <div class="custom-big-carousel-next" data-carousel-id={{this.carouselId}}>
          {{icon "chevron-right"}}
        </div>

        <div class="custom-big-carousel-slides" data-carousel-id={{this.carouselId}}>
          {{#each this.bigStaticSlides as |bs|}}
            <div
              class="custom-big-carousel-slide"
              style={{htmlSafe
                (concat
                  "background:"
                  bs.slide_bg_color
                  ";"
                  "background-image: url("
                  bs.image_url
                  ");"
                )
              }}
            >
              <div class="custom-big-carousel-content">
                <div class="custom-big-carousel-outer-wrap wrap">
                  <div
                    class="custom-big-carousel-inner-wrap"
                    style={{htmlSafe (concat "background:" bs.text_bg)}}
                  >
                    <div class="custom-big-carousel-main-content">
                      {{#if (this.isExternalLink bs.link)}}
                        <a
                          href={{bs.link}}
                          class="custom-big-carousel-text-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h2>
                            {{bs.headline}}
                          </h2>

                          <p>
                            {{bs.text}}
                          </p>
                        </a>
                      {{else}}
                        <a
                          href={{bs.link}}
                          class="custom-big-carousel-text-link"
                        >
                          <h2>
                            {{bs.headline}}
                          </h2>

                          <p>
                            {{bs.text}}
                          </p>
                        </a>
                      {{/if}}

                      {{#if (and bs.button_text bs.link)}}
                        {{#if (this.isExternalLink bs.link)}}
                          <a
                            href={{bs.link}}
                            class="btn btn-primary btn-text"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {{bs.button_text}}
                          </a>
                        {{else}}
                          <a
                            href={{bs.link}}
                            class="btn btn-primary btn-text"
                          >
                            {{bs.button_text}}
                          </a>
                        {{/if}}
                      {{/if}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {{/each}}

          {{#each this.bigUserSlides as |bs|}}
            <div
              class="custom-big-carousel-slide user-slide"
              style={{htmlSafe
                (concat
                  "background:"
                  bs.slide_bg_color
                  ";"
                  "background-image: url("
                  bs.image_url
                  ");"
                )
              }}
            >
              <div class="custom-big-carousel-content">
                <div class="custom-big-carousel-outer-wrap wrap">
                  <div class="custom-big-carousel-inner-wrap">
                    <div class="custom-big-carousel-main-content">
                      <h4>
                        {{bs.headline}}
                      </h4>
                      <div style={{htmlSafe (concat "background:" bs.text_bg)}}>
                        <h3>
                          <a href="/u/{{bs.user_info.user.username}}">
                            {{avatar bs.user_info.user imageSize="huge"}}
                            {{bs.user_info.user.username}}
                          </a>
                        </h3>
                      </div>

                      <p class="bs-main-text">
                        {{bs.text}}
                      </p>

                      {{#if (and bs.button_text bs.link)}}
                        <a
                          href="/u/{{bs.link}}"
                          class="btn btn-primary btn-text"
                        >
                          {{bs.button_text}}
                        </a>
                      {{/if}}
                    </div>

                    {{#if bs.user_activity}}
                      <div class="bc-user-activity">
                        <h4>Recent Activity</h4>

                        {{#each bs.user_activity as |activity|}}
                          <div class="bc-user-post">
                            <a href="/t/{{activity.topic_id}}">
                              <div class="bc-user-post-title">
                                {{activity.title}}
                              </div>
                              <p class="bc-user-post-excerpt">
                                {{htmlSafe activity.excerpt}}
                              </p>
                            </a>
                          </div>
                        {{/each}}
                      </div>
                    {{/if}}
                  </div>
                </div>
              </div>
            </div>
          {{/each}}
        </div>

        <div class="custom-big-carousel-nav" data-carousel-id={{this.carouselId}}>
          {{#each this.bigStaticSlides}}
            <div class="custom-big-carousel-nav-item"></div>
          {{/each}}

          {{#each this.bigUserSlides}}
            <div class="custom-big-carousel-nav-item"></div>
          {{/each}}
        </div>

        <ConditionalLoadingSpinner @condition={{this.isLoading}} />
      </div>
    {{/if}}
  </template>
}
