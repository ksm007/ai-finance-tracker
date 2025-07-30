# Wealth Wizard 💰

A modern, AI-powered personal finance management application built with Next.js 15, featuring intelligent transaction tracking, budget management, and financial insights.

## ✨ Features

### 🔍 **Advanced Analytics**

- AI-powered spending pattern analysis
- Detailed financial insights and recommendations
- Interactive charts and visualizations with Recharts

### 📱 **Smart Receipt Scanner**

- Automatic data extraction from receipts using AI
- Seamless transaction categorization
- Receipt storage and management

### 💳 **Multi-Account Support**

- Manage multiple bank accounts and credit cards
- Support for Current and Savings account types
- Default account management

### 📊 **Budget Planning**

- Intelligent budget creation and tracking
- Monthly expense monitoring
- Budget alerts and notifications

### 🌍 **Multi-Currency Support**

- Real-time currency conversion
- International transaction handling

### 🔄 **Recurring Transactions**

- Automated recurring income/expense tracking
- Flexible intervals (Daily, Weekly, Monthly, Yearly)
- Smart scheduling and processing

### 🎨 **Modern UI/UX**

- Dark/Light theme support
- Responsive design with Tailwind CSS
- Beautiful UI components with Radix UI
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database

- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Supabase** - Database hosting and management

### Authentication & Security

- **Clerk** - Complete authentication solution
- **Arcjet** - Security and bot protection
- **Middleware** - Route protection

### AI & Integrations

- **Google Generative AI** - AI-powered insights
- **Resend** - Email notifications
- **React Email** - Email templates
- **Inngest** - Background job processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finance_tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up

   # Database
   DATABASE_URL="your_postgresql_connection_string"
   DIRECT_URL="your_direct_postgresql_connection_string"

   # Security
   ARCJET_KEY=your_arcjet_key

   # Email
   RESEND_API_KEY=your_resend_api_key

   # AI
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── actions/              # Server actions
│   ├── accounts.js       # Account management
│   ├── budget.js         # Budget operations
│   ├── dashboard.js      # Dashboard data
│   ├── transaction.js    # Transaction handling
│   └── send-email.js     # Email notifications
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Main application pages
│   ├── api/             # API routes
│   └── lib/             # Utility libraries
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── ...              # Feature-specific components
├── data/                # Static data and configurations
├── emails/              # Email templates
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run email` - Email development server

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User profiles and authentication
- **Accounts** - Bank accounts and financial accounts
- **Transactions** - Income and expense records
- **Budgets** - Budget planning and tracking

## 🔐 Authentication

Wealth Wizard uses Clerk for authentication, providing:

- Email/password authentication
- Social login options
- User profile management
- Session management
- Route protection

## 🛡️ Security

- **Arcjet** integration for bot protection and security
- Route-based middleware protection
- Input validation with Zod schemas
- Secure database queries with Prisma

## 📧 Email Notifications

- Budget alerts and notifications
- Transaction confirmations
- Monthly financial summaries
- Custom email templates with React Email

## 🎯 Key Features in Detail

### Dashboard

- Overview of all accounts and balances
- Recent transaction history
- Budget progress tracking
- Financial insights and trends

### Transaction Management

- Add income and expense transactions
- Categorize transactions automatically
- Upload and manage receipts
- Set up recurring transactions

### Budget Management

- Create monthly budgets
- Track spending against budgets
- Receive alerts when approaching limits
- Visual budget progress indicators

### Account Management

- Add multiple bank accounts
- Set default accounts
- Track account balances
- Account-specific transaction filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Icons from Lucide React
- Charts powered by Recharts
- Authentication by Clerk
- Database management with Prisma

---

**Wealth Wizard** - Your one-stop solution for all financial management needs! 🚀
