# 💰 Personal Finance Management App

A modern, feature-rich personal finance management application built with Angular 20, designed to help users track their income, expenses, and financial goals with powerful analytics and intuitive user interface.

## 🚀 Features

### 📊 Transaction Management
- **Add/Edit/Delete Transactions**: Create and manage income and expense transactions
- **Category System**: Organize transactions with predefined and custom categories
- **Real-time Updates**: Instant synchronization across the application
- **Data Persistence**: Local storage using IndexedDB for offline capability

### 📈 Analytics Dashboard
- **Monthly Overview Charts**: Visual representation of income vs expenses over time
- **Category-based Spending Analysis**: Pie charts showing expense distribution by category
- **Balance Tracking**: Real-time balance calculations and trends
- **Highest Transaction Alerts**: Identify your biggest expenses with fun notifications
- **Date Range Filtering**: Analyze specific time periods

### 👤 User Management
- **Authentication System**: Secure login and registration
- **Role-based Access**: User and admin roles with different permissions
- **Profile Management**: User profile creation and management

### ⚙️ Admin Panel
- **User Administration**: Manage application users (admin only)
- **Category Management**: Add, edit, and delete transaction categories
- **System Overview**: Monitor application usage and statistics

### 🎨 Modern UI/UX
- **Dark Theme**: Elegant dark mode with gradient backgrounds
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material Design**: Using Angular Material and PrimeNG components
- **Tailwind CSS**: Utility-first CSS framework for consistent styling

## 🛠️ Technology Stack

### Frontend Framework
- **Angular 20.2.0** - Latest Angular framework
- **TypeScript 5.9.2** - Type-safe JavaScript
- **RxJS 7.8.0** - Reactive programming with Observables

### UI Libraries
- **Angular Material 20.2.1** - Material Design components
- **PrimeNG 20.1.2** - Rich UI component library
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **PrimeIcons 7.0.0** - Icon library

### Data Visualization
- **AG-Grid 34.2.0** - Advanced data grid for transaction display
- **AG-Charts 12.2.0** - Professional charting library for analytics

### Data Storage
- **IndexedDB** - Client-side storage via `idb 8.0.3`
- **Local Storage** - Session and user preference storage

### Development Tools
- **Angular CLI 20.3.1** - Command line interface
- **Karma + Jasmine** - Testing framework
- **Prettier** - Code formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.x or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (will be installed with project dependencies)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Araden14/efrei_angular_financeapp.git
   cd efrei_angular_financeapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

The application will automatically reload when you make changes to the source files.

## 📖 Usage

### Getting Started
1. **Register an Account**: Create a new user account or login with existing credentials
2. **Add Your First Transaction**: Use the transaction form to add income or expenses
3. **Explore Categories**: Choose from predefined categories or create custom ones (admin)
4. **View Analytics**: Check the analytics dashboard for insights into your spending patterns

### Main Features

#### Transaction Management
- Click the "+" button to add new transactions
- Select transaction type (Income/Expense)
- Choose or create categories
- Set amounts and dates
- Add descriptions for better tracking

#### Analytics Dashboard
- View monthly income vs expense trends
- Analyze spending by category
- Track your balance over time
- Identify spending patterns and highest expenses

#### Admin Features (Admin Role Required)
- Manage system users
- Create, edit, and delete categories
- Monitor application usage

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── guards/          # Route guards (auth, admin)
│   │   └── home/            # Home component
│   ├── features/            # Feature modules
│   │   ├── admin/           # Admin panel
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── auth/            # Authentication system
│   │   ├── indexdb/         # Database services
│   │   ├── navbar/          # Navigation component
│   │   └── transactions/    # Transaction management
│   ├── shared/              # Shared components and utilities
│   ├── data/                # Static data and models
│   └── utils/               # Utility functions
├── assets/                  # Static assets
└── environments/            # Environment configurations
```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm test
# or
ng test

# Run tests with coverage
ng test --coverage

# Run tests in watch mode
ng test --watch
```

## 🔨 Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Build and watch for changes
npm run watch

# Run linting
ng lint

# Format code with Prettier
npx prettier --write src/**/*.{ts,html,css,scss}
```

## 🏗️ Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory. The production build is optimized for performance and includes:
- Code minification and tree-shaking
- Ahead-of-Time (AOT) compilation
- Service worker for caching (if configured)

## 🐛 Troubleshooting

### Common Issues

**Build Errors Related to Fonts**
If you encounter font loading errors during build:
- Check internet connection for Google Fonts
- Consider using local font files for offline development

**IndexedDB Issues**
- Clear browser storage if experiencing data persistence issues
- Check browser compatibility for IndexedDB support

**Angular Material Theme Issues**
- Ensure custom theme files are properly imported
- Check for conflicting CSS styles

### Development Tips
- Use browser DevTools for debugging
- Check the console for error messages
- Use Angular DevTools extension for component debugging

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Angular style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Use Prettier for code formatting

## 📱 Browser Support

This application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security

- User authentication with JWT tokens
- Role-based access control
- Client-side data validation
- Secure local storage practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Araden14** - *Initial work* - [GitHub Profile](https://github.com/Araden14)

## 🙏 Acknowledgments

- Built with [Angular](https://angular.io/)
- UI components from [Angular Material](https://material.angular.io/) and [PrimeNG](https://primeng.org/)
- Charts powered by [AG-Charts](https://charts.ag-grid.com/)
- Icons from [Material Icons](https://material.io/icons/) and [PrimeIcons](https://primefaces.org/primeicons/)

## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Check the existing documentation
- Review the troubleshooting section above

---

**Happy budgeting! 💰✨**
