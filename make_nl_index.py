#!/usr/bin/env python3
"""
Run from ~/Downloads/creative-solace:
  python3 make_nl_index.py
"""
import re

with open('src/pages/index.astro', 'r') as f:
    s = f.read()

replacements = [
    # ── HEAD ──────────────────────────────────────────────────────
    ("export const prerender = true;",
     "export const prerender = true;\n// NL homepage — Dutch version of index.astro"),

    ("toLocaleDateString('en-GB'",
     "toLocaleDateString('nl-NL'"),

    ('<html lang="en">',
     '<html lang="nl">'),

    ("<title>Creative Solace | Rhinestone Kits &amp; Creative Workshops in the Netherlands</title>",
     "<title>Creative Solace | Rhinestone Kits &amp; Creatieve Workshops in Nederland</title>"),

    ('content="Shop DIY rhinestone canvas kits and book paint and sip or bedazzle workshops across the Netherlands. Perfect for girls nights, birthdays, bachelorettes and corporate events. Free shipping in NL."',
     'content="Bestel een DIY rhinestone canvas kit of boek een paint and sip of bedazzle workshop door heel Nederland. Perfect voor meidenuitjes, verjaardagen, vrijgezellenfeesten en bedrijfsuitjes. Gratis verzending in NL."'),

    ('content="DIY rhinestone canvas kits and creative workshops including paint and sip and bedazzle events across the Netherlands. Free shipping in NL."',
     'content="DIY rhinestone canvas kits en creatieve workshops waaronder paint and sip en bedazzle events door heel Nederland. Gratis verzending in NL."'),

    ('<meta property="og:url" content="https://creativesolace.com"/>',
     '<meta property="og:url" content="https://creativesolace.com/nl"/>'),

    ('<link rel="canonical" href="https://creativesolace.com"/>',
     '<link rel="canonical" href="https://creativesolace.com/nl"/>'),

    ('<link rel="alternate" hreflang="en" href="https://creativesolace.com/"/>',
     '<link rel="alternate" hreflang="en" href="https://creativesolace.com/"/>'),

    ('<link rel="alternate" hreflang="nl" href="https://creativesolace.com/nl/"/>',
     '<link rel="alternate" hreflang="nl" href="https://creativesolace.com/nl/"/>'),

    ('"url": "https://creativesolace.com",',
     '"url": "https://creativesolace.com/nl",'),

    ('"inLanguage": ["en", "nl"]',
     '"inLanguage": "nl"'),

    # ── NAV ───────────────────────────────────────────────────────
    ('  <a href="#" class="nav-logo"><img src="https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png" alt="Creative Solace"/></a>\n  <ul class="nav-links">',
     '  <a href="/nl" class="nav-logo"><img src="https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png" alt="Creative Solace"/></a>\n  <ul class="nav-links">'),

    ('    <li><a href="#" class="active" onclick="scrollTo(0,0);return false;">Home</a></li>',
     '    <li><a href="/nl" class="active" onclick="scrollTo(0,0);return false;">Home</a></li>'),

    ('    <li><a href="/services">Our Services</a></li>\n    <li><a href="/nl" style="font-size:12px;font-weight:600;color:var(--mid);text-decoration:none;border:1px solid rgba(92,48,73,.2);border-radius:50px;padding:4px 10px;">NL</a></li>',
     '    <li><a href="/nl/services">Ons Aanbod</a></li>\n    <li><a href="/" style="font-size:12px;font-weight:600;color:var(--mid);text-decoration:none;border:1px solid rgba(92,48,73,.2);border-radius:50px;padding:4px 10px;">EN</a></li>'),

    ('  <a href="#" class="nav-logo"><img src="https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png" alt="Creative Solace"/></a>\n  <div class="mobile-nav-actions">',
     '  <a href="/nl" class="nav-logo"><img src="https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png" alt="Creative Solace"/></a>\n  <div class="mobile-nav-actions">'),

    ('    <a href="/nl" style="font-size:12px;font-weight:600;color:var(--mid);text-decoration:none;border:1px solid rgba(92,48,73,.2);border-radius:50px;padding:4px 10px;">NL</a>\n    <button class="nav-icon"',
     '    <a href="/" style="font-size:12px;font-weight:600;color:var(--mid);text-decoration:none;border:1px solid rgba(92,48,73,.2);border-radius:50px;padding:4px 10px;">EN</a>\n    <button class="nav-icon"'),

    # ── HERO ──────────────────────────────────────────────────────
    ('✦ Rhinestone Kits and Creative Workshops across the Netherlands',
     '✦ Rhinestone Kits en Creatieve Workshops door heel Nederland'),

    ('Sparkle is your<br><em>superpower.</em>',
     'Glitter is jouw<br><em>superkracht.</em>'),

    ('DIY rhinestone canvas kits, paint and sip nights, bedazzle workshops, and unforgettable events for everyone who believes life is better with a little glam. Based in the Netherlands, shipping nationwide.',
     'DIY rhinestone canvas kits, paint and sip avonden, bedazzle workshops en onvergetelijke events voor iedereen die gelooft dat het leven beter is met een beetje glitter. Gevestigd in Nederland, landelijk verzonden.'),

    ("Shop the Kits ✨",
     "Bekijk de kits ✨"),

    ("Book a Workshop →",
     "Boek een workshop →"),

    ('<strong>200+</strong> happy creators &nbsp;·&nbsp; <strong>50+</strong> workshops hosted across the Netherlands',
     '<strong>200+</strong> tevreden makers &nbsp;·&nbsp; <strong>50+</strong> workshops door heel Nederland'),

    ('Rhinestone Kits\n          </div>\n          <div class="float-sub">Ship in 1 to 2 days',
     'Rhinestone Kits\n          </div>\n          <div class="float-sub">Verzonden in 1-2 dagen'),

    ('hosted with love',
     'gegeven met liefde'),

    # ── SEEN AT ───────────────────────────────────────────────────
    ('<span class="seen-at-label-fixed">Previously seen at</span>',
     '<span class="seen-at-label-fixed">Eerder gezien bij</span>'),

    # ── BADGES ────────────────────────────────────────────────────
    ('<div class="badge-item"><span class="badge-icon">🚚</span> Free NL Shipping</div>',
     '<div class="badge-item"><span class="badge-icon">🚚</span> Gratis NL-verzending</div>'),

    ('<div class="badge-item"><span class="badge-icon">💎</span> Premium Quality</div>',
     '<div class="badge-item"><span class="badge-icon">💎</span> Premium kwaliteit</div>'),

    ('<div class="badge-item"><span class="badge-icon">🎨</span> Beginner Friendly</div>',
     '<div class="badge-item"><span class="badge-icon">🎨</span> Geschikt voor beginners</div>'),

    ('<div class="badge-item"><span class="badge-icon">🌟</span> Workshop Experts</div>',
     '<div class="badge-item"><span class="badge-icon">🌟</span> Workshop experts</div>'),

    ('<div class="badge-item"><span class="badge-icon">💌</span> Custom B2B</div>',
     '<div class="badge-item"><span class="badge-icon">💌</span> Maatwerk B2B</div>'),

    # ── HOW IT WORKS ──────────────────────────────────────────────
    ('<div class="section-label">The Process</div>',
     '<div class="section-label">Hoe het werkt</div>'),

    ('From box to <em>brilliant</em>',
     'Van doos tot <em>meesterwerk</em>'),

    ('Our kits are designed so that anyone, even total beginners, can create something stunning.',
     'Onze kits zijn zo ontworpen dat iedereen, ook een absolute beginner, iets prachtigs kan maken.'),

    ('<div class="step-title">Open your kit</div>',
     '<div class="step-title">Open je kit</div>'),

    ("Inside your Creative Solace box: a premium 20x30cm canvas, high-brilliance rhinestones, a precision pen tool, adhesive wax pad, specialist craft glue, and a step-by-step guide. You are ready.",
     "In je Creative Solace doos: een premium 20x30cm canvas, hoogglans rhinestones, een precisiepen, een wasplaatje, speciale B7000-lijm en een stap-voor-stap handleiding. Je bent er klaar voor."),

    ('<div class="step-title">Load your pen</div>',
     '<div class="step-title">Laad je pen</div>'),

    ("Dab the tip of your precision pen onto the adhesive wax pad. This gives it just enough grip to pick up a single rhinestone cleanly every time. No tweezers, no mess, no frustration.",
     "Dip de punt van je precisiepen in het wasplaatje. Zo pikt hij elke rhinestone schoon op. Geen pincet nodig, geen gedoe."),

    ('<div class="step-title">Place your gems</div>',
     '<div class="step-title">Zet je steentjes vast</div>'),

    ("Apply a small amount of craft glue to the section you are working on. Use your loaded pen to pick up each rhinestone and press it firmly into place. Work section by section and watch your design emerge.",
     "Breng een klein beetje B7000-lijm aan op het gedeelte waar je mee bezig bent. Gebruik je pen om elk steentje op te pakken en stevig vast te drukken. Werk sectie voor sectie en zie je ontwerp tot leven komen."),

    ('<div class="step-title">Frame and flex</div>',
     '<div class="step-title">Hang en geniet</div>'),

    ("Once complete, let your piece set and then frame it, gift it, or show it off. Tag us when you do. We genuinely love to see every single one.",
     "Laat je werk uitharden en hang het op, geef het cadeau of pronk ermee. Tag ons als je klaar bent. We vinden het echt geweldig om ze allemaal te zien."),

    # ── PRODUCTS ──────────────────────────────────────────────────
    ('<div class="section-label">Rhinestone Kits</div>',
     '<div class="section-label">Rhinestone Kits</div>'),

    ('The <em>Collection</em>',
     'De <em>Collectie</em>'),

    ('All kits include rhinestones, canvas, precision pen, wax pad and craft glue. Ships in 1 to 2 business days.',
     'Alle kits bevatten rhinestones, canvas, precisiepen, wasplaatje en B7000-lijm. Verzonden in 1 tot 2 werkdagen.'),

    ('>View all →<',
     '>Bekijk alles →<'),

    ('+ Quick Add',
     '+ Voeg toe'),

    ('20x30cm · Beginner',
     '20x30cm · Beginnersvriendelijk'),

    ("Say it with kisses. This bold rhinestone canvas turns a full bouquet of lip prints into a sparkling statement piece. Cheeky, romantic, and totally one of a kind.",
     "Zeg het met kusjes. Dit stoere rhinestone canvas maakt van een boeket lipafdrukken een glanzend statement piece. Brutaal, romantisch en totaal uniek."),

    ("The double-C logo. A classic red lipstick. Pop art meets high fashion in this striking rhinestone canvas.",
     "Het dubbele C-logo. Een klassieke rode lippenstift. Pop-art meets high fashion in dit opvallende rhinestone canvas."),

    ("Leopard print straps, chain-link ankle details, the Dior logo. Pure luxury fashion energy rendered gem by gem.",
     "Luipaardprint bandjes, schakelketting details, het Dior-logo. Pure luxe mode-energie, steentje voor steentje."),

    ("Triple sevens, all heart. Three pink dice covered in tiny crimson hearts. Playful, Y2K-coded, and a crowd favourite.",
     "Driedubbele zevens, vol liefde. Drie roze dobbelstenen bezaaid met hartjes. Speels, Y2K-vibes en een publiekslieveling."),

    # ── GALLERY ───────────────────────────────────────────────────
    ('<div class="section-label reveal">Made by our community</div>',
     '<div class="section-label reveal">Gemaakt door onze community</div>'),

    ('Your creations <em>IRL</em>',
     'Jouw creaties <em>IRL</em>'),

    # ── WORKSHOPS ─────────────────────────────────────────────────
    ('<div class="section-label" style="color:var(--yellow)">Experiences</div>',
     '<div class="section-label" style="color:var(--yellow)">Ervaringen</div>'),

    ('Workshops that <em style="background:var(--grad-pink);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">spark joy</em>',
     'Workshops die <em style="background:var(--grad-pink);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">bijblijven</em>'),

    ("Whether it is a girls night out in Rotterdam, a birthday bash, a bachelorette party, or a corporate team event anywhere in the Netherlands, we have the perfect creative experience for you.",
     "Of het nu gaat om een meidenuitje in Rotterdam, een verjaardagsfeestje, een vrijgezellenfeest of een bedrijfsuitje door heel Nederland — wij hebben de perfecte creatieve ervaring voor jou."),

    ('>Request a quote<',
     '>Vraag een offerte aan<'),

    ('<div class="workshop-label">Most Popular</div>',
     '<div class="workshop-label">Meest Populair</div>'),

    ('Grab a glass of wine (or bubbly!) and paint your way to a masterpiece. No experience needed, just good vibes and great company.',
     'Pak een glas wijn (of bubbels!) en schilder je weg naar een meesterwerk. Geen ervaring nodig, alleen goede energie en gezelschap.'),

    ('<div class="meta-item"><span>⏱</span> 2 to 3 hours</div>\n            <div class="meta-item"><span>👥</span> 6 to 25 people</div>\n            <div class="meta-item"><span>📍</span> Your venue or ours</div>',
     '<div class="meta-item"><span>⏱</span> 2 tot 3 uur</div>\n            <div class="meta-item"><span>👥</span> 6 tot 25 personen</div>\n            <div class="meta-item"><span>📍</span> Jouw locatie of de onze</div>'),

    ('<div class="workshop-label">New and Trending</div>',
     '<div class="workshop-label">Nieuw en Trending</div>'),

    ("Rhinestone magic meets cocktail hour. Pick your kit design, sip your drink, and create something dazzling together with your crew.",
     "Rhinestone-magie meets cocktail-uur. Kies je kit-ontwerp, nip aan je drankje en maak samen iets schitterends met je vriendinnen."),

    ('<div class="meta-item"><span>⏱</span> 2 to 3 hours</div>\n            <div class="meta-item"><span>👥</span> 6 to 20 people</div>\n            <div class="meta-item"><span>📍</span> We come to you</div>',
     '<div class="meta-item"><span>⏱</span> 2 tot 3 uur</div>\n            <div class="meta-item"><span>👥</span> 6 tot 20 personen</div>\n            <div class="meta-item"><span>📍</span> Wij komen naar jou</div>'),

    ('<div class="workshop-label">Private Events</div>',
     '<div class="workshop-label">Privé-events</div>'),

    ('<h3 class="workshop-title">Bachelorette and Birthday Packages</h3>',
     '<h3 class="workshop-title">Vrijgezellenfeest en Verjaardagspakketten</h3>'),

    ("Make your special occasion truly unforgettable. We handle everything: materials, setup, guidance, and good energy, so you can focus on the fun.",
     "Maak jouw speciale gelegenheid echt onvergetelijk. Wij regelen alles: materialen, opbouw, begeleiding en goede energie — jij focust op het plezier."),

    ('<div class="meta-item"><span>✨</span> Fully customisable</div>\n              <div class="meta-item"><span>🎁</span> Take-home keepsakes</div>\n              <div class="meta-item"><span>💬</span> WhatsApp planning</div>',
     '<div class="meta-item"><span>✨</span> Volledig aanpasbaar</div>\n              <div class="meta-item"><span>🎁</span> Kunstwerk om mee naar huis te nemen</div>\n              <div class="meta-item"><span>💬</span> Planning via WhatsApp</div>'),

    ('>Plan my event<',
     '>Plan mijn event<'),

    # ── EVENTS ────────────────────────────────────────────────────
    ('<div class="section-label">Coming Up</div>',
     '<div class="section-label">Binnenkort</div>'),

    ('Upcoming <em>events</em>',
     'Aankomende <em>events</em>'),

    ('Grab your ticket and come meet us in real life — materials included.',
     'Koop je ticket en kom ons ontmoeten in het echt — materialen inbegrepen.'),

    ("Get tickets — €",
     "Tickets kopen — €"),

    ('<div class="section-label">Find Us IRL</div>',
     '<div class="section-label">Vind ons IRL</div>'),

    ("Where we've <em>been</em>",
     'Waar we <em>zijn geweest</em>'),

    ("From thrift markets to festivals and corporate events, we show up across the Netherlands with our kits, our energy, and our glam.",
     "Van thrift markets tot festivals en bedrijfsevents — wij staan door heel Nederland met onze kits, energie en glitter."),

    ("window.location.href='/events/",
     "window.location.href='/nl/events/"),

    ('<div class="coming-soon-title">More events coming soon</div>',
     '<div class="coming-soon-title">Binnenkort meer events</div>'),

    ('<div class="coming-soon-sub">Follow us on Instagram to catch our next pop-up near you.</div>',
     '<div class="coming-soon-sub">Volg ons op Instagram voor onze volgende pop-up bij jou in de buurt.</div>'),

    ('>Follow us ✨<',
     '>Volg ons ✨<'),

    # ── B2B ───────────────────────────────────────────────────────
    ('<div class="section-label">For Brands and Companies</div>',
     '<div class="section-label">Voor merken en bedrijven</div>'),

    ("Let's create something <em>custom</em>",
     'Laten we iets <em>op maat</em> maken'),

    ("Whether it is a team-building activity, branded merchandise, an event stand, or a partnership, we love building unique creative experiences for businesses.",
     "Of het nu gaat om een teambuilding, branded merchandise, een eventstand of een samenwerking — wij bouwen graag unieke creatieve ervaringen voor bedrijven."),

    ('<div class="perk-title">Corporate Team Events</div>\n          <p class="perk-desc">Creative workshops that actually bond your team. No trust falls required.</p>',
     '<div class="perk-title">Corporate teamevents</div>\n          <p class="perk-desc">Creatieve workshops die je team echt samenbrengen. Geen verplichte teambuildingoefeningen.</p>'),

    ('<div class="perk-title">Festival and Market Stands</div>\n          <p class="perk-desc">We set up a branded stand and bring the sparkle to your event.</p>',
     '<div class="perk-title">Festival- en marktstandjes</div>\n          <p class="perk-desc">Wij zetten een branded stand op en brengen de glitter naar jouw event.</p>'),

    ('<div class="perk-title">Custom Branded Kits</div>\n          <p class="perk-desc">White-label rhinestone kits with your branding, perfect for gifting.</p>',
     '<div class="perk-title">Custom branded kits</div>\n          <p class="perk-desc">White-label rhinestone kits met jouw branding, perfect als cadeau.</p>'),

    ('<div class="perk-title">Bespoke Artworks</div>\n          <p class="perk-desc">Commission one-of-a-kind rhinestone pieces for your brand or space.</p>',
     '<div class="perk-title">Maatwerk kunstwerken</div>\n          <p class="perk-desc">Laat unieke rhinestone kunstwerken maken voor jouw merk of ruimte.</p>'),

    ('<div class="form-title">Tell us about your project</div>',
     '<div class="form-title">Vertel ons over jouw project</div>'),

    ('<p class="form-sub">Fill in the form and we will get back to you within 24 hours.</p>',
     '<p class="form-sub">Vul het formulier in en wij nemen binnen 24 uur contact met je op.</p>'),

    ('<label class="form-label">First Name</label>\n          <input class="form-input" type="text" placeholder="Sophie"/>',
     '<label class="form-label">Voornaam</label>\n          <input class="form-input" type="text" placeholder="Sophie"/>'),

    ('<label class="form-label">Last Name</label>\n          <input class="form-input" type="text" placeholder="de Boer"/>',
     '<label class="form-label">Achternaam</label>\n          <input class="form-input" type="text" placeholder="de Boer"/>'),

    ('<label class="form-label">Email *</label>\n        <input class="form-input" type="email" placeholder="sophie@company.com"/>',
     '<label class="form-label">E-mailadres *</label>\n        <input class="form-input" type="email" placeholder="sophie@bedrijf.nl"/>'),

    ('<label class="form-label">Event Type *</label>',
     '<label class="form-label">Type event *</label>'),

    ('<option value="">Please select...</option>\n          <option>Corporate Team Event</option>\n          <option>Festival / Market Stand</option>\n          <option>Custom Branded Kits</option>\n          <option>Bespoke Artwork Commission</option>\n          <option>Other</option>',
     '<option value="">Selecteer een optie...</option>\n          <option>Corporate teamevent</option>\n          <option>Festival / marktstand</option>\n          <option>Custom branded kits</option>\n          <option>Maatwerk kunstwerk</option>\n          <option>Anders</option>'),

    ('<label class="form-label">Preferred Date</label>',
     '<label class="form-label">Gewenste datum</label>'),

    ('<label class="form-label">No. of Guests</label>\n          <input class="form-input" type="number" placeholder="e.g. 20"/>',
     '<label class="form-label">Aantal gasten</label>\n          <input class="form-input" type="number" placeholder="bijv. 20"/>'),

    ('<label class="form-label">Message</label>\n        <textarea class="form-textarea" placeholder="Tell us more about what you have in mind..."></textarea>',
     '<label class="form-label">Bericht</label>\n        <textarea class="form-textarea" placeholder="Vertel ons meer over wat je in gedachten hebt..."></textarea>'),

    ('>Send my enquiry ✨<',
     '>Verstuur mijn aanvraag ✨<'),

    # ── REVIEWS ───────────────────────────────────────────────────
    ('<div class="section-label">Love from the Community</div>',
     '<div class="section-label">Reacties uit de community</div>'),

    ("They're <em>obsessed</em>",
     'Ze zijn <em>verslaafd</em>'),

    ('Real reviews from real sparkle enthusiasts across the Netherlands.',
     'Echte reviews van echte glitter-enthousiastelingen door heel Nederland.'),

    ('<h3 class="reviews-empty-title">Be one of the first to share your experience</h3>',
     '<h3 class="reviews-empty-title">Wees een van de eersten die een review schrijft</h3>'),

    ("We're just getting started. If you've tried a kit or attended one of our workshops, we would love to hear from you.",
     "We zijn net begonnen. Als je een kit hebt geprobeerd of een workshop hebt bijgewoond, horen we graag van je."),

    (">Leave a review ✨<",
     ">Schrijf een review ✨<"),

    # ── NEWSLETTER ────────────────────────────────────────────────
    ('<div class="section-label" style="color:var(--yellow);position:relative;z-index:1">Stay in the loop</div>',
     '<div class="section-label" style="color:var(--yellow);position:relative;z-index:1">Blijf op de hoogte</div>'),

    ('Get first access to <em style="background:var(--grad-pink);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">new drops</em>',
     'Als eerste toegang tot <em style="background:var(--grad-pink);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">nieuwe drops</em>'),

    ('New kit designs, workshop dates, festival appearances, straight to your inbox. No spam, only sparkle.',
     'Nieuwe kit-ontwerpen, workshopdata, festivaloptredens, direct in je inbox. Geen spam, alleen glitter.'),

    ('placeholder="your@email.com"',
     'placeholder="jouw@email.nl"'),

    ('>Subscribe ✨<',
     '>Aanmelden ✨<'),

    # ── FOOTER ────────────────────────────────────────────────────
    ('  <a href="#" class="nav-logo"><img src="https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png" alt="Creative Solace"/></a>\n      <p class="footer-tagline">',
     '  <a href="/nl" class="nav-logo"><img src="https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png" alt="Creative Solace"/></a>\n      <p class="footer-tagline">'),

    ('Bringing sparkle, creativity, and good vibes to workshops, markets, festivals, and living rooms across the Netherlands and beyond.',
     'Wij brengen glitter, creativiteit en goede energie naar workshops, markten, festivals en woonkamers door heel Nederland en daarbuiten.'),

    ('<div class="footer-col-title">Shop</div>',
     '<div class="footer-col-title">Shop</div>'),

    ('<li><a href="/#kits">All Kits</a></li>\n          <li><a href="/services">Our Services</a></li>',
     '<li><a href="/nl#kits">Alle kits</a></li>\n          <li><a href="/nl/services">Ons aanbod</a></li>'),

    ('<div class="footer-col-title">Experiences</div>',
     '<div class="footer-col-title">Ervaringen</div>'),

    ('<li><a href="/#workshops">Paint and Sip</a></li>\n          <li><a href="/#workshops">Bedazzle and Sip</a></li>\n          <li><a href="/#workshops">Private Events</a></li>\n          <li><a href="/#b2b">Corporate B2B</a></li>\n          <li><a href="/#events">Upcoming Events</a></li>',
     '<li><a href="/nl#workshops">Paint and Sip</a></li>\n          <li><a href="/nl#workshops">Bedazzle and Sip</a></li>\n          <li><a href="/nl#workshops">Privé-events</a></li>\n          <li><a href="/nl#b2b">Corporate B2B</a></li>\n          <li><a href="/nl#events">Aankomende events</a></li>'),

    ('<div class="footer-col-title">Help</div>',
     '<div class="footer-col-title">Hulp</div>'),

    ('<li><a href="mailto:hello@creativesolace.com">Contact Us</a></li>\n          <li><a href="/faq">FAQ</a></li>\n          <li><a href="/shipping">Shipping and Returns</a></li>\n          <li><a href="/privacy">Privacy Policy</a></li>',
     '<li><a href="mailto:hello@creativesolace.com">Neem contact op</a></li>\n          <li><a href="/nl/faq">Veelgestelde vragen</a></li>\n          <li><a href="/nl/shipping">Verzending en retourneren</a></li>\n          <li><a href="/nl/privacy">Privacybeleid</a></li>'),

    ('© 2026 Creative Solace. Made with 💎 in the Netherlands.',
     '© 2026 Creative Solace. Gemaakt met 💎 in Nederland.'),

    # ── TAB BAR ───────────────────────────────────────────────────
    ('<span class="tab-label">Home</span>',
     '<span class="tab-label">Home</span>'),

    ('<span class="tab-label">Kits</span>',
     '<span class="tab-label">Kits</span>'),

    ('<span class="tab-label">Workshops</span>',
     '<span class="tab-label">Workshops</span>'),

    ('<span class="tab-label">Events</span>',
     '<span class="tab-label">Events</span>'),

    ('<span class="tab-label">B2B</span>',
     '<span class="tab-label">B2B</span>'),

    # ── CART ──────────────────────────────────────────────────────
    ("<div class=\"cart-title\">Your Cart 🛒</div>",
     "<div class=\"cart-title\">Jouw winkelwagen 🛒</div>"),

    ("<p>Your cart is empty. Time to sparkle!</p>",
     "<p>Je winkelwagen is leeg. Tijd om te schitteren!</p>"),

    (">Shop kits →<",
     ">Bekijk kits →<"),

    ("'Checkout →'",
     "'Afrekenen →'"),

    (">Checkout →<",
     ">Afrekenen →<"),

    # ── QUOTE MODAL ───────────────────────────────────────────────
    ("'Request a quote: ' + type + ' ✨'",
     "'Offerte aanvragen: ' + type + ' ✨'"),

    ('<div class="modal-title" id="quoteTitle">Request a quote ✨</div>',
     '<div class="modal-title" id="quoteTitle">Offerte aanvragen ✨</div>'),

    ('<p class="modal-sub">Tell us what you have in mind and we will get back to you within 24 hours with a tailored proposal.</p>',
     '<p class="modal-sub">Vertel ons wat je in gedachten hebt en wij sturen je binnen 24 uur een voorstel op maat.</p>'),

    ('<label class="form-label">First Name *</label>\n        <input class="form-input" id="quoteName" type="text" placeholder="Sophie"/>',
     '<label class="form-label">Voornaam *</label>\n        <input class="form-input" id="quoteName" type="text" placeholder="Sophie"/>'),

    ('<label class="form-label">Last Name</label>\n        <input class="form-input" type="text" placeholder="de Boer"/>',
     '<label class="form-label">Achternaam</label>\n        <input class="form-input" type="text" placeholder="de Boer"/>'),

    ('<label class="form-label">Email *</label>\n      <input class="form-input" id="quoteEmail" type="email" placeholder="sophie@email.com"/>',
     '<label class="form-label">E-mailadres *</label>\n      <input class="form-input" id="quoteEmail" type="email" placeholder="sophie@email.nl"/>'),

    ('<label class="form-label">Booking type *</label>',
     '<label class="form-label">Type boeking *</label>'),

    ('<option value="">Please select...</option>\n        <option>Private event (friends, birthday, bachelorette)</option>\n        <option>Venue or hospitality booking</option>\n        <option>Corporate team event</option>\n        <option>Festival or market stand</option>\n        <option>Other</option>',
     '<option value="">Selecteer een optie...</option>\n        <option>Privé-event (vriendinnen, verjaardag, vrijgezellenfeest)</option>\n        <option>Locatie of horecaboeking</option>\n        <option>Corporate teamevent</option>\n        <option>Festival of marktstand</option>\n        <option>Anders</option>'),

    ('<label class="form-label">Preferred date</label>',
     '<label class="form-label">Gewenste datum</label>'),

    ('<label class="form-label">Number of guests</label>\n        <input class="form-input" id="quoteGuests" type="number" placeholder="e.g. 15"/>',
     '<label class="form-label">Aantal gasten</label>\n        <input class="form-input" id="quoteGuests" type="number" placeholder="bijv. 15"/>'),

    ('<label class="form-label">Anything else?</label>\n      <textarea class="form-textarea" id="quoteMessage" placeholder="Location preferences, theme ideas, dietary requirements..."></textarea>',
     '<label class="form-label">Overige wensen?</label>\n      <textarea class="form-textarea" id="quoteMessage" placeholder="Locatievoorkeuren, thema-ideeën, dieetwensen..."></textarea>'),

    ('>Send my request ✨<',
     '>Verstuur mijn aanvraag ✨<'),

    ("btn.textContent = 'Please fill in all required fields'",
     "btn.textContent = 'Vul alle verplichte velden in'"),

    ("btn.textContent = '✅ Request sent! We will be in touch within 24 hours.';",
     "btn.textContent = '✅ Aanvraag verstuurd! We nemen binnen 24 uur contact op.';"),

    # ── CONTACT MODAL ─────────────────────────────────────────────
    ('<div class="modal-title" id="bookingTitle">Get in touch 💌</div>',
     '<div class="modal-title" id="bookingTitle">Neem contact op 💌</div>'),

    ('<p class="modal-sub">Questions about a kit or planning something special? We will get back to you within 24 hours.</p>',
     '<p class="modal-sub">Vragen over een kit of iets speciaals in de planning? Wij reageren binnen 24 uur.</p>'),

    ('<label class="form-label">What can we help you with? *</label>',
     '<label class="form-label">Waarmee kunnen we je helpen? *</label>'),

    ('<option value="">Please select...</option>\n        <option>Product question</option>\n        <option>Private workshop booking</option>\n        <option>Bachelorette or birthday party</option>\n        <option>Something else</option>',
     '<option value="">Selecteer een optie...</option>\n        <option>Vraag over een product</option>\n        <option>Privé-workshop boeken</option>\n        <option>Vrijgezellenfeest of verjaardag</option>\n        <option>Iets anders</option>'),

    ('<label class="form-label">Your message</label>\n      <textarea class="form-textarea" placeholder="Tell us what you have in mind..."></textarea>',
     '<label class="form-label">Jouw bericht</label>\n      <textarea class="form-textarea" placeholder="Vertel ons wat je in gedachten hebt..."></textarea>'),

    ('>Send my message ✨<',
     '>Verstuur mijn bericht ✨<'),

    ("btn.textContent = '✅ Message sent! We will be in touch soon.';",
     "btn.textContent = '✅ Bericht verstuurd! We nemen snel contact op.';"),

    # ── REVIEW MODAL ──────────────────────────────────────────────
    ('<div class="modal-title">Share your experience 💎</div>',
     '<div class="modal-title">Deel jouw ervaring 💎</div>'),

    ('<p class="modal-sub">Your review will appear on the site once approved. We read every single one.</p>',
     '<p class="modal-sub">Jouw review verschijnt op de site na goedkeuring. We lezen elke review persoonlijk.</p>'),

    ('<label class="form-label">Your name *</label>',
     '<label class="form-label">Jouw naam *</label>'),

    ('<label class="form-label">Your city</label>',
     '<label class="form-label">Jouw stad</label>'),

    ('<label class="form-label">Which kit or workshop? *</label>',
     '<label class="form-label">Welke kit of workshop? *</label>'),

    ('<option value="">Please select...</option>\n        <option>Bouquet of Kisses kit</option>\n        <option>Chanel Lipstick kit</option>\n        <option>Dior Heels kit</option>\n        <option>Lucky 777 kit</option>\n        <option>Paint and Sip workshop</option>\n        <option>Bedazzle and Sip workshop</option>\n        <option>Private event</option>\n        <option>Corporate event</option>',
     '<option value="">Selecteer een optie...</option>\n        <option>Bouquet of Kisses kit</option>\n        <option>Chanel Lipstick kit</option>\n        <option>Dior Heels kit</option>\n        <option>Lucky 777 kit</option>\n        <option>Paint and Sip workshop</option>\n        <option>Bedazzle and Sip workshop</option>\n        <option>Privé-event</option>\n        <option>Bedrijfsevent</option>'),

    ('<label class="form-label">Your rating *</label>',
     '<label class="form-label">Jouw beoordeling *</label>'),

    ('<label class="form-label">Your review *</label>\n      <textarea class="form-textarea" id="reviewText" placeholder="Tell us what you loved about it..."></textarea>',
     '<label class="form-label">Jouw review *</label>\n      <textarea class="form-textarea" id="reviewText" placeholder="Vertel ons wat je er zo leuk aan vond..."></textarea>'),

    ('>Submit my review ✨<',
     '>Verstuur mijn review ✨<'),

    ("btn.textContent = 'Please fill in all required fields';",
     "btn.textContent = 'Vul alle verplichte velden in';"),

    ("btn.textContent = '✅ Thank you! We will review your submission shortly.';",
     "btn.textContent = '✅ Bedankt! We bekijken jouw inzending zo snel mogelijk.';"),

    # ── JS MISC ───────────────────────────────────────────────────
    ("'Please fill in your email and event type'",
     "'Vul jouw e-mailadres en type event in'"),

    ("\"✅ Enquiry sent! We'll be in touch soon.\"",
     '"✅ Aanvraag verstuurd! We nemen snel contact op."'),

    ("btn.textContent = '🎉 You\\'re in!';",
     "btn.textContent = '🎉 Welkom bij de club!';"),

    ("'Redirecting to Stripe...'",
     "'Bezig met doorsturen naar Stripe...'"),

    ("'Get tickets — €' + ticketPrice + ' ✨'",
     "'Tickets kopen — €' + ticketPrice + ' ✨'"),

    ("'Something went wrong. Please try again or contact us at hello@creativesolace.com'",
     "'Er is iets misgegaan. Probeer het opnieuw of neem contact op via hello@creativesolace.com'"),

    ("'Something went wrong. Please try again or contact us.'",
     "'Er is iets misgegaan. Probeer het opnieuw of neem contact op.'"),
]

for old, new in replacements:
    if old in s:
        s = s.replace(old, new, 1)
    else:
        print(f'WARNING: not found: {repr(old[:60])}')

# Fix all internal anchor href links to use /nl prefix
s = s.replace('href="#kits"', 'href="/nl#kits"')
s = s.replace('href="#workshops"', 'href="/nl#workshops"')
s = s.replace('href="#events"', 'href="/nl#events"')
s = s.replace('href="#b2b"', 'href="/nl#b2b"')
s = s.replace("scrollToSection('kits')", "scrollToSection('kits')")  # JS stays the same
s = s.replace("href='#kits'", "href='/nl#kits'")

import os
os.makedirs('src/pages/nl', exist_ok=True)

with open('src/pages/nl/index.astro', 'w') as f:
    f.write(s)

lines = s.count('\n')
print(f'Written src/pages/nl/index.astro — {lines} lines')
print('Done.')
