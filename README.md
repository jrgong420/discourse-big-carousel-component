# Big Carousel Component for Discourse

A customizable carousel component for Discourse that can display slides with images, text, and user information on various pages including the home page.

## Features

- **Multiple Slide Types**: Support for static content slides and user profile slides
- **Flexible Positioning**: Choose between `below-site-header` and `above-main-container` plugin outlets
- **Home Page Display**: Optional display on home page routes (latest, top, new, unread, custom)
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Customizable Styling**: Configurable colors, backgrounds, and content
- **Auto-play Support**: Optional automatic slide progression
- **Navigation Controls**: Previous/next buttons and dot navigation

## Installation

1. Install this theme component in your Discourse admin panel
2. Configure the settings as described below
3. Enable the component on your desired pages

## Configuration Settings

### Basic Settings

#### `big_carousel_slides`
JSON array defining the carousel slides. Each slide object supports:

- `link`: URL for the slide link
- `headline`: Main heading text
- `text`: Body text content
- `text_bg`: Background color for text content (hex color)
- `button_text`: Text for the call-to-action button
- `image_url`: Background image URL for the slide
- `slide_bg_color`: Background color for the entire slide (hex color)
- `slide_type`: Either `"slide"` for static content or `"user"` for user profile slides

**Example:**
```json
[
  {
    "link": "https://example.com",
    "headline": "Welcome to Our Community",
    "text": "Join thousands of users in discussions",
    "text_bg": "#000000",
    "button_text": "Get Started",
    "image_url": "https://example.com/banner.jpg",
    "slide_bg_color": "#333333",
    "slide_type": "slide"
  },
  {
    "link": "john_doe",
    "headline": "Featured User",
    "text": "Check out this amazing community member",
    "text_bg": "#000000",
    "button_text": "View Profile",
    "image_url": "",
    "slide_bg_color": "#444444",
    "slide_type": "user"
  }
]
```

#### `big_carousel_min_height`
Minimum height for the carousel (default: `300px`)

#### `big_carousel_autoplay`
Enable automatic slide progression (default: `false`)

#### `big_carousel_speed`
Transition speed in milliseconds (default: `300`)

### Display Settings

#### `big_carousel_show_on_homepage`
**NEW**: Enable display on home page routes (default: `false`)

When enabled, the carousel will display on:
- `/latest` (discovery.latest)
- `/top` (discovery.top)
- `/new` (discovery.new)
- `/unread` (discovery.unread)
- Custom homepage (discovery.custom)

The carousel will always display on `/categories` regardless of this setting.

#### `plugin_outlet`
Choose where to display the carousel:
- `below-site-header`: Below the site header, above the main content
- `above-main-container`: Above the main container, beside the sidebar

## Usage Examples

### Basic Static Carousel
Perfect for announcements, featured content, or promotional materials:

```json
[
  {
    "link": "https://discourse.org",
    "headline": "Welcome to Discourse",
    "text": "The best discussion platform",
    "text_bg": "#000000",
    "button_text": "Learn More",
    "image_url": "",
    "slide_bg_color": "#0088cc",
    "slide_type": "slide"
  }
]
```

### User Spotlight Carousel
Showcase community members with their recent activity:

```json
[
  {
    "link": "community_leader",
    "headline": "Community Spotlight",
    "text": "Meet our featured community member",
    "text_bg": "#000000",
    "button_text": "View Profile",
    "image_url": "",
    "slide_bg_color": "#663399",
    "slide_type": "user"
  }
]
```

### Mixed Content Carousel
Combine static content with user profiles:

```json
[
  {
    "link": "https://example.com/announcement",
    "headline": "Big Announcement",
    "text": "Something exciting is coming",
    "text_bg": "#000000",
    "button_text": "Read More",
    "image_url": "https://example.com/announcement.jpg",
    "slide_bg_color": "#ff6600",
    "slide_type": "slide"
  },
  {
    "link": "featured_user",
    "headline": "User of the Month",
    "text": "Congratulations to our star contributor",
    "text_bg": "#000000",
    "button_text": "View Profile",
    "image_url": "",
    "slide_bg_color": "#009900",
    "slide_type": "user"
  }
]
```

## Home Page Integration

To enable the carousel on your home page:

1. Go to Admin → Customize → Themes
2. Select the Big Carousel component
3. Enable "Show on Homepage" setting
4. Choose your preferred plugin outlet position
5. Configure your slides as desired

The carousel will then appear on all home page routes while maintaining its original functionality on the categories page.

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Touch/swipe navigation on mobile devices

## Troubleshooting

### Carousel not appearing on home page
- Verify "Show on Homepage" setting is enabled
- Check that you have slides configured
- Ensure the plugin outlet setting matches your theme layout

### Slides not loading
- Verify JSON syntax in slide configuration
- Check that image URLs are accessible
- For user slides, ensure usernames exist and are accessible

### Styling issues
- Check for CSS conflicts with other themes/components
- Verify color values are valid hex codes
- Test on both desktop and mobile devices

## Development

This component uses:
- Ember.js components and templates
- Tiny Slider library for carousel functionality
- Discourse plugin outlet system
- SCSS for styling

## License

This component is available under the same license as Discourse.
