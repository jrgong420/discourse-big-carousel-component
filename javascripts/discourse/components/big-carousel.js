/* global tns */
import Component from "@ember/component";
import { action, computed, set } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { Promise } from "rsvp";
import { ajax } from "discourse/lib/ajax";
import cookie from "discourse/lib/cookie";
import discourseComputed from "discourse/lib/decorators";
import loadScript from "discourse/lib/load-script";
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

  // Clean up any existing tiny-slider instances on the page
  cleanupExistingSliders() {
    // Find all elements that might have tiny-slider applied
    const tnsContainers = document.querySelectorAll('.tns-slider');
    tnsContainers.forEach(container => {
      try {
        // Try to find and destroy any existing slider instances
        if (container._tnsInstance) {
          container._tnsInstance.destroy();
        }

        // Remove tiny-slider classes
        container.classList.remove('tns-slider', 'tns-horizontal', 'tns-carousel', 'tns-loaded');

        // Reset styles
        container.style.transform = '';
        container.style.transition = '';

        // Clean up child elements
        const items = container.querySelectorAll('.tns-item');
        items.forEach(item => {
          item.classList.remove('tns-item', 'tns-slide-active', 'tns-slide-cloned');
          item.style.transform = '';
          item.style.left = '';
          item.style.right = '';
        });

        console.log('Cleaned up existing slider instance');
      } catch (error) {
        console.warn('Error cleaning up existing slider:', error);
      }
    });
  }

  ensureSlider() {
    // Clean up any existing sliders first
    this.cleanupExistingSliders();

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
            // Use a longer delay to ensure both DOM and CSS are fully loaded
            this._sliderTimeout = setTimeout(() => {
              this.initializeSliderWithRetry();
            }, 500);
          }).catch((error) => {
            console.error('Error loading tiny-slider script:', error);
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

  // Check if CSS is loaded by testing if carousel styles are applied
  isCSSLoaded() {
    const testElement = document.createElement('div');
    testElement.className = 'custom-big-carousel';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.top = '-9999px';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const hasMinHeight = computedStyle.minHeight && computedStyle.minHeight !== '0px';
    const hasPosition = computedStyle.position === 'relative';

    document.body.removeChild(testElement);
    return hasMinHeight || hasPosition;
  }

  initializeSliderWithRetry(attempt = 1, maxAttempts = 3) {
    // Check if component is still alive
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    // Check if CSS is loaded
    if (!this.isCSSLoaded() && attempt < maxAttempts) {
      console.warn(`CSS not loaded yet, retrying (${attempt}/${maxAttempts})...`);
      this._sliderTimeout = setTimeout(() => {
        this.initializeSliderWithRetry(attempt + 1, maxAttempts);
      }, 300 * attempt);
      return;
    }

    // Find the carousel container using the unique carousel ID
    const carouselId = this.carouselId;
    let container = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-slides`);

    if (!container) {
      const carouselContainer = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel`);
      if (carouselContainer) {
        container = carouselContainer.querySelector(".custom-big-carousel-slides");
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

    try {
      // Check if tiny-slider library is available
      if (typeof tns !== 'function') {
        throw new Error('Tiny-slider library not loaded');
      }

      // Try the absolute minimal configuration without built-in controls
      this.sliderInstance = tns({
        container: container,
        items: 1,
        controls: false, // Disable built-in prev/next buttons
        nav: false, // Disable built-in navigation dots
        mouseDrag: true,
        touch: true,
        autoplay: false, // Disable autoplay for now
        preventScrollOnTouch: 'force', // Fix passive event listener issue - forces non-passive listeners
        speed: settings.big_carousel_speed || 300,
        startIndex: 0, // Explicitly start on first slide
        loop: false, // Disable loop to fix erratic navigation - can be enabled later if needed
        rewind: true, // Enable rewind for better UX when reaching ends
        swipeAngle: 30, // Allow more lenient swipe angle for better mobile UX
        nested: false, // Ensure proper touch handling
      });

      // Set up custom navigation after successful initialization
      this.setupCustomNavigation();
      console.log('Carousel slider initialized successfully', {
        hasGoToMethod: typeof this.sliderInstance.goTo === 'function',
        sliderInfo: this.sliderInstance.getInfo ? this.sliderInstance.getInfo() : 'No getInfo method'
      });
    } catch (error) {
      console.error('Error initializing carousel slider:', error);

      // If initialization fails, try one more time with a longer delay
      if (attempt < maxAttempts) {
        console.warn(`Slider initialization failed, retrying (${attempt}/${maxAttempts})...`);
        this._sliderTimeout = setTimeout(() => {
          this.initializeSliderWithRetry(attempt + 1, maxAttempts);
        }, 500 * attempt);
      } else {
        console.error('All slider initialization attempts failed');
      }
    }
  }

  // Set up custom navigation since we disabled tiny-slider's built-in controls
  setupCustomNavigation() {
    if (!this.sliderInstance) {
      console.warn('Slider instance not available for navigation setup');
      return;
    }

    const carouselId = this.carouselId;
    const prevButton = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-prev`);
    const nextButton = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-next`);
    const navContainer = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-nav`);

    // Set up prev button with improved error handling
    if (prevButton) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.sliderInstance && typeof this.sliderInstance.goTo === 'function') {
          try {
            // Get current info before navigation
            let currentInfo = null;
            if (this.sliderInstance.getInfo) {
              currentInfo = this.sliderInstance.getInfo();
              console.log('Before prev navigation:', {
                currentIndex: currentInfo.index,
                slideCount: currentInfo.slideCount
              });
            }

            this.sliderInstance.goTo('prev');
            console.log('Navigated to previous slide');

            // Get info after navigation
            if (this.sliderInstance.getInfo) {
              const newInfo = this.sliderInstance.getInfo();
              console.log('After prev navigation:', {
                newIndex: newInfo.index,
                slideCount: newInfo.slideCount
              });
            }
          } catch (error) {
            console.error('Error navigating to previous slide:', error);
          }
        } else {
          console.warn('Slider instance or goTo method not available');
        }
      });
      console.log('Previous button navigation set up');
    } else {
      console.warn('Previous button not found for carousel:', carouselId);
    }

    // Set up next button with improved error handling
    if (nextButton) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.sliderInstance && typeof this.sliderInstance.goTo === 'function') {
          try {
            // Get current info before navigation
            let currentInfo = null;
            if (this.sliderInstance.getInfo) {
              currentInfo = this.sliderInstance.getInfo();
              console.log('Before next navigation:', {
                currentIndex: currentInfo.index,
                slideCount: currentInfo.slideCount
              });
            }

            this.sliderInstance.goTo('next');
            console.log('Navigated to next slide');

            // Get info after navigation
            if (this.sliderInstance.getInfo) {
              const newInfo = this.sliderInstance.getInfo();
              console.log('After next navigation:', {
                newIndex: newInfo.index,
                slideCount: newInfo.slideCount
              });
            }
          } catch (error) {
            console.error('Error navigating to next slide:', error);
          }
        } else {
          console.warn('Slider instance or goTo method not available');
        }
      });
      console.log('Next button navigation set up');
    } else {
      console.warn('Next button not found for carousel:', carouselId);
    }

    // Set up navigation dots with improved indexing
    if (navContainer) {
      const navItems = navContainer.querySelectorAll('.custom-big-carousel-nav-item');
      console.log(`Found ${navItems.length} navigation items`);

      navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.sliderInstance && typeof this.sliderInstance.goTo === 'function') {
            try {
              console.log(`Navigating to slide ${index} via nav dot`);
              this.sliderInstance.goTo(index);

              // Get current slide info for debugging
              if (this.sliderInstance.getInfo) {
                const info = this.sliderInstance.getInfo();
                console.log('Current slider info after nav click:', {
                  index: info.index,
                  slideCount: info.slideCount,
                  displayIndex: info.displayIndex
                });
              }
            } catch (error) {
              console.error(`Error navigating to slide ${index}:`, error);
            }
          } else {
            console.warn('Slider instance or goTo method not available for nav dot');
          }
        });
      });

      // Update active nav item when slide changes
      if (this.sliderInstance.events) {
        this.sliderInstance.events.on('indexChanged', (info) => {
          console.log('Slide index changed:', info);
          navItems.forEach((item, index) => {
            if (index === info.index) {
              item.classList.add('tns-nav-active');
            } else {
              item.classList.remove('tns-nav-active');
            }
          });
        });
      }

      // Set initial active state
      if (navItems.length > 0) {
        navItems[0].classList.add('tns-nav-active');
        console.log('Set initial active nav item to index 0');
      }
    } else {
      console.warn('Navigation container not found for carousel:', carouselId);
    }
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

    // Clean up custom navigation event listeners
    this.cleanupCustomNavigation();

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

  // Clean up custom navigation event listeners
  cleanupCustomNavigation() {
    const carouselId = this.carouselId;
    const prevButton = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-prev`);
    const nextButton = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-next`);
    const navContainer = document.querySelector(`[data-carousel-id="${carouselId}"].custom-big-carousel-nav`);

    // Remove event listeners by cloning and replacing elements
    if (prevButton) {
      const newPrevButton = prevButton.cloneNode(true);
      prevButton.parentNode.replaceChild(newPrevButton, prevButton);
    }

    if (nextButton) {
      const newNextButton = nextButton.cloneNode(true);
      nextButton.parentNode.replaceChild(newNextButton, nextButton);
    }

    if (navContainer) {
      const navItems = navContainer.querySelectorAll('.custom-big-carousel-nav-item');
      navItems.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
      });
    }
  }
}
