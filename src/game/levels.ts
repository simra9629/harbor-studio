import { ProjectLevel } from './types';

// Helper to check if HTML contains a tag
const hasTag = (tag: string) => (html: string) => {
  const regex = new RegExp(`<${tag}[\\s>]`, 'i');
  return regex.test(html);
};

const hasClosingTag = (tag: string) => (html: string) => {
  const regex = new RegExp(`</${tag}>`, 'i');
  return regex.test(html);
};

const hasContent = (text: string) => (html: string) => {
  return html.toLowerCase().includes(text.toLowerCase());
};

const hasAttribute = (attr: string) => (html: string) => {
  const regex = new RegExp(`${attr}\\s*=`, 'i');
  return regex.test(html);
};

const hasCSS = (prop: string) => (html: string) => {
  return html.toLowerCase().includes(prop.toLowerCase());
};

const hasMultiple = (tag: string, min: number) => (html: string) => {
  const regex = new RegExp(`<${tag}[\\s>]`, 'gi');
  const matches = html.match(regex);
  return (matches?.length || 0) >= min;
};

// ============================
// ELENA - BAKERY (4 levels)
// ============================

const elena1: ProjectLevel = {
  id: 'elena-1',
  clientId: 'elena',
  title: "Elena's Bakery — First Page",
  briefSubject: "Need a simple website for my bakery!",
  briefBody: `Hi there! 👋

I'm Elena, I run a small bakery down on Harbor Row called "Elena's Bakery." I've been meaning to get a website for ages but never got around to it.

Nothing fancy — I just need:
• A heading with the bakery name
• A short welcome message
• A list of our popular items (Sourdough Bread, Croissant, Cinnamon Roll, Blueberry Muffin)

Can you help? I'd really appreciate it!

Warm regards,
Elena`,
  requirements: [
    { id: 'e1-h1', description: 'Add an <h1> heading with the bakery name', type: 'required', check: (html) => hasTag('h1')(html) && hasContent('bakery')(html) },
    { id: 'e1-p', description: 'Add a welcome paragraph', type: 'required', check: hasTag('p') },
    { id: 'e1-ul', description: 'Add a <ul> list of menu items', type: 'required', check: hasTag('ul') },
    { id: 'e1-li', description: 'Include at least 4 list items', type: 'required', check: hasMultiple('li', 4) },
    { id: 'e1-li-close', description: 'Close all list items properly', type: 'required', check: (html) => {
      const opens = (html.match(/<li[\s>]/gi) || []).length;
      const closes = (html.match(/<\/li>/gi) || []).length;
      return opens > 0 && opens === closes;
    }},
    { id: 'e1-h2', description: 'Add a subheading', type: 'bonus', check: hasTag('h2') },
    { id: 'e1-style', description: 'Add any styling', type: 'bonus', check: (html) => hasCSS('style')(html) || hasCSS('color')(html) },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Elena's Bakery</title>
</head>
<body>
  <!-- Build Elena's bakery page here! -->
  <!-- She needs: a heading, welcome message, and menu list -->
  
</body>
</html>`,
  concepts: ['Headings (h1)', 'Paragraphs (p)', 'Unordered Lists (ul, li)'],
  feedbackHigh: "Oh my goodness, this is wonderful! It's exactly what I imagined. The menu looks so clean! ✨",
  feedbackMid: "This is nice! It works well. Maybe we can make it feel a little more… inviting next time?",
  feedbackLow: "Hmm, something feels a little off. Could you take another look? I think something might be missing.",
};

const elena2: ProjectLevel = {
  id: 'elena-2',
  clientId: 'elena',
  title: "Elena's Bakery — Adding Images",
  briefSubject: "Can we add a photo to the bakery page?",
  briefBody: `Hi again! 

The page looks great so far! I was thinking — could we add an image of our bakery? I have this lovely photo of our bread display.

Also, could you:
• Add an image (you can use any placeholder image URL)
• Make sure the image has alt text for accessibility
• Add a caption below the image
• Maybe add our opening hours too?

Thanks so much!
Elena`,
  requirements: [
    { id: 'e2-img', description: 'Add an <img> tag', type: 'required', check: hasTag('img') },
    { id: 'e2-alt', description: 'Include alt text on the image', type: 'required', check: hasAttribute('alt') },
    { id: 'e2-src', description: 'Include src attribute on image', type: 'required', check: hasAttribute('src') },
    { id: 'e2-caption', description: 'Add a caption or description below image', type: 'required', check: (html) => {
      const imgIdx = html.indexOf('<img');
      const afterImg = html.slice(imgIdx);
      return hasTag('p')(afterImg) || hasTag('figcaption')(afterImg) || hasTag('em')(afterImg);
    }},
    { id: 'e2-hours', description: 'Add opening hours section', type: 'required', check: (html) => hasContent('hour')(html) || hasContent('open')(html) || hasContent('am')(html) || hasContent('pm')(html) },
    { id: 'e2-figure', description: 'Use <figure> and <figcaption>', type: 'bonus', check: hasTag('figure') },
    { id: 'e2-strong', description: 'Use <strong> or <em> for emphasis', type: 'bonus', check: (html) => hasTag('strong')(html) || hasTag('em')(html) },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Elena's Bakery</title>
</head>
<body>
  <h1>Elena's Bakery</h1>
  <p>Welcome to our cozy bakery on Harbor Row!</p>
  
  <h2>Our Menu</h2>
  <ul>
    <li>Sourdough Bread</li>
    <li>Croissant</li>
    <li>Cinnamon Roll</li>
    <li>Blueberry Muffin</li>
  </ul>
  
  <!-- Add an image with alt text here -->
  
  <!-- Add opening hours here -->
  
</body>
</html>`,
  concepts: ['Images (img)', 'Alt text', 'Figure & Figcaption', 'Emphasis tags'],
  feedbackHigh: "Oh, the picture looks lovely! And you even thought about people who can't see it. That's so thoughtful! 🥰",
  feedbackMid: "The image is there! It works. Though I wonder how someone who can't see it would experience this?",
  feedbackLow: "Hmm… I don't see the image yet. Did it… not load?",
};

const elena3: ProjectLevel = {
  id: 'elena-3',
  clientId: 'elena',
  title: "Elena's Bakery — Inline Styling",
  briefSubject: "Can we make it look prettier? 🎨",
  briefBody: `Hi!

The website is working great, but I was wondering if we could make it look a bit more… bakery-like? You know, warm and inviting!

Could you:
• Change the background color to something warm (like a cream or light peach)
• Make the heading a nice warm color (maybe brown or burgundy?)
• Add some padding around the content
• Style the menu list a bit (remove bullets, add spacing)
• Maybe center the heading?

I know you'll make it beautiful!
Elena`,
  requirements: [
    { id: 'e3-bgcolor', description: 'Set a background color on body or main container', type: 'required', check: (html) => hasCSS('background-color')(html) || hasCSS('background:')(html) },
    { id: 'e3-color', description: 'Change text/heading color', type: 'required', check: hasCSS('color:') },
    { id: 'e3-padding', description: 'Add padding to content', type: 'required', check: hasCSS('padding') },
    { id: 'e3-list-style', description: 'Style the list (remove bullets or add spacing)', type: 'required', check: (html) => hasCSS('list-style')(html) || hasCSS('margin')(html) },
    { id: 'e3-center', description: 'Center the heading', type: 'required', check: hasCSS('text-align') },
    { id: 'e3-font', description: 'Change font family', type: 'bonus', check: hasCSS('font-family') },
    { id: 'e3-border', description: 'Add borders or decorative elements', type: 'bonus', check: (html) => hasCSS('border')(html) || hasCSS('box-shadow')(html) },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Elena's Bakery</title>
</head>
<body>
  <h1>Elena's Bakery</h1>
  <p>Welcome to our cozy bakery on Harbor Row!</p>
  
  <h2>Our Menu</h2>
  <ul>
    <li>Sourdough Bread - $4.50</li>
    <li>Croissant - $3.00</li>
    <li>Cinnamon Roll - $3.50</li>
    <li>Blueberry Muffin - $2.75</li>
  </ul>
  
  <img src="https://placehold.co/400x250/f5e6d3/8b6914?text=Fresh+Bread" alt="Fresh bread display at Elena's Bakery">
  
  <h2>Opening Hours</h2>
  <p>Monday - Saturday: 7:00 AM - 6:00 PM</p>
  <p>Sunday: 8:00 AM - 2:00 PM</p>
</body>
</html>`,
  concepts: ['Inline CSS', 'Background color', 'Text color', 'Padding & Margin', 'Text alignment'],
  feedbackHigh: "Oh it feels so WARM now! Like walking into the actual bakery! I love the colors you chose! 🧡",
  feedbackMid: "It's looking better! The colors are nice. Maybe we can refine the spacing a touch?",
  feedbackLow: "Hmm, it's a start! But it still feels a bit… plain. Could we add more warmth?",
};

const elena4: ProjectLevel = {
  id: 'elena-4',
  clientId: 'elena',
  title: "Elena's Bakery — Full Redesign",
  briefSubject: "The bakery is expanding! New design needed! 🎉",
  briefBody: `Big news! We're expanding the bakery and I want the website to match!

I'd love a complete, polished page with:
• A styled header section with the bakery name and tagline
• An "About Us" section with a short story
• The full menu organized with categories (Breads, Pastries, Drinks)
• A "Visit Us" section with address and hours
• A footer with contact info
• Use a <style> block in the <head> instead of inline styles!

This is our big moment — make it count! 

With excitement,
Elena`,
  requirements: [
    { id: 'e4-style-block', description: 'Use a <style> block (internal CSS)', type: 'required', check: (html) => /<style[\s>][\s\S]*<\/style>/i.test(html) },
    { id: 'e4-header', description: 'Create a header section', type: 'required', check: (html) => hasTag('header')(html) || (hasTag('div')(html) && hasContent('bakery')(html)) },
    { id: 'e4-about', description: 'Include an About section', type: 'required', check: hasContent('about') },
    { id: 'e4-menu-cats', description: 'Organize menu with categories (multiple h2/h3)', type: 'required', check: hasMultiple('h2', 2) },
    { id: 'e4-footer', description: 'Add a footer', type: 'required', check: hasTag('footer') },
    { id: 'e4-contact', description: 'Include contact information', type: 'required', check: (html) => hasContent('contact')(html) || hasContent('email')(html) || hasContent('phone')(html) },
    { id: 'e4-semantic', description: 'Use semantic HTML (section, article, nav)', type: 'bonus', check: (html) => hasTag('section')(html) || hasTag('article')(html) || hasTag('nav')(html) },
    { id: 'e4-link', description: 'Add a link element', type: 'bonus', check: hasTag('a') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Elena's Bakery — Harbor Row</title>
  <style>
    /* Add your styles here! */
    
  </style>
</head>
<body>
  <!-- Build the full bakery website here!
       Sections needed:
       1. Header with name & tagline
       2. About Us
       3. Menu (Breads, Pastries, Drinks)
       4. Visit Us (address & hours)
       5. Footer with contact
  -->
  
</body>
</html>`,
  concepts: ['Internal CSS (<style> block)', 'Semantic HTML', 'Page sections', 'Footer', 'Multi-section layout'],
  unlocks: ['harbor-badge'],
  feedbackHigh: "I'm literally tearing up! This is EXACTLY what I dreamed of for the bakery website. You're incredible! 😭✨",
  feedbackMid: "This is really coming together! It's professional and organized. Great work!",
  feedbackLow: "It's getting there, but it feels incomplete. Could you add more sections?",
};

// ============================
// MR. IQBAL - BOOKSTORE (4 levels)
// ============================

const iqbal1: ProjectLevel = {
  id: 'iqbal-1',
  clientId: 'iqbal',
  title: "Iqbal's Books — Structured Page",
  briefSubject: "A properly structured page for my bookstore",
  briefBody: `Good day,

I am Mr. Iqbal, proprietor of Iqbal's Books & Antiquarian on Harbor Row. I require a website that reflects the orderliness of a well-organized library.

I need:
• A proper heading hierarchy (h1 for store name, h2 for sections)
• A "Featured Books" section with a list of at least 3 books
• An "About the Store" paragraph
• A "Store Hours" section

Please ensure correct tag structure. I have little tolerance for sloppy markup.

Regards,
A. Iqbal`,
  requirements: [
    { id: 'i1-h1', description: 'Single <h1> with store name', type: 'required', check: (html) => hasTag('h1')(html) && (html.match(/<h1[\s>]/gi) || []).length === 1 },
    { id: 'i1-h2', description: 'Use <h2> for section headings (at least 2)', type: 'required', check: hasMultiple('h2', 2) },
    { id: 'i1-books', description: 'List at least 3 books', type: 'required', check: hasMultiple('li', 3) },
    { id: 'i1-about', description: 'Include an About paragraph', type: 'required', check: hasTag('p') },
    { id: 'i1-hours', description: 'Include store hours', type: 'required', check: (html) => hasContent('hour')(html) || hasContent('open')(html) },
    { id: 'i1-nesting', description: 'All tags properly nested and closed', type: 'required', check: (html) => {
      const opens = (html.match(/<(h[1-6]|p|ul|ol|li|div|section|article)[\s>]/gi) || []);
      const closes = (html.match(/<\/(h[1-6]|p|ul|ol|li|div|section|article)>/gi) || []);
      return opens.length > 0 && opens.length === closes.length;
    }},
    { id: 'i1-ol', description: 'Use ordered list for ranking', type: 'bonus', check: hasTag('ol') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Iqbal's Books</title>
</head>
<body>
  <!-- Mr. Iqbal expects PERFECT structure.
       Use proper heading hierarchy (h1 > h2)
       Organize with clear sections.
  -->
  
</body>
</html>`,
  concepts: ['Heading hierarchy', 'Semantic structure', 'Ordered vs Unordered lists'],
  feedbackHigh: "Yes. This reads correctly. Well-structured. I approve.",
  feedbackMid: "Acceptable structure. Though there is room for improvement in the organization.",
  feedbackLow: "This reads… unevenly. Something isn't closing properly. Please review your markup.",
};

const iqbal2: ProjectLevel = {
  id: 'iqbal-2',
  clientId: 'iqbal',
  title: "Iqbal's Books — Book Catalog",
  briefSubject: "A proper catalog page with detailed entries",
  briefBody: `I need a more detailed book catalog page. Each book entry should include:

• Book title (as a heading)
• Author name
• A brief description
• Price

I'd like at least 4 book entries. Please use definition lists (<dl>, <dt>, <dd>) or a well-structured format for the book details.

Also include a "Categories" section with links (they can be placeholder # links) to: Fiction, Non-Fiction, Poetry, Rare Editions.

Structure above aesthetics, please.

— Mr. Iqbal`,
  requirements: [
    { id: 'i2-books', description: 'Include at least 4 book entries', type: 'required', check: hasMultiple('h3', 4) },
    { id: 'i2-authors', description: 'List author for each book', type: 'required', check: (html) => hasContent('author')(html) || hasMultiple('em', 2)(html) || hasMultiple('span', 2)(html) },
    { id: 'i2-price', description: 'Include prices', type: 'required', check: (html) => hasContent('$')(html) || hasContent('price')(html) },
    { id: 'i2-categories', description: 'Add a categories section with links', type: 'required', check: (html) => hasMultiple('a', 3)(html) },
    { id: 'i2-href', description: 'Links have href attributes', type: 'required', check: hasAttribute('href') },
    { id: 'i2-dl', description: 'Use definition list (<dl>)', type: 'bonus', check: hasTag('dl') },
    { id: 'i2-hr', description: 'Use <hr> to separate entries', type: 'bonus', check: hasTag('hr') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Iqbal's Books — Catalog</title>
</head>
<body>
  <h1>Iqbal's Books & Antiquarian</h1>
  <h2>Book Catalog</h2>
  
  <!-- Add book entries here. Each needs:
       - Title (h3)
       - Author
       - Description
       - Price
  -->
  
  <!-- Add Categories section with links -->
  
</body>
</html>`,
  concepts: ['Links (a, href)', 'Definition lists', 'Content organization', 'Horizontal rules'],
  feedbackHigh: "Precisely what I envisioned. The catalog is well-organized and readable. Excellent work.",
  feedbackMid: "The structure is sound. The entries could use more consistency, but it's functional.",
  feedbackLow: "The reference appears incorrect. Several entries lack proper detail.",
};

const iqbal3: ProjectLevel = {
  id: 'iqbal-3',
  clientId: 'iqbal',
  title: "Iqbal's Books — Styled with Class",
  briefSubject: "Time to make it presentable — with internal CSS",
  briefBody: `The structure is solid. Now let's add proper styling using a <style> block.

Requirements:
• Use a <style> block in the <head> — NO inline styles
• Style the body with a readable font and proper margins
• Style headings with a serif font (like Georgia)
• Book entries should have borders or visual separation
• Links should change color on hover
• Use classes to target specific elements

I want it to look like a proper bookstore — dignified, not flashy.

— Mr. Iqbal`,
  requirements: [
    { id: 'i3-style', description: 'Use a <style> block (no inline styles)', type: 'required', check: (html) => /<style[\s>][\s\S]*<\/style>/i.test(html) },
    { id: 'i3-font', description: 'Set a font-family', type: 'required', check: hasCSS('font-family') },
    { id: 'i3-margin', description: 'Use margin or padding on body', type: 'required', check: (html) => hasCSS('margin')(html) || hasCSS('padding')(html) },
    { id: 'i3-border', description: 'Add borders or visual separation to entries', type: 'required', check: (html) => hasCSS('border')(html) || hasCSS('box-shadow')(html) },
    { id: 'i3-hover', description: 'Style link hover states', type: 'required', check: hasCSS(':hover') },
    { id: 'i3-class', description: 'Use CSS classes', type: 'required', check: (html) => /\.\w+\s*\{/i.test(html) },
    { id: 'i3-no-inline', description: 'Avoid inline styles', type: 'bonus', check: (html) => {
      const bodyContent = html.match(/<body[\s\S]*<\/body>/i)?.[0] || '';
      return !(/style\s*=\s*"/i.test(bodyContent));
    }},
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Iqbal's Books — Styled</title>
  <style>
    /* Style the bookstore page here.
       Use classes, not inline styles.
       Mr. Iqbal wants: dignified, not flashy.
    */
    
  </style>
</head>
<body>
  <h1>Iqbal's Books & Antiquarian</h1>
  
  <nav>
    <a href="#fiction">Fiction</a> |
    <a href="#nonfiction">Non-Fiction</a> |
    <a href="#poetry">Poetry</a> |
    <a href="#rare">Rare Editions</a>
  </nav>
  
  <h2>Featured Books</h2>
  
  <div class="book-entry">
    <h3>The Old Man and the Sea</h3>
    <p><em>Ernest Hemingway</em></p>
    <p>A tale of an aging fisherman's epic struggle with a giant marlin.</p>
    <p>$12.99</p>
  </div>
  
  <div class="book-entry">
    <h3>To Kill a Mockingbird</h3>
    <p><em>Harper Lee</em></p>
    <p>A classic of modern American literature about justice and morality.</p>
    <p>$14.99</p>
  </div>
  
  <div class="book-entry">
    <h3>1984</h3>
    <p><em>George Orwell</em></p>
    <p>A dystopian masterpiece about surveillance and truth.</p>
    <p>$11.99</p>
  </div>
  
  <div class="book-entry">
    <h3>Leaves of Grass</h3>
    <p><em>Walt Whitman</em></p>
    <p>A groundbreaking collection of American poetry.</p>
    <p>$18.50</p>
  </div>
</body>
</html>`,
  concepts: ['Internal CSS', 'CSS classes', 'Hover states', 'Font styling', 'Border & spacing'],
  feedbackHigh: "This is precisely the aesthetic I envisioned. Dignified. Readable. Properly structured CSS. Well done.",
  feedbackMid: "The styling is functional. I'd prefer more consistency in the class usage.",
  feedbackLow: "The presentation is disorganized. Please use a style block, not inline styles.",
};

const iqbal4: ProjectLevel = {
  id: 'iqbal-4',
  clientId: 'iqbal',
  title: "Iqbal's Books — Complete Website",
  briefSubject: "The complete Iqbal's Books experience",
  briefBody: `This is the final version. I want a complete, professional bookstore website.

Required:
• Navigation bar at the top with links to page sections
• Hero section with store name, tagline, and description
• Book catalog organized by category with at least 6 books
• An "Events" section (book readings, signings)
• Contact section with address, phone, email
• Footer with copyright
• All styled with internal CSS — well-organized, semantic

I expect excellence.

— Mr. Iqbal`,
  requirements: [
    { id: 'i4-nav', description: 'Navigation bar with anchor links', type: 'required', check: (html) => hasTag('nav')(html) && hasMultiple('a', 3)(html) },
    { id: 'i4-hero', description: 'Hero/header section', type: 'required', check: hasTag('header') },
    { id: 'i4-categories', description: 'Books organized by category (3+ categories)', type: 'required', check: hasMultiple('h2', 3) },
    { id: 'i4-books', description: 'At least 6 book entries', type: 'required', check: hasMultiple('h3', 6) },
    { id: 'i4-events', description: 'Events section', type: 'required', check: hasContent('event') },
    { id: 'i4-contact', description: 'Contact information', type: 'required', check: (html) => hasContent('contact')(html) && (hasContent('phone')(html) || hasContent('email')(html)) },
    { id: 'i4-footer', description: 'Footer with copyright', type: 'required', check: (html) => hasTag('footer')(html) && hasContent('©')(html) },
    { id: 'i4-style', description: 'Internal CSS styling', type: 'required', check: (html) => /<style[\s>][\s\S]*<\/style>/i.test(html) },
    { id: 'i4-section', description: 'Use <section> tags', type: 'bonus', check: hasMultiple('section', 3) },
    { id: 'i4-table', description: 'Use a table for events schedule', type: 'bonus', check: hasTag('table') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Iqbal's Books & Antiquarian — Harbor Row</title>
  <style>
    /* Create a complete, dignified bookstore design */
    
  </style>
</head>
<body>
  <!-- Build the complete Iqbal's Books website:
       1. Navigation bar
       2. Hero/Header
       3. Book Catalog by Category
       4. Events
       5. Contact
       6. Footer
  -->
  
</body>
</html>`,
  concepts: ['Navigation', 'Page sections', 'Anchor links', 'Tables', 'Complete page layout'],
  unlocks: ['internal-css-access'],
  feedbackHigh: "Impeccable. This is what a bookstore website should look like. You have my full confidence.",
  feedbackMid: "A competent effort. The structure is sound, though some sections could be more refined.",
  feedbackLow: "Incomplete. Several required sections are missing. Please review the brief carefully.",
};

// ============================
// THEO PARK - CAFÉ (4 levels)
// ============================

const theo1: ProjectLevel = {
  id: 'theo-1',
  clientId: 'theo',
  title: "Theo's Café — The Menu Board",
  briefSubject: "Menu page. Simple. Clean.",
  briefBody: `Hey.

I'm Theo. I run the café on the corner.

I need a menu page. Here's what I want:

• Café name at the top
• Three categories: Hot Drinks, Cold Drinks, Food
• Items with prices under each category
• Use a table for at least one category

That's it. Don't over-design it.

— Theo`,
  requirements: [
    { id: 't1-h1', description: 'Café name as heading', type: 'required', check: hasTag('h1') },
    { id: 't1-cats', description: 'Three menu categories', type: 'required', check: hasMultiple('h2', 3) },
    { id: 't1-items', description: 'Menu items with prices', type: 'required', check: hasContent('$') },
    { id: 't1-table', description: 'Use a <table> for at least one category', type: 'required', check: hasTag('table') },
    { id: 't1-tr', description: 'Table has rows', type: 'required', check: hasMultiple('tr', 3) },
    { id: 't1-td', description: 'Table has data cells', type: 'required', check: hasMultiple('td', 3) },
    { id: 't1-th', description: 'Use table headers', type: 'bonus', check: hasTag('th') },
    { id: 't1-thead', description: 'Use <thead> and <tbody>', type: 'bonus', check: hasTag('thead') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Theo's Café</title>
</head>
<body>
  <!-- Build Theo's menu page.
       Categories: Hot Drinks, Cold Drinks, Food
       Use a table for at least one.
       Include prices.
  -->
  
</body>
</html>`,
  concepts: ['Tables (table, tr, td, th)', 'Table headers', 'Content organization'],
  feedbackHigh: "Clean. Functional. Exactly what I asked for.",
  feedbackMid: "It works. (pause) Could be cleaner.",
  feedbackLow: "Broken.",
};

const theo2: ProjectLevel = {
  id: 'theo-2',
  clientId: 'theo',
  title: "Theo's Café — Styled Menu",
  briefSubject: "Style it. Make it match this.",
  briefBody: `The structure is fine. Now style it.

I want:
• Dark background, light text (like a chalkboard)
• The menu should feel like a café board
• Tables need proper borders and spacing (border-collapse)
• Headings in a different color than body text
• Proper padding on table cells
• Center the whole thing

Use a <style> block. No inline garbage.

— Theo`,
  requirements: [
    { id: 't2-style', description: 'Use <style> block', type: 'required', check: (html) => /<style[\s>][\s\S]*<\/style>/i.test(html) },
    { id: 't2-dark-bg', description: 'Dark background color', type: 'required', check: (html) => {
      const style = html.match(/<style[\s\S]*?<\/style>/i)?.[0] || '';
      return hasCSS('background')(style);
    }},
    { id: 't2-light-text', description: 'Light text color', type: 'required', check: hasCSS('color:') },
    { id: 't2-border-collapse', description: 'Use border-collapse on tables', type: 'required', check: hasCSS('border-collapse') },
    { id: 't2-cell-padding', description: 'Padding on table cells', type: 'required', check: (html) => {
      const style = html.match(/<style[\s\S]*?<\/style>/i)?.[0] || '';
      return hasCSS('padding')(style);
    }},
    { id: 't2-center', description: 'Center the content', type: 'required', check: (html) => hasCSS('text-align: center')(html) || hasCSS('margin: 0 auto')(html) || hasCSS('margin:0 auto')(html) || hasCSS('margin: auto')(html) },
    { id: 't2-font', description: 'Custom font choice', type: 'bonus', check: hasCSS('font-family') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Theo's Café — Menu</title>
  <style>
    /* Make it look like a chalkboard menu.
       Dark bg, light text, clean tables.
    */
    
  </style>
</head>
<body>
  <h1>Theo's Café</h1>
  
  <h2>Hot Drinks</h2>
  <table>
    <thead>
      <tr><th>Item</th><th>Price</th></tr>
    </thead>
    <tbody>
      <tr><td>Espresso</td><td>$3.00</td></tr>
      <tr><td>Americano</td><td>$3.50</td></tr>
      <tr><td>Cappuccino</td><td>$4.50</td></tr>
      <tr><td>Latte</td><td>$4.50</td></tr>
    </tbody>
  </table>
  
  <h2>Cold Drinks</h2>
  <table>
    <thead>
      <tr><th>Item</th><th>Price</th></tr>
    </thead>
    <tbody>
      <tr><td>Iced Coffee</td><td>$4.00</td></tr>
      <tr><td>Cold Brew</td><td>$4.50</td></tr>
      <tr><td>Lemonade</td><td>$3.50</td></tr>
    </tbody>
  </table>
  
  <h2>Food</h2>
  <table>
    <thead>
      <tr><th>Item</th><th>Price</th></tr>
    </thead>
    <tbody>
      <tr><td>Avocado Toast</td><td>$8.00</td></tr>
      <tr><td>BLT Sandwich</td><td>$7.50</td></tr>
      <tr><td>Caesar Salad</td><td>$9.00</td></tr>
    </tbody>
  </table>
</body>
</html>`,
  concepts: ['Dark theme styling', 'Table styling', 'Border-collapse', 'CSS organization'],
  feedbackHigh: "Perfect. Looks like the actual board in my shop.",
  feedbackMid: "Close. Spacing is off.",
  feedbackLow: "It works. (pause) It's doing too much in the wrong place.",
};

const theo3: ProjectLevel = {
  id: 'theo-3',
  clientId: 'theo',
  title: "Theo's Café — Full Website",
  briefSubject: "Full site. About, menu, location. Do it right.",
  briefBody: `Time for the real thing.

I need a full café website:
• Header with café name and a tagline ("The best coffee on Harbor Row")
• About section — keep it short, I'm not sentimental  
• Full menu (styled tables)
• Location section with address
• Opening hours
• Footer

Use internal CSS. Style it properly. I want it to look like a real café website.

No hearts. No emojis. Just clean design.

— Theo`,
  requirements: [
    { id: 't3-header', description: 'Header with name and tagline', type: 'required', check: (html) => hasTag('header')(html) || (hasTag('h1')(html) && hasTag('p')(html)) },
    { id: 't3-about', description: 'About section', type: 'required', check: hasContent('about') },
    { id: 't3-menu', description: 'Styled menu with tables', type: 'required', check: hasTag('table') },
    { id: 't3-location', description: 'Location/address section', type: 'required', check: (html) => hasContent('address')(html) || hasContent('location')(html) || hasContent('harbor row')(html) },
    { id: 't3-hours', description: 'Opening hours', type: 'required', check: (html) => hasContent('hour')(html) || hasContent('am')(html) },
    { id: 't3-footer', description: 'Footer', type: 'required', check: hasTag('footer') },
    { id: 't3-style', description: 'Internal CSS', type: 'required', check: (html) => /<style[\s>][\s\S]*<\/style>/i.test(html) },
    { id: 't3-semantic', description: 'Use semantic elements (section, header, footer)', type: 'bonus', check: hasMultiple('section', 2) },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Theo's Café — Harbor Row</title>
  <style>
    /* Build a complete, clean café website */
    
  </style>
</head>
<body>
  <!-- Full café website:
       1. Header (name + tagline)
       2. About
       3. Menu (tables)
       4. Location & Hours
       5. Footer
  -->
  
</body>
</html>`,
  concepts: ['Complete page layout', 'Multiple sections', 'Professional design', 'Semantic HTML'],
  feedbackHigh: "This is exactly what I wanted. Clean. Professional. No unnecessary fluff.",
  feedbackMid: "It's functional. A few things could be tighter, but it works.",
  feedbackLow: "Incomplete. Read the brief again.",
};

const theo4: ProjectLevel = {
  id: 'theo-4',
  clientId: 'theo',
  title: "Theo's Café — The Perfect Page",
  briefSubject: "Final revision. Make it pixel-perfect.",
  briefBody: `Last chance. I want the page to be flawless.

Specific demands:
• Navigation bar that links to each section (use anchor IDs)
• A hero section with a large heading and background color
• Menu with proper table styling — alternating row colors
• A "Specials" section that stands out visually (different background)
• Contact section with a styled "email us" link
• Footer with subtle styling
• Every section should have an ID for navigation
• Total must be well-organized CSS — use classes efficiently

I'm trusting you with this. Don't make me regret it.

— Theo`,
  requirements: [
    { id: 't4-nav', description: 'Navigation with anchor links', type: 'required', check: (html) => hasTag('nav')(html) && hasMultiple('a', 4)(html) },
    { id: 't4-ids', description: 'Sections have IDs for navigation', type: 'required', check: (html) => (html.match(/id\s*=\s*"/gi) || []).length >= 4 },
    { id: 't4-hero', description: 'Hero section with distinctive styling', type: 'required', check: (html) => hasContent('hero')(html) || (hasTag('header')(html) && hasCSS('background')(html)) },
    { id: 't4-alt-rows', description: 'Alternating row colors (nth-child or classes)', type: 'required', check: (html) => hasCSS('nth-child')(html) || hasCSS('nth-of-type')(html) || hasCSS('alt-row')(html) || hasCSS('even')(html) },
    { id: 't4-specials', description: 'Specials section with distinct background', type: 'required', check: hasContent('special') },
    { id: 't4-mailto', description: 'Email link (mailto:)', type: 'required', check: hasContent('mailto:') },
    { id: 't4-footer', description: 'Styled footer', type: 'required', check: hasTag('footer') },
    { id: 't4-classes', description: 'Efficient use of CSS classes', type: 'required', check: (html) => {
      const style = html.match(/<style[\s\S]*?<\/style>/i)?.[0] || '';
      return (style.match(/\.\w+/g) || []).length >= 5;
    }},
    { id: 't4-smooth', description: 'Smooth scroll behavior', type: 'bonus', check: hasCSS('scroll-behavior') },
  ],
  templateCode: `<!DOCTYPE html>
<html>
<head>
  <title>Theo's Café — Harbor Row</title>
  <style>
    /* Pixel-perfect café design.
       Use classes efficiently.
       Alternating row colors.
       Distinct sections.
    */
    
  </style>
</head>
<body>
  <!-- The perfect café page:
       1. Navigation (anchor links)
       2. Hero section
       3. Menu (alternating rows)
       4. Specials (distinct background)
       5. Contact (with mailto link)
       6. Footer
       
       Every section needs an ID!
  -->
  
</body>
</html>`,
  concepts: ['Anchor navigation', 'CSS nth-child', 'Hero sections', 'mailto links', 'Advanced CSS selectors'],
  unlocks: ['studio-theme-2'],
  feedbackHigh: "...Perfect. Don't change anything.",
  feedbackMid: "Almost. Fix the small things.",
  feedbackLow: "Not there yet. Try again.",
};

// ============================
// MAYA — FLORIST (Act 1, Harbor Row)
// ============================
const maya1: ProjectLevel = {
  id: 'maya-1', clientId: 'maya', zone: 'harbor-row',
  title: 'Harbor Blooms — Seasonal Page',
  briefSubject: 'A soft little page for the shop 🌸',
  briefBody: `Hello dear,\n\nI run Harbor Blooms, the flower shop two doors down from Elena. I'd love a single, gentle page:\n• A header with the shop name\n• A short poem-like welcome\n• A section called "In Bloom This Week" listing 5 flowers\n• A pastel feel — pinks, creams, sage\n\nUse a <style> block. No pressure. Make it feel like a quiet morning.\n\n— Maya`,
  requirements: [
    { id: 'm1-h1', description: '<h1> with shop name', type: 'required', check: (h) => hasTag('h1')(h) && hasContent('bloom')(h) },
    { id: 'm1-style', description: 'Internal <style> block', type: 'required', check: (h) => /<style[\s>][\s\S]*<\/style>/i.test(h) },
    { id: 'm1-list', description: 'List of at least 5 flowers', type: 'required', check: hasMultiple('li', 5) },
    { id: 'm1-bg', description: 'Soft background color', type: 'required', check: (h) => hasCSS('background')(h) },
    { id: 'm1-font', description: 'Custom font-family', type: 'required', check: hasCSS('font-family') },
    { id: 'm1-quote', description: 'Use <blockquote> for the welcome poem', type: 'bonus', check: hasTag('blockquote') },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Harbor Blooms</title>\n  <style>\n    /* gentle, pastel, breathable */\n  </style>\n</head>\n<body>\n  <!-- A soft seasonal page for Maya -->\n</body>\n</html>`,
  concepts: ['Pastel palettes', 'Typography mood', 'Blockquote'],
  feedbackHigh: 'It feels like the shop on a Sunday morning. Thank you. 🌷',
  feedbackMid: "It's lovely. Maybe a touch more breathing room?",
  feedbackLow: "It's a bit loud for flowers, dear. Can we soften it?",
};

const maya2: ProjectLevel = {
  id: 'maya-2', clientId: 'maya', zone: 'harbor-row',
  title: 'Harbor Blooms — Bouquet Gallery',
  briefSubject: 'A tiny gallery of our bouquets',
  briefBody: `Could you make a gallery section?\n• 6 bouquet "cards" arranged in a grid\n• Each card: image, name, price\n• Hover effect that lifts the card slightly\n• Use CSS Grid or Flexbox\n\nThank you!\n— Maya`,
  requirements: [
    { id: 'm2-grid', description: 'Use CSS grid or flex layout', type: 'required', check: (h) => /display:\s*(grid|flex)/i.test(h) },
    { id: 'm2-cards', description: 'At least 6 cards (article or div)', type: 'required', check: (h) => hasMultiple('article', 6)(h) || hasMultiple('div', 6)(h) },
    { id: 'm2-img', description: 'Each card uses <img>', type: 'required', check: hasMultiple('img', 6) },
    { id: 'm2-hover', description: 'Hover state with transform', type: 'required', check: (h) => hasCSS(':hover')(h) && hasCSS('transform')(h) },
    { id: 'm2-price', description: 'Prices included', type: 'required', check: hasContent('$') },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Harbor Blooms — Gallery</title>\n<style>\n  /* grid of bouquet cards */\n</style></head>\n<body>\n  <h1>Harbor Blooms</h1>\n  <section class="gallery">\n    <!-- 6 bouquet cards -->\n  </section>\n</body>\n</html>`,
  concepts: ['CSS Grid', 'Flexbox', 'Hover transitions', 'Card layouts'],
  unlocks: ['florist-complete'],
  feedbackHigh: 'They look like real bouquets in the window. Beautiful.',
  feedbackMid: 'The grid works. The hover could be gentler.',
  feedbackLow: "The cards bunch together. It's hard to look at.",
};

// ============================
// MIRA — BOUTIQUE (Act 2, Seabrook Promenade)
// ============================
const mira1: ProjectLevel = {
  id: 'mira-1', clientId: 'mira', zone: 'seabrook-promenade',
  title: 'Tide & Linen — Lookbook Landing',
  briefSubject: 'A modern landing page for the boutique',
  briefBody: `Hi! Mira from Tide & Linen on Seabrook Promenade.\n\nI need a landing page that screams "modern coastal boutique":\n• Full-bleed hero with a tagline\n• Bold display typography (serif vibe)\n• A 3-column "Collections" grid (Linen, Knit, Swim)\n• Sticky header with nav\n• Plenty of whitespace\n\nInternal CSS. No emojis on the page.\n\n— Mira`,
  requirements: [
    { id: 'mi1-hero', description: 'Hero section with large heading', type: 'required', check: (h) => hasTag('h1')(h) && hasCSS('background')(h) },
    { id: 'mi1-nav', description: 'Sticky <nav> header', type: 'required', check: (h) => hasTag('nav')(h) && /position:\s*(sticky|fixed)/i.test(h) },
    { id: 'mi1-grid', description: '3-column grid for collections', type: 'required', check: (h) => hasCSS('grid-template-columns')(h) || /display:\s*flex/i.test(h) },
    { id: 'mi1-font', description: 'Display serif font', type: 'required', check: (h) => /font-family[^;]*(serif|Playfair|Georgia)/i.test(h) },
    { id: 'mi1-style', description: 'Internal CSS', type: 'required', check: (h) => /<style[\s>][\s\S]*<\/style>/i.test(h) },
    { id: 'mi1-letter', description: 'Letter-spacing for elegance', type: 'bonus', check: hasCSS('letter-spacing') },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Tide & Linen</title>\n<style>\n  /* boutique — whitespace, serif headings */\n</style></head>\n<body>\n  <nav><!-- sticky --></nav>\n  <header><!-- hero --></header>\n  <section><!-- 3 collections --></section>\n</body>\n</html>`,
  concepts: ['Hero sections', 'Sticky positioning', 'Display typography', 'Grid'],
  feedbackHigh: 'Stunning. Exactly the boutique energy I wanted.',
  feedbackMid: "Nice, but it doesn't feel premium yet.",
  feedbackLow: 'It looks like a template. Curate it.',
};

const mira2: ProjectLevel = {
  id: 'mira-2', clientId: 'mira', zone: 'seabrook-promenade',
  title: 'Tide & Linen — Product Page',
  briefSubject: 'A single product page, done right',
  briefBody: `Single product page:\n• Two-column layout: image left, details right\n• Product name, price, description, size buttons\n• "Add to Bag" button with hover\n• 3 color swatches (rounded)\n• Responsive — stack on narrow screens via @media\n\n— Mira`,
  requirements: [
    { id: 'mi2-cols', description: 'Two-column layout', type: 'required', check: (h) => hasCSS('grid-template-columns')(h) || /display:\s*flex/i.test(h) },
    { id: 'mi2-buttons', description: '3+ size buttons', type: 'required', check: hasMultiple('button', 3) },
    { id: 'mi2-cta', description: '"Add to Bag" with hover', type: 'required', check: (h) => hasContent('add to bag')(h) && hasCSS(':hover')(h) },
    { id: 'mi2-media', description: 'Responsive @media', type: 'required', check: hasCSS('@media') },
    { id: 'mi2-swatch', description: 'Rounded color swatches', type: 'required', check: (h) => /border-radius:\s*50%/i.test(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Tide & Linen — Product</title>\n<style>\n  @media (max-width: 600px) { /* stack */ }\n</style></head>\n<body>\n  <main class="product"><!-- image | details --></main>\n</body>\n</html>`,
  concepts: ['@media queries', 'Responsive layouts', 'CTA design'],
  unlocks: ['boutique-complete'],
  feedbackHigh: 'Pixel-perfect. The mobile layout is chef-kiss.',
  feedbackMid: 'Works on desktop. Mobile breaks a little.',
  feedbackLow: 'It feels stuck in 2010. Try again.',
};

// ============================
// LUCAS — SURF SCHOOL (Act 2)
// ============================
const lucas1: ProjectLevel = {
  id: 'lucas-1', clientId: 'lucas', zone: 'seabrook-promenade',
  title: 'Bennett Surf — Splash Page',
  briefSubject: 'Yo! Need a fun page for the surf school 🏄',
  briefBody: `Hey hey! Lucas here.\n\nSplash page for my surf school:\n• Big bold heading "Catch Your First Wave"\n• Gradient background (ocean + sunset)\n• "Book a lesson" button that pulses (CSS animation)\n• Lesson schedule table\n• Vibe: fun, energetic, NOT corporate\n\nGo wild!\n— Lucas`,
  requirements: [
    { id: 'l1-h1', description: 'Bold <h1>', type: 'required', check: hasTag('h1') },
    { id: 'l1-grad', description: 'CSS gradient background', type: 'required', check: hasCSS('gradient') },
    { id: 'l1-anim', description: '@keyframes animation', type: 'required', check: hasCSS('@keyframes') },
    { id: 'l1-btn', description: 'Animated CTA button', type: 'required', check: (h) => hasTag('button')(h) && hasCSS('animation')(h) },
    { id: 'l1-table', description: 'Schedule table', type: 'required', check: hasTag('table') },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Bennett Surf School</title>\n<style>\n  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }\n</style></head>\n<body>\n  <h1>Catch Your First Wave</h1>\n  <button>Book a Lesson</button>\n  <table><!-- schedule --></table>\n</body>\n</html>`,
  concepts: ['Gradients', '@keyframes', 'Animations', 'CTAs'],
  unlocks: ['surf-complete'],
  feedbackHigh: 'STOKED! That button literally pulses like the ocean! 🌊',
  feedbackMid: 'Solid! Could pop more though.',
  feedbackLow: "Bro… where's the energy?",
};

// ============================
// DEAN — ARCHITECT (Act 3, Cedar Heights)
// ============================
const dean1: ProjectLevel = {
  id: 'dean-1', clientId: 'dean', zone: 'cedar-heights',
  title: 'Raghav Studio — Portfolio Index',
  briefSubject: 'Minimalist portfolio index — please respect the grid',
  briefBody: `Dean Raghav. Architect. Cedar Heights.\n\nPortfolio index. Restraint is the brief.\n• Monospace or thin sans heading\n• A 12-column grid\n• Black/white/one accent — no more\n• Generous line-height (1.7+)\n• 6 project tiles, each: title, year, location\n• Use semantic <article>\n\nAesthetics through omission.\n\n— Dean`,
  requirements: [
    { id: 'd1-grid', description: '12-col CSS grid', type: 'required', check: (h) => /grid-template-columns:[^;]*repeat\(\s*12/i.test(h) },
    { id: 'd1-articles', description: '6 <article> tiles', type: 'required', check: hasMultiple('article', 6) },
    { id: 'd1-line', description: 'line-height >= 1.6', type: 'required', check: (h) => /line-height:\s*(1\.[6-9]|[2-9])/i.test(h) },
    { id: 'd1-mono', description: 'Monospace or specific sans font', type: 'required', check: (h) => /font-family[^;]*(mono|Helvetica|Inter)/i.test(h) },
    { id: 'd1-restraint', description: 'No more than 5 distinct colors', type: 'required', check: (h) => {
      const colors = new Set((h.match(/#[0-9a-f]{3,6}|rgb\([^)]+\)|hsl\([^)]+\)/gi) || []).map(c => c.toLowerCase()));
      return colors.size <= 5;
    }},
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Raghav Studio</title>\n<style>\n  body { font-family: monospace; line-height: 1.7; }\n  .grid { display: grid; grid-template-columns: repeat(12, 1fr); }\n</style></head>\n<body>\n  <main class="grid">\n    <!-- 6 articles -->\n  </main>\n</body>\n</html>`,
  concepts: ['12-col grid', 'Restraint', 'Type scale', 'Semantic articles'],
  feedbackHigh: 'Quiet. Intentional. Thank you.',
  feedbackMid: 'Functional. Lacks discipline in the grid.',
  feedbackLow: 'Too much. Strip it back.',
};

const dean2: ProjectLevel = {
  id: 'dean-2', clientId: 'dean', zone: 'cedar-heights',
  title: 'Raghav Studio — Project Detail',
  briefSubject: 'A single project case study',
  briefBody: `Long-scroll case study:\n• Hero with project title + meta\n• Multi-column body text\n• Image gallery (3 across)\n• Footer with next/prev navigation\n• Use CSS variables for all colors\n\n— Dean`,
  requirements: [
    { id: 'd2-vars', description: 'Use CSS custom properties', type: 'required', check: (h) => /--[a-z][\w-]*\s*:/i.test(h) },
    { id: 'd2-cols', description: 'Multi-column text', type: 'required', check: (h) => hasCSS('column-count')(h) || /columns:/i.test(h) },
    { id: 'd2-gallery', description: '3 images in grid/flex', type: 'required', check: (h) => hasMultiple('img', 3)(h) && (hasCSS('grid-template-columns')(h) || /display:\s*flex/i.test(h)) },
    { id: 'd2-footer', description: 'Footer with prev/next', type: 'required', check: (h) => hasTag('footer')(h) && (hasContent('next')(h) || hasContent('prev')(h)) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Raghav Studio — Project</title>\n<style>\n  :root { --ink: #111; --bg: #fafafa; }\n</style></head>\n<body>\n  <header><!-- hero --></header>\n  <article><!-- body --></article>\n  <section><!-- 3 images --></section>\n  <footer><!-- prev/next --></footer>\n</body>\n</html>`,
  concepts: ['CSS variables', 'Multi-column text', 'Long-scroll'],
  unlocks: ['architect-complete'],
  feedbackHigh: 'This reads like a printed monograph. Excellent.',
  feedbackMid: 'Acceptable. The variables save you.',
  feedbackLow: 'You missed the brief.',
};

// ============================
// NORA — STARTUP (Act 3)
// ============================
const nora1: ProjectLevel = {
  id: 'nora-1', clientId: 'nora', zone: 'cedar-heights',
  title: 'Kindle.dev — SaaS Landing',
  briefSubject: 'Dark-mode SaaS landing, modern devtool aesthetic',
  briefBody: `Hey! Nora, founder of Kindle.dev.\n\nLanding page that screams modern devtool:\n• Dark background, neon accent (cyan or violet)\n• Hero with gradient text effect\n• 3-feature grid\n• Code snippet block (<pre><code>)\n• Testimonial section\n• CTA: "Get Started Free"\n• Sticky nav\n\nThink Vercel/Linear vibes.\n— Nora`,
  requirements: [
    { id: 'n1-dark', description: 'Dark background', type: 'required', check: (h) => /background[^;]*:\s*(#0|#1|black|hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*[0-2]\d?%)/i.test(h) },
    { id: 'n1-gradtext', description: 'Gradient text', type: 'required', check: (h) => /background-clip:\s*text/i.test(h) || /-webkit-background-clip:\s*text/i.test(h) },
    { id: 'n1-features', description: '3-feature grid', type: 'required', check: (h) => hasCSS('grid-template-columns')(h) },
    { id: 'n1-code', description: '<pre><code> snippet', type: 'required', check: (h) => hasTag('pre')(h) && hasTag('code')(h) },
    { id: 'n1-cta', description: '"Get Started" CTA', type: 'required', check: hasContent('get started') },
    { id: 'n1-nav', description: 'Sticky <nav>', type: 'required', check: (h) => hasTag('nav')(h) && /position:\s*(sticky|fixed)/i.test(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Kindle.dev</title>\n<style>\n  body { background: #0a0a12; color: #eaeaff; font-family: Inter, sans-serif; }\n  .grad { background: linear-gradient(90deg, #7df, #d7f); -webkit-background-clip: text; color: transparent; }\n</style></head>\n<body>\n  <nav><!-- sticky --></nav>\n  <header><h1 class="grad">Build faster.</h1></header>\n  <section><!-- 3 features --></section>\n  <pre><code>// usage</code></pre>\n  <section><!-- testimonial --></section>\n</body>\n</html>`,
  concepts: ['Dark UI', 'Gradient text', 'Code blocks', 'SaaS landing'],
  unlocks: ['startup-complete', 'wallpaper-neon'],
  feedbackHigh: 'This is shippable. Genuinely.',
  feedbackMid: "It's fine. But 'fine' won't get us funded.",
  feedbackLow: 'This looks like a 2008 blog. Hard pass.',
};

// ============================
// EXTRA ACT 2 + ACT 3 LEVELS
// ============================
const mira3: ProjectLevel = {
  id: 'mira-3', clientId: 'mira', zone: 'seabrook-promenade',
  title: 'Tide & Linen — Editorial Story',
  briefSubject: 'A scrolling editorial about the SS collection',
  briefBody: `Long-form editorial page:\n• Magazine-style with serif headlines\n• Pull-quotes (large italic blockquote)\n• 2-column body where space allows\n• Drop-cap on the first paragraph (::first-letter)\n• Sticky side caption\n\n— Mira`,
  requirements: [
    { id: 'mi3-quote', description: 'Pull-quote uses <blockquote>', type: 'required', check: hasTag('blockquote') },
    { id: 'mi3-cap', description: '::first-letter drop-cap', type: 'required', check: hasCSS('::first-letter') },
    { id: 'mi3-cols', description: 'CSS columns for body', type: 'required', check: (h) => /columns:|column-count/i.test(h) },
    { id: 'mi3-sticky', description: 'Sticky side element', type: 'required', check: (h) => /position:\s*sticky/i.test(h) },
    { id: 'mi3-serif', description: 'Serif headline', type: 'required', check: (h) => /font-family[^;]*serif/i.test(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Tide & Linen — Editorial</title>\n<style>\n  article p:first-of-type::first-letter { float: left; font-size: 4em; }\n</style></head>\n<body>\n  <article><!-- editorial --></article>\n</body>\n</html>`,
  concepts: ['::first-letter', 'CSS columns', 'Editorial layout'],
  unlocks: ['boutique-editorial'],
  feedbackHigh: 'I want this printed and framed.',
  feedbackMid: 'It reads well. The drop-cap saves it.',
  feedbackLow: 'It reads like a blog post. We need editorial weight.',
};

const lucas2: ProjectLevel = {
  id: 'lucas-2', clientId: 'lucas', zone: 'seabrook-promenade',
  title: 'Bennett Surf — Booking Form',
  briefSubject: 'A real booking form for lessons',
  briefBody: `Need a working booking form:\n• Name, email, date, level (select), notes (textarea)\n• Required fields, type=email validation\n• Submit button with success animation\n• Use <fieldset> + <legend>\n\n— Lucas`,
  requirements: [
    { id: 'l2-form', description: 'Has <form>', type: 'required', check: hasTag('form') },
    { id: 'l2-fieldset', description: 'Uses <fieldset> + <legend>', type: 'required', check: (h) => hasTag('fieldset')(h) && hasTag('legend')(h) },
    { id: 'l2-email', description: 'type="email" input', type: 'required', check: (h) => /type\s*=\s*"email"/i.test(h) },
    { id: 'l2-required', description: 'required attribute', type: 'required', check: (h) => /\brequired\b/i.test(h) },
    { id: 'l2-select', description: 'Has <select>', type: 'required', check: hasTag('select') },
    { id: 'l2-textarea', description: 'Has <textarea>', type: 'required', check: hasTag('textarea') },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Book a Lesson</title><style></style></head>\n<body>\n  <form>\n    <fieldset><legend>Lesson Details</legend></fieldset>\n  </form>\n</body>\n</html>`,
  concepts: ['Forms', 'Validation', 'Fieldsets'],
  feedbackHigh: 'Bookings are rolling in! 🤙',
  feedbackMid: 'Works. Could feel friendlier.',
  feedbackLow: 'Form rejected my email. Check it.',
};

const lucas3: ProjectLevel = {
  id: 'lucas-3', clientId: 'lucas', zone: 'seabrook-promenade',
  title: 'Bennett Surf — Wave Cam',
  briefSubject: 'Live wave conditions widget',
  briefBody: `Build a "wave conditions" widget:\n• 4 stat cards: wave height, wind, tide, water temp\n• Each animates in (CSS transition or animation)\n• Color-coded by quality (green/yellow/red)\n• Use CSS variables for theming\n\n— Lucas`,
  requirements: [
    { id: 'l3-cards', description: '4 stat cards', type: 'required', check: (h) => hasMultiple('div', 4)(h) || hasMultiple('article', 4)(h) },
    { id: 'l3-vars', description: 'CSS custom properties', type: 'required', check: (h) => /--[a-z][\w-]*\s*:/i.test(h) },
    { id: 'l3-anim', description: 'transition or animation', type: 'required', check: (h) => hasCSS('transition')(h) || hasCSS('animation')(h) },
    { id: 'l3-grid', description: 'Grid or flex layout', type: 'required', check: (h) => /display:\s*(grid|flex)/i.test(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Wave Cam</title><style>:root{--good:#3a3;--ok:#dc3;--bad:#c33;}</style></head>\n<body>\n  <section class="cards"></section>\n</body>\n</html>`,
  concepts: ['CSS variables', 'Stat widgets'],
  unlocks: ['surf-complete-2'],
  feedbackHigh: 'Surf school just leveled up. 🌊',
  feedbackMid: 'Solid widget. Colors are off.',
  feedbackLow: 'Missing the wave height. Kind of important.',
};

const dean3: ProjectLevel = {
  id: 'dean-3', clientId: 'dean', zone: 'cedar-heights',
  title: 'Raghav Studio — Practice Page',
  briefSubject: 'Practice ethos page — typography only',
  briefBody: `One long-form page about the practice. Restrictions:\n• No images. Type only.\n• Modular scale (define in CSS variables)\n• At least 4 type sizes derived from scale\n• Asymmetric grid for the manifesto\n• Print-friendly @media print rules\n\n— Dean`,
  requirements: [
    { id: 'd3-vars', description: 'CSS variables for type scale', type: 'required', check: (h) => /--[a-z][\w-]*size/i.test(h) || /--scale/i.test(h) },
    { id: 'd3-noimg', description: 'No <img> tags', type: 'required', check: (h) => !hasTag('img')(h) },
    { id: 'd3-print', description: '@media print', type: 'required', check: (h) => /@media\s+print/i.test(h) },
    { id: 'd3-grid', description: 'CSS grid', type: 'required', check: hasCSS('grid-template') },
    { id: 'd3-headings', description: '4+ heading levels', type: 'required', check: (h) => hasTag('h1')(h) && hasTag('h2')(h) && hasTag('h3')(h) && hasTag('h4')(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Raghav — Practice</title>\n<style>\n  :root { --scale: 1.25; --size-1: 1rem; --size-2: calc(var(--size-1) * var(--scale)); }\n  @media print { body { color: black; } }\n</style></head>\n<body>\n  <main></main>\n</body>\n</html>`,
  concepts: ['Modular scale', 'Print styles', 'Type-only design'],
  unlocks: ['architect-complete-2'],
  feedbackHigh: 'A page that earns its silence.',
  feedbackMid: 'The scale is uneven.',
  feedbackLow: 'Where is the discipline?',
};

const nora2: ProjectLevel = {
  id: 'nora-2', clientId: 'nora', zone: 'cedar-heights',
  title: 'Kindle.dev — Pricing Page',
  briefSubject: 'Pricing page for the launch',
  briefBody: `Three-tier pricing page:\n• 3 cards: Free, Pro, Team (Pro should be highlighted)\n• Feature checklist per tier\n• Toggle: monthly / yearly (just visual is fine)\n• CTA on each\n• Dark theme with neon accent\n\n— Nora`,
  requirements: [
    { id: 'n2-3cards', description: '3 pricing cards', type: 'required', check: (h) => hasMultiple('article', 3)(h) || hasMultiple('div', 3)(h) },
    { id: 'n2-toggle', description: 'monthly/yearly toggle', type: 'required', check: (h) => hasContent('monthly')(h) && hasContent('yearly')(h) },
    { id: 'n2-cta', description: '3 CTAs', type: 'required', check: (h) => hasMultiple('button', 3)(h) || hasMultiple('a', 3)(h) },
    { id: 'n2-dark', description: 'Dark background', type: 'required', check: (h) => /background[^;]*:\s*(#0|#1|black)/i.test(h) },
    { id: 'n2-features', description: 'Checklist (ul + li)', type: 'required', check: (h) => hasMultiple('ul', 3)(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Pricing — Kindle.dev</title>\n<style>body{background:#0a0a12;color:#eaeaff;}</style></head>\n<body>\n  <section class="pricing"></section>\n</body>\n</html>`,
  concepts: ['Pricing patterns', 'Visual hierarchy'],
  feedbackHigh: 'Conversion is going to spike. 🚀',
  feedbackMid: 'Cards look fine. The hierarchy is muddy.',
  feedbackLow: 'Which one am I supposed to buy?',
};

const nora3: ProjectLevel = {
  id: 'nora-3', clientId: 'nora', zone: 'cedar-heights',
  title: 'Kindle.dev — Docs Layout',
  briefSubject: 'Docs site shell',
  briefBody: `Documentation shell:\n• Sticky left sidebar (nav with nested ul)\n• Main content with code blocks\n• Right "On this page" rail (sticky)\n• Search input at top of sidebar\n• Dark mode by default, prefers-color-scheme aware\n\n— Nora`,
  requirements: [
    { id: 'n3-aside', description: 'Sidebar uses <aside>', type: 'required', check: hasTag('aside') },
    { id: 'n3-nestedul', description: 'Nested <ul>', type: 'required', check: (h) => /<ul[\s\S]*<ul/i.test(h) },
    { id: 'n3-sticky', description: 'Two sticky elements', type: 'required', check: (h) => (h.match(/position:\s*sticky/gi) || []).length >= 2 },
    { id: 'n3-search', description: 'Search input', type: 'required', check: (h) => /type\s*=\s*"search"/i.test(h) || /placeholder\s*=\s*"[^"]*search/i.test(h) },
    { id: 'n3-pcs', description: 'prefers-color-scheme', type: 'required', check: (h) => /prefers-color-scheme/i.test(h) },
    { id: 'n3-code', description: '<pre><code>', type: 'required', check: (h) => hasTag('pre')(h) && hasTag('code')(h) },
  ],
  templateCode: `<!DOCTYPE html>\n<html>\n<head><title>Docs — Kindle.dev</title>\n<style>\n  @media (prefers-color-scheme: dark) { body { background:#0a0a12; color:#eaeaff; } }\n</style></head>\n<body>\n  <aside><!-- sidebar --></aside>\n  <main><!-- content --></main>\n  <aside><!-- on this page --></aside>\n</body>\n</html>`,
  concepts: ['Docs layouts', 'Sticky positioning', 'Color scheme'],
  unlocks: ['startup-complete-2'],
  feedbackHigh: 'This is the shell. Shipping it.',
  feedbackMid: 'Layout is OK. Sidebar collapses weirdly.',
  feedbackLow: 'I cannot find anything.',
};

// ============================
// EXTENDED ROSTER
// ============================
const mk = (id: string, clientId: string, zone: string, title: string, brief: string, reqs: { id: string; desc: string; check: (h: string) => boolean; bonus?: boolean }[], templateCode = `<!DOCTYPE html>\n<html><head><title>${title}</title><style></style></head><body>\n</body></html>`): ProjectLevel => ({
  id, clientId, zone, title,
  briefSubject: title,
  briefBody: brief,
  requirements: reqs.map(r => ({ id: r.id, description: r.desc, type: (r.bonus ? 'bonus' : 'required') as 'required' | 'bonus', check: r.check })),
  templateCode,
  concepts: [],
  feedbackHigh: 'Beautiful — exactly what I needed.',
  feedbackMid: 'It works. Could be tighter.',
  feedbackLow: 'Something is off. Take another pass?',
});

const elena5 = mk('elena-5', 'elena', 'harbor-row', "Elena's Bakery — Order Form",
  "Add a simple order form: name, email, item select, quantity, notes, submit.", [
  { id: 'e5-form', desc: 'Has <form>', check: hasTag('form') },
  { id: 'e5-email', desc: 'type="email"', check: (h) => /type\s*=\s*"email"/i.test(h) },
  { id: 'e5-select', desc: '<select>', check: hasTag('select') },
  { id: 'e5-qty', desc: 'type="number"', check: (h) => /type\s*=\s*"number"/i.test(h) },
  { id: 'e5-textarea', desc: '<textarea>', check: hasTag('textarea') },
  { id: 'e5-submit', desc: 'submit button', check: (h) => /type\s*=\s*"submit"/i.test(h) || hasTag('button')(h) },
]);
const iqbal5 = mk('iqbal-5', 'iqbal', 'harbor-row', "Iqbal's Books — Member Page",
  "Members area: header, table of borrowed books, return dates, fines column.", [
  { id: 'i5-table', desc: '<table> with rows', check: (h) => hasTag('table')(h) && hasMultiple('tr', 4)(h) },
  { id: 'i5-thead', desc: '<thead>+<tbody>', check: (h) => hasTag('thead')(h) && hasTag('tbody')(h) },
  { id: 'i5-th', desc: '4 column headers', check: hasMultiple('th', 4) },
  { id: 'i5-caption', desc: '<caption>', check: hasTag('caption') },
]);
const theo5 = mk('theo-5', 'theo', 'harbor-row', "Theo's Café — Loyalty Stamp Card",
  "10-stamp loyalty grid. Filled stamps in primary color, empty outlined. Use grid.", [
  { id: 't5-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 't5-stamps', desc: '10 stamp cells', check: (h) => (h.match(/<div\b/gi) || []).length >= 10 || (h.match(/<span\b/gi) || []).length >= 10 },
  { id: 't5-radius', desc: 'border-radius:50%', check: (h) => /border-radius:\s*50%/i.test(h) },
]);
const maya3 = mk('maya-3', 'maya', 'harbor-row', "Harbor Blooms — Wedding Page",
  "Wedding inquiry: hero, 3 packages, inquiry form, soft palette.", [
  { id: 'm3-h1', desc: '<h1>', check: hasTag('h1') },
  { id: 'm3-cards', desc: '3 package cards', check: (h) => hasMultiple('article', 3)(h) || hasMultiple('div', 3)(h) },
  { id: 'm3-form', desc: 'inquiry form', check: hasTag('form') },
  { id: 'm3-bg', desc: 'pastel background', check: hasCSS('background') },
]);
const mira4 = mk('mira-4', 'mira', 'seabrook-promenade', "Tide & Linen — Lookbook Carousel",
  "Horizontal-scroll lookbook with snap points. Use scroll-snap-type and 6+ images.", [
  { id: 'mi4-snap', desc: 'scroll-snap-type', check: (h) => /scroll-snap-type/i.test(h) },
  { id: 'mi4-imgs', desc: '6+ images', check: hasMultiple('img', 6) },
  { id: 'mi4-overflow', desc: 'overflow-x', check: (h) => /overflow-x:\s*(auto|scroll)/i.test(h) },
]);
const lucas4 = mk('lucas-4', 'lucas', 'seabrook-promenade', "Bennett Surf — Gear Shop",
  "Gear shop: 6 product cards in grid, prices, buy buttons, hover lift.", [
  { id: 'l4-cards', desc: '6 cards', check: (h) => hasMultiple('article', 6)(h) || hasMultiple('div', 6)(h) },
  { id: 'l4-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 'l4-hover', desc: 'hover transform', check: (h) => hasCSS(':hover')(h) && hasCSS('transform')(h) },
  { id: 'l4-prices', desc: 'prices', check: hasContent('$') },
]);
const gelato1 = mk('gelato-1', 'sole', 'seabrook-promenade', "Sole Gelato — Flavor Menu",
  "Pastel flavor menu: heading, 12 flavors as list with V/GF tags, hours.", [
  { id: 'g1-chips', desc: '12 list items', check: hasMultiple('li', 12) },
  { id: 'g1-tags', desc: 'V or GF text', check: (h) => /\b(V|GF|vegan|gluten)\b/i.test(h) },
  { id: 'g1-hours', desc: 'opening hours', check: (h) => hasContent('open')(h) || hasContent('hour')(h) },
]);
const arcade1 = mk('arcade-1', 'kira', 'seabrook-promenade', "Promenade Arcade — Leaderboard",
  "80s leaderboard: top 10, monospace, neon accent, table layout.", [
  { id: 'a1-table', desc: '<table>', check: hasTag('table') },
  { id: 'a1-rows', desc: '10 rows', check: hasMultiple('tr', 10) },
  { id: 'a1-mono', desc: 'monospace', check: (h) => /font-family[^;]*mono/i.test(h) },
  { id: 'a1-neon', desc: 'text-shadow', check: hasCSS('text-shadow') },
]);
const hotel1 = mk('hotel-1', 'evren', 'seabrook-promenade', "Hotel Mistral — Booking Widget",
  "Booking widget: check-in, check-out, guests select, search button.", [
  { id: 'h1-dates', desc: 'two date inputs', check: (h) => (h.match(/type\s*=\s*"date"/gi) || []).length >= 2 },
  { id: 'h1-guests', desc: '<select>', check: hasTag('select') },
  { id: 'h1-cta', desc: 'search/book', check: (h) => hasContent('search')(h) || hasContent('book')(h) },
]);
const gallery1 = mk('gallery-1', 'rune', 'seabrook-promenade', "Driftwood Gallery — Exhibition",
  "Exhibition page: hero image, artist bio, work grid (5+), opening hours.", [
  { id: 'gl1-hero', desc: 'hero <img>', check: hasTag('img') },
  { id: 'gl1-grid', desc: 'grid of works', check: hasCSS('grid-template-columns') },
  { id: 'gl1-bio', desc: 'bio paragraphs', check: (h) => (h.match(/<p[\s>]/gi) || []).length >= 2 },
]);
const dean4 = mk('dean-4', 'dean', 'cedar-heights', "Raghav Studio — Press Kit",
  "Press kit: downloads, bio, contact, perfect grid.", [
  { id: 'd4-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 'd4-links', desc: 'download links', check: (h) => (h.match(/<a[\s>]/gi) || []).length >= 3 },
  { id: 'd4-vars', desc: 'CSS variables', check: (h) => /--[a-z][\w-]*\s*:/i.test(h) },
  { id: 'd4-section', desc: 'multiple <section>', check: hasMultiple('section', 3) },
]);
const nora4 = mk('nora-4', 'nora', 'cedar-heights', "Kindle.dev — Changelog",
  "Changelog: chronological entries, version tags, categories.", [
  { id: 'n4-entries', desc: '5+ <article>', check: hasMultiple('article', 5) },
  { id: 'n4-tags', desc: 'version tags', check: (h) => /v?\d+\.\d+/i.test(h) },
  { id: 'n4-time', desc: '<time> elements', check: hasMultiple('time', 3) },
  { id: 'n4-dark', desc: 'dark UI', check: (h) => /background[^;]*:\s*(#0|#1|black)/i.test(h) },
]);
const matcha1 = mk('matcha-1', 'jun', 'cedar-heights', "Hush Matcha — Quiet Menu",
  "Minimalist menu: monospace, single column, generous line-height, black & cream.", [
  { id: 'mc1-mono', desc: 'monospace', check: (h) => /font-family[^;]*mono/i.test(h) },
  { id: 'mc1-line', desc: 'line-height ≥1.7', check: (h) => /line-height:\s*(1\.[7-9]|[2-9])/i.test(h) },
  { id: 'mc1-max', desc: 'max-width', check: (h) => /max-width:/i.test(h) },
  { id: 'mc1-bg', desc: 'cream bg', check: (h) => /background[^;]*#f/i.test(h) },
]);
const climb1 = mk('climb-1', 'sasha', 'cedar-heights', "Cedar Climb — Class Schedule",
  "Bouldering schedule: weekly grid, color-coded class blocks, legend.", [
  { id: 'cb1-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 'cb1-blocks', desc: '8+ blocks', check: (h) => (h.match(/<div\b/gi) || []).length >= 8 },
  { id: 'cb1-legend', desc: 'legend/key', check: (h) => hasContent('beginner')(h) || hasContent('advanced')(h) },
]);
const tower1 = mk('tower-1', 'iris', 'cedar-heights', "Cedar Tower — Tenant Directory",
  "Multi-floor directory: 6 floor sections with tenant lists.", [
  { id: 'tw1-sections', desc: '6 <section>', check: hasMultiple('section', 6) },
  { id: 'tw1-h2', desc: '6 <h2>', check: hasMultiple('h2', 6) },
  { id: 'tw1-list', desc: 'lists per floor', check: hasMultiple('ul', 6) },
]);
const transit1 = mk('transit-1', 'mo', 'cedar-heights', "Cedar Transit — Live Departures",
  "Departures: dark, monospace, blinking dot, route table.", [
  { id: 'tr1-table', desc: '<table>', check: hasTag('table') },
  { id: 'tr1-mono', desc: 'monospace', check: (h) => /font-family[^;]*mono/i.test(h) },
  { id: 'tr1-anim', desc: '@keyframes', check: (h) => /@keyframes/i.test(h) },
  { id: 'tr1-dark', desc: 'dark bg', check: (h) => /background[^;]*:\s*(#0|#1|black)/i.test(h) },
]);

// ============================
// ACT III — University additions (Robotics, Events)
// ============================
const robotics1 = mk('robotics-1', 'robotics', 'cedar-heights', "Robotics Club — Team Page",
  "Team roster grid, project log, next-meet countdown using JS.", [
  { id: 'rb1-roster', desc: '6+ team cards', check: (h) => (h.match(/<article\b|<div\b/gi) || []).length >= 6 },
  { id: 'rb1-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 'rb1-js', desc: 'has <script>', check: hasTag('script') },
  { id: 'rb1-countdown', desc: 'countdown text', check: (h) => /countdown|days|hours/i.test(h) },
]);
const events1 = mk('events-1', 'events', 'cedar-heights', "Campus Event Portal — Listings",
  "Event listings: filter by category, register button per event, semantic markup.", [
  { id: 'ev1-articles', desc: '5+ <article>', check: hasMultiple('article', 5) },
  { id: 'ev1-time', desc: '<time>', check: hasTag('time') },
  { id: 'ev1-form', desc: 'filter <form>', check: hasTag('form') },
  { id: 'ev1-buttons', desc: '5+ buttons', check: hasMultiple('button', 5) },
]);
const events2 = mk('events-2', 'events', 'cedar-heights', "Event Portal — Registration Form (Validated)",
  "Boss-level validation: name, email, ticket type, agree-to-terms — must validate.", [
  { id: 'ev2-required', desc: 'required attrs', check: (h) => /required/i.test(h) },
  { id: 'ev2-email', desc: 'type=email', check: (h) => /type\s*=\s*"email"/i.test(h) },
  { id: 'ev2-pattern', desc: 'pattern or minlength', check: (h) => /pattern\s*=|minlength\s*=/i.test(h) },
  { id: 'ev2-checkbox', desc: 'agree checkbox', check: (h) => /type\s*=\s*"checkbox"/i.test(h) },
  { id: 'ev2-script', desc: 'JS validation', check: (h) => /addEventListener|onsubmit/i.test(h) },
]);

// ============================
// ACT IV — CLIFFSIDE RESEARCH FACILITY (Aria, Launch, DataViz)
// ============================
const aria1 = mk('aria-1', 'aria', 'axiom-institute', "Observatory — Tonight's Sky",
  "Tonight's celestial events panel with precise times and an updating clock.", [
  { id: 'ar1-clock', desc: 'JS clock', check: (h) => /setInterval|requestAnimationFrame|new Date\(\)/i.test(h) },
  { id: 'ar1-table', desc: 'events <table>', check: hasTag('table') },
  { id: 'ar1-time', desc: '<time> elements', check: hasMultiple('time', 3) },
  { id: 'ar1-script', desc: '<script>', check: hasTag('script') },
]);
const aria2 = mk('aria-2', 'aria', 'axiom-institute', "Observatory — Star Catalog",
  "Searchable star catalog: filter as you type, count visible.", [
  { id: 'ar2-input', desc: 'search input', check: (h) => /type\s*=\s*"(search|text)"/i.test(h) },
  { id: 'ar2-list', desc: '15+ items', check: (h) => (h.match(/<li\b/gi) || []).length >= 15 },
  { id: 'ar2-listener', desc: 'input listener', check: (h) => /addEventListener\(\s*['"]input/i.test(h) },
]);
const launch1 = mk('launch-1', 'launch', 'axiom-institute', "Launch Countdown — T-Minus Display",
  "Mission countdown: H/M/S clock counting down to a target date. Big mono digits.", [
  { id: 'lc1-script', desc: '<script>', check: hasTag('script') },
  { id: 'lc1-timer', desc: 'setInterval', check: (h) => /setInterval/i.test(h) },
  { id: 'lc1-getelem', desc: 'getElementById', check: (h) => /getElementById|querySelector/i.test(h) },
  { id: 'lc1-mono', desc: 'monospace digits', check: (h) => /font-family[^;]*mono/i.test(h) },
]);
const launch2 = mk('launch-2', 'launch', 'axiom-institute', "Mission Control — Telemetry Board",
  "Live telemetry: 4 gauges updating each second with random walk values.", [
  { id: 'lc2-gauges', desc: '4 gauges', check: (h) => (h.match(/data-gauge|class="gauge/gi) || []).length >= 4 || hasMultiple('progress', 4)(h) },
  { id: 'lc2-interval', desc: 'setInterval', check: (h) => /setInterval/i.test(h) },
  { id: 'lc2-update', desc: 'innerText/textContent', check: (h) => /innerText|textContent/i.test(h) },
]);
const dataviz1 = mk('dataviz-1', 'dataviz', 'axiom-institute', "DataViz — Bar Chart from JSON",
  "Render a bar chart from an array of objects. Accessible labels, sorted bars.", [
  { id: 'dv1-script', desc: '<script>', check: hasTag('script') },
  { id: 'dv1-array', desc: 'data array', check: (h) => /\[\s*\{[^}]*\}/.test(h) },
  { id: 'dv1-loop', desc: 'forEach/map', check: (h) => /forEach|\.map\(/i.test(h) },
  { id: 'dv1-svg', desc: '<svg> or <div> bars', check: (h) => hasTag('svg')(h) || /class="bar/i.test(h) },
]);
const dataviz2 = mk('dataviz-2', 'dataviz', 'axiom-institute', "DataViz — Sortable Results Table",
  "Click a header to sort the column. Aria-sort attributes required.", [
  { id: 'dv2-table', desc: '<table>', check: hasTag('table') },
  { id: 'dv2-aria', desc: 'aria-sort', check: (h) => /aria-sort/i.test(h) },
  { id: 'dv2-click', desc: 'click handler', check: (h) => /addEventListener\(\s*['"]click/i.test(h) },
  { id: 'dv2-rows', desc: '6+ rows', check: hasMultiple('tr', 6) },
]);

// ============================
// FINAL ACT — SEABROOK TOWN PORTAL
// ============================
const civic1 = mk('civic-1', 'civic', 'meridian-district', "Seabrook Town Portal — Landing",
  "Official portal: hero, services grid, news feed, accessibility statement.", [
  { id: 'cv1-header', desc: '<header>', check: hasTag('header') },
  { id: 'cv1-nav', desc: '<nav>', check: hasTag('nav') },
  { id: 'cv1-services', desc: '6+ services', check: (h) => (h.match(/<article\b|<li\b/gi) || []).length >= 6 },
  { id: 'cv1-footer', desc: '<footer>', check: hasTag('footer') },
  { id: 'cv1-skip', desc: 'skip link', check: (h) => /href\s*=\s*"#main"|skip/i.test(h) },
]);
const civic2 = mk('civic-2', 'civic', 'meridian-district', "Town Portal — Services Lookup",
  "Service search: filter list as you type, no-results message.", [
  { id: 'cv2-input', desc: 'search input', check: (h) => /type\s*=\s*"(search|text)"/i.test(h) },
  { id: 'cv2-listener', desc: 'input listener', check: (h) => /addEventListener\(\s*['"]input/i.test(h) },
  { id: 'cv2-aria', desc: 'aria-live', check: (h) => /aria-live/i.test(h) },
  { id: 'cv2-items', desc: '10+ services', check: (h) => (h.match(/<li\b/gi) || []).length >= 10 },
]);
const civic3 = mk('civic-3', 'civic', 'meridian-district', "Town Portal — Council Meeting Form",
  "Public-comment registration: name, address, topic select, comment area, validates.", [
  { id: 'cv3-form', desc: '<form>', check: hasTag('form') },
  { id: 'cv3-required', desc: 'required fields', check: (h) => /required/i.test(h) },
  { id: 'cv3-fieldset', desc: '<fieldset>+<legend>', check: (h) => hasTag('fieldset')(h) && hasTag('legend')(h) },
  { id: 'cv3-script', desc: 'submit listener', check: (h) => /addEventListener\(\s*['"]submit/i.test(h) },
]);
const civic4 = mk('civic-4', 'civic', 'meridian-district', "Town Portal — Final Build (Capstone)",
  "Capstone: combine sections, dark mode toggle, responsive @media, polished type.", [
  { id: 'cv4-toggle', desc: 'theme toggle JS', check: (h) => /classList\.toggle/i.test(h) },
  { id: 'cv4-media', desc: '@media query', check: (h) => /@media/i.test(h) },
  { id: 'cv4-vars', desc: 'CSS vars', check: (h) => /--[a-z][\w-]*\s*:/i.test(h) },
  { id: 'cv4-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 'cv4-sections', desc: '4+ <section>', check: hasMultiple('section', 4) },
]);

// ============================================================================
// ACT III — CEDAR HEIGHTS (per doc): 30 levels across 3 subdistricts
// North Lawn (1-10) → Innovation Hall (11-20) → Student Hub (21-30)
// ============================================================================
const hasJS = (re: RegExp) => (h: string) => re.test(h);

// --- North Lawn — Phase A: Responsive Reinforcement (1-4)
const nl1 = mk('nl-1', 'studentu', 'cedar-heights', "Broken on Mobile",
  "Page breaks on phone. Fix with a media query so it stacks under 600px.", [
  { id: 'nl1-media', desc: '@media (max-width: 600px)', check: hasJS(/@media[^{]*max-width:\s*600/i) },
  { id: 'nl1-flex', desc: 'flex-direction column on small', check: hasJS(/flex-direction:\s*column/i) },
  { id: 'nl1-viewport', desc: 'viewport meta', check: (h) => /name\s*=\s*"viewport"/i.test(h) },
]);
const nl2 = mk('nl-2', 'eliza', 'cedar-heights', "Library Card Stack",
  "Book cards overflow on narrow screens. Use flex-wrap so they wrap cleanly.", [
  { id: 'nl2-wrap', desc: 'flex-wrap: wrap', check: hasJS(/flex-wrap:\s*wrap/i) },
  { id: 'nl2-cards', desc: '6+ cards', check: (h) => (h.match(/<article\b|<div\b/gi) || []).length >= 6 },
  { id: 'nl2-gap', desc: 'gap', check: hasJS(/gap:\s*\d/i) },
]);
const nl3 = mk('nl-3', 'primary', 'cedar-heights', "School Announcement Layout",
  "Three-column announcements need to stack under 600px.", [
  { id: 'nl3-cols', desc: 'multi-col layout', check: (h) => /grid-template-columns|column-count/i.test(h) },
  { id: 'nl3-media', desc: '@media (max-width: 600px)', check: hasJS(/@media[^{]*600/i) },
  { id: 'nl3-articles', desc: '3 announcements', check: hasMultiple('article', 3) },
]);
const nl4 = mk('nl-4', 'primary', 'cedar-heights', "Responsive Navigation",
  "Stacked nav under 600px. No JS yet — pure CSS.", [
  { id: 'nl4-nav', desc: '<nav>', check: hasTag('nav') },
  { id: 'nl4-links', desc: '4+ links', check: hasMultiple('a', 4) },
  { id: 'nl4-media', desc: 'media query', check: hasJS(/@media/i) },
  { id: 'nl4-stack', desc: 'flex-direction column', check: hasJS(/flex-direction:\s*column/i) },
]);

// --- North Lawn — Phase B: First Interactions (5-7)
const nl5 = mk('nl-5', 'primary', 'cedar-heights', "First Script File",
  "Link external script.js. Click button → change its text.", [
  { id: 'nl5-script', desc: '<script>', check: hasTag('script') },
  { id: 'nl5-listener', desc: 'addEventListener', check: hasJS(/addEventListener/i) },
  { id: 'nl5-query', desc: 'querySelector', check: hasJS(/querySelector|getElementById/i) },
  { id: 'nl5-text', desc: 'textContent change', check: hasJS(/textContent|innerText/i) },
]);
const nl6 = mk('nl-6', 'jonah', 'cedar-heights', "Toggle the Answer",
  "Click button → reveal hidden paragraph using classList.toggle.", [
  { id: 'nl6-toggle', desc: 'classList.toggle', check: hasJS(/classList\.toggle/i) },
  { id: 'nl6-hidden', desc: '.hidden CSS', check: hasJS(/\.hidden\s*\{|display:\s*none/i) },
  { id: 'nl6-click', desc: "addEventListener('click'", check: hasJS(/addEventListener\(\s*['"]click/i) },
]);
const nl7 = mk('nl-7', 'mathdept', 'cedar-heights', "Simple Counter",
  "Increment a score. Add a reset button.", [
  { id: 'nl7-let', desc: 'let variable', check: hasJS(/\blet\b\s+\w/i) },
  { id: 'nl7-inc', desc: '++ or +=', check: hasJS(/\+\+|\+=\s*1/) },
  { id: 'nl7-buttons', desc: '2+ buttons', check: hasMultiple('button', 2) },
  { id: 'nl7-reset', desc: 'reset logic', check: hasJS(/=\s*0/) },
]);

// --- North Lawn — Phase C: Structured Mini-Games (8-10)
const nl8 = mk('nl-8', 'langdept', 'cedar-heights', "Vocabulary Quiz",
  "Multiple buttons. Track correct answers. Show score.", [
  { id: 'nl8-buttons', desc: '4+ buttons', check: hasMultiple('button', 4) },
  { id: 'nl8-listeners', desc: 'addEventListener', check: hasJS(/addEventListener/i) },
  { id: 'nl8-cond', desc: 'if conditional', check: hasJS(/\bif\s*\(/) },
  { id: 'nl8-score', desc: 'score variable', check: hasJS(/score|correct/i) },
]);
const nl9 = mk('nl-9', 'primary', 'cedar-heights', "Click the Stars",
  "Click stars to score. After 10 → show message.", [
  { id: 'nl9-stars', desc: '5+ star elements', check: (h) => (h.match(/⭐|★|class="star/gi) || []).length >= 5 },
  { id: 'nl9-thresh', desc: '>= 10 threshold', check: hasJS(/>=?\s*10/) },
  { id: 'nl9-update', desc: 'textContent update', check: hasJS(/textContent|innerText/i) },
]);
const nl10 = mk('nl-10', 'jonah', 'cedar-heights', "Interactive Timeline",
  "Click year → reveal event. Only one open at a time.", [
  { id: 'nl10-items', desc: '4+ timeline items', check: (h) => (h.match(/data-year|class="event/gi) || []).length >= 4 },
  { id: 'nl10-foreach', desc: 'iterate to close others', check: hasJS(/forEach|for\s*\(/i) },
  { id: 'nl10-active', desc: 'active class toggle', check: hasJS(/classList\.(add|remove|toggle)/i) },
]);

// --- Innovation Hall — Phase D: Interaction Refinement (11-14)
const ih11 = mk('ih-11', 'robotics', 'cedar-heights', "The Double Listener Bug",
  "Button increments twice. Find and remove the duplicate addEventListener.", [
  { id: 'ih11-once', desc: 'single listener', check: (h) => (h.match(/addEventListener/g) || []).length <= 2 },
  { id: 'ih11-button', desc: '<button>', check: hasTag('button') },
  { id: 'ih11-counter', desc: 'counter logic', check: hasJS(/\+\+|\+=\s*1/) },
]);
const ih12 = mk('ih-12', 'brooks', 'cedar-heights', "Selector Mistake",
  "JS targets the wrong element. Use querySelector vs querySelectorAll correctly.", [
  { id: 'ih12-qsa', desc: 'querySelectorAll', check: hasJS(/querySelectorAll/i) },
  { id: 'ih12-foreach', desc: 'forEach over nodelist', check: hasJS(/forEach/i) },
  { id: 'ih12-class', desc: 'class selector', check: hasJS(/['"]\.\w+/) },
]);
const ih13 = mk('ih-13', 'hackcom', 'cedar-heights', "Script Order Error",
  "JS runs before DOM exists. Fix with defer or correct placement.", [
  { id: 'ih13-defer', desc: 'defer or DOMContentLoaded', check: hasJS(/defer\b|DOMContentLoaded/i) },
  { id: 'ih13-script', desc: '<script>', check: hasTag('script') },
]);
const ih14 = mk('ih-14', 'debate', 'cedar-heights', "Toggle Logic Conflict",
  "Accordion doesn't close others. Iterate and close all before opening clicked.", [
  { id: 'ih14-items', desc: '3+ accordion items', check: (h) => (h.match(/class="accordion|data-acc/gi) || []).length >= 3 },
  { id: 'ih14-close', desc: 'remove active in loop', check: hasJS(/forEach|for\s*\(/i) },
  { id: 'ih14-toggle', desc: 'classList', check: hasJS(/classList/i) },
]);

// --- Innovation Hall — Phase E: Structured Systems (15-17)
const ih15 = mk('ih-15', 'grants', 'cedar-heights', "Form Feedback",
  "Simple form. Check if field empty. Show message. preventDefault on submit.", [
  { id: 'ih15-form', desc: '<form>', check: hasTag('form') },
  { id: 'ih15-prevent', desc: 'preventDefault', check: hasJS(/preventDefault/i) },
  { id: 'ih15-submit', desc: "submit listener", check: hasJS(/addEventListener\(\s*['"]submit/i) },
  { id: 'ih15-message', desc: 'message element', check: (h) => /class="(message|error|feedback)/i.test(h) },
]);
const ih16 = mk('ih-16', 'studentu', 'cedar-heights', "Responsive + JS Conflict",
  "Dropdown works on desktop, breaks on mobile. Coordinate CSS + JS.", [
  { id: 'ih16-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'ih16-toggle', desc: 'classList.toggle', check: hasJS(/classList\.toggle/i) },
  { id: 'ih16-nav', desc: '<nav>', check: hasTag('nav') },
  { id: 'ih16-burger', desc: 'menu button', check: (h) => /class="(burger|menu-toggle|hamburger)/i.test(h) || hasTag('button')(h) },
]);
const ih17 = mk('ih-17', 'aria', 'cedar-heights', "Multi-Component Page",
  "Responsive layout + toggle sections + modal. Clean separation.", [
  { id: 'ih17-script', desc: 'external <script>', check: (h) => /<script[^>]*src=/i.test(h) || hasTag('script')(h) },
  { id: 'ih17-modal', desc: 'modal element', check: (h) => /class="modal|role="dialog/i.test(h) },
  { id: 'ih17-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'ih17-sections', desc: '3+ <section>', check: hasMultiple('section', 3) },
]);

// --- Innovation Hall — Phase F: System Discipline (18-20)
const ih18 = mk('ih-18', 'aria', 'cedar-heights', "Refactor Messy Script",
  "Working but chaotic JS. Remove redundancy, improve readability.", [
  { id: 'ih18-fn', desc: 'named function', check: hasJS(/function\s+\w+|const\s+\w+\s*=\s*\(/) },
  { id: 'ih18-noinline', desc: 'no inline onclick', check: (h) => !/onclick\s*=/i.test(h) },
  { id: 'ih18-script', desc: '<script>', check: hasTag('script') },
]);
const ih19 = mk('ih-19', 'gamedev', 'cedar-heights', "State Reset Bug",
  "Mini-game doesn't reset correctly. Clear all variable state.", [
  { id: 'ih19-reset', desc: 'reset function', check: hasJS(/function\s+reset|reset\s*=\s*\(|=\s*0/) },
  { id: 'ih19-state', desc: 'state object', check: hasJS(/const\s+state\s*=\s*\{|let\s+state/) },
  { id: 'ih19-button', desc: 'reset button', check: (h) => /reset/i.test(h) && hasTag('button')(h) },
]);
const ih20 = mk('ih-20', 'brooks', 'cedar-heights', "Innovation Review",
  "Full-page review: responsive, JS behavior, clean separation, no inline JS.", [
  { id: 'ih20-noinline', desc: 'no inline JS handlers', check: (h) => !/onclick\s*=|onload\s*=/i.test(h) },
  { id: 'ih20-script', desc: '<script>', check: hasTag('script') },
  { id: 'ih20-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'ih20-semantic', desc: '<header> + <main> + <footer>', check: (h) => hasTag('header')(h) && hasTag('main')(h) && hasTag('footer')(h) },
]);

// --- Student Hub — Phase G: Integrated Interaction (21-23)
const sh21 = mk('sh-21', 'cafemgr', 'cedar-heights', "Interactive Menu Preview",
  "User selects items. Total updates dynamically.", [
  { id: 'sh21-items', desc: '5+ items', check: (h) => (h.match(/data-price|class="item/gi) || []).length >= 5 },
  { id: 'sh21-total', desc: 'total element', check: (h) => /id="total"|class="total/i.test(h) },
  { id: 'sh21-listener', desc: 'click/change listener', check: hasJS(/addEventListener/i) },
  { id: 'sh21-num', desc: 'numeric calc', check: hasJS(/\+=|reduce|parseFloat|parseInt/i) },
]);
const sh22 = mk('sh-22', 'film', 'cedar-heights', "Event Filter Page",
  "Buttons filter events by category. Coordinated UI updates.", [
  { id: 'sh22-events', desc: '5+ events', check: hasMultiple('article', 5) },
  { id: 'sh22-filter', desc: 'data-category attrs', check: hasJS(/data-category|data-genre/i) },
  { id: 'sh22-toggle', desc: 'classList', check: hasJS(/classList/i) },
  { id: 'sh22-buttons', desc: '3+ filter buttons', check: hasMultiple('button', 3) },
]);
const sh23 = mk('sh-23', 'debate', 'cedar-heights', "Multi-Tab Interface",
  "Click tab → switch visible content. Only one open.", [
  { id: 'sh23-tabs', desc: '3+ tab buttons', check: hasMultiple('button', 3) },
  { id: 'sh23-panels', desc: '3+ panels', check: (h) => (h.match(/role="tabpanel"|class="(tab-)?panel/gi) || []).length >= 3 },
  { id: 'sh23-aria', desc: 'aria-selected or active class', check: hasJS(/aria-selected|active/i) },
]);

// --- Student Hub — Phase H: Structured Mini-Games (24-27)
const sh24 = mk('sh-24', 'psyclub', 'cedar-heights', "Reaction Timer",
  "Click when screen changes color. Use setTimeout. Show reaction time.", [
  { id: 'sh24-timeout', desc: 'setTimeout', check: hasJS(/setTimeout/i) },
  { id: 'sh24-date', desc: 'Date.now or performance.now', check: hasJS(/Date\.now|performance\.now/i) },
  { id: 'sh24-button', desc: 'react button', check: hasTag('button') },
]);
const sh25 = mk('sh-25', 'gamedev', 'cedar-heights', "Memory Light",
  "Click two cards. If match → stay open. Else → flip back.", [
  { id: 'sh25-cards', desc: '6+ cards', check: (h) => (h.match(/class="card|data-card/gi) || []).length >= 6 },
  { id: 'sh25-array', desc: 'selected array', check: hasJS(/\[\s*\]|\.push\(/) },
  { id: 'sh25-timeout', desc: 'setTimeout for reset', check: hasJS(/setTimeout/i) },
  { id: 'sh25-classes', desc: 'classList', check: hasJS(/classList/i) },
]);
const sh26 = mk('sh-26', 'noah', 'cedar-heights', "Quiz Tournament Page",
  "Multiple questions, score tracking, final message, reset logic.", [
  { id: 'sh26-questions', desc: '3+ questions', check: (h) => (h.match(/class="question|data-q/gi) || []).length >= 3 },
  { id: 'sh26-score', desc: 'score variable', check: hasJS(/let\s+score|score\s*=\s*0/) },
  { id: 'sh26-final', desc: 'final message logic', check: hasJS(/if\s*\(/) },
  { id: 'sh26-reset', desc: 'reset function', check: hasJS(/reset/i) },
]);
const sh27 = mk('sh-27', 'lina', 'cedar-heights', "Animation Polish",
  "Hover transitions, smooth modal open, controlled timing. Intentional motion.", [
  { id: 'sh27-trans', desc: 'transition property', check: hasJS(/transition:/i) },
  { id: 'sh27-keyframes', desc: '@keyframes', check: hasJS(/@keyframes/i) },
  { id: 'sh27-hover', desc: ':hover', check: hasCSS(':hover') },
  { id: 'sh27-cubic', desc: 'easing function', check: hasJS(/ease|cubic-bezier/i) },
]);

// --- Student Hub — Phase I: Showcase & Freedom (28-30)
const sh28 = mk('sh-28', 'lina', 'cedar-heights', "Club Showcase Page",
  "Multi-component: responsive layout, interactive sections, filter system, clean separation.", [
  { id: 'sh28-script', desc: '<script>', check: hasTag('script') },
  { id: 'sh28-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'sh28-sections', desc: '3+ <section>', check: hasMultiple('section', 3) },
  { id: 'sh28-buttons', desc: 'filter buttons', check: hasMultiple('button', 3) },
]);
const sh29 = mk('sh-29', 'aria', 'cedar-heights', "Pre-Fair Review",
  "Dr. Sen reviews state logic, responsive integrity, clean structure, no inline JS.", [
  { id: 'sh29-noinline', desc: 'no inline handlers', check: (h) => !/onclick\s*=|onsubmit\s*=/i.test(h) },
  { id: 'sh29-script', desc: 'external <script src=>', check: (h) => /<script[^>]*src=/i.test(h) || /addEventListener/i.test(h) },
  { id: 'sh29-fn', desc: 'named functions', check: hasJS(/function\s+\w+/) },
  { id: 'sh29-state', desc: 'state object', check: hasJS(/state\s*=\s*\{|const\s+state/) },
]);
const sh30 = mk('sh-30', 'noah', 'cedar-heights', "Cedar Heights Tech Fair",
  "Capstone: responsive, external CSS+JS, 2+ interactive components, state mgmt, reset, feedback.", [
  { id: 'sh30-script', desc: '<script>', check: hasTag('script') },
  { id: 'sh30-media', desc: '@media', check: hasJS(/@media/i) },
  { id: 'sh30-listeners', desc: '2+ event listeners', check: (h) => (h.match(/addEventListener/g) || []).length >= 2 },
  { id: 'sh30-reset', desc: 'reset logic', check: hasJS(/reset|=\s*0/i) },
  { id: 'sh30-state', desc: 'state object', check: hasJS(/state|const\s+\w+\s*=\s*\{/) },
]);

// ============================================================================
// ACT IV — AXIOM INSTITUTE (per doc): 28 levels across 4 phases
// Phase 1 Data (1-7) → Phase 2 State (8-14) → Phase 3 Modular (15-21) → Phase 4 Demo (22-28)
// ============================================================================
const ax1 = mk('ax-1', 'aria', 'axiom-institute', "Render From Object",
  "Render researcher object dynamically into DOM. No hardcoded markup.", [
  { id: 'ax1-script', desc: '<script>', check: hasTag('script') },
  { id: 'ax1-obj', desc: 'object literal', check: hasJS(/=\s*\{[^}]*name/i) },
  { id: 'ax1-set', desc: 'textContent or innerHTML', check: hasJS(/textContent|innerHTML/i) },
]);
const ax2 = mk('ax-2', 'moreau', 'axiom-institute', "Render List From Array",
  "Array of objects → generate profile cards dynamically.", [
  { id: 'ax2-array', desc: 'array of objects', check: hasJS(/\[\s*\{[^}]*\}/) },
  { id: 'ax2-loop', desc: 'forEach/map', check: hasJS(/forEach|\.map\(/i) },
  { id: 'ax2-create', desc: 'createElement or template literal', check: hasJS(/createElement|`<|innerHTML\s*\+?=/i) },
]);
const ax3 = mk('ax-3', 'matteo', 'axiom-institute', "Remove Hardcoded Markup",
  "Replace static HTML with generated rendering. Data-driven UI.", [
  { id: 'ax3-script', desc: '<script>', check: hasTag('script') },
  { id: 'ax3-loop', desc: 'forEach/map', check: hasJS(/forEach|\.map\(/i) },
  { id: 'ax3-container', desc: 'render target id', check: (h) => /id="(list|results|cards|container)"/i.test(h) },
]);
const ax4 = mk('ax-4', 'yuna', 'axiom-institute', "Dynamic Grid Layout",
  "Generate visualization cards in a responsive grid.", [
  { id: 'ax4-grid', desc: 'CSS grid', check: hasCSS('grid-template-columns') },
  { id: 'ax4-loop', desc: 'data loop', check: hasJS(/forEach|\.map\(/i) },
  { id: 'ax4-min', desc: 'minmax/auto-fit', check: hasJS(/minmax|auto-fit|auto-fill/i) },
]);
const ax5 = mk('ax-5', 'khan', 'axiom-institute', "Filter Dataset",
  "Filter models by category. Re-render on change.", [
  { id: 'ax5-filter', desc: '.filter(', check: hasJS(/\.filter\(/i) },
  { id: 'ax5-listener', desc: 'change/click listener', check: hasJS(/addEventListener/i) },
  { id: 'ax5-render', desc: 'render function', check: hasJS(/function\s+\w*[Rr]ender|const\s+render/) },
]);
const ax6 = mk('ax-6', 'moreau', 'axiom-institute', "Sort Simulation Models",
  "Sort by stability score. Click header to sort.", [
  { id: 'ax6-sort', desc: '.sort(', check: hasJS(/\.sort\(/i) },
  { id: 'ax6-compare', desc: 'compare function', check: hasJS(/=>\s*\w+\.\w+\s*-|return\s+\w+\.\w+\s*-/) },
  { id: 'ax6-listener', desc: 'click handler', check: hasJS(/addEventListener\(\s*['"]click/i) },
]);
const ax7 = mk('ax-7', 'aria', 'axiom-institute', "Data Rendering Audit",
  "Ensure no hardcoded duplication. Clean separation.", [
  { id: 'ax7-data', desc: 'data array', check: hasJS(/const\s+\w+\s*=\s*\[/) },
  { id: 'ax7-render', desc: 'render fn', check: hasJS(/function\s+\w*[Rr]ender|render\s*=\s*\(/) },
  { id: 'ax7-no-static', desc: 'minimal static markup', check: (h) => (h.match(/<article\b|<li\b/gi) || []).length < 4 },
]);

const ax8 = mk('ax-8', 'khan', 'axiom-institute', "Single Variable Model",
  "Resource counter. UI reflects state.", [
  { id: 'ax8-state', desc: 'state object', check: hasJS(/const\s+state|let\s+state/i) },
  { id: 'ax8-update', desc: 'render reflects state', check: hasJS(/state\.\w+/) },
  { id: 'ax8-button', desc: 'control buttons', check: hasMultiple('button', 2) },
]);
const ax9 = mk('ax-9', 'hoffman', 'axiom-institute', "Multi-Variable Interaction",
  "Two variables influence UI state.", [
  { id: 'ax9-state', desc: '2+ state props', check: hasJS(/\{[^}]*,[^}]*\}/) },
  { id: 'ax9-cond', desc: 'cross-variable conditional', check: hasJS(/&&|\|\||\?/) },
  { id: 'ax9-render', desc: 'render fn', check: hasJS(/function\s+\w*[Rr]ender/) },
]);
const ax10 = mk('ax-10', 'hoffman', 'axiom-institute', "Threshold Trigger",
  "If stability < 40 → show warning.", [
  { id: 'ax10-cond', desc: '<= or < threshold', check: hasJS(/<\s*40|<=\s*40/) },
  { id: 'ax10-warn', desc: 'warning element', check: (h) => /class="(warn|alert|warning)/i.test(h) },
  { id: 'ax10-toggle', desc: 'classList', check: hasJS(/classList/i) },
]);
const ax11 = mk('ax-11', 'khan', 'axiom-institute', "Controlled Progression",
  "Step simulation forward. Button-driven update.", [
  { id: 'ax11-step', desc: 'step function', check: hasJS(/function\s+step|step\s*=\s*\(/i) },
  { id: 'ax11-button', desc: 'step button', check: (h) => /step|next|advance/i.test(h) && hasTag('button')(h) },
  { id: 'ax11-state', desc: 'state object', check: hasJS(/state/i) },
]);
const ax12 = mk('ax-12', 'aria', 'axiom-institute', "Pause & Resume",
  "Simple state machine. mode: 'running' | 'paused'.", [
  { id: 'ax12-mode', desc: 'mode property', check: hasJS(/mode:\s*['"]/) },
  { id: 'ax12-toggle', desc: 'toggle running/paused', check: hasJS(/running|paused/i) },
  { id: 'ax12-interval', desc: 'setInterval', check: hasJS(/setInterval|clearInterval/i) },
]);
const ax13 = mk('ax-13', 'matteo', 'axiom-institute', "Reset System",
  "Reset full state object back to initial.", [
  { id: 'ax13-initial', desc: 'initialState constant', check: hasJS(/initial[Ss]tate|INITIAL/) },
  { id: 'ax13-reset', desc: 'reset function', check: hasJS(/function\s+reset|reset\s*=/i) },
  { id: 'ax13-button', desc: 'reset button', check: (h) => /reset/i.test(h) && hasTag('button')(h) },
]);
const ax14 = mk('ax-14', 'helena', 'axiom-institute', "Stability Debug",
  "Broken state logic. Fix inconsistent updates.", [
  { id: 'ax14-state', desc: 'state object', check: hasJS(/state/i) },
  { id: 'ax14-render', desc: 'single render call', check: hasJS(/render\s*\(/) },
  { id: 'ax14-cond', desc: 'guarded updates', check: hasJS(/if\s*\(/) },
]);

const ax15 = mk('ax-15', 'moreau', 'axiom-institute', "Component Factory",
  "Function generates dashboard cards.", [
  { id: 'ax15-fn', desc: 'createCard function', check: hasJS(/function\s+create\w+|const\s+create\w+\s*=/) },
  { id: 'ax15-return', desc: 'returns element', check: hasJS(/return\s+\w+/) },
  { id: 'ax15-create', desc: 'createElement', check: hasJS(/createElement/i) },
]);
const ax16 = mk('ax-16', 'aria', 'axiom-institute', "Shared State Across Components",
  "Two UI sections reflect same data.", [
  { id: 'ax16-state', desc: 'shared state', check: hasJS(/const\s+state|let\s+state/) },
  { id: 'ax16-renders', desc: '2 render targets', check: (h) => (h.match(/getElementById|querySelector\(/g) || []).length >= 2 },
  { id: 'ax16-fn', desc: 'render function', check: hasJS(/function\s+render|render\s*=\s*\(/i) },
]);
const ax17 = mk('ax-17', 'hoffman', 'axiom-institute', "Sync Interaction",
  "Clicking one component updates another.", [
  { id: 'ax17-listener', desc: 'event listener', check: hasJS(/addEventListener/i) },
  { id: 'ax17-update', desc: 'cross-update', check: hasJS(/textContent|innerHTML/i) },
  { id: 'ax17-state', desc: 'shared state', check: hasJS(/state/i) },
]);
const ax18 = mk('ax-18', 'maya2', 'axiom-institute', "Accessible Controls",
  "Keyboard toggles simulation states. ARIA roles.", [
  { id: 'ax18-key', desc: 'keydown listener', check: hasJS(/keydown|keyup/i) },
  { id: 'ax18-aria', desc: 'aria attributes', check: hasJS(/aria-/i) },
  { id: 'ax18-tabindex', desc: 'tabindex or button', check: (h) => /tabindex/i.test(h) || hasTag('button')(h) },
]);
const ax19 = mk('ax-19', 'helena', 'axiom-institute', "Error Handling",
  "Prevent invalid state transitions.", [
  { id: 'ax19-try', desc: 'try/catch or guard', check: hasJS(/try\s*\{|throw|return\s*$/m) },
  { id: 'ax19-cond', desc: 'guard conditions', check: hasJS(/if\s*\(/) },
  { id: 'ax19-error', desc: 'error UI element', check: (h) => /class="error|role="alert/i.test(h) },
]);
const ax20 = mk('ax-20', 'moreau', 'axiom-institute', "Reduce Redundant Re-render",
  "Optimize update logic. Don't re-render everything.", [
  { id: 'ax20-fn', desc: 'targeted update fn', check: hasJS(/function\s+update/i) },
  { id: 'ax20-cache', desc: 'cached element ref', check: hasJS(/const\s+\w+\s*=\s*document\./) },
]);
const ax21 = mk('ax-21', 'yuna', 'axiom-institute', "Data Visualization Bars",
  "Render dynamic bar graph (DOM div-based, no canvas).", [
  { id: 'ax21-bars', desc: 'bar elements', check: (h) => (h.match(/class="bar/gi) || []).length >= 4 || hasMultiple('progress', 4)(h) },
  { id: 'ax21-data', desc: 'data array', check: hasJS(/\[\s*\d|\[\s*\{/) },
  { id: 'ax21-style', desc: 'dynamic width/height', check: hasJS(/style\.(width|height)|setProperty/i) },
]);

const ax22 = mk('ax-22', 'liaison', 'axiom-institute', "Public Policy Model Preview",
  "Interactive policy model dashboard for public viewing.", [
  { id: 'ax22-controls', desc: '3+ controls', check: hasMultiple('input', 3) },
  { id: 'ax22-render', desc: 'render fn', check: hasJS(/render|update/i) },
  { id: 'ax22-display', desc: 'output elements', check: (h) => /class="output|id="result/i.test(h) },
]);
const ax23 = mk('ax-23', 'reviewbd', 'axiom-institute', "Reporting Interface",
  "Structured report generator with summary stats.", [
  { id: 'ax23-table', desc: '<table>', check: hasTag('table') },
  { id: 'ax23-totals', desc: 'totals row', check: (h) => /total|sum|average/i.test(h) },
  { id: 'ax23-script', desc: '<script>', check: hasTag('script') },
]);
const ax24 = mk('ax-24', 'maya2', 'axiom-institute', "Accessibility Audit",
  "Keyboard access and proper ARIA roles required.", [
  { id: 'ax24-aria', desc: 'aria attributes', check: hasJS(/aria-(label|live|expanded|sort|selected)/i) },
  { id: 'ax24-role', desc: 'role attributes', check: hasJS(/role="/i) },
  { id: 'ax24-key', desc: 'keyboard handler', check: hasJS(/keydown|keyup/i) },
  { id: 'ax24-focus', desc: 'focus management', check: hasJS(/\.focus\(\)|tabindex/i) },
]);
const ax25 = mk('ax-25', 'helena', 'axiom-institute', "UX Stability Review",
  "Handle empty state, error state, loading state.", [
  { id: 'ax25-empty', desc: 'empty state UI', check: (h) => /no results|empty|nothing/i.test(h) },
  { id: 'ax25-loading', desc: 'loading state', check: (h) => /loading|spinner|class="load/i.test(h) },
  { id: 'ax25-error', desc: 'error state', check: (h) => /class="error|role="alert/i.test(h) },
]);
const ax26 = mk('ax-26', 'aria', 'axiom-institute', "Refactor for Deployment",
  "Full system cleanup. Modular, accessible, error-tolerant.", [
  { id: 'ax26-fns', desc: '3+ functions', check: (h) => (h.match(/function\s+\w+/g) || []).length >= 3 },
  { id: 'ax26-noinline', desc: 'no inline handlers', check: (h) => !/onclick\s*=/i.test(h) },
  { id: 'ax26-state', desc: 'state object', check: hasJS(/state/i) },
]);
const ax27 = mk('ax-27', 'liaison', 'axiom-institute', "Pre-Release Simulation Test",
  "Multi-system integration with telemetry and stability checks.", [
  { id: 'ax27-interval', desc: 'setInterval', check: hasJS(/setInterval/i) },
  { id: 'ax27-state', desc: 'state object', check: hasJS(/state/i) },
  { id: 'ax27-render', desc: 'render fn', check: hasJS(/function\s+render|render\s*=/) },
  { id: 'ax27-aria', desc: 'aria roles', check: hasJS(/aria-/i) },
]);
const ax28 = mk('ax-28', 'aria', 'axiom-institute', "Axiom Demonstration Day",
  "Capstone: data-driven rendering, state object, modular fns, a11y, errors, responsive.", [
  { id: 'ax28-data', desc: 'data array', check: hasJS(/const\s+\w+\s*=\s*\[\s*\{/) },
  { id: 'ax28-state', desc: 'state object', check: hasJS(/const\s+state\s*=\s*\{|let\s+state/) },
  { id: 'ax28-fns', desc: '3+ functions', check: (h) => (h.match(/function\s+\w+/g) || []).length >= 3 },
  { id: 'ax28-aria', desc: 'aria attrs', check: hasJS(/aria-/i) },
  { id: 'ax28-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'ax28-error', desc: 'error UI', check: (h) => /class="error|role="alert/i.test(h) },
]);

// ============================================================================
// ACT V — MERIDIAN DISTRICT (per doc): 30 levels across 4 phases
// Forms (1-8) → Data Systems (9-16) → Deployment Integrity (17-23) → Public Launch (24-30)
// ============================================================================
const md1 = mk('md-1', 'varga', 'meridian-district', "Single-Field Validated Form",
  "Required field. Invalid → inline error. Valid → success message.", [
  { id: 'md1-form', desc: '<form>', check: hasTag('form') },
  { id: 'md1-required', desc: 'required attr', check: hasJS(/required/i) },
  { id: 'md1-error', desc: 'error element', check: (h) => /class="error|aria-invalid/i.test(h) },
  { id: 'md1-prevent', desc: 'preventDefault', check: hasJS(/preventDefault/i) },
]);
const md2 = mk('md-2', 'mthompson', 'meridian-district', "Multi-Field Form",
  "Name, email, phone. Each validates independently.", [
  { id: 'md2-inputs', desc: '3+ inputs', check: hasMultiple('input', 3) },
  { id: 'md2-email', desc: 'type=email', check: hasJS(/type\s*=\s*"email"/i) },
  { id: 'md2-pattern', desc: 'pattern or minlength', check: hasJS(/pattern\s*=|minlength\s*=/i) },
  { id: 'md2-labels', desc: 'all <label>', check: hasMultiple('label', 3) },
]);
const md3 = mk('md-3', 'marcus', 'meridian-district', "Conditional Logic Chain",
  "Field A determines whether Field B is required.", [
  { id: 'md3-listener', desc: 'change listener', check: hasJS(/addEventListener\(\s*['"](change|input)/i) },
  { id: 'md3-cond', desc: 'conditional logic', check: hasJS(/if\s*\(/) },
  { id: 'md3-toggle', desc: 'toggle attribute', check: hasJS(/setAttribute|removeAttribute|disabled\s*=/i) },
]);
const md4 = mk('md-4', 'lila', 'meridian-district', "Multi-Step Form (Wizard)",
  "Step 1, Step 2, Step 3. Next/Back. Progress indicator.", [
  { id: 'md4-steps', desc: '3 step panels', check: (h) => (h.match(/data-step|class="step/gi) || []).length >= 3 },
  { id: 'md4-buttons', desc: 'Next/Back buttons', check: hasMultiple('button', 2) },
  { id: 'md4-progress', desc: 'progress UI', check: (h) => hasTag('progress')(h) || /class="progress/i.test(h) },
]);
const md5 = mk('md-5', 'lila', 'meridian-district', "Save State Across Steps",
  "Persist form data across steps using a state object.", [
  { id: 'md5-state', desc: 'state object', check: hasJS(/const\s+state|let\s+state/) },
  { id: 'md5-storage', desc: 'state mutation', check: hasJS(/state\.\w+\s*=/) },
  { id: 'md5-restore', desc: 'restore on step', check: hasJS(/value\s*=\s*state|input\.value\s*=/i) },
]);
const md6 = mk('md-6', 'marcus', 'meridian-district', "Cross-Field Validation",
  "Confirm-password matches password. Date-end after date-start.", [
  { id: 'md6-listener', desc: 'submit listener', check: hasJS(/addEventListener\(\s*['"]submit/i) },
  { id: 'md6-compare', desc: 'compare values', check: hasJS(/===|!==|<\s*\w+\.value/) },
  { id: 'md6-error', desc: 'inline error', check: (h) => /class="error|aria-invalid/i.test(h) },
]);
const md7 = mk('md-7', 'mthompson', 'meridian-district', "Accessible Form Errors",
  "ARIA-live region. Focus first invalid field on submit.", [
  { id: 'md7-live', desc: 'aria-live', check: hasJS(/aria-live/i) },
  { id: 'md7-focus', desc: '.focus()', check: hasJS(/\.focus\(\)/i) },
  { id: 'md7-invalid', desc: 'aria-invalid', check: hasJS(/aria-invalid/i) },
]);
const md8 = mk('md-8', 'varga', 'meridian-district', "Form System Review",
  "Validation + state + accessibility + responsive.", [
  { id: 'md8-form', desc: '<form>', check: hasTag('form') },
  { id: 'md8-required', desc: 'required attrs', check: hasJS(/required/i) },
  { id: 'md8-aria', desc: 'aria attrs', check: hasJS(/aria-/i) },
  { id: 'md8-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'md8-script', desc: '<script>', check: hasTag('script') },
]);

const md9 = mk('md-9', 'rafael', 'meridian-district', "Searchable Service Index",
  "Type-ahead filter over 20+ services. aria-live count.", [
  { id: 'md9-input', desc: 'search input', check: hasJS(/type\s*=\s*"(search|text)"/i) },
  { id: 'md9-listener', desc: 'input listener', check: hasJS(/addEventListener\(\s*['"]input/i) },
  { id: 'md9-items', desc: '20+ items', check: (h) => (h.match(/<li\b|<article\b/gi) || []).length >= 20 },
  { id: 'md9-live', desc: 'aria-live count', check: hasJS(/aria-live/i) },
]);
const md10 = mk('md-10', 'rafael', 'meridian-district', "Filter + Sort Combo",
  "Filter by category AND sort by name/date.", [
  { id: 'md10-filter', desc: '.filter(', check: hasJS(/\.filter\(/i) },
  { id: 'md10-sort', desc: '.sort(', check: hasJS(/\.sort\(/i) },
  { id: 'md10-controls', desc: 'select+input', check: (h) => hasTag('select')(h) && hasTag('input')(h) },
]);
const md11 = mk('md-11', 'aisha', 'meridian-district', "Empty State + No Results",
  "Library search with empty-state messaging.", [
  { id: 'md11-empty', desc: 'no-results UI', check: (h) => /no results|nothing|empty/i.test(h) },
  { id: 'md11-aria', desc: 'aria-live', check: hasJS(/aria-live/i) },
  { id: 'md11-input', desc: 'search input', check: hasJS(/type\s*=\s*"(search|text)"/i) },
]);
const md12 = mk('md-12', 'jonas', 'meridian-district', "Live Status Board",
  "Transit board: status indicators update each second.", [
  { id: 'md12-interval', desc: 'setInterval', check: hasJS(/setInterval/i) },
  { id: 'md12-status', desc: 'status classes', check: (h) => /class="(status|on-time|delayed|cancelled)/i.test(h) },
  { id: 'md12-table', desc: '<table>', check: hasTag('table') },
]);
const md13 = mk('md-13', 'sofia', 'meridian-district', "Budget Summary Page",
  "Summarize spending categories with totals + percentages.", [
  { id: 'md13-data', desc: 'data array', check: hasJS(/\[\s*\{/) },
  { id: 'md13-reduce', desc: 'reduce or sum', check: hasJS(/\.reduce\(|sum/i) },
  { id: 'md13-bars', desc: 'bar elements', check: (h) => (h.match(/class="bar|<progress/gi) || []).length >= 4 },
]);
const md14 = mk('md-14', 'rafael', 'meridian-district', "Interactive Map List",
  "Click a list item → highlight a region. Keyboard accessible.", [
  { id: 'md14-listener', desc: 'click listener', check: hasJS(/addEventListener\(\s*['"]click/i) },
  { id: 'md14-key', desc: 'keydown listener', check: hasJS(/keydown/i) },
  { id: 'md14-aria', desc: 'aria-selected', check: hasJS(/aria-selected/i) },
]);
const md15 = mk('md-15', 'aisha', 'meridian-district', "Pagination",
  "20+ items, 5 per page, prev/next, current page indicator.", [
  { id: 'md15-buttons', desc: 'prev/next buttons', check: hasMultiple('button', 2) },
  { id: 'md15-state', desc: 'currentPage state', check: hasJS(/page|index|currentPage/i) },
  { id: 'md15-slice', desc: '.slice or windowing', check: hasJS(/\.slice\(/i) },
]);
const md16 = mk('md-16', 'sofia', 'meridian-district', "Data System Review",
  "Filter + sort + pagination + a11y.", [
  { id: 'md16-filter', desc: '.filter', check: hasJS(/\.filter\(/i) },
  { id: 'md16-sort', desc: '.sort', check: hasJS(/\.sort\(/i) },
  { id: 'md16-aria', desc: 'aria attrs', check: hasJS(/aria-/i) },
  { id: 'md16-script', desc: '<script>', check: hasTag('script') },
]);

const md17 = mk('md-17', 'varga', 'meridian-district', "Invalid Submission Handler",
  "Catch invalid submission gracefully with clear messaging.", [
  { id: 'md17-form', desc: '<form>', check: hasTag('form') },
  { id: 'md17-prevent', desc: 'preventDefault', check: hasJS(/preventDefault/i) },
  { id: 'md17-cond', desc: 'guard conditions', check: hasJS(/if\s*\(/) },
  { id: 'md17-message', desc: 'error feedback', check: (h) => /class="error|role="alert/i.test(h) },
]);
const md18 = mk('md-18', 'marcus', 'meridian-district', "Duplicate Request Prevention",
  "Disable submit button after click. Re-enable on response.", [
  { id: 'md18-disable', desc: 'disabled attr toggle', check: hasJS(/disabled\s*=\s*true|setAttribute\s*\(\s*['"]disabled/i) },
  { id: 'md18-button', desc: '<button>', check: hasTag('button') },
  { id: 'md18-listener', desc: 'submit listener', check: hasJS(/addEventListener\(\s*['"](submit|click)/i) },
]);
const md19 = mk('md-19', 'mthompson', 'meridian-district', "Missing State Recovery",
  "Detect missing state, show recovery option.", [
  { id: 'md19-cond', desc: 'state check', check: hasJS(/if\s*\(/) },
  { id: 'md19-button', desc: 'recovery button', check: (h) => /restart|recover|retry/i.test(h) && hasTag('button')(h) },
  { id: 'md19-message', desc: 'message UI', check: (h) => /class="message|role="alert/i.test(h) },
]);
const md20 = mk('md-20', 'helena', 'meridian-district', "Broken Navigation Handler",
  "404-style fallback panel for invalid routes.", [
  { id: 'md20-fallback', desc: '404 message', check: (h) => /not found|404/i.test(h) },
  { id: 'md20-link', desc: 'home link', check: hasTag('a') },
  { id: 'md20-aria', desc: 'aria roles', check: hasJS(/role="/i) },
]);
const md21 = mk('md-21', 'jonas', 'meridian-district', "Graceful Failure UX",
  "When live data fails, show last known + retry CTA.", [
  { id: 'md21-try', desc: 'try/catch or guard', check: hasJS(/try\s*\{|catch\s*\(/i) },
  { id: 'md21-retry', desc: 'retry button', check: (h) => /retry/i.test(h) && hasTag('button')(h) },
  { id: 'md21-cache', desc: 'cached value', check: hasJS(/last|cache/i) },
]);
const md22 = mk('md-22', 'maya2', 'meridian-district', "Public Accessibility Audit",
  "Skip link, landmark roles, contrast, visible focus.", [
  { id: 'md22-skip', desc: 'skip link', check: (h) => /href="#main"|skip/i.test(h) },
  { id: 'md22-main', desc: '<main>', check: hasTag('main') },
  { id: 'md22-focus', desc: ':focus styles', check: hasJS(/:focus/i) },
  { id: 'md22-aria', desc: 'aria attrs', check: hasJS(/aria-/i) },
]);
const md23 = mk('md-23', 'varga', 'meridian-district', "Deployment Integrity Review",
  "All failure modes handled. Clean separation. Responsive.", [
  { id: 'md23-script', desc: '<script>', check: hasTag('script') },
  { id: 'md23-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'md23-error', desc: 'error handling', check: hasJS(/try|catch|if\s*\(/i) },
  { id: 'md23-noinline', desc: 'no inline JS', check: (h) => !/onclick\s*=|onsubmit\s*=/i.test(h) },
]);

const md24 = mk('md-24', 'lila', 'meridian-district', "Eligibility Checker Tool",
  "Mini-tool: answer 5 questions → eligible/not + reasons.", [
  { id: 'md24-form', desc: '<form>', check: hasTag('form') },
  { id: 'md24-inputs', desc: '5+ inputs', check: hasMultiple('input', 5) },
  { id: 'md24-cond', desc: 'logic chain', check: hasJS(/if\s*\(.*&&|else\s+if/i) },
  { id: 'md24-result', desc: 'result element', check: (h) => /id="result|class="result/i.test(h) },
]);
const md25 = mk('md-25', 'mthompson', 'meridian-district', "Appointment Scheduler",
  "Date+time picker, conflict detection, confirmation.", [
  { id: 'md25-date', desc: 'date input', check: hasJS(/type\s*=\s*"date"/i) },
  { id: 'md25-time', desc: 'time input', check: hasJS(/type\s*=\s*"time"/i) },
  { id: 'md25-confirm', desc: 'confirmation UI', check: (h) => /confirm|booked|scheduled/i.test(h) },
]);
const md26 = mk('md-26', 'sofia', 'meridian-district', "Budget Calculator",
  "Add line items, compute totals, show category breakdown.", [
  { id: 'md26-add', desc: 'add button', check: (h) => /add/i.test(h) && hasTag('button')(h) },
  { id: 'md26-list', desc: 'line items list', check: (h) => /id="items|class="items/i.test(h) },
  { id: 'md26-total', desc: 'live total', check: (h) => /id="total|class="total/i.test(h) },
  { id: 'md26-script', desc: '<script>', check: hasTag('script') },
]);
const md27 = mk('md-27', 'jonas', 'meridian-district', "Route Planner",
  "Pick start+end stop → display route steps.", [
  { id: 'md27-selects', desc: '2 <select>', check: (h) => (h.match(/<select\b/gi) || []).length >= 2 },
  { id: 'md27-result', desc: 'steps list', check: (h) => /id="steps|class="steps|route/i.test(h) },
  { id: 'md27-script', desc: '<script>', check: hasTag('script') },
]);
const md28 = mk('md-28', 'daniel', 'meridian-district', "Business Registry — Editable Records",
  "Edit a record inline. Save / Cancel. Confirmation flow.", [
  { id: 'md28-edit', desc: 'edit button', check: (h) => /edit/i.test(h) && hasTag('button')(h) },
  { id: 'md28-save', desc: 'save+cancel buttons', check: hasMultiple('button', 2) },
  { id: 'md28-state', desc: 'state object', check: hasJS(/state|record/i) },
  { id: 'md28-confirm', desc: 'confirmation message', check: (h) => /saved|updated|confirm/i.test(h) },
]);
const md29 = mk('md-29', 'aisha', 'meridian-district', "Public Library Portal",
  "Search + categories + accessibility statement + responsive.", [
  { id: 'md29-search', desc: 'search input', check: hasJS(/type\s*=\s*"(search|text)"/i) },
  { id: 'md29-cats', desc: '4+ categories', check: hasMultiple('button', 4) },
  { id: 'md29-aria', desc: 'aria-live', check: hasJS(/aria-live/i) },
  { id: 'md29-media', desc: '@media query', check: hasJS(/@media/i) },
]);
const md30 = mk('md-30', 'varga', 'meridian-district', "Public Launch — Capstone",
  "Combined civic system: forms, data, state, accessibility, responsive, failure handling.",[
  { id: 'md30-form', desc: '<form>', check: hasTag('form') },
  { id: 'md30-script', desc: '<script>', check: hasTag('script') },
  { id: 'md30-media', desc: '@media query', check: hasJS(/@media/i) },
  { id: 'md30-aria', desc: 'aria attrs', check: hasJS(/aria-/i) },
  { id: 'md30-error', desc: 'error UI', check: (h) => /class="error|role="alert/i.test(h) },
  { id: 'md30-skip', desc: 'skip link', check: (h) => /href="#main"|skip/i.test(h) },
  { id: 'md30-state', desc: 'state object', check: hasJS(/state/i) },
]);

// ============================
// EXPORT ALL LEVELS
// ============================

export const allLevels: ProjectLevel[] = [
  // Act I
  elena1, elena2, elena3, elena4, elena5,
  iqbal1, iqbal2, iqbal3, iqbal4, iqbal5,
  theo1, theo2, theo3, theo4, theo5,
  maya1, maya2, maya3,
  // Act II
  mira1, mira2, mira3, mira4,
  lucas1, lucas2, lucas3, lucas4,
  gelato1, arcade1, hotel1, gallery1,
  // Act III legacy entries kept as filler
  dean1, dean2, dean3, dean4,
  nora1, nora2, nora3, nora4,
  matcha1, climb1, tower1, transit1,
  robotics1, events1, events2,
  // Act III — North Lawn / Innovation Hall / Student Hub (per doc)
  nl1, nl2, nl3, nl4, nl5, nl6, nl7, nl8, nl9, nl10,
  ih11, ih12, ih13, ih14, ih15, ih16, ih17, ih18, ih19, ih20,
  sh21, sh22, sh23, sh24, sh25, sh26, sh27, sh28, sh29, sh30,
  // Act IV — Axiom Institute (per doc) — keeps aria/launch/dataviz legacy
  aria1, aria2, launch1, launch2, dataviz1, dataviz2,
  ax1, ax2, ax3, ax4, ax5, ax6, ax7,
  ax8, ax9, ax10, ax11, ax12, ax13, ax14,
  ax15, ax16, ax17, ax18, ax19, ax20, ax21,
  ax22, ax23, ax24, ax25, ax26, ax27, ax28,
  // Act V — Meridian District (per doc) — keeps civic legacy entries
  civic1, civic2, civic3, civic4,
  md1, md2, md3, md4, md5, md6, md7, md8,
  md9, md10, md11, md12, md13, md14, md15, md16,
  md17, md18, md19, md20, md21, md22, md23,
  md24, md25, md26, md27, md28, md29, md30,
];

export const levelsByClient: Record<string, ProjectLevel[]> = {
  elena: [elena1, elena2, elena3, elena4, elena5],
  iqbal: [iqbal1, iqbal2, iqbal3, iqbal4, iqbal5],
  theo: [theo1, theo2, theo3, theo4, theo5],
  maya: [maya1, maya2, maya3],
  mira: [mira1, mira2, mira3, mira4],
  lucas: [lucas1, lucas2, lucas3, lucas4],
  sole: [gelato1], kira: [arcade1], evren: [hotel1], rune: [gallery1],
  dean: [dean1, dean2, dean3, dean4],
  nora: [nora1, nora2, nora3, nora4],
  jun: [matcha1], sasha: [climb1], iris: [tower1], mo: [transit1],
  robotics: [robotics1, ih11], events: [events1, events2],
  // Act III doc clients
  studentu: [nl1, ih16],
  primary: [nl3, nl4, nl5, nl9],
  eliza: [nl2],
  jonah: [nl6, nl10],
  mathdept: [nl7],
  langdept: [nl8],
  ecoclub: [], artprog: [],
  brooks: [ih12, ih20],
  hackcom: [ih13],
  debate: [ih14, sh23],
  grants: [ih15],
  gamedev: [ih19, sh25],
  cafemgr: [sh21], film: [sh22], psyclub: [sh24],
  noah: [sh26, sh30], lina: [sh27, sh28],
  // Act IV
  aria: [aria1, aria2, ih17, ih18, sh29, ax1, ax7, ax12, ax16, ax26, ax28],
  launch: [launch1, launch2],
  dataviz: [dataviz1, dataviz2],
  moreau: [ax2, ax6, ax15, ax20],
  yuna: [ax4, ax21],
  matteo: [ax3, ax13],
  hoffman: [ax9, ax10, ax17],
  khan: [ax5, ax8, ax11],
  maya2: [ax18, ax24, md22],
  helena: [ax14, ax19, ax25, md20],
  liaison: [ax22, ax27],
  reviewbd: [ax23],
  // Act V
  civic: [civic1, civic2, civic3, civic4],
  varga: [md1, md8, md17, md23, md30],
  marcus: [md3, md6, md18],
  mthompson: [md2, md7, md19, md25],
  rafael: [md9, md10, md14],
  lila: [md4, md5, md24],
  jonas: [md12, md21, md27],
  aisha: [md11, md15, md29],
  daniel: [md28],
  sofia: [md13, md16, md26],
};

export const getLevelById = (id: string): ProjectLevel | undefined =>
  allLevels.find(l => l.id === id);

// Tiered unlock — index = required # of completed projects
export const levelUnlockOrder: string[][] = [
  ['elena-1'],                                                   // 0
  ['elena-2', 'iqbal-1'],                                        // 1
  ['elena-3', 'iqbal-2', 'theo-1', 'maya-1'],                    // 2
  [],                                                            // 3
  ['elena-4', 'iqbal-3', 'theo-2', 'maya-2'],                    // 4
  ['elena-5'],                                                   // 5
  ['iqbal-5', 'maya-3'],                                         // 6
  ['iqbal-4', 'theo-3', 'theo-5'],                               // 7
  [],                                                            // 8
  ['theo-4'],                                                    // 9
  // ACT II — Seabrook
  ['mira-1', 'lucas-1'],                                         // 10
  ['mira-2', 'lucas-2', 'gelato-1'],                             // 11
  ['mira-3', 'lucas-3', 'arcade-1'],                             // 12
  ['mira-4', 'lucas-4', 'hotel-1'],                              // 13
  ['gallery-1'],                                                 // 14
  [],                                                            // 15
  // ACT III — North Lawn
  ['nl-1', 'nl-2'],                                              // 16
  ['nl-3', 'nl-4'],                                              // 17
  ['nl-5', 'nl-6'],                                              // 18
  ['nl-7'],                                                      // 19
  ['nl-8', 'nl-9'],                                              // 20
  ['nl-10'],                                                     // 21
  // Innovation Hall
  ['ih-11', 'ih-12', 'dean-1', 'nora-1', 'robotics-1'],          // 22
  ['ih-13', 'ih-14', 'dean-2', 'nora-2'],                        // 23
  ['ih-15', 'ih-16', 'matcha-1', 'climb-1'],                     // 24
  ['ih-17', 'dean-3', 'nora-3', 'events-1'],                     // 25
  ['ih-18', 'ih-19', 'tower-1', 'transit-1'],                    // 26
  ['ih-20', 'dean-4', 'nora-4', 'events-2'],                     // 27
  // Student Hub
  ['sh-21', 'sh-22'],                                            // 28
  ['sh-23', 'sh-24'],                                            // 29
  ['sh-25', 'sh-26'],                                            // 30
  ['sh-27'],                                                     // 31
  ['sh-28'],                                                     // 32
  ['sh-29'],                                                     // 33
  ['sh-30'],                                                     // 34
  // ACT IV — Axiom Institute
  ['ax-1', 'ax-2', 'aria-1'],                                    // 35
  ['ax-3', 'ax-4', 'launch-1', 'dataviz-1'],                     // 36
  ['ax-5', 'ax-6'],                                              // 37
  ['ax-7', 'ax-8'],                                              // 38
  ['ax-9', 'ax-10', 'aria-2'],                                   // 39
  ['ax-11', 'ax-12', 'launch-2', 'dataviz-2'],                   // 40
  ['ax-13', 'ax-14'],                                            // 41
  ['ax-15', 'ax-16'],                                            // 42
  ['ax-17', 'ax-18'],                                            // 43
  ['ax-19', 'ax-20'],                                            // 44
  ['ax-21', 'ax-22'],                                            // 45
  ['ax-23', 'ax-24'],                                            // 46
  ['ax-25', 'ax-26'],                                            // 47
  ['ax-27'],                                                     // 48
  ['ax-28'],                                                     // 49
  // ACT V — Meridian District
  ['md-1', 'md-2', 'civic-1'],                                   // 50
  ['md-3', 'md-4'],                                              // 51
  ['md-5', 'md-6'],                                              // 52
  ['md-7', 'md-8'],                                              // 53
  ['md-9', 'md-10', 'civic-2'],                                  // 54
  ['md-11', 'md-12'],                                            // 55
  ['md-13', 'md-14'],                                            // 56
  ['md-15', 'md-16'],                                            // 57
  ['md-17', 'md-18', 'civic-3'],                                 // 58
  ['md-19', 'md-20'],                                            // 59
  ['md-21', 'md-22'],                                            // 60
  ['md-23'],                                                     // 61
  ['md-24', 'md-25'],                                            // 62
  ['md-26', 'md-27'],                                            // 63
  ['md-28', 'md-29'],                                            // 64
  ['md-30', 'civic-4'],                                          // 65 (Capstone)
];

export const getAvailableLevels = (completedLevels: string[]): string[] => {
  const available: string[] = [];
  const completedCount = completedLevels.length;
  for (let i = 0; i < levelUnlockOrder.length; i++) {
    if (completedCount < i) continue;
    for (const levelId of levelUnlockOrder[i]) {
      if (!completedLevels.includes(levelId)) available.push(levelId);
    }
  }
  return available;
};

export const getZoneForLevel = (levelId: string): string => {
  const lvl = getLevelById(levelId);
  return lvl?.zone || 'harbor-row';
};

