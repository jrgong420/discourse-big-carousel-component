# frozen_string_literal: true

RSpec.describe "Big Carousel on Home Page", type: :system do
  before do
    upload_theme_or_component
    SiteSetting.top_menu = "latest|new|unread|top|categories"
  end

  let(:theme) { Theme.find_by(name: "Big Carousel") }

  context "when big_carousel_show_on_homepage is disabled" do
    before do
      theme.update_setting(:big_carousel_show_on_homepage, false)
      theme.update_setting(:plugin_outlet, "below-site-header")
    end

    it "does not display carousel on latest page" do
      visit "/latest"
      expect(page).not_to have_css(".custom-big-carousel")
    end

    it "does not display carousel on top page" do
      visit "/top"
      expect(page).not_to have_css(".custom-big-carousel")
    end

    it "does not display carousel on new page" do
      visit "/new"
      expect(page).not_to have_css(".custom-big-carousel")
    end

    it "still displays carousel on categories page" do
      visit "/categories"
      expect(page).to have_css(".custom-big-carousel")
    end
  end

  context "when big_carousel_show_on_homepage is enabled" do
    before do
      theme.update_setting(:big_carousel_show_on_homepage, true)
      theme.update_setting(:plugin_outlet, "below-site-header")
      theme.update_setting(:big_carousel_slides, '[{"link": "https://example.com", "headline": "Test Headline", "text": "Test text", "text_bg": "#000", "button_text": "Click here", "image_url": "", "slide_bg_color": "#333", "slide_type": "slide"}]')
    end

    it "displays carousel on latest page" do
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).to have_css(".custom-big-carousel-slide")
      expect(page).to have_text("Test Headline")
    end

    it "displays carousel on top page" do
      visit "/top"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).to have_css(".custom-big-carousel-slide")
      expect(page).to have_text("Test Headline")
    end

    it "displays carousel on new page" do
      visit "/new"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).to have_css(".custom-big-carousel-slide")
      expect(page).to have_text("Test Headline")
    end

    it "displays carousel on unread page" do
      visit "/unread"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).to have_css(".custom-big-carousel-slide")
      expect(page).to have_text("Test Headline")
    end

    it "still displays carousel on categories page" do
      visit "/categories"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).to have_css(".custom-big-carousel-slide")
      expect(page).to have_text("Test Headline")
    end

    context "with above-main-container outlet" do
      before do
        theme.update_setting(:plugin_outlet, "above-main-container")
      end

      it "displays carousel in correct position on latest page" do
        visit "/latest"
        expect(page).to have_css(".above-main-container-outlet .custom-big-carousel")
        expect(page).to have_text("Test Headline")
      end
    end

    context "with below-site-header outlet" do
      before do
        theme.update_setting(:plugin_outlet, "below-site-header")
      end

      it "displays carousel in correct position on latest page" do
        visit "/latest"
        expect(page).to have_css(".below-site-header-outlet .custom-big-carousel")
        expect(page).to have_text("Test Headline")
      end
    end
  end

  context "carousel functionality on home page" do
    before do
      theme.update_setting(:big_carousel_show_on_homepage, true)
      theme.update_setting(:plugin_outlet, "below-site-header")
      theme.update_setting(:big_carousel_slides, '[{"link": "https://example1.com", "headline": "Slide 1", "text": "First slide", "text_bg": "#000", "button_text": "Click 1", "image_url": "", "slide_bg_color": "#333", "slide_type": "slide"}, {"link": "https://example2.com", "headline": "Slide 2", "text": "Second slide", "text_bg": "#000", "button_text": "Click 2", "image_url": "", "slide_bg_color": "#444", "slide_type": "slide"}]')
    end

    it "displays navigation controls when multiple slides exist" do
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel-nav")
      expect(page).to have_css(".custom-big-carousel-nav-item", count: 2)
    end

    it "displays slide content correctly" do
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel-slide")
      expect(page).to have_text("Slide 1")
      expect(page).to have_text("First slide")
      expect(page).to have_link("Click 1", href: "https://example1.com")
    end
  end

  context "mobile arrows functionality" do
    before do
      theme.update_setting(:big_carousel_show_on_homepage, true)
      theme.update_setting(:plugin_outlet, "below-site-header")
      theme.update_setting(:big_carousel_slides, '[{"link": "https://example.com", "headline": "Test Headline", "text": "Test text", "text_bg": "#000", "button_text": "Click here", "image_url": "", "slide_bg_color": "#333", "slide_type": "slide"}]')
    end

    it "does not have mobile-arrows-enabled class when mobile arrows are disabled" do
      theme.update_setting(:big_carousel_mobile_arrows, false)
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).not_to have_css(".custom-big-carousel.mobile-arrows-enabled")
    end

    it "has mobile-arrows-enabled class when mobile arrows are enabled" do
      theme.update_setting(:big_carousel_mobile_arrows, true)
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel.mobile-arrows-enabled")
    end
  end

  context "desktop arrows functionality" do
    before do
      theme.update_setting(:big_carousel_show_on_homepage, true)
      theme.update_setting(:plugin_outlet, "below-site-header")
      theme.update_setting(:big_carousel_slides, '[{"link": "https://example.com", "headline": "Test Headline", "text": "Test text", "text_bg": "#000", "button_text": "Click here", "image_url": "", "slide_bg_color": "#333", "slide_type": "slide"}]')
    end

    it "does not have desktop-arrows-always-visible class when desktop arrows always visible is disabled" do
      theme.update_setting(:big_carousel_desktop_arrows_always_visible, false)
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel")
      expect(page).not_to have_css(".custom-big-carousel.desktop-arrows-always-visible")
    end

    it "has desktop-arrows-always-visible class when desktop arrows always visible is enabled" do
      theme.update_setting(:big_carousel_desktop_arrows_always_visible, true)
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel.desktop-arrows-always-visible")
    end

    it "can have both mobile and desktop arrow classes enabled simultaneously" do
      theme.update_setting(:big_carousel_mobile_arrows, true)
      theme.update_setting(:big_carousel_desktop_arrows_always_visible, true)
      visit "/latest"
      expect(page).to have_css(".custom-big-carousel.mobile-arrows-enabled.desktop-arrows-always-visible")
    end
  end
end
