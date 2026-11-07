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
- Every colour you add needs its `dark:` counterpart. Alerts are the one exception (see Feedback).

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

### Use the shared components first

`@cdm-optimiser/ui` already applies these recipes. Reach for its components
before writing classes by hand:

- `ButtonComponent`: primary actions, and `variant="segment"` with
  `aria-pressed` for a group of filters.
- `CardComponent`: cards and panels.
- `TextFieldComponent`: labelled inputs.
- `SwitchComponent`: on/off controls, `tone="positive"` (green) or
  `"negative"` (red), for accepted or refused only.
- `ModalComponent`: dialogs.
- `AlertComponent`: messages.
- The icon components, instead of inline `<svg>`.

The tables below remain the reference for anything those components don't
cover, and for changing the components themselves.

### Surfaces and text

| Element                 | Light                                           | Dark                                                    |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| Page background         | `bg-gray-100`                                   | `dark:bg-gray-900`                                      |
| Card or panel           | `rounded-xl bg-white shadow-md`                 | `dark:bg-white/5 dark:ring dark:ring-gray-600`          |
| Modal                   | `bg-white` over a `bg-black/70` backdrop        | `dark:bg-gray-800 dark:ring dark:ring-gray-600`         |
| Dropdown menu           | `bg-white shadow-md`                            | `dark:bg-gray-600`                                      |
| Text input              | `bg-white shadow-md outline-1 outline-gray-200` | `dark:bg-white/5 dark:text-white dark:outline-gray-600` |
| Strong text on surfaces | `text-gray-900`                                 | `dark:text-white`                                       |
| Muted text and icons    | `text-gray-400`                                 | `dark:text-gray-400`                                    |
| Dividers, table borders | `border-gray-200`, `border-gray-300`            | Same                                                    |

### Primary (sky)

| Element                         | Classes                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary button                  | `rounded-md border-b-4 border-b-sky-600 bg-sky-500 text-white`, hover `bg-sky-600 border-sky-800`, `active:border-b-0`; dark `dark:border-b-sky-700`, hover `dark:bg-sky-800 dark:border-sky-900` |
| Selected option (active filter) | `bg-sky-700 border-sky-900`; dark `dark:bg-sky-700 dark:border-b-sky-900`                                                                                                                         |
| Disabled button                 | `disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 disabled:border-b-gray-500`                                                                                              |
| Link                            | `text-sky-500 underline hover:text-sky-700`; current page `text-sky-700`                                                                                                                          |
| Keyboard focus                  | `focus:outline-4 focus:outline-offset-1 focus:outline-sky-500`                                                                                                                                    |
| Table header                    | `bg-sky-200`; dark `dark:bg-white/5`                                                                                                                                                              |
| Hover on rows                   | `hover:bg-sky-100`; dark `dark:hover:bg-sky-500`                                                                                                                                                  |
| Hover on menu items and pages   | `hover:bg-sky-500 hover:text-white`                                                                                                                                                               |
| Accent rule                     | `border-sky-400` (the line under the header)                                                                                                                                                      |

### Patient status

| Status   | Table row                                                     | Legend swatch                                  | Toggle when on                                    |
| -------- | ------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| Accepted | `bg-green-100`; dark `dark:bg-emerald-300 dark:text-gray-900` | `text-green-200`; dark `dark:text-emerald-300` | `has-checked:bg-green-500`, knob `ring-green-500` |
| Refused  | `bg-red-100`; dark `dark:bg-rose-300 dark:text-gray-900`      | `text-red-200`; dark `dark:text-rose-300`      | `has-checked:bg-red-500`, knob `ring-red-500`     |
| Pending  | No fill                                                       | Outline icon in the current text colour        | n/a                                               |

- A toggle that is off is `bg-gray-300` with a white knob (`ring-gray-300`); dark `dark:bg-white/5 dark:ring dark:ring-gray-600`.
- Status rows switch to dark text in dark mode (`dark:text-gray-900`) because the emerald and rose fills are light.
- Condition flags (asthma, DM, CVD, COPD): present is green (`text-green-500` in the table), absent is `text-gray-400`.

### Feedback

Show messages with `AlertComponent` from `@cdm-optimiser/ui` rather than styling them by hand. Each type uses one hue: `border-l-4` with `bg-<hue>-50`, `border-<hue>-400`, icon `text-<hue>-400` and text `text-<hue>-800`.

| Type    | Hue      | Notes                                           |
| ------- | -------- | ----------------------------------------------- |
| Info    | `sky`    | Default type                                    |
| Success | `green`  | The auto-dismiss progress bar is `bg-green-400` |
| Warning | `yellow` | Text is `text-yellow-700`                       |
| Error   | `red`    |                                                 |

Alerts keep their pale tints in dark mode: dark text on a light tint stays readable, so they have no `dark:` variants.

### Known gaps

These are system-wide issues, recorded here so new work doesn't spread them. Fix them in one place through the bug-fix plan, not component by component; until then, new UI uses the recipes above so screens stay consistent.

- **Contrast.** White text on `bg-sky-500` (primary buttons) is 2.71:1 and `text-sky-500` links on white are 2.71:1, below the WCAG AA 4.5:1 for normal text. `sky-700` reaches 5.85:1. Muted `gray-400` icons (2.60:1) and green condition icons (2.22:1) are below the 3:1 minimum for meaningful graphics.
- **Inconsistencies.** The patient card uses `text-green-400` for present conditions (the table uses `text-green-500`) and `text-gray-40`, a typo for `text-gray-400`. The pending-patient buttons use a darker hover (`bg-sky-700`, no bottom border) than the primary button recipe.

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
