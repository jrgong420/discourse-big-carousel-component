# Big Carousel Home Page Testing Guide

This guide provides comprehensive manual testing procedures to verify that the Big Carousel component works correctly on Discourse home page routes.

## Prerequisites

1. Discourse installation (development or production)
2. Big Carousel theme component installed and activated
3. Admin access to configure theme settings

## Test Setup

### Basic Test Configuration

1. Navigate to Admin → Customize → Themes
2. Select the Big Carousel component
3. Configure the following basic settings:

```json
big_carousel_slides: [
  {
    "link": "https://discourse.org",
    "headline": "Test Slide 1",
    "text": "This is a test slide for home page display",
    "text_bg": "#000000",
    "button_text": "Click Here",
    "image_url": "",
    "slide_bg_color": "#0088cc",
    "slide_type": "slide"
  },
  {
    "link": "https://meta.discourse.org",
    "headline": "Test Slide 2",
    "text": "Second test slide with different styling",
    "text_bg": "#ffffff",
    "button_text": "Learn More",
    "image_url": "",
    "slide_bg_color": "#663399",
    "slide_type": "slide"
  }
]
```

4. Set `big_carousel_min_height`: `300px`
5. Set `plugin_outlet`: `below-site-header`

## Test Cases

### Test Case 1: Home Page Display Disabled (Default Behavior)

**Setup:**
- Set `big_carousel_show_on_homepage`: `false`

**Expected Results:**
- ✅ Carousel should appear on `/categories` page
- ❌ Carousel should NOT appear on `/latest` page
- ❌ Carousel should NOT appear on `/top` page
- ❌ Carousel should NOT appear on `/new` page
- ❌ Carousel should NOT appear on `/unread` page

**Testing Steps:**
1. Visit `/categories` - verify carousel is visible
2. Visit `/latest` - verify carousel is not visible
3. Visit `/top` - verify carousel is not visible
4. Visit `/new` - verify carousel is not visible
5. Visit `/unread` - verify carousel is not visible

### Test Case 2: Home Page Display Enabled

**Setup:**
- Set `big_carousel_show_on_homepage`: `true`

**Expected Results:**
- ✅ Carousel should appear on `/categories` page
- ✅ Carousel should appear on `/latest` page
- ✅ Carousel should appear on `/top` page
- ✅ Carousel should appear on `/new` page
- ✅ Carousel should appear on `/unread` page
- ✅ Carousel should appear on custom homepage (if configured)

**Testing Steps:**
1. Visit each route and verify carousel appears with correct content
2. Check that slide content displays properly (headline, text, button)
3. Verify navigation controls work (if multiple slides)
4. Test slide transitions and autoplay (if enabled)

### Test Case 3: Plugin Outlet Positioning

**Setup A: Below Site Header**
- Set `plugin_outlet`: `below-site-header`
- Set `big_carousel_show_on_homepage`: `true`

**Testing Steps:**
1. Visit `/latest`
2. Verify carousel appears below the site header
3. Check that it doesn't interfere with navigation or sidebar

**Setup B: Above Main Container**
- Set `plugin_outlet`: `above-main-container`
- Set `big_carousel_show_on_homepage`: `true`

**Testing Steps:**
1. Visit `/latest`
2. Verify carousel appears above the main content area
3. Check positioning relative to sidebar and main content

### Test Case 4: Multiple Slides Functionality

**Setup:**
- Configure 3+ slides in `big_carousel_slides`
- Set `big_carousel_show_on_homepage`: `true`
- Set `big_carousel_autoplay`: `false`

**Testing Steps:**
1. Visit `/latest`
2. Verify navigation dots appear at bottom
3. Click navigation dots to switch slides
4. Hover over carousel to reveal prev/next arrows
5. Test prev/next arrow functionality
6. Verify slide content changes correctly

### Test Case 5: Autoplay Functionality

**Setup:**
- Configure multiple slides
- Set `big_carousel_autoplay`: `true`
- Set `big_carousel_speed`: `2000`
- Set `big_carousel_show_on_homepage`: `true`

**Testing Steps:**
1. Visit `/latest`
2. Wait and observe automatic slide progression
3. Verify timing matches configured speed
4. Test that manual navigation still works

### Test Case 6: User Slides on Home Page

**Setup:**
- Add a user slide to configuration:
```json
{
  "link": "system",
  "headline": "Featured User",
  "text": "Check out this community member",
  "text_bg": "#000000",
  "button_text": "View Profile",
  "image_url": "",
  "slide_bg_color": "#009900",
  "slide_type": "user"
}
```
- Set `big_carousel_show_on_homepage`: `true`

**Testing Steps:**
1. Visit `/latest`
2. Navigate to user slide
3. Verify user avatar and username display
4. Check that user activity section appears (desktop only)
5. Test profile link functionality

### Test Case 7: Mobile Responsiveness

**Setup:**
- Set `big_carousel_show_on_homepage`: `true`
- Use browser dev tools or actual mobile device

**Testing Steps:**
1. Visit `/latest` on mobile viewport
2. Verify carousel displays properly
3. Check that navigation arrows are hidden (mobile.scss)
4. Test touch/swipe navigation
5. Verify text and buttons are readable
6. Check that user activity is hidden on mobile

### Test Case 8: Route Transition Testing

**Setup:**
- Set `big_carousel_show_on_homepage`: `true`

**Testing Steps:**
1. Start on `/categories` (carousel should be visible)
2. Navigate to `/latest` (carousel should remain/appear)
3. Navigate to `/top` (carousel should remain visible)
4. Navigate to a topic page (carousel should disappear)
5. Navigate back to `/latest` (carousel should reappear)
6. Verify no JavaScript errors in console during transitions

### Test Case 9: Settings Validation

**Testing Steps:**
1. Test with empty slides array - carousel should not appear
2. Test with malformed JSON - verify error handling
3. Test with missing required slide properties
4. Test with invalid color values
5. Test with very long text content

### Test Case 10: Performance Testing

**Testing Steps:**
1. Configure carousel with multiple slides and images
2. Visit home page routes multiple times
3. Monitor browser performance and memory usage
4. Check for JavaScript errors or warnings
5. Verify smooth animations and transitions

## Expected Visual Elements

When carousel is properly displayed, you should see:

- **Container**: `.custom-big-carousel` element
- **Slides**: Individual slide content with configured styling
- **Navigation**: Dot navigation at bottom (if multiple slides)
- **Controls**: Prev/next arrows on hover (desktop only)
- **Content**: Headlines, text, and buttons as configured
- **User Info**: Avatar and username for user slides
- **Loading**: Spinner during initial load

## Troubleshooting Common Issues

### Carousel Not Appearing
- Check browser console for JavaScript errors
- Verify theme component is active
- Confirm settings are saved properly
- Check that slides array is not empty

### Styling Issues
- Clear browser cache
- Check for CSS conflicts with other themes
- Verify color values are valid hex codes
- Test in different browsers

### Navigation Not Working
- Ensure tiny-slider.js is loading properly
- Check for JavaScript conflicts
- Verify multiple slides are configured

### User Slides Not Loading
- Confirm usernames exist and are accessible
- Check network tab for failed API requests
- Verify user has public profile

## Success Criteria

The implementation is successful when:

1. ✅ Carousel displays on home page routes when setting is enabled
2. ✅ Carousel does not display on home page routes when setting is disabled
3. ✅ Original categories page functionality is preserved
4. ✅ All slide types work correctly on home page
5. ✅ Navigation and autoplay function properly
6. ✅ Mobile responsiveness is maintained
7. ✅ No JavaScript errors occur during route transitions
8. ✅ Plugin outlet positioning works as expected
9. ✅ Settings are properly validated and applied
10. ✅ Performance remains acceptable with multiple slides
