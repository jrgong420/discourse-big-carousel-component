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

  get cookieClosed() {
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
    if (settings.big_carousel_cookie_lifespan === "session") {
      return null; // Session cookie
    } else {
      return moment().add(1, settings.big_carousel_cookie_lifespan).toDate();
    }
  }

  @computed
  get bigSlides() {
    return JSON.parse(settings.big_carousel_slides);
  }

  @action
  closeCarousel() {
    this.carouselClosed = true;

    if (settings.big_carousel_cookie_lifespan !== "session") {
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
  }

  clearDismissalState() {
    // Clear the dismissal state when the dismissible feature is disabled
    this.carouselClosed = false;
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
            // Validate DOM elements exist before initializing slider
            const container = document.querySelector(".custom-big-carousel-slides");
            const prevButton = document.querySelector(".custom-big-carousel-prev");
            const nextButton = document.querySelector(".custom-big-carousel-next");
            const navContainer = document.querySelector(".custom-big-carousel-nav");

            if (!container) {
              console.warn('Carousel container not found, skipping slider initialization');
              return;
            }

            // slider script
            this.sliderInstance = tns({
              container: ".custom-big-carousel-slides",
              items: 1,
              controls: true,
              autoplay: settings.big_carousel_autoplay,
              speed: settings.big_carousel_speed,
              prevButton: ".custom-big-carousel-prev",
              nextButton: ".custom-big-carousel-next",
              navContainer: ".custom-big-carousel-nav",
              preventScrollOnTouch: "force",
            });
          });
        })
        .finally(() => {
          this.set("isLoading", false);
        });
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
    this.appEvents.on("page:changed", this, "ensureSlider");

    // Clear dismissal state if dismissible feature is disabled
    if (!settings.big_carousel_dismissible && this.carouselClosed) {
      this.clearDismissalState();
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.appEvents.off("page:changed", this, "ensureSlider");

    // Clean up slider instance
    if (this.sliderInstance && typeof this.sliderInstance.destroy === 'function') {
      try {
        this.sliderInstance.destroy();
      } catch (error) {
        console.warn('Error destroying slider instance on component destroy:', error);
      }
      this.sliderInstance = null;
    }
  }

  <template>
    {{#if this.shouldDisplay}}
      <div class="custom-big-carousel">
        {{#if settings.big_carousel_dismissible}}
          <div class="big-carousel-close-container">
            <DButton
              @icon="times"
              @action={{this.closeCarousel}}
              @title={{i18n "close_button.title"}}
              class="btn-transparent big-carousel-close-btn"
            />
          </div>
        {{/if}}

        <div class="custom-big-carousel-prev">
          {{icon "chevron-left"}}
        </div>

        <div class="custom-big-carousel-next">
          {{icon "chevron-right"}}
        </div>

        <div class="custom-big-carousel-slides">
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
                      <a href={{bs.link}} class="custom-big-carousel-text-link">
                        <h2>
                          {{bs.headline}}
                        </h2>

                        <p>
                          {{bs.text}}
                        </p>
                      </a>

                      {{#if (and bs.button_text bs.link)}}
                        <a href={{bs.link}} class="btn btn-primary btn-text">
                          {{bs.button_text}}
                        </a>
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

        <div class="custom-big-carousel-nav">
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
