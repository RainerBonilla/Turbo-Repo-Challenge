# Task Management Web App

A modern task management application built with Next.js, TypeScript, and Tailwind CSS. This frontend connects to a NestJS backend API to provide full CRUD functionality for task management.

## Features

### Task Management

- ✅ Create new tasks with title, description, status, priority, due date, and assignee
- ✅ View all tasks in a responsive grid layout
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation dialog
- ✅ View detailed task information

### Filtering & Sorting

- 🔍 Filter tasks by status (pending, in-progress, completed)
- 🔍 Filter tasks by priority (low, medium, high)
- 🔍 Filter tasks by assignee name
- 🔄 Sort tasks by due date, priority, or creation date
- 🏷️ Visual filter indicators with easy removal

### Statistics Dashboard

- 📊 Real-time task statistics
- 📈 Visual breakdown by status and priority
- 📋 Progress bars showing distribution
- 🔢 Total task count

### User Experience

- 🎨 Modern, responsive design with Tailwind CSS
- ⚡ Fast loading with skeleton states
- 🚨 Comprehensive error handling
- 📱 Mobile-friendly interface
- ♿ Accessibility considerations

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **API**: RESTful API calls to NestJS backend
- **State Management**: React hooks with custom hooks
- **Type Safety**: Zod schemas for API validation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Running NestJS backend server on port 8000

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the web directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Integration

The app connects to the following backend endpoints (all prefixed with `/api`):

- `GET /api/tasks` - Fetch tasks with optional filters and sorting
- `GET /api/tasks/:id` - Fetch a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats` - Get task statistics

## Project Structure

```
apps/web/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── TaskCard.tsx       # Individual task display
│   ├── TaskForm.tsx       # Create/edit task form
│   ├── TaskFilters.tsx    # Filtering and sorting controls
│   ├── TaskStats.tsx      # Statistics dashboard
│   ├── TaskManager.tsx    # Main application component
│   └── DeleteConfirmationDialog.tsx
├── lib/                   # Utilities and shared code
│   ├── api.ts            # API client and types
│   └── hooks/
│       └── useTasks.ts   # Custom React hooks
└── .env.local            # Environment variables
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)
- Zod schemas for runtime validation

## Features in Detail

### Task Creation & Editing

- Form validation with real-time feedback
- Date picker for due dates
- Dropdown selections for status and priority
- Optional fields clearly marked

### Task Display

- Card-based layout with key information
- Status and priority badges with color coding
- Action buttons for edit/delete
- Responsive grid that adapts to screen size

### Filtering System

- Multiple filter criteria that can be combined
- Active filter tags with individual removal
- Clear all filters option
- Real-time filter application

### Statistics

- Automatic refresh when tasks change
- Visual progress bars
- Color-coded categories
- Total count summary

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Update component documentation
4. Test API integrations thoroughly
5. Ensure responsive design works on all screen sizes

## License

This project is part of a code challenge and is not licensed for external use.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
