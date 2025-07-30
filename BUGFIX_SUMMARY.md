# Big Carousel Component - JavaScript Error Fixes

## Issues Identified and Fixed

### 1. Template Syntax Error (Primary Issue)
**Problem**: Invalid conditional attribute syntax in Ember templates
```handlebars
{{#if (this.isExternalLink bs.link)}}target="_blank" rel="noopener noreferrer"{{/if}}
```

**Root Cause**: Ember/Glimmer templates do not support conditional block helpers directly within HTML attributes.

**Solution**: Refactored to use proper conditional blocks with separate `{{#if}}` and `{{else}}` branches:
```handlebars
{{#if (this.isExternalLink bs.link)}}
  <a href={{bs.link}} target="_blank" rel="noopener noreferrer">...</a>
{{else}}
  <a href={{bs.link}}>...</a>
{{/if}}
```

### 2. DOM Element Access Issues
**Problem**: `getBoundingClientRect` errors due to premature DOM access

**Solutions Implemented**:
- Added timeout delays to ensure DOM is fully rendered before slider initialization
- Added comprehensive DOM element validation
- Improved error handling with try-catch blocks
- Added component lifecycle checks (`isDestroyed`, `isDestroying`)

### 3. Component Lifecycle Improvements
**Enhanced Error Handling**:
- Better cleanup of slider instances
- Proper timeout management to prevent memory leaks
- Safer event listener management
- Added null checks for `appEvents`

## Files Modified

### `javascripts/discourse/components/big-carousel.gjs`
- Fixed template syntax for external link detection
- Added `getLinkAttributes()` helper method (for future use)
- Improved DOM element validation in `ensureSlider()`
- Enhanced component lifecycle methods (`didInsertElement`, `willDestroyElement`)
- Added timeout management and cleanup

### `spec/system/big_carousel_home_page_spec.rb`
- Updated tests to include proper wait conditions
- Improved test reliability for external link detection

## External Link Functionality

The external link detection now works correctly:
- **External links** (e.g., `https://example.com`) → Opens in new tab with `target="_blank" rel="noopener noreferrer"`
- **Internal links** (e.g., `/categories`, `/u/username`) → Opens in same tab
- **User profile links** → Always internal (no target="_blank")
- **Topic links** → Always internal (no target="_blank")

## Testing

The component should now:
1. Load without JavaScript errors
2. Be accessible from both plugin outlets (`above-main-container`, `below-site-header`)
3. Handle external links correctly
4. Initialize the slider properly without DOM errors
5. Clean up resources properly when destroyed

## Deployment Notes

- No breaking changes to existing functionality
- Backward compatible with existing slide configurations
- Improved error handling should prevent future JavaScript errors
- Better performance due to proper resource cleanup
