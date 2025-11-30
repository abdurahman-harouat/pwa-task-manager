# 🚀 Quick Reference Guide

## Installation & Running

```bash
# Install dependencies
npm install

# Development (auto-opens http://localhost:3000)
npm start

# Production build
npm run build
```

---

## Project Structure at a Glance

```
src/
├── components/
│   ├── TaskManager.js          ← Main app
│   └── ui/                     ← Reusable components
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Dialog.jsx
│       ├── Badge.jsx
│       ├── Card.jsx
│       └── index.js
├── lib/
│   └── utils.js                ← Helper: cn()
├── App.js
├── index.js
└── styles.css
```

---

## Using UI Components

### Import
```javascript
import { Button, Input, Card, Badge } from './components/ui';
// or
import { Button } from './components/ui/Button';
```

### Examples

#### Button
```jsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

#### Input
```jsx
<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email..." />
<Input type="password" placeholder="Password..." />
```

#### Select
```jsx
<Select 
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ]}
/>
```

#### Badge
```jsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
```

#### Card
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

---

## Tailwind CSS Cheat Sheet

### Spacing
```
m-4 (margin)
p-6 (padding)
mt-2 (margin-top)
pl-4 (padding-left)
```

### Colors
```
bg-primary (background)
text-foreground (text)
border-border (borders)
hover:bg-primary/90 (hover state)
```

### Layout
```
flex items-center justify-between
grid grid-cols-3 gap-4
w-full h-screen
```

### Responsive
```
sm:grid-cols-2  (small screens)
md:grid-cols-3  (medium screens)
lg:grid-cols-4  (large screens)
```

### Utilities
```
rounded-lg (border radius)
shadow-md (shadows)
animate-fade-in (animations)
line-through (text decoration)
opacity-50 (opacity)
```

---

## Common Patterns

### Task Reducer (State Management)
```javascript
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'DELETE_TASK':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

const [tasks, dispatch] = useReducer(taskReducer, []);

// Usage
dispatch({ type: 'ADD_TASK', payload: newTask });
```

### useEffect for Storage
```javascript
// Load from storage
useEffect(() => {
  const stored = localStorage.getItem('key');
  if (stored) dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
}, []);

// Save to storage
useEffect(() => {
  localStorage.setItem('key', JSON.stringify(data));
}, [data]);
```

### Conditional Styling
```javascript
import { cn } from '../lib/utils';

<div className={cn(
  'base styles',
  condition && 'conditional styles',
  variant === 'primary' && 'primary styles'
)}>
  Content
</div>
```

---

## Task Data Structure

```javascript
{
  id: 1701234567890,
  title: "Task title",
  status: "todo" | "in-progress" | "done",
  priority: "low" | "medium" | "high",
  completed: false,
  createdAt: "2024-11-29T10:30:00Z",
  completedAt: null
}
```

---

## Key Keyboard Shortcuts

| Action | Keys |
|--------|------|
| Add task | Enter (in input) |
| Navigate | Tab |
| Focus | Click or Tab |

---

## CSS Variables (Theme)

```css
:root {
  --background: HSL value
  --foreground: HSL value
  --primary: HSL value
  --secondary: HSL value
  --destructive: HSL value
  --muted: HSL value
  --accent: HSL value
  --border: HSL value
  --input: HSL value
  --ring: HSL value
}
```

---

## Debugging Tips

1. **Check Console**: Open DevTools (F12)
2. **Storage**: Check Application → Local Storage
3. **Network**: Check if offline mode works
4. **Styles**: Inspect elements to see Tailwind classes
5. **React**: Use React DevTools extension

---

## Performance Tips

1. ✅ Use `React.memo()` for heavy components
2. ✅ Lazy load images with `<img loading="lazy">`
3. ✅ Keep state updates minimal
4. ✅ Use CSS variables for theme switching
5. ✅ Leverage Tailwind's purging

---

## Common Issues & Solutions

### Styles not applying?
- Clear cache: `Ctrl+Shift+R` (Chrome)
- Rebuild: Kill server and `npm start` again

### Tasks not saving?
- Check localStorage in DevTools
- Verify JSON serialization in console
- Check for localStorage quota errors

### Select dropdown not working?
- Ensure options have `value` and `label`
- Check z-index if hidden behind other elements

### Components not showing?
- Verify imports are correct
- Check className syntax (use `cn()` for dynamic classes)
- Check parent container width/height

---

## File Modification Checklist

When adding features:
- [ ] Update `taskReducer` if new state needed
- [ ] Add UI component if needed
- [ ] Update `TaskManager.js` 
- [ ] Test in browser
- [ ] Check mobile responsiveness
- [ ] Verify localStorage persistence
- [ ] Test offline mode
- [ ] Update README if breaking changes

---

## Links & Resources

- 📖 [React Docs](https://react.dev)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- 🎛️ [Radix UI](https://www.radix-ui.com)
- 🔧 [Lucide Icons](https://lucide.dev)
- 📱 [PWA Docs](https://developer.mozilla.org/docs/Web/Progressive_web_apps)

---

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm start` to see the app
3. Create a feature branch for new work
4. Follow the patterns above
5. Test thoroughly
6. Commit and push

**Ready to build awesome features! 🚀**
