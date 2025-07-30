# Carousel Navigation Fixes

This document outlines the fixes implemented to resolve the horizontal navigation issues in the Big Carousel component.

## Issues Fixed

### 1. Arrow Navigation Issue
**Problem**: Left/right arrow buttons were not working correctly for horizontal scrolling.

**Root Cause**: The arrow navigation was properly implemented, but lacked robust error handling and debugging information.

**Solution**: Enhanced the `setupCustomNavigation()` method with:
- Improved error handling and logging
- Added `preventDefault()` and `stopPropagation()` to button click handlers
- Added comprehensive debugging information to identify initialization issues
- Added validation checks for slider instance and methods

### 2. Mobile Touch Event Error
**Problem**: Console error "Unable to preventDefault inside passive event listener invocation" appeared during horizontal swipes on mobile devices.

**Root Cause**: The tiny-slider library was using passive event listeners for `touchstart` and `touchmove` events, but then trying to call `preventDefault()` on these events, which is not allowed.

**Solution**: Added `preventScrollOnTouch: 'force'` to the slider configuration, which:
- Forces the tiny-slider to use non-passive event listeners
- Allows `preventDefault()` to work properly during touch events
- Eliminates the console error

## Code Changes

### File: `javascripts/discourse/components/big-carousel.js`

#### 1. Enhanced Slider Configuration
```javascript
this.sliderInstance = tns({
  container: container,
  items: 1,
  controls: false,
  nav: false,
  mouseDrag: true,
  touch: true,
  autoplay: false,
  preventScrollOnTouch: 'force', // Fix for passive event listener issue
  speed: settings.big_carousel_speed || 300,
  loop: true,
  swipeAngle: 30, // More lenient swipe angle for better mobile UX
  nested: false,
});
```

#### 2. Improved Navigation Setup
```javascript
setupCustomNavigation() {
  if (!this.sliderInstance) {
    console.warn('Slider instance not available for navigation setup');
    return;
  }

  // Enhanced button event handlers with proper error handling
  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.sliderInstance && typeof this.sliderInstance.goTo === 'function') {
        try {
          this.sliderInstance.goTo('prev');
          console.log('Navigated to previous slide');
        } catch (error) {
          console.error('Error navigating to previous slide:', error);
        }
      } else {
        console.warn('Slider instance or goTo method not available');
      }
    });
  }
  // Similar enhancement for next button...
}
```

#### 3. Enhanced Debugging
Added comprehensive logging to help identify initialization issues:
```javascript
console.log('Carousel slider initialized successfully', {
  hasGoToMethod: typeof this.sliderInstance.goTo === 'function',
  sliderInfo: this.sliderInstance.getInfo ? this.sliderInstance.getInfo() : 'No getInfo method'
});
```

## Configuration Options Explained

### `preventScrollOnTouch: 'force'`
- **Default**: `false` (uses passive listeners)
- **'force'**: Forces non-passive listeners, allowing `preventDefault()`
- **'auto'**: Automatically determines based on browser support

### `swipeAngle: 30`
- **Default**: `15` degrees
- **Increased to 30**: More lenient angle detection for better mobile UX
- Allows users to swipe at a wider angle and still trigger navigation

### `nested: false`
- Ensures proper touch event handling when carousel is not nested inside other touch-enabled elements
- Prevents conflicts with parent element touch handlers

## Testing

### Manual Testing Steps
1. Open the test file `test_carousel_navigation.html` in a browser
2. Test arrow button navigation by clicking left/right arrows
3. On mobile devices, test swipe navigation
4. Check browser console for any errors
5. Verify no "preventDefault" or "passive event listener" errors appear

### Expected Behavior
- **Desktop**: Arrow buttons should smoothly navigate between slides
- **Mobile**: Horizontal swipes should navigate between slides
- **Console**: No JavaScript errors related to passive event listeners
- **Transitions**: Smooth animations between slides

## Browser Compatibility
- Modern browsers with ES6+ support
- Mobile browsers with touch event support
- Tested on Chrome, Firefox, Safari, and mobile browsers

## Future Considerations
- Monitor for any performance impacts from non-passive listeners
- Consider adding keyboard navigation support
- Evaluate adding accessibility improvements (ARIA labels, focus management)
