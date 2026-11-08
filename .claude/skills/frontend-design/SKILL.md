---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one in CDM Optimiser. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults, using the project's fixed colour system.
license: Complete terms in LICENSE.txt
---

<!--
Modified for CDM Optimiser from Anthropic's frontend-design skill
(Apache License 2.0, see LICENSE.txt). Changes: colour choices follow the
project's colour system instead of a new palette per brief; the colour
system section was added; references to choosing hex palettes were
replaced.
-->

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about typography, layout and composition that are specific to this brief, and take one real aesthetic risk you can justify.

Colour is the exception. CDM Optimiser already has a colour system, described below, and every screen uses it so the product reads as one tool. Spend your creativity on everything else; take colours from the system.

## CDM Optimiser colour system

The app uses Tailwind CSS v4's default palette with no custom theme: `apps/web/src/index.css` only imports Tailwind. Colours are always Tailwind utility classes, never hex codes, arbitrary values (`bg-[#…]`) or inline `style` colours.

### Light and dark mode

- `dark:` variants follow the operating system's colour scheme (`prefers-color-scheme`). In the desktop app, the theme menu sets it through Electron, so the same classes cover both apps.
- `apps/web/src/reset.css` sets `color-scheme: light dark`, so plain body text takes the browser's default colour for each scheme. Only set a text colour where a role below calls for one.
- Check every colour you add in dark mode too. Add a `dark:` counterpart unless the same class reads well on both pages (the primary button, the accent rule, alerts: see Feedback).

### Roles

| Role     | Palette                         | Meaning                                                               |
| -------- | ------------------------------- | --------------------------------------------------------------------- |
| Primary  | `sky`                           | Actions, links, focus, selection and hover; the app's identity colour |
| Neutral  | `gray`, `white`, `black`        | Page, surfaces, text, borders, disabled states                        |
| Accepted | `green`; `emerald` in dark mode | A patient accepted CDM enrolment; a chronic condition is present      |
| Refused  | `red`; `rose` in dark mode      | A patient refused enrolment                                           |
| Pending  | Neutral, no fill                | No decision yet                                                       |
| Feedback | `sky`, `green`, `yellow`, `red` | Info, success, warning and error messages                             |

Keep these meanings exclusive: green and red only ever mean a patient's outcome or a success or error message, never decoration. Don't introduce other hues (blue, indigo, violet, orange and so on).

### Contrast

Every pair must meet WCAG 2.2 AA in light and dark mode: **4.5:1** for text
and **3:1** for icons that carry meaning, control boundaries, states and focus
rings. The recipes below all pass; check a new pair before using it (Tailwind
4's colours are OKLCH, so compute from its values, not from older hex
tables). `yarn test:e2e` runs axe on every page in both modes and fails on a
text-contrast problem; it can't judge icons or states, so those are on you.

Colour is never the only signal: a patient's status is also written and
drawn (the Status column), and the current page link is bold as well as
darker.

### Use the shared components first

`@cdm-optimiser/ui` already applies these recipes. Reach for its components
before writing classes by hand:

- `ButtonComponent`: `variant="primary"` for the main action and for the
  selected option in a group (the active filter, the current page);
  `variant="secondary"` for every other button. Pass `aria-pressed` or
  `aria-current` yourself.
- `CardComponent`: cards and panels.
- `TextFieldComponent`: labelled inputs, the search box included.
- `SwitchComponent`: on/off controls, `tone="positive"` (green) or
  `"negative"` (red), for accepted or refused only.
- `ModalComponent`: dialogs. It draws the title and the close button in one
  row; pass `title`. `placement="end"` makes it a drawer, for small-screen
  menus.
- `AlertComponent`: messages.
- The icon components, instead of inline `<svg>`.

The tables below remain the reference for anything those components don't
cover, and for changing the components themselves.

### Surfaces and text

| Element                 | Light                                            | Dark                                                    |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| Page background         | `bg-gray-100`                                    | `dark:bg-gray-900`                                      |
| Card or panel           | `rounded-xl bg-white shadow-md`                  | `dark:bg-white/5 dark:ring dark:ring-gray-600`          |
| Modal                   | `bg-white` over a `bg-black/70` backdrop         | `dark:bg-gray-800 dark:ring dark:ring-gray-600`         |
| Dropdown or menu list   | `bg-white shadow-md ring-1 ring-gray-200`        | `dark:bg-gray-800 dark:ring-gray-600`                   |
| Text input, select      | `bg-white shadow-md outline-1 outline-gray-500`  | `dark:bg-white/5 dark:text-white dark:outline-gray-500` |
| Placeholder             | `placeholder:text-gray-500`                      | `dark:placeholder:text-gray-400`                        |
| Hint under a field      | `text-sm text-gray-600`                          | `dark:text-gray-300`                                    |
| Strong text on surfaces | `text-gray-900`                                  | `dark:text-white`                                       |
| Muted icons             | `text-gray-500`                                  | `dark:text-gray-400`                                    |
| Dividers, table borders | `border-gray-200`; table cells `border-gray-300` | `dark:border-gray-600`                                  |

### Primary (sky)

| Element                       | Light                                                                                    | Dark                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Primary button, selected item | `border-b-4 border-sky-700 border-b-sky-900 bg-sky-700 text-white`, hover `bg-sky-800`   | Same                                                                       |
| Secondary button              | `border-b-4 border-sky-100 border-b-sky-300 bg-sky-100 text-sky-900`, hover `bg-sky-200` | `dark:bg-sky-950 dark:border-b-sky-800 dark:text-sky-100`, hover `sky-900` |
| Disabled button               | `bg-gray-200 text-gray-600 border-b-gray-400`                                            | `dark:bg-gray-700 dark:text-gray-300 dark:border-b-gray-600`               |
| Link                          | `text-sky-700 underline hover:text-sky-900`; current page also `font-semibold`           | `dark:text-sky-300 dark:hover:text-sky-200`                                |
| Keyboard focus                | `outline-4 outline-offset-2 outline-sky-700`, set once for every control                 | `dark:outline-sky-400`                                                     |
| Table header                  | `bg-sky-200`                                                                             | `dark:bg-sky-950`                                                          |
| Hover on table rows           | `hover:bg-sky-100`                                                                       | `dark:hover:bg-sky-900`                                                    |
| Hover on menu items           | `hover:bg-sky-700 hover:text-white`                                                      | Same                                                                       |
| Accent rule                   | `border-sky-700` (the line under the header)                                             | Same                                                                       |

- The focus ring lives in `apps/web/src/index.css` (`:focus-visible`), so
  controls don't set their own. Text fields and the select are the
  exception: their border is an outline utility, which beats the base
  layer, so they repeat the same ring with `focus-visible:`.
- Buttons get their colours through `enabled:` and `disabled:`, so a
  disabled button never shows a variant's colour.
- Pressed buttons drop onto their bottom edge (`active:mt-1
active:border-b-0`): the face moves, the button's outer size doesn't.
- A button that opens a list (the theme dropdown, the account menu) is a
  secondary button ending in a chevron-down icon. The list's entries share
  one recipe (`popup-classes.ts` in `packages/ui`): hover and focus fill
  them with `bg-sky-700 text-white`, and the selected option or current
  page is bold.

### Patient status

| Status   | Table row and legend swatch                | Switch when on | Status cell   |
| -------- | ------------------------------------------ | -------------- | ------------- |
| Accepted | `bg-green-100`; dark `dark:bg-emerald-900` | `bg-green-700` | ✓ "Accepted"  |
| Refused  | `bg-red-100`; dark `dark:bg-rose-900`      | `bg-red-600`   | ✗ "Refused"   |
| Pending  | No fill (swatch: outline only)             | n/a            | ··· "Pending" |

- Accepted and refused fills are nearly the same lightness, so people who
  can't tell red from green can't tell them apart: the Status cell's word
  and shape (the same icons as the switches' knobs) carry the meaning.
- Dark-mode rows use dark fills, so every row keeps the page's light text.
- A switch that is off is `bg-gray-500` with a white knob (`ring-gray-500`);
  dark `dark:bg-white/5 dark:ring dark:ring-gray-500`.
- Condition flags (asthma, DM, CVD, COPD): present is `text-green-700`
  (`dark:text-green-400`), absent is `text-gray-500` (`dark:text-gray-400`),
  each with "Yes" or "No" for screen readers.

### Feedback

Show messages with `AlertComponent` from `@cdm-optimiser/ui` rather than
styling them by hand. Each type uses three steps of one hue: a `-50` tint
for the background, an accent for the left border, icon, close button and
progress bar, and a `-800` shade for the text.

| Type    | Hue      | Accent       |
| ------- | -------- | ------------ |
| Info    | `sky`    | `sky-700`    |
| Success | `green`  | `green-700`  |
| Warning | `yellow` | `yellow-700` |
| Error   | `red`    | `red-600`    |

Alerts keep their pale tints in dark mode: dark text on a light tint stays
readable, so they have no `dark:` variants. For the same reason, a link
inside an alert uses the light link colours only (`text-sky-700 underline
hover:text-sky-900`, at least 4.5:1 on every tint).

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. Colour is never a free axis in this project: it comes from the colour system. Just like a human designer who's hired, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the human's design brief: create a compact token system with color, type, layout, and signature. Color: name the colour-system roles the design uses (for example primary action, card surface, accepted status) and where each appears; don't add hues or hex values. If the design needs a role the system doesn't have, propose an addition to the colour system and say why, instead of inventing a colour inline. Type: the typefaces for 2+ roles (a characterful display face that's used with restraint, a complementary body face, and a utility face for captions or data if needed). Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Signature: the single unique element this page will be remembered by that embodies the brief in an appropriate way.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan exactly, deriving every type decision from it and every colour from the colour system.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and a element-based selector like .cta). This can happen often with paddings/margins between sections.

Try to do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Not taking a risk can be a risk itself! Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, and both light and dark mode checked. Critique your own work as you build, taking screenshots if your environment supports it – a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creators have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand, and therefore easier to use. They are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.
