# Centralized Header and Footer System

This system allows you to manage the website's navigation and footer in a single place, making it easy to maintain consistency across all pages.

## Files Structure
```
includes/
├── header.html    # Navigation bar content
├── footer.html    # Footer content
└── README.md      # This documentation
```

## How to Use

### For New Pages

1. **HTML Structure**: In your HTML file, replace the navigation and footer with placeholder containers:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Your head content -->
    <link href="assets/css/main.css" rel="stylesheet">
</head>
<body>
    <!-- Header Container -->
    <div id="header-container"></div>
    
    <!-- Your page content here -->
    <main>
        <!-- Content goes here -->
    </main>
    
    <!-- Footer Container -->
    <div id="footer-container"></div>
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
```

2. **JavaScript Initialization**: For simple pages that only need header/footer:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    EVALOOP.initPageLayout();
});
```

3. **For Complex Pages**: If you need additional functionality (like the home page):

```javascript
document.addEventListener('DOMContentLoaded', function() {
    EVALOOP.initPageLayout().then(() => {
        // Your custom page initialization here
        initCustomFeatures();
    });
});
```

### Updating Navigation or Footer

1. **To update navigation**: Edit `includes/header.html`
2. **To update footer**: Edit `includes/footer.html`
3. **Changes apply automatically** to all pages using the system

### Navigation Highlighting

The system automatically highlights the active page in the navigation based on the current URL. Make sure your navigation links in `header.html` have `href` attributes that match your page filenames.

## Benefits

- ✅ **Single source of truth** for navigation and footer
- ✅ **Automatic updates** across all pages
- ✅ **Consistent styling** and functionality
- ✅ **Easy maintenance** - change once, update everywhere
- ✅ **Active page highlighting** works automatically

## Example Usage

See `home.html` for a complete implementation example.
