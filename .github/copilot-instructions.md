# Project Spectre - Copilot Instructions

## Project Overview
A React + TypeScript personal dashboard application ("Operative OS") for tracking physical, tactical, and intellectual progression.

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS v4 for styling
- Zustand for state management
- Framer Motion for animations
- Recharts for data visualization
- Lucide React for icons

## Code Style Guidelines
- Use TypeScript for all components
- Follow functional component patterns with hooks
- Use Zustand store for global state (`useOperativeStore`)
- Data persists to localStorage automatically
- Use Tailwind utility classes for styling
- Apply glassmorphism effects using the `.glass` utility class
- Use emerald-500 (#10b981) as the primary accent color
- Use monospace fonts (JetBrains Mono / Space Mono)

## Component Structure
- All components are in `src/components/`
- State management in `src/store/`
- Static data in `src/data/`

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
