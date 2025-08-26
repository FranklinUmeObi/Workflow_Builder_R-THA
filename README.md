# Workflow_Builder_R-THA

This is a simple workflow builder uilt in React & Typescript

## How To Run

Clone this package.

```bash
cd ui
```

Install dependancies

```bash
npm install
```

Start dev server on local host

```bash
npm run dev
```

## Decisions

### Core decisions

- Vite bundler for speed
- Hero UI for modern styling with tailwind
- React Flow For canvas logic
- HTML DnD api for out of the ox drag an drop with minimal overhead
- Placed Palette in a side bar for customer experience as that is an established pattern. (top could be better based on workflow size which was not specified)
-

### Decision log

This section is a running self monologue of the decisions
I made as I worked on teh project capturing how my thoughts changed
as I worked on this solution.

```
- Could setup project in a few ways, As this is a small simple project I dont need SSR (server side rendering) or Next JS or any other heavy duty heavy boiler plate fluff. Vite has fast build times and is supported by most boiler plate ui libraries.
- Speaking of UI libraries I recently used HeroUI for a side project and seemed pretty good. will try it out for this.
- Debating if I want to have pallette be above or beside the canvas. I think a more fluid experience would be beside.
- Going to use react flow for canvas
- Set up canvas logic first to make sure I can work with simple default nodes
- Added drag and drop logic for default nodes to make sure it works for easy use cases
- Going to work on the 4 custom nodes now that the core product works
- Wasnt sure if node editing should be inline, a second drawer, a modal or something else. If I was a customer of this product I would want to be ale to do things inline so I went with that option. Requirements also hint at inline editing when they say 'tiny config editor'
- 
```

## Trade Offs

## Time spent

- Started at 18:20

## What I Would do next
