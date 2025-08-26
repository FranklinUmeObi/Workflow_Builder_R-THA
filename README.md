# Workflow Builder

A focused workflow builder UI for creating underwriting flows. Built with React + TypeScript, this tool provides a clean canvas interface for designing simple decision workflows with drag-and-drop functionality.

## How To Run

```bash
# Navigate to the UI directory
cd ui

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **React Flow Canvas**: Includes minimap, controls, and background grid
- **Dual-Mode Palette**: Both drag-and-drop and click-to-add node creation
- **Click-to-Connect**: Two-click connection system with visual feedback
- **Inline Node Editing**: Direct editing with expandable configuration panels
- **Real-time Validation**: Live validation with popover error details
- **JSON Export**: Complete workflow export with metadata

## Key Decisions & Alternatives

### Canvas Library: React Flow vs Alternatives

**Chose**: React Flow (@xyflow/react)

- **Pros**: Mature ecosystem, built-in minimap/controls, excellent TypeScript support
- **Cons**: Larger bundle size, opinionated styling
- **Alternative**: Custom canvas with D3.js
  - **Pros**: Full control, smaller bundle, custom interactions
  - **Cons**: Much more development time, reinventing zoom/pan/selection (wasnt in scope but a number of other features too)

### State Management: Context + Hooks vs External Library

**Chose**: React Context with custom hooks (flow-provider.tsx)

- **Pros**: No external dependencies, type-safe, co-located with components
- **Cons**: More boilerplate, potential re-render issues at scale
- **Alternative**: Zustand or Redux Toolkit
  - **Pros**: Better performance, devtools, established patterns
  - **Cons**: Additional dependency, learning curve, overkill for this scope

### Node Creation: Dual Mode vs Single Mode

**Chose**: Both drag-and-drop AND click-to-add

- **Pros**: Accommodates different user preferences, faster for power users
- **Cons**: More complex implementation, potential UX confusion
- **Alternative**: Drag-only or click-only
  - **Pros**: Simpler code, consistent interaction model
  - **Cons**: Less flexible, may not match user expectations

### Validation Approach: Real-time vs On-Demand

**Chose**: Real-time validation with non-blocking UI

- **Pros**: Immediate feedback, prevents invalid states, better UX
- **Cons**: More complex state management, potential performance impact
- **Alternative**: Validate only on export/save
  - **Pros**: Simpler implementation, better performance
  - **Cons**: Late error discovery, frustrating user experience

## Implementation Details

### Architecture

- **React Flow**: Provides canvas, minimap, controls, and background
- **Custom Node Components**: StartNode, StepNode, DecisionNode, EndNode with inline editing
- **Provider Pattern**: WorkflowBuilderProvider manages all state and operations
- **Custom Hooks**: Specialized hooks for node editing, validation, and shortcuts
- **TypeScript**: Full type safety with custom node/edge interfaces

### Notable Features Implemented

- **Auto-positioning**: Smart node placement to avoid overlaps
- **Edge Auto-labeling**: Decision nodes automatically get "yes/no" labels
- **Connection Validation**: Prevents invalid connections based on node types
- **Visual Feedback**: Drop zones, pending connections, validation badges

## Development Time

**Total**: ~4 hours (18:20 - 22:30)

## What I'd Do Next

### Immediate Improvements

- **Undo/Redo**: Essential for workflow editing confidence
- **Keyboard Shortcuts**: Delete key (just backspace for now), copy/paste, selection shortcuts
- **Custom Edge Labels**: Visual indicators for decision branch conditions + surfacing actions like delete as a utton is better ui

### Enhanced Functionality

- **Node Templates**: Pre-configured Step and Decision templates for common use cases
- **Workflow Validation**: More sophisticated validation rules and error messaging (implemented a rough first pass)
- **Import/Export**: Support for importing existing workflows and multiple export formats
- **Auto-Layout**: Smart positioning suggestions for cleaner workflow organization that can be used on demand

### Production Readiness

- **Testing**: Unit tests for core workflow logic and integration tests
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Virtualization for large workflows, optimized re-renders
- **Backend Integration**: API endpoints for workflow persistence and execution

## Technical Debt & Compromises

### What Was Simplified

- **No Undo/Redo**: Would require command pattern or state history
- **Basic Error Handling**: No retry logic or graceful degradation
- **Limited Keyboard Support**: Only backspace key, missing copy/paste/select-all
- **No Persistence**: Everything is in-memory, lost on refresh
- **Minimal Testing**: No unit tests or integration tests implemented
- **Skipped requirements**: rief outlines no panning or zooming. React flow has it by default so didnt think disabling it to fit brief made sense

### Performance Considerations

- **Re-render Optimization**: Could benefit from React memo on node components
- **Large Workflow Handling**: No virtualization for 100+ node workflows
- **Bundle Size**: React Flow adds ~200KB, could be tree-shaken better
