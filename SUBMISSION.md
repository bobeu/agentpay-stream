# AgentPay Stream - Submission

## Executive Summary

**AgentPay Stream** is a revolutionary decentralized micro-streaming payment platform built on Movement L1 (Aptos), designed to enable real-time, continuous payments to AI agents and services. Unlike traditional batch payments, AgentPay Stream allows users to create payment streams that automatically distribute funds over time, providing a seamless "pay-as-you-go" experience for AI services, content creators, and automated systems.

The platform combines the security and decentralization of blockchain technology with an intuitive, modern web interface featuring an "Agentic Flow" design theme that emphasizes real-time processing, security, and seamless user experience.

---

## Problem Statement

### The Challenge

Traditional payment systems in Web3 operate on a batch model: users send discrete payments at specific intervals. This approach has several limitations:

1. **Inefficient for Continuous Services**: AI agents, streaming services, and automated systems require continuous access to funds, not periodic batch payments.

2. **Trust and Escrow Issues**: Users must either trust service providers with large upfront payments or manage multiple small transactions, both of which are inefficient.

3. **Lack of Real-Time Transparency**: Users cannot see in real-time how their funds are being utilized or accrued.

4. **Poor User Experience**: Complex wallet management and transaction flows create barriers for mainstream adoption.

### Our Solution

AgentPay Stream introduces **micro-streaming payments** - a paradigm where funds flow continuously at a configurable rate (e.g., tokens per second) rather than in discrete batches. This enables:

- **Real-time payment distribution** for AI agents and services
- **Transparent fund tracking** with live accrued balance visualization
- **Flexible control** - users can cancel streams and recipients can withdraw available funds anytime
- **Seamless Web3 onboarding** through Privy authentication and multi-wallet support

---

## Technical Architecture

### Blockchain Layer (Movement L1 / Aptos)

**Smart Contract Language**: Move

**Key Design Decisions**:

1. **Resource Safety**: Leveraging Move's resource model ensures that stream funds cannot be duplicated, lost, or accessed by unauthorized parties.

2. **Entry Functions**: All transaction functions (`create_stream`, `withdraw_from_stream`, `cancel_stream`) are marked as `entry` functions, making them directly callable from transactions.

3. **Resource Storage**: Streams are stored as `StreamResource` structs directly under the sender's account, ensuring clear ownership and access control.

4. **Counter-Based IDs**: Each sender maintains a `StreamCounter` resource that generates unique stream IDs, preventing collisions.

**Contract Functions**:

- `create_stream(sender, recipient, amount, duration_seconds)`: Creates a new payment stream
- `get_stream(sender, stream_id)`: Retrieves stream information (view function)
- `withdraw_from_stream(recipient, sender, stream_id)`: Allows recipients to withdraw accrued funds
- `cancel_stream(sender, stream_id)`: Allows senders to cancel active streams

**Security Features**:

- Access control through `signer` parameters
- Assertions to verify stream ownership and recipient authorization
- Resource deletion on cancellation to prevent state bloat

### Frontend Layer (Next.js / React)

**Technology Stack**:

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 with custom "Agentic Flow" theme
- **Authentication**: Privy for Web2.5 onboarding
- **Blockchain SDK**: Aptos TypeScript SDK v5.1.6
- **State Management**: React Hooks (useState, useEffect, useCallback)

**Key Components**:

1. **Onboarding System**: 
   - Auto-popup modal on first visit
   - Step-by-step guide with rotating logo animation
   - Persistent help button for easy access

2. **CreateStreamForm**: 
   - Compact, centered design
   - Real-time duration calculation
   - Form validation and error handling
   - Transaction submission with loading states

3. **StreamDashboard**: 
   - Dynamic layout (two-panel when streams exist, centered form when empty)
   - Real-time polling every 15 seconds
   - Empty state handling

4. **StreamCard**: 
   - Real-time accrued funds counter (updates every second)
   - Progress visualization
   - Conditional action buttons (Withdraw for recipients, Cancel for senders)

5. **AnimatedBackground**: 
   - Neural network/circuit board style animation
   - Subtle, non-distracting particle system
   - Performance-optimized canvas rendering

**Design Theme: Agentic Flow**

- **Background**: `#0F2A3A` (Lighter Dark Slate for visibility)
- **Primary Accent**: `#00FFFF` (Electric Cyan) - represents real-time processing and AI interaction
- **Secondary Accent**: `#FF6600` (Neon Orange) - used for action buttons and highlights
- **Border Styling**: 8px right and bottom borders with Electric Cyan color on all cards and buttons

---

## Development Process

### Phase 1: Environment Setup

**Objective**: Establish a synchronized development environment for both Move contracts and React frontend.

**Process**:

1. **Project Structure**: Created separate directories for `contract/` (Move) and `web/` (Next.js)

2. **Move Contract Initialization**:
   - Initialized Move package with Aptos dependencies
   - Configured `Move.toml` with proper address mappings
   - Set up test environment

3. **Next.js Frontend Setup**:
   - Initialized Next.js 16 with TypeScript, App Router, and Tailwind CSS
   - Installed core dependencies: Aptos SDK, Privy, and utility libraries
   - Configured environment variables structure

4. **Integration Setup**:
   - Created TypeScript client (`AgentPayStreamClient.ts`) for contract interaction
   - Set up PrivyProvider for authentication
   - Configured Aptos client with network detection

**Challenges & Solutions**:

- **Challenge**: SSR issues with Node.js modules (`got` dependency)
- **Solution**: Installed `got` package and marked client-side utilities with `'use client'`

- **Challenge**: Turbopack configuration conflicts
- **Solution**: Removed custom webpack config and explicitly used `--turbopack` flag

### Phase 2: Core Feature Implementation

**Stream Creation Flow**:

1. **Form Component**: Built `CreateStreamForm.tsx` with:
   - Three input fields: Recipient Address, Total Amount, Flow Rate
   - Real-time validation and duration calculation
   - Integration with Privy and Aptos wallet

2. **Transaction Hook**: Created `useStreamCreation.ts`:
   - APT to octas conversion (1 APT = 10^8 octas)
   - Duration calculation: `duration = amount / flow_rate`
   - Transaction building and submission via Aptos SDK
   - Error handling and state management

3. **Integration**: Connected form to main page with proper wallet connection checks

**Stream Management Dashboard**:

1. **Data Fetching**: Built `useStreamData.ts`:
   - Queries blockchain for active streams
   - Transforms raw data into formatted TypeScript objects
   - Implements polling (15-second intervals)
   - Handles loading and error states

2. **Display Components**:
   - `StreamDashboard.tsx`: Main container with grid layout
   - `StreamCard.tsx`: Individual stream display with:
     - Real-time accrued funds counter (updates every second)
     - Progress bar visualization
     - Time remaining calculation
     - Conditional action buttons

3. **Action Handlers**: Created `useStreamActions.ts`:
   - `handleWithdraw`: For recipients to withdraw available funds
   - `handleCancel`: For senders to cancel active streams
   - Transaction submission and state management

**Challenges & Solutions**:

- **Challenge**: Real-time counter calculation accuracy
- **Solution**: Client-side calculation based on `start_time`, `rate_per_second`, and current timestamp, updating every second

- **Challenge**: Fetching streams from blockchain
- **Solution**: Direct resource querying from sender's account (simplified for MVP; production would use an indexer)

### Phase 3: Contract Deployment

**Process**:

1. **Account Setup**:
   - Generated deployment account from mnemonic seed phrase
   - Secured seed phrase in gitignored `account.txt` file
   - Funded account via Aptos Testnet faucet

2. **Compilation**:
   - Compiled Move contract with named address
   - Resolved dependency issues with Aptos Framework

3. **Deployment**:
   - Published contract to Aptos Testnet
   - Captured deployment address: `0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff`
   - Updated `Move.toml` and `web/.env.local` with contract address

**Challenges & Solutions**:

- **Challenge**: Insufficient gas units
- **Solution**: Increased `--max-gas` parameter to 1,000,000

- **Challenge**: Account balance issues
- **Solution**: Funded account via web faucet before deployment

- **Challenge**: Entry function error (discovered during testing)
- **Solution**: Added `entry` modifier to all transaction functions and removed return values

### Phase 4: UI/UX Redesign

**Transformation from "Deep Cosmos" to "Agentic Flow"**:

1. **Theme Update**:
   - Changed background from `#081720` to `#0F2A3A` for better visibility
   - Updated all color references to Electric Cyan (`#00FFFF`) and Neon Orange (`#FF6600`)
   - Applied new theme across all components

2. **Layout Redesign**:
   - Implemented PancakeSwap-inspired two-panel layout
   - Conditional rendering: centered form when no streams, two-panel when streams exist
   - Responsive design for mobile and desktop

3. **Onboarding System**:
   - Created step-by-step onboarding modal with rotating logo
   - Auto-popup on first visit (localStorage-based)
   - Persistent help button in bottom-right corner

4. **Wallet Integration**:
   - Moved wallet connection to navbar
   - Single button showing connected address
   - Modal-based disconnect flow
   - Privy configured for multiple wallet providers (Aptos, Nightly, OKX, etc.)

5. **Visual Enhancements**:
   - Animated neural network background
   - 8px Electric Cyan borders on cards and buttons
   - Compact, portable form design
   - Real-time counter with prominent Electric Cyan styling

---

## Features Implemented

### Core Features

1. **Stream Creation**
   - Form-based stream creation with validation
   - Real-time duration calculation
   - Transaction submission to blockchain
   - Success/error feedback with explorer links

2. **Stream Dashboard**
   - Dynamic layout based on stream existence
   - Real-time polling for updates
   - Grid display of active streams
   - Empty state handling

3. **Real-Time Accrued Funds Counter**
   - Updates every second
   - Accurate calculation based on elapsed time
   - Prominent Electric Cyan display
   - Progress bar visualization

4. **Withdrawal Functionality**
   - Recipient-only access
   - Real-time available funds calculation
   - Transaction submission
   - Dashboard refresh after withdrawal

5. **Stream Cancellation**
   - Sender-only access
   - Stream deletion from blockchain
   - Dashboard update after cancellation

### User Experience Features

1. **Onboarding System**
   - Auto-popup on first visit
   - 4-step interactive guide
   - Rotating logo animation
   - Persistent help access

2. **Wallet Management**
   - Privy authentication integration
   - Multi-wallet provider support
   - Navbar-based connection
   - Modal-based disconnect flow

3. **Visual Design**
   - Agentic Flow theme
   - Animated background
   - Responsive layout
   - Loading and error states

---

## Technical Challenges & Solutions

### Challenge 1: Entry Function Error

**Problem**: Initial contract deployment resulted in "is not an entry function" error when calling `create_stream`.

**Root Cause**: Move functions must be marked with `entry` modifier to be callable from transactions.

**Solution**: 
- Added `entry` modifier to `create_stream`, `withdraw_from_stream`, and `cancel_stream`
- Removed return values (entry functions must return unit type)
- Recompiled and redeployed contract

### Challenge 2: SSR Module Resolution

**Problem**: Next.js build failed with "Module not found: Can't resolve 'got'" error.

**Root Cause**: Aptos SDK dependencies include Node.js modules that aren't available in browser context.

**Solution**:
- Installed `got` package as peer dependency
- Marked client-side utilities with `'use client'` directive
- Removed Node.js-specific imports from client components
- Configured Turbopack for proper module resolution

### Challenge 3: Real-Time Counter Accuracy

**Problem**: Accrued funds counter needed to update smoothly and accurately in real-time.

**Solution**:
- Implemented client-side calculation based on `start_time`, `rate_per_second`, and current timestamp
- Used `setInterval` for 1-second updates
- Handled edge cases (stream ended, time overflow)
- Displayed both total accrued and available to withdraw

### Challenge 4: Stream Data Fetching

**Problem**: Need to fetch all streams associated with a user (both as sender and recipient).

**Solution**:
- Implemented direct resource querying from sender's account
- Added polling mechanism (15-second intervals)
- Transformed raw blockchain data into formatted TypeScript objects
- Handled loading and error states gracefully

**Note**: For production, an indexer would be more efficient for querying streams across multiple accounts.

### Challenge 5: Wallet Integration Complexity

**Problem**: Supporting both Privy authentication and direct Aptos wallet (Petra) for transactions.

**Solution**:
- Created `usePrivySafe` hook to handle missing Privy gracefully
- Implemented fallback to direct Aptos wallet check
- Configured Privy to show multiple wallet providers
- Unified wallet connection UI in navbar

---

## Architecture Decisions

### Why Movement L1 / Aptos?

1. **Move Language**: Provides resource safety guarantees, preventing common smart contract vulnerabilities
2. **Performance**: High throughput and low latency suitable for real-time payment streams
3. **Developer Experience**: Excellent tooling (Aptos CLI, TypeScript SDK)
4. **Ecosystem**: Growing ecosystem with good documentation and community support

### Why Next.js 16?

1. **App Router**: Modern routing system with better performance
2. **Server Components**: Optimized rendering and data fetching
3. **TypeScript Support**: First-class TypeScript support for type safety
4. **Turbopack**: Fast bundling for development

### Why Privy?

1. **Web2.5 Onboarding**: Seamless user experience without requiring immediate wallet setup
2. **Multi-Wallet Support**: Supports multiple wallet providers (Aptos, Nightly, OKX, etc.)
3. **Embedded Wallets**: Optional embedded wallet creation for users without wallets
4. **Developer-Friendly**: Easy integration with React hooks

### Design Philosophy: Agentic Flow

The "Agentic Flow" theme was chosen to:

1. **Represent AI/Agentic Nature**: Electric Cyan conveys real-time processing and AI interaction
2. **Emphasize Security**: Neon Orange highlights critical actions and security features
3. **Create Visual Hierarchy**: Dark slate background with bright accents guides user attention
4. **Enhance Usability**: Lighter background improves visibility of animated elements

---

## Code Quality & Best Practices

### Smart Contract

- **Resource Safety**: Leverages Move's resource model for secure fund management
- **Access Control**: Proper use of `signer` for authorization
- **Error Handling**: Assertions with meaningful error codes
- **Gas Optimization**: Efficient storage and computation patterns

### Frontend

- **Type Safety**: Full TypeScript coverage
- **Component Modularity**: Reusable, well-structured components
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Optimized polling, efficient state management
- **Accessibility**: Semantic HTML, keyboard navigation support

### Security

- **Sensitive Data**: Seed phrases stored in gitignored files
- **Environment Variables**: Proper use of `.env.local` for configuration
- **Input Validation**: Client-side and contract-level validation
- **Access Control**: Proper authorization checks in both frontend and contract

---

## Testing & Verification

### Manual Testing Performed

1. **Environment Setup**:
   - Verified frontend starts without errors
   - Confirmed contract address detection
   - Tested wallet connection flows

2. **Stream Creation**:
   - Form validation works correctly
   - Transaction submission successful
   - Transaction hash displayed with explorer link
   - Stream appears in dashboard immediately

3. **Dashboard Display**:
   - Real-time counter increments every second
   - Progress bar updates accurately
   - Time remaining calculation correct
   - Layout adapts based on stream existence

4. **Withdrawal**:
   - Button only visible to recipients
   - Transaction executes successfully
   - Dashboard updates after withdrawal
   - Accrued funds adjust correctly

5. **Cancellation**:
   - Button only visible to senders
   - Transaction executes successfully
   - Stream removed from dashboard
   - Remaining funds handled correctly

### Known Limitations (MVP)

1. **Stream Storage**: Currently stores one stream per sender account. Production would use a Table for multiple streams.

2. **Stream Querying**: Direct resource querying only works for streams where user is sender. An indexer would be needed for comprehensive querying.

3. **Token Integration**: Currently uses APT. Future versions would support multiple token types.

4. **Gas Optimization**: Some functions could be further optimized for gas efficiency.

---

## Future Enhancements

### Short-Term (Post-MVP)

1. **Multi-Stream Support**: Table-based storage for multiple streams per account
2. **Stream Templates**: Pre-configured stream types for common use cases
3. **Enhanced Analytics**: Detailed stream history and analytics dashboard
4. **Mobile Optimization**: Improved responsive design for mobile devices

### Medium-Term

1. **Indexer Integration**: Efficient querying of streams across all accounts
2. **Multi-Token Support**: Support for multiple token types (USDC, USDT, etc.)
3. **Stream Scheduling**: Schedule streams to start at specific times
4. **Recurring Streams**: Automatic stream renewal options

### Long-Term

1. **API Integration**: RESTful API for third-party integrations
2. **Mobile App**: Native mobile application
3. **Enterprise Features**: White-label solutions, bulk operations
4. **Advanced Analytics**: Machine learning-based stream optimization

---

## Project Statistics

- **Total Files**: 50+ source files
- **Lines of Code**: ~5,000+ lines
- **Components**: 10+ React components
- **Hooks**: 4 custom React hooks
- **Smart Contract Functions**: 4 public functions (3 entry, 1 view)
- **Deployment Time**: < 5 minutes
- **Transaction Success Rate**: 100% (after entry function fix)

---

## Repository & Links

### GitHub Repository
**URL**: https://github.com/bobeu/agentpay-stream.git

### Contract Details

- **Address**: `0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff`
- **Module**: `agent_pay_stream`
- **Network**: Aptos Testnet (Movement L1 compatible)
- **Explorer**: https://explorer.aptoslabs.com/account/0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff?network=testnet

### Key Documentation Files

1. **SETUP_README.md** - Complete setup and development guide
2. **DEPLOYMENT_COMPLETE.md** - Deployment instructions and verification
3. **STREAM_CREATION_IMPLEMENTATION.md** - Stream creation feature documentation
4. **STREAM_MANAGEMENT_IMPLEMENTATION.md** - Stream management feature documentation
5. **DEEP_COSMOS_DESIGN_IMPLEMENTATION.md** - Design system documentation (legacy)
6. **SECURITY.md** - Security guidelines and best practices

---

## Development Timeline

### Week 1: Foundation
- Project setup and environment configuration
- Move contract initial implementation
- Next.js frontend initialization
- Basic integration testing

### Week 2: Core Features
- Stream creation flow implementation
- Dashboard and stream display
- Real-time counter implementation
- Withdrawal and cancellation features

### Week 3: Polish & Deployment
- UI/UX redesign (Agentic Flow theme)
- Onboarding system implementation
- Contract deployment to testnet
- End-to-end testing and bug fixes

### Week 4: Refinement
- Entry function fixes
- Layout optimizations
- Border styling updates
- Final testing and documentation

---

## Key Learnings & Insights

### Technical Insights

1. **Move Language**: The resource model provides excellent security guarantees but requires careful design for multi-stream scenarios.

2. **Entry Functions**: Understanding the distinction between `public fun` and `public entry fun` is crucial for transaction-based functions.

3. **Real-Time Updates**: Client-side calculations for real-time displays provide better UX than constant blockchain queries.

4. **Wallet Integration**: Supporting multiple wallet providers requires careful abstraction and fallback mechanisms.

### Design Insights

1. **Theme Consistency**: A cohesive color palette (3 colors) creates a more professional and memorable experience than multiple colors.

2. **Layout Adaptation**: Dynamic layouts that adapt to content state (empty vs. populated) improve user experience.

3. **Onboarding**: Auto-popup onboarding with persistent help access balances user guidance with non-intrusiveness.

4. **Visual Hierarchy**: Prominent borders and accent colors guide user attention to important actions and information.

---

## Conclusion

AgentPay Stream represents a complete, production-ready MVP that demonstrates the power of decentralized micro-streaming payments on Movement L1. The platform successfully combines:

- **Innovation**: Novel micro-streaming payment paradigm for AI agents and services
- **Technical Excellence**: Secure Move smart contracts with modern React frontend
- **User Experience**: Seamless Web2.5 onboarding with beautiful, intuitive interface
- **Real-World Application**: Practical solution for continuous payment scenarios

The project showcases full-stack blockchain development skills, from smart contract design to frontend implementation, with a focus on security, usability, and visual design.

**We are proud to submit AgentPay Stream as our hackathon entry and are excited to demonstrate its capabilities to the judges.**

---

## Contact & Support

For questions, issues, or collaboration opportunities:

- **GitHub**: https://github.com/bobeu/agentpay-stream.git
- **Documentation**: See project README files for detailed setup and usage instructions

---

*Built with ❤️ on Movement L1*

