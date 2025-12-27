# GitHub Copilot Instructions for Kaiser von Deutschland

## Project Overview
Kaiser von Deutschland is a comprehensive historical kingdom simulation game built with TypeScript, featuring extensive role-playing from year 0 to the future. This project emphasizes historical accuracy, multiplayer capabilities, and modular architecture.

## Core Development Rules

### TypeScript Standards
- **ALWAYS** use `strict` mode in TypeScript
- **ALWAYS** define explicit types for all function parameters and return values
- **NEVER** use `any` type unless absolutely necessary (prefer `unknown` if type is truly unknown)
- Use type aliases and interfaces for better code documentation
- Leverage TypeScript utility types (Partial, Required, Pick, Omit, etc.)
- Use const assertions for literal types where appropriate

### Code Style
- Use **single quotes** for strings
- Prefer **const** over let when variables won't be reassigned
- Use arrow functions for callbacks and short functions
- Use meaningful, descriptive variable and function names in German or English
- Follow German naming conventions for game-specific terms (e.g., Bürger, König, etc.)
- Use JSDoc comments for public APIs and complex logic
- Maximum line length: 120 characters

### Documentation Requirements
- **ALWAYS** update relevant documentation when adding new features
- Document all public APIs with JSDoc comments including:
  - Purpose/description
  - @param tags for all parameters
  - @returns tag for return values
  - @throws tag for potential errors
  - @example tag for complex functions
- Update README.md when adding major features
- Update ARCHITECTURE.md when modifying system structure
- Keep API_REFERENCE.md in sync with code changes

### Architecture Principles
- **Modularity**: Keep systems separate and loosely coupled
- **Data-Driven**: Use JSON files for configuration and game data
- **Type Safety**: Leverage TypeScript's type system fully
- **Performance**: Consider performance implications, especially for large-scale simulations
- **Multiplayer-Ready**: Design all features with multiplayer in mind from the start
- Use dependency injection where appropriate
- Follow SOLID principles

### File Organization
```
src/
├── core/          # Core game logic and systems
├── ui/            # User interface components
├── data/          # Game data and definitions
│   └── json/      # JSON data files
├── utils/         # Utility functions and helpers
└── main.ts        # Application entry point
```

### Naming Conventions
- **Files**: PascalCase for classes/types (e.g., `CitizenSystem.ts`)
- **Classes**: PascalCase (e.g., `class CitizenManager`)
- **Interfaces**: PascalCase with descriptive names (e.g., `interface CitizenData`)
- **Types**: PascalCase (e.g., `type ProfessionType`)
- **Functions**: camelCase (e.g., `function calculateBirthRate()`)
- **Variables**: camelCase (e.g., `const currentPopulation`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `const MAX_CITIZENS = 10000`)
- **Private members**: Use private keyword, not underscore prefix

### Error Handling
- Use try-catch blocks for error-prone operations
- Throw specific error types with descriptive messages
- Log errors appropriately (console.error for actual errors, console.warn for warnings)
- Validate input parameters at function boundaries
- Handle async errors with proper Promise rejection handling

### Testing
- Write unit tests for new functionality using Vitest
- Test edge cases and error conditions
- Aim for high code coverage on core systems
- Use descriptive test names that explain what is being tested
- Mock external dependencies appropriately

### Performance Considerations
- Avoid unnecessary re-renders in UI components
- Use efficient data structures (Maps/Sets over Objects/Arrays when appropriate)
- Implement lazy loading for large datasets
- Consider using Web Workers for heavy computations
- Profile performance-critical code paths
- Cache expensive calculations when possible

### Scalability Requirements (CRITICAL)
- **Population Limits**: Design systems to scale from 10,000 to 10,000,000 citizens
- **Configurable Thresholds**: Use configuration objects for all scalability limits
- **Aggregation Strategy**: When population > 100,000, use statistical aggregation instead of individual simulation
- **Sampling**: For social interactions (relationships, information spread), sample a subset of the population
- **Spatial Partitioning**: Use quadtrees, grids, or regions to partition large populations
- **Event Batching**: Batch similar events together to reduce processing overhead
- **Lazy Evaluation**: Don't calculate values until they're needed for display or decision-making
- **Resource Pooling**: Reuse objects instead of creating/destroying them repeatedly
- **Performance Monitoring**: Include performance metrics and warnings when thresholds are exceeded
- **Degradation Strategy**: Automatically reduce simulation detail when performance suffers
- **Economic Scaling**: Scale economic calculations to work with both small kingdoms and empires
- **Military Scaling**: Support both small skirmishes (10s of units) and massive battles (100,000+ units)
- **Data Structures**: Use Map/Set for O(1) lookups, avoid O(n²) algorithms for large datasets
- **Memory Management**: Implement cleanup for old/irrelevant data to prevent memory leaks

### Multiplayer Development
- Design all systems with multiplayer synchronization in mind
- Ensure all game state is serializable
- Use event-driven architecture for state changes
- Implement optimistic UI updates where appropriate
- Handle network latency and disconnections gracefully

### PixiJS Integration
- Use PixiJS for all graphical visualizations
- Organize PixiJS code in separate rendering modules
- Dispose of PixiJS resources properly to prevent memory leaks
- Use sprite sheets for better performance
- Implement proper scaling for different screen sizes

### Database and Data Management
- **ALWAYS** expand database schemas when adding new features
- Use JSON Schema for data validation where appropriate
- Maintain backward compatibility when updating data formats
- Document all data structures and their purposes
- Use TypeScript interfaces that match JSON structure

### Responsive Design
- Design for mobile-first, then enhance for desktop and tablet
- Use flexible layouts that adapt to different screen sizes
- Test on multiple device sizes
- Optimize touch interactions for mobile devices
- Ensure text is readable on all screen sizes

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits focused on a single change
- Reference issue numbers in commits when applicable
- Don't commit build artifacts or dependencies
- Use .gitignore properly

### Security
- Never commit secrets or API keys
- Validate all user input
- Sanitize data before rendering (prevent XSS)
- Use secure communication protocols for multiplayer
- Implement proper authentication and authorization for multiplayer features

### Accessibility
- Use semantic HTML elements
- Provide keyboard navigation support
- Include ARIA labels where appropriate
- Ensure sufficient color contrast
- Support screen readers

## Feature-Specific Guidelines

### Population Dynamics (v2.1.5)
- Each citizen must have unique ID, name, age, profession, and needs
- Implement efficient algorithms for large populations (100,000+ citizens)
- Use spatial hashing or quadtrees for regional organization
- Batch updates for performance
- Cache frequently accessed citizen data
- **Scalable Population System**:
  - Below 10,000: Full individual simulation
  - 10,000-100,000: Hybrid (detailed for important citizens, aggregated for others)
  - Above 100,000: Statistical aggregation with representative sampling
  - Use population density maps instead of tracking every individual location
  - Aggregate similar citizens into demographic cohorts for bulk calculations

### Historical Accuracy
- Cross-reference historical events with Wikipedia integration
- Maintain chronological consistency
- Document sources for historical data
- Allow for "alternate history" scenarios while marking them as such

### KI Integration
- Support both local and remote KI services
- Implement fallback mechanisms when KI is unavailable
- Cache KI responses appropriately
- Rate limit KI API calls to prevent abuse

## Common Patterns

### Event System
```typescript
interface GameEvent {
  type: string;
  timestamp: number;
  data: unknown;
}

class EventEmitter {
  private listeners: Map<string, Function[]>;
  
  on(event: string, callback: Function): void { /* ... */ }
  emit(event: string, data: unknown): void { /* ... */ }
}
```

### Data Loading
```typescript
// Prefer async loading for large datasets
async function loadGameData<T>(path: string): Promise<T> {
  const response = await fetch(path);
  return await response.json() as T;
}
```

### State Management
```typescript
// Use immutable updates for state
const newState = {
  ...oldState,
  property: newValue
};
```

## Dependencies Management
- Keep dependencies up to date
- Audit dependencies for security vulnerabilities regularly
- Prefer well-maintained, popular libraries
- Document why each dependency is needed
- Minimize dependency count

## Build and Deployment
- Ensure code passes TypeScript type checking (`npm run check`)
- Build successfully before committing (`npm run build`)
- Test in development mode (`npm run dev`)
- Optimize for production builds
- Use appropriate source maps for debugging

## Collaboration
- Be responsive to code review feedback
- Ask questions when requirements are unclear
- Share knowledge through documentation
- Help onboard new contributors
- Respect existing code patterns and conventions

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [PixiJS Documentation](https://pixijs.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/guide/)

---

**Remember**: Quality over quantity. Write code that is maintainable, testable, and well-documented. The goal is to create a living, breathing historical simulation that can scale to millions of citizens while remaining performant and enjoyable to play.
