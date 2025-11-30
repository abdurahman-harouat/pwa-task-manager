# PWA Task Manager - Professional Edition

A modern, professional task management application built with React, featuring a beautiful Kanban board interface and shadcn UI styling. Perfect for organizing your tasks with full offline support.

## 🚀 Features

### Core Features
- **Kanban Board**: Visual task management with three columns (To Do, In Progress, Done)
- **Drag & Drop**: Intuitive drag-and-drop interface for moving tasks between columns
- **Priority Levels**: Set tasks as High, Medium, or Low priority
- **Task Status**: Organize tasks by their current status
- **Filtering**: Filter tasks by priority and status
- **Sorting**: Sort tasks by creation date or priority
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Quick Stats**: Dashboard with key metrics (Total, Completed, In Progress, High Priority)

### Technical Features
- **PWA Support**: Works offline with service workers
- **Local Storage**: Automatic data persistence in browser
- **RTL Support**: Full Arabic language support with right-to-left layout
- **Online/Offline Detection**: Visual indicator for connection status
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Dark Mode Ready**: Built-in dark mode support through CSS variables
- **Professional UI**: shadcn/ui styled components with Tailwind CSS

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## 🎨 Component Library

The project includes a complete shadcn-inspired UI component library:

- **Button**: Multiple variants (default, secondary, destructive, outline, ghost)
- **Input**: Text input with full styling
- **Select**: Custom dropdown component
- **Badge**: Status badges with multiple variants
- **Card**: Container components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Dialog**: Modal dialog for confirmations

## 🛠️ Configuration

### Tailwind CSS
- Located in `tailwind.config.js`
- Custom color scheme with CSS variables
- Supports light and dark modes

### PostCSS
- Configured in `postcss.config.js`
- Integrates Tailwind CSS processing

### Webpack
- Main config in `webpack.config.js`
- Configured with PostCSS loader for Tailwind support
- Includes service worker generation for PWA

## 📁 Project Structure

```
src/
├── components/
│   ├── TaskManager.js       # Main task management component
│   └── ui/                  # UI component library
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Dialog.jsx
│       ├── Badge.jsx
│       └── Card.jsx
├── lib/
│   └── utils.js            # Utility functions (cn helper)
├── styles.css              # Global styles with Tailwind
├── App.js                  # Root component
└── index.js                # Entry point
```

## 🎯 Usage

### Adding a Task
1. Enter task title in the input field
2. Select priority (Low, Medium, High)
3. Select initial status (To Do, In Progress, Done)
4. Click "Add Task" or press Enter

### Managing Tasks
- **Mark Complete**: Click the circle icon next to a task
- **Move Task**: Drag and drop between columns
- **Delete Task**: Click the trash icon and confirm
- **Filter**: Use the priority dropdown to filter tasks
- **Sort**: Choose sorting option (Latest First or By Priority)

### View Progress
- The progress bar shows completion percentage
- Quick stats cards display key metrics
- Each column shows the task count

## 🔧 Environment Setup

### Package Dependencies
Main dependencies:
- `react` & `react-dom`: UI framework
- `lucide-react`: Icon library
- `@radix-ui/*`: Headless UI primitives
- `tailwindcss`: CSS framework
- `clsx` & `tailwind-merge`: Utility functions

Dev dependencies:
- Webpack and loaders for bundling
- Babel for JavaScript transpilation
- PostCSS for CSS processing
- Workbox for service worker generation

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💾 Data Persistence

Tasks are automatically saved to browser localStorage. They persist across:
- Page refreshes
- Browser restarts
- Offline usage (with PWA installed)

## 🌙 Dark Mode

The app automatically respects system dark mode preference. CSS variables in `src/styles.css` handle the theming:

```css
:root { /* Light mode */ }
.dark { /* Dark mode */ }
```

## 📱 PWA Installation

Install the app on your device:
- Desktop: Look for install prompt in the browser
- Mobile: Add to Home Screen from browser menu

Once installed, the app works completely offline with full functionality.

## 📄 License

MIT

## 🤝 Contributing

Feel free to customize and enhance this project! The component library makes it easy to add new features.

## 🎓 Learning Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Documentation](https://react.dev)
- [PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
